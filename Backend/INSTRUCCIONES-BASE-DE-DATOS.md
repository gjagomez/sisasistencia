# Instrucciones para Configurar la Base de Datos Oracle

## Requisitos Previos
- Oracle Database instalado y funcionando
- Oracle SQL Developer o SQL*Plus
- Usuario de Oracle con permisos para crear tablas

## Paso 1: Configurar las Credenciales de Conexión

Edita el archivo `Backend/src/config/db.js` con tus credenciales de Oracle:

```javascript
module.exports = {
  user: 'TU_USUARIO_ORACLE',
  password: 'TU_PASSWORD_ORACLE',
  connectString: 'localhost:1521/XEPDB1'  // o tu cadena de conexión
};
```

## Paso 2: Crear las Tablas

### Opción A: Usando Oracle SQL Developer

1. Abre Oracle SQL Developer
2. Conéctate a tu base de datos Oracle
3. Abre el archivo `Backend/crear-tablas.sql`
4. Ejecuta el script completo (F5 o botón "Run Script")
5. Verifica que todas las tablas se crearon correctamente

### Opción B: Usando SQL*Plus

```bash
# Conectarse a Oracle
sqlplus TU_USUARIO/TU_PASSWORD@localhost:1521/XEPDB1

# Ejecutar el script
@C:\Users\ROG STRIX\Documents\GitHub\ProyectoDB1\Backend\crear-tablas.sql
```

## Paso 3: Insertar Datos Iniciales

### Opción A: Usando Oracle SQL Developer

1. Abre el archivo `Backend/datos-iniciales.sql`
2. Ejecuta el script completo (F5)
3. Verifica los datos insertados en la salida

### Opción B: Usando SQL*Plus

```bash
# Ejecutar el script de datos iniciales
@C:\Users\ROG STRIX\Documents\GitHub\ProyectoDB1\Backend\datos-iniciales.sql
```

## Credenciales de Acceso Inicial

Después de ejecutar los scripts, podrás iniciar sesión con:

- **Usuario:** admin
- **Contraseña:** admin123
- **Rol:** Administrador

## Verificar la Instalación

### Verificar tablas creadas:

```sql
SELECT table_name FROM user_tables ORDER BY table_name;
```

Deberías ver las siguientes 14 tablas:
1. EMPRESA
2. EMPLEADOS
3. USUARIOS
4. DESASTRE
5. FONDO
6. DONADOR
7. DONACION
8. FAMILIA
9. BENEFICIADO
10. APADRINAMIENTO
11. ARTICULO
12. LOTE
13. ASISTENCIA
14. ESTUDIO_SOCIOECONOMICO

### Verificar datos iniciales:

```sql
-- Verificar empresa
SELECT * FROM Empresa;

-- Verificar empleados
SELECT * FROM Empleados;

-- Verificar usuarios
SELECT * FROM Usuarios;

-- Verificar fondos
SELECT * FROM Fondo;
```

## Paso 4: Iniciar el Backend

Una vez que las tablas estén creadas y los datos iniciales insertados:

```bash
cd Backend
npm install
npm start
```

El servidor debería iniciarse en http://localhost:3000

## Paso 5: Iniciar el Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend debería iniciarse en http://localhost:5173

## Solución de Problemas

### Error: "Converting circular structure to JSON"
- **Causa:** Las tablas no existen en la base de datos
- **Solución:** Ejecuta los scripts `crear-tablas.sql` y `datos-iniciales.sql`

### Error: "ORA-00942: table or view does not exist"
- **Causa:** Las tablas no se crearon correctamente
- **Solución:** Verifica que el usuario tenga permisos CREATE TABLE y ejecuta nuevamente el script

### Error de conexión a la base de datos
- **Causa:** Credenciales incorrectas o servicio Oracle no iniciado
- **Solución:**
  1. Verifica que Oracle esté corriendo
  2. Confirma las credenciales en `Backend/src/config/db.js`
  3. Prueba la conexión en SQL Developer primero

## Estructura de las Tablas

### Tablas Principales:
- **Empresa:** Información de la organización
- **Empleados:** Personal de la organización
- **Usuarios:** Acceso al sistema
- **Donador:** Personas o empresas que donan
- **Donacion:** Registro de donaciones
- **Familia:** Familias beneficiarias
- **Beneficiado:** Miembros de las familias
- **Apadrinamiento:** Relación donador-familia
- **Articulo:** Catálogo de artículos
- **Lote:** Inventario de artículos
- **Asistencia:** Ayuda entregada a familias
- **Desastre:** Registro de desastres
- **Estudio_Socioeconomico:** Análisis económico familiar
- **Fondo:** Fondos monetarios

## Scripts SQL Importantes

### Resetear la base de datos (CUIDADO: Elimina todos los datos)

```sql
-- Ejecutar crear-tablas.sql (que incluye DROP TABLES)
-- Luego ejecutar datos-iniciales.sql
```

### Consultar estadísticas del sistema

```sql
SELECT
  (SELECT COUNT(*) FROM Familia) AS total_familias,
  (SELECT COUNT(*) FROM Donador) AS total_donadores,
  (SELECT COUNT(*) FROM Donacion) AS total_donaciones,
  (SELECT COUNT(*) FROM Asistencia) AS total_asistencias
FROM DUAL;
```

## Notas Adicionales

- Los campos de tipo NUMBER(12,2) permiten almacenar montos monetarios con 2 decimales
- Las fechas se manejan con DATE o TIMESTAMP según el caso
- Los IDs se generan automáticamente con IDENTITY
- Se crearon índices para optimizar consultas frecuentes
- Las restricciones CHECK garantizan integridad de datos
