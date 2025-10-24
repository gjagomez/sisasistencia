import api from './api';

const articuloService = {
  // Artículos
  getAllArticulos: async () => {
    const response = await api.get('/articulos');
    return response.data;
  },

  getArticuloById: async (id) => {
    const response = await api.get(`/articulos/${id}`);
    return response.data;
  },

  createArticulo: async (data) => {
    const response = await api.post('/articulos', data);
    return response.data;
  },

  updateArticulo: async (id, data) => {
    const response = await api.put(`/articulos/${id}`, data);
    return response.data;
  },

  deleteArticulo: async (id) => {
    const response = await api.delete(`/articulos/${id}`);
    return response.data;
  },

  // Lotes
  getAllLotes: async () => {
    const response = await api.get('/articulos/lotes');
    return response.data;
  },

  getLotesByArticulo: async (idArticulo) => {
    const response = await api.get(`/articulos/${idArticulo}/lotes`);
    return response.data;
  },

  getLotesProximosVencer: async (dias = 30) => {
    const response = await api.get(`/articulos/lotes/proximos-vencer?dias=${dias}`);
    return response.data;
  },

  createLote: async (data) => {
    const response = await api.post('/articulos/lotes', data);
    return response.data;
  },

  updateCantidadLote: async (id, cantidad) => {
    const response = await api.put(`/articulos/lotes/${id}`, { cantidad_disponible: cantidad });
    return response.data;
  }
};

export default articuloService;
