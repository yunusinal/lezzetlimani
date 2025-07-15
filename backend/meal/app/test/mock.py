import random
import asyncio
from app.test.mock_data import restaurants_ids, cuisines, get_food_image_by_cuisine
from faker import Faker
from app.core.db import get_db
from app.internal.models.meal import Meal
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

faker = Faker("tr_TR")

def generate_fake_meal(restaurant_id: str):
    cuisine = random.choice(cuisines)
    name = f"{cuisine} {faker.word().capitalize()}"
    now = datetime.utcnow()
    
    return Meal(
        id=str(uuid.uuid4()),
        restaurant_id=restaurant_id,
        name=name,
        description=faker.sentence(nb_words=6),
        is_available=True,
        price=round(random.uniform(50, 150), 2),
        image_url=get_food_image_by_cuisine(cuisine),
        cuisine=cuisine,
        created_at=now,
        updated_at=now
    )

async def create_meals_for_restaurant(db: AsyncSession, restaurant_id: str, count: int = 20):
    meals = []
    for _ in range(count):
        meal = generate_fake_meal(restaurant_id)
        meals.append(meal)
        print(f"{restaurant_id} için meal oluşturuldu: {meal.name}")
    
    try:
        db.add_all(meals)
        await db.commit()
        print(f"{restaurant_id} için {len(meals)} meal başarıyla eklendi")
    except Exception as e:
        print(f"Hata oluştu {restaurant_id} için: {str(e)}")
        await db.rollback()
        raise

async def main():
    async for db in get_db():
        for rest_id in restaurants_ids:
            try:
                await create_meals_for_restaurant(db, rest_id.strip())
            except Exception as e:
                print(f"Kritik hata oluştu {rest_id} için: {str(e)}")
        break

if __name__ == "__main__":
    asyncio.run(main())
