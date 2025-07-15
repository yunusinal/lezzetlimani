from enum import Enum
from sqlmodel import Field, SQLModel, Index, text
import uuid
from datetime import datetime
from typing import Optional

class EntityType(str, Enum):
    USER = "USER"
    RESTAURANT = "RESTAURANT"

class Address(SQLModel, table=True):
    __tablename__ = "addresses"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    entity_id: str = Field(index=True, nullable=False)
    entity_type: EntityType = Field(sa_column_kwargs={"nullable": False})

    title: str = Field(nullable=False)
    address: str = Field(nullable=False)
    city: str = Field(nullable=False)
    district: str = Field(nullable=False)
    full_address: str = Field(nullable=False)
    zip_code: str = Field(nullable=False)


    apartment: Optional[str] = Field(default=None)
    floor: Optional[str] = Field(default=None)
    door_number: Optional[str] = Field(default=None)

    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)

    is_default: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    __table_args__ = (
        Index(
            "ux_addr_default_user",
            "entity_id",
            postgresql_where=text("entity_type = 'USER'::entitytype AND is_default = true"),
            unique=True,
        ),
        Index(
            "ux_addr_default_restaurant",
            "entity_id",
            postgresql_where=text("entity_type = 'RESTAURANT'::entitytype AND is_default = true"),
            unique=True,
        ),
    )

    class Config:
        from_attributes = True