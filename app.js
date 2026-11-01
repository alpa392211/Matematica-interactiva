/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Controlador Principal de la Aplicación
   Archivo: js/app.js
   Implementa la estructura didáctica de 9 etapas por tema, gráficas
   interactivas integradas en cada lección, ejercicios con vista previa
   matemática en vivo y retroalimentación diagnóstica, y panel de progreso.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const appState = {
    currentView: 'dashboard', // 'dashboard' | 'subject' | 'tool'
    activeSubjectId: 'aritmetica',
    activeTopicId: 'arit-1',
    activeTab: 'teoria',      // 'teoria' | 'ejemplos' | 'ejercicios' | 'evaluacion'
    difficultyFilter: 'todos',// 'todos' | 'basico' | 'intermedio' | 'avanzado'
    activeToolId: 'graficador',
    toolPresetExpr: null,
    exampleStepProgress: {},  // { [exampleKey]: visibleStepCount }
    exerciseFeedback: {},     // { [exerciseId]: { type, message, reviewTip, whyCorrect, showSolution, lastInput } }
    exerciseShowGraph: {},    // { [exerciseId]: boolean }
    exerciseShowKeyboard: {}, // { [exerciseId]: boolean }
    quizSelections: {},       // { [topicId]: { [qIdx]: optionIdx } }
    quizSubmitted: {}         // { [topicId]: boolean }
  };

  function init() {
    renderSidebar();
    updateHeaderStats();
    bindGlobalHeaderEvents();
    navigateToDashboard();
  }

  /* ------------------------------------------------------------------------
     1. Menú Lateral y Cabecera Superior
     ------------------------------------------------------------------------ */
  function renderSidebar() {
    const curriculum = ns.Curriculum || [];
    const stats = ns.Storage.computeProgressStats(curriculum);
    const navContainer = document.getElementById('sidebar-nav-container');
    if (!navContainer) return;

    const toolsList = [
      { id: 'formularios', name: 'Formularios matemáticos', icon: '📄' },
      { id: 'graficador', name: 'Graficador de funciones', icon: '📈' },
      { id: 'calculadora', name: 'Calculadora científica', icon: '🧮' },
      { id: 'editor', name: 'Editor de expresiones', icon: '∑' },
      { id: 'solucionador', name: 'Resolución guiada', icon: '🧭' }
    ];

    navContainer.innerHTML = `
      <div>
        <div class="nav-section-title">Inicio</div>
        <ul class="nav-list">
          <li>
            <button class="nav-item ${appState.currentView === 'dashboard' ? 'active' : ''}" data-nav-dashboard="true">
              <span class="nav-icon">📊</span>
              <span class="nav-label">Panel Principal</span>
            </button>
          </li>
        </ul>
      </div>

      <div>
        <div class="nav-section-title">Materias (${curriculum.length} Módulos)</div>
        <ul class="nav-list">
          ${curriculum.map(subj => {
            const subjStat = stats.bySubject[subj.id] || { percentage: 0 };
            const isActive = appState.currentView === 'subject' && appState.activeSubjectId === subj.id;
            return `
              <li>
                <button class="nav-item ${isActive ? 'active' : ''}" data-nav-subject="${subj.id}">
                  <span class="nav-icon">${subj.symbol}</span>
                  <span class="nav-label">${subj.name}</span>
                  <span class="nav-badge ${subjStat.percentage === 100 ? 'completed' : ''}">${subjStat.percentage}%</span>
                </button>
              </li>
            `;
          }).join('')}
        </ul>
      </div>

      <div>
        <div class="nav-section-title">Herramientas Interactivas</div>
        <ul class="nav-list">
          ${toolsList.map(t => {
            const isActive = appState.currentView === 'tool' && appState.activeToolId === t.id;
            return `
              <li>
                <button class="nav-item ${isActive ? 'active' : ''}" data-nav-tool="${t.id}">
                  <span class="nav-icon">${t.icon}</span>
                  <span class="nav-label">${t.name}</span>
                </button>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `;

    const pctText = document.getElementById('sidebar-global-pct');
    const pctFill = document.getElementById('sidebar-global-fill');
    if (pctText) pctText.textContent = `${stats.globalPercentage}%`;
    if (pctFill) pctFill.style.width = `${stats.globalPercentage}%`;

    navContainer.querySelector('[data-nav-dashboard]')?.addEventListener('click', () => {
      closeMobileSidebar();
      navigateToDashboard();
    });

    navContainer.querySelectorAll('[data-nav-subject]').forEach(btn => {
      btn.addEventListener('click', () => {
        const subjId = btn.getAttribute('data-nav-subject');
        closeMobileSidebar();
        openSubject(subjId);
      });
    });

    navContainer.querySelectorAll('[data-nav-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const toolId = btn.getAttribute('data-nav-tool');
        closeMobileSidebar();
        openTool(toolId);
      });
    });
  }

  function updateHeaderStats() {
    const stats = ns.Storage.computeProgressStats(ns.Curriculum || []);
    const xpEl = document.getElementById('header-xp-pill');
    const streakEl = document.getElementById('header-streak-pill');
    if (xpEl) xpEl.innerHTML = `${stats.rank.badge} ${stats.xp} XP`;
    if (streakEl) streakEl.innerHTML = `🔥 ${stats.streakDays} ${stats.streakDays === 1 ? 'día' : 'días'}`;
  }

  function setBreadcrumb(html) {
    const bc = document.getElementById('header-breadcrumb');
    if (bc) bc.innerHTML = html;
    const backBtn = document.getElementById('btn-header-back');
    if (backBtn) {
      backBtn.hidden = /Panel Principal/i.test(String(html));
    }
  }

  function closeMobileSidebar() {
    document.getElementById('app-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
  }

  function bindGlobalHeaderEvents() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    document.getElementById('btn-open-sidebar')?.addEventListener('click', () => {
      sidebar?.classList.add('open');
      overlay?.classList.add('active');
    });

    document.getElementById('btn-close-sidebar')?.addEventListener('click', closeMobileSidebar);
    overlay?.addEventListener('click', closeMobileSidebar);
    document.getElementById('btn-header-back')?.addEventListener('click', () => {
      closeMobileSidebar();
      navigateToDashboard();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMobileSidebar();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeMobileSidebar();
    });

    const searchInp = document.getElementById('global-search-input');
    const dropdown = document.getElementById('global-search-dropdown');

    if (searchInp && dropdown) {
      searchInp.addEventListener('input', () => {
        const q = searchInp.value.trim().toLowerCase();
        if (!q) {
          dropdown.classList.remove('open');
          return;
        }

        const results = [];
        for (const subj of (ns.Curriculum || [])) {
          for (const topic of subj.topics) {
            if (
              topic.title.toLowerCase().includes(q) ||
              topic.summary.toLowerCase().includes(q) ||
              subj.name.toLowerCase().includes(q)
            ) {
              results.push({ subjId: subj.id, subjName: subj.name, topicId: topic.id, topicTitle: topic.title });
            }
          }
        }

        if (!results.length) {
          dropdown.innerHTML = `<div class="search-result-item"><span class="search-result-title">Sin resultados para "${searchInp.value}"</span></div>`;
        } else {
          dropdown.innerHTML = results.slice(0, 8).map(r => `
            <div class="search-result-item" data-search-subj="${r.subjId}" data-search-topic="${r.topicId}">
              <span class="search-result-title">${r.topicTitle}</span>
              <span class="search-result-meta">Módulo: ${r.subjName}</span>
            </div>
          `).join('');

          dropdown.querySelectorAll('[data-search-subj]').forEach(item => {
            item.addEventListener('click', () => {
              const sId = item.getAttribute('data-search-subj');
              const tId = item.getAttribute('data-search-topic');
              dropdown.classList.remove('open');
              searchInp.value = '';
              openSubject(sId, tId);
            });
          });
        }
        dropdown.classList.add('open');
      });

      document.addEventListener('click', (e) => {
        if (!searchInp.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    }

    const modal = document.getElementById('quick-tool-modal');
    const modalBody = document.getElementById('quick-tool-modal-body');

    document.getElementById('btn-open-quick-calc')?.addEventListener('click', () => {
      if (!modal || !modalBody) return;
      modal.classList.add('open');
      ns.CalculatorTool.renderCalculatorView(modalBody);
    });

    document.getElementById('btn-close-quick-modal')?.addEventListener('click', () => {
      modal?.classList.remove('open');
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  /* ------------------------------------------------------------------------
     2. Vista del Panel Principal (Dashboard de Aprendizaje y Progreso)
     ------------------------------------------------------------------------ */
  function navigateToDashboard() {
    appState.currentView = 'dashboard';
    renderSidebar();
    updateHeaderStats();
    setBreadcrumb(`<span>Inicio</span> <span>›</span> <strong>Panel Principal de Aprendizaje</strong>`);

    const main = document.getElementById('main-view-container');
    if (!main) return;

    const curriculum = ns.Curriculum || [];
    const stats = ns.Storage.computeProgressStats(curriculum);
    const lastSubj = curriculum.find(s => s.id === stats.lastVisited.subjectId) || curriculum[0];
    const lastTopic = lastSubj.topics.find(t => t.id === stats.lastVisited.topicId) || lastSubj.topics[0];

    main.innerHTML = `
      <!-- Banner de Bienvenida -->
      <section class="hero-banner">
        <div class="hero-content">
          <div class="hero-badge">
            <span>${stats.rank.badge} Rango actual: ${stats.rank.title} · 🔥 Racha de estudio: ${stats.streakDays} ${stats.streakDays === 1 ? 'día' : 'días'}</span>
          </div>
          <h1 class="hero-title">Bienvenido a Matemática Interactiva</h1>
          <p class="hero-description">
            Plataforma académica de Álgebra y Cálculo Diferencial e Integral con representación matemática profesional,
            laboratorios gráficos interactivos, resolución paso a paso y ejercicios con diagnóstico inteligente.
          </p>
          <div class="hero-actions">
            <button class="btn btn-white" id="btn-hero-continue">
              ▶ Continuar: ${lastSubj.name} — ${lastTopic.title}
            </button>
            <button class="btn btn-glass" id="btn-hero-limits">
              lim Explorar Límites
            </button>
            <button class="btn btn-glass" id="btn-hero-derivatives">
              f'(x) Explorar Derivadas
            </button>
            <button class="btn btn-glass" id="btn-hero-integrals">
              ∫ Explorar Integrales
            </button>
            <button class="btn btn-glass" id="btn-hero-formulas">
              📄 Formularios Imprimibles
            </button>
          </div>
        </div>
      </section>

      <!-- Estadísticas de Aprendizaje (Progreso, Temas Estudiados, Ejercicios, Evaluaciones y Racha) -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-box blue">📊</div>
          <div class="stat-info">
            <span class="stat-value">${stats.globalPercentage}%</span>
            <span class="stat-label">Avance Global</span>
            <span class="stat-subtext">${stats.studiedTopicsCount} de ${stats.totalTopics} temas estudiados (${stats.pendingTopics.length} pendientes)</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box green">✓</div>
          <div class="stat-info">
            <span class="stat-value">${stats.totalSolved} / ${stats.totalExercises}</span>
            <span class="stat-label">Ejercicios Completados</span>
            <span class="stat-subtext">Básico: ${stats.byLevel.basico} · Interm: ${stats.byLevel.intermedio} · Avanz: ${stats.byLevel.avanzado}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box amber">🏆</div>
          <div class="stat-info">
            <span class="stat-value">${stats.totalQuizzesDone} / ${stats.totalTopics}</span>
            <span class="stat-label">Evaluaciones Superadas</span>
            <span class="stat-subtext">Comprobación formal por tema</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box indigo">🔥</div>
          <div class="stat-info">
            <span class="stat-value">${stats.streakDays} ${stats.streakDays === 1 ? 'día' : 'días'}</span>
            <span class="stat-label">Racha de Estudio (${stats.xp} XP)</span>
            <span class="stat-subtext">Rango: ${stats.rank.title}</span>
          </div>
        </div>
      </section>

      <!-- Acceso Destacado: Formularios Matemáticos de Estudio e Impresión (Tamaño Carta / PDF) -->
      <section class="content-card" style="margin-bottom:0; background:linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border:1px solid var(--primary-200);">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap;">
          <div style="flex:1; min-width:260px;">
            <div style="display:inline-flex; align-items:center; gap:0.4rem; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--primary-700); background:#dbeafe; padding:0.2rem 0.6rem; border-radius:999px; margin-bottom:0.45rem;">
              📄 Nuevo · Estudio e Impresión Tamaño Carta / PDF
            </div>
            <h2 style="margin-bottom:0.3rem;">Formularios Matemáticos Académicos</h2>
            <p class="theory-paragraph" style="margin-bottom:0;">
              Consulta o imprime en papel tamaño carta hojas de referencia rigurosas con todas las fórmulas, significado de variables y restricciones de dominio: por materia individual o en compendio general unificado.
            </p>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button class="btn btn-primary" id="btn-dash-formulas-topic" type="button">
              📑 Formularios por Tema
            </button>
            <button class="btn btn-outline" id="btn-dash-formulas-general" type="button" style="background:#ffffff;">
              📚 Formulario General (Compendio PDF)
            </button>
          </div>
        </div>
      </section>

      <!-- Módulos de Estudio (Las 9 Materias) -->
      <section>
        <div class="section-header">
          <div>
            <h2 class="section-title">📚 Módulos Académicos y Avance por Materia</h2>
            <p class="section-subtitle">Cada tema incluye las 9 etapas didácticas: introducción, prerrequisitos, teoría, fórmulas, gráfica interactiva, ejemplos, errores frecuentes, práctica y evaluación.</p>
          </div>
        </div>

        <div class="modules-grid">
          ${curriculum.map(subj => {
            const safeTopicsLen = Array.isArray(subj.topics) ? subj.topics.length : 0;
            const st = stats.bySubject[subj.id] || { exercisesSolved: 0, exercisesTotal: 0, topicsStudied: 0, topicsTotal: safeTopicsLen, topicsCount: safeTopicsLen, percentage: 0 };
            const totalTopicsForCard = st.topicsTotal ?? st.topicsCount ?? safeTopicsLen;
            return `
              <article class="module-card" style="--module-color: ${subj.color}" data-card-subject="${subj.id}">
                <div>
                  <div class="module-card-top">
                    <div class="module-symbol">${subj.symbol}</div>
                    <span class="module-level-tag">${subj.levelTag}</span>
                  </div>
                  <h3 class="module-title" style="margin-top:0.85rem;">${subj.name}</h3>
                  <p class="module-desc">${subj.shortDesc}</p>
                </div>

                <div class="module-topics-preview">
                  ${subj.topics.map(t => `<span class="topic-chip">${t.title}</span>`).join('')}
                </div>

                <div class="module-card-footer">
                  <div class="module-progress-row">
                    <span>${st.topicsStudied ?? 0}/${totalTopicsForCard} temas · ${st.exercisesSolved ?? 0}/${st.exercisesTotal ?? 0} ejerc.</span>
                    <span>${st.percentage ?? 0}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width: ${st.percentage ?? 0}%"></div>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Seguimiento Detallado: Temas Pendientes y Resultados de Evaluaciones -->
      <section class="two-col-grid">
        <div class="content-card" style="margin-bottom:0;">
          <h2>📌 Temas Pendientes y Ruta Sugerida (${stats.pendingTopics.length})</h2>
          <p class="theory-paragraph">Temas con ejercicios o evaluación final aún por completar:</p>
          ${stats.pendingTopics.length ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:280px; overflow-y:auto; padding-right:0.25rem;">
              ${stats.pendingTopics.slice(0, 8).map(pt => `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem; padding:0.55rem 0.75rem; background:var(--bg-surface-alt); border:1px solid var(--border-light); border-radius:var(--radius-sm);">
                  <div>
                    <div style="font-size:0.84rem; font-weight:700; color:var(--text-main);">${pt.topicTitle}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">
                      <strong>${pt.subjectName}</strong> · Ejercicios: ${pt.solvedCount}/${pt.totalCount} · Evaluación: ${pt.quizDone ? '✓ Superada' : 'Pendiente'}
                    </div>
                  </div>
                  <button class="btn btn-outline btn-sm" data-open-pending-subj="${pt.subjectId}" data-open-pending-topic="${pt.topicId}">
                    Estudiar →
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="feedback-banner success">
              🎉 ¡Felicidades! Has completado todos los temas, ejercicios y evaluaciones de la plataforma.
            </div>
          `}
        </div>

        <div class="content-card" style="margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h2>🏆 Resultados de Evaluaciones y Actividad</h2>
            ${stats.quizResultsList && stats.quizResultsList.length ? `
              <div style="margin-bottom:0.85rem;">
                <div style="font-size:0.76rem; font-weight:700; text-transform:uppercase; color:var(--primary-700); margin-bottom:0.35rem;">Calificaciones de Evaluaciones:</div>
                <div style="display:flex; flex-direction:column; gap:0.4rem; max-height:140px; overflow-y:auto;">
                  ${stats.quizResultsList.map(qr => `
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; padding:0.4rem 0.6rem; background:var(--primary-50); border-radius:var(--radius-sm);">
                      <span><strong>${qr.subjectName}:</strong> ${qr.topicTitle}</span>
                      <span class="badge-level ${qr.percentage >= 80 ? 'basico' : 'intermedio'}">${qr.percentage}% (${qr.score}/${qr.total})</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : `
              <p class="theory-paragraph" style="margin-bottom:0.65rem;">
                Aún no has enviado evaluaciones de tema. Completa la etapa 9 de cualquier lección para registrar tus calificaciones aquí.
              </p>
            `}

            ${stats.recentActivity.length ? `
              <div style="font-size:0.76rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.35rem;">Historial Reciente:</div>
              <ul style="display:flex; flex-direction:column; gap:0.45rem;">
                ${stats.recentActivity.slice(0, 4).map(act => `
                  <li style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; padding:0.45rem 0.65rem; background:var(--bg-surface-alt); border-radius:var(--radius-sm);">
                    <span style="font-weight:600; color:var(--text-secondary);">${act.title}</span>
                    <span style="color:var(--primary-700); font-weight:700; white-space:nowrap; margin-left:0.5rem;">+${act.xp} XP</span>
                  </li>
                `).join('')}
              </ul>
            ` : ''}
          </div>

          <div style="border-top:1px solid var(--border-light); padding-top:0.85rem; margin-top:1rem; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.76rem; color:var(--text-muted);">Progreso guardado en localStorage</span>
            <button class="btn btn-outline btn-sm" id="btn-reset-progress">Reiniciar Progreso</button>
          </div>
        </div>
      </section>

      <!-- Laboratorio de Herramientas Interactivas -->
      <section class="content-card" style="margin-bottom:0;">
        <h2>🛠️ Laboratorio de Herramientas Interactivas</h2>
        <p class="theory-paragraph">Instrumentos matemáticos listos para experimentar en cualquier momento:</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.85rem;">
          <div class="concept-box" style="cursor:pointer;" data-dash-tool="formularios">
            <div class="concept-box-title">📄 Formularios Matemáticos</div>
            <div class="concept-box-body">Hojas de referencia por tema y compendio general listas para imprimir en tamaño carta o PDF.</div>
          </div>
          <div class="concept-box" style="cursor:pointer;" data-dash-tool="graficador">
            <div class="concept-box-title">📈 Graficador de Funciones</div>
            <div class="concept-box-body">Traza curvas múltiples, rectas tangentes, derivadas e integrales definidas sombreadas.</div>
          </div>
          <div class="concept-box" style="cursor:pointer;" data-dash-tool="calculadora">
            <div class="concept-box-title">🧮 Calculadora Científica</div>
            <div class="concept-box-body">Funciones trigonométricas en DEG/RAD, logaritmos, factoriales, memorias e historial.</div>
          </div>
          <div class="concept-box" style="cursor:pointer;" data-dash-tool="editor">
            <div class="concept-box-title">∑ Editor de Expresiones</div>
            <div class="concept-box-body">Construye fórmulas con fracciones, raíces, límites, derivadas e integrales en tiempo real.</div>
          </div>
          <div class="concept-box" style="cursor:pointer;" data-dash-tool="solucionador">
            <div class="concept-box-title">🧭 Resolución Guiada</div>
            <div class="concept-box-body">Ingresa tus propios ejercicios y desbloquea su procedimiento paso a paso.</div>
          </div>
        </div>
      </section>
    `;

    // Eventos del Dashboard
    main.querySelector('#btn-hero-continue')?.addEventListener('click', () => {
      openSubject(lastSubj.id, lastTopic.id);
    });
    main.querySelector('#btn-hero-limits')?.addEventListener('click', () => {
      openSubject('limites', 'lim-1');
    });
    main.querySelector('#btn-hero-derivatives')?.addEventListener('click', () => {
      openSubject('derivadas', 'der-1');
    });
    main.querySelector('#btn-hero-integrals')?.addEventListener('click', () => {
      openSubject('integrales', 'int-1');
    });
    main.querySelector('#btn-hero-formulas')?.addEventListener('click', () => {
      openTool('formularios');
    });
    main.querySelector('#btn-dash-formulas-topic')?.addEventListener('click', () => {
      openTool('formularios', 'aritmetica');
    });
    main.querySelector('#btn-dash-formulas-general')?.addEventListener('click', () => {
      openTool('formularios', 'general');
    });

    main.querySelectorAll('[data-card-subject]').forEach(card => {
      card.addEventListener('click', () => {
        openSubject(card.getAttribute('data-card-subject'));
      });
    });

    main.querySelectorAll('[data-open-pending-subj]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-open-pending-subj');
        const tId = btn.getAttribute('data-open-pending-topic');
        openSubject(sId, tId);
      });
    });

    main.querySelectorAll('[data-dash-tool]').forEach(box => {
      box.addEventListener('click', () => {
        openTool(box.getAttribute('data-dash-tool'));
      });
    });

    main.querySelector('#btn-reset-progress')?.addEventListener('click', () => {
      if (window.confirm('¿Deseas reiniciar a cero tus estadísticas, ejercicios resueltos y puntos XP?')) {
        ns.Storage.resetAllProgress();
        appState.exerciseFeedback = {};
        appState.quizSelections = {};
        appState.quizSubmitted = {};
        navigateToDashboard();
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------------
     3. Vista de Materia y Estructura Didáctica de 9 Etapas por Tema
     ------------------------------------------------------------------------ */
  function openSubject(subjectId, topicId = null, tab = 'teoria') {
    const curriculum = ns.Curriculum || [];
    const subj = curriculum.find(s => s.id === subjectId) || curriculum[0];
    const topic = (topicId && subj.topics.find(t => t.id === topicId)) || subj.topics[0];

    appState.currentView = 'subject';
    appState.activeSubjectId = subj.id;
    appState.activeTopicId = topic.id;
    appState.activeTab = tab;

    ns.Storage.markTopicStudied(subj.id, topic.id, topic.title);
    renderSidebar();
    updateHeaderStats();
    setBreadcrumb(`
      <span style="cursor:pointer;" id="bc-home">Inicio</span>
      <span>›</span>
      <span>${subj.name}</span>
      <span>›</span>
      <strong>${topic.title}</strong>
    `);
    document.getElementById('bc-home')?.addEventListener('click', navigateToDashboard);

    renderSubjectWorkspace(subj, topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderSubjectWorkspace(subj, topic) {
    const main = document.getElementById('main-view-container');
    if (!main) return;

    main.innerHTML = `
      <!-- Cabecera de la Materia y Selector de Temas -->
      <div class="subject-header-card">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon" style="background:${subj.color}">${subj.symbol}</div>
            <div class="subject-title-text">
              <h1>${subj.name}: ${topic.title}</h1>
              <p>${ns.MathRenderer.formatRichText(topic.summary)}</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" id="btn-topic-formula-sheet">
              📄 Abrir Formulario Imprimible de ${subj.name}
            </button>
            ${topic.graphPreset ? `
              <button class="btn btn-outline btn-sm" id="btn-topic-graph">
                ${ns.MathRenderer.formatRichText(`📈 Abrir en Graficador: $f(x) = ${ns.MathRenderer.algebraicToLatex(topic.graphPreset)}$`)}
              </button>
            ` : ''}
            <button class="btn btn-outline btn-sm" id="btn-topic-editor">
              ∑ Editor Matemático
            </button>
          </div>
        </div>

        <div class="topics-bar">
          ${subj.topics.map((t, idx) => `
            <button class="topic-selector-btn ${t.id === topic.id ? 'active' : ''}" data-select-topic="${t.id}">
              <span class="topic-num">${idx + 1}</span>
              <span>${t.title}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Pestañas Pedagógicas del Tema (Cubriendo las 9 Etapas Didácticas) -->
      <div class="learning-tabs">
        <button class="learning-tab-btn ${appState.activeTab === 'teoria' ? 'active' : ''}" data-tab="teoria">
          📖 1–5. Teoría, Fórmulas y Gráfica Interactiva
        </button>
        <button class="learning-tab-btn ${appState.activeTab === 'ejemplos' ? 'active' : ''}" data-tab="ejemplos">
          🔍 6–7. Ejemplos Paso a Paso y Errores (${topic.examples.length})
        </button>
        <button class="learning-tab-btn ${appState.activeTab === 'ejercicios' ? 'active' : ''}" data-tab="ejercicios">
          ✏️ 8. Ejercicios Interactivos (${topic.exercises.length})
        </button>
        <button class="learning-tab-btn ${appState.activeTab === 'evaluacion' ? 'active' : ''}" data-tab="evaluacion">
          🏆 9. Evaluación Final (${topic.quiz.length})
        </button>
      </div>

      <!-- Contenedor Dinámico de la Pestaña Activa -->
      <div id="topic-tab-content"></div>
    `;

    main.querySelector('#btn-topic-formula-sheet')?.addEventListener('click', () => {
      openTool('formularios', subj.id);
    });

    main.querySelector('#btn-topic-graph')?.addEventListener('click', () => {
      openTool('graficador', topic.graphPreset);
    });

    main.querySelector('#btn-topic-editor')?.addEventListener('click', () => {
      openTool('editor');
    });

    main.querySelectorAll('[data-select-topic]').forEach(btn => {
      btn.addEventListener('click', () => {
        const newTopicId = btn.getAttribute('data-select-topic');
        openSubject(subj.id, newTopicId, appState.activeTab);
      });
    });

    main.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.activeTab = btn.getAttribute('data-tab');
        main.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderActiveTopicTab(subj, topic);
      });
    });

    renderActiveTopicTab(subj, topic);
  }

  function renderActiveTopicTab(subj, topic) {
    const box = document.getElementById('topic-tab-content');
    if (!box) return;

    if (appState.activeTab === 'teoria') {
      renderTheoryTab(box, subj, topic);
    } else if (appState.activeTab === 'ejemplos') {
      renderExamplesTab(box, subj, topic);
    } else if (appState.activeTab === 'ejercicios') {
      renderExercisesTab(box, subj, topic);
    } else if (appState.activeTab === 'evaluacion') {
      renderQuizTab(box, subj, topic);
    }
  }

  /* --- Pestaña 1: Etapas 1 a 5 (+ vista rápida de 6 y 7) --- */
  function renderTheoryTab(box, subj, topic) {
    const th = topic.theory || {};
    const prereqs = th.prerequisites || [];
    const detailed = th.detailedExplanation || [];
    const concepts = th.concepts || [];
    const formulas = th.formulas || [];
    const mistakes = topic.commonMistakes || [];

    box.innerHTML = `
      <!-- ETAPA 1: INTRODUCCIÓN -->
      <div class="content-card">
        <div class="didactic-step-badge"><span>1</span> Etapa 1 de 9 · Introducción</div>
        <h2>¿Qué es este concepto y para qué sirve?</h2>
        ${(th.intro || []).map(p => `<p class="theory-paragraph">${ns.MathRenderer.formatRichText(p)}</p>`).join('')}

        <!-- ETAPA 2: CONOCIMIENTOS PREVIOS NECESARIOS -->
        ${prereqs.length ? `
          <div style="margin-top:1.35rem;">
            <div class="didactic-step-badge"><span>2</span> Etapa 2 de 9 · Conocimientos Previos</div>
            <div class="prereq-box">
              <div class="prereq-box-title">📋 Conocimientos previos necesarios antes de comenzar</div>
              <ul class="prereq-list">
                ${prereqs.map(pr => `<li>${ns.MathRenderer.formatRichText(pr)}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}

        <!-- ETAPA 3: EXPLICACIÓN TEÓRICA DETALLADA -->
        <div style="margin-top:1.45rem;">
          <div class="didactic-step-badge"><span>3</span> Etapa 3 de 9 · Explicación Teórica Detallada</div>
          <h2>Desarrollo Teórico Progresivo desde Cero</h2>
          ${detailed.map(p => `<p class="theory-paragraph">${ns.MathRenderer.formatRichText(p)}</p>`).join('')}

          <div class="concept-grid" style="margin-top:1rem;">
            ${concepts.map(c => `
              <div class="concept-box">
                <div class="concept-box-title">${ns.MathRenderer.formatRichText(c.title)}</div>
                <div class="concept-box-body">${ns.MathRenderer.formatRichText(c.body)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ETAPA 4: FÓRMULAS Y PROPIEDADES FUNDAMENTALES -->
        ${formulas.length ? `
          <div style="margin-top:1.5rem;">
            <div class="didactic-step-badge"><span>4</span> Etapa 4 de 9 · Fórmulas y Propiedades Fundamentales</div>
            <h2>Formulario Esencial y Restricciones de Dominio</h2>
            ${formulas.map(f => `
              <div class="formula-showcase">
                <span class="formula-label">${ns.MathRenderer.formatRichText(f.label)}</span>
                <div class="formula-expression">${ns.MathRenderer.renderMath(f.expr, true)}</div>
                <span class="formula-note">${ns.MathRenderer.formatRichText(f.note)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- ETAPA 5: INTERPRETACIÓN GRÁFICA INTERACTIVA -->
      <div class="content-card">
        <div class="didactic-step-badge"><span>5</span> Etapa 5 de 9 · Interpretación Gráfica Interactiva</div>
        <h2>Visualización y Experimentación Geométrica en Vivo</h2>
        <div id="lesson-interactive-graph-mount"></div>
      </div>

      <!-- ETAPA 7 (Resumen en Teoría): ERRORES FRECUENTES Y CÓMO EVITARLOS -->
      ${mistakes.length ? `
        <div class="content-card">
          <div class="didactic-step-badge"><span>7</span> Etapa 7 de 9 · Prevención de Errores Algebraicos y de Cálculo</div>
          <h2>⚠️ Errores Frecuentes y Cómo Evitarlos</h2>
          <div class="mistakes-grid">
            ${mistakes.map(m => `
              <div class="mistake-card">
                ${m.title ? `<div style="font-size:0.86rem; font-weight:700; color:var(--text-main);">${ns.MathRenderer.formatRichText(m.title)}</div>` : ''}
                <div class="mistake-wrong">
                  <strong>❌ Procedimiento Incorrecto:</strong>
                  <div>${ns.MathRenderer.formatRichText(m.wrong)}</div>
                </div>
                <div class="mistake-correct">
                  <strong>✅ Procedimiento Correcto:</strong>
                  <div>${ns.MathRenderer.formatRichText(m.correct || m.right)}</div>
                </div>
                <div class="mistake-why">
                  💡 <strong>Por qué ocurre:</strong> ${ns.MathRenderer.formatRichText(m.why || m.advice)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin-top:1.2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <span style="font-size:0.84rem; color:var(--text-muted);">
          Continúa con la Etapa 6 (Ejemplos resueltos paso a paso) y la Etapa 8 (Ejercicios interactivos).
        </span>
        <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
          <button class="btn btn-primary" id="btn-go-examples">
            Ir a Etapa 6: Ejemplos Resueltos Paso a Paso →
          </button>
          <button class="btn btn-outline" id="btn-go-exercises-direct">
            Ir a Etapa 8: Ejercicios de Práctica →
          </button>
        </div>
      </div>
    `;

    // Montar la gráfica interactiva del tema
    const graphMount = box.querySelector('#lesson-interactive-graph-mount');
    if (graphMount && ns.LessonGraphs) {
      const graphConfig = topic.interactiveGraph || {
        mode: subj.id === 'limites' ? 'limits' : subj.id === 'derivadas' ? 'derivatives' : subj.id === 'integrales' ? 'integrals' : 'general',
        title: `Explorador Gráfico: ${topic.title}`,
        fn: topic.graphPreset || 'x^2'
      };
      ns.LessonGraphs.renderInteractiveWidget(graphMount, graphConfig);
    }

    box.querySelector('#btn-go-examples')?.addEventListener('click', () => {
      appState.activeTab = 'ejemplos';
      renderSubjectWorkspace(subj, topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    box.querySelector('#btn-go-exercises-direct')?.addEventListener('click', () => {
      appState.activeTab = 'ejercicios';
      renderSubjectWorkspace(subj, topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Pestaña 2: Etapa 6 (Ejemplos Resueltos Paso a Paso) y Etapa 7 (Errores Frecuentes) --- */
  function renderExamplesTab(box, subj, topic) {
    const mistakes = topic.commonMistakes || [];

    box.innerHTML = `
      <div>
        <div class="content-card" style="margin-bottom:1.1rem;">
          <div class="didactic-step-badge"><span>6</span> Etapa 6 de 9 · Ejemplos Resueltos Paso a Paso</div>
          <h2 style="margin-bottom:0.25rem;">Procedimientos Matemáticos Justificados Paso a Paso</h2>
          <p class="theory-paragraph" style="margin-bottom:0;">
            Avanza paso a paso para analizar qué operación algebraica o propiedad de cálculo se aplica en cada transformación, o despliega todos los pasos simultáneamente.
          </p>
        </div>

        ${topic.examples.map((ex, exIdx) => {
          const key = `${topic.id}-exmp-${exIdx}`;
          const total = ex.steps.length;
          if (!appState.exampleStepProgress[key]) {
            appState.exampleStepProgress[key] = total; // Mostrar pasos claros desde el inicio con opción a repetir paso a paso
          }
          const currentStep = appState.exampleStepProgress[key];

          return `
            <div class="step-procedure-card">
              <div class="step-procedure-header">
                <div>
                  <span class="badge-level basico" style="margin-bottom:0.3rem; display:inline-block;">Ejemplo Resuelto #${exIdx + 1}</span>
                  <div class="step-procedure-title">${ns.MathRenderer.formatRichText(ex.title)}</div>
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                  ${currentStep < total ? `
                    <button class="btn btn-primary btn-sm" data-next-ex-step="${key}" data-max="${total}">
                      ▶ Siguiente Paso (${currentStep}/${total})
                    </button>
                    <button class="btn btn-outline btn-sm" data-all-ex-step="${key}" data-max="${total}">
                      Mostrar Todos
                    </button>
                  ` : `
                    <button class="btn btn-outline btn-sm" data-reset-ex-step="${key}">
                      ↺ Estudiar Paso a Paso (1/${total})
                    </button>
                  `}
                </div>
              </div>

              <div class="steps-container">
                <div style="font-size:0.96rem; font-weight:600; color:var(--text-main); padding-bottom:0.5rem; border-bottom:1px solid var(--border-light);">
                  ${ns.MathRenderer.formatRichText(ex.problem)}
                </div>

                ${ex.steps.map((st, sIdx) => {
                  const unlocked = sIdx < currentStep;
                  return `
                    <div class="math-step-item ${unlocked ? 'active-step' : 'locked-step'}">
                      <div class="step-number-badge">${sIdx + 1}</div>
                      <div class="step-body">
                        <div class="step-explanation">${ns.MathRenderer.formatRichText(st.title)}</div>
                        <div class="step-math-work">${ns.MathRenderer.renderMath(st.math, true)}</div>
                        <div class="step-reason">📌 Justificación: ${ns.MathRenderer.formatRichText(st.reason)}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}

        ${mistakes.length ? `
          <div class="content-card" style="margin-top:1.25rem;">
            <div class="didactic-step-badge"><span>7</span> Etapa 7 de 9 · Errores Frecuentes y Cómo Evitarlos</div>
            <h2>⚠️ Errores Frecuentes al Resolver este Tipo de Problemas</h2>
            <div class="mistakes-grid">
              ${mistakes.map(m => `
                <div class="mistake-card">
                  ${m.title ? `<div style="font-size:0.86rem; font-weight:700; color:var(--text-main);">${ns.MathRenderer.formatRichText(m.title)}</div>` : ''}
                  <div class="mistake-wrong">
                    <strong>❌ Error frecuente:</strong>
                    <div>${ns.MathRenderer.formatRichText(m.wrong)}</div>
                  </div>
                  <div class="mistake-correct">
                    <strong>✅ Cómo hacerlo correctamente:</strong>
                    <div>${ns.MathRenderer.formatRichText(m.correct || m.right)}</div>
                  </div>
                  <div class="mistake-why">
                    💡 <strong>Explicación:</strong> ${ns.MathRenderer.formatRichText(m.why || m.advice)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="display:flex; justify-content:space-between; margin-top:1.25rem;">
          <button class="btn btn-outline" id="btn-back-theory">← Volver a Teoría y Gráfica</button>
          <button class="btn btn-primary" id="btn-go-exercises">Ir a Etapa 8: Ejercicios de Práctica →</button>
        </div>
      </div>
    `;

    box.querySelectorAll('[data-next-ex-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-next-ex-step');
        const max = Number(btn.getAttribute('data-max'));
        appState.exampleStepProgress[k] = Math.min(max, (appState.exampleStepProgress[k] || 1) + 1);
        renderExamplesTab(box, subj, topic);
      });
    });

    box.querySelectorAll('[data-all-ex-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-all-ex-step');
        const max = Number(btn.getAttribute('data-max'));
        appState.exampleStepProgress[k] = max;
        renderExamplesTab(box, subj, topic);
      });
    });

    box.querySelectorAll('[data-reset-ex-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-reset-ex-step');
        appState.exampleStepProgress[k] = 1;
        renderExamplesTab(box, subj, topic);
      });
    });

    box.querySelector('#btn-back-theory')?.addEventListener('click', () => {
      appState.activeTab = 'teoria';
      renderSubjectWorkspace(subj, topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    box.querySelector('#btn-go-exercises')?.addEventListener('click', () => {
      appState.activeTab = 'ejercicios';
      renderSubjectWorkspace(subj, topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Pestaña 3: Etapa 8 (Ejercicios Interactivos con MathLive, Teclado de 6 Categorías y Diagnóstico) --- */
  function renderExercisesTab(box, subj, topic) {
    const storageState = ns.Storage.getState();
    const filtered = topic.exercises.filter(ex =>
      appState.difficultyFilter === 'todos' ? true : ex.level === appState.difficultyFilter
    );

    const levelLabels = {
      basico: 'Nivel Básico',
      intermedio: 'Nivel Intermedio',
      avanzado: 'Nivel Avanzado'
    };

    const quickSymbols = [
      { label: 'a/b', val: '()/()', latexTemplate: '\\frac{#?}{#?}', cursorOffset: 1, title: 'Fracción (numerador)/(denominador)' },
      { label: '√x', val: 'sqrt()', latexTemplate: '\\sqrt{#?}', cursorOffset: 5, title: 'Raíz cuadrada' },
      { label: 'ⁿ√x', val: 'raiz(3, )', latexTemplate: '\\sqrt[#?]{#?}', cursorOffset: 8, title: 'Raíz n-ésima' },
      { label: 'x²', val: '^2', latexTemplate: '{#?}^{2}', cursorOffset: 2, title: 'Al cuadrado' },
      { label: 'x³', val: '^3', latexTemplate: '{#?}^{3}', cursorOffset: 2, title: 'Al cubo' },
      { label: 'xⁿ', val: '^()', latexTemplate: '{#?}^{#?}', cursorOffset: 2, title: 'Exponente' },
      { label: '( )', val: '()', latexTemplate: '\\left(#?\\right)', cursorOffset: 1, title: 'Paréntesis' },
      { label: 'x', val: 'x', latexTemplate: 'x', cursorOffset: 1, title: 'Variable x' },
      { label: 'y', val: 'y', latexTemplate: 'y', cursorOffset: 1, title: 'Variable y' },
      { label: 'eˣ', val: 'e^()', latexTemplate: 'e^{#?}', cursorOffset: 3, title: 'Exponencial' },
      { label: 'ln', val: 'ln()', latexTemplate: '\\ln\\left(#?\\right)', cursorOffset: 3, title: 'Logaritmo natural' },
      { label: 'sen', val: 'sin()', latexTemplate: '\\sin\\left(#?\\right)', cursorOffset: 4, title: 'Seno' },
      { label: 'cos', val: 'cos()', latexTemplate: '\\cos\\left(#?\\right)', cursorOffset: 4, title: 'Coseno' },
      { label: 'π', val: 'pi', latexTemplate: '\\pi', cursorOffset: 2, title: 'Pi' },
      { label: '∞', val: 'inf', latexTemplate: '\\infty', cursorOffset: 3, title: 'Infinito' },
      { label: '+', val: ' + ', latexTemplate: '+', cursorOffset: 3, title: 'Suma' },
      { label: '−', val: ' - ', latexTemplate: '-', cursorOffset: 3, title: 'Resta' },
      { label: '·', val: '*', latexTemplate: '\\cdot', cursorOffset: 1, title: 'Multiplicación' }
    ];

    box.innerHTML = `
      <div class="difficulty-filter-bar">
        <div>
          <div class="didactic-step-badge" style="margin-bottom:0.35rem;"><span>8</span> Etapa 8 de 9 · Ejercicios de Práctica Interactivos</div>
          <h3 style="font-size:1.05rem; font-weight:800;">Introduce tu Respuesta Algebraica o Numérica</h3>
          <p style="font-size:0.84rem; color:var(--text-muted);">
            Escribe con tu teclado físico o despliega el <strong>Teclado Matemático Visual de 6 Categorías</strong>. El sistema evalúa equivalencia matemática y ofrece pistas progresivas.
          </p>
        </div>

        <div class="difficulty-pills">
          <button class="diff-pill ${appState.difficultyFilter === 'todos' ? 'active' : ''}" data-diff="todos">Todos (${topic.exercises.length})</button>
          <button class="diff-pill ${appState.difficultyFilter === 'basico' ? 'active' : ''}" data-diff="basico">Básico</button>
          <button class="diff-pill ${appState.difficultyFilter === 'intermedio' ? 'active' : ''}" data-diff="intermedio">Intermedio</button>
          <button class="diff-pill ${appState.difficultyFilter === 'avanzado' ? 'active' : ''}" data-diff="avanzado">Avanzado</button>
        </div>
      </div>

      ${filtered.map(ex => {
        const isSolved = Boolean(storageState.solvedExercises[ex.id]);
        const attState = ns.Storage.getExerciseAttemptState(ex.id);
        const totalHints = ex.hints.length;
        const revealedHints = ex.hints.slice(0, attState.hintsRevealed);
        const fb = appState.exerciseFeedback[ex.id];
        const currentInputVal = fb?.lastInput !== undefined ? fb.lastInput : (isSolved ? ex.answer : '');
        const canUnlockSolution = isSolved || (attState.attempts >= 2 && attState.hintsRevealed >= Math.min(2, totalHints));
        const showExGraph = Boolean(appState.exerciseShowGraph[ex.id]);
        const showExKeyboard = Boolean(appState.exerciseShowKeyboard[ex.id]);

        return `
          <div class="exercise-card ${isSolved ? 'solved' : ''}" id="card-${ex.id}">
            <div class="exercise-header">
              <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                <span class="badge-level ${ex.level}">${levelLabels[ex.level] || ex.level}</span>
                ${ex.requireFactored ? `<span class="badge-level intermedio">Requiere forma factorizada</span>` : ''}
              </div>
              <span style="font-size:0.8rem; font-weight:700; color:${isSolved ? 'var(--success-700)' : 'var(--text-muted)'};">
                ${isSolved ? '✓ Ejercicio Completado' : `Intentos: ${attState.attempts} · Pistas usadas: ${attState.hintsRevealed}/${totalHints}`}
              </span>
            </div>

            <div class="exercise-statement">
              ${ns.MathRenderer.formatRichText(ex.statement)}
            </div>

            <!-- Barra rápida + Botón para abrir el Teclado Matemático Visual de 6 Categorías -->
            <div class="math-quick-keypad">
              ${quickSymbols.map((sym, sIdx) => `
                <button type="button" class="keypad-chip" data-keypad-ex="${ex.id}" data-keypad-idx="${sIdx}" data-keypad-target="inp-${ex.id}" data-keypad-val="${sym.val}" title="${sym.title}">
                  ${sym.label}
                </button>
              `).join('')}
              <button
                type="button"
                class="btn btn-outline btn-sm exercise-vkb-toggle-btn ${showExKeyboard ? 'active' : ''}"
                data-toggle-vkb="${ex.id}"
                aria-expanded="${showExKeyboard ? 'true' : 'false'}"
                title="Abrir o cerrar el Teclado Matemático Visual completo de 6 categorías">
                ⌨️ ${showExKeyboard ? 'Ocultar Teclado (6 Categorías)' : 'Teclado Matemático (6 Categorías)'}
              </button>
            </div>

            <div class="exercise-input-row">
              <div
                id="mf-mount-${ex.id}"
                class="exercise-math-field-mount"
                data-ex-id="${ex.id}"
                data-initial-val="${currentInputVal.replace(/"/g, '&quot;')}"
                data-placeholder="${(ex.placeholder || 'Escribe tu expresión o resultado...').replace(/"/g, '&quot;')}">
              </div>

              <button class="btn btn-primary" data-check-ex="${ex.id}">
                ✓ Comprobar Respuesta
              </button>

              <button class="btn btn-warning" data-hint-ex="${ex.id}" ${attState.hintsRevealed >= totalHints ? 'disabled style="opacity:0.6;"' : ''}>
                💡 ${attState.hintsRevealed < totalHints ? `Pedir Pista (${attState.hintsRevealed + 1}/${totalHints})` : 'Pistas completas'}
              </button>

              <button class="btn btn-outline btn-sm" data-retry-ex="${ex.id}" title="Limpiar y volver a intentar">
                ↺ Volver a intentar
              </button>

              ${topic.interactiveGraph ? `
                <button class="btn btn-outline btn-sm" data-graph-ex="${ex.id}">
                  📈 ${showExGraph ? 'Ocultar Gráfica' : 'Apoyo Gráfico'}
                </button>
              ` : ''}

              ${canUnlockSolution ? `
                <button class="btn btn-outline btn-sm" data-toggle-sol="${ex.id}">
                  📖 ${fb?.showSolution ? 'Ocultar Procedimiento' : 'Ver Procedimiento Paso a Paso'}
                </button>
              ` : ''}
            </div>

            <!-- Contenedor desplegable del Teclado Matemático Visual de 6 Categorías -->
            <div id="ex-vkb-mount-${ex.id}" class="exercise-vkb-drawer ${showExKeyboard ? 'is-open' : 'is-collapsed'}"></div>

            <!-- Vista Previa Matemática en Tiempo Real de la respuesta del estudiante -->
            <div class="exercise-live-preview">
              <span class="preview-label">Tu respuesta interpretada:</span>
              <span class="preview-math" id="preview-${ex.id}">
                ${currentInputVal.trim() ? ns.MathRenderer.renderUserExpression(currentInputVal) : '<span style="color:var(--text-muted); font-size:0.82rem;">Escribe arriba para previsualizar tu fórmula...</span>'}
              </span>
            </div>

            <!-- Gráfica interactiva opcional de apoyo al ejercicio -->
            ${showExGraph && topic.interactiveGraph ? `
              <div id="ex-graph-mount-${ex.id}" style="margin-top:0.85rem;"></div>
            ` : ''}

            <!-- Pistas Desbloqueadas Progresivamente -->
            ${revealedHints.length ? `
              <div class="hints-box">
                ${revealedHints.map((h, hIdx) => `
                  <div class="hint-item">
                    <strong>💡 Pista ${hIdx + 1}:</strong> ${ns.MathRenderer.formatRichText(h)}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Retroalimentación Diagnóstica (Explica qué revisar o por qué es correcta) -->
            ${fb ? `
              <div class="feedback-banner ${fb.type}">
                <div style="display:flex; flex-direction:column; gap:0.35rem;">
                  <div>${ns.MathRenderer.formatRichText(fb.message)}</div>
                  ${fb.type === 'error' && fb.reviewTip ? `
                    <div style="font-size:0.83rem; padding-top:0.3rem; border-top:1px dashed rgba(185,28,28,0.25);">
                      🔍 <strong>Procedimiento a revisar:</strong> ${ns.MathRenderer.formatRichText(fb.reviewTip)}
                    </div>
                  ` : ''}
                  ${fb.type === 'success' && fb.whyCorrect ? `
                    <div style="font-size:0.83rem; padding-top:0.3rem; border-top:1px dashed rgba(4,120,87,0.25);">
                      📌 <strong>Justificación matemática:</strong> ${ns.MathRenderer.formatRichText(fb.whyCorrect)}
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Resolución Paso a Paso -->
            ${fb?.showSolution ? `
              <div class="steps-container" style="margin-top:0.9rem; background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-md);">
                <div style="font-size:0.84rem; font-weight:700; color:var(--primary-800);">Resolución Matemática Paso a Paso:</div>
                ${ex.solutionSteps.map((stepText, idx) => `
                  <div class="math-step-item active-step">
                    <div class="step-number-badge">${idx + 1}</div>
                    <div class="step-body">
                      <div class="step-explanation">${ns.MathRenderer.formatRichText(stepText)}</div>
                    </div>
                  </div>
                `).join('')}
                <div style="font-size:0.88rem; font-weight:700; color:var(--success-700); padding-top:0.25rem;">
                  Respuesta correcta: <span class="math-inline">${ns.MathRenderer.renderUserExpression(ex.answer)}</span>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}

      <div style="display:flex; justify-content:space-between; margin-top:1.25rem;">
        <button class="btn btn-outline" id="btn-back-examples">← Volver a Ejemplos y Errores</button>
        <button class="btn btn-primary" id="btn-go-quiz">Ir a Etapa 9: Evaluación Final del Tema →</button>
      </div>
    `;

    // Montar controladores <math-field> y Teclados Visuales de 6 Categorías para cada ejercicio
    const exerciseControllers = {};

    function getExerciseStudentValue(exId) {
      if (exerciseControllers[exId]) {
        return exerciseControllers[exId].getCasValue();
      }
      const inp = box.querySelector('#inp-' + exId);
      return inp ? inp.value : '';
    }

    filtered.forEach(ex => {
      const mountEl = box.querySelector(`#mf-mount-${ex.id}`);
      const prevEl = box.querySelector(`#preview-${ex.id}`);
      const vkbDrawer = box.querySelector(`#ex-vkb-mount-${ex.id}`);

      if (mountEl && ns.MathInput && typeof ns.MathInput.createMathFieldController === 'function') {
        const initialVal = mountEl.getAttribute('data-initial-val') || '';
        const placeholder = mountEl.getAttribute('data-placeholder') || 'Escribe tu expresión o resultado...';

        const ctrl = ns.MathInput.createMathFieldController(mountEl, {
          id: `mf-${ex.id}`,
          fallbackInputId: `inp-${ex.id}`,
          initialCasValue: initialVal,
          placeholder,
          compact: true,
          ariaLabel: `Respuesta matemática para el ejercicio ${ex.id}`,
          onSubmit: () => {
            box.querySelector(`[data-check-ex="${ex.id}"]`)?.click();
          },
          onChange: (casVal) => {
            if (!prevEl) return;
            const trimmed = String(casVal || '').trim();
            prevEl.innerHTML = trimmed
              ? ns.MathRenderer.renderUserExpression(trimmed)
              : '<span style="color:var(--text-muted); font-size:0.82rem;">Escribe arriba para previsualizar tu fórmula...</span>';
          }
        });

        exerciseControllers[ex.id] = ctrl;
        mountEl._mathController = ctrl;

        if (vkbDrawer && typeof ns.MathInput.renderVisualKeyboard === 'function') {
          ns.MathInput.renderVisualKeyboard(vkbDrawer, () => ctrl, {
            collapsible: true,
            initialCategory: 'basicas',
            title: '⌨️ Teclado Matemático Visual (6 Categorías)',
            onClose: () => {
              appState.exerciseShowKeyboard[ex.id] = false;
              vkbDrawer.classList.remove('is-open');
              vkbDrawer.classList.add('is-collapsed');
              const toggleBtn = box.querySelector(`[data-toggle-vkb="${ex.id}"]`);
              if (toggleBtn) {
                toggleBtn.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.innerHTML = '⌨️ Teclado Matemático (6 Categorías)';
              }
            }
          });
        }
      }

      if (appState.exerciseShowGraph[ex.id] && topic.interactiveGraph && ns.LessonGraphs) {
        const m = box.querySelector(`#ex-graph-mount-${ex.id}`);
        if (m) ns.LessonGraphs.renderInteractiveWidget(m, topic.interactiveGraph);
      }
    });

    // Botón para abrir/cerrar el Teclado Matemático Visual de 6 Categorías en cada ejercicio
    box.querySelectorAll('[data-toggle-vkb]').forEach(btn => {
      btn.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
      });
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-toggle-vkb');
        const vkbDrawer = box.querySelector(`#ex-vkb-mount-${exId}`);
        if (!vkbDrawer) return;
        const nextOpen = !appState.exerciseShowKeyboard[exId];
        appState.exerciseShowKeyboard[exId] = nextOpen;
        vkbDrawer.classList.toggle('is-open', nextOpen);
        vkbDrawer.classList.toggle('is-collapsed', !nextOpen);
        btn.classList.toggle('active', nextOpen);
        btn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        btn.innerHTML = `⌨️ ${nextOpen ? 'Ocultar Teclado (6 Categorías)' : 'Teclado Matemático (6 Categorías)'}`;
        if (nextOpen && exerciseControllers[exId]) {
          exerciseControllers[exId].focus();
        }
      });
    });

    // Filtros de dificultad
    box.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.difficultyFilter = btn.getAttribute('data-diff');
        renderExercisesTab(box, subj, topic);
      });
    });

    // Teclado rápido matemático con inserción en el cursor del <math-field>
    box.querySelectorAll('[data-keypad-target]').forEach(btn => {
      btn.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
      });
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-keypad-ex');
        const sIdx = Number(btn.getAttribute('data-keypad-idx'));
        const sym = quickSymbols[sIdx];
        const ctrl = exId ? exerciseControllers[exId] : null;

        if (ctrl && sym) {
          ctrl.insertTemplate({
            latexTemplate: sym.latexTemplate,
            fallbackSnippet: sym.val,
            cursorOffset: sym.cursorOffset
          });
          return;
        }

        const targetId = btn.getAttribute('data-keypad-target');
        const val = btn.getAttribute('data-keypad-val');
        const inp = box.querySelector('#' + targetId);
        if (inp && ns.ExpressionEditorTool) {
          ns.ExpressionEditorTool.insertSnippetIntoExerciseInput(inp, val);
        } else if (inp) {
          inp.value += val;
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.focus();
        }
      });
    });

    // Botón Volver a Intentar / Limpiar
    box.querySelectorAll('[data-retry-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-retry-ex');
        appState.exerciseFeedback[exId] = {
          type: 'info',
          message: 'Campo limpio. Ingresa tu nuevo intento algebraico o numérico y presiona **Comprobar Respuesta**.',
          lastInput: '',
          showSolution: false
        };
        renderExercisesTab(box, subj, topic);
      });
    });

    // Botón Apoyo Gráfico en ejercicio
    box.querySelectorAll('[data-graph-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-graph-ex');
        appState.exerciseFeedback[exId] = Object.assign(appState.exerciseFeedback[exId] || {}, {
          lastInput: getExerciseStudentValue(exId)
        });
        appState.exerciseShowGraph[exId] = !appState.exerciseShowGraph[exId];
        renderExercisesTab(box, subj, topic);
      });
    });

    // Botón Pedir Pista Progresiva
    box.querySelectorAll('[data-hint-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-hint-ex');
        const ex = topic.exercises.find(e => e.id === exId);
        if (!ex) return;
        appState.exerciseFeedback[exId] = Object.assign(appState.exerciseFeedback[exId] || {}, {
          lastInput: getExerciseStudentValue(exId)
        });
        ns.Storage.recordHintUsed(exId, ex.hints.length);
        renderExercisesTab(box, subj, topic);
      });
    });

    // Botón Comprobar Respuesta con diagnóstico detallado y traducción desde <math-field>
    box.querySelectorAll('[data-check-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-check-ex');
        const ex = topic.exercises.find(e => e.id === exId);
        if (!ex) return;

        const studentVal = getExerciseStudentValue(exId);
        const check = ns.MathParser.checkStudentAnswer(studentVal, ex.answer, ex.alternatives, ex);

        if (check.isCorrect) {
          const res = ns.Storage.recordExerciseSolved(exId, {
            level: ex.level,
            subjectId: subj.id,
            topicId: topic.id,
            topicTitle: topic.title
          });
          const xpMsg = res.alreadySolved ? '' : ` ¡Has ganado +${res.xpEarned} XP!`;
          appState.exerciseFeedback[exId] = {
            type: 'success',
            message: `🎉 ${check.message}${xpMsg}`,
            whyCorrect: check.whyCorrect || ex.whyCorrect || (ex.solutionSteps && ex.solutionSteps[0]) || '',
            lastInput: studentVal,
            showSolution: true
          };
          renderSidebar();
          updateHeaderStats();
        } else {
          const attempts = ns.Storage.recordFailedAttempt(exId);
          const attState = ns.Storage.getExerciseAttemptState(exId);
          let extraHintMsg = '';

          if (attState.hintsRevealed < ex.hints.length) {
            const newHintNum = ns.Storage.recordHintUsed(exId, ex.hints.length);
            extraHintMsg = ` Hemos desbloqueado la **Pista ${newHintNum}** arriba para guiarte.`;
          } else if (attempts >= 2) {
            extraHintMsg = ` Ya puedes hacer clic en **"Ver Procedimiento Paso a Paso"** o en **"↺ Volver a intentar"**.`;
          }

          appState.exerciseFeedback[exId] = {
            type: 'error',
            message: `${check.message}${extraHintMsg}`,
            reviewTip: check.reviewTip || ex.reviewTip || (ex.hints && ex.hints[0]) || '',
            lastInput: studentVal,
            showSolution: false
          };
        }

        renderExercisesTab(box, subj, topic);
      });
    });

    box.querySelectorAll('[data-toggle-sol]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-toggle-sol');
        const current = appState.exerciseFeedback[exId] || {
          type: 'info',
          message: 'Revisa cada paso del desarrollo matemático:',
          lastInput: getExerciseStudentValue(exId)
        };
        current.showSolution = !current.showSolution;
        appState.exerciseFeedback[exId] = current;
        renderExercisesTab(box, subj, topic);
      });
    });

    box.querySelector('#btn-back-examples')?.addEventListener('click', () => {
      appState.activeTab = 'ejemplos';
      renderSubjectWorkspace(subj, topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    box.querySelector('#btn-go-quiz')?.addEventListener('click', () => {
      appState.activeTab = 'evaluacion';
      renderSubjectWorkspace(subj, topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Pestaña 4: Etapa 9 (Evaluación Final del Tema) --- */
  function renderQuizTab(box, subj, topic) {
    const selections = appState.quizSelections[topic.id] || {};
    const isSubmitted = Boolean(appState.quizSubmitted[topic.id]);
    const savedQuiz = ns.Storage.getState().quizScores[topic.id];
    const letters = ['A', 'B', 'C', 'D'];

    let correctCount = 0;
    if (isSubmitted) {
      topic.quiz.forEach((q, idx) => {
        if (selections[idx] === q.correctIndex) correctCount++;
      });
    }

    box.innerHTML = `
      <div class="content-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1rem;">
          <div>
            <div class="didactic-step-badge"><span>9</span> Etapa 9 de 9 · Evaluación Final del Tema</div>
            <h2 style="margin-bottom:0.2rem;">🏆 Evaluación de Comprobación: ${topic.title}</h2>
            <p style="font-size:0.86rem; color:var(--text-muted);">
              Responde las preguntas conceptuales y analíticas para certificar tu dominio del tema.
            </p>
          </div>
          ${savedQuiz ? `
            <span class="badge-level basico">Mejor calificación registrada: ${savedQuiz.percentage}% (${savedQuiz.score}/${savedQuiz.total})</span>
          ` : ''}
        </div>

        ${topic.quiz.map((q, qIdx) => {
          const chosen = selections[qIdx];
          return `
            <div class="quiz-question-card">
              <div style="font-size:0.98rem; font-weight:700; color:var(--text-main);">
                ${qIdx + 1}. ${ns.MathRenderer.formatRichText(q.question)}
              </div>

              <div class="quiz-options-grid">
                ${q.options.map((opt, oIdx) => {
                  let statusClass = '';
                  if (!isSubmitted && chosen === oIdx) statusClass = 'selected';
                  if (isSubmitted) {
                    if (oIdx === q.correctIndex) statusClass = 'correct';
                    else if (chosen === oIdx) statusClass = 'wrong';
                  }

                  return `
                    <button class="quiz-option-btn ${statusClass}" data-quiz-q="${qIdx}" data-quiz-opt="${oIdx}" ${isSubmitted ? 'disabled' : ''}>
                      <span class="option-letter">${letters[oIdx] || (oIdx + 1)}</span>
                      <span>${ns.MathRenderer.formatRichText(opt)}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              ${isSubmitted ? `
                <div class="feedback-banner ${chosen === q.correctIndex ? 'success' : 'info'}" style="margin-top:0.85rem;">
                  <div>
                    <strong>${chosen === q.correctIndex ? '✓ ¡Respuesta Correcta!' : 'ℹ️ Justificación académica:'}</strong>
                    ${ns.MathRenderer.formatRichText(q.explanation)}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-top:1.25rem;">
          ${!isSubmitted ? `
            <button class="btn btn-outline" id="btn-back-exercises">← Volver a Ejercicios</button>
            <button class="btn btn-primary" id="btn-submit-quiz">
              ✓ Calificar Evaluación Final
            </button>
          ` : `
            <div class="feedback-banner ${correctCount === topic.quiz.length ? 'success' : 'info'}" style="margin-top:0; flex:1;">
              <div>
                Has obtenido <strong>${correctCount} de ${topic.quiz.length}</strong> respuestas correctas
                (<strong>${Math.round((correctCount / topic.quiz.length) * 100)}%</strong>). Tu calificación ha quedado registrada en tu progreso.
              </div>
            </div>
            <button class="btn btn-outline" id="btn-retry-quiz">
              ↺ Intentar de Nuevo
            </button>
          `}
        </div>
      </div>
    `;

    box.querySelector('#btn-back-exercises')?.addEventListener('click', () => {
      appState.activeTab = 'ejercicios';
      renderSubjectWorkspace(subj, topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    box.querySelectorAll('[data-quiz-q]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qIdx = Number(btn.getAttribute('data-quiz-q'));
        const oIdx = Number(btn.getAttribute('data-quiz-opt'));
        if (!appState.quizSelections[topic.id]) {
          appState.quizSelections[topic.id] = {};
        }
        appState.quizSelections[topic.id][qIdx] = oIdx;
        renderQuizTab(box, subj, topic);
      });
    });

    box.querySelector('#btn-submit-quiz')?.addEventListener('click', () => {
      const sel = appState.quizSelections[topic.id] || {};
      if (Object.keys(sel).length < topic.quiz.length) {
        window.alert('Por favor selecciona una respuesta en todas las preguntas antes de calificar.');
        return;
      }
      let score = 0;
      topic.quiz.forEach((q, idx) => {
        if (sel[idx] === q.correctIndex) score++;
      });
      appState.quizSubmitted[topic.id] = true;
      ns.Storage.recordQuizCompleted(topic.id, topic.title, score, topic.quiz.length);
      renderSidebar();
      updateHeaderStats();
      renderQuizTab(box, subj, topic);
    });

    box.querySelector('#btn-retry-quiz')?.addEventListener('click', () => {
      appState.quizSelections[topic.id] = {};
      appState.quizSubmitted[topic.id] = false;
      renderQuizTab(box, subj, topic);
    });
  }

  /* ------------------------------------------------------------------------
     4. Vista de Herramientas Interactivas
     ------------------------------------------------------------------------ */
  function openTool(toolId, presetExpr = null) {
    appState.currentView = 'tool';
    appState.activeToolId = toolId;
    appState.toolPresetExpr = presetExpr;

    renderSidebar();
    updateHeaderStats();

    const toolNames = {
      formularios: 'Formularios Matemáticos de Estudio e Impresión',
      graficador: 'Graficador Interactivo de Funciones',
      calculadora: 'Calculadora Científica',
      editor: 'Editor de Expresiones Matemáticas',
      solucionador: 'Resolución Guiada de Ejercicios'
    };

    setBreadcrumb(`
      <span style="cursor:pointer;" id="bc-home-tool">Inicio</span>
      <span>›</span>
      <span>Herramientas Interactivas</span>
      <span>›</span>
      <strong>${toolNames[toolId] || toolId}</strong>
    `);
    document.getElementById('bc-home-tool')?.addEventListener('click', navigateToDashboard);

    const main = document.getElementById('main-view-container');
    if (!main) return;

    if (toolId === 'formularios') {
      ns.FormulaSheetsTool.renderFormulaSheetsView(main, presetExpr);
    } else if (toolId === 'graficador') {
      ns.GrapherTool.renderGrapherView(main, presetExpr);
    } else if (toolId === 'calculadora') {
      ns.CalculatorTool.renderCalculatorView(main);
    } else if (toolId === 'editor') {
      ns.ExpressionEditorTool.renderExpressionEditorView(main);
    } else if (toolId === 'solucionador') {
      ns.GuidedSolverTool.renderGuidedSolverView(main);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ns.App = {
    init,
    navigateToDashboard,
    openSubject,
    openTool
  };

  document.addEventListener('DOMContentLoaded', init);
})(window.MatInteractiva);
