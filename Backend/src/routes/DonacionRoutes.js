const express = require('express');
const router = express.Router();
const donacionController = require('../controllers/DonacionController');

router.get('/', donacionController.getAllDonaciones);
router.get('/donador/:id_donador', donacionController.getDonacionesByDonador);
router.get('/:id', donacionController.getDonacionById);
router.post('/', donacionController.createDonacion);
router.put('/:id', donacionController.updateDonacion);
router.delete('/:id', donacionController.deleteDonacion);

module.exports = router;
