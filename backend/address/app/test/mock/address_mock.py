import asyncio
import random
import uuid
from datetime import datetime
from app.internal.models.address import Address, EntityType
from app.core.db import get_db

CITIES = ["İstanbul", "Ankara", "İzmir"]
DISTRICTS = ["Kadıköy", "Çankaya", "Karşıyaka"]
TITLES = ["Merkez Şube", "Yan Şube", "Geçici Lokasyon"]

async def insert_restaurant_addresses(count=20):
    async with get_db() as session:
        for _ in range(count):
            address = Address(
                id=str(uuid.uuid4()),
                entity_id=str(uuid.uuid4()),
                entity_type=EntityType.RESTAURANT,
                title=random.choice(TITLES),
                address=f"{random.randint(100,999)}. Sokak No:{random.randint(1,30)}",
                city=random.choice(CITIES),
                district=random.choice(DISTRICTS),
                full_address="Açıklama örneği - Lokasyon bilgisi",
                zip_code=str(random.randint(34000, 35999)),
                apartment=str(random.randint(1,10)),
                floor=str(random.randint(1,3)),
                door_number=str(random.randint(1,20)),
                latitude=random.uniform(36.0, 42.0),
                longitude=random.uniform(26.0, 45.0),
                is_default=False,
                created_at=datetime.now(),
                updated_at=datetime.now(),
            )
            session.add(address)
        await session.commit()
        print(f"{count} adet restoran adresi eklendi.")
        

if __name__ == "__main__":
    asyncio.run(insert_restaurant_addresses(20))