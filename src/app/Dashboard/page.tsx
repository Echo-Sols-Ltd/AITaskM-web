"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock data for the dashboard
const mockTasks = [
  {
    id: 1,
    title: "Design new landing page",
    description:
      "Create wireframes and mockups for the new product landing page",
    priority: "high",
    deadline: "2024-02-15",
    status: "in-progress",
    assignedBy: "AI Assistant",
    department: "Design",
    progress: 65,
  },
  {
    id: 2,
    title: "Implement user authentication",
    description: "Set up OAuth2 and JWT token system for user login",
    priority: "medium",
    deadline: "2024-02-20",
    status: "pending",
    assignedBy: "AI Assistant",
    department: "Engineering",
    progress: 0,
  },
  {
    id: 3,
    title: "Conduct user research interviews",
    description:
      "Interview 10 potential users to gather feedback on the new feature",
    priority: "low",
    deadline: "2024-02-25",
    status: "completed",
    assignedBy: "AI Assistant",
    department: "Product",
    progress: 100,
  },
  {
    id: 4,
    title: "Optimize database queries",
    description:
      "Review and optimize slow database queries in the analytics module",
    priority: "high",
    deadline: "2024-02-18",
    status: "in-progress",
    assignedBy: "AI Assistant",
    department: "Engineering",
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
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = mockTasks.filter((task) => {
    const matchesFilter =
      selectedFilter === "all" || task.status === selectedFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, <span className="text-[#40b8a6]">Sarah!</span>
                </h1>
                <p className="text-gray-600">
                  Here's what your AI assistant has planned for you today
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
                  href="/CreateTask"
                  className="px-4 py-2 bg-transparent text-[#40b8a6] border border-[#40b8a6] rounded-full text-sm font-medium hover:bg-[#e7f9f6] transition-colors"
                >
                  Create Task
                </Link>
                <Link
                  href="/TaskCompletion"
                  className="px-4 py-2 bg-transparent text-[#40b8a6] border border-[#40b8a6] rounded-full text-sm font-medium hover:bg-[#e7f9f6] transition-colors"
                >
                  Task Completion
                </Link>
                <Link
                  href="/PomodoroTimer"
                  className="px-4 py-2 bg-transparent text-[#40b8a6] border border-[#40b8a6] rounded-full text-sm font-medium hover:bg-[#e7f9f6] transition-colors"
                >
                  Pomodoro Timer
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
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockStats.completedTasks}
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Productivity
                  </p>
                  <p className="text-2xl font-bold text-[#40b8a6]">
                    {mockStats.productivityScore}%
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mockStats.streakDays} days
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
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "in-progress", "completed"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedFilter === filter
                          ? "bg-[#40b8a6] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  )
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
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

          {/* Tasks Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority} priority
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {task.department}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Assigned by: {task.assignedBy}</span>
                      <span>
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>

                    {task.status !== "completed" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#40b8a6] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-[#40b8a6] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#359e8d] transition-colors">
                    {task.status === "completed"
                      ? "View Details"
                      : "Start Task"}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
