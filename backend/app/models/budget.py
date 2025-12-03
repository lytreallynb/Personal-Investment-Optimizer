from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from ..core.database import Base


class BudgetProfile(Base):
    __tablename__ = "budget_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    monthly_income = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="budget_profiles")
    fixed_expenses = relationship("FixedExpense", back_populates="profile", cascade="all, delete-orphan")
    variable_expenses = relationship("VariableExpense", back_populates="profile", cascade="all, delete-orphan")
    financial_goals = relationship("FinancialGoal", back_populates="profile", cascade="all, delete-orphan")
    optimization_results = relationship("OptimizationResult", back_populates="profile", cascade="all, delete-orphan")


class FixedExpense(Base):
    __tablename__ = "fixed_expenses"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("budget_profiles.id"), nullable=False)
    category = Column(String(100), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)

    # Relationships
    profile = relationship("BudgetProfile", back_populates="fixed_expenses")


class VariableExpense(Base):
    __tablename__ = "variable_expenses"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("budget_profiles.id"), nullable=False)
    category = Column(String(100), nullable=False)
    min_amount = Column(Numeric(10, 2), nullable=False)
    max_amount = Column(Numeric(10, 2), nullable=False)

    # Relationships
    profile = relationship("BudgetProfile", back_populates="variable_expenses")


class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("budget_profiles.id"), nullable=False)
    name = Column(String(255), nullable=False)
    target_amount = Column(Numeric(10, 2), nullable=False)
    current_amount = Column(Numeric(10, 2), default=0)
    deadline = Column(Date, nullable=True)
    priority = Column(Integer, default=1)

    # Relationships
    profile = relationship("BudgetProfile", back_populates="financial_goals")


class OptimizationResult(Base):
    __tablename__ = "optimization_results"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("budget_profiles.id"), nullable=False)
    result_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    profile = relationship("BudgetProfile", back_populates="optimization_results")
