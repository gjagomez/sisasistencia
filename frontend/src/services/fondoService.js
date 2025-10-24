import api from './api';

const fondoService = {
  getAll: async () => {
    const response = await api.get('/fondos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/fondos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/fondos', data);
    return response.data;
  },

  updateSaldo: async (id, monto, operacion) => {
    const response = await api.put(`/fondos/${id}/saldo`, { monto, operacion });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/fondos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/fondos/${id}`);
    return response.data;
  }
};

export default fondoService;
