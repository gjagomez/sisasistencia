const express = require('express');
const router = express.Router();
const {
  getReporteDonacionesFondos,
  getResumenFondos,
  getEstadisticasDonaciones,
  getTopDonadores,
  getReporteConsolidado
} = require('../controllers/ReportesController');

/**
 * @route   GET /api/reportes/donaciones-fondos
 * @desc    Obtener el reporte completo de donaciones y fondos
 * @access  Public (o Private si implementas autenticación)
 */
router.get('/donaciones-fondos', getReporteDonacionesFondos);

/**
 * @route   GET /api/reportes/resumen-fondos
 * @desc    Obtener el resumen del estado de todos los fondos
 * @access  Public
 */
router.get('/resumen-fondos', getResumenFondos);

/**
 * @route   GET /api/reportes/estadisticas-donaciones
 * @desc    Obtener estadísticas de donaciones por período
 * @access  Public
 */
router.get('/estadisticas-donaciones', getEstadisticasDonaciones);

/**
 * @route   GET /api/reportes/top-donadores
 * @desc    Obtener top donadores (ranking)
 * @query   limite - número máximo de donadores a retornar (default: 10)
 * @access  Public
 */
router.get('/top-donadores', getTopDonadores);

/**
 * @route   GET /api/reportes/consolidado
 * @desc    Obtener reporte consolidado con toda la información
 * @access  Public
 */
router.get('/consolidado', getReporteConsolidado);

module.exports = router;
