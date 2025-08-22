import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  CheckSquare,
  BarChart2,
  Calendar,
  Users,
  Clock,
  Star,
  Settings,
  HelpCircle,
  MessageSquare,
  Plus,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useTranslations, useLocale } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <div
      className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition ${
        active ? "bg-white text-gray-800" : "text-gray-700 hover:bg-white/50"
      }`}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </div>
  );
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const tNav = useTranslations("navigation");
  const t = useTranslations("common");
  const locale = useLocale();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when clicking on a link on mobile
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`w-64 bg-emerald-50 p-4 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 ease-in-out ${
        isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      }`}>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-serif italic text-emerald-600">MoveIt</h1>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-emerald-100 transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-emerald-600" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1">
        <Link href={`/${locale}/Dashboard`} onClick={handleLinkClick}>
          <SidebarItem icon={<Home size={20} />} label={tNav("dashboard") || "Dashboard"} />
        </Link>
        <Link href={`/${locale}/TaskCompletion`} onClick={handleLinkClick}>
          <SidebarItem icon={<CheckSquare size={20} />} label={tNav("taskCompletion") || "Task Completion"} />
        </Link>
        <Link href={`/${locale}/PomodoroTimer`} onClick={handleLinkClick}>
          <SidebarItem icon={<Clock size={20} />} label={tNav("pomodoro") || "Pomodoro Timer"} />
        </Link>
        <Link href={`/${locale}/Gamification`} onClick={handleLinkClick}>
          <SidebarItem icon={<Star size={20} />} label={tNav("gamification") || "Gamification"} />
        </Link>
        <Link href={`/${locale}/Progress`} onClick={handleLinkClick}>
          <SidebarItem icon={<BarChart2 size={20} />} label={tNav("progress") || "Progress"} />
        </Link>
        <Link href={`/${locale}/Calendar`} onClick={handleLinkClick}>
          <SidebarItem icon={<Calendar size={20} />} label={tNav("calendar") || "Calendar"} />
        </Link>
        <Link href={`/${locale}/Teams`} onClick={handleLinkClick}>
          <SidebarItem icon={<Users size={20} />} label={tNav("teams") || "Teams"} />
        </Link>
      </nav>
      <div className="mt-8 space-y-4">
        <Link href={`/${locale}/CreateTask`} onClick={handleLinkClick}> <button className="w-full flex items-center justify-center gap-2 bg-[#40b8a6] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#359e8d] transition-colors">
          <Plus size={18} />
          {t("createNew") || "Create New"}
        </button></Link>
       
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-emerald-200 text-emerald-600 py-2 px-4 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
          <Users size={18} />
          {t("inviteTeam") || "Invite team"}
        </button>
        <div className="pt-4 border-t border-gray-200 space-y-1">
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
          <SidebarItem icon={<HelpCircle size={20} />} label="Help" />
          <SidebarItem icon={<MessageSquare size={20} />} label="Feedback" />
        </div>
        
        {/* User Profile Section */}
        {user && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-emerald-50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user.avatar || user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={16} />
              {t("logout") || "Logout"}
            </button>
          </div>
        )}
      </div>
      
      </div>
    </>
  );
};

export default Sidebar;
