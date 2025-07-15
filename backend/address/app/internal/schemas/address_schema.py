from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AddressBase(BaseModel):
    title: str
    address: str
    city: str
    district: str
    full_address: str
    zip_code: str

    apartment: Optional[str] = None
    floor: Optional[str] = None
    door_number: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    is_default: bool = False


class AddressCreateSchema(AddressBase):
    pass


class AddressUpdateSchema(BaseModel):
    title: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    full_address: Optional[str] = None
    zip_code: Optional[str] = None

    apartment: Optional[str] = None
    floor: Optional[str] = None
    door_number: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    is_default: Optional[bool] = None


class AddressResponseSchema(BaseModel):
    id: str
    title: str
    address: str
    city: str
    district: str
    full_address: str
    zip_code: str
    apartment: Optional[str]
    floor: Optional[str]
    door_number: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    is_default: bool
    created_at: datetime
    updated_at: datetime
    entity_type: Optional[str]
    entity_id: Optional[str]
    
    class Config:
        from_attributes = True
    