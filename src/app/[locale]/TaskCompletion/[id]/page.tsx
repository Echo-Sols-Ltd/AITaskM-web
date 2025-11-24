"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Clock,
  AlertCircle,
  Bell,
  Search,
} from "lucide-react";

import RoleBasedSidebar from "@/components/RoleBasedSidebar";
import NotificationCenter from '../../../../components/NotificationCenter';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import MobileMenuButton from '../../../../components/MobileMenuButton';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useTranslations } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, type Task } from "@/services/api";

const TaskCompletionContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  // Get task ID from URL params
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [blockers, setBlockers] = useState<string[]>([]);
  const [newBlocker, setNewBlocker] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tCommon = useTranslations('common');
  const t = useTranslations('taskCompletion');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch task data on component mount
  useEffect(() => {
    const fetchTask = async () => {
      console.log('TaskCompletion - taskId from URL:', taskId);
      
      if (!taskId) {
        console.log('TaskCompletion - No task ID found in URL parameters');
        setError('No task ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
       
        const taskData = await apiClient.getTaskById(taskId);
      
        setTask(taskData);
        setProgress(taskData.progress || 0);
        setError(null);
      } catch (err: any) {
        console.error('TaskCompletion - Failed to fetch task:', err);
        setError(err.message || 'Failed to load task data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addBlocker = () => {
    if (newBlocker.trim()) {
      setBlockers((prev) => [...prev, newBlocker.trim()]);
      setNewBlocker("");
    }
  };

  const removeBlocker = (index: number) => {
    setBlockers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!task || !taskId) return;

    setIsSubmitting(true);
    try {
      // Update progress first
      await apiClient.updateTaskProgress(taskId, progress, notes);
      
      // Update status if task is completed
      if (progress === 100 && task.status !== 'completed') {
        await apiClient.updateTaskStatus(taskId, 'completed', notes);
      }
      
      // Refresh task data
      const updatedTask = await apiClient.getTaskById(taskId);
      setTask(updatedTask);
      
      // Show success message or redirect
      router.push('/Dashboard');
    } catch (err: any) {
      console.error('Failed to update task:', err);
      setError(err.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!task || !taskId) return;

    try {
      // Update status using the dedicated status endpoint
      await apiClient.updateTaskStatus(taskId, newStatus);
      
      // If marking as completed, also update progress to 100%
      if (newStatus === 'completed') {
        await apiClient.updateTaskProgress(taskId, 100);
      }
      
      // Refresh task data
      const updatedTask = await apiClient.getTaskById(taskId);
      setTask(updatedTask);
      setProgress(updatedTask.progress || 0);
    } catch (err: any) {
      console.error('Failed to update task status:', err);
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleBackToDashboard = () => {
    router.push('/Dashboard');
  };

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

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#40b8a6] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading task...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !task) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Task Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'The requested task could not be found.'}</p>
            <button
              onClick={handleBackToDashboard}
              className="bg-[#40b8a6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#359e8d] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Header */}
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
                <NotificationCenter />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={handleBackToDashboard}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Task Completion
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Update your progress and submit your work
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Task Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {task.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{task.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority} priority
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.department && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
                              {task.department.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>Assigned by: {task.assignedBy?.name || 'System'}</span>
                          {task.deadline && (
                            <span>
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-emerald-600 dark:bg-emerald-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {task.requirements && task.requirements.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                          Requirements
                        </h3>
                        <ul className="space-y-2">
                          {task.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-emerald-600 dark:border-emerald-500 flex items-center justify-center mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500"></div>
                              </div>
                              <span className="text-gray-700 dark:text-gray-300">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>

                  {/* Progress Update */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Update Progress
                    </h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Progress: {progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Work Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Describe what you've accomplished, challenges faced, and next steps..."
                        className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Attach Files
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            PNG, JPG, PDF, DOC up to 10MB
                          </p>
                        </label>
                      </div>

                      {/* File List */}
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <svg
                                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Blockers */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Blockers & Issues
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newBlocker}
                          onChange={(e) => setNewBlocker(e.target.value)}
                          placeholder="Describe any blockers or issues..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === "Enter" && addBlocker()}
                        />
                        <button
                          onClick={addBlocker}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {blockers.length > 0 && (
                        <div className="space-y-2">
                          {blockers.map((blocker, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                            >
                              <span className="text-sm text-red-800 dark:text-red-300">
                                {blocker}
                              </span>
                              <button
                                onClick={() => removeBlocker(index)}
                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Quick Actions
                    </h3>

                    <div className="space-y-3">
                      {task.status !== 'completed' && (
                        <button 
                          onClick={() => handleStatusChange('completed')}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark as Complete
                        </button>
                      )}

                      {task.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange('in-progress')}
                          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Start Task
                        </button>
                      )}

                      {task.status === 'in-progress' && (
                        <button 
                          onClick={() => handleStatusChange('pending')}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          Mark as Pending
                        </button>
                      )}

                      <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Request Extension
                      </button>

                      <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Ask for Help
                      </button>

                      <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        View History
                      </button>
                    </div>
                  </motion.div>

                  {/* Task Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Task Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Feb 10, 2024</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Estimated Time
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">8 hours</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time Spent
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">5.5 hours</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dependencies
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">None</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                            UI/UX
                          </span>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                            Design
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-4 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit Update"
                      )}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const TaskCompletion: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#40b8a6] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <TaskCompletionContent />
    </Suspense>
  );
};

export default TaskCompletion;