'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1_score?: number;
}

interface ModelVersion {
  version: string;
  trained_at: string;
  metrics: ModelMetrics;
  model_count: number;
}

interface DriftReport {
  has_drift: boolean;
  drift_score: number;
  recommendations: string[];
}

interface ModelPerformance {
  current_accuracy: number;
  baseline_accuracy: number;
  performance_trend: string;
}

export default function ModelManagementPage() {
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [driftReport, setDriftReport] = useState<DriftReport | null>(null);
  const [performance, setPerformance] = useState<ModelPerformance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadModelData();
  }, []);

  const loadModelData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('moveit_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Load model versions
      const versionsResponse = await fetch(`${baseUrl}/api/ai/monitoring/versions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (versionsResponse.ok) {
        const versionsData = await versionsResponse.json();
        setCurrentVersion(versionsData.current_version || 'Not set');
        setVersions(versionsData.all_versions || []);
      }

      // Load drift report
      const driftResponse = await fetch(`${baseUrl}/api/ai/monitoring/drift-report`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (driftResponse.ok) {
        const driftData = await driftResponse.json();
        setDriftReport(driftData.report || null);
      }

      // Load performance metrics
      const perfResponse = await fetch(`${baseUrl}/api/ai/monitoring/performance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (perfResponse.ok) {
        const perfData = await perfResponse.json();
        setPerformance(perfData.performance || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load model data');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModels = async () => {
    if (!confirm('Training models will take several minutes. Continue?')) {
      return;
    }

    setTraining(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('moveit_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/ai/train-models`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Models trained successfully! Reloading data...');
        setTimeout(() => {
          loadModelData();
          setSuccessMessage(null);
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Training failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to train models');
    } finally {
      setTraining(false);
    }
  };

  const getDriftSeverity = (score: number) => {
    if (score > 0.3) return { label: 'High', color: 'text-red-600 bg-red-50' };
    if (score > 0.15) return { label: 'Medium', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Low', color: 'text-green-600 bg-green-50' };
  };

  const getPerformanceTrend = (trend: string) => {
    if (trend === 'improving') return { icon: '📈', color: 'text-green-600' };
    if (trend === 'declining') return { icon: '📉', color: 'text-red-600' };
    return { icon: '➡️', color: 'text-gray-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading model data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 AI Model Management</h1>
        <p className="text-gray-600">Monitor, train, and manage machine learning models</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">✅ {successMessage}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleTrainModels}
          disabled={training}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            training
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {training ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Training Models...
            </span>
          ) : (
            '🎓 Train Models'
          )}
        </button>

        <button
          onClick={loadModelData}
          disabled={loading || training}
          className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          🔄 Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current Version Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📦</span>
            Current Model Version
          </h2>
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {currentVersion}
            </div>
            <p className="text-gray-600">Active Version</p>
          </div>
        </div>

        {/* Model Performance Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Model Performance
          </h2>
          {performance ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Accuracy:</span>
                <span className="text-2xl font-bold text-green-600">
                  {(performance.current_accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Baseline Accuracy:</span>
                <span className="text-lg font-semibold text-gray-700">
                  {(performance.baseline_accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trend:</span>
                <span className={`text-lg font-semibold ${getPerformanceTrend(performance.performance_trend).color}`}>
                  {getPerformanceTrend(performance.performance_trend).icon} {performance.performance_trend}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No performance data available</p>
              <p className="text-sm mt-2">Train models to see metrics</p>
            </div>
          )}
        </div>
      </div>

      {/* Drift Detection Card */}
      {driftReport && (
        <div className={`mb-6 rounded-lg shadow-md p-6 ${
          driftReport.has_drift ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-white'
        }`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            Model Drift Detection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                driftReport.has_drift ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {driftReport.has_drift ? '⚠️' : '✅'}
              </div>
              <p className="text-gray-600">
                {driftReport.has_drift ? 'Drift Detected' : 'No Drift'}
              </p>
            </div>

            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getDriftSeverity(driftReport.drift_score).color} px-4 py-2 rounded-lg inline-block`}>
                {(driftReport.drift_score * 100).toFixed(1)}%
              </div>
              <p className="text-gray-600">Drift Score</p>
            </div>

            <div className="text-center">
              <div className={`text-lg font-semibold mb-2 px-4 py-2 rounded-lg inline-block ${getDriftSeverity(driftReport.drift_score).color}`}>
                {getDriftSeverity(driftReport.drift_score).label} Risk
              </div>
              <p className="text-gray-600">Severity Level</p>
            </div>
          </div>

          {driftReport.recommendations && driftReport.recommendations.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h3 className="font-semibold mb-2">📋 Recommendations:</h3>
              <ul className="list-disc list-inside space-y-1">
                {driftReport.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Model Versions Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">📚</span>
          Model Version History
        </h2>

        {versions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trained At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Models
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {versions.map((version, index) => (
                  <tr key={index} className={version.version === currentVersion ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{version.version}</span>
                        {version.version === currentVersion && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(version.trained_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {version.model_count} models
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {version.metrics?.accuracy ? (
                        <span className="text-sm font-semibold text-green-600">
                          {(version.metrics.accuracy * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                        Trained
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No model versions found</p>
            <p className="text-sm">Train your first model to get started</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ About Model Management</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Training:</strong> Updates models with latest data from MongoDB</li>
          <li>• <strong>Drift Detection:</strong> Monitors model performance degradation</li>
          <li>• <strong>Versions:</strong> Track model improvements over time</li>
          <li>• <strong>Recommendations:</strong> AI-powered suggestions for model maintenance</li>
        </ul>
      </div>
    </div>
  );
}
