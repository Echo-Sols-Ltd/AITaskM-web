'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, Task } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Plus, Filter, Search } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      
      const response = await apiClient.getTasks(params);
      setTasks(response.tasks || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    setShowForm(false);
    loadTasks();
  };

  const handleTaskUpdated = () => {
    loadTasks();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#40b8a6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.status || filters.priority || filters.search) && (
          <button
            onClick={() => setFilters({ status: '', priority: '', search: '' })}
            className="mt-3 text-sm text-[#40b8a6] hover:text-[#359e8d]"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={loadTasks}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filters.status || filters.priority || filters.search
              ? 'No tasks match your filters'
              : 'No tasks yet. Create your first task!'}
          </p>
          {!filters.status && !filters.priority && !filters.search && (
            <button
              onClick={() => setShowForm(true)}
              className="text-[#40b8a6] hover:text-[#359e8d] font-medium"
            >
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onUpdate={handleTaskUpdated} />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} onSuccess={handleTaskCreated} />
      )}
    </div>
  );
}
