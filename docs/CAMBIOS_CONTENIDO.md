# Registro de Cambios de Contenido Curricular (Fase 5)

Listado detallado de todas las modificaciones realizadas al texto didáctico para validación matemática y pedagógica.

---

## 1. `js/data/curriculum-part2.js`

### Cambio 1.1 — Definición formal $\varepsilon$-$\delta$ y Unicidad del Límite (`lim-1`, `detailedExplanation[0]`)
- **Archivo**: `js/data/curriculum-part2.js`
- **Línea**: 642
- **Antes**:
  > `**1. Concepto Intuitivo y Definición Formal ($\varepsilon$-$\delta$):** Escribimos $\lim_{x \to a} f(x) = L$ y leemos *"el límite de $f(x)$ cuando $x$ tiende a $a$ es igual a $L$"* si podemos hacer que los valores de $f(x)$ estén tan cerca de $L$ como deseemos (a una distancia menor que cualquier tolerancia $\varepsilon > 0$) tomando a $x$ suficientemente cerca de $a$ (a una distancia $0 < |x - a| < \delta$), pero con $x \neq a$.`
- **Después**:
  > `**1. Concepto Intuitivo, Definición Formal ($\varepsilon$-$\delta$) y Unicidad:** Decimos que $\lim_{x \to a} f(x) = L$ cuando para toda tolerancia $\varepsilon > 0$ elegida en el eje vertical, existe una distancia $\delta = \delta(\varepsilon) > 0$ (dependiente de $\varepsilon$) en el eje horizontal tal que todo punto $x$ en el dominio de $f$ dentro del entorno perforado $0 < |x - a| < \delta$ cumple $|f(x) - L| < \varepsilon$. Formalmente con cuantificadores: $\forall \varepsilon > 0,\; \exists \delta = \delta(\varepsilon) > 0 \;\text{tal que}\; \forall x \in \operatorname{Dom}(f),\; (0 < |x - a| < \delta \implies |f(x) - L| < \varepsilon)$. La condición $0 < |x - a|$ excluye expresamente a $x = a$. Además, por el **Teorema de Unicidad del Límite**, si $\lim_{x \to a} f(x) = L_1$ y $\lim_{x \to a} f(x) = L_2$, necesariamente $L_1 = L_2$: un límite, cuando existe, es único.`

### Cambio 1.2 — Concepto 1 de `lim-1` (`concepts[0]`)
- **Archivo**: `js/data/curriculum-part2.js`
- **Línea**: 649 (después: 649-653)
- **Antes**:
  > `body: 'El valor de $\lim_{x \to a} f(x)$ depende únicamente del comportamiento de $f(x)$ en la vecindad de $a$ ($x \neq a$). El límite puede existir aunque $f(a)$ no esté definida.'`
- **Después**:
  > `body: 'El valor de $\lim_{x \to a} f(x)$ depende únicamente del comportamiento de $f(x)$ en la vecindad perforada de $a$ ($0 < |x - a| < \delta$). El límite puede existir aunque $f(a)$ no esté definida.'` + botón contextual `graphLabel: 'Ver hueco en graficador'`, `graphPayload: { kind: 'limit', expr: '(x^2 - 4)/(x - 2)', tangentX: 2 }`.

### Cambio 1.3 — Concepto 2 de `lim-1`: Unicidad y Límites Laterales (`concepts[1]`)
- **Archivo**: `js/data/curriculum-part2.js`
- **Línea**: 652-653 (después: 655-657)
- **Antes**:
  > `title: '2. Teorema de Límites Laterales'`
  > `body: '$\lim_{x \to a} f(x) = L \Longleftrightarrow \lim_{x \to a^-} f(x) = L \;\text{ y }\; \lim_{x \to a^+} f(x) = L$.'`
- **Después**:
  > `title: '2. Unicidad y Límites Laterales'`
  > `body: 'El límite en un punto, si existe, es **único** ($L_1 = L_2$). Además, $\lim_{x \to a} f(x) = L \Longleftrightarrow \lim_{x \to a^-} f(x) = L \;\text{ y }\; \lim_{x \to a^+} f(x) = L$.'`

### Cambio 1.4 — Fórmulas de `lim-1` (`formulas`)
- **Archivo**: `js/data/curriculum-part2.js`
- **Línea**: 664-670 (después: 668-681)
- **Antes**:
  > Solo incluía *"Condición Necesaria y Suficiente de Existencia del Límite"* y *"Leyes Fundamentales de los Límites"*.
- **Después**:
  > Se agregó al inicio la fórmula destacada:
  > - `label: 'Definición Formal ε-δ del Límite (Cauchy-Weierstrass)'`
  > - `expr: '\\lim_{x \\to a} f(x) = L \\iff \\forall \\varepsilon > 0,\\; \\exists \\delta = \\delta(\\varepsilon) > 0 : \\forall x \\in \\operatorname{Dom}(f),\\; 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon'`
  > - `note: 'El valor de δ depende de la tolerancia ε elegida (δ = δ(ε)), y 0 < |x - a| garantiza que x ≠ a.'`
  > Y en la fórmula de Existencia se añadió `'(y Unicidad)'` en el título, la aclaración `'si existe, L es único'` en la nota y `graphPayload: { kind: 'limit', expr: 'abs(x)/x', tangentX: 0 }`.

### Cambio 1.5 — Enlace contextual al Graficador en ejemplo de `lim-2`
- **Archivo**: `js/data/curriculum-part2.js`
- **Línea**: 885-887
- **Antes**: Ejemplo 1 de `lim-2` sin `graphPayload`.
- **Después**: Se añadió `graphPayload: { kind: 'limit', expr: '(x^2 - 9)/(x^2 - x - 6)', tangentX: 3 }` para el botón contextual `"Ver en graficador"`.

### Cambio 1.6 — Clasificación formal de discontinuidades (`lim-4`, `detailedExplanation[2]`)
- **Archivo**: `js/data/curriculum-part2.js`
- **Línea**: 1213 (después: 1224)
- **Antes**:
  > `**3. Clasificación de Discontinuidades:** Si falla alguna condición en $x = a$, la discontinuidad se clasifica en: **(a) Evitable o Removible** (cuando existe $\lim_{x \to a} f(x) = L$ finito, pero $f(a)$ no existe o $f(a) \neq L$; basta redefinir $f(a) = L$ para hacerla continua); **(b) De Salto Finito** (cuando los límites laterales existen pero son distintos: $L^- \neq L^+$); **(c) Infinita o Esencial** (cuando alguno de los límites laterales es $\pm\infty$).`
- **Después**:
  > `**3. Clasificación Formal de Discontinuidades:** Si falla alguna condición de continuidad en $x = a$, la discontinuidad se clasifica en tres tipos excluyentes: **(a) Evitable o Removible:** existe el límite bilateral finito $\lim_{x \to a} f(x) = L \in \mathbb{R}$, pero $f(a)$ no está definida o $f(a) \neq L$; basta redefinir $f(a) = L$ para restaurar la continuidad (por ejemplo, $f(x) = \frac{\operatorname{sen}(x)}{x}$ en $x = 0$). **(b) De Salto Finito (de primera especie):** ambos límites laterales $\lim_{x \to a^-} f(x) = L^-$ y $\lim_{x \to a^+} f(x) = L^+$ existen y son finitos, pero $L^- \neq L^+$ (como $f(x) = \frac{|x|}{x}$ en $x = 0$). **(c) Esencial (de segunda especie):** al menos uno de los límites laterales no existe en $\mathbb{R}$, ya sea por divergencia infinita ($\lim_{x \to a^\pm} f(x) = \pm\infty$, discontinuidad asintótica como $\frac{1}{x}$) o por oscilación indefinida sin aproximarse a un valor ni a $\pm\infty$ (como $\operatorname{sen}(1/x)$ en $x = 0$).`

### Cambio 1.7 — Concepto 3 de `lim-4` (`concepts[2]`) y Ejemplo 2 de `lim-4`
- **Archivo**: `js/data/curriculum-part2.js`
- **Líneas**: 1225-1227 y 1278 (después: 1236-1239 y 1291)
- **Antes**:
  > `title: '3. Discontinuidad Evitable vs Esencial'`
  > `body: 'Es **evitable** si existe el límite bilateral finito $L$. Es **no evitable (esencial)** si hay un salto lateral o una asíntota vertical.'`
- **Después**:
  > `title: '3. Clasificación: Evitable, Salto y Esencial'`
  > `body: 'Es **evitable** si existe $\lim_{x \to a} f(x) = L \in \mathbb{R}$; de **salto finito** si $L^-, L^+ \in \mathbb{R}$ pero $L^- \neq L^+$; y **esencial** si algún lateral diverge a $\pm\infty$ o no existe por oscilación (ej. $\operatorname{sen}(1/x)$).'` + `graphPayload: { kind: 'limit', expr: 'sin(x)/x', tangentX: 0 }`.
  > En el Ejemplo 2 de `lim-4` se añadió `graphPayload: { kind: 'limit', expr: '(x^2 - 25)/(x - 5)', tangentX: 5 }`.

---

## 2. `js/data/curriculum-part3.js`

### Cambio 2.1 — Precisión terminológica histórica en `der-1` (`summary`)
- **Archivo**: `js/data/curriculum-part3.js`
- **Línea**: 33
- **Antes**:
  > `summary: 'Cociente incremental de Newton-Leibniz, paso de recta secante a recta tangente, velocidad instantánea y derivabilidad.'`
- **Después**:
  > `summary: 'Cociente incremental de diferencias (Fermat, Newton y Leibniz), paso de recta secante a recta tangente, velocidad instantánea y derivabilidad.'`

### Cambio 2.2 — Preset gráfico de función continua no derivable en `der-1` (`interactiveGraph.presets`)
- **Archivo**: `js/data/curriculum-part3.js`
- **Línea**: 48 (después: 49)
- **Antes**: Solo 3 presets (`0.5*x^2`, `x^3 - 3*x`, `2*sin(x)`).
- **Después**: Se añadió `{ label: 'Continua no derivable: |x| (x₀=0)', fn: 'abs(x)', x0: 0, h: 0.8 }`.

### Cambio 2.3 — Contraejemplos rigurosos de funciones continuas no derivables (`der-1`, `concepts[3]`)
- **Archivo**: `js/data/curriculum-part3.js`
- **Línea**: 79-81 (después: 80-83)
- **Antes**:
  > `title: '4. Derivabilidad Implica Continuidad'`
  > `body: 'Todo punto donde una función es derivable es necesariamente un punto donde la función es continua. Sin embargo, el recíproco es falso: una función puede ser continua en $x_0$ pero **no derivable** si presenta un pico o esquina angulosa (como $f(x) = |x|$ en $x = 0$, donde las derivadas laterales son $-1$ y $+1$) o una tangente vertical (como $f(x) = \sqrt[3]{x}$ en $x = 0$).'`
- **Después**:
  > `title: '4. Derivabilidad Implica Continuidad (y Contraejemplos)'`
  > `body: 'Si $f$ es derivable en $x_0$, entonces $f$ es continua en $x_0$. El recíproco **no** se cumple en general; una función puede ser continua en $x_0$ pero **no derivable** en tres casos clásicos: **(1) Punto anguloso**, como $f(x) = |x|$ en $x_0 = 0$: es continua ($\lim_{x \to 0}|x| = 0 = f(0)$), pero sus derivadas laterales difieren ($f\'_-(0) = \lim_{h \to 0^-}\frac{|h|}{h} = -1 \neq +1 = f\'_+(0)$); **(2) Cúspide**, como $f(x) = x^{2/3}$ en $x_0 = 0$, donde los cocientes laterales divergen a $-\infty$ y $+\infty$; y **(3) Tangente vertical**, como $f(x) = \sqrt[3]{x}$ en $x_0 = 0$, donde el cociente incremental tiende a $+\infty$.'` + `graphLabel: 'Ver |x| en graficador'`, `graphPayload: { kind: 'derivative', expr: 'abs(x)', tangentX: 0, showDerivative: true }`.

### Cambio 2.4 — Etiqueta de fórmula y botones `"Ver en graficador"` en `der-1`
- **Archivo**: `js/data/curriculum-part3.js`
- **Líneas**: 85, 92, 99, 125 (después: 89, 96, 106, 128)
- **Antes**:
  > `label: 'Definición de Derivada (Cociente de Newton-Leibniz)'`
- **Después**:
  > `label: 'Definición de Derivada (Límite del Cociente Incremental)'`
  > Además se añadieron `graphPayload` en la fórmula de recta tangente (`0.5*x^2`, $x_0=1.5$), en el Ejemplo 1 (`3*x^2 - 5*x + 1`, $x_0=1$) y en el Ejemplo 2 (`sqrt(x)`, $x_0=4$).

---

# Registro de Cambios de Contenido Curricular — Ronda 2 (Fases 11 y 12)

## 3. Fase 11 — Profundización en Razón de Cambio y Función Derivada (`js/data/curriculum-part3.js`)

| Tema / Ubicación | Resumen del contenido nuevo o modificado |
| :--- | :--- |
| `der-1` → `theory.detailedExplanation` (líneas ~62–66) | Ampliación integral: razón promedio vs. instantánea y unidades ($\frac{\text{unid. }y}{\text{unid. }x}$); interpretaciones en Física ($v, a$), Economía ($C'(q), I'(q)$), Biología/Química ($P'(t), [A]'(t)$) y Geometría ($A'(r)=2\pi r$); formas equivalentes $h\to 0$ y $x\to a$; derivadas laterales $f'_-(a), f'_+(a)$; dominio $\operatorname{Dom}(f')\subseteq\operatorname{Dom}(f)$, notaciones (Lagrange, Leibniz, Newton, Cauchy) y derivadas de orden superior; recta tangente, recta normal, linealización $L(x)$ y diferencial $dy$. |
| `der-1` → `theory.concepts` (5 tarjetas) | Nuevos conceptos estructurados para las dos definiciones equivalentes, recta tangente/normal y diferencial, dominio de $f'$, catálogo de 4 casos de no derivabilidad (punto anguloso, cúspide, tangente vertical y discontinuidad) y tabla resumen de derivadas deducidas desde la definición. |
| `der-1` → `theory.theorems` (3 teoremas) | **(1)** Teorema *Derivabilidad implica Continuidad* con hipótesis explícitas, demostración algebraica paso a paso y contraejemplos ($|x|, x^{2/3}, \sqrt[3]{x}$); **(2)** Deducción desde la definición de $(c)'=0$, $(x)'=1$, $(x^2)'=2x$ y $(x^n)'=nx^{n-1}$ ($n\in\mathbb{N}$ por Binomio de Newton); **(3)** Deducción de $(\operatorname{sen} x)'=\cos x$ (en radianes con límites notables $\frac{\operatorname{sen}h}{h}\to 1$ y $\frac{\cos h-1}{h}\to 0$) y $(e^x)'=e^x$ (con $\frac{e^h-1}{h}\to 1$). |
| `der-1` → `examples` (Ejemplos 3–5 nuevos) | **Ejemplo 3**: Velocidad promedio/instantánea y aceleración de $s(t)=5t^2+3t$ + costo marginal $C'(50)$ de $C(q)=0.2q^2+12q+500$ con unidades; **Ejemplo 4**: Derivada por definición de $1/x$, tangente, normal y aproximación lineal $L(2.05)=0.4875$; **Ejemplo 5**: Estudio lateral de $|x-3|$ en $x_0=3$ vs. $x_0=5$. |
| `der-1` → `exercises` (`der-1-ex4`, `der-1-ex5`) | Nuevos ejercicios conservando intactos `ex1`–`ex3`: aproximación lineal $(3.02)^2 \approx 9.12$ desde $a=3$, y costo marginal $C'(20)=30$ para $C(x)=0.5x^2+10x+200$. |
| `der-2` → `theory.theorems` (2 bloques) | Demostraciones paso a paso con hipótesis de **Linealidad**, **Regla del Producto** (sumando/restando $u(x)v(x+h)$), **Regla del Cociente** ($v(x)\neq 0$) y **Regla de la Cadena** (mediante función auxiliar continua $\varepsilon(k)$). |
| `der-2` → `examples` (Ejemplos 3–4) y `der-2-ex4` | **Ejemplo 3**: $(x^2+1)e^x$ con factorización de $e^x$; **Ejemplo 4**: $((2x-1)/(x+1))^3$ evaluada en $x=2$ ($f'(2)=1$); nuevo ejercicio `der-2-ex4` ($h(x)=(2x-1)^3(x+1)$, $h'(1)=13$). |
| `der-3` → `theory.theorems` y `examples` (Ejemplo 3) | Teorema con demostración de $\frac{d}{dx}(\ln x) = \frac{1}{x}$ ($x > 0$) vía derivación implícita de $e^y=x$; **Ejemplo 3**: curva implícita $xe^y+2y=3x$ en $P(0,0)$ obteniendo tangente $y=x$ y normal $y=-x$. |
| `der-4` → `theory.theorems` (2 teoremas) y `examples` (Ejemplos 3–4) | **Teorema de Fermat** para extremos locales interiores con demostración lateral y contraejemplo ($x^3$ en $0$); **Teorema del Valor Medio (Lagrange)** con hipótesis en $[a,b]$ y $(a,b)$ y demostración del **Corolario de Monotonía** por el signo de $f'$. **Ejemplo 3**: análisis de $x^4-4x^3$ (punto estacionario sin extremo en $x=0$, mínimo en $x=3$, inflexiones en $0$ y $2$); **Ejemplo 4**: verificación del TVM para $x^3-x$ en $[0,2]$ hallando $c = 2/\sqrt{3}$. |

---

## 4. Fase 12 — Ampliación de Rigor, Teoremas y Ejemplos en el Resto de Materias

| Archivo | Tema / Ubicación | Resumen del contenido nuevo o modificado |
| :--- | :--- | :--- |
| `js/data/curriculum-part1.js` | `arit-1` (`theorems`, `examples[2]`) | Propiedad de consistencia de exponentes $0$, negativos y racionales ($a>0$); **Ejemplo 3**: simplificación de $(3/4)^{-2} - \sqrt{64}\cdot 2^{-2} = -2/9$. |
| `js/data/curriculum-part1.js` | `arit-2` (`theorems`, `examples[1]`) | Criterio de equivalencia $\frac{a}{b}=\frac{c}{d} \iff ad=bc$ ($b,d\neq 0$); **Ejemplo 2**: proporcionalidad inversa de técnicos vs. días. |
| `js/data/curriculum-part1.js` | `alg-1` (`theorems`, `examples[2]`) | **Teorema del Factor** con demostración mediante división euclidiana polinomial; **Ejemplo 3**: factorización completa de $x^4-16$. |
| `js/data/curriculum-part1.js` | `alg-2` (`theorems`, `examples[2]`) | Identidad del conjugado con hipótesis $A,B\ge 0, A\neq B$; **Ejemplo 3**: racionalización de diferencia de radicales $\frac{\sqrt{x+1}-\sqrt{3x-1}}{x-1}$. |
| `js/data/curriculum-part1.js` | `alg-3` (`theorems`, `examples[1..2]`) | **Deducción de la Fórmula General Cuadrática** por completación de cuadrados ($a\neq 0$); **Ejemplo 2**: sistema 2×2 por reducción; **Ejemplo 3**: raíz doble con $\Delta=0$. |
| `js/data/curriculum-part1.js` | `geo-1` (`theorems`, `examples[1]`) | Demostración geométrico-algebraica del **Teorema de Pitágoras**; **Ejemplo 2**: volúmenes exactos de esfera y cilindro. |
| `js/data/curriculum-part1.js` | `geo-2` (`theorems`, `examples[1]`) | Demostración pitagórica de ortogonalidad $m_1m_2=-1$; **Ejemplo 2**: distancia entre puntos y ecuación de la mediatriz perpendicular. |
| `js/data/curriculum-part2.js` | `trig-1` (`theorems`, `examples[1]`) | Definición geométrica en radianes $\theta=s/r$ y círculo unitario; **Ejemplo 2**: evaluación exacta de $\frac{4\pi}{3}$ en III cuadrante. |
| `js/data/curriculum-part2.js` | `trig-2` (`theorems`, `examples[1]`) | Demostración de identidades pitagóricas desde $x^2+y^2=1$; **Ejemplo 2**: aplicación de Ley de Cosenos. |
| `js/data/curriculum-part2.js` | `func-1` (`theorems`, `examples[1]`) | Condición de biyectividad/monotonía para inversa $f^{-1}$; **Ejemplo 2**: intersección de dominio radical y racional $[-3,2)\cup(2,\infty)$. |
| `js/data/curriculum-part2.js` | `func-2` (`theorems`, `examples[1]`) | Demostración de $\ln(AB)=\ln A + \ln B$ y cambio de base ($A,B>0, b\neq 1$); **Ejemplo 2**: ecuación logarítmica con filtrado de raíz extraña. |
| `js/data/curriculum-part2.js` | `lim-1` (`intro[0]`, `theorems`, `examples[2]`) | Corrección de énfasis `**en**`, **Teorema de Unicidad del Límite** (reducción al absurdo con $\varepsilon/2$) y **Ejemplo 3**: prueba $\varepsilon$-$\delta$ lineal de $\lim_{x\to 3}(2x+1)=7$. |
| `js/data/curriculum-part2.js` | `lim-2` (`theorems`, `examples[2]`) | Lema de cancelación en entorno perforado ($0<|x-a|<r$); **Ejemplo 3**: $\lim_{x\to 2}\frac{x^3-8}{x^2-4}=3$. |
| `js/data/curriculum-part2.js` | `lim-3` (`theorems`, `examples[2]`) | Demostración $\varepsilon$-$M$ de $\lim_{x\to\infty} c/x^k = 0$; **Ejemplo 3**: límite en $-\infty$ con $\sqrt{x^2}=|x|=-x$. |
| `js/data/curriculum-part2.js` | `lim-4` (`theorems`, `examples[2]`) | **Teorema de Compresión (Sándwich)** con demostración y aplicación; **Ejemplo 3**: $\lim_{x\to 0}\frac{1-\cos(2x)}{x^2}=2$. |
| `js/data/curriculum-part3.js` | `int-1` (`theorems`, `examples[2]`) | **Teorema de la Constante de Integración** vía TVM en intervalo conexo; **Ejemplo 3**: antiderivada tras simplificación de cociente y trigonométricas/exponencial. |
| `js/data/curriculum-part3.js` | `int-2` (`theorems`, `examples[2]`) | Deducción de **Integración por Partes** desde la regla del producto; **Ejemplo 3**: antiderivada clásica $\int \ln(x)\,dx = x\ln x - x + C$. |
| `js/data/curriculum-part3.js` | `int-3` (`theorems`, `examples[2]`) | **Teorema Fundamental del Cálculo (I y II)** con demostración vía sumas telescópicas y TVM; **Ejemplo 3**: valor promedio de $x^2$ en $[0,3]$. |
| `js/data/curriculum-part3.js` | `calc-1` (`theorems`, `examples[1..2]`) | Área plana con $f\ge g$; **Ejemplo 2**: área entre recta y parábola ($4.5\text{ u}^2$); **Ejemplo 3**: cinemática desde $a(t)$ hasta $s(2)=9\text{ m}$. |
| `js/data/curriculum-part3.js` | `calc-2` (`theorems`, `examples[1..2]`) | Validez analítica de separación de variables ($h(y_0)\neq 0$); **Ejemplo 2**: decaimiento radiactivo; **Ejemplo 3**: EDO no lineal $y' = x/y$ con $y(3)=5$. |
