const express = require('express');
const router = express.Router();
const apadrinamientoController = require('../controllers/ApadrinamientoController');

router.get('/', apadrinamientoController.getAllApadrinamientos);
router.get('/activos', apadrinamientoController.getApadrinamientosActivos);
router.get('/:id', apadrinamientoController.getApadrinamientoById);
router.post('/', apadrinamientoController.createApadrinamiento);
router.put('/:id/finalizar', apadrinamientoController.finalizarApadrinamiento);
router.delete('/:id', apadrinamientoController.deleteApadrinamiento);

module.exports = router;
