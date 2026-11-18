'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.resolve(__dirname, '..');

function loadEnrichedCurriculumAndRenderer() {
  const sandbox = {
    console,
    Math,
    Date,
    Number,
    String,
    Array,
    Object,
    RegExp,
    Error,
    Set,
    Map,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    window: null,
    globalThis: null
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.window.MatInteractiva = { Curriculum: [] };

  const files = [
    'vendor/katex/katex.min.js',
    'js/engine/math-renderer.js',
    'js/data/curriculum-part1.js',
    'js/data/curriculum-part2.js',
    'js/data/curriculum-part3.js',
    'js/data/curriculum-enrichment-1.js',
    'js/data/curriculum-enrichment-2.js',
    'js/data/curriculum-enrichment-3.js'
  ];

  const ctx = vm.createContext(sandbox);
  for (const rel of files) {
    const src = fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8');
    vm.runInContext(src, ctx, { filename: rel });
  }

  return {
    curriculum: sandbox.window.MatInteractiva.Curriculum,
    mathRenderer: sandbox.window.MatInteractiva.MathRenderer,
    katex: sandbox.katex
  };
}

function assertValidRichLatex(str, label, katex, mathRenderer) {
  assert.equal(typeof str, 'string', `${label}: debe ser string`);
  assert.ok(str.trim().length > 0, `${label}: no debe estar vacío`);

  const ctrlMatch = str.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/);
  assert.equal(
    ctrlMatch,
    null,
    `${label}: contiene carácter de control (posible backslash sin escapar en LaTeX) -> ${JSON.stringify(str)}`
  );

  // Verificar delimitadores $...$ y $$...$$ balanceados (ignorando \$ escapado)
  const sanitized = str.replace(/\$\$/g, '@@').replace(/\\\$/g, '');
  const singleDollarMatches = sanitized.match(/\$/g) || [];
  assert.equal(
    singleDollarMatches.length % 2,
    0,
    `${label}: delimitadores $ desbalanceados -> ${str}`
  );
  const blockDollarMatches = str.replace(/\\\$/g, '').match(/\$\$/g) || [];
  assert.equal(
    blockDollarMatches.length % 2,
    0,
    `${label}: delimitadores $$ desbalanceados -> ${str}`
  );

  // Verificar renderizado KaTeX real en bloques $$...$$ y en línea $...$
  const rendered = mathRenderer.formatRichText(str);
  assert.doesNotMatch(
    rendered,
    /katex-error|color:#cc0000/,
    `${label}: error de parseo KaTeX al renderizar -> ${str}`
  );

  for (const m of str.matchAll(/\$\$([^$]+)\$\$/g)) {
    assert.doesNotThrow(
      () => katex.renderToString(m[1], { displayMode: true, throwOnError: true }),
      `${label}: error estricto KaTeX en bloque -> ${m[1]}`
    );
  }
  const withoutBlocks = str.replace(/\$\$[\s\S]*?\$\$/g, '');
  for (const m of withoutBlocks.matchAll(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g)) {
    assert.doesNotThrow(
      () => katex.renderToString(m[1], { displayMode: false, throwOnError: true }),
      `${label}: error estricto KaTeX en línea -> ${m[1]}`
    );
  }
}

test('Todos los 24 temas tienen explicaciones en palabras sencillas y múltiples formas de resolver', () => {
  const { curriculum } = loadEnrichedCurriculumAndRenderer();
  assert.equal(curriculum.length, 9);

  const allTopics = curriculum.flatMap((s) => s.topics.map((t) => ({ subject: s, topic: t })));
  assert.equal(allTopics.length, 24);

  const calcSubjects = new Set(['limites', 'derivadas', 'integrales', 'calculo']);

  for (const { subject, topic } of allTopics) {
    const id = `${subject.id}/${topic.id}`;
    const th = topic.theory;
    assert.ok(th, `${id}: debe tener theory`);

    assert.equal(typeof th.simpleIntro, 'string', `${id}: falta simpleIntro`);
    assert.ok(th.simpleIntro.trim().length > 15, `${id}: simpleIntro demasiado corto`);

    assert.equal(typeof th.simplePrereqs, 'string', `${id}: falta simplePrereqs`);
    assert.ok(th.simplePrereqs.trim().length > 15, `${id}: simplePrereqs demasiado corto`);

    assert.ok(Array.isArray(th.detailedSimple), `${id}: falta detailedSimple`);
    assert.equal(
      th.detailedSimple.length,
      th.detailedExplanation.length,
      `${id}: detailedSimple debe coincidir con detailedExplanation`
    );
    th.detailedSimple.forEach((p, idx) => {
      assert.ok(typeof p === 'string' && p.trim().length > 15, `${id}: detailedSimple[${idx}] vacío`);
    });

    for (const [key, list] of [
      ['concepts', th.concepts || []],
      ['theorems', th.theorems || []],
      ['formulas', th.formulas || []],
      ['commonMistakes', th.commonMistakes || []]
    ]) {
      list.forEach((item, idx) => {
        assert.ok(
          typeof item.simple === 'string' && item.simple.trim().length > 10,
          `${id}.${key}[${idx}]: falta campo .simple`
        );
      });
    }

    assert.ok(Array.isArray(topic.solvingApproaches), `${id}: falta solvingApproaches`);
    const minApproaches = calcSubjects.has(subject.id) ? 4 : 3;
    assert.ok(
      topic.solvingApproaches.length >= minApproaches,
      `${id}: se esperaban >= ${minApproaches} formas de resolver, tiene ${topic.solvingApproaches.length}`
    );

    topic.solvingApproaches.forEach((ap, idx) => {
      assert.ok(ap.title && ap.title.trim().length > 3, `${id}.solvingApproaches[${idx}]: falta title`);
      assert.ok(ap.when && ap.when.trim().length > 8, `${id}.solvingApproaches[${idx}]: falta when`);
      assert.ok(ap.idea && ap.idea.trim().length > 10, `${id}.solvingApproaches[${idx}]: falta idea`);
      assert.ok(ap.simple && ap.simple.trim().length > 10, `${id}.solvingApproaches[${idx}]: falta simple`);
      assert.ok(Array.isArray(ap.steps) && ap.steps.length >= 2, `${id}.solvingApproaches[${idx}]: faltan steps (>=2)`);
    });

    assert.ok(Array.isArray(topic.examples) && topic.examples.length >= 1, `${id}: faltan ejemplos`);
    const minAlts = calcSubjects.has(subject.id) ? 2 : 1;
    topic.examples.forEach((ex, exIdx) => {
      assert.ok(typeof ex.simple === 'string' && ex.simple.trim().length > 10, `${id}.examples[${exIdx}]: falta .simple`);
      assert.ok(
        Array.isArray(ex.alternativeMethods) && ex.alternativeMethods.length >= minAlts,
        `${id}.examples[${exIdx}]: se esperaban >= ${minAlts} alternativeMethods`
      );
      ex.alternativeMethods.forEach((am, amIdx) => {
        const prefix = `${id}.examples[${exIdx}].alternativeMethods[${amIdx}]`;
        assert.ok(am.title && am.title.trim().length > 3, `${prefix}: falta title`);
        assert.ok(am.badge && am.badge.trim().length > 3, `${prefix}: falta badge`);
        assert.ok(am.when && am.when.trim().length > 10, `${prefix}: falta when`);
        assert.ok(am.simple && am.simple.trim().length > 10, `${prefix}: falta simple`);
        assert.ok(Array.isArray(am.steps) && am.steps.length >= 2, `${prefix}: faltan steps (>=2)`);
        assert.ok(am.result && String(am.result).trim().length > 0, `${prefix}: falta result`);
      });
    });
  }
});

test('Derivadas incluye la forma con t - x (t -> x) además de h -> 0 en métodos de teoría y ejemplos', () => {
  const { curriculum } = loadEnrichedCurriculumAndRenderer();
  const derivadas = curriculum.find((s) => s.id === 'derivadas');
  const der1 = derivadas.topics.find((t) => t.id === 'der-1');
  assert.ok(der1, 'Debe existir der-1');

  const approachesText = der1.solvingApproaches
    .map((ap) => [ap.badge, ap.title, ap.when, ap.idea, ...(ap.steps || []), ap.miniExample].join(' '))
    .join('\n');
  assert.match(approachesText, /t\s*[-–]\s*x|t\s*\\to\s*x/, 'der-1 solvingApproaches debe incluir la forma con (t - x) / t -> x');
  assert.match(approachesText, /h\s*\\to\s*0/, 'der-1 solvingApproaches debe incluir h -> 0');

  const examplesMethodsText = der1.examples
    .flatMap((e) => e.alternativeMethods || [])
    .map((am) => [am.badge, am.title, am.when, ...(am.steps || []), am.result].join(' '))
    .join('\n');
  assert.match(examplesMethodsText, /t\s*[-–]\s*x|t\s*\\to\s*x/, 'der-1 examples.alternativeMethods debe resolver usando (t - x) / t -> x');
});

test('Todos los textos enriquecidos y fórmulas LaTeX renderizan en KaTeX sin errores ni backslashes rotos', () => {
  const { curriculum, katex, mathRenderer } = loadEnrichedCurriculumAndRenderer();

  for (const subject of curriculum) {
    for (const topic of subject.topics) {
      const base = `${subject.id}/${topic.id}`;
      const th = topic.theory;

      assertValidRichLatex(th.simpleIntro, `${base}.simpleIntro`, katex, mathRenderer);
      assertValidRichLatex(th.simplePrereqs, `${base}.simplePrereqs`, katex, mathRenderer);
      (th.detailedSimple || []).forEach((s, i) => assertValidRichLatex(s, `${base}.detailedSimple[${i}]`, katex, mathRenderer));

      (th.concepts || []).forEach((c, i) => assertValidRichLatex(c.simple, `${base}.concepts[${i}].simple`, katex, mathRenderer));
      (th.theorems || []).forEach((t, i) => assertValidRichLatex(t.simple, `${base}.theorems[${i}].simple`, katex, mathRenderer));
      (th.formulas || []).forEach((f, i) => assertValidRichLatex(f.simple, `${base}.formulas[${i}].simple`, katex, mathRenderer));
      (topic.commonMistakes || []).forEach((m, i) => assertValidRichLatex(m.simple, `${base}.commonMistakes[${i}].simple`, katex, mathRenderer));

      (topic.solvingApproaches || []).forEach((ap, i) => {
        const p = `${base}.solvingApproaches[${i}]`;
        assertValidRichLatex(ap.badge, `${p}.badge`, katex, mathRenderer);
        assertValidRichLatex(ap.title, `${p}.title`, katex, mathRenderer);
        assertValidRichLatex(ap.when, `${p}.when`, katex, mathRenderer);
        assertValidRichLatex(ap.idea, `${p}.idea`, katex, mathRenderer);
        assertValidRichLatex(ap.simple, `${p}.simple`, katex, mathRenderer);
        (ap.steps || []).forEach((st, j) => assertValidRichLatex(st, `${p}.steps[${j}]`, katex, mathRenderer));
        if (ap.miniExample) {
          assertValidRichLatex(ap.miniExample, `${p}.miniExample`, katex, mathRenderer);
        }
      });

      (topic.examples || []).forEach((ex, i) => {
        const ep = `${base}.examples[${i}]`;
        assertValidRichLatex(ex.simple, `${ep}.simple`, katex, mathRenderer);
        (ex.alternativeMethods || []).forEach((am, j) => {
          const mp = `${ep}.alternativeMethods[${j}]`;
          assertValidRichLatex(am.badge, `${mp}.badge`, katex, mathRenderer);
          assertValidRichLatex(am.title, `${mp}.title`, katex, mathRenderer);
          assertValidRichLatex(am.when, `${mp}.when`, katex, mathRenderer);
          assertValidRichLatex(am.simple, `${mp}.simple`, katex, mathRenderer);
          (am.steps || []).forEach((st, k) => assertValidRichLatex(st, `${mp}.steps[${k}]`, katex, mathRenderer));
          assertValidRichLatex(am.result, `${mp}.result`, katex, mathRenderer);
        });
      });
    }
  }
});

test('index.html y js/app.js integran la sección de Múltiples Métodos y botones de palabras sencillas', () => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const appCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');

  assert.match(html, /js\/data\/curriculum-enrichment-1\.js/);
  assert.match(html, /js\/data\/curriculum-enrichment-2\.js/);
  assert.match(html, /js\/data\/curriculum-enrichment-3\.js/);

  assert.match(appCode, /id="sec-metodos"/);
  assert.match(appCode, /simple-explain-btn/);
  assert.match(appCode, /alt-methods-details/);
  assert.match(appCode, /solvingApproaches/);
});
