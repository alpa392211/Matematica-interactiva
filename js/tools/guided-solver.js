/* ==========================================================================
   MATETIC - Herramienta de Resolución Guiada Paso a Paso
   Archivo: js/tools/guided-solver.js
   Permite configurar problemas con campos interactivos MathLive (<math-field>)
   y tipografía KaTeX completa, intentar la solución y desbloquear pasos
   progresivos manteniendo los siguientes pasos totalmente difuminados.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const solverState = {
    mode: 'quadratic', // 'fractions' | 'gcd' | 'linear' | 'quadratic' | 'system2x2' | 'triangle' | 'calculus'
    currentSolution: null,
    revealedSteps: 1,
    lastUnlockedIdx: -1,
    studentAttempt: '',
    attemptFeedback: null,
    fnKbOpen: false,
    attemptKbOpen: false
  };

  const configControllers = new Map();
  let attemptController = null;

  function rich(str) {
    return ns.MathRenderer && typeof ns.MathRenderer.formatRichText === 'function'
      ? ns.MathRenderer.formatRichText(str)
      : String(str || '');
  }

  function renderTex(latex, displayMode = true) {
    return ns.MathRenderer && typeof ns.MathRenderer.renderMath === 'function'
      ? ns.MathRenderer.renderMath(latex, displayMode)
      : String(latex || '');
  }

  function casToTex(casStr) {
    const raw = String(casStr || '').trim();
    if (!raw) return '\\square';
    if (ns.MathInput && typeof ns.MathInput.casStringToLatex === 'function') {
      const ltx = ns.MathInput.casStringToLatex(raw);
      if (ltx) return ltx;
    }
    if (ns.MathRenderer && typeof ns.MathRenderer.algebraicToLatex === 'function') {
      return ns.MathRenderer.algebraicToLatex(raw);
    }
    return raw;
  }

  function safeCasNumTex(casStr) {
    const s = String(casStr || '').trim();
    if (!s) return '?';
    return casToTex(s);
  }

  function mountSolverMathField(container, mountId, inputId, initialValue, ariaLabel, options = {}) {
    const mountEl = container.querySelector('#' + mountId);
    if (!mountEl) return null;

    if (ns.MathInput && typeof ns.MathInput.createMathFieldController === 'function') {
      const ctrl = ns.MathInput.createMathFieldController(mountEl, {
        id: 'mf-' + inputId,
        fallbackInputId: inputId,
        initialCasValue: String(initialValue ?? ''),
        compact: options.compact !== false,
        hideNativeToggle: true,
        disableNativeKeyboard: true,
        placeholder: options.placeholder || '',
        ariaLabel: ariaLabel || 'Campo matemático',
        onChange: () => {
          if (typeof options.onChange === 'function') {
            options.onChange(ctrl.getCasValue());
          }
        },
        onSubmit: options.onSubmit
      });
      configControllers.set(inputId, ctrl);
      return ctrl;
    }

    mountEl.innerHTML = `<input type="text" id="${inputId}" class="exercise-input" value="${String(initialValue ?? '')}" aria-label="${String(ariaLabel || '')}" />`;
    const inp = mountEl.querySelector('#' + inputId);
    inp?.addEventListener('input', () => {
      if (typeof options.onChange === 'function') options.onChange(inp.value);
    });
    return null;
  }

  function getFieldValue(container, inputId) {
    const ctrl = configControllers.get(inputId);
    if (ctrl && typeof ctrl.getCasValue === 'function') {
      const val = ctrl.getCasValue().trim();
      if (val) return val;
    }
    const el = container.querySelector('#' + inputId);
    return el ? String(el.value || '').trim() : '';
  }

  function setFieldValue(container, inputId, value) {
    const strVal = String(value);
    const ctrl = configControllers.get(inputId);
    if (ctrl && typeof ctrl.setCasValue === 'function') {
      ctrl.setCasValue(strVal, { silent: true });
    }
    const el = container.querySelector('#' + inputId);
    if (el) el.value = strVal;
  }

  function buildLiveConfigLatex(container) {
    const f = (id, def = '0') => getFieldValue(container, id) || def;
    const opTerm = (raw, sym = '') => {
      const s = String(raw || '').trim();
      const n = Number(s);
      if (!Number.isNaN(n) && isFinite(n)) {
        return n >= 0 ? `+ ${n}${sym}` : `- ${Math.abs(n)}${sym}`;
      }
      return `+ \\left(${casToTex(s)}\\right)${sym}`;
    };

    switch (solverState.mode) {
      case 'quadratic': {
        const a = safeCasNumTex(f('sq-a', '1'));
        const b = f('sq-b', '-5');
        const c = f('sq-c', '6');
        return `${a}x^2 ${opTerm(b, 'x')} ${opTerm(c)} = 0`;
      }
      case 'linear': {
        const a = safeCasNumTex(f('sl-a', '5'));
        const b = f('sl-b', '-3');
        const c = safeCasNumTex(f('sl-c', '2'));
        const d = f('sl-d', '9');
        return `${a}x ${opTerm(b)} = ${c}x ${opTerm(d)}`;
      }
      case 'system2x2': {
        const a1 = safeCasNumTex(f('ss-a1', '2'));
        const b1 = f('ss-b1', '1');
        const c1 = safeCasNumTex(f('ss-c1', '8'));
        const a2 = safeCasNumTex(f('ss-a2', '1'));
        const b2 = f('ss-b2', '-1');
        const c2 = safeCasNumTex(f('ss-c2', '1'));
        return `\\begin{cases} ${a1}x ${opTerm(b1, 'y')} = ${c1} \\\\ ${a2}x ${opTerm(b2, 'y')} = ${c2} \\end{cases}`;
      }
      case 'fractions': {
        const a = safeCasNumTex(f('sf-a', '3'));
        const b = safeCasNumTex(f('sf-b', '4'));
        const c = safeCasNumTex(f('sf-c', '5'));
        const d = safeCasNumTex(f('sf-d', '6'));
        const op = container.querySelector('#sf-op')?.value || '+';
        const opTex = op === '*' ? '\\cdot' : op === '/' ? '\\div' : op;
        return `\\frac{${a}}{${b}} ${opTex} \\frac{${c}}{${d}}`;
      }
      case 'gcd': {
        const a = safeCasNumTex(f('sg-a', '36'));
        const b = safeCasNumTex(f('sg-b', '48'));
        return `\\text{MCD}(${a},\\; ${b}) \\quad \\text{y} \\quad \\text{MCM}(${a},\\; ${b})`;
      }
      case 'triangle': {
        const a = safeCasNumTex(f('st-a', '6'));
        const b = safeCasNumTex(f('st-b', '8'));
        return `a = ${a}, \\quad b = ${b}, \\quad c = \\sqrt{${a}^2 + ${b}^2}`;
      }
      case 'calculus': {
        const fn = casToTex(f('sc-fn', 'x^2 + 2*x + 1'));
        const x0 = safeCasNumTex(f('sc-x0', '1'));
        const a = safeCasNumTex(f('sc-a', '0'));
        const b = safeCasNumTex(f('sc-b', '3'));
        return `f(x) = ${fn}, \\quad x_0 = ${x0}, \\quad \\int_{${a}}^{${b}} f(x)\\,dx`;
      }
      default:
        return '';
    }
  }

  function updateConfigPreview(container) {
    const box = container.querySelector('#solver-live-config-preview');
    if (!box) return;
    const latex = buildLiveConfigLatex(container);
    box.innerHTML = renderTex(latex, true);
  }

  function renderGuidedSolverView(container) {
    configControllers.clear();
    attemptController = null;
    solverState.fnKbOpen = false;
    solverState.attemptKbOpen = false;
    solverState.lastUnlockedIdx = -1;

    container.innerHTML = `
      <div class="subject-header-card">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon">🧭</div>
            <div class="subject-title-text">
              <h1>Resolución Guiada de Ejercicios Paso a Paso</h1>
              <p>Configura el problema con notación matemática real, intenta resolverlo y descubre cada paso de forma progresiva.</p>
            </div>
          </div>
        </div>

        <div class="topics-bar" id="solver-type-bar">
          <button type="button" class="topic-selector-btn ${solverState.mode === 'quadratic' ? 'active' : ''}" data-solver-mode="quadratic">Ecuación Cuadrática</button>
          <button type="button" class="topic-selector-btn ${solverState.mode === 'linear' ? 'active' : ''}" data-solver-mode="linear">Ecuación Lineal</button>
          <button type="button" class="topic-selector-btn ${solverState.mode === 'system2x2' ? 'active' : ''}" data-solver-mode="system2x2">Sistema 2×2</button>
          <button type="button" class="topic-selector-btn ${solverState.mode === 'fractions' ? 'active' : ''}" data-solver-mode="fractions">Fracciones</button>
          <button type="button" class="topic-selector-btn ${solverState.mode === 'gcd' ? 'active' : ''}" data-solver-mode="gcd">MCD y MCM</button>
          <button type="button" class="topic-selector-btn ${solverState.mode === 'triangle' ? 'active' : ''}" data-solver-mode="triangle">Pitágoras y Trigonometría</button>
          <button type="button" class="topic-selector-btn ${solverState.mode === 'calculus' ? 'active' : ''}" data-solver-mode="calculus">Derivada, Límite e Integral</button>
        </div>
      </div>

      <div class="two-col-grid solver-main-grid">
        <!-- Configuración del Problema -->
        <div class="content-card solver-config-card">
          <h2>1. Configura los Datos del Problema</h2>
          <div id="solver-form-area"></div>
          <div class="solver-actions-row">
            <button type="button" class="btn btn-primary" id="btn-start-guided">🚀 Iniciar Resolución Guiada</button>
            <button type="button" class="btn btn-outline" id="btn-random-problem">🎲 Generar Valores Aleatorios</button>
          </div>
        </div>

        <!-- Panel de Intento del Estudiante y Pasos Guiados -->
        <div class="content-card solver-workspace-card" id="solver-workspace-card">
          <h2>2. Tutor Guiado Progresivo</h2>
          <div id="solver-steps-output"></div>
        </div>
      </div>
    `;

    renderFormForMode(container);
    computeCurrentSolution(container);
    bindSolverEvents(container);
  }

  function renderFormForMode(container) {
    const formArea = container.querySelector('#solver-form-area');
    if (!formArea) return;
    configControllers.clear();
    solverState.fnKbOpen = false;

    const refreshPreview = () => updateConfigPreview(container);
    const submitAndCompute = () => {
      solverState.studentAttempt = '';
      computeCurrentSolution(container);
    };

    switch (solverState.mode) {
      case 'quadratic':
        formArea.innerHTML = `
          <div class="solver-model-banner">
            ${rich('Modelo estándar de segundo grado: $$ax^2 + bx + c = 0$$')}
          </div>
          <div class="solver-fields-grid solver-cols-3">
            <div class="solver-field-item">
              <label class="solver-field-label" for="sq-a">${rich('Coeficiente $a$ ($x^2$)')}</label>
              <div id="mount-sq-a" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="sq-b">${rich('Coeficiente $b$ ($x$)')}</label>
              <div id="mount-sq-b" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="sq-c">${rich('Término indep. $c$')}</label>
              <div id="mount-sq-c" class="solver-math-mount"></div>
            </div>
          </div>
          <div class="solver-live-preview-box">
            <span class="solver-preview-tag">Vista previa en KaTeX</span>
            <div class="solver-live-preview-math" id="solver-live-config-preview"></div>
          </div>
        `;
        mountSolverMathField(container, 'mount-sq-a', 'sq-a', '1', 'Coeficiente cuadrático a', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sq-b', 'sq-b', '-5', 'Coeficiente lineal b', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sq-c', 'sq-c', '6', 'Término independiente c', { onChange: refreshPreview, onSubmit: submitAndCompute });
        break;

      case 'linear':
        formArea.innerHTML = `
          <div class="solver-model-banner">
            ${rich('Ecuación lineal de primer grado: $$ax + b = cx + d$$')}
          </div>
          <div class="solver-fields-grid solver-cols-2">
            <div class="solver-field-item">
              <label class="solver-field-label" for="sl-a">${rich('Coeficiente $a$ ($ax$)')}</label>
              <div id="mount-sl-a" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="sl-b">${rich('Constante $b$ (izq.)')}</label>
              <div id="mount-sl-b" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="sl-c">${rich('Coeficiente $c$ ($cx$)')}</label>
              <div id="mount-sl-c" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="sl-d">${rich('Constante $d$ (der.)')}</label>
              <div id="mount-sl-d" class="solver-math-mount"></div>
            </div>
          </div>
          <div class="solver-live-preview-box">
            <span class="solver-preview-tag">Vista previa en KaTeX</span>
            <div class="solver-live-preview-math" id="solver-live-config-preview"></div>
          </div>
        `;
        mountSolverMathField(container, 'mount-sl-a', 'sl-a', '5', 'Coeficiente a', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sl-b', 'sl-b', '-3', 'Constante b', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sl-c', 'sl-c', '2', 'Coeficiente c', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sl-d', 'sl-d', '9', 'Constante d', { onChange: refreshPreview, onSubmit: submitAndCompute });
        break;

      case 'system2x2':
        formArea.innerHTML = `
          <div class="solver-model-banner">
            ${rich('Sistema lineal $2 \\times 2$: $$\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}$$')}
          </div>
          <div class="solver-fields-grid solver-cols-3">
            <div class="solver-field-item">
              <label class="solver-field-label" for="ss-a1">${rich('Coeficiente $a_1$')}</label>
              <div id="mount-ss-a1" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="ss-b1">${rich('Coeficiente $b_1$')}</label>
              <div id="mount-ss-b1" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="ss-c1">${rich('Término $c_1$')}</label>
              <div id="mount-ss-c1" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="ss-a2">${rich('Coeficiente $a_2$')}</label>
              <div id="mount-ss-a2" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="ss-b2">${rich('Coeficiente $b_2$')}</label>
              <div id="mount-ss-b2" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="ss-c2">${rich('Término $c_2$')}</label>
              <div id="mount-ss-c2" class="solver-math-mount"></div>
            </div>
          </div>
          <div class="solver-live-preview-box">
            <span class="solver-preview-tag">Vista previa en KaTeX</span>
            <div class="solver-live-preview-math" id="solver-live-config-preview"></div>
          </div>
        `;
        mountSolverMathField(container, 'mount-ss-a1', 'ss-a1', '2', 'Coeficiente a1', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-ss-b1', 'ss-b1', '1', 'Coeficiente b1', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-ss-c1', 'ss-c1', '8', 'Término c1', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-ss-a2', 'ss-a2', '1', 'Coeficiente a2', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-ss-b2', 'ss-b2', '-1', 'Coeficiente b2', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-ss-c2', 'ss-c2', '1', 'Término c2', { onChange: refreshPreview, onSubmit: submitAndCompute });
        break;

      case 'fractions':
        formArea.innerHTML = `
          <div class="solver-model-banner">
            ${rich('Operación fraccionaria: $$\\frac{a}{b} \\;(\\text{op})\\; \\frac{c}{d}$$')}
          </div>
          <div class="solver-fraction-builder">
            <div class="solver-fraction-col">
              <span class="solver-field-label">${rich('Numerador $a$')}</span>
              <div id="mount-sf-a" class="solver-math-mount"></div>
              <div class="solver-fraction-bar" aria-hidden="true"></div>
              <span class="solver-field-label">${rich('Denominador $b$')}</span>
              <div id="mount-sf-b" class="solver-math-mount"></div>
            </div>

            <div class="solver-op-selector" role="group" aria-label="Operación entre fracciones">
              <input type="hidden" id="sf-op" value="+" />
              <button type="button" class="solver-op-btn active" data-sf-op="+" aria-pressed="true">${rich('$+$')}</button>
              <button type="button" class="solver-op-btn" data-sf-op="-" aria-pressed="false">${rich('$-$')}</button>
              <button type="button" class="solver-op-btn" data-sf-op="*" aria-pressed="false">${rich('$\\times$')}</button>
              <button type="button" class="solver-op-btn" data-sf-op="/" aria-pressed="false">${rich('$\\div$')}</button>
            </div>

            <div class="solver-fraction-col">
              <span class="solver-field-label">${rich('Numerador $c$')}</span>
              <div id="mount-sf-c" class="solver-math-mount"></div>
              <div class="solver-fraction-bar" aria-hidden="true"></div>
              <span class="solver-field-label">${rich('Denominador $d$')}</span>
              <div id="mount-sf-d" class="solver-math-mount"></div>
            </div>
          </div>
          <div class="solver-live-preview-box">
            <span class="solver-preview-tag">Vista previa en KaTeX</span>
            <div class="solver-live-preview-math" id="solver-live-config-preview"></div>
          </div>
        `;
        mountSolverMathField(container, 'mount-sf-a', 'sf-a', '3', 'Numerador a', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sf-b', 'sf-b', '4', 'Denominador b', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sf-c', 'sf-c', '5', 'Numerador c', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sf-d', 'sf-d', '6', 'Denominador d', { onChange: refreshPreview, onSubmit: submitAndCompute });

        formArea.querySelectorAll('[data-sf-op]').forEach(opBtn => {
          opBtn.addEventListener('click', () => {
            if (ns.Haptics) ns.Haptics.light();
            const val = opBtn.getAttribute('data-sf-op') || '+';
            const hiddenOp = formArea.querySelector('#sf-op');
            if (hiddenOp) hiddenOp.value = val;
            formArea.querySelectorAll('[data-sf-op]').forEach(b => {
              const active = b === opBtn;
              b.classList.toggle('active', active);
              b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            refreshPreview();
          });
        });
        break;

      case 'gcd':
        formArea.innerHTML = `
          <div class="solver-model-banner">
            ${rich('Descomposición en factores primos para hallar $\\text{MCD}(a, b)$ y $\\text{MCM}(a, b)$ con $a, b \\in \\mathbb{Z}^+$.')}
          </div>
          <div class="solver-fields-grid solver-cols-2">
            <div class="solver-field-item">
              <label class="solver-field-label" for="sg-a">${rich('Primer entero $a$')}</label>
              <div id="mount-sg-a" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="sg-b">${rich('Segundo entero $b$')}</label>
              <div id="mount-sg-b" class="solver-math-mount"></div>
            </div>
          </div>
          <div class="solver-live-preview-box">
            <span class="solver-preview-tag">Vista previa en KaTeX</span>
            <div class="solver-live-preview-math" id="solver-live-config-preview"></div>
          </div>
        `;
        mountSolverMathField(container, 'mount-sg-a', 'sg-a', '36', 'Primer entero a', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sg-b', 'sg-b', '48', 'Segundo entero b', { onChange: refreshPreview, onSubmit: submitAndCompute });
        break;

      case 'triangle':
        formArea.innerHTML = `
          <div class="solver-model-banner">
            ${rich('Teorema de Pitágoras y razones trigonométricas: $$c = \\sqrt{a^2 + b^2}, \\quad \\tan(\\alpha) = \\frac{a}{b}$$')}
          </div>
          <div class="solver-fields-grid solver-cols-2">
            <div class="solver-field-item">
              <label class="solver-field-label" for="st-a">${rich('Cateto opuesto $a$')}</label>
              <div id="mount-st-a" class="solver-math-mount"></div>
            </div>
            <div class="solver-field-item">
              <label class="solver-field-label" for="st-b">${rich('Cateto adyacente $b$')}</label>
              <div id="mount-st-b" class="solver-math-mount"></div>
            </div>
          </div>
          <div class="solver-live-preview-box">
            <span class="solver-preview-tag">Vista previa en KaTeX</span>
            <div class="solver-live-preview-math" id="solver-live-config-preview"></div>
          </div>
        `;
        mountSolverMathField(container, 'mount-st-a', 'st-a', '6', 'Cateto opuesto a', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-st-b', 'st-b', '8', 'Cateto adyacente b', { onChange: refreshPreview, onSubmit: submitAndCompute });
        break;

      case 'calculus':
        formArea.innerHTML = `
          <div class="solver-model-banner">
            ${rich('Análisis en cálculo diferencial e integral de $f(x)$ en $x_0$ y $[a, b]$.')}
          </div>
          <div class="solver-calculus-stack">
            <div class="solver-field-item">
              <div class="solver-label-row">
                <label class="solver-field-label" for="sc-fn">${rich('Función $f(x)$')}</label>
                <button type="button" class="btn btn-outline btn-sm solver-vkb-btn" id="btn-solver-fn-vkb" aria-expanded="false">⌨️ Teclado</button>
              </div>
              <div id="mount-sc-fn" class="solver-math-mount"></div>
              <div id="solver-fn-vkb-drawer" class="exercise-vkb-drawer is-collapsed"></div>
            </div>
            <div class="solver-fields-grid solver-cols-3">
              <div class="solver-field-item">
                <label class="solver-field-label" for="sc-x0">${rich('Punto $x_0$')}</label>
                <div id="mount-sc-x0" class="solver-math-mount"></div>
              </div>
              <div class="solver-field-item">
                <label class="solver-field-label" for="sc-a">${rich('Límite inf. $a$')}</label>
                <div id="mount-sc-a" class="solver-math-mount"></div>
              </div>
              <div class="solver-field-item">
                <label class="solver-field-label" for="sc-b">${rich('Límite sup. $b$')}</label>
                <div id="mount-sc-b" class="solver-math-mount"></div>
              </div>
            </div>
          </div>
          <div class="solver-live-preview-box">
            <span class="solver-preview-tag">Vista previa en KaTeX</span>
            <div class="solver-live-preview-math" id="solver-live-config-preview"></div>
          </div>
        `;
        const fnCtrl = mountSolverMathField(container, 'mount-sc-fn', 'sc-fn', 'x^2 + 2*x + 1', 'Función f(x)', {
          compact: false,
          onChange: refreshPreview,
          onSubmit: submitAndCompute
        });
        mountSolverMathField(container, 'mount-sc-x0', 'sc-x0', '1', 'Punto x0', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sc-a', 'sc-a', '0', 'Límite inferior a', { onChange: refreshPreview, onSubmit: submitAndCompute });
        mountSolverMathField(container, 'mount-sc-b', 'sc-b', '3', 'Límite superior b', { onChange: refreshPreview, onSubmit: submitAndCompute });

        const fnVkbBtn = formArea.querySelector('#btn-solver-fn-vkb');
        const fnDrawer = formArea.querySelector('#solver-fn-vkb-drawer');
        if (fnVkbBtn && fnDrawer && fnCtrl && ns.MathInput && typeof ns.MathInput.renderVisualKeyboard === 'function') {
          ns.MathInput.renderVisualKeyboard(fnDrawer, fnCtrl, {
            initialCategory: 'potencias',
            onClose: () => {
              solverState.fnKbOpen = false;
              fnDrawer.className = 'exercise-vkb-drawer is-collapsed';
              fnVkbBtn.setAttribute('aria-expanded', 'false');
            }
          });
          fnVkbBtn.addEventListener('click', () => {
            if (ns.Haptics) ns.Haptics.light();
            solverState.fnKbOpen = !solverState.fnKbOpen;
            fnDrawer.className = solverState.fnKbOpen ? 'exercise-vkb-drawer is-open' : 'exercise-vkb-drawer is-collapsed';
            fnVkbBtn.setAttribute('aria-expanded', solverState.fnKbOpen ? 'true' : 'false');
          });
        }
        break;
    }

    refreshPreview();
  }

  function computeCurrentSolution(container) {
    try {
      let sol;
      const val = (id) => getFieldValue(container, id);

      if (solverState.mode === 'quadratic') {
        sol = ns.StepSolver.solveQuadraticEquation(val('sq-a'), val('sq-b'), val('sq-c'));
      } else if (solverState.mode === 'linear') {
        sol = ns.StepSolver.solveLinearEquation(val('sl-a'), val('sl-b'), val('sl-c'), val('sl-d'));
      } else if (solverState.mode === 'system2x2') {
        sol = ns.StepSolver.solveSystem2x2(val('ss-a1'), val('ss-b1'), val('ss-c1'), val('ss-a2'), val('ss-b2'), val('ss-c2'));
      } else if (solverState.mode === 'fractions') {
        sol = ns.StepSolver.solveFractions(val('sf-a'), val('sf-b'), container.querySelector('#sf-op')?.value || '+', val('sf-c'), val('sf-d'));
      } else if (solverState.mode === 'gcd') {
        sol = ns.StepSolver.solveGcdLcm(val('sg-a'), val('sg-b'));
      } else if (solverState.mode === 'triangle') {
        sol = ns.StepSolver.solveRightTriangle(val('st-a'), val('st-b'));
      } else if (solverState.mode === 'calculus') {
        sol = ns.StepSolver.solveCalculusFunction(val('sc-fn'), val('sc-x0'), val('sc-a'), val('sc-b'));
      }

      solverState.currentSolution = sol;
      solverState.revealedSteps = 1;
      solverState.lastUnlockedIdx = -1;
      solverState.attemptFeedback = null;
      renderGuidedSteps(container);
    } catch (err) {
      const out = container.querySelector('#solver-steps-output');
      if (out) {
        out.innerHTML = `<div class="feedback-banner error">${err.message || 'Verifica los datos ingresados.'}</div>`;
      }
    }
  }

  function renderGuidedSteps(container) {
    const out = container.querySelector('#solver-steps-output');
    const sol = solverState.currentSolution;
    if (!out || !sol) return;

    const totalSteps = sol.steps.length;
    const allRevealed = solverState.revealedSteps >= totalSteps;

    out.innerHTML = `
      <div class="solver-active-problem-card">
        <div class="solver-active-label">Problema Activo</div>
        <div class="solver-active-title">${rich(sol.problemTitle)}</div>
        ${sol.problemMath ? `<div class="solver-active-problem-math">${renderTex(sol.problemMath, true)}</div>` : ''}
      </div>

      <!-- Intento del Estudiante en MathLive antes de desbloquear todos los pasos -->
      <div class="solver-attempt-card">
        <div class="solver-attempt-header">
          <div class="solver-attempt-heading">✍️ Pon a prueba tu cálculo antes de desbloquear los pasos:</div>
          <button type="button" class="btn btn-outline btn-sm solver-vkb-btn" id="btn-attempt-vkb" aria-expanded="false">⌨️ Teclado</button>
        </div>
        <div class="exercise-input-row solver-attempt-row">
          <div id="solver-attempt-mount" class="exercise-math-field-mount"></div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-check-guided">Comprobar Mi Respuesta</button>
        </div>
        <div id="solver-attempt-vkb-drawer" class="exercise-vkb-drawer is-collapsed"></div>
        <div class="solver-attempt-live" id="solver-attempt-live-preview">
          ${solverState.studentAttempt
            ? renderTex(casToTex(solverState.studentAttempt), false)
            : '<span class="preview-empty-hint">Tu respuesta se previsualizará en notación matemática aquí</span>'}
        </div>
        ${solverState.attemptFeedback ? `
          <div class="feedback-banner ${solverState.attemptFeedback.isCorrect ? 'success' : 'error'}">
            <span>${rich(solverState.attemptFeedback.message)}</span>
          </div>
        ` : ''}
      </div>

      <!-- Barra de Progreso y Botón de Desbloqueo -->
      <div class="solver-progress-header">
        <span class="solver-progress-label">
          Progreso Guiado: Paso ${solverState.revealedSteps} de ${totalSteps}
        </span>
        <div class="solver-progress-actions">
          ${!allRevealed ? `
            <button type="button" class="btn btn-warning btn-sm" id="btn-next-step">
              💡 Desbloquear Siguiente Paso (${solverState.revealedSteps + 1}/${totalSteps})
            </button>
          ` : `
            <span class="badge-level basico">✓ Procedimiento Completo Desbloqueado</span>
          `}
        </div>
      </div>

      <div class="steps-container solver-steps-list">
        ${sol.steps.map((st, idx) => {
          const isUnlocked = idx < solverState.revealedSteps;
          const justUnlocked = idx === solverState.lastUnlockedIdx;
          return `
            <div class="math-step-item ${isUnlocked ? 'active-step' : 'locked-step'} ${justUnlocked ? 'just-unlocked' : ''}" ${!isUnlocked ? 'aria-hidden="true"' : ''}>
              <div class="step-number-badge">${idx + 1}</div>
              <div class="step-body">
                <div class="step-explanation">${rich(st.title)}</div>
                <div class="step-math-work">${renderTex(st.math, true)}</div>
                <div class="step-reason">${rich(st.reason)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${allRevealed ? `
        <div class="formula-showcase solver-final-answer-card">
          <span class="formula-label solver-final-label">Conclusión y Resultado Final</span>
          <div class="formula-expression solver-final-math">${renderTex(sol.finalMath, true)}</div>
        </div>
      ` : ''}
    `;

    const liveAttemptBox = out.querySelector('#solver-attempt-live-preview');
    const attemptMount = out.querySelector('#solver-attempt-mount');
    const syncAttemptPreview = (casVal) => {
      solverState.studentAttempt = casVal;
      if (!liveAttemptBox) return;
      liveAttemptBox.innerHTML = casVal.trim()
        ? renderTex(casToTex(casVal), false)
        : '<span class="preview-empty-hint">Tu respuesta se previsualizará en notación matemática aquí</span>';
    };

    const runAttemptCheck = () => {
      const latestVal = attemptController ? attemptController.getCasValue() : (out.querySelector('#inp-guided-attempt')?.value || '');
      solverState.studentAttempt = latestVal;
      const check = ns.MathParser.checkStudentAnswer(solverState.studentAttempt, sol.finalAnswer);
      solverState.attemptFeedback = check;
      if (check.isCorrect) {
        if (ns.Haptics) ns.Haptics.confirm();
        solverState.lastUnlockedIdx = -1;
        solverState.revealedSteps = totalSteps;
      } else {
        if (ns.Haptics) ns.Haptics.light();
        if (solverState.revealedSteps < totalSteps) {
          solverState.lastUnlockedIdx = solverState.revealedSteps;
          solverState.revealedSteps++;
          solverState.attemptFeedback.message += ' Se ha desbloqueado el siguiente paso como pista para ayudarte.';
        }
      }
      renderGuidedSteps(container);
    };

    if (attemptMount && ns.MathInput && typeof ns.MathInput.createMathFieldController === 'function') {
      attemptController = ns.MathInput.createMathFieldController(attemptMount, {
        id: 'mf-guided-attempt',
        fallbackInputId: 'inp-guided-attempt',
        initialCasValue: solverState.studentAttempt,
        compact: true,
        hideNativeToggle: true,
        disableNativeKeyboard: true,
        placeholder: 'Escribe tu resultado matemático...',
        ariaLabel: 'Campo para intentar resolver el problema',
        onChange: syncAttemptPreview,
        onSubmit: runAttemptCheck
      });

      const attemptKbBtn = out.querySelector('#btn-attempt-vkb');
      const attemptDrawer = out.querySelector('#solver-attempt-vkb-drawer');
      if (attemptKbBtn && attemptDrawer && typeof ns.MathInput.renderVisualKeyboard === 'function') {
        ns.MathInput.renderVisualKeyboard(attemptDrawer, attemptController, {
          initialCategory: 'basicas',
          onClose: () => {
            solverState.attemptKbOpen = false;
            attemptDrawer.className = 'exercise-vkb-drawer is-collapsed';
            attemptKbBtn.setAttribute('aria-expanded', 'false');
          }
        });
        attemptKbBtn.addEventListener('click', () => {
          if (ns.Haptics) ns.Haptics.light();
          solverState.attemptKbOpen = !solverState.attemptKbOpen;
          attemptDrawer.className = solverState.attemptKbOpen ? 'exercise-vkb-drawer is-open' : 'exercise-vkb-drawer is-collapsed';
          attemptKbBtn.setAttribute('aria-expanded', solverState.attemptKbOpen ? 'true' : 'false');
        });
      }
    } else if (attemptMount) {
      attemptMount.innerHTML = `<input type="text" id="inp-guided-attempt" class="exercise-input" value="${solverState.studentAttempt}" placeholder="Escribe tu resultado..." />`;
    }

    out.querySelector('#btn-next-step')?.addEventListener('click', () => {
      if (solverState.revealedSteps < totalSteps) {
        if (ns.Haptics) ns.Haptics.light();
        solverState.lastUnlockedIdx = solverState.revealedSteps;
        solverState.revealedSteps++;
        renderGuidedSteps(container);
      }
    });

    out.querySelector('#btn-check-guided')?.addEventListener('click', runAttemptCheck);
  }

  function bindSolverEvents(container) {
    container.querySelectorAll('[data-solver-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (ns.Haptics) ns.Haptics.light();
        solverState.mode = btn.getAttribute('data-solver-mode');
        solverState.studentAttempt = '';
        container.querySelectorAll('[data-solver-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFormForMode(container);
        computeCurrentSolution(container);
      });
    });

    container.querySelector('#btn-start-guided')?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.confirm();
      solverState.studentAttempt = '';
      computeCurrentSolution(container);
    });

    container.querySelector('#btn-random-problem')?.addEventListener('click', () => {
      if (ns.Haptics) ns.Haptics.light();
      randomizeInputs(container);
      solverState.studentAttempt = '';
      updateConfigPreview(container);
      computeCurrentSolution(container);
    });
  }

  function randomizeInputs(container) {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const setVal = (id, v) => setFieldValue(container, id, v);

    if (solverState.mode === 'quadratic') {
      const r1 = randInt(-5, 6);
      const r2 = randInt(-4, 7);
      setVal('sq-a', 1);
      setVal('sq-b', -(r1 + r2));
      setVal('sq-c', r1 * r2);
    } else if (solverState.mode === 'linear') {
      const xSol = randInt(-6, 9);
      const a = randInt(3, 8);
      const c = randInt(1, a - 1);
      const b = randInt(-10, 10);
      const d = (a - c) * xSol + b;
      setVal('sl-a', a);
      setVal('sl-b', b);
      setVal('sl-c', c);
      setVal('sl-d', d);
    } else if (solverState.mode === 'system2x2') {
      const x = randInt(1, 6);
      const y = randInt(1, 6);
      setVal('ss-a1', 2); setVal('ss-b1', 1); setVal('ss-c1', 2 * x + y);
      setVal('ss-a2', 1); setVal('ss-b2', -1); setVal('ss-c2', x - y);
    } else if (solverState.mode === 'fractions') {
      setVal('sf-a', randInt(1, 7));
      setVal('sf-b', randInt(2, 8));
      setVal('sf-c', randInt(1, 7));
      setVal('sf-d', randInt(2, 8));
    } else if (solverState.mode === 'gcd') {
      const base = randInt(4, 12);
      setVal('sg-a', base * randInt(2, 5));
      setVal('sg-b', base * randInt(3, 7));
    } else if (solverState.mode === 'triangle') {
      const triples = [[3, 4], [5, 12], [6, 8], [8, 15], [9, 12]];
      const pair = triples[randInt(0, triples.length - 1)];
      setVal('st-a', pair[0]);
      setVal('st-b', pair[1]);
    } else if (solverState.mode === 'calculus') {
      const c2 = randInt(1, 3);
      const c1 = randInt(-4, 4);
      setVal('sc-fn', `${c2}*x^2 + (${c1})*x + 1`);
      setVal('sc-x0', randInt(1, 3));
    }
  }

  ns.GuidedSolverTool = {
    renderGuidedSolverView
  };
})(window.MatInteractiva);
