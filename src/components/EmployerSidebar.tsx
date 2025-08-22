import React from "react";
import Link from "next/link";
import {
  Home,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Bell,
  Settings,
  HelpCircle,
  Users,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useTranslations } from "@/contexts/I18nContext";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
}

function SidebarItem({ icon, label, active = false, href }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition ${
          active 
            ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" 
            : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
        }`}
      >
        <div className="mr-3">{icon}</div>
        <span>{label}</span>
      </div>
    </Link>
  );
}

const EmployerSidebar: React.FC = () => {
  const tNav = useTranslations("navigation");
  const t = useTranslations("common");
  
  return (
    <div className="w-64 bg-emerald-50 dark:bg-gray-900 p-4 flex flex-col min-h-screen fixed left-0 top-0 z-20">
      <div className="mb-8">
        <h1 className="text-2xl font-serif italic text-emerald-600 dark:text-emerald-400">MoveIt</h1>
        <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-1">Employer Portal</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        <SidebarItem 
          icon={<Home size={20} />} 
          label="Home" 
          href="/EmployerDashboard"
          active={true}
        />
        <SidebarItem 
          icon={<BarChart3 size={20} />} 
          label="KPI Tracking" 
          href="/KPITracking"
        />
        <SidebarItem 
          icon={<TrendingUp size={20} />} 
          label="Progress" 
          href="/Progress"
        />
        <SidebarItem 
          icon={<MessageSquare size={20} />} 
          label="Messaging" 
          href="/Messaging"
        />
        <SidebarItem 
          icon={<Bell size={20} />} 
          label="Notifications" 
          href="/Notifications"
        />
      </nav>
      
      <div className="mt-8 space-y-4">
        <button className="w-full flex items-center justify-center gap-2 bg-[#40b8a6] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#359e8d] transition-colors">
          <Users size={18} />
          Manage Team
        </button>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            href="/Settings"
          />
          <SidebarItem 
            icon={<HelpCircle size={20} />} 
            label="Help" 
            href="/Help"
          />
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default EmployerSidebar;
