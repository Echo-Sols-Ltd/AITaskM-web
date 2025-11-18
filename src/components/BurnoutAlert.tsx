'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

interface PerformanceScore {
  employee_id: string;
  task_completion_rate: number;
  average_completion_time_hours: number;
  burnout_risk: boolean;
  burnout_probability?: number;
  recommendation: string;
}

export default function BurnoutAlert({ userId }: { userId?: string }) {
  const [performanceData, setPerformanceData] = useState<PerformanceScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadPerformanceData();
  }, [userId]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const endpoint = userId 
        ? `/api/ai/performance-score/${userId}`
        : '/api/ai/performance-score';
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('moveit_token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPerformanceData(data.performanceScore);
      }
    } catch (err) {
      console.error('Failed to load performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!performanceData || !performanceData.burnout_risk || dismissed) {
    return null;
  }

  const burnoutLevel = performanceData.burnout_probability || 0;
  const severity = burnoutLevel > 0.7 ? 'high' : burnoutLevel > 0.5 ? 'medium' : 'low';

  const getSeverityStyles = () => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-900';
      case 'medium':
        return 'bg-orange-50 border-orange-300 text-orange-900';
      default:
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      default:
        return '💡';
    }
  };

  return (
    <div className={`burnout-alert p-4 rounded-lg border-2 ${getSeverityStyles()} mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{getSeverityIcon()}</span>
            <h3 className="text-lg font-bold">
              {severity === 'high' ? 'High Burnout Risk Detected' : 
               severity === 'medium' ? 'Moderate Burnout Risk' : 
               'Burnout Risk Alert'}
            </h3>
          </div>
          
          <p className="text-sm mb-3">
            Our AI has detected signs of potential burnout based on your recent activity patterns.
          </p>

          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm">
              <span className="font-semibold mr-2">Risk Level:</span>
              <div className="flex-1 bg-white bg-opacity-50 rounded-full h-2 mr-2">
                <div 
                  className={`h-2 rounded-full ${
                    severity === 'high' ? 'bg-red-600' : 
                    severity === 'medium' ? 'bg-orange-500' : 
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${burnoutLevel * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-xs">{Math.round(burnoutLevel * 100)}%</span>
            </div>

            <div className="text-sm">
              <span className="font-semibold">Completion Rate:</span> {Math.round(performanceData.task_completion_rate * 100)}%
            </div>

            <div className="text-sm">
              <span className="font-semibold">Avg. Task Time:</span> {performanceData.average_completion_time_hours.toFixed(1)}h
            </div>
          </div>

          <div className="bg-white bg-opacity-50 p-3 rounded-md mb-3">
            <p className="text-sm font-semibold mb-1">💡 Recommendation:</p>
            <p className="text-sm">{performanceData.recommendation}</p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors">
              View Wellness Tips
            </button>
            <button className="px-4 py-2 bg-white rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors">
              Request Time Off
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
