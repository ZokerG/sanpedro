# FASE 1: Control Operativo y Monitoreo

## Goal
Dotar a CorpoSanpedro de geolocalización en tiempo real del personal en campo, gestión de estados de jornada, nuevo rol LIDER_CAMPO, y un dashboard web administrativo con mapa de operaciones.

---

## Backend (Spring Boot + PostgreSQL)

### 1. Nuevo enum: `EstadoJornada`
- File: `entity/EstadoJornada.java`
- Values: `ACTIVO`, `EN_RUTA`, `PAUSA`, `FIN_JORNADA`

### 2. Nueva entidad: `JornadaPersonal`
- `id`, `personal_id` (FK), `evento_id` (FK, nullable), `estado` (enum), `fechaInicio`, `fechaFin`
- One active jornada per personal at a time

### 3. Nueva entidad: `UbicacionPersonal`
- `id`, `jornada_id` (FK), `personal_id` (FK), `latitud`, `longitud`, `precision`, `timestamp`

### 4. Nuevo rol: `LIDER_CAMPO` en DataInitializer

### 5. API endpoints nuevos:
- `POST /api/jornadas/iniciar` — Iniciar jornada (body: eventoId opcional)
- `PATCH /api/jornadas/{id}/estado` — Cambiar estado (body: nuevoEstado)
- `POST /api/jornadas/{id}/ubicacion` — Reportar ubicación GPS
- `GET /api/jornadas/activa` — Jornada activa del usuario autenticado
- `GET /api/jornadas/activas` — Todas las jornadas activas (admin/líder)
- `GET /api/dashboard/operativo` — Datos agregados dashboard

---

## App Flutter (`logisticos_app`)

### 6. Nuevas dependencias
- `geolocator`, `background_fetch`, `permission_handler`

### 7. Pantalla de Jornada
- Botón "Iniciar Jornada", selector de estado, envío GPS cada 60s

### 8. Adaptar navegación por rol
- Admin: ve dashboard + gestión
- Líder: ve su equipo + jornada
- Operativo: ve solo su jornada y eventos

---

## Dashboard Web (`corposanpedro-web` — Next.js)

### 9. Crear proyecto
- Next.js 15 + TypeScript + Tailwind + shadcn/ui + react-leaflet

### 10. Login + Layout
- Conectar a `POST /api/auth/login`, guardar JWT en cookies

### 11. Dashboard Operativo v1
- Mapa Leaflet con posiciones del personal (polling 15s)
- Tarjetas de personal con estado, evento, última ubicación
- Filtros por evento y estado
