from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.chat import ChatAskRequest, ChatAskResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/ask", response_model=ChatAskResponse)
def ask_question(payload: ChatAskRequest, db: Session = Depends(get_db)) -> ChatAskResponse:
    return ChatService(db).ask(payload)
