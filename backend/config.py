"""
Application configuration — loads from .env file.
All settings are typed and validated by Pydantic.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from functools import lru_cache
from dotenv import load_dotenv
import os

load_dotenv(override=True)

class Settings(BaseSettings):
    # MongoDB
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "ai_classroom_db")

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")

    # App
    APP_ENV: str = os.getenv("APP_ENV", "development")

    @property
    def mongo_uri(self) -> str: return self.MONGO_URI
    
    @property
    def database_name(self) -> str: return self.DATABASE_NAME
    
    @property
    def jwt_secret(self) -> str: return self.JWT_SECRET
    
    @property
    def jwt_algorithm(self) -> str: return self.JWT_ALGORITHM
    
    @property
    def access_token_expire_minutes(self) -> int: return self.ACCESS_TOKEN_EXPIRE_MINUTES
    
    @property
    def refresh_token_expire_days(self) -> int: return self.REFRESH_TOKEN_EXPIRE_DAYS

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # Email Settings
    mail_username: str = os.getenv("MAIL_USERNAME", "")
    mail_password: str = os.getenv("MAIL_PASSWORD", "")
    mail_from: str = os.getenv("MAIL_FROM", "alerts@classroomai.edu")
    mail_port: int = int(os.getenv("MAIL_PORT", 587))
    mail_server: str = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    hod_email: str = os.getenv("HOD_EMAIL", "hod@school.com")  # Added for HOD email notifications

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — only reads .env once."""
    return Settings()


settings = get_settings()
