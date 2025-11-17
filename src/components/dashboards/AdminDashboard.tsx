'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Activity,
  UserPlus,
  Settings,
  BarChart3,
  Shield,
  Database,
  Clock
} from 'lucide-react';
import { apiClient } from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    activeProjects: 0,
    systemHealth: 100,
    newUsersToday: 0,
    tasksCompletedToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      // In a real app, you'd have an admin-specific endpoint
      const dashboardData = await apiClient.getDashboardData();
      setStats({
        totalUsers: 45, // Mock data - would come from admin endpoint
        totalTasks: dashboardData.stats.totalTasks,
        activeProjects: 12,
        systemHealth: 98,
        newUsersToday: 5,
        tasksCompletedToday: dashboardData.stats.completedTasks
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminStats = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'System Health',
      value: `${stats.systemHealth}%`,
      icon: Shield,
      color: 'from-emerald-500 to-emerald-600',
      change: 'Excellent',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    { title: 'Add User', icon: UserPlus, href: '/en/Users/Create', color: 'bg-blue-500' },
    { title: 'System Settings', icon: Settings, href: '/en/Settings', color: 'bg-purple-500' },
    { title: 'View Analytics', icon: BarChart3, href: '/en/Analytics', color: 'bg-green-500' },
    { title: 'Database', icon: Database, href: '/en/Database', color: 'bg-orange-500' }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Created new project', time: '5 min ago', type: 'project' },
    { user: 'Jane Smith', action: 'Completed 5 tasks', time: '15 min ago', type: 'task' },
    { user: 'Mike Johnson', action: 'Joined the team', time: '1 hour ago', type: 'user' },
    { user: 'Sarah Williams', action: 'Updated system settings', time: '2 hours ago', type: 'settings' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-purple-100">Complete system overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className={`p-3 rounded-xl ${action.color} text-white`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#40b8a6]"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">CPU Usage</span>
                <span className="font-medium text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                <span className="font-medium text-gray-900 dark:text-white">62%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Database</span>
                <span className="font-medium text-green-600">Healthy</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">API Response Time</span>
                <span className="font-medium text-gray-900 dark:text-white">120ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
