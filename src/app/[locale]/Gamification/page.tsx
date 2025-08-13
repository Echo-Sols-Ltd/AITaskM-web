"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";

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
  const [selectedTab, setSelectedTab] = useState("badges");
  const [selectedRarity, setSelectedRarity] = useState("all");

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800";
      case "rare":
        return "bg-blue-100 text-blue-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      case "legendary":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-200";
      case "rare":
        return "border-blue-200";
      case "epic":
        return "border-purple-200";
      case "legendary":
        return "border-yellow-200";
      default:
        return "border-gray-200";
    }
  };

  const filteredBadges =
    selectedRarity === "all"
      ? mockBadges
      : mockBadges.filter((badge) => badge.rarity === selectedRarity);

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
              Gamification Center
            </h1>
            <p className="text-gray-600">
              Track your progress, earn badges, and compete with your team
            </p>
          </motion.div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Current Level
                  </p>
                  <p className="text-2xl font-bold text-[#40b8a6]">
                    {mockUserStats.currentLevel}
                  </p>
                </div>
                <div className="p-3 bg-[#e7f9f6] rounded-full">
                  <svg
                    className="w-6 h-6 text-[#40b8a6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{mockUserStats.currentPoints} pts</span>
                  <span>
                    {mockUserStats.currentPoints +
                      mockUserStats.pointsToNextLevel}{" "}
                    pts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#40b8a6] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (mockUserStats.currentPoints /
                          (mockUserStats.currentPoints +
                            mockUserStats.pointsToNextLevel)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {mockUserStats.pointsToNextLevel} points to next level
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Points
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockUserStats.currentPoints}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mockUserStats.currentStreak} days
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Longest: {mockUserStats.longestStreak} days
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Badges Earned
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockUserStats.totalBadges}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
          >
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedTab("badges")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTab === "badges"
                    ? "bg-[#40b8a6] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Badges
              </button>
              <button
                onClick={() => setSelectedTab("leaderboard")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTab === "leaderboard"
                    ? "bg-[#40b8a6] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setSelectedTab("achievements")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTab === "achievements"
                    ? "bg-[#40b8a6] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Achievements
              </button>
            </div>

            {selectedTab === "badges" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["all", "common", "rare", "epic", "legendary"].map(
                    (rarity) => (
                      <button
                        key={rarity}
                        onClick={() => setSelectedRarity(rarity)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedRarity === rarity
                            ? "bg-[#40b8a6] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className={`p-6 rounded-xl border-2 ${getRarityBorder(
                        badge.rarity
                      )} ${badge.earned ? "bg-white" : "bg-gray-50"} ${
                        badge.earned ? "shadow-lg" : "shadow-sm"
                      } transition-all duration-300 hover:shadow-xl`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-4xl mb-3 ${
                            badge.earned ? "" : "grayscale opacity-50"
                          }`}
                        >
                          {badge.icon}
                        </div>
                        <h3
                          className={`font-semibold mb-2 ${
                            badge.earned ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {badge.name}
                        </h3>
                        <p
                          className={`text-sm mb-4 ${
                            badge.earned ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {badge.description}
                        </p>

                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(
                            badge.rarity
                          )}`}
                        >
                          {badge.rarity}
                        </span>

                        {!badge.earned && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{badge.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#40b8a6] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${badge.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {badge.earned && (
                          <div className="mt-4 flex items-center justify-center gap-1 text-green-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm font-medium">Earned</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "leaderboard" && (
              <div>
                <div className="space-y-4">
                  {mockLeaderboard.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index === 0
                          ? "bg-yellow-50 border-2 border-yellow-200"
                          : index === 1
                          ? "bg-gray-50 border-2 border-gray-200"
                          : index === 2
                          ? "bg-orange-50 border-2 border-orange-200"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#40b8a6] text-white font-bold text-sm">
                          {user.position}
                        </div>
                        <div className="w-10 h-10 bg-[#40b8a6] rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {user.department} • Level {user.level}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {user.points.toLocaleString()} pts
                        </p>
                        <p className="text-sm text-gray-600">
                          {user.streak} day streak
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "achievements" && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600">
                  Achievement system will be available soon!
                </p>
              </div>
            )}
          </motion.div>

          {/* Weekly/Monthly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Weekly Progress
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Points earned</span>
                  <span className="font-semibold text-gray-900">
                    {mockUserStats.weeklyPoints}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tasks completed</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Streak maintained</span>
                  <span className="font-semibold text-gray-900">7 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Badges earned</span>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Monthly Overview
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total points</span>
                  <span className="font-semibold text-gray-900">
                    {mockUserStats.monthlyPoints}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tasks completed</span>
                  <span className="font-semibold text-gray-900">48</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average productivity</span>
                  <span className="font-semibold text-gray-900">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Team rank</span>
                  <span className="font-semibold text-gray-900">#3</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;