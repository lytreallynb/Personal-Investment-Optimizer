export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface FixedExpense {
  id?: number;
  profile_id?: number;
  category: string;
  amount: number;
}

export interface VariableExpense {
  id?: number;
  profile_id?: number;
  category: string;
  min_amount: number;
  max_amount: number;
}

export interface FinancialGoal {
  id?: number;
  profile_id?: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  priority: number;
}

export interface BudgetProfile {
  id?: number;
  user_id?: number;
  monthly_income: number;
  created_at?: string;
  updated_at?: string;
  fixed_expenses: FixedExpense[];
  variable_expenses: VariableExpense[];
  financial_goals: FinancialGoal[];
}

export interface OptimizationRequest {
  optimization_mode: 'max_savings' | 'balanced' | 'fastest_goal';
  goal_id?: number;
}

export interface OptimizationResponse {
  status: 'optimal' | 'infeasible' | 'error';
  message?: string;
  monthly_savings?: number;
  spending_allocation?: Record<string, number>;
  total_monthly_spending?: number;
  months_to_goal?: number;
  projected_savings?: number[];
  fixed_expenses?: Record<string, number>;
  total_fixed_expenses?: number;
  income_allocation?: {
    fixed_expenses: number;
    variable_expenses: number;
    savings: number;
  };
}

export interface ScenarioRequest {
  monthly_income: number;
  fixed_expenses: Record<string, number>;
  variable_categories: Record<string, [number, number]>;
  savings_goal: number;
  months_to_goal: number;
  optimization_mode: 'max_savings' | 'balanced' | 'fastest_goal';
}
