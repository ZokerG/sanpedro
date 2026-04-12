# CorpoSanpedro — Estado del Proyecto

> Última actualización: 2026-04-10

---

## 🏗️ Arquitectura General

**Stack:**
- **Backend:** Java 21 · Spring Boot 4.0.5 · PostgreSQL · MapStruct · Lombok
- **Frontend:** Next.js · React Query · Axios · Tailwind CSS
- **Base de datos:** `festival_bambuco` en PostgreSQL local (puerto 5432)

**Enfoque actual:** ERP de Control de Personal y Acreditación para el Festival San Pedro del Huila.  
El sistema gestiona tres tipos de personal (Logístico, Administrativo, Prensa) con expedientes digitales, carnés de acreditación y control presupuestal de eventos.

---

## ✅ Completado

### Backend — Limpieza de código heredado

Se eliminaron todas las entidades, servicios, controladores y DTOs del modelo anterior orientado a tareas e ítems:

| Eliminado | Descripción |
|---|---|
| `Novedad`, `EntidadNovedad` | Entidades + capa completa (Service, Controller, Repository, DTOs) |
| `ItemEvento`, `SubTarea`, `PoolTransversal`, `TareaPadre`, `AsignacionPool` | Entidades + capa completa |
| `PersonalLogistico`, `AsignacionPersonalLogistico` | Entidades + capa completa |
| `AsignacionPersonalController` (viejo) | Controlador huérfano |

**Resultado:** `mvn clean compile` → ✅ BUILD SUCCESS

---

### Backend — Nuevas Entidades y Enums

| Archivo | Tipo | Descripción |
|---|---|---|
| `TipoPersonal` | Enum | `LOGISTICO`, `ADMINISTRATIVO`, `PRENSA` |
| `TipoDocumento` | Enum | Tipos de identificación (CC, CE, PP, TI, NIT) |
| `TipoBanco` | Enum | Entidades bancarias colombianas |
| `TipoCuentaBancaria` | Enum | `AHORROS`, `CORRIENTE`, `DEPOSITO_BAJO_MONTO` |
| `TipoDocumentoRequerido` | Enum | Docs mínimos: `CEDULA`, `RUT`, `CERTIFICADO_BANCARIO`, etc. |
| `EstadoDocumento` | Enum | `PENDIENTE`, `VERIFICADO`, `RECHAZADO` |
| `Personal` | Entidad | Expediente completo: nombres, apellidos, tipo doc, datos bancarios, tipo personal, cargo (Rol), QR, camiseta, vínculo 1:1 con `Usuario` |
| `DocumentoPersonal` | Entidad | Carpeta digital: archivo cargado + estado de verificación por tipo de documento requerido |
| `AsignacionPersonal` | Entidad | Asignación solo para `LOGISTICO` a eventos; incluye campo `asistio` para liquidación |
| `PersonalRepository` | Repositorio | Filtros por `TipoPersonal`, documento, camiseta |
| `AsignacionPersonalRepository` | Repositorio | Queries para límite de cupos y asistentes confirmados |
| `DocumentoPersonalRepository` | Repositorio | Búsqueda por persona y tipo de documento |

### Backend — Entidades Modificadas

| Archivo | Cambio |
|---|---|
| `Evento` | Añadido: `ubicacionLogistica`, `limitePersonal` (tope de asignación), `cuotaPago` (tarifa por asistencia) |
| `TipoDocumento` | Remplazados valores genéricos → tipos de identificación personal |
| `EventoRequestDTO` / `EventoResponseDTO` | Nuevos campos: `ubicacionLogistica`, `limitePersonal`, `cuotaPago`, `totalAsignados` |

### Backend — Capa de Aplicación (Servicios y API REST)

| Componente | Endpoints |
|---|---|
| `PersonalService` + `PersonalController` | `GET /api/personal?tipo=LOGISTICO`, `POST`, `PUT /{id}`, `DELETE /{id}`, `PATCH /{id}/desactivar` |
| `AsignacionPersonalService` + `AsignacionPersonalController` | `POST /api/asignaciones`, `GET /evento/{id}`, `PATCH /{id}/confirmar-asistencia`, `POST /evento/{id}/liquidar` |
| `EventoServiceImpl` | Actualizado con mapeo de campos logísticos + `totalAsignados` calculado en runtime |
| `DocumentoPersonalService` + `DocumentoPersonalController` | `POST /api/personal/{id}/documentos` (Subida S3), `GET`, `PATCH /documentos/{id}/estado` |
| `S3StorageService` (Infra) | Integración nativa con **MinIO (S3)** para persistencia de archivos fuera del servidor |
| `DataInitializer` | Roles nuevos: `SUPER_ADMIN`, `ADMIN_LOGISTICA`, `ADMIN_PRENSA`, `ADMIN_ADMINISTRATIVO` |

**Reglas de negocio implementadas:**
- Solo personal de tipo `LOGISTICO` puede asignarse a eventos.
- El sistema bloquea asignaciones cuando se alcanza `limitePersonal` del evento.
- No permite asignación duplicada activa al mismo evento.
- Al crear un Personal, se genera automáticamente un `Usuario` con email = `{documento}@corposanpedro.com` y contraseña = número de documento.
- Gestión de expedientes: Los archivos se almacenan en **MinIO** con generación de **URLs prefirmadas** (seguridad S3) con validez de 1 hora.
- Liquidación de evento: calcula `asistentes × cuotaPago` vs `presupuestoAprobado` y retorna resultado con estado `DENTRO_PRESUPUESTO` o `DEFICIT`.

### Frontend — Carné de Personal

- Modal de vista previa con **animación flip 3D** (cara frontal / cara posterior con QR).
- Colores dinámicos según sector (Logística rojo, Cultura morado, Finanzas verde).
- Botón "Girar Carné" con animación suave de 700ms.
- Accesible desde la tabla de personal logístico con ícono `IdCard`.

---

## 🔲 Pendiente

### Frontend — Next.js

- `[x]` Modelos TypeScript actualizados (`Personal`, `AsignacionPersonal`, `Evento` con los nuevos campos)
- `[x]` Servicios Axios: `personalService`, `asignacionPersonalService`
- `[x]` Módulo `/personal/logistica` → tabla completa + modal enriquecido (todos los campos de Personal) + pestaña Asignaciones a Eventos
- `[x]` Módulo `/personal/prensa` → CRUD básico + generación de carné
- `[x]` Módulo `/personal/administrativo` → CRUD básico
- `[x]` Uploader de documentos en perfil (semáforo: Verde=verificado, Rojo=pendiente)
- `[x]` **Panel de Evento**: cards expandibles con barra `X/Y asignados`, presupuesto y balance de liquidación
- `[x]` **Dashboard renovado**: métricas relevantes (personal total, docs pendientes, eventos, presupuesto), distribución por tipo, eventos recientes
- `[ ]` Protección de rutas por rol (`SUPER_ADMIN` ve todo, `ADMIN_PRENSA` solo Prensa, etc.)
- `[x]` Carné adaptado para Prensa y Administrativos (sin número de camiseta)
- `[x]` Módulo `/roles` → CRUD completo con toggle activación, stats, filtro de inactivos, validación de formulario
- `[x]` **Solicitud de participación en eventos**:
  - Logístico solicita participar desde pestaña "Solicitudes" en módulo Logística
  - Admin ve solicitudes pendientes por evento, puede Aprobar (crea AsignacionPersonal) o Rechazar (con nota)
  - Validación: solo personal con documentos verificados puede ser aprobado
  - Validación: no se permite solicitud duplicada pendiente para mismo personal+evento

### Backend — Pendiente Menor

- `[x]` `DocumentoPersonalService` + Controller (Integrado con MinIO S3)
- `[x]` Módulo CRUD de Roles completo: `RolController`, `RolService`, `RolMapper`, `RolRepository`
  - Endpoints: `GET /api/roles?activo=true|false`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` (desactivación lógica), `PATCH /{id}/toggle-activo`
  - Validación de duplicados por nombre
  - Documentación Swagger con `@Tag` y `@Operation`
- `[x]` **Módulo Solicitudes de Participación**:
  - Entidad `SolicitudParticipacion` con estados: `PENDIENTE`, `APROBADA`, `RECHAZADA`, `CANCELADA`
  - Endpoints: `POST /api/solicitudes/personal/{id}`, `GET /api/solicitudes/personal/{id}`, `GET /api/solicitudes/evento/{id}/pendientes`, `PATCH /{id}/aprobar`, `PATCH /{id}/rechazar`, `PATCH /{id}/cancelar`
  - Al aprobar: crea `AsignacionPersonal` automáticamente (si docs completos y hay cupo)
  - Al rechazar: guarda nota de rechazo

### Reglas de Negocio Implementadas

- `[x]` **Validación de documentos mínimos para asignación a eventos:**
  - Documentos requeridos: `CEDULA`, `RUT`, `CERTIFICADO_BANCARIO`, `CONTRATO_FIRMADO`, `FOTO_PERFIL`
  - El backend bloquea asignaciones si algún documento mínimo no está en estado `VERIFICADO`
  - Campo `activo` calculado = `documentosCompletos` (no se almacena en DB)
  - Frontend muestra badge ✅/⚠️ en tabla de logístico y en selector de asignaciones

- `[x]` **Flujo de verificación documental:**
  - Documento subido → estado `PENDIENTE`
  - Botones ✅ (Verificar) y ⚠️ (Rechazar) en modal de expedientes
  - Rechazo solicita nota/motivo que se muestra al usuario
  - Desde `RECHAZADO` se puede revertir a `VERIFICADO`

### Ampliación de Datos del Personal

- `[x]` **Nuevos campos en entidad Personal:** `email`, `telefono`, `fechaNacimiento`, `direccion`, `arl`
- `[x]` **Campo ARL:** Administradora de Riesgos Laborales, aplica para todo tipo de personal (logístico, administrativo, prensa)
- `[x]` **Tablas de catálogo para datos bancarios** (reemplazan enums):
  - Tabla `bancos` — CRUD completo con endpoints `/api/bancos`
  - Tabla `tipos_cuenta_bancaria` — CRUD completo con endpoints `/api/tipos-cuenta-bancaria`
  - Relación `@ManyToOne` desde Personal hacia ambas tablas
  - Datos semilla inicializados en `DataInitializer` (11 bancos, 3 tipos de cuenta)
- `[x]` **Validación de campos obligatorios:**
  - Backend: `@NotBlank`/`@NotNull` en `PersonalRequestDTO` para todos los campos excepto segundo nombre/apellido
  - Todos los campos de contacto (email, teléfono, fecha nacimiento, dirección, ARL) son obligatorios
  - Todos los campos bancarios (banco, tipo cuenta, número cuenta) son obligatorios
  - N° camiseta obligatorio solo para personal LOGÍSTICO
- `[x]` **Modales unificados con 3 pestañas (Identidad, Contacto, Bancario) para los 3 tipos de personal:**
  - **Logística:** Identidad (incluye N° camiseta), Contacto (incluye ARL), Bancario
  - **Prensa:** Identidad (sin camiseta), Contacto (incluye ARL), Bancario
  - **Administrativo:** Identidad (sin camiseta), Contacto (incluye ARL), Bancario
- `[x]` **Botón de Editar** en tablas de Logística, Prensa y Administrativo con modal completo de edición (3 pestañas)
- `[x]` **Frontend:** modelos, servicios, hooks y UI actualizados para los nuevos campos

### Eventos — Simplificación

- `[x]` **Eliminada relación con Festival:** Eventos ya no están atados a un festival
- `[x]` **Duración en horas:** El frontend envía `duracionHoras` (entero), el backend calcula `fechaFin = fechaInicio + horas`
- `[x]` **Formulario simplificado:** Sin selector de festival, duración en horas en lugar de fecha fin
- `[x]` **Panel de Evento:** cards expandibles con barra `X/Y asignados`, presupuesto y balance de liquidación
- `[x]` **Dashboard renovado:** métricas relevantes (personal total, docs pendientes, eventos, presupuesto), distribución por tipo, eventos recientes

