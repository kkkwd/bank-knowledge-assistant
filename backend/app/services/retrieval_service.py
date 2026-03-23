from app.schemas.chat import RetrievedChunk


class RetrievalService:
    def retrieve(self, question: str, top_k: int) -> list[RetrievedChunk]:
        # Placeholder retrieval to keep the scaffold runnable before vector search lands.
        return [
            RetrievedChunk(
                chunk_index=index,
                score=1.0 - (index * 0.1),
                document_name="Demo Knowledge Document",
                content=f"Retrieved placeholder chunk {index + 1} for question: {question}",
            )
            for index in range(top_k)
        ]
