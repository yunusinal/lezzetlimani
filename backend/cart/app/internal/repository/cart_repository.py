from app.internal.model.cart_model import CartItem, Order
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlmodel import select
from sqlalchemy import delete
from app.internal.schemas.cart_schema import CartItemUpdateSchema
import json

class CartRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_to_cart(self, cart_item: CartItem) -> CartItem:
        stmt = select(CartItem).where(CartItem.user_id == cart_item.user_id)
        result = await self.db.execute(stmt)
        items = result.scalars().all()

        if items and any(item.restaurant_id != cart_item.restaurant_id for item in items):
            raise HTTPException(status_code=400, detail="Cart already has items from a different restaurant")

        self.db.add(cart_item)
        await self.db.commit()
        await self.db.refresh(cart_item)
        return cart_item

    async def get_cart_items(self, user_id: str) -> list[CartItem]:
        stmt = select(CartItem).where(CartItem.user_id == user_id)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def remove_from_cart(self, user_id: str, meal_id: str) -> None:
        stmt = delete(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.meal_id == meal_id
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def clear_cart(self, user_id: str) -> None:
        stmt = select(CartItem).where(CartItem.user_id == user_id)
        result = await self.db.execute(stmt)
        items = result.scalars().all()
        for item in items:
            await self.db.delete(item)
        await self.db.commit()

    async def update_cart_item(self, data: CartItemUpdateSchema) -> CartItem:
        stmt = select(CartItem).where(CartItem.meal_id == data.meal_id)
        result = await self.db.execute(stmt)
        item = result.scalars().first()
        if item:
            item.note = data.note
            item.schedule_date = data.schedule_date
            item.quantity = data.quantity
            await self.db.commit()
            await self.db.refresh(item)
            return item

    async def create_order(self, order: Order) -> Order:
        self.db.add(order)
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def get_orders_by_user(self, user_id: str) -> list[Order]:
        result = await self.db.execute(select(Order).where(Order.user_id == user_id))
        return result.scalars().all()
    
    async def update_cart_item_quantity(self, user_id: str, meal_id: str, quantity: int) -> bool:
        """Update cart item quantity for cart merging"""
        stmt = select(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.meal_id == meal_id
        )
        result = await self.db.execute(stmt)
        item = result.scalars().first()
        
        if item:
            item.quantity = quantity
            await self.db.commit()
            await self.db.refresh(item)
            return True
        return False