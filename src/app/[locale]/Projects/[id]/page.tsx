'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import RoleBasedSidebar from '../../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../../components/MobileMenuButton';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import NotificationCenter from '../../../../components/NotificationCenter';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import { apiClient } from '@/services/api';
import {
  Briefcase,
  ArrowLeft,
  Edit,
  Save,
  X,
  Users,
  Calendar,
  TrendingUp,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description?: string;
  code?: string;
  status: string;
  priority: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  budget?: number;
  actualCost?: number;
  manager?: any;
  team?: any;
  department?: any;
  tasks?: any[];
  milestones?: any[];
  createdAt?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    progress: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProjectById(projectId);
      setProject(response);
      setEditedData({
        name: response.name,
        description: response.description || '',
        status: response.status,
        priority: response.priority,
        progress: response.progress || 0
      });
    } catch (error: any) {
      console.error('Failed to load project:', error);
      setError(error.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedData.name.trim()) return;

    try {
      setIsSaving(true);
      await apiClient.updateProject(projectId, {
        name: editedData.name.trim(),
        description: editedData.description.trim() || undefined,
        status: editedData.status,
        priority: editedData.priority,
        progress: editedData.progress
      });
      
      await loadProject();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update project:', error);
      alert(error.message || 'Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (project) {
      setEditedData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        priority: project.priority,
        progress: project.progress || 0
      });
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'planning':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'on_hold':
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6]"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !project) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Project Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'The project you are looking for does not exist.'}
            </p>
            <button
              onClick={() => router.push('/Projects')}
              className="bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
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
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                <button
                  onClick={() => router.push('/Projects')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Project Details</h1>
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
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Project Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                          className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-[#40b8a6] focus:outline-none w-full"
                          placeholder="Project name"
                        />
                        <textarea
                          value={editedData.description}
                          onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                          placeholder="Project description"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            value={editedData.status}
                            onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                          >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                          </select>
                          <select
                            value={editedData.priority}
                            onChange={(e) => setEditedData({ ...editedData, priority: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editedData.progress}
                            onChange={(e) => setEditedData({ ...editedData, progress: parseInt(e.target.value) || 0 })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                            placeholder="Progress %"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {project.name}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {project.description || 'No description'}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          disabled={isSaving || !editedData.name.trim()}
                          className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Save size={18} />
                          {isSaving ? 'Saving...' : 'Save'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <X size={18} />
                          Cancel
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                        Edit Project
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {!isEditing && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-3 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Project Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.tasks?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tasks</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.milestones?.filter(m => m.completed).length || 0}/{project.milestones?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Milestones</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.actualHours || 0}h
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hours Logged</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                  </div>
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team & Manager */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#40b8a6]" />
                    Team & Manager
                  </h3>
                  <div className="space-y-3">
                    {project.manager && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                          {project.manager.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{project.manager.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Project Manager</p>
                        </div>
                      </div>
                    )}
                    {project.team && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{project.team.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {project.team.members?.length || 0} team members
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget & Cost */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#40b8a6]" />
                    Budget & Cost
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Budget</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${project.budget?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Actual Cost</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${project.actualCost?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-l