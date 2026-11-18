'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Entorno simulado del navegador para cargar módulos IIFE sin bundler
global.window = { MatInteractiva: {} };
require(path.resolve(__dirname, '../js/engine/math-parser.js'));
require(path.resolve(__dirname, '../js/engine/step-solver.js'));

const { MathParser, StepSolver } = global.window.MatInteractiva;

function assertApprox(actual, expected, tol = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `Se esperaba ${expected} (±${tol}), pero se obtuvo ${actual}`
  );
}

test('Caracterización MathParser.evaluate en modo DEG: casos mínimos obligatorios', () => {
  assertApprox(MathParser.evaluate('sen(30)', { ans: 0 }, 'DEG'), 0.5);
  assertApprox(MathParser.evaluate('sin 30', { ans: 0 }, 'DEG'), 0.5);
  assertApprox(MathParser.evaluate('2sin(30)', { ans: 0 }, 'DEG'), 1);
  assertApprox(MathParser.evaluate('sin(30)^2', { ans: 0 }, 'DEG'), 0.25);
  assert.equal(MathParser.evaluate('3!', { ans: 0 }, 'DEG'), 6);
  assert.equal(MathParser.evaluate('sqrt(16)', { ans: 0 }, 'DEG'), 4);
  assertApprox(MathParser.evaluate('ln(e)', { ans: 0 }, 'DEG'), 1);
  assert.equal(MathParser.evaluate('2(3+4)', { ans: 0 }, 'DEG'), 14);
  assert.ok(Number.isNaN(MathParser.evaluate('5/0', { ans: 0 }, 'DEG')));
});

test('Caracterización MathParser.evaluate: errores esperados', () => {
  assert.throws(() => MathParser.evaluate('sin(30', { ans: 0 }, 'DEG'));
  assert.throws(() => MathParser.evaluate('sin()', { ans: 0 }, 'DEG'));
  assert.throws(() => MathParser.evaluate('30 sin', { ans: 0 }, 'DEG'));
});

test('Caracterización MathParser: modo RAD, variables, LaTeX y raíces n-ésimas', () => {
  assertApprox(MathParser.evaluate('sin(pi/6)', { ans: 0 }, 'RAD'), 0.5);
  assertApprox(MathParser.evaluate('cos(0)', { ans: 0 }, 'RAD'), 1);
  assert.equal(MathParser.evaluate('2*ans + 5', { ans: 10 }, 'DEG'), 25);
  assertApprox(MathParser.evaluate('\\frac{3+5}{2}', { ans: 0 }, 'RAD'), 4);
  assertApprox(MathParser.evaluate('raiz(3, 27)', { ans: 0 }, 'RAD'), 3);
  assert.equal(MathParser.evaluate('abs(-7)', { ans: 0 }, 'RAD'), 7);
});

test('Caracterización MathParser: derivación, integración y búsqueda de raíces', () => {
  const fnQuad = MathParser.compileFunction('x^2', 'RAD');
  assertApprox(MathParser.numericalDerivative(fnQuad, 3), 6, 1e-6);
  assertApprox(MathParser.numericalIntegral(fnQuad, 0, 3), 9, 1e-5);

  const fnPoly = MathParser.compileFunction('x^2 - 4', 'RAD');
  const roots = MathParser.findRoots(fnPoly, -5, 5);
  assert.deepEqual(roots, [-2, 2]);
});

test('Caracterización MathParser.checkStudentAnswer: equivalencia y diagnósticos', () => {
  const exact = MathParser.checkStudentAnswer('2x + 4', '2*x + 4', ['2x+4']);
  assert.equal(exact.isCorrect, true);

  const algebraic = MathParser.checkStudentAnswer('x^2 - 9', '(x-3)*(x+3)', []);
  assert.equal(algebraic.isCorrect, false);
  assert.equal(algebraic.feedbackType, 'unfactored');

  const factored = MathParser.checkStudentAnswer('(x+3)(x-3)', '(x-3)(x+3)', []);
  assert.equal(factored.isCorrect, true);

  const signErr = MathParser.checkStudentAnswer('-8', '8', []);
  assert.equal(signErr.isCorrect, false);
  assert.equal(signErr.feedbackType, 'sign-error');
});

test('Caracterización StepSolver: fracciones, ecuación lineal y cuadrática', () => {
  const frac = StepSolver.solveFractions(1, 2, '+', 1, 3);
  assert.equal(frac.finalAnswer, '5/6');
  assert.ok(frac.steps.length >= 3);

  const lin = StepSolver.solveLinearEquation(5, -3, 2, 9);
  assert.equal(lin.finalAnswer, '4');

  const quad = StepSolver.solveQuadraticEquation(1, -5, 6);
  assert.equal(quad.finalAnswer, '3, 2');
  assert.ok(quad.problemMath && quad.problemMath.includes('x^2'));
});

test('v1.2.4 StepSolver: formato KaTeX completo en problemMath, títulos y justificaciones de los 7 modos', () => {
  const cases = [
    StepSolver.solveFractions(3, 4, '+', 5, 6),
    StepSolver.solveGcdLcm(36, 48),
    StepSolver.solveLinearEquation(5, -3, 2, 9),
    StepSolver.solveQuadraticEquation(1, -5, 6),
    StepSolver.solveSystem2x2(2, 1, 8, 1, -1, 1),
    StepSolver.solveRightTriangle(6, 8),
    StepSolver.solveCalculusFunction('x^2 + 2*x + 1', 1, 0, 3)
  ];

  for (const sol of cases) {
    assert.ok(typeof sol.problemMath === 'string' && sol.problemMath.length > 0, 'Cada solución debe incluir problemMath');
    assert.ok(sol.problemTitle.includes('$'), `problemTitle debe formatear símbolos en LaTeX: ${sol.problemTitle}`);
    assert.equal(sol.problemTitle.includes('*'), false, `problemTitle no debe contener asteriscos crudos: ${sol.problemTitle}`);
    for (const st of sol.steps) {
      assert.ok(typeof st.math === 'string' && st.math.length > 0);
      assert.ok(st.reason.includes('$'), `La justificación debe incluir notación matemática $...$: ${st.reason}`);
      assert.equal(/[²³]/.test(st.title + st.reason), false, `No usar superíndices Unicode planos en lugar de LaTeX: ${st.title}`);
    }
  }

  const calc = cases[6];
  assert.equal(calc.problemMath.includes('*'), false, 'La fórmula en Cálculo no debe mostrar asteriscos crudos (*)');
});
