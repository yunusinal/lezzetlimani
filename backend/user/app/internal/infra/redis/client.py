from redis.asyncio import Redis
from app.config.settings import settings


redis: Redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis() -> Redis:
    return redis