/* ==========================================================================
   MATETIC - Gráficas Interactivas Integradas en Lecciones
   Archivo: js/tools/lesson-graphs.js
   Proporciona utilidades puras de vista/escala (GraphViewport) y laboratorios
   visuales adaptados a móvil y escritorio con tema claro/oscuro, gestos de
   dos dedos y modo Expandir a pantalla completa.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Utilidades Puras de Vista, Escala, Ejes y Gestos (GraphViewport)
     ------------------------------------------------------------------------ */
  function clampScale(scale, minScale = 8, maxScale = 260) {
    const n = Number(scale);
    if (!isFinite(n)) return 42;
    return Math.min(maxScale, Math.max(minScale, n));
  }

  function mathToScreen(mx, my, centerX, centerY, scale, width, height) {
    return {
      px: width / 2 + (mx - centerX) * scale,
      py: height / 2 - (my - centerY) * scale
    };
  }

  function screenToMath(px, py, centerX, centerY, scale, width, height) {
    return {
      mx: centerX + (px - width / 2) / scale,
      my: centerY - (py - height / 2) / scale
    };
  }

  /**
   * Calcula el paso de cuadrícula (1, 2, 5 × 10^k) para que las marcas de ejes
   * mantengan una separación mínima legible en píxeles y nunca se amontonen en móvil.
   */
  function computeOptimalGridStep(scale, minPxBetweenTicks = 48) {
    const safeScale = Math.max(1e-4, Number(scale) || 44);
    const rawStep = Math.max(1e-6, (Number(minPxBetweenTicks) || 48) / safeScale);
    const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / pow10;
    const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return Number((mult * pow10).toPrecision(10));
  }

  function shouldSingleFingerPan(isExpanded) {
    return Boolean(isExpanded);
  }

  /**
   * Aplica zoom centrado en el punto medio (midPx, midPy) y desplazamiento
   * simultáneo de dos dedos sobre el plano matemático.
   */
  function applyPinchZoom({
    scale,
    prevDist,
    nextDist,
    centerX,
    centerY,
    panDx = 0,
    panDy = 0,
    midPx,
    midPy,
    width,
    height,
    minScale = 8,
    maxScale = 260
  }) {
    const safePrev = Math.max(1, Number(prevDist) || 1);
    const safeNext = Math.max(1, Number(nextDist) || safePrev);
    const prevScale = clampScale(scale, minScale, maxScale);
    const nextScale = clampScale(prevScale * (safeNext / safePrev), minScale, maxScale);

    const anchorX = typeof midPx === 'number' ? midPx : width / 2;
    const anchorY = typeof midPy === 'number' ? midPy : height / 2;
    const before = screenToMath(anchorX, anchorY, centerX, centerY, prevScale, width, height);

    let nextCenterX = before.mx - (anchorX - width / 2) / nextScale;
    let nextCenterY = before.my + (anchorY - height / 2) / nextScale;

    nextCenterX -= (Number(panDx) || 0) / nextScale;
    nextCenterY += (Number(panDy) || 0) / nextScale;

    return {
      scale: nextScale,
      centerX: nextCenterX,
      centerY: nextCenterY
    };
  }

  function getGraphThemePalette() {
    let isDark = false;
    try {
      const explicit = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
      isDark = explicit === 'dark' ||
        (!explicit && typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (_) {
      isDark = false;
    }

    if (isDark) {
      return {
        isDark: true,
        bg: '#0F172A',
        grid: 'rgba(148, 163, 184, 0.16)',
        axis: '#94A3B8',
        tickText: '#CBD5E1',
        curvePrimary: '#60A5FA',
        curveSecondary: '#34D399',
        curveTertiary: '#C084FC',
        derivativeCurve: '#A78BFA',
        tangent: '#F87171',
        normal: '#2DD4BF',
        secant: '#FBBF24',
        limitLeft: '#34D399',
        limitRight: '#C084FC',
        asymptote: '#F87171',
        hAsymptote: '#2DD4BF',
        integralFill: 'rgba(96, 165, 250, 0.22)',
        areaPosFill: 'rgba(52, 211, 153, 0.26)',
        areaNegFill: 'rgba(248, 113, 113, 0.25)',
        pointStroke: '#0F172A',
        holeFill: '#0F172A',
        tooltipBg: 'rgba(15, 23, 42, 0.94)',
        tooltipBorder: '#60A5FA',
        tooltipText: '#F8FAFC'
      };
    }

    return {
      isDark: false,
      bg: '#FFFFFF',
      grid: '#E2E8F0',
      axis: '#475569',
      tickText: '#334155',
      curvePrimary: '#2563EB',
      curveSecondary: '#059669',
      curveTertiary: '#7C3AED',
      derivativeCurve: '#7C3AED',
      tangent: '#DC2626',
      normal: '#0D9488',
      secant: '#D97706',
      limitLeft: '#059669',
      limitRight: '#7C3AED',
      asymptote: '#DC2626',
      hAsymptote: '#0D9488',
      integralFill: 'rgba(37, 99, 235, 0.16)',
      areaPosFill: 'rgba(16, 185, 129, 0.28)',
      areaNegFill: 'rgba(239, 68, 68, 0.25)',
      pointStroke: '#FFFFFF',
      holeFill: '#FFFFFF',
      tooltipBg: 'rgba(15, 23, 42, 0.92)',
      tooltipBorder: '#2563EB',
      tooltipText: '#FFFFFF'
    };
  }

  /**
   * Dibuja una lectura puntual desplazada por encima del punto tocado para
   * evitar que el dedo tape los números o la curva en pantallas táctiles.
   */
  function drawPointTooltip(ctx, px, py, label, width, height, pal) {
    if (!ctx || !label) return;
    ctx.save();
    ctx.font = '600 12px Inter, system-ui, sans-serif';
    const textW = ctx.measureText(label).width;
    const boxW = textW + 16;
    const boxH = 26;
    const offsetY = py > 48 ? -38 : 14;
    const boxX = Math.max(6, Math.min(width - boxW - 6, px - boxW / 2));
    const boxY = Math.max(6, Math.min(height - boxH - 6, py + offsetY));

    ctx.fillStyle = pal.tooltipBg;
    ctx.strokeStyle = pal.tooltipBorder;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    } else {
      ctx.rect(boxX, boxY, boxW, boxH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = pal.tooltipText;
    ctx.fillText(label, boxX + 8, boxY + 17);
    ctx.restore();
  }

  function hasSeenGestureHint() {
    try {
      return Boolean(ns.Preferences && ns.Preferences.getPreferences().graphGestureHintSeen);
    } catch (_) {
      return true;
    }
  }

  function markGestureHintSeen() {
    try {
      if (ns.Preferences && typeof ns.Preferences.setPreference === 'function') {
        ns.Preferences.setPreference('graphGestureHintSeen', true);
      }
      if (typeof document !== 'undefined') {
        document.querySelectorAll('.graph-gesture-hint').forEach((el) => {
          el.hidden = true;
        });
      }
    } catch (_) {}
  }

  ns.GraphViewport = {
    clampScale,
    mathToScreen,
    screenToMath,
    computeOptimalGridStep,
    shouldSingleFingerPan,
    applyPinchZoom,
    getGraphThemePalette,
    drawPointTooltip,
    hasSeenGestureHint,
    markGestureHintSeen
  };

  /* ------------------------------------------------------------------------
     2. Widget Gráfico Interactivo en Lecciones
     ------------------------------------------------------------------------ */
  const mountedWidgets = new Set();

  function safeEval(fn, x) {
    try {
      const y = fn(x);
      return (typeof y === 'number' && isFinite(y) && Math.abs(y) < 1e6) ? y : NaN;
    } catch (_) {
      return NaN;
    }
  }

  function renderInteractiveWidget(container, config = {}) {
    if (!container) return;

    const mode = config.mode || 'general';
    const widgetId = 'lg-' + Math.random().toString(36).slice(2, 9);

    const defaults = {
      fnExpr: config.fnExpr || config.fn || 'x^2 - 4',
      x0: config.initialX0 !== undefined ? config.initialX0 : (config.x0 !== undefined ? config.x0 : (config.paramA !== undefined ? config.paramA : 1.5)),
      delta: config.delta !== undefined ? config.delta : 0.6,
      secantH: config.h !== undefined ? config.h : 0,
      intA: config.initialA !== undefined ? config.initialA : (config.a !== undefined ? config.a : -1),
      intB: config.initialB !== undefined ? config.initialB : (config.b !== undefined ? config.b : 2),
      riemannN: config.n !== undefined ? config.n : 0,
      scale: config.scale || 44,
      centerX: config.centerX || 0,
      centerY: config.centerY || 0,
      holeAt: config.holeAt !== undefined ? config.holeAt : null
    };

    const state = {
      mode,
      fnExpr: defaults.fnExpr,
      x0: defaults.x0,
      delta: defaults.delta,
      secantH: defaults.secantH,
      showDerivCurve: true,
      showNormalLine: true,
      intA: defaults.intA,
      intB: defaults.intB,
      riemannN: defaults.riemannN,
      scale: defaults.scale,
      centerX: defaults.centerX,
      centerY: defaults.centerY,
      holeAt: defaults.holeAt,
      expanded: false,
      pointerMathX: null,
      pointerMathY: null
    };

    const presets = config.presets || [];
    const showHintInitially = !hasSeenGestureHint();

    container.innerHTML = `
      <div class="lesson-graph-card" id="${widgetId}">
        <div class="lesson-graph-header">
          <div>
            <span class="didactic-step-badge">📈 5. Interpretación Gráfica Interactiva</span>
            <h3 class="lesson-graph-title">
              ${ns.MathRenderer.formatRichText(config.title || 'Laboratorio Gráfico Interactivo')}
            </h3>
            <p class="lesson-graph-desc">
              ${ns.MathRenderer.formatRichText(config.description || 'Explora el gráfico con los controles debajo o amplíalo a pantalla completa para moverte libremente.')}
            </p>
          </div>
          ${presets.length ? `
            <div class="lesson-graph-presets">
              ${presets.map((p, idx) => `
                <button type="button" class="btn btn-outline btn-sm" data-lg-preset="${idx}">${ns.MathRenderer.formatRichText(p.label)}</button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="lesson-graph-toolbar">
          <div class="grapher-zoom-actions">
            <button type="button" class="btn btn-outline btn-sm" id="${widgetId}-zoom-in" title="Acercar vista">＋</button>
            <button type="button" class="btn btn-outline btn-sm" id="${widgetId}-zoom-out" title="Alejar vista">－</button>
            <button type="button" class="btn btn-outline btn-sm" id="${widgetId}-reset-view">🎯 Restablecer vista</button>
            <button type="button" class="btn btn-primary btn-sm" id="${widgetId}-expand-btn" aria-expanded="false">⛶ Expandir</button>
            <button type="button" class="btn btn-outline btn-sm graph-close-expand-btn" id="${widgetId}-close-expand" hidden>✕ Cerrar</button>
          </div>
        </div>

        <div class="graph-live-bar" id="${widgetId}-live-bar" aria-live="polite">
          Toca o mueve el gráfico para inspeccionar coordenadas.
        </div>

        <div class="graph-gesture-hint" id="${widgetId}-gesture-hint" ${showHintInitially ? '' : 'hidden'}>
          <span>💡 En móvil: 1 dedo desplaza la página · 2 dedos mueven y hacen zoom · Pulsa <strong>Expandir</strong> para mover con 1 dedo.</span>
          <button type="button" class="graph-gesture-dismiss" id="${widgetId}-dismiss-hint" aria-label="Ocultar pista de gestos">✕</button>
        </div>

        <!-- Lienzo Gráfico -->
        <div class="lesson-canvas-box" id="${widgetId}-canvas-box">
          <canvas id="${widgetId}-canvas" class="lesson-graph-canvas"></canvas>
        </div>

        <!-- Panel Compacto de Controles Debajo del Gráfico -->
        <div class="lesson-graph-controls" id="${widgetId}-controls">
          ${buildControlsHtml(state, widgetId)}
        </div>

        <!-- Panel de Lectura Matemática y Tablas -->
        <div class="graph-analysis-bar lesson-graph-readout" id="${widgetId}-readout"></div>
      </div>
    `;

    const root = container.querySelector('#' + widgetId);
    const widgetEntry = {
      root,
      redraw: () => drawWidgetCanvas(root, state, widgetId)
    };
    mountedWidgets.add(widgetEntry);

    bindWidgetEvents(root, state, defaults, presets, widgetId);
    drawWidgetCanvas(root, state, widgetId);
  }

  function buildFnFieldHtml(widgetId, labelLatex) {
    return `
      <div class="lesson-control-group">
        <label for="${widgetId}-fn-mf"><span>${labelLatex}</span></label>
        <div class="lesson-fn-input-row">
          <div id="${widgetId}-fn-mount" class="lesson-fn-math-mount"></div>
          <button
            type="button"
            class="btn btn-outline btn-sm lesson-fn-vkb-btn"
            id="${widgetId}-fn-vkb-btn"
            aria-expanded="false"
            title="Abrir Teclado Matemático">
            ⌨️ Teclado
          </button>
        </div>
        <div id="${widgetId}-fn-vkb-drawer" class="exercise-vkb-drawer is-collapsed"></div>
      </div>
    `;
  }

  function buildControlsHtml(state, widgetId) {
    if (state.mode === 'limits') {
      return `
        ${buildFnFieldHtml(widgetId, 'Función $f(x)$:')}
        <div class="lesson-control-group">
          <label for="${widgetId}-rng-x0">
            <span>Valor objetivo ($x \\to a$):</span>
            <strong id="${widgetId}-lbl-x0">a = ${state.x0}</strong>
          </label>
          <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-x0" value="${state.x0}" />
        </div>
        <div class="lesson-control-group">
          <label for="${widgetId}-rng-delta">
            <span>Distancia lateral ($\\delta$):</span>
            <strong id="${widgetId}-lbl-delta">δ = ${state.delta}</strong>
          </label>
          <input type="range" min="0.02" max="1.8" step="0.02" id="${widgetId}-rng-delta" value="${state.delta}" />
        </div>
      `;
    }

    if (state.mode === 'derivatives') {
      return `
        ${buildFnFieldHtml(widgetId, 'Función $f(x)$:')}
        <div class="lesson-control-group">
          <label for="${widgetId}-rng-x0">
            <span>Punto de tangencia ($x_0$):</span>
            <strong id="${widgetId}-lbl-x0">x₀ = ${state.x0}</strong>
          </label>
          <input type="range" min="-3.5" max="3.5" step="0.05" id="${widgetId}-rng-x0" value="${state.x0}" />
        </div>
        <div class="lesson-control-group">
          <label for="${widgetId}-rng-h">
            <span>Incremento secante ($h \\to 0$):</span>
            <strong id="${widgetId}-lbl-h">h = ${state.secantH}</strong>
          </label>
          <input type="range" min="0" max="2" step="0.05" id="${widgetId}-rng-h" value="${state.secantH}" />
        </div>
        <div class="lesson-control-group toggles">
          <label class="lesson-checkbox-label">
            <input type="checkbox" id="${widgetId}-chk-deriv" ${state.showDerivCurve ? 'checked' : ''} />
            <span>Comparar con gráfica de $f'(x)$</span>
          </label>
          <label class="lesson-checkbox-label">
            <input type="checkbox" id="${widgetId}-chk-normal" ${state.showNormalLine ? 'checked' : ''} />
            <span>Trazar recta normal perpendicular</span>
          </label>
        </div>
      `;
    }

    if (state.mode === 'integrals') {
      return `
        ${buildFnFieldHtml(widgetId, 'Integrando $f(x)$:')}
        <div class="lesson-control-group">
          <label for="${widgetId}-rng-a">
            <span>Límite inferior ($a$):</span>
            <strong id="${widgetId}-lbl-a">a = ${state.intA}</strong>
          </label>
          <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-a" value="${state.intA}" />
        </div>
        <div class="lesson-control-group">
          <label for="${widgetId}-rng-b">
            <span>Límite superior ($b$):</span>
            <strong id="${widgetId}-lbl-b">b = ${state.intB}</strong>
          </label>
          <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-b" value="${state.intB}" />
        </div>
        <div class="lesson-control-group">
          <label for="${widgetId}-rng-n">
            <span>Rectángulos de Riemann ($n$):</span>
            <strong id="${widgetId}-lbl-n">${state.riemannN === 0 ? 'Continuo (Exacto)' : 'n = ' + state.riemannN}</strong>
          </label>
          <input type="range" min="0" max="50" step="2" id="${widgetId}-rng-n" value="${state.riemannN}" />
        </div>
      `;
    }

    return `
      ${buildFnFieldHtml(widgetId, 'Expresión $f(x)$:')}
      <div class="lesson-control-group">
        <label for="${widgetId}-rng-x0">
          <span>Inspeccionar punto ($x_0$):</span>
          <strong id="${widgetId}-lbl-x0">x₀ = ${state.x0}</strong>
        </label>
        <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-x0" value="${state.x0}" />
      </div>
    `;
  }

  function bindWidgetEvents(root, state, defaults, presets, widgetId) {
    if (!root) return;

    root.querySelectorAll('.lesson-control-group label span').forEach(sp => {
      sp.innerHTML = ns.MathRenderer.formatRichText(sp.innerHTML);
    });

    const expandBtn = root.querySelector(`#${widgetId}-expand-btn`);
    const closeExpandBtn = root.querySelector(`#${widgetId}-close-expand`);
    const resetViewBtn = root.querySelector(`#${widgetId}-reset-view`);
    const zoomInBtn = root.querySelector(`#${widgetId}-zoom-in`);
    const zoomOutBtn = root.querySelector(`#${widgetId}-zoom-out`);
    const dismissHintBtn = root.querySelector(`#${widgetId}-dismiss-hint`);
    const canvas = root.querySelector(`#${widgetId}-canvas`);
    const canvasBox = root.querySelector(`#${widgetId}-canvas-box`);

    function setExpanded(nextExpanded) {
      state.expanded = Boolean(nextExpanded);
      root.classList.toggle('is-graph-expanded', state.expanded);
      if (state.expanded) {
        markGestureHintSeen();
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', 'Gráfica interactiva en pantalla completa');
        document.body.classList.add('has-expanded-graph');
        expandBtn.hidden = true;
        closeExpandBtn.hidden = false;
        expandBtn.setAttribute('aria-expanded', 'true');
        if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
          ns.App.syncModalScrollLock();
        }
        requestAnimationFrame(() => {
          closeExpandBtn?.focus();
          drawWidgetCanvas(root, state, widgetId);
        });
      } else {
        root.removeAttribute('role');
        root.removeAttribute('aria-modal');
        root.removeAttribute('aria-label');
        document.body.classList.remove('has-expanded-graph');
        expandBtn.hidden = false;
        closeExpandBtn.hidden = true;
        expandBtn.setAttribute('aria-expanded', 'false');
        if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
          ns.App.syncModalScrollLock();
        }
        requestAnimationFrame(() => {
          expandBtn?.focus();
          drawWidgetCanvas(root, state, widgetId);
        });
      }
    }

    expandBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.confirm();
      setExpanded(true);
    });

    closeExpandBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.confirm();
      setExpanded(false);
    });

    const onKeyDown = (ev) => {
      if (!state.expanded || !document.body.contains(root)) {
        if (!document.body.contains(root)) {
          document.removeEventListener('keydown', onKeyDown, true);
        }
        return;
      }
      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        setExpanded(false);
        return;
      }
      if (ev.key === 'Tab') {
        const focusables = Array.from(root.querySelectorAll(
          'button:not([hidden]):not([disabled]), input:not([disabled]), select:not([disabled]), [href]'
        )).filter(el => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    resetViewBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      state.centerX = defaults.centerX;
      state.centerY = defaults.centerY;
      state.scale = defaults.scale;
      state.pointerMathX = null;
      state.pointerMathY = null;
      drawWidgetCanvas(root, state, widgetId);
    });

    zoomInBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      state.scale = clampScale(state.scale * 1.25);
      drawWidgetCanvas(root, state, widgetId);
    });

    zoomOutBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      state.scale = clampScale(state.scale / 1.25);
      drawWidgetCanvas(root, state, widgetId);
    });

    dismissHintBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      markGestureHintSeen();
    });

    let fnController = null;
    const fnMount = root.querySelector(`#${widgetId}-fn-mount`);
    const fnVkbBtn = root.querySelector(`#${widgetId}-fn-vkb-btn`);
    const fnVkbDrawer = root.querySelector(`#${widgetId}-fn-vkb-drawer`);
    let fnVkbOpen = false;

    const setFnVkbOpen = (nextOpen) => {
      fnVkbOpen = Boolean(nextOpen);
      if (fnVkbDrawer) {
        fnVkbDrawer.classList.toggle('is-open', fnVkbOpen);
        fnVkbDrawer.classList.toggle('is-collapsed', !fnVkbOpen);
      }
      if (fnVkbBtn) {
        fnVkbBtn.classList.toggle('active', fnVkbOpen);
        fnVkbBtn.setAttribute('aria-expanded', fnVkbOpen ? 'true' : 'false');
        fnVkbBtn.textContent = fnVkbOpen ? '✕ Ocultar' : '⌨️ Teclado';
      }
      if (ns.App && typeof ns.App.syncFloatingMenuButton === 'function') {
        ns.App.syncFloatingMenuButton();
      }
    };

    if (fnMount && ns.MathInput && typeof ns.MathInput.createMathFieldController === 'function') {
      fnController = ns.MathInput.createMathFieldController(fnMount, {
        id: `${widgetId}-fn-mf`,
        fallbackInputId: `${widgetId}-fn`,
        initialCasValue: state.fnExpr,
        compact: true,
        hideNativeToggle: true,
        disableNativeKeyboard: true,
        ariaLabel: 'Expresión matemática de la función f(x)',
        onChange: (casVal) => {
          state.fnExpr = casVal;
          drawWidgetCanvas(root, state, widgetId);
        }
      });

      if (fnVkbDrawer && typeof ns.MathInput.renderVisualKeyboard === 'function') {
        ns.MathInput.renderVisualKeyboard(fnVkbDrawer, () => fnController, {
          collapsible: true,
          initialCategory: 'funciones',
          title: '⌨️ Teclado Matemático',
          onClose: () => setFnVkbOpen(false)
        });
      }

      fnMount.addEventListener('click', () => {
        if (!fnVkbOpen) setFnVkbOpen(true);
      });
    }

    fnVkbBtn?.addEventListener('mousedown', (ev) => ev.preventDefault());
    fnVkbBtn?.addEventListener('click', () => {
      setFnVkbOpen(!fnVkbOpen);
      if (fnVkbOpen && fnController) fnController.focus();
    });

    root.querySelectorAll('[data-lg-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-lg-preset'));
        const p = presets[idx];
        if (!p) return;
        state.fnExpr = p.expr || p.fn || state.fnExpr;
        if (p.x0 !== undefined) state.x0 = p.x0;
        if (p.paramA !== undefined) state.x0 = p.paramA;
        if (p.h !== undefined) state.secantH = p.h;
        if (p.a !== undefined) state.intA = p.a;
        if (p.b !== undefined) state.intB = p.b;
        if (p.n !== undefined) state.riemannN = p.n;
        state.holeAt = p.holeAt !== undefined ? p.holeAt : null;

        if (fnController) {
          fnController.setCasValue(state.fnExpr, { silent: true });
        } else {
          const fnInp = root.querySelector(`#${widgetId}-fn`);
          if (fnInp) fnInp.value = state.fnExpr;
        }
        const rngX0 = root.querySelector(`#${widgetId}-rng-x0`);
        if (rngX0) rngX0.value = state.x0;
        const rngH = root.querySelector(`#${widgetId}-rng-h`);
        if (rngH) rngH.value = state.secantH;
        const rngA = root.querySelector(`#${widgetId}-rng-a`);
        if (rngA) rngA.value = state.intA;
        const rngB = root.querySelector(`#${widgetId}-rng-b`);
        if (rngB) rngB.value = state.intB;
        const rngN = root.querySelector(`#${widgetId}-rng-n`);
        if (rngN) rngN.value = state.riemannN;

        syncControlLabels(root, state, widgetId);
        drawWidgetCanvas(root, state, widgetId);
      });
    });

    const fnInpFallback = !fnController ? root.querySelector(`#${widgetId}-fn`) : null;
    fnInpFallback?.addEventListener('input', () => {
      state.fnExpr = fnInpFallback.value;
      drawWidgetCanvas(root, state, widgetId);
    });

    const rngX0 = root.querySelector(`#${widgetId}-rng-x0`);
    rngX0?.addEventListener('input', () => {
      state.x0 = parseFloat(rngX0.value) || 0;
      syncControlLabels(root, state, widgetId);
      drawWidgetCanvas(root, state, widgetId);
    });

    const rngDelta = root.querySelector(`#${widgetId}-rng-delta`);
    rngDelta?.addEventListener('input', () => {
      state.delta = parseFloat(rngDelta.value) || 0.1;
      syncControlLabels(root, state, widgetId);
      drawWidgetCanvas(root, state, widgetId);
    });

    const rngH = root.querySelector(`#${widgetId}-rng-h`);
    rngH?.addEventListener('input', () => {
      state.secantH = parseFloat(rngH.value) || 0;
      syncControlLabels(root, state, widgetId);
      drawWidgetCanvas(root, state, widgetId);
    });

    const chkDeriv = root.querySelector(`#${widgetId}-chk-deriv`);
    chkDeriv?.addEventListener('change', () => {
      state.showDerivCurve = chkDeriv.checked;
      drawWidgetCanvas(root, state, widgetId);
    });

    const chkNormal = root.querySelector(`#${widgetId}-chk-normal`);
    chkNormal?.addEventListener('change', () => {
      state.showNormalLine = chkNormal.checked;
      drawWidgetCanvas(root, state, widgetId);
    });

    const rngA = root.querySelector(`#${widgetId}-rng-a`);
    rngA?.addEventListener('input', () => {
      state.intA = parseFloat(rngA.value) || 0;
      syncControlLabels(root, state, widgetId);
      drawWidgetCanvas(root, state, widgetId);
    });

    const rngB = root.querySelector(`#${widgetId}-rng-b`);
    rngB?.addEventListener('input', () => {
      state.intB = parseFloat(rngB.value) || 0;
      syncControlLabels(root, state, widgetId);
      drawWidgetCanvas(root, state, widgetId);
    });

    const rngN = root.querySelector(`#${widgetId}-rng-n`);
    rngN?.addEventListener('input', () => {
      state.riemannN = parseInt(rngN.value, 10) || 0;
      syncControlLabels(root, state, widgetId);
      drawWidgetCanvas(root, state, widgetId);
    });

    if (canvas) {
      let dragging = false;
      const updateFromPointer = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;
        const m = screenToMath(px, py, state.centerX, state.centerY, state.scale, rect.width, rect.height);
        state.pointerMathX = m.mx;
        state.pointerMathY = m.my;

        const roundedX = Number(m.mx.toFixed(2));
        if (state.mode === 'integrals') {
          if (Math.abs(roundedX - state.intA) < Math.abs(roundedX - state.intB)) {
            state.intA = Math.max(-4, Math.min(4, roundedX));
            if (rngA) rngA.value = state.intA;
          } else {
            state.intB = Math.max(-4, Math.min(4, roundedX));
            if (rngB) rngB.value = state.intB;
          }
        } else {
          state.x0 = Math.max(-4, Math.min(4, roundedX));
          if (rngX0) rngX0.value = state.x0;
        }
        syncControlLabels(root, state, widgetId);
        drawWidgetCanvas(root, state, widgetId);
      };

      canvas.addEventListener('mousedown', (e) => {
        dragging = true;
        updateFromPointer(e.clientX, e.clientY);
      });
      window.addEventListener('mouseup', () => { dragging = false; });
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const m = screenToMath(e.clientX - rect.left, e.clientY - rect.top, state.centerX, state.centerY, state.scale, rect.width, rect.height);
        state.pointerMathX = m.mx;
        state.pointerMathY = m.my;
        if (dragging) {
          updateFromPointer(e.clientX, e.clientY);
        } else {
          drawWidgetCanvas(root, state, widgetId);
        }
      });
      canvas.addEventListener('mouseleave', () => {
        state.pointerMathX = null;
        state.pointerMathY = null;
        drawWidgetCanvas(root, state, widgetId);
      });

      // Gestos táctiles:
      // - Embebido: 1 dedo desplaza la página sin atraparse; 2 dedos hacen pan + zoom
      // - Expandido: 1 dedo hace pan; 2 dedos hacen pan + zoom
      let touchMode = null;
      let lastX = 0;
      let lastY = 0;
      let lastDist = 0;
      let lastMidX = 0;
      let lastMidY = 0;
      const touchDistance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
      const touchMid = (t, rect) => ({
        x: ((t[0].clientX + t[1].clientX) * 0.5) - rect.left,
        y: ((t[0].clientY + t[1].clientY) * 0.5) - rect.top
      });

      canvas.addEventListener('touchstart', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches.length === 1 && shouldSingleFingerPan(state.expanded)) {
          touchMode = 'pan';
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
          const m = screenToMath(lastX - rect.left, lastY - rect.top, state.centerX, state.centerY, state.scale, rect.width, rect.height);
          state.pointerMathX = m.mx;
          state.pointerMathY = m.my;
        } else if (e.touches.length === 2) {
          touchMode = 'pinch';
          lastDist = touchDistance(e.touches);
          const mid = touchMid(e.touches, rect);
          lastMidX = mid.x;
          lastMidY = mid.y;
          markGestureHintSeen();
        } else {
          touchMode = null;
        }
      }, { passive: true });

      canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (touchMode === 'pan' && e.touches.length === 1 && shouldSingleFingerPan(state.expanded)) {
          e.preventDefault();
          const dx = e.touches[0].clientX - lastX;
          const dy = e.touches[0].clientY - lastY;
          state.centerX -= dx / state.scale;
          state.centerY += dy / state.scale;
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
          const m = screenToMath(lastX - rect.left, lastY - rect.top, state.centerX, state.centerY, state.scale, rect.width, rect.height);
          state.pointerMathX = m.mx;
          state.pointerMathY = m.my;
          drawWidgetCanvas(root, state, widgetId);
        } else if (e.touches.length === 2) {
          e.preventDefault();
          const dist = touchDistance(e.touches);
          const mid = touchMid(e.touches, rect);
          const next = applyPinchZoom({
            scale: state.scale,
            prevDist: lastDist || dist,
            nextDist: dist,
            centerX: state.centerX,
            centerY: state.centerY,
            panDx: mid.x - lastMidX,
            panDy: mid.y - lastMidY,
            midPx: mid.x,
            midPy: mid.y,
            width: rect.width,
            height: rect.height
          });
          state.scale = next.scale;
          state.centerX = next.centerX;
          state.centerY = next.centerY;
          lastDist = dist;
          lastMidX = mid.x;
          lastMidY = mid.y;
          drawWidgetCanvas(root, state, widgetId);
        }
      }, { passive: false });

      const stopTouch = () => { touchMode = null; };
      canvas.addEventListener('touchend', stopTouch, { passive: true });
      canvas.addEventListener('touchcancel', stopTouch, { passive: true });
    }

    // Redibujar nítido al redimensionar o girar el teléfono
    if (typeof ResizeObserver === 'function' && canvasBox) {
      const rObs = new ResizeObserver(() => {
        if (!document.body.contains(root)) {
          rObs.disconnect();
          return;
        }
        drawWidgetCanvas(root, state, widgetId);
      });
      rObs.observe(canvasBox);
    }

    const onResizeOrRotate = () => {
      if (!document.body.contains(root)) {
        window.removeEventListener('resize', onResizeOrRotate);
        window.removeEventListener('orientationchange', onResizeOrRotate);
        return;
      }
      drawWidgetCanvas(root, state, widgetId);
    };
    window.addEventListener('resize', onResizeOrRotate);
    window.addEventListener('orientationchange', onResizeOrRotate);
  }

  function syncControlLabels(root, state, widgetId) {
    const setTxt = (id, txt) => {
      const el = root.querySelector(`#${widgetId}-${id}`);
      if (el) el.textContent = txt;
    };
    setTxt('lbl-x0', (state.mode === 'limits' ? 'a = ' : 'x₀ = ') + state.x0);
    setTxt('lbl-delta', 'δ = ' + state.delta);
    setTxt('lbl-h', 'h = ' + state.secantH);
    setTxt('lbl-a', 'a = ' + state.intA);
    setTxt('lbl-b', 'b = ' + state.intB);
    setTxt('lbl-n', state.riemannN === 0 ? 'Continuo (Exacto)' : 'n = ' + state.riemannN);
  }

  function drawWidgetCanvas(root, state, widgetId) {
    const canvas = root.querySelector(`#${widgetId}-canvas`);
    const readout = root.querySelector(`#${widgetId}-readout`);
    const liveBar = root.querySelector(`#${widgetId}-live-bar`);
    if (!canvas || !readout) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(120, rect.width || 640);
    const height = Math.max(120, rect.height || 340);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    const pal = getGraphThemePalette();
    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, width, height);

    const toScreenX = (x) => width / 2 + (x - state.centerX) * state.scale;
    const toScreenY = (y) => height / 2 - (y - state.centerY) * state.scale;
    const toMathX = (px) => state.centerX + (px - width / 2) / state.scale;

    const gridStep = computeOptimalGridStep(state.scale, width < 460 ? 52 : 42);
    const xMin = toMathX(0);
    const xMax = toMathX(width);
    const yMin = state.centerY - (height / 2) / state.scale;
    const yMax = state.centerY + (height / 2) / state.scale;

    // Ejes principales (calculados antes para evitar colisión con etiquetas)
    const ox = toScreenX(0);
    const oy = toScreenY(0);

    ctx.lineWidth = 1;
    ctx.strokeStyle = pal.grid;
    ctx.fillStyle = pal.tickText;
    ctx.font = '12px Inter, system-ui, sans-serif';

    const yLabelLeftSide = ox > width - 52;
    const axisX = yLabelLeftSide
      ? Math.min(width - 8, Math.max(40, ox - 8))
      : Math.min(width - 42, Math.max(8, ox + 7));
    const yColLeft = yLabelLeftSide ? axisX - 32 : axisX - 2;
    const yColRight = yLabelLeftSide ? axisX + 2 : axisX + 32;
    const axisY = Math.min(height - 10, Math.max(18, oy + 15));

    const firstGx = Math.floor(xMin / gridStep) * gridStep;
    let lastTickRight = -Infinity;
    ctx.textAlign = 'center';
    for (let gx = firstGx; gx <= xMax; gx += gridStep) {
      const sx = toScreenX(gx);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
      if (Math.abs(gx) > 1e-7) {
        const lbl = Number(gx.toFixed(3)).toString();
        const halfW = (typeof ctx.measureText === 'function' ? ctx.measureText(lbl).width : lbl.length * 7) / 2;
        if (sx - halfW < 14 || sx + halfW > width - 14) continue;
        if (Math.abs(sx - ox) < halfW + 14) continue;
        if (sx - halfW < yColRight + 4 && sx + halfW > yColLeft - 4) continue;
        if (sx - halfW < lastTickRight + 8) continue;
        ctx.fillText(lbl, sx, axisY);
        lastTickRight = sx + halfW;
      }
    }

    const firstGy = Math.floor(yMin / gridStep) * gridStep;
    ctx.textAlign = yLabelLeftSide ? 'right' : 'left';
    let lastTickY = Infinity;
    for (let gy = firstGy; gy <= yMax; gy += gridStep) {
      const sy = toScreenY(gy);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
      if (Math.abs(gy) > 1e-7) {
        const lbl = Number(gy.toFixed(3)).toString();
        if (sy < 18 || sy > height - 12) continue;
        if (Math.abs(sy - oy) < 16) continue;
        if (lastTickY - sy < 18) continue;
        ctx.fillText(lbl, axisX, sy + 4);
        lastTickY = sy;
      }
    }
    ctx.textAlign = 'left';

    // Ejes principales
    ctx.strokeStyle = pal.axis;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, oy); ctx.lineTo(width, oy);
    ctx.moveTo(ox, 0); ctx.lineTo(ox, height);
    ctx.stroke();

    let fn;
    try {
      fn = ns.MathParser.compileFunction(state.fnExpr, 'RAD');
    } catch (_) {
      ctx.restore();
      if (liveBar) liveBar.textContent = 'Sintaxis inválida: escribe una función válida de x.';
      readout.innerHTML = `<div class="analysis-stat-box"><strong>Sintaxis</strong>Escribe una función válida de x.</div>`;
      return;
    }

    /* ------------------------------------------------------------------
       A. MODO INTEGRALES: Áreas Positivas y Negativas + Riemann
       ------------------------------------------------------------------ */
    if (state.mode === 'integrals') {
      const a = Math.min(state.intA, state.intB);
      const b = Math.max(state.intA, state.intB);
      const pxA = Math.max(0, toScreenX(a));
      const pxB = Math.min(width, toScreenX(b));

      if (state.riemannN === 0) {
        for (let px = pxA; px < pxB; px += 2) {
          const mx = toMathX(px);
          const my = safeEval(fn, mx);
          if (!isFinite(my)) continue;
          const sy = toScreenY(my);
          ctx.fillStyle = my >= 0 ? pal.areaPosFill : pal.areaNegFill;
          ctx.fillRect(px, Math.min(oy, sy), 2.2, Math.abs(sy - oy));
        }
      } else {
        const n = state.riemannN;
        const dx = (b - a) / n;
        for (let i = 0; i < n; i++) {
          const xLeft = a + i * dx;
          const xRight = xLeft + dx;
          const yMid = safeEval(fn, 0.5 * (xLeft + xRight));
          if (!isFinite(yMid)) continue;
          const sx1 = toScreenX(xLeft);
          const sx2 = toScreenX(xRight);
          const sy = toScreenY(yMid);
          ctx.fillStyle = yMid >= 0 ? pal.areaPosFill : pal.areaNegFill;
          ctx.strokeStyle = yMid >= 0 ? pal.curveSecondary : pal.tangent;
          ctx.lineWidth = 1;
          ctx.fillRect(sx1, Math.min(oy, sy), sx2 - sx1, Math.abs(sy - oy));
          ctx.strokeRect(sx1, Math.min(oy, sy), sx2 - sx1, Math.abs(sy - oy));
        }
      }

      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = pal.curvePrimary;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(toScreenX(state.intA), 0); ctx.lineTo(toScreenX(state.intA), height);
      ctx.moveTo(toScreenX(state.intB), 0); ctx.lineTo(toScreenX(state.intB), height);
      ctx.stroke();
      ctx.restore();
    }

    /* ------------------------------------------------------------------
       Trazar Curva Principal f(x) y detectar huecos removibles
       ------------------------------------------------------------------ */
    const detectedHoles = typeof ns.MathParser.findRemovableDiscontinuities === 'function'
      ? ns.MathParser.findRemovableDiscontinuities(state.fnExpr, xMin, xMax, 'RAD')
      : [];

    if (state.holeAt !== null && !detectedHoles.some(h => Math.abs(h.x - state.holeAt) < 1e-2)) {
      const hL = safeEval(fn, state.holeAt - 1e-4);
      const hR = safeEval(fn, state.holeAt + 1e-4);
      if (isFinite(hL) && isFinite(hR) && Math.abs(hL - hR) < 0.05) {
        detectedHoles.push({ x: state.holeAt, y: 0.5 * (hL + hR) });
      }
    }

    ctx.strokeStyle = pal.curvePrimary;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    let penDown = false;
    let prevSy = null;

    for (let px = 0; px <= width; px += 1.5) {
      const mx = toMathX(px);
      if ((state.holeAt !== null && Math.abs(mx - state.holeAt) < 0.03) ||
          detectedHoles.some(h => Math.abs(mx - h.x) * state.scale < 5)) {
        penDown = false;
        prevSy = null;
        continue;
      }
      const my = safeEval(fn, mx);
      if (!isFinite(my)) {
        penDown = false;
        prevSy = null;
        continue;
      }
      const sy = toScreenY(my);
      if (prevSy !== null && Math.abs(sy - prevSy) > height * 1.4) {
        penDown = false;
      }
      if (!penDown) {
        ctx.moveTo(px, sy);
        penDown = true;
      } else {
        ctx.lineTo(px, sy);
      }
      prevSy = sy;
    }
    ctx.stroke();

    for (const h of detectedHoles) {
      const hx = toScreenX(h.x);
      const hy = toScreenY(h.y);
      if (hx < -10 || hx > width + 10 || hy < -10 || hy > height + 10) continue;
      ctx.fillStyle = pal.holeFill;
      ctx.strokeStyle = pal.curvePrimary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(hx, hy, 5.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    /* ------------------------------------------------------------------
       B / C / D / E: Capas específicas y barra fija superior
       ------------------------------------------------------------------ */
    if (state.mode === 'limits') {
      const a = state.x0;
      const d = state.delta;
      const xLeft = a - d;
      const xRight = a + d;
      const yLeft = safeEval(fn, xLeft);
      const yRight = safeEval(fn, xRight);
      const limIzq = safeEval(fn, a - 1e-4);
      const limDer = safeEval(fn, a + 1e-4);
      const fa = state.holeAt !== null && Math.abs(a - state.holeAt) < 1e-3 ? NaN : safeEval(fn, a);

      if (Math.abs(limIzq) > 25 || Math.abs(limDer) > 25) {
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = pal.asymptote;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(toScreenX(a), 0); ctx.lineTo(toScreenX(a), height);
        ctx.stroke();
        ctx.restore();
      }

      const yInfPos = safeEval(fn, 100);
      if (isFinite(yInfPos) && Math.abs(yInfPos) < 20 && Math.abs(safeEval(fn, 200) - yInfPos) < 0.05) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = pal.hAsymptote;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, toScreenY(yInfPos)); ctx.lineTo(width, toScreenY(yInfPos));
        ctx.stroke();
        ctx.restore();
      }

      if (isFinite(yLeft)) {
        const sxL = toScreenX(xLeft);
        const syL = toScreenY(yLeft);
        ctx.strokeStyle = pal.limitLeft;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(sxL, oy); ctx.lineTo(sxL, syL); ctx.lineTo(ox, syL);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = pal.limitLeft;
        ctx.beginPath();
        ctx.arc(sxL, syL, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isFinite(yRight)) {
        const sxR = toScreenX(xRight);
        const syR = toScreenY(yRight);
        ctx.strokeStyle = pal.limitRight;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(sxR, oy); ctx.lineTo(sxR, syR); ctx.lineTo(ox, syR);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = pal.limitRight;
        ctx.beginPath();
        ctx.arc(sxR, syR, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const bilateralExists = isFinite(limIzq) && isFinite(limDer) && Math.abs(limIzq - limDer) < 0.05;
      const isActualHoleAtA = !isFinite(fa) || detectedHoles.some(h => Math.abs(h.x - a) < 1e-2);
      if (bilateralExists) {
        const L = 0.5 * (limIzq + limDer);
        const sxA = toScreenX(a);
        const syL = toScreenY(L);
        if (isActualHoleAtA) {
          ctx.fillStyle = pal.holeFill;
          ctx.strokeStyle = pal.tangent;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(sxA, syL, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = pal.curvePrimary;
          ctx.beginPath();
          ctx.arc(sxA, syL, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (isActualHoleAtA && isFinite(limIzq) && isFinite(limDer) && Math.abs(limIzq) < 25 && Math.abs(limDer) < 25) {
        const sxA = toScreenX(a);
        [limIzq, limDer].forEach(yVal => {
          ctx.fillStyle = pal.holeFill;
          ctx.strokeStyle = pal.tangent;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(sxA, toScreenY(yVal), 5.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      }

      const limitStr = bilateralExists
        ? ns.MathParser.formatNumber(0.5 * (limIzq + limDer), 4)
        : 'No existe (límites laterales distintos o infinitos)';

      if (liveBar) {
        liveBar.textContent = `Objetivo a = ${a} | δ = ${d} | Lím = ${bilateralExists ? ns.MathParser.formatNumber(0.5 * (limIzq + limDer), 4) : '∄'}`;
      }

      readout.innerHTML = ns.MathRenderer.formatRichText(`
        <div class="analysis-stat-box analysis-accent-green">
          <strong>Aproximación Izquierda ($x = ${ns.MathParser.formatNumber(xLeft, 2)}$)</strong>
          $f(a - \\delta) = ${ns.MathParser.formatNumber(yLeft, 4)}$ <br/>
          $\\lim_{x \\to a^-} f(x) = $ <b>${ns.MathParser.formatNumber(limIzq, 3)}</b>
        </div>
        <div class="analysis-stat-box analysis-accent-purple">
          <strong>Aproximación Derecha ($x = ${ns.MathParser.formatNumber(xRight, 2)}$)</strong>
          $f(a + \\delta) = ${ns.MathParser.formatNumber(yRight, 4)}$ <br/>
          $\\lim_{x \\to a^+} f(x) = $ <b>${ns.MathParser.formatNumber(limDer, 3)}</b>
        </div>
        <div class="analysis-stat-box analysis-accent-blue">
          <strong>Límite Bilateral en $a = ${a}$</strong>
          $\\lim_{x \\to ${a}} f(x) = $ <b class="analysis-val-int">${limitStr}</b>
        </div>
        <div class="analysis-stat-box">
          <strong>Comportamiento al Infinito</strong>
          $x \\to +\\infty: ${ns.MathParser.formatNumber(yInfPos, 3)}$
        </div>
      `);
    } else if (state.mode === 'derivatives') {
      if (state.showDerivCurve) {
        ctx.save();
        ctx.strokeStyle = pal.derivativeCurve;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        let dPen = false;
        for (let px = 0; px <= width; px += 2) {
          const mx = toMathX(px);
          const dy = ns.MathParser.numericalDerivative(fn, mx);
          if (!isFinite(dy) || Math.abs(dy) > 1e4) { dPen = false; continue; }
          const sy = toScreenY(dy);
          if (!dPen) { ctx.moveTo(px, sy); dPen = true; }
          else ctx.lineTo(px, sy);
        }
        ctx.stroke();
        ctx.restore();
      }

      const x0 = state.x0;
      const y0 = safeEval(fn, x0);
      const slope = ns.MathParser.numericalDerivative(fn, x0);
      const secondDeriv = (safeEval(fn, x0 + 1e-3) - 2 * y0 + safeEval(fn, x0 - 1e-3)) / 1e-6;

      if (isFinite(y0) && isFinite(slope)) {
        const xL = toMathX(0);
        const xR = toMathX(width);
        ctx.save();
        ctx.strokeStyle = pal.tangent;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(0, toScreenY(y0 + slope * (xL - x0)));
        ctx.lineTo(width, toScreenY(y0 + slope * (xR - x0)));
        ctx.stroke();
        ctx.restore();

        if (state.showNormalLine && Math.abs(slope) > 1e-5) {
          const mNormal = -1 / slope;
          ctx.save();
          ctx.strokeStyle = pal.normal;
          ctx.lineWidth = 1.6;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, toScreenY(y0 + mNormal * (xL - x0)));
          ctx.lineTo(width, toScreenY(y0 + mNormal * (xR - x0)));
          ctx.stroke();
          ctx.restore();
        }

        if (state.secantH > 0.01) {
          const x1 = x0 + state.secantH;
          const y1 = safeEval(fn, x1);
          if (isFinite(y1)) {
            const mSec = (y1 - y0) / state.secantH;
            ctx.save();
            ctx.strokeStyle = pal.secant;
            ctx.lineWidth = 1.6;
            ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.moveTo(0, toScreenY(y0 + mSec * (xL - x0)));
            ctx.lineTo(width, toScreenY(y0 + mSec * (xR - x0)));
            ctx.stroke();
            ctx.fillStyle = pal.secant;
            ctx.beginPath();
            ctx.arc(toScreenX(x1), toScreenY(y1), 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.fillStyle = pal.tangent;
        ctx.beginPath();
        ctx.arc(toScreenX(x0), toScreenY(y0), 6, 0, Math.PI * 2);
        ctx.fill();
      }

      const bIntercept = y0 - slope * x0;
      const bStr = bIntercept >= 0
        ? `+ ${ns.MathParser.formatNumber(bIntercept, 3)}`
        : `- ${ns.MathParser.formatNumber(Math.abs(bIntercept), 3)}`;

      const monotonia = Math.abs(slope) < 0.03
        ? 'Punto crítico horizontal (f\' ≈ 0)'
        : slope > 0 ? 'Creciente (f\' > 0)' : 'Decreciente (f\' < 0)';

      if (liveBar) {
        liveBar.textContent = `x₀ = ${x0} | f(x₀) = ${ns.MathParser.formatNumber(y0, 3)} | Pendiente m = ${ns.MathParser.formatNumber(slope, 3)}`;
      }

      readout.innerHTML = ns.MathRenderer.formatRichText(`
        <div class="analysis-stat-box analysis-accent-blue">
          <strong>Punto en la Curva</strong>
          $(x_0, f(x_0)) = (${x0},\\; ${ns.MathParser.formatNumber(y0, 3)})$
        </div>
        <div class="analysis-stat-box analysis-accent-red">
          <strong>Pendiente Instantánea $f'(x_0)$</strong>
          $m_{\\text{tan}} = f'(${x0}) = $ <b>${ns.MathParser.formatNumber(slope, 4)}</b>
        </div>
        <div class="analysis-stat-box analysis-accent-purple">
          <strong>Recta Tangente en $x_0$</strong>
          $y = ${ns.MathParser.formatNumber(slope, 3)}x ${bStr}$
        </div>
        <div class="analysis-stat-box">
          <strong>Monotonía y Concavidad</strong>
          ${monotonia} · $f''(${x0}) \\approx ${ns.MathParser.formatNumber(secondDeriv, 2)}$
        </div>
      `);
    } else if (state.mode === 'integrals') {
      const a = state.intA;
      const b = state.intB;
      const netIntegral = ns.MathParser.numericalIntegral(fn, a, b, 200);
      const posArea = ns.MathParser.numericalIntegral(x => Math.max(0, safeEval(fn, x) || 0), Math.min(a, b), Math.max(a, b), 200);
      const negArea = ns.MathParser.numericalIntegral(x => Math.max(0, -(safeEval(fn, x) || 0)), Math.min(a, b), Math.max(a, b), 200);
      const totalGeomArea = posArea + negArea;

      if (liveBar) {
        liveBar.textContent = `Intervalo [${a}, ${b}] | Integral neta = ${ns.MathParser.formatNumber(netIntegral, 3)}`;
      }

      readout.innerHTML = ns.MathRenderer.formatRichText(`
        <div class="analysis-stat-box analysis-accent-blue">
          <strong>Integral Definida Neta</strong>
          $\\int_{${a}}^{${b}} f(x)\\,dx = $ <b>${ns.MathParser.formatNumber(netIntegral, 4)}</b>
        </div>
        <div class="analysis-stat-box analysis-accent-green">
          <strong>Área Positiva ($f(x) \\geq 0$)</strong>
          $A^+ = $ <b class="analysis-val-pos">+${ns.MathParser.formatNumber(posArea, 4)}</b>
        </div>
        <div class="analysis-stat-box analysis-accent-red">
          <strong>Área Negativa ($f(x) < 0$)</strong>
          $A^- = $ <b class="analysis-val-deriv">-${ns.MathParser.formatNumber(negArea, 4)}</b>
        </div>
        <div class="analysis-stat-box">
          <strong>Área Geométrica Total ($A^+ + A^-$)</strong>
          $\\int_{${Math.min(a, b)}}^{${Math.max(a, b)}} |f(x)|\\,dx = $ <b>${ns.MathParser.formatNumber(totalGeomArea, 4)}</b>
        </div>
      `);
    } else {
      const x0 = state.x0;
      const y0 = safeEval(fn, x0);
      const roots = ns.MathParser.findRoots(fn, -8, 8);

      ctx.fillStyle = pal.curveSecondary;
      roots.forEach(r => {
        ctx.beginPath();
        ctx.arc(toScreenX(r), oy, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isFinite(y0)) {
        ctx.fillStyle = pal.curvePrimary;
        ctx.beginPath();
        ctx.arc(toScreenX(x0), toScreenY(y0), 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (liveBar) {
        liveBar.textContent = `x₀ = ${x0} | f(x₀) = ${ns.MathParser.formatNumber(y0, 3)}`;
      }

      readout.innerHTML = ns.MathRenderer.formatRichText(`
        <div class="analysis-stat-box">
          <strong>Valor en $x_0 = ${x0}$</strong>
          $f(${x0}) = $ <b>${ns.MathParser.formatNumber(y0, 4)}</b>
        </div>
        <div class="analysis-stat-box">
          <strong>Corte con el eje Y ($x = 0$)</strong>
          $f(0) = $ <b>${ns.MathParser.formatNumber(safeEval(fn, 0), 4)}</b>
        </div>
        <div class="analysis-stat-box">
          <strong>Raíces / Ceros ($f(x) = 0$)</strong>
          ${roots.length ? roots.map(r => `$x = ${r}$`).join(', ') : 'Sin raíces reales en [-8, 8]'}
        </div>
      `);
    }

    // Lectura desplazada por encima del puntero/dedo sobre la curva
    if (state.pointerMathX !== null) {
      const hy = safeEval(fn, state.pointerMathX);
      if (isFinite(hy)) {
        const px = toScreenX(state.pointerMathX);
        const py = toScreenY(hy);
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.fillStyle = pal.curvePrimary;
          ctx.strokeStyle = pal.pointStroke;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          const tip = `(${ns.MathParser.formatNumber(state.pointerMathX, 2)}, ${ns.MathParser.formatNumber(hy, 2)})`;
          drawPointTooltip(ctx, px, py, tip, width, height, pal);
          if (liveBar) {
            liveBar.textContent = `Punto en la curva: x = ${ns.MathParser.formatNumber(state.pointerMathX, 3)} | f(x) = ${ns.MathParser.formatNumber(hy, 3)}`;
          }
        }
      }
    }

    ctx.restore();
  }

  function redrawAllVisible() {
    for (const entry of mountedWidgets) {
      if (!document.body.contains(entry.root)) {
        mountedWidgets.delete(entry);
        continue;
      }
      entry.redraw();
    }
  }

  ns.LessonGraphs = {
    renderInteractiveWidget,
    redrawAllVisible,
    clampScale,
    mathToScreen,
    screenToMath,
    computeOptimalGridStep,
    shouldSingleFingerPan,
    applyPinchZoom
  };
})(window.MatInteractiva);
