/* ==========================================================================
   MATETIC - Currículo Parte 3: Derivadas, Integrales y Cálculo
   Archivo: js/data/curriculum-part3.js
   Incluye la estructura didáctica completa de 9 etapas y gráficas interactivas
   para Derivadas (4 temas exhaustivos), Integrales (3 temas exhaustivos)
   y Cálculo Diferencial e Integral (2 temas de síntesis).
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};
window.MatInteractiva.Curriculum = window.MatInteractiva.Curriculum || [];

(function (curriculum) {
  'use strict';

  const part3 = [
    /* ======================================================================
       MÓDULO 7: DERIVADAS (PRIORIDAD B)
       ====================================================================== */
    {
      id: 'derivadas',
      name: 'Derivadas',
      symbol: "f'(x)",
      levelTag: 'Cambio Instantáneo',
      color: '#1E40AF',
      shortDesc: 'Concepto, definición por límite, recta tangente y normal, reglas de derivación, cadena, implícita, extremos, concavidad y optimización.',
      topics: [
        /* ------------------------------------------------------------------
           DER-1: CONCEPTO, INTERPRETACIÓN GEOMÉTRICA, RAZÓN DE CAMBIO Y DEFINICIÓN POR LÍMITES
           ------------------------------------------------------------------ */
        {
          id: 'der-1',
          title: 'Concepto de Derivada, Definición por Límites, Recta Tangente y Razón de Cambio',
          summary: 'Cociente incremental de diferencias (Fermat, Newton y Leibniz), paso de recta secante a recta tangente, velocidad instantánea y derivabilidad.',
          graphPreset: '0.5*x^2',
          demoAnimations: ['der-razon-promedio', 'der-secante-tangente', 'der-velocidad-instantanea', 'der-no-derivable'],
          interactiveGraph: {
            mode: 'derivatives',
            title: 'Laboratorio Geométrico: De la Recta Secante a la Recta Tangente',
            description: 'Mueve el punto de tangencia x₀ sobre la curva (o arrástralo directamente en el lienzo) y reduce el incremento h → 0 para observar cómo la recta secante converge hacia la recta tangente.',
            fn: '0.5*x^2',
            x0: 1.5,
            h: 1.2,
            xDomain: [-4, 5],
            yDomain: [-3, 9],
            presets: [
              { label: 'Parábola: 0.5x²', fn: '0.5*x^2', x0: 1.5, h: 1.2 },
              { label: 'Cúbica: x³ - 3x', fn: 'x^3 - 3*x', x0: 1.2, h: 0.8 },
              { label: 'Sinusoidal: 2·sen(x)', fn: '2*sin(x)', x0: 0.8, h: 1.0 },
              { label: 'Continua no derivable: |x| (x₀=0)', fn: 'abs(x)', x0: 0, h: 0.8 }
            ]
          },
          theory: {
            intro: [
              'El **Cálculo Diferencial** nace de dos problemas clásicos fundamentales: el problema geométrico de trazar la **recta tangente** a una curva en un punto dado (estudiado por Pierre de Fermat y Gottfried Wilhelm Leibniz) y el problema físico de determinar la **velocidad instantánea** de un cuerpo en movimiento no uniforme (estudiado por Isaac Newton).',
              'Ambos problemas conducen exactamente al mismo concepto matemático: la **derivada de una función**. La derivada $f\'(x)$ cuantifica la sensibilidad o **razón de cambio instantánea** de la variable dependiente $y = f(x)$ respecto a un cambio infinitesimal en la variable independiente $x$.'
            ],
            prerequisites: [
              'Evaluación de funciones en expresiones algebraicas compuestas como $f(x + h)$ y desarrollo de binomios $(x+h)^2 = x^2 + 2xh + h^2$.',
              'Cálculo de la pendiente de una recta que pasa por dos puntos: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
              'Resolución de límites indeterminados de la forma $\\frac{0}{0}$ mediante factorización y racionalización.'
            ],
            detailedExplanation: [
              '**1. Razón de cambio promedio vs. instantánea y unidades:** Si $y = f(x)$ varía desde $x_0$ hasta $x_0 + h$ ($h \\neq 0$), el cambio en la variable independiente es $\\Delta x = h$ y la variación de la función es $\\Delta y = f(x_0 + h) - f(x_0)$. El cociente $\\frac{\\Delta y}{\\Delta x} = \\frac{f(x_0 + h) - f(x_0)}{h}$ se llama **cociente incremental** o **razón de cambio promedio** en el intervalo entre $x_0$ y $x_0 + h$, y posee las unidades de medida $\\frac{\\text{unidades de } y}{\\text{unidades de } x}$. Al tomar el límite cuando $h \\to 0$ (si existe y es finito), se obtiene la **razón de cambio instantánea** $f\'(x_0)$.',
              '**2. Aplicaciones interdisciplinarias (Física, Economía, Biología, Química y Geometría):** En **Física**, si $s(t)$ es la posición en metros y $t$ el tiempo en segundos, $v(t) = s\'(t)$ es la **velocidad instantánea** (en $\\text{m/s}$) y $a(t) = v\'(t) = s\'\'(t)$ es la **aceleración instantánea** (en $\\text{m/s}^2$). En **Economía**, si $C(q)$ es el costo total de producir $q$ artículos e $I(q)$ el ingreso, $C\'(q)$ es el **costo marginal** e $I\'(q)$ el **ingreso marginal** (aproximan el costo e ingreso de producir una unidad adicional en $\\$/\\text{unidad}$). En **Biología y Química**, $P\'(t)$ mide la tasa instantánea de crecimiento de una población (individuos/hora) y $[A]\'(t)$ la velocidad instantánea de reacción química ($\\text{mol}/(\\text{L}\\cdot\\text{s})$). En **Geometría**, para un círculo de área $A(r) = \\pi r^2$, su derivada $A\'(r) = 2\\pi r$ es justamente la longitud de la circunferencia.',
              '**3. Definición formal en un punto (formas equivalentes) y derivadas laterales:** Sea $f$ definida en un entorno abierto de $a$. Decimos que $f$ es **derivable en $a$** si existe y es finito cualquiera de los dos límites equivalentes (relacionados por $x = a + h$): $$f\'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h} = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$ Definimos además las **derivadas laterales** por izquierda y por derecha: $$f\'_-(a) = \\lim_{h \\to 0^-} \\frac{f(a+h)-f(a)}{h} \\quad ; \\quad f\'_+(a) = \\lim_{h \\to 0^+} \\frac{f(a+h)-f(a)}{h}$$ Una función es derivable en $a$ **si y solo si** ambas derivadas laterales existen, son finitas e iguales: $f\'_-(a) = f\'_+(a)$.',
              '**4. La función derivada, dominio de $f\'$, notaciones y órdenes superiores:** Al variar $x$ en todos los puntos donde el límite existe y es finito, $x \\mapsto f\'(x)$ define una nueva función llamada **función derivada**, cuyo dominio satisface siempre $\\operatorname{Dom}(f\') \\subseteq \\operatorname{Dom}(f)$ (por ejemplo, para $f(x) = \\sqrt{x}$, $\\operatorname{Dom}(f) = [0, \\infty)$, mientras que $\\operatorname{Dom}(f\') = (0, \\infty)$ pues la tangente en $x = 0$ es vertical). En cálculo universitario conviven cuatro notaciones complementarias: **Lagrange** $f\'(x)$ (práctica para evaluar en un punto $f\'(a)$), **Leibniz** $\\frac{dy}{dx}$ o $\\left.\\frac{df}{dx}\\right|_{x=a}$ (explicita variables, unidades y regla de la cadena), **Newton** $\\dot{y}$ (derivadas temporales en física) y **Cauchy** $Df(x)$ (enfoque de operador lineal). Derivando sucesivamente se obtienen las **derivadas de orden superior**: $f\'\'(x) = \\frac{d^2y}{dx^2}$, $f\'\'\'(x)$, $\\dots$, $f^{(n)}(x) = \\frac{d^ny}{dx^n}$.',
              '**5. Recta tangente, recta normal, aproximación lineal y diferencial:** Geométricamente, el cociente incremental es la pendiente de la **recta secante** por $P(a, f(a))$ y $Q(a+h, f(a+h))$. Si $f$ es derivable en $a$, la **recta tangente** en $P$ es $y = f(a) + f\'(a)(x - a)$. La **recta normal** es la perpendicular a la tangente en $P$: si $f\'(a) \\neq 0$, su ecuación es $y = f(a) - \\frac{1}{f\'(a)}(x - a)$ (y si $f\'(a) = 0$, la normal es vertical $x = a$). Para $x$ cercano a $a$, la función $L(x) = f(a) + f\'(a)(x - a)$ constituye la **aproximación lineal** o linealización de $f$ en $a$, mientras que $dy = f\'(x)\\,dx$ es el **diferencial** que aproxima al incremento exacto $\\Delta y = f(x+dx) - f(x)$.'
            ],
            concepts: [
              {
                title: '1. Definición de la Derivada mediante Límites (h → 0 y x → a)',
                body: 'Para cualquier punto $x$ donde el límite exista y sea finito: $$f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$ De manera equivalente en un punto específico $a$ (con $x = a + h$): $$f\'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$ En un extremo cerrado $[a, b]$, solo se exigen las derivadas laterales correspondientes $f\'_+(a)$ y $f\'_-(b)$.'
              },
              {
                title: '2. Recta Tangente, Recta Normal y Diferencial dy',
                body: 'En $(a, f(a))$ con $f$ derivable: **Recta Tangente:** $L(x) = f(a) + f\'(a)(x - a)$ (mejor aproximación afín local). **Recta Normal:** $y - f(a) = -\\frac{1}{f\'(a)}(x - a)$ si $f\'(a) \\neq 0$. **Diferencial:** $dy = f\'(a)\\,dx \\approx \\Delta y$.'
              },
              {
                title: '3. Dominio de f\' y Derivadas de Orden Superior',
                body: 'Siempre se cumple $\\operatorname{Dom}(f\') \\subseteq \\operatorname{Dom}(f)$. Por ejemplo, $f(x) = \\sqrt{x}$ es continua en $x=0$, pero $f\'(x) = \\frac{1}{2\\sqrt{x}}$ solo existe para $x > 0$. La segunda derivada $f\'\'(x) = \\frac{d^2y}{dx^2}$ mide la rapidez de cambio de la pendiente (aceleración en cinemática y concavidad en geometría).'
              },
              {
                title: '4. Catálogo Completo de No Derivabilidad (4 Casos)',
                body: 'Una función deja de ser derivable en $x = a$ en cuatro situaciones prototípicas: **(1) Punto anguloso:** continua pero con derivadas laterales finitas distintas, como $f(x) = |x|$ en $0$ ($f\'_-(0) = -1 \\neq +1 = f\'_+(0)$); **(2) Cúspide:** continua con cocientes laterales que divergen con signos opuestos ($-\\infty$ y $+\\infty$), como $f(x) = x^{2/3}$ en $0$; **(3) Tangente vertical:** continua con límite del cociente incremental $+\\infty$ o $-\\infty$, como $f(x) = \\sqrt[3]{x}$ en $0$; y **(4) Discontinuidad:** toda función discontinua en $a$ (como una función escalón o con hueco/salto) es automáticamente no derivable en $a$.',
                graphLabel: 'Ver |x| en graficador',
                graphPayload: { kind: 'derivative', expr: 'abs(x)', tangentX: 0, showDerivative: true }
              },
              {
                title: '5. Prototipos Derivados Desde la Definición (Resumen)',
                body: 'Aplicando $\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}$ se demuestran las derivadas elementales: $(c)\' = 0$; $(x)\' = 1$; $(x^2)\' = 2x$; $(x^n)\' = nx^{n-1}$ ($n \\in \\mathbb{N}$ por binomio); $\\left(\\frac{1}{x}\\right)\' = -\\frac{1}{x^2}$ ($x \\neq 0$); $(\\sqrt{x})\' = \\frac{1}{2\\sqrt{x}}$ ($x > 0$); $(\\text{sen}\\,x)\' = \\cos x$ (radianes); $(e^x)\' = e^x$.'
              }
            ],
            theorems: [
              {
                badge: 'Teorema Fundamental',
                title: 'Derivabilidad en un punto implica Continuidad en ese punto',
                hypothesis: '$f$ está definida en un entorno abierto de $a$ y es derivable en $x = a$ (es decir, $f\'(a) = \\lim_{x \\to a} \\frac{f(x)-f(a)}{x-a}$ existe y es finito).',
                statement: 'Entonces $f$ es necesariamente **continua en $x = a$**, es decir, $\\lim_{x \\to a} f(x) = f(a)$.',
                proofSteps: [
                  'Para todo $x \\neq a$ en el entorno de $a$, escribimos la identidad algebraica: $f(x) - f(a) = \\frac{f(x) - f(a)}{x - a} \\cdot (x - a)$.',
                  'Tomamos límite cuando $x \\to a$ en ambos miembros. Por hipótesis, $\\lim_{x \\to a} \\frac{f(x)-f(a)}{x-a} = f\'(a) \\in \\mathbb{R}$ existe, y claramente $\\lim_{x \\to a} (x - a) = 0$.',
                  'Por el teorema del límite del producto (ambos límites existen y son finitos): $\\lim_{x \\to a} [f(x) - f(a)] = f\'(a) \\cdot 0 = 0$.',
                  'Sumando $f(a)$ obtenemos $\\lim_{x \\to a} f(x) = f(a)$, que es exactamente la definición de continuidad en $a$. $\\blacksquare$'
                ],
                note: 'El recíproco es **falso**: ser continua en $a$ NO implica ser derivable en $a$. Contraejemplos: $f(x) = |x|$, $x^{2/3}$ y $\\sqrt[3]{x}$ son continuas en $x = 0$ pero no derivables ahí. Por contrapositivo, si $f$ es discontinua en $a$, entonces $f$ **no** es derivable en $a$.'
              },
              {
                badge: 'Deducción por Definición',
                title: 'Derivada de c, x, x² y xⁿ (n ∈ ℕ) mediante Binomio de Newton',
                hypothesis: 'Sea $n \\in \\mathbb{N}$ ($n \\ge 1$) y $x \\in \\mathbb{R}$.',
                statement: 'Para cualquier constante $c \\in \\mathbb{R}$, $\\frac{d}{dx}(c) = 0$; y para $f(x) = x^n$, se cumple $\\frac{d}{dx}(x^n) = n x^{n-1}$. En particular, $(x)\' = 1$ y $(x^2)\' = 2x$.',
                proofSteps: [
                  'Caso constante $f(x) = c$: $\\frac{f(x+h)-f(x)}{h} = \\frac{c-c}{h} = 0$ para todo $h \\neq 0$, luego $\\lim_{h\\to 0} 0 = 0$.',
                  'Para $f(x) = x^n$ con $h \\neq 0$, aplicamos el Binomio de Newton: $(x + h)^n = x^n + n x^{n-1} h + \\binom{n}{2} x^{n-2} h^2 + \\dots + h^n$.',
                  'Restando $x^n$ y dividiendo entre $h \\neq 0$: $\\frac{(x+h)^n - x^n}{h} = n x^{n-1} + h\\left[\\binom{n}{2}x^{n-2} + \\dots + h^{n-2}\\right]$.',
                  'Como el corchete es un polinomio en $h$, es acotado cerca de $h = 0$; al tomar $\\lim_{h\\to 0}$, todo término con factor $h$ se anula, resultando $n x^{n-1}$. $\\blacksquare$'
                ]
              },
              {
                badge: 'Deducción Trascendente',
                title: 'Derivada de sen(x) y eˣ desde la Definición',
                hypothesis: 'Para $\\operatorname{sen}(x)$, $x$ está en **radianes** y se asumen los límites notables $\\lim_{h \\to 0} \\frac{\\operatorname{sen}(h)}{h} = 1$ y $\\lim_{h \\to 0} \\frac{\\cos(h) - 1}{h} = 0$. Para $e^x$, se asume el límite fundamental $\\lim_{h \\to 0} \\frac{e^h - 1}{h} = 1$.',
                statement: '$\\frac{d}{dx}(\\operatorname{sen} x) = \\cos x$ y $\\frac{d}{dx}(e^x) = e^x$ para todo $x \\in \\mathbb{R}$.',
                proofSteps: [
                  'Para $f(x) = \\operatorname{sen}(x)$: por identidad de suma de ángulos, $\\operatorname{sen}(x+h) = \\operatorname{sen}(x)\\cos(h) + \\cos(x)\\operatorname{sen}(h)$.',
                  'Sustituimos en el cociente incremental: $\\frac{\\operatorname{sen}(x+h)-\\operatorname{sen}(x)}{h} = \\operatorname{sen}(x)\\cdot\\frac{\\cos(h)-1}{h} + \\cos(x)\\cdot\\frac{\\operatorname{sen}(h)}{h}$.',
                  'Tomando $h \\to 0$ (ambos límites existen): $\\operatorname{sen}(x)\\cdot(0) + \\cos(x)\\cdot(1) = \\cos(x)$.',
                  'Para $g(x) = e^x$: factorizamos $e^{x+h} - e^x = e^x(e^h - 1)$, de modo que $\\lim_{h\\to 0}\\frac{e^x(e^h - 1)}{h} = e^x \\lim_{h\\to 0}\\frac{e^h - 1}{h} = e^x \\cdot 1 = e^x$. $\\blacksquare$'
                ],
                note: 'Si $x$ se midiera en grados sexagesimales en lugar de radianes, aparecería un factor adicional $\\frac{\\pi}{180}$: $\\frac{d}{dx}(\\operatorname{sen}(x^\\circ)) = \\frac{\\pi}{180}\\cos(x^\\circ)$.'
              }
            ],
            formulas: [
              {
                label: 'Definición de Derivada (Límite del Cociente Incremental)',
                expr: 'f\'(x) = \\frac{dy}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
                note: 'Siempre produce inicialmente una indeterminación 0/0 que debe simplificarse algebraicamente antes de evaluar h = 0.'
              },
              {
                label: 'Recta Tangente en x = x₀',
                expr: 'y = f(x_0) + f\'(x_0)(x - x_0)',
                note: 'Constituye además la mejor aproximación lineal (linealización) de f(x) cerca de x₀.',
                graphLabel: 'Ver tangente en graficador',
                graphPayload: { kind: 'derivative', expr: '0.5*x^2', tangentX: 1.5, showDerivative: true }
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo 1: Cálculo de la derivada por definición de límite (función cuadrática)',
              problem: 'Utiliza la definición formal mediante límites para hallar la derivada de $f(x) = 3x^2 - 5x + 1$.',
              graphPayload: { kind: 'derivative', expr: '3*x^2 - 5*x + 1', tangentX: 1, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Plantear f(x + h) y desarrollar el binomio',
                  math: 'f(x+h) = 3(x+h)^2 - 5(x+h) + 1 = 3x^2 + 6xh + 3h^2 - 5x - 5h + 1',
                  reason: 'Sustituimos cada aparición de x por el paréntesis (x + h) y expandimos (x + h)².'
                },
                {
                  title: 'Paso 2: Restar f(x) en el numerador del cociente incremental',
                  math: 'f(x+h) - f(x) = (3x^2 + 6xh + 3h^2 - 5x - 5h + 1) - (3x^2 - 5x + 1) = 6xh + 3h^2 - 5h',
                  reason: 'Observa que todos los términos que no contienen h se cancelan exactamente.'
                },
                {
                  title: 'Paso 3: Factorizar h, cancelar y evaluar el límite cuando h → 0',
                  math: 'f\'(x) = \\lim_{h \\to 0} \\frac{h(6x + 3h - 5)}{h} = \\lim_{h \\to 0} (6x + 3h - 5) = 6x - 5',
                  reason: 'Al cancelar el factor h del numerador y denominador, desaparece la indeterminación 0/0 y sustituimos h = 0.'
                }
              ]
            },
            {
              title: 'Ejemplo 2: Derivada por definición de una raíz cuadrada y recta tangente',
              problem: 'Halla $f\'(x)$ por definición para $f(x) = \\sqrt{x}$ y determina la ecuación de la recta tangente en $x_0 = 4$.',
              graphPayload: { kind: 'derivative', expr: 'sqrt(x)', tangentX: 4, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Formar el cociente incremental y racionalizar con el conjugado',
                  math: 'f\'(x) = \\lim_{h \\to 0} \\frac{\\sqrt{x+h} - \\sqrt{x}}{h} \\cdot \\frac{\\sqrt{x+h} + \\sqrt{x}}{\\sqrt{x+h} + \\sqrt{x}} = \\lim_{h \\to 0} \\frac{(x+h) - x}{h(\\sqrt{x+h} + \\sqrt{x})}',
                  reason: 'Multiplicamos por el conjugado del numerador para eliminar las raíces cuadradas mediante diferencia de cuadrados.'
                },
                {
                  title: 'Paso 2: Cancelar h y evaluar el límite',
                  math: 'f\'(x) = \\lim_{h \\to 0} \\frac{1}{\\sqrt{x+h} + \\sqrt{x}} = \\frac{1}{2\\sqrt{x}}',
                  reason: 'Cuando h → 0, √(x+h) tiende a √x, sumando 2√x en el denominador.'
                },
                {
                  title: 'Paso 3: Calcular la pendiente y la recta tangente en x₀ = 4',
                  math: 'f(4) = 2, \\quad m_t = f\'(4) = \\frac{1}{2\\sqrt{4}} = \\frac{1}{4} \\implies y - 2 = \\frac{1}{4}(x - 4) \\implies y = \\frac{1}{4}x + 1',
                  reason: 'Sustituimos el punto (4, 2) y la pendiente m = 1/4 en la ecuación punto-pendiente.'
                }
              ]
            },
            {
              title: 'Ejemplo 3: Razón promedio vs. instantánea en Física y Economía (con unidades)',
              problem: 'a) La altura de un móvil (en metros) es $s(t) = 5t^2 + 3t$ ($t$ en segundos). Halla la velocidad promedio en $[2, 4]$ y la velocidad y aceleración instantáneas en $t = 2\\text{ s}$. b) El costo de producir $q$ piezas es $C(q) = 0.2q^2 + 12q + 500$ dólares; calcula el costo marginal en $q = 50$.',
              graphPayload: { kind: 'derivative', expr: '5*x^2 + 3*x', tangentX: 2, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Razón de cambio promedio en [2, 4]',
                  math: 's(2) = 5(4) + 6 = 26\\text{ m}, \\; s(4) = 5(16) + 12 = 92\\text{ m} \\implies v_{\\text{prom}} = \\frac{92 - 26}{4 - 2} = \\frac{66}{2} = 33\\text{ m/s}',
                  reason: 'La razón promedio divide el desplazamiento neto (metros) entre el lapso transcurrido (segundos).'
                },
                {
                  title: 'Paso 2: Velocidad y aceleración instantáneas en t = 2 s',
                  math: 'v(t) = s\'(t) = 10t + 3 \\implies v(2) = 23\\text{ m/s} \\quad ; \\quad a(t) = v\'(t) = s\'\'(t) = 10\\text{ m/s}^2',
                  reason: 'La primera derivada da velocidad instantánea (m/s) y la segunda derivada da aceleración (m/s²).'
                },
                {
                  title: 'Paso 3: Costo marginal en q = 50 unidades',
                  math: 'C\'(q) = 0.4q + 12 \\implies C\'(50) = 0.4(50) + 12 = 32\\text{ \\$/unidad}',
                  reason: 'El costo marginal C\'(50) = 32 dólares por unidad estima el incremento al producir la pieza número 51 (el costo exacto adicional es C(51)-C(50) = 32.20 $).'
                }
              ]
            },
            {
              title: 'Ejemplo 4: Derivada por definición de 1/x, recta tangente, normal y aproximación lineal',
              problem: 'Para $f(x) = \\frac{1}{x}$ ($x \\neq 0$), halla $f\'(x)$ usando el cociente incremental, obtén las rectas tangente y normal en $x_0 = 2$ y aproxima linealmente $\\frac{1}{2.05}$.',
              graphPayload: { kind: 'derivative', expr: '1/x', tangentX: 2, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Simplificar el cociente incremental de 1/x',
                  math: '\\frac{\\frac{1}{x+h} - \\frac{1}{x}}{h} = \\frac{\\frac{x - (x+h)}{x(x+h)}}{h} = \\frac{-h}{h\\,x(x+h)} = \\frac{-1}{x(x+h)} \\xrightarrow{h\\to 0} f\'(x) = -\\frac{1}{x^2}',
                  reason: 'Con x ≠ 0, al sumar las fracciones se factoriza y cancela h, eliminando la forma 0/0.'
                },
                {
                  title: 'Paso 2: Recta tangente y recta normal en x₀ = 2',
                  math: 'f(2) = 0.5, \\; m_t = f\'(2) = -0.25 \\implies \\text{Tangente: } y = 0.5 - 0.25(x - 2) \\quad ; \\quad m_n = 4 \\implies \\text{Normal: } y = 0.5 + 4(x - 2)',
                  reason: 'Como m_t = -1/4 ≠ 0, la pendiente normal es su recíproca con signo opuesto m_n = 4.'
                },
                {
                  title: 'Paso 3: Aproximación lineal y diferencial para 1/2.05',
                  math: 'dx = 2.05 - 2 = 0.05 \\implies L(2.05) = 0.5 + (-0.25)(0.05) = 0.5 - 0.0125 = 0.4875',
                  reason: 'La variación diferencial dy = -0.0125 permite estimar 1/2.05 ≈ 0.4875 (valor real ≈ 0.487805).'
                }
              ]
            },
            {
              title: 'Ejemplo 5: Estudio mediante derivadas laterales en f(x) = |x - 3|',
              problem: 'Verifica analíticamente con derivadas laterales por qué $f(x) = |x - 3|$ **no** es derivable en $x_0 = 3$, pero sí es derivable en $x_0 = 5$.',
              graphPayload: { kind: 'derivative', expr: 'abs(x - 3)', tangentX: 3, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Calcular derivadas laterales en x₀ = 3',
                  math: 'f\'_-(3) = \\lim_{h \\to 0^-} \\frac{|h| - 0}{h} = \\lim_{h \\to 0^-} \\frac{-h}{h} = -1 \\quad ; \\quad f\'_+(3) = \\lim_{h \\to 0^+} \\frac{h}{h} = +1',
                  reason: 'Para h < 0, |h| = -h, mientras que para h > 0, |h| = h.'
                },
                {
                  title: 'Paso 2: Concluir sobre x₀ = 3 y x₀ = 5',
                  math: 'f\'_-(3) = -1 \\neq +1 = f\'_+(3) \\implies \\nexists f\'(3) \\quad ; \\quad \\text{En } x > 3,\\; f(x) = x - 3 \\implies f\'(5) = 1',
                  reason: 'En x = 3 hay un punto anguloso (esquina); en x = 5 la función coincide localmente con la recta x - 3 de pendiente 1.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Calcular $f(x + h)$ para $f(x) = x^2$ escribiendo $f(x + h) = x^2 + h$.',
              correct: 'Evaluar $f(x + h)$ exige sustituir $x$ por $(x + h)$ dentro de toda la estructura: $f(x + h) = (x + h)^2 = x^2 + 2xh + h^2$.',
              why: 'El argumento de la función es el bloque completo $(x+h)$, no una suma externa.'
            },
            {
              wrong: 'Escribir la ecuación de la recta tangente usando la función derivada completa $f\'(x)$ en vez del número $f\'(x_0)$: $y - f(x_0) = (2x)(x - x_0)$.',
              correct: 'La pendiente $m_t = f\'(x_0)$ debe ser un **número constante** evaluado en $x_0$: $y - f(x_0) = f\'(x_0)(x - x_0)$.',
              why: 'Si dejas $x$ en la pendiente, la ecuación resultante será una parábola o curva de grado superior, no una línea recta.'
            }
          ],
          exercises: [
            {
              id: 'der-1-ex1',
              level: 'basico',
              statement: 'Al aplicar la definición por límite a $f(x) = x^2 + 4x$, ¿qué expresión simplificada queda dentro del límite después de desarrollar $f(x+h)-f(x)$ y dividir entre $h$ (antes de hacer $h \\to 0$)? Escribe en términos de $x$ y $h$, o escribe la derivada final si $h=0$. (Aquí pide la derivada final $f\'(x)$).',
              answer: '2*x + 4',
              alternatives: ['2x+4', '2*x+4', '4+2x'],
              placeholder: 'Ej: 2x + 4',
              hints: [
                'Desarrolla $f(x+h) = (x+h)^2 + 4(x+h) = x^2 + 2xh + h^2 + 4x + 4h$.',
                'Al restar $f(x) = x^2 + 4x$, queda $2xh + h^2 + 4h = h(2x + h + 4)$.',
                'Divide entre $h$ y toma el límite cuando $h \\to 0$.'
              ],
              solutionSteps: [
                '$\\frac{f(x+h)-f(x)}{h} = \\frac{h(2x + h + 4)}{h} = 2x + h + 4$.',
                'Al tomar $\\lim_{h \\to 0} (2x + h + 4)$, obtenemos $f\'(x) = 2x + 4$.'
              ],
              reviewTip: 'Revisa el desarrollo del binomio al cuadrado $(x+h)^2 = x^2 + 2xh + h^2$ y la cancelación del factor común $h$.',
              whyCorrect: '¡Correcto! El cociente incremental simplificado $2x + h + 4$ converge a $2x + 4$ cuando $h \\to 0$.'
            },
            {
              id: 'der-1-ex2',
              level: 'intermedio',
              statement: 'Determina la pendiente $m_t$ de la recta tangente a la curva $f(x) = 2x^2 - 3x + 5$ en el punto de abscisa $x_0 = 3$.',
              answer: '9',
              alternatives: ['9'],
              placeholder: 'Valor numérico de la pendiente m_t...',
              hints: [
                'Halla primero la función derivada $f\'(x)$ de $2x^2 - 3x + 5$.',
                'La función derivada es $f\'(x) = 4x - 3$.',
                'Evalúa $f\'(3) = 4(3) - 3$.'
              ],
              solutionSteps: [
                'Derivando: $f\'(x) = 4x - 3$.',
                'Evaluando en el punto de tangencia $x_0 = 3$: $m_t = f\'(3) = 4(3) - 3 = 12 - 3 = 9$.'
              ],
              reviewTip: 'Recuerda que la pendiente de la recta tangente en $x_0$ es el valor de la derivada $f\'(x_0)$, no el valor de la función original $f(x_0)$.',
              whyCorrect: '¡Excelente! En $x_0 = 3$, la curva sube a razón instantánea de $9$ unidades verticales por cada unidad horizontal.'
            },
            {
              id: 'der-1-ex3',
              level: 'avanzado',
              statement: 'La posición de un móvil (en metros) a los $t$ segundos está dada por $s(t) = t^3 - 6t^2 + 15t + 2$ (usa la variable $x$ o calcula el valor numérico). Calcula la velocidad instantánea (en m/s) en el instante $t = 4$ segundos.',
              answer: '15',
              alternatives: ['15'],
              placeholder: 'Velocidad instantánea en t = 4...',
              hints: [
                'La velocidad instantánea es la derivada de la posición: $v(t) = s\'(t)$.',
                'Derivando término a término: $v(t) = 3t^2 - 12t + 15$.',
                'Sustituye $t = 4$ en la expresión de $v(t)$.'
              ],
              solutionSteps: [
                'Calculamos la función de velocidad instantánea: $v(t) = s\'(t) = 3t^2 - 12t + 15$.',
                'Evaluamos en $t = 4$: $v(4) = 3(4)^2 - 12(4) + 15 = 48 - 48 + 15 = 15\\text{ m/s}$.'
              ],
              reviewTip: 'Deriva cada potencia de $t$ y verifica cuidadosamente la aritmética al sustituir $t = 4$: $3(16) - 12(4) + 15$.',
              whyCorrect: '¡Perfecto! La razón de cambio instantánea de la posición respecto al tiempo nos da la velocidad exacta en $t = 4\\text{ s}$.'
            },
            {
              id: 'der-1-ex4',
              level: 'intermedio',
              statement: 'Usando la aproximación lineal $L(x) = f(a) + f\'(a)(x - a)$ de $f(x) = x^2$ centrada en $a = 3$, calcula la aproximación de $(3.02)^2$.',
              answer: '9.12',
              alternatives: ['9.12', '228/25'],
              placeholder: 'Ej: 9.12',
              hints: [
                'Calcula $f(3) = 9$ y $f\'(3) = 2(3) = 6$.',
                'El incremento es $dx = x - a = 3.02 - 3 = 0.02$.',
                'Evalúa $L(3.02) = 9 + 6(0.02)$.'
              ],
              solutionSteps: [
                'Como $f(x) = x^2$, tenemos $f(3) = 9$ y $f\'(x) = 2x \\implies f\'(3) = 6$.',
                'Aplicamos $L(3.02) = 9 + 6(3.02 - 3) = 9 + 6(0.02) = 9 + 0.12 = 9.12$.'
              ],
              reviewTip: 'Aplica $L(3.02) = f(3) + f\'(3)(0.02)$ usando el diferencial $dy = 6 \\cdot 0.02 = 0.12$.',
              whyCorrect: '¡Correcto! La linealización en $a = 3$ da $9.12$, sumamente cercana al valor exacto $(3.02)^2 = 9.1204$.'
            },
            {
              id: 'der-1-ex5',
              level: 'avanzado',
              statement: 'El costo total en dólares de fabricar $x$ artículos sigue $C(x) = 0.5x^2 + 10x + 200$. Calcula el **costo marginal** $C\'(20)$ en dólares por artículo cuando $x = 20$.',
              answer: '30',
              alternatives: ['30'],
              placeholder: 'Costo marginal en x = 20...',
              hints: [
                'El costo marginal es la función derivada $C\'(x)$.',
                'Derivando: $C\'(x) = 0.5(2x) + 10 = x + 10$.',
                'Evalúa $C\'(20)$.'
              ],
              solutionSteps: [
                'Derivamos $C(x)$: $C\'(x) = x + 10$.',
                'Evaluando en $x = 20$: $C\'(20) = 20 + 10 = 30$ dólares/artículo.'
              ],
              reviewTip: 'La derivada de $0.5x^2$ es $1.0x = x$; la constante $200$ tiene derivada cero.',
              whyCorrect: '¡Muy bien! En $x = 20$, producir una unidad adicional incrementa el costo aproximadamente en 30 dólares.'
            }
          ],
          quiz: [
            {
              question: '¿Qué representa geométricamente el límite $\\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}$?',
              options: [
                'La pendiente de la recta tangente a la curva y = f(x) en el punto x = x₀',
                'La pendiente de la recta secante entre x = 0 y x = h',
                'El área encerrada bajo la curva y = f(x)',
                'La ordenada al origen de la curva original'
              ],
              correctIndex: 0,
              explanation: 'Cuando $h \\to 0$, las rectas secantes que pasan por $(x_0, f(x_0))$ y $(x_0+h, f(x_0+h))$ convergen hacia la recta tangente, y sus pendientes convergen a $f\'(x_0)$.'
            },
            {
              question: 'Si una función $f(x)$ es derivable en $x = a$, ¿cuál de las siguientes afirmaciones es siempre verdadera?',
              options: [
                'La función f(x) es obligatoriamente continua en x = a',
                'La derivada f\'(a) vale siempre cero',
                'La gráfica tiene una esquina angulosa en x = a',
                'La función no tiene límite cuando x tiende a a'
              ],
              correctIndex: 0,
              explanation: 'Un teorema fundamental del cálculo establece que toda función derivable en un punto es necesariamente continua en dicho punto.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           DER-2: REGLAS DE DERIVACIÓN Y REGLA DE LA CADENA
           ------------------------------------------------------------------ */
        {
          id: 'der-2',
          title: 'Reglas de Derivación: Potencia, Suma/Resta, Producto, Cociente y Regla de la Cadena',
          summary: 'Álgebra de derivadas, reescritura de radicales y exponentes negativos, y derivación de funciones compuestas.',
          graphPreset: 'x^3 - 3*x',
          demoAnimations: ['der-construccion-fprima', 'der-secante-tangente'],
          interactiveGraph: {
            mode: 'derivatives',
            title: 'Explorador de Función Original f(x) y su Función Derivada f\'(x)',
            description: 'Observa simultáneamente la curva original f(x) (azul) y su función derivada f\'(x) (línea punteada violeta). Comprueba que la ordenada de f\'(x₀) coincide exactamente con la pendiente de la recta tangente.',
            fn: 'x^3 - 3*x',
            x0: 1.0,
            h: 0.6,
            xDomain: [-3.5, 3.5],
            yDomain: [-5, 6],
            presets: [
              { label: 'Polinomio: x³ - 3x', fn: 'x^3 - 3*x', x0: 1.0, h: 0.6 },
              { label: 'Cociente: (2x)/(x² + 1)', fn: '(2*x)/(x^2 + 1)', x0: 0.5, h: 0.5 },
              { label: 'Compuesta: (x² - 1)²', fn: '(x^2 - 1)^2', x0: 1.2, h: 0.4 }
            ]
          },
          theory: {
            intro: [
              'Calcular derivadas aplicando cada vez el límite del cociente incremental sería sumamente largo para funciones complejas. Afortunadamente, al demostrar dicho límite para las operaciones algebraicas generales se obtienen las **Reglas de Derivación**, que permiten derivar cualquier combinación de funciones de manera directa y sistemática.',
              'Junto con las reglas de linealidad, producto y cociente, estudiaremos aquí la **Regla de la Cadena**, la herramienta central para derivar funciones compuestas del tipo $y = f(g(x))$.'
            ],
            prerequisites: [
              'Leyes de los exponentes para reescribir raíces y fracciones antes de derivar: $\\frac{1}{x^n} = x^{-n}$ y $\\sqrt[m]{x^n} = x^{n/m}$.',
              'Identificación de funciones compuestas: distinguir claramente la función exterior $f(u)$ y la función interior $u = g(x)$.'
            ],
            detailedExplanation: [
              '**1. Reescritura algebraica previa:** Antes de aplicar la regla del cociente o de la potencia, verifica si puedes reescribir la expresión como potencia simple. Por ejemplo, para derivar $f(x) = \\frac{5}{x^3} + \\sqrt{x}$, es mucho más rápido reescribirla como $f(x) = 5x^{-3} + x^{1/2}$ y aplicar la regla de la potencia: $f\'(x) = -15x^{-4} + \\frac{1}{2}x^{-1/2} = -\\frac{15}{x^4} + \\frac{1}{2\\sqrt{x}}$.',
              '**2. ¿Por qué la derivada de un producto NO es el producto de las derivadas?** Si imaginas un rectángulo de lados variables $u(x)$ y $v(x)$, su área es $A = u \\cdot v$. Cuando $x$ aumenta ligeramente, el área crece por dos franjas: una de área $du \\cdot v$ y otra de área $u \\cdot dv$. Por ello, $(u \\cdot v)\' = u\'v + uv\'$.',
              '**3. La Regla de la Cadena (de afuera hacia adentro):** Si $y$ depende de $u$ y a su vez $u$ depende de $x$, la razón de cambio se multiplica en cadena: $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$. En la práctica, derivas la operación exterior manteniendo intacto el argumento interior $g(x)$, y multiplicas el resultado por la derivada $g\'(x)$ de dicho argumento interior.'
            ],
            concepts: [
              {
                title: '1. Regla de la Constante, Potencia y Suma/Resta',
                body: '- **Constante:** $\\frac{d}{dx}(c) = 0$.\n- **Potencia Real:** Para todo $n \\in \\mathbb{R}$, $\\frac{d}{dx}(x^n) = n \\cdot x^{n-1}$.\n- **Linealidad (Suma y Resta):** $\\frac{d}{dx}[a\\,f(x) \\pm b\\,g(x)] = a\\,f\'(x) \\pm b\\,g\'(x)$.'
              },
              {
                title: '2. Regla del Producto',
                body: 'La derivada del producto de dos funciones derivables $u(x)$ y $v(x)$ es: $$\\frac{d}{dx}[u(x) \\cdot v(x)] = u\'(x) \\cdot v(x) + u(x) \\cdot v\'(x)$$ En palabras: *"la derivada de la primera por la segunda sin derivar, más la primera sin derivar por la derivada de la segunda"*.'
              },
              {
                title: '3. Regla del Cociente',
                body: 'Si $v(x) \\neq 0$, la derivada del cociente $\\frac{u(x)}{v(x)}$ es: $$\\frac{d}{dx}\\left[\\frac{u(x)}{v(x)}\\right] = \\frac{u\'(x) \\cdot v(x) - u(x) \\cdot v\'(x)}{[v(x)]^2}$$ Nota que el signo negativo precede al término $u \\cdot v\'$, por lo que el orden en el numerador es estricto.'
              },
              {
                title: '4. Regla de la Cadena y Regla General de las Potencias',
                body: 'Para la función compuesta $h(x) = f(g(x))$: $$h\'(x) = f\'(g(x)) \\cdot g\'(x)$$ En particular, si $y = [u(x)]^n$, entonces: $$y\' = n \\cdot [u(x)]^{n-1} \\cdot u\'(x)$$'
              }
            ],
            theorems: [
              {
                badge: 'Reglas Básicas',
                title: 'Linealidad, Regla del Producto y Regla del Cociente',
                hypothesis: 'Sean $u$ y $v$ derivables en $x$, y $a, b \\in \\mathbb{R}$ constantes. Para la regla del cociente se exige además $v(x) \\neq 0$.',
                statement: '$(a u + b v)\' = a u\' + b v\'$, $(u v)\' = u\'v + uv\'$ y $\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}$.',
                proofSteps: [
                  'Linealidad: $\\frac{[a u(x+h)+b v(x+h)] - [a u(x)+b v(x)]}{h} = a\\frac{u(x+h)-u(x)}{h} + b\\frac{v(x+h)-v(x)}{h} \\xrightarrow{h\\to 0} a u\'(x) + b v\'(x)$.',
                  'Producto: sumamos y restamos $u(x)v(x+h)$ en el numerador: $\\frac{u(x+h)v(x+h)-u(x)v(x)}{h} = \\frac{u(x+h)-u(x)}{h}v(x+h) + u(x)\\frac{v(x+h)-v(x)}{h}$. Como $v$ es derivable en $x$, es continua en $x$, luego $\\lim_{h\\to 0} v(x+h) = v(x)$ y el límite total es $u\'(x)v(x) + u(x)v\'(x)$.',
                  'Cociente: primero para $1/v(x)$ ($v(x)\\neq 0$ implica $v(x+h)\\neq 0$ cerca de $h=0$): $\\frac{\\frac{1}{v(x+h)}-\\frac{1}{v(x)}}{h} = -\\frac{v(x+h)-v(x)}{h} \\cdot \\frac{1}{v(x)v(x+h)} \\xrightarrow{h\\to 0} -\\frac{v\'(x)}{[v(x)]^2}$. Aplicando luego la regla del producto a $u \\cdot \\frac{1}{v}$ resulta $\\frac{u\'v - uv\'}{v^2}$. $\\blacksquare$'
                ]
              },
              {
                badge: 'Teorema Central',
                title: 'Regla de la Cadena',
                hypothesis: 'Sea $g$ derivable en $x$ y sea $f$ derivable en $u = g(x)$.',
                statement: 'La función compuesta $F(x) = f(g(x))$ es derivable en $x$ y su derivada cumple $F\'(x) = f\'(g(x)) \\cdot g\'(x)$.',
                proofSteps: [
                  'Definimos la función auxiliar de error $\\varepsilon(k) = \\frac{f(u+k) - f(u)}{k} - f\'(u)$ para $k \\neq 0$ y $\\varepsilon(0) = 0$. Como $f$ es derivable en $u$, $\\lim_{k\\to 0}\\varepsilon(k) = 0$, luego $\\varepsilon$ es continua en $0$.',
                  'Para todo $k$, incluso $k = 0$, se verifica exactamente $f(u+k) - f(u) = [f\'(u) + \\varepsilon(k)] \\cdot k$.',
                  'Tomando $k = g(x+h) - g(x)$ (donde $\\lim_{h\\to 0} k = 0$ por continuidad de $g$) y dividiendo por $h \\neq 0$: $\\frac{f(g(x+h)) - f(g(x))}{h} = [f\'(g(x)) + \\varepsilon(k)] \\cdot \\frac{g(x+h) - g(x)}{h}$.',
                  'Al tomar $h \\to 0$, $k \\to 0$, por continuidad $\\varepsilon(k) \\to 0$ y obtenemos $f\'(g(x)) \\cdot g\'(x)$. $\\blacksquare$'
                ],
                note: 'El uso de $\\varepsilon(k)$ evita la división errónea entre $g(x+h)-g(x)$ cuando $g$ oscila alrededor de $x$.'
              }
            ],
            formulas: [
              {
                label: 'Producto y Cociente',
                expr: '(u \\cdot v)\' = u\'v + uv\' \\quad ; \\quad \\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}',
                note: 'En el cociente, recuerda agrupar con paréntesis el término u·v\' para distribuir el signo menos.'
              },
              {
                label: 'Regla de la Cadena (Notación de Lagrange y de Leibniz)',
                expr: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x) \\quad ; \\quad \\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}',
                note: 'Si hay tres niveles f(g(h(x))), se encadenan tres factores: f\'(g(h(x))) · g\'(h(x)) · h\'(x).'
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo 1: Derivación con exponentes fraccionarios y negativos',
              problem: 'Halla la derivada de $f(x) = 4\\sqrt{x} - \\frac{6}{x^2} + 3x^4$.',
              steps: [
                {
                  title: 'Paso 1: Reescribir raíces y fracciones como potencias de x',
                  math: 'f(x) = 4x^{1/2} - 6x^{-2} + 3x^4',
                  reason: 'Usamos √x = x^(1/2) y 1/x² = x^(-2) para aplicar directamente la regla de la potencia.'
                },
                {
                  title: 'Paso 2: Derivar término a término restando 1 a cada exponente',
                  math: 'f\'(x) = 4\\left(\\frac{1}{2}x^{-1/2}\\right) - 6(-2x^{-3}) + 3(4x^3) = 2x^{-1/2} + 12x^{-3} + 12x^3',
                  reason: 'Observa el cambio de signo en -6(-2) = +12 y que -2 - 1 = -3.'
                },
                {
                  title: 'Paso 3: Devolver a exponentes positivos y radicales',
                  math: 'f\'(x) = \\frac{2}{\\sqrt{x}} + \\frac{12}{x^3} + 12x^3',
                  reason: 'Expresamos el resultado final sin exponentes negativos.'
                }
              ]
            },
            {
              title: 'Ejemplo 2: Regla del Cociente y Regla de la Cadena',
              problem: 'Deriva a) $g(x) = \\frac{3x - 1}{x^2 + 2}$ y b) $h(x) = \\sqrt{5x^2 + 4}$.',
              steps: [
                {
                  title: 'Paso 1: Aplicar regla del cociente en a) con u = 3x - 1 y v = x² + 2',
                  math: 'g\'(x) = \\frac{(3)(x^2 + 2) - (3x - 1)(2x)}{(x^2 + 2)^2} = \\frac{3x^2 + 6 - 6x^2 + 2x}{(x^2 + 2)^2} = \\frac{-3x^2 + 2x + 6}{(x^2 + 2)^2}',
                  reason: 'Como u\' = 3 y v\' = 2x, desarrollamos el numerador y reducimos términos semejantes.'
                },
                {
                  title: 'Paso 2: Aplicar regla de la cadena en b) reescribiendo h(x) = (5x² + 4)^(1/2)',
                  math: 'h\'(x) = \\frac{1}{2}(5x^2 + 4)^{-1/2} \\cdot (10x) = \\frac{5x}{\\sqrt{5x^2 + 4}}',
                  reason: 'Multiplicamos la derivada exterior 1/(2√u) por la derivada interna u\' = 10x y simplificamos 10/2 = 5.'
                }
              ]
            },
            {
              title: 'Ejemplo 3: Regla del producto con factorización de la exponencial',
              problem: 'Halla $f\'(x)$ para $f(x) = (x^2 + 1)e^x$ y evalúa $f\'(0)$ y $f\'(1)$.',
              graphPayload: { kind: 'derivative', expr: '(x^2 + 1)*exp(x)', tangentX: 0, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Identificar factores y derivar con (uv)\' = u\'v + uv\'',
                  math: 'u = x^2 + 1 \\; (u\' = 2x), \\quad v = e^x \\; (v\' = e^x) \\implies f\'(x) = (2x)e^x + (x^2 + 1)e^x',
                  reason: 'Derivamos cada factor sin olvidar que eˣ es su propia derivada.'
                },
                {
                  title: 'Paso 2: Factorizar eˣ y evaluar en x = 0 y x = 1',
                  math: 'f\'(x) = (x^2 + 2x + 1)e^x = (x + 1)^2 e^x \\implies f\'(0) = 1, \\quad f\'(1) = 4e',
                  reason: 'Factorizar permite ver inmediatamente que f\'(x) ≥ 0 para todo x ∈ ℝ, luego f es creciente en todo ℝ.'
                }
              ]
            },
            {
              title: 'Ejemplo 4: Regla de la cadena combinada con regla del cociente',
              problem: 'Deriva $f(x) = \\left(\\frac{2x - 1}{x + 1}\\right)^3$ ($x \\neq -1$) y evalúa la pendiente tangente en $x = 2$.',
              graphPayload: { kind: 'derivative', expr: '((2*x - 1)/(x + 1))^3', tangentX: 2, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Derivar la potencia exterior y multiplicar por la derivada interna del cociente',
                  math: 'f\'(x) = 3\\left(\\frac{2x - 1}{x + 1}\\right)^2 \\cdot \\left(\\frac{2x - 1}{x + 1}\\right)\'',
                  reason: 'Aplicamos primero la regla de la potencia u³ → 3u²·u\'.'
                },
                {
                  title: 'Paso 2: Derivar el cociente interno y simplificar',
                  math: '\\left(\\frac{2x - 1}{x + 1}\\right)\' = \\frac{2(x + 1) - (2x - 1)(1)}{(x + 1)^2} = \\frac{3}{(x + 1)^2} \\implies f\'(x) = \\frac{9(2x - 1)^2}{(x + 1)^4}',
                  reason: 'Multiplicamos las fracciones algebraicas combinando potencias del denominador (x+1)²·(x+1)².'
                },
                {
                  title: 'Paso 3: Evaluar en x = 2',
                  math: 'f\'(2) = \\frac{9(2(2) - 1)^2}{(2 + 1)^4} = \\frac{9 \\cdot 9}{81} = 1',
                  reason: 'En x = 2 la curva tiene una recta tangente con pendiente exactamente igual a 1.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Derivar un producto o cociente derivando cada parte por separado: $(x^2 \\cdot \\text{sen}(x))\' = 2x \\cdot \\cos(x)$ o $\\left(\\frac{u}{v}\\right)\' = \\frac{u\'}{v\'}$.',
              correct: 'Debes aplicar siempre $(uv)\' = u\'v + uv\'$ y $\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}$.',
              why: 'El operador derivada es lineal para sumas y restas, pero NO es distributivo respecto a la multiplicación ni la división.'
            },
            {
              wrong: 'Olvidar multiplicar por la derivada interna $g\'(x)$ al usar la regla de la cadena: $\\frac{d}{dx}[(3x^2 + 1)^5] = 5(3x^2 + 1)^4$.',
              correct: 'Multiplicar por la derivada del interior $(3x^2 + 1)\' = 6x$: $\\frac{d}{dx}[(3x^2 + 1)^5] = 5(3x^2 + 1)^4 \\cdot (6x) = 30x(3x^2 + 1)^4$.',
              why: 'La tasa de cambio total depende tanto de la potencia exterior como de la rapidez con que cambia el argumento interno.'
            }
          ],
          exercises: [
            {
              id: 'der-2-ex1',
              level: 'basico',
              statement: 'Obtén la función derivada $f\'(x)$ del polinomio: $f(x) = 4x^3 - 6x^2 + 9x - 11$',
              answer: '12*x^2 - 12*x + 9',
              alternatives: ['12x^2-12x+9', '12*x^2-12*x+9'],
              placeholder: 'Ej: 12x^2 - 12x + 9',
              hints: [
                'Aplica la regla de la potencia $(x^n)\' = n\\cdot x^{n-1}$ a cada término.',
                'La derivada de $4x^3$ es $12x^2$, la de $-6x^2$ es $-12x$ y la de $9x$ es $9$.',
                'La derivada de la constante $-11$ es $0$.'
              ],
              solutionSteps: [
                '$(4x^3)\' = 12x^2$, $(-6x^2)\' = -12x$, $(9x)\' = 9$, $(-11)\' = 0$.',
                'Resultado: $f\'(x) = 12x^2 - 12x + 9$.'
              ],
              reviewTip: 'Multiplica cada coeficiente por su exponente actual y disminuye el exponente en una unidad.',
              whyCorrect: '¡Muy bien! Aplicaste correctamente la linealidad y la regla de la potencia término a término.'
            },
            {
              id: 'der-2-ex2',
              level: 'intermedio',
              statement: 'Deriva usando la regla del cociente la función $f(x) = \\frac{2x + 3}{x + 1}$ y expresa el resultado simplificado.',
              answer: '-1/(x + 1)^2',
              alternatives: ['-1/((x+1)^2)', '-1/(x+1)^2', '-(x+1)^(-2)'],
              placeholder: 'Ej: -1/(x + 1)^2',
              hints: [
                'Identifica $u = 2x + 3$ ($u\' = 2$) y $v = x + 1$ ($v\' = 1$).',
                'Sustituye en $\\frac{u\'v - uv\'}{v^2} = \\frac{2(x + 1) - (2x + 3)(1)}{(x + 1)^2}$.',
                'Simplifica el numerador: $2x + 2 - 2x - 3$.'
              ],
              solutionSteps: [
                'Por la regla del cociente: $f\'(x) = \\frac{2(x+1) - 1(2x+3)}{(x+1)^2}$.',
                'Simplificando el numerador: $2x + 2 - 2x - 3 = -1$.',
                'Resultado: $f\'(x) = \\frac{-1}{(x + 1)^2}$.'
              ],
              reviewTip: 'Revisa la fórmula del cociente $\\frac{u\'v - uv\'}{v^2}$ y distribuye el signo menos delante de $(2x + 3)$.',
              whyCorrect: '¡Excelente! Al desarrollar y cancelar $2x - 2x$ en el numerador, la expresión se reduce limpiamente a $-1/(x+1)^2$.'
            },
            {
              id: 'der-2-ex3',
              level: 'avanzado',
              statement: 'Aplica la regla de la cadena para derivar $f(x) = (x^2 + 3x - 2)^4$ y evalúa el valor numérico exacto de $f\'(1)$.',
              answer: '160',
              alternatives: ['160'],
              placeholder: 'Valor numérico de f\'(1)...',
              hints: [
                'Por la regla general de las potencias: $f\'(x) = 4(x^2 + 3x - 2)^3 \\cdot (2x + 3)$.',
                'Evalúa el interior en $x = 1$: $1^2 + 3(1) - 2 = 2$.',
                'Evalúa la derivada interna en $x = 1$: $2(1) + 3 = 5$, y multiplica $4 \\cdot (2)^3 \\cdot 5$.'
              ],
              solutionSteps: [
                'Aplicando la regla de la cadena: $f\'(x) = 4(x^2 + 3x - 2)^3(2x + 3)$.',
                'En $x = 1$: $f\'(1) = 4(1 + 3 - 2)^3(2 + 3) = 4(2)^3(5) = 4 \\cdot 8 \\cdot 5 = 160$.'
              ],
              reviewTip: 'No olvides multiplicar $4 u^3$ por la derivada interna $u\'(1) = 2(1) + 3 = 5$.',
              whyCorrect: '¡Impecable! Encadenaste correctamente la derivada exterior $4u^3$ con la derivada interior $u\' = 2x + 3$.'
            },
            {
              id: 'der-2-ex4',
              level: 'avanzado',
              statement: 'Dada la función producto-compuesta $h(x) = (2x - 1)^3 \\cdot (x + 1)$, calcula el valor numérico exacto de $h\'(1)$.',
              answer: '13',
              alternatives: ['13'],
              placeholder: 'Valor numérico de h\'(1)...',
              hints: [
                'Aplica la regla del producto $(u\\cdot v)\' = u\'v + uv\'$ con $u = (2x - 1)^3$ y $v = x + 1$.',
                'Para $u\'$, usa la regla de la cadena: $u\' = 3(2x - 1)^2 \\cdot 2 = 6(2x - 1)^2$.',
                'Evalúa $h\'(1) = 6(1)^2(2) + (1)^3(1)$.'
              ],
              solutionSteps: [
                'Derivando por producto y cadena: $h\'(x) = 6(2x - 1)^2(x + 1) + (2x - 1)^3(1)$.',
                'En $x = 1$: $h\'(1) = 6(2 - 1)^2(1 + 1) + (2 - 1)^3 = 6(1)(2) + 1 = 12 + 1 = 13$.'
              ],
              reviewTip: 'Recuerda combinar la regla del producto con el factor interno $2$ proveniente de $(2x-1)\'$.',
              whyCorrect: '¡Correcto! Combinaste regla del producto y regla de la cadena sin omitir el factor interno.'
            },
            {
              id: 'der-2-ex5',
              level: 'avanzado',
              statement: 'Un vehículo autónomo se mueve sobre una pista recta con posición $s(t) = (t^2 + 1)^2\\text{ metros}$ en el instante $t$ (segundos). Usa la regla de la cadena para calcular su velocidad instantánea $s\'(2)$ en $\\text{m/s}$.',
              answer: '40',
              alternatives: ['40'],
              placeholder: 'Velocidad en m/s...',
              whyCorrect: 'Por regla de la cadena, $s\'(t) = 2(t^2 + 1)(2t) = 4t(t^2 + 1)$. Al evaluar en $t = 2$ resulta $4(2)(4 + 1) = 8 \\cdot 5 = 40\\text{ m/s}$.',
              reviewTip: 'No olvides multiplicar la derivada exterior $2u$ por la derivada interior $u\' = 2t$.',
              hints: [
                'Toma $u = t^2 + 1$ con $u\' = 2t$.',
                'Aplica la cadena: $s\'(t) = 2(t^2 + 1) \\cdot 2t$.',
                'Sustituye $t = 2$ y opera.'
              ],
              solutionSteps: [
                'Derivada: $s\'(t) = 2(t^2 + 1) \\cdot (2t) = 4t(t^2 + 1)$.',
                'Velocidad en $t = 2$: $s\'(2) = 4(2)(2^2 + 1) = 8(5) = 40\\text{ m/s}$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es la derivada de $f(x) = \\sqrt{3x^2 + 1}$?',
              options: [
                '3x / √(3x² + 1)',
                '1 / (2√(3x² + 1))',
                '6x / √(3x² + 1)',
                '1 / (2√(6x))'
              ],
              correctIndex: 0,
              explanation: 'Como $(\\sqrt{u})\' = \\frac{u\'}{2\\sqrt{u}}$ y $u\' = 6x$, obtenemos $\\frac{6x}{2\\sqrt{3x^2+1}} = \\frac{3x}{\\sqrt{3x^2+1}}$.'
            },
            {
              question: 'Al reescribir $f(x) = \\frac{4}{x^3}$ como $4x^{-3}$, ¿cuál es su derivada $f\'(x)$?',
              options: [
                '-12 / x⁴',
                '-12 / x²',
                '4 / (3x²)',
                '12 / x⁴'
              ],
              correctIndex: 0,
              explanation: 'Aplicando la regla de la potencia: $4(-3)x^{-3-1} = -12x^{-4} = -\\frac{12}{x^4}$.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           DER-3: DERIVADAS TRASCENDENTES, DERIVACIÓN IMPLÍCITA Y RECTAS TANGENTE Y NORMAL
           ------------------------------------------------------------------ */
        {
          id: 'der-3',
          title: 'Derivadas Trigonométricas, Exponenciales, Logarítmicas, Implícita y Rectas Tangente y Normal',
          summary: 'Derivación de funciones trascendentes con regla de la cadena, ecuaciones implícitas F(x,y)=0 y geometría de la recta normal.',
          graphPreset: 'sin(x) + 0.5*cos(2*x)',
          demoAnimations: ['der-secante-tangente', 'der-construccion-fprima'],
          interactiveGraph: {
            mode: 'derivatives',
            title: 'Geometría Diferencial: Recta Tangente y Recta Normal Ortogonal',
            description: 'Observa en el punto de contacto P(x₀, f(x₀)) la Recta Tangente (pendiente m_t = f\'(x₀)) y la Recta Normal perpendicular (línea punteada verde con pendiente m_n = -1/f\'(x₀)).',
            fn: 'sin(x) + 0.5*cos(2*x)',
            x0: 0.6,
            h: 0.4,
            xDomain: [-4, 4],
            yDomain: [-3, 3.5],
            presets: [
              { label: 'Trigonométrica: sen(x) + 0.5·cos(2x)', fn: 'sin(x) + 0.5*cos(2*x)', x0: 0.6, h: 0.4 },
              { label: 'Exponencial amortiguada: e^(-0.4x)·cos(2x)', fn: 'exp(-0.4*x)*cos(2*x)', x0: 0.5, h: 0.3 },
              { label: 'Logarítmica: ln(x² + 1)', fn: 'ln(x^2 + 1)', x0: 1.0, h: 0.5 }
            ]
          },
          theory: {
            intro: [
              'Los fenómenos periódicos, el crecimiento exponencial y las escalas logarítmicas requieren dominar las derivadas de las **funciones trascendentes** (trigonométricas, exponenciales y logarítmicas), combinadas siempre con la Regla de la Cadena.',
              'Además, muchas curvas geométricas fundamentales —como la circunferencia $x^2 + y^2 = r^2$, la elipse o el folio de Descartes— no están despejadas en la forma explícita $y = f(x)$. Mediante la **Derivación Implícita** aprenderemos a hallar $\\frac{dy}{dx}$ directamente sin necesidad de despejar $y$, lo que nos permitirá trazar tanto la **recta tangente** como la **recta normal** en cualquier punto de la curva.'
            ],
            prerequisites: [
              'Identidades trigonométricas y valores notables de seno, coseno y tangente en radianes.',
              'Propiedades de los logaritmos ($\ln(A \\cdot B) = \ln A + \ln B$, $\ln(A^n) = n\ln A$) que simplifican enormemente la derivación.',
              'Condición de perpendicularidad entre dos rectas en el plano: dos rectas son ortogonales si sus pendientes cumplen $m_1 \\cdot m_2 = -1$.'
            ],
            detailedExplanation: [
              '**1. Derivadas trigonométricas (en radianes):** Usando el límite fundamental $\\lim_{h \\to 0} \\frac{\\text{sen}(h)}{h} = 1$, se demuestra que $(\\text{sen}(x))\' = \\cos(x)$ y $(\\cos(x))\' = -\\text{sen}(x)$. Nota un patrón mnemotécnico universal: las tres **co-funciones** (coseno, cotangente y cosecante) llevan siempre **signo negativo** en su derivada.',
              '**2. Derivadas exponenciales y logarítmicas:** La función exponencial natural $f(x) = e^x$ tiene la propiedad única de ser su propia derivada: $(e^x)\' = e^x$. Si el exponente es una función $u(x)$, por regla de la cadena $(e^{u})\' = e^{u} \\cdot u\'$. Por su parte, la derivada del logaritmo natural compuesto es $(\\ln(u(x)))\' = \\frac{u\'(x)}{u(x)}$, es decir, la derivada del argumento dividida entre el argumento sin derivar.',
              '**3. Procedimiento de Derivación Implícita:** Cuando una ecuación relaciona $x$ e $y$ (por ejemplo, $x^2 + y^3 = 10$), concebimos a $y$ como una función implícita $y(x)$:\n- **Paso 1:** Deriva ambos miembros respecto a $x$. Cada vez que derives un término con $y$, aplica la regla de la cadena multiplicando por $y\' = \\frac{dy}{dx}$ (así, $\\frac{d}{dx}(y^3) = 3y^2 \\cdot y\'$).\n- **Paso 2:** Agrupa en el lado izquierdo todos los términos que contengan $y\'$ y pasa los demás al lado derecho.\n- **Paso 3:** Factoriza $y\'$ y despeja $y\' = \\frac{dy}{dx}$.'
            ],
            concepts: [
              {
                title: '1. Formulario Trigonométrico con Regla de la Cadena',
                body: 'Sea $u = u(x)$ una función derivable:\n- $(\\text{sen}(u))\' = \\cos(u) \\cdot u\'$\n- $(\\cos(u))\' = -\\text{sen}(u) \\cdot u\'$\n- $(\\tan(u))\' = \\sec^2(u) \\cdot u\'$\n- $(\\cot(u))\' = -\\csc^2(u) \\cdot u\'$\n- $(\\sec(u))\' = \\sec(u)\\tan(u) \\cdot u\'$\n- $(\\csc(u))\' = -\\csc(u)\\cot(u) \\cdot u\'$'
              },
              {
                title: '2. Derivadas Exponenciales y Logarítmicas',
                body: '- **Exponencial natural:** $\\frac{d}{dx}\\left(e^{u(x)}\\right) = e^{u(x)} \\cdot u\'(x)$.\n- **Exponencial en base $a > 0$:** $\\frac{d}{dx}\\left(a^{u(x)}\\right) = a^{u(x)} \\cdot \\ln(a) \\cdot u\'(x)$.\n- **Logaritmo natural:** $\\frac{d}{dx}[\\ln(u(x))] = \\frac{u\'(x)}{u(x)}$.'
              },
              {
                title: '3. Derivación Implícita en Ecuaciones F(x, y) = 0',
                body: 'Al derivar respecto a $x$: $\\frac{d}{dx}[g(y)] = g\'(y) \\cdot \\frac{dy}{dx}$. Si aparece un producto mixto como $x \\cdot y$, debe aplicarse obligatoriamente la regla del producto: $$\\frac{d}{dx}(x \\cdot y) = (1) \\cdot y + x \\cdot \\frac{dy}{dx}$$'
              },
              {
                title: '4. Recta Tangente y Recta Normal',
                body: 'En el punto $P(x_0, y_0)$ con pendiente tangente $m_t = f\'(x_0) \\neq 0$:\n- **Recta Tangente:** $y - y_0 = m_t(x - x_0)$\n- **Recta Normal (perpendicular a la tangente en $P$):** Tiene pendiente recíproca y de signo opuesto $m_n = -\\frac{1}{m_t} = -\\frac{1}{f\'(x_0)}$, por lo que su ecuación es: $$y - y_0 = -\\frac{1}{f\'(x_0)}(x - x_0)$$'
              }
            ],
            theorems: [
              {
                badge: 'Derivada de Inversa',
                title: 'Derivada de ln(x) mediante Derivación Implícita',
                hypothesis: 'Sea $x > 0$ y $y = \\ln(x)$, función inversa de $e^y = x$ con $(e^y)\' = e^y > 0$.',
                statement: 'La función $y = \\ln(x)$ es derivable en $(0, \\infty)$ y cumple $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$.',
                proofSteps: [
                  'Partimos de la equivalencia definitoria $e^y = x$ para $x > 0$.',
                  'Derivamos ambos miembros respecto a $x$ asumiendo la derivabilidad de la función inversa $\\ln$: $\\frac{d}{dx}(e^y) = \\frac{d}{dx}(x)$.',
                  'Por la regla de la cadena: $e^y \\cdot \\frac{dy}{dx} = 1$.',
                  'Despejando $\\frac{dy}{dx}$ y recordando que $e^y = x$: $\\frac{dy}{dx} = \\frac{1}{e^y} = \\frac{1}{x}$. $\\blacksquare$'
                ]
              }
            ],
            formulas: [
              {
                label: 'Exponencial y Logaritmo Compuestos',
                expr: '(e^{u})\' = e^{u} \\cdot u\' \\quad ; \\quad (\\ln(u))\' = \\frac{u\'}{u}',
                note: 'Si tienes ln de un producto, cociente o potencia, expande primero con propiedades de logaritmos antes de derivar.'
              },
              {
                label: 'Relación entre Pendiente Tangente y Pendiente Normal',
                expr: 'm_t = f\'(x_0) \\quad ; \\quad m_n = -\\frac{1}{f\'(x_0)} \\quad (m_t \\cdot m_n = -1)',
                note: 'La recta normal indica la dirección perpendicular a la superficie o curva en el punto de contacto.'
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo 1: Derivada combinada exponencial, trigonométrica y logarítmica',
              problem: 'Halla la derivada de $f(x) = e^{3x} \\cdot \\text{sen}(2x) + \\ln(x^2 + 5)$.',
              steps: [
                {
                  title: 'Paso 1: Derivar el primer término con regla del producto y cadena',
                  math: '\\frac{d}{dx}[e^{3x}\\,\\text{sen}(2x)] = (3e^{3x})\\,\\text{sen}(2x) + e^{3x}(2\\cos(2x)) = e^{3x}[3\\,\\text{sen}(2x) + 2\\cos(2x)]',
                  reason: 'La derivada de e^(3x) es 3e^(3x) y la de sen(2x) es 2cos(2x).'
                },
                {
                  title: 'Paso 2: Derivar el término logarítmico con u\'/u',
                  math: '\\frac{d}{dx}[\\ln(x^2 + 5)] = \\frac{2x}{x^2 + 5}',
                  reason: 'Dividimos la derivada del argumento (2x) entre el argumento original (x² + 5).'
                },
                {
                  title: 'Paso 3: Unir ambos resultados',
                  math: 'f\'(x) = e^{3x}[3\\,\\text{sen}(2x) + 2\\cos(2x)] + \\frac{2x}{x^2 + 5}',
                  reason: 'Sumamos las derivadas de ambos sumandos.'
                }
              ],
              graphPayload: { kind: 'derivative', expr: 'exp(3*x)*sin(2*x) + ln(x^2 + 5)', tangentX: 0, showDerivative: true }
            },
            {
              title: 'Ejemplo 2: Derivación implícita y ecuaciones de la recta tangente y normal',
              problem: 'Dada la circunferencia $x^2 + y^2 = 25$, halla $\\frac{dy}{dx}$ por derivación implícita y encuentra las pendientes de la recta tangente y de la recta normal en el punto $P(3, 4)$.',
              steps: [
                {
                  title: 'Paso 1: Derivar implícitamente ambos miembros respecto a x',
                  math: '\\frac{d}{dx}(x^2) + \\frac{d}{dx}(y^2) = \\frac{d}{dx}(25) \\implies 2x + 2y\\,\\frac{dy}{dx} = 0',
                  reason: 'Al derivar y² respecto a x, aplicamos la regla de la cadena multiplicando 2y por dy/dx.'
                },
                {
                  title: 'Paso 2: Despejar dy/dx y evaluar en P(3, 4)',
                  math: '\\frac{dy}{dx} = -\\frac{x}{y} \\implies m_t = \\left.\\frac{dy}{dx}\\right|_{(3,4)} = -\\frac{3}{4}',
                  reason: 'Sustituimos x = 3 e y = 4 para obtener la pendiente de la recta tangente.'
                },
                {
                  title: 'Paso 3: Calcular la pendiente de la recta normal y ambas ecuaciones',
                  math: 'm_n = -\\frac{1}{m_t} = \\frac{4}{3} \\quad ; \\quad \\text{Tangente: } y - 4 = -\\frac{3}{4}(x - 3) \\quad ; \\quad \\text{Normal: } y - 4 = \\frac{4}{3}(x - 3)',
                  reason: 'Observa que la recta normal y = (4/3)x pasa por el origen (0,0), como todo radio de una circunferencia centrada en el origen.'
                }
              ],
              graphPayload: { kind: 'derivative', expr: 'sqrt(25 - x^2)', tangentX: 3, showDerivative: true }
            },
            {
              title: 'Ejemplo 3: Derivación implícita con producto exponencial x·eʸ + 2y = 3x',
              problem: 'La curva implícita $x e^y + 2y = 3x$ pasa por el origen $P(0, 0)$. Calcula $\\frac{dy}{dx}$ en función de $(x, y)$ y halla las ecuaciones de la recta tangente y de la recta normal en $P(0, 0)$.',
              steps: [
                {
                  title: 'Paso 1: Derivar respecto a x aplicando regla del producto a x·eʸ',
                  math: '(1 \\cdot e^y + x e^y y\') + 2 y\' = 3',
                  reason: 'Derivamos x·eʸ como (x)\'eʸ + x(eʸ)\' donde (eʸ)\' = eʸ·y\'.'
                },
                {
                  title: 'Paso 2: Agrupar los términos con y\' y despejar dy/dx',
                  math: 'y\'(x e^y + 2) = 3 - e^y \\implies \\frac{dy}{dx} = \\frac{3 - e^y}{x e^y + 2}',
                  reason: 'Factorizamos y\' en el miembro izquierdo y dividimos entre (xeʸ + 2), que vale 2 ≠ 0 en (0, 0).'
                },
                {
                  title: 'Paso 3: Evaluar pendientes en P(0, 0) y escribir tangente y normal',
                  math: 'm_t = \\frac{3 - e^0}{0 \\cdot e^0 + 2} = \\frac{3 - 1}{2} = 1 \\quad ; \\quad m_n = -\\frac{1}{1} = -1 \\implies \\text{Tangente: } y = x, \\; \\text{Normal: } y = -x',
                  reason: 'Como la recta pasa por (0, 0) y m_t = 1 ≠ 0, la recta tangente es y = x y la normal perpendicular es y = -x.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Derivar $e^{x^2}$ aplicando la regla de las potencias como si la base fuera variable: $(e^{x^2})\' = x^2 \\cdot e^{x^2 - 1}$.',
              correct: 'En una función exponencial la variable está en el exponente; su derivada es ella misma por la derivada del exponente: $(e^{x^2})\' = 2x \\cdot e^{x^2}$.',
              why: 'La regla $n x^{n-1}$ solo es válida cuando la base es variable y el exponente es constante.'
            },
            {
              wrong: 'En derivación implícita, derivar el término $y^2$ como $2y$ olvidando el factor $y\'$, o dejar la constante del lado derecho sin derivar ($x^2 + y^2 = 25 \\implies 2x + 2yy\' = 25$).',
              correct: 'Multiplicar por $y\'$ cada derivada respecto a $y$ y recordar que la derivada de la constante $25$ es $0$: $2x + 2yy\' = 0$.',
              why: 'Ambos lados de la igualdad deben derivarse respecto a $x$.'
            }
          ],
          exercises: [
            {
              id: 'der-3-ex1',
              level: 'basico',
              statement: 'Calcula la derivada $f\'(x)$ de la función logarítmica compuesta: $f(x) = \\ln(x^2 + 1)$',
              answer: '(2*x)/(x^2 + 1)',
              alternatives: ['2x/(x^2+1)', '(2x)/(x^2+1)', '2*x/(x^2+1)'],
              placeholder: 'Ej: 2x / (x^2 + 1)',
              hints: [
                'Usa la fórmula $(\\ln(u))\' = \\frac{u\'}{u}$ con $u = x^2 + 1$.',
                'La derivada del argumento interno es $u\' = 2x$.',
                'Divide $2x$ entre $x^2 + 1$.'
              ],
              solutionSteps: [
                'Sea $u(x) = x^2 + 1$, cuya derivada es $u\'(x) = 2x$.',
                'Aplicando $(\\ln(u))\' = \\frac{u\'}{u}$, obtenemos $f\'(x) = \\frac{2x}{x^2 + 1}$.'
              ],
              reviewTip: 'Recuerda que la derivada de $\\ln(u)$ es el cociente $\\frac{u\'}{u}$ (derivada del argumento sobre el argumento sin derivar).',
              whyCorrect: '¡Correcto! Aplicaste directamente la regla logarítmica compuesta $\\frac{u\'}{u}$.'
            },
            {
              id: 'der-3-ex2',
              level: 'intermedio',
              statement: 'Determina la pendiente $m_n$ de la **recta normal** a la parábola $f(x) = x^2 + 1$ en el punto donde $x_0 = 2$.',
              answer: '-1/4',
              alternatives: ['-0.25', '-1/4'],
              placeholder: 'Ej: -1/4',
              hints: [
                'Calcula primero la pendiente de la recta tangente $m_t = f\'(2)$.',
                'Como $f\'(x) = 2x$, en $x_0 = 2$ tenemos $m_t = 4$.',
                'La pendiente de la recta normal es el recíproco negativo: $m_n = -\\frac{1}{m_t}$.'
              ],
              solutionSteps: [
                'Derivamos: $f\'(x) = 2x \\implies m_t = f\'(2) = 4$.',
                'Como la recta normal es perpendicular a la tangente, su pendiente es $m_n = -\\frac{1}{m_t} = -\\frac{1}{4}$.'
              ],
              reviewTip: 'No confundas la pendiente tangente $m_t = 4$ con la pendiente normal $m_n = -\\frac{1}{m_t} = -\\frac{1}{4}$.',
              whyCorrect: '¡Excelente! Como $m_t = 4$ y $m_n = -1/4$, su producto es $-1$, garantizando que la recta normal sea perpendicular a la tangente.'
            },
            {
              id: 'der-3-ex3',
              level: 'avanzado',
              statement: 'Mediante derivación implícita de la elipse $x^2 + 4y^2 = 20$, calcula el valor numérico de $\\frac{dy}{dx}$ en el punto $P(2, 2)$.',
              answer: '-1/4',
              alternatives: ['-0.25', '-1/4'],
              placeholder: 'Ej: -1/4',
              hints: [
                'Deriva ambos lados respecto a $x$: $2x + 8y\\,\\frac{dy}{dx} = 0$.',
                'Despeja $\\frac{dy}{dx} = -\\frac{2x}{8y} = -\\frac{x}{4y}$.',
                'Sustituye las coordenadas $x = 2$ e $y = 2$.'
              ],
              solutionSteps: [
                'Derivando implícitamente: $2x + 8y\\,y\' = 0 \\implies y\' = -\\frac{2x}{8y} = -\\frac{x}{4y}$.',
                'Evaluando en $P(2, 2)$: $\\left.\\frac{dy}{dx}\\right|_{(2,2)} = -\\frac{2}{4(2)} = -\\frac{1}{4}$.'
              ],
              reviewTip: 'Revisa que la derivada de $4y^2$ respecto a $x$ es $8y \\cdot y\'$ y que la derivada de la constante $20$ es $0$.',
              whyCorrect: '¡Perfecto! Obtuviste la pendiente tangente de la elipse sin necesidad de despejar raíces cuadradas.'
            },
            {
              id: 'der-3-ex4',
              level: 'intermedio',
              statement: 'La carga eléctrica en un capacitor descargándose sigue $q(t) = 20\\,e^{-0.5t}$ coulombs. Calcula la tasa de cambio instantánea $q\'(0)$ en $t = 0$ (incluye el signo).',
              answer: '-10',
              alternatives: ['-10'],
              placeholder: 'Tasa inicial q\'(0)...',
              whyCorrect: 'Derivando con regla de la cadena, $q\'(t) = 20(-0.5)e^{-0.5t} = -10\\,e^{-0.5t}$; en $t = 0$ vale $-10\\,e^0 = -10$.',
              reviewTip: 'La derivada de $e^{kt}$ es $k\\,e^{kt}$, conservando su signo.',
              hints: [
                'Aplica $\\frac{d}{dt}(e^{-0.5t}) = -0.5\\,e^{-0.5t}$.',
                'Multiplica $20 \\times (-0.5) = -10$.',
                'Evalúa en $t = 0$ recordando que $e^0 = 1$.'
              ],
              solutionSteps: [
                '$q\'(t) = 20(-0.5)e^{-0.5t} = -10\\,e^{-0.5t}$.',
                'En $t = 0$: $q\'(0) = -10\\,e^0 = -10$.'
              ]
            },
            {
              id: 'der-3-ex5',
              level: 'avanzado',
              statement: 'Un modelo de costo energético sigue $f(x) = 6\\ln(x) + x^2$. Calcula la pendiente exacta de la recta tangente en el punto de operación $x = 1$, es decir $f\'(1)$.',
              answer: '8',
              alternatives: ['8'],
              placeholder: 'Pendiente f\'(1)...',
              whyCorrect: 'Como $(\\ln x)\' = \\frac{1}{x}$, la derivada es $f\'(x) = \\frac{6}{x} + 2x$, y en $x = 1$ da $\\frac{6}{1} + 2(1) = 8$.',
              reviewTip: 'La pendiente de la recta tangente en $x = a$ es el valor numérico de la derivada $f\'(a)$.',
              hints: [
                'Deriva término a término: la derivada de $6\\ln(x)$ es $\\frac{6}{x}$.',
                'Suma la derivada de $x^2$, que es $2x$.',
                'Evalúa $f\'(1) = \\frac{6}{1} + 2(1)$.'
              ],
              solutionSteps: [
                'Derivada: $f\'(x) = \\frac{6}{x} + 2x$.',
                'En $x = 1$: $f\'(1) = 6 + 2 = 8$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es la derivada de la función $f(x) = e^{2x} + \\cos(3x)$?',
              options: [
                '2e^(2x) - 3 sen(3x)',
                '2e^(2x) + 3 sen(3x)',
                'e^(2x) - sen(3x)',
                '2x e^(2x-1) - 3 cos(3x)'
              ],
              correctIndex: 0,
              explanation: 'Por la regla de la cadena, $(e^{2x})\' = 2e^{2x}$ y $(\\cos(3x))\' = -3\\,\\text{sen}(3x)$.'
            },
            {
              question: 'Al derivar implícitamente la ecuación $x^3 + y^3 = 9$ respecto a $x$, ¿qué se obtiene?',
              options: [
                '3x² + 3y² · (dy/dx) = 0',
                '3x² + 3y² = 9',
                '3x² + 3y² = 0',
                'x² + y² · (dy/dx) = 3'
              ],
              correctIndex: 0,
              explanation: 'El término $y^3$ se deriva con regla de la cadena como $3y^2 \\cdot \\frac{dy}{dx}$, y la derivada de $9$ es $0$.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           DER-4: MÁXIMOS, MÍNIMOS, CRECIMIENTO, CONCAVIDAD Y OPTIMIZACIÓN
           ------------------------------------------------------------------ */
        {
          id: 'der-4',
          title: 'Máximos y Mínimos, Crecimiento, Concavidad, Puntos de Inflexión y Optimización',
          summary: 'Criterios de la primera y segunda derivada, monotonía, curvatura, puntos de inflexión y modelado de problemas de optimización.',
          graphPreset: 'x^3 - 3*x',
          demoAnimations: ['der-construccion-fprima', 'der-velocidad-instantanea'],
          interactiveGraph: {
            mode: 'derivatives',
            title: 'Análisis de Curvas: Extremos Relativos, Monotonía y Concavidad',
            description: 'Desplaza x₀ hasta x₀ = -1 (máximo local) y x₀ = 1 (mínimo local) para verificar que la recta tangente se vuelve horizontal (f\'(x₀) = 0) y que la curva derivada f\'(x) cruza el eje X.',
            fn: 'x^3 - 3*x',
            x0: -1.0,
            h: 0.5,
            xDomain: [-3, 3],
            yDomain: [-4.5, 4.5],
            presets: [
              { label: 'Cúbica con máx/mín: x³ - 3x', fn: 'x^3 - 3*x', x0: -1.0, h: 0.5 },
              { label: 'Cuártica doble pozo: 0.25x⁴ - x²', fn: '0.25*x^4 - x^2', x0: 1.41, h: 0.4 },
              { label: 'Inflexión pura: x³', fn: 'x^3', x0: 0.0, h: 0.5 }
            ]
          },
          theory: {
            intro: [
              'Una de las aplicaciones más poderosas del Cálculo Diferencial en la ingeniería, la física y la economía es la **Optimización**: encontrar las condiciones exactas que maximizan un beneficio, un volumen o la resistencia de una viga, o bien que minimizan el costo de fabricación o el tiempo de recorrido.',
              'En esta lección aprenderás cómo la **primera derivada** $f\'(x)$ revela dónde una función crece, decrece o alcanza sus cumbres y valles (**máximos y mínimos**), y cómo la **segunda derivada** $f\'\'(x)$ describe su **concavidad** y sus **puntos de inflexión**.'
            ],
            prerequisites: [
              'Factorización de polinomios y resolución de ecuaciones $f\'(x) = 0$ para localizar puntos críticos.',
              'Cálculo de la segunda derivada $f\'\'(x)$ derivando nuevamente la primera derivada $f\'(x)$.'
            ],
            detailedExplanation: [
              '**1. Crecimiento, decrecimiento y Puntos Críticos:** Si $f\'(x) > 0$ en un intervalo, las rectas tangentes tienen pendiente positiva y la función es **estrictamente creciente**. Si $f\'(x) < 0$, las tangentes tienen pendiente negativa y la función es **estrictamente decreciente**. Los puntos del dominio donde $f\'(c) = 0$ (tangente horizontal) o donde $f\'(c)$ no existe se llaman **puntos críticos**.',
              '**2. Cómo distinguir un Máximo de un Mínimo:**\n- **Criterio de la Primera Derivada:** Si al pasar por el punto crítico $x = c$ de izquierda a derecha el signo de $f\'(x)$ cambia de $+$ a $-$ (sube y luego baja), hay un **máximo relativo**. Si cambia de $-$ a $+$ (baja y luego sube), hay un **mínimo relativo**. Si no cambia de signo (como en $f(x)=x^3$ en $x=0$), no hay extremo.\n- **Criterio de la Segunda Derivada:** Si $f\'(c) = 0$ y $f\'\'(c) < 0$, la curva es cóncava hacia abajo ($\cap$) y $c$ es un **máximo relativo**. Si $f\'(c) = 0$ y $f\'\'(c) > 0$, la curva es cóncava hacia arriba ($\cup$) y $c$ es un **mínimo relativo**.',
              '**3. Concavidad y Puntos de Inflexión:** La segunda derivada mide la tasa de cambio de la pendiente. Donde $f\'\'(x) > 0$, la pendiente aumenta y la gráfica es **cóncava hacia arriba** (convexa). Donde $f\'\'(x) < 0$, la gráfica es **cóncava hacia abajo**. Un punto donde la curva cambia de concavidad (pasando de $\cup$ a $\cap$ o viceversa) se llama **punto de inflexión** y se localiza resolviendo $f\'\'(x) = 0$ y verificando el cambio de signo de $f\'\'$.'
            ],
            concepts: [
              {
                title: '1. Monotonía (Crecimiento y Decrecimiento)',
                body: '- Si $f\'(x) > 0$ para todo $x \\in (a, b) \\implies f(x)$ es **creciente** en $(a, b)$.\n- Si $f\'(x) < 0$ para todo $x \\in (a, b) \\implies f(x)$ es **decreciente** en $(a, b)$.\n- Si $f\'(c) = 0 \\implies x = c$ es un **punto estacionario (crítico)** con recta tangente horizontal.'
              },
              {
                title: '2. Criterios de la 1.ª y 2.ª Derivada para Máximos y Mínimos',
                body: 'Sea $f\'(c) = 0$:\n- **Máximo local en $x = c$:** $f\'(x)$ cambia de $+$ a $-$, o bien $f\'\'(c) < 0$.\n- **Mínimo local en $x = c$:** $f\'(x)$ cambia de $-$ a $+$, o bien $f\'\'(c) > 0$.'
              },
              {
                title: '3. Concavidad y Puntos de Inflexión',
                body: '- **Cóncava hacia arriba ($\\cup$):** $f\'\'(x) > 0$.\n- **Cóncava hacia abajo ($\\cap$):** $f\'\'(x) < 0$.\n- **Punto de inflexión en $x = x_i$:** $f\'\'(x_i) = 0$ (o no existe) y $f\'\'(x)$ **cambia de signo** al cruzar $x_i$.'
              },
              {
                title: '4. Metodología de 5 Pasos para Problemas de Optimización',
                body: '1. Identifica la magnitud a optimizar (función objetivo $Q$) y las restricciones (ecuación auxiliar).\n2. Despeja una variable de la restricción y sustitúyela en $Q$ para obtener una función de **una sola variable** $Q(x)$.\n3. Halla los puntos críticos resolviendo $Q\'(x) = 0$.\n4. Verifica con $Q\'\'(x)$ (o en los extremos del dominio) que se trata efectivamente del máximo o mínimo buscado.\n5. Responde con las dimensiones y el valor óptimo.'
              }
            ],
            theorems: [
              {
                badge: 'Teorema de Fermat',
                title: 'Condición Necesaria para Extremos Locales Interiores',
                hypothesis: '$f$ posee un máximo o mínimo local en un punto **interior** $c \\in (a, b)$ de su dominio y $f$ es **derivable** en $c$.',
                statement: 'Necesariamente se cumple que $f\'(c) = 0$.',
                proofSteps: [
                  'Supongamos el caso de máximo local en $c$: existe $\\delta > 0$ tal que $f(c + h) \\le f(c)$ para todo $|h| < \\delta$.',
                  'Para $h > 0$ ($0 < h < \\delta$): $f(c+h) - f(c) \\le 0 \\implies \\frac{f(c+h)-f(c)}{h} \\le 0$. Al tomar $h \\to 0^+$ se conserva la desigualdad no estricta: $f\'_+(c) \\le 0$.',
                  'Para $h < 0$ ($-\\delta < h < 0$): el numerador sigue siendo $\\le 0$, pero $h < 0$, luego $\\frac{f(c+h)-f(c)}{h} \\ge 0$, y al tomar $h \\to 0^-$ resulta $f\'_-(c) \\ge 0$.',
                  'Como $f$ es derivable en $c$, $f\'(c) = f\'_+(c) = f\'_-(c)$. La única cantidad que cumple $0 \\le f\'(c) \\le 0$ es $f\'(c) = 0$. (El caso de mínimo es análogo invirtiendo signos). $\\blacksquare$'
                ],
                note: 'No sobreprometas el recíproco: $f\'(c)=0$ NO garantiza un extremo (en $f(x)=x^3$, $f\'(0)=0$ es punto de inflexión). Tampoco aplica si $c$ es un extremo de intervalo cerrado $[a,b]$ o si $f$ no es derivable en $c$ (ej. $|x|$ tiene mínimo en $0$ sin que exista $f\'(0)$).'
              },
              {
                badge: 'Teorema del Valor Medio (Lagrange)',
                title: 'Teorema del Valor Medio y Criterio de Monotonía por el Signo de f\'',
                hypothesis: '$f$ es **continua** en el intervalo cerrado $[a, b]$ y **derivable** en el intervalo abierto $(a, b)$.',
                statement: 'Existe al menos un punto $c \\in (a, b)$ tal que $f\'(c) = \\frac{f(b) - f(a)}{b - a}$. Como corolario directo, si $f\'(x) > 0$ para todo $x \\in (a, b)$, entonces $f$ es **estrictamente creciente** en $[a, b]$; si $f\'(x) < 0$ en $(a, b)$, $f$ es **estrictamente decreciente**.',
                proofSteps: [
                  'Para probar el corolario de monotonía a partir del TVM: sean dos puntos cualesquiera $x_1 < x_2$ dentro de $[a, b]$.',
                  'Como $f$ es continua en $[x_1, x_2]$ y derivable en $(x_1, x_2)$, por el TVM existe $c \\in (x_1, x_2)$ tal que $f(x_2) - f(x_1) = f\'(c)(x_2 - x_1)$.',
                  'Si $f\'(x) > 0$ en $(a, b)$, entonces $f\'(c) > 0$; además $x_2 - x_1 > 0$, luego el producto es positivo: $f(x_2) - f(x_1) > 0 \\implies f(x_1) < f(x_2)$.',
                  'Análogamente, si $f\'(x) < 0$ en $(a, b)$, resulta $f(x_2) - f(x_1) < 0 \\implies f(x_1) > f(x_2)$, demostrando decrecimiento estricto. $\\blacksquare$'
                ]
              }
            ],
            formulas: [
              {
                label: 'Condiciones de Extremo y de Inflexión',
                expr: '\\text{Extremo: } f\'(c) = 0 \\quad ; \\quad \\text{Inflexión: } f\'\'(x_i) = 0 \\text{ (con cambio de signo)}',
                note: 'Si f\'\'(c) < 0 hay máximo local; si f\'\'(c) > 0 hay mínimo local.'
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo 1: Máximos, mínimos, crecimiento y punto de inflexión',
              problem: 'Analiza completamente los extremos relativos y el punto de inflexión de $f(x) = x^3 - 6x^2 + 9x + 1$.',
              steps: [
                {
                  title: 'Paso 1: Hallar f\'(x) e igualar a cero para obtener los puntos críticos',
                  math: 'f\'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x - 1)(x - 3) = 0 \\implies x_1 = 1, \\; x_2 = 3',
                  reason: 'Factorizamos la primera derivada y hallamos los dos valores donde la tangente es horizontal.'
                },
                {
                  title: 'Paso 2: Clasificar con el criterio de la segunda derivada f\'\'(x)',
                  math: 'f\'\'(x) = 6x - 12 \\implies \\begin{cases} f\'\'(1) = -6 < 0 \\implies \\text{Máximo en } (1, f(1)) = (1, 5) \\\\ f\'\'(3) = +6 > 0 \\implies \\text{Mínimo en } (3, f(3)) = (3, 1) \\end{cases}',
                  reason: 'Como f\'\'(1) < 0 hay un máximo relativo en x = 1; como f\'\'(3) > 0 hay un mínimo relativo en x = 3.'
                },
                {
                  title: 'Paso 3: Hallar el punto de inflexión resolviendo f\'\'(x) = 0',
                  math: '6x - 12 = 0 \\implies x_i = 2 \\quad ; \\quad f(2) = 8 - 24 + 18 + 1 = 3 \\implies P_{\\text{inf}}(2, 3)',
                  reason: 'En x = 2 la segunda derivada cambia de negativa a positiva, cambiando la concavidad de ∩ a ∪.'
                }
              ]
            },
            {
              title: 'Ejemplo 2: Problema aplicado de optimización de área',
              problem: 'Se dispone de $120\\text{ m}$ de cerca para delimitar un terreno rectangular junto a un río recto (el lado del río no requiere cerca). ¿Cuáles son las dimensiones que maximizan el área encerrada y cuál es dicha área máxima?',
              steps: [
                {
                  title: 'Paso 1: Plantear la restricción de perímetro y la función objetivo de área',
                  math: '2x + y = 120 \\implies y = 120 - 2x \\quad ; \\quad A(x) = x \\cdot y = x(120 - 2x) = 120x - 2x^2',
                  reason: 'Llamamos x a los dos lados perpendiculares al río e y al lado paralelo al río.'
                },
                {
                  title: 'Paso 2: Derivar A(x), igualar a cero y comprobar con A\'\'(x)',
                  math: 'A\'(x) = 120 - 4x = 0 \\implies x = 30\\text{ m} \\quad ; \\quad A\'\'(x) = -4 < 0 \\text{ (Máximo)}',
                  reason: 'La segunda derivada negativa confirma que x = 30 m produce el área máxima.'
                },
                {
                  title: 'Paso 3: Calcular la dimensión y y el área máxima',
                  math: 'y = 120 - 2(30) = 60\\text{ m} \\quad ; \\quad A_{\\max} = 30 \\times 60 = 1800\\text{ m}^2',
                  reason: 'El terreno óptimo mide 30 m de fondo por 60 m de frente, con un área máxima de 1800 m².'
                }
              ]
            },
            {
              title: 'Ejemplo 3: Punto estacionario que NO es extremo (f(x) = x⁴ - 4x³)',
              problem: 'Determina los intervalos de crecimiento/decrecimiento, puntos críticos, extremos relativos y puntos de inflexión de $f(x) = x^4 - 4x^3$.',
              graphPayload: { kind: 'derivative', expr: 'x^4 - 4*x^3', tangentX: 3, showDerivative: true },
              steps: [
                {
                  title: 'Paso 1: Calcular puntos críticos con f\'(x) = 0',
                  math: 'f\'(x) = 4x^3 - 12x^2 = 4x^2(x - 3) = 0 \\implies x = 0 \\; \\text{y} \\; x = 3',
                  reason: 'Factorizamos 4x² para distinguir rápidamente la multiplicidad de cada raíz crítica.'
                },
                {
                  title: 'Paso 2: Analizar el signo de f\'(x) alrededor de x = 0 y x = 3',
                  math: '\\text{En } (-\\infty, 0): f\'(x) < 0; \\quad \\text{en } (0, 3): f\'(x) < 0; \\quad \\text{en } (3, \\infty): f\'(x) > 0',
                  reason: 'Como 4x² ≥ 0 siempre, el signo lo dicta (x - 3). En x = 0 la función decrece antes y después: f\'(0) = 0 pero NO es extremo. En x = 3 cambia de - a +: mínimo absoluto f(3) = -27.'
                },
                {
                  title: 'Paso 3: Concavidad y puntos de inflexión con f\'\'(x)',
                  math: 'f\'\'(x) = 12x^2 - 24x = 12x(x - 2) = 0 \\implies x = 0 \\; (f(0)=0) \\; \\text{y} \\; x = 2 \\; (f(2) = -16)',
                  reason: 'En x = 0 y x = 2 hay cambio de signo en f\'\'(x), por lo que ambos son puntos de inflexión.'
                }
              ]
            },
            {
              title: 'Ejemplo 4: Verificación del Teorema del Valor Medio de Lagrange en [0, 2]',
              problem: 'Comprueba que $f(x) = x^3 - x$ satisface las hipótesis del Teorema del Valor Medio en $[0, 2]$ y encuentra todos los valores $c \\in (0, 2)$ garantizados por el teorema.',
              steps: [
                {
                  title: 'Paso 1: Verificar hipótesis de continuidad y derivabilidad',
                  math: 'f(x) = x^3 - x \\text{ es polinómica } \\implies \\text{continua en } [0, 2] \\text{ y derivable en } (0, 2)',
                  reason: 'Sin comprobar primero ambas hipótesis en el intervalo cerrado y abierto respectivamente, no sería válido invocar el TVM.'
                },
                {
                  title: 'Paso 2: Igualar la razón promedio con la derivada f\'(c)',
                  math: '\\frac{f(2) - f(0)}{2 - 0} = \\frac{(8 - 2) - 0}{2} = 3 \\quad ; \\quad f\'(c) = 3c^2 - 1 = 3 \\implies 3c^2 = 4',
                  reason: 'Buscamos el punto interior donde la pendiente instantánea iguala a la pendiente secante entre (0,0) y (2,6).'
                },
                {
                  title: 'Paso 3: Seleccionar el valor c dentro del intervalo abierto (0, 2)',
                  math: 'c = \\pm\\sqrt{\\frac{4}{3}} = \\pm\\frac{2}{\\sqrt{3}} \\implies c = \\frac{2}{\\sqrt{3}} \\approx 1.1547 \\in (0, 2)',
                  reason: 'Descartamos -2/√3 por quedar fuera de (0, 2) y retenemos c = 2/√3 ≈ 1.1547.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Afirmar que todo punto donde $f\'(c) = 0$ es automáticamente un máximo o un mínimo.',
              correct: '$f\'(c) = 0$ es solo una condición necesaria (candidato). En $f(x) = x^3$, tenemos $f\'(0) = 0$, pero $x = 0$ es un punto de inflexión con tangente horizontal, no un extremo.',
              why: 'Para que exista un extremo relativo, la primera derivada debe cambiar de signo al atravesar $x = c$.'
            },
            {
              wrong: 'Confundir el valor de la abscisa crítica $x = c$ con el valor máximo o mínimo de la función $f(c)$.',
              correct: 'Si te piden "¿en qué valor de $x$ ocurre el máximo?", la respuesta es $c$; si te piden "¿cuál es el valor máximo de la función?", debes evaluar $f(c)$ en la función original.',
              why: '$x = c$ indica la ubicación horizontal, mientras que $y = f(c)$ indica la altura máxima o mínima alcanzada.'
            }
          ],
          exercises: [
            {
              id: 'der-4-ex1',
              level: 'basico',
              statement: 'Halla el valor de $x$ donde la función $f(x) = x^2 - 8x + 19$ alcanza su mínimo absoluto.',
              answer: '4',
              alternatives: ['4'],
              placeholder: 'Valor de x del mínimo...',
              hints: [
                'Calcula la primera derivada $f\'(x)$ de $x^2 - 8x + 19$.',
                'Iguala $f\'(x) = 2x - 8 = 0$ y despeja $x$.',
                'Como $f\'\'(x) = 2 > 0$, ese punto crítico corresponde al mínimo.'
              ],
              solutionSteps: [
                'Derivando: $f\'(x) = 2x - 8 = 0 \\implies x = 4$.',
                'Como $f\'\'(4) = 2 > 0$, la parábola tiene su mínimo en $x = 4$.'
              ],
              reviewTip: 'Recuerda igualar la primera derivada $f\'(x) = 2x - 8$ a cero y despejar $x$.',
              whyCorrect: '¡Correcto! En $x = 4$ la pendiente tangente se anula y la concavidad positiva ($f\'\' = 2 > 0$) garantiza un mínimo.'
            },
            {
              id: 'der-4-ex2',
              level: 'intermedio',
              statement: 'Determina la abscisa $x$ del **punto de inflexión** de la curva cúbica $f(x) = x^3 - 9x^2 + 15x - 2$.',
              answer: '3',
              alternatives: ['3'],
              placeholder: 'Abscisa x del punto de inflexión...',
              hints: [
                'El punto de inflexión se halla donde la **segunda derivada** se anula y cambia de signo.',
                'Primera derivada: $f\'(x) = 3x^2 - 18x + 15$.',
                'Segunda derivada: $f\'\'(x) = 6x - 18 = 0$. Despeja $x$.'
              ],
              solutionSteps: [
                'Calculamos la primera y segunda derivada: $f\'(x) = 3x^2 - 18x + 15$ y $f\'\'(x) = 6x - 18$.',
                'Igualamos a cero la segunda derivada: $6x - 18 = 0 \\implies x = 3$.'
              ],
              reviewTip: 'No confundas los extremos ($f\'(x) = 0$) con el punto de inflexión, que requiere igualar la **segunda derivada** $f\'\'(x) = 0$.',
              whyCorrect: '¡Excelente! En $x = 3$ la segunda derivada cambia de negativa a positiva, invirtiendo la concavidad de la curva.'
            },
            {
              id: 'der-4-ex3',
              level: 'avanzado',
              statement: 'Halla dos números positivos cuya suma sea $20$ y cuyo producto sea el máximo posible. ¿Cuál es el valor de dicho **producto máximo**?',
              answer: '100',
              alternatives: ['100'],
              placeholder: 'Valor del producto máximo...',
              hints: [
                'Si los números son $x$ e $y$, entonces $x + y = 20 \\implies y = 20 - x$.',
                'La función producto a maximizar es $P(x) = x(20 - x) = 20x - x^2$.',
                'Resuelve $P\'(x) = 20 - 2x = 0$ y evalúa el producto máximo $P(x)$.'
              ],
              solutionSteps: [
                'Función objetivo: $P(x) = 20x - x^2$.',
                'Derivando: $P\'(x) = 20 - 2x = 0 \\implies x = 10$ (y por tanto $y = 10$).',
                'El producto máximo es $P(10) = 10 \\times 10 = 100$.'
              ],
              reviewTip: 'Observa que el problema pide el **producto máximo** ($10 \\times 10 = 100$), no solo el valor de $x = 10$.',
              whyCorrect: '¡Brillante! Demostraste mediante cálculo diferencial que de todos los pares de números con suma constante, el producto es máximo cuando ambos son iguales.'
            },
            {
              id: 'der-4-ex4',
              level: 'intermedio',
              statement: 'La altura en metros de un dron sigue la trayectoria $h(t) = -5t^2 + 30t + 4$ ($t$ en segundos). Usa la primera derivada para encontrar en qué segundo exacto alcanza su altura máxima.',
              answer: '3',
              alternatives: ['3'],
              placeholder: 'Segundo de altura máxima...',
              whyCorrect: 'Igualando la velocidad vertical a cero: $h\'(t) = -10t + 30 = 0 \\Rightarrow t = 3\\text{ s}$, con $h\'\'(3) = -10 < 0$ (máximo).',
              reviewTip: 'Un extremo local ocurre donde la primera derivada se anula ($h\'(t) = 0$).',
              hints: [
                'Calcula la primera derivada $h\'(t) = -10t + 30$.',
                'Iguala $h\'(t) = 0$ para hallar el punto crítico.',
                'Despeja $t = \\frac{30}{10}$.'
              ],
              solutionSteps: [
                '$h\'(t) = -10t + 30 = 0 \\Rightarrow 10t = 30 \\Rightarrow t = 3\\text{ s}$.',
                'Como $h\'\'(t) = -10 < 0$, en $t = 3\\text{ s}$ hay un máximo absoluto.'
              ]
            },
            {
              id: 'der-4-ex5',
              level: 'avanzado',
              statement: 'Se dispone de $80\\text{ m}$ de malla metálica para cercar un jardín rectangular completo por sus cuatro lados. ¿Cuál debe ser la medida de cada lado en metros para obtener el área máxima posible?',
              answer: '20',
              alternatives: ['20'],
              placeholder: 'Medida óptima en m...',
              whyCorrect: 'De $2x + 2y = 80$ se tiene $y = 40 - x$ y $A(x) = 40x - x^2$. Su derivada $A\'(x) = 40 - 2x = 0$ da $x = 20\\text{ m}$ (un cuadrado de $20 \\times 20$).',
              reviewTip: 'Expresa una dimensión en términos del perímetro fijo para derivar la función de área de una sola variable.',
              hints: [
                'De $2x + 2y = 80$, simplifica $x + y = 40 \\Rightarrow y = 40 - x$.',
                'Arma la función área: $A(x) = x(40 - x) = 40x - x^2$.',
                'Deriva e iguala a cero: $A\'(x) = 40 - 2x = 0$.'
              ],
              solutionSteps: [
                'Restricción: $y = 40 - x$. Área: $A(x) = 40x - x^2$.',
                '$A\'(x) = 40 - 2x = 0 \\Rightarrow x = 20\\text{ m}$ (y $y = 20\\text{ m}$).'
              ]
            }
          ],
          quiz: [
            {
              question: 'Si en un punto crítico $x = c$ se cumple que $f\'(c) = 0$ y $f\'\'(c) = -8$, ¿qué presenta la función en $x = c$?',
              options: [
                'Un máximo relativo (local)',
                'Un mínimo relativo (local)',
                'Un punto de inflexión',
                'Una asíntota vertical'
              ],
              correctIndex: 0,
              explanation: 'Por el criterio de la segunda derivada, si $f\'(c) = 0$ y $f\'\'(c) < 0$ (cóncava hacia abajo), la función alcanza un máximo relativo en $x = c$.'
            },
            {
              question: 'Si $f\'(x) < 0$ y $f\'\'(x) > 0$ en todo un intervalo $(a, b)$, ¿cómo es la gráfica de $f(x)$ en dicho intervalo?',
              options: [
                'Decreciente y cóncava hacia arriba (∪)',
                'Creciente y cóncava hacia abajo (∩)',
                'Decreciente y cóncava hacia abajo (∩)',
                'Constante y horizontal'
              ],
              correctIndex: 0,
              explanation: '$f\'(x) < 0$ indica que la función es decreciente, mientras que $f\'\'(x) > 0$ indica que es cóncava hacia arriba.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       MÓDULO 8: INTEGRALES (PRIORIDAD C)
       ====================================================================== */
    {
      id: 'integrales',
      name: 'Integrales',
      symbol: '∫',
      levelTag: 'Acumulación y Área',
      color: '#1E3A8A',
      shortDesc: 'Antiderivadas, constante C, reglas de integración, sustitución, por partes, integral definida, Teorema Fundamental del Cálculo y áreas.',
      topics: [
        /* ------------------------------------------------------------------
           INT-1: CONCEPTO DE INTEGRAL, ANTIDERIVADAS, CONSTANTE C Y REGLAS FUNDAMENTALES
           ------------------------------------------------------------------ */
        {
          id: 'int-1',
          title: 'Concepto de Integral, Antiderivadas, Constante de Integración y Reglas Fundamentales',
          summary: 'Operación inversa de la derivación, familia de curvas primitivas F(x) + C, e integrales de potencias, exponenciales, logarítmicas y trigonométricas.',
          graphPreset: '2*x',
          demoAnimations: ['int-suma-riemann'],
          interactiveGraph: {
            mode: 'integrals',
            title: 'Explorador de Acumulación e Integración Fundamental',
            description: 'Modifica los límites [a, b] y el número de subintervalos n para observar cómo la suma de rectángulos de Riemann acumula los valores de f(x).',
            fn: '2*x',
            a: 0,
            b: 3,
            n: 12,
            xDomain: [-2, 4],
            yDomain: [-3, 7],
            presets: [
              { label: 'Lineal: 2x (Antiderivada x²)', fn: '2*x', a: 0, b: 3, n: 12 },
              { label: 'Cuadrática: 3x² (Antiderivada x³)', fn: '3*x^2', a: 0, b: 2, n: 16 },
              { label: 'Exponencial: e^x', fn: 'exp(x)', a: 0, b: 2, n: 14 }
            ]
          },
          theory: {
            intro: [
              'Si el Cálculo Diferencial resuelve el problema de hallar la velocidad instantánea a partir de la posición, el **Cálculo Integral** resuelve el problema inverso: reconstruir la posición total o la cantidad acumulada a partir de su razón de cambio instantánea.',
              'Dada una función $f(x)$, buscamos una función $F(x)$ cuya derivada sea exactamente $f(x)$, es decir, $F\'(x) = f(x)$. Dicha función $F(x)$ se denomina **antiderivada** o **primitiva**, y el conjunto de todas las antiderivadas posibles constituye la **integral indefinida**.'
            ],
            prerequisites: [
              'Dominio de las reglas de derivación de potencias, exponenciales, logaritmos y funciones trigonométricas.',
              'Álgebra de exponentes para reescribir radicales y cocientes monómicos antes de integrar: $\\frac{1}{x^n} = x^{-n}$ y $\\sqrt[m]{x^n} = x^{n/m}$.'
            ],
            detailedExplanation: [
              '**1. ¿Por qué aparece la Constante de Integración $+ C$?** Observa que las funciones $F_1(x) = x^2$, $F_2(x) = x^2 + 7$ y $F_3(x) = x^2 - 15$ tienen todas la misma derivada: $F\'(x) = 2x$, ya que la derivada de cualquier constante es cero. Geométricamente, esto significa que la antiderivada no es una única curva, sino una **familia infinita de curvas paralelas** desplazadas verticalmente por una constante arbitraria $C \\in \\mathbb{R}$.',
              '**2. La Regla de la Potencia para Integrales y su Excepción en $n = -1$:** Para derivar $x^n$ multiplicamos por el exponente y restamos $1$. Para hacer el proceso inverso (integrar $x^n$), primero **sumamos $1$ al exponente** y luego **dividimos entre el nuevo exponente**: $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$. Sin embargo, si $n = -1$ (es decir, $\\int x^{-1}\\,dx = \\int \\frac{1}{x}\\,dx$), esta fórmula dividiría entre cero. ¿Qué función tiene por derivada $\\frac{1}{x}$? El logaritmo natural: $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.',
              '**3. Comprobación infalible:** Toda integral indefinida puede comprobarse en segundos derivando el resultado obtenido: si al derivar $F(x) + C$ recuperas exactamente el integrando $f(x)$, tu integral es $100\\%$ correcta.'
            ],
            concepts: [
              {
                title: '1. Antiderivada e Integral Indefinida',
                body: 'Una función $F(x)$ es una **antiderivada** de $f(x)$ si $F\'(x) = f(x)$. La **integral indefinida** se escribe: $$\\int f(x)\\,dx = F(x) + C$$ donde $\\int$ es el signo integral (introducido por Leibniz como una $S$ alargada de *summa*), $f(x)$ es el **integrando**, $dx$ indica la variable de integración y $C$ es la **constante de integración**.'
              },
              {
                title: '2. Linealidad y Regla de las Potencias ($n \\neq -1$)',
                body: '- **Linealidad:** $\\int [a\\,f(x) \\pm b\\,g(x)]\\,dx = a\\int f(x)\\,dx \\pm b\\int g(x)\\,dx$.\n- **Potencia ($n \\neq -1$):** $$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$$\n- **Constante:** $\\int k\\,dx = k\\,x + C$.'
              },
              {
                title: '3. Integrales Exponenciales y Logarítmica',
                body: '- **Caso $n = -1$ (Logarítmica):** $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.\n- **Exponencial natural:** $\\int e^x\\,dx = e^x + C$ y $\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C$.\n- **Exponencial en base $a > 0$:** $\\int a^x\\,dx = \\frac{a^x}{\\ln(a)} + C$.'
              },
              {
                title: '4. Integrales Trigonométricas Directas',
                body: '- $\\int \\text{sen}(x)\\,dx = -\\cos(x) + C$ *(nota el signo menos porque $(-\\cos x)\' = \\text{sen } x$)*.\n- $\\int \\cos(x)\\,dx = \\text{sen}(x) + C$.\n- $\\int \\sec^2(x)\\,dx = \\tan(x) + C$ y $\\int \\csc^2(x)\\,dx = -\\cot(x) + C$.\n- $\\int \\sec(x)\\tan(x)\\,dx = \\sec(x) + C$ y $\\int \\csc(x)\\cot(x)\\,dx = -\\csc(x) + C$.'
              }
            ],
            formulas: [
              {
                label: 'Regla de la Potencia y Caso Logarítmico',
                expr: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\; (n \\neq -1) \\quad ; \\quad \\int \\frac{1}{x}\\,dx = \\ln|x| + C',
                note: 'Si el integrando es una suma sobre un monomio como (x³ + 2)/x, sepáralo primero en x² + 2/x antes de integrar.'
              },
              {
                label: 'Exponenciales y Trigonométricas Fundamentales',
                expr: '\\int e^x\\,dx = e^x + C \\quad ; \\quad \\int \\cos(x)\\,dx = \\text{sen}(x) + C \\quad ; \\quad \\int \\text{sen}(x)\\,dx = -\\cos(x) + C',
                note: 'Verifica siempre el signo derivando tu respuesta final.'
              }
            ],
            theorems: [
              {
                badge: 'Teorema de Unicidad Aditiva',
                title: '¿Por qué dos antiderivadas difieren en una constante C?',
                hypothesis: 'Sean $F_1$ y $F_2$ dos antiderivadas de $f$ en un intervalo abierto $I$ (es decir, $F_1\'(x) = F_2\'(x) = f(x)$ para todo $x \\in I$).',
                statement: 'Existe una constante única $C \\in \\mathbb{R}$ tal que $F_1(x) - F_2(x) = C$ para todo $x \\in I$.',
                proofSteps: [
                  'Definimos $H(x) = F_1(x) - F_2(x)$ sobre el intervalo $I$. Por linealidad de la derivada, $H\'(x) = F_1\'(x) - F_2\'(x) = f(x) - f(x) = 0$ en todo $I$.',
                  'Tomamos dos puntos cualesquiera $x_1 < x_2$ dentro de $I$. Como $H$ es derivable en $[x_1, x_2]$, cumple las hipótesis del Teorema del Valor Medio de Lagrange.',
                  'Existe $c \\in (x_1, x_2)$ tal que $H(x_2) - H(x_1) = H\'(c)(x_2 - x_1) = 0 \\cdot (x_2 - x_1) = 0$.',
                  'Por lo tanto $H(x_2) = H(x_1)$ para todo par de puntos de $I$, lo que demuestra que $H(x) = C$ es constante en $I$. $\\blacksquare$'
                ],
                note: 'La hipótesis de estar en un **intervalo conexo** es vital: en $\\mathbb{R} \\setminus \\{0\\}$ (dos intervalos separados), $\\ln|x|$ admite constantes distintas para $x < 0$ y $x > 0$.'
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo 1: Integración de polinomios, raíces y potencias negativas',
              problem: 'Calcula la integral indefinida: $$\\int \\left(6x^2 - 4\\sqrt{x} + \\frac{3}{x^2} + \\frac{5}{x}\\right) dx$$',
              steps: [
                {
                  title: 'Paso 1: Reescribir radicales y fracciones como potencias (excepto 5/x)',
                  math: '\\int \\left(6x^2 - 4x^{1/2} + 3x^{-2} + 5\\cdot\\frac{1}{x}\\right) dx',
                  reason: 'Dejamos 5/x separado porque su exponente es -1 y se integra mediante logaritmo natural.'
                },
                {
                  title: 'Paso 2: Sumar 1 a cada exponente y dividir entre el nuevo exponente',
                  math: '6\\left(\\frac{x^3}{3}\\right) - 4\\left(\\frac{x^{3/2}}{3/2}\\right) + 3\\left(\\frac{x^{-1}}{-1}\\right) + 5\\ln|x| + C',
                  reason: 'Observa que 1/2 + 1 = 3/2 y que -2 + 1 = -1.'
                },
                {
                  title: 'Paso 3: Simplificar coeficientes y devolver a raíces y exponentes positivos',
                  math: '2x^3 - \\frac{8}{3}x^{3/2} - \\frac{3}{x} + 5\\ln|x| + C',
                  reason: 'Dividir entre 3/2 equivale a multiplicar por 2/3, por lo que 4 · (2/3) = 8/3.'
                }
              ]
            },
            {
              title: 'Ejemplo 2: Determinación de la constante C con condición inicial',
              problem: 'Halla la función particular $F(x)$ sabiendo que $F\'(x) = 4x - 3$ y que su gráfica pasa por el punto $F(2) = 5$.',
              steps: [
                {
                  title: 'Paso 1: Integrar F\'(x) para obtener la familia general F(x)',
                  math: 'F(x) = \\int (4x - 3)\\,dx = 2x^2 - 3x + C',
                  reason: 'La integral de 4x es 4(x²/2) = 2x² y la de -3 es -3x.'
                },
                {
                  title: 'Paso 2: Usar la condición inicial F(2) = 5 para despejar C',
                  math: 'F(2) = 2(2)^2 - 3(2) + C = 8 - 6 + C = 5 \\implies 2 + C = 5 \\implies C = 3',
                  reason: 'Sustituimos x = 2 e igualamos a 5 para seleccionar la única curva de la familia que pasa por (2, 5).'
                },
                {
                  title: 'Paso 3: Escribir la antiderivada particular',
                  math: 'F(x) = 2x^2 - 3x + 3',
                  reason: 'Sustituimos C = 3 en la expresión general.'
                }
              ],
              graphPayload: { kind: 'integral', expr: '2*x^2 - 3*x + 3', integralA: 0, integralB: 2, showIntegral: true }
            },
            {
              title: 'Ejemplo 3: Simplificación previa combinada con trigonométricas y exponenciales',
              problem: 'Calcula $\\int \\left(\\frac{x^3 + 2x}{x} + 3\\cos(x) - 2e^x\\right) dx$ ($x \\neq 0$) y verifica tu resultado derivando.',
              steps: [
                {
                  title: 'Paso 1: Dividir algebraicamente cada término del numerador entre x',
                  math: '\\int \\left(x^2 + 2 + 3\\cos(x) - 2e^x\\right) dx',
                  reason: 'La integral de un cociente NO es el cociente de integrales; simplificar el polinomio convierte todo en suma directa.'
                },
                {
                  title: 'Paso 2: Integrar cada término y comprobar por derivación',
                  math: 'F(x) = \\frac{x^3}{3} + 2x + 3\\,\\text{sen}(x) - 2e^x + C \\quad \\Longrightarrow \\quad F\'(x) = x^2 + 2 + 3\\cos(x) - 2e^x',
                  reason: 'Al derivar F(x) recuperamos exactamente el integrando simplificado.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Aplicar la regla de la potencia a $\\int x^{-1}\\,dx$ escribiendo $\\frac{x^0}{0}$.',
              correct: 'Cuando el exponente es $-1$, es decir $\\int \\frac{1}{x}\\,dx$, la antiderivada es siempre $\\ln|x| + C$.',
              why: 'La división entre cero no está definida; la función cuya derivada es $1/x$ es $\\ln|x|$.'
            },
            {
              wrong: 'Confundir los signos de las integrales trigonométricas escribiendo $\\int \\text{sen}(x)\\,dx = \\cos(x) + C$.',
              correct: '$\\int \\text{sen}(x)\\,dx = -\\cos(x) + C$, porque la derivada de $\\cos(x)$ es $-\\text{sen}(x)$.',
              why: 'En integración los signos de seno y coseno son opuestos a los de derivación.'
            }
          ],
          exercises: [
            {
              id: 'int-1-ex1',
              level: 'basico',
              statement: 'Halla la antiderivada principal $F(x)$ (con $C = 0$) de la función $f(x) = 3x^2 - 4x + 5$.',
              answer: 'x^3 - 2*x^2 + 5*x',
              alternatives: ['x^3-2x^2+5x', 'x^3-2*x^2+5*x'],
              placeholder: 'Ej: x^3 - 2x^2 + 5x',
              hints: [
                'Integra término a término usando $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}$.',
                '$\\int 3x^2\\,dx = 3\\frac{x^3}{3} = x^3$ y $\\int -4x\\,dx = -4\\frac{x^2}{2} = -2x^2$.',
                'La integral de la constante $5$ es $5x$.'
              ],
              solutionSteps: [
                '$\\int (3x^2 - 4x + 5)\\,dx = 3\\left(\\frac{x^3}{3}\\right) - 4\\left(\\frac{x^2}{2}\\right) + 5x = x^3 - 2x^2 + 5x$.'
              ],
              reviewTip: 'Suma $1$ al exponente de cada término y divide el coeficiente entre ese nuevo exponente.',
              whyCorrect: '¡Exacto! Si derivas $x^3 - 2x^2 + 5x$, recuperas inmediatamente $3x^2 - 4x + 5$.'
            },
            {
              id: 'int-1-ex2',
              level: 'intermedio',
              statement: 'Encuentra la antiderivada principal (con $C = 0$) de $f(x) = \\frac{1}{x^2} + 3\\sqrt{x}$ para $x > 0$.',
              answer: '-1/x + 2*x^(3/2)',
              alternatives: ['-1/x+2x^(3/2)', '-x^(-1)+2*x^(1.5)', '2*x*sqrt(x)-1/x', '-1/x + 2*x*sqrt(x)'],
              placeholder: 'Ej: -1/x + 2*x^(3/2)',
              hints: [
                'Reescribe el integrando con exponentes: $x^{-2} + 3x^{1/2}$.',
                '$\\int x^{-2}\\,dx = \\frac{x^{-1}}{-1} = -\\frac{1}{x}$.',
                '$\\int 3x^{1/2}\\,dx = 3 \\cdot \\frac{x^{3/2}}{3/2} = 2x^{3/2}$.'
              ],
              solutionSteps: [
                'Reescribimos: $\\int (x^{-2} + 3x^{1/2})\\,dx$.',
                'Integrando: $\\frac{x^{-1}}{-1} + 3\\left(\\frac{x^{3/2}}{3/2}\\right) = -\\frac{1}{x} + 2x^{3/2}$.'
              ],
              reviewTip: 'Ten cuidado al sumar $1$ al exponente negativo $-2$: $-2 + 1 = -1$ (no $-3$).',
              whyCorrect: '¡Excelente manejo de exponentes negativos y fraccionarios!'
            },
            {
              id: 'int-1-ex3',
              level: 'avanzado',
              statement: 'Sabiendo que $F\'(x) = 6x^2 - 2x + 1$ y que la curva primitiva cumple la condición inicial $F(1) = 7$, calcula el valor numérico exacto de la constante de integración $C$ (o el valor de $F(0)$).',
              answer: '5',
              alternatives: ['5'],
              placeholder: 'Valor numérico de la constante C...',
              hints: [
                'Integra primero: $F(x) = 2x^3 - x^2 + x + C$.',
                'Sustituye $x = 1$ en $F(x)$ e iguala a $7$: $2(1)^3 - (1)^2 + 1 + C = 7$.',
                'Despeja $C$.'
              ],
              solutionSteps: [
                'Antiderivada general: $F(x) = \\int (6x^2 - 2x + 1)\\,dx = 2x^3 - x^2 + x + C$.',
                'Imponiendo $F(1) = 7$: $2(1) - 1 + 1 + C = 7 \\implies 2 + C = 7 \\implies C = 5$.'
              ],
              reviewTip: 'Integra primero para hallar $2x^3 - x^2 + x + C$ y luego sustituye $x = 1$ para despejar $C$.',
              whyCorrect: '¡Perfecto! La condición inicial $F(1) = 7$ fija de manera única la constante $C = 5$.'
            },
            {
              id: 'int-1-ex4',
              level: 'basico',
              statement: 'El flujo de entrada de agua a un tanque es $r(t) = 6t + 4$ litros por minuto. Si al comienzo ($t = 0$) el tanque contenía $10\\text{ litros}$, calcula cuántos litros totales tendrá en $t = 2$ minutos.',
              answer: '30',
              alternatives: ['30'],
              placeholder: 'Volumen total en litros...',
              whyCorrect: 'La antiderivada es $V(t) = 3t^2 + 4t + C$; con $V(0) = 10$ resulta $C = 10$, y en $t = 2$ vale $V(2) = 3(4) + 4(2) + 10 = 30\\text{ L}$.',
              reviewTip: 'La condición inicial $V(0) = 10$ fija el valor exacto de la constante de integración $C$.',
              hints: [
                'Integra la tasa de cambio: $V(t) = \\int (6t + 4)\\,dt = 3t^2 + 4t + C$.',
                'Usa $V(0) = 10$ para hallar $C = 10$.',
                'Evalúa $V(2) = 3(2)^2 + 4(2) + 10$.'
              ],
              solutionSteps: [
                'Antiderivada: $V(t) = 3t^2 + 4t + C$. Como $V(0) = 10$, entonces $C = 10$.',
                'En $t = 2$: $V(2) = 12 + 8 + 10 = 30\\text{ litros}$.'
              ]
            },
            {
              id: 'int-1-ex5',
              level: 'intermedio',
              statement: 'El perfil de una pista tiene pendiente dada por $\\frac{dy}{dx} = 4x - 3$. Si la curva pasa por el punto $(1, 5)$, calcula el valor exacto de la altura $y$ cuando $x = 3$.',
              answer: '15',
              alternatives: ['15'],
              placeholder: 'Altura y(3)...',
              whyCorrect: 'Integrando, $y(x) = 2x^2 - 3x + C$. Con $y(1) = 2 - 3 + C = 5$ resulta $C = 6$, así que $y(3) = 2(9) - 3(3) + 6 = 15$.',
              reviewTip: 'Encuentra primero la familia de antiderivadas y luego sustituye $(1, 5)$ para determinar $C$.',
              hints: [
                'Integra $4x - 3$ para obtener $y(x) = 2x^2 - 3x + C$.',
                'Sustituye $x = 1, y = 5$: $2(1) - 3(1) + C = 5 \\Rightarrow C = 6$.',
                'Calcula $y(3) = 2(3)^2 - 3(3) + 6$.'
              ],
              solutionSteps: [
                '$y(x) = 2x^2 - 3x + C$. Con $(1, 5)$: $-1 + C = 5 \\Rightarrow C = 6$.',
                '$y(3) = 18 - 9 + 6 = 15$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el resultado de la integral indefinida $\\int \\left(e^x + \\frac{4}{x} - \\text{sen}(x)\\right) dx$?',
              options: [
                'e^x + 4 ln|x| + cos(x) + C',
                'e^x + 4 ln|x| - cos(x) + C',
                'e^x - 4/x² + cos(x) + C',
                'x·e^(x-1) + 4 ln|x| + cos(x) + C'
              ],
              correctIndex: 0,
              explanation: 'Tenemos $\\int e^x\\,dx = e^x$, $\\int \\frac{4}{x}\\,dx = 4\\ln|x|$ y $\\int (-\\text{sen}(x))\\,dx = +\\cos(x) + C$.'
            },
            {
              question: '¿Qué representa geométricamente la constante $C$ en la integral indefinida $F(x) + C$?',
              options: [
                'Una familia de curvas paralelas trasladadas verticalmente que tienen todas la misma pendiente en cada x',
                'La pendiente de la recta tangente en el origen',
                'El área encerrada entre x = 0 y x = C',
                'Una asíntota horizontal en y = C'
              ],
              correctIndex: 0,
              explanation: 'Sumar una constante $C$ traslada verticalmente la gráfica de $F(x)$ sin alterar la inclinación de sus rectas tangentes.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           INT-2: MÉTODOS DE INTEGRACIÓN: SUSTITUCIÓN E INTEGRACIÓN POR PARTES
           ------------------------------------------------------------------ */
        {
          id: 'int-2',
          title: 'Métodos de Integración: Sustitución (Cambio de Variable) e Integración por Partes',
          summary: 'Inversión de la regla de la cadena mediante cambio de variable u = g(x) e inversión de la regla del producto (ILATE).',
          graphPreset: 'x*exp(-0.5*x^2)',
          demoAnimations: ['int-suma-riemann', 'der-construccion-fprima'],
          interactiveGraph: {
            mode: 'integrals',
            title: 'Visualizador de Integrandos Compuestos y Productos',
            description: 'Explora la acumulación bajo funciones como x·e^(-0.5x²) (integrable por sustitución u = -0.5x²) o x·cos(x) (integrable por partes).',
            fn: 'x*exp(-0.5*x^2)',
            a: 0,
            b: 2.5,
            n: 16,
            xDomain: [-3, 3.5],
            yDomain: [-1.5, 1.5],
            presets: [
              { label: 'Sustitución: x·e^(-0.5x²)', fn: 'x*exp(-0.5*x^2)', a: 0, b: 2.5, n: 16 },
              { label: 'Por partes: x·cos(x)', fn: 'x*cos(x)', a: 0, b: 2.0, n: 16 },
              { label: 'Logarítmica por sustitución: (2x)/(x² + 1)', fn: '(2*x)/(x^2 + 1)', a: 0, b: 2.5, n: 16 }
            ]
          },
          theory: {
            intro: [
              'Así como en derivación necesitamos la Regla de la Cadena para funciones compuestas y la Regla del Producto para multiplicaciones, en integración existen sus dos contrapartes exactas: el **Método de Sustitución (Cambio de Variable)** y el **Método de Integración por Partes**.',
              'Dominar estos dos métodos permite transformar integrales que parecen inabordables a primera vista en integrales elementales inmediatas.'
            ],
            prerequisites: [
              'Cálculo del diferencial de una función: si $u = g(x)$, entonces su diferencial es $du = g\'(x)\\,dx$.',
              'Tablas de integrales inmediatas (potencias, exponenciales y trigonométricas).'
            ],
            detailedExplanation: [
              '**1. Método de Sustitución o Cambio de Variable:** Es el proceso inverso de la regla de la cadena. Se utiliza cuando dentro del integrando observas una función interna $u = g(x)$ y, multiplicando afuera (salvo por un factor constante), aparece su derivada $g\'(x)\\,dx$.\n- **Procedimiento:** Elige $u = g(x)$, calcula el diferencial $du = g\'(x)\\,dx$, despeja y sustituye todo en términos de $u$ para obtener $\\int f(u)\\,du$. Integra respecto a $u$ y finalmente **devuelve el cambio** reemplazando $u$ por $g(x)$.',
              '**2. Caso especial logarítmico por sustitución:** Siempre que el numerador de una fracción sea la derivada exacta del denominador, la integral es el logaritmo natural del denominador: $\\int \\frac{g\'(x)}{g(x)}\\,dx = \\ln|g(x)| + C$.',
              '**3. Método de Integración por Partes:** Proviene de integrar la regla del producto $(u \\cdot v)\' = u\'v + uv\'$, despejando $\\int u\\,dv = u \\cdot v - \\int v\\,du$. Se aplica a productos de funciones de distinta naturaleza (por ejemplo, un polinomio por una exponencial $\\int x e^x\\,dx$, un polinomio por un seno/coseno $\\int x\\cos(x)\\,dx$, o logaritmos $\\int \\ln(x)\\,dx$).\n- **Regla mnemotécnica ILATE para elegir $u$:** Elige como $u$ la primera función que aparezca en el orden: **I**nversa trigonométrica, **L**ogarítmica, **A**lgebraica (polinomio), **T**rigonométrica, **E**xponencial. Todo el resto del integrando (incluido $dx$) será $dv$.'
            ],
            concepts: [
              {
                title: '1. Fórmula de Sustitución (Cambio de Variable)',
                body: 'Si $u = g(x)$ es derivable y $du = g\'(x)\\,dx$, entonces: $$\\int f(g(x)) \\cdot g\'(x)\\,dx = \\int f(u)\\,du = F(u) + C = F(g(x)) + C$$ Si a $g\'(x)\\,dx$ solo le falta una constante multiplicativa $k$, se compensa dividiendo entre $k$ fuera de la integral.'
              },
              {
                title: '2. Patrones Frecuentes de Sustitución Directa',
                body: '- **Potencia compuesta:** $\\int [g(x)]^n \\cdot g\'(x)\\,dx = \\frac{[g(x)]^{n+1}}{n+1} + C$ ($n \\neq -1$).\n- **Cociente logarítmico:** $\\int \\frac{g\'(x)}{g(x)}\\,dx = \\ln|g(x)| + C$.\n- **Exponencial compuesta:** $\\int e^{g(x)} \\cdot g\'(x)\\,dx = e^{g(x)} + C$.'
              },
              {
                title: '3. Fórmula de Integración por Partes',
                body: 'Sean $u$ y $v$ funciones derivables: $$\\int u\\,dv = u \\cdot v - \\int v\\,du$$ Para elegir $u$ (que se deriva para obtener $du$) y $dv$ (que se integra para obtener $v$), sigue la prioridad **I - L - A - T - E**.'
              }
            ],
            formulas: [
              {
                label: 'Cambio de Variable (Sustitución)',
                expr: 'u = g(x), \\; du = g\'(x)\\,dx \\implies \\int f(g(x))\\,g\'(x)\\,dx = \\int f(u)\\,du',
                note: 'Nunca dejes variables mezcladas (x y u al mismo tiempo) dentro de la integral.'
              },
              {
                label: 'Integración por Partes',
                expr: '\\int u\\,dv = u \\cdot v - \\int v\\,du',
                note: 'Prioridad ILATE para elegir u: Inversa, Logarítmica, Algebraica, Trigonométrica, Exponencial.'
              }
            ],
            theorems: [
              {
                badge: 'Deducción de Reglas',
                title: 'Fórmula de Integración por Partes desde la Regla del Producto',
                hypothesis: 'Sean $u(x)$ y $v(x)$ funciones con derivada continua en un intervalo $I$.',
                statement: '$\\int u(x)v\'(x)\\,dx = u(x)v(x) - \\int v(x)u\'(x)\\,dx$, abreviada como $\\int u\\,dv = uv - \\int v\\,du$.',
                proofSteps: [
                  'Por la regla del producto: $\\frac{d}{dx}[u(x)v(x)] = u\'(x)v(x) + u(x)v\'(x)$.',
                  'Integrando ambos miembros respecto a $x$: $u(x)v(x) = \\int u\'(x)v(x)\\,dx + \\int u(x)v\'(x)\\,dx$.',
                  'Despejando la segunda integral obtenemos directamente $\\int u(x)v\'(x)\\,dx = u(x)v(x) - \\int v(x)u\'(x)\\,dx$. $\\blacksquare$'
                ]
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo 1: Integración por Sustitución (Cambio de Variable)',
              problem: 'Resuelve la integral indefinida: $$\\int x \\cdot \\sqrt{x^2 + 9}\\,dx$$',
              steps: [
                {
                  title: 'Paso 1: Elegir u como el interior de la raíz y calcular du',
                  math: 'u = x^2 + 9 \\implies du = 2x\\,dx \\implies x\\,dx = \\frac{du}{2}',
                  reason: 'Como afuera de la raíz tenemos x dx, despejamos exactamente x dx = du / 2.'
                },
                {
                  title: 'Paso 2: Sustituir todo en términos de u e integrar la potencia',
                  math: '\\int \\sqrt{u} \\cdot \\frac{du}{2} = \\frac{1}{2} \\int u^{1/2}\\,du = \\frac{1}{2} \\left(\\frac{u^{3/2}}{3/2}\\right) + C = \\frac{1}{3}u^{3/2} + C',
                  reason: 'Al multiplicar (1/2) por (2/3) los factores 2 se cancelan, quedando 1/3.'
                },
                {
                  title: 'Paso 3: Devolver el cambio de variable a x',
                  math: '\\frac{1}{3}(x^2 + 9)^{3/2} + C',
                  reason: 'Sustituimos nuevamente u = x² + 9 para expresar la respuesta en la variable original.'
                }
              ],
              graphPayload: { kind: 'integral', expr: 'x*sqrt(x^2 + 9)', integralA: 0, integralB: 4, showIntegral: true }
            },
            {
              title: 'Ejemplo 2: Integración por Partes de un producto algebraico-exponencial',
              problem: 'Calcula la integral indefinida: $$\\int x \\cdot e^{2x}\\,dx$$',
              steps: [
                {
                  title: 'Paso 1: Elegir u y dv mediante el criterio ILATE',
                  math: 'u = x \\implies du = dx \\quad ; \\quad dv = e^{2x}\\,dx \\implies v = \\frac{1}{2}e^{2x}',
                  reason: 'x es Algebraica (A) y e^(2x) es Exponencial (E); como A va antes que E en ILATE, elegimos u = x.'
                },
                {
                  title: 'Paso 2: Aplicar la fórmula u·v - ∫ v du',
                  math: '\\int x\\,e^{2x}\\,dx = x\\left(\\frac{1}{2}e^{2x}\\right) - \\int \\frac{1}{2}e^{2x}\\,dx',
                  reason: 'Observa que la nueva integral ya no tiene el factor x y es inmediata.'
                },
                {
                  title: 'Paso 3: Resolver la integral restante y simplificar',
                  math: '\\frac{1}{2}x\\,e^{2x} - \\frac{1}{2}\\left(\\frac{1}{2}e^{2x}\\right) + C = \\frac{1}{2}x\\,e^{2x} - \\frac{1}{4}e^{2x} + C = \\frac{e^{2x}}{4}(2x - 1) + C',
                  reason: 'Integramos e^(2x) nuevamente dividiendo entre 2.'
                }
              ],
              graphPayload: { kind: 'integral', expr: 'x*exp(2*x)', integralA: 0, integralB: 1, showIntegral: true }
            },
            {
              title: 'Ejemplo 3: Antiderivada clásica de ln(x) mediante integración por partes',
              problem: 'Halla $\\int \\ln(x)\\,dx$ para $x > 0$ aplicando integración por partes.',
              steps: [
                {
                  title: 'Paso 1: Elegir u = ln(x) (L en ILATE) y dv = 1 dx',
                  math: 'u = \\ln(x) \\implies du = \\frac{1}{x}\\,dx \\quad ; \\quad dv = dx \\implies v = x',
                  reason: 'Aunque no aparezca explícitamente otro factor, tomamos dv = dx cuya primitiva es x.'
                },
                {
                  title: 'Paso 2: Aplicar la fórmula y verificar derivando',
                  math: '\\int \\ln(x)\\,dx = x\\ln(x) - \\int x \\cdot \\frac{1}{x}\\,dx = x\\ln(x) - \\int 1\\,dx = x\\ln(x) - x + C',
                  reason: 'Derivando: (1)·ln(x) + x·(1/x) - 1 = ln(x) + 1 - 1 = ln(x).'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Sacar una expresión con la variable $x$ fuera del símbolo de integral para compensar el diferencial: $\\int e^{x^2}\\,dx = \\frac{1}{2x} \\int 2x\\,e^{x^2}\\,dx$.',
              correct: 'Solo las **constantes numéricas** pueden salir o entrar como factores del signo $\\int$. La integral $\\int e^{x^2}\\,dx$ no tiene antiderivada elemental porque falta el factor $x$ en el integrando.',
              why: 'La propiedad de linealidad $\\int c\\,f(x)\\,dx = c\\int f(x)\\,dx$ es exclusiva para constantes $c$ independientes de $x$.'
            },
            {
              wrong: 'Olvidar regresar de la variable auxiliar $u$ a la variable original $x$ al finalizar una integral indefinida.',
              correct: 'Toda integral indefinida planteada en $x$ debe entregarse finalmente en función de $x$ reemplazando $u = g(x)$.',
              why: '$u$ es un andamio temporal introducido por nosotros, no la variable del problema.'
            }
          ],
          exercises: [
            {
              id: 'int-2-ex1',
              level: 'basico',
              statement: 'Resuelve por sustitución (con $C = 0$) la integral: $\\int 2x(x^2 + 1)^3\\,dx$',
              answer: '((x^2 + 1)^4)/4',
              alternatives: ['(x^2+1)^4/4', '0.25*(x^2+1)^4', '(1/4)*(x^2+1)^4'],
              placeholder: 'Ej: (x^2 + 1)^4 / 4',
              hints: [
                'Toma el cambio de variable $u = x^2 + 1$.',
                'Observa que $du = 2x\\,dx$, que aparece exactamente en el integrando.',
                'Integra $\\int u^3\\,du = \\frac{u^4}{4}$ y regresa a la variable $x$.'
              ],
              solutionSteps: [
                'Sea $u = x^2 + 1 \\implies du = 2x\\,dx$.',
                '$\\int u^3\\,du = \\frac{u^4}{4} = \\frac{(x^2 + 1)^4}{4}$.'
              ],
              reviewTip: 'Identifica $u = x^2 + 1$ y $du = 2x\\,dx$; al integrar $u^3$, el resultado es $u^4 / 4$.',
              whyCorrect: '¡Perfecto! Reconociste de inmediato la estructura $\\int u^3\\,du$.'
            },
            {
              id: 'int-2-ex2',
              level: 'intermedio',
              statement: 'Halla la antiderivada principal (con $C = 0$) mediante cambio de variable de: $\\int \\frac{2x}{x^2 + 4}\\,dx$',
              answer: 'ln(x^2 + 4)',
              alternatives: ['ln(x^2+4)'],
              placeholder: 'Ej: ln(x^2 + 4)',
              hints: [
                'Elige como $u$ el denominador: $u = x^2 + 4$.',
                'Su diferencial es $du = 2x\\,dx$, que coincide exactamente con el numerador.',
                'Aplica $\\int \\frac{du}{u} = \\ln|u|$ (nota que $x^2 + 4 > 0$ siempre).'
              ],
              solutionSteps: [
                'Con $u = x^2 + 4$, tenemos $du = 2x\\,dx$.',
                'La integral se transforma en $\\int \\frac{du}{u} = \\ln(x^2 + 4)$.'
              ],
              reviewTip: 'Cuando el numerador es la derivada exacta del denominador ($\\frac{u\'}{u}$), la integral es $\\ln(u)$.',
              whyCorrect: '¡Muy bien! Aplicaste el patrón logarítmico $\\int \\frac{u\'}{u}\\,dx = \\ln|u| + C$.'
            },
            {
              id: 'int-2-ex3',
              level: 'avanzado',
              statement: 'Utiliza **integración por partes** para hallar la antiderivada principal (con $C = 0$) de: $\\int x \\cdot e^x\\,dx$',
              answer: 'x*exp(x) - exp(x)',
              alternatives: ['x*e^x - e^x', '(x - 1)*e^x', '(x-1)*exp(x)', 'e^x*(x-1)', 'x*e^x-e^x'],
              placeholder: 'Ej: x*e^x - e^x',
              hints: [
                'Por ILATE, elige $u = x$ ($du = dx$) y $dv = e^x\\,dx$ ($v = e^x$).',
                'Sustituye en $u \\cdot v - \\int v\\,du = x\\,e^x - \\int e^x\\,dx$.',
                'Resuelve la última integral $\\int e^x\\,dx = e^x$.'
              ],
              solutionSteps: [
                'Elegimos $u = x \\implies du = dx$ y $dv = e^x\\,dx \\implies v = e^x$.',
                'Aplicando por partes: $\\int x\\,e^x\\,dx = x\\,e^x - \\int e^x\\,dx = x\\,e^x - e^x = (x - 1)e^x$.'
              ],
              reviewTip: 'Recuerda la fórmula $\\int u\\,dv = u \\cdot v - \\int v\\,du$ con $u = x$ y $v = e^x$.',
              whyCorrect: '¡Excelente! Al derivar $(x - 1)e^x$ con la regla del producto se obtiene $1\\cdot e^x + (x-1)e^x = x\\,e^x$.'
            },
            {
              id: 'int-2-ex4',
              level: 'intermedio',
              statement: 'La velocidad de transmisión en una red sigue $f(t) = 6t(t^2 + 1)^2\\text{ MB/s}$. Usando cambio de variable $u = t^2 + 1$, calcula los megabytes transmitidos entre $t = 0$ y $t = 1$: $\\int_0^1 6t(t^2 + 1)^2\\,dt$.',
              answer: '7',
              alternatives: ['7'],
              placeholder: 'Megabytes acumulados...',
              whyCorrect: 'Con $u = t^2 + 1$, $du = 2t\\,dt$ y los límites cambian de $[0, 1]$ a $[1, 2]$: $\\int_1^2 3u^2\\,du = [u^3]_1^2 = 8 - 1 = 7\\text{ MB}$.',
              reviewTip: 'Al usar sustitución en una integral definida, cambia también los límites de integración a la nueva variable $u$.',
              hints: [
                'Define $u = t^2 + 1$, entonces $du = 2t\\,dt$ (así que $6t\\,dt = 3\\,du$).',
                'Cambia límites: si $t=0 \\Rightarrow u=1$; si $t=1 \\Rightarrow u=2$.',
                'Evalúa $\\int_1^2 3u^2\\,du = 2^3 - 1^3$.'
              ],
              solutionSteps: [
                'Sustitución $u = t^2 + 1, du = 2t\\,dt$: $\\int_1^2 3u^2\\,du = \\left[u^3\\right]_1^2 = 2^3 - 1^3 = 7$.'
              ]
            },
            {
              id: 'int-2-ex5',
              level: 'avanzado',
              statement: 'Un modelo termodinámico evalúa el trabajo acumulado mediante $W = \\int_0^1 x\\,e^x\\,dx$. Aplica integración por partes para hallar el valor numérico exacto de $W$.',
              answer: '1',
              alternatives: ['1'],
              placeholder: 'Valor exacto de W...',
              whyCorrect: 'Tomando $u = x$ y $dv = e^x\\,dx$, por partes se obtiene $[x\\,e^x - e^x]_0^1 = (1\\cdot e - e) - (0 - e^0) = 0 - (-1) = 1$.',
              reviewTip: 'Aplica $\\int u\\,dv = uv - \\int v\\,du$ eligiendo $u = x$ para que desaparezca al derivar.',
              hints: [
                'Elige $u = x$ ($du = dx$) y $dv = e^x\\,dx$ ($v = e^x$).',
                'La antiderivada es $x\\,e^x - \\int e^x\\,dx = (x - 1)e^x$.',
                'Evalúa en el extremo superior $x = 1$ y resta en $x = 0$.'
              ],
              solutionSteps: [
                'Por partes: $\\left[x\\,e^x - e^x\\right]_0^1 = (e - e) - (0 - 1) = 0 + 1 = 1$.'
              ]
            }
          ],
          quiz: [
            {
              question: 'Para resolver la integral $\\int x^2 \\ln(x)\\,dx$ mediante integración por partes (criterio ILATE), ¿cuál es la elección correcta de $u$ y $dv$?',
              options: [
                'u = ln(x) y dv = x² dx',
                'u = x² y dv = ln(x) dx',
                'u = x² ln(x) y dv = dx',
                'u = x y dv = x ln(x) dx'
              ],
              correctIndex: 0,
              explanation: 'En el acrónimo ILATE, la función Logarítmica (L) precede a la Algebraica (A), por lo que debemos elegir $u = \\ln(x)$ (cuya derivada es $\\frac{1}{x}\\,dx$) y $dv = x^2\\,dx$.'
            },
            {
              question: '¿Cuál es el resultado de $\\int \\cos(5x)\\,dx$?',
              options: [
                '(1/5) sen(5x) + C',
                '5 sen(5x) + C',
                '-(1/5) sen(5x) + C',
                'sen(5x) + C'
              ],
              correctIndex: 0,
              explanation: 'Con el cambio $u = 5x$, tenemos $du = 5\\,dx \\implies dx = \\frac{du}{5}$, por lo que $\\int \\cos(5x)\\,dx = \\frac{1}{5}\\,\\text{sen}(5x) + C$.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           INT-3: INTEGRALES DEFINIDAS, TEOREMA FUNDAMENTAL DEL CÁLCULO, ÁREA BAJO LA CURVA Y APLICACIONES
           ------------------------------------------------------------------ */
        {
          id: 'int-3',
          title: 'Integrales Definidas, Teorema Fundamental del Cálculo, Área Bajo la Curva y Aplicaciones',
          summary: 'Sumas de Riemann, Regla de Barrow F(b) - F(a), diferenciación visual y analítica entre áreas positivas y negativas, y aplicaciones.',
          graphPreset: 'x^3 - 4*x',
          demoAnimations: ['int-suma-riemann'],
          interactiveGraph: {
            mode: 'integrals',
            title: 'Laboratorio del Teorema Fundamental del Cálculo: Áreas Positivas y Negativas',
            description: 'En azul se sombrea la región donde f(x) ≥ 0 (aportación positiva a la integral) y en ámbar donde f(x) < 0 (aportación negativa). Modifica [a, b] y compara la Integral Neta con el Área Geométrica Total.',
            fn: 'x^3 - 4*x',
            a: -2,
            b: 2,
            n: 20,
            xDomain: [-3, 3],
            yDomain: [-5, 5],
            presets: [
              { label: 'Simétrica (+ y -): x³ - 4x en [-2, 2]', fn: 'x^3 - 4*x', a: -2, b: 2, n: 20 },
              { label: 'Parábola positiva: 4 - x² en [-2, 2]', fn: '4 - x^2', a: -2, b: 2, n: 18 },
              { label: 'Coseno con cambio de signo: cos(x) en [0, 3.14]', fn: 'cos(x)', a: 0, b: 3.14, n: 18 }
            ]
          },
          theory: {
            intro: [
              'Durante siglos, el cálculo de rectas tangentes (derivadas) y el cálculo de áreas de regiones curvas (integrales definidas) se consideraron problemas completamente independientes. El descubrimiento cumbre de Isaac Newton y Gottfried Wilhelm Leibniz fue el **Teorema Fundamental del Cálculo (TFC)**, que demuestra que la derivación y la integración son operaciones inversas.',
              'Gracias al Teorema Fundamental del Cálculo, en lugar de calcular límites infinitos de sumas de rectángulos (Sumas de Riemann), podemos evaluar con exactitud cualquier **integral definida** $\\int_a^b f(x)\\,dx$ simplemente restando los valores de una antiderivada en los extremos del intervalo: $F(b) - F(a)$.'
            ],
            prerequisites: [
              'Cálculo de antiderivadas $F(x)$ mediante reglas básicas y cambio de variable.',
              'Resolución de ecuaciones $f(x) = 0$ para localizar dónde una curva cruza el eje $X$ y cambia de signo.'
            ],
            detailedExplanation: [
              '**1. De las Sumas de Riemann a la Integral Definida:** Para medir la región bajo $y = f(x)$ en $[a, b]$, dividimos el intervalo en $n$ subintervalos de ancho $\\Delta x = \\frac{b - a}{n}$ y sumamos las áreas firmadas de $n$ rectángulos: $S_n = \\sum_{i=1}^n f(x_i^*)\\,\\Delta x$. Cuando el número de rectángulos tiende a infinito ($n \\to \\infty$), este límite define la **integral definida** $\\int_a^b f(x)\\,dx$.',
              '**2. El Teorema Fundamental del Cálculo (Regla de Barrow):** Si $f(x)$ es continua en $[a, b]$ y $F(x)$ es cualquier antiderivada de $f(x)$ (es decir, $F\'(x) = f(x)$), entonces: $$\\int_a^b f(x)\\,dx = \\Big[F(x)\\Big]_a^b = F(b) - F(a)$$ Observa que la constante $C$ se cancela automáticamente al restar $(F(b) + C) - (F(a) + C)$.',
              '**3. Diferencia crucial entre Integral Definida (Área Neta) y Área Geométrica Total:**\n- Donde la curva está **por encima del eje $X$** ($f(x) \\ge 0$), la integral acumula **área positiva**.\n- Donde la curva está **por debajo del eje $X$** ($f(x) < 0$), las alturas $f(x_i)$ son negativas y la integral acumula **valor negativo**.\n- Por tanto, $\\int_a^b f(x)\\,dx = \\text{Área}_{(+)} - \\text{Área}_{(-)}$ es el **área neta con signo**. Si se desea el **área geométrica total** (que siempre es positiva), debemos hallar las raíces $c \\in (a, b)$ donde $f(c) = 0$, dividir la integral en subintervalos y sumar los valores absolutos: $\\text{Área Total} = \\int_a^b |f(x)|\\,dx$.'
            ],
            concepts: [
              {
                title: '1. Teorema Fundamental del Cálculo (Parte 1 y Parte 2)',
                body: '- **Parte 1 (Derivada de una función integral):** Si $G(x) = \\int_a^x f(t)\\,dt$, entonces $G\'(x) = f(x)$.\n- **Parte 2 (Regla de Evaluación de Barrow):** Si $F\'(x) = f(x)$, entonces: $$\\int_a^b f(x)\\,dx = F(b) - F(a)$$'
              },
              {
                title: '2. Propiedades de la Integral Definida',
                body: '- **Intervalo nulo:** $\\int_a^a f(x)\\,dx = 0$.\n- **Inversión de límites:** $\\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx$.\n- **Aditividad de intervalos:** Para cualquier $c \\in [a, b]$, $\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx$.'
              },
              {
                title: '3. Interpretación Geométrica: Áreas Positivas vs. Áreas Negativas',
                body: '- **Integral Definida (Cambio Neto):** $\\int_a^b f(x)\\,dx = A_{\\text{arriba}} - A_{\\text{abajo}}$.\n- **Área Geométrica Total:** $$A_{\\text{total}} = \\int_a^b |f(x)|\\,dx = A_{\\text{arriba}} + A_{\\text{abajo}}$$'
              },
              {
                title: '4. Aplicaciones Físicas y Geométricas',
                body: '- **Desplazamiento vs. Distancia recorrida:** Si $v(t)$ es la velocidad, $\\int_{t_1}^{t_2} v(t)\\,dt$ es el **desplazamiento neto**, mientras que $\\int_{t_1}^{t_2} |v(t)|\\,dt$ es la **distancia total recorrida**.\n- **Valor promedio de una función en $[a, b]$:** $f_{\\text{prom}} = \\frac{1}{b - a} \\int_a^b f(x)\\,dx$.'
              }
            ],
            formulas: [
              {
                label: 'Teorema Fundamental del Cálculo (Regla de Barrow)',
                expr: '\\int_a^b f(x)\\,dx = \\Big[F(x)\\Big]_a^b = F(b) - F(a) \\quad (\\text{donde } F\'(x) = f(x))',
                note: 'Evalúa siempre primero el límite superior b y réstale la evaluación en el límite inferior a.'
              },
              {
                label: 'Área Neta vs. Área Geométrica Total',
                expr: 'I_{\\text{neta}} = A_{+} - A_{-} \\quad ; \\quad A_{\\text{total}} = \\int_a^b |f(x)|\\,dx = A_{+} + A_{-}',
                note: 'Usa la gráfica interactiva superior para visualizar en azul A+ y en ámbar A-.'
              }
            ],
            theorems: [
              {
                badge: 'Teorema Fundamental del Cálculo (I y II)',
                title: 'Conexión Exacta entre Derivación e Integración (Regla de Barrow)',
                hypothesis: 'Sea $f$ **continua** en el intervalo cerrado $[a, b]$.',
                statement: '**Parte I:** La función área $g(x) = \\int_a^x f(t)\\,dt$ es continua en $[a,b]$, derivable en $(a,b)$ y $g\'(x) = f(x)$. **Parte II (Barrow):** Si $F$ es cualquier antiderivada de $f$ en $[a, b]$ ($F\' = f$), entonces $\\int_a^b f(x)\\,dx = F(b) - F(a)$.',
                proofSteps: [
                  'Para la Parte II: sea $a = x_0 < x_1 < \\dots < x_n = b$ una partición regular de $[a, b]$ con paso $\\Delta x = \\frac{b-a}{n}$.',
                  'Escribimos la diferencia total como suma telescópica: $F(b) - F(a) = \\sum_{i=1}^n [F(x_i) - F(x_{i-1})]$.',
                  'Como $F$ es continua en $[x_{i-1}, x_i]$ y derivable en $(x_{i-1}, x_i)$ con $F\' = f$, el Teorema del Valor Medio garantiza un $c_i \\in (x_{i-1}, x_i)$ tal que $F(x_i) - F(x_{i-1}) = F\'(c_i)\\Delta x = f(c_i)\\Delta x$.',
                  'Sumando obtenemos $F(b) - F(a) = \\sum_{i=1}^n f(c_i)\\Delta x$. Al refinar $n \\to \\infty$, la suma de Riemann converge a $\\int_a^b f(x)\\,dx$, quedando $F(b) - F(a) = \\int_a^b f(x)\\,dx$. $\\blacksquare$'
                ]
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo 1: Evaluación de una integral definida mediante el TFC',
              problem: 'Calcula el valor exacto de la integral definida y el área bajo la parábola: $$\\int_1^3 (3x^2 - 2x + 1)\\,dx$$',
              steps: [
                {
                  title: 'Paso 1: Hallar una antiderivada F(x) del integrando',
                  math: 'F(x) = \\int (3x^2 - 2x + 1)\\,dx = x^3 - x^2 + x',
                  reason: 'Integramos término a término omitiendo la constante C porque es una integral definida.'
                },
                {
                  title: 'Paso 2: Evaluar F(x) en el límite superior b = 3 y en el inferior a = 1',
                  math: 'F(3) = 3^3 - 3^2 + 3 = 27 - 9 + 3 = 21 \\quad ; \\quad F(1) = 1^3 - 1^2 + 1 = 1',
                  reason: 'Sustituimos cuidadosamente x = 3 y x = 1.'
                },
                {
                  title: 'Paso 3: Aplicar la Regla de Barrow F(3) - F(1)',
                  math: '\\int_1^3 (3x^2 - 2x + 1)\\,dx = F(3) - F(1) = 21 - 1 = 20\\text{ u}^2',
                  reason: 'Como f(x) > 0 en todo [1, 3], el área bajo la curva es exactamente 20 unidades cuadradas.'
                }
              ],
              graphPayload: { kind: 'integral', expr: '3*x^2 - 2*x + 1', integralA: 1, integralB: 3, showIntegral: true }
            },
            {
              title: 'Ejemplo 2: Cálculo de área cuando la función cruza el eje X (áreas positivas y negativas)',
              problem: 'Para $f(x) = x^3 - 4x$ en el intervalo $[-2, 2]$, compara: a) la integral definida $\\int_{-2}^2 (x^3 - 4x)\\,dx$ y b) el **área geométrica total** encerrada entre la curva y el eje $X$.',
              steps: [
                {
                  title: 'Paso 1: Hallar las raíces donde la curva cruza el eje X',
                  math: 'x^3 - 4x = x(x - 2)(x + 2) = 0 \\implies x = -2, \\; x = 0, \\; x = 2',
                  reason: 'En [-2, 0] la función es positiva (f(x) ≥ 0) y en [0, 2] la función es negativa (f(x) ≤ 0).'
                },
                {
                  title: 'Paso 2: Calcular la integral en [-2, 0] y en [0, 2] usando F(x) = x⁴/4 - 2x²',
                  math: '\\int_{-2}^0 (x^3 - 4x)\\,dx = F(0) - F(-2) = 0 - (4 - 8) = +4 \\quad ; \\quad \\int_0^2 (x^3 - 4x)\\,dx = F(2) - F(0) = (4 - 8) - 0 = -4',
                  reason: 'El lóbulo izquierdo tiene área +4 y el lóbulo derecho aporta -4 a la integral.'
                },
                {
                  title: 'Paso 3: Comparar la Integral Neta con el Área Geométrica Total',
                  math: '\\text{a) Integral neta} = 4 + (-4) = 0 \\quad ; \\quad \\text{b) Área total} = |4| + |-4| = 4 + 4 = 8\\text{ u}^2',
                  reason: 'Las áreas con signo se cancelan en la integral neta (0), pero el área física pintada suma 8 u².'
                }
              ],
              graphPayload: { kind: 'integral', expr: 'x^3 - 4*x', integralA: -2, integralB: 2, showIntegral: true }
            },
            {
              title: 'Ejemplo 3: Valor promedio de una función y Teorema del Valor Medio Integral',
              problem: 'Halla el **valor promedio** de $f(x) = x^2$ en $[0, 3]$ y determina el valor $c \\in (0, 3)$ donde $f(c)$ alcanza dicho promedio.',
              steps: [
                {
                  title: 'Paso 1: Calcular el valor promedio mediante integral definida',
                  math: 'f_{\\text{prom}} = \\frac{1}{3 - 0}\\int_0^3 x^2\\,dx = \\frac{1}{3}\\left[\\frac{x^3}{3}\\right]_0^3 = \\frac{1}{3}(9 - 0) = 3',
                  reason: 'Dividimos la integral definida (área bajo x² igual a 9) entre la longitud del intervalo (3).'
                },
                {
                  title: 'Paso 2: Encontrar c ∈ (0, 3) tal que f(c) = 3',
                  math: 'c^2 = 3 \\implies c = \\sqrt{3} \\approx 1.7321 \\in (0, 3)',
                  reason: 'El rectángulo de base 3 y altura f(√3) = 3 tiene exactamente la misma área (9 u²) que la región parabólica.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Invertir el orden en la Regla de Barrow calculando $F(a) - F(b)$ en lugar de $F(b) - F(a)$.',
              correct: 'Siempre es **Límite Superior menos Límite Inferior**: $\\int_a^b f(x)\\,dx = F(b) - F(a)$.',
              why: 'Invertir el orden cambia el signo de todo el resultado.'
            },
            {
              wrong: 'Suponer que $F(0)$ vale siempre $0$ sin evaluarlo (por ejemplo, cuando $F(x) = e^x$ o $F(x) = \\cos(x)$).',
              correct: 'Evaluar explícitamente $F(0)$: recuerda que $e^0 = 1$ y $\\cos(0) = 1$.',
              why: 'Omitir $F(0)$ cuando hay exponenciales o cosenos produce un error de $1$ unidad en el resultado.'
            }
          ],
          exercises: [
            {
              id: 'int-3-ex1',
              level: 'basico',
              statement: 'Evalúa mediante el Teorema Fundamental del Cálculo la integral definida: $\\int_0^3 (x^2 + 1)\\,dx$',
              answer: '12',
              alternatives: ['12'],
              placeholder: 'Valor numérico de la integral...',
              hints: [
                'Halla la antiderivada: $F(x) = \\frac{x^3}{3} + x$.',
                'Evalúa en el límite superior: $F(3) = \\frac{3^3}{3} + 3 = 9 + 3 = 12$.',
                'Réstale $F(0) = 0$.'
              ],
              solutionSteps: [
                'Antiderivada: $F(x) = \\frac{x^3}{3} + x$.',
                'Por la Regla de Barrow: $F(3) - F(0) = (9 + 3) - 0 = 12$.'
              ],
              reviewTip: 'Calcula la antiderivada $\\frac{x^3}{3} + x$ y evalúa $F(3) - F(0)$.',
              whyCorrect: '¡Correcto! Aplicaste limpiamente la Regla de Barrow $F(3) - F(0) = 12$.'
            },
            {
              id: 'int-3-ex2',
              level: 'intermedio',
              statement: 'Calcula el área bajo la parábola $f(x) = 4 - x^2$ y por encima del eje $X$ en el intervalo $[-2, 2]$.',
              answer: '32/3',
              alternatives: ['32/3', '10.6667', '10.67'],
              placeholder: 'Ej: 32/3',
              hints: [
                'La antiderivada de $4 - x^2$ es $F(x) = 4x - \\frac{x^3}{3}$.',
                'Evalúa $F(2) = 8 - \\frac{8}{3} = \\frac{16}{3}$ y $F(-2) = -8 - \\left(-\\frac{8}{3}\\right) = -\\frac{16}{3}$.',
                'Resta $F(2) - F(-2) = \\frac{16}{3} - \\left(-\\frac{16}{3}\\right)$.'
              ],
              solutionSteps: [
                '$\\int_{-2}^2 (4 - x^2)\\,dx = \\left[4x - \\frac{x^3}{3}\\right]_{-2}^2$.',
                '$F(2) - F(-2) = \\left(8 - \\frac{8}{3}\\right) - \\left(-8 + \\frac{8}{3}\\right) = \\frac{16}{3} + \\frac{16}{3} = \\frac{32}{3}$.'
              ],
              reviewTip: 'Ten mucho cuidado con el doble signo negativo al restar $-F(-2) = -(-16/3) = +16/3$.',
              whyCorrect: '¡Excelente! Además, por ser $4 - x^2$ una función par simétrica, el área en $[-2, 2]$ es el doble del área en $[0, 2]$: $2 \\times \\frac{16}{3} = \\frac{32}{3}$.'
            },
            {
              id: 'int-3-ex3',
              level: 'avanzado',
              statement: 'La función $f(x) = 2x - 4$ cruza el eje $X$ en $x = 2$. Calcula el **área geométrica total** (positiva) encerrada entre la recta $f(x) = 2x - 4$ y el eje $X$ en el intervalo $[0, 4]$.',
              answer: '8',
              alternatives: ['8'],
              placeholder: 'Valor del área geométrica total...',
              hints: [
                'En $[0, 2]$ la recta está bajo el eje $X$ ($f(x) \\le 0$) y en $[2, 4]$ está sobre el eje $X$ ($f(x) \\ge 0$).',
                'Calcula $\\int_0^2 (2x - 4)\\,dx = [x^2 - 4x]_0^2 = 4 - 8 = -4$ (su área positiva es $|-4| = 4$).',
                'Calcula $\\int_2^4 (2x - 4)\\,dx = [x^2 - 4x]_2^4 = (16 - 16) - (4 - 8) = +4$, y suma ambas áreas.'
              ],
              solutionSteps: [
                'Dividimos el intervalo en la raíz $x = 2$: $A_{\\text{total}} = \\left|\\int_0^2 (2x - 4)\\,dx\\right| + \\int_2^4 (2x - 4)\\,dx$.',
                'Con $F(x) = x^2 - 4x$, tenemos $\\int_0^2 (2x-4)\\,dx = -4$ y $\\int_2^4 (2x-4)\\,dx = +4$.',
                'Sumando los valores absolutos: $A_{\\text{total}} = |-4| + 4 = 8\\text{ u}^2$.'
              ],
              reviewTip: 'Recuerda que el **área geométrica total** suma el valor absoluto de la parte negativa ($|-4| = 4$) más la parte positiva ($+4$), dando $8$ (no $0$).',
              whyCorrect: '¡Impecable! Distinguiste perfectamente entre la integral neta ($0$) y el área geométrica total ($|-4| + 4 = 8$).'
            },
            {
              id: 'int-3-ex4',
              level: 'intermedio',
              statement: 'Una válvula suministra agua con caudal $Q(t) = 3t^2 + 2\\text{ L/min}$. Usa la integral definida $\\int_0^3 (3t^2 + 2)\\,dt$ para calcular el volumen total suministrado en los primeros $3$ minutos.',
              answer: '33',
              alternatives: ['33'],
              placeholder: 'Volumen en litros...',
              whyCorrect: 'Por el Teorema Fundamental del Cálculo: $\\left[t^3 + 2t\\right]_0^3 = (3^3 + 2(3)) - 0 = 27 + 6 = 33\\text{ L}$.',
              reviewTip: 'Evalúa la antiderivada $F(t) = t^3 + 2t$ en $t = 3$ menos su valor en $t = 0$.',
              hints: [
                'Encuentra la antiderivada: $F(t) = t^3 + 2t$.',
                'Evalúa $F(3) = 3^3 + 2(3) = 27 + 6$.',
                'Resta $F(0) = 0$.'
              ],
              solutionSteps: [
                '$\\int_0^3 (3t^2 + 2)\\,dt = \\left[t^3 + 2t\\right]_0^3 = (27 + 6) - 0 = 33\\text{ litros}$.'
              ]
            },
            {
              id: 'int-3-ex5',
              level: 'avanzado',
              statement: 'Un ventanal arquitectónico tiene perfil parabólico dado por $y = 9 - x^2$ sobre la base horizontal $y = 0$, entre $x = -3$ y $x = 3$. Calcula su área exacta evaluando $\\int_{-3}^{3} (9 - x^2)\\,dx$.',
              answer: '36',
              alternatives: ['36'],
              placeholder: 'Área en m²...',
              whyCorrect: 'Aprovechando simetría par: $2\\int_0^3 (9 - x^2)\\,dx = 2\\left[9x - \\frac{x^3}{3}\\right]_0^3 = 2(27 - 9) = 36\\text{ m}^2$.',
              reviewTip: 'Como $9 - x^2$ es función par en $[-3, 3]$, puedes integrar de $0$ a $3$ y multiplicar por $2$.',
              hints: [
                'Antiderivada: $F(x) = 9x - \\frac{x^3}{3}$.',
                'Por simetría en $[-3, 3]$, calcula $2 \\cdot F(3)$.',
                'Evalúa $2\\left(27 - \\frac{27}{3}\\right) = 2(18)$.'
              ],
              solutionSteps: [
                '$2\\int_0^3 (9 - x^2)\\,dx = 2\\left[9x - \\frac{x^3}{3}\\right]_0^3 = 2(27 - 9) = 36$.'
              ]
            }
          ],
          quiz: [
            {
              question: 'Si $f(x)$ es continua y sabemos que $F\'(x) = f(x)$ con $F(1) = 4$ y $F(5) = 19$, ¿cuánto vale $\\int_1^5 f(x)\\,dx$?',
              options: [
                '15',
                '23',
                '-15',
                '76'
              ],
              correctIndex: 0,
              explanation: 'Por el Teorema Fundamental del Cálculo, $\\int_1^5 f(x)\\,dx = F(5) - F(1) = 19 - 4 = 15$.'
            },
            {
              question: 'Si una curva $y = f(x)$ está por debajo del eje $X$ en $[a, b]$ y su integral definida es $\\int_a^b f(x)\\,dx = -9$, ¿cuál es el área geométrica de la región?',
              options: [
                '+9 unidades cuadradas',
                '-9 unidades cuadradas',
                '0 unidades cuadradas',
                '81 unidades cuadradas'
              ],
              correctIndex: 0,
              explanation: 'El área geométrica es siempre una magnitud no negativa dada por $\\int_a^b |f(x)|\\,dx = |-9| = 9\\text{ u}^2$.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       MÓDULO 9: CÁLCULO DIFERENCIAL E INTEGRAL (SÍNTESIS Y APLICACIONES)
       ====================================================================== */
    {
      id: 'calculo',
      name: 'Cálculo diferencial e integral',
      symbol: '∫∂',
      levelTag: 'Síntesis Avanzada',
      color: '#0F172A',
      shortDesc: 'Área entre dos curvas, cinemática diferencial e integral, razones de cambio relacionadas y ecuaciones diferenciales separables.',
      topics: [
        /* ------------------------------------------------------------------
           CALC-1: ÁREA ENTRE DOS CURVAS Y CINEMÁTICA DIFERENCIAL E INTEGRAL
           ------------------------------------------------------------------ */
        {
          id: 'calc-1',
          title: 'Área Entre Dos Curvas y Aplicaciones en Cinemática',
          summary: 'Intersección de curvas, integración de [f(x) - g(x)] y relación completa entre posición s(t), velocidad v(t) y aceleración a(t).',
          graphPreset: '4 - x^2',
          demoAnimations: ['der-velocidad-instantanea'],
          interactiveGraph: {
            mode: 'integrals',
            title: 'Laboratorio de Área Acotada y Síntesis del Cálculo',
            description: 'Analiza la acumulación de área y verifica cómo la diferencia entre la curva superior y la inferior determina la región encerrada.',
            fn: '4 - x^2',
            a: -2,
            b: 2,
            n: 18,
            xDomain: [-3, 3],
            yDomain: [-3, 5],
            presets: [
              { label: 'Región entre f(x)=4-x² y g(x)=0', fn: '4 - x^2', a: -2, b: 2, n: 18 },
              { label: 'Diferencia f(x)-g(x) = (2x - x²) en [0, 2]', fn: '2*x - x^2', a: 0, b: 2, n: 16 },
              { label: 'Velocidad v(t) = 3t² - 6t', fn: '3*x^2 - 6*x', a: 0, b: 3, n: 18 }
            ]
          },
          theory: {
            intro: [
              'En este módulo integrador conectamos las herramientas del Cálculo Diferencial y del Cálculo Integral para resolver problemas geométricos y físicos de nivel universitario.',
              'Estudiaremos cómo calcular el **área encerrada entre dos curvas cualesquiera** $y = f(x)$ e $y = g(x)$, y cómo transitar en ambas direcciones entre la posición $s(t)$, la velocidad $v(t)$ y la aceleración $a(t)$ de un sistema dinámico.'
            ],
            prerequisites: [
              'Resolución de sistemas de ecuaciones no lineales igualando $f(x) = g(x)$ para hallar los puntos de intersección.',
              'Evaluación de integrales definidas mediante la Regla de Barrow.'
            ],
            detailedExplanation: [
              '**1. Área entre dos curvas:** Si en el intervalo $[a, b]$ la curva $y = f(x)$ se mantiene por encima de la curva $y = g(x)$ (es decir, $f(x) \\ge g(x)$), la altura de cada rectángulo diferencial vertical es $h = y_{\\text{sup}} - y_{\\text{inf}} = f(x) - g(x)$. Esta fórmula funciona **incluso si una o ambas curvas están por debajo del eje $X$**, porque al restar $f(x) - g(x)$ la distancia vertical es siempre positiva.',
              '**2. Procedimiento en 3 pasos para el área entre dos curvas:**\n1) Iguala $f(x) = g(x)$ y resuelve la ecuación para encontrar las abscisas de intersección $x = a$ y $x = b$.\n2) Identifica cuál función es la superior ($f(x)$) y cuál la inferior ($g(x)$) evaluando un punto de prueba dentro de $(a, b)$.\n3) Calcula $A = \\int_a^b [f(x) - g(x)]\\,dx$.',
              '**3. Cadena Cinemática Completa:**\n- **Vía Diferencial (derivando respecto al tiempo $t$):** $s(t) \\xrightarrow{d/dt} v(t) = s\'(t) \\xrightarrow{d/dt} a(t) = v\'(t) = s\'\'(t)$.\n- **Vía Integral (integrando respecto al tiempo $t$):** $a(t) \\xrightarrow{\\int dt} v(t) = v_0 + \\int_0^t a(\\tau)\\,d\\tau \\xrightarrow{\\int dt} s(t) = s_0 + \\int_0^t v(\\tau)\\,d\\tau$.'
            ],
            concepts: [
              {
                title: '1. Teorema del Área Entre Dos Curvas',
                body: 'Sean $f(x)$ y $g(x)$ continuas en $[a, b]$ tales que $f(x) \\ge g(x)$ para todo $x \\in [a, b]$. El área de la región acotada entre ambas gráficas es: $$A = \\int_a^b \\big[f(x) - g(x)\\big]\\,dx = \\int_a^b (y_{\\text{superior}} - y_{\\text{inferior}})\\,dx$$'
              },
              {
                title: '2. Síntesis Cinemática: Posición, Velocidad y Aceleración',
                body: 'Dada la aceleración $a(t)$ y las condiciones iniciales $v(0) = v_0$, $s(0) = s_0$:\n- $v(t) = \\int a(t)\\,dt$\n- $s(t) = \\int v(t)\\,dt$'
              }
            ],
            formulas: [
              {
                label: 'Área Entre Dos Curvas',
                expr: 'A = \\int_a^b \\big[f_{\\text{sup}}(x) - g_{\\text{inf}}(x)\\big]\\,dx',
                note: 'Los límites a y b se determinan resolviendo la ecuación de intersección f(x) = g(x).'
              }
            ],
            theorems: [
              {
                badge: 'Teorema de Integración de Regiones',
                title: 'Área Plana Encerrada Entre Dos Gráficas Continuas',
                hypothesis: 'Sean $f$ y $g$ continuas en $[a, b]$ con $f(x) \\ge g(x)$ para todo $x \\in [a, b]$.',
                statement: 'El área exacta de la región $R = \\{(x, y) : a \\le x \\le b,\\; g(x) \\le y \\le f(x)\\}$ vale $A = \\int_a^b [f(x) - g(x)]\\,dx$.',
                proofSteps: [
                  'Cada franja vertical representativa centrada en $x_i^*$ tiene ancho $\\Delta x$ y altura no negativa $f(x_i^*) - g(x_i^*)$.',
                  'La suma aproximada de áreas de rectángulos es $S_n = \\sum_{i=1}^n [f(x_i^*) - g(x_i^*)]\\Delta x$.',
                  'Como $f - g$ es continua en $[a, b]$, al refinar la partición ($n \\to \\infty$), la suma de Riemann converge a la integral $\\int_a^b [f(x) - g(x)]\\,dx$. $\\blacksquare$'
                ]
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo Resuelto: Área encerrada entre una parábola y una recta',
              problem: 'Calcula el área de la región encerrada por la parábola $f(x) = 2x - x^2$ y la recta $g(x) = 0$ (o entre $y = 4 - x^2$ e $y = 3$). Aquí resolvemos entre $f(x) = 4 - x^2$ y $g(x) = 3$.',
              steps: [
                {
                  title: 'Paso 1: Hallar los puntos de intersección igualando f(x) = g(x)',
                  math: '4 - x^2 = 3 \\implies x^2 = 1 \\implies x = -1 \\text{ y } x = 1',
                  reason: 'Las curvas se cortan en a = -1 y b = 1. En x = 0, f(0) = 4 > g(0) = 3, luego f(x) es la curva superior.'
                },
                {
                  title: 'Paso 2: Plantear e integrar f(x) - g(x)',
                  math: 'A = \\int_{-1}^1 [(4 - x^2) - 3]\\,dx = \\int_{-1}^1 (1 - x^2)\\,dx = \\left[x - \\frac{x^3}{3}\\right]_{-1}^1',
                  reason: 'Restamos la función superior menos la inferior antes de integrar.'
                },
                {
                  title: 'Paso 3: Evaluar mediante la Regla de Barrow',
                  math: 'A = \\left(1 - \\frac{1}{3}\\right) - \\left(-1 + \\frac{1}{3}\\right) = \\frac{2}{3} - \\left(-\\frac{2}{3}\\right) = \\frac{4}{3}\\text{ u}^2',
                  reason: 'El área encerrada entre ambas gráficas es 4/3 unidades cuadradas.'
                }
              ],
              graphPayload: { kind: 'integral', expr: '(4 - x^2) - 3', integralA: -1, integralB: 1, showIntegral: true }
            },
            {
              title: 'Ejemplo 2: Área encerrada entre recta f(x) = x + 2 y parábola g(x) = x²',
              problem: 'Halla el área total de la región finita acotada por la recta $y = x + 2$ y la parábola $y = x^2$.',
              steps: [
                {
                  title: 'Paso 1: Igualar las funciones para obtener los cortes',
                  math: 'x^2 = x + 2 \\implies x^2 - x - 2 = (x - 2)(x + 1) = 0 \\implies a = -1, \\; b = 2',
                  reason: 'En x = 0, la recta vale 2 y la parábola vale 0; luego f_sup(x) = x + 2.'
                },
                {
                  title: 'Paso 2: Integrar (x + 2 - x²) en [-1, 2]',
                  math: 'A = \\int_{-1}^2 (x + 2 - x^2)\\,dx = \\left[\\frac{x^2}{2} + 2x - \\frac{x^3}{3}\\right]_{-1}^2 = \\left(2 + 4 - \\frac{8}{3}\\right) - \\left(\\frac{1}{2} - 2 + \\frac{1}{3}\\right) = \\frac{10}{3} + \\frac{7}{6} = \\frac{9}{2} = 4.5\\text{ u}^2',
                  reason: 'Evaluamos primero en el límite superior b = 2 y restamos el inferior a = -1.'
                }
              ],
              graphPayload: { kind: 'integral', expr: 'x + 2 - x^2', integralA: -1, integralB: 2, showIntegral: true }
            },
            {
              title: 'Ejemplo 3: Recuperación cinemática de v(t) y s(t) desde la aceleración a(t)',
              problem: 'Un móvil parte desde $s(0) = 5\\text{ m}$ con velocidad inicial $v(0) = 2\\text{ m/s}$ y aceleración $a(t) = 6t - 4\\text{ m/s}^2$. Calcula su posición $s(2)$ al cabo de $2\\text{ s}$.',
              steps: [
                {
                  title: 'Paso 1: Integrar a(t) y fijar v(0) = 2',
                  math: 'v(t) = \\int (6t - 4)\\,dt = 3t^2 - 4t + C_1 \\xrightarrow{v(0)=2} v(t) = 3t^2 - 4t + 2',
                  reason: 'Determinamos C₁ = 2 usando la velocidad inicial en t = 0.'
                },
                {
                  title: 'Paso 2: Integrar v(t), fijar s(0) = 5 y evaluar s(2)',
                  math: 's(t) = \\int (3t^2 - 4t + 2)\\,dt = t^3 - 2t^2 + 2t + 5 \\implies s(2) = 8 - 8 + 4 + 5 = 9\\text{ m}',
                  reason: 'La posición exacta a los 2 segundos es 9 metros.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              wrong: 'Restar las funciones en el orden incorrecto ($g_{\\text{inf}} - f_{\\text{sup}}$), obteniendo un área negativa.',
              correct: 'Verifica siempre cuál curva está arriba en el intervalo evaluando un punto intermedio, de modo que $f_{\\text{sup}}(x) - g_{\\text{inf}}(x) \\ge 0$.',
              why: 'El área de una región plana entre dos curvas es siempre positiva.'
            }
          ],
          exercises: [
            {
              id: 'calc-1-ex1',
              level: 'basico',
              statement: 'Calcula el área encerrada entre la parábola $f(x) = 2x - x^2$ y el eje $X$ ($g(x) = 0$) entre sus puntos de intersección $x = 0$ y $x = 2$.',
              answer: '4/3',
              alternatives: ['4/3', '1.3333', '1.33'],
              placeholder: 'Ej: 4/3',
              hints: [
                'Plantea $\\int_0^2 (2x - x^2)\\,dx$.',
                'La antiderivada es $F(x) = x^2 - \\frac{x^3}{3}$.',
                'Evalúa $F(2) - F(0) = 4 - \\frac{8}{3}$.'
              ],
              solutionSteps: [
                '$A = \\int_0^2 (2x - x^2)\\,dx = \\left[x^2 - \\frac{x^3}{3}\\right]_0^2 = 4 - \\frac{8}{3} = \\frac{4}{3}\\text{ u}^2$.'
              ],
              reviewTip: 'Calcula $4 - \\frac{8}{3}$ reduciendo a común denominador: $\\frac{12 - 8}{3} = \\frac{4}{3}$.',
              whyCorrect: '¡Correcto! El área encerrada por el arco parabólico es exactamente $4/3\\text{ u}^2$.'
            },
            {
              id: 'calc-1-ex2',
              level: 'intermedio',
              statement: 'Una partícula parte del reposo ($v(0) = 0$) desde la posición inicial $s(0) = 2\\text{ m}$ con velocidad $v(t) = 4t + 1\\text{ m/s}$. ¿Cuál es su posición $s(3)$ a los $t = 3$ segundos?',
              answer: '23',
              alternatives: ['23'],
              placeholder: 'Posición en t = 3...',
              hints: [
                'La posición se obtiene integrando la velocidad: $s(t) = s(0) + \\int_0^t (4\\tau + 1)\\,d\\tau$.',
                '$s(t) = 2 + 2t^2 + t$.',
                'Evalúa en $t = 3$: $2 + 2(3)^2 + 3$.'
              ],
              solutionSteps: [
                'Integrando la velocidad: $s(t) = 2t^2 + t + C$. Como $s(0) = 2$, tenemos $C = 2$.',
                'En $t = 3$: $s(3) = 2(9) + 3 + 2 = 23\\text{ m}$.'
              ],
              reviewTip: 'No olvides sumar la posición inicial $s(0) = 2$ al desplazamiento $\\int_0^3 (4t + 1)\\,dt = 21$.',
              whyCorrect: '¡Excelente! Sumaste la posición inicial $s(0) = 2\\text{ m}$ más el desplazamiento acumulado de $21\\text{ m}$.'
            },
            {
              id: 'calc-1-ex3',
              level: 'avanzado',
              statement: 'Determina el área exacta encerrada entre la parábola $f(x) = 9 - x^2$ y la recta horizontal $g(x) = 5$.',
              answer: '32/3',
              alternatives: ['32/3', '10.6667'],
              placeholder: 'Ej: 32/3',
              hints: [
                'Halla los puntos de corte: $9 - x^2 = 5 \\implies x^2 = 4 \\implies x = -2$ y $x = 2$.',
                'Integra la diferencia: $\\int_{-2}^2 [(9 - x^2) - 5]\\,dx = \\int_{-2}^2 (4 - x^2)\\,dx$.',
                'Evalúa $\\left[4x - \\frac{x^3}{3}\\right]_{-2}^2$.'
              ],
              solutionSteps: [
                'Puntos de intersección: $9 - x^2 = 5 \\implies x = \\pm 2$.',
                '$A = \\int_{-2}^2 (4 - x^2)\\,dx = \\left[4x - \\frac{x^3}{3}\\right]_{-2}^2 = \\frac{16}{3} - \\left(-\\frac{16}{3}\\right) = \\frac{32}{3}\\text{ u}^2$.'
              ],
              reviewTip: 'Iguala primero $9 - x^2 = 5$ para obtener los límites $[-2, 2]$ e integra la resta $(9 - x^2) - 5 = 4 - x^2$.',
              whyCorrect: '¡Perfecto! Encontraste primero las intersecciones $x = \\pm 2$ e integraste la diferencia de ambas funciones.'
            },
            {
              id: 'calc-1-ex4',
              level: 'intermedio',
              statement: 'Una placa metálica está acotada arriba por $y = 4x$ y abajo por $y = x^2$ desde $x = 0$ hasta $x = 4$. Calcula el área exacta entre ambas curvas mediante $\\int_0^4 (4x - x^2)\\,dx$.',
              answer: '32/3',
              alternatives: ['32/3', '\\frac{32}{3}'],
              placeholder: 'Área exacta (ej: 32/3)...',
              whyCorrect: 'Integrando la curva superior menos la inferior: $\\left[2x^2 - \\frac{x^3}{3}\\right]_0^4 = 32 - \\frac{64}{3} = \\frac{96 - 64}{3} = \\frac{32}{3}$.',
              reviewTip: 'El área entre curvas siempre integra $(\\text{techo} - \\text{piso})$ en el intervalo dado.',
              hints: [
                'Antiderivada de $4x - x^2$: $2x^2 - \\frac{x^3}{3}$.',
                'Evalúa en $x = 4$: $2(16) - \\frac{64}{3} = 32 - \\frac{64}{3}$.',
                'Convierte $32 = \\frac{96}{3}$ y resta.'
              ],
              solutionSteps: [
                '$A = \\left[2x^2 - \\frac{x^3}{3}\\right]_0^4 = 32 - \\frac{64}{3} = \\frac{32}{3}$.'
              ]
            },
            {
              id: 'calc-1-ex5',
              level: 'avanzado',
              statement: 'Un tren frena con velocidad positiva $v(t) = 12 - 3t\\text{ m/s}$ desde $t = 0$ hasta detenerse en $t = 4\\text{ s}$. Calcula la distancia total de frenado en metros mediante integración.',
              answer: '24',
              alternatives: ['24'],
              placeholder: 'Distancia en metros...',
              whyCorrect: 'La distancia con $v(t) \\ge 0$ es $\\int_0^4 (12 - 3t)\\,dt = \\left[12t - \\frac{3}{2}t^2\\right]_0^4 = 48 - 24 = 24\\text{ m}$.',
              reviewTip: 'El desplazamiento o distancia recorrida sin cambio de dirección es la integral definida de la velocidad.',
              hints: [
                'Integra la velocidad: $\\int_0^4 (12 - 3t)\\,dt$.',
                'La antiderivada es $12t - \\frac{3}{2}t^2$.',
                'Evalúa en $t = 4$: $12(4) - 1.5(16)$.'
              ],
              solutionSteps: [
                '$d = \\int_0^4 (12 - 3t)\\,dt = \\left[12t - \\frac{3}{2}t^2\\right]_0^4 = 48 - \\frac{3(16)}{2} = 48 - 24 = 24\\text{ m}$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cómo se plantea el área encerrada entre dos curvas $y = f(x)$ (arriba) e $y = g(x)$ (abajo) que se cortan en $x = a$ y $x = b$?',
              options: [
                '∫_a^b [f(x) - g(x)] dx',
                '∫_a^b [f(x) · g(x)] dx',
                'f\'(b) - g\'(a)',
                '∫_a^b [g(x) - f(x)] dx'
              ],
              correctIndex: 0,
              explanation: 'El área encerrada entre dos curvas se obtiene integrando la diferencia entre la función superior $f(x)$ y la función inferior $g(x)$.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           CALC-2: ECUACIONES DIFERENCIALES SEPARABLES Y MODELOS DE CAMBIO
           ------------------------------------------------------------------ */
        {
          id: 'calc-2',
          title: 'Ecuaciones Diferenciales de Variables Separables y Modelos de Crecimiento',
          summary: 'Separación de diferenciales g(y)dy = f(x)dx, problemas de valor inicial (PVI) y ley de crecimiento/decaimiento exponencial.',
          graphPreset: '2*exp(0.5*x)',
          demoAnimations: ['lim-aprox-tabla', 'lim-epsilon-banda'],
          interactiveGraph: {
            mode: 'general',
            title: 'Curvas Solución de Ecuaciones Diferenciales Ordinarias',
            description: 'Explora la solución exponencial y(x) = 2·e^(0.5x) de la ecuación diferencial dy/dx = 0.5·y con condición inicial y(0) = 2.',
            fn: '2*exp(0.5*x)',
            paramA: 0.8,
            xDomain: [-3, 4],
            yDomain: [-1, 10],
            presets: [
              { label: 'Crecimiento exponencial: 2·e^(0.5x)', fn: '2*exp(0.5*x)', paramA: 1.0 },
              { label: 'Decaimiento radiactivo: 5·e^(-0.6x)', fn: '5*exp(-0.6*x)', paramA: 1.0 },
              { label: 'Parábola cúbica de dy/dx = 3x²: x³ + 1', fn: 'x^3 + 1', paramA: 1.0 }
            ]
          },
          theory: {
            intro: [
              'Una **Ecuación Diferencial Ordinaria (EDO)** es una ecuación cuya incógnita no es un número, sino una **función desconocida** $y(x)$ relacionada con sus propias derivadas $\\frac{dy}{dx}, \\frac{d^2y}{dx^2}, \\dots$',
              'Las leyes fundamentales de la física, la biología y la ingeniería se expresan como ecuaciones diferenciales: desde el crecimiento poblacional y la desintegración radiactiva hasta el enfriamiento térmico de Newton y los circuitos eléctricos.'
            ],
            prerequisites: [
              'Notación diferencial de Leibniz $\\frac{dy}{dx}$ y manipulación algebraica para separar variables.',
              'Integración de funciones algebraicas, exponenciales y logarítmicas.'
            ],
            detailedExplanation: [
              '**1. Ecuaciones de Variables Separables:** Una EDO de primer orden $\\frac{dy}{dx} = F(x, y)$ es **separable** si el miembro derecho puede factorizarse como el producto o cociente de una función solo de $x$ y otra solo de $y$: $\\frac{dy}{dx} = \\frac{f(x)}{g(y)}$.',
              '**2. Método de resolución en 3 pasos:**\n- **Paso 1 (Separar):** Pasa todo lo que dependa de $y$ junto a $dy$ en el lado izquierdo, y todo lo que dependa de $x$ junto a $dx$ en el lado derecho: $g(y)\\,dy = f(x)\\,dx$.\n- **Paso 2 (Integrar ambos miembros):** $\\int g(y)\\,dy = \\int f(x)\\,dx + C$.\n- **Paso 3 (Condición inicial):** Si se proporciona un **Problema de Valor Inicial (PVI)** como $y(x_0) = y_0$, sustituye $x_0$ e $y_0$ para hallar el valor exacto de $C$ y despeja $y(x)$.'
            ],
            concepts: [
              {
                title: '1. Separación de Variables',
                body: 'Dada $\\frac{dy}{dx} = f(x) \\cdot h(y)$: $$\\frac{1}{h(y)}\\,dy = f(x)\\,dx \\implies \\int \\frac{1}{h(y)}\\,dy = \\int f(x)\\,dx + C$$'
              },
              {
                title: '2. Modelo Universal de Crecimiento y Decaimiento Exponencial',
                body: 'Cuando la razón de cambio de una cantidad $y(t)$ es directamente proporcional a la cantidad presente: $$\\frac{dy}{dt} = k \\cdot y, \\quad y(0) = y_0 \\implies y(t) = y_0 \\cdot e^{kt}$$ Si $k > 0$ hay crecimiento exponencial; si $k < 0$ hay decaimiento exponencial.'
              }
            ],
            formulas: [
              {
                label: 'Integración de EDO Separable',
                expr: 'g(y)\\,dy = f(x)\\,dx \\implies \\int g(y)\\,dy = \\int f(x)\\,dx + C',
                note: 'Basta con colocar una sola constante arbitraria C en el lado derecho.'
              }
            ],
            theorems: [
              {
                badge: 'Método Analítico',
                title: 'Validez de la Separación de Variables en EDO de Primer Orden',
                hypothesis: 'Considérese la ecuación $\\frac{dy}{dx} = f(x)\\,h(y)$ con $f$ y $h$ continuas cerca de $(x_0, y_0)$ y $h(y_0) \\neq 0$.',
                statement: 'Si $G(y)$ es una primitiva de $\\frac{1}{h(y)}$ y $F(x)$ es una primitiva de $f(x)$, toda solución en un entorno de $x_0$ satisface la relación implícita $G(y(x)) = F(x) + C$.',
                proofSteps: [
                  'Como $h(y_0) \\neq 0$ y $h$ es continua, en un entorno de $y_0$ tenemos $h(y) \\neq 0$, luego podemos dividir: $\\frac{1}{h(y(x))}\\frac{dy}{dx} = f(x)$.',
                  'Reconociendo la derivada implícita por regla de la cadena, $\\frac{d}{dx}[G(y(x))] = G\'(y(x))\\,y\'(x) = \\frac{y\'(x)}{h(y(x))} = f(x) = F\'(x)$.',
                  'Como ambas derivadas coinciden en el intervalo, por el teorema de la constante de integración se concluye $G(y(x)) = F(x) + C$, donde $C = G(y_0) - F(x_0)$. $\\blacksquare$'
                ]
              }
            ]
          },
          examples: [
            {
              title: 'Ejemplo Resuelto: Problema de Valor Inicial por separación de variables',
              problem: 'Resuelve el problema de valor inicial: $$\\frac{dy}{dx} = 2xy, \\quad \\text{con } y(0) = 3$$',
              steps: [
                {
                  title: 'Paso 1: Separar las variables y e x con sus respectivos diferenciales',
                  math: '\\frac{1}{y}\\,dy = 2x\\,dx',
                  reason: 'Dividimos entre y y multiplicamos por dx.'
                },
                {
                  title: 'Paso 2: Integrar ambos miembros y despejar y',
                  math: '\\int \\frac{1}{y}\\,dy = \\int 2x\\,dx \\implies \\ln|y| = x^2 + C_1 \\implies y(x) = C\\,e^{x^2}',
                  reason: 'Aplicamos la exponencial en ambos lados y llamamos C = e^(C₁).'
                },
                {
                  title: 'Paso 3: Aplicar la condición inicial y(0) = 3',
                  math: 'y(0) = C\\,e^{0} = 3 \\implies C = 3 \\implies y(x) = 3e^{x^2}',
                  reason: 'Sustituimos x = 0 e igualamos a 3 para obtener la solución particular.'
                }
              ],
              graphPayload: { kind: 'derivative', expr: '3*exp(x^2)', tangentX: 0.5, showDerivative: true }
            },
            {
              title: 'Ejemplo 2: Modelo de decaimiento exponencial radiactivo',
              problem: 'Una muestra pierde masa proporcionalmente a la masa presente según $\\frac{dy}{dt} = -0.2y$, con $y(0) = 100\\text{ g}$. Halla $y(t)$ y la masa restante en $t = 5\\text{ h}$.',
              steps: [
                {
                  title: 'Paso 1: Separar e integrar con y > 0',
                  math: '\\frac{1}{y}\\,dy = -0.2\\,dt \\implies \\ln(y) = -0.2t + C_1 \\implies y(t) = y_0 e^{-0.2t} = 100 e^{-0.2t}',
                  reason: 'Al evaluar en t = 0 obtenemos y(0) = C = 100 g.'
                },
                {
                  title: 'Paso 2: Evaluar en t = 5 h',
                  math: 'y(5) = 100 e^{-0.2(5)} = 100 e^{-1} = \\frac{100}{e} \\approx 36.79\\text{ g}',
                  reason: 'Transcurridas 5 horas permanece aproximadamente un 36.79 % de la muestra.'
                }
              ]
            },
            {
              title: 'Ejemplo 3: EDO separable no lineal y solución explícita positiva',
              problem: 'Resuelve $\\frac{dy}{dx} = \\frac{x}{y}$ ($y > 0$) con condición inicial $y(0) = 4$, y evalúa $y(3)$.',
              steps: [
                {
                  title: 'Paso 1: Separar variables e integrar ambos lados',
                  math: 'y\\,dy = x\\,dx \\implies \\frac{y^2}{2} = \\frac{x^2}{2} + C_1 \\implies y^2 = x^2 + C',
                  reason: 'Multiplicamos toda la igualdad por 2 absorbiendo 2C₁ en una constante C.'
                },
                {
                  title: 'Paso 2: Determinar C, despejar la rama positiva y evaluar y(3)',
                  math: '4^2 = 0^2 + C \\implies C = 16 \\implies y(x) = \\sqrt{x^2 + 16} \\implies y(3) = \\sqrt{9 + 16} = \\sqrt{25} = 5',
                  reason: 'Seleccionamos la raíz cuadrada positiva porque y(0) = 4 > 0.'
                }
              ],
              graphPayload: { kind: 'function', expr: 'sqrt(x^2 + 16)', tangentX: 3 }
            }
          ],
          commonMistakes: [
            {
              wrong: 'Integrar respecto a $x$ una expresión que todavía contiene la variable $y$ sin haber separado primero las variables.',
              correct: 'Antes de escribir el signo $\\int$, asegúrate de que el lado izquierdo solo tenga la variable $y$ con $dy$ y el lado derecho solo la variable $x$ con $dx$.',
              why: 'Como $y$ depende de $x$, no puede tratarse como una constante dentro de una integral respecto a $x$.'
            }
          ],
          exercises: [
            {
              id: 'calc-2-ex1',
              level: 'basico',
              statement: 'Resuelve el problema de valor inicial $\\frac{dy}{dx} = 4x - 1$ con la condición $y(0) = 5$. Escribe la función solución $y(x)$.',
              answer: '2*x^2 - x + 5',
              alternatives: ['2x^2-x+5', '2*x^2-x+5'],
              placeholder: 'Ej: 2x^2 - x + 5',
              hints: [
                'Integra ambos miembros: $y(x) = \\int (4x - 1)\\,dx = 2x^2 - x + C$.',
                'Evalúa la condición inicial $y(0) = 5$ para obtener $C = 5$.'
              ],
              solutionSteps: [
                '$dy = (4x - 1)\\,dx \\implies y(x) = 2x^2 - x + C$.',
                'Como $y(0) = 5 \\implies C = 5$, luego $y(x) = 2x^2 - x + 5$.'
              ],
              reviewTip: 'Integra $4x - 1$ para obtener $2x^2 - x + C$ y sustituye $y(0) = 5$.',
              whyCorrect: '¡Correcto! Su derivada es $4x - 1$ y en $x = 0$ toma el valor $5$.'
            },
            {
              id: 'calc-2-ex2',
              level: 'intermedio',
              statement: 'Resuelve la ecuación diferencial separable $\\frac{dy}{dx} = 3y$ con condición inicial $y(0) = 4$. Escribe la función solución $y(x)$.',
              answer: '4*exp(3*x)',
              alternatives: ['4*e^(3x)', '4*e^(3*x)', '4e^(3x)', '4*exp(3x)'],
              placeholder: 'Ej: 4*e^(3x)',
              hints: [
                'Es el modelo exponencial $\\frac{dy}{dx} = k\\,y$ con $k = 3$ e $y_0 = 4$.',
                'Su solución general es $y(x) = C\\,e^{3x}$.',
                'Sustituye $y(0) = 4$ para hallar $C$.'
              ],
              solutionSteps: [
                'Separando variables: $\\frac{dy}{y} = 3\\,dx \\implies \\ln|y| = 3x + C_1 \\implies y = C\\,e^{3x}$.',
                'Con $y(0) = 4$, obtenemos $C = 4 \\implies y(x) = 4e^{3x}$.'
              ],
              reviewTip: 'Recuerda que la solución de $y\' = ky$ con $y(0) = y_0$ es $y(x) = y_0 e^{kx}$.',
              whyCorrect: '¡Excelente! Comprueba que al derivar $4e^{3x}$ se obtiene $12e^{3x} = 3(4e^{3x}) = 3y$.'
            },
            {
              id: 'calc-2-ex3',
              level: 'avanzado',
              statement: 'Dada la ecuación diferencial separable $y\\,\\frac{dy}{dx} = x$ con la condición inicial $y(0) = 3$ (con $y > 0$), calcula el valor numérico exacto de $y(4)$.',
              answer: '5',
              alternatives: ['5'],
              placeholder: 'Valor numérico de y(4)...',
              hints: [
                'Separa e integra: $\\int y\\,dy = \\int x\\,dx \\implies \\frac{y^2}{2} = \\frac{x^2}{2} + C$, o bien $y^2 = x^2 + K$.',
                'Usa $y(0) = 3$: $3^2 = 0^2 + K \\implies K = 9$, luego $y^2 = x^2 + 9$.',
                'Sustituye $x = 4$ y toma la raíz positiva.'
              ],
              solutionSteps: [
                '$y\\,dy = x\\,dx \\implies \\frac{y^2}{2} = \\frac{x^2}{2} + C \\implies y^2 = x^2 + K$.',
                'Imponiendo $y(0) = 3$: $9 = 0 + K \\implies y(x) = \\sqrt{x^2 + 9}$.',
                'Evaluando en $x = 4$: $y(4) = \\sqrt{4^2 + 9} = \\sqrt{25} = 5$.'
              ],
              reviewTip: 'Al integrar $y\\,dy = x\\,dx$ obtienes $y^2 = x^2 + 9$; evalúa en $x = 4$ y extrae la raíz cuadrada.',
              whyCorrect: '¡Impecable! Resolviste un problema de valor inicial no lineal separando $y\\,dy = x\\,dx$.'
            },
            {
              id: 'calc-2-ex4',
              level: 'intermedio',
              statement: 'Una colonia celular sigue la EDO $M\'(t) = kM(t)$ con $M(0) = 100\\text{ mg}$ y constante $k = \\ln(2)\\text{ h}^{-1}$. Usando su solución $M(t) = 100\\,e^{kt}$, calcula cuántos miligramos habrá a las $t = 4$ horas.',
              answer: '1600',
              alternatives: ['1600'],
              placeholder: 'Masa en mg...',
              whyCorrect: 'Sustituyendo $k = \\ln(2)$ y $t = 4$: $M(4) = 100\\,e^{4\\ln 2} = 100 \\cdot (e^{\\ln 2})^4 = 100 \\cdot 2^4 = 1600\\text{ mg}$.',
              reviewTip: 'Recuerda la identidad $e^{t \\ln(2)} = 2^t$.',
              hints: [
                'Escribe $M(4) = 100\\,e^{4 \\ln 2}$.',
                'Aplica la propiedad $e^{4 \\ln 2} = (e^{\\ln 2})^4 = 2^4 = 16$.',
                'Multiplica $100 \\times 16$.'
              ],
              solutionSteps: [
                '$M(4) = 100\\,e^{4\\ln(2)} = 100 \\cdot 2^4 = 100 \\cdot 16 = 1600\\text{ mg}$.'
              ]
            },
            {
              id: 'calc-2-ex5',
              level: 'avanzado',
              statement: 'Un objeto se enfría siguiendo la solución de la ley de Newton $T(t) = 20 + 60 \\cdot 2^{-t/5}$ ($T$ en $^\\circ\\text{C}$ y $t$ en minutos). ¿Qué temperatura en $^\\circ\\text{C}$ marca el sensor tras $t = 10$ minutos?',
              answer: '35',
              alternatives: ['35'],
              placeholder: 'Temperatura en °C...',
              whyCorrect: 'En $t = 10$, el exponente es $-10/5 = -2$, por lo que $2^{-2} = \\frac{1}{4}$ y $T(10) = 20 + 60 \\cdot \\frac{1}{4} = 20 + 15 = 35^\\circ\\text{C}$.',
              reviewTip: 'Evalúa primero la potencia negativa $2^{-2} = \\frac{1}{2^2} = \\frac{1}{4}$ antes de multiplicar por $60$.',
              hints: [
                'Sustituye $t = 10$ en el exponente: $-\\frac{10}{5} = -2$.',
                'Convierte la potencia negativa: $2^{-2} = \\frac{1}{4}$.',
                'Calcula $20 + 60 \\cdot \\frac{1}{4}$.'
              ],
              solutionSteps: [
                '$T(10) = 20 + 60 \\cdot 2^{-10/5} = 20 + 60 \\cdot \\frac{1}{4} = 20 + 15 = 35^\\circ\\text{C}$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es la forma correctamente separada de la ecuación diferencial $\\frac{dy}{dx} = \\frac{x^2}{y}$?',
              options: [
                'y dy = x² dx',
                '(1/y) dy = x² dx',
                'y dx = x² dy',
                'dy/dx = x² · y'
              ],
              correctIndex: 0,
              explanation: 'Multiplicando ambos miembros por $y$ y por $dx$ se obtiene directamente $y\\,dy = x^2\\,dx$.'
            }
          ]
        }
      ]
    }
  ];

  part3.forEach(mod => curriculum.push(mod));
})(window.MatInteractiva.Curriculum);
