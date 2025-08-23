'use client';

import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronRight, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { useTranslations } from '@/contexts/I18nContext';

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
  const t = useTranslations('help');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book className="w-5 h-5" />,
      content: 'Learn the basics of MoveIt and how to set up your first tasks and projects.'
    },
    {
      id: 'task-management',
      title: 'Task Management',
      icon: <HelpCircle className="w-5 h-5" />,
      content: 'Master task creation, organization, and completion tracking.'
    },
    {
      id: 'pomodoro-timer',
      title: 'Pomodoro Timer',
      icon: <HelpCircle className="w-5 h-5" />,
      content: 'Use the Pomodoro technique effectively to boost your productivity.'
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      icon: <MessageCircle className="w-5 h-5" />,
      content: 'Collaborate with your team members and manage shared projects.'
    }
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a new task?',
      answer: 'To create a new task, click the "Create New" button in the sidebar or navigate to the Task Completion page and click "Add Task". Fill in the task details including title, description, priority, and due date.',
      category: 'tasks'
    },
    {
      id: '2',
      question: 'How does the Pomodoro Timer work?',
      answer: 'The Pomodoro Timer helps you work in focused 25-minute intervals followed by 5-minute breaks. After 4 pomodoros, take a longer 15-30 minute break. Click start to begin a session and the timer will guide you through the process.',
      category: 'pomodoro'
    },
    {
      id: '3',
      question: 'Can I invite team members to my projects?',
      answer: 'Yes! Click the "Invite team" button in the sidebar to send invitations to team members. They can then collaborate on shared tasks and projects.',
      category: 'teams'
    },
    {
      id: '4',
      question: 'How do I track my progress?',
      answer: 'Visit the Progress page to see detailed analytics about your productivity, including completed tasks, time spent, and achievement trends over time.',
      category: 'progress'
    },
    {
      id: '5',
      question: 'What are the different task priorities?',
      answer: 'Tasks can be set to High (urgent and important), Medium (important but not urgent), or Low (nice to have) priority. High priority tasks are highlighted in red and appear at the top of your task list.',
      category: 'tasks'
    },
    {
      id: '6',
      question: 'How do I change my account settings?',
      answer: 'Navigate to the Settings page from the sidebar to update your profile information, notification preferences, theme settings, and other account configurations.',
      category: 'account'
    },
    {
      id: '7',
      question: 'Can I use MoveIt offline?',
      answer: 'MoveIt requires an internet connection for most features. However, some basic functionality like viewing cached tasks and using the Pomodoro timer may work offline.',
      category: 'general'
    },
    {
      id: '8',
      question: 'How do I delete a task?',
      answer: 'To delete a task, go to the Task Completion page, find the task you want to delete, click the three dots menu, and select "Delete". Completed tasks can also be archived instead of deleted.',
      category: 'tasks'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'tasks', name: 'Task Management' },
    { id: 'pomodoro', name: 'Pomodoro Timer' },
    { id: 'teams', name: 'Team Collaboration' },
    { id: 'progress', name: 'Progress Tracking' },
    { id: 'account', name: 'Account Settings' },
    { id: 'general', name: 'General' }
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
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('title') || 'Help & Support'}
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t('searchPlaceholder') || 'Search for help articles, FAQs...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Help Sections */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('helpSections') || 'Help Topics'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helpSections.map(section => (
                <div
                  key={section.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-emerald-600 dark:text-emerald-400">
                      {section.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('faqTitle') || 'Frequently Asked Questions'}
            </h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map(faq => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('noResults') || 'No results found. Try adjusting your search or category filter.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('contactSupport') || 'Contact Support'}
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:support@moveit.com"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Mail className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    Email Support
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    support@moveit.com
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    Live Chat
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Available 9 AM - 5 PM
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('quickLinks') || 'Quick Links'}
            </h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">User Guide</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">Video Tutorials</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">API Documentation</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">Community Forum</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('systemStatus') || 'System Status'}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                All systems operational
              </span>
            </div>
            <a
              href="#"
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-2 inline-block"
            >
              View status page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
