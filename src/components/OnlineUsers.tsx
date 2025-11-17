'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Circle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import socketService from '@/services/socket';

interface OnlineUser {
  id: string;
  name: string;
  role: string;
  lastSeen?: Date;
}

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Listen for user online/offline events
    socketService.onUserOnline((userId) => {
      // In a real app, fetch user details from API
      console.log('User came online:', userId);
    });

    socketService.onUserOffline((userId) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId));
    });

    return () => {
      socketService.off('user-online');
      socketService.off('user-offline');
    };
  }, []);

  // Mock data for demonstration
  const mockOnlineUsers: OnlineUser[] = [
    { id: '1', name: 'John Doe', role: 'admin' },
    { id: '2', name: 'Jane Smith', role: 'manager' },
    { id: '3', name: 'Bob Johnson', role: 'employee' },
    { id: '4', name: 'Alice Williams', role: 'employee' },
  ].filter(u => u.id !== user?.id);

  const displayUsers = onlineUsers.length > 0 ? onlineUsers : mockOnlineUsers;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'manager':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#40b8a6]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Online Users
          </h3>
          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
            {displayUsers.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 space-y-2"
        >
          {displayUsers.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No users online
            </p>
          ) : (
            displayUsers.map((onlineUser) => (
              <motion.div
                key={onlineUser.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                      {onlineUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {onlineUser.name}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(
                        onlineUser.role
                      )}`}
                    >
                      {onlineUser.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <Circle className="w-2 h-2 fill-current" />
                  <span className="text-xs">Online</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
