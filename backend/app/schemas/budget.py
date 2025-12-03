from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from decimal import Decimal


# Fixed Expense Schemas
class FixedExpenseBase(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    amount: Decimal = Field(..., ge=0, decimal_places=2)


class FixedExpenseCreate(FixedExpenseBase):
    pass


class FixedExpense(FixedExpenseBase):
    id: int
    profile_id: int

    model_config = ConfigDict(from_attributes=True)


# Variable Expense Schemas
class VariableExpenseBase(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    min_amount: Decimal = Field(..., ge=0, decimal_places=2)
    max_amount: Decimal = Field(..., ge=0, decimal_places=2)


class VariableExpenseCreate(VariableExpenseBase):
    pass


class VariableExpense(VariableExpenseBase):
    id: int
    profile_id: int

    model_config = ConfigDict(from_attributes=True)


# Financial Goal Schemas
class FinancialGoalBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    target_amount: Decimal = Field(..., gt=0, decimal_places=2)
    current_amount: Decimal = Field(default=Decimal("0"), ge=0, decimal_places=2)
    deadline: date | None = None
    priority: int = Field(default=1, ge=1, le=10)


class FinancialGoalCreate(FinancialGoalBase):
    pass


class FinancialGoalUpdate(BaseModel):
    name: str | None = None
    target_amount: Decimal | None = None
    current_amount: Decimal | None = None
    deadline: date | None = None
    priority: int | None = None


class FinancialGoal(FinancialGoalBase):
    id: int
    profile_id: int

    model_config = ConfigDict(from_attributes=True)


# Budget Profile Schemas
class BudgetProfileBase(BaseModel):
    monthly_income: Decimal = Field(..., gt=0, decimal_places=2)


class BudgetProfileCreate(BudgetProfileBase):
    fixed_expenses: list[FixedExpenseCreate] = []
    variable_expenses: list[VariableExpenseCreate] = []
    financial_goals: list[FinancialGoalCreate] = []


class BudgetProfileUpdate(BaseModel):
    monthly_income: Decimal | None = None
    fixed_expenses: list[FixedExpenseCreate] | None = None
    variable_expenses: list[VariableExpenseCreate] | None = None
    financial_goals: list[FinancialGoalCreate] | None = None


class BudgetProfile(BudgetProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    fixed_expenses: list[FixedExpense] = []
    variable_expenses: list[VariableExpense] = []
    financial_goals: list[FinancialGoal] = []

    model_config = ConfigDict(from_attributes=True)


# Optimization Result Schema
class OptimizationResult(BaseModel):
    id: int
    profile_id: int
    result_json: dict
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
