/* ==========================================================================
   MATETIC - Sistema Háptico y Preferencias de Experiencia
   Archivo: js/engine/haptics.js
   Gestiona vibración táctil opcional mediante navigator.vibrate y guarda las
   preferencias nuevas (vibración y fondo animado) en una clave separada de
   localStorage, sin alterar progreso ni tema.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const PREFS_STORAGE_KEY = 'matematica_interactiva_preferencias_v1';

  const DEFAULT_PREFS = {
    hapticsEnabled: true,
    ambientBgEnabled: true,
    showThemeButton: true,
    lastSeenVersion: '',
    graphGestureHintSeen: false,
    lightBgPreset: 'cristal',
    darkBgPreset: 'cosmos',
    fontFamily: 'moderna',
    welcomeTourCompleted: false
  };

  const VALID_LIGHT_BGS = new Set(['cristal', 'esmeralda', 'aurora']);
  const VALID_DARK_BGS = new Set(['cosmos', 'abismo', 'nebulosa']);
  const VALID_FONTS = new Set(['moderna', 'academica', 'tecnica', 'lectura']);

  /**
   * Patrones hápticos diferenciados (en milisegundos).
   * - light: toque sutil en teclas, pestañas o cambio de tema.
   * - confirm: apertura/cierre de paneles y avance de pasos.
   * - correct: doble pulso corto de validación correcta.
   * - incorrect: pulso más largo y distinto ante error.
   * - achievement: secuencia celebratoria al completar tema o evaluación.
   */
  const HAPTIC_PATTERNS = {
    light: 8,
    confirm: 20,
    correct: [14, 45, 22],
    incorrect: [45, 65, 85],
    achievement: [18, 40, 18, 40, 60]
  };

  let memoryPrefs = { ...DEFAULT_PREFS };

  function normalizePrefs(raw) {
    if (!raw || typeof raw !== 'object') return { ...DEFAULT_PREFS };
    return {
      hapticsEnabled: raw.hapticsEnabled !== false,
      ambientBgEnabled: raw.ambientBgEnabled !== false,
      showThemeButton: raw.showThemeButton !== false,
      lastSeenVersion: typeof raw.lastSeenVersion === 'string' ? raw.lastSeenVersion.trim() : '',
      graphGestureHintSeen: Boolean(raw.graphGestureHintSeen),
      lightBgPreset: VALID_LIGHT_BGS.has(raw.lightBgPreset) ? raw.lightBgPreset : 'cristal',
      darkBgPreset: VALID_DARK_BGS.has(raw.darkBgPreset) ? raw.darkBgPreset : 'cosmos',
      fontFamily: VALID_FONTS.has(raw.fontFamily) ? raw.fontFamily : 'moderna',
      welcomeTourCompleted: Boolean(raw.welcomeTourCompleted)
    };
  }

  function loadPreferences() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(PREFS_STORAGE_KEY);
        if (stored) {
          memoryPrefs = normalizePrefs(JSON.parse(stored));
          return { ...memoryPrefs };
        }
      }
    } catch (_) {
      // Modo privado o almacenamiento no disponible: usar respaldo en memoria
    }
    return { ...memoryPrefs };
  }

  function savePreferences(nextPrefs) {
    memoryPrefs = normalizePrefs(nextPrefs);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(memoryPrefs));
      }
    } catch (_) {
      // Ignorar fallos de escritura en localStorage
    }
    return { ...memoryPrefs };
  }

  function setPreference(key, value) {
    const current = loadPreferences();
    if (
      key === 'hapticsEnabled' ||
      key === 'ambientBgEnabled' ||
      key === 'showThemeButton' ||
      key === 'graphGestureHintSeen' ||
      key === 'welcomeTourCompleted'
    ) {
      current[key] = Boolean(value);
    } else if (key === 'lastSeenVersion') {
      current.lastSeenVersion = typeof value === 'string' ? value.trim() : '';
    } else if (key === 'lightBgPreset') {
      current.lightBgPreset = VALID_LIGHT_BGS.has(value) ? value : 'cristal';
    } else if (key === 'darkBgPreset') {
      current.darkBgPreset = VALID_DARK_BGS.has(value) ? value : 'cosmos';
    } else if (key === 'fontFamily') {
      current.fontFamily = VALID_FONTS.has(value) ? value : 'moderna';
    }
    return savePreferences(current);
  }

  function resetPreferences(opts = {}) {
    const current = loadPreferences();
    const next = Object.assign({}, DEFAULT_PREFS, {
      lastSeenVersion: opts.includeUpdateNotice ? '' : current.lastSeenVersion,
      welcomeTourCompleted: opts.includeWelcomeTour ? false : current.welcomeTourCompleted
    });
    return savePreferences(next);
  }

  function isSupported() {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  }

  function isCoarsePointer() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    try {
      return Boolean(window.matchMedia('(pointer: coarse)').matches);
    } catch (_) {
      return false;
    }
  }

  function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    try {
      return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  function canVibrate() {
    const prefs = loadPreferences();
    return Boolean(
      prefs.hapticsEnabled &&
      isSupported() &&
      isCoarsePointer() &&
      !prefersReducedMotion()
    );
  }

  let lastTriggeredAt = 0;

  function trigger(patternName) {
    if (!canVibrate()) return false;
    const pattern = HAPTIC_PATTERNS[patternName];
    if (pattern === undefined) return false;
    try {
      const invoked = navigator.vibrate(pattern);
      if (invoked !== false) {
        lastTriggeredAt = typeof Date === 'function' ? Date.now() : 0;
      }
      return invoked !== false;
    } catch (_) {
      return false;
    }
  }

  function wasRecentlyTriggered(windowMs = 110) {
    if (!lastTriggeredAt || typeof Date !== 'function') return false;
    return (Date.now() - lastTriggeredAt) <= windowMs;
  }

  // Inicializar estado desde localStorage al cargar el módulo
  loadPreferences();

  ns.Preferences = {
    STORAGE_KEY: PREFS_STORAGE_KEY,
    DEFAULT_PREFS,
    getPreferences: loadPreferences,
    setPreference,
    resetPreferences
  };

  ns.Haptics = {
    PREFS_KEY: PREFS_STORAGE_KEY,
    PATTERNS: HAPTIC_PATTERNS,
    isSupported,
    isCoarsePointer,
    prefersReducedMotion,
    canVibrate,
    trigger,
    wasRecentlyTriggered,
    light: () => trigger('light'),
    confirm: () => trigger('confirm'),
    correct: () => trigger('correct'),
    incorrect: () => trigger('incorrect'),
    achievement: () => trigger('achievement')
  };
})(window.MatInteractiva);
