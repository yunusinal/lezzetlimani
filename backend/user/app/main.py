from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio
from app.core.db import engine
from sqlmodel import SQLModel
from app.core.middleware import JWTMiddleware
from app.internal.infra.kafka.consumer import wait_kafka_ready, generic_consumer
from app.internal.infra.kafka.events import handle_user_created
from app.config.settings import settings
from app.internal.controller.user_controller import router as user_router
from app.internal.controller.favorite_controller import router as favorite_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    user_created_topic = settings.KAFKA_TOPIC_USER_CREATED
    await wait_kafka_ready(user_created_topic)
    task = asyncio.create_task(generic_consumer(user_created_topic, handle_user_created))
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app = FastAPI(   
    redirect_trailing_slash=False,
    redirect_fixed_path=False,
    title="User Service API",
    description="Handles user profile creation and updates",
    version="1.0.0",
    docs_url="/users/docs",
    redoc_url="/users/redoc",
    openapi_url="/users/openapi.json",
    lifespan=lifespan
)


app.add_middleware(JWTMiddleware)
app.include_router(user_router)
app.include_router(favorite_router)