import api from './api';

const donadorService = {
  getAll: async () => {
    const response = await api.get('/donadores');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/donadores/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/donadores', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/donadores/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/donadores/${id}`);
    return response.data;
  }
};

export default donadorService;
