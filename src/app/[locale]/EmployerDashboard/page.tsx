"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFFD] to-[#edfbfa]">
      <div className="pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Team Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor your team&apos;s productivity and task progress in
                  real-time
                </p>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 bg-[#40b8a6] text-white rounded-full text-sm font-medium hover:bg-[#359e8d] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/Gamification"
                  className="px-4 py-2 bg-transparent text-[#40b8a6] border border-[#40b8a6] rounded-full text-sm font-medium hover:bg-[#e7f9f6] transition-colors"
                >
                  Gamification
                </Link>
                <Link
                  href="/KPITracking"
                  className="px-4 py-2 bg-transparent text-[#40b8a6] border border-[#40b8a6] rounded-full text-sm font-medium hover:bg-[#e7f9f6] transition-colors"
                >
                  KPI Tracking
                </Link>
                <Link
                  href="/Messaging"
                  className="px-4 py-2 bg-transparent text-[#40b8a6] border border-[#40b8a6] rounded-full text-sm font-medium hover:bg-[#e7f9f6] transition-colors"
                >
                  Messaging
                </Link>
                <Link
                  href="/Notifications"
                  className="px-4 py-2 bg-transparent text-[#40b8a6] border border-[#40b8a6] rounded-full text-sm font-medium hover:bg-[#e7f9f6] transition-colors"
                >
                  Notifications
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockStats.totalEmployees}
                  </p>
                </div>
                <div className="p-3 bg-[#e7f9f6] rounded-full">
                  <svg
                    className="w-6 h-6 text-[#40b8a6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Now
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockStats.activeEmployees}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-[#40b8a6]">
                    {mockStats.totalTasks}
                  </p>
                </div>
                <div className="p-3 bg-[#e7f9f6] rounded-full">
                  <svg
                    className="w-6 h-6 text-[#40b8a6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Productivity
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mockStats.averageProductivity}%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-orange-600"
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
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === "all" ? "All Roles" : role}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDeadline}
                  onChange={(e) => setSelectedDeadline(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                >
                  {deadlines.map((deadline) => (
                    <option key={deadline} value={deadline}>
                      {deadline === "all"
                        ? "All Deadlines"
                        : deadline === "today"
                        ? "Due Today"
                        : deadline === "this-week"
                        ? "This Week"
                        : deadline === "this-month"
                        ? "This Month"
                        : deadline === "overdue"
                        ? "Overdue"
                        : deadline}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees or tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
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
                Team Performance
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
                Recent Tasks
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
              Quick Actions
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
                  <p className="font-medium text-gray-900">Assign New Task</p>
                  <p className="text-sm text-gray-600">
                    Create and assign tasks to team members
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
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-600">
                    Generate detailed performance reports
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
                  <p className="font-medium text-gray-900">Team Schedule</p>
                  <p className="text-sm text-gray-600">
                    View and manage team schedules
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
