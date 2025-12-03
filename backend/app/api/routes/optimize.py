from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session

from ...schemas.optimization import (
    OptimizationRequest,
    OptimizationResponse,
    ScenarioRequest
)
from ...models.budget import (
    BudgetProfile,
    OptimizationResult as OptimizationResultModel
)
from ...services.optimizer import optimize_budget, generate_recommendations
from ...api.deps import CurrentUser, DatabaseSession

router = APIRouter()


@router.post("/", response_model=OptimizationResponse)
def run_optimization(
    request: OptimizationRequest,
    current_user: CurrentUser,
    db: DatabaseSession
):
    """
    Run budget optimization using current user's profile.
    """
    # Get user's budget profile
    profile = db.query(BudgetProfile).filter(
        BudgetProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget profile not found. Please create one first."
        )

    # Prepare data for optimization
    monthly_income = float(profile.monthly_income)

    fixed_expenses = {
        expense.category: float(expense.amount)
        for expense in profile.fixed_expenses
    }

    variable_categories = {
        expense.category: (float(expense.min_amount), float(expense.max_amount))
        for expense in profile.variable_expenses
    }

    # Determine savings goal
    savings_goal = 0
    months_to_goal = 12

    if request.goal_id:
        # Optimize for specific goal
        goal = next(
            (g for g in profile.financial_goals if g.id == request.goal_id),
            None
        )
        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Financial goal not found"
            )
        savings_goal = float(goal.target_amount - goal.current_amount)

        if goal.deadline:
            from datetime import datetime
            months_diff = (goal.deadline.year - datetime.now().year) * 12 + \
                         (goal.deadline.month - datetime.now().month)
            months_to_goal = max(1, months_diff)
    else:
        # Use highest priority goal if no specific goal requested
        if profile.financial_goals:
            top_goal = max(profile.financial_goals, key=lambda g: g.priority)
            savings_goal = float(top_goal.target_amount - top_goal.current_amount)

            if top_goal.deadline:
                from datetime import datetime
                months_diff = (top_goal.deadline.year - datetime.now().year) * 12 + \
                             (top_goal.deadline.month - datetime.now().month)
                months_to_goal = max(1, months_diff)

    # Run optimization
    result = optimize_budget(
        monthly_income=monthly_income,
        fixed_expenses=fixed_expenses,
        variable_categories=variable_categories,
        savings_goal=savings_goal,
        months_to_goal=months_to_goal,
        optimization_mode=request.optimization_mode
    )

    # Save result to database if successful
    if result["status"] == "optimal":
        opt_result = OptimizationResultModel(
            profile_id=profile.id,
            result_json=result
        )
        db.add(opt_result)
        db.commit()

    return OptimizationResponse(**result)


@router.post("/scenario", response_model=OptimizationResponse)
def run_scenario_analysis(request: ScenarioRequest):
    """
    Run what-if scenario analysis without saving to database.
    Allows users to test different income/expense scenarios.
    """
    # Convert Decimal to float for optimization
    monthly_income = float(request.monthly_income)

    fixed_expenses = {
        cat: float(amt) for cat, amt in request.fixed_expenses.items()
    }

    variable_categories = {
        cat: (float(bounds[0]), float(bounds[1]))
        for cat, bounds in request.variable_categories.items()
    }

    savings_goal = float(request.savings_goal)
    months_to_goal = request.months_to_goal

    # Run optimization
    result = optimize_budget(
        monthly_income=monthly_income,
        fixed_expenses=fixed_expenses,
        variable_categories=variable_categories,
        savings_goal=savings_goal,
        months_to_goal=months_to_goal,
        optimization_mode=request.optimization_mode
    )

    return OptimizationResponse(**result)


@router.get("/recommendations", response_model=list[str])
def get_recommendations(current_user: CurrentUser, db: DatabaseSession):
    """
    Get AI-generated savings recommendations based on spending patterns.
    """
    # Get user's budget profile
    profile = db.query(BudgetProfile).filter(
        BudgetProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget profile not found"
        )

    # Get latest optimization result
    latest_result = db.query(OptimizationResultModel).filter(
        OptimizationResultModel.profile_id == profile.id
    ).order_by(OptimizationResultModel.created_at.desc()).first()

    if not latest_result:
        return [
            "Run an optimization first to get personalized recommendations!",
            "Make sure to set your financial goals for better insights."
        ]

    result_data = latest_result.result_json

    if result_data.get("status") != "optimal":
        return [
            "Your current budget is infeasible. Consider adjusting your income, expenses, or goals.",
            result_data.get("message", "")
        ]

    # Generate recommendations
    variable_categories = {
        expense.category: (float(expense.min_amount), float(expense.max_amount))
        for expense in profile.variable_expenses
    }

    savings_goal = 0
    if profile.financial_goals:
        top_goal = max(profile.financial_goals, key=lambda g: g.priority)
        savings_goal = float(top_goal.target_amount - top_goal.current_amount)

    recommendations = generate_recommendations(
        spending_allocation=result_data.get("spending_allocation", {}),
        variable_categories=variable_categories,
        monthly_savings=result_data.get("monthly_savings", 0),
        savings_goal=savings_goal
    )

    return recommendations if recommendations else [
        "Your budget looks well-optimized!",
        "Keep tracking your expenses and adjusting as needed."
    ]
