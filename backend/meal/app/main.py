from fastapi import FastAPI
from app.core.db import engine
from app.internal.view.meal_view import router as meal_router
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from app.config.settings import settings
from app.test.mock import main


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    if settings.MOCK == "true":
        await main()
    yield

app = FastAPI(
    title="Meal Service",
    description="Meal Service",
    version="1.0.0",
    docs_url="/meals/docs",
    redoc_url="/meals/redoc",
    openapi_url="/meals/openapi.json",
    lifespan=lifespan,
)

app.include_router(meal_router)