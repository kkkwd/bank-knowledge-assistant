from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload

from app.models.chunk import Chunk
from app.models.document import Document


class ChunkRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def replace_for_document(self, document_id: int, chunks: list[Chunk]) -> None:
        self.db.execute(delete(Chunk).where(Chunk.document_id == document_id))
        for chunk in chunks:
            self.db.add(chunk)

    def list_indexed_by_knowledge_base(self, knowledge_base_id: int) -> list[Chunk]:
        stmt = (
            select(Chunk)
            .join(Chunk.document)
            .where(
                Document.knowledge_base_id == knowledge_base_id,
                Document.index_status == "indexed",
            )
            .options(selectinload(Chunk.document))
            .order_by(Chunk.document_id.asc(), Chunk.chunk_index.asc())
        )
        return list(self.db.scalars(stmt).all())
