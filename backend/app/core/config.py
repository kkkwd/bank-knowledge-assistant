from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Bank Knowledge Assistant API"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./bank_knowledge_assistant.db"
    cors_origins: list[str] = Field(default=["http://localhost:5173"])
    upload_dir: str = "data/raw"
    vector_store_dir: str = "data/vector_store"
    default_knowledge_bases: list[str] = Field(
        default=["Policy Library", "Product Library", "FAQ Library"]
    )

    model_config = SettingsConfigDict(
        env_prefix="BACKEND_",
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
