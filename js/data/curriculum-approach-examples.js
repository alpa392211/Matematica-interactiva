/* ==========================================================================
   MATETIC - Ejemplos Adicionales por Forma de Resolver (24 Temas · 96 Métodos)
   Archivo: js/data/curriculum-approach-examples.js
   Añade 2 ejemplos resueltos extra (`moreExamples`) a cada uno de los enfoques
   de `solvingApproaches`, sumando 3 ejemplos concretos por cada método.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const APPROACH_EXTRA_EXAMPLES = {
    'arit-1': [
      // Forma 1 · PEMDAS
      [
        {
          title: 'Corchetes anidados con potencias',
          problem: 'Evalúa $40 - 3[2 + (5 - 2)^2]$.',
          steps: [
            'Resuelve el paréntesis más interno: $5 - 2 = 3$, luego eleva al cuadrado: $3^2 = 9$.',
            'Simplifica el corchete: $2 + 9 = 11$, multiplica: $3 \\cdot 11 = 33$, y resta al final: $40 - 33$.'
          ],
          result: '$7$'
        },
        {
          title: 'Signo negativo con y sin paréntesis',
          problem: 'Calcula $-4^2 + (-4)^2 - 18 \\div 3 \\cdot 2$.',
          steps: [
            'Evalúa las potencias respetando paréntesis: $-4^2 = -16$ y $(-4)^2 = 16$.',
            'Divide y multiplica de izquierda a derecha: $18 \\div 3 \\cdot 2 = 6 \\cdot 2 = 12$; combina: $-16 + 16 - 12$.'
          ],
          result: '$-12$'
        }
      ],
      // Forma 2 · Reescritura uniforme a potencias
      [
        {
          title: 'Producto y cociente de radicales',
          problem: 'Simplifica $\\frac{\\sqrt[3]{x^2} \\cdot x^{1/2}}{x^{-1/6}}$.',
          steps: [
            'Reescribe todo como potencias de $x$: $x^{2/3} \\cdot x^{1/2} \\cdot x^{1/6}$.',
            'Suma exponentes con denominador $6$: $\\frac{4}{6} + \\frac{3}{6} + \\frac{1}{6} = \\frac{8}{6} = \\frac{4}{3}$.'
          ],
          result: '$x^{4/3}$'
        },
        {
          title: 'Bases compuestas llevadas a base prima',
          problem: 'Simplifica $\\frac{8^2 \\cdot 4^{-1}}{2^3}$.',
          steps: [
            'Expresa en base $2$: $8^2 = (2^3)^2 = 2^6$ y $4^{-1} = (2^2)^{-1} = 2^{-2}$.',
            'Combina exponentes: $2^{6 + (-2) - 3} = 2^1$.'
          ],
          result: '$2$'
        }
      ],
      // Forma 3 · Raíz antes de elevar
      [
        {
          title: 'Potencia fraccionaria positiva sin calculadora',
          problem: 'Calcula $16^{3/4}$.',
          steps: [
            'Reescribe extrayendo primero la raíz cuarta: $(\\sqrt[4]{16})^3$.',
            'Como $2^4 = 16$, queda $2^3$.'
          ],
          result: '$8$'
        },
        {
          title: 'Potencia fraccionaria negativa',
          problem: 'Evalúa $64^{-2/3}$.',
          steps: [
            'Saca primero la raíz cúbica: $\\sqrt[3]{64} = 4$.',
            'Eleva al cuadrado e invierte por el signo negativo: $4^{-2} = \\frac{1}{4^2}$.'
          ],
          result: '$\\frac{1}{16}$'
        }
      ]
    ],

    'arit-2': [
      // Forma 1 · MCM
      [
        {
          title: 'Suma y resta de tres fracciones',
          problem: 'Calcula $\\frac{5}{6} - \\frac{1}{4} + \\frac{3}{8}$.',
          steps: [
            'El $\\operatorname{MCM}(6, 4, 8) = 24$; amplifica cada fracción: $\\frac{20}{24} - \\frac{6}{24} + \\frac{9}{24}$.',
            'Opera los numeradores: $\\frac{20 - 6 + 9}{24} = \\frac{23}{24}$.'
          ],
          result: '$\\frac{23}{24}$'
        },
        {
          title: 'Fracciones con denominadores que comparten factor',
          problem: 'Resuelve $\\frac{7}{12} + \\frac{5}{18}$.',
          steps: [
            'Factoriza $12 = 2^2 \\cdot 3$ y $18 = 2 \\cdot 3^2$, por lo que $\\operatorname{MCM} = 36$.',
            'Suma equivalentes: $\\frac{21}{36} + \\frac{10}{36} = \\frac{31}{36}$.'
          ],
          result: '$\\frac{31}{36}$'
        }
      ],
      // Forma 2 · Multiplicar por MCM global
      [
        {
          title: 'Fracción compleja numérica',
          problem: 'Simplifica $\\frac{\\frac{1}{2} + \\frac{2}{3}}{\\frac{5}{6} - \\frac{1}{4}}$.',
          steps: [
            'El MCM global de $2, 3, 6, 4$ es $12$; multiplica numerador y denominador por $12$.',
            'Obtienes $\\frac{6 + 8}{10 - 3} = \\frac{14}{7} = 2$.'
          ],
          result: '$2$'
        },
        {
          title: 'Fracción compleja algebraica sencilla',
          problem: 'Simplifica $\\frac{\\frac{3}{x} - 1}{\\frac{9}{x^2} - 1}$ para $x \\neq 0, \\pm 3$.',
          steps: [
            'Multiplica arriba y abajo por $x^2$: $\\frac{3x - x^2}{9 - x^2} = \\frac{x(3 - x)}{(3 - x)(3 + x)}$.',
            'Cancela el factor común $(3 - x)$.'
          ],
          result: '$\\frac{x}{3 + x}$'
        }
      ],
      // Forma 3 · Proporciones
      [
        {
          title: 'Proporción directa por reducción a la unidad',
          problem: 'Si $4$ cuadernos cuestan $72$ unidades monetarias, ¿cuánto cuestan $7$ cuadernos?',
          steps: [
            'Halla el precio unitario: $72 \\div 4 = 18$ por cuaderno.',
            'Multiplica por $7$: $18 \\times 7 = 126$.'
          ],
          result: '$126$'
        },
        {
          title: 'Proporción inversa (producto constante)',
          problem: 'Si $6$ técnicos completan una instalación en $10$ horas, ¿cuánto tardan $4$ técnicos al mismo ritmo?',
          steps: [
            'Más técnicos implica menos tiempo (inversa): el trabajo total es $6 \\times 10 = 60$ horas-técnico.',
            'Divide entre $4$ técnicos: $60 \\div 4 = 15$ horas.'
          ],
          result: '$15\\text{ horas}$'
        }
      ]
    ],

    'alg-1': [
      // Forma 1 · Diagnóstico por términos
      [
        {
          title: 'Factor común + diferencia de cuadrados (2 términos)',
          problem: 'Factoriza $3x^3 - 27x$.',
          steps: [
            'Extrae primero el factor común $3x$: $3x(x^2 - 9)$.',
            'Reconoce la diferencia de cuadrados $x^2 - 3^2 = (x - 3)(x + 3)$.'
          ],
          result: '$3x(x - 3)(x + 3)$'
        },
        {
          title: 'Agrupación de 4 términos',
          problem: 'Factoriza $x^3 + 2x^2 - 9x - 18$.',
          steps: [
            'Agrupa en parejas: $x^2(x + 2) - 9(x + 2) = (x + 2)(x^2 - 9)$.',
            'Factoriza $x^2 - 9 = (x - 3)(x + 3)$.'
          ],
          result: '$(x + 2)(x - 3)(x + 3)$'
        }
      ],
      // Forma 2 · Trinomios ax^2+bx+c
      [
        {
          title: 'Método ac por agrupación',
          problem: 'Factoriza $2x^2 + 7x + 3$.',
          steps: [
            'Calcula $ac = 2 \\cdot 3 = 6$ y busca dos números que sumen $7$: $6$ y $1$.',
            'Reescribe y agrupa: $2x^2 + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)$.'
          ],
          result: '$(2x + 1)(x + 3)$'
        },
        {
          title: 'Trinomio con coeficiente principal 6',
          problem: 'Factoriza $6x^2 - 11x - 10$.',
          steps: [
            'Producto $ac = 6(-10) = -60$; el par que suma $-11$ es $-15$ y $+4$.',
            'Agrupa: $6x^2 - 15x + 4x - 10 = 3x(2x - 5) + 2(2x - 5) = (3x + 2)(2x - 5)$.'
          ],
          result: '$(3x + 2)(2x - 5)$'
        }
      ],
      // Forma 3 · Ruffini
      [
        {
          title: 'Polinomio cúbico con raíz entera',
          problem: 'Factoriza $P(x) = x^3 - 4x^2 + x + 6$.',
          steps: [
            'Prueba divisores de $6$: $P(-1) = -1 - 4 - 1 + 6 = 0$, así que $(x + 1)$ es factor.',
            'División sintética entre $-1$ da cociente $x^2 - 5x + 6 = (x - 2)(x - 3)$.'
          ],
          result: '$(x + 1)(x - 2)(x - 3)$'
        },
        {
          title: 'Cúbica con raíz repetida',
          problem: 'Factoriza $P(x) = x^3 - 3x^2 + 4$.',
          steps: [
            'Observa que $P(-1) = -1 - 3 + 4 = 0$, luego divide por $(x + 1)$ con coeficientes $1, -3, 0, 4$.',
            'El cociente es $x^2 - 4x + 4 = (x - 2)^2$.'
          ],
          result: '$(x + 1)(x - 2)^2$'
        }
      ],
      // Forma 4 · Completar cuadrados
      [
        {
          title: 'Factorización con raíces enteras vía TCP',
          problem: 'Factoriza $x^2 + 6x - 16$ completando cuadrados.',
          steps: [
            'Suma y resta $(6/2)^2 = 9$: $(x^2 + 6x + 9) - 9 - 16 = (x + 3)^2 - 25$.',
            'Aplica diferencia de cuadrados: $((x + 3) - 5)((x + 3) + 5) = (x - 2)(x + 8)$.'
          ],
          result: '$(x - 2)(x + 8)$'
        },
        {
          title: 'Factorización sobre los reales con radicales',
          problem: 'Factoriza $x^2 - 4x - 1$ sobre $\\mathbb{R}$.',
          steps: [
            'Completa el cuadrado: $(x - 2)^2 - 4 - 1 = (x - 2)^2 - (\\sqrt{5})^2$.',
            'Aplica diferencia de cuadrados: $(x - 2 - \\sqrt{5})(x - 2 + \\sqrt{5})$.'
          ],
          result: '$(x - 2 - \\sqrt{5})(x - 2 + \\sqrt{5})$'
        }
      ]
    ],

    'alg-2': [
      // Forma 1 · Conjugado clásico
      [
        {
          title: 'Racionalizar denominador binomial con raíz',
          problem: 'Racionaliza $\\frac{10}{\\sqrt{7} - \\sqrt{2}}$.',
          steps: [
            'Multiplica por $\\frac{\\sqrt{7} + \\sqrt{2}}{\\sqrt{7} + \\sqrt{2}}$ sin expandir el numerador al inicio.',
            'El denominador resulta $7 - 2 = 5$, que simplifica al $10$: $2(\\sqrt{7} + \\sqrt{2})$.'
          ],
          result: '$2(\\sqrt{7} + \\sqrt{2})$'
        },
        {
          title: 'Racionalizar numerador en cociente algebraico',
          problem: 'Simplifica $\\frac{\\sqrt{x + 4} - 2}{x}$ para $x \\neq 0$.',
          steps: [
            'Multiplica arriba y abajo por $\\sqrt{x + 4} + 2$: $\\frac{(x + 4) - 4}{x(\\sqrt{x + 4} + 2)}$.',
            'Cancela $x$ arriba y abajo.'
          ],
          result: '$\\frac{1}{\\sqrt{x + 4} + 2}$'
        }
      ],
      // Forma 2 · Cambio de variable u = sqrt(...)
      [
        {
          title: 'Cociente con raíz cuadrada',
          problem: 'Simplifica $\\frac{\\sqrt{x} - 5}{x - 25}$ usando cambio de variable.',
          steps: [
            'Sea $u = \\sqrt{x} \\ge 0$, entonces $x = u^2$ y la fracción se vuelve $\\frac{u - 5}{u^2 - 25}$.',
            'Factoriza $\\frac{u - 5}{(u - 5)(u + 5)} = \\frac{1}{u + 5}$ y regresa a $x$.'
          ],
          result: '$\\frac{1}{\\sqrt{x} + 5}$'
        },
        {
          title: 'Cociente con raíz desplazada',
          problem: 'Simplifica $\\frac{\\sqrt{x + 1} - 3}{x - 8}$ con $u = \\sqrt{x + 1}$.',
          steps: [
            'Despeja $x = u^2 - 1$, de modo que $x - 8 = u^2 - 9 = (u - 3)(u + 3)$.',
            'Cancela $(u - 3)$ para obtener $\\frac{1}{u + 3} = \\frac{1}{\\sqrt{x + 1} + 3}$.'
          ],
          result: '$\\frac{1}{\\sqrt{x + 1} + 3}$'
        }
      ],
      // Forma 3 · Diferencia de cubos y factorización inversa
      [
        {
          title: 'Racionalización con raíz cúbica',
          problem: 'Simplifica $\\frac{x - 8}{\\sqrt[3]{x} - 2}$ para $x \\neq 8$.',
          steps: [
            'Escribe $x - 8 = (\\sqrt[3]{x})^3 - 2^3 = (\\sqrt[3]{x} - 2)(\\sqrt[3]{x^2} + 2\\sqrt[3]{x} + 4)$.',
            'Cancela el factor común $(\\sqrt[3]{x} - 2)$.'
          ],
          result: '$\\sqrt[3]{x^2} + 2\\sqrt[3]{x} + 4$'
        },
        {
          title: 'Factorización inversa directa de $x - a$',
          problem: 'Simplifica $\\frac{x - 3}{\\sqrt{x} - \\sqrt{3}}$ sin multiplicar por conjugado.',
          steps: [
            'Descompón directamente $x - 3 = (\\sqrt{x} - \\sqrt{3})(\\sqrt{x} + \\sqrt{3})$.',
            'Divide entre $(\\sqrt{x} - \\sqrt{3})$.'
          ],
          result: '$\\sqrt{x} + \\sqrt{3}$'
        }
      ]
    ],

    'alg-3': [
      // Forma 1 · Factorización y producto cero
      [
        {
          title: 'Cuadrática mónica con producto cero',
          problem: 'Resuelve $x^2 - 5x - 14 = 0$.',
          steps: [
            'Busca dos números que multipliquen $-14$ y sumen $-5$: $-7$ y $+2$.',
            'Factoriza $(x - 7)(x + 2) = 0$ e iguala cada factor a cero.'
          ],
          result: '$x_1 = 7,\\; x_2 = -2$'
        },
        {
          title: 'Cuadrática incompleta sin término constante',
          problem: 'Resuelve $4x^2 - 12x = 0$.',
          steps: [
            'Nunca dividas entre $x$; extrae factor común: $4x(x - 3) = 0$.',
            'Iguala ambos factores a $0$: $4x = 0$ o $x - 3 = 0$.'
          ],
          result: '$x_1 = 0,\\; x_2 = 3$'
        }
      ],
      // Forma 2 · Fórmula General / TCP
      [
        {
          title: 'Raíces irracionales con fórmula general',
          problem: 'Resuelve $2x^2 - 4x - 1 = 0$.',
          steps: [
            'Calcula $\\Delta = (-4)^2 - 4(2)(-1) = 16 + 8 = 24$, con $\\sqrt{24} = 2\\sqrt{6}$.',
            'Sustituye: $x = \\frac{4 \\pm 2\\sqrt{6}}{4} = 1 \\pm \\frac{\\sqrt{6}}{2}$.'
          ],
          result: '$x = 1 \\pm \\frac{\\sqrt{6}}{2}$'
        },
        {
          title: 'Completar el cuadrado paso a paso',
          problem: 'Resuelve $x^2 + 8x + 11 = 0$ por TCP.',
          steps: [
            'Aísla y suma $(8/2)^2 = 16$ en ambos lados: $(x + 4)^2 = -11 + 16 = 5$.',
            'Toma raíz cuadrada: $x + 4 = \\pm\\sqrt{5}$.'
          ],
          result: '$x = -4 \\pm \\sqrt{5}$'
        }
      ],
      // Forma 3 · Sistemas 2x2
      [
        {
          title: 'Eliminación (Reducción) rápida',
          problem: 'Resuelve $\\begin{cases} 2x + 3y = 13 \\\\ 4x - 3y = 5 \\end{cases}$.',
          steps: [
            'Suma ambas ecuaciones directamente para eliminar $y$: $6x = 18 \\Rightarrow x = 3$.',
            'Sustituye $x = 3$ en la primera: $6 + 3y = 13 \\Rightarrow y = \\frac{7}{3}$.'
          ],
          result: '$(3,\\; \\tfrac{7}{3})$'
        },
        {
          title: 'Regla de Cramer con determinantes',
          problem: 'Resuelve $\\begin{cases} 3x + y = 7 \\\\ x - 2y = -7 \\end{cases}$.',
          steps: [
            '$D = 3(-2) - 1(1) = -7$, $D_x = 7(-2) - 1(-7) = -7$, $D_y = 3(-7) - 7(1) = -28$.',
            'Divide: $x = \\frac{-7}{-7} = 1$ y $y = \\frac{-28}{-7} = 4$.'
          ],
          result: '$(1,\\; 4)$'
        }
      ],
      // Forma 4 · Verificación Vieta / Gráfica
      [
        {
          title: 'Comprobación instantánea con Vieta',
          problem: 'Verifica si $x_1 = 3$ y $x_2 = -\\frac{1}{2}$ son raíces de $2x^2 - 5x - 3 = 0$.',
          steps: [
            'Suma teórica $-\\frac{b}{a} = \\frac{5}{2}$; suma real: $3 + (-\\frac{1}{2}) = \\frac{5}{2}$ (coincide).',
            'Producto teórico $\\frac{c}{a} = -\\frac{3}{2}$; producto real: $3(-\\frac{1}{2}) = -\\frac{3}{2}$ (coincide).'
          ],
          result: 'Confirmado por Vieta'
        },
        {
          title: 'Ubicación del vértice desde las raíces',
          problem: 'Halla el vértice de $f(x) = x^2 - 6x + 5$ sabiendo que sus raíces son $1$ y $5$.',
          steps: [
            'Por simetría de la parábola, la abscisa del vértice es el punto medio: $x_v = \\frac{1 + 5}{2} = 3$.',
            'Evalúa $f(3) = 9 - 18 + 5 = -4$.'
          ],
          result: '$V(3,\\; -4)$'
        }
      ]
    ],

    'geo-1': [
      // Forma 1 · Ternas pitagóricas
      [
        {
          title: 'Múltiplo de la terna 3-4-5',
          problem: 'En un triángulo rectángulo con catetos $9$ y $12$, halla la hipotenusa.',
          steps: [
            'Identifica el factor común $3$: $9 = 3(3)$ y $12 = 3(4)$.',
            'La hipotenusa escala igual: $c = 3(5) = 15$.'
          ],
          result: '$15$'
        },
        {
          title: 'Múltiplo de la terna 5-12-13',
          problem: 'Una escalera de $26\\text{ m}$ se apoya a $10\\text{ m}$ de la pared. ¿Qué altura alcanza?',
          steps: [
            'Divide entre $2$: hipotenusa $13$, base $5$, que corresponde a la terna $5$-$12$-$13$.',
            'Multiplica el cateto faltante por $2$: $h = 2(12) = 24\\text{ m}$.'
          ],
          result: '$24\\text{ m}$'
        }
      ],
      // Forma 2 · Diferencia de cuadrados en Pitágoras
      [
        {
          title: 'Cateto con números grandes sin calculadora',
          problem: 'Halla el cateto $b$ si $c = 41$ y $a = 40$.',
          steps: [
            'Usa $b^2 = c^2 - a^2 = (41 - 40)(41 + 40) = 1 \\cdot 81$.',
            'Extrae la raíz cuadrada: $b = \\sqrt{81} = 9$.'
          ],
          result: '$9$'
        },
        {
          title: 'Factorización rápida con raíz exacta',
          problem: 'Calcula $b = \\sqrt{29^2 - 21^2}$.',
          steps: [
            'Factoriza la diferencia: $(29 - 21)(29 + 21) = 8 \\cdot 50 = 400$.',
            'Saca raíz: $\\sqrt{400} = 20$.'
          ],
          result: '$20$'
        }
      ],
      // Forma 3 · Herón vs Altura
      [
        {
          title: 'Triángulo escaleno con fórmula de Herón',
          problem: 'Calcula el área del triángulo de lados $13$, $14$ y $15$.',
          steps: [
            'Semiperímetro: $s = \\frac{13 + 14 + 15}{2} = 21$.',
            '$A = \\sqrt{21(8)(7)(6)} = \\sqrt{(3 \\cdot 7)(8)(7)(2 \\cdot 3)} = \\sqrt{3^2 \\cdot 7^2 \\cdot 4^2} = 3 \\cdot 7 \\cdot 4$.'
          ],
          result: '$84\\text{ u}^2$'
        },
        {
          title: 'Triángulo isósceles por altura',
          problem: 'Halla el área de un triángulo isósceles de lados $10, 10$ y base $12$.',
          steps: [
            'La altura divide la base en dos mitades de $6$; por terna $6$-$8$-$10$, $h = 8$.',
            'Aplica $A = \\frac{12 \\cdot 8}{2} = 48$.'
          ],
          result: '$48\\text{ u}^2$'
        }
      ]
    ],

    'geo-2': [
      // Forma 1 · Punto-Pendiente
      [
        {
          title: 'Recta tangente conocida la pendiente',
          problem: 'Halla la recta con pendiente $m = 4$ que pasa por $(2, -3)$.',
          steps: [
            'Sustituye en el molde: $y - (-3) = 4(x - 2)$.',
            'Simplifica: $y + 3 = 4x - 8 \\Rightarrow y = 4x - 11$.'
          ],
          result: '$y = 4x - 11$'
        },
        {
          title: 'Recta normal perpendicular a una tangente',
          problem: 'Halla la recta perpendicular a $y = 3x + 1$ que pasa por $(6, 5)$.',
          steps: [
            'La pendiente perpendicular es el recíproco negativo: $m_{\\perp} = -\\frac{1}{3}$.',
            'Aplica punto-pendiente: $y - 5 = -\\frac{1}{3}(x - 6) \\Rightarrow y = -\\frac{1}{3}x + 7$.'
          ],
          result: '$y = -\\frac{1}{3}x + 7$'
        }
      ],
      // Forma 2 · Despeje de b en y = mx + b
      [
        {
          title: 'Recta a partir de dos puntos',
          problem: 'Encuentra la ecuación que pasa por $(1, 4)$ y $(5, 12)$.',
          steps: [
            'Calcula $m = \\frac{12 - 4}{5 - 1} = 2$.',
            'Sustituye $(1, 4)$ en $y = 2x + b$: $4 = 2(1) + b \\Rightarrow b = 2$.'
          ],
          result: '$y = 2x + 2$'
        },
        {
          title: 'Recta paralela con despeje rápido de b',
          problem: 'Halla la recta paralela a $y = -2x + 9$ que pasa por $(-3, 1)$.',
          steps: [
            'Misma pendiente $m = -2$; sustituye en $1 = -2(-3) + b$.',
            'Despeja $b = 1 - 6 = -5$.'
          ],
          result: '$y = -2x - 5$'
        }
      ],
      // Forma 3 · Distancia punto-recta y forma general
      [
        {
          title: 'Distancia con terna pitagórica en el denominador',
          problem: 'Calcula la distancia del punto $(2, -1)$ a la recta $3x - 4y + 5 = 0$.',
          steps: [
            'Evalúa numerador: $|3(2) - 4(-1) + 5| = |6 + 4 + 5| = 15$.',
            'Divide entre $\\sqrt{3^2 + (-4)^2} = 5$: $d = \\frac{15}{5} = 3$.'
          ],
          result: '$d = 3$'
        },
        {
          title: 'Distancia entre dos rectas paralelas',
          problem: 'Halla la distancia entre $5x + 12y - 7 = 0$ y $5x + 12y + 19 = 0$.',
          steps: [
            'Usa $d = \\frac{|C_2 - C_1|}{\\sqrt{A^2 + B^2}} = \\frac{|19 - (-7)|}{\\sqrt{5^2 + 12^2}}$.',
            'Simplifica $\\frac{26}{13} = 2$.'
          ],
          result: '$d = 2$'
        }
      ]
    ],

    'trig-1': [
      // Forma 1 · Triángulo de Pitágoras
      [
        {
          title: 'Hallar coseno y tangente desde seno agudo',
          problem: 'Si $\\operatorname{sen}\\theta = \\frac{5}{13}$ con $\\theta$ agudo, calcula $\\cos\\theta$ y $\\tan\\theta$.',
          steps: [
            'Ubica opuesto $= 5$ e hipotenusa $= 13$; por terna $5$-$12$-$13$, el adyacente es $12$.',
            'Lee las razones: $\\cos\\theta = \\frac{12}{13}$ y $\\tan\\theta = \\frac{5}{12}$.'
          ],
          result: '$\\cos\\theta = \\frac{12}{13},\\; \\tan\\theta = \\frac{5}{12}$'
        },
        {
          title: 'Hallar seno y secante desde tangente',
          problem: 'Si $\\tan\\theta = \\frac{4}{3}$ en el cuadrante I, halla $\\operatorname{sen}\\theta$ y $\\sec\\theta$.',
          steps: [
            'Cateto opuesto $= 4$, adyacente $= 3$, luego la hipotenusa es $\\sqrt{4^2 + 3^2} = 5$.',
            'Entonces $\\operatorname{sen}\\theta = \\frac{4}{5}$ y $\\sec\\theta = \\frac{5}{3}$.'
          ],
          result: '$\\operatorname{sen}\\theta = \\frac{4}{5},\\; \\sec\\theta = \\frac{5}{3}$'
        }
      ],
      // Forma 2 · Círculo Unitario y Referencia
      [
        {
          title: 'Ángulo en el segundo cuadrante',
          problem: 'Calcula $\\cos(150^\\circ)$ y $\\operatorname{sen}(150^\\circ)$.',
          steps: [
            'Ángulo de referencia: $180^\\circ - 150^\\circ = 30^\\circ$.',
            'En el cuadrante II, el seno es positivo y el coseno es negativo: $\\operatorname{sen}150^\\circ = \\frac{1}{2}$ y $\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}$.'
          ],
          result: '$\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2},\\; \\operatorname{sen}150^\\circ = \\frac{1}{2}$'
        },
        {
          title: 'Ángulo en radianes en el cuarto cuadrante',
          problem: 'Evalúa $\\tan\\left(\\frac{7\\pi}{4}\\right)$.',
          steps: [
            'Está en el cuadrante IV con referencia $2\\pi - \\frac{7\\pi}{4} = \\frac{\\pi}{4}$.',
            'Como $\\tan(\\pi/4) = 1$ y en el cuadrante IV la tangente es negativa, resulta $-1$.'
          ],
          result: '$-1$'
        }
      ],
      // Forma 3 · Identidad pitagórica
      [
        {
          title: 'Coseno en cuadrante III usando la identidad',
          problem: 'Si $\\operatorname{sen}\\theta = -\\frac{3}{5}$ y $\\theta$ está en el cuadrante III, halla $\\cos\\theta$.',
          steps: [
            '$\\cos^2\\theta = 1 - \\left(-\\frac{3}{5}\\right)^2 = 1 - \\frac{9}{25} = \\frac{16}{25}$.',
            'En el cuadrante III el coseno es negativo, así que $\\cos\\theta = -\\frac{4}{5}$.'
          ],
          result: '$-\\frac{4}{5}$'
        },
        {
          title: 'Secante desde tangente con $1 + \\tan^2\\theta = \\sec^2\\theta$',
          problem: 'Si $\\tan\\theta = \\sqrt{3}$ en el cuadrante I, calcula $\\sec\\theta$.',
          steps: [
            '$\\sec^2\\theta = 1 + (\\sqrt{3})^2 = 1 + 3 = 4$.',
            'Al estar en el cuadrante I, se toma la raíz positiva: $\\sec\\theta = 2$.'
          ],
          result: '$2$'
        }
      ]
    ],

    'trig-2': [
      // Forma 1 · Todo a senos y cosenos
      [
        {
          title: 'Simplificar producto trigonométrico',
          problem: 'Simplifica $\\tan x \\cdot \\cos x \\cdot \\csc x$.',
          steps: [
            'Traduce a senos y cosenos: $\\frac{\\operatorname{sen}x}{\\cos x} \\cdot \\cos x \\cdot \\frac{1}{\\operatorname{sen}x}$.',
            'Cancela $\\cos x$ y $\\operatorname{sen}x$.'
          ],
          result: '$1$'
        },
        {
          title: 'Suma de tangente y cotangente',
          problem: 'Demuestra que $\\tan x + \\cot x = \\sec x \\csc x$.',
          steps: [
            'Escribe $\\frac{\\operatorname{sen}x}{\\cos x} + \\frac{\\cos x}{\\operatorname{sen}x} = \\frac{\\operatorname{sen}^2 x + \\cos^2 x}{\\operatorname{sen}x\\cos x}$.',
            'Usa $\\operatorname{sen}^2 x + \\cos^2 x = 1$ para obtener $\\frac{1}{\\cos x} \\cdot \\frac{1}{\\operatorname{sen}x} = \\sec x \\csc x$.'
          ],
          result: '$\\sec x \\csc x$'
        }
      ],
      // Forma 2 · Algebraica y conjugado trigonométrico
      [
        {
          title: 'Conjugado trigonométrico en el denominador',
          problem: 'Simplifica $\\frac{\\operatorname{sen}^2 x}{1 - \\cos x}$ para $\\cos x \\neq 1$.',
          steps: [
            'Sustituye $\\operatorname{sen}^2 x = 1 - \\cos^2 x = (1 - \\cos x)(1 + \\cos x)$.',
            'Cancela $(1 - \\cos x)$ arriba y abajo.'
          ],
          result: '$1 + \\cos x$'
        },
        {
          title: 'Diferencia de cuartas potencias',
          problem: 'Simplifica $\\cos^4 x - \\operatorname{sen}^4 x$.',
          steps: [
            'Factoriza como diferencia de cuadrados: $(\\cos^2 x - \\operatorname{sen}^2 x)(\\cos^2 x + \\operatorname{sen}^2 x)$.',
            'Como el segundo factor vale $1$, queda $\\cos^2 x - \\operatorname{sen}^2 x = \\cos(2x)$.'
          ],
          result: '$\\cos(2x)$'
        }
      ],
      // Forma 3 · Sustitución cuadrática u = cos(x) / sen(x)
      [
        {
          title: 'Ecuación cuadrática en $\\operatorname{sen}x$',
          problem: 'Resuelve $2\\operatorname{sen}^2 x - \\operatorname{sen}x - 1 = 0$ en $[0, 2\\pi)$.',
          steps: [
            'Con $u = \\operatorname{sen}x$: $2u^2 - u - 1 = (2u + 1)(u - 1) = 0 \\Rightarrow u = 1$ o $u = -\\frac{1}{2}$.',
            'Encuentra los ángulos en $[0, 2\\pi)$: $x = \\frac{\\pi}{2},\\; \\frac{7\\pi}{6},\\; \\frac{11\\pi}{6}$.'
          ],
          result: '$x \\in \\left\\{\\frac{\\pi}{2},\\; \\frac{7\\pi}{6},\\; \\frac{11\\pi}{6}\\right\\}$'
        },
        {
          title: 'Convertir a una sola razón antes de sustituir',
          problem: 'Resuelve $\\operatorname{sen}^2 x + \\cos x = 1$ en $[0, 2\\pi)$.',
          steps: [
            'Reemplaza $\\operatorname{sen}^2 x = 1 - \\cos^2 x$: $1 - \\cos^2 x + \\cos x = 1 \\Rightarrow \\cos x(1 - \\cos x) = 0$.',
            'De $\\cos x = 0$ salen $\\frac{\\pi}{2}, \\frac{3\\pi}{2}$ y de $\\cos x = 1$ sale $0$.'
          ],
          result: '$x \\in \\left\\{0,\\; \\frac{\\pi}{2},\\; \\frac{3\\pi}{2}\\right\\}$'
        }
      ]
    ],

    'func-1': [
      // Forma 1 · Filtros de Dominio
      [
        {
          title: 'Raíz cuadrada en el denominador',
          problem: 'Encuentra el dominio de $f(x) = \\frac{1}{\\sqrt{2x - 6}}$.',
          steps: [
            'Por estar dentro de raíz par y además en el denominador, se exige condición estricta: $2x - 6 > 0$.',
            'Despeja $x > 3$.'
          ],
          result: '$(3,\\; +\\infty)$'
        },
        {
          title: 'Intersección de raíz y logaritmo',
          problem: 'Determina el dominio de $g(x) = \\sqrt{5 - x} + \\ln(x + 1)$.',
          steps: [
            'Filtro 1 (raíz): $5 - x \\ge 0 \\Rightarrow x \\le 5$. Filtro 2 (logaritmo): $x + 1 > 0 \\Rightarrow x > -1$.',
            'Intersecta ambos intervalos sobre la recta numérica.'
          ],
          result: '$(-1,\\; 5]$'
        }
      ],
      // Forma 2 · Inversa paso a paso vs deshacer capas
      [
        {
          title: 'Inversa deshaciendo operaciones en orden inverso',
          problem: 'Halla $f^{-1}(x)$ para $f(x) = (x - 4)^3 + 2$.',
          steps: [
            'Capas directas: restar $4$, elevar al cubo, sumar $2$.',
            'Deshaz en reversa: resta $2$, extrae raíz cúbica y suma $4$: $\\sqrt[3]{x - 2} + 4$.'
          ],
          result: '$f^{-1}(x) = \\sqrt[3]{x - 2} + 4$'
        },
        {
          title: 'Inversa de función racional',
          problem: 'Calcula la inversa de $f(x) = \\frac{2x + 1}{x - 3}$.',
          steps: [
            'Intercambia $x = \\frac{2y + 1}{y - 3} \\Rightarrow x(y - 3) = 2y + 1 \\Rightarrow y(x - 2) = 3x + 1$.',
            'Despeja $y = \\frac{3x + 1}{x - 2}$.'
          ],
          result: '$f^{-1}(x) = \\frac{3x + 1}{x - 2}$'
        }
      ],
      // Forma 3 · División polinomial para asíntotas y huecos
      [
        {
          title: 'Separar asíntota horizontal en función racional',
          problem: 'Reescribe $f(x) = \\frac{3x + 5}{x - 1}$ como $Q + \\frac{R}{x - 1}$.',
          steps: [
            'Escribe el numerador en términos de $(x - 1)$: $3(x - 1) + 8$.',
            'Divide: $f(x) = 3 + \\frac{8}{x - 1}$, revelando asíntota horizontal $y = 3$ y vertical $x = 1$.'
          ],
          result: '$3 + \\frac{8}{x - 1}$'
        },
        {
          title: 'Detectar asíntota oblicua con división',
          problem: 'Halla la asíntota oblicua de $f(x) = \\frac{x^2 + 2x + 5}{x + 1}$.',
          steps: [
            'Divide sintéticamente entre $-1$: cociente $x + 1$ y residuo $4$.',
            'Queda $f(x) = (x + 1) + \\frac{4}{x + 1}$; cuando $|x| \\to \\infty$, el residuo tiende a $0$.'
          ],
          result: 'Asíntota oblicua $y = x + 1$'
        }
      ]
    ],

    'func-2': [
      // Forma 1 · Bases iguales
      [
        {
          title: 'Ecuación exponencial en base 3',
          problem: 'Resuelve $9^{x - 1} = 27^x$.',
          steps: [
            'Convierte a base $3$: $(3^2)^{x - 1} = (3^3)^x \\Rightarrow 3^{2x - 2} = 3^{3x}$.',
            'Iguala exponentes: $2x - 2 = 3x \\Rightarrow x = -2$.'
          ],
          result: '$x = -2$'
        },
        {
          title: 'Exponencial con fracción en el lado derecho',
          problem: 'Resuelve $4^{x + 2} = \\frac{1}{8}$.',
          steps: [
            'Reescribe en base $2$: $(2^2)^{x + 2} = 2^{-3} \\Rightarrow 2^{2x + 4} = 2^{-3}$.',
            'Iguala exponentes: $2x + 4 = -3 \\Rightarrow x = -\\frac{7}{2}$.'
          ],
          result: '$x = -\\frac{7}{2}$'
        }
      ],
      // Forma 2 · Aplicar ln a ambos lados
      [
        {
          title: 'Bases sin potencia común (5 y 12)',
          problem: 'Resuelve $5^{2x - 1} = 12$.',
          steps: [
            'Aplica logaritmo natural: $(2x - 1)\\ln 5 = \\ln 12$.',
            'Despeja $x = \\frac{\\ln 12 / \\ln 5 + 1}{2} \\approx 1.272$.'
          ],
          result: '$x = \\frac{1}{2}\\left(\\frac{\\ln 12}{\\ln 5} + 1\\right) \\approx 1.272$'
        },
        {
          title: 'Tiempo de duplicación exponencial',
          problem: 'Resuelve $e^{0.05t} = 2$ para hallar $t$.',
          steps: [
            'Toma $\\ln$ en ambos lados: $0.05t = \\ln 2$.',
            'Divide: $t = \\frac{\\ln 2}{0.05} = 20\\ln 2 \\approx 13.86$.'
          ],
          result: '$t = 20\\ln 2 \\approx 13.86$'
        }
      ],
      // Forma 3 · Ecuaciones logarítmicas (2 caminos)
      [
        {
          title: 'Juntar logaritmos y elevar con base $e$',
          problem: 'Resuelve $\\ln(x) + \\ln(x - 2) = \\ln(8)$.',
          steps: [
            'Combina en un solo logaritmo: $\\ln(x(x - 2)) = \\ln(8) \\Rightarrow x^2 - 2x - 8 = 0$.',
            'Factoriza $(x - 4)(x + 2) = 0$; descarta $x = -2$ por dominio ($x > 2$).'
          ],
          result: '$x = 4$'
        },
        {
          title: 'Aplicar exponencial para despejar argumento',
          problem: 'Resuelve $\\log_2(3x + 1) = 4$.',
          steps: [
            'Convierte a forma exponencial con base $2$: $3x + 1 = 2^4 = 16$.',
            'Despeja $3x = 15 \\Rightarrow x = 5$ (cumple $3(5)+1 > 0$).'
          ],
          result: '$x = 5$'
        }
      ]
    ],

    'lim-1': [
      // Forma 1 · Sustitución y Leyes
      [
        {
          title: 'Sustitución directa en función racional sin indeterminación',
          problem: 'Calcula $\\lim_{x \\to 2} \\frac{3x^2 - 5}{x + 4}$.',
          steps: [
            'Verifica el denominador en $x = 2$: $2 + 4 = 6 \\neq 0$.',
            'Evalúa directamente: $\\frac{3(4) - 5}{6} = \\frac{7}{6}$.'
          ],
          result: '$\\frac{7}{6}$'
        },
        {
          title: 'Leyes algebraicas con límites conocidos',
          problem: 'Si $\\lim_{x \\to 3} f(x) = 4$ y $\\lim_{x \\to 3} g(x) = -2$, halla $\\lim_{x \\to 3} \\sqrt{f(x)^2 - 5g(x) - 1}$.',
          steps: [
            'Aplica suma, potencia y raíz porque el radicando resulta positivo.',
            'Sustituye: $\\sqrt{4^2 - 5(-2) - 1} = \\sqrt{16 + 10 - 1} = \\sqrt{25}$.'
          ],
          result: '$5$'
        }
      ],
      // Forma 2 · Límites Laterales
      [
        {
          title: 'Función por tramos con coincidencia lateral',
          problem: 'Estudia $\\lim_{x \\to 1} f(x)$ si $f(x) = x^2 + 2$ para $x < 1$ y $f(x) = 4x - 1$ para $x \\ge 1$.',
          steps: [
            'Por izquierda ($1^-$): $1^2 + 2 = 3$. Por derecha ($1^+$): $4(1) - 1 = 3$.',
            'Como ambos límites laterales son iguales a $3$, el límite bilateral existe.'
          ],
          result: '$3$'
        },
        {
          title: 'Salto finito con valor absoluto',
          problem: 'Analiza $\\lim_{x \\to 4} \\frac{|x - 4|}{x - 4}$.',
          steps: [
            'Para $x \\to 4^-$, $|x - 4| = -(x - 4)$, luego el límite izquierdo es $-1$.',
            'Para $x \\to 4^+$, $|x - 4| = x - 4$, luego el límite derecho es $+1$. Como $-1 \\neq 1$, no existe.'
          ],
          result: 'No existe (salto de $-1$ a $+1$)'
        }
      ],
      // Forma 3 · Tabla numérica de aproximación
      [
        {
          title: 'Estimar el límite exponencial fundamental',
          problem: 'Aproxima $\\lim_{x \\to 0} \\frac{e^x - 1}{x}$ usando tabla simétrica.',
          steps: [
            'Evalúa en $x = \\pm 0.1$: $0.9516$ y $1.0517$; en $x = \\pm 0.01$: $0.9950$ y $1.0050$.',
            'En $x = \\pm 0.001$ ambos lados dan $0.9995$ y $1.0005$, convergiendo claramente a $1$.'
          ],
          result: '$1$'
        },
        {
          title: 'Confirmar límite con raíz por acercamiento',
          problem: 'Verifica numéricamente $\\lim_{x \\to 9} \\frac{\\sqrt{x} - 3}{x - 9}$.',
          steps: [
            'Para $x = 8.999$, $\\frac{\\sqrt{8.999} - 3}{-0.001} \\approx 0.166671$; para $x = 9.001$, $\\approx 0.166662$.',
            'Ambos lados se estrechan hacia $0.1666\\dots = \\frac{1}{6}$.'
          ],
          result: '$\\frac{1}{6}$'
        }
      ],
      // Forma 4 · Lectura Gráfica
      [
        {
          title: 'Punto hueco con valor puntual desplazado',
          problem: 'Una gráfica sigue $y = 2x + 1$ salvo en $x = 2$, donde hay un hueco en $(2, 5)$ y un punto relleno en $(2, 8)$. ¿Cuál es $\\lim_{x \\to 2} f(x)$?',
          steps: [
            'Ignora el punto aislado $(2, 8)$ y sigue la curva desde ambos lados hacia $x = 2$.',
            'Tanto desde la izquierda como desde la derecha las alturas se acercan a $y = 5$.'
          ],
          result: '$5$'
        },
        {
          title: 'Oscilación rápida cerca del origen',
          problem: 'Interpreta gráficamente $\\lim_{x \\to 0} \\operatorname{sen}\\left(\\frac{1}{x}\\right)$.',
          steps: [
            'Al acercarse a $x = 0$, la curva oscila infinitas veces entre $-1$ y $+1$ sin estabilizarse.',
            'No hay una única altura límite $L$ a la cual converjan ambas ramas.'
          ],
          result: 'No existe (oscilación acotada)'
        }
      ],
      // Forma 5 · Demostración epsilon-delta
      [
        {
          title: 'Demostración $\\varepsilon$-$\\delta$ de una recta',
          problem: 'Halla $\\delta$ en función de $\\varepsilon$ para probar $\\lim_{x \\to 2} (5x - 3) = 7$.',
          steps: [
            'Plantea $|(5x - 3) - 7| = |5x - 10| = 5|x - 2| < \\varepsilon$.',
            'Despeja $|x - 2| < \\frac{\\varepsilon}{5}$; elige $\\delta = \\frac{\\varepsilon}{5}$.'
          ],
          result: '$\\delta = \\frac{\\varepsilon}{5}$'
        },
        {
          title: 'Demostración $\\varepsilon$-$\\delta$ cuadrática con acotamiento $\\delta \\le 1$',
          problem: 'Encuentra $\\delta$ para probar $\\lim_{x \\to 3} x^2 = 9$.',
          steps: [
            'Factoriza $|x^2 - 9| = |x + 3|\\,|x - 3|$. Si impones $\\delta \\le 1$, entonces $2 < x < 4$ y $|x + 3| < 7$.',
            'Basta elegir $\\delta = \\min\\left(1,\\; \\frac{\\varepsilon}{7}\\right)$ para garantizar $|x^2 - 9| < 7 \\cdot \\frac{\\varepsilon}{7} = \\varepsilon$.'
          ],
          result: '$\\delta = \\min\\left(1,\\; \\frac{\\varepsilon}{7}\\right)$'
        }
      ]
    ],

    'lim-2': [
      // Forma 1 · Factorización y Ruffini
      [
        {
          title: 'Diferencia de cubos en indeterminación $0/0$',
          problem: 'Calcula $\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$.',
          steps: [
            'Factoriza arriba y abajo: $\\frac{(x - 2)(x^2 + 2x + 4)}{(x - 2)(x + 2)}$.',
            'Cancela $(x - 2)$ y sustituye $x = 2$: $\\frac{4 + 4 + 4}{4} = 3$.'
          ],
          result: '$3$'
        },
        {
          title: 'División sintética para grado 3',
          problem: 'Evalúa $\\lim_{x \\to 1} \\frac{x^3 - 2x^2 + 5x - 4}{x - 1}$.',
          steps: [
            'Como $1 - 2 + 5 - 4 = 0$, aplica Ruffini con raíz $1$: cociente $x^2 - x + 4$.',
            'Cancela $(x - 1)$ y evalúa en $x = 1$: $1 - 1 + 4 = 4$.'
          ],
          result: '$4$'
        }
      ],
      // Forma 2 · Conjugado / Doble conjugado
      [
        {
          title: 'Conjugado simple en el numerador',
          problem: 'Calcula $\\lim_{x \\to 5} \\frac{\\sqrt{x + 4} - 3}{x - 5}$.',
          steps: [
            'Multiplica por $\\frac{\\sqrt{x + 4} + 3}{\\sqrt{x + 4} + 3}$: $\\frac{(x + 4) - 9}{(x - 5)(\\sqrt{x + 4} + 3)} = \\frac{1}{\\sqrt{x + 4} + 3}$.',
            'Sustituye $x = 5$: $\\frac{1}{3 + 3} = \\frac{1}{6}$.'
          ],
          result: '$\\frac{1}{6}$'
        },
        {
          title: 'Doble conjugado (raíces arriba y abajo)',
          problem: 'Evalúa $\\lim_{x \\to 0} \\frac{\\sqrt{1 + x} - 1}{\\sqrt{4 + x} - 2}$.',
          steps: [
            'Multiplica por ambos conjugados: $\\frac{[(1 + x) - 1](\\sqrt{4 + x} + 2)}{[(4 + x) - 4](\\sqrt{1 + x} + 1)} = \\frac{x(\\sqrt{4 + x} + 2)}{x(\\sqrt{1 + x} + 1)}$.',
            'Cancela $x$ y sustituye $x = 0$: $\\frac{2 + 2}{1 + 1} = 2$.'
          ],
          result: '$2$'
        }
      ],
      // Forma 3 · Cambio de variable racionalizador
      [
        {
          title: 'Raíz cúbica eliminada con $u = \\sqrt[3]{x}$',
          problem: 'Calcula $\\lim_{x \\to 27} \\frac{\\sqrt[3]{x} - 3}{x - 27}$.',
          steps: [
            'Sea $u = \\sqrt[3]{x}$; cuando $x \\to 27$, $u \\to 3$ y $x = u^3$.',
            'Queda $\\lim_{u \\to 3} \\frac{u - 3}{(u - 3)(u^2 + 3u + 9)} = \\frac{1}{9 + 9 + 9} = \\frac{1}{27}$.'
          ],
          result: '$\\frac{1}{27}$'
        },
        {
          title: 'Mínimo común índice $u = x^{1/6}$ para raíz cuadrada y cúbica',
          problem: 'Evalúa $\\lim_{x \\to 1} \\frac{\\sqrt{x} - 1}{\\sqrt[3]{x} - 1}$.',
          steps: [
            'Sea $u = x^{1/6} \\to 1$, entonces $\\sqrt{x} = u^3$ y $\\sqrt[3]{x} = u^2$.',
            '$\\lim_{u \\to 1} \\frac{(u - 1)(u^2 + u + 1)}{(u - 1)(u + 1)} = \\frac{3}{2}$.'
          ],
          result: '$\\frac{3}{2}$'
        }
      ],
      // Forma 4 · Traslación h = x - a
      [
        {
          title: 'Traslación al origen en potencia alta',
          problem: 'Calcula $\\lim_{x \\to 1} \\frac{x^4 - 1}{x - 1}$ haciendo $h = x - 1$.',
          steps: [
            'Sustituye $x = 1 + h$ con $h \\to 0$: $\\frac{(1 + h)^4 - 1}{h} = \\frac{4h + 6h^2 + 4h^3 + h^4}{h}$.',
            'Cancela $h$ y evalúa $h = 0$: $4 + 0 = 4$.'
          ],
          result: '$4$'
        },
        {
          title: 'Traslación en límite con polinomio desplazado',
          problem: 'Evalúa $\\lim_{x \\to 2} \\frac{(x - 1)^3 - 1}{x - 2}$.',
          steps: [
            'Con $h = x - 2 \\to 0$, $x - 1 = 1 + h$, luego $\\lim_{h \\to 0} \\frac{(1 + h)^3 - 1}{h}$.',
            'Expande: $\\lim_{h \\to 0} \\frac{3h + 3h^2 + h^3}{h} = 3$.'
          ],
          result: '$3$'
        }
      ],
      // Forma 5 · Conexión con Derivadas / L'Hôpital
      [
        {
          title: 'Reconocimiento directo como derivada en un punto',
          problem: 'Evalúa $\\lim_{x \\to 2} \\frac{x^5 - 32}{x - 2}$ interpretándolo como $f\'(2)$.',
          steps: [
            'Identifica $f(x) = x^5$ con $f(2) = 32$; el límite es exactamente $f\'(2)$.',
            'Como $f\'(x) = 5x^4$, evalúa $f\'(2) = 5(2^4) = 80$.'
          ],
          result: '$80$'
        },
        {
          title: 'Verificación rápida por L\'Hôpital en forma $0/0$',
          problem: 'Comprueba $\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x^2 - 16}$.',
          steps: [
            'Ambas partes tienden a $0$; deriva numerador y denominador por separado: $\\frac{\\frac{1}{2\\sqrt{x}}}{2x}$.',
            'Evalúa en $x = 4$: $\\frac{1/4}{8} = \\frac{1}{32}$.'
          ],
          result: '$\\frac{1}{32}$'
        }
      ]
    ],

    'lim-3': [
      // Forma 1 · Dividir entre mayor potencia
      [
        {
          title: 'Igual grado en numerador y denominador',
          problem: 'Calcula $\\lim_{x \\to \\infty} \\frac{4x^3 - 2x + 7}{5x^3 + 9x^2 - 1}$.',
          steps: [
            'Divide arriba y abajo entre $x^3$: $\\frac{4 - 2/x^2 + 7/x^3}{5 + 9/x - 1/x^3}$.',
            'Todos los términos $k/x^n \\to 0$, quedando $\\frac{4}{5}$.'
          ],
          result: '$\\frac{4}{5}$'
        },
        {
          title: 'Denominador de mayor grado',
          problem: 'Calcula $\\lim_{x \\to \\infty} \\frac{7x^2 + 100x}{2x^3 - 5}$.',
          steps: [
            'Divide entre $x^3$: $\\frac{7/x + 100/x^2}{2 - 5/x^3}$.',
            'Al pasar al límite queda $\\frac{0}{2} = 0$.'
          ],
          result: '$0$'
        }
      ],
      // Forma 2 · Términos dominantes (Atajo)
      [
        {
          title: 'Atajo con radical en el denominador',
          problem: 'Evalúa $\\lim_{x \\to +\\infty} \\frac{6x - 11}{\\sqrt{9x^2 + 5x + 1}}$.',
          steps: [
            'Conserva líderes: arriba $6x$; abajo $\\sqrt{9x^2} = 3|x| = 3x$ (ya que $x > 0$).',
            'Simplifica la razón líder: $\\frac{6x}{3x} = 2$.'
          ],
          result: '$2$'
        },
        {
          title: 'Numerador de grado superior',
          problem: 'Determina $\\lim_{x \\to +\\infty} \\frac{3x^4 - 8x^2}{x^2 + 5x}$.',
          steps: [
            'La razón de términos dominantes es $\\frac{3x^4}{x^2} = 3x^2$.',
            'Cuando $x \\to +\\infty$, $3x^2 \\to +\\infty$.'
          ],
          result: '$+\\infty$'
        }
      ],
      // Forma 3 · Sustitución t = -x cuando x -> -infty
      [
        {
          title: 'Raíz cuadrada con $x \\to -\\infty$',
          problem: 'Calcula $\\lim_{x \\to -\\infty} \\frac{2x + 3}{\\sqrt{x^2 + 4}}$.',
          steps: [
            'Haz $t = -x \\to +\\infty$ ($x = -t$): $\\lim_{t \\to +\\infty} \\frac{-2t + 3}{\\sqrt{t^2 + 4}}$.',
            'Ahora $t > 0$, así que $\\sqrt{t^2} = +t$; la razón dominante es $\\frac{-2t}{t} = -2$.'
          ],
          result: '$-2$'
        },
        {
          title: 'Diferencia de radicales en $-\\infty$',
          problem: 'Evalúa $\\lim_{x \\to -\\infty} (\\sqrt{x^2 - 6x} + x)$.',
          steps: [
            'Cambia $x = -t$ con $t \\to +\\infty$: $\\lim_{t \\to +\\infty} (\\sqrt{t^2 + 6t} - t)$.',
            'Multiplica por el conjugado: $\\lim_{t \\to +\\infty} \\frac{6t}{\\sqrt{t^2 + 6t} + t} = \\frac{6}{1 + 1} = 3$.'
          ],
          result: '$3$'
        }
      ],
      // Forma 4 · Inversión u = 1/x -> 0
      [
        {
          title: 'Trigonométrica en el infinito transformada a $u \\to 0$',
          problem: 'Calcula $\\lim_{x \\to \\infty} x \\cdot \\operatorname{sen}\\left(\\frac{4}{x}\\right)$.',
          steps: [
            'Sea $u = \\frac{1}{x} \\to 0^+$: el límite se vuelve $\\lim_{u \\to 0^+} \\frac{\\operatorname{sen}(4u)}{u}$.',
            'Multiplica y divide por $4$: $4 \\lim_{u \\to 0^+} \\frac{\\operatorname{sen}(4u)}{4u} = 4$.'
          ],
          result: '$4$'
        },
        {
          title: 'Exponencial con $1/x$ convertida a $u = 0$',
          problem: 'Evalúa $\\lim_{x \\to \\infty} x\\left(e^{3/x} - 1\\right)$.',
          steps: [
            'Con $u = \\frac{1}{x} \\to 0^+$, queda $\\lim_{u \\to 0^+} \\frac{e^{3u} - 1}{u}$.',
            'Ajusta $3u$: $3 \\lim_{u \\to 0^+} \\frac{e^{3u} - 1}{3u} = 3$.'
          ],
          result: '$3$'
        }
      ],
      // Forma 5 · Test de signos para Asíntotas Verticales
      [
        {
          title: 'Asíntota vertical con signos opuestos',
          problem: 'Determina el comportamiento de $f(x) = \\frac{x + 2}{x - 3}$ alrededor de $x = 3$.',
          steps: [
            'En $x = 3$, el numerador vale $5 > 0$ y el denominador vale $0$ (no se cancela: es asíntota vertical).',
            'En $3^-$: $\\frac{+}{0^-} = -\\infty$; en $3^+$: $\\frac{+}{0^+} = +\\infty$.'
          ],
          result: 'AV en $x = 3$ ($-\\infty$ a izq., $+\\infty$ a der.)'
        },
        {
          title: 'Distinguir hueco vs. asíntota vertical',
          problem: 'Clasifica las singularidades de $f(x) = \\frac{x - 2}{x^2 - 4}$.',
          steps: [
            'Factoriza $\\frac{x - 2}{(x - 2)(x + 2)} = \\frac{1}{x + 2}$ para $x \\neq 2$.',
            'En $x = 2$ se cancela el factor (hueco en $(2, \\frac{1}{4})$); en $x = -2$ queda $\\frac{1}{0}$ (asíntota vertical).'
          ],
          result: 'Hueco en $x = 2$; AV en $x = -2$'
        }
      ]
    ],

    'lim-4': [
      // Forma 1 · Completar argumento u = kx
      [
        {
          title: 'Cociente de dos senos con argumentos distintos',
          problem: 'Calcula $\\lim_{x \\to 0} \\frac{\\operatorname{sen}(7x)}{\\operatorname{sen}(2x)}$.',
          steps: [
            'Divide numerador y denominador entre $x$: $\\frac{7 \\cdot \\frac{\\operatorname{sen}(7x)}{7x}}{2 \\cdot \\frac{\\operatorname{sen}(2x)}{2x}}$.',
            'Cada cociente fundamental tiende a $1$, quedando $\\frac{7}{2}$.'
          ],
          result: '$\\frac{7}{2}$'
        },
        {
          title: 'Límite con tangente en el numerador',
          problem: 'Evalúa $\\lim_{x \\to 0} \\frac{\\tan(5x)}{3x}$.',
          steps: [
            'Escribe $\\tan(5x) = \\frac{\\operatorname{sen}(5x)}{\\cos(5x)}$: $\\frac{5}{3} \\cdot \\frac{\\operatorname{sen}(5x)}{5x} \\cdot \\frac{1}{\\cos(5x)}$.',
            'Al tender $x \\to 0$, resulta $\\frac{5}{3} \\cdot 1 \\cdot \\frac{1}{1}$.'
          ],
          result: '$\\frac{5}{3}$'
        }
      ],
      // Forma 2 · Conjugado vs Ángulo Medio en (1 - cos u)
      [
        {
          title: 'Ruta por ángulo medio en $(1 - \\cos(4x))/x^2$',
          problem: 'Calcula $\\lim_{x \\to 0} \\frac{1 - \\cos(4x)}{x^2}$.',
          steps: [
            'Usa $1 - \\cos(4x) = 2\\operatorname{sen}^2(2x)$: $\\lim_{x \\to 0} \\frac{2\\operatorname{sen}^2(2x)}{x^2} = 2 \\cdot 4 \\left(\\frac{\\operatorname{sen}(2x)}{2x}\\right)^2$.',
            'Evalúa: $8 \\cdot 1^2 = 8$.'
          ],
          result: '$8$'
        },
        {
          title: 'Ruta por conjugado en $(1 - \\cos(3x))/(x\\operatorname{sen}x)$',
          problem: 'Evalúa $\\lim_{x \\to 0} \\frac{1 - \\cos(3x)}{x\\operatorname{sen}x}$.',
          steps: [
            'Multiplica por $\\frac{1 + \\cos(3x)}{1 + \\cos(3x)}$: $\\frac{\\operatorname{sen}^2(3x)}{x\\operatorname{sen}x(1 + \\cos(3x))}$.',
            'Reagrupa: $9\\left(\\frac{\\operatorname{sen}(3x)}{3x}\\right)^2 \\cdot \\frac{x}{\\operatorname{sen}x} \\cdot \\frac{1}{1 + \\cos(3x)} \\to \\frac{9}{2}$.'
          ],
          result: '$\\frac{9}{2}$'
        }
      ],
      // Forma 3 · Cambio de variable u = x - a
      [
        {
          title: 'Límite trigonométrico en $x \\to \\pi$',
          problem: 'Calcula $\\lim_{x \\to \\pi} \\frac{\\operatorname{sen}x}{x - \\pi}$.',
          steps: [
            'Haz $u = x - \\pi \\to 0$ ($x = u + \\pi$): $\\operatorname{sen}(u + \\pi) = -\\operatorname{sen}u$.',
            'Queda $\\lim_{u \\to 0} \\frac{-\\operatorname{sen}u}{u} = -1$.'
          ],
          result: '$-1$'
        },
        {
          title: 'Límite con coseno en $x \\to \\pi/2$',
          problem: 'Evalúa $\\lim_{x \\to \\pi/2} \\frac{\\cos x}{x - \\pi/2}$.',
          steps: [
            'Sea $u = x - \\frac{\\pi}{2} \\to 0$; entonces $\\cos\\left(u + \\frac{\\pi}{2}\\right) = -\\operatorname{sen}u$.',
            'Calcula $\\lim_{u \\to 0} \\frac{-\\operatorname{sen}u}{u} = -1$.'
          ],
          result: '$-1$'
        }
      ],
      // Forma 4 · Sándwich y L'Hôpital
      [
        {
          title: 'Teorema del Sándwich con oscilación amortiguada',
          problem: 'Demuestra que $\\lim_{x \\to 0} x^2 \\cos\\left(\\frac{1}{x}\\right) = 0$.',
          steps: [
            'Acota $-1 \\le \\cos(1/x) \\le 1$ y multiplica por $x^2 \\ge 0$: $-x^2 \\le x^2\\cos(1/x) \\le x^2$.',
            'Como $\\lim_{x\\to 0}(-x^2) = \\lim_{x\\to 0} x^2 = 0$, el límite atrapado vale $0$.'
          ],
          result: '$0$'
        },
        {
          title: 'Acotamiento al infinito',
          problem: 'Calcula $\\lim_{x \\to \\infty} \\frac{3\\operatorname{sen}(x^2) + 5}{x}$.',
          steps: [
            'Como $-1 \\le \\operatorname{sen}(x^2) \\le 1$, el numerador está entre $2$ y $8$: $\\frac{2}{x} \\le \\frac{3\\operatorname{sen}(x^2)+5}{x} \\le \\frac{8}{x}$.',
            'Ambos extremos tienden a $0$ cuando $x \\to \\infty$.'
          ],
          result: '$0$'
        }
      ],
      // Forma 5 · Checklist de Continuidad
      [
        {
          title: 'Ajustar parámetro $k$ para lograr continuidad',
          problem: 'Halla $k$ para que $f(x) = \\begin{cases} kx + 1 & x \\le 2 \\\\ x^2 + 3 & x > 2 \\end{cases}$ sea continua en $x = 2$.',
          steps: [
            'Comprueba las 3 condiciones: $f(2) = 2k + 1$, límite izq. $= 2k + 1$, límite der. $= 2^2 + 3 = 7$.',
            'Iguala $2k + 1 = 7 \\Rightarrow k = 3$.'
          ],
          result: '$k = 3$'
        },
        {
          title: 'Reparar discontinuidad removible',
          problem: 'Define $f(3)$ para hacer continua a $f(x) = \\frac{x^2 - 9}{x - 3}$ en $x = 3$.',
          steps: [
            'Calcula el límite: $\\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{x - 3} = 6$.',
            'Asigna $f(3) = 6$ para rellenar el hueco exactamente.'
          ],
          result: '$f(3) = 6$'
        }
      ]
    ],

    'der-1': [
      // Forma 1 · Incremento h -> 0
      [
        {
          title: 'Derivada de $f(x) = 3x^2 - 2x$ por $h \\to 0$',
          problem: 'Halla $f\'(x)$ usando $\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$.',
          steps: [
            'Expande $f(x+h) - f(x) = [3(x^2 + 2xh + h^2) - 2(x + h)] - (3x^2 - 2x) = 6xh + 3h^2 - 2h$.',
            'Divide entre $h$ y toma $h \\to 0$: $\\lim_{h \\to 0} (6x + 3h - 2) = 6x - 2$.'
          ],
          result: '$f\'(x) = 6x - 2$'
        },
        {
          title: 'Derivada de recíproco $f(x) = \\frac{1}{x}$ por $h \\to 0$',
          problem: 'Calcula $f\'(x)$ para $f(x) = \\frac{1}{x}$ con $x \\neq 0$.',
          steps: [
            'Combina fracciones: $\\frac{\\frac{1}{x+h} - \\frac{1}{x}}{h} = \\frac{x - (x + h)}{h\\,x(x + h)} = \\frac{-1}{x(x + h)}$.',
            'Evalúa $h \\to 0$: $-\\frac{1}{x^2}$.'
          ],
          result: '$f\'(x) = -\\frac{1}{x^2}$'
        }
      ],
      // Forma 2 · Cambio t -> x (denominador t - x)
      [
        {
          title: 'Derivada de $f(x) = x^3$ usando $(t - x)$',
          problem: 'Calcula $f\'(x) = \\lim_{t \\to x} \\frac{t^3 - x^3}{t - x}$.',
          steps: [
            'Factoriza la diferencia de cubos: $\\frac{(t - x)(t^2 + tx + x^2)}{t - x} = t^2 + tx + x^2$.',
            'Sustituye $t = x$: $x^2 + x^2 + x^2 = 3x^2$.'
          ],
          result: '$f\'(x) = 3x^2$'
        },
        {
          title: 'Derivada de $f(x) = \\sqrt{x}$ en un punto con $t \\to x$',
          problem: 'Halla $f\'(x)$ usando $\\lim_{t \\to x} \\frac{\\sqrt{t} - \\sqrt{x}}{t - x}$ para $x > 0$.',
          steps: [
            'Descompón $t - x = (\\sqrt{t} - \\sqrt{x})(\\sqrt{t} + \\sqrt{x})$ y cancela $(\\sqrt{t} - \\sqrt{x})$.',
            'Queda $\\lim_{t \\to x} \\frac{1}{\\sqrt{t} + \\sqrt{x}} = \\frac{1}{2\\sqrt{x}}$.'
          ],
          result: '$f\'(x) = \\frac{1}{2\\sqrt{x}}$'
        }
      ],
      // Forma 3 · Geométrica (Secantes -> Tangente y linealización)
      [
        {
          title: 'Recta tangente y normal en un punto',
          problem: 'Halla tangente y normal a $f(x) = x^2 + 1$ en $x = 2$.',
          steps: [
            'Punto $(2, 5)$ y pendiente tangente $m_t = f\'(2) = 2(2) = 4$; pendiente normal $m_n = -\\frac{1}{4}$.',
            'Tangente: $y - 5 = 4(x - 2) \\Rightarrow y = 4x - 3$. Normal: $y = -\\frac{1}{4}x + \\frac{11}{2}$.'
          ],
          result: 'Tangente $y = 4x - 3$; Normal $y = -\\frac{1}{4}x + \\frac{11}{2}$'
        },
        {
          title: 'Aproximación lineal (linealización)',
          problem: 'Usa la recta tangente a $f(x) = \\sqrt{x}$ en $x = 16$ para estimar $\\sqrt{16.4}$.',
          steps: [
            'Como $f(16) = 4$ y $f\'(16) = \\frac{1}{2\\sqrt{16}} = \\frac{1}{8} = 0.125$, $L(x) = 4 + 0.125(x - 16)$.',
            'Evalúa $L(16.4) = 4 + 0.125(0.4) = 4.05$ (valor real $\\approx 4.0497$).'
          ],
          result: '$\\sqrt{16.4} \\approx 4.05$'
        }
      ],
      // Forma 4 · Numérica centrada y derivadas laterales
      [
        {
          title: 'Estimación numérica centrada de $f\'(1)$',
          problem: 'Estima $f\'(1)$ para $f(x) = x^3$ usando $h = 0.01$.',
          steps: [
            'Calcula $\\frac{f(1.01) - f(0.99)}{0.02} = \\frac{1.030301 - 0.970299}{0.02} = \\frac{0.060002}{0.02}$.',
            'Obtienes $3.0001$, muy cercano al valor exacto $3(1)^2 = 3$.'
          ],
          result: '$\\approx 3.0001$ (exacto $3$)'
        },
        {
          title: 'Comprobar no derivabilidad en un pico',
          problem: 'Verifica si $f(x) = |x - 5|$ es derivable en $x = 5$.',
          steps: [
            'Derivada lateral izquierda: $\\lim_{h \\to 0^-} \\frac{|h|}{h} = -1$.',
            'Derivada lateral derecha: $\\lim_{h \\to 0^+} \\frac{|h|}{h} = +1$. Como $-1 \\neq 1$, no existe $f\'(5)$.'
          ],
          result: 'No derivable en $x = 5$ (vértice)'
        }
      ],
      // Forma 5 · Física / Económica y Reglas Rápidas
      [
        {
          title: 'Velocidad instantánea desde la posición',
          problem: 'Un proyectil sigue $s(t) = 40t - 5t^2$ (en metros y segundos). Halla su velocidad en $t = 3\\text{ s}$.',
          steps: [
            'Deriva por regla de potencia: $v(t) = s\'(t) = 40 - 10t\\;(\\text{m/s})$.',
            'Evalúa en $t = 3$: $v(3) = 40 - 30 = 10\\text{ m/s}$.'
          ],
          result: '$10\\text{ m/s}$'
        },
        {
          title: 'Costo marginal en producción',
          problem: 'Si el costo total es $C(q) = 200 + 15q + 0.02q^2$, halla el costo marginal en $q = 50$ unidades.',
          steps: [
            'Deriva: $C\'(q) = 15 + 0.04q$ (unidades monetarias por artículo adicional).',
            'Evalúa en $q = 50$: $C\'(50) = 15 + 2 = 17$.'
          ],
          result: '$17\\text{ por unidad}$'
        }
      ]
    ],

    'der-2': [
      // Forma 1 · Reescribir a ax^n antes de derivar
      [
        {
          title: 'Combinación de raíz y fracción simple',
          problem: 'Deriva $f(x) = 4\\sqrt{x} - \\frac{6}{x^3}$.',
          steps: [
            'Reescribe como potencias: $f(x) = 4x^{1/2} - 6x^{-3}$.',
            'Aplica la regla de potencia: $f\'(x) = 2x^{-1/2} + 18x^{-4} = \\frac{2}{\\sqrt{x}} + \\frac{18}{x^4}$.'
          ],
          result: '$\\frac{2}{\\sqrt{x}} + \\frac{18}{x^4}$'
        },
        {
          title: 'Separar cociente entre un monomio',
          problem: 'Deriva $g(x) = \\frac{x^3 + 5x - 2}{x^2}$ sin regla del cociente.',
          steps: [
            'Divide término a término: $g(x) = x + 5x^{-1} - 2x^{-2}$.',
            'Deriva directo: $g\'(x) = 1 - 5x^{-2} + 4x^{-3} = 1 - \\frac{5}{x^2} + \\frac{4}{x^3}$.'
          ],
          result: '$1 - \\frac{5}{x^2} + \\frac{4}{x^3}$'
        }
      ],
      // Forma 2 · Cociente vs Producto u*v^-1
      [
        {
          title: 'Cociente con numerador constante vía $v^{-1}$',
          problem: 'Deriva $f(x) = \\frac{5}{(2x + 1)^3}$ reescribiendo con exponente negativo.',
          steps: [
            'Escribe $f(x) = 5(2x + 1)^{-3}$ (evitas la regla del cociente).',
            'Deriva con cadena: $f\'(x) = -15(2x + 1)^{-4} \\cdot 2 = -\\frac{30}{(2x + 1)^4}$.'
          ],
          result: '$-\\frac{30}{(2x + 1)^4}$'
        },
        {
          title: 'Regla del cociente en fracción lineal',
          problem: 'Deriva $f(x) = \\frac{3x - 1}{x + 2}$.',
          steps: [
            'Aplica $\\frac{u\'v - uv\'}{v^2} = \\frac{3(x + 2) - (3x - 1)(1)}{(x + 2)^2}$.',
            'Simplifica el numerador: $3x + 6 - 3x + 1 = 7$.'
          ],
          result: '$\\frac{7}{(x + 2)^2}$'
        }
      ],
      // Forma 3 · Cadena: Capas vs Sustitución Leibniz
      [
        {
          title: 'Tres capas encadenadas (cebolla)',
          problem: 'Deriva $y = \\operatorname{sen}^3(4x)$.',
          steps: [
            'Capas de fuera hacia dentro: $(\\cdot)^3 \\to \\operatorname{sen}(\\cdot) \\to 4x$.',
            'Multiplica derivadas: $3\\operatorname{sen}^2(4x) \\cdot \\cos(4x) \\cdot 4 = 12\\operatorname{sen}^2(4x)\\cos(4x)$.'
          ],
          result: '$12\\operatorname{sen}^2(4x)\\cos(4x)$'
        },
        {
          title: 'Notación de Leibniz con variable intermedia $u$',
          problem: 'Deriva $y = \\sqrt{x^2 + 9}$ usando $u = x^2 + 9$.',
          steps: [
            'Con $y = u^{1/2}$: $\\frac{dy}{du} = \\frac{1}{2\\sqrt{u}}$ y $\\frac{du}{dx} = 2x$.',
            'Multiplica: $\\frac{dy}{dx} = \\frac{1}{2\\sqrt{x^2 + 9}} \\cdot 2x = \\frac{x}{\\sqrt{x^2 + 9}}$.'
          ],
          result: '$\\frac{x}{\\sqrt{x^2 + 9}}$'
        }
      ],
      // Forma 4 · Expandir antes vs Regla del Producto
      [
        {
          title: 'Expandir antes cuando el producto es polinomial corto',
          problem: 'Deriva $f(x) = (x^2 + 1)(x - 3)$.',
          steps: [
            'Expande en una línea: $f(x) = x^3 - 3x^2 + x - 3$.',
            'Deriva término a término: $f\'(x) = 3x^2 - 6x + 1$.'
          ],
          result: '$3x^2 - 6x + 1$'
        },
        {
          title: 'Regla del producto y factorización con exponente alto',
          problem: 'Deriva $g(x) = x^2(2x - 1)^4$ sin expandir la cuarta potencia.',
          steps: [
            'Aplica producto + cadena: $g\'(x) = 2x(2x - 1)^4 + x^2 \\cdot 4(2x - 1)^3(2)$.',
            'Saca factor común $2x(2x - 1)^3$: $2x(2x - 1)^3[(2x - 1) + 4x] = 2x(2x - 1)^3(6x - 1)$.'
          ],
          result: '$2x(2x - 1)^3(6x - 1)$'
        }
      ],
      // Forma 5 · Verificación logarítmica o numérica
      [
        {
          title: 'Comprobación numérica en un punto',
          problem: 'Comprueba que la derivada de $f(x) = (x^2 + 1)^3$ en $x = 1$ es $24$.',
          steps: [
            'Fórmula analítica: $f\'(x) = 6x(x^2 + 1)^2 \\Rightarrow f\'(1) = 6(1)(4) = 24$.',
            'Prueba simétrica con $h = 0.001$: $\\frac{(1.001^2 + 1)^3 - (0.999^2 + 1)^3}{0.002} \\approx 24.0000$.'
          ],
          result: 'Confirmado: $f\'(1) = 24$'
        },
        {
          title: 'Atajo $\\ln(y)$ para cociente con potencias',
          problem: 'Deriva $y = \\frac{(x + 1)^4}{(x - 2)^3}$ tomando $\\ln$.',
          steps: [
            '$\\ln y = 4\\ln(x + 1) - 3\\ln(x - 2) \\Rightarrow \\frac{y\'}{y} = \\frac{4}{x + 1} - \\frac{3}{x - 2} = \\frac{x - 11}{(x + 1)(x - 2)}$.',
            'Multiplica por $y$: $y\' = \\frac{(x + 1)^3(x - 11)}{(x - 2)^4}$.'
          ],
          result: '$\\frac{(x + 1)^3(x - 11)}{(x - 2)^4}$'
        }
      ]
    ],

    'der-3': [
      // Forma 1 · Simplificar logaritmos ANTES de derivar
      [
        {
          title: 'Logaritmo de un cociente con raíz',
          problem: 'Deriva $f(x) = \\ln\\left(\\frac{\\sqrt{x + 2}}{x^3}\\right)$.',
          steps: [
            'Expande primero: $f(x) = \\frac{1}{2}\\ln(x + 2) - 3\\ln x$.',
            'Deriva en un paso: $f\'(x) = \\frac{1}{2(x + 2)} - \\frac{3}{x}$.'
          ],
          result: '$\\frac{1}{2(x + 2)} - \\frac{3}{x}$'
        },
        {
          title: 'Logaritmo de producto exponencial-trigonométrico',
          problem: 'Deriva $g(x) = \\ln(e^{2x} \\cos x)$.',
          steps: [
            'Separa con propiedades: $g(x) = \\ln(e^{2x}) + \\ln(\\cos x) = 2x + \\ln(\\cos x)$.',
            'Deriva: $g\'(x) = 2 + \\frac{-\\operatorname{sen}x}{\\cos x} = 2 - \\tan x$.'
          ],
          result: '$2 - \\tan x$'
        }
      ],
      // Forma 2 · Derivación Logarítmica
      [
        {
          title: 'Base y exponente variables: $y = x^{\\operatorname{sen}x}$',
          problem: 'Halla $y\'$ para $y = x^{\\operatorname{sen}x}$ ($x > 0$).',
          steps: [
            'Toma logaritmo natural: $\\ln y = \\operatorname{sen}x \\cdot \\ln x$.',
            'Deriva: $\\frac{y\'}{y} = \\cos x \\ln x + \\frac{\\operatorname{sen}x}{x}$, y multiplica por $y = x^{\\operatorname{sen}x}$.'
          ],
          result: '$x^{\\operatorname{sen}x}\\left(\\cos x \\ln x + \\frac{\\operatorname{sen}x}{x}\\right)$'
        },
        {
          title: 'Exponente polinomial sobre función: $y = (x^2 + 1)^x$',
          problem: 'Deriva $y = (x^2 + 1)^x$.',
          steps: [
            '$\\ln y = x\\ln(x^2 + 1) \\Rightarrow \\frac{y\'}{y} = \\ln(x^2 + 1) + x \\cdot \\frac{2x}{x^2 + 1}$.',
            'Multiplica por $y$: $y\' = (x^2 + 1)^x\\left(\\ln(x^2 + 1) + \\frac{2x^2}{x^2 + 1}\\right)$.'
          ],
          result: '$(x^2 + 1)^x\\left(\\ln(x^2 + 1) + \\frac{2x^2}{x^2 + 1}\\right)$'
        }
      ],
      // Forma 3 · Implícita clásica vs Parciales (-Fx / Fy)
      [
        {
          title: 'Derivación implícita con término cruzado $xy$',
          problem: 'Halla $\\frac{dy}{dx}$ en $x^2 + xy + y^2 = 7$.',
          steps: [
            'Clásica: $2x + (y + xy\') + 2yy\' = 0 \\Rightarrow y\'(x + 2y) = -(2x + y)$.',
            'Con parciales $F = x^2 + xy + y^2 - 7$: $-\\frac{F_x}{F_y} = -\\frac{2x + y}{x + 2y}$.'
          ],
          result: '$-\\frac{2x + y}{x + 2y}$'
        },
        {
          title: 'Pendiente implícita con función trigonométrica',
          problem: 'Halla $y\'$ para $\\operatorname{sen}(y) + x^3 = 2y$.',
          steps: [
            'Define $F(x, y) = \\operatorname{sen}y + x^3 - 2y$; entonces $F_x = 3x^2$ y $F_y = \\cos y - 2$.',
            'Aplica $y\' = -\\frac{F_x}{F_y} = \\frac{3x^2}{2 - \\cos y}$.'
          ],
          result: '$\\frac{3x^2}{2 - \\cos y}$'
        }
      ],
      // Forma 4 · Despejar y / Geometría vs Implícita
      [
        {
          title: 'Pendiente en circunferencia por geometría radial',
          problem: 'Halla la pendiente de la tangente a $x^2 + y^2 = 100$ en $(6, 8)$.',
          steps: [
            'El radio desde $(0, 0)$ a $(6, 8)$ tiene pendiente $m_r = \\frac{8}{6} = \\frac{4}{3}$.',
            'La tangente es perpendicular al radio: $m_t = -\\frac{3}{4}$ (igual que $-\\frac{x}{y}$ por implícita).'
          ],
          result: '$-\\frac{3}{4}$'
        },
        {
          title: 'Despeje explícito vs. implícita en hipérbola',
          problem: 'Halla $y\'$ para $xy = 12$ en $(3, 4)$ por ambas rutas.',
          steps: [
            'Explícita: $y = 12x^{-1} \\Rightarrow y\' = -\\frac{12}{x^2} = -\\frac{12}{9} = -\\frac{4}{3}$.',
            'Implícita: $y + xy\' = 0 \\Rightarrow y\' = -\\frac{y}{x} = -\\frac{4}{3}$.'
          ],
          result: '$-\\frac{4}{3}$'
        }
      ]
    ],

    'der-4': [
      // Forma 1 · Criterio de la 1a Derivada
      [
        {
          title: 'Clasificar extremos de cúbica por signos de $f\'$',
          problem: 'Encuentra máximos y mínimos locales de $f(x) = x^3 - 3x^2$.',
          steps: [
            'Factoriza $f\'(x) = 3x(x - 2) = 0 \\Rightarrow x = 0$ y $x = 2$.',
            'Signos de $f\'$: $+$ en $(-\\infty, 0)$, $-$ en $(0, 2)$, $+$ en $(2, \\infty)$: máximo en $(0, 0)$, mínimo en $(2, -4)$.'
          ],
          result: 'Máx. $(0, 0)$, Mín. $(2, -4)$'
        },
        {
          title: 'Caso donde $f\'(c) = 0$ NO es extremo (silla)',
          problem: 'Analiza el punto crítico $x = 0$ de $f(x) = x^3 + 2$.',
          steps: [
            '$f\'(x) = 3x^2$ se anula en $x = 0$, pero $3x^2 > 0$ tanto para $x < 0$ como para $x > 0$.',
            'Al no haber cambio de signo ($+ \\to +$), $x = 0$ es punto de inflexión horizontal, no extremo.'
          ],
          result: 'Sin extremo local (crece siempre)'
        }
      ],
      // Forma 2 · Criterio de la 2a Derivada
      [
        {
          title: 'Clasificación instantánea con $f\'\'(c)$',
          problem: 'Clasifica los puntos críticos de $f(x) = x^3 - 12x + 1$.',
          steps: [
            '$f\'(x) = 3x^2 - 12 = 0 \\Rightarrow x = \\pm 2$; segunda derivada $f\'\'(x) = 6x$.',
            '$f\'\'(-2) = -12 < 0$ (máximo local en $(-2, 17)$) y $f\'\'(2) = 12 > 0$ (mínimo local en $(2, -15)$).'
          ],
          result: 'Máx. $(-2, 17)$, Mín. $(2, -15)$'
        },
        {
          title: 'Concavidad en función con exponente y logaritmo',
          problem: 'Clasifica el punto crítico de $f(x) = x - \\ln x$ ($x > 0$).',
          steps: [
            '$f\'(x) = 1 - \\frac{1}{x} = 0 \\Rightarrow x = 1$; además $f\'\'(x) = \\frac{1}{x^2}$.',
            'Como $f\'\'(1) = 1 > 0$, la curva es cóncava hacia arriba y $(1, 1)$ es mínimo.'
          ],
          result: 'Mínimo absoluto en $(1, 1)$'
        }
      ],
      // Forma 3 · Optimización: Derivada vs Vértice / MA-MG
      [
        {
          title: 'Área máxima de corral comparando Derivada vs. Vértice',
          problem: 'Maximiza $A(x) = x(80 - 2x)$ para $0 < x < 40$.',
          steps: [
            'Por derivada: $A\'(x) = 80 - 4x = 0 \\Rightarrow x = 20$.',
            'Por vértice de parábola con raíces $0$ y $40$: $x_v = \\frac{0 + 40}{2} = 20$, dando $A(20) = 800$.'
          ],
          result: '$A_{\\max} = 800$ en $x = 20$'
        },
        {
          title: 'Mínimo de suma con producto fijo usando MA-MG',
          problem: 'Minimiza $S(x) = x + \\frac{16}{x}$ para $x > 0$.',
          steps: [
            'Por desigualdad MA-MG: $\\frac{x + 16/x}{2} \\ge \\sqrt{x \\cdot \\frac{16}{x}} = 4 \\Rightarrow S(x) \\ge 8$.',
            'La igualdad ocurre cuando $x = \\frac{16}{x} \\Rightarrow x = 4$ (coincide con $S\'(x) = 1 - \\frac{16}{x^2} = 0$).'
          ],
          result: '$S_{\\min} = 8$ en $x = 4$'
        }
      ],
      // Forma 4 · Extremos Absolutos en [a, b]
      [
        {
          title: 'Competencia de fronteras en intervalo cerrado',
          problem: 'Halla máximo y mínimo absolutos de $f(x) = x^2 - 4x + 5$ en $[0, 5]$.',
          steps: [
            'Punto crítico interior: $f\'(x) = 2x - 4 = 0 \\Rightarrow x = 2 \\in [0, 5]$.',
            'Compara los candidatos: $f(0) = 5$, $f(2) = 1$, $f(5) = 10$.'
          ],
          result: 'Mín. abs. $1$ (en $x = 2$); Máx. abs. $10$ (en $x = 5$)'
        },
        {
          title: 'Descartar críticos fuera del intervalo',
          problem: 'Encuentra los extremos absolutos de $f(x) = x^3 - 3x$ en $[0, 2]$.',
          steps: [
            '$f\'(x) = 3(x^2 - 1) = 0 \\Rightarrow x = 1$ (válido) y $x = -1$ (se descarta por estar fuera de $[0, 2]$).',
            'Evalúa: $f(0) = 0$, $f(1) = -2$, $f(2) = 2$.'
          ],
          result: 'Mín. abs. $-2$ ($x = 1$); Máx. abs. $2$ ($x = 2$)'
        }
      ],
      // Forma 5 · Conexión Gráfica f, f', f'' y TVM
      [
        {
          title: 'Teorema del Valor Medio (TVM) en parábola',
          problem: 'Halla $c \\in (1, 4)$ tal que $f\'(c) = \\frac{f(4) - f(1)}{4 - 1}$ para $f(x) = x^2 + 2x$.',
          steps: [
            'Pendiente secante: $\\frac{24 - 3}{3} = 7$. Derivada: $f\'(c) = 2c + 2$.',
            'Iguala $2c + 2 = 7 \\Rightarrow c = 2.5 \\in (1, 4)$.'
          ],
          result: '$c = 2.5$'
        },
        {
          title: 'Leer inflexión y extremos desde la gráfica de $f\'$',
          problem: 'Si $f\'(x) = (x - 1)(x - 5)$, identifica dónde $f$ tiene máximo, mínimo e inflexión.',
          steps: [
            '$f\'$ cambia de $+$ a $-$ en $x = 1$ (máximo de $f$) y de $-$ a $+$ en $x = 5$ (mínimo de $f$).',
            'El vértice de $f\'$ está en $x = 3$ (donde $f\'\'(3) = 0$ y cambia de signo): ahí hay punto de inflexión de $f$.'
          ],
          result: 'Máx. $x=1$, Mín. $x=5$, Inflexión $x=3$'
        }
      ]
    ],

    'int-1': [
      // Forma 1 · Convertir todo a potencias ax^n
      [
        {
          title: 'Integrar suma de raíz y potencia negativa',
          problem: 'Calcula $\\int \\left(6\\sqrt{x} - \\frac{4}{x^2}\\right)dx$.',
          steps: [
            'Reescribe: $\\int (6x^{1/2} - 4x^{-2})dx$.',
            'Suma $1$ a cada exponente y divide: $6 \\cdot \\frac{x^{3/2}}{3/2} - 4 \\cdot \\frac{x^{-1}}{-1} + C = 4x^{3/2} + \\frac{4}{x} + C$.'
          ],
          result: '$4x^{3/2} + \\frac{4}{x} + C$'
        },
        {
          title: 'Raíz cúbica en el denominador',
          problem: 'Integra $\\int \\frac{5}{\\sqrt[3]{x}}\\,dx$.',
          steps: [
            'Expresa como $5\\int x^{-1/3}\\,dx$.',
            'Aplica la regla: $5 \\cdot \\frac{x^{2/3}}{2/3} + C = \\frac{15}{2}x^{2/3} + C$.'
          ],
          result: '$\\frac{15}{2}x^{2/3} + C$'
        }
      ],
      // Forma 2 · Dividir polinomios o expandir antes
      [
        {
          title: 'Expandir producto antes de integrar',
          problem: 'Calcula $\\int (x + 2)(3x - 1)\\,dx$.',
          steps: [
            'Multiplica los paréntesis: $\\int (3x^2 + 5x - 2)\\,dx$.',
            'Integra término a término: $x^3 + \\frac{5}{2}x^2 - 2x + C$.'
          ],
          result: '$x^3 + \\frac{5}{2}x^2 - 2x + C$'
        },
        {
          title: 'Dividir cociente entre $\\sqrt{x}$',
          problem: 'Calcula $\\int \\frac{x^2 - 3x}{\\sqrt{x}}\\,dx$.',
          steps: [
            'Divide cada término por $x^{1/2}$: $\\int (x^{3/2} - 3x^{1/2})\\,dx$.',
            'Integra: $\\frac{2}{5}x^{5/2} - 2x^{3/2} + C$.'
          ],
          result: '$\\frac{2}{5}x^{5/2} - 2x^{3/2} + C$'
        }
      ],
      // Forma 3 · Problema de Valor Inicial (Hallar C)
      [
        {
          title: 'Hallar la función exacta con condición inicial',
          problem: 'Halla $f(x)$ sabiendo que $f\'(x) = 4x - 3$ y $f(2) = 5$.',
          steps: [
            'Integra: $f(x) = 2x^2 - 3x + C$.',
            'Impón $f(2) = 2(4) - 3(2) + C = 5 \\Rightarrow 2 + C = 5 \\Rightarrow C = 3$.'
          ],
          result: '$f(x) = 2x^2 - 3x + 3$'
        },
        {
          title: 'Recuperar velocidad desde aceleración',
          problem: 'Si $a(t) = 6t + 2$ y $v(0) = 4\\text{ m/s}$, determina $v(t)$.',
          steps: [
            'Antideriva: $v(t) = 3t^2 + 2t + C$.',
            'Con $t = 0$: $v(0) = C = 4$.'
          ],
          result: '$v(t) = 3t^2 + 2t + 4$'
        }
      ],
      // Forma 4 · Verificación Inversa (Derivar)
      [
        {
          title: 'Detectar coeficiente faltante derivando',
          problem: 'Verifica si $F(x) = e^{3x} + C$ es la antiderivada de $e^{3x}$.',
          steps: [
            'Deriva la propuesta: $F\'(x) = 3e^{3x}$ (sobra un factor $3$).',
            'Corrige dividiendo entre $3$: $\\frac{d}{dx}\\left(\\frac{1}{3}e^{3x}\\right) = e^{3x}$.'
          ],
          result: '$\\frac{1}{3}e^{3x} + C$'
        },
        {
          title: 'Confirmar signo en antiderivada trigonométrica',
          problem: 'Comprueba si $\\int \\operatorname{sen}(2x)\\,dx = -\\frac{1}{2}\\cos(2x) + C$.',
          steps: [
            'Deriva el resultado: $-\\frac{1}{2}(-\\operatorname{sen}(2x)) \\cdot 2 = +\\operatorname{sen}(2x)$.',
            'Coincide exactamente con el integrando original.'
          ],
          result: 'Verificado correctamente'
        }
      ]
    ],

    'int-2': [
      // Forma 1 · Sustitución u = g(x) y ajuste de constante
      [
        {
          title: 'Sustitución con ajuste de constante',
          problem: 'Calcula $\\int x(x^2 + 5)^4\\,dx$.',
          steps: [
            'Elige $u = x^2 + 5 \\Rightarrow du = 2x\\,dx \\Rightarrow x\\,dx = \\frac{1}{2}du$.',
            'Integra $\\frac{1}{2}\\int u^4\\,du = \\frac{u^5}{10} + C = \\frac{(x^2 + 5)^5}{10} + C$.'
          ],
          result: '$\\frac{(x^2 + 5)^5}{10} + C$'
        },
        {
          title: 'Cociente logarítmico $\\int \\frac{u\'}{u}du$',
          problem: 'Calcula $\\int \\frac{3x^2}{x^3 + 7}\\,dx$.',
          steps: [
            'Nota que la derivada de $u = x^3 + 7$ es exactamente $du = 3x^2\\,dx$.',
            'Integra directo: $\\int \\frac{du}{u} = \\ln|x^3 + 7| + C$.'
          ],
          result: '$\\ln|x^3 + 7| + C$'
        }
      ],
      // Forma 2 · Sustitución Radical Racionalizadora
      [
        {
          title: 'Sustitución $t = \\sqrt{x + 1}$ para quitar la raíz',
          problem: 'Calcula $\\int x\\sqrt{x + 1}\\,dx$.',
          steps: [
            'Sea $t = \\sqrt{x + 1} \\Rightarrow t^2 = x + 1$, luego $x = t^2 - 1$ y $dx = 2t\\,dt$.',
            'Integra $\\int (t^2 - 1)(t)(2t\\,dt) = \\int (2t^4 - 2t^2)\\,dt = \\frac{2}{5}t^5 - \\frac{2}{3}t^3 + C$.'
          ],
          result: '$\\frac{2}{5}(x+1)^{5/2} - \\frac{2}{3}(x+1)^{3/2} + C$'
        },
        {
          title: 'Cociente con raíz cuadrada',
          problem: 'Integra $\\int \\frac{dx}{1 + \\sqrt{x}}$ ($x > 0$).',
          steps: [
            'Haz $t = \\sqrt{x} \\Rightarrow x = t^2,\\; dx = 2t\\,dt$: $\\int \\frac{2t}{1 + t}\\,dt = 2\\int\\left(1 - \\frac{1}{1+t}\\right)dt$.',
            'Obtienes $2t - 2\\ln(1 + t) + C$ y regresas a $t = \\sqrt{x}$.'
          ],
          result: '$2\\sqrt{x} - 2\\ln(1 + \\sqrt{x}) + C$'
        }
      ],
      // Forma 3 · Integración por Partes (ILATE)
      [
        {
          title: 'Logaritmo multiplicado por potencia',
          problem: 'Calcula $\\int x^2 \\ln x\\,dx$.',
          steps: [
            'Por ILATE (Logarítmica antes que Algebraica): $u = \\ln x \\Rightarrow du = \\frac{dx}{x}$; $dv = x^2 dx \\Rightarrow v = \\frac{x^3}{3}$.',
            'Aplica $uv - \\int v\\,du = \\frac{x^3}{3}\\ln x - \\frac{1}{3}\\int x^2\\,dx = \\frac{x^3}{3}\\ln x - \\frac{x^3}{9} + C$.'
          ],
          result: '$\\frac{x^3}{3}\\ln x - \\frac{x^3}{9} + C$'
        },
        {
          title: 'Producto algebraica por trigonométrica',
          problem: 'Calcula $\\int x\\cos x\\,dx$.',
          steps: [
            'Elige $u = x \\Rightarrow du = dx$ y $dv = \\cos x\\,dx \\Rightarrow v = \\operatorname{sen}x$.',
            'Resulta $x\\operatorname{sen}x - \\int \\operatorname{sen}x\\,dx = x\\operatorname{sen}x + \\cos x + C$.'
          ],
          result: '$x\\operatorname{sen}x + \\cos x + C$'
        }
      ],
      // Forma 4 · Método Tabular (DI)
      [
        {
          title: 'Polinomio cuadrático por exponencial',
          problem: 'Calcula $\\int x^2 e^x\\,dx$ con la tabla DI.',
          steps: [
            'Columna D: $x^2 \\to 2x \\to 2 \\to 0$; columna I: $e^x \\to e^x \\to e^x \\to e^x$; signos $+, -, +$.',
            'Multiplica en diagonal: $+x^2 e^x - 2xe^x + 2e^x + C = (x^2 - 2x + 2)e^x + C$.'
          ],
          result: '$(x^2 - 2x + 2)e^x + C$'
        },
        {
          title: 'Polinomio cuadrático por seno',
          problem: 'Integra $\\int x^2 \\operatorname{sen}x\\,dx$ por método DI.',
          steps: [
            'Columna D: $x^2, 2x, 2, 0$; columna I: $\\operatorname{sen}x, -\\cos x, -\\operatorname{sen}x, \\cos x$; signos $+, -, +$.',
            'Diagonales: $-x^2\\cos x + 2x\\operatorname{sen}x + 2\\cos x + C$.'
          ],
          result: '$(2 - x^2)\\cos x + 2x\\operatorname{sen}x + C$'
        }
      ],
      // Forma 5 · Coeficientes Indeterminados
      [
        {
          title: 'Proponer $(Ax + B)e^{2x}$ y derivar',
          problem: 'Calcula $\\int (4x + 1)e^{2x}\\,dx$ por coeficientes indeterminados.',
          steps: [
            'Propón $F(x) = (Ax + B)e^{2x}$; su derivada es $(2Ax + A + 2B)e^{2x}$.',
            'Iguala: $2A = 4 \\Rightarrow A = 2$; $A + 2B = 1 \\Rightarrow B = -\\frac{1}{2}$.'
          ],
          result: '$\\left(2x - \\frac{1}{2}\\right)e^{2x} + C$'
        },
        {
          title: 'Integral cíclica resuelta sin repetir partes',
          problem: 'Halla $\\int e^x \\cos x\\,dx$ proponiendo $e^x(A\\cos x + B\\operatorname{sen}x)$.',
          steps: [
            'Deriva: $e^x[(A + B)\\cos x + (B - A)\\operatorname{sen}x]$ e iguala a $1\\cdot\\cos x + 0\\cdot\\operatorname{sen}x$.',
            'Sistema $A + B = 1$ y $B - A = 0$ da $A = B = \\frac{1}{2}$.'
          ],
          result: '$\\frac{1}{2}e^x(\\cos x + \\operatorname{sen}x) + C$'
        }
      ]
    ],

    'int-3': [
      // Forma 1 · Regla de Barrow
      [
        {
          title: 'Polinomio evaluado con paréntesis protectores',
          problem: 'Calcula $\\int_{-1}^{2} (3x^2 - 2x + 1)\\,dx$.',
          steps: [
            'Antiderivada: $F(x) = x^3 - x^2 + x$.',
            'Evalúa $F(2) - F(-1) = (8 - 4 + 2) - (-1 - 1 - 1) = 6 - (-3) = 9$.'
          ],
          result: '$9$'
        },
        {
          title: 'Integral definida trigonométrica',
          problem: 'Evalúa $\\int_{0}^{\\pi/2} \\cos x\\,dx$.',
          steps: [
            'La antiderivada es $\\operatorname{sen}x$.',
            'Aplica Barrow: $\\operatorname{sen}(\\pi/2) - \\operatorname{sen}(0) = 1 - 0 = 1$.'
          ],
          result: '$1$'
        }
      ],
      // Forma 2 · Simetría en [-a, a]
      [
        {
          title: 'Función impar en intervalo simétrico',
          problem: 'Calcula $\\int_{-5}^{5} (x^5 - 7x^3 + 2x)\\,dx$.',
          steps: [
            'Comprueba $f(-x) = -x^5 + 7x^3 - 2x = -f(x)$: es una función impar continua.',
            'Por simetría en $[-5, 5]$, las áreas positivas y negativas se cancelan exactamente.'
          ],
          result: '$0$'
        },
        {
          title: 'Función par duplicando desde $0$',
          problem: 'Calcula $\\int_{-2}^{2} (3x^2 + 4)\\,dx$.',
          steps: [
            'Como $f(-x) = f(x)$ es par, reduce a $2\\int_{0}^{2} (3x^2 + 4)\\,dx$.',
            'Evalúa: $2[x^3 + 4x]_0^2 = 2(8 + 8) = 32$.'
          ],
          result: '$32$'
        }
      ],
      // Forma 3 · Geometría elemental y Trapecios
      [
        {
          title: 'Área de un semicírculo sin integrar',
          problem: 'Calcula $\\int_{-3}^{3} \\sqrt{9 - x^2}\\,dx$ geométricamente.',
          steps: [
            'La curva $y = \\sqrt{9 - x^2}$ es la mitad superior del círculo de radio $r = 3$.',
            'El área del semicírculo es $\\frac{1}{2}\\pi r^2 = \\frac{9\\pi}{2}$.'
          ],
          result: '$\\frac{9\\pi}{2}$'
        },
        {
          title: 'Área de un trapecio para función lineal',
          problem: 'Evalúa $\\int_{1}^{5} (2x + 1)\\,dx$ usando el área de un trapecio.',
          steps: [
            'Base $b = 5 - 1 = 4$, altura izquierda $f(1) = 3$ y altura derecha $f(5) = 11$.',
            'Área del trapecio: $\\frac{3 + 11}{2} \\cdot 4 = 28$.'
          ],
          result: '$28$'
        }
      ],
      // Forma 4 · Sustitución cambiando los límites
      [
        {
          title: 'Sustitución cuadrática sin volver a $x$',
          problem: 'Calcula $\\int_{0}^{2} 2x(x^2 + 1)^2\\,dx$ cambiando límites.',
          steps: [
            'Sea $u = x^2 + 1$, $du = 2x\\,dx$; nuevos límites: $x=0 \\Rightarrow u=1$ y $x=2 \\Rightarrow u=5$.',
            'Integra en $u$: $\\int_{1}^{5} u^2\\,du = \\left[\\frac{u^3}{3}\\right]_1^5 = \\frac{125 - 1}{3} = \\frac{124}{3}$.'
          ],
          result: '$\\frac{124}{3}$'
        },
        {
          title: 'Sustitución exponencial en integral definida',
          problem: 'Evalúa $\\int_{0}^{\\ln 3} e^x(e^x + 1)\\,dx$.',
          steps: [
            'Sea $u = e^x + 1$, $du = e^x dx$; límites: $x=0 \\Rightarrow u=2$, $x=\\ln 3 \\Rightarrow u=4$.',
            'Calcula $\\int_{2}^{4} u\\,du = \\left[\\frac{u^2}{2}\\right]_2^4 = 8 - 2 = 6$.'
          ],
          result: '$6$'
        }
      ],
      // Forma 5 · Valor Promedio
      [
        {
          title: 'Valor promedio de una parábola',
          problem: 'Halla el valor promedio de $f(x) = x^2$ en $[0, 3]$.',
          steps: [
            'Aplica $f_{\\text{prom}} = \\frac{1}{3 - 0}\\int_{0}^{3} x^2\\,dx$.',
            'Calcula $\\frac{1}{3}\\left[\\frac{x^3}{3}\\right]_0^3 = \\frac{1}{3}(9) = 3$.'
          ],
          result: '$3$'
        },
        {
          title: 'Temperatura promedio en un ciclo senoidal',
          problem: 'Calcula el valor promedio de $f(x) = \\operatorname{sen}x$ en $[0, \\pi]$.',
          steps: [
            '$f_{\\text{prom}} = \\frac{1}{\\pi}\\int_{0}^{\\pi} \\operatorname{sen}x\\,dx = \\frac{1}{\\pi}[-\\cos x]_0^\\pi$.',
            'Evalúa: $\\frac{1}{\\pi}(1 - (-1)) = \\frac{2}{\\pi} \\approx 0.637$.'
          ],
          result: '$\\frac{2}{\\pi} \\approx 0.637$'
        }
      ]
    ],

    'calc-1': [
      // Forma 1 · Rebanadas Verticales (dx)
      [
        {
          title: 'Área entre recta y parábola',
          problem: 'Calcula el área encerrada entre $y = x + 2$ y $y = x^2$.',
          steps: [
            'Intersecciones: $x^2 = x + 2 \\Rightarrow (x - 2)(x + 1) = 0 \\Rightarrow x = -1, 2$; arriba va $x + 2$.',
            'Integra $\\int_{-1}^{2} (x + 2 - x^2)\\,dx = \\left[\\frac{x^2}{2} + 2x - \\frac{x^3}{3}\\right]_{-1}^{2} = \\frac{9}{2}$.'
          ],
          result: '$\\frac{9}{2} = 4.5\\text{ u}^2$'
        },
        {
          title: 'Área entre dos parábolas opuestas',
          problem: 'Halla el área entre $y = 8 - x^2$ y $y = x^2$.',
          steps: [
            'Cortes: $x^2 = 8 - x^2 \\Rightarrow x = \\pm 2$; por simetría $2\\int_{0}^{2} (8 - 2x^2)\\,dx$.',
            'Evalúa $2\\left[8x - \\frac{2}{3}x^3\\right]_0^2 = 2\\left(16 - \\frac{16}{3}\\right) = \\frac{64}{3}$.'
          ],
          result: '$\\frac{64}{3}\\text{ u}^2$'
        }
      ],
      // Forma 2 · Rebanadas Horizontales (dy)
      [
        {
          title: 'Parábola horizontal $x = y^2$ y recta vertical',
          problem: 'Calcula el área limitada por $x = y^2$ y $x = 4$.',
          steps: [
            'Intersecciones: $y^2 = 4 \\Rightarrow y = \\pm 2$; a la derecha está $x = 4$ y a la izquierda $x = y^2$.',
            'Integra en $y$: $\\int_{-2}^{2} (4 - y^2)\\,dy = 2\\left[4y - \\frac{y^3}{3}\\right]_0^2 = \\frac{32}{3}$.'
          ],
          result: '$\\frac{32}{3}\\text{ u}^2$'
        },
        {
          title: 'Evitar partir integrales integrando en $dy$',
          problem: 'Halla el área entre $x = y + 2$ y $x = y^2$.',
          steps: [
            'Cortes: $y^2 - y - 2 = 0 \\Rightarrow y = -1$ y $y = 2$; derecha $y + 2$, izquierda $y^2$.',
            'Una sola integral: $\\int_{-1}^{2} (y + 2 - y^2)\\,dy = \\frac{9}{2}$.'
          ],
          result: '$\\frac{9}{2}\\text{ u}^2$'
        }
      ],
      // Forma 3 · Fórmula de Arquímedes
      [
        {
          title: 'Atajo $\\frac{|a|}{6}(\\beta - \\alpha)^3$ para recta y parábola',
          problem: 'Calcula el área entre $y = 2x^2$ y $y = 6x$ con la fórmula de Arquímedes.',
          steps: [
            'Diferencia $2x^2 - 6x = 0$ tiene raíces $\\alpha = 0, \\beta = 3$ y coeficiente líder $|a| = 2$.',
            'Aplica $A = \\frac{2}{6}(3 - 0)^3 = \\frac{1}{3}(27) = 9$.'
          ],
          result: '$9\\text{ u}^2$'
        },
        {
          title: 'Arco parabólico con $\\frac{2}{3} \\cdot \\text{base} \\cdot \\text{altura}$',
          problem: 'Halla el área bajo $y = 9 - x^2$ sobre el eje $x$.',
          steps: [
            'La base entre raíces $x = -3$ y $x = 3$ mide $6$, y la altura máxima (flecha) es $9$.',
            'Aplica $\\frac{2}{3}(6)(9) = 36$.'
          ],
          result: '$36\\text{ u}^2$'
        }
      ],
      // Forma 4 · Cinemática bidireccional
      [
        {
          title: 'Desplazamiento neto vs. distancia total recorrida',
          problem: 'Una partícula tiene $v(t) = t - 2$ en $[0, 4]$. Compara desplazamiento y distancia.',
          steps: [
            'Desplazamiento neto: $\\int_{0}^{4} (t - 2)\\,dt = \\left[\\frac{t^2}{2} - 2t\\right]_0^4 = 0\\text{ m}$.',
            'Distancia total (cambia de signo en $t = 2$): $\\int_{0}^{2}(2 - t)dt + \\int_{2}^{4}(t - 2)dt = 2 + 2 = 4\\text{ m}$.'
          ],
          result: 'Desplazamiento $0\\text{ m}$; Distancia $4\\text{ m}$'
        },
        {
          title: 'Subir de aceleración constante a posición',
          problem: 'Con $a(t) = 4\\text{ m/s}^2$, $v(0) = 3\\text{ m/s}$ y $s(0) = 1\\text{ m}$, halla $s(2)$.',
          steps: [
            'Integra dos veces con condiciones iniciales: $v(t) = 4t + 3$ y $s(t) = 2t^2 + 3t + 1$.',
            'Evalúa en $t = 2$: $s(2) = 8 + 6 + 1 = 15\\text{ m}$.'
          ],
          result: '$15\\text{ m}$'
        }
      ]
    ],

    'calc-2': [
      // Forma 1 · Separación clásica con +C
      [
        {
          title: 'EDO separable con despeje de raíz',
          problem: 'Resuelve $\\frac{dy}{dx} = \\frac{x}{y}$ con $y(0) = 3$.',
          steps: [
            'Separa e integra: $\\int y\\,dy = \\int x\\,dx \\Rightarrow \\frac{y^2}{2} = \\frac{x^2}{2} + C \\Rightarrow y^2 = x^2 + K$.',
            'Con $y(0) = 3$, $K = 9$, y al ser $y(0) > 0$ se toma la rama positiva $y = \\sqrt{x^2 + 9}$.'
          ],
          result: '$y = \\sqrt{x^2 + 9}$'
        },
        {
          title: 'Separación con función exponencial en $y$',
          problem: 'Resuelve $y\' = 2xy$ con $y(0) = 5$.',
          steps: [
            'Separa $\\frac{dy}{y} = 2x\\,dx \\Rightarrow \\ln|y| = x^2 + C \\Rightarrow y = Ke^{x^2}$.',
            'Evalúa $y(0) = K = 5$.'
          ],
          result: '$y = 5e^{x^2}$'
        }
      ],
      // Forma 2 · Integrales Definidas Directas (Sin +C)
      [
        {
          title: 'PVI directo sin calcular $C$',
          problem: 'Resuelve $\\frac{dy}{dx} = 3x^2 y$ con $y(0) = 2$ usando integrales definidas.',
          steps: [
            'Integra de $(0, 2)$ a $(x, y)$: $\\int_{2}^{y} \\frac{dv}{v} = \\int_{0}^{x} 3u^2\\,du$.',
            'Resulta $\\ln\\left(\\frac{y}{2}\\right) = x^3 \\Rightarrow y = 2e^{x^3}$.'
          ],
          result: '$y = 2e^{x^3}$'
        },
        {
          title: 'Separable racional con límites iniciales',
          problem: 'Resuelve $\\frac{dy}{dx} = -y^2$ con $y(1) = \\frac{1}{2}$.',
          steps: [
            'Integra $\\int_{1/2}^{y} -v^{-2}\\,dv = \\int_{1}^{x} du \\Rightarrow \\left[\\frac{1}{v}\\right]_{1/2}^{y} = x - 1$.',
            'Simplifica $\\frac{1}{y} - 2 = x - 1 \\Rightarrow y = \\frac{1}{x + 1}$.'
          ],
          result: '$y = \\frac{1}{x + 1}$'
        }
      ],
      // Forma 3 · Atajo y' = ky -> y0 e^{kt}
      [
        {
          title: 'Crecimiento bacteriano instantáneo',
          problem: 'Un cultivo satisface $P\'(t) = 0.25P$ con $P(0) = 400$. Halla $P(4)$.',
          steps: [
            'Reconoce directamente $P(t) = 400e^{0.25t}$.',
            'Evalúa en $t = 4$: $P(4) = 400e^{1} = 400e \\approx 1087$.'
          ],
          result: '$400e \\approx 1087$'
        },
        {
          title: 'Decaimiento radiactivo por vida media',
          problem: 'Si $N\'(t) = -kN$ parte de $N(0) = 80\\text{ g}$ y en $t = 10$ años queda la mitad ($40\\text{ g}$), ¿cuánto queda en $t = 30$ años?',
          steps: [
            'De $N(t) = 80e^{-kt}$, cada $10$ años la cantidad se multiplica por $\\frac{1}{2}$.',
            'En $30$ años pasan $3$ vidas medias: $80 \\cdot (1/2)^3 = 10\\text{ g}$.'
          ],
          result: '$10\\text{ g}$'
        }
      ],
      // Forma 4 · Verificación por Sustitución en la EDO
      [
        {
          title: 'Comprobar solución en EDO lineal',
          problem: 'Verifica si $y(x) = 3e^{-2x} + 4$ satisface $y\' + 2y = 8$ con $y(0) = 7$.',
          steps: [
            'Deriva: $y\' = -6e^{-2x}$; sustituye en la EDO: $(-6e^{-2x}) + 2(3e^{-2x} + 4) = 8$ (cumple).',
            'Comprueba el dato inicial: $y(0) = 3(1) + 4 = 7$ (cumple).'
          ],
          result: 'Solución verificada'
        },
        {
          title: 'Detectar constante incorrecta al sustituir',
          problem: 'Verifica si $y(x) = \\frac{1}{2}x^2 + 3$ cumple $y\' = x$ con $y(2) = 6$.',
          steps: [
            'Derivada: $y\' = x$ (sí cumple la EDO).',
            'Valor inicial: $y(2) = 2 + 3 = 5 \\neq 6$; debes ajustar la constante a $+4$.'
          ],
          result: 'Corregida: $y(x) = \\frac{1}{2}x^2 + 4$'
        }
      ]
    ]
  };

  function applyApproachExtraExamples(curriculum) {
    if (!Array.isArray(curriculum)) return;
    curriculum.forEach((subj) => {
      if (!subj || !Array.isArray(subj.topics)) return;
      subj.topics.forEach((topic) => {
        const listByApproach = APPROACH_EXTRA_EXAMPLES[topic.id];
        if (!Array.isArray(listByApproach) || !Array.isArray(topic.solvingApproaches)) return;
        topic.solvingApproaches.forEach((ap, idx) => {
          const extras = listByApproach[idx];
          if (Array.isArray(extras) && extras.length > 0) {
            ap.moreExamples = extras;
          }
        });
      });
    });
  }

  applyApproachExtraExamples(ns.Curriculum);
  ns.ApproachExtraExamples = APPROACH_EXTRA_EXAMPLES;
})(window.MatInteractiva);
