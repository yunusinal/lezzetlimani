from sqlmodel import SQLModel, Field

class FavoriteRestaurant(SQLModel, table=True):
    __tablename__ = "favorite_restaurants"
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    restaurant_id: str = Field(index=True)

class FavoriteCuisine(SQLModel, table=True):
    __tablename__ = "favorite_cuisines"
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    cuisine: str = Field(index=True) 