const oracledb = require('oracledb');
const db = require('../config/db');

/**
 * Obtener el reporte completo de donaciones y fondos
 * Utiliza la vista V_REPORTE_DONACIONES_FONDOS
 */
const getReporteDonacionesFondos = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT * FROM V_REPORTE_DONACIONES_FONDOS`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: {
          "DESCRIPCION_ESPECIE": { type: oracledb.STRING }
        }
      }
    );

    // Limpiar y serializar los datos
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

    res.json({
      success: true,
      data: cleanedData,
      total: cleanedData.length
    });

  } catch (err) {
    console.error('Error en getReporteDonacionesFondos:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el reporte de donaciones y fondos',
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

/**
 * Obtener el resumen de fondos
 * Utiliza la vista V_RESUMEN_FONDOS
 */
const getResumenFondos = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT * FROM V_RESUMEN_FONDOS`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: {
          "DESCRIPCION": { type: oracledb.STRING }
        }
      }
    );

    // Limpiar y serializar los datos
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

    res.json({
      success: true,
      data: cleanedData,
      total: cleanedData.length
    });

  } catch (err) {
    console.error('Error en getResumenFondos:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el resumen de fondos',
      error: err.message
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

/**
 * Obtener estadísticas de donaciones por período
 * Utiliza la vista V_ESTADISTICAS_DONACIONES
 */
const getEstadisticasDonaciones = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT * FROM V_ESTADISTICAS_DONACIONES`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Limpiar y serializar los datos
    const cleanedData = result.rows.map(row => {
      const cleaned = {};
      for (const key in row) {
        const value = row[key];
        if (value instanceof Date) {
          cleaned[key] = value.toISOString();
        } else {
          cleaned[key] = value ?? null;
        }
      }
      return cleaned;
    });

    res.json({
      success: true,
      data: cleanedData,
      total: cleanedData.length
    });

  } catch (err) {
    console.error('Error en getEstadisticasDonaciones:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de donaciones',
      error: err.message
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

/**
 * Obtener top donadores
 * Utiliza la vista V_TOP_DONADORES
 */
const getTopDonadores = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    // Obtener parámetro opcional de límite
    const limite = req.query.limite || 10;

    const result = await connection.execute(
      `SELECT * FROM V_TOP_DONADORES WHERE ROWNUM <= :limite`,
      [limite],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Limpiar y serializar los datos
    const cleanedData = result.rows.map(row => {
      const cleaned = {};
      for (const key in row) {
        const value = row[key];
        if (value instanceof Date) {
          cleaned[key] = value.toISOString();
        } else {
          cleaned[key] = value ?? null;
        }
      }
      return cleaned;
    });

    res.json({
      success: true,
      data: cleanedData,
      total: cleanedData.length
    });

  } catch (err) {
    console.error('Error en getTopDonadores:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener top donadores',
      error: err.message
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

/**
 * Obtener reporte consolidado con toda la información
 * Combina datos de todas las vistas para un reporte completo
 */
const getReporteConsolidado = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    // Obtener datos de múltiples vistas
    const [donacionesResult, fondosResult, estadisticasResult, topDonadoresResult] = await Promise.all([
      connection.execute(
        `SELECT * FROM V_REPORTE_DONACIONES_FONDOS WHERE ROWNUM <= 50`,
        [],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          fetchInfo: { "DESCRIPCION_ESPECIE": { type: oracledb.STRING } }
        }
      ),
      connection.execute(
        `SELECT * FROM V_RESUMEN_FONDOS`,
        [],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          fetchInfo: { "DESCRIPCION": { type: oracledb.STRING } }
        }
      ),
      connection.execute(
        `SELECT * FROM V_ESTADISTICAS_DONACIONES WHERE ROWNUM <= 12`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      connection.execute(
        `SELECT * FROM V_TOP_DONADORES WHERE ROWNUM <= 10`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
    ]);

    // Función auxiliar para limpiar datos
    const cleanRows = (rows) => {
      return rows.map(row => {
        const cleaned = {};
        for (const key in row) {
          const value = row[key];
          if (value instanceof Date) {
            cleaned[key] = value.toISOString();
          } else {
            cleaned[key] = value ?? null;
          }
        }
        return cleaned;
      });
    };

    // Calcular totales generales
    const totalDonaciones = donacionesResult.rows.length > 0
      ? donacionesResult.rows[0].TOTAL_DONACIONES
      : 0;

    const montoTotalDonaciones = donacionesResult.rows.length > 0
      ? donacionesResult.rows[0].TOTAL_MONTO_DONACIONES
      : 0;

    const saldoTotalFondos = donacionesResult.rows.length > 0
      ? donacionesResult.rows[0].SALDO_TOTAL_FONDOS
      : 0;

    res.json({
      success: true,
      resumen: {
        total_donaciones: totalDonaciones,
        monto_total_donaciones: montoTotalDonaciones,
        saldo_total_fondos: saldoTotalFondos,
        fecha_reporte: new Date().toISOString()
      },
      donaciones_recientes: {
        success: true,
        data: cleanRows(donacionesResult.rows),
        total: donacionesResult.rows.length
      },
      fondos: {
        success: true,
        data: cleanRows(fondosResult.rows),
        total: fondosResult.rows.length
      },
      estadisticas_por_periodo: {
        success: true,
        data: cleanRows(estadisticasResult.rows),
        total: estadisticasResult.rows.length
      },
      top_donadores: {
        success: true,
        data: cleanRows(topDonadoresResult.rows),
        total: topDonadoresResult.rows.length
      }
    });

  } catch (err) {
    console.error('❌ Error en getReporteConsolidado:', err);
    console.error('Error details:', {
      message: err.message,
      errorNum: err.errorNum,
      offset: err.offset
    });

    res.status(500).json({
      success: false,
      message: 'Error al obtener el reporte consolidado',
      error: err.message,
      errorCode: err.errorNum,
      hint: err.errorNum === 942 ? 'Las vistas SQL no existen. Por favor ejecuta el script SQL primero.' : null
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

module.exports = {
  getReporteDonacionesFondos,
  getResumenFondos,
  getEstadisticasDonaciones,
  getTopDonadores,
  getReporteConsolidado
};
