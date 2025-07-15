from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CartItemCreateSchema(BaseModel):
    user_id: str
    restaurant_id: str
    meal_id: str
    quantity: int = 1   
    note: Optional[str] = None
    schedule_date: Optional[datetime] = None
    

class CartItemUpdateSchema(BaseModel):
    meal_id: str
    note: Optional[str] = None
    schedule_date: Optional[datetime] = None
    quantity: Optional[int] = None

class CartItemResponseSchema(BaseModel):
    id: int
    user_id: str
    restaurant_id: str
    meal_id: str
    quantity: int
    note: Optional[str]
    schedule_date: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True