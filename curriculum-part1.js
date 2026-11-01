/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Currículo Parte 1: Aritmética, Álgebra y Geometría
   Incluye el bloque completo de Factorización y Racionalización orientado
   a preparar al estudiante para Límites y Cálculo Diferencial e Integral.
   Archivo: js/data/curriculum-part1.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};
window.MatInteractiva.Curriculum = window.MatInteractiva.Curriculum || [];

(function (curriculum) {
  'use strict';

  const part1 = [
    /* ======================================================================
       MÓDULO 1: ARITMÉTICA
       ====================================================================== */
    {
      id: 'aritmetica',
      name: 'Aritmética',
      symbol: '÷',
      levelTag: 'Fundamentos',
      color: '#2563EB',
      shortDesc: 'Propiedades de los números reales, jerarquía de operaciones, leyes de exponentes, radicales, divisibilidad y fracciones.',
      topics: [
        {
          id: 'arit-1',
          title: 'Números Reales, Jerarquía y Leyes de los Exponentes',
          summary: 'Estructura del conjunto ℝ, orden estricto de operaciones, leyes de los signos y propiedades de potencias y radicales.',
          graphPreset: '2^x',
          theory: {
            intro: [
              'La **Aritmética** y la estructura del conjunto de los **Números Reales** ($\\mathbb{R}$) constituyen los cimientos sobre los cuales se construyen el Álgebra y el Cálculo. Cada operación en una derivada, un límite o una integral depende de aplicar sin ambigüedad las reglas de prioridad operativa y las leyes de los exponentes.',
              'Los conjuntos numéricos se anidan progresivamente: los **Naturales** ($\\mathbb{N} = \\{1, 2, 3, \\dots\\}$), los **Enteros** ($\\mathbb{Z} = \\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$), los **Racionales** ($\\mathbb{Q} = \\left\\{\\frac{a}{b} \\mid a, b \\in \\mathbb{Z},\\; b \\neq 0\\right\\}$) y los **Irracionales** ($\\mathbb{I}$, como $\\pi, e, \\sqrt{2}$), cuya unión forma el cuerpo completo de los **Números Reales** ($\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{I}$).'
            ],
            prerequisites: [
              'Operaciones elementales de suma, resta, multiplicación y división de números enteros.',
              'Comprensión de la recta numérica y el concepto de valor absoluto $|a|$ como distancia al origen.',
              'Distinción entre un signo de resta binario ($a - b$) y el opuesto aditivo de un número ($-a$).'
            ],
            detailedExplanation: [
              'Para que cualquier expresión matemática tenga un único valor universal, se aplica la **Jerarquía de Operaciones** en cuatro niveles estrictos: **(1)** Signos de agrupación desde el más interno hacia el externo: paréntesis $( )$, corchetes $[ ]$ y llaves $\\{ \\}$; **(2)** Potencias $a^n$ y raíces $\\sqrt[n]{a}$; **(3)** Multiplicaciones y divisiones evaluadas de izquierda a derecha; **(4)** Sumas y restas de izquierda a derecha.',
              'En el Cálculo es esencial dominar los **exponentes negativos y fraccionarios**: toda potencia negativa representa un recíproco ($a^{-n} = \\frac{1}{a^n}$ para $a \\neq 0$) y toda raíz $n$-ésima equivale a un exponente fraccionario ($\\sqrt[n]{a^m} = a^{m/n}$). Por ejemplo, para derivar o integrar $\\frac{1}{\\sqrt{x}}$, primero se reescribe como $x^{-1/2}$.'
            ],
            concepts: [
              {
                title: '1. Signos de Agrupación Anidados',
                body: 'Siempre se resuelve de adentro hacia afuera. Un signo negativo delante de un paréntesis invierte el signo de todos los términos internos: $-(a - b + c) = -a + b - c$.'
              },
              {
                title: '2. Base Negativa en Potencias',
                body: 'En $(-a)^n$ el signo pertenece a la base: $(-3)^2 = (-3)(-3) = +9$. En cambio, en $-a^n$ la potencia afecta solo a $a$: $-3^2 = -(3 \\cdot 3) = -9$.'
              },
              {
                title: '3. Exponentes Negativos (Recíprocos)',
                body: 'Si $a \\neq 0$, entonces $a^0 = 1$ y $a^{-n} = \\frac{1}{a^n}$. Asimismo, $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$.'
              },
              {
                title: '4. Exponentes Racionales y Radicales',
                body: 'Para $a > 0$, $\\sqrt[n]{a^m} = a^{\\frac{m}{n}}$. Esta conversión transforma radicales en potencias listas para las reglas del Cálculo.'
              }
            ],
            formulas: [
              {
                label: 'Leyes Fundamentales de los Exponentes',
                expr: 'a^m \\cdot a^n = a^{m+n} \\quad ; \\quad \\frac{a^m}{a^n} = a^{m-n} \\quad (a \\neq 0) \\quad ; \\quad (a^m)^n = a^{m \\cdot n}',
                note: 'Restricción: En el cociente la base a debe ser distinta de cero. Si a = 0 y m = 0, la forma 0⁰ es indeterminada.'
              },
              {
                label: 'Conversión Radical ↔ Exponente Fraccionario y Negativo',
                expr: 'a^{-n} = \\frac{1}{a^n} \\quad ; \\quad \\sqrt[n]{a^m} = a^{\\frac{m}{n}} \\quad ; \\quad \\frac{1}{\\sqrt{x}} = x^{-\\frac{1}{2}}',
                note: 'Si el índice n es par, se requiere a ≥ 0 para que la raíz exista en el conjunto de los números reales ℝ.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Crecimiento de Potencias y Efecto del Exponente',
            description: 'Inspecciona cómo varía la curva $f(x) = 2^x$ para exponentes negativos ($x < 0$, valores fraccionarios entre $0$ y $1$), $x = 0$ ($2^0 = 1$) y positivos ($x > 0$).',
            fnExpr: '2^x',
            initialX0: 2,
            presets: [
              { label: '$f(x) = 2^x$', expr: '2^x', x0: 2 },
              { label: '$f(x) = x^2$', expr: 'x^2', x0: -2 },
              { label: '$f(x) = \\sqrt{x}$', expr: 'sqrt(x)', x0: 4 }
            ]
          },
          examples: [
            {
              title: 'Evaluación con jerarquía de operaciones y potencias',
              problem: 'Calcula el valor exacto de la expresión: $$18 - 3 \\cdot (10 - 2^3) + 4^2 \\div 2$$',
              steps: [
                {
                  title: 'Resolver la potencia dentro del paréntesis',
                  math: '2^3 = 8 \\Rightarrow 18 - 3 \\cdot (10 - 8) + 4^2 \\div 2',
                  reason: 'Dentro del paréntesis tiene prioridad el exponente antes que la resta.'
                },
                {
                  title: 'Completar la operación del paréntesis y evaluar la potencia exterior',
                  math: '10 - 8 = 2, \\quad 4^2 = 16 \\Rightarrow 18 - 3 \\cdot 2 + 16 \\div 2',
                  reason: 'Eliminamos el paréntesis y calculamos el cuadrado de 4.'
                },
                {
                  title: 'Efectuar multiplicaciones y divisiones de izquierda a derecha',
                  math: '3 \\cdot 2 = 6, \\quad 16 \\div 2 = 8 \\Rightarrow 18 - 6 + 8',
                  reason: 'Productos y cocientes se realizan antes que sumas y restas.'
                },
                {
                  title: 'Realizar sumas y restas finales',
                  math: '18 - 6 + 8 = 12 + 8 = 20',
                  reason: 'Operamos de izquierda a derecha para obtener el resultado exacto 20.'
                }
              ]
            },
            {
              title: 'Simplificación con exponentes negativos y fraccionarios',
              problem: 'Calcula el valor exacto sin calculadora de: $$27^{\\frac{2}{3}} + 4^{-1} - (-3)^2$$',
              steps: [
                {
                  title: 'Transformar el exponente fraccionario en raíz cúbica',
                  math: '27^{\\frac{2}{3}} = (\\sqrt[3]{27})^2 = 3^2 = 9',
                  reason: 'Es más sencillo extraer primero la raíz cúbica de 27 (que es 3) y luego elevar al cuadrado.'
                },
                {
                  title: 'Evaluar el exponente negativo y el cuadrado de base negativa',
                  math: '4^{-1} = \\frac{1}{4}, \\quad (-3)^2 = 9',
                  reason: '4⁻¹ es el recíproco 1/4, y (-3)² es positivo (+9) pero tiene un signo menos delante en la expresión.'
                },
                {
                  title: 'Sustituir y simplificar',
                  math: '9 + \\frac{1}{4} - 9 = \\frac{1}{4} = 0.25',
                  reason: '9 y -9 se cancelan, quedando exactamente 1/4.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Confundir (-a)² con -a²',
              wrong: '$-3^2 = +9$',
              right: '$-3^2 = -(3^2) = -9 \\quad \\text{mientras que} \\quad (-3)^2 = +9$',
              advice: 'El exponente solo afecta al símbolo inmediatamente a su izquierda. Si el signo menos no está dentro de un paréntesis, no se eleva al cuadrado.'
            },
            {
              title: 'Sumar antes de multiplicar',
              wrong: '$10 - 2 \\cdot 4 = 8 \\cdot 4 = 32$',
              right: '$10 - 2 \\cdot 4 = 10 - 8 = 2$',
              advice: 'Nunca restes o sumes un número que está multiplicando a otro factor; el producto tiene jerarquía superior.'
            },
            {
              title: 'Creer que el exponente negativo vuelve negativo al número',
              wrong: '$2^{-3} = -8 \\quad \\text{o} \\quad 2^{-3} = -6$',
              right: '$2^{-3} = \\frac{1}{2^3} = \\frac{1}{8}$',
              advice: 'Un exponente negativo indica inversión (división entre la potencia), jamás cambio de signo.'
            }
          ],
          exercises: [
            {
              id: 'arit-1-ex1',
              level: 'basico',
              statement: 'Calcula el resultado respetando la jerarquía de operaciones: $24 - 4 \\cdot (9 - 6) + 2^3$',
              answer: '20',
              alternatives: ['20'],
              placeholder: 'Escribe el número entero...',
              whyCorrect: 'Al resolver primero $(9-6)=3$ y $2^3=8$, la multiplicación $4\\cdot 3=12$ lleva a $24 - 12 + 8 = 20$.',
              reviewTip: 'Recuerda evaluar primero el paréntesis $(9-6)$ y la potencia $2^3$, después multiplicar por $4$ y al final sumar y restar.',
              hints: [
                'Primero resuelve la resta dentro del paréntesis $(9 - 6)$ y la potencia $2^3$.',
                'Dado que $9 - 6 = 3$ y $2^3 = 8$, la expresión se transforma en $24 - 4 \\cdot 3 + 8$.',
                'Realiza primero la multiplicación $4 \\cdot 3 = 12$ y luego calcula $24 - 12 + 8$.'
              ],
              solutionSteps: [
                'Paréntesis y potencia: $(9 - 6) = 3$ y $2^3 = 8$.',
                'Multiplicación: $4 \\cdot 3 = 12$.',
                'Suma y resta de izquierda a derecha: $24 - 12 + 8 = 20$.'
              ]
            },
            {
              id: 'arit-1-ex2',
              level: 'intermedio',
              statement: 'Determina el valor de la expresión con signos de agrupación: $50 - 2 \\cdot [15 - 3 \\cdot (6 - 4)^2]$',
              answer: '44',
              alternatives: ['44'],
              placeholder: 'Resultado numérico...',
              whyCorrect: 'Porque $(6-4)^2 = 4$, luego dentro del corchete $15 - 3(4) = 3$, y finalmente $50 - 2(3) = 44$.',
              reviewTip: 'Revisa que dentro del corchete $[15 - 3\\cdot 4]$ debes efectuar primero la multiplicación $3\\cdot 4 = 12$ antes de restar de $15$.',
              hints: [
                'Comienza evaluando el paréntesis interno: $(6 - 4) = 2$ y luego elévalo al cuadrado.',
                'Como $2^2 = 4$, dentro del corchete queda $[15 - 3 \\cdot 4]$.',
                'Calcula $15 - 12 = 3$, multiplícalo por $2$ y réstalo de $50$.'
              ],
              solutionSteps: [
                'Paréntesis y cuadrado: $(6 - 4)^2 = 2^2 = 4$.',
                'Corchete: $15 - 3 \\cdot 4 = 15 - 12 = 3$.',
                'Operación final: $50 - 2 \\cdot 3 = 50 - 6 = 44$.'
              ]
            },
            {
              id: 'arit-1-ex3',
              level: 'avanzado',
              statement: 'Evalúa la expresión con exponentes fraccionarios y negativos: $8^{\\frac{2}{3}} + 16^{\\frac{1}{2}} - 2^{-1} + \\frac{1}{2}$',
              answer: '8',
              alternatives: ['8'],
              placeholder: 'Valor exacto...',
              whyCorrect: 'Porque $8^{2/3} = (\\sqrt[3]{8})^2 = 4$, $16^{1/2} = \\sqrt{16} = 4$ y $-2^{-1} + \\frac{1}{2} = -\\frac{1}{2} + \\frac{1}{2} = 0$, sumando $4 + 4 = 8$.',
              reviewTip: 'Revisa la conversión de exponentes fraccionarios: $a^{m/n} = (\\sqrt[n]{a})^m$ y recuerda que $2^{-1} = \\frac{1}{2}$.',
              hints: [
                'Convierte cada potencia fraccionaria en radical: $8^{2/3} = (\\sqrt[3]{8})^2$ y $16^{1/2} = \\sqrt{16}$.',
                'Como $\\sqrt[3]{8} = 2$, entonces $2^2 = 4$. Además $\\sqrt{16} = 4$ y $2^{-1} = \\frac{1}{2}$.',
                'Sustituye en $4 + 4 - \\frac{1}{2} + \\frac{1}{2}$.'
              ],
              solutionSteps: [
                '$8^{2/3} = (\\sqrt[3]{8})^2 = 2^2 = 4$.',
                '$16^{1/2} = \\sqrt{16} = 4$ y $2^{-1} = \\frac{1}{2}$.',
                'Suma total: $4 + 4 - \\frac{1}{2} + \\frac{1}{2} = 8$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el resultado correcto de la operación $12 + 8 \\div 4 \\cdot 2 - 3^2$?',
              options: ['7', '1', '11', '-1'],
              correctIndex: 0,
              explanation: 'Primero $3^2 = 9$. Luego división y multiplicación de izquierda a derecha: $8 \\div 4 = 2$ y $2 \\cdot 2 = 4$. Finalmente: $12 + 4 - 9 = 7$.'
            },
            {
              question: '¿Cómo se expresa $\\frac{1}{\\sqrt[3]{x^2}}$ como una sola potencia con exponente racional para $x > 0$?',
              options: ['$x^{-2/3}$', '$x^{-3/2}$', '$x^{2/3}$', '$-x^{2/3}$'],
              correctIndex: 0,
              explanation: 'Como $\\sqrt[3]{x^2} = x^{2/3}$, al estar en el denominador pasa al numerador con exponente negativo: $x^{-2/3}$.'
            },
            {
              question: 'Al simplificar $\\frac{2^5 \\cdot 2^3}{2^6}$ aplicando leyes de los exponentes se obtiene:',
              options: ['4', '2', '8', '16'],
              correctIndex: 0,
              explanation: 'Sumamos exponentes en el numerador: $2^{5+3} = 2^8$. Luego restamos el exponente del denominador: $2^{8-6} = 2^2 = 4$.'
            }
          ]
        },
        {
          id: 'arit-2',
          title: 'Divisibilidad, Fracciones y Proporciones',
          summary: 'Teorema Fundamental de la Aritmética, MCD, MCM, fracciones complejas y proporcionalidad.',
          graphPreset: '(3/4)*x',
          theory: {
            intro: [
              'El dominio de las **fracciones** (números racionales $\\mathbb{Q}$) es indispensable en Álgebra y Cálculo: la pendiente de una recta, la regla del cociente en derivadas y las integrales de potencias producen constantemente expresiones fraccionarias.',
              'Todo entero mayor que $1$ se descompone de forma única en factores primos ($2, 3, 5, 7, 11, \\dots$), lo que permite hallar el **MCD** para simplificar fracciones y el **MCM** para sumarlas sin trabajar con números innecesariamente grandes.'
            ],
            prerequisites: [
              'Criterios básicos de divisibilidad entre $2$ (termina en par), $3$ (suma de cifras múltiplo de $3$) y $5$ (termina en $0$ o $5$).',
              'Multiplicación y división exacta de números enteros.'
            ],
            detailedExplanation: [
              'Para **sumar o restar fracciones de distinto denominador** ($\\frac{a}{b} \\pm \\frac{c}{d}$), primero se calcula el Mínimo Común Múltiplo $M = \\text{MCM}(b, d)$. Luego, cada numerador se multiplica por el cociente entre $M$ y su denominador original: $\\frac{a \\cdot (M/b) \\pm c \\cdot (M/d)}{M}$.',
              'En una **fracción compleja** (división de dos fracciones $\\frac{a/b}{c/d}$), el resultado se obtiene multiplicando los términos extremos para formar el nuevo numerador y los términos medios para formar el nuevo denominador: $\\frac{a \\cdot d}{b \\cdot c}$ (con $b, c, d \\neq 0$).'
            ],
            concepts: [
              {
                title: 'Máximo Común Divisor (MCD)',
                body: 'Producto de los factores primos **comunes** elevados a su **menor** exponente. Permite reducir cualquier fracción a su forma irreducible.'
              },
              {
                title: 'Mínimo Común Múltiplo (MCM)',
                body: 'Producto de los factores primos **comunes y no comunes** elevados a su **mayor** exponente. Es el mínimo común denominador.'
              },
              {
                title: 'Regla de Extremos y Medios',
                body: 'En $\\frac{\\frac{a}{b}}{\\frac{c}{d}} = \\frac{a \\cdot d}{b \\cdot c}$, el producto de los extremos va al numerador y el de los medios al denominador.'
              }
            ],
            formulas: [
              {
                label: 'Operaciones con Números Racionales',
                expr: '\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{ad \\pm bc}{bd} \\quad ; \\quad \\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{ac}{bd} \\quad ; \\quad \\frac{a}{b} \\div \\frac{c}{d} = \\frac{ad}{bc}',
                note: 'Condición: b ≠ 0 y d ≠ 0; en la división además se exige c ≠ 0.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Proporcionalidad Directa e Inversa',
            description: 'Compara una relación de proporcionalidad directa $f(x) = \\frac{3}{4}x$ (recta que pasa por el origen) con una inversa $g(x) = \\frac{6}{x}$.',
            fnExpr: '(3/4)*x',
            initialX0: 4,
            presets: [
              { label: 'Directa $f(x) = \\frac{3}{4}x$', expr: '(3/4)*x', x0: 4 },
              { label: 'Inversa $f(x) = \\frac{6}{x}$', expr: '6/x', x0: 2 }
            ]
          },
          examples: [
            {
              title: 'Simplificación de fracción compleja paso a paso',
              problem: 'Efectúa y simplifica a su mínima expresión: $$\\frac{\\frac{5}{6} - \\frac{1}{4}}{\\frac{7}{12}}$$',
              steps: [
                {
                  title: 'Resolver la resta del numerador usando el MCM(6, 4) = 12',
                  math: '\\frac{5}{6} - \\frac{1}{4} = \\frac{5 \\cdot 2 - 1 \\cdot 3}{12} = \\frac{10 - 3}{12} = \\frac{7}{12}',
                  reason: 'Convertimos ambas fracciones a doceavos antes de restar los numeradores.'
                },
                {
                  title: 'Aplicar cociente de fracciones (extremos y medios)',
                  math: '\\frac{\\frac{7}{12}}{\\frac{7}{12}} = \\frac{7 \\cdot 12}{12 \\cdot 7} = 1',
                  reason: 'Toda cantidad no nula dividida entre sí misma es igual a la unidad.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Sumar numeradores y denominadores directamente',
              wrong: '$\\frac{1}{2} + \\frac{1}{3} = \\frac{1 + 1}{2 + 3} = \\frac{2}{5}$',
              right: '$\\frac{1}{2} + \\frac{1}{3} = \\frac{3 + 2}{6} = \\frac{5}{6}$',
              advice: 'Los denominadores indican el tamaño de las partes; nunca se suman entre sí. Primero obtén el denominador común.'
            }
          ],
          exercises: [
            {
              id: 'arit-2-ex1',
              level: 'basico',
              statement: 'Calcula y simplifica la suma de fracciones: $\\frac{3}{4} + \\frac{5}{6}$',
              answer: '19/12',
              alternatives: ['19/12', '1.5833'],
              placeholder: 'Ej: 19/12',
              whyCorrect: 'El denominador común es $\\text{MCM}(4,6) = 12$, por lo que $\\frac{9}{12} + \\frac{10}{12} = \\frac{19}{12}$.',
              reviewTip: 'Calcula el $\\text{MCM}(4, 6) = 12$ y amplifica cada fracción antes de sumar los numeradores.',
              hints: [
                'Busca el Mínimo Común Múltiplo de los denominadores $4$ y $6$.',
                'El $\\text{MCM}(4, 6) = 12$. Convierte ambas fracciones a doceavos: $\\frac{3}{4} = \\frac{9}{12}$ y $\\frac{5}{6} = \\frac{10}{12}$.',
                'Suma los numeradores sobre el denominador $12$.'
              ],
              solutionSteps: [
                '$\\text{MCM}(4, 6) = 12$.',
                '$\\frac{3}{4} + \\frac{5}{6} = \\frac{9 + 10}{12} = \\frac{19}{12}$.'
              ]
            },
            {
              id: 'arit-2-ex2',
              level: 'intermedio',
              statement: 'Halla el Mínimo Común Múltiplo (MCM) de los números $18$, $24$ y $36$.',
              answer: '72',
              alternatives: ['72'],
              placeholder: 'Escribe el MCM...',
              whyCorrect: 'Con $18 = 2\\cdot 3^2$, $24 = 2^3\\cdot 3$ y $36 = 2^2\\cdot 3^2$, tomando los mayores exponentes obtenemos $2^3 \\cdot 3^2 = 72$.',
              reviewTip: 'Descompón en factores primos ($2$ y $3$) y elige el mayor exponente de cada factor primo.',
              hints: [
                'Descompón cada número en factores primos: $18 = 2 \\cdot 3^2$, $24 = 2^3 \\cdot 3$, $36 = 2^2 \\cdot 3^2$.',
                'Toma cada factor primo ($2$ y $3$) elevado al mayor exponente que aparece.',
                'Multiplica $2^3 \\cdot 3^2$.'
              ],
              solutionSteps: [
                'Factorización: $18 = 2 \\cdot 3^2$, $24 = 2^3 \\cdot 3$, $36 = 2^2 \\cdot 3^2$.',
                'Mayor potencia de $2$ es $2^3 = 8$; mayor potencia de $3$ es $3^2 = 9$.',
                '$\\text{MCM} = 8 \\cdot 9 = 72$.'
              ]
            },
            {
              id: 'arit-2-ex3',
              level: 'avanzado',
              statement: 'Simplifica la fracción compleja: $\\frac{\\frac{2}{3} + \\frac{1}{2}}{\\frac{5}{6} - \\frac{1}{3}}$',
              answer: '7/3',
              alternatives: ['7/3', '2.3333'],
              placeholder: 'Ej: 7/3',
              whyCorrect: 'El numerador vale $\\frac{7}{6}$ y el denominador vale $\\frac{3}{6} = \\frac{1}{2}$; al dividir $\\frac{7/6}{1/2}$ se obtiene $\\frac{14}{6} = \\frac{7}{3}$.',
              reviewTip: 'Calcula por separado la fracción del numerador y la del denominador, y finalmente aplica la regla de extremos y medios.',
              hints: [
                'Resuelve por separado la suma del numerador y la resta del denominador.',
                'En el numerador: $\\frac{2}{3} + \\frac{1}{2} = \\frac{4 + 3}{6} = \\frac{7}{6}$.',
                'En el denominador: $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$. Luego divide $\\frac{7}{6} \\div \\frac{1}{2}$.'
              ],
              solutionSteps: [
                'Numerador: $\\frac{2}{3} + \\frac{1}{2} = \\frac{7}{6}$.',
                'Denominador: $\\frac{5}{6} - \\frac{1}{3} = \\frac{3}{6} = \\frac{1}{2}$.',
                'Cociente: $\\frac{7/6}{1/2} = \\frac{7}{6} \\cdot \\frac{2}{1} = \\frac{7}{3}$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el Máximo Común Divisor (MCD) de 48 y 60?',
              options: ['12', '6', '24', '240'],
              correctIndex: 0,
              explanation: '$48 = 2^4 \\cdot 3$ y $60 = 2^2 \\cdot 3 \\cdot 5$. Los factores comunes con menor exponente son $2^2 \\cdot 3 = 12$.'
            },
            {
              question: '¿Cuál es el resultado simplificado de $\\frac{3}{5} \\div \\frac{9}{10}$?',
              options: ['$\\frac{2}{3}$', '$\\frac{27}{50}$', '$\\frac{3}{2}$', '$\\frac{6}{5}$'],
              correctIndex: 0,
              explanation: 'Multiplicando por el recíproco: $\\frac{3}{5} \\cdot \\frac{10}{9} = \\frac{30}{45} = \\frac{2}{3}$.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       MÓDULO 2: ÁLGEBRA (CON ÉNFASIS EN FACTORIZACIÓN Y RACIONALIZACIÓN PARA LÍMITES)
       ====================================================================== */
    {
      id: 'algebra',
      name: 'Álgebra',
      symbol: 'x²',
      levelTag: 'Preparación al Cálculo',
      color: '#1D4ED8',
      shortDesc: 'Factorización completa, racionalización con conjugado aplicada a límites, ecuaciones y sistemas.',
      topics: [
        {
          id: 'alg-1',
          title: 'Factorización Completa (Preparación para Límites y Cálculo)',
          summary: 'Factor común, agrupación, diferencia de cuadrados, trinomios x²+bx+c y ax²+bx+c, suma/diferencia de cubos y exponentes fraccionarios.',
          graphPreset: 'x^2 - 5*x + 6',
          theory: {
            intro: [
              'La **Factorización** consiste en transformar una suma o resta algebraica (un polinomio) en una **multiplicación de factores más simples**. En el Cálculo Diferencial e Integral, saber factorizar con fluidez es el requisito número uno para cancelar indeterminaciones $\\frac{0}{0}$ en límites, hallar los puntos críticos donde la derivada se anula ($f\'(x) = 0$) y descomponer fracciones racionales para integrarlas.',
              'Todo método de factorización debe aplicarse siguiendo un orden estratégico: primero buscar siempre un **factor común**, y luego contar el número de términos (binomios de dos términos, trinomios de tres términos o polinomios de cuatro términos por agrupación).'
            ],
            prerequisites: [
              'Propiedad distributiva: $a(b + c) = ab + ac$.',
              'Leyes de los exponentes para división de monomios: $\\frac{x^m}{x^n} = x^{m-n}$.',
              'Productos notables: $(a \\pm b)^2 = a^2 \\pm 2ab + b^2$ y $(a+b)(a-b) = a^2 - b^2$.'
            ],
            detailedExplanation: [
              '**1. Factor Común y Factorización por Agrupación:** Si todos los términos comparten un factor numérico (el MCD de los coeficientes) o una variable, se extrae con su **menor exponente**: $6x^4 - 9x^2 = 3x^2(2x^2 - 3)$. Incluso con exponentes fraccionarios o negativos (muy frecuentes al derivar productos), se extrae la menor potencia: en $x^{-1/2}(x+1) + 2x^{1/2}$, el factor común es $x^{-1/2}$, dando $x^{-1/2}[(x+1) + 2x] = x^{-1/2}(3x+1)$. Cuando un polinomio tiene $4$ términos como $ax + ay + bx + by$, se agrupan de dos en dos: $a(x+y) + b(x+y) = (x+y)(a+b)$.',
              '**2. Factorización de Binomios (Diferencia de Cuadrados y Suma/Diferencia de Cubos):** Una diferencia de cuadrados $a^2 - b^2$ se factoriza en binomios conjugados $(a - b)(a + b)$. Una diferencia de cubos $a^3 - b^3$ se factoriza como $(a - b)(a^2 + ab + b^2)$, y una suma de cubos $a^3 + b^3$ como $(a + b)(a^2 - ab + b^2)$. Nota que el signo del primer factor coincide con el original y el término central del trinomio lleva el signo opuesto.',
              '**3. Factorización de Trinomios ($x^2 + bx + c$, Trinomio Cuadrado Perfecto y $ax^2 + bx + c$):** En $x^2 + bx + c$, buscamos dos números $p$ y $q$ cuya suma sea $p + q = b$ y cuyo producto sea $p \\cdot q = c$, obteniendo $(x + p)(x + q)$. En el caso general $ax^2 + bx + c$ (con $a \\neq 1$), buscamos dos números cuya suma sea $b$ y cuyo producto sea $a \\cdot c$, descomponemos el término central $bx$ en dos sumandos y factorizamos por agrupación.'
            ],
            concepts: [
              {
                title: '1. Factor Común y Agrupación',
                body: 'Extrae el MCD de los coeficientes y las variables comunes con el menor exponente: $ab + ac = a(b+c)$. En 4 términos: $ax + ay + bx + by = (a+b)(x+y)$.'
              },
              {
                title: '2. Diferencia de Cuadrados y Cubos',
                body: 'Cuadrados: $a^2 - b^2 = (a - b)(a + b)$. Cubos: $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ y $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$.'
              },
              {
                title: '3. Trinomios Cuadráticos (x²+bx+c y ax²+bx+c)',
                body: 'En $x^2 + bx + c = (x+p)(x+q)$ con $p+q=b$ y $pq=c$. En $ax^2+bx+c$, descompón $bx = mx + nx$ tal que $m \\cdot n = a \\cdot c$ y agrupa.'
              },
              {
                title: '4. Factorización con Exponentes Negativos/Fraccionarios',
                body: 'Siempre saca como factor común el término con el exponente **más pequeño** (más negativo). Al dividir entre $x^k$, resta $k$ a cada exponente.'
              }
            ],
            formulas: [
              {
                label: 'Diferencia de Cuadrados y Trinomio Cuadrado Perfecto (TCP)',
                expr: 'a^2 - b^2 = (a - b)(a + b) \\quad ; \\quad a^2 \\pm 2ab + b^2 = (a \\pm b)^2',
                note: 'Importante: La suma de cuadrados a² + b² es prima (irreducible) en los números reales ℝ.'
              },
              {
                label: 'Diferencia y Suma de Cubos Perfectos',
                expr: 'a^3 - b^3 = (a - b)(a^2 + ab + b^2) \\quad ; \\quad a^3 + b^3 = (a + b)(a^2 - ab + b^2)',
                note: 'El factor cuadrático (a² ± ab + b²) nunca lleva el número 2 en el término central y es irreducible en ℝ.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Relación Geométrica entre Factorización y Raíces Reales',
            description: 'Observa que cuando factorizas $f(x) = x^2 - 5x + 6 = (x - 2)(x - 3)$, los factores revelan inmediatamente los puntos $(2, 0)$ y $(3, 0)$ donde la curva corta al eje $X$.',
            fnExpr: 'x^2 - 5*x + 6',
            initialX0: 2,
            presets: [
              { label: '$x^2 - 5x + 6 = (x-2)(x-3)$', expr: 'x^2 - 5*x + 6', x0: 2 },
              { label: '$x^2 - 4 = (x-2)(x+2)$', expr: 'x^2 - 4', x0: -2 },
              { label: '$x^3 - 4x = x(x-2)(x+2)$', expr: 'x^3 - 4*x', x0: 0 }
            ]
          },
          examples: [
            {
              title: 'Factorización de trinomio de la forma ax² + bx + c por agrupación',
              problem: 'Factoriza completamente el trinomio: $$6x^2 + 7x - 3$$',
              steps: [
                {
                  title: 'Multiplicar el coeficiente principal a = 6 por el término independiente c = -3',
                  math: 'a \\cdot c = 6 \\cdot (-3) = -18',
                  reason: 'Buscamos dos números enteros cuyo producto sea -18 y cuya suma sea el coeficiente central b = +7.'
                },
                {
                  title: 'Encontrar el par de números y descomponer el término central 7x',
                  math: '9 \\cdot (-2) = -18 \\quad \\text{y} \\quad 9 + (-2) = 7 \\Rightarrow 6x^2 + 9x - 2x - 3',
                  reason: 'Reescribimos +7x como +9x - 2x sin alterar el polinomio.'
                },
                {
                  title: 'Factorizar por agrupación de términos',
                  math: '3x(2x + 3) - 1(2x + 3) = (2x + 3)(3x - 1)',
                  reason: 'Extraemos el factor común binomio (2x + 3) de ambos grupos.'
                }
              ]
            },
            {
              title: 'Factorización de diferencia de cubos aplicada a una simplificación para límites',
              problem: 'Factoriza y simplifica la fracción racional para $x \\neq 2$: $$\\frac{x^3 - 8}{x^2 - 4}$$',
              steps: [
                {
                  title: 'Factorizar el numerador como diferencia de cubos (x³ - 2³)',
                  math: 'x^3 - 8 = x^3 - 2^3 = (x - 2)(x^2 + 2x + 4)',
                  reason: 'Aplicamos a³ - b³ = (a - b)(a² + ab + b²) con a = x y b = 2.'
                },
                {
                  title: 'Factorizar el denominador como diferencia de cuadrados (x² - 2²)',
                  math: 'x^2 - 4 = (x - 2)(x + 2)',
                  reason: 'Aplicamos a² - b² = (a - b)(a + b).'
                },
                {
                  title: 'Cancelar el factor común (x - 2)',
                  math: '\\frac{(x - 2)(x^2 + 2x + 4)}{(x - 2)(x + 2)} = \\frac{x^2 + 2x + 4}{x + 2}',
                  reason: 'Esta simplificación elimina la indeterminación 0/0 cuando x tiende a 2.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Intentar factorizar una suma de cuadrados en los reales',
              wrong: '$x^2 + 9 = (x + 3)(x + 3) \\quad \\text{o} \\quad (x + 3)(x - 3)$',
              right: '$x^2 + 9$ es **irreducible** en $\\mathbb{R}$ (pues $(x+3)^2 = x^2 + 6x + 9$)',
              advice: 'Solo la diferencia de cuadrados $a^2 - b^2$ se factoriza en factores lineales reales.'
            },
            {
              title: 'Poner el coeficiente 2 en el trinomio de una diferencia de cubos',
              wrong: '$x^3 - 8 = (x - 2)(x^2 + 4x + 4)$',
              right: '$x^3 - 8 = (x - 2)(x^2 + 2x + 4)$',
              advice: 'En $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$, el término central del segundo paréntesis es simplemente $ab$, no $2ab$.'
            }
          ],
          exercises: [
            {
              id: 'alg-1-ex1',
              level: 'basico',
              statement: 'Factoriza completamente el trinomio de la forma $x^2 + bx + c$: $x^2 - 7x + 12$',
              answer: '(x - 3)*(x - 4)',
              alternatives: ['(x-3)(x-4)', '(x-4)(x-3)', '(x - 4)*(x - 3)'],
              requireFactored: true,
              placeholder: 'Ej: (x - 3)(x - 4)',
              whyCorrect: 'Los números $-3$ y $-4$ cumplen $(-3) + (-4) = -7$ y $(-3)(-4) = +12$, por lo que $x^2 - 7x + 12 = (x - 3)(x - 4)$.',
              reviewTip: 'Busca dos números negativos que sumados den $-7$ y multiplicados den $+12$, y escríbelos como producto $(x - p)(x - q)$.',
              hints: [
                'Busca dos números enteros $p$ y $q$ tales que $p + q = -7$ y $p \\cdot q = +12$.',
                'Como el producto es positivo ($+12$) y la suma es negativa ($-7$), ambos números deben ser negativos.',
                'Prueba con $-3$ y $-4$: escribe el producto de binomios $(x - 3)(x - 4)$.'
              ],
              solutionSteps: [
                'Buscamos dos números que sumen $-7$ y multipliquen $12$: son $-3$ y $-4$.',
                'Factorización: $x^2 - 7x + 12 = (x - 3)(x - 4)$.'
              ]
            },
            {
              id: 'alg-1-ex2',
              level: 'intermedio',
              statement: 'Factoriza por agrupación o método de aspa el trinomio de la forma $ax^2 + bx + c$: $2x^2 + 5x - 3$',
              answer: '(2*x - 1)*(x + 3)',
              alternatives: ['(2x-1)(x+3)', '(x+3)(2x-1)', '(2*x - 1)(x + 3)'],
              requireFactored: true,
              placeholder: 'Ej: (2x - 1)(x + 3)',
              whyCorrect: 'Descomponiendo $5x = 6x - x$ obtenemos $2x^2 + 6x - x - 3 = 2x(x + 3) - 1(x + 3) = (2x - 1)(x + 3)$.',
              reviewTip: 'Multiplica $a \\cdot c = 2(-3) = -6$, busca dos números que multiplicados den $-6$ y sumados den $+5$ (que son $+6$ y $-1$) y agrupa.',
              hints: [
                'Multiplica $a \\cdot c = 2 \\cdot (-3) = -6$. Busca dos números que multiplicados den $-6$ y sumados den $+5$.',
                'Los números son $+6$ y $-1$. Reescribe el trinomio como $2x^2 + 6x - x - 3$.',
                'Agrupa los dos primeros y los dos últimos: $2x(x + 3) - 1(x + 3)$ y extrae el factor común $(x + 3)$.'
              ],
              solutionSteps: [
                'Descomposición del término central: $2x^2 + 6x - x - 3$.',
                'Agrupación: $2x(x + 3) - 1(x + 3) = (2x - 1)(x + 3)$.'
              ]
            },
            {
              id: 'alg-1-ex3',
              level: 'avanzado',
              statement: 'Factoriza la diferencia de cubos en el numerador y simplifica para $x \\neq 3$: $\\frac{x^3 - 27}{x - 3}$',
              answer: 'x^2 + 3*x + 9',
              alternatives: ['x^2+3x+9', 'x^2 + 3*x + 9'],
              placeholder: 'Ej: x^2 + 3x + 9',
              whyCorrect: 'Como $x^3 - 27 = (x - 3)(x^2 + 3x + 9)$, al cancelar el factor $(x - 3)$ queda el trinomio $x^2 + 3x + 9$.',
              reviewTip: 'Aplica la fórmula de diferencia de cubos $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ con $a = x$ y $b = 3$.',
              hints: [
                'Observa que $27 = 3^3$, por lo que el numerador es una diferencia de cubos $x^3 - 3^3$.',
                'Usa la identidad $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ con $a = x$ y $b = 3$.',
                'Sustituye $x^3 - 27 = (x - 3)(x^2 + 3x + 9)$ y cancela el factor $(x - 3)$ con el denominador.'
              ],
              solutionSteps: [
                'Diferencia de cubos: $x^3 - 27 = (x - 3)(x^2 + 3x + 9)$.',
                'Cancelación: $\\frac{(x - 3)(x^2 + 3x + 9)}{x - 3} = x^2 + 3x + 9$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es la factorización completa por agrupación del polinomio $x^3 - 2x^2 + 5x - 10$?',
              options: [
                '$(x - 2)(x^2 + 5)$',
                '$(x + 2)(x^2 - 5)$',
                '$(x - 5)(x^2 + 2)$',
                '$x(x - 2)(x + 5)$'
              ],
              correctIndex: 0,
              explanation: 'Agrupando los dos primeros y los dos últimos términos: $x^2(x - 2) + 5(x - 2) = (x - 2)(x^2 + 5)$.'
            },
            {
              question: 'Al extraer el factor común con menor exponente en la expresión $3x^{-1/2} + 6x^{1/2}$ se obtiene:',
              options: [
                '$3x^{-1/2}(1 + 2x)$',
                '$3x^{1/2}(1 + 2x)$',
                '$3x^{-1/2}(1 + 2x^2)$',
                '$9x^0$'
              ],
              correctIndex: 0,
              explanation: 'El menor exponente es $-1/2$. Al dividir $6x^{1/2}$ entre $3x^{-1/2}$ se restan los exponentes: $\\frac{1}{2} - \\left(-\\frac{1}{2}\\right) = 1$, quedando $3x^{-1/2}(1 + 2x)$.'
            }
          ]
        },

        {
          id: 'alg-2',
          title: 'Racionalización y Uso del Conjugado (Aplicada a Límites)',
          summary: 'Racionalización de denominadores y numeradores con raíces cuadradas, binomio conjugado y eliminación de indeterminaciones.',
          graphPreset: '(sqrt(x) - 2)/(x - 4)',
          theory: {
            intro: [
              'La **Racionalización** es el procedimiento algebraico mediante el cual se eliminan los radicales del denominador (o del numerador) de una fracción multiplicando ambos términos por un factor racionalizante conveniente que equivale a multiplicar por $1$.',
              'Mientras que en Aritmética elemental se suele racionalizar el denominador para presentar resultados elegantes, en el **Cálculo de Límites** es indispensable saber **racionalizar también el numerador**, pues expresiones como $\\frac{\\sqrt{x+4} - 2}{x}$ presentan la indeterminación $\\frac{0}{0}$ en $x = 0$ y solo pueden resolverse multiplicando por su binomio conjugado.'
            ],
            prerequisites: [
              'Propiedad fundamental de la raíz cuadrada: para $A \\geq 0$, $(\\sqrt{A})^2 = A$.',
              'Producto notable de binomios conjugados: $(u - v)(u + v) = u^2 - v^2$.',
              'Factorización básica para cancelar factores comunes tras racionalizar.'
            ],
            detailedExplanation: [
              '**1. Racionalización de un Monomio con Raíz Cuadrada:** Si el denominador es de la forma $\\sqrt{B}$, multiplicamos numerador y denominador por $\\sqrt{B}$: $\\frac{A}{\\sqrt{B}} \\cdot \\frac{\\sqrt{B}}{\\sqrt{B}} = \\frac{A\\sqrt{B}}{B}$.',
              '**2. Uso del Binomio Conjugado en Denominadores y Numeradores:** El conjugado de $\\sqrt{A} - \\sqrt{B}$ es $\\sqrt{A} + \\sqrt{B}$ (solo cambia el signo central que separa ambos términos). Al multiplicarlos, las raíces cuadradas desaparecen gracias a la diferencia de cuadrados: $(\\sqrt{A} - \\sqrt{B})(\\sqrt{A} + \\sqrt{B}) = (\\sqrt{A})^2 - (\\sqrt{B})^2 = A - B$.',
              '**3. Regla de Oro al Racionalizar para Límites:** Cuando multiplicas una fracción por el conjugado para eliminar raíces del numerador, **desarrolla únicamente el producto de los conjugados** y deja indicado (factorizado) el producto del otro lado de la fracción; así podrás cancelar inmediatamente el factor que provocaba el cero.'
            ],
            concepts: [
              {
                title: '1. Conjugado de un Binomio con Raíces',
                body: 'El conjugado de $\\sqrt{x+a} - b$ es $\\sqrt{x+a} + b$. Su producto es $(\\sqrt{x+a})^2 - b^2 = x + a - b^2$.'
              },
              {
                title: '2. Racionalización de Denominadores',
                body: 'Transforma $\\frac{C}{\\sqrt{A} - \\sqrt{B}}$ en $\\frac{C(\\sqrt{A} + \\sqrt{B})}{A - B}$ siempre que $A \\neq B$.'
              },
              {
                title: '3. Racionalización de Numeradores',
                body: 'Transforma $\\frac{\\sqrt{x} - a}{x - a^2}$ en $\\frac{x - a^2}{(x - a^2)(\\sqrt{x} + a)} = \\frac{1}{\\sqrt{x} + a}$ para $x \\neq a^2$.'
              }
            ],
            formulas: [
              {
                label: 'Identidad del Producto por el Conjugado',
                expr: '(\\sqrt{A} - \\sqrt{B})(\\sqrt{A} + \\sqrt{B}) = A - B \\quad ; \\quad (\\sqrt{A} - b)(\\sqrt{A} + b) = A - b^2',
                note: 'Restricción: Los radicandos A y B deben ser no negativos (A ≥ 0, B ≥ 0).'
              }
            ]
          },
          interactiveGraph: {
            mode: 'limits',
            title: 'Cómo la Racionalización Revela el Valor de una Indeterminación',
            description: 'La función $f(x) = \\frac{\\sqrt{x} - 2}{x - 4}$ tiene un hueco $0/0$ en $x = 4$. Al racionalizar el numerador se obtiene $\\frac{1}{\\sqrt{x} + 2}$, que en $x = 4$ vale exactamente $\\frac{1}{4} = 0.25$.',
            fnExpr: '(sqrt(x) - 2)/(x - 4)',
            initialX0: 4,
            holeAt: 4,
            presets: [
              { label: '$\\frac{\\sqrt{x}-2}{x-4}$ en $x=4$', expr: '(sqrt(x) - 2)/(x - 4)', x0: 4, holeAt: 4 },
              { label: '$\\frac{\\sqrt{x+1}-1}{x}$ en $x=0$', expr: '(sqrt(x + 1) - 1)/x', x0: 0, holeAt: 0 }
            ]
          },
          examples: [
            {
              title: 'Racionalización de un denominador binomio mediante conjugado',
              problem: 'Racionaliza y simplifica la expresión numérica: $$\\frac{6}{\\sqrt{7} - 2}$$',
              steps: [
                {
                  title: 'Identificar el binomio conjugado del denominador',
                  math: '\\text{Conjugado de } (\\sqrt{7} - 2) \\text{ es } (\\sqrt{7} + 2)',
                  reason: 'Cambiamos únicamente el signo menos central por un signo más.'
                },
                {
                  title: 'Multiplicar numerador y denominador por el conjugado',
                  math: '\\frac{6}{\\sqrt{7} - 2} \\cdot \\frac{\\sqrt{7} + 2}{\\sqrt{7} + 2} = \\frac{6(\\sqrt{7} + 2)}{(\\sqrt{7})^2 - 2^2}',
                  reason: 'En el denominador aplicamos (a - b)(a + b) = a² - b².'
                },
                {
                  title: 'Simplificar el denominador y cancelar el factor numérico',
                  math: '\\frac{6(\\sqrt{7} + 2)}{7 - 4} = \\frac{6(\\sqrt{7} + 2)}{3} = 2(\\sqrt{7} + 2) = 2\\sqrt{7} + 4',
                  reason: '7 - 4 = 3, y 6 dividido entre 3 es 2.'
                }
              ]
            },
            {
              title: 'Racionalización de numerador para simplificar una fracción con x',
              problem: 'Racionaliza el numerador y simplifica para $x > 0$: $$\\frac{\\sqrt{x + 9} - 3}{x}$$',
              steps: [
                {
                  title: 'Multiplicar por el conjugado del numerador (√(x+9) + 3)',
                  math: '\\frac{\\sqrt{x + 9} - 3}{x} \\cdot \\frac{\\sqrt{x + 9} + 3}{\\sqrt{x + 9} + 3} = \\frac{(\\sqrt{x + 9})^2 - 3^2}{x(\\sqrt{x + 9} + 3)}',
                  reason: 'No expandimos el denominador para conservar visible el factor x.'
                },
                {
                  title: 'Simplificar el numerador y cancelar x',
                  math: '\\frac{x + 9 - 9}{x(\\sqrt{x + 9} + 3)} = \\frac{x}{x(\\sqrt{x + 9} + 3)} = \\frac{1}{\\sqrt{x + 9} + 3}',
                  reason: 'La nueva expresión ya no se indetermina cuando x = 0 (vale 1/(3+3) = 1/6).'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Cambiar el signo dentro de la raíz al formar el conjugado',
              wrong: 'Conjugado de $\\sqrt{x - 3} - 2$ escrito como $\\sqrt{x + 3} + 2$',
              right: 'El conjugado de $\\sqrt{x - 3} - 2$ es $\\sqrt{x - 3} + 2$',
              advice: 'El radicando $(x - 3)$ dentro de la raíz no se toca; solo se invierte el signo que separa a la raíz del segundo término.'
            },
            {
              title: 'Olvidar paréntesis al restar el segundo término en (√A)² - (√B)²',
              wrong: '$(\\sqrt{x + 5})^2 - (\\sqrt{x - 1})^2 = x + 5 - x - 1 = 4$',
              right: '$(\\sqrt{x + 5})^2 - (\\sqrt{x - 1})^2 = (x + 5) - (x - 1) = x + 5 - x + 1 = 6$',
              advice: 'Coloca siempre paréntesis alrededor del radicando que se resta para distribuir correctamente el signo negativo.'
            }
          ],
          exercises: [
            {
              id: 'alg-2-ex1',
              level: 'basico',
              statement: 'Racionaliza el denominador y simplifica al máximo la expresión: $\\frac{10}{\\sqrt{5}}$',
              answer: '2*sqrt(5)',
              alternatives: ['2*sqrt(5)', '2sqrt(5)', '4.4721'],
              placeholder: 'Ej: 2*sqrt(5)',
              whyCorrect: 'Al multiplicar numerador y denominador por $\\sqrt{5}$ se obtiene $\\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}$.',
              reviewTip: 'Multiplica arriba y abajo por $\\sqrt{5}$, usa $(\\sqrt{5})^2 = 5$ y divide $10 \\div 5$.',
              hints: [
                'Multiplica tanto el numerador como el denominador por $\\sqrt{5}$.',
                'En el denominador obtendrás $\\sqrt{5} \\cdot \\sqrt{5} = 5$.',
                'Simplifica la fracción $\\frac{10\\sqrt{5}}{5}$ dividiendo $10$ entre $5$.'
              ],
              solutionSteps: [
                '$\\frac{10}{\\sqrt{5}} \\cdot \\frac{\\sqrt{5}}{\\sqrt{5}} = \\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}$.'
              ]
            },
            {
              id: 'alg-2-ex2',
              level: 'intermedio',
              statement: 'Racionaliza el denominador usando el conjugado y simplifica: $\\frac{8}{\\sqrt{5} - 1}$',
              answer: '2*(sqrt(5) + 1)',
              alternatives: ['2*(sqrt(5)+1)', '2*sqrt(5)+2', '2sqrt(5)+2', '6.4721'],
              placeholder: 'Ej: 2*(sqrt(5) + 1) o 2*sqrt(5) + 2',
              whyCorrect: 'Multiplicando por $\\sqrt{5} + 1$, el denominador es $(\\sqrt{5})^2 - 1^2 = 5 - 1 = 4$, y $\\frac{8(\\sqrt{5}+1)}{4} = 2(\\sqrt{5}+1)$.',
              reviewTip: 'Multiplica numerador y denominador por el conjugado $(\\sqrt{5} + 1)$ y usa $(\\sqrt{5})^2 - 1^2 = 4$ en el denominador.',
              hints: [
                'El conjugado del denominador $\\sqrt{5} - 1$ es $\\sqrt{5} + 1$.',
                'Al multiplicar los denominadores: $(\\sqrt{5} - 1)(\\sqrt{5} + 1) = 5 - 1 = 4$.',
                'Divide el $8$ del numerador entre el $4$ del denominador: $\\frac{8(\\sqrt{5} + 1)}{4}$.'
              ],
              solutionSteps: [
                '$\\frac{8}{\\sqrt{5} - 1} \\cdot \\frac{\\sqrt{5} + 1}{\\sqrt{5} + 1} = \\frac{8(\\sqrt{5} + 1)}{5 - 1}$.',
                '$\\frac{8(\\sqrt{5} + 1)}{4} = 2(\\sqrt{5} + 1) = 2\\sqrt{5} + 2$.'
              ]
            },
            {
              id: 'alg-2-ex3',
              level: 'avanzado',
              statement: 'Racionaliza el numerador de $\\frac{\\sqrt{x + 4} - 2}{x}$ (para $x \\neq 0$) y escribe la expresión simplificada libre de la indeterminación en $x = 0$.',
              answer: '1/(sqrt(x + 4) + 2)',
              alternatives: ['1/(sqrt(x+4)+2)', '(sqrt(x+4)+2)^(-1)'],
              placeholder: 'Ej: 1/(sqrt(x + 4) + 2)',
              whyCorrect: 'Al multiplicar por $\\frac{\\sqrt{x+4}+2}{\\sqrt{x+4}+2}$, el numerador queda $(x+4) - 4 = x$, que se cancela con la $x$ del denominador dejando $\\frac{1}{\\sqrt{x+4}+2}$.',
              reviewTip: 'Multiplica arriba y abajo por el conjugado del numerador $(\\sqrt{x+4} + 2)$ y cancela el factor común $x$.',
              hints: [
                'Multiplica numerador y denominador por el conjugado del numerador: $\\sqrt{x + 4} + 2$.',
                'En el numerador obtienes $(\\sqrt{x + 4})^2 - 2^2 = x + 4 - 4 = x$.',
                'Cancela la $x$ del numerador con la $x$ del denominador en $\\frac{x}{x(\\sqrt{x + 4} + 2)}$.'
              ],
              solutionSteps: [
                '$\\frac{(\\sqrt{x + 4} - 2)(\\sqrt{x + 4} + 2)}{x(\\sqrt{x + 4} + 2)} = \\frac{x + 4 - 4}{x(\\sqrt{x + 4} + 2)}$.',
                'Simplificando $x$: $\\frac{1}{\\sqrt{x + 4} + 2}$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el resultado de racionalizar el numerador en la expresión $\\frac{\\sqrt{x} - 5}{x - 25}$ para $x \\neq 25$?',
              options: [
                '$\\frac{1}{\\sqrt{x} + 5}$',
                '$\\frac{1}{\\sqrt{x} - 5}$',
                '$\\sqrt{x} + 5$',
                '$\\frac{\\sqrt{x} + 5}{x - 25}$'
              ],
              correctIndex: 0,
              explanation: 'Multiplicando por $\\frac{\\sqrt{x} + 5}{\\sqrt{x} + 5}$ se obtiene $\\frac{x - 25}{(x - 25)(\\sqrt{x} + 5)} = \\frac{1}{\\sqrt{x} + 5}$.'
            },
            {
              question: '¿Cuál es el producto exacto de los binomios conjugados $(\\sqrt{x + 3} - \\sqrt{3})(\\sqrt{x + 3} + \\sqrt{3})$?',
              options: ['$x$', '$x + 6$', '$x + 3$', '$\\sqrt{x}$'],
              correctIndex: 0,
              explanation: 'Por diferencia de cuadrados: $(\\sqrt{x + 3})^2 - (\\sqrt{3})^2 = (x + 3) - 3 = x$.'
            }
          ]
        },

        {
          id: 'alg-3',
          title: 'Ecuaciones Lineales, Cuadráticas y Sistemas 2×2',
          summary: 'Resolución analítica de ecuaciones de primer y segundo grado, discriminante, fórmula general y sistemas simultáneos.',
          graphPreset: 'x^2 - 4*x + 3',
          theory: {
            intro: [
              'Las **ecuaciones algebraicas** permiten determinar los valores exactos de una variable donde se cumple una condición: encontrar los cortes de una función con los ejes, las intersecciones entre dos curvas para integrar el área entre ellas, o los valores donde una derivada se hace cero.',
              'Toda ecuación cuadrática $ax^2 + bx + c = 0$ ($a \\neq 0$) puede analizarse mediante su **discriminante** $\\Delta = b^2 - 4ac$ y resolverse por factorización o con la **Fórmula General**.'
            ],
            prerequisites: [
              'Transposición de términos manteniendo el equilibrio de la igualdad.',
              'Factorización de trinomios y extracción de raíces cuadradas.'
            ],
            detailedExplanation: [
              'En una ecuación cuadrática $ax^2 + bx + c = 0$, si es fácilmente factorizable en $(x - r_1)(x - r_2) = 0$, por la **propiedad del producto nulo** ($A \\cdot B = 0 \\iff A = 0 \\text{ o } B = 0$) se obtienen de inmediato las raíces $x_1 = r_1$ y $x_2 = r_2$.',
              'Cuando no es evidente la factorización, la fórmula general $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ proporciona siempre las soluciones exactas.'
            ],
            concepts: [
              {
                title: 'Discriminante (Δ = b² - 4ac)',
                body: 'Si $\\Delta > 0$ hay dos raíces reales distintas; si $\\Delta = 0$ hay una raíz real doble; si $\\Delta < 0$ no existen raíces reales.'
              },
              {
                title: 'Sistemas Lineales 2×2',
                body: 'Representan la intersección de dos rectas en el plano y se resuelven por reducción, sustitución, igualación o Regla de Cramer.'
              }
            ],
            formulas: [
              {
                label: 'Fórmula General Cuadrática y Propiedades de Vieta',
                expr: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad ; \\quad x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}',
                note: 'Condición indispensable: el coeficiente cuadrático debe cumplir a ≠ 0 y la ecuación debe estar igualada a 0.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Interpretación Gráfica del Discriminante en Parábolas',
            description: 'Compara una parábola con $\\Delta > 0$ (dos cortes con el eje $X$), $\\Delta = 0$ (vértice tangente al eje $X$) y $\\Delta < 0$ (sin cortes reales).',
            fnExpr: 'x^2 - 4*x + 3',
            initialX0: 2,
            presets: [
              { label: '$\\Delta > 0:\\; x^2 - 4x + 3$', expr: 'x^2 - 4*x + 3', x0: 2 },
              { label: '$\\Delta = 0:\\; (x - 2)^2$', expr: '(x - 2)^2', x0: 2 },
              { label: '$\\Delta < 0:\\; x^2 - 2x + 3$', expr: 'x^2 - 2*x + 3', x0: 1 }
            ]
          },
          examples: [
            {
              title: 'Resolución completa de ecuación cuadrática',
              problem: 'Encuentra las soluciones reales de la ecuación: $$2x^2 - 7x + 3 = 0$$',
              steps: [
                {
                  title: 'Identificar coeficientes y calcular el discriminante',
                  math: 'a = 2, \\; b = -7, \\; c = 3 \\Rightarrow \\Delta = (-7)^2 - 4(2)(3) = 49 - 24 = 25',
                  reason: 'Como Δ = 25 > 0 y √25 = 5, existen dos soluciones racionales.'
                },
                {
                  title: 'Sustituir en la fórmula general y hallar x₁, x₂',
                  math: 'x = \\frac{7 \\pm 5}{4} \\Rightarrow x_1 = \\frac{12}{4} = 3, \\quad x_2 = \\frac{2}{4} = \\frac{1}{2}',
                  reason: 'Nota que -b = -(-7) = +7.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Olvidar cambiar el signo de b cuando b es negativo',
              wrong: 'En $x^2 - 6x + 5 = 0$, escribir $x = \\frac{-6 \\pm \\sqrt{\\Delta}}{2}$',
              right: 'Como $b = -6$, entonces $-b = -(-6) = +6$, por lo que $x = \\frac{6 \\pm \\sqrt{\\Delta}}{2}$',
              advice: 'Sustituye siempre $b$ entre paréntesis tanto en $-(b)$ como en $(b)^2$.'
            }
          ],
          exercises: [
            {
              id: 'alg-3-ex1',
              level: 'basico',
              statement: 'Resuelve la ecuación lineal y halla el valor de $x$: $5(x - 2) + 3 = 2x + 8$',
              answer: '5',
              alternatives: ['5', 'x=5'],
              placeholder: 'Valor de x...',
              whyCorrect: 'Al expandir $5x - 10 + 3 = 2x + 8$ se obtiene $3x = 15$, de donde $x = 5$.',
              reviewTip: 'Aplica primero la propiedad distributiva $5(x-2) = 5x - 10$ y agrupa las $x$ en el miembro izquierdo.',
              hints: [
                'Primero aplica la propiedad distributiva en el miembro izquierdo: $5(x - 2) = 5x - 10$.',
                'La ecuación queda $5x - 7 = 2x + 8$. Pasa los términos con $x$ a la izquierda y los números a la derecha.',
                'Resuelve $3x = 15$.'
              ],
              solutionSteps: [
                'Expansión: $5x - 10 + 3 = 2x + 8 \\Rightarrow 5x - 7 = 2x + 8$.',
                'Transposición: $5x - 2x = 8 + 7 \\Rightarrow 3x = 15 \\Rightarrow x = 5$.'
              ]
            },
            {
              id: 'alg-3-ex2',
              level: 'intermedio',
              statement: 'Halla las dos raíces reales de la ecuación cuadrática (sepáralas por coma): $x^2 - 8x + 15 = 0$',
              answer: '3, 5',
              alternatives: ['3, 5', '5, 3'],
              placeholder: 'Ej: 3, 5',
              whyCorrect: 'Al factorizar $(x - 3)(x - 5) = 0$, las raíces que anulan cada factor son $x_1 = 3$ y $x_2 = 5$.',
              reviewTip: 'Factoriza el trinomio en $(x - 3)(x - 5) = 0$ e iguala cada factor a cero.',
              hints: [
                'Puedes factorizar buscando dos números que sumados den $-8$ y multiplicados den $15$, o usar la fórmula general.',
                'Los números $-3$ y $-5$ cumplen $(-3) + (-5) = -8$ y $(-3)(-5) = 15$.',
                'Iguala cada factor a cero: $(x - 3)(x - 5) = 0$.'
              ],
              solutionSteps: [
                'Factorización: $x^2 - 8x + 15 = (x - 3)(x - 5) = 0$.',
                'Raíces: $x_1 = 3$ y $x_2 = 5$.'
              ]
            },
            {
              id: 'alg-3-ex3',
              level: 'avanzado',
              statement: 'Resuelve el sistema de ecuaciones $2\\times 2$ e indica el par ordenado $(x, y)$: $2x + y = 11$ y $3x - y = 9$',
              answer: '(4, 3)',
              alternatives: ['4, 3', '(4,3)'],
              placeholder: 'Ej: (4, 3)',
              whyCorrect: 'Sumando ambas ecuaciones se cancela $y$, dando $5x = 20 \\Rightarrow x = 4$, y al sustituir se obtiene $y = 3$.',
              reviewTip: 'Suma ambas ecuaciones verticalmente para eliminar $y$ y despejar $x$.',
              hints: [
                'Observa que la incógnita $y$ tiene coeficientes $+1$ y $-1$ en las dos ecuaciones.',
                'Suma miembro a miembro ambas ecuaciones para eliminar $y$: $(2x + 3x) + (y - y) = 11 + 9$.',
                'Obtendrás $5x = 20$. Halla $x$ y sustitúyelo en $2x + y = 11$ para hallar $y$.'
              ],
              solutionSteps: [
                'Método de reducción: $(2x + y) + (3x - y) = 11 + 9 \\Rightarrow 5x = 20 \\Rightarrow x = 4$.',
                'Sustitución: $2(4) + y = 11 \\Rightarrow y = 3$. Solución: $(4, 3)$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuántas soluciones reales tiene la ecuación cuadrática $x^2 + 4x + 5 = 0$?',
              options: [
                'Ninguna solución real (dos raíces complejas)',
                'Dos soluciones reales distintas',
                'Una única solución real doble',
                'Infinitas soluciones'
              ],
              correctIndex: 0,
              explanation: 'Su discriminante es $\\Delta = 4^2 - 4(1)(5) = 16 - 20 = -4 < 0$, por lo que no corta al eje real $X$.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       MÓDULO 3: GEOMETRÍA
       ====================================================================== */
    {
      id: 'geometria',
      name: 'Geometría',
      symbol: '△',
      levelTag: 'Espacio y Plano',
      color: '#0284C7',
      shortDesc: 'Geometría plana euclidiana, Teorema de Pitágoras, áreas, volúmenes y Geometría Analítica de la recta y cónicas.',
      topics: [
        {
          id: 'geo-1',
          title: 'Triángulos, Teorema de Pitágoras, Áreas y Volúmenes',
          summary: 'Relación pitagórica, semejanza de triángulos y fórmulas métricas esenciales para problemas de optimización.',
          graphPreset: 'sqrt(25 - x^2)',
          theory: {
            intro: [
              'La **Geometría Métrica** proporciona las ecuaciones de restricción y las funciones objetivo en los problemas de razones de cambio relacionadas y optimización en Cálculo (por ejemplo, maximizar el volumen de un cilindro o minimizar la superficie de un envase).',
              'El **Teorema de Pitágoras** ($a^2 + b^2 = c^2$) permite relacionar lados perpendiculares en cualquier configuración plana o espacial.'
            ],
            prerequisites: [
              'Unidades de longitud ($\text{m}$), superficie ($\text{m}^2$) y volumen ($\text{m}^3$).',
              'Despeje de variables cuadráticas mediante raíz cuadrada positiva.'
            ],
            detailedExplanation: [
              'En todo triángulo rectángulo de catetos $a, b$ e hipotenusa $c$, el área del cuadrado construido sobre la hipotenusa iguala la suma de las áreas de los cuadrados sobre los catetos.',
              'En problemas tridimensionales del Cálculo se utilizan constantemente el volumen del cilindro ($V = \\pi r^2 h$), del cono ($V = \\frac{1}{3}\\pi r^2 h$) y de la esfera ($V = \\frac{4}{3}\\pi r^3$, cuya derivada respecto a $r$ es justamente el área superficial $4\\pi r^2$).'
            ],
            concepts: [
              {
                title: 'Teorema de Pitágoras',
                body: 'Hipotenusa: $c = \\sqrt{a^2 + b^2}$. Cateto desconocido: $a = \\sqrt{c^2 - b^2}$.'
              },
              {
                title: 'Áreas Planas Esenciales',
                body: 'Triángulo: $A = \\frac{bh}{2}$. Trapecio: $A = \\frac{(B+b)h}{2}$. Círculo: $A = \\pi r^2$.'
              },
              {
                title: 'Volúmenes para Optimización',
                body: 'Caja rectangular: $V = x \\cdot y \\cdot z$. Cilindro: $V = \\pi r^2 h$. Esfera: $V = \\frac{4}{3}\\pi r^3$.'
              }
            ],
            formulas: [
              {
                label: 'Teorema de Pitágoras, Círculo y Cilindro',
                expr: 'a^2 + b^2 = c^2 \\quad ; \\quad A_{\\circ} = \\pi r^2, \\quad P_{\\circ} = 2\\pi r \\quad ; \\quad V_{\\text{cil}} = \\pi r^2 h',
                note: 'Todas las longitudes (a, b, c, r, h) representan magnitudes positivas (> 0).'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Semicircunferencia y Relación Pitagórica x² + y² = r²',
            description: 'En la semicircunferencia $y = \\sqrt{25 - x^2}$ de radio $r = 5$, cualquier punto $(x_0, y_0)$ forma un triángulo rectángulo con hipotenusa constante $5$.',
            fnExpr: 'sqrt(25 - x^2)',
            initialX0: 3,
            presets: [
              { label: 'Radio $r = 5:\\; \\sqrt{25 - x^2}$', expr: 'sqrt(25 - x^2)', x0: 3 },
              { label: 'Radio $r = 4:\\; \\sqrt{16 - x^2}$', expr: 'sqrt(16 - x^2)', x0: 2 }
            ]
          },
          examples: [
            {
              title: 'Cálculo de cateto desconocido y área de un triángulo rectángulo',
              problem: 'Un triángulo rectángulo tiene una hipotenusa de $13\\text{ cm}$ y una base de $5\\text{ cm}$. Calcula su altura $h$ y su área.',
              steps: [
                {
                  title: 'Despejar el cateto altura h del Teorema de Pitágoras',
                  math: '5^2 + h^2 = 13^2 \\Rightarrow h^2 = 169 - 25 = 144 \\Rightarrow h = \\sqrt{144} = 12\\text{ cm}',
                  reason: 'Restamos el cuadrado del cateto conocido al cuadrado de la hipotenusa.'
                },
                {
                  title: 'Calcular el área del triángulo',
                  math: 'A = \\frac{5 \\cdot 12}{2} = 30\\text{ cm}^2',
                  reason: 'Multiplicamos la base por la altura y dividimos entre 2.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Distribuir la raíz cuadrada sobre una suma',
              wrong: '$\\sqrt{a^2 + b^2} = a + b$',
              right: '$\\sqrt{a^2 + b^2} \\neq a + b \\quad (\\text{por ejemplo, } \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5 \\neq 7)$',
              advice: 'La raíz cuadrada nunca es distributiva respecto a la suma ni a la resta.'
            }
          ],
          exercises: [
            {
              id: 'geo-1-ex1',
              level: 'basico',
              statement: 'Calcula la longitud de la hipotenusa de un triángulo rectángulo cuyos catetos miden $6\\text{ m}$ y $8\\text{ m}$.',
              answer: '10',
              alternatives: ['10'],
              placeholder: 'Longitud de la hipotenusa...',
              whyCorrect: 'Por el Teorema de Pitágoras, $c = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$.',
              reviewTip: 'Aplica $c = \\sqrt{a^2 + b^2}$ sumando los cuadrados de los catetos antes de extraer la raíz.',
              hints: [
                'Usa la fórmula del Teorema de Pitágoras: $c = \\sqrt{a^2 + b^2}$.',
                'Eleva al cuadrado ambos catetos: $6^2 = 36$ y $8^2 = 64$.',
                'Suma $36 + 64$ y calcula su raíz cuadrada.'
              ],
              solutionSteps: [
                '$c^2 = 6^2 + 8^2 = 36 + 64 = 100$.',
                '$c = \\sqrt{100} = 10\\text{ m}$.'
              ]
            },
            {
              id: 'geo-1-ex2',
              level: 'intermedio',
              statement: 'Una escalera de $15\\text{ m}$ se apoya contra una pared vertical. Si el pie de la escalera está a $9\\text{ m}$ de la base de la pared, ¿a qué altura alcanza la escalera?',
              answer: '12',
              alternatives: ['12'],
              placeholder: 'Altura en metros...',
              whyCorrect: 'Despejando el cateto vertical: $h = \\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = 12\\text{ m}$.',
              reviewTip: 'Como conoces la hipotenusa ($15$) y un cateto ($9$), debes restar $15^2 - 9^2$ antes de sacar la raíz cuadrada.',
              hints: [
                'La escalera actúa como la hipotenusa ($c = 15$) y la distancia al muro es un cateto ($a = 9$).',
                'Plantea $9^2 + h^2 = 15^2$.',
                'Despeja $h = \\sqrt{225 - 81}$.'
              ],
              solutionSteps: [
                '$h^2 = 15^2 - 9^2 = 225 - 81 = 144$.',
                '$h = \\sqrt{144} = 12\\text{ m}$.'
              ]
            },
            {
              id: 'geo-1-ex3',
              level: 'avanzado',
              statement: 'Halla el área exacta de un triángulo equilátero cuyo lado mide $L = 4\\text{ cm}$. (Puedes escribir `4*sqrt(3)`).',
              answer: '4*sqrt(3)',
              alternatives: ['4*sqrt(3)', '4sqrt(3)', '6.9282'],
              placeholder: 'Ej: 4*sqrt(3)',
              whyCorrect: 'La altura divide la base en dos segmentos de $2\\text{ cm}$, por lo que $h = \\sqrt{4^2 - 2^2} = 2\\sqrt{3}$ y el área es $\\frac{4 \\cdot 2\\sqrt{3}}{2} = 4\\sqrt{3}$.',
              reviewTip: 'Calcula primero la altura $h = \\sqrt{L^2 - (L/2)^2}$ y luego multiplica base por altura entre $2$.',
              hints: [
                'Al trazar la altura de un triángulo equilátero de lado $4$, la base se divide en dos segmentos de $2\\text{ cm}$.',
                'Por Pitágoras, la altura cumple $h = \\sqrt{4^2 - 2^2} = \\sqrt{12} = 2\\sqrt{3}$.',
                'Calcula el área como $A = \\frac{\\text{base} \\cdot h}{2} = \\frac{4 \\cdot 2\\sqrt{3}}{2}$.'
              ],
              solutionSteps: [
                'Altura por Pitágoras: $h = \\sqrt{4^2 - 2^2} = \\sqrt{12} = 2\\sqrt{3}\\text{ cm}$.',
                'Área: $A = \\frac{4 \\cdot 2\\sqrt{3}}{2} = 4\\sqrt{3}\\text{ cm}^2$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el área exacta de un círculo cuyo diámetro mide 10 cm?',
              options: ['$25\\pi\\text{ cm}^2$', '$100\\pi\\text{ cm}^2$', '$10\\pi\\text{ cm}^2$', '$50\\pi\\text{ cm}^2$'],
              correctIndex: 0,
              explanation: 'Si el diámetro es $10\\text{ cm}$, el radio es $r = 5\\text{ cm}$. Por tanto $A = \\pi r^2 = \\pi (5)^2 = 25\\pi\\text{ cm}^2$.'
            }
          ]
        },

        {
          id: 'geo-2',
          title: 'Geometría Analítica: Pendiente, Recta Tangente y Normal',
          summary: 'Distancia entre dos puntos, pendiente como razón de cambio, ecuación punto-pendiente y rectas perpendiculares.',
          graphPreset: '2*x + 1',
          theory: {
            intro: [
              'La **Geometría Analítica** es el puente directo hacia el Cálculo Diferencial: el problema central de las Derivadas consiste en hallar la **pendiente $m$** y la **ecuación punto-pendiente** de la recta tangente y de la recta normal a una curva en un punto dado $(x_0, y_0)$.',
              'La pendiente $m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}$ mide la razón de cambio vertical respecto al avance horizontal.'
            ],
            prerequisites: [
              'Ubicación de pares ordenados $(x, y)$ en los cuatro cuadrantes del plano cartesiano.',
              'Operaciones con números con signo al calcular diferencias $y_2 - y_1$.'
            ],
            detailedExplanation: [
              'Conocidos un punto $P(x_0, y_0)$ y la pendiente $m$, la recta queda completamente determinada por la **ecuación punto-pendiente**: $y - y_0 = m(x - x_0)$, que al despejar $y$ toma la forma explícita $y = mx + b$.',
              'Dos rectas no verticales son **paralelas** si y solo si tienen la misma pendiente ($m_1 = m_2$), y son **perpendiculares** (como la recta tangente y la recta normal en Cálculo) si sus pendientes son recíprocas y de signo opuesto: $m_{\\text{normal}} = -\\frac{1}{m_{\\text{tan}}}$.'
            ],
            concepts: [
              {
                title: 'Ecuación Punto-Pendiente',
                body: '$y - y_0 = m(x - x_0)$. Es la fórmula más utilizada en Cálculo Diferencial para construir la recta tangente.'
              },
              {
                title: 'Condición de Perpendicularidad',
                body: 'Si dos rectas son perpendiculares, $m_1 \\cdot m_2 = -1 \\iff m_2 = -\\frac{1}{m_1}$.'
              }
            ],
            formulas: [
              {
                label: 'Distancia, Pendiente y Ecuación Punto-Pendiente',
                expr: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \\quad ; \\quad m = \\frac{y_2 - y_1}{x_2 - x_1} \\quad ; \\quad y - y_0 = m(x - x_0)',
                note: 'Si x₂ = x₁, la recta es vertical (x = x₁) y su pendiente no está definida en ℝ.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Pendiente y Ordenada al Origen de una Recta',
            description: 'Explora cómo cambian la inclinación ($m$) y el corte con el eje vertical ($b$) en la familia de rectas $y = mx + b$.',
            fnExpr: '2*x + 1',
            initialX0: 1,
            presets: [
              { label: 'Creciente $y = 2x + 1$', expr: '2*x + 1', x0: 1 },
              { label: 'Perpendicular $y = -\\frac{1}{2}x + 1$', expr: '-0.5*x + 1', x0: 2 },
              { label: 'Horizontal $y = 3$', expr: '3', x0: 0 }
            ]
          },
          examples: [
            {
              title: 'Ecuación de la recta que pasa por dos puntos',
              problem: 'Halla la ecuación explícita $y = mx + b$ de la recta que pasa por $A(1, 3)$ y $B(4, 9)$.',
              steps: [
                {
                  title: 'Calcular la pendiente m',
                  math: 'm = \\frac{9 - 3}{4 - 1} = \\frac{6}{3} = 2',
                  reason: 'Por cada unidad que avanza x, la ordenada y sube 2 unidades.'
                },
                {
                  title: 'Sustituir en la ecuación punto-pendiente con A(1, 3)',
                  math: 'y - 3 = 2(x - 1) \\Rightarrow y = 2x - 2 + 3 \\Rightarrow y = 2x + 1',
                  reason: 'Despejamos y para obtener la forma pendiente-ordenada al origen.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Invertir el orden de las coordenadas en la fórmula de la pendiente',
              wrong: '$m = \\frac{x_2 - x_1}{y_2 - y_1}$',
              right: '$m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}$',
              advice: 'La variación vertical $\\Delta y$ va siempre en el numerador y la horizontal $\\Delta x$ en el denominador.'
            }
          ],
          exercises: [
            {
              id: 'geo-2-ex1',
              level: 'basico',
              statement: 'Calcula la distancia entre los puntos $A(1, 2)$ y $B(4, 6)$ en el plano cartesiano.',
              answer: '5',
              alternatives: ['5'],
              placeholder: 'Distancia...',
              whyCorrect: 'Los incrementos son $\\Delta x = 3$ y $\\Delta y = 4$, por lo que $d = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.',
              reviewTip: 'Usa $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.',
              hints: [
                'Calcula las diferencias de coordenadas: $\\Delta x = 4 - 1 = 3$ y $\\Delta y = 6 - 2 = 4$.',
                'Aplica $d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$.',
                'Calcula $\\sqrt{3^2 + 4^2}$.'
              ],
              solutionSteps: [
                '$d = \\sqrt{(4 - 1)^2 + (6 - 2)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.'
              ]
            },
            {
              id: 'geo-2-ex2',
              level: 'intermedio',
              statement: 'Encuentra la expresión $mx + b$ de la recta que pasa por $(0, -2)$ y $(3, 7)$. (Escribe p. ej. `3x - 2`).',
              answer: '3*x - 2',
              alternatives: ['3x-2', '3*x-2'],
              placeholder: 'Ej: 3x - 2',
              whyCorrect: 'La pendiente es $m = \\frac{7 - (-2)}{3 - 0} = 3$ y la ordenada al origen es $b = -2$, resultando $3x - 2$.',
              reviewTip: 'Halla primero la pendiente $m = \\frac{y_2 - y_1}{x_2 - x_1}$ cuidando el doble signo en $7 - (-2)$.',
              hints: [
                'Calcula primero la pendiente: $m = \\frac{7 - (-2)}{3 - 0}$.',
                'Como $m = \\frac{9}{3} = 3$ y el punto $(0, -2)$ nos da la ordenada al origen $b = -2$, sustituye en $mx + b$.',
                'Escribe la expresión lineal resultante.'
              ],
              solutionSteps: [
                'Pendiente: $m = \\frac{7 - (-2)}{3 - 0} = \\frac{9}{3} = 3$.',
                'Ordenada al origen: $b = -2$. Ecuación: $y = 3x - 2$.'
              ]
            },
            {
              id: 'geo-2-ex3',
              level: 'avanzado',
              statement: '¿Cuál es la pendiente de una recta perpendicular a la recta $2x + 6y - 5 = 0$?',
              answer: '3',
              alternatives: ['3'],
              placeholder: 'Pendiente perpendicular...',
              whyCorrect: 'Despejando $y = -\\frac{1}{3}x + \\frac{5}{6}$, la pendiente original es $m_1 = -\\frac{1}{3}$ y su recíproca de signo opuesto es $m_2 = 3$.',
              reviewTip: 'Despeja $y$ para identificar $m_1$ y luego calcula $m_2 = -\\frac{1}{m_1}$.',
              hints: [
                'Primero despeja $y$ de la ecuación dada para conocer su pendiente $m_1$: $6y = -2x + 5$.',
                'La pendiente de la recta original es $m_1 = -\\frac{2}{6} = -\\frac{1}{3}$.',
                'La pendiente perpendicular cumple $m_2 = -\\frac{1}{m_1}$.'
              ],
              solutionSteps: [
                'Despejando $y$: $y = -\\frac{1}{3}x + \\frac{5}{6} \\Rightarrow m_1 = -\\frac{1}{3}$.',
                'Pendiente perpendicular: $m_2 = -\\frac{1}{-1/3} = 3$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuáles son las coordenadas del punto medio del segmento que une $P(-2, 5)$ y $Q(6, 1)$?',
              options: ['$(2, 3)$', '$(4, 6)$', '$(2, 2)$', '$(4, 3)$'],
              correctIndex: 0,
              explanation: '$M = \\left(\\frac{-2 + 6}{2}, \\frac{5 + 1}{2}\\right) = (2, 3)$.'
            }
          ]
        }
      ]
    }
  ];

  curriculum.push(...part1);
})(window.MatInteractiva.Curriculum);
