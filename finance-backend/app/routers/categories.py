from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Category, User
from app.schemas import CategoryOut, CategoryCreate
from app.dependencies import get_current_user
from app.database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=list[CategoryOut])
async def get_categories(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(select(Category).where(Category.user_id == user.id))
    return result.scalars().all()

@router.post("/", response_model=CategoryOut)
async def create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    new_cat = Category(
        name=data.name,
        icon=data.icon,
        user_id=user.id,
        is_default=data.is_default or False
    )
    db.add(new_cat)
    await db.commit()
    await db.refresh(new_cat)
    return new_cat

@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Category).where(
            Category.id == category_id,
            Category.user_id == user.id,
            Category.is_default == False
        )
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=400, detail="Cannot delete default category or category not found")
    
    await db.delete(category)
    await db.commit()
    return {"ok": True}
