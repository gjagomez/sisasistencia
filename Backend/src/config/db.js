const oracledb = require('oracledb');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING
};

async function initialize() {
  try {
    console.log('🔎 Conectando a:', dbConfig.connectString);
    await oracledb.createPool(dbConfig);
    console.log('✅ Pool de conexiones a Oracle creado exitosamente.');
  } catch (err) {
    console.error('❌ Error al crear el pool de conexiones:', err);
    process.exit(1);
  }
}

async function close() {
  await oracledb.getPool().close(0);
}

async function getConnection() {
  return await oracledb.getPool().getConnection();
}

module.exports = {
  initialize,
  close,
  getConnection,
  // Exportar también la configuración para testing
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString
};
