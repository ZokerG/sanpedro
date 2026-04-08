# MVP — Sistema de Gestión Presupuestal y Logística
## Festival del Bambuco — Especificación técnica completa para desarrollo con IA

---

## INSTRUCCIONES PARA LA IA DE DESARROLLO

Eres un asistente de desarrollo senior. Tu tarea es construir un MVP completo del sistema de gestión presupuestal y logística del Festival del Bambuco. Lee esta especificación completa antes de escribir cualquier línea de código. Cuando tengas dudas sobre comportamiento de negocio, consulta primero esta especificación. No inventes lógica de negocio que no esté documentada aquí.

---

## 1. STACK TECNOLÓGICO

### Backend
- **Java 21** (LTS)
- **Spring Boot 3.x**
- **Spring Security** con autenticación JWT
- **Spring Data JPA** con Hibernate
- **PostgreSQL** como base de datos principal
- **Flyway** para migraciones de base de datos
- **MapStruct** para mapeo de DTOs
- **Lombok** para reducir boilerplate
- **ZXing** para generación de códigos QR
- **iText / Apache PDFBox** para generación de PDFs (carnets)
- **Maven** como gestor de dependencias

### Frontend
- **Angular 17+** (standalone components)
- **Angular Material** como librería de componentes UI
- **ngx-qrcode** para renderizado de QR en el browser
- **html5-qrcode** para escaneo de QR desde cámara
- **Chart.js + ng2-charts** para gráficas del dashboard
- **Angular CDK** para drag and drop en tableros
- **RxJS** para manejo de estado reactivo
- **Angular Guards + Interceptors** para JWT

### Infraestructura (desarrollo)
- **Docker + Docker Compose** para levantar todo el entorno
- **Docker Compose** incluye: PostgreSQL, backend Spring Boot, frontend Angular (nginx)
- Puerto backend: `8080`
- Puerto frontend: `4200`
- Puerto base de datos: `5432`

---

## 2. ARQUITECTURA GENERAL

```
festival-bambuco/
├── backend/                          # Spring Boot
│   ├── src/main/java/com/festival/
│   │   ├── config/                   # SecurityConfig, CorsConfig, JwtConfig
│   │   ├── controller/               # REST controllers por módulo
│   │   ├── service/                  # Lógica de negocio por módulo
│   │   ├── repository/               # JPA repositories
│   │   ├── entity/                   # Entidades JPA
│   │   ├── dto/                      # DTOs de request y response
│   │   ├── mapper/                   # MapStruct mappers
│   │   ├── security/                 # JwtFilter, UserDetailsService
│   │   ├── exception/                # GlobalExceptionHandler, excepciones custom
│   │   └── util/                     # QrGenerator, PdfGenerator
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/             # Scripts Flyway V1__, V2__, ...
│
├── frontend/                         # Angular
│   └── src/app/
│       ├── core/                     # Guards, interceptors, servicios HTTP base
│       ├── shared/                   # Componentes reutilizables, pipes, directivas
│       └── features/                 # Módulos por funcionalidad
│           ├── auth/
│           ├── dashboard/
│           ├── resoluciones/
│           ├── eventos/
│           ├── items/
│           ├── tareas/
│           ├── presupuesto/
│           ├── alertas/
│           ├── auditoria/
│           └── logistica/            # Módulo completo de logística
│
└── docker-compose.yml
```

---

## 3. MODELO DE BASE DE DATOS

### 3.1 Entidades principales y sus relaciones

```sql
-- USUARIOS Y ROLES
usuarios (id, nombre, apellido, email, password_hash, rol, activo, created_at)
roles: DIRECTOR | COORDINADOR | EJECUTOR | AUDITOR | LOGISTICA

-- FESTIVAL Y RESOLUCIONES
festivales (id, nombre, version, anio, fecha_inicio, fecha_fin, estado, created_at)
estado_festival: PLANEACION | EN_CURSO | FINALIZADO | LIQUIDADO

resoluciones (id, festival_id, numero, fecha, tipo, valor_adicion, cdp_numero, descripcion, created_at)
tipo_resolucion: INICIAL | ADICION | REDUCCION

-- SECTORES (dinámicos por festival)
sectores (id, festival_id, nombre, color, responsable_id, activo)

-- EVENTOS
eventos (id, festival_id, nombre, descripcion, fecha_inicio, fecha_evento, presupuesto_aprobado, presupuesto_ejecutado, estado, prioridad)
estado_evento: PLANEADO | EN_PREPARACION | EN_CURSO | EJECUTADO | LIQUIDADO

-- TIPOS DE ÍTEMS (3 tipos)
-- Tipo 1: ítem puntual de evento
items_evento (id, evento_id, resolucion_id, detalle, unidad, cantidad, valor_unitario, valor_total, valor_ejecutado, estado)

-- Tipo 2: pool transversal
pools_transversales (id, festival_id, resolucion_id, nombre, unidad, cantidad_total, cantidad_consumida, valor_total, valor_consumido, estado)
asignaciones_pool (id, pool_id, evento_id, cantidad_asignada, cantidad_ejecutada, valor_asignado, valor_ejecutado)

-- Tipo 3: servicio por días
servicios_periodo (id, festival_id, resolucion_id, nombre, fecha_inicio, fecha_fin, valor_total, valor_ejecutado, descripcion)
usos_servicio_periodo (id, servicio_id, evento_id, fecha_uso, descripcion_uso)

-- TAREAS Y SUB-TAREAS
tareas_padre (id, evento_id, titulo, descripcion, prioridad, estado_calculado, item_evento_id, pool_asignacion_id, servicio_id, created_at)
prioridad: CRITICA | ALTA | MEDIA | BAJA
estado_calculado: PENDIENTE | EN_PROGRESO | COMPLETADA | VERIFICADA

sub_tareas (id, tarea_padre_id, sector_id, titulo, descripcion, responsable_id, fecha_limite, estado, valor_comprometido, valor_ejecutado, created_at)
estado_subtarea: PENDIENTE | EN_PROGRESO | COMPLETADA | VERIFICADA | CANCELADA

-- DOCUMENTOS SOPORTE
documentos (id, sub_tarea_id, tipo, nombre_archivo, ruta_almacenamiento, descripcion, cargado_por_id, created_at)
tipo_documento: CONTRATO | FACTURA | COTIZACION | ACTA | OTRO

-- TRASLADOS PRESUPUESTALES
traslados (id, festival_id, tipo_origen, id_origen, tipo_destino, id_destino, valor, justificacion, aprobado_por_id, estado, created_at)
tipo_traslado_item: ITEM_EVENTO | POOL | SERVICIO

-- LOG DE AUDITORÍA
auditoria (id, usuario_id, entidad, entidad_id, accion, valor_anterior, valor_nuevo, ip_address, created_at)

-- ALERTAS
alertas (id, festival_id, tipo, nivel, titulo, descripcion, entidad_referencia, entidad_id, estado, visto_por_ids, created_at)
nivel_alerta: CRITICA | ADVERTENCIA | INFORMATIVA | CIERRE
estado_alerta: ACTIVA | VISTA | RESUELTA

-- ========================================
-- MÓDULO DE LOGÍSTICA
-- ========================================

personal_logistica (
  id,
  festival_id,
  nombres,
  apellidos,
  numero_documento,
  tipo_documento,       -- CC | CE | PASAPORTE
  foto_ruta,
  rol_logistica,        -- COORDINADOR | ASISTENTE | TECNICO | SEGURIDAD | OTRO
  telefono,
  qr_code,             -- hash único generado al crear el registro
  carnet_generado,     -- boolean
  activo,
  created_at,
  created_by_id
)

asignaciones_logistica (
  id,
  personal_id,
  evento_id,
  fecha_asignacion,
  notas,
  activo
)

-- Pool de ítems de logística (vinculado a pools_transversales)
items_logistica (
  id,
  festival_id,
  nombre,              -- "Radios de comunicación", "Chalecos", "Carpas"
  descripcion,
  cantidad_total,
  cantidad_disponible,
  unidad,
  estado               -- DISPONIBLE | AGOTADO | EN_USO
)

asignaciones_items_logistica (
  id,
  item_logistica_id,
  evento_id,
  personal_id,         -- nullable: puede asignarse al evento o a una persona
  cantidad,
  fecha_asignacion,
  fecha_devolucion,    -- nullable
  estado,              -- ASIGNADO | DEVUELTO | PERDIDO
  notas
)

registros_acceso (
  id,
  personal_id,
  evento_id,
  tipo,                -- INGRESO | SALIDA
  timestamp,
  punto_control,       -- "Entrada principal", "Escenario", "Backstage"
  registrado_por_id,   -- usuario que hizo el escaneo
  device_info          -- navegador/dispositivo del escáner
)
```

### 3.2 Reglas de integridad de negocio (implementar en la capa de servicio)

1. **No se puede ejecutar gasto sin resolución activa** que respalde el ítem.
2. **Sub-tarea no puede pasar a COMPLETADA** sin al menos un documento soporte adjunto.
3. **Pool no puede asignar más** de `cantidad_total - cantidad_consumida`.
4. **Traslado solo se aprueba** si el origen tiene saldo suficiente.
5. **Tarea padre calcula su estado automáticamente** según el estado de sus sub-tareas:
   - Si todas las sub-tareas son PENDIENTE → tarea padre = PENDIENTE
   - Si al menos una es EN_PROGRESO o COMPLETADA → tarea padre = EN_PROGRESO
   - Si todas son VERIFICADA → tarea padre = VERIFICADA (= completada)
6. **QR único**: al crear personal de logística se genera un UUID como `qr_code`, no puede repetirse.
7. **Toggle de acceso**: al escanear QR, el sistema determina el tipo (INGRESO/SALIDA) consultando el último registro de esa persona en ese evento. Si el último fue INGRESO → registra SALIDA y viceversa. Si no hay registros previos → registra INGRESO.

---

## 4. MÓDULO DE AUTENTICACIÓN (JWT)

### Endpoints
```
POST /api/auth/login
  body: { email, password }
  response: { token, refreshToken, usuario: { id, nombre, email, rol } }

POST /api/auth/refresh
  body: { refreshToken }
  response: { token }

POST /api/auth/logout
  (invalida el refresh token)
```

### Configuración JWT
- **Access token**: expira en 8 horas
- **Refresh token**: expira en 7 días, guardado en BD
- **Algoritmo**: HS256
- **Clave secreta**: configurable via `application.yml` → `jwt.secret`
- **Filtro**: `JwtAuthenticationFilter` intercepta todas las rutas excepto `/api/auth/**`

### Roles y permisos por módulo

| Módulo | DIRECTOR | COORDINADOR | EJECUTOR | AUDITOR | LOGISTICA |
|--------|----------|-------------|----------|---------|-----------|
| Resoluciones | CRUD | Lectura | Lectura | Lectura | — |
| Eventos | CRUD | CRUD | Lectura | Lectura | Lectura |
| Ítems (todos los tipos) | CRUD | Lectura | Lectura | Lectura | Lectura |
| Tareas padre | CRUD | CRUD | Lectura | Lectura | — |
| Sub-tareas | CRUD | CRUD propio sector | CRUD propio | Lectura | — |
| Documentos soporte | CRUD | CRUD | CRUD propio | Lectura | — |
| Traslados | Aprobar/Crear | Crear | — | Lectura | — |
| Alertas | Todas | Las de su sector | Las propias | Todas | Las propias |
| Auditoría | Lectura | — | — | Lectura completa | — |
| Personal logística | CRUD | Lectura | — | Lectura | CRUD propio festival |
| Asignación logística | CRUD | CRUD | — | Lectura | CRUD |
| Escaneo QR | — | — | — | — | Acceso completo |
| Dashboard | Completo | Parcial (su sector) | Solo sus tareas | Completo | Su módulo |

---

## 5. MÓDULOS DEL BACKEND — ENDPOINTS DETALLADOS

### 5.1 Festivales
```
GET    /api/festivales                     # Lista de festivales
POST   /api/festivales                     # Crear festival
GET    /api/festivales/{id}                # Detalle de festival
PUT    /api/festivales/{id}                # Actualizar festival
PATCH  /api/festivales/{id}/estado         # Cambiar estado
GET    /api/festivales/{id}/resumen        # Resumen presupuestal completo
```

### 5.2 Resoluciones
```
GET    /api/festivales/{id}/resoluciones
POST   /api/festivales/{id}/resoluciones
GET    /api/resoluciones/{id}
PUT    /api/resoluciones/{id}
DELETE /api/resoluciones/{id}
```

### 5.3 Sectores
```
GET    /api/festivales/{id}/sectores
POST   /api/festivales/{id}/sectores
PUT    /api/sectores/{id}
DELETE /api/sectores/{id}
POST   /api/sectores/{id}/miembros         # Asignar usuario al sector
DELETE /api/sectores/{id}/miembros/{uid}   # Remover usuario del sector
```

### 5.4 Eventos
```
GET    /api/festivales/{id}/eventos
POST   /api/festivales/{id}/eventos
GET    /api/eventos/{id}
PUT    /api/eventos/{id}
PATCH  /api/eventos/{id}/estado
GET    /api/eventos/{id}/tablero           # Sub-tareas por sector + estado padre
GET    /api/eventos/{id}/presupuesto       # Ítems + ejecutado + saldo
```

### 5.5 Ítems — Tipo 1 (puntual de evento)
```
GET    /api/eventos/{id}/items
POST   /api/eventos/{id}/items
PUT    /api/items-evento/{id}
PATCH  /api/items-evento/{id}/ejecutado    # body: { valorEjecutado }
DELETE /api/items-evento/{id}
```

### 5.6 Ítems — Tipo 2 (pool transversal)
```
GET    /api/festivales/{id}/pools
POST   /api/festivales/{id}/pools
GET    /api/pools/{id}
PUT    /api/pools/{id}
GET    /api/pools/{id}/asignaciones        # Ver distribución por evento
POST   /api/pools/{id}/asignaciones        # Asignar porción a evento
PUT    /api/asignaciones-pool/{id}         # Modificar asignación
PATCH  /api/asignaciones-pool/{id}/ejecutado
DELETE /api/asignaciones-pool/{id}
```

### 5.7 Ítems — Tipo 3 (servicio por días)
```
GET    /api/festivales/{id}/servicios-periodo
POST   /api/festivales/{id}/servicios-periodo
GET    /api/servicios-periodo/{id}
PUT    /api/servicios-periodo/{id}
GET    /api/servicios-periodo/{id}/usos    # Ver qué eventos lo usan y cuándo
POST   /api/servicios-periodo/{id}/usos    # Vincular evento al servicio
DELETE /api/usos-servicio/{id}
```

### 5.8 Tareas y sub-tareas
```
GET    /api/eventos/{id}/tareas-padre
POST   /api/eventos/{id}/tareas-padre
GET    /api/tareas-padre/{id}
PUT    /api/tareas-padre/{id}
DELETE /api/tareas-padre/{id}

GET    /api/tareas-padre/{id}/sub-tareas
POST   /api/tareas-padre/{id}/sub-tareas
GET    /api/sub-tareas/{id}
PUT    /api/sub-tareas/{id}
PATCH  /api/sub-tareas/{id}/estado         # body: { estado }
DELETE /api/sub-tareas/{id}

# Vista filtrada por sector (para coordinadores y ejecutores)
GET    /api/sectores/{id}/sub-tareas       # Sub-tareas del sector en todos los eventos
GET    /api/usuarios/me/sub-tareas         # Sub-tareas asignadas al usuario autenticado
```

### 5.9 Documentos soporte
```
POST   /api/sub-tareas/{id}/documentos     # multipart/form-data
GET    /api/sub-tareas/{id}/documentos
GET    /api/documentos/{id}/download
DELETE /api/documentos/{id}
```

Los archivos se almacenan en el filesystem del servidor en la ruta configurada en `application.yml` → `storage.base-path`. El endpoint de descarga sirve el archivo con el Content-Type correcto.

### 5.10 Traslados presupuestales
```
GET    /api/festivales/{id}/traslados
POST   /api/festivales/{id}/traslados      # Crea traslado en estado PENDIENTE
PATCH  /api/traslados/{id}/aprobar         # Solo DIRECTOR
PATCH  /api/traslados/{id}/rechazar        # Solo DIRECTOR
GET    /api/traslados/{id}
```

Al aprobar un traslado, el servicio debe:
1. Validar que el origen tenga saldo suficiente.
2. Reducir el saldo del origen.
3. Incrementar el presupuesto del destino.
4. Registrar la operación en auditoría.

### 5.11 Alertas
```
GET    /api/festivales/{id}/alertas        # Con filtros: ?nivel=CRITICA&estado=ACTIVA
GET    /api/alertas/{id}
PATCH  /api/alertas/{id}/marcar-vista
PATCH  /api/alertas/{id}/resolver
GET    /api/festivales/{id}/alertas/count  # { criticas: 3, advertencias: 5, total: 8 }
```

### 5.12 Dashboard
```
GET    /api/festivales/{id}/dashboard
  response: {
    presupuestoTotal, presupuestoEjecutado, presupuestoDisponible,
    porcentajeEjecucion,
    eventosPorEstado: { planeados, enPreparacion, enCurso, ejecutados, liquidados },
    tareasPorEstado:  { pendientes, enProgreso, completadas, verificadas },
    alertasActivas:   { criticas, advertencias, informativas },
    ejecutadoPorDia:  [{ fecha, monto }],      # últimos 30 días
    topEventosPorGasto: [{ eventoNombre, ejecutado, aprobado }]
  }

GET    /api/festivales/{id}/dashboard?fechaDesde=2024-06-01&fechaHasta=2024-07-01
```

### 5.13 Auditoría
```
GET    /api/festivales/{id}/auditoria      # Con paginación ?page=0&size=50
  query params opcionales: entidad, usuarioId, fechaDesde, fechaHasta
```

---

## 6. MÓDULO DE LOGÍSTICA — ESPECIFICACIÓN DETALLADA

Este módulo es el más complejo del MVP. Gestiona el personal de logística, los ítems físicos que se asignan por evento y el control de acceso mediante QR.

### 6.1 Personal de logística — endpoints
```
GET    /api/festivales/{id}/logistica/personal
  query: ?activo=true&evento={eventoId}&rol=COORDINADOR
POST   /api/festivales/{id}/logistica/personal
GET    /api/logistica/personal/{id}
PUT    /api/logistica/personal/{id}
PATCH  /api/logistica/personal/{id}/estado   # activar / desactivar
DELETE /api/logistica/personal/{id}

# Foto de perfil
POST   /api/logistica/personal/{id}/foto     # multipart/form-data
GET    /api/logistica/personal/{id}/foto

# Carnet con QR
GET    /api/logistica/personal/{id}/carnet   # Devuelve PDF del carnet
POST   /api/festivales/{id}/logistica/carnets-lote  # Genera ZIP con todos los carnets

# QR
GET    /api/logistica/personal/{id}/qr       # Devuelve imagen PNG del QR
POST   /api/logistica/personal/{id}/regenerar-qr  # Solo si se pierde el carnet
```

### 6.2 Asignaciones de personal a eventos
```
GET    /api/logistica/personal/{id}/asignaciones
POST   /api/logistica/personal/{id}/asignaciones   # { eventoId, notas }
GET    /api/eventos/{id}/logistica/personal        # Personal asignado al evento
DELETE /api/logistica/asignaciones/{id}

# Vista del evento con el personal y su estado de acceso
GET    /api/eventos/{id}/logistica/tablero
  response: {
    totalAsignado,
    dentroAhora,
    sinIngresar,
    personal: [{
      id, nombres, apellidos, rol, foto,
      ultimoAcceso: { tipo, timestamp, puntoControl } | null
    }]
  }
```

### 6.3 Ítems físicos de logística
```
GET    /api/festivales/{id}/logistica/items
POST   /api/festivales/{id}/logistica/items
PUT    /api/logistica/items/{id}
DELETE /api/logistica/items/{id}

# Asignaciones de ítems físicos
GET    /api/logistica/items/{id}/asignaciones
POST   /api/logistica/items/{id}/asignaciones
  body: { eventoId, personalId?, cantidad, notas }
PATCH  /api/logistica/asignaciones-items/{id}/devolver
  body: { estado: "DEVUELTO" | "PERDIDO", notas }
GET    /api/eventos/{id}/logistica/items       # Ítems asignados a un evento
```

### 6.4 Control de acceso — escaneo QR
```
# Endpoint principal de escaneo (sin autenticación compleja, solo rol LOGISTICA)
POST   /api/logistica/acceso/escanear
  body: { qrCode, puntoControl, eventoId }
  response: {
    tipo: "INGRESO" | "SALIDA",
    personal: { nombres, apellidos, rol, fotoUrl },
    evento: { nombre },
    timestamp,
    mensaje: "Ingreso registrado — Juan Pérez" | "Salida registrada — Juan Pérez",
    error?: "Persona no asignada a este evento" | "QR inválido"
  }

GET    /api/eventos/{id}/logistica/accesos
  query: ?fecha=2024-06-21&tipo=INGRESO&puntoControl=...
  response: lista paginada de registros_acceso con datos del personal

GET    /api/logistica/personal/{id}/accesos
  query: ?eventoId=...
  response: historial de ingresos y salidas
```

### 6.5 Lógica de negocio del escaneo QR

```java
// Pseudocódigo — implementar en AccesoLogisticaService

public EscaneoResponse escanear(EscaneoRequest request) {
    // 1. Buscar persona por qr_code
    PersonalLogistica persona = repo.findByQrCode(request.getQrCode())
        .orElseThrow(() -> new QrInvalidoException("QR no reconocido"));

    // 2. Validar que la persona está activa
    if (!persona.isActivo()) throw new AccesoException("Persona inactiva");

    // 3. Validar que está asignada al evento
    boolean asignada = asignacionRepo.existsByPersonalIdAndEventoId(
        persona.getId(), request.getEventoId());
    if (!asignada) throw new AccesoException("Persona no asignada a este evento");

    // 4. Consultar el último registro de esta persona en este evento
    Optional<RegistroAcceso> ultimo = registroRepo
        .findFirstByPersonalIdAndEventoIdOrderByTimestampDesc(
            persona.getId(), request.getEventoId());

    // 5. Toggle: si el último fue INGRESO → ahora es SALIDA y viceversa
    TipoAcceso tipo = ultimo
        .map(r -> r.getTipo() == INGRESO ? SALIDA : INGRESO)
        .orElse(INGRESO); // Sin registros previos → INGRESO

    // 6. Guardar el registro
    RegistroAcceso registro = new RegistroAcceso();
    registro.setPersonal(persona);
    registro.setEvento(eventoRepo.findById(request.getEventoId()).orElseThrow());
    registro.setTipo(tipo);
    registro.setTimestamp(LocalDateTime.now());
    registro.setPuntoControl(request.getPuntoControl());
    registro.setRegistradoPorId(SecurityUtils.getCurrentUserId());
    registroRepo.save(registro);

    // 7. Construir respuesta
    return new EscaneoResponse(tipo, persona, registro);
}
```

### 6.6 Generación del carnet (PDF)

El carnet tiene dimensiones de tarjeta (85.6mm x 54mm — CR80 estándar). Usa iText o Apache PDFBox.

**Estructura visual del carnet:**
```
┌──────────────────────────────────┐
│  FESTIVAL DEL BAMBUCO            │  ← Header oscuro con nombre del festival
│  VERSIÓN [N] — [AÑO]            │
├────────────┬─────────────────────┤
│            │  NOMBRE APELLIDO    │
│   [FOTO]   │  Rol de logística   │
│            │  Eventos: E1, E3    │
├────────────┴─────────────────────┤
│  ID: #000124   [QR CODE]        │  ← Footer con QR
└──────────────────────────────────┘
```

**Implementación con PDFBox:**
```java
// Pseudocódigo — implementar en CarnetGeneratorService

public byte[] generarCarnet(Long personalId) {
    PersonalLogistica p = repo.findById(personalId).orElseThrow();
    
    // Dimensiones CR80 en puntos (1 pt = 1/72 inch)
    float width  = 243f; // 85.6mm
    float height = 153f; // 54mm
    
    try (PDDocument doc = new PDDocument()) {
        PDPage page = new PDPage(new PDRectangle(width, height));
        doc.addPage(page);
        
        PDPageContentStream cs = new PDPageContentStream(doc, page);
        
        // Header oscuro
        cs.setNonStrokingColor(0.15f, 0.15f, 0.15f);
        cs.addRect(0, height - 35, width, 35);
        cs.fill();
        
        // Texto header
        cs.setNonStrokingColor(1f, 1f, 1f);
        cs.setFont(PDType1Font.HELVETICA_BOLD, 8f);
        cs.beginText();
        cs.newLineAtOffset(10, height - 18);
        cs.showText("FESTIVAL DEL BAMBUCO");
        cs.endText();
        
        // Foto (si existe)
        if (p.getFotoRuta() != null) {
            // Cargar imagen y dibujar en posición [10, 40, 60x60]
        }
        
        // Nombre y rol
        cs.setNonStrokingColor(0f, 0f, 0f);
        cs.setFont(PDType1Font.HELVETICA_BOLD, 9f);
        cs.beginText();
        cs.newLineAtOffset(80, height - 65);
        cs.showText(p.getNombres() + " " + p.getApellidos());
        cs.endText();
        
        cs.setFont(PDType1Font.HELVETICA, 7f);
        cs.beginText();
        cs.newLineAtOffset(80, height - 78);
        cs.showText(p.getRolLogistica().getDescripcion());
        cs.endText();
        
        // QR Code (usando ZXing para generar el PNG del QR)
        byte[] qrPng = QrGeneratorUtil.generate(p.getQrCode(), 80, 80);
        PDImageXObject qrImage = PDImageXObject.createFromByteArray(doc, qrPng, "qr");
        cs.drawImage(qrImage, width - 90, 8, 80, 80);
        
        // ID
        cs.setFont(PDType1Font.HELVETICA, 6f);
        cs.beginText();
        cs.newLineAtOffset(10, 12);
        cs.showText("ID: " + String.format("%06d", p.getId()));
        cs.endText();
        
        cs.close();
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        doc.save(out);
        return out.toByteArray();
    }
}
```

---

## 7. SISTEMA DE ALERTAS — MOTOR AUTOMÁTICO

Las alertas se generan automáticamente. Implementar como un `@Scheduled` job que corra cada 30 minutos, y también dispararse de forma reactiva en puntos clave de los servicios.

### 7.1 Disparadores y condiciones

```java
// Implementar en AlertaEngineService

// CRÍTICAS
void verificarSobreejecucion(Long festivalId) {
    // items_evento donde valor_ejecutado / valor_total >= 0.90
    // pools donde valor_consumido / valor_total >= 0.90
    // → crear alerta CRITICA si no existe una activa para ese ítem
}

void verificarGastoSinSoporte(Long festivalId) {
    // sub_tareas con valor_ejecutado > 0 que no tengan documentos
    // y hayan pasado más de 24h desde la creación
    // → crear alerta CRITICA
}

void verificarTareaCriticaVencida(Long festivalId) {
    // sub_tareas con prioridad CRITICA, fecha_limite < now(), estado != VERIFICADA
    // → crear alerta CRITICA
}

// ADVERTENCIAS
void verificarEventoProximo(Long festivalId) {
    // eventos con fecha_evento entre now() y now() + 72h
    // donde (sub_tareas verificadas / total sub_tareas) < 0.60
    // → crear alerta ADVERTENCIA
}

void verificarSubtareaSinActividad(Long festivalId) {
    // sub_tareas en estado PENDIENTE o EN_PROGRESO
    // donde updated_at < now() - 48h
    // → crear alerta ADVERTENCIA
}

void verificarPoolSinAsignar(Long festivalId) {
    // pools donde (cantidad_total - cantidad_consumida) > 0
    // y el evento más próximo ya pasó hace más de 5 días
    // → crear alerta ADVERTENCIA
}

// CIERRE
void verificarEventoListoParaLiquidar(Long festivalId) {
    // eventos EJECUTADOS donde todas las sub_tareas están VERIFICADAS
    // → crear alerta CIERRE
}
```

### 7.2 Persistencia de alertas

- Antes de crear una alerta, verificar que no exista una activa del mismo tipo para la misma entidad.
- Las alertas tienen `visto_por_ids` (array de IDs de usuarios que la marcaron como vista).
- Una alerta se auto-resuelve cuando la condición que la disparó deja de cumplirse (verificación en el siguiente ciclo del scheduler).

---

## 8. FRONTEND ANGULAR — ESTRUCTURA DE FEATURES

### 8.1 Módulo Auth
- Pantalla de login con formulario email/password
- Guard `AuthGuard` que redirige a `/login` si no hay token
- `RoleGuard` que valida permisos por ruta
- Interceptor HTTP que agrega el header `Authorization: Bearer {token}` a todas las peticiones
- Servicio `AuthService` que almacena el token en `localStorage` y expone el usuario autenticado como `BehaviorSubject`

### 8.2 Dashboard
- Cards de métricas: presupuesto total, ejecutado, disponible, % ejecución
- Gráfica de barras: ejecutado por evento (Chart.js)
- Gráfica de línea: evolución del gasto por día (últimos 30 días)
- Panel de alertas activas con badges de color por nivel (rojo = crítica, amarillo = advertencia)
- Tabla de eventos activos con su estado de avance
- Filtros de fecha con date picker

### 8.3 Tablero de tareas (por evento)
- Vista tipo Kanban con columnas por estado: Pendiente | En Progreso | Completada | Verificada
- Cada tarjeta muestra: título, sector asignado (con color), responsable, prioridad, estado
- Drag and drop para cambiar estado (Angular CDK)
- Al hacer clic en una tarjeta se abre un panel lateral con:
  - Detalle completo de la sub-tarea
  - Lista de documentos soporte con opción de subir y descargar
  - Botón de cambio de estado
  - Historial de cambios

### 8.4 Gestión de ítems presupuestales
- Tres tabs: "Ítems de evento" | "Pools transversales" | "Servicios por período"
- Para pools: tabla de asignaciones por evento con barra de progreso de consumo
- Para servicios por período: timeline visual con los eventos que los usan

### 8.5 Módulo de logística (detalle completo)

**Pantalla 1 — Listado de personal:**
- Tabla con foto, nombre, rol, eventos asignados, estado (activo/inactivo)
- Botones: Ver detalle | Descargar carnet | Asignar a evento
- Filtros: por rol, por evento, por estado
- Botón "Crear persona" → abre formulario

**Pantalla 2 — Formulario de persona:**
- Campos: nombres, apellidos, documento, tipo documento, teléfono, rol
- Subida de foto con previsualización
- Selección de eventos (multiselect con los eventos del festival)
- Al guardar: genera automáticamente el QR y muestra opción de descargar carnet

**Pantalla 3 — Detalle de persona:**
- Datos completos + foto
- QR generado con opción de descargar PNG
- Botón "Descargar carnet PDF"
- Lista de eventos asignados
- Historial de accesos (tabla: tipo, evento, punto de control, fecha/hora)
- Ítems de logística asignados a esta persona

**Pantalla 4 — Tablero de logística por evento:**
- Selección del evento activo
- Cards de métricas: Total asignado | Dentro ahora | Sin ingresar | Salidas del día
- Tabla de personal con su estado de acceso en tiempo real:
  - Verde: dentro del evento
  - Gris: no ha ingresado aún
  - Amarillo: salió pero puede reingresar
- Botón "Actualizar" (polling cada 30 segundos con `interval()` de RxJS)

**Pantalla 5 — Escáner QR:**
- Activa la cámara del dispositivo usando `html5-qrcode`
- Al detectar un QR, llama a `POST /api/logistica/acceso/escanear`
- Muestra feedback inmediato:
  - INGRESO: fondo verde + foto + nombre + "Ingreso registrado"
  - SALIDA: fondo azul + foto + nombre + "Salida registrada"
  - ERROR: fondo rojo + mensaje de error
- Selección del punto de control antes de escanear
- Selección del evento activo (lista de eventos en curso)
- Modo continuo: después de registrar, queda listo para el siguiente escaneo

**Pantalla 6 — Ítems físicos de logística:**
- Lista de ítems (radios, chalecos, carpas, etc.) con cantidad total y disponible
- Por ítem: ver asignaciones actuales (a qué evento o persona)
- Asignar ítem a evento/persona
- Registrar devolución o pérdida

### 8.6 Gestión de alertas
- Campanita en el header con badge del total de alertas activas
- Panel lateral al hacer clic: lista de alertas agrupadas por nivel
- Cada alerta tiene botón "Marcar como vista" y "Resolver"
- Las alertas críticas se muestran también como banner en la pantalla correspondiente

---

## 9. CONFIGURACIÓN DE ARCHIVOS

### application.yml (backend)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/festival_bambuco
    username: ${DB_USER:festival}
    password: ${DB_PASS:festival123}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

jwt:
  secret: ${JWT_SECRET:cambiar-en-produccion-min-32-chars}
  expiration-ms: 28800000     # 8 horas
  refresh-expiration-ms: 604800000  # 7 días

storage:
  base-path: ${STORAGE_PATH:./uploads}
  max-file-size: 10MB
  allowed-types: pdf,jpg,jpeg,png,doc,docx,xlsx

alertas:
  scheduler-cron: "0 */30 * * * *"   # cada 30 minutos
  umbral-sobreejecucion: 0.90
  horas-sin-soporte: 24
  dias-sin-actividad-tarea: 2
  dias-pool-sin-asignar: 5
  horas-evento-proximo: 72
  umbral-avance-evento: 0.60

server:
  port: 8080

logging:
  level:
    com.festival: DEBUG
    org.springframework.security: INFO
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: festival_bambuco
      POSTGRES_USER: festival
      POSTGRES_PASSWORD: festival123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DB_USER: festival
      DB_PASS: festival123
      JWT_SECRET: dev-secret-32-chars-minimum-ok
      STORAGE_PATH: /app/uploads
    depends_on:
      - postgres
    volumes:
      - uploads_data:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  uploads_data:
```

---

## 10. MIGRACIONES FLYWAY — ORDEN DE CREACIÓN

Los scripts deben crearse en este orden:

```
V1__create_usuarios.sql
V2__create_festivales_resoluciones.sql
V3__create_sectores.sql
V4__create_eventos.sql
V5__create_items_tipo1.sql
V6__create_pools_transversales.sql
V7__create_servicios_periodo.sql
V8__create_tareas_subtareas.sql
V9__create_documentos.sql
V10__create_traslados.sql
V11__create_alertas.sql
V12__create_auditoria.sql
V13__create_logistica.sql
V14__insert_datos_iniciales.sql   # Usuario admin por defecto, roles
```

---

## 11. DATOS INICIALES

Al ejecutar `V14__insert_datos_iniciales.sql`, el sistema debe tener:

```sql
-- Usuario admin
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol, activo)
VALUES ('Admin', 'Sistema', 'admin@festival.com', '{bcrypt_hash_de_admin123}', 'DIRECTOR', true);

-- Festival de prueba
INSERT INTO festivales (nombre, version, anio, estado)
VALUES ('Festival del Bambuco', 63, 2024, 'PLANEACION');
```

Credenciales por defecto: `admin@festival.com` / `admin123`

---

## 12. MANEJO DE ERRORES

### Formato de error estándar (todos los endpoints)
```json
{
  "timestamp": "2024-06-21T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El pool no tiene saldo suficiente para esta asignación",
  "path": "/api/pools/5/asignaciones",
  "details": {}
}
```

### Excepciones personalizadas a implementar
```
ResourceNotFoundException    → 404
ValidationException          → 400
InsufficientBalanceException → 422 (saldo insuficiente en pool o ítem)
QrInvalidoException          → 400
AccesoException              → 403
UnauthorizedException        → 401
BusinessRuleException        → 422 (reglas de negocio no cumplidas)
```

Implementar un `@RestControllerAdvice` global que capture todas las excepciones y devuelva el formato estándar.

---

## 13. CONSIDERACIONES DE SEGURIDAD PARA EL MVP

1. **CORS**: configurar para aceptar solo `http://localhost:4200` en desarrollo.
2. **Passwords**: siempre hashear con BCrypt (strength 12).
3. **JWT Secret**: mínimo 32 caracteres, no hardcodear en código.
4. **File upload**: validar extensión y tamaño antes de guardar. Guardar con nombre UUID, no con el nombre original.
5. **SQL Injection**: usar siempre queries parametrizadas (Spring Data JPA lo garantiza).
6. **Auditoría**: toda operación de escritura (CREATE, UPDATE, DELETE, PATCH) debe dejar registro en la tabla `auditoria`.

---

## 14. ORDEN SUGERIDO DE DESARROLLO

Seguir este orden para tener siempre algo funcional en cada etapa:

### Etapa 1 — Base
1. Setup Spring Boot + PostgreSQL + Flyway
2. Entidades JPA + migraciones V1-V4
3. Autenticación JWT completa
4. CRUD de festivales, resoluciones, sectores, eventos

### Etapa 2 — Ítems y presupuesto
5. Ítems tipo 1 (evento puntual)
6. Pools transversales (tipo 2)
7. Servicios por período (tipo 3)
8. Motor de cálculo de saldos
9. Traslados presupuestales

### Etapa 3 — Tareas y documentos
10. Tareas padre + sub-tareas con cálculo de estado automático
11. Upload y descarga de documentos soporte
12. Sistema de alertas (scheduler + disparadores reactivos)
13. Dashboard y auditoría

### Etapa 4 — Módulo de logística
14. CRUD de personal de logística
15. Generación de QR (ZXing)
16. Generación de carnet PDF (PDFBox)
17. Asignaciones de personal a eventos
18. Escaneo QR y registro de accesos
19. Ítems físicos de logística

### Etapa 5 — Frontend Angular
20. Setup Angular + Angular Material + routing
21. Auth (login, guards, interceptor)
22. Dashboard
23. Módulos de eventos, ítems, tareas (tablero Kanban)
24. Alertas
25. Módulo completo de logística (todas las pantallas)
26. Docker Compose final

---

## 15. NOTAS FINALES PARA LA IA DE DESARROLLO

- **No omitas la capa de validación**: todos los endpoints deben validar los datos de entrada con `@Valid` y las anotaciones de Jakarta Validation.
- **No uses `@Transactional` en el controller**: solo en la capa de servicio.
- **Usa DTOs siempre**: nunca exponer las entidades JPA directamente en los endpoints.
- **Los IDs en la URL son Long**: `@PathVariable Long id`.
- **Paginación**: todos los endpoints de listado deben soportar `?page=0&size=20&sort=createdAt,desc`.
- **Fechas**: usar `LocalDateTime` en el backend, serializar como ISO 8601 (`yyyy-MM-dd'T'HH:mm:ss`).
- **El módulo de logística tiene su propio prefijo**: todas sus rutas empiezan con `/api/logistica/` o `/api/festivales/{id}/logistica/`.
- **El escáner QR debe funcionar en móvil**: el frontend debe ser responsive, especialmente la pantalla del escáner.
- **Preguntar antes de asumir**: si algo de la lógica de negocio no está clara en esta especificación, preguntar antes de implementar.
