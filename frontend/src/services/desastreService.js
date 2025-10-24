import api from './api';

const desastreService = {
  getAll: async () => {
    const response = await api.get('/desastres');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/desastres/${id}`);
    return response.data;
  },

  getFamiliasAfectadas: async (id) => {
    const response = await api.get(`/desastres/${id}/familias`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/desastres', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/desastres/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/desastres/${id}`);
    return response.data;
  }
};

export default desastreService;
