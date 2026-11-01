/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Currículo Parte 2: Trigonometría, Funciones y Límites
   Incluye el desarrollo profundo y completo del módulo de LÍMITES con las
   9 etapas didácticas y gráficas interactivas integradas.
   Archivo: js/data/curriculum-part2.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};
window.MatInteractiva.Curriculum = window.MatInteractiva.Curriculum || [];

(function (curriculum) {
  'use strict';

  const part2 = [
    /* ======================================================================
       MÓDULO 4: TRIGONOMETRÍA
       ====================================================================== */
    {
      id: 'trigonometria',
      name: 'Trigonometría',
      symbol: 'θ',
      levelTag: 'Relaciones Angulares',
      color: '#0D9488',
      shortDesc: 'Razones trigonométricas, radianes, círculo unitario, identidades fundamentales y leyes de senos y cosenos.',
      topics: [
        {
          id: 'trig-1',
          title: 'Razones Trigonométricas, Radianes y Círculo Unitario',
          summary: 'Definición de seno, coseno, tangente y recíprocas, medida en radianes indispensable para el Cálculo y ángulos notables.',
          graphPreset: 'sin(x)',
          theory: {
            intro: [
              'La **Trigonometría** estudia las relaciones entre los lados y los ángulos de los triángulos y las funciones periódicas definidas sobre el **círculo unitario** ($x^2 + y^2 = 1$).',
              'En Cálculo Diferencial e Integral (límites trigonométricos, derivadas e integrales de $\\operatorname{sen}(x)$ y $\\cos(x)$), los ángulos se miden obligatoriamente en **radianes**, ya que solo en radianes se cumple que $\\lim_{x \\to 0} \\frac{\\operatorname{sen}(x)}{x} = 1$ y que $\\frac{d}{dx}[\\operatorname{sen}(x)] = \\cos(x)$.'
            ],
            prerequisites: [
              'Teorema de Pitágoras en el triángulo rectángulo: $a^2 + b^2 = c^2$.',
              'Longitud de la circunferencia de radio $r$: $L = 2\\pi r$.'
            ],
            detailedExplanation: [
              'Un **radián** es la medida del ángulo central que subtiende un arco de longitud igual al radio de la circunferencia. Como la circunferencia completa mide $2\\pi r$, un giro completo de $360^\\circ$ equivale exactamente a $2\\pi$ radianes, y media vuelta ($180^\\circ$) equivale a $\\pi$ radianes.',
              'En el círculo unitario ($r = 1$), cualquier ángulo $\\theta$ medido desde el semieje positivo $X$ determina un punto único sobre la circunferencia cuyas coordenadas son exactamente $P(\\cos(\\theta), \\operatorname{sen}(\\theta))$.'
            ],
            concepts: [
              {
                title: '1. Razones Directas (SOH-CAH-TOA)',
                body: '$\\operatorname{sen}(\\theta) = \\frac{\\text{Opuesto}}{\\text{Hipotenusa}}$, $\\cos(\\theta) = \\frac{\\text{Adyacente}}{\\text{Hipotenusa}}$, $\\tan(\\theta) = \\frac{\\text{Opuesto}}{\\text{Adyacente}} = \\frac{\\operatorname{sen}(\\theta)}{\\cos(\\theta)}$.'
              },
              {
                title: '2. Razones Recíprocas',
                body: 'Secante: $\\sec(\\theta) = \\frac{1}{\\cos(\\theta)}$. Cosecante: $\\csc(\\theta) = \\frac{1}{\\operatorname{sen}(\\theta)}$. Cotangente: $\\cot(\\theta) = \\frac{\\cos(\\theta)}{\\operatorname{sen}(\\theta)}$.'
              },
              {
                title: '3. Ángulos Notables en Radianes',
                body: '$30^\\circ = \\frac{\\pi}{6}$ ($\\operatorname{sen}=\\frac{1}{2}, \\cos=\\frac{\\sqrt{3}}{2}$); $45^\\circ = \\frac{\\pi}{4}$ ($\\operatorname{sen}=\\cos=\\frac{\\sqrt{2}}{2}$); $60^\\circ = \\frac{\\pi}{3}$ ($\\operatorname{sen}=\\frac{\\sqrt{3}}{2}, \\cos=\\frac{1}{2}$).'
              }
            ],
            formulas: [
              {
                label: 'Conversión entre Grados y Radianes',
                expr: '\\theta_{\\text{rad}} = \\theta_{\\text{grados}} \\cdot \\frac{\\pi}{180^\\circ} \\quad ; \\quad \\theta_{\\text{grados}} = \\theta_{\\text{rad}} \\cdot \\frac{180^\\circ}{\\pi}',
                note: 'Equivalencias esenciales: π/6 = 30°, π/4 = 45°, π/3 = 60°, π/2 = 90°, π = 180°, 2π = 360°.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Ondas Periódicas: Seno, Coseno y Tangente (en Radianes)',
            description: 'Explora la periodicidad de $2\\pi \\approx 6.283$ radianes de las ondas $\\operatorname{sen}(x)$ y $\\cos(x)$.',
            fnExpr: 'sin(x)',
            initialX0: 1.57,
            presets: [
              { label: '$f(x) = \\operatorname{sen}(x)$', expr: 'sin(x)', x0: 1.57 },
              { label: '$f(x) = \\cos(x)$', expr: 'cos(x)', x0: 0 },
              { label: '$f(x) = \\tan(x)$', expr: 'tan(x)', x0: 0.785 }
            ]
          },
          examples: [
            {
              title: 'Determinación de todas las razones trigonométricas mediante Pitágoras',
              problem: 'En un triángulo rectángulo, el cateto opuesto a $\\theta$ mide $8$ y el cateto adyacente mide $15$. Calcula $\\operatorname{sen}(\\theta)$, $\\cos(\\theta)$ y $\\sec(\\theta)$.',
              steps: [
                {
                  title: 'Hallar la hipotenusa por el Teorema de Pitágoras',
                  math: 'c = \\sqrt{8^2 + 15^2} = \\sqrt{64 + 225} = \\sqrt{289} = 17',
                  reason: 'La hipotenusa mide 17 unidades.'
                },
                {
                  title: 'Formar las razones trigonométricas pedidas',
                  math: '\\operatorname{sen}(\\theta) = \\frac{8}{17}, \\quad \\cos(\\theta) = \\frac{15}{17}, \\quad \\sec(\\theta) = \\frac{1}{\\cos(\\theta)} = \\frac{17}{15}',
                  reason: 'La secante es la razón recíproca del coseno.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Confundir secante con el recíproco del seno',
              wrong: '$\\sec(\\theta) = \\frac{1}{\\operatorname{sen}(\\theta)}$',
              right: '$\\sec(\\theta) = \\frac{1}{\\cos(\\theta)} \\quad \\text{y} \\quad \\csc(\\theta) = \\frac{1}{\\operatorname{sen}(\\theta)}$',
              advice: 'Truco mnemotécnico: las parejas recíprocas nunca empiezan con la misma letra (Seno ↔ Cosecante; Coseno ↔ Secante).'
            }
          ],
          exercises: [
            {
              id: 'trig-1-ex1',
              level: 'basico',
              statement: 'Convierte el ángulo de $135^\\circ$ a radianes. (Escribe en función de `pi`, por ejemplo `3*pi/4`).',
              answer: '3*pi/4',
              alternatives: ['3*pi/4', '2.3562'],
              placeholder: 'Ej: 3*pi/4',
              whyCorrect: 'Simplificando $\\frac{135\\pi}{180}$ entre $45$ se obtiene exactamente $\\frac{3\\pi}{4}\\text{ rad}$.',
              reviewTip: 'Multiplica $135 \\cdot \\frac{\\pi}{180}$ y simplifica la fracción dividiendo entre $45$.',
              hints: [
                'Multiplica $135$ por el factor de conversión $\\frac{\\pi}{180}$.',
                'Simplifica la fracción $\\frac{135}{180}$ dividiendo numerador y denominador entre $45$.',
                'Como $135 \\div 45 = 3$ y $180 \\div 45 = 4$, obtienes el múltiplo de $\\pi$.'
              ],
              solutionSteps: [
                '$\\theta = 135^\\circ \\cdot \\frac{\\pi}{180^\\circ} = \\frac{135\\pi}{180} = \\frac{3\\pi}{4}\\text{ rad}$.'
              ]
            },
            {
              id: 'trig-1-ex2',
              level: 'intermedio',
              statement: 'Calcula el valor numérico exacto de: $2 \\cdot \\operatorname{sen}\\left(\\frac{\\pi}{6}\\right) + \\tan\\left(\\frac{\\pi}{4}\\right) + 4 \\cdot \\cos\\left(\\frac{\\pi}{3}\\right)$',
              answer: '4',
              alternatives: ['4'],
              placeholder: 'Valor numérico...',
              whyCorrect: 'Como $\\operatorname{sen}(\\pi/6) = 1/2$, $\\tan(\\pi/4) = 1$ y $\\cos(\\pi/3) = 1/2$, tenemos $2(1/2) + 1 + 4(1/2) = 4$.',
              reviewTip: 'Recuerda que $\\frac{\\pi}{6} = 30^\\circ$, $\\frac{\\pi}{4} = 45^\\circ$ y $\\frac{\\pi}{3} = 60^\\circ$.',
              hints: [
                'Recuerda los valores de los ángulos notables: $\\operatorname{sen}(\\pi/6) = \\frac{1}{2}$, $\\tan(\\pi/4) = 1$ y $\\cos(\\pi/3) = \\frac{1}{2}$.',
                'Sustituye cada valor: $2(1/2) + 1 + 4(1/2)$.',
                'Realiza la suma final.'
              ],
              solutionSteps: [
                '$\\operatorname{sen}(\\pi/6) = 0.5$, $\\tan(\\pi/4) = 1$, $\\cos(\\pi/3) = 0.5$.',
                '$2(0.5) + 1 + 4(0.5) = 1 + 1 + 2 = 4$.'
              ]
            },
            {
              id: 'trig-1-ex3',
              level: 'avanzado',
              statement: 'Si $\\theta$ es un ángulo agudo tal que $\\cos(\\theta) = \\frac{5}{13}$, ¿cuál es el valor exacto de $\\tan(\\theta)$?',
              answer: '12/5',
              alternatives: ['12/5', '2.4'],
              placeholder: 'Ej: 12/5',
              whyCorrect: 'El cateto opuesto es $\\sqrt{13^2 - 5^2} = 12$, por lo que $\\tan(\\theta) = \\frac{\\text{Opuesto}}{\\text{Adyacente}} = \\frac{12}{5}$.',
              reviewTip: 'Usa Pitágoras con hipotenusa $13$ y cateto adyacente $5$ para hallar el cateto opuesto.',
              hints: [
                'Si $\\cos(\\theta) = \\frac{\\text{Adyacente}}{\\text{Hipotenusa}} = \\frac{5}{13}$, toma cateto adyacente $= 5$ e hipotenusa $= 13$.',
                'Halla el cateto opuesto por Pitágoras: $\\text{Opuesto} = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12$.',
                'Calcula $\\tan(\\theta) = \\frac{\\text{Opuesto}}{\\text{Adyacente}}$.'
              ],
              solutionSteps: [
                'Cateto opuesto: $b = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = 12$.',
                '$\\tan(\\theta) = \\frac{12}{5} = 2.4$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿A cuántos grados sexagesimales equivalen $\\frac{5\\pi}{6}$ radianes?',
              options: ['$150^\\circ$', '$120^\\circ$', '$135^\\circ$', '$210^\\circ$'],
              correctIndex: 0,
              explanation: 'Sustituyendo $\\pi = 180^\\circ$: $\\frac{5 \\cdot 180^\\circ}{6} = 5 \\cdot 30^\\circ = 150^\\circ$.'
            }
          ]
        },

        {
          id: 'trig-2',
          title: 'Identidades Trigonométricas para el Cálculo y Ley de Cosenos',
          summary: 'Identidades pitagóricas, ángulo doble, reducción de potencias para integrales y resolución de triángulos.',
          graphPreset: 'sin(2*x)',
          theory: {
            intro: [
              'Las **identidades trigonométricas** permiten transformar expresiones complejas en otras equivalentes mucho más sencillas de limitar, derivar o integrar.',
              'Por ejemplo, para integrar $\\int \\operatorname{sen}^2(x)\\,dx$ o resolver el límite $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2}$, es indispensable utilizar las identidades pitagóricas y las del ángulo doble.'
            ],
            prerequisites: [
              'Definición de las razones trigonométricas en el círculo unitario.',
              'Factorización de expresiones algebraicas.'
            ],
            detailedExplanation: [
              'Aplicando el Teorema de Pitágoras en el círculo unitario ($x = \\cos(\\theta), y = \\operatorname{sen}(\\theta), r = 1$) se obtiene la **Identidad Pitagórica Fundamental**: $\\operatorname{sen}^2(\\theta) + \\cos^2(\\theta) = 1$. Dividiendo toda la ecuación entre $\\cos^2(\\theta)$ resulta $1 + \\tan^2(\\theta) = \\sec^2(\\theta)$.',
              'De las fórmulas del coseno del ángulo doble $\\cos(2\\theta) = \\cos^2(\\theta) - \\operatorname{sen}^2(\\theta)$ se deducen las **fórmulas de reducción de potencia**: $\\operatorname{sen}^2(\\theta) = \\frac{1 - \\cos(2\\theta)}{2}$ y $\\cos^2(\\theta) = \\frac{1 + \\cos(2\\theta)}{2}$.'
            ],
            concepts: [
              {
                title: '1. Identidades Pitagóricas',
                body: '$\\operatorname{sen}^2(\\theta) + \\cos^2(\\theta) = 1 \\iff 1 - \\cos^2(\\theta) = \\operatorname{sen}^2(\\theta)$, y además $1 + \\tan^2(\\theta) = \\sec^2(\\theta)$.'
              },
              {
                title: '2. Identidades del Ángulo Doble',
                body: '$\\operatorname{sen}(2\\theta) = 2\\operatorname{sen}(\\theta)\\cos(\\theta)$ y $\\cos(2\\theta) = \\cos^2(\\theta) - \\operatorname{sen}^2(\\theta) = 1 - 2\\operatorname{sen}^2(\\theta)$.'
              },
              {
                title: '3. Ley de los Cosenos',
                body: 'Para cualquier triángulo de lados $a, b, c$: $c^2 = a^2 + b^2 - 2ab\\cos(C)$.'
              }
            ],
            formulas: [
              {
                label: 'Identidades Pitagóricas y del Ángulo Doble',
                expr: '\\operatorname{sen}^2(\\theta) + \\cos^2(\\theta) = 1 \\quad ; \\quad 1 + \\tan^2(\\theta) = \\sec^2(\\theta) \\quad ; \\quad \\operatorname{sen}(2\\theta) = 2\\operatorname{sen}(\\theta)\\cos(\\theta)',
                note: 'Válidas para todo θ ∈ ℝ (en 1 + tan²(θ) = sec²(θ) se requiere cos(θ) ≠ 0).'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Identidad del Ángulo Doble y Pitagórica',
            description: 'Compara $\\operatorname{sen}(2x)$ con $2\\operatorname{sen}(x)\\cos(x)$, o verifica que $\\operatorname{sen}^2(x) + \\cos^2(x)$ es la recta constante $y = 1$.',
            fnExpr: 'sin(2*x)',
            initialX0: 0.785,
            presets: [
              { label: '$\\operatorname{sen}(2x)$', expr: 'sin(2*x)', x0: 0.785 },
              { label: '$\\operatorname{sen}^2(x) + \\cos^2(x) = 1$', expr: 'sin(x)^2 + cos(x)^2', x0: 1 }
            ]
          },
          examples: [
            {
              title: 'Simplificación trigonométrica mediante identidad pitagórica',
              problem: 'Simplifica la expresión para $\\cos(x) \\neq 1$: $$\\frac{\\operatorname{sen}^2(x)}{1 - \\cos(x)}$$',
              steps: [
                {
                  title: 'Sustituir sen²(x) = 1 - cos²(x) en el numerador',
                  math: '\\frac{1 - \\cos^2(x)}{1 - \\cos(x)}',
                  reason: 'Despejamos sen²(x) de la identidad pitagórica fundamental.'
                },
                {
                  title: 'Factorizar el numerador como diferencia de cuadrados y cancelar',
                  math: '\\frac{(1 - \\cos(x))(1 + \\cos(x))}{1 - \\cos(x)} = 1 + \\cos(x)',
                  reason: '1 - cos²(x) = (1 - cos(x))(1 + cos(x)), cancelando el denominador.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Sacar el 2 fuera del argumento de una función trigonométrica',
              wrong: '$\\operatorname{sen}(2x) = 2\\operatorname{sen}(x)$',
              right: '$\\operatorname{sen}(2x) = 2\\operatorname{sen}(x)\\cos(x)$',
              advice: 'El argumento $2x$ dentro del seno no es un factor multiplicativo externo; debes usar la identidad del ángulo doble.'
            }
          ],
          exercises: [
            {
              id: 'trig-2-ex1',
              level: 'basico',
              statement: 'Simplifica a un único número constante la expresión: $7\\,\\operatorname{sen}^2(x) + 7\\,\\cos^2(x)$',
              answer: '7',
              alternatives: ['7'],
              placeholder: 'Valor constante...',
              whyCorrect: 'Al extraer factor común $7(\\operatorname{sen}^2(x) + \\cos^2(x)) = 7(1) = 7$.',
              reviewTip: 'Extrae el factor común $7$ y aplica $\\operatorname{sen}^2(x) + \\cos^2(x) = 1$.',
              hints: [
                'Extrae el factor común $7$ de ambos términos.',
                'La expresión queda $7(\\operatorname{sen}^2(x) + \\cos^2(x))$.',
                'Aplica la identidad pitagórica $\\operatorname{sen}^2(x) + \\cos^2(x) = 1$.'
              ],
              solutionSteps: [
                'Factor común: $7(\\operatorname{sen}^2(x) + \\cos^2(x)) = 7 \\cdot 1 = 7$.'
              ]
            },
            {
              id: 'trig-2-ex2',
              level: 'intermedio',
              statement: 'En un triángulo con lados $a = 8$, $b = 5$ y ángulo comprendido $C = 60^\\circ$, calcula la longitud del tercer lado $c$.',
              answer: '7',
              alternatives: ['7'],
              placeholder: 'Longitud de c...',
              whyCorrect: 'Por la Ley de Cosenos: $c^2 = 8^2 + 5^2 - 2(8)(5)\\cos(60^\\circ) = 64 + 25 - 40 = 49 \\Rightarrow c = 7$.',
              reviewTip: 'Sustituye $\\cos(60^\\circ) = 0.5$ en $c^2 = a^2 + b^2 - 2ab\\cos(C)$.',
              hints: [
                'Aplica la Ley de Cosenos: $c^2 = a^2 + b^2 - 2ab\\cos(60^\\circ)$.',
                'Sustituye $a = 8$, $b = 5$ y $\\cos(60^\\circ) = 0.5$: $c^2 = 64 + 25 - 2(8)(5)(0.5)$.',
                'Calcula $c^2 = 89 - 40 = 49$ y extrae su raíz cuadrada.'
              ],
              solutionSteps: [
                '$c^2 = 8^2 + 5^2 - 2(8)(5)(0.5) = 64 + 25 - 40 = 49 \\Rightarrow c = 7$.'
              ]
            },
            {
              id: 'trig-2-ex3',
              level: 'avanzado',
              statement: 'Simplifica la expresión trigonométrica para $\\cos(x) \\neq 1$: $\\frac{\\operatorname{sen}^2(x)}{1 - \\cos(x)}$',
              answer: '1 + cos(x)',
              alternatives: ['1+cos(x)', 'cos(x)+1', 'cos(x) + 1'],
              placeholder: 'Ej: 1 + cos(x)',
              whyCorrect: 'Al sustituir $\\operatorname{sen}^2(x) = 1 - \\cos^2(x) = (1 - \\cos(x))(1 + \\cos(x))$ y cancelar $1 - \\cos(x)$ se obtiene $1 + \\cos(x)$.',
              reviewTip: 'Sustituye $\\operatorname{sen}^2(x) = 1 - \\cos^2(x)$ y factoriza como diferencia de cuadrados.',
              hints: [
                'Usa la identidad pitagórica $\\operatorname{sen}^2(x) = 1 - \\cos^2(x)$ en el numerador.',
                'Factoriza $1 - \\cos^2(x) = (1 - \\cos(x))(1 + \\cos(x))$.',
                'Cancela el factor común $(1 - \\cos(x))$ con el denominador.'
              ],
              solutionSteps: [
                '$\\frac{\\operatorname{sen}^2(x)}{1 - \\cos(x)} = \\frac{1 - \\cos^2(x)}{1 - \\cos(x)} = \\frac{(1 - \\cos(x))(1 + \\cos(x))}{1 - \\cos(x)} = 1 + \\cos(x)$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿A qué equivale la expresión $\\sec^2(\\theta) - \\tan^2(\\theta)$ para todo ángulo donde está definida?',
              options: ['$1$', '$0$', '$\\operatorname{sen}^2(\\theta)$', '$\\cos^2(\\theta)$'],
              correctIndex: 0,
              explanation: 'De la identidad pitagórica $1 + \\tan^2(\\theta) = \\sec^2(\\theta)$, despejando se obtiene $\\sec^2(\\theta) - \\tan^2(\\theta) = 1$.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       MÓDULO 5: FUNCIONES
       ====================================================================== */
    {
      id: 'funciones',
      name: 'Funciones',
      symbol: 'f(x)',
      levelTag: 'Modelación',
      color: '#4F46E5',
      shortDesc: 'Dominio y rango, funciones polinómicas, racionales, exponenciales, logarítmicas, composición e inversa.',
      topics: [
        {
          id: 'func-1',
          title: 'Dominio, Rango, Composición y Función Inversa',
          summary: 'Restricciones de dominio en funciones reales, composición (f ∘ g)(x) para la regla de la cadena y función inversa f⁻¹(x).',
          graphPreset: 'sqrt(x + 4)',
          theory: {
            intro: [
              'El objeto de estudio de todo el Cálculo es la **función real de variable real** $y = f(x)$. Antes de calcular un límite, una derivada o una integral, debemos conocer en qué conjunto de números reales está definida la función (**Dominio**) y cómo se construyen funciones compuestas $f(g(x))$.',
              'Comprender la **composición de funciones** $(f \\circ g)(x) = f(g(x))$ es la clave para aplicar más adelante la **Regla de la Cadena** en derivadas y el **Cambio de Variable** en integrales.'
            ],
            prerequisites: [
              'Resolución de ecuaciones e inecuaciones lineales y cuadráticas.',
              'Operaciones con fracciones algebraicas y radicales.'
            ],
            detailedExplanation: [
              '**Tres Reglas de Dominio en $\\mathbb{R}$:** **(1)** En un cociente $\\frac{N(x)}{D(x)}$, el denominador nunca puede ser cero ($D(x) \\neq 0$); **(2)** En una raíz de índice par $\\sqrt[2n]{g(x)}$, el radicando debe ser mayor o igual que cero ($g(x) \\geq 0$); **(3)** En un logaritmo $\\ln(g(x))$, el argumento debe ser estrictamente positivo ($g(x) > 0$).',
              'Si una función $f$ es **inyectiva** (ninguna recta horizontal corta su gráfica en más de un punto), admite una **función inversa** $f^{-1}(x)$ tal que $f^{-1}(f(x)) = x$, cuya gráfica es el reflejo de $f(x)$ respecto a la recta diagonal $y = x$.'
            ],
            concepts: [
              {
                title: '1. Dominio Natural Dom(f)',
                body: 'Conjunto de todos los valores reales de $x$ para los cuales la expresión $f(x)$ produce un número real finito.'
              },
              {
                title: '2. Función Compuesta (f ∘ g)(x)',
                body: 'Se evalúa de adentro hacia afuera: $(f \\circ g)(x) = f(g(x))$. En general no es conmutativa: $f(g(x)) \\neq g(f(x))$.'
              },
              {
                title: '3. Función Inversa f⁻¹(x)',
                body: 'Para hallarla: escribe $y = f(x)$, despeja $x$ en términos de $y$ y finalmente intercambia $x$ por $y$.'
              }
            ],
            formulas: [
              {
                label: 'Composición de Funciones e Identidad de Inversión',
                expr: '(f \\circ g)(x) = f(g(x)) \\quad ; \\quad y = f(x) \\Longleftrightarrow x = f^{-1}(y)',
                note: 'Nota importante: f⁻¹(x) denota la función inversa, NO el recíproco 1/f(x).'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Dominio de Radicales y Funciones Racionales',
            description: 'En $f(x) = \\sqrt{x + 4}$, observa cómo la gráfica nace exactamente en $x = -4$ porque el dominio exige $x + 4 \\geq 0 \\iff x \\geq -4$.',
            fnExpr: 'sqrt(x + 4)',
            initialX0: 0,
            presets: [
              { label: '$\\sqrt{x + 4}$ (Dom: $[-4, \\infty)$)', expr: 'sqrt(x + 4)', x0: 0 },
              { label: '$\\frac{1}{x - 2}$ (Dom: $x \\neq 2$)', expr: '1/(x - 2)', x0: 1 }
            ]
          },
          examples: [
            {
              title: 'Determinación de función compuesta y función inversa',
              problem: 'Sean $f(x) = 3x - 2$ y $g(x) = x^2 + 1$. Determina $(f \\circ g)(x)$ y la función inversa $f^{-1}(x)$.',
              steps: [
                {
                  title: 'Evaluar la composición (f ∘ g)(x) = f(g(x))',
                  math: 'f(g(x)) = 3(x^2 + 1) - 2 = 3x^2 + 3 - 2 = 3x^2 + 1',
                  reason: 'Sustituimos la variable x de f(x) por el bloque completo g(x).'
                },
                {
                  title: 'Hallar la inversa f⁻¹(x) despejando x de y = 3x - 2',
                  math: 'y + 2 = 3x \\Rightarrow x = \\frac{y + 2}{3} \\Rightarrow f^{-1}(x) = \\frac{x + 2}{3}',
                  reason: 'Despejamos x e intercambiamos las variables al final.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Confundir la función inversa f⁻¹(x) con el recíproco [f(x)]⁻¹',
              wrong: 'Si $f(x) = 2x + 1$, escribir $f^{-1}(x) = \\frac{1}{2x + 1}$',
              right: 'Despejando $x$ de $y = 2x + 1$ se obtiene $f^{-1}(x) = \\frac{x - 1}{2}$',
              advice: 'El superíndice $-1$ sobre el nombre de la función indica inversión operativa, no exponente algebraico.'
            }
          ],
          exercises: [
            {
              id: 'func-1-ex1',
              level: 'basico',
              statement: 'Dada la función $f(x) = 2x^2 - 3x + 4$, calcula el valor numérico de $f(-2)$.',
              answer: '18',
              alternatives: ['18'],
              placeholder: 'Valor de f(-2)...',
              whyCorrect: 'Sustituyendo $x = -2$: $2(-2)^2 - 3(-2) + 4 = 2(4) + 6 + 4 = 18$.',
              reviewTip: 'Usa paréntesis al sustituir números negativos: $(-2)^2 = +4$ y $-3(-2) = +6$.',
              hints: [
                'Sustituye $x = -2$ con cuidado en cada término usando paréntesis: $2(-2)^2 - 3(-2) + 4$.',
                'Recuerda que $(-2)^2 = +4$ y $-3(-2) = +6$.',
                'Suma $2(4) + 6 + 4$.'
              ],
              solutionSteps: [
                '$f(-2) = 2(-2)^2 - 3(-2) + 4 = 8 + 6 + 4 = 18$.'
              ]
            },
            {
              id: 'func-1-ex2',
              level: 'intermedio',
              statement: 'Si $f(x) = 2x + 5$ y $g(x) = 4x - 1$, encuentra la expresión simplificada de la composición $(f \\circ g)(x) = f(g(x))$.',
              answer: '8*x + 3',
              alternatives: ['8x+3', '8*x+3'],
              placeholder: 'Ej: 8x + 3',
              whyCorrect: 'Al evaluar $f(4x - 1) = 2(4x - 1) + 5 = 8x - 2 + 5 = 8x + 3$.',
              reviewTip: 'Reemplaza la $x$ de $f(x)$ por $(4x - 1)$ y distribuye el coeficiente $2$.',
              hints: [
                'En la definición de $f(x) = 2x + 5$, reemplaza la $x$ por el paréntesis $(4x - 1)$.',
                'Obtienes $2(4x - 1) + 5$.',
                'Distribuye el $2$ y simplifica los términos independientes.'
              ],
              solutionSteps: [
                '$f(g(x)) = 2(4x - 1) + 5 = 8x - 2 + 5 = 8x + 3$.'
              ]
            },
            {
              id: 'func-1-ex3',
              level: 'avanzado',
              statement: 'Encuentra la expresión de la función inversa $f^{-1}(x)$ para $f(x) = 4x - 7$.',
              answer: '(x + 7)/4',
              alternatives: ['(x+7)/4', '0.25*x + 1.75'],
              placeholder: 'Ej: (x + 7)/4',
              whyCorrect: 'De $y = 4x - 7$ se despeja $x = \\frac{y + 7}{4}$, por lo que $f^{-1}(x) = \\frac{x + 7}{4}$.',
              reviewTip: 'Plantea $y = 4x - 7$, suma $7$ en ambos lados y divide entre $4$.',
              hints: [
                'Escribe $y = 4x - 7$ y despeja la variable $x$.',
                'Suma $7$ en ambos miembros: $y + 7 = 4x$, luego divide entre $4$.',
                'Intercambia $y$ por $x$ para escribir $f^{-1}(x)$.'
              ],
              solutionSteps: [
                '$y = 4x - 7 \\Rightarrow y + 7 = 4x \\Rightarrow x = \\frac{y + 7}{4} \\Rightarrow f^{-1}(x) = \\frac{x + 7}{4}$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el dominio máximo en los números reales de la función $f(x) = \\frac{x + 1}{x - 5}$?',
              options: ['$\\mathbb{R} - \\{5\\}$', '$\\mathbb{R} - \\{-1\\}$', '$[5, +\\infty)$', '$\\mathbb{R}$'],
              correctIndex: 0,
              explanation: 'El denominador no puede anularse: $x - 5 \\neq 0 \\Rightarrow x \\neq 5$.'
            }
          ]
        },

        {
          id: 'func-2',
          title: 'Funciones Exponenciales y Logarítmicas',
          summary: 'El número de Euler e, propiedades de los logaritmos naturales para derivación e integración y ecuaciones exponenciales.',
          graphPreset: 'exp(x)',
          theory: {
            intro: [
              'Las funciones **exponencial natural** $f(x) = e^x$ y **logaritmo natural** $g(x) = \\ln(x)$ son funciones inversas entre sí y desempeñan un papel central en el Cálculo: $e^x$ es invariante frente a la derivación, y las leyes de los logaritmos permiten simplificar productos, cocientes y potencias complejas antes de derivar (**derivación logarítmica**).',
              'La base $e \\approx 2.7182818\\dots$ se define mediante el límite fundamental $\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e$.'
            ],
            prerequisites: [
              'Leyes de los exponentes reales: $a^{x+y} = a^x \\cdot a^y$.',
              'Concepto de función inversa.'
            ],
            detailedExplanation: [
              'Por ser inversas mutuas, para todo $x \\in \\mathbb{R}$ se cumple $\\ln(e^x) = x$, y para todo $x > 0$ se cumple $e^{\\ln(x)} = x$. Mientras el dominio de $e^x$ es todo $\\mathbb{R}$ y su rango es $(0, +\\infty)$, el dominio de $\\ln(x)$ es estrictamente $(0, +\\infty)$ y presenta una asíntota vertical en $x = 0$.',
              'Las tres **leyes de los logaritmos** transforman multiplicaciones en sumas, divisiones en restas y exponentes en coeficientes multiplicativos.'
            ],
            concepts: [
              {
                title: '1. Identidades de Cancelación e y ln',
                body: '$\\ln(e^x) = x$, $e^{\\ln(x)} = x$ (para $x > 0$), $\\ln(1) = 0$ y $\\ln(e) = 1$.'
              },
              {
                title: '2. Expansión Logarítmica',
                body: '$\\ln(A \\cdot B) = \\ln(A) + \\ln(B)$, $\\ln\\left(\\frac{A}{B}\\right) = \\ln(A) - \\ln(B)$ y $\\ln(A^k) = k\\,\\ln(A)$.'
              }
            ],
            formulas: [
              {
                label: 'Propiedades de Logaritmos y Cambio de Base',
                expr: '\\ln(A \\cdot B) = \\ln(A) + \\ln(B) \\quad ; \\quad \\ln\\left(\\frac{A}{B}\\right) = \\ln(A) - \\ln(B) \\quad ; \\quad \\ln(A^k) = k\\,\\ln(A)',
                note: 'Restricción de dominio: Los argumentos A y B deben ser estrictamente positivos (A > 0, B > 0).'
              }
            ]
          },
          interactiveGraph: {
            mode: 'general',
            title: 'Simetría entre la Exponencial eˣ y el Logaritmo Natural ln(x)',
            description: 'Compara el crecimiento acelerado de $e^x$ (siempre positiva) con el crecimiento lento de $\\ln(x)$ definida para $x > 0$.',
            fnExpr: 'exp(x)',
            initialX0: 1,
            presets: [
              { label: 'Exponencial $f(x) = e^x$', expr: 'exp(x)', x0: 1 },
              { label: 'Logaritmo $f(x) = \\ln(x)$', expr: 'ln(x)', x0: 2.718 }
            ]
          },
          examples: [
            {
              title: 'Resolución de ecuación exponencial y logarítmica',
              problem: 'Resuelve la ecuación exponencial: $$2^{3x - 1} = 32$$',
              steps: [
                {
                  title: 'Expresar ambos miembros como potencias de base 2',
                  math: '32 = 2^5 \\Rightarrow 2^{3x - 1} = 2^5',
                  reason: 'Como la función exponencial es inyectiva, bases iguales implican exponentes iguales.'
                },
                {
                  title: 'Igualar exponentes y despejar x',
                  math: '3x - 1 = 5 \\Rightarrow 3x = 6 \\Rightarrow x = 2',
                  reason: 'Sustituyendo x = 2 se comprueba 2⁵ = 32.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Aplicar una falsa distributividad al logaritmo de una suma',
              wrong: '$\\ln(x + y) = \\ln(x) + \\ln(y)$',
              right: '$\\ln(x \\cdot y) = \\ln(x) + \\ln(y)$, mientras que $\\ln(x + y)$ **no se puede separar**',
              advice: 'La suma de logaritmos proviene del logaritmo de un producto, nunca del logaritmo de una suma.'
            }
          ],
          exercises: [
            {
              id: 'func-2-ex1',
              level: 'basico',
              statement: 'Calcula el valor exacto de: $\\log_2(16) + \\log_{10}(1000) - \\ln(e^2)$',
              answer: '5',
              alternatives: ['5'],
              placeholder: 'Resultado...',
              whyCorrect: 'Como $2^4 = 16$, $10^3 = 1000$ y $\\ln(e^2) = 2$, la operación es $4 + 3 - 2 = 5$.',
              reviewTip: 'Evalúa cada logaritmo como el exponente al que debe elevarse su base: $\\log_b(b^k) = k$.',
              hints: [
                'Pregunta para cada término: ¿a qué exponente hay que elevar la base para obtener el argumento?',
                'Como $2^4 = 16$, entonces $\\log_2(16) = 4$. Como $10^3 = 1000$, $\\log_{10}(1000) = 3$.',
                'Además $\\ln(e^2) = 2$. Opera $4 + 3 - 2$.'
              ],
              solutionSteps: [
                '$\\log_2(2^4) = 4$, $\\log_{10}(10^3) = 3$ y $\\ln(e^2) = 2$.',
                'Resultado: $4 + 3 - 2 = 5$.'
              ]
            },
            {
              id: 'func-2-ex2',
              level: 'intermedio',
              statement: 'Resuelve la ecuación exponencial y encuentra el valor de $x$: $3^{2x - 1} = 27$',
              answer: '2',
              alternatives: ['2'],
              placeholder: 'Valor de x...',
              whyCorrect: 'Escribiendo $27 = 3^3$, igualamos exponentes $2x - 1 = 3 \\Rightarrow 2x = 4 \\Rightarrow x = 2$.',
              reviewTip: 'Expresa $27$ como $3^3$ e iguala los exponentes de ambos miembros.',
              hints: [
                'Reescribe $27$ como una potencia de base $3$: $27 = 3^3$.',
                'Iguala los exponentes: $2x - 1 = 3$.',
                'Despeja $x$.'
              ],
              solutionSteps: [
                '$3^{2x - 1} = 3^3 \\Rightarrow 2x - 1 = 3 \\Rightarrow 2x = 4 \\Rightarrow x = 2$.'
              ]
            },
            {
              id: 'func-2-ex3',
              level: 'avanzado',
              statement: 'Resuelve la ecuación logarítmica para $x > 0$: $\\ln(2x - 1) = \\ln(x + 5)$',
              answer: '6',
              alternatives: ['6'],
              placeholder: 'Valor de x...',
              whyCorrect: 'Como el logaritmo natural es una función inyectiva, $\\ln(2x - 1) = \\ln(x + 5) \\implies 2x - 1 = x + 5 \\implies x = 6$.',
              reviewTip: 'Iguala los argumentos de ambos logaritmos: $2x - 1 = x + 5$ y despeja $x$.',
              hints: [
                'Por la inyectividad del logaritmo natural, si $\\ln(A) = \\ln(B)$, entonces $A = B$.',
                'Iguala los argumentos: $2x - 1 = x + 5$.',
                'Despeja $x$ y verifica que ambos argumentos sean positivos ($11 > 0$).'
              ],
              solutionSteps: [
                '$\\ln(2x - 1) = \\ln(x + 5) \\implies 2x - 1 = x + 5 \\implies x = 6$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál de las siguientes expresiones es equivalente a $2\\ln(x) + \\ln(y)$ para $x, y > 0$?',
              options: ['$\\ln(x^2y)$', '$\\ln(2xy)$', '$\\ln(x^2 + y)$', '$2\\ln(xy)$'],
              correctIndex: 0,
              explanation: 'Por propiedades de logaritmos: $2\\ln(x) + \\ln(y) = \\ln(x^2) + \\ln(y) = \\ln(x^2y)$.'
            }
          ]
        }
      ]
    },

    /* ======================================================================
       MÓDULO 6: LÍMITES (DESARROLLO PROFUNDO EN 4 LECCIONES COMPLETAS)
       ====================================================================== */
    {
      id: 'limites',
      name: 'Límites',
      symbol: 'lím',
      levelTag: 'Análisis y Continuidad',
      color: '#4338CA',
      shortDesc: 'Definición de límite, límites laterales, indeterminaciones por factorización y racionalización, límites al infinito, asíntotas, trigonométricos y continuidad.',
      topics: [
        /* ------------------------------------------------------------------
           TEMA LÍMITES 1: Concepto Intuitivo, Definición, Laterales y Leyes
           ------------------------------------------------------------------ */
        {
          id: 'lim-1',
          title: 'Concepto de Límite, Interpretación Gráfica, Laterales y Leyes',
          summary: 'Idea intuitiva y definición formal ε-δ, interpretación gráfica, límites laterales, sustitución directa y teoremas de los límites.',
          graphPreset: '(x^2 - 4)/(x - 2)',
          theory: {
            intro: [
              'El concepto de **Límite** es el fundamento que distingue al Cálculo de las matemáticas elementales. Mientras el Álgebra evalúa qué ocurre exactamente *en* un punto $x = a$, el límite responde una pregunta más profunda y dinámica: **¿a qué valor $L$ se aproxima la altura $f(x)$ cuando la variable $x$ se acerca indefinidamente a $a$, sin llegar necesariamente a tocar $a$?**',
              'Esta distinción es crucial porque muchas razones de cambio instantáneas (como la velocidad en un instante exacto o la pendiente de una recta tangente) producen la expresión $\\frac{0}{0}$ si sustituimos directamente, pero tienen un límite perfectamente definido cuando nos aproximamos al punto.'
            ],
            prerequisites: [
              'Evaluación de funciones polinómicas y racionales en valores reales.',
              'Lectura de coordenadas $(x, y)$ en el plano cartesiano e intervalos abiertos $(a - \\delta, a + \\delta)$.'
            ],
            detailedExplanation: [
              '**1. Concepto Intuitivo y Definición Formal ($\\varepsilon$-$\\delta$):** Escribimos $\\lim_{x \\to a} f(x) = L$ y leemos *"el límite de $f(x)$ cuando $x$ tiende a $a$ es igual a $L$"* si podemos hacer que los valores de $f(x)$ estén tan cerca de $L$ como deseemos (a una distancia menor que cualquier tolerancia $\\varepsilon > 0$) tomando a $x$ suficientemente cerca de $a$ (a una distancia $0 < |x - a| < \\delta$), pero con $x \\neq a$.',
              '**2. Límites Laterales y Criterio de Existencia:** Podemos acercarnos a $a$ por dos caminos sobre el eje $X$: **por la izquierda** ($x \\to a^-$, tomando valores menores que $a$) o **por la derecha** ($x \\to a^+$, tomando valores mayores que $a$). El **Teorema de Existencia del Límite Bilateral** establece que $\\lim_{x \\to a} f(x) = L$ existe si y solo si ambos límites laterales existen y coinciden en el mismo número real $L$. Si $\\lim_{x \\to a^-} f(x) \\neq \\lim_{x \\to a^+} f(x)$, la gráfica presenta un salto y el límite bilateral **no existe**.',
              '**3. Propiedades, Leyes de los Límites y Sustitución Directa:** Si $\\lim_{x \\to a} f(x) = L$ y $\\lim_{x \\to a} g(x) = M$ existen y son finitos, el límite respeta las operaciones aritméticas: el límite de una suma es la suma de los límites, el límite de un producto es el producto de los límites y el límite de un cociente es el cociente de los límites (siempre que el límite del denominador cumpla $M \\neq 0$). Como consecuencia, para todo polinomio o función racional dentro de su dominio, el límite se calcula por **sustitución directa**: $\\lim_{x \\to a} f(x) = f(a)$.'
            ],
            concepts: [
              {
                title: '1. Independencia del Valor en x = a',
                body: 'El valor de $\\lim_{x \\to a} f(x)$ depende únicamente del comportamiento de $f(x)$ en la vecindad de $a$ ($x \\neq a$). El límite puede existir aunque $f(a)$ no esté definida.'
              },
              {
                title: '2. Teorema de Límites Laterales',
                body: '$\\lim_{x \\to a} f(x) = L \\Longleftrightarrow \\lim_{x \\to a^-} f(x) = L \\;\\text{ y }\\; \\lim_{x \\to a^+} f(x) = L$.'
              },
              {
                title: '3. Propiedad de Sustitución Directa',
                body: 'Si $f(x)$ es una función polinómica, racional, radical o trigonométrica y $a$ pertenece a su dominio (no anula denominadores), entonces $\\lim_{x \\to a} f(x) = f(a)$.'
              },
              {
                title: '4. Leyes Algebraicas de los Límites',
                body: 'Linealidad: $\\lim [cf(x) \\pm g(x)] = cL \\pm M$. Producto: $\\lim [f(x)g(x)] = L \\cdot M$. Potencia: $\\lim [f(x)]^n = L^n$.'
              }
            ],
            formulas: [
              {
                label: 'Condición Necesaria y Suficiente de Existencia del Límite',
                expr: '\\lim_{x \\to a} f(x) = L \\quad \\Longleftrightarrow \\quad \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L',
                note: 'Si los límites laterales dan valores distintos (L₁ ≠ L₂), el límite bilateral NO existe.'
              },
              {
                label: 'Leyes Fundamentales de los Límites (con L y M finitos)',
                expr: '\\lim_{x \\to a} [f(x) \\pm g(x)] = L \\pm M \\quad ; \\quad \\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\frac{L}{M} \\quad (\\text{si } M \\neq 0)',
                note: 'Restricción: La ley del cociente solo es aplicable si el límite del denominador M es distinto de cero.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'limits',
            title: 'Explorador de Aproximación Lateral x → a⁻ y x → a⁺',
            description: 'Modifica el valor objetivo $a$ y disminuye la distancia $\\delta$ hacia $0$ para observar cómo los puntos laterales izquierdo (verde) y derecho (morado) convergen hacia el límite $L$.',
            fnExpr: '(x^2 - 4)/(x - 2)',
            initialX0: 2,
            holeAt: 2,
            presets: [
              { label: 'Hueco evitable $\\frac{x^2-4}{x-2}$ ($a=2$)', expr: '(x^2 - 4)/(x - 2)', x0: 2, holeAt: 2 },
              { label: 'Polinomio continuo $x^2 - 2x + 1$', expr: 'x^2 - 2*x + 1', x0: 2, holeAt: null },
              { label: 'Salto lateral $|x|/x$ ($a=0$)', expr: 'abs(x)/x', x0: 0, holeAt: 0 }
            ]
          },
          examples: [
            {
              title: 'Aplicación de las leyes de los límites y sustitución directa',
              problem: 'Calcula el límite justificando con las propiedades de los límites: $$\\lim_{x \\to 2} \\frac{3x^2 - 4x + 5}{x + 1}$$',
              steps: [
                {
                  title: 'Evaluar el límite del denominador para verificar que no sea cero',
                  math: '\\lim_{x \\to 2} (x + 1) = 2 + 1 = 3 \\neq 0',
                  reason: 'Como el límite del denominador es 3 ≠ 0, podemos aplicar la ley del cociente y sustitución directa.'
                },
                {
                  title: 'Evaluar el límite del numerador polinómico',
                  math: '\\lim_{x \\to 2} (3x^2 - 4x + 5) = 3(2)^2 - 4(2) + 5 = 12 - 8 + 5 = 9',
                  reason: 'Aplicamos las leyes de la potencia, múltiplo constante y suma.'
                },
                {
                  title: 'Formar el cociente de ambos límites',
                  math: '\\lim_{x \\to 2} \\frac{3x^2 - 4x + 5}{x + 1} = \\frac{9}{3} = 3',
                  reason: 'El límite existe y su valor exacto es 3.'
                }
              ]
            },
            {
              title: 'Análisis de límites laterales en una función definida a trozos',
              problem: 'Sea $f(x) = \\begin{cases} x^2 + 1 & \\text{si } x < 2 \\\\ 3x - 1 & \\text{si } x \\geq 2 \\end{cases}$. Determina si existe $\\lim_{x \\to 2} f(x)$.',
              steps: [
                {
                  title: 'Calcular el límite lateral izquierdo (x → 2⁻, donde x < 2)',
                  math: '\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^-} (x^2 + 1) = 2^2 + 1 = 5',
                  reason: 'A la izquierda de 2 rige la primera rama x² + 1.'
                },
                {
                  title: 'Calcular el límite lateral derecho (x → 2⁺, donde x ≥ 2)',
                  math: '\\lim_{x \\to 2^+} f(x) = \\lim_{x \\to 2^+} (3x - 1) = 3(2) - 1 = 5',
                  reason: 'A la derecha de 2 rige la segunda rama 3x - 1.'
                },
                {
                  title: 'Comparar ambos límites laterales',
                  math: '\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^+} f(x) = 5 \\implies \\lim_{x \\to 2} f(x) = 5',
                  reason: 'Como ambos límites laterales son iguales a 5, el límite bilateral existe y vale 5.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Suponer que el límite no existe solo porque f(a) no está definida',
              wrong: 'En $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$, decir que "no existe porque en $x = 2$ se divide entre cero"',
              right: 'Para $x \\neq 2$, $\\frac{x^2 - 4}{x - 2} = x + 2$, por lo que $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = 4$ aunque $f(2)$ no exista',
              advice: 'El límite examina valores de $x$ infinitamente cercanos a $a$ pero siempre con $x \\neq a$.'
            }
          ],
          exercises: [
            {
              id: 'lim-1-ex1',
              level: 'basico',
              statement: 'Calcula el límite por sustitución directa: $\\lim_{x \\to 3} (2x^2 - 5x + 4)$',
              answer: '7',
              alternatives: ['7'],
              placeholder: 'Valor del límite...',
              whyCorrect: 'Por continuidad de los polinomios, sustituimos $x = 3$: $2(3)^2 - 5(3) + 4 = 18 - 15 + 4 = 7$.',
              reviewTip: 'Evalúa $2(3)^2 - 5(3) + 4$ recordando elevar primero $3^2 = 9$.',
              hints: [
                'Los polinomios son continuos en todo $\\mathbb{R}$; sustituye directamente $x = 3$.',
                'Calcula $2(3)^2 - 5(3) + 4$.',
                'Efectúa $18 - 15 + 4$.'
              ],
              solutionSteps: [
                'Sustitución directa: $2(3)^2 - 5(3) + 4 = 2(9) - 15 + 4 = 18 - 15 + 4 = 7$.'
              ]
            },
            {
              id: 'lim-1-ex2',
              level: 'intermedio',
              statement: 'Si $\\lim_{x \\to a} f(x) = 4$ y $\\lim_{x \\to a} g(x) = -2$, calcula utilizando las leyes de los límites: $\\lim_{x \\to a} \\frac{3f(x) - g(x)}{[g(x)]^2 + 1}$',
              answer: '14/5',
              alternatives: ['14/5', '2.8'],
              placeholder: 'Ej: 14/5 o 2.8',
              whyCorrect: 'En el numerador: $3(4) - (-2) = 14$. En el denominador: $(-2)^2 + 1 = 5$. El cociente es $\\frac{14}{5} = 2.8$.',
              reviewTip: 'Sustituye $f(x) \\to 4$ y $g(x) \\to -2$ respetando los signos en $-(-2) = +2$ y $(-2)^2 = +4$.',
              hints: [
                'Aplica las leyes de linealidad y cociente reemplazando $\\lim f(x)$ por $4$ y $\\lim g(x)$ por $-2$.',
                'En el numerador tienes $3(4) - (-2) = 12 + 2 = 14$.',
                'En el denominador tienes $(-2)^2 + 1 = 4 + 1 = 5$. Forma la fracción.'
              ],
              solutionSteps: [
                'Numerador: $3(4) - (-2) = 14$.',
                'Denominador: $(-2)^2 + 1 = 5$.',
                'Resultado: $\\frac{14}{5} = 2.8$.'
              ]
            },
            {
              id: 'lim-1-ex3',
              level: 'avanzado',
              statement: 'Halla el valor de la constante $k$ para que exista el límite bilateral $\\lim_{x \\to 2} f(x)$ de la función a trozos $f(x) = \\begin{cases} 3x + k & \\text{si } x < 2 \\\\ x^2 + 5 & \\text{si } x \\geq 2 \\end{cases}$.',
              answer: '3',
              alternatives: ['3', 'k=3'],
              placeholder: 'Valor de k...',
              whyCorrect: 'Igualando el límite izquierdo $3(2) + k = 6 + k$ con el derecho $2^2 + 5 = 9$, se obtiene $6 + k = 9 \\Rightarrow k = 3$.',
              reviewTip: 'Para que el límite bilateral exista en $x = 2$, iguala los límites laterales izquierdo y derecho en $x = 2$ y despeja $k$.',
              hints: [
                'El límite bilateral en $x = 2$ existe si y solo si $\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^+} f(x)$.',
                'Por la izquierda ($x < 2$) el límite es $3(2) + k = 6 + k$. Por la derecha ($x \\geq 2$) el límite es $2^2 + 5 = 9$.',
                'Iguala $6 + k = 9$ y despeja $k$.'
              ],
              solutionSteps: [
                'Límite izquierdo: $\\lim_{x \\to 2^-} (3x + k) = 6 + k$.',
                'Límite derecho: $\\lim_{x \\to 2^+} (x^2 + 5) = 9$.',
                'Condición de existencia: $6 + k = 9 \\Rightarrow k = 3$.'
              ]
            }
          ],
          quiz: [
            {
              question: 'Si para una función $f(x)$ se cumple que $\\lim_{x \\to 1^-} f(x) = 3$, $\\lim_{x \\to 1^+} f(x) = 3$ y $f(1) = 8$, ¿cuánto vale $\\lim_{x \\to 1} f(x)$?',
              options: ['$3$', '$8$', 'No existe', '$5.5$'],
              correctIndex: 0,
              explanation: 'El límite bilateral depende únicamente de que los límites laterales coincidan ($3 = 3$), sin importar el valor aislado de $f(1)$.'
            },
            {
              question: '¿Cuál es el límite lateral derecho $\\lim_{x \\to 0^+} \\frac{|x|}{x}$?',
              options: ['$1$', '$-1$', '$0$', 'No existe'],
              correctIndex: 0,
              explanation: 'Cuando $x \\to 0^+$, $x > 0$ y por definición $|x| = x$, luego $\\frac{|x|}{x} = \\frac{x}{x} = 1$.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           TEMA LÍMITES 2: Indeterminaciones 0/0 por Factorización y Racionalización
           ------------------------------------------------------------------ */
        {
          id: 'lim-2',
          title: 'Indeterminaciones 0/0: Límites por Factorización y Racionalización',
          summary: 'Significado de las formas indeterminadas, cancelación del factor nulo mediante factorización y uso del conjugado.',
          graphPreset: '(x^2 - 9)/(x^2 - x - 6)',
          theory: {
            intro: [
              'Cuando al evaluar un límite de un cociente $\\lim_{x \\to a} \\frac{P(x)}{Q(x)}$ por sustitución directa obtenemos $\\frac{0}{0}$, estamos ante una **forma indeterminada**. Esto **no** significa que el límite no exista; por el contrario, por el **Teorema del Factor**, el hecho de que tanto $P(a) = 0$ como $Q(a) = 0$ nos garantiza que **ambas expresiones contienen escondido el factor común $(x - a)$**.',
              'El objetivo algebraico para resolver una indeterminación $\\frac{0}{0}$ es hacer visible ese factor $(x - a)$ (mediante **factorización** si son polinomios, o mediante **racionalización con el conjugado** si contienen raíces cuadradas), cancelarlo legítimamente porque $x \\to a$ implica $x \\neq a$, y evaluar la expresión ya simplificada.'
            ],
            prerequisites: [
              'Factorización de diferencia de cuadrados, trinomios cuadráticos y diferencia/suma de cubos (Módulo Álgebra, Tema 1).',
              'Racionalización de numeradores y denominadores mediante el binomio conjugado (Módulo Álgebra, Tema 2).'
            ],
            detailedExplanation: [
              '**1. Estrategia para Límites Polinómicos Racionales ($\\frac{0}{0}$):** Primero verifica que realmente da $\\frac{0}{0}$ al sustituir $x = a$. Segundo, factoriza numerador y denominador buscando el factor $(x - a)$. Tercero, simplifica el factor $(x - a)$ arriba y abajo. Cuarto, sustituye $x = a$ en la fracción reducida.',
              '**2. Estrategia para Límites con Radicales ($\\frac{0}{0}$):** Si el numerador o denominador contiene una expresión con raíz cuadrada como $\\sqrt{u(x)} - c$, multiplica tanto el numerador como el denominador por su **conjugado** $\\sqrt{u(x)} + c$. En el lado de los conjugados aplica $(\\sqrt{u(x)})^2 - c^2 = u(x) - c^2$, lo cual hará aparecer el factor $(x - a)$ listo para cancelarse con el otro término de la fracción.'
            ],
            concepts: [
              {
                title: '1. ¿Por qué es válido cancelar (x - a)?',
                body: 'En la definición de $\\lim_{x \\to a}$, la variable $x$ se aproxima a $a$ pero **jamás toma el valor $a$** ($x \\neq a$). Por tanto, $x - a \\neq 0$ y dividir entre $(x - a)$ es completamente riguroso.'
              },
              {
                title: '2. Límites por Factorización',
                body: 'Aplica diferencia de cuadrados $x^2 - a^2 = (x-a)(x+a)$, trinomios $(x-a)(x-b)$ o diferencia de cubos $x^3 - a^3 = (x-a)(x^2+ax+a^2)$.'
              },
              {
                title: '3. Límites por Racionalización',
                body: 'Multiplica arriba y abajo por el conjugado de la expresión con raíz. Desarrolla solo los conjugados y mantén factorizado el resto para cancelar $(x - a)$.'
              }
            ],
            formulas: [
              {
                label: 'Principio de Funciones Equivalentes Salvo en un Punto',
                expr: '\\text{Si } f(x) = g(x) \\text{ para todo } x \\neq a, \\text{ entonces } \\lim_{x \\to a} f(x) = \\lim_{x \\to a} g(x)',
                note: 'Al cancelar el factor (x - a), obtenemos una función g(x) continua en x = a que rellena el hueco de f(x).'
              }
            ]
          },
          interactiveGraph: {
            mode: 'limits',
            title: 'Eliminación Geométrica de la Indeterminación 0/0',
            description: 'Explora cómo las funciones racionales e irracionales con indeterminación $\\frac{0}{0}$ tienen un hueco puntual pero sus ramas izquierda y derecha apuntan a un límite exacto.',
            fnExpr: '(x^2 - 9)/(x^2 - x - 6)',
            initialX0: 3,
            holeAt: 3,
            presets: [
              { label: 'Por factorización $\\frac{x^2-9}{x^2-x-6}$ ($a=3$)', expr: '(x^2 - 9)/(x^2 - x - 6)', x0: 3, holeAt: 3 },
              { label: 'Por racionalización $\\frac{\\sqrt{x+4}-2}{x}$ ($a=0$)', expr: '(sqrt(x + 4) - 2)/x', x0: 0, holeAt: 0 },
              { label: 'Diferencia de cubos $\\frac{x^3-8}{x-2}$ ($a=2$)', expr: '(x^3 - 8)/(x - 2)', x0: 2, holeAt: 2 }
            ]
          },
          examples: [
            {
              title: 'Límite indeterminado 0/0 resuelto mediante factorización',
              problem: 'Calcula el límite: $$\\lim_{x \\to 3} \\frac{x^2 - 9}{x^2 - x - 6}$$',
              steps: [
                {
                  title: 'Comprobar la indeterminación por sustitución directa',
                  math: '\\frac{3^2 - 9}{3^2 - 3 - 6} = \\frac{0}{0} \\quad (\\text{Indeterminación})',
                  reason: 'Como ambos polinomios se anulan en x = 3, ambos son divisibles entre (x - 3).'
                },
                {
                  title: 'Factorizar numerador y denominador',
                  math: '\\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{(x - 3)(x + 2)}',
                  reason: 'x² - 9 = (x - 3)(x + 3) y x² - x - 6 = (x - 3)(x + 2).'
                },
                {
                  title: 'Cancelar el factor común (x - 3) y evaluar en x = 3',
                  math: '\\lim_{x \\to 3} \\frac{x + 3}{x + 2} = \\frac{3 + 3}{3 + 2} = \\frac{6}{5} = 1.2',
                  reason: 'Al desaparecer el factor que causaba el cero, evaluamos directamente.'
                }
              ]
            },
            {
              title: 'Límite indeterminado 0/0 resuelto mediante racionalización con conjugado',
              problem: 'Calcula el límite con radicales: $$\\lim_{x \\to 0} \\frac{\\sqrt{x + 4} - 2}{x}$$',
              steps: [
                {
                  title: 'Verificar la indeterminación 0/0 y multiplicar por el conjugado',
                  math: '\\lim_{x \\to 0} \\frac{(\\sqrt{x + 4} - 2)(\\sqrt{x + 4} + 2)}{x(\\sqrt{x + 4} + 2)}',
                  reason: 'Multiplicamos numerador y denominador por (√(x+4) + 2).'
                },
                {
                  title: 'Aplicar diferencia de cuadrados en el numerador',
                  math: '\\lim_{x \\to 0} \\frac{(x + 4) - 4}{x(\\sqrt{x + 4} + 2)} = \\lim_{x \\to 0} \\frac{x}{x(\\sqrt{x + 4} + 2)}',
                  reason: '(√(x+4))² - 2² = x + 4 - 4 = x.'
                },
                {
                  title: 'Cancelar el factor x y sustituir x = 0',
                  math: '\\lim_{x \\to 0} \\frac{1}{\\sqrt{x + 4} + 2} = \\frac{1}{\\sqrt{4} + 2} = \\frac{1}{2 + 2} = \\frac{1}{4}',
                  reason: 'El límite existe y vale exactamente 1/4 = 0.25.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Olvidar escribir el símbolo de límite hasta el paso en que se evalúa x = a',
              wrong: '$\\lim_{x \\to 4} \\frac{x^2 - 16}{x - 4} = x + 4 = 8$',
              right: '$\\lim_{x \\to 4} \\frac{x^2 - 16}{x - 4} = \\lim_{x \\to 4} (x + 4) = 4 + 4 = 8$',
              advice: 'En notación matemática rigurosa, el operador $\\lim_{x \\to a}$ debe mantenerse en cada paso mientras siga apareciendo la variable $x$.'
            },
            {
              title: 'Expandir el término que NO tiene raíces al racionalizar',
              wrong: 'Multiplicar $x(\\sqrt{x+4} + 2) = x\\sqrt{x+4} + 2x$ en el denominador',
              right: 'Dejarlo factorizado como $x(\\sqrt{x+4} + 2)$ para poder cancelar $x$ de inmediato',
              advice: 'Solo desarrolla el producto de los dos binomios conjugados; deja el otro lado factorizado.'
            }
          ],
          exercises: [
            {
              id: 'lim-2-ex1',
              level: 'basico',
              statement: 'Resuelve el límite indeterminado mediante factorización: $\\lim_{x \\to 4} \\frac{x^2 - 16}{x - 4}$',
              answer: '8',
              alternatives: ['8'],
              placeholder: 'Valor del límite...',
              whyCorrect: 'Factorizando $x^2 - 16 = (x - 4)(x + 4)$ y cancelando $(x - 4)$, resulta $\\lim_{x \\to 4} (x + 4) = 8$.',
              reviewTip: 'Factoriza el numerador como diferencia de cuadrados $(x - 4)(x + 4)$ y simplifica $(x - 4)$.',
              hints: [
                'Al sustituir $x = 4$ se obtiene $\\frac{0}{0}$. Factoriza el numerador $x^2 - 16$ como diferencia de cuadrados.',
                '$x^2 - 16 = (x - 4)(x + 4)$.',
                'Cancela $(x - 4)$ con el denominador y evalúa $x + 4$ en $x = 4$.'
              ],
              solutionSteps: [
                '$\\lim_{x \\to 4} \\frac{(x - 4)(x + 4)}{x - 4} = \\lim_{x \\to 4} (x + 4) = 4 + 4 = 8$.'
              ]
            },
            {
              id: 'lim-2-ex2',
              level: 'intermedio',
              statement: 'Calcula el límite factorizando ambos trinomios: $\\lim_{x \\to 2} \\frac{x^2 - 5x + 6}{x^2 - 4}$',
              answer: '-1/4',
              alternatives: ['-1/4', '-0.25'],
              placeholder: 'Ej: -1/4 o -0.25',
              whyCorrect: 'Como $x^2 - 5x + 6 = (x - 2)(x - 3)$ y $x^2 - 4 = (x - 2)(x + 2)$, al cancelar $(x - 2)$ y evaluar en $x = 2$ se obtiene $\\frac{2 - 3}{2 + 2} = -\\frac{1}{4}$.',
              reviewTip: 'Factoriza el numerador en $(x - 2)(x - 3)$ y el denominador en $(x - 2)(x + 2)$, cancela $(x - 2)$ y sustituye $x = 2$.',
              hints: [
                'Tanto el numerador como el denominador valen $0$ en $x = 2$. Factoriza ambos buscando el factor $(x - 2)$.',
                'El numerador es $x^2 - 5x + 6 = (x - 2)(x - 3)$ y el denominador es $x^2 - 4 = (x - 2)(x + 2)$.',
                'Cancela $(x - 2)$ y evalúa $\\frac{x - 3}{x + 2}$ en $x = 2$.'
              ],
              solutionSteps: [
                '$\\lim_{x \\to 2} \\frac{(x - 2)(x - 3)}{(x - 2)(x + 2)} = \\lim_{x \\to 2} \\frac{x - 3}{x + 2} = \\frac{2 - 3}{2 + 2} = -\\frac{1}{4}$.'
              ]
            },
            {
              id: 'lim-2-ex3',
              level: 'avanzado',
              statement: 'Calcula el límite mediante racionalización: $\\lim_{x \\to 9} \\frac{\\sqrt{x} - 3}{x - 9}$',
              answer: '1/6',
              alternatives: ['1/6', '0.1667'],
              placeholder: 'Ej: 1/6',
              whyCorrect: 'Multiplicando por el conjugado $(\\sqrt{x} + 3)$, el numerador queda $x - 9$, que al cancelarse da $\\lim_{x \\to 9} \\frac{1}{\\sqrt{x} + 3} = \\frac{1}{6}$.',
              reviewTip: 'Multiplica numerador y denominador por $(\\sqrt{x} + 3)$, cancela $(x - 9)$ y sustituye $x = 9$.',
              hints: [
                'Multiplica numerador y denominador por el conjugado del numerador: $(\\sqrt{x} + 3)$.',
                'En el numerador obtienes $(\\sqrt{x})^2 - 3^2 = x - 9$, que se cancela con el $(x - 9)$ del denominador.',
                'Sustituye $x = 9$ en la expresión reducida $\\frac{1}{\\sqrt{x} + 3}$.'
              ],
              solutionSteps: [
                '$\\lim_{x \\to 9} \\frac{(\\sqrt{x} - 3)(\\sqrt{x} + 3)}{(x - 9)(\\sqrt{x} + 3)} = \\lim_{x \\to 9} \\frac{x - 9}{(x - 9)(\\sqrt{x} + 3)}$.',
                '$\\lim_{x \\to 9} \\frac{1}{\\sqrt{x} + 3} = \\frac{1}{3 + 3} = \\frac{1}{6}$.'
              ]
            },
            {
              id: 'lim-2-ex4',
              level: 'avanzado',
              statement: 'Resuelve usando factorización de diferencia de cubos: $\\lim_{x \\to 2} \\frac{x^3 - 8}{x - 2}$',
              answer: '12',
              alternatives: ['12'],
              placeholder: 'Valor del límite...',
              whyCorrect: 'Al factorizar $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$ y cancelar $(x - 2)$, evaluamos $2^2 + 2(2) + 4 = 12$.',
              reviewTip: 'Aplica $x^3 - 2^3 = (x - 2)(x^2 + 2x + 4)$, cancela $(x - 2)$ y sustituye $x = 2$.',
              hints: [
                'Factoriza el numerador como diferencia de cubos: $x^3 - 2^3 = (x - 2)(x^2 + 2x + 4)$.',
                'Cancela el factor $(x - 2)$ con el denominador.',
                'Evalúa el trinomio resultante $x^2 + 2x + 4$ en $x = 2$.'
              ],
              solutionSteps: [
                '$\\lim_{x \\to 2} \\frac{(x - 2)(x^2 + 2x + 4)}{x - 2} = \\lim_{x \\to 2} (x^2 + 2x + 4) = 4 + 4 + 4 = 12$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el valor del límite $\\lim_{x \\to -3} \\frac{x^2 + x - 6}{x + 3}$?',
              options: ['$-5$', '$5$', '$-1$', '$0$'],
              correctIndex: 0,
              explanation: 'Factorizando el numerador: $x^2 + x - 6 = (x + 3)(x - 2)$. Al cancelar $(x + 3)$ y evaluar en $x = -3$ resulta $-3 - 2 = -5$.'
            },
            {
              question: 'Al calcular $\\lim_{h \\to 0} \\frac{(3 + h)^2 - 9}{h}$ desarrollando el binomio y simplificando $h$ se obtiene:',
              options: ['$6$', '$3$', '$9$', '$0$'],
              correctIndex: 0,
              explanation: '$\\frac{9 + 6h + h^2 - 9}{h} = \\frac{h(6 + h)}{h} = 6 + h$. Cuando $h \\to 0$, el límite vale $6$.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           TEMA LÍMITES 3: Límites al Infinito, Límites Infinitos y Asíntotas
           ------------------------------------------------------------------ */
        {
          id: 'lim-3',
          title: 'Límites al Infinito, Límites Infinitos y Asíntotas',
          summary: 'Indeterminaciones ∞/∞, división por la mayor potencia, límites infinitos y ecuaciones de asíntotas verticales y horizontales.',
          graphPreset: '(3*x^2 - 2)/(x^2 + 1)',
          theory: {
            intro: [
              'El concepto de infinito aparece en los límites de dos maneras complementarias: **(1) Límites al infinito** ($\\lim_{x \\to \\pm\\infty} f(x) = L$), donde analizamos hacia qué altura se estabiliza una función cuando $x$ crece sin cota hacia la derecha o hacia la izquierda (**asíntotas horizontales**); y **(2) Límites infinitos** ($\\lim_{x \\to a} f(x) = \\pm\\infty$), donde la función se dispara verticalmente hacia $+\\infty$ o $-\\infty$ al acercarse a un valor $x = a$ que anula únicamente al denominador (**asíntotas verticales**).'
            ],
            prerequisites: [
              'Comportamiento del recíproco cuando el denominador crece: si $n > 0$, $\\lim_{x \\to \\pm\\infty} \\frac{c}{x^n} = 0$.',
              'Grado y coeficiente principal de un polinomio.'
            ],
            detailedExplanation: [
              '**1. Método General para Límites al Infinito ($\\frac{\\infty}{\\infty}$):** Para calcular $\\lim_{x \\to \\infty} \\frac{P(x)}{Q(x)}$, se divide cada término del numerador y del denominador entre **la mayor potencia de $x$ presente en el denominador**. Todos los términos de la forma $\\frac{k}{x^n}$ tienden a $0$. De aquí se deducen las tres reglas de los grados: **(a)** Si $\\text{grado}(P) < \\text{grado}(Q)$, el límite es $0$; **(b)** Si $\\text{grado}(P) = \\text{grado}(Q)$, el límite es el cociente de los coeficientes principales $\\frac{a_n}{b_n}$; **(c)** Si $\\text{grado}(P) > \\text{grado}(Q)$, el límite es $\\pm\\infty$.',
              '**2. Límites Infinitos (Forma $\\frac{k}{0}$ con $k \\neq 0$) y Asíntotas Verticales:** Si al evaluar en $x = a$ el numerador tiende a $k \\neq 0$ y el denominador tiende a $0$, el límite lateral es $+\\infty$ o $-\\infty$ dependiendo de la regla de los signos entre $k$ y el signo pequeño del denominador ($0^+$ o $0^-$). En ese caso, la recta vertical $x = a$ es una **asíntota vertical**.',
              '**3. Asíntotas Horizontales:** La recta horizontal $y = L$ es una **asíntota horizontal** de la gráfica de $f(x)$ si se cumple que $\\lim_{x \\to +\\infty} f(x) = L$ o bien $\\lim_{x \\to -\\infty} f(x) = L$.'
            ],
            concepts: [
              {
                title: '1. Teorema Fundamental 1/xⁿ → 0',
                body: 'Para cualquier constante real $c$ y exponente $n > 0$: $\\lim_{x \\to \\pm\\infty} \\frac{c}{x^n} = 0$.'
              },
              {
                title: '2. Regla de los Grados en Racionales (x → ∞)',
                body: 'Grado num < den $\\Rightarrow 0$. Grado num = den $\\Rightarrow \\frac{\\text{coef. principal num}}{\\text{coef. principal den}}$. Grado num > den $\\Rightarrow \\pm\\infty$.'
              },
              {
                title: '3. Asíntota Vertical (x = a) vs Horizontal (y = L)',
                body: 'Asíntota vertical $x = a$: donde $\\lim_{x \\to a^\\pm} f(x) = \\pm\\infty$. Asíntota horizontal $y = L$: donde $\\lim_{x \\to \\pm\\infty} f(x) = L$.'
              }
            ],
            formulas: [
              {
                label: 'Criterio de Límites al Infinito de Funciones Racionales',
                expr: '\\lim_{x \\to \\pm\\infty} \\frac{a_n x^n + \\dots + a_0}{b_m x^m + \\dots + b_0} = \\begin{cases} 0 & \\text{si } n < m \\\\ \\frac{a_n}{b_m} & \\text{si } n = m \\\\ \\pm\\infty & \\text{si } n > m \\end{cases}',
                note: 'Si hay raíces cuadradas como √(x² + 1) cuando x → -∞, recuerda que √(x²) = |x| = -x para x < 0.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'limits',
            title: 'Visualización de Asíntotas Verticales (x = a) y Horizontales (y = L)',
            description: 'Explora cómo en $\\frac{2x}{x - 1}$ aparece una asíntota vertical en $x = 1$ (línea roja punteada) y una asíntota horizontal en $y = 2$ (línea verde azulada) cuando $x \\to \\pm\\infty$.',
            fnExpr: '(2*x)/(x - 1)',
            initialX0: 1,
            presets: [
              { label: 'Asíntotas $x=1, y=2:\\; \\frac{2x}{x-1}$', expr: '(2*x)/(x - 1)', x0: 1 },
              { label: 'Asíntota horiz. $y=3:\\; \\frac{3x^2-2}{x^2+1}$', expr: '(3*x^2 - 2)/(x^2 + 1)', x0: 2 },
              { label: 'Límite $+\\infty:\\; \\frac{1}{(x-1)^2}$', expr: '1/((x - 1)^2)', x0: 1 }
            ]
          },
          examples: [
            {
              title: 'Cálculo paso a paso de un límite al infinito dividiendo por la mayor potencia',
              problem: 'Determina el valor del límite al infinito: $$\\lim_{x \\to \\infty} \\frac{6x^3 - 4x + 1}{2x^3 + 5x^2 - 3}$$',
              steps: [
                {
                  title: 'Dividir numerador y denominador entre la mayor potencia del denominador (x³)',
                  math: '\\lim_{x \\to \\infty} \\frac{\\frac{6x^3}{x^3} - \\frac{4x}{x^3} + \\frac{1}{x^3}}{\\frac{2x^3}{x^3} + \\frac{5x^2}{x^3} - \\frac{3}{x^3}} = \\lim_{x \\to \\infty} \\frac{6 - \\frac{4}{x^2} + \\frac{1}{x^3}}{2 + \\frac{5}{x} - \\frac{3}{x^3}}',
                  reason: 'Como x → ∞, x ≠ 0 y podemos dividir todos los términos entre x³.'
                },
                {
                  title: 'Aplicar que k/xⁿ → 0 cuando x → ∞',
                  math: '\\frac{6 - 0 + 0}{2 + 0 - 0} = \\frac{6}{2} = 3',
                  reason: 'La función tiene una asíntota horizontal en la recta y = 3.'
                }
              ]
            },
            {
              title: 'Determinación de asíntotas verticales y horizontales de una función racional',
              problem: 'Halla las ecuaciones de todas las asíntotas verticales y horizontales de: $$f(x) = \\frac{4x - 8}{x^2 - 9}$$',
              steps: [
                {
                  title: 'Igualar el denominador a cero para hallar las candidatas a asíntotas verticales',
                  math: 'x^2 - 9 = 0 \\Rightarrow (x - 3)(x + 3) = 0 \\Rightarrow x = 3, \\quad x = -3',
                  reason: 'En x = 3 y x = -3 el numerador 4x - 8 no se anula (vale 4 y -20), por lo que ambas rectas x = 3 y x = -3 son asíntotas verticales.'
                },
                {
                  title: 'Calcular el límite cuando x → ±∞ para la asíntota horizontal',
                  math: '\\lim_{x \\to \\pm\\infty} \\frac{4x - 8}{x^2 - 9} = 0 \\implies y = 0',
                  reason: 'Como el grado del numerador (1) es menor que el del denominador (2), el límite al infinito es 0 y la recta y = 0 (eje X) es la asíntota horizontal.'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Declarar asíntota vertical sin comprobar si el numerador también vale cero',
              wrong: 'Decir que $f(x) = \\frac{x^2 - 4}{x - 2}$ tiene asíntota vertical en $x = 2$',
              right: 'En $x = 2$ da $\\frac{0}{0}$ (se cancela $(x-2)$), por lo que en $x = 2$ hay un **hueco evitable**, no una asíntota vertical',
              advice: 'Una recta $x = a$ en una función racional es asíntota vertical solo si el factor $(x - a)$ persiste en el denominador tras simplificar la fracción.'
            }
          ],
          exercises: [
            {
              id: 'lim-3-ex1',
              level: 'basico',
              statement: 'Calcula el límite al infinito de la función racional: $\\lim_{x \\to \\infty} \\frac{8x^2 - 3x + 2}{4x^2 + 7x - 1}$',
              answer: '2',
              alternatives: ['2', 'y=2'],
              placeholder: 'Valor del límite...',
              whyCorrect: 'Al tener el mismo grado ($n = 2$) en numerador y denominador, el límite cuando $x \\to \\infty$ es el cociente de los coeficientes principales: $\\frac{8}{4} = 2$.',
              reviewTip: 'Divide entre $x^2$ o aplica el criterio de grados iguales: cociente de coeficientes de $x^2$.',
              hints: [
                'Compara el grado del polinomio del numerador ($2$) con el grado del denominador ($2$).',
                'Cuando ambos grados son iguales, el límite cuando $x \\to \\infty$ es el cociente de sus coeficientes principales.',
                'Divide el coeficiente de $x^2$ del numerador ($8$) entre el del denominador ($4$).'
              ],
              solutionSteps: [
                'Dividiendo entre $x^2$: $\\lim_{x \\to \\infty} \\frac{8 - 3/x + 2/x^2}{4 + 7/x - 1/x^2} = \\frac{8}{4} = 2$.'
              ]
            },
            {
              id: 'lim-3-ex2',
              level: 'intermedio',
              statement: 'Calcula el límite al infinito: $\\lim_{x \\to \\infty} \\frac{5x^2 + 9x - 1}{2x^3 - 4x + 7}$',
              answer: '0',
              alternatives: ['0'],
              placeholder: 'Valor del límite...',
              whyCorrect: 'Porque el grado del numerador ($2$) es estrictamente menor que el grado del denominador ($3$), por lo que el denominador crece mucho más rápido y el cociente tiende a $0$.',
              reviewTip: 'Divide todos los términos entre $x^3$: en el numerador quedará $\\frac{5}{x} + \\frac{9}{x^2} - \\frac{1}{x^3} \\to 0$.',
              hints: [
                'Observa los grados: el numerador es de grado $2$ y el denominador es de grado $3$.',
                'Al dividir cada término entre la mayor potencia del denominador ($x^3$), el numerador queda $\\frac{5}{x} + \\frac{9}{x^2} - \\frac{1}{x^3}$.',
                'Cuando $x \\to \\infty$, ¿a qué valor tiende $\\frac{0}{2}$?'
              ],
              solutionSteps: [
                'Dividiendo entre $x^3$: $\\lim_{x \\to \\infty} \\frac{5/x + 9/x^2 - 1/x^3}{2 - 4/x^2 + 7/x^3} = \\frac{0}{2} = 0$.'
              ]
            },
            {
              id: 'lim-3-ex3',
              level: 'avanzado',
              statement: 'Dada la función racional $f(x) = \\frac{x - 3}{x^2 - 7x + 12}$, encuentra el valor de $x$ donde la función tiene su única **asíntota vertical**.',
              answer: '4',
              alternatives: ['4', 'x=4'],
              placeholder: 'Valor de x...',
              whyCorrect: 'Al factorizar el denominador $x^2 - 7x + 12 = (x - 3)(x - 4)$, el factor $(x - 3)$ se cancela con el numerador (hueco en $x = 3$) y sobrevive únicamente $x - 4 = 0 \\Rightarrow x = 4$ como asíntota vertical.',
              reviewTip: 'Factoriza primero el denominador en $(x-3)(x-4)$ y simplifica el factor común con el numerador antes de determinar la asíntota vertical.',
              hints: [
                'Primero factoriza el denominador $x^2 - 7x + 12 = (x - 3)(x - 4)$.',
                'Observa que el factor $(x - 3)$ también está en el numerador, por lo que en $x = 3$ hay un hueco removible, no una asíntota.',
                'La función simplificada para $x \\neq 3$ es $\\frac{1}{x - 4}$. ¿En qué valor de $x$ se anula este denominador?'
              ],
              solutionSteps: [
                'Factorización: $f(x) = \\frac{x - 3}{(x - 3)(x - 4)} = \\frac{1}{x - 4}$ para $x \\neq 3$.',
                'En $x = 3$ hay discontinuidad evitable; la única asíntota vertical ocurre en $x - 4 = 0 \\Rightarrow x = 4$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Cuál es el límite lateral $\\lim_{x \\to 2^+} \\frac{5}{x - 2}$?',
              options: ['$+\\infty$', '$-\\infty$', '$0$', '$5$'],
              correctIndex: 0,
              explanation: 'Cuando $x \\to 2^+$, $x$ es ligeramente mayor que $2$ ($x - 2 \\to 0^+$ positivo). Como el numerador $5 > 0$, el cociente $\\frac{5}{0^+}$ diverge a $+\\infty$.'
            },
            {
              question: '¿Cuál es la ecuación de la asíntota horizontal de $f(x) = \\frac{9x - 4}{3x + 2}$?',
              options: ['$y = 3$', '$x = 3$', '$y = -2$', '$y = 0$'],
              correctIndex: 0,
              explanation: 'Calculando $\\lim_{x \\to \\pm\\infty} \\frac{9x - 4}{3x + 2} = \\frac{9}{3} = 3$, la asíntota horizontal es la recta $y = 3$.'
            }
          ]
        },

        /* ------------------------------------------------------------------
           TEMA LÍMITES 4: Límites Trigonométricos, Continuidad y Aplicaciones
           ------------------------------------------------------------------ */
        {
          id: 'lim-4',
          title: 'Límites Trigonométricos Fundamentales, Continuidad y Discontinuidad',
          summary: 'Límites especiales sen(x)/x y (1-cos(x))/x, definición formal de continuidad, tipos de discontinuidad y Teorema de Bolzano.',
          graphPreset: 'sin(x)/x',
          theory: {
            intro: [
              'En esta lección culminamos la teoría de límites con dos pilares esenciales para las derivadas: los **Límites Trigonométricos Fundamentales** (que permiten demostrar que la derivada del seno es el coseno) y el concepto riguroso de **Continuidad de una Función**.',
              'Intuitivamente, una función es **continua** en un intervalo si su gráfica puede trazarse de un solo trazo sin levantar el lápiz del papel (sin huecos, saltos ni explosiones asintóticas).'
            ],
            prerequisites: [
              'Identidades trigonométricas y medida angular en radianes.',
              'Cálculo de límites laterales $\\lim_{x \\to a^-} f(x)$ y $\\lim_{x \\to a^+} f(x)$.'
            ],
            detailedExplanation: [
              '**1. Los Dos Límites Trigonométricos Fundamentales:** Mediante el Teorema del Emparedado (compresión geométrica en el círculo unitario con $x$ en radianes) se demuestra que $\\lim_{x \\to 0} \\frac{\\operatorname{sen}(x)}{x} = 1$. De manera general, si $k \\neq 0$, entonces $\\lim_{x \\to 0} \\frac{\\operatorname{sen}(kx)}{kx} = 1$ (y también $\\lim_{x \\to 0} \\frac{\\tan(kx)}{kx} = 1$). El segundo límite fundamental establece que $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x} = 0$, y su versión cuadrática es $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{2}$.',
              '**2. Las Tres Condiciones de Continuidad en un Punto $x = a$:** Se dice que $f$ es continua en $x = a$ si cumple simultáneamente: **(i)** $f(a)$ está definida (existe el punto); **(ii)** Existe el límite bilateral $\\lim_{x \\to a} f(x)$ (los límites laterales son finitos e iguales); y **(iii)** El límite coincide con el valor de la función: $\\lim_{x \\to a} f(x) = f(a)$.',
              '**3. Clasificación de Discontinuidades:** Si falla alguna condición en $x = a$, la discontinuidad se clasifica en: **(a) Evitable o Removible** (cuando existe $\\lim_{x \\to a} f(x) = L$ finito, pero $f(a)$ no existe o $f(a) \\neq L$; basta redefinir $f(a) = L$ para hacerla continua); **(b) De Salto Finito** (cuando los límites laterales existen pero son distintos: $L^- \\neq L^+$); **(c) Infinita o Esencial** (cuando alguno de los límites laterales es $\\pm\\infty$).'
            ],
            concepts: [
              {
                title: '1. Técnica de Completar el Argumento en sen(kx)/x',
                body: 'Para calcular $\\lim_{x \\to 0} \\frac{\\operatorname{sen}(5x)}{x}$, multiplica y divide por $5$: $5 \\cdot \\lim_{x \\to 0} \\frac{\\operatorname{sen}(5x)}{5x} = 5 \\cdot 1 = 5$.'
              },
              {
                title: '2. Las 3 Condiciones de Continuidad en x = a',
                body: '1) Existe $f(a)$. 2) Existe $\\lim_{x \\to a} f(x)$. 3) $\\lim_{x \\to a} f(x) = f(a)$.'
              },
              {
                title: '3. Discontinuidad Evitable vs Esencial',
                body: 'Es **evitable** si existe el límite bilateral finito $L$. Es **no evitable (esencial)** si hay un salto lateral o una asíntota vertical.'
              },
              {
                title: '4. Teorema del Valor Intermedio (Bolzano)',
                body: 'Si $f$ es continua en $[a, b]$ y $f(a) \\cdot f(b) < 0$ (cambian de signo), entonces existe al menos una raíz $c \\in (a, b)$ tal que $f(c) = 0$.'
              }
            ],
            formulas: [
              {
                label: 'Límites Trigonométricos Fundamentales (x en Radianes)',
                expr: '\\lim_{x \\to 0} \\frac{\\operatorname{sen}(kx)}{kx} = 1 \\quad ; \\quad \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x} = 0 \\quad ; \\quad \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{2}',
                note: 'Importante: Este límite vale 1 exclusivamente cuando el argumento tiende a 0 (no cuando x → ∞).'
              },
              {
                label: 'Definición Formal de Continuidad en x = a',
                expr: 'f \\text{ es continua en } x = a \\quad \\Longleftrightarrow \\quad \\lim_{x \\to a} f(x) = f(a)',
                note: 'Todos los polinomios, eˣ, sen(x) y cos(x) son funciones continuas en todo ℝ.'
              }
            ]
          },
          interactiveGraph: {
            mode: 'limits',
            title: 'El Límite Trigonométrico Fundamental sen(x)/x en x → 0',
            description: 'Observa cómo aunque $f(0) = \\frac{\\operatorname{sen}(0)}{0} = \\frac{0}{0}$ no está definida en el origen, al aproximarse tanto por la izquierda ($0^-$) como por la derecha ($0^+$) la curva converge suavemente a la altura $L = 1$.',
            fnExpr: 'sin(x)/x',
            initialX0: 0,
            holeAt: 0,
            presets: [
              { label: '$\\frac{\\operatorname{sen}(x)}{x} \\to 1$ ($a=0$)', expr: 'sin(x)/x', x0: 0, holeAt: 0 },
              { label: '$\\frac{\\operatorname{sen}(3x)}{x} \\to 3$ ($a=0$)', expr: 'sin(3*x)/x', x0: 0, holeAt: 0 },
              { label: '$\\frac{1 - \\cos(x)}{x^2} \\to 0.5$ ($a=0$)', expr: '(1 - cos(x))/(x^2)', x0: 0, holeAt: 0 }
            ]
          },
          examples: [
            {
              title: 'Cálculo de límite trigonométrico completando argumentos',
              problem: 'Determina el valor exacto del límite: $$\\lim_{x \\to 0} \\frac{\\operatorname{sen}(7x)}{\\operatorname{sen}(3x)}$$',
              steps: [
                {
                  title: 'Dividir numerador y denominador entre x y completar los coeficientes 7 y 3',
                  math: '\\lim_{x \\to 0} \\frac{7 \\cdot \\frac{\\operatorname{sen}(7x)}{7x}}{3 \\cdot \\frac{\\operatorname{sen}(3x)}{3x}}',
                  reason: 'Multiplicamos y dividimos por 7 arriba y por 3 abajo para formar bloques del tipo sen(u)/u.'
                },
                {
                  title: 'Aplicar el límite trigonométrico fundamental en cada bloque',
                  math: '\\frac{7 \\cdot 1}{3 \\cdot 1} = \\frac{7}{3}',
                  reason: 'Tanto sen(7x)/(7x) como sen(3x)/(3x) tienden a 1 cuando x → 0.'
                }
              ]
            },
            {
              title: 'Redefinición de una discontinuidad evitable para hacer continua una función',
              problem: 'La función $f(x) = \\frac{x^2 - 25}{x - 5}$ es discontinua en $x = 5$. ¿Qué valor debe asignarse a $f(5)$ para eliminar la discontinuidad?',
              steps: [
                {
                  title: 'Calcular el límite de f(x) cuando x tiende a 5',
                  math: '\\lim_{x \\to 5} \\frac{(x - 5)(x + 5)}{x - 5} = \\lim_{x \\to 5} (x + 5) = 10',
                  reason: 'Como el límite bilateral existe y es finito (L = 10), la discontinuidad en x = 5 es evitable.'
                },
                {
                  title: 'Igualar f(5) al valor del límite',
                  math: 'f(5) = \\lim_{x \\to 5} f(x) = 10',
                  reason: 'Definiendo f(5) = 10 se cumple la condición de continuidad lim f(x) = f(5).'
                }
              ]
            }
          ],
          commonMistakes: [
            {
              title: 'Cancelar la x dentro del argumento del seno con una x externa',
              wrong: '$\\frac{\\operatorname{sen}(4x)}{x} = \\operatorname{sen}(4)$',
              right: '$\\lim_{x \\to 0} \\frac{\\operatorname{sen}(4x)}{x} = 4 \\cdot \\lim_{x \\to 0} \\frac{\\operatorname{sen}(4x)}{4x} = 4(1) = 4$',
              advice: 'Jamás puedes simplificar algebraicamente una variable que está dentro del argumento de $\\operatorname{sen}(4x)$ con un denominador exterior.'
            }
          ],
          exercises: [
            {
              id: 'lim-4-ex1',
              level: 'basico',
              statement: 'Calcula el límite trigonométrico fundamental: $\\lim_{x \\to 0} \\frac{\\operatorname{sen}(6x)}{2x}$',
              answer: '3',
              alternatives: ['3'],
              placeholder: 'Valor del límite...',
              whyCorrect: 'Reescribiendo $\\frac{6}{2} \\cdot \\frac{\\operatorname{sen}(6x)}{6x} = 3 \\cdot \\frac{\\operatorname{sen}(6x)}{6x}$, cuando $x \\to 0$ se obtiene $3 \\cdot 1 = 3$.',
              reviewTip: 'Multiplica y divide por $6$ para formar $\\frac{\\operatorname{sen}(6x)}{6x} \\to 1$, lo que deja el cociente $\\frac{6}{2} = 3$.',
              hints: [
                'Necesitas tener $6x$ en el denominador para igualar el argumento de $\\operatorname{sen}(6x)$.',
                'Reescribe la fracción como $\\frac{6}{2} \\cdot \\frac{\\operatorname{sen}(6x)}{6x}$.',
                'Usa que $\\lim_{x \\to 0} \\frac{\\operatorname{sen}(6x)}{6x} = 1$.'
              ],
              solutionSteps: [
                '$\\lim_{x \\to 0} \\frac{6}{2} \\cdot \\frac{\\operatorname{sen}(6x)}{6x} = 3 \\cdot 1 = 3$.'
              ]
            },
            {
              id: 'lim-4-ex2',
              level: 'intermedio',
              statement: 'Calcula el valor del límite trigonométrico: $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{3x^2}$',
              answer: '1/6',
              alternatives: ['1/6', '0.1667'],
              placeholder: 'Ej: 1/6',
              whyCorrect: 'Extrayendo el factor $\\frac{1}{3}$ y aplicando el límite notable $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{2}$, resulta $\\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$.',
              reviewTip: 'Separa la constante $\\frac{1}{3}$ y aplica la propiedad fundamental $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{2}$.',
              hints: [
                'Separa el coeficiente constante del denominador: $\\frac{1}{3} \\cdot \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2}$.',
                'Recuerda que $\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{2}$.',
                'Multiplica $\\frac{1}{3} \\cdot \\frac{1}{2}$.'
              ],
              solutionSteps: [
                '$\\frac{1}{3} \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$.'
              ]
            },
            {
              id: 'lim-4-ex3',
              level: 'avanzado',
              statement: 'Determina el valor de la constante $c$ para que la función $f(x) = \\begin{cases} \\frac{x^2 - 9}{x - 3} & \\text{si } x \\neq 3 \\\\ c & \\text{si } x = 3 \\end{cases}$ sea **continua** en $x = 3$.',
              answer: '6',
              alternatives: ['6', 'c=6'],
              placeholder: 'Valor de c...',
              whyCorrect: 'Para que sea continua en $x = 3$, debe cumplirse $c = f(3) = \\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6$.',
              reviewTip: 'Calcula primero $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$ factorizando el numerador, e iguala $c$ a ese límite.',
              hints: [
                'La continuidad en $x = 3$ exige que $f(3) = \\lim_{x \\to 3} f(x)$, es decir, $c = \\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$.',
                'Factoriza $x^2 - 9 = (x - 3)(x + 3)$ y cancela $(x - 3)$.',
                'Evalúa $x + 3$ en $x = 3$.'
              ],
              solutionSteps: [
                '$\\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6$.',
                'Por condición de continuidad: $c = f(3) = 6$.'
              ]
            }
          ],
          quiz: [
            {
              question: '¿Qué tipo de discontinuidad presenta la función $f(x) = \\frac{x^2 - 1}{x - 1}$ en el punto $x = 1$?',
              options: [
                'Discontinuidad evitable (removible)',
                'Discontinuidad infinita (asíntota vertical)',
                'Discontinuidad de salto finito',
                'No presenta discontinuidad, es continua en x = 1'
              ],
              correctIndex: 0,
              explanation: 'Aunque $f(1)$ no existe, el límite $\\lim_{x \\to 1} \\frac{x^2-1}{x-1} = \\lim_{x \\to 1}(x+1) = 2$ existe y es finito, por lo que la discontinuidad es evitable.'
            },
            {
              question: '¿Cuál es el valor del límite $\\lim_{x \\to 0} \\frac{\\tan(5x)}{x}$?',
              options: ['$5$', '$1$', '$0$', '$\\frac{1}{5}$'],
              correctIndex: 0,
              explanation: 'Escribiendo $\\frac{\\tan(5x)}{x} = 5 \\cdot \\frac{\\operatorname{sen}(5x)}{5x} \\cdot \\frac{1}{\\cos(5x)}$, cuando $x \\to 0$ tiende a $5 \\cdot 1 \\cdot 1 = 5$.'
            }
          ]
        }
      ]
    }
  ];

  curriculum.push(...part2);
})(window.MatInteractiva.Curriculum);
