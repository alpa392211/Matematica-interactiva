'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Mock limpio de localStorage con progreso guardado previo (compatibilidad de esquema)
const mockStore = {
  matematica_interactiva_progreso_v1: JSON.stringify({
    xp: 35,
    streakDays: 2,
    lastVisited: { subjectId: 'derivadas', topicId: 'der-1', tab: 'teoria' },
    solvedExercises: {
      'der-1-ex1': { solvedAt: '2026-01-01T00:00:00Z', attempts: 1, hintsUsed: 0, level: 'basico', subjectId: 'derivadas', topicId: 'der-1' }
    },
    studiedTopics: { 'der-1': true },
    quizScores: {}
  })
};

global.localStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(mockStore, k) ? mockStore[k] : null),
  setItem: (k, v) => { mockStore[k] = String(v); },
  removeItem: (k) => { delete mockStore[k]; }
};

global.window = global.window || { MatInteractiva: {}, localStorage: global.localStorage };
global.window.localStorage = global.localStorage;
global.window.MatInteractiva.Curriculum = [];

require(path.resolve(__dirname, '../js/engine/math-parser.js'));
require(path.resolve(__dirname, '../js/engine/storage.js'));
require(path.resolve(__dirname, '../js/data/curriculum-part1.js'));
require(path.resolve(__dirname, '../js/data/curriculum-part2.js'));
require(path.resolve(__dirname, '../js/data/curriculum-part3.js'));

const MP = global.window.MatInteractiva.MathParser;
const Storage = global.window.MatInteractiva.Storage;
const curriculum = global.window.MatInteractiva.Curriculum;

function derivAt(expr, x) {
  return MP.numericalDerivative(MP.compileFunction(expr, 'RAD'), x);
}

function approxEq(a, b, tol = 1e-4) {
  assert.ok(Math.abs(a - b) <= tol, `Esperado ${a} ≈ ${b} (diff=${Math.abs(a - b)})`);
}

test('Fase 11: Verificación numérica y simbólica de los ejemplos ampliados de Derivadas (der-1 a der-4)', () => {
  // der-1 Ejemplo 1: f(x) = 3x^2 - 5x + 1 => f'(x) = 6x - 5
  for (const x of [-2, 0, 1.5, 4]) {
    approxEq(derivAt('3*x^2 - 5*x + 1', x), 6 * x - 5, 1e-4);
  }

  // der-1 Ejemplo 2: f(x) = sqrt(x) en x0 = 4 => f'(4) = 1/4 = 0.25, recta tangente y(4)=2
  approxEq(derivAt('sqrt(x)', 4), 0.25, 1e-5);
  approxEq(0.25 * 4 + 1, Math.sqrt(4), 1e-9);

  // der-1 Ejemplo 3: Física s(t) = 5t^2 + 3t y Economía C(q) = 0.2q^2 + 12q + 500
  const s2 = MP.evaluate('5*t^2 + 3*t', { t: 2 }, 'RAD');
  const s4 = MP.evaluate('5*t^2 + 3*t', { t: 4 }, 'RAD');
  approxEq((s4 - s2) / (4 - 2), 33, 1e-9);
  approxEq(derivAt('5*x^2 + 3*x', 2), 23, 1e-4);
  approxEq(derivAt('0.2*x^2 + 12*x + 500', 50), 32, 1e-3);

  // der-1 Ejemplo 4: f(x) = 1/x en x0 = 2, tangente, normal y aproximación lineal L(2.05) = 0.4875
  approxEq(derivAt('1/x', 2), -0.25, 1e-5);
  const L205 = 0.5 + (-0.25) * (2.05 - 2);
  approxEq(L205, 0.4875, 1e-9);

  // der-1 Ejemplo 5: f(x) = |x - 3| laterales en 3 y derivada en 5
  const h = 1e-5;
  approxEq((MP.evaluate('abs(x - 3)', { x: 3 + h }) - 0) / h, 1, 1e-4);
  approxEq((MP.evaluate('abs(x - 3)', { x: 3 - h }) - 0) / (-h), -1, 1e-4);
  approxEq(derivAt('abs(x - 3)', 5), 1, 1e-4);

  // der-2 Ejemplo 3: f(x) = (x^2 + 1)*exp(x) => f'(x) = (x+1)^2*exp(x)
  approxEq(derivAt('(x^2 + 1)*exp(x)', 0), 1, 1e-4);
  approxEq(derivAt('(x^2 + 1)*exp(x)', 1), 4 * Math.E, 1e-3);

  // der-2 Ejemplo 4: f(x) = ((2x - 1)/(x + 1))^3 en x = 2 => f'(2) = 1
  approxEq(derivAt('((2*x - 1)/(x + 1))^3', 2), 1, 1e-4);

  // der-3 Ejemplo 3: xe^y + 2y = 3x => en (0,0), y'(0) = (3 - e^0)/(0 + 2) = 1
  const eps = 1e-5;
  const resImp = eps * Math.exp(eps) + 2 * eps - 3 * eps;
  approxEq(resImp, 0, 1e-8);

  // der-4 Ejemplo 3: f(x) = x^4 - 4x^3 => críticos en 0 y 3, f(3) = -27
  approxEq(derivAt('x^4 - 4*x^3', 0), 0, 1e-6);
  approxEq(derivAt('x^4 - 4*x^3', 3), 0, 1e-4);
  approxEq(MP.evaluate('x^4 - 4*x^3', { x: 3 }), -27, 1e-9);

  // der-4 Ejemplo 4: TVM en f(x) = x^3 - x sobre [0, 2]
  const meanSlope = (MP.evaluate('x^3 - x', { x: 2 }) - MP.evaluate('x^3 - x', { x: 0 })) / 2;
  const cTVM = 2 / Math.sqrt(3);
  approxEq(meanSlope, 3, 1e-9);
  approxEq(derivAt('x^3 - x', cTVM), meanSlope, 1e-4);
});

test('Fase 11: Verificación de respuestas de ejercicios de Derivadas y compatibilidad con progreso existente', () => {
  const derivadas = curriculum.find(s => s.id === 'derivadas');
  assert.ok(derivadas);
  for (const topic of derivadas.topics) {
    assert.ok(topic.theory.theorems && topic.theory.theorems.length >= 1, `Faltan teoremas en ${topic.id}`);
    assert.ok(topic.examples.length >= 3, `Se esperaban >= 3 ejemplos en ${topic.id}`);
    for (const ex of topic.exercises) {
      const check = MP.checkStudentAnswer(ex.answer, ex.answer, ex.alternatives, ex);
      assert.equal(check.isCorrect, true, `Respuesta fallida en ${ex.id}: ${ex.answer}`);
      for (const alt of (ex.alternatives || [])) {
        const altCheck = MP.checkStudentAnswer(alt, ex.answer, ex.alternatives, ex);
        assert.equal(altCheck.isCorrect, true, `Alternativa fallida en ${ex.id}: ${alt}`);
      }
    }
  }

  // Compatibilidad con IDs originales y cálculo real de progreso con ejercicios nuevos
  const stats = Storage.computeProgressStats(curriculum);
  assert.equal(stats.xp, 35);
  assert.equal(stats.bySubject.derivadas.exercisesSolved, 1);
  assert.ok(stats.bySubject.derivadas.exercisesTotal >= 15);
  assert.ok(stats.globalPercentage >= 0 && stats.globalPercentage <= 100);
});

function integAt(expr, a, b) {
  return MP.numericalIntegral(MP.compileFunction(expr, 'RAD'), a, b, 200);
}

test('Fase 12: Verificación numérica de los ejemplos nuevos en Aritmética, Álgebra, Geometría, Trigonometría, Funciones, Límites e Integrales', () => {
  // Aritmética (arit-1 Ej3, arit-2 Ej2)
  approxEq(MP.evaluate('(3/4)^(-2) - sqrt(64)*2^(-2)'), -2 / 9, 1e-9);
  approxEq((6 * 10) / 4, 15, 1e-9);

  // Álgebra (alg-1 Ej3, alg-2 Ej3, alg-3 Ej2 y Ej3)
  approxEq(MP.evaluate('x^4 - 16', { x: 2 }), 0, 1e-9);
  approxEq(MP.evaluate('x^4 - 16', { x: -2 }), 0, 1e-9);
  approxEq(MP.evaluate('(sqrt(x+1) - sqrt(3*x - 1))/(x - 1)', { x: 1.00001 }), -1 / Math.sqrt(2), 1e-4);
  assert.equal(3 * 4 + 2 * 2, 16);
  assert.equal(2 * 4 - 2, 6);
  approxEq(MP.evaluate('9*x^2 - 12*x + 4', { x: 2 / 3 }), 0, 1e-9);

  // Geometría (geo-1 Ej2, geo-2 Ej2)
  approxEq((4 / 3) * Math.PI * 27, 36 * Math.PI, 1e-9);
  approxEq(Math.hypot(4 - (-2), 9 - 1), 10, 1e-9);
  approxEq(-0.75 * 1 + 23 / 4, 5, 1e-9);

  // Trigonometría (trig-1 Ej2, trig-2 Ej2)
  const rad240 = (4 * Math.PI) / 3;
  approxEq(Math.cos(rad240), -0.5, 1e-9);
  approxEq(Math.sin(rad240), -Math.sqrt(3) / 2, 1e-9);
  approxEq(Math.tan(rad240), Math.sqrt(3), 1e-9);
  approxEq(Math.sqrt(5 ** 2 + 8 ** 2 - 2 * 5 * 8 * Math.cos(Math.PI / 3)), 7, 1e-9);

  // Funciones (func-2 Ej2)
  approxEq(Math.log(5) + Math.log(5 - 3), Math.log(10), 1e-9);

  // Límites (lim-2 Ej3, lim-3 Ej3, lim-4 Ej3)
  approxEq(MP.evaluate('(x^3 - 8)/(x^2 - 4)', { x: 2.0001 }), 3, 1e-3);
  approxEq(MP.evaluate('sqrt(4*x^2 + 3)/(x - 1)', { x: -10000 }), -2, 1e-3);
  approxEq(MP.evaluate('(1 - cos(2*x))/(x^2)', { x: 0.0001 }), 2, 1e-4);

  // Integrales y Cálculo (int-1 Ej3, int-2 Ej3, int-3 Ej3, calc-1 Ej2 y Ej3, calc-2 Ej2 y Ej3)
  approxEq(derivAt('x^3/3 + 2*x + 3*sin(x) - 2*exp(x)', 1.2), MP.evaluate('(1.2^3 + 2*1.2)/1.2 + 3*cos(1.2) - 2*exp(1.2)'), 1e-4);
  approxEq(derivAt('x*ln(x) - x', 2.5), Math.log(2.5), 1e-4);
  approxEq(integAt('x^2', 0, 3) / 3, 3, 1e-5);
  approxEq(integAt('(x + 2) - x^2', -1, 2), 4.5, 1e-4);
  approxEq(MP.evaluate('t^3 - 2*t^2 + 2*t + 5', { t: 2 }), 9, 1e-9);
  approxEq(MP.evaluate('100*exp(-0.2*t)', { t: 5 }), 100 / Math.E, 1e-9);
  approxEq(MP.evaluate('sqrt(x^2 + 16)', { x: 3 }), 5, 1e-9);
});

test('Fase 12: Cobertura mínima de teoremas, ejemplos y respuestas válidas en los 24 temas', () => {
  assert.equal(curriculum.length, 9);
  const minThreeSubjects = new Set(['algebra', 'limites', 'derivadas', 'integrales', 'calculo']);

  for (const subj of curriculum) {
    for (const topic of subj.topics) {
      assert.ok(Array.isArray(topic.theory.theorems) && topic.theory.theorems.length >= 1, `Falta teorema en ${topic.id}`);
      const minEx = minThreeSubjects.has(subj.id) ? 3 : 2;
      assert.ok(topic.examples.length >= minEx, `${topic.id} tiene ${topic.examples.length} ejemplos, mínimo ${minEx}`);

      for (const ex of topic.exercises) {
        const chk = MP.checkStudentAnswer(ex.answer, ex.answer, ex.alternatives, ex);
        assert.equal(chk.isCorrect, true, `Respuesta inválida en ${ex.id}: ${ex.answer}`);
      }
    }
  }
});
