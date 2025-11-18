'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

interface AnalyticsOverview {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  activeUsers: number;
}

interface AIInsights {
  anomalies: number[];
  trends: any;
  hasAnomalies: boolean;
}

interface TrendData {
  date: string;
  created: number;
  completed: number;
  inProgress: number;
  pending: number;
}

interface UserProductivity {
  userId: string;
  userName: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  burnoutRisk?: boolean;
  aiRecommendation?: string;
}

export default function AIAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [userProductivity, setUserProductivity] = useState<UserProductivity[]>([]);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load overview with AI insights
      const overviewData = await apiClient.getAnalyticsOverview();
      setOverview(overviewData.overview);
      setAIInsights(overviewData.aiInsights);

      // Load trends
      const trendsData = await apiClient.getAnalyticsTrends({ period: timeframe });
      setTrends(trendsData.trends || []);

      // Load user productivity with AI enhancements
      const productivityData = await apiClient.getUserProductivity();
      setUserProductivity(productivityData.userProductivity || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📊 AI-Enhanced Analytics</h2>
          <p className="text-gray-600">Real-time insights powered by machine learning</p>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* AI Anomaly Alert */}
      {aiInsights?.hasAnomalies && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800">AI Detected Anomalies</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {aiInsights.anomalies.length} unusual task duration(s) detected. Review for potential issues.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Tasks</span>
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{overview.totalTasks}</div>
            <div className="text-sm text-gray-500 mt-1">All time</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Completed</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{overview.completedTasks}</div>
            <div className="text-sm text-gray-500 mt-1">
              {overview.completionRate.toFixed(1)}% completion rate
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">In Progress</span>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{overview.inProgressTasks}</div>
            <div className="text-sm text-gray-500 mt-1">Active work</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Overdue</span>
              <span className="text-2xl">🚨</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{overview.overdueTasks}</div>
            <div className="text-sm text-gray-500 mt-1">Needs attention</div>
          </div>
        </div>
      )}

      {/* Trends Chart */}
      {trends.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Task Trends</h3>
          <div className="space-y-2">
            {trends.slice(-7).map((trend, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{trend.date}</div>
                <div className="flex-1 flex gap-2">
                  <div 
                    className="bg-green-500 h-8 rounded flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${(trend.completed / (trend.created || 1)) * 100}%`, minWidth: '30px' }}
                  >
                    {trend.completed}
                  </div>
                  <div 
                    className="bg-blue-500 h-8 rounded flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${(trend.inProgress / (trend.created || 1)) * 100}%`, minWidth: '30px' }}
                  >
                    {trend.inProgress}
                  </div>
                  <div 
                    className="bg-yellow-500 h-8 rounded flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${(trend.pending / (trend.created || 1)) * 100}%`, minWidth: '30px' }}
                  >
                    {trend.pending}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* User Productivity with AI Insights */}
      {userProductivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">👥 Team Productivity (AI-Enhanced)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userProductivity.slice(0, 10).map((user, index) => (
                  <tr key={index} className={user.burnoutRisk ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {user.userName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.totalTasks}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.completedTasks}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${getCompletionRateColor(user.completionRate)}`}>
                        {user.completionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.burnoutRisk ? (
                        <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
                          🔥 Burnout Risk
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                          ✅ Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.aiRecommendation || 'No recommendations'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Insights Summary */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            AI Insights Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Anomalies Detected</div>
              <div className="text-2xl font-bold text-yellow-600">
                {aiInsights.anomalies.length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">AI Status</div>
              <div className="text-lg font-semibold text-green-600">
                ✅ Active
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Last Updated</div>
              <div className="text-lg font-semibold text-gray-700">
                Just now
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
