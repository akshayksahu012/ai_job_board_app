from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from config import settings

# Single shared instances - LangChain clients are safe to reuse across requests
embeddings_client = GoogleGenerativeAIEmbeddings(
    model=settings.embedding_model,
    google_api_key=settings.google_api_key,
)

chat_client = ChatGoogleGenerativeAI(
    model=settings.chat_model,
    google_api_key=settings.google_api_key,
    temperature=0.3,
)


def embed_text(text: str) -> list[float]:
    # Gemini embedding input cap - trim before sending
    return embeddings_client.embed_query(text[:8000])


def embed_batch(texts: list[str]) -> list[list[float]]:
    return embeddings_client.embed_documents([t[:8000] for t in texts])


def generate(prompt: str) -> str:
    res = chat_client.invoke(prompt)
    return res.content
