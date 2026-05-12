import json
import time
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from supabase import create_client
from app.middleware.guards import validate_input
from app.services.retrieval import retrieve_chunks
from app.services.prompt import build_prompt
from app.services.cache import check_cache, store_cache
from app.config import get_settings
import anthropic

settings = get_settings()
router = APIRouter()
claude = anthropic.Anthropic(api_key=settings.anthropic_api_key)
supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)
limiter = Limiter(key_func=get_remote_address)

CONFIDENCE_THRESHOLD = 0.60


class QueryRequest(BaseModel):
    question: str
    conversation_id: str | None = None


def sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


def log_query(
    question: str,
    confidence: str,
    latency_ms: int,
    chunk_ids: list[str],
    response: str,
) -> None:
    """
    Log a completed query to Supabase.
    Never raises - logging must never break the response.
    """
    try:
        supabase.table("queries").insert({
            "question": question,
            "response": response[:500] if response else None,
            "confidence": confidence,
            "latency_ms": latency_ms,
            "retrieved_chunk_ids": chunk_ids,
        }).execute()
    except Exception:
        pass


@router.post("/query")
@limiter.limit("20/hour")
async def query_kora(request: Request, query: QueryRequest):
    start_time = time.time()

    # Validate input
    validate_input(query.question, settings.max_input_chars)

    # ── Cache check ───────────────────────────────────────────────────────────
    cached = check_cache(query.question)
    if cached:
        async def stream_cached():
            # Stream cached answer word by word for natural feel
            words = cached["answer"].split(" ")
            for i, word in enumerate(words):
                chunk = word if i == len(words) - 1 else word + " "
                yield sse({"type": "chunk", "content": chunk})
            yield sse({"type": "citations", "citations": cached["citations"] or []})
            yield sse({"type": "cache_hit", "content": True})
            yield "data: [DONE]\n\n"

            # Log the cache hit
            latency_ms = int((time.time() - start_time) * 1000)
            log_query(
                query.question,
                cached["confidence"],
                latency_ms,
                [],
                cached["answer"],
            )

        return StreamingResponse(
            stream_cached(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )
    # ── End cache check ───────────────────────────────────────────────────────

    # Retrieve relevant chunks
    chunks, best_score = retrieve_chunks(query.question)

    # Determine confidence
    if not chunks or best_score < CONFIDENCE_THRESHOLD:
        confidence = "uncertain"
    elif best_score >= 0.75:
        confidence = "high"
    else:
        confidence = "low"

    # Build system prompt with context
    system_prompt = build_prompt(chunks)

    # Build citations payload
    citations = [
        {
            "documentName": chunk["document_name"],
            "chunkContent": chunk["content"][:300],
            "relevanceScore": round(chunk["similarity"], 3),
        }
        for chunk in chunks
    ]

    # Collect chunk IDs for logging
    chunk_ids = [chunk["id"] for chunk in chunks]

    async def stream_response():
        full_response = ""

        try:
            # Uncertain - stream fallback message
            if confidence == "uncertain":
                fallback = (
                    "I don't have enough information in Meridian Works' "
                    "documents to answer this accurately. Please check with "
                    "your line manager or the People & Culture team."
                )
                yield sse({"type": "chunk", "content": fallback})
                yield sse({"type": "citations", "citations": []})
                yield "data: [DONE]\n\n"

                latency_ms = int((time.time() - start_time) * 1000)
                log_query(query.question, confidence, latency_ms, chunk_ids, fallback)
                store_cache(query.question, fallback, confidence, [])
                return

            # Stream from Claude
            with claude.messages.stream(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": query.question}],
            ) as stream:
                for text in stream.text_stream:
                    full_response += text
                    yield sse({"type": "chunk", "content": text})

            # Send citations after answer is done
            yield sse({"type": "citations", "citations": citations})
            yield "data: [DONE]\n\n"

            # Log and cache completed query
            latency_ms = int((time.time() - start_time) * 1000)
            log_query(query.question, confidence, latency_ms, chunk_ids, full_response)
            store_cache(query.question, full_response, confidence, citations)

        except Exception:
            yield sse({
                "type": "error",
                "message": "Kora is temporarily unavailable. Please try again.",
                "code": "SERVICE_UNAVAILABLE",
            })

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


class FollowUpRequest(BaseModel):
    question: str
    answer: str


@router.post("/follow-ups")
async def get_follow_ups(request: FollowUpRequest):
    try:
        response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=200,
            system="""You generate short follow-up questions based on a Q&A exchange.
Return exactly 2 to 3 follow-up questions a user might ask next.
Rules:
- Each question must be under 80 characters
- Questions must be directly related to the answer given
- Return only the questions, one per line, no numbering, no bullets
- Do not repeat the original question""",
            messages=[
                {
                    "role": "user",
                    "content": f"Question: {request.question}\n\nAnswer: {request.answer}\n\nGenerate follow-up questions:"
                }
            ],
        )
        raw = response.content[0].text.strip()
        questions = [q.strip() for q in raw.split("\n") if q.strip()][:3]
        return {"questions": questions}
    except Exception:
        return {"questions": []}