import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3001/api';

// Task type
export interface Task {
  _id?: string; // MongoDB ObjectId
  task_id?: number; // Legacy ID field
  user_id?: number;
  title: string;
  description?: string;
  due_date?: string;
  task_type: 'assignment' | 'exam' | 'daily';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

// Task oluşturma tipi
export interface TaskCreateData {
  title: string;
  description?: string;
  due_date?: string;
  task_type: 'assignment' | 'exam' | 'daily';
  status?: 'pending' | 'in_progress' | 'completed';
}

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekle birlikte token ekleme
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token süresi dolduğunda otomatik logout
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token süresi dolmuş veya geçersiz
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  updateProfile: async (data: { username: string; email: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', { currentPassword, newPassword });
    return response.data;
  }
};

// Task servisleri
export const taskService = {
  createTask: async (taskData: TaskCreateData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  getTasks: async (params?: Record<string, string>) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  
  getTaskById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  updateTask: async (id: string, taskData: Partial<TaskCreateData>) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  updateTaskStatus: async (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },
  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api; 