from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.models import Budget, User, Transaction
from app.schemas import BudgetCreate, BudgetOut, BudgetProgress
from app.dependencies import get_current_user
from app.database import get_db
from datetime import date

router = APIRouter(prefix="/budgets", tags=["budgets"])

@router.post("/", response_model=BudgetOut)
async def set_budget(budget_data: BudgetCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    # Проверить, есть ли уже бюджет на этот месяц/категорию
    existing = await db.execute(
        select(Budget).where(
            Budget.user_id == user.id,
            Budget.year == budget_data.year,
            Budget.month == budget_data.month,
            Budget.category_id == budget_data.category_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Budget already exists for this period")
    new_budget = Budget(**budget_data.dict(), user_id=user.id)
    db.add(new_budget)
    await db.commit()
    await db.refresh(new_budget)
    return new_budget

@router.get("/progress")
async def get_budget_progress(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    today = date.today()
    year, month = today.year, today.month
    # Получить все бюджеты пользователя на текущий месяц
    budgets = await db.execute(
        select(Budget).where(Budget.user_id == user.id, Budget.year == year, Budget.month == month)
    )
    budgets = budgets.scalars().all()
    # Получить расходы по категориям за месяц
    expenses_by_cat = await db.execute(
        select(Transaction.category_id, func.sum(Transaction.amount))
        .where(Transaction.user_id == user.id, Transaction.type == "expense", Transaction.date >= date(year, month, 1))
        .group_by(Transaction.category_id)
    )
    expenses = {cat_id: float(amount) for cat_id, amount in expenses_by_cat.all()}
    
    result = []
    for b in budgets:
        spent = expenses.get(b.category_id, 0.0) if b.category_id else sum(expenses.values())
        percent = (spent / b.limit_amount) * 100 if b.limit_amount > 0 else 0
        result.append({
            "budget_id": b.id,
            "category_id": b.category_id,
            "limit": b.limit_amount,
            "spent": spent,
            "percent": percent,
            "status": "ok" if percent < 80 else "warning" if percent < 100 else "exceeded"
        })
    return result