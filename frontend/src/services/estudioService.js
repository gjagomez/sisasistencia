import api from './api';

const estudioService = {
  getAll: async () => {
    const response = await api.get('/estudios');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/estudios/${id}`);
    return response.data;
  },

  getByFamilia: async (idFamilia) => {
    const response = await api.get(`/estudios/familia/${idFamilia}`);
    return response.data;
  },

  getUltimoByFamilia: async (idFamilia) => {
    const response = await api.get(`/estudios/familia/${idFamilia}/ultimo`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/estudios', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/estudios/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/estudios/${id}`);
    return response.data;
  }
};

export default estudioService;
