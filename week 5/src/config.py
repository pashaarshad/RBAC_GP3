"""
Configuration settings for the RBAC Chatbot API.
"""

import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import List

load_dotenv()


class Settings(BaseSettings):
    APP_NAME: str = "RBAC Chatbot API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./rbac_chatbot.db")
    CHROMADB_PATH: str = os.getenv("CHROMADB_PATH", "../week 3/output/vector_db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
