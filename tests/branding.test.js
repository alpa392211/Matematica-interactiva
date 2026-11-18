const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Identificadores internos de localStorage que NO deben renombrarse por compatibilidad
const ALLOWED_INTERNAL_BRAND_TOKENS = [
  'matematica_interactiva_progreso_v1',
  'matematica_interactiva_tema_v1',
  'matematica_interactiva_preferencias_v1'
];

function walkFiles(dirRel) {
  const fullDir = path.join(ROOT_DIR, dirRel);
  if (!fs.existsSync(fullDir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const rel = path.posix.join(dirRel.replace(/\\/g, '/'), entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(rel));
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

function stripAllowedInternalIds(line) {
  let clean = line;
  for (const allowed of ALLOWED_INTERNAL_BRAND_TOKENS) {
    clean = clean.split(allowed).join('');
  }
  return clean;
}

test('Fase 15: el nombre anterior ("Matemática Interactiva") no reaparece en index.html, js/, css/ ni manifest', () => {
  const targets = [
    'index.html',
    ...walkFiles('js'),
    ...walkFiles('css')
  ];
  if (fs.existsSync(path.join(ROOT_DIR, 'manifest.webmanifest'))) {
    targets.push('manifest.webmanifest');
  }

  const forbiddenPattern = /matem[áa]tica[- _]?interactiva/i;

  for (const relPath of targets) {
    const content = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      const sanitized = stripAllowedInternalIds(line);
      assert.equal(
        forbiddenPattern.test(sanitized),
        false,
        `Nombre anterior detectado en ${relPath}:${idx + 1} -> ${line.trim()}`
      );
    });
  }
});

test('Fase 15: las claves de localStorage y el namespace window.MatInteractiva permanecen intactos', () => {
  const storageCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'engine', 'storage.js'), 'utf8');
  const hapticsCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'engine', 'haptics.js'), 'utf8');
  const appCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');

  assert.match(storageCode, /matematica_interactiva_progreso_v1/);
  assert.match(appCode, /matematica_interactiva_tema_v1/);
  assert.match(hapticsCode, /matematica_interactiva_preferencias_v1/);
  assert.match(appCode, /window\.MatInteractiva/);
});

test('Fase 15: index.html, js/version.js y js/app.js reflejan la marca MateTic', () => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const appCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');
  const versionCode = fs.readFileSync(path.join(ROOT_DIR, 'js', 'version.js'), 'utf8');

  assert.match(html, /<title>\s*MateTic\s*\|/i);
  assert.match(html, /class="brand-title">MateTic</);
  assert.match(versionCode, /APP_NAME\s*=\s*'MateTic'/);
  assert.match(appCode, /getAppName\(\)/);
});
