'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

global.window = global.window || { MatInteractiva: {} };
global.window.MatInteractiva.Curriculum = [];

require(path.resolve(__dirname, '../js/data/curriculum-part1.js'));
require(path.resolve(__dirname, '../js/data/curriculum-part2.js'));
require(path.resolve(__dirname, '../js/data/curriculum-part3.js'));

const curriculum = global.window.MatInteractiva.Curriculum;

test('Fase 5: El currículo completo carga las 9 materias sin errores', () => {
  assert.equal(curriculum.length, 9);
  const ids = curriculum.map(s => s.id);
  assert.deepEqual(ids, [
    'aritmetica',
    'algebra',
    'geometria',
    'trigonometria',
    'funciones',
    'limites',
    'derivadas',
    'integrales',
    'calculo'
  ]);
});

test('Fase 5: Verificación de rigor didáctico y enlaces al graficador en Límites y Derivadas', () => {
  const limites = curriculum.find(s => s.id === 'limites');
  const derivadas = curriculum.find(s => s.id === 'derivadas');
  const lim1 = limites.topics.find(t => t.id === 'lim-1');
  const lim4 = limites.topics.find(t => t.id === 'lim-4');
  const der1 = derivadas.topics.find(t => t.id === 'der-1');

  assert.match(lim1.theory.detailedExplanation[0], /\\forall \\varepsilon > 0/);
  assert.match(lim1.theory.detailedExplanation[0], /\\delta = \\delta\(\\varepsilon\)/);
  assert.match(lim1.theory.detailedExplanation[0], /Unicidad del Límite/);
  assert.ok(lim1.theory.concepts.some(c => Boolean(c.graphPayload)));
  assert.ok(lim1.theory.formulas.some(f => Boolean(f.graphPayload)));

  assert.match(lim4.theory.detailedExplanation[2], /Evitable o Removible/);
  assert.match(lim4.theory.detailedExplanation[2], /De Salto Finito/);
  assert.match(lim4.theory.detailedExplanation[2], /Esencial/);

  assert.ok(!/Cociente incremental de Newton-Leibniz/.test(der1.summary));
  assert.match(der1.theory.concepts[3].body, /\|x\|/);
  assert.ok(der1.theory.concepts.some(c => c.graphPayload && c.graphPayload.expr === 'abs(x)'));
  assert.ok(der1.examples.every(ex => Boolean(ex.graphPayload)));
});

test('Fase 9: CurriculumIndex genera el índice completo de las 9 materias, sus 24 temas, rutas y filtros', () => {
  require(path.resolve(__dirname, '../js/engine/curriculum-index.js'));
  const idx = global.window.MatInteractiva.CurriculumIndex;
  assert.ok(idx, 'Debe existir MatInteractiva.CurriculumIndex');

  const entries = idx.buildCurriculumEntries(curriculum, {});
  assert.equal(entries.length, curriculum.length);
  const totalIndexedTopics = entries.reduce((acc, e) => acc + e.topics.length, 0);
  const totalCurriculumTopics = curriculum.reduce((acc, s) => acc + s.topics.length, 0);
  assert.equal(totalIndexedTopics, totalCurriculumTopics);
  assert.ok(totalIndexedTopics >= 24);

  for (const entry of entries) {
    assert.ok(entry.blockId && entry.blockLabel, `Falta bloque en ${entry.id}`);
    assert.ok(Array.isArray(entry.prerequisites) && entry.prerequisites.length >= 1, `Faltan prerrequisitos en ${entry.id}`);
    assert.ok(entry.durationLabel && entry.totalMinutes > 0, `Falta duración estimada en ${entry.id}`);
  }

  const routes = idx.buildSuggestedRoutes(curriculum, {});
  assert.ok(routes.length >= 2);
  const validIds = new Set(curriculum.map(s => s.id));
  for (const r of routes) {
    assert.ok(r.steps.length >= 4);
    for (const step of r.steps) {
      assert.ok(validIds.has(step.subjectId));
      assert.ok(step.prereqLabel);
    }
  }

  const filtered = idx.filterCurriculumEntries(entries, { query: 'racionalización', blockId: 'todos' });
  assert.ok(filtered.some(e => e.id === 'algebra' || e.id === 'limites'));

  const calcOnly = idx.filterCurriculumEntries(entries, { query: '', blockId: 'calculo' });
  assert.ok(calcOnly.every(e => e.blockId === 'calculo'));
  assert.equal(calcOnly.length, 4);
});
