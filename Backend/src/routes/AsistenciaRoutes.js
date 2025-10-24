const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/AsistenciaController');

router.get('/', asistenciaController.getAllAsistencias);
router.get('/familia/:id_familia', asistenciaController.getAsistenciasByFamilia);
router.get('/:id', asistenciaController.getAsistenciaById);
router.post('/', asistenciaController.createAsistencia);
router.put('/:id', asistenciaController.updateAsistencia);
router.delete('/:id', asistenciaController.deleteAsistencia);

module.exports = router;
