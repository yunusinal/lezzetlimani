from typing import Awaitable, Callable
import asyncio
import json
from app.config.settings import settings
from aiokafka import AIOKafkaConsumer

async def generic_consumer(topic: str, callback: Callable[[dict], Awaitable[None]]):
    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        auto_offset_reset=settings.KAFKA_AUTO_OFFSET_RESET,
        enable_auto_commit=settings.KAFKA_ENABLE_AUTO_COMMIT,
        group_id=settings.KAFKA_GROUP_ID,
    )
    await consumer.start()
    try:
        async for message in consumer:
            event = json.loads(message.value)
            await callback(event)
    finally:
        await consumer.stop()
        

async def wait_kafka_ready(topic: str, max_retries: int = 10, retry_delay: int = 5):
    for _ in range(max_retries):
        try:
            consumer = AIOKafkaConsumer(
                topic,
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            )
            await consumer.start()
            await consumer.stop()
            return
        except Exception as e:
            await asyncio.sleep(retry_delay)
    raise RuntimeError("Kafka not ready")

