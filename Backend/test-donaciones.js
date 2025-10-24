// Script para probar específicamente la consulta de donaciones
const oracledb = require('oracledb');
const dbConfig = require('./src/config/db');

async function testDonaciones() {
  let connection;

  try {
    console.log('🔄 Conectando a Oracle...');

    // Usar la configuración exportada
    const config = {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString
    };

    connection = await oracledb.getConnection(config);
    console.log('✅ Conexión exitosa!\n');

    console.log('🔍 Ejecutando consulta de donaciones...\n');

    const result = await connection.execute(
      `SELECT d.id_donacion, d.id_donador, don.nombre as nombre_donador,
              d.fecha_donacion, d.tipo_donacion, d.monto_monetario,
              d.descripcion_especie, d.destino
       FROM Donacion d
       LEFT JOIN Donador don ON d.id_donador = don.id_donador
       ORDER BY d.fecha_donacion DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log(`✅ Consulta exitosa! Encontradas ${result.rows.length} donaciones\n`);

    if (result.rows.length > 0) {
      console.log('📋 Donaciones encontradas:\n');
      result.rows.forEach((donacion, index) => {
        console.log(`${index + 1}. ID: ${donacion.ID_DONACION}`);
        console.log(`   Donador: ${donacion.NOMBRE_DONADOR || 'Sin nombre'}`);
        console.log(`   Tipo: ${donacion.TIPO_DONACION}`);
        console.log(`   Monto: Q${donacion.MONTO_MONETARIO || 0}`);
        console.log(`   Fecha: ${donacion.FECHA_DONACION || 'Sin fecha'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No hay donaciones registradas en la base de datos');
    }

    // Intentar serializar a JSON como lo hace Express
    console.log('🔧 Probando serialización a JSON...\n');
    const jsonString = JSON.stringify(result.rows);
    console.log('✅ Serialización exitosa!');
    console.log(`   Tamaño del JSON: ${jsonString.length} caracteres\n`);

  } catch (err) {
    console.error('❌ ERROR:');
    console.error(`   Mensaje: ${err.message}`);
    console.error(`   Código: ${err.errorNum || 'N/A'}`);

    if (err.message.includes('ORA-')) {
      console.error('\n💡 Error de Oracle. Posibles causas:');
      console.error('   - La tabla no existe');
      console.error('   - Error de sintaxis en la consulta');
      console.error('   - Permisos insuficientes');
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('🔌 Conexión cerrada');
      } catch (err) {
        console.error('Error al cerrar conexión:', err.message);
      }
    }
  }
}

console.log('='.repeat(60));
console.log('    PRUEBA DE CONSULTA DE DONACIONES');
console.log('='.repeat(60));
console.log('');

testDonaciones()
  .then(() => {
    console.log('\n' + '='.repeat(60));
    console.log('Prueba completada');
    console.log('='.repeat(60));
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nError fatal:', err);
    process.exit(1);
  });
