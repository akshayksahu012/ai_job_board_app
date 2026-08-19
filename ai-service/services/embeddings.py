from langchain_huggingface import HuggingFaceEmbeddings
from config import settings

# Runs locally via sentence-transformers - first call downloads the model (~90MB), then it's cached.
# No API key, no per-call cost, unlike Gemini embeddings.
embeddings_client = HuggingFaceEmbeddings(model_name=settings.embedding_model)


def embed_text(text: str) -> list[float]:
    return embeddings_client.embed_query(text[:8000])
