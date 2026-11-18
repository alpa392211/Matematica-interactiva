'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

global.window = global.window || { MatInteractiva: {} };
require(path.resolve(__dirname, '../js/engine/math-parser.js'));

const { MathParser } = global.window.MatInteractiva;

test('Fase 3: Detección de discontinuidades removibles simples y múltiples', () => {
  const h1 = MathParser.findRemovableDiscontinuities('(x^2 - 4)/(x - 2)', -10, 10, 'RAD');
  assert.deepEqual(h1, [{ x: 2, y: 4 }]);

  // En (x^2 - 9)/(x^2 - x - 6), x = 3 es hueco (y = 1.2) y x = -2 es asíntota vertical
  const h2 = MathParser.findRemovableDiscontinuities('(x^2 - 9)/(x^2 - x - 6)', -10, 10, 'RAD');
  assert.equal(h2.length, 1);
  assert.equal(h2[0].x, 3);
  assert.ok(Math.abs(h2[0].y - 1.2) < 1e-3);
});

test('Fase 3: Discontinuidades removibles con radicales y funciones trigonométricas', () => {
  const hRad = MathParser.findRemovableDiscontinuities('(sqrt(x + 4) - 2)/x', -4, 6, 'RAD');
  assert.equal(hRad.length, 1);
  assert.equal(hRad[0].x, 0);
  assert.ok(Math.abs(hRad[0].y - 0.25) < 1e-3);

  const hTrig = MathParser.findRemovableDiscontinuities('sin(x)/x', -6, 6, 'RAD');
  assert.equal(hTrig.length, 1);
  assert.equal(hTrig[0].x, 0);
  assert.ok(Math.abs(hTrig[0].y - 1) < 1e-3);

  const hCos = MathParser.findRemovableDiscontinuities('(1 - cos(x))/x^2', -5, 5, 'RAD');
  assert.equal(hCos.length, 1);
  assert.equal(hCos[0].x, 0);
  assert.ok(Math.abs(hCos[0].y - 0.5) < 1e-3);
});

test('Fase 3: No confundir funciones continuas, asíntotas ni saltos finitos con huecos removibles', () => {
  assert.deepEqual(MathParser.findRemovableDiscontinuities('x^2 - 2*x + 1', -10, 10, 'RAD'), []);
  assert.deepEqual(MathParser.findRemovableDiscontinuities('abs(x)/x', -5, 5, 'RAD'), []);
  assert.deepEqual(MathParser.findRemovableDiscontinuities('1/(x - 1)^2', -5, 5, 'RAD'), []);
  assert.deepEqual(MathParser.findRemovableDiscontinuities('2*x/(x - 1)', -5, 5, 'RAD'), []);
});
