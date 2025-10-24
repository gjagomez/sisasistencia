import api from './api';

const beneficiadoService = {
  getAll: async () => {
    const response = await api.get('/beneficiados');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/beneficiados/${id}`);
    return response.data;
  },

  getByFamilia: async (idFamilia) => {
    const response = await api.get(`/beneficiados/familia/${idFamilia}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/beneficiados', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/beneficiados/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/beneficiados/${id}`);
    return response.data;
  }
};

export default beneficiadoService;
