from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpStatus, PULP_CBC_CMD
from decimal import Decimal
from typing import Literal


def optimize_budget(
    monthly_income: float,
    fixed_expenses: dict[str, float],
    variable_categories: dict[str, tuple[float, float]],  # {category: (min, max)}
    savings_goal: float = 0,
    months_to_goal: int = 12,
    optimization_mode: Literal["max_savings", "balanced", "fastest_goal"] = "max_savings",
    timeout: int = 10
) -> dict:
    """
    Solve the budget optimization problem using Linear Programming.

    Decision variables:
    - x[i]: monthly spending in category i
    - s: monthly savings

    Objective (max_savings mode):
    - maximize: s

    Constraints:
    - sum(x[i]) + sum(fixed) + s = monthly_income  (budget balance)
    - min[i] <= x[i] <= max[i]  (category bounds)
    - s * months_to_goal >= savings_goal  (goal constraint)
    - s >= 0  (non-negative savings)

    Args:
        monthly_income: Total monthly income
        fixed_expenses: Dictionary of fixed expense categories and amounts
        variable_categories: Dictionary of variable categories with (min, max) bounds
        savings_goal: Target savings amount
        months_to_goal: Number of months to reach savings goal
        optimization_mode: Optimization objective ("max_savings", "balanced", "fastest_goal")
        timeout: Solver timeout in seconds

    Returns:
        Dictionary with optimization results or infeasibility message
    """

    # Create the LP problem
    prob = LpProblem("Budget_Optimization", LpMaximize)

    # Decision variables for variable spending categories
    spending = {}
    for cat, (min_amt, max_amt) in variable_categories.items():
        spending[cat] = LpVariable(
            f"spend_{cat}",
            lowBound=min_amt,
            upBound=max_amt
        )

    # Decision variable for monthly savings
    savings = LpVariable("savings", lowBound=0)

    # Objective function based on mode
    if optimization_mode == "max_savings":
        # Maximize savings
        prob += savings, "Maximize_Savings"

    elif optimization_mode == "balanced":
        # Maximize savings while maintaining lifestyle quality
        # Penalize being too far from maximum spending in each category
        lifestyle_quality = lpSum([
            spending[cat] / max_amt
            for cat, (min_amt, max_amt) in variable_categories.items()
        ])
        # Weighted objective: 70% savings, 30% lifestyle
        prob += savings + 0.3 * lifestyle_quality, "Balanced_Objective"

    elif optimization_mode == "fastest_goal":
        # Minimize spending to maximize savings (same as max_savings but with tighter constraints)
        prob += savings, "Fastest_Goal"

    # Constraint 1: Budget balance
    # Total spending + savings = income
    total_fixed = sum(fixed_expenses.values())
    total_variable_spending = lpSum(list(spending.values()))
    prob += total_variable_spending + savings + total_fixed == monthly_income, "Budget_Balance"

    # Constraint 2: Goal achievement
    # Monthly savings must be enough to reach goal in specified months
    if savings_goal > 0 and months_to_goal > 0:
        min_monthly_savings = savings_goal / months_to_goal
        prob += savings >= min_monthly_savings, "Goal_Constraint"

    # Solve the problem
    solver = PULP_CBC_CMD(msg=0, timeLimit=timeout)
    prob.solve(solver)

    # Check solution status
    status = LpStatus[prob.status]

    if status != "Optimal":
        # Calculate why it's infeasible
        total_fixed_float = float(total_fixed)
        min_variable = sum(min_amt for min_amt, max_amt in variable_categories.values())
        min_required = total_fixed_float + min_variable

        if savings_goal > 0 and months_to_goal > 0:
            min_savings_required = savings_goal / months_to_goal
            min_required += min_savings_required

        message = f"Cannot meet goals with current income/constraints. "
        message += f"Minimum required income: ${min_required:.2f}, "
        message += f"Current income: ${monthly_income:.2f}. "

        if min_required > monthly_income:
            shortfall = min_required - monthly_income
            message += f"Monthly shortfall: ${shortfall:.2f}. "
            message += "Consider: (1) Increasing income, (2) Reducing fixed expenses, "
            message += "(3) Lowering minimum spending requirements, or (4) Adjusting savings goals."

        return {
            "status": "infeasible",
            "message": message
        }

    # Extract solution
    monthly_savings_value = savings.varValue
    spending_allocation = {cat: var.varValue for cat, var in spending.items()}
    total_monthly_spending = sum(spending_allocation.values()) + total_fixed

    # Calculate projected savings over time
    projected_savings = [monthly_savings_value * i for i in range(1, months_to_goal + 1)]

    # Calculate when goal will be reached
    months_to_goal_calculated = None
    if monthly_savings_value > 0 and savings_goal > 0:
        months_to_goal_calculated = savings_goal / monthly_savings_value

    return {
        "status": "optimal",
        "message": "Successfully optimized budget allocation",
        "monthly_savings": round(monthly_savings_value, 2),
        "spending_allocation": {cat: round(amt, 2) for cat, amt in spending_allocation.items()},
        "total_monthly_spending": round(total_monthly_spending, 2),
        "months_to_goal": round(months_to_goal_calculated, 2) if months_to_goal_calculated else None,
        "projected_savings": [round(s, 2) for s in projected_savings],
        "fixed_expenses": {cat: float(amt) for cat, amt in fixed_expenses.items()},
        "total_fixed_expenses": round(total_fixed, 2),
        "income_allocation": {
            "fixed_expenses": round(total_fixed, 2),
            "variable_expenses": round(sum(spending_allocation.values()), 2),
            "savings": round(monthly_savings_value, 2)
        }
    }


def generate_recommendations(
    spending_allocation: dict[str, float],
    variable_categories: dict[str, tuple[float, float]],
    monthly_savings: float,
    savings_goal: float
) -> list[str]:
    """
    Generate AI-style recommendations based on spending patterns.

    Args:
        spending_allocation: Current spending by category
        variable_categories: Category bounds
        monthly_savings: Current monthly savings
        savings_goal: Target savings goal

    Returns:
        List of recommendation strings
    """
    recommendations = []

    # Check if spending is close to max in any category
    for cat, amt in spending_allocation.items():
        if cat in variable_categories:
            min_amt, max_amt = variable_categories[cat]
            if amt > 0.8 * max_amt:  # Spending more than 80% of max
                potential_savings = amt - min_amt
                recommendations.append(
                    f"You're spending ${amt:.2f} on {cat}, close to your maximum. "
                    f"Reducing to minimum (${min_amt:.2f}) could save ${potential_savings:.2f}/month."
                )

    # Check savings rate
    if savings_goal > 0 and monthly_savings > 0:
        months_to_goal = savings_goal / monthly_savings
        if months_to_goal > 24:
            recommendations.append(
                f"At current savings rate, it will take {months_to_goal:.0f} months to reach your goal. "
                "Consider reducing discretionary spending to accelerate."
            )

    # Suggest emergency fund if no goal set
    if savings_goal == 0 and monthly_savings > 0:
        recommendations.append(
            f"Great job saving ${monthly_savings:.2f}/month! "
            "Consider setting a specific goal like building a 6-month emergency fund."
        )

    return recommendations
