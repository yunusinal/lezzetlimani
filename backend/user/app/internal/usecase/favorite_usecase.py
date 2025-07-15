from app.internal.repository.favorite_repo import FavoriteRepository

class FavoriteUsecase:
    def __init__(self, repo: FavoriteRepository):
        self.repo = repo

    async def add_favorite_restaurant(self, user_id: str, restaurant_id: str):
        return await self.repo.add_favorite_restaurant(user_id, restaurant_id)

    async def remove_favorite_restaurant(self, user_id: str, restaurant_id: str):
        return await self.repo.remove_favorite_restaurant(user_id, restaurant_id)

    async def add_favorite_cuisine(self, user_id: str, cuisine: str):
        return await self.repo.add_favorite_cuisine(user_id, cuisine)

    async def remove_favorite_cuisine(self, user_id: str, cuisine: str):
        return await self.repo.remove_favorite_cuisine(user_id, cuisine) 