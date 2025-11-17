'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Star
} from 'lucide-react';
import { apiClient } from '@/services/api';
import TaskList from '../TaskList';

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({
    myTasks: 0,
    completed: 0,
    inProgress: 0,
    productivity: 0,
    streak: 0,
    points: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeStats();
  }, []);

  const loadEmployeeStats = async () => {
    try {
      const dashboardData = await apiClient.getDashboardData();
      setStats({
        myTasks: dashboardData.stats.totalTasks,
        completed: dashboardData.stats.completedTasks,
        inProgress: dashboardData.stats.pendingTasks,
        productivity: dashboardData.stats.productivityScore,
        streak: dashboardData.stats.streakDays,
        points: 1250 // Mock - would come from gamification endpoint
      });
    } catch (error) {
      console.error('Failed to load employee stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const employeeStats = [
    {
      title: 'My Tasks',
      value: stats.myTasks,
      icon: Target,
      color: 'from-[#40b8a6] to-[#359e8d]',
      subtitle: `${stats.inProgress} in progress`
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      subtitle: 'This month'
    },
    {
      title: 'Productivity',
      value: `${stats.productivity}%`,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      subtitle: '+5% from last week'
    },
    {
      title: 'Current Streak',
      value: `${stats.streak} days`,
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      subtitle: 'Keep it up!'
    }
  ];

  const todaysTasks = [
    { title: 'Complete API Integration', priority: 'high', time: '2h', progress: 60 },
    { title: 'Code Review', priority: 'medium', time: '1h', progress: 0 },
    { title: 'Update Documentation', priority: 'low', time: '30m', progress: 100 }
  ];

  const achievements = [
    { title: 'Early Bird', description: 'Complete 5 tasks before 10 AM', icon: '🌅', unlocked: true },
    { title: 'Speed Demon', description: 'Complete 10 tasks in one day', icon: '⚡', unlocked: true },
    { title: 'Team Player', description: 'Help 5 teammates', icon: '🤝', unlocked: false },
    { title: 'Perfectionist', description: 'Complete 20 tasks with 100% quality', icon: '✨', unlocked: false }
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
      {/* Employee Header */}
      <div className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8" />
              <h1 className="text-2xl font-bold">My Dashboard</h1>
            </div>
            <p className="text-emerald-100">Track your tasks and achievements</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-2xl font-bold">{stats.points}</span>
            </div>
            <p className="text-sm text-emerald-100">Total Points</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {employeeStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 inline-block`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Today's Focus & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Focus */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Today's Focus</h2>
            <Calendar className="w-5 h-5 text-[#40b8a6]" />
          </div>
          <div className="space-y-3">
            {todaysTasks.map((task, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.progress}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Achievements</h2>
            <Award className="w-5 h-5 text-[#40b8a6]" />
          </div>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-[#40b8a6]/10 to-[#359e8d]/10 border border-[#40b8a6]/20' 
                    : 'bg-gray-50 dark:bg-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{achievement.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="w-4 h-4 text-[#40b8a6]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All My Tasks</h2>
        <TaskList />
      </div>
    </div>
  );
}
