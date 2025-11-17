'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertCircle,
  UserCheck,
  Calendar,
  BarChart2,
  Award
} from 'lucide-react';
import { apiClient } from '@/services/api';

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    teamMembers: 0,
    teamTasks: 0,
    completionRate: 0,
    blockedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagerStats();
  }, []);

  const loadManagerStats = async () => {
    try {
      const dashboardData = await apiClient.getDashboardData();
      setStats({
        teamMembers: 8, // Mock - would come from team endpoint
        teamTasks: dashboardData.stats.totalTasks,
        completionRate: dashboardData.stats.productivityScore,
        blockedTasks: 3 // Mock
      });
    } catch (error) {
      console.error('Failed to load manager stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const managerStats = [
    {
      title: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+2 this month'
    },
    {
      title: 'Team Tasks',
      value: stats.teamTasks,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      change: '12 in progress'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+5% this week'
    },
    {
      title: 'Blocked Tasks',
      value: stats.blockedTasks,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      change: 'Needs attention'
    }
  ];

  const teamMembers = [
    { name: 'John Doe', role: 'Developer', tasks: 5, completion: 80, avatar: 'JD' },
    { name: 'Jane Smith', role: 'Designer', tasks: 3, completion: 100, avatar: 'JS' },
    { name: 'Mike Johnson', role: 'Developer', tasks: 7, completion: 60, avatar: 'MJ' },
    { name: 'Sarah Williams', role: 'QA', tasks: 4, completion: 75, avatar: 'SW' }
  ];

  const upcomingDeadlines = [
    { task: 'Complete API Integration', assignee: 'John Doe', deadline: 'Today', priority: 'urgent' },
    { task: 'Design Review', assignee: 'Jane Smith', deadline: 'Tomorrow', priority: 'high' },
    { task: 'Bug Fixes', assignee: 'Mike Johnson', deadline: 'In 2 days', priority: 'medium' }
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
      {/* Manager Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        </div>
        <p className="text-blue-100">Manage your team and track progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {managerStats.map((stat, index) => (
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
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Team Performance & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team Performance</h2>
            <Award className="w-5 h-5 text-[#40b8a6]" />
          </div>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.tasks} tasks</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{member.completion}% done</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full transition-all"
                    style={{ width: `${member.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
            <Calendar className="w-5 h-5 text-[#40b8a6]" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border-l-4 border-[#40b8a6] bg-gray-50 dark:bg-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900 dark:text-white">{item.task}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.assignee}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Due: {item.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Team</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Target className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Assign Tasks</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <BarChart2 className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">View Reports</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <Calendar className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Schedule</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
