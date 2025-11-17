'use client';

import React, { useState } from 'react';
import { Task, apiClient } from '@/services/api';
import { Calendar, User, Clock, MoreVertical, Trash2, Edit, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [updating, setUpdating] = useState(false);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    blocked: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      await apiClient.updateTaskStatus(task._id, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
      setShowMenu(false);
    }
  };

  const handleProgressUpdate = async (newProgress: number) => {
    try {
      setUpdating(true);
      await apiClient.updateTaskProgress(task._id, newProgress);
      onUpdate();
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setUpdating(true);
      await apiClient.deleteTask(task._id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete task:', error);
      setUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-4 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-4 top-12 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10 py-1 min-w-[150px]"
          >
            <button
              onClick={() => handleStatusChange('in_progress')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
            >
              <Clock size={16} />
              Start Task
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Complete
            </button>
            <hr className="my-1 border-gray-200 dark:border-gray-600" />
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={16} />
          <span>{formatDate(task.deadline)}</span>
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <User size={16} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}

        {task.estimatedHours && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={16} />
            <span>{task.estimatedHours}h estimated</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {task.progress || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${task.progress || 0}%` }}
            className="bg-[#40b8a6] h-2 rounded-full transition-all"
          />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>

        {/* Quick Progress Buttons */}
        {task.status !== 'completed' && (
          <div className="flex gap-1">
            {[25, 50, 75, 100].map((progress) => (
              <button
                key={progress}
                onClick={() => handleProgressUpdate(progress)}
                disabled={updating}
                className={`text-xs px-2 py-1 rounded ${
                  (task.progress || 0) >= progress
                    ? 'bg-[#40b8a6] text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {progress}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Loading Overlay */}
      {updating && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40b8a6]"></div>
        </div>
      )}
    </motion.div>
  );
}
