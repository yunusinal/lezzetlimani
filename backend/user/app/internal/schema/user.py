from datetime import date
from typing import Optional
from pydantic import BaseModel


class UserCreateSchema(BaseModel):
    id: Optional[str] = None
    full_name: str
    born_date: date
    gender: str
    phone: str

    class Config:
        from_attributes = True

class UserUpdateSchema(BaseModel):
    full_name: Optional[str] = None
    born_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True

class UserResponseSchema(BaseModel):
    id: str
    full_name: str
    born_date: date
    gender: str
    phone: str

    class Config:
        from_attributes = True
