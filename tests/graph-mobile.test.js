'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadGraphModules() {
  const sandbox = {
    console,
    Math,
    Number,
    isFinite,
    window: null,
    document: {
      documentElement: {
        getAttribute() { return 'light'; }
      },
      querySelectorAll() { return []; }
    },
    localStorage: {
      getItem() { return null; },
      setItem() {}
    }
  };
  sandbox.window = sandbox;

  const lessonCode = fs.readFileSync(
    path.join(__dirname, '..', 'js', 'tools', 'lesson-graphs.js'),
    'utf8'
  );
  const grapherCode = fs.readFileSync(
    path.join(__dirname, '..', 'js', 'tools', 'grapher.js'),
    'utf8'
  );

  vm.runInNewContext(lessonCode, sandbox);
  vm.runInNewContext(grapherCode, sandbox);

  return {
    GraphViewport: sandbox.MatInteractiva.GraphViewport,
    LessonGraphs: sandbox.MatInteractiva.LessonGraphs,
    GrapherTool: sandbox.MatInteractiva.GrapherTool
  };
}

test('clampScale acota valores válidos e inválidos entre minScale y maxScale', () => {
  const { GraphViewport, GrapherTool } = loadGraphModules();
  for (const api of [GraphViewport, GrapherTool]) {
    assert.equal(api.clampScale(2), 8);
    assert.equal(api.clampScale(500), 260);
    assert.equal(api.clampScale(42), 42);
    assert.equal(api.clampScale('no-num'), 42);
    assert.equal(api.clampScale(15, 20, 100), 20);
  }
});

test('mathToScreen y screenToMath conservan conversión inversa exacta', () => {
  const { GraphViewport } = loadGraphModules();
  const width = 390;
  const height = 320;
  const centerX = -1.25;
  const centerY = 2.5;
  const scale = 48;

  const pt = GraphViewport.mathToScreen(1.75, -0.5, centerX, centerY, scale, width, height);
  const round = GraphViewport.screenToMath(pt.px, pt.py, centerX, centerY, scale, width, height);

  assert.ok(Math.abs(round.mx - 1.75) < 1e-9);
  assert.ok(Math.abs(round.my - (-0.5)) < 1e-9);
});

test('computeOptimalGridStep evita etiquetas amontonadas en cualquier nivel de zoom', () => {
  const { GraphViewport } = loadGraphModules();
  const scales = [8, 12, 22, 35, 44, 90, 180, 260];
  for (const s of scales) {
    const step = GraphViewport.computeOptimalGridStep(s, 48);
    const pxGap = step * s;
    assert.ok(pxGap >= 48 - 1e-6, `Espaciado ${pxGap}px demasiado pequeño para scale=${s}`);
    assert.ok(pxGap <= 240, `Espaciado ${pxGap}px demasiado grande para scale=${s}`);
  }
});

test('shouldSingleFingerPan solo activa paneo táctil de 1 dedo en modo expandido', () => {
  const { GraphViewport, LessonGraphs, GrapherTool } = loadGraphModules();
  for (const api of [GraphViewport, LessonGraphs, GrapherTool]) {
    assert.equal(api.shouldSingleFingerPan(false), false);
    assert.equal(api.shouldSingleFingerPan(undefined), false);
    assert.equal(api.shouldSingleFingerPan(true), true);
  }
});

test('applyPinchZoom ancla el zoom al punto medio y traslada proporcionalmente al paneo de dos dedos', () => {
  const { GraphViewport } = loadGraphModules();
  const width = 400;
  const height = 300;
  const midPx = 280;
  const midPy = 90;
  const initialCenterX = 0;
  const initialCenterY = 0;
  const initialScale = 40;

  // Sin arrastre lateral: el punto matemático bajo (midPx, midPy) permanece fijo tras el pellizco
  const before = GraphViewport.screenToMath(midPx, midPy, initialCenterX, initialCenterY, initialScale, width, height);
  const zoomed = GraphViewport.applyPinchZoom({
    scale: initialScale,
    prevDist: 100,
    nextDist: 150,
    centerX: initialCenterX,
    centerY: initialCenterY,
    panDx: 0,
    panDy: 0,
    midPx,
    midPy,
    width,
    height
  });
  assert.equal(zoomed.scale, 60);
  const after = GraphViewport.screenToMath(midPx, midPy, zoomed.centerX, zoomed.centerY, zoomed.scale, width, height);
  assert.ok(Math.abs(after.mx - before.mx) < 1e-9);
  assert.ok(Math.abs(after.my - before.my) < 1e-9);

  // Con desplazamiento simultáneo (+60px derecha, -30px arriba): el centro se mueve inversamente / escala
  const panned = GraphViewport.applyPinchZoom({
    scale: initialScale,
    prevDist: 100,
    nextDist: 100,
    centerX: initialCenterX,
    centerY: initialCenterY,
    panDx: 60,
    panDy: -30,
    midPx: 200,
    midPy: 150,
    width,
    height
  });
  assert.equal(panned.scale, initialScale);
  assert.ok(Math.abs(panned.centerX - (-1.5)) < 1e-9);
  assert.ok(Math.abs(panned.centerY - (-0.75)) < 1e-9);
});
