import api from './api';

const estadisticasService = {
  getDashboardStats: async () => {
    const response = await api.get('/estadisticas/dashboard');
    return response.data;
  },

  getDonacionesPorMes: async (anio) => {
    const response = await api.get(`/estadisticas/donaciones-mes?anio=${anio || new Date().getFullYear()}`);
    return response.data;
  },

  getEstadisticasDesastres: async () => {
    const response = await api.get('/estadisticas/desastres');
    return response.data;
  },

  getTopDonadores: async (limite = 10) => {
    const response = await api.get(`/estadisticas/top-donadores?limite=${limite}`);
    return response.data;
  },

  getInventarioDisponible: async () => {
    const response = await api.get('/estadisticas/inventario');
    return response.data;
  },

  getAsistenciasPorTipo: async () => {
    const response = await api.get('/estadisticas/asistencias-tipo');
    return response.data;
  },

  getDistribucionGeografica: async () => {
    const response = await api.get('/estadisticas/distribucion-geografica');
    return response.data;
  }
};

export default estadisticasService;
