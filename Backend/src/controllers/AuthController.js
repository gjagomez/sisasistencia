const db = require('../config/db');
const oracledb = require('oracledb');

// Login de usuario
const login = async (req, res) => {
  let connection;

  const { nombre_usuario, password } = req.body;
console.log('Intento de login:', nombre_usuario);
  try {
    if (!nombre_usuario || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    connection = await db.getConnection();

    // Buscar usuario
    const result = await connection.execute(
      `SELECT u.id_usuario, u.nombre_usuario, u.rol, u.estado,
              e.nombre, e.apellido, e.email
       FROM Usuarios u
       LEFT JOIN Empleados e ON u.id_empleado = e.id_empleado
       WHERE u.nombre_usuario = :nombre_usuario
       AND u.password = :password
       AND u.estado = 'Activo'`,
      [nombre_usuario, password],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log(result);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];

    // Actualizar último acceso
    await connection.execute(
      `UPDATE Usuarios SET ultimo_acceso = SYSTIMESTAMP WHERE id_usuario = :id`,
      [user.ID_USUARIO],
      { autoCommit: true }
    );

    // Retornar datos del usuario (sin la contraseña)
    res.json({
      message: 'Login exitoso',
      user: {
        id: user.ID_USUARIO,
        username: user.NOMBRE_USUARIO,
        rol: user.ROL,
        nombre: user.NOMBRE,
        apellido: user.APELLIDO,
        email: user.EMAIL
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
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

// Verificar sesión
const verifySession = async (req, res) => {
  res.json({ message: 'Sesión válida', user: req.user });
};

// Logout
const logout = async (req, res) => {
  res.json({ message: 'Logout exitoso' });
};

// ENDPOINT TEMPORAL - Para verificar usuarios en DB
const getAllUsers = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT u.id_usuario, u.nombre_usuario, u.password, u.rol, u.estado,
              e.nombre, e.apellido, e.email
       FROM Usuarios u
       LEFT JOIN Empleados e ON u.id_empleado = e.id_empleado`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json({
      total: result.rows.length,
      usuarios: result.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
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
  login,
  verifySession,
  logout,
  getAllUsers
};
