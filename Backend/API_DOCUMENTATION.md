# API Documentation - Sistema de Asistencia a Víctimas de Desastres Naturales

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear un nuevo usuario

### 2. Donadores
- `GET /api/donadores` - Obtener todos los donadores
- `GET /api/donadores/:id` - Obtener donador por ID
- `POST /api/donadores` - Crear un nuevo donador
- `PUT /api/donadores/:id` - Actualizar donador
- `DELETE /api/donadores/:id` - Eliminar donador

**Ejemplo POST /api/donadores:**
```json
{
  "tipo_donador": "Empresa",
  "nombre": "Empresa XYZ S.A.",
  "nit": "1234567-8",
  "telefono": "2222-2222",
  "email": "contacto@empresa.com",
  "direccion": "Zona 10, Guatemala"
}
```

### 3. Donaciones
- `GET /api/donaciones` - Obtener todas las donaciones
- `GET /api/donaciones/donador/:id_donador` - Obtener donaciones por donador
- `GET /api/donaciones/:id` - Obtener donación por ID
- `POST /api/donaciones` - Crear una nueva donación
- `PUT /api/donaciones/:id` - Actualizar donación
- `DELETE /api/donaciones/:id` - Eliminar donación

**Ejemplo POST /api/donaciones:**
```json
{
  "id_donador": 1,
  "tipo_donacion": "Monetaria",
  "monto_monetario": 5000.00,
  "destino": "Fondo General"
}
```

### 4. Familias Beneficiadas
- `GET /api/familias` - Obtener todas las familias
- `GET /api/familias/apadrinadas` - Obtener familias apadrinadas
- `GET /api/familias/:id` - Obtener familia por ID
- `POST /api/familias` - Registrar una nueva familia
- `PUT /api/familias/:id` - Actualizar familia
- `DELETE /api/familias/:id` - Eliminar familia

**Ejemplo POST /api/familias:**
```json
{
  "jefe_familia": "Juan Pérez",
  "cantidad_miembros": 5,
  "direccion": "Aldea El Socorro",
  "municipio": "San Juan Sacatepéquez",
  "departamento": "Guatemala",
  "es_apadrinada": "No",
  "id_desastre_asociado": 1
}
```

### 5. Beneficiados
- `GET /api/beneficiados` - Obtener todos los beneficiados
- `GET /api/beneficiados/familia/:id_familia` - Obtener beneficiados por familia
- `GET /api/beneficiados/:id` - Obtener beneficiado por ID
- `POST /api/beneficiados` - Registrar un nuevo beneficiado
- `PUT /api/beneficiados/:id` - Actualizar beneficiado
- `DELETE /api/beneficiados/:id` - Eliminar beneficiado

**Ejemplo POST /api/beneficiados:**
```json
{
  "id_familia": 1,
  "nombre": "María",
  "apellido": "Pérez López",
  "dpi": "1234567890101",
  "fecha_nacimiento": "2010-05-15",
  "parentesco": "Hija"
}
```

### 6. Apadrinamiento
- `GET /api/apadrinamientos` - Obtener todos los apadrinamientos
- `GET /api/apadrinamientos/activos` - Obtener apadrinamientos activos
- `GET /api/apadrinamientos/:id` - Obtener apadrinamiento por ID
- `POST /api/apadrinamientos` - Crear un nuevo apadrinamiento
- `PUT /api/apadrinamientos/:id/finalizar` - Finalizar un apadrinamiento
- `DELETE /api/apadrinamientos/:id` - Eliminar apadrinamiento

**Ejemplo POST /api/apadrinamientos:**
```json
{
  "id_donador": 1,
  "id_familia": 1,
  "estado": "Activo"
}
```

### 7. Artículos e Inventario
**Artículos:**
- `GET /api/articulos` - Obtener todos los artículos
- `GET /api/articulos/:id` - Obtener artículo por ID
- `POST /api/articulos` - Crear un nuevo artículo
- `PUT /api/articulos/:id` - Actualizar artículo
- `DELETE /api/articulos/:id` - Eliminar artículo

**Lotes:**
- `GET /api/articulos/lotes/all` - Obtener todos los lotes
- `GET /api/articulos/lotes/proximos-vencer` - Obtener lotes próximos a vencer (query: ?dias=30)
- `GET /api/articulos/:id_articulo/lotes` - Obtener lotes por artículo
- `POST /api/articulos/lotes` - Crear un nuevo lote
- `PUT /api/articulos/lotes/:id` - Actualizar cantidad del lote

**Ejemplo POST /api/articulos:**
```json
{
  "nombre_articulo": "Arroz",
  "categoria": "Alimentos",
  "unidad_medida": "Quintal",
  "costo": 150.00
}
```

**Ejemplo POST /api/articulos/lotes:**
```json
{
  "id_articulo": 1,
  "fecha_vencimiento": "2025-12-31",
  "cantidad_inicial": 100,
  "origen": "Donación Empresa XYZ"
}
```

### 8. Asistencia
- `GET /api/asistencias` - Obtener todas las asistencias
- `GET /api/asistencias/familia/:id_familia` - Obtener asistencias por familia
- `GET /api/asistencias/:id` - Obtener asistencia por ID
- `POST /api/asistencias` - Registrar una nueva asistencia
- `PUT /api/asistencias/:id` - Actualizar asistencia
- `DELETE /api/asistencias/:id` - Eliminar asistencia

**Ejemplo POST /api/asistencias:**
```json
{
  "id_familia": 1,
  "tipo_asistencia": "Alimentos",
  "id_lote": 1,
  "cantidad_entregada": 2,
  "valor_estimado": 300.00,
  "observaciones": "Entrega mensual"
}
```

### 9. Desastres
- `GET /api/desastres` - Obtener todos los desastres
- `GET /api/desastres/:id` - Obtener desastre por ID
- `GET /api/desastres/:id/familias` - Obtener familias afectadas por un desastre
- `POST /api/desastres` - Registrar un nuevo desastre
- `PUT /api/desastres/:id` - Actualizar desastre
- `DELETE /api/desastres/:id` - Eliminar desastre

**Ejemplo POST /api/desastres:**
```json
{
  "nombre_desastre": "Terremoto 2024",
  "tipo_desastre": "Sismo",
  "fecha_desastre": "2024-01-15",
  "ubicacion": "San Marcos, Guatemala",
  "descripcion": "Terremoto de magnitud 6.5"
}
```

### 10. Estudios Socioeconómicos
- `GET /api/estudios` - Obtener todos los estudios
- `GET /api/estudios/familia/:id_familia` - Obtener estudios por familia
- `GET /api/estudios/familia/:id_familia/ultimo` - Obtener último estudio de una familia
- `GET /api/estudios/:id` - Obtener estudio por ID
- `POST /api/estudios` - Crear un nuevo estudio
- `PUT /api/estudios/:id` - Actualizar estudio
- `DELETE /api/estudios/:id` - Eliminar estudio

**Ejemplo POST /api/estudios:**
```json
{
  "id_familia": 1,
  "ingresos_familiares": 2500.00,
  "gastos_familiares": 2800.00,
  "conclusion": "La familia aún requiere apoyo",
  "observaciones": "Ingresos insuficientes para cubrir necesidades básicas"
}
```

### 11. Fondos
- `GET /api/fondos` - Obtener todos los fondos
- `GET /api/fondos/:id` - Obtener fondo por ID
- `POST /api/fondos` - Crear un nuevo fondo
- `PUT /api/fondos/:id/saldo` - Actualizar saldo del fondo
- `PUT /api/fondos/:id` - Actualizar información del fondo
- `DELETE /api/fondos/:id` - Eliminar fondo

**Ejemplo POST /api/fondos:**
```json
{
  "nombre_fondo": "Fondo de Emergencias",
  "saldo": 50000.00,
  "descripcion": "Fondo para atención de desastres naturales"
}
```

**Ejemplo PUT /api/fondos/:id/saldo:**
```json
{
  "monto": 5000.00,
  "operacion": "incrementar"
}
```

### 12. Estadísticas y Reportes
- `GET /api/estadisticas/dashboard` - Estadísticas generales del dashboard
- `GET /api/estadisticas/donaciones-mes` - Donaciones por mes (query: ?anio=2024)
- `GET /api/estadisticas/desastres` - Estadísticas de desastres y familias afectadas
- `GET /api/estadisticas/top-donadores` - Top donadores (query: ?limite=10)
- `GET /api/estadisticas/inventario` - Inventario disponible
- `GET /api/estadisticas/asistencias-tipo` - Asistencias por tipo
- `GET /api/estadisticas/distribucion-geografica` - Distribución geográfica de familias

**Respuesta GET /api/estadisticas/dashboard:**
```json
{
  "totalFamilias": 150,
  "totalBeneficiados": 650,
  "familiasApadrinadas": 45,
  "totalDonadores": 80,
  "donacionesAnio": 250000.00,
  "saldoFondos": 100000.00,
  "totalAsistencias": 320,
  "articulosProximosVencer": 5
}
```

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error en los datos enviados
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Notas

- Todas las fechas deben estar en formato `YYYY-MM-DD`
- Los montos deben ser números decimales con máximo 2 decimales
- El servidor corre en el puerto 3000 por defecto
- CORS está habilitado para todas las peticiones
