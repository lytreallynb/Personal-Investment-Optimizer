import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { BudgetProfile, OptimizationRequest, OptimizationResponse } from '../types';

export function useBudget() {
  const [profile, setProfile] = useState<BudgetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBudgetProfile();
      setProfile(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No profile exists yet
        setProfile(null);
      } else {
        const message = err.response?.data?.detail || 'Failed to fetch budget profile';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async (budgetProfile: BudgetProfile) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.createOrUpdateBudgetProfile(budgetProfile);
      setProfile(data);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to save budget profile';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    saveProfile,
    refetchProfile: fetchProfile,
  };
}

export function useOptimization() {
  const [result, setResult] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runOptimization = async (request: OptimizationRequest) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.runOptimization(request);
      setResult(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Optimization failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    error,
    runOptimization,
  };
}
