'use client';

import React from "react";
import Link from "next/link";
import {
  Home,
  CheckSquare,
  BarChart2,
  Users,
  Calendar,
  Settings,
  HelpCircle,
  MessageSquare,
  LogOut,
  Clock,
  Shield,
  UserCheck,
  Target,
  Database,
  FileText,
  Award,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { useTranslations, useLocale } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ui/ThemeToggle";
import { usePathname } from "next/navigation";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[]; // Which roles can see this item
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RoleBasedSidebar({ isOpen = true, onClose }: SidebarProps) {
  const tNav = useTranslations("navigation");
  const t = useTranslations("common");
  const locale = useLocale();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Define menu items with role-based access
  const menuItems: MenuItem[] = [
    // Common items (all roles)
    { icon: Home, label: tNav('dashboard'), href: `/${locale}/Dashboard`, roles: ['admin', 'manager', 'employee', 'viewer'] },
    { icon: CheckSquare, label: tNav('tasks'), href: `/${locale}/Tasks`, roles: ['admin', 'manager', 'employee', 'viewer'] },
    
    // Admin only
    { icon: Shield, label: 'System Admin', href: `/${locale}/Admin`, roles: ['admin'] },
    { icon: Users, label: 'User Management', href: `/${locale}/Users`, roles: ['admin'] },
    { icon: Database, label: 'Database', href: `/${locale}/Database`, roles: ['admin'] },
    { icon: Settings, label: 'System Settings', href: `/${locale}/Settings`, roles: ['admin'] },
    
    // Manager & Admin
    { icon: UserCheck, label: 'Team Management', href: `/${locale}/Teams`, roles: ['admin', 'manager'] },
    { icon: Briefcase, label: 'Projects', href: `/${locale}/Projects`, roles: ['admin', 'manager'] },
    { icon: BarChart2, label: tNav('analytics'), href: `/${locale}/Analytics`, roles: ['admin', 'manager'] },
    { icon: FileText, label: 'Reports', href: `/${locale}/Reports`, roles: ['admin', 'manager'] },
    { icon: Target, label: 'KPI Tracking', href: `/${locale}/KPITracking`, roles: ['admin', 'manager'] },
    
    // Employee, Manager & Admin
    { icon: Calendar, label: tNav('calendar'), href: `/${locale}/Calendar`, roles: ['admin', 'manager', 'employee'] },
    { icon: Clock, label: 'Pomodoro Timer', href: `/${locale}/PomodoroTimer`, roles: ['admin', 'manager', 'employee'] },
    { icon: TrendingUp, label: 'My Progress', href: `/${locale}/Progress`, roles: ['admin', 'manager', 'employee'] },
    { icon: Award, label: tNav('gamification'), href: `/${locale}/Gamification`, roles: ['admin', 'manager', 'employee'] },
    
    // All roles
    { icon: MessageSquare, label: tNav('messaging'), href: `/${locale}/Messaging`, roles: ['admin', 'manager', 'employee', 'viewer'] },
    { icon: HelpCircle, label: tNav('help'), href: `/${locale}/Help`, roles: ['admin', 'manager', 'employee', 'viewer'] },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#F0FFFD] to-[#edfbfa] dark:from-gray-800 dark:to-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif italic text-emerald-600 dark:text-emerald-400">
                MoveIt
              </h1>
              <button
                onClick={onClose}
                className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <LogOut size={20} />
              </button>
            </div>
            {/* User Role Badge */}
            {user && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                    active
                      ? "bg-white dark:bg-gray-800 text-[#40b8a6] dark:text-[#4dd0bd] shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
