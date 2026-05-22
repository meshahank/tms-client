import api from './axiosInstance'

export const menuApi = {
  getAll: (activeOnly = false) => api.get('/menu', { params: activeOnly ? { active: true } : undefined }),
  create: (data) => api.post('/menu', data),
  toggleActive: (id, isActive) => api.patch(`/menu/${id}`, { isActive }),
  remove: (id) => api.delete(`/menu/${id}`),
}
