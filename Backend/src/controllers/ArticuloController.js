const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todos los artículos
const getAllArticulos = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_articulo, nombre_articulo, categoria, unidad_medida, costo
       FROM Articulo
       ORDER BY nombre_articulo`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
   
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener artículos', error: err.message });
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

// Obtener artículo por ID
const getArticuloById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_articulo, nombre_articulo, categoria, unidad_medida, costo
       FROM Articulo
       WHERE id_articulo = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    console.log(result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener artículo', error: err.message });
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

// Crear un nuevo artículo
const createArticulo = async (req, res) => {
  let connection;
  const { nombre_articulo, categoria, unidad_medida, costo } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO Articulo (nombre_articulo, categoria, unidad_medida, costo)
       VALUES (:nombre_articulo, :categoria, :unidad_medida, :costo)
       RETURNING id_articulo INTO :id`,
      {
        nombre_articulo,
        categoria: categoria || null,
        unidad_medida: unidad_medida || null,
        costo: costo || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Artículo creado exitosamente',
      id_articulo: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear artículo', error: err.message });
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

// Actualizar un artículo
const updateArticulo = async (req, res) => {
  let connection;
  const { nombre_articulo, categoria, unidad_medida, costo } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE Articulo
       SET nombre_articulo = :nombre_articulo,
           categoria = :categoria,
           unidad_medida = :unidad_medida,
           costo = :costo
       WHERE id_articulo = :id`,
      {
        nombre_articulo,
        categoria: categoria || null,
        unidad_medida: unidad_medida || null,
        costo: costo || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json({ message: 'Artículo actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar artículo', error: err.message });
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

// Eliminar un artículo
const deleteArticulo = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Articulo WHERE id_articulo = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json({ message: 'Artículo eliminado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar artículo', error: err.message });
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

// =================== LOTE ARTICULO ===================

// Obtener todos los lotes
const getAllLotes = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT l.id_lote, l.id_articulo, a.nombre_articulo, a.categoria,
              l.fecha_entrada, l.fecha_vencimiento, l.cantidad_inicial,
              l.cantidad_disponible, l.origen
       FROM lotearticulo l
       LEFT JOIN Articulo a ON l.id_articulo = a.id_articulo
       ORDER BY l.fecha_entrada DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log(result.rows)
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener lotes', error: err.message });
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

// Obtener lotes por artículo
const getLotesByArticulo = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_lote, id_articulo, fecha_entrada, fecha_vencimiento,
              cantidad_inicial, cantidad_disponible, origen
       FROM LoteArticulo
       WHERE id_articulo = :id_articulo
       ORDER BY fecha_entrada DESC`,
      [req.params.id_articulo],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
 
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener lotes', error: err.message });
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

// Obtener lotes próximos a vencer
const getLotesProximosVencer = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const diasAntes = req.query.dias || 30; // Por defecto 30 días

    const result = await connection.execute(
      `SELECT l.id_lote, l.id_articulo, a.nombre_articulo, a.categoria,
              l.fecha_entrada, l.fecha_vencimiento, l.cantidad_disponible,
              (l.fecha_vencimiento - SYSDATE) as dias_para_vencer
       FROM lotearticulo l
       LEFT JOIN Articulo a ON l.id_articulo = a.id_articulo
       WHERE l.fecha_vencimiento IS NOT NULL
         AND l.cantidad_disponible > 0
         AND l.fecha_vencimiento BETWEEN SYSDATE AND SYSDATE + :dias
       ORDER BY l.fecha_vencimiento ASC`,
      [diasAntes],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener lotes próximos a vencer', error: err.message });
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

// Crear un nuevo lote
const createLote = async (req, res) => {
  let connection;
  const { id_articulo, fecha_vencimiento, cantidad_inicial, origen } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO lotearticulo (id_articulo, fecha_entrada, fecha_vencimiento, cantidad_inicial, cantidad_disponible, origen)
       VALUES (:id_articulo, SYSDATE, TO_DATE(:fecha_vencimiento, 'YYYY-MM-DD'), :cantidad_inicial, :cantidad_inicial, :origen)
       RETURNING id_lote INTO :id`,
      {
        id_articulo,
        fecha_vencimiento: fecha_vencimiento || null,
        cantidad_inicial,
        origen: origen || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Lote creado exitosamente',
      id_lote: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear lote', error: err.message });
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

// Actualizar cantidad disponible de un lote
const updateCantidadLote = async (req, res) => {
  let connection;
  const { cantidad_disponible } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE lotearticulo
       SET cantidad_disponible = :cantidad_disponible
       WHERE id_lote = :id`,
      {
        cantidad_disponible,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Lote no encontrado' });
    }

    res.json({ message: 'Cantidad actualizada exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar cantidad', error: err.message });
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
  // Artículos
  getAllArticulos,
  getArticuloById,
  createArticulo,
  updateArticulo,
  deleteArticulo,
  // Lotes
  getAllLotes,
  getLotesByArticulo,
  getLotesProximosVencer,
  createLote,
  updateCantidadLote
};
