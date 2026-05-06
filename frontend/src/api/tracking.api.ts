import api from './axios';

export const trackingApi = {
  track: (awbNumber: string) => api.get(`/tracking/${awbNumber}`),
};
