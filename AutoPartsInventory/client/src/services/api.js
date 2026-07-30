import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://supervent.onrender.com/api');

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventoryApi = {
  getAll: (params) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  getStats: () => api.get('/inventory/stats'),
  getLowStock: () => api.get('/inventory/low-stock'),
  getLocations: () => api.get('/inventory/locations'),
  sell: (id, quantity) => api.patch(`/inventory/${id}/sell`, { quantity }),
  restock: (id, addQuantity) => api.patch(`/inventory/${id}/restock`, { addQuantity }),
  restore: (id, addQuantity) => api.patch(`/inventory/${id}/restock`, { addQuantity }),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const supplierApi = {
  getAll: () => api.get('/suppliers'),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export default api;
