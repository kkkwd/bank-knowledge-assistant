class ChunkService:
    def split(self, text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
        if not text.strip():
            return []
        chunks: list[str] = []
        start = 0
        while start < len(text):
            end = min(len(text), start + chunk_size)
            chunks.append(text[start:end])
            if end == len(text):
                break
            start = max(end - overlap, 0)
        return chunks
