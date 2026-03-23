from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.session import ChatSession
from app.schemas.session import SessionCreate


class SessionRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_all(self) -> list[ChatSession]:
        return list(self.db.scalars(select(ChatSession).order_by(ChatSession.updated_at.desc())).all())

    def create(self, payload: SessionCreate) -> ChatSession:
        session_obj = ChatSession(**payload.model_dump())
        self.db.add(session_obj)
        self.db.commit()
        self.db.refresh(session_obj)
        return session_obj

    def get_with_messages(self, session_id: int) -> ChatSession | None:
        stmt = (
            select(ChatSession)
            .where(ChatSession.id == session_id)
            .options(selectinload(ChatSession.messages))
        )
        return self.db.scalars(stmt).first()

    def delete(self, session_id: int) -> bool:
        session_obj = self.db.get(ChatSession, session_id)
        if session_obj is None:
            return False
        self.db.delete(session_obj)
        self.db.commit()
        return True
