/* ==========================================================================
   MATETIC - Constructor Dinámico de Índice y Rutas Curriculares
   Archivo: js/engine/curriculum-index.js
   Genera el mapa completo de materias, bloques, prerrequisitos, tiempos
   estimados y rutas de aprendizaje directamente desde window.MatInteractiva.Curriculum.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const BLOCKS = [
    { id: 'todos', label: 'Todos los bloques' },
    { id: 'fundamentos', label: 'Bloque I · Fundamentos' },
    { id: 'precalculo', label: 'Bloque II · Geometría y Pre-Cálculo' },
    { id: 'calculo', label: 'Bloque III · Cálculo Universitario' }
  ];

  const SUBJECT_META = {
    aritmetica: {
      blockId: 'fundamentos',
      blockLabel: 'Bloque I · Fundamentos',
      prerequisites: ['Operaciones numéricas elementales'],
      baseMinutesPerTopic: 35,
      order: 1
    },
    algebra: {
      blockId: 'fundamentos',
      blockLabel: 'Bloque I · Fundamentos',
      prerequisites: ['Aritmética'],
      baseMinutesPerTopic: 45,
      order: 2
    },
    geometria: {
      blockId: 'precalculo',
      blockLabel: 'Bloque II · Geometría y Pre-Cálculo',
      prerequisites: ['Aritmética', 'Álgebra'],
      baseMinutesPerTopic: 40,
      order: 3
    },
    trigonometria: {
      blockId: 'precalculo',
      blockLabel: 'Bloque II · Geometría y Pre-Cálculo',
      prerequisites: ['Geometría', 'Álgebra'],
      baseMinutesPerTopic: 45,
      order: 4
    },
    funciones: {
      blockId: 'precalculo',
      blockLabel: 'Bloque II · Geometría y Pre-Cálculo',
      prerequisites: ['Álgebra', 'Trigonometría'],
      baseMinutesPerTopic: 45,
      order: 5
    },
    limites: {
      blockId: 'calculo',
      blockLabel: 'Bloque III · Cálculo Universitario',
      prerequisites: ['Álgebra (factorización)', 'Funciones'],
      baseMinutesPerTopic: 55,
      order: 6
    },
    derivadas: {
      blockId: 'calculo',
      blockLabel: 'Bloque III · Cálculo Universitario',
      prerequisites: ['Límites', 'Funciones', 'Geometría Analítica'],
      baseMinutesPerTopic: 65,
      order: 7
    },
    integrales: {
      blockId: 'calculo',
      blockLabel: 'Bloque III · Cálculo Universitario',
      prerequisites: ['Derivadas', 'Trigonometría'],
      baseMinutesPerTopic: 60,
      order: 8
    },
    calculo: {
      blockId: 'calculo',
      blockLabel: 'Bloque III · Cálculo Universitario',
      prerequisites: ['Derivadas', 'Integrales'],
      baseMinutesPerTopic: 60,
      order: 9
    }
  };

  const ROUTE_DEFINITIONS = [
    {
      id: 'ruta-base',
      title: 'Ruta 1 · Base Matemática y Pre-Cálculo',
      badge: 'Secuencia Recomendada I',
      description: 'Construye solidez en números reales, factorización, geometría analítica, trigonometría y funciones antes del Cálculo.',
      subjectIds: ['aritmetica', 'algebra', 'geometria', 'trigonometria', 'funciones']
    },
    {
      id: 'ruta-calculo',
      title: 'Ruta 2 · Cálculo Diferencial e Integral Universitario',
      badge: 'Secuencia Recomendada II',
      description: 'Recorrido riguroso desde funciones y límites ε-δ hasta derivación, integración y ecuaciones diferenciales separables.',
      subjectIds: ['funciones', 'limites', 'derivadas', 'integrales', 'calculo']
    }
  ];

  function getSubjectMeta(subjectId, fallbackIdx = 99) {
    return SUBJECT_META[subjectId] || {
      blockId: 'calculo',
      blockLabel: 'Bloque Complementario',
      prerequisites: ['Base curricular previa'],
      baseMinutesPerTopic: 45,
      order: fallbackIdx + 10
    };
  }

  function estimateTopicMinutes(topic, baseMinutes = 40) {
    const exCount = Array.isArray(topic?.examples) ? topic.examples.length : 1;
    const practiceCount = Array.isArray(topic?.exercises) ? topic.exercises.length : 2;
    const quizCount = Array.isArray(topic?.quiz) ? topic.quiz.length : 1;
    return Math.round(baseMinutes * 0.45 + exCount * 6 + practiceCount * 5 + quizCount * 3);
  }

  function formatDurationMinutes(totalMinutes) {
    const mins = Math.max(10, Math.round(totalMinutes || 0));
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
  }

  function buildCurriculumEntries(curriculum, stats = {}) {
    const list = Array.isArray(curriculum) ? curriculum : [];
    const bySubj = stats.bySubject || {};
    const studiedTopics = stats.studiedTopicsMap || {};

    return list.map((subj, idx) => {
      const meta = getSubjectMeta(subj.id, idx);
      const topics = Array.isArray(subj.topics) ? subj.topics : [];
      const st = bySubj[subj.id] || {
        exercisesSolved: 0,
        exercisesTotal: topics.reduce((acc, t) => acc + (t.exercises ? t.exercises.length : 0), 0),
        topicsStudied: 0,
        topicsTotal: topics.length,
        percentage: 0
      };

      const enrichedTopics = topics.map((t, tIdx) => ({
        id: t.id,
        orderNum: tIdx + 1,
        title: t.title,
        summary: t.summary || '',
        examplesCount: Array.isArray(t.examples) ? t.examples.length : 0,
        exercisesCount: Array.isArray(t.exercises) ? t.exercises.length : 0,
        quizCount: Array.isArray(t.quiz) ? t.quiz.length : 0,
        estMinutes: estimateTopicMinutes(t, meta.baseMinutesPerTopic),
        studied: Boolean(studiedTopics[t.id])
      }));

      const totalMinutes = enrichedTopics.reduce((acc, t) => acc + t.estMinutes, 0);

      return {
        id: subj.id,
        name: subj.name,
        symbol: subj.symbol,
        color: subj.color,
        levelTag: subj.levelTag,
        shortDesc: subj.shortDesc,
        blockId: meta.blockId,
        blockLabel: meta.blockLabel,
        prerequisites: meta.prerequisites,
        order: meta.order,
        totalMinutes,
        durationLabel: formatDurationMinutes(totalMinutes),
        stats: st,
        topics: enrichedTopics
      };
    });
  }

  function buildSuggestedRoutes(curriculum, stats = {}) {
    const entries = buildCurriculumEntries(curriculum, stats);
    const byId = new Map(entries.map(e => [e.id, e]));

    return ROUTE_DEFINITIONS.map(route => {
      const steps = route.subjectIds
        .map((id, stepIdx) => {
          const entry = byId.get(id);
          if (!entry) return null;
          const prevStep = stepIdx > 0 ? byId.get(route.subjectIds[stepIdx - 1]) : null;
          return {
            subjectId: entry.id,
            name: entry.name,
            symbol: entry.symbol,
            color: entry.color,
            levelTag: entry.levelTag,
            percentage: entry.stats.percentage || 0,
            topicsCount: entry.topics.length,
            prereqLabel: prevStep ? `Req: ${prevStep.name}` : `Req: ${entry.prerequisites[0]}`
          };
        })
        .filter(Boolean);

      return {
        id: route.id,
        title: route.title,
        badge: route.badge,
        description: route.description,
        steps
      };
    });
  }

  function filterCurriculumEntries(entries, { query = '', blockId = 'todos' } = {}) {
    const q = String(query || '').trim().toLowerCase();
    const block = blockId || 'todos';

    return (entries || [])
      .filter(entry => block === 'todos' || entry.blockId === block)
      .map(entry => {
        if (!q) return entry;
        const subjectMatches =
          entry.name.toLowerCase().includes(q) ||
          entry.shortDesc.toLowerCase().includes(q) ||
          entry.levelTag.toLowerCase().includes(q) ||
          entry.blockLabel.toLowerCase().includes(q) ||
          entry.prerequisites.some(p => p.toLowerCase().includes(q));

        const matchingTopics = entry.topics.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q)
        );

        if (subjectMatches) {
          return entry;
        }
        if (matchingTopics.length > 0) {
          return Object.assign({}, entry, { topics: matchingTopics, filteredTopicsOnly: true });
        }
        return null;
      })
      .filter(Boolean);
  }

  ns.CurriculumIndex = {
    BLOCKS,
    SUBJECT_META,
    ROUTE_DEFINITIONS,
    getSubjectMeta,
    estimateTopicMinutes,
    formatDurationMinutes,
    buildCurriculumEntries,
    buildSuggestedRoutes,
    filterCurriculumEntries
  };
})(window.MatInteractiva);
