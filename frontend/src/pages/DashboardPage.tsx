import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { Package, Users, Truck, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then(r => r.data),
  });

  const { data: activity } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardApi.getRecentActivity().then(r => r.data),
  });

  if (isLoading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  const statCards = [
    { label: 'Total Shipments', value: stats?.totalShipments || 0, icon: Package, color: 'blue' },
    { label: 'Active Shipments', value: stats?.activeShipments || 0, icon: Truck, color: 'amber' },
    { label: 'Delivered', value: stats?.deliveredShipments || 0, icon: CheckCircle, color: 'green' },
    { label: 'Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${colorMap[card.color]}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Shipments</h2>
          <div className="space-y-3">
            {activity?.recentShipments?.slice(0, 5).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.awbNumber}</p>
                  <p className="text-xs text-gray-500">{s.origin} → {s.destination}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(s.status)}`}>
                  {s.status.replace('_', ' ')}
                </span>
              </div>
            )) || <p className="text-sm text-gray-500">No recent shipments</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {stats?.statusBreakdown?.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.status.replace('_', ' ')}</span>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            )) || <p className="text-sm text-gray-500">No data</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    BOOKED: 'bg-gray-100 text-gray-700',
    ACCEPTED: 'bg-blue-100 text-blue-700',
    IN_TRANSIT: 'bg-amber-100 text-amber-700',
    ARRIVED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
