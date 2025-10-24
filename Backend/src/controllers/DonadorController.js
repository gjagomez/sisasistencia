const db = require('../config/db');
const oracledb = require('oracledb');

// Obtener todos los donadores
const getAllDonadores = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_donador, tipo_donador, nombre, dpi, nit, telefono, email, direccion
       FROM Donador
       ORDER BY id_donador DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener donadores', error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

// Obtener un donador por ID
const getDonadorById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_donador, tipo_donador, nombre, dpi, nit, telefono, email, direccion
       FROM Donador
       WHERE id_donador = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donador no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener donador', error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

// Crear un nuevo donador
const createDonador = async (req, res) => {
  let connection;
  const { tipo_donador, nombre, dpi, nit, telefono, email, direccion } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO Donador (tipo_donador, nombre, dpi, nit, telefono, email, direccion)
       VALUES (:tipo_donador, :nombre, :dpi, :nit, :telefono, :email, :direccion)
       RETURNING id_donador INTO :id`,
      {
        tipo_donador,
        nombre,
        dpi: dpi || null,
        nit: nit || null,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Donador creado exitosamente',
      id_donador: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Error al crear donador:', err);
    res.status(400).json({ message: 'Error al crear donador', error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

// Actualizar un donador
const updateDonador = async (req, res) => {
  let connection;
  const { tipo_donador, nombre, dpi, nit, telefono, email, direccion } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE Donador
       SET tipo_donador = :tipo_donador,
           nombre = :nombre,
           dpi = :dpi,
           nit = :nit,
           telefono = :telefono,
           email = :email,
           direccion = :direccion
       WHERE id_donador = :id`,
      {
        tipo_donador,
        nombre,
        dpi: dpi || null,
        nit: nit || null,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Donador no encontrado' });
    }

    res.json({ message: 'Donador actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar donador', error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

// Eliminar un donador
const deleteDonador = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Donador WHERE id_donador = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Donador no encontrado' });
    }

    res.json({ message: 'Donador eliminado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar donador', error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports = {
  getAllDonadores,
  getDonadorById,
  createDonador,
  updateDonador,
  deleteDonador
};
