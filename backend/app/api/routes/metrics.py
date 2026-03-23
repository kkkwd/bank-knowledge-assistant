from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.metrics_service import MetricsService

router = APIRouter()


@router.get("/overview")
def get_overview(db: Session = Depends(get_db)) -> dict[str, int]:
    return MetricsService(db).overview()


@router.get("/recent-questions")
def get_recent_questions(db: Session = Depends(get_db)) -> list[str]:
    return MetricsService(db).recent_questions()
