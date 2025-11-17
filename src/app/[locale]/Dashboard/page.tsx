"use client";

import React, { useState } from "react";
import RoleBasedSidebar from "../../../components/RoleBasedSidebar";
import MobileMenuButton from "../../../components/MobileMenuButton";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useTranslations } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import AdminDashboard from '../../../components/dashboards/AdminDashboard';
import ManagerDashboard from '../../../components/dashboards/ManagerDashboard';
import EmployeeDashboard from '../../../components/dashboards/EmployeeDashboard';
import { Shield, UserCheck, Target, User } from "lucide-react";
import NotificationCenter from '../../../components/NotificationCenter';
import AIAssistant from '../../../components/AIAssistant';

const Dashboard: React.FC = () => {
  const t = useTranslations('dashboard');
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get role-specific icon and color
  const getRoleInfo = () => {
    switch (user?.role) {
      case 'admin':
        return { icon: Shield, color: 'from-purple-600 to-blue-600', label: 'Admin' };
      case 'manager':
        return { icon: UserCheck, color: 'from-blue-600 to-purple-600', label: 'Manager' };
      case 'employee':
        return { icon: Target, color: 'from-[#40b8a6] to-[#359e8d]', label: 'Employee' };
      default:
        return { icon: User, color: 'from-gray-600 to-gray-700', label: 'User' };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
      case 'viewer':
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
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
                {/* Role Badge */}
                <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${roleInfo.color} text-white text-sm font-medium`}>
                  <RoleIcon className="w-4 h-4" />
                  <span>{roleInfo.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <NotificationCenter />
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${roleInfo.color} flex items-center justify-center`}>
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderDashboard()}
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <AIAssistant userId={user?._id} context="dashboard" />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
