'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import RoleBasedRoute from '../../../components/RoleBasedRoute';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { apiClient } from '@/services/api';
import NotificationCenter from '../../../components/NotificationCenter';
import { 
  Users, 
  Plus, 
  UserPlus,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

interface Team {
  _id: string;
  name: string;
  description?: string;
  members?: any[];
  lead?: any;
  createdAt?: string;
  updatedAt?: string;
}

export default function TeamsPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getTeams();
      console.log('Teams response:', response);
      
      // Handle both array and object with teams property
      const teamsData = Array.isArray(response) ? response : response.teams || [];
      setTeams(teamsData);
    } catch (error: any) {
      console.error('Failed to load teams:', error);
      setError(error.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    try {
      setIsCreating(true);
      const teamData = {
        name: newTeamName.trim(),
        description: newTeamDescription.trim() || undefined,
        members: []
      };

      await apiClient.createTeam(teamData);
      
      // Reload teams
      await loadTeams();
      
      // Reset form and close modal
      setNewTeamName('');
      setNewTeamDescription('');
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Failed to create team:', error);
      alert(error.message || 'Failed to create team');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      await apiClient.deleteTeam(teamId);
      await loadTeams();
    } catch (error: any) {
      console.error('Failed to delete team:', error);
      alert(error.message || 'Failed to delete team');
    }
  };

  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['admin', 'manager']}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                  <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#40b8a6]" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Teams</h1>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Teams</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Manage teams and their members
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                  >
                    <Plus size={20} />
                    Create Team
                  </motion.button>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6]"></div>
                  </div>
                ) : teams.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No teams yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first team to get started
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus size={20} />
                      Create Team
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team, index) => (
                      <motion.div
                        key={team._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {team.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {team.description || 'No description'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {team.members?.length || 0}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                              </div>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Tasks</p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#40b8a6] text-white rounded-lg hover:bg-[#359e8d] transition-colors text-sm"
                              >
                                <UserPlus size={16} />
                                Add Member
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDeleteTeam(team._id)}
                                className="px-3 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                              >
                                Delete
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Create Team Modal */}
                {showCreateModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Create New Team
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Team Name *
                          </label>
                          <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="Enter team name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={newTeamDescription}
                            onChange={(e) => setNewTeamDescription(e.target.value)}
                            placeholder="Enter team description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={handleCreateTeam}
                            disabled={isCreating || !newTeamName.trim()}
                            className="flex-1 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCreating ? 'Creating...' : 'Create Team'}
                          </button>
                          <button
                            onClick={() => {
                              setShowCreateModal(false);
                              setNewTeamName('');
                              setNewTeamDescription('');
                            }}
                            disabled={isCreating}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </RoleBasedRoute>
    </ProtectedRoute>
  );
}
