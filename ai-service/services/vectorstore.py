from langchain_community.vectorstores import FAISS
from services.embeddings import embeddings_client


def build_resume_index(chunks: list[str]) -> FAISS:
    """Builds a fresh in-memory FAISS index from this resume's chunks.
    Small scale (one resume at a time) so rebuilding per request is cheap enough -
    no need to persist it anywhere."""
    return FAISS.from_texts(chunks, embeddings_client)


def retrieve_relevant_chunks(vectorstore: FAISS, query: str, k: int = 4) -> list[tuple[str, float]]:
    """Returns (chunk_text, relevance_score) pairs, most relevant first.
    relevance_score is normalized to roughly 0-1 by LangChain (higher = more similar) -
    this is the retrieval step of RAG, no manual cosine math needed."""
    results = vectorstore.similarity_search_with_relevance_scores(query, k=k)
    return [(doc.page_content, score) for doc, score in results]
