const express = require('express');
const router = express.Router();
const beneficiadoController = require('../controllers/BeneficiadoController');

router.get('/', beneficiadoController.getAllBeneficiados);
router.get('/familia/:id_familia', beneficiadoController.getBeneficiadosByFamilia);
router.get('/:id', beneficiadoController.getBeneficiadoById);
router.post('/', beneficiadoController.createBeneficiado);
router.put('/:id', beneficiadoController.updateBeneficiado);
router.delete('/:id', beneficiadoController.deleteBeneficiado);

module.exports = router;
