from sqlmodel import Field, SQLModel, Column, TIMESTAMP
from datetime import datetime
from typing import Optional

class CartItem(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    restaurant_id: str = Field(index=True)
    meal_id: str = Field(index=True)
    quantity: int = Field(default=1)
    note: Optional[str] = Field(default="")
    schedule_date: Optional[datetime] = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True))) 
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        from_attributes = True

class Order(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    restaurant_id: str = Field(index=True)
    items: str = Field()  # JSON serialized list of items
    subtotal: float = Field()
    discount: float = Field(default=0)
    total: float = Field()
    payment_method: str = Field()
    coupon_code: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True
