from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.session_repository import SessionRepository
from app.schemas.session import SessionCreate, SessionDetail, SessionRead

router = APIRouter()


@router.get("", response_model=list[SessionRead])
def list_sessions(db: Session = Depends(get_db)) -> list[SessionRead]:
    return SessionRepository(db).list_all()


@router.post("", response_model=SessionRead, status_code=status.HTTP_201_CREATED)
def create_session(payload: SessionCreate, db: Session = Depends(get_db)) -> SessionRead:
    return SessionRepository(db).create(payload)


@router.get("/{session_id}", response_model=SessionDetail)
def get_session(session_id: int, db: Session = Depends(get_db)) -> SessionDetail:
    session_obj = SessionRepository(db).get_with_messages(session_id)
    if session_obj is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session_obj


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(session_id: int, db: Session = Depends(get_db)) -> None:
    deleted = SessionRepository(db).delete(session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
