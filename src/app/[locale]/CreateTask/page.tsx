// app/tasks/new/page.tsx
"use client";

import { useState } from "react";
import { useTranslations} from "@/contexts/I18nContext";
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import {

  Search,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  
  Link,
  Calendar as CalendarIcon,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";

export default function NewTaskPage() {
  const t = useTranslations('tasks');

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const [assignee, setAssignee] = useState("Me");
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      title: taskTitle,
      description: taskDescription,
      priority,
      deadline,
      assignee,
    });
    // Reset form or redirect
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="md:hidden">
              <h1 className="text-2xl font-serif italic text-emerald-600">
                MoveIt
              </h1>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <LanguageSwitcher />
              <Search className="text-gray-500" size={20} />
            </div>
          </div>
        </header>

        {/* Form Content */}
        <div className="max-w-3xl mx-auto p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('title')}
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder={t('createNew')}
                  className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 border-b border-gray-200">
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <span className="text-gray-500 text-sm font-medium">
                        H₁
                      </span>
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <span className="text-gray-500 text-sm font-medium">
                        H₂
                      </span>
                    </button>
                    <span className="mx-1 text-gray-300">|</span>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Bold size={16} className="text-gray-500" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Italic size={16} className="text-gray-500" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Underline size={16} className="text-gray-500" />
                    </button>
                    <span className="mx-1 text-gray-300">|</span>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <List size={16} className="text-gray-500" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <ListOrdered size={16} className="text-gray-500" />
                    </button>
                    <span className="mx-1 text-gray-300">|</span>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Link size={16} className="text-gray-500" />
                    </button>
                  </div>
                  <textarea
                    id="description"
                    placeholder="Add more details to this task"
                    className="w-full p-4 bg-gray-50 focus:outline-none min-h-32"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deadline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="deadline"
                    placeholder="DD/MM/YYYY"
                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-4">
                    <CalendarIcon size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label
                  htmlFor="assignee"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Assignee
                </label>
                <div className="relative">
                  <select
                    id="assignee"
                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  >
                    <option value="Me">Me</option>
                    <option value="Team Member 1">Team Member 1</option>
                    <option value="Team Member 2">Team Member 2</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-400 hover:bg-emerald-500 text-white rounded-lg transition"
                >
                  Create task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


