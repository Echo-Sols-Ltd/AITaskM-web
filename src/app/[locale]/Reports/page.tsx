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
  FileText,
  Download,
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function ReportsPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState('tasks');
  const [timeframe, setTimeframe] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    loadReport();
  }, [selectedReport, timeframe]);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      let data;

      switch (selectedReport) {
        case 'tasks':
          data = await apiClient.getTaskReport({ timeframe });
          break;
        case 'productivity':
          data = await apiClient.getProductivityReport({ timeframe });
          break;
        case 'performance':
          data = await apiClient.getPerformanceReport({ timeframe });
          break;
        default:
          data = await apiClient.getTaskReport({ timeframe });
      }

      setReportData(data.report);
    } catch (error: any) {
      console.error('Failed to load report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    try {
      await apiClient.exportReport({
        reportType: selectedReport,
        format,
        timeframe
      });
      alert(`Report export initiated. Download will be available shortly.`);
    } catch (error: any) {
      console.error('Failed to export report:', error);
      alert('Failed to export report');
    }
  };

  const reportTypes = [
    { id: 'tasks', name: 'Task Report', icon: Target, description: 'Overview of task completion and status' },
    { id: 'productivity', name: 'Productivity Report', icon: TrendingUp, description: 'Productivity metrics and trends' },
    { id: 'performance', name: 'Performance Report', icon: Award, description: 'Performance analysis and comparison' }
  ];

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
                  <FileText className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
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
              {/* Report Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedReport(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedReport === type.id
                        ? 'border-[#40b8a6] bg-[#40b8a6]/5 dark:bg-[#40b8a6]/10'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#40b8a6]/50'
                    }`}
                  >
                    <type.icon className={`w-8 h-8 mb-3 ${
                      selectedReport === type.id ? 'text-[#40b8a6]' : 'text-gray-400'
                    }`} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                  <button
                    onClick={loadReport}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export PDF</span>
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export Excel</span>
                  </button>
                </div>
              </div>

              {/* Report Content */}
              {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6] mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading report...</p>
                </div>
              ) : reportData ? (
                <>
                  {/* Task Report */}
                  {selectedReport === 'tasks' && reportData.summary && (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.summary.totalTasks}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reportData.summary.completed}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reportData.summary.inProgress}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{reportData.summary.pending}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overdue</p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{reportData.summary.overdue}</p>
                        </div>
                      </div>

                      {/* Priority Breakdown */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-[#40b8a6]" />
                          Priority Breakdown
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">High Priority</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{reportData.breakdown?.byPriority?.high || 0}</p>
                          </div>
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Medium Priority</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{reportData.breakdown?.byPriority?.medium || 0}</p>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Low Priority</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reportData.breakdown?.byPriority?.low || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Productivity Report */}
                  {selectedReport === 'productivity' && (
                    <div className="space-y-6">
                      {/* Productivity Scores */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Productivity Score</p>
                            <Activity className="w-5 h-5 text-[#40b8a6]" />
                          </div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportData.productivityScore}%</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportData.efficiency}%</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Quality</p>
                            <Award className="w-5 h-5 text-purple-500" />
                          </div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportData.quality}%</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Overall</p>
                            <BarChart3 className="w-5 h-5 text-green-500" />
                          </div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {Math.round((reportData.productivityScore + reportData.efficiency + reportData.quality) / 3)}%
                          </p>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {reportData.recommendations && reportData.recommendations.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
                          <ul className="space-y-2">
                            {reportData.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                <span className="text-[#40b8a6] mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Performance Report */}
                  {selectedReport === 'performance' && reportData.currentPerformance && (
                    <div className="space-y-6">
                      {/* Performance Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Performance</h3>
                          <div className="text-center">
                            <p className="text-5xl font-bold text-[#40b8a6] mb-2">{reportData.currentPerformance.score}%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Performance Score</p>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Previous Performance</h3>
                          <div className="text-center">
                            <p className="text-5xl font-bold text-gray-400 mb-2">{reportData.previousPerformance.score}%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Performance Score</p>
                          </div>
                        </div>
                      </div>

                      {/* Improvement */}
                      <div className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Performance Improvement</h3>
                        <p className="text-4xl font-bold">
                          {reportData.improvement.score > 0 ? '+' : ''}{reportData.improvement.score}%
                        </p>
                        <p className="text-sm opacity-90 mt-2">
                          {reportData.improvement.score > 0 ? 'Great progress!' : reportData.improvement.score < 0 ? 'Room for improvement' : 'Maintaining performance'}
                        </p>
                      </div>

                      {/* Performance Breakdown */}
                      {reportData.breakdown && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Breakdown</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reportData.breakdown.productivity}%</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Productivity</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reportData.breakdown.efficiency}%</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Efficiency</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{reportData.breakdown.quality}%</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quality</p>
                            </div>
                            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{reportData.breakdown.collaboration}%</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Collaboration</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                  <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No report data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
