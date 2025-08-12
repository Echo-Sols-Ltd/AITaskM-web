"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "task_assigned",
    title: "New task assigned",
    message: "You have been assigned a new task: 'Design new landing page'",
    timestamp: "2 minutes ago",
    read: false,
    priority: "high",
    sender: "AI Assistant",
    action: "view_task",
  },
  {
    id: 2,
    type: "task_completed",
    title: "Task completed",
    message:
      "Sarah Johnson completed the task 'User authentication implementation'",
    timestamp: "5 minutes ago",
    read: false,
    priority: "medium",
    sender: "Sarah Johnson",
    action: "view_task",
  },
  {
    id: 3,
    type: "deadline_approaching",
    title: "Deadline approaching",
    message: "Task 'Database optimization' is due in 2 hours",
    timestamp: "15 minutes ago",
    read: true,
    priority: "high",
    sender: "System",
    action: "view_task",
  },
  {
    id: 4,
    type: "team_update",
    title: "Team update",
    message: "Mike Chen joined the Engineering team",
    timestamp: "1 hour ago",
    read: true,
    priority: "low",
    sender: "System",
    action: "view_profile",
  },
  {
    id: 5,
    type: "achievement",
    title: "Achievement unlocked",
    message: "Congratulations! You've earned the 'Early Bird' badge",
    timestamp: "2 hours ago",
    read: true,
    priority: "medium",
    sender: "System",
    action: "view_achievement",
  },
  {
    id: 6,
    type: "project_update",
    title: "Project milestone reached",
    message: "Project 'MoveIt Platform' has reached 75% completion",
    timestamp: "3 hours ago",
    read: true,
    priority: "medium",
    sender: "Emily Rodriguez",
    action: "view_project",
  },
  {
    id: 7,
    type: "mention",
    title: "You were mentioned",
    message: "David Kim mentioned you in a comment on task 'API documentation'",
    timestamp: "4 hours ago",
    read: true,
    priority: "medium",
    sender: "David Kim",
    action: "view_comment",
  },
  {
    id: 8,
    type: "reminder",
    title: "Daily standup reminder",
    message: "Your daily standup meeting starts in 30 minutes",
    timestamp: "5 hours ago",
    read: true,
    priority: "low",
    sender: "Calendar",
    action: "join_meeting",
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = [
    { key: "all", label: "All", count: notifications.length },
    {
      key: "unread",
      label: "Unread",
      count: notifications.filter((n) => !n.read).length,
    },
    {
      key: "high",
      label: "High Priority",
      count: notifications.filter((n) => n.priority === "high").length,
    },
    {
      key: "task",
      label: "Tasks",
      count: notifications.filter((n) => n.type.includes("task")).length,
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "unread" && !notification.read) ||
      (selectedFilter === "high" && notification.priority === "high") ||
      (selectedFilter === "task" && notification.type.includes("task"));

    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.sender.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg
              className="w-5 h-5 text-blue-600"
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
        );
      case "task_completed":
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg
              className="w-5 h-5 text-green-600"
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
        );
      case "deadline_approaching":
        return (
          <div className="p-2 bg-red-100 rounded-full">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "achievement":
        return (
          <div className="p-2 bg-yellow-100 rounded-full">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFFD] to-[#edfbfa]">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  Stay updated with task updates and team activities
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-[#40b8a6] text-white rounded-lg hover:bg-[#359e8d] transition-colors text-sm"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === filter.key
                        ? "bg-[#40b8a6] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notifications..."
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

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(
                      notification.priority
                    )} ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      {getNotificationIcon(notification.type)}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                !notification.read
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {notification.sender}
                              </span>
                              <span className="text-xs text-gray-500">
                                {notification.timestamp}
                              </span>
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-[#40b8a6] rounded-full"></span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Mark as read"
                              >
                                <svg
                                  className="w-4 h-4"
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
                              </button>
                            )}

                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete notification"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          <button className="text-sm text-[#40b8a6] hover:text-[#359e8d] transition-colors">
                            {notification.action === "view_task" && "View Task"}
                            {notification.action === "view_profile" &&
                              "View Profile"}
                            {notification.action === "view_achievement" &&
                              "View Achievement"}
                            {notification.action === "view_project" &&
                              "View Project"}
                            {notification.action === "view_comment" &&
                              "View Comment"}
                            {notification.action === "join_meeting" &&
                              "Join Meeting"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
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
                      d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2zM10 7h10V5H10v2zM10 11h10V9H10v2zM10 15h10v-2H10v2zM10 19h10v-2H10v2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Notification Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Task assignments
                    </p>
                    <p className="text-sm text-gray-600">
                      Get notified when tasks are assigned to you
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Deadline reminders
                    </p>
                    <p className="text-sm text-gray-600">
                      Receive alerts for approaching deadlines
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Team updates</p>
                    <p className="text-sm text-gray-600">
                      Notifications about team changes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Achievement badges
                    </p>
                    <p className="text-sm text-gray-600">
                      Celebrate your accomplishments
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Mentions</p>
                    <p className="text-sm text-gray-600">
                      When someone mentions you
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Email notifications
                    </p>
                    <p className="text-sm text-gray-600">
                      Receive notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;