from app.services.ingestion import ingest_document
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ingestion import ingest_document
from app.config import get_settings
from supabase import create_client

settings = get_settings()
supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

router = APIRouter()

ALLOWED_TYPES = ["application/pdf", "text/plain"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.get("/documents")
def list_documents():
    result = supabase.table("documents").select(
        "id, name, status, chunk_count, created_at"
    ).order("created_at", desc=True).execute()
    return {"documents": result.data}


@router.post("/documents/ingest")
async def ingest(file: UploadFile = File(...)):
    # File type check
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=422,
            detail="Only PDF and plain text files are supported."
        )

    file_bytes = await file.read()

    # File size check
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=422,
            detail="File size exceeds 10MB limit."
        )

    try:
        result = ingest_document(file_bytes, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/documents/{document_id}")
def delete_document(document_id: str):
    # Chunks are deleted automatically via cascade
    supabase.table("documents").delete().eq("id", document_id).execute()
    return {"message": "Document deleted successfully."}

@router.post("/documents/{document_id}/reingest")
async def reingest_document(document_id: str):
    # Mark as queued first
    supabase.table("documents").update({
        "status": "queued",
        "chunk_count": 0,
    }).eq("id", document_id).execute()

    # Delete existing chunks
    supabase.table("chunks").delete().eq("document_id", document_id).execute()

    # Fetch raw file from storage
    try:
        file_response = supabase.storage.from_("documents").download(document_id)
        result = ingest_document(file_response, document_id)
        return result
    except Exception as e:
        supabase.table("documents").update({
            "status": "failed",
        }).eq("id", document_id).execute()
        raise HTTPException(status_code=500, detail=str(e))