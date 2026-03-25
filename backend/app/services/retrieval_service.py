import re
from collections import Counter

from sqlalchemy.orm import Session

from app.repositories.chunk_repository import ChunkRepository
from app.schemas.chat import RetrievedChunk


class RetrievalService:
    def __init__(self, db: Session) -> None:
        self.chunk_repository = ChunkRepository(db)

    def retrieve(self, knowledge_base_id: int, question: str, top_k: int) -> list[RetrievedChunk]:
        normalized_question = self._normalize(question)
        if not normalized_question:
            return []

        query_terms = self._extract_terms(normalized_question)
        indexed_chunks = self.chunk_repository.list_indexed_by_knowledge_base(knowledge_base_id)
        scored_chunks: list[tuple[float, object]] = []

        for chunk in indexed_chunks:
            score = self._score_chunk(chunk.normalized_content, normalized_question, query_terms)
            if score <= 0:
                continue
            scored_chunks.append((score, chunk))

        scored_chunks.sort(key=lambda item: (item[0], -item[1].chunk_index), reverse=True)
        return [
            RetrievedChunk(
                chunk_index=chunk.chunk_index,
                score=round(score, 4),
                document_name=chunk.document.original_name,
                content=chunk.content,
                page_number=chunk.page_number,
            )
            for score, chunk in scored_chunks[:top_k]
        ]

    def normalize_text(self, text: str) -> str:
        return self._normalize(text)

    def _score_chunk(self, normalized_chunk: str, normalized_question: str, query_terms: list[str]) -> float:
        if normalized_question in normalized_chunk:
            return 10.0 + min(len(normalized_question) / 40.0, 3.0)

        chunk_terms = Counter(self._extract_terms(normalized_chunk))
        if not chunk_terms:
            return 0.0

        score = 0.0
        matched_numeric_term = False
        for term in query_terms:
            if term in chunk_terms:
                weight = 1.0
                if any(char.isdigit() for char in term):
                    weight += 2.5
                    matched_numeric_term = True
                if len(term) >= 3:
                    weight += min(len(term) * 0.2, 1.5)
                score += weight + min(chunk_terms[term] * 0.2, 0.8)

        numeric_terms = [term for term in query_terms if any(char.isdigit() for char in term)]
        if numeric_terms and not matched_numeric_term:
            score *= 0.45

        duration_terms = re.findall(r"\d+(?:年|个月|月)", normalized_question)
        if duration_terms and not any(term in normalized_chunk for term in duration_terms):
            score *= 0.35
        return score

    def _extract_terms(self, text: str) -> list[str]:
        words = [item for item in re.findall(r"[a-z0-9]+|[\u4e00-\u9fff]+", text) if item]
        terms: list[str] = []
        for word in words:
            if re.fullmatch(r"[\u4e00-\u9fff]+", word):
                if len(word) <= 2:
                    terms.append(word)
                else:
                    terms.extend(word[index : index + 2] for index in range(len(word) - 1))
                    terms.append(word)
            else:
                terms.append(word)
        if len(text) >= 2:
            terms.extend(text[index : index + 2] for index in range(len(text) - 1))
        if len(text) >= 3:
            terms.extend(text[index : index + 3] for index in range(len(text) - 2))
        return terms

    def _normalize(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r"\s+", "", text)
        return re.sub(r"[^\w\u4e00-\u9fff]+", "", text)
