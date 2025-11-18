'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import RoleBasedSidebar from '../../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../../components/MobileMenuButton';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import RoleBasedRoute from '../../../../components/RoleBasedRoute';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import NotificationCenter from '../../../../components/NotificationCenter';
import { apiClient } from '@/services/api';
import { 
  ArrowLeft,
  Briefcase, 
  Plus, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  X,
  Edit,
  Trash2,
  MoreVertical,
  Target,
  TrendingUp,
  AlertCircle,
  FileText,
  MessageSquare,
  Paperclip,
  Filter,
  Search,
  UserPlus
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
  createdAt: string;
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  startDate?: string;
  endDate?: string;
  team?: {
    members: TeamMember[];
  };
  tasks?: Task[];
  createdBy?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'activity'>('overview');
  
  // Modals
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  
  // Task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
    dueDate: '',
    assignedTo: ''
  });
  
  // Filters
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [taskSearch, setTaskSearch] = useState('');
  
  const [availableUsers, setAvailableUsers] = useState<TeamMember[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    loadProjectDetails();
    loadAvailableUsers();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProject(projectId);
      setProject(response.project || response);
      setTasks(response.project?.tasks || response.tasks || []);
    } catch (error: any) {
      console.error('Failed to load project:', error);
      alert('Failed to load project details');
      router.push('/Projects');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      setAvailableUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      setIsCreatingTask(true);
      await apiClient.createTask({
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        status: newTask.status,
        dueDate: newTask.dueDate || undefined,
        assignedTo: newTask.assignedTo || undefined,
        project: projectId
      });
      
      await loadProjectDetails();
      setShowAddTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        assignedTo: ''
      });
    } catch (error: any) {
      console.error('Failed to create task:', error);
      alert(error.message || 'Failed to create task');
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await apiClient.updateTask(taskId, { status: newStatus });
      await loadProjectDetails();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await apiClient.deleteTask(taskId);
      await loadProjectDetails();
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const handleAddTeamMember = async (userId: string) => {
    try {
      await apiClient.addProjectMember(projectId, userId);
      await loadProjectDetails();
      setShowAddMemberModal(false);
    } catch (error: any) {
      console.error('Failed to add team member:', error);
      alert('Failed to add team member');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in-progress':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'planning':
      case 'todo':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'on_hold':
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = taskFilter === 'all' || task.status === taskFilter;
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                         task.description?.toLowerCase().includes(taskSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6]"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
            <button
              onClick={() => router.push('/Projects')}
              className="text-[#40b8a6] hover:underline"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['admin', 'manager']}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                  <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                  <button
                    onClick={() => router.push('/Projects')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span className="hidden md:inline">Back to Projects</span>
                  </button>
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

            {/* Content */}
            <div className="p-4 md:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-8 h-8" />
                        <h1 className="text-3xl font-bold">{project.name}</h1>
                        <span className={`text-2xl ${getPriorityColor(project.priority)}`}>●</span>
                      </div>
                      <p className="text-emerald-100 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)} bg-white/20 backdrop-blur-sm`}>
                          {project.status.replace('_', ' ').replace('-', ' ')}
                        </span>
                        {project.endDate && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm flex items-center gap-2">
                            <Calendar size={16} />
                            Due: {new Date(project.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditProjectModal(true)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Project Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-white h-3 rounded-full transition-all shadow-lg"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Tasks</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.inProgress}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.completed}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.team?.members?.length || 0}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Team Members</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1 p-2">
                      {(['overview', 'tasks', 'team', 'activity'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                            activeTab === tab
                              ? 'bg-[#40b8a6] text-white'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {/* Overview Tab */}
                      {activeTab === 'overview' && (
                        <motion.div
                          key="overview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Details</h3>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                                    {project.status.replace('_', ' ').replace('-', ' ')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
                                  <p className={`font-medium capitalize ${getPriorityColor(project.priority)}`}>
                                    {project.priority}
                                  </p>
                                </div>
                                {project.startDate && (
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {new Date(project.startDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                                {project.endDate && (
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {new Date(project.endDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                                {project.createdBy && (
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Created By</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {project.createdBy.name}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Remaining</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {taskStats.todo + taskStats.inProgress}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Team Size</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {project.team?.members?.length || 0} members
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Tasks Tab */}
                      {activeTab === 'tasks' && (
                        <motion.div
                          key="tasks"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          {/* Task Controls */}
                          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex gap-2 flex-wrap">
                              {(['all', 'todo', 'in-progress', 'completed'] as const).map((filter) => (
                                <button
                                  key={filter}
                                  onClick={() => setTaskFilter(filter)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    taskFilter === filter
                                      ? 'bg-[#40b8a6] text-white'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {filter === 'all' ? 'All' : filter.replace('-', ' ')}
                                  {filter !== 'all' && ` (${taskStats[filter === 'in-progress' ? 'inProgress' : filter as keyof typeof taskStats]})`}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                              <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search tasks..."
                                  value={taskSearch}
                                  onChange={(e) => setTaskSearch(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white text-sm"
                                />
                              </div>
                              <button
                                onClick={() => setShowAddTaskModal(true)}
                                className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                              >
                                <Plus size={18} />
                                Add Task
                              </button>
                            </div>
                          </div>

                          {/* Tasks List */}
                          <div className="space-y-3">
                            {filteredTasks.length === 0 ? (
                              <div className="text-center py-12">
                                <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                  {taskSearch ? 'No tasks found matching your search' : 'No tasks yet. Create one to get started!'}
                                </p>
                              </div>
                            ) : (
                              filteredTasks.map((task, index) => (
                                <motion.div
                                  key={task._id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-all"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                                        <span className={`text-xs ${getPriorityColor(task.priority)}`}>●</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                          {task.status.replace('-', ' ')}
                                        </span>
                                      </div>
                                      {task.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        {task.assignedTo && (
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white text-xs">
                                              {task.assignedTo.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{task.assignedTo.name}</span>
                                          </div>
                                        )}
                                        {task.dueDate && (
                                          <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <select
                                        value={task.status}
                                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                        className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-600 dark:text-white"
                                      >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                      </select>
                                      <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                      >
                                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Team Tab */}
                      {activeTab === 'team' && (
                        <motion.div
                          key="team"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Team Members ({project.team?.members?.length || 0})
                            </h3>
                            <button
                              onClick={() => setShowAddMemberModal(true)}
                              className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              <UserPlus size={18} />
                              Add Member
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.team?.members?.map((member, index) => (
                              <motion.div
                                key={member._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-4"
                              >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold text-lg">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                                  <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">{member.role}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {(!project.team?.members || project.team.members.length === 0) && (
                            <div className="text-center py-12">
                              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                              <p className="text-gray-500 dark:text-gray-400">No team members yet. Add members to collaborate!</p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Activity Tab */}
                      {activeTab === 'activity' && (
                        <motion.div
                          key="activity"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                          <div className="space-y-3">
                            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">
                                  Project created by <span className="font-semibold">{project.createdBy?.name || 'Unknown'}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {new Date(project.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {tasks.slice(0, 5).map((task, index) => (
                              <div key={task._id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    Task "<span className="font-semibold">{task.title}</span>" was created
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {new Date(task.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task Modal */}
          {showAddTaskModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Task</h3>
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                      placeholder="Enter task title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assign To
                    </label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Unassigned</option>
                      {project.team?.members?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCreateTask}
                      disabled={isCreatingTask || !newTask.title.trim()}
                      className="flex-1 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isCreatingTask ? 'Creating...' : 'Create Task'}
                    </button>
                    <button
                      onClick={() => setShowAddTaskModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Add Member Modal */}
          {showAddMemberModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Team Member</h3>
                  <button
                    onClick={() => setShowAddMemberModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  {availableUsers
                    .filter(u => !project.team?.members?.some(m => m._id === u._id))
                    .map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleAddTeamMember(user._id)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{user.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                        <Plus size={20} className="text-[#40b8a6]" />
                      </div>
                    ))}
                  {availableUsers.filter(u => !project.team?.members?.some(m => m._id === u._id)).length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">All users are already team members</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </RoleBasedRoute>
    </ProtectedRoute>
  );
}
