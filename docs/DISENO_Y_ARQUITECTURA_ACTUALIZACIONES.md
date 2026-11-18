# Diseño Visual y Arquitectura de Actualizaciones — MateTic (ALPA Studio)

Este documento describe de forma integral el sistema de diseño visual, los tokens cromáticos, las animaciones e interacciones en tiempo real, y la arquitectura funcional incorporada en **MateTic** (*Matemáticas Interactivas*, desarrollado por **ALPA Studio**) desde su rediseño **Liquid Glass** hasta la versión **v1.4.1**.

---

## 1. Sistema Visual Liquid Glass y Transparencia Sutil

El diseño se centraliza en [css/variables.css](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/css/variables.css) siguiendo el principio de **jerarquía óptica por capas**: únicamente las superficies flotantes principales (barra superior `.top-header`, barra lateral `.sidebar`, ventanas modales y buscador) utilizan `backdrop-filter`, mientras que las tarjetas repetidas, fórmulas KaTeX y lienzos `<canvas>` evitan el desenfoque costoso para preservar fluidez en dispositivos móviles y nitidez matemática.

### Parámetros ópticos base (Modo Normal)
- `--lg-blur-nav: 28px`, `--lg-sat-nav: 190%`
- `--lg-blur-panel: 20px`, `--lg-sat-panel: 175%`
- `--lg-blur-modal: 32px`, `--lg-blur-backdrop: 15px`
- `--lg-sheen-opacity: 0.72`

### Transparencia sutil global de tarjetas y paneles
Para permitir que la atmósfera ambiental y el fondo matemático animado se perciban discretamente sin sacrificar contraste WCAG AA (`>= 4.5:1`):
- **Modo Claro**: `--bg-surface: rgba(255, 255, 255, 0.75)`, `--bg-surface-solid: rgba(255, 255, 255, 0.80)`, `--bg-surface-alt: rgba(241, 245, 249, 0.72)`.
- **Modo Oscuro**: `--bg-surface: rgba(15, 23, 42, 0.72)`, `--bg-surface-solid: rgba(15, 23, 42, 0.78)`, `--bg-surface-alt: rgba(30, 41, 59, 0.68)`.
- **Respaldo de accesibilidad**: bajo `@media (prefers-reduced-transparency: reduce)` o `@supports not (backdrop-filter: blur(1px))`, los fondos conmutan automáticamente a colores sólidos opacos (`#ffffff` / `#111827`).

---

## 2. Menú Lateral en Píldoras Discretas

En [css/layout.css](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/css/layout.css), cada botón del menú lateral (`.nav-item`) adopta geometría de cápsula completa (`border-radius: 9999px`) con bordes discretos constantes e insignias circulares para cada icono (`.nav-icon`):
- **Tokens en modo claro**: `--lg-pill-idle-bg: rgba(255, 255, 255, 0.46)`, `--lg-pill-idle-border: rgba(15, 23, 42, 0.11)`, `--lg-pill-idle-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 2px 6px rgba(15, 23, 42, 0.04)`.
- **Tokens en modo oscuro**: `--lg-pill-idle-bg: rgba(255, 255, 255, 0.048)`, `--lg-pill-idle-border: rgba(255, 255, 255, 0.11)`, `--lg-pill-idle-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 8px rgba(2, 6, 23, 0.28)`.
- **Estados activo y hover**: refuerzan borde especular (`--lg-pill-active-bg` / `--lg-pill-active-border`) y desplazamiento suave horizontal con transición elástica.

---

## 3. Catálogo de 6 Fondos (3 Claros + 3 Oscuros), Bloqueo por Modo y Constelaciones

### Atributos y Persistencia
- Los fondos se aplican en `<html>` mediante `data-bg-light` y `data-bg-dark`, almacenados dentro de la preferencia unificada `matematica_interactiva_preferencias_v1` en [js/engine/haptics.js](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/js/engine/haptics.js) (`lightBgPreset` y `darkBgPreset`).
- **Reglas de bloqueo en Ajustes (`applySavedBgPresets` en [js/app.js](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/js/app.js))**:
  - **Modo Claro fijo**: habilita los 3 fondos claros y deshabilita los 3 fondos oscuros con el aviso `#settings-bg-dark-notice` (`"🔒 Bloqueado en modo Claro..."`).
  - **Modo Oscuro fijo**: habilita los 3 fondos oscuros y deshabilita los 3 fondos claros con el aviso `#settings-bg-light-notice` (`"🔒 Bloqueado en modo Oscuro..."`).
  - **Modo Automático**: permite elegir en ambos grupos y muestra en el grupo actualmente inactivo un aviso informativo animado (`.is-auto-notice` / `.is-notice-flash`) aclarando que el cambio se visualizará cuando el dispositivo cambie de modo.

### Paletas de Fondo

| Modo | ID | Nombre UI | `--bg-body` | Halos `--lg-ambient-1/2/3` | Paleta en Canvas (`AmbientBackground`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Claro | `cristal` | Índigo Cristal | `#e6ebf5` | Índigo / Ámbar / Lavanda | `#1e3a8a`, `#3730a3`, `#0f766e` |
| Claro | `esmeralda` | Brisa Esmeralda | `#dff0ea` | Esmeralda / Cielo / Verde | `#047857`, `#0284c7`, `#0f766e` |
| Claro | `aurora` | Aurora Cálida | `#efe7f3` | Rosa / Ámbar / Índigo | `#9d174d`, `#b45309`, `#4338ca` |
| Oscuro | `cosmos` | Cosmos | `#070b15` | Índigo / Ámbar / Violeta | `#93c5fd`, `#a5b4fc`, `#67e8f9` |
| Oscuro | `abismo` | Boreal Cian | `#041219` | Cian / Esmeralda / Azul | `#67e8f9`, `#34d399`, `#60a5fa` |
| Oscuro | `nebulosa` | Nebulosa | `#11081b` | Púrpura / Rosa / Índigo | `#f0abfc`, `#fda4af`, `#a5b4fc` |

### Fondo Matemático Animado ([js/engine/ambient-bg.js](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/js/engine/ambient-bg.js))
- Combina respiración ambiental CSS (`@keyframes lgAmbientAura` de 18s en `body::before`) con un lienzo 2D de 3 planos de profundidad (`DEPTH_LAYERS`), `22` símbolos y expresiones (`π`, `∫`, `∑`, `eⁱπ+1=0`, `∀ε>0`, `∇×F`, `∂y/∂x`, `ℝⁿ`, etc.), límites estrictos de densidad (`<= 14` en móvil, `<= 28` en escritorio) y opacidad sutil (`0.06` a `0.132`), rotación suave, pulso de escala y líneas conectoras tipo constelación entre partículas cercanas del mismo plano.

---

## 4. Ventana Promocional NUMERUS CAS

- **Acceso**: botón dedicado `#btn-sidebar-numerus-cas` (*Calculadora con Álgebra Computacional*) en el menú lateral.
- **Modal (`#numerus-cas-modal`)**: diseñado en [index.html](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/index.html) y [css/components.css](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/css/components.css), excluido en impresión (`css/print.css`) y adaptado nativamente tanto al **modo claro** (superficie translúcida luminosa, encabezado índigo-real Liquid Glass, texto oscuro de alto contraste y caja Ko-fi cálida) como al **modo oscuro** (zafiro nocturno con reflejos dorados), con un único botón de cierre (`#btn-close-numerus-cas`) en la cabecera.
- **8 Módulos con Iconografía SVG Bicolor (Blanco `#f8fafc` y Dorado `#eab308`)**:
  1. `Calculadora`
  2. `Cálculo`
  3. `Gráficas`
  4. `Ecuaciones`
  5. `Matrices`
  6. `Estadística`
  7. `Tablas`
  8. `Probabilidad`
- **Animación de levitación**: cada tarjeta `.numerus-module-btn` flota con `@keyframes numerusLevitate` (`3.4s` con desfases escalonados) y sombra inferior pulsante (`@keyframes numerusShadowPulse`), actualizando al instante el panel descriptivo `#numerus-module-preview`.
- **Apoyo Ko-fi**: enlace `#btn-numerus-kofi` dirigido exclusivamente a `https://ko-fi.com/edrx_ngl` (único destino externo permitido en el código servido).

---

## 5. Animaciones Dinámicas y Selector Líquido en Tiempo Real en PrepMat

### Físicas de Botones y Deslizamiento Líquido ([css/tools.css](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/css/tools.css) y [js/tools/prepmat.js](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/js/tools/prepmat.js))
- **Configuración de examen en tiempo real (`.prepmat-segmented` + `.prepmat-seg-glider`)**: al alternar entre botones de Nivel Académico, Modalidad, Longitud de Evaluación y Estilo de Reactivos, no se reconstruye el DOM completo; el deslizador `.prepmat-seg-glider` calcula las coordenadas de destino (`offsetLeft`, `offsetTop`, `offsetWidth`, `offsetHeight`) y se traslada mediante `translate3d` con curva elástica `cubic-bezier(0.22, 1.28, 0.36, 1)` acompañada de estiramiento fluido (`@keyframes prepmatLiquidStretch`) hacia la opción adyacente.
- **Opciones de respuesta en examen activo (`.prepmat-options-grid` + `.prepmat-opt-glider`)**: elegir opciones A/B/C/D mediante clic o teclado (`1–4` / `A–D`) desliza el indicador líquido directamente sobre la cuadrícula 2×2 sin recargar la tarjeta del reactivo.
- **Accesibilidad**: todas las transiciones y deformaciones líquidas se desactivan automáticamente bajo `@media (prefers-reduced-motion: reduce)`.

---

## 6. Arquitectura de Evaluación (PrepMat) y Cobertura Curricular

- **PrepMat (`window.MatInteractiva.PrepMatTool`)**:
  - **9 ramas temáticas**: Aritmética, Álgebra, Geometría Euclidiana, Trigonometría, Geometría Analítica, Funciones, Cálculo Diferencial, Cálculo Integral y Series, y Álgebra Lineal y EDO.
  - **Diferenciación académica**: fábricas y curva de dificultad diferenciadas para **Bachillerato** y **Licenciatura**.
  - **Problemas de enunciado**: **54 generadores parametrizados nuevos** (`6` por cada una de las 9 ramas), registrados en `WORD_PROBLEM_METHODS` junto con el filtro **4. Estilo de Reactivos** (`Mixto`, `📖 Enunciado`, `⚡ Directo`) e insignia `.prepmat-meta-pill-word`.
  - **Almacenamiento aislado**: estadísticas, racha y memoria anti-repetición persistidas en `matetic_prepmat_v1`, bonificando XP en `window.MatInteractiva.Storage` al concluir evaluaciones sin alterar `matematica_interactiva_progreso_v1`.
- **Currículo de Estudio (`js/data/curriculum-part1..3.js`)**:
  - **9 materias / 24 temas**, todos ampliados a un mínimo de **`>= 5` ejercicios por tema** incorporando problemas de enunciado contextualizados en física, ingeniería, economía y biología, validados numérica y simbólicamente con `MathParser.checkStudentAnswer`.

---

## 7. Políticas Técnicas, PWA Offline y Pruebas

- **Cero peticiones externas**: KaTeX (`0.16.9`) y MathLive (`0.101.2`) residen localmente en `vendor/`; todo el contenido es 100 % offline excepto el botón Ko-fi explícito (`https://ko-fi.com/edrx_ngl`).
- **Fuente única de versión**: [js/version.js](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/js/version.js) alimenta UI, historial de novedades y caché del Service Worker [sw.js](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/sw.js) junto con [js/precache-manifest.js](file:///c:/Users/user/Documents/PROYECTOS%20ANTIGRAVITY/Matematica-Interactiva/js/precache-manifest.js).
- **Suite de pruebas (`node --test tests/`)**: cubre parser matemático, resolvedor paso a paso, animaciones demostrativas, graficador móvil, consistencia de marca y versión, auditoría offline/PWA, preferencias de fondo y generación integral de PrepMat.
