import { useState } from 'react';
import { trackingApi } from '../api/tracking.api';
import { Search, Plane, Clock, MapPin } from 'lucide-react';

export default function TrackingPage() {
  const [awb, setAwb] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awb.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await trackingApi.track(awb.trim());
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      BOOKED: 'bg-gray-100 text-gray-700',
      ACCEPTED: 'bg-blue-100 text-blue-700',
      IN_TRANSIT: 'bg-amber-100 text-amber-700',
      ARRIVED: 'bg-purple-100 text-purple-700',
      DELIVERED: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Plane className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Track Shipment</h1>
        </div>
        <p className="text-gray-500">Enter your AWB number to track your shipment</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="e.g. AWB-20260507-1234"
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{result.awbNumber}</h2>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(result.status)}`}>
                {result.status.replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Origin</p>
                <p className="font-medium text-gray-900">{result.origin}</p>
              </div>
              <div>
                <p className="text-gray-500">Destination</p>
                <p className="font-medium text-gray-900">{result.destination}</p>
              </div>
              <div>
                <p className="text-gray-500">Weight</p>
                <p className="font-medium text-gray-900">{result.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-500">Booked Date</p>
                <p className="font-medium text-gray-900">{new Date(result.bookedDate).toLocaleDateString()}</p>
              </div>
              {result.customer && (
                <div>
                  <p className="text-gray-500">Shipper</p>
                  <p className="font-medium text-gray-900">{result.customer.company || result.customer.name}</p>
                </div>
              )}
              {result.estimatedDate && (
                <div>
                  <p className="text-gray-500">Estimated Delivery</p>
                  <p className="font-medium text-gray-900">{new Date(result.estimatedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tracking History</h3>
            <div className="space-y-4">
              {result.statusHistory?.map((update: any, i: number) => (
                <div key={update.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    {i < result.statusHistory.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900">{update.status.replace('_', ' ')}</p>
                    {update.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{update.location}</p>
                    )}
                    {update.notes && <p className="text-xs text-gray-500">{update.notes}</p>}
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
