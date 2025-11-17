'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import socketService from '@/services/socket';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAuthenticated } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize WebSocket connection and listeners
  useEffect(() => {
    if (isAuthenticated && user) {
      // Join notification room
      socketService.joinNotificationsRoom(user.id);

      // Listen for real-time notifications
      socketService.onNotification((notification) => {
        addNotification({
          title: notification.title,
          message: notification.message,
          type: notification.type || 'info',
          actionUrl: notification.actionUrl,
          userId: notification.userId
        });

        // Show browser notification if permission granted
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id
          });
        }
      });

      // Listen for task updates
      socketService.onTaskUpdate((task) => {
        addNotification({
          title: 'Task Updated',
          message: `Task "${task.title}" has been updated`,
          type: 'info',
          actionUrl: `/tasks/${task.id}`
        });
      });

      // Listen for task creation
      socketService.onTaskCreated((task) => {
        if (task.assignedTo === user.id) {
          addNotification({
            title: 'New Task Assigned',
            message: `You have been assigned a new task: "${task.title}"`,
            type: 'info',
            actionUrl: `/tasks/${task.id}`
          });
        }
      });

      return () => {
        // Cleanup listeners
        socketService.off('notification');
        socketService.off('task-updated');
        socketService.off('task-created');
      };
    }
  }, [isAuthenticated, user]);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-remove after 10 seconds for toast notifications
    if (notificationData.type === 'success' || notificationData.type === 'info') {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 10000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    addNotification({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      type
    });
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    showToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
