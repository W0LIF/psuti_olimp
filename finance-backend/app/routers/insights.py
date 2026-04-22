from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_current_user
from app.database import get_db
from app.models import User
from app.utils.insights_logic import generate_insights

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/")
async def get_insights(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    insights = await generate_insights(db, user.id)
    return {"insights": insights}