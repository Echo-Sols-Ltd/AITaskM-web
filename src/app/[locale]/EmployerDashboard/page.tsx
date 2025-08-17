"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import EmployerSidebar from "../../../components/EmployerSidebar";
import { useTranslations } from "@/contexts/I18nContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import {
  Users,
  Target,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  PlayCircle,
  Zap,
  Award,
  Activity,
  UserCheck,
  BarChart2,
  Calendar,
  Plus,
  Settings,
  MessageSquare,
  Video,
  Crown,
  AlertCircle,
} from "lucide-react";

// Mock data for employer dashboard
const mockEmployees = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Designer",
    department: "Design",
    avatar: "/pp1.png",
    tasks: {
      total: 8,
      completed: 6,
      inProgress: 1,
      overdue: 1,
    },
    productivity: 87,
    lastActive: "2 minutes ago",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Frontend Developer",
    department: "Engineering",
    avatar: "/pp2.png",
    tasks: {
      total: 12,
      completed: 9,
      inProgress: 2,
      overdue: 1,
    },
    productivity: 92,
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    department: "Product",
    avatar: "/pp1.png",
    tasks: {
      total: 6,
      completed: 4,
      inProgress: 2,
      overdue: 0,
    },
    productivity: 78,
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Backend Developer",
    department: "Engineering",
    avatar: "/pp2.png",
    tasks: {
      total: 10,
      completed: 7,
      inProgress: 2,
      overdue: 1,
    },
    productivity: 85,
    lastActive: "30 minutes ago",
  },
];

const mockTasks = [
  {
    id: 1,
    title: "Design new landing page",
    assignee: "Sarah Johnson",
    department: "Design",
    priority: "high",
    deadline: "2024-02-15",
    status: "in-progress",
    progress: 65,
  },
  {
    id: 2,
    title: "Implement user authentication",
    assignee: "Mike Chen",
    department: "Engineering",
    priority: "medium",
    deadline: "2024-02-20",
    status: "pending",
    progress: 0,
  },
  {
    id: 3,
    title: "Conduct user research interviews",
    assignee: "Emily Rodriguez",
    department: "Product",
    priority: "low",
    deadline: "2024-02-25",
    status: "completed",
    progress: 100,
  },
  {
    id: 4,
    title: "Optimize database queries",
    assignee: "David Kim",
    department: "Engineering",
    priority: "high",
    deadline: "2024-02-18",
    status: "in-progress",
    progress: 40,
  },
];

const mockStats = {
  totalEmployees: 24,
  activeEmployees: 18,
  totalTasks: 156,
  completedTasks: 124,
  overdueTasks: 8,
  averageProductivity: 84,
};

const EmployerDashboard: React.FC = () => {
  const tNav = useTranslations('navigation');
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tEmployer = useTranslations('employerDashboard');
  
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDeadline, setSelectedDeadline] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const departments = [
    "all",
    "Design",
    "Engineering",
    "Product",
    "Marketing",
    "Sales",
  ];
  const roles = [
    "all",
    "Senior Designer",
    "Frontend Developer",
    "Backend Developer",
    "Product Manager",
    "Marketing Manager",
  ];
  const deadlines = ["all", "today", "this-week", "this-month", "overdue"];

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;
    const matchesRole =
      selectedRole === "all" || employee.role === selectedRole;
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesRole && matchesSearch;
  });

  const filteredTasks = mockTasks.filter((task) => {
    const matchesDepartment =
      selectedDepartment === "all" || task.department === selectedDepartment;
    const matchesDeadline =
      selectedDeadline === "all" ||
      (selectedDeadline === "overdue" &&
        new Date(task.deadline) < new Date()) ||
      (selectedDeadline === "today" &&
        new Date(task.deadline).toDateString() === new Date().toDateString());
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesDeadline && matchesSearch;
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <EmployerSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 bg-gradient-to-br from-[#F0FFFD] via-white to-[#edfbfa]">
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
                aria-label="Search"
              >
                <Search className="text-gray-500" size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label="Notifications"
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
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {tEmployer('title')}
                      </h1>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#40b8a6]" />
                        {tEmployer('subtitle')}
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
                title: tEmployer('stats.totalEmployees'),
                value: mockStats.totalEmployees,
                icon: Users,
                color: "from-[#40b8a6] to-[#359e8d]",
                bgColor: "bg-[#e7f9f6]",
                textColor: "text-[#40b8a6]",
                change: `+3 ${tEmployer('stats.changes.thisMonth')}`
              },
              {
                title: tEmployer('stats.activeNow'),
                value: mockStats.activeEmployees,
                icon: UserCheck,
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                textColor: "text-green-600",
                change: `75% ${tEmployer('stats.changes.online')}`
              },
              {
                title: tEmployer('stats.totalTasks'),
                value: mockStats.totalTasks,
                icon: Target,
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                textColor: "text-blue-600",
                change: `+12 ${tEmployer('stats.changes.today')}`
              },
              {
                title: tEmployer('stats.avgProductivity'),
                value: `${mockStats.averageProductivity}%`,
                icon: TrendingUp,
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-50",
                textColor: "text-orange-600",
                change: `+5% ${tEmployer('stats.changes.thisWeek')}`
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
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
                      {stat.title}
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
                  <span className="font-medium">{tEmployer('filters.filterBy')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept === "all" ? tEmployer('filters.allDepartments') : tEmployer(`departments.${dept.toLowerCase()}`)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role === "all" ? tEmployer('filters.allRoles') : tEmployer(`roles.${role.toLowerCase().replace(' ', '')}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative w-full lg:w-80">
                <input
                  type="text"
                  placeholder={tEmployer('filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employee Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {tEmployer('teamPerformance.title')}
              </h2>

              <div className="space-y-4">
                {filteredEmployees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#40b8a6] rounded-full flex items-center justify-center text-white font-medium">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {employee.name}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                        <p className="text-xs text-gray-500">
                          {employee.department}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {employee.productivity}%
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${employee.productivity}%`,
                              backgroundColor:
                                employee.productivity >= 90
                                  ? "#10b981"
                                  : employee.productivity >= 80
                                  ? "#40b8a6"
                                  : employee.productivity >= 70
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {employee.lastActive}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Task Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {tEmployer('recentTasks.title')}
              </h2>

              <div className="space-y-4">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{task.assignee}</span>
                      <span>{task.department}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      {task.status !== "completed" && (
                        <div className="text-right">
                          <span className="text-xs text-gray-600">
                            {task.progress}%
                          </span>
                          <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                            <div
                              className="h-1 bg-[#40b8a6] rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {tEmployer('quickActions.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-[#e7f9f6] rounded-lg hover:bg-[#d1f2ed] transition-colors">
                <div className="p-2 bg-[#40b8a6] rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{tEmployer('quickActions.assignTask.title')}</p>
                  <p className="text-sm text-gray-600">
                    {tEmployer('quickActions.assignTask.description')}
                  </p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 bg-[#e7f9f6] rounded-lg hover:bg-[#d1f2ed] transition-colors">
                <div className="p-2 bg-[#40b8a6] rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{tEmployer('quickActions.viewReports.title')}</p>
                  <p className="text-sm text-gray-600">
                    {tEmployer('quickActions.viewReports.description')}
                  </p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 bg-[#e7f9f6] rounded-lg hover:bg-[#d1f2ed] transition-colors">
                <div className="p-2 bg-[#40b8a6] rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2zM10 7h10V5H10v2zM10 11h10V9H10v2zM10 15h10v-2H10v2zM10 19h10v-2H10v2z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{tEmployer('quickActions.teamSchedule.title')}</p>
                  <p className="text-sm text-gray-600">
                    {tEmployer('quickActions.teamSchedule.description')}
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
