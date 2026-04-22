# app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List
from enum import Enum

class TransactionTypeEnum(str, Enum):
    income = "income"
    expense = "expense"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TransactionCreate(BaseModel):
    amount: float
    type: TransactionTypeEnum
    date: date
    comment: Optional[str] = None
    category_id: int

class TransactionOut(BaseModel):
    id: int
    amount: float
    type: TransactionTypeEnum
    date: date
    comment: Optional[str] = None
    category_id: int
    user_id: int
    class Config:
        from_attributes = True

class BudgetCreate(BaseModel):
    month: int
    year: int
    category_id: Optional[int] = None
    limit_amount: float

class BudgetOut(BaseModel):
    id: int
    month: int
    year: int
    category_id: Optional[int]
    limit_amount: float
    user_id: int
    class Config:
        from_attributes = True

class BudgetProgress(BaseModel):
    budget_id: int
    category_id: Optional[int]
    limit: float
    spent: float
    percent: float
    status: str

class DashboardStats(BaseModel):
    balance: float
    total_income: float
    total_expense: float
    category_breakdown: List[dict]

class CategoryExpense(BaseModel):
    category: str
    icon: str
    amount: float

class CategoryOut(BaseModel):
    id: int
    name: str
    icon: str
    is_default: bool
    user_id: int
    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str
    icon: str
    is_default: Optional[bool] = False