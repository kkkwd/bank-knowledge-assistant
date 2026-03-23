from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.message import Message
from app.models.session import ChatSession


class MetricsService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def overview(self) -> dict[str, int]:
        document_count = self.db.scalar(select(func.count(Document.id))) or 0
        session_count = self.db.scalar(select(func.count(ChatSession.id))) or 0
        message_count = self.db.scalar(select(func.count(Message.id))) or 0
        indexed_count = (
            self.db.scalar(select(func.count(Document.id)).where(Document.index_status == "indexed")) or 0
        )
        chunk_count = self.db.scalar(select(func.coalesce(func.sum(Document.chunk_count), 0))) or 0
        return {
            "document_count": int(document_count),
            "session_count": int(session_count),
            "message_count": int(message_count),
            "indexed_document_count": int(indexed_count),
            "chunk_count": int(chunk_count),
        }

    def recent_questions(self) -> list[str]:
        stmt = (
            select(Message.content)
            .where(Message.role == "user")
            .order_by(Message.created_at.desc())
            .limit(10)
        )
        return list(self.db.scalars(stmt).all())
