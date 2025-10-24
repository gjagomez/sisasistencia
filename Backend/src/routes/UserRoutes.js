// src/routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      'SELECT id_usuario, nombre_usuario, rol FROM Usuarios'
    );
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
  const { nombre_usuario, password, rol } = req.body;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO Usuarios (nombre_usuario, password, rol, fecha_creacion, estado) 
       VALUES (:nombre_usuario, :password, :rol, SYSDATE, 'Activo')`,
      [nombre_usuario, password, rol],
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

module.exports = router;
