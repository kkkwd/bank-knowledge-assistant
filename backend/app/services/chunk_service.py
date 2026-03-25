from dataclasses import dataclass


@dataclass
class ParsedSection:
    text: str
    page_number: int | None = None


@dataclass
class ChunkPayload:
    content: str
    chunk_index: int
    page_number: int | None = None


class ChunkService:
    def split_sections(
        self,
        sections: list[ParsedSection],
        chunk_size: int = 140,
        overlap: int = 20,
    ) -> list[ChunkPayload]:
        chunks: list[ChunkPayload] = []
        chunk_index = 0

        for section in sections:
            text = section.text.strip()
            if not text:
                continue

            start = 0
            while start < len(text):
                end = min(len(text), start + chunk_size)
                chunks.append(
                    ChunkPayload(
                        content=text[start:end].strip(),
                        chunk_index=chunk_index,
                        page_number=section.page_number,
                    )
                )
                chunk_index += 1
                if end == len(text):
                    break
                start = max(end - overlap, 0)

        return [chunk for chunk in chunks if chunk.content]
