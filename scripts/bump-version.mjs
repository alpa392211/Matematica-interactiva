/**
 * Incrementa la versión en `js/version.js` siguiendo SemVer, fija la fecha del día,
 * inserta una nueva entrada al inicio de `RELEASE_NOTES` y regenera la lista de precache.
 *
 * Uso:
 *   node scripts/bump-version.mjs <patch|minor|major> "nota 1" "nota 2" ...
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const VERSION_FILE = path.join(ROOT_DIR, 'js', 'version.js');

const [, , levelArg, ...notesArgs] = process.argv;
const allowedLevels = new Set(['patch', 'minor', 'major']);

if (!allowedLevels.has(levelArg) || notesArgs.length === 0) {
  console.error('Uso: node scripts/bump-version.mjs <patch|minor|major> "nota 1" ["nota 2" ...]');
  process.exit(1);
}

const raw = fs.readFileSync(VERSION_FILE, 'utf8');
const verMatch = /const APP_VERSION = '(\d+)\.(\d+)\.(\d+)';/.exec(raw);
if (!verMatch) {
  console.error('No se pudo localizar APP_VERSION SemVer en js/version.js');
  process.exit(1);
}

let major = Number(verMatch[1]);
let minor = Number(verMatch[2]);
let patch = Number(verMatch[3]);

if (levelArg === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (levelArg === 'minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const nextVersion = `${major}.${minor}.${patch}`;
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const today = `${yyyy}-${mm}-${dd}`;

const escapeSingle = (str) => String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const cleanNotes = notesArgs.map((n) => n.trim()).filter(Boolean);

if (cleanNotes.length === 0) {
  console.error('Debes proporcionar al menos una nota descriptiva en español.');
  process.exit(1);
}

const newEntryBlock = [
  '    {',
  `      version: '${nextVersion}',`,
  `      date: '${today}',`,
  '      items: [',
  cleanNotes.map((item) => `        '${escapeSingle(item)}'`).join(',\n'),
  '      ]',
  '    },'
].join('\n');

let updated = raw
  .replace(/const APP_VERSION = '[^']+';/, `const APP_VERSION = '${nextVersion}';`)
  .replace(/const APP_RELEASE_DATE = '[^']+';/, `const APP_RELEASE_DATE = '${today}';`);

const releaseMarker = 'const RELEASE_NOTES = [\n';
const markerIdx = updated.indexOf(releaseMarker);
if (markerIdx === -1) {
  console.error('No se encontró `const RELEASE_NOTES = [` en js/version.js');
  process.exit(1);
}

const insertPos = markerIdx + releaseMarker.length;
updated = updated.slice(0, insertPos) + newEntryBlock + '\n' + updated.slice(insertPos);

fs.writeFileSync(VERSION_FILE, updated, 'utf8');
console.log(`Versión actualizada a ${nextVersion} (${today}) en js/version.js`);

const precacheScript = path.join(ROOT_DIR, 'scripts', 'update-precache.mjs');
if (fs.existsSync(precacheScript)) {
  execFileSync(process.execPath, [precacheScript], { stdio: 'inherit' });
}
