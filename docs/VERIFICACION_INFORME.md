# Verificación del Informe de Análisis (`INFORME_ANALISIS.md`)

Auditoría contrastada línea por línea contra el código fuente real del repositorio en el commit base `0fa9abc` (`respaldo-pre-mejoras`).

## 1. Resumen de Verificación de Hallazgos del Informe

| Hallazgo en `INFORME_ANALISIS.md` | Estado Real | Evidencia en el Código |
| :--- | :--- | :--- |
| **1. Definición $\varepsilon$-$\delta$ informal** (Sección 3 #1, Sección 4, Sección 8 Fase 3) | **Correcto** | `js/data/curriculum-part2.js:642` describe la idea en prosa (*"podemos hacer que los valores de f(x) estén tan cerca de L..."*) sin formalización con cuantificadores ($\forall \varepsilon > 0, \exists \delta(\varepsilon) > 0$) ni explicación de la dependencia $\delta(\varepsilon)$. |
| **2. Discontinuidad removible sin círculo abierto** (Sección 3 #2, Sección 7, Sección 8 Fase 2) | **Parcialmente correcto** | • En `js/tools/lesson-graphs.js:502-505` y `605-617` ya existe `holeAt` y dibujo de círculo abierto, pero solo dibuja el hueco en `a = state.x0` y **comete un bug en línea 606**: no comprueba `!isFinite(fa)`, por lo que dibuja un círculo blanco hueco incluso en funciones continuas (ej. `x^2 - 2*x + 1`).<br>• En `js/tools/grapher.js:588-597` y `616-625`, el círculo abierto (`isHole`) **solo se dibuja si `tangentX` coincide con el hueco**; si `tangentX` está en otra posición (por defecto `1.2`), la curva traza línea continua sin hueco visible. |
| **3. Terminología "cociente incremental de Newton-Leibniz"** (Sección 3 #3) | **Correcto (matiz menor)** | `js/data/curriculum-part3.js:33` y `85` usa `"Cociente incremental de Newton-Leibniz"`. Didácticamente comprensible, pero históricamente impreciso; conviene atribuir el cociente de diferencias / incremental y mencionar su desarrollo por Fermat, Newton y Leibniz. |
| **4. Derivabilidad vs. Continuidad sin ejemplos desarrollados** (Sección 3 #4, Sección 8 Fase 3) | **Correcto** | `js/data/curriculum-part3.js:80` solo menciona de pasada $|x|$ y $\sqrt[3]{x}$ en una tarjeta de concepto, sin cálculo explícito de derivadas laterales ni exploración gráfica interactiva para $|x|$ en `der-1`. |
| **5. Unicidad del límite no destacada explícitamente** (Sección 3 #5) | **Correcto** | Verificado mediante búsqueda en `js/data/curriculum-part2.js`: el tema `lim-1` no enuncia ni explica el teorema de unicidad del límite. |
| **6. Clasificación de discontinuidades** (Sección 4, Sección 8 Fase 3) | **Parcialmente correcto** | `js/data/curriculum-part2.js:1213` ya clasifica discontinuidades en evitable, salto finito e infinita/esencial, pero puede reforzarse explicando los casos de discontinuidad esencial (divergencia infinita vs. oscilación como $\operatorname{sen}(1/x)$). |
| **7. Teorema del Valor Medio** (Sección 4) | **Correcto (opcional)** | No se encuentra desarrollado en el currículo actual (aunque Bolzano / Valor Intermedio sí está en `curriculum-part2.js:1230`). Se priorizan los puntos pedidos explícitamente en la Fase 5. |
| **8. Botones "Ver en graficador" desde teoría** (Sección 4, Sección 7, Sección 8 Fase 3) | **Correcto** | `js/app.js:605-608` solo coloca un botón `"📈 Abrir en Graficador"` en la cabecera general del tema, pero no dentro de las tarjetas teóricas, fórmulas o ejemplos resueltos. |
| **9. Textos de ayuda mencionan "rueda del ratón" sin gestos táctiles** (Sección 5, Sección 8 Fase 2) | **Correcto** | `js/tools/grapher.js:184` dice: `"💡 Arrastra el lienzo para desplazarte y usa la rueda del ratón para hacer zoom."` |
| **10. Falta implementar pan y pinch táctil en el graficador** (Sección 5, Sección 8 Fase 2) | **Falso en `grapher.js` / Cierto en `lesson-graphs.js`** | `js/tools/grapher.js:379-421` **ya implementa** arrastre de 1 dedo (`pan`) y pellizco de 2 dedos (`pinch`), y `css/responsive.css:17` aplica `touch-action: none`. Sin embargo, `js/tools/lesson-graphs.js:336-343` solo tiene eventos de ratón (`mousedown`/`mousemove`) y carece de soporte táctil. |
| **11. Botones de calculadora densos y pequeños en móvil** (Sección 5, Sección 8 Fase 1) | **Correcto** | `css/responsive.css:808-827` comprime la cuadrícula a 6 columnas con `height: 38px; max-height: 40px;` en `<= 480px`, por debajo del mínimo táctil de `44px`. |
| **12. Header y badges consumen espacio en móvil** (Sección 5, Sección 8 Fase 2) | **Correcto** | `css/responsive.css:290-301` usa una cabecera de 2 filas que ocupa altura vertical apreciable en `390px`. |
| **13. La gráfica pierde altura útil en móvil** (Sección 5) | **Correcto** | `css/responsive.css:836-838` limita `.canvas-wrapper` a `clamp(240px, 72vw, 340px)` (~280 px en 390 px de ancho). |
| **14. Calculadora sin entrada libre ni parser tolerante (`sen(30)`, `sin 30`, `2sin(30)`)** (Sección 6) | **Falso** | `js/tools/calculator.js:46` ya usa `<input type="text" id="calc-expr-input">` editable y `js/engine/math-parser.js:141-196, 353-358` ya soporta `sen(30)`, `sin 30` y `2sin(30)`. Lo que **sí** falla realmente es:<br>• Falta soporte de `°` (`calculator.js` y `math-parser.js`).<br>• El `catch` de `js/tools/calculator.js:171` muestra siempre `"Sintaxis inválida"` ocultando `err.message`.<br>• Los botones concatenan al final (`+=`) en `calculator.js:196, 224`.<br>• `⌫` borra un solo carácter al final (`slice(0, -1)` en `calculator.js:210`).<br>• No cierra paréntesis automáticamente.<br>• Falta panel categorizado de funciones / bottom sheet en móvil.<br>• El historial no distingue entre editar expresión e insertar resultado en el cursor. |
| **15. Recomienda migrar la calculadora a MathLive** (Sección 6 #3, Sección 8 Fase 1) | **Descartado por restricción de arquitectura** | El proyecto mantiene `<input type="text">` en la calculadora y mejora la edición por cursor, tokens completos y panel de funciones (MathLive ya se usa en ejercicios y editor). |
| **16. Falta modo oscuro y mejoras de accesibilidad / teclado** (Sección 7, Sección 8 Fase 4) | **Correcto** | `css/variables.css` solo define tema claro y faltan `aria-modal`, `role="tablist"`, `:focus-visible` consistente y soporte de teclado en tarjetas clicables. |

---

## 2. Verificación de Archivos Duplicados
- Se inspeccionó la raíz del proyecto y las referencias de `index.html`.
- No existen copias `.js` o `.css` en la raíz; únicamente se encuentran `index.html`, `README.md`, `INFORME_ANALISIS.md`, `DISENO_LIQUID_GLASS.md`, `iniciar-servidor.bat` y `servidor.ps1`.
- Todas las etiquetas `<link>` y `<script>` locales de `index.html` apuntan exclusivamente a `css/*.css` y `js/**/*.js`.

---

## 3. Hallazgos Adicionales Detectados en Auditoría Directa
1. **Propiedades inconsistentes en Temas Pendientes del Dashboard (`js/app.js:414` vs `js/engine/storage.js:237-238`)**:
   - `storage.js` devuelve `{ exDone, exTotal }` en cada elemento de `pendingTopics`, pero `app.js` renderiza `Ejercicios: ${pt.solvedCount}/${pt.totalCount}`, lo que produce `Ejercicios: undefined/undefined`.
2. **Clases CSS inexistentes en tarjetas de Errores Frecuentes (`js/app.js:772, 776, 902, 906` vs `css/components.css:930, 939`)**:
   - `app.js` usa `.mistake-correct` y `.mistake-why`, mientras `css/components.css` define `.mistake-right` y `.mistake-advice`. Como consecuencia, las tarjetas de errores frecuentes pierden el fondo verde y el estilo tipográfico de la explicación.
3. **Estilos en línea en plantillas JS**:
   - Múltiples componentes (`app.js`, `calculator.js`, `grapher.js`, `lesson-graphs.js`) tienen atributos `style="..."` estáticos que dificultan adaptar colores al tema oscuro.
