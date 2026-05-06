import api from './axios';
import type { DashboardStats } from '../types';

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
};
