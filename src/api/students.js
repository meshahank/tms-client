import api from './axiosInstance'

export const studentsApi = {
  getAll: (params) => api.get('/students', { params }),
  getByClass: (classCode) => api.get('/students', { params: { class: classCode } }),
  lookup: (admNo) => api.get('/students/lookup', { params: { admNo } }),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  remove: (id) => api.delete(`/students/${id}`),
  importRows: (rows) => api.post('/students/import', { rows }),
  exportFile: () => api.get('/students/export', { responseType: 'blob' }),
  recharge: (id, amount, note = '') => api.post(`/students/${id}/recharge`, { amount, note }),
  bulkRecharge: (rows) => api.post('/students/bulk-recharge', { rows }),
  getDebtors: () => api.get('/students/debtors'),
}
