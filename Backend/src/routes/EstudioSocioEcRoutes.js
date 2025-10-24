const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/EstudioSocioEcController');

router.get('/', estudioController.getAllEstudios);
router.get('/familia/:id_familia', estudioController.getEstudiosByFamilia);
router.get('/familia/:id_familia/ultimo', estudioController.getUltimoEstudioFamilia);
router.get('/:id', estudioController.getEstudioById);
router.post('/', estudioController.createEstudio);
router.put('/:id', estudioController.updateEstudio);
router.delete('/:id', estudioController.deleteEstudio);

module.exports = router;
