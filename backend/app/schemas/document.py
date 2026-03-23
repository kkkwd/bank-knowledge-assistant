from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    knowledge_base_id: int
    file_name: str
    original_name: str
    file_type: str
    storage_path: str
    parse_status: str
    index_status: str
    chunk_count: int
    error_message: str | None
    uploaded_at: datetime
    updated_at: datetime



class DocumentUploadResponse(BaseModel):
    document_id: int
    status: str
    file_name: str


class DocumentReindexResponse(BaseModel):
    document_id: int
    status: str
