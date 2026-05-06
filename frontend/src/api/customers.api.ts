import api from './axios';
import type { Customer, PaginatedResponse } from '../types';

export const customersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Customer>>('/customers', { params }),
  getOne: (id: string) => api.get<Customer>(`/customers/${id}`),
  create: (data: any) => api.post<Customer>('/customers', data),
  update: (id: string, data: any) => api.patch<Customer>(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};
