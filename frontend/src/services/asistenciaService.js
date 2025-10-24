import api from './api';

const asistenciaService = {
  getAll: async () => {
    const response = await api.get('/asistencias');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/asistencias/${id}`);
    return response.data;
  },

  getByFamilia: async (idFamilia) => {
    const response = await api.get(`/asistencias/familia/${idFamilia}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/asistencias', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/asistencias/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/asistencias/${id}`);
    return response.data;
  }
};

export default asistenciaService;
