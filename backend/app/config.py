from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Anthropic
    anthropic_api_key: str

    # Supabase
    supabase_url: str
    supabase_service_role_key: str

    # OpenAI
    openai_api_key: str

    # App
    frontend_url: str = "http://localhost:3000"
    environment: str = "development"
    rate_limit_per_hour: int = 20
    max_input_chars: int = 500

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()