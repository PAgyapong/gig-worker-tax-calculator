from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    job_role: Optional[str] = "General Gig Worker"

class UserResponse(UserBase):
    id: int
    job_role: str

    class Config:
        from_attributes = True

class IncomeBase(BaseModel):
    amount: float
    description: str
    date: Optional[datetime] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: int
    date: datetime
    owner_id: int

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    amount: Optional[float] = 0.0
    category: str
    description: str
    miles: Optional[float] = None
    date: Optional[datetime] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    date: datetime
    owner_id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
