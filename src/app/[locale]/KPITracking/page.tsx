'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NotificationCenter from '../../../components/NotificationCenter';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  X,
  Save
} from 'lucide-react';

interface KPI {
  _id: string;
  name: string;
  description?: string;
  targetValue: number;
  currentValue?: number;
  unit?: string;
  category?: string;
  assignedTo?: any;
  team?: any;
  period?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function KPITrackingPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKPI, setNewKPI] = useState({
    name: '',
    description: '',
    targetValue: 0,
    unit: '%',
    category: 'productivity',
    period: 'monthly'
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getKPIs();
      const kpisData = Array.isArray(response) ? response : response.kpis || [];
      setKpis(kpisData);
    } catch (error: any) {
      console.error('Failed to load KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKPI = async () => {
    if (!newKPI.name.trim() || newKPI.targetValue <= 0) {
      alert('Please enter a valid KPI name and target value');
      return;
    }

    try {
      setIsCreating(true);
      await apiClient.createKPI(newKPI);
      await loadKPIs();
      setShowCreateModal(false);
      setNewKPI({
        name: '',
        description: '',
        targetValue: 0,
        unit: '%',
        category: 'productivity',
        period: 'monthly'
      });
    } catch (error: any) {
      console.error('Failed to create KPI:', error);
      alert(error.message || 'Failed to create KPI');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKPI = async (kpiId: string) => {
    if (!confirm('Are you sure you want to delete this KPI?')) return;

    try {
      await apiClient.deleteKPI(kpiId);
      await loadKPIs();
    } catch (error: any) {
      console.error('Failed to delete KPI:', error);
      alert(error.message || 'Failed to delete KPI');
    }
  };

  // Transform backend KPIs to match frontend format
  const transformedKPIs = kpis.map(kpi => {
    const current = kpi.currentValue || 0;
    const target = kpi.targetValue;
    const progress = (current / target) * 100;

    let status: 'on-track' | 'at-risk' | 'behind' = 'on-track';
    if (progress < 50) status = 'behind';
    else if (progress < 80) status = 'at-risk';

    return {
      id: kpi._id,
      name: kpi.name,
      description: kpi.description || '',
      target: target,
      current: current,
      unit: kpi.unit || '%',
      category: kpi.category || 'productivity',
      owner: kpi.assignedTo?.name || kpi.team?.name || 'Unassigned',
      deadline: kpi.updatedAt || kpi.createdAt || new Date().toISOString(),
      status,
      trend: current > target * 0.8 ? 'up' as const : current < target * 0.5 ? 'down' as const : 'stable' as const
    };
  });

  const categories = ['all', 'productivity', 'quality', 'efficiency', 'satisfaction', 'financial'];

  const filteredKPIs = selectedCategory === 'all'
    ? transformedKPIs
    : transformedKPIs.filter(kpi => kpi.category === selectedCategory);

  const getStatusColor = (status: string) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'on-track':
          return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        case 'at-risk':
          return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'behind':
          return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
      }
    };

    const getProgressPercentage = (current: number, target: number) => {
      return Math.min((current / target) * 100, 100);
    };

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up':
          return <TrendingUp className="w-4 h-4 text-green-500" />;
        case 'down':
          return <TrendingDown className="w-4 h-4 text-red-500" />;
        default:
          return <div className="w-4 h-4 border-t-2 border-gray-400" />;
      }
    };

    const summaryStats = {
      total: transformedKPIs.length,
      onTrack: transformedKPIs.filter(k => k.status === 'on-track').length,
      atRisk: transformedKPIs.filter(k => k.status === 'at-risk').length,
      behind: transformedKPIs.filter(k => k.status === 'behind').length
    };

    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div className="flex items-center gap-4">
                  <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-[#40b8a6]" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">KPI Tracking</h1>
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
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-8 h-8 text-blue-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summaryStats.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total KPIs</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summaryStats.onTrack}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <AlertCircle className="w-8 h-8 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summaryStats.atRisk}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-8 h-8 text-red-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {summaryStats.behind}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Behind</p>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                            ? 'bg-[#40b8a6] text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add KPI
                  </motion.button>
                </div>

                {/* KPI Cards */}
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40b8a6]"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredKPIs.map((kpi) => (
                      <motion.div
                        key={kpi.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {kpi.name}
                              </h3>
                              {getTrendIcon(kpi.trend)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {kpi.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
                                {kpi.status.replace('-', ' ')}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {kpi.category}
                              </span>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${getProgressPercentage(kpi.current, kpi.target)}%` }}
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{kpi.owner}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(kpi.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteKPI(kpi.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {filteredKPIs.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No KPIs Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No KPIs match the selected category. Try a different filter or add a new KPI.
                    </p>
                    <button className="flex items-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors mx-auto">
                      <Plus className="w-4 h-4" />
                      Add Your First KPI
                    </button>
                  </div>
                )}

                {/* Create KPI Modal */}
                {showCreateModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New KPI</h3>
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
                            KPI Name *
                          </label>
                          <input
                            type="text"
                            value={newKPI.name}
                            onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Task Completion Rate"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={newKPI.description}
                            onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                            placeholder="Brief description of the KPI"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Target Value *
                            </label>
                            <input
                              type="number"
                              value={newKPI.targetValue}
                              onChange={(e) => setNewKPI({ ...newKPI, targetValue: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                              placeholder="100"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Unit
                            </label>
                            <input
                              type="text"
                              value={newKPI.unit}
                              onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                              placeholder="%"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Category
                            </label>
                            <select
                              value={newKPI.category}
                              onChange={(e) => setNewKPI({ ...newKPI, category: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                            >
                              <option value="productivity">Productivity</option>
                              <option value="quality">Quality</option>
                              <option value="efficiency">Efficiency</option>
                              <option value="satisfaction">Satisfaction</option>
                              <option value="financial">Financial</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Period
                            </label>
                            <select
                              value={newKPI.period}
                              onChange={(e) => setNewKPI({ ...newKPI, period: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateKPI}
                            disabled={isCreating || !newKPI.name.trim() || newKPI.targetValue <= 0}
                            className="flex-1 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Save size={18} />
                            {isCreating ? 'Creating...' : 'Create KPI'}
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
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
}