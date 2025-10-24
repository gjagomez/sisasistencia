const express = require('express');
const router = express.Router();
const desastreController = require('../controllers/DesastreController');

router.get('/', desastreController.getAllDesastres);
router.get('/:id', desastreController.getDesastreById);
router.get('/:id/familias', desastreController.getFamiliasAfectadas);
router.post('/', desastreController.createDesastre);
router.put('/:id', desastreController.updateDesastre);
router.delete('/:id', desastreController.deleteDesastre);

module.exports = router;
