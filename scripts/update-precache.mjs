/**
 * Regenera `js/precache-manifest.js` con todos los recursos locales necesarios
 * para el funcionamiento sin conexión de MateTic.
 *
 * Uso: node scripts/update-precache.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function walkFiles(relDir) {
  const fullDir = path.join(ROOT_DIR, relDir);
  if (!fs.existsSync(fullDir)) return [];
  const results = [];
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const relPath = path.posix.join(relDir.replace(/\\/g, '/'), entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(relPath));
    } else if (entry.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

function collectAssets() {
  const seen = new Set(['./', 'index.html']);

  if (fs.existsSync(path.join(ROOT_DIR, 'manifest.webmanifest'))) {
    seen.add('manifest.webmanifest');
  }

  // Extraer referencias locales declaradas en index.html
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const asset = m[1].trim();
    if (!asset || /^(https?:|#|data:)/i.test(asset)) continue;
    const normalized = asset.replace(/^\.\//, '');
    if (fs.existsSync(path.join(ROOT_DIR, normalized))) {
      seen.add(normalized);
    }
  }

  // Incluir hojas CSS, scripts JS propios (excepto el propio manifiesto, incluido abajo)
  for (const cssFile of walkFiles('css')) {
    seen.add(cssFile);
  }
  for (const jsFile of walkFiles('js')) {
    seen.add(jsFile);
  }
  for (const iconFile of walkFiles('icons')) {
    if (iconFile.endsWith('.png')) {
      seen.add(iconFile);
    }
  }

  // Incluir recursos locales de KaTeX y MathLive (sin documentación ni licencias)
  for (const vendorFile of walkFiles('vendor')) {
    const base = path.posix.basename(vendorFile);
    if (base === 'VENDOR.md' || base.startsWith('LICENSE')) continue;
    seen.add(vendorFile);
  }

  return Array.from(seen);
}

const assets = collectAssets();
const totalBytes = assets.reduce((sum, rel) => {
  if (rel === './') return sum;
  const full = path.join(ROOT_DIR, rel);
  return fs.existsSync(full) ? sum + fs.statSync(full).size : sum;
}, 0);

const output = `/* ==========================================================================
   MATETIC - Lista Generada de Recursos para Precache Offline
   Archivo: js/precache-manifest.js
   NO editar manualmente: regenerar con \`node scripts/update-precache.mjs\`
   ========================================================================== */

(function (root) {
  'use strict';

  const PRECACHE_ASSETS = ${JSON.stringify(assets, null, 4).replace(/\n/g, '\n  ')};

  root.MATETIC_PRECACHE_ASSETS = PRECACHE_ASSETS;
})(typeof globalThis !== 'undefined' ? globalThis : self);
`;

fs.writeFileSync(path.join(ROOT_DIR, 'js', 'precache-manifest.js'), output, 'utf8');
console.log(
  `PRECACHE_UPDATED (${assets.length} recursos, ${(totalBytes / (1024 * 1024)).toFixed(2)} MiB)`
);
