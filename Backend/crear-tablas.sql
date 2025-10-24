-- Script para crear todas las tablas del sistema de asistencia a víctimas de desastres naturales
-- Ejecutar este script en Oracle SQL Developer o SQL*Plus

-- Eliminar tablas si existen (en orden inverso por dependencias)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Estudio_Socioeconomico CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Asistencia CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Lote CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Articulo CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Apadrinamiento CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Beneficiado CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Familia CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Donacion CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Donador CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Fondo CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Desastre CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Usuarios CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Empleados CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Empresa CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      NULL;
END;
/

-- 1. Tabla Empresa
CREATE TABLE Empresa (
    id_empresa NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(200) NOT NULL,
    direccion VARCHAR2(300),
    telefono VARCHAR2(20),
    email VARCHAR2(100),
    mision VARCHAR2(1000),
    vision VARCHAR2(1000),
    fecha_fundacion DATE
);

-- 2. Tabla Empleados
CREATE TABLE Empleados (
    id_empleado NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empresa NUMBER NOT NULL,
    nombre VARCHAR2(100) NOT NULL,
    apellido VARCHAR2(100) NOT NULL,
    dpi VARCHAR2(20),
    puesto VARCHAR2(100),
    telefono VARCHAR2(20),
    email VARCHAR2(100),
    fecha_contratacion DATE DEFAULT SYSDATE,
    CONSTRAINT fk_emp_empresa FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa)
);

-- 3. Tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empleado NUMBER NOT NULL,
    nombre_usuario VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    rol VARCHAR2(50) DEFAULT 'Usuario' CHECK (rol IN ('Administrador', 'Usuario', 'Consulta')),
    estado VARCHAR2(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    fecha_creacion DATE DEFAULT SYSDATE,
    CONSTRAINT fk_usr_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- 4. Tabla Desastre
CREATE TABLE Desastre (
    id_desastre NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_desastre VARCHAR2(200) NOT NULL,
    tipo_desastre VARCHAR2(100),
    fecha_desastre DATE,
    ubicacion VARCHAR2(300),
    descripcion VARCHAR2(1000)
);

-- 5. Tabla Fondo
CREATE TABLE Fondo (
    id_fondo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_fondo VARCHAR2(200) NOT NULL,
    saldo NUMBER(12,2) DEFAULT 0,
    descripcion VARCHAR2(500),
    ultima_actualizacion TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- 6. Tabla Donador
CREATE TABLE Donador (
    id_donador NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_donador VARCHAR2(20) CHECK (tipo_donador IN ('Persona', 'Empresa')),
    nombre VARCHAR2(200) NOT NULL,
    dpi VARCHAR2(20),
    nit VARCHAR2(20),
    telefono VARCHAR2(20),
    email VARCHAR2(100),
    direccion VARCHAR2(300)
);

-- 7. Tabla Donacion
CREATE TABLE Donacion (
    id_donacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_donador NUMBER NOT NULL,
    fecha_donacion DATE DEFAULT SYSDATE,
    tipo_donacion VARCHAR2(50) CHECK (tipo_donacion IN ('Monetaria', 'Especie', 'Mixta')),
    monto_monetario NUMBER(12,2),
    descripcion_especie VARCHAR2(500),
    destino VARCHAR2(200),
    CONSTRAINT fk_don_donador FOREIGN KEY (id_donador) REFERENCES Donador(id_donador)
);

-- 8. Tabla Familia
CREATE TABLE Familia (
    id_familia NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jefe_familia VARCHAR2(200) NOT NULL,
    cantidad_miembros NUMBER NOT NULL,
    direccion VARCHAR2(300),
    municipio VARCHAR2(100),
    departamento VARCHAR2(100),
    es_apadrinada VARCHAR2(2) DEFAULT 'No' CHECK (es_apadrinada IN ('Sí', 'No')),
    id_desastre_asociado NUMBER,
    fecha_registro DATE DEFAULT SYSDATE,
    CONSTRAINT fk_fam_desastre FOREIGN KEY (id_desastre_asociado) REFERENCES Desastre(id_desastre)
);

-- 9. Tabla Beneficiado
CREATE TABLE Beneficiado (
    id_beneficiado NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_familia NUMBER NOT NULL,
    nombre VARCHAR2(100) NOT NULL,
    apellido VARCHAR2(100),
    dpi VARCHAR2(20),
    fecha_nacimiento DATE,
    parentesco VARCHAR2(50),
    CONSTRAINT fk_ben_familia FOREIGN KEY (id_familia) REFERENCES Familia(id_familia)
);

-- 10. Tabla Apadrinamiento
CREATE TABLE Apadrinamiento (
    id_apadrinamiento NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_donador NUMBER NOT NULL,
    id_familia NUMBER NOT NULL,
    fecha_inicio DATE DEFAULT SYSDATE,
    fecha_fin DATE,
    estado VARCHAR2(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Finalizado')),
    CONSTRAINT fk_apad_donador FOREIGN KEY (id_donador) REFERENCES Donador(id_donador),
    CONSTRAINT fk_apad_familia FOREIGN KEY (id_familia) REFERENCES Familia(id_familia)
);

-- 11. Tabla Articulo
CREATE TABLE Articulo (
    id_articulo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_articulo VARCHAR2(200) NOT NULL,
    categoria VARCHAR2(100),
    unidad_medida VARCHAR2(50),
    costo NUMBER(10,2)
);

-- 12. Tabla Lote
CREATE TABLE Lote (
    id_lote NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_articulo NUMBER NOT NULL,
    cantidad_inicial NUMBER NOT NULL,
    cantidad_disponible NUMBER NOT NULL,
    fecha_entrada DATE DEFAULT SYSDATE,
    fecha_vencimiento DATE,
    origen VARCHAR2(200),
    CONSTRAINT fk_lote_articulo FOREIGN KEY (id_articulo) REFERENCES Articulo(id_articulo)
);

-- 13. Tabla Asistencia
CREATE TABLE Asistencia (
    id_asistencia NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_familia NUMBER NOT NULL,
    tipo_asistencia VARCHAR2(100),
    id_lote NUMBER,
    cantidad_entregada NUMBER,
    valor_estimado NUMBER(12,2),
    fecha_entrega DATE DEFAULT SYSDATE,
    observaciones VARCHAR2(500),
    CONSTRAINT fk_asis_familia FOREIGN KEY (id_familia) REFERENCES Familia(id_familia),
    CONSTRAINT fk_asis_lote FOREIGN KEY (id_lote) REFERENCES Lote(id_lote)
);

-- 14. Tabla Estudio_Socioeconomico
CREATE TABLE Estudio_Socioeconomico (
    id_estudio NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_familia NUMBER NOT NULL,
    fecha_estudio DATE DEFAULT SYSDATE,
    ingresos_familiares NUMBER(12,2),
    gastos_familiares NUMBER(12,2),
    conclusion VARCHAR2(1000),
    observaciones VARCHAR2(1000),
    CONSTRAINT fk_est_familia FOREIGN KEY (id_familia) REFERENCES Familia(id_familia)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_empleados_empresa ON Empleados(id_empresa);
CREATE INDEX idx_usuarios_empleado ON Usuarios(id_empleado);
CREATE INDEX idx_donacion_donador ON Donacion(id_donador);
CREATE INDEX idx_familia_desastre ON Familia(id_desastre_asociado);
CREATE INDEX idx_beneficiado_familia ON Beneficiado(id_familia);
CREATE INDEX idx_apadrinamiento_donador ON Apadrinamiento(id_donador);
CREATE INDEX idx_apadrinamiento_familia ON Apadrinamiento(id_familia);
CREATE INDEX idx_lote_articulo ON Lote(id_articulo);
CREATE INDEX idx_asistencia_familia ON Asistencia(id_familia);
CREATE INDEX idx_estudio_familia ON Estudio_Socioeconomico(id_familia);

-- Confirmar cambios
COMMIT;

-- Mostrar mensaje de confirmación
SELECT 'Todas las tablas han sido creadas exitosamente' AS resultado FROM DUAL;
