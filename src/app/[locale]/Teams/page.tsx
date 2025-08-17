"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import { useTranslations } from "@/contexts/I18nContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import {
  Users,
  UserPlus,
  Crown,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  MessageSquare,
  Video,
  Search,
  Bell,
  Filter,
  MoreHorizontal,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Target,
  Zap,
  Activity,
  UserCheck,
  Globe,
  Shield,
} from "lucide-react";

// Mock data for teams
const mockTeams = [
  {
    id: 1,
    name: "Design Team",
    description: "Creating beautiful and intuitive user experiences",
    members: 8,
    lead: "Sarah Johnson",
    avatar: "SJ",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    completedTasks: 24,
    totalTasks: 30,
    productivity: 92,
    status: "active"
  },
  {
    id: 2,
    name: "Development Team",
    description: "Building robust and scalable applications",
    members: 12,
    lead: "Alex Chen",
    avatar: "AC",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    completedTasks: 18,
    totalTasks: 25,
    productivity: 88,
    status: "active"
  },
  {
    id: 3,
    name: "Marketing Team",
    description: "Driving growth and brand awareness",
    members: 6,
    lead: "Emma Wilson",
    avatar: "EW",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    completedTasks: 15,
    totalTasks: 20,
    productivity: 85,
    status: "active"
  },
  {
    id: 4,
    name: "Research Team",
    description: "Analyzing market trends and user behavior",
    members: 4,
    lead: "David Kim",
    avatar: "DK",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    completedTasks: 12,
    totalTasks: 15,
    productivity: 90,
    status: "active"
  }
];

const mockTeamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Design Lead",
    email: "sarah.j@moveit.com",
    avatar: "SJ",
    status: "online",
    tasksCompleted: 24,
    productivity: 95,
    joinDate: "2023-01-15",
    skills: ["UI/UX", "Figma", "Prototyping"]
  },
  {
    id: 2,
    name: "Alex Chen",
    role: "Senior Developer",
    email: "alex.c@moveit.com",
    avatar: "AC",
    status: "online",
    tasksCompleted: 32,
    productivity: 92,
    joinDate: "2022-11-20",
    skills: ["React", "Node.js", "TypeScript"]
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Marketing Manager",
    email: "emma.w@moveit.com",
    avatar: "EW",
    status: "away",
    tasksCompleted: 18,
    productivity: 88,
    joinDate: "2023-03-10",
    skills: ["SEO", "Content", "Analytics"]
  },
  {
    id: 4,
    name: "David Kim",
    role: "Research Analyst",
    email: "david.k@moveit.com",
    avatar: "DK",
    status: "offline",
    tasksCompleted: 15,
    productivity: 90,
    joinDate: "2023-02-05",
    skills: ["Data Analysis", "Research", "Statistics"]
  }
];

const Teams: React.FC = () => {
  const tNav = useTranslations('navigation');
  const t = useTranslations('teams');
  const tCommon = useTranslations('common');
  
  const [selectedView, setSelectedView] = useState<'teams' | 'members'>('teams');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const filteredTeams = mockTeams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = mockTeamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -5, 
      transition: { duration: 0.2 },
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-[#F0FFFD] via-white to-[#edfbfa]">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="md:hidden">
              <h1 className="text-2xl font-serif italic text-emerald-600">
                MoveIt
              </h1>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <LanguageSwitcher />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={tCommon('search')}
              >
                <Search className="text-gray-500" size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="text-gray-500" size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
            </div>
          </div>
        </header>

        <div className="pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
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
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        Team Management
                      </h1>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#40b8a6]" />
                        Collaborate and manage your teams effectively
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Team
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* View Toggle and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    {['teams', 'members'].map((view) => (
                      <motion.button
                        key={view}
                        onClick={() => setSelectedView(view as 'teams' | 'members')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedView === view
                            ? "bg-[#40b8a6] text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {view === 'teams' ? 'Teams' : 'Members'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="relative w-full lg:w-80">
                  <input
                    type="text"
                    placeholder={selectedView === 'teams' ? 'Search teams...' : 'Search members...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Teams View */}
            {selectedView === 'teams' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              >
                {filteredTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#40b8a6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${team.bgColor} flex items-center justify-center`}>
                            <Users className={`w-6 h-6 ${team.textColor}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#40b8a6] transition-colors">
                              {team.name}
                            </h3>
                            <p className="text-sm text-gray-600">{team.members} members</p>
                          </div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {team.description}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{team.avatar}</span>
                          </div>
                          <span className="text-sm text-gray-600">Led by {team.lead}</span>
                        </div>
                        <Crown className="w-4 h-4 text-yellow-500" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{team.completedTasks}/{team.totalTasks}</p>
                          <p className="text-xs text-gray-600">Tasks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{team.productivity}%</p>
                          <p className="text-xs text-gray-600">Productivity</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{Math.round((team.completedTasks / team.totalTasks) * 100)}%</p>
                          <p className="text-xs text-gray-600">Complete</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span className="font-medium">Progress</span>
                          <span className="font-semibold">{Math.round((team.completedTasks / team.totalTasks) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(team.completedTasks / team.totalTasks) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`bg-gradient-to-r ${team.color} h-2 rounded-full`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Team
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Members View */}
            {selectedView === 'members' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#40b8a6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                              <span className="text-lg font-bold text-white">{member.avatar}</span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-[#40b8a6] transition-colors">
                              {member.name}
                            </h3>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                          <p className="text-lg font-bold text-gray-900">{member.tasksCompleted}</p>
                          <p className="text-xs text-gray-600">Tasks Done</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                          <p className="text-lg font-bold text-gray-900">{member.productivity}%</p>
                          <p className="text-xs text-gray-600">Productivity</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-[#40b8a6]/10 text-[#40b8a6] text-xs rounded-lg font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Profile
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {((selectedView === 'teams' && filteredTeams.length === 0) || 
              (selectedView === 'members' && filteredMembers.length === 0)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No {selectedView} found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {selectedView === 'teams' 
                    ? "Create your first team to start collaborating with your colleagues."
                    : "Invite team members to start building your organization."
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#40b8a6] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#359e8d] transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  {selectedView === 'teams' ? 'Create Team' : 'Invite Member'}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
