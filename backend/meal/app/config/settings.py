from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str = "meal-db"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "meals"
    
    REDIS_URL: str = "redis://redis:6379"
    
    JWT_ACCESS_SECRET_KEY: str = "jwt"
    
    MOCK : str = "false"
    
    class Config:
        env_file = ".env"

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
settings = Settings()