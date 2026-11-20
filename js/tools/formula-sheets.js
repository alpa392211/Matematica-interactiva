/* ==========================================================================
   MATETIC - Formularios Matemáticos de Estudio e Impresión
   Archivo: js/tools/formula-sheets.js
   Fase 5A: Arquitectura completa, Modalidad A (Por Tema) y Modalidad B
   (Compendio General con Índice), Módulos 1 a 5 exhaustivos y estructura base 6 a 9.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const FORMULA_SHEETS_DATA = [
    /* ======================================================================
       1. FORMULARIO DE ARITMÉTICA (10 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'aritmetica',
      moduleNumber: 1,
      name: 'Formulario de Aritmética',
      shortName: 'Aritmética',
      symbol: '÷',
      color: '#2563EB',
      levelTag: 'Fundamentos',
      description: 'Axiomas de campo de los números reales, valor absoluto, fracciones, proporciones, exponentes, radicales y métodos de resolución aritmética (PEMDAS, Euclides, MCM, regla de tres, congruencias y combinatoria).',
      sections: [
        {
          id: 'arit-sec-1',
          title: '1.1 Propiedades de Campo en ℝ, Signos y Valor Absoluto',
          formulas: [
            {
              code: '1.1.1',
              name: 'Propiedad Distributiva de la Multiplicación respecto a la Suma',
              latex: 'a \\cdot (b \\pm c) = a \\cdot b \\pm a \\cdot c',
              variables: 'Donde $a, b, c \\in \\mathbb{R}$ representan números reales cualesquiera ($a$ es el factor común y $b \\pm c$ el binomio).',
              conditions: 'Válida para todo $a, b, c \\in \\mathbb{R}$. Leída en sentido inverso constituye la factorización por factor común.'
            },
            {
              code: '1.1.2',
              name: 'Definición y Propiedades Métricas del Valor Absoluto',
              latex: '|a| = \\begin{cases} a, & \\text{si } a \\ge 0 \\\\ -a, & \\text{si } a < 0 \\end{cases} \\qquad |a \\cdot b| = |a| \\cdot |b| \\qquad |a + b| \\le |a| + |b|',
              variables: 'Donde $|a|$ representa la distancia no negativa del número real $a$ al origen $0$ sobre la recta real.',
              conditions: 'Siempre se cumple que $|a| \\ge 0$ para todo $a \\in \\mathbb{R}$. La tercera relación se conoce como Desigualdad Triangular.'
            },
            {
              code: '1.1.3',
              name: 'Algoritmo de la División Euclídea y Relación MCM – MCD',
              latex: 'D = d \\cdot q + r \\quad (0 \\le r < |d|) \\qquad \\text{MCM}(a, b) \\cdot \\text{MCD}(a, b) = |a \\cdot b|',
              variables: 'Donde $D$ es el dividendo, $d$ el divisor, $q$ el cociente entero, $r$ el residuo, y $a, b \\in \\mathbb{Z}^+$ son enteros positivos.',
              conditions: 'Condición: $d \\neq 0$. Si $r = 0$, la división es exacta y se dice que $d$ divide a $D$ ($d \\mid D$).'
            }
          ]
        },
        {
          id: 'arit-sec-2',
          title: '1.2 Operaciones con Fracciones, Razones y Porcentajes',
          formulas: [
            {
              code: '1.2.1',
              name: 'Suma y Resta de Fracciones con Distinto Denominador',
              latex: '\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{a \\cdot d \\pm b \\cdot c}{b \\cdot d}',
              variables: 'Donde $a, c \\in \\mathbb{R}$ son los numeradores y $b, d \\in \\mathbb{R}$ son los denominadores de las fracciones.',
              conditions: 'Condición indispensable: $b \\neq 0$ y $d \\neq 0$. Para simplificar cálculos se recomienda usar el $\\text{MCM}(b, d)$ como común denominador.'
            },
            {
              code: '1.2.2',
              name: 'Multiplicación y División de Fracciones (Ley del Sándwich)',
              latex: '\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d} \\qquad \\quad \\frac{\\dfrac{a}{b}}{\\dfrac{c}{d}} = \\frac{a}{b} \\div \\frac{c}{d} = \\frac{a \\cdot d}{b \\cdot c}',
              variables: 'Donde $a, d$ son los términos extremos y $b, c$ son los términos medios de la fracción compleja.',
              conditions: 'En la multiplicación: $b \\neq 0, d \\neq 0$. En la división: $b \\neq 0, c \\neq 0$ y $d \\neq 0$ (nunca se puede dividir por una fracción nula).'
            },
            {
              code: '1.2.3',
              name: 'Propiedad Fundamental de las Proporciones y Variación Porcentual',
              latex: '\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c \\qquad \\quad \\Delta\\% = \\left( \\frac{V_f - V_i}{V_i} \\right) \\times 100\\%',
              variables: 'Donde $a, d$ son extremos, $b, c$ son medios; $V_i$ es el valor inicial y $V_f$ el valor final de una magnitud.',
              conditions: 'Condición: $b \\neq 0, d \\neq 0$ y $V_i \\neq 0$. Si $\\Delta\\% > 0$ representa un incremento porcentual; si $\\Delta\\% < 0$, un descuento o disminución.'
            }
          ]
        },
        {
          id: 'arit-sec-3',
          title: '1.3 Leyes de los Exponentes y Radicales',
          formulas: [
            {
              code: '1.3.1',
              name: 'Producto y Cociente de Potencias de Igual Base',
              latex: 'a^m \\cdot a^n = a^{m + n} \\qquad \\quad \\frac{a^m}{a^n} = a^{m - n}',
              variables: 'Donde $a \\in \\mathbb{R}$ es la base común y $m, n \\in \\mathbb{R}$ son los exponentes.',
              conditions: 'En el cociente se requiere obligatoriamente $a \\neq 0$. Si $m = n$, se obtiene la propiedad del exponente cero: $a^0 = 1$ ($a \\neq 0$).'
            },
            {
              code: '1.3.2',
              name: 'Exponente Negativo y Potencia de una Potencia',
              latex: 'a^{-n} = \\frac{1}{a^n} \\qquad \\quad \\left( \\frac{a}{b} \\right)^{-n} = \\left( \\frac{b}{a} \\right)^n \\qquad \\quad (a^m)^n = a^{m \\cdot n}',
              variables: 'Donde $a, b$ son las bases reales y $m, n$ son los exponentes.',
              conditions: 'Condición: $a \\neq 0$ y $b \\neq 0$. Un exponente negativo invierte la base recíproca, jamás cambia el signo de la base.'
            },
            {
              code: '1.3.3',
              name: 'Conversión entre Radical y Exponente Fraccionario',
              latex: '\\sqrt[n]{a^m} = a^{\\frac{m}{n}} = \\left( \\sqrt[n]{a} \\right)^m',
              variables: 'Donde $a$ es el radicando, $n \\in \\mathbb{N}$ ($n \\ge 2$) es el índice de la raíz y $m$ es el exponente del radicando.',
              conditions: 'Si el índice $n$ es par, se requiere $a \\ge 0$ para que el resultado pertenezca a $\\mathbb{R}$. Si $n$ es impar, $a$ puede ser cualquier número real.'
            },
            {
              code: '1.3.4',
              name: 'Producto, Cociente y Raíz de un Radical',
              latex: '\\sqrt[n]{a \\cdot b} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b} \\qquad \\quad \\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}} \\qquad \\quad \\sqrt[m]{\\sqrt[n]{a}} = \\sqrt[m \\cdot n]{a}',
              variables: 'Donde $a, b$ son los radicandos y $m, n \\ge 2$ son los índices radicales.',
              conditions: 'Condición: $b \\neq 0$; si $n$ o $m$ son pares, $a \\ge 0$ y $b > 0$. Nota: $\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}$ (la raíz NO se distribuye en sumas ni restas).'
            }
          ]
        },
        {
          id: 'arit-sec-4',
          title: '1.4 Métodos de Resolución Aritmética y Teoría de Números',
          formulas: [
            {
              code: '1.4.1',
              kind: 'method',
              name: 'Jerarquía Estricta de Operaciones de Adentro hacia Afuera (PEMDAS)',
              latex: '(\\;),\\; [\\;],\\; \\{\\;\\} \\;\\longrightarrow\\; a^n,\\; \\sqrt[n]{a} \\;\\longrightarrow\\; \\times,\\; \\div \\;\\longrightarrow\\; +,\\; -',
              variables: 'Orden de evaluación: signos de agrupación más internos, luego potencias y raíces, después productos/cocientes de izquierda a derecha y al final sumas/restas.',
              steps: [
                'Ubica los paréntesis, corchetes o llaves más internos y reduce su contenido a un solo valor.',
                'Evalúa potencias y radicales antes de multiplicar por coeficientes vecinos (recuerda que $-3^2 = -9$ mientras $(-3)^2 = 9$).',
                'Ejecuta multiplicaciones y divisiones estrictamente de izquierda a derecha; realiza sumas y restas al final.'
              ],
              conditions: 'Úsalo en cualquier expresión combinada larga; en fracciones, el numerador y el denominador actúan como paréntesis implícitos.'
            },
            {
              code: '1.4.2',
              kind: 'method',
              name: 'Reescritura a Potencias Fraccionarias/Negativas y Atajo «Raíz Primero»',
              latex: 'a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^m, \\qquad \\frac{1}{a^k} = a^{-k}, \\qquad a^{-\\frac{m}{n}} = \\frac{1}{\\left(\\sqrt[n]{a}\\right)^m}',
              variables: 'Donde $a$ es la base (descomponible en factores primos), $m$ el exponente entero y $n \\ge 2$ el índice radical.',
              steps: [
                'Transforma cada radical $\\sqrt[n]{a^m}$ a $a^{m/n}$ y sube denominadores $\\frac{1}{a^k}$ como $a^{-k}$ para operar uniformemente.',
                'Descompón bases compuestas en factores primos (ej. $27 = 3^3$, $16 = 2^4$) y agrupa exponentes de igual base.',
                'Para evaluar $a^{m/n}$ a mano sin calculadora, extrae primero la raíz $\\sqrt[n]{a}$ con números pequeños y eleva después a la $m$.'
              ],
              conditions: 'Indispensable antes de derivar o integrar radicales y cocientes monómicos. Si $n$ es par, exige $a \\ge 0$ (y $a > 0$ si el exponente es negativo).'
            },
            {
              code: '1.4.3',
              kind: 'method',
              name: 'Algoritmo de Euclides (MCD), Método del MCM y Limpieza de Fracciones Complejas',
              latex: '\\text{MCD}(a, b) = \\text{MCD}(b,\\; a \\bmod b) \\qquad \\quad \\frac{\\dfrac{a}{b} \\pm \\dfrac{c}{d}}{\\dfrac{e}{f} \\pm \\dfrac{g}{h}} = \\frac{M\\!\\left(\\dfrac{a}{b} \\pm \\dfrac{c}{d}\\right)}{M\\!\\left(\\dfrac{e}{f} \\pm \\dfrac{g}{h}\\right)}',
              variables: 'Donde $a \\bmod b$ es el residuo de dividir $a$ entre $b$, y $M = \\text{MCM}(b, d, f, h)$ es el mínimo común múltiplo global de todos los denominadores.',
              steps: [
                'Para hallar $\\text{MCD}(a, b)$, divide sucesivamente el divisor entre el residuo hasta obtener residuo $0$; el último divisor no nulo es el MCD (y $\\text{MCM} = |a \\cdot b| / \\text{MCD}$).',
                'Para sumar varias fracciones, amplifica cada una al $\\text{MCM}$ de sus denominadores y suma solo los numeradores.',
                'En fracciones complejas con sumas arriba y abajo, multiplica todos los términos del numerador y denominador por el $\\text{MCM}$ global $M$ para eliminar denominadores de golpe.'
              ],
              conditions: 'Todos los denominadores deben ser distintos de cero ($b, d, f, h \\neq 0$) y el denominador global no puede anularse.'
            },
            {
              code: '1.4.4',
              kind: 'method',
              name: 'Proporcionalidad Directa, Inversa y Método de Reducción a la Unidad (Regla de Tres)',
              latex: '\\text{Directa: } \\frac{y}{x} = k \\implies y_2 = \\frac{y_1 x_2}{x_1} \\qquad \\quad \\text{Inversa: } x \\cdot y = k \\implies y_2 = \\frac{x_1 y_1}{x_2}',
              variables: 'Donde $k$ es la constante de proporcionalidad, $(x_1, y_1)$ el par conocido y $y_2$ el valor buscado asociado a $x_2$.',
              steps: [
                'Compara cada magnitud conocida con la incógnita: si al crecer una la otra crece en igual razón es directa; si disminuye en razón recíproca es inversa.',
                'En proporcionalidad directa conserva cocientes constantes ($y/x = k$); en inversa conserva productos constantes ($x \\cdot y = k$).',
                'Alternativamente, reduce el problema a $1$ unidad base y escala después al valor objetivo (ideal para regla de tres compuesta).'
              ],
              conditions: 'Condición: $x_1 \\neq 0$ y $x_2 \\neq 0$. Verifica siempre el sentido físico del resultado (ej. más obreros implican menos días).'
            },
            {
              code: '1.4.5',
              kind: 'method',
              name: 'Aritmética Modular (Congruencias) y Principios de Conteo Combinatorio',
              latex: 'a \\equiv b \\pmod{m} \\iff m \\mid (a - b) \\qquad \\quad P_n = n! \\qquad \\quad \\binom{n}{r} = \\frac{n!}{r!\\,(n - r)!}',
              variables: 'Donde $m \\in \\mathbb{Z}^+$ es el módulo de congruencia, $P_n$ las permutaciones de $n$ elementos distintos y $\\binom{n}{r}$ las combinaciones sin orden.',
              steps: [
                'En congruencias módulo $m$, reduce bases y productos parciales a su residuo en $\\{0, 1, \\dots, m-1\\}$ (o busca ciclos en potencias $a^k \\bmod m$).',
                'En conteo, decide primero si importa el orden: si importa usa permutaciones $P(n,r) = \\frac{n!}{(n-r)!}$; si no importa usa combinaciones $\\binom{n}{r}$.',
                'Recuerda la convención $0! = 1$ y la simetría $\\binom{n}{r} = \\binom{n}{n-r}$ para abreviar cálculos.'
              ],
              conditions: 'Condiciones: $m \\ge 1$, $n, r \\in \\mathbb{Z}$ con $0 \\le r \\le n$.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       2. FORMULARIO DE ÁLGEBRA (Fórmulas y Métodos de Resolución)
       ====================================================================== */
    {
      id: 'algebra',
      moduleNumber: 2,
      name: 'Formulario de Álgebra',
      shortName: 'Álgebra',
      symbol: 'x²',
      color: '#1D4ED8',
      levelTag: 'Álgebra Superior',
      description: 'Productos notables, factorización (método ac, Ruffini, TCP), racionalización cuadrada/cúbica y cambio de variable, ecuaciones lineales, cuadráticas, sistemas 2×2, inecuaciones, logaritmos y progresiones.',
      sections: [
        {
          id: 'alg-sec-1',
          title: '2.1 Productos Notables Fundamentales',
          formulas: [
            {
              code: '2.1.1',
              name: 'Binomio al Cuadrado (Trinomio Cuadrado Perfecto)',
              latex: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2',
              variables: 'Donde $a$ es el primer término y $b$ el segundo término del binomio.',
              conditions: 'Válido para cualesquiera expresiones algebraicas $a, b$. Error común a evitar: $(a + b)^2 \\neq a^2 + b^2$ (jamás omitir el doble producto $\\pm 2ab$).'
            },
            {
              code: '2.1.2',
              name: 'Producto de Binomios Conjugados (Diferencia de Cuadrados)',
              latex: '(a + b)(a - b) = a^2 - b^2',
              variables: 'Donde $a + b$ y $a - b$ son binomios conjugados que solo difieren en el signo intermedio.',
              conditions: 'Válido para todo $a, b \\in \\mathbb{R}$. Es la base para racionalizar raíces cuadradas en límites e integrales.'
            },
            {
              code: '2.1.3',
              name: 'Binomio al Cubo',
              latex: '(a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3',
              variables: 'Donde $a$ y $b$ representan los términos del binomio elevado a la tercera potencia.',
              conditions: 'Si el binomio es $(a - b)^3$, los signos de los cuatro términos se alternan $(+, -, +, -)$.'
            },
            {
              code: '2.1.4',
              name: 'Producto de Dos Binomios con un Término Común',
              latex: '(x + a)(x + b) = x^2 + (a + b)x + a \\cdot b',
              variables: 'Donde $x$ es el término común y $a, b$ son los términos no comunes (con sus respectivos signos).',
              conditions: 'El coeficiente lineal es la suma algebraica $(a + b)$ y el término independiente es el producto $(a \\cdot b)$.'
            }
          ]
        },
        {
          id: 'alg-sec-2',
          title: '2.2 Factorización y Racionalización Algebraica',
          formulas: [
            {
              code: '2.2.1',
              name: 'Factorización de Suma y Diferencia de Cubos Perfectos',
              latex: 'a^3 + b^3 = (a + b)(a^2 - ab + b^2) \\qquad \\quad a^3 - b^3 = (a - b)(a^2 + ab + b^2)',
              variables: 'Donde $a = \\sqrt[3]{a^3}$ y $b = \\sqrt[3]{b^3}$ son las raíces cúbicas exactas de ambos términos.',
              conditions: 'El factor trinomio $(a^2 \\mp ab + b^2)$ es irreducible en los números reales $\\mathbb{R}$ para $a, b \\neq 0$.'
            },
            {
              code: '2.2.2',
              name: 'Factorización de Diferencia de Potencias $n$-ésimas',
              latex: 'x^n - a^n = (x - a)\\left(x^{n-1} + a x^{n-2} + a^2 x^{n-3} + \\dots + a^{n-1}\\right)',
              variables: 'Donde $x$ es la variable, $a \\in \\mathbb{R}$ una constante y $n \\in \\mathbb{N}$ ($n \\ge 2$) el grado del binomio.',
              conditions: 'Fórmula clave para cancelar indeterminaciones $\\frac{0}{0}$ del tipo $\\lim_{x \\to a} \\frac{x^n - a^n}{x - a} = n a^{n-1}$.'
            },
            {
              code: '2.2.3',
              name: 'Racionalización mediante Binomio Conjugado (Raíz Cuadrada)',
              latex: '\\frac{N}{\\sqrt{A} \\pm \\sqrt{B}} = \\frac{N \\cdot (\\sqrt{A} \\mp \\sqrt{B})}{(\\sqrt{A} \\pm \\sqrt{B})(\\sqrt{A} \\mp \\sqrt{B})} = \\frac{N \\cdot (\\sqrt{A} \\mp \\sqrt{B})}{A - B}',
              variables: 'Donde $N$ es el numerador y $\\sqrt{A} \\pm \\sqrt{B}$ es el denominador irracional.',
              conditions: 'Condición: $A \\ge 0, B \\ge 0$ y $A \\neq B$ para que el nuevo denominador $(A - B)$ sea distinto de cero.'
            }
          ]
        },
        {
          id: 'alg-sec-3',
          title: '2.3 Ecuaciones Cuadráticas, Discriminante y Vieta',
          formulas: [
            {
              code: '2.3.1',
              name: 'Fórmula General para Ecuaciones de Segundo Grado (Bhaskara)',
              latex: 'ax^2 + bx + c = 0 \\implies x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
              variables: 'Donde $a$ es el coeficiente cuadrático, $b$ el coeficiente lineal y $c$ el término independiente.',
              conditions: 'Condición estricta: $a \\neq 0$. La ecuación debe estar igualada a cero en su forma canónica antes de identificar $a, b, c$.'
            },
            {
              code: '2.3.2',
              name: 'Discriminante Cuadrático y Relaciones de Cardano-Vieta',
              latex: '\\Delta = b^2 - 4ac \\qquad \\quad x_1 + x_2 = -\\frac{b}{a} \\qquad \\quad x_1 \\cdot x_2 = \\frac{c}{a}',
              variables: 'Donde $\\Delta$ es el discriminante y $x_1, x_2$ son las dos raíces de la ecuación $ax^2 + bx + c = 0$.',
              conditions: 'Si $\\Delta > 0$: 2 raíces reales distintas; si $\\Delta = 0$: 1 raíz real doble; si $\\Delta < 0$: sin raíces reales (2 raíces complejas conjugadas).'
            }
          ]
        },
        {
          id: 'alg-sec-4',
          title: '2.4 Propiedades de los Logaritmos y Progresiones',
          formulas: [
            {
              code: '2.4.1',
              name: 'Definición de Logaritmo y Cambio de Base',
              latex: '\\log_b(x) = y \\iff b^y = x \\qquad \\quad \\log_b(x) = \\frac{\\ln(x)}{\\ln(b)} = \\frac{\\log_{10}(x)}{\\log_{10}(b)}',
              variables: 'Donde $b$ es la base del logaritmo, $x$ el argumento y $y$ el exponente al que debe elevarse $b$.',
              conditions: 'Restricción de dominio: el argumento debe ser estrictamente positivo ($x > 0$) y la base debe cumplir $b > 0$ y $b \\neq 1$.'
            },
            {
              code: '2.4.2',
              name: 'Leyes Operativas de los Logaritmos (Producto, Cociente y Potencia)',
              latex: '\\log_b(M \\cdot N) = \\log_b(M) + \\log_b(N) \\qquad \\log_b\\left(\\frac{M}{N}\\right) = \\log_b(M) - \\log_b(N) \\qquad \\log_b(M^k) = k \\cdot \\log_b(M)',
              variables: 'Donde $M, N$ son los argumentos positivos, $b$ la base y $k \\in \\mathbb{R}$ un exponente real.',
              conditions: 'Condición: $M > 0, N > 0, b > 0, b \\neq 1$. Propiedades fundamentales para derivación logarítmica y ecuaciones exponenciales.'
            },
            {
              code: '2.4.3',
              name: 'Término General y Suma de Progresión Aritmética y Geométrica',
              latex: 'a_n = a_1 + (n - 1)d, \\quad S_n = \\frac{n(a_1 + a_n)}{2} \\qquad \\quad g_n = g_1 \\cdot r^{n - 1}, \\quad S_n = g_1 \\frac{1 - r^n}{1 - r}',
              variables: 'Donde $a_1, g_1$ son el primer término, $d$ la diferencia común, $r$ la razón geométrica y $n \\in \\mathbb{N}$ el número de términos.',
              conditions: 'En la suma geométrica se requiere $r \\neq 1$. Si $|r| < 1$, la serie infinita converge a $S_\\infty = \\frac{g_1}{1 - r}$.'
            }
          ]
        },
        {
          id: 'alg-sec-5',
          title: '2.5 Métodos de Factorización, Racionalización, Ecuaciones y Sistemas',
          formulas: [
            {
              code: '2.5.1',
              kind: 'method',
              name: 'Árbol de Factorización y Trinomio $ax^2 + bx + c$ (Método $ac$ y Método $a/a$)',
              latex: 'ax^2 + bx + c = ax^2 + px + qx + c = \\frac{(ax + p)(ax + q)}{a} \\qquad (p \\cdot q = a \\cdot c,\\;\\; p + q = b)',
              variables: 'Donde $a \\neq 0$, $p$ y $q$ son los dos números que multiplicados dan $ac$ y sumados dan $b$.',
              steps: [
                'Paso 0 obligatorio: extrae siempre el Máximo Factor Común (MFC). Luego clasifica por términos: 2 términos (diferencia de cuadrados o cubos), 3 términos (TCP, tanteo o método $ac$), 4 términos (agrupación 2 y 2).',
                'Para $ax^2 + bx + c$ ($a \\neq 1$), calcula $a \\cdot c$ y encuentra $p, q$ tales que $p \\cdot q = ac$ y $p + q = b$.',
                'Camino A (agrupación): parte $bx = px + qx$ y factoriza por parejas. Camino B ($a/a$): forma $\\frac{(ax + p)(ax + q)}{a}$ y cancela $a$ dividiendo los paréntesis.'
              ],
              conditions: 'Válido sobre $\\mathbb{Q}$ cuando $\\Delta = b^2 - 4ac$ es un cuadrado perfecto; de lo contrario usa completar cuadrados o fórmula general.'
            },
            {
              code: '2.5.2',
              kind: 'method',
              name: 'Teorema del Factor y División Sintética (Regla de Ruffini) para Polinomios de Grado $\\ge 3$',
              latex: 'P(r) = 0 \\iff P(x) = (x - r) \\cdot Q(x) \\qquad \\text{con } r \\in \\left\\{\\pm\\frac{\\text{divisor de } a_0}{\\text{divisor de } a_n}\\right\\}',
              variables: 'Donde $P(x)$ es un polinomio de grado $n \\ge 3$, $r$ una raíz real (o $r = a$ en límites $\\frac{0}{0}$ cuando $x \\to a$) y $Q(x)$ el polinomio cociente de grado $n - 1$.',
              steps: [
                'Identifica una raíz $r$ (divisor del término independiente $a_0$, o directamente $x = a$ en indeterminaciones $\\frac{0}{0}$).',
                'Acomoda los coeficientes de $P(x)$ en orden descendente rellenando con $0$ cualquier grado faltante y ejecuta la tabla de Ruffini.',
                'Si el último número (residuo) es $0$, escribe $P(x) = (x - r)Q(x)$ y repite sobre $Q(x)$ hasta factorizar completamente.'
              ],
              conditions: 'La división sintética estándar divide únicamente por binomios mónicos de primer grado $(x - r)$.'
            },
            {
              code: '2.5.3',
              kind: 'method',
              name: 'Método de Completar el Trinomio Cuadrado Perfecto (TCP)',
              latex: 'x^2 + bx + c = \\left(x + \\frac{b}{2}\\right)^2 + c - \\left(\\frac{b}{2}\\right)^2 \\qquad ax^2 + bx + c = 0 \\iff \\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}',
              variables: 'Donde $\\left(\\frac{b}{2}\\right)^2$ es el término que completa el cuadrado perfecto de $x^2 + bx$.',
              steps: [
                'Si $a \\neq 1$, divide la ecuación (o factoriza $a$) para dejar coeficiente $1$ en $x^2$.',
                'Toma la mitad del coeficiente lineal, elévala al cuadrado y súmala y réstala: $\\pm (b/2)^2$.',
                'Agrupa el TCP $(x + b/2)^2$; para factorizar aplica diferencia de cuadrados $A^2 - B^2$, y para resolver ecuaciones saca raíz $\\pm$ a ambos lados.'
              ],
              conditions: 'Método universal: funciona incluso con raíces irracionales, halla el vértice $(h, k)$ de parábolas y simplifica integrales con cuadráticas.'
            },
            {
              code: '2.5.4',
              kind: 'method',
              name: 'Racionalización Cúbica, Factorización Inversa y Cambio de Variable Radical',
              latex: '\\frac{N}{\\sqrt[3]{A} \\mp \\sqrt[3]{B}} = \\frac{N\\left(\\sqrt[3]{A^2} \\pm \\sqrt[3]{AB} + \\sqrt[3]{B^2}\\right)}{A \\mp B} \\qquad A - B = \\left(\\sqrt{A} - \\sqrt{B}\\right)\\left(\\sqrt{A} + \\sqrt{B}\\right)',
              variables: 'Donde $\\sqrt[3]{A^2} \\pm \\sqrt[3]{AB} + \\sqrt[3]{B^2}$ es el factor racionalizador cúbico; en el cambio de variable se define $u = \\sqrt[n]{g(x)}$.',
              steps: [
                'Conjugado clásico (raíz cuadrada): multiplica arriba y abajo por el conjugado y expande únicamente el lado donde se juntan los conjugados.',
                'Raíz cúbica ($a \\mp b$): multiplica numerador y denominador por $a^2 \\pm ab + b^2$ para generar $a^3 \\mp b^3$ sin raíces.',
                'Alternativas rápidas: factoriza $x - a = (\\sqrt{x} - \\sqrt{a})(\\sqrt{x} + \\sqrt{a})$ para tachar directo, o haz $u = \\sqrt[n]{g(x)}$ para transformar radicales en polinomios.'
              ],
              conditions: 'Condiciones: $A \\mp B \\neq 0$; en radicales de índice par exige $A \\ge 0$ y $B \\ge 0$.'
            },
            {
              code: '2.5.5',
              kind: 'method',
              name: 'Ecuación Lineal de Primer Grado y Método del Producto Cero ($A \\cdot B = 0$)',
              latex: 'ax + b = cx + d \\implies x = \\frac{d - b}{a - c} \\qquad \\quad (px + m)(qx + n) = 0 \\iff x_1 = -\\frac{m}{p},\\;\\; x_2 = -\\frac{n}{q}',
              variables: 'Donde $a, b, c, d, p, q, m, n \\in \\mathbb{R}$ son constantes con $a \\neq c$ y $p, q \\neq 0$.',
              steps: [
                'En ecuaciones lineales: elimina paréntesis y denominadores, agrupa los términos con $x$ en un lado y las constantes en el otro, y divide por $(a - c)$.',
                'En ecuaciones cuadráticas factorizables: iguala todo a cero ($= 0$), factoriza en producto de binomios e iguala cada factor a cero por separado.',
                'Comprueba tus raíces al instante con Vieta: $x_1 + x_2 = -b/a$ y $x_1 \\cdot x_2 = c/a$.'
              ],
              conditions: 'En la ecuación lineal, si $a = c$ y $b = d$ hay infinitas soluciones (identidad); si $a = c$ y $b \\neq d$ no existe solución.'
            },
            {
              code: '2.5.6',
              kind: 'method',
              name: 'Métodos para Sistemas Lineales $2 \\times 2$ (Reducción, Sustitución, Igualación y Cramer)',
              latex: '\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases} \\implies D = a_1 b_2 - a_2 b_1, \\quad x = \\frac{c_1 b_2 - c_2 b_1}{D}, \\quad y = \\frac{a_1 c_2 - a_2 c_1}{D}',
              variables: 'Donde $D$ es el determinante principal del sistema, $D_x = c_1 b_2 - c_2 b_1$ y $D_y = a_1 c_2 - a_2 c_1$.',
              steps: [
                'Reducción (eliminación): multiplica las ecuaciones para obtener coeficientes opuestos en una incógnita y suma verticalmente.',
                'Sustitución / Igualación: despeja la incógnita con coeficiente $\\pm 1$ en una ecuación e insértala en la otra (o despeja la misma en ambas e iguala).',
                'Regla de Cramer: evalúa $D, D_x, D_y$ y calcula $x = D_x / D$, $y = D_y / D$.'
              ],
              conditions: 'Solución única si $D \\neq 0$ (rectas secantes). Si $D = 0$: infinitas soluciones si $D_x = D_y = 0$ (coincidentes) o sin solución si alguno es no nulo (paralelas).'
            },
            {
              code: '2.5.7',
              kind: 'method',
              name: 'Inecuaciones Polinomiales y Racionales (Puntos Críticos y Tabla de Signos)',
              latex: '\\frac{P(x)}{Q(x)} \\gtrless 0 \\implies \\text{puntos críticos: } P(x) = 0 \\;\\text{ y }\\; Q(x) = 0 \\quad (Q(x) \\neq 0 \\text{ siempre abierto})',
              variables: 'Donde $P(x)$ y $Q(x)$ son polinomios factorizados en la desigualdad comparada estrictamente contra $0$.',
              steps: [
                'Pasa todos los términos a un lado dejando $0$ en el otro y une en una sola fracción $\\frac{P(x)}{Q(x)}$ (NUNCA multipliques en cruz por $Q(x)$ porque su signo varía).',
                'Factoriza $P(x)$ y $Q(x)$ y ubica todos sus ceros ordenados en la recta real.',
                'Evalúa un valor de prueba en cada subintervalo para armar la tabla de signos y selecciona los intervalos que satisfacen la desigualdad.'
              ],
              conditions: 'Las raíces del denominador $Q(x) = 0$ se excluyen SIEMPRE con paréntesis abierto $(\\,)$, incluso en $\\le$ o $\\ge$. Al multiplicar o dividir por un negativo, el sentido de la desigualdad se invierte.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       3. FORMULARIO DE GEOMETRÍA (Fórmulas y Métodos de Resolución)
       ====================================================================== */
    {
      id: 'geometria',
      moduleNumber: 3,
      name: 'Formulario de Geometría Plana, del Espacio y Analítica',
      shortName: 'Geometría',
      symbol: 'Δ',
      color: '#0284C7',
      levelTag: 'Geometría y Analítica',
      description: 'Teorema de Pitágoras, áreas y volúmenes, semejanza y potencia de un punto, ecuaciones de la recta, cónicas y métodos de resolución geométrica y analítica.',
      sections: [
        {
          id: 'geo-sec-1',
          title: '3.1 Geometría Plana: Triángulos, Polígonos y Circunferencia',
          formulas: [
            {
              code: '3.1.1',
              name: 'Teorema de Pitágoras en el Triángulo Rectángulo',
              latex: 'c^2 = a^2 + b^2 \\implies c = \\sqrt{a^2 + b^2}, \\qquad a = \\sqrt{c^2 - b^2}',
              variables: 'Donde $c$ es la longitud de la hipotenusa (lado opuesto al ángulo recto de $90^\\circ$) y $a, b$ son las longitudes de los catetos.',
              conditions: 'Aplicable exclusivamente a triángulos rectángulos ($a > 0, b > 0, c > a, c > b$).'
            },
            {
              code: '3.1.2',
              name: 'Área de un Triángulo (Fórmula Base-Altura y Fórmula de Herón)',
              latex: 'A = \\frac{b \\cdot h}{2} \\qquad \\quad A = \\sqrt{s(s - a)(s - b)(s - c)} \\quad \\text{con } s = \\frac{a + b + c}{2}',
              variables: 'Donde $b$ es la base, $h$ la altura perpendicular, $a, b, c$ los tres lados del triángulo y $s$ el semiperímetro.',
              conditions: 'Los lados deben satisfacer la desigualdad triangular: $a + b > c$, $a + c > b$ y $b + c > a$.'
            },
            {
              code: '3.1.3',
              name: 'Área del Trapecio, Rombo y Polígono Regular de $n$ Lados',
              latex: 'A_{\\text{trapecio}} = \\frac{(B + b) \\cdot h}{2} \\qquad \\quad A_{\\text{rombo}} = \\frac{D \\cdot d}{2} \\qquad \\quad A_{\\text{polígono}} = \\frac{P \\cdot a_p}{2}',
              variables: 'Donde $B, b$ son las bases paralelas, $h$ la altura; $D, d$ las diagonales; $P$ el perímetro total y $a_p$ el apotema del polígono.',
              conditions: 'Todas las dimensiones deben expresarse en la misma unidad de longitud antes de operar.'
            },
            {
              code: '3.1.4',
              name: 'Circunferencia, Círculo, Longitud de Arco y Sector Circular',
              latex: 'P = 2\\pi r = \\pi D \\qquad A = \\pi r^2 \\qquad L_{\\text{arco}} = r \\cdot \\theta \\qquad A_{\\text{sector}} = \\frac{1}{2} r^2 \\theta',
              variables: 'Donde $r$ es el radio, $D = 2r$ el diámetro y $\\theta$ el ángulo central medido en radianes.',
              conditions: 'En las fórmulas de arco y sector circular, el ángulo $\\theta$ debe estar expresado obligatoriamente en radianes ($\\text{rad}$).'
            }
          ]
        },
        {
          id: 'geo-sec-2',
          title: '3.2 Geometría del Espacio: Volumen y Área Superficial de Sólidos',
          formulas: [
            {
              code: '3.2.1',
              name: 'Prisma Recto y Cilindro Circular Recto',
              latex: 'V_{\\text{prisma}} = A_b \\cdot h \\qquad \\quad V_{\\text{cilindro}} = \\pi r^2 h \\qquad \\quad A_{\\text{total cil}} = 2\\pi r h + 2\\pi r^2',
              variables: 'Donde $A_b$ es el área de la base, $r$ el radio de la base circular y $h$ la altura perpendicular del sólido.',
              conditions: 'Condición: $r > 0, h > 0$. Útil en problemas de optimización de envases en Cálculo Diferencial.'
            },
            {
              code: '3.2.2',
              name: 'Pirámide Regular y Cono Circular Recto',
              latex: 'V_{\\text{pirámide}} = \\frac{1}{3} A_b \\cdot h \\qquad \\quad V_{\\text{cono}} = \\frac{1}{3} \\pi r^2 h \\qquad \\quad A_{\\text{lat cono}} = \\pi r g \\quad \\left(g = \\sqrt{r^2 + h^2}\\right)',
              variables: 'Donde $r$ es el radio de la base, $h$ la altura perpendicular y $g$ la generatriz del cono.',
              conditions: 'El volumen de todo cono o pirámide equivale exactamente a un tercio del cilindro o prisma de igual base y altura.'
            },
            {
              code: '3.2.3',
              name: 'Volumen y Área Superficial de la Esfera',
              latex: 'V_{\\text{esfera}} = \\frac{4}{3} \\pi r^3 \\qquad \\quad A_{\\text{esfera}} = 4 \\pi r^2',
              variables: 'Donde $r$ es el radio de la esfera medida desde su centro hasta cualquier punto de su superficie.',
              conditions: 'Observación de Cálculo: la derivada del volumen respecto al radio $\\frac{dV}{dr} = 4\\pi r^2$ es exactamente el área superficial.'
            }
          ]
        },
        {
          id: 'geo-sec-3',
          title: '3.3 Geometría Analítica en el Plano Cartesiano',
          formulas: [
            {
              code: '3.3.1',
              name: 'Distancia entre Dos Puntos y Coordenadas del Punto Medio',
              latex: 'd(P_1, P_2) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \\qquad \\quad M = \\left( \\frac{x_1 + x_2}{2},\\; \\frac{y_1 + y_2}{2} \\right)',
              variables: 'Donde $P_1(x_1, y_1)$ y $P_2(x_2, y_2)$ son dos puntos cualesquiera del plano cartesiano $\\mathbb{R}^2$.',
              conditions: 'Válido para todo par de puntos en $\\mathbb{R}^2$. Se deduce directamente del Teorema de Pitágoras.'
            },
            {
              code: '3.3.2',
              name: 'Pendiente de una Recta y Condiciones de Paralelismo y Perpendicularidad',
              latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\tan(\\alpha) \\qquad \\quad L_1 \\parallel L_2 \\iff m_1 = m_2 \\qquad \\quad L_1 \\perp L_2 \\iff m_1 \\cdot m_2 = -1',
              variables: 'Donde $m$ es la pendiente o razón de cambio, y $\\alpha$ es el ángulo de inclinación respecto al eje $X$ positivo.',
              conditions: 'Condición: $x_2 \\neq x_1$ (las rectas verticales $x = c$ tienen pendiente indefinida).'
            },
            {
              code: '3.3.3',
              name: 'Formas de la Ecuación de la Recta y Distancia Punto-Recta',
              latex: 'y - y_1 = m(x - x_1) \\qquad y = mx + b \\qquad Ax + By + C = 0 \\qquad d(P_0, L) = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}',
              variables: 'Donde $(x_1, y_1)$ es un punto conocido, $m$ la pendiente, $b$ la ordenada al origen y $A, B, C$ los coeficientes de la forma general.',
              conditions: 'Para la distancia del punto $P_0(x_0, y_0)$ a la recta $Ax + By + C = 0$, se requiere que $A^2 + B^2 > 0$.'
            },
            {
              code: '3.3.4',
              name: 'Ecuaciones Canónicas de la Circunferencia, Parábola, Elipse e Hipérbola',
              latex: '(x - h)^2 + (y - k)^2 = r^2 \\qquad (x - h)^2 = 4p(y - k) \\qquad \\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1 \\qquad \\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1',
              variables: 'Donde $(h, k)$ es el centro o vértice, $r$ el radio, $p$ el parámetro focal y $a, b$ los semiejes mayor/transverso y menor/conjugado.',
              conditions: 'En la elipse $c^2 = a^2 - b^2$ ($a \\ge b > 0$); en la hipérbola $c^2 = a^2 + b^2$, siendo $c$ la distancia del centro a los focos.'
            }
          ]
        },
        {
          id: 'geo-sec-4',
          title: '3.4 Métodos y Estrategias de Resolución Geométrica y Analítica',
          formulas: [
            {
              code: '3.4.1',
              kind: 'method',
              name: 'Método de Ternas Pitagóricas Escaladas y Diferencia de Cuadrados en Pitágoras',
              latex: '(3k,\\; 4k,\\; 5k),\\;\\; (5k,\\; 12k,\\; 13k),\\;\\; (8k,\\; 15k,\\; 17k) \\qquad \\quad b = \\sqrt{c^2 - a^2} = \\sqrt{(c - a)(c + a)}',
              variables: 'Donde $k > 0$ es el factor de escala (MCD de los lados), $c$ la hipotenusa y $a, b$ los catetos del triángulo rectángulo.',
              steps: [
                'Divide los dos lados conocidos por su MCD para identificar si pertenecen a las ternas primitivas $(3, 4, 5)$, $(5, 12, 13)$ u $(8, 15, 17)$ y vuelve a multiplicar por $k$.',
                'Si los lados son grandes y calculas un cateto sin calculadora, factoriza $c^2 - a^2 = (c - a)(c + a)$ antes de extraer la raíz.',
                'Comprueba siempre que la hipotenusa $c$ sea estrictamente mayor que ambos catetos.'
              ],
              conditions: 'Aplica únicamente a triángulos rectángulos ($c > a > 0$).'
            },
            {
              code: '3.4.2',
              kind: 'method',
              name: 'Descomposición por Altura (Proyección sobre la Base) frente a Fórmula de Herón',
              latex: 'h^2 = a^2 - x^2 = b^2 - (c - x)^2 \\implies x = \\frac{a^2 + c^2 - b^2}{2c}, \\qquad A = \\frac{c \\cdot h}{2}',
              variables: 'Donde $a, b, c$ son los tres lados del triángulo, $h$ la altura perpendicular al lado $c$ y $x, c - x$ las proyecciones sobre dicha base.',
              steps: [
                'Ruta A (Fórmula de Herón): calcula el semiperímetro $s = \\frac{a+b+c}{2}$ y evalúa $A = \\sqrt{s(s-a)(s-b)(s-c)}$.',
                'Ruta B (Descomposición por altura): parte la base $c$ en $x$ y $c - x$, iguala $a^2 - x^2 = b^2 - (c - x)^2$ para despejar $x$, halla $h = \\sqrt{a^2 - x^2}$ y calcula $A = \\frac{c \\cdot h}{2}$.',
                'Si además conoces un ángulo comprendido, verifica con el área trigonométrica $\\frac{1}{2}ab\\,\\text{sen}(C)$.'
              ],
              conditions: 'Útil cuando conoces los 3 lados y ningún ángulo; los lados deben cumplir la desigualdad triangular ($a + b > c$).'
            },
            {
              code: '3.4.3',
              kind: 'method',
              name: 'Semejanza (Teorema de Tales), Corona Circular y Potencia de un Punto',
              latex: '\\frac{a}{a\'} = \\frac{b}{b\'} = \\frac{c}{c\'} = k, \\quad \\frac{A}{A\'} = k^2 \\qquad A_{\\text{corona}} = \\pi(R^2 - r^2) \\qquad PA \\cdot PB = PC \\cdot PD = PT^2',
              variables: 'Donde $k$ es la razón de semejanza lineal, $R > r$ los radios concéntricos, y $PA, PB, PC, PD, PT$ segmentos secantes o tangentes desde un punto $P$ a una circunferencia.',
              steps: [
                'En triángulos semejantes o rectas paralelas (Tales), plantea proporciones entre lados homólogos; recuerda que áreas escalan por $k^2$ y volúmenes por $k^3$.',
                'En coronas circulares, resta áreas concéntricas $\\pi(R^2 - r^2)$ (factorizable como $\\pi(R-r)(R+r)$).',
                'En cuerdas, secantes y tangentes desde $P$, iguala los productos de los segmentos $PA \\cdot PB = PC \\cdot PD = PT^2$.'
              ],
              conditions: 'Exige $k > 0$, $R > r > 0$ y que los segmentos se midan siempre desde el mismo punto de intersección $P$.'
            },
            {
              code: '3.4.4',
              kind: 'method',
              name: 'Construcción de la Recta: Punto-Pendiente vs. Despeje de $b$ y Recta Perpendicular',
              latex: 'b = y_0 - m x_0 \\implies y = mx + b \\qquad \\quad m_\\perp = -\\frac{1}{m} \\implies y - y_0 = -\\frac{1}{m}(x - x_0)',
              variables: 'Donde $(x_0, y_0)$ es el punto de paso, $m$ la pendiente de la recta base, $b$ su ordenada al origen y $m_\\perp$ la pendiente perpendicular.',
              steps: [
                'Calcula $m = \\frac{y_2 - y_1}{x_2 - x_1}$ si dispones de dos puntos (o $m = f\'(x_0)$ si es una recta tangente).',
                'Forma 1 (Punto-Pendiente): sustituye directamente en $y - y_0 = m(x - x_0)$ y despeja $y$.',
                'Forma 2 (Despeje de $b$): evalúa $y_0 = m x_0 + b$ para hallar $b$; para una recta perpendicular o normal, reemplaza $m$ por $m_\\perp = -\\frac{1}{m}$.'
              ],
              conditions: 'La pendiente perpendicular $m_\\perp = -1/m$ exige $m \\neq 0$. Si $m = 0$ (recta horizontal), toda perpendicular es vertical ($x = x_0$).'
            },
            {
              code: '3.4.5',
              kind: 'method',
              name: 'Distancia Mínima por Vector Normal y Excentricidad de las Cónicas',
              latex: '\\vec{n} = (A, B), \\quad Q(t) = P_0 + t\\,\\vec{n}, \\quad d(P_0, L) = \\frac{|Ax_0 + By_0 + C|}{\\|\\vec{n}\\|} \\qquad \\quad e = \\frac{c}{a}',
              variables: 'Donde $\\vec{n} = (A, B)$ es el vector normal a $Ax + By + C = 0$, $Q(t)$ la recta perpendicular desde $P_0(x_0, y_0)$, y $e$ la excentricidad de una cónica.',
              steps: [
                'Fórmula directa: escribe la recta en forma general $Ax + By + C = 0$ y evalúa $\\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$.',
                'Comprobación vectorial/geométrica: avanza desde $P_0$ a lo largo de $\\vec{n} = (A, B)$ hasta cortar $L$ en el pie $Q$ y mide $\\|Q - P_0\\|$.',
                'En cónicas, calcula $e = c/a$: en la circunferencia $e = 0$, en la elipse $0 < e < 1$, en la parábola $e = 1$ y en la hipérbola $e > 1$ (asíntotas $y - k = \\pm \\frac{b}{a}(x - h)$).'
              ],
              conditions: 'Se requiere $\\|\\vec{n}\\| = \\sqrt{A^2 + B^2} > 0$ y $a > 0$. Para tangentes a circunferencias, el radio del centro al punto de tangencia es siempre perpendicular a la tangente.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       4. FORMULARIO DE TRIGONOMETRÍA (Fórmulas y Métodos de Resolución)
       ====================================================================== */
    {
      id: 'trigonometria',
      moduleNumber: 4,
      name: 'Formulario de Trigonometría e Identidades',
      shortName: 'Trigonometría',
      symbol: 'θ',
      color: '#0D9488',
      levelTag: 'Trigonometría Analítica',
      description: 'Conversión angular, razones trigonométricas, círculo unitario, identidades fundamentales, leyes de senos y cosenos, ángulo de referencia, demostración de identidades y ecuaciones trigonométricas.',
      sections: [
        {
          id: 'trig-sec-1',
          title: '4.1 Conversión Angular y Razones en el Triángulo Rectángulo',
          formulas: [
            {
              code: '4.1.1',
              name: 'Equivalencia entre Grados Sexagesimales y Radianes',
              latex: '180^\\circ = \\pi \\text{ rad} \\qquad \\quad \\theta_{\\text{rad}} = \\theta_{\\text{grados}} \\cdot \\frac{\\pi}{180^\\circ} \\qquad \\quad \\theta_{\\text{grados}} = \\theta_{\\text{rad}} \\cdot \\frac{180^\\circ}{\\pi}',
              variables: 'Donde $\\theta_{\\text{grados}}$ es la medida del ángulo en grados y $\\theta_{\\text{rad}}$ su medida en radianes.',
              conditions: 'Ángulos notables: $30^\\circ = \\frac{\\pi}{6}$, $45^\\circ = \\frac{\\pi}{4}$, $60^\\circ = \\frac{\\pi}{3}$, $90^\\circ = \\frac{\\pi}{2}$, $180^\\circ = \\pi$, $360^\\circ = 2\\pi$.'
            },
            {
              code: '4.1.2',
              name: 'Las Seis Razones Trigonométricas en el Triángulo Rectángulo',
              latex: '\\text{sen}(\\theta) = \\frac{\\text{CO}}{\\text{H}}, \\quad \\cos(\\theta) = \\frac{\\text{CA}}{\\text{H}}, \\quad \\tan(\\theta) = \\frac{\\text{CO}}{\\text{CA}} \\qquad \\csc(\\theta) = \\frac{\\text{H}}{\\text{CO}}, \\quad \\sec(\\theta) = \\frac{\\text{H}}{\\text{CA}}, \\quad \\cot(\\theta) = \\frac{\\text{CA}}{\\text{CO}}',
              variables: 'Donde $\\text{CO}$ es el cateto opuesto al ángulo $\\theta$, $\\text{CA}$ el cateto adyacente y $\\text{H}$ la hipotenusa.',
              conditions: 'Definidas para ángulos agudos $0 < \\theta < \\frac{\\pi}{2}$ en un triángulo rectángulo, y extendidas a todo $\\theta \\in \\mathbb{R}$ en el círculo unitario.'
            },
            {
              code: '4.1.3',
              name: 'Identidades Recíprocas y de Cociente',
              latex: '\\tan(\\theta) = \\frac{\\text{sen}(\\theta)}{\\cos(\\theta)}, \\quad \\cot(\\theta) = \\frac{\\cos(\\theta)}{\\text{sen}(\\theta)} \\qquad \\sec(\\theta) = \\frac{1}{\\cos(\\theta)}, \\quad \\csc(\\theta) = \\frac{1}{\\text{sen}(\\theta)}, \\quad \\cot(\\theta) = \\frac{1}{\\tan(\\theta)}',
              variables: 'Donde $\\theta \\in \\mathbb{R}$ es el argumento angular.',
              conditions: 'Válidas siempre que los denominadores no se anulen: $\\cos(\\theta) \\neq 0$ (es decir, $\\theta \\neq \\frac{\\pi}{2} + k\\pi$) y $\\text{sen}(\\theta) \\neq 0$ ($\\theta \\neq k\\pi$).'
            }
          ]
        },
        {
          id: 'trig-sec-2',
          title: '4.2 Identidades Pitagóricas y Simetría Par / Impar',
          formulas: [
            {
              code: '4.2.1',
              name: 'Identidad Pitagórica Fundamental y Despejes',
              latex: '\\text{sen}^2(\\theta) + \\cos^2(\\theta) = 1 \\implies \\text{sen}^2(\\theta) = 1 - \\cos^2(\\theta), \\quad \\cos^2(\\theta) = 1 - \\text{sen}^2(\\theta)',
              variables: 'Donde $\\theta \\in \\mathbb{R}$ es cualquier ángulo real.',
              conditions: 'Se cumple universalmente para todo $\\theta \\in \\mathbb{R}$ al aplicar el Teorema de Pitágoras en el círculo unitario de radio $1$.'
            },
            {
              code: '4.2.2',
              name: 'Identidades Pitagóricas para Tangente-Secante y Cotangente-Cosecante',
              latex: '1 + \\tan^2(\\theta) = \\sec^2(\\theta) \\qquad \\quad 1 + \\cot^2(\\theta) = \\csc^2(\\theta)',
              variables: 'Donde $\\theta$ es el ángulo real dentro del dominio de las funciones involucradas.',
              conditions: 'La primera exige $\\cos(\\theta) \\neq 0$; la segunda exige $\\text{sen}(\\theta) \\neq 0$. Indispensables en sustitución trigonométrica para integrales.'
            },
            {
              code: '4.2.3',
              name: 'Identidades de Ángulo Negativo (Paridad) y Cofunción',
              latex: '\\text{sen}(-\\theta) = -\\text{sen}(\\theta), \\quad \\cos(-\\theta) = \\cos(\\theta), \\quad \\tan(-\\theta) = -\\tan(\\theta) \\qquad \\text{sen}\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cos(\\theta)',
              variables: 'Donde $\\theta \\in \\mathbb{R}$. El coseno y la secante son funciones pares; seno, tangente, cosecante y cotangente son impares.',
              conditions: 'Válidas en todos los puntos del dominio de cada función trigonométrica.'
            }
          ]
        },
        {
          id: 'trig-sec-3',
          title: '4.3 Identidades de Suma, Ángulo Doble y Reducción de Potencias',
          formulas: [
            {
              code: '4.3.1',
              name: 'Seno, Coseno y Tangente de la Suma y Diferencia de Dos Ángulos',
              latex: '\\text{sen}(\\alpha \\pm \\beta) = \\text{sen}(\\alpha)\\cos(\\beta) \\pm \\cos(\\alpha)\\text{sen}(\\beta) \\qquad \\cos(\\alpha \\pm \\beta) = \\cos(\\alpha)\\cos(\\beta) \\mp \\text{sen}(\\alpha)\\text{sen}(\\beta)',
              variables: 'Donde $\\alpha$ y $\\beta$ son dos ángulos reales cualesquiera.',
              conditions: 'Observa que en el coseno de la suma/resta el signo central se invierte ($\\mp$). Para la tangente: $\\tan(\\alpha \\pm \\beta) = \\frac{\\tan(\\alpha) \\pm \\tan(\\beta)}{1 \\mp \\tan(\\alpha)\\tan(\\beta)}$.'
            },
            {
              code: '4.3.2',
              name: 'Identidades del Ángulo Doble ($2\\theta$)',
              latex: '\\text{sen}(2\\theta) = 2\\,\\text{sen}(\\theta)\\cos(\\theta) \\qquad \\quad \\cos(2\\theta) = \\cos^2(\\theta) - \\text{sen}^2(\\theta) = 2\\cos^2(\\theta) - 1 = 1 - 2\\,\\text{sen}^2(\\theta)',
              variables: 'Donde $\\theta \\in \\mathbb{R}$ es el ángulo base y $2\\theta$ su duplo.',
              conditions: 'Válidas para todo $\\theta \\in \\mathbb{R}$. Permiten simplificar ecuaciones trigonométricas y derivadas.'
            },
            {
              code: '4.3.3',
              name: 'Fórmulas de Reducción de Potencias (Ángulo Mitad para Integración)',
              latex: '\\text{sen}^2(\\theta) = \\frac{1 - \\cos(2\\theta)}{2} \\qquad \\quad \\cos^2(\\theta) = \\frac{1 + \\cos(2\\theta)}{2}',
              variables: 'Donde $\\theta \\in \\mathbb{R}$ es el argumento angular.',
              conditions: 'Herramienta obligatoria en Cálculo Integral para resolver $\\int \\text{sen}^2(x)\\,dx$ y $\\int \\cos^2(x)\\,dx$.'
            }
          ]
        },
        {
          id: 'trig-sec-4',
          title: '4.4 Resolución de Triángulos Oblicuángulos',
          formulas: [
            {
              code: '4.4.1',
              name: 'Ley de los Senos',
              latex: '\\frac{a}{\\text{sen}(A)} = \\frac{b}{\\text{sen}(B)} = \\frac{c}{\\text{sen}(C)} = 2R',
              variables: 'Donde $a, b, c$ son las longitudes de los lados opuestos a los ángulos interiores $A, B, C$ respectivamente, y $R$ el circunradio.',
              conditions: 'Se aplica cuando se conocen: dos ángulos y un lado (AAL o ALA), o dos lados y el ángulo opuesto a uno de ellos (LLA).'
            },
            {
              code: '4.4.2',
              name: 'Ley de los Cosenos',
              latex: 'c^2 = a^2 + b^2 - 2ab\\cos(C) \\qquad \\quad \\cos(C) = \\frac{a^2 + b^2 - c^2}{2ab}',
              variables: 'Donde $a, b, c$ son los tres lados del triángulo y $C$ es el ángulo comprendido entre los lados $a$ y $b$.',
              conditions: 'Se aplica cuando se conocen: dos lados y el ángulo comprendido entre ellos (LAL), o los tres lados del triángulo (LLL).'
            },
            {
              code: '4.4.3',
              name: 'Área Trigonométrica de un Triángulo Cualquiera',
              latex: 'A = \\frac{1}{2} a \\cdot b \\cdot \\text{sen}(C) = \\frac{1}{2} b \\cdot c \\cdot \\text{sen}(A) = \\frac{1}{2} a \\cdot c \\cdot \\text{sen}(B)',
              variables: 'Donde $a, b, c$ son lados del triángulo y $A, B, C$ los ángulos interiores comprendidos entre cada par de lados.',
              conditions: 'Válida para todo triángulo acutángulo, rectángulo u obtusángulo sin necesidad de conocer su altura perpendicular.'
            }
          ]
        },
        {
          id: 'trig-sec-5',
          title: '4.5 Métodos de Resolución Trigonométrica e Identidades',
          formulas: [
            {
              code: '4.5.1',
              kind: 'method',
              name: 'Triángulo Rectángulo Auxiliar (SOH-CAH-TOA) y Deducción Pitagórica de las 6 Razones',
              latex: 'P(\\theta) = (\\cos\\theta,\\; \\text{sen}\\,\\theta), \\qquad \\theta = \\frac{s}{r} \\qquad \\quad \\cos\\theta = \\pm\\sqrt{1 - \\text{sen}^2(\\theta)}',
              variables: 'Donde $P(\\theta)$ es el punto terminal en el círculo unitario ($r = 1$), $s$ es la longitud de arco y el signo $\\pm$ depende del cuadrante de $\\theta$.',
              steps: [
                'Camino geométrico: con una razón conocida, dibuja un triángulo rectángulo auxiliar etiquetando catetos/hipotenusa con SOH-CAH-TOA y halla el lado faltante con Pitágoras.',
                'Camino algebraico: sustituye el valor conocido en $\\text{sen}^2(\\theta) + \\cos^2(\\theta) = 1$, despeja la raíz y calcula $\\tan(\\theta) = \\frac{\\text{sen}(\\theta)}{\\cos(\\theta)}$ y las recíprocas.',
                'Ajusta siempre el signo ($+$ o $-$) de cada razón según el cuadrante en que cae el ángulo $\\theta$.'
              ],
              conditions: 'Al trabajar en el círculo unitario, recuerda siempre $-1 \\le \\text{sen}(\\theta) \\le 1$ y $-1 \\le \\cos(\\theta) \\le 1$.'
            },
            {
              code: '4.5.2',
              kind: 'method',
              name: 'Reducción al Primer Cuadrante (Ángulo de Referencia y Signos por Cuadrante)',
              latex: '\\theta_{\\text{ref}} = \\begin{cases} \\theta, & \\text{Cuadrante I (Todas } +) \\\\ \\pi - \\theta, & \\text{Cuadrante II (sen, csc } +) \\\\ \\theta - \\pi, & \\text{Cuadrante III (tan, cot } +) \\\\ 2\\pi - \\theta, & \\text{Cuadrante IV (cos, sec } +) \\end{cases}',
              variables: 'Donde $\\theta \\in [0, 2\\pi)$ es el ángulo en posición estándar y $\\theta_{\\text{ref}} \\in \\left[0, \\frac{\\pi}{2}\\right]$ su ángulo agudo al eje horizontal $X$.',
              steps: [
                'Reduce ángulos fuera de $[0, 2\\pi)$ sumando o restando múltiplos de $2\\pi$ (o $360^\\circ$) para hallar el ángulo coterminal.',
                'Determina el cuadrante y mide la distancia más corta al eje horizontal ($\\pi$ o $2\\pi$): ese valor es $\\theta_{\\text{ref}}$.',
                'Evalúa la razón en $\\theta_{\\text{ref}}$ y antepone el signo del cuadrante (regla mnemotécnica: I Todas $+$, II Sen $+$, III Tan $+$, IV Cos $+$).'
              ],
              conditions: 'Mide el ángulo de referencia SIEMPRE respecto al eje horizontal $X$ ($0, \\pi, 2\\pi$), nunca respecto al eje vertical $Y$.'
            },
            {
              code: '4.5.3',
              kind: 'method',
              name: 'Demostración de Identidades: Conversión a Senos/Cosenos y Conjugado Trigonométrico',
              latex: '\\frac{1 - \\cos x}{\\text{sen}\\,x} = \\frac{(1 - \\cos x)(1 + \\cos x)}{\\text{sen}\\,x\\,(1 + \\cos x)} = \\frac{\\text{sen}^2 x}{\\text{sen}\\,x\\,(1 + \\cos x)} = \\frac{\\text{sen}\\,x}{1 + \\cos x}',
              variables: 'Donde $1 \\pm \\cos x$ y $1 \\pm \\text{sen}\\,x$ son pares conjugados trigonométricos que producen identidades pitagóricas al multiplicarse.',
              steps: [
                'Parte del lado más complejo de la igualdad (NUNCA muevas términos cruzando el signo $=$ al demostrar una identidad).',
                'Estrategia 1 (Todo a senos y cosenos): sustituye $\\tan, \\cot, \\sec, \\csc$ por fracciones en $\\text{sen}$ y $\\cos$, suma con común denominador y reduce con $\\text{sen}^2 + \\cos^2 = 1$.',
                'Estrategia 2 (Algebraica / Conjugado): factoriza diferencias de cuadrados ($1 - \\cos^2 x = \\text{sen}^2 x$) o multiplica arriba y abajo por $(1 \\pm \\cos x)$.'
              ],
              conditions: 'Válido en todo punto donde no se anulen los denominadores introducidos (ej. $\\text{sen}\\,x \\neq 0$ y $1 + \\cos x \\neq 0$).'
            },
            {
              code: '4.5.4',
              kind: 'method',
              name: 'Resolución de Ecuaciones Trigonométricas en $[0, 2\\pi)$ por Sustitución Cuadrática',
              latex: 'a\\,u^2 + b\\,u + c = 0 \\qquad (u = \\text{sen}\\,x \\text{ o } \\cos x,\\;\\; |u| \\le 1) \\implies x \\in [0, 2\\pi)',
              variables: 'Donde $u$ es la variable auxiliar trigonométrica y el conjunto solución incluye todas las soluciones del intervalo principal $[0, 2\\pi)$.',
              steps: [
                'Aplica identidades pitagóricas o de ángulo doble hasta expresar toda la ecuación en términos de una sola razón trigonométrica.',
                'Sustituye $u = \\text{sen}\\,x$ (o $\\cos x, \\tan x$) y resuelve la ecuación polinomial resultante (factorizando o por fórmula general).',
                'Descarta raíces fuera de $[-1, 1]$ para seno/coseno y encuentra TODOS los ángulos en $[0, 2\\pi)$ con su ángulo de referencia en los cuadrantes con el signo correcto.'
              ],
              conditions: 'Para soluciones generales en $\\mathbb{R}$, suma $+2k\\pi$ ($k \\in \\mathbb{Z}$) en seno/coseno y $+k\\pi$ en tangente/cotangente.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       5. FORMULARIO DE FUNCIONES (Fórmulas y Métodos de Resolución)
       ====================================================================== */
    {
      id: 'funciones',
      moduleNumber: 5,
      name: 'Formulario de Funciones y Modelado Matemático',
      shortName: 'Funciones',
      symbol: 'f(x)',
      color: '#4F46E5',
      levelTag: 'Precálculo',
      description: 'Restricciones de dominio (3 semáforos), paridad, tasa de variación, álgebra y composición, cálculo de función inversa, división polinomial para asíntotas y ecuaciones exponenciales y logarítmicas.',
      sections: [
        {
          id: 'fun-sec-1',
          title: '5.1 Dominio Real, Tasa de Variación y Simetría',
          formulas: [
            {
              code: '5.1.1',
              name: 'Las Tres Reglas de Oro del Dominio Natural en ℝ',
              latex: '\\frac{P(x)}{Q(x)} \\implies Q(x) \\neq 0 \\qquad \\sqrt[2n]{g(x)} \\implies g(x) \\ge 0 \\qquad \\log_b(h(x)) \\implies h(x) > 0',
              variables: 'Donde $Q(x)$ es un denominador, $g(x)$ el radicando de una raíz de índice par $2n$, y $h(x)$ el argumento de un logaritmo.',
              conditions: 'Si una expresión combina raíz par en el denominador $\\frac{1}{\\sqrt{g(x)}}$, la condición se vuelve estricta: $g(x) > 0$.'
            },
            {
              code: '5.1.2',
              name: 'Tasa de Variación Media (Pendiente de la Recta Secante) y Cociente Incremental',
              latex: '\\text{TVM}_{[a, b]} = \\frac{f(b) - f(a)}{b - a} \\qquad \\quad \\frac{\\Delta y}{\\Delta x} = \\frac{f(x + h) - f(x)}{h}',
              variables: 'Donde $[a, b]$ es el intervalo de evaluación, $h = \\Delta x$ el incremento de la variable independiente y $f$ la función.',
              conditions: 'Condición: $b \\neq a$ y $h \\neq 0$. El cociente incremental de Newton es la base directa de la definición de derivada cuando $h \\to 0$.'
            },
            {
              code: '5.1.3',
              name: 'Criterios Analíticos de Simetría: Función Par y Función Impar',
              latex: '\\text{Par: } f(-x) = f(x) \\quad (\\text{simétrica eje } Y) \\qquad \\quad \\text{Impar: } f(-x) = -f(x) \\quad (\\text{simétrica al origen})',
              variables: 'Donde $x$ y $-x$ pertenecen al dominio simétrico $\\text{Dom}(f)$ de la función.',
              conditions: 'En cálculo integral, si $f$ es impar en $[-a, a]$, entonces $\\int_{-a}^a f(x)\\,dx = 0$; si es par, $\\int_{-a}^a f(x)\\,dx = 2\\int_0^a f(x)\\,dx$.'
            }
          ]
        },
        {
          id: 'fun-sec-2',
          title: '5.2 Álgebra de Funciones, Composición e Inversa',
          formulas: [
            {
              code: '5.2.1',
              name: 'Operaciones Algebraicas entre Funciones',
              latex: '(f \\pm g)(x) = f(x) \\pm g(x) \\qquad (f \\cdot g)(x) = f(x) \\cdot g(x) \\qquad \\left(\\frac{f}{g}\\right)(x) = \\frac{f(x)}{g(x)}',
              variables: 'Donde $f$ y $g$ son funciones reales con dominios $\\text{Dom}(f)$ y $\\text{Dom}(g)$.',
              conditions: 'El dominio es la intersección $\\text{Dom}(f) \\cap \\text{Dom}(g)$, excluyendo en el cociente los valores donde $g(x) = 0$.'
            },
            {
              code: '5.2.2',
              name: 'Composición de Funciones $(f \\circ g)(x)$',
              latex: '(f \\circ g)(x) = f(g(x)) \\qquad \\quad \\text{Dom}(f \\circ g) = \\{ x \\in \\text{Dom}(g) \\mid g(x) \\in \\text{Dom}(f) \\}',
              variables: 'Donde $g$ es la función interna (se aplica primero a $x$) y $f$ es la función externa (se aplica al resultado $g(x)$).',
              conditions: 'La composición NO es conmutativa en general: $(f \\circ g)(x) \\neq (g \\circ f)(x)$.'
            },
            {
              code: '5.2.3',
              name: 'Condición de Inyectividad y Propiedad de la Función Inversa $f^{-1}$',
              latex: 'f(x_1) = f(x_2) \\implies x_1 = x_2 \\qquad \\quad y = f(x) \\iff x = f^{-1}(y) \\qquad \\quad (f^{-1} \\circ f)(x) = x',
              variables: 'Donde $f$ es una función inyectiva (uno a uno) y $f^{-1}$ su función inversa.',
              conditions: 'Se cumple que $\\text{Dom}(f^{-1}) = \\text{Rango}(f)$ y $\\text{Rango}(f^{-1}) = \\text{Dom}(f)$. Sus gráficas son simétricas respecto a la recta $y = x$. Nota: $f^{-1}(x) \\neq \\frac{1}{f(x)}$.'
            }
          ]
        },
        {
          id: 'fun-sec-3',
          title: '5.3 Transformaciones Gráficas y Familias de Funciones',
          formulas: [
            {
              code: '5.3.1',
              name: 'Desplazamientos, Escalamientos y Reflexiones de una Gráfica',
              latex: 'y = a \\cdot f(b(x - h)) + k',
              variables: 'Donde $h$ es la traslación horizontal, $k$ la traslación vertical, $|a|$ el factor de estiramiento/compresión vertical y $\\frac{1}{|b|}$ el factor horizontal.',
              conditions: 'Si $h > 0$, desplaza a la derecha; si $k > 0$, hacia arriba. Si $a < 0$, refleja respecto al eje $X$; si $b < 0$, refleja respecto al eje $Y$.'
            },
            {
              code: '5.3.2',
              name: 'Función Cuadrática en Forma Estándar y Coordenadas del Vértice',
              latex: 'f(x) = ax^2 + bx + c = a(x - h)^2 + k \\qquad \\text{con } h = -\\frac{b}{2a}, \\quad k = f(h) = c - \\frac{b^2}{4a}',
              variables: 'Donde $(h, k)$ es el vértice de la parábola y $a \\neq 0$ el coeficiente de apertura.',
              conditions: 'Si $a > 0$, la parábola abre hacia arriba y $k$ es el mínimo absoluto; si $a < 0$, abre hacia abajo y $k$ es el máximo absoluto.'
            },
            {
              code: '5.3.3',
              name: 'Asíntotas Verticales y Horizontales de una Función Racional',
              latex: 'f(x) = \\frac{a_n x^n + \\dots + a_0}{b_m x^m + \\dots + b_0} \\implies \\text{A.H.: } \\begin{cases} y = 0, & \\text{si } n < m \\\\ y = \\dfrac{a_n}{b_m}, & \\text{si } n = m \\\\ \\text{Sin A.H.}, & \\text{si } n > m \\end{cases}',
              variables: 'Donde $n$ es el grado del polinomio numerador, $m$ el grado del denominador y $a_n, b_m$ sus coeficientes principales.',
              conditions: 'Las asíntotas verticales ocurren en las raíces reales de $Q(x) = 0$ que no se cancelan con el numerador (tras simplificar).'
            },
            {
              code: '5.3.4',
              name: 'Modelos de Crecimiento Exponencial Continuo y Función Sinusoidal',
              latex: 'P(t) = P_0 \\cdot e^{k t} \\qquad \\quad y(t) = A \\cdot \\text{sen}(\\omega t + \\varphi) + D, \\quad T = \\frac{2\\pi}{|\\omega|}',
              variables: 'Donde $P_0$ es el valor inicial, $k$ la tasa continua, $|A|$ la amplitud, $\\omega$ la frecuencia angular, $T$ el periodo y $D$ el desplazamiento medio.',
              conditions: 'En el modelo exponencial, si $k > 0$ hay crecimiento exponencial; si $k < 0$, decaimiento exponencial (vida media $t_{1/2} = \\frac{\\ln(2)}{|k|}$).'
            }
          ]
        },
        {
          id: 'fun-sec-4',
          title: '5.4 Métodos de Dominio, Inversa, Racionales y Ecuaciones Trascendentes',
          formulas: [
            {
              code: '5.4.1',
              kind: 'method',
              name: 'Método de los 3 Semáforos e Intersección de Restricciones de Dominio',
              latex: '\\text{Dom}(f) = \\{x \\in \\mathbb{R} \\mid Q(x) \\neq 0\\} \\cap \\{x \\mid g(x) \\ge 0\\} \\cap \\{x \\mid h(x) > 0\\}',
              variables: 'Donde $Q(x)$ es cada denominador, $g(x)$ cada radicando de índice par y $h(x)$ cada argumento logarítmico presente en la expresión.',
              steps: [
                'Escanea la fórmula y lista cada restricción activa: denominadores ($\\neq 0$), raíces de índice par ($\\ge 0$) y logaritmos ($> 0$).',
                'Resuelve cada ecuación o inecuación por separado sobre la recta real.',
                'Intersecta todos los intervalos solución excluyendo cualquier punto aislado que anule un denominador.'
              ],
              conditions: 'Los polinomios, exponenciales, raíces impares, $\\text{sen}(x)$ y $\\cos(x)$ tienen dominio libre en todo $\\mathbb{R}$.'
            },
            {
              code: '5.4.2',
              kind: 'method',
              name: 'Cálculo y Verificación de la Función Inversa ($x \\leftrightarrow y$ y Deshacer Capas)',
              latex: 'y = f(x) \\xrightarrow{\\text{despejar } x} x = f^{-1}(y) \\xrightarrow{x \\leftrightarrow y} y = f^{-1}(x), \\qquad f(a) = b \\iff f^{-1}(b) = a',
              variables: 'Donde $f$ es una función inyectiva (prueba de la recta horizontal) y $f^{-1}$ su función inversa simétrica respecto a $y = x$.',
              steps: [
                'Escribe $y = f(x)$ y verifica que $f$ sea inyectiva en el dominio considerado (restringiéndolo si es necesario, ej. $x \\ge 0$ para $x^2$).',
                'Despeja algebraicamente $x$ en términos de $y$ (deshaciendo las operaciones en orden inverso al aplicado a $x$).',
                'Intercambia las variables $x \\leftrightarrow y$ y verifica con un punto concreto: si $f(a) = b$, debe cumplirse $f^{-1}(b) = a$.'
              ],
              conditions: 'Recuerda: $\\text{Dom}(f^{-1}) = \\text{Rango}(f)$ y $\\text{Rango}(f^{-1}) = \\text{Dom}(f)$. Nunca confundas $f^{-1}(x)$ con $[f(x)]^{-1} = \\frac{1}{f(x)}$.'
            },
            {
              code: '5.4.3',
              kind: 'method',
              name: 'División Polinomial para Asíntotas Oblicuas y Detección de Huecos Removibles',
              latex: '\\frac{P(x)}{D(x)} = Q(x) + \\frac{R(x)}{D(x)} \\implies \\text{A.O.: } y = mx + b \\quad (\\text{gr}(P) = \\text{gr}(D) + 1)',
              variables: 'Donde $Q(x) = mx + b$ es el cociente lineal de la división polinomial y $R(x)$ el residuo con $\\text{gr}(R) < \\text{gr}(D)$.',
              steps: [
                'Factoriza numerador y denominador: si un factor $(x - c)$ se cancela arriba y abajo, en $x = c$ hay un hueco removible (no asíntota vertical).',
                'En las raíces restantes del denominador ($D(x) = 0$ no canceladas), traza las asíntotas verticales $x = a$.',
                'Si $\\text{gr}(P) = \\text{gr}(D) + 1$, realiza la división polinomial o sintética: el cociente $y = Q(x)$ es exactamente la asíntota oblicua pues $\\frac{R(x)}{D(x)} \\to 0$ cuando $x \\to \\pm\\infty$.'
              ],
              conditions: 'Una función racional no puede tener asíntota horizontal y oblicua simultáneamente.'
            },
            {
              code: '5.4.4',
              kind: 'method',
              name: 'Resolución de Ecuaciones Exponenciales (Bases Iguales vs. Logaritmo Natural)',
              latex: 'b^{u(x)} = b^{v(x)} \\iff u(x) = v(x) \\qquad \\quad a^{f(x)} = k \\;(k > 0) \\iff f(x) = \\frac{\\ln(k)}{\\ln(a)}',
              variables: 'Donde $b, a > 0$ ($b, a \\neq 1$) son las bases exponenciales y $k > 0$ el valor aislado en el lado derecho.',
              steps: [
                'Camino 1 (Bases iguales): si ambos lados son potencias limpias de una misma base ($2^k, 3^k, 5^k$), reescríbelos con base común e iguala exponentes directamente.',
                'Camino 2 (Universal con $\\ln$): aísla la exponencial $a^{f(x)} = k$, aplica $\\ln$ en ambos lados para bajar el exponente ($f(x)\\ln a = \\ln k$) y despeja $x$.',
                'En ecuaciones tipo $a^{2x} + B a^x + C = 0$, haz la sustitución $u = a^x$ ($u > 0$) y resuelve la cuadrática en $u$.'
              ],
              conditions: 'Como $a^{f(x)} > 0$ para todo $x \\in \\mathbb{R}$, si al aislar queda $k \\le 0$ la ecuación NO tiene solución real.'
            },
            {
              code: '5.4.5',
              kind: 'method',
              name: 'Resolución de Ecuaciones Logarítmicas (Unificación de $\\ln$ vs. Exponenciación $e^{(\\cdot)}$)',
              latex: '\\log_b(A) = \\log_b(B) \\iff A = B \\;(A, B > 0) \\qquad \\quad \\ln(A) = c \\iff A = e^c',
              variables: 'Donde $A = A(x)$ y $B = B(x)$ son los argumentos logarítmicos, $b > 0$ ($b \\neq 1$) la base y $c \\in \\mathbb{R}$ una constante.',
              steps: [
                'Aplica las leyes de logaritmos (suma $\\to$ producto, resta $\\to$ cociente, coeficiente $\\to$ exponente) para condensar cada lado en un solo logaritmo.',
                'Si tienes $\\log_b(A) = \\log_b(B)$ iguala los argumentos $A = B$; si tienes $\\log_b(A) = c$ reescribe en forma exponencial $A = b^c$ (o $A = e^c$ con $\\ln$).',
                'Verificación OBLIGATORIA: sustituye cada raíz en la ecuación original y descarta cualquier solución que haga cero o negativo algún argumento.'
              ],
              conditions: 'Al elevar o unificar logaritmos pueden aparecer soluciones extrañas fuera del dominio; la verificación de positividad ($> 0$) en los argumentos originales es indispensable.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       6. FORMULARIO DE LÍMITES (Fórmulas y Métodos de Resolución)
       ====================================================================== */
    {
      id: 'limites',
      moduleNumber: 6,
      name: 'Formulario de Límites y Continuidad',
      shortName: 'Límites',
      symbol: 'lim',
      color: '#7C3AED',
      levelTag: 'Cálculo Diferencial',
      description: 'Definición ε-δ y límites laterales, leyes algebraicas, indeterminaciones 0/0 (factorización, conjugado, cambio de variable y traslación), límites al infinito, sándwich, notables y continuidad.',
      sections: [
        {
          id: 'lim-sec-1',
          title: '6.1 Definición, Existencia Bilateral y Propiedades Algebraicas',
          formulas: [
            {
              code: '6.1.1',
              name: 'Definición Formal (ε - δ) y Teorema de Existencia del Límite Bilateral',
              latex: '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = L \\quad \\text{y} \\quad \\lim_{x \\to a^+} f(x) = L',
              variables: 'Donde $a \\in \\mathbb{R}$ es el punto de acumulación, $x \\to a^-$ el límite lateral izquierdo, $x \\to a^+$ el límite lateral derecho y $L \\in \\mathbb{R}$ el valor del límite.',
              conditions: 'El límite bilateral existe en $a$ si y solo si ambos límites laterales existen como números reales finitos y son exactamente iguales entre sí.'
            },
            {
              code: '6.1.2',
              name: 'Leyes Algebraicas de los Límites (Suma, Múltiplo Constante y Producto)',
              latex: '\\lim_{x \\to a} \\Big[ f(x) \\pm g(x) \\Big] = L_1 \\pm L_2 \\qquad \\lim_{x \\to a} \\Big[ c \\cdot f(x) \\Big] = c \\cdot L_1 \\qquad \\lim_{x \\to a} \\Big[ f(x) \\cdot g(x) \\Big] = L_1 \\cdot L_2',
              variables: 'Donde $\\lim_{x \\to a} f(x) = L_1$, $\\lim_{x \\to a} g(x) = L_2$ y $c \\in \\mathbb{R}$ es una constante real arbitraria.',
              conditions: 'Válidas siempre que los límites individuales $L_1$ y $L_2$ existan y sean finitos.'
            },
            {
              code: '6.1.3',
              name: 'Leyes Algebraicas de los Límites (Cociente, Potencia y Raíz)',
              latex: '\\lim_{x \\to a} \\left[ \\frac{f(x)}{g(x)} \\right] = \\frac{L_1}{L_2} \\qquad \\lim_{x \\to a} \\Big[ f(x) \\Big]^n = L_1^n \\qquad \\lim_{x \\to a} \\sqrt[n]{f(x)} = \\sqrt[n]{L_1}',
              variables: 'Donde $L_1 = \\lim_{x \\to a} f(x)$, $L_2 = \\lim_{x \\to a} g(x)$ y $n \\in \\mathbb{Z}^+$ es el índice o exponente.',
              conditions: 'En el cociente se exige $L_2 \\neq 0$. Para raíces de índice par ($n$ par), se requiere que $L_1 > 0$ si $x \\to a$, con $f(x) \\ge 0$ en el entorno de $a$.'
            }
          ]
        },
        {
          id: 'lim-sec-2',
          title: '6.2 Indeterminaciones 0/0 y Límites al Infinito',
          formulas: [
            {
              code: '6.2.1',
              name: 'Resolución de Indeterminación 0/0 por Factorización y Cancelación Algebraica',
              latex: '\\lim_{x \\to a} \\frac{P(x)}{Q(x)} = \\lim_{x \\to a} \\frac{(x - a) \\cdot P_1(x)}{(x - a) \\cdot Q_1(x)} = \\lim_{x \\to a} \\frac{P_1(x)}{Q_1(x)} = \\frac{P_1(a)}{Q_1(a)}',
              variables: 'Donde $P(a) = 0$ y $Q(a) = 0$, demostrando por el Teorema del Factor que $(x - a)$ es factor común del numerador y denominador.',
              conditions: 'Puesto que $x \\to a$, $x \\neq a$ y por ende $(x - a) \\neq 0$, lo que legitima algebraicamente cancelar el factor nulo antes de sustituir.'
            },
            {
              code: '6.2.2',
              name: 'Resolución de Indeterminación 0/0 por Racionalización (Binomio Conjugado)',
              latex: '\\lim_{x \\to a} \\frac{\\sqrt{f(x)} - \\sqrt{g(x)}}{h(x)} = \\lim_{x \\to a} \\frac{\\Big(\\sqrt{f(x)} - \\sqrt{g(x)}\\Big)\\Big(\\sqrt{f(x)} + \\sqrt{g(x)}\\Big)}{h(x)\\Big(\\sqrt{f(x)} + \\sqrt{g(x)}\\Big)} = \\lim_{x \\to a} \\frac{f(x) - g(x)}{h(x)\\Big(\\sqrt{f(x)} + \\sqrt{g(x)}\\Big)}',
              variables: 'Donde el numerador contiene radicales de índice 2 que generan diferencia de cuadrados: $(A - B)(A + B) = A^2 - B^2$.',
              conditions: 'Condición: $f(x) \\ge 0$ y $g(x) \\ge 0$ en un entorno de $a$, y el factor conjugado debe ser estrictamente positivo.'
            },
            {
              code: '6.2.3',
              name: 'Límites al Infinito de Funciones Racionales (Grados de Polinomios)',
              latex: '\\lim_{x \\to \\pm\\infty} \\frac{a_n x^n + \\dots + a_0}{b_m x^m + \\dots + b_0} = \\begin{cases} 0, & \\text{si } n < m \\\\ \\dfrac{a_n}{b_m}, & \\text{si } n = m \\\\ \\pm\\infty, & \\text{si } n > m \\end{cases}',
              variables: 'Donde $n = \\text{gr}(P)$ es el grado del numerador, $m = \\text{gr}(Q)$ el grado del denominador, y $a_n, b_m \\neq 0$ sus coeficientes principales.',
              conditions: 'Se basa en la propiedad $\\lim_{x \\to \\pm\\infty} \\frac{1}{x^k} = 0$ para todo $k > 0$. Si $n = m + 1$, existe una asíntota oblicua $y = mx + b$.'
            }
          ]
        },
        {
          id: 'lim-sec-3',
          title: '6.3 Límites Notables (Trigonométricos y Exponenciales) y Continuidad',
          formulas: [
            {
              code: '6.3.1',
              name: 'Límites Trigonométricos Notables en el Origen',
              latex: '\\lim_{x \\to 0} \\frac{\\text{sen}(kx)}{kx} = 1 \\qquad \\quad \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x} = 0 \\qquad \\quad \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{2}',
              variables: 'Donde $x$ es el ángulo medido en radianes y $k \\neq 0$ una constante de escalamiento angular.',
              conditions: 'Condición indispensable: la variable $x$ debe estar obligatoriamente en radianes ($\\text{rad}$) y el argumento del seno debe ser idéntico al denominador.'
            },
            {
              code: '6.3.2',
              name: 'Límite Trigonométrico Notable de la Tangente',
              latex: '\\lim_{x \\to 0} \\frac{\\tan(kx)}{kx} = 1 \\qquad \\quad \\lim_{x \\to 0} \\frac{\\text{arcsen}(x)}{x} = 1 \\qquad \\quad \\lim_{x \\to 0} \\frac{\\arctan(x)}{x} = 1',
              variables: 'Donde $k \\neq 0$ es un factor multiplicativo real y las razones trigonométricas son directas e inversas.',
              conditions: 'Se deduce directamente aplicando $\\tan(x) = \\frac{\\text{sen}(x)}{\\cos(x)}$ sabiendo que $\\lim_{x \\to 0} \\cos(x) = 1$.'
            },
            {
              code: '6.3.3',
              name: 'Límites Exponenciales Notables y Definición del Número $e$',
              latex: '\\lim_{x \\to \\pm\\infty} \\left(1 + \\frac{1}{x}\\right)^x = e \\qquad \\lim_{u \\to 0} (1 + u)^{\\frac{1}{u}} = e \\qquad \\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1 \\qquad \\lim_{x \\to 0} \\frac{\\ln(1 + x)}{x} = 1',
              variables: 'Donde $e \\approx 2.718281828...$ es la base de los logaritmos naturales (número de Euler).',
              conditions: 'Resuelven la indeterminación exponencial del tipo $1^\\infty$. La forma general es: $\\lim [f(x)]^{g(x)} = e^{\\lim [f(x) - 1]\\cdot g(x)}$.'
            },
            {
              code: '6.3.4',
              name: 'Condiciones de Continuidad en un Punto',
              latex: 'f \\text{ es continua en } x = a \\iff \\begin{cases} 1) & f(a) \\text{ existe } (a \\in \\text{Dom}(f)) \\\\ 2) & \\displaystyle\\lim_{x \\to a} f(x) = L \\text{ existe} \\\\ 3) & \\displaystyle\\lim_{x \\to a} f(x) = f(a) \\end{cases}',
              variables: 'Donde $a$ es un punto interior al dominio de la función $f$.',
              conditions: 'Si falla 1 o 2 pero el límite existe, la discontinuidad es evitable (removible). Si los límites laterales difieren, la discontinuidad es de salto.'
            },
            {
              code: '6.3.5',
              name: 'Teorema del Valor Intermedio (Bolzano) para Existencia de Raíces',
              latex: 'f \\in C[a, b] \\quad \\text{y} \\quad f(a) \\cdot f(b) < 0 \\implies \\exists\\, c \\in (a, b) \\text{ tal que } f(c) = 0',
              variables: 'Donde $f \\in C[a, b]$ indica que la función $f$ es continua en el intervalo cerrado $[a, b]$, y $c$ representa al menos una raíz o cero real.',
              conditions: 'Condición: $f$ debe ser estrictamente continua en $[a, b]$ y presentar signos opuestos en los extremos ($f(a)$ y $f(b)$ de signos contrarios).'
            }
          ]
        },
        {
          id: 'lim-sec-4',
          title: '6.4 Métodos Especializados de Evaluación, Demostración y Continuidad',
          formulas: [
            {
              code: '6.4.1',
              kind: 'method',
              name: 'Definición Formal $\\varepsilon$-$\\delta$ (Cauchy-Weierstrass), Límites Laterales y Tabla Numérica',
              latex: '\\lim_{x \\to a} f(x) = L \\iff \\forall \\varepsilon > 0,\\; \\exists \\delta > 0 :\\; 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon',
              variables: 'Donde $\\varepsilon > 0$ es la tolerancia vertical alrededor de $L$ y $\\delta > 0$ es el radio horizontal perforado alrededor de $a$.',
              steps: [
                'Sustitución y laterales: prueba primero $x = a$; en funciones por partes, valores absolutos $|x - a|$ o bordes, calcula por separado $x \\to a^-$ y $x \\to a^+$ (o estima con $a \\pm 0.001$).',
                'Borrador $\\varepsilon$-$\\delta$ (ingeniería inversa): factoriza $|f(x) - L|$ hasta aislar $|x - a| \\cdot M$ (si aparece otro factor con $x$, acótalo imponiendo $|x - a| < 1$).',
                'Elección formal: define $\\delta = \\varepsilon / K$ (o $\\delta = \\min(1, \\varepsilon / M)$) y encadena las desigualdades desde $0 < |x - a| < \\delta$ hasta $|f(x) - L| < \\varepsilon$.'
              ],
              conditions: 'Recuerda que en el límite $x$ se acerca a $a$ pero $x \\neq a$ ($0 < |x - a|$): el valor aislado $f(a)$ nunca altera el valor del límite.'
            },
            {
              code: '6.4.2',
              kind: 'method',
              name: 'Cambio de Variable Racionalizador ($u = \\sqrt[n]{g(x)}$) y Traslación al Origen ($h = x - a$)',
              latex: 'u = \\sqrt[n]{g(x)} \\quad (\\text{elimina radicales}) \\qquad \\quad x = a + h \\implies \\lim_{x \\to a} f(x) = \\lim_{h \\to 0} f(a + h)',
              variables: 'Donde $u$ convierte expresiones con raíces cúbicas o mixtas en polinomios racionales, y $h = x - a$ traslada cualquier punto $a \\neq 0$ al origen $h \\to 0$.',
              steps: [
                'Cambio racionalizador: define $u = \\sqrt[n]{g(x)}$, despeja $x$ en términos de $u$, calcula el nuevo destino $u_0 = \\sqrt[n]{g(a)}$ y factoriza el polinomio en $u$.',
                'Traslación al origen: si $a \\neq 0$ (ej. $x \\to \\pi/2$ en límites trigonométricos o polinomios desplazados), sustituye $x = a + h$ con $h \\to 0$.',
                'Simplifica cancelando el factor común ($u - u_0$ o $h$) y evalúa por sustitución directa.'
              ],
              conditions: 'Indispensable en indeterminaciones $\\frac{0}{0}$ con raíces cúbicas/cuartas ($\\sqrt[3]{x} - 2$) o límites trigonométricos que no tienden a $0$.'
            },
            {
              code: '6.4.3',
              kind: 'method',
              name: 'Límites al Infinito: División por $x^m$, Términos Dominantes, $t = -x$ e Inversión $u = 1/x$',
              latex: '\\sqrt{x^2} = |x| = \\begin{cases} +x, & x \\to +\\infty \\\\ -x, & x \\to -\\infty \\end{cases} \\qquad x = -t\\;(t \\to +\\infty) \\qquad x = \\frac{1}{u}\\;(u \\to 0)',
              variables: 'Donde $x^m$ es la mayor potencia del denominador, $t = -x > 0$ evita errores de signo en $-\\infty$, y $u = 1/x$ convierte límites al infinito en límites en $0$.',
              steps: [
                'Método formal: divide todos los términos de numerador y denominador por la mayor potencia $x^m$ del denominador y aplica $\\lim_{x \\to \\pm\\infty} \\frac{c}{x^k} = 0$.',
                'Atajo y raíces en $-\\infty$: conserva solo los términos líderes; si $x \\to -\\infty$ y hay raíces cuadradas, haz $t = -x \\to +\\infty$ para jamás olvidar $\\sqrt{x^2} = -x$.',
                'Inversión $u = 1/x$: en expresiones como $x\\,\\text{sen}(1/x)$, cambia $x = 1/u$ ($u \\to 0$) y aplica límites notables en el origen.'
              ],
              conditions: 'Atención: para indeterminaciones $\\infty - \\infty$ con radicales, racionaliza primero multiplicando por el conjugado para llevar a $\\frac{\\infty}{\\infty}$.'
            },
            {
              code: '6.4.4',
              kind: 'method',
              name: 'Test de Signos para Asíntotas Verticales ($k / 0^\\pm$) frente a Huecos Removibles',
              latex: '\\lim_{x \\to a^\\pm} \\frac{P(x)}{Q(x)} = \\frac{k}{0^\\pm} = \\pm\\infty \\;\\;(k \\neq 0) \\qquad \\text{vs. hueco removible si } \\frac{0}{0} \\to L \\in \\mathbb{R}',
              variables: 'Donde $a$ es un cero del denominador ($Q(a) = 0$) y $k = P(a)$ el valor del numerador en dicho punto.',
              steps: [
                'Resuelve $Q(x) = 0$ para listar todos los candidatos a discontinuidad vertical.',
                'Evalúa $P(a)$: si $P(a) = 0$, factoriza y cancela $(x - a)$ primero para determinar si queda un hueco removible o persiste una asíntota.',
                'Si $P(a) = k \\neq 0$, analiza el signo del numerador y del denominador en $a - 0.01$ y $a + 0.01$ para concluir si cada rama diverge a $+\\infty$ o $-\\infty$.'
              ],
              conditions: 'Un denominador que se anula solo garantiza asíntota vertical si tras simplificar el numerador permanece distinto de cero.'
            },
            {
              code: '6.4.5',
              kind: 'method',
              name: 'Teorema del Sándwich (Acotamiento) y Ruta de Ángulo Medio para $1 - \\cos(kx)$',
              latex: 'g(x) \\le f(x) \\le h(x) \\;\\text{ y }\\; \\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L \\implies \\lim_{x \\to a} f(x) = L \\qquad 1 - \\cos(kx) = 2\\,\\text{sen}^2\\!\\left(\\frac{kx}{2}\\right)',
              variables: 'Donde $g(x)$ y $h(x)$ son funciones envolventes (cota inferior y superior) alrededor de $f(x)$ cerca de $a$.',
              steps: [
                'Acotamiento (Sándwich): para factores oscilantes como $x^n\\,\\text{sen}(1/x)$, parte de $-1 \\le \\text{sen}(\\cdot) \\le 1$, multiplica por $|x^n|$ y toma el límite de ambos extremos.',
                'Completar argumento: en cocientes con $\\text{sen}(ax)$ o $\\tan(ax)$, multiplica y divide por $a$ para formar $\\frac{\\text{sen}(u)}{u} \\to 1$.',
                'Para $1 - \\cos(kx)$: usa el conjugado $(1 + \\cos(kx))$ o sustituye directo $1 - \\cos(kx) = 2\\,\\text{sen}^2(kx/2)$ antes de dividir entre $x^2$.'
              ],
              conditions: 'El ángulo en todos los límites trigonométricos debe medirse obligatoriamente en radianes ($\\text{rad}$).'
            },
            {
              code: '6.4.6',
              kind: 'method',
              name: 'Protocolo de Continuidad por Partes y Reparación de Discontinuidades',
              latex: '\\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = f(a) \\implies \\text{sistema algebraico para parámetros continuos}',
              variables: 'Donde $x = a$ es el punto de empalme entre ramas de una función definida a trozos o el punto con hueco removible.',
              steps: [
                'Evalúa $f(a)$ en la rama que contiene el signo $\\le$ o $\\ge$ (o escribe su expresión en función de los parámetros $c, k$).',
                'Calcula el límite lateral izquierdo $\\lim_{x \\to a^-} f(x)$ con la rama $x < a$ y el límite derecho $\\lim_{x \\to a^+} f(x)$ con la rama $x > a$.',
                'Iguala $L^- = L^+ = f(a)$ para despejar los parámetros que garantizan continuidad; en huecos removibles, define $f(a) = L$.'
              ],
              conditions: 'Si $L^- \\neq L^+$ la discontinuidad es de salto (irreparable); si alguno es $\\pm\\infty$, es discontinuidad esencial infinita.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       7. FORMULARIO DE DERIVADAS (Fórmulas y Métodos de Resolución)
       ====================================================================== */
    {
      id: 'derivadas',
      moduleNumber: 7,
      name: 'Formulario de Derivadas y Reglas de Derivación',
      shortName: 'Derivadas',
      symbol: "f'(x)",
      color: '#9333EA',
      levelTag: 'Cálculo Diferencial',
      description: 'Definición formal, reglas de derivación, funciones trascendentes e inversas, derivación implícita y logarítmica, derivadas laterales, linealización, extremos absolutos, optimización y polinomios de Taylor.',
      sections: [
        {
          id: 'der-sec-1',
          title: '7.1 Definición Formal y Reglas Algebraicas Básicas',
          formulas: [
            {
              code: '7.1.1',
              name: 'Definición de la Derivada mediante el Límite del Cociente Incremental',
              latex: "f'(x) = \\frac{dy}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} = \\lim_{t \\to x} \\frac{f(t) - f(x)}{t - x}",
              variables: 'Donde $h = \\Delta x$ es el incremento infinitesimal de la variable independiente y $f\'(x)$ representa la tasa de variación instantánea y la pendiente de la recta tangente en $(x, f(x))$.',
              conditions: 'La función es derivable en $x$ si este límite existe y es finito. Toda función derivable en $x$ es necesariamente continua en $x$, pero el recíproco no siempre es cierto.'
            },
            {
              code: '7.1.2',
              name: 'Reglas de la Constante, Identidad, Potencia y Múltiplo Constante',
              latex: "\\frac{d}{dx}[c] = 0 \\qquad \\frac{d}{dx}[x] = 1 \\qquad \\frac{d}{dx}\\left[x^n\\right] = n x^{n-1} \\qquad \\frac{d}{dx}\\Big[ c \\cdot f(x) \\Big] = c \\cdot f'(x)",
              variables: 'Donde $c \\in \\mathbb{R}$ es una constante y $n \\in \\mathbb{R}$ es cualquier exponente real (positivo, negativo o fraccionario).',
              conditions: 'Válida para todo $x$ en el dominio de $x^n$. Si $n < 1$, $x=0$ queda excluido del dominio de la derivada.'
            },
            {
              code: '7.1.3',
              name: 'Regla de la Suma, Resta, Producto y Cociente',
              latex: "(u \\pm v)' = u' \\pm v' \\qquad (u \\cdot v)' = u'v + uv' \\qquad \\left( \\frac{u}{v} \\right)' = \\frac{u'v - uv'}{v^2}",
              variables: 'Donde $u = u(x)$ y $v = v(x)$ son funciones diferenciables respecto a $x$.',
              conditions: 'En la regla del cociente se requiere indispensablemente que $v(x) \\neq 0$ en el punto de evaluación.'
            },
            {
              code: '7.1.4',
              name: 'Regla de la Cadena para Funciones Compuestas',
              latex: "\\frac{d}{dx}\\Big[ f(g(x)) \\Big] = f'(g(x)) \\cdot g'(x) \\qquad \\quad \\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
              variables: 'Donde $u = g(x)$ es la función interna diferenciable en $x$, y $y = f(u)$ es la función externa diferenciable en $u$.',
              conditions: 'Regla de la potencia generalizada: $\\frac{d}{dx}[u(x)^n] = n \\cdot u(x)^{n-1} \\cdot u\'(x)$.'
            }
          ]
        },
        {
          id: 'der-sec-2',
          title: '7.2 Derivadas de Funciones Exponenciales y Logarítmicas',
          formulas: [
            {
              code: '7.2.1',
              name: 'Derivadas de Funciones Exponenciales (Base Natural y Base Arbitraria)',
              latex: "\\frac{d}{dx}\\left[ e^u \\right] = e^u \\cdot u' \\qquad \\quad \\frac{d}{dx}\\left[ a^u \\right] = a^u \\cdot \\ln(a) \\cdot u'",
              variables: 'Donde $u = u(x)$ es una función diferenciable de $x$, $e \\approx 2.71828$ y $a > 0$ con $a \\neq 1$.',
              conditions: 'Puesto que $\\ln(e) = 1$, la derivada de $e^x$ es exactamente ella misma: $\\frac{d}{dx}[e^x] = e^x$.'
            },
            {
              code: '7.2.2',
              name: 'Derivadas de Funciones Logarítmicas (Logaritmo Natural y Base Arbitraria)',
              latex: "\\frac{d}{dx}\\Big[ \\ln|u| \\Big] = \\frac{u'}{u} \\qquad \\quad \\frac{d}{dx}\\Big[ \\log_a(u) \\Big] = \\frac{u'}{u \\cdot \\ln(a)}",
              variables: 'Donde $u = u(x)$ es el argumento logarítmico diferenciable y $a > 0, a \\neq 1$.',
              conditions: 'Condición de existencia: $u(x) \\neq 0$ en el logaritmo de valor absoluto $\\ln|u|$, y $u(x) > 0$ en $\\log_a(u)$.'
            }
          ]
        },
        {
          id: 'der-sec-3',
          title: '7.3 Derivadas de Funciones Trigonométricas Directas e Inversas',
          formulas: [
            {
              code: '7.3.1',
              name: 'Derivadas del Seno, Coseno y Tangente',
              latex: "\\frac{d}{dx}[\\text{sen}(u)] = \\cos(u) \\cdot u' \\qquad \\frac{d}{dx}[\\cos(u)] = -\\text{sen}(u) \\cdot u' \\qquad \\frac{d}{dx}[\\tan(u)] = \\sec^2(u) \\cdot u'",
              variables: 'Donde $u = u(x)$ es el ángulo angular diferenciable en radianes.',
              conditions: 'Para la tangente se exige $u(x) \\neq \\frac{\\pi}{2} + k\\pi$ con $k \\in \\mathbb{Z}$ (donde $\\cos(u) \\neq 0$).'
            },
            {
              code: '7.3.2',
              name: 'Derivadas de Cotangente, Secante y Cosecante',
              latex: "\\frac{d}{dx}[\\cot(u)] = -\\csc^2(u) \\cdot u' \\qquad \\frac{d}{dx}[\\sec(u)] = \\sec(u)\\tan(u) \\cdot u' \\qquad \\frac{d}{dx}[\\csc(u)] = -\\csc(u)\\cot(u) \\cdot u'",
              variables: 'Donde $u = u(x)$ es el argumento angular en radianes y $u\'$ su derivada.',
              conditions: 'Regla mnemotécnica de signos: todas las co-funciones trigonométricas (coseno, cotangente y cosecante) tienen signo negativo en su derivada.'
            },
            {
              code: '7.3.3',
              name: 'Derivadas de Funciones Trigonométricas Inversas (Arcoseno y Arcocoseno)',
              latex: "\\frac{d}{dx}[\\text{arcsen}(u)] = \\frac{u'}{\\sqrt{1 - u^2}} \\qquad \\quad \\frac{d}{dx}[\\arccos(u)] = -\\frac{u'}{\\sqrt{1 - u^2}}",
              variables: 'Donde $u = u(x)$ es el argumento en el dominio principal $[-1, 1]$.',
              conditions: 'Condición de diferenciabilidad estricta: $-1 < u(x) < 1$ (en $u = \\pm 1$ la tangente a la curva es vertical y la derivada no está definida).'
            },
            {
              code: '7.3.4',
              name: 'Derivadas de Funciones Trigonométricas Inversas (Arcotangente y Arcocotangente)',
              latex: "\\frac{d}{dx}[\\arctan(u)] = \\frac{u'}{1 + u^2} \\qquad \\quad \\frac{d}{dx}[\\text{arccot}(u)] = -\\frac{u'}{1 + u^2}",
              variables: 'Donde $u = u(x)$ es cualquier función diferenciable de $x$.',
              conditions: 'Válidas para todo $u \\in \\mathbb{R}$, ya que el denominador $1 + u^2 > 0$ jamás se anula en los reales.'
            }
          ]
        },
        {
          id: 'der-sec-4',
          title: '7.4 Derivación Implícita y Derivadas de Orden Superior',
          formulas: [
            {
              code: '7.4.1',
              name: 'Método de Derivación Implícita para Relaciones $F(x, y) = 0$',
              latex: "\\frac{d}{dx}\\Big[ F(x, y) \\Big] = 0 \\implies \\frac{\\partial F}{\\partial x} + \\frac{\\partial F}{\\partial y}\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{F_x}{F_y}",
              variables: 'Donde $y = y(x)$ está definida implícitamente por una ecuación y cada término que contiene $y$ se deriva aplicando la regla de la cadena: $\\frac{d}{dx}[y^n] = n y^{n-1} \\frac{dy}{dx}$.',
              conditions: 'Condición: $F_y = \\frac{\\partial F}{\\partial y} \\neq 0$. Permite calcular tangentes a curvas cónicas (circunferencias, elipses, hipérbolas).'
            },
            {
              code: '7.4.2',
              name: 'Derivadas de Orden Superior (Segunda Derivada y Enésima Derivada)',
              latex: "f''(x) = \\frac{d^2 y}{dx^2} = \\frac{d}{dx}\\left( \\frac{dy}{dx} \\right) \\qquad \\quad f^{(n)}(x) = \\frac{d^n y}{dx^n} = \\frac{d}{dx}\\Big[ f^{(n-1)}(x) \\Big]",
              variables: 'Donde $f\'\'(x)$ representa la tasa de cambio de la pendiente (aceleración física y curvatura/concavidad geométrica).',
              conditions: 'Para que exista la $n$-ésima derivada, todas las derivadas previas de orden $1, 2, \\dots, n-1$ deben ser continuas y derivables en el intervalo.'
            },
            {
              code: '7.4.3',
              name: 'Derivación Logarítmica para Funciones Tipo Potencial-Exponencial $y = u(x)^{v(x)}$',
              latex: "y = u(x)^{v(x)} \\implies \\ln(y) = v(x)\\ln(u(x)) \\implies \\frac{y'}{y} = v'(x)\\ln(u(x)) + \\frac{v(x)u'(x)}{u(x)}",
              variables: 'Donde tanto la base $u(x)$ como el exponente $v(x)$ son variables que dependen de $x$.',
              conditions: 'Condición indispensable: la base debe ser estrictamente positiva ($u(x) > 0$). Se despeja $y\' = y \\cdot [\\dots]$.'
            }
          ]
        },
        {
          id: 'der-sec-5',
          title: '7.5 Métodos Estratégicos de Derivación, Aproximación y Optimización',
          formulas: [
            {
              code: '7.5.1',
              kind: 'method',
              name: 'Derivadas Laterales, Diferenciación Numérica Centrada y Linealización $L(x)$',
              latex: "f'_-(a) = f'_+(a) \\qquad \\quad f'(x_0) \\approx \\frac{f(x_0 + h) - f(x_0 - h)}{2h} \\qquad \\quad L(x) = f(x_0) + f'(x_0)(x - x_0)",
              variables: 'Donde $f\'_-(a), f\'_+(a)$ son las pendientes laterales en puntos de quiebre, $h$ un paso pequeño (ej. $0.001$) y $L(x)$ la aproximación lineal tangente en $x_0$.',
              steps: [
                'En funciones a trozos o valores absolutos $|x - a|$, calcula por separado las derivadas laterales $f\'_-(a)$ y $f\'_+(a)$; solo si coinciden y son finitas existe $f\'(a)$.',
                'Para comprobar cualquier derivada simbólica en un punto $x_0$, evalúa el cociente centrado $\\frac{f(x_0 + 0.001) - f(x_0 - 0.001)}{0.002}$.',
                'Para estimar $f(x_0 + \\Delta x)$ cerca de $x_0$, construye la recta tangente $L(x)$ o usa el diferencial $dy = f\'(x_0)\\,dx$.'
              ],
              conditions: 'La linealización es más precisa cuanto más pequeño sea $|x - x_0|$. En picos o cúspides ($|x - a|$ en $x = a$), $f$ es continua pero NO derivable.'
            },
            {
              code: '7.5.2',
              kind: 'method',
              name: 'Reescritura a Potencias ($a x^n$), Cociente como Producto ($u \\cdot v^{-1}$) y Sustitución de Leibniz',
              latex: "\\frac{c}{g(x)} = c\\,[g(x)]^{-1} \\implies \\left(\\frac{c}{g}\\right)' = -\\frac{c\\,g'(x)}{[g(x)]^2} \\qquad \\quad \\frac{u}{v} = u \\cdot v^{-1}",
              variables: 'Donde $c \\in \\mathbb{R}$ es una constante, $g(x) \\neq 0$ y $u, v$ son funciones diferenciables.',
              steps: [
                'Antes de derivar radicales ($\\sqrt[n]{x^m}$) o cocientes con denominador monómico ($\\frac{x^3 + 2x}{x}$), reescríbelos como suma de potencias $a x^n$ y aplica la regla de potencia.',
                'Si el numerador es constante ($c / g(x)$), evita la regla del cociente usando $c\\,[g(x)]^{-1}$ con regla de la cadena.',
                'En funciones compuestas profundas, bautiza $u = g(x)$ y aplica la notación de Leibniz $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$ capa por capa.'
              ],
              conditions: 'Al aplicar la regla del cociente $\\frac{u\'v - uv\'}{v^2}$ suele convenir NO desarrollar $v^2$ y factorizar factores comunes del numerador.'
            },
            {
              code: '7.5.3',
              kind: 'method',
              name: 'Expansión Previa de Logaritmos y Atajos de Derivación Implícita ($-F_x / F_y$ en un Punto)',
              latex: "\\frac{d}{dx}\\left[\\ln\\!\\left(\\frac{A^p \\cdot B^q}{C^r}\\right)\\right] = p\\,\\frac{A'}{A} + q\\,\\frac{B'}{B} - r\\,\\frac{C'}{C} \\qquad \\quad \\left.\\frac{dy}{dx}\\right|_{(x_0, y_0)} = -\\frac{F_x(x_0, y_0)}{F_y(x_0, y_0)}",
              variables: 'Donde $A, B, C$ son expresiones diferenciables positivas, $p, q, r \\in \\mathbb{R}$, y $F(x, y) = 0$ es una curva implícita evaluada en $(x_0, y_0)$.',
              steps: [
                'Antes de derivar $\\ln(\\text{productos/cocientes/raíces})$, expande primero con las leyes de logaritmos y deriva cada término simple como $\\frac{u\'}{u}$.',
                'Para derivar productos largos o $y = u(x)^{v(x)}$, toma $\\ln$ en ambos lados (derivación logarítmica) y despeja $y\' = y \\cdot [\\dots]$.',
                'En derivación implícita, si solo te piden la pendiente numérica en $(x_0, y_0)$, sustituye $x = x_0, y = y_0$ inmediatamente después de derivar (o aplica $-F_x / F_y$).'
              ],
              conditions: 'En la expansión logarítmica requiere $A, B, C > 0$ (o valor absoluto); en implícita requiere $F_y(x_0, y_0) \\neq 0$.'
            },
            {
              code: '7.5.4',
              kind: 'method',
              name: 'Método de Extremos Absolutos en $[a, b]$ (Competencia de Fronteras y Puntos Críticos)',
              latex: '\\max_{[a, b]} f = \\max\\big\\{f(a),\\; f(b),\\; f(c_1), \\dots, f(c_k)\\big\\}, \\qquad \\min_{[a, b]} f = \\min\\big\\{f(a),\\; f(b),\\; f(c_1), \\dots, f(c_k)\\big\\}',
              variables: 'Donde $f$ es continua en el intervalo cerrado $[a, b]$ y $c_1, \\dots, c_k \\in (a, b)$ son los puntos críticos interiores ($f\'(c_i) = 0$ o $\\nexists f\'(c_i)$).',
              steps: [
                'Calcula $f\'(x)$ y encuentra todos los puntos críticos que caigan ESTRICTAMENTE dentro del intervalo abierto $(a, b)$.',
                'Evalúa la función original $f(x)$ tanto en los puntos críticos interiores $c_i$ como en los extremos de frontera $a$ y $b$.',
                'Compara todos los valores obtenidos: el mayor es el máximo absoluto y el menor es el mínimo absoluto (Teorema de Weierstrass).'
              ],
              conditions: 'Válido si $f$ es continua en $[a, b]$. Descarta siempre cualquier punto crítico que quede fuera de $[a, b]$.'
            },
            {
              code: '7.5.5',
              kind: 'method',
              name: 'Protocolo de Optimización Aplicada y Comprobación por Vértice / Desigualdad MA–MG',
              latex: "M(x, y) \\xrightarrow{g(x, y) = k} M(x) \\implies M'(x_0) = 0 \\qquad \\quad \\frac{u + v}{2} \\ge \\sqrt{u \\cdot v} \\;\\;(\\text{igualdad si } u = v)",
              variables: 'Donde $M(x, y)$ es la magnitud objetivo a maximizar/minimizar, $g(x, y) = k$ la ecuación de restricción y $u, v > 0$.',
              steps: [
                'Plantea la función objetivo $M(x, y)$ y la restricción $g(x, y) = k$; despeja una variable para dejar $M(x)$ en una sola variable con su dominio físico.',
                'Resuelve $M\'(x) = 0$ para hallar el punto crítico $x_0$ y clasifícalo con el criterio de la 1.ª o 2.ª derivada ($M\'\'(x_0) < 0$ máximo, $> 0$ mínimo).',
                'Comprobación rápida: en modelos cuadráticos verifica con el vértice $x = -b/(2a)$; en productos con suma fija ($u + v = C$) comprueba con MA–MG ($u = v = C/2$).'
              ],
              conditions: 'Verifica siempre que el valor óptimo $x_0$ pertenezca al dominio geométrico o físico permitido (ej. longitudes positivas).'
            },
            {
              code: '7.5.6',
              kind: 'method',
              name: 'Aproximación Polinomial de Taylor y Maclaurin de Orden $n$',
              latex: "P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}\\,(x - a)^k = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^2 + \\dots + \\frac{f^{(n)}(a)}{n!}(x - a)^n",
              variables: 'Donde $a$ es el centro de expansión (si $a = 0$ se llama polinomio de Maclaurin) y $f^{(k)}(a)$ es la $k$-ésima derivada evaluada en $a$.',
              steps: [
                'Calcula las derivadas sucesivas $f(x), f\'(x), f\'\'(x), \\dots, f^{(n)}(x)$ y evalúa cada una en el centro $x = a$.',
                'Divide cada valor $f^{(k)}(a)$ entre $k!$ y multiplícalo por $(x - a)^k$.',
                'Suma los términos desde $k = 0$ hasta $n$; para $n = 1$ recuperas la linealización tangente $L(x)$.'
              ],
              conditions: 'Exige que $f$ sea $n$ veces derivable en $a$. Series de Maclaurin célebres: $e^x \\approx 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!}$, $\\text{sen}(x) \\approx x - \\frac{x^3}{3!}$, $\\cos(x) \\approx 1 - \\frac{x^2}{2!}$.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       8. FORMULARIO DE INTEGRALES (Fórmulas y Métodos de Resolución)
       ====================================================================== */
    {
      id: 'integrales',
      moduleNumber: 8,
      name: 'Formulario de Integrales Indefinidas, Métodos y Definidas',
      shortName: 'Integrales',
      symbol: '∫',
      color: '#059669',
      levelTag: 'Cálculo Integral',
      description: 'Antiderivación inmediata, linealidad, sustitución (directa y radical), integración por partes (ILATE, método tabular DI y coeficientes indeterminados), fracciones parciales, sustitución trigonométrica, simetría, Trapecio/Simpson e integrales impropias.',
      sections: [
        {
          id: 'int-sec-1',
          title: '8.1 Linealidad e Integrales Inmediatas (Potencias, Exponenciales y Logarítmicas)',
          formulas: [
            {
              code: '8.1.1',
              name: 'Propiedades de Linealidad del Operador Integral Indefinido',
              latex: '\\int k \\cdot f(x)\\,dx = k \\int f(x)\\,dx \\qquad \\quad \\int \\Big[ f(x) \\pm g(x) \\Big]\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx',
              variables: 'Donde $k \\in \\mathbb{R}$ es una constante escalar no nula y $f, g$ son funciones integrables.',
              conditions: 'La integral de una combinación lineal es igual a la combinación lineal de las integrales individuales.'
            },
            {
              code: '8.1.2',
              name: 'Regla de la Potencia para Integrales y Caso Logarítmico Fundamental',
              latex: '\\int u^n\\,du = \\frac{u^{n+1}}{n + 1} + C \\quad (n \\neq -1) \\qquad \\quad \\int \\frac{1}{u}\\,du = \\int \\frac{u\'}{u}\\,dx = \\ln|u| + C',
              variables: 'Donde $u = u(x)$, $du = u\'(x)dx$, $n \\in \\mathbb{R}$ es un exponente constante y $C$ es la constante de integración.',
              conditions: 'Cuando $n = -1$, la división entre $n+1 = 0$ está indefinida, dando origen a la primitiva logarítmica con valor absoluto $\\ln|u| + C$ ($u \\neq 0$).'
            },
            {
              code: '8.1.3',
              name: 'Integrales de Funciones Exponenciales (Base Natural y Base General)',
              latex: '\\int e^u\\,du = e^u + C \\qquad \\quad \\int a^u\\,du = \\frac{a^u}{\\ln(a)} + C',
              variables: 'Donde $u = u(x)$ es la función exponente, $e \\approx 2.71828$ y $a > 0$ con $a \\neq 1$.',
              conditions: 'Condición: $a \\neq 1$. Se deriva de $\\frac{d}{dx}[a^u] = a^u \\ln(a) u\'$.'
            }
          ]
        },
        {
          id: 'int-sec-2',
          title: '8.2 Integrales Trigonométricas Directas y Recíprocas',
          formulas: [
            {
              code: '8.2.1',
              name: 'Integrales Inmediatas del Seno y del Coseno',
              latex: '\\int \\text{sen}(u)\\,du = -\\cos(u) + C \\qquad \\quad \\int \\cos(u)\\,du = \\text{sen}(u) + C',
              variables: 'Donde $u = u(x)$ y $du = u\'(x)dx$ con el ángulo en radianes.',
              conditions: 'Atención a los signos opuestos: la derivada de $\\text{sen}(x)$ es $\\cos(x)$, pero la integral de $\\text{sen}(x)$ es $-\\cos(x) + C$.'
            },
            {
              code: '8.2.2',
              name: 'Integrales de Tangente, Cotangente, Secante y Cosecante',
              latex: '\\int \\tan(u)\\,du = \\ln|\\sec(u)| + C \\qquad \\quad \\int \\cot(u)\\,du = \\ln|\\text{sen}(u)| + C',
              variables: 'Donde $u$ está medido en radianes y la constante de integración es $C$.',
              conditions: 'También se escribe $\\int \\tan(u)\\,du = -\\ln|\\cos(u)| + C$. Se obtienen por sustitución simple mediante $u = \\cos(x)$ o $u = \\text{sen}(x)$.'
            },
            {
              code: '8.2.3',
              name: 'Integrales de Secante y Cosecante',
              latex: '\\int \\sec(u)\\,du = \\ln|\\sec(u) + \\tan(u)| + C \\qquad \\int \\csc(u)\\,du = -\\ln|\\csc(u) + \\cot(u)| + C',
              variables: 'Donde $u = u(x)$ y $du = u\'(x)dx$.',
              conditions: 'Formas alternativas equivalentes: $\\int \\sec(u)\\,du = \\ln|\\tan(\\frac{u}{2} + \\frac{\\pi}{4})| + C$ y $\\int \\csc(u)\\,du = \\ln|\\tan(\\frac{u}{2})| + C$.'
            },
            {
              code: '8.2.4',
              name: 'Integrales Cuadráticas de Funciones Trigonométricas Inmediatas',
              latex: '\\int \\sec^2(u)\\,du = \\tan(u) + C \\qquad \\int \\csc^2(u)\\,du = -\\cot(u) + C \\qquad \\int \\sec(u)\\tan(u)\\,du = \\sec(u) + C',
              variables: 'Donde $u$ es el argumento angular en radianes.',
              conditions: 'Corresponden a las derivadas directas de las funciones trigonométricas $\\tan(u)$, $\\cot(u)$ y $\\sec(u)$.'
            }
          ]
        },
        {
          id: 'int-sec-3',
          title: '8.3 Integrales que Resultan en Funciones Trigonométricas Inversas',
          formulas: [
            {
              code: '8.3.1',
              name: 'Integrales de Formas Cuadráticas: Arcoseno y Arcotangente',
              latex: '\\int \\frac{du}{\\sqrt{a^2 - u^2}} = \\text{arcsen}\\left(\\frac{u}{a}\\right) + C \\qquad \\quad \\int \\frac{du}{a^2 + u^2} = \\frac{1}{a} \\arctan\\left(\\frac{u}{a}\\right) + C',
              variables: 'Donde $a > 0$ es una constante real positiva y $u = u(x)$ la variable o función cuadrática.',
              conditions: 'En el arcoseno se requiere $|u| < a$. Nótese la presencia del factor $\\frac{1}{a}$ en la arcotangente y su ausencia en el arcoseno.'
            },
            {
              code: '8.3.2',
              name: 'Integral de Forma Cuadrática con Raíz: Arcosecante',
              latex: '\\int \\frac{du}{u\\sqrt{u^2 - a^2}} = \\frac{1}{a} \\text{arcsec}\\left(\\frac{|u|}{a}\\right) + C = \\frac{1}{a} \\arccos\\left(\\frac{a}{|u|}\\right) + C',
              variables: 'Donde $a > 0$ es una constante real fija y $|u| > a$.',
              conditions: 'El valor absoluto en $|u|$ garantiza el dominio real dentro y fuera de la raíz cuadrada.'
            }
          ]
        },
        {
          id: 'int-sec-4',
          title: '8.4 Métodos Avanzados: Sustitución, Partes, Fracciones Parciales y Sustitución Trigonométrica',
          formulas: [
            {
              code: '8.4.1',
              name: 'Método de Integración por Sustitución (Cambio de Variable)',
              latex: '\\int f(g(x)) \\cdot g\'(x)\\,dx = \\int f(u)\\,du \\qquad \\text{donde } u = g(x), \\quad du = g\'(x)\\,dx',
              variables: 'Donde $u = g(x)$ es la nueva variable de integración y $du$ absorbe la derivada de la función interna.',
              conditions: 'Si la integral es definida, deben cambiarse los límites de integración: $\\int_a^b f(g(x))g\'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du$.'
            },
            {
              code: '8.4.2',
              name: 'Método de Integración por Partes (Fórmula ILATE)',
              latex: '\\int u\\,dv = u \\cdot v - \\int v\\,du \\qquad \\quad \\int_a^b u\\,dv = \\Big[ u \\cdot v \\Big]_a^b - \\int_a^b v\\,du',
              variables: 'Donde $u$ se elige para derivar según la jerarquía ILATE (Inversas, Logarítmicas, Algebraicas, Trigonométricas, Exponenciales), y $dv$ para integrar.',
              conditions: 'Tanto $u(x)$ como $v(x)$ deben poseer derivadas continuas en el intervalo de integración.'
            },
            {
              code: '8.4.3',
              name: 'Método de Descomposición en Fracciones Parciales',
              latex: '\\frac{P(x)}{Q(x)} = \\frac{A_1}{a_1 x + b_1} + \\dots + \\frac{A_k}{(a x + b)^k} + \\frac{B x + C}{a x^2 + b x + c}',
              variables: 'Donde $P(x)/Q(x)$ es una función racional propia ($\\text{gr}(P) < \\text{gr}(Q)$) factorizada en términos lineales y cuadráticos irreducibles.',
              conditions: 'Si $\\text{gr}(P) \\ge \\text{gr}(Q)$, debe efectuarse primero la división de polinomios: $\\frac{P(x)}{Q(x)} = C(x) + \\frac{R(x)}{Q(x)}$.'
            },
            {
              code: '8.4.4',
              name: 'Guía de Sustituciones Trigonométricas para Radicales Cuadráticos',
              latex: '\\begin{cases} \\sqrt{a^2 - x^2} & \\implies x = a\\,\\text{sen}(\\theta), & dx = a\\cos(\\theta)d\\theta, & \\sqrt{a^2-x^2} = a\\cos(\\theta) \\\\ \\sqrt{a^2 + x^2} & \\implies x = a\\tan(\\theta), & dx = a\\sec^2(\\theta)d\\theta, & \\sqrt{a^2+x^2} = a\\sec(\\theta) \\\\ \\sqrt{x^2 - a^2} & \\implies x = a\\sec(\\theta), & dx = a\\sec(\\theta)\\tan(\\theta)d\\theta, & \\sqrt{x^2-a^2} = a\\tan(\\theta) \\end{cases}',
              variables: 'Donde $a > 0$ es la constante del cateto o hipotenusa y $\\theta$ es el ángulo del triángulo auxiliar.',
              conditions: 'Permite transformar integrales algebraicas con raíces de segundo grado en integrales trigonométricas inmediatas mediante identidades pitagóricas.'
            }
          ]
        },
        {
          id: 'int-sec-5',
          title: '8.5 Estrategias Avanzadas de Integración, Simetría e Integración Numérica',
          formulas: [
            {
              code: '8.5.1',
              kind: 'method',
              name: 'Reescritura Algebraica Previa, Constante $C$ por Condición Inicial y Verificación',
              latex: "\\int \\frac{A + B}{x^k}\\,dx = \\int A x^{-k}\\,dx + \\int B x^{-k}\\,dx \\qquad F(x) = y_0 + \\int_{x_0}^{x} f(t)\\,dt \\qquad F'(x) = f(x)",
              variables: 'Donde $F(x)$ es la antiderivada particular que satisface el problema de valor inicial $F(x_0) = y_0$.',
              steps: [
                'Antes de integrar, reescribe radicales como $x^{m/n}$, sube potencias del denominador como $x^{-k}$, separa fracciones con denominador monómico y desarrolla productos sencillos.',
                'Si conoces una condición inicial $F(x_0) = y_0$, sustitúyela en $F(x) = F_0(x) + C$ para despejar $C = y_0 - F_0(x_0)$ (o integra directo desde $x_0$ hasta $x$).',
                'Prueba SIEMPRE tu antiderivada derivándola término a término y comprobando que recuperas exactamente el integrando $f(x)$.'
              ],
              conditions: 'Nunca olvides sumar $+C$ en toda integral indefinida; en el cociente monómico exige $x \\neq 0$.'
            },
            {
              code: '8.5.2',
              kind: 'method',
              name: 'Sustitución Radical Completa ($t = \\sqrt{g(x)}$) y Sustitución Mental Directa',
              latex: "t = \\sqrt{g(x)} \\implies t^2 = g(x) \\implies 2t\\,dt = g'(x)\\,dx",
              variables: 'Donde $t \\ge 0$ absorbe la raíz cuadrada completa para transformar la integral en un simple polinomio en $t$.',
              steps: [
                'Sustitución mental: cuando el integrando tiene la derivada del interior salvo una constante $k$, multiplica por $k$ adentro y por $1/k$ afuera sin cambiar de letra.',
                'Sustitución radical completa: si hay una raíz molesta $\\sqrt{g(x)}$, define $t = \\sqrt{g(x)}$, eleva al cuadrado ($t^2 = g(x)$) y diferencia implícitamente ($2t\\,dt = g\'(x)\\,dx$).',
                'Sustituye la raíz y $dx$, integra el polinomio en $t$ y regresa al final a $t = \\sqrt{g(x)}$.'
              ],
              conditions: 'Requiere $g(x) \\ge 0$ y $g\'(x) \\neq 0$. También generaliza a raíces $n$-ésimas haciendo $t^n = g(x)$.'
            },
            {
              code: '8.5.3',
              kind: 'method',
              name: 'Método Tabular (DI) para Integración por Partes Reiterada y Coeficientes Indeterminados',
              latex: "\\int P(x)\\,g(x)\\,dx = \\sum_{j=0}^{n} (-1)^j P^{(j)}(x)\\,I_{j+1}(x) + C \\qquad F(x) = (Ax + B)e^{kx} \\implies F'(x) = f(x)",
              variables: 'Donde $P(x)$ es un polinomio de grado $n$ (columna D que se deriva hasta $0$) e $I_j(x)$ son las antiderivadas sucesivas de $g(x)$ (columna I).',
              steps: [
                'Método Tabular (DI): en la columna D deriva $u = P(x)$ hasta llegar a $0$; en la columna I integra $dv = g(x)$ en paralelo; multiplica en diagonal bajando con signos alternados $+, -, +, -$.',
                'Coeficientes indeterminados: para $P(x)e^{kx}$ o $P(x)\\cos(kx)$, propón una primitiva de igual estructura (ej. $(Ax + B)e^{kx}$), derívala e iguala coeficientes con el integrando.',
                'En integrales cíclicas ($e^{ax}\\,\\text{sen}(bx)$), aplica partes dos veces y despeja la integral original $I$ de la ecuación resultante.'
              ],
              conditions: 'El método tabular termina en $n + 1$ pasos cuando $u$ es un polinomio de grado $n$ y $dv$ es fácilmente integrable ($e^{kx}, \\text{sen}(kx), \\cos(kx)$).'
            },
            {
              code: '8.5.4',
              kind: 'method',
              name: 'Cambio de Límites en Sustitución Definida y Simetría Par/Impar en $[-a, a]$',
              latex: "\\int_a^b f(g(x))\\,g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du \\qquad \\int_{-a}^{a} f_{\\text{impar}}(x)\\,dx = 0, \\qquad \\int_{-a}^{a} f_{\\text{par}}(x)\\,dx = 2\\int_0^a f_{\\text{par}}(x)\\,dx",
              variables: 'Donde $g(a), g(b)$ son los nuevos límites en la variable $u$, y $[-a, a]$ es un intervalo simétrico respecto al origen.',
              steps: [
                'En integrales definidas por sustitución $u = g(x)$, transforma los límites $x = a \\to u = g(a)$ y $x = b \\to u = g(b)$ y evalúa directo en $u$ sin regresar jamás a $x$.',
                'Si el intervalo es simétrico $[-a, a]$, separa términos impares ($f(-x) = -f(x) \\implies$ integral neta $= 0$) y pares ($f(-x) = f(x) \\implies 2\\int_0^a$).',
                'Protege siempre el segundo término en Barrow entre paréntesis: $F(b) - (F(a))$ para evitar errores de signos.'
              ],
              conditions: '¡Cuidado!: en área geométrica total $\\int_{-a}^a |f(x)|\\,dx$, una función impar NO se anula (da $2\\int_0^a |f(x)|\\,dx$).'
            },
            {
              code: '8.5.5',
              kind: 'method',
              name: 'Área Neta vs. Área Geométrica Total y Métodos Numéricos (Trapecio y Regla de Simpson)',
              latex: 'A_{\\text{total}} = \\int_a^b |f(x)|\\,dx \\qquad T_n = \\frac{\\Delta x}{2}\\!\\left[f_0 + 2\\sum_{i=1}^{n-1} f_i + f_n\\right] \\qquad S_n = \\frac{\\Delta x}{3}\\!\\left[f_0 + 4f_1 + 2f_2 + \\dots + 4f_{n-1} + f_n\\right]',
              variables: 'Donde $\\Delta x = \\frac{b - a}{n}$, $x_i = a + i\\Delta x$ y $f_i = f(x_i)$; en $S_n$ los pesos alternan $1, 4, 2, 4, \\dots, 2, 4, 1$.',
              steps: [
                'Para hallar el área geométrica total (siempre positiva), busca los ceros de $f(x) = 0$ dentro de $(a, b)$, parte la integral y suma los valores absolutos de cada tramo ($A_+ + A_-$).',
                'Regla del Trapecio ($T_n$): aproxima cada subintervalo con trapecios lineales; sirve para cualquier $n \\ge 1$.',
                'Regla de Simpson ($S_n$): exige $n$ PAR (ej. $n = 2, 4, 6$) y aproxima con arcos parabólicos; es 100% EXACTA para polinomios de grado $\\le 3$.'
              ],
              conditions: 'Para comprobar resultados rápidamente en cuadráticas sobre $[a, b]$, $S_2 = \\frac{b - a}{6}\\left[f(a) + 4f\\!\\left(\\frac{a+b}{2}\\right) + f(b)\\right]$ da el valor exacto sin integrar.'
            },
            {
              code: '8.5.6',
              kind: 'method',
              name: 'Integrales Impropias (Límites Infinitos o Discontinuidades) y Criterio $p$-Integral',
              latex: '\\int_a^{\\infty} f(x)\\,dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\,dx \\qquad \\quad \\int_1^{\\infty} \\frac{dx}{x^p} \\text{ converge} \\iff p > 1 \\;\\left(= \\frac{1}{p - 1}\\right)',
              variables: 'Donde el extremo infinito (o una asíntota vertical $c \\in [a, b]$) se reemplaza por un parámetro $t$ para evaluar el límite tras integrar.',
              steps: [
                'Tipo I (intervalo infinito): sustituye $\\infty$ por $t$, calcula $\\int_a^t f(x)\\,dx$ con Barrow y toma $\\lim_{t \\to \\infty}$. Si ambos límites son $\\pm\\infty$, parte en un punto $c$ (ej. $0$).',
                'Tipo II (discontinuidad en $c$): reemplaza el punto conflictivo por $t \\to c^-$ o $t \\to c^+$ y evalúa el límite lateral.',
                'Si el límite es finito, la integral impropia converge a ese número; si es $\\pm\\infty$ o no existe, diverge.'
              ],
              conditions: 'Atención a discontinuidades ocultas en el interior de $[a, b]$ (ej. $\\int_{-1}^1 \\frac{dx}{x^2}$): debes partir obligatoriamente en $x = 0$ antes de aplicar Barrow.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       9. FORMULARIO DE CÁLCULO DIFERENCIAL E INTEGRAL APLICADO
       ====================================================================== */
    {
      id: 'calculo',
      moduleNumber: 9,
      name: 'Formulario de Aplicaciones del Cálculo Diferencial e Integral',
      shortName: 'Cálculo Dif. e Int.',
      symbol: '∫∂',
      color: '#D97706',
      levelTag: 'Cálculo Aplicado',
      description: 'Rectas tangente y normal, extremos y concavidad, Rolle, TVM, L’Hôpital, TFC, áreas entre curvas (y atajo de Arquímedes), volúmenes, cinemática, ecuaciones diferenciales (separables, 1.º y 2.º orden) y álgebra lineal aplicada.',
      sections: [
        {
          id: 'calc-sec-1',
          title: '9.1 Rectas Tangente y Normal, Puntos Críticos y Criterios de Extremos',
          formulas: [
            {
              code: '9.1.1',
              name: 'Ecuación de la Recta Tangente y de la Recta Normal a una Curva en $x_0$',
              latex: "y - f(x_0) = f'(x_0)(x - x_0) \\qquad \\quad y - f(x_0) = -\\frac{1}{f'(x_0)}(x - x_0)",
              variables: 'Donde $(x_0, f(x_0))$ es el punto de contacto, $m_{tan} = f\'(x_0)$ la pendiente de la recta tangente y $m_{nor} = -\\frac{1}{f\'(x_0)}$ la pendiente normal.',
              conditions: 'Para la recta normal se exige $f\'(x_0) \\neq 0$. Si $f\'(x_0) = 0$, la tangente es horizontal ($y = f(x_0)$) y la normal es vertical ($x = x_0$).'
            },
            {
              code: '9.1.2',
              name: 'Puntos Críticos y Criterio de la Primera Derivada para Extremos Locales',
              latex: "f'(c) = 0 \\quad \\text{o} \\quad \\nexists f'(c) \\implies \\begin{cases} \\text{Máximo local en } c, & \\text{si } f'(x) \\text{ cambia de } + \\text{ a } - \\\\ \\text{Mínimo local en } c, & \\text{si } f'(x) \\text{ cambia de } - \\text{ a } + \\\\ \\text{Sin extremo}, & \\text{si } f'(x) \\text{ no cambia de signo} \\end{cases}",
              variables: 'Donde $c$ es un punto crítico en el interior del dominio de $f$.',
              conditions: 'Si $f\'(x) > 0$ en un intervalo, $f$ es estrictamente creciente; si $f\'(x) < 0$, $f$ es estrictamente decreciente.'
            },
            {
              code: '9.1.3',
              name: 'Criterio de la Segunda Derivada (Concavidad y Puntos de Inflexión)',
              latex: "f'(c) = 0 \\implies \\begin{cases} f''(c) > 0 \\implies c \\text{ es un Mínimo Relativo (Cóncava hacia arriba } \\cup) \\\\ f''(c) < 0 \\implies c \\text{ es un Máximo Relativo (Cóncava hacia abajo } \\cap) \\\\ f''(c) = 0 \\implies \\text{Criterio no concluyente (usar 1ra derivada)} \\end{cases}",
              variables: 'Donde $f\'\'(x)$ mide la concavidad de la gráfica.',
              conditions: 'Un punto de inflexión $(x_0, f(x_0))$ ocurre donde $f\'\'(x_0) = 0$ (o no existe) y la concavidad cambia efectivamente de signo a ambos lados de $x_0$.'
            }
          ]
        },
        {
          id: 'calc-sec-2',
          title: '9.2 Teoremas del Valor Medio y Regla de L’Hôpital',
          formulas: [
            {
              code: '9.2.1',
              name: 'Teorema de Rolle',
              latex: 'f \\in C[a, b], \\; f \\in D(a, b) \\;\\text{ y }\\; f(a) = f(b) \\implies \\exists\\, c \\in (a, b) \\;\\text{ tal que }\\; f\'(c) = 0',
              variables: 'Donde $f$ es continua en $[a, b]$, derivable en $(a, b)$ y toma valores iguales en los extremos.',
              conditions: 'Garantiza la existencia geométrica de al menos un punto intermedio $c$ donde la recta tangente es estrictamente horizontal.'
            },
            {
              code: '9.2.2',
              name: 'Teorema del Valor Medio de Lagrange (TVM del Cálculo Diferencial)',
              latex: "f \\in C[a, b] \\;\\text{ y }\\; f \\in D(a, b) \\implies \\exists\\, c \\in (a, b) \\;\\text{ tal que }\\; f'(c) = \\frac{f(b) - f(a)}{b - a}",
              variables: 'Donde $\\frac{f(b) - f(a)}{b - a}$ es la pendiente secante promedio y $f\'(c)$ es la pendiente tangente instantánea.',
              conditions: 'Establece que en algún punto intermedio la velocidad o razón instantánea iguala exactamente a la velocidad o razón media del recorrido.'
            },
            {
              code: '9.2.3',
              name: 'Regla de L’Hôpital para Indeterminaciones $\\frac{0}{0}$ e $\\frac{\\infty}{\\infty}$',
              latex: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
              variables: 'Donde $f(x)$ y $g(x)$ son diferenciables en un entorno perforado de $a$, y $g\'(x) \\neq 0$.',
              conditions: 'Aplica ÚNICAMENTE si el límite produce directamente las formas $\\frac{0}{0}$ o $\\frac{\\pm\\infty}{\\pm\\infty}$. Se derivan numerador y denominador por separado (NUNCA como cociente).'
            }
          ]
        },
        {
          id: 'calc-sec-3',
          title: '9.3 Sumas de Riemann y Teoremas Fundamentales del Cálculo',
          formulas: [
            {
              code: '9.3.1',
              name: 'Definición de la Integral Definida mediante Sumas de Riemann',
              latex: '\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*) \\Delta x \\qquad \\text{donde } \\Delta x = \\frac{b - a}{n}, \\quad x_i = a + i \\Delta x',
              variables: 'Donde $\\Delta x$ es el ancho de los $n$ subintervalos regulares, $x_i^*$ es el punto muestra en $[x_{i-1}, x_i]$ y el límite representa el área neta bajo la curva.',
              conditions: 'Condición suficiente: $f$ debe ser continua o continua a trozos con un número finito de discontinuidades de salto en $[a, b]$.'
            },
            {
              code: '9.3.2',
              name: 'Primer Teorema Fundamental del Cálculo (Derivación de Integrales Acumuladoras)',
              latex: '\\frac{d}{dx} \\left[ \\int_a^{u(x)} f(t)\\,dt \\right] = f(u(x)) \\cdot u\'(x) \\qquad \\quad \\frac{d}{dx} \\left[ \\int_{v(x)}^{u(x)} f(t)\\,dt \\right] = f(u(x))u\'(x) - f(v(x))v\'(x)',
              variables: 'Donde $f(t)$ es continua en el intervalo y $u(x), v(x)$ son funciones límite diferenciables (Regla de Leibniz).',
              conditions: 'Demuestra rigurosamente que la integración y la diferenciación son procesos matemáticos inversos.'
            },
            {
              code: '9.3.3',
              name: 'Segundo Teorema Fundamental del Cálculo (Regla de Barrow)',
              latex: '\\int_a^b f(x)\\,dx = \\Big[ F(x) \\Big]_a^b = F(b) - F(a) \\qquad \\text{donde } F\'(x) = f(x)',
              variables: 'Donde $F(x)$ es cualquier función primitiva o antiderivada de $f(x)$ y $[a, b]$ son los límites de integración.',
              conditions: 'Condición indispensable: la función integrando $f(x)$ debe ser continua en todo el intervalo cerrado $[a, b]$.'
            }
          ]
        },
        {
          id: 'calc-sec-4',
          title: '9.4 Aplicaciones Geométricas: Área entre Curvas, Volúmenes y Valor Promedio',
          formulas: [
            {
              code: '9.4.1',
              name: 'Área de una Región Plana Comprendida entre Dos Curvas',
              latex: 'A = \\int_a^b \\Big( f(x) - g(x) \\Big)\\,dx \\qquad \\text{o respecto al eje } Y: \\quad A = \\int_c^d \\Big( f(y) - g(y) \\Big)\\,dy',
              variables: 'Donde $f(x) \\ge g(x)$ (curva superior menos curva inferior) en $[a, b]$, o $f(y) \\ge g(y)$ (curva derecha menos curva izquierda) en $[c, d]$.',
              conditions: 'Si las curvas se cruzan en el intervalo, debe descomponerse la integral en cada punto de corte calculando $\\int |f(x) - g(x)|\\,dx$.'
            },
            {
              code: '9.4.2',
              name: 'Volumen de Sólidos de Revolución (Método de Discos y Arandelas)',
              latex: '\\text{Discos: } V = \\pi \\int_a^b [R(x)]^2\\,dx \\qquad \\text{Arandelas: } V = \\pi \\int_a^b \\left( [R(x)]^2 - [r(x)]^2 \\right)\\,dx',
              variables: 'Donde $R(x)$ es el radio exterior medido desde el eje de revolución hasta la frontera más lejana y $r(x)$ el radio interior del hueco.',
              conditions: 'Eje de revolución horizontal: se integra respecto a $x$. Si el eje de revolución es vertical, se integra respecto a $y$: $V = \\pi \\int_c^d [R(y)^2 - r(y)^2]dy$.'
            },
            {
              code: '9.4.3',
              name: 'Valor Promedio de una Función y Teorema del Valor Medio Integral',
              latex: 'f_{\\text{prom}} = \\frac{1}{b - a} \\int_a^b f(x)\\,dx \\qquad \\quad \\exists\\, c \\in [a, b] \\;\\text{ tal que }\\; f(c) = f_{\\text{prom}}',
              variables: 'Donde $f_{\\text{prom}}$ es la altura del rectángulo cuya área coincide exactamente con la integral definida sobre $[a, b]$.',
              conditions: 'Condición: $f$ continua en $[a, b]$ con $b > a$. Equivale geométricamente a transformar la curva en un área rectangular homogénea.'
            }
          ]
        },
        {
          id: 'calc-sec-5',
          title: '9.5 Cinemática, Ecuaciones Diferenciales (EDO) y Álgebra Lineal Aplicada',
          formulas: [
            {
              code: '9.5.1',
              kind: 'method',
              name: 'Atajo de Arquímedes (Recta y Parábola) y Método de Rebanadas Horizontales ($dy$)',
              latex: 'A = \\frac{|a|}{6}(\\beta - \\alpha)^3 = \\frac{2}{3} \\cdot \\text{base} \\cdot \\text{flecha} \\qquad \\quad A = \\int_c^d \\big[x_{\\text{der}}(y) - x_{\\text{izq}}(y)\\big]\\,dy',
              variables: 'Donde $\\alpha < \\beta$ son las abscisas de intersección entre la parábola y la recta, $|a|$ el coeficiente líder de $x^2$ en la diferencia, y $c < d$ los cortes en el eje $Y$.',
              steps: [
                'Con rebanadas verticales ($dx$): iguala $f(x) = g(x)$ para hallar los cruces $a < b$, identifica la curva superior con un punto interior e integra $\\int_a^b [f_{\\text{sup}} - g_{\\text{inf}}]\\,dx$.',
                'Con rebanadas horizontales ($dy$): cuando las fronteras están despejadas como $x(y)$, integra $\\int_c^d [x_{\\text{der}}(y) - x_{\\text{izq}}(y)]\\,dy$ para evitar partir en varias zonas.',
                'Atajo de Arquímedes: si la región está encerrada exclusivamente por una parábola y una recta (o dos parábolas), aplica directo $A = \\frac{|a|}{6}(\\beta - \\alpha)^3$.'
              ],
              conditions: 'En el atajo de Arquímedes, $|a|$ es el valor absoluto del coeficiente cuadrático de $(f - g)(x)$ tras igualar ambas curvas.'
            },
            {
              code: '9.5.2',
              kind: 'method',
              name: 'Integración en Cinemática: de Aceleración $a(t)$ a Velocidad $v(t)$ y Posición $s(t)$',
              latex: 'v(t) = v(t_0) + \\int_{t_0}^{t} a(\\tau)\\,d\\tau \\qquad s(t) = s(t_0) + \\int_{t_0}^{t} v(\\tau)\\,d\\tau \\qquad \\Delta s = \\int_{t_1}^{t_2} v(t)\\,dt, \\quad d_{\\text{total}} = \\int_{t_1}^{t_2} |v(t)|\\,dt',
              variables: 'Donde $a(t) = v\'(t) = s\'\'(t)$ es la aceleración, $v(t) = s\'(t)$ la velocidad, $\\Delta s$ el desplazamiento neto y $d_{\\text{total}}$ la distancia total recorrida.',
              steps: [
                'Integra $a(t)$ y usa la velocidad inicial $v(t_0)$ para fijar la constante y obtener $v(t)$ (o usa la integral definida desde $t_0$).',
                'Integra $v(t)$ y usa la posición inicial $s(t_0)$ para obtener $s(t)$.',
                'Para distancia total recorrida $d_{\\text{total}}$, halla los instantes donde $v(t) = 0$ (cambios de sentido), parte el intervalo y suma $|\\Delta s_i|$; comprueba derivando $s\'\'(t) = a(t)$.'
              ],
              conditions: 'El desplazamiento neto $\\Delta s = s(t_2) - s(t_1)$ puede ser negativo o cero; la distancia total recorrida es siempre no negativa ($d_{\\text{total}} \\ge 0$).'
            },
            {
              code: '9.5.3',
              kind: 'method',
              name: 'EDO de Variables Separables: Integración Indefinida ($+C$) vs. Definida desde $(x_0, y_0)$',
              latex: '\\frac{dy}{dx} = p(x)\\,q(y) \\implies \\int \\frac{dy}{q(y)} = \\int p(x)\\,dx + C \\qquad \\text{o directo:} \\qquad \\int_{y_0}^{y} \\frac{dv}{q(v)} = \\int_{x_0}^{x} p(u)\\,du',
              variables: 'Donde $p(x)$ depende solo de $x$, $q(y)$ depende solo de $y$ y $(x_0, y_0)$ es la condición inicial del problema de valor inicial (PVI).',
              steps: [
                'Factoriza el lado derecho en producto $p(x) \\cdot q(y)$ y separa cada variable con su diferencial: $\\frac{1}{q(y)}\\,dy = p(x)\\,dx$.',
                'Camino 1 (Indefinida): integra ambos lados agregando una sola constante $+C$ (o $K = \\pm e^C$) y sustituye $(x_0, y_0)$ antes o después de despejar $y$.',
                'Camino 2 (Definida): integra simultáneamente desde $y_0$ hasta $y$ y desde $x_0$ hasta $x$ para obtener la solución particular sin calcular $C$.'
              ],
              conditions: 'Al dividir entre $q(y)$ exige $q(y) \\neq 0$, pero revisa siempre por separado las soluciones constantes de equilibrio $y(x) \\equiv y^*$ donde $q(y^*) = 0$.'
            },
            {
              code: '9.5.4',
              kind: 'method',
              name: 'Modelos de Crecimiento/Decaimiento Exponencial, Vida Media y Verificación de EDO',
              latex: '\\frac{dy}{dt} = k\\,y,\\;\\; y(0) = y_0 \\implies y(t) = y_0\\,e^{kt} \\qquad \\quad t_{1/2} = \\frac{\\ln(2)}{|k|}, \\qquad t_{\\text{doble}} = \\frac{\\ln(2)}{k}',
              variables: 'Donde $y_0$ es la cantidad inicial en $t = 0$, $k$ la constante de proporcionalidad continua, $t_{1/2}$ la vida media ($k < 0$) y $t_{\\text{doble}}$ el tiempo de duplicación ($k > 0$).',
              steps: [
                'Identifica la tasa $k$ y la condición inicial $y(0) = y_0$ para escribir directamente $y(t) = y_0 e^{kt}$ (o halla $k = \\frac{1}{t_1}\\ln\\!\\left(\\frac{y_1}{y_0}\\right)$ con un segundo dato).',
                'Para desintegración radiactiva usa la vida media $t_{1/2} = \\frac{\\ln(2)}{|k|}$ (o base $1/2$: $y(t) = y_0 \\left(\\frac{1}{2}\\right)^{t / t_{1/2}}$).',
                'Comprobación universal de toda EDO: verifica $y(x_0) = y_0$, deriva $y(x)$ para el lado izquierdo y confirma que coincide idénticamente con el lado derecho.'
              ],
              conditions: 'Válido para procesos con tasa proporcional a la cantidad presente ($y_0 > 0$). En enfriamiento de Newton se usa $\\frac{dT}{dt} = k(T - T_m) \\implies T(t) = T_m + (T_0 - T_m)e^{kt}$.'
            },
            {
              code: '9.5.5',
              kind: 'method',
              name: 'EDO Lineal de 1.º Orden (Factor Integrante) y EDO Homogénea de 2.º Orden',
              latex: "y' + P(x)y = Q(x),\\;\\; \\mu(x) = e^{\\int P(x)\\,dx} \\implies \\big(\\mu y\\big)' = \\mu Q \\qquad ay'' + by' + cy = 0 \\implies ar^2 + br + c = 0",
              variables: 'Donde $\\mu(x)$ es el factor integrante de la EDO lineal de primer orden, y $r_1, r_2$ son las raíces de la ecuación característica de la EDO de segundo orden.',
              steps: [
                'EDO lineal 1.º orden: normaliza a $y\' + P(x)y = Q(x)$, calcula $\\mu(x) = e^{\\int P(x)\\,dx}$, multiplica toda la ecuación por $\\mu(x)$, integra $\\mu(x)y = \\int \\mu(x)Q(x)\\,dx + C$ y despeja $y$.',
                'EDO homogénea 2.º orden: resuelve $ar^2 + br + c = 0$ con la fórmula cuadrática según su discriminante $\\Delta = b^2 - 4ac$.',
                'Escribe la solución general: reales distintas $\\to C_1 e^{r_1 x} + C_2 e^{r_2 x}$; raíz doble $r \\to (C_1 + C_2 x)e^{rx}$; complejas $\\alpha \\pm \\beta i \\to e^{\\alpha x}(C_1\\cos \\beta x + C_2\\,\\text{sen}\\,\\beta x)$.'
              ],
              conditions: 'En la EDO de 2.º orden con coeficientes constantes se exige $a \\neq 0$; las constantes $C_1, C_2$ se fijan con dos condiciones iniciales $y(x_0), y\'(x_0)$.'
            },
            {
              code: '9.5.6',
              kind: 'method',
              name: 'Álgebra Lineal Aplicada: Determinante, Matriz Inversa $2 \\times 2$, Ortogonalidad y Eigenvalores',
              latex: 'A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} \\qquad \\mathbf{u} \\perp \\mathbf{v} \\iff \\mathbf{u} \\cdot \\mathbf{v} = 0 \\qquad \\det(A - \\lambda I) = 0',
              variables: 'Donde $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, $\\det(A) = ad - bc$, $\\mathbf{u} \\cdot \\mathbf{v} = \\sum u_i v_i$ es el producto punto y $\\lambda$ los valores propios (eigenvalores).',
              steps: [
                'Determinante e inversa $2 \\times 2$: calcula $\\det(A) = ad - bc$; si $\\det(A) \\neq 0$, intercambia la diagonal principal ($a \\leftrightarrow d$), cambia signo a la secundaria ($-b, -c$) y divide por $\\det(A)$.',
                'Producto punto y ortogonalidad: dos vectores no nulos en $\\mathbb{R}^n$ son perpendiculares si y solo si $\\mathbf{u} \\cdot \\mathbf{v} = u_1 v_1 + u_2 v_2 + u_3 v_3 = 0$; el área transformada por $T$ se escala por $|\\det(T)|$.',
                'Eigenvalores: plantea el polinomio característico $\\det(A - \\lambda I) = 0$ (en $2 \\times 2$: $\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0$) y halla sus raíces $\\lambda$.'
              ],
              conditions: 'La matriz inversa $A^{-1}$ existe si y solo si $\\det(A) \\neq 0$ (matriz invertible o no singular). En matrices $3 \\times 3$, expande por cofactores o Regla de Sarrus.'
            }
          ]
        }
      ]
    }
  ];

  // Estado interno de la herramienta de Formularios Matemáticos
  const sheetState = {
    modality: 'single',      // 'single' (Modalidad A: Por Tema) | 'all' (Modalidad B: Compendio General)
    selectedSubjectId: 'aritmetica',
    searchQuery: ''
  };

  /**
   * Cuenta el total de fórmulas dentro de un módulo o de toda la colección.
   */
  function countFormulasInModule(mod) {
    if (!mod || !Array.isArray(mod.sections)) return 0;
    return mod.sections.reduce((acc, sec) => acc + (Array.isArray(sec.formulas) ? sec.formulas.length : 0), 0);
  }

  function countAllFormulas() {
    return FORMULA_SHEETS_DATA.reduce((acc, mod) => acc + countFormulasInModule(mod), 0);
  }

  /**
   * Normaliza cadenas para búsqueda insensible a tildes y mayúsculas.
   */
  function normalizeSearchText(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Filtra los módulos y sus secciones según la modalidad activa y el término de búsqueda.
   */
  function getFilteredModules() {
    const baseModules = sheetState.modality === 'all'
      ? FORMULA_SHEETS_DATA
      : FORMULA_SHEETS_DATA.filter(m => m.id === sheetState.selectedSubjectId);

    const q = normalizeSearchText(sheetState.searchQuery.trim());
    if (!q) return baseModules;

    const result = [];
    for (const mod of baseModules) {
      const matchedSections = [];
      for (const sec of mod.sections) {
        const matchedFormulas = sec.formulas.filter(f => {
          const stepsText = Array.isArray(f.steps) ? f.steps.join(' ') : '';
          const kindText = f.kind === 'method' ? 'metodo procedimiento estrategia' : 'formula propiedad';
          const haystack = normalizeSearchText(`${f.code} ${f.name} ${f.latex} ${f.variables} ${f.conditions} ${stepsText} ${kindText} ${sec.title} ${mod.name}`);
          return haystack.includes(q);
        });
        if (matchedFormulas.length > 0) {
          matchedSections.push(Object.assign({}, sec, { formulas: matchedFormulas }));
        }
      }
      if (matchedSections.length > 0) {
        result.push(Object.assign({}, mod, { sections: matchedSections }));
      }
    }
    return result;
  }

  /**
   * Renderiza una ficha individual de fórmula o método de resolución con sus componentes pedagógicos:
   * Nombre, Expresión Matemática, Significado de Variables, Procedimiento paso a paso (si aplica)
   * y Condiciones/Restricciones, más acciones interactivas (.no-print) para copiar LaTeX y abrir en el Editor.
   */
  function renderFormulaCardHtml(f, accentColor) {
    const nameHtml = ns.MathRenderer ? ns.MathRenderer.formatRichText(f.name) : f.name;
    const mathHtml = ns.MathRenderer ? ns.MathRenderer.renderMath(f.latex, true) : f.latex;
    const varsHtml = ns.MathRenderer ? ns.MathRenderer.formatRichText(f.variables) : f.variables;
    const condHtml = ns.MathRenderer ? ns.MathRenderer.formatRichText(f.conditions) : f.conditions;
    const stepsHtml = Array.isArray(f.steps) && f.steps.length > 0
      ? f.steps.map(step => `<li>${ns.MathRenderer ? ns.MathRenderer.formatRichText(step) : step}</li>`).join('')
      : '';
    const isMethod = f.kind === 'method';
    const encodedLatex = encodeURIComponent(f.latex);

    return `
      <article class="fs-formula-card ${isMethod ? 'fs-method-card' : ''}" style="--fs-accent: ${accentColor || '#2563EB'};">
        <div class="fs-formula-card-header">
          <span class="fs-formula-code">${f.code}</span>
          ${isMethod ? '<span class="fs-formula-kind-badge">⚙️ Método</span>' : ''}
          <h4 class="fs-formula-name">${nameHtml}</h4>
          <div class="fs-card-actions no-print">
            <button
              type="button"
              class="btn btn-outline btn-sm fs-btn-copy fs-card-action-btn"
              data-fs-copy-latex="${encodedLatex}"
              title="Copiar fórmula matemática en formato LaTeX">
              📋 Copiar
            </button>
            <button
              type="button"
              class="btn btn-outline btn-sm fs-btn-editor fs-card-action-btn"
              data-fs-open-editor="${encodedLatex}"
              title="Abrir y experimentar esta fórmula en el Editor de Expresiones">
              ∑ Editor
            </button>
          </div>
        </div>

        <div class="fs-formula-equation-box">
          ${mathHtml}
        </div>

        <div class="fs-formula-meta-grid">
          <div class="fs-formula-meta-item">
            <span class="fs-meta-label">📐 Significado de variables:</span>
            <span class="fs-meta-text">${varsHtml}</span>
          </div>
          ${f.conditions ? `
            <div class="fs-formula-meta-item fs-meta-condition">
              <span class="fs-meta-label">${isMethod ? '🎯 Cuándo usar y restricciones:' : '⚠️ Condiciones y restricciones:'}</span>
              <span class="fs-meta-text">${condHtml}</span>
            </div>
          ` : ''}
          ${stepsHtml ? `
            <div class="fs-formula-meta-item fs-meta-steps">
              <span class="fs-meta-label">🧭 Procedimiento paso a paso:</span>
              <ol class="fs-method-steps">${stepsHtml}</ol>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }

  /**
   * Renderiza el documento académico imprimible (tanto en pantalla como para @media print).
   */
  function renderPrintableDocumentHtml(filteredModules) {
    const totalShown = filteredModules.reduce((acc, m) => acc + countFormulasInModule(m), 0);
    const activeMod = FORMULA_SHEETS_DATA.find(m => m.id === sheetState.selectedSubjectId) || FORMULA_SHEETS_DATA[0];
    const isGeneral = sheetState.modality === 'all';

    const docTitle = isGeneral
      ? 'Compendio General de Fórmulas y Métodos Matemáticos (9 Módulos)'
      : activeMod.name;
    const docSubtitle = isGeneral
      ? 'Referencia académica unificada de fórmulas y métodos de resolución desde Aritmética, Álgebra, Geometría y Trigonometría hasta Cálculo Diferencial, Integral, EDO y Álgebra Lineal.'
      : activeMod.description;

    if (filteredModules.length === 0) {
      return `
        <div class="content-card" style="text-align:center; padding:2.5rem 1.5rem;">
          <div style="font-size:2.2rem; margin-bottom:0.5rem;">🔍</div>
          <h3 style="margin-bottom:0.35rem;">No se encontraron fórmulas ni métodos que coincidan con "${sheetState.searchQuery}"</h3>
          <p class="theory-paragraph" style="margin-bottom:1rem;">Prueba con otro término (ej. Ruffini, Cramer, Pitágoras, sándwich, Taylor, partes, Simpson, EDO) o cambia al Compendio General.</p>
          <button type="button" class="btn btn-outline btn-sm" id="btn-fs-clear-search-empty">Limpiar filtro de búsqueda</button>
        </div>
      `;
    }

    const appName = (ns.Version && ns.Version.APP_NAME) || 'MateTic';
    const appTagline = (ns.Version && ns.Version.APP_TAGLINE) || 'Matemáticas Interactivas';
    const studioName = (ns.Version && ns.Version.STUDIO_NAME) || 'ALPA Studio';

    return `
      <div class="fs-printable-sheet" id="fs-printable-sheet">
        <!-- Membrete Académico Oficial (Visible en Pantalla y Encabezado de Impresión Carta) -->
        <header class="fs-print-letterhead">
          <div class="fs-letterhead-top">
            <div class="fs-letterhead-brand">
              <span class="fs-letterhead-logo">∫π</span>
              <div>
                <div class="fs-letterhead-org">${appName.toUpperCase()} · ${appTagline.toUpperCase()}</div>
                <div class="fs-letterhead-doc-type">FORMULARIO Y GUÍA DE MÉTODOS MATEMÁTICOS · ${studioName.toUpperCase()}</div>
              </div>
            </div>
            <div class="fs-letterhead-meta">
              <span class="fs-meta-pill">${isGeneral ? 'Modalidad B · Compendio Completo' : `Modalidad A · Módulo ${activeMod.moduleNumber} de 9`}</span>
              <span class="fs-meta-count">${totalShown} ${totalShown === 1 ? 'ficha seleccionada' : 'fórmulas y métodos'}</span>
            </div>
          </div>

          <div class="fs-letterhead-title-block">
            <h2 class="fs-document-title">${docTitle}</h2>
            <p class="fs-document-subtitle">${docSubtitle}</p>
          </div>
        </header>

        <!-- Índice General por Secciones (En Modalidad B o cuando hay múltiples secciones) -->
        ${isGeneral ? `
          <nav class="fs-general-toc" aria-label="Índice General del Compendio">
            <div class="fs-toc-header">
              <strong>📑 Índice General por Módulos y Secciones</strong>
              <span class="no-print" style="font-size:0.78rem; color:var(--text-muted);">Haz clic en cualquier bloque para desplazarte directamente a esa sección</span>
            </div>
            <div class="fs-toc-grid">
              ${filteredModules.map(mod => `
                <a href="#fs-mod-${mod.id}" class="fs-toc-module-card" data-fs-jump="fs-mod-${mod.id}">
                  <div class="fs-toc-mod-title">
                    <span class="fs-toc-mod-num">${mod.moduleNumber}.</span>
                    <strong>${mod.shortName}</strong>
                    <span class="fs-toc-mod-count">(${countFormulasInModule(mod)})</span>
                  </div>
                  <ul class="fs-toc-sec-list">
                    ${mod.sections.map(sec => `
                      <li>${sec.title}</li>
                    `).join('')}
                  </ul>
                </a>
              `).join('')}
            </div>
          </nav>
        ` : `
          <nav class="fs-module-toc no-print" aria-label="Secciones de este formulario">
            <span class="fs-module-toc-label">Secciones incluidas:</span>
            ${activeMod.sections.map(sec => `
              <a href="#fs-sec-${sec.id}" class="fs-module-toc-chip" data-fs-jump="fs-sec-${sec.id}">${sec.title}</a>
            `).join('')}
          </nav>
        `}

        <!-- Cuerpo de Módulos y Subsecciones de Fórmulas -->
        <div class="fs-modules-stack">
          ${filteredModules.map(mod => `
            <section class="fs-module-block" id="fs-mod-${mod.id}">
              <div class="fs-module-banner" style="--fs-mod-color: ${mod.color};">
                <div class="fs-module-banner-left">
                  <span class="fs-module-symbol" style="background:${mod.color};">${mod.symbol}</span>
                  <div>
                    <span class="fs-module-kicker">MÓDULO ${mod.moduleNumber} · ${mod.levelTag.toUpperCase()}</span>
                    <h3 class="fs-module-heading">${mod.name}</h3>
                  </div>
                </div>
                <div class="fs-module-banner-right no-print">
                  <button type="button" class="btn btn-outline btn-sm" data-fs-open-subject="${mod.id}">
                    📚 Ir a las lecciones de ${mod.shortName} →
                  </button>
                </div>
              </div>

              ${mod.sections.map(sec => `
                <div class="fs-section-block" id="fs-sec-${sec.id}">
                  <h4 class="fs-section-title">${sec.title}</h4>
                  <div class="fs-formulas-grid">
                    ${sec.formulas.map(f => renderFormulaCardHtml(f, mod.color)).join('')}
                  </div>
                </div>
              `).join('')}
            </section>
          `).join('')}
        </div>

        <!-- Pie de página académico para impresión -->
        <footer class="fs-print-footer">
          <span>${appName} (${appTagline}) — Formulario Académico de Estudio y Consulta</span>
          <span>${studioName} · Impresión en formato Carta (Letter)</span>
        </footer>
      </div>
    `;
  }

  /**
   * Renderiza la vista principal de "Formularios matemáticos".
   * @param {HTMLElement} container Contenedor principal (`#main-view-container`)
   * @param {string|null} initialPreset Puede ser `'general'` / `'all'` o el ID de uno de los 9 módulos (ej. `'algebra'`).
   */
  function renderFormulaSheetsView(container, initialPreset = null) {
    if (!container) return;

    if (initialPreset === 'general' || initialPreset === 'all' || initialPreset === 'compendio') {
      sheetState.modality = 'all';
    } else if (typeof initialPreset === 'string' && FORMULA_SHEETS_DATA.some(m => m.id === initialPreset)) {
      sheetState.modality = 'single';
      sheetState.selectedSubjectId = initialPreset;
    }

    const totalAll = countAllFormulas();
    const isCompactPhone = typeof window !== 'undefined' && window.innerWidth < 768;
    const activeModObj = FORMULA_SHEETS_DATA.find(m => m.id === sheetState.selectedSubjectId) || FORMULA_SHEETS_DATA[0];

    container.innerHTML = `
      <!-- Cabecera de Herramienta (No imprimible) -->
      <div class="subject-header-card no-print">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon" style="background:linear-gradient(135deg, #1E40AF, #2563EB);">📄</div>
            <div class="subject-title-text">
              <h1>Formularios Matemáticos de Estudio e Impresión</h1>
              <p>Compendio riguroso de fórmulas, propiedades, métodos de resolución paso a paso y restricciones de dominio para las 9 ramas matemáticas, listo para consultar o imprimir en tamaño Carta (PDF).</p>
            </div>
          </div>
          <div class="fs-header-print-actions">
            <button type="button" class="btn btn-primary" id="btn-fs-print-main" title="Imprimir o guardar como PDF en tamaño Carta">
              🖨️ Imprimir / Guardar como PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Panel de Control: Selección de Modalidad (A: Por Tema / B: Compendio General) y Buscador (No imprimible) -->
      <section class="content-card fs-controls-panel no-print">
        <div class="fs-controls-top-row">
          <!-- Selector de las 2 Modalidades -->
          <div class="fs-modality-switch" role="tablist" aria-label="Modalidad de visualización del formulario">
            <button
              type="button"
              role="tab"
              aria-selected="${sheetState.modality === 'single' ? 'true' : 'false'}"
              class="fs-modality-btn ${sheetState.modality === 'single' ? 'active' : ''}"
              data-fs-modality="single">
              <span class="fs-mod-btn-title">📄 Modalidad A: Formulario por Tema</span>
              <span class="fs-mod-btn-sub">Consulta o imprime un módulo individual</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="${sheetState.modality === 'all' ? 'true' : 'false'}"
              class="fs-modality-btn ${sheetState.modality === 'all' ? 'active' : ''}"
              data-fs-modality="all">
              <span class="fs-mod-btn-title">📚 Modalidad B: Formulario General (${totalAll} fichas)</span>
              <span class="fs-mod-btn-sub">Compendio completo de fórmulas y métodos con Índice</span>
            </button>
          </div>

          <!-- Buscador instantáneo de fórmulas y métodos -->
          <div class="fs-search-box">
            <label for="fs-search-input" class="fs-search-label">🔍 Filtrar fórmulas, propiedades o métodos:</label>
            <div class="fs-search-input-wrap">
              <input
                type="search"
                id="fs-search-input"
                class="fn-input fs-search-input"
                value="${sheetState.searchQuery.replace(/"/g, '&quot;')}"
                placeholder="Ej: Ruffini, Cramer, método, Pitágoras, Taylor, partes, Simpson, EDO..."
                autocomplete="off"
              />
            </div>
          </div>
        </div>

        <!-- Selector Visual de los 9 Módulos (Activo en Modalidad A o como salto rápido en Modalidad B) -->
        <details class="fs-subject-selector-wrap fs-subject-details" ${isCompactPhone ? '' : 'open'}>
          <summary class="fs-subject-selector-header">
            <span class="fs-selector-label-desktop">${sheetState.modality === 'single'
              ? 'Selecciona el módulo académico cuyo formulario deseas consultar o imprimir:'
              : 'Vista de Compendio General activa (toca cualquier módulo para filtrar solo ese tema):'}</span>
            <span class="fs-selector-label-mobile">${sheetState.modality === 'single'
              ? `📚 Módulo: ${activeModObj.moduleNumber}. ${activeModObj.shortName} (cambiar módulo)`
              : '📚 Compendio general (filtrar por módulo)'}</span>
            <span class="fs-subject-details-chevron" aria-hidden="true">▾</span>
          </summary>
          <div class="fs-subject-pills-grid" id="fs-subject-pills">
            ${FORMULA_SHEETS_DATA.map(mod => {
              const isSelected = sheetState.modality === 'single' && sheetState.selectedSubjectId === mod.id;
              const fCount = countFormulasInModule(mod);
              return `
                <button
                  type="button"
                  class="fs-subject-pill ${isSelected ? 'active' : ''}"
                  data-fs-select-subj="${mod.id}"
                  style="--pill-color: ${mod.color};">
                  <span class="fs-pill-symbol" style="background:${mod.color};">${mod.symbol}</span>
                  <span class="fs-pill-info">
                    <strong class="fs-pill-name">${mod.moduleNumber}. ${mod.shortName}</strong>
                    <small class="fs-pill-count">${fCount} fórmulas y métodos</small>
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </details>
      </section>

      <!-- Contenedor Dinámico del Documento de Fórmulas -->
      <div id="fs-document-mount">
        ${renderPrintableDocumentHtml(getFilteredModules())}
      </div>
    `;

    bindFormulaSheetsEvents(container);
  }

  function refreshDocumentMount(container) {
    const mount = container.querySelector('#fs-document-mount');
    if (!mount) return;
    mount.innerHTML = renderPrintableDocumentHtml(getFilteredModules());
    bindDocumentInternalEvents(container);
  }

  function bindDocumentInternalEvents(container) {
    // Botón limpiar búsqueda cuando no hay resultados
    container.querySelector('#btn-fs-clear-search-empty')?.addEventListener('click', () => {
      sheetState.searchQuery = '';
      const inp = container.querySelector('#fs-search-input');
      if (inp) inp.value = '';
      refreshDocumentMount(container);
    });

    // Enlaces del índice para desplazamiento suave en pantalla
    container.querySelectorAll('[data-fs-jump]').forEach(link => {
      link.addEventListener('click', (ev) => {
        ev.preventDefault();
        const targetId = link.getAttribute('data-fs-jump');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Botones para ir a las lecciones de la materia correspondiente
    container.querySelectorAll('[data-fs-open-subject]').forEach(btn => {
      btn.addEventListener('click', () => {
        const subjId = btn.getAttribute('data-fs-open-subject');
        if (ns.App && typeof ns.App.openSubject === 'function') {
          ns.App.openSubject(subjId);
        }
      });
    });

    // Botones '📋 Copiar' fórmula LaTeX al portapapeles
    container.querySelectorAll('[data-fs-copy-latex]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const rawLatex = decodeURIComponent(btn.getAttribute('data-fs-copy-latex') || '');
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(rawLatex);
          } else {
            const tempInput = document.createElement('textarea');
            tempInput.value = rawLatex;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
          }
          const prevText = btn.textContent;
          btn.textContent = '✓ ¡Copiado!';
          btn.style.borderColor = 'var(--success-600, #16a34a)';
          btn.style.color = 'var(--success-600, #16a34a)';
          setTimeout(() => {
            btn.textContent = prevText;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 1800);
        } catch (err) {
          console.error('Error al copiar fórmula:', err);
        }
      });
    });

    // Botones '∑ Editor' para abrir la fórmula en el Editor de Expresiones
    container.querySelectorAll('[data-fs-open-editor]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rawLatex = decodeURIComponent(btn.getAttribute('data-fs-open-editor') || '');
        if (ns.App && typeof ns.App.openTool === 'function') {
          ns.App.openTool('editor', rawLatex);
        }
      });
    });
  }

  function bindFormulaSheetsEvents(container) {
    // Botón principal de Impresión / Guardar como PDF
    container.querySelector('#btn-fs-print-main')?.addEventListener('click', () => {
      window.print();
    });

    // Cambio entre Modalidad A (single) y Modalidad B (all)
    container.querySelectorAll('[data-fs-modality]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-fs-modality');
        sheetState.modality = mode === 'all' ? 'all' : 'single';
        renderFormulaSheetsView(container);
      });
    });

    // Selección de uno de los 9 módulos
    container.querySelectorAll('[data-fs-select-subj]').forEach(btn => {
      btn.addEventListener('click', () => {
        const subjId = btn.getAttribute('data-fs-select-subj');
        sheetState.modality = 'single';
        sheetState.selectedSubjectId = subjId;
        renderFormulaSheetsView(container);
      });
    });

    // Buscador en tiempo real
    const searchInp = container.querySelector('#fs-search-input');
    searchInp?.addEventListener('input', () => {
      sheetState.searchQuery = searchInp.value;
      refreshDocumentMount(container);
    });

    bindDocumentInternalEvents(container);
  }

  ns.FormulaSheetsTool = {
    FORMULA_SHEETS_DATA,
    renderFormulaSheetsView
  };
})(window.MatInteractiva);
