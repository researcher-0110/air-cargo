import api from './axios';
import type { User } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<{ access_token: string }>('/auth/register', { name, email, password }),
  getProfile: () => api.get<User>('/auth/profile'),
};
