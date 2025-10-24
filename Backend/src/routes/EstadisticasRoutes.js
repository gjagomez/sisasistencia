const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/EstadisticasController');

router.get('/dashboard', estadisticasController.getDashboardStats);
router.get('/donaciones-mes', estadisticasController.getDonacionesPorMes);
router.get('/desastres', estadisticasController.getEstadisticasDesastres);
router.get('/top-donadores', estadisticasController.getTopDonadores);
router.get('/inventario', estadisticasController.getInventarioDisponible);
router.get('/asistencias-tipo', estadisticasController.getAsistenciasPorTipo);
router.get('/distribucion-geografica', estadisticasController.getDistribucionGeografica);

module.exports = router;
