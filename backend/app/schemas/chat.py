from pydantic import BaseModel, Field


class Citation(BaseModel):
    document_name: str
    knowledge_base_name: str
    chunk_index: int
    snippet_text: str
    page_number: int | None = None


class RetrievedChunk(BaseModel):
    chunk_index: int
    score: float
    document_name: str
    content: str
    page_number: int | None = None


class ChatAskRequest(BaseModel):
    session_id: int
    knowledge_base_id: int
    question: str = Field(min_length=1)
    top_k: int = Field(default=4, ge=1, le=10)


class ChatAskResponse(BaseModel):
    answer: str
    citations: list[Citation]
    retrieved_chunks: list[RetrievedChunk]
    session_id: int
