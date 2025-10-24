const oracledb = require('oracledb');
const db = require('../config/db');

// Dashboard - Estadísticas generales
const getDashboardStats = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    // Total de familias beneficiadas
    const totalFamilias = await connection.execute(
      `SELECT COUNT(*) as total FROM familiabeneficiadas`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Total de beneficiados
    const totalBeneficiados = await connection.execute(
      `SELECT COUNT(*) as total FROM Beneficiados`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Total de familias apadrinadas activas
    const familiasApadrinadas = await connection.execute(
      `SELECT COUNT(*) as total FROM familiabeneficiadas WHERE es_apadrinada = 'Sí'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Total de donadores
    const totalDonadores = await connection.execute(
      `SELECT COUNT(*) as total FROM Donador`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Total de donaciones monetarias del año actual
    const donacionesAnio = await connection.execute(
      `SELECT NVL(SUM(monto_monetario), 0) as total
       FROM Donacion
       WHERE tipo_donacion = 'Monetaria'
       AND EXTRACT(YEAR FROM fecha_donacion) = EXTRACT(YEAR FROM SYSDATE)`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Saldo total de fondos
    const saldoFondos = await connection.execute(
      `SELECT NVL(SUM(saldo), 0) as total FROM Fondos`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Total de asistencias entregadas
    const totalAsistencias = await connection.execute(
      `SELECT COUNT(*) as total FROM Asistencia`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Artículos próximos a vencer (30 días)
    const articulosVencer = await connection.execute(
      `SELECT COUNT(*) as total
       FROM lotearticulo
       WHERE fecha_vencimiento IS NOT NULL
       AND cantidad_disponible > 0
       AND fecha_vencimiento BETWEEN SYSDATE AND SYSDATE + 30`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({
      totalFamilias: totalFamilias.rows[0].TOTAL,
      totalBeneficiados: totalBeneficiados.rows[0].TOTAL,
      familiasApadrinadas: familiasApadrinadas.rows[0].TOTAL,
      totalDonadores: totalDonadores.rows[0].TOTAL,
      donacionesAnio: donacionesAnio.rows[0].TOTAL,
      saldoFondos: saldoFondos.rows[0].TOTAL,
      totalAsistencias: totalAsistencias.rows[0].TOTAL,
      articulosProximosVencer: articulosVencer.rows[0].TOTAL
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: err.message });
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

// Estadísticas de donaciones por mes
const getDonacionesPorMes = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const anio = req.query.anio || new Date().getFullYear();

    const result = await connection.execute(
      `SELECT
         TO_CHAR(fecha_donacion, 'MM') as mes,
         TO_CHAR(fecha_donacion, 'Month') as nombre_mes,
         COUNT(*) as cantidad,
         NVL(SUM(monto_monetario), 0) as total_monetario
       FROM Donacion
       WHERE EXTRACT(YEAR FROM fecha_donacion) = :anio
       GROUP BY TO_CHAR(fecha_donacion, 'MM'), TO_CHAR(fecha_donacion, 'Month')
       ORDER BY mes`,
      [anio],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener donaciones por mes', error: err.message });
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

// Estadísticas de desastres y familias afectadas
const getEstadisticasDesastres = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT
         d.id_desastre,
         d.nombre_desastre,
         d.tipo_desastre,
         d.fecha_desastre,
         d.ubicacion,
         COUNT(f.id_familia) as familias_afectadas,
         NVL(SUM(f.cantidad_miembros), 0) as personas_afectadas
       FROM Desastres d
       LEFT JOIN familiabeneficiadas f ON d.id_desastre = f.id_desastre_asociado
       GROUP BY d.id_desastre, d.nombre_desastre, d.tipo_desastre, d.fecha_desastre, d.ubicacion
       ORDER BY d.fecha_desastre DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas de desastres', error: err.message });
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

// Top donadores
const getTopDonadores = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const limite = req.query.limite || 10;

    const result = await connection.execute(
      `SELECT
         don.id_donador,
         don.nombre,
         don.tipo_donador,
         COUNT(d.id_donacion) as total_donaciones,
         NVL(SUM(d.monto_monetario), 0) as monto_total
       FROM Donador don
       LEFT JOIN Donacion d ON don.id_donador = d.id_donador
       GROUP BY don.id_donador, don.nombre, don.tipo_donador
       ORDER BY monto_total DESC
       FETCH FIRST :limite ROWS ONLY`,
      [limite],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener top donadores', error: err.message });
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

// Inventario disponible
const getInventarioDisponible = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT
         a.id_articulo,
         a.nombre_articulo,
         a.categoria,
         a.unidad_medida,
         NVL(SUM(l.cantidad_disponible), 0) as cantidad_total_disponible,
         COUNT(l.id_lote) as total_lotes
       FROM Articulo a
       LEFT JOIN Lote l ON a.id_articulo = l.id_articulo AND l.cantidad_disponible > 0
       GROUP BY a.id_articulo, a.nombre_articulo, a.categoria, a.unidad_medida
       ORDER BY a.nombre_articulo`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener inventario disponible', error: err.message });
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

// Asistencias por tipo
const getAsistenciasPorTipo = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT
         tipo_asistencia,
         COUNT(*) as cantidad,
         NVL(SUM(valor_estimado), 0) as valor_total
       FROM Asistencia
       GROUP BY tipo_asistencia
       ORDER BY cantidad DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener asistencias por tipo', error: err.message });
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

// Distribución geográfica de familias
const getDistribucionGeografica = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT
         departamento,
         municipio,
         COUNT(*) as total_familias,
         NVL(SUM(cantidad_miembros), 0) as total_personas
       FROM Familia
       GROUP BY departamento, municipio
       ORDER BY departamento, municipio`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener distribución geográfica', error: err.message });
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
  getDashboardStats,
  getDonacionesPorMes,
  getEstadisticasDesastres,
  getTopDonadores,
  getInventarioDisponible,
  getAsistenciasPorTipo,
  getDistribucionGeografica
};
