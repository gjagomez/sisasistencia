const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/ArticuloController');

// Rutas de Artículos
router.get('/', articuloController.getAllArticulos);
//router.get('/:id', articuloController.getArticuloById);
router.post('/', articuloController.createArticulo);
router.put('/:id', articuloController.updateArticulo);
router.delete('/:id', articuloController.deleteArticulo);

// Rutas de Lotes (IMPORTANTE: Las rutas más específicas van primero)
router.get('/lotes/proximos-vencer', articuloController.getLotesProximosVencer);
router.get('/lotes', articuloController.getAllLotes);
router.post('/lotes', articuloController.createLote);
router.put('/lotes/:id', articuloController.updateCantidadLote);
router.get('/:id_articulo/lotes', articuloController.getLotesByArticulo);

module.exports = router;
