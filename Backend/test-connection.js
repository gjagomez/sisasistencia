// Script para probar la conexión a Oracle y verificar las tablas
const oracledb = require('oracledb');
const dbConfig = require('./src/config/db');

async function testConnection() {
  let connection;

  try {
    console.log('🔄 Intentando conectar a Oracle...');
    console.log('Configuración:', {
      user: dbConfig.user,
      connectString: dbConfig.connectString
    });

    connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Conexión exitosa a Oracle!\n');

    // Verificar tablas existentes
    console.log('📋 Verificando tablas en la base de datos...\n');
    const tables = await connection.execute(
      `SELECT table_name FROM user_tables ORDER BY table_name`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log(`Total de tablas encontradas: ${tables.rows.length}\n`);

    if (tables.rows.length === 0) {
      console.log('⚠️  NO SE ENCONTRARON TABLAS EN LA BASE DE DATOS');
      console.log('⚠️  Debes ejecutar los scripts SQL:');
      console.log('   1. crear-tablas.sql');
      console.log('   2. datos-iniciales.sql\n');
    } else {
      console.log('Tablas encontradas:');
      tables.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.TABLE_NAME}`);
      });
      console.log('');
    }

    // Verificar tabla Donacion específicamente
    const donacionTable = tables.rows.find(row => row.TABLE_NAME === 'DONACION');

    if (!donacionTable) {
      console.log('❌ ERROR: La tabla DONACION no existe');
      console.log('   Ejecuta el script crear-tablas.sql en Oracle SQL Developer\n');
    } else {
      console.log('✅ La tabla DONACION existe');

      // Intentar consultar la tabla Donacion
      console.log('\n🔍 Probando consulta a la tabla Donacion...\n');
      try {
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

        console.log(`✅ Consulta exitosa! Donaciones encontradas: ${result.rows.length}`);
        if (result.rows.length > 0) {
          console.log('\nPrimeras donaciones:');
          result.rows.slice(0, 3).forEach((donacion, index) => {
            console.log(`  ${index + 1}. ID: ${donacion.ID_DONACION}, Donador: ${donacion.NOMBRE_DONADOR || 'N/A'}, Tipo: ${donacion.TIPO_DONACION}`);
          });
        } else {
          console.log('\n⚠️  No hay donaciones registradas en la base de datos');
          console.log('   Esto es normal si acabas de crear las tablas\n');
        }
      } catch (queryErr) {
        console.log('❌ Error al consultar la tabla Donacion:');
        console.log(`   ${queryErr.message}\n`);
      }
    }

    // Verificar otras tablas importantes
    console.log('\n📊 Verificando otras tablas importantes:');
    const requiredTables = [
      'EMPRESA', 'EMPLEADOS', 'USUARIOS', 'DONADOR', 'DONACION',
      'FAMILIA', 'BENEFICIADO', 'APADRINAMIENTO', 'ARTICULO',
      'LOTE', 'ASISTENCIA', 'DESASTRE', 'ESTUDIO_SOCIOECONOMICO', 'FONDO'
    ];

    const existingTables = tables.rows.map(row => row.TABLE_NAME);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length === 0) {
      console.log('✅ Todas las tablas requeridas están presentes\n');
    } else {
      console.log(`❌ Faltan ${missingTables.length} tabla(s):`);
      missingTables.forEach(table => {
        console.log(`   - ${table}`);
      });
      console.log('\n⚠️  Ejecuta el script crear-tablas.sql para crear las tablas faltantes\n');
    }

    // Verificar datos iniciales
    console.log('👤 Verificando usuario administrador...');
    try {
      const users = await connection.execute(
        `SELECT id_usuario, nombre_usuario, rol FROM Usuarios`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (users.rows.length === 0) {
        console.log('⚠️  No hay usuarios en la base de datos');
        console.log('   Ejecuta el script datos-iniciales.sql\n');
      } else {
        console.log(`✅ Usuarios encontrados: ${users.rows.length}`);
        users.rows.forEach(user => {
          console.log(`   - Usuario: ${user.NOMBRE_USUARIO}, Rol: ${user.ROL}`);
        });
        console.log('');
      }
    } catch (err) {
      console.log('⚠️  No se pudo verificar usuarios (tabla probablemente no existe)\n');
    }

  } catch (err) {
    console.error('❌ ERROR DE CONEXIÓN:');
    console.error(`   ${err.message}\n`);

    if (err.message.includes('ORA-01017')) {
      console.log('💡 Sugerencia: Usuario o contraseña incorrectos');
      console.log('   Verifica las credenciales en Backend/src/config/db.js\n');
    } else if (err.message.includes('ORA-12154') || err.message.includes('TNS')) {
      console.log('💡 Sugerencia: No se puede conectar a Oracle');
      console.log('   - Verifica que Oracle esté corriendo');
      console.log('   - Verifica el connectString en Backend/src/config/db.js\n');
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('🔌 Conexión cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err.message);
      }
    }
  }
}

// Ejecutar el test
console.log('='.repeat(60));
console.log('    PRUEBA DE CONEXIÓN A ORACLE DATABASE');
console.log('='.repeat(60));
console.log('');

testConnection()
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
