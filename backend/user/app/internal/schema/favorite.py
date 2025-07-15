from pydantic import BaseModel

class FavoriteRestaurantCreate(BaseModel):
    restaurant_id: str

class FavoriteCuisineCreate(BaseModel):
    cuisine: str 