import api from './axiosInstance'

export const salesApi = {
  create: (data) => api.post('/sales', data),
  getDailySummary: () => api.get('/sales/summary/today'),
  exportReport: (from, to) => api.get('/sales/report/export', { 
    params: { from, to }, 
    responseType: 'blob' 
  }),
  getItemAnalytics: (range = 'week') => api.get('/sales/analytics/items', { params: { range } }),
}
