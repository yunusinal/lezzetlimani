from app.internal.repository.redis_cart_repository import RedisCartRepository
from app.internal.repository.cart_repository import CartRepository
from app.internal.schemas.anonymous_cart_schema import (
    AnonymousCartCreateSchema,
    AnonymousCartUpdateSchema,
    AnonymousCartResponseSchema,
    AnonymousCartItemResponseSchema,
    CartMergeSchema,
    CartMergeResponseSchema,
    GenerateCartIdResponseSchema,
    AnonymousCartValidationSchema
)
from app.internal.schemas.cart_schema import CartItemCreateSchema
from app.internal.model.cart_model import CartItem
from app.core.redis_client import RedisClient
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class AnonymousCartUsecase:
    """Use case for managing anonymous carts"""
    
    def __init__(self, redis_client: RedisClient, db: Optional[AsyncSession] = None):
        self.redis_repository = RedisCartRepository(redis_client)
        self.cart_repository = CartRepository(db) if db else None
    
    async def generate_cart_id(self) -> GenerateCartIdResponseSchema:
        """Generate a new cart ID"""
        cart_id = str(uuid.uuid4())
        return GenerateCartIdResponseSchema(
            cart_id=cart_id,
            message="New cart ID generated"
        )
    
    async def add_to_anonymous_cart(self, data: AnonymousCartCreateSchema) -> AnonymousCartResponseSchema:
        """Add item to anonymous cart"""
        try:
            cart = await self.redis_repository.add_item_to_cart(
                cart_id=data.cart_id,
                restaurant_id=data.restaurant_id,
                meal_id=data.meal_id,
                quantity=data.quantity,
                note=data.note,
                schedule_date=data.schedule_date
            )
            
            return self._convert_cart_to_response(cart)
        
        except ValueError as e:
            logger.warning(f"Failed to add item to cart {data.cart_id}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error adding item to anonymous cart {data.cart_id}: {e}")
            raise
    
    async def get_anonymous_cart(self, cart_id: str) -> Optional[AnonymousCartResponseSchema]:
        """Get anonymous cart by ID"""
        try:
            cart = await self.redis_repository.get_cart(cart_id)
            if not cart:
                return None
            
            return self._convert_cart_to_response(cart)
        
        except Exception as e:
            logger.error(f"Error getting anonymous cart {cart_id}: {e}")
            return None
    
    async def update_anonymous_cart_item(self, cart_id: str, meal_id: str, 
                                       data: AnonymousCartUpdateSchema) -> Optional[AnonymousCartResponseSchema]:
        """Update item in anonymous cart"""
        try:
            cart = await self.redis_repository.update_cart_item(
                cart_id=cart_id,
                meal_id=meal_id,
                quantity=data.quantity,
                note=data.note,
                schedule_date=data.schedule_date
            )
            
            if not cart:
                return None
            
            return self._convert_cart_to_response(cart)
        
        except Exception as e:
            logger.error(f"Error updating anonymous cart item {cart_id}/{meal_id}: {e}")
            return None
    
    async def remove_from_anonymous_cart(self, cart_id: str, meal_id: str) -> Optional[AnonymousCartResponseSchema]:
        """Remove item from anonymous cart"""
        try:
            cart = await self.redis_repository.remove_item_from_cart(cart_id, meal_id)
            if not cart:
                return None
            
            return self._convert_cart_to_response(cart)
        
        except Exception as e:
            logger.error(f"Error removing item from anonymous cart {cart_id}/{meal_id}: {e}")
            return None
    
    async def clear_anonymous_cart(self, cart_id: str) -> Optional[AnonymousCartResponseSchema]:
        """Clear all items from anonymous cart"""
        try:
            cart = await self.redis_repository.clear_cart(cart_id)
            if not cart:
                return None
            
            return self._convert_cart_to_response(cart)
        
        except Exception as e:
            logger.error(f"Error clearing anonymous cart {cart_id}: {e}")
            return None
    
    async def validate_anonymous_cart(self, cart_id: str) -> AnonymousCartValidationSchema:
        """Validate anonymous cart and return status"""
        try:
            exists = await self.redis_repository.cart_exists(cart_id)
            if not exists:
                return AnonymousCartValidationSchema(
                    cart_id=cart_id,
                    is_valid=False,
                    exists=False,
                    item_count=0,
                    restaurant_id=None,
                    expires_at=None
                )
            
            cart = await self.redis_repository.get_cart(cart_id)
            ttl = await self.redis_repository.get_cart_ttl(cart_id)
            
            expires_at = None
            if ttl > 0:
                expires_at = datetime.now().timestamp() + ttl
                expires_at = datetime.fromtimestamp(expires_at)
            
            return AnonymousCartValidationSchema(
                cart_id=cart_id,
                is_valid=cart is not None,
                exists=True,
                item_count=cart.get_item_count() if cart else 0,
                restaurant_id=cart.restaurant_id if cart else None,
                expires_at=expires_at
            )
        
        except Exception as e:
            logger.error(f"Error validating anonymous cart {cart_id}: {e}")
            return AnonymousCartValidationSchema(
                cart_id=cart_id,
                is_valid=False,
                exists=False,
                item_count=0,
                restaurant_id=None,
                expires_at=None
            )
    
    async def merge_anonymous_cart_to_user(self, data: CartMergeSchema) -> CartMergeResponseSchema:
        """Merge anonymous cart to user cart"""
        if not self.cart_repository:
            raise Exception("Database session required for cart merging")
        
        try:
            # Get anonymous cart
            anonymous_cart = await self.redis_repository.get_cart(data.anonymous_cart_id)
            if not anonymous_cart or not anonymous_cart.items:
                return CartMergeResponseSchema(
                    message="Anonymous cart is empty or not found",
                    user_cart_items=[],
                    merged_items_count=0,
                    conflicts_resolved=0
                )
            
            # Get existing user cart items
            existing_items = await self.cart_repository.get_cart_items(data.user_id)
            existing_meal_ids = {item.meal_id for item in existing_items}
            
            merged_count = 0
            conflicts_resolved = 0
            
            # Process each anonymous cart item
            for anon_item in anonymous_cart.items:
                if anon_item.meal_id in existing_meal_ids:
                    # Handle conflict
                    conflicts_resolved += 1
                    if data.merge_strategy == "add_quantities":
                        # Find existing item and update quantity
                        for existing_item in existing_items:
                            if existing_item.meal_id == anon_item.meal_id:
                                existing_item.quantity += anon_item.quantity
                                await self.cart_repository.update_cart_item_quantity(
                                    data.user_id, anon_item.meal_id, existing_item.quantity
                                )
                                break
                    elif data.merge_strategy == "replace":
                        # Replace with anonymous cart item
                        await self.cart_repository.remove_from_cart(data.user_id, anon_item.meal_id)
                        await self._add_anon_item_to_user_cart(anon_item, data.user_id)
                else:
                    # Add new item
                    await self._add_anon_item_to_user_cart(anon_item, data.user_id)
                
                merged_count += 1
            
            # Get updated user cart
            updated_user_items = await self.cart_repository.get_cart_items(data.user_id)
            user_cart_items = [
                {
                    "id": item.id,
                    "meal_id": item.meal_id,
                    "restaurant_id": item.restaurant_id,
                    "quantity": item.quantity,
                    "note": item.note,
                    "schedule_date": item.schedule_date.isoformat() if item.schedule_date else None
                }
                for item in updated_user_items
            ]
            
            # Delete anonymous cart after successful merge
            await self.redis_repository.delete_cart(data.anonymous_cart_id)
            
            logger.info(f"Successfully merged anonymous cart {data.anonymous_cart_id} to user {data.user_id}")
            
            return CartMergeResponseSchema(
                message=f"Successfully merged {merged_count} items to user cart",
                user_cart_items=user_cart_items,
                merged_items_count=merged_count,
                conflicts_resolved=conflicts_resolved
            )
        
        except Exception as e:
            logger.error(f"Error merging anonymous cart {data.anonymous_cart_id} to user {data.user_id}: {e}")
            raise
    
    async def extend_cart_expiry(self, cart_id: str, days: int = 30) -> bool:
        """Extend cart expiry"""
        try:
            ttl_seconds = days * 24 * 60 * 60
            return await self.redis_repository.extend_cart_ttl(cart_id, ttl_seconds)
        except Exception as e:
            logger.error(f"Error extending cart expiry for {cart_id}: {e}")
            return False
    
    async def cleanup_expired_carts(self) -> dict:
        """Clean up expired anonymous carts"""
        try:
            cleanup_count = await self.redis_repository.cleanup_expired_carts()
            stats = await self.redis_repository.get_cart_stats()
            
            return {
                "cleaned_up": cleanup_count,
                "stats": stats
            }
        except Exception as e:
            logger.error(f"Error during cart cleanup: {e}")
            return {"cleaned_up": 0, "stats": {}}
    
    def _convert_cart_to_response(self, cart) -> AnonymousCartResponseSchema:
        """Convert cart model to response schema"""
        items = [
            AnonymousCartItemResponseSchema(
                cart_id=item.cart_id,
                restaurant_id=item.restaurant_id,
                meal_id=item.meal_id,
                quantity=item.quantity,
                note=item.note,
                schedule_date=item.schedule_date,
                created_at=item.created_at
            )
            for item in cart.items
        ]
        
        return AnonymousCartResponseSchema(
            cart_id=cart.cart_id,
            restaurant_id=cart.restaurant_id,
            items=items,
            item_count=cart.get_item_count(),
            created_at=cart.created_at,
            updated_at=cart.updated_at
        )
    
    async def _add_anon_item_to_user_cart(self, anon_item, user_id: str):
        """Helper to add anonymous cart item to user cart"""
        cart_item = CartItem(
            user_id=user_id,
            restaurant_id=anon_item.restaurant_id,
            meal_id=anon_item.meal_id,
            quantity=anon_item.quantity,
            note=anon_item.note,
            schedule_date=anon_item.schedule_date
        )
        await self.cart_repository.add_to_cart(cart_item)