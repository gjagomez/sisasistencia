# Manual de Usuario
## Sistema de Asistencia a las Víctimas de Desastres Naturales

**Versión:** 1.0
**Fecha:** Octubre 2025
**Organización:** Sistema de Gestión de Donaciones y Asistencia Humanitaria

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Requisitos del Sistema](#2-requisitos-del-sistema)
3. [Acceso al Sistema](#3-acceso-al-sistema)
4. [Interfaz Principal](#4-interfaz-principal)
5. [Módulos del Sistema](#5-módulos-del-sistema)
   - 5.1 [Dashboard](#51-dashboard)
   - 5.2 [Gestión de Donadores](#52-gestión-de-donadores)
   - 5.3 [Gestión de Donaciones](#53-gestión-de-donaciones)
   - 5.4 [Gestión de Familias](#54-gestión-de-familias)
   - 5.5 [Gestión de Beneficiados](#55-gestión-de-beneficiados)
   - 5.6 [Apadrinamientos](#56-apadrinamientos)
   - 5.7 [Inventario y Artículos](#57-inventario-y-artículos)
   - 5.8 [Registro de Asistencias](#58-registro-de-asistencias)
   - 5.9 [Gestión de Desastres](#59-gestión-de-desastres)
   - 5.10 [Estudios Socioeconómicos](#510-estudios-socioeconómicos)
   - 5.11 [Fondos](#511-fondos)
   - 5.12 [Reportes y Estadísticas](#512-reportes-y-estadísticas)


---

## 1. Introducción

### 1.1 ¿Qué es el Sistema?

El Sistema de Asistencia a las Víctimas de Desastres Naturales es una aplicación web diseñada para organizaciones no gubernamentales que gestionan ayuda humanitaria. El sistema permite:

- **Gestionar donadores** y sus contribuciones (empresas y personas individuales)
- **Administrar donaciones** monetarias y en especie
- **Registrar familias beneficiadas** y sus miembros
- **Controlar el inventario** de víveres, medicamentos, mantas y otros artículos
- **Gestionar apadrinamientos** donde donadores apoyan directamente a familias
- **Realizar estudios socioeconómicos** para determinar necesidades
- **Generar reportes** y estadísticas de la labor de la organización

### 1.2 Objetivo del Sistema

El objetivo principal es proporcionar una herramienta eficiente que permita:

1. Llevar un control transparente de las donaciones recibidas
2. Optimizar la distribución de recursos a familias afectadas
3. Gestionar el inventario de artículos perecederos
4. Facilitar el seguimiento de familias apadrinadas
5. Generar información estadística para toma de decisiones

### 1.3 ¿A quién está dirigido?

Este manual está dirigido a:

- **Administradores del sistema:** Personal que gestiona usuarios, configuraciones y tiene acceso completo
- **Operadores/Capturistas:** Personal que registra donaciones, donadores, familias en el día a día
- **Personal de inventario:** Personal que gestiona el almacén, víveres y distribución
- **Directivos/Consultores:** Personal que consulta reportes y estadísticas sin modificar datos

---

## 2. Requisitos del Sistema

### 2.1 Requisitos Técnicos Mínimos

Para utilizar el sistema, necesita:

**Hardware:**
- Computadora con procesador Intel Core i3 o superior
- 4 GB de RAM mínimo (recomendado 8 GB)
- Conexión a Internet estable

**Software:**
- Sistema operativo: Windows 10/11, macOS 10.15+, o Linux
- Navegador web actualizado:
  - Google Chrome 90+ (recomendado)
  - Mozilla Firefox 88+
  - Microsoft Edge 90+
  - Safari 14+

**Conectividad:**
- Conexión a red local (LAN) o Internet
- Velocidad mínima recomendada: 2 Mbps

### 2.2 Credenciales de Acceso

Para acceder al sistema, necesitará:
- **Nombre de usuario** (proporcionado por el administrador)
- **Contraseña** (asignada por el administrador)

**IMPORTANTE:** No comparta sus credenciales con otras personas. Cada usuario debe tener su propia cuenta.

---

## 3. Acceso al Sistema

### 3.1 Iniciar Sesión

1. **Abra su navegador web**

2. **Ingrese la dirección del sistema:**
   ```
   http://localhost:5173
   ```
   (La dirección puede variar según la configuración de su organización)

3. **Complete el formulario de inicio de sesión:**
   - **Usuario:** Ingrese su nombre de usuario
   - **Contraseña:** Ingrese su contraseña

4. **Haga clic en el botón "Iniciar Sesión"**

5. Si las credenciales son correctas, será redirigido al **Dashboard** (página principal)

### 3.2 Problemas de Inicio de Sesión

Si no puede iniciar sesión:

-  Verifique que está escribiendo correctamente su usuario y contraseña
-  Asegúrese de que las mayúsculas/minúsculas son correctas
-  Revise que no tiene activada la tecla Bloq Mayús
-  Si olvidó su contraseña, contacte al administrador del sistema

### 3.3 Cerrar Sesión

Para cerrar sesión de forma segura:

1. Haga clic en el botón **"Cerrar Sesión"** ubicado en la barra lateral izquierda (sidebar)
2. Será redirigido a la página de inicio de sesión
3. Su sesión se habrá cerrado correctamente

**IMPORTANTE:** Siempre cierre sesión cuando termine de usar el sistema, especialmente en computadoras compartidas.

---

## 4. Interfaz Principal

### 4.1 Descripción General

Una vez que inicie sesión, verá la interfaz principal dividida en:

**Barra Superior (Header):**
- Logo de la organización
- Título del sistema
- Información del usuario conectado

**Barra Lateral Izquierda (Sidebar):**
- Menú de navegación con todos los módulos
- Avatar del usuario
- Botón de cerrar sesión

**Área Principal (Contenido):**
- Contenido del módulo seleccionado
- Formularios, tablas y gráficos

### 4.2 Menú de Navegación

El menú lateral contiene las siguientes opciones:

| Icono | Módulo | Descripción |
|-------|--------|-------------|
| 📊 | Dashboard | Vista general y estadísticas |
| 👥 | Donadores | Gestión de personas y empresas donantes |
| 💰 | Donaciones | Registro de todas las donaciones |
| 🏠 | Familias | Familias beneficiadas registradas |
| 👤 | Beneficiados | Miembros de las familias |
| 🤝 | Apadrinamientos | Relación donador-familia |
| 📦 | Inventario | Artículos y stock disponible |
| 🎁 | Asistencias | Entregas realizadas a familias |
| ⚠️ | Desastres | Registro de desastres naturales |
| 📋 | Estudios | Estudios socioeconómicos |
| 💵 | Fondos | Fondos económicos de la organización |
| 📈 | Reportes | Reportes y estadísticas detalladas |

### 4.3 Navegación

Para navegar entre módulos:

1. **Haga clic** en cualquier opción del menú lateral
2. El contenido del área principal cambiará automáticamente
3. El módulo activo se resalta en el menú

---

## 5. Módulos del Sistema

### 5.1 Dashboard

**Ubicación:** Página principal al iniciar sesión

**Descripción:**
El Dashboard muestra un resumen visual de la información más importante del sistema mediante tarjetas estadísticas y gráficos.

#### 5.1.1 Tarjetas Estadísticas

El dashboard muestra las siguientes métricas:

1. **Total de Familias Registradas**
   - Cantidad total de familias en el sistema
   - Incluye familias apadrinadas y no apadrinadas

2. **Total de Beneficiados**
   - Cantidad de personas (miembros) de todas las familias
   - Incluye niños, adultos y adultos mayores

3. **Familias Apadrinadas**
   - Cantidad de familias que actualmente tienen un padrino
   - Porcentaje respecto al total

4. **Total de Donadores**
   - Cantidad de personas y empresas que han donado
   - Incluye donadores activos e inactivos

5. **Donaciones Este Año**
   - Monto total en dinero recibido en el año actual
   - Expresado en quetzales (Q)

6. **Saldo de Fondos**
   - Suma de todos los fondos disponibles
   - Dinero disponible para compras

7. **Total de Asistencias**
   - Cantidad de entregas realizadas a familias
   - Incluye alimentos, medicinas, etc.

8. **Artículos por Vencer**
   - Cantidad de artículos próximos a su fecha de vencimiento
   - Alerta para priorizar su distribución

#### 5.1.2 Gráficos

- **Gráfico de barras:** Donaciones por mes
- **Gráfico de pastel:** Distribución de asistencias por tipo
- **Tabla:** Top 10 donadores del año

#### 5.1.3 Cómo usar el Dashboard

1. **Monitoreo rápido:** Use el dashboard cada vez que inicie sesión para ver el estado general
2. **Identificar alertas:** Preste atención a los artículos por vencer
3. **Análisis de tendencias:** Observe los gráficos para identificar patrones

---

### 5.2 Gestión de Donadores

**Módulo:** Donadores
**Usuarios:** Administradores, Operadores

**Descripción:**
Este módulo permite registrar y gestionar personas y empresas que realizan donaciones a la organización.

#### 5.2.1 Ver Listado de Donadores

1. Haga clic en **"Donadores"** en el menú lateral
2. Se mostrará una tabla con todos los donadores registrados
3. La tabla incluye:
   - Tipo (Persona/Empresa)
   - Nombre
   - DPI o NIT
   - Teléfono
   - Email
   - Dirección
   - Acciones (Ver, Editar, Eliminar)

#### 5.2.2 Registrar un Nuevo Donador

1. Haga clic en el botón **"+ Nuevo Donador"**
2. Complete el formulario:

**Campos obligatorios:**
- **Tipo de Donador:**
  - Seleccione "Persona" para donadores individuales
  - Seleccione "Empresa" para compañías u organizaciones

- **Nombre:**
  - Si es Persona: Nombre completo (Juan Carlos López Pérez)
  - Si es Empresa: Razón social (Corporación XYZ, S.A.)

**Campos opcionales pero recomendados:**
- **DPI:** Documento Personal de Identificación (solo para Personas)
- **NIT:** Número de Identificación Tributaria
- **Teléfono:** Número de contacto (formato: 2222-2222 o 5555-5555)
- **Email:** Correo electrónico
- **Dirección:** Dirección completa

3. Haga clic en **"Guardar"**
4. El sistema mostrará una confirmación de éxito

#### 5.2.3 Editar un Donador

1. Localice el donador en la tabla
2. Haga clic en el botón **"Editar"** (icono de lápiz)
3. Modifique los campos necesarios
4. Haga clic en **"Guardar Cambios"**

#### 5.2.4 Eliminar un Donador

**⚠️ ADVERTENCIA:** Esta acción no se puede deshacer.

1. Localice el donador en la tabla
2. Haga clic en el botón **"Eliminar"** (icono de basurero)
3. Confirme la eliminación en el cuadro de diálogo
4. El donador será eliminado permanentemente

**NOTA:** No podrá eliminar un donador que tenga donaciones o apadrinamientos registrados.

#### 5.2.5 Buscar Donadores

Use la barra de búsqueda en la parte superior de la tabla para filtrar por:
- Nombre
- DPI o NIT
- Teléfono
- Email

#### 5.2.6 Buenas Prácticas

 Siempre registre el DPI o NIT para identificación única
 Verifique que el email y teléfono sean correctos para comunicaciones
 Mantenga actualizada la información de contacto
 Use nombres completos sin abreviaturas

---

### 5.3 Gestión de Donaciones

**Módulo:** Donaciones
**Usuarios:** Administradores, Operadores

**Descripción:**
Permite registrar todas las donaciones recibidas, ya sean monetarias, en especie o mixtas.

#### 5.3.1 Ver Listado de Donaciones

1. Haga clic en **"Donaciones"** en el menú lateral
2. Se mostrará una tabla con todas las donaciones registradas
3. La tabla incluye:
   - Fecha de donación
   - Donador
   - Tipo (Monetaria/Especie/Mixta)
   - Monto (si aplica)
   - Descripción
   - Destino
   - Acciones

#### 5.3.2 Registrar una Nueva Donación

1. Haga clic en el botón **"+ Nueva Donación"**
2. Complete el formulario:

**Campos obligatorios:**

- **Donador:**
  - Seleccione el donador del menú desplegable
  - Si el donador no existe, primero regístrelo en el módulo de Donadores

- **Fecha de Donación:**
  - Seleccione la fecha en que se recibió la donación
  - Por defecto es la fecha actual

- **Tipo de Donación:**
  - **Monetaria:** Solo dinero en efectivo, cheque o transferencia
  - **Especie:** Solo bienes materiales (víveres, medicinas, ropa, etc.)
  - **Mixta:** Combinación de dinero y bienes materiales

**Campos condicionales según el tipo:**

- **Si es Monetaria o Mixta:**
  - **Monto Monetario:** Ingrese la cantidad en quetzales (Q)
  - Use formato: 1000.00 (sin símbolos, solo números y punto decimal)

- **Si es Especie o Mixta:**
  - **Descripción de Especie:** Detalle los artículos donados
  - Ejemplo: "10 quintales de arroz, 5 cajas de medicamentos"

- **Destino:** (Opcional)
  - Especifique el destino de la donación
  - Ejemplos: "Fondo General", "Familia Pérez", "Desastre Terremoto 2024"

3. Haga clic en **"Guardar"**
4. El sistema registrará la donación y mostrará confirmación

#### 5.3.3 Editar una Donación

1. Localice la donación en la tabla
2. Haga clic en el botón **"Editar"**
3. Modifique los campos necesarios
4. Haga clic en **"Guardar Cambios"**

**NOTA:** Solo se pueden editar donaciones recientes (menos de 30 días).

#### 5.3.4 Ver Donaciones por Donador

1. Use el filtro **"Buscar por donador"**
2. Seleccione el donador del menú desplegable
3. La tabla mostrará solo las donaciones de ese donador

#### 5.3.5 Generar Certificado de Donación

Para donaciones monetarias, puede generar un certificado:

1. Localice la donación en la tabla
2. Haga clic en **"Certificado"** (icono de documento)
3. El sistema generará un PDF con:
   - Datos del donador
   - Monto donado
   - Fecha
   - Firma digital

#### 5.3.6 Buenas Prácticas

 Registre las donaciones el mismo día que se reciben
 Sea específico en la descripción de artículos en especie
 Verifique el monto antes de guardar
 Adjunte el recibo de transferencia o cheque como respaldo
 Genere certificados para donadores que lo soliciten (deducción fiscal)

---

### 5.4 Gestión de Familias

**Módulo:** Familias
**Usuarios:** Administradores, Operadores, Personal de inventario

**Descripción:**
Permite registrar y administrar las familias beneficiadas por la organización.

#### 5.4.1 Ver Listado de Familias

1. Haga clic en **"Familias"** en el menú lateral
2. Se mostrará una tabla con todas las familias registradas
3. La tabla incluye:
   - ID de familia
   - Jefe de familia
   - Cantidad de miembros
   - Municipio/Departamento
   - ¿Apadrinada? (Sí/No)
   - Desastre asociado
   - Fecha de registro
   - Acciones

#### 5.4.2 Registrar una Nueva Familia

1. Haga clic en el botón **"+ Nueva Familia"**
2. Complete el formulario:

**Campos obligatorios:**

- **Jefe de Familia:**
  - Nombre completo del jefe/jefa de familia
  - Ejemplo: "María Elena García López"

- **Cantidad de Miembros:**
  - Número total de personas en la familia
  - Incluye al jefe de familia
  - Rango: 1 a 20

- **Dirección:**
  - Dirección completa de residencia
  - Incluya aldea, cantón o colonia
  - Ejemplo: "Aldea El Socorro, Sector 3, Casa #15"

- **Municipio:**
  - Nombre del municipio
  - Ejemplo: "San Juan Sacatepéquez"

- **Departamento:**
  - Nombre del departamento
  - Ejemplo: "Guatemala"

**Campos opcionales:**

- **¿Es Apadrinada?**
  - Seleccione "Sí" si la familia tiene un padrino
  - Seleccione "No" si aún no tiene padrino (por defecto)

- **Desastre Asociado:**
  - Seleccione el desastre por el cual la familia fue afectada
  - Si no está en la lista, primero regístrelo en el módulo de Desastres

3. Haga clic en **"Guardar"**
4. El sistema registrará la familia y mostrará su ID único

#### 5.4.3 Ver Detalles de una Familia

1. Localice la familia en la tabla
2. Haga clic en el botón **"Ver"** (icono de ojo)
3. Se mostrará una ventana con:
   - Datos completos de la familia
   - Listado de miembros (beneficiados)
   - Historial de asistencias recibidas
   - Estudios socioeconómicos realizados
   - Información de apadrinamiento (si aplica)

#### 5.4.4 Editar una Familia

1. Localice la familia en la tabla
2. Haga clic en el botón **"Editar"**
3. Modifique los campos necesarios
4. Haga clic en **"Guardar Cambios"**

**Campos que se pueden modificar:**
- Dirección (si la familia se mudó)
- Cantidad de miembros (si aumentó o disminuyó)
- Estado de apadrinamiento

#### 5.4.5 Filtros Disponibles

- **Familias Apadrinadas:** Muestra solo familias con padrino activo
- **Por Departamento:** Filtra por ubicación geográfica
- **Por Desastre:** Filtra por desastre asociado

#### 5.4.6 Buenas Prácticas

 Registre todos los miembros de la familia en el módulo de Beneficiados
 Actualice la cantidad de miembros si hay cambios (nacimientos, fallecimientos)
 Mantenga actualizada la dirección para entregas de asistencia
 Realice estudios socioeconómicos periódicamente
 Documente con fotografías (si la política de la organización lo permite)

---

### 5.5 Gestión de Beneficiados

**Módulo:** Beneficiados
**Usuarios:** Administradores, Operadores

**Descripción:**
Permite registrar individualmente a cada miembro de las familias beneficiadas.

#### 5.5.1 Ver Listado de Beneficiados

1. Haga clic en **"Beneficiados"** en el menú lateral
2. Se mostrará una tabla con todos los beneficiados registrados
3. La tabla incluye:
   - Nombre completo
   - DPI
   - Familia a la que pertenece
   - Fecha de nacimiento
   - Edad
   - Parentesco
   - Acciones

#### 5.5.2 Registrar un Nuevo Beneficiado

1. Haga clic en el botón **"+ Nuevo Beneficiado"**
2. Complete el formulario:

**Campos obligatorios:**

- **Familia:**
  - Seleccione la familia a la que pertenece del menú desplegable
  - La familia debe estar previamente registrada

- **Nombre:**
  - Primer y segundo nombre
  - Ejemplo: "José Antonio"

- **Apellido:**
  - Apellidos completos
  - Ejemplo: "García López"

**Campos opcionales pero importantes:**

- **DPI:**
  - Documento Personal de Identificación
  - Solo para mayores de edad (18+)
  - Formato: 1234567890101 (13 dígitos)

- **Fecha de Nacimiento:**
  - Seleccione la fecha en el calendario
  - El sistema calculará automáticamente la edad

- **Parentesco:**
  - Relación con el jefe de familia
  - Opciones: Jefe/a, Esposo/a, Hijo/a, Hermano/a, Padre/Madre, Nieto/a, Otro
  - Si es "Otro", especifique el parentesco

3. Haga clic en **"Guardar"**
4. El beneficiado quedará registrado y vinculado a la familia

#### 5.5.3 Ver Beneficiados por Familia

1. Use el filtro **"Buscar por familia"**
2. Seleccione la familia del menú desplegable
3. La tabla mostrará solo los miembros de esa familia

#### 5.5.4 Editar un Beneficiado

1. Localice el beneficiado en la tabla
2. Haga clic en el botón **"Editar"**
3. Modifique los campos necesarios
4. Haga clic en **"Guardar Cambios"**

#### 5.5.5 Buenas Prácticas

 Registre a TODOS los miembros de cada familia, incluyendo bebés
 Actualice el DPI cuando los menores cumplan 18 años
 Verifique que la cantidad de beneficiados coincida con "Cantidad de miembros" de la familia
 Use nombres completos y correctos
 Mantenga actualizado el parentesco (puede cambiar en familias reconstituidas)

---

### 5.6 Apadrinamientos

**Módulo:** Apadrinamientos
**Usuarios:** Administradores, Operadores

**Descripción:**
Gestiona la relación entre donadores (padrinos) y familias beneficiadas. Un donador puede apadrinar múltiples familias, y una familia puede tener un solo padrino activo a la vez.

#### 5.6.1 Ver Listado de Apadrinamientos

1. Haga clic en **"Apadrinamientos"** en el menú lateral
2. Se mostrará una tabla con todos los apadrinamientos
3. La tabla incluye:
   - Donador (padrino)
   - Familia apadrinada
   - Fecha de inicio
   - Fecha de fin (si aplica)
   - Estado (Activo/Finalizado)
   - Acciones

#### 5.6.2 Crear un Nuevo Apadrinamiento

1. Haga clic en el botón **"+ Nuevo Apadrinamiento"**
2. Complete el formulario:

**Campos obligatorios:**

- **Donador (Padrino):**
  - Seleccione el donador que será el padrino
  - Solo aparecen donadores previamente registrados

- **Familia:**
  - Seleccione la familia que será apadrinada
  - Solo aparecen familias que NO tengan padrino activo

- **Fecha de Inicio:**
  - Fecha en que inicia el apadrinamiento
  - Por defecto es la fecha actual

- **Estado:**
  - Seleccione "Activo" para iniciar el apadrinamiento
  - "Finalizado" solo se usa al terminar un apadrinamiento existente

3. Haga clic en **"Guardar"**
4. El sistema:
   - Registra el apadrinamiento
   - Marca la familia como "Apadrinada"
   - Envía notificación (si está configurado)

#### 5.6.3 Finalizar un Apadrinamiento

Cuando una familia ya no necesita apoyo (según estudio socioeconómico):

1. Localice el apadrinamiento en la tabla
2. Haga clic en el botón **"Finalizar"**
3. El sistema abrirá un formulario:
   - **Fecha de Fin:** Seleccione la fecha actual
   - **Motivo de Finalización:**
     - "Familia autosuficiente" (recuperó su economía)
     - "Decisión del padrino" (el padrino decidió terminar)
     - "Familia no localizada" (se mudó sin avisar)
     - "Otro" (especifique el motivo)
   - **Observaciones:** Comentarios adicionales

4. Haga clic en **"Confirmar Finalización"**
5. El sistema:
   - Cambia el estado a "Finalizado"
   - Marca la familia como "No apadrinada"
   - Libera la familia para ser apadrinada por otro donador

#### 5.6.4 Filtros Disponibles

- **Apadrinamientos Activos:** Solo apadrinamientos en curso
- **Apadrinamientos Finalizados:** Historial de apadrinamientos terminados
- **Por Donador:** Filtra por padrino específico
- **Por Familia:** Filtra por familia específica

#### 5.6.5 Reportes de Apadrinamiento

Puede generar:

1. **Certificado de Apadrinamiento:**
   - Documento oficial para el padrino
   - Incluye datos de la familia apadrinada

2. **Constancia de Asistencia:**
   - Detalle de todas las asistencias recibidas por la familia
   - Útil para el padrino como comprobante

3. **Reporte Anual:**
   - Resumen del año con fotografías y logros
   - Para enviar al padrino

#### 5.6.6 Buenas Prácticas

 Realice estudios socioeconómicos antes de asignar apadrinamiento
 Finalice apadrinamientos cuando la familia sea autosuficiente
 Comunique al padrino la situación de la familia periódicamente
 Genere reportes anuales para mantener informado al padrino
 Documente con fotos y testimonios (con autorización de la familia)

---

### 5.7 Inventario y Artículos

**Módulo:** Inventario
**Usuarios:** Administradores, Personal de inventario

**Descripción:**
Permite gestionar el catálogo de artículos y el inventario por lotes, especialmente artículos perecederos que deben rotarse antes de su vencimiento.

#### 5.7.1 Ver Catálogo de Artículos

1. Haga clic en **"Inventario"** en el menú lateral
2. Se mostrará el catálogo de artículos con:
   - Nombre del artículo
   - Categoría
   - Unidad de medida
   - Costo unitario
   - Stock disponible (suma de todos los lotes)
   - Acciones

#### 5.7.2 Registrar un Nuevo Artículo

1. Haga clic en el botón **"+ Nuevo Artículo"**
2. Complete el formulario:

**Campos obligatorios:**

- **Nombre del Artículo:**
  - Nombre descriptivo del producto
  - Ejemplos: "Arroz blanco", "Frijol negro", "Aceite vegetal"

- **Categoría:**
  - Clasificación del artículo
  - Opciones: Alimentos, Medicamentos, Ropa, Mantas, Agua potable, Higiene, Construcción, Otro

- **Unidad de Medida:**
  - Unidad en que se mide el artículo
  - Ejemplos: Quintal, Libra, Litro, Caja, Unidad, Paquete

- **Costo Unitario:**
  - Costo promedio por unidad en quetzales
  - Ejemplo: 150.00
  - Se usa para calcular el valor del inventario

3. Haga clic en **"Guardar"**
4. El artículo quedará disponible para registrar lotes

#### 5.7.3 Gestionar Lotes de Inventario

**¿Qué es un lote?**
Un lote es un conjunto de unidades de un artículo que ingresó al inventario en una fecha específica y puede tener fecha de vencimiento.

**Ver Lotes:**

1. En la tabla de artículos, haga clic en **"Ver Lotes"** del artículo deseado
2. Se mostrará una tabla con todos los lotes de ese artículo:
   - Cantidad inicial
   - Cantidad disponible
   - Fecha de entrada
   - Fecha de vencimiento
   - Origen (donación, compra)
   - Acciones

**Registrar un Nuevo Lote:**

1. Haga clic en **"+ Nuevo Lote"**
2. Complete el formulario:

- **Artículo:** Seleccione el artículo (prellenado si viene desde la vista de artículo)
- **Cantidad Inicial:** Cantidad de unidades que ingresan
- **Fecha de Entrada:** Fecha en que se recibe el lote (por defecto hoy)
- **Fecha de Vencimiento:** Fecha en que expira el producto (solo para perecederos)
- **Origen:** De dónde proviene el lote
  - Ejemplos: "Donación Empresa XYZ", "Compra con Fondo General", "Donación anónima"

3. Haga clic en **"Guardar"**
4. El sistema creará el lote con:
   - `cantidad_disponible` = `cantidad_inicial`
   - Estado activo para distribución

#### 5.7.4 Alertas de Vencimiento

El sistema genera alertas automáticas para artículos próximos a vencer:

**En el Dashboard:**
- Tarjeta **"Artículos por Vencer"** muestra la cantidad

**En el módulo Inventario:**
- Pestaña **"Próximos a Vencer"** muestra lotes con menos de 30 días para vencer
- Los lotes aparecen destacados en color naranja o rojo según urgencia

**Acciones recomendadas:**
1. Priorizar la entrega de estos artículos a familias apadrinadas
2. Registrar asistencias usando estos lotes
3. Contactar a familias para coordinar entrega urgente

#### 5.7.5 Descontar Inventario

El inventario se descuenta automáticamente cuando:

1. Se registra una **Asistencia** usando un lote específico
2. El sistema resta la `cantidad_entregada` de `cantidad_disponible` del lote

**Importante:** No se puede descontar manualmente. Siempre debe hacerse mediante el módulo de Asistencias para mantener trazabilidad.

#### 5.7.6 Editar o Eliminar Lotes

**Editar:** Solo se puede ajustar la cantidad disponible en casos de:
- Error de captura
- Merma o daño de producto
- Auditoría de inventario

**Eliminar:** Solo se pueden eliminar lotes sin movimientos (sin asistencias registradas).

#### 5.7.7 Buenas Prácticas

 Registre lotes separados para cada ingreso de mercancía
 Sea específico en el origen del lote (para trazabilidad)
 Ingrese SIEMPRE la fecha de vencimiento de productos perecederos
 Revise semanalmente la pestaña "Próximos a Vencer"
 Use el método FIFO (First In, First Out): entregue primero lo que vence primero
 Realice inventarios físicos mensuales para verificar cantidades
 Deduzca el costo de artículos próximos a vencer del apadrinamiento (como indica el requerimiento)

---

### 5.8 Registro de Asistencias

**Módulo:** Asistencias
**Usuarios:** Administradores, Operadores, Personal de inventario

**Descripción:**
Permite registrar todas las entregas de ayuda realizadas a las familias beneficiadas. Cada asistencia descuenta automáticamente del inventario.

#### 5.8.1 Ver Listado de Asistencias

1. Haga clic en **"Asistencias"** en el menú lateral
2. Se mostrará una tabla con todas las asistencias registradas:
   - Fecha de entrega
   - Familia beneficiada
   - Tipo de asistencia
   - Artículo entregado
   - Cantidad
   - Valor estimado
   - Observaciones
   - Acciones

#### 5.8.2 Registrar una Nueva Asistencia

1. Haga clic en el botón **"+ Nueva Asistencia"**
2. Complete el formulario:

**Campos obligatorios:**

- **Familia:**
  - Seleccione la familia que recibirá la ayuda
  - Use el buscador si hay muchas familias

- **Fecha de Entrega:**
  - Fecha en que se realiza la entrega
  - Por defecto es la fecha actual

- **Tipo de Asistencia:**
  - Categoría de ayuda proporcionada
  - Opciones: Alimentos, Medicamentos, Ropa, Mantas, Agua potable, Higiene, Construcción, Económica, Otro

**Campos para asistencias con artículos del inventario:**

- **Artículo:**
  - Seleccione el artículo del inventario
  - Solo aparecen artículos con stock disponible

- **Lote:**
  - Seleccione el lote específico del artículo
  - **Importante:** Seleccione primero los lotes próximos a vencer
  - El sistema muestra la cantidad disponible de cada lote

- **Cantidad Entregada:**
  - Cantidad de unidades a entregar
  - No puede exceder la cantidad disponible del lote
  - El sistema validará automáticamente

- **Valor Estimado:**
  - El sistema lo calcula automáticamente
  - Fórmula: `cantidad_entregada × costo_unitario`
  - Puede ajustarlo manualmente si es necesario

**Campos opcionales:**

- **Observaciones:**
  - Comentarios adicionales sobre la entrega
  - Ejemplos: "Entrega mensual", "Emergencia por enfermedad", "Familia en extrema necesidad"

3. Haga clic en **"Guardar"**
4. El sistema:
   - Registra la asistencia
   - Descuenta la cantidad del lote seleccionado
   - Actualiza el stock del artículo
   - Genera comprobante de entrega (opcional)

#### 5.8.3 Asistencias a Familias Apadrinadas

**Procedimiento especial para artículos próximos a vencer:**

Según el requerimiento, cuando un artículo está próximo a vencer:

1. Se prioriza su entrega a familias apadrinadas
2. Se deduce el costo del artículo del apadrinamiento
3. Esto permite mantener el inventario fresco y apoyar a las familias

**Cómo registrar:**

1. Registre la asistencia normalmente
2. En **"Tipo de Asistencia"** seleccione la categoría correspondiente
3. En **"Observaciones"** indique: "Artículo próximo a vencer - deducido de apadrinamiento"
4. El sistema marcará la asistencia para reportar al padrino

#### 5.8.4 Generar Constancia de Asistencia

Para generar un comprobante de entrega:

1. Localice la asistencia en la tabla
2. Haga clic en **"Generar Constancia"** (icono de documento)
3. El sistema creará un PDF con:
   - Datos de la familia
   - Detalle de los artículos entregados
   - Fecha y hora
   - Espacio para firma de recibido

4. Imprima el documento
5. Solicite firma del jefe de familia como comprobante de recibido

#### 5.8.5 Ver Asistencias por Familia

1. Use el filtro **"Buscar por familia"**
2. Seleccione la familia del menú desplegable
3. La tabla mostrará todo el historial de asistencias de esa familia
4. Útil para:
   - Verificar frecuencia de entregas
   - Generar reportes para padrinos
   - Análisis de necesidades

#### 5.8.6 Buenas Prácticas

 Registre asistencias el mismo día de la entrega
 Siempre use lotes próximos a vencer primero (método FIFO)
 Genere constancia de entrega y solicite firma del beneficiario
 Sea específico en las observaciones
 Verifique el stock disponible antes de prometer entregas
 Informe al padrino sobre asistencias entregadas a su familia apadrinada
 Tome fotografías de las entregas (con autorización) para reportes

---

### 5.9 Gestión de Desastres

**Módulo:** Desastres
**Usuarios:** Administradores, Operadores

**Descripción:**
Permite registrar eventos de desastres naturales que afectan a las comunidades. Esto ayuda a asociar familias beneficiadas con el evento que las afectó y generar estadísticas.

#### 5.9.1 Ver Listado de Desastres

1. Haga clic en **"Desastres"** en el menú lateral
2. Se mostrará una tabla con todos los desastres registrados:
   - Nombre del desastre
   - Tipo
   - Fecha del evento
   - Ubicación
   - Familias afectadas (contador)
   - Acciones

#### 5.9.2 Registrar un Nuevo Desastre

1. Haga clic en el botón **"+ Nuevo Desastre"**
2. Complete el formulario:

**Campos obligatorios:**

- **Nombre del Desastre:**
  - Nombre descriptivo del evento
  - Ejemplos: "Terremoto de San Marcos 2024", "Huracán Eta 2020", "Erupción Volcán de Fuego 2023"

- **Tipo de Desastre:**
  - Categoría del evento natural
  - Opciones:
    - Terremoto / Sismo
    - Huracán / Tormenta tropical
    - Inundación
    - Deslizamiento / Deslaves
    - Erupción volcánica
    - Sequía
    - Incendio forestal
    - Otro

- **Fecha del Desastre:**
  - Fecha en que ocurrió el evento
  - Si fue un evento de varios días, use la fecha de inicio

**Campos opcionales:**

- **Ubicación:**
  - Lugar(es) afectado(s)
  - Ejemplos: "San Marcos, Quetzaltenango", "Costa Sur de Guatemala", "Aldea El Cambray, Santa Catarina Pinula"

- **Descripción:**
  - Detalle adicional del evento
  - Puede incluir:
    - Magnitud o intensidad
    - Número estimado de damnificados
    - Daños principales
    - Acciones de respuesta
  - Máximo 1000 caracteres

3. Haga clic en **"Guardar"**
4. El desastre quedará registrado y disponible para asociar familias

#### 5.9.3 Ver Familias Afectadas por un Desastre

1. Localice el desastre en la tabla
2. Haga clic en **"Ver Familias"** (icono de lista)
3. Se mostrará una lista de todas las familias asociadas a ese desastre
4. Incluye:
   - Datos de las familias
   - Cantidad de miembros
   - Ubicación
   - Estado de apadrinamiento
   - Asistencias recibidas

#### 5.9.4 Asociar Familias a un Desastre

Las familias se asocian al desastre durante su registro en el módulo de Familias:

1. Al crear una familia nueva
2. En el campo **"Desastre Asociado"**
3. Seleccione el desastre del menú desplegable

Si necesita asociar una familia existente:

1. Vaya al módulo **Familias**
2. Edite la familia
3. Seleccione el desastre correspondiente
4. Guarde los cambios

#### 5.9.5 Generar Reportes de Desastres

Puede generar reportes estadísticos:

1. Haga clic en **"Reporte"** del desastre deseado
2. El sistema generará un informe PDF con:
   - Datos del desastre
   - Cantidad de familias afectadas
   - Cantidad total de beneficiados
   - Asistencias entregadas relacionadas
   - Monto total invertido en apoyo
   - Distribución geográfica

3. Útil para:
   - Informes a donadores
   - Solicitudes de financiamiento
   - Rendición de cuentas
   - Archivo histórico

#### 5.9.6 Buenas Prácticas

 Registre desastres apenas ocurran para empezar el seguimiento inmediato
 Use nombres descriptivos que incluyan año y ubicación
 Actualice la descripción con nueva información (daños, damnificados)
 Asocie TODAS las familias afectadas aunque aún no reciban ayuda
 Genere reportes periódicos para mantener informados a los donadores
 Mantenga un archivo histórico para análisis de riesgos y patrones

---

### 5.10 Estudios Socioeconómicos

**Módulo:** Estudios
**Usuarios:** Administradores, Operadores

**Descripción:**
Permite registrar estudios socioeconómicos de las familias beneficiadas para evaluar su situación financiera y determinar si pueden continuar sin ayuda.

#### 5.10.1 Ver Listado de Estudios

1. Haga clic en **"Estudios"** en el menú lateral
2. Se mostrará una tabla con todos los estudios registrados:
   - Familia evaluada
   - Fecha del estudio
   - Ingresos familiares
   - Gastos familiares
   - Balance (Ingresos - Gastos)
   - Conclusión
   - Acciones

#### 5.10.2 Registrar un Nuevo Estudio

1. Haga clic en el botón **"+ Nuevo Estudio"**
2. Complete el formulario:

**Campos obligatorios:**

- **Familia:**
  - Seleccione la familia a evaluar
  - Idealmente familias apadrinadas o con asistencia frecuente

- **Fecha del Estudio:**
  - Fecha en que se realizó la evaluación
  - Por defecto es la fecha actual

- **Ingresos Familiares Mensuales:**
  - Suma de todos los ingresos del hogar en quetzales
  - Incluya:
    - Salarios y sueldos
    - Ventas o negocios propios
    - Remesas del extranjero
    - Ayudas gubernamentales
    - Otros ingresos
  - Ejemplo: 2500.00

- **Gastos Familiares Mensuales:**
  - Suma de todos los gastos del hogar en quetzales
  - Incluya:
    - Alimentación
    - Vivienda (alquiler, servicios)
    - Educación
    - Salud y medicinas
    - Transporte
    - Otros gastos básicos
  - Ejemplo: 2800.00

**El sistema calcula automáticamente:**
- **Balance:** Ingresos - Gastos
- **Indicador:**
  - Verde: Balance positivo (ingresos > gastos)
  - Naranja: Balance neutro (ingresos ≈ gastos)
  - Rojo: Balance negativo (ingresos < gastos)

**Campos de análisis:**

- **Conclusión:**
  - Evaluación profesional del trabajador social
  - Recomendaciones:
    - "La familia requiere apoyo continuo" (balance negativo)
    - "La familia aún requiere apoyo temporal" (balance neutro)
    - "La familia puede continuar sin ayuda" (balance positivo estable)
  - Máximo 1000 caracteres

- **Observaciones:**
  - Detalles adicionales
  - Puede incluir:
    - Situaciones especiales (enfermedades, discapacidades)
    - Oportunidades de empleo
    - Proyectos familiares
    - Cambios recientes en la situación
  - Máximo 1000 caracteres

3. Haga clic en **"Guardar"**
4. El estudio quedará registrado en el historial de la familia

#### 5.10.3 Ver Historial de Estudios de una Familia

Para ver la evolución socioeconómica de una familia:

1. Use el filtro **"Buscar por familia"**
2. Seleccione la familia
3. La tabla mostrará todos los estudios realizados en orden cronológico
4. Compare estudios para ver:
   - Progreso económico
   - Tendencias (mejora o deterioro)
   - Efectividad de la ayuda proporcionada

#### 5.10.4 Ver Último Estudio de una Familia

1. Vaya al módulo **Familias**
2. Seleccione la familia
3. En el panel de detalles, sección **"Último Estudio Socioeconómico"**
4. Se mostrará:
   - Fecha del último estudio
   - Balance actual
   - Conclusión
   - Botón para ver historial completo

#### 5.10.5 Generar Certificado de Estudio

Para documentos oficiales:

1. Localice el estudio en la tabla
2. Haga clic en **"Certificado"** (icono de documento)
3. El sistema generará un PDF profesional con:
   - Membrete de la organización
   - Datos de la familia
   - Resultados del estudio
   - Conclusiones y recomendaciones
   - Firma del trabajador social

4. Útil para:
   - Expediente de la familia
   - Justificación de finalización de apadrinamiento
   - Solicitudes de ayuda a otras instituciones

#### 5.10.6 Cuándo Realizar Estudios

**Frecuencia recomendada:**

- **Familias apadrinadas:** Cada 6 meses
- **Familias con asistencia frecuente:** Cada año
- **Familias en recuperación:** Cada 3 meses

**Momentos clave:**

1. **Antes de asignar apadrinamiento:** Para establecer línea base
2. **Durante el apadrinamiento:** Para monitorear progreso
3. **Antes de finalizar apadrinamiento:** Para confirmar autosuficiencia
4. **Después de emergencias:** Para evaluar nuevas necesidades



### 5.11 Fondos

**Módulo:** Fondos
**Usuarios:** Administradores

**Descripción:**
Administra los fondos económicos de la organización. Los fondos son cuentas donde se concentran las donaciones monetarias para diferentes propósitos.

#### 5.11.1 Ver Listado de Fondos

1. Haga clic en **"Fondos"** en el menú lateral
2. Se mostrará una tabla con todos los fondos:
   - Nombre del fondo
   - Saldo actual
   - Descripción
   - Última actualización
   - Acciones

#### 5.11.2 Crear un Nuevo Fondo

1. Haga clic en el botón **"+ Nuevo Fondo"**
2. Complete el formulario:

**Campos obligatorios:**

- **Nombre del Fondo:**
  - Nombre descriptivo
  - Ejemplos:
    - "Fondo de Emergencias"
    - "Fondo para Víveres"
    - "Fondo de Medicamentos"
    - "Fondo Educativo"

- **Saldo Inicial:**
  - Cantidad inicial en quetzales
  - Puede ser 0.00 si inicia vacío
  - Ejemplo: 50000.00

**Campos opcionales:**

- **Descripción:**
  - Propósito del fondo
  - Ejemplo: "Fondo común para compra de víveres, mantas, medicamentos y agua potable durante emergencias"

3. Haga clic en **"Guardar"**
4. El fondo quedará creado y disponible para operaciones

#### 5.11.3 Operaciones con Fondos

**Incrementar Saldo:**

Cuando se recibe una donación monetaria:

1. Localice el fondo en la tabla
2. Haga clic en **"Actualizar Saldo"**
3. Seleccione operación: **"Incrementar"**
4. Ingrese el monto: Ejemplo: 5000.00
5. Ingrese concepto: "Donación de Empresa XYZ"
6. Haga clic en **"Guardar"**
7. El saldo se incrementará automáticamente

**Disminuir Saldo:**

Cuando se realiza una compra con el fondo:

1. Localice el fondo en la tabla
2. Haga clic en **"Actualizar Saldo"**
3. Seleccione operación: **"Disminuir"**
4. Ingrese el monto: Ejemplo: 1500.00
5. Ingrese concepto: "Compra de 10 quintales de arroz"
6. Haga clic en **"Guardar"**
7. El saldo se disminuirá automáticamente

**El sistema valida:**
- No se puede disminuir más del saldo disponible
- Los montos deben ser positivos
- El concepto es obligatorio para trazabilidad

#### 5.11.4 Ver Historial de Movimientos

Para ver todas las transacciones de un fondo:

1. Localice el fondo en la tabla
2. Haga clic en **"Ver Historial"**
3. Se mostrará una tabla con:
   - Fecha y hora
   - Tipo de operación (Incremento/Disminución)
   - Monto
   - Concepto
   - Saldo resultante
   - Usuario que realizó la operación

#### 5.11.5 Conciliación de Fondos

Periódicamente, concilie los fondos del sistema con las cuentas bancarias:

1. Genere el reporte de movimientos del fondo
2. Compare con el estado de cuenta bancario
3. Verifique que coincidan los saldos
4. Si hay diferencias, investigue y ajuste


---

### 5.12 Reportes y Estadísticas

**Módulo:** Reportes
**Usuarios:** Todos los usuarios (según permisos)

**Descripción:**
Genera reportes detallados y estadísticas sobre todos los aspectos del sistema para análisis, auditorías y toma de decisiones.

#### 5.12.1 Acceder al Módulo de Reportes

1. Haga clic en **"Reportes"** en el menú lateral
2. Se mostrará el panel de reportes con diferentes categorías:
   - Reportes de Donaciones
   - Reportes de Familias y Beneficiados
   - Reportes de Inventario
   - Reportes de Apadrinamientos
   - Reportes Financieros
   - Reportes de Desastres
   - Estadísticas Generales

#### 5.12.2 Reportes Disponibles

**A. Reportes de Donaciones**

1. **Reporte General de Donaciones**
   - Todas las donaciones en un período
   - Filtros: Fecha inicio/fin, tipo, donador
   - Exportar a: PDF, Excel

2. **Donaciones por Donador**
   - Historial completo de un donador específico
   - Total donado
   - Frecuencia de donaciones

3. **Donaciones por Tipo**
   - Gráfico de distribución: Monetaria, Especie, Mixta
   - Comparativo por períodos

4. **Top Donadores**
   - Ranking de donadores por monto
   - Seleccionar cantidad: Top 10, Top 20, Top 50

**B. Reportes de Familias y Beneficiados**

1. **Listado de Familias**
   - Todas las familias registradas
   - Filtros: Departamento, apadrinadas, desastre
   - Incluye cantidad de miembros

2. **Distribución Geográfica**
   - Mapa o tabla de familias por departamento/municipio
   - Gráfico de barras

3. **Familias por Desastre**
   - Familias afectadas por cada evento
   - Estadísticas de atención brindada

4. **Reporte de Beneficiados**
   - Listado completo de personas beneficiadas
   - Filtros: Edad, familia, desastre
   - Estadísticas demográficas

**C. Reportes de Inventario**

1. **Inventario Actual**
   - Stock de todos los artículos
   - Valor total del inventario
   - Por categoría

2. **Artículos Próximos a Vencer**
   - Lotes que vencen en los próximos 30, 60, 90 días
   - Ordenados por urgencia
   - Recomendaciones de distribución

3. **Movimientos de Inventario**
   - Ingresos y salidas en un período
   - Por artículo específico o todos
   - Gráfico de flujo

4. **Asistencias Entregadas**
   - Todas las entregas en un período
   - Por familia, por tipo, por artículo
   - Valor total distribuido

**D. Reportes de Apadrinamientos**

1. **Apadrinamientos Activos**
   - Listado de todos los apadrinamientos vigentes
   - Donador, familia, fecha de inicio
   - Asistencias entregadas a la familia

2. **Reporte para Padrino**
   - Documento personalizado para enviar al padrino
   - Situación de la familia apadrinada
   - Asistencias recibidas
   - Fotos y testimonios (si aplica)

3. **Historial de Apadrinamientos**
   - Todos los apadrinamientos (activos y finalizados)
   - Duración promedio
   - Motivos de finalización

**E. Reportes Financieros**

1. **Estado de Fondos**
   - Saldos actuales de todos los fondos
   - Total disponible
   - Gráfico de distribución

2. **Movimientos de Fondos**
   - Ingresos y egresos por fondo
   - Período seleccionable
   - Balance general

3. **Valor del Inventario**
   - Cálculo del valor total en stock
   - Por categoría de artículos
   - Comparativo con períodos anteriores

**F. Reportes de Desastres**

1. **Informe por Desastre**
   - Detalle completo de un desastre específico
   - Familias afectadas
   - Asistencias brindadas
   - Inversión total

2. **Comparativo de Desastres**
   - Compara impacto de diferentes eventos
   - Familias afectadas
   - Recursos utilizados

**G. Estadísticas Generales**

1. **Dashboard Ejecutivo**
   - Resumen de todas las métricas clave
   - Gráficos y tendencias
   - Comparativo con año anterior

2. **Tendencias Anuales**
   - Evolución de donaciones, familias, asistencias
   - Por mes o trimestre
   - Proyecciones

3. **Indicadores de Desempeño (KPIs)**
   - Promedio de asistencias por familia
   - Tasa de autosuficiencia (familias que ya no necesitan apoyo)
   - Efectividad de apadrinamientos
   - Rotación de inventario


