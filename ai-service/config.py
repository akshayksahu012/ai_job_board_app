from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    google_api_key: str
    jsearch_api_key: str
    jsearch_host: str = "jsearch.p.rapidapi.com"
    embedding_model: str = "models/text-embedding-004"
    chat_model: str = "gemini-2.5-flash"
    port: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
