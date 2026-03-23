import json

from sqlalchemy.orm import Session

from app.models.message import Message
from app.schemas.chat import ChatAskRequest, ChatAskResponse, Citation
from app.services.retrieval_service import RetrievalService


class ChatService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.retrieval_service = RetrievalService()

    def ask(self, payload: ChatAskRequest) -> ChatAskResponse:
        retrieved_chunks = self.retrieval_service.retrieve(payload.question, payload.top_k)
        citations = [
            Citation(
                document_name=chunk.document_name,
                knowledge_base_name=f"KB-{payload.knowledge_base_id}",
                chunk_index=chunk.chunk_index,
                snippet_text=chunk.content,
            )
            for chunk in retrieved_chunks[:2]
        ]
        answer = (
            "This is a scaffold response. Retrieval, prompt composition, and model integration "
            "still need to be implemented."
        )

        self.db.add(Message(session_id=payload.session_id, role="user", content=payload.question))
        self.db.add(
            Message(
                session_id=payload.session_id,
                role="assistant",
                content=answer,
                citations_json=json.dumps([item.model_dump() for item in citations], ensure_ascii=False),
                retrieval_json=json.dumps(
                    [item.model_dump() for item in retrieved_chunks], ensure_ascii=False
                ),
                model_name="scaffold-placeholder",
            )
        )
        self.db.commit()

        return ChatAskResponse(
            answer=answer,
            citations=citations,
            retrieved_chunks=retrieved_chunks,
            session_id=payload.session_id,
        )
