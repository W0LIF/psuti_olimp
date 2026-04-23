from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Category, User
from app.schemas import CategoryOut, CategoryCreate
from app.dependencies import get_current_user
from app.database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])

# Предустановленные категории (icon, name)
DEFAULT_CATEGORIES = [
    ("🍔", "Еда"), ("🚌", "Транспорт"), ("📚", "Учёба"), 
    ("🎬", "Развлечение"), ("☕", "Кофе"), ("🛒", "Покупки"), 
    ("🏠", "Дом"), ("💰", "Стипендия"), ("📦", "Прочее")
]

@router.get("/", response_model=list[CategoryOut])
async def get_categories(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Проверить, есть ли дефолтные категории у пользователя
    result = await db.execute(select(Category).where(Category.user_id == user.id, Category.is_default == 1))
    existing_defaults = result.scalars().all()
    existing_names = {cat.name for cat in existing_defaults}
    
    # Создать недостающие дефолтные категории
    for icon, name in DEFAULT_CATEGORIES:
        if name not in existing_names:
            new_cat = Category(name=name, icon=icon, is_default=1, user_id=user.id)
            db.add(new_cat)
    
    if db.new or db.dirty:  # Если добавили новые
        await db.commit()
    
    # Вернуть все категории пользователя
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
