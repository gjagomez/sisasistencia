const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todos los fondos
const getAllFondos = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT id_fondo, nombre_fondo, saldo, ultima_actualizacion, descripcion
       FROM Fondos
       ORDER BY id_fondo`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: { DESCRIPCION: { type: oracledb.STRING } }, // 👈 clave
      }
    );

    // Limpiar los datos antes de devolver
    const rows = result.rows.map((row) => {
      const cleanRow = {};
      for (const key in row) {
        const value = row[key];
        if (value instanceof Date) cleanRow[key] = value.toISOString();
        else cleanRow[key] = value;
      }
      return cleanRow;
    });

    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener fondos:", err);
    res.status(500).json({
      message: "Error al obtener fondos",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error cerrando conexión:", err);
      }
    }
  }
};

// Obtener fondo por ID
const getFondoById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_fondo, nombre_fondo, saldo, ultima_actualizacion, descripcion
       FROM Fondos
       WHERE id_fondo = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fondo no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener fondo', error: err.message });
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

// Crear un nuevo fondo
const createFondo = async (req, res) => {
  let connection;
  const { nombre_fondo, saldo, descripcion } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO Fondos (nombre_fondo, saldo, ultima_actualizacion, descripcion)
       VALUES (:nombre_fondo, :saldo, SYSTIMESTAMP, :descripcion)
       RETURNING id_fondo INTO :id`,
      {
        nombre_fondo,
        saldo: saldo || 0,
        descripcion: descripcion || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Fondo creado exitosamente',
      id_fondo: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear fondo', error: err.message });
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

// Actualizar saldo del fondo (incrementar o decrementar)
const updateSaldoFondo = async (req, res) => {
  let connection;
  const { monto, operacion } = req.body; // operacion: 'incrementar' o 'decrementar'

  try {
    connection = await db.getConnection();

    let query;
    if (operacion === 'incrementar') {
      query = `UPDATE Fondos
               SET saldo = saldo + :monto,
                   ultima_actualizacion = SYSTIMESTAMP
               WHERE id_fondo = :id`;
    } else if (operacion === 'decrementar') {
      query = `UPDATE Fondos
               SET saldo = saldo - :monto,
                   ultima_actualizacion = SYSTIMESTAMP
               WHERE id_fondo = :id`;
    } else {
      return res.status(400).json({ message: 'Operación inválida. Use "incrementar" o "decrementar"' });
    }

    const result = await connection.execute(
      query,
      { monto, id: req.params.id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Fondo no encontrado' });
    }

    res.json({ message: 'Saldo actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar saldo', error: err.message });
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

// Actualizar información del fondo
const updateFondo = async (req, res) => {
  let connection;
  const { nombre_fondo, descripcion } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE Fondos
       SET nombre_fondo = :nombre_fondo,
           descripcion = :descripcion,
           ultima_actualizacion = SYSTIMESTAMP
       WHERE id_fondo = :id`,
      {
        nombre_fondo,
        descripcion: descripcion || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Fondo no encontrado' });
    }

    res.json({ message: 'Fondo actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar fondo', error: err.message });
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

// Eliminar un fondo
const deleteFondo = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Fondos WHERE id_fondo = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Fondo no encontrado' });
    }

    res.json({ message: 'Fondo eliminado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar fondo', error: err.message });
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
  getAllFondos,
  getFondoById,
  createFondo,
  updateSaldoFondo,
  updateFondo,
  deleteFondo
};
