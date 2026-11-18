'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadMathRendererEnv() {
  const sandbox = {
    console,
    Math,
    katex: {
      renderToString: (latex, opts) => `<span class="katex">${latex}</span>`
    },
    window: null
  };
  sandbox.window = sandbox;

  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine', 'math-renderer.js'), 'utf8');
  vm.runInNewContext(code, sandbox);
  return sandbox.MatInteractiva.MathRenderer;
}

test('formatRichText agrupa paréntesis y puntuación adheridos a matemáticas en línea con .math-inline-group', () => {
  const mr = loadMathRendererEnv();
  const res1 = mr.formatRichText('los Naturales ($\\mathbb{N} = \\{1, 2, 3\\}$) y $f\'(a)$).');
  assert.match(res1, /<span class="math-inline-group">\(<span class="math-inline">.*?<\/span>\)<\/span>/);
  assert.match(res1, /<span class="math-inline-group"><span class="math-inline">.*?<\/span>\)\.<\/span>/);

  // Sin puntuación adherida no envuelve innecesariamente en .math-inline-group
  const res2 = mr.formatRichText('Sea $x = 5$ un número.');
  assert.doesNotMatch(res2, /math-inline-group/);
  assert.match(res2, /<span class="math-inline">.*?<\/span>/);
});

test('Haptics registra wasRecentlyTriggered para evitar vibraciones duplicadas', () => {
  const vibratedCalls = [];
  const sandbox = {
    console,
    Date,
    navigator: {
      vibrate(p) {
        vibratedCalls.push(p);
        return true;
      }
    },
    window: null,
    matchMedia(q) {
      if (q.includes('pointer: coarse')) return { matches: true };
      return { matches: false };
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  };
  sandbox.window = sandbox;

  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine', 'haptics.js'), 'utf8');
  vm.runInNewContext(code, sandbox);

  const Haptics = sandbox.MatInteractiva.Haptics;
  assert.equal(Haptics.wasRecentlyTriggered(120), false);
  assert.equal(Haptics.confirm(), true);
  assert.equal(Haptics.wasRecentlyTriggered(120), true);
  assert.equal(vibratedCalls.length, 1);
});

test('PrepMatTool expone hasActiveExam y abandonActiveExam para proteger exámenes en curso', () => {
  const prepCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'tools', 'prepmat.js'), 'utf8');
  assert.match(prepCode, /function hasActiveExam\(\)/);
  assert.match(prepCode, /function abandonActiveExam\(\)/);
  assert.match(prepCode, /#btn-pm-exit-exam[\s\S]{0,600}confirmAction/);
  assert.match(prepCode, /hasActiveExam,\s*\n\s*abandonActiveExam/);
});

test('CSS y App garantizan transparencia reducida, menú inicial colapsable, flechas scroll y guardias de navegación/salida', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const varsCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'variables.css'), 'utf8');
  const layoutCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'layout.css'), 'utf8');
  const toolsCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'tools.css'), 'utf8');
  const compCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'components.css'), 'utf8');
  const respCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'responsive.css'), 'utf8');

  // Menú inicial colapsable con botón Continuar principal
  assert.match(appCode, /id="hero-more-menu"/);
  assert.match(appCode, /id="btn-hero-more-toggle"/);
  assert.match(appCode, /class="hero-primary-row"/);

  // Indicadores de scroll horizontal y sincronización de gráficas expandidas
  assert.match(appCode, /function enhanceHorizontalScrollStrips\(/);
  assert.match(appCode, /className = 'hscroll-arrow is-right'/);
  assert.match(appCode, /has-expanded-graph/);

  // Guardias de estudio, examen y salida (antes de salir de la app o cambiar sección)
  assert.match(appCode, /function guardNavigation\(/);
  assert.match(appCode, /function bindAppExitGuardEvents\(/);
  assert.match(appCode, /beforeunload/);
  assert.match(appCode, /popstate/);
  assert.match(appCode, /requestAppExitConfirmation/);
  assert.match(appCode, /wasRecentlyTriggered/);

  // Reglas CSS de opacidad, gráficas expandidas sin transform atrapante y tablet
  assert.match(varsCss, /--lg-expanded-graph-bg:/);
  assert.match(varsCss, /--bg-surface:\s*rgba\(255,\s*255,\s*255,\s*0\.94\)/);
  assert.match(layoutCss, /body\.has-expanded-graph \.floating-mobile-menu-btn/);
  assert.match(layoutCss, /animation:\s*lgViewTransitionIn[^\n]*backwards/);
  assert.match(toolsCss, /body\.has-expanded-graph \.main-wrapper/);
  assert.match(compCss, /\.hscroll-arrow\.is-right/);
  assert.match(compCss, /\.math-inline-group/);
  assert.match(respCss, /@media \(min-width: 768px\) and \(max-width: 1180px\)/);
});
