const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verifySession);
router.get('/users', authController.getAllUsers); // TEMPORAL - Ver todos los usuarios

module.exports = router;
