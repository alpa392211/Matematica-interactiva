/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Graficador Interactivo de Funciones (Canvas 2D)
   Archivo: js/tools/grapher.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

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
    dragStartY: 0
  };

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
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
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
            <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:0.65rem;">Funciones a Graficar</h3>
            <div style="display:flex; flex-direction:column; gap:0.55rem;" id="graph-fn-list">
              ${state.functions.map((fn, idx) => `
                <div class="function-input-row">
                  <input type="checkbox" data-fn-toggle="${idx}" ${fn.visible ? 'checked' : ''} title="Mostrar/Ocultar" />
                  <span class="fn-color-dot" style="background:${fn.color}"></span>
                  <span class="fn-label">${fn.label}</span>
                  <input type="text" class="fn-input" data-fn-expr="${idx}" value="${fn.expr}" placeholder="Ej: x^2 - 4" />
                </div>
              `).join('')}
            </div>
          </div>

          <div style="border-top:1px solid var(--border-light); padding-top:0.9rem;">
            <h3 style="font-size:0.92rem; font-weight:700; margin-bottom:0.55rem;">Análisis de Cálculo sobre f(x)</h3>
            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.84rem; margin-bottom:0.5rem; cursor:pointer;">
              <input type="checkbox" id="chk-show-deriv" ${state.showDerivative ? 'checked' : ''} />
              <span>${ns.MathRenderer.formatRichText('Trazar Recta Tangente en $x_0$:')}</span>
            </label>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.85rem;">
              <span style="font-family:var(--font-math); font-size:0.9rem;">x₀ =</span>
              <input type="number" step="0.1" id="inp-tangent-x" class="fn-input" value="${state.tangentX}" />
            </div>

            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.84rem; margin-bottom:0.5rem; cursor:pointer;">
              <input type="checkbox" id="chk-show-int" ${state.showIntegral ? 'checked' : ''} />
              <span>${ns.MathRenderer.formatRichText('Sombrear Integral Definida $\\int_a^b f(x)\\,dx$:')}</span>
            </label>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem;">
              <div>
                <small style="color:var(--text-muted);">Límite inf. (a)</small>
                <input type="number" step="0.5" id="inp-int-a" class="fn-input" style="width:100%;" value="${state.integralA}" />
              </div>
              <div>
                <small style="color:var(--text-muted);">Límite sup. (b)</small>
                <input type="number" step="0.5" id="inp-int-b" class="fn-input" style="width:100%;" value="${state.integralB}" />
              </div>
            </div>
          </div>

          <div style="border-top:1px solid var(--border-light); padding-top:0.9rem;">
            <h3 style="font-size:0.92rem; font-weight:700; margin-bottom:0.5rem;">Tabla de Valores de f(x)</h3>
            <div id="graph-table-box" style="max-height:190px; overflow-y:auto; font-size:0.8rem;"></div>
          </div>
        </div>

        <!-- Lienzo Cartesiano y Resultados -->
        <div class="grapher-canvas-card">
          <div class="grapher-toolbar">
            <div style="font-size:0.84rem; color:var(--text-muted);">
              💡 Arrastra el lienzo para desplazarte y usa la rueda del ratón para hacer zoom.
            </div>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn btn-outline btn-sm" id="btn-zoom-in">＋ Acercar</button>
              <button class="btn btn-outline btn-sm" id="btn-zoom-out">－ Alejar</button>
              <button class="btn btn-outline btn-sm" id="btn-reset-view">🎯 Centrar (0,0)</button>
            </div>
          </div>

          <div class="canvas-wrapper" id="graph-canvas-wrap">
            <canvas id="math-graph-canvas"></canvas>
            <div class="graph-coords-badge" id="graph-coords-badge">x: 0.00, y: 0.00</div>
          </div>

          <div class="graph-analysis-bar" id="graph-analysis-bar"></div>
        </div>
      </div>
    `;

    bindGrapherEvents(container);
    drawGraph();
    updateAnalysisAndTable();
  }

  function bindGrapherEvents(container) {
    // Presets
    container.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const expr = btn.getAttribute('data-preset');
        state.functions[0].expr = expr;
        state.functions[0].visible = true;
        state.centerX = 0;
        state.centerY = 0;
        state.scale = 42;
        const inp = container.querySelector('[data-fn-expr="0"]');
        if (inp) inp.value = expr;
        drawGraph();
        updateAnalysisAndTable();
      });
    });

    // Inputs de funciones
    container.querySelectorAll('[data-fn-expr]').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = Number(inp.getAttribute('data-fn-expr'));
        const rawVal = inp.value;
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

    // Botones de zoom y vista
    container.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
      state.scale = Math.min(250, state.scale * 1.25);
      drawGraph();
    });
    container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      state.scale = Math.max(10, state.scale / 1.25);
      drawGraph();
    });
    container.querySelector('#btn-reset-view')?.addEventListener('click', () => {
      state.centerX = 0;
      state.centerY = 0;
      state.scale = 42;
      drawGraph();
    });

    // Interacción con el Canvas (Arrastre, Rueda y Coordenadas)
    const canvas = container.querySelector('#math-graph-canvas');
    const badge = container.querySelector('#graph-coords-badge');
    if (!canvas) return;

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
        const mathX = state.centerX + (px - rect.width / 2) / state.scale;
        const mathY = state.centerY - (py - rect.height / 2) / state.scale;
        state.hoverMathX = mathX;
        state.hoverMathY = mathY;
        if (badge) {
          badge.textContent = `x: ${mathX.toFixed(2)}, y: ${mathY.toFixed(2)}`;
        }
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
      state.scale = Math.min(260, Math.max(8, state.scale * factor));
      drawGraph();
    }, { passive: false });

    // Gestos táctiles: un dedo desplaza, dos dedos hacen zoom (pellizco)
    let touchMode = null;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let lastPinchDist = 0;
    const pinchDistance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchMode = 'pan';
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        touchMode = 'pinch';
        lastPinchDist = pinchDistance(e.touches);
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (touchMode === 'pan' && e.touches.length === 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        state.centerX -= dx / state.scale;
        state.centerY += dy / state.scale;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        drawGraph();
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dist = pinchDistance(e.touches);
        if (lastPinchDist > 0) {
          state.scale = Math.min(260, Math.max(8, state.scale * (dist / lastPinchDist)));
        }
        lastPinchDist = dist;
        drawGraph();
      }
    }, { passive: false });

    const endTouch = () => { touchMode = null; };
    canvas.addEventListener('touchend', endTouch, { passive: true });
    canvas.addEventListener('touchcancel', endTouch, { passive: true });
  }

  // Redibujar el lienzo al girar el teléfono o cambiar el tamaño de la ventana
  let resizeFrame = null;
  window.addEventListener('resize', () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => drawGraph());
  });

  function drawGraph() {
    const canvas = document.getElementById('math-graph-canvas');
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 680;
    const height = rect.height || 480;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(dpr, dpr);

    // Fondo blanco limpio
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const toScreenX = (x) => width / 2 + (x - state.centerX) * state.scale;
    const toScreenY = (y) => height / 2 - (y - state.centerY) * state.scale;
    const toMathX = (px) => state.centerX + (px - width / 2) / state.scale;

    // Determinar paso de cuadrícula según nivel de zoom
    let gridStep = 1;
    if (state.scale < 20) gridStep = 5;
    else if (state.scale < 35) gridStep = 2;
    else if (state.scale > 95) gridStep = 0.5;

    const xMin = toMathX(0);
    const xMax = toMathX(width);
    const yMin = state.centerY - (height / 2) / state.scale;
    const yMax = state.centerY + (height / 2) / state.scale;

    // Cuadrícula secundaria y principal
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#F1F5F9';
    ctx.fillStyle = '#64748B';
    ctx.font = '11px Inter, sans-serif';

    const firstGridX = Math.floor(xMin / gridStep) * gridStep;
    for (let gx = firstGridX; gx <= xMax; gx += gridStep) {
      const sx = toScreenX(gx);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (Math.abs(gx) > 1e-6) {
        const axisY = Math.min(height - 16, Math.max(14, toScreenY(0) + 14));
        ctx.fillText(Number(gx.toFixed(2)).toString(), sx - 8, axisY);
      }
    }

    const firstGridY = Math.floor(yMin / gridStep) * gridStep;
    for (let gy = firstGridY; gy <= yMax; gy += gridStep) {
      const sy = toScreenY(gy);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (Math.abs(gy) > 1e-6) {
        const axisX = Math.min(width - 28, Math.max(6, toScreenX(0) + 6));
        ctx.fillText(Number(gy.toFixed(2)).toString(), axisX, sy + 4);
      }
    }

    // Ejes cartesianos X e Y
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#94A3B8';
    const originX = toScreenX(0);
    const originY = toScreenY(0);

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
        ctx.fillStyle = 'rgba(37, 99, 235, 0.16)';
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

    // 2. Trazar cada función activa
    for (const fnObj of state.functions) {
      if (!fnObj.visible || !fnObj.expr.trim()) continue;
      let compiled;
      try {
        compiled = ns.MathParser.compileFunction(fnObj.expr, 'RAD');
      } catch (_) {
        continue;
      }

      ctx.strokeStyle = fnObj.color;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let penDown = false;
      let prevY = null;

      for (let px = 0; px <= width; px += 1.5) {
        const mx = toMathX(px);
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
        ctx.strokeStyle = '#DC2626';
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
        ctx.fillStyle = isHole ? '#FFFFFF' : '#DC2626';
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(toScreenX(x0), toScreenY(y0), 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 4. Punto interactivo bajo el cursor sobre f(x)
    if (primaryFn && state.hoverMathX !== null) {
      const hx = state.hoverMathX;
      const hy = primaryFn(hx);
      if (isFinite(hy)) {
        const sx = toScreenX(hx);
        const sy = toScreenY(hy);
        if (sy >= 0 && sy <= height) {
          ctx.fillStyle = '#1E40AF';
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
          ctx.fill();
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
        evalDisplayHtml = `Lím<sub>x→${x0}</sub> = <b>${ns.MathParser.formatNumber(limAvg)}</b> <small style="color:var(--text-muted);">(0/0)</small>`;
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
        f'(${x0}) = <b style="color:var(--danger-600);">${ns.MathParser.formatNumber(dfx0)}</b>
      </div>
      <div class="analysis-stat-box">
        <strong>Integral ∫ f(x)dx en [${state.integralA}, ${state.integralB}]</strong>
        Área neta = <b style="color:var(--primary-700);">${ns.MathParser.formatNumber(areaVal)}</b>
      </div>
      <div class="analysis-stat-box">
        <strong>Raíces reales en [-10, 10]</strong>
        ${roots.length ? roots.map(r => `x ≈ ${r}`).join(', ') : 'Sin cortes detectados'}
      </div>
    `;

    // Generar tabla de valores alrededor de x = -3 a 3
    let rowsHtml = `
      <table style="width:100%; border-collapse:collapse; text-align:center;">
        <thead>
          <tr style="background:var(--primary-50); color:var(--primary-900);">
            <th style="padding:0.35rem; border-bottom:1px solid var(--border-light);">x</th>
            <th style="padding:0.35rem; border-bottom:1px solid var(--border-light);">f(x)</th>
            <th style="padding:0.35rem; border-bottom:1px solid var(--border-light);">f'(x)</th>
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
        <tr style="border-bottom:1px solid var(--border-light);">
          <td style="padding:0.3rem; font-weight:600;">${x}</td>
          <td style="padding:0.3rem; font-family:var(--font-mono);">${yCell}</td>
          <td style="padding:0.3rem; font-family:var(--font-mono); color:var(--text-muted);">${ns.MathParser.formatNumber(dy, 3)}</td>
        </tr>
      `;
    }
    rowsHtml += `</tbody></table>`;
    tableBox.innerHTML = rowsHtml;
  }

  ns.GrapherTool = {
    renderGrapherView,
    drawGraph
  };
})(window.MatInteractiva);
