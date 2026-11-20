/* ==========================================================================
   MATETIC - Graficador Interactivo de Funciones (Canvas 2D)
   Archivo: js/tools/grapher.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const vp = ns.GraphViewport || {};
  const clampScale = vp.clampScale || ((s, min = 8, max = 260) => {
    const n = Number(s);
    return isFinite(n) ? Math.min(max, Math.max(min, n)) : 42;
  });
  const mathToScreen = vp.mathToScreen || ((mx, my, cx, cy, scale, w, h) => ({
    px: w / 2 + (mx - cx) * scale,
    py: h / 2 - (my - cy) * scale
  }));
  const screenToMath = vp.screenToMath || ((px, py, cx, cy, scale, w, h) => ({
    mx: cx + (px - w / 2) / scale,
    my: cy - (py - h / 2) / scale
  }));
  const computeOptimalGridStep = vp.computeOptimalGridStep || ((scale, minPx = 48) => {
    const safeScale = Math.max(1e-4, Number(scale) || 42);
    const rawStep = Math.max(1e-6, (Number(minPx) || 48) / safeScale);
    const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / pow10;
    const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return Number((mult * pow10).toPrecision(10));
  });
  const shouldSingleFingerPan = vp.shouldSingleFingerPan || ((expanded) => Boolean(expanded));
  const applyPinchZoom = vp.applyPinchZoom || (({ scale, prevDist, nextDist, centerX, centerY, panDx = 0, panDy = 0, midPx, midPy, width, height, minScale = 8, maxScale = 260 }) => {
    const sp = Math.max(1, Number(prevDist) || 1);
    const sn = Math.max(1, Number(nextDist) || sp);
    const ps = clampScale(scale, minScale, maxScale);
    const nsScale = clampScale(ps * (sn / sp), minScale, maxScale);
    const ax = typeof midPx === 'number' ? midPx : width / 2;
    const ay = typeof midPy === 'number' ? midPy : height / 2;
    const before = screenToMath(ax, ay, centerX, centerY, ps, width, height);
    return {
      scale: nsScale,
      centerX: (before.mx - (ax - width / 2) / nsScale) - (Number(panDx) || 0) / nsScale,
      centerY: (before.my + (ay - height / 2) / nsScale) + (Number(panDy) || 0) / nsScale
    };
  });
  const getGraphThemePalette = vp.getGraphThemePalette || (() => ({
    isDark: false,
    bg: '#FFFFFF',
    grid: '#E2E8F0',
    axis: '#475569',
    tickText: '#334155',
    curvePrimary: '#2563EB',
    curveSecondary: '#059669',
    curveTertiary: '#7C3AED',
    tangent: '#DC2626',
    integralFill: 'rgba(37, 99, 235, 0.16)',
    pointStroke: '#FFFFFF',
    holeFill: '#FFFFFF',
    tooltipBg: 'rgba(15, 23, 42, 0.92)',
    tooltipBorder: '#2563EB',
    tooltipText: '#FFFFFF'
  }));
  const drawPointTooltip = vp.drawPointTooltip || (() => {});
  const hasSeenGestureHint = vp.hasSeenGestureHint || (() => false);
  const markGestureHintSeen = vp.markGestureHintSeen || (() => {});

  const state = {
    functions: [
      { id: 'f', label: 'f(x) =', expr: 'x^3 - 3*x', color: '#2563EB', visible: true },
      { id: 'g', label: 'g(x) =', expr: '2*x - 1', color: '#059669', visible: false },
      { id: 'h', label: 'h(x) =', expr: 'sin(x)', color: '#7C3AED', visible: false }
    ],
    centerX: 0,
    centerY: 0,
    scale: 42, // píxeles por unidad matemática
    showDerivative: true,
    tangentX: 1.2,
    showIntegral: true,
    integralA: -1.5,
    integralB: 1.5,
    hoverMathX: null,
    hoverMathY: null,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    expanded: false
  };

  let activeKeyHandler = null;
  let activeThemeObserver = null;
  let activeResizeObserver = null;

  function applyPayloadToGrapherState(rawPreset) {
    if (!rawPreset) return;
    const payload = (ns.MathParser && typeof ns.MathParser.extractGrapherPayload === 'function')
      ? ns.MathParser.extractGrapherPayload(rawPreset, state.tangentX)
      : (typeof rawPreset === 'object' ? rawPreset : { kind: 'function', expr: String(rawPreset) });

    if (payload.expr) {
      state.functions[0].expr = payload.expr;
      state.functions[0].visible = true;
    }

    if (payload.kind === 'limit') {
      if (typeof payload.tangentX === 'number' && isFinite(payload.tangentX)) {
        state.tangentX = payload.tangentX;
      }
    } else if (payload.kind === 'derivative') {
      state.showDerivative = true;
      if (typeof payload.tangentX === 'number' && isFinite(payload.tangentX)) {
        state.tangentX = payload.tangentX;
      }
    } else if (payload.kind === 'integral') {
      state.showIntegral = true;
      if (typeof payload.integralA === 'number' && isFinite(payload.integralA)) {
        state.integralA = payload.integralA;
      }
      if (typeof payload.integralB === 'number' && isFinite(payload.integralB)) {
        state.integralB = payload.integralB;
      }
    } else {
      if (typeof payload.tangentX === 'number' && isFinite(payload.tangentX)) {
        state.tangentX = payload.tangentX;
      }
      if (typeof payload.showDerivative === 'boolean') {
        state.showDerivative = payload.showDerivative;
      }
      if (typeof payload.showIntegral === 'boolean') {
        state.showIntegral = payload.showIntegral;
      }
      if (typeof payload.integralA === 'number' && isFinite(payload.integralA)) {
        state.integralA = payload.integralA;
      }
      if (typeof payload.integralB === 'number' && isFinite(payload.integralB)) {
        state.integralB = payload.integralB;
      }
    }

    // Encuadrar inteligentemente el lienzo si el punto de interés (ej. límite y=32 en x0=2) excede la ventana por defecto
    try {
      const fn = ns.MathParser.compileFunction(state.functions[0].expr, 'RAD');
      const xRef = isFinite(state.tangentX) ? state.tangentX : 0;
      let yRef = fn(xRef);
      if (!isFinite(yRef)) {
        const yL = fn(xRef - 1e-5);
        const yR = fn(xRef + 1e-5);
        if (isFinite(yL) && isFinite(yR)) yRef = 0.5 * (yL + yR);
      }
      if (isFinite(yRef) && (Math.abs(yRef) > 7 || Math.abs(xRef) > 6)) {
        const maxSpan = Math.max(Math.abs(yRef) * 1.35, Math.abs(xRef) * 1.6, 8);
        state.scale = Math.max(8, Math.min(42, 220 / (maxSpan * 0.5)));
        state.centerX = Math.abs(xRef) > 4 ? xRef * 0.5 : 0;
        state.centerY = Math.abs(yRef) > 6 ? yRef * 0.45 : 0;
      } else {
        state.centerX = 0;
        state.centerY = 0;
        state.scale = 42;
      }
    } catch (_) {
      state.centerX = 0;
      state.centerY = 0;
      state.scale = 42;
    }
  }

  function renderGrapherView(container, initialExpr) {
    if (initialExpr) {
      applyPayloadToGrapherState(initialExpr);
    }

    const isCompactPhone = typeof window !== 'undefined' && window.innerWidth < 768;

    container.innerHTML = `
      <div class="subject-header-card">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon">📈</div>
            <div class="subject-title-text">
              <h1>Graficador Interactivo de Funciones</h1>
              <p>Visualiza múltiples curvas, rectas tangentes, derivadas, áreas de integrales definidas y raíces reales en tiempo real.</p>
            </div>
          </div>
          <div class="grapher-presets-row">
            <button class="btn btn-outline btn-sm" data-preset="x^3 - 3*x">Cúbica</button>
            <button class="btn btn-outline btn-sm" data-preset="sin(x)">Trigonométrica</button>
            <button class="btn btn-outline btn-sm" data-preset="exp(0.5*x)">Exponencial</button>
            <button class="btn btn-outline btn-sm" data-preset="4 - x^2">Parábola</button>
            <button class="btn btn-outline btn-sm" data-preset="(x^2 - 1)/(x^2 + 1)">Racional</button>
          </div>
        </div>
      </div>

      <div class="grapher-layout">
        <!-- Panel Lateral de Controles -->
        <div class="grapher-sidebar">
          <div>
            <h3 class="grapher-section-title">Funciones a Graficar</h3>
            <div class="grapher-fn-list" id="graph-fn-list">
              ${state.functions.map((fn, idx) => `
                <div class="function-input-row">
                  <input type="checkbox" data-fn-toggle="${idx}" ${fn.visible ? 'checked' : ''} title="Mostrar/Ocultar" />
                  <span class="fn-color-dot" style="background:${fn.color}"></span>
                  <span class="fn-label">${fn.label}</span>
                  <div class="fn-math-mount" data-fn-mount="${idx}"></div>
                </div>
              `).join('')}
            </div>
            <button
              type="button"
              class="btn btn-outline btn-sm grapher-vkb-toggle-btn"
              id="btn-grapher-vkb"
              aria-expanded="false"
              title="Abrir Teclado Matemático para escribir funciones">
              ⌨️ Teclado Matemático
            </button>
            <div id="grapher-vkb-drawer" class="exercise-vkb-drawer is-collapsed"></div>
          </div>

          <details class="grapher-section-block grapher-mobile-details" ${isCompactPhone ? '' : 'open'}>
            <summary class="grapher-section-title">
              <span>Análisis de Cálculo sobre f(x)</span>
              <span class="grapher-details-chevron" aria-hidden="true">▾</span>
            </summary>
            <label class="grapher-check-row">
              <input type="checkbox" id="chk-show-deriv" ${state.showDerivative ? 'checked' : ''} />
              <span>${ns.MathRenderer.formatRichText('Trazar Recta Tangente en $x_0$:')}</span>
            </label>
            <div class="grapher-x0-row">
              <span class="grapher-x0-label">x₀ =</span>
              <input type="number" step="0.1" id="inp-tangent-x" class="fn-input" value="${state.tangentX}" />
            </div>

            <label class="grapher-check-row">
              <input type="checkbox" id="chk-show-int" ${state.showIntegral ? 'checked' : ''} />
              <span>${ns.MathRenderer.formatRichText('Sombrear Integral Definida $\\int_a^b f(x)\\,dx$:')}</span>
            </label>
            <div class="grapher-int-bounds-grid">
              <div>
                <small class="grapher-int-label">Límite inf. (a)</small>
                <input type="number" step="0.5" id="inp-int-a" class="fn-input" value="${state.integralA}" />
              </div>
              <div>
                <small class="grapher-int-label">Límite sup. (b)</small>
                <input type="number" step="0.5" id="inp-int-b" class="fn-input" value="${state.integralB}" />
              </div>
            </div>
          </details>

          <details class="grapher-section-block grapher-mobile-details" ${isCompactPhone ? '' : 'open'}>
            <summary class="grapher-section-title">
              <span>Tabla de Valores de f(x)</span>
              <span class="grapher-details-chevron" aria-hidden="true">▾</span>
            </summary>
            <div id="graph-table-box" class="grapher-table-box"></div>
          </details>
        </div>

        <!-- Lienzo Cartesiano y Resultados -->
        <div class="grapher-canvas-card" id="grapher-canvas-card">
          <div class="grapher-toolbar">
            <div class="grapher-help-text">
              💡 Ratón o 2 dedos mueven y hacen zoom; en móvil usa <strong>Expandir</strong> para mover con 1 dedo.
            </div>
            <div class="grapher-zoom-actions">
              <button type="button" class="btn btn-outline btn-sm" id="btn-zoom-in" title="Acercar">＋ Acercar</button>
              <button type="button" class="btn btn-outline btn-sm" id="btn-zoom-out" title="Alejar">－ Alejar</button>
              <button type="button" class="btn btn-outline btn-sm" id="btn-reset-view">🎯 Restablecer vista</button>
              <button type="button" class="btn btn-primary btn-sm" id="btn-expand-graph" aria-expanded="false">⛶ Expandir</button>
              <button type="button" class="btn btn-outline btn-sm graph-close-expand-btn" id="btn-close-expand-graph" hidden>✕ Cerrar</button>
            </div>
          </div>

          <div class="graph-live-bar" id="graph-live-bar" aria-live="polite">
            Toca o mueve el cursor sobre la gráfica para leer coordenadas.
          </div>

          <div class="graph-gesture-hint" id="graph-gesture-hint" ${hasSeenGestureHint() ? 'hidden' : ''}>
            <span>💡 En móvil: 1 dedo desplaza la página · 2 dedos mueven y hacen zoom · Pulsa <strong>Expandir</strong> para mover con 1 dedo.</span>
            <button type="button" class="graph-gesture-dismiss" id="btn-dismiss-gesture-hint" aria-label="Ocultar pista de gestos">✕</button>
          </div>

          <div class="canvas-wrapper" id="graph-canvas-wrap">
            <canvas id="math-graph-canvas"></canvas>
          </div>

          <div class="graph-analysis-bar" id="graph-analysis-bar"></div>

          <details class="precision-notice no-print">
            <summary class="precision-notice-summary">ⓘ Resultados aproximados</summary>
            <div class="precision-notice-body">
              <ul class="precision-notice-list">
                <li><strong>Precisión numérica:</strong> los cálculos usan coma flotante IEEE 754 de doble precisión (~15–16 dígitos) y los valores en pantalla se redondean a 3–4 decimales, por lo que pueden aparecer residuos diminutos (p. ej. <code>0.1 + 0.2</code>).</li>
                <li><strong>Derivadas e integrales numéricas:</strong> <code>f'(x₀)</code> se estima por diferencias finitas centradas de 5 puntos (paso <code>h = 10⁻⁵</code>) y la integral definida mediante la regla compuesta de Simpson (<code>n = 200</code> subintervalos); no son cálculos simbólicos y pierden exactitud cerca de singularidades, asíntotas o puntos no derivables.</li>
                <li><strong>Muestreo gráfico:</strong> la curva se dibuja evaluando cada <code>1.5 px</code>, por lo que oscilaciones rápidas o detalles muy finos pueden quedar omitidos; huecos removibles (<code>0/0</code>), raíces reales (bisección en 250 subintervalos) y cortes por asíntotas se detectan con criterios numéricos aproximados.</li>
                <li><strong>Restricciones de dominio:</strong> valores fuera del dominio real (raíces pares de negativos, <code>ln(x)</code> con <code>x ≤ 0</code>, división entre <code>0</code>) no se grafican.</li>
                <li><strong>Uso de estudio:</strong> para exámenes, ingeniería o decisiones importantes, verifica siempre con un método analítico o un sistema CAS certificado.</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    `;

    state.expanded = false;
    document.body.classList.remove('has-expanded-graph');
    bindGrapherEvents(container);
    drawGraph();
    updateAnalysisAndTable();
  }

  function bindGrapherEvents(container) {
    const fnControllers = {};
    let activeFnIndex = 0;
    let grapherVkbOpen = false;
    const vkbBtn = container.querySelector('#btn-grapher-vkb');
    const vkbDrawer = container.querySelector('#grapher-vkb-drawer');

    const setGrapherVkbOpen = (nextOpen) => {
      grapherVkbOpen = Boolean(nextOpen);
      if (vkbDrawer) {
        vkbDrawer.classList.toggle('is-open', grapherVkbOpen);
        vkbDrawer.classList.toggle('is-collapsed', !grapherVkbOpen);
      }
      if (vkbBtn) {
        vkbBtn.classList.toggle('active', grapherVkbOpen);
        vkbBtn.setAttribute('aria-expanded', grapherVkbOpen ? 'true' : 'false');
        vkbBtn.textContent = grapherVkbOpen ? '✕ Ocultar Teclado Matemático' : '⌨️ Teclado Matemático';
      }
      if (ns.App && typeof ns.App.syncFloatingMenuButton === 'function') {
        ns.App.syncFloatingMenuButton();
      }
    };

    const handleFnChange = (idx, rawVal) => {
      if (idx === 0 && ns.MathParser && typeof ns.MathParser.extractGrapherPayload === 'function' &&
          (/^(limite|lim|derivada|deriv|d\/dx|integral|int)\s*\(/i.test(rawVal.trim()) || /\\lim\b/.test(rawVal))) {
        const extracted = ns.MathParser.extractGrapherPayload(rawVal, state.tangentX);
        state.functions[0].expr = extracted.expr || rawVal;
        if (extracted.kind === 'limit' && typeof extracted.tangentX === 'number' && isFinite(extracted.tangentX)) {
          state.tangentX = extracted.tangentX;
          const tanInp = container.querySelector('#inp-tangent-x');
          if (tanInp) tanInp.value = state.tangentX;
        } else if (extracted.kind === 'derivative') {
          state.showDerivative = true;
          const chkD = container.querySelector('#chk-show-deriv');
          if (chkD) chkD.checked = true;
        } else if (extracted.kind === 'integral') {
          state.showIntegral = true;
          const chkI = container.querySelector('#chk-show-int');
          if (chkI) chkI.checked = true;
          if (typeof extracted.integralA === 'number' && isFinite(extracted.integralA)) {
            state.integralA = extracted.integralA;
            const inpA = container.querySelector('#inp-int-a');
            if (inpA) inpA.value = state.integralA;
          }
          if (typeof extracted.integralB === 'number' && isFinite(extracted.integralB)) {
            state.integralB = extracted.integralB;
            const inpB = container.querySelector('#inp-int-b');
            if (inpB) inpB.value = state.integralB;
          }
        }
      } else {
        state.functions[idx].expr = rawVal;
      }
      drawGraph();
      updateAnalysisAndTable();
    };

    container.querySelectorAll('[data-fn-mount]').forEach(mountEl => {
      const idx = Number(mountEl.getAttribute('data-fn-mount'));
      const fnObj = state.functions[idx];
      if (!fnObj) return;
      if (ns.MathInput && typeof ns.MathInput.createMathFieldController === 'function') {
        const ctrl = ns.MathInput.createMathFieldController(mountEl, {
          id: `grapher-mf-${idx}`,
          fallbackInputId: `grapher-fn-${idx}`,
          initialCasValue: fnObj.expr,
          placeholder: 'Ej: x^2 - 4',
          compact: true,
          hideNativeToggle: true,
          disableNativeKeyboard: true,
          ariaLabel: `Expresión para ${fnObj.label}`,
          onChange: (casVal) => handleFnChange(idx, casVal)
        });
        fnControllers[idx] = ctrl;
        mountEl.addEventListener('focusin', () => { activeFnIndex = idx; });
        mountEl.addEventListener('click', () => {
          activeFnIndex = idx;
          if (!grapherVkbOpen) setGrapherVkbOpen(true);
        });
      }
    });

    if (vkbDrawer && ns.MathInput && typeof ns.MathInput.renderVisualKeyboard === 'function') {
      ns.MathInput.renderVisualKeyboard(vkbDrawer, () => fnControllers[activeFnIndex] || fnControllers[0], {
        collapsible: true,
        initialCategory: 'funciones',
        title: '⌨️ Teclado Matemático',
        onClose: () => setGrapherVkbOpen(false)
      });
    }

    vkbBtn?.addEventListener('mousedown', (ev) => ev.preventDefault());
    vkbBtn?.addEventListener('click', () => {
      setGrapherVkbOpen(!grapherVkbOpen);
      if (grapherVkbOpen) {
        (fnControllers[activeFnIndex] || fnControllers[0])?.focus();
      }
    });

    // Presets
    container.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const expr = btn.getAttribute('data-preset');
        state.functions[0].expr = expr;
        state.functions[0].visible = true;
        state.centerX = 0;
        state.centerY = 0;
        state.scale = 42;
        if (fnControllers[0]) {
          fnControllers[0].setCasValue(expr, { silent: true });
        }
        drawGraph();
        updateAnalysisAndTable();
      });
    });

    container.querySelectorAll('[data-fn-toggle]').forEach(chk => {
      chk.addEventListener('change', () => {
        const idx = Number(chk.getAttribute('data-fn-toggle'));
        state.functions[idx].visible = chk.checked;
        drawGraph();
      });
    });

    // Controles de derivada e integral
    const chkDeriv = container.querySelector('#chk-show-deriv');
    const inpTanX = container.querySelector('#inp-tangent-x');
    const chkInt = container.querySelector('#chk-show-int');
    const inpIntA = container.querySelector('#inp-int-a');
    const inpIntB = container.querySelector('#inp-int-b');

    if (chkDeriv) {
      chkDeriv.addEventListener('change', () => {
        state.showDerivative = chkDeriv.checked;
        drawGraph();
        updateAnalysisAndTable();
      });
    }
    if (inpTanX) {
      inpTanX.addEventListener('input', () => {
        state.tangentX = parseFloat(inpTanX.value) || 0;
        drawGraph();
        updateAnalysisAndTable();
      });
    }
    if (chkInt) {
      chkInt.addEventListener('change', () => {
        state.showIntegral = chkInt.checked;
        drawGraph();
        updateAnalysisAndTable();
      });
    }
    [inpIntA, inpIntB].forEach(el => {
      if (!el) return;
      el.addEventListener('input', () => {
        state.integralA = parseFloat(inpIntA.value) || 0;
        state.integralB = parseFloat(inpIntB.value) || 0;
        drawGraph();
        updateAnalysisAndTable();
      });
    });

    // Botones de zoom, restablecer vista y modo Expandir
    const canvasCard = container.querySelector('#grapher-canvas-card');
    const expandBtn = container.querySelector('#btn-expand-graph');
    const closeExpandBtn = container.querySelector('#btn-close-expand-graph');
    const dismissHintBtn = container.querySelector('#btn-dismiss-gesture-hint');
    const liveBar = container.querySelector('#graph-live-bar');

    const updateLiveBar = (txt) => {
      if (liveBar && liveBar.textContent !== txt) {
        liveBar.textContent = txt;
      }
    };

    const setExpanded = (nextExpanded) => {
      if (!canvasCard) return;
      state.expanded = Boolean(nextExpanded);
      canvasCard.classList.toggle('is-graph-expanded', state.expanded);
      document.body.classList.toggle('has-expanded-graph', state.expanded);
      if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
        ns.App.syncModalScrollLock();
      }
      if (state.expanded) {
        markGestureHintSeen();
        canvasCard.setAttribute('role', 'dialog');
        canvasCard.setAttribute('aria-modal', 'true');
        canvasCard.setAttribute('aria-label', 'Graficador interactivo en pantalla completa');
        if (expandBtn) {
          expandBtn.hidden = true;
          expandBtn.setAttribute('aria-expanded', 'true');
        }
        if (closeExpandBtn) closeExpandBtn.hidden = false;
        requestAnimationFrame(() => {
          closeExpandBtn?.focus();
          drawGraph();
        });
      } else {
        canvasCard.removeAttribute('role');
        canvasCard.removeAttribute('aria-modal');
        canvasCard.removeAttribute('aria-label');
        if (expandBtn) {
          expandBtn.hidden = false;
          expandBtn.setAttribute('aria-expanded', 'false');
        }
        if (closeExpandBtn) closeExpandBtn.hidden = true;
        requestAnimationFrame(() => {
          expandBtn?.focus();
          drawGraph();
        });
      }
    };

    expandBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.confirm();
      setExpanded(true);
    });

    closeExpandBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.confirm();
      setExpanded(false);
    });

    dismissHintBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      markGestureHintSeen();
    });

    if (activeKeyHandler) {
      document.removeEventListener('keydown', activeKeyHandler, true);
      activeKeyHandler = null;
    }
    activeKeyHandler = (ev) => {
      if (!state.expanded || !canvasCard || !document.body.contains(canvasCard)) return;
      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        setExpanded(false);
        return;
      }
      if (ev.key === 'Tab') {
        const focusables = Array.from(canvasCard.querySelectorAll(
          'button:not([hidden]):not([disabled]), input:not([disabled]), summary, [href]'
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
    document.addEventListener('keydown', activeKeyHandler, true);

    container.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      state.scale = clampScale(state.scale * 1.25);
      drawGraph();
    });
    container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      state.scale = clampScale(state.scale / 1.25);
      drawGraph();
    });
    container.querySelector('#btn-reset-view')?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      state.centerX = 0;
      state.centerY = 0;
      state.scale = 42;
      state.hoverMathX = null;
      state.hoverMathY = null;
      updateLiveBar('Vista restablecida en el origen (0, 0).');
      drawGraph();
    });

    // Interacción con el Canvas (Arrastre, Rueda y Gestos móviles)
    const canvasWrap = container.querySelector('#graph-canvas-wrap');
    const canvas = container.querySelector('#math-graph-canvas');
    if (!canvas) return;

    if (activeResizeObserver) {
      activeResizeObserver.disconnect();
      activeResizeObserver = null;
    }
    if (typeof ResizeObserver === 'function' && canvasWrap) {
      activeResizeObserver = new ResizeObserver(() => {
        if (!document.body.contains(canvas)) {
          activeResizeObserver.disconnect();
          return;
        }
        drawGraph();
      });
      activeResizeObserver.observe(canvasWrap);
    }

    if (activeThemeObserver) {
      activeThemeObserver.disconnect();
      activeThemeObserver = null;
    }
    if (typeof MutationObserver === 'function') {
      activeThemeObserver = new MutationObserver(() => {
        if (document.body.contains(canvas)) drawGraph();
      });
      activeThemeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    canvas.addEventListener('mousedown', (e) => {
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      state.isDragging = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (state.isDragging) {
        const dx = e.clientX - state.dragStartX;
        const dy = e.clientY - state.dragStartY;
        state.centerX -= dx / state.scale;
        state.centerY += dy / state.scale;
        state.dragStartX = e.clientX;
        state.dragStartY = e.clientY;
        drawGraph();
      } else {
        const pt = screenToMath(px, py, state.centerX, state.centerY, state.scale, rect.width, rect.height);
        state.hoverMathX = pt.mx;
        state.hoverMathY = pt.my;
        updateLiveBar(`Cursor en el plano: x = ${pt.mx.toFixed(2)}, y = ${pt.my.toFixed(2)}`);
        drawGraph();
      }
    });

    canvas.addEventListener('mouseleave', () => {
      state.hoverMathX = null;
      drawGraph();
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      state.scale = clampScale(state.scale * factor);
      drawGraph();
    }, { passive: false });

    // Gestos táctiles:
    // - Embebido: 1 dedo desplaza la página; 2 dedos mueven + zoom sobre el plano
    // - Expandido: 1 dedo desplaza el plano; 2 dedos mueven + zoom
    let touchMode = null;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let lastPinchDist = 0;
    let lastMidX = 0;
    let lastMidY = 0;
    const pinchDistance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const pinchMid = (t, rect) => ({
      x: ((t[0].clientX + t[1].clientX) * 0.5) - rect.left,
      y: ((t[0].clientY + t[1].clientY) * 0.5) - rect.top
    });

    canvas.addEventListener('touchstart', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const pt = screenToMath(t.clientX - rect.left, t.clientY - rect.top, state.centerX, state.centerY, state.scale, rect.width, rect.height);
        state.hoverMathX = pt.mx;
        state.hoverMathY = pt.my;
        updateLiveBar(`Punto tocado: x = ${pt.mx.toFixed(2)}, y = ${pt.my.toFixed(2)}`);
        if (shouldSingleFingerPan(state.expanded)) {
          touchMode = 'pan';
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
        } else {
          touchMode = 'read';
        }
        drawGraph();
      } else if (e.touches.length === 2) {
        touchMode = 'pinch';
        lastPinchDist = pinchDistance(e.touches);
        const mid = pinchMid(e.touches, rect);
        lastMidX = mid.x;
        lastMidY = mid.y;
        markGestureHintSeen();
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (touchMode === 'pan' && e.touches.length === 1 && shouldSingleFingerPan(state.expanded)) {
        e.preventDefault();
        const t = e.touches[0];
        const dx = t.clientX - lastTouchX;
        const dy = t.clientY - lastTouchY;
        state.centerX -= dx / state.scale;
        state.centerY += dy / state.scale;
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;
        const pt = screenToMath(t.clientX - rect.left, t.clientY - rect.top, state.centerX, state.centerY, state.scale, rect.width, rect.height);
        state.hoverMathX = pt.mx;
        state.hoverMathY = pt.my;
        drawGraph();
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dist = pinchDistance(e.touches);
        const mid = pinchMid(e.touches, rect);
        const next = applyPinchZoom({
          scale: state.scale,
          prevDist: lastPinchDist || dist,
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
        lastPinchDist = dist;
        lastMidX = mid.x;
        lastMidY = mid.y;
        drawGraph();
      }
    }, { passive: false });

    const endTouch = () => { touchMode = null; };
    canvas.addEventListener('touchend', endTouch, { passive: true });
    canvas.addEventListener('touchcancel', endTouch, { passive: true });
  }

  // Redibujar el lienzo al girar el teléfono o cambiar el tamaño de la ventana
  let resizeFrame = null;
  const scheduleRedraw = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => drawGraph());
  };
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', scheduleRedraw);
    window.addEventListener('orientationchange', scheduleRedraw);
  }

  function drawGraph() {
    const canvas = document.getElementById('math-graph-canvas');
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(120, rect.width || 680);
    const height = Math.max(120, rect.height || 480);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    const pal = getGraphThemePalette();
    ctx.save();
    ctx.scale(dpr, dpr);

    // Fondo adaptable al tema claro/oscuro con contraste AA
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, width, height);

    const toScreenX = (x) => mathToScreen(x, 0, state.centerX, state.centerY, state.scale, width, height).px;
    const toScreenY = (y) => mathToScreen(0, y, state.centerX, state.centerY, state.scale, width, height).py;
    const toMathX = (px) => screenToMath(px, 0, state.centerX, state.centerY, state.scale, width, height).mx;

    const gridStep = computeOptimalGridStep(state.scale, width < 480 ? 48 : 54);
    const xMin = toMathX(0);
    const xMax = toMathX(width);
    const yMin = state.centerY - (height / 2) / state.scale;
    const yMax = state.centerY + (height / 2) / state.scale;

    const originX = toScreenX(0);
    const originY = toScreenY(0);

    // Cuadrícula secundaria y principal
    ctx.lineWidth = 1;
    ctx.strokeStyle = pal.grid;
    ctx.fillStyle = pal.tickText;
    const labelFontPx = Math.max(11, width < 420 ? 11 : 12);
    ctx.font = `${labelFontPx}px Inter, system-ui, sans-serif`;

    const yLabelLeftSide = originX > width - 52;
    const axisX = yLabelLeftSide
      ? Math.min(width - 8, Math.max(40, originX - 8))
      : Math.min(width - 42, Math.max(8, originX + 7));
    const yColLeft = yLabelLeftSide ? axisX - 32 : axisX - 2;
    const yColRight = yLabelLeftSide ? axisX + 2 : axisX + 32;
    const axisY = Math.min(height - 10, Math.max(18, originY + 15));

    const firstGridX = Math.floor(xMin / gridStep) * gridStep;
    let lastTickRight = -Infinity;
    ctx.textAlign = 'center';
    for (let gx = firstGridX; gx <= xMax; gx += gridStep) {
      const sx = toScreenX(gx);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (Math.abs(gx) > 1e-6) {
        const lbl = Number(gx.toFixed(3)).toString();
        const halfW = (typeof ctx.measureText === 'function' ? ctx.measureText(lbl).width : lbl.length * 7) / 2;
        if (sx - halfW < 14 || sx + halfW > width - 14) continue;
        if (Math.abs(sx - originX) < halfW + 14) continue;
        if (sx - halfW < yColRight + 4 && sx + halfW > yColLeft - 4) continue;
        if (sx - halfW < lastTickRight + 8) continue;
        ctx.fillText(lbl, sx, axisY);
        lastTickRight = sx + halfW;
      }
    }

    const firstGridY = Math.floor(yMin / gridStep) * gridStep;
    ctx.textAlign = yLabelLeftSide ? 'right' : 'left';
    let lastTickY = Infinity;
    for (let gy = firstGridY; gy <= yMax; gy += gridStep) {
      const sy = toScreenY(gy);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (Math.abs(gy) > 1e-6) {
        const lbl = Number(gy.toFixed(3)).toString();
        if (sy < 18 || sy > height - 12) continue;
        if (Math.abs(sy - originY) < 16) continue;
        if (lastTickY - sy < 18) continue;
        ctx.fillText(lbl, axisX, sy + 4);
        lastTickY = sy;
      }
    }
    ctx.textAlign = 'left';

    // Ejes cartesianos X e Y
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = pal.axis;

    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Compilar función principal f(x) para sombreado de integral y tangente
    let primaryFn = null;
    if (state.functions[0].visible && state.functions[0].expr.trim()) {
      try {
        primaryFn = ns.MathParser.compileFunction(state.functions[0].expr, 'RAD');
      } catch (_) {
        primaryFn = null;
      }
    }

    // 1. Sombreado de Integral Definida sobre f(x)
    if (primaryFn && state.showIntegral) {
      const a = Math.min(state.integralA, state.integralB);
      const b = Math.max(state.integralA, state.integralB);
      const pxStart = Math.max(0, toScreenX(a));
      const pxEnd = Math.min(width, toScreenX(b));

      if (pxEnd > pxStart) {
        ctx.fillStyle = pal.integralFill;
        ctx.beginPath();
        ctx.moveTo(pxStart, originY);
        for (let px = pxStart; px <= pxEnd; px += 2) {
          const mx = toMathX(px);
          const my = primaryFn(mx);
          if (isFinite(my)) {
            ctx.lineTo(px, toScreenY(my));
          }
        }
        ctx.lineTo(pxEnd, originY);
        ctx.closePath();
        ctx.fill();
      }
    }

    // 2. Trazar cada función activa y sus discontinuidades removibles (huecos)
    const detectedHolesByFn = [];
    const themeCurveColors = [pal.curvePrimary, pal.curveSecondary, pal.curveTertiary];
    for (let idx = 0; idx < state.functions.length; idx++) {
      const fnObj = state.functions[idx];
      if (!fnObj.visible || !fnObj.expr.trim()) continue;
      const curveColor = themeCurveColors[idx] || fnObj.color;
      let compiled;
      try {
        compiled = ns.MathParser.compileFunction(fnObj.expr, 'RAD');
      } catch (_) {
        continue;
      }

      const holes = typeof ns.MathParser.findRemovableDiscontinuities === 'function'
        ? ns.MathParser.findRemovableDiscontinuities(fnObj.expr, xMin, xMax, 'RAD')
        : [];
      if (holes.length) {
        detectedHolesByFn.push({ color: curveColor, holes });
      }

      ctx.strokeStyle = curveColor;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let penDown = false;
      let prevY = null;

      for (let px = 0; px <= width; px += 1.5) {
        const mx = toMathX(px);
        const nearHole = holes.some(h => Math.abs(mx - h.x) * state.scale < 5);
        if (nearHole) {
          penDown = false;
          prevY = null;
          continue;
        }
        const my = compiled(mx);
        if (!isFinite(my) || Math.abs(my) > 1e5) {
          penDown = false;
          prevY = null;
          continue;
        }
        const sy = toScreenY(my);
        // Evitar líneas verticales falsas en asíntotas
        if (prevY !== null && Math.abs(sy - prevY) > height * 1.5) {
          penDown = false;
        }
        if (!penDown) {
          ctx.moveTo(px, sy);
          penDown = true;
        } else {
          ctx.lineTo(px, sy);
        }
        prevY = sy;
      }
      ctx.stroke();
    }

    // Dibujar círculos abiertos sobre todas las discontinuidades removibles detectadas
    for (const entry of detectedHolesByFn) {
      for (const h of entry.holes) {
        const hx = toScreenX(h.x);
        const hy = toScreenY(h.y);
        if (hx < -10 || hx > width + 10 || hy < -10 || hy > height + 10) continue;
        ctx.fillStyle = pal.holeFill;
        ctx.strokeStyle = entry.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 3. Trazar Recta Tangente o Punto de Límite en x0 sobre f(x)
    if (primaryFn) {
      const x0 = state.tangentX;
      let y0 = primaryFn(x0);
      let isHole = false;
      if (!isFinite(y0)) {
        const yL = primaryFn(x0 - 1e-5);
        const yR = primaryFn(x0 + 1e-5);
        if (isFinite(yL) && isFinite(yR) && Math.abs(yL - yR) < 1e-2 * Math.max(1, Math.abs(yL))) {
          y0 = 0.5 * (yL + yR);
          isHole = true;
        }
      }
      const slope = ns.MathParser.numericalDerivative(primaryFn, x0);

      if (state.showDerivative && isFinite(y0) && isFinite(slope)) {
        ctx.save();
        ctx.strokeStyle = pal.tangent;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        const xLeft = toMathX(0);
        const xRight = toMathX(width);
        const yLeft = y0 + slope * (xLeft - x0);
        const yRight = y0 + slope * (xRight - x0);
        ctx.moveTo(0, toScreenY(yLeft));
        ctx.lineTo(width, toScreenY(yRight));
        ctx.stroke();
        ctx.restore();
      }

      if (isFinite(y0)) {
        // Punto de evaluación o límite en x0
        ctx.fillStyle = isHole ? pal.holeFill : pal.tangent;
        ctx.strokeStyle = pal.tangent;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(toScreenX(x0), toScreenY(y0), 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 4. Punto interactivo bajo el cursor o toque sobre f(x) con tooltip desplazado
    if (primaryFn && state.hoverMathX !== null) {
      const hx = state.hoverMathX;
      const hy = primaryFn(hx);
      if (isFinite(hy)) {
        const sx = toScreenX(hx);
        const sy = toScreenY(hy);
        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          ctx.fillStyle = pal.curvePrimary;
          ctx.strokeStyle = pal.pointStroke;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          const tip = `(${ns.MathParser.formatNumber(hx, 2)}, ${ns.MathParser.formatNumber(hy, 2)})`;
          drawPointTooltip(ctx, sx, sy, tip, width, height, pal);
          const liveBar = document.getElementById('graph-live-bar');
          const txt = `En la curva: x = ${ns.MathParser.formatNumber(hx, 3)} | f(x) = ${ns.MathParser.formatNumber(hy, 3)}`;
          if (liveBar && liveBar.textContent !== txt) {
            liveBar.textContent = txt;
          }
        }
      }
    }

    ctx.restore();
  }

  function updateAnalysisAndTable() {
    const analysisBar = document.getElementById('graph-analysis-bar');
    const tableBox = document.getElementById('graph-table-box');
    if (!analysisBar || !tableBox) return;

    const expr = state.functions[0].expr;
    let fn;
    try {
      fn = ns.MathParser.compileFunction(expr, 'RAD');
    } catch (e) {
      analysisBar.innerHTML = `<div class="analysis-stat-box"><strong>Estado</strong>Expresión en edición...</div>`;
      return;
    }

    const x0 = state.tangentX;
    const fx0 = fn(x0);
    let evalDisplayHtml = `f(${x0}) = <b>${ns.MathParser.formatNumber(fx0)}</b>`;
    if (!isFinite(fx0)) {
      const limL = fn(x0 - 1e-5);
      const limR = fn(x0 + 1e-5);
      if (isFinite(limL) && isFinite(limR) && Math.abs(limL - limR) < 1e-2 * Math.max(1, Math.abs(limL))) {
        const limAvg = 0.5 * (limL + limR);
        evalDisplayHtml = `Lím<sub>x→${x0}</sub> = <b>${ns.MathParser.formatNumber(limAvg)}</b> <small class="analysis-note-muted">(0/0)</small>`;
      }
    }
    const dfx0 = ns.MathParser.numericalDerivative(fn, x0);
    const areaVal = ns.MathParser.numericalIntegral(fn, state.integralA, state.integralB);
    const roots = ns.MathParser.findRoots(fn, -10, 10);

    analysisBar.innerHTML = `
      <div class="analysis-stat-box">
        <strong>Evaluación en x₀ = ${x0}</strong>
        ${evalDisplayHtml}
      </div>
      <div class="analysis-stat-box">
        <strong>Derivada f'(x₀) (Pendiente)</strong>
        f'(${x0}) = <b class="analysis-val-deriv">${ns.MathParser.formatNumber(dfx0)}</b>
      </div>
      <div class="analysis-stat-box">
        <strong>Integral ∫ f(x)dx en [${state.integralA}, ${state.integralB}]</strong>
        Área neta = <b class="analysis-val-int">${ns.MathParser.formatNumber(areaVal)}</b>
      </div>
      <div class="analysis-stat-box">
        <strong>Raíces reales en [-10, 10]</strong>
        ${roots.length ? roots.map(r => `x ≈ ${r}`).join(', ') : 'Sin cortes detectados'}
      </div>
    `;

    // Generar tabla de valores alrededor de x = -3 a 3
    let rowsHtml = `
      <table class="grapher-table">
        <thead>
          <tr>
            <th>x</th>
            <th>f(x)</th>
            <th>f'(x)</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let x = -3; x <= 3; x += 1) {
      const y = fn(x);
      let yCell = ns.MathParser.formatNumber(y, 3);
      if (!isFinite(y)) {
        const yL = fn(x - 1e-5);
        const yR = fn(x + 1e-5);
        if (isFinite(yL) && isFinite(yR) && Math.abs(yL - yR) < 1e-2 * Math.max(1, Math.abs(yL))) {
          yCell = `Lím=${ns.MathParser.formatNumber(0.5 * (yL + yR), 3)}`;
        }
      }
      const dy = ns.MathParser.numericalDerivative(fn, x);
      rowsHtml += `
        <tr>
          <td>${x}</td>
          <td>${yCell}</td>
          <td>${ns.MathParser.formatNumber(dy, 3)}</td>
        </tr>
      `;
    }
    rowsHtml += `</tbody></table>`;
    tableBox.innerHTML = rowsHtml;
  }

  ns.GrapherTool = {
    renderGrapherView,
    drawGraph,
    clampScale,
    mathToScreen,
    screenToMath,
    computeOptimalGridStep,
    shouldSingleFingerPan,
    applyPinchZoom
  };
})(window.MatInteractiva);
