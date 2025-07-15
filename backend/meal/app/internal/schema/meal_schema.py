from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MealBase(BaseModel):
    name: str
    description: Optional[str] = None
    isAvailable: bool = True
    price: float
    image_url: Optional[str] = None
    cuisine: Optional[str] = None


class MealCreateSchema(MealBase):
    restaurant_id: int


class MealUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    isAvailable: Optional[bool] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    cuisine: Optional[str] = None


class MealResponseSchema(MealBase):
    id: int
    restaurant_id: int
    complementary_ids: Optional[list[str]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True