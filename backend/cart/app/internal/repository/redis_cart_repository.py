from app.core.redis_client import RedisClient
from app.internal.model.anonymous_cart_model import AnonymousCart, AnonymousCartItem
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

class RedisCartRepository:
    """Repository for managing anonymous carts in Redis"""
    
    def __init__(self, redis_client: RedisClient):
        self.redis = redis_client
        self.cart_prefix = "cart:anon:"
        self.default_ttl = 30 * 24 * 60 * 60  # 30 days in seconds
    
    def _get_cart_key(self, cart_id: str) -> str:
        """Generate Redis key for cart"""
        return f"{self.cart_prefix}{cart_id}"
    
    async def create_cart(self, cart_id: str) -> AnonymousCart:
        """Create a new anonymous cart"""
        cart = AnonymousCart.create(cart_id)
        cart_key = self._get_cart_key(cart_id)
        
        success = await self.redis.set(cart_key, cart.to_dict(), ttl=self.default_ttl)
        if not success:
            raise Exception(f"Failed to create cart in Redis: {cart_id}")
        
        logger.info(f"Created anonymous cart: {cart_id}")
        return cart
    
    async def get_cart(self, cart_id: str) -> Optional[AnonymousCart]:
        """Get anonymous cart by ID"""
        cart_key = self._get_cart_key(cart_id)
        cart_data = await self.redis.get(cart_key)
        
        if not cart_data:
            return None
        
        try:
            return AnonymousCart.from_dict(cart_data)
        except Exception as e:
            logger.error(f"Failed to deserialize cart {cart_id}: {e}")
            return None
    
    async def save_cart(self, cart: AnonymousCart) -> bool:
        """Save cart to Redis"""
        cart_key = self._get_cart_key(cart.cart_id)
        success = await self.redis.set(cart_key, cart.to_dict(), ttl=self.default_ttl)
        
        if success:
            logger.info(f"Saved anonymous cart: {cart.cart_id}")
        else:
            logger.error(f"Failed to save cart: {cart.cart_id}")
        
        return success
    
    async def delete_cart(self, cart_id: str) -> bool:
        """Delete cart from Redis"""
        cart_key = self._get_cart_key(cart_id)
        success = await self.redis.delete(cart_key)
        
        if success:
            logger.info(f"Deleted anonymous cart: {cart_id}")
        else:
            logger.warning(f"Cart not found or failed to delete: {cart_id}")
        
        return success
    
    async def cart_exists(self, cart_id: str) -> bool:
        """Check if cart exists"""
        cart_key = self._get_cart_key(cart_id)
        return await self.redis.exists(cart_key)
    
    async def add_item_to_cart(self, cart_id: str, restaurant_id: str, meal_id: str, 
                              quantity: int = 1, note: Optional[str] = None, 
                              schedule_date: Optional[str] = None) -> AnonymousCart:
        """Add item to cart"""
        # Get or create cart
        cart = await self.get_cart(cart_id)
        if not cart:
            cart = await self.create_cart(cart_id)
        
        # Add item to cart
        success = cart.add_item(restaurant_id, meal_id, quantity, note, schedule_date)
        if not success:
            raise ValueError("Cannot add item from different restaurant")
        
        # Save updated cart
        await self.save_cart(cart)
        return cart
    
    async def remove_item_from_cart(self, cart_id: str, meal_id: str) -> Optional[AnonymousCart]:
        """Remove item from cart"""
        cart = await self.get_cart(cart_id)
        if not cart:
            return None
        
        cart.remove_item(meal_id)
        await self.save_cart(cart)
        return cart
    
    async def update_cart_item(self, cart_id: str, meal_id: str, 
                              quantity: Optional[int] = None, note: Optional[str] = None, 
                              schedule_date: Optional[str] = None) -> Optional[AnonymousCart]:
        """Update cart item"""
        cart = await self.get_cart(cart_id)
        if not cart:
            return None
        
        success = cart.update_item(meal_id, quantity, note, schedule_date)
        if not success:
            return None
        
        await self.save_cart(cart)
        return cart
    
    async def clear_cart(self, cart_id: str) -> Optional[AnonymousCart]:
        """Clear all items from cart"""
        cart = await self.get_cart(cart_id)
        if not cart:
            return None
        
        cart.clear()
        await self.save_cart(cart)
        return cart
    
    async def get_cart_ttl(self, cart_id: str) -> int:
        """Get remaining TTL for cart"""
        cart_key = self._get_cart_key(cart_id)
        return await self.redis.ttl(cart_key)
    
    async def extend_cart_ttl(self, cart_id: str, ttl: Optional[int] = None) -> bool:
        """Extend cart TTL"""
        cart_key = self._get_cart_key(cart_id)
        ttl = ttl or self.default_ttl
        return await self.redis.expire(cart_key, ttl)
    
    async def scan_expired_carts(self) -> List[str]:
        """Scan for expired or soon-to-expire carts"""
        pattern = f"{self.cart_prefix}*"
        cart_keys = await self.redis.scan_keys(pattern)
        
        expired_carts = []
        for cart_key in cart_keys:
            ttl = await self.redis.ttl(cart_key)
            if ttl <= 0:  # Expired or no TTL
                cart_id = cart_key.replace(self.cart_prefix, "")
                expired_carts.append(cart_id)
        
        return expired_carts
    
    async def cleanup_expired_carts(self) -> int:
        """Clean up expired carts and return count"""
        expired_carts = await self.scan_expired_carts()
        cleanup_count = 0
        
        for cart_id in expired_carts:
            if await self.delete_cart(cart_id):
                cleanup_count += 1
        
        if cleanup_count > 0:
            logger.info(f"Cleaned up {cleanup_count} expired anonymous carts")
        
        return cleanup_count
    
    async def get_cart_stats(self) -> dict:
        """Get statistics about anonymous carts"""
        pattern = f"{self.cart_prefix}*"
        cart_keys = await self.redis.scan_keys(pattern)
        
        total_carts = len(cart_keys)
        active_carts = 0
        expiring_soon = 0  # TTL < 24 hours
        
        for cart_key in cart_keys:
            ttl = await self.redis.ttl(cart_key)
            if ttl > 0:
                active_carts += 1
                if ttl < 24 * 60 * 60:  # Less than 24 hours
                    expiring_soon += 1
        
        return {
            "total_carts": total_carts,
            "active_carts": active_carts,
            "expiring_soon": expiring_soon,
            "expired_carts": total_carts - active_carts
        }