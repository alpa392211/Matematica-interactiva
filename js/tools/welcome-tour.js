/* ==========================================================================
   MATETIC - Animación de Bienvenida y Recorrido Interactivo Menú por Menú
   Archivo: js/tools/welcome-tour.js
   Presenta de forma limpia y progresiva cada menú y herramienta de la app
   con bloqueo estricto de scroll, encuadre instantáneo y alineación exacta
   del foco Spotlight en celular, tableta y escritorio.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const AUTO_STEP_DURATION_MS = 5800;
  const DIALOGUE_BEAT_MS = 780;
  const SETTLE_MONITOR_MS = 520;

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
      targetSelector: '.hscroll-shell.is-learning-tabs, .learning-tabs',
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
      targetSelector: '.prepmat-hero-header',
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
      targetSelector: '.subject-header-card',
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
      targetSelector: '.subject-header-card',
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
      targetSelector: '.mathlive-field-wrapper, .subject-header-card',
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
      targetSelector: '.subject-header-card',
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
  let settleRafId = null;
  let activeResizeObserver = null;
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

  /**
   * Desplazamiento estrictamente síncrono e instantáneo, inmune a `scroll-behavior: smooth`.
   */
  function instantScrollTo(y) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const htmlEl = document.documentElement;
    const prev = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    const targetY = Math.max(0, Math.round(y));
    try {
      window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
    } catch (_) {
      window.scrollTo(0, targetY);
    }
    htmlEl.scrollTop = targetY;
    if (document.body) document.body.scrollTop = targetY;
    if (prev) {
      htmlEl.style.scrollBehavior = prev;
    } else {
      htmlEl.style.removeProperty('scroll-behavior');
    }
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

  function clearLayoutMonitors() {
    layoutTimers.forEach((id) => clearTimeout(id));
    layoutTimers = [];
    if (settleRafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(settleRafId);
      settleRafId = null;
    }
    if (activeResizeObserver) {
      try { activeResizeObserver.disconnect(); } catch (_) {}
      activeResizeObserver = null;
    }
    if (spotlightEl) {
      spotlightEl.classList.remove('is-tracking');
    }
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
   * Encuadra el objetivo de forma estrictamente instantánea solo cuando está
   * fuera del área visible segura (debajo de la barra superior y encima de la hoja).
   */
  function frameTargetInstantly(step) {
    if (typeof window === 'undefined' || typeof document === 'undefined' || !step || !step.targetSelector) {
      return;
    }
    if (step.fixedTarget) {
      instantScrollTo(0);
      return;
    }

    instantScrollTo(0);
    const target = findVisibleTarget(step.targetSelector);
    if (!target) return;

    const vw = window.innerWidth || 1024;
    const vh = window.innerHeight || 768;
    const isMobile = vw <= 900;

    const headerEl = document.querySelector('.top-header');
    const headerRect = headerEl && typeof headerEl.getBoundingClientRect === 'function'
      ? headerEl.getBoundingClientRect()
      : null;
    const safeTop = Math.max(isMobile ? 48 : 74, headerRect ? Math.round(headerRect.bottom + 10) : 74);

    let safeBottom = vh - 24;
    if (isMobile && cardEl) {
      const cardRect = cardEl.getBoundingClientRect();
      if (cardRect.height > 40) {
        safeBottom = Math.max(safeTop + 80, vh - Math.round(cardRect.height) - 24);
      } else {
        safeBottom = Math.round(vh * 0.56);
      }
    }

    const rect = target.getBoundingClientRect();
    const alreadyVisible = rect.top >= (safeTop - 8) && rect.bottom <= safeBottom;
    if (alreadyVisible) return;

    const docY = (window.scrollY || window.pageYOffset || 0) + rect.top;
    instantScrollTo(docY - safeTop);
  }

  function resolveSpotlightRadius(target, pad, spotLeft, spotTop) {
    try {
      const cs = typeof window !== 'undefined' && typeof window.getComputedStyle === 'function'
        ? window.getComputedStyle(target)
        : null;
      const base = cs ? parseFloat(cs.borderTopLeftRadius) : 16;
      const r = Number.isFinite(base) ? Math.min(28, Math.max(8, Math.round(base + (base > 0 ? Math.min(pad, 4) : 0)))) : 16;
      if (spotLeft <= 2 && spotTop <= 2 && base < 4) {
        return '4px';
      }
      return `${r}px`;
    } catch (_) {
      return '16px';
    }
  }

  function positionSpotlightAndCard(step, opts = {}) {
    if (!rootEl || !spotlightEl || !cardEl || typeof window === 'undefined') return;

    const vw = window.innerWidth || 1024;
    const vh = window.innerHeight || 768;
    const isMobile = vw <= 900;
    const isCentered = step.kind === 'intro' || step.kind === 'outro' || !step.targetSelector;

    rootEl.classList.toggle('is-centered-step', isCentered);
    rootEl.classList.toggle('is-mobile-sheet', isMobile && !isCentered);

    if (isCentered) {
      spotlightEl.classList.remove('is-active', 'is-tracking');
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
      spotlightEl.classList.remove('is-active', 'is-tracking');
      cardEl.style.removeProperty('top');
      cardEl.style.removeProperty('left');
      cardEl.style.removeProperty('bottom');
      cardEl.style.removeProperty('right');
      return;
    }

    if (opts.instant) {
      spotlightEl.classList.add('is-tracking');
    } else {
      spotlightEl.classList.remove('is-tracking');
    }

    const rawRect = target.getBoundingClientRect();
    const pad = isMobile ? 4 : 6;
    const edge = 2;

    // -----------------------------------------------------------------------
    // Celular y Tableta vertical (<= 900px): hoja inferior fija, foco exacto arriba
    // -----------------------------------------------------------------------
    if (isMobile) {
      cardEl.style.removeProperty('top');
      cardEl.style.removeProperty('left');
      cardEl.style.removeProperty('right');
      cardEl.style.removeProperty('bottom');

      const cardRect = cardEl.getBoundingClientRect();
      const cardTop = cardRect.top > 40 ? cardRect.top : Math.round(vh * 0.56);
      const maxSpotBottom = Math.max(90, Math.round(cardTop - 10));

      const spotLeft = Math.max(edge, Math.round(rawRect.left - pad));
      const spotRight = Math.min(vw - edge, Math.round(rawRect.right + pad));
      const spotTop = Math.max(edge, Math.min(maxSpotBottom - 34, Math.round(rawRect.top - pad)));
      const spotBottom = Math.min(maxSpotBottom, Math.max(spotTop + 34, Math.round(rawRect.bottom + pad)));

      spotlightEl.style.left = `${spotLeft}px`;
      spotlightEl.style.top = `${spotTop}px`;
      spotlightEl.style.width = `${Math.max(40, spotRight - spotLeft)}px`;
      spotlightEl.style.height = `${Math.max(34, spotBottom - spotTop)}px`;
      spotlightEl.style.borderRadius = resolveSpotlightRadius(target, pad, spotLeft, spotTop);
      spotlightEl.classList.add('is-active');
      return;
    }

    // -----------------------------------------------------------------------
    // Tableta horizontal y Escritorio (> 900px): foco exacto y tarjeta sin solaparse
    // -----------------------------------------------------------------------
    const margin = 14;
    const gap = 14;
    const cardRect = cardEl.getBoundingClientRect();
    const cardW = Math.min(404, Math.max(320, Math.round(cardRect.width || 396)));
    const cardH = Math.min(vh - margin * 2, Math.max(200, Math.round(cardRect.height || 260)));

    const spotLeft = Math.max(edge, Math.round(rawRect.left - pad));
    const spotRight = Math.min(vw - edge, Math.round(rawRect.right + pad));
    const spotTop = Math.max(edge, Math.round(rawRect.top - pad));
    const spotBottom = Math.min(vh - edge, Math.round(rawRect.bottom + pad));

    const spotW = Math.max(44, spotRight - spotLeft);
    const spotH = Math.max(34, spotBottom - spotTop);

    spotlightEl.style.left = `${spotLeft}px`;
    spotlightEl.style.top = `${spotTop}px`;
    spotlightEl.style.width = `${spotW}px`;
    spotlightEl.style.height = `${spotH}px`;
    spotlightEl.style.borderRadius = resolveSpotlightRadius(target, pad, spotLeft, spotTop);
    spotlightEl.classList.add('is-active');

    const clampLeft = (x) => Math.max(margin, Math.min(vw - cardW - margin, Math.round(x)));
    const clampTop = (y) => Math.max(margin, Math.min(vh - cardH - margin, Math.round(y)));

    let cardLeft;
    let cardTop;

    if (step.id === 'sidebar' && (spotRight + gap + cardW + margin) <= vw) {
      cardLeft = spotRight + gap;
      cardTop = clampTop(vh * 0.24);
    } else if ((spotBottom + gap + cardH + margin) <= vh) {
      cardLeft = clampLeft(spotLeft + spotW / 2 - cardW / 2);
      cardTop = spotBottom + gap;
    } else if ((spotTop - gap - cardH) >= margin) {
      cardLeft = clampLeft(spotLeft + spotW / 2 - cardW / 2);
      cardTop = spotTop - gap - cardH;
    } else if ((spotRight + gap + cardW + margin) <= vw) {
      cardLeft = spotRight + gap;
      cardTop = clampTop(spotTop);
    } else if ((spotLeft - gap - cardW) >= margin) {
      cardLeft = spotLeft - gap - cardW;
      cardTop = clampTop(spotTop);
    } else {
      cardLeft = vw - cardW - margin;
      cardTop = vh - cardH - margin;
    }

    cardEl.style.bottom = 'auto';
    cardEl.style.right = 'auto';
    cardEl.style.left = `${clampLeft(cardLeft)}px`;
    cardEl.style.top = `${clampTop(cardTop)}px`;
  }

  function startAlignmentMonitor(step, stepIdx) {
    clearLayoutMonitors();
    if (!isActive || !step || !step.targetSelector) return;

    const target = findVisibleTarget(step.targetSelector);
    if (target && typeof ResizeObserver === 'function') {
      try {
        activeResizeObserver = new ResizeObserver(() => {
          if (isActive && currentStepIdx === stepIdx) {
            positionSpotlightAndCard(step, { instant: true });
          }
        });
        activeResizeObserver.observe(target);
      } catch (_) {}
    }

    // Seguimiento continuo breve durante transiciones del panel (sidebar, Ajustes, MathLive)
    const startTs = typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now();

    const tick = () => {
      if (!isActive || currentStepIdx !== stepIdx) {
        settleRafId = null;
        return;
      }
      positionSpotlightAndCard(step, { instant: true });
      const now = typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();
      if ((now - startTs) < SETTLE_MONITOR_MS && typeof requestAnimationFrame === 'function') {
        settleRafId = requestAnimationFrame(tick);
      } else {
        settleRafId = null;
        if (spotlightEl) spotlightEl.classList.remove('is-tracking');
      }
    };

    if (typeof requestAnimationFrame === 'function') {
      settleRafId = requestAnimationFrame(tick);
    }
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

    clearLayoutMonitors();
    setTourScrollLock(true);
    executeStepNavigation(step);
    renderStepContent(step, bounded);

    // Encuadre instantáneo (sincrónico, sin smooth scroll) y medición inmediata
    frameTargetInstantly(step);
    positionSpotlightAndCard(step, { instant: true });
    startAlignmentMonitor(step, bounded);

    if (isAutoPlaying) {
      scheduleAutoAdvance();
    }
  }

  function finishTour(meta = {}) {
    if (!isActive) return;
    isActive = false;
    stopAutoPlay();
    clearDialogueTimers();
    clearLayoutMonitors();
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
        frameTargetInstantly(step);
        positionSpotlightAndCard(step, { instant: true });
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
