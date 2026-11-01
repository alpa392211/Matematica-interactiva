/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Herramienta de Resolución Guiada Paso a Paso
   Archivo: js/tools/guided-solver.js
   Permite ingresar problemas propios o aleatorios y avanzar paso a paso
   sin revelar la respuesta inmediatamente, permitiendo intentar primero.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const solverState = {
    mode: 'quadratic', // 'fractions' | 'gcd' | 'linear' | 'quadratic' | 'system2x2' | 'triangle' | 'calculus'
    currentSolution: null,
    revealedSteps: 1,
    studentAttempt: '',
    attemptFeedback: null
  };

  function renderGuidedSolverView(container) {
    container.innerHTML = `
      <div class="subject-header-card">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon">🧭</div>
            <div class="subject-title-text">
              <h1>Resolución Guiada de Ejercicios Paso a Paso</h1>
              <p>Ingresa tu propio problema matemático o genera uno de práctica. Intenta resolverlo primero y descubre el procedimiento paso a paso.</p>
            </div>
          </div>
        </div>

        <div class="topics-bar" id="solver-type-bar">
          <button class="topic-selector-btn ${solverState.mode === 'quadratic' ? 'active' : ''}" data-solver-mode="quadratic">Ecuación Cuadrática</button>
          <button class="topic-selector-btn ${solverState.mode === 'linear' ? 'active' : ''}" data-solver-mode="linear">Ecuación Lineal</button>
          <button class="topic-selector-btn ${solverState.mode === 'system2x2' ? 'active' : ''}" data-solver-mode="system2x2">Sistema 2×2</button>
          <button class="topic-selector-btn ${solverState.mode === 'fractions' ? 'active' : ''}" data-solver-mode="fractions">Fracciones</button>
          <button class="topic-selector-btn ${solverState.mode === 'gcd' ? 'active' : ''}" data-solver-mode="gcd">MCD y MCM</button>
          <button class="topic-selector-btn ${solverState.mode === 'triangle' ? 'active' : ''}" data-solver-mode="triangle">Pitágoras y Trigonometría</button>
          <button class="topic-selector-btn ${solverState.mode === 'calculus' ? 'active' : ''}" data-solver-mode="calculus">Derivada, Límite e Integral</button>
        </div>
      </div>

      <div class="two-col-grid">
        <!-- Configuración del Problema -->
        <div class="content-card">
          <h2>1. Configura los Datos del Problema</h2>
          <div id="solver-form-area"></div>
          <div style="display:flex; gap:0.65rem; flex-wrap:wrap; margin-top:1.1rem;">
            <button class="btn btn-primary" id="btn-start-guided">🚀 Iniciar Resolución Guiada</button>
            <button class="btn btn-outline" id="btn-random-problem">🎲 Generar Valores Aleatorios</button>
          </div>
        </div>

        <!-- Panel de Intento del Estudiante y Pasos Guiados -->
        <div class="content-card" id="solver-workspace-card">
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

    switch (solverState.mode) {
      case 'quadratic':
        formArea.innerHTML = `
          <p class="theory-paragraph">${ns.MathRenderer.formatRichText('Resuelve la ecuación de segundo grado $ax^2 + bx + c = 0$:')}</p>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem;">
            <div><small>Coeficiente a (x²)</small><input type="number" id="sq-a" class="exercise-input" style="width:100%;" value="1" /></div>
            <div><small>Coeficiente b (x)</small><input type="number" id="sq-b" class="exercise-input" style="width:100%;" value="-5" /></div>
            <div><small>Término indep. c</small><input type="number" id="sq-c" class="exercise-input" style="width:100%;" value="6" /></div>
          </div>
        `;
        break;

      case 'linear':
        formArea.innerHTML = `
          <p class="theory-paragraph">${ns.MathRenderer.formatRichText('Resuelve la ecuación lineal $ax + b = cx + d$:')}</p>
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.75rem;">
            <div><small>Coeficiente a (izq)</small><input type="number" id="sl-a" class="exercise-input" style="width:100%;" value="5" /></div>
            <div><small>Constante b (izq)</small><input type="number" id="sl-b" class="exercise-input" style="width:100%;" value="-3" /></div>
            <div><small>Coeficiente c (der)</small><input type="number" id="sl-c" class="exercise-input" style="width:100%;" value="2" /></div>
            <div><small>Constante d (der)</small><input type="number" id="sl-d" class="exercise-input" style="width:100%;" value="9" /></div>
          </div>
        `;
        break;

      case 'system2x2':
        formArea.innerHTML = `
          <p class="theory-paragraph">${ns.MathRenderer.formatRichText('Sistema lineal $a_1x + b_1y = c_1$ y $a_2x + b_2y = c_2$:')}</p>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.65rem;">
            <div><small>a₁</small><input type="number" id="ss-a1" class="exercise-input" style="width:100%;" value="2" /></div>
            <div><small>b₁</small><input type="number" id="ss-b1" class="exercise-input" style="width:100%;" value="1" /></div>
            <div><small>c₁</small><input type="number" id="ss-c1" class="exercise-input" style="width:100%;" value="8" /></div>
            <div><small>a₂</small><input type="number" id="ss-a2" class="exercise-input" style="width:100%;" value="1" /></div>
            <div><small>b₂</small><input type="number" id="ss-b2" class="exercise-input" style="width:100%;" value="-1" /></div>
            <div><small>c₂</small><input type="number" id="ss-c2" class="exercise-input" style="width:100%;" value="1" /></div>
          </div>
        `;
        break;

      case 'fractions':
        formArea.innerHTML = `
          <p class="theory-paragraph">${ns.MathRenderer.formatRichText('Operación con dos fracciones $\\frac{a}{b} \\;(\\text{op})\\; \\frac{c}{d}$:')}</p>
          <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:0.75rem; align-items:center;">
            <div>
              <input type="number" id="sf-a" class="exercise-input" style="width:100%; margin-bottom:0.35rem;" value="3" placeholder="Numerador 1" />
              <input type="number" id="sf-b" class="exercise-input" style="width:100%;" value="4" placeholder="Denominador 1" />
            </div>
            <select id="sf-op" class="exercise-input" style="min-width:70px; text-align:center;">
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
            <div>
              <input type="number" id="sf-c" class="exercise-input" style="width:100%; margin-bottom:0.35rem;" value="5" placeholder="Numerador 2" />
              <input type="number" id="sf-d" class="exercise-input" style="width:100%;" value="6" placeholder="Denominador 2" />
            </div>
          </div>
        `;
        break;

      case 'gcd':
        formArea.innerHTML = `
          <p class="theory-paragraph">Descomposición prima, MCD y MCM de dos enteros positivos:</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div><small>Primer número</small><input type="number" id="sg-a" class="exercise-input" style="width:100%;" value="36" /></div>
            <div><small>Segundo número</small><input type="number" id="sg-b" class="exercise-input" style="width:100%;" value="48" /></div>
          </div>
        `;
        break;

      case 'triangle':
        formArea.innerHTML = `
          <p class="theory-paragraph">${ns.MathRenderer.formatRichText('Resolución completa de triángulo rectángulo dados sus dos catetos $a$ y $b$:')}</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div><small>Cateto opuesto (a)</small><input type="number" id="st-a" class="exercise-input" style="width:100%;" value="6" /></div>
            <div><small>Cateto adyacente (b)</small><input type="number" id="st-b" class="exercise-input" style="width:100%;" value="8" /></div>
          </div>
        `;
        break;

      case 'calculus':
        formArea.innerHTML = `
          <p class="theory-paragraph">${ns.MathRenderer.formatRichText('Analiza límite, derivada, recta tangente en $x_0$ e integral definida en $[a, b]$:')}</p>
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            <div><small>Función f(x)</small><input type="text" id="sc-fn" class="exercise-input" style="width:100%;" value="x^2 + 2*x + 1" /></div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.65rem;">
              <div><small>Punto x₀</small><input type="number" id="sc-x0" class="exercise-input" style="width:100%;" value="1" /></div>
              <div><small>Límite inf. a</small><input type="number" id="sc-a" class="exercise-input" style="width:100%;" value="0" /></div>
              <div><small>Límite sup. b</small><input type="number" id="sc-b" class="exercise-input" style="width:100%;" value="3" /></div>
            </div>
          </div>
        `;
        break;
    }
  }

  function computeCurrentSolution(container) {
    try {
      let sol;
      const val = (id) => container.querySelector(id)?.value;

      if (solverState.mode === 'quadratic') {
        sol = ns.StepSolver.solveQuadraticEquation(val('#sq-a'), val('#sq-b'), val('#sq-c'));
      } else if (solverState.mode === 'linear') {
        sol = ns.StepSolver.solveLinearEquation(val('#sl-a'), val('#sl-b'), val('#sl-c'), val('#sl-d'));
      } else if (solverState.mode === 'system2x2') {
        sol = ns.StepSolver.solveSystem2x2(val('#ss-a1'), val('#ss-b1'), val('#ss-c1'), val('#ss-a2'), val('#ss-b2'), val('#ss-c2'));
      } else if (solverState.mode === 'fractions') {
        sol = ns.StepSolver.solveFractions(val('#sf-a'), val('#sf-b'), val('#sf-op'), val('#sf-c'), val('#sf-d'));
      } else if (solverState.mode === 'gcd') {
        sol = ns.StepSolver.solveGcdLcm(val('#sg-a'), val('#sg-b'));
      } else if (solverState.mode === 'triangle') {
        sol = ns.StepSolver.solveRightTriangle(val('#st-a'), val('#st-b'));
      } else if (solverState.mode === 'calculus') {
        sol = ns.StepSolver.solveCalculusFunction(val('#sc-fn'), val('#sc-x0'), val('#sc-a'), val('#sc-b'));
      }

      solverState.currentSolution = sol;
      solverState.revealedSteps = 1; // Empezar mostrando solo el planteamiento inicial (Paso 1)
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
      <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-md); padding:0.9rem 1.1rem; margin-bottom:1rem;">
        <div style="font-size:0.76rem; font-weight:700; text-transform:uppercase; color:var(--primary-700);">Problema Activo</div>
        <div style="font-size:1rem; font-weight:700; color:var(--primary-900);">${sol.problemTitle}</div>
      </div>

      <!-- Intento del Estudiante antes de ver la respuesta final -->
      <div style="margin-bottom:1.15rem; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-surface-alt);">
        <div style="font-size:0.85rem; font-weight:700; margin-bottom:0.45rem;">
          ✍️ Pon a prueba tu cálculo antes de desbloquear todos los pasos:
        </div>
        <div class="exercise-input-row">
          <input type="text" id="inp-guided-attempt" class="exercise-input" value="${solverState.studentAttempt}"
            placeholder="Escribe tu respuesta (ej: ${sol.finalAnswer.length > 15 ? 'tu resultado' : 'valor numérico'})..." />
          <button class="btn btn-primary btn-sm" id="btn-check-guided">Comprobar Mi Respuesta</button>
        </div>
        ${solverState.attemptFeedback ? `
          <div class="feedback-banner ${solverState.attemptFeedback.isCorrect ? 'success' : 'error'}">
            <span>${solverState.attemptFeedback.message}</span>
          </div>
        ` : ''}
      </div>

      <!-- Lista Progresiva de Pasos -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
        <span style="font-size:0.84rem; font-weight:700; color:var(--text-secondary);">
          Progreso Guiado: Paso ${solverState.revealedSteps} de ${totalSteps}
        </span>
        <div style="display:flex; gap:0.5rem;">
          ${!allRevealed ? `
            <button class="btn btn-warning btn-sm" id="btn-next-step">
              💡 Desbloquear Siguiente Paso (${solverState.revealedSteps + 1}/${totalSteps})
            </button>
          ` : `
            <span class="badge-level basico">✓ Procedimiento Completo Desbloqueado</span>
          `}
        </div>
      </div>

      <div class="steps-container" style="padding:0;">
        ${sol.steps.map((st, idx) => {
          const isUnlocked = idx < solverState.revealedSteps;
          return `
            <div class="math-step-item ${isUnlocked ? 'active-step' : 'locked-step'}">
              <div class="step-number-badge">${idx + 1}</div>
              <div class="step-body">
                <div class="step-explanation">${st.title}</div>
                <div class="step-math-work">${ns.MathRenderer.renderMath(st.math)}</div>
                <div class="step-reason">${st.reason}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${allRevealed ? `
        <div class="formula-showcase" style="margin-top:1.1rem; border-color:var(--success-500); background:var(--success-50);">
          <span class="formula-label" style="color:var(--success-700);">Conclusión y Resultado Final</span>
          <div class="formula-expression" style="color:var(--success-700);">${ns.MathRenderer.renderMath(sol.finalMath)}</div>
        </div>
      ` : ''}
    `;

    // Eventos del panel de pasos
    out.querySelector('#btn-next-step')?.addEventListener('click', () => {
      if (solverState.revealedSteps < totalSteps) {
        solverState.revealedSteps++;
        renderGuidedSteps(container);
      }
    });

    const attemptInp = out.querySelector('#inp-guided-attempt');
    out.querySelector('#btn-check-guided')?.addEventListener('click', () => {
      solverState.studentAttempt = attemptInp ? attemptInp.value : '';
      const check = ns.MathParser.checkStudentAnswer(solverState.studentAttempt, sol.finalAnswer);
      solverState.attemptFeedback = check;
      if (check.isCorrect) {
        solverState.revealedSteps = totalSteps;
      } else if (solverState.revealedSteps < totalSteps) {
        // Si falla, desbloqueamos el siguiente paso como pista progresiva
        solverState.revealedSteps++;
        solverState.attemptFeedback.message += ' Se ha desbloqueado el siguiente paso como pista para ayudarte.';
      }
      renderGuidedSteps(container);
    });
  }

  function bindSolverEvents(container) {
    container.querySelectorAll('[data-solver-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        solverState.mode = btn.getAttribute('data-solver-mode');
        solverState.studentAttempt = '';
        container.querySelectorAll('[data-solver-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFormForMode(container);
        computeCurrentSolution(container);
      });
    });

    container.querySelector('#btn-start-guided')?.addEventListener('click', () => {
      solverState.studentAttempt = '';
      computeCurrentSolution(container);
    });

    container.querySelector('#btn-random-problem')?.addEventListener('click', () => {
      randomizeInputs(container);
      solverState.studentAttempt = '';
      computeCurrentSolution(container);
    });
  }

  function randomizeInputs(container) {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const setVal = (sel, v) => {
      const el = container.querySelector(sel);
      if (el) el.value = v;
    };

    if (solverState.mode === 'quadratic') {
      const r1 = randInt(-5, 6);
      const r2 = randInt(-4, 7);
      setVal('#sq-a', 1);
      setVal('#sq-b', -(r1 + r2));
      setVal('#sq-c', r1 * r2);
    } else if (solverState.mode === 'linear') {
      const xSol = randInt(-6, 9);
      const a = randInt(3, 8);
      const c = randInt(1, a - 1);
      const b = randInt(-10, 10);
      const d = (a - c) * xSol + b;
      setVal('#sl-a', a);
      setVal('#sl-b', b);
      setVal('#sl-c', c);
      setVal('#sl-d', d);
    } else if (solverState.mode === 'system2x2') {
      const x = randInt(1, 6);
      const y = randInt(1, 6);
      setVal('#ss-a1', 2); setVal('#ss-b1', 1); setVal('#ss-c1', 2 * x + y);
      setVal('#ss-a2', 1); setVal('#ss-b2', -1); setVal('#ss-c2', x - y);
    } else if (solverState.mode === 'fractions') {
      setVal('#sf-a', randInt(1, 7));
      setVal('#sf-b', randInt(2, 8));
      setVal('#sf-c', randInt(1, 7));
      setVal('#sf-d', randInt(2, 8));
    } else if (solverState.mode === 'gcd') {
      const base = randInt(4, 12);
      setVal('#sg-a', base * randInt(2, 5));
      setVal('#sg-b', base * randInt(3, 7));
    } else if (solverState.mode === 'triangle') {
      const triples = [[3, 4], [5, 12], [6, 8], [8, 15], [9, 12]];
      const pair = triples[randInt(0, triples.length - 1)];
      setVal('#st-a', pair[0]);
      setVal('#st-b', pair[1]);
    } else if (solverState.mode === 'calculus') {
      const c2 = randInt(1, 3);
      const c1 = randInt(-4, 4);
      setVal('#sc-fn', `${c2}*x^2 + (${c1})*x + 1`);
      setVal('#sc-x0', randInt(1, 3));
    }
  }

  ns.GuidedSolverTool = {
    renderGuidedSolverView
  };
})(window.MatInteractiva);
