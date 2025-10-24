// Script para verificar que todas las rutas están registradas
const express = require('express');
const app = express();

// Importar todas las rutas
const userRoutes = require('./src/routes/UserRoutes');
const donadorRoutes = require('./src/routes/DonadorRoutes');
const donacionRoutes = require('./src/routes/DonacionRoutes');
const familiaRoutes = require('./src/routes/FamiliaRoutes');
const beneficiadoRoutes = require('./src/routes/BeneficiadoRoutes');
const apadrinamientoRoutes = require('./src/routes/ApadrinamientoRoutes');
const articuloRoutes = require('./src/routes/ArticuloRoutes');
const asistenciaRoutes = require('./src/routes/AsistenciaRoutes');
const desastreRoutes = require('./src/routes/DesastreRoutes');
const estudioRoutes = require('./src/routes/EstudioSocioEcRoutes');
const fondoRoutes = require('./src/routes/FondoRoutes');
const estadisticasRoutes = require('./src/routes/EstadisticasRoutes');

// Registrar rutas
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

// Función para extraer rutas
function getRoutes(app) {
  const routes = [];

  app._router.stack.forEach(function(middleware) {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      const routerPath = middleware.regexp.source
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '')
        .replace(/\\/g, '')
        .replace('^', '');

      middleware.handle.stack.forEach(function(handler) {
        if (handler.route) {
          routes.push({
            path: routerPath + handler.route.path,
            methods: Object.keys(handler.route.methods).map(m => m.toUpperCase())
          });
        }
      });
    }
  });

  return routes;
}

// Mostrar todas las rutas
console.log('\n===========================================');
console.log('   RUTAS REGISTRADAS EN LA API');
console.log('===========================================\n');

const routes = getRoutes(app);
routes.forEach((route, index) => {
  console.log(`${index + 1}. [${route.methods.join(', ')}] ${route.path}`);
});

console.log('\n===========================================');
console.log(`   TOTAL: ${routes.length} endpoints registrados`);
console.log('===========================================\n');
