/* ==========================================================================
   MATETIC - Animación de Bienvenida y Recorrido Interactivo Menú por Menú
   Archivo: js/tools/welcome-tour.js
   Presenta de forma limpia y progresiva cada menú y herramienta de la app
   con bloqueo estricto de scroll, foco Spotlight exacto y hoja inferior
   amigable en dispositivos móviles.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const AUTO_STEP_DURATION_MS = 5800;
  const DIALOGUE_BEAT_MS = 780;

  const TOUR_STEPS = [
    {
      id: 'welcome',
      kind: 'intro',
      menuBadge: 'Bienvenida',
      icon: '∫π',
      title: '¡Hola! Bienvenido a MateTic',
      targetSelector: null,
      dialogues: [
        'Aquí tienes <strong>9 materias</strong>, <strong>24 temas</strong> y herramientas matemáticas listas para usar incluso <strong>sin internet</strong>.',
        'Te mostraremos cada menú paso a paso en menos de un minuto.'
      ],
      highlights: ['9 Materias', 'PrepMat PRO', '100% Sin conexión']
    },
    {
      id: 'header',
      kind: 'spotlight',
      menuBadge: 'Barra superior',
      icon: '🔍',
      title: 'Buscador, Racha y Accesos Rápidos',
      targetSelector: '.top-header',
      fixedTarget: true,
      dialogues: [
        'Arriba ves tu <strong>racha diaria 🔥</strong>, tus puntos <strong>XP</strong> y el <strong>buscador 🔍</strong> para abrir cualquier tema al instante.',
        'También tienes el botón de tema <strong>claro/oscuro</strong> y la <strong>calculadora rápida 🧮</strong> siempre a mano.'
      ],
      highlights: ['Buscador rápido', 'Racha y XP', 'Calculadora 🧮']
    },
    {
      id: 'dashboard',
      kind: 'spotlight',
      menuBadge: 'Panel Principal',
      icon: '📊',
      title: 'Retoma donde lo dejaste',
      targetSelector: '.hero-banner',
      dialogues: [
        'El botón <strong>Continuar</strong> abre directo tu último tema sin tener que buscarlo.',
        'Debajo tienes accesos rápidos, rutas sugeridas y el <strong>Mapa Curricular</strong> completo.'
      ],
      highlights: ['Continuar estudio', 'Mapa de 24 temas']
    },
    {
      id: 'sidebar',
      kind: 'spotlight',
      menuBadge: 'Menú lateral',
      icon: '☰',
      title: 'Todas las Materias y Herramientas',
      targetSelector: '#app-sidebar',
      fixedTarget: true,
      openSidebarMobile: true,
      dialogues: [
        'En el <strong>menú lateral</strong> encuentras las <strong>9 materias</strong> con tu porcentaje de avance en cada una.',
        'Abajo se agrupan las herramientas interactivas, tu <strong>Dominio Global</strong> y el acceso a <strong>Ajustes ⚙️</strong>.'
      ],
      highlights: ['9 Materias', 'Dominio Global', 'Ajustes ⚙️']
    },
    {
      id: 'lesson',
      kind: 'spotlight',
      menuBadge: 'Lecciones',
      icon: '📖',
      title: 'Teoría, Métodos y Palabras Sencillas',
      targetSelector: '.learning-tabs',
      previewAction: 'lesson',
      dialogues: [
        'Cada tema se organiza en <strong>4 pestañas</strong>: Teoría, Ejemplos, Práctica y Evaluación.',
        'Incluye <strong>múltiples métodos</strong> con 3 ejemplos por forma y el botón <strong>💡 Explicar en palabras más sencillas</strong>.'
      ],
      highlights: ['4 Pestañas', '3 Ejemplos por método', 'Palabras sencillas']
    },
    {
      id: 'prepmat',
      kind: 'spotlight',
      menuBadge: 'Exámenes PRO',
      icon: '🎓',
      title: 'PrepMat · Simulador de Exámenes',
      targetSelector: '.prepmat-hero-header, #main-view-container',
      previewAction: 'prepmat',
      dialogues: [
        'Entrena con exámenes de <strong>Bachillerato</strong> y <strong>Licenciatura</strong> sin preguntas repetidas.',
        'Elige <strong>Entrenamiento Guiado</strong> o <strong>Simulacro Oficial</strong> con diagnóstico paso a paso.'
      ],
      highlights: ['9 Ramas', 'Cronómetro', 'Diagnóstico']
    },
    {
      id: 'grapher',
      kind: 'spotlight',
      menuBadge: 'Graficador',
      icon: '📈',
      title: 'Graficador Interactivo de Funciones',
      targetSelector: '.tool-workspace-header, .grapher-layout, #main-view-container',
      previewAction: 'graficador',
      dialogues: [
        'Grafica funciones en tiempo real, explora tangentes y detecta <strong>huecos removibles (0/0)</strong> automáticamente.',
        'En celular soporta pellizco para zoom y vista a <strong>pantalla completa</strong>.'
      ],
      highlights: ['Zoom táctil', 'Huecos 0/0', 'Pantalla completa']
    },
    {
      id: 'formulas',
      kind: 'spotlight',
      menuBadge: 'Formularios',
      icon: '📄',
      title: 'Formularios Listos para Consultar',
      targetSelector: '.tool-workspace-header, .formula-sheets-nav, #main-view-container',
      previewAction: 'formularios',
      dialogues: [
        'Reúne identidades trigonométricas, reglas de derivación e integrales en fichas limpias.',
        'Úsalas para repasar rápido o <strong>imprimir</strong> tu propio formulario.'
      ],
      highlights: ['Por materia', 'Imprimibles']
    },
    {
      id: 'editor',
      kind: 'spotlight',
      menuBadge: 'Editor Visual',
      icon: '∑',
      title: 'Editor Visual y Teclados Matemáticos',
      targetSelector: '.mathlive-field-wrapper, .editor-main-panel, .tool-workspace-header',
      previewAction: 'editor',
      dialogues: [
        'Escribe fracciones, raíces, potencias, límites e integrales con botones visuales claros.',
        'El teclado virtual oscuro incluye el botón <strong>✕ Ocultar</strong> en su barra superior para cerrarlo cuando quieras.'
      ],
      highlights: ['6 Categorías', 'Botón ✕ Ocultar']
    },
    {
      id: 'solver-calc',
      kind: 'spotlight',
      menuBadge: 'Cálculo y Guía',
      icon: '🧭',
      title: 'Resolución Guiada y Calculadora',
      targetSelector: '.tool-workspace-header, #main-view-container',
      previewAction: 'solucionador',
      dialogues: [
        '<strong>Resolución Guiada</strong> desbloquea cada paso conforme avanzas para practicar sin ver la respuesta de golpe.',
        'Y la <strong>Calculadora Científica 🧮</strong> trabaja en <strong>DEG / RAD</strong> con historial.'
      ],
      highlights: ['Paso a paso', 'DEG / RAD']
    },
    {
      id: 'settings',
      kind: 'spotlight',
      menuBadge: 'Ajustes',
      icon: '⚙️',
      title: 'Personaliza Tema, Fondos y Letras',
      targetSelector: '#settings-modal .sheet-modal-window',
      fixedTarget: true,
      previewAction: 'settings',
      dialogues: [
        'Cambia entre modo <strong>Claro, Oscuro o Automático</strong>, <strong>6 fondos</strong> y <strong>4 tipos de letra</strong> distintos.',
        'Desde aquí también puedes <strong>repetir este recorrido</strong> en cualquier momento.'
      ],
      highlights: ['6 Fondos', '4 Tipos de letra', 'Repetible']
    },
    {
      id: 'finish',
      kind: 'outro',
      menuBadge: '¡Listo!',
      icon: '✓',
      title: '¡Todo listo para empezar!',
      targetSelector: null,
      previewAction: 'dashboard',
      dialogues: [
        'Ya conoces todos los menús de <strong>MateTic</strong>. Tu progreso se guarda de forma segura en tu dispositivo.',
        'Elige una materia o abre <strong>PrepMat</strong> para comenzar.'
      ],
      highlights: ['Recorrido completado', 'Progreso guardado']
    }
  ];

  let isActive = false;
  let currentStepIdx = 0;
  let isAutoPlaying = false;
  let autoTimerId = null;
  let dialogueTimers = [];
  let layoutTimers = [];
  let rootEl = null;
  let spotlightEl = null;
  let cardEl = null;
  let keydownHandler = null;
  let repositionHandler = null;
  let wheelBlockHandler = null;
  let touchMoveBlockHandler = null;
  let onCompleteCallback = null;
  let openedSettingsForStep = false;

  function prefersReducedMotion() {
    try {
      return typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  }

  function haptic(kind) {
    try {
      if (ns.Haptics && typeof ns.Haptics[kind] === 'function') {
        ns.Haptics[kind]();
      }
    } catch (_) {}
  }

  function setTourScrollLock(locked) {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('has-welcome-tour', Boolean(locked));
    document.body.classList.toggle('has-welcome-tour', Boolean(locked));
  }

  function isScrollableCardEvent(ev) {
    if (!cardEl || !ev || !ev.target || typeof ev.target.closest !== 'function') return false;
    const insideCard = ev.target.closest('#wt-dialog-card');
    if (!insideCard) return false;
    return cardEl.scrollHeight > cardEl.clientHeight + 2;
  }

  function attachInputScrollBlockers() {
    if (typeof window === 'undefined') return;
    if (!wheelBlockHandler) {
      wheelBlockHandler = (ev) => {
        if (!isActive) return;
        if (!isScrollableCardEvent(ev)) {
          ev.preventDefault();
        }
      };
      window.addEventListener('wheel', wheelBlockHandler, { passive: false, capture: true });
    }
    if (!touchMoveBlockHandler) {
      touchMoveBlockHandler = (ev) => {
        if (!isActive) return;
        if (!isScrollableCardEvent(ev)) {
          ev.preventDefault();
        }
      };
      window.addEventListener('touchmove', touchMoveBlockHandler, { passive: false, capture: true });
    }
  }

  function detachInputScrollBlockers() {
    if (typeof window === 'undefined') return;
    if (wheelBlockHandler) {
      window.removeEventListener('wheel', wheelBlockHandler, { capture: true });
      wheelBlockHandler = null;
    }
    if (touchMoveBlockHandler) {
      window.removeEventListener('touchmove', touchMoveBlockHandler, { capture: true });
      touchMoveBlockHandler = null;
    }
  }

  function clearDialogueTimers() {
    dialogueTimers.forEach((id) => clearTimeout(id));
    dialogueTimers = [];
  }

  function clearLayoutTimers() {
    layoutTimers.forEach((id) => clearTimeout(id));
    layoutTimers = [];
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    if (autoTimerId) {
      clearTimeout(autoTimerId);
      autoTimerId = null;
    }
    if (rootEl) {
      rootEl.classList.remove('is-autoplaying');
      const autoBtn = rootEl.querySelector('#wt-btn-auto');
      if (autoBtn) {
        autoBtn.setAttribute('aria-pressed', 'false');
        autoBtn.textContent = '▶ Auto';
      }
      const fill = rootEl.querySelector('#wt-auto-fill');
      if (fill) {
        fill.style.transition = 'none';
        fill.style.transform = 'scaleX(0)';
      }
    }
  }

  function scheduleAutoAdvance() {
    if (!isAutoPlaying || !isActive) return;
    if (autoTimerId) clearTimeout(autoTimerId);

    if (currentStepIdx >= TOUR_STEPS.length - 1) {
      stopAutoPlay();
      return;
    }

    if (rootEl) {
      rootEl.classList.add('is-autoplaying');
      const fill = rootEl.querySelector('#wt-auto-fill');
      if (fill) {
        fill.style.transition = 'none';
        fill.style.transform = 'scaleX(0)';
        void fill.offsetWidth;
        fill.style.transition = `transform ${AUTO_STEP_DURATION_MS}ms linear`;
        fill.style.transform = 'scaleX(1)';
      }
    }

    autoTimerId = setTimeout(() => {
      if (isActive && isAutoPlaying) {
        goToStep(currentStepIdx + 1);
      }
    }, AUTO_STEP_DURATION_MS);
  }

  function toggleAutoPlay() {
    haptic('light');
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      isAutoPlaying = true;
      if (rootEl) {
        const autoBtn = rootEl.querySelector('#wt-btn-auto');
        if (autoBtn) {
          autoBtn.setAttribute('aria-pressed', 'true');
          autoBtn.textContent = '⏸ Pausar';
        }
      }
      if (currentStepIdx === 0) {
        goToStep(1);
      } else {
        scheduleAutoAdvance();
      }
    }
  }

  function ensureTourDOM() {
    if (typeof document === 'undefined') return null;
    const existing = document.getElementById('welcome-tour-root');
    if (existing) {
      rootEl = existing;
      spotlightEl = existing.querySelector('.wt-spotlight');
      cardEl = existing.querySelector('.wt-dialog-card');
      return existing;
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'welcome-tour-root';
    wrapper.className = 'wt-overlay no-print';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.setAttribute('aria-labelledby', 'wt-title');
    wrapper.hidden = true;

    wrapper.innerHTML = `
      <div class="wt-backdrop-dim" aria-hidden="true"></div>
      <div class="wt-spotlight" aria-hidden="true"></div>
      <div class="wt-dialog-card" id="wt-dialog-card">
        <div class="wt-sheet-handle" aria-hidden="true"></div>

        <div class="wt-auto-progress" aria-hidden="true">
          <div class="wt-auto-progress-fill" id="wt-auto-fill"></div>
        </div>

        <div class="wt-card-top">
          <div class="wt-step-meta">
            <span class="wt-menu-badge" id="wt-menu-badge">Bienvenida</span>
            <span class="wt-step-counter" id="wt-step-counter">1 / ${TOUR_STEPS.length}</span>
          </div>
          <div class="wt-top-actions">
            <button type="button" class="wt-mini-btn" id="wt-btn-auto" aria-pressed="false" title="Avanzar automáticamente">▶ Auto</button>
            <button type="button" class="wt-mini-btn wt-skip-btn" id="wt-btn-skip" aria-label="Omitir recorrido de bienvenida">Saltar</button>
          </div>
        </div>

        <div class="wt-linear-track" aria-hidden="true">
          <div class="wt-linear-fill" id="wt-linear-fill"></div>
        </div>

        <div class="wt-hero-stage" id="wt-hero-stage" hidden>
          <div class="wt-hero-emblem" id="wt-hero-emblem" aria-hidden="true">∫π</div>
        </div>

        <div class="wt-header-row">
          <div class="wt-guide-avatar" id="wt-guide-avatar" aria-hidden="true">
            <span id="wt-avatar-glyph">∫π</span>
          </div>
          <div class="wt-title-wrap">
            <h2 class="wt-title" id="wt-title"></h2>
          </div>
        </div>

        <div class="wt-dialogues" id="wt-dialogues" aria-live="polite" title="Toca para mostrar todo el mensaje"></div>

        <div class="wt-highlights" id="wt-highlights"></div>

        <div class="wt-footer-actions">
          <button type="button" class="btn btn-outline btn-sm wt-nav-btn wt-prev-btn" id="wt-btn-prev">← Anterior</button>
          <button type="button" class="btn btn-primary btn-sm wt-nav-btn wt-next-btn" id="wt-btn-next">Siguiente →</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);
    rootEl = wrapper;
    spotlightEl = wrapper.querySelector('.wt-spotlight');
    cardEl = wrapper.querySelector('.wt-dialog-card');

    wrapper.querySelector('#wt-btn-skip')?.addEventListener('click', () => finishTour({ skipped: true }));
    wrapper.querySelector('#wt-btn-auto')?.addEventListener('click', () => toggleAutoPlay());
    wrapper.querySelector('#wt-btn-prev')?.addEventListener('click', () => {
      stopAutoPlay();
      haptic('light');
      if (currentStepIdx > 0) goToStep(currentStepIdx - 1);
    });
    wrapper.querySelector('#wt-btn-next')?.addEventListener('click', () => {
      if (currentStepIdx >= TOUR_STEPS.length - 1) {
        finishTour({ skipped: false });
      } else {
        haptic('confirm');
        goToStep(currentStepIdx + 1);
      }
    });
    wrapper.querySelector('#wt-dialogues')?.addEventListener('click', () => {
      revealAllCurrentDialogues();
    });

    return wrapper;
  }

  function revealAllCurrentDialogues() {
    clearDialogueTimers();
    if (!rootEl) return;
    rootEl.querySelectorAll('.wt-dialogue-line').forEach((el) => {
      el.classList.add('is-visible');
    });
    rootEl.querySelectorAll('.wt-highlight-pill').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  function findVisibleTarget(selector) {
    if (!selector || typeof document === 'undefined') return null;
    const parts = selector.split(',').map((s) => s.trim()).filter(Boolean);
    for (const sel of parts) {
      const el = document.querySelector(sel);
      if (el && typeof el.getBoundingClientRect === 'function') {
        const rect = el.getBoundingClientRect();
        if (rect.width > 12 && rect.height > 12) {
          return el;
        }
      }
    }
    return null;
  }

  function closeTemporaryPanels() {
    if (openedSettingsForStep) {
      openedSettingsForStep = false;
      if (ns.App && typeof ns.App.closeSettingsForTour === 'function') {
        ns.App.closeSettingsForTour();
      }
    }
    if (ns.App && typeof ns.App.closeMobileSidebar === 'function') {
      ns.App.closeMobileSidebar();
    }
  }

  function executeStepNavigation(step) {
    closeTemporaryPanels();
    if (!ns.App) return;

    if (step.kind === 'intro' || step.previewAction === 'dashboard' || step.id === 'dashboard' || step.id === 'header') {
      if (typeof ns.App.navigateToDashboard === 'function') {
        ns.App.navigateToDashboard();
      }
    } else if (step.previewAction === 'lesson') {
      if (typeof ns.App.openSubject === 'function') {
        ns.App.openSubject('derivadas', 'der-1', 'teoria', { previewOnly: true });
      }
    } else if (
      step.previewAction === 'prepmat' ||
      step.previewAction === 'graficador' ||
      step.previewAction === 'formularios' ||
      step.previewAction === 'editor' ||
      step.previewAction === 'solucionador'
    ) {
      if (typeof ns.App.openTool === 'function') {
        ns.App.openTool(step.previewAction);
      }
    } else if (step.previewAction === 'settings') {
      if (typeof ns.App.openSettingsForTour === 'function') {
        openedSettingsForStep = true;
        ns.App.openSettingsForTour();
      }
    }

    if (step.openSidebarMobile && typeof window !== 'undefined' && window.innerWidth <= 900) {
      if (typeof ns.App.openMobileSidebar === 'function') {
        ns.App.openMobileSidebar();
      }
    }
  }

  /**
   * Desplaza instantáneamente el objetivo al tercio superior visible antes de
   * bloquear el scroll, evitando que el foco quede cortado abajo o desfasado.
   */
  function frameTargetInstantly(step) {
    if (typeof window === 'undefined' || !step || !step.targetSelector || step.fixedTarget) return;
    const target = findVisibleTarget(step.targetSelector);
    if (!target) return;

    const isMobile = (window.innerWidth || 1024) <= 900;
    const desiredTop = isMobile ? 64 : 84;
    const rect = target.getBoundingClientRect();
    const docY = (window.scrollY || window.pageYOffset || 0) + rect.top;
    const nextScrollY = Math.max(0, Math.round(docY - desiredTop));

    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: nextScrollY, behavior: 'auto' });
    }
  }

  function positionSpotlightAndCard(step) {
    if (!rootEl || !spotlightEl || !cardEl || typeof window === 'undefined') return;

    const vw = window.innerWidth || 1024;
    const vh = window.innerHeight || 768;
    const isMobile = vw <= 900;
    const isCentered = step.kind === 'intro' || step.kind === 'outro' || !step.targetSelector;

    rootEl.classList.toggle('is-centered-step', isCentered);
    rootEl.classList.toggle('is-mobile-sheet', isMobile && !isCentered);

    if (isCentered) {
      spotlightEl.classList.remove('is-active');
      cardEl.style.removeProperty('top');
      cardEl.style.removeProperty('left');
      cardEl.style.removeProperty('bottom');
      cardEl.style.removeProperty('right');
      return;
    }

    const target = findVisibleTarget(step.targetSelector);
    if (!target) {
      rootEl.classList.add('is-centered-step');
      rootEl.classList.remove('is-mobile-sheet');
      spotlightEl.classList.remove('is-active');
      cardEl.style.removeProperty('top');
      cardEl.style.removeProperty('left');
      cardEl.style.removeProperty('bottom');
      cardEl.style.removeProperty('right');
      return;
    }

    const rawRect = target.getBoundingClientRect();
    const pad = isMobile ? 5 : 8;

    // -----------------------------------------------------------------------
    // Modo móvil (<= 900px): hoja inferior fija, foco recortado arriba sin chocar
    // -----------------------------------------------------------------------
    if (isMobile) {
      cardEl.style.removeProperty('top');
      cardEl.style.removeProperty('left');
      cardEl.style.removeProperty('right');
      cardEl.style.removeProperty('bottom');

      const cardRect = cardEl.getBoundingClientRect();
      const cardTop = cardRect.top > 0 ? cardRect.top : Math.round(vh * 0.56);
      const maxSpotBottom = Math.max(88, cardTop - 12);

      const spotLeft = Math.max(6, Math.min(vw - 24, rawRect.left - pad));
      const spotTop = Math.max(6, Math.min(maxSpotBottom - 36, rawRect.top - pad));
      const spotRight = Math.min(vw - 6, rawRect.right + pad);
      const spotBottom = Math.min(maxSpotBottom, Math.max(spotTop + 36, rawRect.bottom + pad));

      spotlightEl.style.left = `${Math.round(spotLeft)}px`;
      spotlightEl.style.top = `${Math.round(spotTop)}px`;
      spotlightEl.style.width = `${Math.max(40, Math.round(spotRight - spotLeft))}px`;
      spotlightEl.style.height = `${Math.max(36, Math.round(spotBottom - spotTop))}px`;
      spotlightEl.classList.add('is-active');
      return;
    }

    // -----------------------------------------------------------------------
    // Modo escritorio (> 900px): foco exacto y tarjeta SIEMPRE dentro del viewport
    // -----------------------------------------------------------------------
    const margin = 14;
    const gap = 14;
    const cardRect = cardEl.getBoundingClientRect();
    const cardW = Math.min(410, Math.max(320, Math.round(cardRect.width || 396)));
    const cardH = Math.min(vh - margin * 2, Math.max(210, Math.round(cardRect.height || 260)));

    let spotLeft = Math.max(6, rawRect.left - pad);
    let spotTop = Math.max(6, rawRect.top - pad);
    let spotRight = Math.min(vw - 6, rawRect.right + pad);
    let spotBottom = Math.min(vh - 6, rawRect.bottom + pad);

    // Si el objetivo ocupa casi todo el alto (y no es la barra lateral), acotar su
    // foco para dejar espacio limpio a la tarjeta sin recortarla
    if (step.id !== 'sidebar' && step.id !== 'settings' && (spotBottom - spotTop) > (vh - cardH - margin * 2 - gap)) {
      const maxVisibleHeight = Math.max(110, vh - cardH - margin * 2 - gap - Math.max(0, spotTop - margin));
      spotBottom = Math.min(spotBottom, spotTop + maxVisibleHeight);
    }

    const spotW = Math.max(44, Math.round(spotRight - spotLeft));
    const spotH = Math.max(36, Math.round(spotBottom - spotTop));

    spotlightEl.style.left = `${Math.round(spotLeft)}px`;
    spotlightEl.style.top = `${Math.round(spotTop)}px`;
    spotlightEl.style.width = `${spotW}px`;
    spotlightEl.style.height = `${spotH}px`;
    spotlightEl.classList.add('is-active');

    const clampLeft = (x) => Math.max(margin, Math.min(vw - cardW - margin, Math.round(x)));
    const clampTop = (y) => Math.max(margin, Math.min(vh - cardH - margin, Math.round(y)));

    let cardLeft;
    let cardTop;

    if (step.id === 'sidebar' && (spotRight + gap + cardW + margin) <= vw) {
      cardLeft = spotRight + gap;
      cardTop = clampTop(vh * 0.24);
    } else if ((spotBottom + gap + cardH + margin) <= vh) {
      // 1. Debajo del foco
      cardLeft = clampLeft(spotLeft + spotW / 2 - cardW / 2);
      cardTop = spotBottom + gap;
    } else if ((spotTop - gap - cardH) >= margin) {
      // 2. Encima del foco
      cardLeft = clampLeft(spotLeft + spotW / 2 - cardW / 2);
      cardTop = spotTop - gap - cardH;
    } else if ((spotRight + gap + cardW + margin) <= vw) {
      // 3. A la derecha del foco
      cardLeft = spotRight + gap;
      cardTop = clampTop(spotTop);
    } else if ((spotLeft - gap - cardW) >= margin) {
      // 4. A la izquierda del foco
      cardLeft = spotLeft - gap - cardW;
      cardTop = clampTop(spotTop);
    } else {
      // 5. Esquina inferior derecha garantizada dentro del viewport
      cardLeft = vw - cardW - margin;
      cardTop = vh - cardH - margin;
    }

    cardEl.style.bottom = 'auto';
    cardEl.style.right = 'auto';
    cardEl.style.left = `${clampLeft(cardLeft)}px`;
    cardEl.style.top = `${clampTop(cardTop)}px`;
  }

  function renderStepContent(step, idx) {
    if (!rootEl) return;
    clearDialogueTimers();

    const badgeEl = rootEl.querySelector('#wt-menu-badge');
    const counterEl = rootEl.querySelector('#wt-step-counter');
    const linearFill = rootEl.querySelector('#wt-linear-fill');
    const titleEl = rootEl.querySelector('#wt-title');
    const avatarGlyph = rootEl.querySelector('#wt-avatar-glyph');
    const heroStage = rootEl.querySelector('#wt-hero-stage');
    const heroEmblem = rootEl.querySelector('#wt-hero-emblem');
    const dialoguesEl = rootEl.querySelector('#wt-dialogues');
    const highlightsEl = rootEl.querySelector('#wt-highlights');
    const prevBtn = rootEl.querySelector('#wt-btn-prev');
    const nextBtn = rootEl.querySelector('#wt-btn-next');

    if (badgeEl) badgeEl.textContent = step.menuBadge;
    if (counterEl) counterEl.textContent = `${idx + 1} / ${TOUR_STEPS.length}`;
    if (linearFill) {
      const pct = Math.round(((idx + 1) / TOUR_STEPS.length) * 100);
      linearFill.style.width = `${pct}%`;
    }
    if (titleEl) titleEl.textContent = step.title;
    if (avatarGlyph) avatarGlyph.textContent = step.icon;

    const showHero = step.kind === 'intro' || step.kind === 'outro';
    if (heroStage) heroStage.hidden = !showHero;
    if (heroEmblem) heroEmblem.textContent = step.icon;

    if (prevBtn) {
      prevBtn.disabled = idx === 0;
      prevBtn.hidden = idx === 0;
    }
    if (nextBtn) {
      if (idx === 0) {
        nextBtn.textContent = 'Comenzar →';
      } else if (idx === TOUR_STEPS.length - 1) {
        nextBtn.textContent = 'Empezar ahora';
      } else {
        nextBtn.textContent = 'Siguiente →';
      }
    }

    const reduced = prefersReducedMotion();
    if (dialoguesEl) {
      dialoguesEl.innerHTML = (step.dialogues || []).map((htmlLine, lineIdx) => `
        <p class="wt-dialogue-line ${reduced || lineIdx === 0 ? 'is-visible' : ''}" data-beat="${lineIdx}">
          ${htmlLine}
        </p>
      `).join('');
    }

    if (highlightsEl) {
      highlightsEl.innerHTML = (step.highlights || []).map((chip) => `
        <span class="wt-highlight-pill ${reduced ? 'is-visible' : ''}">${chip}</span>
      `).join('');
    }

    if (!reduced && dialoguesEl) {
      const lines = [...dialoguesEl.querySelectorAll('.wt-dialogue-line')];
      lines.forEach((line, lIdx) => {
        if (lIdx === 0) return;
        const tid = setTimeout(() => {
          line.classList.add('is-visible');
        }, lIdx * DIALOGUE_BEAT_MS);
        dialogueTimers.push(tid);
      });

      const pillTimer = setTimeout(() => {
        if (!rootEl) return;
        rootEl.querySelectorAll('.wt-highlight-pill').forEach((pill, pIdx) => {
          const pt = setTimeout(() => pill.classList.add('is-visible'), pIdx * 70);
          dialogueTimers.push(pt);
        });
      }, Math.max(300, lines.length * DIALOGUE_BEAT_MS - 220));
      dialogueTimers.push(pillTimer);
    }

    if (cardEl) {
      cardEl.scrollTop = 0;
      cardEl.classList.remove('is-step-enter');
      void cardEl.offsetWidth;
      cardEl.classList.add('is-step-enter');
    }
  }

  function goToStep(idx) {
    if (!isActive) return;
    const bounded = Math.max(0, Math.min(TOUR_STEPS.length - 1, idx));
    currentStepIdx = bounded;
    const step = TOUR_STEPS[bounded];

    clearLayoutTimers();
    // 1. Liberar brevemente para navegar y encuadrar el objetivo al instante
    setTourScrollLock(false);
    executeStepNavigation(step);
    renderStepContent(step, bounded);

    const finalizeLayout = () => {
      if (!isActive || currentStepIdx !== bounded) return;
      frameTargetInstantly(step);
      setTourScrollLock(true);
      positionSpotlightAndCard(step);
    };

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        finalizeLayout();
        requestAnimationFrame(() => {
          if (isActive && currentStepIdx === bounded) {
            positionSpotlightAndCard(step);
          }
        });
      });
    } else {
      finalizeLayout();
    }

    // Si el paso abre un panel animado (menú lateral móvil o Ajustes),
    // re-medir al terminar la transición para encuadrar el panel completo.
    if (step.openSidebarMobile || step.previewAction === 'settings') {
      const targetEl = findVisibleTarget(step.targetSelector);
      if (targetEl && typeof targetEl.addEventListener === 'function') {
        const onEnd = () => {
          if (isActive && currentStepIdx === bounded) {
            positionSpotlightAndCard(step);
          }
        };
        targetEl.addEventListener('transitionend', onEnd, { once: true });
      }
      layoutTimers.push(setTimeout(() => {
        if (isActive && currentStepIdx === bounded) {
          positionSpotlightAndCard(step);
        }
      }, 220));
      layoutTimers.push(setTimeout(() => {
        if (isActive && currentStepIdx === bounded) {
          positionSpotlightAndCard(step);
        }
      }, 420));
    }

    if (isAutoPlaying) {
      scheduleAutoAdvance();
    }
  }

  function finishTour(meta = {}) {
    if (!isActive) return;
    isActive = false;
    stopAutoPlay();
    clearDialogueTimers();
    clearLayoutTimers();
    closeTemporaryPanels();
    detachInputScrollBlockers();
    setTourScrollLock(false);

    if (rootEl) {
      rootEl.classList.remove('is-open', 'is-autoplaying', 'is-centered-step', 'is-mobile-sheet');
      rootEl.hidden = true;
    }

    if (typeof document !== 'undefined' && keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
    if (typeof window !== 'undefined' && repositionHandler) {
      window.removeEventListener('resize', repositionHandler);
      window.removeEventListener('orientationchange', repositionHandler);
      repositionHandler = null;
    }

    try {
      if (ns.Preferences && typeof ns.Preferences.setPreference === 'function') {
        ns.Preferences.setPreference('welcomeTourCompleted', true);
      }
    } catch (_) {}

    if (ns.App && typeof ns.App.navigateToDashboard === 'function') {
      ns.App.navigateToDashboard();
    }
    if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
      ns.App.syncModalScrollLock();
    }

    haptic(meta.skipped ? 'light' : 'achievement');

    const cb = onCompleteCallback;
    onCompleteCallback = null;
    if (typeof cb === 'function') {
      cb({ skipped: Boolean(meta.skipped) });
    }
  }

  function start(options = {}) {
    if (typeof document === 'undefined') return false;
    ensureTourDOM();
    if (!rootEl) return false;

    isActive = true;
    currentStepIdx = 0;
    onCompleteCallback = typeof options.onComplete === 'function' ? options.onComplete : null;
    isAutoPlaying = Boolean(options.autoPlay);

    rootEl.hidden = false;
    rootEl.classList.add('is-open');
    setTourScrollLock(true);
    attachInputScrollBlockers();

    if (ns.App && typeof ns.App.syncModalScrollLock === 'function') {
      ns.App.syncModalScrollLock();
    }

    const autoBtn = rootEl.querySelector('#wt-btn-auto');
    if (autoBtn) {
      autoBtn.setAttribute('aria-pressed', isAutoPlaying ? 'true' : 'false');
      autoBtn.textContent = isAutoPlaying ? '⏸ Pausar' : '▶ Auto';
    }

    keydownHandler = (ev) => {
      if (!isActive) return;
      if (ev.key === 'Escape') {
        ev.preventDefault();
        finishTour({ skipped: true });
      } else if (ev.key === 'ArrowRight') {
        ev.preventDefault();
        if (currentStepIdx >= TOUR_STEPS.length - 1) {
          finishTour({ skipped: false });
        } else {
          goToStep(currentStepIdx + 1);
        }
      } else if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        stopAutoPlay();
        if (currentStepIdx > 0) goToStep(currentStepIdx - 1);
      } else if (
        ev.key === ' ' ||
        ev.key === 'PageDown' ||
        ev.key === 'PageUp' ||
        ev.key === 'ArrowDown' ||
        ev.key === 'ArrowUp' ||
        ev.key === 'Home' ||
        ev.key === 'End'
      ) {
        ev.preventDefault();
      }
    };
    document.addEventListener('keydown', keydownHandler);

    repositionHandler = () => {
      if (isActive) {
        const step = TOUR_STEPS[currentStepIdx];
        setTourScrollLock(false);
        frameTargetInstantly(step);
        setTourScrollLock(true);
        positionSpotlightAndCard(step);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', repositionHandler, { passive: true });
      window.addEventListener('orientationchange', repositionHandler, { passive: true });
    }

    haptic('confirm');
    goToStep(0);
    return true;
  }

  ns.WelcomeTour = {
    TOUR_STEPS,
    start,
    goToStep,
    finish: finishTour,
    toggleAutoPlay,
    isActive: () => isActive,
    getCurrentStepIndex: () => currentStepIdx
  };
})(window.MatInteractiva);
