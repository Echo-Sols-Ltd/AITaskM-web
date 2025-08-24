"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import { useTranslations } from "@/contexts/I18nContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import {
  BarChart2,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  LineChart,
  Users,
  Star,
  Trophy,
  Bell,
  Search,

  ChevronRight,
 
} from "lucide-react";

// Mock data for progress tracking
const mockProgressData = {
  weeklyStats: {
    tasksCompleted: 18,
    totalTasks: 24,
    completionRate: 75,
    averageTime: 2.5,
    streak: 5,
    productivity: 87
  },
  monthlyStats: {
    tasksCompleted: 72,
    totalTasks: 89,
    completionRate: 81,
    averageTime: 2.8,
    streak: 12,
    productivity: 89
  },
  dailyProgress: [
    { day: 'Mon', completed: 4, total: 5, productivity: 85 },
    { day: 'Tue', completed: 3, total: 4, productivity: 90 },
    { day: 'Wed', completed: 5, total: 6, productivity: 88 },
    { day: 'Thu', completed: 2, total: 3, productivity: 75 },
    { day: 'Fri', completed: 4, total: 6, productivity: 70 },
    { day: 'Sat', completed: 0, total: 0, productivity: 0 },
    { day: 'Sun', completed: 0, total: 0, productivity: 0 },
  ],
  categories: [
    { name: 'Design', completed: 12, total: 15, color: 'from-purple-500 to-purple-600' },
    { name: 'Development', completed: 8, total: 12, color: 'from-blue-500 to-blue-600' },
    { name: 'Marketing', completed: 6, total: 8, color: 'from-green-500 to-green-600' },
    { name: 'Research', completed: 4, total: 5, color: 'from-orange-500 to-orange-600' },
  ],
  recentAchievements: [
    { id: 1, title: 'Speed Demon', description: 'Completed 5 tasks in under 2 hours', icon: Zap, date: '2024-02-15' },
    { id: 2, title: 'Consistency King', description: '7-day completion streak', icon: Trophy, date: '2024-02-14' },
    { id: 3, title: 'Team Player', description: 'Helped 3 team members', icon: Users, date: '2024-02-13' },
  ]
};

const Progress: React.FC = () => {
  const tCommon = useTranslations('common');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
 
  const currentStats = selectedPeriod === 'week' ? mockProgressData.weeklyStats : mockProgressData.monthlyStats;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -5, 
      transition: { duration: 0.2 },
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                <div className="md:hidden">
                  <h1 className="text-2xl font-serif italic text-emerald-600 dark:text-emerald-400">
                    MoveIt
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={tCommon('search')}
              >
                <Search className="text-gray-500 dark:text-gray-400" size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="text-gray-500 dark:text-gray-400" size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
            </div>
          </div>
        </header>

          <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                      <BarChart2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Progress Overview
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#40b8a6]" />
                        Track your productivity and achievements
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Period Selector */}
                <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-1 border border-gray-200 dark:border-gray-700">
                  {['week', 'month'].map((period) => (
                    <motion.button
                      key={period}
                      onClick={() => setSelectedPeriod(period as 'week' | 'month')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedPeriod === period
                          ? "bg-[#40b8a6] text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {period === 'week' ? 'This Week' : 'This Month'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {[
                {
                  title: "Tasks Completed",
                  value: `${currentStats.tasksCompleted}/${currentStats.totalTasks}`,
                  icon: CheckCircle2,
                  color: "from-[#40b8a6] to-[#359e8d]",
                  bgColor: "bg-[#e7f9f6] dark:bg-[#40b8a6]/10",
                  textColor: "text-[#40b8a6]",
                  change: "+12%",
                  trend: "up"
                },
                {
                  title: "Completion Rate",
                  value: `${currentStats.completionRate}%`,
                  icon: Target,
                  color: "from-blue-500 to-blue-600",
                  bgColor: "bg-blue-50 dark:bg-blue-900/10",
                  textColor: "text-blue-600",
                  change: "+5%",
                  trend: "up"
                },
                {
                  title: "Productivity Score",
                  value: `${currentStats.productivity}%`,
                  icon: TrendingUp,
                  color: "from-purple-500 to-purple-600",
                  bgColor: "bg-purple-50 dark:bg-purple-900/10",
                  textColor: "text-purple-600",
                  change: "+8%",
                  trend: "up"
                },
                {
                  title: "Average Time",
                  value: `${currentStats.averageTime}h`,
                  icon: Clock,
                  color: "from-orange-500 to-orange-600",
                  bgColor: "bg-orange-50 dark:bg-orange-900/10",
                  textColor: "text-orange-600",
                  change: "-15min",
                  trend: "down"
                },
                {
                  title: "Current Streak",
                  value: `${currentStats.streak} days`,
                  icon: Star,
                  color: "from-yellow-500 to-yellow-600",
                  bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
                  textColor: "text-yellow-600",
                  change: "+2 days",
                  trend: "up"
                },
                {
                  title: "Achievements",
                  value: "3 new",
                  icon: Award,
                  color: "from-green-500 to-green-600",
                  bgColor: "bg-green-50 dark:bg-green-900/10",
                  textColor: "text-green-600",
                  change: "+1",
                  trend: "up"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Daily Progress Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-[#40b8a6]" />
                    Daily Progress
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-3 h-3 bg-[#40b8a6] rounded-full"></div>
                    Completed
                    <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full ml-3"></div>
                    Total
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockProgressData.dailyProgress.map((day, index) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {day.completed}/{day.total} tasks
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: day.total > 0 ? `${(day.completed / day.total) * 100}%` : '0%' }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Category Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#40b8a6]" />
                    Category Progress
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {mockProgressData.categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {category.completed}/{category.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(category.completed / category.total) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className={`bg-gradient-to-r ${category.color} h-2 rounded-full`}
                        />
                      </div>
                      <div className="mt-1 text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round((category.completed / category.total) * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#40b8a6]" />
                  Recent Achievements
                </h3>
                <Link href="/achievements" className="text-[#40b8a6] hover:text-[#359e8d] font-medium text-sm flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockProgressData.recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-[#40b8a6]/10 to-[#359e8d]/10 border border-[#40b8a6]/20 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                        <achievement.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Progress;
