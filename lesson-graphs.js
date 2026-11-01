/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Gráficas Interactivas Integradas en Lecciones
   Archivo: js/tools/lesson-graphs.js
   Proporciona laboratorios visuales interactivos embebidos en las lecciones
   y ejercicios de Límites, Derivadas, Integrales, Álgebra y Funciones.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  /**
   * Evalúa una función de forma segura; si hay indeterminación 0/0 puntual en x,
   * devuelve NaN en el punto exacto y permite estimar límites laterales cerca.
   */
  function safeEval(fn, x) {
    try {
      const y = fn(x);
      return (typeof y === 'number' && isFinite(y) && Math.abs(y) < 1e6) ? y : NaN;
    } catch (_) {
      return NaN;
    }
  }

  /**
   * Renderiza un widget gráfico interactivo dentro de `container` según `config`:
   * config = {
   *   mode: 'limits' | 'derivatives' | 'integrals' | 'general',
   *   title: string,
   *   description: string,
   *   fnExpr: string,
   *   presets: [{ label, expr, a, b, x0 }],
   *   initialA: number,
   *   initialB: number,
   *   initialX0: number,
   *   holeAt: number | null // punto donde hay discontinuidad removible 0/0
   * }
   */
  function renderInteractiveWidget(container, config = {}) {
    if (!container) return;

    const mode = config.mode || 'general';
    const widgetId = 'lg-' + Math.random().toString(36).slice(2, 9);

    const state = {
      mode,
      fnExpr: config.fnExpr || config.fn || 'x^2 - 4',
      x0: config.initialX0 !== undefined ? config.initialX0 : (config.x0 !== undefined ? config.x0 : (config.paramA !== undefined ? config.paramA : 1.5)),
      delta: config.delta !== undefined ? config.delta : 0.6,
      secantH: config.h !== undefined ? config.h : 0,
      showDerivCurve: true,
      showNormalLine: true,
      intA: config.initialA !== undefined ? config.initialA : (config.a !== undefined ? config.a : -1),
      intB: config.initialB !== undefined ? config.initialB : (config.b !== undefined ? config.b : 2),
      riemannN: config.n !== undefined ? config.n : 0,
      scale: config.scale || 44,
      centerX: config.centerX || 0,
      centerY: config.centerY || 0,
      holeAt: config.holeAt !== undefined ? config.holeAt : null
    };

    const presets = config.presets || [];

    container.innerHTML = `
      <div class="lesson-graph-card" id="${widgetId}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
          <div>
            <span class="didactic-step-badge">📈 5. Interpretación Gráfica Interactiva</span>
            <h3 style="margin:0.15rem 0 0.25rem; font-size:1.08rem; color:var(--primary-900);">
              ${ns.MathRenderer.formatRichText(config.title || 'Laboratorio Gráfico Interactivo')}
            </h3>
            <p style="font-size:0.86rem; color:var(--text-secondary);">
              ${ns.MathRenderer.formatRichText(config.description || 'Interactúa con los controles deslizantes o arrastra sobre la gráfica para explorar el comportamiento matemático en tiempo real.')}
            </p>
          </div>
          ${presets.length ? `
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              ${presets.map((p, idx) => `
                <button class="btn btn-outline btn-sm" data-lg-preset="${idx}">${ns.MathRenderer.formatRichText(p.label)}</button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Controles Interactivos Específicos del Modo -->
        <div class="lesson-graph-controls" id="${widgetId}-controls">
          ${buildControlsHtml(state, widgetId)}
        </div>

        <!-- Lienzo Gráfico -->
        <div class="lesson-canvas-box" id="${widgetId}-canvas-box">
          <canvas id="${widgetId}-canvas" class="lesson-graph-canvas"></canvas>
          <div class="graph-coords-badge" id="${widgetId}-badge">Interactivo</div>
        </div>

        <!-- Panel de Lectura Matemática en Vivo -->
        <div class="graph-analysis-bar" id="${widgetId}-readout" style="margin-top:0.85rem;"></div>
      </div>
    `;

    const root = container.querySelector('#' + widgetId);
    bindWidgetEvents(root, state, presets, widgetId);
    drawWidgetCanvas(root, state, widgetId);
  }

  function buildControlsHtml(state, widgetId) {
    if (state.mode === 'limits') {
      return `
        <div class="lesson-control-group">
          <label><span>Función $f(x)$:</span></label>
          <input type="text" class="fn-input" id="${widgetId}-fn" value="${state.fnExpr}" />
        </div>
        <div class="lesson-control-group">
          <label>
            <span>Valor objetivo ($x \\to a$):</span>
            <strong id="${widgetId}-lbl-x0">a = ${state.x0}</strong>
          </label>
          <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-x0" value="${state.x0}" />
        </div>
        <div class="lesson-control-group">
          <label>
            <span>Distancia lateral ($\\delta$):</span>
            <strong id="${widgetId}-lbl-delta">δ = ${state.delta}</strong>
          </label>
          <input type="range" min="0.02" max="1.8" step="0.02" id="${widgetId}-rng-delta" value="${state.delta}" />
        </div>
      `;
    }

    if (state.mode === 'derivatives') {
      return `
        <div class="lesson-control-group">
          <label><span>Función $f(x)$:</span></label>
          <input type="text" class="fn-input" id="${widgetId}-fn" value="${state.fnExpr}" />
        </div>
        <div class="lesson-control-group">
          <label>
            <span>Punto de tangencia ($x_0$):</span>
            <strong id="${widgetId}-lbl-x0">x₀ = ${state.x0}</strong>
          </label>
          <input type="range" min="-3.5" max="3.5" step="0.05" id="${widgetId}-rng-x0" value="${state.x0}" />
        </div>
        <div class="lesson-control-group">
          <label>
            <span>Incremento secante ($h \\to 0$):</span>
            <strong id="${widgetId}-lbl-h">h = ${state.secantH}</strong>
          </label>
          <input type="range" min="0" max="2" step="0.05" id="${widgetId}-rng-h" value="${state.secantH}" />
        </div>
        <div class="lesson-control-group" style="justify-content:center; gap:0.4rem;">
          <label style="cursor:pointer; font-weight:600; justify-content:flex-start; gap:0.45rem;">
            <input type="checkbox" id="${widgetId}-chk-deriv" ${state.showDerivCurve ? 'checked' : ''} />
            <span>Comparar con gráfica de $f'(x)$</span>
          </label>
          <label style="cursor:pointer; font-weight:600; justify-content:flex-start; gap:0.45rem;">
            <input type="checkbox" id="${widgetId}-chk-normal" ${state.showNormalLine ? 'checked' : ''} />
            <span>Trazar recta normal perpendicular</span>
          </label>
        </div>
      `;
    }

    if (state.mode === 'integrals') {
      return `
        <div class="lesson-control-group">
          <label><span>Integrando $f(x)$:</span></label>
          <input type="text" class="fn-input" id="${widgetId}-fn" value="${state.fnExpr}" />
        </div>
        <div class="lesson-control-group">
          <label>
            <span>Límite inferior ($a$):</span>
            <strong id="${widgetId}-lbl-a">a = ${state.intA}</strong>
          </label>
          <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-a" value="${state.intA}" />
        </div>
        <div class="lesson-control-group">
          <label>
            <span>Límite superior ($b$):</span>
            <strong id="${widgetId}-lbl-b">b = ${state.intB}</strong>
          </label>
          <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-b" value="${state.intB}" />
        </div>
        <div class="lesson-control-group">
          <label>
            <span>Rectángulos de Riemann ($n$):</span>
            <strong id="${widgetId}-lbl-n">${state.riemannN === 0 ? 'Continuo (Exacto)' : 'n = ' + state.riemannN}</strong>
          </label>
          <input type="range" min="0" max="50" step="2" id="${widgetId}-rng-n" value="${state.riemannN}" />
        </div>
      `;
    }

    // Modo general (Funciones / Álgebra / Raíces)
    return `
      <div class="lesson-control-group">
        <label><span>Expresión $f(x)$:</span></label>
        <input type="text" class="fn-input" id="${widgetId}-fn" value="${state.fnExpr}" />
      </div>
      <div class="lesson-control-group">
        <label>
          <span>Inspeccionar punto ($x_0$):</span>
          <strong id="${widgetId}-lbl-x0">x₀ = ${state.x0}</strong>
        </label>
        <input type="range" min="-4" max="4" step="0.1" id="${widgetId}-rng-x0" value="${state.x0}" />
      </div>
    `;
  }

  function bindWidgetEvents(root, state, presets, widgetId) {
    if (!root) return;

    // Renderizar fórmulas en las etiquetas de controles
    root.querySelectorAll('.lesson-control-group label span').forEach(sp => {
      sp.innerHTML = ns.MathRenderer.formatRichText(sp.innerHTML);
    });

    // Presets
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

        const fnInp = root.querySelector(`#${widgetId}-fn`);
        if (fnInp) fnInp.value = state.fnExpr;
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

    const fnInp = root.querySelector(`#${widgetId}-fn`);
    fnInp?.addEventListener('input', () => {
      state.fnExpr = fnInp.value;
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

    // Permitir arrastrar directamente sobre el lienzo para mover x0
    const canvas = root.querySelector(`#${widgetId}-canvas`);
    if (canvas) {
      let dragging = false;
      const updateFromPointer = (clientX) => {
        const rect = canvas.getBoundingClientRect();
        const px = clientX - rect.left;
        const mathX = Number((state.centerX + (px - rect.width / 2) / state.scale).toFixed(2));
        if (state.mode === 'integrals') {
          // Mover el extremo más cercano (a o b)
          if (Math.abs(mathX - state.intA) < Math.abs(mathX - state.intB)) {
            state.intA = Math.max(-4, Math.min(4, mathX));
            if (rngA) rngA.value = state.intA;
          } else {
            state.intB = Math.max(-4, Math.min(4, mathX));
            if (rngB) rngB.value = state.intB;
          }
        } else {
          state.x0 = Math.max(-4, Math.min(4, mathX));
          if (rngX0) rngX0.value = state.x0;
        }
        syncControlLabels(root, state, widgetId);
        drawWidgetCanvas(root, state, widgetId);
      };

      canvas.addEventListener('mousedown', (e) => {
        dragging = true;
        updateFromPointer(e.clientX);
      });
      window.addEventListener('mouseup', () => { dragging = false; });
      canvas.addEventListener('mousemove', (e) => {
        if (dragging) updateFromPointer(e.clientX);
      });
    }
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
    const badge = root.querySelector(`#${widgetId}-badge`);
    if (!canvas || !readout) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width || 640;
    const height = rect.height || 360;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const toScreenX = (x) => width / 2 + (x - state.centerX) * state.scale;
    const toScreenY = (y) => height / 2 - (y - state.centerY) * state.scale;
    const toMathX = (px) => state.centerX + (px - width / 2) / state.scale;

    // Dibujar cuadrícula y ejes
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#F1F5F9';
    ctx.fillStyle = '#64748B';
    ctx.font = '11px Inter, sans-serif';

    const xMin = toMathX(0);
    const xMax = toMathX(width);
    const yMin = state.centerY - (height / 2) / state.scale;
    const yMax = state.centerY + (height / 2) / state.scale;

    for (let gx = Math.floor(xMin); gx <= xMax; gx += 1) {
      const sx = toScreenX(gx);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
      if (gx !== 0) ctx.fillText(String(gx), sx - 4, Math.min(height - 8, Math.max(14, toScreenY(0) + 14)));
    }

    for (let gy = Math.floor(yMin); gy <= yMax; gy += 1) {
      const sy = toScreenY(gy);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
      if (gy !== 0) ctx.fillText(String(gy), Math.min(width - 22, Math.max(6, toScreenX(0) + 6)), sy + 4);
    }

    // Ejes principales
    const ox = toScreenX(0);
    const oy = toScreenY(0);
    ctx.strokeStyle = '#94A3B8';
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
      readout.innerHTML = `<div class="analysis-stat-box"><strong>Sintaxis</strong>Escribe una función válida de x.</div>`;
      return;
    }

    /* ------------------------------------------------------------------
       A. MODO INTEGRALES: Áreas Positivas (Verde) y Negativas (Coral) + Riemann
       ------------------------------------------------------------------ */
    if (state.mode === 'integrals') {
      const a = Math.min(state.intA, state.intB);
      const b = Math.max(state.intA, state.intB);
      const pxA = Math.max(0, toScreenX(a));
      const pxB = Math.min(width, toScreenX(b));

      if (state.riemannN === 0) {
        // Sombreado continuo diferenciando área positiva (f >= 0) y negativa (f < 0)
        for (let px = pxA; px < pxB; px += 2) {
          const mx = toMathX(px);
          const my = safeEval(fn, mx);
          if (!isFinite(my)) continue;
          const sy = toScreenY(my);
          ctx.fillStyle = my >= 0 ? 'rgba(16, 185, 129, 0.28)' : 'rgba(239, 68, 68, 0.25)';
          const topY = Math.min(oy, sy);
          const rectH = Math.abs(sy - oy);
          ctx.fillRect(px, topY, 2.2, rectH);
        }
      } else {
        // Sumas de Riemann con n rectángulos (punto medio)
        const n = state.riemannN;
        const dx = (b - a) / n;
        for (let i = 0; i < n; i++) {
          const xLeft = a + i * dx;
          const xRight = xLeft + dx;
          const xMid = 0.5 * (xLeft + xRight);
          const yMid = safeEval(fn, xMid);
          if (!isFinite(yMid)) continue;

          const sx1 = toScreenX(xLeft);
          const sx2 = toScreenX(xRight);
          const sy = toScreenY(yMid);
          const topY = Math.min(oy, sy);
          const rectH = Math.abs(sy - oy);

          ctx.fillStyle = yMid >= 0 ? 'rgba(16, 185, 129, 0.32)' : 'rgba(239, 68, 68, 0.30)';
          ctx.strokeStyle = yMid >= 0 ? '#059669' : '#DC2626';
          ctx.lineWidth = 1;
          ctx.fillRect(sx1, topY, sx2 - sx1, rectH);
          ctx.strokeRect(sx1, topY, sx2 - sx1, rectH);
        }
      }

      // Líneas verticales de los extremos a y b
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#1E40AF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(toScreenX(state.intA), 0); ctx.lineTo(toScreenX(state.intA), height);
      ctx.moveTo(toScreenX(state.intB), 0); ctx.lineTo(toScreenX(state.intB), height);
      ctx.stroke();
      ctx.restore();
    }

    /* ------------------------------------------------------------------
        Trazar Curva Principal f(x)
       ------------------------------------------------------------------ */
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    let penDown = false;
    let prevSy = null;

    for (let px = 0; px <= width; px += 1.5) {
      const mx = toMathX(px);
      if (state.holeAt !== null && Math.abs(mx - state.holeAt) < 0.03) {
        penDown = false;
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

    /* ------------------------------------------------------------------
       B. MODO LÍMITES: Límites Laterales, Discontinuidades y Asíntotas
       ------------------------------------------------------------------ */
    if (state.mode === 'limits') {
      const a = state.x0;
      const d = state.delta;
      const xLeft = a - d;
      const xRight = a + d;
      const yLeft = safeEval(fn, xLeft);
      const yRight = safeEval(fn, xRight);

      // Estimar límites laterales muy cerca de a
      const limIzq = safeEval(fn, a - 1e-4);
      const limDer = safeEval(fn, a + 1e-4);
      const fa = state.holeAt !== null && Math.abs(a - state.holeAt) < 1e-3 ? NaN : safeEval(fn, a);

      // Asíntota vertical si crece sin cota cerca de a
      if (Math.abs(limIzq) > 25 || Math.abs(limDer) > 25) {
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(toScreenX(a), 0);
        ctx.lineTo(toScreenX(a), height);
        ctx.stroke();
        ctx.restore();
      }

      // Asíntota horizontal si converge cuando x -> +inf
      const yInfPos = safeEval(fn, 100);
      if (isFinite(yInfPos) && Math.abs(yInfPos) < 20 && Math.abs(safeEval(fn, 200) - yInfPos) < 0.05) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#0D9488';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, toScreenY(yInfPos));
        ctx.lineTo(width, toScreenY(yInfPos));
        ctx.stroke();
        ctx.restore();
      }

      // Punto de aproximación por la izquierda (x -> a-)
      if (isFinite(yLeft)) {
        const sxL = toScreenX(xLeft);
        const syL = toScreenY(yLeft);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(sxL, oy); ctx.lineTo(sxL, syL); ctx.lineTo(ox, syL);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(sxL, syL, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Punto de aproximación por la derecha (x -> a+)
      if (isFinite(yRight)) {
        const sxR = toScreenX(xRight);
        const syR = toScreenY(yRight);
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(sxR, oy); ctx.lineTo(sxR, syR); ctx.lineTo(ox, syR);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#7C3AED';
        ctx.beginPath();
        ctx.arc(sxR, syR, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Si los límites laterales coinciden pero hay hueco (0/0), dibujar círculo abierto (hueco de discontinuidad evitable)
      if (isFinite(limIzq) && isFinite(limDer) && Math.abs(limIzq - limDer) < 0.05) {
        const L = 0.5 * (limIzq + limDer);
        const sxA = toScreenX(a);
        const syL = toScreenY(L);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(sxA, syL, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      const bilateralExists = isFinite(limIzq) && isFinite(limDer) && Math.abs(limIzq - limDer) < 0.05;
      const limitStr = bilateralExists
        ? ns.MathParser.formatNumber(0.5 * (limIzq + limDer), 4)
        : 'No existe (límites laterales distintos o infinitos)';

      if (badge) badge.textContent = `x → ${a} | δ = ${d}`;

      readout.innerHTML = `
        <div class="analysis-stat-box" style="border-left:3px solid #059669;">
          <strong>Aproximación Izquierda ($x = ${ns.MathParser.formatNumber(xLeft, 2)}$)</strong>
          $f(a - \\delta) = ${ns.MathParser.formatNumber(yLeft, 4)}$ <br/>
          $\\lim_{x \\to a^-} f(x) = $ <b>${ns.MathParser.formatNumber(limIzq, 3)}</b>
        </div>
        <div class="analysis-stat-box" style="border-left:3px solid #7C3AED;">
          <strong>Aproximación Derecha ($x = ${ns.MathParser.formatNumber(xRight, 2)}$)</strong>
          $f(a + \\delta) = ${ns.MathParser.formatNumber(yRight, 4)}$ <br/>
          $\\lim_{x \\to a^+} f(x) = $ <b>${ns.MathParser.formatNumber(limDer, 3)}</b>
        </div>
        <div class="analysis-stat-box" style="border-left:3px solid var(--primary-600);">
          <strong>Límite Bilateral en $a = ${a}$</strong>
          $\\lim_{x \\to ${a}} f(x) = $ <b style="color:var(--primary-800);">${limitStr}</b>
        </div>
        <div class="analysis-stat-box">
          <strong>Comportamiento al Infinito</strong>
          $x \\to +\\infty: ${ns.MathParser.formatNumber(yInfPos, 3)}$
        </div>
      `;
      readout.innerHTML = ns.MathRenderer.formatRichText(readout.innerHTML);
    }

    /* ------------------------------------------------------------------
       C. MODO DERIVADAS: Función Original, Derivada f'(x), Tangente, Secante y Normal
       ------------------------------------------------------------------ */
    else if (state.mode === 'derivatives') {
      // 1. Si está activo, trazar la curva derivada f'(x) en morado punteado
      if (state.showDerivCurve) {
        ctx.save();
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        let dPen = false;
        for (let px = 0; px <= width; px += 2) {
          const mx = toMathX(px);
          const dy = ns.MathParser.numericalDerivative(fn, mx);
          if (!isFinite(dy) || Math.abs(dy) > 1e4) {
            dPen = false;
            continue;
          }
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
        // 2. Trazar Recta Tangente en rojo/esmeralda
        ctx.save();
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        const xL = toMathX(0);
        const xR = toMathX(width);
        ctx.moveTo(0, toScreenY(y0 + slope * (xL - x0)));
        ctx.lineTo(width, toScreenY(y0 + slope * (xR - x0)));
        ctx.stroke();
        ctx.restore();

        // 3. Trazar Recta Normal perpendicular si está activada
        if (state.showNormalLine && Math.abs(slope) > 1e-5) {
          const mNormal = -1 / slope;
          ctx.save();
          ctx.strokeStyle = '#0D9488';
          ctx.lineWidth = 1.6;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, toScreenY(y0 + mNormal * (xL - x0)));
          ctx.lineTo(width, toScreenY(y0 + mNormal * (xR - x0)));
          ctx.stroke();
          ctx.restore();
        }

        // 4. Trazar Recta Secante si h > 0
        if (state.secantH > 0.01) {
          const x1 = x0 + state.secantH;
          const y1 = safeEval(fn, x1);
          if (isFinite(y1)) {
            const mSec = (y1 - y0) / state.secantH;
            ctx.save();
            ctx.strokeStyle = '#D97706';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.moveTo(0, toScreenY(y0 + mSec * (xL - x0)));
            ctx.lineTo(width, toScreenY(y0 + mSec * (xR - x0)));
            ctx.stroke();
            ctx.fillStyle = '#D97706';
            ctx.beginPath();
            ctx.arc(toScreenX(x1), toScreenY(y1), 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Punto de tangencia (x0, f(x0))
        ctx.fillStyle = '#DC2626';
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

      if (badge) badge.textContent = `x₀ = ${x0} | Pendiente m = ${ns.MathParser.formatNumber(slope, 3)}`;

      readout.innerHTML = ns.MathRenderer.formatRichText(`
        <div class="analysis-stat-box" style="border-left:3px solid #2563EB;">
          <strong>Punto en la Curva</strong>
          $(x_0, f(x_0)) = (${x0},\\; ${ns.MathParser.formatNumber(y0, 3)})$
        </div>
        <div class="analysis-stat-box" style="border-left:3px solid #DC2626;">
          <strong>Pendiente Instantánea $f'(x_0)$</strong>
          $m_{\\text{tan}} = f'(${x0}) = $ <b>${ns.MathParser.formatNumber(slope, 4)}</b>
        </div>
        <div class="analysis-stat-box" style="border-left:3px solid #7C3AED;">
          <strong>Recta Tangente en $x_0$</strong>
          $y = ${ns.MathParser.formatNumber(slope, 3)}x ${bStr}$
        </div>
        <div class="analysis-stat-box">
          <strong>Monotonía y Concavidad</strong>
          ${monotonia} · $f''(${x0}) \\approx ${ns.MathParser.formatNumber(secondDeriv, 2)}$
        </div>
      `);
    }

    /* ------------------------------------------------------------------
       D. Panel de Lectura para Integrales
       ------------------------------------------------------------------ */
    else if (state.mode === 'integrals') {
      const a = state.intA;
      const b = state.intB;
      const netIntegral = ns.MathParser.numericalIntegral(fn, a, b, 200);
      const posArea = ns.MathParser.numericalIntegral(x => Math.max(0, safeEval(fn, x) || 0), Math.min(a, b), Math.max(a, b), 200);
      const negArea = ns.MathParser.numericalIntegral(x => Math.max(0, -(safeEval(fn, x) || 0)), Math.min(a, b), Math.max(a, b), 200);
      const totalGeomArea = posArea + negArea;

      if (badge) badge.textContent = `Intervalo [${a}, ${b}] | Integral neta = ${ns.MathParser.formatNumber(netIntegral, 3)}`;

      readout.innerHTML = ns.MathRenderer.formatRichText(`
        <div class="analysis-stat-box" style="border-left:3px solid var(--primary-600);">
          <strong>Integral Definida Neta</strong>
          $\\int_{${a}}^{${b}} f(x)\\,dx = $ <b>${ns.MathParser.formatNumber(netIntegral, 4)}</b>
        </div>
        <div class="analysis-stat-box" style="border-left:3px solid #059669;">
          <strong>Área Positiva ($f(x) \\geq 0$)</strong>
          $A^+ = $ <b style="color:#047857;">+${ns.MathParser.formatNumber(posArea, 4)}</b>
        </div>
        <div class="analysis-stat-box" style="border-left:3px solid #DC2626;">
          <strong>Área Negativa ($f(x) < 0$)</strong>
          $A^- = $ <b style="color:#B91C1C;">-${ns.MathParser.formatNumber(negArea, 4)}</b>
        </div>
        <div class="analysis-stat-box">
          <strong>Área Geométrica Total ($A^+ + A^-$)</strong>
          $\\int_{${Math.min(a, b)}}^{${Math.max(a, b)}} |f(x)|\\,dx = $ <b>${ns.MathParser.formatNumber(totalGeomArea, 4)}</b>
        </div>
      `);
    }

    /* ------------------------------------------------------------------
       E. Modo General (Raíces, Factorización, Evaluación)
       ------------------------------------------------------------------ */
    else {
      const x0 = state.x0;
      const y0 = safeEval(fn, x0);
      const roots = ns.MathParser.findRoots(fn, -8, 8);

      // Dibujar raíces como puntos verdes sobre el eje X
      ctx.fillStyle = '#059669';
      roots.forEach(r => {
        ctx.beginPath();
        ctx.arc(toScreenX(r), oy, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isFinite(y0)) {
        ctx.fillStyle = '#1E40AF';
        ctx.beginPath();
        ctx.arc(toScreenX(x0), toScreenY(y0), 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (badge) badge.textContent = `x₀ = ${x0}, f(x₀) = ${ns.MathParser.formatNumber(y0, 3)}`;

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

    ctx.restore();
  }

  ns.LessonGraphs = {
    renderInteractiveWidget
  };
})(window.MatInteractiva);
