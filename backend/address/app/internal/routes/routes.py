from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from typing import List
from fastapi.responses import JSONResponse

from app.internal.schemas.address_schema import AddressCreateSchema, AddressResponseSchema, AddressUpdateSchema
from app.internal.usecase.address_use import AddressUsecase

router = APIRouter(prefix="/addresses")

@router.get("/health")
async def health():
    return {"status": "ok"}

from app.internal.models.address import EntityType

@router.post(
    "/",
    response_model=AddressResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Create Address",
    description="Create a new address for the authenticated entity (user or restaurant)."
)
async def create_address(
    address_data: AddressCreateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
    entity_type: EntityType = EntityType.USER 
):
    try:
        if entity_type == EntityType.USER:
            entity_id = request.state.user_id
            if not entity_id:
                raise HTTPException(status_code=401, detail="Unauthorized")
        else:
            raise HTTPException(status_code=400, detail="Unsupported entity type in this route")

        usecase = AddressUsecase(db)
        return await usecase.create_address(address_data, entity_id, entity_type)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

@router.get(
    "/",
    response_model=List[AddressResponseSchema],
    summary="Get Entity Addresses",
    description="Fetch all addresses associated with an entity."
)
async def get_entity_addresses(
    request: Request,
    db: AsyncSession = Depends(get_db),
    entity_type: EntityType = EntityType.USER
):
    try:
        if entity_type == EntityType.USER:
            entity_id = request.state.user_id
            if not entity_id:
                raise HTTPException(status_code=401, detail="Unauthorized")
        else:
            raise HTTPException(status_code=400, detail="Unsupported entity type in this route")

        usecase = AddressUsecase(db)
        addresses = await usecase.get_addresses_by_entity_id(entity_id, entity_type)
        return addresses
    except HTTPException as he:
        raise he
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

@router.delete(
    "/{address_id}",
    response_model=AddressResponseSchema,
    summary="Delete Address",
    description="Delete a specific address by its ID."
)
async def delete_address(
    address_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    entity_type: EntityType = EntityType.USER
):
    try:
        entity_id = request.state.user_id if entity_type == EntityType.USER else None
        if not entity_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        usecase = AddressUsecase(db)
        address = await usecase.get_address_by_id(address_id)
        if not address or address.entity_id != entity_id or address.entity_type != entity_type:
            raise HTTPException(status_code=403, detail="Permission denied")

        return await usecase.delete_address(address_id)
    except HTTPException as he:
        raise he
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

@router.put(
    "/{address_id}",
    response_model=AddressResponseSchema,
    summary="Update Address",
    description="Update a specific address by its ID."
)
async def update_address(
    address_id: str,
    address_data: AddressUpdateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
    entity_type: EntityType = EntityType.USER
):
    try:
        entity_id = request.state.user_id if entity_type == EntityType.USER else None
        if not entity_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        usecase = AddressUsecase(db)
        address = await usecase.get_address_by_id(address_id)
        if not address or address.entity_id != entity_id or address.entity_type != entity_type:
            raise HTTPException(status_code=403, detail="Permission denied")

        return await usecase.update_address(address_id, address_data)
    except HTTPException as he:
        raise he
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

@router.get(
    "/{address_id}",
    response_model=AddressResponseSchema,
    summary="Get Address by ID",
    description="Fetch a specific address by its ID."
)
async def get_address(
    address_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    entity_type: EntityType = EntityType.USER
):
    try:
        entity_id = request.state.user_id if entity_type == EntityType.USER else None
        if not entity_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        usecase = AddressUsecase(db)
        address = await usecase.get_address_by_id(address_id)
        if not address:
            raise HTTPException(status_code=404, detail="Address not found")
        if address.entity_id != entity_id or address.entity_type != entity_type:
            raise HTTPException(status_code=403, detail="Permission denied")
        return address
    except HTTPException as he:
        raise he
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )