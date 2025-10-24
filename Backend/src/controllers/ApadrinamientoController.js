const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todos los apadrinamientos
const getAllApadrinamientos = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT a.id_apadrinamiento, a.id_donador, d.nombre as nombre_padrino,
              a.id_familia, f.jefe_familia, a.fecha_inicio, a.fecha_fin, a.estado
       FROM Apadrinamiento a
       LEFT JOIN Donador d ON a.id_donador = d.id_donador
       LEFT JOIN FamiliaBeneficiadas f ON a.id_familia = f.id_familia
       ORDER BY a.fecha_inicio DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener apadrinamientos', error: err.message });
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

// Obtener apadrinamientos activos
const getApadrinamientosActivos = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT a.id_apadrinamiento, a.id_donador, d.nombre as nombre_padrino,
              a.id_familia, f.jefe_familia, f.cantidad_miembros, a.fecha_inicio, a.estado
       FROM Apadrinamiento a
       LEFT JOIN Donador d ON a.id_donador = d.id_donador
       LEFT JOIN FamiliaBeneficiadas f ON a.id_familia = f.id_familia
       WHERE a.estado = 'Activo'
       ORDER BY a.fecha_inicio DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener apadrinamientos activos', error: err.message });
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

// Obtener apadrinamiento por ID
const getApadrinamientoById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT a.id_apadrinamiento, a.id_donador, d.nombre as nombre_padrino, d.email, d.telefono,
              a.id_familia, f.jefe_familia, f.cantidad_miembros, f.direccion, f.municipio,
              a.fecha_inicio, a.fecha_fin, a.estado
       FROM Apadrinamiento a
       LEFT JOIN Donador d ON a.id_donador = d.id_donador
       LEFT JOIN FamiliaBeneficiadas f ON a.id_familia = f.id_familia
       WHERE a.id_apadrinamiento = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apadrinamiento no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener apadrinamiento', error: err.message });
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

// Crear un nuevo apadrinamiento
const createApadrinamiento = async (req, res) => {
  let connection;
  const { id_donador, id_familia, estado } = req.body;

  try {
    connection = await db.getConnection();

    // Actualizar familia como apadrinada
    await connection.execute(
      `UPDATE FamiliaBeneficiadas SET es_apadrinada = 'Sí' WHERE id_familia = :id_familia`,
      [id_familia],
      { autoCommit: false }
    );

    const result = await connection.execute(
      `INSERT INTO Apadrinamiento (id_donador, id_familia, fecha_inicio, estado)
       VALUES (:id_donador, :id_familia, SYSDATE, :estado)
       RETURNING id_apadrinamiento INTO :id`,
      {
        id_donador,
        id_familia,
        estado: estado || 'Activo',
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Apadrinamiento registrado exitosamente',
      id_apadrinamiento: result.outBinds.id[0]
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    res.status(400).json({ message: 'Error al crear apadrinamiento', error: err.message });
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

// Finalizar un apadrinamiento
const finalizarApadrinamiento = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();

    // Obtener información del apadrinamiento
    const apadrinamiento = await connection.execute(
      `SELECT id_familia FROM Apadrinamiento WHERE id_apadrinamiento = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (apadrinamiento.rows.length === 0) {
      return res.status(404).json({ message: 'Apadrinamiento no encontrado' });
    }

    // Finalizar apadrinamiento
    await connection.execute(
      `UPDATE Apadrinamiento
       SET fecha_fin = SYSDATE, estado = 'Finalizado'
       WHERE id_apadrinamiento = :id`,
      [req.params.id],
      { autoCommit: false }
    );

    // Actualizar familia como no apadrinada
    await connection.execute(
      `UPDATE FamiliaBeneficiadas SET es_apadrinada = 'No' WHERE id_familia = :id_familia`,
      [apadrinamiento.rows[0].ID_FAMILIA],
      { autoCommit: true }
    );

    res.json({ message: 'Apadrinamiento finalizado exitosamente' });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    res.status(400).json({ message: 'Error al finalizar apadrinamiento', error: err.message });
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

// Eliminar un apadrinamiento
const deleteApadrinamiento = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Apadrinamiento WHERE id_apadrinamiento = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Apadrinamiento no encontrado' });
    }

    res.json({ message: 'Apadrinamiento eliminado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar apadrinamiento', error: err.message });
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
  getAllApadrinamientos,
  getApadrinamientosActivos,
  getApadrinamientoById,
  createApadrinamiento,
  finalizarApadrinamiento,
  deleteApadrinamiento
};
