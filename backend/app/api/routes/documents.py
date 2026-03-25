from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.document_repository import DocumentRepository
from app.schemas.document import DocumentRead, DocumentReindexResponse, DocumentUploadResponse
from app.services.ingest_service import IngestService

router = APIRouter()


@router.get("", response_model=list[DocumentRead])
def list_documents(db: Session = Depends(get_db)) -> list[DocumentRead]:
    return DocumentRepository(db).list_all()


@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    knowledge_base_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> DocumentUploadResponse:
    service = IngestService(db)
    return await service.upload(knowledge_base_id=knowledge_base_id, file=file)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, db: Session = Depends(get_db)) -> None:
    deleted = DocumentRepository(db).delete(document_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")


@router.post("/{document_id}/reindex", response_model=DocumentReindexResponse)
def reindex_document(document_id: int, db: Session = Depends(get_db)) -> DocumentReindexResponse:
    repository = DocumentRepository(db)
    document = repository.get(document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    indexed = IngestService(db).index_document(document)
    return DocumentReindexResponse(document_id=document_id, status=indexed.index_status)
