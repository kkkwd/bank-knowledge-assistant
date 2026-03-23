from pathlib import Path


class ParserService:
    def parse(self, storage_path: str) -> dict[str, str]:
        path = Path(storage_path)
        if path.suffix.lower() == ".txt":
            return {"text": path.read_text(encoding="utf-8"), "title": path.stem}
        return {"text": "", "title": path.stem}
