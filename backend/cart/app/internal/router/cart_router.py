from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.internal.schemas.cart_schema import (
    CartItemCreateSchema,
    CartItemResponseSchema,
    CartItemUpdateSchema,
)
from app.internal.schemas.order_schema import OrderCreateSchema, OrderResponseSchema
from app.internal.usecase.cart_usecase import CartUsecase
from app.core.db import get_db

router = APIRouter(prefix="/carts", tags=["carts"])

def get_cart_usecase(db: AsyncSession = Depends(get_db)) -> CartUsecase:
    return CartUsecase(db)

@router.post("/add", response_model=CartItemResponseSchema)
async def add_to_cart(
    cart_item: CartItemCreateSchema,
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
):
    return await cart_usecase.add_to_cart(cart_item)

@router.get("/get", response_model=list[CartItemResponseSchema])
async def get_cart_items(
    user_id: str,
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
):
    return await cart_usecase.get_cart_items(user_id)

@router.delete("/remove/{meal_id}")
async def remove_from_cart(
    user_id: str,
    meal_id: str,
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
):
    await cart_usecase.remove_from_cart(user_id, meal_id)
    return {"message": "Item removed from cart"}

@router.delete("/clear")
async def clear_cart(
    user_id: str,
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
):
    await cart_usecase.clear_cart(user_id)
    return {"message": "Cart cleared"}

@router.patch("/update/{meal_id}", response_model=CartItemResponseSchema)
async def update_cart_item(
    meal_id: str,
    data: CartItemUpdateSchema,
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
):
    data.meal_id = meal_id
    return await cart_usecase.update_cart_item(data)

@router.post("/checkout", response_model=OrderResponseSchema)
async def checkout_order(
    order_data: OrderCreateSchema,
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
):
    if order_data.payment_method not in ["credit_card", "cash", "pos"]:
        raise HTTPException(status_code=400, detail="Geçersiz ödeme yöntemi")
    return await cart_usecase.create_order(order_data)

@router.get("/orders", response_model=list[OrderResponseSchema])
async def get_orders(
    user_id: str,
    cart_usecase: CartUsecase = Depends(get_cart_usecase),
):
    return await cart_usecase.get_orders_by_user(user_id)