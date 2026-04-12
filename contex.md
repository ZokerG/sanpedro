Acá va el documento completo para tu diseñador:

---

# CorpoSanpedro — App de Gestión de Personal Logístico
## Documento de diseño UI — Flujo Administrador

---

## Identidad visual

**Nombre de la app:** CorpoSanpedro
**Subtítulo:** Gestión de Personal Logístico · Festival San Pedro del Huila

**Paleta de colores:**
| Nombre | Hex | Uso |
|---|---|---|
| Rojo fiesta | `#C0392B` | Botones primarios, headers |
| Amarillo dorado | `#F0A500` | Acentos, badges, destacados |
| Verde Huila | `#1A6B3C` | Éxito, confirmaciones, ingresos |
| Blanco cálido | `#FDFAF5` | Fondos de pantalla |
| Café tierra | `#5C3D1E` | Textos, íconos secundarios |
| Rojo oscuro | `#7B1F1A` | Headers con peso, errores |

**Tipografía:**
- Títulos y botones: Montserrat Bold
- Cuerpo y etiquetas: Inter o Roboto

**Logo:** Texto "CorpoSanpedro" en Montserrat Bold color `#C0392B`, con sombrero vaquero centrado encima. Subtexto: *Gestión de Personal Logístico* en Inter, color café tierra `#5C3D1E`.

**Elementos decorativos:** Silueta de caballo y jinete, sombrero vaquero, notas musicales o acordeón, referencia a la bandera del Huila. Usarlos como ilustraciones vectoriales sutiles en fondos y cards.

---

## Pantalla 1 — Login

**Propósito:** Autenticación del administrador.

**Fondo:** Blanco cálido `#FDFAF5`

**Composición de arriba a abajo:**
- Logo de CorpoSanpedro centrado en la parte superior (sombrero + texto + subtítulo)
- Ilustración decorativa sutil debajo del logo: silueta de caballo y jinete en color `#C0392B` con opacidad al 10%, solo decorativa, no distrae
- Campo de texto: "Correo electrónico" — fondo `#F0EDE8`, bordes redondeados, texto en café tierra
- Campo de texto: "Contraseña" — mismo estilo, con ícono de ojo a la derecha para mostrar/ocultar
- Botón principal: "Iniciar sesión" — fondo `#C0392B`, texto blanco, Montserrat Bold, esquinas redondeadas, ancho completo
- Link pequeño debajo: "¿Olvidaste tu contraseña?" en color `#F0A500`

**Parte inferior de la pantalla:** Franja decorativa con patrón alusivo al San Pedro (flecos o motivos geométricos típicos huilenses) en `#C0392B` y `#F0A500`

---

## Pantalla 2 — Dashboard principal

**Propósito:** Vista general del estado de los eventos activos del día y acceso rápido al escáner.

**Header:**
- Fondo `#C0392B`
- Logo pequeño de CorpoSanpedro a la izquierda (solo sombrero + texto blanco)
- Saludo a la derecha: "Hola, [Nombre]" en blanco, subtexto con fecha actual en blanco con opacidad 70%
- Ícono de notificaciones arriba a la derecha en blanco

**Cuerpo:**
- Fondo `#FDFAF5`
- Sección: **"Eventos activos hoy"** — etiqueta en café tierra `#5C3D1E`, Montserrat Bold tamaño pequeño
- Tarjetas de eventos scrolleables horizontalmente:
  - Fondo blanco, borde izquierdo de 4px en dorado `#F0A500`
  - Nombre del evento en Montserrat Bold, color `#5C3D1E`
  - Ubicación e hora en Inter, color gris medio
  - Barra de progreso de cupo: fondo gris claro, relleno en `#1A6B3C`, texto debajo "18 de 30 logísticos ingresados"
  - Pequeño ícono decorativo de sombrero en la esquina superior derecha de cada card en dorado con opacidad 20%

**Botón flotante (FAB) centrado abajo:**
- Fondo `#C0392B`, sombra suave
- Ícono de QR o cámara en blanco, grande
- Texto debajo del ícono: "Escanear QR" en blanco, Inter

**Tab bar inferior:**
- Fondo blanco, borde superior `#F0EDE8`
- 3 ítems: Inicio (ícono casa), Escanear (ícono QR), Historial (ícono reloj)
- Ítem activo en `#C0392B`, ítem inactivo en gris

---

## Pantalla 3 — Escáner QR

**Propósito:** Capturar el código QR del logístico para registrar ingreso o salida.

**Fondo:** Cámara activa ocupando toda la pantalla.

**Overlay:** Capa oscura `rgba(92,61,30,0.85)` sobre la cámara, dejando visible solo el recuadro de escaneo al centro.

**Recuadro de escaneo:**
- Cuadrado centrado en la pantalla
- Bordes en dorado `#F0A500`, grosor 2.5px
- Las 4 esquinas con un trazo decorativo más grueso (esquinas estilizadas)
- Línea horizontal animada que sube y baja simulando el escaneo, color `#F0A500`

**Arriba del recuadro:**
- Texto: "Apunta al código QR del logístico" en blanco, Inter, centrado
- Si hay varios eventos activos: selector tipo pill para elegir el evento, fondo `#5C3D1E`, texto dorado

**Abajo del recuadro:**
- Nombre del evento activo seleccionado: "Evento: Feria Alimentarte"
- Conteo actual: "18 / 30 logísticos ingresados" en blanco, con el número en dorado

**Botón arriba izquierda:** Flecha atrás o "Cancelar" en blanco

---

## Pantalla 4A — Resultado: Ingreso exitoso

**Propósito:** Confirmar el ingreso de un logístico asignado y habilitado.

**Fondo:** Blanco cálido `#FDFAF5`

**Composición:**
- Foto circular del logístico centrada arriba, grande (80–90px), con borde de 3px en `#1A6B3C`
- Nombre completo debajo en Montserrat Bold, `#5C3D1E`
- Cargo: "Personal logístico" en Inter, gris
- Badge: "Asignado a este evento" — fondo `#E8F5EE`, texto `#1A6B3C`, ícono de check
- Línea divisoria en `#F0EDE8`
- Estado detectado: "Registrando INGRESO" en Montserrat Bold, `#1A6B3C`, con ícono de flecha entrando
- Hora del registro: "09:14 a.m." en Inter, gris
- Contador: "19 / 30 logísticos ingresados" en Inter, con el número en dorado `#F0A500`
- Botón primario: "Confirmar ingreso" — fondo `#1A6B3C`, texto blanco, ancho completo
- Botón secundario: "Cancelar" — sin fondo, borde `#C0392B`, texto `#C0392B`

---

## Pantalla 4B — Resultado: Salida

**Propósito:** Registrar la salida de un logístico que ya había ingresado.

**Igual que 4A excepto:**
- Borde de foto en azul neutro `#2980B9`
- Badge: "Ya registró ingreso a las 09:14 a.m." — fondo azul claro, texto azul
- Estado: "Registrando SALIDA" con ícono de flecha saliendo, color azul `#2980B9`
- Botón primario: "Confirmar salida" — fondo azul `#2980B9`

---

## Pantalla 4C — Resultado: Rechazado

**Propósito:** Informar que el logístico escaneado no puede ingresar.

**Fondo:** Blanco cálido `#FDFAF5`

**Composición:**
- Ícono grande centrado: círculo `#7B1F1A` con X blanca (en lugar de foto)
- Dos mensajes posibles según el caso:
  - **No asignado:** "Este logístico no está asignado a este evento" en Montserrat Bold, `#7B1F1A`
  - **Cupo lleno:** "Se alcanzó el límite de 30 logísticos para este evento" en Montserrat Bold, `#7B1F1A`
- Texto de apoyo en Inter gris: descripción breve del motivo
- Botón primario: "Volver a escanear" — fondo `#C0392B`, texto blanco

---

## Pantalla 5 — Detalle de evento activo

**Propósito:** Ver en tiempo real el estado del personal en un evento específico.

**Header:**
- Fondo `#C0392B`
- Flecha atrás en blanco
- Nombre del evento en blanco, Montserrat Bold
- Fecha y hora debajo en blanco con opacidad 70%

**Fila de tarjetas resumen (3 tarjetas):**
- Fondo blanco, borde redondeado
- **Ingresados:** número grande en `#1A6B3C`
- **Salidos:** número grande en gris
- **Cupo restante:** número grande en `#F0A500`
- Etiquetas en Inter pequeño, café tierra

**Filtros de lista:**
- Pills: "Todos", "Dentro", "Salieron"
- Pill activo: fondo `#C0392B`, texto blanco
- Pill inactivo: fondo `#F0EDE8`, texto café tierra

**Lista de logísticos:**
- Cada fila: foto circular pequeña + nombre en Montserrat + hora de ingreso en Inter gris + badge de estado
- Badge "Dentro": fondo `#E8F5EE`, texto `#1A6B3C`
- Badge "Salió": fondo `#F0EDE8`, texto café tierra
- Separador entre filas en `#F0EDE8`

---

## Pantalla 6 — Historial de eventos

**Propósito:** Ver todos los eventos pasados y acceder a su detalle financiero.

**Header:**
- Fondo `#C0392B`
- Título "Historial" en blanco, Montserrat Bold

**Cuerpo:**
- Fondo `#FDFAF5`
- Lista de tarjetas de eventos pasados:
  - Franja superior de 4px en dorado `#F0A500`
  - Nombre del evento en Montserrat Bold, `#5C3D1E`
  - Fecha del evento en Inter gris
  - Asistencia: "28 de 30 logísticos trabajaron" con el número en `#1A6B3C`
  - Total pagado: "Total: $1.400.000" en Montserrat Bold, `#C0392B`
  - Flecha a la derecha indicando que es tappable
- Pequeño ícono decorativo de sombrero en dorado con opacidad 15% en la esquina de cada card

---

## Pantalla 7 — Detalle financiero del evento

**Propósito:** Ver el desglose de pago de cada logístico que trabajó en el evento.

**Header:**
- Fondo `#C0392B`
- Flecha atrás
- Nombre del evento, Montserrat Bold blanco
- Fecha debajo, blanco con opacidad 70%

**Tarjetas de resumen financiero (fila de 3):**
- **Logísticos que trabajaron:** número en `#5C3D1E`
- **Tarifa por persona:** valor en `#5C3D1E`
- **Total a pagar:** valor en Montserrat Bold grande, `#F0A500`, sobre fondo `#5C3D1E`

**Lista de logísticos con pago:**
- Cada fila: foto circular pequeña + nombre + monto individual a la derecha en `#1A6B3C`, Montserrat Bold
- Separador en `#F0EDE8`

**Fila final — Total:**
- Fondo `#5C3D1E`
- Texto "Total a pagar" en blanco, Inter
- Monto total en `#F0A500`, Montserrat Bold grande