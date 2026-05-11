# import json
# import time
# from fastapi import APIRouter, Request
# from fastapi.responses import StreamingResponse
# from pydantic import BaseModel
# from slowapi import Limiter
# from slowapi.util import get_remote_address
# from app.middleware.guards import validate_input
# from app.services.retrieval import retrieve_chunks
# from app.services.prompt import build_prompt
# from app.config import get_settings
# import anthropic

# settings = get_settings()
# router = APIRouter()
# claude = anthropic.Anthropic(api_key=settings.anthropic_api_key)
# limiter = Limiter(key_func=get_remote_address)

# CONFIDENCE_THRESHOLD = 0.60


# class QueryRequest(BaseModel):
#     question: str
#     conversation_id: str | None = None


# def sse(data: dict) -> str:
#     return f"data: {json.dumps(data)}\n\n"


# @router.post("/query")
# @limiter.limit("20/hour")
# async def query_kora(request: Request, query: QueryRequest):
#     start_time = time.time()

#     # Validate input
#     validate_input(query.question, settings.max_input_chars)

#     # Retrieve relevant chunks
#     chunks, best_score = retrieve_chunks(query.question)

#     # Determine confidence
#     if not chunks or best_score < CONFIDENCE_THRESHOLD:
#         confidence = "uncertain"
#     elif best_score >= 0.75:
#         confidence = "high"
#     else:
#         confidence = "low"

#     # Build system prompt with context
#     system_prompt = build_prompt(chunks)

#     # Build citations payload
#     citations = [
#         {
#             "documentName": chunk["document_name"],
#             "chunkContent": chunk["content"][:300],
#             "relevanceScore": round(chunk["similarity"], 3),
#         }
#         for chunk in chunks
#     ]

#     async def stream_response():
#         try:
#             # If uncertain, stream a fallback message
#             if confidence == "uncertain":
#                 fallback = (
#                     "I don't have enough information in Meridian Works' "
#                     "documents to answer this accurately. Please check with "
#                     "your line manager or the People & Culture team."
#                 )
#                 yield sse({"type": "chunk", "content": fallback})
#                 yield sse({"type": "citations", "citations": []})
#                 yield "data: [DONE]\n\n"
#                 return

#             # Stream from Claude
#             with claude.messages.stream(
#                 model="claude-sonnet-4-20250514",
#                 max_tokens=1024,
#                 system=system_prompt,
#                 messages=[{"role": "user", "content": query.question}],
#             ) as stream:
#                 for text in stream.text_stream:
#                     yield sse({"type": "chunk", "content": text})

#             # Send citations after answer is done
#             yield sse({"type": "citations", "citations": citations})
#             yield "data: [DONE]\n\n"

#         except Exception as e:
#             yield sse({
#                 "type": "error",
#                 "message": "Kora is temporarily unavailable. Please try again.",
#                 "code": "SERVICE_UNAVAILABLE",
#             })

#     return StreamingResponse(
#         stream_response(),
#         media_type="text/event-stream",
#         headers={
#             "Cache-Control": "no-cache",
#             "X-Accel-Buffering": "no",
#         },
#     )


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

            # Log completed query
            latency_ms = int((time.time() - start_time) * 1000)
            log_query(query.question, confidence, latency_ms, chunk_ids, full_response)

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