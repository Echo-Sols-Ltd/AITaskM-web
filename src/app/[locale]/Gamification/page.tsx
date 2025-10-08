"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../../components/Sidebar";
import { useTranslations } from "@/contexts/I18nContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import {
  Bell,
  Trophy,
  Star,
  Target,
  Award,
  Zap,
  Medal
} from "lucide-react";

// Mock data for gamification
const mockBadges = [
  {
    id: 1,
    name: "Early Bird",
    description: "Complete 5 tasks before 9 AM",
    icon: "🌅",
    earned: true,
    progress: 100,
    rarity: "common",
  },
  {
    id: 2,
    name: "Speed Demon",
    description: "Complete 10 tasks in a single day",
    icon: "⚡",
    earned: true,
    progress: 100,
    rarity: "rare",
  },
  {
    id: 3,
    name: "Team Player",
    description: "Collaborate on 20 tasks with team members",
    icon: "🤝",
    earned: false,
    progress: 65,
    rarity: "epic",
  },
  {
    id: 4,
    name: "Quality Master",
    description: "Complete 50 tasks with 100% quality score",
    icon: "🏆",
    earned: false,
    progress: 32,
    rarity: "legendary",
  },
  {
    id: 5,
    name: "Consistency King",
    description: "Maintain 30-day streak",
    icon: "👑",
    earned: false,
    progress: 18,
    rarity: "legendary",
  },
  {
    id: 6,
    name: "Problem Solver",
    description: "Resolve 15 blockers independently",
    icon: "🔧",
    earned: true,
    progress: 100,
    rarity: "rare",
  },
];

const mockLeaderboard = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/pp1.png",
    points: 2840,
    level: 15,
    department: "Design",
    streak: 12,
    position: 1,
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/pp2.png",
    points: 2670,
    level: 14,
    department: "Engineering",
    streak: 8,
    position: 2,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/pp1.png",
    points: 2450,
    level: 13,
    department: "Product",
    streak: 15,
    position: 3,
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/pp2.png",
    points: 2230,
    level: 12,
    department: "Engineering",
    streak: 6,
    position: 4,
  },
  {
    id: 5,
    name: "Alex Thompson",
    avatar: "/pp1.png",
    points: 1980,
    level: 11,
    department: "Marketing",
    streak: 9,
    position: 5,
  },
];

const mockUserStats = {
  currentLevel: 12,
  currentPoints: 1980,
  pointsToNextLevel: 220,
  totalBadges: 8,
  currentStreak: 9,
  longestStreak: 15,
  weeklyPoints: 420,
  monthlyPoints: 1680,
};

const Gamification: React.FC = () => {
  const tCommon = useTranslations('common');
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [selectedTab, setSelectedTab] = useState("badges");
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      case "rare":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200";
      case "epic":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200";
      case "legendary":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-200 dark:border-gray-600";
      case "rare":
        return "border-blue-200 dark:border-blue-700";
      case "epic":
        return "border-purple-200 dark:border-purple-700";
      case "legendary":
        return "border-yellow-200 dark:border-yellow-700";
      default:
        return "border-gray-200 dark:border-gray-600";
    }
  };

  const filteredBadges =
    selectedRarity === "all"
      ? mockBadges
      : mockBadges.filter((badge) => badge.rarity === selectedRarity);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -5, 
      transition: { duration: 0.2 },
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
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
              <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={tCommon('search')}
              >
           
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="text-gray-500 dark:text-gray-400" size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
            </div>
          </div>
        </header>

          <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Gamification Center
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#40b8a6]" />
                        Track your progress, earn badges, and compete with your team
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  title: "Current Level",
                  value: mockUserStats.currentLevel,
                  icon: Zap,
                  color: "from-[#40b8a6] to-[#359e8d]",
                  bgColor: "bg-[#e7f9f6] dark:bg-[#40b8a6]/10",
                  textColor: "text-[#40b8a6]",
                  extra: `${mockUserStats.pointsToNextLevel} points to next level`
                },
                {
                  title: "Total Points",
                  value: mockUserStats.currentPoints.toLocaleString(),
                  icon: Target,
                  color: "from-green-500 to-green-600",
                  bgColor: "bg-green-50 dark:bg-green-900/10",
                  textColor: "text-green-600",
                  extra: `+${mockUserStats.weeklyPoints} this week`
                },
                {
                  title: "Current Streak",
                  value: `${mockUserStats.currentStreak} days`,
                  icon: Star,
                  color: "from-orange-500 to-orange-600",
                  bgColor: "bg-orange-50 dark:bg-orange-900/10",
                  textColor: "text-orange-600",
                  extra: `Longest: ${mockUserStats.longestStreak} days`
                },
                {
                  title: "Badges Earned",
                  value: mockUserStats.totalBadges,
                  icon: Award,
                  color: "from-purple-500 to-purple-600",
                  bgColor: "bg-purple-50 dark:bg-purple-900/10",
                  textColor: "text-purple-600",
                  extra: "3 new this month"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {stat.extra}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "badges", label: "Badges", icon: Medal },
                  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
                  { id: "achievements", label: "Achievements", icon: Award }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedTab === tab.id
                        ? "bg-[#40b8a6] text-white shadow-lg"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {selectedTab === "badges" && (
                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["all", "common", "rare", "epic", "legendary"].map((rarity) => (
                      <button
                        key={rarity}
                        onClick={() => setSelectedRarity(rarity)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedRarity === rarity
                            ? "bg-[#40b8a6] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBadges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 ${getRarityBorder(badge.rarity)} ${
                          badge.earned ? "opacity-100" : "opacity-60"
                        } relative overflow-hidden`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{badge.icon}</div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{badge.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{badge.description}</p>
                          
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)} mb-4`}>
                            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                          </div>

                          {!badge.earned && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                                <span>Progress</span>
                                <span>{badge.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${badge.progress}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] h-2 rounded-full"
                                />
                              </div>
                            </div>
                          )}

                          {badge.earned && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "leaderboard" && (
                <div className="space-y-4">
                  {mockLeaderboard.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.position === 1 ? "bg-yellow-100 text-yellow-800" :
                          user.position === 2 ? "bg-gray-100 text-gray-800" :
                          user.position === 3 ? "bg-orange-100 text-orange-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {user.position}
                        </div>
                        <div className="w-10 h-10 bg-[#40b8a6] rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{user.department} • Level {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">{user.points.toLocaleString()} pts</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{user.streak} day streak</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedTab === "achievements" && (
                <div className="text-center py-16">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-300">Achievement system is under development</p>
                </div>
              )}
            </motion.div>
          </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Gamification;
