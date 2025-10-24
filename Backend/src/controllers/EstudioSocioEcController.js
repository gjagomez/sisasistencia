const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todos los estudios socioeconómicos
const getAllEstudios = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT e.id_estudio, e.id_familia, f.jefe_familia, e.fecha_estudio,
              e.ingresos_familiares, e.gastos_familiares, e.conclusion, e.observaciones
       FROM EstudioSocioEc e
       LEFT JOIN FamiliaBeneficiadas f ON e.id_familia = f.id_familia
       ORDER BY e.fecha_estudio DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 🔹 Convertir CLOBs a texto
    const rows = await Promise.all(
      result.rows.map(async (row) => {
        const converted = { ...row };

        for (const key of ['CONCLUSION', 'OBSERVACIONES']) {
          const value = row[key];

          if (value && value.iLob) {
            converted[key] = await readClob(value);
          } else if (value && typeof value === 'object' && value.on) {
            converted[key] = await readClob(value);
          } else {
            converted[key] = value;
          }
        }

        // 🔹 Formatear fecha a string legible
        if (row.FECHA_ESTUDIO instanceof Date) {
          converted.FECHA_ESTUDIO = row.FECHA_ESTUDIO.toISOString();
        }

        return converted;
      })
    );

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener estudios:', err);
    res.status(500).json({ message: 'Error al obtener estudios', error: err.message });
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

// Obtener estudios por familia
const getEstudiosByFamilia = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_estudio, id_familia, fecha_estudio, ingresos_familiares,
              gastos_familiares, conclusion, observaciones
       FROM EstudioSocioEc
       WHERE id_familia = :id_familia
       ORDER BY fecha_estudio DESC`,
      [req.params.id_familia],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estudios', error: err.message });
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

// Obtener último estudio de una familia
const getUltimoEstudioFamilia = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_estudio, id_familia, fecha_estudio, ingresos_familiares,
              gastos_familiares, conclusion, observaciones
       FROM EstudioSocioEc
       WHERE id_familia = :id_familia
       ORDER BY fecha_estudio DESC
       FETCH FIRST 1 ROWS ONLY`,
      [req.params.id_familia],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron estudios para esta familia' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estudio', error: err.message });
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

// Obtener estudio por ID
const getEstudioById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT e.id_estudio, e.id_familia, f.jefe_familia, e.fecha_estudio,
              e.ingresos_familiares, e.gastos_familiares, e.conclusion, e.observaciones
       FROM EstudioSocioEc e
       LEFT JOIN FamiliaBeneficiadas f ON e.id_familia = f.id_familia
       WHERE e.id_estudio = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estudio', error: err.message });
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

// Crear un nuevo estudio socioeconómico
const createEstudio = async (req, res) => {
  let connection;
  const { id_familia, ingresos_familiares, gastos_familiares, conclusion, observaciones } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO EstudioSocioEc (id_familia, fecha_estudio, ingresos_familiares, gastos_familiares, conclusion, observaciones)
       VALUES (:id_familia, SYSDATE, :ingresos_familiares, :gastos_familiares, :conclusion, :observaciones)
       RETURNING id_estudio INTO :id`,
      {
        id_familia,
        ingresos_familiares: ingresos_familiares || null,
        gastos_familiares: gastos_familiares || null,
        conclusion: conclusion || null,
        observaciones: observaciones || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Estudio socioeconómico registrado exitosamente',
      id_estudio: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear estudio', error: err.message });
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

// Actualizar un estudio
const updateEstudio = async (req, res) => {
  let connection;
  const { ingresos_familiares, gastos_familiares, conclusion, observaciones } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE EstudioSocioEc
       SET ingresos_familiares = :ingresos_familiares,
           gastos_familiares = :gastos_familiares,
           conclusion = :conclusion,
           observaciones = :observaciones
       WHERE id_estudio = :id`,
      {
        ingresos_familiares: ingresos_familiares || null,
        gastos_familiares: gastos_familiares || null,
        conclusion: conclusion || null,
        observaciones: observaciones || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json({ message: 'Estudio actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar estudio', error: err.message });
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

// Eliminar un estudio
const deleteEstudio = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM EstudioSocioEc WHERE id_estudio = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json({ message: 'Estudio eliminado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar estudio', error: err.message });
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
    let content = '';
    if (!lob) return resolve(null);

    lob.setEncoding('utf8');

    lob.on('data', (chunk) => {
      content += chunk;
    });

    lob.on('end', () => {
      resolve(content);
    });

    lob.on('error', (err) => {
      reject(err);
    });
  });
}


module.exports = {
  getAllEstudios,
  getEstudiosByFamilia,
  getUltimoEstudioFamilia,
  getEstudioById,
  createEstudio,
  updateEstudio,
  deleteEstudio
};
