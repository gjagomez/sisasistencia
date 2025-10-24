import api from './api';

/**
 * Servicio para acceder a los reportes del sistema
 */
const reportesService = {
  /**
   * Obtener el reporte completo de donaciones y fondos
   */
  getReporteDonacionesFondos: async () => {
    const response = await api.get('/reportes/donaciones-fondos');
    return response.data;
  },

  /**
   * Obtener el resumen del estado de los fondos
   */
  getResumenFondos: async () => {
    const response = await api.get('/reportes/resumen-fondos');
    return response.data;
  },

  /**
   * Obtener estadísticas de donaciones por período
   */
  getEstadisticasDonaciones: async () => {
    const response = await api.get('/reportes/estadisticas-donaciones');
    return response.data;
  },

  /**
   * Obtener top donadores (ranking)
   * @param {number} limite - Número máximo de donadores a retornar (default: 10)
   */
  getTopDonadores: async (limite = 10) => {
    const response = await api.get(`/reportes/top-donadores?limite=${limite}`);
    return response.data;
  },

  /**
   * Obtener reporte consolidado con toda la información
   */
  getReporteConsolidado: async () => {
    const response = await api.get('/reportes/consolidado');
    return response.data;
  }
};

export default reportesService;
