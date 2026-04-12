Perfecto, qué detalle tan bonito para el proyecto. Acá van las indicaciones completas para que lo ejecutes en Stitch o la herramienta que uses:

---

# CorpoSanpedro — Diseño de Carnés por Sector

## Formato y estructura general

**Tamaño:** CR80 estándar — 85.6mm × 54mm (horizontal) o vertical 54mm × 85.6mm. Te recomiendo **vertical** para que el QR y la foto quepan bien sin verse apretados.

**Caras:** El carné tiene dos lados:
- **Cara frontal:** Foto, nombre, cargo, sector, número de camiseta, documento
- **Cara posterior:** Código QR grande centrado + logo CorpoSanpedro + texto de validación

---

## Estructura cara frontal

**Zona superior (30% de la cara):**
- Franja de color del sector (ver paleta por sector abajo), ocupa todo el ancho
- Logo de CorpoSanpedro centrado en blanco dentro de la franja
- Subtexto: "Festival San Pedro del Huila" en blanco, Inter pequeño
- Elemento decorativo: silueta de bailarines de San Pedro o sombrero vaquero en blanco con opacidad 15%, flotando sobre la franja como fondo decorativo

**Zona media (40% de la cara):**
- Foto del logístico centrada, formato circular o cuadrado con esquinas redondeadas, tamaño mediano
- Borde de la foto en el color del sector, grosor 3px
- Nombre completo debajo de la foto en Montserrat Bold, color oscuro del sector
- Cargo o rol debajo del nombre en Inter, gris

**Zona inferior (30% de la cara):**
- Fondo muy claro (casi blanco) con un patrón geométrico sutil alusivo al San Pedro en el color del sector con opacidad 8%
- Filas de información:
  - Ícono + "Documento:" valor
  - Ícono + "Camiseta N°:" valor
  - Ícono + "Sector:" nombre del sector
- Badge del sector en la esquina inferior derecha: pill con el color del sector y el nombre en blanco

---

## Estructura cara posterior

**Zona superior:**
- Logo CorpoSanpedro centrado, versión oscura o a color
- Línea divisoria en el color del sector

**Zona central (protagonista):**
- Código QR grande centrado, con buen margen alrededor para facilitar el escaneo
- Esquinas del QR decoradas con el motivo del sombrero vaquero en el color del sector, muy sutil
- Debajo del QR: "Escanea para verificar identidad" en Inter pequeño, gris

**Zona inferior:**
- Nombre del portador en Montserrat Bold pequeño
- Número de documento
- Línea: "Este carné es personal e intransferible"
- "Festival San Pedro del Huila · CorpoSanpedro" en Inter muy pequeño, gris

---

## Paleta y diseño por sector

### Sector Logístico
- **Color principal:** Rojo fiesta `#C0392B`
- **Color secundario:** Café tierra `#5C3D1E`
- **Color de acento:** Dorado `#F0A500`
- **Elemento decorativo:** Silueta de caballo y jinete sampedreño en blanco con opacidad 12% en la franja superior
- **Patrón de fondo inferior:** Flecos o motivos geométricos típicos huilenses en rojo muy claro
- **Badge:** Pill rojo con texto blanco "Logístico"

### Sector Cultural
- **Color principal:** Morado `#6C3483`
- **Color secundario:** Morado oscuro `#4A235A`
- **Color de acento:** Dorado `#F0A500`
- **Elemento decorativo:** Silueta de bailarines de San Pedro (pareja bailando) en blanco con opacidad 12% en la franja superior
- **Patrón de fondo inferior:** Notas musicales o formas de acordeón en morado muy claro
- **Badge:** Pill morado con texto blanco "Cultural"

### Sector Finanzas
- **Color principal:** Verde Huila `#1A6B3C`
- **Color secundario:** Verde oscuro `#0F3D22`
- **Color de acento:** Dorado `#F0A500`
- **Elemento decorativo:** Sombrero vaquero sampedreño en blanco con opacidad 12% en la franja superior
- **Patrón de fondo inferior:** Motivos geométricos suaves en verde muy claro
- **Badge:** Pill verde con texto blanco "Finanzas"

---

## Elementos decorativos alusivos al San Pedro — guía de uso

Estos elementos los consigues como vectores SVG o PNG con fondo transparente en Freepik, Flaticon o Vecteezy buscando "Colombian folklore", "sombrero vueltiao", "cumbia dancer silhouette" o "llanero cowboy":

- **Sombrero vaquero / vueltiao:** Úsalo en la franja superior y en las esquinas del QR de la cara posterior
- **Pareja de bailarines de San Pedro:** Silueta en la franja superior del sector cultural
- **Caballo y jinete:** Silueta en la franja superior del sector logístico
- **Acordeón o notas musicales:** Patrón de fondo en el sector cultural
- **Flecos típicos huilenses:** Borde decorativo entre la franja superior y la zona de foto

---

## Tipografía en el carné

- **Nombre:** Montserrat Bold, 14px
- **Cargo y sector:** Inter Medium, 10px
- **Datos (documento, camiseta):** Inter Regular, 9px
- **Textos legales cara posterior:** Inter Regular, 7px

---

## Recomendaciones técnicas para ejecutarlo

- Diseña en **Figma, Canva Pro o Adobe Illustrator** con el tamaño real CR80
- Usa **sangrado de 3mm** en todos los bordes para impresión
- El QR de la cara posterior debe tener mínimo **2.5cm × 2.5cm** para que la app lo lea bien
- Exporta en **300 DPI** para impresión física
- Si vas a imprimir con laminado, evita colores muy oscuros en zonas donde irá el QR