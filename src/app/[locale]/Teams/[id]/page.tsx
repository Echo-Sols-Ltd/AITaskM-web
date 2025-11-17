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
  Users,
  ArrowLeft,
  Edit,
  Save,
  X,
  UserPlus,
  UserMinus,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  Shield,
  UserCheck,
  Award
} from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status?: string;
}

interface Team {
  _id: string;
  name: string;
  description?: string;
  members?: TeamMember[];
  lead?: any;
  manager?: any;
  createdAt?: string;
  updatedAt?: string;
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const teamId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getTeamById(teamId);
      const teamData = response.team || response;
      setTeam(teamData);
      setEditedName(teamData.name);
      setEditedDescription(teamData.description || '');
    } catch (error: any) {
      console.error('Failed to load team:', error);
      setError(error.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedName.trim()) return;

    try {
      setIsSaving(true);
      await apiClient.updateTeam(teamId, {
        name: editedName.trim(),
        description: editedDescription.trim() || undefined
      });
      
      await loadTeam();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update team:', error);
      alert(error.message || 'Failed to update team');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(team?.name || '');
    setEditedDescription(team?.description || '');
    setIsEditing(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) return;

    try {
      const currentMembers = team?.members?.map(m => m._id) || [];
      const updatedMembers = currentMembers.filter(id => id !== memberId);

      await apiClient.updateTeam(teamId, {
        members: updatedMembers
      });

      await loadTeam();
    } catch (error: any) {
      console.error('Failed to remove member:', error);
      alert(error.message || 'Failed to remove member');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'manager':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'employee':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'manager':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
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

  if (error || !team) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Team Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'The team you are looking for does not exist.'}
            </p>
            <button
              onClick={() => router.push('/Teams')}
              className="bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Teams
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
                  onClick={() => router.push('/Teams')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Team Details</h1>
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
              {/* Team Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-[#40b8a6] focus:outline-none w-full"
                          placeholder="Team name"
                        />
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                          placeholder="Team description"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {team.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {team.description || 'No description'}
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
                          disabled={isSaving || !editedName.trim()}
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
                        Edit Team
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {team.members?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tasks</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Members ({team.members?.length || 0})
                  </h3>
                  <button
                    onClick={() => router.push('/Teams')}
                    className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <UserPlus size={16} />
                    Add Member
                  </button>
                </div>

                {team.members && team.members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.members.map((member) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {member.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {member.email}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleColor(member.role)}`}>
                              {getRoleIcon(member.role)}
                              {member.role}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                          title="Remove member"
                        >
                          <UserMinus size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No members yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add members to this team to get started
                    </p>
                    <button
                      onClick={() => router.push('/Teams')}
                      className="inline-flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <UserPlus size={16} />
                      Add Member
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
