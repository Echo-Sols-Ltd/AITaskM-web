"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';

// Mock data for KPI tracking
const mockKPIs = [
  {
    id: 1,
    name: "Task Completion Rate",
    current: 87,
    target: 90,
    unit: "%",
    trend: "up",
    change: "+5%",
    period: "vs last month",
    category: "productivity"
  },
  {
    id: 2,
    name: "Average Task Duration",
    current: 2.3,
    target: 2.0,
    unit: "hours",
    trend: "down",
    change: "-0.5h",
    period: "vs last month",
    category: "efficiency"
  },
  {
    id: 3,
    name: "Team Productivity Score",
    current: 92,
    target: 95,
    unit: "%",
    trend: "up",
    change: "+3%",
    period: "vs last month",
    category: "productivity"
  },
  {
    id: 4,
    name: "On-time Delivery",
    current: 94,
    target: 95,
    unit: "%",
    trend: "up",
    change: "+2%",
    period: "vs last month",
    category: "quality"
  },
  {
    id: 5,
    name: "Customer Satisfaction",
    current: 4.6,
    target: 4.8,
    unit: "/5",
    trend: "up",
    change: "+0.2",
    period: "vs last month",
    category: "quality"
  },
  {
    id: 6,
    name: "Code Quality Score",
    current: 88,
    target: 90,
    unit: "%",
    trend: "down",
    change: "-2%",
    period: "vs last month",
    category: "quality"
  }
];

const mockGoals = [
  {
    id: 1,
    title: "Increase team productivity by 15%",
    description: "Implement new workflow processes and tools to boost overall team efficiency",
    target: "15%",
    current: "12%",
    deadline: "2024-03-31",
    status: "on-track",
    category: "productivity"
  },
  {
    id: 2,
    title: "Reduce average task completion time",
    description: "Streamline processes and eliminate bottlenecks to improve task turnaround",
    target: "1.5 hours",
    current: "2.3 hours",
    deadline: "2024-04-15",
    status: "at-risk",
    category: "efficiency"
  },
  {
    id: 3,
    title: "Achieve 95% customer satisfaction",
    description: "Focus on quality improvements and better communication with stakeholders",
    target: "95%",
    current: "94%",
    deadline: "2024-05-01",
    status: "on-track",
    category: "quality"
  },
  {
    id: 4,
    title: "Launch 3 new features",
    description: "Complete development and testing of three major product features",
    target: "3 features",
    current: "1 feature",
    deadline: "2024-06-30",
    status: "behind",
    category: "development"
  }
];

const mockTrends = [
  { month: "Jan", productivity: 82, efficiency: 78, quality: 85 },
  { month: "Feb", productivity: 85, efficiency: 80, quality: 87 },
  { month: "Mar", productivity: 87, efficiency: 82, quality: 89 },
  { month: "Apr", productivity: 89, efficiency: 84, quality: 91 },
  { month: "May", productivity: 92, efficiency: 86, quality: 93 },
  { month: "Jun", productivity: 94, efficiency: 88, quality: 94 }
];

const KPITracking: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAddGoal, setShowAddGoal] = useState(false);

  const categories = ['all', 'productivity', 'efficiency', 'quality', 'development'];
  const periods = ['week', 'month', 'quarter', 'year'];

  const filteredKPIs = selectedCategory === 'all' 
    ? mockKPIs 
    : mockKPIs.filter(kpi => kpi.category === selectedCategory);

  const filteredGoals = selectedCategory === 'all' 
    ? mockGoals 
    : mockGoals.filter(goal => goal.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  };

  const getProgressPercentage = (current: string | number, target: string | number) => {
    const currentNum = typeof current === 'string' ? parseFloat(current) : current;
    const targetNum = typeof target === 'string' ? parseFloat(target) : target;
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFFD] to-[#edfbfa]">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              KPI & Goal Tracking
            </h1>
            <p className="text-gray-600">Monitor your team&apos;s performance and track progress towards goals</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#40b8a6] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-[#40b8a6] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* KPI Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Performance Indicators</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKPIs.map((kpi, index) => (
                <motion.div
                  key={kpi.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                    {getTrendIcon(kpi.trend)}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {kpi.current}{kpi.unit}
                      </span>
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{kpi.period}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Target: {kpi.target}{kpi.unit}</span>
                      <span>{Math.round((kpi.current / kpi.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#40b8a6] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Goals Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Goals & Objectives</h2>
                <button
                  onClick={() => setShowAddGoal(!showAddGoal)}
                  className="px-4 py-2 bg-[#40b8a6] text-white rounded-lg hover:bg-[#359e8d] transition-colors text-sm"
                >
                  Add Goal
                </button>
              </div>
              
              <div className="space-y-4">
                {filteredGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{goal.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>Target: {goal.target}</span>
                      <span>Current: {goal.current}</span>
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(getProgressPercentage(goal.current, goal.target))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#40b8a6] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h2>
              
              <div className="space-y-4">
                {mockTrends.slice(-3).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{trend.month}</p>
                      <p className="text-sm text-gray-600">Monthly Overview</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Productivity</p>
                          <p className="font-semibold text-[#40b8a6]">{trend.productivity}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Efficiency</p>
                          <p className="font-semibold text-green-600">{trend.efficiency}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quality</p>
                          <p className="font-semibold text-purple-600">{trend.quality}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-[#e7f9f6] rounded-lg">
                <h3 className="font-medium text-[#40b8a6] mb-2">Trend Analysis</h3>
                <p className="text-sm text-gray-700">
                  Your team is showing consistent improvement across all metrics. 
                  Focus on maintaining momentum and addressing any bottlenecks.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-[#e7f9f6] rounded-lg hover:bg-[#d1f2ed] transition-colors">
                <div className="p-2 bg-[#40b8a6] rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Generate Report</p>
                  <p className="text-sm text-gray-600">Create detailed performance reports</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-[#e7f9f6] rounded-lg hover:bg-[#d1f2ed] transition-colors">
                <div className="p-2 bg-[#40b8a6] rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Set Targets</p>
                  <p className="text-sm text-gray-600">Define new KPI targets</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-[#e7f9f6] rounded-lg hover:bg-[#d1f2ed] transition-colors">
                <div className="p-2 bg-[#40b8a6] rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Schedule Review</p>
                  <p className="text-sm text-gray-600">Plan performance reviews</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KPITracking; 