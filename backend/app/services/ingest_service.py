from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.chunk import Chunk
from app.models.document import Document
from app.repositories.chunk_repository import ChunkRepository
from app.repositories.document_repository import DocumentRepository
from app.services.chunk_service import ChunkService
from app.services.parser_service import ParserService
from app.services.retrieval_service import RetrievalService


class IngestService:
    allowed_extensions = {".pdf", ".docx", ".txt", ".jpg", ".jpeg", ".png"}

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = DocumentRepository(db)
        self.chunk_repository = ChunkRepository(db)
        self.parser_service = ParserService()
        self.chunk_service = ChunkService()
        self.retrieval_service = RetrievalService(db)

    async def upload(self, knowledge_base_id: int, file: UploadFile) -> dict[str, str | int]:
        suffix = Path(file.filename or "").suffix.lower()
        if suffix not in self.allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {suffix or 'unknown'}",
            )

        upload_dir = Path(settings.upload_dir)
        upload_dir.mkdir(parents=True, exist_ok=True)
        stored_name = f"{uuid4().hex}{suffix}"
        target = upload_dir / stored_name
        content = await file.read()
        target.write_bytes(content)

        document = Document(
            knowledge_base_id=knowledge_base_id,
            file_name=stored_name,
            original_name=file.filename or stored_name,
            file_type=suffix.lstrip("."),
            storage_path=str(target),
            parse_status="uploaded",
            index_status="processing",
        )
        persisted = self.repository.add(document)
        indexed = self.index_document(persisted)
        return {"document_id": indexed.id, "status": indexed.index_status, "file_name": indexed.original_name}

    def index_document(self, document: Document) -> Document:
        try:
            document.parse_status = "processing"
            document.index_status = "processing"
            document.error_message = None
            self.db.add(document)
            self.db.commit()
            self.db.refresh(document)

            parsed = self.parser_service.parse(document.storage_path)
            sections = parsed["sections"]
            chunks = self.chunk_service.split_sections(sections)

            persisted_chunks = [
                Chunk(
                    document_id=document.id,
                    chunk_index=chunk.chunk_index,
                    page_number=chunk.page_number,
                    content=chunk.content,
                    normalized_content=self.retrieval_service.normalize_text(chunk.content),
                )
                for chunk in chunks
            ]
            self.chunk_repository.replace_for_document(document.id, persisted_chunks)

            document.parse_status = "parsed"
            document.index_status = "indexed" if persisted_chunks else "empty"
            document.chunk_count = len(persisted_chunks)
            document.error_message = None if persisted_chunks else "No extractable text found"
            self.db.add(document)
            self.db.commit()
            self.db.refresh(document)
            return document
        except Exception as exc:
            self.db.rollback()
            document.parse_status = "failed"
            document.index_status = "failed"
            document.chunk_count = 0
            document.error_message = str(exc)[:255]
            return self.repository.save(document)
