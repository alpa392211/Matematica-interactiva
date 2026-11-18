/* ==========================================================================
   MATETIC - Enriquecimiento Pedagógico Parte 3
   (Derivadas, Integrales y Cálculo Diferencial e Integral: 9 temas)
   Agrega múltiples formas de abordar y resolver problemas (incluyendo
   definición alternativa con (t - x), métodos tabulares, geométricos,
   numéricos y atajos), botón "en palabras más sencillas" para cada apunte
   y rutas alternativas en todos los ejemplos resueltos.
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

  const ENRICHMENT_3 = {
    'der-1': {
      simpleIntro: 'La derivada mide exactamente qué tan rápido cambia algo en un instante congelado (como la aguja del velocímetro del auto ahora mismo, o la inclinación exacta de una montaña rusa en un único punto), en lugar del promedio de todo el viaje.',
      simplePrereqs: 'Solo necesitas calcular pendientes entre dos puntos ($\\frac{y_2-y_1}{x_2-x_1}$), desarrollar binomios y resolver límites $0/0$ por factorización o conjugado.',
      detailedSimple: [
        'La razón promedio mide qué tan rápido cambiaste entre dos momentos distintos (distancia entre tiempo). Para saber la rapidez instantánea justo en este segundo, haces el intervalo de tiempo tan diminuto como $0$ usando un límite.',
        'La misma idea matemática aparece en todos lados: en física da la velocidad instantánea, en economía el costo de fabricar una pieza extra y en biología la rapidez de crecimiento de una población.',
        'Hay DOS maneras equivalentes de escribir la derivada con límite: usar un pasito $h \\to 0$ con $\\frac{f(x+h)-f(x)}{h}$, O acercar un segundo punto $t \\to x$ con $\\frac{f(t)-f(x)}{t-x}$ (muy cómoda con raíces y fracciones). Si vienes por izquierda y por derecha y las pendientes no coinciden, allí no hay derivada.',
        'Aplicando ese límite en general para cualquier $x$, obtienes la nueva función $f\'(x)$ que te da todas las pendientes de golpe; si vuelves a derivar obtienes la aceleración o curvatura $f\'\'(x)$.',
        'Con el punto $(x_0, f(x_0))$ y la pendiente $f\'(x_0)$ armas al instante la recta tangente que roza la curva, su recta perpendicular (normal) y la aproximación lineal para estimar cambios chiquitos.'
      ],
      conceptsSimple: [
        'Las dos definiciones son exactamente la misma pendiente: en una llamas $h$ a la separación horizontal ($x+h$ menos $x$), y en la otra llamas $t$ al segundo punto ($t$ menos $x$).',
        'La tangente copia la inclinación exacta de la curva en un punto y sirve como "zoom plano" (aproximación lineal) cerca de ese punto; la normal es la línea perpendicular a $90^\\circ$.',
        'El dominio de $f\'$ suele ser igual o más chico que el de $f$ (por ejemplo en $\\sqrt{x}$, en $x=0$ existe $\\sqrt{0}=0$ pero la pendiente se vuelve vertical y no existe derivada).',
        'La curva falla al derivar en cuatro escenarios visuales claros: esquina puntiaguda, pico afilado hacia infinito, corte/salto de la gráfica o pared vertical.',
        'Si aprendes los resultados prototipo de derivar desde cero ($x^n, \\sqrt{x}, 1/x, \\operatorname{sen} x, e^x$), entenderás de dónde sale todo el formulario rápido.'
      ],
      theoremsSimple: [
        'Si puedes trazar una tangente no vertical bien definida en un punto, la gráfica no puede estar rota ni tener un salto allí: derivabilidad garantiza continuidad (aunque tener pico continuo como $|x|$ no basta para ser derivable).',
        'Una gráfica horizontal constante jamás sube ni baja (pendiente $0$); al desarrollar $(x+h)^n$ con el Binomio de Newton, casi todo lleva $h$ al cuadrado o más alto y se va a cero excepto el término lineal $n x^{n-1}$.',
        'Usando los límites trigonométricos y exponenciales en cero sobre la definición, las ondas seno cambian exactamente a ritmo coseno y la exponencial natural $e^x$ mantiene exactamente su propia altura como pendiente.'
      ],
      formulasSimple: [
        'Divide la diferencia de alturas entre la diferencia de posiciones y haz que la separación horizontal tienda a cero ($h \\to 0$ o $t \\to x$).',
        'Toma el molde punto-pendiente usando el punto real $(x_0, f(x_0))$ y como pendiente el número que dio la derivada evaluada en $x_0$.'
      ],
      mistakesSimple: [
        'Para evaluar $f(x+h)$ en $f(x)=x^2$, cada letra $x$ original se reemplaza por el paquete completo $(x+h)$, obteniendo $(x+h)^2 = x^2+2xh+h^2$, jamás $x^2+h$.',
        'En la ecuación de una línea recta la pendiente tiene que ser un NÚMERO fijo (evaluado en $x_0$), no una fórmula con $x$ adentro porque eso dibujaría otra curva.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Incremento h → 0',
          title: 'Definición clásica con cociente incremental: $f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$',
          when: 'Excelente para polinomios ($x^2, x^3$), trigonométricas ($\\operatorname{sen} x$) y cuando quieres hallar la fórmula general $f\'(x)$ para todo $x$.',
          idea: 'Empuja el segundo punto una distancia $h$, resta la altura inicial, simplifica las partes sin $h$, saca factor común $h$ para cancelar el denominador y haz $h = 0$.',
          steps: [
            'Calcula cuidadosamente $f(x + h)$ metiendo $(x + h)$ dentro de cada $x$.',
            'Arma $\\frac{f(x + h) - f(x)}{h}$, desarrolla y cancela todos los términos que NO tengan $h$.',
            'Factoriza $h$ arriba, táchala con la $h$ de abajo y evalúa sustituyendo $h = 0$.'
          ],
          miniExample: 'Para $f(x)=x^2$: $\\lim_{h\\to 0}\\frac{(x+h)^2-x^2}{h} = \\lim_{h\\to 0}\\frac{2xh+h^2}{h} = \\lim_{h\\to 0}(2x+h) = 2x$.',
          simple: 'Llamas $h$ al pasito a la derecha: desarrollas todo, se cancela la función original y los sobrevivientes comparten una $h$ que cancelas con la de abajo.'
        },
        {
          badge: 'Forma 2 · Cambio t → x (denominador t - x)',
          title: 'Definición equivalente con $t - x$: $f\'(x) = \\lim_{t \\to x} \\frac{f(t) - f(x)}{t - x}$ (o $\\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$)',
          when: '¡A menudo MUCHO más limpia y rápida que $h \\to 0$ para raíces cuadradas ($\\sqrt{x}$), fracciones ($1/x$) y derivadas en un punto concreto $x_0$!',
          idea: 'En vez de desarrollar binomios $(x+h)^n$, simplemente comparas $f(t)$ menos $f(x)$ y cancelas $(t - x)$ factorizando $t^n - x^n$, multiplicando por conjugado o sacando denominador común.',
          steps: [
            'Escribe $\\lim_{t \\to x} \\frac{f(t) - f(x)}{t - x}$ (si te dan un punto fijo $a$, puedes usar directo $\\lim_{t \\to a} \\frac{f(t) - f(a)}{t - a}$).',
            'Factoriza $(t - x)$ en polinomios ($t^2 - x^2 = (t-x)(t+x)$), resta fracciones si es $1/x$, o factoriza/conjuga si hay raíces ($t - x = (\\sqrt{t}-\\sqrt{x})(\\sqrt{t}+\\sqrt{x})$).',
            'Cancela el factor $(t - x)$ y evalúa haciendo $t = x$.'
          ],
          miniExample: 'Para $f(x)=\\sqrt{x}$: $\\lim_{t\\to x}\\frac{\\sqrt{t}-\\sqrt{x}}{t-x} = \\lim_{t\\to x}\\frac{\\sqrt{t}-\\sqrt{x}}{(\\sqrt{t}-\\sqrt{x})(\\sqrt{t}+\\sqrt{x})} = \\lim_{t\\to x}\\frac{1}{\\sqrt{t}+\\sqrt{x}} = \\frac{1}{2\\sqrt{x}}$.',
          simple: 'Con $(t - x)$ no tienes que expandir paréntesis $(x+h)$ gigantes: solo factorizas o conjugas hasta que salga $(t-x)$, lo tachas y cambias todas las $t$ por $x$.'
        },
        {
          badge: 'Forma 3 · Geométrica (Secantes → Tangente)',
          title: 'Pendiente límite de cuerdas secantes, recta tangente, normal y linealización',
          when: 'Cuando el problema pide ecuación de tangente/normal, ángulo de inclinación o estimación lineal $f(x_0 + \\Delta x)$.',
          idea: 'Calcula primero el punto $(x_0, f(x_0))$ y su pendiente $m_t = f\'(x_0)$; la normal usa $m_n = -1/m_t$, y la aproximación lineal usa $L(x) = f(x_0) + f\'(x_0)(x - x_0)$.',
          steps: [
            'Halla el par completo $(x_0, y_0)$ evaluando la función original.',
            'Halla la pendiente numérica $m_t = f\'(x_0)$ (con $h \\to 0$, $t \\to x_0$ o reglas).',
            'Arma la tangente $y - y_0 = m_t(x - x_0)$ y, para aproximar cerca de $x_0$, sustituye $x$ en esa misma recta.'
          ],
          miniExample: 'En $f(x)=\\sqrt{x}$ en $x_0=4$: $(4,2)$, $m_t = 1/4 \\implies L(4.2) \\approx 2 + \\frac{1}{4}(0.2) = 2.05$.',
          simple: 'La recta tangente es reemplazar un pedacito curvo por una regla recta pegada al punto; por eso te sirve para calcular raíces o fracciones decimales sin calculadora.'
        },
        {
          badge: 'Forma 4 · Numérica Centrada y Derivadas Laterales',
          title: 'Estimación simétrica $\\frac{f(x+0.001)-f(x-0.001)}{0.002}$ y test lateral en picos $|x-a|$',
          when: 'La simétrica sirve para comprobar cualquier cálculo en calculadora; las laterales son obligatorias en valores absolutos o funciones por partes.',
          idea: 'Si la curva tiene esquina o cambia de fórmula en $a$, calculas las pendientes viniendo de la izquierda ($t\\to a^-$ o $h\\to 0^-$) y de la derecha ($t\\to a^+$ o $h\\to 0^+$) por separado.',
          steps: [
            'Para verificar cualquier resultado $f\'(x_0)$: evalúa $\\frac{f(x_0+0.001)-f(x_0-0.001)}{0.002}$ y compara.',
            'En puntos de quiebre $a$: calcula $f\'_-(a)$ y $f\'_+(a)$ usando los trozos izquierdo y derecho.',
            'Solo si ambas pendientes laterales son finitas e iguales existe la derivada en $a$.'
          ],
          miniExample: 'Para $f(x)=3x^2-5x+1$ en $x=2$: $f\'(2)=7$; prueba simétrica $\\frac{f(2.001)-f(1.999)}{0.002} = 7.000$.',
          simple: 'Si mides la subida un pasito a la izquierda y un pasito a la derecha del punto y divides entre la distancia $0.002$, obtienes la derivada casi exacta al instante.'
        },
        {
          badge: 'Forma 5 · Física / Económica y Reglas Rápidas',
          title: 'Lectura por unidades ($\\text{m/s}$, costo por unidad) y comprobación por reglas de potencia',
          when: 'Para interpretar problemas aplicados y confirmar resultados obtenidos por definición de límite.',
          idea: 'Las unidades de $f\'(x)$ siempre son $\\frac{\\text{unidades de } f}{\\text{unidades de } x}$; además puedes usar $(ax^n)\'=anx^{n-1}$ para comprobar si tu límite cerró bien.',
          steps: [
            'Aplica límites ($h\\to 0$ o $t\\to x$) como pide la definición.',
            'Comprueba el resultado aplicando la regla directa de potencias.',
            'Escribe siempre las unidades físicas o económicas resultantes.'
          ],
          miniExample: 'Si $s(t)=5t^2+3t$ metros ($t$ en s), la derivada es $10t+3$ en $\\text{m/s}$ (velocidad) y su derivada es $10\\text{ m/s}^2$ (aceleración).',
          simple: 'Derivar solo significa añadir "por cada unidad de $x$" a las unidades que ya tenías (metros $\\to$ metros por segundo $\\to$ metros por segundo al cuadrado).'
        }
      ],
      examplesExtra: [
        {
          simple: 'Metimos $(x+h)$ en toda la función, restamos la original para que se fueran el $3x^2$, $-5x$ y $+1$, sacamos la $h$ común arriba, la tachamos con la de abajo y al poner $h=0$ quedó $6x-5$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Definición alternativa con t → x (denominador t - x)',
              title: 'Calcular $f\'(x) = \\lim_{t \\to x} \\frac{f(t) - f(x)}{t - x}$ factorizando $(t - x)$',
              when: 'Evita expandir $(x+h)^2$ agrupando términos gemelos de $t$ y $x$.',
              steps: [
                'Plantea: $f\'(x) = \\lim_{t \\to x} \\frac{(3t^2 - 5t + 1) - (3x^2 - 5x + 1)}{t - x}$.',
                'Empareja por potencias iguales (los $+1$ se cancelan): $\\lim_{t \\to x} \\frac{3(t^2 - x^2) - 5(t - x)}{t - x}$.',
                'Factoriza $t^2 - x^2 = (t - x)(t + x)$ y saca factor común $(t - x)$: $\\lim_{t \\to x} \\frac{(t - x)[3(t + x) - 5]}{t - x}$.',
                'Cancela $(t - x)$ y evalúa haciendo $t = x$: $3(x + x) - 5 = 6x - 5$.'
              ],
              result: '$f\'(x) = 6x - 5$',
              simple: 'En lugar de usar $h$, juntas $3(t^2-x^2)$ y $-5(t-x)$; ambos sacan rápido un factor $(t-x)$ que se cancela con el de abajo y al hacer $t=x$ queda $3(2x)-5 = 6x-5$.'
            },
            {
              badge: 'Método 3 · Verificación directa por regla de potencias',
              title: 'Comprobación con $(x^n)\' = nx^{n-1}$',
              when: 'Para confirmar en 3 segundos que tu límite de definición está libre de errores.',
              steps: [
                'Deriva término a término: $(3x^2)\' = 6x$, $(-5x)\' = -5$, $(1)\' = 0$.',
                'Suma: $f\'(x) = 6x - 5$, idéntico tanto al método $h \\to 0$ como al método $t \\to x$.'
              ],
              result: '$f\'(x) = 6x - 5$',
              simple: 'Bajando exponentes por regla rápida ($3\\cdot 2x - 5 + 0$) confirmas que tu trabajo con límites dio exactamente en el blanco.'
            }
          ]
        },
        {
          simple: 'Usamos el conjugado $\\sqrt{x+h}+\\sqrt{x}$ para desaparecer las raíces de arriba, quedando solo una $h$ que tacha la de abajo; al hacer $h=0$ aparecen dos raíces iguales abajo: $\\frac{1}{2\\sqrt{x}}$, que en $x=4$ da pendiente $1/4$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Definición alternativa con t - x (Sin conjugado grande)',
              title: 'Usar $f\'(x) = \\lim_{t \\to x} \\frac{\\sqrt{t} - \\sqrt{x}}{t - x}$ factorizando $t - x$',
              when: 'Mucho más elegante que $h \\to 0$: ves el factor $t - x$ como diferencia de cuadrados directamente.',
              steps: [
                'Plantea el límite en $(t - x)$: $f\'(x) = \\lim_{t \\to x} \\frac{\\sqrt{t} - \\sqrt{x}}{t - x}$.',
                'Recuerda que $t - x = (\\sqrt{t})^2 - (\\sqrt{x})^2 = (\\sqrt{t} - \\sqrt{x})(\\sqrt{t} + \\sqrt{x})$ (válido con $t, x > 0$).',
                'Reemplaza el denominador y tacha $(\\sqrt{t} - \\sqrt{x})$: $\\lim_{t \\to x} \\frac{1}{\\sqrt{t} + \\sqrt{x}}$.',
                'Evalúa con $t = x$: $\\frac{1}{\\sqrt{x} + \\sqrt{x}} = \\frac{1}{2\\sqrt{x}}$; en $x_0 = 4$ da $m_t = \\frac{1}{4}$ y tangente $y = \\frac{1}{4}x + 1$.'
              ],
              result: '$f\'(x) = \\frac{1}{2\\sqrt{x}}$, Tangente: $y = \\frac{1}{4}x + 1$',
              simple: 'Con $(t - x)$ ni siquiera multiplicas arriba y abajo: simplemente ves $t - x$ como $(\\sqrt{t}-\\sqrt{x})(\\sqrt{t}+\\sqrt{x})$ y tachas lo de arriba en una sola línea.'
            },
            {
              badge: 'Método 3 · Enfoque puntual f\'(4) directo y exponente fraccionario',
              title: 'Calcular $f\'(4) = \\lim_{t \\to 4} \\frac{\\sqrt{t} - 2}{t - 4}$ si solo piden la tangente en $x_0=4$',
              when: 'Si un examen pide la tangente en $x_0=4$ y no la fórmula general $f\'(x)$, trabajar con números es aún más fácil.',
              steps: [
                '$m_t = \\lim_{t \\to 4} \\frac{\\sqrt{t} - 2}{(\\sqrt{t} - 2)(\\sqrt{t} + 2)} = \\lim_{t \\to 4} \\frac{1}{\\sqrt{t} + 2} = \\frac{1}{4}$.',
                'Verificación por regla: $(\\sqrt{x})\' = (x^{1/2})\' = \\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}$. En $x=4 \\implies \\frac{1}{4}$.'
              ],
              result: '$m_t = \\frac{1}{4}$',
              simple: 'Evaluando el punto fijo $4$ desde el principio con $\\frac{\\sqrt{t}-2}{t-4}$ llegas a $1/4$ en dos segundos.'
            }
          ]
        },
        {
          simple: 'El promedio divide lo avanzado entre el intervalo completo ($2$ a $4$ segundos $\\implies 33\\text{ m/s}$); la velocidad instantánea usa la derivada en $t=2$ ($23\\text{ m/s}$), y el costo marginal en $q=50$ evalúa la derivada de $C$ ($32$ dólares por pieza).',
          alternativeMethods: [
            {
              badge: 'Método 2 · Definición en un punto t → 2 y diferencia real en economía',
              title: 'Calcular $s\'(2)$ con $\\lim_{t\\to 2}\\frac{s(t)-s(2)}{t-2}$ y comparar $C\'(50)$ vs $C(51)-C(50)$',
              when: 'Para comprobar el significado real de velocidad instantánea y costo marginal.',
              steps: [
                'Con $(t - 2)$: $s(2) = 26$, luego $\\lim_{t\\to 2}\\frac{(5t^2+3t) - 26}{t - 2} = \\lim_{t\\to 2}\\frac{(t-2)(5t+13)}{t-2} = 5(2)+13 = 23\\text{ m/s}$.',
                'Para costo de fabricar la pieza $51$: $C(51) - C(50) = 1632.20 - 1600 = 32.20$ dólares, mientras que la aproximación marginal $C\'(50) = 32$ acierta por apenas $0.20$ dólares.'
              ],
              result: '$v(2)=23\\text{ m/s}$, $C\'(50)=32$ dólares/unidad',
              simple: 'La fórmula $(t - 2)$ factoriza el cociente justo alrededor del segundo $2$, y el costo marginal $32$ predice casi al centavo cuánto cuesta fabricar la unidad $51$.'
            },
            {
              badge: 'Método 3 · Reglas rápidas de potencia y comprobación numérica',
              title: 'Derivar directo $s\'(t) = 10t + 3$ y probar con $t = 2 \\pm 0.001$',
              when: 'Atajo instantáneo para confirmar resultados cinemáticos y marginales.',
              steps: [
                'Por potencia: $v(t) = s\'(t) = 10t + 3 \\implies v(2) = 23\\text{ m/s}$; $a(t) = v\'(t) = 10\\text{ m/s}^2$.',
                'Para $C(q) = 0.2q^2 + 12q + 500$: $C\'(q) = 0.4q + 12 \\implies C\'(50) = 20 + 12 = 32$.'
              ],
              result: '$v(2)=23\\text{ m/s}$, $a(2)=10\\text{ m/s}^2$, $C\'(50)=32$',
              simple: 'Aplicando reglas rápidas confirmas tanto velocidad como aceleración y costo marginal en cuestión de segundos.'
            }
          ]
        },
        {
          simple: 'Para $1/x$ restamos fracciones en el numerador y cancelamos $h$ dejando $-1/x^2$; en $x=2$ la pendiente tangente vale $-0.25$, la normal perpendicular vale $+4$ y caminar $0.05$ pasos por la tangente baja de $0.5$ a $0.4875$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Definición con t → x (denominador t - x)',
              title: 'Restar $\\frac{1}{t} - \\frac{1}{x}$ directamente sobre $(t - x)$',
              when: 'Quita rápidamente las fracciones sin escribir $(x+h)$ en denominadores.',
              steps: [
                'Plantea $f\'(x) = \\lim_{t \\to x} \\frac{\\frac{1}{t} - \\frac{1}{x}}{t - x} = \\lim_{t \\to x} \\frac{\\frac{x - t}{tx}}{t - x}$.',
                'Nota que $x - t = -(t - x)$: $\\lim_{t \\to x} \\frac{-(t - x)}{tx(t - x)} = \\lim_{t \\to x} \\frac{-1}{tx}$.',
                'Evalúa $t = x$: $f\'(x) = -\\frac{1}{x^2}$.'
              ],
              result: '$f\'(x) = -\\frac{1}{x^2}$, $L(2.05) = 0.4875$',
              simple: 'Arriba te sale $\\frac{x-t}{tx}$; como $x-t$ es el negativo de $t-x$, se tacha con el $(t-x)$ de abajo dejando directo $-1/(tx) \\to -1/x^2$.'
            },
            {
              badge: 'Método 3 · Diferencial dy = f\'(x₀)dx y regla de potencia x⁻¹',
              title: 'Verificar con $(x^{-1})\' = -x^{-2}$ y medir error contra el valor exacto $1/2.05$',
              when: 'Muestra qué tan precisa es la linealización.',
              steps: [
                'Por potencia: $(x^{-1})\' = -1\\cdot x^{-2} = -1/x^2$.',
                'El valor real es $1/2.05 \\approx 0.487805$; nuestra aproximación tangente $0.4875$ solo erra por $0.0003$ ($0.06\\%$).'
              ],
              result: '$0.4875$ vs real $\\approx 0.4878$',
              simple: 'Usar la tangente estimó $1/2.05$ con un error de apenas tres diezmilésimas sin hacer ninguna división larga.'
            }
          ]
        },
        {
          simple: 'El valor absoluto $|x-3|$ hace una V con vértice en $x=3$: por la izquierda baja con pendiente $-1$ y por la derecha sube con pendiente $+1$. Como en $x=3$ la inclinación da un brinco de $-1$ a $+1$, no hay derivada; pero lejos en $x=5$ estás sobre la recta derecha $x-3$ con pendiente fija $1$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Laterales con t → 3⁻ y t → 3⁺',
              title: 'Evaluar $\\lim_{t\\to 3^\\pm} \\frac{|t-3| - 0}{t - 3}$ directamente',
              when: 'Escritura aún más compacta que con $h$.',
              steps: [
                'Si $t \\to 3^-$ ($t < 3$), entonces $|t - 3| = -(t - 3)$, luego $\\frac{-(t-3)}{t-3} = -1$.',
                'Si $t \\to 3^+$ ($t > 3$), entonces $|t - 3| = +(t - 3)$, luego $\\frac{+(t-3)}{t-3} = +1$.',
                'Como $-1 \\neq +1$, el límite bilateral no existe en $x_0 = 3$.'
              ],
              result: '$f\'_-(3)=-1 \\neq +1 = f\'_+(3)$; $f\'(5)=1$',
              simple: 'Con $(t - 3)$ ves al instante que a la izquierda de $3$ la fracción es $(-(t-3))/(t-3) = -1$ y a la derecha es $+1$.'
            },
            {
              badge: 'Método 3 · Reescritura a trozos sin valor absoluto',
              title: 'Derivar cada semirrecta por separado ($3 - x$ vs. $x - 3$)',
              when: 'Permite ver la geometría en forma instantánea.',
              steps: [
                'Para $x < 3$, $f(x) = 3 - x$, cuya pendiente constante es $-1$; en $x > 3$, $f(x) = x - 3$, cuya pendiente es $+1$.',
                'En $x = 3$ ambas semirrectas chocan en pico angular ($-1 \\neq +1$); en $x = 5 > 3$ solo aplica la recta $x - 3$ con derivada $1$.'
              ],
              result: 'No derivable en $x=3$; $f\'(5)=1$',
              simple: 'Si quitas las barras de $|x-3|$ viendo las dos rectas pegadas en $x=3$, la bajada de $-1$ choca con la subida de $+1$ en una esquina.'
            }
          ]
        }
      ]
    },
    'der-2': {
      simpleIntro: 'Una vez entendiste de dónde sale la derivada con límites, las reglas de derivación son atajos exactos para derivar en segundos potencias, sumas, multiplicaciones, divisiones y funciones encadenadas una dentro de otra.',
      simplePrereqs: 'Necesitas pasar raíces y divisiones simples a exponentes ($x^{1/2}, x^{-2}$), además de operar fracciones con cuidado.',
      detailedSimple: [
        'Muchas fracciones con un solo término abajo o raíces parecen requerir reglas pesadas, pero si antes las reescribes como $a x^n$, aplicas simplemente la regla básica de la potencia en un renglón.',
        'La derivada de una multiplicación o división NO se puede calcular derivando arriba y abajo por separado: requiere combinar cada factor con la derivada de su compañero.',
        'La regla de la cadena es como abrir muñecas rusas: derivas primero la cáscara exterior dejando intacto lo de adentro, y luego multiplicas por la derivada de lo que vive adentro.'
      ],
      conceptsSimple: [
        'Constantes solas desaparecen ($0$); para $x^n$ el exponente baja multiplicando adelante y arriba se le resta $1$.',
        'En producto $(u\\cdot v)\'$, cada uno tiene su turno de ser derivado mientras el otro mira sin cambiar, y los sumas: $u\'v + uv\'$.',
        'En cociente, empiezas derivando el de arriba ($u\'v - uv\'$) y todo se divide entre el cuadrado del denominador ($v^2$).',
        'Si hay algo más complejo que una sola $x$ elevado a potencia (o dentro de una raíz), multiplicas afuera por la derivada interna $g\'(x)$.'
      ],
      theoremsSimple: [
        'Al multiplicar $(u+\\Delta u)(v+\\Delta v)$, los incrementos pequeños generan exactamente los dos términos cruzados $u\'v + uv\'$, mientras $\\Delta u\\cdot\\Delta v$ se desvanece a cero.',
        'La tasa de cambio total de una función compuesta es simplemente el producto de dos escalas: cuánto cambia la caja exterior por cada unidad de $u$, multiplicado por qué tan rápido cambia $u$ con $x$.'
      ],
      formulasSimple: [
        'Producto: deriva el primero por el segundo sin tocar + el primero sin tocar por la derivada del segundo. Cociente: resta (en vez de suma) dividida entre el de abajo al cuadrado.',
        'Deriva de afuera hacia adentro y multiplica las derivadas de todas las capas.'
      ],
      mistakesSimple: [
        'Prueba rápida con números: $(x \\cdot x)\' = (x^2)\' = 2x$, mientras que derivar por separado daría $1 \\cdot 1 = 1$. ¡Nunca separes derivadas en productos o cocientes!',
        'La regla de la cadena siempre te cobra un "peaje" multiplicando al final por la derivada de lo que estaba escondido adentro del paréntesis o raíz.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Reescribir a axⁿ antes de derivar',
          title: 'Convertir radicales y cocientes simples a potencias fraccionarias/negativas',
          when: 'Siempre que el denominador sea un monomio ($\\frac{6}{x^2}$) o haya raíces simples ($4\\sqrt{x}$).',
          idea: 'Reescribe $\\frac{A}{x^k} = A x^{-k}$ y $\\sqrt[n]{x^m} = x^{m/n}$ antes de derivar; así evitas usar la regla del cociente por completo.',
          steps: [
            'Transforma raíces a exponentes fraccionarios y sube denominadores con exponente negativo.',
            'Si es cociente sobre un monomio como $\\frac{x^3+2x}{x}$, divide término a término primero.',
            'Aplica la regla de potencia $n x^{n-1}$ directamente.'
          ],
          miniExample: '$\\frac{4}{\\sqrt{x}} = 4x^{-1/2} \\xrightarrow{d/dx} 4(-\\frac{1}{2})x^{-3/2} = -\\frac{2}{x^{3/2}}$.',
          simple: 'Arreglar la casa antes de derivar convierte divisiones incómodas en simples potencias donde solo bajas el exponente y le restas $1$.'
        },
        {
          badge: 'Forma 2 · Regla del Cociente vs. Producto con u·v⁻¹',
          title: 'Alternar $\\frac{u\'v - uv\'}{v^2}$ con regla de producto + cadena $u \\cdot v^{-1}$',
          when: 'En cocientes como $\\frac{3x-1}{x^2+2}$ o cuando el numerador es una constante $c/g(x)$.',
          idea: 'Si arriba solo hay una constante $\\frac{c}{v}$, usar $c \\cdot v^{-1} \\implies -c\\,v^{-2}\\cdot v\'$ es dos veces más rápido que la fórmula del cociente; si ambos dependen de $x$, compara ambos métodos.',
          steps: [
            'Si el numerador es constante ($c/v$): escribe $c v^{-1}$ y aplica cadena.',
            'Si arriba y abajo tienen $x$: etiqueta $u, v$, calcula $u\', v\'$ aparte y arma $\\frac{u\'v - uv\'}{v^2}$ sin desarrollar $v^2$.'
          ],
          miniExample: '$\\frac{d}{dx}\\left(\\frac{5}{x^2+1}\\right) = \\frac{d}{dx}[5(x^2+1)^{-1}] = -5(x^2+1)^{-2}(2x) = \\frac{-10x}{(x^2+1)^2}$.',
          simple: 'Si arriba solo hay un número sin $x$, subir el denominador con exponente $-1$ es mucho más veloz que hacer la regla del cociente.'
        },
        {
          badge: 'Forma 3 · Cadena: Capas vs. Sustitución Leibniz (u)',
          title: 'Regla de la cebolla ($f\'(g)\\cdot g\'$) vs. variable intermedia ($\\frac{dy}{du}\\cdot\\frac{du}{dx}$)',
          when: 'En raíces compuestas o potencias de funciones como $\\left(\\frac{2x-1}{x+1}\\right)^3$.',
          idea: 'Puedes hacerlo en un renglón de afuera hacia adentro, O bautizar explícitamente lo de adentro como $u = g(x)$ para no perder ni una capa.',
          steps: [
            'Bautiza lo interno como $u = g(x)$ y reescribe $y = f(u)$.',
            'Deriva por separado $\\frac{dy}{du}$ y $\\frac{du}{dx}$.',
            'Multiplícalas y vuelve a cambiar $u$ por $g(x)$.'
          ],
          miniExample: 'Para $h(x)=\\sqrt{5x^2+4}$: $u=5x^2+4, y=\\sqrt{u} \\implies \\frac{dy}{du}=\\frac{1}{2\\sqrt{u}},\\; \\frac{du}{dx}=10x \\implies h\'(x)=\\frac{5x}{\\sqrt{5x^2+4}}$.',
          simple: 'Llamar $u$ a todo lo que está encerrado en el paréntesis o raíz parte una derivada complicada en dos derivaditas fáciles que luego multiplicas.'
        },
        {
          badge: 'Forma 4 · Expandir antes vs. Regla del Producto',
          title: 'Decidir cuándo expandir paréntesis o factorizar después de derivar',
          when: 'En productos de polinomios o factores por $e^x$.',
          idea: 'Entre polinomios pequeños como $(x^2+1)(x-3)$, multiplicar antes suele ser más fácil; con $e^x$ o potencias altas $(x^2+1)^5$, conviene producto + factor común.',
          steps: [
            'Si ambos factores son polinomios de grado bajo, compáralo expandiendo primero.',
            'Si hay $e^x$ o raíces, aplica $(uv)\' = u\'v + uv\'$ y saca factor común al final para dejarlo limpio.'
          ],
          miniExample: '$((x^2+1)e^x)\' = 2xe^x + (x^2+1)e^x = (x^2+2x+1)e^x = (x+1)^2e^x$.',
          simple: 'Con $e^x$ casi siempre conviene aplicar la regla del producto y al final sacar $e^x$ como factor común.'
        },
        {
          badge: 'Forma 5 · Verificación por Derivación Logarítmica o Numérica',
          title: 'Atajo $\\ln(y)$ para cocientes con exponentes y prueba en $x_0 \\pm 0.001$',
          when: 'Para expresiones combinadas pesadas como $\\left(\\frac{2x-1}{x+1}\\right)^3$ o comprobar examen.',
          idea: 'Tomar $\\ln$ convierte potencias y divisiones en restas; y evaluar un punto numérico detecta al momento errores de signo.',
          steps: [
            'Para comprobar simbólicamente un cociente a potencia: $\\ln y = 3\\ln(2x-1) - 3\\ln(x+1)$, luego $\\frac{y\'}{y} = \\frac{6}{2x-1} - \\frac{3}{x+1}$.',
            'Para comprobar numéricamente en $x_0$: evalúa $\\frac{f(x_0+0.001)-f(x_0-0.001)}{0.002}$.'
          ],
          miniExample: 'En $f(x)=(\\frac{2x-1}{x+1})^3$ en $x=2$, $f(2)=1$ y $y\'/1 = \\frac{6}{3}-\\frac{3}{3} = 2-1 = 1$. ¡Directo!',
          simple: 'Evaluar la derivada por $\\ln$ convierte multiplicaciones y divisiones complicadas en puras sumas y restas.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Antes de derivar transformamos $\\sqrt{x}$ en $x^{1/2}$ y $6/x^2$ en $6x^{-2}$; así bajamos cada exponente y le restamos $1$ sin necesidad de usar la regla del cociente.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Usar regla del cociente solo en -6/x²',
              title: 'Comprobar el término medio con la fórmula del cociente',
              when: 'Útil para verificar el signo $+$ resultante de derivar $-\\frac{6}{x^2}$.',
              steps: [
                'Para $\\frac{-6}{x^2}$ con regla del cociente: $\\frac{(0)(x^2) - (-6)(2x)}{(x^2)^2} = \\frac{+12x}{x^4} = +\\frac{12}{x^3}$.',
                'Confirma por qué el signo pasa de negativo ($-6/x^2$) a positivo ($+12/x^3$).'
              ],
              result: '$f\'(x) = \\frac{2}{\\sqrt{x}} + \\frac{12}{x^3} + 12x^3$',
              simple: 'Verás cómo tanto subir el exponente ($-6\\cdot(-2) = +12$) como la regla del cociente cambian el signo menos a más.'
            },
            {
              badge: 'Método 3 · Verificación numérica en x = 1',
              title: 'Evaluar la derivada analítica vs. cociente centrado en $x = 1$',
              when: 'Permite detectar al instante errores de signo o de exponente.',
              steps: [
                'Con nuestra fórmula en $x=1$: $f\'(1) = \\frac{2}{1} + \\frac{12}{1} + 12(1) = 26$.',
                'Con calculadora en $x = 1 \\pm 0.001$: $\\frac{f(1.001) - f(0.999)}{0.002} \\approx 26.000$. ¡Coincidencia perfecta!'
              ],
              result: '$f\'(1) = 26$',
              simple: 'Evaluar la pendiente numérica en $x=1$ toma 10 segundos y valida todos tus exponentes de golpe.'
            }
          ]
        },
        {
          simple: 'En a) aplicamos $(u\'v - uv\')/v^2$ con cuidado de respetar el signo menos al distribuir; en b) derivamos la raíz externa $\\frac{1}{2\\sqrt{\\text{algo}}}$ y multiplicamos por la derivada $10x$ de lo de adentro.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Reescribir g(x) como producto + Leibniz en h(x)',
              title: 'Derivar $g(x) = (3x-1)(x^2+2)^{-1}$ y usar variable $u$ en $h(x)$',
              when: 'Evita memorizar la fórmula del cociente y ordena visualmente la regla de la cadena.',
              steps: [
                'En a): $g\'(x) = 3(x^2+2)^{-1} + (3x-1)\\cdot [-(x^2+2)^{-2}(2x)] = \\frac{3(x^2+2) - 2x(3x-1)}{(x^2+2)^2} = \\frac{-3x^2+2x+6}{(x^2+2)^2}$.',
                'En b): haz $u = 5x^2+4$ y $h = \\sqrt{u}$. Entonces $\\frac{dh}{dx} = \\frac{1}{2\\sqrt{u}}\\cdot(10x) = \\frac{5x}{\\sqrt{5x^2+4}}$.'
              ],
              result: 'a) $\\frac{-3x^2+2x+6}{(x^2+2)^2}$; b) $\\frac{5x}{\\sqrt{5x^2+4}}$',
              simple: 'Escribir $v^{-1}$ te deja usar siempre la regla del producto si alguna vez dudas qué término resta en la del cociente.'
            },
            {
              badge: 'Método 3 · Diferenciación implícita en h² = 5x² + 4 y prueba en x = 0',
              title: 'Elevar al cuadrado $h^2 = 5x^2 + 4$ antes de derivar',
              when: 'Alternativa elegante cuando quieres esquivar potencias fraccionarias.',
              steps: [
                'Para $h(x) = \\sqrt{5x^2+4} > 0$: eleva al cuadrado $h^2 = 5x^2 + 4$.',
                'Deriva implícitamente: $2h\\,h\' = 10x \\implies h\' = \\frac{5x}{h} = \\frac{5x}{\\sqrt{5x^2+4}}$.',
                'En $x = 0$: $g\'(0) = \\frac{6}{4} = \\frac{3}{2}$ y $h\'(0) = 0$.'
              ],
              result: 'a) $\\frac{-3x^2+2x+6}{(x^2+2)^2}$; b) $\\frac{5x}{\\sqrt{5x^2+4}}$',
              simple: 'Elevando al cuadrado $h^2 = 5x^2+4$ derivas una cuadrática sencilla en vez de una raíz cuadrada.'
            }
          ]
        },
        {
          simple: 'Derivamos $(x^2+1)$ por $e^x$ sin derivar, más $(x^2+1)$ sin derivar por la derivada de $e^x$ (que es ella misma $e^x$); luego juntamos ambos con factor común $e^x$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Distributiva término a término (eˣ + x²eˣ)',
              title: 'Atajo general para cualquier producto $P(x)\\cdot e^x$',
              when: 'Súper útil cuando $P(x)$ es un polinomio: la derivada de $P(x)e^x$ siempre da $[P(x) + P\'(x)]e^x$!',
              steps: [
                'Como $(P(x)e^x)\' = P\'(x)e^x + P(x)e^x = [P(x) + P\'(x)]e^x$.',
                'Con $P(x)=x^2+1$, $P\'(x)=2x \\implies$ suma directo $(x^2+1+2x)e^x = (x+1)^2e^x$.',
                'Evalúa en $0$ ($1\\cdot 1 = 1$) y en $1$ ($4e$).'
              ],
              result: '$f\'(x)=(x+1)^2 e^x$, $f\'(0)=1$, $f\'(1)=4e$',
              simple: 'Un truco de oro para $P(x)e^x$: la derivada simplemente suma el polinomio original más su propia derivada, todo multiplicado por $e^x$.'
            },
            {
              badge: 'Método 3 · Derivación logarítmica sobre ln(f)',
              title: 'Transformar el producto en suma con $\\ln f = \\ln(x^2+1) + x$',
              when: 'Práctica útil cuando hay productos de varias funciones.',
              steps: [
                '$\\ln f(x) = \\ln(x^2+1) + \\ln(e^x) = \\ln(x^2+1) + x$.',
                '$\\frac{f\'(x)}{f(x)} = \\frac{2x}{x^2+1} + 1 = \\frac{x^2+2x+1}{x^2+1} \\implies f\'(x) = (x+1)^2 e^x$.'
              ],
              result: '$f\'(x)=(x+1)^2 e^x$',
              simple: 'Tomando $\\ln$ conviertes $e^x$ en una simple $+x$ cuya derivada vale $1$.'
            }
          ]
        },
        {
          simple: 'Primero bajamos el $3$ del cubo de afuera dejando el cociente intacto al cuadrado, y luego multiplicamos por la regla del cociente de lo que estaba adentro; simplificando llegamos a $f\'(2) = 1$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Separar primero como potencia de arriba sobre potencia de abajo',
              title: 'Aplicar cociente directo sobre $\\frac{(2x-1)^3}{(x+1)^3}$ o Derivación Logarítmica',
              when: 'La derivación logarítmica hace desaparecer los cubos y las fracciones.',
              steps: [
                'Aplica logaritmo natural: $\\ln(f(x)) = 3\\ln(2x-1) - 3\\ln(x+1)$.',
                'Deriva ambos lados: $\\frac{f\'(x)}{f(x)} = 3\\cdot\\frac{2}{2x-1} - 3\\cdot\\frac{1}{x+1} = \\frac{6(x+1) - 3(2x-1)}{(2x-1)(x+1)} = \\frac{9}{(2x-1)(x+1)}$.',
                'Multiplica por $f(x) = \\frac{(2x-1)^3}{(x+1)^3}$: $f\'(x) = \\frac{9(2x-1)^2}{(x+1)^4}$, y en $x=2$ da $\\frac{9(9)}{81}=1$.'
              ],
              result: '$f\'(x) = \\frac{9(2x-1)^2}{(x+1)^4}$, $f\'(2) = 1$',
              simple: 'Tomando $\\ln$ separas la fracción elevada al cubo en una simple resta de logaritmos muy fácil de derivar.'
            },
            {
              badge: 'Método 3 · División polinomial previa (u = 2 - 3/(x+1))',
              title: 'Reescribir $\\frac{2x-1}{x+1} = 2 - \\frac{3}{x+1}$ antes de derivar',
              when: 'Para derivar lo interno sin usar regla del cociente.',
              steps: [
                'Observa $\\frac{2x+2 - 3}{x+1} = 2 - 3(x+1)^{-1}$.',
                'Su derivada interna es inmediata: $0 - 3(-1)(x+1)^{-2} = \\frac{3}{(x+1)^2}$.',
                'Por cadena en el cubo: $3\\left(\\frac{2x-1}{x+1}\\right)^2 \\cdot \\frac{3}{(x+1)^2} = \\frac{9(2x-1)^2}{(x+1)^4}$.'
              ],
              result: '$1$',
              simple: 'Dividiendo primero te ahorras la regla del cociente por completo.'
            }
          ]
        }
      ]
    },
    'der-3': {
      simpleIntro: 'Ampliamos nuestras herramientas para derivar ondas ($\\operatorname{sen}, \\cos, \\tan$), crecimientos exponenciales ($e^u, a^u$), logaritmos ($\\ln u$) y curvas dibujadas sin despejar $y$ (como círculos o elipses), además de armar tanto su tangente como su perpendicular normal.',
      simplePrereqs: 'Domina las derivadas trigonométricas básicas en radianes, las de $e^x$ y $\\ln x$, la regla de la cadena y el despeje básico de ecuaciones lineales.',
      detailedSimple: [
        'Al derivar senos o cosenos, recuerda que todas las funciones que empiezan con "co-" (coseno, cotangente, cosecante) sacan un signo menos, y nunca olvides multiplicar por la derivada del ángulo interno.',
        '$e^x$ es su propia derivada, pero si arriba lleva algo más ($e^u$) o si la base no es $e$ ($a^u$), multiplicas por $u\'$ (y por $\\ln a$ si aplica). En $\\ln u$ simplemente divides $u\'$ entre $u$.',
        'Cuando $x$ e $y$ vienen mezcladas sin despejar $y$, derivas cada término normal pero, cada vez que derivas una $y$, aplicas regla de la cadena multiplicando ese pedazo por $y\'$ ($\\frac{dy}{dx}$), y al final la despejas.'
      ],
      conceptsSimple: [
        'En cualquier derivada compuesta, el argumento interno (el ángulo, el exponente o lo que está dentro de $\\ln$) se copia idéntico en el paso de afuera y luego multiplica afuera por $u\'$.',
        'En exponencial queda la misma exponencial multiplicada por la derivada de su exponente; en logaritmo queda la derivada del contenido arriba dividida entre el contenido original abajo.',
        'Cuando $y$ depende ocultamente de $x$, derivar $y^3$ produce $3y^2 \\cdot \\frac{dy}{dx}$; luego juntas todos los términos con $\\frac{dy}{dx}$ de un lado y factorizas para despejarlo.',
        'La recta normal forma $90^\\circ$ con la tangente en el punto de contacto, así que su pendiente es el recíproco cambiado de signo: $-1/m_t$.'
      ],
      theoremsSimple: [
        'Si escribes $y = \\ln(x)$ en su forma inversa $e^y = x$ y derivas implícitamente ($e^y \\cdot y\' = 1$), descubres por qué $y\' = 1/e^y = 1/x$.'
      ],
      formulasSimple: [
        'Memoriza el patrón visual: $(e^u)\' = e^u u\'$ conserva la exponencial, mientras $(\\ln u)\' = \\frac{u\'}{u}$ borra el logaritmo dejando una fracción.',
        'Las pendientes tangente y normal siempre cumplen $m_t \\cdot m_n = -1$ (cuando ninguna es cero ni vertical).'
      ],
      mistakesSimple: [
        '$e^{x^2}$ NO es una potencia de base $x$ (no bajes el exponente $x^2$); su base es la constante $e$, así que se copia igual y se multiplica por la derivada de arriba ($2x\\,e^{x^2}$).',
        'Cada vez que derivas una $y$ con respecto a $x$, esa $y$ oculta es una función compuesta y obliga a multiplicar por $\\frac{dy}{dx}$ ($y\'$).'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Simplificar logaritmos ANTES de derivar',
          title: 'Expandir $\\ln(A\\cdot B^k / C)$ con leyes de logaritmos antes de aplicar $\\frac{u\'}{u}$',
          when: 'Ahorra horas en expresiones como $\\ln\\sqrt{\\frac{x^2+1}{x-3}}$ o derivadas con raíces y cocientes dentro de $\\ln$.',
          idea: 'Un cociente dentro de un $\\ln$ es horrible con regla del cociente, pero expandido como $\\frac{1}{2}\\ln(x^2+1) - \\frac{1}{2}\\ln(x-3)$ se deriva mentalmente.',
          steps: [
            'Aplica $\\ln(AB) = \\ln A + \\ln B$, $\\ln(A/B) = \\ln A - \\ln B$ y $\\ln(A^k) = k\\ln A$.',
            'Deriva cada logaritmo sencillo por separado usando $u\'/u$.',
            'Combina el resultado solo si piden fracción única.'
          ],
          miniExample: 'Para $\\ln(x^2\\sqrt{x+1}) = 2\\ln x + \\frac{1}{2}\\ln(x+1) \\xrightarrow{d/dx} \\frac{2}{x} + \\frac{1}{2(x+1)}$.',
          simple: 'Antes de derivar un logaritmo grande, pártele las multiplicaciones, divisiones y potencias usando las leyes de logaritmos; queda facilísimo.'
        },
        {
          badge: 'Forma 2 · Derivación Logarítmica (para y = uᵛ o productos largos)',
          title: 'Tomar $\\ln$ en ambos lados para derivar $x^x$, $(\\operatorname{sen} x)^x$ o mega-productos',
          when: 'Obligatoria cuando tanto la base como el exponente tienen $x$ (como $y = x^x$).',
          idea: 'Aplicas $\\ln y$, bajas el exponente multiplicando, derivas implícitamente $\\frac{y\'}{y}$ y multiplicas por $y$.',
          steps: [
            'Toma $\\ln y = \\ln(f(x))$ y usa propiedades para bajar exponentes y separar productos.',
            'Deriva respecto a $x$: izquierda siempre da $\\frac{y\'}{y}$; derecha suele ser producto sencillo.',
            'Despeja $y\' = y \\cdot [\\dots]$ sustituyendo $y$ por la función original.'
          ],
          miniExample: '$y = x^x \\implies \\ln y = x\\ln x \\implies \\frac{y\'}{y} = 1\\cdot\\ln x + x\\cdot\\frac{1}{x} = \\ln x + 1 \\implies y\' = x^x(\\ln x + 1)$.',
          simple: 'Para cosas raras como $x^x$ donde la $x$ está abajo y arriba a la vez, aplicas $\\ln$ primero para bajar el exponente y derivas normal.'
        },
        {
          badge: 'Forma 3 · Implícita Clásica vs. Atajo de Parciales (-Fₓ / Fᵧ)',
          title: 'Derivar término a término con $y\'$ vs. Fórmula rápida $-F_x / F_y$',
          when: 'Para cualquier curva implícita $F(x, y) = 0$ (como $x^2+y^2=25$ o $xe^y+2y=3x$).',
          idea: 'Además del método paso a paso de derivar cada término y despejar $y\'$, puedes confirmar en segundos usando derivadas parciales: $y\' = -\\frac{\\partial F / \\partial x}{\\partial F / \\partial y}$.',
          steps: [
            'Lleva todo a un lado: $F(x, y) = 0$.',
            'Calcula $F_x$ (derivando tratando $y$ como constante) y $F_y$ (derivando tratando $x$ como constante).',
            'Divide $-F_x / F_y$ (siempre que $F_y \\neq 0$).'
          ],
          miniExample: 'Para $F = x e^y + 2y - 3x = 0$: $F_x = e^y - 3$, $F_y = x e^y + 2 \\implies \\frac{dy}{dx} = -\\frac{e^y-3}{xe^y+2} = \\frac{3-e^y}{xe^y+2}$.',
          simple: 'Con el atajo $-F_x / F_y$ derivas primero pensando que $y$ es número fijo (arriba con menos) y abajo pensando que $x$ es número fijo, confirmando tu despeje al instante.'
        },
        {
          badge: 'Forma 4 · Despejar y o usar Geometría vs. Implícita',
          title: 'Comparar despeje explícito ($y=\\sqrt{25-x^2}$), geometría radial y derivación implícita',
          when: 'Cuando la ecuación sí puede despejarse (ej. circunferencias, hipérbolas) o pide solo la pendiente en UN punto numérico.',
          idea: 'En un punto numérico $(x_0, y_0)$, puedes sustituir los números INMEDIATAMENTE después de derivar implícitamente sin perder tiempo despejando algebraicamente $y\'$ primero.',
          steps: [
            'Deriva implícitamente toda la ecuación.',
            'Si solo te piden la pendiente $m_t$ en $(x_0, y_0)$, reemplaza $x = x_0, y = y_0$ antes de despejar $y\'$.',
            'En circunferencias, comprueba además geométricamente: la tangente es perpendicular al radio desde el centro.'
          ],
          miniExample: 'En $x^2+y^2=25$ $\\implies 2x + 2y\\,y\' = 0$; metiendo $(3,4)$ ya queda $6 + 8y\'=0 \\implies y\' = -3/4$.',
          simple: 'Si solo buscas el número de la pendiente en un punto, mete $(x_0, y_0)$ justo después de derivar; despejar números es mucho más fácil que despejar letras.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Para el primer bloque combinamos regla del producto con cadena en $e^{3x}$ (multiplica por $3$) y en $\\operatorname{sen}(2x)$ (multiplica por $2$); al logaritmo le aplicamos $u\'/u$ directo dando $\\frac{2x}{x^2+5}$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Comprobación término a término con sustitución u',
              title: 'Descomponer $f(x) = T_1(x) + T_2(x)$ con derivadas auxiliares explícitas',
              when: 'Evita errores de factorización de coeficientes ($3$ y $2$) en la cadena.',
              steps: [
                'En $T_1 = e^{3x}\\operatorname{sen}(2x)$: usa $A = e^{3x} \\implies A\'=3e^{3x}$ y $B = \\operatorname{sen}(2x) \\implies B\'=2\\cos(2x)$.',
                'Arma $A\'B + AB\' = e^{3x}[3\\operatorname{sen}(2x)+2\\cos(2x)]$.',
                'En $T_2 = \\ln(u)$ con $u = x^2+5$: $u\'/u = 2x/(x^2+5)$.'
              ],
              result: '$e^{3x}[3\\operatorname{sen}(2x)+2\\cos(2x)] + \\frac{2x}{x^2+5}$',
              simple: 'Anotar primero $A, A\'$ y $B, B\'$ aparte elimina prácticamente todos los errores de olvido en cadena.'
            },
            {
              badge: 'Método 3 · Fórmula rápida para eᵃˣ sen(bx) y prueba en x = 0',
              title: 'Aplicar $(e^{ax}\\operatorname{sen}(bx))\' = e^{ax}[a\\operatorname{sen}(bx) + b\\cos(bx)]$',
              when: 'Patrón directo muy común en física (oscilaciones amortiguadas) y ecuaciones diferenciales.',
              steps: [
                'Con $a = 3, b = 2$: sustituye de golpe $e^{3x}[3\\operatorname{sen}(2x) + 2\\cos(2x)]$.',
                'Comprueba en $x = 0$: la derivada debe valer $1[0 + 2(1)] + \\frac{0}{5} = 2$ (confirmado numéricamente cerca de $0$).'
              ],
              result: '$e^{3x}[3\\operatorname{sen}(2x)+2\\cos(2x)] + \\frac{2x}{x^2+5}$',
              simple: 'Aprende el patrón fijo: en $e^{ax}\\operatorname{sen}(bx)$ siempre queda $e^{ax}$ multiplicando a $a$ veces la original más $b$ veces su pareja coseno.'
            }
          ]
        },
        {
          simple: 'Derivamos $x^2+y^2=25$ recordando multiplicar $2y$ por $\\frac{dy}{dx}$ y despejamos $-x/y$. En $P(3,4)$ eso da tangente $-3/4$, y volteando con signo opuesto obtenemos normal $+4/3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Despejar y(x) explícitamente (semicircunferencia superior)',
              title: 'Derivar $y = \\sqrt{25 - x^2}$ directamente',
              when: 'Confirma que la implícita coincide con el cálculo explícito cuando $y > 0$.',
              steps: [
                'Como $P(3, 4)$ tiene $y = 4 > 0$, la rama es $y = (25 - x^2)^{1/2}$.',
                'Por cadena: $y\' = \\frac{1}{2}(25 - x^2)^{-1/2}(-2x) = \\frac{-x}{\\sqrt{25 - x^2}} = -\\frac{x}{y}$.',
                'En $x = 3$: $y\' = -3/4$.'
              ],
              result: 'Tangente $m_t = -\\frac{3}{4}$, Normal $m_n = \\frac{4}{3}$',
              simple: 'Aunque despejes $y=\\sqrt{25-x^2}$ y uses regla de la cadena, llegas al mismo $-3/4$ (pero implícita fue diez veces más corta).'
            },
            {
              badge: 'Método 3 · Geometría pura (Radio = Normal)',
              title: 'El radio desde el centro $(0, 0)$ hasta $P(3, 4)$ es la recta normal',
              when: 'En círculos la geometría te regala la respuesta en 3 segundos.',
              steps: [
                'Pendiente del radio entre $(0, 0)$ y $(3, 4)$: $m_n = \\frac{4 - 0}{3 - 0} = \\frac{4}{3}$.',
                'La tangente es perpendicular al radio: $m_t = -\\frac{1}{m_n} = -\\frac{3}{4}$.'
              ],
              result: '$m_t = -\\frac{3}{4}$, $m_n = \\frac{4}{3}$',
              simple: 'La línea normal de cualquier punto en un círculo es simplemente el rayo que sale del centro $(0,0)$ hacia $(3,4)$.'
            }
          ]
        },
        {
          simple: 'Aplicamos regla del producto en $x e^y$ recordando que la derivada de $e^y$ saca $e^y \\cdot y\'$. Metiendo $(0,0)$ casi todo se simplifica dando pendiente $m_t = 1$ (tangente $y=x$) y normal $m_n = -1$ ($y=-x$).',
          alternativeMethods: [
            {
              badge: 'Método 2 · Atajo con derivadas parciales y sustituyendo P(0,0) de una vez',
              title: 'Evaluar $-F_x / F_y$ directamente en $(0, 0)$',
              when: 'Más veloz y menos propenso a errores algebraicos si solo quieres las rectas en $(0,0)$.',
              steps: [
                'Sea $F(x,y) = x e^y + 2y - 3x$.',
                'Calcula $F_x = e^y - 3 \\implies$ en $(0,0)$ vale $1 - 3 = -2$.',
                'Calcula $F_y = x e^y + 2 \\implies$ en $(0,0)$ vale $0 + 2 = 2$.',
                'Por fórmula: $m_t = -\\frac{F_x}{F_y} = -\\frac{-2}{2} = 1$, $m_n = -1$.'
              ],
              result: '$\\frac{dy}{dx} = \\frac{3 - e^y}{x e^y + 2}$; Tangente $y = x$, Normal $y = -x$',
              simple: 'Con $-F_x / F_y$ calculas dos derivaditas cortas y metes $(0,0)$ al momento para hallar $m_t=1$.'
            },
            {
              badge: 'Método 3 · Despejar x en función de y (dx/dy y voltear)',
              title: 'Ver la curva como $x(y) = \\frac{2y}{3 - e^y}$ cerca de $(0, 0)$',
              when: 'Útil cuando es más fácil despejar $x$ que $y$.',
              steps: [
                'De $x e^y + 2y = 3x$ despeja $x = \\frac{2y}{3 - e^y}$.',
                'Deriva respecto a $y$ en $y=0$: $\\frac{dx}{dy}\\big|_{y=0} = \\frac{2(3-1) - 0}{(3-1)^2} = \\frac{4}{4} = 1$.',
                'Invierte para obtener $\\frac{dy}{dx} = \\frac{1}{dx/dy} = 1$. ¡Idéntico!'
              ],
              result: 'Tangente $y = x$, Normal $y = -x$',
              simple: 'Cuando resulta imposible despejar $y$, muchas veces sí puedes despejar $x$, derivar respecto a $y$ e invertir el número.'
            }
          ]
        }
      ]
    },
    'der-4': {
      simpleIntro: 'Ahora la derivada se vuelve tu brújula de gráficas y problemas reales: donde $f\'$ es cero hay cimas o valles; su signo te dice si subes o bajas; la segunda derivada $f\'\'$ te indica cómo se dobla la curva (concavidad); y todo unido sirve para encontrar máximos o mínimos reales (máxima área, mínimo costo).',
      simplePrereqs: 'Necesitas saber derivar bien, resolver ecuaciones $f\'(x)=0$ para sacar puntos críticos y analizar signos positivos/negativos por intervalos.',
      detailedSimple: [
        'Cuando vas subiendo una colina la pendiente $f\'$ es positiva; justo en la cima plana vale cero; al bajar se vuelve negativa. Los candidatos a cima o valle (puntos críticos) están donde $f\'=0$ o donde no existe derivada.',
        'Hay dos formas de saber si un punto crítico es cima o valle: mirar si el signo de $f\'$ pasa de $+$ a $-$ (criterio 1.ª derivada), o checar si la curva se curva hacia abajo con $f\'\' < 0$ (criterio 2.ª derivada).',
        'La segunda derivada mide hacia dónde se abre la curva: como tazón hacia arriba ($f\'\' > 0$) o como arco hacia abajo ($f\'\' < 0$). Donde cambia de un tipo a otro hay un punto de inflexión.'
      ],
      conceptsSimple: [
        'Signo positivo en $f\'$ significa gráfica creciendo hacia arriba; signo negativo significa bajando.',
        'Primer criterio revisa el antes y después de $f\'$ (funciona siempre); segundo criterio evalúa rápido $f\'\'(c)$ (falla si da cero, entonces vuelves al primero).',
        'Concavidad positiva abre como U feliz ($\\cup$); concavidad negativa abre como montaña triste ($\\cap$); inflexión es donde cambia la curvatura.',
        'Todo problema de optimización consiste en traducir el texto a una función de UNA sola letra, derivar, igualar a cero y verificar que de veras sea máximo o mínimo.'
      ],
      theoremsSimple: [
        'Si una curva suave llega a su punto más alto o bajo en medio de un tramo abierto, su tangente ahí no puede quedar inclinada: obligatoriamente está horizontal ($f\'(c) = 0$).',
        'Si viajas en coche de $A$ a $B$ a una velocidad promedio de $80\\text{ km/h}$, en algún instante del recorrido tu velocímetro tuvo que marcar exactamente $80\\text{ km/h}$ (Teorema del Valor Medio).'
      ],
      formulasSimple: [
        'Puntos críticos salen de $f\'=0$ (extremos posibles) y posibles inflexiones salen de $f\'\'=0$ (confirmando cambio real de signo).'
      ],
      mistakesSimple: [
        'Que $f\'(c)=0$ NO garantiza cima ni valle: en $f(x)=x^3$ o $x^4-4x^3$ en $x=0$, la curva se aplana un instante pero sigue yendo en la misma dirección.',
        'Lee con calma qué pregunta el problema: si pregunta "dónde ocurre" respondes la $x$; si pregunta "cuál es el área/ganancia máxima" debes meter $x$ de vuelta en $f(x)$ para dar la altura $y$.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Criterio de la 1.ª Derivada (Signos)',
          title: 'Tabla de intervalos con el signo de $f\'(x)$ (funciona SIEMPRE)',
          when: 'Imprescindible cuando $f\'\'(c) = 0$ (como $x^4-4x^3$ en $x=0$), cuando hay valores absolutos/esquinas, o cuando $f\'\'$ es muy pesada de calcular.',
          idea: 'Factoriza $f\'(x)$, marca todos sus puntos críticos en la recta y evalúa un número fácil en cada tramo para ver el patrón de flechas ($\\nearrow$ o $\\searrow$).',
          steps: [
            'Calcula $f\'(x)$, factorízala y encuentra dónde vale $0$ o no existe.',
            'Divide el dominio en intervalos entre puntos críticos.',
            'Determina el signo de $f\'(x)$ en cada intervalo: $+\\to -$ es máximo local, $-\\to +$ es mínimo local, $+\\to +$ o $-\\to -$ NO es extremo.'
          ],
          miniExample: 'Para $f\'(x)=4x^2(x-3)$: en $x=0$, tanto a izquierda ($x=-1$) como derecha ($x=1$) da negativo ($-\\to -$), así que en $x=0$ no hay extremo.',
          simple: 'Mirar si la gráfica sube o baja antes y después de cada punto crítico jamás miente, ni siquiera en casos trampa donde $f\'\'=0$.'
        },
        {
          badge: 'Forma 2 · Criterio de la 2.ª Derivada',
          title: 'Test rápido con la concavidad $f\'\'(c)$ en puntos estacionarios',
          when: 'El camino más veloz para polinomios normales y problemas de optimización.',
          idea: 'Una vez tienes $f\'(c) = 0$, evalúa $f\'\'(c)$: si es positivo ($\\cup$, tazón hacia arriba) es mínimo; si es negativo ($\\cap$, arco hacia abajo) es máximo.',
          steps: [
            'Resuelve $f\'(x) = 0$ para hallar $c$.',
            'Calcula $f\'\'(x)$ y evalúala en $c$.',
            '$f\'\'(c) > 0 \\implies$ mínimo local; $f\'\'(c) < 0 \\implies$ máximo local; si $f\'\'(c) = 0$ pasa obligatoriamente a la Forma 1.'
          ],
          miniExample: 'En $A(x)=120x-2x^2$: $A\'(x)=120-4x=0 \\implies x=30$. Como $A\'\'(30)=-4 < 0$, confirmado que es área máxima.',
          simple: 'Piensa en la curvatura de $f\'\'$: negativo es una carita triste/montaña ($\\cap$) así que su centro es lo más alto (máximo); positivo es una copa ($\\cup$) y su centro es lo más bajo (mínimo).'
        },
        {
          badge: 'Forma 3 · Optimización: Derivada vs. Vértice / Desigualdad MA-MG',
          title: 'Comparar método del Cálculo con atajos algebraicos sin derivar',
          when: 'En optimización de rectángulos, cercas y funciones cuadráticas ($ax^2+bx+c$).',
          idea: 'Puedes usar la receta clásica de derivar $A\'(x)=0$, O en problemas cuadráticos hallar el vértice $x = -b/(2a)$, O usar desigualdad Media Aritmética–Geométrica ($a+b \\ge 2\\sqrt{ab}$, igualdad cuando $a=b$).',
          steps: [
            'Método Cálculo: plantea magnitud $M(x, y)$, sustituye restricción para dejar $M(x)$, resuelve $M\'(x)=0$ y valida con $M\'\'$.',
            'Atajo cuadrático: en $M(x) = ax^2+bx+c$, el óptimo está directo en $x = -b/(2a)$.',
            'Atajo simetría (MA-MG): cuando dos tramos suman fijo ($2x + y = 120$), su producto se maximiza cuando ambas partes del reparto valen la mitad ($2x = y = 60$).'
          ],
          miniExample: 'En cerca $2x + y = 120$: divide el presupuesto $120$ mitad y mitad entre largo ($y=60$) y el total de los dos anchos ($2x=60 \\implies x=30$). ¡Área $1800$ al instante!',
          simple: 'Para maximizar un rectángulo con perímetro fijo, siempre reparte la cerca en partes iguales entre lados horizontales y verticales ($2x = 60$ y $y = 60$).'
        },
        {
          badge: 'Forma 4 · Extremos Absolutos en [a, b] (Competencia de Fronteras)',
          title: 'Evaluar y comparar $f$ en puntos críticos interiores Y extremos $f(a), f(b)$',
          when: 'Cuando un problema da un intervalo cerrado $[a, b]$.',
          idea: 'Un máximo o mínimo absoluto puede vivir dentro (punto crítico) o en las paredes del intervalo $[a, b]$: lista TODOS los candidatos y quédate con el número mayor y menor de $f(x)$.',
          steps: [
            'Encuentra los puntos críticos que caigan ESTRICTAMENTE dentro de $(a, b)$.',
            'Calcula $f(a)$, $f(b)$ y $f(c_i)$ para todos los críticos internos.',
            'El mayor valor de $f$ es el máximo absoluto; el menor es el mínimo absoluto.'
          ],
          miniExample: 'Para $x^2$ en $[-1, 3]$: crítico $x=0$ da $0$; bordes $f(-1)=1$, $f(3)=9$. Mínimo abs $=0$, Máximo abs $=9$.',
          simple: 'En un tramo con inicio y fin cerrados, solo haz un torneo evaluando $f$ en los bordes y en los críticos internos: el número más grande gana el máximo absoluto.'
        },
        {
          badge: 'Forma 5 · Conexión Gráfica f, f\', f\'\' y TVM',
          title: 'Leer máximos e inflexiones desde la gráfica de $f\'$ y comprobar Teorema del Valor Medio',
          when: 'En ejercicios conceptuales donde te muestran la gráfica de $f\'(x)$ en vez de $f(x)$, o te piden hallar $c$ en el TVM.',
          idea: 'Cruces por cero de $f\'$ son extremos de $f$; máximos y mínimos de $f\'$ son puntos de inflexión de $f$ (ahí es donde $f\'\'=0$!).',
          steps: [
            'En la gráfica de $f\'(x)$: mira dónde está arriba del eje ($f$ sube) o abajo ($f$ baja).',
            'Los picos o valles de $f\'(x)$ indican puntos de inflexión de $f(x)$.',
            'En TVM en $[a, b]$: calcula la pendiente secante $\\frac{f(b)-f(a)}{b-a}$ e igualala a $f\'(c)$.'
          ],
          miniExample: 'Si $f\'(x) = 3(x-1)(x-3)$: cruza cero en $1$ y $3$ (extremos de $f$); su vértice en $x=2$ donde $f\'\'=0$ es el punto de inflexión.',
          simple: 'Cualquier cima o valle que veas en el dibujo de $f\'$ señala automáticamente un punto de inflexión en la curva original $f$.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Derivamos $f\'(x) = 3x^2-12x+9$, la factorizamos en $3(x-1)(x-3)$ para hallar los críticos $1$ y $3$, probamos dónde sube o baja, y con $f\'\'(x)=6x-12$ ubicamos la inflexión en $x=2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Criterio rápido de la 2.ª Derivada',
              title: 'Evaluar $f\'\'(1)$ y $f\'\'(3)$ en vez de construir tabla de signos',
              when: 'Más rápido que evaluar valores de prueba en cada intervalo.',
              steps: [
                'Ya que $f\'\'(x) = 6x - 12$ y los críticos son $x=1$ y $x=3$:',
                'Evalúa $f\'\'(1) = 6(1) - 12 = -6 < 0 \\implies$ Máximo local en $(1, f(1)) = (1, 5)$.',
                'Evalúa $f\'\'(3) = 6(3) - 12 = +6 > 0 \\implies$ Mínimo local en $(3, f(3)) = (3, 1)$.'
              ],
              result: 'Máx $(1, 5)$, Mín $(3, 1)$, Inflexión $(2, 3)$',
              simple: 'Con $f\'\'(x)=6x-12$ ves en dos segundos que en $1$ es negativa (cima) y en $3$ positiva (valle), sin tener que armar tabla de intervalos.'
            },
            {
              badge: 'Método 3 · Simetría natural de las cúbicas',
              title: 'Toda cúbica es simétrica respecto a su punto de inflexión',
              when: 'Comprobación geométrica en funciones de grado 3.',
              steps: [
                'Nota que el punto de inflexión ($x_i = 2$) queda justo en el punto medio entre el máximo ($x=1$) y el mínimo ($x=3$).',
                'Sus alturas también promedian exacto: $\\frac{5 + 1}{2} = 3 = f(2)$.'
              ],
              result: 'Inflexión exacta en el punto medio $(2, 3)$',
              simple: 'En cualquier función cúbica, el punto de inflexión siempre cae justo a la mitad entre el máximo y el mínimo.'
            }
          ]
        },
        {
          simple: 'Expresamos el área usando solo el ancho $x$ ($A = x(120-2x)$), derivamos e igualamos a cero para obtener $x = 30\\text{ m}$ y largo $y = 60\\text{ m}$, logrando el área tope de $1800\\text{ m}^2$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Vértice parabólico o Reparto Equitativo (Sin derivar)',
              title: 'Completar el cuadrado / vértice $-b/(2a)$ o igualdad de presupuesto',
              when: 'Atajo instantáneo en optimizaciones cuadráticas.',
              steps: [
                'Como $A(x) = -2x^2 + 120x$ es una parábola hacia abajo, su vértice está en $x = -\\frac{120}{2(-2)} = 30\\text{ m}$.',
                'Por reparto equilibrado de la cerca $2x + y = 120$: dedica la mitad del alambre ($60\\text{ m}$) al lado paralelo al río ($y = 60$) y la otra mitad ($60\\text{ m}$) a los dos tramos laterales ($2x = 60 \\implies x = 30$).'
              ],
              result: '$x=30\\text{ m}$, $y=60\\text{ m}$, $A_{\\max}=1800\\text{ m}^2$',
              simple: 'Siempre que cercas tres lados con alambre total $L$, el lado largo paralelo mide justo la mitad ($L/2$) y cada lado corto un cuarto ($L/4$).'
            },
            {
              badge: 'Método 3 · Desigualdad Media Aritmética–Geométrica (MA-MG)',
              title: 'Acotar el área $(2x)\\cdot y$ desde la suma fija $2x + y = 120$',
              when: 'Demostración elegante de optimización usando álgebra pura sin derivadas.',
              steps: [
                'Por MA-MG para números positivos: $\\sqrt{(2x)\\cdot y} \\le \\frac{2x + y}{2} = \\frac{120}{2} = 60$.',
                'Elevando al cuadrado: $2xy \\le 3600 \\implies A = xy \\le 1800\\text{ m}^2$.',
                'El tope $1800$ solo se alcanza cuando los dos sumandos son iguales: $2x = y = 60 \\implies x = 30\\text{ m}$.'
              ],
              result: '$x=30\\text{ m}$, $y=60\\text{ m}$, $A_{\\max}=1800\\text{ m}^2$',
              simple: 'Como dos cosas que suman $120$ alcanzan su multiplicación más grande cuando valen igual ($60$ y $60$), $2x = 60$ y $y = 60$.'
            }
          ]
        },
        {
          simple: 'Igualando $f\'=0$ salen $x=0$ y $x=3$, pero al probar signos o mirar $x=0$ vemos que antes de $0$ baja y después de $0$ sigue bajando (es solo una meseta de descanso / inflexión horizontal); el mínimo real está en $x=3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Signo de f\' sin hacer tabla numérica',
              title: 'Factorización $f\'(x) = 4x^2(x - 3)$: el cuadrado $x^2 \\ge 0$ jamás cambia de signo',
              when: 'Para identificar puntos estacionarios falsos a simple vista.',
              steps: [
                'Observa $4x^2$: como está elevado a potencia par ($2$), es positivo tanto a la izquierda como a la derecha de $x=0$.',
                'Por lo tanto, el único factor capaz de cambiar el signo es $(x - 3)$ (cambia de $-$ a $+$ en $x = 3$).',
                'Multiplicidad par ($x^2$) $\\implies$ no hay extremo en $0$, sino silla horizontal.'
              ],
              result: 'Solo mínimo en $x = 3$ ($-27$); inflexiones en $x=0$ y $x=2$',
              simple: 'Cuando una raíz crítica sale repetida un número par de veces (como $x^2$), la derivada NO cambia de signo allí y por eso NO es máximo ni mínimo.'
            },
            {
              badge: 'Método 3 · Prueba mixta: 2.ª derivada en x = 3 y valores vecinos alrededor de x = 0',
              title: 'Confirmar $f\'\'(3) > 0$ y comparar alturas $f(-1), f(0), f(1)$',
              when: 'Útil para verificar rápidamente sin errores de tabla.',
              steps: [
                'En $x=3$: $f\'\'(3) = 12(3)^2 - 24(3) = 108 - 72 = +36 > 0 \\implies$ mínimo local en $(3, -27)$.',
                'En $x=0$, $f\'\'(0)=0$ no concluye; evaluamos valores alrededor: $f(-1) = 1+4 = 5 > f(0) = 0 > f(1) = 1-4 = -3$. Como baja antes y sigue bajando después, es punto de inflexión con tangente horizontal.'
              ],
              result: 'Mínimo en $(3, -27)$; silla horizontal en $(0, 0)$ e inflexión en $(2, -16)$',
              simple: 'Comparar tres alturas rápidas ($5 \\to 0 \\to -3$) demuestra al instante que en $0$ la curva no rebotó sino que siguió bajando.'
            }
          ]
        },
        {
          simple: 'Verificamos continuidad y derivabilidad de $x^3-x$ en $[0, 2]$, calculamos la inclinación promedio de la cuerda que une los dos extremos (da $3$), e igualamos $3c^2-1 = 3$ para encontrar $c = \\frac{2}{\\sqrt{3}} \\approx 1.1547$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Interpretación geométrica (Secante paralela)',
              title: 'Comparar visualmente la recta secante $y = 3x$ con la tangente en $c$',
              when: 'Para entender qué representa ese punto $c \\approx 1.155$ en la gráfica.',
              steps: [
                'Los extremos son $A(0, 0)$ y $B(2, 6)$, así que la secante es la recta $y = 3x$.',
                'Deslizando la recta $y = 3x + k$ hacia abajo paralelamente hasta que apenas toque a $y = x^3 - x$ en $(0, 2)$, el punto de roce ocurre exactamente en $c = 2/\\sqrt{3}$.'
              ],
              result: '$c = \\frac{2}{\\sqrt{3}} \\approx 1.1547$',
              simple: 'El número $c$ es el punto exacto donde la montaña tiene la misma inclinación que la cuerda recta tendida de punta a punta.'
            },
            {
              badge: 'Método 3 · Función auxiliar y Teorema de Rolle',
              title: 'Restar la recta secante $y = 3x$ para aplicar Rolle a $g(x) = f(x) - 3x$',
              when: 'Explica cómo se demuestra y verifica formalmente el Teorema del Valor Medio.',
              steps: [
                'Define la diferencia vertical entre curva y cuerda: $g(x) = (x^3 - x) - 3x = x^3 - 4x$.',
                'En los extremos vale cero: $g(0) = 0$ y $g(2) = 8 - 8 = 0$.',
                'Por el Teorema de Rolle existe $c \\in (0, 2)$ con $g\'(c) = 3c^2 - 4 = 0 \\implies c = \\frac{2}{\\sqrt{3}}$.'
              ],
              result: '$c = \\frac{2}{\\sqrt{3}} \\approx 1.1547$',
              simple: 'Si restas la línea inclinada de la cuerda, la gráfica se vuelve horizontal en las puntas y el punto más alejado de la cuerda te da directo $c$.'
            }
          ]
        }
      ]
    },
    'int-1': {
      simpleIntro: 'Integrar (o antiderivar) es literalmente jugar en reversa a derivar: te dan la rapidez $F\'(x)$ y reconstruyes qué función original $F(x)$ producía esa derivada, recordando agregar $+C$ por las constantes que pudieron desaparecer al derivar.',
      simplePrereqs: 'Solo necesitas recordar tus reglas básicas de derivación (especialmente potencias $x^n$, $e^x$, $\\ln x$, $\\operatorname{sen} x, \\cos x$) y pasar raíces a exponentes fraccionarios.',
      detailedSimple: [
        'Como la derivada de cualquier número constante suelto vale $0$, infinitas curvas idénticas desplazadas verticalmente ($x^2, x^2+5, x^2-10$) tienen la misma derivada; el $+C$ las representa a todas.',
        'La regla opuesta a bajar y restar exponente es exactamente lo inverso: primero sumas $1$ al exponente y luego divides entre ese nuevo número (salvo para $x^{-1} = 1/x$, que viene del logaritmo $\\ln|x|$).',
        'El mejor amigo de todo estudiante al integrar es derivar su respuesta al final: si al derivar obtienes el problema original, estás 100% seguro de que no te equivocaste.'
      ],
      conceptsSimple: [
        'Una antiderivada es simplemente buscar "qué función al derivarse da esto"; la integral indefinida incluye a toda la familia con $+C$.',
        'Para potencias sumas $1$ arriba y divides entre el nuevo exponente; puedes partir sumas y restas y sacar constantes numéricas multiplicando.',
        '$e^x$ queda igual porque es su propia derivada; $\\frac{1}{x}$ siempre da $\\ln|x|+C$ (el valor absoluto deja funcionar incluso $x < 0$).',
        'La derivada de $\\cos x$ tiene signo menos, así que al ir hacia atrás, la integral de $\\operatorname{sen} x$ es la que hereda el signo menos ($-\\cos x$).'
      ],
      theoremsSimple: [
        'Si dos coches arrancan desde distintos kilómetros pero mantienen exactamente la misma velocidad todo el viaje, la distancia que los separa siempre permanece constante ($F_1 - F_2 = C$).'
      ],
      formulasSimple: [
        'Sube $1$ al exponente y divide entre ese nuevo exponente; cuando el exponente es $-1$ (es decir $\\frac{1}{x}$), el resultado brinca a $\\ln|x|$.',
        'Ten a la vista los signos: $\\int \\cos x = +\\operatorname{sen} x$, pero $\\int \\operatorname{sen} x = -\\cos x$.'
      ],
      mistakesSimple: [
        'Si pones $n=-1$ en la regla de la potencia dividirías entre cero ($-1+1=0$). Por eso $1/x$ tiene su propia fórmula obligatoria: $\\ln|x| + C$.',
        'Usa esta prueba de 2 segundos para el signo trigonométrico: deriva tu respuesta; si da $+\\operatorname{sen} x$ o $+\\cos x$ como el original, acertaste el signo.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Convertir todo a potencias axⁿ',
          title: 'Reescribir raíces y fracciones simples antes de integrar',
          when: 'Paso obligatorio frente a expresiones como $\\sqrt{x}$ o $\\frac{3}{x^2}$.',
          idea: 'No existe "regla del cociente" para integrales: convierte cada término en $a\\,x^p$ (dejando solo $1/x$ como $x^{-1}$) e integra uno a uno.',
          steps: [
            'Reescribe $\\sqrt[n]{x^m} = x^{m/n}$ y $\\frac{c}{x^k} = c\\,x^{-k}$.',
            'Separa sumas y restas sacando los coeficientes constantes fuera.',
            'Suma $1$ al exponente y divide (para dividir entre fracción $p/q$, multiplica por su inversa $q/p$).'
          ],
          miniExample: '$\\int \\frac{3}{x^2}dx = 3\\int x^{-2}dx = 3\\cdot \\frac{x^{-1}}{-1} + C = -\\frac{3}{x} + C$.',
          simple: 'Para dividir entre una fracción nueva como $\\frac{3}{2}$, simplemente voltea y multiplica por $\\frac{2}{3}$.'
        },
        {
          badge: 'Forma 2 · Dividir polinomios o expandir productos antes',
          title: 'Simplificar algebraicamente cocientes monómicos o multiplicaciones antes de integrar',
          when: 'Cuando ves $(x+2)^2$ o $\\frac{x^3+2x}{x}$ dentro del signo integral.',
          idea: 'Jamás integres arriba y abajo por separado ni producto por separado: primero divide cada término de arriba entre el denominador (o expande el paréntesis).',
          steps: [
            'Si hay un único término abajo: parte la fracción $\\frac{A+B}{D} = \\frac{A}{D} + \\frac{B}{D}$.',
            'Si hay productos de binomios: desarrolla la multiplicación primero.',
            'Integra la suma simple resultante.'
          ],
          miniExample: '$\\int \\frac{x^3+2x}{x}dx = \\int(x^2+2)dx = \\frac{x^3}{3} + 2x + C$.',
          simple: 'Desarma primero multiplicaciones y divisiones hasta convertir todo en una fila de sumas y restas.'
        },
        {
          badge: 'Forma 3 · Problema de Valor Inicial (Hallar C)',
          title: 'Determinar la constante $C$ usando una condición $F(x_0) = y_0$ (o integral definida)',
          when: 'Cuando te piden la función específica que pasa por un punto dado.',
          idea: 'Puedes integrar con $+C$ y despejar $C$, O calcular directo usando integral definida desde $x_0$: $F(x) = y_0 + \\int_{x_0}^{x} F\'(t)\\,dt$.',
          steps: [
            'Forma A: halla $F(x) = [\\text{antiderivada}] + C$, sustituye $x=x_0, F(x_0)=y_0$ y despeja $C$.',
            'Forma B: evalúa $y_0 + [\\text{antiderivada}(x) - \\text{antiderivada}(x_0)]$.'
          ],
          miniExample: 'Si $F\'(x)=4x-3$ y $F(2)=5$: $F(x) = 5 + [(2x^2-3x) - (2(4)-6)] = 2x^2 - 3x + 3$.',
          simple: 'Metes el punto conocido como un ancla para fijar cuál de todas las curvas paralelas $+C$ pasa justo por ahí.'
        },
        {
          badge: 'Forma 4 · Verificación Inversa Instantánea (Derivar)',
          title: 'Probar siempre tu antiderivada derivándola',
          when: 'En TODA integral indefinida.',
          idea: 'Derivar es mucho más fácil que integrar; deriva tu resultado mentalmente y confirma que recuperas el integrando completo.',
          steps: [
            'Toma cada término de tu respuesta $F(x)$ y derívalo.',
            'Revisa coeficientes, signos y exponentes contra el enunciado.'
          ],
          miniExample: '¿Es $\\int 4\\sqrt{x}\\,dx = \\frac{8}{3}x^{3/2}$? Deriva: $\\frac{8}{3}\\cdot\\frac{3}{2}x^{1/2} = 4\\sqrt{x}$. ¡Exacto!',
          simple: 'Cada integral trae incorporada su propia llave de comprobación: derívala y si regresas al principio, sacaste $100\\%$ seguro.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Pasamos $\\sqrt{x}$ a $x^{1/2}$ y $3/x^2$ a $3x^{-2}$, aplicamos la regla de sumar $1$ al exponente (multiplicando por la fracción invertida), y en $5/x$ aplicamos la regla logarítmica $5\\ln|x|$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Comprobación por derivación directa',
              title: 'Derivar término a término la respuesta para confirmar exponentes y signos',
              when: 'Evita errores típicos al sumar $1$ a exponentes negativos ($-2 + 1 = -1$) o fraccionarios.',
              steps: [
                'Deriva $2x^3 \\to 6x^2$. Deriva $-\\frac{8}{3}x^{3/2} \\to -\\frac{8}{3}\\cdot\\frac{3}{2}x^{1/2} = -4\\sqrt{x}$.',
                'Deriva $-3x^{-1} \\to +3x^{-2} = \\frac{3}{x^2}$. Deriva $5\\ln|x|+C \\to \\frac{5}{x} + 0$. ¡Todos coinciden!'
              ],
              result: '$2x^3 - \\frac{8}{3}x^{3/2} - \\frac{3}{x} + 5\\ln|x| + C$',
              simple: 'Derivando término por término ves en segundos que el signo menos en $-3/x$ tenía que dar $+3/x^2$.'
            },
            {
              badge: 'Método 3 · Separar en integrales independientes + validación numérica en [1, 4]',
              title: 'Resolver bloque a bloque y comprobar cambio neto $F(4) - F(1)$',
              when: 'Recomendado cuando mezclas potencias enteras, fraccionarias, negativas y logarítmicas.',
              steps: [
                'Separa $I_1 = 6\\int x^2 dx = 2x^3$, $I_2 = -4\\int x^{1/2} dx = -\\frac{8}{3}x^{3/2}$, $I_3 = 3\\int x^{-2} dx = -\\frac{3}{x}$, $I_4 = 5\\int \\frac{dx}{x} = 5\\ln|x|$.',
                'Comprueba cambio neto en $[1, 4]$ (raíces exactas): $F(4)-F(1) = (128 - \\frac{64}{3} - \\frac{3}{4} + 5\\ln 4) - (2 - \\frac{8}{3} - 3 + 0) = 108.25 + 5\\ln 4$.'
              ],
              result: '$2x^3 - \\frac{8}{3}x^{3/2} - \\frac{3}{x} + 5\\ln|x| + C$',
              simple: 'Dividir una integral larga en cuatro piezas pequeñas evita confusiones al voltear fracciones o aplicar $\\ln|x|$ solo donde toca.'
            }
          ]
        },
        {
          simple: 'Primero antiderivamos $4x-3$ para tener $2x^2-3x+C$, luego metemos $x=2$ obligando a que dé $5$ y así descubrimos que la constante particular vale $C=3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Fórmula con integral definida desde x₀ = 2',
              title: 'Calcular $F(x) = F(2) + \\int_2^x (4t - 3)\\,dt$',
              when: 'Te ahorra crear la letra $C$ y despejarla en ecuaciones más largas.',
              steps: [
                '$F(x) = 5 + \\left[2t^2 - 3t\\right]_2^x = 5 + (2x^2 - 3x) - (2(4) - 6)$.',
                'Simplifica: $F(x) = 5 + 2x^2 - 3x - 2 = 2x^2 - 3x + 3$.'
              ],
              result: '$F(x) = 2x^2 - 3x + 3$',
              simple: 'Integrar directo desde tu punto conocido $x_0 = 2$ ajusta la altura automáticamente sin usar $+C$.'
            },
            {
              badge: 'Método 3 · Área trapecial bajo la recta F\'(t) = 4t - 3',
              title: 'Sumar a $F(2)=5$ el área del trapecio formado por la recta $F\'(t)$ entre $2$ y $x$',
              when: 'Demuestra geométricamente por qué acumular área desde $2$ reconstruye $F(x)$.',
              steps: [
                'La derivada $F\'(t) = 4t - 3$ es lineal: en $t=2$ vale $F\'(2) = 5$ y en $t=x$ vale $F\'(x) = 4x - 3$.',
                'Área acumulada: $\\frac{\\text{base}(\\text{alt}_1 + \\text{alt}_2)}{2} = \\frac{(x - 2)(5 + 4x - 3)}{2} = (x - 2)(2x + 1) = 2x^2 - 3x - 2$.',
                'Suma la altura inicial $F(2)=5$: $F(x) = 5 + 2x^2 - 3x - 2 = 2x^2 - 3x + 3$.'
              ],
              result: '$F(x) = 2x^2 - 3x + 3$',
              simple: 'Como la derivada $4t - 3$ dibuja una línea recta inclinada, sacar el área del trapecio desde $t=2$ te da la fórmula exacta de $F(x)$.'
            }
          ]
        },
        {
          simple: 'Partimos $\\frac{x^3+2x}{x}$ en $x^2 + 2$ dividiendo cada término entre $x$ antes de integrar; luego integramos cada pieza suelta y comprobamos derivando al revés.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Factorización previa antes de integrar',
              title: 'Sacar factor común $x$ arriba para simplificar el cociente',
              when: 'Alternativa cuando el numerador tiene una $x$ factorizable.',
              steps: [
                'Como $x \\neq 0$, factoriza $\\frac{x(x^2 + 2)}{x} = x^2 + 2$.',
                'Integra directo: $\\int(x^2 + 2 + 3\\cos x - 2e^x)dx = \\frac{x^3}{3} + 2x + 3\\operatorname{sen}(x) - 2e^x + C$.'
              ],
              result: '$\\frac{x^3}{3} + 2x + 3\\operatorname{sen}(x) - 2e^x + C$',
              simple: 'Factorizar $x$ arriba y cancelarla con la de abajo simplifica la fracción en un instante antes de integrar.'
            },
            {
              badge: 'Método 3 · Comprobación por derivada y evaluación en x = 1',
              title: 'Verificar que la derivada recupera incluso el cociente original $\\frac{x^3+2x}{x}$',
              when: 'Evita errores típicos con el signo de $\\int \\cos x$ y al reagrupar potencias.',
              steps: [
                'Deriva $F(x)$: $F\'(x) = x^2 + 2 + 3\\cos(x) - 2e^x$.',
                'Multiplica y divide la parte polinómica por $x$: $x^2 + 2 = \\frac{x(x^2+2)}{x} = \\frac{x^3+2x}{x}$ (idéntico para $x \\neq 0$).',
                'Evaluando en $x=1$: $F\'(1) = 3 + 3\\cos(1) - 2e$, exactamente igual al integrando original.'
              ],
              result: '$\\frac{x^3}{3} + 2x + 3\\operatorname{sen}(x) - 2e^x + C$',
              simple: 'Derivar tu resultado y reescribir $x^2 + 2$ como $\\frac{x^3+2x}{x}$ confirma signo y álgebra al $100\\%$.'
            }
          ]
        }
      ]
    },
    'int-2': {
      simpleIntro: 'Cuando una integral tiene funciones metidas una dentro de otra o multiplicadas, la integración directa ya no alcanza. Aquí usas dos trucos maestros: Sustitución (revertir la regla de la cadena cambiando una parte por $u$) e Integración por Partes (revertir la regla del producto).',
      simplePrereqs: 'Necesitas derivar ágilmente con regla de la cadena, calcular diferenciales ($du = g\'(x)dx$) y dominar las antiderivadas básicas.',
      detailedSimple: [
        'En sustitución buscas una expresión interna $u$ cuya derivada aparezca multiplicando junto al $dx$: cambias todo a $u$ para volver la integral tan simple como una tabla directa.',
        'Si arriba tienes justo la derivada del denominador completo, el resultado casi siempre es automáticamente el logaritmo natural del denominador.',
        'Cuando ves multiplicaciones mezcladas de familias distintas (como $x \\cdot e^{2x}$ o $\\ln x \\cdot 1$), usas partes: eliges una pieza fácil de derivar ($u$) y la otra fácil de integrar ($dv$).'
      ],
      conceptsSimple: [
        'Sustitución empaqueta una pieza entera en la letra $u$; si sobra una constante numérica como un $2$, entra fácil como $1/2$, pero si sobra una $x$ que no estaba, no puedes sacarla del símbolo integral.',
        'Cada vez que ves el cociente "derivada de abajo arriba" ($g\'(x)/g(x)$), la antiderivada es $\\ln|g(x)| + C$.',
        'La palabra clave **ILATE** (Inversa trig, Logarítmica, Algebraica, Trigonométrica, Exponencial) te ordena de izquierda a derecha qué conviene elegir como $u$ para derivar.'
      ],
      theoremsSimple: [
        'Si integras a ambos lados la regla del producto $(u\\cdot v)\' = u\'v + uv\'$ y despejas $\\int u\\,dv$, aparece mágicamente la fórmula de integración por partes.'
      ],
      formulasSimple: [
        'Reemplaza tanto el bloque interno $g(x)$ por $u$ como el paquete $g\'(x)dx$ por $du$; integra en $u$ y regresa a $x$.',
        'En partes, intercambias la integral difícil $\\int u\\,dv$ por $uv$ menos otra integral $\\int v\\,du$ donde derivaste $u$ para hacerla más sencilla.'
      ],
      mistakesSimple: [
        'Solo los números puros ($2, -5, \\pi$) pueden salir o entrar del signo integral; jamás saques afuera una variable $x$.',
        'Si el ejercicio empezó con la letra $x$, la respuesta final siempre tiene que regresar a $x$, nunca quedarse en $u$.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Sustitución u = g(x) y Ajuste de Constante',
          title: 'Cambio de variable clásico vs. sustitución mental directa',
          when: 'Cuando aparece una función compuesta junto a un múltiplo de su derivada interna.',
          idea: 'Define $u = \\text{lo de adentro}$, calcula $du = u\'dx$, sustituye y deja todo en $u$; si falta una constante como $2$, multiplica adentro por $2$ y afuera por $1/2$.',
          steps: [
            'Elige $u$ igual al interior de la raíz, potencia, ángulo o exponente.',
            'Deriva para hallar $du = g\'(x)\\,dx$ y despeja $dx$ (o ajusta la constante).',
            'Integra en $u$ y vuelve a sustituir $u = g(x)$ (+C).'
          ],
          miniExample: 'En $\\int x\\sqrt{x^2+9}\\,dx$, con $u=x^2+9$, $du = 2x\\,dx \\implies \\frac{1}{2}\\int u^{1/2}du = \\frac{1}{3}(x^2+9)^{3/2}+C$.',
          simple: 'Busca una pieza cuya derivada ya esté flotando en el integrando; la envuelves en $u$ y todo se encoge.'
        },
        {
          badge: 'Forma 2 · Sustitución Radical Racionalizadora',
          title: 'Cambiar TODA la raíz ($t = \\sqrt{g(x)}$ o $t^2 = g(x)$) y sustitución algebraica extra',
          when: 'Brillante cuando sobra alguna $x$ extra (ej. $\\int x\\sqrt{x+4}\\,dx$) o con raíces cuadradas/cúbicas.',
          idea: 'Si haces $t = \\sqrt{x^2+9}$ ($t^2 = x^2+9 \\implies t\\,dt = x\\,dx$), desaparece hasta el exponente fraccionario $1/2$ y solo integras un polinomio entero $t^2$!',
          steps: [
            'Haz $t = \\sqrt{\\dots}$, eleva al cuadrado para quitar la raíz y diferencia implícitamente ($2t\\,dt = \\dots$).',
            'Reemplaza tanto la raíz por $t$ como el factor con $dx$.',
            'Integra un simple polinomio en $t$ y regresa a la raíz original.'
          ],
          miniExample: 'Con $t=\\sqrt{x^2+9}$: $t^2 = x^2+9 \\implies t\\,dt = x\\,dx \\implies \\int t\\cdot(t\\,dt) = \\int t^2 dt = \\frac{t^3}{3}+C = \\frac{1}{3}(x^2+9)^{3/2}+C$.',
          simple: 'Si llamas $t$ a la raíz entera con todo y símbolo $\\sqrt{\\phantom{x}}$, te libras por completo de los exponentes fraccionarios.'
        },
        {
          badge: 'Forma 3 · Integración por Partes (Fórmula ILATE)',
          title: 'Elegir $u$ con ILATE y aplicar $\\int u\\,dv = uv - \\int v\\,du$',
          when: 'Productos de familias distintas ($x e^{2x}, x\\operatorname{sen} x$) o funciones solas sin fórmula directa ($\\ln x, \\arctan x$).',
          idea: 'Elige como $u$ la primera función en la palabra **ILATE** (simplifica al derivarse) y deja el resto con $dx$ como $dv$.',
          steps: [
            'Asigna $u$ según ILATE y $dv$ con el resto.',
            'Deriva $u \\to du$ e integra $dv \\to v$.',
            'Aplica $uv - \\int v\\,du$ y resuelve la nueva integral.'
          ],
          miniExample: 'Para $\\int \\ln(x)\\,dx$, por ILATE (L antes que A=1) elige $u=\\ln x$ y $dv=1\\,dx \\implies x\\ln x - x + C$.',
          simple: 'ILATE te dice en orden quién quiere ser derivada ($u$): Logaritmos y Algebraicas antes que Trigonométricas y Exponenciales.'
        },
        {
          badge: 'Forma 4 · Método Tabular (Método DI Ultra-Rápido)',
          title: 'Tabla de Derivadas e Integrales con signos alternados ($+, -, +, \\dots$)',
          when: 'Cualquier integral de la forma $x^n e^{ax}$, $x^n \\operatorname{sen}(ax)$ o $x^n \\cos(ax)$ (ahorra hacer partes 1, 2 o 3 veces!).',
          idea: 'Columna izquierda **D**: deriva el polinomio hasta llegar a $0$. Columna derecha **I**: integra la exponencial/trigonométrica el mismo número de veces. Multiplica en diagonal con signos alternados $+, -, +, \\dots$.',
          steps: [
            'Columna D: escribe $u$ y deriva hacia abajo hasta llegar a $0$.',
            'Columna I: escribe $dv$ al mismo nivel e integra hacia abajo.',
            'Traza flechas diagonales bajando de D hacia I multiplicando alternadamente por $+1, -1, +1, \\dots$'
          ],
          miniExample: 'Para $\\int x e^{2x}dx$: D=[$x, 1, 0$]; I=[$e^{2x}, \\frac{1}{2}e^{2x}, \\frac{1}{4}e^{2x}$]. Diagonales: $+x(\\frac{1}{2}e^{2x}) - 1(\\frac{1}{4}e^{2x}) + C$.',
          simple: 'El método tabular hace dos columnas (derivar hasta cero / integrar) y las multiplica en diagonal alternando $+$ y $-$; resuelve en 10 segundos lo que por partes tomaría media página.'
        },
        {
          badge: 'Forma 5 · Coeficientes Indeterminados (Ingeniería inversa derivando)',
          title: 'Proponer la forma de la antiderivada y hallar $A, B$ derivando',
          when: 'Para comprobar o resolver integrales tipo $(ax+b)e^{kx}$ o $e^{ax}\\operatorname{sen}(bx)$ sin hacer partes repetido.',
          idea: 'La antiderivada de $(x)e^{2x}$ tiene que ser $(Ax + B)e^{2x}$: derívala e iguala coeficientes con $x e^{2x}$.',
          steps: [
            'Propón $F(x) = (Ax + B)e^{2x}$.',
            'Deriva: $F\'(x) = (2Ax + A + 2B)e^{2x}$.',
            'Iguala con $1x + 0$: $2A = 1 \\implies A = 1/2$, y $A + 2B = 0 \\implies B = -1/4$.'
          ],
          miniExample: '$F(x) = (\\frac{1}{2}x - \\frac{1}{4})e^{2x} + C$.',
          simple: 'Adivinas la familia de la respuesta con letras $A$ y $B$, la derivas e igualas números; evitas por completo integrar por partes.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Elegimos $u = x^2 + 9$ porque su derivada $2x$ casi iguala la $x$ que acompaña afuera; metemos $du/(2x)$ para cancelar la $x$, integramos $u^{1/2}$ y volvemos a poner $x^2+9$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Sustitución radical t = √(x² + 9)',
              title: 'Eliminar por completo la raíz cuadrada antes de integrar',
              when: 'Evita manipular exponentes fraccionarios ($1/2$ y $3/2$).',
              steps: [
                'Haz $t = \\sqrt{x^2 + 9} \\implies t^2 = x^2 + 9$.',
                'Diferencia ambos lados: $2t\\,dt = 2x\\,dx \\implies t\\,dt = x\\,dx$.',
                'Sustituye la raíz por $t$ y $x\\,dx$ por $t\\,dt$: $\\int t \\cdot (t\\,dt) = \\int t^2\\,dt = \\frac{t^3}{3} + C$.',
                'Regresa $t = (x^2+9)^{1/2}$: $\\frac{1}{3}(x^2 + 9)^{3/2} + C$.'
              ],
              result: '$\\frac{1}{3}(x^2 + 9)^{3/2} + C$',
              simple: 'Con $t = \\sqrt{x^2+9}$ la integral complicada se vuelve simplemente $\\int t^2\\,dt = t^3/3$.'
            },
            {
              badge: 'Método 3 · Sustitución mental completando la diferencial',
              title: 'Multiplicar por $2$ adentro y $\\frac{1}{2}$ afuera de golpe',
              when: 'Atajo directo sin declarar variable auxiliar aparte.',
              steps: [
                'Reescribe $\\frac{1}{2}\\int (x^2+9)^{1/2} \\cdot (2x\\,dx)$.',
                'Como ya tienes la derivada interna $(2x)$ multiplicando, aplica potencia directo al paréntesis: $\\frac{1}{2} \\cdot \\frac{(x^2+9)^{3/2}}{3/2} + C = \\frac{1}{3}(x^2+9)^{3/2}+C$.'
              ],
              result: '$\\frac{1}{3}(x^2 + 9)^{3/2} + C$',
              simple: 'Cuando solo te falta el $2$ para completar la derivada de adentro, multiplicas por $2$ adentro y $1/2$ afuera y sumas $1$ al exponente de inmediato.'
            }
          ]
        },
        {
          simple: 'Con ILATE elegimos $u = x$ (porque al derivarlo baja a $1$ y desaparece) y $dv = e^{2x}dx$ (fácil de integrar dividiendo entre $2$); luego aplicamos $uv - \\int v\\,du$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Método Tabular (DI)',
              title: 'Dos columnas: derivar $x$ hasta $0$ e integrar $e^{2x}$ con signos $+, -$',
              when: 'Mucho más rápido y visual, especialmente si fuera $x^2 e^{2x}$ o $x^3 e^{2x}$.',
              steps: [
                'Columna D (derivar): $x \\to 1 \\to 0$. Columna I (integrar): $e^{2x} \\to \\frac{1}{2}e^{2x} \\to \\frac{1}{4}e^{2x}$.',
                'Multiplica en diagonal hacia abajo: $+\\;x\\cdot(\\frac{1}{2}e^{2x})\\;-\\;1\\cdot(\\frac{1}{4}e^{2x}) + C$.',
                'Factoriza: $\\frac{e^{2x}}{4}(2x - 1) + C$.'
              ],
              result: '$\\frac{e^{2x}}{4}(2x - 1) + C$',
              simple: 'Con la tabla DI solo derivas una columna, integras la otra y multiplicas en diagonal alternando $+$ y $-$.'
            },
            {
              badge: 'Método 3 · Coeficientes indeterminados (Ax + B)e²ˣ',
              title: 'Derivar $(Ax + B)e^{2x}$ e igualar con $x e^{2x}$',
              when: 'Sin integración por partes ni tablas.',
              steps: [
                '$\\frac{d}{dx}[(Ax + B)e^{2x}] = (2Ax + A + 2B)e^{2x}$.',
                'Igualando con $x e^{2x}$: $2A = 1 \\implies A = \\frac{1}{2}$, y $A + 2B = 0 \\implies B = -\\frac{1}{4}$.'
              ],
              result: '$(\\frac{1}{2}x - \\frac{1}{4})e^{2x} + C$',
              simple: 'Propones $(Ax+B)e^{2x}$, derivas y encuentras $A=1/2, B=-1/4$ igualando coeficientes.'
            }
          ]
        },
        {
          simple: 'Aunque $\\ln(x)$ parece estar solo, lo multiplicamos por un $1$ invisible: tomamos $u = \\ln(x)$ porque sabemos derivarlo a $1/x$ y $dv = 1\\,dx$ que integra a $x$; así $v\\,du$ cancela las $x$ dejando $\\int 1\\,dx = x$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Sustitución exponencial t = ln(x) + Partes en teᵗ',
              title: 'Cambiar $x = e^t$ para transformar $\\ln x$ en exponencial',
              when: 'Conexión elegante que convierte $\\int \\ln x\\,dx$ en $\\int t\\,e^t\\,dt$.',
              steps: [
                'Sea $t = \\ln(x)$, luego $x = e^t$ y $dx = e^t\\,dt$.',
                'Integral nueva: $\\int t\\,e^t\\,dt$. Por tabular: D=[$t, 1, 0$], I=[$e^t, e^t, e^t$] $\\implies (t - 1)e^t + C$.',
                'Vuelve a $x$: $(\\ln(x) - 1)x + C = x\\ln(x) - x + C$.'
              ],
              result: '$x\\ln(x) - x + C$',
              simple: 'Haciendo $t = \\ln(x)$ conviertes el logaritmo en la famosa integral tabular $t\\,e^t$, que da $(t-1)e^t$, es decir $x\\ln x - x$.'
            },
            {
              badge: 'Método 3 · Ingeniería inversa desde la regla del producto',
              title: 'Derivar el candidato $x\\ln(x)$ y corregir el $+1$ sobrante',
              when: 'Forma rapidísima de recordar o deducir $\\int \\ln(x)\\,dx$ en un examen.',
              steps: [
                'Prueba derivar $x\\ln(x)$: $(x\\ln x)\' = 1\\cdot\\ln(x) + x\\cdot\\frac{1}{x} = \\ln(x) + 1$.',
                'Como nos sobró un $+1$, basta restar su antiderivada ($x$): $\\frac{d}{dx}(x\\ln(x) - x) = \\ln(x) + 1 - 1 = \\ln(x)$.'
              ],
              result: '$x\\ln(x) - x + C$',
              simple: 'Al derivar $x\\ln x$ sale $\\ln x + 1$; como sobra $1$, restas $x$ y te queda exacto $x\\ln x - x + C$.'
            }
          ]
        }
      ]
    },
    'int-3': {
      simpleIntro: 'La integral definida calcula el área exacta encerrada bajo una curva entre dos límites $a$ y $b$. El Teorema Fundamental del Cálculo conecta por fin derivadas e integrales: para medir esa área infinitamente fina, solo buscas una antiderivada y restas su valor en el final menos el inicio.',
      simplePrereqs: 'Necesitas saber sacar antiderivadas básicas y evaluar funciones en números respetando paréntesis y signos negativos.',
      detailedSimple: [
        'Originalmente el área se aproximaba partiendo el tramo en cientos de rectángulos angostos y sumándolos al infinito (Sumas de Riemann).',
        'La Regla de Barrow te evita esas sumas gigantescas: integras una sola vez a $F(x)$ y calculas $F(b) - F(a)$; el $+C$ se cancela solo porque aparece en ambos lados.',
        'Cuidado vital: la integral normal resta las áreas que quedan debajo del eje $X$ (área neta); si quieres el área geométrica real de pintura necesaria, primero buscas donde cruza el eje $X$ y sumas cada pedazo en positivo.'
      ],
      conceptsSimple: [
        'Parte 1 dice que derivar una integral acumulada recupera la función original; Parte 2 es la fórmula práctica $F(b)-F(a)$.',
        'Si inviertes los límites de $a$ a $b$, el signo se voltea; si el límite de inicio y fin son iguales, el área vale cero; y siempre puedes cortar el tramo por la mitad en un punto $c$.',
        'Piensa en ganancias y pérdidas: la integral neta suma ganancias y resta pérdidas; el área total suma el tamaño absoluto de ambas sin importar el signo.',
        'Sirve para hallar el valor promedio exacto de una curva continua y el trabajo, desplazamiento o volumen en ciencias.'
      ],
      theoremsSimple: [
        'La rapidez con que crece el área acumulada hasta $x$ mide justo la altura vertical $f(x)$ del borde derecho; por eso área acumulada y derivada son operaciones inversas.'
      ],
      formulasSimple: [
        'Calcula tu antiderivada $F(x)$, sustituye el número de arriba $b$, sustituye el número de abajo $a$ entre paréntesis, y réstalos.',
        'Área neta deja los signos positivos y negativos cancelarse; área geométrica toma el valor absoluto de cada tramo.'
      ],
      mistakesSimple: [
        'Siempre evalúa PRIMERO el techo (límite superior $b$) y LUEGO réstale el piso (límite inferior $a$), nunca al revés.',
        'No des por hecho que $F(0)$ vale cero: en funciones como $\\cos(0)=1$, $e^0=1$ o $(x+1)^2$, evaluar en $0$ aporta un número real distinto de cero.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Regla de Barrow F(b) - F(a)',
          title: 'Antiderivada clásica y evaluación protegida entre paréntesis',
          when: 'El método estándar para cualquier integral definida donde conoces la antiderivada.',
          idea: 'Encuentra $F(x)$ (sin necesidad de escribir $+C$), evalúa $[F(b)] - [F(a)]$ protegiendo el segundo bloque con corchetes.',
          steps: [
            'Obtén cualquier antiderivada $F(x)$.',
            'Calcula $F(b)$ y por separado $F(a)$.',
            'Resta $F(b) - F(a)$ simplificando signos.'
          ],
          miniExample: '$\\int_1^3 (3x^2-2x+1)dx = [x^3-x^2+x]_1^3 = (27-9+3) - (1-1+1) = 21 - 1 = 20$.',
          simple: 'Primero sustituyes el número de arriba en toda tu integral, abres un menos con paréntesis grande y sustituyes el de abajo.'
        },
        {
          badge: 'Forma 2 · Simetría en [-a, a] (Pares e Impares)',
          title: 'Aprovechar $f(-x)=-f(x)$ (da $0$) o $f(-x)=f(x)$ (duplica $\\int_0^a$)',
          when: '¡Ahorra muchísimo tiempo y errores de signo siempre que los límites sean opuestos simétricos como $[-2, 2]$ o $[-\\pi, \\pi]$!',
          idea: 'En un intervalo simétrico $[-a, a]$, cualquier término con exponente impar ($x, x^3, \\operatorname{sen} x$) tiene exactamente tanta área arriba como abajo y se anula directo a $0$; los términos pares ($x^2, \\cos x$) solo los calculas desde $0$ a $a$ y duplicas.',
          steps: [
            'Verifica si el intervalo es de la forma $[-a, a]$.',
            'Separa términos impares ($\\int_{-a}^a f_{\\text{impar}} = 0$ directo en neta) y términos pares ($2\\int_0^a f_{\\text{par}}$).',
            'Si te piden área geométrica total (con valor absoluto $|f|$), una función impar vuelve igual ambos lados, dando $2\\int_0^a |f(x)|dx$!'
          ],
          miniExample: 'Para $f(x)=x^3-4x$ en $[-2, 2]$: es 100% impar, así que su integral neta vale $0$ al instante, y su área total es simplemente $2|\\int_0^2(x^3-4x)dx|$.',
          simple: 'En tramos espejo como $[-2, 2]$, si la función es impar su integral neta vale $0$ directo, y para área total basta calcular la mitad derecha y multiplicarla por $2$.'
        },
        {
          badge: 'Forma 3 · Geometría elemental y Aproximación Numérica',
          title: 'Áreas con rectángulos/triángulos/semicírculos o Suma de Trapecios para comprobar',
          when: 'Útil cuando el integrando es una línea recta, valor absoluto o $\\sqrt{r^2-x^2}$, o para comprobar cualquier Barrow.',
          idea: 'Puedes dibujar el área y usar $\\frac{\\text{base}\\times\\text{altura}}{2}$ o estimar con la Regla del Trapecio para asegurarte de que no fallaste un signo.',
          steps: [
            'Si el dibujo es triángulo, trapecio o semicírculo, aplica su fórmula geométrica directa.',
            'Para comprobar una curva cualquiera con trapecios ($n$ tramos de ancho $\\Delta x$): $\\frac{\\Delta x}{2}[f(x_0)+2f(x_1)+\\dots+f(x_n)]$.'
          ],
          miniExample: 'Para $\\int_0^3 x^2\\,dx$ con $n=3$ trapecios ($\\Delta x=1$): $\\frac{1}{2}[0+2(1)+2(4)+9] = 9.5$ (cerca del valor exacto $9$).',
          simple: 'Estimar el tamaño del dibujo con dos o tres rectángulos o trapecios te avisa al instante si tu integral definida se salió de escala o dio el signo opuesto.'
        },
        {
          badge: 'Forma 4 · Cambio de variable cambiando los límites [a, b] → [g(a), g(b)]',
          title: 'Evitar regresar a $x$ en integrales definidas por sustitución',
          when: 'Siempre que hagas una sustitución $u = g(x)$ dentro de una integral definida.',
          idea: 'Una vez cambias a $u$, evalúa $u_{\\text{inf}} = g(a)$ y $u_{\\text{sup}} = g(b)$ y haz Barrow directamente en $u$ sin regresar jamás a $x$.',
          steps: [
            'Elige $u = g(x)$ y halla $du = g\'(x)\\,dx$.',
            'Transforma los límites: nuevo abajo $= g(a)$, nuevo arriba $= g(b)$.',
            'Integra en $u$ y evalúa directo $[F(u)]_{g(a)}^{g(b)}$.'
          ],
          miniExample: '$\\int_0^4 x\\sqrt{x^2+9}\\,dx$: con $u=x^2+9$, $0\\to 9$ y $4\\to 25$: $\\frac{1}{2}\\int_9^{25}u^{1/2}du = \\frac{1}{3}[25^{3/2}-9^{3/2}] = \\frac{125-27}{3} = \\frac{98}{3}$.',
          simple: 'Si cambias también los numeritos de los límites al pasar a $u$, evalúas directo en $u$ y te ahorras volver a la $x$ original.'
        },
        {
          badge: 'Forma 5 · Valor Promedio y Teorema del Valor Medio Integral',
          title: 'Fórmula de altura promedio $f_{\\text{prom}} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx$',
          when: 'Cuando piden el promedio continuo de temperatura, velocidad o altura en un intervalo.',
          idea: 'El promedio de un rectángulo con la misma área que tu región curva es simplemente $(\\text{Área neta}) / (\\text{Ancho } b-a)$.',
          steps: [
            'Calcula la integral definida $\\int_a^b f(x)\\,dx$.',
            'Divide ese número entre la longitud $(b - a)$ del intervalo.',
            'Si piden el punto $c$ que logra el promedio, iguala $f(c) = f_{\\text{prom}}$ y despeja $c \\in (a, b)$.'
          ],
          miniExample: 'Promedio de $x^2$ en $[0, 3]$: $\\frac{1}{3-0}\\int_0^3 x^2\\,dx = \\frac{9}{3} = 3$; se alcanza en $c^2=3 \\implies c=\\sqrt{3}$.',
          simple: 'El valor promedio equivale a aplastar la arena bajo la curva para dejarla plana como un rectángulo del mismo ancho: su nueva altura plana es el promedio.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Sacamos la antiderivada $x^3-x^2+x$, metemos el límite superior $3$ (da $21$), metemos el límite inferior $1$ (da $1$) y restamos $21 - 1 = 20$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Comprobación rápida con Regla de Simpson',
              title: 'Evaluar puntos $x=1, 2, 3$ con Regla de Simpson ($n=2$ exacto en cuadráticas!)',
              when: 'Como el integrando es de grado 2, la Regla de Simpson con solo 3 puntos da el valor 100% EXACTO.',
              steps: [
                'Evalúa en los extremos y el punto medio ($x=1, 2, 3$): $f(1)=2$, $f(2)=9$, $f(3)=22$.',
                'Fórmula de Simpson ($h = \\frac{3-1}{2} = 1$): $\\frac{h}{3}[f(1) + 4f(2) + f(3)] = \\frac{1}{3}[2 + 4(9) + 22] = \\frac{60}{3} = 20$.'
              ],
              result: '$20\\text{ u}^2$',
              simple: 'Con solo evaluar la parábola en $1$, $2$ y $3$ usando Simpson obtienes $20$ exacto sin siquiera integrar.'
            },
            {
              badge: 'Método 3 · Estimación numérica por Trapecios + Sumar piezas',
              title: 'Validar magnitud con 2 trapecios ($\\Delta x = 1$) y dividir en $x=2$',
              when: 'Para detectar al instante cualquier error de signo o exponente al integrar.',
              steps: [
                'Con dos trapecios en $[1, 2]$ y $[2, 3]$: $T_2 = \\frac{1}{2}[2 + 2(9) + 22] = 21$ (cota superior muy cercana por ser cóncava hacia arriba).',
                'Si partieses la integral: $\\int_1^2 + \\int_2^3 = (5.5) + (14.5) = 20$ exacto.'
              ],
              result: '$20\\text{ u}^2$',
              simple: 'Un trapecio rápido te confirma en segundos que la respuesta real ronda $20$ y jamás podría ser negativa ni enorme.'
            }
          ]
        },
        {
          simple: 'La curva $x^3-4x$ cruza el cero en $x=0$: de $-2$ a $0$ da $+4$ y de $0$ a $2$ da $-4$. Si sumas directo sale integral neta $0$; si quieres el área real pintada, pones ambos tramos en positivo ($4 + 4 = 8$).',
          alternativeMethods: [
            {
              badge: 'Método 2 · Uso directo de Simetría Impar',
              title: 'Reconocer $f(-x) = -f(x)$ en el intervalo simétrico $[-2, 2]$',
              when: 'Reduce el trabajo a la mitad y evita errores en límites negativos.',
              steps: [
                'Como $f(-x) = (-x)^3 - 4(-x) = -(x^3 - 4x) = -f(x)$, es impar en $[-2, 2]$.',
                'a) Integral neta inmediatamente vale $0$ por cancelación simétrica.',
                'b) Como no cambia de signo dentro de $(0, 2)$ (y es negativa allí), el área total vale $2\\left|\\int_0^2 (x^3-4x)\\,dx\\right| = 2\\cdot|-4| = 8\\text{ u}^2$.'
              ],
              result: 'Neta $= 0$, Área total $= 8\\text{ u}^2$',
              simple: 'Como $x^3-4x$ es perfectamente antisimétrica respecto al origen, sabes en un segundo que las dos mitades valen lo mismo con signo opuesto: neta $0$ y área doble de la mitad derecha.'
            },
            {
              badge: 'Método 3 · Factorización y sustitución u = x² - 4 en cada tramo',
              title: 'Integrar $x(x^2 - 4)$ cambiando a $u = x^2 - 4$ con cambio de límites',
              when: 'Alternativa práctica usando la Forma 4 de sustitución definida.',
              steps: [
                'Reescribe $x^3 - 4x = x(x^2 - 4)$ y toma $u = x^2 - 4$, con $du = 2x\\,dx \\implies x\\,dx = \\frac{du}{2}$.',
                'En $[-2, 0]$ los límites en $u$ van de $0$ a $-4$: $\\frac{1}{2}\\int_0^{-4} u\\,du = \\frac{1}{2}\\left[\\frac{u^2}{2}\\right]_0^{-4} = +4$.',
                'En $[0, 2]$ van de $-4$ a $0$: $\\frac{1}{2}\\int_{-4}^0 u\\,du = -4$, dando neta $0$ y geométrica $4 + 4 = 8$.'
              ],
              result: 'Neta $= 0$, Área total $= 8\\text{ u}^2$',
              simple: 'Factorizar una $x$ permite cambiar $u=x^2-4$ y resolver los dos tramos con una integral de primer grado $\\int u\\,du$.'
            }
          ]
        },
        {
          simple: 'Calculamos el área bajo $x^2$ desde $0$ a $3$ (da $9$) y la dividimos entre el ancho $3-0=3$, obteniendo altura promedio $3$. Luego igualamos $c^2 = 3$ dentro de $[0,3]$ y sale $c = \\sqrt{3}$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Comprobación por geometría parabólica',
              title: 'El área bajo $y=kx^2$ desde $0$ hasta $b$ es siempre $\\frac{1}{3}$ del rectángulo que la encierra',
              when: 'Propiedad arquimediana útil para validar resultados de áreas parabólicas.',
              steps: [
                'El rectángulo que encierra a $y=x^2$ en $[0,3]$ mide base $3$ y altura $f(3)=9$ (área $27$).',
                'Por tanto la región bajo la curva ocupa exactamente $\\frac{1}{3}(27) = 9$, luego su altura promedio es $\\frac{9}{3} = 3 = \\frac{1}{3}f(3)$.'
              ],
              result: '$f_{\\text{prom}} = 3$, $c = \\sqrt{3}$',
              simple: 'Una parábola simple $kx^2$ siempre llena exactamente un tercio del rectángulo que va desde $0$ hasta su punta; así que su altura promedio siempre es un tercio de su altura máxima ($9/3 = 3$).'
            },
            {
              badge: 'Método 3 · Regla de Simpson directa sobre f(0), f(1.5), f(3)',
              title: 'Calcular el promedio ponderado de Simpson exacto para cuadráticas',
              when: 'Como $x^2$ es de grado 2, el promedio ponderado $\\frac{f(a) + 4f(m) + f(b)}{6}$ es 100% exacto.',
              steps: [
                'Evalúa extremos y punto medio $m = 1.5$: $f(0) = 0$, $f(1.5) = 2.25$, $f(3) = 9$.',
                'Aplica la fórmula del promedio de Simpson: $f_{\\text{prom}} = \\frac{0 + 4(2.25) + 9}{6} = \\frac{18}{6} = 3$.',
                'Iguala $f(c) = c^2 = 3 \\implies c = \\sqrt{3} \\approx 1.7321$.'
              ],
              result: '$f_{\\text{prom}} = 3$, $c = \\sqrt{3}$',
              simple: 'En cualquier parábola, el valor promedio siempre es exactamente $(f(\\text{inicio}) + 4\\cdot f(\\text{centro}) + f(\\text{fin})) / 6$.'
            }
          ]
        }
      ]
    },
    'calc-1': {
      simpleIntro: 'Unimos todo el cálculo en dos aplicaciones estelares: medir el área atrapada entre dos gráficas que se cruzan y reconstruir la velocidad y posición de un objeto en movimiento integrando su aceleración paso a paso.',
      simplePrereqs: 'Necesitas saber resolver ecuaciones cuadráticas para hallar dónde se cortan las dos curvas, evaluar integrales definidas (Barrow) e integrar con condiciones iniciales.',
      detailedSimple: [
        'El área encerrada entre dos curvas siempre resta "curva de arriba menos curva de abajo"; si no te dan los bordes, primero igualas $f(x)=g(x)$ para descubrir en qué puntos se cierran.',
        'Receta infalible: 1) Iguala las fórmulas para ver los cortes, 2) Prueba un número intermedio para comprobar quién va arriba y 3) Integra (arriba $-$ abajo) entre ambos cortes.',
        'La cinemática conecta las tres variables en cadena: para bajar de posición a velocidad y aceleración derivas; para subir de aceleración a velocidad y posición integras usando el dato inicial en $t=0$.'
      ],
      conceptsSimple: [
        'Restar siempre la función superior menos la inferior asegura que la altura de cada rebanada sea positiva; si alguna región intercambia techo y piso, se parte en el cruce.',
        'En movimiento rectilíneo: posición $\\to$ velocidad $\\to$ aceleración se recorre derivando; de regreso se recorre integrando dos veces con $v(0)$ y $s(0)$.'
      ],
      theoremsSimple: [
        'Cada rebanada vertical entre dos curvas mide de largo $(f_{\\text{sup}}(x) - g_{\\text{inf}}(x))$ aunque ambas estén debajo del eje $X$, así que su suma integral da siempre el área atrapada entre ellas.'
      ],
      formulasSimple: [
        'Solo integra la resta (curva que va arriba menos curva que va abajo) desde el cruce izquierdo $a$ hasta el cruce derecho $b$.'
      ],
      mistakesSimple: [
        'Si restas la de abajo menos la de arriba por no haber revisado un punto en medio, te saldrá el mismo número pero con signo negativo; jamás entregues un área negativa.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Rebanadas Verticales (dx)',
          title: 'Integrar $\\int_a^b [f_{\\text{sup}}(x) - g_{\\text{inf}}(x)]\\,dx$',
          when: 'Cuando una misma curva es siempre el techo y otra siempre el piso entre los dos cortes.',
          idea: 'Iguala $f(x)=g(x)$ para hallar $a$ y $b$, prueba un punto en medio para ordenar arriba $-$ abajo e integra.',
          steps: [
            'Resuelve $f(x) = g(x)$ para encontrar las abscisas de cruce $a < b$.',
            'Evalúa un número $x^*$ en $(a, b)$: la curva con mayor valor es $f_{\\text{sup}}$.',
            'Evalúa $\\int_a^b [f_{\\text{sup}}(x) - g_{\\text{inf}}(x)]\\,dx$.'
          ],
          miniExample: 'Entre $4-x^2$ y $3$: cruzan en $\\pm 1$, en $x=0$ gana $4>3$, luego $\\int_{-1}^1(1-x^2)dx = \\frac{4}{3}$.',
          simple: 'Encuentras dónde chocan las curvas, pruebas un número en medio para ver cuál queda arriba y luego integras la resta de arriba menos abajo.'
        },
        {
          badge: 'Forma 2 · Rebanadas Horizontales (dy)',
          title: 'Integrar $\\int_c^d [x_{\\text{der}}(y) - x_{\\text{izq}}(y)]\\,dy$ respecto a $y$',
          when: 'Muy útil cuando las curvas tienen forma $x = g(y)$ (parábolas horizontales $x=y^2$) o evitarías tener que partir en dos integrales en $dx$.',
          idea: 'En vez de barras verticales (arriba $-$ abajo), imagina barras horizontales de ancho $\\Delta y$ midiendo derecha menos izquierda.',
          steps: [
            'Despeja $x$ en términos de $y$ en ambas curvas.',
            'Iguala $x_{\\text{der}}(y) = x_{\\text{izq}}(y)$ para sacar los cortes $c < d$ en el eje $Y$.',
            'Integra $\\int_c^d [x_{\\text{der}}(y) - x_{\\text{izq}}(y)]\\,dy$.'
          ],
          miniExample: 'Para $y=4-x^2$ (es $x=\\pm\\sqrt{4-y}$) e $y=3$: en $y\\in[3,4]$ el ancho es $2\\sqrt{4-y} \\implies \\int_3^4 2\\sqrt{4-y}\\,dy = [-\\frac{4}{3}(4-y)^{3/2}]_3^4 = \\frac{4}{3}$.',
          simple: 'También puedes cortar el área en tiras acostadas midiendo derecha menos izquierda respecto a $y$, dando exactamente el mismo resultado.'
        },
        {
          badge: 'Forma 3 · Fórmula de Arquímedes para Recta y Parábola',
          title: 'Atajos $\\frac{|a|}{6}(\\beta - \\alpha)^3$ y $\\frac{2}{3}\\cdot \\text{base} \\cdot \\text{flecha}$',
          when: 'Comprobación instantánea (en 5 segundos) para CUALQUIER área entre una parábola $ax^2+bx+c$ y una recta $mx+k$.',
          idea: 'Si las curvas se cruzan en $x=\\alpha$ y $x=\\beta$, el área atrapada entre una parábola con coeficiente líder $a$ y una recta SIEMPRE es $\\frac{|a|}{6}(\\beta - \\alpha)^3$.',
          steps: [
            'Halla las raíces del cruce $\\alpha < \\beta$ al igualar la recta con la parábola.',
            'Lee $|a|$, el valor absoluto del coeficiente de $x^2$ en la diferencia.',
            'Aplica directo $A = \\frac{|a|}{6}(\\beta - \\alpha)^3$ (o $\\frac{2}{3}$ del rectángulo circunscrito paralelo).'
          ],
          miniExample: 'En $x+2 = x^2$ ($\\alpha=-1, \\beta=2$, $|a|=1$): $A = \\frac{1}{6}(2 - (-1))^3 = \\frac{27}{6} = \\frac{9}{2}$. ¡Exacto en una línea!',
          simple: 'Cualquier área atrapada entre una parábola $x^2$ y una recta con cruces $\\alpha$ y $\\beta$ siempre vale $\\frac{|a|}{6}(\\beta - \\alpha)^3$; sirve para comprobar tu integral al instante.'
        },
        {
          badge: 'Forma 4 · Cinemática bidireccional (Integrales definidas vs. Indefinidas)',
          title: 'Subir de $a(t)$ a $v(t)$ y $s(t)$ usando condiciones iniciales o Barrow por tramos',
          when: 'En problemas de movimiento (aceleración $\\to$ velocidad $\\to$ posición / distancia recorrida).',
          idea: 'Además de integrar con $+C_1, +C_2$, puedes usar $v(t) = v(0) + \\int_0^t a(\\tau)d\\tau$ directo; recuerda distinguir desplazamiento ($\\int v\\,dt$) de distancia total ($\\int |v|\\,dt$).',
          steps: [
            'Integra $a(t)$ y fija la constante con $v(t_0)$ para obtener $v(t)$.',
            'Integra $v(t)$ y fija la constante con $s(t_0)$ para obtener $s(t)$.',
            'Para comprobar al final, deriva dos veces $s(t)$ y verifica $s(0)$, $v(0)$ y $a(t)$.'
          ],
          miniExample: 'Si $s(t) = t^3-2t^2+2t+5$: derivas $s\'=3t^2-4t+2$ ($s\'(0)=2$), derivas $s\'\'=6t-4=a(t)$. ¡Todo cierra!',
          simple: 'Para revisar cualquier ejercicio de cinemática, solo deriva tu respuesta final $s(t)$ dos veces para verificar que te devuelve $v(0)$ y $a(t)$.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Igualando $4-x^2 = 3$ encontramos que se cortan en $x=-1$ y $x=1$; como en medio ($x=0$) la parábola vale $4$ y la recta $3$, integramos $(4-x^2)-3 = 1-x^2$ entre $-1$ y $1$, dando $4/3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Rebanadas horizontales (dy) + Arquímedes',
              title: 'Integrar respecto a $y$ en $[3, 4]$ o usar $\\frac{2}{3}(\\text{base})(\\text{altura})$',
              when: 'Dos vías alternas rapidísimas para comprobar $4/3$.',
              steps: [
                'Atajo de Arquímedes: la base de la cúpula entre $x=-1$ y $x=1$ mide $2$, la altura en $x=0$ mide $4-3=1$, así que $A = \\frac{2}{3}(2)(1) = \\frac{4}{3}\\text{ u}^2$.',
                'En $dy$: los dos lados de la parábola miden $x = \\pm\\sqrt{4-y}$, ancho $2\\sqrt{4-y}$, y $\\int_3^4 2(4-y)^{1/2}dy = \\left[-\\frac{4}{3}(4-y)^{3/2}\\right]_3^4 = \\frac{4}{3}$.'
              ],
              result: '$\\frac{4}{3}\\text{ u}^2$',
              simple: 'Arquímedes demostró que un arco parabólico ocupa siempre dos tercios del rectángulo que lo enmarca ($\\frac{2}{3} \\times 2 \\times 1 = 4/3$).'
            },
            {
              badge: 'Método 3 · Simetría par respecto al eje Y',
              title: 'Aprovechar que $1 - x^2$ es función par en $[-1, 1]$',
              when: 'Simplifica cuentas evitando evaluar límites negativos con signos menos.',
              steps: [
                'Como $(1 - (-x)^2) = 1 - x^2$, el lado izquierdo $[-1, 0]$ es espejo idéntico del derecho $[0, 1]$.',
                'Duplica la integral desde $0$: $A = 2\\int_0^1 (1 - x^2)\\,dx = 2\\left[x - \\frac{x^3}{3}\\right]_0^1 = 2\\left(1 - \\frac{1}{3}\\right) = \\frac{4}{3}\\text{ u}^2$.'
              ],
              result: '$\\frac{4}{3}\\text{ u}^2$',
              simple: 'Como la figura es perfectamente simétrica a izquierda y derecha, basta calcular la mitad positiva de $0$ a $1$ y multiplicar por $2$.'
            }
          ]
        },
        {
          simple: 'Resolvemos $x+2=x^2$ para encontrar los dos cruces ($x=-1$ y $x=2$); evaluando $x=0$ la recta vale $2$ y la parábola $0$, así que la recta va arriba e integramos $(x+2-x^2)$ de $-1$ a $2$, resultando $9/2 = 4.5$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Fórmula exacta de parábola y secante',
              title: 'Aplicar $A = \\frac{|a|}{6}(\\beta - \\alpha)^3$',
              when: 'Confirmación instantánea en dos segundos.',
              steps: [
                'Cruces $\\alpha = -1, \\beta = 2$ (distancia $\\beta - \\alpha = 3$) y coeficiente cuadrático $|a| = 1$.',
                '$A = \\frac{1}{6}(3)^3 = \\frac{27}{6} = \\frac{9}{2} = 4.5\\text{ u}^2$.'
              ],
              result: '$\\frac{9}{2} = 4.5\\text{ u}^2$',
              simple: 'Como los dos cruces están separados $3$ unidades, solo calculas $3^3 / 6 = 27/6 = 4.5$.'
            },
            {
              badge: 'Método 3 · Rebanadas horizontales en dy (dividiendo en 2 zonas)',
              title: 'Comprobar integrando horizontalmente desde $y = 0$ hasta $y = 4$',
              when: 'Útil para aprender por qué $dx$ era más fácil aquí que $dy$.',
              steps: [
                'De $y=0$ a $y=1$ el ancho lo limitan las dos ramas de $x^2=y$: $2\\sqrt{y}$, dando $\\int_0^1 2\\sqrt{y}\\,dy = \\frac{4}{3}$.',
                'De $y=1$ a $y=4$ va de $y-2$ a $+\\sqrt{y}$, dando $\\int_1^4 (\\sqrt{y} - y + 2)\\,dy = \\frac{19}{6}$.',
                'Suma total: $\\frac{4}{3} + \\frac{19}{6} = \\frac{27}{6} = \\frac{9}{2}$. ¡Idéntico!'
              ],
              result: '$\\frac{9}{2}\\text{ u}^2$',
              simple: 'Incluso cortando la figura en rebanadas horizontales y sumando las dos partes obtienes exactamente $\\frac{9}{2}$, aunque en vertical ($dx$) fue una sola integral.'
            }
          ]
        },
        {
          simple: 'Integramos $a(t)=6t-4$ para sacar $v(t)=3t^2-4t+C_1$ y usamos $v(0)=2$ para fijar $C_1=2$; luego integramos $v(t)$ usando $s(0)=5$ para tener $s(t)$ completa y evaluamos $t=2$, obteniendo $9\\text{ m}$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Integrales definidas en cascada desde t = 0',
              title: 'Usar $v(t)=v(0)+\\int_0^t a(\\tau)\\,d\\tau$ y $s(2)=s(0)+\\int_0^2 v(t)\\,dt$',
              when: 'Forma muy limpia sin manejar constantes $C_1, C_2$.',
              steps: [
                '$v(t) = 2 + \\int_0^t (6\\tau - 4)\\,d\\tau = 2 + (3t^2 - 4t)$.',
                '$s(2) = 5 + \\int_0^2 (3t^2 - 4t + 2)\\,dt = 5 + [t^3 - 2t^2 + 2t]_0^2 = 5 + (8 - 8 + 4) = 9\\text{ m}$.'
              ],
              result: '$s(2) = 9\\text{ m}$',
              simple: 'Si sumas la posición inicial $5$ más la integral definida de la velocidad de $0$ a $2$, te da $9\\text{ m}$ directo sin constantes auxiliares.'
            },
            {
              badge: 'Método 3 · Desarrollo de Taylor exacto alrededor de t = 0',
              title: 'Construir el polinomio $s(t) = s(0) + v(0)t + \\frac{a(0)}{2}t^2 + \\frac{a\'(0)}{6}t^3$',
              when: 'Como $a(t)$ es lineal, $s(t)$ es cúbica exacta y se arma término a término desde $t = 0$.',
              steps: [
                'Lee directo los datos en $t = 0$: $s(0) = 5$, $v(0) = 2$, $a(0) = -4$ y tasa de variación $a\'(t) = 6$.',
                'Arma el polinomio: $s(t) = 5 + 2t + \\frac{-4}{2}t^2 + \\frac{6}{6}t^3 = t^3 - 2t^2 + 2t + 5$.',
                'Verifica en $t=2$: $s(2) = 8 - 8 + 4 + 5 = 9\\text{ m}$ (derivando: $s\'(t)=3t^2-4t+2$, $s\'\'(t)=6t-4$).'
              ],
              result: '$s(2) = 9\\text{ m}$',
              simple: 'Como la aceleración cambia linealmente, la posición se arma al instante con valor inicial, velocidad inicial, mitad de aceleración inicial y sexto del cambio de aceleración.'
            }
          ]
        }
      ]
    },
    'calc-2': {
      simpleIntro: 'Una Ecuación Diferencial conecta una función desconocida con su propia tasa de cambio (por ejemplo "la población crece en proporción al tamaño actual"). En las ecuaciones separables solo juntas todas las $y$ con $dy$ de un lado y todas las $x$ con $dx$ del otro, e integras cada lado por separado.',
      simplePrereqs: 'Necesitas tener soltura integrando potencias y $\\int \\frac{1}{y}dy = \\ln|y|$, despejando ecuaciones con $e$ y $\\ln$ y sustituyendo valores iniciales.',
      detailedSimple: [
        'Una EDO es separable cuando puedes factorizar la derecha como algo que solo depende de $x$ multiplicado por algo que solo depende de $y$; si están sumándose ($x + y$), ya NO se pueden separar así.',
        'Paso a paso: 1) Mueve $dy$ y todo lo de $y$ a la izquierda, $dx$ y todo lo de $x$ a la derecha; 2) Integra ambos lados poniendo una sola constante $+C$; 3) Si te dan un punto inicial $(x_0, y_0)$, úsalo para fijar la curva exacta.'
      ],
      conceptsSimple: [
        'El objetivo siempre es poner todas las $y$ juntas con $dy$ a la izquierda y todas las $x$ juntas con $dx$ a la derecha sin que sobre ninguna variable mezclada.',
        'Cuando la rapidez de crecimiento o pérdida depende directo de cuánta cantidad hay ($dy/dt = ky$), la solución siempre termina siendo una función exponencial $y_0 e^{kt}$.'
      ],
      theoremsSimple: [
        'Aunque $dy/dx$ no es una fracción común, separar variables funciona con todo rigor gracias a la regla de la cadena al integrar respecto a $x$ usando cambio de variable $u = y(x)$.'
      ],
      formulasSimple: [
        'Separas variables por producto o división en lados opuestos, integras la izquierda respecto a $y$ y la derecha respecto a $x$, y pones una sola constante $+C$.'
      ],
      mistakesSimple: [
        'Antes de escribir el signo integral en el lado izquierdo o derecho, revisa que no haya quedado colada una $y$ con el $dx$ ni una $x$ con el $dy$.'
      ],
      solvingApproaches: [
        {
          badge: 'Forma 1 · Separación clásica con +C indefinida',
          title: 'Separar $g(y)dy = f(x)dx$, integrar con $+C$ (o constante $K=\\pm e^C$) y despejar $y$',
          when: 'El procedimiento estándar para cualquier EDO separable $\\frac{dy}{dx} = p(x)q(y)$.',
          idea: 'Junta $y$ con $dy$ y $x$ con $dx$, integra ambos lados poniendo una única constante al lado de $x$, despeja $y$ y halla la constante con la condición inicial.',
          steps: [
            'Factoriza y separa variables: $\\frac{1}{q(y)}dy = p(x)dx$ (vigilando soluciones constantes si $q(y_0)=0$).',
            'Integra ambos lados con una sola constante $+C$.',
            'Sustituye la condición inicial $(x_0, y_0)$ (incluso ANTES de despejar $y$ si es más cómodo) para obtener el valor numérico.'
          ],
          miniExample: 'De $\\frac{dy}{y}=2x\\,dx \\implies \\ln|y|=x^2+C \\implies y = A e^{x^2}$; con $y(0)=3 \\implies A=3$.',
          simple: 'Agrupas las $y$ con $dy$ y las $x$ con $dx$; luego integras ambos lados y sustituyes el punto inicial para descubrir la constante.'
        },
        {
          badge: 'Forma 2 · Integrales Definidas Directas (Sin +C)',
          title: 'Integrar ambos lados desde $(x_0, y_0)$ hasta $(x, y)$: $\\int_{y_0}^y g(v)dv = \\int_{x_0}^x f(u)du$',
          when: 'Súper limpia y rápida en Problemas de Valor Inicial (PVI) como $\\frac{dy}{dx}=\\frac{x}{y}$ con $y(0)=4$.',
          idea: 'Si integras simultáneamente usando las condiciones iniciales como límites inferiores de Barrow, la solución particular sale directamente sin crear ninguna constante $C$ ni $A$.',
          steps: [
            'Separa $\\frac{dv}{q(v)} = p(u)\\,du$.',
            'Pon $y_0$ abajo y $y$ arriba en la integral izquierda; $x_0$ abajo y $x$ arriba en la derecha.',
            'Evalúa ambos Barrow y despeja $y$.'
          ],
          miniExample: 'Para $\\frac{dy}{dx}=\\frac{x}{y}$ con $y(0)=4$: $\\int_4^y v\\,dv = \\int_0^x u\\,du \\implies \\frac{y^2}{2}-\\frac{16}{2} = \\frac{x^2}{2} \\implies y^2 = x^2+16$.',
          simple: 'Poniendo los valores iniciales como límites inferiores de las dos integrales, te saltas por completo inventar y despejar la constante $C$.'
        },
        {
          badge: 'Forma 3 · Atajo para Modelos Exponenciales y\' = ky',
          title: 'Reconocimiento inmediato $y(t) = y_0 e^{kt}$',
          when: 'Crecimiento poblacional, interés continuo o desintegración radiactiva $\\frac{dy}{dt} = k\\,y$.',
          idea: 'Si la tasa de cambio es constante por la cantidad presente ($y\' = ky$), siempre sabes de antemano que la solución única vale $y(t) = y(0)e^{kt}$.',
          steps: [
            'Identifica la constante de proporcionalidad $k$ y la cantidad inicial $y_0$ en $t = 0$.',
            'Escribe directo $y(t) = y_0 e^{kt}$.',
            'Evalúa en el tiempo pedido (o usa $t_{1/2} = \\ln(2)/|k|$ para vida media).'
          ],
          miniExample: 'Si $y\'=-0.2y$ y $y(0)=100$: inmediato $y(t) = 100e^{-0.2t}$.',
          simple: 'Siempre que veas $\\frac{dy}{dt} = k\\cdot y$, ya sabes sin integrar que la fórmula es valor inicial por $e^{kt}$.'
        },
        {
          badge: 'Forma 4 · Verificación por Sustitución en la EDO',
          title: 'Comprobar que tu función $y(x)$ cumple la ecuación diferencial y el valor inicial',
          when: 'Para asegurarte 100% de que no fallaste ningún exponente, signo ni constante.',
          idea: 'Calcula la derivada $y\'(x)$ de tu respuesta, evalúa el lado derecho de la EDO con tu $y(x)$, verifica que igualan y comprueba $y(x_0) = y_0$.',
          steps: [
            'Evalúa $y(x_0)$ para verificar la condición inicial.',
            'Deriva tu respuesta $y(x)$ para obtener el lado izquierdo $\\frac{dy}{dx}$.',
            'Sustituye $x$ y $y(x)$ en el lado derecho y confirma igualdad idéntica.'
          ],
          miniExample: 'Para $y = \\sqrt{x^2+16}$: $y(0)=4$; $y\' = \\frac{2x}{2\\sqrt{x^2+16}} = \\frac{x}{\\sqrt{x^2+16}} = \\frac{x}{y}$. ¡Comprobada!',
          simple: 'Si derivas tu solución final y el resultado coincide exactamente con el cociente o producto de la ecuación original, es matemáticamente imposible que esté mal.'
        }
      ],
      examplesExtra: [
        {
          simple: 'Pasamos la $y$ a dividir al lado de $dy$ y el $dx$ a multiplicar a $2x$; integrando sale $\\ln|y| = x^2+C$, quitamos el logaritmo elevando a $e$ ($y = Ae^{x^2}$) y usando $y(0)=3$ fijamos $A=3$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Integrales definidas desde (x₀=0, y₀=3)',
              title: 'Integrar $\\int_3^y \\frac{dv}{v} = \\int_0^x 2u\\,du$ directo sin $+C$',
              when: 'Te ahorra manejar constantes exponenciales $K = \\pm e^C$.',
              steps: [
                'Como $y(0)=3 > 0$, integra en los límites iniciales: $\\int_3^y \\frac{dv}{v} = \\int_0^x 2u\\,du$.',
                'Izquierda da $\\ln(y) - \\ln(3) = \\ln(y/3)$; derecha da $x^2 - 0 = x^2$.',
                'Aplica $e^{(\\cdot)}$ a ambos lados: $\\frac{y}{3} = e^{x^2} \\implies y(x) = 3e^{x^2}$.'
              ],
              result: '$y(x) = 3e^{x^2}$',
              simple: 'Con límites definidos sale directo $\\ln(y/3) = x^2$, despejando $y = 3e^{x^2}$ sin ningún truco con $e^C$.'
            },
            {
              badge: 'Método 3 · Cambio logarítmico u = ln(y) + Verificación',
              title: 'Linealizar con $u(x) = \\ln y(x)$ y comprobar derivando',
              when: 'Transforma $\\frac{y\'}{y} = 2x$ en una antiderivada elemental $\\frac{du}{dx} = 2x$.',
              steps: [
                'Como $y(0)=3 > 0$, define $u(x) = \\ln y(x)$, cuya derivada por cadena es $u\'(x) = \\frac{y\'}{y} = 2x$.',
                'Antiderivada directa: $u(x) = x^2 + u(0) = x^2 + \\ln 3 \\implies y(x) = e^{x^2 + \\ln 3} = 3e^{x^2}$.',
                'Comprobación final: $y(0) = 3e^0 = 3$ y $y\'(x) = 3(2x)e^{x^2} = 2x\\,y(x)$.'
              ],
              result: '$y(x) = 3e^{x^2}$',
              simple: 'Si llamas $u = \\ln y$, su derivada es $y\'/y = 2x$; integras $2x$ directo desde $\\ln 3$ para recuperar $y = 3e^{x^2}$.'
            }
          ]
        },
        {
          simple: 'Al tener la ecuación estándar $\\frac{dy}{dt} = -0.2y$, separamos integrando $dy/y$ a $\\ln y$ y $-0.2dt$ a $-0.2t+C$; con $100\\text{ g}$ al inicio queda $y(t) = 100 e^{-0.2t}$, que en $t=5$ baja a $100/e \\approx 36.79\\text{ g}$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Solución inmediata exponencial + Comprobación',
              title: 'Aplicar directo $y(t) = y_0 e^{kt}$ con $k = -0.2$ y $y_0 = 100$',
              when: 'Reconociendo el modelo clásico de decaimiento exponencial.',
              steps: [
                'De $\\frac{dy}{dt} = -0.2y$ se lee directamente $k = -0.2$ y $y_0 = 100$.',
                'Fórmula directa: $y(t) = 100 e^{-0.2t}$.',
                'En $t = 5$: exponente $-0.2(5) = -1$, luego $y(5) = 100 e^{-1} \\approx 36.79\\text{ g}$. Comprobación: $y\'(t) = 100(-0.2)e^{-0.2t} = -0.2\\,y(t)$.'
              ],
              result: '$y(t) = 100e^{-0.2t}$, $y(5) \\approx 36.79\\text{ g}$',
              simple: 'En $t=5$, $-0.2 \\times 5 = -1$, así que después de 5 horas siempre queda exactamente $1/e \\approx 36.79\\%$ de la muestra.'
            },
            {
              badge: 'Método 3 · Vida media radiactiva (base 1/2)',
              title: 'Expresar el decaimiento usando $t_{1/2} = \\frac{\\ln 2}{0.2}$',
              when: 'Ideal para pensar intuitivamente en cuántas veces se parte a la mitad la masa.',
              steps: [
                'Halla la vida media: $t_{1/2} = \\frac{\\ln 2}{0.2} \\approx 3.4657\\text{ h}$.',
                'Reescribe $y(t) = 100\\left(\\frac{1}{2}\\right)^{t / t_{1/2}}$.',
                'En $t = 5\\text{ h}$ han pasado $5 / 3.4657 \\approx 1.4427$ vidas medias, luego $y(5) = 100(0.5)^{1.4427} \\approx 36.79\\text{ g}$.'
              ],
              result: '$y(5) \\approx 36.79\\text{ g}$ ($t_{1/2} \\approx 3.47\\text{ h}$)',
              simple: 'La muestra tarda casi $3.47$ horas en bajar a la mitad ($50\\text{ g}$); como pasan $5$ horas (casi vida media y media), baja a unos $36.79\\text{ g}$.'
            }
          ]
        },
        {
          simple: 'Mandamos $y$ multiplicando al lado de $dy$ y $dx$ al de $x$: integramos a $\\frac{y^2}{2} = \\frac{x^2}{2} + C_1$, multiplicamos por $2$, encontramos $C=16$ con $y(0)=4$ y sacamos la raíz positiva dando una hipérbola $y = \\sqrt{x^2+16}$, que en $x=3$ vale $5$.',
          alternativeMethods: [
            {
              badge: 'Método 2 · Definida directa desde y(0) = 4 y verificación geométrica',
              title: 'Integrar $\\int_4^y v\\,dv = \\int_0^x u\\,du$ y comprobar la hipérbola',
              when: 'Evita renombrar $2C_1$ a $C$ y confirma que $y^2 - x^2 = 16$.',
              steps: [
                '$\\int_4^y v\\,dv = \\int_0^x u\\,du \\implies \\frac{y^2 - 16}{2} = \\frac{x^2}{2}$.',
                'Multiplica por $2$: $y^2 = x^2 + 16$. Como $y(0) = 4 > 0$, toma raíz positiva: $y(x) = \\sqrt{x^2+16}$.',
                'En $x = 3$ sale la terna pitagórica $3$-$4$-$5$: $\\sqrt{3^2+4^2} = 5$. Comprueba derivando implícitamente $y^2-x^2=16 \\implies 2yy\'-2x=0 \\implies y\'=x/y$.'
              ],
              result: '$y(x) = \\sqrt{x^2 + 16}$, $y(3) = 5$',
              simple: 'Separar $y\\,dy = x\\,dx$ desde el punto $(0, 4)$ genera directo $y^2 - x^2 = 16$; en $x=3$ obtienes la hipotenusa del triángulo $3$-$4$-$5$, igual a $5$.'
            },
            {
              badge: 'Método 3 · Diferencial exacta d(y² − x²) = 0',
              title: 'Reunir ambos términos en una sola diferencial total exacta',
              when: 'Truco elegante que conecta ecuaciones separables con ecuaciones exactas.',
              steps: [
                'De $y\\,dy - x\\,dx = 0$, multiplica por $2$: $2y\\,dy - 2x\\,dx = 0$.',
                'Reconoce la diferencial exacta: $d(y^2 - x^2) = 0 \\implies y^2 - x^2 = K$.',
                'Con $y(0) = 4$: $K = 4^2 - 0^2 = 16$, luego en $x=3$ resulta $y^2 = 16 + 9 = 25 \\implies y(3) = 5$.'
              ],
              result: '$y(x) = \\sqrt{x^2 + 16}$, $y(3) = 5$',
              simple: 'Multiplicando por $2$ ves que $2y\\,dy - 2x\\,dx$ es la derivada total de $(y^2 - x^2)$, así que $y^2 - x^2$ se mantiene constante igual a $16$ en toda la curva.'
            }
          ]
        }
      ]
    }
  };

  applyEnrichmentMap(ns.Curriculum, ENRICHMENT_3);
})(window.MatInteractiva);
