from fastapi import FastAPI
from app.core.db import engine
from app.internal.router.cart_router import router as cart_router
from app.internal.router.anonymous_cart_router import router as anonymous_cart_router
from app.core.redis_client import startup_redis, shutdown_redis
from sqlmodel import SQLModel
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)   
    await startup_redis()
    
    yield
    
    # Shutdown
    await shutdown_redis()

app = FastAPI(
    title="Cart Service",
    description="Cart Service",
    version="1.0.0",
    docs_url="/carts/docs",
    redoc_url="/carts/redoc",
    openapi_url="/carts/openapi.json",
    lifespan=lifespan,
)

app.include_router(cart_router)
app.include_router(anonymous_cart_router)