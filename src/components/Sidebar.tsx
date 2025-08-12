import React from "react";
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
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
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

const Sidebar: React.FC = () => {
  const tNav = useTranslations("navigation");
  const t = useTranslations("common");
  return (
    <div className="w-64 bg-emerald-50 p-4 flex flex-col min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-serif italic text-emerald-600">MoveIt</h1>
      </div>
      <nav className="flex-1 space-y-1">
        <Link href="/Dashboard">
          <SidebarItem icon={<Home size={20} />} label={tNav("dashboard") || "Dashboard"} />
        </Link>
        <Link href="/TaskCompletion">
          <SidebarItem icon={<CheckSquare size={20} />} label={tNav("taskCompletion") || "Task Completion"} />
        </Link>
        <Link href="/PomodoroTimer">
          <SidebarItem icon={<Clock size={20} />} label={tNav("pomodoro") || "Pomodoro Timer"} />
        </Link>
        <Link href="/Gamification">
          <SidebarItem icon={<Star size={20} />} label={tNav("gamification") || "Gamification"} />
        </Link>
        <Link href="/Progress">
          <SidebarItem icon={<BarChart2 size={20} />} label={tNav("progress") || "Progress"} />
        </Link>
        <Link href="/Calendar">
          <SidebarItem icon={<Calendar size={20} />} label={tNav("calendar") || "Calendar"} />
        </Link>
        <Link href="/Teams">
          <SidebarItem icon={<Users size={20} />} label={tNav("teams") || "Teams"} />
        </Link>
      </nav>
      <div className="mt-8 space-y-4">
        <Link href="/CreateTask"> <button className="w-full flex items-center justify-center gap-2 bg-[#40b8a6] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#359e8d] transition-colors">
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
      <div className="mt-8">
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Sidebar;
