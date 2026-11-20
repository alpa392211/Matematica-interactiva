'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.resolve(__dirname, '..');

test('Ajustes ofrece la tipografía predeterminada + 3 tipos de letra adicionales con validación en Preferences', () => {
  const store = {};
  const sandbox = {
    console,
    navigator: {},
    matchMedia: () => ({ matches: false }),
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    window: null
  };
  sandbox.window = sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(ROOT_DIR, 'js', 'engine', 'haptics.js'), 'utf8'), sandbox);

  const Prefs = sandbox.MatInteractiva.Preferences;
  assert.equal(Prefs.getPreferences().fontFamily, 'moderna');
  assert.equal(Prefs.getPreferences().welcomeTourCompleted, false);

  for (const fontId of ['academica', 'tecnica', 'lectura', 'moderna']) {
    Prefs.setPreference('fontFamily', fontId);
    assert.equal(Prefs.getPreferences().fontFamily, fontId);
  }

  Prefs.setPreference('fontFamily', 'fuente-inexistente');
  assert.equal(Prefs.getPreferences().fontFamily, 'moderna');

  Prefs.setPreference('welcomeTourCompleted', true);
  assert.equal(Prefs.getPreferences().welcomeTourCompleted, true);

  // resetPreferences restaura la fuente a moderna pero conserva welcomeTourCompleted por defecto
  Prefs.setPreference('fontFamily', 'academica');
  const afterReset = Prefs.resetPreferences();
  assert.equal(afterReset.fontFamily, 'moderna');
  assert.equal(afterReset.welcomeTourCompleted, true);

  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const varsCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'variables.css'), 'utf8');
  const appCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');

  assert.match(html, /data-font-choice="moderna"/);
  assert.match(html, /data-font-choice="academica"/);
  assert.match(html, /data-font-choice="tecnica"/);
  assert.match(html, /data-font-choice="lectura"/);
  assert.match(varsCss, /html\[data-font="academica"\]/);
  assert.match(varsCss, /html\[data-font="tecnica"\]/);
  assert.match(varsCss, /html\[data-font="lectura"\]/);
  assert.match(appCode, /function applySavedFont\(\)/);
});

test('Teclado virtual oscuro de MathLive recibe botón de cierre en cada barra y oculta el teclado al pulsarlo', () => {
  let hideCalls = 0;
  let blurCalls = 0;

  function makeElement(tag, className = '') {
    const attrs = {};
    const listeners = {};
    const children = [];
    const classes = new Set(className.split(/\s+/).filter(Boolean));
    const el = {
      tagName: tag.toUpperCase(),
      nodeType: 1,
      children,
      innerHTML: '',
      type: '',
      get className() { return [...classes].join(' '); },
      set className(val) {
        classes.clear();
        String(val || '').split(/\s+/).filter(Boolean).forEach((c) => classes.add(c));
      },
      classList: {
        add: (...names) => names.forEach((n) => classes.add(n)),
        remove: (...names) => names.forEach((n) => classes.delete(n)),
        contains: (n) => classes.has(n)
      },
      setAttribute(k, v) { attrs[k] = String(v); },
      getAttribute(k) { return attrs[k] ?? null; },
      appendChild(child) { children.push(child); return child; },
      insertBefore(child) { children.unshift(child); return child; },
      get firstChild() { return children[0] || null; },
      addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
      dispatch(type) {
        const ev = { preventDefault() {}, stopPropagation() {} };
        (listeners[type] || []).forEach((fn) => fn(ev));
      },
      querySelector(sel) { return el.querySelectorAll(sel)[0] || null; },
      querySelectorAll(sel) {
        const found = [];
        const matchNode = (node) => {
          if (sel === '.ML__keyboard') return node.classList.contains('ML__keyboard');
          if (sel === '.MLK__toolbar') return node.classList.contains('MLK__toolbar');
          if (sel === '.right') return node.classList.contains('right');
          if (sel === '[data-mat-mlk-close="true"]') return node.getAttribute('data-mat-mlk-close') === 'true';
          return false;
        };
        const walk = (list) => {
          for (const c of list) {
            if (matchNode(c)) found.push(c);
            walk(c.children);
          }
        };
        walk(children);
        return found;
      }
    };
    return el;
  }

  const kb = makeElement('div', 'ML__keyboard');
  const toolbarNumeric = makeElement('div', 'MLK__toolbar');
  const toolbarAlpha = makeElement('div', 'MLK__toolbar');
  const rightSlot = makeElement('div', 'ML__edit-toolbar right');
  toolbarAlpha.appendChild(rightSlot);
  kb.appendChild(toolbarNumeric);
  kb.appendChild(toolbarAlpha);

  const mockDoc = {
    readyState: 'complete',
    activeElement: { tagName: 'MATH-FIELD', blur() { blurCalls++; } },
    body: { children: [kb] },
    createElement: (tag) => makeElement(tag),
    querySelectorAll: (sel) => (sel === '.ML__keyboard' ? [kb] : []),
    addEventListener: () => {}
  };

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    document: mockDoc,
    mathVirtualKeyboard: {
      visible: true,
      hide() {
        hideCalls++;
        this.visible = false;
      },
      addEventListener() {}
    },
    window: null
  };
  sandbox.window = sandbox;

  vm.runInNewContext(fs.readFileSync(path.join(ROOT_DIR, 'js', 'engine', 'math-input.js'), 'utf8'), sandbox);
  const MathInput = sandbox.MatInteractiva.MathInput;

  const buttons = kb.querySelectorAll('[data-mat-mlk-close="true"]');
  assert.equal(buttons.length, 2, 'Debe inyectar un botón de cierre en cada barra .MLK__toolbar');

  // Idempotencia: volver a ejecutar no debe duplicar botones
  const extraInjected = MathInput.ensureVirtualKeyboardCloseButton(kb);
  assert.equal(extraInjected, 0);
  assert.equal(kb.querySelectorAll('[data-mat-mlk-close="true"]').length, 2);

  // Pulsar pointerdown en el botón debe ocultar el teclado virtual
  buttons[0].dispatch('pointerdown');
  assert.equal(hideCalls, 1);
  assert.equal(sandbox.mathVirtualKeyboard.visible, false);
  assert.equal(blurCalls, 1);

  const toolsCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'tools.css'), 'utf8');
  assert.match(toolsCss, /\.ML__keyboard \.mat-mlk-close-btn/);
});

test('WelcomeTour cubre menú por menú con diálogos progresivos y navegación sin alterar progreso', () => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const appCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');
  const compCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'components.css'), 'utf8');

  assert.match(html, /js\/tools\/welcome-tour\.js/);
  assert.match(html, /id="btn-start-welcome-tour"/);
  assert.match(appCode, /id="btn-hero-tour"/);
  assert.match(appCode, /previewOnly/);
  assert.match(compCss, /\.wt-spotlight/);
  assert.match(compCss, /\.wt-dialogue-bubble/);

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    window: null
  };
  sandbox.window = sandbox;

  vm.runInNewContext(fs.readFileSync(path.join(ROOT_DIR, 'js', 'tools', 'welcome-tour.js'), 'utf8'), sandbox);
  const Tour = sandbox.MatInteractiva.WelcomeTour;

  assert.ok(Tour, 'Debe exponer window.MatInteractiva.WelcomeTour');
  assert.ok(Array.isArray(Tour.TOUR_STEPS) && Tour.TOUR_STEPS.length >= 10, 'Debe recorrer al menos 10 pasos/menús');

  const ids = new Set(Tour.TOUR_STEPS.map((s) => s.id));
  for (const requiredStep of ['welcome', 'header', 'dashboard', 'sidebar', 'lesson', 'prepmat', 'grapher', 'formulas', 'editor', 'solver-calc', 'settings', 'finish']) {
    assert.ok(ids.has(requiredStep), `Falta el paso del recorrido: ${requiredStep}`);
  }

  Tour.TOUR_STEPS.forEach((step, idx) => {
    assert.ok(step.title && step.title.length > 5, `Paso ${idx}: título vacío`);
    assert.ok(Array.isArray(step.dialogues) && step.dialogues.length >= 2, `Paso ${idx} (${step.id}): debe tener >= 2 diálogos progresivos`);
    assert.ok(Array.isArray(step.highlights) && step.highlights.length >= 2, `Paso ${idx} (${step.id}): debe tener cápsulas destacadas`);
  });
});
