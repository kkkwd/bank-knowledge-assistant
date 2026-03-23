from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.message import MessageRead


class SessionCreate(BaseModel):
    knowledge_base_id: int
    title: str


class SessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    knowledge_base_id: int
    title: str
    created_at: datetime
    updated_at: datetime



class SessionDetail(SessionRead):
    messages: list[MessageRead]
