/* ==========================================================================
   MATETIC - Animación de Bienvenida y Recorrido Interactivo Menú por Menú
   Archivo: js/tools/welcome-tour.js
   Presenta de forma dinámica cada menú y herramienta de la aplicación con
   foco Spotlight móvil, diálogos progresivos y modo de reproducción automática.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const AUTO_STEP_DURATION_MS = 6200;
  const DIALOGUE_BEAT_MS = 950;

  const TOUR_STEPS = [
    {
      id: 'welcome',
      kind: 'intro',
      menuBadge: 'Bienvenida',
      icon: '∫π',
      title: '¡Te damos la bienvenida a MateTic!',
      targetSelector: null,
      dialogues: [
        'Tu laboratorio interactivo de matemáticas: <strong>9 materias</strong>, <strong>24 temas</strong> y herramientas profesionales funcionando <strong>100% sin conexión</strong>.',
        'Hagamos un recorrido dinámico <strong>menú por menú</strong> para descubrir cómo aprovechar cada función desde hoy.'
      ],
      highlights: ['📚 9 Materias completas', '🎓 Simulador PrepMat', '📈 Gráficas y animaciones', '📡 Sin internet (PWA)']
    },
    {
      id: 'header',
      kind: 'spotlight',
      menuBadge: 'Barra superior',
      icon: '🔍',
      title: 'Buscador, Racha, XP y Accesos Rápidos',
      targetSelector: '.top-header',
      dialogues: [
        'En la cabecera siempre verás tu <strong>racha diaria 🔥</strong> y tus puntos <strong>XP 🌱</strong>, que crecen al estudiar temas y resolver ejercicios.',
        'Usa el <strong>buscador instantáneo 🔍</strong> para saltar a cualquier tema o fórmula, alterna el tema visual 🌙 o abre la <strong>calculadora flotante 🧮</strong> en cualquier momento.'
      ],
      highlights: ['🔍 Búsqueda instantánea', '🔥 Racha y XP', '🧮 Calculadora rápida']
    },
    {
      id: 'dashboard',
      kind: 'spotlight',
      menuBadge: 'Panel Principal',
      icon: '📊',
      title: 'Panel Principal y Mapa Curricular',
      targetSelector: '.hero-banner',
      dialogues: [
        'El <strong>Panel Principal</strong> recuerda exactamente tu último tema para retomar con un solo toque en <strong>Continuar</strong>.',
        'Más abajo encontrarás rutas sugeridas, acceso destacado a <strong>PrepMat</strong> y el <strong>Mapa Curricular</strong> filtrable por bloque.'
      ],
      highlights: ['▶ Retomar estudio', '🧭 Rutas guiadas', '🗺️ Mapa de 24 temas']
    },
    {
      id: 'sidebar',
      kind: 'spotlight',
      menuBadge: 'Menú lateral',
      icon: '☰',
      title: 'Menú de Materias, Herramientas y Dominio',
      targetSelector: '#app-sidebar',
      openSidebarMobile: true,
      dialogues: [
        'Desde el <strong>Menú Lateral</strong> accedes a las <strong>9 materias</strong> (de Aritmética a Cálculo), cada una con su porcentaje de avance.',
        'Debajo están todas las herramientas interactivas, tu barra de <strong>Dominio Global</strong>, <strong>Ajustes ⚙️</strong> y el enlace de apoyo en Ko-fi.'
      ],
      highlights: ['9 Módulos curriculares', '📊 Dominio Global', '⚙️ Ajustes siempre a mano']
    },
    {
      id: 'lesson',
      kind: 'spotlight',
      menuBadge: 'Lecciones',
      icon: '📖',
      title: 'Estudio en 9 Etapas, Métodos y Palabras Sencillas',
      targetSelector: '.learning-tabs',
      previewAction: 'lesson',
      dialogues: [
        'Cada tema se divide en <strong>4 pestañas</strong>: <strong>Teoría</strong>, <strong>Ejemplos</strong>, <strong>Práctica</strong> y <strong>Evaluación</strong>.',
        'En Teoría hallarás <strong>múltiples formas de resolver</strong> con varios ejemplos resueltos por método, gráficas interactivas y el botón <strong>💡 Explicar en palabras más sencillas</strong>.'
      ],
      highlights: ['🧭 Múltiples métodos', '📚 3 ejemplos por método', '💡 Palabras sencillas']
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
        '<strong>PrepMat</strong> genera exámenes paramétricos sin repetición para <strong>Bachillerato</strong> y <strong>Licenciatura</strong> en las 9 ramas.',
        'Alterna entre <strong>Entrenamiento Guiado</strong> y <strong>Simulacro Oficial</strong> con cronómetro y diagnóstico analítico paso a paso.'
      ],
      highlights: ['⏱️ Cronómetro dual', '📝 Enunciados y directos', '📊 Diagnóstico completo']
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
        'Traza curvas en vivo, analiza <strong>raíces</strong>, <strong>derivadas</strong>, áreas bajo la curva y detecta automáticamente <strong>huecos removibles (0/0)</strong>.',
        'En celular puedes hacer zoom con dos dedos y ampliar la gráfica a <strong>pantalla completa</strong>.'
      ],
      highlights: ['🔎 Zoom y paneo suave', '⭕ Huecos removibles', '⛶ Vista expandida']
    },
    {
      id: 'formulas',
      kind: 'spotlight',
      menuBadge: 'Formularios',
      icon: '📄',
      title: 'Formularios Matemáticos de Referencia',
      targetSelector: '.tool-workspace-header, .formula-sheets-nav, #main-view-container',
      previewAction: 'formularios',
      dialogues: [
        'Consulta al instante leyes algebraicas, identidades trigonométricas, reglas de derivación y tablas de integrales.',
        'Todas las hojas están organizadas por tema y listas para <strong>estudiar o imprimir</strong> con tipografía matemática nítida.'
      ],
      highlights: ['📐 Identidades y reglas', '🖨️ Listos para imprimir', '⚡ Consulta rápida']
    },
    {
      id: 'editor',
      kind: 'spotlight',
      menuBadge: 'Editor Visual',
      icon: '∑',
      title: 'Editor Visual y Teclados Matemáticos',
      targetSelector: '.mathlive-field-wrapper, .tool-workspace-header, #main-view-container',
      previewAction: 'editor',
      dialogues: [
        'Construye fracciones, raíces, potencias, límites e integrales de forma visual sin memorizar comandos.',
        'Incluye un <strong>teclado de 6 categorías</strong> y teclado virtual matemático desplegable con botón <strong>✕ Ocultar</strong> integrado en su barra superior.'
      ],
      highlights: ['⌨️ 6 Categorías visuales', '✕ Cierre rápido del teclado', '📋 Copiar expresión']
    },
    {
      id: 'solver-calc',
      kind: 'spotlight',
      menuBadge: 'Resolución y Cálculo',
      icon: '🧭',
      title: 'Resolución Guiada y Calculadora Científica',
      targetSelector: '.tool-workspace-header, #main-view-container',
      previewAction: 'solucionador',
      dialogues: [
        'La <strong>Resolución Guiada</strong> te entrena paso a paso manteniendo bloqueados los pasos siguientes hasta que avanzas por tu cuenta.',
        'Y cuando necesites evaluar rápido en <strong>DEG o RAD</strong>, abre la <strong>Calculadora Científica 🧮</strong> desde el menú o el botón flotante.'
      ],
      highlights: ['🔒 Pasos progresivos', '🧮 Modo DEG / RAD', '🕘 Historial guardado']
    },
    {
      id: 'settings',
      kind: 'spotlight',
      menuBadge: 'Ajustes',
      icon: '⚙️',
      title: 'Personalización: Temas, Fondos y 4 Tipografías',
      targetSelector: '#settings-modal .sheet-modal-window',
      previewAction: 'settings',
      dialogues: [
        'En <strong>Ajustes ⚙️</strong> adaptas MateTic a tu estilo: modo <strong>Claro, Oscuro o Automático</strong>, <strong>6 fondos ambientales</strong> y <strong>4 tipos de letra</strong> (Moderna, Académica, Técnica y Lectura Clara).',
        'También puedes configurar la vibración háptica, el fondo animado y <strong>repetir este recorrido</strong> siempre que lo necesites.'
      ],
      highlights: ['🎨 6 Fondos claros/oscuros', '🔤 4 Tipos de letra', '🎬 Repetible cuando quieras']
    },
    {
      id: 'finish',
      kind: 'outro',
      menuBadge: '¡Listo!',
      icon: '🚀',
      title: '¡Todo listo para dominar las matemáticas!',
      targetSelector: null,
      previewAction: 'dashboard',
      dialogues: [
        'Has recorrido todos los menús y herramientas de <strong>MateTic</strong>. Tu progreso y preferencias se guardan automáticamente en este dispositivo.',
        'Elige una materia en el panel principal o reta tus conocimientos en <strong>PrepMat</strong>. ¡Mucho éxito!'
      ],
      highlights: ['✅ Recorrido completado', '💾 Progreso local seguro', '🚀 A practicar']
    }
  ];

  let isActive = false;
  let currentStepIdx = 0;
  let isAutoPlaying = false;
  let autoTimerId = null;
  let dialogueTimers = [];
  let rootEl = null;
  let spotlightEl = null;
  let cardEl = null;
  let keydownHandler = null;
  let repositionHandler = null;
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

  function clearDialogueTimers() {
    dialogueTimers.forEach((id) => clearTimeout(id));
    dialogueTimers = [];
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

    const isLast = currentStepIdx >= TOUR_STEPS.length - 1;
    if (isLast) {
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
    let existing = document.getElementById('welcome-tour-root');
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
      <div class="wt-spotlight" aria-hidden="true">
        <div class="wt-spotlight-pulse"></div>
      </div>
      <div class="wt-dialog-card" id="wt-dialog-card">
        <div class="wt-auto-progress" aria-hidden="true">
          <div class="wt-auto-progress-fill" id="wt-auto-fill"></div>
        </div>

        <div class="wt-card-top">
          <div class="wt-step-meta">
            <span class="wt-menu-badge" id="wt-menu-badge">Bienvenida</span>
            <span class="wt-step-counter" id="wt-step-counter">1 / ${TOUR_STEPS.length}</span>
          </div>
          <div class="wt-top-actions">
            <button type="button" class="wt-mini-btn" id="wt-btn-auto" aria-pressed="false" title="Avanzar automáticamente menú por menú">▶ Auto</button>
            <button type="button" class="wt-mini-btn wt-skip-btn" id="wt-btn-skip" aria-label="Omitir recorrido de bienvenida">✕ Omitir</button>
          </div>
        </div>

        <div class="wt-hero-stage" id="wt-hero-stage" hidden>
          <div class="wt-orbit-ring" aria-hidden="true">
            <span class="wt-orbit-sym s1">∫</span>
            <span class="wt-orbit-sym s2">π</span>
            <span class="wt-orbit-sym s3">∑</span>
            <span class="wt-orbit-sym s4">∞</span>
            <span class="wt-orbit-sym s5">√</span>
            <span class="wt-orbit-sym s6">∂</span>
          </div>
          <div class="wt-hero-emblem" id="wt-hero-emblem" aria-hidden="true">∫π</div>
        </div>

        <div class="wt-header-row">
          <div class="wt-guide-avatar" id="wt-guide-avatar" aria-hidden="true">
            <span id="wt-avatar-glyph">∫π</span>
            <span class="wt-speaking-dot"></span>
          </div>
          <div class="wt-title-wrap">
            <h2 class="wt-title" id="wt-title"></h2>
          </div>
        </div>

        <div class="wt-dialogues" id="wt-dialogues" aria-live="polite" title="Toca para mostrar todo el diálogo"></div>

        <div class="wt-highlights" id="wt-highlights"></div>

        <div class="wt-dots-bar" id="wt-dots-bar" role="tablist" aria-label="Pasos del recorrido">
          ${TOUR_STEPS.map((st, idx) => `
            <button type="button" class="wt-dot" data-wt-step="${idx}" aria-label="Ir al paso ${idx + 1}: ${st.menuBadge}"></button>
          `).join('')}
        </div>

        <div class="wt-footer-actions">
          <button type="button" class="btn btn-outline btn-sm wt-nav-btn" id="wt-btn-prev">← Anterior</button>
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
    wrapper.querySelectorAll('[data-wt-step]').forEach((dotBtn) => {
      dotBtn.addEventListener('click', () => {
        stopAutoPlay();
        haptic('light');
        const idx = Number(dotBtn.getAttribute('data-wt-step'));
        if (Number.isInteger(idx) && idx >= 0 && idx < TOUR_STEPS.length) {
          goToStep(idx);
        }
      });
    });

    return wrapper;
  }

  function revealAllCurrentDialogues() {
    clearDialogueTimers();
    if (!rootEl) return;
    rootEl.querySelectorAll('.wt-dialogue-bubble').forEach((el) => {
      el.classList.add('is-visible');
    });
    rootEl.querySelectorAll('.wt-highlight-pill').forEach((el) => {
      el.classList.add('is-visible');
    });
    rootEl.querySelector('.wt-guide-avatar')?.classList.remove('is-speaking');
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

  function positionSpotlightAndCard(step) {
    if (!rootEl || !spotlightEl || !cardEl || typeof window === 'undefined') return;

    const isCentered = step.kind === 'intro' || step.kind === 'outro' || !step.targetSelector;
    rootEl.classList.toggle('is-centered-step', isCentered);

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
      spotlightEl.classList.remove('is-active');
      return;
    }

    const vw = window.innerWidth || 1024;
    const vh = window.innerHeight || 768;
    const rawRect = target.getBoundingClientRect();
    const pad = 8;

    const left = Math.max(6, Math.min(vw - 24, rawRect.left - pad));
    const top = Math.max(6, Math.min(vh - 24, rawRect.top - pad));
    const width = Math.max(40, Math.min(vw - left - 6, rawRect.width + pad * 2));
    const height = Math.max(36, Math.min(vh - top - 6, rawRect.height + pad * 2));

    spotlightEl.style.left = `${left}px`;
    spotlightEl.style.top = `${top}px`;
    spotlightEl.style.width = `${width}px`;
    spotlightEl.style.height = `${height}px`;
    spotlightEl.classList.add('is-active');

    // En móvil fijamos la tarjeta en la zona inferior (o superior si el foco está abajo)
    if (vw <= 900) {
      cardEl.style.removeProperty('left');
      cardEl.style.removeProperty('right');
      const targetMidY = top + height / 2;
      if (targetMidY > vh * 0.56 && height < vh * 0.6) {
        cardEl.style.top = '12px';
        cardEl.style.bottom = 'auto';
      } else {
        cardEl.style.top = 'auto';
        cardEl.style.bottom = '12px';
      }
      return;
    }

    // Escritorio: ubicar la tarjeta sin tapar el objetivo resaltado
    const cardW = Math.min(440, vw - 32);
    const cardH = Math.min(cardEl.offsetHeight || 310, vh - 32);
    let cardLeft = Math.max(16, Math.min(vw - cardW - 16, left + width / 2 - cardW / 2));
    let cardTop = top + height + 16;

    if (step.id === 'sidebar') {
      cardLeft = Math.min(vw - cardW - 18, left + width + 20);
      cardTop = Math.max(20, Math.min(vh - cardH - 20, vh * 0.25));
    } else if (step.id === 'settings') {
      cardLeft = Math.max(18, vw - cardW - 22);
      cardTop = Math.max(18, vh - cardH - 22);
    } else if (cardTop + cardH > vh - 16) {
      if (top - cardH - 16 >= 16) {
        cardTop = top - cardH - 16;
      } else {
        cardTop = Math.max(16, vh - cardH - 18);
        cardLeft = Math.max(16, vw - cardW - 20);
      }
    }

    cardEl.style.bottom = 'auto';
    cardEl.style.right = 'auto';
    cardEl.style.left = `${Math.round(cardLeft)}px`;
    cardEl.style.top = `${Math.round(cardTop)}px`;
  }

  function renderStepContent(step, idx) {
    if (!rootEl) return;
    clearDialogueTimers();

    const badgeEl = rootEl.querySelector('#wt-menu-badge');
    const counterEl = rootEl.querySelector('#wt-step-counter');
    const titleEl = rootEl.querySelector('#wt-title');
    const avatarGlyph = rootEl.querySelector('#wt-avatar-glyph');
    const avatarEl = rootEl.querySelector('#wt-guide-avatar');
    const heroStage = rootEl.querySelector('#wt-hero-stage');
    const heroEmblem = rootEl.querySelector('#wt-hero-emblem');
    const dialoguesEl = rootEl.querySelector('#wt-dialogues');
    const highlightsEl = rootEl.querySelector('#wt-highlights');
    const prevBtn = rootEl.querySelector('#wt-btn-prev');
    const nextBtn = rootEl.querySelector('#wt-btn-next');

    if (badgeEl) badgeEl.textContent = step.menuBadge;
    if (counterEl) counterEl.textContent = `${idx + 1} / ${TOUR_STEPS.length}`;
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
        nextBtn.textContent = 'Comenzar recorrido →';
      } else if (idx === TOUR_STEPS.length - 1) {
        nextBtn.textContent = '🚀 ¡Empezar a estudiar!';
      } else {
        nextBtn.textContent = 'Siguiente →';
      }
    }

    rootEl.querySelectorAll('[data-wt-step]').forEach((dot, dIdx) => {
      dot.classList.toggle('is-active', dIdx === idx);
      dot.classList.toggle('is-done', dIdx < idx);
      dot.setAttribute('aria-selected', dIdx === idx ? 'true' : 'false');
    });

    const reduced = prefersReducedMotion();
    if (dialoguesEl) {
      dialoguesEl.innerHTML = (step.dialogues || []).map((htmlLine, lineIdx) => `
        <div class="wt-dialogue-bubble ${reduced || lineIdx === 0 ? 'is-visible' : ''}" data-beat="${lineIdx}">
          ${htmlLine}
        </div>
      `).join('');
    }

    if (highlightsEl) {
      highlightsEl.innerHTML = (step.highlights || []).map((chip) => `
        <span class="wt-highlight-pill ${reduced ? 'is-visible' : ''}">${chip}</span>
      `).join('');
    }

    if (!reduced && dialoguesEl) {
      avatarEl?.classList.add('is-speaking');
      const bubbles = [...dialoguesEl.querySelectorAll('.wt-dialogue-bubble')];
      bubbles.forEach((b, bIdx) => {
        if (bIdx === 0) return;
        const tid = setTimeout(() => {
          b.classList.add('is-visible');
        }, bIdx * DIALOGUE_BEAT_MS);
        dialogueTimers.push(tid);
      });

      const pillsDelay = Math.max(400, bubbles.length * DIALOGUE_BEAT_MS - 250);
      const pillTimer = setTimeout(() => {
        if (!rootEl) return;
        rootEl.querySelectorAll('.wt-highlight-pill').forEach((pill, pIdx) => {
          const pt = setTimeout(() => pill.classList.add('is-visible'), pIdx * 95);
          dialogueTimers.push(pt);
        });
        avatarEl?.classList.remove('is-speaking');
      }, pillsDelay);
      dialogueTimers.push(pillTimer);
    }

    // Re-disparar animación sutil de entrada de la tarjeta
    if (cardEl) {
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

    executeStepNavigation(step);
    renderStepContent(step, bounded);

    // Esperar un frame para que el DOM recién renderizado tenga geometría estable
    const reposition = () => {
      if (!isActive) return;
      positionSpotlightAndCard(step);
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        reposition();
        setTimeout(reposition, 180);
      });
    } else {
      reposition();
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
    closeTemporaryPanels();

    if (rootEl) {
      rootEl.classList.remove('is-open', 'is-autoplaying');
      rootEl.hidden = true;
    }

    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('has-welcome-tour');
      if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }
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
    document.documentElement.classList.add('has-welcome-tour');

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
      }
    };
    document.addEventListener('keydown', keydownHandler);

    repositionHandler = () => {
      if (isActive) {
        positionSpotlightAndCard(TOUR_STEPS[currentStepIdx]);
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
