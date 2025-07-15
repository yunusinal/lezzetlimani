from app.internal.models.favorite import FavoriteRestaurant, FavoriteCuisine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class FavoriteRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_favorite_restaurant(self, user_id: str, restaurant_id: str):
        fav = FavoriteRestaurant(user_id=user_id, restaurant_id=restaurant_id)
        self.db.add(fav)
        await self.db.commit()
        await self.db.refresh(fav)
        return fav

    async def remove_favorite_restaurant(self, user_id: str, restaurant_id: str):
        result = await self.db.execute(
            select(FavoriteRestaurant).where(
                FavoriteRestaurant.user_id == user_id,
                FavoriteRestaurant.restaurant_id == restaurant_id
            )
        )
        fav = result.scalar_one_or_none()
        if fav:
            await self.db.delete(fav)
            await self.db.commit()
        return fav

    async def add_favorite_cuisine(self, user_id: str, cuisine: str):
        fav = FavoriteCuisine(user_id=user_id, cuisine=cuisine)
        self.db.add(fav)
        await self.db.commit()
        await self.db.refresh(fav)
        return fav

    async def remove_favorite_cuisine(self, user_id: str, cuisine: str):
        result = await self.db.execute(
            select(FavoriteCuisine).where(
                FavoriteCuisine.user_id == user_id,
                FavoriteCuisine.cuisine == cuisine
            )
        )
        fav = result.scalar_one_or_none()
        if fav:
            await self.db.delete(fav)
            await self.db.commit()
        return fav 