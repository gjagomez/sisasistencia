const oracledb = require('oracledb');
const db = require('../config/db');

const getAllAsistencias = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT a.id_asistencia, a.id_familia, f.jefe_familia,
              a.fecha_entrega, a.tipo_asistencia, a.id_lote,
              art.nombre_articulo, a.cantidad_entregada, a.valor_estimado,
              a.observaciones
       FROM Asistencia a
       LEFT JOIN FAMILIABENEFICIADAS f ON a.id_familia = f.id_familia
       LEFT JOIN lotearticulo l ON a.id_lote = l.id_lote
       LEFT JOIN Articulo art ON l.id_articulo = art.id_articulo
       ORDER BY a.fecha_entrega DESC`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: { OBSERVACIONES: { type: oracledb.STRING } }
      }
    );

    // NO hagas console.log(result) ni res.json(result)
    console.log('Total filas:', result.rows.length);

    const plainRows = result.rows.map((row) => {
      const clean = {};
      for (const k in row) {
        const v = row[k];
        if (v instanceof Date) {
          clean[k] = v.toISOString();
        } else if (k === 'OBSERVACIONES' && typeof v === 'string') {
          // Si el CLOB trae JSON, lo parseamos; si no, lo dejamos como texto
          try {
            clean[k] = JSON.parse(v);
          } catch {
            clean[k] = v;
          }
        } else {
          clean[k] = v;
        }
      }
      return clean;
    });

    // Doble-aseguramiento: clonar a JSON plano
    res.json(JSON.parse(JSON.stringify(plainRows)));
  } catch (err) {
    console.error('❌ Error al obtener asistencias:', err?.message || err);
    res.status(500).json({
      message: 'Error al obtener asistencias',
      error: err?.message || String(err),
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error('Error cerrando conexión:', e); }
    }
  }
};

// Obtener asistencias por familia
const getAsistenciasByFamilia = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT a.id_asistencia, a.fecha_entrega, a.tipo_asistencia,
              a.id_lote, art.nombre_articulo, a.cantidad_entregada,
              a.valor_estimado, a.observaciones
       FROM Asistencia a
       LEFT JOIN Lote l ON a.id_lote = l.id_lote
       LEFT JOIN Articulo art ON l.id_articulo = art.id_articulo
       WHERE a.id_familia = :id_familia
       ORDER BY a.fecha_entrega DESC`,
      [req.params.id_familia],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener asistencias', error: err.message });
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

// Obtener asistencia por ID
const getAsistenciaById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT a.id_asistencia, a.id_familia, f.jefe_familia,
              a.fecha_entrega, a.tipo_asistencia, a.id_lote,
              art.nombre_articulo, a.cantidad_entregada, a.valor_estimado,
              a.observaciones
       FROM Asistencia a
       LEFT JOIN Familia f ON a.id_familia = f.id_familia
       LEFT JOIN Lote l ON a.id_lote = l.id_lote
       LEFT JOIN Articulo art ON l.id_articulo = art.id_articulo
       WHERE a.id_asistencia = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener asistencia', error: err.message });
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

// Registrar una nueva asistencia
const createAsistencia = async (req, res) => {
  let connection;
  const { id_familia, tipo_asistencia, id_lote, cantidad_entregada, valor_estimado, observaciones } = req.body;

  try {
    connection = await db.getConnection();

    // Verificar disponibilidad en el lote
    if (id_lote) {
      const loteCheck = await connection.execute(
        `SELECT cantidad_disponible FROM lotearticulo WHERE id_lote = :id_lote`,
        [id_lote],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (loteCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Lote no encontrado' });
      }

      if (loteCheck.rows[0].CANTIDAD_DISPONIBLE < cantidad_entregada) {
        return res.status(400).json({ message: 'Cantidad insuficiente en el lote' });
      }

      // Actualizar cantidad disponible en el lote
      await connection.execute(
        `UPDATE lotearticulo
         SET cantidad_disponible = cantidad_disponible - :cantidad
         WHERE id_lote = :id_lote`,
        { cantidad: cantidad_entregada, id_lote },
        { autoCommit: false }
      );
    }

    // Registrar la asistencia
    const result = await connection.execute(
      `INSERT INTO Asistencia (id_familia, fecha_entrega, tipo_asistencia, id_lote, cantidad_entregada, valor_estimado, observaciones)
       VALUES (:id_familia, SYSDATE, :tipo_asistencia, :id_lote, :cantidad_entregada, :valor_estimado, :observaciones)
       RETURNING id_asistencia INTO :id`,
      {
        id_familia,
        tipo_asistencia,
        id_lote: id_lote || null,
        cantidad_entregada: cantidad_entregada || null,
        valor_estimado: valor_estimado || null,
        observaciones: observaciones || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Asistencia registrada exitosamente',
      id_asistencia: result.outBinds.id[0]
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    res.status(400).json({ message: 'Error al registrar asistencia', error: err.message });
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

// Actualizar una asistencia
const updateAsistencia = async (req, res) => {
  let connection;
  const { tipo_asistencia, valor_estimado, observaciones } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE Asistencia
       SET tipo_asistencia = :tipo_asistencia,
           valor_estimado = :valor_estimado,
           observaciones = :observaciones
       WHERE id_asistencia = :id`,
      {
        tipo_asistencia,
        valor_estimado: valor_estimado || null,
        observaciones: observaciones || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }

    res.json({ message: 'Asistencia actualizada exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar asistencia', error: err.message });
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

// Eliminar una asistencia
const deleteAsistencia = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Asistencia WHERE id_asistencia = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }

    res.json({ message: 'Asistencia eliminada exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar asistencia', error: err.message });
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
  getAllAsistencias,
  getAsistenciasByFamilia,
  getAsistenciaById,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia
};
