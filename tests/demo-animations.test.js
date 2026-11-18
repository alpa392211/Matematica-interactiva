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

function createMockCanvas(width = 360, height = 240) {
  const segments = [];
  const arcs = [];
  const texts = [];
  let strokeColor = '';
  let fillColor = '';
  let lastMove = null;
  let clipStack = [];
  let activeClip = null;

  const ctx = {
    set strokeStyle(v) { strokeColor = v; },
    get strokeStyle() { return strokeColor; },
    set fillStyle(v) { fillColor = v; },
    get fillStyle() { return fillColor; },
    lineWidth: 1,
    font: '',
    save() { clipStack.push(activeClip); },
    restore() { activeClip = clipStack.pop() || null; },
    setTransform() {},
    setLineDash() {},
    beginPath() { lastMove = null; },
    rect(x, y, w, h) {
      activeClip = { x, y, w, h };
    },
    clip() {},
    moveTo(x, y) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y), `Coordenada inválida moveTo(${x}, ${y})`);
      lastMove = { x, y };
    },
    lineTo(x, y) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y), `Coordenada inválida lineTo(${x}, ${y})`);
      if (lastMove) {
        segments.push({ x1: lastMove.x, y1: lastMove.y, x2: x, y2: y, color: strokeColor });
      }
      lastMove = { x, y };
    },
    stroke() {},
    fill() {},
    fillRect(x, y, w, h) {
      assert.ok([x, y, w, h].every(Number.isFinite));
    },
    strokeRect(x, y, w, h) {
      assert.ok([x, y, w, h].every(Number.isFinite));
    },
    arc(x, y, r) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(r));
      arcs.push({ x, y, r, fill: fillColor, stroke: strokeColor });
    },
    measureText(str) {
      return { width: String(str).length * 6.5 };
    },
    fillText(text, x, y) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y));
      texts.push({ text, x, y });
    }
  };

  return {
    width,
    height,
    getContext() { return ctx; },
    _segments: segments,
    _arcs: arcs,
    _texts: texts
  };
}

function pointDistanceToSegment(px, py, seg) {
  const vx = seg.x2 - seg.x1;
  const vy = seg.y2 - seg.y1;
  const lenSq = vx * vx + vy * vy;
  if (lenSq < 1e-9) return Math.hypot(px - seg.x1, py - seg.y1);
  const u = ((px - seg.x1) * vx + (py - seg.y1) * vy) / lenSq;
  if (u < -1e-6 || u > 1 + 1e-6) return Infinity;
  const cx = seg.x1 + u * vx;
  const cy = seg.y1 + u * vy;
  return Math.hypot(px - cx, py - cy);
}

test('Geometría Canvas 2D: Todas las 9 animaciones dibujan sin NaN y sus tangentes/secantes/puntos coinciden exactamente', () => {
  const allIds = Object.keys(demo.ANIMATION_CATALOG);
  for (const id of allIds) {
    for (const t of [0, 0.25, 0.5, 0.72, 1]) {
      const canvas = createMockCanvas(360, 240);
      const model = demo.evaluateAnimationModel(id, t);
      demo.drawModelFrame(canvas, model);
      assert.ok(canvas._segments.length > 0 || canvas._arcs.length > 0, `No dibujó geometría en ${id} t=${t}`);
      for (const lbl of canvas._texts) {
        assert.ok(lbl.x >= 0 && lbl.x <= 360, `Texto desbordado X en ${id}: ${lbl.text}`);
        assert.ok(lbl.y >= 0 && lbl.y <= 240, `Texto desbordado Y en ${id}: ${lbl.text}`);
      }
    }
  }

  // Verificar der-velocidad-instantanea en t = 0.7233 (timeSec ≈ 2.17 s, caso reportado)
  const velCanvas = createMockCanvas(360, 240);
  const velModel = demo.evaluateAnimationModel('der-velocidad-instantanea', 2.17 / 3);
  demo.drawModelFrame(velCanvas, velModel);
  const graphRect = { x: 16, y: 56, w: 328, h: 168 };
  const expectedVelPt = demo.mapBox(velModel.plotData.timeSec, velModel.plotData.posM, -0.2, 3.2, -0.5, 9.5, graphRect);
  const redTangents = velCanvas._segments.filter(s => s.color === '#dc2626');
  assert.ok(redTangents.length >= 1, 'Debe dibujarse el segmento tangente rojo');
  const distToTangent = Math.min(...redTangents.map(s => pointDistanceToSegment(expectedVelPt.px, expectedVelPt.py, s)));
  assert.ok(distToTangent < 0.01, `La tangente roja debe pasar exactamente por el punto verde (distancia=${distToTangent}px)`);

  // Verificar der-construccion-fprima: la tangente móvil superior pasa exactamente por (xCur, sen(xCur))
  const fpCanvas = createMockCanvas(360, 240);
  const fpModel = demo.evaluateAnimationModel('der-construccion-fprima', 0.65);
  demo.drawModelFrame(fpCanvas, fpModel);
  const topRect = { x: 16, y: 16, w: 328, h: 96 };
  const expectedTopPt = demo.mapBox(fpModel.plotData.xCur, fpModel.plotData.fx, -3.14, 3.14, -1.4, 1.4, topRect);
  const fpTangents = fpCanvas._segments.filter(s => s.color === '#dc2626');
  assert.ok(fpTangents.length >= 1);
  const distFp = Math.min(...fpTangents.map(s => pointDistanceToSegment(expectedTopPt.px, expectedTopPt.py, s)));
  assert.ok(distFp < 0.01, `Tangente en sen(x) desfasada (${distFp}px)`);

  // Verificar lim-salto-infinito: el punto móvil en 1/(x-1)^2 permanece dentro del rectángulo visible (y <= 15)
  for (const t of [0, 0.5, 1]) {
    const limInf = demo.evaluateAnimationModel('lim-salto-infinito', t);
    assert.ok(limInf.plotData.asymY <= 15, `Punto en asíntota fuera de rango visible en t=${t}: ${limInf.plotData.asymY}`);
    assert.ok(Math.abs(limInf.plotData.jumpLeftY - (-1 + 0.35 * limInf.plotData.jumpLeftX)) < 1e-9);
  }
});
