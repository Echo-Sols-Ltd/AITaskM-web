"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import RoleBasedSidebar from "../../../components/RoleBasedSidebar";
import MobileMenuButton from "../../../components/MobileMenuButton";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useTranslations } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import AdminDashboard from '../../../components/dashboards/AdminDashboard';
import ManagerDashboard from '../../../components/dashboards/ManagerDashboard';
import EmployeeDashboard from '../../../components/dashboards/EmployeeDashboard';
import {
  Bell,
  Shield,
  UserCheck,
  Target
} from "lucide-react";


const Dashboard: React.FC = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch tasks
        const tasksResponse = await apiClient.getTasks({ limit: 50 });
        setTasks(tasksResponse.tasks);
        
        // Calculate stats from tasks
        const stats = {
          totalTasks: tasksResponse.total,
          completedTasks: tasksResponse.tasks.filter(t => t.status === 'completed').length,
          pendingTasks: tasksResponse.tasks.filter(t => t.status === 'pending').length,
          overdueTasks: tasksResponse.tasks.filter(t => {
            if (!t.deadline) return false;
            return new Date(t.deadline) < new Date() && t.status !== 'completed';
          }).length,
          productivityScore: Math.round(
            (tasksResponse.tasks.filter(t => t.status === 'completed').length / Math.max(tasksResponse.total, 1)) * 100
          ),
          streakDays: 7 // Placeholder - would need backend calculation
        };
        
        setDashboardData({
          tasks: tasksResponse.tasks,
          stats
        });
        
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        // Set empty data on error
        setTasks([]);
        setDashboardData({
          tasks: [],
          stats: {
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            overdueTasks: 0,
            productivityScore: 0,
            streakDays: 0
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      selectedFilter === "all" || task.status === selectedFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300";
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

  const handleTaskClick = (_id: string) => {
    console.log('Dashboard - Navigating to task with ID:', _id);
    console.log('Dashboard - Full task object:', tasks.find(t => t._id === _id));
    
    // Navigate to TaskCompletion with task ID as route parameter
    const targetUrl = `/en/TaskCompletion/${_id}`;
    console.log('Dashboard - Target URL:', targetUrl);
    
    router.push(targetUrl);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Modern Header */}
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
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={tCommon('search')}
              >
              
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                aria-label={t('notifications')}
              >
                <Bell className="text-gray-600 dark:text-gray-300" size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {t('welcome')}, <span className="text-[#40b8a6]">{user?.name || 'User'}</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
                      <Zap className="w-4 h-4 text-[#40b8a6]" />
                      {t('aiPlanMessage')}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/CreateTask'}
                  className="bg-[#40b8a6] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#359e8d] transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  {t('buttons.createNewTask')}
                </motion.button>
              </div>
            </motion.div>

            {/* Modern Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {dashboardData && [
                {
                  titleKey: "stats.totalTasks",
                  value: dashboardData.stats.totalTasks,
                  icon: Target,
                  bgColor: "bg-gradient-to-br from-[#40b8a6] to-[#359e8d]",
                  change: "+12%",
                  changeType: "positive"
                },
                {
                  titleKey: "stats.completed",
                  value: dashboardData.stats.completedTasks,
                  icon: CheckCircle2,
                  bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
                  change: "+8%",
                  changeType: "positive"
                },
                {
                  titleKey: "stats.productivity",
                  value: `${dashboardData.stats.productivityScore}%`,
                  icon: TrendingUp,
                  bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
                  change: "+5%",
                  changeType: "positive"
                },
                {
                  titleKey: "stats.streak",
                  value: `${dashboardData.stats.streakDays}`,
                  unit: t('stats.days'),
                  icon: Star,
                  bgColor: "bg-gradient-to-br from-amber-500 to-orange-500",
                  change: "+2",
                  changeType: "positive"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      {t(stat.titleKey)}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                      {stat.unit && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">{stat.unit}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Modern Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Filter className="w-5 h-5" />
                    <span className="font-semibold">{t('filterBy')}:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["all", "pending", "in-progress", "completed"].map((filter) => (
                      <motion.button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedFilter === filter
                            ? "bg-[#40b8a6] text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-[#40b8a6] bg-white dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                  />
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#40b8a6] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
              >
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </motion.div>
            )}

            {/* Modern Tasks Grid */}
            {!isLoading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => handleTaskClick(task._id)}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="space-y-4">
                      {/* Task Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#40b8a6] transition-colors line-clamp-2">
                              {task.title}
                            </h3>
                            {task.priority === "high" && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                            {task.description}
                          </p>
                        </div>
                      </div>

                    {/* Task Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {getStatusLabel(task.status)}
                      </span>
                      {task.department && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                          {task.department.name}
                        </span>
                      )}
                    </div>

                    {/* Task Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {task.assignedBy?.name || 'System'}
                        </span>
                        {task.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {task.status !== "completed" && task.progress !== undefined && (
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span className="font-medium">{t('progress')}</span>
                            <span className="font-semibold">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${task.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-full rounded-full"
                            />
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task._id);
                        }}
                        className="flex-1 bg-[#40b8a6] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#359e8d] transition-colors flex items-center justify-center gap-2"
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        aria-label={t('buttons.more')}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </motion.div>
            )}

            {/* Modern Empty State */}
            {!isLoading && !error && filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <Target className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {t('emptyState.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  {t('emptyState.description')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/CreateTask'}
                  className="bg-[#40b8a6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#359e8d] transition-colors flex items-center gap-2 mx-auto shadow-md"
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
    </ProtectedRoute>
  );
};

export default Dashboard;