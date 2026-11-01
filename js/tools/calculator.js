/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Calculadora Científica Interactiva
   Archivo: js/tools/calculator.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const calcState = {
    expression: '',
    result: '0',
    angleMode: 'DEG', // 'DEG' o 'RAD'
    memory: 0,
    lastAns: 0
  };

  function renderCalculatorView(container) {
    const history = ns.Storage.getState().calcHistory || [];

    container.innerHTML = `
      <div class="subject-header-card">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon">🧮</div>
            <div class="subject-title-text">
              <h1>Calculadora Científica</h1>
              <p>Trigonometría en grados o radianes, logaritmos, factoriales, potencias, constantes, registros de memoria e historial persistente.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn ${calcState.angleMode === 'DEG' ? 'btn-primary' : 'btn-outline'} btn-sm" id="btn-mode-deg">Modo DEG (Grados)</button>
            <button class="btn ${calcState.angleMode === 'RAD' ? 'btn-primary' : 'btn-outline'} btn-sm" id="btn-mode-rad">Modo RAD (Radianes)</button>
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
            <input type="text" id="calc-expr-input" class="calc-expression-line"
              style="background:transparent; border:none; outline:none; width:100%;"
              value="${calcState.expression}" placeholder="Escribe o pulsa los botones..." />
            <div class="calc-result-line" id="calc-result-display">${calcState.result}</div>
          </div>

          <!-- Fila de Memoria -->
          <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:0.5rem; margin-bottom:0.65rem;">
            <button class="calc-key fn-key" data-mem="MC">MC</button>
            <button class="calc-key fn-key" data-mem="MR">MR</button>
            <button class="calc-key fn-key" data-mem="M+">M+</button>
            <button class="calc-key fn-key" data-mem="M-">M−</button>
            <button class="calc-key fn-key" data-insert="ans">ANS</button>
          </div>

          <!-- Teclado Científico Completo -->
          <div class="calc-keypad-grid">
            <button class="calc-key fn-key" data-insert="sin(">sen</button>
            <button class="calc-key fn-key" data-insert="cos(">cos</button>
            <button class="calc-key fn-key" data-insert="tan(">tan</button>
            <button class="calc-key fn-key" data-insert="pi">π</button>
            <button class="calc-key fn-key" data-insert="e">e</button>
            <button class="calc-key danger-key" data-action="clear">AC</button>

            <button class="calc-key fn-key" data-insert="asin(">arcsen</button>
            <button class="calc-key fn-key" data-insert="acos(">arccos</button>
            <button class="calc-key fn-key" data-insert="atan(">arctg</button>
            <button class="calc-key fn-key" data-insert="(">(</button>
            <button class="calc-key fn-key" data-insert=")">)</button>
            <button class="calc-key danger-key" data-action="backspace">⌫</button>

            <button class="calc-key fn-key" data-insert="^2">x²</button>
            <button class="calc-key fn-key" data-insert="^">xʸ</button>
            <button class="calc-key fn-key" data-insert="sqrt(">√x</button>
            <button class="calc-key num-key" data-insert="7">7</button>
            <button class="calc-key num-key" data-insert="8">8</button>
            <button class="calc-key num-key" data-insert="9">9</button>

            <button class="calc-key fn-key" data-insert="ln(">ln</button>
            <button class="calc-key fn-key" data-insert="log(">log₁₀</button>
            <button class="calc-key fn-key" data-insert="!">n!</button>
            <button class="calc-key num-key" data-insert="4">4</button>
            <button class="calc-key num-key" data-insert="5">5</button>
            <button class="calc-key num-key" data-insert="6">6</button>

            <button class="calc-key fn-key" data-insert="abs(">|x|</button>
            <button class="calc-key op-key" data-insert="*">×</button>
            <button class="calc-key op-key" data-insert="/">÷</button>
            <button class="calc-key num-key" data-insert="1">1</button>
            <button class="calc-key num-key" data-insert="2">2</button>
            <button class="calc-key num-key" data-insert="3">3</button>

            <button class="calc-key op-key" data-insert="+">+</button>
            <button class="calc-key op-key" data-insert="-">−</button>
            <button class="calc-key num-key" data-insert="0">0</button>
            <button class="calc-key num-key" data-insert=".">.</button>
            <button class="calc-key equal-key" data-action="evaluate">=</button>
          </div>
        </div>

        <!-- Historial de Cálculos -->
        <div class="calc-history-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-size:0.95rem; font-weight:700;">Historial de Cálculos</h3>
            <button class="btn btn-outline btn-sm" id="btn-clear-calc-hist">Limpiar</button>
          </div>
          <p style="font-size:0.78rem; color:var(--text-muted);">Haz clic en cualquier operación previa para reutilizarla.</p>
          <div class="calc-history-list" id="calc-history-list">
            ${renderHistoryItems(history)}
          </div>
        </div>
      </div>
    `;

    bindCalculatorEvents(container);
  }

  function renderHistoryItems(history) {
    if (!history || !history.length) {
      return `<div style="font-size:0.84rem; color:var(--text-muted); padding:1rem 0; text-align:center;">Aún no hay operaciones registradas.</div>`;
    }
    return history.map((item, idx) => `
      <div class="calc-history-item" data-hist-idx="${idx}">
        <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">${item.expr}</div>
        <div style="font-family:var(--font-mono); font-size:0.96rem; font-weight:700; color:var(--primary-700); text-align:right;">= ${item.result}</div>
      </div>
    `).join('');
  }

  function bindCalculatorEvents(container) {
    const exprInput = container.querySelector('#calc-expr-input');
    const resDisplay = container.querySelector('#calc-result-display');
    const modeIndicator = container.querySelector('#calc-mode-indicator');
    const ansIndicator = container.querySelector('#calc-ans-indicator');
    const histList = container.querySelector('#calc-history-list');

    function syncScreen() {
      if (exprInput) exprInput.value = calcState.expression;
      if (resDisplay) resDisplay.textContent = calcState.result;
      if (modeIndicator) {
        modeIndicator.textContent = `ÁNGULO: ${calcState.angleMode} | MEM: ${ns.MathParser.formatNumber(calcState.memory)}`;
      }
      if (ansIndicator) {
        ansIndicator.textContent = ns.MathParser.formatNumber(calcState.lastAns);
      }
    }

    function runEvaluation() {
      const raw = calcState.expression.trim();
      if (!raw) return;
      try {
        const val = ns.MathParser.evaluate(raw, { ans: calcState.lastAns }, calcState.angleMode);
        if (isNaN(val)) {
          calcState.result = 'Error matemático';
        } else {
          const formatted = ns.MathParser.formatNumber(val, 8);
          calcState.result = formatted;
          calcState.lastAns = val;
          ns.Storage.addCalcHistory(`${raw} [${calcState.angleMode}]`, formatted);
          if (histList) {
            histList.innerHTML = renderHistoryItems(ns.Storage.getState().calcHistory);
            bindHistoryClicks(container, syncScreen);
          }
        }
      } catch (err) {
        calcState.result = 'Sintaxis inválida';
      }
      syncScreen();
    }

    // Cambio de modo DEG / RAD
    const btnDeg = container.querySelector('#btn-mode-deg');
    const btnRad = container.querySelector('#btn-mode-rad');
    btnDeg?.addEventListener('click', () => {
      calcState.angleMode = 'DEG';
      btnDeg.className = 'btn btn-primary btn-sm';
      btnRad.className = 'btn btn-outline btn-sm';
      syncScreen();
    });
    btnRad?.addEventListener('click', () => {
      calcState.angleMode = 'RAD';
      btnRad.className = 'btn btn-primary btn-sm';
      btnDeg.className = 'btn btn-outline btn-sm';
      syncScreen();
    });

    // Inserción de símbolos
    container.querySelectorAll('[data-insert]').forEach(btn => {
      btn.addEventListener('click', () => {
        const token = btn.getAttribute('data-insert');
        calcState.expression += token;
        syncScreen();
      });
    });

    // Acciones AC, Backspace, Evaluar
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-action');
        if (act === 'clear') {
          calcState.expression = '';
          calcState.result = '0';
          syncScreen();
        } else if (act === 'backspace') {
          calcState.expression = calcState.expression.slice(0, -1);
          syncScreen();
        } else if (act === 'evaluate') {
          runEvaluation();
        }
      });
    });

    // Botones de Memoria
    container.querySelectorAll('[data-mem]').forEach(btn => {
      btn.addEventListener('click', () => {
        const op = btn.getAttribute('data-mem');
        const currentVal = parseFloat(calcState.result) || 0;
        if (op === 'MC') calcState.memory = 0;
        else if (op === 'MR') calcState.expression += ns.MathParser.formatNumber(calcState.memory, 6);
        else if (op === 'M+') calcState.memory += currentVal;
        else if (op === 'M-') calcState.memory -= currentVal;
        syncScreen();
      });
    });

    // Entrada directa por teclado en el input
    exprInput?.addEventListener('input', () => {
      calcState.expression = exprInput.value;
    });
    exprInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runEvaluation();
      }
    });

    // Limpiar historial
    container.querySelector('#btn-clear-calc-hist')?.addEventListener('click', () => {
      ns.Storage.clearCalcHistory();
      if (histList) histList.innerHTML = renderHistoryItems([]);
    });

    bindHistoryClicks(container, syncScreen);
  }

  function bindHistoryClicks(container, syncScreen) {
    container.querySelectorAll('[data-hist-idx]').forEach(el => {
      el.addEventListener('click', () => {
        const idx = Number(el.getAttribute('data-hist-idx'));
        const item = ns.Storage.getState().calcHistory[idx];
        if (item) {
          calcState.expression = item.expr.replace(/\s*\[(DEG|RAD)\]$/, '');
          calcState.result = item.result;
          syncScreen();
        }
      });
    });
  }

  ns.CalculatorTool = {
    renderCalculatorView
  };
})(window.MatInteractiva);
