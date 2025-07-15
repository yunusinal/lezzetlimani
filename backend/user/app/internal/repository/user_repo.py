from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.internal.models.user import User

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)  # güncel objeyi al
        return user

    async def get_user_by_id(self, user_id: str) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def update_user(self, user: User) -> User:
        self.db.merge(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_user(self, user: User) -> User:
        await self.db.delete(user)
        await self.db.commit()
        return user