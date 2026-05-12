from supabase import create_client
from app.config import get_settings
from app.services.embeddings import embed_text
import json

settings = get_settings()
supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

CACHE_THRESHOLD = 0.92


def check_cache(question: str) -> dict | None:
    """
    Check if a semantically similar question exists in the cache.
    Returns the cached entry if found, None otherwise.
    """
    try:
        embedding = embed_text(question)

        result = supabase.rpc(
            "match_cache",
            {
                "query_embedding": embedding,
                "match_threshold": CACHE_THRESHOLD,
                "match_count": 1,
            },
        ).execute()

        if not result.data:
            return None

        hit = result.data[0]

        # Update hit count and last_hit_at
        supabase.table("query_cache").update({
            "hit_count": hit["hit_count"] + 1,
            "last_hit_at": "now()",
        }).eq("id", hit["id"]).execute()

        return hit

    except Exception:
        return None


def store_cache(
    question: str,
    answer: str,
    confidence: str,
    citations: list,
) -> None:
    """
    Store a new question-answer pair in the cache.
    Never raises - caching must never break the response.
    """
    try:
        embedding = embed_text(question)

        supabase.table("query_cache").insert({
            "question": question,
            "answer": answer,
            "embedding": embedding,
            "confidence": confidence,
            "citations": citations,
        }).execute()

    except Exception:
        pass