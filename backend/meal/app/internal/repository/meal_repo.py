from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.internal.models.meal import Meal

class MealRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_meals_by_restaurant_id(self, restaurant_id: str) -> list[Meal]:
        query = select(Meal).where(Meal.restaurant_id == restaurant_id)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_meal(self, meal: Meal) -> Meal:
        self.db.add(meal)
        await self.db.commit()
        await self.db.refresh(meal)
        return meal

    async def get_meal_by_id(self, meal_id: str) -> Meal | None:
        query = select(Meal).where(Meal.id == meal_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update_meal(self, meal_id: str, meal_data: dict) -> Meal | None:
        meal = await self.get_meal_by_id(meal_id)
        if meal:
            for key, value in meal_data.items():
                setattr(meal, key, value)
            await self.db.commit()
            await self.db.refresh(meal)
        return meal

    async def get_complementary_meals(self, meal_id: str) -> list[Meal]:
        meal = await self.get_meal_by_id(meal_id)
        if not meal or not meal.complementary_ids:
            return []
        query = select(Meal).where(Meal.id.in_(meal.complementary_ids))
        result = await self.db.execute(query)
        return result.scalars().all() 