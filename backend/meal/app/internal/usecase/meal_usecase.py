from app.internal.repository.meal_repo import MealRepository
from app.internal.models.meal import Meal
from sqlalchemy.ext.asyncio import AsyncSession

class MealUseCase:
    def __init__(self, db: AsyncSession):
        self.meal_repository = MealRepository(db)

    async def get_meals_by_restaurant_id(self, restaurant_id: str) -> list[Meal]:
        return await self.meal_repository.get_meals_by_restaurant_id(restaurant_id)

    async def create_meal(self, meal: Meal) -> Meal:
        return await self.meal_repository.create_meal(meal)

    async def get_meal_by_id(self, meal_id: str) -> Meal | None:
        return await self.meal_repository.get_meal_by_id(meal_id)

    async def update_meal(self, meal_id: str, meal_data: dict) -> Meal | None:
        return await self.meal_repository.update_meal(meal_id, meal_data)

    async def get_complementary_meals(self, meal_id: str):
        return await self.meal_repository.get_complementary_meals(meal_id)