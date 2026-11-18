# Informe de Análisis – Matemática Interactiva

**URL analizada:** [[https://alpa392211.github.io/Matematica-interactiva\](https://alpa392211.github.io/Matematica-interactiva)](<https://alpa392211.github.io/Matematica-interactiva](https://alpa392211.github.io/Matematica-interactiva)>)

**Fecha del análisis:** 17 de noviembre de 2026
**Analista:** Grok (xAI)

---

## 1. Resumen Ejecutivo

La plataforma es una herramienta educativa sólida, bien diseñada y **matemáticamente correcta** en lo esencial. Está orientada a Álgebra y Cálculo (límites, derivadas e integrales) con un enfoque didáctico claro, laboratorios gráficos interactivos, formularios imprimibles y un sistema de progreso gamificado.

**Veredicto general:**
- Contenido teórico: Correcto y bien estructurado.
- Graficador: Excelente precisión matemática.
- Calculadora: Funcional pero con problemas de usabilidad en la entrada de funciones.
- Experiencia móvil: Usable pero no optimizada.
- Rigor: Adecuado para nivel preuniversitario / primer año de universidad. No es superficial, pero tampoco alcanza el nivel de un texto de análisis real.

No se detectaron **errores conceptuales graves**. Sí existen simplificaciones y puntos mejorables de rigor y de experiencia de usuario.

---

## 2. Qué se analizó en profundidad vs. qué no se analizó

### Analizado a profundidad
- Página de inicio y panel de aprendizaje.
- Módulo completo de **Límites** (teoría, definición ε-δ, límites laterales, graficador).
- Módulo de **Derivadas** (definición por límites, interpretación geométrica, recta tangente).
- **Graficador interactivo** (precisión numérica, tabla de valores, derivadas, integrales definidas, detección de raíces, comportamiento con discontinuidades removibles).
- **Calculadora científica** (aritmética básica, entrada de funciones, modos DEG/RAD, historial).
- Vista en **escritorio** y **móvil** (viewport ~390 px).
- Tecnologías detectadas (KaTeX, MathLive, parser propio).

### No analizado (o solo superficialmente)
- Módulo completo de **Integrales**.
- Todos los ejercicios interactivos y evaluaciones finales.
- Formularios imprimibles / PDF (solo se verificó su existencia).
- Editor Matemático.
- Sistema de progreso, rachas y ranking a largo plazo.
- Compatibilidad con navegadores antiguos o lectores de pantalla (accesibilidad).
- Rendimiento con muchas funciones simultáneas en el graficador.
- Código fuente completo del parser matemático.

---

## 3. Errores conceptuales (incluso mínimos)

**No existen errores graves ni afirmaciones falsas.** Los puntos siguientes son debilidades de rigor o simplificaciones didácticas:

| # | Punto | Descripción | Gravedad |
|---|-------|-------------|----------|
| 1 | Definición ε-δ | Se presenta de forma correcta pero informal. Falta el lenguaje cuantificado estricto (“∀ε > 0 ∃δ > 0…”) y la dependencia explícita δ(ε). | Baja |
| 2 | Discontinuidad removable | El graficador traza la función simplificada como línea continua y solo indica “Lím = 4” en x = 2. No dibuja el hueco (círculo abierto). | Baja-Media (pedagógica) |
| 3 | Terminología histórica | Se habla de “cociente incremental de Newton-Leibniz”. Es aceptable didácticamente, pero históricamente impreciso. | Muy baja |
| 4 | Derivabilidad vs Continuidad | Se menciona, pero no se enfatiza con ejemplos claros de funciones continuas no derivables. | Baja |
| 5 | Unicidad del límite | No se destaca explícitamente que el límite, cuando existe, es único. | Muy baja |

Ninguno de estos puntos engaña al estudiante. Son oportunidades de mejora de rigor.

---

## 4. ¿Es demasiado básico o poco riguroso?

**No es demasiado básico**, pero **sí es deliberadamente introductorio**.

- **Nivel actual:** Ideal para bachillerato avanzado o primer semestre de universidad.
- **Dónde se puede subir el rigor sin perder claridad:**
  - Formalización más estricta de la definición ε-δ.
  - Demostraciones cortas de teoremas básicos de límites.
  - Clasificación explícita de discontinuidades (removible, salto, esencial).
  - Teorema del Valor Medio (al menos enunciado + interpretación).
  - Mayor conexión entre la teoría y el graficador (botones “ver este ejemplo en el graficador”).

El contenido actual es sólido y confiable. No necesita reescribirse, solo profundizarse en puntos clave.

---

## 5. Análisis de la experiencia en móvil

**Estado actual:** Usable, pero claramente “adaptado” y no “diseñado para móvil”.

**Lo que funciona bien:**
- Layout se apila verticalmente.
- Navegación con botón “Volver” correcta.
- Graficador muestra la gráfica y los controles.

**Problemas detectados:**
- Instrucciones del graficador mencionan “rueda del ratón” (no aplica en touch).
- Falta documentación/gestos de pellizco (pinch-to-zoom) y arrastre táctil.
- Botones de la calculadora demasiado densos y pequeños.
- Header y badges de racha/XP consumen espacio valioso.
- La gráfica pierde altura útil por la cantidad de controles superiores.

---

## 6. Análisis y mejora de la Calculadora

### Problema principal
El modelo de entrada es frágil. Dependiendo del orden en que se pulsen los botones (“sen” → número o número → “sen”), aparece el mensaje **“Sintaxis inválida”**.
No es un error matemático, es un problema de **usabilidad del input**.

### Recomendaciones concretas (con razones)

1. **Campo de texto libre + parser tolerante**
Razón: Los usuarios esperan poder escribir `sen(30)`, `sin 30`, `30 sen`, etc.

2. **Menú desplegable / panel de funciones** (alta prioridad)
   - Botón “Funciones” o “ƒ” que abra un menú (o bottom sheet en móvil).
   - Categorías: Trigonométricas, Exponenciales/Log, Constantes, Otras.
   - Al seleccionar una función se inserta automáticamente `sen(` o `sen(□)` con el cursor en la posición correcta.
**Razón:** Elimina la frustración de la sintaxis y hace la calculadora accesible a cualquier nivel.

3. **Usar MathLive como editor principal** (ya está cargado en la página)
Razón: Ofrece notación matemática visual real, soporte de teclado y botones, y es mucho más robusto.

4. **Comportamiento ideal**
   - Al pulsar una función → inserta paréntesis automáticamente.
   - Validación en tiempo real (subrayar en rojo la parte incorrecta).
   - Soporte de símbolo de grados (°) y conversión automática según modo DEG/RAD.
   - Historial editable (poder reutilizar y modificar expresiones anteriores).

---

## 7. Lista completa de áreas de mejora

### Alta prioridad
- Mejorar radicalmente la entrada de la calculadora (menú de funciones + MathLive).
- Optimización real para móvil (gestos táctiles, botones más grandes, menos elementos en header).
- Mostrar visualmente los huecos en discontinuidades removibles en el graficador.

### Media prioridad
- Formalizar más la definición ε-δ y la relación derivabilidad-continuidad.
- Mejorar las instrucciones del graficador (eliminar referencias exclusivas a ratón).
- Conectar teoría ↔ graficador con botones contextuales.

### Baja prioridad
- Modo oscuro.
- Atajos de teclado en escritorio.
- Mejoras de accesibilidad (lectores de pantalla).
- Expansión de la sección “Errores frecuentes”.

---

## 8. Plan de modificación recomendado

### Fase 1 – Usabilidad crítica (1–2 semanas)
1. Reemplazar el display de la calculadora por un editor **MathLive**.
2. Implementar menú desplegable / bottom sheet de funciones.
3. Hacer el parser más tolerante a diferentes formas de escribir funciones.
4. Ajustar tamaños de botones y espaciado en móvil.

### Fase 2 – Experiencia móvil y graficador (1–2 semanas)
1. Implementar gestos táctiles (pinch-to-zoom y pan) en el graficador.
2. Actualizar textos de ayuda (eliminar “rueda del ratón”).
3. Dibujar círculos abiertos en discontinuidades removibles.
4. Reducir altura del header en móvil.

### Fase 3 – Rigor y contenido (2–3 semanas)
1. Reescribir la sección de definición formal ε-δ con lenguaje cuantificado.
2. Añadir ejemplos claros de funciones continuas no derivables.
3. Clasificar explícitamente tipos de discontinuidades.
4. Añadir botones “Ver en graficador” dentro de las explicaciones teóricas.

### Fase 4 – Pulido (opcional)
- Modo oscuro.
- Mejoras de accesibilidad.
- Historial de calculadora más potente.
- Pruebas con usuarios reales.

---

## 9. Conclusión

La plataforma **Matemática Interactiva** es una herramienta de calidad, matemáticamente confiable y con una base técnica sólida (KaTeX + MathLive + parser propio).

Los problemas detectados no son de fondo conceptual, sino de **experiencia de usuario** (especialmente calculadora y móvil) y de **oportunidades de mayor rigor didáctico**.

Con las mejoras propuestas en el plan, puede pasar de ser una buena herramienta educativa a una plataforma realmente profesional y pulida.

---

**Fin del informe**