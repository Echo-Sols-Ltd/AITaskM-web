'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Search, ChevronDown, ChevronRight, Book, MessageCircle, 
  Mail, ExternalLink, ArrowLeft, Video, FileText, Users, Zap, 
  CheckCircle, Clock, Target, BarChart, Calendar, Settings,
  Shield, Bell, Globe, Smartphone, Laptop, Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/contexts/I18nContext';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NotificationCenter from '../../../components/NotificationCenter';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
}

export default function HelpPage() {
  const { user } = useAuth();
  const t = useTranslations('help');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'faq' | 'guides' | 'videos'>('faq');

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-6 h-6" />,
      content: 'Learn the basics of MoveIt and how to set up your first tasks and projects.'
    },
    {
      id: 'task-management',
      title: 'Task Management',
      icon: <CheckCircle className="w-6 h-6" />,
      content: 'Master task creation, organization, and completion tracking.'
    },
    {
      id: 'pomodoro-timer',
      title: 'Pomodoro Timer',
      icon: <Clock className="w-6 h-6" />,
      content: 'Use the Pomodoro technique effectively to boost your productivity.'
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      icon: <Users className="w-6 h-6" />,
      content: 'Collaborate with your team members and manage shared projects.'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: <BarChart className="w-6 h-6" />,
      content: 'Track your progress and analyze productivity metrics.'
    },
    {
      id: 'calendar',
      title: 'Calendar & Scheduling',
      icon: <Calendar className="w-6 h-6" />,
      content: 'Manage your schedule and plan your tasks effectively.'
    },
    {
      id: 'settings',
      title: 'Settings & Preferences',
      icon: <Settings className="w-6 h-6" />,
      content: 'Customize your experience and manage account settings.'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Shield className="w-6 h-6" />,
      content: 'Learn about data protection and security features.'
    }
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a new task?',
      answer: 'To create a new task, click the "Create New" button in the sidebar or navigate to the Task Completion page and click "Add Task". Fill in the task details including title, description, priority, due date, and assign team members if needed.',
      category: 'tasks'
    },
    {
      id: '2',
      question: 'How does the Pomodoro Timer work?',
      answer: 'The Pomodoro Timer helps you work in focused 25-minute intervals followed by 5-minute breaks. After 4 pomodoros, take a longer 15-30 minute break. Click start to begin a session and the timer will guide you through the process. You can customize the duration in Settings.',
      category: 'pomodoro'
    },
    {
      id: '3',
      question: 'Can I invite team members to my projects?',
      answer: 'Yes! Navigate to the Teams page and click "Invite Members". Enter their email addresses and they will receive an invitation to join your workspace. You can also manage team roles and permissions from the Teams page.',
      category: 'teams'
    },
    {
      id: '4',
      question: 'How do I track my progress?',
      answer: 'Visit the Progress page to see detailed analytics about your productivity, including completed tasks, time spent, achievement trends, and productivity scores. You can filter by date range and export reports.',
      category: 'progress'
    },
    {
      id: '5',
      question: 'What are the different task priorities?',
      answer: 'Tasks can be set to High (urgent and important), Medium (important but not urgent), or Low (nice to have) priority. High priority tasks are highlighted in red and appear at the top of your task list. You can filter tasks by priority.',
      category: 'tasks'
    },
    {
      id: '6',
      question: 'How do I change my account settings?',
      answer: 'Navigate to the Settings page from the sidebar to update your profile information, notification preferences, theme settings, language, and other account configurations. Changes are saved automatically.',
      category: 'account'
    },
    {
      id: '7',
      question: 'Can I use MoveIt offline?',
      answer: 'MoveIt requires an internet connection for most features. However, some basic functionality like viewing cached tasks and using the Pomodoro timer may work offline. Your data will sync when you reconnect.',
      category: 'general'
    },
    {
      id: '8',
      question: 'How do I delete a task?',
      answer: 'To delete a task, go to the Task Completion page, find the task you want to delete, click the three dots menu, and select "Delete". Completed tasks can also be archived instead of deleted to maintain your history.',
      category: 'tasks'
    },
    {
      id: '9',
      question: 'How do I set up notifications?',
      answer: 'Go to Settings > Notifications to configure your notification preferences. You can enable/disable email notifications, push notifications, and set reminders for upcoming tasks and deadlines.',
      category: 'account'
    },
    {
      id: '10',
      question: 'Can I integrate with other tools?',
      answer: 'Yes! MoveIt supports integrations with popular tools like Google Calendar, Slack, and more. Visit Settings > Integrations to connect your accounts and sync data across platforms.',
      category: 'general'
    },
    {
      id: '11',
      question: 'How do I use the Calendar feature?',
      answer: 'The Calendar page shows all your tasks and events in a visual timeline. You can drag and drop tasks to reschedule them, create new events, and view your schedule by day, week, or month.',
      category: 'calendar'
    },
    {
      id: '12',
      question: 'What is the Gamification feature?',
      answer: 'Gamification adds fun elements to productivity! Earn points, badges, and achievements by completing tasks, maintaining streaks, and reaching milestones. Check your progress on the Gamification page.',
      category: 'general'
    },
    {
      id: '13',
      question: 'How do I export my data?',
      answer: 'You can export your tasks, reports, and analytics from the respective pages. Look for the "Export" button and choose your preferred format (CSV, PDF, or JSON).',
      category: 'general'
    },
    {
      id: '14',
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard encryption (AES-256) to protect your data. All communications are secured with HTTPS, and we never share your personal information with third parties. Read our Privacy Policy for more details.',
      category: 'security'
    },
    {
      id: '15',
      question: 'How do I change the app theme?',
      answer: 'Go to Settings > Appearance to switch between Light, Dark, or System theme. The theme will be applied immediately across all pages.',
      category: 'account'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'tasks', name: 'Task Management' },
    { id: 'pomodoro', name: 'Pomodoro Timer' },
    { id: 'teams', name: 'Team Collaboration' },
    { id: 'progress', name: 'Progress Tracking' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'account', name: 'Account Settings' },
    { id: 'security', name: 'Security' },
    { id: 'general', name: 'General' }
  ];

  const videoTutorials = [
    {
      id: 'v1',
      title: 'Getting Started with MoveIt',
      duration: '5:30',
      thumbnail: '🎬',
      description: 'Learn the basics and set up your first project'
    },
    {
      id: 'v2',
      title: 'Mastering the Pomodoro Timer',
      duration: '3:45',
      thumbnail: '⏱️',
      description: 'Boost productivity with focused work sessions'
    },
    {
      id: 'v3',
      title: 'Team Collaboration Best Practices',
      duration: '7:20',
      thumbnail: '👥',
      description: 'Work effectively with your team'
    },
    {
      id: 'v4',
      title: 'Advanced Task Management',
      duration: '6:15',
      thumbnail: '✅',
      description: 'Pro tips for organizing complex projects'
    }
  ];

  const guides = [
    {
      id: 'g1',
      title: 'Complete User Guide',
      icon: <Book className="w-5 h-5" />,
      description: 'Comprehensive guide covering all features',
      readTime: '15 min read'
    },
    {
      id: 'g2',
      title: 'Productivity Tips & Tricks',
      icon: <Target className="w-5 h-5" />,
      description: 'Expert strategies to maximize your efficiency',
      readTime: '10 min read'
    },
    {
      id: 'g3',
      title: 'Team Management Guide',
      icon: <Users className="w-5 h-5" />,
      description: 'Best practices for managing teams',
      readTime: '12 min read'
    },
    {
      id: 'g4',
      title: 'Analytics & Reporting',
      icon: <BarChart className="w-5 h-5" />,
      description: 'Understanding your productivity metrics',
      readTime: '8 min read'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="md:ml-64 flex-1">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Help & Support
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

          <div className="p-4 md:p-8 max-w-7xl mx-auto">

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Help Topics Grid */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Browse Help Topics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {helpSections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-[#40b8a6]/10 to-[#359e8d]/10 rounded-lg text-[#40b8a6] group-hover:scale-110 transition-transform">
                            {section.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#40b8a6] transition-colors">
                              {section.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div>
                  <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setActiveTab('faq')}
                      className={`px-6 py-3 font-medium transition-colors relative ${
                        activeTab === 'faq'
                          ? 'text-[#40b8a6]'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      FAQs
                      {activeTab === 'faq' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#40b8a6]"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('guides')}
                      className={`px-6 py-3 font-medium transition-colors relative ${
                        activeTab === 'guides'
                          ? 'text-[#40b8a6]'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Guides
                      {activeTab === 'guides' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#40b8a6]"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('videos')}
                      className={`px-6 py-3 font-medium transition-colors relative ${
                        activeTab === 'videos'
                          ? 'text-[#40b8a6]'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Videos
                      {activeTab === 'videos' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#40b8a6]"
                        />
                      )}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'faq' && (
                      <motion.div
                        key="faq"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {categories.map(category => (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedCategory === category.id
                                  ? 'bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>

                        {/* FAQ Items */}
                        <div className="space-y-3">
                          {filteredFAQs.map((faq, index) => (
                            <motion.div
                              key={faq.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                              <button
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <span className="font-medium text-gray-900 dark:text-white pr-4">
                                  {faq.question}
                                </span>
                                <motion.div
                                  animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                </motion.div>
                              </button>
                              <AnimatePresence>
                                {expandedFAQ === faq.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-4">
                                      {faq.answer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>

                        {filteredFAQs.length === 0 && (
                          <div className="text-center py-12">
                            <HelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                              No results found. Try adjusting your search or category filter.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'guides' && (
                      <motion.div
                        key="guides"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {guides.map((guide, index) => (
                          <motion.div
                            key={guide.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all cursor-pointer group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-gradient-to-br from-[#40b8a6]/10 to-[#359e8d]/10 rounded-lg text-[#40b8a6]">
                                {guide.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#40b8a6] transition-colors">
                                  {guide.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {guide.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {guide.readTime}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'videos' && (
                      <motion.div
                        key="videos"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {videoTutorials.map((video, index) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                          >
                            <div className="aspect-video bg-gradient-to-br from-[#40b8a6]/20 to-[#359e8d]/20 flex items-center justify-center text-6xl relative">
                              {video.thumbnail}
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play className="w-8 h-8 text-[#40b8a6] ml-1" />
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#40b8a6] transition-colors">
                                {video.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {video.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Video className="w-3 h-3" />
                                {video.duration}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Support */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-[#40b8a6] to-[#359e8d] rounded-xl shadow-lg p-6 text-white"
                >
                  <h3 className="font-bold text-lg mb-4">Need Help?</h3>
                  <p className="text-sm text-white/90 mb-4">
                    Our support team is here to help you 24/7
                  </p>
                  <div className="space-y-3">
                    <a
                      href="mailto:support@moveit.com"
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                    >
                      <Mail className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">Email Support</div>
                        <div className="text-xs text-white/80">support@moveit.com</div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">Live Chat</div>
                        <div className="text-xs text-white/80">Available 24/7</div>
                      </div>
                    </a>
                  </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-[#40b8a6]" />
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#40b8a6]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">User Guide</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-gray-400 group-hover:text-[#40b8a6]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Video Tutorials</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400 group-hover:text-[#40b8a6]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Community Forum</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  </div>
                </motion.div>

                {/* System Status */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Services</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Operational</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-xs text-[#40b8a6] hover:underline mt-4 inline-block"
                  >
                    View detailed status →
                  </a>
                </motion.div>

                {/* Platform Support */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Available On
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Laptop className="w-5 h-5" />
                      <span className="text-sm">Web</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Smartphone className="w-5 h-5" />
                      <span className="text-sm">Mobile</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
