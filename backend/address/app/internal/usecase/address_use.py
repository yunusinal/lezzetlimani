from app.internal.repository.address_repo import AddressRepository
from app.internal.models.address import Address, EntityType
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from app.internal.schemas.address_schema import AddressCreateSchema, AddressUpdateSchema
from fastapi import HTTPException
from datetime import datetime, UTC
from sqlmodel import update
from sqlalchemy import select, and_
from app.core.db import get_db

class AddressUsecase:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.address_repo = AddressRepository(db)

    async def _unset_previous_default(self, entity_id: str, entity_type: EntityType):
        await self.db.execute(
            update(Address)
            .where(
                Address.entity_id == entity_id,
                Address.entity_type == entity_type,
                Address.is_default == True
            )
            .values(is_default=False, updated_at=datetime.now().replace(tzinfo=None))
        )

    async def create_address(self, address_data: AddressCreateSchema, entity_id: str, entity_type: EntityType) -> Address:
        # If this is the first address or is_default is True, set all other addresses to non-default
        if address_data.is_default:
            await self.address_repo.reset_default_addresses(entity_id, entity_type)
        
        address = Address(
            entity_id=entity_id,
            entity_type=entity_type,
            **address_data.model_dump()
        )
        return await self.address_repo.create_address(address)

    async def get_address_by_id(self, address_id: str) -> Address | None:
        return await self.address_repo.get_address_by_id(address_id)

    async def get_addresses_by_entity_id(self, entity_id: str, entity_type: EntityType) -> list[Address]:
        return await self.address_repo.get_addresses_by_entity_id(entity_id, entity_type)

    async def update_address(self, address_id: str, address_data: AddressUpdateSchema) -> Address:
        address = await self.get_address_by_id(address_id)
        if not address:
            raise ValueError("Address not found")

        # If setting this address as default, reset all other addresses
        if address_data.is_default and not address.is_default:
            await self.address_repo.reset_default_addresses(address.entity_id, address.entity_type)

        # Update the address
        for key, value in address_data.model_dump(exclude_unset=True).items():
            setattr(address, key, value)

        return await self.address_repo.update_address(address)

    async def delete_address(self, address_id: str) -> Address:
        return await self.address_repo.delete_address(address_id)