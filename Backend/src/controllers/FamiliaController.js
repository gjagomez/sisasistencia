const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todas las familias beneficiadas
const getAllFamilias = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT f.id_familia, f.jefe_familia, f.cantidad_miembros, f.direccion,
              f.municipio, f.departamento, f.fecha_registro, f.es_apadrinada,
              f.id_desastre_asociado, d.nombre_desastre
       FROM FamiliaBeneficiadas f
       LEFT JOIN Desastres d ON f.id_desastre_asociado = d.id_desastre
       ORDER BY f.fecha_registro DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener familias', error: err.message });
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

// Obtener familia por ID
const getFamiliaById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT f.id_familia, f.jefe_familia, f.cantidad_miembros, f.direccion,
              f.municipio, f.departamento, f.fecha_registro, f.es_apadrinada,
              f.id_desastre_asociado, d.nombre_desastre
       FROM FamiliaBeneficiadas f
       LEFT JOIN Desastres d ON f.id_desastre_asociado = d.id_desastre
       WHERE f.id_familia = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Familia no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener familia', error: err.message });
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

// Obtener familias apadrinadas
const getFamiliasApadrinadas = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT f.id_familia, f.jefe_familia, f.cantidad_miembros, f.direccion,
              f.municipio, f.departamento, f.fecha_registro, f.es_apadrinada,
              a.id_apadrinamiento, a.id_donador, don.nombre as nombre_padrino,
              a.fecha_inicio, a.estado as estado_apadrinamiento
       FROM FamiliaBeneficiadas f
       LEFT JOIN Apadrinamiento a ON f.id_familia = a.id_familia AND a.estado = 'Activo'
       LEFT JOIN Donador don ON a.id_donador = don.id_donador
       WHERE f.es_apadrinada = 'Sí'
       ORDER BY f.fecha_registro DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener familias apadrinadas', error: err.message });
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

// Crear una nueva familia
const createFamilia = async (req, res) => {
  let connection;
  const { jefe_familia, cantidad_miembros, direccion, municipio, departamento, es_apadrinada, id_desastre_asociado } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO FamiliaBeneficiadas
       (jefe_familia, cantidad_miembros, direccion, municipio, departamento, fecha_registro, es_apadrinada, id_desastre_asociado)
       VALUES (:jefe_familia, :cantidad_miembros, :direccion, :municipio, :departamento, SYSDATE, :es_apadrinada, :id_desastre_asociado)
       RETURNING id_familia INTO :id`,
      {
        jefe_familia,
        cantidad_miembros,
        direccion: direccion || null,
        municipio: municipio || null,
        departamento: departamento || null,
        es_apadrinada: es_apadrinada || 'No',
        id_desastre_asociado: id_desastre_asociado || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Familia registrada exitosamente',
      id_familia: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear familia', error: err.message });
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

// Actualizar una familia
const updateFamilia = async (req, res) => {
  let connection;
  const { jefe_familia, cantidad_miembros, direccion, municipio, departamento, es_apadrinada, id_desastre_asociado } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE FamiliaBeneficiadas
       SET jefe_familia = :jefe_familia,
           cantidad_miembros = :cantidad_miembros,
           direccion = :direccion,
           municipio = :municipio,
           departamento = :departamento,
           es_apadrinada = :es_apadrinada,
           id_desastre_asociado = :id_desastre_asociado
       WHERE id_familia = :id`,
      {
        jefe_familia,
        cantidad_miembros,
        direccion: direccion || null,
        municipio: municipio || null,
        departamento: departamento || null,
        es_apadrinada: es_apadrinada || 'No',
        id_desastre_asociado: id_desastre_asociado || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Familia no encontrada' });
    }

    res.json({ message: 'Familia actualizada exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar familia', error: err.message });
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

// Eliminar una familia
const deleteFamilia = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM FamiliaBeneficiadas WHERE id_familia = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Familia no encontrada' });
    }

    res.json({ message: 'Familia eliminada exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar familia', error: err.message });
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
  getAllFamilias,
  getFamiliaById,
  getFamiliasApadrinadas,
  createFamilia,
  updateFamilia,
  deleteFamilia
};
