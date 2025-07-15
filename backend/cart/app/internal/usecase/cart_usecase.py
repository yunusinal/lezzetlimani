from app.internal.repository.cart_repository import CartRepository
from app.internal.schemas.cart_schema import (
    CartItemCreateSchema,
    CartItemResponseSchema,
    CartItemUpdateSchema,
)
from app.internal.model.cart_model import CartItem, Order
from sqlalchemy.ext.asyncio import AsyncSession
from app.internal.schemas.order_schema import OrderCreateSchema, OrderResponseSchema, OrderItemSchema
import json
from datetime import datetime


class CartUsecase:
    def __init__(self, db: AsyncSession):
        self.cart_repository = CartRepository(db)

    async def add_to_cart(self, cart_item: CartItemCreateSchema) -> CartItemResponseSchema:
        item = CartItem(**cart_item.model_dump())
        saved_item = await self.cart_repository.add_to_cart(item)
        return CartItemResponseSchema.model_validate(saved_item)

    async def get_cart_items(self, user_id: str) -> list[CartItemResponseSchema]:
        items = await self.cart_repository.get_cart_items(user_id)
        return [CartItemResponseSchema.model_validate(i) for i in items]

    async def remove_from_cart(self, user_id: str, meal_id: str) -> None:
        await self.cart_repository.remove_from_cart(user_id, meal_id)

    async def clear_cart(self, user_id: str) -> None:
        await self.cart_repository.clear_cart(user_id)

    async def update_cart_item(self, data: CartItemUpdateSchema) -> CartItemResponseSchema:
        updated = await self.cart_repository.update_cart_item(data)
        return CartItemResponseSchema.model_validate(updated)

    async def create_order(self, order_data: OrderCreateSchema) -> OrderResponseSchema:
        # Simulate subtotal calculation (in real case, fetch meal prices from DB)
        subtotal = 0
        items = []
        for item in order_data.items:
            # Simulate price as 100 for each item (replace with real price lookup)
            subtotal += 100 * item.quantity
            items.append({"meal_id": item.meal_id, "quantity": item.quantity, "note": item.note})
        discount = 0
        if order_data.coupon_code and order_data.coupon_code.upper() == "LEZZET10":
            discount = subtotal * 0.10
        total = subtotal - discount
        order = Order(
            user_id=order_data.user_id,
            restaurant_id=order_data.restaurant_id,
            items=json.dumps(items),
            subtotal=subtotal,
            discount=discount,
            total=total,
            payment_method=order_data.payment_method,
            coupon_code=order_data.coupon_code,
            created_at=datetime.now()
        )
        saved_order = await self.cart_repository.create_order(order)
        return OrderResponseSchema(
            id=saved_order.id,
            user_id=saved_order.user_id,
            restaurant_id=saved_order.restaurant_id,
            items=items,
            subtotal=saved_order.subtotal,
            discount=saved_order.discount,
            total=saved_order.total,
            payment_method=saved_order.payment_method,
            coupon_code=saved_order.coupon_code,
            created_at=saved_order.created_at,
            message="Sipariş başarıyla oluşturuldu (test)"
        )

    async def get_orders_by_user(self, user_id: str) -> list[OrderResponseSchema]:
        orders = await self.cart_repository.get_orders_by_user(user_id)
        result = []
        for order in orders:
            items = json.loads(order.items)
            result.append(OrderResponseSchema(
                id=order.id,
                user_id=order.user_id,
                restaurant_id=order.restaurant_id,
                items=items,
                subtotal=order.subtotal,
                discount=order.discount,
                total=order.total,
                payment_method=order.payment_method,
                coupon_code=order.coupon_code,
                created_at=order.created_at,
                message="Sipariş geçmişi"
            ))
        return result