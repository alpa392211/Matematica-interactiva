'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadDemoAnimations() {
  const sandbox = {
    console,
    Math,
    window: { MatInteractiva: {} }
  };
  sandbox.window.window = sandbox.window;
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'tools', 'demo-animations.js'), 'utf8');
  vm.runInNewContext(code, sandbox);
  return sandbox.window.MatInteractiva.DemoAnimations;
}

const demo = loadDemoAnimations();

test('Fase 10: Todas las animaciones demostrativas tienen modelo numérico puro evaluable en [0, 1]', () => {
  const expectedIds = [
    'lim-aprox-tabla',
    'lim-salto-infinito',
    'lim-epsilon-banda',
    'der-razon-promedio',
    'der-secante-tangente',
    'der-construccion-fprima',
    'der-velocidad-instantanea',
    'der-no-derivable',
    'int-suma-riemann'
  ];

  for (const id of expectedIds) {
    assert.ok(demo.ANIMATION_CATALOG[id], `Falta catálogo para ${id}`);
    for (const t of [0, 0.5, 1]) {
      const m = demo.evaluateAnimationModel(id, t);
      assert.ok(m, `Resultado nulo para ${id} en t=${t}`);
      assert.ok(m.subtitle && m.subtitle.length > 10, `Falta subtítulo narrativo en ${id}`);
      assert.ok(Array.isArray(m.readoutItems) && m.readoutItems.length >= 2);
      assert.ok(Array.isArray(m.tableHeaders) && m.tableHeaders.length >= 2);
      assert.ok(Array.isArray(m.tableRows) && m.tableRows.length >= 1);
    }
  }
});

test('Fase 10: Verificación matemática de convergencia en límites, derivadas y sumas de Riemann', () => {
  // 1. Límite (x²-4)/(x-2) converge a 4
  const limEnd = demo.evaluateAnimationModel('lim-aprox-tabla', 1);
  assert.ok(Math.abs(limEnd.plotData.yLeft - 4) < 0.005);
  assert.ok(Math.abs(limEnd.plotData.yRight - 4) < 0.005);

  // 2. Banda ε-δ para 2x - 1 conserva relación δ = ε / 2
  const epsMid = demo.evaluateAnimationModel('lim-epsilon-banda', 0.5);
  assert.ok(Math.abs(epsMid.plotData.delta - epsMid.plotData.eps / 2) < 1e-9);

  // 3. Secante -> tangente de 0.5x² en x₀=1 converge a pendiente 1
  const secStart = demo.evaluateAnimationModel('der-secante-tangente', 0);
  const secEnd = demo.evaluateAnimationModel('der-secante-tangente', 1);
  assert.ok(secStart.plotData.mSec > 1.5);
  assert.ok(Math.abs(secEnd.plotData.mSec - 1) < 1e-6);

  // 4. Construcción f'(x) = cos(x) para f(x) = sen(x)
  const fpMid = demo.evaluateAnimationModel('der-construccion-fprima', 0.5);
  assert.ok(Math.abs(fpMid.plotData.fx - Math.sin(fpMid.plotData.xCur)) < 1e-9);
  assert.ok(Math.abs(fpMid.plotData.dfx - Math.cos(fpMid.plotData.xCur)) < 1e-9);

  // 5. Velocidad instantánea s(t) = t² => s'(3) = 6
  const velEnd = demo.evaluateAnimationModel('der-velocidad-instantanea', 1);
  assert.ok(Math.abs(velEnd.plotData.posM - 9) < 1e-9);
  assert.ok(Math.abs(velEnd.plotData.velMs - 6) < 1e-9);

  // 6. Suma de Riemann para ∫₀² x² dx = 8/3 con error decreciente
  const rStart = demo.evaluateAnimationModel('int-suma-riemann', 0);
  const rEnd = demo.evaluateAnimationModel('int-suma-riemann', 1);
  assert.ok(rEnd.plotData.n > rStart.plotData.n);
  assert.ok(Math.abs(rEnd.plotData.riemannMid - 8 / 3) < 0.01);
});
