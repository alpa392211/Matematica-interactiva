'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

global.window = global.window || { MatInteractiva: {} };
require(path.resolve(__dirname, '../js/engine/math-parser.js'));
require(path.resolve(__dirname, '../js/tools/calculator.js'));

const { MathParser, CalculatorTool } = global.window.MatInteractiva;

function assertApprox(actual, expected, tol = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `Se esperaba ${expected} (±${tol}), pero se obtuvo ${actual}`
  );
}

test('Fase 2: Soporte del símbolo de grados (°) en modo DEG y RAD', () => {
  assertApprox(MathParser.evaluate('sin(30°)', { ans: 0 }, 'DEG'), 0.5);
  assertApprox(MathParser.evaluate('cos(60°)', { ans: 0 }, 'DEG'), 0.5);
  assertApprox(MathParser.evaluate('30° + 15°', { ans: 0 }, 'DEG'), 45);

  assertApprox(MathParser.evaluate('sin(30°)', { ans: 0 }, 'RAD'), 0.5);
  assertApprox(MathParser.evaluate('sin(30°)^2', { ans: 0 }, 'RAD'), 0.25);
  assertApprox(MathParser.evaluate('180°', { ans: 0 }, 'RAD'), Math.PI);
  assertApprox(MathParser.evaluate('2sin(30°)', { ans: 0 }, 'RAD'), 1);
});

test('Fase 2: autoCloseParens cierra paréntesis abiertos faltantes', () => {
  assert.equal(MathParser.autoCloseParens('sin(30'), 'sin(30)');
  assert.equal(MathParser.autoCloseParens('2*(3+sin(30'), '2*(3+sin(30))');
  assert.equal(MathParser.autoCloseParens('sin(30)'), 'sin(30)');
  assertApprox(MathParser.evaluate(MathParser.autoCloseParens('sin(30'), { ans: 0 }, 'DEG'), 0.5);
});

test('Fase 2: Mensajes de error específicos del parser', () => {
  assert.throws(
    () => MathParser.evaluate('sin()', { ans: 0 }, 'DEG'),
    /Falta el argumento en sin/
  );
  assert.throws(
    () => MathParser.evaluate('sin(30', { ans: 0 }, 'DEG'),
    /Falta cerrar paréntesis en sin/
  );
  assert.throws(
    () => MathParser.evaluate('30 sin', { ans: 0 }, 'DEG'),
    /Falta el argumento de sin/
  );
  assert.throws(
    () => MathParser.evaluate('()', { ans: 0 }, 'DEG'),
    /paréntesis vacío/
  );
});

test('Fase 2: insertAtCursor inserta exactamente en la posición del cursor o selección', () => {
  const mid = CalculatorTool.insertAtCursor('2 + 5', 2, 2, 'sin(');
  assert.equal(mid.text, '2 sin(+ 5');
  assert.equal(mid.cursor, 6);

  const inside = CalculatorTool.insertAtCursor('sin()', 4, 4, '30');
  assert.equal(inside.text, 'sin(30)');
  assert.equal(inside.cursor, 6);

  const replaceSel = CalculatorTool.insertAtCursor('2 + 99 * 3', 4, 6, '10');
  assert.equal(replaceSel.text, '2 + 10 * 3');
  assert.equal(replaceSel.cursor, 6);
});

test('Fase 2: deleteTokenBeforeCursor borra tokens completos o 1 carácter', () => {
  const delFunc = CalculatorTool.deleteTokenBeforeCursor('2*sin(', 6, 6);
  assert.equal(delFunc.text, '2*');
  assert.equal(delFunc.cursor, 2);

  const delMid = CalculatorTool.deleteTokenBeforeCursor('2+arcsen(30)', 9, 9);
  assert.equal(delMid.text, '2+30)');
  assert.equal(delMid.cursor, 2);

  const delSqrt = CalculatorTool.deleteTokenBeforeCursor('sqrt(', 5, 5);
  assert.equal(delSqrt.text, '');
  assert.equal(delSqrt.cursor, 0);

  const delChar = CalculatorTool.deleteTokenBeforeCursor('sin(30)', 6, 6);
  assert.equal(delChar.text, 'sin(3)');
  assert.equal(delChar.cursor, 5);

  const delConst = CalculatorTool.deleteTokenBeforeCursor('2*pi+1', 4, 4);
  assert.equal(delConst.text, '2*+1');
  assert.equal(delConst.cursor, 2);
});

test('Fase 2: parseHistoryEntry extrae modo angular y expresión limpia', () => {
  const parsed = CalculatorTool.parseHistoryEntry({ expr: 'sin(30) [DEG]', result: '0.5' });
  assert.equal(parsed.expr, 'sin(30)');
  assert.equal(parsed.mode, 'DEG');
  assert.equal(parsed.result, '0.5');
});
