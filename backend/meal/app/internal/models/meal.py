from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY


class Meal(SQLModel, table=True):
    __tablename__ = "meals"
    
    id: str = Field(default=None, primary_key=True)
    restaurant_id: str = Field(nullable=False)
    name: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    is_available: bool = Field(default=True)
    price: float = Field(nullable=False)
    image_url: Optional[str] = Field(default=None)
    cuisine: Optional[str] = Field(default=None)
    complementary_ids: Optional[list[str]] = Field(default=None, sa_column=Column(ARRAY(String)))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        from_attributes = True