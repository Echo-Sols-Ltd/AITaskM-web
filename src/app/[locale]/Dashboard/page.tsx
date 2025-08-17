"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import { useTranslations } from "@/contexts/I18nContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import {
  Home,
  CheckSquare,
  BarChart2,
  Bell,
  Users,
  Settings,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  MoreHorizontal,
  ArrowRight,
  Target,
  Zap,
  CheckCircle2,
  PlayCircle,
  Eye,
} from "lucide-react";

// Mock data for the dashboard - now using translation keys
const mockTasks = [
  {
    id: 1,
    titleKey: "tasks.designLandingPage.title",
    descriptionKey: "tasks.designLandingPage.description",
    priority: "high",
    deadline: "2024-02-15",
    status: "in-progress",
    assignedByKey: "tasks.assignedBy.aiAssistant",
    departmentKey: "departments.design",
    progress: 65,
  },
  {
    id: 2,
    titleKey: "tasks.implementAuth.title",
    descriptionKey: "tasks.implementAuth.description",
    priority: "medium",
    deadline: "2024-02-20",
    status: "pending",
    assignedByKey: "tasks.assignedBy.aiAssistant",
    departmentKey: "departments.engineering",
    progress: 0,
  },
  {
    id: 3,
    titleKey: "tasks.userResearch.title",
    descriptionKey: "tasks.userResearch.description",
    priority: "low",
    deadline: "2024-02-25",
    status: "completed",
    assignedByKey: "tasks.assignedBy.aiAssistant",
    departmentKey: "departments.product",
    progress: 100,
  },
  {
    id: 4,
    titleKey: "tasks.optimizeDatabase.title",
    descriptionKey: "tasks.optimizeDatabase.description",
    priority: "high",
    deadline: "2024-02-18",
    status: "in-progress",
    assignedByKey: "tasks.assignedBy.aiAssistant",
    departmentKey: "departments.engineering",
    progress: 40,
  },
];

const mockStats = {
  totalTasks: 24,
  completedTasks: 18,
  pendingTasks: 4,
  overdueTasks: 2,
  productivityScore: 87,
  streakDays: 12,
};

const Dashboard: React.FC = () => {
  const tNav = useTranslations('navigation');
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tTasks = useTranslations('tasks');
  
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = mockTasks.filter((task) => {
    const matchesFilter =
      selectedFilter === "all" || task.status === selectedFilter;
    const taskTitle = t(task.titleKey) || "";
    const taskDescription = t(task.descriptionKey) || "";
    const matchesSearch =
      taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taskDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "in-progress":
        return <PlayCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -5, 
      transition: { duration: 0.2 },
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case "all":
        return t('filters.all');
      case "pending":
        return t('filters.pending');
      case "in-progress":
        return t('filters.inProgress');
      case "completed":
        return t('filters.completed');
      default:
        return filter;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return t('priority.high');
      case "medium":
        return t('priority.medium');
      case "low":
        return t('priority.low');
      default:
        return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t('status.completed');
      case "in-progress":
        return t('status.inProgress');
      case "pending":
        return t('status.pending');
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-[#F0FFFD] via-white to-[#edfbfa]">
        {/* Enhanced Header */}
        <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="md:hidden">
              <h1 className="text-2xl font-serif italic text-emerald-600">
                MoveIt
              </h1>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <LanguageSwitcher />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={tCommon('search')}
              >
                <Search className="text-gray-500" size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label={t('notifications')}
              >
                <Bell className="text-gray-500" size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
            </div>
          </div>
        </header>

        <div className="pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header Section */}
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
                      <span className="text-xl font-bold text-white">S</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {t('welcome')}, <span className="text-[#40b8a6]">{t('userName')}</span>
                      </h1>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#40b8a6]" />
                        {t('aiPlanMessage')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  titleKey: "stats.totalTasks",
                  value: mockStats.totalTasks,
                  icon: Target,
                  color: "from-[#40b8a6] to-[#359e8d]",
                  bgColor: "bg-[#e7f9f6]",
                  textColor: "text-[#40b8a6]",
                  change: "+12%"
                },
                {
                  titleKey: "stats.completed",
                  value: mockStats.completedTasks,
                  icon: CheckCircle2,
                  color: "from-green-500 to-green-600",
                  bgColor: "bg-green-50",
                  textColor: "text-green-600",
                  change: "+8%"
                },
                {
                  titleKey: "stats.productivity",
                  value: `${mockStats.productivityScore}%`,
                  icon: TrendingUp,
                  color: "from-blue-500 to-blue-600",
                  bgColor: "bg-blue-50",
                  textColor: "text-blue-600",
                  change: "+5%"
                },
                {
                  titleKey: "stats.streak",
                  value: `${mockStats.streakDays} ${t('stats.days')}`,
                  icon: Star,
                  color: "from-orange-500 to-orange-600",
                  bgColor: "bg-orange-50",
                  textColor: "text-orange-600",
                  change: `+2 ${t('stats.days')}`
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.titleKey}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <span className={`text-sm font-medium ${stat.textColor} bg-white rounded-full px-2 py-1 border`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {t(stat.titleKey)}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">{t('filterBy')}:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["all", "pending", "in-progress", "completed"].map((filter) => (
                      <motion.button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedFilter === filter
                            ? "bg-[#40b8a6] text-white shadow-lg"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {getFilterLabel(filter)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="relative w-full lg:w-80">
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Enhanced Tasks Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#40b8a6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#40b8a6] transition-colors">
                            {t(task.titleKey)}
                          </h3>
                          {task.priority === "high" && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {t(task.descriptionKey)}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)} {t('priority.label')}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            {getStatusLabel(task.status)}
                          </span>
                          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            {t(task.departmentKey)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded-xl">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {t(task.assignedByKey)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        </div>

                        {task.status !== "completed" && (
                          <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span className="font-medium">{t('progress')}</span>
                              <span className="font-semibold">{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-full rounded-full relative"
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </motion.div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {task.status === "completed" ? (
                          <>
                            <Eye className="w-4 h-4" />
                            {t('buttons.viewDetails')}
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4" />
                            {t('buttons.startTask')}
                          </>
                        )}
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                        aria-label={t('buttons.more')}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Empty State */}
            {filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <Target className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('emptyState.title')}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t('emptyState.description')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#40b8a6] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#359e8d] transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  {t('buttons.createNewTask')}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;