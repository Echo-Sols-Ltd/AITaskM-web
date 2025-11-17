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
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<any[]>([]);
  const [priorityAnalysis, setPriorityAnalysis] = useState<any[]>([]);

  const COLORS = ['#40b8a6', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch overview
      const overviewData = await apiClient.getAnalyticsOverview();
      setOverview(overviewData.overview);

      // Fetch trends
      const trendsData = await apiClient.getAnalyticsTrends({ period });
      setTrends(trendsData.trends || []);

      // Fetch team performance (admin/manager only)
      if (user?.role === 'admin' || user?.role === 'manager') {
        const teamData = await apiClient.getTeamPerformance();
        setTeamPerformance(teamData.teamPerformance || []);
      }

      // Fetch priority analysis
      const priorityData = await apiClient.getPriorityAnalysis();
      setPriorityAnalysis(priorityData.priorityAnalysis || []);

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </motion.div>
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Export Button */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button
                      onClick={async () => {
                        try {
                          const blob = await apiClient.exportAnalytics('pdf');
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `analytics_${Date.now()}.pdf`;
                          a.click();
                        } catch (error) {
                          console.error('Export failed:', error);
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const blob = await apiClient.exportAnalytics('excel');
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `analytics_${Date.now()}.xlsx`;
                          a.click();
                        } catch (error) {
                          console.error('Export failed:', error);
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      Export as Excel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const blob = await apiClient.exportAnalytics('csv');
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `analytics_${Date.now()}.csv`;
                          a.click();
                        } catch (error) {
                          console.error('Export failed:', error);
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm rounded-b-lg"
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
                {/* Period Selector */}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6]"></div>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      icon={Target}
                      title="Total Tasks"
                      value={overview?.totalTasks || 0}
                      color="blue"
                    />
                    <StatCard
                      icon={CheckCircle}
                      title="Completed"
                      value={overview?.completedTasks || 0}
                      change={overview?.completionRate}
                      color="green"
                    />
                    <StatCard
                      icon={Clock}
                      title="In Progress"
                      value={overview?.inProgressTasks || 0}
                      color="yellow"
                    />
                    <StatCard
                      icon={AlertCircle}
                      title="Overdue"
                      value={overview?.overdueTasks || 0}
                      color="red"
                    />
                  </div>

                  {/* Task Completion Trends */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Task Completion Trends
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trends}>
                        <defs>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#40b8a6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#40b8a6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorCompleted)"
                          name="Completed"
                        />
                        <Area
                          type="monotone"
                          dataKey="created"
                          stroke="#40b8a6"
                          fillOpacity={1}
                          fill="url(#colorCreated)"
                          name="Created"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Priority Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Priority Distribution
                      </h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={priorityAnalysis}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ priority, total }) => `${priority}: ${total}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total"
                          >
                            {priorityAnalysis.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Status Overview
                      </h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          { name: 'Pending', value: overview?.pendingTasks || 0, fill: '#f59e0b' },
                          { name: 'In Progress', value: overview?.inProgressTasks || 0, fill: '#3b82f6' },
                          { name: 'Completed', value: overview?.completedTasks || 0, fill: '#10b981' },
                          { name: 'Overdue', value: overview?.overdueTasks || 0, fill: '#ef4444' }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Team Performance (Admin/Manager only) */}
                  {(user?.role === 'admin' || user?.role === 'manager') && teamPerformance.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Team Performance
                      </h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={teamPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="teamName" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="completionRate" fill="#40b8a6" name="Completion Rate (%)" />
                          <Bar dataKey="totalTasks" fill="#3b82f6" name="Total Tasks" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Priority Analysis Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Priority Analysis
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Priority</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Completed</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">In Progress</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Completion Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {priorityAnalysis.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                              <td className="py-3 px-4">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                                  item.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                  item.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                  {item.priority}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-900 dark:text-white">{item.total}</td>
                              <td className="py-3 px-4 text-gray-900 dark:text-white">{item.completed}</td>
                              <td className="py-3 px-4 text-gray-900 dark:text-white">{item.inProgress}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-[#40b8a6] h-2 rounded-full"
                                      style={{ width: `${item.completionRate}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-900 dark:text-white">{item.completionRate}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
