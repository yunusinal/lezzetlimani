from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str = "cart-db"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "carts"
    
    REDIS_URL: str = "redis://redis:6379"
    
    JWT_ACCESS_SECRET_KEY: str = "jwt"
    
    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"


settings = Settings()