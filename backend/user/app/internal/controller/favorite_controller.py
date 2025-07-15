from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.internal.repository.favorite_repo import FavoriteRepository
from app.internal.usecase.favorite_usecase import FavoriteUsecase
from app.internal.schema.favorite import FavoriteRestaurantCreate, FavoriteCuisineCreate

router = APIRouter(prefix="/favorites")

def get_usecase(db: AsyncSession = Depends(get_db)):
    return FavoriteUsecase(FavoriteRepository(db))

@router.post("/restaurant")
async def add_favorite_restaurant(
    data: FavoriteRestaurantCreate,
    request: Request,
    usecase: FavoriteUsecase = Depends(get_usecase)
):
    user_id = request.state.user_id
    return await usecase.add_favorite_restaurant(user_id, data.restaurant_id)

@router.delete("/restaurant/{restaurant_id}")
async def remove_favorite_restaurant(
    restaurant_id: str,
    request: Request,
    usecase: FavoriteUsecase = Depends(get_usecase)
):
    user_id = request.state.user_id
    return await usecase.remove_favorite_restaurant(user_id, restaurant_id)

@router.post("/cuisine")
async def add_favorite_cuisine(
    data: FavoriteCuisineCreate,
    request: Request,
    usecase: FavoriteUsecase = Depends(get_usecase)
):
    user_id = request.state.user_id
    return await usecase.add_favorite_cuisine(user_id, data.cuisine)

@router.delete("/cuisine/{cuisine}")
async def remove_favorite_cuisine(
    cuisine: str,
    request: Request,
    usecase: FavoriteUsecase = Depends(get_usecase)
):
    user_id = request.state.user_id
    return await usecase.remove_favorite_cuisine(user_id, cuisine) 