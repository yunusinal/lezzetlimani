from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.internal.schemas.anonymous_cart_schema import (
    AnonymousCartCreateSchema,
    AnonymousCartUpdateSchema,
    AnonymousCartResponseSchema,
    CartMergeSchema,
    CartMergeResponseSchema,
    GenerateCartIdResponseSchema,
    AnonymousCartValidationSchema
)
from app.internal.usecase.anonymous_cart_usecase import AnonymousCartUsecase
from app.core.db import get_db
from app.core.redis_client import get_redis, RedisClient
from typing import Optional

router = APIRouter(prefix="/carts/anonymous", tags=["anonymous-carts"])

def get_anonymous_cart_usecase(
    redis_client: RedisClient = Depends(get_redis),
    db: Optional[AsyncSession] = Depends(get_db)
) -> AnonymousCartUsecase:
    return AnonymousCartUsecase(redis_client, db)

def get_anonymous_cart_usecase_redis_only(
    redis_client: RedisClient = Depends(get_redis)
) -> AnonymousCartUsecase:
    return AnonymousCartUsecase(redis_client)

@router.post("/generate-id", response_model=GenerateCartIdResponseSchema)
async def generate_cart_id(
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Generate a new anonymous cart ID"""
    return await usecase.generate_cart_id()

@router.post("/add", response_model=AnonymousCartResponseSchema)
async def add_to_anonymous_cart(
    cart_item: AnonymousCartCreateSchema,
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Add item to anonymous cart"""
    try:
        return await usecase.add_to_anonymous_cart(cart_item)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to add item to cart")

@router.get("/{cart_id}", response_model=Optional[AnonymousCartResponseSchema])
async def get_anonymous_cart(
    cart_id: str,
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Get anonymous cart by ID"""
    cart = await usecase.get_anonymous_cart(cart_id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart

@router.patch("/{cart_id}/items/{meal_id}", response_model=AnonymousCartResponseSchema)
async def update_anonymous_cart_item(
    cart_id: str,
    meal_id: str,
    data: AnonymousCartUpdateSchema,
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Update item in anonymous cart"""
    cart = await usecase.update_anonymous_cart_item(cart_id, meal_id, data)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart or item not found")
    return cart

@router.delete("/{cart_id}/items/{meal_id}", response_model=AnonymousCartResponseSchema)
async def remove_from_anonymous_cart(
    cart_id: str,
    meal_id: str,
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Remove item from anonymous cart"""
    cart = await usecase.remove_from_anonymous_cart(cart_id, meal_id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart

@router.delete("/{cart_id}/clear", response_model=AnonymousCartResponseSchema)
async def clear_anonymous_cart(
    cart_id: str,
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Clear all items from anonymous cart"""
    cart = await usecase.clear_anonymous_cart(cart_id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart

@router.get("/{cart_id}/validate", response_model=AnonymousCartValidationSchema)
async def validate_anonymous_cart(
    cart_id: str,
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Validate anonymous cart and get status"""
    return await usecase.validate_anonymous_cart(cart_id)

@router.post("/merge", response_model=CartMergeResponseSchema)
async def merge_anonymous_cart_to_user(
    merge_data: CartMergeSchema,
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase)
):
    """Merge anonymous cart to user cart"""
    try:
        return await usecase.merge_anonymous_cart_to_user(merge_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to merge cart: {str(e)}")

@router.post("/{cart_id}/extend")
async def extend_cart_expiry(
    cart_id: str,
    days: int = Query(default=30, ge=1, le=365, description="Days to extend (1-365)"),
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Extend cart expiry by specified days"""
    success = await usecase.extend_cart_expiry(cart_id, days)
    if not success:
        raise HTTPException(status_code=404, detail="Cart not found or extension failed")
    
    return {"message": f"Cart expiry extended by {days} days", "cart_id": cart_id}

@router.post("/cleanup")
async def cleanup_expired_carts(
    usecase: AnonymousCartUsecase = Depends(get_anonymous_cart_usecase_redis_only)
):
    """Clean up expired anonymous carts (admin endpoint)"""
    result = await usecase.cleanup_expired_carts()
    return {
        "message": f"Cleaned up {result['cleaned_up']} expired carts",
        "stats": result["stats"]
    }