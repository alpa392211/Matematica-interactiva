/* ==========================================================================
   MATETIC - Enriquecimiento Pedagógico Parte 1
   (Aritmética, Álgebra, Geometría y Trigonometría: 9 temas)
   Agrega:
   - Múltiples formas de abordar y resolver problemas (solvingApproaches)
   - Explicaciones "en palabras más sencillas" para cada apunte (simple*)
   - Métodos alternativos en los ejemplos resueltos (alternativeMethods)
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

  const ENRICHMENT_1 = {
    'arit-1': {
      simpleIntro: 'Piensa en los números reales como todas las medidas posibles sobre una regla infinita (positivos, negativos, fracciones y decimales sin fin). Las reglas de jerarquía son el idioma universal para que cualquiera que lea una operación la resuelva en el mismo orden y obtenga el mismo número.',
      simplePrereqs: 'Solo necesitas recordar tus tablas básicas de multiplicar, cómo sumar o restar números negativos (como deber o tener dinero) y que elevar al cuadrado es multiplicar un número por sí mismo.',
      detailedSimple: [
        'Cuando ves varias operaciones juntas, no se resuelven de izquierda a derecha a ciegas: primero abres los paréntesis más internos, luego calculas potencias y raíces, después multiplicaciones/divisiones y al final sumas/restas.',
        'Los exponentes negativos y en fracción son atajos de escritura: un signo menos en el exponente significa "voltea la base al denominador" ($x^{-n} = 1/x^n$), y una fracción $m/n$ combina potencia $m$ con raíz $n$-ésima.'
      ],
      conceptsSimple: [
        'Cuando hay paréntesis dentro de corchetes, resuelve como pelando una cebolla: empieza por la capa más chiquita del centro y ve saliendo.',
        'El paréntesis decide a quién afecta el cuadrado: en $(-5)^2$ el signo también se multiplica $(-5)(-5)=25$, pero en $-5^2$ solo elevas el $5$ y dejas el menos esperando afuera: $-25$.',
        'Un exponente negativo no vuelve negativo al número; únicamente lo muda de piso en la fracción (de arriba hacia abajo, o de abajo hacia arriba).',
        'En cálculo es mucho más cómodo derivar o integrar una potencia escrita como fracción ($x^{1/2}$) o con signo negativo ($x^{-2}$) que dejarla atrapada dentro de una raíz o abajo de una división.'
      ],
      theoremsSimple: [
        'Las reglas de los exponentes no son caprichos: salen obligatoriamente de pedir que $a^m \\cdot a^n = a^{m+n}$ siga funcionando aunque $m$ sea cero, negativo o fracción.'
      ],
      formulasSimple: [
        'Si multiplicas la misma base, sumas exponentes; si la divides, restas el exponente de abajo al de arriba; si elevas una potencia a otra, multiplicas sus exponentes.',
        'El denominador del exponente fraccionario es siempre el índice de la raíz: $\\sqrt[n]{x^m}$ siempre tiene $n$ abajo en $x^{m/n}$.'
      ],
      mistakesSimple: [
        'Pregunta clave antes de elevar: "¿El signo menos está abrazado por un paréntesis?" Si sí, el menos también va al cuadrado y da positivo; si no, el resultado sigue negativo.',
        'Multiplicar y dividir tienen prioridad sobre sumar y restar, igual que en un recibo primero calculas cantidad × precio y al último sumas los totales.',
        'Nunca conviertas $2^{-3}$ en $-8$: el menos arriba significa "recíproco", es decir $\\frac{1}{2^3} = \\frac{1}{8}$ (positivo).'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Paso a paso',
          title: 'Jerarquía estricta de adentro hacia afuera (PEMDAS)',
          when: 'Ideal cuando hay paréntesis, corchetes, potencias y operaciones combinadas largas.',
          idea: 'Divide la expresión en "islas" separadas por los signos $+$ y $-$ externos; resuelve cada isla siguiendo Paréntesis → Exponentes → Multiplicación/División → Suma/Resta.',
          steps: [
            'Ubica los paréntesis más internos y simplifica su contenido hasta tener un solo número.',
            'Evalúa primero potencias y radicales antes de multiplicar por coeficientes vecinos.',
            'Realiza multiplicaciones y divisiones de izquierda a derecha, y al final suma y resta.'
          ],
          miniExample: '$12 - 2(3^2 - 5) = 12 - 2(9 - 5) = 12 - 2(4) = 12 - 8 = 4$.',
          simple: 'Piensa en los signos $+$ y $-$ como muros que separan bloques: resuelve primero lo que pasa dentro de cada bloque antes de juntarlos al final.'
        },
        {
          badge: 'Forma 2 · Algebraica',
          title: 'Reescritura uniforme a potencias fraccionarias y negativas',
          when: 'Excelente cuando se mezclan raíces, divisiones y potencias con la misma base (o antes de derivar/integrar).',
          idea: 'Transforma todo a la forma $a^p$ sin raíces ni denominadores; así solo sumas o restas exponentes.',
          steps: [
            'Cambia cada raíz $\\sqrt[n]{a^m}$ por $a^{m/n}$ y cada $\\frac{1}{a^k}$ por $a^{-k}$.',
            'Descompón las bases compuestas en factores primos (ej. $27 = 3^3$, $8 = 2^3$).',
            'Aplica $(a^m)^n = a^{mn}$ y agrupa sumando exponentes de bases iguales.'
          ],
          miniExample: '$\\frac{\\sqrt{x}}{x^2} = x^{1/2} \\cdot x^{-2} = x^{1/2 - 2} = x^{-3/2}$.',
          simple: 'Poner todo como $x^{\\text{algo}}$ vuelve un problema feo con raíces y fracciones en una simple suma o resta de numeritos arriba.'
        },
        {
          badge: 'Forma 3 · Atajo numérico',
          title: 'Extraer primero la raíz antes de elevar en $a^{m/n}$',
          when: 'Cuando evalúas potencias fraccionarias a mano sin calculadora, como $27^{2/3}$ o $16^{3/4}$.',
          idea: 'En vez de calcular un número gigante ($27^2 = 729$) y luego buscar su raíz cúbica, primero saca la raíz pequeña ($\\sqrt[3]{27} = 3$) y al último eleva ($3^2 = 9$).',
          steps: [
            'Reescribe $a^{m/n}$ como $(\\sqrt[n]{a})^m$.',
            'Calcula la raíz $\\sqrt[n]{a}$ mentalmente con números pequeños.',
            'Eleva ese resultado pequeño a la potencia $m$ (y si había signo negativo en el exponente, inviértelo al final).'
          ],
          miniExample: '$32^{-3/5} = \\left(\\sqrt[5]{32}\\right)^{-3} = 2^{-3} = \\frac{1}{8}$.',
          simple: 'Es mucho más fácil achicar primero el número sacando la raíz y agrandarlo después, que hacer crecer el número muchísimo y luego adivinar su raíz.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Resolvemos primero la potencia dentro del paréntesis ($2^3 = 8$) para reducir $(10 - 8)$ a $2$; luego calculamos aparte la multiplicación ($3 \\cdot 2 = 6$) y la división ($16 \\div 2 = 8$), y al final operamos $18 - 6 + 8 = 20$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Separación en términos (islas)',
              title: 'Evaluar cada sumando principal por separado',
              when: 'Útil para evitar restar $18 - 3$ antes de multiplicar y dividir.',
              steps: [
                'Identifica los 3 términos separados por $-$ y $+$ externos: $T_1 = 18$, $T_2 = 3(10 - 2^3)$ y $T_3 = 4^2 \\div 2$.',
                'Calcula $T_2 = 3(10 - 8) = 3(2) = 6$ y $T_3 = 16 \\div 2 = 8$.',
                'Combina de izquierda a derecha: $18 - 6 + 8 = 12 + 8 = 20$.'
              ],
              result: '$20$',
              simple: 'Cortar la operación en bloques independientes evita el clásico error de restar $18 - 3$ antes de tiempo.'
            }
          ]
        },
        {
          simple: 'En $27^{2/3}$ primero sacas la raíz cúbica ($3$) y la elevas al cuadrado ($9$); $4^{-1}$ es $\\frac{1}{4}$ y $(-3)^2 = 9$ se vuelve positivo por el paréntesis, así que $9$ y $-9$ se cancelan quedando solo $\\frac{1}{4} = 0.25$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Factorización en potencias primas',
              title: 'Reescribir bases como $27 = 3^3$ y $4 = 2^2$',
              when: 'Práctico cuando las bases son potencias exactas de números primos.',
              steps: [
                'Sustituye: $(3^3)^{2/3} + (2^2)^{-1} - (-3)^2$.',
                'Multiplica exponentes $(a^m)^n = a^{mn}$: $3^2 + 2^{-2} - 9$.',
                'Evalúa: $9 + \\frac{1}{4} - 9 = \\frac{1}{4} = 0.25$.'
              ],
              result: '$\\frac{1}{4} = 0.25$',
              simple: 'Al escribir $27$ como $3^3$, el $3$ de arriba cancela al $3$ del denominador $2/3$ en un segundo.'
            }
          ]
        },
        {
          simple: 'Cuando una fracción tiene exponente negativo, la volteas a $\\frac{4}{3}$ al cuadrado ($\\frac{16}{9}$); en el segundo bloque $\\sqrt{64} = 8$ y $2^{-2} = \\frac{1}{4}$ se multiplican dando $2$, y al final restas $\\frac{16}{9} - \\frac{18}{9} = -\\frac{2}{9}$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Potencias de base 2 y fracción directa',
              title: 'Escribir $\\sqrt{64} = 2^3$ y combinar exponentes antes de restar',
              when: 'Útil si prefieres operar todo con leyes de potencias antes de sumar fracciones.',
              steps: [
                'Invierte el exponente negativo: $\\left(\\frac{3}{4}\\right)^{-2} = \\left(\\frac{4}{3}\\right)^2 = \\frac{16}{9}$.',
                'Convierte $\\sqrt{64} \\cdot 2^{-2} = 2^3 \\cdot 2^{-2} = 2^{3-2} = 2$.',
                'Resta convirtiendo $2 = \\frac{18}{9}$: $\\frac{16}{9} - \\frac{18}{9} = -\\frac{2}{9}$.'
              ],
              result: '$-\\frac{2}{9}$',
              simple: 'Voltear $\\frac{3}{4}$ borra el signo menos del exponente y $2^3 \\cdot 2^{-2}$ se reduce a $2^1 = 2$.'
            }
          ]
        }
      ]
    },
    'arit-2': {
      simpleIntro: 'Las fracciones son divisiones exactas que no conviene redondear a decimales inexactos, y las proporciones comparan cómo cambia una cantidad cuando otra crece o disminuye (más trabajadores → menos días; más impresoras → más piezas).',
      simplePrereqs: 'Necesitas saber simplificar fracciones dividiendo arriba y abajo por el mismo número, y distinguir cuándo dos cantidades suben juntas (directa) o una sube mientras la otra baja (inversa).',
      detailedSimple: [
        'No puedes sumar $\\frac{1}{2} + \\frac{1}{3}$ sumando directos porque sus "rebanadas" son de distinto tamaño; por eso primero haces que tengan el mismo denominador.',
        'Una fracción sobre otra fracción parece intimidante, pero es solo dividir la de arriba entre la de abajo: multiplicas los números de las orillas (arriba) entre los de en medio (abajo).'
      ],
      conceptsSimple: [
        'El MCD es la pieza más grande que cabe exacto en ambos números: sirve para simplificar fracciones al mínimo.',
        'El MCM es el primer múltiplo en el que coinciden dos denominadores: sirve para sumar y restar fracciones sin inflar de más los números.',
        'La regla del sándwich (extremos y medios) solo te dice dónde colocar cada multiplicación: los de las puntas suben al numerador y los del centro quedan en el denominador.'
      ],
      theoremsSimple: [
        'Si multiplicas arriba y abajo de una fracción por el mismo número distinto de cero, es como multiplicar por $1$: cambia el disfraz pero no cambia su valor.'
      ],
      formulasSimple: [
        'Suma/resta busca denominador igual; multiplicar va derecho (arriba con arriba, abajo con abajo); dividir es multiplicar volteando la segunda fracción.',
        'Si dudas en una división de fracciones, reescribe la raya larga central como el signo $\\div$ normal.'
      ],
      mistakesSimple: [
        'Imagina media pizza más un tercio de pizza: jamás te da dos quintos de pizza; siempre iguala el tamaño de las rebanadas primero.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · MCM',
          title: 'Mínimo Común Múltiplo para denominadores pequeños o limpios',
          when: 'Ideal para sumar 2 o más fracciones evitando números gigantes.',
          idea: 'Encuentra el menor denominador común compartido y ajusta cada numerador solo por lo que le falta.',
          steps: [
            'Halla el MCM de todos los denominadores.',
            'Amplifica cada fracción multiplicando arriba y abajo para igualar el denominador al MCM.',
            'Suma o resta solo los numeradores y simplifica al final si es posible.'
          ],
          miniExample: '$\\frac{5}{6} - \\frac{1}{4}$: como $\\text{MCM}(6,4) = 12$, queda $\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$.',
          simple: 'En vez de multiplicar $6 \\times 4 = 24$, buscas el $12$ porque ya está en las tablas del $6$ y del $4$; trabajas con números más chicos.'
        },
        {
          badge: 'Forma 2 · Multiplicar por MCM',
          title: 'Limpiar fracciones complejas multiplicando todo por el MCM global',
          when: 'Súper rápido para fracciones complejas con varias sumas y restas arriba y abajo.',
          idea: 'En vez de simplificar arriba y abajo por separado, multiplica el numerador completo y el denominador completo por un solo número que mate a todos los denominadores pequeños.',
          steps: [
            'Calcula un múltiplo común $M$ de TODOS los denominadores chiquitos que aparezcan arriba y abajo.',
            'Multiplica cada término del numerador grande y del denominador grande por $M$.',
            'Quedará una fracción simple de enteros que simplificas de una vez.'
          ],
          miniExample: 'En $\\frac{\\frac{5}{6} - \\frac{1}{4}}{\\frac{2}{3} + \\frac{1}{2}}$, multiplica arriba y abajo por $12$: $\\frac{10 - 3}{8 + 6} = \\frac{7}{14} = \\frac{1}{2}$.',
          simple: 'Es un truco elegante: multiplicando todo por $12$ desaparecen todas las minifracturas de un solo golpe.'
        },
        {
          badge: 'Forma 3 · Proporciones',
          title: 'Análisis directo vs. inverso y reducción a la unidad',
          when: 'Para cualquier problema de regla de tres simple o compuesta (obreros, días, máquinas, velocidades).',
          idea: 'Puedes comparar el trabajo total constante (producto directo en inversas) o calcular primero cuánto hace $1$ máquina en $1$ hora.',
          steps: [
            'Compara cada magnitud conocida con la incógnita: ¿al aumentar una, la otra aumenta (directa) o disminuye (inversa)?',
            'En relación directa, el cociente es constante ($y/x = k$). En inversa, el producto es constante ($x \\cdot y = k$).',
            'Alternativamente, reduce primero a $1$ unidad y multiplica al final.'
          ],
          miniExample: '6 técnicos × 10 días = 60 días-técnico de trabajo total. Con 4 técnicos: $60 / 4 = 15$ días.',
          simple: 'Si 6 personas tardan 10 días, la obra entera vale 60 jornadas de una sola persona; repartir 60 entre 4 personas da 15 días enseguida.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Primero igualamos la resta de arriba a doceavos ($\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$); como abajo también dice exactamente $\\frac{7}{12}$, cualquier número dividido entre sí mismo siempre vale $1$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Cancelación instantánea con MCM = 12',
              title: 'Multiplicar numerador y denominador completos por 12',
              when: 'Más rápido cuando todos los denominadores pequeños dividen a 12.',
              steps: [
                'Multiplica arriba y abajo por $12$: $\\frac{12(\\frac{5}{6} - \\frac{1}{4})}{12(\\frac{7}{12})}$.',
                'Simplifica cada producto: $\\frac{10 - 3}{7} = \\frac{7}{7}$.',
                'Divide $7 \\div 7 = 1$.'
              ],
              result: '$1$',
              simple: 'Te ahorras hacer extremos y medios; multiplicando todo por $12$ queda $\\frac{10 - 3}{7} = \\frac{7}{7} = 1$.'
            }
          ]
        },
        {
          simple: 'Como menos técnicos trabajando juntos tardan más días, el producto (técnicos × días) siempre debe dar la misma carga de trabajo total ($60$).',
          alternativeMethods: [
            {
              badge: 'Método 2 · Reducción a la unidad (1 técnico)',
              title: 'Calcular cuánto tardaría 1 solo técnico y repartir entre 4',
              when: 'Muy intuitivo si prefieres razonarlo sin ecuaciones de proporcionalidad.',
              steps: [
                'Un solo técnico haría todo el montaje en $6 \\times 10 = 60$ días.',
                'Repartiendo ese trabajo entre $4$ técnicos por igual: $60 \\div 4 = 15$ días.'
              ],
              result: '$15$ días',
              simple: 'Primero pasas a un solo trabajador (multiplicas) y luego repartes entre los 4 técnicos (divides).'
            }
          ]
        },
        {
          simple: 'Primero ves cuántas piezas produce $1$ sola impresora en $1$ hora ($5$ piezas/h); entonces $3$ impresoras producen $15$ piezas por hora, así que para $180$ piezas necesitan $180 \\div 15 = 12$ horas.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Escalamiento proporcional en 2 pasos',
              title: 'Ajustar primero el cambio de impresoras y luego el cambio de piezas',
              when: 'Ideal para resolver regla de tres compuesta mentalmente sin fórmulas.',
              steps: [
                'Para las mismas $150$ piezas, bajar de $5$ a $3$ impresoras (inversa) multiplica el tiempo por $\\frac{5}{3}$: $6 \\cdot \\frac{5}{3} = 10\\text{ h}$.',
                'Subir la producción de $150$ a $180$ piezas (directa) multiplica el tiempo por $\\frac{180}{150} = \\frac{6}{5}$: $10 \\cdot \\frac{6}{5} = 12\\text{ horas}$.'
              ],
              result: '$12$ horas',
              simple: 'Primero calculas cuánto tardan 3 impresoras en hacer las 150 piezas ($10$ h) y luego ajustas proporcionalmente a 180 piezas ($12$ h).'
            }
          ]
        }
      ]
    },
    'alg-1': {
      simpleIntro: 'Factorizar es desarmar una suma o resta en una multiplicación de piezas más simples. En Cálculo y Límites esto es oro puro, porque solo puedes cancelar factores que estén multiplicando arriba y abajo para eliminar el $0/0$.',
      simplePrereqs: 'Necesitas soltura con las tablas de multiplicar, suma y resta de signos y la propiedad distributiva al revés (sacar lo repetido fuera del paréntesis).',
      detailedSimple: [
        'El primer chequeo SIEMPRE es buscar si todos los términos comparten un número o una $x$: si lo tienen, sácalo primero con factor común y el resto se vuelve muchísimo más pequeño.',
        'Si ves dos términos restándose con cuadrados o cubos, no tanteas: aplicas el molde exacto de diferencia de cuadrados $(a-b)(a+b)$ o cubos.',
        'Si ves un trinomio con $x^2$, buscas dos números que multiplicados den el término independiente y sumados den el de en medio (ajustando si $a \\neq 1$).'
      ],
      conceptsSimple: [
        'Factor común es el reverso de multiplicar: buscas la mayor cantidad que cabe en todos los términos y la sacas multiplicando.',
        'Diferencia de cuadrados siempre abre en dos paréntesis iguales pero con signos opuestos ($+$ y $-$). Diferencia de cubos siempre saca el signo en $(a-b)$ y deja todo positivo en $(a^2+ab+b^2)$.',
        'Para $ax^2+bx+c$ (cuando $a \\neq 1$), partes el término central $bx$ usando dos números cuya multiplicación sea $a \\cdot c$, y después agrupas en parejas.',
        'Incluso exponentes negativos o fracciones comparten factor común: saca siempre la potencia con el exponente más chico (más negativo) de todos.'
      ],
      theoremsSimple: [
        'Si pruebas un número $r$ en un polinomio y el resultado da $0$, tienes garantía total de que $(x - r)$ es uno de los factores de ese polinomio.'
      ],
      formulasSimple: [
        'Resta de cuadrados: $(a-b)(a+b)$. Trinomio perfecto: $(a\\pm b)^2$. Suma de cuadrados $a^2+b^2$ NO se parte en números reales.',
        'Regla mnemotécnica SOPA para cubos $a^3 \\pm b^3$: el primer paréntesis lleva el Mismo signo, el segundo empieza con el Opuesto y termina siempre Positivo.'
      ],
      mistakesSimple: [
        'Una suma de cuadrados ($x^2 + 9$) nunca da cero con números reales, así que jamás la partas en $(x+3)^2$ porque $(x+3)^2$ lleva un $+6x$ oculto.',
        'En el segundo paréntesis de $(a-b)(a^2 + ab + b^2)$ NO hay ningún $2$ delante de $ab$; por eso ese trinomio tampoco se factoriza más.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Diagnóstico por términos',
          title: 'Árbol de decisión rápido según cuántos términos ves',
          when: 'Úsalo siempre al principio frente a cualquier polinomio.',
          idea: 'Cuenta los términos tras sacar el factor común: 2 términos usan cuadrados/cubos; 3 usan trinomios; 4 usan agrupación.',
          steps: [
            'Paso 0 obligatorio: saca el Máximo Factor Común (MFC).',
            'Si quedan 2 términos con resta: revisa diferencia de cuadrados $a^2-b^2$ o cubos $a^3\\pm b^3$.',
            'Si quedan 3 términos: prueba TCP o tanteo de dos paréntesis; si quedan 4, agrupa de dos en dos.'
          ],
          miniExample: '$2x^3 - 18x = 2x(x^2 - 9) = 2x(x - 3)(x + 3)$.',
          simple: 'Contar los términos después de sacar el factor común te dice al instante qué fórmula usar.'
        },
        {
          badge: 'Forma 2 · Trinomios ax²+bx+c',
          title: 'Método ac (agrupación) vs. Método de multiplicar y dividir por a',
          when: 'Cuando $a \\neq 1$ en $ax^2 + bx + c$ (como $6x^2 + 7x - 3$).',
          idea: 'Puedes partir $bx$ en dos términos cuyo producto sea $ac$, O multiplicar por $a$ usando $u = ax$ para volverlo un trinomio sencillo $u^2 + bu + ac$.',
          steps: [
            'Calcula el producto $a \\cdot c$ y busca $p, q$ con $p \\cdot q = a \\cdot c$ y $p + q = b$.',
            'Camino A: reescribe $ax^2 + px + qx + c$ y agrupa 2 y 2.',
            'Camino B: escribe $\\frac{(ax + p)(ax + q)}{a}$ y simplifica el denominador $a$ dividiendo los paréntesis.'
          ],
          miniExample: 'En $6x^2+7x-3$: $p=9, q=-2 \\implies \\frac{(6x+9)(6x-2)}{6} = \\frac{3(2x+3)\\cdot 2(3x-1)}{6} = (2x+3)(3x-1)$.',
          simple: 'Con el truco $\\frac{(ax+p)(ax+q)}{a}$ solo buscas dos números y simplificas arriba y abajo.'
        },
        {
          badge: 'Forma 3 · Polinomios grado ≥ 3',
          title: 'Teorema del Factor y División Sintética (Ruffini)',
          when: 'Indispensable en límites $0/0$ con polinomios cúbicos o de grado 4 que no tienen factor común obvio.',
          idea: 'Si sabes que $x = r$ anula al polinomio (en límites suele ser el punto $x \\to r$), divides sintéticamente entre $(x - r)$ para bajar un grado en segundos.',
          steps: [
            'Busca una raíz $r$ (divisor del término constante, o en $\\lim_{x \\to a}$, prueba directamente $x = a$).',
            'Aplica la tabla de división sintética con los coeficientes (rellenando con $0$ si falta un grado).',
            'Escribe $(x - r)$ multiplicado por el cociente de un grado menor y sigue factorizando.'
          ],
          miniExample: 'Para $x^3 - 8$ en $x=2$: coeficientes $[1, 0, 0, -8]$ entre $2$ dan cociente $[1, 2, 4]$, es decir $(x - 2)(x^2 + 2x + 4)$.',
          simple: 'Si ya sabes qué número vuelve cero al polinomio, la división sintética saca el factor $(x - r)$ automáticamente sin memorizar fórmulas.'
        },
        {
          badge: 'Forma 4 · Completar cuadrados',
          title: 'Transformar a $(x + h)^2 - k^2$ para usar diferencia de cuadrados',
          when: 'Cuando un trinomio no tiene números enteros fáciles para tantear.',
          idea: 'Completa el cuadrado sumando y restando $(b/2)^2$ para convertirlo en resta de cuadrados.',
          steps: [
            'Toma la mitad del coeficiente lineal y elévala al cuadrado: suma y resta $(b/2)^2$.',
            'Agrupa el TCP $(x + b/2)^2$ y deja fuera la constante resultante.',
            'Si queda resta, factoriza como diferencia de cuadrados $A^2 - B^2 = (A-B)(A+B)$.'
          ],
          miniExample: '$x^2 + 4x - 5 = (x^2 + 4x + 4) - 9 = (x + 2)^2 - 3^2 = (x + 2 - 3)(x + 2 + 3) = (x - 1)(x + 5)$.',
          simple: 'Aunque no se te ocurran los dos números al principio, completar el cuadrado siempre revela la factorización exacta.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Multiplicamos $6 \\times (-3) = -18$ y buscamos dos números que multiplicados den $-18$ y restados den $+7$ ($9$ y $-2$). Partimos el $7x$ en $9x - 2x$ y sacamos factor común de cada pareja.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Multiplicar y dividir por a',
              title: 'Fórmula rápida $\\frac{(6x + p)(6x + q)}{6}$',
              when: 'Alternativa muy mecánica y rápida sin pasos de agrupación.',
              steps: [
                'Como $a \\cdot c = 6(-3) = -18$ y $9 + (-2) = 7$, colocamos $6x$ en ambos paréntesis: $\\frac{(6x + 9)(6x - 2)}{6}$.',
                'Sacamos $3$ del primer factor y $2$ del segundo: $\\frac{3(2x + 3) \\cdot 2(3x - 1)}{6}$.',
                'Cancelamos $3 \\cdot 2 = 6$ con el denominador: $(2x + 3)(3x - 1)$.'
              ],
              result: '$(2x + 3)(3x - 1)$',
              simple: 'Pones $(6x+9)(6x-2)$ y simplemente divides entre $6$ simplificando mitades y terceras.'
            },
            {
              badge: 'Método 3 · Tijera / Aspa simple',
              title: 'Descomposición cruzada directa',
              when: 'Útil cuando los coeficientes son pequeños.',
              steps: [
                'Descompón $6x^2 = (2x)(3x)$ y $-3 = (+3)(-1)$.',
                'Verifica el cruce: $(2x)(-1) + (3x)(3) = -2x + 9x = +7x$ (coincide).',
                'Lee horizontalmente: $(2x + 3)(3x - 1)$.'
              ],
              result: '$(2x + 3)(3x - 1)$',
              simple: 'Pruebas dos parejas que den la punta izquierda y la derecha hasta que su cruce sume el término central.'
            }
          ]
        },
        {
          simple: 'Arriba aplicas diferencia de cubos a $x^3 - 2^3$ para sacar $(x - 2)(x^2 + 2x + 4)$ y abajo diferencia de cuadrados en $x^2 - 4 = (x - 2)(x + 2)$; al cancelar $(x - 2)$ queda $\\frac{x^2 + 2x + 4}{x + 2}$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · División sintética (Ruffini)',
              title: 'Dividir numerador y denominador entre $(x - 2)$ por tabla',
              when: 'Útil si olvidaste la fórmula de diferencia de cubos.',
              steps: [
                'En el numerador $[1, 0, 0, -8]$ entre $r = 2$: da cociente $x^2 + 2x + 4$, luego $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$.',
                'En el denominador $[1, 0, -4]$ entre $r = 2$: da cociente $x + 2$, luego $x^2 - 4 = (x - 2)(x + 2)$.',
                'Cancela $(x - 2)$ para $x \\neq 2$: queda $\\frac{x^2 + 2x + 4}{x + 2}$ ($x \\neq \\pm 2$).'
              ],
              result: '$\\frac{x^2 + 2x + 4}{x + 2}$ ($x \\neq \\pm 2$)',
              simple: 'La tabla de Ruffini te reconstruye $(x^2+2x+4)$ arriba y $(x+2)$ abajo sin tener que memorizar ninguna fórmula.'
            }
          ]
        },
        {
          simple: 'Como $x^4 = (x^2)^2$ y $16 = 4^2$, primero abres una diferencia de cuadrados en $(x^2 - 4)(x^2 + 4)$; el paréntesis con suma ya no se parte en los reales, y el de resta vuelve a abrirse como $(x - 2)(x + 2)$, revelando las raíces reales $x = 2$ y $x = -2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Teorema de Raíces + Ruffini y Agrupación',
              title: 'Evaluar $x = \\pm 2$ y bajar grado $4 \\to 3$ por división sintética',
              when: 'Alternativa útil cuando prefieres probar ceros enteros del polinomio.',
              steps: [
                'Prueba divisores de $16$: para $x = 2$, $P(2) = 16 - 16 = 0 \\implies (x - 2)$ divide exacto a $x^4 - 16$.',
                'Divide sintéticamente $[1, 0, 0, 0, -16]$ entre $r = 2$: cociente $x^3 + 2x^2 + 4x + 8$.',
                'Agrupa de dos en dos el cociente: $x^2(x + 2) + 4(x + 2) = (x + 2)(x^2 + 4)$, resultando $P(x) = (x - 2)(x + 2)(x^2 + 4)$ con únicas raíces reales $x = \\pm 2$.'
              ],
              result: '$(x - 2)(x + 2)(x^2 + 4)$; raíces reales $x = 2, -2$',
              simple: 'Como $2^4 = 16$, sabes al instante que $x=2$ anula el polinomio; divides por Ruffini y agrupas el resto en $(x+2)(x^2+4)$.'
            }
          ]
        }
      ]
    },
    'alg-2': {
      simpleIntro: 'Racionalizar es multiplicar arriba y abajo por un "espejo" (el conjugado) que elimina raíces cuadradas molestas. En cálculo sirve para destrabar límites $0/0$ donde la raíz no te dejaba cancelar.',
      simplePrereqs: 'Recuerda que $(\\sqrt{a})^2 = a$ (para $a \\ge 0$) y que $(A - B)(A + B) = A^2 - B^2$ elimina las dos raíces al cuadrado sin dejar términos mixtos.',
      detailedSimple: [
        'Si una raíz está sola abajo, basta multiplicarla por sí misma arriba y abajo para completar su cuadrado.',
        'Si hay una raíz sumada o restada a otro número, multiplicas arriba y abajo por el mismo par pero con el signo del centro invertido (conjugado): así el cuadrado elimina la raíz.',
        'Regla clave en límites: expande SOLO el lado donde están los conjugados; el otro lado déjalo quieto en paréntesis porque ahí está el factor que quieres cancelar.'
      ],
      conceptsSimple: [
        'El conjugado cambia únicamente el signo que separa los dos términos de afuera, nunca toca lo que vive dentro de la raíz.',
        'Racionalizar abajo limpia denominadores con raíces; en cálculo solemos hacer exactamente lo contrario: limpiar el numerador para destapar factores escondidos.',
        'Multiplicar una raíz abajo por sí misma desaparece la raíz al instante porque $(\\sqrt{a})^2 = a$.'
      ],
      theoremsSimple: [
        'Como multiplicas arriba y abajo por exactamente la misma cantidad distinta de cero, estás multiplicando por $1$; cambias cómo se ve la fracción, pero vale lo mismo.'
      ],
      formulasSimple: [
        'El producto de un binomio por su conjugado siempre eleva al cuadrado la primera parte menos el cuadrado de la segunda: las raíces desaparecen.'
      ],
      mistakesSimple: [
        'Para $\\sqrt{x+4} - 2$, el conjugado cambia el $-2$ por $+2$ (da $\\sqrt{x+4} + 2$), nunca $\\sqrt{x-4} + 2$.',
        'Cuando restes la parte de la segunda raíz, envuélvela entre paréntesis para que el signo menos afecte a todos sus términos.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Conjugado clásico',
          title: 'Multiplicar por el conjugado arriba y abajo (sin expandir la pareja opuesta)',
          when: 'El método estándar para $\\sqrt{A} \\pm B$ o $\\sqrt{A} \\pm \\sqrt{B}$.',
          idea: 'Multiplica arriba y abajo por el conjugado; aplica $(u - v)(u + v) = u^2 - v^2$ en el lado de la raíz y deja el otro lado factorizado.',
          steps: [
            'Forma el conjugado cambiando solo el signo entre los dos términos.',
            'Multiplica por $\\frac{\\text{Conjugado}}{\\text{Conjugado}}$ dejando indicado el producto en el lado sin conjugados.',
            'Eleva al cuadrado las raíces del lado conjugado, simplifica términos semejantes y cancela el factor común.'
          ],
          miniExample: '$\\frac{\\sqrt{x+1} - 1}{x} \\cdot \\frac{\\sqrt{x+1} + 1}{\\sqrt{x+1} + 1} = \\frac{(x+1) - 1}{x(\\sqrt{x+1} + 1)} = \\frac{1}{\\sqrt{x+1} + 1}$.',
          simple: 'Solo desarrollas el producto de los gemelos con signo cambiado; el otro piso se queda quieto esperando la cancelación.'
        },
        {
          badge: 'Forma 2 · Cambio de variable',
          title: 'Sustitución auxiliar $u = \\sqrt{\\dots}$ para transformar raíces en polinomios',
          when: 'Brillante en límites $0/0$ o fracciones con $\\sqrt{x}$ y $x$ mezcladas (o incluso raíces cúbicas).',
          idea: 'Si llamas $u = \\sqrt{x+9}$ entonces $x = u^2 - 9$, eliminando todas las raíces para usar simple factorización de polinomios.',
          steps: [
            'Define $u = \\sqrt{g(x)}$ y despeja $x$ en términos de $u$ elevando al cuadrado.',
            'Sustituye $x$ y $\\sqrt{g(x)}$ en toda la fracción.',
            'Factoriza el polinomio resultante y simplifica el factor común (luego regresa $u$ a $\\sqrt{g(x)}$).'
          ],
          miniExample: 'En $\\frac{\\sqrt{x+9}-3}{x}$, haz $u=\\sqrt{x+9}$ ($x=u^2-9$): queda $\\frac{u-3}{(u-3)(u+3)} = \\frac{1}{u+3} = \\frac{1}{\\sqrt{x+9}+3}$.',
          simple: 'Bautizar la raíz como $u$ desaparece las raíces al instante y te deja factorizar como en álgebra normal.'
        },
        {
          badge: 'Forma 3 · Diferencia de cubos y factorización inversa',
          title: 'Factor racionalizador cúbico $(a^2 + ab + b^2)$ y descomposición $A - B = (\\sqrt{A}-\\sqrt{B})(\\sqrt{A}+\\sqrt{B})$',
          when: 'Cuando aparecen raíces cúbicas ($\\sqrt[3]{x} - 2$) o cuando prefieres factorizar el denominador en lugar de multiplicar arriba y abajo.',
          idea: 'Para raíces cúbicas multiplicas por $(a^2 \\pm ab + b^2)$ aprovechando $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$; para raíces cuadradas puedes ver $x - a$ directo como $(\\sqrt{x}-\\sqrt{a})(\\sqrt{x}+\\sqrt{a})$.',
          steps: [
            'En raíces cúbicas ($a - b$): identifica $a = \\sqrt[3]{\\dots}$ y multiplica arriba y abajo por $a^2 + ab + b^2$.',
            'En cocientes $\\frac{\\sqrt{x}-\\sqrt{a}}{x-a}$: factoriza el denominador como diferencia de cuadrados $(\\sqrt{x}-\\sqrt{a})(\\sqrt{x}+\\sqrt{a})$ y tacha directo.'
          ],
          miniExample: '$\\frac{6}{\\sqrt{7}-2} = \\frac{2(7-4)}{\\sqrt{7}-2} = \\frac{2(\\sqrt{7}-2)(\\sqrt{7}+2)}{\\sqrt{7}-2} = 2(\\sqrt{7}+2)$.',
          simple: 'También puedes desarmar un número normal como diferencia de cuadrados con raíces para cancelar de golpe en un solo paso.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Para sacar la raíz de abajo, multiplicamos por $\\sqrt{7} + 2$ arriba y abajo; abajo $(\\sqrt{7})^2 - 2^2 = 7 - 4 = 3$, que simplifica al $6$ de arriba dejando $2(\\sqrt{7}+2)$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Diferencia de cuadrados al revés',
              title: 'Reescribir el 3 implícito y factorizar el numerador',
              when: 'Para comprobar mentalmente por qué $6/(\\sqrt{7}-2) = 2(\\sqrt{7}+2)$.',
              steps: [
                'Observa que $7 - 4 = 3$, por lo tanto $6 = 2 \\cdot (7 - 4) = 2(\\sqrt{7} - 2)(\\sqrt{7} + 2)$.',
                'Sustituye arriba: $\\frac{2(\\sqrt{7} - 2)(\\sqrt{7} + 2)}{\\sqrt{7} - 2} = 2(\\sqrt{7} + 2)$.'
              ],
              result: '$2\\sqrt{7} + 4$',
              simple: 'Puedes ver el número de arriba ($6$) como un múltiplo de $(\\sqrt{7}-2)(\\sqrt{7}+2)$ y cancelarlo directo.'
            }
          ]
        },
        {
          simple: 'Multiplicamos arriba y abajo por $\\sqrt{x+9} + 3$ para quitar la raíz del techo; el $9$ se va con $-9$, queda una $x$ libre arriba y se cancela con la $x$ del piso.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Sustitución u = √(x + 9)',
              title: 'Transformar a cociente polinomial',
              when: 'Muy útil cuando aparecen también potencias enteras de $x$ en el denominador.',
              steps: [
                'Sea $u = \\sqrt{x + 9} \\implies u^2 = x + 9 \\implies x = u^2 - 9$ ($u \\neq 3$).',
                'Reemplaza en la fracción: $\\frac{u - 3}{u^2 - 9} = \\frac{u - 3}{(u - 3)(u + 3)} = \\frac{1}{u + 3}$.',
                'Vuelve a $x$: $\\frac{1}{\\sqrt{x + 9} + 3}$.'
              ],
              result: '$\\frac{1}{\\sqrt{x + 9} + 3}$',
              simple: 'Con $u = \\sqrt{x+9}$ se convierte en $\\frac{u-3}{u^2-9}$, que es una diferencia de cuadrados de primaria.'
            }
          ]
        },
        {
          simple: 'Con dos raíces restándose, el conjugado es la suma de esas mismas dos raíces; arriba las raíces desaparecen dando $(x + 1) - (3x - 1) = -2(x - 1)$ y el factor $(x - 1)$ se cancela con el de abajo.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Verificación numérica en x = 2',
              title: 'Comprobar que la racionalización conserva el valor exacto',
              when: 'Útil para verificar que ningún signo del paréntesis $-(3x - 1)$ se perdió al restar.',
              steps: [
                'Evalúa la original en $x = 2$: $\\frac{\\sqrt{3} - \\sqrt{5}}{2 - 1} = \\sqrt{3} - \\sqrt{5} \\approx -0.5040$.',
                'Evalúa la simplificada en $x = 2$: $\\frac{-2}{\\sqrt{3} + \\sqrt{5}} = \\frac{-2(\\sqrt{3}-\\sqrt{5})}{3 - 5} = \\sqrt{3} - \\sqrt{5}$. ¡Idéntico!'
              ],
              result: '$\\frac{-2}{\\sqrt{x + 1} + \\sqrt{3x - 1}}$',
              simple: 'Evaluar un número válido como $x = 2$ (donde $x+1=3$ y $3x-1=5$) comprueba en 10 segundos que el $-2$ y los signos dentro de las raíces son exactos.'
            }
          ]
        }
      ]
    },
    'alg-3': {
      simpleIntro: 'Resolver una ecuación es hallar qué número o pareja de números hacen verdadera una balanza; en Cálculo lo usarás todo el tiempo para hallar cortes con el eje $X$, intersecciones entre curvas y puntos críticos donde $f\'(x)=0$.',
      simplePrereqs: 'Basta saber despejar $x$ moviendo operaciones contrarias al otro lado y respetar las reglas de signos.',
      detailedSimple: [
        'Para una ecuación con $x^2$, intenta primero factorizar porque toma segundos; si no sale rápido, pasa directo a la fórmula general o completa el cuadrado.',
        'La fórmula general siempre funciona y lo que está dentro de la raíz ($b^2 - 4ac$) te avisa cuántas soluciones reales hay antes siquiera de terminar.'
      ],
      conceptsSimple: [
        'El discriminante es el "termómetro" dentro de la raíz: positivo significa 2 respuestas, cero significa 1 respuesta repetida y negativo avisa que no hay respuesta en los números reales.',
        'En sistemas 2×2 buscas un solo par $(x, y)$ que cumpla ambas ecuaciones a la vez: geométricamente es el punto donde se chocan dos rectas.'
      ],
      theoremsSimple: [
        'La fórmula general no cayó del cielo: viene de juntar $ax^2+bx+c=0$ formando un cuadrado perfecto y despejar la $x$ una vez para siempre.'
      ],
      formulasSimple: [
        'Solo mete los coeficientes $a, b, c$ con todo y su signo en la fórmula general; además, la suma y multiplicación de las dos raíces te dejan comprobarlas sin rehacer la operación.'
      ],
      mistakesSimple: [
        'Como la fórmula dice $-b$, si $b$ ya es negativo (ej. $-7$), entonces $-(-7)$ se vuelve $+7$ positivo al frente.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Factorización y raíces',
          title: 'Factorización rápida (Producto Cero $A \\cdot B = 0$)',
          when: 'La primera opción en ecuaciones cuadráticas si sus coeficientes son enteros pequeños.',
          idea: 'Si dos cosas multiplicadas dan cero, al menos una debe valer cero; igualas cada paréntesis a cero por separado.',
          steps: [
            'Lleva todo a un lado dejando $= 0$.',
            'Factoriza en $(px + m)(qx + n) = 0$.',
            'Resuelve cada ecuación lineal $px + m = 0$ y $qx + n = 0$.'
          ],
          miniExample: '$2x^2 - 7x + 3 = (2x - 1)(x - 3) = 0 \\implies x = \\frac{1}{2}$ o $x = 3$.',
          simple: 'Si logras partir la cuadrática en dos paréntesis igualados a cero, ya prácticamente terminaste.'
        },
        {
          badge: 'Forma 2 · Fórmula General / TCP',
          title: 'Fórmula cuadrática universal o completar cuadrados',
          when: 'Cuando la ecuación no factoriza con enteros o las raíces llevan radicales.',
          idea: 'Identifica $(a, b, c)$ y sustituye en $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$, o completa el cuadrado.',
          steps: [
            'Ordena como $ax^2 + bx + c = 0$ y lee $a, b, c$ con signo.',
            'Evalúa primero $\\Delta = b^2 - 4ac$.',
            'Aplica $-b \\pm \\sqrt{\\Delta}$ dividido entre $2a$ (o usa $(x+\\frac{b}{2a})^2 = \\frac{\\Delta}{4a^2}$).'
          ],
          miniExample: 'Para $x^2 - 6x + 4 = 0$: $(x-3)^2 = 5 \\implies x = 3 \\pm \\sqrt{5}$.',
          simple: 'Completar el cuadrado o usar la fórmula general nunca falla, aunque la respuesta lleve raíces cuadradas.'
        },
        {
          badge: 'Forma 3 · Sistemas 2×2',
          title: 'Reducción (Eliminación), Sustitución, Igualación y Cramer',
          when: 'Para sistemas de dos ecuaciones lineales con dos incógnitas.',
          idea: 'Reducción elimina una letra sumando ecuaciones; Sustitución despeja una y la mete en la otra; Cramer usa determinantes $2\\times 2$ en un paso.',
          steps: [
            'Reducción: iguala los coeficientes de una letra con signos opuestos y suma verticalmente.',
            'Sustitución: si una letra tiene coeficiente $1$ o $-1$, despéjala e insértala en la otra ecuación.',
            'Cramer: calcula $D = a_1 b_2 - a_2 b_1$ y halla $x = D_x / D$, $y = D_y / D$.'
          ],
          miniExample: 'Con $3x+2y=16, 5x-2y=8$, sumar directo da $8x = 24 \\implies x=3$.',
          simple: 'Elige sustitución si ves una $x$ o $y$ solita, reducción si ves números opuestos para cancelar sumando, o determinantes si quieres fórmula directa.'
        },
        {
          badge: 'Forma 4 · Verificación Vieta / Gráfica',
          title: 'Comprobación instantánea con suma/producto y vértice',
          when: 'Para asegurarte al 100% de tus raíces en cualquier examen.',
          idea: 'Comprueba $x_1 + x_2 = -b/a$ y $x_1 \\cdot x_2 = c/a$ en segundos.',
          steps: [
            'Suma tus dos soluciones y verifica que igualen a $-b/a$.',
            'Multiplícalas y verifica que igualen a $c/a$.'
          ],
          miniExample: 'Para $2x^2 - 7x + 3$: $\\frac{1}{2} + 3 = \\frac{7}{2} = -(-7)/2$ y $\\frac{1}{2}\\cdot 3 = \\frac{3}{2}$. ¡Exacto!',
          simple: 'Sumar y multiplicar tus respuestas y compararlas con los números originales es el detector de errores más rápido que existe.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Aplicamos $a=2, b=-7, c=3$ en la fórmula general; como $\\Delta = 25$ es cuadrado perfecto, salen dos soluciones exactas: $3$ y $1/2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Factorización directa',
              title: 'Descomposición en $(2x - 1)(x - 3) = 0$',
              when: 'Mucho más rápida cuando el discriminante es cuadrado perfecto.',
              steps: [
                'Busca dos números que sumen $-7$ y cuyo producto sea $2 \\cdot 3 = 6$: $-6$ y $-1$.',
                'Reescribe: $2x^2 - 6x - x + 3 = 2x(x - 3) - 1(x - 3) = (2x - 1)(x - 3) = 0$.',
                'Iguala cada factor a $0$: $x_1 = \\frac{1}{2}$, $x_2 = 3$.'
              ],
              result: '$x_1 = 3$, $x_2 = \\frac{1}{2}$',
              simple: 'Factorizando salen los dos números en apenas dos líneas.'
            },
            {
              badge: 'Método 3 · Completando el cuadrado',
              title: 'Dividir entre 2 y formar binomio al cuadrado',
              when: 'Muestra explícitamente la simetría alrededor del vértice $x = 7/4$.',
              steps: [
                'Divide entre 2: $x^2 - \\frac{7}{2}x = -\\frac{3}{2}$.',
                'Suma $\\left(\\frac{7}{4}\\right)^2 = \\frac{49}{16}$ en ambos lados: $\\left(x - \\frac{7}{4}\\right)^2 = \\frac{25}{16}$.',
                'Saca raíz: $x = \\frac{7}{4} \\pm \\frac{5}{4} \\implies x_1 = 3, \\; x_2 = \\frac{1}{2}$.'
              ],
              result: '$x_1 = 3$, $x_2 = \\frac{1}{2}$',
              simple: 'Aíslas el cuadrado perfecto para despejar $x$ usando una simple raíz cuadrada.'
            }
          ]
        },
        {
          simple: 'Como la primera ecuación tiene $+2y$ y la segunda $-y$, multiplicamos la segunda por $2$ para convertirla en $-2y$; al sumar desaparece la $y$ quedando $7x = 28 \\implies x = 4$, y al regresar obtenemos $y = 2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Regla de Cramer (Determinantes 2×2)',
              title: 'Cálculo directo mediante determinantes',
              when: 'Útil cuando el sistema tiene coeficientes que no son fáciles de eliminar o en programas.',
              steps: [
                '$D = 3(-1) - 2(2) = -3 - 4 = -7$.',
                '$D_x = 16(-1) - 6(2) = -16 - 12 = -28 \\implies x = \\frac{-28}{-7} = 4$.',
                '$D_y = 3(6) - 2(16) = 18 - 32 = -14 \\implies y = \\frac{-14}{-7} = 2$.'
              ],
              result: '$(x, y) = (4, 2)$',
              simple: 'Con Cramer haces tres restas de multiplicaciones en cruz y te da $x$ e $y$ de inmediato sin sustituir nada.'
            },
            {
              badge: 'Método 3 · Sustitución directa despejando y',
              title: 'Despejar $y = 2x - 6$ en la segunda ecuación',
              when: 'Ideal porque aquí $y$ tiene coeficiente $-1$ y queda sin fracciones.',
              steps: [
                'De $2x - y = 6$ despeja $y = 2x - 6$.',
                'Sustituye en la primera: $3x + 2(2x - 6) = 16 \\implies 7x - 12 = 16 \\implies 7x = 28 \\implies x = 4$.',
                'Evalúa $y = 2(4) - 6 = 2$.'
              ],
              result: '$(x, y) = (4, 2)$',
              simple: 'Como la $y$ de abajo está sola con signo menos, la despejas en un segundo ($y = 2x - 6$) y la metes en la de arriba.'
            }
          ]
        },
        {
          simple: 'El discriminante da exactamente $0$, señal de que toda la cuadrática es un binomio al cuadrado perfecto $(3x-2)^2=0$. Su parábola apenas besa al eje $X$ en un único punto ($x=2/3$) sin cruzarlo hacia abajo.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Fórmula cuadrática directa',
              title: 'Usar $x = \\frac{-b \\pm \\sqrt{0}}{2a}$ cuando no ves el TCP a ojo',
              when: 'Para comprobar en segundos sin factorizar.',
              steps: [
                'Sustituye $a=9, b=-12, c=4$: $x = \\frac{12 \\pm \\sqrt{(-12)^2 - 4(9)(4)}}{2(9)} = \\frac{12 \\pm 0}{18} = \\frac{2}{3}$.',
                'Vértice coincide en $x = -b/(2a) = 12/18 = 2/3$ con altura $f(2/3) = 0$.'
              ],
              result: '$x = \\frac{2}{3}$ (raíz doble)',
              simple: 'Cuando lo de adentro de la raíz da $0$, las dos soluciones $\\pm$ se colapsan en un solo punto que coincide justo con el vértice $-b/(2a)$.'
            }
          ]
        }
      ]
    },
    'geo-1': {
      simpleIntro: 'La geometría traduce longitudes, alturas, áreas y volúmenes en fórmulas que luego usarás para maximizar latas, cercas o cajas en Cálculo.',
      simplePrereqs: 'Solo necesitas recordar que el área mide cuadrados ($\\text{cm}^2$) en una superficie plana y el volumen mide cubos ($\\text{cm}^3$) en un cuerpo 3D.',
      detailedSimple: [
        'En un triángulo con esquina de $90^\\circ$, los dos lados que forman esa L se elevan al cuadrado y sumados siempre igualan al lado inclinado más largo al cuadrado.',
        'Los volúmenes de prismas o cilindros son simplemente "área del piso multiplicada por la altura"; si termina en pico (cono o pirámide) tomas la tercera parte.'
      ],
      conceptsSimple: [
        'Pitágoras te deja hallar el tercer lado sabiendo dos cualesquiera de un triángulo rectángulo.',
        'Las áreas de rectángulo, triángulo y círculo son los bloques básicos para construir casi cualquier superficie más compleja.',
        'En problemas de optimización, primero dibujas la caja o cilindro y relacionas su área de material con su volumen.'
      ],
      theoremsSimple: [
        'Si metes cuatro copias iguales de un triángulo rectángulo dentro de un cuadrado grande, el espacio vacío del centro es un cuadrado de área $c^2$; comparando las áreas ves por qué $a^2+b^2=c^2$.'
      ],
      formulasSimple: [
        'Para un círculo usas $\\pi r^2$ como área; si le das altura $h$, obtienes el cilindro $\\pi r^2 h$; para cualquier triángulo rectángulo la hipotenusa $c$ siempre va sola de un lado en $a^2 + b^2 = c^2$.'
      ],
      mistakesSimple: [
        'Una raíz cuadrada NO se puede repartir sobre una suma: calcula primero $3^2 + 4^2 = 25$ antes de sacar raíz para obtener $5$, jamás saques raíz a $3^2$ y $4^2$ por separado.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Ternas pitagóricas',
          title: 'Reconocimiento rápido de ternas enteras ($3$-$4$-$5$, $5$-$12$-$13$, $8$-$15$-$17$)',
          when: 'Ahorra muchísimo tiempo en exámenes con triángulos rectángulos de medidas enteras o múltiplos.',
          idea: 'Si identificas la proporción básica o un múltiplo de una terna conocida, obtienes el lado faltante de inmediato sin calcular raíces grandes.',
          steps: [
            'Divide los dos lados conocidos por su MCD para ver si caen en $(3,4,5)$ o $(5,12,13)$.',
            'Deduce el tercer elemento de la terna.',
            'Multiplica nuevamente por el MCD para volver a la escala real.'
          ],
          miniExample: 'Hipotenusa $26$ y cateto $10$: divide entre $2 \\implies (13, 5)$, falta $12 \\implies 12\\times 2 = 24$.',
          simple: 'Casi todos los triángulos rectángulos escolares esconden versiones escaladas de $3$-$4$-$5$ o $5$-$12$-$13$.'
        },
        {
          badge: 'Forma 2 · Diferencia de cuadrados en Pitágoras',
          title: 'Calcular $\\sqrt{c^2 - a^2}$ factorizando $(c - a)(c + a)$',
          when: 'Excelente cuando $c$ y $a$ son números grandes y haces cálculos sin calculadora.',
          idea: 'En vez de calcular $25^2 - 24^2 = 625 - 576$, usas $(25-24)(25+24) = 1 \\cdot 49 = 49$.',
          steps: [
            'Escribe $b^2 = c^2 - a^2 = (c - a)(c + a)$.',
            'Calcula la resta y la suma (números mucho menores) y multiplícalos.',
            'Saca la raíz cuadrada del resultado.'
          ],
          miniExample: '$c=13, a=5 \\implies b^2 = (13-5)(13+5) = 8 \\cdot 18 = 144 \\implies b = 12$.',
          simple: 'Usar $(c-a)(c+a)$ reemplaza elevar números enormes al cuadrado por una multiplicación facilita.'
        },
        {
          badge: 'Forma 3 · Herón vs. Altura',
          title: 'Área con fórmula de Herón vs. descomposición por altura',
          when: 'Cuando conoces los 3 lados de un triángulo cualquiera y no tienes ningún ángulo.',
          idea: 'Herón calcula el área directamente desde el semiperímetro $s$; alternativamente trazas una altura y aplicas Pitágoras en los dos triángulos rectángulos.',
          steps: [
            'Con Herón: calcula $s = \\frac{a+b+c}{2}$ y luego $A = \\sqrt{s(s-a)(s-b)(s-c)}$.',
            'Con altura: parte la base en $x$ y $c-x$, iguala $h^2 = a^2 - x^2 = b^2 - (c-x)^2$ y saca $h$.'
          ],
          miniExample: 'Con lados $13, 14, 15$, $s=21 \\implies A = \\sqrt{21\\cdot 8\\cdot 7\\cdot 6} = 84$.',
          simple: 'Herón evita buscar ángulos o alturas; solo promedias la mitad del perímetro y multiplicas cuatro numeritos bajo la raíz.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Como conoces la hipotenusa ($13$) y un cateto ($5$), restas los cuadrados ($169 - 25 = 144$) y sacas raíz ($12$) antes de multiplicar base por altura entre $2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Diferencia de cuadrados',
              title: 'Calcular $b^2 = (13 - 5)(13 + 5)$ sin cuadrados grandes',
              when: 'Atajo limpio para calcular catetos mentalmente.',
              steps: [
                '$b^2 = (13 - 5)(13 + 5) = 8 \\cdot 18 = 144$.',
                'Saca raíz: $b = 12\\text{ cm}$.',
                'Área: $A = \\frac{5 \\cdot 12}{2} = 30\\text{ cm}^2$.'
              ],
              result: 'Cateto $b = 12\\text{ cm}$, Área $= 30\\text{ cm}^2$',
              simple: 'Restar y sumar $13$ con $5$ ($8 \\times 18$) evita elevar al cuadrado números grandes.'
            }
          ]
        },
        {
          simple: 'Para la esfera solo metes el radio al cubo en $\\frac{4}{3}\\pi r^3$; para el cilindro multiplicas el área del círculo base por su altura y sumas las dos tapas si buscas la superficie.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Comparación relativa de volúmenes (Arquímedes)',
              title: 'Relación $2:3$ entre esfera y cilindro circunscrito',
              when: 'Curiosidad geométrica útil para comprobar órdenes de magnitud.',
              steps: [
                'Un cilindro que abraza justo a una esfera de radio $r=3$ tiene altura $h = 2r = 6$ y volumen $\\pi(9)(6) = 54\\pi$.',
                'La esfera siempre ocupa exactamente $\\frac{2}{3}$ de ese cilindro: $\\frac{2}{3}(54\\pi) = 36\\pi\\text{ cm}^3$.'
              ],
              result: '$V_{\\text{esf}} = 36\\pi\\text{ cm}^3$',
              simple: 'Arquímedes demostró que cualquier esfera ocupa exactamente dos terceras partes de la lata cilíndrica en la que encaja justo.'
            }
          ]
        },
        {
          simple: 'Calculas primero la mitad del perímetro ($s=21$), multiplicas $21(21-13)(21-14)(21-15)$ y le sacas raíz ($84$); una vez sabes el área, despejas la altura dividiendo el doble del área entre la base.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Dos triángulos rectángulos (Pitágoras)',
              title: 'Dividir la base $b = 14$ usando la altura $h$',
              when: 'Si no recuerdas la fórmula de Herón y conoces las ternas pitagóricas.',
              steps: [
                'Parte la base $14$ en $x$ y $14 - x$. Igualando $h^2$: $13^2 - x^2 = 15^2 - (14 - x)^2$.',
                'Simplifica: $169 - x^2 = 225 - (196 - 28x + x^2) \\implies 169 = 29 + 28x \\implies x = 5$.',
                'Entonces $h = \\sqrt{13^2 - 5^2} = 12$ (terna $5$-$12$-$13$ a la izquierda y $9$-$12$-$15$ a la derecha), y $A = \\frac{14 \\cdot 12}{2} = 84$.'
              ],
              result: 'Área $= 84\\text{ cm}^2$, Altura $= 12\\text{ cm}$',
              simple: 'El triángulo $13\\text{-}14\\text{-}15$ está pegado por dos triángulos rectángulos famosos: uno $5\\text{-}12\\text{-}13$ y otro $9\\text{-}12\\text{-}15$ compartiendo altura $12$.'
            }
          ]
        }
      ]
    },
    'geo-2': {
      simpleIntro: 'La Geometría Analítica conecta dibujos geométricos con álgebra usando coordenadas $(x, y)$. Saber armar rectas punto-pendiente y rectas perpendiculares es literalmente la segunda mitad de todo problema de recta tangente y normal en Derivadas.',
      simplePrereqs: 'Solo necesitas saber ubicar puntos $(x, y)$ en el plano y restar coordenadas manteniendo siempre el mismo orden.',
      detailedSimple: [
        'La pendiente es qué tanto sube o baja una recta por cada paso que avanzas a la derecha; con un punto y la inclinación ya puedes escribir su ecuación al instante.',
        'Dos rectas forman ángulo de $90^\\circ$ si una sube mientras la otra baja en la proporción exactamente volteada y con signo cambiado.'
      ],
      conceptsSimple: [
        'La ecuación punto-pendiente es el molde favorito del cálculo porque en derivadas conoces justo el punto $(x_0, f(x_0))$ y la pendiente $f\'(x_0)$.',
        'Para sacar la pendiente perpendicular a una dada, solo volteas la fracción y le cambias el signo.'
      ],
      theoremsSimple: [
        'Al girar un triángulo rectángulo $90^\\circ$, el escalón horizontal y el escalón vertical intercambian lugares y uno invierte sentido; por eso las pendientes multiplican $-1$.'
      ],
      formulasSimple: [
        'Distancia viene directo de Pitágoras; pendiente es "lo que sube dividido entre lo que avanza".'
      ],
      mistakesSimple: [
        'Si arriba restas $y_2 - y_1$, abajo estás obligado a restar $x_2 - x_1$ en el mismo sentido; si cruzas el orden, la subida se vuelve bajada por error.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Punto-Pendiente',
          title: 'Molde $y - y_0 = m(x - x_0)$',
          when: 'El método rey cuando ya tienes la pendiente $m$ (o la derivada $f\'(x_0)$) y un punto de paso.',
          idea: 'Sustituye directo el punto y la pendiente; si te piden forma explícita, solo distribuye y pasa $y_0$ sumando.',
          steps: [
            'Calcula $m = \\frac{y_2 - y_1}{x_2 - x_1}$ si te dan dos puntos.',
            'Inserta $(x_0, y_0)$ y $m$ en $y - y_0 = m(x - x_0)$.',
            'Despeja $y$ para dejarla en $y = mx + b$ si el ejercicio lo pide.'
          ],
          miniExample: 'Punto $(1, 3)$, $m=2 \\implies y - 3 = 2(x - 1) \\implies y = 2x + 1$.',
          simple: 'En vez de buscar cuánto vale $b$, metes directo tu punto y tu pendiente en el molde y al final despejas $y$.'
        },
        {
          badge: 'Forma 2 · Despeje de b en y = mx + b',
          title: 'Pendiente-ordenada al origen ($y = mx + b$)',
          when: 'Útil para quienes prefieren trabajar siempre con $y = mx + b$ sin memorizar punto-pendiente.',
          idea: 'Halla $m$, reemplaza el punto $(x_0, y_0)$ dentro de $y = mx + b$ y despeja $b$.',
          steps: [
            'Calcula $m$.',
            'Sustituye $x_0, y_0, m$ en $y_0 = m x_0 + b$ para encontrar $b$.',
            'Escribe la ecuación final $y = mx + b$.'
          ],
          miniExample: 'Con $m = 2$ y punto $(1, 3)$: $3 = 2(1) + b \\implies b = 1 \\implies y = 2x + 1$.',
          simple: 'Metes $(x, y)$ como números temporales para descubrir el corte $b$ en el eje vertical.'
        },
        {
          badge: 'Forma 3 · Distancia mínima y forma general',
          title: 'Fórmula perpendicular $d = \\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}$ vs. minimización/intersección',
          when: 'Para distancias de un punto a una recta o mediatrices.',
          idea: 'Puedes aplicar la fórmula directa de forma general, O trazar la recta perpendicular desde $P_0$, hallar el choque y medir distancia.',
          steps: [
            'Fórmula rápida: ordena la recta como $Ax + By + C = 0$ y evalúa $\\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$.',
            'Comprobación geométrica: halla la perpendicular con $m_\\perp = -1/m$, intersecta ambas rectas y mide distancia entre los puntos.'
          ],
          miniExample: 'De $(4,5)$ a $3x-4y+8=0$: $\\frac{|12-20+8|}{\\sqrt{9+16}} = \\frac{0}{5} = 0$ (si da distinto de cero, esa es la distancia exacta).',
          simple: 'La fórmula general calcula la distancia en una sola línea sustituyendo el punto en la ecuación de la recta.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Primero medimos cuánto sube entre los dos puntos sobre cuánto avanza ($m=2$), y metemos uno de los puntos en $y - y_0 = m(x - x_0)$ para despejar $y$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Hallar b por sustitución directa',
              title: 'Usar $y = mx + b$ despejando la ordenada al origen',
              when: 'Alternativa directa sin usar la ecuación punto-pendiente.',
              steps: [
                'Calcula $m = \\frac{9 - 3}{4 - 1} = \\frac{6}{3} = 2$.',
                'Sustituye $A(1, 3)$ en $y = 2x + b$: $3 = 2(1) + b \\implies b = 1$.',
                'Escribe la ecuación: $y = 2x + 1$.'
              ],
              result: '$y = 2x + 1$',
              simple: 'Con $m=2$, pruebas el punto $(1, 3)$ en $y=2x+b$ y descubres al instante que $b=1$.'
            }
          ]
        },
        {
          simple: 'Calculamos la distancia con Pitágoras entre $(-2, 1)$ y $(4, 9)$ (da $10$); para la línea perpendicular que pasa justo por la mitad, usamos el punto medio $(1, 5)$ y la pendiente volteada con signo opuesto ($-3/4$).',
          alternativeMethods: [
            {
              badge: 'Método 2 · Igualdad de distancias (Lugar geométrico)',
              title: 'Plantear $d(X, P) = d(X, Q)$ directamente',
              when: 'Te ahorra calcular pendientes cuando solo quieres la ecuación de la mediatriz.',
              steps: [
                'Iguala distancias al cuadrado: $(x + 2)^2 + (y - 1)^2 = (x - 4)^2 + (y - 9)^2$.',
                'Expande y cancela $x^2$ e $y^2$: $4x - 2y + 5 = -8x - 18y + 97$.',
                'Agrupa: $12x + 16y = 92 \\implies 3x + 4y = 23 \\implies y = -\\frac{3}{4}x + \\frac{23}{4}$.'
              ],
              result: '$y = -\\frac{3}{4}x + \\frac{23}{4}$',
              simple: 'Como todo punto de la mediatriz está a la misma distancia de $P$ y de $Q$, igualar ambas distancias la genera automáticamente.'
            }
          ]
        },
        {
          simple: 'Usamos la fórmula directa de distancia punto-recta sustituyendo $(4, 5)$ en $3x+4y-12$ arriba y Pitágoras de $(3, 4)$ abajo ($5$), dando $4$. Luego trazamos la recta perpendicular que pasa por $(4, 5)$ para hallar el pie $Q(\\frac{8}{5}, \\frac{9}{5})$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Proyección vectorial sobre el vector normal',
              title: 'Moverte desde $P_0(4, 5)$ en dirección del vector normal $\\vec{n} = (3, 4)$ hasta caer en $L$',
              when: 'Sin memorizar ninguna fórmula de distancia: te da la distancia $d$ y el punto más cercano $Q$ a la vez.',
              steps: [
                'Lee el vector normal desde $3x + 4y - 12 = 0$: $\\vec{n} = (3, 4)$, con recta paramétrica perpendicular $Q(t) = (4 + 3t,\\; 5 + 4t)$.',
                'Sustituye $Q(t)$ en $L$: $3(4 + 3t) + 4(5 + 4t) - 12 = 0 \\implies 25t + 20 = 0 \\implies t = -\\frac{4}{5}$.',
                'Halla $Q = (4 - \\frac{12}{5},\\; 5 - \\frac{16}{5}) = (\\frac{8}{5},\\; \\frac{9}{5})$ y su longitud de salto $d = |t|\\|\\vec{n}\\| = \\frac{4}{5} \\cdot 5 = 4$.'
              ],
              result: '$d = 4\\text{ unidades}$, $Q\\left(\\frac{8}{5},\\; \\frac{9}{5}\\right)$',
              simple: 'Caminas en línea recta siguiendo la flecha perpendicular $(3, 4)$ desde $(4, 5)$ hasta chocar con la recta; el tamaño de ese paso es $4$.'
            }
          ]
        }
      ]
    },
    'trig-1': {
      simpleIntro: 'La trigonometría conecta ángulos con medidas de lados, y los radianes miden los ángulos usando la longitud real del arco de un círculo. En Cálculo todas las derivadas e integrales trigonométricas exigen obligatoriamente radianes.',
      simplePrereqs: 'Necesitas saber qué son cateto opuesto, cateto adyacente e hipotenusa respecto a un ángulo, y que media vuelta en círculo son $180^\\circ = \\pi\\text{ rad}$.',
      detailedSimple: [
        'Un radián ocurre cuando doblas un cordón del tamaño exacto del radio alrededor del borde del círculo; en medio círculo caben $\\pi$ (aprox. $3.1416$) radios.',
        'En el círculo de radio $1$, el $\\cos$ es simplemente qué tan a la derecha/izquierda está el punto ($x$) y el $\\operatorname{sen}$ qué tan arriba/abajo está ($y$).'
      ],
      conceptsSimple: [
        'SOH-CAH-TOA resume las tres razones: Seno = Opuesto/Hipotenusa, Coseno = Adyacente/Hipotenusa, Tangente = Opuesto/Adyacente.',
        'Cosecante, secante y cotangente son simplemente las tres primeras vueltas cabeza abajo.',
        'Los ángulos famosos ($30^\\circ, 45^\\circ, 60^\\circ$) son $\\pi/6, \\pi/4, \\pi/3$ en radianes y se calculan exacto sin decimales.'
      ],
      theoremsSimple: [
        'Una vuelta completa del círculo tiene circunferencia $2\\pi r$, así que siempre mide $2\\pi$ radianes independientemente del tamaño del radio.'
      ],
      formulasSimple: [
        'Regla de tres mental: $\\pi\\text{ rad} = 180^\\circ$. Para pasar a radianes multiplicas por $\\frac{\\pi}{180}$; para pasar a grados multiplicas por $\\frac{180}{\\pi}$.'
      ],
      mistakesSimple: [
        'Para no confundir recíprocas: las letras iniciales NUNCA coinciden consigo mismas; Seno va con Cosecante ($S \\leftrightarrow C$) y Coseno va con Secante ($C \\leftrightarrow S$).'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Triángulo de Pitágoras',
          title: 'Construir un triángulo rectángulo auxiliar para sacar las 6 razones',
          when: 'Cuando te dan el valor de UNA razón trigonométrica y necesitas las demás.',
          idea: 'Dibuja un triángulo rectángulo etiquetando los dos lados conocidos de la fracción, halla el tercero por Pitágoras y lee las 6 razones.',
          steps: [
            'Etiqueta los lados correspondientes según SOH-CAH-TOA.',
            'Halla el lado faltante con $a^2 + b^2 = c^2$.',
            'Ajusta los signos ($+$ o $-$) según el cuadrante si el ángulo pasa de $90^\\circ$.'
          ],
          miniExample: 'Si $\\operatorname{sen}\\theta = 8/17$: opuesto $=8$, hip $=17 \\implies \\text{ady} = \\sqrt{17^2-8^2} = 15 \\implies \\cos\\theta = 15/17$.',
          simple: 'Con un dibujito rápido del triángulo rectángulo encuentras todas las razones sin memorizar fórmulas trigonométricas.'
        },
        {
          badge: 'Forma 2 · Círculo Unitario y Referencia',
          title: 'Reducir ángulos de cuadrantes II, III y IV al primer cuadrante',
          when: 'Imprescindible para evaluar ángulos como $\\frac{4\\pi}{3}$, $\\frac{5\\pi}{6}$ o $\\frac{7\\pi}{4}$ sin calculadora.',
          idea: 'Calcula cuánto dista el ángulo del eje $X$ más cercano (ángulo de referencia), toma el valor exacto del primer cuadrante y ponle el signo $(x, y)$ del cuadrante.',
          steps: [
            'Ubica el cuadrante (I: $0..90^\\circ$, II: $90^\\circ..180^\\circ$, III: $180^\\circ..270^\\circ$, IV: $270^\\circ..360^\\circ$).',
            'Halla la distancia al eje horizontal $\\pi$ o $2\\pi$: ese es tu ángulo agudo equivalente.',
            'Aplica los signos por cuadrante ("Todas Sin TAcos": I Todas $+$, II Sen $+$, III Tan $+$, IV Cos $+$).'
          ],
          miniExample: '$4\\pi/3 = \\pi + \\pi/3$ está en cuadrante III (Tan $+$, Sen y Cos $-$), luego $\\cos(4\\pi/3) = -\\cos(\\pi/3) = -1/2$.',
          simple: 'Todo ángulo grande copia los mismos números que $30^\\circ, 45^\\circ$ o $60^\\circ$; el cuadrante solo decide si lleva signo positivo o negativo.'
        },
        {
          badge: 'Forma 3 · Identidad pitagórica',
          title: 'Calcular $\\cos\\theta$ usando $\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$',
          when: 'Cuando prefieres puro cálculo algebraico sin dibujar triángulos.',
          idea: 'Despejas $\\cos\\theta = \\pm\\sqrt{1 - \\operatorname{sen}^2\\theta}$ eligiendo el signo del cuadrante.',
          steps: [
            'Sustituye la razón conocida en $\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$.',
            'Saca la raíz y selecciona $+$ o $-$ según el cuadrante.',
            'Calcula $\\tan\\theta = \\operatorname{sen}\\theta / \\cos\\theta$ y voltea para las recíprocas.'
          ],
          miniExample: 'Si $\\operatorname{sen}\\theta = 8/17$ en Q1: $\\cos\\theta = \\sqrt{1 - 64/289} = \\sqrt{225/289} = 15/17$.',
          simple: 'Usando la identidad pitagórica sacas el coseno despejando directo de la suma de cuadrados igual a $1$.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Con opuesto $8$ e hipotenusa $17$, Pitágoras nos da el adyacente ($15$); con los tres lados completos leemos seno, coseno y tangente, y luego las volteamos para tener las otras tres.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Identidades algebraicas sin dibujo',
              title: 'Despejar $\\cos\\theta$ desde $\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$',
              when: 'Alternativa puramente simbólica.',
              steps: [
                '$\\operatorname{sen}\\theta = \\frac{8}{17} \\implies \\cos\\theta = \\sqrt{1 - \\left(\\frac{8}{17}\\right)^2} = \\sqrt{\\frac{225}{289}} = \\frac{15}{17}$.',
                '$\\tan\\theta = \\frac{8/17}{15/17} = \\frac{8}{15}$.',
                'Recíprocas invirtiendo: $\\csc\\theta = \\frac{17}{8}$, $\\sec\\theta = \\frac{17}{15}$, $\\cot\\theta = \\frac{15}{8}$.'
              ],
              result: '$\\operatorname{sen}=\\frac{8}{17},\\;\\cos=\\frac{15}{17},\\;\\tan=\\frac{8}{15}$',
              simple: 'Calculas el seno como fracción, usas $1 - \\operatorname{sen}^2$ para el coseno y divides ambos para la tangente.'
            }
          ]
        },
        {
          simple: 'Como $4\\pi/3$ equivale a $240^\\circ$ ($60^\\circ$ abajo del eje izquierdo en el cuadrante III), copia los valores de $60^\\circ$ pero con seno y coseno negativos.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Múltiplos directos en radianes sin pasar a grados',
              title: 'Descomposición $\\frac{4\\pi}{3} = \\pi + \\frac{\\pi}{3}$ directo en radianes',
              when: 'Más rápido para Cálculo donde siempre piensas en fracciones de $\\pi$.',
              steps: [
                'Parte $\\frac{4\\pi}{3} = \\frac{3\\pi}{3} + \\frac{\\pi}{3} = \\pi + \\frac{\\pi}{3}$.',
                'Sumar $\\pi$ rota media vuelta (invierte los signos de $x$ e $y$): $\\cos(\\pi + \\alpha) = -\\cos\\alpha$ y $\\operatorname{sen}(\\pi + \\alpha) = -\\operatorname{sen}\\alpha$.',
                'Por tanto $\\cos(\\frac{4\\pi}{3}) = -\\frac{1}{2}$, $\\operatorname{sen}(\\frac{4\\pi}{3}) = -\\frac{\\sqrt{3}}{2}$, $\\tan(\\frac{4\\pi}{3}) = \\sqrt{3}$.'
              ],
              result: '$240^\\circ$, $\\operatorname{sen}=-\\frac{\\sqrt{3}}{2}$, $\\cos=-\\frac{1}{2}$, $\\tan=\\sqrt{3}$',
              simple: 'Cuando el numerador pasa un poquito al denominador ($4\\pi/3$), le sobra $\\pi/3$ después de $\\pi$; copias los valores de $\\pi/3$ y les pones menos a seno y coseno.'
            }
          ]
        },
        {
          simple: 'Con $24\\text{ m}$ de suelo y ángulo de $60^\\circ$, usamos $\\tan(60^\\circ) = h/24$ para subir directo a la altura $24\\sqrt{3}\\text{ m}$ y $\\cos(60^\\circ) = 24/L$ para hallar la distancia visual $48\\text{ m}$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Medio triángulo equilátero ($30^\\circ$-$60^\\circ$-$90^\\circ$)',
              title: 'Propiedad exacta: la hipotenusa es el doble del cateto corto',
              when: 'Mucho más rápido cuando reconoces el ángulo notable de $60^\\circ$ (o $30^\\circ$).',
              steps: [
                'Como el ángulo de arriba mide $90^\\circ - 60^\\circ = 30^\\circ$, este triángulo es la mitad exacta de un triángulo equilátero de lado $L$.',
                'El suelo ($24\\text{ m}$) es justo la mitad del lado base: por tanto $L = 2 \\times 24 = 48\\text{ m}$.',
                'La altura de todo equilátero vale $\\frac{\\sqrt{3}}{2}L = \\frac{\\sqrt{3}}{2}(48) = 24\\sqrt{3}\\text{ m}$ (comprobado por Pitágoras).'
              ],
              result: '$h = 24\\sqrt{3}\\text{ m}$, $L = 48\\text{ m}$',
              simple: 'Un triángulo de $60^\\circ$ es medio triángulo equilátero cortado por la mitad: la diagonal siempre mide el doble que el piso ($48\\text{ m}$) y la altura ese piso por $\\sqrt{3}$.'
            },
            {
              badge: 'Método 3 · Ley de los Senos',
              title: 'Proporción directa $\\frac{24}{\\operatorname{sen} 30^\\circ} = \\frac{h}{\\operatorname{sen} 60^\\circ} = \\frac{L}{\\operatorname{sen} 90^\\circ}$',
              when: 'Útil cuando trabajas uniformemente con leyes de triángulos generales.',
              steps: [
                'Encuentra el ángulo superior opuesto al piso: $180^\\circ - 90^\\circ - 60^\\circ = 30^\\circ$.',
                'Como $\\operatorname{sen}(30^\\circ) = 1/2$, la razón del triángulo vale $\\frac{24}{1/2} = 48$.',
                'Entonces $L = 48\\operatorname{sen}(90^\\circ) = 48\\text{ m}$ y $h = 48\\operatorname{sen}(60^\\circ) = 48\\cdot\\frac{\\sqrt{3}}{2} = 24\\sqrt{3}\\text{ m}$.'
              ],
              result: '$h = 24\\sqrt{3}\\text{ m}$, $L = 48\\text{ m}$',
              simple: 'Divides el lado conocido entre el seno del ángulo que está enfrente ($24 \\div 0.5 = 48$), y ese $48$ multiplicado por el seno de cada ángulo te da cualquier lado.'
            }
          ]
        }
      ]
    },
    'trig-2': {
      simpleIntro: 'Las identidades trigonométricas te permiten disfrazar una expresión difícil con otra equivalente más fácil para resolver límites, derivadas o integrales como $\\int \\operatorname{sen}^2(x)\\,dx$.',
      simplePrereqs: 'Necesitas tener a la mano $\\operatorname{sen}^2 + \\cos^2 = 1$, cómo se definen $\\tan, \\sec, \\csc, \\cot$ y algo de factorización algebraica.',
      detailedSimple: [
        'Toda identidad pitagórica sale del mismo dibujo del círculo unitario: si divides $\\operatorname{sen}^2+\\cos^2=1$ entre $\\cos^2$ aparece la fórmula con tangente y secante.',
        'Las identidades de ángulo doble y reducción de potencia son la llave maestra para quitar cuadrados $\\operatorname{sen}^2$ y $\\cos^2$ dentro de una integral.'
      ],
      conceptsSimple: [
        'Si ves cuadrados con $1$ cerca (como $1 - \\cos^2$ o $\\tan^2 + 1$), casi siempre se reducen a una sola función gracias a Pitágoras.',
        'Para doblar o partir ángulos a la mitad, usa $\\operatorname{sen}(2\\theta) = 2\\operatorname{sen}\\theta\\cos\\theta$ y $\\cos(2\\theta)$ en sus tres versiones.',
        'La Ley de Cosenos es el Teorema de Pitágoras corregido cuando el triángulo no tiene esquina recta de $90^\\circ$.'
      ],
      theoremsSimple: [
        'Cada punto del círculo tiene coordenadas $(\\cos\\theta, \\operatorname{sen}\\theta)$ a distancia $1$ del origen, así que sus cuadrados siempre tienen que sumar $1$.'
      ],
      formulasSimple: [
        '$\\operatorname{sen}^2 + \\cos^2 = 1$ es la madre de todas: cambiándole de lado un término o dividiendo entre $\\cos^2$ obtienes todas las demás.'
      ],
      mistakesSimple: [
        'El número $2$ dentro de $\\operatorname{sen}(2x)$ duplica el ángulo adentro de la onda, no multiplica el resultado afuera; para sacarlo debes aplicar $\\operatorname{sen}(2x) = 2\\operatorname{sen}(x)\\cos(x)$.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Todo a senos y cosenos',
          title: 'Traducir $\\tan, \\cot, \\sec, \\csc$ a senos y cosenos',
          when: 'Estrategia infalible cuando te atascas simplificando o demostrando una identidad trigonométrica.',
          idea: 'Convierte todo a solo dos letras ($\\operatorname{sen}$ y $\\cos$), suma fracciones y busca factores que se cancelen.',
          steps: [
            'Reemplaza $\\tan = \\frac{\\operatorname{sen}}{\\cos}$, $\\sec = \\frac{1}{\\cos}$, $\\csc = \\frac{1}{\\operatorname{sen}}$, $\\cot = \\frac{\\cos}{\\operatorname{sen}}$.',
            'Suma fracciones buscando un denominador común.',
            'Usa $\\operatorname{sen}^2 + \\cos^2 = 1$ para comprimir el numerador y simplificar.'
          ],
          miniExample: '$\\tan x + \\cot x = \\frac{\\operatorname{sen} x}{\\cos x} + \\frac{\\cos x}{\\operatorname{sen} x} = \\frac{\\operatorname{sen}^2 x + \\cos^2 x}{\\operatorname{sen} x\\cos x} = \\frac{1}{\\operatorname{sen} x\\cos x} = \\sec x\\csc x$.',
          simple: 'Si no sabes por dónde entrar, pasar todo a $\\operatorname{sen}$ y $\\cos$ convierte un enredo de seis funciones en álgebra con solo dos letras.'
        },
        {
          badge: 'Forma 2 · Algebraica sobre trigonometría',
          title: 'Factorización y conjugado trigonométrico ($1 - \\cos^2\\theta$)',
          when: 'Cuando ves expresiones del estilo $\\frac{1 - \\cos x}{\\operatorname{sen} x}$ o $\\frac{\\operatorname{sen}^2 x}{1 - \\cos x}$.',
          idea: 'Trata $\\operatorname{sen}^2 x = 1 - \\cos^2 x = (1 - \\cos x)(1 + \\cos x)$ para cancelar factores o multiplica por el conjugado.',
          steps: [
            'Cambia $1 - \\cos^2$ por $\\operatorname{sen}^2$ (o al revés).',
            'Factoriza la diferencia de cuadrados en dos paréntesis.',
            'Cancela el paréntesis repetido arriba y abajo.'
          ],
          miniExample: '$\\frac{\\operatorname{sen}^2 x}{1 - \\cos x} = \\frac{(1 - \\cos x)(1 + \\cos x)}{1 - \\cos x} = 1 + \\cos x$.',
          simple: 'Usar diferencia de cuadrados sobre $1 - \\cos^2 x$ destraba muchísimos ejercicios tanto aquí como en límites.'
        },
        {
          badge: 'Forma 3 · Sustitución tipo u = cos(x)',
          title: 'Resolver ecuaciones trigonométricas como polinomios cuadráticos',
          when: 'Cuando aparece mezclada una razón al cuadrado con otra de grado $1$.',
          idea: 'Homogeneiza toda la ecuación en una sola función (ej. cambia $\\cos(2x)$ a $2\\cos^2 x - 1$), haz $u = \\cos x$, resuelve la cuadrática y halla los ángulos.',
          steps: [
            'Aplica identidades hasta dejar solo una función trigonométrica.',
            'Resuelve como ecuación algebraica en $u$.',
            'Busca todos los ángulos de $[0, 2\\pi)$ que cumplen cada valor posible de $u$.'
          ],
          miniExample: 'Si $u = \\cos x$ da $u=1/2$, buscas qué ángulos en $360^\\circ$ tienen coseno $+1/2$: $x = \\pi/3$ y $5\\pi/3$.',
          simple: 'Cambia $\\cos(x)$ por una letra común $u$, resuelve como en secundaria y al final regresa de $u$ al ángulo.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Cambiamos $\\operatorname{sen}^2 x$ por $1 - \\cos^2 x$ y lo factorizamos como resta de cuadrados; así aparece $(1 - \\cos x)$ arriba y cancela exactamente al $(1 - \\cos x)$ de abajo.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Multiplicar por el conjugado (1 + cos x)',
              title: 'Racionalizar trigonométricamente el denominador',
              when: 'Alternativa cuando ves $1 - \\cos x$ en el denominador.',
              steps: [
                'Multiplica arriba y abajo por $(1 + \\cos x)$: $\\frac{\\operatorname{sen}^2(x)(1 + \\cos x)}{(1 - \\cos x)(1 + \\cos x)}$.',
                'El denominador se vuelve $1 - \\cos^2(x) = \\operatorname{sen}^2(x)$.',
                'Cancela $\\operatorname{sen}^2(x)$ y queda directo $1 + \\cos(x)$.'
              ],
              result: '$1 + \\cos(x)$',
              simple: 'Multiplicando por el conjugado $1+\\cos x$ aparece $\\operatorname{sen}^2 x$ abajo para tachar al de arriba.'
            }
          ]
        },
        {
          simple: 'Como conocemos dos lados y el ángulo justo entre ellos ($60^\\circ$), metemos los datos en la Ley de Cosenos ($c^2 = a^2 + b^2 - 2ab\\cos C$); como $\\cos 60^\\circ = 1/2$, el $2$ se cancela dejando $c=7$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Altura perpendicular + Pitágoras',
              title: 'Dividir el triángulo en dos rectángulos sin fórmula',
              when: 'Si olvidaste la Ley de Cosenos y el ángulo es notable ($30^\\circ, 45^\\circ, 60^\\circ$).',
              steps: [
                'Toma $b=8$ como base horizontal y baja una altura $h$ desde el extremo de $a=5$.',
                'Sombra de $a$ sobre la base: $5\\cos(60^\\circ) = 2.5$; altura $h = 5\\operatorname{sen}(60^\\circ) = \\frac{5\\sqrt{3}}{2}$.',
                'Base sobrante a la derecha: $8 - 2.5 = 5.5$. Por Pitágoras: $c = \\sqrt{5.5^2 + (\\frac{5\\sqrt{3}}{2})^2} = \\sqrt{30.25 + 18.75} = \\sqrt{49} = 7$.'
              ],
              result: '$c = 7\\text{ cm}$',
              simple: 'Bajando una altura divides el triángulo en dos rectángulos comunes y sacas el tercer lado con puro Pitágoras.'
            }
          ]
        },
        {
          simple: 'Reemplazamos $\\cos(2x)$ por $2\\cos^2(x) - 1$ para que toda la ecuación quede escrita solo con $\\cos(x)$, la factorizamos como ecuación cuadrática y buscamos en el círculo unitario qué ángulos tienen coseno $1/2$ y $-1$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Identidad Suma a Producto (Prosthaphaeresis)',
              title: 'Convertir $\\cos(2x) + \\cos(x)$ directo en un producto sin cuadráticas',
              when: 'Alternativa elegante usando $\\cos A + \\cos B = 2\\cos\\left(\\frac{A+B}{2}\\right)\\cos\\left(\\frac{A-B}{2}\\right)$.',
              steps: [
                'Aplica suma a producto con $A=2x$ y $B=x$: $\\cos(2x) + \\cos(x) = 2\\cos\\left(\\frac{3x}{2}\\right)\\cos\\left(\\frac{x}{2}\\right) = 0$.',
                'Caso 1: $\\cos(x/2) = 0$ en $[0, \\pi) \\implies \\frac{x}{2} = \\frac{\\pi}{2} \\implies x = \\pi$.',
                'Caso 2: $\\cos(3x/2) = 0$ en $[0, 3\\pi) \\implies \\frac{3x}{2} \\in \\{\\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}\\} \\implies x \\in \\{\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}\\}$.'
              ],
              result: '$x \\in \\left\\{\\frac{\\pi}{3},\\; \\pi,\\; \\frac{5\\pi}{3}\\right\\}$',
              simple: 'Al convertir la suma $\\cos(2x)+\\cos(x)$ en multiplicación, solo buscas dónde cada coseno por separado se vuelve cero.'
            },
            {
              badge: 'Método 3 · Comparación $\\cos(2x) = -\\cos(x)$ en el círculo unitario',
              title: 'Igualar dos cosenos opuestos usando $\\cos(\\pi - \\theta) = -\\cos(\\theta)$',
              when: 'Forma geométrica intuitiva leyendo ángulos espejo en el círculo unitario.',
              steps: [
                'Reescribe $\\cos(2x) = \\cos(\\pi - x)$ (o $\\cos(\\pi + x)$).',
                'Dos ángulos tienen igual coseno cuando coinciden ($2x = \\pi - x + 2k\\pi \\implies x = \\frac{\\pi + 2k\\pi}{3}$) o son opuestos ($2x = x - \\pi + 2k\\pi \\implies x = \\pi$).',
                'Para $k=0, 1, 2$ en $[0, 2\\pi)$ salen justo $\\frac{\\pi}{3},\\; \\pi,\\; \\frac{5\\pi}{3}$.'
              ],
              result: '$x \\in \\left\\{\\frac{\\pi}{3},\\; \\pi,\\; \\frac{5\\pi}{3}\\right\\}$',
              simple: 'Poner $\\cos(2x) = -\\cos(x)$ es preguntar cuándo el doble del ángulo cae al lado opuesto horizontalmente; eso solo pasa en $60^\\circ, 180^\\circ$ y $300^\\circ$.'
            }
          ]
        }
      ]
    }
  };

  applyEnrichmentMap(ns.Curriculum, ENRICHMENT_1);
})(window.MatInteractiva);
