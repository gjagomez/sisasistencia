const express = require('express');
const router = express.Router();
const familiaController = require('../controllers/FamiliaController');

router.get('/', familiaController.getAllFamilias);
router.get('/apadrinadas', familiaController.getFamiliasApadrinadas);
router.get('/:id', familiaController.getFamiliaById);
router.post('/', familiaController.createFamilia);
router.put('/:id', familiaController.updateFamilia);
router.delete('/:id', familiaController.deleteFamilia);

module.exports = router;
