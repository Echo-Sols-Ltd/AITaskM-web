"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from "../../../components/RoleBasedSidebar";
import NotificationCenter from '../../../components/NotificationCenter';
import { ChevronDown } from "lucide-react";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useTranslations } from "@/contexts/I18nContext";
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Task } from '../../../services/api';
interface Settings {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

type TimerMode = 'pomodoro' | 'short-break' | 'long-break';

const PomodoroTimer: React.FC = () => {

  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  
  const [settings, setSettings] = useState<Settings>({
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  });

const t = useTranslations('pomodoroTimer');
  const tCommon = useTranslations('common');

  // Fetch user's tasks on component mount
  useEffect(() => {
    const fetchUserTasks = async () => {
      setIsLoadingTasks(true);
      try {
        const response = await apiClient.getTasks({
          limit: 50,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        console.log('PomodoroTimer - Tasks response:', response);
        console.log('PomodoroTimer - Tasks array:', response.tasks);
        
        // Filter out completed tasks but keep all others
        const availableTasks = response.tasks.filter(task => 
          task.status !== 'completed'
        );
        console.log('PomodoroTimer - Available tasks after filtering:', availableTasks);
        
        setUserTasks(availableTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchUserTasks();
  }, []);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeSettings = useMemo(() => ({
    pomodoro: settings.pomodoroTime * 60,
    'short-break': settings.shortBreakTime * 60,
    'long-break': settings.longBreakTime * 60
  }), [settings]);

  useEffect(() => {
    setTimeLeft(timeSettings[mode]);
  }, [mode, timeSettings]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (settings.soundEnabled) {
              try {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(() => {
                  const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
                  const oscillator = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();
                  
                  oscillator.connect(gainNode);
                  gainNode.connect(audioContext.destination);
                  
                  oscillator.frequency.value = 800;
                  oscillator.type = 'sine';
                  
                  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                  
                  oscillator.start(audioContext.currentTime);
                  oscillator.stop(audioContext.currentTime + 0.5);
                });
              } catch {
                console.log('Audio notification not available');
              }
            }
            
            if (mode === 'pomodoro') {
              setCompletedPomodoros(prev => prev + 1);
              if (settings.autoStartBreaks) {
                const nextMode = completedPomodoros % 4 === 3 ? 'long-break' : 'short-break';
                setMode(nextMode);
                return timeSettings[nextMode];
              }
            } else {
              if (settings.autoStartPomodoros) {
                setMode('pomodoro');
                return timeSettings.pomodoro;
              }
            }
            
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, settings, completedPomodoros, timeSettings]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timeSettings[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
  };

  const selectTask = (task: Task) => {
    setCurrentTask(task);
    setShowTaskDropdown(false);
  };

  const clearCurrentTask = () => {
    setCurrentTask(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = timeSettings[mode];
    return ((total - timeLeft) / total) * 100;
  };


  const updateSetting = (key: keyof Settings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <RoleBasedSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
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
                <NotificationCenter />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Focus Timer
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Stay focused and productive with the Pomodoro technique
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-center mb-8">
                      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                        {[
                          {
                            key: "pomodoro" as const,
                            label: "Pomodoro",
                            color: "bg-[#40b8a6]",
                          },
                          {
                            key: "short-break" as const,
                            label: "Short Break",
                            color: "bg-green-500",
                          },
                          {
                            key: "long-break" as const,
                            label: "Long Break",
                            color: "bg-blue-500",
                          },
                        ].map(({ key, label, color }) => (
                          <button
                            key={key}
                            onClick={() => switchMode(key)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                              mode === key
                                ? `${color} text-white shadow-lg`
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <div className="relative inline-block">
                        <svg className="w-64 h-64 transform -rotate-90">
                          <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-600"
                          />
                          <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 120}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 120 * (1 - getProgress() / 100)
                            }`}
                            className="text-[#40b8a6] transition-all duration-1000 ease-linear"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                              {formatTime(timeLeft)}
                            </div>
                            <div className="text-lg text-gray-600 dark:text-gray-300 capitalize">
                              {mode.replace("-", " ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                      {!isRunning ? (
                        <button
                          onClick={startTimer}
                          className="px-8 py-3 bg-[#40b8a6] text-white rounded-full font-medium hover:bg-[#359e8d] transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Start
                        </button>
                      ) : (
                        <button
                          onClick={pauseTimer}
                          className="px-8 py-3 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Pause
                        </button>
                      )}

                      <button
                        onClick={resetTimer}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="flex justify-center gap-8 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#40b8a6]">
                          {completedPomodoros}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Completed
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.floor(
                            (completedPomodoros * settings.pomodoroTime) / 60
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Hours Focused
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Focus Mode
                      </h3>
                      <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isFocusMode
                            ? "bg-[#40b8a6]"
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isFocusMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {isFocusMode
                        ? "Focus mode is active. Notifications and distractions are minimized."
                        : "Enable focus mode to minimize distractions during your work sessions."}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Current Task
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between"
                        disabled={isLoadingTasks}
                      >
                        <span
                          className={
                            currentTask
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {isLoadingTasks
                            ? "Loading tasks..."
                            : currentTask
                            ? currentTask.title
                            : "Select a task to focus on"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            showTaskDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showTaskDropdown && !isLoadingTasks && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {userTasks.length === 0 ? (
                            <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                              No tasks available. Create some tasks first!
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={clearCurrentTask}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-600"
                              >
                                Clear selection
                              </button>
                              {userTasks.map((task) => (
                                <button
                                  key={task._id}
                                  onClick={() => selectTask(task)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">
                                        {task.title}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {task.description}
                                      </div>
                                    </div>
                                    <div className="ml-2 flex items-center gap-1">
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          task.priority === "urgent"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                            : task.priority === "high"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                            : task.priority === "medium"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        }`}
                                      >
                                        {task.priority}
                                      </span>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          task.status === "in-progress"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                        }`}
                                      >
                                        {task.status}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {currentTask && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {currentTask.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                          {currentTask.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              currentTask.priority === "urgent"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : currentTask.priority === "high"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                : currentTask.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            Priority: {currentTask.priority}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              currentTask.status === "in-progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            }`}
                          >
                            Status: {currentTask.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Your Tasks
                    </h3>

                    {isLoadingTasks ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40b8a6]"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          Loading tasks...
                        </span>
                      </div>
                    ) : userTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400 mb-2">
                          No tasks found
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                          Create some tasks in the Dashboard to get started!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {userTasks.map((task) => (
                          <div
                            key={task._id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {task.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {task.description}
                              </div>
                            </div>
                            <div className="ml-2 flex items-center gap-1">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  task.priority === "urgent"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : task.priority === "high"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                    : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                }`}
                              >
                                {task.priority}
                              </span>
                              <button
                                onClick={() => selectTask(task)}
                                className="ml-2 px-2 py-1 text-xs bg-[#40b8a6] text-white rounded hover:bg-[#359e8d] transition-colors"
                                title="Select for focus session"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    onClick={() => setShowSettings(!showSettings)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Settings
                      </h3>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {showSettings && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Pomodoro Time (minutes)
                          </label>
                          <input
                            type="number"
                            value={settings.pomodoroTime}
                            onChange={(e) =>
                              updateSetting(
                                "pomodoroTime",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            min="1"
                            max="120"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Short Break (minutes)
                          </label>
                          <input
                            type="number"
                            value={settings.shortBreakTime}
                            onChange={(e) =>
                              updateSetting(
                                "shortBreakTime",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            min="1"
                            max="60"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Long Break (minutes)
                          </label>
                          <input
                            type="number"
                            value={settings.longBreakTime}
                            onChange={(e) =>
                              updateSetting(
                                "longBreakTime",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            min="1"
                            max="120"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Auto-start breaks
                          </span>
                          <input
                            type="checkbox"
                            checked={settings.autoStartBreaks}
                            onChange={(e) =>
                              updateSetting("autoStartBreaks", e.target.checked)
                            }
                            className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Auto-start pomodoros
                          </span>
                          <input
                            type="checkbox"
                            checked={settings.autoStartPomodoros}
                            onChange={(e) =>
                              updateSetting(
                                "autoStartPomodoros",
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Sound notifications
                          </span>
                          <input
                            type="checkbox"
                            checked={settings.soundEnabled}
                            onChange={(e) =>
                              updateSetting("soundEnabled", e.target.checked)
                            }
                            className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PomodoroTimer;