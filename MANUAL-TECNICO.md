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
8. [Autenticación y Seguridad](#8-autenticación-y-seguridad)
9. [Flujos de Datos](#9-flujos-de-datos)
10. [Mantenimiento y Operaciones](#10-mantenimiento-y-operaciones)
11. [Extensibilidad](#11-extensibilidad)
12. [Troubleshooting](#12-troubleshooting)
13. [Apéndices](#13-apéndices)

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

### 7.5 Componente Protegido (ProtectedRoute)

**Archivo:** `frontend/src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Donadores from './pages/Donadores';
// ... importar otras páginas

// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="donadores" element={<Donadores />} />
          <Route path="donaciones" element={<Donaciones />} />
          <Route path="familias" element={<Familias />} />
          {/* ... otras rutas */}
        </Route>

        {/* Ruta catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 7.6 Layout Principal

**Archivo:** `frontend/src/layouts/MainLayout.jsx`

```javascript
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Drawer from '../components/Drawer';
import { authService } from '../services/authService';
import './MainLayout.css';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <Drawer
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />

      <main className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
```

### 7.7 Ejemplo de Página (Dashboard)

**Archivo:** `frontend/src/pages/Dashboard.jsx`

```javascript
import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalFamilias: 0,
    totalBeneficiados: 0,
    familiasApadrinadas: 0,
    totalDonadores: 0,
    donacionesAnio: 0,
    saldoFondos: 0,
    totalAsistencias: 0,
    articulosProximosVencer: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/estadisticas/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Familias</h3>
          <p className="stat-value">{stats.totalFamilias}</p>
        </div>

        <div className="stat-card">
          <h3>Total Beneficiados</h3>
          <p className="stat-value">{stats.totalBeneficiados}</p>
        </div>

        <div className="stat-card">
          <h3>Familias Apadrinadas</h3>
          <p className="stat-value">{stats.familiasApadrinadas}</p>
        </div>

        <div className="stat-card">
          <h3>Total Donadores</h3>
          <p className="stat-value">{stats.totalDonadores}</p>
        </div>

        <div className="stat-card">
          <h3>Donaciones Este Año</h3>
          <p className="stat-value">Q {stats.donacionesAnio.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h3>Saldo de Fondos</h3>
          <p className="stat-value">Q {stats.saldoFondos.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h3>Total Asistencias</h3>
          <p className="stat-value">{stats.totalAsistencias}</p>
        </div>

        <div className="stat-card warning">
          <h3>Artículos por Vencer</h3>
          <p className="stat-value">{stats.articulosProximosVencer}</p>
        </div>
      </div>

      {/* Agregar gráficos, tablas, etc. */}
    </div>
  );
}

export default Dashboard;
```

---

## 8. Autenticación y Seguridad

### 8.1 Flujo de Autenticación Actual

**Método:** Autenticación básica con sesión en localStorage

```
1. Usuario ingresa credenciales en /login
        ↓
2. Frontend envía POST /api/auth/login
        ↓
3. Backend valida en tabla Usuarios
        ↓
4. Si es válido, retorna datos del usuario
        ↓
5. Frontend guarda usuario en localStorage
        ↓
6. Usuario es redirigido al Dashboard
        ↓
7. Cada petición verifica usuario en localStorage
```

### 8.2 Mejoras de Seguridad Recomendadas

#### 8.2.1 Hash de Contraseñas

**Actual:** Contraseñas en texto plano
**Recomendado:** Usar bcrypt

**Instalación:**
```bash
npm install bcrypt --save
```

**Implementación en Backend:**

```javascript
const bcrypt = require('bcrypt');

// Al crear usuario
exports.createUser = async (req, res) => {
  const { nombre_usuario, password, ...otherData } = req.body;

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar con contraseña hasheada
  await connection.execute(
    `INSERT INTO Usuarios (..., password) VALUES (..., :password)`,
    { ...otherData, password: hashedPassword },
    { autoCommit: true }
  );
};

// Al hacer login
exports.login = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  // Obtener usuario de BD
  const result = await connection.execute(
    `SELECT * FROM Usuarios WHERE nombre_usuario = :nombre_usuario`,
    { nombre_usuario }
  );

  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  // Comparar contraseña
  const isValidPassword = await bcrypt.compare(password, user.PASSWORD);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  // Login exitoso
  res.json({ message: 'Login exitoso', user: { ...user, PASSWORD: undefined } });
};
```

#### 8.2.2 JWT (JSON Web Tokens)

**Instalación:**
```bash
npm install jsonwebtoken --save
```

**Implementación:**

```javascript
const jwt = require('jsonwebtoken');

// Al hacer login exitoso
const token = jwt.sign(
  {
    id: user.ID_USUARIO,
    username: user.NOMBRE_USUARIO,
    rol: user.ROL
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

res.json({
  message: 'Login exitoso',
  token,
  user: { ...user, PASSWORD: undefined }
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  });
}

// Proteger rutas
router.get('/donadores', authenticateToken, donadorController.getAllDonadores);
```

#### 8.2.3 Control de Acceso por Rol

```javascript
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tiene permisos' });
    }

    next();
  };
}

// Uso
router.delete('/donadores/:id',
  authenticateToken,
  authorizeRoles('Administrador'),
  donadorController.deleteDonador
);
```

### 8.3 Validación de Datos

**Instalación de express-validator:**
```bash
npm install express-validator --save
```

**Uso:**

```javascript
const { body, validationResult } = require('express-validator');

// Middleware de validación
const validateDonador = [
  body('tipo_donador').isIn(['Persona', 'Empresa']).withMessage('Tipo inválido'),
  body('nombre').trim().isLength({ min: 3 }).withMessage('Nombre muy corto'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('telefono').optional().matches(/^\d{4}-\d{4}$/).withMessage('Teléfono inválido'),
];

// Usar en rutas
router.post('/donadores', validateDonador, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}, donadorController.createDonador);
```

### 8.4 Protección contra SQL Injection

**El driver oracledb previene SQL injection usando bind parameters.**

**CORRECTO (seguro):**
```javascript
await connection.execute(
  `SELECT * FROM Donador WHERE nombre = :nombre`,
  { nombre: userInput }
);
```

**INCORRECTO (vulnerable):**
```javascript
// ¡NUNCA HACER ESTO!
await connection.execute(
  `SELECT * FROM Donador WHERE nombre = '${userInput}'`
);
```

### 8.5 Rate Limiting

**Instalación:**
```bash
npm install express-rate-limit --save
```

**Implementación:**

```javascript
const rateLimit = require('express-rate-limit');

// Limitar intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login, intente más tarde'
});

app.use('/api/auth/login', loginLimiter);
```

---

## 9. Flujos de Datos

### 9.1 Flujo de Registro de Donación

```
1. Usuario abre página /donaciones
        ↓
2. Component llama donadorService.getAll() para llenar dropdown
        ↓
3. Usuario llena formulario
        ↓
4. Usuario hace clic en "Guardar"
        ↓
5. Component valida datos del formulario
        ↓
6. Component llama donacionService.create(donacion)
        ↓
7. Axios envía POST /api/donaciones con datos
        ↓
8. Backend: DonacionController.createDonacion()
        ↓
9. Controller valida datos
        ↓
10. Controller ejecuta INSERT en tabla Donacion
        ↓
11. Oracle retorna ID de la nueva donación
        ↓
12. Controller retorna response 201 con ID
        ↓
13. Frontend recibe respuesta exitosa
        ↓
14. Component muestra notificación de éxito
        ↓
15. Component refresca lista de donaciones
```

### 9.2 Flujo de Registro de Asistencia (con descuento de inventario)

```
1. Usuario abre página /asistencias
        ↓
2. Component carga familias y artículos disponibles
        ↓
3. Usuario selecciona familia
        ↓
4. Usuario selecciona artículo
        ↓
5. Sistema carga lotes disponibles del artículo
        ↓
6. Usuario selecciona lote (idealmente el que vence primero)
        ↓
7. Usuario ingresa cantidad a entregar
        ↓
8. Sistema calcula valor estimado automáticamente
        ↓
9. Usuario hace clic en "Guardar"
        ↓
10. Component llama asistenciaService.create(asistencia)
        ↓
11. Axios envía POST /api/asistencias
        ↓
12. Backend: AsistenciaController.createAsistencia()
        ↓
13. Controller inicia transacción
        ↓
14. Controller inserta registro en tabla Asistencia
        ↓
15. Controller actualiza cantidad_disponible del Lote
        ↓  UPDATE Lote SET cantidad_disponible = cantidad_disponible - :cantidad
        ↓
16. Controller hace COMMIT
        ↓
17. Si hay error, hace ROLLBACK y retorna error
        ↓
18. Si es exitoso, retorna response 201
        ↓
19. Frontend muestra notificación
        ↓
20. Component refresca lista y actualiza stock disponible
```

### 9.3 Transacciones en Asistencias

**Ejemplo de código con transacción:**

```javascript
exports.createAsistencia = async (req, res) => {
  let connection;
  try {
    const { id_familia, id_lote, cantidad_entregada, ...otherData } = req.body;

    connection = await db.getConnection();

    // Iniciar transacción (autoCommit: false)
    // 1. Verificar stock disponible
    const stockResult = await connection.execute(
      `SELECT cantidad_disponible FROM Lote WHERE id_lote = :id_lote`,
      { id_lote }
    );

    if (stockResult.rows.length === 0) {
      throw new Error('Lote no encontrado');
    }

    const stockDisponible = stockResult.rows[0][0];

    if (stockDisponible < cantidad_entregada) {
      throw new Error(`Stock insuficiente. Disponible: ${stockDisponible}`);
    }

    // 2. Insertar asistencia
    await connection.execute(
      `INSERT INTO Asistencia (id_familia, id_lote, cantidad_entregada, ...)
      VALUES (:id_familia, :id_lote, :cantidad_entregada, ...)`,
      { id_familia, id_lote, cantidad_entregada, ...otherData }
    );

    // 3. Descontar del lote
    await connection.execute(
      `UPDATE Lote
      SET cantidad_disponible = cantidad_disponible - :cantidad
      WHERE id_lote = :id_lote`,
      { cantidad: cantidad_entregada, id_lote }
    );

    // 4. Commit de la transacción
    await connection.commit();

    res.status(201).json({ message: 'Asistencia registrada exitosamente' });

  } catch (error) {
    // Rollback en caso de error
    if (connection) {
      await connection.rollback();
    }

    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};
```

---

## 10. Mantenimiento y Operaciones

### 10.1 Respaldo de Base de Datos

#### 10.1.1 Respaldo Manual (Export)

**Windows:**
```cmd
set ORACLE_HOME=C:\oracledb\instantclient_19_x
set PATH=%ORACLE_HOME%;%PATH%

expdp desastres_user/SecurePassword123@localhost:1521/XEPDB1 ^
  DIRECTORY=DATA_PUMP_DIR ^
  DUMPFILE=desastres_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.dmp ^
  LOGFILE=desastres_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.log ^
  SCHEMAS=desastres_user
```

**Linux:**
```bash
expdp desastres_user/SecurePassword123@localhost:1521/XEPDB1 \
  DIRECTORY=DATA_PUMP_DIR \
  DUMPFILE=desastres_backup_$(date +%Y%m%d).dmp \
  LOGFILE=desastres_backup_$(date +%Y%m%d).log \
  SCHEMAS=desastres_user
```

#### 10.1.2 Restaurar Respaldo

```bash
impdp desastres_user/SecurePassword123@localhost:1521/XEPDB1 \
  DIRECTORY=DATA_PUMP_DIR \
  DUMPFILE=desastres_backup_20251023.dmp \
  LOGFILE=desastres_restore_20251023.log \
  SCHEMAS=desastres_user
```

#### 10.1.3 Automatizar Respaldos

**Crear script de respaldo:**

**Linux (crontab):**
```bash
#!/bin/bash
# /home/oracle/backup_desastres.sh

FECHA=$(date +%Y%m%d)
LOG_FILE="/var/log/backup_desastres_$FECHA.log"

echo "Iniciando respaldo: $(date)" > $LOG_FILE

expdp desastres_user/SecurePassword123@localhost:1521/XEPDB1 \
  DIRECTORY=DATA_PUMP_DIR \
  DUMPFILE=desastres_backup_$FECHA.dmp \
  LOGFILE=desastres_backup_$FECHA.log \
  SCHEMAS=desastres_user >> $LOG_FILE 2>&1

echo "Respaldo completado: $(date)" >> $LOG_FILE

# Eliminar respaldos antiguos (más de 30 días)
find /u01/app/oracle/admin/XE/dpdump/ -name "desastres_backup_*.dmp" -mtime +30 -delete

exit 0
```

**Agendar con crontab:**
```bash
crontab -e

# Respaldo diario a las 2:00 AM
0 2 * * * /home/oracle/backup_desastres.sh
```

**Windows (Task Scheduler):**
```batch
@echo off
REM backup_desastres.bat

set FECHA=%date:~-4,4%%date:~-10,2%%date:~-7,2%
set LOG=C:\backups\backup_%FECHA%.log

echo Iniciando respaldo: %date% %time% > %LOG%

expdp desastres_user/SecurePassword123@localhost:1521/XEPDB1 ^
  DIRECTORY=DATA_PUMP_DIR ^
  DUMPFILE=desastres_backup_%FECHA%.dmp ^
  LOGFILE=desastres_backup_%FECHA%.log ^
  SCHEMAS=desastres_user >> %LOG% 2>&1

echo Respaldo completado: %date% %time% >> %LOG%
```

Programar en Task Scheduler para ejecución diaria.

### 10.2 Monitoreo del Sistema

#### 10.2.1 Monitoreo de Oracle

**Verificar estado:**
```sql
SELECT status FROM v$instance;
```

**Verificar tablespaces:**
```sql
SELECT
  tablespace_name,
  ROUND(SUM(bytes)/1024/1024, 2) AS size_mb,
  ROUND(SUM(maxbytes)/1024/1024, 2) AS max_mb
FROM dba_data_files
GROUP BY tablespace_name;
```

**Verificar sesiones:**
```sql
SELECT
  username,
  COUNT(*) as sessions
FROM v$session
WHERE username IS NOT NULL
GROUP BY username;
```

#### 10.2.2 Monitoreo del Backend (Node.js)

**Logs de la aplicación:**

Usar `winston` para logging estructurado:

```bash
npm install winston --save
```

```javascript
// Backend/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

**Uso:**
```javascript
const logger = require('./utils/logger');

logger.info('Usuario autenticado', { username: 'admin' });
logger.error('Error al conectar BD', { error: err.message });
```

#### 10.2.3 Monitoreo con PM2 (Producción)

**Instalar PM2:**
```bash
npm install -g pm2
```

**Iniciar aplicación:**
```bash
cd Backend
pm2 start src/index.js --name "desastres-api"
```

**Monitoreo:**
```bash
pm2 status              # Estado de procesos
pm2 logs desastres-api  # Ver logs en tiempo real
pm2 monit               # Monitor interactivo
pm2 restart desastres-api  # Reiniciar
pm2 stop desastres-api     # Detener
```

**Auto-reinicio en reboot:**
```bash
pm2 startup
pm2 save
```

### 10.3 Actualización del Sistema

#### 10.3.1 Actualizar Dependencias

**Backend:**
```bash
cd Backend
npm outdated             # Ver dependencias desactualizadas
npm update               # Actualizar a versiones compatibles
npm audit fix            # Corregir vulnerabilidades
```

**Frontend:**
```bash
cd frontend
npm outdated
npm update
npm audit fix
```

#### 10.3.2 Migración de Base de Datos

**Crear script de migración:**

```sql
-- migrations/001_add_campo_nuevo.sql

-- Agregar nueva columna
ALTER TABLE Familia ADD (campo_nuevo VARCHAR2(100));

-- Actualizar datos existentes
UPDATE Familia SET campo_nuevo = 'Valor default';

COMMIT;
```

**Registrar migración:**

Crear tabla de control:
```sql
CREATE TABLE Schema_Migrations (
  version VARCHAR2(50) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT SYSTIMESTAMP
);
```

Insertar tras aplicar:
```sql
INSERT INTO Schema_Migrations (version) VALUES ('001_add_campo_nuevo');
```

### 10.4 Optimización

#### 10.4.1 Optimización de Consultas

**Usar índices:**
```sql
-- Crear índice para búsquedas por nombre
CREATE INDEX idx_donador_nombre ON Donador(nombre);

-- Índice compuesto para filtros comunes
CREATE INDEX idx_familia_depto_apad ON Familia(departamento, es_apadrinada);
```

**Analizar planes de ejecución:**
```sql
EXPLAIN PLAN FOR
SELECT * FROM Donador WHERE nombre LIKE '%Garcia%';

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

#### 10.4.2 Pool de Conexiones

Ajustar según carga:

```javascript
// Producción con alta demanda
const poolConfig = {
  poolMin: 5,
  poolMax: 50,
  poolIncrement: 5,
  poolTimeout: 60,
  queueTimeout: 60000
};
```

#### 10.4.3 Caché en el Frontend

Usar React Query o SWR para cacheo:

```bash
npm install @tanstack/react-query
```

```javascript
import { useQuery } from '@tanstack/react-query';

function Donadores() {
  const { data, isLoading } = useQuery({
    queryKey: ['donadores'],
    queryFn: () => donadorService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // ...
}
```

---

## 11. Extensibilidad

### 11.1 Agregar un Nuevo Módulo

**Ejemplo: Módulo de "Voluntarios"**

#### Paso 1: Crear tabla en BD

```sql
CREATE TABLE Voluntario (
  id_voluntario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL,
  apellido VARCHAR2(100) NOT NULL,
  dpi VARCHAR2(20),
  telefono VARCHAR2(20),
  email VARCHAR2(100),
  especialidad VARCHAR2(100),
  fecha_registro DATE DEFAULT SYSDATE
);
```

#### Paso 2: Crear Controlador

```javascript
// Backend/src/controllers/VoluntarioController.js

exports.getAllVoluntarios = async (req, res) => {
  // ... implementar
};

exports.createVoluntario = async (req, res) => {
  // ... implementar
};

// ... otros métodos CRUD
```

#### Paso 3: Crear Rutas

```javascript
// Backend/src/routes/VoluntarioRoutes.js

const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/VoluntarioController');

router.get('/', voluntarioController.getAllVoluntarios);
router.post('/', voluntarioController.createVoluntario);
// ... otras rutas

module.exports = router;
```

#### Paso 4: Registrar Rutas en index.js

```javascript
// Backend/src/index.js

const voluntarioRoutes = require('./routes/VoluntarioRoutes');

app.use('/api/voluntarios', voluntarioRoutes);
```

#### Paso 5: Crear Servicio en Frontend

```javascript
// frontend/src/services/voluntarioService.js

import apiClient from './api';

export const voluntarioService = {
  async getAll() {
    const response = await apiClient.get('/voluntarios');
    return response.data;
  },

  async create(voluntario) {
    const response = await apiClient.post('/voluntarios', voluntario);
    return response.data;
  },

  // ... otros métodos
};
```

#### Paso 6: Crear Página en Frontend

```javascript
// frontend/src/pages/Voluntarios.jsx

import { useState, useEffect } from 'react';
import { voluntarioService } from '../services/voluntarioService';

function Voluntarios() {
  const [voluntarios, setVoluntarios] = useState([]);

  useEffect(() => {
    loadVoluntarios();
  }, []);

  const loadVoluntarios = async () => {
    const data = await voluntarioService.getAll();
    setVoluntarios(data);
  };

  return (
    <div>
      <h1>Voluntarios</h1>
      {/* ... UI */}
    </div>
  );
}

export default Voluntarios;
```

#### Paso 7: Agregar Ruta en App.jsx

```javascript
// frontend/src/App.jsx

import Voluntarios from './pages/Voluntarios';

<Route path="voluntarios" element={<Voluntarios />} />
```

#### Paso 8: Agregar en Menú Sidebar

```javascript
// frontend/src/components/Drawer.jsx

const menuItems = [
  // ... items existentes
  { path: '/voluntarios', icon: UsersIcon, label: 'Voluntarios' }
];
```

### 11.2 Agregar Generación de PDFs

**Instalación:**
```bash
npm install pdfkit --save
```

**Implementación:**

```javascript
// Backend/src/utils/pdfGenerator.js

const PDFDocument = require('pdfkit');

exports.generateCertificadoDonacion = async (donacion, donador) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Contenido del PDF
    doc.fontSize(20).text('Certificado de Donación', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Donador: ${donador.nombre}`);
    doc.text(`Monto: Q ${donacion.monto_monetario}`);
    doc.text(`Fecha: ${donacion.fecha_donacion}`);

    doc.end();
  });
};
```

**Uso en Controlador:**

```javascript
const pdfGenerator = require('../utils/pdfGenerator');

exports.generateCertificado = async (req, res) => {
  // Obtener datos de donación y donador
  const donacion = await getDonacionById(req.params.id);
  const donador = await getDonadorById(donacion.id_donador);

  // Generar PDF
  const pdfBuffer = await pdfGenerator.generateCertificadoDonacion(donacion, donador);

  // Enviar como respuesta
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificado_${donacion.id_donacion}.pdf`);
  res.send(pdfBuffer);
};
```

### 11.3 Agregar Notificaciones por Email

**Instalación:**
```bash
npm install nodemailer --save
```

**Configuración:**

```javascript
// Backend/src/config/email.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};
```

**Uso:**

```javascript
const emailService = require('../config/email');

// Al registrar apadrinamiento
await emailService.sendEmail(
  padrino.email,
  'Nuevo Apadrinamiento',
  `<h1>Gracias por apadrinar a la familia ${familia.jefe_familia}</h1>`
);
```

---

## 12. Troubleshooting

### 12.1 Problemas Comunes del Backend

#### Error: ORA-12154: TNS:could not resolve the connect identifier specified

**Causa:** Connection string incorrecta

**Solución:**
1. Verificar que el servicio Oracle esté corriendo
2. Verificar formato: `localhost:1521/XEPDB1`
3. Probar conexión con SQL*Plus:
```bash
sqlplus desastres_user/password@localhost:1521/XEPDB1
```

#### Error: NJS-067: Connection pool is closing

**Causa:** Intentando obtener conexión mientras el pool se cierra

**Solución:**
- Asegurar cierre ordenado con señales:
```javascript
process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});
```

#### Error: ORA-01017: invalid username/password

**Causa:** Credenciales incorrectas

**Solución:**
1. Verificar usuario y contraseña en `.env`
2. Resetear contraseña:
```sql
sqlplus sys/syspassword@localhost:1521/XEPDB1 as sysdba

ALTER USER desastres_user IDENTIFIED BY NewPassword123;
```

#### Error: EADDRINUSE: address already in use :::3000

**Causa:** El puerto 3000 ya está en uso

**Solución:**
1. Identificar proceso:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

2. O cambiar puerto en `.env`:
```
PORT=3001
```

### 12.2 Problemas Comunes del Frontend

#### Error: Network Error

**Causa:** No puede conectar al backend

**Solución:**
1. Verificar que el backend esté corriendo
2. Verificar URL en `api.js`
3. Verificar configuración CORS en backend
4. Revisar consola del navegador (F12)

#### Error: Access to XMLHttpRequest has been blocked by CORS policy

**Causa:** CORS no configurado correctamente

**Solución:**
1. Verificar middleware CORS en backend
2. Asegurar que `http://localhost:5173` esté en allowed origins
3. Reiniciar backend después de cambios

#### Componente no actualiza después de crear/editar

**Causa:** Estado no se refresca

**Solución:**
```javascript
// Después de crear/editar, recargar datos
const handleCreate = async (newItem) => {
  await service.create(newItem);
  await loadData(); // Refrescar lista
};
```

### 12.3 Problemas de Base de Datos

#### Tabla no existe

**Solución:**
1. Verificar conexión al esquema correcto:
```sql
SELECT USER FROM DUAL;
```

2. Listar tablas:
```sql
SELECT table_name FROM user_tables;
```

3. Ejecutar `crear-tablas.sql` si faltan

#### Llave foránea viola constraint

**Solución:**
- Verificar que el registro padre exista:
```sql
SELECT * FROM Familia WHERE id_familia = 999;
```

#### No se puede eliminar por constraint

**Solución:**
- Eliminar registros dependientes primero, o
- Cambiar constraint a `ON DELETE CASCADE`:
```sql
ALTER TABLE Beneficiado DROP CONSTRAINT fk_ben_familia;

ALTER TABLE Beneficiado
ADD CONSTRAINT fk_ben_familia
FOREIGN KEY (id_familia)
REFERENCES Familia(id_familia)
ON DELETE CASCADE;
```

### 12.4 Problemas de Performance

#### Consultas lentas

**Solución:**
1. Agregar índices:
```sql
CREATE INDEX idx_slow_query ON Tabla(columna);
```

2. Optimizar query con `EXPLAIN PLAN`

3. Limitar resultados:
```sql
SELECT * FROM Tabla FETCH FIRST 100 ROWS ONLY;
```

#### Frontend lento al cargar datos

**Solución:**
1. Paginación en backend:
```javascript
exports.getAll = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  const result = await connection.execute(
    `SELECT * FROM Donador
     ORDER BY nombre
     OFFSET :offset ROWS
     FETCH NEXT :limit ROWS ONLY`,
    { offset, limit: parseInt(limit) }
  );

  res.json({
    data: result.rows,
    page,
    limit
  });
};
```

2. Lazy loading de imágenes

3. Virtualización de listas largas (react-window)

---

## 13. Apéndices

### Apéndice A: Variables de Entorno

**Backend (.env):**
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_USER=desastres_user
DB_PASSWORD=SecurePassword123
DB_CONNECTION_STRING=localhost:1521/XEPDB1
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_INCREMENT=2

# Seguridad
JWT_SECRET=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
EMAIL_FROM_NAME=Sistema de Desastres
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sistema de Asistencia
```

### Apéndice B: Scripts Útiles

**package.json del Backend:**
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "lint": "eslint src/**/*.js",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "sqlplus desastres_user/password@localhost:1521/XEPDB1 @datos-iniciales.sql"
  }
}
```

**package.json del Frontend:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Apéndice C: Diagrama de Despliegue

```
┌──────────────────────────────────────────────┐
│           INTERNET / USERS                   │
└─────────────────┬────────────────────────────┘
                  │ HTTPS (443)
                  │
┌─────────────────▼────────────────────────────┐
│         NGINX (Reverse Proxy)                │
│   - SSL/TLS Termination                      │
│   - Static File Serving (Frontend build)     │
│   - Proxy Pass to Backend                    │
└─────────────────┬────────────────────────────┘
                  │ HTTP (3000)
                  │
┌─────────────────▼────────────────────────────┐
│         Node.js + Express (Backend)          │
│   - API REST Endpoints                       │
│   - Business Logic                           │
│   - PM2 Process Manager                      │
└─────────────────┬────────────────────────────┘
                  │ Oracle Native Protocol (1521)
                  │
┌─────────────────▼────────────────────────────┐
│         Oracle Database 19c                  │
│   - Data Storage                             │
│   - Transactional Integrity                  │
│   - Scheduled Backups                        │
└──────────────────────────────────────────────┘
```

### Apéndice D: Checklist de Despliegue a Producción

**Pre-despliegue:**
- [ ] Cambiar contraseñas por defecto
- [ ] Generar JWT_SECRET seguro
- [ ] Configurar respaldos automáticos
- [ ] Configurar SSL/HTTPS
- [ ] Cambiar NODE_ENV=production
- [ ] Hashear contraseñas con bcrypt
- [ ] Implementar JWT
- [ ] Configurar rate limiting
- [ ] Configurar logs con winston
- [ ] Configurar monitoreo (PM2)

**Despliegue:**
- [ ] Build del frontend: `npm run build`
- [ ] Subir código al servidor
- [ ] Instalar dependencias: `npm install --production`
- [ ] Configurar variables de entorno
- [ ] Ejecutar migraciones de BD
- [ ] Iniciar con PM2: `pm2 start`
- [ ] Configurar Nginx reverse proxy
- [ ] Configurar SSL con Let's Encrypt
- [ ] Verificar que todo funcione

**Post-despliegue:**
- [ ] Monitorear logs por 24h
- [ ] Verificar respaldos automáticos
- [ ] Documentar accesos y credenciales
- [ ] Capacitar a usuarios
- [ ] Plan de rollback listo

### Apéndice E: Glosario Técnico

| Término | Definición |
|---------|------------|
| API | Application Programming Interface - Interfaz de comunicación entre sistemas |
| CORS | Cross-Origin Resource Sharing - Política de seguridad de navegadores |
| CRUD | Create, Read, Update, Delete - Operaciones básicas de datos |
| ERD | Entity-Relationship Diagram - Diagrama de entidades y relaciones |
| JWT | JSON Web Token - Estándar de tokens de autenticación |
| MVC | Model-View-Controller - Patrón de arquitectura |
| ORM | Object-Relational Mapping - Mapeo objeto-relacional |
| REST | Representational State Transfer - Arquitectura de servicios web |
| SPA | Single Page Application - Aplicación de página única |

---

## Contacto y Soporte

**Desarrollador:**
- Email: dev@organizacion.org

**Documentación Adicional:**
- Backend API: `Backend/API_DOCUMENTATION.md`
- Base de Datos: `Backend/INSTRUCCIONES-BASE-DE-DATOS.md`
- Frontend: `frontend/README.md`

**Recursos:**
- Oracle Documentation: https://docs.oracle.com/en/database/
- Express.js: https://expressjs.com/
- React: https://react.dev/
- Node-oracledb: https://oracle.github.io/node-oracledb/

---

**Fin del Manual Técnico**

*Este manual está sujeto a actualizaciones. Versión 1.0 - Octubre 2025*
