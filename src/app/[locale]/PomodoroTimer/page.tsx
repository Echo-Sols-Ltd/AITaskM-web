"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'short-break' | 'long-break'>('pomodoro');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [taskList, setTaskList] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  });

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
            // Timer finished
            if (settings.soundEnabled) {
              // Play notification sound
              new Audio('/notification.mp3').play().catch(() => {});
            }
            
            if (mode === 'pomodoro') {
              setCompletedPomodoros(prev => prev + 1);
              if (settings.autoStartBreaks) {
                setMode(completedPomodoros % 4 === 3 ? 'long-break' : 'short-break');
                return timeSettings[completedPomodoros % 4 === 3 ? 'long-break' : 'short-break'];
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

  const switchMode = (newMode: 'pomodoro' | 'short-break' | 'long-break') => {
    setMode(newMode);
    setIsRunning(false);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTaskList(prev => [...prev, newTask.trim()]);
      setNewTask('');
    }
  };

  const removeTask = (index: number) => {
    setTaskList(prev => prev.filter((_, i) => i !== index));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFFD] to-[#edfbfa]">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Focus Timer
            </h1>
            <p className="text-gray-600">Stay focused and productive with the Pomodoro technique</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timer Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
              >
                {/* Mode Selector */}
                <div className="flex justify-center mb-8">
                  <div className="flex bg-gray-100 rounded-full p-1">
                    {[
                      { key: 'pomodoro', label: 'Pomodoro', color: 'bg-[#40b8a6]' },
                      { key: 'short-break', label: 'Short Break', color: 'bg-green-500' },
                      { key: 'long-break', label: 'Long Break', color: 'bg-blue-500' }
                    ].map(({ key, label, color }) => (
                      <button
                        key={key}
                        onClick={() => switchMode(key as 'pomodoro' | 'short-break' | 'long-break')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          mode === key
                            ? `${color} text-white shadow-lg`
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timer Display */}
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
                        className="text-gray-200"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 120}`}
                        strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgress() / 100)}`}
                        className="text-[#40b8a6] transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {formatTime(timeLeft)}
                        </div>
                        <div className="text-lg text-gray-600 capitalize">
                          {mode.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center gap-4 mb-8">
                  {!isRunning ? (
                    <button
                      onClick={startTimer}
                      className="px-8 py-3 bg-[#40b8a6] text-white rounded-full font-medium hover:bg-[#359e8d] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="px-8 py-3 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pause
                    </button>
                  )}
                  
                  <button
                    onClick={resetTimer}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#40b8a6]">{completedPomodoros}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.floor(completedPomodoros * settings.pomodoroTime / 60)}
                    </div>
                    <div className="text-sm text-gray-600">Hours Focused</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Focus Mode Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Focus Mode</h3>
                  <button
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isFocusMode ? 'bg-[#40b8a6]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isFocusMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {isFocusMode 
                    ? 'Focus mode is active. Notifications and distractions are minimized.'
                    : 'Enable focus mode to minimize distractions during your work sessions.'
                  }
                </p>
              </motion.div>

              {/* Current Task */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Task</h3>
                <input
                  type="text"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  placeholder="What are you working on?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                />
              </motion.div>

              {/* Task List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task List</h3>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-[#40b8a6] text-white rounded-lg hover:bg-[#359e8d] transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {taskList.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{task}</span>
                      <button
                        onClick={() => removeTask(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>

                {showSettings && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pomodoro Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.pomodoroTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, pomodoroTime: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Break (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.shortBreakTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, shortBreakTime: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Long Break (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.longBreakTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, longBreakTime: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-start breaks</span>
                      <input
                        type="checkbox"
                        checked={settings.autoStartBreaks}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                        className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-start pomodoros</span>
                      <input
                        type="checkbox"
                        checked={settings.autoStartPomodoros}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoStartPomodoros: e.target.checked }))}
                        className="rounded border-gray-300 text-[#40b8a6] focus:ring-[#40b8a6]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sound notifications</span>
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
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
  );
};

export default PomodoroTimer; 