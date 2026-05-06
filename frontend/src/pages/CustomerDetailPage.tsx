import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../api/customers.api';
import { ArrowLeft } from 'lucide-react';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new' || !id;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
  });

  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.getOne(id!).then(r => r.data),
    enabled: !isNew,
  });

  useEffect(() => {
    if (customer && !isNew) {
      setForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        company: customer.company || '',
        address: customer.address || '',
      });
    }
  }, [customer, isNew]);

  const createMutation = useMutation({
    mutationFn: (data: any) => customersApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); navigate('/customers'); },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => customersApi.update(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); queryClient.invalidateQueries({ queryKey: ['customer', id] }); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      company: form.company || undefined,
      address: form.address || undefined,
    };
    if (isNew) createMutation.mutate(data);
    else updateMutation.mutate(data);
  };

  return (
    <div>
      <button onClick={() => navigate('/customers')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </button>
      <div className="max-w-2xl">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isNew ? 'Create Customer' : 'Edit Customer'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {isNew ? 'Create Customer' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
