'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Star, Plus, Bell, Search } from 'lucide-react';
import { useTranslations } from '@/contexts/I18nContext';
import Sidebar from '../../../components/Sidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'deadline' | 'meeting' | 'task' | 'event';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  completed?: boolean;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const tCommon = useTranslations('common');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Project Deadline: Mobile App',
      date: new Date(2025, 7, 25), // August 25, 2025
      type: 'deadline',
      priority: 'high',
      description: 'Final submission for mobile app project'
    },
    {
      id: '2',
      title: 'Team Meeting',
      date: new Date(2025, 7, 24), // August 24, 2025
      type: 'meeting',
      priority: 'medium',
      description: 'Weekly team sync meeting'
    },
    {
      id: '3',
      title: 'Code Review Session',
      date: new Date(2025, 7, 26), // August 26, 2025
      type: 'task',
      priority: 'medium',
      description: 'Review pull requests and provide feedback'
    },
    {
      id: '4',
      title: 'Client Presentation',
      date: new Date(2025, 7, 28), // August 28, 2025
      type: 'event',
      priority: 'high',
      description: 'Present project progress to client'
    }
  ]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dayEvents = events.filter(event => 
        event.date.toDateString() === currentDay.toDateString()
      );

      days.push({
        date: currentDay,
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === today.toDateString(),
        events: dayEvents
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getEventTypeColor = (type: string, priority: string) => {
    if (type === 'deadline') {
      return priority === 'high' ? 'bg-red-500' : 'bg-orange-500';
    }
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'task': return 'bg-green-500';
      case 'event': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return events
      .filter(event => 
        event.type === 'deadline' && 
        event.date >= today && 
        event.date <= nextWeek &&
        !event.completed
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const days = getDaysInMonth(currentDate);
  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                <div className="md:hidden">
                  <h1 className="text-2xl font-serif italic text-emerald-600 dark:text-emerald-400">
                    MoveIt
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={tCommon('search')}
                >
                  <Search className="text-gray-600 dark:text-gray-300" size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="text-gray-600 dark:text-gray-300" size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </motion.button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">S</span>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Page Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-8 h-8 text-emerald-600" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('title') || 'Calendar'}
                  </h1>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <Plus size={20} />
                  {t('addEvent') || 'Add Event'}
                </motion.button>
              </motion.div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Compact Calendar */}
                <div className="xl:col-span-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        ←
                      </motion.button>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        →
                      </motion.button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                      {dayNames.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Compact Calendar Grid */}
                    <div className="grid grid-cols-7">
                      {days.map((day, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className={`h-20 p-2 border-r border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            !day.isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                          } ${day.isToday ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                          onClick={() => setSelectedDate(day.date)}
                        >
                          <div className={`text-sm font-medium mb-1 ${
                            !day.isCurrentMonth 
                              ? 'text-gray-400 dark:text-gray-500' 
                              : day.isToday 
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                                : 'text-gray-900 dark:text-white'
                          }`}>
                            {day.date.getDate()}
                          </div>
                          
                          {/* Event Indicators */}
                          <div className="flex flex-wrap gap-1">
                            {day.events.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type, event.priority).replace('bg-', 'bg-').split(' ')[0]}`}
                                title={event.title}
                              />
                            ))}
                            {day.events.length > 2 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                +{day.events.length - 2}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Upcoming Deadlines */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {t('upcomingDeadlines') || 'Upcoming Deadlines'}
                      </h3>
                    </div>
                    
                    {upcomingDeadlines.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t('noUpcomingDeadlines') || 'No upcoming deadlines'}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingDeadlines.map(deadline => (
                          <motion.div 
                            key={deadline.id} 
                            whileHover={{ scale: 1.02 }}
                            className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 cursor-pointer"
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-red-900 dark:text-red-100 text-sm truncate">
                                  {deadline.title}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock size={12} className="text-red-600 dark:text-red-400" />
                                  <span className="text-xs text-red-600 dark:text-red-400">
                                    {deadline.date.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Major Events */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {t('majorEvents') || 'Major Events'}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {events
                        .filter(event => event.priority === 'high' && event.type === 'event')
                        .slice(0, 3)
                        .map(event => (
                          <motion.div 
                            key={event.id} 
                            whileHover={{ scale: 1.02 }}
                            className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 cursor-pointer"
                          >
                            <div className="flex items-start gap-2">
                              <Star size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-yellow-900 dark:text-yellow-100 text-sm truncate">
                                  {event.title}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock size={12} className="text-yellow-600 dark:text-yellow-400" />
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                    {event.date.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>

                  {/* Event Legend */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {t('eventType') || 'Event Types'}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">High Priority Deadlines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Regular Deadlines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Meetings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Events</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
