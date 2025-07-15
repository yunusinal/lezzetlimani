from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.db import get_db
from app.internal.usecase.meal_usecase import MealUseCase
from app.internal.schema.meal_schema import (
    MealCreateSchema,
    MealResponseSchema
)
from app.internal.models.meal import Meal

router = APIRouter(prefix="/meals", tags=["Meals"])


@router.post("/", response_model=MealResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_meal(
    meal_data: MealCreateSchema,
    db: AsyncSession = Depends(get_db)
):
    usecase = MealUseCase(db)
    return await usecase.create_meal(meal_data)


@router.get("/{meal_id}", response_model=MealResponseSchema)
async def get_meal(meal_id: str, db: AsyncSession = Depends(get_db)):
    usecase = MealUseCase(db)
    meal = await usecase.get_meal_by_id(meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal


@router.get("/restaurant/{restaurant_id}", response_model=List[Meal])
async def get_meals_by_restaurant(restaurant_id: str, db: AsyncSession = Depends(get_db)):
    usecase = MealUseCase(db)
    return await usecase.get_meals_by_restaurant_id(restaurant_id)


@router.get("/{meal_id}/complementary", response_model=List[MealResponseSchema])
async def get_complementary_meals(meal_id: str, db: AsyncSession = Depends(get_db)):
    usecase = MealUseCase(db)
    return await usecase.get_complementary_meals(meal_id)

