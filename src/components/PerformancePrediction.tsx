'use client';

import { useState, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';

interface PerformanceAnalysis {
  productivityScore: number;
  efficiencyTrend: string;
  recommendations: string[];
  insights: {
    bestPerformingDay: string;
    peakProductivityHour: string;
    taskCompletionRate: number;
  };
  burnoutRisk?: boolean;
  burnoutProbability?: number;
}

export default function PerformancePrediction({ userId }: { userId?: string }) {
  const { analyzePerformance, loading, error } = useAI();
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    loadAnalysis();
  }, [userId, timeframe]);

  const loadAnalysis = async () => {
    try {
      const result = await analyzePerformance(userId, timeframe);
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to load performance analysis:', err);
    }
  };

  const getProductivityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">❌ {error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🎯</span>
          Performance Prediction
        </h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Burnout Warning */}
      {analysis.burnoutRisk && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔥</span>
            <div>
              <h4 className="font-semibold text-red-800">Burnout Risk Detected</h4>
              <p className="text-sm text-red-700 mt-1">
                AI predicts {((analysis.burnoutProbability || 0) * 100).toFixed(0)}% probability of burnout. 
                Consider reducing workload or taking a break.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Productivity Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Productivity Score</span>
          <span className={`text-3xl font-bold ${getProductivityColor(analysis.productivityScore)}`}>
            {(analysis.productivityScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              analysis.productivityScore >= 0.8 ? 'bg-green-500' :
              analysis.productivityScore >= 0.6 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${analysis.productivityScore * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Efficiency Trend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Efficiency Trend</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTrendIcon(analysis.efficiencyTrend)}</span>
            <span className="font-semibold text-gray-800 capitalize">
              {analysis.efficiencyTrend}
            </span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">📊 Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 mb-1">Best Day</div>
            <div className="font-semibold text-blue-900">
              {analysis.insights.bestPerformingDay}
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-600 mb-1">Peak Hour</div>
            <div className="font-semibold text-purple-900">
              {analysis.insights.peakProductivityHour}
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600 mb-1">Completion Rate</div>
            <div className="font-semibold text-green-900">
              {(analysis.insights.taskCompletionRate * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h4 className="font-semibold mb-3">💡 AI Recommendations</h4>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <span className="text-blue-600 font-bold">{index + 1}.</span>
              <p className="text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadAnalysis}
        disabled={loading}
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : '🔄 Refresh Analysis'}
      </button>
    </div>
  );
}
