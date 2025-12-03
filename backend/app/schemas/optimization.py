from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Literal


class OptimizationRequest(BaseModel):
    """Request schema for optimization endpoint."""
    optimization_mode: Literal["max_savings", "balanced", "fastest_goal"] = "max_savings"
    goal_id: int | None = None  # Specific goal to optimize for


class OptimizationResponse(BaseModel):
    """Response schema for optimization results."""
    status: Literal["optimal", "infeasible", "error"]
    message: str | None = None
    monthly_savings: Decimal | None = None
    spending_allocation: dict[str, float] | None = None
    total_monthly_spending: Decimal | None = None
    months_to_goal: float | None = None
    projected_savings: list[float] | None = None


class ScenarioRequest(BaseModel):
    """Request schema for what-if scenario analysis."""
    monthly_income: Decimal = Field(..., gt=0)
    fixed_expenses: dict[str, Decimal]
    variable_categories: dict[str, tuple[Decimal, Decimal]]
    savings_goal: Decimal = Field(default=Decimal("0"), ge=0)
    months_to_goal: int = Field(default=12, gt=0)
    optimization_mode: Literal["max_savings", "balanced", "fastest_goal"] = "max_savings"
