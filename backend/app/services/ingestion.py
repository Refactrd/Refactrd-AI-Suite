import uuid
import re
from pypdf import PdfReader
from io import BytesIO
from supabase import create_client
from app.config import get_settings
from app.services.embeddings import embed_batch

settings = get_settings()
supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

CHUNK_SIZE = 150
CHUNK_OVERLAP = 20


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())
    return "\n\n".join(pages)


def extract_text_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Split text into overlapping chunks by word count.
    """
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk.strip())
        start += chunk_size - overlap

    return [c for c in chunks if len(c.strip()) > 50]


def ingest_document(file_bytes: bytes, filename: str) -> dict:
    """
    Full ingestion pipeline:
    1. Extract text
    2. Chunk
    3. Embed in batch
    4. Store document record and chunks in Supabase
    """

    # Determine file type and extract text
    if filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    else:
        text = extract_text_from_txt(file_bytes)

    if not text.strip():
        raise ValueError(f"Could not extract text from {filename}")

    # Create document record
    doc_result = supabase.table("documents").insert({
        "name": filename,
        "status": "processing",
    }).execute()

    document_id = doc_result.data[0]["id"]

    try:
        # Chunk the text
        chunks = chunk_text(text)

        # Embed all chunks in one batch call
        embeddings = embed_batch([c for c in chunks])

        # Insert chunks into Supabase
        chunk_records = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            chunk_records.append({
                "document_id": document_id,
                "content": chunk,
                "embedding": embedding,
                "metadata": {
                    "filename": filename,
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                },
            })

        # Insert in batches of 20 to avoid payload limits
        batch_size = 20
        for i in range(0, len(chunk_records), batch_size):
            batch = chunk_records[i:i + batch_size]
            supabase.table("chunks").insert(batch).execute()

        # Update document status to indexed
        supabase.table("documents").update({
            "status": "indexed",
            "chunk_count": len(chunks),
        }).eq("id", document_id).execute()

        return {
            "document_id": document_id,
            "filename": filename,
            "chunks": len(chunks),
            "status": "indexed",
        }

    except Exception as e:
        # Mark as failed
        supabase.table("documents").update({
            "status": "failed",
        }).eq("id", document_id).execute()
        raise e