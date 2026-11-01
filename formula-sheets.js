/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Formularios Matemáticos de Estudio e Impresión
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
      description: 'Axiomas de campo de los números reales, valor absoluto, aritmética de fracciones, razones y proporciones, leyes de exponentes y radicales.',
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
        }
      ]
    },

    /* ======================================================================
       2. FORMULARIO DE ÁLGEBRA (12 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'algebra',
      moduleNumber: 2,
      name: 'Formulario de Álgebra',
      shortName: 'Álgebra',
      symbol: 'x²',
      color: '#1D4ED8',
      levelTag: 'Álgebra Superior',
      description: 'Productos notables, teoremas de factorización, racionalización de denominadores, ecuaciones lineales y cuadráticas, logaritmos y progresiones.',
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
        }
      ]
    },

    /* ======================================================================
       3. FORMULARIO DE GEOMETRÍA (11 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'geometria',
      moduleNumber: 3,
      name: 'Formulario de Geometría Plana, del Espacio y Analítica',
      shortName: 'Geometría',
      symbol: 'Δ',
      color: '#0284C7',
      levelTag: 'Geometría y Analítica',
      description: 'Teorema de Pitágoras, áreas y perímetros de figuras planas, volúmenes de sólidos en el espacio y ecuaciones de Geometría Analítica.',
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
        }
      ]
    },

    /* ======================================================================
       4. FORMULARIO DE TRIGONOMETRÍA (12 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'trigonometria',
      moduleNumber: 4,
      name: 'Formulario de Trigonometría e Identidades',
      shortName: 'Trigonometría',
      symbol: 'θ',
      color: '#0D9488',
      levelTag: 'Trigonometría Analítica',
      description: 'Conversión angular, razones en el triángulo rectángulo, círculo unitario, identidades trigonométricas fundamentales y leyes de senos y cosenos.',
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
        }
      ]
    },

    /* ======================================================================
       5. FORMULARIO DE FUNCIONES (10 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'funciones',
      moduleNumber: 5,
      name: 'Formulario de Funciones y Modelado Matemático',
      shortName: 'Funciones',
      symbol: 'f(x)',
      color: '#4F46E5',
      levelTag: 'Precálculo',
      description: 'Restricciones de dominio, paridad, tasa de variación media, álgebra y composición de funciones, función inversa, transformaciones y asíntotas.',
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
        }
      ]
    },

    /* ======================================================================
       6. FORMULARIO DE LÍMITES (11 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'limites',
      moduleNumber: 6,
      name: 'Formulario de Límites y Continuidad',
      shortName: 'Límites',
      symbol: 'lim',
      color: '#7C3AED',
      levelTag: 'Cálculo Diferencial',
      description: 'Definición formal y existencia bilateral, álgebra de límites, técnicas de resolución para indeterminaciones 0/0, límites al infinito, límites trigonométricos y exponenciales notables, y criterios de continuidad.',
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
        }
      ]
    },

    /* ======================================================================
       7. FORMULARIO DE DERIVADAS (13 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'derivadas',
      moduleNumber: 7,
      name: 'Formulario de Derivadas y Reglas de Derivación',
      shortName: 'Derivadas',
      symbol: "f'(x)",
      color: '#9333EA',
      levelTag: 'Cálculo Diferencial',
      description: 'Definición formal por cociente incremental, reglas algebraicas básicas, regla del producto, cociente y cadena, derivadas de funciones trigonométricas directas e inversas, funciones trascendentes, derivación implícita y derivadas de orden superior.',
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
        }
      ]
    },

    /* ======================================================================
       8. FORMULARIO DE INTEGRALES (13 Fórmulas Exhaustivas)
       ====================================================================== */
    {
      id: 'integrales',
      moduleNumber: 8,
      name: 'Formulario de Integrales Indefinidas, Métodos y Definidas',
      shortName: 'Integrales',
      symbol: '∫',
      color: '#059669',
      levelTag: 'Cálculo Integral',
      description: 'Antiderivación inmediata, linealidad del operador integral, fórmulas algebraicas, trascendentes y trigonométricas, métodos de cambio de variable, integración por partes, fracciones parciales y sustitución trigonométrica.',
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
        }
      ]
    },

    /* ======================================================================
       9. FORMULARIO DE CÁLCULO DIFERENCIAL E INTEGRAL APLICADO (12 Fórmulas)
       ====================================================================== */
    {
      id: 'calculo',
      moduleNumber: 9,
      name: 'Formulario de Aplicaciones del Cálculo Diferencial e Integral',
      shortName: 'Cálculo Dif. e Int.',
      symbol: '∫∂',
      color: '#D97706',
      levelTag: 'Cálculo Aplicado',
      description: 'Ecuaciones de la recta tangente y normal, criterios de extremos locales y concavidad, teoremas de Rolle y Valor Medio, regla de L’Hôpital, sumas de Riemann, Teoremas Fundamentales del Cálculo, áreas entre curvas y volúmenes de revolución.',
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
          const haystack = normalizeSearchText(`${f.code} ${f.name} ${f.latex} ${f.variables} ${f.conditions} ${sec.title} ${mod.name}`);
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
   * Renderiza una ficha individual de fórmula con sus 4 componentes pedagógicos:
   * Nombre, Expresión Matemática, Significado de Variables y Condiciones/Restricciones,
   * más acciones interactivas (.no-print) para copiar fórmula LaTeX y abrir en el Editor de Expresiones.
   */
  function renderFormulaCardHtml(f, accentColor) {
    const mathHtml = ns.MathRenderer ? ns.MathRenderer.renderMath(f.latex, true) : f.latex;
    const varsHtml = ns.MathRenderer ? ns.MathRenderer.formatRichText(f.variables) : f.variables;
    const condHtml = ns.MathRenderer ? ns.MathRenderer.formatRichText(f.conditions) : f.conditions;
    const encodedLatex = encodeURIComponent(f.latex);

    return `
      <article class="fs-formula-card" style="--fs-accent: ${accentColor || '#2563EB'};">
        <div class="fs-formula-card-header">
          <span class="fs-formula-code">${f.code}</span>
          <h4 class="fs-formula-name">${f.name}</h4>
          <div class="fs-card-actions no-print" style="margin-left:auto; display:flex; gap:0.4rem; align-items:center;">
            <button
              type="button"
              class="btn btn-outline btn-sm fs-btn-copy"
              data-fs-copy-latex="${encodedLatex}"
              title="Copiar fórmula matemática en formato LaTeX"
              style="font-size:0.75rem; padding:0.25rem 0.55rem;">
              📋 Copiar
            </button>
            <button
              type="button"
              class="btn btn-outline btn-sm fs-btn-editor"
              data-fs-open-editor="${encodedLatex}"
              title="Abrir y experimentar esta fórmula en el Editor de Expresiones"
              style="font-size:0.75rem; padding:0.25rem 0.55rem;">
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
              <span class="fs-meta-label">⚠️ Condiciones y restricciones:</span>
              <span class="fs-meta-text">${condHtml}</span>
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
      ? 'Compendio General de Fórmulas Matemáticas (9 Módulos)'
      : activeMod.name;
    const docSubtitle = isGeneral
      ? 'Referencia académica unificada desde Aritmética, Álgebra, Geometría y Trigonometría hasta Cálculo Diferencial e Integral.'
      : activeMod.description;

    if (filteredModules.length === 0) {
      return `
        <div class="content-card" style="text-align:center; padding:2.5rem 1.5rem;">
          <div style="font-size:2.2rem; margin-bottom:0.5rem;">🔍</div>
          <h3 style="margin-bottom:0.35rem;">No se encontraron fórmulas que coincidan con "${sheetState.searchQuery}"</h3>
          <p class="theory-paragraph" style="margin-bottom:1rem;">Prueba con otro término (ej. Pitágoras, cuadrática, logaritmo, cosenos, dominio, derivada, integral) o cambia al Compendio General.</p>
          <button type="button" class="btn btn-outline btn-sm" id="btn-fs-clear-search-empty">Limpiar filtro de búsqueda</button>
        </div>
      `;
    }

    return `
      <div class="fs-printable-sheet" id="fs-printable-sheet">
        <!-- Membrete Académico Oficial (Visible en Pantalla y Encabezado de Impresión Carta) -->
        <header class="fs-print-letterhead">
          <div class="fs-letterhead-top">
            <div class="fs-letterhead-brand">
              <span class="fs-letterhead-logo">∫π</span>
              <div>
                <div class="fs-letterhead-org">MATEMÁTICA INTERACTIVA · ACADEMIA DE CIENCIAS EXACTAS</div>
                <div class="fs-letterhead-doc-type">FORMULARIO MATEMÁTICO DE ESTUDIO Y CONSULTA OFICIAL</div>
              </div>
            </div>
            <div class="fs-letterhead-meta">
              <span class="fs-meta-pill">${isGeneral ? 'Modalidad B · Compendio Completo' : `Modalidad A · Módulo ${activeMod.moduleNumber} de 9`}</span>
              <span class="fs-meta-count">${totalShown} ${totalShown === 1 ? 'fórmula seleccionada' : 'fórmulas documentadas'}</span>
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
          <span>Matemática Interactiva — Formulario Académico de Estudio y Consulta</span>
          <span>Notación simbólica estandarizada · Impresión en formato Carta (Letter)</span>
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

    container.innerHTML = `
      <!-- Cabecera de Herramienta (No imprimible) -->
      <div class="subject-header-card no-print">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon" style="background:linear-gradient(135deg, #1E40AF, #2563EB);">📄</div>
            <div class="subject-title-text">
              <h1>Formularios Matemáticos de Estudio e Impresión</h1>
              <p>Compendio riguroso de fórmulas, propiedades, significado de variables y restricciones de dominio listo para consultar en pantalla o imprimir en tamaño Carta (PDF).</p>
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
              <span class="fs-mod-btn-title">📚 Modalidad B: Formulario General (${totalAll} fórmulas)</span>
              <span class="fs-mod-btn-sub">Compendio completo con Índice General</span>
            </button>
          </div>

          <!-- Buscador instantáneo de fórmulas -->
          <div class="fs-search-box">
            <label for="fs-search-input" class="fs-search-label">🔍 Filtrar fórmulas o propiedades:</label>
            <div class="fs-search-input-wrap">
              <input
                type="search"
                id="fs-search-input"
                class="fn-input fs-search-input"
                value="${sheetState.searchQuery.replace(/"/g, '&quot;')}"
                placeholder="Ej: cuadrática, Pitágoras, logaritmo, cosenos, dominio, derivada..."
                autocomplete="off"
              />
            </div>
          </div>
        </div>

        <!-- Selector Visual de los 9 Módulos (Activo en Modalidad A o como salto rápido en Modalidad B) -->
        <div class="fs-subject-selector-wrap">
          <div class="fs-subject-selector-header">
            <span>${sheetState.modality === 'single'
              ? 'Selecciona el módulo académico cuyo formulario deseas consultar o imprimir:'
              : 'Vista de Compendio General activa (toca cualquier módulo para filtrar solo ese tema):'}</span>
          </div>
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
                    <small class="fs-pill-count">${fCount} fórmulas</small>
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
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
