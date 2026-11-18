const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.resolve(__dirname, '..');

function walkFiles(dirRel) {
  const full = path.join(ROOT_DIR, dirRel);
  if (!fs.existsSync(full)) return [];
  const results = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.posix.join(dirRel.replace(/\\/g, '/'), entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(rel));
    } else if (entry.isFile()) {
      results.push(rel);
    }
  }
  return results;
}

function readPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(buf.subarray(0, 8).equals(pngSig), true, `${filePath} debe ser un PNG válido`);
  assert.equal(buf.subarray(12, 16).toString('ascii'), 'IHDR');
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20)
  };
}

test('Fase 20: manifest.webmanifest es JSON válido e íconos PNG locales existen con dimensiones exactas', () => {
  const manifestPath = path.join(ROOT_DIR, 'manifest.webmanifest');
  assert.ok(fs.existsSync(manifestPath), 'Debe existir manifest.webmanifest en la raíz');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  assert.equal(manifest.name, 'MateTic');
  assert.equal(manifest.short_name, 'MateTic');
  assert.equal(manifest.lang, 'es');
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.id, './');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.theme_color);
  assert.ok(manifest.background_color);
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3);

  const has192 = manifest.icons.some((ic) => ic.sizes === '192x192' && (!ic.purpose || ic.purpose.includes('any')));
  const has512 = manifest.icons.some((ic) => ic.sizes === '512x512' && (!ic.purpose || ic.purpose.includes('any')));
  const hasMaskable = manifest.icons.some((ic) => ic.sizes === '512x512' && ic.purpose && ic.purpose.includes('maskable'));
  assert.ok(has192, 'El manifest debe declarar icono 192x192');
  assert.ok(has512, 'El manifest debe declarar icono 512x512');
  assert.ok(hasMaskable, 'El manifest debe declarar icono maskable 512x512');

  for (const ic of manifest.icons) {
    assert.ok(!/^https?:/i.test(ic.src) && !ic.src.startsWith('/'), `Ruta de icono debe ser relativa: ${ic.src}`);
    const abs = path.join(ROOT_DIR, ic.src);
    assert.ok(fs.existsSync(abs), `Falta el archivo de icono ${ic.src}`);
    const [w, h] = ic.sizes.split('x').map(Number);
    const actual = readPngDimensions(abs);
    assert.deepEqual(actual, { width: w, height: h }, `Dimensiones reales de ${ic.src} no coinciden`);
  }

  const appleDims = readPngDimensions(path.join(ROOT_DIR, 'icons', 'apple-touch-icon.png'));
  assert.deepEqual(appleDims, { width: 180, height: 180 });
});

test('Fase 20: js/precache-manifest.js contiene todos los recursos de index.html, PWA y vendor/ sincronizados con disco', () => {
  const ctx = { globalThis: null };
  ctx.globalThis = ctx;
  vm.runInNewContext(fs.readFileSync(path.join(ROOT_DIR, 'js', 'precache-manifest.js'), 'utf8'), ctx);
  const assets = ctx.MATETIC_PRECACHE_ASSETS;
  assert.ok(Array.isArray(assets) && assets.length > 50);

  const assetSet = new Set(assets);
  assert.equal(assetSet.size, assets.length, 'El manifiesto de precache no debe tener duplicados');

  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|#|data:)/i.test(ref)) continue;
    assert.ok(assetSet.has(ref.replace(/^\.\//, '')), `Falta en precache referencia de index.html: ${ref}`);
  }

  for (const requiredFile of [
    './',
    'index.html',
    'manifest.webmanifest',
    ...walkFiles('css'),
    ...walkFiles('js'),
    ...walkFiles('icons').filter((f) => f.endsWith('.png')),
    ...walkFiles('vendor').filter((f) => {
      const b = path.posix.basename(f);
      return b !== 'VENDOR.md' && !b.startsWith('LICENSE');
    })
  ]) {
    assert.ok(assetSet.has(requiredFile), `Recurso necesario ausente en js/precache-manifest.js: ${requiredFile}`);
  }

  for (const listed of assets) {
    assert.ok(!/^https?:/i.test(listed) && !listed.startsWith('/'), `Ruta de precache debe ser relativa: ${listed}`);
    if (listed !== './') {
      assert.ok(fs.existsSync(path.join(ROOT_DIR, listed)), `Recurso obsoleto en js/precache-manifest.js (no existe en disco): ${listed}`);
    }
  }
});

test('Fase 20: sw.js realiza precache atómico, limpia cachés antiguos y separa estrategias', async () => {
  const swCode = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
  assert.doesNotMatch(swCode, /jsdelivr|unpkg|cdnjs|googleapis/i, 'sw.js no debe incluir listas de CDN externos');

  function makeSwEnv({ addAllShouldFail = false, existingCacheKeys = [] } = {}) {
    const listeners = {};
    const deletedCaches = [];
    let skipped = false;
    let claimed = false;
    const env = {
      globalThis: null,
      self: null,
      location: { origin: 'https://example.local' },
      URL,
      Response: globalThis.Response,
      importScripts(...paths) {
        for (const p of paths) {
          vm.runInContext(fs.readFileSync(path.join(ROOT_DIR, p), 'utf8'), ctx, { filename: p });
        }
      },
      addEventListener(t, fn) { listeners[t] = fn; },
      skipWaiting() { skipped = true; },
      clients: { claim: () => { claimed = true; return Promise.resolve(); } },
      caches: {
        open() {
          return Promise.resolve({
            addAll() {
              return addAllShouldFail ? Promise.reject(new Error('Network fail')) : Promise.resolve();
            },
            put() { return Promise.resolve(); }
          });
        },
        keys: () => Promise.resolve(existingCacheKeys),
        delete: (k) => { deletedCaches.push(k); return Promise.resolve(true); },
        match: () => Promise.resolve(undefined)
      }
    };
    env.globalThis = env;
    env.self = env;
    const ctx = vm.createContext(env);
    vm.runInContext(swCode, ctx, { filename: 'sw.js' });
    return { listeners, deletedCaches, getState: () => ({ skipped, claimed }), ctx };
  }

  // Caso 1: Fallo durante precache -> instalación falla, NO skipWaiting y limpia el caché parcial
  const failEnv = makeSwEnv({ addAllShouldFail: true });
  const expectedCacheName = failEnv.ctx.MatInteractivaVersion.getCacheName();
  let installPromise;
  failEnv.listeners.install({ waitUntil(p) { installPromise = p; } });
  await assert.rejects(installPromise, /Network fail/);
  assert.equal(failEnv.getState().skipped, false, 'No debe hacer skipWaiting si falló addAll');
  assert.ok(failEnv.deletedCaches.includes(expectedCacheName));

  // Caso 2: Instalación exitosa + Activate elimina solo versiones antiguas
  const okEnv = makeSwEnv({ existingCacheKeys: ['matetic-v1.0.0', 'matetic-v1.0.1', expectedCacheName, 'otro-cache'] });
  let okInstall;
  okEnv.listeners.install({ waitUntil(p) { okInstall = p; } });
  await okInstall;
  assert.equal(okEnv.getState().skipped, true);

  let okActivate;
  okEnv.listeners.activate({ waitUntil(p) { okActivate = p; } });
  await okActivate;
  assert.equal(okEnv.getState().claimed, true);
  assert.deepEqual(okEnv.deletedCaches, ['matetic-v1.0.0', 'matetic-v1.0.1']);
});
