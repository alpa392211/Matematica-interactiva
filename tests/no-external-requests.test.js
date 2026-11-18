const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Lista blanca mínima y explícita: enlace de apoyo Ko-fi (solo al hacer clic) y namespaces XML/W3C no-red
const ALLOWED_EXTERNAL_URLS = new Set([
  'https://ko-fi.com/edrx_ngl',
  'http://www.w3.org/2000/svg',
  'http://www.w3.org/1998/Math/MathML',
  'http://www.w3.org/1999/xhtml',
  'http://www.w3.org/1999/xlink',
  'http://www.w3.org/2001/10/synthesis'
]);

function walkServedFiles(dirRel) {
  const full = path.join(ROOT_DIR, dirRel);
  if (!fs.existsSync(full)) return [];
  const results = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.posix.join(dirRel.replace(/\\/g, '/'), entry.name);
    if (entry.isDirectory()) {
      results.push(...walkServedFiles(rel));
    } else if (entry.isFile()) {
      results.push(rel);
    }
  }
  return results;
}

test('Fase 16: ningún archivo servido contiene URLs externas http(s) fuera de la lista blanca', () => {
  const candidateFiles = [
    'index.html',
    'sw.js',
    ...walkServedFiles('css'),
    ...walkServedFiles('js'),
    ...walkServedFiles('vendor').filter((rel) => {
      const base = path.posix.basename(rel);
      return base !== 'VENDOR.md' && !base.startsWith('LICENSE') && /\.(js|css|json|html|svg|txt)$/i.test(base);
    })
  ];

  if (fs.existsSync(path.join(ROOT_DIR, 'manifest.webmanifest'))) {
    candidateFiles.push('manifest.webmanifest');
  }

  const urlRegex = /https?:\/\/[^\s"'`)<>\\]+/g;

  for (const relPath of candidateFiles) {
    const content = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
    const matches = content.match(urlRegex) || [];
    for (const url of matches) {
      assert.ok(
        ALLOWED_EXTERNAL_URLS.has(url),
        `URL externa no permitida en ${relPath}: ${url}`
      );
    }
  }
});

test('Fase 16: KaTeX y MathLive locales existen en vendor/ con solo fuentes woff2 y licencias MIT', () => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net/i, 'index.html no debe referenciar CDN');
  assert.doesNotMatch(html, /crossorigin=/i, 'Rutas locales no requieren crossorigin');

  const requiredFiles = [
    'vendor/VENDOR.md',
    'vendor/katex/LICENSE',
    'vendor/katex/katex.min.css',
    'vendor/katex/katex.min.js',
    'vendor/mathlive/LICENSE',
    'vendor/mathlive/mathlive-static.css',
    'vendor/mathlive/mathlive.min.js'
  ];
  for (const rel of requiredFiles) {
    assert.ok(fs.existsSync(path.join(ROOT_DIR, rel)), `Falta recurso local requerido: ${rel}`);
  }

  const katexCss = fs.readFileSync(path.join(ROOT_DIR, 'vendor', 'katex', 'katex.min.css'), 'utf8');
  assert.doesNotMatch(katexCss, /\.woff["')]|\.ttf["')]/, 'vendor/katex/katex.min.css solo debe referenciar woff2');

  const katexFonts = walkServedFiles('vendor/katex/fonts');
  const mathliveFonts = walkServedFiles('vendor/mathlive/fonts');
  assert.equal(katexFonts.length, 20, 'KaTeX debe tener sus 20 fuentes .woff2');
  assert.equal(mathliveFonts.length, 20, 'MathLive debe tener sus 20 fuentes .woff2');
  assert.ok(katexFonts.every((f) => f.endsWith('.woff2')));
  assert.ok(mathliveFonts.every((f) => f.endsWith('.woff2')));
});
