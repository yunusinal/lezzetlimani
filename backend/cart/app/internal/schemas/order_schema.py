from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrderItemSchema(BaseModel):
    meal_id: str
    quantity: int
    note: Optional[str] = None

class OrderCreateSchema(BaseModel):
    user_id: str
    restaurant_id: str
    items: List[OrderItemSchema]
    payment_method: str  # 'credit_card', 'cash', 'pos'
    coupon_code: Optional[str] = None

class OrderResponseSchema(BaseModel):
    id: int
    user_id: str
    restaurant_id: str
    items: List[OrderItemSchema]
    subtotal: float
    discount: float
    total: float
    payment_method: str
    coupon_code: Optional[str] = None
    created_at: datetime
    message: str 