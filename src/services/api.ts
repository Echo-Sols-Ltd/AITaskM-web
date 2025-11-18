// API Configuration and HTTP Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'employee' | 'employer' | 'admin' | 'manager';
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  deadline?: string;
  progress?: number;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  project?: {
    _id: string;
    name: string;
    code: string;
  };
  team?: {
    _id: string;
    name: string;
  };
  department?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  tags?: string[];
  dependencies?: string[];
  subtasks?: string[];
  requirements?: string[];
}

interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  assignedTo?: string;
  project?: string;
  team?: string;
  estimatedHours?: number;
  tags?: string[];
  dependencies?: string[];
  subtasks?: string[];
}

interface TasksResponse {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  productivityScore: number;
  streakDays: number;
}

interface DashboardData {
  tasks: Task[];
  stats: DashboardStats;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('moveit_token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/verify', {
      method: 'GET',
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Dashboard endpoints
  async getDashboardData(): Promise<DashboardData> {
    return this.request<DashboardData>('/api/dashboard', {
      method: 'GET',
    });
  }

  async getDashboardStats(): Promise<any> {
    return this.request<any>('/api/dashboard/stats', {
      method: 'GET',
    });
  }

  async getRecentActivity(): Promise<Task[]> {
    return this.request<Task[]>('/api/dashboard/recent', {
      method: 'GET',
    });
  }

  // Task endpoints
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTasks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    assignedTo?: string;
    project?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<TasksResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/tasks?${queryString}` : '/api/tasks';
    
    return this.request<TasksResponse>(endpoint, {
      method: 'GET',
    });
  }

  async getTaskById(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: 'GET',
    });
  }

  async updateTask(id: string, taskData: Partial<CreateTaskRequest>): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTaskStatus(id: string, status: string, notes?: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async updateTaskProgress(id: string, progress: number, notes?: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress, notes }),
    });
  }

  // User management endpoints
  async getUsers(params?: { page?: number; limit?: number; role?: string; search?: string }): Promise<{ users: User[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/users?${queryString}` : '/api/users';
    
    return this.request<{ users: User[]; total: number }>(endpoint, {
      method: 'GET',
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'GET',
    });
  }

  async createUser(userData: { name: string; email: string; password: string; role: string }): Promise<User> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Team management endpoints
  async getTeams(): Promise<any[]> {
    return this.request<any[]>('/api/team', {
      method: 'GET',
    });
  }

  async getTeamById(id: string): Promise<any> {
    return this.request<any>(`/api/team/${id}`, {
      method: 'GET',
    });
  }

  async createTeam(teamData: { name: string; description?: string; members?: string[] }): Promise<any> {
    return this.request<any>('/api/team', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async updateTeam(id: string, teamData: any): Promise<any> {
    return this.request<any>(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    });
  }

  async deleteTeam(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/team/${id}`, {
      method: 'DELETE',
    });
  }

  // Project management endpoints
  async getProjects(params?: { status?: string; priority?: string; manager?: string; search?: string }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/projects?${queryString}` : '/api/projects';
    
    return this.request<any[]>(endpoint, {
      method: 'GET',
    });
  }

  async getProjectById(id: string): Promise<any> {
    return this.request<any>(`/api/projects/${id}`, {
      method: 'GET',
    });
  }

  async createProject(projectData: any): Promise<any> {
    return this.request<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any): Promise<any> {
    return this.request<any>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectStats(id: string): Promise<any> {
    return this.request<any>(`/api/projects/${id}/stats`, {
      method: 'GET',
    });
  }

  async addProjectMilestone(id: string, milestoneData: any): Promise<any> {
    return this.request<any>(`/api/projects/${id}/milestones`, {
      method: 'POST',
      body: JSON.stringify(milestoneData),
    });
  }

  async updateProjectMilestone(projectId: string, milestoneId: string, milestoneData: any): Promise<any> {
    return this.request<any>(`/api/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify(milestoneData),
    });
  }

  // Analytics endpoints
  async getAnalyticsOverview(params?: { startDate?: string; endDate?: string; teamId?: string; userId?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/analytics/overview?${queryString}` : '/api/analytics/overview';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getAnalyticsTrends(params?: { period?: string; teamId?: string; userId?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/analytics/trends?${queryString}` : '/api/analytics/trends';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getTeamPerformance(params?: { startDate?: string; endDate?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/analytics/team-performance?${queryString}` : '/api/analytics/team-performance';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getUserProductivity(params?: { startDate?: string; endDate?: string; teamId?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/analytics/user-productivity?${queryString}` : '/api/analytics/user-productivity';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getPriorityAnalysis(params?: { startDate?: string; endDate?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/analytics/priority-analysis?${queryString}` : '/api/analytics/priority-analysis';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getTimeTracking(params?: { startDate?: string; endDate?: string; userId?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/analytics/time-tracking?${queryString}` : '/api/analytics/time-tracking';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  // Report endpoints
  async getTaskReport(params?: { userId?: string; timeframe?: string; status?: string; priority?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/reports/tasks?${queryString}` : '/api/reports/tasks';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getProductivityReport(params?: { userId?: string; timeframe?: string; metrics?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/reports/productivity?${queryString}` : '/api/reports/productivity';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getTeamReport(params: { teamId: string; timeframe?: string; reportType?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/api/reports/team?${queryString}`;
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async getPerformanceReport(params?: { userId?: string; timeframe?: string; comparison?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/reports/performance?${queryString}` : '/api/reports/performance';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async exportReport(data: { reportType: string; format?: string; parameters?: any; timeframe?: string }): Promise<any> {
    return this.request<any>('/api/reports/export', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Export endpoints
  async exportAnalytics(format: 'pdf' | 'excel' | 'csv', params?: { startDate?: string; endDate?: string }): Promise<Blob> {
    const url = `${this.baseURL}/api/export/analytics`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('moveit_token') : null;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ format, ...params }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  async exportTasks(format: 'pdf' | 'excel' | 'csv', filters?: any): Promise<Blob> {
    const url = `${this.baseURL}/api/export/tasks-report`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('moveit_token') : null;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ format, filters }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  // KPI endpoints
  async getKPIs(): Promise<any> {
    return this.request<any>('/api/kpis', {
      method: 'GET',
    });
  }

  async getKPIById(id: string): Promise<any> {
    return this.request<any>(`/api/kpis/${id}`, {
      method: 'GET',
    });
  }

  async getUserKPIs(userId: string): Promise<any> {
    return this.request<any>(`/api/kpis/user/${userId}`, {
      method: 'GET',
    });
  }

  async createKPI(data: any): Promise<any> {
    return this.request<any>('/api/kpis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateKPI(id: string, data: any): Promise<any> {
    return this.request<any>(`/api/kpis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteKPI(id: string): Promise<any> {
    return this.request<any>(`/api/kpis/${id}`, {
      method: 'DELETE',
    });
  }

  async updateKPIProgress(id: string, currentValue: number): Promise<any> {
    return this.request<any>(`/api/kpis/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ currentValue }),
    });
  }

  async calculateKPI(data: { kpiId: string; userId?: string; timeframe?: string }): Promise<any> {
    return this.request<any>('/api/kpis/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Chat endpoints
  async getConversations(): Promise<any> {
    return this.request<any>('/api/chat/conversations', {
      method: 'GET',
    });
  }

  async getConversationById(id: string): Promise<any> {
    return this.request<any>(`/api/chat/conversations/${id}`, {
      method: 'GET',
    });
  }

  async createConversation(data: { name?: string; type: string; participants: string[]; projectId?: string; teamId?: string; taskId?: string }): Promise<any> {
    return this.request<any>('/api/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(conversationId: string, page: number = 1, limit: number = 50): Promise<any> {
    return this.request<any>(`/api/chat/messages/${conversationId}?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async sendMessage(conversationId: string, data: { content: string; type?: string; replyTo?: string; attachments?: any[] }): Promise<any> {
    return this.request<any>(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteMessage(messageId: string): Promise<any> {
    return this.request<any>(`/api/chat/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async addReaction(messageId: string, emoji: string, type: string = 'emoji'): Promise<any> {
    return this.request<any>(`/api/chat/messages/${messageId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ emoji, type }),
    });
  }

  async markMessageAsRead(messageId: string): Promise<any> {
    return this.request<any>(`/api/chat/messages/${messageId}/read`, {
      method: 'POST',
    });
  }

  async markConversationAsRead(conversationId: string): Promise<any> {
    return this.request<any>(`/api/chat/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  }

  // Gamification endpoints
  async getBadges(): Promise<any> {
    return this.request<any>('/api/gamification/badges', {
      method: 'GET',
    });
  }

  async getUserBadges(userId: string): Promise<any> {
    return this.request<any>(`/api/gamification/badges/user/${userId}`, {
      method: 'GET',
    });
  }

  async getLeaderboard(): Promise<any> {
    return this.request<any>('/api/gamification/leaderboard', {
      method: 'GET',
    });
  }

  async getWeeklyLeaderboard(): Promise<any> {
    return this.request<any>('/api/gamification/leaderboard/weekly', {
      method: 'GET',
    });
  }

  async getAchievements(): Promise<any> {
    return this.request<any>('/api/gamification/achievements', {
      method: 'GET',
    });
  }

  async getUserStreaks(userId: string): Promise<any> {
    return this.request<any>(`/api/gamification/streaks/user/${userId}`, {
      method: 'GET',
    });
  }

  // AI endpoints
  async aiAssignTasks(data: { tasks: any[]; teamMembers: any[]; criteria?: any }): Promise<any> {
    return this.request<any>('/api/ai/assign-tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async aiOptimizeSchedule(data: { tasks: any[]; constraints?: any; preferences?: any }): Promise<any> {
    return this.request<any>('/api/ai/optimize-schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async aiGetSuggestions(params?: { userId?: string; context?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/ai/suggestions?${queryString}` : '/api/ai/suggestions';
    
    return this.request<any>(endpoint, {
      method: 'GET',
    });
  }

  async aiAnalyzePerformance(data: { userId?: string; timeframe?: string; metrics?: any }): Promise<any> {
    return this.request<any>('/api/ai/analyze-performance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export types
export type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  ApiResponse, 
  Task, 
  CreateTaskRequest,
  TasksResponse,
  DashboardData, 
  DashboardStats 
};
