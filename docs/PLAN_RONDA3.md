# Plan de Ejecución — Ronda 3 (Fases 14 a 22): MateTic v1.2.3

Base de inicio: etiqueta local `respaldo-pre-ronda3` (`4b380f2`).
Versión objetivo final: `1.2.3` (`2026-11-17`), publicada por `ALPA Studio`.

## Invariantes de Arquitectura y Datos
- Sitio estático sin frameworks, sin bundlers y sin dependencias npm en tiempo de ejecución.
- Namespace interno conservado: `window.MatInteractiva`.
- Claves y formatos de `localStorage` conservados:
  - `matematica_interactiva_progreso_v1`
  - `matematica_interactiva_tema_v1`
  - `matematica_interactiva_preferencias_v1` (solo se añaden campos nuevos con tolerancia retroactiva a claves antiguas).
- Accesibilidad WCAG AA, controles con área táctil `>= 44 px`, foco `:focus-visible`, diálogos con `role="dialog"`, `aria-modal="true"`, foco atrapado, cierre con `Escape` y retorno de foco, respeto a `prefers-reduced-motion`, cero `backdrop-filter` en tarjetas repetidas/listas/canvas/fórmulas, y ocultación limpia en `css/print.css`.
- Trabajo 100 % local en Git con commits de cierre por fase (`"Fase N: <resumen>"`).

## Fases
- **Fase 14 — Versionado único y política automática**: `js/version.js` (compatible con ventana y Service Worker vía `globalThis`), `docs/POLITICA_VERSIONES.md`, `AGENTS.md`, `scripts/bump-version.mjs`, carga previa en `index.html`, derivación de caché en `sw.js` + `js/precache-manifest.js`, y `tests/version-consistency.test.js`.
- **Fase 15 — Renombrado integral a MateTic**: sustitución de textos visibles, títulos, metadatos, formularios imprimibles, cabeceras de archivos, `README.md` y encabezados documentales a **MateTic** (*Matemáticas Interactivas*), leyendo `APP_NAME`/`APP_TAGLINE` desde `js/version.js` y validado por `tests/branding.test.js`.
- **Fase 16 — Funcionamiento sin internet (`vendor/`)**: empaquetado local de `katex@0.16.9` y `mathlive@0.101.2` en `vendor/` (solo `.woff2`, licencias MIT y `vendor/VENDOR.md` con SHA-256), configuración de rutas relativas y desactivación de sonidos externos en `js/engine/math-input.js`, reemplazo en `index.html`, prueba estática `tests/no-external-requests.test.js` y prueba en Chromium headless bloqueando toda petición fuera de `localhost`/`127.0.0.1`.
- **Fase 17 — Panel de Ajustes y optimización del header móvil**: traslado de interruptores al diálogo/bottom sheet `"⚙️ Ajustes"` al final de la barra lateral, selector de tema (`Automático / Claro / Oscuro`), interruptor `showThemeButton`, restablecimiento seguro de preferencias sin tocar el progreso, y ocultación visual accesible (`.header-breadcrumb` con patrón `visually-hidden`) en `< 768 px` manteniendo idéntico `>= 768 px`.
- **Fase 18 — Aviso emergente de actualización por versión**: función pura de resolución de notas en `js/version.js`, diálogo único por versión en `#whats-new-modal` con soporte hasta 3 versiones saltadas, manejo seguro ante fallos de `localStorage` o diálogos concurrentes, y pruebas unitarias.
- **Fase 19 — Avisos discretos de precisión numérica**: bloque `<details>` cerrado por defecto (`"ⓘ Resultados aproximados"`) en el graficador, calculadora completa, calculadora rápida y un aviso compartido por lección con gráfica, redactados estrictamente según la implementación real de `math-parser.js`, `grapher.js` y `lesson-graphs.js`.
- **Fase 20 — PWA instalable y sin conexión**: generación local de íconos `"∫π"` (`192`, `512`, `maskable 512`, `apple-touch-icon 180`), `manifest.webmanifest`, `scripts/update-precache.mjs`, `js/precache-manifest.js`, `sw.js` completo (precache atómico, limpieza de cachés antiguos, *network-first* para código propio y *cache-first* para `vendor/` e íconos), botón `"Instalar aplicación"`, estado offline en Ajustes, `tests/pwa-offline.test.js` y verificación offline real en Chromium headless.
- **Fase 21 — Gráficas interactivas en móvil**: diagnóstico con capturas verticales (`360/390/430 px`) y horizontales (`667×375 px`), separación de gestos (`1` dedo desplaza la página en embebido; `2` dedos pan/zoom; modo `"⛶ Expandir"` con `1` dedo pan y `2` dedos zoom + `Escape`), paso adaptativo de rejilla/etiquetas, paleta claro/oscuro AA en canvas, controles compactos debajo del gráfico con objetivos `>= 44 px`, barra fija de lectura sin tapar con el dedo, pista única inicial de gestos y `tests/graph-mobile.test.js`.
- **Fase 22 — Integración, versión final `1.2.3` y verificación integral**: regeneración del precache, ejecución completa de `node --test tests/`, matriz de capturas `r3-*` (`360–1440 px` + `667×375 px`), pruebas de teclado/foco/impresión/preferencias antiguas/offline final, revisión visual y cierre en `docs/CAMBIOS.md`.
