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

@router.get("/public/{user_id}")
async def get_public_transactions(
    user_id: int,
    month: int,
    year: int,
    db: AsyncSession = Depends(get_db)
):
    # Проверяем, что пользователь существует
    user_check = await db.execute(select(User).where(User.id == user_id))
    if not user_check.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получаем транзакции за месяц
    start_date = date(year, month, 1)
    end_date = date(year, month + 1, 1) if month < 12 else date(year + 1, 1, 1)
    
    result = await db.execute(
        select(Transaction, Category.name.label('category_name'))
        .join(Category, Transaction.category_id == Category.id)
        .where(Transaction.user_id == user_id, Transaction.date >= start_date, Transaction.date < end_date)
    )
    
    transactions = []
    for tx, cat_name in result:
        transactions.append({
            "id": tx.id,
            "amount": tx.amount,
            "type": tx.type,
            "date": tx.date.isoformat(),
            "comment": tx.comment,
            "category": cat_name
        })
    
    return transactions