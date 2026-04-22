from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models import Transaction, User, Category
from app.schemas import TransactionCreate, TransactionOut
from app.dependencies import get_current_user
from app.database import get_db
from datetime import date

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/", response_model=TransactionOut)
async def create_transaction(
    tx: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Проверка, что категория принадлежит пользователю
    cat_check = await db.execute(select(Category).where(Category.id == tx.category_id, Category.user_id == user.id))
    if not cat_check.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Invalid category")
    
    new_tx = Transaction(
        amount=tx.amount,
        type=tx.type,
        date=tx.date,
        comment=tx.comment,
        user_id=user.id,
        category_id=tx.category_id
    )
    db.add(new_tx)
    await db.commit()
    await db.refresh(new_tx)
    return new_tx

@router.get("/", response_model=list[TransactionOut])
async def get_transactions(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
    start_date: date = None,
    end_date: date = None,
    category_id: int = None
):
    query = select(Transaction).where(Transaction.user_id == user.id)
    if start_date:
        query = query.where(Transaction.date >= start_date)
    if end_date:
        query = query.where(Transaction.date <= end_date)
    if category_id:
        query = query.where(Transaction.category_id == category_id)
    query = query.order_by(Transaction.date.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.delete("/{tx_id}")
async def delete_transaction(tx_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    await db.execute(delete(Transaction).where(Transaction.id == tx_id, Transaction.user_id == user.id))
    await db.commit()
    return {"ok": True}