from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas import UserCreate, UserOut, Token
from app.models import User, Category
from app.auth import get_password_hash, create_access_token, verify_password
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

# Предустановленные категории (id, name, icon)
DEFAULT_CATEGORIES = [
    ("🍔", "Еда"), ("🚌", "Транспорт"), ("🎬", "Развлечения"), 
    ("📚", "Учёба"), ("🏥", "Здоровье"), ("🛒", "Другое")
]

@router.post("/register", response_model=UserOut)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Проверка существующего email
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed, full_name=user_data.full_name)
    db.add(new_user)
    await db.flush()  # чтобы получить user.id
    
    # Создать предустановленные категории для пользователя
    for icon, name in DEFAULT_CATEGORIES:
        cat = Category(name=name, icon=icon, is_default=1, user_id=new_user.id)
        db.add(cat)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_current_user_endpoint(user: User = Depends(get_current_user)):
    return user