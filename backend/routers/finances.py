from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, auth, database
from typing import List

router = APIRouter(prefix="/api/finances", tags=["finances"])

@router.post("/income", response_model=schemas.IncomeResponse)
def add_income(income: schemas.IncomeCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    data = income.model_dump(exclude_unset=True)
    db_income = models.Income(**data, owner_id=current_user.id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

@router.post("/expense", response_model=schemas.ExpenseResponse)
def add_expense(expense: schemas.ExpenseCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    expense_data = expense.model_dump(exclude_unset=True)
    if expense.category == "Mileage" and expense.miles is not None:
        expense_data["amount"] = 0.0 # Will calculate on dashboard
    
    db_expense = models.Expense(**expense_data, owner_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    total_income = db.query(func.sum(models.Income.amount)).filter(models.Income.owner_id == current_user.id).scalar() or 0.0
    
    standard_expenses = db.query(func.sum(models.Expense.amount)).filter(
        models.Expense.owner_id == current_user.id,
        models.Expense.category != "Mileage"
    ).scalar() or 0.0

    total_miles = db.query(func.sum(models.Expense.miles)).filter(
        models.Expense.owner_id == current_user.id,
        models.Expense.category == "Mileage"
    ).scalar() or 0.0

    mileage_deduction = 0.0
    if total_miles > 10000:
        mileage_deduction = (10000 * 0.45) + ((total_miles - 10000) * 0.25)
    else:
        mileage_deduction = total_miles * 0.45

    total_expenses = standard_expenses + mileage_deduction
    net_profit = total_income - total_expenses

    # Tax Calculation UK 2026/27
    personal_allowance = 12570
    
    # Implementing personal allowance reduction over £100,000 for accuracy
    if net_profit > 100000:
        reduction = (net_profit - 100000) / 2
        personal_allowance = max(0, personal_allowance - reduction)

    taxable_income = max(0.0, net_profit - personal_allowance)
    basic_rate_tax = 0.0
    higher_rate_tax = 0.0

    if taxable_income > 0:
        basic_band = 50270 - 12570 # £37,700
        basic_taxable = min(taxable_income, basic_band)
        basic_rate_tax = basic_taxable * 0.20
        
        if taxable_income > basic_band:
            higher_band = 125140 - 50270 # £74,870
            higher_taxable = min(taxable_income - basic_band, higher_band)
            higher_rate_tax = higher_taxable * 0.40

    total_tax = basic_rate_tax + higher_rate_tax
    net_after_tax = net_profit - total_tax

    return {
        "gross_income": round(total_income, 2),
        "expenses": {
            "standard": round(standard_expenses, 2),
            "mileage_deduction": round(mileage_deduction, 2),
            "total_miles": round(total_miles, 2),
            "total": round(total_expenses, 2)
        },
        "net_profit": round(net_profit, 2),
        "estimated_tax": round(total_tax, 2),
        "net_after_tax": round(net_after_tax, 2),
        "tax_breakdown": {
            "basic_rate": round(basic_rate_tax, 2),
            "higher_rate": round(higher_rate_tax, 2)
        }
    }

@router.get("/incomes", response_model=List[schemas.IncomeResponse])
def get_incomes(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Income).filter(models.Income.owner_id == current_user.id).order_by(models.Income.date.desc()).all()

@router.get("/expenses", response_model=List[schemas.ExpenseResponse])
def get_expenses(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Expense).filter(models.Expense.owner_id == current_user.id).order_by(models.Expense.date.desc()).all()
