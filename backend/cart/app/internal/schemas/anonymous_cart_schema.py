from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class AnonymousCartCreateSchema(BaseModel):
    """Schema for creating anonymous cart items"""
    cart_id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    restaurant_id: str = Field(..., description="Restaurant ID")
    meal_id: str = Field(..., description="Meal ID")
    quantity: int = Field(default=1, ge=1, description="Quantity must be at least 1")
    note: Optional[str] = Field(None, max_length=500, description="Optional note")
    schedule_date: Optional[datetime] = Field(None, description="Optional scheduled date")

class AnonymousCartUpdateSchema(BaseModel):
    """Schema for updating anonymous cart items"""
    quantity: Optional[int] = Field(None, ge=1, description="New quantity")
    note: Optional[str] = Field(None, max_length=500, description="Updated note")
    schedule_date: Optional[datetime] = Field(None, description="Updated scheduled date")

class AnonymousCartItemResponseSchema(BaseModel):
    """Schema for anonymous cart item response"""
    cart_id: str
    restaurant_id: str
    meal_id: str
    quantity: int
    note: Optional[str]
    schedule_date: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class AnonymousCartResponseSchema(BaseModel):
    """Schema for anonymous cart response"""
    cart_id: str
    restaurant_id: Optional[str]
    items: List[AnonymousCartItemResponseSchema]
    item_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CartMergeSchema(BaseModel):
    """Schema for merging anonymous cart to user cart"""
    anonymous_cart_id: str = Field(..., description="Anonymous cart ID to merge")
    user_id: str = Field(..., description="Target user ID")
    merge_strategy: str = Field(
        default="add_quantities", 
        description="Strategy for handling duplicate items: 'add_quantities' or 'replace'"
    )

class CartMergeResponseSchema(BaseModel):
    """Schema for cart merge response"""
    message: str
    user_cart_items: List[dict]
    merged_items_count: int
    conflicts_resolved: int

class AnonymousCartClearSchema(BaseModel):
    """Schema for clearing anonymous cart"""
    cart_id: str = Field(..., description="Cart ID to clear")

class AnonymousCartRemoveItemSchema(BaseModel):
    """Schema for removing item from anonymous cart"""
    cart_id: str = Field(..., description="Cart ID")
    meal_id: str = Field(..., description="Meal ID to remove")

class GenerateCartIdResponseSchema(BaseModel):
    """Schema for cart ID generation response"""
    cart_id: str
    message: str

class AnonymousCartValidationSchema(BaseModel):
    """Schema for validating anonymous cart"""
    cart_id: str
    is_valid: bool
    exists: bool
    item_count: int
    restaurant_id: Optional[str]
    expires_at: Optional[datetime]