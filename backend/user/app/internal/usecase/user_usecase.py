from typing import Optional
from app.internal.models.user import User
from app.internal.repository.user_repo import UserRepository
from app.internal.schema.user import UserCreateSchema
from app.internal.infra.redis.client import get_redis

class UserUsecase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        self.redis = get_redis()

    async def create_user(self, user_data: UserCreateSchema) -> User:
        is_pending = await self.redis.get(f"pending_user:{user_data.id}")
        if not is_pending:
            raise ValueError("Registration not allowed or expired")

        existing_user = await self.user_repository.get_user_by_id(user_data.id)
        if existing_user:
            raise ValueError("User already exists")

        user = User(
            id=user_data.id,
            full_name=user_data.full_name,
            born_date=user_data.born_date,
            gender=user_data.gender,
            phone=user_data.phone
        )
        new_user = await self.user_repository.create_user(user)
        await self.redis.delete(f"pending_user:{user_data.id}")
        return new_user

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        return await self.user_repository.get_user_by_id(user_id)
    
    async def update_user(self, user: User) -> User:
        existing_user = await self.user_repository.get_user_by_id(user.id)
        if not existing_user:
            raise ValueError("User not found")
        return await self.user_repository.update_user(user)
    
    async def delete_user(self, user: User) -> User:
        return await self.user_repository.delete_user(user)