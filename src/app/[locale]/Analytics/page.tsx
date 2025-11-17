'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NotificationCenter from '../../../components/NotificationCenter';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    activeUsers: 0
  });

  const [priorityData, setPriorityData] = useState<any[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const dateParams = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      // Load all analytics data
      const [overviewData, priorityAnalysis, teamPerf] = await Promise.all([
        apiClient.getAnalyticsOverview(dateParams),
        apiClient.getPriorityAnalysis(dateParams),
        apiClient.getTeamPerformance(dateParams)
      ]);

      setAnalytics(overviewData.overview || {});
      setPriorityData(priorityAnalysis.priorityAnalysis || []);
      setTeamPerformance(teamPerf.teamPerformance || []);
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadAnalytics();
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{subtitle}</p>
      )}
    </motion.div>
  );

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <NotificationCenter />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="year">This Year</option>
                  </select>
                  <button
                    onClick={refreshData}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <MetricCard
                      title="Total Tasks"
                      value={analytics.totalTasks}
                      subtitle="In selected period"
                      icon={CheckCircle}
                      color="bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                    <MetricCard
                      title="Completed Tasks"
                      value={analytics.completedTasks}
                      subtitle={`${analytics.completionRate}% completion rate`}
                      icon={CheckCircle}
                      color="bg-gradient-to-r from-green-500 to-green-600"
                    />
                    <MetricCard
                      title="In Progress"
                      value={analytics.inProgressTasks}
                      subtitle="Currently active"
                      icon={Clock}
                      color="bg-gradient-to-r from-yellow-500 to-yellow-600"
                    />
                    <MetricCard
                      title="Overdue Tasks"
                      value={analytics.overdueTasks}
                      subtitle="Needs attention"
                      icon={AlertCircle}
                      color="bg-gradient-to-r from-red-500 to-red-600"
                    />
                  </>
                )}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Completion Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Task Completion Trend
                    </h3>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Chart will be implemented with Recharts</p>
                    </div>
                  </div>
                </div>

                {/* Tasks by Priority */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tasks by Priority
                    </h3>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : priorityData.length > 0 ? (
                      priorityData.map((item) => {
                        const priorityColors: any = {
                          urgent: 'bg-red-500',
                          high: 'bg-orange-500',
                          medium: 'bg-yellow-500',
                          low: 'bg-green-500'
                        };
                        const totalTasks = priorityData.reduce((sum, p) => sum + p.total, 0);
                        const percentage = totalTasks > 0 ? Math.round((item.total / totalTasks) * 100) : 0;
                        
                        return (
                          <div key={item.priority}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {item.priority}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {item.total} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`${priorityColors[item.priority] || 'bg-gray-500'} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-400">No priority data available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Team Performance */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Performance
                  </h3>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Team
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Tasks
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Completed
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Completion Rate
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Avg. Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            Loading team performance...
                          </td>
                        </tr>
                      ) : teamPerformance.length > 0 ? (
                        teamPerformance.map((team) => (
                          <tr key={team.teamId} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                              {team.teamName || 'Unassigned'}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {team.totalTasks}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {team.completedTasks}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                                  <div
                                    className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full"
                                    style={{ width: `${Math.round(team.completionRate)}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {Math.round(team.completionRate)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              N/A
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            No team performance data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] rounded-xl p-8 text-center">
                <BarChart3 className="w-16 h-16 text-white/80 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  More Analytics Coming Soon!
                </h3>
                <p className="text-white/90 mb-4">
                  Advanced charts, custom reports, and export functionality will be available in the next update.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-white/80">
                  <span>✓ Interactive Charts</span>
                  <span>✓ Custom Reports</span>
                  <span>✓ PDF Export</span>
                  <span>✓ Excel Export</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
