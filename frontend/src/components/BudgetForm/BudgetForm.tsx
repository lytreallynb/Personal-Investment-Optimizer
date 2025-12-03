import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BudgetProfile, FixedExpense, VariableExpense, FinancialGoal } from '../../types';
import { useBudget } from '../../hooks/useBudget';

export function BudgetForm() {
  const navigate = useNavigate();
  const { saveProfile } = useBudget();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    { category: 'Rent/Mortgage', amount: 1500 },
    { category: 'Insurance', amount: 200 },
    { category: 'Subscriptions', amount: 50 },
  ]);
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>([
    { category: 'Groceries', min_amount: 200, max_amount: 600 },
    { category: 'Dining Out', min_amount: 0, max_amount: 400 },
    { category: 'Entertainment', min_amount: 50, max_amount: 300 },
    { category: 'Shopping', min_amount: 0, max_amount: 500 },
    { category: 'Transportation', min_amount: 50, max_amount: 300 },
    { category: 'Health/Fitness', min_amount: 0, max_amount: 200 },
  ]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([
    { name: 'Emergency Fund', target_amount: 10000, current_amount: 0, priority: 1 },
  ]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const profile: BudgetProfile = {
      monthly_income: monthlyIncome,
      fixed_expenses: fixedExpenses,
      variable_expenses: variableExpenses,
      financial_goals: financialGoals,
    };

    const success = await saveProfile(profile);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Failed to save budget profile');
    }
    setLoading(false);
  };

  const addFixedExpense = () => {
    setFixedExpenses([...fixedExpenses, { category: '', amount: 0 }]);
  };

  const updateFixedExpense = (index: number, field: keyof FixedExpense, value: any) => {
    const updated = [...fixedExpenses];
    updated[index] = { ...updated[index], [field]: value };
    setFixedExpenses(updated);
  };

  const removeFixedExpense = (index: number) => {
    setFixedExpenses(fixedExpenses.filter((_, i) => i !== index));
  };

  const addVariableExpense = () => {
    setVariableExpenses([...variableExpenses, { category: '', min_amount: 0, max_amount: 0 }]);
  };

  const updateVariableExpense = (index: number, field: keyof VariableExpense, value: any) => {
    const updated = [...variableExpenses];
    updated[index] = { ...updated[index], [field]: value };
    setVariableExpenses(updated);
  };

  const removeVariableExpense = (index: number) => {
    setVariableExpenses(variableExpenses.filter((_, i) => i !== index));
  };

  const addGoal = () => {
    setFinancialGoals([
      ...financialGoals,
      { name: '', target_amount: 0, current_amount: 0, priority: 1 },
    ]);
  };

  const updateGoal = (index: number, field: keyof FinancialGoal, value: any) => {
    const updated = [...financialGoals];
    updated[index] = { ...updated[index], [field]: value };
    setFinancialGoals(updated);
  };

  const removeGoal = (index: number) => {
    setFinancialGoals(financialGoals.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Setup</h1>
        <p className="text-gray-600">Step {step} of 4</p>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Income */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Monthly Income</h2>
          <p className="text-gray-600 mb-6">What is your total monthly income?</p>

          <div>
            <label className="label">Monthly Income ($)</label>
            <input
              type="number"
              className="input"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              min="0"
              step="100"
            />
          </div>
        </div>
      )}

      {/* Step 2: Fixed Expenses */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Fixed Expenses</h2>
          <p className="text-gray-600 mb-6">
            List your monthly fixed expenses (rent, insurance, subscriptions, etc.)
          </p>

          <div className="space-y-4">
            {fixedExpenses.map((expense, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="label">Category</label>
                  <input
                    type="text"
                    className="input"
                    value={expense.category}
                    onChange={(e) => updateFixedExpense(index, 'category', e.target.value)}
                    placeholder="e.g., Rent, Insurance"
                  />
                </div>
                <div className="flex-1">
                  <label className="label">Amount ($)</label>
                  <input
                    type="number"
                    className="input"
                    value={expense.amount}
                    onChange={(e) => updateFixedExpense(index, 'amount', Number(e.target.value))}
                    min="0"
                    step="10"
                  />
                </div>
                <button
                  onClick={() => removeFixedExpense(index)}
                  className="mt-6 px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button onClick={addFixedExpense} className="mt-4 btn-secondary">
            + Add Fixed Expense
          </button>
        </div>
      )}

      {/* Step 3: Variable Expenses */}
      {step === 3 && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Variable Expenses</h2>
          <p className="text-gray-600 mb-6">
            Set minimum and maximum spending limits for flexible categories
          </p>

          <div className="space-y-6">
            {variableExpenses.map((expense, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex gap-4 items-start mb-2">
                  <div className="flex-1">
                    <label className="label">Category</label>
                    <input
                      type="text"
                      className="input"
                      value={expense.category}
                      onChange={(e) => updateVariableExpense(index, 'category', e.target.value)}
                      placeholder="e.g., Groceries, Entertainment"
                    />
                  </div>
                  <button
                    onClick={() => removeVariableExpense(index)}
                    className="mt-6 px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Minimum ($)</label>
                    <input
                      type="number"
                      className="input"
                      value={expense.min_amount}
                      onChange={(e) =>
                        updateVariableExpense(index, 'min_amount', Number(e.target.value))
                      }
                      min="0"
                      step="10"
                    />
                  </div>
                  <div>
                    <label className="label">Maximum ($)</label>
                    <input
                      type="number"
                      className="input"
                      value={expense.max_amount}
                      onChange={(e) =>
                        updateVariableExpense(index, 'max_amount', Number(e.target.value))
                      }
                      min="0"
                      step="10"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addVariableExpense} className="mt-4 btn-secondary">
            + Add Variable Expense
          </button>
        </div>
      )}

      {/* Step 4: Financial Goals */}
      {step === 4 && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Financial Goals</h2>
          <p className="text-gray-600 mb-6">
            Set your savings goals and target amounts
          </p>

          <div className="space-y-6">
            {financialGoals.map((goal, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex gap-4 items-start mb-2">
                  <div className="flex-1">
                    <label className="label">Goal Name</label>
                    <input
                      type="text"
                      className="input"
                      value={goal.name}
                      onChange={(e) => updateGoal(index, 'name', e.target.value)}
                      placeholder="e.g., Emergency Fund, Vacation"
                    />
                  </div>
                  <button
                    onClick={() => removeGoal(index)}
                    className="mt-6 px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Target Amount ($)</label>
                    <input
                      type="number"
                      className="input"
                      value={goal.target_amount}
                      onChange={(e) => updateGoal(index, 'target_amount', Number(e.target.value))}
                      min="0"
                      step="100"
                    />
                  </div>
                  <div>
                    <label className="label">Current Amount ($)</label>
                    <input
                      type="number"
                      className="input"
                      value={goal.current_amount}
                      onChange={(e) => updateGoal(index, 'current_amount', Number(e.target.value))}
                      min="0"
                      step="100"
                    />
                  </div>
                  <div>
                    <label className="label">Priority (1-10)</label>
                    <input
                      type="number"
                      className="input"
                      value={goal.priority}
                      onChange={(e) => updateGoal(index, 'priority', Number(e.target.value))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="label">Deadline (optional)</label>
                  <input
                    type="date"
                    className="input"
                    value={goal.deadline || ''}
                    onChange={(e) => updateGoal(index, 'deadline', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <button onClick={addGoal} className="mt-4 btn-secondary">
            + Add Financial Goal
          </button>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {step < 4 ? (
          <button onClick={() => setStep(step + 1)} className="btn-primary">
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Optimize'}
          </button>
        )}
      </div>
    </div>
  );
}
