'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import RoleBasedRoute from '../../../components/RoleBasedRoute';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { 
  Bell, 
  BarChart2, 
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const metrics = [
    {
      title: 'Team Productivity',
      value: '87%',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Task Completion Rate',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      title: 'Average Response Time',
      value: '2.4h',
      change: '-15%',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Active Users',
      value: '45',
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['admin', 'manager']}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                  <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-6 h-6 text-[#40b8a6]" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageSwitcher />
                  <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                    <Bell className="text-gray-600 dark:text-gray-300" size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-6 lg:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Track team performance and productivity metrics
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <metric.icon className={`w-8 h-8 ${metric.color}`} />
                        <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.title}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Completion Trend</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      Chart will be displayed here
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      Chart will be displayed here
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoleBasedRoute>
    </ProtectedRoute>
  );
}
