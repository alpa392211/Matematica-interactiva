'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadHapticsEnv({ hasVibrate = true, coarse = true, reducedMotion = false, storageData = {} } = {}) {
  const vibratedCalls = [];
  const store = { ...storageData };

  const localStorage = {
    getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem(k, v) { store[k] = String(v); },
    removeItem(k) { delete store[k]; }
  };

  const sandbox = {
    console,
    navigator: hasVibrate
      ? {
          vibrate(pattern) {
            vibratedCalls.push(pattern);
            return true;
          }
        }
      : {},
    window: null,
    matchMedia(query) {
      if (query.includes('pointer: coarse')) return { matches: coarse };
      if (query.includes('prefers-reduced-motion')) return { matches: reducedMotion };
      return { matches: false };
    },
    localStorage
  };
  sandbox.window = sandbox;

  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine', 'haptics.js'), 'utf8');
  vm.runInNewContext(code, sandbox);

  return {
    Haptics: sandbox.MatInteractiva.Haptics,
    Preferences: sandbox.MatInteractiva.Preferences,
    vibratedCalls,
    store
  };
}

test('Fase 7: Haptics detecta soporte y nunca lanza errores sin navigator.vibrate', () => {
  const envUnsupported = loadHapticsEnv({ hasVibrate: false, coarse: true, reducedMotion: false });
  assert.equal(envUnsupported.Haptics.isSupported(), false);
  assert.equal(envUnsupported.Haptics.canVibrate(), false);
  assert.doesNotThrow(() => {
    assert.equal(envUnsupported.Haptics.light(), false);
    assert.equal(envUnsupported.Haptics.confirm(), false);
    assert.equal(envUnsupported.Haptics.correct(), false);
    assert.equal(envUnsupported.Haptics.incorrect(), false);
    assert.equal(envUnsupported.Haptics.achievement(), false);
  });
});

test('Fase 7: Haptics respeta pointer: coarse, prefers-reduced-motion y patrones diferenciados', () => {
  const desktop = loadHapticsEnv({ hasVibrate: true, coarse: false, reducedMotion: false });
  assert.equal(desktop.Haptics.canVibrate(), false);
  assert.equal(desktop.Haptics.light(), false);

  const reduced = loadHapticsEnv({ hasVibrate: true, coarse: true, reducedMotion: true });
  assert.equal(reduced.Haptics.canVibrate(), false);
  assert.equal(reduced.Haptics.correct(), false);

  const mobile = loadHapticsEnv({ hasVibrate: true, coarse: true, reducedMotion: false });
  assert.equal(mobile.Haptics.canVibrate(), true);
  assert.equal(mobile.Haptics.light(), true);
  assert.equal(mobile.Haptics.confirm(), true);
  assert.equal(mobile.Haptics.correct(), true);
  assert.equal(mobile.Haptics.incorrect(), true);
  assert.equal(mobile.Haptics.achievement(), true);
  assert.equal(mobile.vibratedCalls.length, 5);
  assert.ok(mobile.vibratedCalls[0] >= 5 && mobile.vibratedCalls[0] <= 12);
  assert.ok(mobile.vibratedCalls[1] >= 15 && mobile.vibratedCalls[1] <= 30);
  assert.ok(Array.isArray(mobile.vibratedCalls[2]));
  assert.ok(Array.isArray(mobile.vibratedCalls[3]));
  assert.notDeepEqual(mobile.vibratedCalls[2], mobile.vibratedCalls[3]);
});

test('Fase 7 y 17: Preferencias nuevas usan una clave separada, toleran formatos antiguos y se restablecen sin tocar el progreso', () => {
  const mobile = loadHapticsEnv({
    hasVibrate: true,
    coarse: true,
    reducedMotion: false,
    storageData: {
      matematica_interactiva_preferencias_v1: JSON.stringify({ hapticsEnabled: false, ambientBgEnabled: true }),
      matematica_interactiva_progreso_v1: JSON.stringify({ xp: 120, solvedExercises: { 'arit-1-ex1': true } })
    }
  });
  assert.equal(mobile.Preferences.STORAGE_KEY, 'matematica_interactiva_preferencias_v1');

  // Tolerar preferencias antiguas sin los campos nuevos
  const loadedOld = mobile.Preferences.getPreferences();
  assert.equal(loadedOld.hapticsEnabled, false);
  assert.equal(loadedOld.ambientBgEnabled, true);
  assert.equal(loadedOld.showThemeButton, true);
  assert.equal(loadedOld.lastSeenVersion, '');
  assert.equal(loadedOld.graphGestureHintSeen, false);

  assert.equal(mobile.Haptics.canVibrate(), false);
  mobile.Preferences.setPreference('showThemeButton', false);
  mobile.Preferences.setPreference('lastSeenVersion', '1.2.3');
  const updated = mobile.Preferences.getPreferences();
  assert.equal(updated.showThemeButton, false);
  assert.equal(updated.lastSeenVersion, '1.2.3');

  // Restablecer preferencias conserva lastSeenVersion (por defecto) y jamás toca el progreso
  const reset = mobile.Preferences.resetPreferences();
  assert.equal(reset.hapticsEnabled, true);
  assert.equal(reset.ambientBgEnabled, true);
  assert.equal(reset.showThemeButton, true);
  assert.equal(reset.graphGestureHintSeen, false);
  assert.equal(reset.lastSeenVersion, '1.2.3');
  assert.equal(
    JSON.parse(mobile.store['matematica_interactiva_progreso_v1']).xp,
    120,
    'El progreso nunca debe modificarse al cambiar o restablecer preferencias'
  );
});

test('Fase 8: AmbientBackground respeta límites de partículas, opacidad baja y paletas por tema', () => {
  const sandbox = {
    console,
    Math,
    window: { matchMedia: () => ({ matches: false }) }
  };
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine', 'ambient-bg.js'), 'utf8');
  vm.runInNewContext(code, sandbox);
  const bg = sandbox.window.MatInteractiva.AmbientBackground;

  const mobileCount = bg.getTargetCount(390);
  const desktopCount = bg.getTargetCount(1280);
  assert.ok(mobileCount <= 16, `Móvil debe tener <= 16 partículas, recibió ${mobileCount}`);
  assert.ok(desktopCount <= 30, `Escritorio debe tener <= 30 partículas, recibió ${desktopCount}`);

  const particles = bg.createParticles(1280, 800, () => 0.5);
  assert.equal(particles.length, desktopCount);
  for (const p of particles) {
    assert.ok(p.alpha >= 0.05 && p.alpha <= 0.14, `Opacidad fuera de rango sutil: ${p.alpha}`);
  }

  const beforeY = particles[0].y;
  bg.stepParticles(particles, 1280, 800, 0.05);
  assert.ok(particles[0].y < beforeY, 'Las partículas deben flotar suavemente hacia arriba');

  assert.notDeepEqual(bg.getThemePalette('light'), bg.getThemePalette('dark'));
});

test('v1.4.0: Preferences valida lightBgPreset/darkBgPreset y AmbientBackground ofrece 3 paletas por modo', () => {
  const { Preferences } = loadHapticsEnv();
  const initial = Preferences.getPreferences();
  assert.equal(initial.lightBgPreset, 'cristal');
  assert.equal(initial.darkBgPreset, 'cosmos');

  Preferences.setPreference('lightBgPreset', 'esmeralda');
  Preferences.setPreference('darkBgPreset', 'abismo');
  let updated = Preferences.getPreferences();
  assert.equal(updated.lightBgPreset, 'esmeralda');
  assert.equal(updated.darkBgPreset, 'abismo');

  // Valores desconocidos deben normalizarse al respaldo seguro
  Preferences.setPreference('lightBgPreset', 'no-existe');
  Preferences.setPreference('darkBgPreset', 'invalido');
  updated = Preferences.getPreferences();
  assert.equal(updated.lightBgPreset, 'cristal');
  assert.equal(updated.darkBgPreset, 'cosmos');

  const sandbox = {
    console,
    Math,
    window: { matchMedia: () => ({ matches: false }) }
  };
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine', 'ambient-bg.js'), 'utf8');
  vm.runInNewContext(code, sandbox);
  const bg = sandbox.window.MatInteractiva.AmbientBackground;

  const pCristal = bg.getThemePalette('light', 'cristal');
  const pEsmeralda = bg.getThemePalette('light', 'esmeralda');
  const pAurora = bg.getThemePalette('light', 'aurora');
  assert.notDeepEqual(pCristal, pEsmeralda);
  assert.notDeepEqual(pCristal, pAurora);
  assert.notDeepEqual(pEsmeralda, pAurora);

  const dCosmos = bg.getThemePalette('dark', 'cosmos');
  const dAbismo = bg.getThemePalette('dark', 'abismo');
  const dNebulosa = bg.getThemePalette('dark', 'nebulosa');
  assert.notDeepEqual(dCosmos, dAbismo);
  assert.notDeepEqual(dCosmos, dNebulosa);
  assert.notDeepEqual(dAbismo, dNebulosa);
});

test('Datos, salida de app, códigos de desarrollador (06092109 / 23410908) y ajustes UI móviles', () => {
  const storageCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine', 'storage.js'), 'utf8');
  const mem = new Map();
  const sandbox = {
    console,
    Math,
    Date,
    localStorage: {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
      removeItem: (k) => mem.delete(k)
    },
    window: null
  };
  sandbox.window = sandbox;
  vm.runInNewContext(storageCode, sandbox);
  const Storage = sandbox.window.MatInteractiva.Storage;

  const mockCurriculum = [
    {
      id: 'm1',
      name: 'Materia 1',
      topics: [
        {
          id: 't1',
          title: 'Tema 1',
          quiz: [{}, {}],
          exercises: [{ id: 'e1', level: 'basico' }, { id: 'e2', level: 'intermedio' }]
        },
        {
          id: 't2',
          title: 'Tema 2',
          quiz: [{}, {}],
          exercises: [{ id: 'e3', level: 'avanzado' }, { id: 'e4', level: 'basico' }]
        }
      ]
    }
  ];

  const domainResults = new Set();
  for (let i = 0; i < 20; i++) {
    const prevXp = Storage.getState().xp;
    const boosted = Storage.applyDeveloperBoost(mockCurriculum);
    assert.ok(boosted.xp > prevXp, 'applyDeveloperBoost debe incrementar la XP');
    assert.ok(boosted.streakDays >= 1 && boosted.streakDays <= 47, `La racha (${boosted.streakDays}) nunca debe superar 47 días`);
    assert.ok(boosted.globalPercentage >= 0 && boosted.globalPercentage <= 100);
    domainResults.add(boosted.globalPercentage);
  }
  assert.ok(domainResults.size >= 2, 'applyDeveloperBoost debe variar aleatoriamente el dominio global');

  Storage.resetAllProgress();
  assert.equal(Storage.getState().xp, 0);
  assert.equal(Storage.getState().streakDays, 1);

  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const versionCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'version.js'), 'utf8');
  const toolsCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'tools.css'), 'utf8');
  const componentsCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'components.css'), 'utf8');

  assert.match(html, /id="btn-floating-open-sidebar"/);
  assert.match(html, /id="btn-floating-open-quick-calc"/);
  assert.match(html, /id="btn-wipe-all-data"/);
  assert.doesNotMatch(html, /id="btn-exit-app"/);
  assert.doesNotMatch(html, /id="app-exited-overlay"/);
  assert.match(html, /id="app-confirm-modal"/);
  assert.match(html, /id="settings-dev-details"/);
  assert.match(html, /Códigos de desarrollador/);
  assert.doesNotMatch(html, /id="btn-whats-new-more"/);
  assert.doesNotMatch(versionCode, /06092109|23410908|c[óo]digos de desarrollador/i);
  assert.match(appCode, /06092109/);
  assert.match(appCode, /23410908/);
  assert.match(appCode, /devOldNoticesUnlocked/);
  assert.match(appCode, /htmlEl\.style\.scrollBehavior = 'auto'/);
  assert.match(toolsCss, /\.quick-modal-header\s*\{[^}]*background:\s*transparent/);
  assert.match(componentsCss, /\.whats-new-modal-window\s*\{[^}]*overflow-x:\s*hidden/);
  assert.match(componentsCss, /\.whats-new-items-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});
