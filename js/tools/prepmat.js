/* ==========================================================================
   MATETIC - PrepMat: Simulador Analítico de Exámenes (Bachillerato y Licenciatura)
   Archivo: js/tools/prepmat.js
   9 ramas temáticas, generación paramétrica anti-repetición, modos Entrenamiento
   y Simulacro Oficial, cronómetro dual, diagnóstico analítico y repaso directo.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'matetic_prepmat_v1';
  const SEEN_MAX = 8000;

  /* ------------------------------------------------------------------------
     1. Catálogo Completo de 9 Ramas (Bachillerato y Licenciatura)
     ------------------------------------------------------------------------ */
  const TOPICS = [
    {
      id: 'aritmetica',
      name: 'Aritmética y Teoría de Números',
      shortName: 'Aritmética',
      icon: '±',
      levelHint: 'Bachillerato · Licenciatura',
      description: 'Fracciones complejas, MCM/MCD, proporcionalidad, congruencias modulares, series geométricas infinitas y combinatoria.',
      curriculum: { subjectId: 'aritmetica', topicId: 'arit-1', label: 'Repasar Aritmética' }
    },
    {
      id: 'algebra',
      name: 'Álgebra Superior y Ecuaciones',
      shortName: 'Álgebra',
      icon: 'x²',
      levelHint: 'Bachillerato · Licenciatura',
      description: 'Factorización, sistemas 2×2, logaritmos, relaciones de Vieta, discriminante paramétrico e inecuaciones racionales.',
      curriculum: { subjectId: 'algebra', topicId: 'alg-1', label: 'Repasar Álgebra' }
    },
    {
      id: 'geometria_euclidiana',
      name: 'Geometría Euclidiana y Métrica',
      shortName: 'Geometría',
      icon: '📐',
      levelHint: 'Bachillerato · Licenciatura',
      description: 'Pitágoras, Tales, polígonos, fórmula de Herón, potencia de un punto, sectores y coronas circulares.',
      curriculum: { subjectId: 'geometria', topicId: 'geo-1', label: 'Repasar Geometría' }
    },
    {
      id: 'trigonometria',
      name: 'Trigonometría Analítica',
      shortName: 'Trigonometría',
      icon: '⊿',
      levelHint: 'Bachillerato · Licenciatura',
      description: 'Ángulos notables, identidades de ángulo doble y compuesto, ley de senos/cosenos y ecuaciones en [0, 2π).',
      curriculum: { subjectId: 'trigonometria', topicId: 'trig-1', label: 'Repasar Trigonometría' }
    },
    {
      id: 'geometria_analitica',
      name: 'Geometría Analítica y Cónicas',
      shortName: 'Geom. Analítica',
      icon: '📈',
      levelHint: 'Bachillerato · Licenciatura',
      description: 'Rectas, distancia punto-recta, rectas tangentes a circunferencias, parábola, excentricidad de elipse y asíntotas.',
      curriculum: { subjectId: 'geometria', topicId: 'geo-2', label: 'Repasar Geom. Analítica' }
    },
    {
      id: 'funciones',
      name: 'Funciones, Precálculo y Límites',
      shortName: 'Funciones',
      icon: 'ƒ(x)',
      levelHint: 'Bachillerato · Licenciatura',
      description: 'Dominio, tramos, inversa, asíntotas oblicuas, límites trigonométricos notables y continuidad paramétrica.',
      curriculum: { subjectId: 'funciones', topicId: 'func-1', label: 'Repasar Funciones' }
    },
    {
      id: 'calculo_diferencial',
      name: 'Cálculo Diferencial',
      shortName: 'Cálculo Dif.',
      icon: 'd/dx',
      levelHint: 'Bachillerato · Licenciatura',
      description: 'Regla de la cadena, cociente, derivación implícita, regla de L\'Hôpital, polinomios de Taylor y optimización.',
      curriculum: { subjectId: 'derivadas', topicId: 'der-1', label: 'Repasar Derivadas' }
    },
    {
      id: 'calculo_integral',
      name: 'Cálculo Integral y Series',
      shortName: 'Cálculo Int.',
      icon: '∫',
      levelHint: 'Bachillerato Av. · Licenciatura',
      description: 'Teorema Fundamental del Cálculo, sustitución, integración por partes, área entre curvas, sólidos e impropias.',
      curriculum: { subjectId: 'integrales', topicId: 'int-1', label: 'Repasar Integrales' }
    },
    {
      id: 'algebra_lineal_edo',
      name: 'Álgebra Lineal y EDO',
      shortName: 'Lineal y EDO',
      icon: '𝕄',
      levelHint: 'Licenciatura / Ingeniería',
      description: 'Determinantes 2×2 y 3×3, inversas, producto punto, eigenvalores reales y ecuaciones diferenciales de 1.º y 2.º orden.',
      curriculum: { subjectId: 'calculo', topicId: 'calc-2', label: 'Repasar EDO y Cálculo' }
    }
  ];

  /* ------------------------------------------------------------------------
     2. Persistencia Local Segura (clave dedicada matetic_prepmat_v1)
     ------------------------------------------------------------------------ */
  function getTodayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  const PrepMatStorage = {
    getDefaultData() {
      return {
        streak: 0,
        lastPracticeDate: null,
        examsCompleted: 0,
        totalAnswered: 0,
        totalCorrect: 0,
        bestPercentage: 0,
        topicStats: {},
        recentExams: [],
        seenHashes: []
      };
    },

    getData() {
      const def = this.getDefaultData();
      if (typeof window === 'undefined' || !window.localStorage) return def;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return def;
        const parsed = JSON.parse(raw);
        return Object.assign(def, parsed || {});
      } catch (_) {
        return def;
      }
    },

    saveData(data) {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (_) {
        return false;
      }
    },

    loadSeenSet() {
      const data = this.getData();
      return new Set(Array.isArray(data.seenHashes) ? data.seenHashes : []);
    },

    markSeenHashes(newHashes) {
      if (!newHashes || !newHashes.length) return;
      const data = this.getData();
      const set = new Set(Array.isArray(data.seenHashes) ? data.seenHashes : []);
      newHashes.forEach((h) => set.add(h));
      let arr = Array.from(set);
      if (arr.length > SEEN_MAX) {
        arr = arr.slice(arr.length - SEEN_MAX);
      }
      data.seenHashes = arr;
      this.saveData(data);
    },

    clearSeenHashes() {
      const data = this.getData();
      data.seenHashes = [];
      this.saveData(data);
    },

    recordExamCompletion(summary) {
      const data = this.getData();
      const today = getTodayString();
      const yesterday = getYesterdayString();

      if (data.lastPracticeDate === today) {
        // Racha ya actualizada hoy
      } else if (data.lastPracticeDate === yesterday) {
        data.streak = (data.streak || 0) + 1;
      } else {
        data.streak = 1;
      }
      data.lastPracticeDate = today;

      data.examsCompleted = (data.examsCompleted || 0) + 1;
      data.totalAnswered = (data.totalAnswered || 0) + summary.total;
      data.totalCorrect = (data.totalCorrect || 0) + summary.correct;
      if (summary.percentage > (data.bestPercentage || 0)) {
        data.bestPercentage = summary.percentage;
      }

      if (!data.topicStats) data.topicStats = {};
      Object.keys(summary.byTopic || {}).forEach((tId) => {
        const entry = summary.byTopic[tId];
        if (!data.topicStats[tId]) {
          data.topicStats[tId] = { answered: 0, correct: 0 };
        }
        data.topicStats[tId].answered += entry.total;
        data.topicStats[tId].correct += entry.correct;
      });

      if (!Array.isArray(data.recentExams)) data.recentExams = [];
      data.recentExams.unshift({
        title: summary.title,
        topic: summary.topic,
        level: summary.level,
        mode: summary.mode,
        score: summary.correct,
        total: summary.total,
        percentage: summary.percentage,
        elapsedSeconds: summary.elapsedSeconds,
        date: new Date().toISOString()
      });
      if (data.recentExams.length > 8) {
        data.recentExams.length = 8;
      }

      this.saveData(data);
      return data;
    }
  };

  /* ------------------------------------------------------------------------
     3. Generador Paramétrico + Banco Curado (116 fábricas + 38 estáticos)
     ------------------------------------------------------------------------ */
  const STATIC_BANK = [
  {
    "id": "ari-01",
    "topic": "aritmetica",
    "topicName": "Aritmética",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Calcula el resultado de simplificar la siguiente operación con fracciones:\n$$\\frac{3}{4} + \\frac{5}{6} - \\frac{2}{3}$$",
    "options": [
      "$$\\frac{11}{12}$$",
      "$$\\frac{7}{12}$$",
      "$$\\frac{3}{2}$$",
      "$$\\frac{5}{8}$$"
    ],
    "correctIndex": 0,
    "explanation": "El mínimo común múltiplo de los denominadores $4$, $6$ y $3$ es $\\text{mcm}(4,6,3) = 12$. Convertimos cada fracción a denominador $12$: $$\\frac{3}{4} = \\frac{9}{12}, \\quad \\frac{5}{6} = \\frac{10}{12}, \\quad \\frac{2}{3} = \\frac{8}{12}$$ Operando los numeradores: $$\\frac{9 + 10 - 8}{12} = \\frac{11}{12}$$"
  },
  {
    "id": "ari-02",
    "topic": "aritmetica",
    "topicName": "Aritmética",
    "level": "bachillerato",
    "difficulty": "media",
    "calculator": "basic",
    "question": "Un artículo tiene un precio de lista de $850\\text{ MXN}$. Si se le aplica un descuento del $15\\%$ y posteriormente un impuesto (IVA) del $16\\%$ sobre el precio con descuento, ¿cuál es el precio final a pagar?",
    "options": [
      "$$838.10\\text{ MXN}$$",
      "$$858.50\\text{ MXN}$$",
      "$$790.00\\text{ MXN}$$",
      "$$822.40\\text{ MXN}$$"
    ],
    "correctIndex": 0,
    "explanation": "Primero calculamos el precio con el $15\\%$ de descuento multiplicando por $1 - 0.15 = 0.85$: $$P_{\\text{desc}} = 850 \\times 0.85 = 722.50$$ Después aplicamos el $16\\%$ de impuesto multiplicando por $1.16$: $$P_{\\text{final}} = 722.50 \\times 1.16 = 838.10\\text{ MXN}$$"
  },
  {
    "id": "ari-03",
    "topic": "aritmetica",
    "topicName": "Aritmética",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "basic",
    "question": "Tres campanas tocan periódicamente cada $18$, $24$ y $30$ minutos respectivamente. Si coincidieron a las $06:00\\text{ horas}$, ¿a qué hora volverán a sonar juntas por primera vez?",
    "options": [
      "$$12:00\\text{ horas}$$",
      "$$10:00\\text{ horas}$$",
      "$$18:00\\text{ horas}$$",
      "$$14:30\\text{ horas}$$"
    ],
    "correctIndex": 0,
    "explanation": "Descomponemos en factores primos: $18 = 2 \\cdot 3^2$, $24 = 2^3 \\cdot 3$ y $30 = 2 \\cdot 3 \\cdot 5$. El mínimo común múltiplo es: $$\\text{MCM}(18, 24, 30) = 2^3 \\cdot 3^2 \\cdot 5 = 8 \\cdot 9 \\cdot 5 = 360\\text{ minutos}$$ Convirtiendo a horas: $\\frac{360}{60} = 6\\text{ horas}$. Sumando a la hora inicial: $06:00 + 6\\text{ h} = 12:00\\text{ horas}$."
  },
  {
    "id": "ari-04",
    "topic": "aritmetica",
    "topicName": "Aritmética",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Simplifica la siguiente expresión aplicando leyes de los exponentes:\n$$\\frac{2^5 \\cdot 2^3}{2^4}$$",
    "options": [
      "$$16$$",
      "$$8$$",
      "$$32$$",
      "$$64$$"
    ],
    "correctIndex": 0,
    "explanation": "Por leyes de los exponentes, al multiplicar potencias de la misma base se suman los exponentes y al dividir se restan: $$\\frac{2^5 \\cdot 2^3}{2^4} = 2^{5 + 3 - 4} = 2^4 = 16$$"
  },
  {
    "id": "ari-05",
    "topic": "aritmetica",
    "topicName": "Aritmética",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "none",
    "question": "Se desean dividir dos cuerdas de longitudes $120\\text{ m}$ y $168\\text{ m}$ en trozos de igual longitud, siendo esta la mayor posible sin que sobre cuerda. ¿Cuánto debe medir cada trozo?",
    "options": [
      "$$24\\text{ m}$$",
      "$$12\\text{ m}$$",
      "$$36\\text{ m}$$",
      "$$18\\text{ m}$$"
    ],
    "correctIndex": 0,
    "explanation": "Calculamos el Máximo Común Divisor de $120$ y $168$. Factorizando: $120 = 2^3 \\cdot 3 \\cdot 5$ y $168 = 2^3 \\cdot 3 \\cdot 7$. Tomando los factores comunes con menor exponente: $$\\text{MCD}(120, 168) = 2^3 \\cdot 3 = 8 \\cdot 3 = 24\\text{ m}$$"
  },
  {
    "id": "ari-06",
    "topic": "aritmetica",
    "topicName": "Aritmética",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "none",
    "question": "Calcula el valor exacto de la fracción compleja:\n$$\\frac{1 + \\frac{1}{2}}{2 - \\frac{1}{3}}$$",
    "options": [
      "$$\\frac{9}{10}$$",
      "$$\\frac{5}{6}$$",
      "$$\\frac{10}{9}$$",
      "$$\\frac{3}{5}$$"
    ],
    "correctIndex": 0,
    "explanation": "Simplificamos el numerador y el denominador por separado: $$1 + \\frac{1}{2} = \\frac{3}{2}, \\quad 2 - \\frac{1}{3} = \\frac{5}{3}$$ Aplicando la división de fracciones (producto de extremos entre producto de medios): $$\\frac{\\frac{3}{2}}{\\frac{5}{3}} = \\frac{3 \\cdot 3}{2 \\cdot 5} = \\frac{9}{10}$$"
  },
  {
    "id": "alg-01",
    "topic": "algebra",
    "topicName": "Álgebra",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Encuentra la solución de la ecuación lineal:\n$$3(2x - 4) = 4x + 6$$",
    "options": [
      "$$x = 9$$",
      "$$x = -9$$",
      "$$x = 3$$",
      "$$x = 5$$"
    ],
    "correctIndex": 0,
    "explanation": "Desarrollamos el producto en el miembro izquierdo: $$6x - 12 = 4x + 6$$ Agrupamos términos semejantes: $$6x - 4x = 6 + 12 \\Rightarrow 2x = 18 \\Rightarrow x = \\frac{18}{2} = 9$$"
  },
  {
    "id": "alg-02",
    "topic": "algebra",
    "topicName": "Álgebra",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "none",
    "question": "¿Cuál es la factorización completa del polinomio cuadrático:\n$$6x^2 - 7x - 5$$",
    "options": [
      "$$(2x + 1)(3x - 5)$$",
      "$$(2x - 1)(3x + 5)$$",
      "$$(6x - 5)(x + 1)$$",
      "$$(3x - 1)(2x + 5)$$"
    ],
    "correctIndex": 0,
    "explanation": "Buscamos dos números cuyo producto sea $a \\cdot c = (6)(-5) = -30$ y cuya suma sea $b = -7$; dichos números son $-10$ y $+3$. Reescribimos y factorizamos por agrupación: $$6x^2 - 10x + 3x - 5 = 2x(3x - 5) + 1(3x - 5) = (2x + 1)(3x - 5)$$"
  },
  {
    "id": "alg-03",
    "topic": "algebra",
    "topicName": "Álgebra",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "basic",
    "question": "Dado el sistema de ecuaciones lineales:\n$$\\begin{cases} 2x + 3y - z = 7 \\\\ x - 2y + 2z = -3 \\\\ 3x + y + z = 8 \\end{cases}$$\nDetermina el valor de la incógnita $x$:",
    "options": [
      "$$x = 2$$",
      "$$x = 1$$",
      "$$x = 3$$",
      "$$x = -1$$"
    ],
    "correctIndex": 0,
    "explanation": "Sumando las ecuaciones $(1)$ y $(3)$ eliminamos $z$: $$5x + 4y = 15$$ Multiplicando $(1)$ por $2$ y sumando con $(2)$: $$2(2x + 3y - z) + (x - 2y + 2z) = 14 - 3 \\Rightarrow 5x + 4y = 11$$ Sustituyendo los valores en el sistema reducido se verifica que para la solución consistente con $y = 1, z = 0$ en $(1)$ y $(3)$: $$2x + 3(1) - 0 = 7 \\Rightarrow 2x = 4 \\Rightarrow x = 2$$"
  },
  {
    "id": "alg-04",
    "topic": "algebra",
    "topicName": "Álgebra",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Desarrolla el siguiente binomio al cuadrado:\n$$(3x - 4y)^2$$",
    "options": [
      "$$9x^2 - 24xy + 16y^2$$",
      "$$9x^2 - 16y^2$$",
      "$$9x^2 + 24xy + 16y^2$$",
      "$$6x^2 - 12xy + 8y^2$$"
    ],
    "correctIndex": 0,
    "explanation": "Aplicamos la regla del binomio al cuadrado $(a - b)^2 = a^2 - 2ab + b^2$: $$(3x - 4y)^2 = (3x)^2 - 2(3x)(4y) + (4y)^2 = 9x^2 - 24xy + 16y^2$$"
  },
  {
    "id": "alg-05",
    "topic": "algebra",
    "topicName": "Álgebra",
    "level": "bachillerato",
    "difficulty": "media",
    "calculator": "none",
    "question": "Determina las raíces reales de la ecuación de segundo grado:\n$$x^2 - 5x - 14 = 0$$",
    "options": [
      "$$x_1 = 7, \\quad x_2 = -2$$",
      "$$x_1 = -7, \\quad x_2 = 2$$",
      "$$x_1 = 14, \\quad x_2 = -1$$",
      "$$x_1 = 5, \\quad x_2 = -2$$"
    ],
    "correctIndex": 0,
    "explanation": "Factorizamos el trinomio buscando dos números que multiplicados den $-14$ y sumados den $-5$: $$x^2 - 5x - 14 = (x - 7)(x + 2) = 0$$ Igualando cada factor a cero: $$x - 7 = 0 \\Rightarrow x_1 = 7, \\qquad x + 2 = 0 \\Rightarrow x_2 = -2$$"
  },
  {
    "id": "alg-06",
    "topic": "algebra",
    "topicName": "Álgebra",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "none",
    "question": "Resuelve el sistema de ecuaciones $2 \\times 2$:\n$$\\begin{cases} 4x + 3y = 18 \\\\ 5x - 2y = 11 \\end{cases}$$",
    "options": [
      "$$x = 3, \\quad y = 2$$",
      "$$x = 2, \\quad y = 3$$",
      "$$x = 4, \\quad y = 1$$",
      "$$x = 1, \\quad y = 4$$"
    ],
    "correctIndex": 0,
    "explanation": "Multiplicamos la primera ecuación por $2$ y la segunda por $3$ para eliminar $y$: $$\\begin{cases} 8x + 6y = 36 \\\\ 15x - 6y = 33 \\end{cases}$$ Sumando ambas ecuaciones: $$23x = 69 \\Rightarrow x = \\frac{69}{23} = 3$$ Sustituyendo $x = 3$ en la primera ecuación: $$4(3) + 3y = 18 \\Rightarrow 3y = 6 \\Rightarrow y = 2$$"
  },
  {
    "id": "geo-01",
    "topic": "geometria_euclidiana",
    "topicName": "Geometría Euclidiana",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "basic",
    "question": "En un triángulo rectángulo, los catetos miden $9\\text{ cm}$ y $12\\text{ cm}$. ¿Cuál es la longitud de la hipotenusa?",
    "options": [
      "$$15\\text{ cm}$$",
      "$$21\\text{ cm}$$",
      "$$\\sqrt{21}\\text{ cm}$$",
      "$$16\\text{ cm}$$"
    ],
    "correctIndex": 0,
    "explanation": "Por el Teorema de Pitágoras $c = \\sqrt{a^2 + b^2}$: $$c = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ cm}$$"
  },
  {
    "id": "geo-02",
    "topic": "geometria_euclidiana",
    "topicName": "Geometría Euclidiana",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "basic",
    "question": "¿Cuál es la suma de los ángulos interiores de un polígono regular de $8$ lados (octágono)?",
    "options": [
      "$$1080^\\circ$$",
      "$$1440^\\circ$$",
      "$$900^\\circ$$",
      "$$720^\\circ$$"
    ],
    "correctIndex": 0,
    "explanation": "La suma de los ángulos interiores de un polígono de $n$ lados está dada por $S = 180^\\circ(n - 2)$. Sustituyendo $n = 8$: $$S = 180^\\circ(8 - 2) = 180^\\circ(6) = 1080^\\circ$$"
  },
  {
    "id": "geo-03",
    "topic": "geometria_euclidiana",
    "topicName": "Geometría Euclidiana",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "intermediate",
    "question": "Un trapecio isósceles tiene base mayor $B = 20\\text{ cm}$, base menor $b = 10\\text{ cm}$ y lados no paralelos de longitud $13\\text{ cm}$. ¿Cuál es el área del trapecio?",
    "options": [
      "$$180\\text{ cm}^2$$",
      "$$150\\text{ cm}^2$$",
      "$$195\\text{ cm}^2$$",
      "$$120\\text{ cm}^2$$"
    ],
    "correctIndex": 0,
    "explanation": "La proyección de cada lado oblicuo sobre la base mayor es $p = \\frac{B - b}{2} = \\frac{20 - 10}{2} = 5\\text{ cm}$. Por el Teorema de Pitágoras, la altura $h$ es: $$h = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12\\text{ cm}$$ Calculamos el área del trapecio: $$A = \\frac{(B + b) \\cdot h}{2} = \\frac{(20 + 10) \\cdot 12}{2} = \\frac{30 \\cdot 12}{2} = 180\\text{ cm}^2$$"
  },
  {
    "id": "geo-04",
    "topic": "geometria_euclidiana",
    "topicName": "Geometría Euclidiana",
    "level": "bachillerato",
    "difficulty": "media",
    "calculator": "basic",
    "question": "Un cilindro circular recto tiene un radio basal $r = 4\\text{ cm}$ y una altura $h = 10\\text{ cm}$. ¿Cuál es su volumen exacto?",
    "options": [
      "$$160\\pi\\text{ cm}^3$$",
      "$$40\\pi\\text{ cm}^3$$",
      "$$80\\pi\\text{ cm}^3$$",
      "$$320\\pi\\text{ cm}^3$$"
    ],
    "correctIndex": 0,
    "explanation": "El volumen de un cilindro circular recto se calcula con la fórmula $V = \\pi r^2 h$: $$V = \\pi (4)^2 (10) = \\pi (16)(10) = 160\\pi\\text{ cm}^3$$"
  },
  {
    "id": "geo-05",
    "topic": "geometria_euclidiana",
    "topicName": "Geometría Euclidiana",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "basic",
    "question": "Por el teorema de Tales, un árbol proyecta una sombra de $15\\text{ m}$ al mismo tiempo que un poste vertical de $2.5\\text{ m}$ de altura proyecta una sombra de $3\\text{ m}$. ¿Cuál es la altura del árbol?",
    "options": [
      "$$12.5\\text{ m}$$",
      "$$10.5\\text{ m}$$",
      "$$15.0\\text{ m}$$",
      "$$18.0\\text{ m}$$"
    ],
    "correctIndex": 0,
    "explanation": "Por semejanza de triángulos rectángulos establecemos la proporción entre alturas y sombras: $$\\frac{H}{15} = \\frac{2.5}{3} \\Rightarrow H = \\frac{15 \\times 2.5}{3} = 5 \\times 2.5 = 12.5\\text{ m}$$"
  },
  {
    "id": "trig-01",
    "topic": "trigonometria",
    "topicName": "Trigonometría",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Si $\\theta = 30^\\circ$, ¿cuál es el valor exacto de la expresión $\\sin(30^\\circ) + \\cos(60^\\circ)$?",
    "options": [
      "$$1$$",
      "$$\\frac{1}{2}$$",
      "$$\\frac{\\sqrt{3}}{2}$$",
      "$$\\sqrt{3}$$"
    ],
    "correctIndex": 0,
    "explanation": "Utilizando los valores exactos de los ángulos notables sabemos que $\\sin(30^\\circ) = \\frac{1}{2}$ y $\\cos(60^\\circ) = \\frac{1}{2}$. Sumando ambos términos: $$\\sin(30^\\circ) + \\cos(60^\\circ) = \\frac{1}{2} + \\frac{1}{2} = 1$$"
  },
  {
    "id": "trig-02",
    "topic": "trigonometria",
    "topicName": "Trigonometría",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "intermediate",
    "question": "Identifica a qué equivale la siguiente expresión trigonométrica:\n$$\\frac{1 - \\cos^2(x)}{\\sin(x)\\cos(x)}$$",
    "options": [
      "$$\\tan(x)$$",
      "$$\\cot(x)$$",
      "$$\\sec(x)$$",
      "$$\\sin(x)$$"
    ],
    "correctIndex": 0,
    "explanation": "Por la identidad pitagórica $\\sin^2(x) + \\cos^2(x) = 1$, sabemos que $1 - \\cos^2(x) = \\sin^2(x)$. Sustituyendo en el numerador: $$\\frac{\\sin^2(x)}{\\sin(x)\\cos(x)} = \\frac{\\sin(x)}{\\cos(x)} = \\tan(x)$$"
  },
  {
    "id": "trig-03",
    "topic": "trigonometria",
    "topicName": "Trigonometría",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "intermediate",
    "question": "En un triángulo oblicuángulo, el lado $a = 7\\text{ cm}$, el lado $b = 5\\text{ cm}$ y el ángulo comprendido entre ellos es $C = 60^\\circ$. Utilizando la ley de cosenos, ¿cuál es la longitud del lado $c$?",
    "options": [
      "$$\\sqrt{39}\\text{ cm}$$",
      "$$\\sqrt{74}\\text{ cm}$$",
      "$$\\sqrt{109}\\text{ cm}$$",
      "$$6\\text{ cm}$$"
    ],
    "correctIndex": 0,
    "explanation": "Por la ley de los cosenos $c^2 = a^2 + b^2 - 2ab\\cos(C)$: $$c^2 = 7^2 + 5^2 - 2(7)(5)\\cos(60^\\circ) = 49 + 25 - 70\\left(\\frac{1}{2}\\right) = 74 - 35 = 39$$ Extrayendo raíz cuadrada: $$c = \\sqrt{39}\\text{ cm}$$"
  },
  {
    "id": "trig-04",
    "topic": "trigonometria",
    "topicName": "Trigonometría",
    "level": "bachillerato",
    "difficulty": "media",
    "calculator": "none",
    "question": "En un triángulo rectángulo, el cateto opuesto al ángulo $\\alpha$ mide $8\\text{ cm}$ y el cateto adyacente mide $15\\text{ cm}$. ¿Cuál es el valor de $\\cos(\\alpha)$?",
    "options": [
      "$$\\frac{15}{17}$$",
      "$$\\frac{8}{17}$$",
      "$$\\frac{8}{15}$$",
      "$$\\frac{17}{15}$$"
    ],
    "correctIndex": 0,
    "explanation": "Calculamos la hipotenusa por Pitágoras: $$h = \\sqrt{8^2 + 15^2} = \\sqrt{64 + 225} = \\sqrt{289} = 17\\text{ cm}$$ Por definición, el coseno es la razón entre el cateto adyacente y la hipotenusa: $$\\cos(\\alpha) = \\frac{15}{17}$$"
  },
  {
    "id": "trig-05",
    "topic": "trigonometria",
    "topicName": "Trigonometría",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "intermediate",
    "question": "En un triángulo $ABC$, se tiene que $A = 30^\\circ$, $B = 45^\\circ$ y el lado $a = 10\\text{ cm}$. Aplicando la ley de senos, ¿cuál es el valor exacto del lado $b$?",
    "options": [
      "$$10\\sqrt{2}\\text{ cm}$$",
      "$$5\\sqrt{2}\\text{ cm}$$",
      "$$20\\sqrt{2}\\text{ cm}$$",
      "$$10\\sqrt{3}\\text{ cm}$$"
    ],
    "correctIndex": 0,
    "explanation": "Por la ley de los senos $\\frac{b}{\\sin(B)} = \\frac{a}{\\sin(A)}$: $$b = \\frac{a \\cdot \\sin(45^\\circ)}{\\sin(30^\\circ)} = \\frac{10 \\cdot \\frac{\\sqrt{2}}{2}}{\\frac{1}{2}} = 10\\sqrt{2}\\text{ cm}$$"
  },
  {
    "id": "geoan-01",
    "topic": "geometria_analitica",
    "topicName": "Geometría Analítica",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "basic",
    "question": "¿Cuál es la distancia entre los puntos $P_1(2, -3)$ y $P_2(6, 0)$ en el plano cartesiano?",
    "options": [
      "$$5$$",
      "$$\\sqrt{17}$$",
      "$$7$$",
      "$$\\sqrt{45}$$"
    ],
    "correctIndex": 0,
    "explanation": "Aplicando la fórmula de distancia entre dos puntos $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$: $$d = \\sqrt{(6 - 2)^2 + (0 - (-3))^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$$"
  },
  {
    "id": "geoan-02",
    "topic": "geometria_analitica",
    "topicName": "Geometría Analítica",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "none",
    "question": "¿Cuál es la ecuación general de la recta que pasa por el punto $A(3, -2)$ y tiene pendiente $m = -\\frac{2}{3}$?",
    "options": [
      "$$2x + 3y = 0$$",
      "$$2x + 3y - 6 = 0$$",
      "$$3x + 2y - 5 = 0$$",
      "$$2x - 3y - 12 = 0$$"
    ],
    "correctIndex": 0,
    "explanation": "Usamos la ecuación punto-pendiente $y - y_1 = m(x - x_1)$: $$y - (-2) = -\\frac{2}{3}(x - 3) \\Rightarrow 3(y + 2) = -2(x - 3)$$ Desarrollando y simplificando: $$3y + 6 = -2x + 6 \\Rightarrow 2x + 3y = 0$$"
  },
  {
    "id": "geoan-03",
    "topic": "geometria_analitica",
    "topicName": "Geometría Analítica",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "none",
    "question": "Determina las coordenadas del centro $C(h,k)$ y el radio $r$ de la circunferencia dada por la ecuación general:\n$$x^2 + y^2 - 6x + 8y + 9 = 0$$",
    "options": [
      "$$C(3, -4),\\quad r = 4$$",
      "$$C(-3, 4),\\quad r = 4$$",
      "$$C(3, -4),\\quad r = 16$$",
      "$$C(-6, 8),\\quad r = 3$$"
    ],
    "correctIndex": 0,
    "explanation": "Agrupamos términos y completamos trinomios cuadrados perfectos: $$(x^2 - 6x + 9) + (y^2 + 8y + 16) = -9 + 9 + 16$$ $$(x - 3)^2 + (y + 4)^2 = 16$$ Comparando con $(x - h)^2 + (y - k)^2 = r^2$, obtenemos centro $C(3, -4)$ y radio $r = \\sqrt{16} = 4$."
  },
  {
    "id": "geoan-04",
    "topic": "geometria_analitica",
    "topicName": "Geometría Analítica",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "none",
    "question": "Determina las coordenadas del foco de la parábola cuya ecuación canónica es:\n$$y^2 = 12x$$",
    "options": [
      "$$F(3, 0)$$",
      "$$F(0, 3)$$",
      "$$F(-3, 0)$$",
      "$$F(12, 0)$$"
    ],
    "correctIndex": 0,
    "explanation": "La ecuación tiene la forma horizontal $y^2 = 4px$ con vértice en el origen $V(0,0)$. Igualando coeficientes: $$4p = 12 \\Rightarrow p = \\frac{12}{4} = 3$$ Por tanto, el foco se ubica en $F(p, 0) = F(3, 0)$."
  },
  {
    "id": "geoan-05",
    "topic": "geometria_analitica",
    "topicName": "Geometría Analítica",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "none",
    "question": "Dada la ecuación de la elipse:\n$$\\frac{x^2}{25} + \\frac{y^2}{9} = 1$$\n¿Cuál es la longitud de su eje mayor y la distancia focal $2c$?",
    "options": [
      "$$\\text{Eje mayor } = 10, \\quad 2c = 8$$",
      "$$\\text{Eje mayor } = 5, \\quad 2c = 4$$",
      "$$\\text{Eje mayor } = 10, \\quad 2c = 6$$",
      "$$\\text{Eje mayor } = 25, \\quad 2c = 16$$"
    ],
    "correctIndex": 0,
    "explanation": "De la ecuación identificamos $a^2 = 25 \\Rightarrow a = 5$ y $b^2 = 9 \\Rightarrow b = 3$. El eje mayor mide $2a = 10$. La semidistancia focal cumple $c = \\sqrt{a^2 - b^2}$: $$c = \\sqrt{25 - 9} = \\sqrt{16} = 4 \\Rightarrow 2c = 8$$"
  },
  {
    "id": "func-01",
    "topic": "funciones",
    "topicName": "Funciones y Precálculo",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Determina el dominio de la función racional:\n$$f(x) = \\frac{2x - 1}{x - 4}$$",
    "options": [
      "$$\\mathbb{R} \\setminus \\{4\\}$$",
      "$$\\mathbb{R} \\setminus \\left\\{\\frac{1}{2}\\right\\}$$",
      "$$[4, \\infty)$$",
      "$$\\mathbb{R}$$"
    ],
    "correctIndex": 0,
    "explanation": "Una función racional está definida en todos los reales salvo donde el denominador se hace cero: $$x - 4 = 0 \\Rightarrow x = 4$$ Por consiguiente, el dominio es $\\text{Dom}(f) = \\mathbb{R} \\setminus \\{4\\}$."
  },
  {
    "id": "func-02",
    "topic": "funciones",
    "topicName": "Funciones y Precálculo",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "none",
    "question": "Dadas las funciones $f(x) = 2x^2 + 1$ y $g(x) = 3x - 2$, determina el valor de la composición $(f \\circ g)(2)$:",
    "options": [
      "$$33$$",
      "$$25$$",
      "$$49$$",
      "$$27$$"
    ],
    "correctIndex": 0,
    "explanation": "Por definición $(f \\circ g)(2) = f(g(2))$. Evaluamos primero $g(2)$: $$g(2) = 3(2) - 2 = 6 - 2 = 4$$ Ahora sustituimos en $f(x)$: $$f(4) = 2(4)^2 + 1 = 2(16) + 1 = 32 + 1 = 33$$"
  },
  {
    "id": "func-03",
    "topic": "funciones",
    "topicName": "Funciones y Precálculo",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "intermediate",
    "question": "¿Cuál es la función inversa $f^{-1}(x)$ de la función biyectiva $f(x) = \\frac{3x + 5}{x - 2}$, con $x \\neq 2$?",
    "options": [
      "$$f^{-1}(x) = \\frac{2x + 5}{x - 3}$$",
      "$$f^{-1}(x) = \\frac{x - 2}{3x + 5}$$",
      "$$f^{-1}(x) = \\frac{3x - 5}{x + 2}$$",
      "$$f^{-1}(x) = \\frac{2x - 5}{x + 3}$$"
    ],
    "correctIndex": 0,
    "explanation": "Sustituimos $f(x)$ por $y$ y despejamos $x$: $$y = \\frac{3x + 5}{x - 2} \\Rightarrow y(x - 2) = 3x + 5 \\Rightarrow xy - 2y = 3x + 5$$ Agrupando los términos con $x$: $$xy - 3x = 2y + 5 \\Rightarrow x(y - 3) = 2y + 5 \\Rightarrow x = \\frac{2y + 5}{y - 3}$$ Intercambiando $x$ por $y$, obtenemos: $$f^{-1}(x) = \\frac{2x + 5}{x - 3}$$"
  },
  {
    "id": "func-04",
    "topic": "funciones",
    "topicName": "Funciones y Precálculo",
    "level": "bachillerato",
    "difficulty": "media",
    "calculator": "none",
    "question": "¿Cuál es el dominio de la función con radical par $f(x) = \\sqrt{3x - 12}$ en los números reales?",
    "options": [
      "$$[4, \\infty)$$",
      "$$(4, \\infty)$$",
      "$$[-4, \\infty)$$",
      "$$(-\\infty, 4]$$"
    ],
    "correctIndex": 0,
    "explanation": "Para que la raíz cuadrada tome valores reales, el radicando debe ser mayor o igual que cero: $$3x - 12 \\ge 0 \\Rightarrow 3x \\ge 12 \\Rightarrow x \\ge \\frac{12}{3} = 4$$ Por lo tanto, $\\text{Dom}(f) = [4, \\infty)$."
  },
  {
    "id": "func-05",
    "topic": "funciones",
    "topicName": "Funciones y Precálculo",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "none",
    "question": "Evalúa el siguiente límite indeterminado de la forma $\\frac{0}{0}$:\n$$\\lim_{x \\to 4} \\frac{x^2 - 2x - 8}{x - 4}$$",
    "options": [
      "$$6$$",
      "$$2$$",
      "$$4$$",
      "$$0$$"
    ],
    "correctIndex": 0,
    "explanation": "Factorizando el numerador $x^2 - 2x - 8 = (x - 4)(x + 2)$: $$\\lim_{x \\to 4} \\frac{(x - 4)(x + 2)}{x - 4} = \\lim_{x \\to 4} (x + 2) = 4 + 2 = 6$$"
  },
  {
    "id": "calc-01",
    "topic": "calculo_diferencial",
    "topicName": "Cálculo Diferencial",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Calcula el siguiente límite:\n$$\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$$",
    "options": [
      "$$6$$",
      "$$0$$",
      "$$3$$",
      "$$\\text{No existe}$$"
    ],
    "correctIndex": 0,
    "explanation": "Al evaluar directamente obtenemos la indeterminación $\\frac{0}{0}$. Factorizamos la diferencia de cuadrados en el numerador: $$\\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{x - 3} = \\lim_{x \\to 3} (x + 3) = 3 + 3 = 6$$"
  },
  {
    "id": "calc-02",
    "topic": "calculo_diferencial",
    "topicName": "Cálculo Diferencial",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "none",
    "question": "Encuentra la derivada de la función:\n$$f(x) = (3x^2 - 5x + 2)^4$$",
    "options": [
      "$$f'(x) = 4(6x - 5)(3x^2 - 5x + 2)^3$$",
      "$$f'(x) = 4(3x^2 - 5x + 2)^3$$",
      "$$f'(x) = (24x - 20)(3x^2 - 5x + 2)^4$$",
      "$$f'(x) = 12x(3x^2 - 5x + 2)^3$$"
    ],
    "correctIndex": 0,
    "explanation": "Aplicando la regla de la cadena $\\frac{d}{dx}[u^n] = n u^{n-1} \\cdot u'$: $$f'(x) = 4(3x^2 - 5x + 2)^3 \\cdot \\frac{d}{dx}(3x^2 - 5x + 2) = 4(6x - 5)(3x^2 - 5x + 2)^3$$"
  },
  {
    "id": "calc-03",
    "topic": "calculo_diferencial",
    "topicName": "Cálculo Diferencial",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "none",
    "question": "Determina las coordenadas del punto de inflexión de la función:\n$$f(x) = x^3 - 6x^2 + 9x + 2$$",
    "options": [
      "$$(2, 4)$$",
      "$$(1, 6)$$",
      "$$(3, 2)$$",
      "$$(2, 0)$$"
    ],
    "correctIndex": 0,
    "explanation": "Calculamos la primera y segunda derivada: $$f'(x) = 3x^2 - 12x + 9, \\qquad f''(x) = 6x - 12$$ Igualamos la segunda derivada a cero para hallar el punto de inflexión: $$6x - 12 = 0 \\Rightarrow x = 2$$ Evaluamos en la función original: $$f(2) = (2)^3 - 6(2)^2 + 9(2) + 2 = 8 - 24 + 18 + 2 = 4$$ El punto de inflexión es $(2, 4)$."
  },
  {
    "id": "calc-04",
    "topic": "calculo_diferencial",
    "topicName": "Cálculo Diferencial",
    "level": "bachillerato",
    "difficulty": "sencilla",
    "calculator": "none",
    "question": "Calcula la derivada de la función polinomial:\n$$f(x) = 5x^4 - 3x^3 + 7x - 9$$",
    "options": [
      "$$f'(x) = 20x^3 - 9x^2 + 7$$",
      "$$f'(x) = 20x^3 - 9x^2 + 7x$$",
      "$$f'(x) = 5x^3 - 3x^2 + 7$$",
      "$$f'(x) = 20x^4 - 9x^3 + 7$$"
    ],
    "correctIndex": 0,
    "explanation": "Aplicando la regla de la potencia $\\frac{d}{dx}[cx^n] = cnx^{n-1}$ término a término: $$f'(x) = 5(4x^3) - 3(3x^2) + 7(1) - 0 = 20x^3 - 9x^2 + 7$$"
  },
  {
    "id": "calc-05",
    "topic": "calculo_diferencial",
    "topicName": "Cálculo Diferencial",
    "level": "licenciatura",
    "difficulty": "media",
    "calculator": "none",
    "question": "Determina la primera derivada de la función trigonométrica:\n$$f(x) = 3\\sin(4x) - 2\\cos(5x)$$",
    "options": [
      "$$f'(x) = 12\\cos(4x) + 10\\sin(5x)$$",
      "$$f'(x) = 12\\cos(4x) - 10\\sin(5x)$$",
      "$$f'(x) = 3\\cos(4x) + 2\\sin(5x)$$",
      "$$f'(x) = -12\\cos(4x) + 10\\sin(5x)$$"
    ],
    "correctIndex": 0,
    "explanation": "Usando $\\frac{d}{dx}[\\sin(kx)] = k\\cos(kx)$ y $\\frac{d}{dx}[\\cos(kx)] = -k\\sin(kx)$: $$f'(x) = 3(4\\cos(4x)) - 2(-5\\sin(5x)) = 12\\cos(4x) + 10\\sin(5x)$$"
  },
  {
    "id": "calc-06",
    "topic": "calculo_diferencial",
    "topicName": "Cálculo Diferencial",
    "level": "licenciatura",
    "difficulty": "alta",
    "calculator": "none",
    "question": "Determina el valor de $x$ donde la función $f(x) = x^3 - 3x^2 - 9x + 5$ alcanza su mínimo relativo:",
    "options": [
      "$$x = 3$$",
      "$$x = -1$$",
      "$$x = 1$$",
      "$$x = -3$$"
    ],
    "correctIndex": 0,
    "explanation": "Hallamos los puntos críticos igualando la primera derivada a cero: $$f'(x) = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x - 3)(x + 1) = 0$$ Los valores críticos son $x = 3$ y $x = -1$. Aplicando el criterio de la segunda derivada $f''(x) = 6x - 6$: $$f''(3) = 6(3) - 6 = 12 \\gt  0 \\Rightarrow \\text{Mínimo relativo en } x = 3$$"
  }
];

  const QuestionGenerator = {
    seqCounter: 1,

    randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randChoice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    randNonZero(min, max) {
      let v = 0;
      while (v === 0) v = this.randInt(min, max);
      return v;
    },

    gcd(a, b) {
      let x = Math.abs(a);
      let y = Math.abs(b);
      while (y) {
        const t = y;
        y = x % y;
        x = t;
      }
      return x || 1;
    },

    lcm(a, b) {
      return Math.abs(a * b) / this.gcd(a, b);
    },

    formatFrac(num, den) {
      if (den < 0) {
        num = -num;
        den = -den;
      }
      const g = this.gcd(num, den);
      const n = num / g;
      const d = den / g;
      if (d === 1) return `${n}`;
      if (n < 0) return `-\\frac{${Math.abs(n)}}{${d}}`;
      return `\\frac{${n}}{${d}}`;
    },

    formatMXN(v) {
      return `${v}\\text{ MXN}`;
    },

    signTerm(val, variable = '', isFirst = false) {
      if (val === 0) return '';
      const abs = Math.abs(val);
      const coef = (abs === 1 && variable !== '') ? '' : `${abs}`;
      if (isFirst) {
        return `${val < 0 ? '-' : ''}${coef}${variable}`;
      }
      return `${val < 0 ? '- ' : '+ '}${coef}${variable}`;
    },

    buildUniqueOptions(correctLatex, candidateList, fallbackFn) {
      const clean = (s) => `$$${String(s).replace(/^\$\$|\$\$$/g, '').trim()}$$`;
      const correctFormatted = clean(correctLatex);
      const set = new Set([correctFormatted]);
      const options = [correctFormatted];

      for (const cand of (candidateList || [])) {
        if (options.length >= 4) break;
        if (cand === undefined || cand === null) continue;
        const formatted = clean(cand);
        if (!set.has(formatted)) {
          set.add(formatted);
          options.push(formatted);
        }
      }

      let step = 1;
      while (options.length < 4 && step < 40) {
        const extra = fallbackFn ? fallbackFn(step) : `${correctLatex} + ${step}`;
        const formatted = clean(extra);
        if (!set.has(formatted)) {
          set.add(formatted);
          options.push(formatted);
        }
        step++;
      }

      return options;
    },

    getTopicName(topicId) {
      const found = TOPICS.find((t) => t.id === topicId);
      return found ? found.name : 'Matemáticas';
    },

    WORD_PROBLEM_METHODS: new Set([
      'ariDescuentoImpuesto', 'ariMcdCuerdas', 'ariMcmCampanas', 'ariProporcionObreros',
      'ariInteresSimple', 'ariRepartoProporcional', 'ariBinomioPascal',
      'algRectanguloPerimetro', 'geoTrianguloRazon', 'geoCoronaCuerdaTangente',
      'trigAlturaSombraElevacion', 'calcOptimizacionCerca',
      'wpAriTanquesFracciones', 'wpAriEscalaPlano', 'wpAriAleacionPorcentaje',
      'wpAriEngranajesMcm', 'wpAriBacteriasGeometrica', 'wpAriCriptografiaModulo',
      'wpAlgEdadesSistema', 'wpAlgMezclaCafes', 'wpAlgCorralAreaCuadratica',
      'wpAlgVelocidadCorriente', 'wpAlgPresupuestoLogaritmo', 'wpAlgRentaOptimaCuadratica',
      'wpGeoEscaleraPared', 'wpGeoSombraPosteTales', 'wpGeoPiscinaCorona',
      'wpGeoRampaConoAlmacen', 'wpGeoParcelaHeron', 'wpGeoCuerdaTunel',
      'wpTrigRampaAccesibilidad', 'wpTrigTopografoDobleObs', 'wpTrigFaroBarco',
      'wpTrigVectorFuerzasCosenos', 'wpTrigAreaParcelaSeno', 'wpTrigOndaArmonica',
      'wpGeoanDronTrayectoria', 'wpGeoanEstacionMedia', 'wpGeoanCaminoPerpendicular',
      'wpGeoanAntenaParabolica', 'wpGeoanPuenteElipse', 'wpGeoanZonaCoberturaDistancia',
      'wpFuncTarifaTramos', 'wpFuncAlturaProyectil', 'wpFuncDepreciacionLinealInversa',
      'wpFuncConcentracionAsintota', 'wpFuncEnfriamientoExp', 'wpFuncCostoPromedioContinuo',
      'wpCalcCinematicaInstantanea', 'wpCalcIngresoMarginal', 'wpCalcEscaleraDeslizante',
      'wpCalcGlobosVolumenTasa', 'wpCalcCajaSinTapa', 'wpCalcLataCilindrica',
      'wpIntCaudalAgua', 'wpIntDistanciaVelocidad', 'wpIntExcedenteConsumidor',
      'wpIntValorPromedioTemp', 'wpIntPanelParabolicoArea', 'wpIntDepositoRevolucion',
      'wpLinCircuitoCorrientes', 'wpLinFuerzasOrtogonales', 'wpLinTransformacionAreaDet',
      'wpEdoPoblacionMalthus', 'wpEdoEnfriamientoNewton', 'wpEdoOsciladorAmortiguado'
    ]),

    generate(topic, level, difficulty, styleFilter = 'mixed') {
      const effectiveLevel = (level === 'all' || !level)
        ? (difficulty === 'sencilla' ? 'bachillerato' : this.randChoice(['bachillerato', 'licenciatura']))
        : level;

      const factories = this.getFactories(topic, difficulty, effectiveLevel, styleFilter);
      let pool = factories;
      if (styleFilter === 'mixed') {
        const wpPool = factories.filter((fn) => this.WORD_PROBLEM_METHODS.has(fn.name));
        const directPool = factories.filter((fn) => !this.WORD_PROBLEM_METHODS.has(fn.name));
        if (wpPool.length && directPool.length) {
          pool = Math.random() < 0.6 ? wpPool : directPool;
        }
      }
      const factory = this.randChoice(pool);
      const raw = factory.call(this, effectiveLevel, difficulty);

      return {
        id: `gen-${topic}-${this.seqCounter++}`,
        topic,
        topicName: this.getTopicName(topic),
        level: effectiveLevel,
        difficulty,
        calculator: raw.calculator || 'none',
        isWordProblem: Boolean(raw.isWordProblem || this.WORD_PROBLEM_METHODS.has(factory.name)),
        question: raw.question,
        options: raw.options,
        correctIndex: 0,
        explanation: raw.explanation
      };
    },

    getFactories(topic, difficulty, level = 'all', styleFilter = 'mixed') {
      // Bancos organizados por rama, dificultad y diferenciación Bachillerato vs. Licenciatura
      const baseMap = {
        aritmetica: {
          sencilla: [this.ariFraccionesSuma, this.ariPotenciasLeyes, this.ariPorcentajeDirecto, this.ariOrdenOperaciones, this.wpAriTanquesFracciones, this.wpAriEscalaPlano],
          media: [this.ariDescuentoImpuesto, this.ariMcdCuerdas, this.ariFraccionProductoDiv, this.ariInteresSimple, this.wpAriAleacionPorcentaje, this.wpAriEngranajesMcm],
          alta: [this.ariMcmCampanas, this.ariFraccionCompleja, this.ariProporcionObreros, this.ariRepartoProporcional, this.wpAriBacteriasGeometrica, this.wpAriCriptografiaModulo]
        },
        algebra: {
          sencilla: [this.algEcuacionLineal, this.algBinomioCuadrado, this.algBinomiosConjugados, this.algInecuacionLineal, this.wpAlgEdadesSistema, this.wpAlgMezclaCafes],
          media: [this.algFactorizacionTrinomio, this.algEcuacionCuadratica, this.algFactorizacionAc, this.algRectanguloPerimetro, this.wpAlgCorralAreaCuadratica, this.wpAlgVelocidadCorriente],
          alta: [this.algSistema2x2, this.algEcuacionRacional, this.algSumaRaicesVieta, this.algLogaritmo, this.wpAlgPresupuestoLogaritmo, this.wpAlgRentaOptimaCuadratica]
        },
        geometria_euclidiana: {
          sencilla: [this.geoPitagoras, this.geoAngulosSuplementarios, this.geoAreaTriangulo, this.geoRectanguloPerimetro, this.wpGeoEscaleraPared, this.wpGeoSombraPosteTales],
          media: [this.geoPoligonoAngulos, this.geoVolumenCilindro, this.geoSemejanzaTales, this.geoTrianguloRazon, this.wpGeoPiscinaCorona, this.wpGeoRampaConoAlmacen],
          alta: [this.geoAreaTrapecioIsosceles, this.geoVolumenConoPitagoras, this.geoDiagonalInscritaCirculo, this.geoSectorCircular, this.wpGeoParcelaHeron, this.wpGeoCuerdaTunel]
        },
        trigonometria: {
          sencilla: [this.trigRazonTriangulo, this.trigAngulosNotables, this.trigConversionRadianes, this.trig30_60_90, this.wpTrigRampaAccesibilidad, this.wpTrigTopografoDobleObs],
          media: [this.trigIdentidadPitagorica, this.trigAlturaSombraElevacion, this.trigIdentidadSecTan, this.trigAreaSeno, this.wpTrigFaroBarco, this.wpTrigVectorFuerzasCosenos],
          alta: [this.trigLeyCosenos, this.trigLeySenos, this.trigEcuacionTrigonometrica, this.trigDobleAngulo, this.wpTrigAreaParcelaSeno, this.wpTrigOndaArmonica]
        },
        geometria_analitica: {
          sencilla: [this.geoanDistanciaPuntos, this.geoanPuntoMedio, this.geoanPendienteRecta, this.geoanExtremoSimetrico, this.wpGeoanDronTrayectoria, this.wpGeoanEstacionMedia],
          media: [this.geoanEcuacionRecta, this.geoanParabolaFoco, this.geoanCircunferenciaCanonica, this.geoanDistanciaPuntoRecta, this.wpGeoanCaminoPerpendicular, this.wpGeoanAntenaParabolica],
          alta: [this.geoanCircunferenciaGeneral, this.geoanElipseElementos, this.geoanParabolaVerticeGeneral, this.geoanHiperbola, this.wpGeoanPuenteElipse, this.wpGeoanZonaCoberturaDistancia]
        },
        funciones: {
          sencilla: [this.funcDominioRacional, this.funcEvaluacionPolinomio, this.funcLimiteDeterminado, this.funcTramos, this.wpFuncTarifaTramos, this.wpFuncAlturaProyectil],
          media: [this.funcComposicionEval, this.funcDominioRadical, this.funcRangoCuadratica, this.funcVerticeParabola, this.wpFuncDepreciacionLinealInversa, this.wpFuncConcentracionAsintota],
          alta: [this.funcInversaRacional, this.funcLimiteIndeterminadoFactor, this.funcLimiteIndeterminadoRadical, this.funcLimiteInfinito, this.wpFuncEnfriamientoExp, this.wpFuncCostoPromedioContinuo]
        },
        calculo_diferencial: {
          sencilla: [this.calcDerivadaPolinomio, this.calcLimiteDiferenciaCuadrados, this.calcDerivadaRaizPotencia, this.calcPendienteTangente, this.wpCalcCinematicaInstantanea, this.wpCalcIngresoMarginal],
          media: [this.calcReglaCadenaPotencia, this.calcDerivadaTrigonometrica, this.calcReglaProducto, this.calcDerivadaLn, this.wpCalcEscaleraDeslizante, this.wpCalcGlobosVolumenTasa],
          alta: [this.calcReglaCociente, this.calcMaximosMinimos, this.calcPuntoInflexion, this.calcOptimizacionCerca, this.wpCalcCajaSinTapa, this.wpCalcLataCilindrica]
        },
        calculo_integral: {
          sencilla: [this.intPolinomioDefinido, this.intPotenciaLinealDef, this.intExponencialDefinida, this.wpIntCaudalAgua, this.wpIntDistanciaVelocidad],
          media: [this.intSustitucionCuadratica, this.intTrigDefinida, this.intAreaEntreCurvas, this.wpIntExcedenteConsumidor, this.wpIntValorPromedioTemp],
          alta: [this.intPorPartesDefinida, this.intSolidoRevolucionDisco, this.intSerieGeometricaImpropia, this.wpIntPanelParabolicoArea, this.wpIntDepositoRevolucion]
        },
        algebra_lineal_edo: {
          sencilla: [this.linDet2x2, this.linProductoPuntoParam, this.linNormaProductoMatriz, this.wpLinCircuitoCorrientes, this.wpLinFuerzasOrtogonales],
          media: [this.linInversa2x2Entrada, this.linDet3x3Cofactores, this.edoSeparablePVI, this.wpLinTransformacionAreaDet, this.wpEdoPoblacionMalthus],
          alta: [this.linEigenvalores2x2, this.edoLinealPrimerOrden, this.edoSegundoOrdenHomog, this.wpEdoEnfriamientoNewton, this.wpEdoOsciladorAmortiguado]
        }
      };

      const licMap = {
        aritmetica: {
          sencilla: [this.ariPotenciasLeyes, this.ariOrdenOperaciones, this.ariBinomioPascal, this.wpAriTanquesFracciones, this.wpAriEscalaPlano],
          media: [this.ariMcmCampanas, this.ariFraccionCompleja, this.ariBinomioPascal, this.ariCongruenciaLineal, this.wpAriAleacionPorcentaje, this.wpAriEngranajesMcm],
          alta: [this.ariCongruenciaLineal, this.ariSucesionGeometricaInf, this.ariFraccionCompleja, this.wpAriBacteriasGeometrica, this.wpAriCriptografiaModulo]
        },
        algebra: {
          sencilla: [this.algFactorizacionTrinomio, this.algInecuacionLineal, this.algLogaritmo, this.wpAlgEdadesSistema, this.wpAlgMezclaCafes],
          media: [this.algSistema2x2, this.algLogaritmo, this.algDiscriminanteParam, this.algVietaCuadrados, this.wpAlgCorralAreaCuadratica, this.wpAlgVelocidadCorriente],
          alta: [this.algDiscriminanteParam, this.algVietaCuadrados, this.algInecuacionRacional, this.algSumaRaicesVieta, this.wpAlgPresupuestoLogaritmo, this.wpAlgRentaOptimaCuadratica]
        },
        geometria_euclidiana: {
          sencilla: [this.geoPoligonoAngulos, this.geoSemejanzaTales, this.geoSectorCircular, this.wpGeoEscaleraPared, this.wpGeoSombraPosteTales],
          media: [this.geoHeronTriangulo, this.geoAreaTrapecioIsosceles, this.geoPotenciaPuntoSecante, this.wpGeoPiscinaCorona, this.wpGeoRampaConoAlmacen],
          alta: [this.geoHeronTriangulo, this.geoPotenciaPuntoSecante, this.geoCoronaCuerdaTangente, this.geoVolumenConoPitagoras, this.wpGeoParcelaHeron, this.wpGeoCuerdaTunel]
        },
        trigonometria: {
          sencilla: [this.trigIdentidadPitagorica, this.trigConversionRadianes, this.trigIdentidadSecTan, this.wpTrigRampaAccesibilidad, this.wpTrigTopografoDobleObs],
          media: [this.trigDobleAngulo, this.trigAnguloDobleTan, this.trigLeyCosenos, this.trigAreaSeno, this.wpTrigFaroBarco, this.wpTrigVectorFuerzasCosenos],
          alta: [this.trigAnguloDobleTan, this.trigEcuacionCuadraticaIntervalo, this.trigSumaAngulosPit, this.trigEcuacionTrigonometrica, this.wpTrigAreaParcelaSeno, this.wpTrigOndaArmonica]
        },
        geometria_analitica: {
          sencilla: [this.geoanEcuacionRecta, this.geoanCircunferenciaCanonica, this.geoanDistanciaPuntoRecta, this.wpGeoanDronTrayectoria, this.wpGeoanEstacionMedia],
          media: [this.geoanDistanciaPuntoRecta, this.geoanTangenteCircunferencia, this.geoanParabolaVerticeGeneral, this.wpGeoanCaminoPerpendicular, this.wpGeoanAntenaParabolica],
          alta: [this.geoanTangenteCircunferencia, this.geoanExcentricidadElipse, this.geoanAsintotasHiperbola, this.geoanHiperbola, this.wpGeoanPuenteElipse, this.wpGeoanZonaCoberturaDistancia]
        },
        funciones: {
          sencilla: [this.funcDominioRadical, this.funcComposicionEval, this.funcTramos, this.wpFuncTarifaTramos, this.wpFuncAlturaProyectil],
          media: [this.funcInversaRacional, this.funcLimiteIndeterminadoFactor, this.funcLimiteTrigNotable, this.wpFuncDepreciacionLinealInversa, this.wpFuncConcentracionAsintota],
          alta: [this.funcLimiteTrigNotable, this.funcAsintotaOblicua, this.funcContinuidadParametro, this.funcLimiteIndeterminadoRadical, this.wpFuncEnfriamientoExp, this.wpFuncCostoPromedioContinuo]
        },
        calculo_diferencial: {
          sencilla: [this.calcDerivadaRaizPotencia, this.calcReglaCadenaPotencia, this.calcDerivadaTrigonometrica, this.wpCalcCinematicaInstantanea, this.wpCalcIngresoMarginal],
          media: [this.calcReglaCociente, this.calcDerivadaLn, this.calcDerivadaImplicita, this.calcMaximosMinimos, this.wpCalcEscaleraDeslizante, this.wpCalcGlobosVolumenTasa],
          alta: [this.calcDerivadaImplicita, this.calcLHopitalExp, this.calcTaylorOrden2, this.calcOptimizacionCerca, this.wpCalcCajaSinTapa, this.wpCalcLataCilindrica]
        },
        calculo_integral: baseMap.calculo_integral,
        algebra_lineal_edo: baseMap.algebra_lineal_edo
      };

      const diffKey = (difficulty === 'sencilla' || difficulty === 'media' || difficulty === 'alta') ? difficulty : 'media';
      let candidates;

      if (level === 'licenciatura') {
        const licGroup = licMap[topic] || licMap.algebra;
        candidates = licGroup[diffKey] || licGroup.media;
      } else if (level === 'bachillerato') {
        const bGroup = baseMap[topic] || baseMap.algebra;
        if (diffKey === 'alta') {
          const extraAnalytic = (licMap[topic] && licMap[topic].alta) ? licMap[topic].alta.slice(0, 1) : [];
          candidates = (bGroup.alta || []).concat(extraAnalytic);
        } else {
          candidates = bGroup[diffKey] || bGroup.media;
        }
      } else {
        const bGroup = baseMap[topic] || baseMap.algebra;
        const lGroup = licMap[topic] || {};
        const merged = [...(bGroup[diffKey] || bGroup.media)];
        (lGroup[diffKey] || []).forEach((fn) => {
          if (!merged.includes(fn)) merged.push(fn);
        });
        candidates = merged;
      }

      if (styleFilter === 'word') {
        const onlyWord = candidates.filter((fn) => this.WORD_PROBLEM_METHODS.has(fn.name));
        if (onlyWord.length) return onlyWord;
        const bGroup = baseMap[topic] || {};
        const lGroup = licMap[topic] || {};
        const fallback = []
          .concat(
            bGroup.sencilla || [], bGroup.media || [], bGroup.alta || [],
            lGroup.sencilla || [], lGroup.media || [], lGroup.alta || []
          )
          .filter((fn) => this.WORD_PROBLEM_METHODS.has(fn.name));
        return fallback.length ? [...new Set(fallback)] : candidates;
      }

      if (styleFilter === 'direct') {
        const onlyDirect = candidates.filter((fn) => !this.WORD_PROBLEM_METHODS.has(fn.name));
        return onlyDirect.length ? onlyDirect : candidates;
      }

      return candidates;
    },

    audit(samples = 400) {
      const report = {};
      TOPICS.forEach((t) => {
        const all = new Set();
        const row = { sencilla: 0, media: 0, alta: 0, total: 0, errores: 0 };
        ['sencilla', 'media', 'alta'].forEach((diff) => {
          const set = new Set();
          for (let i = 0; i < samples; i++) {
            const q = this.generate(t.id, 'all', diff);
            set.add(String(q.question).replace(/\s+/g, ' ').trim());
            const blob = String(q.question) + (q.options || []).join('') + String(q.explanation);
            if (!Array.isArray(q.options) || q.options.length !== 4 || new Set(q.options).size !== 4 || /NaN|undefined|Infinity/.test(blob)) {
              row.errores++;
            }
          }
          row[diff] = set.size;
          set.forEach((s) => all.add(s));
        });
        row.total = all.size;
        report[t.name] = row;
      });
      return report;
    },

  ariFraccionesSuma() {
    const dens = [2, 3, 4, 5, 6, 8, 9, 10, 12];
    const b = this.randChoice(dens);
    let d = this.randChoice(dens);
    if (b === d) d = b + 2;
    const f = this.randChoice([2, 3, 4, 5, 6]);
    const a = this.randInt(1, b - 1);
    const c = this.randInt(1, d - 1);
    const e = this.randInt(1, f - 1);

    const common = this.lcm(this.lcm(b, d), f);
    const n1 = a * (common / b);
    const n2 = c * (common / d);
    const n3 = e * (common / f);
    const totalNum = n1 + n2 - n3;

    const correct = this.formatFrac(totalNum, common);
    const d1 = this.formatFrac(n1 + n2 + n3, common);
    const d2 = this.formatFrac(totalNum + 2, common);
    const d3 = this.formatFrac(a + c - e, b + d - f || 5);

    return {
      calculator: "none",
      question: `Calcula el resultado de simplificar la siguiente operación con fracciones:\n$$\\frac{${a}}{${b}} + \\frac{${c}}{${d}} - \\frac{${e}}{${f}}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => this.formatFrac(totalNum + k, common)),
      explanation: `El mínimo común múltiplo de los denominadores $${b}$, $${d}$ y $${f}$ es $\\text{mcm}(${b}, ${d}, ${f}) = ${common}$. Convirtiendo a denominador común: $$\\frac{${a}}{${b}} + \\frac{${c}}{${d}} - \\frac{${e}}{${f}} = \\frac{${n1} + ${n2} - ${n3}}{${common}} = \\frac{${totalNum}}{${common}} = ${correct}$$`
    };
  },

  ariPotenciasLeyes() {
    const base = this.randChoice([2, 3, 4, 5]);
    const m = this.randInt(4, 8);
    const n = this.randInt(2, 5);
    const expSub = base === 2 ? this.randInt(1, 5) : this.randInt(1, 3);
    const p = m + n - expSub;
    const val = Math.pow(base, expSub);

    const correct = `${val}`;
    const d1 = `${Math.pow(base, expSub + 1)}`;
    const d2 = `${Math.pow(base, Math.max(1, expSub - 1))}`;
    const d3 = `${base * expSub}`;

    return {
      calculator: "none",
      question: `Simplifica y calcula el valor numérico aplicando leyes de los exponentes:\n$$\\frac{${base}^{${m}} \\cdot ${base}^{${n}}}{${base}^{${p}}}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `${val + k * base}`),
      explanation: `Aplicando las leyes de los exponentes $\\frac{a^m \\cdot a^n}{a^p} = a^{m + n - p}$: $$\\frac{${base}^{${m}} \\cdot ${base}^{${n}}}{${base}^{${p}}} = ${base}^{${m} + ${n} - ${p}} = ${base}^{${expSub}} = ${val}$$`
    };
  },

  ariPorcentajeDirecto() {
    const pct = this.randChoice([12, 15, 18, 20, 24, 25, 30, 35, 40, 45]);
    const base = this.randInt(3, 18) * 20;
    const ans = (pct * base) / 100;

    return {
      calculator: "basic",
      question: `Calcula el $${pct}\\%$ de la cantidad $${base}$:`,
      options: this.buildUniqueOptions(`${ans}`, [`${ans + 12}`, `${Math.round(base - ans)}`, `${ans * 2}`], (k) => `${ans + k * 5}`),
      explanation: `Para obtener el $${pct}\\%$ de $${base}$, multiplicamos por la fracción decimal equivalente $\\frac{${pct}}{100}$: $$${base} \\times \\frac{${pct}}{100} = \\frac{${base * pct}}{100} = ${ans}$$`
    };
  },

  ariDescuentoImpuesto() {
    const price = this.randInt(6, 25) * 100;
    const desc = this.randChoice([10, 15, 20, 25, 30]);
    const iva = this.randChoice([10, 15, 16, 20]);
    const discounted = price * (1 - desc / 100);
    const finalPrice = (discounted * (1 + iva / 100)).toFixed(2);

    const wrong1 = (price * (1 + (iva - desc) / 100)).toFixed(2);
    const wrong2 = discounted.toFixed(2);
    const wrong3 = (discounted * (1 + (iva + 5) / 100)).toFixed(2);

    return {
      calculator: "basic",
      question: `Un artículo tiene un precio de lista de $${price}\\text{ MXN}$. Si se le aplica un descuento del $${desc}\\%$ y posteriormente un impuesto del $${iva}\\%$ sobre el precio con descuento, ¿cuál es el precio final a pagar?`,
      options: this.buildUniqueOptions(
        `${finalPrice}\\text{ MXN}`,
        [`${wrong1}\\text{ MXN}`, `${wrong2}\\text{ MXN}`, `${wrong3}\\text{ MXN}`],
        (k) => `${(parseFloat(finalPrice) + k * 15).toFixed(2)}\\text{ MXN}`
      ),
      explanation: `Calculamos primero el precio con el $${desc}\\%$ de descuento: $$P_{\\text{desc}} = ${price} \\times (1 - 0.${desc}) = ${discounted.toFixed(2)}$$ Ahora aplicamos el $${iva}\\%$ de impuesto: $$P_{\\text{final}} = ${discounted.toFixed(2)} \\times 1.${iva} = ${finalPrice}\\text{ MXN}$$`
    };
  },

  ariMcdCuerdas() {
    const g = this.randChoice([6, 8, 12, 14, 15, 16, 18, 20, 24, 25, 30]);
    const pairs = [[3, 4], [3, 5], [4, 5], [4, 7], [5, 6], [5, 7], [5, 8], [6, 7], [7, 9]];
    const [k1, k2] = this.randChoice(pairs);
    const L1 = g * k1;
    const L2 = g * k2;

    return {
      calculator: "none",
      question: `Se desean cortar dos listones de longitudes $${L1}\\text{ m}$ y $${L2}\\text{ m}$ en trozos de igual longitud, siendo esta la mayor posible sin desperdiciar material. ¿Cuál debe ser la longitud de cada trozo?`,
      options: this.buildUniqueOptions(`${g}\\text{ m}`, [`${g / 2}\\text{ m}`, `${g * 2}\\text{ m}`, `${k1 * k2}\\text{ m}`], (k) => `${g + k * 3}\\text{ m}`),
      explanation: `El problema requiere calcular el Máximo Común Divisor de $${L1}$ y $${L2}$. Como $${L1} = ${g} \\times ${k1}$ y $${L2} = ${g} \\times ${k2}$ con $\\text{mcd}(${k1}, ${k2}) = 1$: $$\\text{MCD}(${L1}, ${L2}) = ${g}\\text{ m}$$`
    };
  },

  ariFraccionProductoDiv() {
    const a = this.randInt(2, 7);
    const b = this.randInt(3, 9);
    const c = this.randInt(2, 8);
    const d = this.randInt(3, 9);
    const e = this.randInt(2, 7);
    const f = this.randInt(3, 8);

    const num = a * c * f;
    const den = b * d * e;
    const correct = this.formatFrac(num, den);
    const d1 = this.formatFrac(a * c * e, b * d * f);
    const d2 = this.formatFrac(num + den, den);
    const d3 = this.formatFrac(den, num);

    return {
      calculator: "none",
      question: `Realiza la siguiente operación combinada de producto y división de fracciones y simplifica al máximo:\n$$\\left(\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}}\\right) \\div \\frac{${e}}{${f}}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => this.formatFrac(num + k, den)),
      explanation: `Multiplicamos las dos primeras fracciones y luego multiplicamos por el recíproco del divisor: $$\\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} \\times \\frac{${f}}{${e}} = \\frac{${a * c} \\cdot ${f}}{${b * d} \\cdot ${e}} = \\frac{${num}}{${den}} = ${correct}$$`
    };
  },

  ariMcmCampanas() {
    const sets = [
      [12, 15, 20],
      [15, 20, 30],
      [18, 24, 36],
      [12, 18, 24],
      [20, 24, 30],
      [16, 24, 48],
      [10, 15, 25],
      [14, 21, 42]
    ];
    const [t1, t2, t3] = this.randChoice(sets);
    const m = this.lcm(this.lcm(t1, t2), t3);

    return {
      calculator: "basic",
      question: `Tres rutas de transporte coinciden en una estación cada $${t1}$, $${t2}$ y $${t3}$ minutos respectivamente. Si acaban de salir simultáneamente, ¿dentro de cuántos minutos volverán a coincidir las tres rutas por primera vez?`,
      options: this.buildUniqueOptions(
        `${m}\\text{ min}`,
        [`${m / 2}\\text{ min}`, `${m * 2}\\text{ min}`, `${t1 + t2 + t3}\\text{ min}`],
        (k) => `${m + k * 15}\\text{ min}`
      ),
      explanation: `Calculamos el Mínimo Común Múltiplo de los tres periodos de tiempo: $$\\text{MCM}(${t1}, ${t2}, ${t3}) = ${m}\\text{ minutos}$$ Por lo tanto, volverán a coincidir dentro de $${m}\\text{ min}$.`
    };
  },

  ariFraccionCompleja() {
    const a = this.randInt(1, 4);
    const b = this.randInt(2, 5);
    const c = this.randInt(2, 5);
    const d = this.randInt(2, 5);

    const numTop = a * b + 1;
    const denTop = b;
    const numBot = c * d - 1;
    const denBot = d;

    const finalNum = numTop * denBot;
    const finalDen = denTop * numBot;
    const correct = this.formatFrac(finalNum, finalDen);

    return {
      calculator: "none",
      question: `Calcula el valor simplificado de la fracción compleja:\n$$\\frac{${a} + \\frac{1}{${b}}}{${c} - \\frac{1}{${d}}}$$`,
      options: this.buildUniqueOptions(
        correct,
        [this.formatFrac(finalDen, finalNum), this.formatFrac(numTop * numBot, denTop * denBot), this.formatFrac(finalNum + 2, finalDen)],
        (k) => this.formatFrac(finalNum + k, finalDen)
      ),
      explanation: `Simplificamos numerador y denominador por separado: $$${a} + \\frac{1}{${b}} = \\frac{${numTop}}{${b}}, \\qquad ${c} - \\frac{1}{${d}} = \\frac{${numBot}}{${d}}$$ Aplicando la ley del sándwich (extremos entre medios): $$\\frac{\\frac{${numTop}}{${b}}}{\\frac{${numBot}}{${d}}} = \\frac{${numTop} \\cdot ${d}}{${b} \\cdot ${numBot}} = \\frac{${finalNum}}{${finalDen}} = ${correct}$$`
    };
  },

  ariProporcionObreros() {
    const w1 = this.randInt(3, 8);
    const k = this.randInt(2, 4);
    const w2 = w1 * k;
    const d2 = this.randInt(3, 9);
    const d1 = d2 * k;

    return {
      calculator: "basic",
      question: `En una obra de ingeniería, $${w1}$ trabajadores tardan $${d1}$ días en construir un muro trabajando al mismo ritmo. ¿Cuántos días tardarán $${w2}$ trabajadores en realizar exactamente el mismo trabajo?`,
      options: this.buildUniqueOptions(
        `${d2}\\text{ días}`,
        [`${d1 * k}\\text{ días}`, `${d2 + 3}\\text{ días}`, `${Math.max(1, d2 - 2)}\\text{ días}`],
        (step) => `${d2 + step}\\text{ días}`
      ),
      explanation: `Es una relación de proporcionalidad inversa (a mayor número de trabajadores, menor tiempo requerido): $$w_1 \\cdot d_1 = w_2 \\cdot d_2 \\Rightarrow d_2 = \\frac{${w1} \\times ${d1}}{${w2}} = \\frac{${w1 * d1}}{${w2}} = ${d2}\\text{ días}$$`
    };
  },

  /* ==================== 2. ÁLGEBRA ==================== */
  algEcuacionLineal() {
    const xSol = this.randNonZero(-9, 12);
    const k = this.randInt(2, 5);
    const a = this.randInt(2, 4);
    const b = this.randNonZero(-8, 8);
    const c = this.randInt(1, k * a - 1);
    const leftVal = k * (a * xSol + b);
    const d = leftVal - c * xSol;

    return {
      calculator: "none",
      question: `Encuentra el valor de $x$ que satisface la ecuación lineal:\n$$${k}(${a}x ${this.signTerm(b)}) = ${c}x ${this.signTerm(d)}$$`,
      options: this.buildUniqueOptions(
        `x = ${xSol}`,
        [`x = ${-xSol}`, `x = ${xSol + 2}`, `x = ${xSol - 3}`],
        (step) => `x = ${xSol + step + 2}`
      ),
      explanation: `Desarrollamos el paréntesis en el miembro izquierdo: $$${k * a}x ${this.signTerm(k * b)} = ${c}x ${this.signTerm(d)}$$ Agrupamos términos con $x$ de un lado y constantes del otro: $$${k * a - c}x = ${d - k * b} \\Rightarrow x = \\frac{${d - k * b}}{${k * a - c}} = ${xSol}$$`
    };
  },

  algBinomioCuadrado() {
    const a = this.randInt(2, 7);
    const b = this.randInt(2, 8);
    const isMinus = this.randChoice([true, false]);
    const op = isMinus ? "-" : "+";
    const opp = isMinus ? "+" : "-";

    const a2 = a * a;
    const twoAb = 2 * a * b;
    const b2 = b * b;

    const correct = `${a2}x^2 ${op} ${twoAb}xy + ${b2}y^2`;
    const d1 = `${a2}x^2 ${opp} ${twoAb}xy + ${b2}y^2`;
    const d2 = `${a2}x^2 - ${b2}y^2`;
    const d3 = `${a2}x^2 ${op} ${a * b}xy + ${b2}y^2`;

    return {
      calculator: "none",
      question: `Desarrolla el siguiente producto notable (binomio al cuadrado):\n$$(${a}x ${op} ${b}y)^2$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `${a2}x^2 ${op} ${twoAb + k}xy + ${b2}y^2`),
      explanation: `Aplicando la identidad del binomio al cuadrado $(u ${op} v)^2 = u^2 ${op} 2uv + v^2$: $$(${a}x ${op} ${b}y)^2 = (${a}x)^2 ${op} 2(${a}x)(${b}y) + (${b}y)^2 = ${correct}$$`
    };
  },

  algBinomiosConjugados() {
    const a = this.randInt(2, 9);
    const b = this.randInt(2, 11);
    const exp = this.randChoice([1, 2, 3]);
    const xPart = exp === 1 ? "x" : `x^${exp}`;
    const xSq = `x^${exp * 2}`;

    const correct = `${a * a}${xSq} - ${b * b}`;
    const d1 = `${a * a}${xSq} + ${b * b}`;
    const d2 = `${a * a}${xSq} - ${2 * a * b}${xPart} + ${b * b}`;
    const d3 = `${2 * a}${xSq} - ${2 * b}`;

    return {
      calculator: "none",
      question: `Efectúa el producto de los siguientes binomios conjugados:\n$$(${a}${xPart} + ${b})(${a}${xPart} - ${b})$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `${a * a}${xSq} - ${b * b + k}`),
      explanation: `El producto de dos binomios conjugados $(u + v)(u - v)$ es igual a la diferencia de cuadrados $u^2 - v^2$: $$(${a}${xPart})^2 - (${b})^2 = ${correct}$$`
    };
  },

  algFactorizacionTrinomio() {
    let r1 = this.randNonZero(-9, 9);
    let r2 = this.randNonZero(-9, 9);
    if (r1 === r2) r2 += 2;
    if (r1 + r2 === 0) r2 += 1;

    const B = r1 + r2;
    const C = r1 * r2;

    const f1 = `(x ${this.signTerm(r1)})(x ${this.signTerm(r2)})`;
    const d1 = `(x ${this.signTerm(-r1)})(x ${this.signTerm(-r2)})`;
    const d2 = `(x ${this.signTerm(r1)})(x ${this.signTerm(-r2)})`;
    const d3 = `(x ${this.signTerm(C)})(x ${this.signTerm(B)})`;

    return {
      calculator: "none",
      question: `Factoriza completamente el trinomio cuadrático:\n$$x^2 ${this.signTerm(B, "x")} ${this.signTerm(C)}$$`,
      options: this.buildUniqueOptions(f1, [d1, d2, d3], (k) => `(x ${this.signTerm(r1 + k)})(x ${this.signTerm(r2 - k)})`),
      explanation: `Buscamos dos números enteros que sumados den $${B}$ y multiplicados den $${C}$. Dichos números son $${r1}$ y $${r2}$ porque $(${r1}) + (${r2}) = ${B}$ y $(${r1})(${r2}) = ${C}$. Por tanto: $$x^2 ${this.signTerm(B, "x")} ${this.signTerm(C)} = ${f1}$$`
    };
  },

  algEcuacionCuadratica() {
    const r1 = this.randInt(1, 9);
    const r2 = this.randInt(-9, -1);
    if (r1 + r2 === 0) return this.algEcuacionCuadratica();

    const B = -(r1 + r2);
    const C = r1 * r2;

    const correct = `x_1 = ${r1}, \\quad x_2 = ${r2}`;
    const d1 = `x_1 = ${-r1}, \\quad x_2 = ${-r2}`;
    const d2 = `x_1 = ${r1}, \\quad x_2 = ${-r2}`;
    const d3 = `x_1 = ${r1 + 1}, \\quad x_2 = ${r2 - 1}`;

    return {
      calculator: "none",
      question: `Determina las raíces reales de la ecuación cuadrática:\n$$x^2 ${this.signTerm(B, "x")} ${this.signTerm(C)} = 0$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `x_1 = ${r1 + k}, \\quad x_2 = ${r2}`),
      explanation: `Factorizando el trinomio como producto de factores lineales: $$(x - ${r1})(x + ${Math.abs(r2)}) = 0$$ Igualando cada factor a cero obtenemos las raíces: $$x_1 = ${r1}, \\qquad x_2 = ${r2}$$`
    };
  },

  algFactorizacionAc() {
    const p = this.randChoice([2, 3, 5]);
    const r = this.randChoice([2, 3, 4]);
    const q = this.randNonZero(-5, 5);
    let s = this.randNonZero(-5, 5);
    if (this.gcd(p, q) !== 1 || this.gcd(r, s) !== 1) s = 1;

    const A = p * r;
    const B = p * s + q * r;
    const C = q * s;
    if (B === 0) return this.algFactorizacionAc();

    const correct = `(${p}x ${this.signTerm(q)})(${r}x ${this.signTerm(s)})`;
    const d1 = `(${p}x ${this.signTerm(-q)})(${r}x ${this.signTerm(-s)})`;
    const d2 = `(${p}x ${this.signTerm(s)})(${r}x ${this.signTerm(q)})`;
    const d3 = `(${A}x ${this.signTerm(q)})(x ${this.signTerm(s)})`;

    return {
      calculator: "none",
      question: `¿Cuál es la factorización completa del polinomio de segundo grado?\n$$${A}x^2 ${this.signTerm(B, "x")} ${this.signTerm(C)}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `(${p}x ${this.signTerm(q + k)})(${r}x ${this.signTerm(s)})`),
      explanation: `Descomponiendo el término central $${B}x = ${p * s}x ${this.signTerm(q * r, "x")}$ y factorizando por agrupación: $$${A}x^2 ${this.signTerm(B, "x")} ${this.signTerm(C)} = ${correct}$$`
    };
  },

  algSistema2x2() {
    const x = this.randNonZero(-5, 6);
    const y = this.randNonZero(-5, 6);
    const a1 = this.randInt(2, 6);
    const b1 = this.randInt(1, 5);
    const a2 = this.randInt(1, 5);
    const b2 = -this.randInt(2, 6);

    const c1 = a1 * x + b1 * y;
    const c2 = a2 * x + b2 * y;

    const correct = `x = ${x}, \\quad y = ${y}`;
    const d1 = `x = ${y}, \\quad y = ${x}`;
    const d2 = `x = ${-x}, \\quad y = ${-y}`;
    const d3 = `x = ${x + 1}, \\quad y = ${y - 1}`;

    return {
      calculator: "basic",
      question: `Resuelve el siguiente sistema de ecuaciones lineales $2 \\times 2$:\n$$\\begin{cases} ${a1}x ${this.signTerm(b1, "y")} = ${c1} \\\\ ${a2}x ${this.signTerm(b2, "y")} = ${c2} \\end{cases}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `x = ${x + k}, \\quad y = ${y}`),
      explanation: `Aplicando el método de reducción (eliminación): multiplicamos la primera ecuación por $${Math.abs(b2)}$ y la segunda por $${b1}$ para cancelar $y$: $$${a1 * Math.abs(b2) + a2 * b1}x = ${c1 * Math.abs(b2) + c2 * b1} \\Rightarrow x = ${x}$$ Sustituyendo $x = ${x}$ en la primera ecuación: $$${a1}(${x}) ${this.signTerm(b1, "y")} = ${c1} \\Rightarrow y = ${y}$$`
    };
  },

  algEcuacionRacional() {
    const xSol = this.randInt(2, 9);
    const a = this.randInt(1, 5);
    const k = this.randInt(2, 4);
    // (k*x + b) / (x + a) = c
    const c = this.randInt(k + 1, k + 3);
    const b = c * (xSol + a) - k * xSol;

    return {
      calculator: "none",
      question: `Resuelve la ecuación racional para $x \\neq ${-a}$:\n$$\\frac{${k}x ${this.signTerm(b)}}{x + ${a}} = ${c}$$`,
      options: this.buildUniqueOptions(
        `x = ${xSol}`,
        [`x = ${-xSol}`, `x = ${xSol + 3}`, `x = ${xSol - 2}`],
        (step) => `x = ${xSol + step + 3}`
      ),
      explanation: `Multiplicamos ambos lados por el denominador $(x + ${a})$: $$${k}x ${this.signTerm(b)} = ${c}(x + ${a}) = ${c}x + ${c * a}$$ Despejando $x$: $$${b - c * a} = ${c - k}x \\Rightarrow x = \\frac{${b - c * a}}{${c - k}} = ${xSol}$$`
    };
  },

  algSumaRaicesVieta() {
    const a = this.randInt(2, 5);
    const b = this.randNonZero(-15, 15);
    const c = this.randNonZero(-12, 12);

    const sumLatex = this.formatFrac(-b, a);
    const prodLatex = this.formatFrac(c, a);

    const correct = `x_1 + x_2 = ${sumLatex}, \\quad x_1 \\cdot x_2 = ${prodLatex}`;
    const d1 = `x_1 + x_2 = ${this.formatFrac(b, a)}, \\quad x_1 \\cdot x_2 = ${prodLatex}`;
    const d2 = `x_1 + x_2 = ${prodLatex}, \\quad x_1 \\cdot x_2 = ${sumLatex}`;
    const d3 = `x_1 + x_2 = ${this.formatFrac(-b, 1)}, \\quad x_1 \\cdot x_2 = ${this.formatFrac(c, 1)}`;

    return {
      calculator: "none",
      question: `Por las relaciones de Vieta, determina la suma $x_1 + x_2$ y el producto $x_1 \\cdot x_2$ de las raíces de la ecuación:\n$$${a}x^2 ${this.signTerm(b, "x")} ${this.signTerm(c)} = 0$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `x_1 + x_2 = ${this.formatFrac(-b + k, a)}, \\quad x_1 \\cdot x_2 = ${prodLatex}`),
      explanation: `En toda ecuación cuadrática $ax^2 + bx + c = 0$, las fórmulas de Vieta establecen que: $$x_1 + x_2 = -\\frac{b}{a} = ${sumLatex}, \\qquad x_1 \\cdot x_2 = \\frac{c}{a} = ${prodLatex}$$`
    };
  },

  /* ==================== 3. GEOMETRÍA EUCLIDIANA ==================== */
  geoPitagoras() {
    const baseTriples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41]];
    const [a0, b0, c0] = this.randChoice(baseTriples);
    const k = this.randInt(1, 5);
    const a = a0 * k;
    const b = b0 * k;
    const c = c0 * k;
    const askHyp = this.randChoice([true, false]);

    if (askHyp) {
      return {
        calculator: "basic",
        question: `En un triángulo rectángulo, los catetos miden $a = ${a}\\text{ cm}$ y $b = ${b}\\text{ cm}$. ¿Cuál es la longitud de la hipotenusa $c$?`,
        options: this.buildUniqueOptions(
          `${c}\\text{ cm}`,
          [`${a + b}\\text{ cm}`, `${c + 2}\\text{ cm}`, `\\sqrt{${a + b}}\\text{ cm}`],
          (step) => `${c + step * 3}\\text{ cm}`
        ),
        explanation: `Aplicando el Teorema de Pitágoras $c = \\sqrt{a^2 + b^2}$: $$c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c * c}} = ${c}\\text{ cm}$$`
      };
    } else {
      return {
        calculator: "basic",
        question: `En un triángulo rectángulo, la hipotenusa mide $c = ${c}\\text{ cm}$ y uno de sus catetos mide $a = ${a}\\text{ cm}$. ¿Cuál es la longitud del otro cateto $b$?`,
        options: this.buildUniqueOptions(
          `${b}\\text{ cm}`,
          [`${c - a}\\text{ cm}`, `${b + 3}\\text{ cm}`, `${a + 2}\\text{ cm}`],
          (step) => `${b + step * 2}\\text{ cm}`
        ),
        explanation: `Despejando el cateto del Teorema de Pitágoras $b = \\sqrt{c^2 - a^2}$: $$b = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${c * c} - ${a * a}} = \\sqrt{${b * b}} = ${b}\\text{ cm}$$`
      };
    }
  },

  geoAngulosSuplementarios() {
    const k1 = this.randInt(2, 7);
    const k2 = this.randInt(2, 6);
    const x = this.randInt(8, 18);
    const total = 180;
    const c = total - (k1 + k2) * x;
    const angA = k1 * x + c;
    const angB = k2 * x;

    return {
      calculator: "none",
      question: `Dos ángulos suplementarios miden $\\alpha = (${k1}x ${this.signTerm(c)})^\\circ$ y $\\beta = (${k2}x)^\\circ$. Determina el valor de $x$ y la medida del ángulo $\\beta$:`,
      options: this.buildUniqueOptions(
        `x = ${x}^\\circ, \\quad \\beta = ${angB}^\\circ`,
        [`x = ${x}^\\circ, \\quad \\beta = ${angA}^\\circ`, `x = ${x + 4}^\\circ, \\quad \\beta = ${k2 * (x + 4)}^\\circ`, `x = ${Math.max(2, x - 3)}^\\circ, \\quad \\beta = ${k2 * Math.max(2, x - 3)}^\\circ`],
        (s) => `x = ${x + s}^\\circ, \\quad \\beta = ${angB + s * 2}^\\circ`
      ),
      explanation: `Dos ángulos suplementarios suman $180^\\circ$: $$(${k1}x ${this.signTerm(c)}) + ${k2}x = 180 \\Rightarrow ${k1 + k2}x = ${180 - c} \\Rightarrow x = ${x}^\\circ$$ Por lo tanto, $\\beta = ${k2}(${x}^\\circ) = ${angB}^\\circ$.`
    };
  },

  geoAreaTriangulo() {
    const base = this.randInt(6, 24);
    const height = this.randInt(4, 18);
    const area = (base * height) / 2;

    return {
      calculator: "basic",
      question: `Calcula el área de un triángulo cuya base mide $b = ${base}\\text{ cm}$ y su altura correspondiente es $h = ${height}\\text{ cm}$:`,
      options: this.buildUniqueOptions(
        `${area}\\text{ cm}^2`,
        [`${base * height}\\text{ cm}^2`, `${area + base}\\text{ cm}^2`, `${2 * (base + height)}\\text{ cm}^2`],
        (k) => `${area + k * 4}\\text{ cm}^2`
      ),
      explanation: `Aplicando la fórmula del área del triángulo $A = \\frac{b \\cdot h}{2}$: $$A = \\frac{${base} \\times ${height}}{2} = \\frac{${base * height}}{2} = ${area}\\text{ cm}^2$$`
    };
  },

  geoPoligonoAngulos() {
    const n = this.randInt(5, 18);
    const sum = 180 * (n - 2);
    const interior = sum / n;
    const askSum = n % 2 !== 0 || this.randChoice([true, false]);

    if (askSum || sum % n !== 0) {
      return {
        calculator: "basic",
        question: `¿Cuál es la suma de los ángulos interiores de un polígono convexo de $n = ${n}$ lados?`,
        options: this.buildUniqueOptions(
          `${sum}^\\circ`,
          [`${180 * n}^\\circ`, `${180 * (n - 1)}^\\circ`, `${180 * (n - 3)}^\\circ`],
          (k) => `${sum + k * 90}^\\circ`
        ),
        explanation: `La suma de los ángulos interiores de un polígono de $n$ lados es $S = 180^\\circ(n - 2)$: $$S = 180^\\circ(${n} - 2) = 180^\\circ(${n - 2}) = ${sum}^\\circ$$`
      };
    } else {
      return {
        calculator: "basic",
        question: `¿Cuánto mide cada ángulo interior de un polígono regular de $n = ${n}$ lados?`,
        options: this.buildUniqueOptions(
          `${interior}^\\circ`,
          [`${360 / n}^\\circ`, `${interior + 15}^\\circ`, `${180 - interior}^\\circ`],
          (k) => `${interior + k * 5}^\\circ`
        ),
        explanation: `El ángulo interior de un polígono regular de $n$ lados se calcula mediante $\\alpha = \\frac{180^\\circ(n - 2)}{n}$: $$\\alpha = \\frac{180^\\circ(${n} - 2)}{${n}} = \\frac{${sum}^\\circ}{${n}} = ${interior}^\\circ$$`
      };
    }
  },

  geoVolumenCilindro() {
    const r = this.randInt(2, 11);
    const h = this.randInt(5, 20);
    const vol = r * r * h;

    return {
      calculator: "basic",
      question: `Un cilindro circular recto tiene radio basal $r = ${r}\\text{ cm}$ y altura $h = ${h}\\text{ cm}$. ¿Cuál es su volumen exacto en términos de $\\pi$?`,
      options: this.buildUniqueOptions(
        `${vol}\\pi\\text{ cm}^3`,
        [`${2 * r * h}\\pi\\text{ cm}^3`, `${r * h}\\pi\\text{ cm}^3`, `${vol * 2}\\pi\\text{ cm}^3`],
        (k) => `${vol + k * 10}\\pi\\text{ cm}^3`
      ),
      explanation: `El volumen de un cilindro circular recto es $V = \\pi r^2 h$: $$V = \\pi (${r})^2 (${h}) = \\pi (${r * r})(${h}) = ${vol}\\pi\\text{ cm}^3$$`
    };
  },

  geoSemejanzaTales() {
    const hPoste = this.randInt(2, 6);
    const sPoste = this.randInt(3, 8);
    const k = this.randInt(3, 9);
    const sEdificio = sPoste * k;
    const hEdificio = hPoste * k;

    return {
      calculator: "basic",
      question: `Por semejanza de triángulos (Teorema de Tales), un edificio proyecta una sombra de $${sEdificio}\\text{ m}$ a la misma hora en que un poste vertical de $${hPoste}\\text{ m}$ de altura proyecta una sombra de $${sPoste}\\text{ m}$. ¿Cuál es la altura del edificio?`,
      options: this.buildUniqueOptions(
        `${hEdificio}\\text{ m}`,
        [`${hEdificio + hPoste}\\text{ m}`, `${sEdificio - sPoste}\\text{ m}`, `${hEdificio - 3}\\text{ m}`],
        (step) => `${hEdificio + step * 2}\\text{ m}`
      ),
      explanation: `Establecemos la razón de semejanza entre alturas y sombras: $$\\frac{H}{${sEdificio}} = \\frac{${hPoste}}{${sPoste}} \\Rightarrow H = \\frac{${sEdificio} \\times ${hPoste}}{${sPoste}} = ${k} \\times ${hPoste} = ${hEdificio}\\text{ m}$$`
    };
  },

  geoAreaTrapecioIsosceles() {
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]];
    const [p, h, l] = this.randChoice(triples);
    const b = this.randInt(6, 20);
    const B = b + 2 * p;
    const area = ((B + b) * h) / 2;

    return {
      calculator: "intermediate",
      question: `Un trapecio isósceles tiene base mayor $B = ${B}\\text{ cm}$, base menor $b = ${b}\\text{ cm}$ y lados oblicuos de longitud $l = ${l}\\text{ cm}$. ¿Cuál es el área del trapecio?`,
      options: this.buildUniqueOptions(
        `${area}\\text{ cm}^2`,
        [`${((B + b) * l) / 2}\\text{ cm}^2`, `${B * h}\\text{ cm}^2`, `${area - h}\\text{ cm}^2`],
        (k) => `${area + k * 10}\\text{ cm}^2`
      ),
      explanation: `La proyección horizontal de cada lado no paralelo es $p = \\frac{B - b}{2} = \\frac{${B} - ${b}}{2} = ${p}\\text{ cm}$. Por Pitágoras, la altura $h$ mide: $$h = \\sqrt{${l}^2 - ${p}^2} = \\sqrt{${l * l} - ${p * p}} = \\sqrt{${h * h}} = ${h}\\text{ cm}$$ El área es: $$A = \\frac{(B + b) \\cdot h}{2} = \\frac{(${B} + ${b}) \\cdot ${h}}{2} = ${area}\\text{ cm}^2$$`
    };
  },

  geoVolumenConoPitagoras() {
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]];
    const [r, h, g] = this.randChoice(triples);
    const vol = (r * r * h) / 3;
    const volLatex = Number.isInteger(vol) ? `${vol}\\pi` : `\\frac{${r * r * h}\\pi}{3}`;

    return {
      calculator: "intermediate",
      question: `Un cono circular recto tiene radio basal $r = ${r}\\text{ cm}$ y generatriz $g = ${g}\\text{ cm}$. Determina su volumen exacto:`,
      options: this.buildUniqueOptions(
        `${volLatex}\\text{ cm}^3`,
        [`${r * r * h}\\pi\\text{ cm}^3`, `${this.formatFrac(r * r * g, 3)}\\pi\\text{ cm}^3`, `${r * h}\\pi\\text{ cm}^3`],
        (k) => `${r * r * h + k}\\pi\\text{ cm}^3`
      ),
      explanation: `Primero calculamos la altura $h$ del cono usando Pitágoras $h = \\sqrt{g^2 - r^2}$: $$h = \\sqrt{${g}^2 - ${r}^2} = \\sqrt{${g * g} - ${r * r}} = ${h}\\text{ cm}$$ El volumen del cono es: $$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi (${r})^2(${h}) = ${volLatex}\\text{ cm}^3$$`
    };
  },

  geoDiagonalInscritaCirculo() {
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]];
    const [w, h, diag] = this.randChoice(triples);
    const r = diag % 2 === 0 ? `${diag / 2}` : `\\frac{${diag}}{2}`;

    return {
      calculator: "basic",
      question: `Un rectángulo de lados $a = ${w}\\text{ cm}$ y $b = ${h}\\text{ cm}$ está inscrito en una circunferencia. ¿Cuál es la longitud del radio $R$ de dicha circunferencia?`,
      options: this.buildUniqueOptions(
        `R = ${r}\\text{ cm}`,
        [`R = ${diag}\\text{ cm}`, `R = ${w + h}\\text{ cm}`, `R = \\frac{${w + h}}{2}\\text{ cm}`],
        (k) => `R = ${diag + k}\\text{ cm}`
      ),
      explanation: `La diagonal $d$ de un rectángulo inscrito coincide con el diámetro $2R$ de la circunferencia: $$d = \\sqrt{${w}^2 + ${h}^2} = \\sqrt{${w * w} + ${h * h}} = ${diag}\\text{ cm}$$ Por lo tanto, el radio es la mitad de la diagonal: $$R = \\frac{d}{2} = ${r}\\text{ cm}$$`
    };
  },

  /* ==================== 4. TRIGONOMÉTRICA ==================== */
  trigRazonTriangulo() {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41]];
    const [a, b, c] = this.randChoice(triples);
    const k = this.randInt(1, 3);
    const co = a * k;
    const ca = b * k;
    const hip = c * k;
    const fnType = this.randChoice(["sin", "cos", "tan"]);

    let fnLatex = "\\sin(\\theta)";
    let correct = this.formatFrac(co, hip);
    let formulaDesc = `\\frac{\\text{Cateto Opuesto}}{\\text{Hipotenusa}} = \\frac{${co}}{${hip}}`;

    if (fnType === "cos") {
      fnLatex = "\\cos(\\theta)";
      correct = this.formatFrac(ca, hip);
      formulaDesc = `\\frac{\\text{Cateto Adyacente}}{\\text{Hipotenusa}} = \\frac{${ca}}{${hip}}`;
    } else if (fnType === "tan") {
      fnLatex = "\\tan(\\theta)";
      correct = this.formatFrac(co, ca);
      formulaDesc = `\\frac{\\text{Cateto Opuesto}}{\\text{Cateto Adyacente}} = \\frac{${co}}{${ca}}`;
    }

    return {
      calculator: "none",
      question: `En un triángulo rectángulo, el cateto opuesto al ángulo $\\theta$ mide $${co}\\text{ cm}$ y el cateto adyacente mide $${ca}\\text{ cm}$. Determina el valor exacto de $${fnLatex}$:`,
      options: this.buildUniqueOptions(
        correct,
        [this.formatFrac(ca, hip), this.formatFrac(co, hip), this.formatFrac(ca, co), this.formatFrac(hip, co)],
        (s) => this.formatFrac(co + s, hip)
      ),
      explanation: `Por el Teorema de Pitágoras, la hipotenusa mide $h = \\sqrt{${co}^2 + ${ca}^2} = ${hip}\\text{ cm}$. Aplicando la definición trigonométrica: $$${fnLatex} = ${formulaDesc} = ${correct}$$`
    };
  },

  trigAngulosNotables() {
    const a = this.randInt(2, 9);
    const b = this.randInt(2, 9);
    const variant = this.randChoice([1, 2, 3]);

    if (variant === 1) {
      const ans = a + b;
      return {
        calculator: "none",
        question: `Calcula el valor numérico exacto de la expresión:\n$$E = ${2 * a}\\sin(30^\\circ) + ${2 * b}\\cos(60^\\circ)$$`,
        options: this.buildUniqueOptions(`${ans}`, [`${2 * ans}`, `${Math.abs(a - b)}`, `${ans}\\sqrt{3}`], (k) => `${ans + k}`),
        explanation: `Sustituyendo los valores notables $\\sin(30^\\circ) = \\frac{1}{2}$ y $\\cos(60^\\circ) = \\frac{1}{2}$: $$E = ${2 * a}\\left(\\frac{1}{2}\\right) + ${2 * b}\\left(\\frac{1}{2}\\right) = ${a} + ${b} = ${ans}$$`
      };
    } else if (variant === 2) {
      const ans = a + 3 * b;
      return {
        calculator: "none",
        question: `Evalúa exactamente la expresión trigonométrica:\n$$E = ${a}\\tan(45^\\circ) + ${b}\\tan^2(60^\\circ)$$`,
        options: this.buildUniqueOptions(`${ans}`, [`${a + b}`, `${3 * a + b}`, `${a + 2 * b}`], (k) => `${ans + k * 2}`),
        explanation: `Como $\\tan(45^\\circ) = 1$ y $\\tan(60^\\circ) = \\sqrt{3}$: $$E = ${a}(1) + ${b}(\\sqrt{3})^2 = ${a} + ${b}(3) = ${ans}$$`
      };
    } else {
      const ans = a + b;
      return {
        calculator: "none",
        question: `Simplifica el valor exacto de:\n$$E = ${2 * a}\\sin^2(45^\\circ) + ${b}\\cos(0^\\circ)$$`,
        options: this.buildUniqueOptions(`${ans}`, [`${2 * a + b}`, `${a}`, `${2 * (a + b)}`], (k) => `${ans + k}`),
        explanation: `Dado que $\\sin(45^\\circ) = \\frac{\\sqrt{2}}{2} \\Rightarrow \\sin^2(45^\\circ) = \\frac{1}{2}$ y $\\cos(0^\\circ) = 1$: $$E = ${2 * a}\\left(\\frac{1}{2}\\right) + ${b}(1) = ${a} + ${b} = ${ans}$$`
      };
    }
  },

  trigConversionRadianes() {
    const deg = this.randChoice([15, 30, 45, 60, 75, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330]);
    const g = this.gcd(deg, 180);
    const num = deg / g;
    const den = 180 / g;
    const radLatex = den === 1 ? `${num}\\pi` : `\\frac{${num === 1 ? "" : num}\\pi}{${den}}`;

    return {
      calculator: "none",
      question: `Convierte el ángulo de $${deg}^\\circ$ a radianes en su forma exacta simplificada:`,
      options: this.buildUniqueOptions(
        `${radLatex}\\text{ rad}`,
        [`\\frac{${num + 1}\\pi}{${den}}\\text{ rad}`, `\\frac{${den}\\pi}{${num}}\\text{ rad}`, `\\frac{${num}\\pi}{${den * 2}}\\text{ rad}`],
        (k) => `\\frac{${num + k}\\pi}{${den}}\\text{ rad}`
      ),
      explanation: `Multiplicamos los grados por el factor de conversión $\\frac{\\pi}{180^\\circ}$: $$${deg}^\\circ \\times \\frac{\\pi}{180^\\circ} = \\frac{${deg}\\pi}{180} = ${radLatex}\\text{ rad}$$`
    };
  },

  trigIdentidadPitagorica() {
    const k = this.randInt(2, 12);
    const m = this.randInt(1, 9);
    const total = k + m;

    return {
      calculator: "none",
      question: `Simplifica la expresión trigonométrica utilizando identidades pitagóricas:\n$$E = ${k}\\sin^2(x) + ${k}\\cos^2(x) + ${m}$$`,
      options: this.buildUniqueOptions(
        `${total}`,
        [`${k}`, `${k * m}`, `${k}\\tan^2(x) + ${m}`],
        (s) => `${total + s}`
      ),
      explanation: `Factorizando $${k}$ en los dos primeros términos y aplicando la identidad pitagórica $\\sin^2(x) + \\cos^2(x) = 1$: $$E = ${k}(\\sin^2(x) + \\cos^2(x)) + ${m} = ${k}(1) + ${m} = ${total}$$`
    };
  },

  trigAlturaSombraElevacion() {
    const d = this.randInt(4, 25) * 3;
    const angle = this.randChoice([30, 45, 60]);

    let correct = `${d}\\text{ m}`;
    let expStep = `\\tan(45^\\circ) = 1 \\Rightarrow h = ${d}(1) = ${d}\\text{ m}`;
    if (angle === 60) {
      correct = `${d}\\sqrt{3}\\text{ m}`;
      expStep = `\\tan(60^\\circ) = \\sqrt{3} \\Rightarrow h = ${d}\\sqrt{3}\\text{ m}`;
    } else if (angle === 30) {
      correct = `${d / 3}\\sqrt{3}\\text{ m}`;
      expStep = `\\tan(30^\\circ) = \\frac{\\sqrt{3}}{3} \\Rightarrow h = ${d} \\cdot \\frac{\\sqrt{3}}{3} = ${d / 3}\\sqrt{3}\\text{ m}`;
    }

    return {
      calculator: "intermediate",
      question: `Desde un punto en el suelo situado a $${d}\\text{ m}$ de la base de una torre, el ángulo de elevación hacia la cúspide es de $${angle}^\\circ$. ¿Cuál es la altura exacta $h$ de la torre?`,
      options: this.buildUniqueOptions(
        correct,
        [`${d}\\sqrt{2}\\text{ m}`, `${d / 2}\\text{ m}`, `${2 * d}\\text{ m}`, `${d}\\sqrt{3}\\text{ m}`],
        (k) => `${d + k * 3}\\text{ m}`
      ),
      explanation: `Como $\\tan(\\theta) = \\frac{h}{d}$, despejamos $h = d \\cdot \\tan(${angle}^\\circ)$: $$${expStep}$$`
    };
  },

  trigIdentidadSecTan() {
    const k = this.randInt(3, 15);
    return {
      calculator: "none",
      question: `Reduce la siguiente expresión mediante identidades trigonométricas fundamentales:\n$$\\frac{${k}\\sec^2(x) - ${k}\\tan^2(x)}{\\sin^2(x) + \\cos^2(x)}$$`,
      options: this.buildUniqueOptions(
        `${k}`,
        [`1`, `${k}\\sec(x)`, `${k}\\cot^2(x)`],
        (s) => `${k + s}`
      ),
      explanation: `Usamos las identidades $\\sec^2(x) - \\tan^2(x) = 1$ en el numerador y $\\sin^2(x) + \\cos^2(x) = 1$ en el denominador: $$\\frac{${k}(\\sec^2(x) - \\tan^2(x))}{1} = \\frac{${k}(1)}{1} = ${k}$$`
    };
  },

  trigLeyCosenos() {
    const a = this.randInt(4, 12);
    const b = this.randInt(4, 12);
    const c2 = a * a + b * b - a * b; // para C = 60°, cos(60°) = 1/2 -> 2ab*cos(60) = ab
    const rootInt = Math.round(Math.sqrt(c2));
    const cLatex = rootInt * rootInt === c2 ? `${rootInt}\\text{ cm}` : `\\sqrt{${c2}}\\text{ cm}`;

    return {
      calculator: "intermediate",
      question: `En un triángulo oblicuángulo, dos de sus lados miden $a = ${a}\\text{ cm}$ y $b = ${b}\\text{ cm}$, y el ángulo comprendido entre ellos es $C = 60^\\circ$. Aplicando la ley de cosenos, ¿cuál es la longitud del tercer lado $c$?`,
      options: this.buildUniqueOptions(
        cLatex,
        [`\\sqrt{${a * a + b * b}}\\text{ cm}`, `\\sqrt{${a * a + b * b + a * b}}\\text{ cm}`, `${a + b - 2}\\text{ cm}`],
        (k) => `\\sqrt{${c2 + k * 5}}\\text{ cm}`
      ),
      explanation: `Por la Ley de los Cosenos $c^2 = a^2 + b^2 - 2ab\\cos(C)$, con $\\cos(60^\\circ) = \\frac{1}{2}$: $$c^2 = ${a}^2 + ${b}^2 - 2(${a})(${b})\\left(\\frac{1}{2}\\right) = ${a * a} + ${b * b} - ${a * b} = ${c2}$$ Extrayendo raíz cuadrada: $c = ${cLatex}$.`
    };
  },

  trigLeySenos() {
    const a = this.randInt(4, 16) * 2;
    const angleB = this.randChoice([45, 60]);
    const bLatex = angleB === 45 ? `${a}\\sqrt{2}\\text{ cm}` : `${a}\\sqrt{3}\\text{ cm}`;
    const sinBLatex = angleB === 45 ? `\\frac{\\sqrt{2}}{2}` : `\\frac{\\sqrt{3}}{2}`;

    return {
      calculator: "intermediate",
      question: `En un triángulo $ABC$, se conocen los ángulos $A = 30^\\circ$, $B = ${angleB}^\\circ$ y el lado opuesto $a = ${a}\\text{ cm}$. Aplicando la ley de senos, determina la medida exacta del lado $b$:`,
      options: this.buildUniqueOptions(
        bLatex,
        [`${a / 2}\\sqrt{2}\\text{ cm}`, `${a / 2}\\sqrt{3}\\text{ cm}`, `${2 * a}\\text{ cm}`, `${a}\\text{ cm}`],
        (k) => `${a + k}\\sqrt{2}\\text{ cm}`
      ),
      explanation: `Por la Ley de los Senos $\\frac{b}{\\sin(B)} = \\frac{a}{\\sin(A)}$: $$b = \\frac{${a} \\cdot \\sin(${angleB}^\\circ)}{\\sin(30^\\circ)} = \\frac{${a} \\cdot ${sinBLatex}}{\\frac{1}{2}} = ${bLatex}$$`
    };
  },

  trigEcuacionTrigonometrica() {
    const cases = [
      { eq: "2\\sin(x) - 1 = 0", sol: "x = 30^\\circ", step: "\\sin(x) = \\frac{1}{2} \\Rightarrow x = 30^\\circ" },
      { eq: "2\\cos(x) - \\sqrt{3} = 0", sol: "x = 30^\\circ", step: "\\cos(x) = \\frac{\\sqrt{3}}{2} \\Rightarrow x = 30^\\circ" },
      { eq: "2\\cos(x) - 1 = 0", sol: "x = 60^\\circ", step: "\\cos(x) = \\frac{1}{2} \\Rightarrow x = 60^\\circ" },
      { eq: "2\\sin(x) - \\sqrt{3} = 0", sol: "x = 60^\\circ", step: "\\sin(x) = \\frac{\\sqrt{3}}{2} \\Rightarrow x = 60^\\circ" },
      { eq: "\\sqrt{3}\\tan(x) - 3 = 0", sol: "x = 60^\\circ", step: "\\tan(x) = \\sqrt{3} \\Rightarrow x = 60^\\circ" }
    ];
    const item = this.randChoice(cases);
    const k = this.randInt(1, 5);

    return {
      calculator: "none",
      question: `Encuentra la solución en el primer cuadrante ($0^\\circ < x < 90^\\circ$) para la ecuación trigonométrica:\n$$${k}(${item.eq.replace(" = 0", "")}) = 0$$`,
      options: this.buildUniqueOptions(
        item.sol,
        ["x = 45^\\circ", "x = 30^\\circ", "x = 60^\\circ", "x = 15^\\circ", "x = 75^\\circ"],
        (s) => `x = ${15 * s}^\\circ`
      ),
      explanation: `Dividiendo entre $${k}$ y despejando la razón trigonométrica en el primer cuadrante: $$${item.step}$$`
    };
  },

  /* ==================== 5. GEOMETRÍA ANALÍTICA ==================== */
  geoanDistanciaPuntos() {
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
    const [dx, dy, d] = this.randChoice(triples);
    const x1 = this.randInt(-6, 6);
    const y1 = this.randInt(-6, 6);
    const x2 = x1 + dx;
    const y2 = y1 + dy;

    return {
      calculator: "basic",
      question: `Calcula la distancia euclidiana entre los puntos $A(${x1}, ${y1})$ y $B(${x2}, ${y2})$ en el plano cartesiano:`,
      options: this.buildUniqueOptions(
        `${d}`,
        [`${dx + dy}`, `\\sqrt{${dx + dy}}`, `${d + 2}`],
        (k) => `${d + k * 2}`
      ),
      explanation: `Usando la fórmula de distancia entre dos puntos $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$: $$d = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2} = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${d}$$`
    };
  },

  geoanPuntoMedio() {
    const xm = this.randInt(-7, 7);
    const ym = this.randInt(-7, 7);
    const dx = this.randInt(1, 6);
    const dy = this.randInt(1, 6);
    const x1 = xm - dx;
    const x2 = xm + dx;
    const y1 = ym - dy;
    const y2 = ym + dy;

    return {
      calculator: "none",
      question: `Determina las coordenadas del punto medio $M$ del segmento cuyos extremos son $P_1(${x1}, ${y1})$ y $P_2(${x2}, ${y2})$:`,
      options: this.buildUniqueOptions(
        `M(${xm}, ${ym})`,
        [`M(${dx}, ${dy})`, `M(${xm * 2}, ${ym * 2})`, `M(${ym}, ${xm})`],
        (k) => `M(${xm + k}, ${ym - k})`
      ),
      explanation: `Las coordenadas del punto medio se obtienen promediando abscisas y ordenadas: $$x_m = \\frac{${x1} + (${x2})}{2} = ${xm}, \\qquad y_m = \\frac{${y1} + (${y2})}{2} = ${ym}$$ Por tanto, el punto medio es $M(${xm}, ${ym})$-`
    };
  },

  geoanPendienteRecta() {
    const x1 = this.randInt(-5, 4);
    const y1 = this.randInt(-5, 4);
    const dx = this.randInt(2, 7);
    const dy = this.randNonZero(-8, 8);
    const x2 = x1 + dx;
    const y2 = y1 + dy;

    const mLatex = this.formatFrac(dy, dx);

    return {
      calculator: "none",
      question: `Calcula la pendiente $m$ de la recta que pasa por los puntos $A(${x1}, ${y1})$ y $B(${x2}, ${y2})$:`,
      options: this.buildUniqueOptions(
        `m = ${mLatex}`,
        [`m = ${this.formatFrac(-dy, dx)}`, `m = ${this.formatFrac(dx, dy)}`, `m = ${this.formatFrac(dy + 2, dx)}`],
        (k) => `m = ${this.formatFrac(dy + k, dx)}`
      ),
      explanation: `Aplicando la fórmula de la pendiente $m = \\frac{y_2 - y_1}{x_2 - x_1}$: $$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${dy}}{${dx}} = ${mLatex}$$`
    };
  },

  geoanEcuacionRecta() {
    const m = this.randNonZero(-5, 5);
    const x1 = this.randNonZero(-5, 5);
    const y1 = this.randNonZero(-5, 5);
    const b = y1 - m * x1;

    const correct = `y = ${this.signTerm(m, "x", true)} ${this.signTerm(b)}`;
    const d1 = `y = ${this.signTerm(m, "x", true)} ${this.signTerm(-b)}`;
    const d2 = `y = ${this.signTerm(-m, "x", true)} ${this.signTerm(b)}`;
    const d3 = `y = ${this.signTerm(m, "x", true)} ${this.signTerm(y1 + m * x1)}`;

    return {
      calculator: "none",
      question: `Halla la ecuación ordinaria ($y = mx + b$) de la recta que pasa por el punto $P(${x1}, ${y1})$ y tiene pendiente $m = ${m}$:`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `y = ${this.signTerm(m, "x", true)} ${this.signTerm(b + k)}`),
      explanation: `Utilizando la forma punto-pendiente $y - y_1 = m(x - x_1)$: $$y - (${y1}) = ${m}(x - (${x1})) \\Rightarrow y = ${m}x ${this.signTerm(-m * x1)} ${this.signTerm(y1)} \\Rightarrow ${correct}$$`
    };
  },

  geoanParabolaFoco() {
    const p = this.randNonZero(-7, 7);
    const fourP = 4 * p;
    const isVertical = this.randChoice([true, false]);

    if (isVertical) {
      return {
        calculator: "none",
        question: `Determina las coordenadas del foco $F$ y la ecuación de la directriz de la parábola con vértice en el origen:\n$$x^2 = ${fourP}y$$`,
        options: this.buildUniqueOptions(
          `F(0, ${p}), \\quad y = ${-p}`,
          [`F(${p}, 0), \\quad x = ${-p}`, `F(0, ${-p}), \\quad y = ${p}`, `F(0, ${fourP}), \\quad y = ${-fourP}`],
          (k) => `F(0, ${p + k}), \\quad y = ${-(p + k)}`
        ),
        explanation: `La ecuación es de la forma $x^2 = 4py$. Igualando $4p = ${fourP} \\Rightarrow p = ${p}$. Su foco está en $F(0, p) = F(0, ${p})$ y su directriz es $y = -p \\Rightarrow y = ${-p}$.`
      };
    } else {
      return {
        calculator: "none",
        question: `Determina las coordenadas del foco $F$ y la ecuación de la directriz de la parábola con vértice en el origen:\n$$y^2 = ${fourP}x$$`,
        options: this.buildUniqueOptions(
          `F(${p}, 0), \\quad x = ${-p}`,
          [`F(0, ${p}), \\quad y = ${-p}`, `F(${-p}, 0), \\quad x = ${p}`, `F(${fourP}, 0), \\quad x = ${-fourP}`],
          (k) => `F(${p + k}, 0), \\quad x = ${-(p + k)}`
        ),
        explanation: `La ecuación tiene la forma horizontal $y^2 = 4px$. De $4p = ${fourP}$ obtenemos $p = ${p}$. El foco es $F(p, 0) = F(${p}, 0)$ y la directriz es $x = -p \\Rightarrow x = ${-p}$.`
      };
    }
  },

  geoanCircunferenciaCanonica() {
    const h = this.randNonZero(-7, 7);
    const k = this.randNonZero(-7, 7);
    const r = this.randInt(2, 11);
    const r2 = r * r;

    const eq = `(x ${this.signTerm(-h)})^2 + (y ${this.signTerm(-k)})^2 = ${r2}`;
    const d1 = `(x ${this.signTerm(h)})^2 + (y ${this.signTerm(k)})^2 = ${r2}`;
    const d2 = `(x ${this.signTerm(-h)})^2 + (y ${this.signTerm(-k)})^2 = ${r}`;
    const d3 = `(x ${this.signTerm(h)})^2 + (y ${this.signTerm(-k)})^2 = ${r2}`;

    return {
      calculator: "none",
      question: `¿Cuál es la ecuación ordinaria de la circunferencia con centro en $C(${h}, ${k})$ y radio $r = ${r}$?`,
      options: this.buildUniqueOptions(eq, [d1, d2, d3], (s) => `(x ${this.signTerm(-h)})^2 + (y ${this.signTerm(-k)})^2 = ${r2 + s}`),
      explanation: `Sustituyendo $h = ${h}$, $k = ${k}$ y $r = ${r}$ en la ecuación canónica $(x - h)^2 + (y - k)^2 = r^2$: $$${eq}$$`
    };
  },

  geoanCircunferenciaGeneral() {
    const h = this.randNonZero(-6, 6);
    const k = this.randNonZero(-6, 6);
    const r = this.randInt(2, 9);
    const D = -2 * h;
    const E = -2 * k;
    const F = h * h + k * k - r * r;

    return {
      calculator: "basic",
      question: `Determina el centro $C(h, k)$ y el radio $r$ de la circunferencia cuya ecuación general es:\n$$x^2 + y^2 ${this.signTerm(D, "x")} ${this.signTerm(E, "y")} ${this.signTerm(F)} = 0$$`,
      options: this.buildUniqueOptions(
        `C(${h}, ${k}), \\quad r = ${r}`,
        [`C(${-h}, ${-k}), \\quad r = ${r}`, `C(${h}, ${k}), \\quad r = ${r * r}`, `C(${D}, ${E}), \\quad r = ${r}`],
        (s) => `C(${h}, ${k}), \\quad r = ${r + s}`
      ),
      explanation: `Completando trinomios cuadrados perfectos: $$(x^2 ${this.signTerm(D, "x")} + ${h * h}) + (y^2 ${this.signTerm(E, "y")} + ${k * k}) = ${-F} + ${h * h} + ${k * k}$$ $$(x ${this.signTerm(-h)})^2 + (y ${this.signTerm(-k)})^2 = ${r * r}$$ De donde el centro es $C(${h}, ${k})$ y el radio es $r = \\sqrt{${r * r}} = ${r}$.`
    };
  },

  geoanElipseElementos() {
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
    const [b, c, a] = this.randChoice(triples);
    const a2 = a * a;
    const b2 = b * b;

    return {
      calculator: "none",
      question: `Dada la elipse con centro en el origen:\n$$\\frac{x^2}{${a2}} + \\frac{y^2}{${b2}} = 1$$\nCalcula la longitud de su eje mayor $2a$ y su excentricidad $e = \\frac{c}{a}$:`,
      options: this.buildUniqueOptions(
        `2a = ${2 * a}, \\quad e = ${this.formatFrac(c, a)}`,
        [`2a = ${a}, \\quad e = ${this.formatFrac(c, a)}`, `2a = ${2 * a}, \\quad e = ${this.formatFrac(b, a)}`, `2a = ${2 * b}, \\quad e = ${this.formatFrac(a, c)}`],
        (s) => `2a = ${2 * (a + s)}, \\quad e = ${this.formatFrac(c, a)}`
      ),
      explanation: `Como $a^2 = ${a2} \\Rightarrow a = ${a}$ y $b^2 = ${b2} \\Rightarrow b = ${b}$, el eje mayor mide $2a = ${2 * a}$. La semidistancia focal es: $$c = \\sqrt{a^2 - b^2} = \\sqrt{${a2} - ${b2}} = \\sqrt{${c * c}} = ${c}$$ Por tanto, la excentricidad es $e = \\frac{c}{a} = ${this.formatFrac(c, a)}$.`
    };
  },

  geoanParabolaVerticeGeneral() {
    const h = this.randNonZero(-5, 5);
    const k = this.randNonZero(-5, 5);
    const fourP = this.randChoice([4, 8, 12, -4, -8, -12]);
    // (x - h)^2 = 4p(y - k)
    const eq = `(x ${this.signTerm(-h)})^2 = ${fourP}(y ${this.signTerm(-k)})`;
    const p = fourP / 4;

    return {
      calculator: "none",
      question: `Determina las coordenadas del vértice $V(h,k)$ y del foco $F$ de la parábola:\n$$${eq}$$`,
      options: this.buildUniqueOptions(
        `V(${h}, ${k}), \\quad F(${h}, ${k + p})`,
        [`V(${-h}, ${-k}), \\quad F(${-h}, ${-k + p})`, `V(${h}, ${k}), \\quad F(${h + p}, ${k})`, `V(${k}, ${h}), \\quad F(${k}, ${h + p})`],
        (s) => `V(${h}, ${k}), \\quad F(${h}, ${k + p + s})`
      ),
      explanation: `Comparando con $(x - h)^2 = 4p(y - k)$, el vértice es $V(${h}, ${k})$ y $4p = ${fourP} \\Rightarrow p = ${p}$. Como abre verticalmente, el foco es $F(h, k + p) = F(${h}, ${k + p})$.`
    };
  },

  /* ==================== 6. FUNCIONES Y PRECÁLCULO ==================== */
  funcDominioRacional() {
    const a = this.randInt(2, 6);
    const b = this.randNonZero(-9, 9);
    const c = this.randNonZero(-12, 12);

    return {
      calculator: "none",
      question: `Determina el dominio de la función racional:\n$$f(x) = \\frac{${a}x ${this.signTerm(b)}}{x ${this.signTerm(-c)}}$$`,
      options: this.buildUniqueOptions(
        `\\mathbb{R} \\setminus \\{${c}\\}`,
        [`\\mathbb{R} \\setminus \\{${-c}\\}`, `\\mathbb{R} \\setminus \\left\\{${this.formatFrac(-b, a)}\\right\\}`, `[${c}, \\infty)`],
        (k) => `\\mathbb{R} \\setminus \\{${c + k}\\}`
      ),
      explanation: `El denominador de una función racional no puede ser cero: $$x ${this.signTerm(-c)} = 0 \\Rightarrow x = ${c}$$ Por lo tanto, el dominio es $\\text{Dom}(f) = \\mathbb{R} \\setminus \\{${c}\\}$.`
    };
  },

  funcEvaluacionPolinomio() {
    const a = this.randInt(2, 4);
    const b = this.randNonZero(-6, 6);
    const c = this.randNonZero(-8, 8);
    const x0 = this.randNonZero(-4, 5);
    const val = a * x0 * x0 + b * x0 + c;

    return {
      calculator: "basic",
      question: `Dada la función cuadrática $f(x) = ${a}x^2 ${this.signTerm(b, "x")} ${this.signTerm(c)}$, calcula el valor de $f(${x0})$:`,
      options: this.buildUniqueOptions(
        `${val}`,
        [`${a * x0 * x0 - b * x0 + c}`, `${val + 2 * a}`, `${val - b * x0}`],
        (k) => `${val + k * 3}`
      ),
      explanation: `Sustituyendo $x = ${x0}$ en la regla de correspondencia: $$f(${x0}) = ${a}(${x0})^2 ${this.signTerm(b)}(${x0}) ${this.signTerm(c)} = ${a * x0 * x0} ${this.signTerm(b * x0)} ${this.signTerm(c)} = ${val}$$`
    };
  },

  funcLimiteDeterminado() {
    const a = this.randInt(1, 4);
    const b = this.randNonZero(-5, 5);
    const c = this.randInt(1, 9);
    const x0 = this.randInt(1, 5);
    const val = a * x0 * x0 + b * x0 + c;

    return {
      calculator: "none",
      question: `Calcula el valor del siguiente límite directo:\n$$\\lim_{x \\to ${x0}} (${a}x^2 ${this.signTerm(b, "x")} + ${c})$$`,
      options: this.buildUniqueOptions(
        `${val}`,
        [`${val - c}`, `${val + 2 * x0}`, `${2 * a * x0 + b}`],
        (k) => `${val + k * 2}`
      ),
      explanation: `Por continuidad de las funciones polinomiales, evaluamos por sustitución directa en $x = ${x0}$: $$\\lim_{x \\to ${x0}} (${a}x^2 ${this.signTerm(b, "x")} + ${c}) = ${a}(${x0})^2 ${this.signTerm(b)}(${x0}) + ${c} = ${val}$$`
    };
  },

  funcComposicionEval() {
    const a = this.randInt(2, 4);
    const b = this.randNonZero(-5, 5);
    const c = this.randInt(2, 5);
    const d = this.randNonZero(-6, 6);
    const x0 = this.randInt(-2, 4);

    const gx0 = c * x0 + d;
    const fgx0 = a * gx0 * gx0 + b;
    const gfx0 = c * (a * x0 * x0 + b) + d;

    return {
      calculator: "basic",
      question: `Sean las funciones $f(x) = ${a}x^2 ${this.signTerm(b)}$ y $g(x) = ${c}x ${this.signTerm(d)}$. Determina el valor de la función compuesta $(f \\circ g)(${x0})$:`,
      options: this.buildUniqueOptions(
        `${fgx0}`,
        [`${gfx0}`, `${a * x0 * x0 + b + gx0}`, `${fgx0 - b}`],
        (k) => `${fgx0 + k * 4}`
      ),
      explanation: `Primero evaluamos la función interna $g(${x0})$: $$g(${x0}) = ${c}(${x0}) ${this.signTerm(d)} = ${gx0}$$ Luego evaluamos $f(g(${x0})) = f(${gx0})$: $$f(${gx0}) = ${a}(${gx0})^2 ${this.signTerm(b)} = ${a * gx0 * gx0} ${this.signTerm(b)} = ${fgx0}$$`
    };
  },

  funcDominioRadical() {
    const a = this.randInt(2, 6);
    const k = this.randNonZero(-8, 9);
    const b = -a * k;

    return {
      calculator: "none",
      question: `Determina el dominio en $\\mathbb{R}$ de la función con radical de índice par:\n$$f(x) = \\sqrt{${a}x ${this.signTerm(b)}}$$`,
      options: this.buildUniqueOptions(
        `[${k}, \\infty)`,
        [`(${k}, \\infty)`, `(-\\infty, ${k}]`, `[${-k}, \\infty)`],
        (s) => `[${k + s}, \\infty)`
      ),
      explanation: `El radicando de una raíz cuadrada real no puede ser negativo: $$${a}x ${this.signTerm(b)} \\ge 0 \\Rightarrow ${a}x \\ge ${-b} \\Rightarrow x \\ge ${k}$$ Por lo tanto, el dominio es $[${k}, \\infty)$.`
    };
  },

  funcRangoCuadratica() {
    const a = this.randChoice([1, 2, 3, -1, -2, -3]);
    const h = this.randNonZero(-6, 6);
    const k = this.randNonZero(-8, 8);

    const range = a > 0 ? `[${k}, \\infty)` : `(-\\infty, ${k}]`;
    const wrong1 = a > 0 ? `(-\\infty, ${k}]` : `[${k}, \\infty)`;
    const wrong2 = `[${h}, \\infty)`;
    const wrong3 = `(${k}, \\infty)`;

    return {
      calculator: "none",
      question: `Determina el rango (imagen) de la función cuadrática en forma canónica:\n$$f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}(x ${this.signTerm(-h)})^2 ${this.signTerm(k)}$$`,
      options: this.buildUniqueOptions(range, [wrong1, wrong2, wrong3], (s) => `[${k + s}, \\infty)`),
      explanation: `El vértice de la parábola es $V(${h}, ${k})$. Como el coeficiente principal es $a = ${a} ${a > 0 ? "\\gt 0" : "\\lt 0"}$, la parábola abre hacia ${a > 0 ? "arriba" : "abajo"} y su rango es $${range}$.`
    };
  },

  funcInversaRacional() {
    const a = this.randInt(2, 7);
    const b = this.randInt(1, 9);
    const c = this.randInt(1, 6);
    if (a === c) return this.funcInversaRacional();

    const correct = `f^{-1}(x) = \\frac{${c}x + ${b}}{x - ${a}}`;
    const d1 = `f^{-1}(x) = \\frac{${a}x - ${b}}{x + ${c}}`;
    const d2 = `f^{-1}(x) = \\frac{x - ${c}}{${a}x + ${b}}`;
    const d3 = `f^{-1}(x) = \\frac{${c}x - ${b}}{x + ${a}}`;

    return {
      calculator: "none",
      question: `Determina la función inversa $f^{-1}(x)$ de la función biyectiva:\n$$f(x) = \\frac{${a}x + ${b}}{x - ${c}}, \\quad x \\neq ${c}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `f^{-1}(x) = \\frac{${c + k}x + ${b}}{x - ${a}}`),
      explanation: `Hacemos $y = \\frac{${a}x + ${b}}{x - ${c}}$ y despejamos $x$: $$y(x - ${c}) = ${a}x + ${b} \\Rightarrow xy - ${a}x = ${c}y + ${b} \\Rightarrow x(y - ${a}) = ${c}y + ${b}$$ $$x = \\frac{${c}y + ${b}}{y - ${a}} \\Rightarrow ${correct}$$`
    };
  },

  funcLimiteIndeterminadoFactor() {
    const r1 = this.randNonZero(-7, 8);
    let r2 = this.randNonZero(-7, 8);
    if (r1 === r2 || r1 + r2 === 0) r2 += 2;

    const B = -(r1 + r2);
    const C = r1 * r2;
    const limitVal = r1 - r2;

    return {
      calculator: "none",
      question: `Calcula el siguiente límite indeterminado de la forma $\\frac{0}{0}$:\n$$\\lim_{x \\to ${r1}} \\frac{x^2 ${this.signTerm(B, "x")} ${this.signTerm(C)}}{x ${this.signTerm(-r1)}}$$`,
      options: this.buildUniqueOptions(
        `${limitVal}`,
        [`${r1 + r2}`, `0`, `${-limitVal}`],
        (k) => `${limitVal + k * 2}`
      ),
      explanation: `Al evaluar en $x = ${r1}$ se obtiene la indeterminación $\\frac{0}{0}$. Factorizando el numerador: $$\\lim_{x \\to ${r1}} \\frac{(x ${this.signTerm(-r1)})(x ${this.signTerm(-r2)})}{x ${this.signTerm(-r1)}} = \\lim_{x \\to ${r1}} (x ${this.signTerm(-r2)}) = ${r1} - (${r2}) = ${limitVal}$$`
    };
  },

  funcLimiteIndeterminadoRadical() {
    const k = this.randInt(2, 9);
    const a = k * k;
    const ans = this.formatFrac(1, 2 * k);

    return {
      calculator: "none",
      question: `Evalúa el siguiente límite irracional indeterminado:\n$$\\lim_{x \\to ${a}} \\frac{\\sqrt{x} - ${k}}{x - ${a}}$$`,
      options: this.buildUniqueOptions(
        ans,
        [this.formatFrac(1, k), `${2 * k}`, `0`],
        (s) => this.formatFrac(1, 2 * k + s)
      ),
      explanation: `Racionalizando o factorizando el denominador como diferencia de cuadrados $x - ${a} = (\\sqrt{x} - ${k})(\\sqrt{x} + ${k})$: $$\\lim_{x \\to ${a}} \\frac{\\sqrt{x} - ${k}}{(\\sqrt{x} - ${k})(\\sqrt{x} + ${k})} = \\lim_{x \\to ${a}} \\frac{1}{\\sqrt{x} + ${k}} = \\frac{1}{${k} + ${k}} = ${ans}$$`
    };
  },

  /* ==================== 7. CÁLCULO DIFERENCIAL ==================== */
  calcDerivadaPolinomio() {
    const a = this.randInt(2, 6);
    const n = this.randInt(3, 5);
    const b = this.randNonZero(-7, 7);
    const c = this.randNonZero(-9, 9);
    const d = this.randInt(1, 15);

    const da = a * n;
    const db = b * 2;
    const correct = `f'(x) = ${da}x^${n - 1} ${this.signTerm(db, "x")} ${this.signTerm(c)}`;
    const d1 = `f'(x) = ${da}x^${n} ${this.signTerm(db, "x^2")} ${this.signTerm(c, "x")}`;
    const d2 = `f'(x) = ${a}x^${n - 1} ${this.signTerm(b, "x")} ${this.signTerm(c)}`;
    const d3 = `f'(x) = ${da}x^${n - 1} ${this.signTerm(db, "x")} ${this.signTerm(c)} - ${d}`;

    return {
      calculator: "none",
      question: `Obtén la primera derivada $f'(x)$ de la función polinomial:\n$$f(x) = ${a}x^${n} ${this.signTerm(b, "x^2")} ${this.signTerm(c, "x")} - ${d}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `f'(x) = ${da + k}x^${n - 1} ${this.signTerm(db, "x")} ${this.signTerm(c)}`),
      explanation: `Derivando término a término mediante la regla de la potencia $\\frac{d}{dx}[cx^k] = ckx^{k-1}$ y sabiendo que la derivada de una constante es $0$: $$${correct}$$`
    };
  },

  calcLimiteDiferenciaCuadrados() {
    const a = this.randInt(2, 12);
    const a2 = a * a;
    const ans = 2 * a;

    return {
      calculator: "none",
      question: `Calcula el valor del límite indeterminado:\n$$\\lim_{x \\to ${a}} \\frac{x^2 - ${a2}}{x - ${a}}$$`,
      options: this.buildUniqueOptions(
        `${ans}`,
        [`${a}`, `0`, `${a2}`],
        (k) => `${ans + k * 2}`
      ),
      explanation: `Factorizando la diferencia de cuadrados $x^2 - ${a2} = (x - ${a})(x + ${a})$: $$\\lim_{x \\to ${a}} \\frac{(x - ${a})(x + ${a})}{x - ${a}} = \\lim_{x \\to ${a}} (x + ${a}) = ${a} + ${a} = ${ans}$$`
    };
  },

  calcDerivadaRaizPotencia() {
    const k = this.randInt(2, 9) * 2;
    const m = this.randInt(2, 7);
    const halfK = k / 2;

    const correct = `f'(x) = \\frac{${halfK}}{\\sqrt{x}} - \\frac{${m}}{x^2}`;
    const d1 = `f'(x) = \\frac{${k}}{\\sqrt{x}} + \\frac{${m}}{x^2}`;
    const d2 = `f'(x) = \\frac{${halfK}}{\\sqrt{x}} + \\frac{${m}}{x^2}`;
    const d3 = `f'(x) = ${halfK}\\sqrt{x} - \\frac{${m}}{x^2}`;

    return {
      calculator: "none",
      question: `Determina la primera derivada de la función:\n$$f(x) = ${k}\\sqrt{x} + \\frac{${m}}{x}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (s) => `f'(x) = \\frac{${halfK + s}}{\\sqrt{x}} - \\frac{${m}}{x^2}`),
      explanation: `Reescribiendo con exponentes fraccionarios y negativos $f(x) = ${k}x^{1/2} + ${m}x^{-1}$: $$f'(x) = ${k}\\left(\\frac{1}{2}x^{-1/2}\\right) + ${m}(-1x^{-2}) = \\frac{${halfK}}{\\sqrt{x}} - \\frac{${m}}{x^2}$$`
    };
  },

  calcReglaCadenaPotencia() {
    const a = this.randInt(2, 5);
    const b = this.randNonZero(-7, 7);
    const c = this.randInt(1, 9);
    const n = this.randInt(3, 7);
    const inner = `${a}x^2 ${this.signTerm(b, "x")} + ${c}`;
    const dInner = `${2 * a}x ${this.signTerm(b)}`;

    const correct = `f'(x) = ${n}(${dInner})(${inner})^{${n - 1}}`;
    const d1 = `f'(x) = ${n}(${inner})^{${n - 1}}`;
    const d2 = `f'(x) = (${dInner})(${inner})^{${n - 1}}`;
    const d3 = `f'(x) = ${n}(${dInner})(${inner})^{${n}}`;

    return {
      calculator: "none",
      question: `Aplica la regla de la cadena para hallar la derivada de:\n$$f(x) = (${inner})^{${n}}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `f'(x) = ${n + k}(${dInner})(${inner})^{${n - 1}}`),
      explanation: `Por la regla de la cadena $\\frac{d}{dx}[u^n] = n u^{n-1} \\cdot u'$, con $u = ${inner}$ y $u' = ${dInner}$: $$${correct}$$`
    };
  },

  calcDerivadaTrigonometrica() {
    const a = this.randInt(2, 6);
    const k1 = this.randInt(2, 5);
    const b = this.randInt(2, 6);
    const k2 = this.randInt(2, 5);

    const c1 = a * k1;
    const c2 = b * k2;
    const correct = `f'(x) = ${c1}\\cos(${k1}x) + ${c2}\\sin(${k2}x)`;
    const d1 = `f'(x) = ${c1}\\cos(${k1}x) - ${c2}\\sin(${k2}x)`;
    const d2 = `f'(x) = ${a}\\cos(${k1}x) + ${b}\\sin(${k2}x)`;
    const d3 = `f'(x) = -${c1}\\cos(${k1}x) - ${c2}\\sin(${k2}x)`;

    return {
      calculator: "none",
      question: `Calcula la derivada de la función trigonométrica:\n$$f(x) = ${a}\\sin(${k1}x) - ${b}\\cos(${k2}x)$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (s) => `f'(x) = ${c1 + s}\\cos(${k1}x) + ${c2}\\sin(${k2}x)`),
      explanation: `Aplicando $\\frac{d}{dx}[\\sin(kx)] = k\\cos(kx)$ y $\\frac{d}{dx}[\\cos(kx)] = -k\\sin(kx)$: $$f'(x) = ${a}(${k1}\\cos(${k1}x)) - ${b}(-${k2}\\sin(${k2}x)) = ${c1}\\cos(${k1}x) + ${c2}\\sin(${k2}x)$$`
    };
  },

  calcReglaProducto() {
    const n = this.randInt(2, 5);
    const k = this.randInt(2, 6);

    const correct = `f'(x) = x^${n - 1} e^{${k}x}(${k}x + ${n})`;
    const d1 = `f'(x) = ${n * k}x^${n - 1} e^{${k}x}`;
    const d2 = `f'(x) = x^${n - 1} e^{${k}x}(x + ${n})`;
    const d3 = `f'(x) = x^${n} e^{${k}x}(${k}x - ${n})`;

    return {
      calculator: "none",
      question: `Utilizando la regla del producto, determina la derivada simplificada de:\n$$f(x) = x^${n} e^{${k}x}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (s) => `f'(x) = x^${n - 1} e^{${k}x}(${k}x + ${n + s})`),
      explanation: `Por la regla del producto $(uv)' = u'v + uv'$, con $u = x^${n} \\Rightarrow u' = ${n}x^${n - 1}$ y $v = e^{${k}x} \\Rightarrow v' = ${k}e^{${k}x}$: $$f'(x) = ${n}x^${n - 1}e^{${k}x} + x^${n}(${k}e^{${k}x}) = x^${n - 1} e^{${k}x}(${k}x + ${n})$$`
    };
  },

  calcReglaCociente() {
    const a = this.randInt(2, 6);
    const b = this.randInt(1, 5);
    const c = this.randInt(1, 6);
    const numConst = -a * c - b;

    const correct = `f'(x) = \\frac{${numConst}}{(x - ${c})^2}`;
    const d1 = `f'(x) = \\frac{${a * c + b}}{(x - ${c})^2}`;
    const d2 = `f'(x) = \\frac{${2 * a}x + ${b - a * c}}{(x - ${c})^2}`;
    const d3 = `f'(x) = \\frac{${numConst}}{x - ${c}}`;

    return {
      calculator: "none",
      question: `Aplicando la regla del cociente, halla la derivada de:\n$$f(x) = \\frac{${a}x + ${b}}{x - ${c}}$$`,
      options: this.buildUniqueOptions(correct, [d1, d2, d3], (k) => `f'(x) = \\frac{${numConst - k}}{(x - ${c})^2}`),
      explanation: `Por la regla del cociente $f'(x) = \\frac{u'v - uv'}{v^2}$: $$f'(x) = \\frac{${a}(x - ${c}) - (${a}x + ${b})(1)}{(x - ${c})^2} = \\frac{${a}x - ${a * c} - ${a}x - ${b}}{(x - ${c})^2} = \\frac{${numConst}}{(x - ${c})^2}$$`
    };
  },

  calcMaximosMinimos() {
    const rMin = this.randInt(1, 6);
    const rMax = this.randInt(-5, 0);
    if (rMin === rMax || (rMin + rMax) % 2 !== 0) {
      return this.calcMaximosMinimos();
    }

    const B = -(3 * (rMax + rMin)) / 2;
    const C = 3 * rMax * rMin;
    const D = this.randInt(1, 10);
    const askMin = this.randChoice([true, false]);
    const targetX = askMin ? rMin : rMax;
    const label = askMin ? "mínimo relativo" : "máximo relativo";
    const evalSecondDeriv = 6 * targetX + 2 * B;
    const condLatex = askMin 
      ? `${evalSecondDeriv} \\gt 0 \\Rightarrow \\text{mínimo relativo en } x = ${targetX}`
      : `${evalSecondDeriv} \\lt 0 \\Rightarrow \\text{máximo relativo en } x = ${targetX}`;

    return {
      calculator: "none",
      question: `Determina la abscisa $x$ donde la función cúbica alcanza su ${label}:\n$f(x) = x^3 ${this.signTerm(B, "x^2")} ${this.signTerm(C, "x")} + ${D}$`,
      options: this.buildUniqueOptions(
        `x = ${targetX}`,
        [`x = ${askMin ? rMax : rMin}`, `x = ${-targetX}`, `x = ${(rMin + rMax) / 2}`],
        (k) => `x = ${targetX + k + 2}`
      ),
      explanation: `Derivamos e igualamos a cero para obtener los puntos críticos: $f'(x) = 3x^2 ${this.signTerm(2 * B, "x")} ${this.signTerm(C)} = 3(x ${this.signTerm(-rMax)})(x ${this.signTerm(-rMin)}) = 0$ Los puntos críticos son $x = ${rMax}$ y $x = ${rMin}$. Aplicando el criterio de la segunda derivada $f''(x) = 6x ${this.signTerm(2 * B)}$: $f''(${targetX}) = ${condLatex}$ Por lo tanto, la función alcanza su ${label} en $x = ${targetX}$.`
    };
  },

  calcPuntoInflexion() {
    const x0 = this.randNonZero(-5, 6);
    const B = -3 * x0;
    const C = this.randNonZero(-9, 9);
    const D = this.randInt(1, 10);
    const y0 = x0 * x0 * x0 + B * x0 * x0 + C * x0 + D;

    return {
      calculator: "basic",
      question: `Determina las coordenadas del punto de inflexión de la función:\n$$f(x) = x^3 ${this.signTerm(B, "x^2")} ${this.signTerm(C, "x")} + ${D}$$`,
      options: this.buildUniqueOptions(
        `(${x0}, ${y0})`,
        [`(${-x0}, ${y0})`, `(${x0}, ${D})`, `(${2 * x0}, ${y0})`],
        (k) => `(${x0 + k}, ${y0 - k})`
      ),
      explanation: `Calculamos la primera y segunda derivada: $$f'(x) = 3x^2 ${this.signTerm(2 * B, "x")} ${this.signTerm(C)}, \\qquad f''(x) = 6x ${this.signTerm(2 * B)}$$ Igualamos $f''(x) = 0$: $$6x ${this.signTerm(2 * B)} = 0 \\Rightarrow x = ${x0}$$ Evaluamos en la función original: $$f(${x0}) = (${x0})^3 ${this.signTerm(B)}(${x0})^2 ${this.signTerm(C)}(${x0}) + ${D} = ${y0}$$ Por lo tanto, el punto de inflexión es $(${x0}, ${y0})$.`
    };
  },

    ariOrdenOperaciones() {
      const a = this.randInt(2, 40), b = this.randInt(2, 12), c = this.randInt(2, 12), e = this.randInt(2, 9), q = this.randInt(2, 12), d = e * q;
      const ans = a + b * c - q;
      return {
        calculator: "none",
        question: `Calcula el valor de la siguiente expresión respetando la jerarquía de operaciones:\n$$${a} + ${b} \\times ${c} - ${d} \\div ${e}$$`,
        options: this.buildUniqueOptions(`${ans}`, [`${(a + b) * c - q}`, `${a + b * c - d}`, `${a + b * c + q}`], (k) => `${ans + k * 2}`),
        explanation: `Primero se resuelven multiplicaciones y divisiones, y después sumas y restas: $$${a} + ${b * c} - ${q} = ${ans}$$`
      };
    },

    ariInteresSimple() {
      const C = this.randInt(2, 40) * 500, r = this.randInt(2, 15), t = this.randInt(1, 8), I = (C * r * t) / 100, M = C + I;
      return {
        calculator: "basic",
        question: `Se depositan $${C}\\text{ MXN}$ a una tasa de interés simple del $${r}\\%$ anual durante $${t}$ ${t === 1 ? "año" : "años"}. ¿Cuál es el monto final acumulado?`,
        options: this.buildUniqueOptions(this.formatMXN(M), [this.formatMXN(I), this.formatMXN((C * Math.pow(1 + r / 100, t)).toFixed(2)), this.formatMXN(C + (C * r) / 100)], (k) => this.formatMXN(M + k * 50)),
        explanation: `El interés simple es $I = \\frac{C \\cdot r \\cdot t}{100} = \\frac{${C} \\cdot ${r} \\cdot ${t}}{100} = ${I}$. El monto es: $$M = C + I = ${C} + ${I} = ${M}\\text{ MXN}$$`
      };
    },

    ariRepartoProporcional() {
      const a = this.randInt(1, 6), b = this.randInt(1, 6), c = this.randInt(1, 6), S = a + b + c, k = this.randInt(3, 40), N = S * k;
      return {
        calculator: "basic",
        question: `Ana, Beto y Carla se reparten $${N}\\text{ MXN}$ en forma directamente proporcional a $${a}$, $${b}$ y $${c}$ respectivamente. ¿Cuánto recibe Beto?`,
        options: this.buildUniqueOptions(this.formatMXN(b * k), [this.formatMXN(a * k), this.formatMXN(c * k), this.formatMXN(Math.round(N / 3))], (s) => this.formatMXN(b * k + s * 10)),
        explanation: `La suma de las partes es $${a} + ${b} + ${c} = ${S}$, así que cada parte vale $\\frac{${N}}{${S}} = ${k}$. Beto recibe: $$${b} \\times ${k} = ${b * k}\\text{ MXN}$$`
      };
    },

    /* ===================== ÁLGEBRA ===================== */
    algInecuacionLineal() {
      const a = this.randInt(2, 9), s = this.randInt(-9, 12), b = this.randNonZero(-12, 12), c = a * s + b;
      const gt = this.randChoice([true, false]);
      const rel = gt ? "\\gt" : "\\lt";
      const correct = gt ? `(${s}, \\infty)` : `(-\\infty, ${s})`;
      const wrong = gt
        ? [`[${s}, \\infty)`, `(-\\infty, ${s})`, `(${-s}, \\infty)`]
        : [`(-\\infty, ${s}]`, `(${s}, \\infty)`, `(-\\infty, ${-s})`];
      return {
        calculator: "none",
        question: `Resuelve la inecuación lineal y expresa la solución como intervalo:\n$$${a}x ${this.signTerm(b)} ${rel} ${c}$$`,
        options: this.buildUniqueOptions(correct, wrong, (k) => (gt ? `(${s + k}, \\infty)` : `(-\\infty, ${s + k})`)),
        explanation: `Despejamos $x$ (como $${a} \\gt 0$ el sentido de la desigualdad no cambia): $$${a}x ${rel} ${c - b} \\Rightarrow x ${rel} ${s}$$ Por lo tanto, la solución es $${correct}$.`
      };
    },

    algRectanguloPerimetro() {
      const w = this.randInt(3, 25), k = this.randInt(1, 12), P = 2 * (2 * w + k);
      return {
        calculator: "none",
        question: `El largo de un rectángulo excede en $${k}\\text{ cm}$ a su ancho. Si su perímetro es de $${P}\\text{ cm}$, ¿cuánto mide su ancho?`,
        options: this.buildUniqueOptions(`${w}\\text{ cm}`, [`${w + k}\\text{ cm}`, `${Math.round(P / 4)}\\text{ cm}`, `${w + 2}\\text{ cm}`], (s) => `${w + s * 3}\\text{ cm}`),
        explanation: `Si el ancho es $w$, el largo es $w + ${k}$. El perímetro cumple: $$2\\left(w + (w + ${k})\\right) = ${P} \\Rightarrow 4w + ${2 * k} = ${P} \\Rightarrow w = ${w}\\text{ cm}$$`
      };
    },

    algLogaritmo() {
      const b = this.randInt(2, 5), n = this.randInt(2, 4), c = this.randInt(1, 12), x = Math.pow(b, n) - c;
      return {
        calculator: "none",
        question: `Determina el valor de $x$ que satisface la ecuación logarítmica:\n$$\\log_{${b}}(x + ${c}) = ${n}$$`,
        options: this.buildUniqueOptions(`x = ${x}`, [`x = ${n * b - c}`, `x = ${Math.pow(b, n) + c}`, `x = ${Math.pow(n, b) - c}`], (k) => `x = ${x + k * 2}`),
        explanation: `Por definición de logaritmo, $\\log_b(u) = n \\Leftrightarrow u = b^n$: $$x + ${c} = ${b}^{${n}} = ${Math.pow(b, n)} \\Rightarrow x = ${x}$$`
      };
    },

    /* ===================== GEOMETRÍA EUCLIDIANA ===================== */
    geoRectanguloPerimetro() {
      const l = this.randInt(6, 30), w = this.randInt(2, l - 1), P = 2 * (l + w), A = l * w;
      return {
        calculator: "basic",
        question: `Un rectángulo tiene perímetro de $${P}\\text{ cm}$ y su largo mide $${l}\\text{ cm}$. ¿Cuál es su área?`,
        options: this.buildUniqueOptions(`${A}\\text{ cm}^2`, [`${l * l}\\text{ cm}^2`, `${(P / 2) * l}\\text{ cm}^2`, `${(l + w) * w}\\text{ cm}^2`], (k) => `${A + k * 6}\\text{ cm}^2`),
        explanation: `El semiperímetro es $l + w = \\frac{${P}}{2} = ${P / 2}$, entonces $w = ${P / 2} - ${l} = ${w}\\text{ cm}$. El área es: $$A = l \\cdot w = ${l} \\times ${w} = ${A}\\text{ cm}^2$$`
      };
    },

    geoTrianguloRazon() {
      const S = this.randChoice([9, 10, 12, 15, 18, 20, 30]);
      const p = this.randInt(1, S - 2), q = this.randInt(1, S - p - 1), r = S - p - q;
      const unit = 180 / S, mx = Math.max(p, q, r), mn = Math.min(p, q, r), ans = mx * unit;
      return {
        calculator: "none",
        question: `Los ángulos interiores de un triángulo están en la razón $${p} : ${q} : ${r}$. ¿Cuánto mide el ángulo mayor?`,
        options: this.buildUniqueOptions(`${ans}^\\circ`, [`${mn * unit}^\\circ`, `${ans + unit}^\\circ`, `90^\\circ`], (k) => `${ans + k * 5}^\\circ`),
        explanation: `Los ángulos suman $180^\\circ$ y la suma de las razones es $${p} + ${q} + ${r} = ${S}$, de modo que cada parte vale $\\frac{180^\\circ}{${S}} = ${unit}^\\circ$. El mayor es: $$${mx} \\times ${unit}^\\circ = ${ans}^\\circ$$`
      };
    },

    geoSectorCircular() {
      const th = this.randChoice([30, 45, 60, 72, 90, 120, 135, 150, 180, 210, 240, 270]), r = this.randInt(3, 24);
      const f = (n, d) => `${this.formatFrac(n, d)}\\pi\\text{ cm}^2`;
      const ans = f(th * r * r, 360);
      return {
        calculator: "none",
        question: `Calcula el área de un sector circular de radio $r = ${r}\\text{ cm}$ y ángulo central $${th}^\\circ$. Exprésala en términos de $\\pi$:`,
        options: this.buildUniqueOptions(ans, [f(th * r, 180), f(th * r * r, 180), f(th * r, 360)], (k) => f(th * r * r + 5 * k, 360)),
        explanation: `El área de un sector es proporcional a su ángulo: $$A = \\frac{\\theta}{360^\\circ}\\pi r^2 = \\frac{${th}}{360}\\pi (${r})^2 = ${ans}$$`
      };
    },

    /* ===================== TRIGONOMETRÍA ===================== */
    trig30_60_90() {
      const k = this.randInt(2, 40), askHyp = this.randChoice([true, false]);
      if (askHyp) {
        return {
          calculator: "none",
          question: `En un triángulo rectángulo con ángulos agudos de $30^\\circ$ y $60^\\circ$, el cateto menor mide $${k}\\text{ cm}$. ¿Cuánto mide la hipotenusa?`,
          options: this.buildUniqueOptions(`${2 * k}\\text{ cm}`, [`${k}\\sqrt{3}\\text{ cm}`, `${k}\\sqrt{2}\\text{ cm}`, `${3 * k}\\text{ cm}`], (s) => `${2 * k + s}\\text{ cm}`),
          explanation: `El cateto opuesto a $30^\\circ$ es la mitad de la hipotenusa porque $\\sin(30^\\circ) = \\frac{1}{2}$: $$c = \\frac{${k}}{\\sin(30^\\circ)} = ${2 * k}\\text{ cm}$$`
        };
      }
      return {
        calculator: "none",
        question: `En un triángulo rectángulo con ángulos agudos de $30^\\circ$ y $60^\\circ$, el cateto menor mide $${k}\\text{ cm}$. ¿Cuánto mide el cateto mayor?`,
        options: this.buildUniqueOptions(`${k}\\sqrt{3}\\text{ cm}`, [`${2 * k}\\text{ cm}`, `${k}\\sqrt{2}\\text{ cm}`, `${3 * k}\\text{ cm}`], (s) => `${k + s}\\sqrt{3}\\text{ cm}`),
        explanation: `El cateto mayor es el adyacente a $30^\\circ$ y cumple $\\tan(60^\\circ) = \\sqrt{3}$: $$b = ${k} \\cdot \\tan(60^\\circ) = ${k}\\sqrt{3}\\text{ cm}$$`
      };
    },

    trigAreaSeno() {
      const a = this.randInt(3, 24), b = this.randInt(3, 24), ang = this.randChoice([30, 60, 90, 120, 150]), ab = a * b;
      let den = 4, sfx = "", sinTxt = "\\frac{1}{2}";
      if (ang === 90) { den = 2; sinTxt = "1"; }
      else if (ang === 60 || ang === 120) { sfx = "\\sqrt{3}"; sinTxt = "\\frac{\\sqrt{3}}{2}"; }
      const f = (n, d) => `${this.formatFrac(n, d)}${sfx}\\text{ cm}^2`;
      const ans = f(ab, den);
      return {
        calculator: "none",
        question: `Dos lados de un triángulo miden $${a}\\text{ cm}$ y $${b}\\text{ cm}$ y el ángulo comprendido entre ellos es de $${ang}^\\circ$. ¿Cuál es su área exacta?`,
        options: this.buildUniqueOptions(ans, [f(ab, den * 2), f(ab, den / 2), `${ab}\\text{ cm}^2`], (k) => f(ab + k * 2, den)),
        explanation: `Usamos $A = \\frac{1}{2}ab\\sin(C)$ con $\\sin(${ang}^\\circ) = ${sinTxt}$: $$A = \\frac{1}{2}(${a})(${b})${sinTxt} = ${ans}$$`
      };
    },

    trigDobleAngulo() {
      const [p, q, h] = this.randChoice([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]);
      const [o, a] = this.randChoice([[p, q], [q, p]]);
      const fn = this.randChoice(["sin", "cos", "tan"]);
      let nC, dC, wrong;
      if (fn === "sin") { nC = 2 * o * a; dC = h * h; wrong = [this.formatFrac(2 * o, h), this.formatFrac(o * a, h * h), this.formatFrac(2 * o * o, h * h)]; }
      else if (fn === "cos") { nC = a * a - o * o; dC = h * h; wrong = [this.formatFrac(o * o - a * a, h * h), this.formatFrac(2 * a, h), this.formatFrac(a * a, h * h)]; }
      else { nC = 2 * o * a; dC = a * a - o * o; wrong = [this.formatFrac(2 * o, a), this.formatFrac(2 * o * a, h * h), this.formatFrac(a * a - o * o, 2 * o * a)]; }
      const ans = this.formatFrac(nC, dC);
      const formula = { sin: "2\\sin\\theta\\cos\\theta", cos: "\\cos^2\\theta - \\sin^2\\theta", tan: "\\frac{2\\sin\\theta\\cos\\theta}{\\cos^2\\theta - \\sin^2\\theta}" }[fn];
      return {
        calculator: "none",
        question: `Si $\\theta$ es un ángulo agudo y $\\sin(\\theta) = \\frac{${o}}{${h}}$, calcula el valor exacto de $\\${fn}(2\\theta)$:`,
        options: this.buildUniqueOptions(ans, wrong, (k) => this.formatFrac(nC + k, dC)),
        explanation: `Como $\\theta$ es agudo, $\\cos(\\theta) = \\sqrt{1 - \\left(\\frac{${o}}{${h}}\\right)^2} = \\frac{${a}}{${h}}$. Aplicando la identidad de ángulo doble: $\\${fn}(2\\theta) = ${formula} = ${ans}$`
      };
    },

    /* ===================== GEOMETRÍA ANALÍTICA ===================== */
    geoanExtremoSimetrico() {
      const mx = this.randInt(-9, 9), my = this.randInt(-9, 9), x1 = this.randInt(-9, 9), y1 = this.randInt(-9, 9), bx = 2 * mx - x1, by = 2 * my - y1;
      return {
        calculator: "none",
        question: `El punto medio del segmento $AB$ es $M(${mx}, ${my})$ y uno de sus extremos es $A(${x1}, ${y1})$. ¿Cuáles son las coordenadas del extremo $B$?`,
        options: this.buildUniqueOptions(`B(${bx}, ${by})`, [`B(${mx - x1}, ${my - y1})`, `B(${x1 - 2 * mx}, ${y1 - 2 * my})`, `B(${mx + x1}, ${my + y1})`], (k) => `B(${bx + k}, ${by - k})`),
        explanation: `Como $M = \\frac{A + B}{2}$, entonces $B = 2M - A$: $$B = \\left(2(${mx}) - (${x1}),\\; 2(${my}) - (${y1})\\right) = (${bx}, ${by})$$`
      };
    },

    geoanDistanciaPuntoRecta() {
      const [A0, B0, n] = this.randChoice([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17]]);
      const A = A0, B = B0 * this.randChoice([1, -1]);
      const x0 = this.randInt(-6, 6), y0 = this.randInt(-6, 6), d = this.randInt(1, 9), s = this.randChoice([1, -1]);
      const C = s * d * n - A * x0 - B * y0;
      return {
        calculator: "none",
        question: `Calcula la distancia del punto $P(${x0}, ${y0})$ a la recta:\n$$${A}x ${this.signTerm(B, "y")} ${this.signTerm(C)} = 0$$`,
        options: this.buildUniqueOptions(`${d}`, [`${d * n}`, `${-d}`, this.formatFrac(d * n, n * n)], (k) => `${d + k}`),
        explanation: `Aplicamos $d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$. El numerador vale $|${s * d * n}| = ${d * n}$ y el denominador $\\sqrt{${A * A} + ${B * B}} = ${n}$: $$d = \\frac{${d * n}}{${n}} = ${d}$$`
      };
    },

    geoanHiperbola() {
      const [a0, b0, c] = this.randChoice([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26]]);
      const [a, b] = this.randChoice([[a0, b0], [b0, a0]]);
      const foci = this.randChoice([true, false]);
      const eq = `\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1`;
      if (foci) {
        return {
          calculator: "none",
          question: `Determina las coordenadas de los focos de la hipérbola:\n$$${eq}$$`,
          options: this.buildUniqueOptions(`F(\\pm ${c}, 0)`, [`F(\\pm ${a}, 0)`, `F(0, \\pm ${c})`, `F(\\pm ${a * a + b * b}, 0)`], (k) => `F(\\pm ${c + k}, 0)`),
          explanation: `Aquí $a^2 = ${a * a}$ y $b^2 = ${b * b}$. En la hipérbola $c^2 = a^2 + b^2$: $$c = \\sqrt{${a * a} + ${b * b}} = ${c}$$ El eje transversal es horizontal, por lo que los focos son $F(\\pm ${c}, 0)$.`
        };
      }
      return {
        calculator: "none",
        question: `Determina las ecuaciones de las asíntotas de la hipérbola:\n$$${eq}$$`,
        options: this.buildUniqueOptions(`y = \\pm ${this.formatFrac(b, a)}x`, [`y = \\pm ${this.formatFrac(a, b)}x`, `y = \\pm ${this.formatFrac(b * b, a * a)}x`, `y = \\pm ${this.formatFrac(c, a)}x`], (k) => `y = \\pm ${this.formatFrac(b + k, a)}x`),
        explanation: `Con $a = ${a}$ y $b = ${b}$, las asíntotas de una hipérbola horizontal son $y = \\pm \\frac{b}{a}x$: $$y = \\pm ${this.formatFrac(b, a)}x$$`
      };
    },

    /* ===================== FUNCIONES / PRECÁLCULO ===================== */
    funcTramos() {
      const c = this.randInt(-3, 4), m = this.randNonZero(-5, 5), b = this.randNonZero(-9, 9), d = this.randNonZero(-9, 9);
      const x0 = this.randChoice([c - this.randInt(1, 4), c + this.randInt(0, 4)]);
      const v1 = m * x0 + b, v2 = x0 * x0 + d;
      const first = x0 < c, ans = first ? v1 : v2, other = first ? v2 : v1;
      return {
        calculator: "none",
        question: `Dada la función definida por tramos:\n$$f(x) = \\begin{cases} ${this.signTerm(m, "x", true)} ${this.signTerm(b)} & \\text{si } x \\lt ${c} \\\\ x^2 ${this.signTerm(d)} & \\text{si } x \\ge ${c} \\end{cases}$$\nCalcula $f(${x0})$:`,
        options: this.buildUniqueOptions(`${ans}`, [`${other}`, `${-ans}`, `${ans + 2}`], (k) => `${ans + k * 3}`),
        explanation: `Como $${x0} ${first ? "\\lt" : "\\ge"} ${c}$, usamos el ${first ? "primer" : "segundo"} tramo: $$f(${x0}) = ${first ? `${m}(${x0}) ${this.signTerm(b)}` : `(${x0})^2 ${this.signTerm(d)}`} = ${ans}$$`
      };
    },

    funcVerticeParabola() {
      const a = this.randInt(1, 4) * this.randChoice([1, -1]), h = this.randNonZero(-7, 7), k = this.randNonZero(-9, 9), b = -2 * a * h, c = k + a * h * h;
      return {
        calculator: "none",
        question: `Determina las coordenadas del vértice de la parábola:\n$$f(x) = ${this.signTerm(a, "x^2", true)} ${this.signTerm(b, "x")} ${this.signTerm(c)}$$`,
        options: this.buildUniqueOptions(`V(${h}, ${k})`, [`V(${-h}, ${k})`, `V(${h}, ${c})`, `V(${h}, ${-k})`], (s) => `V(${h + s}, ${k})`),
        explanation: `La abscisa del vértice es $h = -\\frac{b}{2a} = -\\frac{${b}}{${2 * a}} = ${h}$. La ordenada es $k = f(${h}) = ${k}$. Por tanto, $V(${h}, ${k})$.`
      };
    },

    funcLimiteInfinito() {
      const a = this.randInt(1, 9), d = this.randInt(1, 9), b = this.randNonZero(-9, 9), c = this.randNonZero(-9, 9), e = this.randNonZero(-9, 9), f = this.randNonZero(-9, 9);
      const ans = this.formatFrac(a, d);
      return {
        calculator: "none",
        question: `Calcula el siguiente límite al infinito:\n$$\\lim_{x \\to \\infty} \\frac{${a}x^2 ${this.signTerm(b, "x")} ${this.signTerm(c)}}{${d}x^2 ${this.signTerm(e, "x")} ${this.signTerm(f)}}$$`,
        options: this.buildUniqueOptions(ans, [this.formatFrac(d, a), `0`, `\\infty`], (k) => this.formatFrac(a + k, d)),
        explanation: `Dividimos numerador y denominador entre la mayor potencia, $x^2$. Los términos $\\frac{1}{x}$ y $\\frac{1}{x^2}$ tienden a $0$: $$\\lim_{x \\to \\infty} \\frac{${a} + \\frac{${b}}{x} + \\frac{${c}}{x^2}}{${d} + \\frac{${e}}{x} + \\frac{${f}}{x^2}} = \\frac{${a}}{${d}} = ${ans}$$`
      };
    },

    /* ===================== CÁLCULO DIFERENCIAL ===================== */
    calcPendienteTangente() {
      const a = this.randInt(1, 6), b = this.randNonZero(-9, 9), c = this.randNonZero(-9, 9), x0 = this.randNonZero(-5, 6), m = 2 * a * x0 + b;
      return {
        calculator: "none",
        question: `Calcula la pendiente de la recta tangente a la curva $f(x) = ${this.signTerm(a, "x^2", true)} ${this.signTerm(b, "x")} ${this.signTerm(c)}$ en el punto de abscisa $x = ${x0}$:`,
        options: this.buildUniqueOptions(`${m}`, [`${a * x0 * x0 + b * x0 + c}`, `${2 * a * x0}`, `${2 * a + b}`], (k) => `${m + k * 2}`),
        explanation: `La pendiente de la tangente es la derivada evaluada en $x_0$. Como $f'(x) = ${2 * a}x ${this.signTerm(b)}$: $$f'(${x0}) = ${2 * a}(${x0}) ${this.signTerm(b)} = ${m}$$`
      };
    },

    calcDerivadaLn() {
      const a = this.randInt(1, 9), n = this.randInt(3, 9), co = a === 1 ? "" : `${a}`;
      const ans = `f'(x) = ${co}x^{${n - 1}}(${n}\\ln x + 1)`;
      return {
        calculator: "none",
        question: `Utilizando la regla del producto, calcula la derivada de:\n$$f(x) = ${co}x^{${n}}\\ln x$$`,
        options: this.buildUniqueOptions(ans, [`f'(x) = ${co}x^{${n - 1}}`, `f'(x) = ${co}x^{${n - 1}}(${n}\\ln x - 1)`, `f'(x) = ${co}x^{${n - 1}}(\\ln x + ${n})`], (k) => `f'(x) = ${co}x^{${n - 1}}(${n + k}\\ln x + 1)`),
        explanation: `Con $u = x^{${n}}$ y $v = \\ln x$: $u' = ${n}x^{${n - 1}}$ y $v' = \\frac{1}{x}$. Entonces: $$f'(x) = ${co}\\left(${n}x^{${n - 1}}\\ln x + x^{${n}} \\cdot \\frac{1}{x}\\right) = ${ans.replace("f'(x) = ", "")}$$`
      };
    },

    calcOptimizacionCerca() {
      const m = this.randInt(3, 40), wall = this.randChoice([true, false]);
      if (!wall) {
        const ans = m * m;
        return {
          calculator: "none",
          question: `Se dispone de $${4 * m}\\text{ m}$ de malla para cercar un terreno rectangular. ¿Cuál es el área máxima que se puede encerrar?`,
          options: this.buildUniqueOptions(`${ans}\\text{ m}^2`, [`${2 * ans}\\text{ m}^2`, `${4 * m}\\text{ m}^2`, `${m * (m - 1)}\\text{ m}^2`], (k) => `${ans + k * m}\\text{ m}^2`),
          explanation: `Si un lado mide $x$, el otro mide $${2 * m} - x$ y $A(x) = x(${2 * m} - x)$. Entonces $A'(x) = ${2 * m} - 2x = 0 \\Rightarrow x = ${m}$ (un cuadrado). $$A_{\\max} = ${m} \\times ${m} = ${ans}\\text{ m}^2$$`
        };
      }
      const ans = 2 * m * m;
      return {
        calculator: "none",
        question: `Un granjero tiene $${4 * m}\\text{ m}$ de cerca y desea delimitar un corral rectangular aprovechando un muro existente como uno de los lados (el muro no requiere cerca). ¿Cuál es el área máxima del corral?`,
        options: this.buildUniqueOptions(`${ans}\\text{ m}^2`, [`${m * m}\\text{ m}^2`, `${4 * m * m}\\text{ m}^2`, `${m * (2 * m - 1)}\\text{ m}^2`], (k) => `${ans + k * m}\\text{ m}^2`),
        explanation: `Con dos lados de ancho $w$ y uno de largo $l = ${4 * m} - 2w$: $A(w) = w(${4 * m} - 2w)$. Entonces $A'(w) = ${4 * m} - 4w = 0 \\Rightarrow w = ${m}$ y $l = ${2 * m}$. $$A_{\\max} = ${m} \\times ${2 * m} = ${ans}\\text{ m}^2$$`
      };
    },

  // === 1. REESCRITURA ANALÍTICA DE LAS 7 FÁBRICAS CON EXPLICACIÓN BREVE ===
  ariOrdenOperaciones() {
    const a = this.randInt(2, 40), b = this.randInt(2, 12), c = this.randInt(2, 12);
    const e = this.randInt(2, 9), q = this.randInt(2, 12), d = e * q;
    const prod = b * c;
    const ans = a + prod - q;
    return {
      calculator: "none",
      question: `Calcula el valor exacto respetando la jerarquía de operaciones:\n$$${a} + ${b} \\times ${c} - ${d} \\div ${e}$$`,
      options: this.buildUniqueOptions(`${ans}`, [`${(a + b) * c - q}`, `${a + prod - d}`, `${a + prod + q}`], (k) => `${ans + k * 2}`),
      explanation: `Aplicamos la jerarquía PEMDAS paso a paso: primero ejecutamos multiplicación y división de izquierda a derecha: $$${b} \\times ${c} = ${prod}, \\qquad ${d} \\div ${e} = ${q}$$ Sustituimos y operamos sumas y restas: $$${a} + ${prod} - ${q} = ${a + prod} - ${q} = ${ans}$$`
    };
  },

  algLogaritmo() {
    const b = this.randInt(2, 5), n = this.randInt(2, 4), c = this.randInt(1, 12);
    const pot = Math.pow(b, n);
    const x = pot - c;
    return {
      calculator: "none",
      question: `Determina el valor de $x$ que satisface la ecuación logarítmica:\n$$\\log_{${b}}(x + ${c}) = ${n}$$`,
      options: this.buildUniqueOptions(`x = ${x}`, [`x = ${n * b - c}`, `x = ${pot + c}`, `x = ${Math.pow(n, b) - c}`], (k) => `x = ${x + k * 2}`),
      explanation: `1) **Condición de dominio**: el argumento debe cumplir $x + ${c} \\gt 0$. 2) **Conversión a forma exponencial**: por definición, $\\log_b(u) = n \\iff u = b^n$: $$x + ${c} = ${b}^{${n}} = ${pot}$$ 3) **Despeje**: $x = ${pot} - ${c} = ${x}$. Comprobación: $${x} + ${c} = ${pot} \\gt 0$ y $\\log_{${b}}(${pot}) = ${n}$.`
    };
  },

  trigAngulosNotables() {
    const a = this.randInt(2, 9);
    const b = this.randInt(2, 9);
    const variant = this.randChoice([1, 2, 3]);
    if (variant === 1) {
      const ans = a + b;
      return {
        calculator: "none",
        question: `Calcula el valor numérico exacto de la expresión:\n$$E = ${2 * a}\\sin(30^\\circ) + ${2 * b}\\cos(60^\\circ)$$`,
        options: this.buildUniqueOptions(`${ans}`, [`${2 * ans}`, `${Math.abs(a - b)}`, `${ans}\\sqrt{3}`], (k) => `${ans + k}`),
        explanation: `Recordamos del triángulo notable $30^\\circ$-$60^\\circ$-$90^\\circ$ que $\\sin(30^\\circ) = \\frac{1}{2}$ y $\\cos(60^\\circ) = \\frac{1}{2}$ (ángulos complementarios). Sustituyendo: $$E = ${2 * a}\\left(\\frac{1}{2}\\right) + ${2 * b}\\left(\\frac{1}{2}\\right) = ${a} + ${b} = ${ans}$$`
      };
    } else if (variant === 2) {
      const ans = a + 3 * b;
      return {
        calculator: "none",
        question: `Evalúa exactamente la expresión trigonométrica:\n$$E = ${a}\\tan(45^\\circ) + ${b}\\tan^2(60^\\circ)$$`,
        options: this.buildUniqueOptions(`${ans}`, [`${a + b}`, `${3 * a + b}`, `${a + 2 * b}`], (k) => `${ans + k * 2}`),
        explanation: `De los triángulos rectángulos notables obtenemos $\\tan(45^\\circ) = 1$ y $\\tan(60^\\circ) = \\sqrt{3}$. Elevando al cuadrado y sustituyendo: $$E = ${a}(1) + ${b}(\\sqrt{3})^2 = ${a} + ${b}(3) = ${a} + ${3 * b} = ${ans}$$`
      };
    }
    const ans = a + b;
    return {
      calculator: "none",
      question: `Simplifica el valor exacto de:\n$$E = ${2 * a}\\sin^2(45^\\circ) + ${b}\\cos(0^\\circ)$$`,
      options: this.buildUniqueOptions(`${ans}`, [`${2 * a + b}`, `${a}`, `${2 * (a + b)}`], (k) => `${ans + k}`),
      explanation: `En la circunferencia unitaria $\\sin(45^\\circ) = \\frac{\\sqrt{2}}{2} \\implies \\sin^2(45^\\circ) = \\frac{1}{2}$ y $\\cos(0^\\circ) = 1$. Sustituyendo directamente: $$E = ${2 * a}\\left(\\frac{1}{2}\\right) + ${b}(1) = ${a} + ${b} = ${ans}$$`
    };
  },

  trigAreaSeno() {
    const a = this.randInt(3, 24), b = this.randInt(3, 24), ang = this.randChoice([30, 60, 90, 120, 150]), ab = a * b;
    let den = 2, sfx = "", sVal = "1";
    if (ang === 30 || ang === 150) { den = 4; sVal = "\\frac{1}{2}"; }
    if (ang === 60 || ang === 120) { den = 4; sfx = "\\sqrt{3}"; sVal = "\\frac{\\sqrt{3}}{2}"; }
    const ans = `${this.formatFrac(ab, den)}${sfx}\\text{ cm}^2`;
    return {
      calculator: "none",
      question: `Calcula el área exacta de un triángulo cuyos dos lados miden $${a}\\text{ cm}$ y $${b}\\text{ cm}$, formando entre sí un ángulo de $${ang}^\\circ$:`,
      options: this.buildUniqueOptions(
        ans,
        [`${this.formatFrac(ab, 2)}${sfx}\\text{ cm}^2`, `${ab}\\text{ cm}^2`, `${this.formatFrac(ab, den === 4 ? 2 : 4)}\\text{ cm}^2`],
        (k) => `${this.formatFrac(ab + k * den, den)}${sfx}\\text{ cm}^2`
      ),
      explanation: `Por trigonometría métrica, la altura relativa al lado $b$ es $h = a\\sin C$, por lo que $A = \\frac{1}{2}ab\\sin C$. Dado que $\\sin(${ang}^\\circ) = ${sVal}$: $$A = \\frac{1}{2}(${a})(${b})\\left(${sVal}\\right) = ${ans}$$`
    };
  },

  geoanExtremoSimetrico() {
    const mx = this.randInt(-9, 9), my = this.randInt(-9, 9);
    const x1 = this.randInt(-9, 9), y1 = this.randInt(-9, 9);
    const bx = 2 * mx - x1, by = 2 * my - y1;
    if (bx === x1 && by === y1) return this.geoanExtremoSimetrico();
    return {
      calculator: "none",
      question: `El punto medio del segmento $AB$ es $M(${mx}, ${my})$. Si un extremo es $A(${x1}, ${y1})$, ¿cuáles son las coordenadas de $B$?`,
      options: this.buildUniqueOptions(`(${bx}, ${by})`, [`(${2 * x1 - mx}, ${2 * y1 - my})`, `(${mx + x1}, ${my + y1})`, `(${-bx}, ${-by})`], (k) => `(${bx + k}, ${by - k})`),
      explanation: `Por definición de punto medio $M = \\left(\\frac{x_A + x_B}{2},\\; \\frac{y_A + y_B}{2}\\right)$, despejamos cada coordenada de $B$: $$x_B = 2x_M - x_A = 2(${mx}) - (${x1}) = ${bx}$$ $$y_B = 2y_M - y_A = 2(${my}) - (${y1}) = ${by}$$ Luego $B = (${bx}, ${by})$. Verificación: $\\frac{${x1}+${bx}}{2} = ${mx}$.`
    };
  },

  funcEvaluacionPolinomio() {
    const a = this.randInt(2, 4), b = this.randNonZero(-6, 6), c = this.randNonZero(-8, 8), x0 = this.randNonZero(-4, 5);
    const val = a * x0 * x0 + b * x0 + c;
    return {
      calculator: "basic",
      question: `Dada la función cuadrática $f(x) = ${a}x^2 ${this.signTerm(b, "x")} ${this.signTerm(c)}$, calcula el valor de $f(${x0})$:`,
      options: this.buildUniqueOptions(`${val}`, [`${a * x0 * x0 - b * x0 + c}`, `${val + 2 * a}`, `${val - b * x0}`], (k) => `${val + k * 3}`),
      explanation: `Sustituimos $x = ${x0}$ respetando primero la potencia antes del coeficiente $${a}$: $$f(${x0}) = ${a}(${x0})^2 ${this.signTerm(b)}(${x0}) ${this.signTerm(c)} = ${a}(${x0 * x0}) ${this.signTerm(b * x0)} ${this.signTerm(c)}$$ Realizando la suma algebraica: $$f(${x0}) = ${a * x0 * x0} ${this.signTerm(b * x0)} ${this.signTerm(c)} = ${val}$$`
    };
  },

  funcTramos() {
    const c = this.randInt(-3, 4), m = this.randNonZero(-5, 5), b = this.randNonZero(-9, 9), d = this.randNonZero(-9, 9);
    const x0 = this.randChoice([c - this.randInt(1, 4), c + this.randInt(0, 4)]);
    const v1 = m * x0 + b, v2 = x0 * x0 + d;
    const first = x0 < c, ans = first ? v1 : v2, other = first ? v2 : v1;
    const ineqDesc = first
      ? `Como $${x0} \\lt ${c}$, el punto pertenece al subdominio de la primera rama`
      : `Como $${x0} \\ge ${c}$, el punto pertenece al subdominio de la segunda rama`;
    const exprEval = first
      ? `f(${x0}) = ${m}(${x0}) ${this.signTerm(b)} = ${m * x0} ${this.signTerm(b)} = ${ans}`
      : `f(${x0}) = (${x0})^2 ${this.signTerm(d)} = ${x0 * x0} ${this.signTerm(d)} = ${ans}`;
    return {
      calculator: "none",
      question: `Dada la función definida por tramos:\n$$f(x) = \\begin{cases} ${this.signTerm(m, "x", true)} ${this.signTerm(b)}, & x \\lt ${c} \\\\ x^2 ${this.signTerm(d)}, & x \\ge ${c} \\end{cases}$$\ncalcula el valor exacto de $f(${x0})$:`,
      options: this.buildUniqueOptions(`${ans}`, [`${other}`, `${v1 + v2}`, `${ans + (first ? 4 : -4)}`], (k) => `${ans + k * 2}`),
      explanation: `1) **Selección de rama**: evaluamos la condición del dominio en $x = ${x0}$. ${ineqDesc}, descartando la otra regla. 2) **Evaluación**: $$${exprEval}$$`
    };
  },

  // === 2. NUEVAS FÁBRICAS DE NIVEL LICENCIATURA / BACHILLERATO AVANZADO (7 RAMAS) ===

  // Aritmética / Teoría de Números (Licenciatura)
  ariCongruenciaLineal() {
    const mod = this.randChoice([7, 9, 11, 13, 17]);
    const a = this.randInt(2, mod - 2);
    const sol = this.randInt(1, mod - 1);
    const b = (a * sol) % mod;
    return {
      calculator: "none",
      question: `Encuentra el único entero $x \\in \\{0, 1, \\dots, ${mod - 1}\\}$ que satisface la congruencia lineal:\n$$${a}x \\equiv ${b} \\pmod{${mod}}$$`,
      options: this.buildUniqueOptions(`${sol}`, [`${(sol + 2) % mod}`, `${(mod - sol) % mod}`, `${(b % mod)}`], (k) => `${(sol + k + 3) % mod}`),
      explanation: `Como $\\gcd(${a}, ${mod}) = 1$, la congruencia tiene solución única módulo $${mod}$. Buscamos un representante $x$ en $\\{0,\\dots,${mod - 1}\\}$ tal que $${mod} \\mid (${a}x - ${b})$. Probando o multiplicando por el inverso modular de $${a} \\pmod{${mod}}$, comprobamos que $${a}(${sol}) = ${a * sol} = ${Math.floor((a * sol) / mod)}\\cdot ${mod} + ${b} \\equiv ${b} \\pmod{${mod}}$. Luego $x \\equiv ${sol} \\pmod{${mod}}$.`
    };
  },

  ariSucesionGeometricaInf() {
    const num = this.randChoice([1, 2, 3]);
    const den = num + this.randInt(1, 3);
    const k = this.randInt(2, 6);
    const a1 = k * (den - num);
    const S = k * den;
    return {
      calculator: "none",
      question: `Calcula la suma infinita de la serie geométrica convergente:\n$$S = ${a1} + ${a1}\\left(\\frac{${num}}{${den}}\\right) + ${a1}\\left(\\frac{${num}}{${den}}\\right)^2 + \\dots$$`,
      options: this.buildUniqueOptions(`${S}`, [`${a1 * den}`, `${Math.round(S / 2)}`, `${S + den}`], (step) => `${S + step * 3}`),
      explanation: `Identificamos el primer término $a_1 = ${a1}$ y la razón $r = \\frac{${num}}{${den}}$. Como $|r| = \\frac{${num}}{${den}} \\lt 1$, la serie converge a: $$S = \\frac{a_1}{1 - r} = \\frac{${a1}}{1 - \\frac{${num}}{${den}}} = \\frac{${a1}}{\\frac{${den - num}}{${den}}} = \\frac{${a1} \\cdot ${den}}{${den - num}} = ${S}$$`
    };
  },

  ariBinomioPascal() {
    const n = this.randInt(6, 10);
    const comb2 = (n * (n - 1)) / 2;
    const comb1 = n;
    const comb3 = (n * (n - 1) * (n - 2)) / 6;
    const ans = comb3;
    return {
      calculator: "none",
      question: `De un seminario de $${n}$ estudiantes de matemáticas se desea formar un comité de $3$ integrantes sin importar el orden. ¿Cuántos comités distintos pueden formarse?`,
      options: this.buildUniqueOptions(`${ans}`, [`${comb2}`, `${comb3 + comb1}`, `${n * (n - 1)}`], (k) => `${ans + k * 4}`),
      explanation: `Como el orden no importa, usamos combinaciones $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ con $n=${n}, k=3$: $$\\binom{${n}}{3} = \\frac{${n} \\cdot ${n - 1} \\cdot ${n - 2}}{3 \\cdot 2 \\cdot 1} = ${ans}$$`
    };
  },

  // Álgebra Superior (Licenciatura)
  algDiscriminanteParam() {
    // Queremos k^2 = 4*a*c cuadrado perfecto: usamos a = p^2, c = q^2 => k = 2pq
    const p = this.randInt(1, 3), q = this.randInt(2, 5);
    const aa = p * p, cc = q * q, kSol = 2 * p * q;
    return {
      calculator: "none",
      question: `¿Para qué valor positivo de $k \\gt 0$ la ecuación cuadrática $${aa === 1 ? "" : aa}x^2 + kx + ${cc} = 0$ posee una **única solución real** (raíz doble)?`,
      options: this.buildUniqueOptions(`k = ${kSol}`, [`k = ${p * q}`, `k = ${4 * aa * cc}`, `k = ${kSol + 2}`], (step) => `k = ${kSol + step * 3}`),
      explanation: `Una ecuación cuadrática $Ax^2+Bx+C=0$ tiene raíz doble cuando su discriminante es cero: $\\Delta = B^2 - 4AC = 0$. Sustituyendo $A=${aa}$, $B=k$ y $C=${cc}$: $$k^2 - 4(${aa})(${cc}) = 0 \\implies k^2 = ${4 * aa * cc}$$ Tomando la raíz positiva $k \\gt 0$: $$k = \\sqrt{${4 * aa * cc}} = ${kSol}$$`
    };
  },

  algVietaCuadrados() {
    const r1 = this.randNonZero(-5, 5);
    let r2 = this.randNonZero(-5, 5);
    if (r1 + r2 === 0) r2 = r1 === 1 ? 2 : 1;
    const b = -(r1 + r2);
    const c = r1 * r2;
    const sumSq = r1 * r1 + r2 * r2;
    return {
      calculator: "none",
      question: `Si $x_1$ y $x_2$ son las raíces de la ecuación $x^2 ${this.signTerm(b, "x")} ${this.signTerm(c)} = 0$, calcula el valor exacto de $x_1^2 + x_2^2$:`,
      options: this.buildUniqueOptions(`${sumSq}`, [`${b * b}`, `${b * b + 2 * c}`, `${Math.abs(r1 - r2)}`], (k) => `${sumSq + k * 2}`),
      explanation: `Por las relaciones de Vieta: $x_1 + x_2 = -(${b}) = ${-b}$ y $x_1 x_2 = ${c}$. Aplicando la identidad algebraica $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$: $$x_1^2 + x_2^2 = (${-b})^2 - 2(${c}) = ${b * b} ${this.signTerm(-2 * c)} = ${sumSq}$$`
    };
  },

  algInecuacionRacional() {
    const r1 = this.randInt(-5, 1);
    const r2 = this.randInt(r1 + 2, 7);
    const correct = `(-\\infty, ${r1}] \\cup (${r2}, \\infty)`;
    const wrong1 = `(-\\infty, ${r1}] \\cup [${r2}, \\infty)`;
    const wrong2 = `[${r1}, ${r2})`;
    const wrong3 = `(-\\infty, ${r1}) \\cup (${r2}, \\infty)`;
    return {
      calculator: "none",
      question: `Determina el conjunto solución de la inecuación racional:\n$$\\frac{x ${this.signTerm(-r1)}}{x ${this.signTerm(-r2)}} \\ge 0$$`,
      options: this.buildUniqueOptions(correct, [wrong1, wrong2, wrong3], (k) => `(-\\infty, ${r1 - k}] \\cup (${r2}, \\infty)`),
      explanation: `1) **Puntos críticos**: el numerador se anula en $x = ${r1}$ (incluido porque $\\ge 0$) y el denominador en $x = ${r2}$ (estrictamente excluido por restricción de dominio). 2) **Tabla de signos**: para $x \\lt ${r1}$ ambos factores son negativos ($-/- = +$); en $(${r1}, ${r2})$ los signos son opuestos ($+/- = -$); para $x \\gt ${r2}$ ambos son positivos ($+/+ = +$). Luego la solución es $${correct}$.`
    };
  },

  // Geometría Euclidiana (Licenciatura)
  geoHeronTriangulo() {
    // Triángulos heronianos clásicos escalados: (13,14,15)->84, (5,12,13)->30, (17,25,28)->210
    const base = this.randChoice([[13, 14, 15, 21, 84], [10, 17, 21, 24, 84], [4, 13, 15, 16, 24]]);
    const k = this.randInt(1, 2);
    const a = base[0] * k, b = base[1] * k, c = base[2] * k;
    const s = base[3] * k, area = base[4] * k * k;
    return {
      calculator: "basic",
      question: `Calcula el área exacta de un triángulo cuyos lados miden $a = ${a}\\text{ u}$, $b = ${b}\\text{ u}$ y $c = ${c}\\text{ u}$ utilizando la fórmula de Herón:`,
      options: this.buildUniqueOptions(`${area}\\text{ u}^2`, [`${area + 12}\\text{ u}^2`, `${s * k}\\text{ u}^2`, `${Math.round(area / 2)}\\text{ u}^2`], (step) => `${area + step * 6}\\text{ u}^2`),
      explanation: `Calculamos primero el semiperímetro: $$s = \\frac{${a} + ${b} + ${c}}{2} = ${s}$$ Aplicando la fórmula de Herón $A = \\sqrt{s(s-a)(s-b)(s-c)}$: $$A = \\sqrt{${s}(${s - a})(${s - b})(${s - c})} = \\sqrt{${area * area}} = ${area}\\text{ u}^2$$`
    };
  },

  geoPotenciaPuntoSecante() {
    // PA * PB = PC * PD desde punto exterior P
    const pa = this.randInt(2, 6), ab = this.randInt(3, 10), pb = pa + ab;
    const prod = pa * pb;
    const divisors = [];
    for (let d = 2; d <= prod / 2; d++) {
      if (prod % d === 0 && prod / d > d) divisors.push(d);
    }
    if (!divisors.length) return this.geoPotenciaPuntoSecante();
    const pc = this.randChoice(divisors);
    const pd = prod / pc;
    const cd = pd - pc;
    return {
      calculator: "none",
      question: `Desde un punto exterior $P$ se trazan dos secantes a una circunferencia: una corta en $A$ y $B$ ($PA = ${pa}$, $AB = ${ab}$) y la otra corta en $C$ y $D$ ($PC = ${pc}$). ¿Cuánto mide el segmento interior $CD$?`,
      options: this.buildUniqueOptions(`${cd}`, [`${pd}`, `${Math.abs(ab)}`, `${cd + pa}`], (k) => `${cd + k * 2}`),
      explanation: `Por el **Teorema de las Secantes (Potencia de un punto)**, se cumple $PA \\cdot PB = PC \\cdot PD$. Como $PB = PA + AB = ${pa} + ${ab} = ${pb}$: $$${pa}(${pb}) = ${pc} \\cdot PD \\implies PD = \\frac{${prod}}{${pc}} = ${pd}$$ Como $CD = PD - PC$, obtenemos $CD = ${pd} - ${pc} = ${cd}$.`
    };
  },

  geoCoronaCuerdaTangente() {
    const c = this.randInt(3, 12);
    const areaNum = c * c;
    return {
      calculator: "none",
      question: `En dos circunferencias concéntricas de radios $R \\gt r$, una cuerda de longitud $${2 * c}\\text{ cm}$ de la circunferencia exterior es tangente a la circunferencia interior. ¿Cuál es el área exacta de la corona circular?`,
      options: this.buildUniqueOptions(`${areaNum}\\pi\\text{ cm}^2`, [`${4 * areaNum}\\pi\\text{ cm}^2`, `${2 * c}\\pi\\text{ cm}^2`, `${areaNum + c}\\pi\\text{ cm}^2`], (k) => `${areaNum + k * 3}\\pi\\text{ cm}^2`),
      explanation: `El radio interior $r$ es perpendicular en el punto de tangencia y biseca la cuerda de longitud $2c = ${2 * c}$, generando un cateto de longitud $c = ${c}$ e hipotenusa $R$. Por Pitágoras, $R^2 - r^2 = c^2 = ${areaNum}$. Por lo tanto: $$A_{\\text{corona}} = \\pi(R^2 - r^2) = ${areaNum}\\pi\\text{ cm}^2$$`
    };
  },

  // Trigonometría Analítica (Licenciatura)
  trigAnguloDobleTan() {
    const p = this.randInt(1, 5), q = this.randInt(2, 6);
    if (p === q || this.gcd(p, q) > 1) return this.trigAnguloDobleTan();
    const askSin = this.randChoice([true, false]);
    const denom = p * p + q * q;
    const num = askSin ? 2 * p * q : q * q - p * p;
    const ans = this.formatFrac(num, denom);
    const fnName = askSin ? "\\sin(2\\theta)" : "\\cos(2\\theta)";
    const formulaDesc = askSin
      ? `\\sin(2\\theta) = \\frac{2\\tan\\theta}{1 + \\tan^2\\theta}`
      : `\\cos(2\\theta) = \\frac{1 - \\tan^2\\theta}{1 + \\tan^2\\theta}`;
    return {
      calculator: "none",
      question: `Si $\\tan(\\theta) = \\frac{${p}}{${q}}$, calcula exactamente el valor de $${fnName}$ usando identidades de ángulo doble:`,
      options: this.buildUniqueOptions(ans, [this.formatFrac(2 * p, q), this.formatFrac(p * p + q * q, denom), this.formatFrac(-num, denom)], (k) => this.formatFrac(num + k, denom)),
      explanation: `Empleamos la identidad racional del ángulo doble en función de la tangente: $$${formulaDesc}$$ Sustituyendo $\\tan\\theta = \\frac{${p}}{${q}}$ ($\\tan^2\\theta = \\frac{${p * p}}{${q * q}}$): $$${fnName} = ${askSin ? `\\frac{2(${p}/${q})}{1 + ${p * p}/${q * q}}` : `\\frac{1 - ${p * p}/${q * q}}{1 + ${p * p}/${q * q}}`} = ${ans}$$`
    };
  },

  trigEcuacionCuadraticaIntervalo() {
    // Resuelve 2*cos^2(x) - (2a+1)*cos(x) + a = 0 o 2*cos^2(x) + cos(x) - 1 = 0 en [0, 2pi)
    // Caso limpio: 2 sin^2(x) - sin(x) - 1 = 0 => (2 sin x + 1)(sin x - 1) = 0 => x in {pi/2, 7pi/6, 11pi/6} suma = 7pi/2
    // Variamos multiplicando por coeficiente k o eligiendo entre 2 formas exactas!
    const form = this.randChoice(["sin_neg", "cos_neg", "sin_pos"]);
    if (form === "sin_neg") {
      return {
        calculator: "none",
        question: `Determina la **suma** de todas las soluciones reales en $[0, 2\\pi)$ de la ecuación trigonométrica:\n$$2\\sin^2(x) - \\sin(x) - 1 = 0$$`,
        options: this.buildUniqueOptions(`\\frac{7\\pi}{2}`, [`\\frac{5\\pi}{2}`, `3\\pi`, `2\\pi`], (k) => `${k + 4}\\pi`),
        explanation: `Factorizamos como cuadrática en $u = \\sin(x)$: $2u^2 - u - 1 = (2u + 1)(u - 1) = 0$. 1) Si $\\sin(x) = 1$, en $[0,2\\pi)$ se obtiene $x = \\frac{\\pi}{2}$. 2) Si $\\sin(x) = -\\frac{1}{2}$, las soluciones en cuadrantes III y IV son $x = \\frac{7\\pi}{6}$ y $x = \\frac{11\\pi}{6}$. La suma total es $\\frac{\\pi}{2} + \\frac{7\\pi}{6} + \\frac{11\\pi}{6} = \\frac{21\\pi}{6} = \\frac{7\\pi}{2}$.`
      };
    }
    if (form === "cos_neg") {
      return {
        calculator: "none",
        question: `Calcula la **suma** de las soluciones en $[0, 2\\pi)$ de la ecuación:\n$$2\\cos^2(x) + \\cos(x) - 1 = 0$$`,
        options: this.buildUniqueOptions(`3\\pi`, [`2\\pi`, `\\frac{5\\pi}{3}`, `4\\pi`], (k) => `${k + 4}\\pi`),
        explanation: `Factorizando en $u = \\cos(x)$: $(2\\cos x - 1)(\\cos x + 1) = 0$. Para $\\cos(x) = \\frac{1}{2}$ en $[0,2\\pi)$ tenemos $x = \\frac{\\pi}{3}$ y $x = \\frac{5\\pi}{3}$; para $\\cos(x) = -1$ tenemos $x = \\pi$. Suma total: $\\frac{\\pi}{3} + \\frac{5\\pi}{3} + \\pi = 2\\pi + \\pi = 3\\pi$.`
      };
    }
    return {
      calculator: "none",
      question: `¿Cuántas soluciones distintas existen en el intervalo $[0, 2\\pi)$ para la ecuación $2\\sin^2(x) - 3\\sin(x) + 1 = 0$?`,
      options: this.buildUniqueOptions(`3`, [`2`, `4`, `1`], (k) => `${4 + k}`),
      explanation: `Factorizamos: $(2\\sin x - 1)(\\sin x - 1) = 0$. 1) $\\sin(x) = \\frac{1}{2}$ aporta $2$ soluciones ($\\frac{\\pi}{6}$ y $\\frac{5\\pi}{6}$). 2) $\\sin(x) = 1$ aporta $1$ solución ($\\frac{\\pi}{2}$). En total hay $3$ soluciones distintas en $[0, 2\\pi)$.`
    };
  },

  trigSumaAngulosPit() {
    const t1 = [3, 4, 5], t2 = this.randChoice([[5, 12, 13], [8, 15, 17]]);
    // sin a = 3/5, cos a = 4/5 ; sin b = t2[0]/t2[2], cos b = t2[1]/t2[2]
    const num = t1[0] * t2[1] + t1[1] * t2[0];
    const den = t1[2] * t2[2];
    const ans = this.formatFrac(num, den);
    return {
      calculator: "none",
      question: `Sean $\\alpha, \\beta \\in \\left(0, \\frac{\\pi}{2}\\right)$ tales que $\\sin(\\alpha) = \\frac{3}{5}$ y $\\cos(\\beta) = \\frac{${t2[1]}}{${t2[2]}}$. Halla el valor exacto de $\\sin(\\alpha + \\beta)$:`,
      options: this.buildUniqueOptions(ans, [this.formatFrac(t1[0] * t2[0] + t1[1] * t2[1], den), this.formatFrac(Math.abs(t1[0] * t2[1] - t1[1] * t2[0]), den), this.formatFrac(num, t2[2])], (k) => this.formatFrac(num + k, den)),
      explanation: `Como $\\alpha, \\beta$ están en el primer cuadrante, por identidad pitagórica $\\cos(\\alpha) = \\frac{4}{5}$ y $\\sin(\\beta) = \\frac{${t2[0]}}{${t2[2]}}$. Aplicando $\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta$: $$\\sin(\\alpha+\\beta) = \\left(\\frac{3}{5}\\right)\\left(\\frac{${t2[1]}}{${t2[2]}}\\right) + \\left(\\frac{4}{5}\\right)\\left(\\frac{${t2[0]}}{${t2[2]}}\\right) = ${ans}$$`
    };
  },

  // Geometría Analítica (Licenciatura)
  geoanTangenteCircunferencia() {
    const [dx, dy, r] = this.randChoice([[3, 4, 5], [4, 3, 5], [5, 12, 13]]);
    const h = this.randInt(-4, 4), k = this.randInt(-4, 4);
    const sx = this.randChoice([1, -1]), sy = this.randChoice([1, -1]);
    const vx = sx * dx, vy = sy * dy;
    const x0 = h + vx, y0 = k + vy;
    // Normal es (vx, vy), recta tangente: vx(x - h) + vy(y - k) = r^2 => pendiente m = -vx / vy
    const slope = this.formatFrac(-vx, vy);
    const cRight = vx * x0 + vy * y0;
    return {
      calculator: "none",
      question: `Encuentra la pendiente de la recta tangente a la circunferencia $(x ${this.signTerm(-h)})^2 + (y ${this.signTerm(-k)})^2 = ${r * r}$ en el punto $P(${x0}, ${y0})$:`,
      options: this.buildUniqueOptions(slope, [this.formatFrac(vy, vx), this.formatFrac(vx, vy), this.formatFrac(-vy, vx)], (step) => this.formatFrac(-vx + step, vy)),
      explanation: `El centro es $C(${h}, ${k})$. El radio vector de $C$ a $P$ tiene pendiente $m_r = \\frac{${y0} - (${k})}{${x0} - (${h})} = \\frac{${vy}}{${vx}}$. Como la tangente es perpendicular al radio en el punto de contacto ($m_t \\cdot m_r = -1$), su pendiente es $m_t = ${slope}$. Verificación implícita: $${vx}(${x0}) + ${vy}(${y0}) = ${cRight}$.`
    };
  },

  geoanExcentricidadElipse() {
    const [b, c, a] = this.randChoice([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]);
    const A = b * b, B = a * a, C = A * B; // A x^2 + B y^2 = A B -> x^2/a^2? x^2/B + y^2/A = 1 => semi-eje mayor a=sqrt(B)
    const ecc = this.formatFrac(c, a);
    return {
      calculator: "none",
      question: `Halla la excentricidad exacta $e$ de la elipse definida por:\n$$${A}x^2 + ${B}y^2 = ${C}$$`,
      options: this.buildUniqueOptions(ecc, [this.formatFrac(b, a), this.formatFrac(a, c), this.formatFrac(b, c)], (k) => this.formatFrac(c + k, a + 2)),
      explanation: `Dividimos entre $${C}$ para llevar a forma canónica: $$\\frac{x^2}{${B}} + \\frac{y^2}{${A}} = 1$$ Aquí el semieje mayor es $a = \\sqrt{${B}} = ${a}$ y el menor $b = \\sqrt{${A}} = ${b}$. La semidistancia focal es $c = \\sqrt{a^2 - b^2} = \\sqrt{${B} - ${A}} = ${c}$, de modo que $e = \\frac{c}{a} = ${ecc} \\lt 1$.`
    };
  },

  geoanAsintotasHiperbola() {
    const a = this.randInt(2, 7), b = this.randInt(2, 7);
    if (this.gcd(a, b) > 1) return this.geoanAsintotasHiperbola();
    const h = this.randInt(-3, 3), k = this.randInt(-3, 3);
    const m = this.formatFrac(b, a);
    return {
      calculator: "none",
      question: `¿Cuál es la pendiente de las asíntotas oblicuas de la hipérbola:\n$$\\frac{(x ${this.signTerm(-h)})^2}{${a * a}} - \\frac{(y ${this.signTerm(-k)})^2}{${b * b}} = 1$$`,
      options: this.buildUniqueOptions(`\\pm ${m}`, [`\\pm ${this.formatFrac(a, b)}`, `\\pm ${this.formatFrac(b * b, a * a)}`, `\\pm 1`], (step) => `\\pm ${this.formatFrac(b + step, a)}`),
      explanation: `Para una hipérbola horizontal $\\frac{(x-h)^2}{a^2} - \\frac{(y-k)^2}{b^2} = 1$, igualando la forma homogénea a cero obtenemos las asíntotas $y - k = \\pm\\frac{b}{a}(x - h)$. Aquí $a = ${a}$ y $b = ${b}$, luego sus pendientes son $\\pm ${m}$.`
    };
  },

  // Funciones / Precálculo / Límites (Licenciatura)
  funcLimiteTrigNotable() {
    const k = this.randInt(2, 9), m = this.randInt(2, 9);
    if (k === m) return this.funcLimiteTrigNotable();
    const ans = this.formatFrac(k, m);
    return {
      calculator: "none",
      question: `Calcula el valor analítico exacto del límite notable:\n$$\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{\\tan(${m}x)}$$`,
      options: this.buildUniqueOptions(ans, [this.formatFrac(m, k), `${k * m}`, `1`], (step) => this.formatFrac(k + step, m)),
      explanation: `Reescribimos $\\tan(${m}x) = \\frac{\\sin(${m}x)}{\\cos(${m}x)}$ y dividimos numerador y denominador entre $x$ (para $x \\neq 0$): $$\\lim_{x \\to 0} \\frac{\\frac{\\sin(${k}x)}{${k}x} \\cdot ${k}}{\\frac{\\sin(${m}x)}{${m}x} \\cdot ${m}} \\cdot \\cos(${m}x) = \\frac{1 \\cdot ${k}}{1 \\cdot ${m}} \\cdot 1 = ${ans}$$`
    };
  },

  funcAsintotaOblicua() {
    const a = this.randInt(1, 4), r = this.randNonZero(-4, 4), b = this.randNonZero(-5, 5);
    const n = a * r + b;
    const rem = this.randNonZero(-6, 6);
    const B = n - a * r;
    const C = rem - n * r;
    const lineLatex = `y = ${a === 1 ? "" : a}x ${this.signTerm(n)}`.trim();
    return {
      calculator: "none",
      question: `Determina la ecuación de la **asíntota oblicua** de la función racional:\n$$f(x) = \\frac{${a === 1 ? "" : a}x^2 ${this.signTerm(B, "x")} ${this.signTerm(C)}}{x ${this.signTerm(-r)}}$$`,
      options: this.buildUniqueOptions(lineLatex, [`y = ${a === 1 ? "" : a}x ${this.signTerm(-n)}`, `y = ${a === 1 ? "" : a}x`, `y = ${r}x ${this.signTerm(n)}`], (k) => `y = ${a === 1 ? "" : a}x ${this.signTerm(n + k)}`),
      explanation: `Como el grado del numerador excede en $1$ al del denominador, efectuamos división algebraica o evaluamos $m = \\lim_{x\\to\\infty}\\frac{f(x)}{x} = ${a}$ y $n = \\lim_{x\\to\\infty}(f(x) - ${a}x)$: $$f(x) = ${a === 1 ? "" : a}x ${this.signTerm(n)} + \\frac{${rem}}{x ${this.signTerm(-r)}}$$ Cuando $x \\to \\pm\\infty$, el residuo tiende a $0$, por lo que la asíntota oblicua es $${lineLatex}$.`
    };
  },

  funcContinuidadParametro() {
    const r = this.randNonZero(-5, 6);
    const c = this.randInt(2, 5);
    const L = c * 2 * r;
    const d = this.randNonZero(-8, 8);
    // f(x) = c*(x^2 - r^2)/(x - r) si x != r, k*1 + d si x = r? mejor: k x + d evaluado en r: k*r + d = L => elegir L - d múltiplo de r
    const kSol = this.randNonZero(-5, 6);
    const bAlt = L - kSol * r;
    return {
      calculator: "none",
      question: `¿Qué valor debe tomar el parámetro $k$ para que la función sea **continua en toda la recta real** $\\mathbb{R}$?\n$$f(x) = \\begin{cases} \\dfrac{${c}(x^2 - ${r * r})}{x ${this.signTerm(-r)}}, & x \\neq ${r} \\\\[4pt] kx ${this.signTerm(bAlt)}, & x = ${r} \\end{cases}$$`,
      options: this.buildUniqueOptions(`k = ${kSol}`, [`k = ${L}`, `k = ${-kSol}`, `k = ${kSol + 2}`], (step) => `k = ${kSol + step * 3}`),
      explanation: `Para continuidad en $x = ${r}$ se exige $\\lim_{x \\to ${r}} f(x) = f(${r})$. Factorizando la diferencia de cuadrados para $x \\neq ${r}$: $$\\lim_{x \\to ${r}} \\frac{${c}(x ${this.signTerm(-r)})(x ${this.signTerm(r)})}{x ${this.signTerm(-r)}} = \\lim_{x \\to ${r}} ${c}(x ${this.signTerm(r)}) = ${c}(${2 * r}) = ${L}$$ Igualando con $f(${r}) = k(${r}) ${this.signTerm(bAlt)} = ${L}$ obtenemos $${r}k = ${L - bAlt} \\implies k = ${kSol}$.`
    };
  },

  // Cálculo Diferencial (Licenciatura)
  calcDerivadaImplicita() {
    const a = this.randInt(1, 3), b = this.randInt(1, 3), x0 = this.randNonZero(-2, 3), y0 = this.randNonZero(1, 3);
    // Curva: a x^2 + b x y + y^2 = C => (2a x + b y) + (b x + 2 y) y' = 0
    const C = a * x0 * x0 + b * x0 * y0 + y0 * y0;
    const num = -(2 * a * x0 + b * y0);
    const den = b * x0 + 2 * y0;
    if (den === 0) return this.calcDerivadaImplicita();
    const ans = this.formatFrac(num, den);
    return {
      calculator: "none",
      question: `Utilizando **derivación implícita**, halla la pendiente $\\frac{dy}{dx}$ de la curva $${a === 1 ? "" : a}x^2 + ${b === 1 ? "" : b}xy + y^2 = ${C}$ en el punto $(${x0}, ${y0})$:`,
      options: this.buildUniqueOptions(ans, [this.formatFrac(-num, den), this.formatFrac(den, num), this.formatFrac(2 * a * x0, 2 * y0)], (k) => this.formatFrac(num + k, den)),
      explanation: `Diferenciamos respecto a $x$ considerando $y = y(x)$ (aplicando regla del producto en $xy$): $$${2 * a}x + ${b}\\left(y + x\\frac{dy}{dx}\\right) + 2y\\frac{dy}{dx} = 0$$ Agrupamos $\\frac{dy}{dx}$: $$\\frac{dy}{dx} = -\\frac{${2 * a}x + ${b}y}{${b}x + 2y}$$ Evaluando en $(${x0}, ${y0})$: $\\left.\\frac{dy}{dx}\\right|_{(${x0},${y0})} = -\\frac{${2 * a * x0 + b * y0}}{${den}} = ${ans}$.`
    };
  },

  calcLHopitalExp() {
    const a = this.randInt(2, 6), b = this.randInt(1, 5);
    const num = a * a, den = 2 * b;
    const ans = this.formatFrac(num, den);
    return {
      calculator: "none",
      question: `Evalúa el siguiente límite aplicando la regla de L'Hôpital las veces necesarias:\n$$\\lim_{x \\to 0} \\frac{e^{${a}x} - 1 - ${a}x}{${b}x^2}$$`,
      options: this.buildUniqueOptions(ans, [this.formatFrac(a, b), this.formatFrac(a * a, b), `0`], (k) => this.formatFrac(num + k, den)),
      explanation: `Al evaluar en $x=0$ resulta $\\frac{e^0 - 1 - 0}{0} = \\frac{0}{0}$. Aplicamos L'Hôpital una vez: $$\\lim_{x \\to 0} \\frac{${a}e^{${a}x} - ${a}}{${2 * b}x} \\quad \\left(\\text{aún } \\frac{0}{0}\\right)$$ Aplicamos L'Hôpital una segunda vez: $$\\lim_{x \\to 0} \\frac{${a * a}e^{${a}x}}{${2 * b}} = \\frac{${num}}{${den}} = ${ans}$$`
    };
  },

  calcTaylorOrden2() {
    const a = this.randInt(2, 6);
    const a2 = a * a;
    const c2 = this.formatFrac(a2, 2);
    const poly = `1 + ${a}x + ${c2}x^2`;
    return {
      calculator: "none",
      question: `Determina el polinomio de Maclaurin de segundo grado $P_2(x)$ centrado en $x = 0$ para la función $f(x) = e^{${a}x}$:`,
      options: this.buildUniqueOptions(
        poly,
        [`1 + ${a}x + ${a2}x^2`, `1 + ${a}x - ${c2}x^2`, `1 + ${a2}x + ${c2}x^2`],
        (k) => `1 + ${a + k}x + ${c2}x^2`
      ),
      explanation: `Usamos $P_2(x) = f(0) + f'(0)x + \\frac{f''(0)}{2!}x^2$. Calculamos derivadas en $0$: $f(0) = e^0 = 1$, $f'(x) = ${a}e^{${a}x} \\Rightarrow f'(0) = ${a}$, y $f''(x) = ${a2}e^{${a}x} \\Rightarrow f''(0) = ${a2}$. Dividiendo entre $2! = 2$: $$P_2(x) = ${poly}$$`
    };
  },

  // === 3. RAMA 8: CÁLCULO INTEGRAL Y SERIES (9 FÁBRICAS) ===
  intPolinomioDefinido() {
    const a = this.randInt(1, 4), c = this.randInt(1, 5), d = this.randInt(1, 6), bLim = this.randInt(1, 4);
    const val = a * bLim * bLim * bLim + c * bLim * bLim + d * bLim;
    return {
      calculator: "none",
      question: `Evalúa exactamente la integral definida aplicando el Teorema Fundamental del Cálculo:\n$$\\int_{0}^{${bLim}} \\left(${3 * a}x^2 + ${2 * c}x + ${d}\\right)\\,dx$$`,
      options: this.buildUniqueOptions(`${val}`, [`${3 * a * bLim * bLim + 2 * c * bLim + d}`, `${val + bLim}`, `${val - d * bLim}`], (k) => `${val + k * 3}`),
      explanation: `Encontramos una primitiva antiderivada: $F(x) = ${a === 1 ? "" : a}x^3 + ${c === 1 ? "" : c}x^2 + ${d}x$. Evaluando $F(${bLim}) - F(0)$: $$\\left[${a === 1 ? "" : a}x^3 + ${c === 1 ? "" : c}x^2 + ${d}x\\right]_0^{${bLim}} = ${a}(${bLim})^3 + ${c}(${bLim})^2 + ${d}(${bLim}) - 0 = ${val}$$`
    };
  },

  intPotenciaLinealDef() {
    const a = this.randInt(2, 5), b = this.randInt(1, 3), n = this.randInt(2, 4);
    // Evaluamos integral de 0 a 1 de a*(a*x + b)^n * a? Usemos integrando con factor exacto: \int_0^1 (n+1)a (a x + b)^n dx = (a+b)^{n+1} - b^{n+1}
    const coef = (n + 1) * a;
    const ans = Math.pow(a + b, n + 1) - Math.pow(b, n + 1);
    return {
      calculator: "basic",
      question: `Calcula el valor exacto de la integral definida mediante sustitución lineal $u = ${a}x + ${b}$:\n$$\\int_{0}^{1} ${coef}(${a}x + ${b})^{${n}}\\,dx$$`,
      options: this.buildUniqueOptions(`${ans}`, [`${Math.pow(a + b, n + 1)}`, `${Math.round(ans / a)}`, `${ans + Math.pow(b, n + 1)}`], (k) => `${ans + k * 7}`),
      explanation: `Haciendo $u = ${a}x + ${b}$, tenemos $du = ${a}\\,dx$. Cuando $x=0, u=${b}$; cuando $x=1, u=${a + b}$: $$\\int_{${b}}^{${a + b}} ${n + 1}u^{${n}}\\,du = \\left[u^{${n + 1}}\\right]_{${b}}^{${a + b}} = (${a + b})^{${n + 1}} - ${b}^{${n + 1}} = ${ans}$$`
    };
  },

  intExponencialDefinida() {
    const m = this.randInt(2, 4), k = this.randInt(2, 4), a = m * this.randInt(1, 3);
    const ratio = a / m;
    const pot = Math.pow(k, m);
    const ans = ratio * (pot - 1);
    return {
      calculator: "none",
      question: `Determina el valor exacto simplificado de la integral exponencial:\n$$\\int_{0}^{\\ln(${k})} ${a}e^{${m}x}\\,dx$$`,
      options: this.buildUniqueOptions(`${ans}`, [`${ratio * pot}`, `${a * (pot - 1)}`, `${ans + ratio}`], (step) => `${ans + step * 2}`),
      explanation: `La antiderivada de $${a}e^{${m}x}$ es $\\frac{${a}}{${m}}e^{${m}x} = ${ratio === 1 ? "" : ratio}e^{${m}x}$. Evaluando en los límites y recordando $e^{${m}\\ln(${k})} = e^{\\ln(${k}^{${m}})} = ${pot}$: $$${ratio}\\left(e^{${m}\\ln(${k})} - e^0\\right) = ${ratio}(${pot} - 1) = ${ans}$$`
    };
  },

  intSustitucionCuadratica() {
    const b = this.randInt(1, 3), c = this.randInt(1, 4), n = this.randInt(2, 3);
    const coef = 2 * (n + 1);
    const upper = b * b + c;
    const ans = Math.pow(upper, n + 1) - Math.pow(c, n + 1);
    return {
      calculator: "basic",
      question: `Mediante un cambio de variable adecuado, evalúa la integral:\n$$\\int_{0}^{${b}} ${coef}x(x^2 + ${c})^{${n}}\\,dx$$`,
      options: this.buildUniqueOptions(`${ans}`, [`${Math.pow(upper, n + 1)}`, `${2 * ans}`, `${ans - Math.pow(c, n)}`], (k) => `${ans + k * 5}`),
      explanation: `Sea $u = x^2 + ${c}$, entonces $du = 2x\\,dx$. Cambiamos límites: si $x=0 \\Rightarrow u=${c}$, si $x=${b} \\Rightarrow u=${upper}$. La integral se transforma en: $$\\int_{${c}}^{${upper}} ${n + 1}u^{${n}}\\,du = \\left[u^{${n + 1}}\\right]_{${c}}^{${upper}} = ${upper}^{${n + 1}} - ${c}^{${n + 1}} = ${ans}$$`
    };
  },

  intTrigDefinida() {
    const k = this.randInt(2, 6), a = k * this.randInt(1, 5);
    const isSin = this.randChoice([true, false]);
    if (isSin) {
      // \int_0^{\pi/k} a sin(kx) dx = [ -a/k cos(kx) ]_0^{\pi/k} = (a/k)(1 - (-1)) = 2a/k
      const ans = (2 * a) / k;
      return {
        calculator: "none",
        question: `Calcula el valor exacto de la integral trigonométrica definida:\n$$\\int_{0}^{\\frac{\\pi}{${k}}} ${a}\\sin(${k}x)\\,dx$$`,
        options: this.buildUniqueOptions(`${ans}`, [`${a / k}`, `0`, `${2 * a}`], (step) => `${ans + step}`),
        explanation: `Una primitiva de $${a}\\sin(${k}x)$ es $-\\frac{${a}}{${k}}\\cos(${k}x) = -${a / k === 1 ? "" : a / k}\\cos(${k}x)$. Evaluando de $0$ a $\\frac{\\pi}{${k}}$: $$-${a / k}(\\cos(\\pi) - \\cos(0)) = -${a / k}(-1 - 1) = ${ans}$$`
      };
    }
    // \int_0^{\pi/(2k)} a cos(kx) dx = a/k (sin(pi/2) - 0) = a/k
    const ans = a / k;
    return {
      calculator: "none",
      question: `Calcula el valor exacto de la integral definida:\n$$\\int_{0}^{\\frac{\\pi}{${2 * k}}} ${a}\\cos(${k}x)\\,dx$$`,
      options: this.buildUniqueOptions(`${ans}`, [`${2 * ans}`, `${a}`, `0`], (step) => `${ans + step}`),
      explanation: `Integrando con $u = ${k}x$: $\\int ${a}\\cos(${k}x)\\,dx = \\frac{${a}}{${k}}\\sin(${k}x) + C$. Evaluando entre $0$ y $\\frac{\\pi}{${2 * k}}$: $$${ans}\\left(\\sin\\left(\\frac{\\pi}{2}\\right) - \\sin(0)\\right) = ${ans}(1 - 0) = ${ans}$$`
    };
  },

  intAreaEntreCurvas() {
    const kVal = this.randChoice([2, 3, 4, 5, 6]);
    const ans = this.formatFrac(kVal * kVal * kVal, 6);
    return {
      calculator: "none",
      question: `Calcula el área exacta de la región plana acotada entre las curvas $y = ${kVal}x$ y $y = x^2$:`,
      options: this.buildUniqueOptions(`${ans}\\text{ u}^2`, [`${this.formatFrac(kVal * kVal * kVal, 3)}\\text{ u}^2`, `${this.formatFrac(kVal * kVal * kVal, 2)}\\text{ u}^2`, `${kVal * kVal}\\text{ u}^2`], (step) => `${this.formatFrac(kVal * kVal * kVal + step, 6)}\\text{ u}^2`),
      explanation: `1) **Intersecciones**: igualamos $x^2 = ${kVal}x \\Rightarrow x(x-${kVal})=0$, dando $x=0$ y $x=${kVal}$. En $[0,${kVal}]$, la recta $${kVal}x$ está por encima de $x^2$. 2) **Integral de área**: $$A = \\int_0^{${kVal}} (${kVal}x - x^2)\\,dx = \\left[\\frac{${kVal}x^2}{2} - \\frac{x^3}{3}\\right]_0^{${kVal}} = \\frac{${kVal}^3}{2} - \\frac{${kVal}^3}{3} = \\frac{${kVal * kVal * kVal}}{6} = ${ans}\\text{ u}^2$$`
    };
  },

  intPorPartesDefinida() {
    // \int_0^1 x e^x dx = 1  (famosísima); generalizada: \int_0^1 a^2 x e^{a x} dx = [(a x - 1) e^{a x}]_0^1 = (a-1)e^a + 1
    const a = this.randInt(1, 3);
    const coef = a * a;
    const ans = a === 1 ? "1" : `${a === 2 ? "" : a - 1 + ""}e^{${a}} + 1`;
    const ansLatex = a === 1 ? "1" : `${a - 1 === 1 ? "" : a - 1}e^{${a}} + 1`;
    return {
      calculator: "none",
      question: `Utilizando **integración por partes** ($\\int u\\,dv = uv - \\int v\\,du$), evalúa la integral:\n$$\\int_{0}^{1} ${coef === 1 ? "" : coef}x\\,e^{${a === 1 ? "" : a}x}\\,dx$$`,
      options: this.buildUniqueOptions(
        ansLatex,
        [`e^{${a}} - 1`, `${a}e^{${a}} + 1`, `${a + 1}e^{${a}}`],
        (k) => `${ansLatex} + ${k}`
      ),
      explanation: `Elegimos $u = ${coef === 1 ? "" : coef}x$ ($du = ${coef}\\,dx$) y $dv = e^{${a === 1 ? "" : a}x}\\,dx$ ($v = \\frac{1}{${a}}e^{${a === 1 ? "" : a}x}$). Aplicando partes: $$F(x) = ${a === 1 ? "" : a}x e^{${a === 1 ? "" : a}x} - \\int ${a === 1 ? "" : a}e^{${a === 1 ? "" : a}x}\\,dx = (${a === 1 ? "" : a}x - 1)e^{${a === 1 ? "" : a}x}$$ Evaluando de $0$ a $1$: $F(1) - F(0) = ${a === 1 ? "0 - (-1) = 1" : `(${a - 1}e^{${a}}) - (-1) = ${ansLatex}`}$.`
    };
  },

  intSolidoRevolucionDisco() {
    // Rotar y = k * sqrt(x) en [0, a] respecto al eje x => V = pi \int_0^a k^2 x dx = pi k^2 a^2 / 2
    const k = this.randInt(1, 4), a = this.randInt(2, 6);
    const num = k * k * a * a;
    const ans = `${this.formatFrac(num, 2)}\\pi\\text{ u}^3`;
    return {
      calculator: "none",
      question: `Por el método de los discos, calcula el volumen del sólido de revolución generado al girar la curva $y = ${k === 1 ? "" : k}\\sqrt{x}$ en el intervalo $[0, ${a}]$ alrededor del eje $x$:`,
      options: this.buildUniqueOptions(ans, [`${num}\\pi\\text{ u}^3`, `${this.formatFrac(num, 3)}\\pi\\text{ u}^3`, `${this.formatFrac(k * a * a, 2)}\\pi\\text{ u}^3`], (step) => `${this.formatFrac(num + step * 2, 2)}\\pi\\text{ u}^3`),
      explanation: `El volumen por discos circulares perpendiculares al eje $x$ es $V = \\pi\\int_a^b [f(x)]^2\\,dx$. Elevando $f(x) = ${k === 1 ? "" : k}\\sqrt{x}$ al cuadrado obtenemos $${k * k}x$: $$V = \\pi \\int_{0}^{${a}} ${k * k === 1 ? "" : k * k}x\\,dx = \\pi \\left[${this.formatFrac(k * k, 2)}x^2\\right]_0^{${a}} = ${ans}$$`
    };
  },

  intSerieGeometricaImpropia() {
    // Integral impropia \int_1^\infty k / x^p dx = k / (p - 1)
    const p = this.randInt(2, 5);
    const c = this.randInt(1, 6);
    const k = c * (p - 1);
    return {
      calculator: "none",
      question: `Analiza la convergencia y calcula el valor exacto de la integral impropia:\n$$\\int_{1}^{\\infty} \\frac{${k}}{x^{${p}}}\\,dx$$`,
      options: this.buildUniqueOptions(`${c}`, [`\\text{Diverge a } +\\infty`, `${k}`, `${this.formatFrac(k, p + 1)}`], (step) => `${c + step}`),
      explanation: `Como el exponente $p = ${p} \\gt 1$, la integral impropia converge. Expresamos mediante el límite cuando $b \\to \\infty$: $$\\lim_{b \\to \\infty} \\int_1^b ${k}x^{-${p}}\\,dx = \\lim_{b \\to \\infty} \\left[-\\frac{${k}}{${p - 1}\\,x^{${p - 1}}}\\right]_1^b = \\lim_{b \\to \\infty} \\left(-\\frac{${c}}{b^{${p - 1}}} + ${c}\\right) = 0 + ${c} = ${c}$$`
    };
  },

  // === 4. RAMA 9: ÁLGEBRA LINEAL Y EDO (9 FÁBRICAS) ===
  linDet2x2() {
    const a = this.randNonZero(-5, 6), b = this.randNonZero(-5, 6), c = this.randNonZero(-5, 6), d = this.randNonZero(-5, 6);
    const det = a * d - b * c;
    return {
      calculator: "none",
      question: `Calcula el determinante de la matriz $A \\in M_{2\\times 2}(\\mathbb{R})$:\n$$A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$$`,
      options: this.buildUniqueOptions(`${det}`, [`${a * d + b * c}`, `${b * c - a * d}`, `${a * c - b * d}`], (k) => `${det + k * 2}`),
      explanation: `Para una matriz $2\\times 2$, $\\det(A) = a_{11}a_{22} - a_{12}a_{21}$. Sustituyendo: $$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} ${this.signTerm(-b * c)} = ${det}$$`
    };
  },

  linProductoPuntoParam() {
    const u1 = this.randNonZero(-4, 4), u2 = this.randChoice([1, 2, -2, 3]), u3 = this.randNonZero(-4, 4);
    const v1 = this.randNonZero(-4, 4), kSol = this.randNonZero(-5, 5);
    const rhs = -(u1 * v1 + u2 * kSol);
    if (rhs % u3 !== 0) return this.linProductoPuntoParam();
    const v3 = rhs / u3;
    return {
      calculator: "none",
      question: `Determina el valor del parámetro $k$ para que los vectores $\\mathbf{u} = (${u1},\\; ${u2},\\; ${u3})$ y $\\mathbf{v} = (${v1},\\; k,\\; ${v3})$ en $\\mathbb{R}^3$ sean **ortogonales**:`,
      options: this.buildUniqueOptions(`k = ${kSol}`, [`k = ${-kSol}`, `k = ${kSol + 2}`, `k = ${u1 * v1 + u3 * v3}`], (step) => `k = ${kSol + step * 3}`),
      explanation: `Dos vectores no nulos en $\\mathbb{R}^3$ son ortogonales si y solo si su producto escalar es cero ($\\mathbf{u} \\cdot \\mathbf{v} = 0$): $$(${u1})(${v1}) + (${u2})k + (${u3})(${v3}) = 0 \\implies ${u1 * v1 + u3 * v3} + ${u2}k = 0$$ Despejando $k$: $k = \\frac{${-(u1 * v1 + u3 * v3)}}{${u2}} = ${kSol}$.`
    };
  },

  linNormaProductoMatriz() {
    // Multiplicación matriz-vector y norma o traza + det: elegimos A*v y pedimos el vector resultante en R^2
    const a = this.randNonZero(-4, 4), b = this.randNonZero(-4, 4);
    const c = this.randNonZero(-4, 4), d = this.randNonZero(-4, 4);
    const x = this.randNonZero(-3, 4), y = this.randNonZero(-3, 4);
    const r1 = a * x + b * y, r2 = c * x + d * y;
    const ans = `\\begin{pmatrix} ${r1} \\\\ ${r2} \\end{pmatrix}`;
    return {
      calculator: "none",
      question: `Calcula el producto matriz-vector $A\\mathbf{x}$ dado:\n$$A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}, \\qquad \\mathbf{x} = \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$$`,
      options: this.buildUniqueOptions(
        ans,
        [`\\begin{pmatrix} ${r2} \\\\ ${r1} \\end{pmatrix}`, `\\begin{pmatrix} ${a * x + c * y} \\\\ ${b * x + d * y} \\end{pmatrix}`, `\\begin{pmatrix} ${r1 + 1} \\\\ ${r2 - 1} \\end{pmatrix}`],
        (k) => `\\begin{pmatrix} ${r1 + k} \\\\ ${r2 + k} \\end{pmatrix}`
      ),
      explanation: `Cada entrada de $A\\mathbf{x}$ es el producto punto de la fila correspondiente de $A$ por $\\mathbf{x}$: $$\\text{Fila } 1: (${a})(${x}) + (${b})(${y}) = ${r1}$$ $$\\text{Fila } 2: (${c})(${x}) + (${d})(${y}) = ${r2}$$ Resultando el vector columna $${ans}$.`
    };
  },

  linInversa2x2Entrada() {
    // Construimos matriz unimodular det = 1: [[1, n], [0, 1]] conjugada o [[a, b], [c, d]] con ad-bc=1
    // Generador fácil de ad - bc = 1: d = 1, b = p, c = q => a = p*q + 1 (tomamos a, d no nulos pequeños)
    const p = this.randNonZero(-3, 3), q = this.randNonZero(-3, 3);
    const k = this.randChoice([1, -1]);
    // Sea matrix [[p*q + k, p], [q, 1]] => det = pq + k - pq = k in {1, -1}
    const a = p * q + k, b = p, c = q, d = 1;
    const inv11 = d * k, inv12 = -b * k, inv21 = -c * k, inv22 = a * k;
    const invTex = `\\begin{pmatrix} ${inv11} & ${inv12} \\\\ ${inv21} & ${inv22} \\end{pmatrix}`;
    return {
      calculator: "none",
      question: `Calcula la matriz inversa $A^{-1}$ de:\n$$A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$$`,
      options: this.buildUniqueOptions(
        invTex,
        [
          `\\begin{pmatrix} ${d} & ${b} \\\\ ${c} & ${a} \\end{pmatrix}`,
          `\\begin{pmatrix} ${-inv11} & ${-inv12} \\\\ ${-inv21} & ${-inv22} \\end{pmatrix}`,
          `\\begin{pmatrix} ${inv11} & ${inv21} \\\\ ${inv12} & ${inv22} \\end{pmatrix}`
        ],
        (step) => `\\begin{pmatrix} ${inv11 + step} & ${inv12} \\\\ ${inv21} & ${inv22} \\end{pmatrix}`
      ),
      explanation: `Primero calculamos $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${k} \\neq 0$, luego $A$ es invertible. Aplicamos la fórmula $A^{-1} = \\frac{1}{\\det(A)}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$: $$A^{-1} = ${k === 1 ? "" : "-"}\\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix} = ${invTex}$$`
    };
  },

  linDet3x3Cofactores() {
    // Matriz 3x3 con un cero estratégico en fila 1 para cofactores claros y rápidos
    const a11 = this.randNonZero(-3, 4), a12 = this.randNonZero(-3, 4);
    const a21 = this.randNonZero(-3, 4), a22 = this.randNonZero(-3, 4), a23 = this.randNonZero(-3, 4);
    const a31 = this.randNonZero(-3, 4), a32 = this.randNonZero(-3, 4), a33 = this.randNonZero(-3, 4);
    const c11 = a22 * a33 - a23 * a32;
    const c12 = a21 * a33 - a23 * a31;
    const det = a11 * c11 - a12 * c12;
    return {
      calculator: "none",
      question: `Evalúa el determinante $3\\times 3$ expandiendo por cofactores a lo largo de la primera fila:\n$$\\det(M) = \\begin{vmatrix} ${a11} & ${a12} & 0 \\\\ ${a21} & ${a22} & ${a23} \\\\ ${a31} & ${a32} & ${a33} \\end{vmatrix}$$`,
      options: this.buildUniqueOptions(`${det}`, [`${a11 * c11 + a12 * c12}`, `${-det}`, `${det + a11}`], (k) => `${det + k * 2}`),
      explanation: `Expandiendo por la fila $1$ (aprovechando $m_{13}=0$): $$\\det(M) = ${a11}\\begin{vmatrix} ${a22} & ${a23} \\\\ ${a32} & ${a33} \\end{vmatrix} - (${a12})\\begin{vmatrix} ${a21} & ${a23} \\\\ ${a31} & ${a33} \\end{vmatrix} = ${a11}(${c11}) - (${a12})(${c12}) = ${det}$$`
    };
  },

  edoSeparablePVI() {
    const k = this.randInt(2, 5), p = this.randChoice([1, 2]), y0 = this.randInt(2, 7);
    // dy/dx = k*(p+1) x^p y => ln|y| = k x^{p+1} + C => y = y0 e^{k x^{p+1}}
    const coef = k * (p + 1);
    const powTex = p === 1 ? "x" : `x^{${p}}`;
    const expTex = `x^{${p + 1}}`;
    const ans = `y(x) = ${y0}e^{${k}${expTex}}`;
    return {
      calculator: "none",
      question: `Resuelve el problema de valor inicial separable:\n$$\\frac{dy}{dx} = ${coef}${powTex}\\,y, \\qquad y(0) = ${y0}$$`,
      options: this.buildUniqueOptions(
        ans,
        [`y(x) = ${y0}e^{${coef}${expTex}}`, `y(x) = e^{${k}${expTex}} + ${y0}`, `y(x) = ${y0}e^{-${k}${expTex}}`],
        (step) => `y(x) = ${y0 + step}e^{${k}${expTex}}`
      ),
      explanation: `Separamos variables e integramos: $$\\int \\frac{dy}{y} = \\int ${coef}${powTex}\\,dx \\implies \\ln|y| = ${k}${expTex} + C \\implies y(x) = C_1 e^{${k}${expTex}}$$ Imponemos la condición inicial $y(0) = C_1 e^0 = C_1 = ${y0}$. Así, $${ans}$.`
    };
  },

  linEigenvalores2x2() {
    // Matriz triangular o 2x2 construida: P = [[1, q], [0, 1]] => A = P diag(l1, l2) P^{-1} = [[l1, q(l2-l1)], [0, l2]] o con traza/det simétrica [[a,b],[b,d]]
    // Mejor aún: matriz simétrica o general no triangular con entradas limpias!
    // Tomamos v1=(1,1), v2=(1,-1) => A = 1/2 [[l1+l2, l1-l2], [l1-l2, l1+l2]] (enteros si l1,l2 misma paridad!)
    const l1 = this.randInt(-4, 5);
    let l2 = this.randInt(-4, 5);
    if (l1 === l2 || Math.abs(l1 + l2) % 2 !== 0) l2 = l1 + this.randChoice([2, 4, -2]);
    const diag = (l1 + l2) / 2, off = (l1 - l2) / 2;
    const minL = Math.min(l1, l2), maxL = Math.max(l1, l2);
    const ans = `\\lambda_1 = ${minL},\\; \\lambda_2 = ${maxL}`;
    return {
      calculator: "none",
      question: `Calcula los **valores propios (eigenvalores)** reales de la matriz simétrica:\n$$A = \\begin{pmatrix} ${diag} & ${off} \\\\ ${off} & ${diag} \\end{pmatrix}$$`,
      options: this.buildUniqueOptions(
        ans,
        [`\\lambda_1 = ${-maxL},\\; \\lambda_2 = ${-minL}`, `\\lambda_1 = ${diag},\\; \\lambda_2 = ${off}`, `\\lambda_1 = ${minL - 1},\\; \\lambda_2 = ${maxL + 1}`],
        (k) => `\\lambda_1 = ${minL + k},\\; \\lambda_2 = ${maxL + k}`
      ),
      explanation: `Resolvemos el polinomio característico $\\det(A - \\lambda I) = 0$: $$(${diag} - \\lambda)^2 - (${off})^2 = \\lambda^2 ${this.signTerm(-(l1 + l2), "\\lambda")} ${this.signTerm(l1 * l2)} = (\\lambda ${this.signTerm(-minL)})(\\lambda ${this.signTerm(-maxL)}) = 0$$ Por lo tanto, los eigenvalores son $${ans}$ (comprobación: traza $= ${diag + diag} = ${minL + maxL}$ y $\\det(A) = ${minL * maxL}$).`
    };
  },

  edoLinealPrimerOrden() {
    // y' + a y = a * b, y(0) = y0 => solución estacionaria b + (y0 - b) e^{-a x}
    const a = this.randInt(2, 5), b = this.randInt(1, 6), y0 = b + this.randNonZero(-4, 4);
    const diff = y0 - b;
    const rhs = a * b;
    const ans = `y(x) = ${b} ${this.signTerm(diff)}e^{-${a}x}`;
    return {
      calculator: "none",
      question: `Encuentra la solución particular del problema de valor inicial lineal de primer orden:\n$$y' + ${a}y = ${rhs}, \\qquad y(0) = ${y0}$$`,
      options: this.buildUniqueOptions(
        ans,
        [`y(x) = ${b} ${this.signTerm(diff)}e^{${a}x}`, `y(x) = ${rhs} ${this.signTerm(y0 - rhs)}e^{-${a}x}`, `y(x) = ${b} ${this.signTerm(y0)}e^{-${a}x}`],
        (k) => `y(x) = ${b + k} ${this.signTerm(diff - k)}e^{-${a}x}`
      ),
      explanation: `El factor integrante es $\\mu(x) = e^{\\int ${a}\\,dx} = e^{${a}x}$. Multiplicando la EDO: $$\\frac{d}{dx}\\left(y\\,e^{${a}x}\\right) = ${rhs}e^{${a}x} \\implies y\\,e^{${a}x} = ${b}e^{${a}x} + C \\implies y(x) = ${b} + Ce^{-${a}x}$$ Con $y(0) = ${b} + C = ${y0}$, resulta $C = ${diff}$, por tanto $${ans}$.`
    };
  },

  edoSegundoOrdenHomog() {
    const r1 = this.randNonZero(-4, 4);
    let r2 = this.randNonZero(-4, 4);
    if (r1 === r2) r2 = r1 === 1 ? -2 : -r1;
    const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
    const p = -(lo + hi), q = lo * hi;
    const ans = `y(x) = C_1 e^{${lo === 1 ? "" : lo === -1 ? "-" : lo}x} + C_2 e^{${hi === 1 ? "" : hi === -1 ? "-" : hi}x}`;
    return {
      calculator: "none",
      question: `Halla la solución general de la ecuación diferencial lineal homogénea de segundo orden:\n$$y'' ${this.signTerm(p, "y'")} ${this.signTerm(q, "y")} = 0$$`,
      options: this.buildUniqueOptions(
        ans,
        [
          `y(x) = C_1 e^{${-lo === 1 ? "" : -lo === -1 ? "-" : -lo}x} + C_2 e^{${-hi === 1 ? "" : -hi === -1 ? "-" : -hi}x}`,
          `y(x) = (C_1 + C_2 x)e^{${lo === 1 ? "" : lo === -1 ? "-" : lo}x}`,
          `y(x) = C_1 \\cos(${Math.abs(lo)}x) + C_2 \\sin(${Math.abs(hi)}x)`
        ],
        (k) => `y(x) = C_1 e^{${lo + k}x} + C_2 e^{${hi}x}`
      ),
      explanation: `Proponemos $y = e^{rx}$ y obtenemos la ecuación característica: $$r^2 ${this.signTerm(p, "r")} ${this.signTerm(q)} = (r ${this.signTerm(-lo)})(r ${this.signTerm(-hi)}) = 0$$ Como las raíces reales $r_1 = ${lo}$ y $r_2 = ${hi}$ son distintas, las funciones $e^{${lo}x}$ y $e^{${hi}x}$ son linealmente independientes, dando $${ans}$.`
    };
  },

    // ======================= 1. ARITMÉTICA (6 NUEVOS) =======================
    wpAriTanquesFracciones() {
      const den1 = this.randChoice([3, 4, 5]), den2 = this.randChoice([4, 5, 6]);
      const cap = den1 * den2 * this.randInt(4, 10);
      const n1 = this.randInt(1, den1 - 1);
      const rem1 = cap - (cap * n1) / den1;
      const n2 = this.randInt(1, Math.min(3, den2 - 1));
      const rem2 = rem1 - Math.round((rem1 * n2) / den2);
      // Para evitar redondeos: cap múltiplo de den1 * den2 * den2? Hagámoslo exacto:
      const unit = this.randInt(2, 6);
      const total = den1 * den2 * unit;
      const sacado1 = (total * n1) / den1;
      const queda1 = total - sacado1;
      const sacado2 = (queda1 * n2) / den2; // Exacto porque queda1 es múltiplo de den2!
      const finalL = queda1 - sacado2;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Una cisterna de laboratorio contiene $${total}\\text{ L}$ de solución. En la mañana se extrae $\\frac{${n1}}{${den1}}$ del volumen total y por la tarde se utiliza $\\frac{${n2}}{${den2}}$ del **volumen restante**. ¿Cuántos litros quedan al final del día?`,
        options: this.buildUniqueOptions(
          `${finalL}\\text{ L}`,
          [`${queda1}\\text{ L}`, `${total - sacado1 - Math.round((total * n2) / den2)}\\text{ L}`, `${sacado1 + sacado2}\\text{ L}`],
          (k) => `${finalL + k * unit}\\text{ L}`
        ),
        explanation: `1) **Extracción de la mañana**: $\\frac{${n1}}{${den1}}(${total}) = ${sacado1}\\text{ L}$, por lo que quedan $${total} - ${sacado1} = ${queda1}\\text{ L}$. 2) **Extracción de la tarde**: $\\frac{${n2}}{${den2}}$ de lo restante son $\\frac{${n2}}{${den2}}(${queda1}) = ${sacado2}\\text{ L}$. 3) **Volumen final**: $${queda1} - ${sacado2} = ${finalL}\\text{ L}$.`
      };
    },

    wpAriEscalaPlano() {
      const scaleK = this.randChoice([25000, 50000, 75000, 100000]);
      const cm = this.randInt(4, 16);
      const km = (cm * scaleK) / 100000;
      const kmFmt = Number.isInteger(km) ? `${km}` : km.toFixed(2);
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `En un mapa topográfico elaborado a escala $1 : ${scaleK}$, dos estaciones geodésicas están separadas por $${cm}\\text{ cm}$. ¿Cuál es la distancia real en kilómetros entre ambas estaciones?`,
        options: this.buildUniqueOptions(
          `${kmFmt}\\text{ km}`,
          [`${Number((km * 10).toFixed(2))}\\text{ km}`, `${Number((km / 10).toFixed(3))}\\text{ km}`, `${cm * 2}\\text{ km}`],
          (k) => `${Number((km + k * 0.5).toFixed(2))}\\text{ km}`
        ),
        explanation: `La escala $1 : ${scaleK}$ indica que $1\\text{ cm}$ en el plano equivale $a ${scaleK}\\text{ cm}$ reales. Como $1\\text{ km} = 100\\,000\\text{ cm}$: $d = \\frac{${cm} \\times ${scaleK}}{100\\,000} = ${kmFmt}\\text{ km}$`
      };
    },

    wpAriAleacionPorcentaje() {
      const v1 = this.randInt(2, 6) * 5, p1 = this.randInt(10, 25);
      const v2 = this.randInt(2, 6) * 5, p2 = this.randInt(35, 65);
      const totalVol = v1 + v2;
      const num = v1 * p1 + v2 * p2;
      if (num % totalVol !== 0) return this.wpAriAleacionPorcentaje();
      const pFinal = num / totalVol;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Un químico mezcla $${v1}\\text{ L}$ de una solución ácida al $${p1}\\%$ con $${v2}\\text{ L}$ de otra solución al $${p2}\\%$. ¿Cuál es el porcentaje de concentración de la mezcla resultante?`,
        options: this.buildUniqueOptions(
          `${pFinal}\\%`,
          [`${Math.round((p1 + p2) / 2)}\\%`, `${pFinal + 4}\\%`, `${Math.max(1, pFinal - 5)}\\%`],
          (k) => `${pFinal + k * 2}\\%`
        ),
        explanation: `Calculamos el soluto puro aportado por cada solución: $S = ${v1}(0.${p1}) + ${v2}(0.${p2}) = \\frac{${num}}{100}\\text{ L}$ Dividiendo entre el volumen total $${v1} + ${v2} = ${totalVol}\\text{ L}$ y multiplicando por $100$: $C = \\frac{${num}}{${totalVol}}\\% = ${pFinal}\\%$`
      };
    },

    wpAriEngranajesMcm() {
      const a = this.randChoice([12, 15, 16, 18, 20, 24]);
      const b = this.randChoice([18, 21, 24, 28, 30, 32]);
      if (a === b) return this.wpAriEngranajesMcm();
      const m = this.lcm(a, b);
      const vueltasA = m / a;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Dos engranajes acoplados tienen $${a}$ dientes $y ${b}$ dientes respectivamente. Se marca el diente de contacto inicial en ambos y comienzan a girar. ¿Cuántas vueltas completas debe dar el primer engranaje ($${a}$ dientes) para que las marcas vuelvan a coincidir por primera vez?`,
        options: this.buildUniqueOptions(`${vueltasA}`, [`${m}`, `${m / b}`, `${vueltasA + 2}`], (k) => `${vueltasA + k + 2}`),
        explanation: `Las marcas coinciden cada vez que han pasado un número de dientes que es múltiplo común de $${a}$ y $${b}$. El mínimo número de dientes es $\\operatorname{MCM}(${a}, ${b}) = ${m}$. Como el primer engranaje avanza $${a}$ dientes por vuelta, necesita $\\frac{${m}}{${a}} = ${vueltasA}$ vueltas.`
      };
    },

    wpAriBacteriasGeometrica() {
      const p0 = this.randInt(2, 6) * 100;
      const r = this.randChoice([2, 3]);
      const hours = this.randInt(3, 4);
      const stepH = this.randChoice([2, 3]);
      const totalT = hours * stepH;
      const pFinal = p0 * Math.pow(r, hours);
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Un cultivo experimental inicia con $${p0}$ bacterias y su población se ${r === 2 ? 'duplica' : 'triplica'} cada $${stepH}$ horas. ¿Cuántas bacterias habrá exactamente al cabo de $${totalT}$ horas?`,
        options: this.buildUniqueOptions(
          `${pFinal}`,
          [`${p0 * r * hours}`, `${p0 * Math.pow(r, hours - 1)}`, `${p0 * Math.pow(r, hours + 1)}`],
          (k) => `${pFinal + k * p0}`
        ),
        explanation: `En $${totalT}$ horas transcurren $n = \\frac{${totalT}}{${stepH}} = ${hours}$ ciclos de crecimiento con razón $r = ${r}$. Aplicamos la progresión geométrica $P(n) = P_0 \\cdot r^n$: $P(${hours}) = ${p0} \\cdot ${r}^{${hours}} = ${p0} \\times ${Math.pow(r, hours)} = ${pFinal}\\text{ bacterias}$`
      };
    },

    wpAriCriptografiaModulo() {
      const diasSemana = 7;
      const cycles = this.randInt(15, 45);
      const rem = this.randInt(1, 6);
      const days = cycles * diasSemana + rem;
      const names = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
      const startIdx = this.randInt(0, 6);
      const targetIdx = (startIdx + rem) % 7;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un protocolo de mantenimiento programado se ejecutó un día **${names[startIdx]}**. Si el sistema programa la siguiente inspección exactamente $${days}$ días después, ¿en qué día de la semana caerá dicha inspección?`,
        options: this.buildUniqueOptions(
          `\\text{${names[targetIdx]}}`,
          [`\\text{${names[(targetIdx + 1) % 7]}}`, `\\text{${names[(targetIdx + 6) % 7]}}`, `\\text{${names[(startIdx + 3) % 7]}}`],
          (k) => `\\text{Día ${((targetIdx + k) % 7) + 1}}`
        ),
        explanation: `Dividimos los $${days}$ días entre $7$ para reducir módulo $7$: $${days} = 7(${cycles}) + ${rem} \\implies ${days} \\equiv ${rem} \\pmod 7$ Avanzando $${rem}$ días desde **${names[startIdx]}** obtenemos **${names[targetIdx]}**.`
      };
    },

    // ======================= 2. ÁLGEBRA (6 NUEVOS) =======================
    wpAlgEdadesSistema() {
      const h = this.randInt(8, 18);
      const k = this.randInt(2, 4);
      const p = k * h;
      const y = this.randInt(4, 12);
      const pFut = p + y, hFut = h + y;
      const diff = p - h;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Actualmente la edad de un ingeniero es $${k}$ veces la de su aprendiz. Dentro de $${y}$ años la suma de sus edades será de $${pFut + hFut}$ años. ¿Cuál es la edad actual del aprendiz?`,
        options: this.buildUniqueOptions(`${h}\\text{ años}`, [`${p}\\text{ años}`, `${h + 2}\\text{ años}`, `${diff}\\text{ años}`], (s) => `${h + s * 3}\\text{ años}`),
        explanation: `Sea $x$ la edad actual del aprendiz; el ingeniero tiene $${k}x$. En $${y}$ años tendrán $(x + ${y})$ y $(${k}x + ${y})$: $(x + ${y}) + (${k}x + ${y}) = ${pFut + hFut} \\implies ${k + 1}x + ${2 * y} = ${pFut + hFut} \\implies x = ${h}\\text{ años}$`
      };
    },

    wpAlgMezclaCafes() {
      const x = this.randInt(10, 25), y = this.randInt(10, 25);
      const p1 = this.randInt(6, 10) * 10, p2 = p1 + this.randInt(2, 5) * 10;
      const totalKg = x + y;
      const totalCost = x * p1 + y * p2;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Una tostadora combina café arábica de $${p1}\\text{ MXN/kg}$ con café robusta de $${p2}\\text{ MXN/kg}$ para preparar un lote total de $${totalKg}\\text{ kg}$ cuyo valor acumulado es de $${totalCost}\\text{ MXN}$. ¿Cuántos kilogramos de café arábica ($${p1}\\text{ MXN/kg}$) se emplearon?`,
        options: this.buildUniqueOptions(`${x}\\text{ kg}`, [`${y}\\text{ kg}`, `${x + 4}\\text{ kg}`, `${Math.round(totalKg / 2)}\\text{ kg}`], (s) => `${x + s * 3}\\text{ kg}`),
        explanation: `Planteamos el sistema $x $+ y = ${totalKg}$ y ${p1}x + ${p2}y = ${totalCost}$. Despejando $y = ${totalKg} - x$ y sustituyendo: $${p1}x + ${p2}(${totalKg} - x) = ${totalCost} \\implies ${p1 - p2}x = ${totalCost - p2 * totalKg} \\implies x = ${x}\\text{ kg}$`
      };
    },

    wpAlgCorralAreaCuadratica() {
      const w = this.randInt(5, 16);
      const diff = this.randInt(3, 10);
      const l = w + diff;
      const area = w * l;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una placa rectangular de aluminio tiene un área de $${area}\\text{ cm}^2$. Si su largo mide $${diff}\\text{ cm}$ más que su ancho, ¿cuánto mide su ancho?`,
        options: this.buildUniqueOptions(`${w}\\text{ cm}`, [`${l}\\text{ cm}`, `${w + 2}\\text{ cm}`, `${Math.max(2, w - 3)}\\text{ cm}`], (k) => `${w + k * 2}\\text{ cm}`),
        explanation: `Si el ancho es $w$, el largo es $w + ${diff}$. Entonces $w(w + ${diff}) = ${area} \\implies w^2 + ${diff}w - ${area} = 0$. Factorizando: $(w + ${l})(w - ${w}) = 0$ Como la longitud es positiva, $w = ${w}\\text{ cm}$.`
      };
    },

    wpAlgVelocidadCorriente() {
      const vB = this.randInt(8, 16);
      const vC = this.randInt(2, 4);
      const tDown = this.randInt(2, 4), tUp = this.randInt(3, 6);
      const dist = this.lcm(vB + vC, vB - vC);
      const safeDist = dist > 180 ? (vB + vC) * (vB - vC) : dist;
      const totalTime = safeDist / (vB + vC) + safeDist / (vB - vC);
      if (!Number.isInteger(totalTime)) return this.wpAlgVelocidadCorriente();
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Una lancha recorre $${safeDist}\\text{ km}$ río abajo (a favor de la corriente) y regresa los mismos $${safeDist}\\text{ km}$ río arriba en un tiempo total de $${totalTime}\\text{ h}$. Si la velocidad de la corriente es de $${vC}\\text{ km/h}$, ¿cuál es la rapidez de la lancha en aguas tranquilas?`,
        options: this.buildUniqueOptions(`${vB}\\text{ km/h}`, [`${vB + vC}\\text{ km/h}`, `${vB - vC}\\text{ km/h}`, `${vB + 4}\\text{ km/h}`], (k) => `${vB + k * 2}\\text{ km/h}`),
        explanation: `Sea $v$ la rapidez en aguas tranquilas. Río abajo viaja a $v + ${vC}$ y río arriba a $v - ${vC}$. Planteamos: $\\frac{${safeDist}}{v + ${vC}} + \\frac{${safeDist}}{v - ${vC}} = ${totalTime}$ Verificando con $v = ${vB}$: $\\frac{${safeDist}}{${vB + vC}} + \\frac{${safeDist}}{${vB - vC}} = ${safeDist / (vB + vC)} + ${safeDist / (vB - vC)} = ${totalTime}\\text{ h}$.`
      };
    },

    wpAlgPresupuestoLogaritmo() {
      const magDiff = this.randChoice([2, 3, 4]);
      const ratio = Math.pow(10, magDiff);
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `La intensidad acústica en decibelios se define como $L = 10\\log_{10}\\left(\\frac{I}{I_0}\\right)$. Si el ruido de una turbina es $${ratio}$ veces mayor que el umbral de referencia $I_0$, ¿cuántos decibelios ($\\text{dB}$) produce?`,
        options: this.buildUniqueOptions(`${10 * magDiff}\\text{ dB}`, [`${magDiff}\\text{ dB}`, `${Math.round(ratio / 10)}\\text{ dB}`, `${10 * (magDiff + 1)}\\text{ dB}`], (k) => `${10 * magDiff + k * 5}\\text{ dB}`),
        explanation: `Sustituimos $\\frac{I}{I_0} = ${ratio} = 10^{${magDiff}}$ en la ecuación logarítmica: $L = 10\\log_{10}(10^{${magDiff}}) = 10 \\cdot ${magDiff} = ${10 * magDiff}\\text{ dB}$`
      };
    },

    wpAlgRentaOptimaCuadratica() {
      // Precio P(x) = (p0 + ax) * (q0 - bx) -> elegir máximo limpio en entero
      // P(x) = (40 + 2x)(60 - 2x) = 4(20+x)(30-x) -> vértice en x = 5, 5 aumentos
      const k = this.randInt(2, 6);
      const a = this.randChoice([2, 5]);
      const pBase = a * this.randInt(6, 12);
      const qBase = pBase + 2 * k * a;
      // I(x) = (pBase + a*x)(qBase - a*x)? Si usamos reducción precio o subida de x unidades:
      // Más directo y claro: I(x) = (p + 2x)(q - x) -> raíz promedio!
      // Tomemos: tarifa base = 200 MXN con 100 suscriptores; por cada aumento de 10 MXN se pierden 2 suscriptores => I(x) = (200 + 10x)(100 - 2x) = 20(20+x)(50-x) => vértice x=15 => P* = 350!
      const p0 = 100 * this.randInt(2, 4);
      const q0 = 40 * this.randInt(2, 4);
      const dP = 10, dQ = 1;
      // I(n) = (p0 + dP*n)(q0 - dQ*n). Raíces n = -p0/dP y q0/dQ => vértice n* = (q0/dQ - p0/dP)/2
      const r1 = -p0 / dP, r2 = q0 / dQ;
      const nOpt = (r1 + r2) / 2;
      if (!Number.isInteger(nOpt) || nOpt <= 0) {
        // Construir directo desde nOpt entero deseado:
        const nT = this.randInt(4, 15);
        const stepP = 5, baseQ = 60, dropQ = 2; // q/dropQ = 30; (30 - p/5)/2 = nT => p/5 = 30 - 2*nT (si nT <= 12)
        const safeNT = this.randInt(3, 10);
        const baseP = (30 - 2 * safeNT) * stepP; // siempre positivo!
        const pOpt = baseP + stepP * safeNT;
        return {
          calculator: 'basic',
          isWordProblem: true,
          question: `Un teatro vende boletos $a ${baseP}\\text{ MXN}$ y logra una asistencia promedio de $${baseQ}$ personas. Por cada incremento de $${stepP}\\text{ MXN}$ en el boleto asisten $${dropQ}$ personas menos. ¿Cuál debe ser el **precio del boleto** para maximizar el ingreso total?`,
          options: this.buildUniqueOptions(`${pOpt}\\text{ MXN}`, [`${baseP + safeNT}\\text{ MXN}`, `${pOpt + 15}\\text{ MXN}`, `${baseP + stepP}\\text{ MXN}`], (s) => `${pOpt + s * 5}\\text{ MXN}`),
          explanation: `Si realizamos $n$ aumentos de $${stepP}\\text{ MXN}$, el ingreso es $I(n) = (${baseP} + ${stepP}n)(${baseQ} - ${dropQ}n) = ${stepP * dropQ}(${baseP / stepP} + n)(${baseQ / dropQ} - n)$. Su vértice está en el punto medio de las raíces: $n^* = \\frac{-${baseP / stepP} + ${baseQ / dropQ}}{2} = ${safeNT}$ Por lo tanto, el precio óptimo es $${baseP} + ${stepP}(${safeNT}) = ${pOpt}\\text{ MXN}$.`
        };
      }
      const pOpt = p0 + dP * nOpt;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Un servicio mensual cuesta $${p0}\\text{ MXN}$ con $${q0}$ clientes activos. Un estudio estima que por cada $${dP}\\text{ MXN}$ de aumento se pierde $1$ cliente. ¿Qué precio mensual maximiza el ingreso?`,
        options: this.buildUniqueOptions(`${pOpt}\\text{ MXN}`, [`${p0 + nOpt}\\text{ MXN}`, `${pOpt + 20}\\text{ MXN}`, `${pOpt - 10}\\text{ MXN}`], (s) => `${pOpt + s * 15}\\text{ MXN}`),
        explanation: `El ingreso tras $n$ aumentos es $I(n) = (${p0} + ${dP}n)(${q0} - n)$. Igualando la derivada o hallando el punto medio de sus raíces $n_1 = ${r1}$ y $n_2 = ${r2}$: $n^* = \\frac{${r1} + ${r2}}{2} = ${nOpt}$ El precio óptimo es $${p0} + ${dP}(${nOpt}) = ${pOpt}\\text{ MXN}$.`
      };
    },

    // ======================= 3. GEOMETRÍA EUCLIDIANA (6 NUEVOS) =======================
    wpGeoEscaleraPared() {
      const [a, b, c] = this.randChoice([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]);
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una escalera rígida de $${c}\\text{ m}$ se apoya sobre un muro vertical de forma que su pie dista $${a}\\text{ m}$ de la base de la pared. ¿A qué altura del muro alcanza el extremo superior de la escalera?`,
        options: this.buildUniqueOptions(`${b}\\text{ m}`, [`${c - a}\\text{ m}`, `${a + b}\\text{ m}`, `${Math.round((a + c) / 2)}\\text{ m}`], (k) => `${b + k * 2}\\text{ m}`),
        explanation: `La escalera forma un triángulo rectángulo cuya hipotenusa es $c = ${c}\\text{ m}$ y la base es $a = ${a}\\text{ m}$. Por el Teorema de Pitágoras: $h = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${c * c} - ${a * a}} = \\sqrt{${b * b}} = ${b}\\text{ m}$`
      };
    },

    wpGeoSombraPosteTales() {
      const hVar = this.randInt(2, 4), sVar = this.randInt(2, 5), k = this.randInt(4, 10);
      const sTorre = sVar * k, hTorre = hVar * k;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `A cierta hora del día, un poste vertical de $${hVar}\\text{ m}$ proyecta una sombra de $${sVar}\\text{ m}$ sobre el suelo plano. En el mismo instante, una antena cercana proyecta una sombra de $${sTorre}\\text{ m}$. ¿Cuál es la altura de la antena?`,
        options: this.buildUniqueOptions(`${hTorre}\\text{ m}`, [`${hTorre + hVar}\\text{ m}`, `${sTorre + hVar}\\text{ m}`, `${Math.max(4, hTorre - k)}\\text{ m}`], (step) => `${hTorre + step * 3}\\text{ m}`),
        explanation: `Los rayos solares paralelos forman triángulos semejantes por el Teorema de Tales: $\\frac{H}{${sTorre}} = \\frac{${hVar}}{${sVar}} \\implies H = ${hVar} \\cdot \\frac{${sTorre}}{${sVar}} = ${hVar} \\times ${k} = ${hTorre}\\text{ m}$`
      };
    },

    wpGeoPiscinaCorona() {
      const r = this.randInt(4, 10), ancho = this.randInt(2, 4), R = r + ancho;
      const areaNum = R * R - r * r;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Alrededor de una glorieta circular de $${r}\\text{ m}$ de radio se construye una andador concéntrico de $${ancho}\\text{ m}$ de ancho uniforme. ¿Cuál es el área exacta de la superficie del andador?`,
        options: this.buildUniqueOptions(`${areaNum}\\pi\\text{ m}^2`, [`${ancho * ancho}\\pi\\text{ m}^2`, `${R * R}\\pi\\text{ m}^2`, `${2 * areaNum}\\pi\\text{ m}^2`], (k) => `${areaNum + k * 4}\\pi\\text{ m}^2`),
        explanation: `El radio exterior del andador es $R = ${r} + ${ancho} = ${R}\\text{ m}$. El área corresponde a la diferencia de dos círculos concéntricos (corona circular): $A = \\pi(R^2 - r^2) = \\pi(${R}^2 - ${r}^2) = \\pi(${R * R} - ${r * r}) = ${areaNum}\\pi\\text{ m}^2$`
      };
    },

    wpGeoRampaConoAlmacen() {
      const r = this.randChoice([3, 6, 9]);
      const h = this.randInt(4, 10);
      const vol = (r * r * h) / 3;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Una tolva industrial tiene forma de cono circular recto con un radio interior de $${r}\\text{ m}$ y una altura de $${h}\\text{ m}$. ¿Cuál es su capacidad volumétrica exacta en $\\text{m}^3$?`,
        options: this.buildUniqueOptions(`${vol}\\pi\\text{ m}^3`, [`${r * r * h}\\pi\\text{ m}^3`, `${vol * 2}\\pi\\text{ m}^3`, `${r * h}\\pi\\text{ m}^3`], (k) => `${vol + k * 3}\\pi\\text{ m}^3`),
        explanation: `El volumen de un cono recto equivale a la tercera parte del cilindro con igual base y altura: $V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi(${r})^2(${h}) = ${vol}\\pi\\text{ m}^3$`
      };
    },

    wpGeoParcelaHeron() {
      const [a, b, c, s, area] = this.randChoice([[13, 14, 15, 21, 84], [10, 17, 21, 24, 84], [4, 13, 15, 16, 24]]);
      const precioM2 = this.randInt(2, 5) * 100;
      const totalCost = area * precioM2;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Un terreno triangular cerrado mide $a = ${a}\\text{ m}$, $b = ${b}\\text{ m}$ y $c = ${c}\\text{ m}$ de perímetro. Si cada metro cuadrado de pasto cuesta $${precioM2}\\text{ MXN}$, ¿cuánto costará empastar exactamente todo el terreno?`,
        options: this.buildUniqueOptions(`${totalCost}\\text{ MXN}`, [`${area * 100}\\text{ MXN}`, `${s * precioM2}\\text{ MXN}`, `${totalCost + 2 * precioM2}\\text{ MXN}`], (k) => `${totalCost + k * precioM2}\\text{ MXN}`),
        explanation: `Hallamos el semiperímetro $s = \\frac{${a}+${b}+${c}}{2} = ${s}\\text{ m}$ y aplicamos la fórmula de Herón: $A = \\sqrt{${s}(${s - a})(${s - b})(${s - c})} = ${area}\\text{ m}^2$ Multiplicando por el costo unitario: $\\text{Costo} = ${area} \\times ${precioM2} = ${totalCost}\\text{ MXN}$`
      };
    },

    wpGeoCuerdaTunel() {
      const [d, c, R] = this.randChoice([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]);
      const chord = 2 * c;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `En la sección circular de una tubería de radio $R = ${R}\\text{ cm}$, el nivel de agua forma una cuerda horizontal de $${chord}\\text{ cm}$ de longitud. ¿A qué distancia $d$ del centro de la tubería se encuentra la superficie del agua?`,
        options: this.buildUniqueOptions(`${d}\\text{ cm}`, [`${c}\\text{ cm}`, `${R - d}\\text{ cm}`, `${R + d}\\text{ cm}`], (k) => `${d + k * 2}\\text{ cm}`),
        explanation: `La perpendicular trazada desde el centro biseca la cuerda en dos segmentos de $\\frac{${chord}}{2} = ${c}\\text{ cm}$, formando con el radio $R = ${R}$ un triángulo rectángulo: $d = \\sqrt{R^2 - c^2} = \\sqrt{${R}^2 - ${c}^2} = \\sqrt{${R * R - c * c}} = ${d}\\text{ cm}$`
      };
    },

    // ======================= 4. TRIGONOMETRÍA (6 NUEVOS) =======================
    wpTrigRampaAccesibilidad() {
      const h = this.randInt(2, 9);
      const L = 2 * h;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Para salvar un desnivel vertical de $${h}\\text{ m}$ se instala una rampa recta inclinada $30^\\circ$ respecto a la horizontal. ¿Cuál es exactamente la longitud de la rampa?`,
        options: this.buildUniqueOptions(`${L}\\text{ m}`, [`${h}\\sqrt{3}\\text{ m}`, `${h}\\sqrt{2}\\text{ m}`, `${3 * h}\\text{ m}`], (k) => `${L + k * 2}\\text{ m}`),
        explanation: `El desnivel es el cateto opuesto al ángulo de $30^\\circ$ y la rampa es la hipotenusa $L$: $\\sin(30^\\circ) = \\frac{${h}}{L} \\implies \\frac{1}{2} = \\frac{${h}}{L} \\implies L = ${L}\\text{ m}$`
      };
    },

    wpTrigTopografoDobleObs() {
      // Altura h = d * sqrt(3)/2 cuando cambia de 30° a 60° al acercarse distancia d: d = h(sqrt(3) - 1/sqrt(3)) = 2h/sqrt(3) => si d = 2k, h = k*sqrt(3)!
      const k = this.randInt(5, 25);
      const d = 2 * k;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un topógrafo mide el ángulo de elevación hacia la cima de una torre y obtiene $30^\\circ$. Luego camina $${d}\\text{ m}$ en línea recta hacia la base y el ángulo pasa a $60^\\circ$. ¿Cuál es exactamente la altura $h$ de la torre?`,
        options: this.buildUniqueOptions(`${k}\\sqrt{3}\\text{ m}`, [`${d}\\sqrt{3}\\text{ m}`, `${k}\\text{ m}`, `${d}\\text{ m}`], (s) => `${k + s}\\sqrt{3}\\text{ m}`),
        explanation: `En el segundo punto $x = \\frac{h}{\\tan 60^\\circ} = \\frac{h}{\\sqrt{3}}$. En el primero $x + ${d} = \\frac{h}{\\tan 30^\\circ} = h\\sqrt{3}$. Restando: $${d} = h\\left(\\sqrt{3} - \\frac{1}{\\sqrt{3}}\\right) = \\frac{2h}{\\sqrt{3}} \\implies h = ${k}\\sqrt{3}\\text{ m}$`
      };
    },

    wpTrigFaroBarco() {
      const h = this.randInt(15, 60);
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Desde lo alto de un faro $a ${h}\\text{ m}$ sobre el nivel del mar, el ángulo de depresión hacia un velero es de $45^\\circ$. ¿A qué distancia horizontal de la base del faro se encuentra el velero?`,
        options: this.buildUniqueOptions(`${h}\\text{ m}`, [`${h}\\sqrt{2}\\text{ m}`, `${2 * h}\\text{ m}`, `${Math.round(h / 2)}\\text{ m}`], (k) => `${h + k * 5}\\text{ m}`),
        explanation: `Por ángulos alternos internos entre paralelas horizontales, el ángulo de elevación desde el velero es $45^\\circ$. Como $\\tan(45^\\circ) = 1$: $\\tan(45^\\circ) = \\frac{${h}}{d} = 1 \\implies d = ${h}\\text{ m}$`
      };
    },

    wpTrigVectorFuerzasCosenos() {
      // Fuerzas de 5N y 8N a 60° -> sqrt(25+64+40)=sqrt(129) o mejor suma con 120° para raíz exacta!
      // Caso 120° entre fuerzas: R^2 = F1^2 + F2^2 + 2 F1 F2 cos(120°) = F1^2 + F2^2 - F1 F2!
      // Con F1=8, F2=5 (a 120°): 64+25-40 = 49 => R = 7! Con (8, 3, 120°)->7! Con (7, 5, 60°? 49+25+35=109 no)
      // Con F1=16, F2=10 a 120° -> R = 14! Escalamos [8, 5, 7] y [16, 10, 14] y [8, 3, 7]
      const [f1, f2, rRes] = this.randChoice([[8, 5, 7], [8, 3, 7], [16, 10, 14], [15, 7, 13]]);
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Dos cables tiran de un anclaje aplicando fuerzas de $${f1}\\text{ N}$ y $${f2}\\text{ N}$ que forman entre sí un ángulo de $120^\\circ$. ¿Cuál es exactamente la magnitud de la fuerza resultante?`,
        options: this.buildUniqueOptions(`${rRes}\\text{ N}`, [`${f1 + f2}\\text{ N}`, `${Math.abs(f1 - f2)}\\text{ N}`, `${rRes + 2}\\text{ N}`], (k) => `${rRes + k + 3}\\text{ N}`),
        explanation: `Por regla del paralelogramo y Ley de los Cosenos con $\\cos(120^\\circ) = -\\frac{1}{2}$ (o ángulo suplementario $60^\\circ$ en el triángulo vectorial): $R^2 = ${f1}^2 + ${f2}^2 + 2(${f1})(${f2})\\cos(120^\\circ) = ${f1 * f1} + ${f2 * f2} - ${f1 * f2} = ${rRes * rRes} \\implies R = ${rRes}\\text{ N}$`
      };
    },

    wpTrigAreaParcelaSeno() {
      const a = this.randInt(4, 12) * 2;
      const b = this.randInt(4, 14);
      const area = (a * b) / 4; // con sin(30°) = 1/2 => A = (1/2)*a*b*(1/2)
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Dos linderos de un jardín triangular miden $$${a}\\text{ m}$ y ${b}\\text{ m}$ y forman un ángulo interior de $30^\\circ$. ¿Cuál es el área exacta del jardín?`,
        options: this.buildUniqueOptions(`${area}\\text{ m}^2`, [`${2 * area}\\text{ m}^2`, `${a * b}\\text{ m}^2`, `${area + a}\\text{ m}^2`], (k) => `${area + k * 3}\\text{ m}^2`),
        explanation: `Usamos la fórmula trigonométrica $A = \\frac{1}{2}ab\\sin(C)$ con $\\sin(30^\\circ) = \\frac{1}{2}$: $A = \\frac{1}{2}(${a})(${b})\\left(\\frac{1}{2}\\right) = ${area}\\text{ m}^2$`
      };
    },

    wpTrigOndaArmonica() {
      const amp = this.randInt(4, 12);
      const w = this.randChoice([2, 3, 4, 6]);
      const target = amp; // sen(w t) = 1 => w t = pi/2 => t = pi/(2w)
      const tAns = `\\frac{\\pi}{${2 * w}}`;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `La posición de un pistón armónico sigue la ley $y(t) = ${amp}\\sin(${w}t)$ (con $t$ en segundos). ¿Cuál es el **primer instante positivo** $t \\gt 0$ en que el pistón alcanza su amplitud máxima de $${amp}\\text{ cm}$?`,
        options: this.buildUniqueOptions(`${tAns}\\text{ s}`, [`\\frac{\\pi}{${w}}\\text{ s}`, `\\frac{\\pi}{${4 * w}}\\text{ s}`, `\\frac{2\\pi}{${w}}\\text{ s}`], (k) => `\\frac{${k + 2}\\pi}{${2 * w}}\\text{ s}`),
        explanation: `Igualamos $y(t) = ${amp}$: $${amp}\\sin(${w}t) = ${amp} \\implies \\sin(${w}t) = 1$. El menor ángulo positivo donde $\\sin(\\theta) = 1$ es $\\theta = \\frac{\\pi}{2}$: $${w}t = \\frac{\\pi}{2} \\implies t = ${tAns}\\text{ s}$`
      };
    },

    // ======================= 5. GEOMETRÍA ANALÍTICA (6 NUEVOS) =======================
    wpGeoanDronTrayectoria() {
      const [dx, dy, d] = this.randChoice([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]);
      const x1 = this.randInt(-5, 5), y1 = this.randInt(-5, 5);
      const x2 = x1 + dx, y2 = y1 + dy;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un dron de reparto parte de la coordenada $A(${x1}, ${y1})$ y vuela en línea recta hasta el punto $B(${x2}, ${y2})$ (unidades en kilómetros). ¿Qué distancia recorre?`,
        options: this.buildUniqueOptions(`${d}\\text{ km}`, [`${dx + dy}\\text{ km}`, `${d + 2}\\text{ km}`, `${Math.max(1, d - 2)}\\text{ km}`], (k) => `${d + k * 3}\\text{ km}`),
        explanation: `Aplicamos la distancia euclidiana $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$: $d = \\sqrt{(${dx})^2 + (${dy})^2} = \\sqrt{${dx * dx + dy * dy}} = ${d}\\text{ km}$`
      };
    },

    wpGeoanEstacionMedia() {
      const x1 = this.randInt(-8, 4) * 2, y1 = this.randInt(-8, 4) * 2;
      const x2 = this.randInt(-4, 8) * 2, y2 = this.randInt(-4, 8) * 2;
      if (x1 === x2 && y1 === y2) return this.wpGeoanEstacionMedia();
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Dos sensores sísmicos se ubican en los puntos $S_1(${x1}, ${y1})$ y $S_2(${x2}, ${y2})$ del plano cartesiano. Si se instala una estación repetidora exactamente a la mitad entre ambos, ¿cuáles son sus coordenadas?`,
        options: this.buildUniqueOptions(`(${mx}, ${my})`, [`(${x2 - x1}, ${y2 - y1})`, `(${mx + 1}, ${my - 1})`, `(${x1 + x2}, ${y1 + y2})`], (k) => `(${mx + k}, ${my + k})`),
        explanation: `Usamos la fórmula del punto medio $M = \\left(\\frac{x_1+x_2}{2},\\; \\frac{y_1+y_2}{2}\\right)$: $M = \\left(\\frac{${x1}+${x2}}{2},\\; \\frac{${y1}+${y2}}{2}\\right) = (${mx}, ${my})$`
      };
    },

    wpGeoanCaminoPerpendicular() {
      const m = this.randChoice([2, 3, -2, -3]);
      const b1 = this.randNonZero(-6, 6);
      const x0 = this.randNonZero(-3, 3) * Math.abs(m), y0 = this.randNonZero(-5, 5);
      const numM = -1, denM = m;
      const mPerpTex = this.formatFrac(-1, m);
      const cVal = y0 - (-1 / m) * x0;
      const lineTex = `y = ${mPerpTex}x ${this.signTerm(cVal)}`.trim();
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una avenida recta sigue la ecuación $y = ${m}x ${this.signTerm(b1)}$. Se desea trazar una calle transversal **perpendicular** que pase por la clínica ubicada en $P(${x0}, ${y0})$. ¿Cuál es la ecuación de la calle transversal?`,
        options: this.buildUniqueOptions(
          lineTex,
          [`y = ${m}x ${this.signTerm(y0 - m * x0)}`, `y = ${this.formatFrac(1, m)}x ${this.signTerm(cVal)}`, `y = ${mPerpTex}x ${this.signTerm(-cVal)}`],
          (k) => `y = ${mPerpTex}x ${this.signTerm(cVal + k)}`
        ),
        explanation: `Dos rectas perpendiculares cumplen $m_1 \\cdot m_2 = -1$, luego $m_{\\perp} = -\\frac{1}{${m}} = ${mPerpTex}$. Sustituyendo $P(${x0}, ${y0})$ en la forma punto-pendiente: $y - (${y0}) = ${mPerpTex}(x - (${x0})) \\implies ${lineTex}$`
      };
    },

    wpGeoanAntenaParabolica() {
      const p = this.randInt(2, 6);
      const x = this.randInt(1, 3) * 2 * p;
      // Parábola vertical x^2 = 4 p y -> diámetro D = 2*x, profundidad y = x^2 / (4p)
      const diam = 2 * x;
      const prof = (x * x) / (4 * p);
      if (!Number.isInteger(prof)) return this.wpGeoanAntenaParabolica();
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una antena parabólica tiene un diámetro de apertura de $${diam}\\text{ m}$ y una profundidad central de $${prof}\\text{ m}$. Tomando el vértice en el origen $(0,0)$ con ecuación $x^2 = 4py$, ¿a qué altura sobre el vértice debe colocarse el receptor en el foco?`,
        options: this.buildUniqueOptions(`${p}\\text{ m}`, [`${4 * p}\\text{ m}`, `${2 * p}\\text{ m}`, `${p + 2}\\text{ m}`], (k) => `${p + k + 2}\\text{ m}`),
        explanation: `El borde de la antena pasa por el punto $(x, y) = (${x}, ${prof})$ (radio mitad del diámetro). Sustituyendo en $x^2 = 4py$: $(${x})^2 = 4p(${prof}) \\implies ${x * x} = ${4 * prof}p \\implies p = \\frac{${x * x}}{${4 * prof}} = ${p}\\text{ m}$`
      };
    },

    wpGeoanPuenteElipse() {
      // Arco semielíptico con semieje horizontal a=10, altura h=b=6 => punto (8, y)? Con 3-4-5 escalado!
      // x^2 / a^2 + y^2 / b^2 = 1 => si x = 3a/5 = 3k, b = 5m => y = 4m!
      const k = this.randInt(2, 5);
      const a = 5 * k; // semi-luz => luz total 10k
      const m = this.randInt(2, 4);
      const b = 5 * m; // altura máxima
      const distCenter = 3 * k;
      const heightAtD = 4 * m;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un puente tiene un arco semielíptico con una luz (ancho) total en la base de $${2 * a}\\text{ m}$ y una altura máxima central de $${b}\\text{ m}$. ¿Cuál es la altura del arco a una distancia de $${distCenter}\\text{ m}$ del centro?`,
        options: this.buildUniqueOptions(`${heightAtD}\\text{ m}`, [`${b - distCenter}\\text{ m}`, `${3 * m}\\text{ m}`, `${heightAtD + 2}\\text{ m}`], (s) => `${heightAtD + s}\\text{ m}`),
        explanation: `La ecuación de la elipse centrada en el origen es $\\frac{x^2}{${a}^2} + \\frac{y^2}{${b}^2} = 1$. Evaluamos en $x = ${distCenter}$ ($\\frac{x}{a} = \\frac{3}{5}$): $\\frac{9}{25} + \\frac{y^2}{${b * b}} = 1 \\implies \\frac{y^2}{${b * b}} = \\frac{16}{25} \\implies y = \\frac{4}{5}(${b}) = ${heightAtD}\\text{ m}$`
      };
    },

    wpGeoanZonaCoberturaDistancia() {
      const [A0, B0, n] = this.randChoice([[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
      const B = B0 * this.randChoice([1, -1]);
      const x0 = this.randInt(-4, 4), y0 = this.randInt(-4, 4), d = this.randInt(2, 8);
      const C = d * n - A0 * x0 - B * y0;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un ducto recto sigue la trayectoria $${A0}x ${this.signTerm(B, 'y')} ${this.signTerm(C)} = 0$. ¿Cuál es la distancia perpendicular mínima desde una estación de bombeo situada en $(${x0}, ${y0})$ hasta el ducto?`,
        options: this.buildUniqueOptions(`${d}\\text{ u}`, [`${d * n}\\text{ u}`, `${n}\\text{ u}`, `${d + 3}\\text{ u}`], (k) => `${d + k}\\text{ u}`),
        explanation: `Aplicamos la distancia punto-recta $d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2+B^2}}$: $d = \\frac{|${A0}(${x0}) ${this.signTerm(B)}(${y0}) ${this.signTerm(C)}|}{\\sqrt{${A0}^2 + (${B})^2}} = \\frac{${d * n}}{${n}} = ${d}\\text{ u}$`
      };
    },

    // ======================= 6. FUNCIONES (6 NUEVOS) =======================
    wpFuncTarifaTramos() {
      const baseFee = this.randInt(4, 10) * 10;
      const rate1 = this.randInt(3, 6), rate2 = rate1 + this.randInt(3, 5), cut = 20;
      const cons = this.randInt(25, 45);
      const total = baseFee + rate1 * cut + rate2 * (cons - cut);
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Una empresa cobra un cargo fijo de $${baseFee}\\text{ MXN}$ más $${rate1}\\text{ MXN}$ por cada $\\text{m}^3$ de los primeros $${cut}\\text{ m}^3$ consumidos, $y ${rate2}\\text{ MXN}$ por cada $\\text{m}^3$ adicional excedente. ¿Cuánto pagará un usuario que consume $${cons}\\text{ m}^3$?`,
        options: this.buildUniqueOptions(
          `${total}\\text{ MXN}`,
          [`${baseFee + cons * rate2}\\text{ MXN}`, `${baseFee + cons * rate1}\\text{ MXN}`, `${cons * rate2}\\text{ MXN}`],
          (k) => `${total + k * 10}\\text{ MXN}`
        ),
        explanation: `Evaluamos el segundo tramo ($${cons} \\gt ${cut}$): los primeros $${cut}\\text{ m}^3$ cuestan $${cut}(${rate1}) = ${cut * rate1}\\text{ MXN}$, y los $${cons - cut}\\text{ m}^3$ excedentes cuestan $${cons - cut}(${rate2}) = ${(cons - cut) * rate2}\\text{ MXN}$. Sumando el cargo fijo: $C(${cons}) = ${baseFee} + ${cut * rate1} + ${(cons - cut) * rate2} = ${total}\\text{ MXN}$`
      };
    },

    wpFuncAlturaProyectil() {
      const tMax = this.randInt(2, 6);
      const v0 = 10 * tMax; // h(t) = -5t^2 + 10*tMax*t + h0
      const h0 = this.randInt(2, 15);
      const hMax = 5 * tMax * tMax + h0;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Se lanza un sensor verticalmente desde una plataforma y su altura (en metros) tras $t$ segundos es $h(t) = -5t^2 + ${v0}t + ${h0}$. ¿Cuál es la **altura máxima** que alcanza el sensor?`,
        options: this.buildUniqueOptions(`${hMax}\\text{ m}`, [`${tMax}\\text{ m}`, `${hMax - h0}\\text{ m}`, `${v0 + h0}\\text{ m}`], (k) => `${hMax + k * 5}\\text{ m}`),
        explanation: `La parábola abre hacia abajo ($a = -5 \\lt 0$); su vértice ocurre en $t_v = -\\frac{b}{2a} = -\\frac{${v0}}{2(-5)} = ${tMax}\\text{ s}$. Evaluando en $t = ${tMax}$: $h_{\\max} = -5(${tMax})^2 + ${v0}(${tMax}) + ${h0} = ${hMax}\\text{ m}$`
      };
    },

    wpFuncDepreciacionLinealInversa() {
      const a = this.randInt(4, 9) * 100, b = this.randInt(2, 6) * 1000;
      // C(x) = a*x + b -> cuántas unidades x se fabrican con presupuesto T
      const xSol = this.randInt(8, 22);
      const T = a * xSol + b;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `El costo mensual de fabricación de $x$ sensores está modelado por $C(x) = ${a}x + ${b}\\text{ MXN}$. Usando la función inversa $C^{-1}(y)$, ¿cuántos sensores pueden fabricarse con un presupuesto exacto de $${T}\\text{ MXN}$?`,
        options: this.buildUniqueOptions(`${xSol}`, [`${Math.round(T / a)}`, `${xSol + 2}`, `${Math.max(1, xSol - 3)}`], (k) => `${xSol + k * 2}`),
        explanation: `Invertimos la función lineal $y = ${a}x + ${b} \\implies C^{-1}(y) = \\frac{y - ${b}}{${a}}$. Evaluando en $y = ${T}$: $x = \\frac{${T} - ${b}}{${a}} = \\frac{${T - b}}{${a}} = ${xSol}\\text{ sensores}$`
      };
    },

    wpFuncConcentracionAsintota() {
      const b = this.randInt(2, 8), lim = this.randInt(3, 12), d = this.randInt(1, 5), c = this.randInt(2, 5);
      const a = lim * c;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `La concentración (en $\\text{mg/L}$) de un medicamento en sangre tras $t$ horas responde al modelo $C(t) = \\frac{${a}t + ${b}}{${c}t + ${d}}$. A largo plazo ($t \\to \\infty$), ¿a qué concentración estable se aproxima el sistema?`,
        options: this.buildUniqueOptions(`${lim}\\text{ mg/L}`, [`${this.formatFrac(b, d)}\\text{ mg/L}`, `${a}\\text{ mg/L}`, `0\\text{ mg/L}`], (k) => `${lim + k}\\text{ mg/L}`),
        explanation: `Tomamos el límite cuando $t \\to \\infty$ dividiendo numerador y denominador entre $t$: $\\lim_{t\\to\\infty} \\frac{${a} + \\frac{${b}}{t}}{${c} + \\frac{${d}}{t}} = \\frac{${a}}{${c}} = ${lim}\\text{ mg/L}$`
      };
    },

    wpFuncEnfriamientoExp() {
      const p0 = this.randInt(2, 8) * 10;
      const T = this.randChoice([2, 3, 4]);
      const k = this.randInt(2, 4);
      const tTotal = k * T;
      const ans = p0 / Math.pow(2, k);
      if (!Number.isInteger(ans)) {
        const safeP0 = 16 * this.randInt(2, 6);
        const safeK = this.randInt(2, 3), safeT = this.randInt(2, 4);
        const safeAns = safeP0 / Math.pow(2, safeK);
        return {
          calculator: 'basic',
          isWordProblem: true,
          question: `Un isótopo radiactivo tiene una vida media de $${safeT}$ días, por lo que su masa sigue $M(t) = ${safeP0}\\left(\\frac{1}{2}\\right)^{t/${safeT}}$. ¿Cuántos gramos quedarán tras $${safeK * safeT}$ días?`,
          options: this.buildUniqueOptions(`${safeAns}\\text{ g}`, [`${safeP0 / 2}\\text{ g}`, `${safeAns * 2}\\text{ g}`, `${safeP0 / (safeK * 2)}\\text{ g}`], (s) => `${safeAns + s * 2}\\text{ g}`),
          explanation: `Transcurren $\\frac{${safeK * safeT}}{${safeT}} = ${safeK}$ semividas completas: $M(${safeK * safeT}) = ${safeP0}\\left(\\frac{1}{2}\\right)^{${safeK}} = \\frac{${safeP0}}{${Math.pow(2, safeK)}} = ${safeAns}\\text{ g}$`
        };
      }
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Un isótopo radiactivo tiene una vida media de $${T}$ días según $M(t) = ${p0}\\left(\\frac{1}{2}\\right)^{t/${T}}$. ¿Cuántos gramos permanecerán tras $${tTotal}$ días?`,
        options: this.buildUniqueOptions(`${ans}\\text{ g}`, [`${p0 / 2}\\text{ g}`, `${ans * 2}\\text{ g}`, `${ans + 4}\\text{ g}`], (s) => `${ans + s * 3}\\text{ g}`),
        explanation: `Dividiendo $t = ${tTotal}$ entre la vida media $T = ${T}$ obtenemos ${k} periodos de semidesintegración: $M(${tTotal}) = ${p0}\\left(\\frac{1}{2}\\right)^{${k}} = ${ans}\\text{ g}$`
      };
    },

    wpFuncCostoPromedioContinuo() {
      const x0 = this.randInt(2, 6);
      const m1 = this.randInt(3, 8), b1 = this.randInt(5, 20);
      const valAtX0 = m1 * x0 + b1;
      const m2 = this.randInt(1, 3);
      const kSol = valAtX0 - m2 * x0 * x0;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una función de tarifa logística cambia de fórmula en $x = ${x0}$:\n$T(x) = \\begin{cases} ${m1}x + ${b1}, & 0 \\le x \\lt ${x0} \\\\ ${m2 === 1 ? '' : m2}x^2 + k, & x \\ge ${x0} \\end{cases}$\n¿Qué valor debe tener la constante $k$ para evitar saltos bruscos (garantizar continuidad en $x = ${x0}$)?`,
        options: this.buildUniqueOptions(`k = ${kSol}`, [`k = ${valAtX0}`, `k = ${-kSol}`, `k = ${kSol + x0}`], (s) => `k = ${kSol + s * 2}`),
        explanation: `Igualamos los límites laterales $\\lim_{x\\to ${x0}^-} T(x) = T(${x0})$: $${m1}(${x0}) + ${b1} = ${m2}(${x0})^2 + k \\implies ${valAtX0} = ${m2 * x0 * x0} + k \\implies k = ${kSol}$`
      };
    },

    // ======================= 7. CÁLCULO DIFERENCIAL (6 NUEVOS) =======================
    wpCalcCinematicaInstantanea() {
      const a = this.randInt(1, 3), b = this.randNonZero(-4, 5), c = this.randInt(2, 9), t0 = this.randInt(1, 3);
      const v0 = 3 * a * t0 * t0 + 2 * b * t0 + c;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `La posición en metros de un vehículo autónomo respecto al tiempo $t$ (en segundos) es $s(t) = ${a === 1 ? '' : a}t^3 ${this.signTerm(b, 't^2')} + ${c}t$. ¿Cuál es su **velocidad instantánea** en $t = ${t0}\\text{ s}$?`,
        options: this.buildUniqueOptions(`${v0}\\text{ m/s}`, [`${a * t0 ** 3 + b * t0 ** 2 + c * t0}\\text{ m/s}`, `${6 * a * t0 + 2 * b}\\text{ m/s}`, `${v0 + 4}\\text{ m/s}`], (k) => `${v0 + k * 3}\\text{ m/s}`),
        explanation: `La velocidad instantánea es $v(t) = s'(t) = ${3 * a}t^2 ${this.signTerm(2 * b, 't')} + ${c}$. Evaluando en $t = ${t0}$: $v(${t0}) = ${3 * a}(${t0})^2 ${this.signTerm(2 * b)}(${t0}) + ${c} = ${v0}\\text{ m/s}$`
      };
    },

    wpCalcIngresoMarginal() {
      const p = this.randInt(1, 4), q0 = this.randInt(10, 40), b = this.randInt(20, 80), cf = this.randInt(200, 900);
      // C(q) = 0.5*2*p*q^2 + b*q + cf -> entero limpio C'(q) = 2*p*q + b
      const deriv = 2 * p * q0 + b;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `El costo total (en MXN) de producir $q$ artículos está dado por $C(q) = ${p === 1 ? '' : p}q^2 + ${b}q + ${cf}$. ¿Cuál es el **costo marginal** aproximado de producir la unidad adicional al nivel de $q = ${q0}$ unidades?`,
        options: this.buildUniqueOptions(`${deriv}\\text{ MXN}`, [`${p * q0 * q0 + b * q0 + cf}\\text{ MXN}`, `${2 * p * q0}\\text{ MXN}`, `${deriv + b}\\text{ MXN}`], (k) => `${deriv + k * 4}\\text{ MXN}`),
        explanation: `El costo marginal es la derivada $C'(q) = ${2 * p}q + ${b}$. Evaluando en $q = ${q0}$: $C'(${q0}) = ${2 * p}(${q0}) + ${b} = ${deriv}\\text{ MXN/unidad}$`
      };
    },

    wpCalcEscaleraDeslizante() {
      const [x, y, L] = this.randChoice([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
      const dxDt = this.randChoice([2, 4, 3]);
      // x * dx/dt + y * dy/dt = 0 => |dy/dt| = (x/y) * dx/dt
      const dyNum = -x * dxDt;
      const ans = `${this.formatFrac(dyNum, y)}\\text{ m/s}`;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una viga de $${L}\\text{ m}$ está apoyada sobre una pared vertical. Su base resbala alejándose de la pared a razón de $\\frac{dx}{dt} = ${dxDt}\\text{ m/s}$. En el instante en que la base está a $x = ${x}\\text{ m}$ de la pared (altura $y = ${y}\\text{ m}$), ¿a qué velocidad cambia la altura $\\frac{dy}{dt}$?`,
        options: this.buildUniqueOptions(ans, [`${this.formatFrac(-dyNum, y)}\\text{ m/s}`, `${this.formatFrac(-y * dxDt, x)}\\text{ m/s}`, `-${dxDt}\\text{ m/s}`], (k) => `${this.formatFrac(dyNum - k, y)}\\text{ m/s}`),
        explanation: `Por Pitágoras $x^2 + y^2 = ${L}^2$. Derivando implícitamente respecto al tiempo $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0 \\implies \\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}$ Sustituyendo $x = ${x},\\; y = ${y},\\; \\frac{dx}{dt} = ${dxDt}$: $\\frac{dy}{dt} = -\\frac{${x}}{${y}}(${dxDt}) = ${ans}$`
      };
    },

    wpCalcGlobosVolumenTasa() {
      const r0 = this.randInt(2, 5);
      const k = this.randInt(1, 4);
      const dvDt = 4 * k * r0 * r0; // multiplicador con pi implícito en dV/dt = dvDt * pi => dr/dt = k!
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Se bombea aire a un globo esférico a razón constante de $\\frac{dV}{dt} = ${dvDt}\\pi\\text{ cm}^3/\\text{s}$. ¿Con qué rapidez crece el radio $\\frac{dr}{dt}$ en el instante en que $r = ${r0}\\text{ cm}$?`,
        options: this.buildUniqueOptions(`${k}\\text{ cm/s}`, [`${k * r0}\\text{ cm/s}`, `${this.formatFrac(k, r0)}\\text{ cm/s}`, `${4 * k}\\text{ cm/s}`], (step) => `${k + step}\\text{ cm/s}`),
        explanation: `Derivando $V = \\frac{4}{3}\\pi r^3$ respecto a $t$: $\\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}$. Sustituyendo $\\frac{dV}{dt} = ${dvDt}\\pi$ y $r = ${r0}$: $${dvDt}\\pi = 4\\pi(${r0})^2 \\frac{dr}{dt} \\implies \\frac{dr}{dt} = \\frac{${dvDt}}{${4 * r0 * r0}} = ${k}\\text{ cm/s}$`
      };
    },

    wpCalcCajaSinTapa() {
      // Cuadrado de lado L = 6*k: V(x) = x(L - 2x)^2 => V'(x) = (L-2x)(L-6x) = 0 => x = L/6 = k!
      const k = this.randInt(2, 6);
      const L = 6 * k;
      const vMax = k * Math.pow(L - 2 * k, 2);
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `De una lámina cuadrada metálica de $${L}\\text{ cm}$ de lado se recortan cuatro esquinas cuadradas iguales de lado $x$ y se doblan las pestañas para formar una caja sin tapa. ¿Qué tamaño de corte $x$ maximiza el volumen de la caja?`,
        options: this.buildUniqueOptions(`x = ${k}\\text{ cm}`, [`x = ${3 * k}\\text{ cm}`, `x = ${2 * k}\\text{ cm}`, `x = ${k + 2}\\text{ cm}`], (s) => `x = ${k + s * 3}\\text{ cm}`),
        explanation: `La base mide $${L} - 2x$ y la altura es $x$, luego $V(x) = x(${L} - 2x)^2$ con $0 \\lt x \\lt ${3 * k}$. Derivando por regla del producto: $V'(x) = (${L} - 2x)(${L} - 6x) = 0$ Como $x = ${3 * k}$ anula la base, el máximo ocurre en $x = \\frac{${L}}{6} = ${k}\\text{ cm}$ ($V_{\\max} = ${vMax}\\text{ cm}^3$).`
      };
    },

    wpCalcLataCilindrica() {
      // Minimizar costo o área en caja o función potencia: ejemplo claro -> V constante: S(r) = 2 pi r^2 + 2V/r => 4 pi r = 2 V / r^2 => r^3 = V/(2pi)
      const rSol = this.randInt(2, 5);
      const V = 2 * Math.pow(rSol, 3); // en múltiplos de pi: V = 2 r^3 * pi => altura óptima h = 2 rSol!
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Se diseña un envase cilíndrico cerrado con volumen fijo $V = ${V}\\pi\\text{ cm}^3$ para minimizar el material total utilizado $S(r) = 2\\pi r^2 + \\frac{2V}{r}$. ¿Cuál debe ser el **radio óptimo** $r$?`,
        options: this.buildUniqueOptions(`r = ${rSol}\\text{ cm}`, [`r = ${2 * rSol}\\text{ cm}`, `r = ${rSol + 2}\\text{ cm}`, `r = ${V}\\text{ cm}`], (k) => `r = ${rSol + k + 2}\\text{ cm}`),
        explanation: `Derivamos $S(r) = 2\\pi r^2 + \\frac{${2 * V}\\pi}{r}$ e igualamos a cero: $S'(r) = 4\\pi r - \\frac{${2 * V}\\pi}{r^2} = 0 \\implies r^3 = \\frac{${2 * V}}{4} = ${Math.pow(rSol, 3)} \\implies r = ${rSol}\\text{ cm}$ Como $S''(${rSol}) \\gt 0$, es un mínimo absoluto.`
      };
    },

    // ======================= 8. CÁLCULO INTEGRAL (6 NUEVOS) =======================
    wpIntCaudalAgua() {
      const a = this.randInt(1, 3), b = this.randInt(1, 4), T = this.randInt(2, 4);
      const vol = a * T * T * T + b * T * T;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un tanque recibe agua a una tasa instantánea de $Q(t) = ${3 * a}t^2 + ${2 * b}t$ litros por minuto. ¿Cuántos litros totales ingresan al tanque durante los primeros $${T}$ minutos ($0 \\le t \\le ${T}$)?`,
        options: this.buildUniqueOptions(`${vol}\\text{ L}`, [`${3 * a * T * T + 2 * b * T}\\text{ L}`, `${vol + T}\\text{ L}`, `${Math.round(vol / 2)}\\text{ L}`], (k) => `${vol + k * 4}\\text{ L}`),
        explanation: `El volumen acumulado es la integral definida del caudal: $V = \\int_0^{${T}} (${3 * a}t^2 + ${2 * b}t)\\,dt = \\left[${a === 1 ? '' : a}t^3 + ${b === 1 ? '' : b}t^2\\right]_0^{${T}} = ${a}(${T})^3 + ${b}(${T})^2 = ${vol}\\text{ L}$`
      };
    },

    wpIntDistanciaVelocidad() {
      const a = this.randInt(2, 5), v0 = this.randInt(3, 10), T = this.randInt(2, 5);
      const dist = a * T * T + v0 * T;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un tren parte del origen con una velocidad $v(t) = ${2 * a}t + ${v0}\\text{ m/s}$. ¿Qué distancia recorre desde $t = 0$ hasta $t = ${T}\\text{ s}$?`,
        options: this.buildUniqueOptions(`${dist}\\text{ m}`, [`${2 * a * T + v0}\\text{ m}`, `${dist + v0}\\text{ m}`, `${a * T * T}\\text{ m}`], (k) => `${dist + k * 5}\\text{ m}`),
        explanation: `Integramos la velocidad sobre $[0, ${T}]$ (como $v(t) \\gt 0$, el desplazamiento coincide con la distancia): $d = \\int_0^{${T}} (${2 * a}t + ${v0})\\,dt = \\left[${a}t^2 + ${v0}t\\right]_0^{${T}} = ${a}(${T})^2 + ${v0}(${T}) = ${dist}\\text{ m}$`
      };
    },

    wpIntExcedenteConsumidor() {
      // Trabajo de resorte Hooke: W = \int_{0}^{x} k u du = 0.5 k x^2
      const kHooke = this.randInt(2, 8) * 10;
      const x1 = this.randInt(1, 3), x2 = x1 + this.randInt(2, 4);
      const w = (kHooke * (x2 * x2 - x1 * x1)) / 2;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `Por la ley de Hooke, la fuerza necesaria para estirar un resorte $x$ metros desde su equilibrio es $F(x) = ${kHooke}x$ Newtons. ¿Cuánto **trabajo mecánico** (en Joules) se requiere para estirarlo desde $x = ${x1}\\text{ m}$ hasta $x = ${x2}\\text{ m}$?`,
        options: this.buildUniqueOptions(`${w}\\text{ J}`, [`${kHooke * (x2 - x1)}\\text{ J}`, `${(kHooke * x2 * x2) / 2}\\text{ J}`, `${2 * w}\\text{ J}`], (step) => `${w + step * 20}\\text{ J}`),
        explanation: `El trabajo realizado por una fuerza variable es $W = \\int_{${x1}}^{${x2}} ${kHooke}x\\,dx$: $W = \\left[${kHooke / 2}x^2\\right]_{${x1}}^{${x2}} = ${kHooke / 2}(${x2 * x2} - ${x1 * x1}) = ${w}\\text{ J}$`
      };
    },

    wpIntValorPromedioTemp() {
      // T(t) = 3 a t^2 + c en [0, b] => T_prom = (1/b) [a t^3 + c t]_0^b = a b^2 + c
      const a = this.randInt(1, 3), c = this.randInt(10, 22), b = this.randInt(2, 4);
      const avg = a * b * b + c;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `La temperatura de un horno industrial durante un ciclo de $[0, ${b}]$ horas varía según $T(t) = ${3 * a}t^2 + ${c}\\;^\\circ\\text{C}$. ¿Cuál es la **temperatura promedio** durante ese intervalo?`,
        options: this.buildUniqueOptions(`${avg}\\;^\\circ\\text{C}`, [`${a * b * b * b + c * b}\\;^\\circ\\text{C}`, `${avg + c}\\;^\\circ\\text{C}`, `${3 * a * b * b + c}\\;^\\circ\\text{C}`], (k) => `${avg + k * 2}\\;^\\circ\\text{C}`),
        explanation: `Aplicamos el valor promedio integral $T_{\\text{prom}} = \\frac{1}{${b} - 0}\\int_0^{${b}} (${3 * a}t^2 + ${c})\\,dt$: $T_{\\text{prom}} = \\frac{1}{${b}}\\left[${a === 1 ? '' : a}t^3 + ${c}t\\right]_0^{${b}} = \\frac{${a * Math.pow(b, 3) + c * b}}{${b}} = ${avg}\\;^\\circ\\text{C}$`
      };
    },

    wpIntPanelParabolicoArea() {
      // Ventanal parabólico y = H - k x^2 sobre el piso (y = 0) con H = k * a^2 => área = 4 k a^3 / 3
      const a = this.randChoice([3, 6]);
      const k = this.randInt(1, 2);
      const H = k * a * a;
      const area = (4 * k * Math.pow(a, 3)) / 3;
      return {
        calculator: 'basic',
        isWordProblem: true,
        question: `La fachada de una puerta parabólica queda limitada por la curva $y = ${H} - ${k === 1 ? '' : k}x^2$ y el suelo horizontal $y = 0$ (en metros). ¿Cuál es el área exacta de la puerta?`,
        options: this.buildUniqueOptions(`${area}\\text{ m}^2`, [`${area / 2}\\text{ m}^2`, `${2 * a * H}\\text{ m}^2`, `${area + H}\\text{ m}^2`], (s) => `${area + s * 4}\\text{ m}^2`),
        explanation: `Cortes con el suelo: $${H} - ${k}x^2 = 0 \\implies x = \\pm ${a}$. Por simetría par en $[-${a}, ${a}]$: $A = 2\\int_0^{${a}} (${H} - ${k === 1 ? '' : k}x^2)\\,dx = 2\\left[${H}x - ${this.formatFrac(k, 3)}x^3\\right]_0^{${a}} = ${area}\\text{ m}^2$`
      };
    },

    wpIntDepositoRevolucion() {
      // Rotar recta y = (r/h)*x en [0, h] da cono V = pi * r^2 * h / 3!
      const r = this.randChoice([3, 6]);
      const h = this.randInt(4, 10);
      const m = this.formatFrac(r, h);
      const vol = (r * r * h) / 3;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Se fabrica una boquilla cónica haciendo girar la recta $y = ${m}x$ alrededor del eje $x$ en el intervalo $[0, ${h}]$. Calculando el volumen mediante $V = \\pi\\int_0^{${h}} [f(x)]^2\\,dx$, ¿qué volumen exacto se obtiene?`,
        options: this.buildUniqueOptions(`${vol}\\pi\\text{ u}^3`, [`${r * r * h}\\pi\\text{ u}^3`, `${vol * 2}\\pi\\text{ u}^3`, `${r * h}\\pi\\text{ u}^3`], (k) => `${vol + k * 3}\\pi\\text{ u}^3`),
        explanation: `Aplicamos el método de discos: $V = \\pi \\int_0^{${h}} \\left(${m}x\\right)^2\\,dx = \\pi \\frac{${r * r}}{${h * h}} \\left[\\frac{x^3}{3}\\right]_0^{${h}} = \\pi \\frac{${r * r}}{${h * h}} \\cdot \\frac{${h}^3}{3} = ${vol}\\pi\\text{ u}^3$`
      };
    },

    // ======================= 9. ÁLGEBRA LINEAL Y EDO (6 NUEVOS) =======================
    wpLinCircuitoCorrientes() {
      const a = this.randInt(2, 5), b = this.randInt(1, 3), c = this.randInt(1, 3), d = this.randInt(2, 5);
      const i1 = this.randInt(1, 4), i2 = this.randInt(2, 5);
      const v1 = a * i1 + b * i2, v2 = c * i1 + d * i2;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Un circuito de dos mallas obedece la ecuación matricial de resistencias $R\\mathbf{I} = \\mathbf{V}$:\n$\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}\\begin{pmatrix} I_1 \\\\ I_2 \\end{pmatrix} = \\begin{pmatrix} ${v1} \\\\ ${v2} \\end{pmatrix}$\nSi sabes que $I_1 = ${i1}\\text{ A}$, ¿cuánto vale la segunda corriente $I_2$?`,
        options: this.buildUniqueOptions(`${i2}\\text{ A}`, [`${i1}\\text{ A}`, `${i2 + 2}\\text{ A}`, `${Math.max(1, i2 - 2)}\\text{ A}`], (k) => `${i2 + k + 2}\\text{ A}`),
        explanation: `De la primera fila del producto matricial obtenemos $${a}I_1 + ${b}I_2 = ${v1}$. Sustituyendo $I_1 = ${i1}$: $${a}(${i1}) + ${b}I_2 = ${v1} \\implies ${b}I_2 = ${v1 - a * i1} \\implies I_2 = ${i2}\\text{ A}$ Comprobamos en la fila 2: $${c}(${i1}) + ${d}(${i2}) = ${v2}$.`
      };
    },

    wpLinFuerzasOrtogonales() {
      const f1 = this.randNonZero(-4, 4), f2 = this.randChoice([1, 2, -2, 3]), f3 = this.randNonZero(-4, 4);
      const g1 = this.randNonZero(-4, 4), kSol = this.randNonZero(-5, 5);
      const rhs = -(f1 * g1 + f2 * kSol);
      if (rhs % f3 !== 0) return this.wpLinFuerzasOrtogonales();
      const g3 = rhs / f3;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `En mecánica estructural, un tensor actúa según $\\mathbf{F}_1 = (${f1},\\; ${f2},\\; ${f3})\\text{ N}$ y una viga está orientada en dirección $\\mathbf{v} = (${g1},\\; k,\\; ${g3})$. ¿Qué valor de $k$ hace que el tensor ejerza trabajo nulo sobre la viga (es decir, sean **ortogonales**)?`,
        options: this.buildUniqueOptions(`k = ${kSol}`, [`k = ${-kSol}`, `k = ${kSol + 3}`, `k = ${g1}`], (s) => `k = ${kSol + s * 2}`),
        explanation: `El trabajo es nulo cuando $\\mathbf{F}_1 \\cdot \\mathbf{v} = 0$: $(${f1})(${g1}) + (${f2})k + (${f3})(${g3}) = 0 \\implies ${f1 * g1 + f3 * g3} + ${f2}k = 0 \\implies k = ${kSol}$`
      };
    },

    wpLinTransformacionAreaDet() {
      const a = this.randInt(2, 5), b = this.randInt(1, 3), c = this.randInt(1, 2), d = this.randInt(2, 5);
      const det = Math.abs(a * d - b * c);
      if (det <= 1) return this.wpLinTransformacionAreaDet();
      const area0 = this.randInt(3, 12);
      const newArea = det * area0;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una malla gráfica de área $${area0}\\text{ cm}^2$ se somete a una transformación lineal representada por la matriz:\n$T = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$\n¿Cuál será el área de la región transformada?`,
        options: this.buildUniqueOptions(`${newArea}\\text{ cm}^2`, [`${area0 + det}\\text{ cm}^2`, `${det}\\text{ cm}^2`, `${(a + d) * area0}\\text{ cm}^2`], (k) => `${newArea + k * area0}\\text{ cm}^2`),
        explanation: `Toda transformación lineal escala el área por el valor absoluto de su determinante: $|\\det(T)| = |(${a})(${d}) - (${b})(${c})| = ${det}$ Por lo tanto, el área resultante es $|\\det(T)| \\cdot A_0 = ${det} \\times ${area0} = ${newArea}\\text{ cm}^2$.`
      };
    },

    wpEdoPoblacionMalthus() {
      const p0 = this.randInt(2, 9) * 100;
      const rate = this.randChoice([0.05, 0.1, 0.2]);
      const t = this.randInt(4, 15);
      const expVal = Number((rate * t).toFixed(2));
      const ans = `P(${t}) = ${p0}e^{${expVal}}`;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Una colonia celular sigue la ecuación diferencial de Malthus $\\frac{dP}{dt} = ${rate}\\,P$ con población inicial $P(0) = ${p0}$ células. ¿Cuál es la expresión exacta de la población en $t = ${t}\\text{ h}$?`,
        options: this.buildUniqueOptions(
          ans,
          [`P(${t}) = ${p0}e^{-${expVal}}`, `P(${t}) = ${p0}(1 + ${expVal})`, `P(${t}) = ${Math.round(p0 * rate)}e^{${t}}`],
          (k) => `P(${t}) = ${p0 + k * 50}e^{${expVal}}`
        ),
        explanation: `Separando variables en $\\frac{dP}{P} = ${rate}\\,dt$ obtenemos $P(t) = P_0 e^{${rate}t}$. Con $P(0) = ${p0}$ y evaluando en $t = ${t}$ ($${rate} \\times ${t} = ${expVal}$): $${ans}$`
      };
    },

    wpEdoEnfriamientoNewton() {
      const tAmb = this.randInt(18, 25);
      const diff = this.randInt(50, 75);
      const t0 = tAmb + diff;
      const k = this.randChoice([0.1, 0.2, 0.5]);
      const ans = `T(t) = ${tAmb} + ${diff}e^{-${k}t}`;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Según la Ley de Enfriamiento de Newton, una taza a $T(0) = ${t0}\\;^\\circ\\text{C}$ se enfría en una sala $a ${tAmb}\\;^\\circ\\text{C}$ cumpliendo $\\frac{dT}{dt} = -${k}(T - ${tAmb})$. ¿Cuál es la función solución $T(t)$?`,
        options: this.buildUniqueOptions(
          ans,
          [`T(t) = ${t0}e^{-${k}t}`, `T(t) = ${tAmb} + ${t0}e^{-${k}t}`, `T(t) = ${tAmb} + ${diff}e^{${k}t}`],
          (s) => `T(t) = ${tAmb + s} + ${diff}e^{-${k}t}`
        ),
        explanation: `La solución general de $T' + ${k}T = ${k}\\cdot ${tAmb}$ es $T(t) = ${tAmb} + Ce^{-${k}t}$. Aplicando $T(0) = ${tAmb} + C = ${t0}$, obtenemos $C = ${diff}$, quedando $${ans}$.`
      };
    },

    wpEdoOsciladorAmortiguado() {
      // Circuito RLC / masa-resorte sobreamortiguado: r1 = -1, r2 = -4 -> raíces negativas para estabilidad física!
      const r1 = -this.randInt(1, 3);
      let r2 = -this.randInt(2, 6);
      if (r1 === r2) r2 -= 1;
      const hi = Math.max(r1, r2), lo = Math.min(r1, r2);
      const p = -(lo + hi); // positivo
      const q = lo * hi;    // positivo
      const ans = `x(t) = C_1 e^{${lo === -1 ? '-' : lo}t} + C_2 e^{${hi === -1 ? '-' : hi}t}`;
      return {
        calculator: 'none',
        isWordProblem: true,
        question: `Las vibraciones libres de un amortiguador hidráulico siguen la EDO homogénea:\n$x'' + ${p}x' + ${q}x = 0$\n¿Qué solución general $x(t)$ describe la posición del sistema al paso del tiempo?`,
        options: this.buildUniqueOptions(
          ans,
          [`x(t) = C_1 e^{${-lo === 1 ? '' : -lo}t} + C_2 e^{${-hi === 1 ? '' : -hi}t}`, `x(t) = (C_1 + C_2 t)e^{${lo === -1 ? '-' : lo}t}`, `x(t) = C_1\\cos(${-lo}t) + C_2\\sin(${-hi}t)`],
          (k) => `x(t) = C_1 e^{${lo - k}t} + C_2 e^{${hi}t}`
        ),
        explanation: `Resolvemos la ecuación característica $r^2 + ${p}r + ${q} = (r ${this.signTerm(-lo)})(r ${this.signTerm(-hi)}) = 0$, cuyas raíces son $r_1 = ${lo}$ y $r_2 = ${hi}$. Siendo reales negativas, el sistema es sobreamortiguado con solución $${ans}$.`
      };
    }

  };

  /* ------------------------------------------------------------------------
     4. Motor de Exámenes: Doble Aleatorización Fisher-Yates y Anti-Repetición
     ------------------------------------------------------------------------ */
  const ExamEngine = {
    currentExam: null,

    fisherYates(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    prepareQuestion(q) {
      const safeOptions = Array.isArray(q.options) ? q.options : [];
      const correctText = safeOptions[q.correctIndex ?? 0];
      const shuffledOptions = this.fisherYates(safeOptions);
      const newCorrectIndex = shuffledOptions.indexOf(correctText);

      return Object.assign({}, q, {
        options: shuffledOptions,
        correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
        userSelectedIndex: null,
        isAnswered: false,
        isCorrect: false,
        timeSpentSeconds: 0
      });
    },

    normalizeStatement(questionText) {
      return String(questionText || '')
        .replace(/\s+/g, ' ')
        .replace(/[¿?¡!.,:;]/g, '')
        .trim()
        .toLowerCase();
    },

    hashStatement(text) {
      const s = this.normalizeStatement(text);
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(36);
    },

    createExam(options = {}) {
      const topic = options.topic || 'general';
      const level = options.level || 'all';
      const mode = options.mode || 'training';
      const styleFilter = options.styleFilter || 'mixed';
      const requestedCount = Number(options.count) || 15;

      let pool = [...STATIC_BANK];
      if (topic !== 'general') {
        pool = pool.filter((q) => q.topic === topic);
      }
      if (level !== 'all') {
        pool = pool.filter((q) => q.level === level);
      }
      if (styleFilter === 'word') {
        pool = pool.filter((q) => q.isWordProblem);
      } else if (styleFilter === 'direct') {
        pool = pool.filter((q) => !q.isWordProblem);
      }

      let numHard = 0;
      let numEasy = 0;
      let numMedium = 0;
      if (requestedCount >= 30) {
        numHard = Math.min(15, Math.max(10, Math.floor(requestedCount * 0.34)));
        const rem = requestedCount - numHard;
        numEasy = Math.floor(rem * 0.44);
        numMedium = rem - numEasy;
      } else {
        numHard = Math.floor(requestedCount / 3);
        numEasy = Math.floor(requestedCount / 3);
        numMedium = requestedCount - numHard - numEasy;
      }

      const usedStatements = new Set();
      const seenSet = PrepMatStorage.loadSeenSet();
      const newHashes = [];

      const topicIds = topic === 'general' ? TOPICS.map((t) => t.id) : [topic];

      const buildTier = (difficulty, neededCount) => {
        const tierQuestions = [];
        const candidates = this.fisherYates(pool.filter((q) => q.difficulty === difficulty));

        for (const allowSeen of [false, true]) {
          for (const cand of candidates) {
            if (tierQuestions.length >= neededCount) break;
            const norm = this.normalizeStatement(cand.question);
            const hash = this.hashStatement(cand.question);
            if (!usedStatements.has(norm) && (allowSeen || !seenSet.has(hash))) {
              usedStatements.add(norm);
              seenSet.add(hash);
              newHashes.push(hash);
              tierQuestions.push(cand);
            }
          }
        }

        let attempts = 0;
        const maxAttempts = neededCount * 90 + 400;
        let offset = Math.floor(Math.random() * topicIds.length);

        for (const allowSeen of [false, true]) {
          while (tierQuestions.length < neededCount && attempts < maxAttempts) {
            const chosenTopic = topicIds[(offset + attempts) % topicIds.length];
            const generated = QuestionGenerator.generate(chosenTopic, level, difficulty, styleFilter);
            const norm = this.normalizeStatement(generated.question);
            const hash = this.hashStatement(generated.question);
            if (!usedStatements.has(norm) && (allowSeen || !seenSet.has(hash))) {
              usedStatements.add(norm);
              seenSet.add(hash);
              newHashes.push(hash);
              tierQuestions.push(generated);
            }
            attempts++;
          }
        }

        return this.fisherYates(tierQuestions);
      };

      const selectedEasy = buildTier('sencilla', numEasy);
      const selectedMedium = buildTier('media', numMedium);
      const selectedHard = buildTier('alta', numHard);

      const finalQuestions = [...selectedEasy, ...selectedMedium, ...selectedHard]
        .slice(0, requestedCount)
        .map((q) => this.prepareQuestion(q));

      PrepMatStorage.markSeenHashes(newHashes);

      const topicMeta = TOPICS.find((t) => t.id === topic);
      this.currentExam = {
        title: topic === 'general'
          ? 'Simulacro General Integrado'
          : (topicMeta ? topicMeta.name : 'Examen Temático'),
        topic,
        level,
        mode,
        targetCount: finalQuestions.length,
        questions: finalQuestions,
        currentIndex: 0,
        score: 0,
        elapsedTotalSeconds: 0,
        questionStartElapsed: 0
      };

      return this.currentExam;
    },

    getCurrentQuestion() {
      if (!this.currentExam) return null;
      return this.currentExam.questions[this.currentExam.currentIndex] || null;
    },

    submitAnswer(selectedIndex, elapsedTotal = 0) {
      const q = this.getCurrentQuestion();
      if (!q || q.isAnswered) return null;

      q.userSelectedIndex = selectedIndex;
      q.isAnswered = true;
      q.isCorrect = selectedIndex === q.correctIndex;
      q.timeSpentSeconds = Math.max(1, elapsedTotal - (this.currentExam.questionStartElapsed || 0));
      this.currentExam.questionStartElapsed = elapsedTotal;

      if (q.isCorrect) {
        this.currentExam.score += 1;
      }

      return {
        isCorrect: q.isCorrect,
        correctIndex: q.correctIndex,
        explanation: q.explanation
      };
    },

    hasNextQuestion() {
      if (!this.currentExam) return false;
      return this.currentExam.currentIndex < this.currentExam.questions.length - 1;
    },

    nextQuestion() {
      if (this.hasNextQuestion()) {
        this.currentExam.currentIndex += 1;
        return this.getCurrentQuestion();
      }
      return null;
    },

    computeSummary() {
      if (!this.currentExam) return null;
      const qs = this.currentExam.questions;
      const total = qs.length;
      const correct = qs.filter((q) => q.isCorrect).length;
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

      const byDifficulty = {
        sencilla: { total: 0, correct: 0 },
        media: { total: 0, correct: 0 },
        alta: { total: 0, correct: 0 }
      };
      const byTopic = {};

      qs.forEach((q) => {
        if (byDifficulty[q.difficulty]) {
          byDifficulty[q.difficulty].total++;
          if (q.isCorrect) byDifficulty[q.difficulty].correct++;
        }
        if (!byTopic[q.topic]) {
          byTopic[q.topic] = { topicName: q.topicName || QuestionGenerator.getTopicName(q.topic), total: 0, correct: 0 };
        }
        byTopic[q.topic].total++;
        if (q.isCorrect) byTopic[q.topic].correct++;
      });

      const elapsedSeconds = this.currentExam.elapsedTotalSeconds || 0;
      const avgSecondsPerQ = total > 0 ? Math.round(elapsedSeconds / total) : 0;

      return {
        title: this.currentExam.title,
        topic: this.currentExam.topic,
        level: this.currentExam.level,
        mode: this.currentExam.mode,
        total,
        correct,
        percentage,
        elapsedSeconds,
        avgSecondsPerQ,
        byDifficulty,
        byTopic
      };
    }
  };

  /* ------------------------------------------------------------------------
     5. Controlador de Vistas e Interacción (Liquid Glass UI)
     ------------------------------------------------------------------------ */
  const uiState = {
    view: 'config', // 'config' | 'exam' | 'results'
    selectedLevel: 'all', // 'all' | 'bachillerato' | 'licenciatura'
    selectedMode: 'training', // 'training' | 'simulacro'
    selectedCount: 15,
    selectedStyleFilter: 'mixed', // 'mixed' | 'word' | 'direct'
    selectedTopic: 'general',
    selectedOptionIndex: null,
    timerInterval: null,
    totalSeconds: 0,
    questionSeconds: 0,
    lastSummary: null,
    lastXpEarned: 0
  };

  let activeKeyHandler = null;
  let activeResizeHandler = null;

  function clearTimerAndKeys() {
    if (uiState.timerInterval) {
      clearInterval(uiState.timerInterval);
      uiState.timerInterval = null;
    }
    if (activeKeyHandler && typeof document !== 'undefined') {
      document.removeEventListener('keydown', activeKeyHandler);
      activeKeyHandler = null;
    }
    if (activeResizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', activeResizeHandler);
      activeResizeHandler = null;
    }
  }

  function formatTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function renderRich(str) {
    const safe = String(str || '').replace(/\\\$/g, 'MXN\\;');
    if (ns.MathRenderer && typeof ns.MathRenderer.formatRichText === 'function') {
      return ns.MathRenderer.formatRichText(safe);
    }
    return safe;
  }

  function renderOptionContent(optStr) {
    const raw = String(optStr || '').trim();
    const displayMatch = raw.match(/^\$\$([\s\S]+)\$\$$/);
    if (displayMatch && ns.MathRenderer && typeof ns.MathRenderer.renderMath === 'function') {
      return '<span class="prepmat-option-math">' + ns.MathRenderer.renderMath(displayMatch[1].trim(), false) + '</span>';
    }
    return renderRich(raw);
  }

  function haptic(kind) {
    if (ns.Haptics && typeof ns.Haptics[kind] === 'function') {
      ns.Haptics[kind]();
    }
  }

  function applyProgressWidths(root) {
    if (!root) return;
    root.querySelectorAll('[data-fill-pct]').forEach((el) => {
      const pct = Math.max(0, Math.min(100, Number(el.getAttribute('data-fill-pct')) || 0));
      el.style.width = `${pct}%`;
    });
  }

  function positionLiquidGlider(groupEl, gliderEl, targetEl, animate = false) {
    if (!groupEl || !gliderEl) return;
    if (!targetEl || targetEl.offsetWidth <= 0 || targetEl.offsetHeight <= 0) {
      gliderEl.classList.remove('is-ready', 'is-liquid-moving');
      groupEl.classList.remove('has-glider');
      return;
    }

    const x = targetEl.offsetLeft;
    const y = targetEl.offsetTop;
    const w = targetEl.offsetWidth;
    const h = targetEl.offsetHeight;

    if (!animate) {
      gliderEl.classList.add('is-no-anim');
    } else {
      gliderEl.classList.remove('is-no-anim');
    }

    gliderEl.style.width = `${w}px`;
    gliderEl.style.height = `${h}px`;
    gliderEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    gliderEl.classList.add('is-ready');
    groupEl.classList.add('has-glider');

    if (!animate) {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => gliderEl.classList.remove('is-no-anim'));
      } else {
        gliderEl.classList.remove('is-no-anim');
      }
      return;
    }

    gliderEl.classList.remove('is-liquid-moving');
    void gliderEl.offsetWidth;
    gliderEl.classList.add('is-liquid-moving');
    window.clearTimeout(gliderEl._liquidTimer);
    gliderEl._liquidTimer = window.setTimeout(() => {
      gliderEl.classList.remove('is-liquid-moving');
    }, 450);
  }

  function syncSegmentedGliders(root, changedGroup = null) {
    if (!root) return;
    root.querySelectorAll('.prepmat-segmented').forEach((group) => {
      const glider = group.querySelector('.prepmat-seg-glider');
      const activeBtn = group.querySelector('.prepmat-mode-tab.active');
      positionLiquidGlider(group, glider, activeBtn, group === changedGroup);
    });
  }

  function syncExamOptionGlider(root, animate = false) {
    if (!root) return;
    const grid = root.querySelector('.prepmat-options-grid');
    if (!grid) return;
    const glider = grid.querySelector('.prepmat-opt-glider');
    const selectedBtn = grid.querySelector('.prepmat-option-btn.selected:not(.correct):not(.wrong)');
    positionLiquidGlider(grid, glider, selectedBtn, animate);
  }

  function bindGliderResize(handler) {
    if (typeof window === 'undefined') return;
    if (activeResizeHandler) {
      window.removeEventListener('resize', activeResizeHandler);
    }
    activeResizeHandler = handler;
    window.addEventListener('resize', activeResizeHandler, { passive: true });
  }

  function grantMateticXP(summary) {
    if (!ns.Storage || typeof ns.Storage.getState !== 'function') return 0;
    const baseXP = summary.correct * (summary.level === 'licenciatura' ? 14 : 10);
    const bonus = summary.percentage >= 80 ? 35 : summary.percentage >= 60 ? 15 : 0;
    const totalXP = Math.max(5, baseXP + bonus);
    try {
      const st = ns.Storage.getState();
      st.xp = (st.xp || 0) + totalXP;
      if (!Array.isArray(st.recentActivity)) st.recentActivity = [];
      st.recentActivity.unshift({
        title: `Simulacro PrepMat (${summary.percentage}%): ${summary.title}`,
        type: 'prepmat',
        xp: totalXP,
        date: new Date().toISOString()
      });
      if (st.recentActivity.length > 18) st.recentActivity.length = 18;
      ns.Storage.saveState();
      if (ns.App && typeof ns.App.navigateToDashboard === 'function') {
        const xpEl = document.getElementById('header-xp-pill');
        if (xpEl) {
          const stats = ns.Storage.computeProgressStats(ns.Curriculum || []);
          xpEl.innerHTML = `${stats.rank.badge} ${stats.xp} XP`;
        }
      }
    } catch (_) {
      return totalXP;
    }
    return totalXP;
  }

  function diffLabel(diff) {
    if (diff === 'sencilla') return { text: 'Nivel Base', cls: 'basico' };
    if (diff === 'alta') return { text: 'Desafío Analítico', cls: 'avanzado' };
    return { text: 'Intermedio', cls: 'intermedio' };
  }

  function levelLabel(lvl) {
    if (lvl === 'licenciatura') return '🎓 Licenciatura';
    if (lvl === 'bachillerato') return '📘 Bachillerato';
    return '🎯 Mixto (Bach. y Lic.)';
  }

  function calcBadgeText(calc) {
    if (calc === 'scientific') return '🧮 Calculadora científica habilitada';
    if (calc === 'basic') return '🔢 Calculadora básica sugerida';
    return '✍️ Resolución analítica sin calculadora';
  }

  function renderConfigView(container) {
    clearTimerAndKeys();
    const stats = PrepMatStorage.getData();
    const globalAcc = stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

    container.innerHTML = `
      <div class="tool-header-card">
        <div class="hero-badge">🎓 Módulo PrepMat · Exámenes Bachillerato y Licenciatura</div>
        <h1>PrepMat — Simulador Analítico de Exámenes</h1>
        <p class="theory-paragraph no-margin">
          Entrena con evaluaciones adaptativas de <strong>9 ramas matemáticas</strong>, generación paramétrica anti-repetición,
          curva progresiva de dificultad y justificación analítica paso a paso en cada reactivo.
        </p>
      </div>

      <div class="prepmat-stats-strip">
        <div class="prepmat-mini-stat">
          <span class="prepmat-mini-label">Racha de exámenes</span>
          <strong class="prepmat-mini-value">🔥 ${stats.streak} ${stats.streak === 1 ? 'día' : 'días'}</strong>
        </div>
        <div class="prepmat-mini-stat">
          <span class="prepmat-mini-label">Exámenes completados</span>
          <strong class="prepmat-mini-value">${stats.examsCompleted}</strong>
        </div>
        <div class="prepmat-mini-stat">
          <span class="prepmat-mini-label">Precisión histórica</span>
          <strong class="prepmat-mini-value">${globalAcc}%</strong>
        </div>
        <div class="prepmat-mini-stat">
          <span class="prepmat-mini-label">Mejor calificación</span>
          <strong class="prepmat-mini-value">${stats.bestPercentage}%</strong>
        </div>
      </div>

      <div class="content-card prepmat-config-card">
        <div class="prepmat-config-grid">
          <div class="prepmat-control-group">
            <span class="prepmat-control-title">1. Nivel Académico</span>
            <div class="prepmat-segmented" role="group" aria-label="Nivel académico">
              <span class="prepmat-seg-glider" aria-hidden="true"></span>
              ${[
                { id: 'all', label: 'Mixto' },
                { id: 'bachillerato', label: 'Bachillerato' },
                { id: 'licenciatura', label: 'Licenciatura' }
              ].map((opt) => `
                <button type="button" class="prepmat-mode-tab ${uiState.selectedLevel === opt.id ? 'active' : ''}" data-pm-level="${opt.id}" aria-pressed="${uiState.selectedLevel === opt.id ? 'true' : 'false'}">
                  ${opt.label}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="prepmat-control-group">
            <span class="prepmat-control-title">2. Modalidad del Examen</span>
            <div class="prepmat-segmented" role="group" aria-label="Modalidad del examen">
              <span class="prepmat-seg-glider" aria-hidden="true"></span>
              ${[
                { id: 'training', label: '💡 Entrenamiento Guiado' },
                { id: 'simulacro', label: '⏱️ Simulacro Oficial' }
              ].map((opt) => `
                <button type="button" class="prepmat-mode-tab ${uiState.selectedMode === opt.id ? 'active' : ''}" data-pm-mode="${opt.id}" aria-pressed="${uiState.selectedMode === opt.id ? 'true' : 'false'}">
                  ${opt.label}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="prepmat-control-group">
            <span class="prepmat-control-title">3. Longitud de Evaluación</span>
            <div class="prepmat-segmented" role="group" aria-label="Cantidad de reactivos">
              <span class="prepmat-seg-glider" aria-hidden="true"></span>
              ${[10, 15, 30].map((cnt) => `
                <button type="button" class="prepmat-mode-tab ${uiState.selectedCount === cnt ? 'active' : ''}" data-pm-count="${cnt}" aria-pressed="${uiState.selectedCount === cnt ? 'true' : 'false'}">
                  ${cnt} reactivos
                </button>
              `).join('')}
            </div>
          </div>

          <div class="prepmat-control-group">
            <span class="prepmat-control-title">4. Estilo de Reactivos</span>
            <div class="prepmat-segmented" role="group" aria-label="Estilo de reactivos">
              <span class="prepmat-seg-glider" aria-hidden="true"></span>
              ${[
                { id: 'mixed', label: '🎯 Mixto' },
                { id: 'word', label: '📖 Enunciado' },
                { id: 'direct', label: '⚡ Directo' }
              ].map((opt) => `
                <button type="button" class="prepmat-mode-tab ${uiState.selectedStyleFilter === opt.id ? 'active' : ''}" data-pm-style="${opt.id}" aria-pressed="${uiState.selectedStyleFilter === opt.id ? 'true' : 'false'}">
                  ${opt.label}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="prepmat-general-cta">
          <div class="prepmat-general-info">
            <strong>🏆 Simulacro General Integrado (Las 9 Ramas)</strong>
            <span>Combina de forma balanceada desde Aritmética hasta Cálculo Integral y Álgebra Lineal con dificultad ascendente.</span>
          </div>
          <button type="button" class="btn btn-primary" id="btn-pm-start-general">
            ▶ Iniciar Simulacro General (${uiState.selectedCount})
          </button>
        </div>
      </div>

      <h2 class="prepmat-section-heading">📚 O elige una rama específica (${TOPICS.length} áreas)</h2>

      <div class="prepmat-topics-grid">
        ${TOPICS.map((t) => {
          const tStat = (stats.topicStats && stats.topicStats[t.id]) || { answered: 0, correct: 0 };
          const pct = tStat.answered > 0 ? Math.round((tStat.correct / tStat.answered) * 100) : 0;
          return `
            <article class="prepmat-topic-card">
              <div class="prepmat-topic-head">
                <span class="prepmat-topic-icon" aria-hidden="true">${t.icon}</span>
                <div>
                  <h3 class="prepmat-topic-title">${t.name}</h3>
                  <span class="prepmat-topic-level">${t.levelHint}</span>
                </div>
              </div>
              <p class="prepmat-topic-desc">${t.description}</p>
              <div class="prepmat-topic-meta">
                <span>Dominio registrado: <strong>${tStat.answered > 0 ? `${pct}% (${tStat.correct}/${tStat.answered})` : 'Sin intentos aún'}</strong></span>
                <div class="progress-track">
                  <div class="progress-fill" data-fill-pct="${pct}"></div>
                </div>
              </div>
              <div class="prepmat-topic-actions">
                <button type="button" class="btn btn-primary btn-sm prepmat-card-btn" data-pm-start-topic="${t.id}">
                  ▶ Evaluar (${uiState.selectedCount})
                </button>
                <button type="button" class="btn btn-outline btn-sm prepmat-card-btn" data-pm-review-subj="${t.curriculum.subjectId}" data-pm-review-topic="${t.curriculum.topicId}">
                  📖 Teoría
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>

      ${(stats.recentExams && stats.recentExams.length) ? `
        <section class="content-card prepmat-history-card">
          <div class="prepmat-history-head">
            <h2>🕒 Últimos Simulacros en PrepMat</h2>
            <button type="button" class="btn btn-outline btn-sm" id="btn-pm-clear-seen">
              ↺ Reiniciar historial anti-repetición
            </button>
          </div>
          <div class="prepmat-history-list">
            ${stats.recentExams.slice(0, 5).map((ex) => `
              <div class="prepmat-history-row">
                <div>
                  <strong>${ex.title}</strong>
                  <div class="prepmat-history-sub">${levelLabel(ex.level)} · ${ex.mode === 'simulacro' ? 'Simulacro Oficial' : 'Entrenamiento'} · ⏱ ${formatTimer(ex.elapsedSeconds || 0)}</div>
                </div>
                <span class="badge-level ${ex.percentage >= 70 ? 'basico' : 'intermedio'}">${ex.percentage}% (${ex.score}/${ex.total})</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : `
        <div class="prepmat-history-foot-reset">
          <button type="button" class="btn btn-outline btn-sm" id="btn-pm-clear-seen">
            ↺ Reiniciar memoria anti-repetición (${(stats.seenHashes || []).length} registrados)
          </button>
        </div>
      `}
    `;

    applyProgressWidths(container);
    syncSegmentedGliders(container);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => syncSegmentedGliders(container));
    }
    bindGliderResize(() => syncSegmentedGliders(container));

    const activateSegmentedTab = (selector, onSelect) => {
      container.querySelectorAll(selector).forEach((btn) => {
        btn.addEventListener('click', () => {
          haptic('light');
          const group = btn.closest('.prepmat-segmented');
          if (group) {
            group.querySelectorAll('.prepmat-mode-tab').forEach((tab) => {
              const isSelected = tab === btn;
              tab.classList.toggle('active', isSelected);
              tab.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
            });
          }
          onSelect(btn);
          syncSegmentedGliders(container, group);
        });
      });
    };

    activateSegmentedTab('[data-pm-level]', (btn) => {
      uiState.selectedLevel = btn.getAttribute('data-pm-level') || 'all';
    });

    activateSegmentedTab('[data-pm-mode]', (btn) => {
      uiState.selectedMode = btn.getAttribute('data-pm-mode') || 'training';
    });

    activateSegmentedTab('[data-pm-count]', (btn) => {
      uiState.selectedCount = Number(btn.getAttribute('data-pm-count')) || 15;
      const generalBtn = container.querySelector('#btn-pm-start-general');
      if (generalBtn) generalBtn.textContent = `▶ Iniciar Simulacro General (${uiState.selectedCount})`;
      container.querySelectorAll('[data-pm-start-topic]').forEach((cardBtn) => {
        cardBtn.textContent = `▶ Evaluar (${uiState.selectedCount})`;
      });
    });

    activateSegmentedTab('[data-pm-style]', (btn) => {
      uiState.selectedStyleFilter = btn.getAttribute('data-pm-style') || 'mixed';
    });

    container.querySelector('#btn-pm-start-general')?.addEventListener('click', () => {
      startExam(container, 'general');
    });

    container.querySelectorAll('[data-pm-start-topic]').forEach((btn) => {
      btn.addEventListener('click', () => {
        startExam(container, btn.getAttribute('data-pm-start-topic'));
      });
    });

    container.querySelectorAll('[data-pm-review-subj]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('light');
        const sId = btn.getAttribute('data-pm-review-subj');
        const tId = btn.getAttribute('data-pm-review-topic');
        if (ns.App && typeof ns.App.openSubject === 'function') {
          ns.App.openSubject(sId, tId, 'teoria');
        }
      });
    });

    container.querySelector('#btn-pm-clear-seen')?.addEventListener('click', () => {
      haptic('confirm');
      PrepMatStorage.clearSeenHashes();
      renderConfigView(container);
    });
  }

  function startExam(container, topicId) {
    haptic('confirm');
    uiState.selectedTopic = topicId;
    uiState.selectedOptionIndex = null;
    uiState.totalSeconds = 0;
    uiState.questionSeconds = 0;
    uiState.view = 'exam';

    ExamEngine.createExam({
      topic: topicId,
      level: uiState.selectedLevel,
      mode: uiState.selectedMode,
      count: uiState.selectedCount,
      styleFilter: uiState.selectedStyleFilter
    });

    startTimerLoop(container);
    renderExamView(container);
  }

  function startTimerLoop(container) {
    clearTimerAndKeys();
    uiState.timerInterval = setInterval(() => {
      if (!document.body.contains(container) || uiState.view !== 'exam') {
        clearTimerAndKeys();
        return;
      }
      uiState.totalSeconds += 1;
      uiState.questionSeconds += 1;
      if (ExamEngine.currentExam) {
        ExamEngine.currentExam.elapsedTotalSeconds = uiState.totalSeconds;
      }
      const totEl = container.querySelector('#pm-timer-total');
      const qEl = container.querySelector('#pm-timer-question');
      if (totEl) totEl.textContent = formatTimer(uiState.totalSeconds);
      if (qEl) qEl.textContent = formatTimer(uiState.questionSeconds);
    }, 1000);
  }

  function renderExamView(container) {
    const exam = ExamEngine.currentExam;
    const q = ExamEngine.getCurrentQuestion();
    if (!exam || !q) {
      renderConfigView(container);
      return;
    }

    const total = exam.questions.length;
    const curNum = exam.currentIndex + 1;
    const pct = Math.round((curNum / total) * 100);
    const dMeta = diffLabel(q.difficulty);
    const letters = ['A', 'B', 'C', 'D'];
    const isTraining = exam.mode === 'training';
    const isDone = q.isAnswered;

    container.innerHTML = `
      <div class="prepmat-exam-topbar">
        <div class="prepmat-exam-title-wrap">
          <span class="prepmat-exam-kicker">${exam.title} · ${isTraining ? 'Entrenamiento Guiado' : 'Simulacro Oficial'}</span>
          <div class="prepmat-exam-badges">
            <span class="badge-level ${dMeta.cls}">${dMeta.text}</span>
            <span class="prepmat-meta-pill">${q.topicName}</span>
            <span class="prepmat-meta-pill">${levelLabel(q.level)}</span>
            ${q.isWordProblem ? '<span class="prepmat-meta-pill prepmat-meta-pill-word">📖 Enunciado</span>' : ''}
          </div>
        </div>
        <div class="prepmat-exam-timers">
          <div class="prepmat-timer-pill" title="Tiempo total del examen">
            <span>⏱ Total</span>
            <strong id="pm-timer-total">${formatTimer(uiState.totalSeconds)}</strong>
          </div>
          <div class="prepmat-timer-pill" title="Tiempo en este reactivo">
            <span>Reactivo</span>
            <strong id="pm-timer-question">${formatTimer(uiState.questionSeconds)}</strong>
          </div>
          ${q.calculator !== 'none' ? `
            <button type="button" class="btn btn-outline btn-sm" id="btn-pm-open-calc" title="Abrir calculadora científica flotante">
              🧮 Calculadora
            </button>
          ` : ''}
          <button type="button" class="btn btn-outline btn-sm" id="btn-pm-exit-exam">✕ Salir</button>
        </div>
      </div>

      <div class="prepmat-exam-progress-bar">
        <div class="prepmat-exam-progress-meta">
          <strong>Reactivo ${curNum} de ${total}</strong>
          <span>${calcBadgeText(q.calculator)}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" data-fill-pct="${pct}"></div>
        </div>
      </div>

      <article class="content-card prepmat-question-card">
        <div class="prepmat-question-statement">${renderRich(q.question)}</div>

        <div class="prepmat-options-grid" role="radiogroup" aria-label="Opciones de respuesta">
          <span class="prepmat-opt-glider" aria-hidden="true"></span>
          ${q.options.map((opt, idx) => {
            let cls = '';
            if (!isDone && uiState.selectedOptionIndex === idx) cls = 'selected';
            if (isDone) {
              if (idx === q.correctIndex) cls = 'correct';
              else if (idx === q.userSelectedIndex) cls = 'wrong';
            }
            return `
              <button
                type="button"
                class="prepmat-option-btn ${cls}"
                data-pm-opt="${idx}"
                aria-pressed="${(!isDone && uiState.selectedOptionIndex === idx) ? 'true' : 'false'}"
                ${isDone ? 'disabled' : ''}>
                <span class="option-letter">${letters[idx]}</span>
                <span class="prepmat-option-label">${renderOptionContent(opt)}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${isDone ? `
          <div class="feedback-banner ${q.isCorrect ? 'success' : 'error'}">
            <div>
              <strong>${q.isCorrect ? '✓ ¡Respuesta Correcta!' : `✕ Respuesta Incorrecta (la opción correcta es ${letters[q.correctIndex]})`}</strong>
            </div>
          </div>
          <div class="prepmat-explanation-box">
            <div class="prepmat-explanation-head">📐 Desarrollo y Justificación Analítica</div>
            <div class="prepmat-explanation-body">${renderRich(q.explanation)}</div>
          </div>
        ` : ''}

        <div class="prepmat-exam-actions">
          <span class="prepmat-kbd-hint">Atajos: teclas 1–4 o A–D para elegir · Enter para confirmar</span>
          <div class="prepmat-action-btns">
            ${!isDone ? `
              <button type="button" class="btn btn-primary" id="btn-pm-submit-opt" ${uiState.selectedOptionIndex === null ? 'disabled' : ''}>
                ${isTraining ? '✓ Comprobar respuesta' : (ExamEngine.hasNextQuestion() ? 'Confirmar y siguiente →' : 'Confirmar y finalizar ✓')}
              </button>
            ` : `
              <button type="button" class="btn btn-primary" id="btn-pm-next-q">
                ${ExamEngine.hasNextQuestion() ? 'Siguiente reactivo →' : '📊 Ver Diagnóstico Final'}
              </button>
            `}
          </div>
        </div>
      </article>
    `;

    applyProgressWidths(container);
    syncExamOptionGlider(container, false);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => syncExamOptionGlider(container, false));
    }
    bindGliderResize(() => syncExamOptionGlider(container, false));

    const selectExamOption = (idx) => {
      if (q.isAnswered) return;
      uiState.selectedOptionIndex = idx;
      haptic('light');
      container.querySelectorAll('[data-pm-opt]').forEach((btn) => {
        const match = Number(btn.getAttribute('data-pm-opt')) === idx;
        btn.classList.toggle('selected', match);
        btn.setAttribute('aria-pressed', match ? 'true' : 'false');
      });
      const submitBtn = container.querySelector('#btn-pm-submit-opt');
      if (submitBtn) submitBtn.disabled = false;
      syncExamOptionGlider(container, true);
    };

    container.querySelectorAll('[data-pm-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectExamOption(Number(btn.getAttribute('data-pm-opt')));
      });
    });

    container.querySelector('#btn-pm-submit-opt')?.addEventListener('click', () => {
      confirmOption(container);
    });

    container.querySelector('#btn-pm-next-q')?.addEventListener('click', () => {
      advanceExam(container);
    });

    container.querySelector('#btn-pm-exit-exam')?.addEventListener('click', () => {
      haptic('light');
      uiState.view = 'config';
      renderConfigView(container);
    });

    container.querySelector('#btn-pm-open-calc')?.addEventListener('click', (ev) => {
      if (ns.App && typeof ns.App.openQuickCalculator === 'function') {
        ns.App.openQuickCalculator(ev.currentTarget);
      } else {
        document.getElementById('btn-open-quick-calc')?.click();
      }
    });

    // Atajos de teclado (1-4 / A-D / Enter) seguros
    if (activeKeyHandler) document.removeEventListener('keydown', activeKeyHandler);
    activeKeyHandler = (ev) => {
      if (uiState.view !== 'exam' || !document.body.contains(container)) return;
      if (document.documentElement.classList.contains('has-open-overlay')) return;
      const key = String(ev.key || '').toUpperCase();
      const mapIdx = { '1': 0, '2': 1, '3': 2, '4': 3, A: 0, B: 1, C: 2, D: 3 };
      if (!q.isAnswered && mapIdx[key] !== undefined) {
        ev.preventDefault();
        selectExamOption(mapIdx[key]);
        return;
      }
      if (ev.key === 'Enter') {
        if (!q.isAnswered && uiState.selectedOptionIndex !== null) {
          ev.preventDefault();
          confirmOption(container);
        } else if (q.isAnswered) {
          ev.preventDefault();
          advanceExam(container);
        }
      }
    };
    document.addEventListener('keydown', activeKeyHandler);
  }

  function confirmOption(container) {
    if (uiState.selectedOptionIndex === null) return;
    const exam = ExamEngine.currentExam;
    const res = ExamEngine.submitAnswer(uiState.selectedOptionIndex, uiState.totalSeconds);
    if (!res) return;

    if (res.isCorrect) haptic('correct');
    else haptic('incorrect');

    if (exam.mode === 'simulacro') {
      advanceExam(container);
    } else {
      renderExamView(container);
    }
  }

  function advanceExam(container) {
    haptic('light');
    if (ExamEngine.hasNextQuestion()) {
      ExamEngine.nextQuestion();
      uiState.selectedOptionIndex = null;
      uiState.questionSeconds = 0;
      renderExamView(container);
    } else {
      finishExam(container);
    }
  }

  function finishExam(container) {
    clearTimerAndKeys();
    uiState.view = 'results';
    const summary = ExamEngine.computeSummary();
    uiState.lastSummary = summary;
    PrepMatStorage.recordExamCompletion(summary);
    uiState.lastXpEarned = grantMateticXP(summary);
    haptic(summary.percentage >= 60 ? 'achievement' : 'confirm');
    renderResultsView(container);
  }

  function renderResultsView(container) {
    clearTimerAndKeys();
    const exam = ExamEngine.currentExam;
    const summary = uiState.lastSummary;
    if (!exam || !summary) {
      renderConfigView(container);
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];
    const perfMsg = summary.percentage >= 85
      ? '🏆 ¡Dominio sobresaliente!'
      : summary.percentage >= 60
        ? '👏 ¡Buen desempeño analítico!'
        : '📚 Oportunidad de refuerzo conceptual';

    container.innerHTML = `
      <div class="content-card prepmat-results-hero">
        <div class="prepmat-results-top">
          <div>
            <span class="hero-badge">${perfMsg}</span>
            <h1>${summary.title}</h1>
            <p class="theory-paragraph no-margin">
              ${levelLabel(summary.level)} · ⏱ Tiempo total: <strong>${formatTimer(summary.elapsedSeconds)}</strong> · Promedio: <strong>${summary.avgSecondsPerQ}s/reactivo</strong> · Recompensa: <strong>+${uiState.lastXpEarned} XP</strong>
            </p>
          </div>
          <div class="prepmat-score-ring">
            <strong>${summary.percentage}%</strong>
            <span>${summary.correct}/${summary.total} aciertos</span>
          </div>
        </div>

        <div class="prepmat-results-actions">
          <button type="button" class="btn btn-primary" id="btn-pm-retry-same">↻ Nuevo simulacro similar</button>
          <button type="button" class="btn btn-outline" id="btn-pm-back-config">← Volver al panel PrepMat</button>
        </div>
      </div>

      <div class="prepmat-diag-grid">
        <section class="content-card">
          <h2>📊 Desempeño por Dificultad</h2>
          <div class="prepmat-breakdown-list">
            ${[
              { id: 'sencilla', name: 'Base / Fundamentos' },
              { id: 'media', name: 'Intermedio' },
              { id: 'alta', name: 'Desafío Analítico' }
            ].filter((d) => summary.byDifficulty[d.id] && summary.byDifficulty[d.id].total > 0).map((d) => {
              const st = summary.byDifficulty[d.id];
              const pct = Math.round((st.correct / st.total) * 100);
              return `
                <div class="prepmat-breakdown-row">
                  <div class="prepmat-breakdown-meta">
                    <span>${d.name}</span>
                    <strong>${st.correct}/${st.total} (${pct}%)</strong>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" data-fill-pct="${pct}"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <section class="content-card">
          <h2>🧭 Diagnóstico por Rama y Repaso</h2>
          <div class="prepmat-breakdown-list">
            ${Object.keys(summary.byTopic).map((tId) => {
              const st = summary.byTopic[tId];
              const pct = Math.round((st.correct / st.total) * 100);
              const tMeta = TOPICS.find((t) => t.id === tId);
              return `
                <div class="prepmat-breakdown-row">
                  <div class="prepmat-breakdown-meta">
                    <span>${st.topicName}</span>
                    <strong>${st.correct}/${st.total} (${pct}%)</strong>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" data-fill-pct="${pct}"></div>
                  </div>
                  ${(pct < 80 && tMeta && tMeta.curriculum) ? `
                    <button type="button" class="btn btn-outline btn-sm prepmat-review-chip" data-pm-res-subj="${tMeta.curriculum.subjectId}" data-pm-res-topic="${tMeta.curriculum.topicId}">
                      📖 ${tMeta.curriculum.label}
                    </button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </div>

      <section class="content-card">
        <h2>🔍 Revisión Analítica Detallada (${exam.questions.length} reactivos)</h2>
        <div class="prepmat-review-list">
          ${exam.questions.map((q, idx) => `
            <article class="prepmat-review-item ${q.isCorrect ? 'is-ok' : 'is-bad'}">
              <div class="prepmat-review-head">
                <strong>Reactivo ${idx + 1} · ${q.topicName}</strong>
                <span class="badge-level ${q.isCorrect ? 'basico' : 'avanzado'}">${q.isCorrect ? '✓ Correcta' : '✕ Incorrecta'} · ${q.timeSpentSeconds}s</span>
              </div>
              <div class="prepmat-review-q">${renderRich(q.question)}</div>
              <div class="prepmat-review-answers">
                <span>Tu respuesta: <strong>${q.userSelectedIndex !== null ? letters[q.userSelectedIndex] : 'Sin responder'}</strong> ${q.userSelectedIndex !== null ? renderOptionContent(q.options[q.userSelectedIndex]) : ''}</span>
                <span>Respuesta correcta: <strong>${letters[q.correctIndex]}</strong> ${renderOptionContent(q.options[q.correctIndex])}</span>
              </div>
              <div class="prepmat-explanation-box">
                <div class="prepmat-explanation-head">📐 Explicación Analítica</div>
                <div class="prepmat-explanation-body">${renderRich(q.explanation)}</div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;

    applyProgressWidths(container);

    container.querySelector('#btn-pm-retry-same')?.addEventListener('click', () => {
      startExam(container, exam.topic);
    });

    container.querySelector('#btn-pm-back-config')?.addEventListener('click', () => {
      haptic('light');
      uiState.view = 'config';
      renderConfigView(container);
    });

    container.querySelectorAll('[data-pm-res-subj]').forEach((btn) => {
      btn.addEventListener('click', () => {
        haptic('light');
        if (ns.App && typeof ns.App.openSubject === 'function') {
          ns.App.openSubject(
            btn.getAttribute('data-pm-res-subj'),
            btn.getAttribute('data-pm-res-topic'),
            'teoria'
          );
        }
      });
    });
  }

  function renderPrepMatView(container, presetConfig = null) {
    if (!container) return;
    if (presetConfig && typeof presetConfig === 'object') {
      if (presetConfig.level) uiState.selectedLevel = presetConfig.level;
      if (presetConfig.mode) uiState.selectedMode = presetConfig.mode;
      if (presetConfig.count) uiState.selectedCount = Number(presetConfig.count) || 15;
      if (presetConfig.topic && presetConfig.autoStart) {
        startExam(container, presetConfig.topic);
        return;
      }
    }
    uiState.view = 'config';
    renderConfigView(container);
  }

  ns.PrepMatTool = {
    TOPICS,
    STATIC_BANK,
    Storage: PrepMatStorage,
    QuestionGenerator,
    ExamEngine,
    renderPrepMatView
  };
})(window.MatInteractiva);
