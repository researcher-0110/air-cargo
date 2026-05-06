export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  createdAt: string;
  _count?: { shipments: number };
}

export type ShipmentStatus = 'BOOKED' | 'ACCEPTED' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED';

export interface Shipment {
  id: string;
  awbNumber: string;
  origin: string;
  destination: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  status: ShipmentStatus;
  description?: string;
  customerId: string;
  customer?: { id: string; name: string; company?: string };
  bookedDate: string;
  estimatedDate?: string;
  deliveredDate?: string;
  createdAt: string;
  statusHistory?: StatusUpdate[];
}

export interface StatusUpdate {
  id: string;
  status: ShipmentStatus;
  location?: string;
  notes?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface DashboardStats {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  totalCustomers: number;
  statusBreakdown: { status: string; count: number }[];
}
