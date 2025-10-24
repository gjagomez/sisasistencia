# Backend - Sistema de Asistencia a Víctimas de Desastres Naturales

API REST desarrollada con Node.js, Express y Oracle Database para gestionar el sistema de asistencia a víctimas de desastres naturales.

## Características

- ✅ API REST completa con más de 70 endpoints
- ✅ Conexión a Oracle Database
- ✅ CORS habilitado
- ✅ Gestión completa de:
  - Donadores y Donaciones
  - Familias Beneficiadas y Beneficiados
  - Apadrinamiento
  - Inventario de Artículos y Lotes
  - Asistencia a Familias
  - Desastres Naturales
  - Estudios Socioeconómicos
  - Fondos de Emergencia
  - Estadísticas y Reportes

## Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express 5** - Framework web
- **oracledb** - Driver oficial de Oracle
- **dotenv** - Manejo de variables de entorno
- **nodemon** - Hot reload para desarrollo

## Instalación

1. Instalar dependencias:
```bash
cd Backend
npm install
```

2. Configurar variables de entorno:

Crear un archivo `.env` en la raíz de Backend:
```env
DB_USER=tu_usuario_oracle
DB_PASSWORD=tu_password_oracle
DB_CONNECTION_STRING=localhost:1521/XEPDB1
PORT=3000
```

3. Asegurarse de que Oracle Database esté corriendo y las tablas estén creadas (ver `Base de datos.sql`)

## Uso

### Modo Desarrollo (con hot reload):
```bash
npm run dev
```

### Modo Producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js                    # Configuración de conexión a Oracle
│   ├── controllers/
│   │   ├── ApadrinamientoController.js
│   │   ├── ArticuloController.js
│   │   ├── AsistenciaController.js
│   │   ├── BeneficiadoController.js
│   │   ├── DesastreController.js
│   │   ├── DonacionController.js
│   │   ├── DonadorController.js
│   │   ├── EstadisticasController.js
│   │   ├── EstudioSocioEcController.js
│   │   └── FondoController.js
│   ├── routes/
│   │   ├── ApadrinamientoRoutes.js
│   │   ├── ArticuloRoutes.js
│   │   ├── AsistenciaRoutes.js
│   │   ├── BeneficiadoRoutes.js
│   │   ├── DesastreRoutes.js
│   │   ├── DonacionRoutes.js
│   │   ├── DonadorRoutes.js
│   │   ├── EstadisticasRoutes.js
│   │   ├── EstudioSocioEcRoutes.js
│   │   ├── FamiliaRoutes.js
│   │   ├── FondoRoutes.js
│   │   └── UserRoutes.js
│   ├── middlewares/
│   │   └── cors.js                  # Middleware CORS
│   └── index.js                     # Punto de entrada
├── .env                             # Variables de entorno (no incluido en git)
├── package.json
└── API_DOCUMENTATION.md             # Documentación completa de la API
```

## Endpoints Principales

### Dashboard
- `GET /api/estadisticas/dashboard` - Estadísticas generales

### Donadores
- `GET /api/donadores` - Listar donadores
- `POST /api/donadores` - Crear donador

### Donaciones
- `GET /api/donaciones` - Listar donaciones
- `POST /api/donaciones` - Registrar donación

### Familias
- `GET /api/familias` - Listar familias beneficiadas
- `POST /api/familias` - Registrar familia

### Apadrinamiento
- `GET /api/apadrinamientos/activos` - Listar apadrinamientos activos
- `POST /api/apadrinamientos` - Crear apadrinamiento

### Inventario
- `GET /api/articulos` - Listar artículos
- `GET /api/articulos/lotes/all` - Listar lotes
- `GET /api/articulos/lotes/proximos-vencer` - Artículos por vencer

### Asistencia
- `GET /api/asistencias` - Listar asistencias
- `POST /api/asistencias` - Registrar asistencia

Ver documentación completa en [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Verificar Estado

Para verificar que la API está funcionando:

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "API funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Características de la Base de Datos

- 14 tablas relacionadas
- Manejo de transacciones
- Triggers automáticos (ID auto-incrementable)
- Integridad referencial
- Tipos de datos específicos de Oracle (DATE, CLOB, NUMBER)

## Notas de Desarrollo

1. **Formato de fechas**: Las fechas deben enviarse en formato `YYYY-MM-DD`
2. **Parámetros OUT**: Se usa `{ dir: 3003, type: 2001 }` para parámetros RETURNING de Oracle
3. **outFormat: 4**: Retorna resultados como objetos JavaScript
4. **autoCommit**: Se activa para operaciones de escritura
5. **Connection management**: Cada request obtiene y cierra su propia conexión

## Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Agregar validación de datos con express-validator
- [ ] Implementar paginación en los listados
- [ ] Agregar logs con winston
- [ ] Implementar tests con Jest
- [ ] Agregar documentación con Swagger

## Troubleshooting

### Error: ORA-12154
- Verificar que el `DB_CONNECTION_STRING` esté correcto
- Verificar que Oracle Database esté corriendo

### Error: Cannot find module
- Ejecutar `npm install` nuevamente

### Puerto en uso
- Cambiar el puerto en el archivo `.env`

## Licencia

ISC
