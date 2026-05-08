from supabase import create_client
from app.config import get_settings
from app.services.embeddings import embed_text

settings = get_settings()
supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

MATCH_THRESHOLD = 0.45
MATCH_COUNT = 5
TOP_K = 3


def retrieve_chunks(question: str) -> tuple[list[dict], float]:
    """
    Embed the question, run pgvector similarity search,
    return top chunks and the best similarity score.
    """
    query_embedding = embed_text(question)

    result = supabase.rpc(
        "match_chunks",
        {
            "query_embedding": query_embedding,
            "match_threshold": MATCH_THRESHOLD,
            "match_count": MATCH_COUNT,
        },
    ).execute()

    chunks = result.data or []

    if not chunks:
        return [], 0.0

    # Sort by similarity descending, take top K
    chunks = sorted(chunks, key=lambda x: x["similarity"], reverse=True)[:TOP_K]
    best_score = chunks[0]["similarity"] if chunks else 0.0

    # Enrich with document name
    chunks = enrich_with_document_names(chunks)

    return chunks, best_score


def enrich_with_document_names(chunks: list[dict]) -> list[dict]:
    """
    Fetch document names for each chunk and attach them.
    """
    document_ids = list({c["document_id"] for c in chunks})

    docs_result = (
        supabase.table("documents")
        .select("id, name")
        .in_("id", document_ids)
        .execute()
    )

    doc_map = {d["id"]: d["name"] for d in (docs_result.data or [])}

    for chunk in chunks:
        chunk["document_name"] = doc_map.get(chunk["document_id"], "Unknown Document")

    return chunks