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
} from "lucide-react";
import { useTranslations } from "@/contexts/I18nContext";

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
        <Link href="/Dashboard" onClick={handleLinkClick}>
          <SidebarItem icon={<Home size={20} />} label={tNav("dashboard") || "Dashboard"} />
        </Link>
        <Link href="/TaskCompletion" onClick={handleLinkClick}>
          <SidebarItem icon={<CheckSquare size={20} />} label={tNav("taskCompletion") || "Task Completion"} />
        </Link>
        <Link href="/PomodoroTimer" onClick={handleLinkClick}>
          <SidebarItem icon={<Clock size={20} />} label={tNav("pomodoro") || "Pomodoro Timer"} />
        </Link>
        <Link href="/Gamification" onClick={handleLinkClick}>
          <SidebarItem icon={<Star size={20} />} label={tNav("gamification") || "Gamification"} />
        </Link>
        <Link href="/Progress" onClick={handleLinkClick}>
          <SidebarItem icon={<BarChart2 size={20} />} label={tNav("progress") || "Progress"} />
        </Link>
        <Link href="/Calendar" onClick={handleLinkClick}>
          <SidebarItem icon={<Calendar size={20} />} label={tNav("calendar") || "Calendar"} />
        </Link>
        <Link href="/Teams" onClick={handleLinkClick}>
          <SidebarItem icon={<Users size={20} />} label={tNav("teams") || "Teams"} />
        </Link>
      </nav>
      <div className="mt-8 space-y-4">
        <Link href="/CreateTask" onClick={handleLinkClick}> <button className="w-full flex items-center justify-center gap-2 bg-[#40b8a6] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#359e8d] transition-colors">
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
      </div>
      
      </div>
    </>
  );
};

export default Sidebar;
