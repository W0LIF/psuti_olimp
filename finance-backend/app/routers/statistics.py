from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.models import Transaction, User, Category
from app.dependencies import get_current_user
from app.database import get_db
from datetime import date, datetime
from app.schemas import DashboardStats, CategoryExpense

router = APIRouter(prefix="/stats", tags=["statistics"])

@router.get("/dashboard")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    today = date.today()
    first_day = date(today.year, today.month, 1)
    
    # Доходы и расходы за текущий месяц
    income_result = await db.execute(
        select(func.sum(Transaction.amount)).where(
            Transaction.user_id == user.id,
            Transaction.type == "income",
            Transaction.date >= first_day
        )
    )
    total_income = income_result.scalar() or 0.0
    
    expense_result = await db.execute(
        select(func.sum(Transaction.amount)).where(
            Transaction.user_id == user.id,
            Transaction.type == "expense",
            Transaction.date >= first_day
        )
    )
    total_expense = expense_result.scalar() or 0.0
    balance = total_income - total_expense
    
    # Расходы по категориям (для круговой диаграммы)
    cat_expenses = await db.execute(
        select(Category.name, Category.icon, func.sum(Transaction.amount))
        .join(Transaction, Transaction.category_id == Category.id)
        .where(Transaction.user_id == user.id, Transaction.type == "expense", Transaction.date >= first_day)
        .group_by(Category.id)
    )
    category_breakdown = [{"category": name, "icon": icon, "amount": float(amount)} for name, icon, amount in cat_expenses.all()]
    
    return {
        "balance": balance,
        "total_income": total_income,
        "total_expense": total_expense,
        "category_breakdown": category_breakdown
    }