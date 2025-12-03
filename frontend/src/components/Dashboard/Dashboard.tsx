import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { useBudget, useOptimization } from '../../hooks/useBudget';
import { apiService } from '../../services/api';
import type { OptimizationResponse } from '../../types';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useBudget();
  const { result, loading: optLoading, runOptimization } = useOptimization();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<'max_savings' | 'balanced' | 'fastest_goal'>('max_savings');

  useEffect(() => {
    if (!profile) {
      navigate('/budget/new');
    } else if (!result) {
      // Run initial optimization
      runOptimization({ optimization_mode: selectedMode });
      fetchRecommendations();
    }
  }, [profile]);

  const fetchRecommendations = async () => {
    try {
      const recs = await apiService.getRecommendations();
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  const handleOptimize = async () => {
    await runOptimization({ optimization_mode: selectedMode });
    fetchRecommendations();
  };

  if (profileLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (optLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Optimizing your budget...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">No optimization results available</div>
      </div>
    );
  }

  if (result.status === 'infeasible') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card bg-red-50 border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Budget Not Feasible</h2>
          <p className="text-red-700 mb-4">{result.message}</p>
          <button onClick={() => navigate('/budget/new')} className="btn-primary">
            Update Budget Settings
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for pie chart (spending allocation)
  const spendingData = result.spending_allocation
    ? Object.entries(result.spending_allocation).map(([category, value]) => ({
        name: category,
        value: value,
      }))
    : [];

  // Add fixed expenses and savings to pie chart
  if (result.total_fixed_expenses) {
    spendingData.push({
      name: 'Fixed Expenses',
      value: result.total_fixed_expenses,
    });
  }
  if (result.monthly_savings) {
    spendingData.push({
      name: 'Savings',
      value: result.monthly_savings,
    });
  }

  // Prepare data for line chart (savings trajectory)
  const projectionData = result.projected_savings
    ? result.projected_savings.map((savings, index) => ({
        month: `Month ${index + 1}`,
        savings: savings,
      }))
    : [];

  // Prepare data for goal progress
  const goalsData = profile.financial_goals.map((goal) => ({
    name: goal.name,
    progress: (goal.current_amount / goal.target_amount) * 100,
    current: goal.current_amount,
    target: goal.target_amount,
  }));

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Dashboard</h1>
          <p className="text-gray-600">Optimize your finances and reach your goals</p>
        </div>
        <button onClick={() => navigate('/budget/new')} className="btn-secondary">
          Edit Budget
        </button>
      </div>

      {/* Optimization Mode Selector */}
      <div className="card mb-6">
        <label className="label">Optimization Mode</label>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedMode('max_savings')}
            className={`px-4 py-2 rounded-lg ${
              selectedMode === 'max_savings'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Maximize Savings
          </button>
          <button
            onClick={() => setSelectedMode('balanced')}
            className={`px-4 py-2 rounded-lg ${
              selectedMode === 'balanced'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Balanced
          </button>
          <button
            onClick={() => setSelectedMode('fastest_goal')}
            className={`px-4 py-2 rounded-lg ${
              selectedMode === 'fastest_goal'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Fastest Goal
          </button>
          <button onClick={handleOptimize} className="btn-primary ml-auto">
            Run Optimization
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Income</h3>
          <p className="text-3xl font-bold text-gray-900">${profile.monthly_income.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${result.total_monthly_spending?.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Savings</h3>
          <p className="text-3xl font-bold text-green-600">
            ${result.monthly_savings?.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Months to Goal</h3>
          <p className="text-3xl font-bold text-primary-600">
            {result.months_to_goal ? result.months_to_goal.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart - Budget Allocation */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Budget Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
              >
                {spendingData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Savings Trajectory */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Savings Trajectory</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#10b981"
                strokeWidth={2}
                name="Projected Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal Progress */}
      {goalsData.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Goal Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="horizontal" data={goalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  if (name === 'progress') {
                    return [
                      `${value.toFixed(1)}% ($${props.payload.current} / $${props.payload.target})`,
                      'Progress',
                    ];
                  }
                  return [value, name];
                }}
              />
              <Bar dataKey="progress" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Spending Recommendations */}
      {recommendations.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-600 mr-2">-</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Breakdown */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
        <div className="space-y-2">
          {result.spending_allocation &&
            Object.entries(result.spending_allocation).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">{category}</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
            ))}
          {result.fixed_expenses &&
            Object.entries(result.fixed_expenses).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">{category} (Fixed)</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
            ))}
          <div className="flex justify-between items-center py-2 border-b font-bold">
            <span className="text-gray-900">Monthly Savings</span>
            <span className="text-green-600">${result.monthly_savings?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
