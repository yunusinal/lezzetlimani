from app.internal.models.address import Address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.internal.models.address import EntityType

class AddressRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_address(self, address: Address) -> Address:
        self.db.add(address)
        await self.db.commit()
        await self.db.refresh(address)
        return address

    async def get_address_by_id(self, address_id: str) -> Address | None:
        result = await self.db.execute(
            select(Address).where(Address.id == address_id)
        )
        return result.scalar_one_or_none()
    
    async def get_addresses_by_entity_id(self, entity_id: str, entity_type: EntityType) -> list[Address]:
        result = await self.db.execute(
            select(Address)
            .where(Address.entity_id == entity_id)
            .where(Address.entity_type == entity_type)
        )
        return result.scalars().all()
    
    async def reset_default_addresses(self, entity_id: str, entity_type: EntityType) -> None:
        """Reset all default addresses for the given entity to non-default."""
        await self.db.execute(
            update(Address)
            .where(Address.entity_id == entity_id)
            .where(Address.entity_type == entity_type)
            .where(Address.is_default == True)
            .values(is_default=False)
        )
        await self.db.commit()
    
    async def update_address(self, address: Address) -> Address:
        await self.db.commit()
        await self.db.refresh(address)
        return address
    
    async def delete_address(self, address_id: str) -> Address:
        address = await self.get_address_by_id(address_id)
        if not address:
            raise ValueError("Address not found")
        
        await self.db.delete(address)
        await self.db.commit()
        return address