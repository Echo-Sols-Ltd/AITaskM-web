'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/services/api';

interface AIAssignment {
  task_id: string;
  assigned_to: string;
  reason: string;
  confidence?: number;
}

interface AISuggestion {
  type: string;
  message: string;
  priority: string;
  actionable?: boolean;
  action?: string;
}

interface PerformanceScore {
  employee_id: string;
  task_completion_rate: number;
  average_completion_time_hours: number;
  burnout_risk: boolean;
  recommendation: string;
}

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignTasks = useCallback(async (tasks: any[], teamMembers: any[], criteria?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.aiAssignTasks({ tasks, teamMembers, criteria });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assign tasks';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeSchedule = useCallback(async (tasks: any[], constraints?: any, preferences?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.aiOptimizeSchedule({ tasks, constraints, preferences });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to optimize schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (userId?: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.aiGetSuggestions({ userId, context });
      return result.suggestions as AISuggestion[];
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get suggestions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzePerformance = useCallback(async (userId?: string, timeframe?: string, metrics?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.aiAnalyzePerformance({ userId, timeframe, metrics });
      return result.analysis;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze performance';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assignTasks,
    optimizeSchedule,
    getSuggestions,
    analyzePerformance,
    loading,
    error,
    clearError: () => setError(null)
  };
};

export default useAI;
