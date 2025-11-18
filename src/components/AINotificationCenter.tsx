'use client';

import { useState, useEffect } from 'react';
import { socketService } from '@/services/socket';

interface AINotification {
  id: string;
  type: 'ai-assignment' | 'burnout-alert' | 'performance-insight' | 'anomaly-detected' | 'model-trained';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  data?: any;
}

export default function AINotificationCenter() {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to WebSocket
    const token = localStorage.getItem('moveit_token');
    if (token) {
      socketService.connect(token).then(() => {
        const userId = localStorage.getItem('moveit_user_id');
        if (userId) {
          socketService.joinNotificationsRoom(userId);
        }
      });
    }

    // Listen for AI-specific notifications
    socketService.on('ai-task-assigned', handleAITaskAssigned);
    socketService.on('burnout-alert', handleBurnoutAlert);
    socketService.on('performance-insight', handlePerformanceInsight);
    socketService.on('anomaly-detected', handleAnomalyDetected);
    socketService.on('model-trained', handleModelTrained);

    return () => {
      socketService.off('ai-task-assigned');
      socketService.off('burnout-alert');
      socketService.off('performance-insight');
      socketService.off('anomaly-detected');
      socketService.off('model-trained');
    };
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const handleAITaskAssigned = (data: any) => {
    addNotification({
      type: 'ai-assignment',
      title: 'AI Task Assignment',
      message: data.reason || 'You have been assigned a new task by AI',
      priority: 'medium',
      actionUrl: `/tasks/${data.taskId}`,
      data
    });
  };

  const handleBurnoutAlert = (data: any) => {
    addNotification({
      type: 'burnout-alert',
      title: 'Burnout Risk Alert',
      message: `AI detected ${data.riskLevel} burnout risk. Consider taking a break.`,
      priority: 'high',
      data
    });
  };

  const handlePerformanceInsight = (data: any) => {
    addNotification({
      type: 'performance-insight',
      title: 'Performance Insight',
      message: data.insight || 'New AI-powered insight available',
      priority: 'low',
      data
    });
  };

  const handleAnomalyDetected = (data: any) => {
    addNotification({
      type: 'anomaly-detected',
      title: 'Anomaly Detected',
      message: `AI detected unusual pattern: ${data.description}`,
      priority: 'medium',
      data
    });
  };

  const handleModelTrained = (data: any) => {
    addNotification({
      type: 'model-trained',
      title: 'Models Updated',
      message: `AI models have been retrained. New version: ${data.version}`,
      priority: 'low',
      data
    });
  };

  const addNotification = (notification: Omit<AINotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AINotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: AINotification['type']) => {
    switch (type) {
      case 'ai-assignment': return '🤖';
      case 'burnout-alert': return '🔥';
      case 'performance-insight': return '💡';
      case 'anomaly-detected': return '⚠️';
      case 'model-trained': return '🎓';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority: AINotification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">🤖 AI Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔕</div>
                  <p>No AI notifications yet</p>
                  <p className="text-sm mt-1">You'll be notified of AI insights here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
