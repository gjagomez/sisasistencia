import api from './api';

const apadrinamientoService = {
  getAll: async () => {
    const response = await api.get('/apadrinamientos');
    return response.data;
  },

  getActivos: async () => {
    const response = await api.get('/apadrinamientos/activos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/apadrinamientos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/apadrinamientos', data);
    return response.data;
  },

  finalizar: async (id) => {
    const response = await api.put(`/apadrinamientos/${id}/finalizar`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/apadrinamientos/${id}`);
    return response.data;
  }
};

export default apadrinamientoService;
