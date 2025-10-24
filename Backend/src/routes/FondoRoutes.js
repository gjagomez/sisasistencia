const express = require('express');
const router = express.Router();
const fondoController = require('../controllers/FondoController');

router.get('/', fondoController.getAllFondos);
//router.get('/:id', fondoController.getFondoById);
router.post('/', fondoController.createFondo);
router.put('/:id/saldo', fondoController.updateSaldoFondo);
router.put('/:id', fondoController.updateFondo);
router.delete('/:id', fondoController.deleteFondo);

module.exports = router;
