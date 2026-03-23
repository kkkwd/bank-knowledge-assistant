from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_all(self) -> list[Document]:
        return list(self.db.scalars(select(Document).order_by(Document.uploaded_at.desc())).all())

    def get(self, document_id: int) -> Document | None:
        return self.db.get(Document, document_id)

    def add(self, document: Document) -> Document:
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def delete(self, document_id: int) -> bool:
        document = self.get(document_id)
        if document is None:
            return False
        self.db.delete(document)
        self.db.commit()
        return True

    def mark_for_reindex(self, document: Document) -> Document:
        document.index_status = "queued"
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document
