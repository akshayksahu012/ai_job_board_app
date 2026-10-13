from langchain_huggingface import HuggingFaceEmbeddings
from config import settings

embeddings_client = HuggingFaceEmbeddings(model_name=settings.embedding_model)


def embed_text(text: str) -> list[float]:
    return embeddings_client.embed_query(text[:8000])
