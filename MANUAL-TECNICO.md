# Manual Técnico
## Sistema de Asistencia a las Víctimas de Desastres Naturales

**Versión:** 1.0
**Fecha:** Octubre 2025
**Stack Tecnológico:** React + Express.js + Oracle Database

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Requisitos del Sistema](#3-requisitos-del-sistema)
4. [Instalación y Configuración](#4-instalación-y-configuración)
5. [Estructura de la Base de Datos](#5-estructura-de-la-base-de-datos)
6. [Backend - API REST](#6-backend---api-rest)
7. [Frontend - Aplicación React](#7-frontend---aplicación-react)


---

## 1. Introducción

### 1.1 Propósito del Manual

Este manual técnico proporciona información detallada sobre la arquitectura, implementación, configuración y mantenimiento del Sistema de Asistencia a las Víctimas de Desastres Naturales.

**Audiencia:**
- Desarrolladores que mantendrán o extenderán el sistema
- Administradores de sistemas encargados del despliegue
- Arquitectos de software que requieren entender la solución
- Personal de TI responsable del soporte técnico

### 1.2 Alcance del Sistema

El sistema es una aplicación web full-stack que gestiona:

- **Módulos funcionales:**
  - Gestión de donadores y donaciones
  - Administración de familias beneficiadas
  - Control de inventario con lotes perecederos
  - Apadrinamientos familia-donador
  - Estudios socioeconómicos
  - Registro de desastres naturales
  - Reportes y estadísticas

- **Características técnicas:**
  - Arquitectura cliente-servidor
  - API RESTful
  - Base de datos relacional Oracle
  - Interfaz web responsive
  - Autenticación de usuarios
  - Generación de reportes PDF

### 1.3 Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Backend** | Node.js | 18.x+ |
| | Express.js | 5.x |
| | OracleDB Driver | 6.9.0 |
| **Frontend** | React | 19.x |
| | React Router | 7.x |
| | Axios | 1.12+ |
| | Recharts | 3.3+ |
| | Lucide React | 0.546+ |
| **Base de Datos** | Oracle Database | 19c+ |
| **Build Tools** | Vite | 7.x |
| | Nodemon | 3.x |

---

## 2. Arquitectura del Sistema

### 2.1 Arquitectura General

El sistema sigue una arquitectura de **tres capas**:

```
┌─────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN            │
│   (React + React Router + Axios)        │
│   - Interfaz de usuario                 │
│   - Validación de formularios           │
│   - Renderizado de componentes          │
└─────────────┬───────────────────────────┘
              │ HTTP/HTTPS
              │ (REST API)
┌─────────────▼───────────────────────────┐
│         CAPA DE APLICACIÓN              │
│   (Express.js + Node.js)                │
│   - Controladores                       │
│   - Rutas                               │
│   - Lógica de negocio                   │
│   - Middleware (CORS, Auth)             │
└─────────────┬───────────────────────────┘
              │ OracleDB Driver
              │ (Connection Pool)
┌─────────────▼───────────────────────────┐
│         CAPA DE DATOS                   │
│   (Oracle Database 19c)                 │
│   - Tablas                              │
│   - Índices                             │
│   - Constraints                         │
│   - Stored Procedures (opcional)        │
└─────────────────────────────────────────┘
```

### 2.2 Patrón de Diseño

**Arquitectura MVC (Model-View-Controller):**

- **Model (Modelo):** Base de datos Oracle con esquema relacional
- **View (Vista):** Componentes React
- **Controller (Controlador):** Controladores Express.js

**Patrón de Comunicación:**
- Cliente-Servidor basado en REST
- JSON como formato de intercambio de datos
- Stateless API (sin estado en el servidor)

### 2.3 Diagrama de Componentes

```
Frontend (React App)
├── Pages (Vistas principales)
│   ├── Dashboard
│   ├── Donadores
│   ├── Donaciones
│   ├── Familias
│   └── ... (otros módulos)
├── Components (Componentes reutilizables)
│   ├── Drawer
│   ├── Toast
│   └── ... (otros componentes)
├── Services (Comunicación con API)
│   ├── api.js (Cliente Axios)
│   ├── authService.js
│   ├── donadorService.js
│   └── ... (otros servicios)
└── Layouts
    └── MainLayout (Layout principal con sidebar)

Backend (Express API)
├── Routes (Definición de endpoints)
│   ├── AuthRoutes.js
│   ├── DonadorRoutes.js
│   └── ... (otras rutas)
├── Controllers (Lógica de negocio)
│   ├── AuthController.js
│   ├── DonadorController.js
│   └── ... (otros controladores)
├── Config
│   └── db.js (Configuración Oracle)
└── Middlewares
    └── cors.js (Configuración CORS)

Database (Oracle)
├── Tablas (14 tablas principales)
├── Constraints (FK, PK, Check)
└── Índices (Para optimización)
```

### 2.4 Flujo de una Petición

```
1. Usuario → [React Component]
        ↓
2. Component llama a servicio → [donadorService.js]
        ↓
3. Servicio hace petición HTTP → [Axios → Express API]
        ↓
4. Router recibe petición → [DonadorRoutes.js]
        ↓
5. Router delega a controlador → [DonadorController.js]
        ↓
6. Controlador ejecuta SQL → [Oracle Database]
        ↓
7. Base de datos retorna resultados → [Controller]
        ↓
8. Controller formatea respuesta → [JSON Response]
        ↓
9. Respuesta viaja al frontend → [Axios Promise]
        ↓
10. Component actualiza estado → [React useState/Context]
        ↓
11. UI se actualiza → [React Re-render]
```

---

## 3. Requisitos del Sistema

### 3.1 Requisitos de Hardware

**Servidor (Producción):**
- Procesador: 4 cores mínimo (8+ recomendado)
- RAM: 8 GB mínimo (16 GB+ recomendado)
- Almacenamiento: 100 GB SSD mínimo
- Red: 100 Mbps mínimo

**Desarrollo:**
- Procesador: Intel Core i5 o equivalente
- RAM: 8 GB mínimo
- Almacenamiento: 20 GB disponibles
- Red: Conexión a Internet

### 3.2 Requisitos de Software

**Servidor:**
- Sistema Operativo: Linux (Ubuntu 20.04+, CentOS 8+), Windows Server 2019+
- Node.js: v18.x o superior
- Oracle Database: 19c, 21c o XE (Express Edition)
- Servidor Web (opcional): Nginx o Apache para proxy reverso

**Desarrollo:**
- Sistema Operativo: Windows 10/11, macOS 10.15+, Linux
- Node.js: v18.x o superior
- npm: v9.x o superior
- Git: 2.x+
- Editor de código: VS Code, WebStorm o similar
- Cliente Oracle: SQL Developer o DBeaver

### 3.3 Puertos Utilizados

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend Dev | 5173 | Vite Dev Server |
| Backend API | 3000 | Express.js Server |
| Oracle Database | 1521 | Oracle Listener |
| Oracle EM Express | 5500 | Oracle Web Console |

---

## 4. Instalación y Configuración

### 4.1 Instalación de Dependencias

#### 4.1.1 Instalar Node.js

**Windows/macOS:**
1. Descargar desde: https://nodejs.org/
2. Ejecutar instalador
3. Verificar instalación:
```bash
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4.1.2 Instalar Oracle Database

**Oracle XE (Express Edition) - Recomendado para desarrollo:**

**Windows:**
1. Descargar Oracle XE desde Oracle.com
2. Ejecutar instalador
3. Configurar contraseña de SYS/SYSTEM
4. El servicio inicia automáticamente

**Linux:**
```bash
# Ubuntu/Debian
wget https://download.oracle.com/otn-pub/otn_software/db-express/oracle-database-xe-21c-1.0-1.ol7.x86_64.rpm
sudo alien -i oracle-database-xe-21c-1.0-1.ol7.x86_64.rpm
sudo /etc/init.d/oracle-xe-21c configure
```

**Verificar instalación:**
```bash
sqlplus sys/password@localhost:1521/XEPDB1 as sysdba
```

#### 4.1.3 Instalar Cliente Oracle Instant Client

El driver `oracledb` requiere Oracle Instant Client.

**Windows:**
1. Descargar Oracle Instant Client Basic desde Oracle.com
2. Extraer en `C:\oracle\instantclient_19_x`
3. Agregar a PATH del sistema:
```
C:\oracle\instantclient_19_x
```

**Linux:**
```bash
sudo apt-get install libaio1
wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linux.x64-19.x.zip
sudo unzip instantclient-basic-linux.x64-19.x.zip -d /opt/oracle
echo /opt/oracle/instantclient_19_x > /etc/ld.so.conf.d/oracle-instantclient.conf
sudo ldconfig
```

**macOS:**
```bash
brew tap InstantClientTap/instantclient
brew install instantclient-basic
```

### 4.2 Configuración de la Base de Datos

#### 4.2.1 Crear Usuario de Base de Datos

Conectarse como SYSDBA:
```sql
sqlplus sys/password@localhost:1521/XEPDB1 as sysdba
```

Crear usuario para la aplicación:
```sql
-- Crear usuario
CREATE USER desastres_user IDENTIFIED BY "SecurePassword123";

-- Otorgar privilegios
GRANT CONNECT, RESOURCE TO desastres_user;
GRANT CREATE SESSION TO desastres_user;
GRANT UNLIMITED TABLESPACE TO desastres_user;

-- Privilegios adicionales (si es necesario)
GRANT CREATE VIEW TO desastres_user;
GRANT CREATE PROCEDURE TO desastres_user;

-- Confirmar
COMMIT;
```

#### 4.2.2 Crear Esquema de Base de Datos

Conectarse como el usuario de la aplicación:
```sql
sqlplus desastres_user/SecurePassword123@localhost:1521/XEPDB1
```

Ejecutar el script de creación de tablas:
```bash
cd Backend
sqlplus desastres_user/SecurePassword123@localhost:1521/XEPDB1 @crear-tablas.sql
```

Insertar datos iniciales:
```bash
sqlplus desastres_user/SecurePassword123@localhost:1521/XEPDB1 @datos-iniciales.sql
```

#### 4.2.3 Verificar Tablas Creadas

```sql
SELECT table_name FROM user_tables ORDER BY table_name;
```

Debería mostrar:
```
APADRINAMIENTO
ARTICULO
ASISTENCIA
BENEFICIADO
DESASTRE
DONACION
DONADOR
EMPLEADOS
EMPRESA
ESTUDIO_SOCIOECONOMICO
FAMILIA
FONDO
LOTE
USUARIOS
```

### 4.3 Configuración del Backend

#### 4.3.1 Clonar el Repositorio

```bash
git clone https://github.com/tu-org/ProyectoDB1.git
cd ProyectoDB1
```

#### 4.3.2 Instalar Dependencias del Backend

```bash
cd Backend
npm install
```

Dependencias instaladas:
- express: Framework web
- cors: Middleware para CORS
- dotenv: Variables de entorno
- oracledb: Driver de Oracle
- nodemon: Auto-restart en desarrollo

#### 4.3.3 Configurar Variables de Entorno

Crear archivo `.env` en `Backend/`:

```env
# Backend/.env

# Puerto del servidor
PORT=3000

# Configuración de Oracle Database
DB_USER=desastres_user
DB_PASSWORD=SecurePassword123
DB_CONNECTION_STRING=localhost:1521/XEPDB1

# Pool de conexiones
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_INCREMENT=2

# Entorno
NODE_ENV=development

# Configuración de CORS
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# JWT Secret (para futuras implementaciones)
JWT_SECRET=your-secret-key-change-in-production
```

**IMPORTANTE:**
- Cambie `DB_PASSWORD` por su contraseña real
- Cambie `JWT_SECRET` en producción
- Nunca suba el archivo `.env` a Git (ya está en `.gitignore`)

#### 4.3.4 Iniciar el Backend

**Desarrollo (con auto-restart):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

Debería ver:
```
🔌 Conectado a Oracle Database: XEPDB1
🚀 Servidor corriendo en el puerto 3000
📊 API disponible en http://localhost:3000
💚 Estado de la API: http://localhost:3000/api/health
```

#### 4.3.5 Probar la Conexión

Abrir navegador en:
```
http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "API funcionando correctamente",
  "timestamp": "2025-10-23T20:30:00.000Z"
}
```

### 4.4 Configuración del Frontend

#### 4.4.1 Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

Dependencias instaladas:
- react: Librería principal
- react-dom: Renderizado de React
- react-router-dom: Enrutamiento
- axios: Cliente HTTP
- recharts: Gráficos
- lucide-react: Iconos
- @react-pdf/renderer: Generación de PDFs

#### 4.4.2 Configurar Variables de Entorno (Opcional)

Crear archivo `.env` en `frontend/`:

```env
# frontend/.env

# URL del backend
VITE_API_URL=http://localhost:3000/api

# Configuración adicional
VITE_APP_NAME=Sistema de Asistencia
```

**Nota:** Vite requiere el prefijo `VITE_` para variables de entorno.

#### 4.4.3 Configurar URL del Backend

Si no usa variables de entorno, editar `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

#### 4.4.4 Iniciar el Frontend

**Desarrollo:**
```bash
npm run dev
```

Debería ver:
```
  VITE v7.1.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 4.4.5 Acceder a la Aplicación

Abrir navegador en:
```
http://localhost:5173
```

Debería redirigir a:
```
http://localhost:5173/login
```

### 4.5 Crear Usuario Inicial

Ejecutar el script SQL para crear usuario de prueba:

```sql
-- Insertar empresa
INSERT INTO Empresa (nombre_empresa, nit, direccion, telefono, email, estado)
VALUES ('Organización de Ayuda', '1234567-8', 'Guatemala', '2222-2222', 'contacto@org.com', 'Activa');

-- Insertar empleado
INSERT INTO Empleados (id_empresa, nombre, apellido, dpi, puesto, email)
VALUES (
  (SELECT id_empresa FROM Empresa WHERE nombre_empresa = 'Organización de Ayuda'),
  'Admin', 'Sistema', '1234567890101', 'Administrador', 'admin@sistema.com'
);

-- Crear usuario admin
INSERT INTO Usuarios (id_empleado, nombre_usuario, password, rol, estado)
VALUES (
  (SELECT id_empleado FROM Empleados WHERE email = 'admin@sistema.com'),
  'admin', 'admin123', 'Administrador', 'Activo'
);

COMMIT;
```

**Credenciales de acceso:**
- Usuario: `admin`
- Contraseña: `admin123`

### 4.6 Build para Producción

#### 4.6.1 Build del Frontend

```bash
cd frontend
npm run build
```

Esto genera una carpeta `dist/` con archivos estáticos optimizados.

#### 4.6.2 Servir Frontend desde Backend (Opcional)

Configurar Express para servir archivos estáticos:

```javascript
// Backend/src/index.js

const path = require('path');

// Después de las rutas de API
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
```

Ahora el backend sirve también el frontend en el puerto 3000.

---

## 5. Estructura de la Base de Datos

### 5.1 Diagrama Entidad-Relación (ERD)

```
                    ┌──────────────┐
                    │   EMPRESA    │
                    └──────┬───────┘
                           │ 1
                           │
                           │ N
                    ┌──────▼────────┐
                    │  EMPLEADOS    │
                    └──────┬────────┘
                           │ 1
                           │
                           │ 1
                    ┌──────▼────────┐
                    │   USUARIOS    │
                    └───────────────┘

┌──────────┐         ┌──────────┐         ┌──────────┐
│ DONADOR  │────N───│ DONACION │         │ DESASTRE │
└────┬─────┘         └──────────┘         └────┬─────┘
     │ 1                                        │ 1
     │                                          │
     │ N                  ┌──────────┐         │ N
     └───────────────────│  FAMILIA  │─────────┘
                         └────┬──────┘
                              │ 1
                ┌─────────────┼─────────────┐
                │             │             │
                │ N           │ N           │ N
        ┌───────▼─────┐ ┌────▼──────┐ ┌───▼────────────────┐
        │APADRINAMIENTO│ │BENEFICIADO│ │ESTUDIO_SOCIOEC     │
        └──────────────┘ └───────────┘ └────────────────────┘

                         ┌──────────┐
                         │ ARTICULO │
                         └────┬─────┘
                              │ 1
                              │
                              │ N
                         ┌────▼──────┐
                         │   LOTE    │
                         └────┬──────┘
                              │ 1
                              │
                              │ N
                         ┌────▼──────────┐
                         │  ASISTENCIA   │─────N────→ FAMILIA
                         └───────────────┘

┌──────────┐
│  FONDO   │ (Independiente)
└──────────┘
```

### 5.2 Descripción de Tablas

#### 5.2.1 Empresa

Almacena información de la organización.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_empresa | NUMBER | PK, AUTO | ID único |
| nombre_empresa | VARCHAR2(200) | NOT NULL | Nombre de la organización |
| nit | VARCHAR2(20) | | NIT |
| direccion | VARCHAR2(300) | | Dirección |
| telefono | VARCHAR2(20) | | Teléfono |
| email | VARCHAR2(100) | | Email |
| estado | VARCHAR2(20) | DEFAULT 'Activa' | Estado |
| fecha_fundacion | DATE | | Fecha de fundación |

**Índices:**
- PRIMARY KEY en `id_empresa`

**Relaciones:**
- 1:N con Empleados

---

#### 5.2.2 Empleados

Almacena información de empleados de la organización.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_empleado | NUMBER | PK, AUTO | ID único |
| id_empresa | NUMBER | FK, NOT NULL | Empresa a la que pertenece |
| nombre | VARCHAR2(100) | NOT NULL | Nombre |
| apellido | VARCHAR2(100) | NOT NULL | Apellido |
| dpi | VARCHAR2(20) | | DPI |
| puesto | VARCHAR2(100) | | Puesto |
| email | VARCHAR2(100) | | Email |
| fecha_contratacion | DATE | DEFAULT SYSDATE | Fecha de contratación |

**Índices:**
- PRIMARY KEY en `id_empleado`
- FOREIGN KEY `id_empresa` → Empresa(id_empresa)
- INDEX en `id_empresa`

**Relaciones:**
- N:1 con Empresa
- 1:N con Usuarios

---

#### 5.2.3 Usuarios

Almacena credenciales de usuarios del sistema.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_usuario | NUMBER | PK, AUTO | ID único |
| id_empleado | NUMBER | FK, NOT NULL | Empleado asociado |
| nombre_usuario | VARCHAR2(50) | UNIQUE, NOT NULL | Username |
| password | VARCHAR2(255) | NOT NULL | Contraseña (texto plano) |
| rol | VARCHAR2(50) | CHECK, DEFAULT 'Usuario' | Rol: Administrador, Usuario, Consulta |
| estado | VARCHAR2(20) | CHECK, DEFAULT 'Activo' | Estado: Activo, Inactivo |
| fecha_creacion | DATE | DEFAULT SYSDATE | Fecha de creación |

**Índices:**
- PRIMARY KEY en `id_usuario`
- UNIQUE KEY en `nombre_usuario`
- FOREIGN KEY `id_empleado` → Empleados(id_empleado)
- INDEX en `id_empleado`

**Relaciones:**
- N:1 con Empleados

**Nota de Seguridad:** Las contraseñas están en texto plano. En producción se recomienda usar bcrypt.

---

#### 5.2.4 Donador

Almacena información de donadores (personas o empresas).

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_donador | NUMBER | PK, AUTO | ID único |
| tipo_donador | VARCHAR2(20) | CHECK | Persona o Empresa |
| nombre | VARCHAR2(200) | NOT NULL | Nombre completo o razón social |
| dpi | VARCHAR2(20) | | DPI (personas) |
| nit | VARCHAR2(20) | | NIT |
| telefono | VARCHAR2(20) | | Teléfono |
| email | VARCHAR2(100) | | Email |
| direccion | VARCHAR2(300) | | Dirección |

**Índices:**
- PRIMARY KEY en `id_donador`
- INDEX en `tipo_donador` (opcional, para filtros rápidos)

**Relaciones:**
- 1:N con Donacion
- 1:N con Apadrinamiento

---

#### 5.2.5 Donacion

Almacena donaciones recibidas.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_donacion | NUMBER | PK, AUTO | ID único |
| id_donador | NUMBER | FK, NOT NULL | Donador que realizó la donación |
| fecha_donacion | DATE | DEFAULT SYSDATE | Fecha de la donación |
| tipo_donacion | VARCHAR2(50) | CHECK | Monetaria, Especie, Mixta |
| monto_monetario | NUMBER(12,2) | | Monto en dinero |
| descripcion_especie | VARCHAR2(500) | | Descripción de artículos |
| destino | VARCHAR2(200) | | Destino de la donación |

**Índices:**
- PRIMARY KEY en `id_donacion`
- FOREIGN KEY `id_donador` → Donador(id_donador)
- INDEX en `id_donador`
- INDEX en `fecha_donacion` (para reportes)

**Relaciones:**
- N:1 con Donador

---

#### 5.2.6 Desastre

Almacena eventos de desastres naturales.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_desastre | NUMBER | PK, AUTO | ID único |
| nombre_desastre | VARCHAR2(200) | NOT NULL | Nombre del evento |
| tipo_desastre | VARCHAR2(100) | | Tipo: Terremoto, Huracán, etc. |
| fecha_desastre | DATE | | Fecha del evento |
| ubicacion | VARCHAR2(300) | | Ubicación afectada |
| descripcion | VARCHAR2(1000) | | Descripción detallada |

**Índices:**
- PRIMARY KEY en `id_desastre`
- INDEX en `fecha_desastre`

**Relaciones:**
- 1:N con Familia

---

#### 5.2.7 Familia

Almacena familias beneficiadas.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_familia | NUMBER | PK, AUTO | ID único |
| jefe_familia | VARCHAR2(200) | NOT NULL | Nombre del jefe de familia |
| cantidad_miembros | NUMBER | NOT NULL | Número de miembros |
| direccion | VARCHAR2(300) | | Dirección |
| municipio | VARCHAR2(100) | | Municipio |
| departamento | VARCHAR2(100) | | Departamento |
| es_apadrinada | VARCHAR2(2) | CHECK, DEFAULT 'No' | Sí o No |
| id_desastre_asociado | NUMBER | FK | Desastre que afectó la familia |
| fecha_registro | DATE | DEFAULT SYSDATE | Fecha de registro |

**Índices:**
- PRIMARY KEY en `id_familia`
- FOREIGN KEY `id_desastre_asociado` → Desastre(id_desastre)
- INDEX en `id_desastre_asociado`
- INDEX en `es_apadrinada`
- INDEX en `departamento` (para filtros geográficos)

**Relaciones:**
- N:1 con Desastre
- 1:N con Beneficiado
- 1:N con Apadrinamiento
- 1:N con Asistencia
- 1:N con Estudio_Socioeconomico

---

#### 5.2.8 Beneficiado

Almacena miembros individuales de las familias.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_beneficiado | NUMBER | PK, AUTO | ID único |
| id_familia | NUMBER | FK, NOT NULL | Familia a la que pertenece |
| nombre | VARCHAR2(100) | NOT NULL | Nombre |
| apellido | VARCHAR2(100) | | Apellido |
| dpi | VARCHAR2(20) | | DPI (mayores de edad) |
| fecha_nacimiento | DATE | | Fecha de nacimiento |
| parentesco | VARCHAR2(50) | | Parentesco con jefe de familia |

**Índices:**
- PRIMARY KEY en `id_beneficiado`
- FOREIGN KEY `id_familia` → Familia(id_familia)
- INDEX en `id_familia`

**Relaciones:**
- N:1 con Familia

---

#### 5.2.9 Apadrinamiento

Relaciona donadores con familias (apadrinamiento).

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_apadrinamiento | NUMBER | PK, AUTO | ID único |
| id_donador | NUMBER | FK, NOT NULL | Padrino |
| id_familia | NUMBER | FK, NOT NULL | Familia apadrinada |
| fecha_inicio | DATE | DEFAULT SYSDATE | Fecha de inicio |
| fecha_fin | DATE | | Fecha de finalización |
| estado | VARCHAR2(20) | CHECK, DEFAULT 'Activo' | Activo o Finalizado |

**Índices:**
- PRIMARY KEY en `id_apadrinamiento`
- FOREIGN KEY `id_donador` → Donador(id_donador)
- FOREIGN KEY `id_familia` → Familia(id_familia)
- INDEX en `id_donador`
- INDEX en `id_familia`
- INDEX en `estado`

**Relaciones:**
- N:1 con Donador
- N:1 con Familia

**Lógica de Negocio:**
- Una familia solo puede tener un apadrinamiento activo a la vez
- Un donador puede apadrinar múltiples familias

---

#### 5.2.10 Articulo

Catálogo de artículos del inventario.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_articulo | NUMBER | PK, AUTO | ID único |
| nombre_articulo | VARCHAR2(200) | NOT NULL | Nombre del artículo |
| categoria | VARCHAR2(100) | | Categoría: Alimentos, Medicamentos, etc. |
| unidad_medida | VARCHAR2(50) | | Unidad: Quintal, Libra, Litro, etc. |
| costo | NUMBER(10,2) | | Costo unitario promedio |

**Índices:**
- PRIMARY KEY en `id_articulo`
- INDEX en `categoria`

**Relaciones:**
- 1:N con Lote

---

#### 5.2.11 Lote

Lotes de artículos con fecha de vencimiento.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_lote | NUMBER | PK, AUTO | ID único |
| id_articulo | NUMBER | FK, NOT NULL | Artículo del lote |
| cantidad_inicial | NUMBER | NOT NULL | Cantidad original |
| cantidad_disponible | NUMBER | NOT NULL | Cantidad actual disponible |
| fecha_entrada | DATE | DEFAULT SYSDATE | Fecha de ingreso |
| fecha_vencimiento | DATE | | Fecha de vencimiento (opcional) |
| origen | VARCHAR2(200) | | Origen del lote |

**Índices:**
- PRIMARY KEY en `id_lote`
- FOREIGN KEY `id_articulo` → Articulo(id_articulo)
- INDEX en `id_articulo`
- INDEX en `fecha_vencimiento` (para alertas)

**Relaciones:**
- N:1 con Articulo
- 1:N con Asistencia

**Lógica de Negocio:**
- `cantidad_disponible` se descuenta al registrar asistencias
- Alertas cuando `fecha_vencimiento` está a menos de 30 días

---

#### 5.2.12 Asistencia

Registra entregas de ayuda a familias.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_asistencia | NUMBER | PK, AUTO | ID único |
| id_familia | NUMBER | FK, NOT NULL | Familia que recibe |
| tipo_asistencia | VARCHAR2(100) | | Tipo: Alimentos, Medicamentos, etc. |
| id_lote | NUMBER | FK | Lote del que se toma (opcional) |
| cantidad_entregada | NUMBER | | Cantidad entregada |
| valor_estimado | NUMBER(12,2) | | Valor monetario estimado |
| fecha_entrega | DATE | DEFAULT SYSDATE | Fecha de entrega |
| observaciones | VARCHAR2(500) | | Observaciones |

**Índices:**
- PRIMARY KEY en `id_asistencia`
- FOREIGN KEY `id_familia` → Familia(id_familia)
- FOREIGN KEY `id_lote` → Lote(id_lote)
- INDEX en `id_familia`
- INDEX en `fecha_entrega`

**Relaciones:**
- N:1 con Familia
- N:1 con Lote

**Lógica de Negocio:**
- Al insertar, actualizar `cantidad_disponible` del Lote
- `valor_estimado` = `cantidad_entregada` × `costo` del artículo

---

#### 5.2.13 Estudio_Socioeconomico

Estudios socioeconómicos de familias.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_estudio | NUMBER | PK, AUTO | ID único |
| id_familia | NUMBER | FK, NOT NULL | Familia evaluada |
| fecha_estudio | DATE | DEFAULT SYSDATE | Fecha del estudio |
| ingresos_familiares | NUMBER(12,2) | | Ingresos mensuales |
| gastos_familiares | NUMBER(12,2) | | Gastos mensuales |
| conclusion | VARCHAR2(1000) | | Conclusión del estudio |
| observaciones | VARCHAR2(1000) | | Observaciones |

**Índices:**
- PRIMARY KEY en `id_estudio`
- FOREIGN KEY `id_familia` → Familia(id_familia)
- INDEX en `id_familia`
- INDEX en `fecha_estudio`

**Relaciones:**
- N:1 con Familia

**Lógica de Negocio:**
- Se recomienda realizar estudios cada 6 meses
- Usar para decidir finalización de apadrinamientos

---

#### 5.2.14 Fondo

Fondos económicos de la organización.

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id_fondo | NUMBER | PK, AUTO | ID único |
| nombre_fondo | VARCHAR2(200) | NOT NULL | Nombre del fondo |
| saldo | NUMBER(12,2) | DEFAULT 0 | Saldo actual |
| descripcion | VARCHAR2(500) | | Descripción del propósito |
| ultima_actualizacion | TIMESTAMP | DEFAULT SYSTIMESTAMP | Última modificación |

**Índices:**
- PRIMARY KEY en `id_fondo`

**Relaciones:**
- Ninguna (tabla independiente)

**Lógica de Negocio:**
- Incrementar al recibir donaciones monetarias
- Disminuir al realizar compras
- Mantener trazabilidad de movimientos (log)

---

### 5.3 Constraints y Validaciones

#### 5.3.1 Foreign Keys

Todas las relaciones N:1 tienen constraints de Foreign Key con:
- `ON DELETE CASCADE` (opcional, según política)
- `ON DELETE RESTRICT` (default, evita eliminar si hay dependencias)

#### 5.3.2 Check Constraints

| Tabla | Campo | Constraint |
|-------|-------|-----------|
| Usuarios | rol | CHECK (rol IN ('Administrador', 'Usuario', 'Consulta')) |
| Usuarios | estado | CHECK (estado IN ('Activo', 'Inactivo')) |
| Donador | tipo_donador | CHECK (tipo_donador IN ('Persona', 'Empresa')) |
| Donacion | tipo_donacion | CHECK (tipo_donacion IN ('Monetaria', 'Especie', 'Mixta')) |
| Familia | es_apadrinada | CHECK (es_apadrinada IN ('Sí', 'No')) |
| Apadrinamiento | estado | CHECK (estado IN ('Activo', 'Finalizado')) |

#### 5.3.3 Unique Constraints

| Tabla | Campo | Razón |
|-------|-------|-------|
| Usuarios | nombre_usuario | Evitar duplicados de login |

### 5.4 Scripts SQL de Mantenimiento

#### 5.4.1 Obtener Stock Actual de Artículos

```sql
SELECT
    a.id_articulo,
    a.nombre_articulo,
    a.categoria,
    SUM(l.cantidad_disponible) as stock_total,
    a.unidad_medida
FROM Articulo a
LEFT JOIN Lote l ON a.id_articulo = l.id_articulo
GROUP BY a.id_articulo, a.nombre_articulo, a.categoria, a.unidad_medida
ORDER BY a.nombre_articulo;
```

#### 5.4.2 Lotes Próximos a Vencer

```sql
SELECT
    l.id_lote,
    a.nombre_articulo,
    l.cantidad_disponible,
    l.fecha_vencimiento,
    TRUNC(l.fecha_vencimiento - SYSDATE) as dias_restantes
FROM Lote l
INNER JOIN Articulo a ON l.id_articulo = a.id_articulo
WHERE l.fecha_vencimiento IS NOT NULL
  AND l.fecha_vencimiento <= SYSDATE + 30
  AND l.cantidad_disponible > 0
ORDER BY l.fecha_vencimiento ASC;
```

#### 5.4.3 Familias sin Estudio Socioeconómico

```sql
SELECT
    f.id_familia,
    f.jefe_familia,
    f.municipio,
    f.es_apadrinada,
    f.fecha_registro
FROM Familia f
WHERE NOT EXISTS (
    SELECT 1
    FROM Estudio_Socioeconomico e
    WHERE e.id_familia = f.id_familia
)
ORDER BY f.fecha_registro DESC;
```

#### 5.4.4 Top Donadores por Monto

```sql
SELECT
    d.nombre,
    d.tipo_donador,
    COUNT(don.id_donacion) as total_donaciones,
    SUM(don.monto_monetario) as total_donado
FROM Donador d
LEFT JOIN Donacion don ON d.id_donador = don.id_donador
WHERE don.tipo_donacion IN ('Monetaria', 'Mixta')
GROUP BY d.id_donador, d.nombre, d.tipo_donador
ORDER BY total_donado DESC NULLS LAST
FETCH FIRST 10 ROWS ONLY;
```

---

## 6. Backend - API REST

### 6.1 Estructura del Backend

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Configuración Oracle DB
│   ├── controllers/
│   │   ├── AuthController.js     # Login, logout
│   │   ├── DonadorController.js  # CRUD Donadores
│   │   ├── DonacionController.js # CRUD Donaciones
│   │   ├── FamiliaController.js  # CRUD Familias
│   │   ├── BeneficiadoController.js
│   │   ├── ApadrinamientoController.js
│   │   ├── ArticuloController.js
│   │   ├── AsistenciaController.js
│   │   ├── DesastreController.js
│   │   ├── EstudioSocioEcController.js
│   │   ├── FondoController.js
│   │   ├── EstadisticasController.js
│   │   └── ReportesController.js
│   ├── middlewares/
│   │   └── cors.js               # Configuración CORS
│   ├── routes/
│   │   ├── AuthRoutes.js
│   │   ├── UserRoutes.js
│   │   ├── DonadorRoutes.js
│   │   ├── DonacionRoutes.js
│   │   ├── FamiliaRoutes.js
│   │   ├── BeneficiadoRoutes.js
│   │   ├── ApadrinamientoRoutes.js
│   │   ├── ArticuloRoutes.js
│   │   ├── AsistenciaRoutes.js
│   │   ├── DesastreRoutes.js
│   │   ├── EstudioSocioEcRoutes.js
│   │   ├── FondoRoutes.js
│   │   ├── EstadisticasRoutes.js
│   │   └── ReportesRoutes.js
│   └── index.js                  # Punto de entrada
├── .env                          # Variables de entorno
├── package.json
└── package-lock.json
```

### 6.2 Configuración de la Base de Datos

**Archivo:** `Backend/src/config/db.js`

```javascript
const oracledb = require('oracledb');
require('dotenv').config();

// Configuración del pool de conexiones
const poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DB_CONNECTION_STRING,
  poolMin: parseInt(process.env.DB_POOL_MIN) || 2,
  poolMax: parseInt(process.env.DB_POOL_MAX) || 10,
  poolIncrement: parseInt(process.env.DB_POOL_INCREMENT) || 2,
  enableStatistics: true
};

let pool;

// Inicializar pool
async function initialize() {
  try {
    pool = await oracledb.createPool(poolConfig);
    console.log('🔌 Conectado a Oracle Database:', process.env.DB_CONNECTION_STRING);
  } catch (err) {
    console.error('❌ Error al crear el pool de conexiones:', err);
    throw err;
  }
}

// Obtener conexión del pool
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (err) {
    console.error('❌ Error al obtener conexión:', err);
    throw err;
  }
}

// Cerrar pool
async function close() {
  if (pool) {
    try {
      await pool.close(10); // 10 segundos de timeout
      console.log('Pool de conexiones cerrado.');
    } catch (err) {
      console.error('Error al cerrar el pool:', err);
    }
  }
}

module.exports = {
  initialize,
  getConnection,
  close
};
```

### 6.3 Estructura de un Controlador

**Ejemplo:** `Backend/src/controllers/DonadorController.js`

```javascript
const db = require('../config/db');

// GET /api/donadores - Obtener todos los donadores
exports.getAllDonadores = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT
        id_donador,
        tipo_donador,
        nombre,
        dpi,
        nit,
        telefono,
        email,
        direccion
      FROM Donador
      ORDER BY nombre ASC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener donadores:', error);
    res.status(500).json({
      error: 'Error al obtener donadores',
      details: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
};

// GET /api/donadores/:id - Obtener donador por ID
exports.getDonadorById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT * FROM Donador WHERE id_donador = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Donador no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener donador:', error);
    res.status(500).json({
      error: 'Error al obtener donador',
      details: error.message
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// POST /api/donadores - Crear nuevo donador
exports.createDonador = async (req, res) => {
  let connection;
  try {
    const { tipo_donador, nombre, dpi, nit, telefono, email, direccion } = req.body;

    // Validación básica
    if (!tipo_donador || !nombre) {
      return res.status(400).json({
        error: 'Tipo de donador y nombre son obligatorios'
      });
    }

    connection = await db.getConnection();

    const result = await connection.execute(
      `INSERT INTO Donador
        (tipo_donador, nombre, dpi, nit, telefono, email, direccion)
      VALUES (:tipo_donador, :nombre, :dpi, :nit, :telefono, :email, :direccion)
      RETURNING id_donador INTO :id`,
      {
        tipo_donador,
        nombre,
        dpi: dpi || null,
        nit: nit || null,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Donador creado exitosamente',
      id_donador: result.outBinds.id[0]
    });
  } catch (error) {
    console.error('Error al crear donador:', error);
    res.status(500).json({
      error: 'Error al crear donador',
      details: error.message
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// PUT /api/donadores/:id - Actualizar donador
exports.updateDonador = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { tipo_donador, nombre, dpi, nit, telefono, email, direccion } = req.body;

    connection = await db.getConnection();

    const result = await connection.execute(
      `UPDATE Donador
      SET tipo_donador = :tipo_donador,
          nombre = :nombre,
          dpi = :dpi,
          nit = :nit,
          telefono = :telefono,
          email = :email,
          direccion = :direccion
      WHERE id_donador = :id`,
      {
        tipo_donador,
        nombre,
        dpi: dpi || null,
        nit: nit || null,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
        id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Donador no encontrado' });
    }

    res.json({ message: 'Donador actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar donador:', error);
    res.status(500).json({
      error: 'Error al actualizar donador',
      details: error.message
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// DELETE /api/donadores/:id - Eliminar donador
exports.deleteDonador = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await db.getConnection();

    // Verificar que no tenga donaciones o apadrinamientos
    const checkResult = await connection.execute(
      `SELECT
        (SELECT COUNT(*) FROM Donacion WHERE id_donador = :id) as donaciones,
        (SELECT COUNT(*) FROM Apadrinamiento WHERE id_donador = :id) as apadrinamientos
      FROM DUAL`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const { DONACIONES, APADRINAMIENTOS } = checkResult.rows[0];

    if (DONACIONES > 0 || APADRINAMIENTOS > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el donador porque tiene donaciones o apadrinamientos registrados'
      });
    }

    const result = await connection.execute(
      `DELETE FROM Donador WHERE id_donador = :id`,
      { id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Donador no encontrado' });
    }

    res.json({ message: 'Donador eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar donador:', error);
    res.status(500).json({
      error: 'Error al eliminar donador',
      details: error.message
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};
```

### 6.4 Estructura de una Ruta

**Ejemplo:** `Backend/src/routes/DonadorRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const donadorController = require('../controllers/DonadorController');

// Rutas para donadores
router.get('/', donadorController.getAllDonadores);
router.get('/:id', donadorController.getDonadorById);
router.post('/', donadorController.createDonador);
router.put('/:id', donadorController.updateDonador);
router.delete('/:id', donadorController.deleteDonador);

module.exports = router;
```

### 6.5 Middleware CORS

**Archivo:** `Backend/src/middlewares/cors.js`

```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origin (como Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://127.0.0.1:5173'];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

module.exports = cors(corsOptions);
```

### 6.6 Punto de Entrada Principal

**Archivo:** `Backend/src/index.js`

```javascript
const express = require('express');
const cors = require('./middlewares/cors');
const db = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/AuthRoutes');
const donadorRoutes = require('./routes/DonadorRoutes');
// ... importar todas las rutas

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors);
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/donadores', donadorRoutes);
// ... registrar todas las rutas

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date()
  });
});

// Middleware de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
db.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al iniciar:', err);
    process.exit(1);
  });

// Cerrar conexiones al apagar
process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});
```

### 6.7 Endpoints Principales

Consultar la documentación completa de la API en:
`Backend/API_DOCUMENTATION.md`

**Resumen de endpoints:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/logout | Cerrar sesión |
| GET | /api/donadores | Listar donadores |
| POST | /api/donadores | Crear donador |
| PUT | /api/donadores/:id | Actualizar donador |
| DELETE | /api/donadores/:id | Eliminar donador |
| GET | /api/donaciones | Listar donaciones |
| POST | /api/donaciones | Registrar donación |
| GET | /api/familias | Listar familias |
| GET | /api/estadisticas/dashboard | Dashboard stats |

(Ver API_DOCUMENTATION.md para la lista completa)

---

## 7. Frontend - Aplicación React

### 7.1 Estructura del Frontend

```
frontend/
├── public/
│   └── vite.svg                  # Favicon
├── src/
│   ├── assets/                   # Imágenes, fonts
│   ├── components/               # Componentes reutilizables
│   │   ├── Drawer.jsx           # Sidebar
│   │   ├── Toast.jsx            # Notificaciones
│   │   ├── ToastContainer.jsx
│   │   ├── CertificadoEstudio.jsx
│   │   └── ConstanciaAsistencia.jsx
│   ├── contexts/                 # React Context
│   │   └── ToastContext.jsx
│   ├── layouts/                  # Layouts
│   │   ├── MainLayout.jsx       # Layout principal
│   │   └── MainLayout.css
│   ├── pages/                    # Páginas/Vistas
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Donadores.jsx
│   │   ├── Donaciones.jsx
│   │   ├── Familias.jsx
│   │   ├── Beneficiados.jsx
│   │   ├── Apadrinamientos.jsx
│   │   ├── Inventario.jsx
│   │   ├── Asistencias.jsx
│   │   ├── Desastres.jsx
│   │   ├── Estudios.jsx
│   │   ├── Fondos.jsx
│   │   └── ReporteDonaciones.jsx
│   ├── services/                 # Servicios de API
│   │   ├── api.js               # Cliente Axios base
│   │   ├── authService.js
│   │   ├── donadorService.js
│   │   ├── donacionService.js
│   │   ├── familiaService.js
│   │   ├── beneficiadoService.js
│   │   ├── apadrinamientoService.js
│   │   ├── articuloService.js
│   │   ├── asistenciaService.js
│   │   ├── desastreService.js
│   │   ├── estudioService.js
│   │   └── fondoService.js
│   ├── utils/                    # Utilidades
│   │   └── formatters.js
│   ├── App.jsx                   # Componente raíz
│   ├── App.css
│   ├── index.css                 # Estilos globales
│   └── main.jsx                  # Punto de entrada
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js                # Configuración Vite
```

### 7.2 Cliente Axios Base

**Archivo:** `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies (si se usan)
});

// Interceptor de peticiones (para agregar token, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage (si se implementa JWT)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas (para manejo global de errores)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta:', error.response.status, error.response.data);

      // Redireccionar a login si es 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('Error de red:', error.request);
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### 7.3 Servicio de Autenticación

**Archivo:** `frontend/src/services/authService.js`

```javascript
import apiClient from './api';

export const authService = {
  // Login
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);

    // Guardar usuario en localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('user');
    }
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};
```

### 7.4 Ejemplo de Servicio (Donadores)

**Archivo:** `frontend/src/services/donadorService.js`

```javascript
import apiClient from './api';

export const donadorService = {
  // Obtener todos los donadores
  async getAll() {
    const response = await apiClient.get('/donadores');
    return response.data;
  },

  // Obtener donador por ID
  async getById(id) {
    const response = await apiClient.get(`/donadores/${id}`);
    return response.data;
  },

  // Crear donador
  async create(donador) {
    const response = await apiClient.post('/donadores', donador);
    return response.data;
  },

  // Actualizar donador
  async update(id, donador) {
    const response = await apiClient.put(`/donadores/${id}`, donador);
    return response.data;
  },

  // Eliminar donador
  async delete(id) {
    const response = await apiClient.delete(`/donadores/${id}`);
    return response.data;
  }
};
```
