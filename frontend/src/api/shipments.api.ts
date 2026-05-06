import api from './axios';
import type { Shipment, PaginatedResponse } from '../types';

export const shipmentsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get<PaginatedResponse<Shipment>>('/shipments', { params }),
  getOne: (id: string) => api.get<Shipment>(`/shipments/${id}`),
  create: (data: any) => api.post<Shipment>('/shipments', data),
  update: (id: string, data: any) => api.patch<Shipment>(`/shipments/${id}`, data),
  updateStatus: (id: string, data: { status: string; location?: string; notes?: string }) =>
    api.post<Shipment>(`/shipments/${id}/status`, data),
  delete: (id: string) => api.delete(`/shipments/${id}`),
};
