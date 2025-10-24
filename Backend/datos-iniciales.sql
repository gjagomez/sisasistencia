-- Script para insertar datos iniciales en el sistema
-- Ejecutar DESPUÉS de crear-tablas.sql

-- 1. Insertar empresa
INSERT INTO Empresa (nombre, direccion, telefono, email, mision, vision, fecha_fundacion)
VALUES (
  'Organización de Asistencia a Víctimas',
  'Ciudad de Guatemala, Guatemala',
  '2222-3333',
  'info@asistencia.org',
  'Brindar asistencia integral a familias afectadas por desastres naturales',
  'Ser la organización líder en asistencia humanitaria en Guatemala',
  TO_DATE('2020-01-01', 'YYYY-MM-DD')
);

-- 2. Insertar empleado administrador
INSERT INTO Empleados (id_empresa, nombre, apellido, dpi, puesto, telefono, email, fecha_contratacion)
VALUES (
  (SELECT id_empresa FROM Empresa WHERE nombre = 'Organización de Asistencia a Víctimas'),
  'Admin',
  'Sistema',
  '1234567890101',
  'Administrador del Sistema',
  '5555-1234',
  'admin@sistema.com',
  SYSDATE
);

-- 3. Insertar usuario administrador
INSERT INTO Usuarios (id_empleado, nombre_usuario, password, rol, estado, fecha_creacion)
VALUES (
  (SELECT id_empleado FROM Empleados WHERE email = 'admin@sistema.com'),
  'admin',
  'admin123',
  'Administrador',
  'Activo',
  SYSDATE
);

-- 4. Insertar un fondo general inicial
INSERT INTO Fondo (nombre_fondo, saldo, descripcion)
VALUES (
  'Fondo General',
  0,
  'Fondo principal para operaciones generales de la organización'
);

INSERT INTO Fondo (nombre_fondo, saldo, descripcion)
VALUES (
  'Fondo de Emergencias',
  0,
  'Fondo destinado a situaciones de emergencia y desastres'
);

-- Confirmar cambios
COMMIT;

-- Mostrar resumen de datos insertados
SELECT 'Datos iniciales insertados exitosamente' AS resultado FROM DUAL;
SELECT 'Usuario: admin' AS usuario FROM DUAL;
SELECT 'Contraseña: admin123' AS password FROM DUAL;

-- Verificar datos insertados
SELECT 'EMPRESAS REGISTRADAS:' AS info FROM DUAL;
SELECT id_empresa, nombre, email FROM Empresa;

SELECT 'EMPLEADOS REGISTRADOS:' AS info FROM DUAL;
SELECT id_empleado, nombre, apellido, puesto, email FROM Empleados;

SELECT 'USUARIOS REGISTRADOS:' AS info FROM DUAL;
SELECT id_usuario, nombre_usuario, rol, estado FROM Usuarios;

SELECT 'FONDOS CREADOS:' AS info FROM DUAL;
SELECT id_fondo, nombre_fondo, saldo FROM Fondo;
