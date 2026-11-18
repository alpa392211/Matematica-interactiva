/**
 * Genera localmente los íconos PNG de MateTic (`∫π`) sin usar recursos ni APIs remotas,
 * renderizando un SVG propio a través de Chromium/Edge headless.
 *
 * Uso: node scripts/generate-icons.mjs
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT_DIR, 'icons');
fs.mkdirSync(ICONS_DIR, { recursive: true });

const BROWSER_BIN = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find((p) => fs.existsSync(p));

if (!BROWSER_BIN) {
  throw new Error('Se requiere Chrome o Edge instalado para generar los íconos PNG localmente.');
}

function buildSvgDataUrl({ size, maskable = false }) {
  const rx = maskable ? 0 : Math.round(size * 0.22);
  const symbolFont = maskable ? Math.round(size * 0.44) : Math.round(size * 0.54);
  const strokeWidth = Math.max(2, Math.round(size * 0.015));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E3A8A"/>
        <stop offset="55%" stop-color="#2563EB"/>
        <stop offset="100%" stop-color="#4F46E5"/>
      </linearGradient>
      <radialGradient id="glow" cx="30%" cy="22%" r="72%">
        <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${rx}" fill="url(#bg)"/>
    <rect width="${size}" height="${size}" rx="${rx}" fill="url(#glow)"/>
    ${maskable ? '' : `<rect x="${strokeWidth}" y="${strokeWidth}" width="${size - strokeWidth * 2}" height="${size - strokeWidth * 2}" rx="${Math.max(0, rx - strokeWidth)}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="${strokeWidth}"/>`}
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="central"
          font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-style="italic"
          font-size="${symbolFont}" fill="#FFFFFF" letter-spacing="-0.03em">∫π</text>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const specs = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: false }
];

const TMP_PROFILE = fs.mkdtempSync(path.join(os.tmpdir(), 'matetic-icons-'));
const CDP_PORT = 9249;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitForHttp(url, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { const res = await fetch(url); if (res.ok) return res; } catch (_) {}
    await sleep(150);
  }
  throw new Error(`Timeout esperando ${url}`);
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.ready = new Promise((res, rej) => {
      this.ws.addEventListener('open', res);
      this.ws.addEventListener('error', rej);
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    });
  }
  async connect() { await this.ready; }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { try { this.ws.close(); } catch (_) {} }
}

let browserProc = null;
try {
  browserProc = spawn(BROWSER_BIN, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${TMP_PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ], { stdio: 'ignore' });

  const targets = await (await waitForHttp(`http://127.0.0.1:${CDP_PORT}/json/list`, 12000)).json();
  const cdp = new CDPClient((targets.find((t) => t.type === 'page') || targets[0]).webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  for (const spec of specs) {
    const svgUrl = buildSvgDataUrl(spec);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: spec.size,
      height: spec.size,
      deviceScaleFactor: 1,
      mobile: false
    });

    const b64 = await cdp.send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = ${spec.size};
        canvas.height = ${spec.size};
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, ${spec.size}, ${spec.size});
          resolve(canvas.toDataURL('image/png').split(',')[1]);
        };
        img.onerror = (e) => reject(new Error('SVG render error'));
        img.src = ${JSON.stringify(svgUrl)};
      })`
    });

    if (b64.exceptionDetails) {
      throw new Error(JSON.stringify(b64.exceptionDetails));
    }
    const buf = Buffer.from(b64.result.value, 'base64');
    fs.writeFileSync(path.join(ICONS_DIR, spec.file), buf);
    console.log(`Generated ${spec.file} (${buf.length} bytes)`);
  }

  cdp.close();
} finally {
  try { browserProc?.kill('SIGKILL'); } catch (_) {}
  try { fs.rmSync(TMP_PROFILE, { recursive: true, force: true }); } catch (_) {}
}
