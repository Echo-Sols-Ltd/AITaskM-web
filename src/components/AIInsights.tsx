'use client';

import { useState, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';

interface Suggestion {
  type: string;
  message: string;
  priority: string;
  actionable?: boolean;
  action?: string;
}

export default function AIInsights({ userId }: { userId?: string }) {
  const { getSuggestions, loading, error } = useAI();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadSuggestions();
  }, [userId]);

  const loadSuggestions = async () => {
    try {
      const result = await getSuggestions(userId);
      setSuggestions(result);
    } catch (err) {
      console.error('Failed to load AI suggestions:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'task_management':
        return '📋';
      case 'productivity':
        return '⚡';
      case 'performance':
        return '📊';
      case 'burnout':
        return '🔥';
      case 'collaboration':
        return '👥';
      default:
        return '💡';
    }
  };

  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, 3);

  if (loading) {
    return (
      <div className="ai-insights p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-gray-600">Loading AI insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-insights p-4 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-insights p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">🤖</span>
          AI Insights & Suggestions
        </h3>
        <button
          onClick={loadSuggestions}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">✨</p>
          <p>No suggestions at the moment. You're doing great!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{getTypeIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {suggestion.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-50">
                        {suggestion.priority} priority
                      </span>
                    </div>
                    <p className="text-sm">{suggestion.message}</p>
                    {suggestion.actionable && suggestion.action && (
                      <button className="mt-2 text-xs font-medium underline hover:no-underline">
                        Take action →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {suggestions.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAll ? '↑ Show less' : `↓ Show ${suggestions.length - 3} more suggestions`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
