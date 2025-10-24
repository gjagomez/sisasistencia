const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todas las donaciones
const getAllDonaciones = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT d.id_donacion, 
              d.id_donador, 
              don.nombre AS nombre_donador,
              d.fecha_donacion, 
              d.tipo_donacion, 
              d.monto_monetario,
              d.descripcion_especie,   -- puedes incluirla sin problema
              d.destino
       FROM Donacion d
       LEFT JOIN Donador don ON d.id_donador = don.id_donador
       ORDER BY d.fecha_donacion DESC`,
      [],
      { 
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: { "DESCRIPCION_ESPECIE": { type: oracledb.STRING } }
      }
    );

    console.log('Resultado de la consulta:', result.rows);

    // Limpiar y serializar los datos de forma segura
    const cleanedData = result.rows.map(row => {
      const cleaned = {};
      for (const key in row) {
        const value = row[key];

        if (value instanceof Date) {
          cleaned[key] = value.toISOString();
        } else if (value === null || value === undefined) {
          cleaned[key] = null;
        } else {
          cleaned[key] = value;
        }
      }
      return cleaned;
    });

    res.json(cleanedData);

  } catch (err) {
    console.error('Error en getAllDonaciones:', err);
    res.status(500).json({
      message: 'Error al obtener donaciones',
      error: err.message || 'Error desconocido',
      details: err.errorNum || null
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err.message);
      }
    }
  }
};
// Obtener donaciones por donador
const getDonacionesByDonador = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_donacion, id_donador, fecha_donacion, tipo_donacion,
              monto_monetario, descripcion_especie, destino
       FROM Donacion
       WHERE id_donador = :id
       ORDER BY fecha_donacion DESC`,
      [req.params.id_donador],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const cleanedData = result.rows.map(row => ({
      ID_DONACION: row.ID_DONACION ?? null,
      ID_DONADOR: row.ID_DONADOR ?? null,
      FECHA_DONACION: row.FECHA_DONACION instanceof Date
        ? row.FECHA_DONACION.toISOString()
        : (row.FECHA_DONACION ?? null),
      TIPO_DONACION: row.TIPO_DONACION ?? null,
      MONTO_MONETARIO: row.MONTO_MONETARIO ?? null,
      DESCRIPCION_ESPECIE: row.DESCRIPCION_ESPECIE ?? null,
      DESTINO: row.DESTINO ?? null
    }));

    res.json(cleanedData);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener donaciones', error: err.message });
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

// Obtener una donación por ID
const getDonacionById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT d.id_donacion, d.id_donador, don.nombre as nombre_donador,
              d.fecha_donacion, d.tipo_donacion, d.monto_monetario,
              d.descripcion_especie, d.destino
       FROM Donacion d
       LEFT JOIN Donador don ON d.id_donador = don.id_donador
       WHERE d.id_donacion = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }

    const row = result.rows[0];
    const cleanedData = {
      ID_DONACION: row.ID_DONACION ?? null,
      ID_DONADOR: row.ID_DONADOR ?? null,
      NOMBRE_DONADOR: row.NOMBRE_DONADOR ?? null,
      FECHA_DONACION: row.FECHA_DONACION instanceof Date
        ? row.FECHA_DONACION.toISOString()
        : (row.FECHA_DONACION ?? null),
      TIPO_DONACION: row.TIPO_DONACION ?? null,
      MONTO_MONETARIO: row.MONTO_MONETARIO ?? null,
      DESCRIPCION_ESPECIE: row.DESCRIPCION_ESPECIE ?? null,
      DESTINO: row.DESTINO ?? null
    };

    res.json(cleanedData);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener donación', error: err.message });
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

// Crear una nueva donación
const createDonacion = async (req, res) => {
  let connection;
  const { id_donador, tipo_donacion, monto_monetario, descripcion_especie, destino } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO Donacion (id_donador, fecha_donacion, tipo_donacion, monto_monetario, descripcion_especie, destino)
       VALUES (:id_donador, SYSDATE, :tipo_donacion, :monto_monetario, :descripcion_especie, :destino)
       RETURNING id_donacion INTO :id`,
      {
        id_donador,
        tipo_donacion,
        monto_monetario: monto_monetario || null,
        descripcion_especie: descripcion_especie || null,
        destino: destino || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Donación registrada exitosamente',
      id_donacion: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear donación', error: err.message });
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

// Actualizar una donación
const updateDonacion = async (req, res) => {
  let connection;
  const { id_donador, tipo_donacion, monto_monetario, descripcion_especie, destino } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE Donacion
       SET id_donador = :id_donador,
           tipo_donacion = :tipo_donacion,
           monto_monetario = :monto_monetario,
           descripcion_especie = :descripcion_especie,
           destino = :destino
       WHERE id_donacion = :id`,
      {
        id_donador,
        tipo_donacion,
        monto_monetario: monto_monetario || null,
        descripcion_especie: descripcion_especie || null,
        destino: destino || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }

    res.json({ message: 'Donación actualizada exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar donación', error: err.message });
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

// Eliminar una donación
const deleteDonacion = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Donacion WHERE id_donacion = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }

    res.json({ message: 'Donación eliminada exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar donación', error: err.message });
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
  getAllDonaciones,
  getDonacionesByDonador,
  getDonacionById,
  createDonacion,
  updateDonacion,
  deleteDonacion
};
