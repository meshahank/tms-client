import api from './axiosInstance'

export const salesApi = {
  create: (data) => api.post('/sales', data),
}
