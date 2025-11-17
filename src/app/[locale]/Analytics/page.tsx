'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NotificationCenter from '../../../components/NotificationCenter';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
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
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data
  const [analytics, setAnalytics] = useState({
    totalTasks: 156,
    completedTasks: 98,
    inProgressTasks: 42,
    overdueTasks: 16,
    completionRate: 62.8,
    avgCompletionTime: 3.2,
    activeUsers: 24,
    totalTeams: 6
  });

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
                <MetricCard
                  title="Total Tasks"
                  value={analytics.totalTasks}
                  subtitle="All time"
                  icon={CheckCircle}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                  trend={12}
                />
                <MetricCard
                  title="Completed Tasks"
                  value={analytics.completedTasks}
                  subtitle={`${analytics.completionRate}% completion rate`}
                  icon={CheckCircle}
                  color="bg-gradient-to-r from-green-500 to-green-600"
                  trend={8}
                />
                <MetricCard
                  title="In Progress"
                  value={analytics.inProgressTasks}
                  subtitle="Currently active"
                  icon={Clock}
                  color="bg-gradient-to-r from-yellow-500 to-yellow-600"
                  trend={-3}
                />
                <MetricCard
                  title="Overdue Tasks"
                  value={analytics.overdueTasks}
                  subtitle="Needs attention"
                  icon={AlertCircle}
                  color="bg-gradient-to-r from-red-500 to-red-600"
                  trend={-15}
                />
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
                    {[
                      { label: 'Urgent', value: 24, color: 'bg-red-500', percentage: 15 },
                      { label: 'High', value: 45, color: 'bg-orange-500', percentage: 29 },
                      { label: 'Medium', value: 62, color: 'bg-yellow-500', percentage: 40 },
                      { label: 'Low', value: 25, color: 'bg-green-500', percentage: 16 }
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.label}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.value} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
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
                      {[
                        { name: 'Development', tasks: 45, completed: 38, rate: 84, time: '3.2 days' },
                        { name: 'Design', tasks: 28, completed: 26, rate: 93, time: '2.1 days' },
                        { name: 'Marketing', tasks: 35, completed: 27, rate: 77, time: '4.5 days' },
                        { name: 'QA', tasks: 32, completed: 28, rate: 88, time: '2.8 days' }
                      ].map((team) => (
                        <tr key={team.name} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                            {team.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {team.tasks}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {team.completed}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full"
                                  style={{ width: `${team.rate}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {team.rate}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {team.time}
                          </td>
                        </tr>
                      ))}
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
