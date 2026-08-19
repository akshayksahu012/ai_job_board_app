from langchain.text_splitter import RecursiveCharacterTextSplitter

_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=80,
    separators=["\n\n", "\n", ". ", " "],
)


def chunk_text(text: str) -> list[str]:
    return _splitter.split_text(text)
