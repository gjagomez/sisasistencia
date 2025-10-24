const oracledb = require('oracledb');
const db = require('../config/db');

// Obtener todos los beneficiados
const getAllBeneficiados = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT b.id_beneficiado, b.id_familia, b.nombre, b.apellido, b.dpi,
              b.fecha_nacimiento, b.parentesco, f.jefe_familia
       FROM Beneficiados b
       LEFT JOIN FamiliaBeneficiadas f ON b.id_familia = f.id_familia
       ORDER BY b.id_beneficiado DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener beneficiados', error: err.message });
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

// Obtener beneficiados por familia
const getBeneficiadosByFamilia = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT id_beneficiado, id_familia, nombre, apellido, dpi,
              fecha_nacimiento, parentesco
       FROM Beneficiados
       WHERE id_familia = :id_familia
       ORDER BY id_beneficiado`,
      [req.params.id_familia],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener beneficiados', error: err.message });
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

// Obtener beneficiado por ID
const getBeneficiadoById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT b.id_beneficiado, b.id_familia, b.nombre, b.apellido, b.dpi,
              b.fecha_nacimiento, b.parentesco, f.jefe_familia
       FROM Beneficiados b
       LEFT JOIN FamiliaBeneficiadas f ON b.id_familia = f.id_familia
       WHERE b.id_beneficiado = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Beneficiado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener beneficiado', error: err.message });
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

// Crear un nuevo beneficiado
const createBeneficiado = async (req, res) => {
  let connection;
  const { id_familia, nombre, apellido, dpi, fecha_nacimiento, parentesco } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO Beneficiados (id_familia, nombre, apellido, dpi, fecha_nacimiento, parentesco)
       VALUES (:id_familia, :nombre, :apellido, :dpi, TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'), :parentesco)
       RETURNING id_beneficiado INTO :id`,
      {
        id_familia,
        nombre,
        apellido: apellido || null,
        dpi: dpi || null,
        fecha_nacimiento: fecha_nacimiento || null,
        parentesco: parentesco || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Beneficiado registrado exitosamente',
      id_beneficiado: result.outBinds.id[0]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear beneficiado', error: err.message });
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

// Actualizar un beneficiado
const updateBeneficiado = async (req, res) => {
  let connection;
  const { id_familia, nombre, apellido, dpi, fecha_nacimiento, parentesco } = req.body;

  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE Beneficiados
       SET id_familia = :id_familia,
           nombre = :nombre,
           apellido = :apellido,
           dpi = :dpi,
           fecha_nacimiento = TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'),
           parentesco = :parentesco
       WHERE id_beneficiado = :id`,
      {
        id_familia,
        nombre,
        apellido: apellido || null,
        dpi: dpi || null,
        fecha_nacimiento: fecha_nacimiento || null,
        parentesco: parentesco || null,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Beneficiado no encontrado' });
    }

    res.json({ message: 'Beneficiado actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar beneficiado', error: err.message });
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

// Eliminar un beneficiado
const deleteBeneficiado = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM Beneficiados WHERE id_beneficiado = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Beneficiado no encontrado' });
    }

    res.json({ message: 'Beneficiado eliminado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al eliminar beneficiado', error: err.message });
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
  getAllBeneficiados,
  getBeneficiadosByFamilia,
  getBeneficiadoById,
  createBeneficiado,
  updateBeneficiado,
  deleteBeneficiado
};
