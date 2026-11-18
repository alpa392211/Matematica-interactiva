/* ==========================================================================
   MATETIC - Enriquecimiento Pedagógico Parte 2
   (Funciones y Módulo Completo de Límites: 6 temas)
   Agrega múltiples enfoques de resolución (especialmente para Límites),
   explicaciones en palabras más sencillas para cada apunte y métodos
   alternativos en todos los ejemplos resueltos.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  function applyEnrichmentMap(curriculum, enrichmentMap) {
    if (!Array.isArray(curriculum)) return;
    curriculum.forEach((subj) => {
      if (!subj || !Array.isArray(subj.topics)) return;
      subj.topics.forEach((topic) => {
        const patch = enrichmentMap[topic.id];
        if (!patch) return;
        const th = topic.theory || (topic.theory = {});
        if (patch.simpleIntro) th.simpleIntro = patch.simpleIntro;
        if (patch.simplePrereqs) th.simplePrereqs = patch.simplePrereqs;
        if (Array.isArray(patch.detailedSimple)) th.detailedSimple = patch.detailedSimple;

        if (Array.isArray(patch.conceptsSimple) && Array.isArray(th.concepts)) {
          th.concepts.forEach((c, idx) => {
            if (patch.conceptsSimple[idx]) c.simple = patch.conceptsSimple[idx];
          });
        }
        if (Array.isArray(patch.theoremsSimple) && Array.isArray(th.theorems)) {
          th.theorems.forEach((t, idx) => {
            if (patch.theoremsSimple[idx]) t.simple = patch.theoremsSimple[idx];
          });
        }
        if (Array.isArray(patch.formulasSimple) && Array.isArray(th.formulas)) {
          th.formulas.forEach((f, idx) => {
            if (patch.formulasSimple[idx]) f.simple = patch.formulasSimple[idx];
          });
        }
        if (Array.isArray(patch.mistakesSimple) && Array.isArray(topic.commonMistakes)) {
          topic.commonMistakes.forEach((m, idx) => {
            if (patch.mistakesSimple[idx]) m.simple = patch.mistakesSimple[idx];
          });
        }
        if (Array.isArray(patch.solvingApproaches)) {
          topic.solvingApproaches = patch.solvingApproaches;
        }
        if (Array.isArray(patch.examplesExtra) && Array.isArray(topic.examples)) {
          topic.examples.forEach((ex, idx) => {
            const extra = patch.examplesExtra[idx];
            if (!extra) return;
            if (extra.simple) ex.simple = extra.simple;
            if (Array.isArray(extra.alternativeMethods)) ex.alternativeMethods = extra.alternativeMethods;
          });
        }
      });
    });
  }

  const ENRICHMENT_2 = {
    'func-1': {
      simpleIntro: 'Una función es como una máquina matemática estricta: metes un valor $x$ válido (dominio) y te entrega exactamente un resultado $y$ (rango). Saber qué valores están prohibidos evita dividir entre cero o sacar raíces negativas reales.',
      simplePrereqs: 'Solo necesitas saber resolver desigualdades sencillas (como $x + 3 \\ge 0$) y despejar una letra en ecuaciones básicas.',
      detailedSimple: [
        'Para hallar el dominio real solo vigila tres "semáforos rojos": nunca dividas entre $0$, nunca metas números negativos dentro de raíces pares ($\\sqrt{\\dots}$) y nunca pongas cero o negativos dentro de un logaritmo.',
        'La función inversa deshace exactamente lo que hizo la original (si $f$ multiplica por $3$ y resta $2$, $f^{-1}$ suma $2$ y divide entre $3$), pero solo funciona si ningún resultado se repite para dos entradas distintas.'
      ],
      conceptsSimple: [
        'El dominio es el menú de números que la fórmula acepta sin romperse ni salirse de los números reales.',
        'Componer $(f \\circ g)(x)$ significa meter el resultado completo de la máquina $g$ como entrada de la máquina $f$, trabajando siempre de derecha a izquierda.',
        'Para sacar la inversa cambias $f(x)$ por $y$, intercambias $x \\leftrightarrow y$ y despejas la nueva $y$.'
      ],
      theoremsSimple: [
        'Si dos números distintos dieran la misma salida, la inversa no sabría a cuál regresar; por eso debe pasar la prueba de que ninguna línea horizontal corta la curva dos veces.'
      ],
      formulasSimple: [
        '$f(g(x))$ aplica primero $g$ y luego $f$; la equivalencia $y = f(x) \\iff x = f^{-1}(y)$ simplemente invierte quién entra y quién sale.'
      ],
      mistakesSimple: [
        'El exponente $-1$ en $f^{-1}(x)$ no significa fracción $\\frac{1}{f(x)}$, sino "función inversa que devuelve la entrada original".'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Filtros de Dominio',
          title: 'Método de los 3 semáforos e intersección en recta numérica',
          when: 'Cuando te piden el dominio natural de cualquier combinación de fracciones, raíces y logaritmos.',
          idea: 'Anota cada restricción por separado (denominador $\\neq 0$, radicando $\\ge 0$, argumento $\\ln > 0$) y traslapa los intervalos en la recta.',
          steps: [
            'Lista cada expresión peligrosa (denominadores, raíces pares, logaritmos).',
            'Escribe y resuelve la inecuación de cada una.',
            'Intersecta todas las soluciones quitando puntos aislados que anulen denominadores.'
          ],
          miniExample: '$h(x)=\\frac{\\sqrt{x+3}}{x-2}$ exige $x+3\\ge 0$ ($x\\ge -3$) y $x-2\\neq 0$ ($x\\neq 2$) $\\implies [-3, 2)\\cup(2, \\infty)$.',
          simple: 'Cada pieza delicada pone su propia regla; solo los números que obedecen TODAS las reglas a la vez forman el dominio.'
        },
        {
          badge: 'Forma 2 · Inversa paso a paso vs. Operación contraria',
          title: 'Intercambio $x \\leftrightarrow y$ vs. Deshacer capas en orden inverso',
          when: 'Para hallar $f^{-1}(x)$ y verificar que es correcta.',
          idea: 'Además del despeje clásico, en funciones de un solo paso o lineales puedes simplemente invertir cada operación del final al principio.',
          steps: [
            'Método algebraico: escribe $y = f(x)$, despeja $x$ en función de $y$, e intercambia las letras.',
            'Verificación rápida: evalúa un punto $f(a)=b$ y comprueba que $f^{-1}(b)=a$.'
          ],
          miniExample: 'Si $f(x) = 3x - 2$ (multiplica por $3$, resta $2$), la inversa hace lo opuesto al revés (suma $2$, divide entre $3$): $f^{-1}(x)=\\frac{x+2}{3}$.',
          simple: 'Igual que para quitar un calcetín y un zapato haces el orden inverso al que te los pusiste, la función inversa deshace las operaciones de atrás para adelante.'
        },
        {
          badge: 'Forma 3 · División sintética / polinomial',
          title: 'Reescribir racionales como $P(x) = Q(x) + \\frac{R}{D(x)}$ para hallar asíntotas y huecos',
          when: 'Cuando el numerador tiene grado mayor o igual al denominador.',
          idea: 'Factoriza primero por si hay un hueco ($0/0$ cancelable); si no se cancela, divide para ver al instante la asíntota oblicua o horizontal.',
          steps: [
            'Factoriza arriba y abajo para detectar huecos removibles.',
            'Divide el polinomio para separar el cociente lineal (asíntota oblicua) del residuo.'
          ],
          miniExample: '$\\frac{x^2+1}{x-1} = x + 1 + \\frac{2}{x-1}$ muestra que para $|x|$ grande la curva se pega a $y = x + 1$.',
          simple: 'Al hacer la división larga de la fracción racional, el cociente que sale sin residuo es automáticamente la recta asíntota.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Para $(f \\circ g)(x)$ metes $x^2+1$ dentro de los paréntesis de $3(\\dots)-2$; para la inversa de $f$, despejas $x$ en $y = 3x - 2$ y cambias $y$ por $x$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Verificación numérica en x = 2',
              title: 'Comprobar composición e inversa con un valor de prueba',
              when: 'Para asegurarte de no haber invertido el orden $(f \\circ g)$ vs $(g \\circ f)$.',
              steps: [
                'Calcula paso a paso en $x = 2$: $g(2) = 2^2 + 1 = 5$, luego $f(5) = 3(5) - 2 = 13$.',
                'Comprueba nuestra fórmula $3x^2 + 1$ en $x = 2$: $3(4) + 1 = 13$. ¡Exacto!',
                'Comprueba inversa: $f^{-1}(13) = \\frac{13 + 2}{3} = 5$. Regresó exactamente al $5$ original.'
              ],
              result: '$(f\\circ g)(x)=3x^2+1$, $f^{-1}(x)=\\frac{x+2}{3}$',
              simple: 'Probar con un número cualquiera como $x=2$ detecta al instante si mezclaste $(f\\circ g)$ con $(g\\circ f)$ o si fallaste un signo al despejar.'
            }
          ]
        },
        {
          simple: 'La raíz obliga a que $x \\ge -3$, y el denominador prohíbe $x = 2$, así que tomamos desde $-3$ hasta el infinito pero abrimos un huequito para saltarnos el $2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Prueba por zonas en la recta real',
              title: 'Probar puntos representativos en $(-\\infty, -3)$, $(-3, 2)$ y $(2, \\infty)$',
              when: 'Útil cuando hay desigualdades racionales más complicadas dentro de raíces.',
              steps: [
                'Marca los puntos críticos $x = -3$ (radicando $0$) y $x = 2$ (denominador $0$).',
                'Prueba $x = -4$ (raíz negativa: no sirve), $x = 0$ ($\\sqrt{3}/(-2)$: válido) y $x = 6$ ($\\sqrt{9}/4 = 3/4$: válido).',
                'Une las zonas válidas cerrando $-3$ y dejando abierto $2$: $[-3, 2) \\cup (2, \\infty)$.'
              ],
              result: '$[-3, 2) \\cup (2, \\infty)$',
              simple: 'Si partes la recta en los puntos conflictivos y pruebas un número fácil de cada tramo, nunca fallas un intervalo.'
            }
          ]
        },
        {
          simple: 'Aunque ambas funciones dividen entre $x-1$, en $f(x)$ el $x-1$ se cancela dejando solo la recta $x+2$ con un agujerito vacío en $(1, 3)$; en $g(x)$ arriba queda $2\\neq 0$, así que en $x=1$ hay pared vertical y al dividir sale la recta oblicua $y=x+1$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · División sintética de Ruffini',
              title: 'Dividir entre $x - 1$ ($r = 1$) para distinguir resto $0$ (hueco) de resto $\\neq 0$ (asíntota)',
              when: 'Método sistemático para grado $\\ge 2$ sin necesidad de factorizar a ojo.',
              steps: [
                'Para $f(x)$ ($[1, 1, -2]$ entre $r=1$): cociente $[1, 2]$ ($x+2$) y residuo $0$ $\\implies$ se cancela $(x-1)$ formando un hueco en $(1, 3)$.',
                'Para $g(x)$ ($[1, 0, 1]$ entre $r=1$): cociente $[1, 1]$ ($x+1$) y residuo $2 \\neq 0$ $\\implies$ asíntota vertical en $x=1$ y asíntota oblicua $y = x + 1$.'
              ],
              result: '$f$: hueco en $(1,3)$; $g$: AV $x=1$, AO $y=x+1$',
              simple: 'Al hacer la división entre $x-1$, si el residuo sale $0$ era solo un hueco removible; si sobra residuo ($2$), el cociente es la asíntota oblicua y $x=1$ es pared vertical.'
            }
          ]
        }
      ]
    },
    'func-2': {
      simpleIntro: 'Las funciones exponenciales crecen o decrecen multiplicándose a toda velocidad (como intereses o radiación), y los logaritmos son exactamente su botón de "reversa" para despejar incógnitas atrapadas en un exponente.',
      simplePrereqs: 'Recuerda qué significa $a^k = b$ y que $\\log_a(b)$ responde la pregunta "¿a qué potencia elevo $a$ para obtener $b$?".',
      detailedSimple: [
        'Como $e^x$ y $\\ln(x)$ son operaciones contrarias exactas, una borra a la otra dejando libre el exponente o el argumento.',
        'Los logaritmos convierten tareas pesadas (multiplicar, dividir, elevar potencias) en tareas mucho más simples (sumar, restar, multiplicar por delante).'
      ],
      conceptsSimple: [
        'Cuando ves $e^{\\ln(\\dots)}$ o $\\ln(e^{\\dots})$, las dos funciones se anulan mutuamente y queda solo lo de adentro.',
        'Expandir un logaritmo separa un producto en suma y baja cualquier exponente multiplicando afuera.'
      ],
      theoremsSimple: [
        'Sumar dos potencias equivale a multiplicar bases iguales ($e^a \\cdot e^b = e^{a+b}$); visto al revés, el logaritmo de un producto tiene que ser la suma de logaritmos.'
      ],
      formulasSimple: [
        'Producto adentro $\\to$ suma afuera; división adentro $\\to$ resta afuera; exponente adentro $\\to$ coeficiente multiplicando adelante.'
      ],
      mistakesSimple: [
        'Un logaritmo NO se puede repartir sobre una suma $\\ln(x+y)$; únicamente separa multiplicaciones y divisiones.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Bases iguales',
          title: 'Reescribir ambos lados con la misma base ($2^k, 3^k, 5^k$)',
          when: 'El camino más rápido cuando ambos lados son potencias limpias de un mismo número.',
          idea: 'Si $b^A = b^B$ (con $b>0, b\\neq 1$), entonces obligatoriamente $A = B$ sin necesitar logaritmos.',
          steps: [
            'Descompón el número grande en potencia de la misma base.',
            'Iguala los exponentes directamente.',
            'Resuelve la ecuación ordinaria resultante.'
          ],
          miniExample: '$2^{3x-1} = 32 \\implies 2^{3x-1} = 2^5 \\implies 3x - 1 = 5 \\implies x = 2$.',
          simple: 'Si logras disfrazar los dos lados con la misma base abajo, puedes ignorar las bases y resolver solo los exponentes de arriba.'
        },
        {
          badge: 'Forma 2 · Aplicar ln a ambos lados',
          title: 'Bajar exponentes usando $\\ln(A^k) = k\\ln(A)$',
          when: 'Universal: sirve incluso cuando las bases NO coinciden (como $2^x = 7$ o $e^{-0.05t} = 0.5$).',
          idea: 'Toma $\\ln$ en ambos lados, usa la propiedad de exponentes para bajar la variable del techo y despeja.',
          steps: [
            'Aísla primero la expresión exponencial ($a^{f(x)} = k$, verificando $k > 0$).',
            'Aplica $\\ln$ en ambos lados: $f(x)\\ln(a) = \\ln(k)$.',
            'Despeja $x = \\frac{\\ln(k)}{\\ln(a)}$ (en base $e$, $\\ln(e)=1$ directo).'
          ],
          miniExample: '$3^x = 10 \\implies x\\ln(3) = \\ln(10) \\implies x = \\frac{\\ln(10)}{\\ln(3)} \\approx 2.0959$.',
          simple: 'El logaritmo es la única herramienta que logra bajar una $x$ que está atrapada arriba como exponente.'
        },
        {
          badge: 'Forma 3 · Ecuaciones logarítmicas (2 caminos)',
          title: 'Juntar en un solo $\\ln$ y usar $A = B$ vs. aplicar base exponencial $e^{(\\cdot)}$',
          when: 'Para ecuaciones con sumas o restas de logaritmos como $\\ln(x)+\\ln(x-3)=\\ln(10)$.',
          idea: 'Combina los logaritmos en uno solo usando leyes; luego iguala argumentos (si ambos lados tienen $\\ln$) o exponencia ambos lados, y SIEMPRE verifica dominio.',
          steps: [
            'Usa suma $\\to$ producto o resta $\\to$ cociente para dejar un solo $\\ln$.',
            'Elimina el $\\ln$ igualando argumentos o elevando $e$ a ambos lados.',
            'Descarta cualquier raíz que haga cero o negativo algún logaritmo original.'
          ],
          miniExample: 'Con $x=5$ y $x=-2$, descartamos $-2$ porque $\\ln(-2)$ no existe en $\\mathbb{R}$.',
          simple: 'Juntas todos los $\\ln$ en uno solo, quitas el $\\ln$ y nunca olvides probar tus respuestas para tachar las que produzcan negativos dentro de un $\\ln$.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Como $32$ es exactamente $2^5$, igualamos exponentes ($3x-1 = 5$) y despejamos en un paso.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Logaritmo natural general',
              title: 'Aplicar $\\ln$ cuando no reconoces la potencia exacta',
              when: 'Funciona igualmente si el lado derecho fuera $20$ o $32$.',
              steps: [
                'Aplica $\\ln$ a ambos lados: $\\ln(2^{3x-1}) = \\ln(32)$.',
                'Baja el exponente: $(3x - 1)\\ln(2) = \\ln(32) \\implies 3x - 1 = \\frac{\\ln(32)}{\\ln(2)} = 5$.',
                'Despeja $3x = 6 \\implies x = 2$.'
              ],
              result: '$x = 2$',
              simple: 'Aplicar $\\ln$ siempre te da el camino seguro incluso cuando no sabes de memoria qué potencia de $2$ es $32$.'
            }
          ]
        },
        {
          simple: 'Sumar logaritmos se vuelve multiplicar adentro: $\\ln(x(x-3)) = \\ln(10)$. Quitamos $\\ln$, resolvemos la cuadrática ($x=5, x=-2$) y tachamos $-2$ porque los logaritmos exigen números positivos.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Exponenciación con e^(...)',
              title: 'Elevar $e$ a cada miembro aplicando $e^{\\ln(A)} = A$',
              when: 'Útil cuando el lado derecho es un número suelto (sin $\\ln$).',
              steps: [
                'Reúne la izquierda: $\\ln(x^2 - 3x) = \\ln(10)$.',
                'Eleva $e$ a ambos lados: $e^{\\ln(x^2 - 3x)} = e^{\\ln(10)} \\implies x^2 - 3x = 10$.',
                'Factoriza $(x-5)(x+2)=0$ y exige $x > 3$ por el dominio de $\\ln(x-3)$, quedando únicamente $x = 5$.'
              ],
              result: '$x = 5$',
              simple: 'Poner una $e$ gigante como base debajo de ambos lados borra el $\\ln$ al instante.'
            }
          ]
        },
        {
          simple: 'Para vida media igualamos la masa al 50% ($40 = 80 e^{-0.05t}$), dividimos entre $80$ quedando $0.5 = e^{-0.05t}$ y aplicamos $\\ln$ para despejar el tiempo $t$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Fórmula directa t₁/₂ = ln(2)/k',
              title: 'Uso directo de la constante de semivida sin recalcular masa inicial',
              when: 'La vida media nunca depende de cuántos gramos iniciales había ($80\\text{ g}$, $5\\text{ g}$ o $1\\text{ ton}$).',
              steps: [
                'Para cualquier decaimiento $M_0 e^{-kt}$, la mitad cumple $e^{-k t_{1/2}} = \\frac{1}{2} \\implies k\\,t_{1/2} = \\ln(2)$.',
                'Sustituye directo $k = 0.05$: $t_{1/2} = \\frac{\\ln(2)}{0.05} \\approx \\frac{0.69315}{0.05} = 13.86$ días.'
              ],
              result: '$t_{1/2} = 20\\ln(2) \\approx 13.86$ días',
              simple: 'El tiempo en reducirse a la mitad siempre es $\\frac{\\ln(2)}{k} \\approx \\frac{0.693}{k}$, sin importar con cuánta masa empezaste.'
            }
          ]
        }
      ]
    },
    'lim-1': {
      simpleIntro: 'Un límite responde una sola pregunta: "A medida que me acerco muchísimo a $x = a$ (sin importar qué pase exactamente encima de $a$), ¿a qué altura se acercan los valores de $f(x)$?". Es la base sobre la que viven derivadas e integrales.',
      simplePrereqs: 'Solo necesitas saber evaluar una función en un número, leer gráficas $(x, y)$ y entender que podemos acercarnos a un punto tanto desde la izquierda ($< a$) como desde la derecha ($> a$).',
      detailedSimple: [
        'Decir que el límite vale $L$ significa que si te mantienes en una ventanita estrecha alrededor de $a$ (pero sin pararte en $a$), la altura $f(x)$ no se sale de la banda deseada alrededor de $L$.',
        'Para que el límite normal exista, los caminos por la izquierda y por la derecha deben apuntar exactamente al mismo punto; si cada lado llega a un piso distinto, el límite global no existe.',
        'Si al meter $x = a$ directo no ocurre ninguna división entre cero ni operación prohibida, las leyes de límites te dejan sustituir directo y terminar en segundos.'
      ],
      conceptsSimple: [
        'Aunque el punto $x = a$ tenga un agujero vacío o esté pintado más arriba, el límite solo mira hacia dónde apuntan los puntos vecinos.',
        'Dos personas caminando sobre la gráfica desde la izquierda y desde la derecha deben encontrarse en la misma altura exacta para que exista el límite.',
        'Sustitución directa es el camino exprés válido en polinomios y funciones continuas siempre que el denominador no dé cero.',
        'Límite de una suma es la suma de límites, y lo mismo vale para resta, multiplicación y división (si abajo no da cero).'
      ],
      theoremsSimple: [
        'Un mismo movimiento de acercamiento a $a$ no puede apuntar hacia dos alturas distintas a la vez: si el límite existe, su valor es único.'
      ],
      formulasSimple: [
        'Criterio $\\varepsilon$-$\\delta$: por muy apretado que quieras el margen de error vertical $\\varepsilon$ alrededor de $L$, siempre existe una cercanía horizontal $\\delta$ alrededor de $a$ que lo garantiza.',
        'Doble condición de existencia: el límite existe si y solo si existen los dos laterales y son iguales ($L^- = L^+$).',
        'Si conoces los límites individuales $L$ y $M$, puedes sumar, restar, multiplicar o dividir sus resultados directamente (con $M \\neq 0$).'
      ],
      mistakesSimple: [
        'Que $f(a)$ tenga un hueco o no exista NO prohíbe que exista el límite: al límite solo le importa hacia dónde va la curva justo antes y justo después de $a$.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Sustitución y Leyes',
          title: 'Sustitución directa inmediata + verificación de denominador',
          when: 'SIEMPRE es el primer intento frente a cualquier límite nuevo.',
          idea: 'Evalúa $f(a)$ directo: si obtienes un número real válido (y no hay salto a trozos ni valor absoluto cambiando de signo), ¡ese número es tu límite!',
          steps: [
            'Reemplaza mentalmente $x = a$ en la expresión.',
            'Si no divides entre $0$, ni sacas raíz par negativa ni logaritmo $\\le 0$, la función es continua allí.',
            'Simplifica aritméticamente usando linealidad, producto y cociente de límites.'
          ],
          miniExample: '$\\lim_{x\\to 2}\\frac{3x^2-4x+5}{x+1} = \\frac{12-8+5}{3} = \\frac{9}{3} = 3$.',
          simple: 'Primero intenta meter el número directo; si no explota ninguna división entre cero ni hay función por partes justo ahí, ya acabaste.'
        },
        {
          badge: 'Forma 2 · Límites Laterales',
          title: 'Evaluar por la izquierda ($x \\to a^-$) y por la derecha ($x \\to a^+$)',
          when: 'Obligatorio en funciones definidas a trozos, valores absolutos $|x-a|$, raíces cuadradas en bordes y saltos $k/0$.',
          idea: 'Calcula por separado usando la fórmula que rige cuando $x < a$ y la que rige cuando $x > a$; luego compara los dos resultados.',
          steps: [
            'Para $x \\to a^-$ toma la rama válida cuando $x < a$ (por ejemplo $a - 0.001$ para signos).',
            'Para $x \\to a^+$ toma la rama válida cuando $x > a$ (por ejemplo $a + 0.001$).',
            'Si ambas dan el mismo valor $L$, el límite existe y vale $L$; si difieren ($L^- \\neq L^+$), el límite NO existe.'
          ],
          miniExample: 'Para $|x-3|/(x-3)$ en $x\\to 3$: izquierda da $-1$, derecha da $+1 \\implies$ no existe.',
          simple: 'Cuando una función cambia de regla justo en $a$ (como una llave con dos renglones), evalúa ambos renglones en $a$ y mira si empatan.'
        },
        {
          badge: 'Forma 3 · Tabla numérica de aproximación',
          title: 'Acercamiento tabular con calculadora ($a \\pm 0.1,\\; a \\pm 0.01,\\; a \\pm 0.001$)',
          when: 'Excelente para comprobar respuestas o intuir límites difíciles cuando todavía no dominas el truco algebraico.',
          idea: 'Evalúa $f(x)$ en valores muy pegados a $a$ por ambos lados y observa a qué cifra converge.',
          steps: [
            'Evalúa en $a - 0.1, a - 0.01, a - 0.001$.',
            'Evalúa en $a + 0.1, a + 0.01, a + 0.001$.',
            'Verifica si ambas columnas se estabilizan en un mismo número (o se disparan hacia $\\pm\\infty$).'
          ],
          miniExample: 'Para $(x^2-1)/(x-1)$ en $x\\to 1$: en $0.999$ da $1.999$ y en $1.001$ da $2.001 \\implies$ apunta claramente a $2$.',
          simple: 'Si te atoras con el álgebra, mete $x = a \\pm 0.001$ en la calculadora para descubrir al instante hacia qué altura viaja la función.'
        },
        {
          badge: 'Forma 4 · Lectura Gráfica',
          title: 'Rastreo visual con puntos huecos vs. saltos y oscilaciones',
          when: 'Cuando te dan la gráfica dibujada sin fórmula explícita.',
          idea: 'Tapa con el dedo la línea vertical $x = a$ y sigue las curvas de ambos lados hacia esa línea vertical.',
          steps: [
            'Sigue la curva viniendo de la izquierda hasta chocar con la vertical $x = a$ $\\to$ lee su altura $L^-$.',
            'Sigue la curva viniendo de la derecha hasta $x = a$ $\\to$ lee su altura $L^+$.',
            'Ignora cualquier punto relleno solitario arriba o abajo: si las dos curvas se juntan en el mismo hueco, el límite SÍ existe.'
          ],
          miniExample: 'Una recta con un hueco en $(2, 5)$ y un punto pintado en $(2, 9)$ tiene $f(2)=9$ pero $\\lim_{x\\to 2}f(x) = 5$.',
          simple: 'El límite pregunta a qué altura llegarías caminando por la carretera hasta el puente roto, no en dónde flotando pusieron el letrero.'
        },
        {
          badge: 'Forma 5 · Demostración ε-δ',
          title: 'Método ingeniería inversa de Cauchy-Weierstrass ($\\varepsilon \\to \\delta$)',
          when: 'Para demostraciones formales en cálculo universitario.',
          idea: 'Empieza por detrás en $|f(x) - L| < \\varepsilon$, factoriza $|x - a|$ para descubrir qué $\\delta$ elegir, y luego redacta la prueba hacia adelante.',
          steps: [
            'Borrador: simplifica $|f(x) - L|$ hasta aislar $|x - a|$ multiplicado por un factor (o acotado si asumes $|x - a| < 1$).',
            'Elección: define $\\delta = \\varepsilon / K$ (o $\\min(1, \\varepsilon / M)$ en cuadráticas).',
            'Prueba formal: parte de $0 < |x - a| < \\delta$ y encadena desigualdades hasta concluir $|f(x) - L| < \\varepsilon$.'
          ],
          miniExample: 'Para $2x+1 \\to 7$ ($x\\to 3$): $|(2x+1)-7| = 2|x-3| < \\varepsilon \\implies$ basta tomar $\\delta = \\varepsilon / 2$.',
          simple: 'Primero factorizas el error deseado hasta ver $|x-a|$ multiplicado por un número $K$, y tu $\\delta$ es simplemente $\\varepsilon$ dividido entre ese $K$.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Como en $x=2$ el denominador vale $2+1=3 \\neq 0$, no hay indeterminación: evaluamos el polinomio de arriba, evaluamos el de abajo y dividimos $9/3 = 3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Comprobación por tabla numérica lateral',
              title: 'Aproximación con $x = 1.999$ y $x = 2.001$',
              when: 'Útil para verificar visualmente que las leyes algebraicas dan el valor correcto.',
              steps: [
                'En $x = 1.999$: $\\frac{3(1.999)^2 - 4(1.999) + 5}{2.999} \\approx \\frac{8.992}{2.999} \\approx 2.9983$.',
                'En $x = 2.001$: $\\frac{3(2.001)^2 - 4(2.001) + 5}{3.001} \\approx \\frac{9.008}{3.001} \\approx 3.0017$.',
                'Ambos lados estrechan el cerco exactamente alrededor de $3$.'
              ],
              result: '$3$',
              simple: 'Probar valores a una milésima del $2$ confirma de inmediato que la curva aterriza en $3$.'
            },
            {
              badge: 'Método 3 · División polinomial previa',
              title: 'Reescribir $\\frac{3x^2 - 4x + 5}{x + 1} = 3x - 7 + \\frac{12}{x+1}$',
              when: 'Permite evaluar la tendencia incluso con fracciones más simples.',
              steps: [
                'Al dividir queda cociente $3x - 7$ y residuo $12/(x+1)$.',
                'En $x \\to 2$: $3(2) - 7 + \\frac{12}{3} = -1 + 4 = 3$.'
              ],
              result: '$3$',
              simple: 'Separar el polinomio entero y la fracción chiquita da exactamente el mismo $3$.'
            }
          ]
        },
        {
          simple: 'Justo en $x=2$ la función cambia de fórmula, así que calculamos la fórmula de arriba ($x<2$) en $2$ y nos da $5$, y calculamos la de abajo ($x\\ge 2$) en $2$ y también da $5$; como coinciden, el límite existe y vale $5$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Verificación numérica derecha/izquierda',
              title: 'Evaluar $x = 1.999$ en la rama 1 y $x = 2.001$ en la rama 2',
              when: 'Evita confundir qué rama corresponde a $2^-$ y cuál a $2^+$.',
              steps: [
                'Para $x = 1.999 < 2$, aplica $x^2 + 1$: $(1.999)^2 + 1 \\approx 4.996 \\to 5$.',
                'Para $x = 2.001 > 2$, aplica $3x - 1$: $3(2.001) - 1 = 5.003 \\to 5$.',
                'Como ambas ramas tienden a $5$, el empalme es continuo.'
              ],
              result: '$\\lim_{x\\to 2} f(x) = 5$',
              simple: 'Usar $1.999$ para el lado izquierdo y $2.001$ para el lado derecho garantiza elegir siempre la fórmula correcta.'
            },
            {
              badge: 'Método 3 · Lectura gráfica del punto de empalme',
              title: 'Verificar que la parábola $x^2+1$ y la recta $3x-1$ aterrizan en el mismo punto $(2, 5)$',
              when: 'Para visualizar por qué existe límite pero habría esquina (no derivable).',
              steps: [
                'La parábola $y=x^2+1$ termina en $(2, 5)$ (hueco abierto desde la izquierda).',
                'La recta $y=3x-1$ arranca exactamente en $(2, 5)$ (punto relleno desde la derecha).',
                'Las dos curvas chocan a altura $y = 5$ sin salto vertical.'
              ],
              result: '$5$',
              simple: 'Aunque cambia de una curva a una línea recta, ambas piezas se tocan en $(2, 5)$ sin dar ningún brinco.'
            }
          ]
        },
        {
          simple: 'Queremos asegurar $|(2x+1)-7| < \\varepsilon$. Simplificando lo de adentro sale $2|x-3|$, así que basta exigir que $|x-3|$ sea menor que la mitad de $\\varepsilon$, es decir $\\delta = \\varepsilon/2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Interpretación geométrica como pendiente',
              title: 'Relación de escala horizontal-vertical en la recta $y = 2x + 1$',
              when: 'Para entender intuitivamente qué hace $\\delta = \\varepsilon / |m|$ en cualquier recta.',
              steps: [
                'La recta $f(x) = 2x + 1$ tiene pendiente $m = 2$: por cada paso horizontal $\\Delta x$, la altura cambia el doble: $\\Delta y = 2\\Delta x$.',
                'Si queremos que $\\Delta y$ no supere $\\varepsilon$, el desplazamiento horizontal $\\Delta x$ debe ser a lo sumo $\\varepsilon / 2$.',
                'Por ejemplo, para $\\varepsilon = 0.02$ basta mantener $|x - 3| < 0.01$.'
              ],
              result: '$\\delta(\\varepsilon) = \\frac{\\varepsilon}{2}$',
              simple: 'Como la recta sube el doble de rápido de lo que avanzas horizontalmente, tu margen horizontal $\\delta$ tiene que ser la mitad del margen vertical $\\varepsilon$.'
            },
            {
              badge: 'Método 3 · Prueba numérica con un ε concreto (ε = 0.1)',
              title: 'Verificar la banda $(6.9, 7.1)$ con $\\delta = 0.05$',
              when: 'Ayuda a aterrizar la definición abstracta con números reales concretos.',
              steps: [
                'Fija $\\varepsilon = 0.1 \\implies \\delta = 0.1 / 2 = 0.05$, lo que exige $2.95 < x < 3.05$.',
                'Evalúa los extremos: $f(2.95) = 6.90$ y $f(3.05) = 7.10$. Cualquier $x$ intermedio cae dentro de $(6.9, 7.1)$.'
              ],
              result: '$\\delta(\\varepsilon) = \\frac{\\varepsilon}{2}$',
              simple: 'Probando con $\\varepsilon = 0.1$, mantenerte a $0.05$ pasos del $3$ garantiza quedar a menos de $0.1$ pasos del $7$.'
            }
          ]
        }
      ]
    },
    'lim-2': {
      simpleIntro: 'Cuando al sustituir sale $0/0$, no significa que el límite no exista ni que valga cero: significa que arriba y abajo hay un factor oculto que se anula (un agujero removible). Factorizar, racionalizar o cambiar de variable destapa ese factor para cancelarlo.',
      simplePrereqs: 'Necesitas tener frescos los casos de factorización (cuadrados, cubos, trinomios), el conjugado para raíces cuadradas y la regla de signos.',
      detailedSimple: [
        'Si ves polinomios que dan $0/0$ en $x = a$, el culpable siempre es $(x - a)$: factoriza numerador y denominador para tacharlo mientras $x \\neq a$, y luego vuelve a sustituir.',
        'Si hay raíces cuadradas que dan $0/0$, multiplica por su conjugado para convertir la resta de raíces en un polinomio limpio y revelar el factor $(x - a)$ escondido.'
      ],
      conceptsSimple: [
        'Mientras tomas el límite, $x$ solo se acerca a $a$ pero nunca vale $a$, así que $(x-a)$ aún no es cero y dividirlo entre sí mismo vale exactamente $1$.',
        'En polinomios ya sabes de entrada qué factor debes buscar: si $x \\to 3$ da $0/0$, arriba y abajo está escondido $(x - 3)$.',
        'Solo desarrollas el producto de conjugados; el otro piso se deja quieto para poder ver y tachar el factor repetido.'
      ],
      theoremsSimple: [
        'Dos gráficas idénticas excepto en un único punto hueco $x = a$ tienen exactamente el mismo límite al acercarse a $a$.'
      ],
      formulasSimple: [
        'Tachar $(x - a)$ arriba y abajo reemplaza una fracción con hueco $0/0$ por otra función limpia continua que ya puedes evaluar sustituyendo directo.'
      ],
      mistakesSimple: [
        'Nunca borres el texto $\\lim_{x\\to a}$ mientras sigues manipulando álgebra con $x$; solo desaparece en el renglón donde reemplazas todas las $x$ por el número $a$.',
        'No multipliques los paréntesis del lado que no tiene conjugados, o taparás el factor $(x-a)$ que necesitas cancelar.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Factorización clásica y Ruffini',
          title: 'Extraer $(x - a)$ por productos notables o División Sintética',
          when: 'En toda indeterminación $0/0$ con polinomios racionales.',
          idea: 'Como $x=a$ anula arriba y abajo, $(x-a)$ es raíz segura de ambos: usa factorización conocida o aplica división sintética directa por $a$.',
          steps: [
            'Confirma que la sustitución en $x = a$ da $0/0$.',
            'Factoriza arriba y abajo (si es grado $\\ge 3$, divide sintéticamente por $a$).',
            'Cancela $(x - a)$ (si persiste $0/0$, repite) y evalúa por sustitución directa.'
          ],
          miniExample: 'En $\\lim_{x\\to 3}\\frac{x^2-9}{x^2-x-6} = \\lim_{x\\to 3}\\frac{(x-3)(x+3)}{(x-3)(x+2)} = \\frac{6}{5}$.',
          simple: 'Si $x \\to a$ da $0/0$ con polinomios, no adivines: busca $(x - a)$ arriba y abajo y táchalo.'
        },
        {
          badge: 'Forma 2 · Conjugado (o Doble Conjugado)',
          title: 'Racionalización de raíces cuadradas arriba y/o abajo',
          when: 'Cuando la indeterminación $0/0$ contiene expresiones como $\\sqrt{\\dots} - b$ o $\\sqrt{A} - \\sqrt{B}$.',
          idea: 'Multiplica por el conjugado del bloque con raíz usando $(u-v)(u+v) = u^2 - v^2$; si tanto arriba como abajo tienen raíz, multiplica por ambos conjugados a la vez.',
          steps: [
            'Multiplica numerador y denominador por el conjugado del término radical.',
            'Expande SOLO los conjugados y simplifica hasta sacar $(x - a)$.',
            'Cancela $(x - a)$ con el otro término (que dejaste factorizado) y sustituye.'
          ],
          miniExample: '$\\lim_{x\\to 0}\\frac{\\sqrt{x+4}-2}{x} = \\lim_{x\\to 0}\\frac{(x+4)-4}{x(\\sqrt{x+4}+2)} = \\frac{1}{4}$.',
          simple: 'Si hay raíz cuadrada atrapando al $0/0$, su conjugado abre la caja fuerte para que salga $(x-a)$.'
        },
        {
          badge: 'Forma 3 · Cambio de Variable Racionalizador',
          title: 'Hacer $u = \\sqrt[n]{g(x)}$ o traslación $h = x - a \\to 0$',
          when: 'Súper poderoso con raíces cúbicas/cuartas ($\\sqrt[3]{x} - 2$), o cuando mezclas $x$ y $\\sqrt{x}$.',
          idea: 'Cambiando la raíz entera por una letra $u$ (o moviendo $x = a + h$) desaparecen las raíces y solo factorizas polinomios sencillos.',
          steps: [
            'Define $u = \\sqrt[n]{g(x)}$, despeja $x$ en términos de $u$ y calcula el nuevo destino de $u$ cuando $x \\to a$.',
            'Reescribe todo el límite en $u$ (sin raíces).',
            'Factoriza, cancela el factor que anula y evalúa directo.'
          ],
          miniExample: 'En $\\lim_{x\\to 0}\\frac{\\sqrt{x+4}-2}{x}$, haz $u=\\sqrt{x+4} \\implies x=u^2-4$ y cuando $x\\to 0$, $u\\to 2$: $\\lim_{u\\to 2}\\frac{u-2}{u^2-4} = \\frac{1}{4}$.',
          simple: 'Si odias racionalizar, cambia la raíz entera por la letra $u$; te queda una fracción sin raíces de secundaria.'
        },
        {
          badge: 'Forma 4 · Definición / Traslación h = x - a',
          title: 'Trasladar el límite al origen ($x = a + h$, con $h \\to 0$)',
          when: 'Facilita cancelaciones cuando $a \\neq 0$ y los polinomios tienen varios términos mezclados.',
          idea: 'Sustituye $x = a + h$: los términos constantes se cancelan automáticamente dejando a $h$ como factor común obvio.',
          steps: [
            'Haz $x = a + h$, de modo que cuando $x \\to a$, entonces $h \\to 0$.',
            'Expande, cancela constantes y saca factor común $h$ arriba y abajo.',
            'Tacha $h$ y haz $h = 0$.'
          ],
          miniExample: 'Para $\\lim_{x\\to 2}\\frac{x^3-8}{x^2-4}$: con $x=2+h$, queda $\\frac{(8+12h+6h^2+h^3)-8}{(4+4h+h^2)-4} = \\frac{h(12+6h+h^2)}{h(4+h)} \\to \\frac{12}{4} = 3$.',
          simple: 'Poner $x = a + h$ vuelve todo un límite cerca de $0$, donde cancelar $h$ es inmediato.'
        },
        {
          badge: 'Forma 5 · Conexión con Derivadas (L\'Hôpital / Tasa instantánea)',
          title: 'Vista anticipada: interpretar $\\lim_{x\\to a}\\frac{f(x)-f(a)}{x-a}$ o aplicar L\'Hôpital',
          when: 'Para verificar tus límites $0/0$ en un segundo cuando ya conoces derivación.',
          idea: 'Muchos límites $0/0$ son literalmente derivadas disfrazadas $f\'(a)$, o cumplen $\\lim \\frac{N(x)}{D(x)} = \\frac{N\'(a)}{D\'(a)}$ si $0/0$.',
          steps: [
            'Verifica primero que realmente da $0/0$ al sustituir $x = a$.',
            'Deriva por separado el numerador y el denominador (NO uses regla del cociente).',
            'Evalúa nuevamente en $x = a$.'
          ],
          miniExample: 'En $\\lim_{x\\to 3}\\frac{x^2-9}{x^2-x-6}$, derivando arriba/abajo sale $\\frac{2x}{2x-1}$ en $x=3 \\implies \\frac{6}{5}$.',
          simple: 'Si ya sabes derivar potencias, derivar arriba y abajo por separado comprueba cualquier límite $0/0$ en segundos.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Sustituir $x=3$ da $0/0$, señal de que $(x-3)$ está escondido arriba y abajo. Factorizamos $x^2-9 = (x-3)(x+3)$ y abajo $(x-3)(x+2)$, tachamos $(x-3)$ y evaluamos en $3$ dando $6/5$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · División sintética directa por r = 3',
              title: 'Usar Ruffini sabiendo que $x=3$ es raíz garantizada',
              when: 'Útil si te cuesta factorizar el trinomio por tanteo.',
              steps: [
                'Arriba: $[1, 0, -9]$ dividido entre $3$ da $[1, 3]$ $\\implies (x + 3)$ resto $0$.',
                'Abajo: $[1, -1, -6]$ dividido entre $3$ da $[1, 2]$ $\\implies (x + 2)$ resto $0$.',
                'El límite simplificado es $\\lim_{x\\to 3} \\frac{x+3}{x+2} = \\frac{6}{5}$.'
              ],
              result: '$\\frac{6}{5}$',
              simple: 'Como ya sabes que el $3$ anula a ambos, Ruffini saca los factores limpios automáticamente.'
            },
            {
              badge: 'Método 3 · Traslación x = 3 + h y Regla de L\'Hôpital',
              title: 'Evaluar cerca de cero ($h \\to 0$) o derivada en $x=3$',
              when: 'Comprobación rápida alternativa.',
              steps: [
                'Con $x = 3 + h$: $\\frac{(3+h)^2 - 9}{(3+h)^2 - (3+h) - 6} = \\frac{6h + h^2}{5h + h^2} = \\frac{6+h}{5+h} \\xrightarrow{h\\to 0} \\frac{6}{5}$.',
                'Con L\'Hôpital ($0/0$): $\\lim_{x\\to 3} \\frac{2x}{2x-1} = \\frac{6}{5}$.'
              ],
              result: '$\\frac{6}{5}$',
              simple: 'Tanto moviendo $x=3+h$ como derivando arriba y abajo obtienes el mismo $6/5$.'
            }
          ]
        },
        {
          simple: 'Como $x=0$ da $0/0$ y arriba hay una raíz cuadrada, multiplicamos por $\\sqrt{x+4}+2$ arriba y abajo: la raíz se quita arriba quedando solo $x$, que tacha la $x$ de abajo y deja $1/(2+2)=1/4$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Cambio de variable u = √(x + 4)',
              title: 'Eliminar la raíz sustituyendo $x = u^2 - 4$',
              when: 'Convierte la raíz en una simple factorización algebraica.',
              steps: [
                'Sea $u = \\sqrt{x + 4}$. Entonces $u^2 = x + 4 \\implies x = u^2 - 4$, y cuando $x \\to 0$, $u \\to \\sqrt{4} = 2$.',
                'Reescribe el límite: $\\lim_{u\\to 2} \\frac{u - 2}{u^2 - 4} = \\lim_{u\\to 2} \\frac{u - 2}{(u - 2)(u + 2)}$.',
                'Cancela $(u - 2)$ y evalúa en $u = 2$: $\\frac{1}{2 + 2} = \\frac{1}{4}$.'
              ],
              result: '$\\frac{1}{4}$',
              simple: 'Llamando $u$ a la raíz cuadrada el límite se vuelve una fracción polinomial facilísima.'
            },
            {
              badge: 'Método 3 · Reconocerlo como la derivada de √t en t = 4',
              title: 'Interpretación directa como $f\'(4)$ para $f(t)=\\sqrt{t}$',
              when: 'Conexión profunda con el concepto de derivada.',
              steps: [
                'Observa que $\\lim_{x\\to 0}\\frac{\\sqrt{4+x}-\\sqrt{4}}{x}$ es exactamente la definición de $f\'(4)$ para $f(t)=\\sqrt{t}$.',
                'Como $\\frac{d}{dt}(\\sqrt{t}) = \\frac{1}{2\\sqrt{t}}$, en $t=4$ vale $\\frac{1}{2\\sqrt{4}} = \\frac{1}{4}$.'
              ],
              result: '$\\frac{1}{4}$',
              simple: 'Ese límite es literalmente la definición de derivada de $\\sqrt{t}$ evaluada en $4$.'
            }
          ]
        },
        {
          simple: 'En $x=2$ vuelve a salir $0/0$; abrimos $x^3-8$ con diferencia de cubos y $x^2-4$ con diferencia de cuadrados, cancelamos el culpable $(x-2)$ y evaluamos $(4+4+4)/(2+2) = 3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · División sintética por r = 2',
              title: 'Construir el cociente sin recordar la fórmula de cubos',
              when: 'Útil si no memorizaste $a^3-b^3$.',
              steps: [
                'Divide sintéticamente $[1, 0, 0, -8]$ entre $2$ $\\implies (x-2)(x^2+2x+4)$.',
                'Divide $[1, 0, -4]$ entre $2$ $\\implies (x-2)(x+2)$.',
                'Cancela $(x-2)$ y evalúa en $x=2$: $\\frac{12}{4} = 3$.'
              ],
              result: '$3$',
              simple: 'Dividiendo ambos polinomios entre $(x-2)$ en tabla sale directo el mismo cociente.'
            },
            {
              badge: 'Método 3 · Traslación x = 2 + h y L\'Hôpital',
              title: 'Sustitución $x = 2 + h$ (o derivación arriba/abajo)',
              when: 'Dos comprobaciones instantáneas.',
              steps: [
                'Con $x = 2 + h$: $\\frac{(2+h)^3 - 8}{(2+h)^2 - 4} = \\frac{12h + 6h^2 + h^3}{4h + h^2} = \\frac{12 + 6h + h^2}{4 + h} \\xrightarrow{h\\to 0} \\frac{12}{4} = 3$.',
                'Con L\'Hôpital ($0/0$): $\\lim_{x\\to 2}\\frac{3x^2}{2x} = \\frac{12}{4} = 3$.'
              ],
              result: '$3$',
              simple: 'Derivando arriba ($3x^2$) y abajo ($2x$) y metiendo $x=2$ da $12/4 = 3$ de inmediato.'
            }
          ]
        }
      ]
    },
    'lim-3': {
      simpleIntro: 'Los límites al infinito miran qué altura toma la función cuando $x$ se vuelve gigantesca ($+\\infty$ o $-\\infty$), mientras los límites infinitos ven hacia dónde se dispara la gráfica ($+\\infty$ o $-\\infty$) cerca de una pared vertical prohibida.',
      simplePrereqs: 'Solo necesitas tener claro que dividir un número fijo entre un número enorme da casi cero ($\\frac{c}{x} \\to 0$), y que dividir entre un número diminuto distinto de cero dispara el tamaño hacia el infinito.',
      detailedSimple: [
        'Cuando $x$ es gigante, los términos pequeños como $+5x - 3$ se vuelven insignificantes comparados con la mayor potencia de $x$: dividir todo entre esa potencia vuelve cero a casi todo excepto a los coeficientes líderes.',
        'Si abajo da $0$ pero arriba da distinto de cero ($k/0$), NO es cancelable: es una pared vertical (asíntota). Evaluando muy cerca por cada lado sabes si sube a $+\\infty$ o baja a $-\\infty$.',
        'Si la función se estabiliza en una altura fija $L$ cuando $x$ va a $+\\infty$ o $-\\infty$, esa recta horizontal $y = L$ actúa como tope o guía lejana.'
      ],
      conceptsSimple: [
        'Si el de abajo crece más rápido ($1/x^n$), por grande que sea el número fijo de arriba, el cociente siempre se aplasta a $0$.',
        'En divisiones de polinomios al infinito solo manda la potencia más grande de arriba comparada con la de abajo: si empatan en grado, divides sus coeficientes; si gana el de abajo, da $0$; si gana el de arriba, se va a $\\pm\\infty$.',
        'Cuidado con el vocabulario: asíntota vertical es cuando $y$ explota cerca de un $x=a$ fijo; asíntota horizontal es cuando $y$ se aplana cerca de una altura fija al ir $x \\to \\pm\\infty$.'
      ],
      theoremsSimple: [
        'Dividir $c$ entre mil, un millón o mil millones produce números tan cercanos a cero como quieras; en el límite vale exactamente $0$.'
      ],
      formulasSimple: [
        'Compara únicamente el mayor exponente del numerador ($n$) y el mayor del denominador ($m$): si $n < m \\to 0$; si $n = m \\to \\frac{a_n}{b_m}$; si $n > m \\to \\pm\\infty$.'
      ],
      mistakesSimple: [
        'Antes de declarar asíntota vertical porque abajo dio cero, revisa arriba: si también dio cero ($0/0$), primero factoriza y cancela porque podría ser solo un hueco, no una pared infinita.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Dividir entre mayor potencia',
          title: 'Método formal estándar: dividir arriba y abajo por $x^m$',
          when: 'Método obligatorio cuando te piden justificación completa paso a paso en examen.',
          idea: 'Divide cada término por la mayor potencia que aparece en el denominador para convertir términos chicos en $c/x^k \\to 0$.',
          steps: [
            'Identifica la potencia más grande $x^m$ del denominador.',
            'Divide TODOS los términos de arriba y abajo por $x^m$.',
            'Aplica $\\lim_{x\\to\\pm\\infty} \\frac{c}{x^k} = 0$ y simplifica lo que sobrevive.'
          ],
          miniExample: '$\\lim_{x\\to\\infty}\\frac{6x^3-4x+1}{2x^3+5x^2-3} = \\lim_{x\\to\\infty}\\frac{6 - 4/x^2 + 1/x^3}{2 + 5/x - 3/x^3} = \\frac{6}{2} = 3$.',
          simple: 'Dividiendo entre la potencia más alta del piso, casi todos los términos se vuelven $0$ y solo quedan los coeficientes principales.'
        },
        {
          badge: 'Forma 2 · Términos dominantes (Atajo)',
          title: 'Quedarse únicamente con el término líder arriba y abajo',
          when: 'Para resolver en 5 segundos o comprobar resultados en preguntas rápidas.',
          idea: 'Para $|x|$ gigante, $6x^3 - 4x + 1 \\approx 6x^3$ y $\\sqrt{4x^2 + 3} \\approx \\sqrt{4x^2} = 2|x|$. Compara solo los líderes.',
          steps: [
            'Conserva solo el término de mayor potencia de arriba y el de mayor potencia de abajo (manteniendo raíces y signos).',
            'Recuerda que $\\sqrt{x^2} = |x|$ vale $+x$ si $x\\to +\\infty$ y $-x$ si $x\\to -\\infty$.',
            'Simplifica la división de los dos términos líderes.'
          ],
          miniExample: 'Para $x\\to -\\infty$: $\\frac{\\sqrt{4x^2+3}}{x-1} \\approx \\frac{\\sqrt{4x^2}}{x} = \\frac{2|x|}{x} = \\frac{-2x}{x} = -2$.',
          simple: 'Cuando $x$ vale millones, todo lo que tiene exponente menor casi no pesa: compara solo al término más grande de arriba con el más grande de abajo.'
        },
        {
          badge: 'Forma 3 · Sustitución t = -x (cuando x → -∞)',
          title: 'Cambiar $x \\to -\\infty$ por $t = -x \\to +\\infty$ para no errar signos',
          when: 'Salvavidas en límites cuando $x \\to -\\infty$ con raíces cuadradas ($\\sqrt{4x^2+3}$), para jamás olvidar el menos de $|x|=-x$.',
          idea: 'Al escribir $x = -t$ con $t > 0$ ($t \\to +\\infty$), ahora $(-t)^2 = t^2$ y $\\sqrt{t^2} = +t$ sin trucos mentales ni errores de signo.',
          steps: [
            'Define $t = -x$ ($x = -t$), entonces $t \\to +\\infty$ y puedes asumir $t > 0$.',
            'Reemplaza cada $x$ por $(-t)$ cuidadosamente.',
            'Resuelve en $+\\infty$ normalmente dividiendo por la mayor potencia positiva de $t$.'
          ],
          miniExample: '$\\lim_{x\\to -\\infty}\\frac{\\sqrt{4x^2+3}}{x-1} = \\lim_{t\\to +\\infty}\\frac{\\sqrt{4t^2+3}}{-t-1} = \\frac{\\sqrt{4}}{-1} = -2$.',
          simple: 'Cambiando $x = -t$ trabajas solo con números positivos hacia $+\\infty$ y el signo menos sale solito en el denominador.'
        },
        {
          badge: 'Forma 4 · Inversiones u = 1/x → 0',
          title: 'Transformar un límite en el infinito en uno en $u = 0$',
          when: 'Útil cuando aparecen funciones trigonométricas o exponenciales como $x\\operatorname{sen}(1/x)$.',
          idea: 'Hacer $u = 1/x$ convierte $x \\to \\infty$ en $u \\to 0^+$.',
          steps: [
            'Reemplaza $x = 1/u$ con $u \\to 0$.',
            'Resuelve como límite en $0$ usando álgebra o $\\operatorname{sen}(u)/u \\to 1$.'
          ],
          miniExample: '$\\lim_{x\\to\\infty} x\\operatorname{sen}\\left(\\frac{1}{x}\\right) = \\lim_{u\\to 0^+} \\frac{\\operatorname{sen}(u)}{u} = 1$.',
          simple: 'Si $x$ crece infinito, $1/x$ se achica a cero; cambiando $1/x$ por $u$ usas todas las reglas normales de límites en cero.'
        },
        {
          badge: 'Forma 5 · Test de signos para Asíntotas Verticales',
          title: 'Estudio de signos en $a^-$ y $a^+$ vs. cancelación de huecos',
          when: 'Para clasificar todos los ceros del denominador en funciones racionales.',
          idea: 'Factoriza primero para distinguir huecos ($0/0$) de asíntotas ($k/0$), y prueba puntos a la izquierda/derecha para ver $+\\infty$ o $-\\infty$.',
          steps: [
            'Iguala el denominador a cero para hallar los candidatos.',
            'Evalúa cada candidato en el numerador: si da $0$, simplifica primero para ver si sigue anulando abajo.',
            'En los sobrevivientes ($k/0$), analiza el signo de arriba y abajo en $a \\pm 0.01$ para determinar $\\pm\\infty$.'
          ],
          miniExample: 'Para $\\frac{4x-8}{x^2-9}$, en $x=3^-$ da $(+)/(-) \\to -\\infty$ y en $x=3^+$ da $(+)/(+) \\to +\\infty$.',
          simple: 'Primero tachas los huecos $0/0$; en los puntos donde realmente queda número entre cero, miras el signo justo a la izquierda y a la derecha.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Como arriba y abajo el grado máximo es $3$, dividimos todo por $x^3$; las fracciones con $x$ abajo tienden a $0$ y sobrevive únicamente $6/2 = 3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Términos dominantes',
              title: 'Comparar solo los términos de mayor potencia',
              when: 'Para obtener la respuesta inmediata o comprobar.',
              steps: [
                'Término dominante arriba: $6x^3$. Término dominante abajo: $2x^3$.',
                'Cociente de líderes: $\\lim_{x\\to\\infty} \\frac{6x^3}{2x^3} = \\frac{6}{2} = 3$.'
              ],
              result: '$3$',
              simple: 'Solo divides los coeficientes de la potencia más alta ($6x^3 / 2x^3 = 3$).'
            },
            {
              badge: 'Método 3 · Factorización del líder',
              title: 'Factorizar $x^3$ fuera en numerador y denominador',
              when: 'Equivalente a dividir, pero deja ver visualmente la cancelación de $x^3$.',
              steps: [
                'Extrae factor común $x^3$ tanto en el numerador como en el denominador: $\\frac{x^3(6 - 4/x^2 + 1/x^3)}{x^3(2 + 5/x - 3/x^3)}$.',
                'Cancela $x^3$ (válido para $x \\neq 0$): $\\frac{6 - 4/x^2 + 1/x^3}{2 + 5/x - 3/x^3}$.',
                'Toma el límite cuando $x \\to \\infty$: todos los términos $c/x^k \\to 0$ y resulta $\\frac{6 - 0 + 0}{2 + 0 - 0} = 3$.'
              ],
              result: '$3$',
              simple: 'Sacas factor común $x^3$ arriba y abajo, los tachas y todo lo que queda sobre $x$ se vuelve cero.'
            }
          ]
        },
        {
          simple: 'El denominador se anula en $x=3$ y $x=-3$; como ninguno anula al numerador ($4(3)-8=4$, $4(-3)-8=-20$), ambos son paredes verticales reales. Como el grado de arriba ($1$) es menor que el de abajo ($2$), en el infinito cae a $y = 0$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Análisis de comportamiento lateral en x = ±3',
              title: 'Determinar hacia dónde apunta cada lado ($+\\infty$ o $-\\infty$) para graficar',
              when: 'Para trazar la curva con precisión cerca de las asíntotas.',
              steps: [
                'En $x \\to 3^-$ (ej. $2.99$): $\\frac{+}{-} \\to -\\infty$; en $x \\to 3^+$ (ej. $3.01$): $\\frac{+}{+} \\to +\\infty$.',
                'En $x \\to -3^-$ (ej. $-3.01$): $\\frac{-}{+} \\to -\\infty$; en $x \\to -3^+$ (ej. $-2.99$): $\\frac{-}{-} \\to +\\infty$.'
              ],
              result: 'AV: $x = 3,\\; x = -3$; AH: $y = 0$',
              simple: 'Con solo probar $2.99$ y $3.01$ sabes al instante de qué lado la gráfica sube hacia el cielo y de cuál baja al fondo.'
            },
            {
              badge: 'Método 3 · Comparación de términos dominantes en ±∞',
              title: 'Confirmar la asíntota horizontal usando $\\frac{4x}{x^2} = \\frac{4}{x}$',
              when: 'Atajo instantáneo para descartar errores al dividir por $x^2$.',
              steps: [
                'Para $|x|$ grande, $f(x) \\approx \\frac{4x}{x^2} = \\frac{4}{x} \\xrightarrow{x\\to\\pm\\infty} 0$.',
                'Para verificar que $x=3$ y $x=-3$ NO son huecos: evalúa el numerador $4(3)-8=4\\neq 0$ y $4(-3)-8=-20\\neq 0$.'
              ],
              result: 'AV: $x = \\pm 3$; AH: $y = 0$',
              simple: 'Como arriba es de grado $1$ y abajo de grado $2$, en el infinito gana el denominador cuadrático y aplasta toda la fracción a $y=0$.'
            }
          ]
        },
        {
          simple: 'Cuando $x$ es negativo gigante ($x \\to -\\infty$), sacar $\\sqrt{x^2}$ NO da $x$, sino $|x| = -x$ positivo; por eso aparece el signo menos afuera de la raíz y el límite final queda $-2$, no $+2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Sustitución t = -x → +∞ (Anti-errores de signo)',
              title: 'Convertir $x \\to -\\infty$ en $+\\infty$ antes de sacar factores',
              when: 'La alternativa favorita para no cometer nunca el error $\\sqrt{x^2}=x$.',
              steps: [
                'Haz $x = -t$. Cuando $x \\to -\\infty$, entonces $t \\to +\\infty$ (con $t > 0$).',
                'Sustituye: $\\lim_{t\\to +\\infty} \\frac{\\sqrt{4(-t)^2 + 3}}{-t - 1} = \\lim_{t\\to +\\infty} \\frac{\\sqrt{4t^2 + 3}}{-(t + 1)}$.',
                'Como $t > 0$, ahora sí $\\sqrt{t^2} = t$: divide arriba y abajo por $t$ y da $\\frac{\\sqrt{4 + 0}}{-1 - 0} = -2$.'
              ],
              result: '$-2$',
              simple: 'Cambiando $x = -t$ el signo negativo ya queda visible en el denominador y jamás te equivocas con $|x|$.'
            },
            {
              badge: 'Método 3 · Verificación en x = -1000',
              title: 'Chequeo numérico de signo',
              when: 'Para confirmar en 5 segundos que el resultado es negativo y cercano a $-2$.',
              steps: [
                'En $x = -1000$: arriba $\\sqrt{4{,}000{,}003} \\approx +2000$ (la raíz cuadrada principal SIEMPRE es positiva); abajo $-1001$.',
                'Cociente: $+2000 / (-1001) \\approx -1.998 \\to -2$.'
              ],
              result: '$-2$',
              simple: 'Como una raíz cuadrada siempre es positiva y abajo $x$ es negativo, el resultado obligatoriamente tiene que ser negativo ($-2$).'
            }
          ]
        }
      ]
    },
    'lim-4': {
      simpleIntro: 'Estos límites permiten calcular derivadas de funciones trigonométricas (como $\\operatorname{sen}$ y $\\cos$). Además, aquí defines formalmente qué hace a una función "continua" (sin saltos ni agujeros) y cómo reparar una discontinuidad evitable.',
      simplePrereqs: 'Es obligatorio trabajar los ángulos en radianes (no grados) y recordar $\\operatorname{sen}^2 x + \\cos^2 x = 1$.',
      detailedSimple: [
        'Siempre que veas $\\frac{\\operatorname{sen}(\\text{algo})}{\\text{mismo algo}}$ y ese "algo" vaya a cero, el cociente completo se acerca exactamente a $1$; si falta un número abajo, multiplícalo y compénsalo afuera.',
        'Una función es continua en un punto cuando cumple tres requisitos a la vez: existe el punto relleno $f(a)$, existe el camino que llega por ambos lados ($\\lim$) y ambos están a la misma altura.',
        'Si los dos caminos llegan juntos pero falta el punto (hueco), puedes tapar el agujero redefiniendo $f(a)$; si hay un escalón abierto o pared infinita, ya no se puede arreglar.'
      ],
      conceptsSimple: [
        'El truco clave en $\\operatorname{sen}(5x)/x$ es fabricar un $5x$ idéntico abajo multiplicando por $5/5$ para poder usar la regla base $\\operatorname{sen}(u)/u \\to 1$.',
        'Los tres pasos de continuidad se resumen en: existe altura, existe límite lateral empatado y ambos coinciden.',
        'Evitable es un solo bache reparable; salto es un escalón roto; esencial es cuando explota a infinito u oscila sin parar.',
        'Si una curva continua empieza por debajo del cero y termina por encima del cero, a la fuerza tuvo que cruzar el eje $X$ al menos una vez.'
      ],
      theoremsSimple: [
        'Si en un dibujo geométrico comparas un triángulo pequeño, la rebanada de círculo y un triángulo más grande, $\\frac{\\operatorname{sen} x}{x}$ queda atrapado en un sándwich entre $\\cos x$ y $1$, que convergen los dos a $1$.'
      ],
      formulasSimple: [
        'Con radianes en $x\\to 0$: $\\operatorname{sen}(kx)/kx \\to 1$, $(1-\\cos x)/x \\to 0$ y $(1-\\cos x)/x^2 \\to 1/2$.',
        'Resumen en una sola igualdad de continuidad: el límite al llegar al punto iguala al valor real en el punto.'
      ],
      mistakesSimple: [
        'El argumento dentro de $\\operatorname{sen}(5x)$ está blindado: nunca puedes sacar el $5$ multiplicando afuera para simplificar ni tachar la $x$ de adentro directamente.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Completar argumento u = kx',
          title: 'Ajustar coeficientes o dividir entre $x$ para usar $\\frac{\\operatorname{sen}(u)}{u} \\to 1$',
          when: 'Para cocientes con $\\operatorname{sen}(ax)$, $\\tan(ax)$, o combinaciones entre ambos cuando $x \\to 0$.',
          idea: 'Empareja cada $\\operatorname{sen}(kx)$ con su respectivo $kx$ abajo multiplicando y dividiendo por $k$ (o divide numerador y denominador entre $x$).',
          steps: [
            'Reescribe $\\tan(ax) = \\frac{\\operatorname{sen}(ax)}{\\cos(ax)}$.',
            'Divide arriba y abajo por $x$ (o la potencia adecuada) y multiplica cada fracción por su coeficiente $k/k$.',
            'Aplica $\\lim_{u\\to 0}\\frac{\\operatorname{sen}(u)}{u} = 1$ (y $\\cos(0)=1$) en cada factor.'
          ],
          miniExample: '$\\lim_{x\\to 0}\\frac{\\operatorname{sen}(7x)}{\\operatorname{sen}(3x)} = \\lim_{x\\to 0}\\frac{7\\cdot\\frac{\\operatorname{sen}(7x)}{7x}}{3\\cdot\\frac{\\operatorname{sen}(3x)}{3x}} = \\frac{7}{3}$.',
          simple: 'A cada seno con $kx$ adentro le pones un $kx$ debajo y compensas multiplicando por $k$; al final solo te quedan las constantes.'
        },
        {
          badge: 'Forma 2 · Conjugado vs. Ángulo Medio en (1 - cos u)',
          title: 'Dos rutas rápidas para $(1 - \\cos(kx))/x^2$: Conjugado $(1+\\cos)$ vs. $1-\\cos(2\\theta)=2\\operatorname{sen}^2\\theta$',
          when: 'Siempre que aparezca $1 - \\cos(\\text{algo})$ en un límite $0/0$.',
          idea: 'Puedes multiplicar por $(1+\\cos)$ para fabricar $\\operatorname{sen}^2$, O usar la identidad de medio ángulo $1 - \\cos(kx) = 2\\operatorname{sen}^2(kx/2)$ directo en un paso.',
          steps: [
            'Ruta A (Conjugado): multiplica arriba y abajo por $1 + \\cos(kx)$ para obtener $\\operatorname{sen}^2(kx)$ arriba.',
            'Ruta B (Ángulo medio): sustituye $1 - \\cos(kx) = 2\\operatorname{sen}^2(kx/2)$ y divide entre $x^2$.',
            'Evalúa $\\lim_{u\\to 0}(\\frac{\\operatorname{sen} u}{u})^2 = 1$ en cualquiera de las dos.'
          ],
          miniExample: '$\\lim_{x\\to 0}\\frac{1-\\cos(2x)}{x^2} = \\lim_{x\\to 0}\\frac{2\\operatorname{sen}^2(x)}{x^2} = 2\\cdot 1^2 = 2$.',
          simple: 'Usar $1 - \\cos(2x) = 2\\operatorname{sen}^2(x)$ convierte $(1 - \\cos(2x))/x^2$ en $2(\\operatorname{sen} x / x)^2 = 2$ casi de un plumazo.'
        },
        {
          badge: 'Forma 3 · Cambio de variable a x → 0',
          title: 'Hacer $u = x - a$ cuando el límite trigonométrico tiende a $a \\neq 0$ (ej. $x \\to \\pi/2$)',
          when: 'Cuando el límite no tiende a $0$, sino a $\\pi$, $\\pi/2$ o algún $a \\neq 0$.',
          idea: 'Las fórmulas fundamentales solo funcionan en $0$; traslada $x = a + u$ para llevar el límite al origen y aplica identidades de suma/resta.',
          steps: [
            'Define $u = x - a \\implies x = a + u$, con $u \\to 0$.',
            'Usa identidades como $\\operatorname{sen}(\\pi - u) = \\operatorname{sen} u$ o $\\cos(\\pi/2 + u) = -\\operatorname{sen} u$.',
            'Resuelve normalmente ahora que $u \\to 0$.'
          ],
          miniExample: 'En $\\lim_{x\\to\\pi}\\frac{\\operatorname{sen} x}{x-\\pi}$, haz $u=x-\\pi$: queda $\\lim_{u\\to 0}\\frac{\\operatorname{sen}(\\pi+u)}{u} = \\lim_{u\\to 0}\\frac{-\\operatorname{sen} u}{u} = -1$.',
          simple: 'Cuando $x$ tiende a $\\pi$ u otro número distinto de cero, el cambio $u = x - a$ mueve el problema a cero donde sí funcionan las reglas.'
        },
        {
          badge: 'Forma 4 · Sándwich (Acotamiento) y L\'Hôpital',
          title: 'Acotar con $-1 \\le \\operatorname{sen}(\\cdot) \\le 1$ o verificar por derivación',
          when: 'Acotamiento sirve para $x^n \\operatorname{sen}(1/x)$; L\'Hôpital comprueba cocientes trigonométricos $0/0$.',
          idea: 'Si algo acotado entre $-1$ y $1$ multiplica a un término que tiende a $0$, aplasta el producto a $0$; en cocientes $0/0$, derivar arriba y abajo confirma la razón exacta.',
          steps: [
            'Para acotamiento: parte de $-|g(x)| \\le g(x)\\operatorname{sen}(\\dots) \\le |g(x)|$ y toma límites en ambos extremos.',
            'Para verificar $0/0$: deriva arriba y abajo (en radianes) y evalúa.'
          ],
          miniExample: 'Para $\\lim_{x\\to 0} x^2 \\cos(1/x)$, como $-x^2 \\le x^2\\cos(1/x) \\le x^2$ y ambos extremos van a $0$, el límite es $0$.',
          simple: 'Algo que rebota entre $-1$ y $1$ multiplicado por algo que se vuelve $0$ termina obligatoriamente aplastado en $0$.'
        },
        {
          badge: 'Forma 5 · Checklist de Continuidad',
          title: 'Protocolo en 3 pasos para estudiar y reparar discontinuidades',
          when: 'En funciones racionales con huecos o funciones por partes con parámetros $a, b$ por despejar.',
          idea: 'Checa las 3 condiciones en orden; si te piden hallar un parámetro $k$ para hacer continua la función, iguala los dos límites laterales con el valor del punto.',
          steps: [
            '1) Evalúa $f(a)$ (o escribe su expresión con el parámetro).',
            '2) Calcula $\\lim_{x\\to a^-}f(x)$ y $\\lim_{x\\to a^+}f(x)$ e igualalos.',
            '3) Iguala ese límite común con $f(a)$ y despeja el valor que repara o une las ramas.'
          ],
          miniExample: 'En $(x^2-25)/(x-5)$ para $x\\neq 5$, simplifica a $x+5$, toma límite en $5 \\to 10$, y asigna $f(5)=10$.',
          simple: 'Para volver continua una función rota en un punto, solo calculas a qué altura llegan los dos lados y rellenas exactamente ese hueco.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Dividimos tanto arriba como abajo entre $x$, completamos cada seno con el número que tiene adentro ($7$ y $3$) y ambos bloques $\\operatorname{sen}(u)/u$ se vuelven $1$, dejando $7/3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Producto por identidad sin dividir entre x',
              title: 'Usar límite base $\\lim_{u\\to 0}\\frac{\\operatorname{sen}(u)}{u} = 1$ multiplicando por $\\frac{7x}{7x}\\cdot\\frac{3x}{3x}$',
              when: 'Alternativa explícita factorizando cada parte.',
              steps: [
                'Multiplica y divide por $7x$ y $3x$: $\\frac{\\operatorname{sen}(7x)}{7x} \\cdot \\frac{3x}{\\operatorname{sen}(3x)} \\cdot \\frac{7x}{3x}$.',
                'Como los dos primeros factores tienden a $1$ y $1$, y $7x / 3x = 7/3$, resulta $1 \\cdot 1 \\cdot \\frac{7}{3} = \\frac{7}{3}$.'
              ],
              result: '$\\frac{7}{3}$',
              simple: 'En cualquier límite de este tipo en cero, $\\operatorname{sen}(ax)/\\operatorname{sen}(bx)$ termina dando directo la razón $a/b$.'
            },
            {
              badge: 'Método 3 · Comprobación rápida (L\'Hôpital / Radianes)',
              title: 'Derivar arriba y abajo en $0/0$ o evaluar $x = 0.001\\text{ rad}$',
              when: 'Verificación instantánea.',
              steps: [
                'Derivando ($0/0$): $\\lim_{x\\to 0}\\frac{7\\cos(7x)}{3\\cos(3x)} = \\frac{7(1)}{3(1)} = \\frac{7}{3}$.',
                'Con $x = 0.001\\text{ rad}$: $\\operatorname{sen}(0.007)/\\operatorname{sen}(0.003) \\approx 2.3333 = 7/3$.'
              ],
              result: '$\\frac{7}{3}$',
              simple: 'Derivando arriba y abajo (en radianes) te da $7/3$ en un único renglón.'
            }
          ]
        },
        {
          simple: 'En $x=5$ la fracción daba $0/0$, es decir un hueco. Factorizando $x^2-25 = (x-5)(x+5)$ y cancelando $(x-5)$ vemos que para todo lo demás la función es la recta $x+5$, así que en $x=5$ el hueco está a altura $5+5 = 10$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Comprobación lateral con calculadora',
              title: 'Evaluar $f(4.999)$ y $f(5.001)$',
              when: 'Para confirmar intuitivamente a qué altura rellenar el punto.',
              steps: [
                '$f(4.999) = \\frac{24.990001 - 25}{-0.001} = 9.999$.',
                '$f(5.001) = \\frac{25.010001 - 25}{0.001} = 10.001$.',
                'El agujero está exactamente a altura $10$.'
              ],
              result: '$f(5) = 10$',
              simple: 'A ambos lados de $x=5$ la función vale $9.999$ y $10.001$, gritando que el tapón exacto vale $10$.'
            },
            {
              badge: 'Método 3 · Traslación x = 5 + h o Regla de L\'Hôpital',
              title: 'Comprobar el límite con $h = x - 5 \\to 0$ o derivación en $0/0$',
              when: 'Evita factorizar si el polinomio fuera de mayor grado.',
              steps: [
                'Con $x = 5 + h$: $\\frac{(5+h)^2 - 25}{h} = \\frac{10h + h^2}{h} = 10 + h \\xrightarrow{h\\to 0} 10$.',
                'Con L\'Hôpital ($0/0$): $\\lim_{x\\to 5} \\frac{2x}{1} = 10$.'
              ],
              result: '$f(5) = 10$',
              simple: 'Tanto sustituyendo $5+h$ como derivando arriba y abajo obtienes inmediatamente que la altura faltante vale $10$.'
            }
          ]
        },
        {
          simple: 'Multiplicamos por el conjugado $1+\\cos(2x)$ para convertir $1-\\cos^2(2x)$ en $\\operatorname{sen}^2(2x)$; luego juntamos $\\left(\\frac{\\operatorname{sen}(2x)}{2x}\\right)^2 \\to 1$ y nos queda $4/(1+1) = 2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Identidad del ángulo medio (Mucho más corto)',
              title: 'Sustituir directo $1 - \\cos(2x) = 2\\operatorname{sen}^2(x)$',
              when: 'Evita conjugados por completo y resuelve en 2 líneas.',
              steps: [
                'Usa la identidad trigonométrica exacta $1 - \\cos(2x) = 2\\operatorname{sen}^2(x)$.',
                'Reemplaza en el límite: $\\lim_{x\\to 0}\\frac{2\\operatorname{sen}^2(x)}{x^2} = 2 \\left(\\lim_{x\\to 0}\\frac{\\operatorname{sen}(x)}{x}\\right)^2 = 2 \\cdot 1^2 = 2$.'
              ],
              result: '$2$',
              simple: 'Cambiar $1 - \\cos(2x)$ por $2\\operatorname{sen}^2(x)$ resuelve este límite en literalmente dos pasos sin conjugado.'
            },
            {
              badge: 'Método 3 · Aplicar L\'Hôpital dos veces (Verificación)',
              title: 'Derivar dos veces en $0/0$',
              when: 'Confirmación usando derivadas trigonométricas.',
              steps: [
                'Primera derivada ($0/0$): $\\lim_{x\\to 0}\\frac{2\\operatorname{sen}(2x)}{2x} = \\lim_{x\\to 0}\\frac{\\operatorname{sen}(2x)}{x}$.',
                'Segunda derivada (o regla fundamental $\\cdot 2$): $\\lim_{x\\to 0}\\frac{2\\cos(2x)}{1} = 2$.'
              ],
              result: '$2$',
              simple: 'Después de derivar arriba y abajo una vez ya te sale $\\operatorname{sen}(2x)/x \\to 2$ al instante.'
            }
          ]
        }
      ]
    }
  };

  applyEnrichmentMap(ns.Curriculum, ENRICHMENT_2);
})(window.MatInteractiva);
