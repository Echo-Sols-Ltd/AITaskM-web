// app/tasks/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations} from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import MobileMenuButton from '../../../components/MobileMenuButton';
import RoleBasedSidebar from "../../../components/RoleBasedSidebar";
import NotificationCenter from '../../../components/NotificationCenter';
import ProtectedRoute from '../../../components/ProtectedRoute';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { apiClient, CreateTaskRequest } from "@/services/api";

export default function NewTaskPage() {
  const t = useTranslations('tasks');

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [deadline, setDeadline] = useState("");
  const [assignee, setAssignee] = useState("Me");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();
  const { user } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!taskTitle.trim()) {
      setError("Task title is required");
      return;
    }
    
    if (!user) {
      setError("You must be logged in to create tasks");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const taskData: CreateTaskRequest = {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        priority: priority.toLowerCase() as 'low' | 'medium' | 'high' | 'urgent',
        ...(deadline && { deadline: new Date(deadline).toISOString() }),
        // Don't send assignedTo if "Me" is selected - backend will default to current user
      };
      
      const createdTask = await apiClient.createTask(taskData);
      
      setSuccess("Task created successfully!");
      
      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setPriority("low");
      setDeadline("");
      setAssignee("Me");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/Dashboard');
      }, 1500);
      
    } catch (err: any) {
      console.error('Task creation failed:', err);
      setError(err.message || "Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { user } = useAuth();

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

          {/* Form Content */}
          <div className="max-w-3xl mx-auto p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t('title')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder={t('createNew')}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#40b8a6] dark:text-white"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 border-b border-gray-200">
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <span className="text-gray-500 text-sm font-medium">
                        H₁
                      </span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <span className="text-gray-500 text-sm font-medium">
                        H₂
                      </span>
                    </button>
                    <span className="mx-1 text-gray-300">|</span>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Bold size={16} className="text-gray-500" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Italic size={16} className="text-gray-500" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Underline size={16} className="text-gray-500" />
                    </button>
                    <span className="mx-1 text-gray-300">|</span>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <List size={16} className="text-gray-500" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <ListOrdered size={16} className="text-gray-500" />
                    </button>
                    <span className="mx-1 text-gray-300">|</span>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Link size={16} className="text-gray-500" />
                    </button>
                  </div>
                  <textarea
                    id="description"
                    placeholder="Add more details to this task"
                    className="w-full p-4 bg-gray-50 focus:outline-none min-h-32"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="deadline"
                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-4">
                    <CalendarIcon size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label
                  htmlFor="assignee"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Assignee
                </label>
                <div className="relative">
                  <select
                    id="assignee"
                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  >
                    <option value="Me">Me</option>
                    <option value="Team Member 1">Team Member 1</option>
                    <option value="Team Member 2">Team Member 2</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !taskTitle.trim()}
                  className="w-full py-4 bg-[#40b8a6] hover:bg-[#359e8d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Creating task..." : "Create task"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}


