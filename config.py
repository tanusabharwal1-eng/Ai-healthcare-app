from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://user:password@localhost:5432/healthcare_db"
    jwt_secret: str = "change_this_secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    ai_api_key: str = ""
    ai_api_url: str = ""
    guest_mode_enabled: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
