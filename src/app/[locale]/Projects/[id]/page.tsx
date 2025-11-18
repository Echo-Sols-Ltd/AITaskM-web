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
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  ListTodo,
  MoreVertical,
  X,
  Save,
  Target,
  TrendingUp,
  AlertCircle,
  FileText,
  MessageSquare
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
  progress: number;
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
  startDate: string;
  endDate: string;
  team: {
    members: TeamMember[];
  };
  tasks: Task[];
  createdBy: {
    _id: string;
    name: string;
  };
}

export default function ProjectViewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'activity'>('overview');
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  
  // Forms
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: 'planning' as any,
    priority: 'medium' as any,
    endDate: ''
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    assignedTo: ''
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [availableUsers, setAvailableUsers] = useState<TeamMember[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadProject();
    loadAvailableUsers();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProject(projectId);
      setProject(response.project || response);
      
      // Initialize edit form
      const proj = response.project || response;
      setEditForm({
        name: proj.name,
        description: proj.description || '',
        status: proj.status,
        priority: proj.priority,
        endDate: proj.endDate ? new Date(proj.endDate).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      console.error('Failed to load project:', error);
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

  const handleUpdateProject = async () => {
    try {
      await apiClient.updateProject(projectId, editForm);
      await loadProject();
      setShowEditModal(false);
    } catch (error: any) {
      alert(error.message || 'Failed to update project');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      await apiClient.createTask({
        ...newTask,
        project: projectId,
        status: 'todo'
      });
      
      await loadProject();
      setShowAddTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: ''
      });
    } catch (error: any) {
      alert(error.message || 'Failed to create task');
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one member');
      return;
    }

    try {
      await apiClient.addProjectMembers(projectId, selectedUsers);
      await loadProject();
      setShowAddMemberModal(false);
      setSelectedUsers([]);
    } catch (error: any) {
      alert(error.message || 'Failed to add members');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Remove this member from the project?')) return;

    try {
      await apiClient.removeProjectMember(projectId, memberId);
      await loadProject();
    } catch (error: any) {
      alert(error.message || 'Failed to remove member');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await apiClient.updateTask(taskId, { status });
      await loadProject();
    } catch (error: any) {
      alert(error.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;

    try {
      await apiClient.deleteTask(taskId);
      await loadProject();
    } catch (error: any) {
      alert(error.message || 'Failed to delete task');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'planning':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'todo':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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

  const tasks = project.tasks || [];
  const teamMembers = project.team?.members || [];
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['admin', 'manager']}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <div className="md:ml-64 flex-1">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                  <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                  <button
                    onClick={() => router.push('/Projects')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <ArrowLeft size={20} />
                    <span className="hidden md:inline">Back</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-[#40b8a6]" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    <span className="hidden md:inline">Edit</span>
                  </button>
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

            <div className="p-4 md:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Project Header Card */}
                <div className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} bg-white/20 backdrop-blur-sm`}>
                          {project.status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)} bg-white/20 backdrop-blur-sm`}>
                          {project.priority} priority
                        </span>
                      </div>
                      <p className="text-white/90 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{teamMembers.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ListTodo size={16} />
                          <span>{completedTasks}/{totalTasks} tasks completed</span>
                        </div>
    