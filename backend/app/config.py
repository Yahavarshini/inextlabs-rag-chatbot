from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    gemini_api_key: str
    mongodb_uri: str
    mongodb_db_name: str = "inextlabs_chatbot"
    kb_path: str = "kb/inextlabs_faq.txt"
    faiss_index_path: str = "faiss_index"
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()
