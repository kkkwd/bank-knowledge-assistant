from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.knowledge_base import KnowledgeBase
from app.schemas.knowledge_base import KnowledgeBaseCreate


class KnowledgeBaseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_all(self) -> list[KnowledgeBase]:
        return list(self.db.scalars(select(KnowledgeBase).order_by(KnowledgeBase.id)).all())

    def create(self, payload: KnowledgeBaseCreate) -> KnowledgeBase:
        knowledge_base = KnowledgeBase(**payload.model_dump())
        self.db.add(knowledge_base)
        self.db.commit()
        self.db.refresh(knowledge_base)
        return knowledge_base
