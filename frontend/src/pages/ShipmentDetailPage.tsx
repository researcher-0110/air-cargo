import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shipmentsApi } from '../api/shipments.api';
import { customersApi } from '../api/customers.api';
import type { ShipmentStatus } from '../types';
import { ArrowLeft, Clock } from 'lucide-react';

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new' || !id;

  const [form, setForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    description: '',
    customerId: '',
    estimatedDate: '',
  });

  const [statusForm, setStatusForm] = useState({ status: '', location: '', notes: '' });

  const { data: shipment } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => shipmentsApi.getOne(id!).then(r => r.data),
    enabled: !isNew,
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers-list'],
    queryFn: () => customersApi.getAll({ limit: 100 }).then(r => r.data),
  });

  useEffect(() => {
    if (shipment && !isNew) {
      setForm({
        origin: shipment.origin,
        destination: shipment.destination,
        weight: String(shipment.weight),
        length: shipment.length ? String(shipment.length) : '',
        width: shipment.width ? String(shipment.width) : '',
        height: shipment.height ? String(shipment.height) : '',
        description: shipment.description || '',
        customerId: shipment.customerId,
        estimatedDate: shipment.estimatedDate ? shipment.estimatedDate.slice(0, 10) : '',
      });
    }
  }, [shipment, isNew]);

  const createMutation = useMutation({
    mutationFn: (data: any) => shipmentsApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['shipments'] }); navigate('/shipments'); },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => shipmentsApi.update(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['shipments'] }); queryClient.invalidateQueries({ queryKey: ['shipment', id] }); },
  });

  const statusMutation = useMutation({
    mutationFn: (data: any) => shipmentsApi.updateStatus(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['shipment', id] }); setStatusForm({ status: '', location: '', notes: '' }); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      origin: form.origin,
      destination: form.destination,
      weight: parseFloat(form.weight),
      length: form.length ? parseFloat(form.length) : undefined,
      width: form.width ? parseFloat(form.width) : undefined,
      height: form.height ? parseFloat(form.height) : undefined,
      description: form.description || undefined,
      customerId: form.customerId,
      estimatedDate: form.estimatedDate || undefined,
    };
    if (isNew) createMutation.mutate(data);
    else updateMutation.mutate(data);
  };

  const statuses: ShipmentStatus[] = ['BOOKED', 'ACCEPTED', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'];

  return (
    <div>
      <button onClick={() => navigate('/shipments')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Shipments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isNew ? 'Create Shipment' : `Shipment ${shipment?.awbNumber || ''}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input type="text" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input type="text" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input type="number" step="0.1" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                  <input type="number" step="0.1" value={form.length} onChange={e => setForm({...form, length: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                  <input type="number" step="0.1" value={form.width} onChange={e => setForm({...form, width: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input type="number" step="0.1" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Customer</option>
                  {customersData?.data?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                  <input type="date" value={form.estimatedDate} onChange={e => setForm({...form, estimatedDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                {isNew ? 'Create Shipment' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {!isNew && shipment && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-3">
                <select value={statusForm.status} onChange={e => setStatusForm({...statusForm, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Status</option>
                  {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <input type="text" placeholder="Location (optional)" value={statusForm.location} onChange={e => setStatusForm({...statusForm, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Notes (optional)" value={statusForm.notes} onChange={e => setStatusForm({...statusForm, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <button onClick={() => { if (statusForm.status) statusMutation.mutate(statusForm); }} disabled={!statusForm.status || statusMutation.isPending} className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
                  Update Status
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
              <div className="space-y-4">
                {shipment.statusHistory?.map((update, i) => (
                  <div key={update.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                      {i < (shipment.statusHistory?.length || 0) - 1 && <div className="w-px h-full bg-gray-200 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-900">{update.status.replace('_', ' ')}</p>
                      {update.location && <p className="text-xs text-gray-500">{update.location}</p>}
                      {update.notes && <p className="text-xs text-gray-500">{update.notes}</p>}
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {!shipment.statusHistory?.length && <p className="text-sm text-gray-500">No status updates yet</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
