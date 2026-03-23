from sqlalchemy import select

from app.core.config import settings
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.document import Document
from app.models.knowledge_base import KnowledgeBase
from app.models.message import Message
from app.models.session import ChatSession


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        existing = db.scalars(select(KnowledgeBase)).first()
        if existing is not None:
            return
        for name in settings.default_knowledge_bases:
            code = name.lower().replace(" ", "_")
            db.add(KnowledgeBase(name=name, code=code, description=f"Default {name}"))
        db.commit()


__all__ = ["Document", "KnowledgeBase", "Message", "ChatSession"]
