# Plan Maestro de Implementación — Ronda 2 (Fases 7 a 13) — MateTic (antes Matemática Interactiva)

Generado de acuerdo con las reglas del proyecto (*MateTic*, anteriormente *Matemática Interactiva*: sitio estático en JavaScript puro, namespace `window.MatInteractiva`, sin build ni dependencias externas nuevas) tomando como base el estado etiquetado como `respaldo-pre-ronda2` (`7b827aa`).

## Invariantes de toda la Ronda 2
- Respuestas, comentarios en código, interfaz y commits en **español**.
- Trabajo **100 % local** en Git (`master`), sin push, pull ni remotos; etiqueta `respaldo-pre-ronda2` inmutable.
- Sin cambios en la clave ni esquema de `matematica_interactiva_progreso_v1` ni de `matematica_interactiva_tema_v1`.
- Preferencias nuevas (`hapticsEnabled`, `ambientBgEnabled`) guardadas en una sola clave separada: `matematica_interactiva_preferencias_v1`, siempre con `try/catch`.
- Los temas nuevos (si se agregaran) o ampliaciones conservan intactos todos los `id` de materias y temas existentes.
- Cero `backdrop-filter` sobre tarjetas repetidas, fórmulas KaTeX o lienzos (`canvas`).
- Cero estilos en línea nuevos; uso estricto de clases CSS.
- Respeto total de `prefers-reduced-motion` y contraste WCAG AA (`>= 4.5:1`).
- En `css/print.css`: ocultación de elementos interactivos nuevos, fondo animado, botón Ko-fi e interruptores de preferencias.

---

## Fases

1. **Fase 7 — Móvil, háptica y Ko-fi**
   - Reorganización de la cabecera móvil (`<= 640px`, probado en 360 / 390 / 430 px): separación limpia del buscador central y reubicación del cambio de tema en la fila inferior junto a Volver, racha y XP, con áreas táctiles `>= 44px`.
   - Módulo único `js/engine/haptics.js` (`window.MatInteractiva.Haptics`) sobre `navigator.vibrate`, limitado a dispositivos táctiles (`pointer: coarse`), desactivado ante `prefers-reduced-motion`, con patrones diferenciados (`light`, `confirm`, `correct`, `incorrect`, `achievement`) e interruptor `"Vibración"` guardado en barra lateral.
   - Botón `"☕ Apóyame en Ko-fi"` (`https://ko-fi.com/edrx_ngl`, `target="_blank" rel="noopener noreferrer"`) en `.sidebar-footer`, degradado coral accesible AA (`>= 4.5:1`), `>= 44px` de alto, visible en escritorio y drawer móvil, oculto al imprimir.

2. **Fase 8 — Fondo animado ambiental**
   - Módulo `js/engine/ambient-bg.js` (`window.MatInteractiva.AmbientBackground`) renderizando sobre `#ambient-math-canvas` fijo (`pointer-events: none; aria-hidden="true"; z-index: 0`).
   - Símbolos y fórmulas matemáticas flotantes suaves con baja opacidad (`0.06` a `0.12`), 3 planos de profundidad, máximo 14 elementos en móvil y 28 en escritorio, pausa automática con `visibilitychange`, respaldo estático con `prefers-reduced-motion`, interruptor `"Fondo animado"` en la barra lateral y ocultación en `print.css`.

3. **Fase 9 — Nuevo índice de inicio y mapa curricular**
   - Rediseño de `navigateToDashboard()` generado dinámicamente desde `window.MatInteractiva.Curriculum`:
     - Tarjeta de continuación ("Continuar donde lo dejaste") y barra global de progreso.
     - Rutas sugeridas con prerrequisitos visibles (Base y Pre-Cálculo / Cálculo Diferencial e Integral).
     - Mapa completo de las 9 materias y sus 24 temas con filtro de texto y por bloque; acordeones colapsables de 1 columna en móvil y cuadrícula de 2-3 columnas con detalle en laptop (`>= 1024px`).
     - Accesos directos a herramientas y formularios.
   - Índice interno de secciones y salto rápido dentro de cada materia/lección.

4. **Fase 10 — Animaciones demostrativas NO interactivas**
   - Componente reutilizable `js/tools/demo-animations.js` (`window.MatInteractiva.DemoAnimations`) con separación estricta entre modelo numérico puro (`evaluateAnimationModel`) y dibujo en `canvas` HD (`devicePixelRatio`).
   - Solo controles de reproducción (`Reproducir/Pausar`, `Reiniciar`) y barra de progreso (sin sliders, inputs ni arrastre). Arranque y pausa automática mediante `IntersectionObserver`; estado final estático con explicación completa cuando `prefers-reduced-motion` está activo.
   - Animaciones integradas en Límites (aproximación con tabla y hueco, salto + infinito, banda $\varepsilon$-$\delta$), Derivadas (razón promedio, secante $\to$ tangente, construcción de $f'$, velocidad instantánea, no derivabilidad $|x|$ y $\sqrt[3]{x}$) e Integrales (sumas de Riemann). Pruebas unitarias en `tests/demo-animations.test.js`.

5. **Fase 11 — Profundización en razón de cambio y función derivada**
   - Bloque estructurado de Teoremas y Demostraciones (`th.theorems`, colapsable en móvil y expandido en laptop) en `js/app.js`.
   - Ampliación exhaustiva y rigurosa en `js/data/curriculum-part3.js` (`der-1` a `der-4`): razones promedio/instantánea con aplicaciones interdisciplinarias, definición por $h \to 0$ y $x \to a$, derivadas laterales, notaciones, recta tangente/normal y diferencial, teorema derivable $\implies$ continuo con demostración y contraejemplo, catálogo completo de no derivabilidad, derivación paso a paso desde definición ($c, x, x^2, x^n, 1/x, \sqrt{x}, \sin x, e^x$), reglas con demostración breve y monotonía / puntos críticos.
   - Verificación numérica/simbólica automatizada en `tests/curriculum-math-verification.test.js` y registro completo en `docs/CAMBIOS_CONTENIDO.md`.

6. **Fase 12 — Rigor y ejemplos en el resto de materias**
   - Ampliación de ejemplos resueltos, hipótesis explícitas de fórmulas y teoremas con demostración breve en `js/data/curriculum-part1.js`, `js/data/curriculum-part2.js` y el resto de `js/data/curriculum-part3.js` (priorizando Límites, Integrales, Cálculo y Álgebra).
   - Verificación de resultados en `tests/curriculum-math-verification.test.js` y registro en `docs/CAMBIOS_CONTENIDO.md`.

7. **Fase 13 — Móvil vs. laptop, pulido y verificación**
   - Desplazamiento horizontal contenido en fórmulas KaTeX largas, demostraciones colapsables en móvil vs. abiertas con figuras en columnas en laptop (`>= 1024px`).
   - Foco visible y teclado en todos los controles nuevos.
   - Verificación headless con Chromium en `360`, `390`, `430`, `768`, `1280` y `1440 px` (claro y oscuro), capturas en `docs/capturas/`, auditoría de rendimiento y `node --test tests/`.
