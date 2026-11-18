# Plan de Mejoras y Rediseño por Fases — MateTic (antes Matemática Interactiva)

Este documento recoge el plan de trabajo autónomo dividido en 7 fases (Fase 0 a Fase 6), ejecutado de forma continua en entorno local sin dependencias externas en runtime.

## Principios y Reglas
- **Stack**: HTML5, CSS3 modular y JavaScript puro (`window.MatInteractiva`), sin frameworks ni bundlers.
- **Idioma**: Respuestas, código, comentarios, documentación y commits en español.
- **Control de versiones local**: Repositorio Git local con etiqueta `respaldo-pre-mejoras` sobre el estado original y un commit descriptivo al cierre de cada fase (`Fase N: <resumen>`).
- **Alcance de edición**: Únicamente `js/`, `css/`, `index.html`, `README.md`, `tests/` y `docs/`.
- **Seguridad matemática**: Pruebas de caracterización en `tests/` con `node --test` antes de modificar el motor matemático.

---

## Fase 0 — Limpieza, Red de Seguridad y Verificación del Informe
1. Inicializar repositorio Git local, crear commit `"Respaldo previo a mejoras"` y etiqueta `respaldo-pre-mejoras`.
2. Verificar la existencia de duplicados en la raíz y las referencias de `index.html`.
3. Organizar documentación en `docs/`: `PLAN.md`, `DECISIONES.md`, `VERIFICACION_INFORME.md`, `CAMBIOS.md` y copias de referencia de `INFORME_ANALISIS.md` y `DISENO_LIQUID_GLASS.md`.
4. Crear la suite de caracterización en `tests/math-parser.test.js` cubriendo `evaluate`, derivación, integración, búsqueda de raíces, `checkStudentAnswer` y `StepSolver`.
5. Actualizar `README.md` con instrucciones para ejecutar las pruebas (`node --test tests/`) y levantar el servidor local (`python3 -m http.server 8000` / `python -m http.server 8000`).

## Fase 1 — Fundación de Diseño Liquid Glass
1. Incorporar en `css/variables.css` las variables del lenguaje visual Liquid Glass (paleta claro/oscuro, atmósfera ambiental, desenfoque y saturación de modo Normal, velos protectores, borde especular de 1px, sombras de elevación y curvas de animación).
2. Implementar fallbacks de accesibilidad (`@supports not backdrop-filter`, `prefers-reduced-transparency`, `prefers-reduced-motion`).
3. Añadir interruptor de tema claro/oscuro en la cabecera (`index.html` + `js/app.js`), siguiendo `prefers-color-scheme` por defecto y persistiendo la elección manual en una clave nueva de `localStorage` (`matematica_interactiva_tema_v1`) sin alterar la clave de progreso.
4. Aplicar el sistema Liquid Glass a las capas flotantes: `.top-header`, `.sidebar`, `.search-results-dropdown` y `.quick-modal-window` / `.quick-modal-backdrop`.

## Fase 2 — Calculadora Científica
1. Mejorar `js/engine/math-parser.js` para soportar el símbolo `°` según el modo `DEG`/`RAD`, añadir `autoCloseParens()` y refinar los mensajes de error específicos en español.
2. Añadir utilidades puras y testeables de edición por cursor (`insertAtCursor` y `deleteTokenBeforeCursor` para borrar tokens completos como `sin(`, `arcsen(`, `sqrt(`).
3. Actualizar `js/tools/calculator.js` conservando `<input type="text">` (sin migrar a MathLive):
   - Inserción en la posición del cursor.
   - Borrado inteligente de tokens con `⌫`.
   - Cierre automático de paréntesis al evaluar.
   - Mensajes de error específicos del parser en lugar de `"Sintaxis inválida"`.
   - Botón `°` y panel categorizado de funciones (desplegable en escritorio y *bottom sheet* en móvil).
   - Historial editable y reutilizable (cargar expresión o insertar resultado en el cursor).
   - Botones con altura táctil `>= 44px` en móvil.
4. Añadir pruebas unitarias para las nuevas reglas.

## Fase 3 — Experiencia Móvil y Graficador
1. Implementar `findRemovableDiscontinuities` en `js/engine/math-parser.js` con pruebas unitarias.
2. Completar el dibujo de huecos (círculos abiertos) en `js/tools/grapher.js` y `js/tools/lesson-graphs.js`, corrigiendo el falso círculo abierto sobre funciones continuas en `lesson-graphs.js`.
3. Añadir gestos táctiles al canvas de `js/tools/lesson-graphs.js` y actualizar el texto de ayuda en `js/tools/grapher.js` para reflejar arrastre y pellizco táctil.
4. Compactar la cabecera móvil y optimizar la altura útil del canvas en `css/responsive.css`.

## Fase 4 — Rediseño Liquid Glass del Resto de la App
1. Extender el sistema visual Liquid Glass (modo claro y oscuro) a tarjetas de materias, dashboard, lecciones, fórmulas KaTeX, ejercicios, buscador, panel de progreso y herramientas interactivas, reservando `backdrop-filter` exclusivamente a capas flotantes.
2. Corregir los hallazgos adicionales de UI (`pt.exDone`/`pt.exTotal` en `js/app.js` y clases `.mistake-correct`/`.mistake-why` en `css/components.css`).
3. Migrar estilos en línea estáticos de las plantillas modificadas a clases CSS.
4. Verificar que `css/print.css` conserve una impresión limpia en papel blanco sin blur ni fondos oscuros.

## Fase 5 — Rigor Didáctico y Conexión Teoría ↔ Graficador
1. Formalizar la definición $\varepsilon$-$\delta$ con cuantificadores ($\forall \varepsilon > 0, \exists \delta(\varepsilon) > 0$) y añadir el teorema de unicidad del límite en `js/data/curriculum-part2.js` (`lim-1`).
2. Refinar la clasificación explícita de discontinuidades (evitable, salto finito y esencial) en `lim-4`.
3. Mejorar la precisión histórica de la terminología en `js/data/curriculum-part3.js` (`der-1`) y añadir ejemplos claros y verificables de funciones continuas no derivables ($|x|$, $x^{2/3}$, $\sqrt[3]{x}$).
4. Integrar botones `"Ver en graficador"` directamente dentro de explicaciones teóricas y ejemplos resueltos.
5. Registrar cada cambio textual con archivo, línea, antes y después en `docs/CAMBIOS_CONTENIDO.md`.

## Fase 6 — Pulido Final y Verificación Visual
1. Reforzar navegación por teclado, estilo `:focus-visible`, gestión de `Escape` y atributos ARIA en diálogos, pestañas, buscador y tarjetas interactivas.
2. Verificar contraste WCAG AA (`>= 4.5:1`) y rendimiento de `backdrop-filter`.
3. Levantar servidor local y capturar vistas en `390px` y `1280px` (modo claro y modo oscuro) en `docs/capturas/`.
4. Completar `docs/CAMBIOS.md` con todos los hashes y entregar resumen final con comandos de reversión.
