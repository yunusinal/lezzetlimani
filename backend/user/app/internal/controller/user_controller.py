from fastapi import APIRouter, HTTPException, status, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.internal.models.user import User
from app.internal.schema.user import UserCreateSchema
from app.internal.repository.user_repo import UserRepository
from app.internal.infra.redis.client import get_redis
from app.internal.schema.user import UserResponseSchema, UserUpdateSchema
from app.internal.usecase.user_usecase import UserUsecase
from redis.asyncio import Redis

router = APIRouter(prefix="/users")

@router.get("/health")
async def health():
    return {"status": "ok"} 

@router.get(
    "/me",
    summary="Get current user",
    description="Returns the current user's information",
    response_model=UserResponseSchema,
    status_code=status.HTTP_200_OK,
    tags=["User"]
)
async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    user_id = request.state.user_id
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_usecase = UserUsecase(UserRepository(db))
    user = await user_usecase.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.post(
    "/register/complete",
    summary="Complete user registration",
    description="Creates a new user if one does not already exist with the given ID.",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    tags=["User Registration"]
)
async def complete_registration(
    user_data: UserCreateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    
    """
    Completes the user registration.

    - **id**: Unique user ID from the auth service
    - **full_name**: User's full name
    - **email**: Email (optional if not passed again)
    """

    user_id = request.state.user_id

    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    redis_key = f"pending_user:{user_id}"
    exists = await redis.get(redis_key)
    if not exists:
        raise HTTPException(status_code=403, detail="Registration expired or invalid")

    repo = UserRepository(db)
    existing_user = await repo.get_user_by_id(user_id)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        id=user_id,
        full_name=user_data.full_name,
        phone=user_data.phone,
        gender=user_data.gender,
        born_date=user_data.born_date
    )
    new_user = await repo.create_user(user)
    await redis.delete(redis_key)

    return {"message": "User registration completed", "user": new_user}

@router.put(
    "/me", 
    summary="Update user profile",
    description="Updates the current user's profile",
    response_model=UserResponseSchema,
    status_code=status.HTTP_200_OK,
    tags=["User"]
)
async def update_current_user(
    user_update: UserUpdateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    user_id = request.state.user_id
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    user_usecase = UserUsecase(UserRepository(db))

    existing_user = await user_usecase.get_user_by_id(user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(existing_user, field, value)

    updated_user = await user_usecase.update_user(existing_user)
    return updated_user



