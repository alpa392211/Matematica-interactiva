/* ==========================================================================
   MATETIC - Animaciones Demostrativas NO Interactivas
   Archivo: js/tools/demo-animations.js
   Componente puramente observacional (sin sliders, inputs ni arrastre):
   solo controles de Reproducir/Pausar, Reiniciar y barra de progreso.
   Separa el modelo numérico puro (evaluateAnimationModel) del renderizador
   Canvas 2D HD para permitir pruebas unitarias exactas con node --test.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const ANIMATION_CATALOG = {
    'lim-aprox-tabla': {
      id: 'lim-aprox-tabla',
      title: 'Aproximación Bilateral hacia un Límite y Hueco Removible',
      description: 'Observa cómo f(x) = (x² - 4)/(x - 2) se aproxima a L = 4 por izquierda (x → 2⁻) y por derecha (x → 2⁺), aunque f(2) no existe (hueco abierto en (2, 4)).',
      cycleDurationMs: 7500,
      pauseEndMs: 1800
    },
    'lim-salto-infinito': {
      id: 'lim-salto-infinito',
      title: 'Salto Finito vs. Divergencia Infinita',
      description: 'Comparativa entre un límite que no existe por salto finito (laterales distintos: -1 y +2) y una asíntota vertical donde 1/(x - 1)² → +∞.',
      cycleDurationMs: 7500,
      pauseEndMs: 1800
    },
    'lim-epsilon-banda': {
      id: 'lim-epsilon-banda',
      title: 'Definición ε-δ: Estrechamiento de la Banda de Tolerancia',
      description: 'Para lím_{x→2} (2x - 1) = 3, al exigir una banda vertical ε cada vez más pequeña alrededor de L = 3, existe una vecindad perforada δ(ε) = ε/2 que mantiene a f(x) dentro de la banda.',
      cycleDurationMs: 8000,
      pauseEndMs: 1800
    },
    'der-razon-promedio': {
      id: 'der-razon-promedio',
      title: 'Razón de Cambio Promedio en Intervalos Decrecientes',
      description: 'Sobre f(x) = 0.5x², observa cómo el incremento Δx desde x₀ = 1 se reduce paso a paso y la razón Δy/Δx converge hacia el valor instantáneo 1.',
      cycleDurationMs: 7200,
      pauseEndMs: 1800
    },
    'der-secante-tangente': {
      id: 'der-secante-tangente',
      title: 'Paso Geométrico de la Recta Secante a la Recta Tangente',
      description: 'Cuando h → 0, el punto Q(1+h, f(1+h)) se desliza por la curva hacia P(1, 0.5) y la recta secante gira hasta volverse tangente con pendiente f\'(1) = 1.',
      cycleDurationMs: 7500,
      pauseEndMs: 1800
    },
    'der-construccion-fprima': {
      id: 'der-construccion-fprima',
      title: 'Construcción de la Función Derivada f\'(x) a partir de Pendientes',
      description: 'Una tangente recorre la curva f(x) = sen(x) en el plano superior mientras en el plano inferior se va graficando la pendiente exacta f\'(x) = cos(x).',
      cycleDurationMs: 8500,
      pauseEndMs: 1800
    },
    'der-velocidad-instantanea': {
      id: 'der-velocidad-instantanea',
      title: 'Velocidad Instantánea desde Posición vs. Tiempo',
      description: 'Una partícula sigue s(t) = t² metros; la altura indica posición, mientras la pendiente local revela su velocidad instantánea v(t) = 2t m/s.',
      cycleDurationMs: 7500,
      pauseEndMs: 1800
    },
    'der-no-derivable': {
      id: 'der-no-derivable',
      title: 'Casos Continuos No Derivables: Punto Anguloso y Tangente Vertical',
      description: 'Izquierda: f(x) = |x| es continua en 0 pero sus pendientes laterales (-1 y +1) no coinciden. Derecha: f(x) = ∛x presenta tangente vertical con pendiente → +∞ en 0.',
      cycleDurationMs: 7800,
      pauseEndMs: 1800
    },
    'int-suma-riemann': {
      id: 'int-suma-riemann',
      title: 'Sumas de Riemann Convergiendo al Área Exacta',
      description: 'Aproximación de ∫₀² x² dx = 8/3 ≈ 2.6667 aumentando el número de subintervalos n = 2, 4, 8, 16, 32, 64.',
      cycleDurationMs: 8000,
      pauseEndMs: 2000
    }
  };

  function clamp01(t) {
    const n = Number(t);
    if (!isFinite(n)) return 0;
    return Math.max(0, Math.min(1, n));
  }

  function fmt(num, digits = 3) {
    const rounded = Math.abs(num) < 1e-12 ? 0 : num;
    return Number(rounded).toFixed(digits);
  }

  /**
   * Evalúa únicamente el modelo matemático de cualquier animación demostrativa
   * en el instante normalizado t ∈ [0, 1]. Sin acceso a DOM para permitir tests.
   */
  function evaluateAnimationModel(modelId, rawT) {
    const t = clamp01(rawT);
    const meta = ANIMATION_CATALOG[modelId];
    if (!meta) return null;

    if (modelId === 'lim-aprox-tabla') {
      // Distancia delta decrece de 0.9 a 0.001 logarítmicamente
      const delta = 0.9 * Math.pow(0.001 / 0.9, t);
      const xLeft = 2 - delta;
      const xRight = 2 + delta;
      const yLeft = (xLeft * xLeft - 4) / (xLeft - 2);
      const yRight = (xRight * xRight - 4) / (xRight - 2);
      const allRows = [
        { stage: 0, side: 'Izq (2⁻)', x: '1.500', y: fmt((1.5 * 1.5 - 4) / (1.5 - 2), 4) },
        { stage: 0.25, side: 'Der (2⁺)', x: '2.500', y: fmt((2.5 * 2.5 - 4) / (2.5 - 2), 4) },
        { stage: 0.45, side: 'Izq (2⁻)', x: '1.900', y: fmt((1.9 * 1.9 - 4) / (1.9 - 2), 4) },
        { stage: 0.60, side: 'Der (2⁺)', x: '2.100', y: fmt((2.1 * 2.1 - 4) / (2.1 - 2), 4) },
        { stage: 0.78, side: 'Izq (2⁻)', x: '1.999', y: fmt((1.999 * 1.999 - 4) / (1.999 - 2), 4) },
        { stage: 0.90, side: 'Der (2⁺)', x: '2.001', y: fmt((2.001 * 2.001 - 4) / (2.001 - 2), 4) }
      ];
      const visibleRows = allRows.filter(r => t >= r.stage);
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `x⁻ = ${fmt(xLeft, 3)} → f = ${fmt(yLeft, 3)}   |   x⁺ = ${fmt(xRight, 3)} → f = ${fmt(yRight, 3)}   (Lím = 4, hueco en x = 2)`,
        readoutItems: [
          { label: 'Por izquierda (x → 2⁻)', value: `x = ${fmt(xLeft, 3)} ⇒ f(x) = ${fmt(yLeft, 3)}` },
          { label: 'Por derecha (x → 2⁺)', value: `x = ${fmt(xRight, 3)} ⇒ f(x) = ${fmt(yRight, 3)}` },
          { label: 'Conclusión', value: 'lím = 4 (hueco abierto en x = 2)' }
        ],
        tableHeaders: ['Aprox.', 'x', 'f(x) = (x²-4)/(x-2)'],
        tableRows: visibleRows.map(r => [r.side, r.x, r.y]),
        plotData: { xLeft, yLeft, xRight, yRight, holeX: 2, holeY: 4 }
      };
    }

    if (modelId === 'lim-salto-infinito') {
      const dist = 0.85 * (1 - t * 0.94);
      const jumpLeftX = 0 - dist;
      const jumpRightX = 0 + dist;
      const jumpLeftY = -1 - 0.35 * dist;
      const jumpRightY = 2 + 0.4 * dist;
      // Mantener el punto móvil estrictamente dentro del rango visible y <= 15 de la gráfica
      const asymX = 1 - Math.max(0.27, dist * 0.85);
      const asymY = 1 / ((asymX - 1) * (asymX - 1));
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `Salto: f(${fmt(jumpLeftX, 2)}) = ${fmt(jumpLeftY, 2)} vs f(${fmt(jumpRightX, 2)}) = ${fmt(jumpRightY, 2)} | Asíntota en x→1: f = ${fmt(asymY, 2)} → +∞`,
        readoutItems: [
          { label: 'Salto finito (x = 0)', value: `lím⁻ = -1 ≠ lím⁺ = +2 ⇒ ∄ lím` },
          { label: 'Asíntota en x = 1', value: `f(${fmt(asymX, 2)}) = ${fmt(asymY, 2)} (diverge a +∞)` }
        ],
        tableHeaders: ['Fenómeno', 'Tendencia', 'Resultado'],
        tableRows: [
          ['Salto finito', `x = ${fmt(jumpLeftX, 2)} (izq)`, `${fmt(jumpLeftY, 2)} → -1`],
          ['Salto finito', `x = ${fmt(jumpRightX, 2)} (der)`, `${fmt(jumpRightY, 2)} → +2`],
          ['Divergencia', `x = ${fmt(asymX, 2)} → 1`, `${fmt(asymY, 2)} → +∞`]
        ],
        plotData: { jumpLeftX, jumpLeftY, jumpRightX, jumpRightY, asymX, asymY }
      };
    }

    if (modelId === 'lim-epsilon-banda') {
      const steps = [0.9, 0.6, 0.35, 0.18, 0.1];
      const stepIdx = Math.min(steps.length - 1, Math.floor(t * steps.length));
      const eps = 0.9 - (0.9 - 0.1) * t;
      const delta = eps / 2; // para f(x) = 2x - 1 con pendiente 2
      const a = 2;
      const L = 3;
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `Reto ε = ${fmt(eps, 2)} alrededor de L = 3 ⇒ basta elegir δ(ε) = ε/2 = ${fmt(delta, 2)} alrededor de a = 2`,
        readoutItems: [
          { label: 'Tolerancia vertical ε', value: `ε = ${fmt(eps, 2)} ⇒ (${fmt(L - eps, 2)}, ${fmt(L + eps, 2)})` },
          { label: 'Radio horizontal δ(ε)', value: `δ = ${fmt(delta, 2)} ⇒ (${fmt(a - delta, 2)}, ${fmt(a + delta, 2)})` }
        ],
        tableHeaders: ['Etapa', 'ε elegido', 'δ(ε) = ε/2'],
        tableRows: steps.slice(0, stepIdx + 1).map((eVal, i) => [`#${i + 1}`, fmt(eVal, 2), fmt(eVal / 2, 3)]),
        plotData: { a, L, eps, delta }
      };
    }

    if (modelId === 'der-razon-promedio') {
      const dx = 2.0 * Math.pow(0.05 / 2.0, t);
      const x0 = 1;
      const y0 = 0.5 * x0 * x0;
      const x1 = x0 + dx;
      const y1 = 0.5 * x1 * x1;
      const dy = y1 - y0;
      const avgRate = dy / dx;
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `Intervalo [1, ${fmt(x1, 2)}] (Δx = ${fmt(dx, 2)}) ⇒ Δy/Δx = ${fmt(dy, 3)} / ${fmt(dx, 2)} = ${fmt(avgRate, 3)}`,
        readoutItems: [
          { label: 'Incremento Δx', value: fmt(dx, 3) },
          { label: 'Cambio Δy', value: fmt(dy, 3) },
          { label: 'Razón promedio Δy/Δx', value: `${fmt(avgRate, 3)} (tiende a f'(1) = 1)` }
        ],
        tableHeaders: ['Intervalo [1, 1+Δx]', 'Δx', 'Δy / Δx'],
        tableRows: [
          ['[1, 3.00]', '2.00', '2.000'],
          ['[1, 2.00]', '1.00', '1.500'],
          ['[1, 1.40]', '0.40', '1.200'],
          [`[1, ${fmt(x1, 2)}]`, fmt(dx, 2), fmt(avgRate, 3)]
        ].filter((_, i) => i < 1 + Math.floor(t * 3.5)),
        plotData: { x0, y0, x1, y1, dx, dy, avgRate }
      };
    }

    if (modelId === 'der-secante-tangente') {
      const h = 1.6 * (1 - t);
      const x0 = 1;
      const y0 = 0.5 * x0 * x0;
      const x1 = x0 + h;
      const y1 = 0.5 * x1 * x1;
      const mSec = h > 1e-4 ? (y1 - y0) / h : x0;
      const mTan = x0; // f'(x) = x => f'(1) = 1
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: h > 0.02
          ? `h = ${fmt(h, 2)} → Q(${fmt(x1, 2)}, ${fmt(y1, 2)}) → pendiente secante m_sec = ${fmt(mSec, 3)}`
          : `Límite h → 0 alcanzado: la recta secante coincide con la tangente (m_t = f'(1) = ${fmt(mTan, 2)})`,
        readoutItems: [
          { label: 'Incremento h', value: fmt(h, 3) },
          { label: 'Pendiente secante', value: fmt(mSec, 3) },
          { label: 'Pendiente tangente f\'(1)', value: fmt(mTan, 3) }
        ],
        tableHeaders: ['h', 'f(1+h)', 'm_sec = [f(1+h)-f(1)]/h'],
        tableRows: [1.6, 1.0, 0.5, 0.1, 0]
          .filter((_, idx) => t >= idx * 0.22)
          .map(hVal => {
            if (hVal === 0) return ['h → 0', '0.500', '1.000 (Tangente)'];
            const yh = 0.5 * (1 + hVal) * (1 + hVal);
            return [fmt(hVal, 2), fmt(yh, 3), fmt((yh - 0.5) / hVal, 3)];
          }),
        plotData: { x0, y0, x1, y1, h, mSec, mTan }
      };
    }

    if (modelId === 'der-construccion-fprima') {
      const xMin = -3.14;
      const xMax = 3.14;
      const xCur = xMin + (xMax - xMin) * t;
      const fx = Math.sin(xCur);
      const dfx = Math.cos(xCur);
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `En x = ${fmt(xCur, 2)} rad: altura f(x) = sen(x) = ${fmt(fx, 2)} | pendiente tangente f'(x) = cos(x) = ${fmt(dfx, 2)}`,
        readoutItems: [
          { label: 'Posición x', value: `${fmt(xCur, 2)} rad` },
          { label: 'Curva f(x) = sen(x)', value: fmt(fx, 3) },
          { label: 'Pendiente trazada f\'(x)', value: fmt(dfx, 3) }
        ],
        tableHeaders: ['x (rad)', 'f(x) = sen(x)', 'f\'(x) = pendiente'],
        tableRows: [-3.14, -1.57, 0, 1.57, 3.14]
          .filter(xv => xv <= xCur + 0.05)
          .map(xv => [fmt(xv, 2), fmt(Math.sin(xv), 2), fmt(Math.cos(xv), 2)]),
        plotData: { xMin, xMax, xCur, fx, dfx }
      };
    }

    if (modelId === 'der-velocidad-instantanea') {
      const timeSec = 3.0 * t;
      const posM = timeSec * timeSec;
      const velMs = 2 * timeSec;
      const avgSinceZero = timeSec > 0.01 ? posM / timeSec : 0;
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `t = ${fmt(timeSec, 2)} s → Posición s(t) = ${fmt(posM, 2)} m | Velocidad instantánea v(t) = s'(t) = ${fmt(velMs, 2)} m/s`,
        readoutItems: [
          { label: 'Tiempo transcurrido t', value: `${fmt(timeSec, 2)} s` },
          { label: 'Posición s(t) = t²', value: `${fmt(posM, 2)} m` },
          { label: 'Velocidad instantánea s\'(t)', value: `${fmt(velMs, 2)} m/s` },
          { label: 'Velocidad media en [0, t]', value: `${fmt(avgSinceZero, 2)} m/s` }
        ],
        tableHeaders: ['t (s)', 's(t) (m)', 'v_inst = 2t (m/s)'],
        tableRows: [0, 1, 2, 3]
          .filter(ts => ts <= timeSec + 0.05)
          .map(ts => [fmt(ts, 1), fmt(ts * ts, 1), fmt(2 * ts, 1)]),
        plotData: { timeSec, posM, velMs }
      };
    }

    if (modelId === 'der-no-derivable') {
      const h = 0.9 * (1 - t * 0.96);
      const slopeLeftAbs = -1;
      const slopeRightAbs = 1;
      const slopeCbrt = Math.cbrt(h) / h; // = h^(-2/3) -> +inf
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `h = ${fmt(h, 2)}: en |x|, derivadas laterales -1 ≠ +1 (pico); en ∛x, pendiente secante = ${fmt(slopeCbrt, 2)} → +∞ (tangente vertical)`,
        readoutItems: [
          { label: '|x| en x = 0 (pico)', value: `f'₋(0) = -1 ≠ f'₊(0) = +1` },
          { label: '∛x en x = 0 (tang. vertical)', value: `Cociente en h = ${fmt(h, 2)}: ${fmt(slopeCbrt, 2)} → +∞` }
        ],
        tableHeaders: ['Caso en x = 0', 'h', 'Cociente incremental'],
        tableRows: [
          ['|x| por izquierda', `-${fmt(h, 2)}`, fmt(slopeLeftAbs, 2)],
          ['|x| por derecha', `+${fmt(h, 2)}`, `+${fmt(slopeRightAbs, 2)}`],
          ['∛x simétrico', `±${fmt(h, 2)}`, `${fmt(slopeCbrt, 2)} → +∞`]
        ],
        plotData: { h, slopeLeftAbs, slopeRightAbs, slopeCbrt }
      };
    }

    if (modelId === 'int-suma-riemann') {
      const nChoices = [2, 4, 8, 16, 32, 64];
      const idx = Math.min(nChoices.length - 1, Math.floor(t * nChoices.length));
      const n = nChoices[idx];
      const a = 0;
      const b = 2;
      const dx = (b - a) / n;
      // Suma de Riemann por punto derecho de f(x) = x^2 en [0, 2]
      let riemannRight = 0;
      let riemannMid = 0;
      for (let i = 1; i <= n; i++) {
        const xr = a + i * dx;
        const xm = a + (i - 0.5) * dx;
        riemannRight += xr * xr * dx;
        riemannMid += xm * xm * dx;
      }
      const exact = 8 / 3;
      const errMid = Math.abs(exact - riemannMid);
      return {
        id: modelId,
        t,
        title: meta.title,
        subtitle: `n = ${n} rectángulos (Δx = ${fmt(dx, 3)}) → Suma derecha = ${fmt(riemannRight, 4)} | Punto medio = ${fmt(riemannMid, 4)} (Exacta: 2.6667)`,
        readoutItems: [
          { label: 'Subintervalos n', value: `${n} (Δx = ${fmt(dx, 3)})` },
          { label: 'Suma de Riemann (der.)', value: fmt(riemannRight, 4) },
          { label: 'Suma punto medio', value: fmt(riemannMid, 4) },
          { label: 'Integral exacta ∫₀² x² dx', value: `${fmt(exact, 4)} (error medio: ${fmt(errMid, 4)})` }
        ],
        tableHeaders: ['n', 'Δx = 2/n', 'Suma derecha', 'Punto medio'],
        tableRows: nChoices.slice(0, idx + 1).map(nv => {
          const d = 2 / nv;
          let sr = 0;
          let sm = 0;
          for (let k = 1; k <= nv; k++) {
            sr += (k * d) ** 2 * d;
            sm += ((k - 0.5) * d) ** 2 * d;
          }
          return [String(nv), fmt(d, 3), fmt(sr, 4), fmt(sm, 4)];
        }),
        plotData: { a, b, n, dx, riemannRight, riemannMid, exact }
      };
    }

    return null;
  }

  /* ------------------------------------------------------------------------
     Helpers de Renderizado en Canvas 2D (Adaptados a Claro / Oscuro)
     ------------------------------------------------------------------------ */
  function getCanvasPalette() {
    const explicit = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
    const isDark = explicit === 'dark' ||
      (!explicit && typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      return {
        bg: '#0b1220',
        grid: 'rgba(148, 163, 184, 0.14)',
        axis: 'rgba(203, 213, 225, 0.55)',
        text: '#e2e8f0',
        muted: '#94a3b8',
        primary: '#60a5fa',
        secondary: '#34d399',
        accent: '#f87171',
        amber: '#fbbf24',
        fillSoft: 'rgba(96, 165, 250, 0.18)',
        bandGreen: 'rgba(52, 211, 153, 0.16)',
        bandBlue: 'rgba(96, 165, 250, 0.16)',
        holeFill: '#0b1220'
      };
    }
    return {
      bg: '#ffffff',
      grid: 'rgba(148, 163, 184, 0.24)',
      axis: '#475569',
      text: '#0f172a',
      muted: '#64748b',
      primary: '#2563eb',
      secondary: '#059669',
      accent: '#dc2626',
      amber: '#d97706',
      fillSoft: 'rgba(37, 99, 235, 0.16)',
      bandGreen: 'rgba(16, 185, 129, 0.15)',
      bandBlue: 'rgba(37, 99, 235, 0.15)',
      holeFill: '#ffffff'
    };
  }

  function mapBox(x, y, xMin, xMax, yMin, yMax, rect) {
    return {
      px: rect.x + ((x - xMin) / (xMax - xMin)) * rect.w,
      py: rect.y + rect.h - ((y - yMin) / (yMax - yMin)) * rect.h
    };
  }

  function drawAxesInRect(ctx, rect, xMin, xMax, yMin, yMax, pal) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();

    // Cuadrícula suave
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
      const p = mapBox(gx, 0, xMin, xMax, yMin, yMax, rect);
      ctx.beginPath();
      ctx.moveTo(p.px, rect.y);
      ctx.lineTo(p.px, rect.y + rect.h);
      ctx.stroke();
    }
    for (let gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy++) {
      const p = mapBox(0, gy, xMin, xMax, yMin, yMax, rect);
      ctx.beginPath();
      ctx.moveTo(rect.x, p.py);
      ctx.lineTo(rect.x + rect.w, p.py);
      ctx.stroke();
    }

    // Ejes X e Y
    ctx.strokeStyle = pal.axis;
    ctx.lineWidth = 1.5;
    if (yMin <= 0 && yMax >= 0) {
      const p0 = mapBox(0, 0, xMin, xMax, yMin, yMax, rect);
      ctx.beginPath();
      ctx.moveTo(rect.x, p0.py);
      ctx.lineTo(rect.x + rect.w, p0.py);
      ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
      const p0 = mapBox(0, 0, xMin, xMax, yMin, yMax, rect);
      ctx.beginPath();
      ctx.moveTo(p0.px, rect.y);
      ctx.lineTo(p0.px, rect.y + rect.h);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Traza una curva manteniendo fijo el sistema de coordenadas [xMin, xMax] × [yMin, yMax]
   * y evaluando únicamente sobre el subdominio [evalMin, evalMax].
   */
  function plotCurveInRect(ctx, rect, xMin, xMax, yMin, yMax, fn, color, lineWidth = 2.4, gapAtX = null, evalMin = xMin, evalMax = xMax) {
    if (evalMax <= evalMin) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    let started = false;
    let prevY = null;
    const steps = 180;
    const ySpan = Math.max(1, yMax - yMin);
    const gapRadius = ((xMax - xMin) / steps) * 1.4;

    for (let i = 0; i <= steps; i++) {
      const x = evalMin + (i / steps) * (evalMax - evalMin);
      if (gapAtX !== null && Math.abs(x - gapAtX) < gapRadius) {
        started = false;
        prevY = null;
        continue;
      }
      const y = fn(x);
      if (!isFinite(y) || y < yMin - ySpan * 4 || y > yMax + ySpan * 4) {
        started = false;
        prevY = null;
        continue;
      }
      if (prevY !== null && Math.abs(y - prevY) > ySpan * 2.5) {
        started = false;
      }
      const p = mapBox(x, y, xMin, xMax, yMin, yMax, rect);
      if (!started) {
        ctx.moveTo(p.px, p.py);
        started = true;
      } else {
        ctx.lineTo(p.px, p.py);
      }
      prevY = y;
    }
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Traza un segmento recto exacto entre (x1, y1) y (x2, y2) en el sistema [xMin, xMax] × [yMin, yMax].
   * Garantiza alineación exacta de rectas tangentes y secantes con sus puntos de contacto.
   */
  function drawLineSegmentInRect(ctx, rect, xMin, xMax, yMin, yMax, x1, y1, x2, y2, color, lineWidth = 2.2, dash = null) {
    if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();
    if (Array.isArray(dash) && dash.length && typeof ctx.setLineDash === 'function') {
      ctx.setLineDash(dash);
    }
    const p1 = mapBox(x1, y1, xMin, xMax, yMin, yMax, rect);
    const p2 = mapBox(x2, y2, xMin, xMax, yMin, yMax, rect);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(p1.px, p1.py);
    ctx.lineTo(p2.px, p2.py);
    ctx.stroke();
    ctx.restore();
  }

  function drawClampedLabel(ctx, text, desiredX, desiredY, rect, color, font = '600 12px system-ui, sans-serif', bgPlateColor = null) {
    ctx.save();
    ctx.font = font;
    const measured = typeof ctx.measureText === 'function' ? ctx.measureText(text).width : text.length * 6.5;
    const minX = rect.x + 4;
    const maxX = Math.max(minX, rect.x + rect.w - measured - 4);
    const x = Math.max(minX, Math.min(maxX, desiredX));
    const y = Math.max(rect.y + 13, Math.min(rect.y + rect.h - 4, desiredY));
    if (bgPlateColor && typeof ctx.fillRect === 'function') {
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = bgPlateColor;
      ctx.fillRect(x - 3, y - 11, measured + 6, 15);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawPoint(ctx, px, py, fill, stroke = null, radius = 5.5) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawModelFrame(canvas, model) {
    if (!canvas || !model) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const pal = getCanvasPalette();

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);

    const pad = 16;
    const fullRect = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
    const pd = model.plotData;

    if (model.id === 'lim-aprox-tabla') {
      const [xMin, xMax, yMin, yMax] = [-0.5, 4.5, -0.5, 6.5];
      drawAxesInRect(ctx, fullRect, xMin, xMax, yMin, yMax, pal);
      plotCurveInRect(ctx, fullRect, xMin, xMax, yMin, yMax, x => x + 2, pal.primary, 2.5, 2);

      // Guías al punto límite (2, 4)
      const pLim = mapBox(2, 4, xMin, xMax, yMin, yMax, fullRect);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.muted;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pLim.px, fullRect.y + fullRect.h);
      ctx.lineTo(pLim.px, pLim.py);
      ctx.lineTo(fullRect.x, pLim.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Hueco abierto en (2, 4)
      drawPoint(ctx, pLim.px, pLim.py, pal.holeFill, pal.primary, 6);

      // Puntos izquierdo y derecho acercándose
      const pL = mapBox(pd.xLeft, pd.yLeft, xMin, xMax, yMin, yMax, fullRect);
      const pR = mapBox(pd.xRight, pd.yRight, xMin, xMax, yMin, yMax, fullRect);
      drawPoint(ctx, pL.px, pL.py, pal.secondary, '#ffffff', 5.5);
      drawPoint(ctx, pR.px, pR.py, pal.amber, '#ffffff', 5.5);

      drawClampedLabel(ctx, 'L = 4 (hueco x = 2)', pLim.px + 10, pLim.py - 8, fullRect, pal.text, '600 12px system-ui, sans-serif', pal.bg);
    } else if (model.id === 'lim-salto-infinito') {
      const leftRect = { x: pad, y: pad, w: (w - pad * 3) / 2, h: h - pad * 2 };
      const rightRect = { x: pad * 2 + leftRect.w, y: pad, w: leftRect.w, h: h - pad * 2 };
      const titleFont = `700 ${w < 330 ? 10.5 : 12}px system-ui, sans-serif`;

      // Panel izquierdo: Salto finito en x = 0 (sistema fijo [-2.5, 2.5])
      drawAxesInRect(ctx, leftRect, -2.5, 2.5, -2.5, 3.5, pal);
      plotCurveInRect(ctx, leftRect, -2.5, 2.5, -2.5, 3.5, x => -1 + 0.35 * x, pal.primary, 2.4, null, -2.5, -0.02);
      plotCurveInRect(ctx, leftRect, -2.5, 2.5, -2.5, 3.5, x => 2 + 0.4 * x, pal.primary, 2.4, null, 0.02, 2.5);
      const pHoleL = mapBox(0, -1, -2.5, 2.5, -2.5, 3.5, leftRect);
      const pHoleR = mapBox(0, 2, -2.5, 2.5, -2.5, 3.5, leftRect);
      drawPoint(ctx, pHoleL.px, pHoleL.py, pal.holeFill, pal.primary, 5);
      drawPoint(ctx, pHoleR.px, pHoleR.py, pal.primary, '#ffffff', 5);
      const pJL = mapBox(pd.jumpLeftX, pd.jumpLeftY, -2.5, 2.5, -2.5, 3.5, leftRect);
      const pJR = mapBox(pd.jumpRightX, pd.jumpRightY, -2.5, 2.5, -2.5, 3.5, leftRect);
      drawPoint(ctx, pJL.px, pJL.py, pal.secondary, '#ffffff', 5);
      drawPoint(ctx, pJR.px, pJR.py, pal.accent, '#ffffff', 5);
      drawClampedLabel(ctx, 'Salto (x = 0)', leftRect.x + 6, leftRect.y + 14, leftRect, pal.text, titleFont, pal.bg);

      // Panel derecho: Asíntota vertical 1/(x-1)² en [-1, 3] × [-1, 15]
      drawAxesInRect(ctx, rightRect, -1, 3, -1, 15, pal);
      drawLineSegmentInRect(ctx, rightRect, -1, 3, -1, 15, 1, -1, 1, 15, pal.accent, 1.5, [4, 4]);
      plotCurveInRect(ctx, rightRect, -1, 3, -1, 15, x => 1 / ((x - 1) * (x - 1)), pal.primary, 2.4, 1);
      const pAsymPt = mapBox(pd.asymX, pd.asymY, -1, 3, -1, 15, rightRect);
      drawPoint(ctx, pAsymPt.px, pAsymPt.py, pal.amber, '#ffffff', 5.5);
      drawClampedLabel(ctx, 'Asíntota x = 1 → +∞', rightRect.x + 6, rightRect.y + 14, rightRect, pal.text, titleFont, pal.bg);
    } else if (model.id === 'lim-epsilon-banda') {
      const [xMin, xMax, yMin, yMax] = [0.2, 3.8, 0, 5.8];
      drawAxesInRect(ctx, fullRect, xMin, xMax, yMin, yMax, pal);

      // Banda vertical (a - delta, a + delta)
      const xL = mapBox(pd.a - pd.delta, 0, xMin, xMax, yMin, yMax, fullRect);
      const xR = mapBox(pd.a + pd.delta, 0, xMin, xMax, yMin, yMax, fullRect);
      ctx.fillStyle = pal.bandBlue;
      ctx.fillRect(xL.px, fullRect.y, xR.px - xL.px, fullRect.h);

      // Banda horizontal (L - eps, L + eps)
      const yTop = mapBox(0, pd.L + pd.eps, xMin, xMax, yMin, yMax, fullRect);
      const yBot = mapBox(0, pd.L - pd.eps, xMin, xMax, yMin, yMax, fullRect);
      ctx.fillStyle = pal.bandGreen;
      ctx.fillRect(fullRect.x, yTop.py, fullRect.w, yBot.py - yTop.py);

      // Recta f(x) = 2x - 1
      drawLineSegmentInRect(ctx, fullRect, xMin, xMax, yMin, yMax, xMin, 2 * xMin - 1, xMax, 2 * xMax - 1, pal.primary, 2.6);
      const pCenter = mapBox(pd.a, pd.L, xMin, xMax, yMin, yMax, fullRect);
      drawPoint(ctx, pCenter.px, pCenter.py, pal.secondary, '#ffffff', 5.5);

      drawClampedLabel(ctx, `ε = ${fmt(pd.eps, 2)}`, fullRect.x + 8, yTop.py - 5, fullRect, pal.text, '700 12px system-ui, sans-serif');
      drawClampedLabel(ctx, `δ = ${fmt(pd.delta, 2)}`, xR.px + 5, fullRect.y + 18, fullRect, pal.text, '700 12px system-ui, sans-serif');
    } else if (model.id === 'der-razon-promedio' || model.id === 'der-secante-tangente') {
      const [xMin, xMax, yMin, yMax] = [-0.6, 3.6, -0.4, 5.2];
      drawAxesInRect(ctx, fullRect, xMin, xMax, yMin, yMax, pal);
      plotCurveInRect(ctx, fullRect, xMin, xMax, yMin, yMax, x => 0.5 * x * x, pal.primary, 2.6);

      const p0 = mapBox(pd.x0, pd.y0, xMin, xMax, yMin, yMax, fullRect);
      if (model.id === 'der-razon-promedio') {
        const p1 = mapBox(pd.x1, pd.y1, xMin, xMax, yMin, yMax, fullRect);
        const pCorner = mapBox(pd.x1, pd.y0, xMin, xMax, yMin, yMax, fullRect);
        ctx.strokeStyle = pal.secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p0.px, p0.py);
        ctx.lineTo(pCorner.px, pCorner.py);
        ctx.lineTo(p1.px, p1.py);
        ctx.stroke();

        drawLineSegmentInRect(ctx, fullRect, xMin, xMax, yMin, yMax, pd.x0, pd.y0, pd.x1, pd.y1, pal.accent, 2.4);
        drawPoint(ctx, p0.px, p0.py, pal.primary, '#ffffff', 5);
        drawPoint(ctx, p1.px, p1.py, pal.amber, '#ffffff', 5);
      } else {
        // Tangente verdadera en x0 = 1 y secante móvil pasando exactamente por P y Q
        drawLineSegmentInRect(
          ctx, fullRect, xMin, xMax, yMin, yMax,
          xMin, pd.y0 + pd.mTan * (xMin - pd.x0),
          xMax, pd.y0 + pd.mTan * (xMax - pd.x0),
          pal.secondary, 1.9
        );
        drawLineSegmentInRect(
          ctx, fullRect, xMin, xMax, yMin, yMax,
          xMin, pd.y0 + pd.mSec * (xMin - pd.x0),
          xMax, pd.y0 + pd.mSec * (xMax - pd.x0),
          pal.accent, 2.4
        );
        drawPoint(ctx, p0.px, p0.py, pal.secondary, '#ffffff', 5.5);
        if (pd.h > 0.02) {
          const p1 = mapBox(pd.x1, pd.y1, xMin, xMax, yMin, yMax, fullRect);
          drawPoint(ctx, p1.px, p1.py, pal.accent, '#ffffff', 5);
        }
      }
    } else if (model.id === 'der-construccion-fprima') {
      const topRect = { x: pad, y: pad, w: w - pad * 2, h: (h - pad * 3) / 2 };
      const botRect = { x: pad, y: pad * 2 + topRect.h, w: w - pad * 2, h: topRect.h };
      const [xMin, xMax, yMin, yMax] = [pd.xMin, pd.xMax, -1.4, 1.4];
      const titleFont = `700 ${w < 330 ? 11 : 12}px system-ui, sans-serif`;

      drawAxesInRect(ctx, topRect, xMin, xMax, yMin, yMax, pal);
      plotCurveInRect(ctx, topRect, xMin, xMax, yMin, yMax, x => Math.sin(x), pal.primary, 2.4);

      // Guía vertical alineada entre xCur superior e inferior
      drawLineSegmentInRect(ctx, topRect, xMin, xMax, yMin, yMax, pd.xCur, yMin, pd.xCur, yMax, pal.muted, 1.1, [3, 3]);

      // Tangente deslizante local centrada exactamente en (xCur, fx)
      const tanSpan = 0.85;
      const tX1 = pd.xCur - tanSpan;
      const tX2 = pd.xCur + tanSpan;
      drawLineSegmentInRect(
        ctx, topRect, xMin, xMax, yMin, yMax,
        tX1, pd.fx + pd.dfx * (tX1 - pd.xCur),
        tX2, pd.fx + pd.dfx * (tX2 - pd.xCur),
        pal.accent, 2.4
      );
      const pTop = mapBox(pd.xCur, pd.fx, xMin, xMax, yMin, yMax, topRect);
      drawPoint(ctx, pTop.px, pTop.py, pal.accent, '#ffffff', 5);
      drawClampedLabel(ctx, 'f(x) = sen(x) con tangente móvil', topRect.x + 8, topRect.y + 14, topRect, pal.text, titleFont, pal.bg);

      drawAxesInRect(ctx, botRect, xMin, xMax, yMin, yMax, pal);
      // Curva completa tenue de referencia + trazo acumulado exacto hasta xCur
      plotCurveInRect(ctx, botRect, xMin, xMax, yMin, yMax, x => Math.cos(x), pal.grid, 1.5);
      drawLineSegmentInRect(ctx, botRect, xMin, xMax, yMin, yMax, pd.xCur, yMin, pd.xCur, yMax, pal.muted, 1.1, [3, 3]);
      if (pd.xCur > xMin + 1e-4) {
        plotCurveInRect(ctx, botRect, xMin, xMax, yMin, yMax, x => Math.cos(x), pal.secondary, 2.6, null, xMin, pd.xCur);
      }
      const pBot = mapBox(pd.xCur, pd.dfx, xMin, xMax, yMin, yMax, botRect);
      drawPoint(ctx, pBot.px, pBot.py, pal.secondary, '#ffffff', 5);
      drawClampedLabel(ctx, "f'(x) = cos(x) trazada desde la pendiente", botRect.x + 8, botRect.y + 14, botRect, pal.text, titleFont, pal.bg);
    } else if (model.id === 'der-velocidad-instantanea') {
      const trackY = pad + 24;
      const graphRect = { x: pad, y: pad + 40, w: w - pad * 2, h: h - pad * 2 - 40 };
      const [xMin, xMax, yMin, yMax] = [-0.2, 3.2, -0.5, 9.5];

      // Pista lineal superior s(t) de 0 a 9 m
      ctx.strokeStyle = pal.axis;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pad + 12, trackY);
      ctx.lineTo(w - pad - 12, trackY);
      ctx.stroke();
      const partX = pad + 12 + (pd.posM / 9) * (w - pad * 2 - 24);
      drawPoint(ctx, partX, trackY, pal.accent, '#ffffff', 6.5);
      drawClampedLabel(
        ctx,
        `Posición actual: ${fmt(pd.posM, 2)} m`,
        pad + 10,
        trackY - 13,
        { x: pad, y: pad - 6, w: w - pad * 2, h: 30 },
        pal.text,
        `700 ${w < 330 ? 11 : 12}px system-ui, sans-serif`
      );

      drawAxesInRect(ctx, graphRect, xMin, xMax, yMin, yMax, pal);
      // Curva s(t) = t² en el mismo sistema de coordenadas [-0.2, 3.2] × [-0.5, 9.5]
      plotCurveInRect(ctx, graphRect, xMin, xMax, yMin, yMax, tVal => tVal * tVal, pal.primary, 2.5, null, 0, 3.1);

      // Tangente exacta centrada en (timeSec, posM) con pendiente velMs = 2*timeSec
      const tanHalfSpan = 0.65;
      const tA = Math.max(-0.1, pd.timeSec - tanHalfSpan);
      const tB = Math.min(3.15, pd.timeSec + tanHalfSpan);
      drawLineSegmentInRect(
        ctx, graphRect, xMin, xMax, yMin, yMax,
        tA, pd.posM + pd.velMs * (tA - pd.timeSec),
        tB, pd.posM + pd.velMs * (tB - pd.timeSec),
        pal.accent, 2.4
      );
      const pV = mapBox(pd.timeSec, pd.posM, xMin, xMax, yMin, yMax, graphRect);
      drawPoint(ctx, pV.px, pV.py, pal.secondary, '#ffffff', 5.5);
    } else if (model.id === 'der-no-derivable') {
      const leftRect = { x: pad, y: pad, w: (w - pad * 3) / 2, h: h - pad * 2 };
      const rightRect = { x: pad * 2 + leftRect.w, y: pad, w: leftRect.w, h: h - pad * 2 };
      const titleFont = `700 ${w < 330 ? 10.5 : 12}px system-ui, sans-serif`;

      // Izquierda: |x|
      drawAxesInRect(ctx, leftRect, -2, 2, -0.4, 2.4, pal);
      plotCurveInRect(ctx, leftRect, -2, 2, -0.4, 2.4, x => Math.abs(x), pal.primary, 2.5);
      const pL = mapBox(-pd.h, Math.abs(-pd.h), -2, 2, -0.4, 2.4, leftRect);
      const pR = mapBox(pd.h, Math.abs(pd.h), -2, 2, -0.4, 2.4, leftRect);
      drawPoint(ctx, pL.px, pL.py, pal.accent, '#ffffff', 5);
      drawPoint(ctx, pR.px, pR.py, pal.secondary, '#ffffff', 5);
      drawClampedLabel(ctx, 'Pico |x| (pend. -1 / +1)', leftRect.x + 6, leftRect.y + 14, leftRect, pal.text, titleFont, pal.bg);

      // Derecha: cbrt(x) con secante volviéndose vertical (trazo exacto pasando por (-h, -h^(1/3)) y (h, h^(1/3)))
      drawAxesInRect(ctx, rightRect, -2, 2, -1.6, 1.6, pal);
      plotCurveInRect(ctx, rightRect, -2, 2, -1.6, 1.6, x => Math.cbrt(x), pal.primary, 2.5);
      const xLim = Math.min(2, 1.65 / Math.max(0.1, pd.slopeCbrt));
      drawLineSegmentInRect(
        ctx, rightRect, -2, 2, -1.6, 1.6,
        -xLim, -pd.slopeCbrt * xLim,
        xLim, pd.slopeCbrt * xLim,
        pal.accent, 2.1
      );
      const pC1 = mapBox(-pd.h, Math.cbrt(-pd.h), -2, 2, -1.6, 1.6, rightRect);
      const pC2 = mapBox(pd.h, Math.cbrt(pd.h), -2, 2, -1.6, 1.6, rightRect);
      drawPoint(ctx, pC1.px, pC1.py, pal.accent, '#ffffff', 4.5);
      drawPoint(ctx, pC2.px, pC2.py, pal.accent, '#ffffff', 4.5);
      drawClampedLabel(ctx, 'Tangente vertical ∛x', rightRect.x + 6, rightRect.y + 14, rightRect, pal.text, titleFont, pal.bg);
    } else if (model.id === 'int-suma-riemann') {
      const [xMin, xMax, yMin, yMax] = [-0.3, 2.3, -0.3, 4.4];
      drawAxesInRect(ctx, fullRect, xMin, xMax, yMin, yMax, pal);

      // Rectángulos de Riemann derechos
      ctx.fillStyle = pal.fillSoft;
      ctx.strokeStyle = pal.primary;
      ctx.lineWidth = 1.2;
      for (let i = 1; i <= pd.n; i++) {
        const xl = pd.a + (i - 1) * pd.dx;
        const xr = pd.a + i * pd.dx;
        const yr = xr * xr;
        const topLeft = mapBox(xl, yr, xMin, xMax, yMin, yMax, fullRect);
        const botRight = mapBox(xr, 0, xMin, xMax, yMin, yMax, fullRect);
        ctx.fillRect(topLeft.px, topLeft.py, botRight.px - topLeft.px, botRight.py - topLeft.py);
        ctx.strokeRect(topLeft.px, topLeft.py, botRight.px - topLeft.px, botRight.py - topLeft.py);
      }

      plotCurveInRect(ctx, fullRect, xMin, xMax, yMin, yMax, x => x * x, pal.accent, 2.5);
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------------------
     Gestor de Instancias Montadas (Observer, Resize, Pausa en Pestaña Oculta)
     ------------------------------------------------------------------------ */
  const mountedInstances = new Set();

  function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    try {
      return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderDemoSuite(container, animationIds) {
    if (!container || !Array.isArray(animationIds) || !animationIds.length) return;
    const validIds = animationIds.filter(id => Boolean(ANIMATION_CATALOG[id]));
    if (!validIds.length) return;

    container.innerHTML = `
      <div class="demo-anim-section">
        <div class="demo-anim-section-header">
          <div>
            <h3 class="demo-anim-heading">🎬 Animaciones Demostrativas Paso a Paso</h3>
            <p class="demo-anim-lead">Observa la evolución geométrica y numérica sin necesidad de ajustar controles manuales.</p>
          </div>
        </div>
        <div class="demo-anim-grid">
          ${validIds.map((id, idx) => {
            const meta = ANIMATION_CATALOG[id];
            return `
              <figure class="demo-anim-card" data-demo-card="${id}">
                <figcaption class="demo-anim-caption">
                  <div class="demo-anim-title-row">
                    <span class="demo-anim-index">#${idx + 1}</span>
                    <strong class="demo-anim-title">${escapeHtml(meta.title)}</strong>
                  </div>
                  <p class="demo-anim-desc">${escapeHtml(meta.description)}</p>
                </figcaption>

                <div class="demo-anim-body-grid">
                  <div class="demo-anim-visual-col">
                    <div class="demo-anim-canvas-box">
                      <canvas class="demo-anim-canvas" aria-label="Animación demostrativa: ${escapeHtml(meta.title)}"></canvas>
                    </div>
                    <div class="demo-anim-controls">
                      <button type="button" class="btn btn-outline btn-sm demo-btn-play" aria-label="Pausar o reproducir animación">
                        ⏸ Pausar
                      </button>
                      <button type="button" class="btn btn-outline btn-sm demo-btn-reset" aria-label="Reiniciar animación desde el inicio">
                        ↺ Reiniciar
                      </button>
                      <div class="demo-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Progreso de la animación">
                        <div class="demo-progress-fill"></div>
                      </div>
                    </div>
                    <div class="demo-anim-subtitle" aria-live="polite"></div>
                  </div>

                  <div class="demo-anim-data-col">
                    <div class="demo-readouts-box"></div>
                    <div class="demo-table-wrap"></div>
                  </div>
                </div>
              </figure>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-demo-card]').forEach(cardEl => {
      mountSingleCard(cardEl, cardEl.getAttribute('data-demo-card'));
    });
  }

  function mountSingleCard(cardEl, modelId) {
    const meta = ANIMATION_CATALOG[modelId];
    const canvas = cardEl.querySelector('.demo-anim-canvas');
    const canvasBox = cardEl.querySelector('.demo-anim-canvas-box');
    const playBtn = cardEl.querySelector('.demo-btn-play');
    const resetBtn = cardEl.querySelector('.demo-btn-reset');
    const progressTrack = cardEl.querySelector('.demo-progress-track');
    const progressFill = cardEl.querySelector('.demo-progress-fill');
    const subtitleEl = cardEl.querySelector('.demo-anim-subtitle');
    const readoutsEl = cardEl.querySelector('.demo-readouts-box');
    const tableWrap = cardEl.querySelector('.demo-table-wrap');

    const inst = {
      cardEl,
      canvas,
      progress: prefersReducedMotion() ? 1 : 0,
      userPaused: prefersReducedMotion(),
      inViewport: false,
      rafId: null,
      lastFrameTs: 0,
      holdRemainingMs: 0,
      lastTableSig: '',
      redraw() {
        syncSize();
        paint();
      }
    };

    function syncSize() {
      if (!canvas || !canvasBox) return;
      const boxW = Math.max(260, Math.floor(canvasBox.clientWidth || 340));
      const boxH = Math.max(210, Math.floor(canvasBox.clientHeight || 240));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(boxW * dpr);
      const targetH = Math.round(boxH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    }

    function updateControlsUi() {
      if (playBtn) {
        playBtn.textContent = inst.userPaused ? '▶ Reproducir' : '⏸ Pausar';
        playBtn.setAttribute('aria-pressed', inst.userPaused ? 'true' : 'false');
      }
    }

    function paint() {
      const model = evaluateAnimationModel(modelId, inst.progress);
      if (!model) return;
      drawModelFrame(canvas, model);

      const pct = Math.round(inst.progress * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(pct));
      if (subtitleEl) subtitleEl.textContent = model.subtitle;

      if (readoutsEl) {
        readoutsEl.innerHTML = model.readoutItems.map(item => `
          <div class="demo-readout-pill">
            <span class="demo-readout-label">${escapeHtml(item.label)}</span>
            <strong class="demo-readout-val">${escapeHtml(item.value)}</strong>
          </div>
        `).join('');
      }

      if (tableWrap) {
        const tableSig = JSON.stringify(model.tableRows);
        if (tableSig !== inst.lastTableSig) {
          inst.lastTableSig = tableSig;
          tableWrap.innerHTML = `
            <table class="demo-data-table">
              <thead>
                <tr>${model.tableHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${model.tableRows.map(row => `<tr>${row.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          `;
        }
      }
    }

    function stopRaf() {
      if (inst.rafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(inst.rafId);
      }
      inst.rafId = null;
      inst.lastFrameTs = 0;
    }

    function tick(ts) {
      if (!document.body.contains(cardEl)) {
        stopRaf();
        mountedInstances.delete(inst);
        return;
      }
      if (inst.userPaused || !inst.inViewport || document.hidden || prefersReducedMotion()) {
        stopRaf();
        paint();
        return;
      }
      if (!inst.lastFrameTs) inst.lastFrameTs = ts;
      const dtMs = Math.min(80, Math.max(0, ts - inst.lastFrameTs));
      inst.lastFrameTs = ts;

      if (inst.holdRemainingMs > 0) {
        inst.holdRemainingMs -= dtMs;
        if (inst.holdRemainingMs <= 0) {
          inst.holdRemainingMs = 0;
          inst.progress = 0;
        }
      } else {
        inst.progress += dtMs / meta.cycleDurationMs;
        if (inst.progress >= 1) {
          inst.progress = 1;
          inst.holdRemainingMs = meta.pauseEndMs;
        }
      }

      paint();
      inst.rafId = requestAnimationFrame(tick);
    }

    function syncPlayState() {
      if (!document.body.contains(cardEl)) {
        stopRaf();
        mountedInstances.delete(inst);
        return;
      }
      updateControlsUi();
      if (prefersReducedMotion()) {
        inst.progress = 1;
        stopRaf();
        paint();
        return;
      }
      if (!inst.userPaused && inst.inViewport && !document.hidden) {
        if (inst.rafId === null && typeof requestAnimationFrame === 'function') {
          inst.lastFrameTs = 0;
          inst.rafId = requestAnimationFrame(tick);
        }
      } else {
        stopRaf();
      }
    }

    playBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      if (prefersReducedMotion()) {
        // Permite reproducción puntual bajo acción explícita sin activar bucle infinito
        inst.userPaused = !inst.userPaused;
        if (!inst.userPaused && inst.progress >= 1) inst.progress = 0;
        if (!inst.userPaused) {
          inst.inViewport = true;
          inst.lastFrameTs = 0;
          const manualStep = (ts) => {
            if (inst.userPaused || !document.body.contains(cardEl)) { stopRaf(); return; }
            if (!inst.lastFrameTs) inst.lastFrameTs = ts;
            const dtMs = Math.min(80, ts - inst.lastFrameTs);
            inst.lastFrameTs = ts;
            inst.progress += dtMs / meta.cycleDurationMs;
            if (inst.progress >= 1) {
              inst.progress = 1;
              inst.userPaused = true;
              updateControlsUi();
              paint();
              stopRaf();
              return;
            }
            paint();
            inst.rafId = requestAnimationFrame(manualStep);
          };
          if (inst.rafId === null) inst.rafId = requestAnimationFrame(manualStep);
        } else {
          stopRaf();
        }
        updateControlsUi();
        return;
      }
      inst.userPaused = !inst.userPaused;
      if (!inst.userPaused && inst.progress >= 1 && inst.holdRemainingMs <= 0) {
        inst.progress = 0;
      }
      syncPlayState();
    });

    resetBtn?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      inst.holdRemainingMs = 0;
      inst.progress = prefersReducedMotion() ? 1 : 0;
      if (!prefersReducedMotion()) {
        inst.userPaused = false;
      }
      paint();
      syncPlayState();
    });

    const onVisibility = () => {
      if (!document.body.contains(cardEl)) {
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
        return;
      }
      syncPlayState();
    };
    const onResize = () => {
      if (!document.body.contains(cardEl)) {
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
        return;
      }
      inst.redraw();
    };

    if (typeof IntersectionObserver === 'function') {
      const obs = new IntersectionObserver((entries) => {
        if (!document.body.contains(cardEl)) {
          obs.disconnect();
          return;
        }
        for (const entry of entries) {
          inst.inViewport = entry.isIntersecting;
          syncPlayState();
        }
      }, { threshold: 0.15 });
      obs.observe(cardEl);
    } else {
      inst.inViewport = true;
    }

    if (typeof ResizeObserver === 'function' && canvasBox) {
      const rObs = new ResizeObserver(() => {
        if (!document.body.contains(cardEl)) {
          rObs.disconnect();
          return;
        }
        inst.redraw();
      });
      rObs.observe(canvasBox);
    }

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    mountedInstances.add(inst);
    syncSize();
    updateControlsUi();
    paint();
    syncPlayState();
  }

  function refreshAllThemes() {
    for (const inst of mountedInstances) {
      if (!document.body.contains(inst.cardEl)) {
        mountedInstances.delete(inst);
        continue;
      }
      inst.redraw();
    }
  }

  ns.DemoAnimations = {
    ANIMATION_CATALOG,
    evaluateAnimationModel,
    drawModelFrame,
    mapBox,
    renderDemoSuite,
    refreshAllThemes
  };
})(window.MatInteractiva);
