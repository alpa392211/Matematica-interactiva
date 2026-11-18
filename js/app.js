/* ==========================================================================
   MATETIC - Controlador Principal de la Aplicación
   Archivo: js/app.js
   Implementa la estructura didáctica de 9 etapas por tema, gráficas
   interactivas integradas en cada lección, ejercicios con vista previa
   matemática en vivo y retroalimentación diagnóstica, y panel de progreso.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const THEME_STORAGE_KEY = 'matematica_interactiva_tema_v1';

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
    quizSubmitted: {},        // { [topicId]: boolean }
    dashboardMapQuery: '',
    dashboardBlockFilter: 'todos'
  };

  function getSystemPrefersDark() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function getActiveTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') return explicit;
    return getSystemPrefersDark() ? 'dark' : 'light';
  }

  function getSavedThemeMode() {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (_) {
      // Ignorar si localStorage no está disponible
    }
    return 'auto';
  }

  function applyThemeVisualRefresh() {
    syncThemeButton();
    syncThemeSegmentedControl();
    applySavedBgPresets();
    if (ns.DemoAnimations && typeof ns.DemoAnimations.refreshAllThemes === 'function') {
      ns.DemoAnimations.refreshAllThemes();
    }
    if (ns.GrapherTool && typeof ns.GrapherTool.drawGraph === 'function') {
      ns.GrapherTool.drawGraph();
    }
    if (ns.LessonGraphs && typeof ns.LessonGraphs.redrawAllVisible === 'function') {
      ns.LessonGraphs.redrawAllVisible();
    }
  }

  function setThemeMode(mode) {
    const normalized = mode === 'dark' || mode === 'light' ? mode : 'auto';
    if (normalized === 'auto') {
      document.documentElement.removeAttribute('data-theme');
      try {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (_) {}
    } else {
      document.documentElement.setAttribute('data-theme', normalized);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, normalized);
      } catch (_) {}
    }
    applyThemeVisualRefresh();
  }

  function syncThemeButton() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;
    const isDark = getActiveTheme() === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    const iconEl = btn.querySelector('.theme-toggle-icon');
    const textEl = btn.querySelector('.theme-toggle-text');
    if (iconEl) iconEl.textContent = isDark ? '☀️' : '🌙';
    if (textEl) textEl.textContent = isDark ? 'Claro' : 'Oscuro';
  }

  function syncThemeSegmentedControl() {
    const activeMode = getSavedThemeMode();
    document.querySelectorAll('[data-theme-choice]').forEach(btn => {
      const choice = btn.getAttribute('data-theme-choice');
      btn.setAttribute('aria-pressed', choice === activeMode ? 'true' : 'false');
    });
  }

  function flashBgNotice(noticeEl) {
    if (!noticeEl || noticeEl.hidden) return;
    noticeEl.classList.remove('is-notice-flash');
    void noticeEl.offsetWidth;
    noticeEl.classList.add('is-notice-flash');
  }

  function applySavedBgPresets() {
    const prefs = (ns.Preferences && typeof ns.Preferences.getPreferences === 'function')
      ? ns.Preferences.getPreferences()
      : { lightBgPreset: 'cristal', darkBgPreset: 'cosmos' };
    const lightPreset = prefs.lightBgPreset || 'cristal';
    const darkPreset = prefs.darkBgPreset || 'cosmos';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-bg-light', lightPreset);
      document.documentElement.setAttribute('data-bg-dark', darkPreset);

      const savedMode = getSavedThemeMode();
      const activeTheme = getActiveTheme();
      const lightLocked = savedMode === 'dark';
      const darkLocked = savedMode === 'light';

      const lightRow = document.getElementById('settings-row-bg-light');
      const darkRow = document.getElementById('settings-row-bg-dark');
      const lightNotice = document.getElementById('settings-bg-light-notice');
      const darkNotice = document.getElementById('settings-bg-dark-notice');

      document.querySelectorAll('[data-bg-light-choice]').forEach(btn => {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-bg-light-choice') === lightPreset ? 'true' : 'false');
        btn.disabled = lightLocked;
        btn.setAttribute('aria-disabled', lightLocked ? 'true' : 'false');
      });
      document.querySelectorAll('[data-bg-dark-choice]').forEach(btn => {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-bg-dark-choice') === darkPreset ? 'true' : 'false');
        btn.disabled = darkLocked;
        btn.setAttribute('aria-disabled', darkLocked ? 'true' : 'false');
      });

      if (lightRow) lightRow.classList.toggle('is-locked-bg-row', lightLocked);
      if (darkRow) darkRow.classList.toggle('is-locked-bg-row', darkLocked);

      if (lightNotice) {
        lightNotice.classList.remove('is-locked', 'is-auto-notice');
        if (lightLocked) {
          lightNotice.hidden = false;
          lightNotice.classList.add('is-locked');
          lightNotice.textContent = '🔒 Bloqueado en modo Oscuro. Cambia a Claro o Automático para editarlo.';
        } else if (savedMode === 'auto' && activeTheme === 'dark') {
          lightNotice.hidden = false;
          lightNotice.classList.add('is-auto-notice');
          lightNotice.textContent = 'ℹ️ Modo automático: solo se verá cuando el dispositivo cambie a modo claro.';
        } else {
          lightNotice.hidden = true;
          lightNotice.textContent = '';
        }
      }

      if (darkNotice) {
        darkNotice.classList.remove('is-locked', 'is-auto-notice');
        if (darkLocked) {
          darkNotice.hidden = false;
          darkNotice.classList.add('is-locked');
          darkNotice.textContent = '🔒 Bloqueado en modo Claro. Cambia a Oscuro o Automático para editarlo.';
        } else if (savedMode === 'auto' && activeTheme === 'light') {
          darkNotice.hidden = false;
          darkNotice.classList.add('is-auto-notice');
          darkNotice.textContent = 'ℹ️ Modo automático: solo se verá cuando el dispositivo cambie a modo oscuro.';
        } else {
          darkNotice.hidden = true;
          darkNotice.textContent = '';
        }
      }
    }
    if (ns.AmbientBackground && typeof ns.AmbientBackground.refreshTheme === 'function') {
      ns.AmbientBackground.refreshTheme();
    }
  }

  function applySavedTheme() {
    const mode = getSavedThemeMode();
    if (mode === 'dark' || mode === 'light') {
      document.documentElement.setAttribute('data-theme', mode);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    syncThemeButton();
    syncThemeSegmentedControl();
    applySavedBgPresets();
  }

  function haptic(kind) {
    if (ns.Haptics && typeof ns.Haptics[kind] === 'function') {
      ns.Haptics[kind]();
    }
  }

  function syncSettingsMetadata() {
    const v = ns.Version || {};
    const appName = v.APP_NAME || 'MateTic';
    const appVersion = v.APP_VERSION || '';
    const studioName = v.STUDIO_NAME || 'ALPA Studio';
    const studioMeaning = String(v.STUDIO_MEANING || '').trim();

    const verEl = document.getElementById('settings-app-version');
    if (verEl) {
      verEl.textContent = appVersion ? `${appName} v${appVersion}` : appName;
    }

    const studioEl = document.getElementById('settings-app-studio');
    if (studioEl) {
      studioEl.textContent = studioMeaning
        ? `${studioName} — ${studioMeaning}`
        : studioName;
    }
  }

  function syncPreferenceSwitches() {
    const prefs = (ns.Preferences && typeof ns.Preferences.getPreferences === 'function')
      ? ns.Preferences.getPreferences()
      : { hapticsEnabled: true, ambientBgEnabled: true, showThemeButton: true };

    const hapticsSupported = ns.Haptics && typeof ns.Haptics.isSupported === 'function'
      ? ns.Haptics.isSupported()
      : false;

    const btnHaptics = document.getElementById('btn-toggle-haptics');
    const hapticsNote = document.getElementById('haptics-support-note');
    if (btnHaptics) {
      const on = Boolean(prefs.hapticsEnabled) && hapticsSupported;
      btnHaptics.disabled = !hapticsSupported;
      btnHaptics.setAttribute('aria-checked', on ? 'true' : 'false');
      btnHaptics.classList.toggle('is-on', Boolean(prefs.hapticsEnabled) && hapticsSupported);
    }
    if (hapticsNote) {
      hapticsNote.textContent = hapticsSupported
        ? 'Retroalimentación táctil breve al interactuar'
        : 'No disponible en este dispositivo';
    }

    const btnAmbient = document.getElementById('btn-toggle-ambient');
    if (btnAmbient) {
      const on = Boolean(prefs.ambientBgEnabled);
      btnAmbient.setAttribute('aria-checked', on ? 'true' : 'false');
      btnAmbient.classList.toggle('is-on', on);
    }

    const btnShowTheme = document.getElementById('btn-toggle-show-theme-btn');
    if (btnShowTheme) {
      const showBtn = prefs.showThemeButton !== false;
      btnShowTheme.setAttribute('aria-checked', showBtn ? 'true' : 'false');
      btnShowTheme.classList.toggle('is-on', showBtn);
    }

    const headerThemeBtn = document.getElementById('btn-theme-toggle');
    if (headerThemeBtn) {
      headerThemeBtn.classList.toggle('is-hidden-by-pref', prefs.showThemeButton === false);
    }

    syncThemeSegmentedControl();
    applySavedBgPresets();
    syncSettingsMetadata();
  }

  const activeDialogStack = [];
  let whatsNewShownThisSession = false;
  let pendingAutoWhatsNew = false;
  let devOldNoticesUnlocked = false;

  function syncFloatingMenuButton() {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const btn = document.getElementById('btn-floating-open-sidebar');
    if (!btn) return;

    const isMobile = window.innerWidth <= 900;
    const sidebarOpen = Boolean(document.getElementById('app-sidebar')?.classList.contains('open'));
    const exitedOpen = Boolean(document.getElementById('app-exited-overlay') && !document.getElementById('app-exited-overlay').hidden);
    const hasOverlay = activeDialogStack.length > 0 || sidebarOpen || exitedOpen || document.documentElement.classList.contains('has-open-overlay');

    let scrolledPastHeader = false;
    if (isMobile && !hasOverlay) {
      const topHeader = document.querySelector('.top-header');
      const mainContent = document.querySelector('.main-content');
      const winScroll = window.scrollY || window.pageYOffset || 0;
      const mainScroll = mainContent ? mainContent.scrollTop : 0;
      if (topHeader && typeof topHeader.getBoundingClientRect === 'function') {
        const rect = topHeader.getBoundingClientRect();
        scrolledPastHeader = rect.height > 0 ? rect.bottom <= 10 : (winScroll > 75 || mainScroll > 75);
      } else {
        scrolledPastHeader = winScroll > 75 || mainScroll > 75;
      }
    }

    const shouldShow = isMobile && !hasOverlay && scrolledPastHeader;
    btn.classList.toggle('is-visible', shouldShow);
    btn.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    btn.tabIndex = shouldShow ? 0 : -1;
  }

  function getFocusableInside(container) {
    if (!container) return [];
    return [...container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.hasAttribute('hidden') && el.getClientRects().length > 0);
  }

  let lockedScrollY = 0;

  function syncModalScrollLock() {
    if (typeof document === 'undefined') return;
    const sidebarOpen = Boolean(document.getElementById('app-sidebar')?.classList.contains('open'));
    const calcFnSheetOpen = Boolean(document.getElementById('calc-fn-mobile-sheet-backdrop'));
    const hasOverlay = activeDialogStack.length > 0 || sidebarOpen || calcFnSheetOpen;
    const wasLocked = document.documentElement.classList.contains('has-open-overlay');

    if (hasOverlay && !wasLocked) {
      lockedScrollY = (typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0);
      document.documentElement.style.setProperty('--scroll-lock-top', `-${lockedScrollY}px`);
      document.documentElement.classList.add('has-open-overlay');
      document.body.classList.add('has-open-overlay');
    } else if (!hasOverlay && wasLocked) {
      const htmlEl = document.documentElement;
      const prevScrollBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = 'auto';
      htmlEl.classList.remove('has-open-overlay');
      document.body.classList.remove('has-open-overlay');
      htmlEl.style.removeProperty('--scroll-lock-top');
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, lockedScrollY);
      }
      if (prevScrollBehavior) {
        htmlEl.style.scrollBehavior = prevScrollBehavior;
      } else {
        htmlEl.style.removeProperty('scroll-behavior');
      }
    }
    syncFloatingMenuButton();
  }

  let overlayListenersBound = false;

  function bindGlobalButtonPhysicsAndScrollGuard() {
    if (overlayListenersBound || typeof document === 'undefined') return;
    overlayListenersBound = true;

    const BTN_SELECTOR = [
      'button',
      '[role="button"]',
      '.btn',
      '.nav-item',
      '.topic-selector-btn',
      '.learning-tab-btn',
      '.calc-key',
      '.calc-fn-tab',
      '.calc-fn-chip',
      '.quick-tool-btn',
      '.theme-toggle-btn',
      '.sidebar-settings-btn',
      '.kofi-support-btn',
      '.prepmat-option-btn',
      '.prepmat-card-btn',
      '.prepmat-mode-tab',
      '.settings-bg-swatch-btn',
      '.numerus-module-btn'
    ].join(', ');

    const triggerSpringRebound = (el) => {
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      el.classList.remove('is-spring-pressed');
      void el.offsetWidth;
      el.classList.add('is-spring-pressed');
      if (el._springTimer) clearTimeout(el._springTimer);
      el._springTimer = setTimeout(() => {
        el.classList.remove('is-spring-pressed');
      }, 410);
    };

    document.addEventListener('pointerdown', (ev) => {
      const btn = ev.target && typeof ev.target.closest === 'function'
        ? ev.target.closest(BTN_SELECTOR)
        : null;
      if (btn) triggerSpringRebound(btn);
    }, { passive: true });

    document.addEventListener('click', (ev) => {
      // Cubre activaciones por teclado (Enter / Espacio) o pruebas programáticas
      if (ev.detail === 0) {
        const btn = ev.target && typeof ev.target.closest === 'function'
          ? ev.target.closest(BTN_SELECTOR)
          : null;
        if (btn) triggerSpringRebound(btn);
      }
    });

    // Impide que deslizar sobre el fondo oscuro o cabeceras fijas haga scroll en la vista de abajo
    document.addEventListener('touchmove', (ev) => {
      if (!document.documentElement.classList.contains('has-open-overlay')) return;
      const target = ev.target;
      if (!target || typeof target.closest !== 'function') {
        ev.preventDefault();
        return;
      }
      const insideScrollable = target.closest(
        '.sheet-modal-body, .quick-modal-body, .sidebar-scroll, .calc-fn-sheet, math-field'
      );
      if (!insideScrollable) {
        ev.preventDefault();
      }
    }, { passive: false });
  }

  function openAccessibleDialog(modalEl, options = {}) {
    if (!modalEl) return;
    if (activeDialogStack.some(d => d.el === modalEl)) return;
    const returnFocusEl = options.returnFocusEl || document.activeElement;
    modalEl.classList.remove('open');
    modalEl.hidden = false;
    void modalEl.offsetWidth; // Reinicia limpiamente la animación CSS al abrir
    modalEl.classList.add('open');

    const entry = {
      el: modalEl,
      returnFocusEl,
      onClose: typeof options.onClose === 'function' ? options.onClose : null
    };
    activeDialogStack.push(entry);
    syncModalScrollLock();

    const focusables = getFocusableInside(modalEl);
    const firstFocus = options.initialFocusEl || focusables[0];
    if (firstFocus && typeof firstFocus.focus === 'function') {
      requestAnimationFrame(() => firstFocus.focus());
    }
  }

  function closeAccessibleDialog(modalEl) {
    if (!modalEl) return;
    const idx = activeDialogStack.findIndex(d => d.el === modalEl);
    const entry = idx >= 0 ? activeDialogStack.splice(idx, 1)[0] : null;
    modalEl.classList.remove('open');
    if (modalEl.id === 'quick-tool-modal') {
      document.getElementById('calc-fn-mobile-sheet-backdrop')?.remove();
    } else {
      modalEl.hidden = true;
    }
    syncModalScrollLock();
    if (entry && entry.onClose) {
      entry.onClose();
    }
    if (entry && entry.returnFocusEl && typeof entry.returnFocusEl.focus === 'function' && document.contains(entry.returnFocusEl)) {
      entry.returnFocusEl.focus();
    }
    if (activeDialogStack.length === 0 && pendingAutoWhatsNew && !whatsNewShownThisSession) {
      setTimeout(() => maybeAutoShowWhatsNew(), 60);
    }
  }

  function handleDialogTabTrap(ev) {
    if (ev.key !== 'Tab' || activeDialogStack.length === 0) return;
    const topDialog = activeDialogStack[activeDialogStack.length - 1];
    const focusables = getFocusableInside(topDialog.el);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (ev.shiftKey && (document.activeElement === first || !topDialog.el.contains(document.activeElement))) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && (document.activeElement === last || !topDialog.el.contains(document.activeElement))) {
      ev.preventDefault();
      first.focus();
    }
  }

  function bindSettingsEvents() {
    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');

    btnOpenSettings?.addEventListener('click', () => {
      closeMobileSidebar();
      syncPreferenceSwitches();
      syncPwaAndOfflineUI();
      haptic('confirm');
      openAccessibleDialog(settingsModal, { returnFocusEl: btnOpenSettings });
    });

    btnCloseSettings?.addEventListener('click', () => {
      haptic('confirm');
      closeAccessibleDialog(settingsModal);
    });

    settingsModal?.addEventListener('click', (ev) => {
      if (ev.target === settingsModal) {
        closeAccessibleDialog(settingsModal);
      }
    });

    const btnHaptics = document.getElementById('btn-toggle-haptics');
    btnHaptics?.addEventListener('click', () => {
      if (!ns.Preferences || btnHaptics.disabled) return;
      const cur = ns.Preferences.getPreferences();
      const next = !cur.hapticsEnabled;
      ns.Preferences.setPreference('hapticsEnabled', next);
      syncPreferenceSwitches();
      if (next) haptic('confirm');
    });

    const btnAmbient = document.getElementById('btn-toggle-ambient');
    btnAmbient?.addEventListener('click', () => {
      if (!ns.Preferences) return;
      const cur = ns.Preferences.getPreferences();
      const next = !cur.ambientBgEnabled;
      ns.Preferences.setPreference('ambientBgEnabled', next);
      syncPreferenceSwitches();
      haptic('light');
      if (ns.AmbientBackground && typeof ns.AmbientBackground.setEnabled === 'function') {
        ns.AmbientBackground.setEnabled(next);
      }
    });

    const btnShowTheme = document.getElementById('btn-toggle-show-theme-btn');
    btnShowTheme?.addEventListener('click', () => {
      if (!ns.Preferences) return;
      const cur = ns.Preferences.getPreferences();
      const next = cur.showThemeButton === false;
      ns.Preferences.setPreference('showThemeButton', next);
      syncPreferenceSwitches();
      haptic('light');
    });

    document.querySelectorAll('[data-theme-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('light');
        const choice = btn.getAttribute('data-theme-choice') || 'auto';
        setThemeMode(choice);
      });
    });

    document.querySelectorAll('[data-bg-light-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        haptic('light');
        const bgId = btn.getAttribute('data-bg-light-choice') || 'cristal';
        if (ns.Preferences && typeof ns.Preferences.setPreference === 'function') {
          ns.Preferences.setPreference('lightBgPreset', bgId);
        }
        applySavedBgPresets();
        flashBgNotice(document.getElementById('settings-bg-light-notice'));
      });
    });

    document.querySelectorAll('[data-bg-dark-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        haptic('light');
        const bgId = btn.getAttribute('data-bg-dark-choice') || 'cosmos';
        if (ns.Preferences && typeof ns.Preferences.setPreference === 'function') {
          ns.Preferences.setPreference('darkBgPreset', bgId);
        }
        applySavedBgPresets();
        flashBgNotice(document.getElementById('settings-bg-dark-notice'));
      });
    });

    const numerusModal = document.getElementById('numerus-cas-modal');
    const closeNumerusModal = () => {
      haptic('light');
      closeAccessibleDialog(numerusModal);
    };
    document.getElementById('btn-close-numerus-cas')?.addEventListener('click', closeNumerusModal);
    numerusModal?.addEventListener('click', (ev) => {
      if (ev.target === numerusModal) closeNumerusModal();
    });

    const CAS_MODULES_INFO = {
      calculadora: {
        title: 'Calculadora Simbólica CAS',
        desc: 'Motor de simplificación exacta, radicales, fracciones racionales y expresiones paso a paso.'
      },
      calculo: {
        title: 'Cálculo Simbólico Diferencial e Integral',
        desc: 'Derivadas de orden superior, integrales indefinidas/definidas exactas, límites y series de Taylor.'
      },
      graficas: {
        title: 'Graficador Científico Avanzado',
        desc: 'Trazado interactivo con múltiples curvas, intersecciones, extremos locales, tangentes e integrales.'
      },
      ecuaciones: {
        title: 'Solucionador de Ecuaciones y Sistemas',
        desc: 'Resolución simbólica exacta de ecuaciones algebraicas, exponenciales, trigonométricas y sistemas lineales.'
      },
      matrices: {
        title: 'Álgebra Matricial y Eigenvalores',
        desc: 'Operaciones con matrices, determinantes, inversas, eliminación gaussiana y descomposición espectral.'
      },
      estadistica: {
        title: 'Estadística Descriptiva e Inferencial',
        desc: 'Medidas de dispersión, regresiones polinómicas, intervalos de confianza y pruebas de hipótesis.'
      },
      tablas: {
        title: 'Tablas Numéricas Dinámicas',
        desc: 'Evaluación tabular de funciones $f(x)$, $f\'(x)$ y diferencias finitas con paso personalizable.'
      },
      probabilidad: {
        title: 'Distribuciones y Probabilidad',
        desc: 'Combinatoria avanzada y distribuciones Binomial, Poisson, Normal, t-Student y Chi-cuadrada.'
      }
    };

    numerusModal?.querySelectorAll('[data-cas-mod]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('light');
        numerusModal.querySelectorAll('[data-cas-mod]').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        const info = CAS_MODULES_INFO[btn.getAttribute('data-cas-mod')] || CAS_MODULES_INFO.calculadora;
        const preview = document.getElementById('numerus-module-preview');
        if (preview) {
          preview.innerHTML = `<strong>${info.title}</strong><span>${ns.MathRenderer ? ns.MathRenderer.formatRichText(info.desc) : info.desc}</span>`;
        }
      });
    });

    document.getElementById('btn-reset-preferences')?.addEventListener('click', () => {
      if (!window.confirm('¿Restablecer preferencias de interfaz (vibración, fondo animado, tema automático y visibilidad del botón de tema)? Tu progreso y XP permanecerán intactos.')) {
        return;
      }
      if (ns.Preferences && typeof ns.Preferences.resetPreferences === 'function') {
        ns.Preferences.resetPreferences();
      }
      setThemeMode('auto');
      if (ns.AmbientBackground && typeof ns.AmbientBackground.setEnabled === 'function') {
        ns.AmbientBackground.setEnabled(true);
      }
      syncPreferenceSwitches();
      haptic('confirm');
    });

    document.getElementById('btn-open-whats-new')?.addEventListener('click', () => {
      haptic('confirm');
      closeAccessibleDialog(settingsModal);
      openWhatsNewModal({
        manual: true,
        returnFocusEl: document.getElementById('btn-open-settings')
      });
    });

    const whatsNewModal = document.getElementById('whats-new-modal');
    const closeWhatsNew = () => {
      haptic('confirm');
      closeAccessibleDialog(whatsNewModal);
    };
    document.getElementById('btn-close-whats-new')?.addEventListener('click', closeWhatsNew);
    document.getElementById('btn-ack-whats-new')?.addEventListener('click', closeWhatsNew);
    whatsNewModal?.addEventListener('click', (ev) => {
      if (ev.target === whatsNewModal) closeWhatsNew();
    });

    document.getElementById('btn-install-pwa')?.addEventListener('click', async () => {
      if (!pwaState.deferredPrompt) return;
      haptic('confirm');
      try {
        await pwaState.deferredPrompt.prompt();
        const choice = await pwaState.deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          pwaState.deferredPrompt = null;
          pwaState.isInstalled = true;
        }
      } catch (_) {}
      syncPwaAndOfflineUI();
    });

    const confirmModal = document.getElementById('app-confirm-modal');
    const confirmTitleEl = document.getElementById('app-confirm-title');
    const confirmMsgEl = document.getElementById('app-confirm-message');
    const confirmOkBtn = document.getElementById('btn-app-confirm-ok');
    const confirmCancelBtn = document.getElementById('btn-app-confirm-cancel');
    const confirmCloseBtn = document.getElementById('btn-close-confirm-modal');
    let pendingConfirmCallback = null;

    function closeConfirmModal() {
      pendingConfirmCallback = null;
      closeAccessibleDialog(confirmModal);
    }

    function openAppConfirmDialog({
      title = 'Confirmar acción',
      message = '',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      danger = false,
      returnFocusEl = null,
      onConfirm = null
    } = {}) {
      if (!confirmModal) {
        if (typeof window !== 'undefined' && typeof window.confirm === 'function' && window.confirm(message)) {
          if (typeof onConfirm === 'function') onConfirm();
        }
        return;
      }
      if (confirmTitleEl) confirmTitleEl.textContent = title;
      if (confirmMsgEl) confirmMsgEl.textContent = message;
      if (confirmOkBtn) {
        confirmOkBtn.textContent = confirmText;
        confirmOkBtn.classList.toggle('btn-danger-solid', Boolean(danger));
        confirmOkBtn.classList.toggle('btn-primary', !danger);
      }
      if (confirmCancelBtn) confirmCancelBtn.textContent = cancelText;
      pendingConfirmCallback = typeof onConfirm === 'function' ? onConfirm : null;
      haptic('confirm');
      openAccessibleDialog(confirmModal, {
        returnFocusEl: returnFocusEl || document.activeElement,
        initialFocusEl: confirmCancelBtn || confirmOkBtn
      });
    }

    confirmCancelBtn?.addEventListener('click', () => {
      haptic('light');
      closeConfirmModal();
    });
    confirmCloseBtn?.addEventListener('click', () => {
      haptic('light');
      closeConfirmModal();
    });
    confirmModal?.addEventListener('click', (ev) => {
      if (ev.target === confirmModal) {
        haptic('light');
        closeConfirmModal();
      }
    });
    confirmOkBtn?.addEventListener('click', () => {
      const cb = pendingConfirmCallback;
      closeConfirmModal();
      if (typeof cb === 'function') cb();
    });

    function refreshCurrentView() {
      updateHeaderStats();
      renderSidebar();
      if (appState.currentView === 'dashboard') {
        navigateToDashboard();
      } else if (appState.currentView === 'subject') {
        openSubject(appState.activeSubjectId, appState.activeTopicId, appState.activeTab);
      } else if (appState.currentView === 'tool') {
        openTool(appState.activeToolId, appState.toolPresetExpr);
      }
    }

    function resetDeveloperSessionState() {
      devOldNoticesUnlocked = false;
      const devInput = document.getElementById('dev-code-input');
      const devFeedback = document.getElementById('settings-dev-feedback');
      const devDetails = document.getElementById('settings-dev-details');
      if (devInput) devInput.value = '';
      if (devFeedback) {
        devFeedback.textContent = '';
        devFeedback.hidden = true;
        devFeedback.classList.remove('is-success', 'is-error');
      }
      if (devDetails) devDetails.open = false;
    }

    function wipeAllAppData() {
      if (ns.Storage && typeof ns.Storage.resetAllProgress === 'function') {
        ns.Storage.resetAllProgress();
      }
      if (ns.PrepMatTool && ns.PrepMatTool.Storage && typeof ns.PrepMatTool.Storage.resetData === 'function') {
        ns.PrepMatTool.Storage.resetData();
      }
      try {
        window.localStorage.removeItem('mat_interactiva_editor_guide_seen_v1');
      } catch (_) {}
      if (ns.Preferences && typeof ns.Preferences.resetPreferences === 'function') {
        ns.Preferences.resetPreferences({ includeUpdateNotice: true });
      }
      setThemeMode('auto');
      if (ns.AmbientBackground && typeof ns.AmbientBackground.setEnabled === 'function') {
        ns.AmbientBackground.setEnabled(true);
      }
      resetDeveloperSessionState();
      syncPreferenceSwitches();
      refreshCurrentView();
      closeAccessibleDialog(settingsModal);
      haptic('confirm');
    }

    function exitApplication() {
      resetDeveloperSessionState();
      while (activeDialogStack.length > 0) {
        const top = activeDialogStack[activeDialogStack.length - 1];
        closeAccessibleDialog(top.el);
      }
      closeMobileSidebar();
      const exitedOverlay = document.getElementById('app-exited-overlay');
      if (exitedOverlay) {
        exitedOverlay.hidden = false;
      }
      syncFloatingMenuButton();
      try {
        if (typeof window.close === 'function') {
          window.close();
        }
      } catch (_) {}
    }

    document.getElementById('btn-wipe-all-data')?.addEventListener('click', (ev) => {
      openAppConfirmDialog({
        title: 'Borrar todos los datos',
        message: 'Se eliminarán de este dispositivo tu XP, rachas, temas estudiados, ejercicios, estadísticas de PrepMat y preferencias. Esta acción no se puede deshacer.',
        confirmText: 'Sí, borrar todo',
        cancelText: 'Cancelar',
        danger: true,
        returnFocusEl: ev.currentTarget,
        onConfirm: wipeAllAppData
      });
    });

    document.getElementById('btn-exit-app')?.addEventListener('click', (ev) => {
      openAppConfirmDialog({
        title: 'Salir de MateTic',
        message: '¿Estás seguro de que quieres salir de la aplicación?',
        confirmText: 'Sí, salir',
        cancelText: 'Quedarme',
        danger: false,
        returnFocusEl: ev.currentTarget,
        onConfirm: exitApplication
      });
    });

    document.getElementById('btn-reenter-app')?.addEventListener('click', () => {
      haptic('confirm');
      resetDeveloperSessionState();
      const exitedOverlay = document.getElementById('app-exited-overlay');
      if (exitedOverlay) exitedOverlay.hidden = true;
      syncFloatingMenuButton();
      navigateToDashboard();
    });

    const devCodeInput = document.getElementById('dev-code-input');
    const devFeedbackEl = document.getElementById('settings-dev-feedback');

    function showDevFeedback(msg, isSuccess) {
      if (!devFeedbackEl) return;
      devFeedbackEl.textContent = msg;
      devFeedbackEl.hidden = false;
      devFeedbackEl.classList.toggle('is-success', Boolean(isSuccess));
      devFeedbackEl.classList.toggle('is-error', !isSuccess);
    }

    function applyDeveloperCode() {
      const code = String(devCodeInput ? devCodeInput.value : '').trim();
      if (!code) {
        showDevFeedback('Ingresa un código numérico.', false);
        haptic('incorrect');
        return;
      }

      if (code === '06092109') {
        devOldNoticesUnlocked = true;
        if (devCodeInput) devCodeInput.value = '';
        showDevFeedback('Código aceptado: se desbloquearon todos los avisos de actualizaciones anteriores para esta sesión.', true);
        haptic('achievement');
        return;
      }

      if (code === '23410908') {
        let boosted = { xp: 0, streakDays: 1, globalPercentage: 0 };
        if (ns.Storage && typeof ns.Storage.applyDeveloperBoost === 'function') {
          boosted = ns.Storage.applyDeveloperBoost(ns.Curriculum || []);
        }
        if (ns.PrepMatTool && ns.PrepMatTool.Storage && typeof ns.PrepMatTool.Storage.applyDeveloperBoost === 'function') {
          ns.PrepMatTool.Storage.applyDeveloperBoost(boosted.streakDays);
        }
        if (devCodeInput) devCodeInput.value = '';
        refreshCurrentView();
        showDevFeedback(
          `Código aceptado: XP a ${boosted.xp} XP, racha a ${boosted.streakDays} días y dominio a ${boosted.globalPercentage}%.`,
          true
        );
        haptic('achievement');
        return;
      }

      showDevFeedback('Código no válido.', false);
      haptic('incorrect');
    }

    document.getElementById('btn-apply-dev-code')?.addEventListener('click', applyDeveloperCode);
    devCodeInput?.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        applyDeveloperCode();
      }
    });

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pagehide', () => {
        devOldNoticesUnlocked = false;
      });
    }
  }

  const pwaState = {
    deferredPrompt: null,
    swStatus: 'preparing', // 'preparing' | 'ready' | 'unsupported'
    isInstalled: false
  };

  function isStandaloneApp() {
    try {
      return (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator?.standalone === true;
    } catch (_) {
      return false;
    }
  }

  function isIosSafariDevice() {
    try {
      const ua = window.navigator?.userAgent || '';
      return /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
    } catch (_) {
      return false;
    }
  }

  function isSecureSwOrigin() {
    try {
      return Boolean(
        window.isSecureContext ||
        window.location?.hostname === 'localhost' ||
        window.location?.hostname === '127.0.0.1'
      );
    } catch (_) {
      return false;
    }
  }

  function syncPwaAndOfflineUI() {
    const statusEl = document.getElementById('settings-offline-status');
    const badgeEl = document.getElementById('settings-offline-badge');
    const installRow = document.getElementById('settings-install-row');
    const installNote = document.getElementById('settings-install-note');
    const installBtn = document.getElementById('btn-install-pwa');

    if (statusEl) {
      if (pwaState.swStatus === 'ready') {
        statusEl.textContent = 'Disponible sin conexión';
      } else if (pwaState.swStatus === 'unsupported') {
        statusEl.textContent = 'No disponible en este navegador';
      } else {
        statusEl.textContent = 'Preparando uso sin conexión…';
      }
    }
    if (badgeEl) {
      badgeEl.classList.toggle('is-offline-ready', pwaState.swStatus === 'ready');
      badgeEl.textContent = pwaState.swStatus === 'ready'
        ? 'Listo'
        : pwaState.swStatus === 'unsupported' ? 'N/D' : 'Cargando';
    }

    if (!installRow || !installBtn) return;
    const standalone = pwaState.isInstalled || isStandaloneApp();
    if (standalone) {
      installRow.hidden = false;
      installBtn.hidden = false;
      installBtn.disabled = true;
      installBtn.textContent = '✓ Aplicación instalada';
      if (installNote) installNote.textContent = 'Ejecutándose en modo aplicación independiente';
    } else if (pwaState.deferredPrompt) {
      installRow.hidden = false;
      installBtn.hidden = false;
      installBtn.disabled = false;
      installBtn.textContent = '📲 Instalar aplicación';
      if (installNote) installNote.textContent = 'Acceso directo e inicio rápido sin internet';
    } else if (isIosSafariDevice()) {
      installRow.hidden = false;
      installBtn.hidden = true;
      if (installNote) installNote.textContent = 'En iOS/Safari: pulsa Compartir > Añadir a pantalla de inicio';
    } else {
      installRow.hidden = true;
    }
  }

  function initPwaSupport() {
    pwaState.isInstalled = isStandaloneApp();

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (ev) => {
        ev.preventDefault();
        pwaState.deferredPrompt = ev;
        syncPwaAndOfflineUI();
      });
      window.addEventListener('appinstalled', () => {
        pwaState.deferredPrompt = null;
        pwaState.isInstalled = true;
        syncPwaAndOfflineUI();
      });
    }

    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator) || !isSecureSwOrigin()) {
      pwaState.swStatus = 'unsupported';
      syncPwaAndOfflineUI();
      return;
    }

    const updateFromRegistration = (reg) => {
      if (navigator.serviceWorker.controller || (reg && reg.active && reg.active.state === 'activated')) {
        pwaState.swStatus = 'ready';
        syncPwaAndOfflineUI();
        return;
      }
      const tracked = reg && (reg.installing || reg.waiting);
      if (tracked) {
        tracked.addEventListener('statechange', () => {
          if (tracked.state === 'activated' || navigator.serviceWorker.controller) {
            pwaState.swStatus = 'ready';
            syncPwaAndOfflineUI();
          }
        });
      }
    };

    try {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        pwaState.swStatus = 'ready';
        syncPwaAndOfflineUI();
      });
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then((reg) => {
          updateFromRegistration(reg);
          return navigator.serviceWorker.ready.then(() => {
            pwaState.swStatus = 'ready';
            syncPwaAndOfflineUI();
          });
        })
        .catch(() => {
          pwaState.swStatus = 'unsupported';
          syncPwaAndOfflineUI();
        });
    } catch (_) {
      pwaState.swStatus = 'unsupported';
      syncPwaAndOfflineUI();
    }

    syncPwaAndOfflineUI();
  }

  function escapeSimpleHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function classifyWhatsNewItem(itemText) {
    const raw = String(itemText || '').trim();
    let icon = '✨';
    let defaultTitle = 'Mejora de la plataforma';

    if (/resoluci[oó]n guiada|tutor|difuminado|paso a paso/i.test(raw)) {
      icon = '🧭';
      defaultTitle = 'Resolución Guiada y Tutor Progresivo';
    } else if (/liquid glass|cristal l[ií]quido|transiciones|animaci[oó]n|dise[nñ]o|interlineado|espacio|tema/i.test(raw)) {
      icon = '💎';
      defaultTitle = 'Diseño y Animaciones Liquid Glass';
    } else if (/sin conexi[oó]n|offline|pwa|instalable|katex|mathlive/i.test(raw)) {
      icon = '📴';
      defaultTitle = 'Modo Offline y Motor Matemático Local';
    } else if (/ajustes|preferencias|vibraci[oó]n|h[aá]ptic/i.test(raw)) {
      icon = '⚙️';
      defaultTitle = 'Panel de Ajustes y Preferencias';
    } else if (/calculadora|grados|tokens|cat[aá]logo/i.test(raw)) {
      icon = '🧮';
      defaultTitle = 'Calculadora Científica';
    } else if (/gr[aá]fica|gestos|pantalla completa|precisi[oó]n|huecos/i.test(raw)) {
      icon = '📈';
      defaultTitle = 'Gráficas Interactivas y Precisión';
    } else if (/teorema|demostraci[oó]n|c[aá]lculo|curr[ií]culo|ejemplos|m[oó]dulos|índice|mapa/i.test(raw)) {
      icon = '📐';
      defaultTitle = 'Contenido Académico y Rigor';
    }

    const colonIdx = raw.indexOf(':');
    if (colonIdx > 3 && colonIdx < 48) {
      return {
        icon,
        title: raw.slice(0, colonIdx).trim(),
        desc: raw.slice(colonIdx + 1).trim()
      };
    }

    return { icon, title: defaultTitle, desc: raw };
  }

  function renderWhatsNewNotesHtml(notes, isManual, isFirstInstall) {
    const v = ns.Version || {};
    const appName = v.APP_NAME || 'MateTic';
    const appTagline = v.APP_TAGLINE || 'Matemáticas Interactivas';
    const introText = isManual
      ? `Historial organizado de mejoras y lanzamientos en ${appName} (${appTagline}).`
      : isFirstInstall
        ? `Te damos la bienvenida a ${appName} (${appTagline}). Explora las novedades clave de esta versión:`
        : `Tu aplicación se actualizó correctamente. Estas son las mejoras organizadas de ${appName}:`;

    return `
      <p class="whats-new-intro">${introText}</p>
      <div class="whats-new-release-list">
        ${notes.map((entry, idx) => {
          const items = Array.isArray(entry.items) ? entry.items : [];
          return `
            <article class="whats-new-release-card ${idx === 0 ? 'is-current' : ''}">
              <div class="whats-new-release-head">
                <div class="whats-new-head-left">
                  <span class="whats-new-ver-badge">v${entry.version}</span>
                  ${idx === 0 ? '<span class="whats-new-latest-pill">Última versión</span>' : ''}
                </div>
                <div class="whats-new-head-right">
                  <span class="whats-new-count-badge">${items.length} cambios</span>
                  <span class="whats-new-date">${entry.date || ''}</span>
                </div>
              </div>
              <ul class="whats-new-items whats-new-items-grid">
                ${items.map((item, itemIdx) => {
                  const parsed = classifyWhatsNewItem(item);
                  return `
                    <li class="whats-new-item-card" data-item-index="${itemIdx}">
                      <span class="whats-new-item-icon" aria-hidden="true">${parsed.icon}</span>
                      <div class="whats-new-item-content">
                        <strong class="whats-new-item-title">${escapeSimpleHtml(parsed.title)}</strong>
                        <span class="whats-new-item-desc">${escapeSimpleHtml(parsed.desc)}</span>
                      </div>
                    </li>
                  `;
                }).join('')}
              </ul>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  function openWhatsNewModal({ manual = false, returnFocusEl = null, notesOverride = null, hasMore = false, isFirstInstall = false } = {}) {
    const whatsNewModal = document.getElementById('whats-new-modal');
    const titleEl = document.getElementById('whats-new-title');
    const bodyEl = document.getElementById('whats-new-body');
    const ackBtn = document.getElementById('btn-ack-whats-new');
    if (!whatsNewModal || !bodyEl) return;

    const v = ns.Version || {};
    const appName = v.APP_NAME || 'MateTic';
    const currentVer = v.APP_VERSION || '';
    const allNotes = Array.isArray(v.RELEASE_NOTES) ? v.RELEASE_NOTES : [];
    const notesToShow = devOldNoticesUnlocked
      ? allNotes
      : (allNotes.length ? [allNotes[0]] : (notesOverride ? notesOverride.slice(0, 1) : []));

    if (titleEl) {
      titleEl.textContent = manual
        ? `✨ Novedades de ${appName}`
        : `🎉 Novedades de ${appName} v${currentVer}`;
    }

    bodyEl.innerHTML = renderWhatsNewNotesHtml(notesToShow, manual, isFirstInstall);
    if (bodyEl && typeof bodyEl.scrollTo === 'function') {
      bodyEl.scrollTop = 0;
    }

    haptic('confirm');
    openAccessibleDialog(whatsNewModal, {
      returnFocusEl: returnFocusEl || document.activeElement,
      initialFocusEl: ackBtn,
      onClose: () => {
        whatsNewShownThisSession = true;
        pendingAutoWhatsNew = false;
        if (currentVer && ns.Preferences && typeof ns.Preferences.setPreference === 'function') {
          try {
            ns.Preferences.setPreference('lastSeenVersion', currentVer);
          } catch (_) {
            // Ya quedó marcada la bandera de sesión para evitar bucle si falla localStorage
          }
        }
      }
    });
  }

  function maybeAutoShowWhatsNew() {
    const v = ns.Version;
    if (!v || typeof v.resolveUpdateNoticeState !== 'function') return false;
    const prefs = (ns.Preferences && typeof ns.Preferences.getPreferences === 'function')
      ? ns.Preferences.getPreferences()
      : { lastSeenVersion: '' };

    const notice = v.resolveUpdateNoticeState({
      currentVersion: v.APP_VERSION,
      lastSeenVersion: prefs.lastSeenVersion,
      releaseNotes: v.RELEASE_NOTES,
      maxNotes: 3,
      alreadyShownInSession: whatsNewShownThisSession
    });
    if (!notice.shouldShow) return false;

    if (activeDialogStack.length > 0) {
      pendingAutoWhatsNew = true;
      return false;
    }

    whatsNewShownThisSession = true;
    openWhatsNewModal({
      manual: false,
      notesOverride: notice.notes,
      hasMore: notice.hasMore,
      isFirstInstall: notice.isFirstInstall
    });
    return true;
  }

  function toggleTheme() {
    haptic('light');
    const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
  }

  function getAppName() {
    return (ns.Version && ns.Version.APP_NAME) || 'MateTic';
  }

  function getAppTagline() {
    return (ns.Version && ns.Version.APP_TAGLINE) || 'Matemáticas Interactivas';
  }

  function syncAppBrand() {
    const appName = getAppName();
    const appTagline = getAppTagline();
    if (typeof document === 'undefined') return;
    document.title = `${appName} | ${appTagline}`;
    const brandTitleEl = document.querySelector('.sidebar-brand .brand-title');
    if (brandTitleEl) brandTitleEl.textContent = appName;
    const brandSubtitleEl = document.querySelector('.sidebar-brand .brand-subtitle');
    if (brandSubtitleEl) brandSubtitleEl.textContent = appTagline;
    syncSettingsMetadata();
  }

  function init() {
    syncAppBrand();
    applySavedTheme();
    syncPreferenceSwitches();
    bindSettingsEvents();
    bindGlobalButtonPhysicsAndScrollGuard();
    initPwaSupport();
    if (ns.AmbientBackground && typeof ns.AmbientBackground.init === 'function') {
      ns.AmbientBackground.init();
    }
    renderSidebar();
    updateHeaderStats();
    bindGlobalHeaderEvents();
    navigateToDashboard();
    maybeAutoShowWhatsNew();
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
      { id: 'prepmat', name: 'PrepMat · Exámenes', icon: '🎓' },
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
          <li>
            <button class="nav-item nav-item-cas" id="btn-sidebar-numerus-cas" type="button">
              <span class="nav-icon">⚛️</span>
              <span class="nav-label">Calculadora con Álgebra Computacional</span>
              <span class="nav-badge nav-badge-cas">CAS</span>
            </button>
          </li>
        </ul>
      </div>
    `;

    const pctText = document.getElementById('sidebar-global-pct');
    const pctFill = document.getElementById('sidebar-global-fill');
    if (pctText) pctText.textContent = `${stats.globalPercentage}%`;
    if (pctFill) pctFill.style.width = `${stats.globalPercentage}%`;

    navContainer.querySelector('#btn-sidebar-numerus-cas')?.addEventListener('click', () => {
      haptic('confirm');
      const triggerEl = document.getElementById('btn-sidebar-numerus-cas');
      closeMobileSidebar();
      openAccessibleDialog(document.getElementById('numerus-cas-modal'), {
        returnFocusEl: triggerEl
      });
    });

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

  function makeKeyboardClickable(container, selector) {
    if (!container) return;
    container.querySelectorAll(selector).forEach(el => {
      const tag = el.tagName;
      if (tag !== 'BUTTON' && tag !== 'A') {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
        el.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            el.click();
          }
        });
      }
    });
  }

  function closeMobileSidebar() {
    document.getElementById('app-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
    document.getElementById('btn-open-sidebar')?.setAttribute('aria-expanded', 'false');
    document.getElementById('btn-floating-open-sidebar')?.setAttribute('aria-expanded', 'false');
    syncModalScrollLock();
  }

  function bindGlobalHeaderEvents() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btnOpenSidebar = document.getElementById('btn-open-sidebar');
    const btnFloatingSidebar = document.getElementById('btn-floating-open-sidebar');
    const searchInp = document.getElementById('global-search-input');
    const dropdown = document.getElementById('global-search-dropdown');
    const modal = document.getElementById('quick-tool-modal');
    const modalBody = document.getElementById('quick-tool-modal-body');

    function closeSearchDropdown() {
      dropdown?.classList.remove('open');
      searchInp?.setAttribute('aria-expanded', 'false');
    }

    function closeQuickModal() {
      closeAccessibleDialog(modal);
    }

    function openMobileSidebar() {
      haptic('confirm');
      sidebar?.classList.add('open');
      overlay?.classList.add('active');
      btnOpenSidebar?.setAttribute('aria-expanded', 'true');
      btnFloatingSidebar?.setAttribute('aria-expanded', 'true');
      syncModalScrollLock();
    }

    btnOpenSidebar?.addEventListener('click', openMobileSidebar);
    btnFloatingSidebar?.addEventListener('click', openMobileSidebar);

    document.getElementById('btn-close-sidebar')?.addEventListener('click', () => {
      haptic('confirm');
      closeMobileSidebar();
    });
    overlay?.addEventListener('click', closeMobileSidebar);
    document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleTheme);
    if (typeof window.matchMedia === 'function') {
      const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (typeof darkMedia.addEventListener === 'function') {
        darkMedia.addEventListener('change', () => {
          let hasManual = false;
          try {
            hasManual = Boolean(window.localStorage.getItem(THEME_STORAGE_KEY));
          } catch (_) {
            hasManual = false;
          }
          if (!hasManual) {
            applyThemeVisualRefresh();
          }
        });
      }
    }
    document.getElementById('btn-header-back')?.addEventListener('click', () => {
      closeMobileSidebar();
      navigateToDashboard();
    });
    window.addEventListener('scroll', syncFloatingMenuButton, { passive: true });
    document.querySelector('.main-content')?.addEventListener('scroll', syncFloatingMenuButton, { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMobileSidebar();
      syncFloatingMenuButton();
    });
    syncFloatingMenuButton();
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Tab') {
        handleDialogTabTrap(ev);
        return;
      }
      if (ev.key === 'Escape') {
        if (activeDialogStack.length > 0) {
          const topDialog = activeDialogStack[activeDialogStack.length - 1];
          closeAccessibleDialog(topDialog.el);
          return;
        }
        closeMobileSidebar();
        closeSearchDropdown();
      }
    });

    if (searchInp && dropdown) {
      searchInp.addEventListener('input', () => {
        const q = searchInp.value.trim().toLowerCase();
        if (!q) {
          closeSearchDropdown();
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
          dropdown.innerHTML = `<div class="search-result-item" role="option" aria-selected="false"><span class="search-result-title">Sin resultados para "${searchInp.value}"</span></div>`;
        } else {
          dropdown.innerHTML = results.slice(0, 8).map(r => `
            <div class="search-result-item" role="option" aria-selected="false" data-search-subj="${r.subjId}" data-search-topic="${r.topicId}">
              <span class="search-result-title">${r.topicTitle}</span>
              <span class="search-result-meta">Módulo: ${r.subjName}</span>
            </div>
          `).join('');

          makeKeyboardClickable(dropdown, '[data-search-subj]');
          dropdown.querySelectorAll('[data-search-subj]').forEach(item => {
            item.addEventListener('click', () => {
              const sId = item.getAttribute('data-search-subj');
              const tId = item.getAttribute('data-search-topic');
              closeSearchDropdown();
              searchInp.value = '';
              openSubject(sId, tId);
            });
          });
        }
        dropdown.classList.add('open');
        searchInp.setAttribute('aria-expanded', 'true');
      });

      document.addEventListener('click', (e) => {
        if (!searchInp.contains(e.target) && !dropdown.contains(e.target)) {
          closeSearchDropdown();
        }
      });
    }

    document.getElementById('btn-open-quick-calc')?.addEventListener('click', (ev) => {
      if (!modal || !modalBody) return;
      haptic('confirm');
      openAccessibleDialog(modal, { returnFocusEl: ev.currentTarget });
      ns.CalculatorTool.renderCalculatorView(modalBody);
    });

    document.getElementById('btn-close-quick-modal')?.addEventListener('click', () => {
      haptic('confirm');
      closeQuickModal();
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeQuickModal();
      }
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
    const storageRaw = ns.Storage.getState();
    const enrichedStats = Object.assign({}, stats, {
      studiedTopicsMap: storageRaw.studiedTopics || {}
    });
    const lastSubj = curriculum.find(s => s.id === stats.lastVisited.subjectId) || curriculum[0];
    const lastTopic = lastSubj.topics.find(t => t.id === stats.lastVisited.topicId) || lastSubj.topics[0];

    const idxHelper = ns.CurriculumIndex;
    const allEntries = idxHelper ? idxHelper.buildCurriculumEntries(curriculum, enrichedStats) : [];
    const routes = idxHelper ? idxHelper.buildSuggestedRoutes(curriculum, enrichedStats) : [];
    const blocks = idxHelper ? idxHelper.BLOCKS : [];

    function renderMapCardsHtml() {
      const filtered = idxHelper
        ? idxHelper.filterCurriculumEntries(allEntries, {
            query: appState.dashboardMapQuery,
            blockId: appState.dashboardBlockFilter
          })
        : [];
      if (!filtered.length) {
        return `
          <div class="content-card">
            <p class="theory-paragraph no-margin">No se encontraron materias ni temas que coincidan con "${appState.dashboardMapQuery}".</p>
          </div>
        `;
      }
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
      const forceOpen = Boolean(appState.dashboardMapQuery.trim()) || appState.dashboardBlockFilter !== 'todos';

      return filtered.map(entry => {
        const shouldOpen = isDesktop || forceOpen || entry.id === lastSubj.id;
        return `
          <details class="module-map-card" style="--module-color: ${entry.color}" data-card-subject="${entry.id}" ${shouldOpen ? 'open' : ''}>
            <summary class="module-map-summary">
              <div class="module-map-summary-top">
                <div class="module-map-summary-left">
                  <div class="module-map-symbol" aria-hidden="true">${entry.symbol}</div>
                  <div class="module-map-title-group">
                    <div class="module-map-title">${entry.name}</div>
                    <div class="module-map-block">${entry.blockLabel}</div>
                  </div>
                </div>
                <span class="module-map-chevron" aria-hidden="true">▾</span>
              </div>

              <div class="module-map-meta-badges">
                <span class="map-meta-pill">${entry.topics.length} temas</span>
                <span class="map-meta-pill">⏱ ~${entry.durationLabel}</span>
                <span class="map-meta-pill">${entry.levelTag}</span>
                <span class="map-meta-pill">${entry.stats.percentage || 0}% avance</span>
              </div>

              <div class="progress-track">
                <div class="progress-fill" style="width: ${entry.stats.percentage || 0}%"></div>
              </div>
            </summary>

            <div class="module-map-body">
              <p class="module-map-desc">${entry.shortDesc}</p>
              <div class="module-map-prereq">
                <strong>Prerrequisitos:</strong> ${entry.prerequisites.join(', ')} · <strong>Ejercicios:</strong> ${entry.stats.exercisesSolved || 0}/${entry.stats.exercisesTotal || 0}
              </div>

              <div class="module-map-topics">
                ${entry.topics.map(t => `
                  <div class="map-topic-row">
                    <div class="map-topic-head">
                      <button type="button" class="map-topic-name" data-map-open-subj="${entry.id}" data-map-open-topic="${t.id}" data-map-open-tab="teoria">
                        ${t.orderNum}. ${t.title}
                      </button>
                      <span class="map-topic-status ${t.studied ? 'done' : ''}">
                        ${t.studied ? '✓ Estudiado' : `~${t.estMinutes} min`}
                      </span>
                    </div>
                    <div class="map-topic-quick-links">
                      <button type="button" class="map-topic-link-btn" data-map-open-subj="${entry.id}" data-map-open-topic="${t.id}" data-map-open-tab="teoria">📖 Teoría</button>
                      <button type="button" class="map-topic-link-btn" data-map-open-subj="${entry.id}" data-map-open-topic="${t.id}" data-map-open-tab="ejemplos">🔍 Ejemplos (${t.examplesCount})</button>
                      <button type="button" class="map-topic-link-btn" data-map-open-subj="${entry.id}" data-map-open-topic="${t.id}" data-map-open-tab="ejercicios">✏️ Ejercicios (${t.exercisesCount})</button>
                      <button type="button" class="map-topic-link-btn" data-map-open-subj="${entry.id}" data-map-open-topic="${t.id}" data-map-open-tab="evaluacion">🏆 Quiz (${t.quizCount})</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <button type="button" class="btn btn-outline btn-sm" data-map-open-subj="${entry.id}" data-map-open-topic="${entry.topics[0] ? entry.topics[0].id : ''}" data-map-open-tab="teoria">
                Abrir módulo completo →
              </button>
            </div>
          </details>
        `;
      }).join('');
    }

    main.innerHTML = `
      <!-- Banner de Bienvenida -->
      <section class="hero-banner">
        <div class="hero-content">
          <div class="hero-badge">
            <span>${stats.rank.badge} Rango actual: ${stats.rank.title} · 🔥 Racha de estudio: ${stats.streakDays} ${stats.streakDays === 1 ? 'día' : 'días'}</span>
          </div>
          <h1 class="hero-title">Bienvenido a ${getAppName()}</h1>
          <p class="hero-description">
            Plataforma académica desde Aritmética hasta Cálculo Diferencial e Integral con demostraciones rigurosas,
            animaciones paso a paso, graficador interactivo, resolución guiada y formularios imprimibles.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-white" id="btn-hero-continue">
              ▶ Continuar: ${lastSubj.name} — ${lastTopic.title}
            </button>
            <button type="button" class="btn btn-glass" id="btn-hero-map">
              🗺️ Mapa Curricular (${curriculum.length} materias · ${stats.totalTopics} temas)
            </button>
            <button type="button" class="btn btn-glass" id="btn-hero-prepmat">
              🎓 PrepMat · Exámenes
            </button>
            <button type="button" class="btn btn-glass" id="btn-hero-graph">
              📈 Graficador
            </button>
            <button type="button" class="btn btn-glass" id="btn-hero-calc">
              🧮 Calculadora
            </button>
            <button type="button" class="btn btn-glass" id="btn-hero-formulas">
              📄 Formularios
            </button>
          </div>
        </div>
      </section>

      <!-- Continuar donde lo dejaste + Progreso Global -->
      <section class="continue-learning-bar" aria-label="Continuar aprendizaje">
        <div class="continue-learning-info">
          <span class="continue-kicker">Continuar donde lo dejaste · Progreso Global ${stats.globalPercentage}%</span>
          <div class="continue-topic-title">${lastSubj.name}: ${lastTopic.title}</div>
          <div class="continue-meta-row">
            <span>${stats.studiedTopicsCount}/${stats.totalTopics} temas estudiados</span>
            <span>·</span>
            <span>${stats.totalSolved}/${stats.totalExercises} ejercicios resueltos</span>
            <span>·</span>
            <span>${stats.totalQuizzesDone}/${stats.totalTopics} evaluaciones</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${stats.globalPercentage}%"></div>
          </div>
        </div>
        <div class="continue-actions">
          <button type="button" class="btn btn-primary" id="btn-continue-theory">▶ Ir a Teoría</button>
          <button type="button" class="btn btn-outline" id="btn-continue-exercises">✏️ Practicar Ejercicios</button>
        </div>
      </section>

      <!-- Estadísticas de Aprendizaje -->
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

      <!-- Rutas de Aprendizaje Sugeridas con Prerrequisitos Visibles -->
      <section aria-label="Rutas de aprendizaje sugeridas">
        <div class="section-header">
          <div>
            <h2 class="section-title">🧭 Rutas de Aprendizaje Sugeridas</h2>
            <p class="section-subtitle">Itinerarios ordenados con prerrequisitos explícitos desde fundamentos hasta Cálculo universitario.</p>
          </div>
        </div>
        <div class="routes-grid">
          ${routes.map(route => `
            <article class="route-card">
              <div class="route-card-header">
                <span class="route-badge">${route.badge}</span>
                <h3 class="route-title">${route.title}</h3>
                <p class="route-desc">${route.description}</p>
              </div>
              <div class="route-steps-chain">
                ${route.steps.map((st, idx) => `
                  <div class="route-step-wrap">
                    ${idx > 0 ? '<span class="route-step-arrow" aria-hidden="true">→</span>' : ''}
                    <button type="button" class="route-step-btn" data-route-subj="${st.subjectId}">
                      <span class="route-step-top">
                        <span>${st.symbol} ${st.name}</span>
                        <span class="route-step-pct">${st.percentage}%</span>
                      </span>
                      <span class="route-step-prereq">${st.prereqLabel}</span>
                    </button>
                  </div>
                `).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Mapa Completo de Materias y Temas (Generado desde Curriculum) -->
      <section id="dash-curriculum-map" aria-label="Mapa curricular de materias y temas">
        <div class="section-header">
          <div>
            <h2 class="section-title">🗺️ Índice Completo de Materias y Temas (${curriculum.length} Módulos · ${stats.totalTopics} Temas)</h2>
            <p class="section-subtitle">Cada módulo agrupa sus temas con prerrequisitos, nivel, tiempo estimado y acceso directo a Teoría, Ejemplos, Ejercicios y Quiz.</p>
          </div>
        </div>

        <div class="curriculum-map-controls">
          <div class="map-filter-input-wrap">
            <input
              type="search"
              id="dash-map-filter"
              class="map-filter-input"
              value="${appState.dashboardMapQuery.replace(/"/g, '&quot;')}"
              placeholder="Filtrar materias o temas en el índice (ej. límite, derivada, Riemann, cosenos)..."
              aria-label="Filtrar materias y temas del índice" />
          </div>
          <div class="map-filter-blocks" role="group" aria-label="Filtrar por bloque formativo">
            ${blocks.map(b => `
              <button
                type="button"
                class="diff-pill ${appState.dashboardBlockFilter === b.id ? 'active' : ''}"
                data-map-block="${b.id}">
                ${b.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="modules-map-grid" id="dash-modules-map-grid">
          ${renderMapCardsHtml()}
        </div>
      </section>

      <!-- Acceso Destacado: PrepMat · Simulador de Exámenes (Nuevo) -->
      <section class="content-card dash-formulas-card">
        <div class="dash-formulas-row">
          <div class="dash-formulas-info">
            <div class="dash-formulas-badge">
              🎓 Nuevo · 9 Ramas · Bachillerato y Licenciatura
            </div>
            <h2 class="dash-formulas-title">PrepMat — Simulador Analítico de Exámenes</h2>
            <p class="theory-paragraph no-margin">
              Exámenes adaptativos anti-repetición desde Aritmética hasta Cálculo Integral y Álgebra Lineal / EDO, con cronómetro dual, justificación analítica paso a paso y diagnóstico directo por tema.
            </p>
          </div>
          <div class="dash-formulas-actions">
            <button class="btn btn-primary" id="btn-dash-prepmat-train" type="button">
              💡 Entrenamiento Guiado
            </button>
            <button class="btn btn-outline" id="btn-dash-prepmat-sim" type="button">
              ⏱️ Simulacro Licenciatura
            </button>
          </div>
        </div>
      </section>

      <!-- Acceso Destacado: Formularios Matemáticos de Estudio e Impresión -->
      <section class="content-card dash-formulas-card">
        <div class="dash-formulas-row">
          <div class="dash-formulas-info">
            <div class="dash-formulas-badge">
              📄 Estudio e Impresión Tamaño Carta / PDF
            </div>
            <h2 class="dash-formulas-title">Formularios Matemáticos Académicos</h2>
            <p class="theory-paragraph no-margin">
              Consulta o imprime en papel tamaño carta hojas de referencia rigurosas con todas las fórmulas, significado de variables y restricciones de dominio: por materia individual o en compendio general unificado.
            </p>
          </div>
          <div class="dash-formulas-actions">
            <button class="btn btn-primary" id="btn-dash-formulas-topic" type="button">
              📑 Formularios por Tema
            </button>
            <button class="btn btn-outline" id="btn-dash-formulas-general" type="button">
              📚 Formulario General (Compendio PDF)
            </button>
          </div>
        </div>
      </section>

      <!-- Seguimiento Detallado: Temas Pendientes y Resultados de Evaluaciones -->
      <section class="two-col-grid">
        <div class="content-card dash-section-card">
          <h2>📌 Temas Pendientes y Ruta Sugerida (${stats.pendingTopics.length})</h2>
          <p class="theory-paragraph">Temas con ejercicios o evaluación final aún por completar:</p>
          ${stats.pendingTopics.length ? `
            <div class="dash-pending-list">
              ${stats.pendingTopics.slice(0, 8).map(pt => `
                <div class="dash-pending-item">
                  <div>
                    <div class="dash-pending-title">${pt.topicTitle}</div>
                    <div class="dash-pending-meta">
                      <strong>${pt.subjectName}</strong> · Ejercicios: ${pt.exDone ?? pt.solvedCount ?? 0}/${pt.exTotal ?? pt.totalCount ?? 0} · Evaluación: ${pt.quizDone ? '✓ Superada' : 'Pendiente'}
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

        <div class="content-card dash-activity-card">
          <div>
            <h2>🏆 Resultados de Evaluaciones y Actividad</h2>
            ${stats.quizResultsList && stats.quizResultsList.length ? `
              <div class="dash-subblock">
                <div class="dash-subblock-label">Calificaciones de Evaluaciones:</div>
                <div class="dash-quiz-list">
                  ${stats.quizResultsList.map(qr => `
                    <div class="dash-quiz-item">
                      <span><strong>${qr.subjectName}:</strong> ${qr.topicTitle}</span>
                      <span class="badge-level ${qr.percentage >= 80 ? 'basico' : 'intermedio'}">${qr.percentage}% (${qr.score}/${qr.total})</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : `
              <p class="theory-paragraph">
                Aún no has enviado evaluaciones de tema. Completa la etapa 9 de cualquier lección para registrar tus calificaciones aquí.
              </p>
            `}

            ${stats.recentActivity.length ? `
              <div class="dash-subblock-label muted">Historial Reciente:</div>
              <ul class="dash-activity-list">
                ${stats.recentActivity.slice(0, 4).map(act => `
                  <li class="dash-activity-item">
                    <span class="dash-activity-title">${act.title}</span>
                    <span class="dash-activity-xp">+${act.xp} XP</span>
                  </li>
                `).join('')}
              </ul>
            ` : ''}
          </div>

          <div class="dash-reset-bar">
            <span class="dash-storage-note">Progreso guardado en localStorage</span>
            <button class="btn btn-outline btn-sm" id="btn-reset-progress">Reiniciar Progreso</button>
          </div>
        </div>
      </section>

      <!-- Laboratorio de Herramientas Interactivas -->
      <section class="content-card dash-section-card">
        <h2>🛠️ Laboratorio de Herramientas Interactivas</h2>
        <p class="theory-paragraph">Instrumentos matemáticos listos para experimentar en cualquier momento:</p>
        <div class="dash-tools-grid">
          <div class="concept-box dash-tool-box" data-dash-tool="prepmat">
            <div class="concept-box-title">🎓 PrepMat · Exámenes</div>
            <div class="concept-box-body">Simulacros adaptativos en 9 ramas para Bachillerato y Licenciatura con desarrollo analítico y diagnóstico.</div>
          </div>
          <div class="concept-box dash-tool-box" data-dash-tool="formularios">
            <div class="concept-box-title">📄 Formularios Matemáticos</div>
            <div class="concept-box-body">Hojas de referencia por tema y compendio general listas para imprimir en tamaño carta o PDF.</div>
          </div>
          <div class="concept-box dash-tool-box" data-dash-tool="graficador">
            <div class="concept-box-title">📈 Graficador de Funciones</div>
            <div class="concept-box-body">Traza curvas múltiples, rectas tangentes, derivadas e integrales definidas sombreadas.</div>
          </div>
          <div class="concept-box dash-tool-box" data-dash-tool="calculadora">
            <div class="concept-box-title">🧮 Calculadora Científica</div>
            <div class="concept-box-body">Funciones trigonométricas en DEG/RAD, logaritmos, factoriales, memorias e historial.</div>
          </div>
          <div class="concept-box dash-tool-box" data-dash-tool="editor">
            <div class="concept-box-title">∑ Editor de Expresiones</div>
            <div class="concept-box-body">Construye fórmulas con fracciones, raíces, límites, derivadas e integrales en tiempo real.</div>
          </div>
          <div class="concept-box dash-tool-box" data-dash-tool="solucionador">
            <div class="concept-box-title">🧭 Resolución Guiada</div>
            <div class="concept-box-body">Ingresa tus propios ejercicios y desbloquea su procedimiento paso a paso.</div>
          </div>
        </div>
      </section>
    `;

    function bindMapEvents() {
      const mapGrid = main.querySelector('#dash-modules-map-grid');
      if (!mapGrid) return;
      mapGrid.querySelectorAll('[data-map-open-subj]').forEach(btn => {
        btn.addEventListener('click', () => {
          haptic('light');
          const sId = btn.getAttribute('data-map-open-subj');
          const tId = btn.getAttribute('data-map-open-topic') || null;
          const tTab = btn.getAttribute('data-map-open-tab') || 'teoria';
          openSubject(sId, tId, tTab);
        });
      });
      mapGrid.querySelectorAll('details.module-map-card > summary').forEach(sum => {
        sum.addEventListener('click', () => haptic('confirm'));
      });
    }

    // Eventos del Dashboard
    main.querySelector('#btn-hero-continue')?.addEventListener('click', () => {
      haptic('confirm');
      openSubject(lastSubj.id, lastTopic.id);
    });
    main.querySelector('#btn-hero-map')?.addEventListener('click', () => {
      haptic('light');
      document.getElementById('dash-curriculum-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    main.querySelector('#btn-hero-prepmat')?.addEventListener('click', () => {
      openTool('prepmat');
    });
    main.querySelector('#btn-hero-graph')?.addEventListener('click', () => {
      openTool('graficador');
    });
    main.querySelector('#btn-hero-calc')?.addEventListener('click', () => {
      openTool('calculadora');
    });
    main.querySelector('#btn-hero-formulas')?.addEventListener('click', () => {
      openTool('formularios');
    });
    main.querySelector('#btn-continue-theory')?.addEventListener('click', () => {
      openSubject(lastSubj.id, lastTopic.id, 'teoria');
    });
    main.querySelector('#btn-continue-exercises')?.addEventListener('click', () => {
      openSubject(lastSubj.id, lastTopic.id, 'ejercicios');
    });
    main.querySelector('#btn-dash-prepmat-train')?.addEventListener('click', () => {
      openTool('prepmat', { mode: 'training', level: 'all', topic: 'general', count: 15 });
    });
    main.querySelector('#btn-dash-prepmat-sim')?.addEventListener('click', () => {
      openTool('prepmat', { mode: 'simulacro', level: 'licenciatura', topic: 'general', count: 15, autoStart: true });
    });
    main.querySelector('#btn-dash-formulas-topic')?.addEventListener('click', () => {
      openTool('formularios', 'aritmetica');
    });
    main.querySelector('#btn-dash-formulas-general')?.addEventListener('click', () => {
      openTool('formularios', 'general');
    });

    main.querySelectorAll('[data-route-subj]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('light');
        openSubject(btn.getAttribute('data-route-subj'));
      });
    });

    const mapFilterInp = main.querySelector('#dash-map-filter');
    const mapGridEl = main.querySelector('#dash-modules-map-grid');
    if (mapFilterInp && mapGridEl) {
      mapFilterInp.addEventListener('input', () => {
        appState.dashboardMapQuery = mapFilterInp.value;
        mapGridEl.innerHTML = renderMapCardsHtml();
        bindMapEvents();
      });
    }

    main.querySelectorAll('[data-map-block]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('light');
        appState.dashboardBlockFilter = btn.getAttribute('data-map-block') || 'todos';
        main.querySelectorAll('[data-map-block]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (mapGridEl) {
          mapGridEl.innerHTML = renderMapCardsHtml();
          bindMapEvents();
        }
      });
    });

    bindMapEvents();

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
    makeKeyboardClickable(main, '.dash-tool-box[data-dash-tool]');

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
      <button type="button" class="breadcrumb-home-btn" id="bc-home">Inicio</button>
      <span aria-hidden="true">›</span>
      <span>${subj.name}</span>
      <span aria-hidden="true">›</span>
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
          <div class="topic-actions-row">
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
      <div class="learning-tabs" role="tablist" aria-label="Secciones de la lección">
        <button type="button" class="learning-tab-btn ${appState.activeTab === 'teoria' ? 'active' : ''}" data-tab="teoria" role="tab" aria-selected="${appState.activeTab === 'teoria' ? 'true' : 'false'}">
          📖 1–5. Teoría, Fórmulas y Gráfica Interactiva
        </button>
        <button type="button" class="learning-tab-btn ${appState.activeTab === 'ejemplos' ? 'active' : ''}" data-tab="ejemplos" role="tab" aria-selected="${appState.activeTab === 'ejemplos' ? 'true' : 'false'}">
          🔍 6–7. Ejemplos Paso a Paso y Errores (${topic.examples.length})
        </button>
        <button type="button" class="learning-tab-btn ${appState.activeTab === 'ejercicios' ? 'active' : ''}" data-tab="ejercicios" role="tab" aria-selected="${appState.activeTab === 'ejercicios' ? 'true' : 'false'}">
          ✏️ 8. Ejercicios Interactivos (${topic.exercises.length})
        </button>
        <button type="button" class="learning-tab-btn ${appState.activeTab === 'evaluacion' ? 'active' : ''}" data-tab="evaluacion" role="tab" aria-selected="${appState.activeTab === 'evaluacion' ? 'true' : 'false'}">
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
        haptic('light');
        appState.activeTab = btn.getAttribute('data-tab');
        main.querySelectorAll('[data-tab]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
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
    const theorems = th.theorems || [];
    const mistakes = topic.commonMistakes || [];
    const isDesktopLayout = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const theoryGraphPayloads = {};

    concepts.forEach((c, idx) => {
      if (c && c.graphPayload) theoryGraphPayloads[`c-${idx}`] = c.graphPayload;
    });
    formulas.forEach((f, idx) => {
      if (f && f.graphPayload) theoryGraphPayloads[`f-${idx}`] = f.graphPayload;
    });
    if (topic.graphPreset) {
      theoryGraphPayloads['topic-main'] = topic.graphPreset;
    }

    box.innerHTML = `
      <!-- Índice interno de secciones de la lección -->
      <nav class="lesson-toc-card" aria-label="Índice de secciones de la lección">
        <div class="lesson-toc-title">📑 Índice de esta lección (${subj.name})</div>
        <div class="lesson-toc-links">
          <button type="button" class="lesson-toc-btn" data-jump-sec="sec-etapa-1">1. Introducción</button>
          ${prereqs.length ? `<button type="button" class="lesson-toc-btn" data-jump-sec="sec-etapa-2">2. Conocimientos Previos</button>` : ''}
          <button type="button" class="lesson-toc-btn" data-jump-sec="sec-etapa-3">3. Teoría y Conceptos</button>
          ${theorems.length ? `<button type="button" class="lesson-toc-btn" data-jump-sec="sec-teoremas">📐 Teoremas (${theorems.length})</button>` : ''}
          ${formulas.length ? `<button type="button" class="lesson-toc-btn" data-jump-sec="sec-etapa-4">4. Fórmulas</button>` : ''}
          <button type="button" class="lesson-toc-btn" data-jump-sec="sec-etapa-5">5. Visualización Gráfica</button>
          ${mistakes.length ? `<button type="button" class="lesson-toc-btn" data-jump-sec="sec-etapa-7">7. Errores Frecuentes</button>` : ''}
        </div>
      </nav>

      <!-- ETAPA 1: INTRODUCCIÓN -->
      <div class="content-card" id="sec-etapa-1">
        <div class="didactic-step-badge"><span>1</span> Etapa 1 de 9 · Introducción</div>
        <h2>¿Qué es este concepto y para qué sirve?</h2>
        ${(th.intro || []).map(p => `<p class="theory-paragraph">${ns.MathRenderer.formatRichText(p)}</p>`).join('')}

        <!-- ETAPA 2: CONOCIMIENTOS PREVIOS NECESARIOS -->
        ${prereqs.length ? `
          <div class="theory-section-block compact" id="sec-etapa-2">
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
        <div class="theory-section-block" id="sec-etapa-3">
          <div class="didactic-step-badge"><span>3</span> Etapa 3 de 9 · Explicación Teórica Detallada</div>
          <h2>Desarrollo Teórico Progresivo desde Cero</h2>
          ${detailed.map(p => `<p class="theory-paragraph">${ns.MathRenderer.formatRichText(p)}</p>`).join('')}

          <div class="concept-grid">
            ${concepts.map((c, idx) => `
              <div class="concept-box">
                <div class="concept-box-title">${ns.MathRenderer.formatRichText(c.title)}</div>
                <div class="concept-box-body">${ns.MathRenderer.formatRichText(c.body)}</div>
                ${c.graphPayload ? `
                  <button type="button" class="btn btn-outline btn-sm theory-graph-inline-btn" data-theory-graph="c-${idx}">
                    📈 ${c.graphLabel || 'Ver en graficador'}
                  </button>
                ` : ''}
              </div>
            `).join('')}
          </div>

          ${theorems.length ? `
            <div class="theorems-section" id="sec-teoremas">
              <h3 class="theorems-heading">📐 Definiciones Formales, Teoremas y Demostraciones</h3>
              <div class="theorems-grid">
                ${theorems.map(thm => `
                  <article class="theorem-card">
                    <div class="theorem-header">
                      <span class="theorem-badge">${thm.badge || 'Teorema'}</span>
                      <strong class="theorem-title">${ns.MathRenderer.formatRichText(thm.title)}</strong>
                    </div>
                    ${thm.hypothesis ? `
                      <div class="theorem-hypothesis">
                        <strong>Hipótesis:</strong> ${ns.MathRenderer.formatRichText(thm.hypothesis)}
                      </div>
                    ` : ''}
                    <div class="theorem-statement">${ns.MathRenderer.formatRichText(thm.statement)}</div>
                    ${Array.isArray(thm.proofSteps) && thm.proofSteps.length ? `
                      <details class="proof-collapsible" ${isDesktopLayout ? 'open' : ''}>
                        <summary class="proof-summary">Ver demostración paso a paso (${thm.proofSteps.length} pasos)</summary>
                        <div class="proof-body">
                          <ol class="proof-steps-list">
                            ${thm.proofSteps.map(step => `<li>${ns.MathRenderer.formatRichText(step)}</li>`).join('')}
                          </ol>
                          ${thm.note ? `<div class="theorem-note"><strong>Observación:</strong> ${ns.MathRenderer.formatRichText(thm.note)}</div>` : ''}
                        </div>
                      </details>
                    ` : (thm.note ? `<div class="theorem-note"><strong>Observación:</strong> ${ns.MathRenderer.formatRichText(thm.note)}</div>` : '')}
                  </article>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- ETAPA 4: FÓRMULAS Y PROPIEDADES FUNDAMENTALES -->
        ${formulas.length ? `
          <div class="theory-section-block" id="sec-etapa-4">
            <div class="didactic-step-badge"><span>4</span> Etapa 4 de 9 · Fórmulas y Propiedades Fundamentales</div>
            <h2>Formulario Esencial y Restricciones de Dominio</h2>
            ${formulas.map((f, idx) => `
              <div class="formula-showcase">
                <div class="formula-showcase-top">
                  <span class="formula-label">${ns.MathRenderer.formatRichText(f.label)}</span>
                  ${f.graphPayload ? `
                    <button type="button" class="btn btn-outline btn-sm" data-theory-graph="f-${idx}">
                      📈 ${f.graphLabel || 'Ver en graficador'}
                    </button>
                  ` : ''}
                </div>
                <div class="formula-expression">${ns.MathRenderer.renderMath(f.expr, true)}</div>
                <span class="formula-note">${ns.MathRenderer.formatRichText(f.note)}</span>
              </div>
            `).join('')}
            ${topic.graphPreset ? `
              <button type="button" class="btn btn-outline btn-sm theory-graph-inline-btn" data-theory-graph="topic-main">
                📈 Ver en graficador: ${topic.title}
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>

      <!-- ETAPA 5: INTERPRETACIÓN GRÁFICA INTERACTIVA -->
      <div class="content-card" id="sec-etapa-5">
        <div class="didactic-step-badge"><span>5</span> Etapa 5 de 9 · Interpretación Gráfica y Demostración Visual</div>
        <h2>Visualización y Experimentación Geométrica en Vivo</h2>
        ${Array.isArray(topic.demoAnimations) && topic.demoAnimations.length ? `
          <div id="lesson-demo-animations-mount"></div>
        ` : ''}
        <div id="lesson-interactive-graph-mount"></div>
        <details class="precision-notice precision-notice-compact no-print">
          <summary class="precision-notice-summary">ⓘ Resultados aproximados</summary>
          <div class="precision-notice-body">
            <p>Las curvas se trazan por muestreo cada <code>1.5 px</code> en doble precisión (~15–16 dígitos, redondeo a 3–4 decimales); límites laterales (<code>±10⁻⁴</code>), derivadas (paso <code>h = 10⁻⁵</code>), integrales (Simpson <code>n = 200</code>), raíces y huecos (<code>0/0</code>) son estimaciones numéricas sensibles a singularidades y dominio. Úsalo como apoyo didáctico y verifica resultados críticos analíticamente.</p>
          </div>
        </details>
      </div>

      <!-- ETAPA 7 (Resumen en Teoría): ERRORES FRECUENTES Y CÓMO EVITARLOS -->
      ${mistakes.length ? `
        <div class="content-card" id="sec-etapa-7">
          <div class="didactic-step-badge"><span>7</span> Etapa 7 de 9 · Prevención de Errores Algebraicos y de Cálculo</div>
          <h2>⚠️ Errores Frecuentes y Cómo Evitarlos</h2>
          <div class="mistakes-grid">
            ${mistakes.map(m => `
              <div class="mistake-card">
                ${m.title ? `<div class="mistake-card-title">${ns.MathRenderer.formatRichText(m.title)}</div>` : ''}
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

      <div class="lesson-nav-footer">
        <span class="lesson-nav-hint">
          Continúa con la Etapa 6 (Ejemplos resueltos paso a paso) y la Etapa 8 (Ejercicios interactivos).
        </span>
        <div class="lesson-nav-actions">
          <button class="btn btn-primary" id="btn-go-examples">
            Ir a Etapa 6: Ejemplos Resueltos Paso a Paso →
          </button>
          <button class="btn btn-outline" id="btn-go-exercises-direct">
            Ir a Etapa 8: Ejercicios de Práctica →
          </button>
        </div>
      </div>
    `;

    // Montar animaciones demostrativas no interactivas si el tema las declara
    const demoMount = box.querySelector('#lesson-demo-animations-mount');
    if (demoMount && ns.DemoAnimations && Array.isArray(topic.demoAnimations) && topic.demoAnimations.length) {
      ns.DemoAnimations.renderDemoSuite(demoMount, topic.demoAnimations);
    }

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

    box.querySelectorAll('summary.proof-summary').forEach(sum => {
      sum.addEventListener('click', () => haptic('light'));
    });

    box.querySelectorAll('[data-jump-sec]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('light');
        const targetId = btn.getAttribute('data-jump-sec');
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) {
          const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    box.querySelectorAll('[data-theory-graph]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-theory-graph');
        const payload = theoryGraphPayloads[key];
        if (payload !== undefined) openTool('graficador', payload);
      });
    });

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
    const exampleGraphPayloads = {};
    (topic.examples || []).forEach((ex, exIdx) => {
      if (ex && ex.graphPayload) exampleGraphPayloads[exIdx] = ex.graphPayload;
    });

    box.innerHTML = `
      <div>
        <div class="content-card">
          <div class="didactic-step-badge"><span>6</span> Etapa 6 de 9 · Ejemplos Resueltos Paso a Paso</div>
          <h2 class="dash-formulas-title">Procedimientos Matemáticos Justificados Paso a Paso</h2>
          <p class="theory-paragraph no-margin">
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
                  <span class="badge-level basico step-procedure-badge">Ejemplo Resuelto #${exIdx + 1}</span>
                  <div class="step-procedure-title">${ns.MathRenderer.formatRichText(ex.title)}</div>
                </div>
                <div class="step-procedure-actions">
                  ${ex.graphPayload ? `
                    <button type="button" class="btn btn-outline btn-sm" data-example-graph="${exIdx}">
                      📈 Ver en graficador
                    </button>
                  ` : ''}
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
                <div class="step-problem-statement">
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
          <div class="content-card">
            <div class="didactic-step-badge"><span>7</span> Etapa 7 de 9 · Errores Frecuentes y Cómo Evitarlos</div>
            <h2>⚠️ Errores Frecuentes al Resolver este Tipo de Problemas</h2>
            <div class="mistakes-grid">
              ${mistakes.map(m => `
                <div class="mistake-card">
                  ${m.title ? `<div class="mistake-card-title">${ns.MathRenderer.formatRichText(m.title)}</div>` : ''}
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

        <div class="lesson-nav-footer">
          <button class="btn btn-outline" id="btn-back-theory">← Volver a Teoría y Gráfica</button>
          <button class="btn btn-primary" id="btn-go-exercises">Ir a Etapa 8: Ejercicios de Práctica →</button>
        </div>
      </div>
    `;

    box.querySelectorAll('[data-example-graph]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-example-graph'));
        const payload = exampleGraphPayloads[idx];
        if (payload) openTool('graficador', payload);
      });
    });

    box.querySelectorAll('[data-next-ex-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('confirm');
        const k = btn.getAttribute('data-next-ex-step');
        const max = Number(btn.getAttribute('data-max'));
        appState.exampleStepProgress[k] = Math.min(max, (appState.exampleStepProgress[k] || 1) + 1);
        renderExamplesTab(box, subj, topic);
      });
    });

    box.querySelectorAll('[data-all-ex-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('confirm');
        const k = btn.getAttribute('data-all-ex-step');
        const max = Number(btn.getAttribute('data-max'));
        appState.exampleStepProgress[k] = max;
        renderExamplesTab(box, subj, topic);
      });
    });

    box.querySelectorAll('[data-reset-ex-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        haptic('light');
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
          <div class="didactic-step-badge"><span>8</span> Etapa 8 de 9 · Ejercicios de Práctica Interactivos</div>
          <h3 class="difficulty-title">Introduce tu Respuesta Algebraica o Numérica</h3>
          <p class="difficulty-subtitle">
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
              <div class="ex-header-meta">
                <span class="badge-level ${ex.level}">${levelLabels[ex.level] || ex.level}</span>
                ${ex.requireFactored ? `<span class="badge-level intermedio">Requiere forma factorizada</span>` : ''}
              </div>
              <span class="ex-status-text ${isSolved ? 'solved' : ''}">
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

              <button class="btn btn-warning" data-hint-ex="${ex.id}" ${attState.hintsRevealed >= totalHints ? 'disabled' : ''}>
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
                ${currentInputVal.trim() ? ns.MathRenderer.renderUserExpression(currentInputVal) : '<span class="preview-empty-hint">Escribe arriba para previsualizar tu fórmula...</span>'}
              </span>
            </div>

            <!-- Gráfica interactiva opcional de apoyo al ejercicio -->
            ${showExGraph && topic.interactiveGraph ? `
              <div id="ex-graph-mount-${ex.id}" class="ex-graph-mount"></div>
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
                <div class="feedback-stack">
                  <div>${ns.MathRenderer.formatRichText(fb.message)}</div>
                  ${fb.type === 'error' && fb.reviewTip ? `
                    <div class="feedback-subnote">
                      🔍 <strong>Procedimiento a revisar:</strong> ${ns.MathRenderer.formatRichText(fb.reviewTip)}
                    </div>
                  ` : ''}
                  ${fb.type === 'success' && fb.whyCorrect ? `
                    <div class="feedback-subnote">
                      📌 <strong>Justificación matemática:</strong> ${ns.MathRenderer.formatRichText(fb.whyCorrect)}
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Resolución Paso a Paso -->
            ${fb?.showSolution ? `
              <div class="steps-container ex-solution-box">
                <div class="ex-solution-title">Resolución Matemática Paso a Paso:</div>
                ${ex.solutionSteps.map((stepText, idx) => `
                  <div class="math-step-item active-step">
                    <div class="step-number-badge">${idx + 1}</div>
                    <div class="step-body">
                      <div class="step-explanation">${ns.MathRenderer.formatRichText(stepText)}</div>
                    </div>
                  </div>
                `).join('')}
                <div class="ex-solution-answer">
                  Respuesta correcta: <span class="math-inline">${ns.MathRenderer.renderUserExpression(ex.answer)}</span>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}

      <div class="lesson-nav-footer">
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
              : '<span class="preview-empty-hint">Escribe arriba para previsualizar tu fórmula...</span>';
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
        haptic('light');
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
          const solvedMap = ns.Storage.getState().solvedExercises || {};
          const allTopicExercisesDone = topic.exercises.every(item => Boolean(solvedMap[item.id]));
          if (!res.alreadySolved && allTopicExercisesDone) {
            haptic('achievement');
          } else {
            haptic('correct');
          }
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
          haptic('incorrect');
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
        <div class="quiz-header-row">
          <div>
            <div class="didactic-step-badge"><span>9</span> Etapa 9 de 9 · Evaluación Final del Tema</div>
            <h2 class="dash-formulas-title">🏆 Evaluación de Comprobación: ${topic.title}</h2>
            <p class="difficulty-subtitle">
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
              <div class="quiz-question-text">
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
                <div class="feedback-banner ${chosen === q.correctIndex ? 'success' : 'info'}">
                  <div>
                    <strong>${chosen === q.correctIndex ? '✓ ¡Respuesta Correcta!' : 'ℹ️ Justificación académica:'}</strong>
                    ${ns.MathRenderer.formatRichText(q.explanation)}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}

        <div class="quiz-footer-actions">
          ${!isSubmitted ? `
            <button class="btn btn-outline" id="btn-back-exercises">← Volver a Ejercicios</button>
            <button class="btn btn-primary" id="btn-submit-quiz">
              ✓ Calificar Evaluación Final
            </button>
          ` : `
            <div class="feedback-banner ${correctCount === topic.quiz.length ? 'success' : 'info'}">
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
        haptic('light');
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
      const quizRes = ns.Storage.recordQuizCompleted(topic.id, topic.title, score, topic.quiz.length);
      if (quizRes.percentage >= 60 || quizRes.xpEarned > 0) {
        haptic('achievement');
      } else {
        haptic('incorrect');
      }
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
      prepmat: 'PrepMat · Exámenes',
      formularios: 'Formularios Matemáticos de Estudio e Impresión',
      graficador: 'Graficador Interactivo de Funciones',
      calculadora: 'Calculadora Científica',
      editor: 'Editor de Expresiones Matemáticas',
      solucionador: 'Resolución Guiada de Ejercicios'
    };

    setBreadcrumb(`
      <button type="button" class="breadcrumb-home-btn" id="bc-home-tool">Inicio</button>
      <span aria-hidden="true">›</span>
      <span>Herramientas Interactivas</span>
      <span aria-hidden="true">›</span>
      <strong>${toolNames[toolId] || toolId}</strong>
    `);
    document.getElementById('bc-home-tool')?.addEventListener('click', navigateToDashboard);

    const main = document.getElementById('main-view-container');
    if (!main) return;

    if (toolId === 'prepmat' && ns.PrepMatTool) {
      ns.PrepMatTool.renderPrepMatView(main, presetExpr);
    } else if (toolId === 'formularios') {
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

  function openQuickCalculator(returnFocusEl = null) {
    const modal = document.getElementById('quick-tool-modal');
    const modalBody = document.getElementById('quick-tool-modal-body');
    if (!modal || !modalBody || !ns.CalculatorTool) return;
    haptic('confirm');
    openAccessibleDialog(modal, { returnFocusEl: returnFocusEl || document.activeElement });
    ns.CalculatorTool.renderCalculatorView(modalBody);
  }

  ns.App = {
    init,
    navigateToDashboard,
    openSubject,
    openTool,
    openQuickCalculator,
    syncModalScrollLock
  };

  document.addEventListener('DOMContentLoaded', init);
})(window.MatInteractiva);
