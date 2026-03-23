from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document
from app.repositories.document_repository import DocumentRepository


class IngestService:
    allowed_extensions = {".pdf", ".docx", ".txt"}

    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = DocumentRepository(db)

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
            index_status="pending",
        )
        persisted = self.repository.add(document)
        return {
            "document_id": persisted.id,
            "status": persisted.parse_status,
            "file_name": persisted.original_name,
        }
