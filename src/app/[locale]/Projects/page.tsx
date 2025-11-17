'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import RoleBasedRoute from '../../../components/RoleBasedRoute';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import NotificationCenter from '../../../components/NotificationCenter';
import { apiClient } from '@/services/api';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Calendar,
  TrendingUp,
  MoreVertical,
  CheckCircle,
  Clock,
  X,
  Trash2,
  Eye
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  progress: number;
  team: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'planning' as 'planning' | 'active' | 'on_hold' | 'completed',
    endDate: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProjects();
      console.log('Projects response:', response);
      
      // Handle response format
      let projectsData: any[] = [];
      if (Array.isArray(response)) {
        projectsData = response;
      } else if (response && typeof response === 'object') {
        const responseObj = response as any;
        if ('projects' in responseObj) {
          projectsData = Array.isArray(responseObj.projects) ? responseObj.projects : [];
        }
      }
      
      // Map backend data to frontend format
      const mappedProjects = projectsData.map((p: any) => ({
        id: p._id,
        name: p.name,
        description: p.description || '',
        status: p.status || 'planning',
        progress: p.progress || 0,
        team: p.team?.members?.length || 0,
        deadline: p.endDate || p.createdAt,
        priority: p.priority || 'medium'
      }));
      
      setProjects(mappedProjects);
    } catch (error: any) {
      console.error('Failed to load projects:', error);
      setError(error.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    try {
      setIsCreating(true);
      await apiClient.createProject({
        name: newProject.name.trim(),
        description: newProject.description.trim() || undefined,
        priority: newProject.priority,
        status: newProject.status,
        endDate: newProject.endDate || undefined
      });
      
      await loadProjects();
      setShowCreateModal(false);
      setNewProject({
        name: '',
        description: '',
        priority: 'medium',
        status: 'planning',
        endDate: ''
      });
    } catch (error: any) {
      console.error('Failed to create project:', error);
      alert(error.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await apiClient.deleteProject(projectId);
      await loadProjects();
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      alert(error.message || 'Failed to delete project');
    }
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

  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['admin', 'manager']}>
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
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-[#40b8a6]" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h1>
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

            {/* Content */}
            <div className="p-6 lg:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Projects</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Manage and track your projects
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                  >
                    <Plus size={20} />
                    New Project
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{projects.length}</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {projects.filter(p => p.status === 'active').length}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {projects.filter(p => p.status === 'completed').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">On Hold</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {projects.filter(p => p.status === 'on-hold').length}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6]"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {project.name}
                              </h3>
                              <span className={`text-xs ${getPriorityColor(project.priority)}`}>
                                ●
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => router.push(`/Projects/${project.id}`)}
                              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye size={18} className="text-blue-600 dark:text-blue-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete project"
                            >
                              <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ').replace('-', ' ')}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {project.progress}% Complete
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Users size={16} />
                              <span>{project.team} members</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>{new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create Project Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Project</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                      placeholder="Enter project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                      placeholder="Enter project description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={newProject.priority}
                        onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
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
                        value={newProject.status}
                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateProject}
                      disabled={isCreating || !newProject.name.trim()}
                      className="flex-1 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isCreating ? 'Creating...' : 'Create Project'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </RoleBasedRoute>
    </ProtectedRoute>
  );
}
