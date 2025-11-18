'use client';

import { useState, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';
import { apiClient } from '@/services/api';

interface Task {
  _id: string;
  title: string;
  priority: string;
  estimatedHours?: number;
  deadline?: string;
  tags?: string[];
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  currentTasks?: number;
}

interface Assignment {
  task_id: string;
  assigned_to: string;
  reason: string;
  confidence?: number;
}

export default function AITaskAssignment() {
  const { assignTasks, loading, error } = useAI();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load unassigned tasks
      const tasksResponse = await apiClient.getTasks({ 
        status: 'pending',
        limit: 50
      });
      setTasks(tasksResponse.tasks.filter(t => !t.assignedTo));

      // Load team members
      const usersResponse = await apiClient.getUsers({ 
        role: 'employee',
        limit: 100
      });
      setTeamMembers(usersResponse.users);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleAIAssignment = async () => {
    if (selectedTasks.length === 0) {
      alert('Please select at least one task');
      return;
    }

    if (teamMembers.length === 0) {
      alert('No team members available');
      return;
    }

    try {
      const tasksToAssign = tasks.filter(t => selectedTasks.includes(t._id));
      
      const result = await assignTasks(
        tasksToAssign.map(t => ({
          id: t._id,
          title: t.title,
          priority: t.priority,
          estimatedHours: t.estimatedHours || 8,
          deadline: t.deadline,
          tags: t.tags || []
        })),
        teamMembers.map(m => ({
          id: m._id,
          name: m.name,
          role: m.role,
          currentTasks: m.currentTasks || 0
        }))
      );

      setAssignments(result.assignments);
      setShowResults(true);
      
      // Reload tasks to reflect assignments
      await loadData();
      setSelectedTasks([]);
    } catch (err) {
      console.error('AI assignment failed:', err);
    }
  };

  const getTeamMemberName = (memberId: string) => {
    const member = teamMembers.find(m => m._id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getTaskTitle = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    return task ? task.title : 'Unknown Task';
  };

  return (
    <div className="ai-task-assignment p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 AI-Powered Task Assignment
        </h2>
        <p className="text-gray-600">
          Select tasks and let AI intelligently assign them to team members based on workload, skills, and performance.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tasks Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Unassigned Tasks ({tasks.length})</h3>
          <div className="border rounded-md max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No unassigned tasks available
              </div>
            ) : (
              tasks.map(task => (
                <div
                  key={task._id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedTasks.includes(task._id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleTaskSelection(task._id)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task._id)}
                      onChange={() => handleTaskSelection(task._id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{task.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high' || task.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        {task.estimatedHours && (
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                            {task.estimatedHours}h
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Members Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Team Members ({teamMembers.length})</h3>
          <div className="border rounded-md max-h-96 overflow-y-auto">
            {teamMembers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No team members available
              </div>
            ) : (
              teamMembers.map(member => (
                <div key={member._id} className="p-3 border-b hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {member.currentTasks || 0} active tasks
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleAIAssignment}
          disabled={loading || selectedTasks.length === 0 || teamMembers.length === 0}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            loading || selectedTasks.length === 0 || teamMembers.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Assigning with AI...
            </span>
          ) : (
            `🤖 AI Auto-Assign ${selectedTasks.length} Task${selectedTasks.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>

      {/* Results Section */}
      {showResults && assignments.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            ✅ Assignment Complete!
          </h3>
          <div className="space-y-2">
            {assignments.map((assignment, index) => (
              <div key={index} className="p-3 bg-white rounded border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {getTaskTitle(assignment.task_id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      → Assigned to: <span className="font-medium">{getTeamMemberName(assignment.assigned_to)}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {assignment.reason}
                    </p>
                  </div>
                  {assignment.confidence && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {Math.round(assignment.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
