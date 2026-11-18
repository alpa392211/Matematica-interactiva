/* ==========================================================================
   MATETIC - Fondo Matemático Animado Ambiental
   Archivo: js/engine/ambient-bg.js
   Renderiza símbolos y fórmulas flotantes suaves en un canvas 2D fijo
   detrás del contenido. Se pausa cuando la pestaña está oculta, respeta
   prefers-reduced-motion y limita partículas según el ancho de pantalla.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const SYMBOLS = [
    'π', '∫', '∑', '√x', '∞', 'lím', "f'(x)", 'dy/dx',
    'eˣ', 'sen x', 'eⁱπ+1=0', 'x²', '∀ε>0', '∃δ>0', '∇×F', '∮',
    'det(A)', 'λ', '∂y/∂x', 'ℝⁿ', 'Δy/Δx', '∫f(x)dx'
  ];

  // Tres planos de profundidad para paralaje y constelación matemática
  const DEPTH_LAYERS = [
    { scale: 0.86, fontPx: 14, speedMin: 8, speedMax: 13, alphaMin: 0.06, alphaMax: 0.088 },
    { scale: 1.0,  fontPx: 19, speedMin: 13, speedMax: 20, alphaMin: 0.075, alphaMax: 0.11 },
    { scale: 1.18, fontPx: 25, speedMin: 18, speedMax: 27, alphaMin: 0.09, alphaMax: 0.132 }
  ];

  const MOBILE_MAX = 14;
  const DESKTOP_MAX = 28;

  const LIGHT_PALETTES = {
    cristal: ['#1e3a8a', '#3730a3', '#0f766e'],
    esmeralda: ['#047857', '#0284c7', '#0f766e'],
    aurora: ['#9d174d', '#b45309', '#4338ca']
  };
  const DARK_PALETTES = {
    cosmos: ['#93c5fd', '#a5b4fc', '#67e8f9'],
    abismo: ['#67e8f9', '#34d399', '#60a5fa'],
    nebulosa: ['#f0abfc', '#fda4af', '#a5b4fc']
  };

  function getTargetCount(width) {
    return width <= 640 ? MOBILE_MAX : DESKTOP_MAX;
  }

  function getCurrentPreset(theme) {
    if (typeof document === 'undefined') {
      return theme === 'dark' ? 'cosmos' : 'cristal';
    }
    const attr = theme === 'dark'
      ? document.documentElement.getAttribute('data-bg-dark')
      : document.documentElement.getAttribute('data-bg-light');
    return attr || (theme === 'dark' ? 'cosmos' : 'cristal');
  }

  function getThemePalette(theme, presetOverride) {
    if (theme === 'dark') {
      const p = presetOverride || getCurrentPreset('dark');
      return DARK_PALETTES[p] || DARK_PALETTES.cosmos;
    }
    const p = presetOverride || getCurrentPreset('light');
    return LIGHT_PALETTES[p] || LIGHT_PALETTES.cristal;
  }

  function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    try {
      return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  function getCurrentTheme() {
    if (typeof document === 'undefined') return 'light';
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') return explicit;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (_) {}
    return 'light';
  }

  function createParticles(width, height, rand = Math.random) {
    const safeW = Math.max(320, width || 390);
    const safeH = Math.max(400, height || 844);
    const count = getTargetCount(safeW);
    const particles = [];

    for (let i = 0; i < count; i++) {
      const layerIdx = i % DEPTH_LAYERS.length;
      const layer = DEPTH_LAYERS[layerIdx];
      const alpha = layer.alphaMin + rand() * (layer.alphaMax - layer.alphaMin);
      const speedY = -(layer.speedMin + rand() * (layer.speedMax - layer.speedMin));
      const driftAmp = 4 + rand() * 8;
      const driftFreq = 0.25 + rand() * 0.4;
      const phase = rand() * Math.PI * 2;
      const rotation = (rand() - 0.5) * 0.24;
      const rotSpeed = (rand() - 0.5) * 0.11;
      const pulsePhase = rand() * Math.PI * 2;
      const pulseSpeed = 0.6 + rand() * 0.8;

      particles.push({
        text: SYMBOLS[i % SYMBOLS.length],
        layerIdx,
        colorIdx: i % 3,
        fontPx: layer.fontPx,
        alpha,
        x: rand() * safeW,
        y: rand() * safeH,
        speedY,
        driftAmp,
        driftFreq,
        phase,
        rotation,
        rotSpeed,
        pulsePhase,
        pulseSpeed
      });
    }
    return particles;
  }

  function stepParticles(particles, width, height, dtSec) {
    const safeW = Math.max(320, width || 390);
    const safeH = Math.max(400, height || 844);
    const dt = Math.min(0.06, Math.max(0.001, dtSec || 0.016));

    for (const p of particles) {
      p.y += p.speedY * dt;
      p.phase += p.driftFreq * dt;
      p.rotation += (p.rotSpeed || 0) * dt;
      p.pulsePhase = (p.pulsePhase || 0) + (p.pulseSpeed || 0) * dt;
      if (p.y < -40) {
        p.y = safeH + 30;
        p.x = ((p.x + safeW * 0.27) % safeW);
      }
    }
  }

  let canvas = null;
  let ctx = null;
  let particles = [];
  let rafId = null;
  let lastTs = 0;
  let viewportW = 0;
  let viewportH = 0;
  let enabled = true;
  let isTabHidden = false;
  let resizeTimer = null;

  function drawFrame() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, viewportW, viewportH);
    if (!enabled) return;

    const palette = getThemePalette(getCurrentTheme());
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Conexiones sutiles tipo constelación entre nodos cercanos del mismo plano
    const coords = particles.map((p) => ({
      x: p.x + Math.sin(p.phase) * p.driftAmp,
      y: p.y,
      p
    }));
    const maxDistSq = 155 * 155;
    ctx.lineWidth = 0.9;
    for (let i = 0; i < coords.length; i++) {
      const a = coords[i];
      for (let j = i + 1; j < coords.length; j++) {
        const b = coords[j];
        if (a.p.layerIdx !== b.p.layerIdx) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxDistSq) {
          const factor = 1 - Math.sqrt(d2) / 155;
          ctx.save();
          ctx.strokeStyle = palette[a.p.colorIdx % palette.length];
          ctx.globalAlpha = 0.042 * factor;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    for (const c of coords) {
      const p = c.p;
      const pulse = 1 + Math.sin(p.pulsePhase || 0) * 0.08;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(p.rotation);
      ctx.scale(pulse, pulse);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = palette[p.colorIdx % palette.length];
      ctx.font = `600 ${p.fontPx}px "Segoe UI", system-ui, -apple-system, sans-serif`;
      ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }
  }

  function resizeCanvas(rebuildParticles = false) {
    if (!canvas || typeof window === 'undefined') return;
    const prevCount = particles.length;
    viewportW = Math.max(320, window.innerWidth || 1280);
    viewportH = Math.max(400, window.innerHeight || 800);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(viewportW * dpr);
    canvas.height = Math.round(viewportH * dpr);
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const expectedCount = getTargetCount(viewportW);
    if (rebuildParticles || prevCount !== expectedCount) {
      particles = createParticles(viewportW, viewportH);
    }
    drawFrame();
  }

  function stopLoop() {
    if (rafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
    }
    rafId = null;
    lastTs = 0;
  }

  function loop(ts) {
    if (!enabled || isTabHidden || prefersReducedMotion()) {
      stopLoop();
      drawFrame();
      return;
    }
    if (!lastTs) lastTs = ts;
    const dtSec = (ts - lastTs) / 1000;
    lastTs = ts;

    stepParticles(particles, viewportW, viewportH, dtSec);
    drawFrame();
    rafId = requestAnimationFrame(loop);
  }

  function syncLoopState() {
    if (!canvas) return;
    if (!enabled) {
      stopLoop();
      drawFrame();
      return;
    }
    if (prefersReducedMotion() || isTabHidden) {
      stopLoop();
      drawFrame();
      return;
    }
    if (rafId === null && typeof requestAnimationFrame === 'function') {
      lastTs = 0;
      rafId = requestAnimationFrame(loop);
    }
  }

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    if (canvas) {
      canvas.style.display = enabled ? 'block' : 'none';
    }
    syncLoopState();
  }

  function refreshTheme() {
    drawFrame();
  }

  function init() {
    if (typeof document === 'undefined') return;
    canvas = document.getElementById('ambient-math-canvas');
    if (!canvas) return;

    const prefs = (ns.Preferences && typeof ns.Preferences.getPreferences === 'function')
      ? ns.Preferences.getPreferences()
      : { ambientBgEnabled: true };
    enabled = prefs.ambientBgEnabled !== false;
    isTabHidden = Boolean(document.hidden);

    resizeCanvas(true);
    setEnabled(enabled);

    document.addEventListener('visibilitychange', () => {
      isTabHidden = Boolean(document.hidden);
      syncLoopState();
    });

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas(false);
      }, 150);
    });

    if (typeof window.matchMedia === 'function') {
      const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (typeof reducedQuery.addEventListener === 'function') {
        reducedQuery.addEventListener('change', syncLoopState);
      }
    }
  }

  ns.AmbientBackground = {
    SYMBOLS,
    MOBILE_MAX,
    DESKTOP_MAX,
    getTargetCount,
    getThemePalette,
    createParticles,
    stepParticles,
    init,
    setEnabled,
    refreshTheme,
    isRunning: () => rafId !== null,
    isPaused: () => isTabHidden || !enabled || prefersReducedMotion()
  };
})(window.MatInteractiva);
