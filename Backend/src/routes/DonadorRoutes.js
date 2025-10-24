const express = require('express');
const router = express.Router();
const donadorController = require('../controllers/DonadorController');

router.get('/', donadorController.getAllDonadores);
router.get('/:id', donadorController.getDonadorById);
router.post('/', donadorController.createDonador);
router.put('/:id', donadorController.updateDonador);
router.delete('/:id', donadorController.deleteDonador);

module.exports = router;
