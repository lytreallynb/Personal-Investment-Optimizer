from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session

from ...schemas.budget import (
    BudgetProfileCreate,
    BudgetProfileUpdate,
    BudgetProfile as BudgetProfileSchema,
    OptimizationResult as OptimizationResultSchema
)
from ...models.budget import (
    BudgetProfile as BudgetProfileModel,
    FixedExpense,
    VariableExpense,
    FinancialGoal,
    OptimizationResult
)
from ...api.deps import CurrentUser, DatabaseSession

router = APIRouter()


@router.post("/", response_model=BudgetProfileSchema, status_code=status.HTTP_201_CREATED)
def create_or_update_budget_profile(
    profile_in: BudgetProfileCreate,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Create or update budget profile for current user.
    If profile exists, it will be updated. Otherwise, a new one is created.
    """
    # Check if user already has a profile
    existing_profile = db.query(BudgetProfileModel).filter(
        BudgetProfileModel.user_id == current_user.id
    ).first()

    if existing_profile:
        # Update existing profile
        existing_profile.monthly_income = profile_in.monthly_income

        # Delete existing expenses and goals
        db.query(FixedExpense).filter(FixedExpense.profile_id == existing_profile.id).delete()
        db.query(VariableExpense).filter(VariableExpense.profile_id == existing_profile.id).delete()
        db.query(FinancialGoal).filter(FinancialGoal.profile_id == existing_profile.id).delete()

        profile = existing_profile
    else:
        # Create new profile
        profile = BudgetProfileModel(
            user_id=current_user.id,
            monthly_income=profile_in.monthly_income
        )
        db.add(profile)
        db.flush()  # Get the profile ID

    # Add fixed expenses
    for expense in profile_in.fixed_expenses:
        db_expense = FixedExpense(
            profile_id=profile.id,
            category=expense.category,
            amount=expense.amount
        )
        db.add(db_expense)

    # Add variable expenses
    for expense in profile_in.variable_expenses:
        db_expense = VariableExpense(
            profile_id=profile.id,
            category=expense.category,
            min_amount=expense.min_amount,
            max_amount=expense.max_amount
        )
        db.add(db_expense)

    # Add financial goals
    for goal in profile_in.financial_goals:
        db_goal = FinancialGoal(
            profile_id=profile.id,
            name=goal.name,
            target_amount=goal.target_amount,
            current_amount=goal.current_amount,
            deadline=goal.deadline,
            priority=goal.priority
        )
        db.add(db_goal)

    db.commit()
    db.refresh(profile)

    return profile


@router.get("/", response_model=BudgetProfileSchema)
def get_budget_profile(current_user: CurrentUser, db: DatabaseSession):
    """
    Get current user's budget profile.
    """
    profile = db.query(BudgetProfileModel).filter(
        BudgetProfileModel.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget profile not found. Please create one first."
        )

    return profile


@router.get("/history", response_model=list[OptimizationResultSchema])
def get_optimization_history(current_user: CurrentUser, db: DatabaseSession):
    """
    Get historical optimization results for current user.
    """
    profile = db.query(BudgetProfileModel).filter(
        BudgetProfileModel.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget profile not found"
        )

    results = db.query(OptimizationResult).filter(
        OptimizationResult.profile_id == profile.id
    ).order_by(OptimizationResult.created_at.desc()).limit(10).all()

    return results
