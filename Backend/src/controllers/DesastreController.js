const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todos los desastres
const getAllDesastres = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_desastre, nombre_desastre, tipo_desastre, fecha_desastre, ubicacion, descripcion
       FROM Desastres
       ORDER BY fecha_desastre DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Convertir los LOBs a texto
    const rows = await Promise.all(result.rows.map(async (row) => {
      if (row.DESCRIPCION && typeof row.DESCRIPCION === 'object' && row.DESCRIPCION.iLob) {
        row.DESCRIPCION = await readClob(row.DESCRIPCION);
      } else if (row.DESCRIPCION && row.DESCRIPCION.on) {
        row.DESCRIPCION = await readClob(row.DESCRIPCION);
      }
      return row;
    }));

    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener desastres:', err);
    res.status(500).json({ message: 'Error al obtener desastres', error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
};

// Obtener desastre por ID
const getDesastreById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_desastre, nombre_desastre, tipo_desastre, fecha_desastre, ubicacion, descripcion
       FROM Desastres
       WHERE id_desastre = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Desastre no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener desastre', error: err.message });
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

// Obtener familias afectadas por un desastre
const getFamiliasAfectadas = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT f.id_familia, f.jefe_familia, f.cantidad_miembros, f.direccion,
              f.municipio, f.departamento, f.fecha_registro
       FROM FamiliaBeneficiadas f
       WHERE f.id_desastre_asociado = :id_desastre
       ORDER BY f.fecha_registro DESC`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener familias afectadas', error: err.message });
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

// Crear un nuevo desastre
const createDesastre = async (req, res) => {
  let connection;
  const { nombre_desastre, tipo_desastre, fecha_desastre, ubicacion, descripcion } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO Desastres (nombre_desastre, tipo_desastre, fecha_desastre, ubicacion, descripcion)
       VALUES (:nombre_desastre, :tipo_desastre, TO_DATE(:fecha_desastre, 'YYYY-MM-DD'), :ubicacion, :descripcion)
       RETURNING id_desastre INTO :id`,
      {
        nombre_desastre,
        tipo_desastre: tipo_desastre || null,
        fecha_desastre: fecha_desastre || null,
        ubicacion: ubicacion || null,
        descripcion: descripcion || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Desastre registrado exitosamente',
      id_desastre: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al registrar desastre', error: err.message });
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

// Actualizar un desastre
const updateDesastre = async (req, res) => {
  let connection;
  const { nombre_desastre, tipo_desastre, fecha_desastre, ubicacion, descripcion } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE Desastres
       SET nombre_desastre = :nombre_desastre,
           tipo_desastre = :tipo_desastre,
           fecha_desastre = TO_DATE(:fecha_desastre, 'YYYY-MM-DD'),
           ubicacion = :ubicacion,
           descripcion = :descripcion
       WHERE id_desastre = :id`,
      {
        nombre_desastre,
        tipo_desastre: tipo_desastre || null,
        fecha_desastre: fecha_desastre || null,
        ubicacion: ubicacion || null,
        descripcion: descripcion || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Desastre no encontrado' });
    }

    res.json({ message: 'Desastre actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar desastre', error: err.message });
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

// Eliminar un desastre
const deleteDesastre = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Desastres WHERE id_desastre = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Desastre no encontrado' });
    }

    res.json({ message: 'Desastre eliminado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar desastre', error: err.message });
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

function readClob(lob) {
  return new Promise((resolve, reject) => {
    let data = '';
    lob.setEncoding('utf8');
    lob.on('data', (chunk) => (data += chunk));
    lob.on('end', () => resolve(data));
    lob.on('error', (err) => reject(err));
  });
}

module.exports = {
  getAllDesastres,
  getDesastreById,
  getFamiliasAfectadas,
  createDesastre,
  updateDesastre,
  deleteDesastre
};
