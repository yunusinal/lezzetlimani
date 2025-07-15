from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from app.core.db import engine
from app.core.middleware import JWTMiddleware
from app.internal.routes.routes import router
from app.config.settings import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    if settings.MOCK == "true":
        from app.test.mock.address_mock import insert_restaurant_addresses
        await insert_restaurant_addresses(20)

    yield

app = FastAPI(
    redirect_trailing_slash=False,
    redirect_fixed_path=False,
    title="Address Service API",
    version="1.0.0",
    description="Address Service API",
    docs_url="/addresses/docs",
    redoc_url="/addresses/redoc",
    openapi_url="/addresses/openapi.json",
    lifespan=lifespan,
)


app.add_middleware(JWTMiddleware)
app.include_router(router)

