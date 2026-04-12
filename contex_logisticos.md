Acá va el documento completo del flujo del personal logístico:

---

# CorpoSanpedro — App de Gestión de Personal Logístico
## Documento de diseño UI — Flujo Personal Logístico

---

## Pantalla 1 — Login (Personal Logístico)

**Propósito:** Autenticación del logístico en la app.

**Fondo:** Blanco cálido `#FDFAF5`

**Composición de arriba a abajo:**
- Logo de CorpoSanpedro centrado arriba (sombrero + texto + subtítulo)
- Ilustración decorativa sutil: silueta de caballo y jinete en `#C0392B` con opacidad 10%
- Campo de texto: "Usuario" — fondo `#F0EDE8`, bordes redondeados, texto café tierra
- Campo de texto: "Contraseña" — mismo estilo, ícono de ojo a la derecha
- Botón principal: "Iniciar sesión" — fondo `#C0392B`, texto blanco, Montserrat Bold, ancho completo
- Link pequeño: "¿Olvidaste tu contraseña?" en dorado `#F0A500`

**Nota para el diseñador:** La pantalla de login es visualmente idéntica a la del administrador. La diferencia es solo de rol, que viene desde el backend. No hay selector de rol visible en pantalla.

**Parte inferior:** Franja decorativa con motivos geométricos sampedreños en `#C0392B` y `#F0A500`

---

## Pantalla 2 — Home del logístico

**Propósito:** Vista principal con resumen de su estado y acceso rápido a su QR.

**Header:**
- Fondo `#C0392B`
- Logo pequeño CorpoSanpedro a la izquierda en blanco
- Saludo: "Hola, [Nombre del logístico]" en blanco, Montserrat Bold
- Subtexto: fecha actual en blanco con opacidad 70%
- Foto de perfil circular del logístico arriba a la derecha, borde blanco 2px

**Tarjeta destacada — Mi próximo evento:**
- Fondo `#5C3D1E`, bordes redondeados
- Pequeño ícono de sombrero dorado en esquina superior derecha con opacidad 20%
- Etiqueta: "Próximo evento" en dorado `#F0A500`, Inter pequeño
- Nombre del evento en blanco, Montserrat Bold
- Fecha y hora en blanco con opacidad 80%
- Ubicación en blanco con opacidad 80%, ícono de pin
- Badge de estado: "Próximo" en dorado, "En curso" en verde `#1A6B3C`, "Liquidación" en `#C0392B`
- Botón: "Ver mi QR" — fondo `#F0A500`, texto `#5C3D1E`, Montserrat Bold

**Sección: Mis eventos asignados**
- Etiqueta en café tierra, Montserrat Bold pequeño
- Lista de próximas 2 o 3 tarjetas de eventos en formato compacto (nombre + fecha + badge de estado)
- Link al final: "Ver todos mis eventos" en `#C0392B`

**Tab bar inferior:**
- Fondo blanco, borde superior `#F0EDE8`
- 4 ítems: Inicio (casa), Mi QR (qr), Mis eventos (calendario), Mis pagos (billetera)
- Ítem activo en `#C0392B`, inactivo en gris

---

## Pantalla 3 — Mi QR

**Propósito:** Mostrar el código QR personal del logístico para ser escaneado por el administrador al ingresar o salir de un evento.

**Header:**
- Fondo `#C0392B`
- Título "Mi QR" en blanco, Montserrat Bold

**Cuerpo:**
- Fondo blanco cálido `#FDFAF5`
- Foto circular del logístico centrada arriba, grande (80px), borde 3px dorado `#F0A500`
- Nombre completo debajo, Montserrat Bold, `#5C3D1E`
- Cargo: "Personal logístico" en Inter gris

**Tarjeta del QR:**
- Fondo blanco, borde redondeado, borde 0.5px `#F0EDE8`
- Franja superior de 4px en dorado `#F0A500`
- Código QR grande centrado dentro de la tarjeta
- Texto debajo del QR: "Presenta este código al administrador al ingresar y al salir" en Inter pequeño, gris
- Pequeños íconos decorativos de sombrero en las esquinas del QR en dorado con opacidad 10%

**Texto de apoyo debajo de la tarjeta:**
- "Este es tu código de identificación único. No lo compartas." en Inter pequeño, café tierra

---

## Pantalla 4 — Mis eventos

**Propósito:** Ver todos los eventos asignados al logístico, pasados y futuros.

**Header:**
- Fondo `#C0392B`
- Título "Mis eventos" en blanco, Montserrat Bold

**Filtros:**
- Pills horizontales: "Todos", "Próximos", "En curso", "Liquidación", "Finalizados"
- Pill activo: fondo `#C0392B`, texto blanco
- Pill inactivo: fondo `#F0EDE8`, texto café tierra

**Lista de eventos:**

Cada tarjeta contiene:
- Franja lateral izquierda de 4px con color según estado:
  - Próximo: dorado `#F0A500`
  - En curso: verde `#1A6B3C`
  - Liquidación: `#C0392B`
  - Finalizado: gris `#B0A090`
- Nombre del evento en Montserrat Bold, `#5C3D1E`
- Fecha y hora en Inter gris
- Ubicación en Inter gris con ícono de pin
- Badge de estado en esquina superior derecha con el color correspondiente
- Flecha a la derecha indicando que es tappable para ver detalle

---

## Pantalla 5 — Detalle de evento

**Propósito:** Ver la información completa de un evento asignado.

**Header:**
- Fondo `#C0392B`
- Flecha atrás en blanco
- Nombre del evento en blanco, Montserrat Bold
- Badge de estado debajo del nombre

**Cuerpo:**
- Fondo `#FDFAF5`

**Tarjeta de información del evento:**
- Fondo blanco, borde redondeado, franja superior 4px dorada
- Ícono de sombrero decorativo en esquina con opacidad 15%
- Filas de información:
  - Fecha: ícono calendario + fecha completa
  - Hora: ícono reloj + hora de inicio
  - Lugar: ícono pin + dirección
  - Tarifa: ícono billetera + valor en Montserrat Bold, `#1A6B3C`

**Sección: Mi registro en este evento** (si ya tiene ingresos registrados):
- Hora de ingreso registrada en verde `#1A6B3C`
- Hora de salida registrada en gris (o "Pendiente" si aún no ha salido)

**Botón "Ver mi QR":**
- Solo visible si el evento está en estado "En curso"
- Fondo `#F0A500`, texto `#5C3D1E`, Montserrat Bold, ancho completo
- Lleva directamente a la pantalla de Mi QR

**Botón "Generar cuenta de cobro":**
- Solo visible y habilitado si el evento está en estado "Liquidación"
- Fondo `#C0392B`, texto blanco, Montserrat Bold, ancho completo
- Si el evento NO está en liquidación: botón deshabilitado en gris con texto "Disponible cuando el evento entre en liquidación"

---

## Pantalla 6 — Mis pagos

**Propósito:** Ver el historial de todos los eventos trabajados y el estado de pago de cada uno.

**Header:**
- Fondo `#C0392B`
- Título "Mis pagos" en blanco, Montserrat Bold

**Tarjeta resumen arriba:**
- Fondo `#5C3D1E`, bordes redondeados
- Texto: "Total acumulado" en blanco con opacidad 70%, Inter pequeño
- Monto total en Montserrat Bold grande, dorado `#F0A500`
- Subtexto: "Suma de todos los eventos finalizados" en blanco con opacidad 50%

**Lista de eventos con pago:**

Cada fila contiene:
- Nombre del evento en Montserrat Bold, `#5C3D1E`
- Fecha en Inter gris
- Monto a cobrar en Montserrat Bold, `#1A6B3C`
- Badge de estado de pago:
  - "Pendiente": fondo `#FFF3E0`, texto dorado `#F0A500`
  - "En liquidación": fondo `#FDECEA`, texto `#C0392B`
  - "Pagado": fondo `#E8F5EE`, texto `#1A6B3C`
- Ícono de PDF a la derecha si la cuenta de cobro ya fue generada, en `#C0392B`

---

## Pantalla 7 — Cuenta de cobro

**Propósito:** Generar y descargar en PDF la cuenta de cobro del logístico para un evento en estado de liquidación.

**Header:**
- Fondo `#C0392B`
- Flecha atrás en blanco
- Título "Cuenta de cobro" en blanco, Montserrat Bold

**Cuerpo — Vista previa del documento:**
- Fondo blanco cálido `#FDFAF5`

**Tarjeta de vista previa (simula el PDF):**
- Fondo blanco, borde redondeado, sombra suave
- Logo de CorpoSanpedro centrado arriba dentro del documento
- Línea divisoria dorada `#F0A500`
- Campos del documento:
  - **Nombre completo** del logístico
  - **Documento de identidad**
  - **Nombre del evento**
  - **Fecha del evento**
  - **Horas o jornada trabajada** (según registro de ingreso y salida)
  - **Tarifa pactada por el evento**
  - **Valor a cobrar** en Montserrat Bold grande, `#1A6B3C`
- Línea divisoria dorada al final
- Texto: "Generado por CorpoSanpedro · Festival San Pedro del Huila" en Inter pequeño, gris

**Botón principal:**
- "Descargar PDF" — fondo `#C0392B`, texto blanco, ícono de descarga, Montserrat Bold, ancho completo

**Texto de apoyo debajo:**
- "Una vez descargado, presenta este documento para hacer efectivo tu pago." en Inter pequeño, café tierra