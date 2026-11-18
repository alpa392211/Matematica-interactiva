const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadPrepMatContext() {
  const root = path.resolve(__dirname, '..');
  const ctx = { MatInteractiva: {} };
  const files = [
    'js/engine/math-parser.js',
    'js/engine/math-renderer.js',
    'js/data/curriculum-part1.js',
    'js/data/curriculum-part2.js',
    'js/data/curriculum-part3.js',
    'js/tools/prepmat.js'
  ];

  global.window = ctx;
  for (const rel of files) {
    const src = fs.readFileSync(path.join(root, rel), 'utf8');
    const fn = new Function('window', src);
    fn(ctx);
  }
  return ctx.MatInteractiva;
}

test('PrepMat expone 9 ramas tematicas válidas enlazadas al currículo de MateTic', () => {
  const ns = loadPrepMatContext();
  const PM = ns.PrepMatTool;
  assert.ok(PM, 'Debe existir MatInteractiva.PrepMatTool');
  assert.equal(PM.TOPICS.length, 9, 'Deben existir exactamente 9 ramas tematicas');

  const ids = PM.TOPICS.map((t) => t.id);
  for (const required of [
    'aritmetica',
    'algebra',
    'geometria_euclidiana',
    'trigonometria',
    'geometria_analitica',
    'funciones',
    'calculo_diferencial',
    'calculo_integral',
    'algebra_lineal_edo'
  ]) {
    assert.ok(ids.includes(required), `Falta la rama requerida: ${required}`);
  }

  const subjMap = new Map(ns.Curriculum.map((s) => [s.id, s]));
  for (const topic of PM.TOPICS) {
    assert.ok(topic.curriculum && subjMap.has(topic.curriculum.subjectId),
      `Enlace curricular inválido en ${topic.id}`);
    const targetSubj = subjMap.get(topic.curriculum.subjectId);
    assert.ok(targetSubj.topics.some((t) => t.id === topic.curriculum.topicId),
      `topicId curricular inválido en ${topic.id}: ${topic.curriculum.topicId}`);
  }
});

test('QuestionGenerator genera reactivos válidos (0 NaN, 4 opciones únicas y desarrollo analítico) en Bachillerato y Licenciatura', () => {
  const ns = loadPrepMatContext();
  const PM = ns.PrepMatTool;
  const G = PM.QuestionGenerator;

  for (const t of PM.TOPICS) {
    for (const lvl of ['bachillerato', 'licenciatura']) {
      for (const diff of ['sencilla', 'media', 'alta']) {
        for (let i = 0; i < 40; i++) {
          const q = G.generate(t.id, lvl, diff);
          assert.equal(typeof q.question, 'string');
          assert.ok(q.question.length > 10, `Pregunta demasiado corta en ${t.id}`);
          assert.ok(Array.isArray(q.options) && q.options.length === 4, `Opciones inválidas en ${t.id}`);
          assert.equal(new Set(q.options).size, 4, `Opciones repetidas en ${t.id} (${lvl}/${diff})`);
          assert.ok(typeof q.explanation === 'string' && q.explanation.length >= 80,
            `Explicación analítica corta en ${t.id} (${lvl}/${diff}): ${q.explanation}`);

          const blob = q.question + q.options.join(' ') + q.explanation;
          assert.ok(!/NaN|undefined|Infinity/.test(blob),
            `Valor numérico inválido en ${t.id}: ${blob}`);
          assert.ok(!/\\\$/.test(blob),
            `Símbolo \\$ que rompe delimitador LaTeX encontrado en ${t.id}`);
        }
      }
    }
  }
});

test('ExamEngine crea simulacros progresivos sin enunciados repetidos y evalúa diagnóstico', () => {
  const ns = loadPrepMatContext();
  const PM = ns.PrepMatTool;
  const E = PM.ExamEngine;

  const exam30 = E.createExam({ topic: 'general', level: 'licenciatura', mode: 'simulacro', count: 30 });
  assert.equal(exam30.questions.length, 30);

  const normalizedSet = new Set(exam30.questions.map((q) => E.normalizeStatement(q.question)));
  assert.equal(normalizedSet.size, 30, 'No deben repetirse enunciados dentro de un examen de 30 reactivos');

  // Responder todos alternando acierto / error
  let expectedCorrect = 0;
  exam30.questions.forEach((q, idx) => {
    const pickIdx = idx % 2 === 0 ? q.correctIndex : (q.correctIndex + 1) % 4;
    if (pickIdx === q.correctIndex) expectedCorrect++;
    E.submitAnswer(pickIdx, (idx + 1) * 10);
    if (idx < exam30.questions.length - 1) E.nextQuestion();
  });

  const summary = E.computeSummary();
  assert.equal(summary.total, 30);
  assert.equal(summary.correct, expectedCorrect);
  assert.equal(summary.percentage, Math.round((expectedCorrect / 30) * 100));
  assert.ok(Object.keys(summary.byTopic).length >= 3, 'El simulacro general debe abarcar múltiples ramas');
});

test('PrepMat incluye >= 6 generadores de enunciado por rama y filtro styleFilter funcional', () => {
  const ns = loadPrepMatContext();
  const PM = ns.PrepMatTool;
  const G = PM.QuestionGenerator;
  const E = PM.ExamEngine;

  for (const topic of PM.TOPICS) {
    const wpFactories = new Set();
    for (const diff of ['sencilla', 'media', 'alta']) {
      for (const lvl of ['bachillerato', 'licenciatura']) {
        G.getFactories(topic.id, diff, lvl, 'word').forEach((fn) => wpFactories.add(fn));
      }
    }
    assert.ok(
      wpFactories.size >= 6,
      `La rama ${topic.id} debe tener al menos 6 generadores de enunciado (tiene ${wpFactories.size})`
    );

    const examWord = E.createExam({
      topic: topic.id,
      level: 'all',
      mode: 'training',
      count: 10,
      styleFilter: 'word'
    });
    assert.equal(examWord.questions.length, 10);
    assert.ok(
      examWord.questions.every((q) => q.isWordProblem === true),
      `El modo "word" en ${topic.id} no debe mezclar reactivos sin enunciado`
    );

    const directQ = G.generate(topic.id, 'bachillerato', 'media', 'direct');
    assert.equal(directQ.isWordProblem, false, `El filtro "direct" en ${topic.id} debe generar cálculo directo`);
  }
});
