from app.internal.infra.redis.client import get_redis

async def handle_user_created(event: dict):
    user_id = event["user_id"]
    redis = get_redis()
    await redis.set(f"pending_user:{user_id}", "1", ex=900)
