# Especificación de Diseño Visual — Organizador de Tareas (v1.5.6)

Documento de referencia visual enfocado exclusivamente en materiales, translucidez, iluminación especular, color, tipografía, geometría, capas de interfaz y microinteracciones.

---

## 1. Filosofía y Lenguaje Visual

- **Estética principal**: Cristal líquido traslúcido (*Liquid Glass* inspirado en Apple HIG) combinado con geometría de **cápsulas (`9999px`)** y tarjetas de esquinas amplias (`1.75rem` / `28px`).
- **Profundidad por capas**: Un fondo ambiental fijo (`#app-background`) respira detrás de contenedores principales transparentes (`main`, grillas y secciones), mientras que barras de navegación, cajón lateral, paneles, popovers y diálogos flotan encima con distintos grados de desenfoque, saturación, halo especular y sombra.
- **Legibilidad protegida (WCAG AA >= 4.5:1)**: Toda superficie traslúcida combina un color base semitransparente con un **velo interno protector (*scrim*)** radial o lineal detrás del texto para evitar pérdida de contraste incluso sobre fondos muy claros o muy oscuros.
- **Fluidez a 60 FPS**: El desenfoque (`backdrop-filter`) se reserva a capas flotantes, paneles y modales; las tarjetas de listas (`.stagger-card`) y la cápsula deslizante de controles segmentados prescinden de `backdrop-filter` propio para garantizar desplazamiento fluido en móviles.

---

## 2. Identidad Cromática Base

| Rol | Modo Claro | Modo Oscuro |
| :--- | :--- | :--- |
| **Lienzo base (`body`)** | `#e6ebf5` | `#070b15` |
| **Texto principal** | `#0f172a` | `#f8fafc` |
| **Texto secundario en cristal** | `#1e293b` / `#334155` | `#cbd5e1` / `#e2e8f0` |
| **Acento primario (Índigo)** | `#4f46e5` -> `#6366f1` -> `#7c3aed` | `#6366f1` / `#818cf8` |
| **Acento cálido (Ámbar)** | `#f59e0b` / `#d97706` / `#ea580c` | `#fbbf24` / `#f59e0b` |
| **Acción rápida / Tareas (Teal-Esmeralda)** | `#0d9488` -> `#059669` -> `#10b981` | `#10b981` / `#34d399` |
| **Ko-fi (Pie del menú lateral)** | `#FF5E5B` -> `#FA4032` | `#FF5E5B` -> `#FA4032` |

---

## 3. Los 3 Modos de Intensidad del Cristal (`data-glass-intensity`)

La interfaz adapta desenfoque, saturación cromática del fondo filtrado, intensidad de reflejos especulares y opacidad base en tres niveles seleccionables: **Suave**, **Normal** e **Intenso** (predeterminado).

### 3.1 Parámetros ópticos globales

| Propiedad | `Suave` | `Normal` | `Intenso` (Base) |
| :--- | :---: | :---: | :---: |
| **Desenfoque Nav / Bottom / Drawer** (`--lg-blur-nav`) | `12px` | `28px` | `36px` |
| **Desenfoque Paneles** (`--lg-blur-panel`) | `8px` | `20px` | `26px` |
| **Desenfoque Modales estándar** (`--lg-blur-modal`) | `14px` | `32px` | `40px` |
| **Desenfoque Backdrop** (`--lg-blur-backdrop`) | `10px` | `15px` | `18px` |
| **Saturación Nav / Modales** (`--lg-sat-nav`) | `135%` | `190%` | `215%` |
| **Saturación Paneles** (`--lg-sat-panel`) | `125%` | `175%` | `190%` |
| **Opacidad del borde especular** (`--lg-sheen-opacity`) | `0` (desactivado) | `0.72` | `1.0` |

> **Reducción automática con fondo animado (`html.animated-bg-running`)**: En modos `Normal` e `Intenso`, el desenfoque baja dinámicamente a `16px` en navegación y `14px` en paneles para conservar fluidez.

### 3.2 Opacidades base por superficie (Claro vs. Oscuro)

| Superficie | `Suave` (Claro / Oscuro) | `Normal` (Claro / Oscuro) | `Intenso` (Claro / Oscuro) |
| :--- | :---: | :---: | :---: |
| **Barra superior y barra inferior** | `rgba(255,255,255,0.86)` / `rgba(15,23,42,0.86)` | `rgba(255,255,255,0.50)` / `rgba(15,23,42,0.46)` | `rgba(255,255,255,0.42)` / `rgba(15,23,42,0.36)` |
| **Menú lateral (`#sidebar-drawer`)** | `rgba(248,250,252,0.92)` / `rgba(15,23,42,0.92)` | `rgba(248,250,252,0.54)` / `rgba(15,23,42,0.48)` | `rgba(248,250,252,0.44)` / `rgba(15,23,42,0.38)` |
| **Paneles y acordeones** | `rgba(255,255,255,0.88)` / `rgba(15,23,42,0.88)` | `rgba(255,255,255,0.54)` / `rgba(15,23,42,0.54)` | `rgba(255,255,255,0.44)` / `rgba(15,23,42,0.46)` |
| **Tarjetas (`.stagger-card`)** | `rgba(255,255,255,0.90)` / `rgba(22,31,52,0.90)` | `rgba(255,255,255,0.58)` / `rgba(18,27,48,0.56)` | `rgba(255,255,255,0.50)` / `rgba(18,27,48,0.48)` |
| **Modales estándar** | `rgba(255,255,255,0.92)` / `rgba(15,23,42,0.92)` | `rgba(255,255,255,0.58)` / `rgba(15,23,42,0.54)` | `rgba(255,255,255,0.46)` / `rgba(15,23,42,0.46)` |
| **Popovers flotantes** | `rgba(255,255,255,0.90)` / `rgba(15,23,42,0.90)` | `rgba(255,255,255,0.56)` / `rgba(15,23,42,0.52)` | `rgba(255,255,255,0.46)` / `rgba(15,23,42,0.44)` |

---

## 4. Acabado Óptico: Velo Protector, Borde Especular y Sombras

### 4.1 Borde especular degradado de 1px (`::before`)
Aplicado en barra superior, barra inferior, menú lateral, paneles, acordeones y diálogos modales:
- Implementado mediante pseudo-elemento `::before` con `padding: 1px` y `mask-composite: exclude` (recorte interior) para simular refracción de luz en el canto del vidrio.
- **Modo Claro**: `linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.36) 38%, rgba(255,255,255,0.14) 70%, rgba(255,255,255,0.74) 100%)`.
- **Modo Oscuro**: `linear-gradient(135deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.04) 70%, rgba(255,255,255,0.22) 100%)`.

### 4.2 Sombras de elevación (Glass Shadows)
- **Claro**:
  - `--shadow-glass-sm`: `0 2px 8px -2px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.05)`
  - `--shadow-glass-md`: `0 14px 34px -12px rgba(15,23,42,0.14), 0 2px 8px -2px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.94), 0 0 0 1px rgba(15,23,42,0.07)`
  - `--shadow-glass-lg`: `0 24px 56px -14px rgba(15,23,42,0.22), 0 6px 18px -4px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.96)`
  - `--shadow-glass-hover`: elevación `-2px` en Y con sombra `0 22px 46px -12px rgba(15,23,42,0.18)`.
- **Oscuro**:
  - Sombras profundas basadas en `rgba(2, 6, 23, 0.50–0.78)` y línea especular superior interna `inset 0 1px 0 rgba(255,255,255,0.16–0.22)`.

### 4.3 Protección extra con fondo activo (`data-bg-active="true"`)
Cuando hay una foto personalizada o gradiente activo detrás de la interfaz, los velos internos (`--lg-*-scrim`) refuerzan el centro hasta `rgba(255,255,255,0.82–0.84)` en Claro y `rgba(11,17,32,0.84–0.88)` en Oscuro para blindar la lectura.

---

## 5. Modos de Apariencia: Claro, Oscuro y Monocromático

### 5.1 Modo Claro (Estándar)
- **Atmósfera (`#app-background`)**: 3 halos radiales suaves sobre `#e6ebf5`: índigo arriba-izquierda (`rgba(99,102,241,0.22)`), ámbar arriba-derecha (`rgba(245,158,11,0.16)`) y lavanda/celeste abajo-centro (`rgba(129,140,248,0.18)`).
- **Cristal**: Blanco lechoso con bordes luminosos `rgba(255,255,255,0.88–0.92)` y anillo exterior sutil `rgba(15,23,42,0.08)`.
- **Indicador activo de navegación**: Cápsula `rgba(255,255,255,0.92)` con borde `rgba(99,102,241,0.24)`.

### 5.2 Modo Oscuro (Estándar — `html.dark`)
- **Atmósfera (`#app-background`)**: 3 manchas radiales sobre `#070b15`: índigo (`0.26`), ámbar tenue (`0.14`) y violeta/turquesa profundo (`0.22` / `0.06`).
- **Cristal**: Cristal ahumado azul pizarra (`rgba(15,23,42,...)` y `rgba(18,27,48,...)`), bordes `rgba(255,255,255,0.18–0.22)` y halo de contraste `rgba(2,6,23,0.42–0.55)`.
- **Indicador activo de navegación**: Cápsula traslúcida `rgba(255,255,255,0.15)` con borde `rgba(255,255,255,0.26)`.

### 5.3 Modo Monocromático (`html.theme-gray`)
Elimina tintes cromáticos aplicando `filter: grayscale(1)` sobre `#app-background` y adapta toda la gama a neutros metálicos tanto en Claro como en Oscuro:
- **Monocromático Claro (*Silver & Slate Glass*)**:
  - Fondo base `#d6dbe4`, manchas radiales pizarra/plata y tarjetas en `rgba(240,244,249,0.54)`.
  - Superficies secundarias en `#dfe4ec` y bordes `#cbd2dc`.
  - Botones principales, chips activos y días seleccionados en gris acero `#525d70` / degradado `#5b6576 -> #3a4350`.
- **Monocromático Oscuro (*Titanium & Slate Glass*)**:
  - Fondo base `#13151a`, cristal titanio en `rgba(28..32, 31..35, 38..43, 0.42–0.50)`.
  - Superficies secundarias `#2d313b` con bordes `#383c46` / `#404552`.
  - Botones de acción en degradado grafito `#475569 -> #2f3846`.

---

## 6. Fondos Ambientales y Apariencias Temáticas

### 6.1 Fondos Básicos (duales Claro / Oscuro)
Cada tema ajusta su luminancia automáticamente entre Claro y Oscuro:
- **Predeterminado**: Manchas ambientales índigo, ámbar y cielo.
- **Brisa Índigo**: Índigo (`#6366f1`), azul cielo (`#38bdf8`) y toque ámbar cálido.
- **Luz Ámbar**: Ámbar luminoso (`#f59e0b`), coral suave (`#fb7185`) y crema/dorado oscuro.
- **Niebla Serena**: Turquesa (`#14b8a6`), cielo (`#38bdf8`) e índigo frío.
- **Noche Profunda**: Azul medianoche (`#1e1b4b`), cobalto (`#312e81`) y pizarra oscuro.
- **Lavanda Suave**: Violeta (`#a78bfa`) y magenta pastel (`#f472b6`).

### 6.2 Fondos Monocromáticos
- **Plata**: Blancos perlados y gris luminoso.
- **Titanio**: Grises medios metálicos.
- **Grafito**: Pizarra profunda y carbón.

### 6.3 "Mi foto" (Fondo personalizado)
- Renderizado en capa `#app-bg-photo` con ajuste `background-size: cover`, **punto focal X/Y configurable (`0%–100%`)**, **desenfoque ajustable (`filter`)** y capa de oscurecimiento/velo independiente (`#app-bg-scrim`).

### 6.4 Temas Especiales Oscuros (Paletas Temáticas)
Operan en modo oscuro automático con cristal ahumado, texto adaptado al tinte del tema y degradado exclusivo en el botón central:

| Tema | Base atmosférica | Tinte del cristal y borde | Texto | Degradado FAB / Botón central |
| :--- | :--- | :--- | :--- | :--- |
| **Apollo 11** | Azul cósmico `#0d122b -> #020308` | Azul noche + borde índigo `rgba(129,140,248,0.36)` | `#f8fafc` / `#cbd5e1` | Naranja -> Índigo (`#f97316 -> #4f46e5`) |
| **Maestro Dorado** | Ébano cálido `#231908 -> #080501` | Bronce ahumado + borde ámbar `rgba(245,158,11,0.40)` | `#fef3c7` / `#fde68a` | Ámbar -> Bronce (`#f59e0b -> #b45309`) |
| **Glacial Polar** | Abismo polar `#081d2e -> #01060b` | Azul hielo + borde cian `rgba(6,182,212,0.38)` | `#ecfeff` / `#a5f3fc` | Cian -> Azul (`#06b6d4 -> #0284c7`) |
| **Synthwave 1984** | Púrpura neón `#240a33 -> #07010a` | Violeta oscuro + borde magenta `rgba(236,72,153,0.38)` | `#fdf4ff` / `#f0abfc` | Magenta -> Violeta (`#ec4899 -> #8b5cf6`) |
| **Terminal Matrix** | Negro fósforo `#04160a -> #010402` | Verde oscuro + borde esmeralda `rgba(16,185,129,0.42)` | `#6ee7b7` / `#34d399` | Esmeralda (`#10b981 -> #047857`) |
| **Jardín Sakura** | Borgoña nocturno `#261118 -> #090204` | Ciruela ahumado + borde rosa `rgba(244,63,94,0.38)` | `#fff1f2` / `#fecdd3` | Rosa cerezo (`#fb7185 -> #f43f5e`) |
| **Dark Roast** | Expreso tostado `#24140b -> #080402` | Café oscuro + borde caramelo `rgba(217,119,6,0.38)` | `#fef3c7` / `#fde68a` | Caramelo -> Tostado (`#d97706 -> #78350f`) |
| **Arcade 8-Bit** | Noche retro `#171126 -> #040209` | Índigo oscuro + borde oro `rgba(234,179,8,0.42)` | `#fef08a` / `#fde047` | Dorado -> Rojo (`#eab308 -> #ef4444`) |
| **Hiperenfoque** | Zafiro profundo `#091729 -> #010408` | Azul técnico + borde cobalto `rgba(59,130,246,0.42)` | `#eff6ff` / `#bfdbfe` | Azul eléctrico (`#3b82f6 -> #1d4ed8`) |
| **Starlight Tribute** | Cosmos violeta `#1e0c2b -> #05020a` | Berenjena oscuro + borde fucsia `rgba(236,72,153,0.38)` | `#fce7f3` / `#fbcfe8` | Rosa -> Púrpura (`#ec4899 -> #a855f7`) |

---

## 7. Modales de Acceso Rápido Ultra-Traslúcidos

Los diálogos rápidos (**Calendario**, **Nueva Tarea** y **Nota Rápida**: `.calendar-glass-dialog` y `.quick-glass-dialog`) emplean un cristal más ligero y cristalino que los modales estándar para dejar ver la app detrás:

- **Backdrop muy ligero**: `rgba(15,23,42,0.10)` en Claro y `rgba(2,6,23,0.20)` en Oscuro (frente al `0.34` de modales estándar), con `blur(var(--lg-blur-backdrop)) saturate(145%)`.
- **Óptica del diálogo**:
  - Claro: `backdrop-filter: blur(26px) saturate(210%) contrast(1.03)`, fondo `rgba(255,255,255,0.16)` (`0.18` en `Normal`, `0.72` en `Suave`), reflejo diagonal superior `0.24 -> 0.08 -> 0.15` y borde `rgba(255,255,255,0.78)`.
  - Oscuro: `backdrop-filter: blur(26px) saturate(210%) brightness(1.06)`, fondo `rgba(15,23,42,0.18)` (`0.20` en `Normal`, `0.76` en `Suave`), borde `rgba(255,255,255,0.24)`.
  - Monocromático y Temáticos: bases dedicadas `0.20` que armonizan con el entorno.
- **Cabeceras y campos internos**:
  - Cabecera traslúcida (`rgba(255,255,255,0.06)` Claro / `0.03` Oscuro).
  - Campos (`input`, `select`, `textarea`) con cristal interno `blur(8px)`, fondo `rgba(255,255,255,0.45)` en Claro y `rgba(255,255,255,0.08)` en Oscuro, y anillo de foco índigo `0 0 0 3px rgba(99,102,241,0.18)`.
  - Botón **Hoy** (`#cal-today-btn`), píldoras (`.cal-glass-pill`), tarjetas de detalle (`.cal-detail-card`) y celdas del calendario (`.cal-day-cell`) con `backdrop-filter` propio (`6px–10px`), resaltando el día elegido con `rgba(99,102,241,0.24)` y borde `rgba(99,102,241,0.76)`.

---

## 8. Componentes Visuales y Geometría

### 8.1 Barras de Navegación Flotantes
- **Barra superior (`header`)**: Cápsula `rounded-full` pegajosa (`sticky`), separada del borde superior con `env(safe-area-inset-top)`. Incluye píldora de navegación desktop con indicador deslizante animado (`.nav-sliding-indicator`).
- **Barra inferior móvil (`#bottom-nav`)**: Cápsula fija flotante a `0.75rem + safe-area-inset-bottom` de los bordes, sin `overflow: hidden` para permitir que el **botón central flotante (FAB)** sobresalga `-mt-7` (`56×56px` circular con borde translúcido `2px solid rgba(255,255,255,0.55)` y pulso de resplandor cada `3.5s`).

### 8.2 Menú Lateral Deslizable (`#sidebar-drawer`)
- **Escritorio / Tablet**: Panel vertical con borde derecho redondeado (`0 1.75rem 1.75rem 0`).
- **Móvil (`<= 639px`)**: Tarjeta flotante separada `0.625rem` de todos los bordes (`width: min(84vw, 336px)`), esquinas `1.75rem` en los cuatro lados y pie integrado totalmente transparente (sin parches sólidos).

### 8.3 Controles Segmentados con Píldora de Cristal Líquido
Usado en filtros de Tareas, filtros del Baúl, selector Notas/Galería e Intensidad del Cristal:
- **Pista (`.segmented-control-track`)**: Cápsula con relleno suave (`rgba(226,232,240,0.88)` Claro / `rgba(15,23,42,0.86)` Oscuro) y sombra interior `inset 0 1px 2px`.
- **Indicador deslizante (`.segmented-glass-indicator`)**: Cápsula elevada por detrás de las etiquetas (sin `backdrop-filter`) con degradado tridimensional índigo (`rgba(67,56,202,0.96) -> rgba(79,70,229,0.94) -> rgba(55,48,163,0.98)`), paleta propia en Monocromático y los 10 temas, borde especular `::before` de `1px` y brillo curvo superior `::after`.
- **Física de viaje**: Curva elástica `cubic-bezier(0.32, 1.25, 0.4, 1)` en `~390–420ms` con estiramiento horizontal (`--seg-stretch-x: 1.08`) y compresión vertical (`--seg-squish-y: 0.93`) en el trayecto, asentando con ligero rebote. En intensidad **Suave** se acorta a `200ms` sin deformación y con brillo atenuado (`opacity: 0.35`).

### 8.4 Hojas Inferiores Móviles (`<= 639px`)
- Los modales `.mobile-bottom-sheet` se anclan abajo ocupando `100%` de ancho y `max-height: 90dvh`, esquinas superiores `1.75rem`, cuerpo con scroll interno independiente y **tirador superior (*grabber pill*)** de `40×4.5px` (`rgba(100,116,139,0.38)` Claro / `rgba(255,255,255,0.30)` Oscuro).

### 8.5 Menú Contextual por Pulsación Larga y Clon Elevado
- Al activar el menú contextual, un **clon elevado** de la tarjeta flota sobre el backdrop desenfocado con borde índigo (`1.5px`), sombra `0 26px 52px -12px rgba(15,23,42,0.36)`, transición `380ms cubic-bezier(0.32, 1.25, 0.4, 1)` y desvanecimiento inferior en máscara (`28px`) si excede el alto disponible.
- El panel de acciones entra con rebote sutil (`dynamicCardPopupBounce`, escala `0.94 -> 1.0` en `280ms`).

### 8.6 Badges, Miniaturas y Menú Desplegable de Materias
- **Insignias de categorías en Notas**: Fondos translúcidos al `12%` (Claro) / `20%` (Oscuro) con borde al `25%`: Ámbar (`Idea`), Índigo (`Apunte`), Esmeralda (`Pendiente`), Rojo (`Importante`), Púrpura (`Personal`).
- **Miniaturas bajo notas desbloqueadas (`.note-card-thumb`)**: Recuadros de `3.5rem × 3.5rem` (mínimo `44×44px` táctil), radio `0.85rem`, borde sutil y escala `1.06` al pasar el puntero; visor a pantalla completa sobre fondo `rgba(2,6,23,0.92)` con barras `blur(18px)`.
- **Desplegable inferior en Materias (`8+` materias)**: Panel `.subjects-bottom-drawer` que anima apertura mediante `grid-template-rows: 0fr -> 1fr`, opacidad, escala (`0.985 -> 1`) y rotación de chevron `180°` en `380ms cubic-bezier(0.22, 1.32, 0.36, 1)`.
- **Toasts flotantes**: Semitransparentes con blur de navegación (`--lg-blur-nav`) y tinte semántico (`Esmeralda`, `Ámbar`, `Carmesí`, `Pizarra`).

---

## 9. Tipografía y Jerarquía Visual

- **Base por defecto**: `Inter Variable` / `Inter` embebida localmente (`WOFF2`), precedida por la pila nativa (`-apple-system, BlinkMacSystemFont`), con `font-optical-sizing: auto` y suavizado subpixel (`antialiased`).
- **5 estilos principales seleccionables**: `Calibri`, `Times New Roman`, `Montserrat`, `Lora`, `Poppins` (además de variantes adicionales de alta legibilidad, monoespaciada, editorial, manuscrita y geométrica).
- **Jerarquía de títulos (`h1`)**: Peso `700`, interlineado `1.08` y tracking compacto (`-0.03em`).
- **Cifras tabulares (`font-variant-numeric: tabular-nums`)**: Aplicadas a todos los contadores, insignias numéricas, indicadores de almacenamiento y celdas de calendario para evitar saltos horizontales.
- **Zonas táctiles**: Objetivos interactivos mínimos de `44px` (`.touch-target-44`).

---

## 10. Curvas de Animación y Degradación Accesible

### 10.1 Curvas de movimiento
- `--ease-out-expo`: `cubic-bezier(0.19, 1, 0.22, 1)` (cambio de vistas y apertura de diálogos).
- `--ease-smooth`: `cubic-bezier(0.22, 1, 0.36, 1)` (hover, fondos y transiciones de opacidad).
- `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` (deslizamiento del menú lateral y hojas inferiores).
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (switches, botones, pulso táctil `.tap-effect` a `scale(0.965)`).
- `--ease-apple-spring`: `cubic-bezier(0.28, 1.24, 0.44, 1)` (chips y elementos ligeros).
- **Cascada en tarjetas (`.stagger-card`)**: Entrada con `translate3d(0, 14px, 0) scale(0.975)` y retardo escalonado de `35ms` por tarjeta (tope en el índice `8`).

### 10.2 Respaldo automático y accesibilidad
- **Sin soporte de `backdrop-filter` (`@supports not ...`)**: Todas las capas de cristal pasan automáticamente a fondos sólidos limpios (`#ffffff` Claro, `#0f172a` Oscuro, `#edf1f6` Monocromático Claro, `#252830` Monocromático Oscuro) y backdrops al `0.72`.
- **Transparencia reducida (`prefers-reduced-transparency: reduce`)**: Desactiva por completo todos los `backdrop-filter` y aplica exactamente las mismas bases sólidas de alto contraste.
- **Movimiento reducido (`prefers-reduced-motion: reduce`)**: Anula animaciones y transiciones en vistas, modales, drawer, clon elevado, indicadores deslizantes, deformación líquida, desplegables, pulsos y escalados táctiles.