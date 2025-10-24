import api from './api';

const donacionService = {
  getAll: async () => {
    const response = await api.get('/donaciones');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/donaciones/${id}`);
    return response.data;
  },

  getByDonador: async (idDonador) => {
    const response = await api.get(`/donaciones/donador/${idDonador}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/donaciones', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/donaciones/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/donaciones/${id}`);
    return response.data;
  }
};

export default donacionService;
