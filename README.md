# MateTic — Matemáticas Interactivas (`∫π`)

Plataforma web educativa completa, moderna e interactiva de **ALPA Studio** especializada en el aprendizaje riguroso y progresivo de las matemáticas en español, con orientación avanzada hacia el **Álgebra para el Cálculo** y el **Cálculo Diferencial e Integral**.

## Características Principales

1. **Representación Matemática Profesional (KaTeX + Motor Recursivo de Llaves Balanceadas)**:
   - Integración de **KaTeX** junto con un analizador recursivo nativo (`parseLatexRecursive`) en `js/engine/math-renderer.js` que garantiza tipografía matemática limpia con y sin conexión a internet.
   - Renderizado exacto de fracciones anidadas, raíces con barra superior extensible, límites con subíndices, integrales definidas e indefinidas, derivadas en notación de Lagrange y de Leibniz, sumatorias, sistemas por partes (`cases`) y matrices (`pmatrix`).
   - Conversión automática de expresiones algebraicas naturales a notación tipográfica (`algebraicToLatex` y `renderUserExpression`).

2. **Estructura Didáctica de 9 Etapas en los 24 Temas**:
   Cada lección sigue un orden pedagógico riguroso:
   1. **Introducción**: Qué es el concepto y para qué sirve.
   2. **Conocimientos previos necesarios**: Prerrequisitos algebraicos y geométricos.
   3. **Explicación teórica detallada**: Desarrollo progresivo desde cero.
   4. **Fórmulas y propiedades fundamentales**: Con restricciones de dominio y casos especiales.
   5. **Interpretación gráfica interactiva**: Laboratorio visual embebido directamente en la lección.
   6. **Ejemplos resueltos paso a paso**: Con justificación matemática en cada transformación.
   7. **Errores frecuentes y cómo evitarlos**: Comparativa entre procedimientos incorrectos y correctos.
   8. **Ejercicios de práctica interactivos**: Con vista previa matemática en vivo, teclado de inserción simbólica, pistas progresivas y diagnóstico detallado de errores.
   9. **Evaluación final del tema**: Comprobación conceptual y analítica con retroalimentación.

3. **9 Módulos Curriculares Completos (24 Temas y 73 Ejercicios Interactivos)**:
   - **Aritmética**: Números reales, jerarquía de operaciones, leyes de exponentes, radicales, MCD, MCM y fracciones.
   - **Álgebra (Preparación para Límites y Cálculo)**:
     - **Factorización completa**: Factor común, agrupación, diferencia de cuadrados, trinomio cuadrado perfecto, trinomios $x^2+bx+c$ y $ax^2+bx+c$, suma y diferencia de cubos y factorización con exponentes fraccionarios/negativos.
     - **Racionalización y uso del conjugado**: Racionalización de denominadores y numeradores, binomios con raíces cuadradas y aplicación directa a límites indeterminados.
     - **Ecuaciones y sistemas**: Ecuaciones lineales, cuadráticas, racionales y sistemas $2\times 2$.
   - **Geometría**: Teorema de Pitágoras, semejanza, áreas, volúmenes y Geometría Analítica en el plano.
   - **Trigonometría**: Razones trigonométricas, radianes, círculo unitario, identidades pitagóricas, ángulo doble y Ley de Cosenos.
   - **Funciones**: Dominio, rango, composición $(f \circ g)(x)$, función inversa $f^{-1}(x)$, exponenciales y logaritmos.
   - **Límites (4 Temas Exhaustivos)**:
     - Concepto intuitivo y definición formal, interpretación gráfica, límites laterales, sustitución directa y leyes de los límites.
     - Indeterminaciones $\frac{0}{0}$ resueltas mediante factorización y mediante racionalización con el conjugado.
     - Límites al infinito, límites infinitos y asíntotas verticales y horizontales.
     - Límites trigonométricos fundamentales, continuidad, tipos de discontinuidad y aplicaciones.
   - **Derivadas (4 Temas Exhaustivos)**:
     - Concepto de derivada, definición mediante límites, interpretación geométrica (recta tangente) y razón de cambio instantánea.
     - Reglas de derivación: potencia, suma/resta, producto, cociente y Regla de la Cadena.
     - Derivadas trigonométricas, exponenciales y logarítmicas, derivación implícita y rectas tangente y normal.
     - Máximos y mínimos, crecimiento y decrecimiento, concavidad, puntos de inflexión y problemas de optimización.
   - **Integrales (3 Temas Exhaustivos)**:
     - Concepto de integral, antiderivadas, integrales indefinidas, constante de integración $C$ y reglas fundamentales (potencias, exponenciales, logarítmicas y trigonométricas).
     - Métodos de integración: sustitución (cambio de variable) e integración por partes (criterio ILATE).
     - Integrales definidas, Teorema Fundamental del Cálculo (Regla de Barrow), interpretación geométrica del área bajo la curva (áreas positivas y negativas) y aplicaciones.
   - **Cálculo diferencial e integral**: Área entre dos curvas, cinemática diferencial e integral y ecuaciones diferenciales ordinarias de variables separables.

4. **Gráficas Interactivas Integradas en Lecciones y Herramientas**:
   - **Límites**: Aproximación lateral $x \to a^-$ y $x \to a^+$, control de $a$ y $\delta$, visualización de discontinuidades removibles (huecos) y asíntotas.
   - **Derivadas**: Punto móvil $x_0$ sobre la curva, recta secante con incremento $h \to 0$ convergiendo a la recta tangente, recta normal ortogonal y comparación simultánea con la curva derivada $f'(x)$.
   - **Integrales**: Sombrero diferenciado de áreas positivas ($f(x) \ge 0$) y áreas negativas ($f(x) < 0$), modificación de límites de integración $[a, b]$ y rectángulos de Riemann.

## Cómo Ejecutar y Visualizar la Aplicación

- **Opción 1 (Servidor HTTP con Python — recomendado)**:
  ```bash
  python3 -m http.server 8000
  ```
  (En Windows si solo está disponible el comando `python`, ejecuta `python -m http.server 8000`). Luego abre `http://localhost:8000/` en el navegador.
- **Opción 2 (Con Servidor Local incluido en Windows)**: Haz doble clic en `iniciar-servidor.bat` (o ejecuta `powershell -ExecutionPolicy Bypass -File .\servidor.ps1`), lo cual iniciará el servidor local en `http://localhost:8080/`.
- **Opción 3 (Directa sin servidor)**: Haz doble clic sobre `index.html` para abrirlo en cualquier navegador moderno (Chrome, Edge, Firefox, Brave).

## Cómo Ejecutar las Pruebas

El proyecto incluye pruebas de caracterización y lógica matemática sin dependencias externas usando el ejecutor nativo de Node.js (`node --test`):

```bash
node --test tests/
```
