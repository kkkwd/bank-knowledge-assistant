from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    content: str
    citations_json: str | None
    retrieval_json: str | None
    model_name: str | None
    created_at: datetime
