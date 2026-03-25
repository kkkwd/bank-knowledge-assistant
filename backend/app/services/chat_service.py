import json

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.message import Message
from app.schemas.chat import ChatAskRequest, ChatAskResponse, Citation
from app.services.llm_service import LLMService
from app.services.retrieval_service import RetrievalService


class ChatService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.retrieval_service = RetrievalService(db)
        self.llm_service = LLMService()

    def ask(self, payload: ChatAskRequest) -> ChatAskResponse:
        retrieved_chunks = self.retrieval_service.retrieve(
            payload.knowledge_base_id,
            payload.question,
            payload.top_k,
        )
        citations = [
            Citation(
                document_name=chunk.document_name,
                knowledge_base_name=f"KB-{payload.knowledge_base_id}",
                chunk_index=chunk.chunk_index,
                snippet_text=chunk.content,
                page_number=chunk.page_number,
            )
            for chunk in retrieved_chunks[:3]
        ]
        answer, model_name = self._generate_answer(payload.question, retrieved_chunks)

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
                model_name=model_name,
            )
        )
        self.db.commit()

        return ChatAskResponse(
            answer=answer,
            citations=citations,
            retrieved_chunks=retrieved_chunks,
            session_id=payload.session_id,
        )

    def _generate_answer(self, question: str, retrieved_chunks: list) -> tuple[str, str]:
        if not retrieved_chunks:
            return (
                "未检索到相关资料，请尝试换一种问法，或先确认对应文档已经完成索引。",
                "retrieval-only",
            )

        try:
            return self.llm_service.answer_question(question, retrieved_chunks), settings.llm_model
        except Exception:
            return self._compose_fallback_answer(retrieved_chunks), "retrieval-fallback"

    def _compose_fallback_answer(self, retrieved_chunks: list) -> str:
        lines = ["当前 LLM 生成失败，以下为检索到的相关资料片段："]
        for index, chunk in enumerate(retrieved_chunks[:3], start=1):
            page_suffix = f"（第 {chunk.page_number} 页）" if chunk.page_number else ""
            lines.append(f"{index}. {chunk.document_name}{page_suffix}：{chunk.content[:180]}")
        return "\n".join(lines)
