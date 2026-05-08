from openai import OpenAI
from app.config import get_settings

settings = get_settings()
client = OpenAI(api_key=settings.openai_api_key)

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSION = 1536


def embed_text(text: str) -> list[float]:
    """
    Generate an embedding vector for a given text string.
    """
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text.strip(),
    )
    return response.data[0].embedding


def embed_batch(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a batch of texts in one API call.
    More efficient than calling embed_text in a loop.
    """
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=[t.strip() for t in texts],
    )
    return [item.embedding for item in response.data]