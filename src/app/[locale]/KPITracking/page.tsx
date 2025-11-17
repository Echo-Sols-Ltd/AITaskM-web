'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NotificationCenter from '../../../components/NotificationCenter';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  owner: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'behind';
  trend: 'up' | 'down' | 'stable';
}

export default function KPITrackingPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock KPI data
  const kpis: KPI[] = [
    {
      id: '1',
      name: 'Task Completion Rate',
      description: 'Percentage of tasks completed on time',
      target: 90,
      current: 87,
      unit: '%',
      category: 'Performance',
      owner: 'Development Team',
      deadline: '2025-12-31',
      status: 'on-track',
      trend: 'up'
    },
    {
      id: '2',
      name: 'Customer Satisfaction',
      description: 'Average customer satisfaction score',
      target: 4.5,
      current: 4.7,
      unit: '/5',
      category: 'Quality',
      owner: 'Customer Success',
      deadline: '2025-12-31',
      status: 'on-track',
      trend: 'up'
    },
    {
      id: '3',
      name: 'Sprint Velocity',
      description: 'Story points completed per sprint',
      target: 50,
      current: 42,
      unit: 'points',
      category: 'Performance',
      owner: 'Development Team',
      deadline: '2025-12-31',
      status: 'at-risk',
      trend: 'down'
    },
    {
      id: '4',
      name: 'Bug Resolution Time',
      description: 'Average time to resolve bugs',
      target: 24,
      current: 18,
      unit: 'hours',
      category: 'Quality',
      owner: 'QA Team',
      deadline: '2025-12-31',
      status: 'on-track',
      trend: 'up'
    },
    {
      id: '5',
      name: 'Team Utilization',
      description: 'Percentage of team capacity utilized',
      target: 85,
      current: 92,
      unit: '%',
      category: 'Resources',
      owner: 'Management',
      deadline: '2025-12-31',
      status: 'behind',
      trend: 'up'
    },
    {
      id: '6',
      name: 'Code Review Time',
      description: 'Average time for code review',
      target: 4,
      current: 3.5,
      unit: 'hours',
      category: 'Performance',
      owner: 'Development Team',
      deadline: '2025-12-31',
      status: 'on-track',
      trend: 'stable'
    }
  ];

  const categories = ['all', 'Performance', 'Quality', 'Resources'];

  const filteredKPIs = selectedCategory === 'all' 
    ? kpis 
    : kpis.filter(kpi => kpi.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'behind':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 border-t-2 border-gray-400" />;
    }
  };

  const summaryStats = {
    total: kpis.length,
    onTrack: kpis.filter(k => k.status === 'on-track').length,
    atRisk: kpis.filter(k => k.status === 'at-risk').length,
    behind: kpis.filter(k => k.status === 'behind').length
  };

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
                  <Target className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">KPI Tracking</h1>
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
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summaryStats.total}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total KPIs</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summaryStats.onTrack}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summaryStats.atRisk}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-red-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summaryStats.behind}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Behind</p>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#40b8a6] text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add KPI
                </motion.button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredKPIs.map((kpi) => (
                  <motion.div
                    key={kpi.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {kpi.name}
                          </h3>
                          {getTrendIcon(kpi.trend)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {kpi.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
                            {kpi.status.replace('-', ' ')}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {kpi.category}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(kpi.current, kpi.target)}%` }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{kpi.owner}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(kpi.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredKPIs.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                  <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No KPIs Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No KPIs match the selected category. Try a different filter or add a new KPI.
                  </p>
                  <button className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors mx-auto">
                    <Plus className="w-4 h-4" />
                    Add Your First KPI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
