// src/index.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const donadorRoutes = require('./routes/DonadorRoutes');
const donacionRoutes = require('./routes/DonacionRoutes');
const familiaRoutes = require('./routes/FamiliaRoutes');
const beneficiadoRoutes = require('./routes/BeneficiadoRoutes');
const apadrinamientoRoutes = require('./routes/ApadrinamientoRoutes');
const articuloRoutes = require('./routes/ArticuloRoutes');
const asistenciaRoutes = require('./routes/AsistenciaRoutes');
const desastreRoutes = require('./routes/DesastreRoutes');
const estudioRoutes = require('./routes/EstudioSocioEcRoutes');
const fondoRoutes = require('./routes/FondoRoutes');
const estadisticasRoutes = require('./routes/EstadisticasRoutes');
const reportesRoutes = require('./routes/ReportesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Configuración simple y funcional de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));

// ✅ Middleware adicional para asegurar preflight correcto
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donadores', donadorRoutes);
app.use('/api/donaciones', donacionRoutes);
app.use('/api/familias', familiaRoutes);
app.use('/api/beneficiados', beneficiadoRoutes);
app.use('/api/apadrinamientos', apadrinamientoRoutes);
app.use('/api/articulos', articuloRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/desastres', desastreRoutes);
app.use('/api/estudios', estudioRoutes);
app.use('/api/fondos', fondoRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('<h1>Sistema de Asistencia a Víctimas de Desastres Naturales - API</h1>');
});

// Ruta para verificar el estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date()
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error capturado por middleware:', err);

  // Serializar el error de forma segura
  const errorResponse = {
    message: err.message || 'Error interno del servidor',
    status: err.status || 500
  };

  // Agregar información adicional solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
    if (err.errorNum) {
      errorResponse.oracleError = err.errorNum;
    }
  }

  res.status(errorResponse.status).json(errorResponse);
});

// Iniciar el servidor después de conectar a la BD
db.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}`);
      console.log(`💚 Estado de la API: http://localhost:${PORT}/api/health\n`);
    });
  })
  .catch(err => {
    console.error('❌ No se pudo iniciar el servidor debido a un error de base de datos:', err);
  });

// Cerrar el pool de conexiones al apagar la app
process.on('SIGTERM', () => {
  db.close()
    .then(() => {
      console.log('Pool de conexiones cerrado.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error al cerrar el pool:', err);
      process.exit(1);
    });
});
