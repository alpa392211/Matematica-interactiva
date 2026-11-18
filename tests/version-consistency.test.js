const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.resolve(__dirname, '..');

function walkFiles(dirRel) {
  const fullDir = path.join(ROOT_DIR, dirRel);
  if (!fs.existsSync(fullDir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const relPath = path.posix.join(dirRel.replace(/\\/g, '/'), entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(relPath));
    } else if (entry.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

function loadVersionFromWindowAndWorker() {
  const code = fs.readFileSync(path.join(ROOT_DIR, 'js', 'version.js'), 'utf8');

  const winContext = { globalThis: null, MatInteractiva: {} };
  winContext.globalThis = winContext;
  vm.runInNewContext(code, winContext, { filename: 'js/version.js' });

  const swContext = { globalThis: null, self: null };
  swContext.globalThis = swContext;
  swContext.self = swContext;
  vm.runInNewContext(code, swContext, { filename: 'js/version.js' });

  return {
    winVersion: winContext.MatInteractiva.Version,
    swVersion: swContext.MatInteractivaVersion
  };
}

test('Fase 14: js/version.js expone SemVer válida, estudio ALPA Studio sin acrónimo inventado y notas completas', () => {
  const { winVersion, swVersion } = loadVersionFromWindowAndWorker();
  assert.ok(winVersion, 'Debe existir window.MatInteractiva.Version');
  assert.ok(swVersion, 'Debe existir globalThis.MatInteractivaVersion en entorno worker');

  assert.equal(winVersion.APP_NAME, 'MateTic');
  assert.equal(winVersion.APP_TAGLINE, 'Matemáticas Interactivas');
  assert.equal(winVersion.STUDIO_NAME, 'ALPA Studio');
  assert.equal(winVersion.STUDIO_MEANING, '');
  assert.equal(winVersion.isValidSemver(winVersion.APP_VERSION), true, 'APP_VERSION debe ser SemVer válida');
  assert.match(winVersion.APP_RELEASE_DATE, /^\d{4}-\d{2}-\d{2}$/, 'APP_RELEASE_DATE debe usar formato ISO YYYY-MM-DD');

  assert.ok(Array.isArray(winVersion.RELEASE_NOTES) && winVersion.RELEASE_NOTES.length > 0);
  const currentEntry = winVersion.RELEASE_NOTES.find((e) => e.version === winVersion.APP_VERSION);
  assert.ok(currentEntry, `RELEASE_NOTES debe incluir entrada para APP_VERSION (${winVersion.APP_VERSION})`);
  assert.equal(winVersion.RELEASE_NOTES[0].version, winVersion.APP_VERSION, 'La entrada más reciente debe encabezar RELEASE_NOTES');
  assert.ok(Array.isArray(currentEntry.items) && currentEntry.items.length >= 7, 'La entrada actual debe resumir los cambios clave');
});

test('Fase 14: RELEASE_NOTES está ordenado estrictamente de versión más nueva a más antigua', () => {
  const { winVersion } = loadVersionFromWindowAndWorker();
  for (let i = 0; i < winVersion.RELEASE_NOTES.length; i++) {
    const entry = winVersion.RELEASE_NOTES[i];
    assert.equal(winVersion.isValidSemver(entry.version), true, `SemVer inválida en RELEASE_NOTES[${i}]`);
    assert.ok(Array.isArray(entry.items) && entry.items.length > 0, `Notas vacías en ${entry.version}`);
    if (i > 0) {
      const prev = winVersion.RELEASE_NOTES[i - 1];
      assert.ok(
        winVersion.compareSemver(prev.version, entry.version) > 0,
        `Orden inválido: ${prev.version} debe ser estrictamente mayor que ${entry.version}`
      );
    }
  }
});

test('Fase 14: la versión actual no aparece escrita a mano fuera de js/version.js', () => {
  const { winVersion } = loadVersionFromWindowAndWorker();
  const verEscaped = winVersion.APP_VERSION.replace(/\./g, '\\.');
  const verRegex = new RegExp(`(?<![\\d.])${verEscaped}(?![\\d.])`, 'g');

  const filesToScan = [
    'index.html',
    ...walkFiles('css'),
    ...walkFiles('js')
  ].filter((f) => f !== 'js/version.js');

  for (const relPath of filesToScan) {
    const content = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      // Única excepción matemática existente: código de ficha de proporción '1.2.3' en el formulario
      if (relPath === 'js/tools/formula-sheets.js' && /code:\s*'1\.2\.3'/.test(line)) {
        return;
      }
      const match = line.match(verRegex);
      assert.equal(
        match,
        null,
        `Versión escrita a mano encontrada en ${relPath}:${idx + 1} -> ${line.trim()}`
      );
    });
  }
});

test('Fase 14: index.html carga js/version.js antes de todos los scripts propios y sw.js deriva su caché de version.js', () => {
  const { winVersion } = loadVersionFromWindowAndWorker();
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const scriptOrder = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  const verIdx = scriptOrder.indexOf('js/version.js');
  const appIdx = scriptOrder.indexOf('js/app.js');
  const firstEngineIdx = scriptOrder.findIndex((s) => s.startsWith('js/engine/'));

  assert.ok(verIdx >= 0, 'index.html debe incluir js/version.js');
  assert.ok(firstEngineIdx > verIdx, 'js/version.js debe cargarse antes que js/engine/*');
  assert.ok(appIdx > verIdx, 'js/version.js debe cargarse antes que js/app.js');

  const swCode = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
  assert.match(swCode, /importScripts\([^)]*['"]js\/version\.js['"]/, 'sw.js debe importar js/version.js');

  // Simular ejecución parcial de sw.js verificando el nombre del caché resultante
  let capturedCacheName = null;
  const importedScripts = [];
  const listeners = {};
  const swEnv = {
    globalThis: null,
    self: null,
    location: { origin: 'http://127.0.0.1:8000' },
    importScripts(...paths) {
      for (const p of paths) {
        importedScripts.push(p);
        const src = fs.readFileSync(path.join(ROOT_DIR, p), 'utf8');
        vm.runInContext(src, swContext, { filename: p });
      }
    },
    addEventListener(type, fn) {
      listeners[type] = fn;
    },
    skipWaiting() {},
    clients: { claim: () => Promise.resolve() },
    caches: {
      open(name) {
        capturedCacheName = name;
        return Promise.resolve({ addAll: () => Promise.resolve() });
      },
      keys: () => Promise.resolve([]),
      delete: () => Promise.resolve(true)
    }
  };
  swEnv.globalThis = swEnv;
  swEnv.self = swEnv;
  const swContext = vm.createContext(swEnv);
  vm.runInContext(swCode, swContext, { filename: 'sw.js' });

  assert.ok(importedScripts.includes('js/version.js'));
  assert.ok(typeof listeners.install === 'function', 'sw.js debe registrar evento install');
  listeners.install({ waitUntil: (p) => p });
  assert.equal(capturedCacheName, `matetic-v${winVersion.APP_VERSION}`);
});

test('Fase 18: resolveUpdateNoticeState cubre primera instalación, misma versión, actualización múltiple y fallo de localStorage', () => {
  const { winVersion } = loadVersionFromWindowAndWorker();
  const sampleNotes = [
    { version: '2.0.0', date: '2026-12-01', items: ['Novedad 4'] },
    { version: '1.5.0', date: '2026-11-28', items: ['Novedad 3'] },
    { version: '1.3.0', date: '2026-11-25', items: ['Novedad 2'] },
    { version: '1.1.0', date: '2026-11-20', items: ['Novedad 1'] },
    { version: '1.0.0', date: '2026-11-01', items: ['Inicial'] }
  ];

  // 1. Primera instalación / preferencias antiguas sin lastSeenVersion
  const firstInstall = winVersion.resolveUpdateNoticeState({
    currentVersion: '2.0.0',
    lastSeenVersion: '',
    releaseNotes: sampleNotes
  });
  assert.equal(firstInstall.shouldShow, true);
  assert.equal(firstInstall.isFirstInstall, true);
  assert.equal(firstInstall.notes.length, 1);
  assert.equal(firstInstall.notes[0].version, '2.0.0');
  assert.equal(firstInstall.hasMore, true);

  // 2. Misma versión ya vista -> no mostrar
  const sameVer = winVersion.resolveUpdateNoticeState({
    currentVersion: '2.0.0',
    lastSeenVersion: '2.0.0',
    releaseNotes: sampleNotes
  });
  assert.equal(sameVer.shouldShow, false);
  assert.equal(sameVer.notes.length, 0);

  // 3. Versión nueva simple (1 salto)
  const singleJump = winVersion.resolveUpdateNoticeState({
    currentVersion: '2.0.0',
    lastSeenVersion: '1.5.0',
    releaseNotes: sampleNotes
  });
  assert.equal(singleJump.shouldShow, true);
  assert.equal(singleJump.isFirstInstall, false);
  assert.deepEqual(singleJump.notes.map((n) => n.version), ['2.0.0']);

  // 4. Varias versiones saltadas (4 saltos -> tope 3 más recientes y hasMore: true)
  const multiJump = winVersion.resolveUpdateNoticeState({
    currentVersion: '2.0.0',
    lastSeenVersion: '1.0.0',
    releaseNotes: sampleNotes,
    maxNotes: 3
  });
  assert.equal(multiJump.shouldShow, true);
  assert.deepEqual(multiJump.notes.map((n) => n.version), ['2.0.0', '1.5.0', '1.3.0']);
  assert.equal(multiJump.hasMore, true);

  // 5. localStorage roto: cuando ya se mostró en la sesión actual no debe entrar en bucle
  const hapticsCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'engine', 'haptics.js'), 'utf8');
  const brokenStorage = {
    getItem() { throw new Error('QuotaExceeded / Private mode'); },
    setItem() { throw new Error('QuotaExceeded / Private mode'); }
  };
  const prefsSandbox = {
    console,
    navigator: {},
    localStorage: brokenStorage,
    window: null
  };
  prefsSandbox.window = prefsSandbox;
  vm.runInNewContext(hapticsCode, prefsSandbox);
  assert.doesNotThrow(() => {
    prefsSandbox.MatInteractiva.Preferences.setPreference('lastSeenVersion', winVersion.APP_VERSION);
  });

  const guardAfterFailure = winVersion.resolveUpdateNoticeState({
    currentVersion: '2.0.0',
    lastSeenVersion: prefsSandbox.MatInteractiva.Preferences.getPreferences().lastSeenVersion,
    releaseNotes: sampleNotes,
    alreadyShownInSession: true
  });
  assert.equal(guardAfterFailure.shouldShow, false);
});

