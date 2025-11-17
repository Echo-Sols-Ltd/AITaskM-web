'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/services/api';
import {
  Sparkles,
  X,
  Send,
  Lightbulb,
  TrendingUp,
  Target,
  MessageSquare,
  Loader2
} from 'lucide-react';

interface Suggestion {
  type: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

interface AIAssistantProps {
  userId?: string;
  context?: string;
}

export default function AIAssistant({ userId, context }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [isOpen]);

  const loadSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.aiGetSuggestions({ userId, context });
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('Failed to load AI suggestions:', error);
    } finally {
      setIsLoading(false);
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
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'productivity':
        return <TrendingUp className="w-4 h-4" />;
      case 'task_management':
        return <Target className="w-4 h-4" />;
      case 'skill_development':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* AI Assistant Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#40b8a6] to-[#359e8d]">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">AI Assistant</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-[#40b8a6] animate-spin" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Here are some AI-powered suggestions to help you:
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                              {getTypeIcon(suggestion.type)}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(suggestion.priority)}`}>
                              {suggestion.priority}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion.message}
                        </p>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      No suggestions available
                    </p>
                    <button
                      onClick={loadSuggestions}
                      className="text-sm text-[#40b8a6] hover:underline"
                    >
                      Refresh suggestions
                    </button>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask AI assistant..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        // Handle send message
                        setMessage('');
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      // Handle send message
                      setMessage('');
                    }}
                    className="p-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  AI-powered suggestions and assistance
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
