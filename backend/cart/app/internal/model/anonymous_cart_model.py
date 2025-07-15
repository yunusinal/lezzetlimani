from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class AnonymousCartItem(BaseModel):
    """Anonymous cart item model for Redis storage"""
    cart_id: str
    restaurant_id: str
    meal_id: str
    quantity: int = 1
    note: Optional[str] = None
    schedule_date: Optional[datetime] = None
    created_at: datetime
    
    @classmethod
    def create(cls, cart_id: str, restaurant_id: str, meal_id: str, 
               quantity: int = 1, note: Optional[str] = None, 
               schedule_date: Optional[datetime] = None) -> "AnonymousCartItem":
        """Create a new anonymous cart item"""
        return cls(
            cart_id=cart_id,
            restaurant_id=restaurant_id,
            meal_id=meal_id,
            quantity=quantity,
            note=note,
            schedule_date=schedule_date,
            created_at=datetime.now()
        )
    
    def to_dict(self) -> dict:
        """Convert to dictionary for Redis storage"""
        data = self.model_dump()
        # Convert datetime to ISO string for JSON serialization
        if data.get('created_at'):
            data['created_at'] = data['created_at'].isoformat()
        if data.get('schedule_date'):
            data['schedule_date'] = data['schedule_date'].isoformat()
        return data
    
    @classmethod
    def from_dict(cls, data: dict) -> "AnonymousCartItem":
        """Create from dictionary (Redis data)"""
        # Convert ISO strings back to datetime
        if data.get('created_at') and isinstance(data['created_at'], str):
            data['created_at'] = datetime.fromisoformat(data['created_at'])
        if data.get('schedule_date') and isinstance(data['schedule_date'], str):
            data['schedule_date'] = datetime.fromisoformat(data['schedule_date'])
        return cls(**data)

class AnonymousCart(BaseModel):
    """Anonymous cart container"""
    cart_id: str
    items: list[AnonymousCartItem] = []
    created_at: datetime
    updated_at: datetime
    restaurant_id: Optional[str] = None  # Single restaurant constraint
    
    @classmethod
    def create(cls, cart_id: Optional[str] = None) -> "AnonymousCart":
        """Create a new anonymous cart"""
        if not cart_id:
            cart_id = str(uuid.uuid4())
        
        now = datetime.now()
        return cls(
            cart_id=cart_id,
            items=[],
            created_at=now,
            updated_at=now
        )
    
    def add_item(self, restaurant_id: str, meal_id: str, quantity: int = 1, 
                 note: Optional[str] = None, schedule_date: Optional[datetime] = None) -> bool:
        """Add item to cart"""
        # Check if cart is empty or same restaurant
        if self.restaurant_id and self.restaurant_id != restaurant_id:
            return False  # Different restaurant not allowed
        
        # Set restaurant_id if first item
        if not self.restaurant_id:
            self.restaurant_id = restaurant_id
        
        # Check if item already exists
        for item in self.items:
            if item.meal_id == meal_id:
                item.quantity += quantity
                item.updated_at = datetime.now()
                self.updated_at = datetime.now()
                return True
        
        # Add new item
        new_item = AnonymousCartItem.create(
            cart_id=self.cart_id,
            restaurant_id=restaurant_id,
            meal_id=meal_id,
            quantity=quantity,
            note=note,
            schedule_date=schedule_date
        )
        self.items.append(new_item)
        self.updated_at = datetime.now()
        return True
    
    def remove_item(self, meal_id: str) -> bool:
        """Remove item from cart"""
        self.items = [item for item in self.items if item.meal_id != meal_id]
        self.updated_at = datetime.now()
        
        # Clear restaurant_id if no items left
        if not self.items:
            self.restaurant_id = None
        
        return True
    
    def update_item(self, meal_id: str, quantity: Optional[int] = None, 
                    note: Optional[str] = None, schedule_date: Optional[datetime] = None) -> bool:
        """Update item in cart"""
        for item in self.items:
            if item.meal_id == meal_id:
                if quantity is not None:
                    item.quantity = quantity
                if note is not None:
                    item.note = note
                if schedule_date is not None:
                    item.schedule_date = schedule_date
                self.updated_at = datetime.now()
                return True
        return False
    
    def clear(self):
        """Clear all items from cart"""
        self.items = []
        self.restaurant_id = None
        self.updated_at = datetime.now()
    
    def get_item_count(self) -> int:
        """Get total item count"""
        return sum(item.quantity for item in self.items)
    
    def to_dict(self) -> dict:
        """Convert to dictionary for Redis storage"""
        return {
            "cart_id": self.cart_id,
            "items": [item.to_dict() for item in self.items],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "restaurant_id": self.restaurant_id
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "AnonymousCart":
        """Create from dictionary (Redis data)"""
        items = [AnonymousCartItem.from_dict(item_data) for item_data in data.get("items", [])]
        
        return cls(
            cart_id=data["cart_id"],
            items=items,
            created_at=datetime.fromisoformat(data["created_at"]),
            updated_at=datetime.fromisoformat(data["updated_at"]),
            restaurant_id=data.get("restaurant_id")
        )