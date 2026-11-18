/* ==========================================================================
   MATETIC - Calculadora Científica Interactiva
   Archivo: js/tools/calculator.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  let activeEscapeHandler = null;

  const calcState = {
    expression: '',
    result: '0',
    isError: false,
    angleMode: 'DEG', // 'DEG' o 'RAD'
    memory: 0,
    lastAns: 0,
    cursorStart: 0,
    cursorEnd: 0,
    fnPanelOpen: false,
    activeFnCategory: 'trig'
  };

  /**
   * Catálogo de funciones organizado por categorías para el menú / bottom sheet.
   */
  const FUNCTION_CATEGORIES = [
    {
      id: 'trig',
      label: 'Trigonométricas',
      items: [
        { label: 'sen(', token: 'sin(', desc: 'Seno' },
        { label: 'cos(', token: 'cos(', desc: 'Coseno' },
        { label: 'tan(', token: 'tan(', desc: 'Tangente' },
        { label: 'arcsen(', token: 'asin(', desc: 'Seno inverso' },
        { label: 'arccos(', token: 'acos(', desc: 'Coseno inverso' },
        { label: 'arctg(', token: 'atan(', desc: 'Tangente inversa' },
        { label: 'sec(', token: 'sec(', desc: 'Secante (1/cos)' },
        { label: 'csc(', token: 'csc(', desc: 'Cosecante (1/sen)' },
        { label: 'cot(', token: 'cot(', desc: 'Cotangente (1/tan)' },
        { label: '°', token: '°', desc: 'Grados sexagesimales' }
      ]
    },
    {
      id: 'exp',
      label: 'Exp / Log / Raíces',
      items: [
        { label: 'ln(', token: 'ln(', desc: 'Logaritmo natural' },
        { label: 'log₁₀(', token: 'log(', desc: 'Logaritmo base 10' },
        { label: 'exp(', token: 'exp(', desc: 'Exponencial eˣ' },
        { label: 'e^(', token: 'e^(', desc: 'Potencia de e' },
        { label: '10^(', token: '10^(', desc: 'Potencia de 10' },
        { label: '√(', token: 'sqrt(', desc: 'Raíz cuadrada' },
        { label: '∛(', token: 'cbrt(', desc: 'Raíz cúbica' },
        { label: 'x²', token: '^2', desc: 'Al cuadrado' },
        { label: 'xʸ', token: '^', desc: 'Potencia' }
      ]
    },
    {
      id: 'const',
      label: 'Constantes',
      items: [
        { label: 'π', token: 'pi', desc: 'Pi (3.14159...)' },
        { label: 'e', token: 'e', desc: 'Número de Euler (2.71828...)' },
        { label: 'ans', token: 'ans', desc: 'Último resultado' },
        { label: '∞', token: 'inf', desc: 'Infinito' }
      ]
    },
    {
      id: 'other',
      label: 'Otras',
      items: [
        { label: '|x|', token: 'abs(', desc: 'Valor absoluto' },
        { label: 'n!', token: '!', desc: 'Factorial' },
        { label: 'piso(', token: 'floor(', desc: 'Parte entera inferior' },
        { label: 'techo(', token: 'ceil(', desc: 'Parte entera superior' },
        { label: 'redond(', token: 'round(', desc: 'Redondear al entero' },
        { label: '(', token: '(', desc: 'Abrir paréntesis' },
        { label: ')', token: ')', desc: 'Cerrar paréntesis' }
      ]
    }
  ];

  // Tokens ordenados de mayor a menor longitud para borrado inteligente completo
  const DELETABLE_TOKENS = [
    'arcsen(', 'arccos(', 'arctan(', 'arctg(',
    'floor(', 'round(', 'sqrt(', 'cbrt(', 'ceil(',
    'asin(', 'acos(', 'atan(', 'arcsen', 'arccos', 'arctan', 'arctg',
    'sen(', 'sin(', 'cos(', 'tan(', 'sec(', 'csc(', 'cot(',
    'log(', 'exp(', 'abs(', 'ln(',
    'floor', 'round', 'sqrt', 'cbrt', 'ceil',
    'asin', 'acos', 'atan',
    'sen', 'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
    'log', 'exp', 'abs', 'ans', 'inf', 'ln', 'pi'
  ];

  /**
   * Inserta un fragmento en la posición exacta del cursor (o reemplaza selección).
   */
  function insertAtCursor(text, selStart, selEnd, token) {
    const str = String(text ?? '');
    const tok = String(token ?? '');
    const len = str.length;
    const rawStart = (typeof selStart === 'number' && isFinite(selStart)) ? selStart : len;
    const rawEnd = (typeof selEnd === 'number' && isFinite(selEnd)) ? selEnd : rawStart;
    const start = Math.max(0, Math.min(len, Math.min(rawStart, rawEnd)));
    const end = Math.max(start, Math.min(len, Math.max(rawStart, rawEnd)));

    return {
      text: str.slice(0, start) + tok + str.slice(end),
      cursor: start + tok.length
    };
  }

  /**
   * Borra el texto seleccionado o el token completo inmediatamente anterior al cursor
   * (ej. `sin(`, `arcsen(`, `sqrt(`, `pi`, `ans`). Si no coincide un token, borra 1 carácter.
   */
  function deleteTokenBeforeCursor(text, selStart, selEnd) {
    const str = String(text ?? '');
    const len = str.length;
    const rawStart = (typeof selStart === 'number' && isFinite(selStart)) ? selStart : len;
    const rawEnd = (typeof selEnd === 'number' && isFinite(selEnd)) ? selEnd : rawStart;
    const start = Math.max(0, Math.min(len, Math.min(rawStart, rawEnd)));
    const end = Math.max(start, Math.min(len, Math.max(rawStart, rawEnd)));

    if (end > start) {
      return {
        text: str.slice(0, start) + str.slice(end),
        cursor: start
      };
    }
    if (start === 0) {
      return { text: str, cursor: 0 };
    }

    const before = str.slice(0, start);
    const after = str.slice(start);
    const lowerBefore = before.toLowerCase();

    for (const tok of DELETABLE_TOKENS) {
      if (lowerBefore.endsWith(tok)) {
        const cutIdx = start - tok.length;
        // Evitar recortar la cola de un identificador más largo (ej. `asin` en `xasin`)
        const prevChar = cutIdx > 0 ? before[cutIdx - 1] : '';
        if (!/[a-zA-Z_]/.test(prevChar)) {
          return {
            text: str.slice(0, cutIdx) + after,
            cursor: cutIdx
          };
        }
      }
    }

    return {
      text: str.slice(0, start - 1) + after,
      cursor: start - 1
    };
  }

  function parseHistoryEntry(item) {
    const rawExpr = String(item?.expr || '');
    const modeMatch = rawExpr.match(/\s*\[(DEG|RAD)\]$/);
    const mode = modeMatch ? modeMatch[1] : (item?.mode || '');
    const cleanExpr = rawExpr.replace(/\s*\[(DEG|RAD)\]$/, '');
    return {
      expr: cleanExpr,
      mode,
      result: String(item?.result ?? '')
    };
  }

  function escapeAttr(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderFnPanelInner() {
    const activeCat = FUNCTION_CATEGORIES.find(c => c.id === calcState.activeFnCategory) || FUNCTION_CATEGORIES[0];
    return `
      <div class="calc-fn-sheet-grabber" aria-hidden="true"></div>
      <div class="calc-fn-panel-header">
        <strong class="calc-fn-panel-title">Catálogo de Funciones</strong>
        <button type="button" class="calc-fn-close-btn" id="btn-close-fn-panel" aria-label="Cerrar panel de funciones">✕</button>
      </div>
      <div class="calc-fn-tabs" role="tablist" aria-label="Categorías de funciones">
        ${FUNCTION_CATEGORIES.map(cat => `
          <button
            type="button"
            role="tab"
            class="calc-fn-tab ${cat.id === activeCat.id ? 'active' : ''}"
            data-fn-cat="${cat.id}"
            aria-selected="${cat.id === activeCat.id ? 'true' : 'false'}">
            ${cat.label}
          </button>
        `).join('')}
      </div>
      <div class="calc-fn-grid">
        ${activeCat.items.map(fn => `
          <button
            type="button"
            class="calc-fn-chip"
            data-fn-insert="${escapeAttr(fn.token)}"
            title="${escapeAttr(fn.desc)}">
            <span class="calc-fn-chip-label">${fn.label}</span>
            <span class="calc-fn-chip-desc">${fn.desc}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function removeFloatingSheet() {
    if (typeof document === 'undefined') return;
    document.getElementById('calc-fn-mobile-sheet-backdrop')?.remove();
  }

  function renderCalculatorView(container) {
    removeFloatingSheet();
    calcState.fnPanelOpen = false;
    const history = (ns.Storage && ns.Storage.getState().calcHistory) || [];

    container.innerHTML = `
      <div class="subject-header-card">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon">🧮</div>
            <div class="subject-title-text">
              <h1>Calculadora Científica</h1>
              <p>Trigonometría en grados (DEG / °) o radianes (RAD), logaritmos, factoriales, potencias, catálogo de funciones e historial editable.</p>
            </div>
          </div>
          <div class="calc-mode-switch">
            <button type="button" class="btn ${calcState.angleMode === 'DEG' ? 'btn-primary' : 'btn-outline'} btn-sm" id="btn-mode-deg">Modo DEG (Grados)</button>
            <button type="button" class="btn ${calcState.angleMode === 'RAD' ? 'btn-primary' : 'btn-outline'} btn-sm" id="btn-mode-rad">Modo RAD (Radianes)</button>
          </div>
        </div>
      </div>

      <div class="calc-layout">
        <div class="calculator-body">
          <div class="calc-screen">
            <div class="calc-screen-top">
              <span id="calc-mode-indicator">ÁNGULO: ${calcState.angleMode} | MEM: ${ns.MathParser.formatNumber(calcState.memory)}</span>
              <span>ANS = <b id="calc-ans-indicator">${ns.MathParser.formatNumber(calcState.lastAns)}</b></span>
            </div>
            <input
              type="text"
              id="calc-expr-input"
              class="calc-expression-line calc-expr-input"
              value="${escapeAttr(calcState.expression)}"
              placeholder="Escribe o inserta funciones en el cursor..."
              aria-label="Expresión matemática de la calculadora"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false" />
            <div class="calc-result-line ${calcState.isError ? 'is-error' : ''}" id="calc-result-display" aria-live="polite">${calcState.result}</div>
          </div>

          <!-- Barra de utilidades y acceso al catálogo de funciones -->
          <div class="calc-tools-bar">
            <span class="calc-cursor-hint">Edita en la posición del cursor o abre el catálogo:</span>
            <button
              type="button"
              class="btn btn-outline btn-sm calc-fn-toggle-btn"
              id="btn-toggle-fn-panel"
              aria-expanded="false">
              ƒ(x) Funciones ▾
            </button>
          </div>

          <!-- Panel de funciones en escritorio -->
          <div class="calc-fn-panel" id="calc-fn-desktop-panel" hidden></div>

          <!-- Fila de Memoria y Grados -->
          <div class="calc-memory-row">
            <button type="button" class="calc-key fn-key" data-mem="MC" title="Limpiar memoria">MC</button>
            <button type="button" class="calc-key fn-key" data-mem="MR" title="Insertar valor en memoria">MR</button>
            <button type="button" class="calc-key fn-key" data-mem="M+" title="Sumar resultado a memoria">M+</button>
            <button type="button" class="calc-key fn-key" data-mem="M-" title="Restar resultado a memoria">M−</button>
            <button type="button" class="calc-key fn-key" data-insert="ans" title="Insertar último resultado">ANS</button>
            <button type="button" class="calc-key fn-key" data-insert="°" title="Símbolo de grados sexagesimales">°</button>
          </div>

          <!-- Teclado Científico Completo -->
          <div class="calc-keypad-grid">
            <button type="button" class="calc-key fn-key" data-insert="sin(">sen</button>
            <button type="button" class="calc-key fn-key" data-insert="cos(">cos</button>
            <button type="button" class="calc-key fn-key" data-insert="tan(">tan</button>
            <button type="button" class="calc-key fn-key" data-insert="pi">π</button>
            <button type="button" class="calc-key fn-key" data-insert="e">e</button>
            <button type="button" class="calc-key danger-key" data-action="clear">AC</button>

            <button type="button" class="calc-key fn-key" data-insert="asin(">arcsen</button>
            <button type="button" class="calc-key fn-key" data-insert="acos(">arccos</button>
            <button type="button" class="calc-key fn-key" data-insert="atan(">arctg</button>
            <button type="button" class="calc-key fn-key" data-insert="(">(</button>
            <button type="button" class="calc-key fn-key" data-insert=")">)</button>
            <button type="button" class="calc-key danger-key" data-action="backspace" title="Borrar token o carácter anterior">⌫</button>

            <button type="button" class="calc-key fn-key" data-insert="^2">x²</button>
            <button type="button" class="calc-key fn-key" data-insert="^">xʸ</button>
            <button type="button" class="calc-key fn-key" data-insert="sqrt(">√x</button>
            <button type="button" class="calc-key num-key" data-insert="7">7</button>
            <button type="button" class="calc-key num-key" data-insert="8">8</button>
            <button type="button" class="calc-key num-key" data-insert="9">9</button>

            <button type="button" class="calc-key fn-key" data-insert="ln(">ln</button>
            <button type="button" class="calc-key fn-key" data-insert="log(">log₁₀</button>
            <button type="button" class="calc-key fn-key" data-insert="!">n!</button>
            <button type="button" class="calc-key num-key" data-insert="4">4</button>
            <button type="button" class="calc-key num-key" data-insert="5">5</button>
            <button type="button" class="calc-key num-key" data-insert="6">6</button>

            <button type="button" class="calc-key fn-key" data-insert="abs(">|x|</button>
            <button type="button" class="calc-key op-key" data-insert="*">×</button>
            <button type="button" class="calc-key op-key" data-insert="/">÷</button>
            <button type="button" class="calc-key num-key" data-insert="1">1</button>
            <button type="button" class="calc-key num-key" data-insert="2">2</button>
            <button type="button" class="calc-key num-key" data-insert="3">3</button>

            <button type="button" class="calc-key op-key" data-insert="+">+</button>
            <button type="button" class="calc-key op-key" data-insert="-">−</button>
            <button type="button" class="calc-key num-key" data-insert="0">0</button>
            <button type="button" class="calc-key num-key" data-insert=".">.</button>
            <button type="button" class="calc-key equal-key" data-action="evaluate">=</button>
          </div>

          <details class="precision-notice no-print">
            <summary class="precision-notice-summary">ⓘ Resultados aproximados</summary>
            <div class="precision-notice-body">
              <ul class="precision-notice-list">
                <li><strong>Coma flotante:</strong> las operaciones se evalúan en doble precisión IEEE 754 (~15–16 dígitos) y se muestran redondeadas hasta 8 decimales, con posibles errores diminutos de representación binaria (p. ej. <code>0.1 + 0.2</code>).</li>
                <li><strong>Modo y sintaxis:</strong> verifica siempre el modo angular activo (<code>DEG</code> o <code>RAD</code>); el símbolo <code>°</code>, la multiplicación implícita y el cierre automático de paréntesis al pulsar <code>=</code> siguen las reglas sintácticas de la herramienta.</li>
                <li><strong>Dominio y alcance:</strong> divisiones entre <code>0</code>, raíces pares de negativos o logaritmos de <code>≤ 0</code> producen error; es una herramienta de estudio y conviene contrastar cálculos críticos por vía analítica o CAS certificado.</li>
              </ul>
            </div>
          </details>
        </div>

        <!-- Historial de Cálculos -->
        <div class="calc-history-card">
          <div class="calc-history-header">
            <h3 class="calc-history-title">Historial de Cálculos</h3>
            <button type="button" class="btn btn-outline btn-sm" id="btn-clear-calc-hist">Limpiar</button>
          </div>
          <p class="calc-history-subtitle">Edita cualquier expresión anterior o inserta su resultado en la posición del cursor.</p>
          <div class="calc-history-list" id="calc-history-list">
            ${renderHistoryItems(history)}
          </div>
        </div>
      </div>
    `;

    calcState.cursorStart = calcState.expression.length;
    calcState.cursorEnd = calcState.expression.length;
    bindCalculatorEvents(container);
  }

  function renderHistoryItems(history) {
    if (!history || !history.length) {
      return `<div class="calc-history-empty">Aún no hay operaciones registradas.</div>`;
    }
    return history.map((item, idx) => {
      const parsed = parseHistoryEntry(item);
      return `
        <div class="calc-history-item" data-hist-idx="${idx}" tabindex="0" role="button" aria-label="Cargar operación ${escapeAttr(parsed.expr)}">
          <div class="calc-history-top-row">
            <span class="calc-history-expr">${escapeAttr(parsed.expr)}</span>
            ${parsed.mode ? `<span class="calc-history-mode">${parsed.mode}</span>` : ''}
          </div>
          <div class="calc-history-bottom-row">
            <span class="calc-history-res">= ${escapeAttr(parsed.result)}</span>
            <div class="calc-history-actions">
              <button type="button" class="calc-hist-btn" data-hist-edit="${idx}" title="Cargar expresión para editar">Editar</button>
              <button type="button" class="calc-hist-btn" data-hist-use-res="${idx}" title="Insertar este resultado en el cursor">Usar res.</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function bindCalculatorEvents(container) {
    const exprInput = container.querySelector('#calc-expr-input');
    const resDisplay = container.querySelector('#calc-result-display');
    const modeIndicator = container.querySelector('#calc-mode-indicator');
    const ansIndicator = container.querySelector('#calc-ans-indicator');
    const histList = container.querySelector('#calc-history-list');
    const btnToggleFn = container.querySelector('#btn-toggle-fn-panel');
    const desktopFnPanel = container.querySelector('#calc-fn-desktop-panel');

    function trackCursor() {
      if (!exprInput) return;
      if (typeof exprInput.selectionStart === 'number') {
        calcState.cursorStart = exprInput.selectionStart;
        calcState.cursorEnd = typeof exprInput.selectionEnd === 'number' ? exprInput.selectionEnd : exprInput.selectionStart;
      }
    }

    function syncScreen(restoreFocus = false) {
      if (exprInput) {
        exprInput.value = calcState.expression;
        if (restoreFocus && typeof exprInput.setSelectionRange === 'function') {
          const maxPos = calcState.expression.length;
          const posStart = Math.max(0, Math.min(maxPos, calcState.cursorStart));
          const posEnd = Math.max(posStart, Math.min(maxPos, calcState.cursorEnd));
          try {
            if (document.activeElement === exprInput) {
              exprInput.setSelectionRange(posStart, posEnd);
            }
          } catch (_) {
            // Ignorar si el navegador no soporta selección en input oculto
          }
        }
      }
      if (resDisplay) {
        resDisplay.textContent = calcState.result;
        resDisplay.classList.toggle('is-error', Boolean(calcState.isError));
        resDisplay.classList.remove('is-updating');
        void resDisplay.offsetWidth;
        resDisplay.classList.add('is-updating');
      }
      if (modeIndicator) {
        modeIndicator.textContent = `ÁNGULO: ${calcState.angleMode} | MEM: ${ns.MathParser.formatNumber(calcState.memory)}`;
      }
      if (ansIndicator) {
        ansIndicator.textContent = ns.MathParser.formatNumber(calcState.lastAns);
      }
    }

    function applyInsert(token) {
      const next = insertAtCursor(calcState.expression, calcState.cursorStart, calcState.cursorEnd, token);
      calcState.expression = next.text;
      calcState.cursorStart = next.cursor;
      calcState.cursorEnd = next.cursor;
      calcState.isError = false;
      syncScreen(true);
    }

    function applyBackspace() {
      const next = deleteTokenBeforeCursor(calcState.expression, calcState.cursorStart, calcState.cursorEnd);
      calcState.expression = next.text;
      calcState.cursorStart = next.cursor;
      calcState.cursorEnd = next.cursor;
      calcState.isError = false;
      syncScreen(true);
    }

    function isMobileViewport() {
      return typeof window !== 'undefined' && window.innerWidth <= 640;
    }

    function closeFnPanel() {
      calcState.fnPanelOpen = false;
      if (btnToggleFn) {
        btnToggleFn.setAttribute('aria-expanded', 'false');
        btnToggleFn.textContent = 'ƒ(x) Funciones ▾';
      }
      if (desktopFnPanel) desktopFnPanel.hidden = true;
      removeFloatingSheet();
      if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
        ns.App.syncModalScrollLock();
      }
    }

    function bindFnPanelEvents(panelRoot) {
      if (!panelRoot) return;
      panelRoot.querySelector('#btn-close-fn-panel')?.addEventListener('click', closeFnPanel);

      panelRoot.querySelectorAll('[data-fn-cat]').forEach(tab => {
        tab.addEventListener('click', () => {
          calcState.activeFnCategory = tab.getAttribute('data-fn-cat');
          renderFnPanel();
        });
      });

      panelRoot.querySelectorAll('[data-fn-insert]').forEach(btn => {
        btn.addEventListener('mousedown', (ev) => ev.preventDefault());
        btn.addEventListener('click', () => {
          const tok = btn.getAttribute('data-fn-insert');
          applyInsert(tok);
          if (isMobileViewport()) {
            closeFnPanel();
          }
        });
      });
    }

    function renderFnPanel() {
      if (!calcState.fnPanelOpen) {
        closeFnPanel();
        return;
      }
      if (btnToggleFn) {
        btnToggleFn.setAttribute('aria-expanded', 'true');
        btnToggleFn.textContent = 'ƒ(x) Funciones ▴';
      }

      if (isMobileViewport()) {
        if (desktopFnPanel) desktopFnPanel.hidden = true;
        removeFloatingSheet();
        const backdrop = document.createElement('div');
        backdrop.id = 'calc-fn-mobile-sheet-backdrop';
        backdrop.className = 'calc-fn-sheet-backdrop';
        backdrop.innerHTML = `
          <div class="calc-fn-sheet" role="dialog" aria-modal="true" aria-label="Catálogo de funciones matemáticas">
            ${renderFnPanelInner()}
          </div>
        `;
        backdrop.addEventListener('click', (ev) => {
          if (ev.target === backdrop) closeFnPanel();
        });
        document.body.appendChild(backdrop);
        bindFnPanelEvents(backdrop);
        if (ns.App && typeof ns.App.refreshScrollStrips === 'function') {
          ns.App.refreshScrollStrips(backdrop);
        }
        if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
          ns.App.syncModalScrollLock();
        }
      } else {
        removeFloatingSheet();
        if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
          ns.App.syncModalScrollLock();
        }
        if (desktopFnPanel) {
          desktopFnPanel.hidden = false;
          desktopFnPanel.innerHTML = renderFnPanelInner();
          bindFnPanelEvents(desktopFnPanel);
          if (ns.App && typeof ns.App.refreshScrollStrips === 'function') {
            ns.App.refreshScrollStrips(desktopFnPanel);
          }
        }
      }
    }

    function haptic(kind) {
      if (ns.Haptics && typeof ns.Haptics[kind] === 'function') {
        ns.Haptics[kind]();
      }
    }

    function runEvaluation() {
      const rawInput = calcState.expression.trim();
      if (!rawInput) return;

      // Cierre automático de paréntesis abiertos faltantes al evaluar
      const closed = typeof ns.MathParser.autoCloseParens === 'function'
        ? ns.MathParser.autoCloseParens(rawInput)
        : rawInput;

      if (closed !== calcState.expression) {
        calcState.expression = closed;
        calcState.cursorStart = closed.length;
        calcState.cursorEnd = closed.length;
      }

      try {
        const val = ns.MathParser.evaluate(closed, { ans: calcState.lastAns }, calcState.angleMode);
        if (isNaN(val)) {
          calcState.result = 'Error: operación indefinida (división entre cero o fuera de dominio)';
          calcState.isError = true;
          haptic('incorrect');
        } else {
          const formatted = ns.MathParser.formatNumber(val, 8);
          calcState.result = formatted;
          calcState.isError = false;
          haptic('confirm');
          if (isFinite(val)) {
            calcState.lastAns = val;
            ns.Storage.addCalcHistory(`${closed} [${calcState.angleMode}]`, formatted);
            if (histList) {
              histList.innerHTML = renderHistoryItems(ns.Storage.getState().calcHistory);
              bindHistoryClicks();
            }
          }
        }
      } catch (err) {
        calcState.result = (err && err.message) ? err.message : 'Sintaxis inválida';
        calcState.isError = true;
        haptic('incorrect');
      }
      syncScreen(true);
    }

    function bindHistoryClicks() {
      container.querySelectorAll('[data-hist-idx]').forEach(el => {
        const idx = Number(el.getAttribute('data-hist-idx'));
        const getParsed = () => {
          const item = ns.Storage.getState().calcHistory[idx];
          return item ? parseHistoryEntry(item) : null;
        };

        el.addEventListener('click', (ev) => {
          if (ev.target.closest('[data-hist-use-res]')) return;
          const parsed = getParsed();
          if (!parsed) return;
          calcState.expression = parsed.expr;
          calcState.result = parsed.result;
          calcState.isError = false;
          calcState.cursorStart = parsed.expr.length;
          calcState.cursorEnd = parsed.expr.length;
          syncScreen(true);
        });

        el.addEventListener('keydown', (ev) => {
          if (ev.target !== el) return;
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            el.click();
          }
        });

        el.querySelector('[data-hist-use-res]')?.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const parsed = getParsed();
          if (!parsed || !parsed.result) return;
          applyInsert(parsed.result);
        });
      });
    }

    // Seguimiento preciso del cursor dentro del input de texto libre
    ['input', 'click', 'keyup', 'select', 'focus'].forEach(evtName => {
      exprInput?.addEventListener(evtName, () => {
        if (evtName === 'input') {
          calcState.expression = exprInput.value;
          calcState.isError = false;
        }
        trackCursor();
      });
    });

    exprInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runEvaluation();
      }
    });

    // Cambio de modo DEG / RAD
    const btnDeg = container.querySelector('#btn-mode-deg');
    const btnRad = container.querySelector('#btn-mode-rad');
    btnDeg?.addEventListener('click', () => {
      haptic('light');
      calcState.angleMode = 'DEG';
      btnDeg.className = 'btn btn-primary btn-sm';
      btnRad.className = 'btn btn-outline btn-sm';
      syncScreen();
    });
    btnRad?.addEventListener('click', () => {
      haptic('light');
      calcState.angleMode = 'RAD';
      btnRad.className = 'btn btn-primary btn-sm';
      btnDeg.className = 'btn btn-outline btn-sm';
      syncScreen();
    });

    // Botón del panel de funciones por categorías
    btnToggleFn?.addEventListener('mousedown', (ev) => ev.preventDefault());
    btnToggleFn?.addEventListener('click', () => {
      haptic('confirm');
      calcState.fnPanelOpen = !calcState.fnPanelOpen;
      renderFnPanel();
    });

    function pulseKey(btn) {
      if (!btn || !btn.classList) return;
      btn.classList.remove('is-pressed');
      void btn.offsetWidth;
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 160);
    }

    // Inserción en la posición del cursor
    container.querySelectorAll('[data-insert]').forEach(btn => {
      btn.addEventListener('mousedown', (ev) => ev.preventDefault());
      btn.addEventListener('click', () => {
        pulseKey(btn);
        haptic('light');
        applyInsert(btn.getAttribute('data-insert'));
      });
    });

    // Acciones AC, Backspace inteligente, Evaluar
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('mousedown', (ev) => ev.preventDefault());
      btn.addEventListener('click', () => {
        pulseKey(btn);
        const act = btn.getAttribute('data-action');
        if (act === 'clear') {
          haptic('light');
          calcState.expression = '';
          calcState.result = '0';
          calcState.isError = false;
          calcState.cursorStart = 0;
          calcState.cursorEnd = 0;
          syncScreen(true);
        } else if (act === 'backspace') {
          haptic('light');
          applyBackspace();
        } else if (act === 'evaluate') {
          runEvaluation();
        }
      });
    });

    // Botones de Memoria
    container.querySelectorAll('[data-mem]').forEach(btn => {
      btn.addEventListener('mousedown', (ev) => ev.preventDefault());
      btn.addEventListener('click', () => {
        pulseKey(btn);
        haptic('light');
        const op = btn.getAttribute('data-mem');
        const currentVal = !calcState.isError ? (parseFloat(calcState.result) || 0) : 0;
        if (op === 'MC') {
          calcState.memory = 0;
          syncScreen();
        } else if (op === 'MR') {
          applyInsert(ns.MathParser.formatNumber(calcState.memory, 6));
        } else if (op === 'M+') {
          calcState.memory += currentVal;
          syncScreen();
        } else if (op === 'M-') {
          calcState.memory -= currentVal;
          syncScreen();
        }
      });
    });

    // Limpiar historial
    container.querySelector('#btn-clear-calc-hist')?.addEventListener('click', () => {
      ns.Storage.clearCalcHistory();
      if (histList) histList.innerHTML = renderHistoryItems([]);
    });

    if (activeEscapeHandler) {
      document.removeEventListener('keydown', activeEscapeHandler, true);
    }
    activeEscapeHandler = (ev) => {
      if (ev.key === 'Escape' && calcState.fnPanelOpen && document.body.contains(container)) {
        ev.stopPropagation();
        closeFnPanel();
      }
    };
    document.addEventListener('keydown', activeEscapeHandler, true);

    bindHistoryClicks();
  }

  ns.CalculatorTool = {
    renderCalculatorView,
    insertAtCursor,
    deleteTokenBeforeCursor,
    parseHistoryEntry,
    FUNCTION_CATEGORIES
  };
})(window.MatInteractiva);
