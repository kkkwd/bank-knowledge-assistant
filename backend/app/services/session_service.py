from sqlalchemy.orm import Session


class SessionService:
    def __init__(self, db: Session) -> None:
        self.db = db
