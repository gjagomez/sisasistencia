import api from './api';

const familiaService = {
  getAll: async () => {
    const response = await api.get('/familias');
    return response.data;
  },

  getApadrinadas: async () => {
    const response = await api.get('/familias/apadrinadas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/familias/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/familias', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/familias/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/familias/${id}`);
    return response.data;
  }
};

export default familiaService;
