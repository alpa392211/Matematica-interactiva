/* ==========================================================================
   MATETIC (Matemáticas Interactivas) - Fuente Única de Versión y Metadatos
   Archivo: js/version.js
   Compatible con ventana de navegador (window) y Service Worker (self)
   mediante globalThis. No editar versiones a mano en otros archivos.
   ========================================================================== */

(function (root) {
  'use strict';

  const APP_NAME = 'MateTic';
  const APP_TAGLINE = 'Matemáticas Interactivas';
  const APP_VERSION = '1.9.0';
  const APP_RELEASE_DATE = '2026-11-20';
  const STUDIO_NAME = 'ALPA Studio';
  const STUDIO_MEANING = '';

  const RELEASE_NOTES = [
    {
      version: '1.9.0',
      date: '2026-11-20',
      items: [
        'Animación de bienvenida y recorrido guiado menú por menú: presenta de forma dinámica con foco luminoso y diálogos progresivos la barra superior, el panel principal, el menú lateral, las lecciones, PrepMat, Graficador, Formularios, Editor, Resolución Guiada, Calculadora y Ajustes.',
        'Modo automático e interactivo en el recorrido: avanza paso a paso o activa ▶ Auto para ver la explicación automática de cada menú, y repítelo en cualquier momento desde Ajustes o el menú rápido de inicio.',
        'Botón ✕ Ocultar en el teclado matemático virtual oscuro: añadido un control visible y táctil en la barra superior de todas las pestañas (123, ∞≠∈, abc, αβγ) para cerrar el teclado de MathLive cuando quieras.',
        'Tres tipos de letra adicionales en Ajustes: elige entre Moderna (predeterminada), Académica (Serif), Técnica (Monoespaciada) y Lectura Clara (abierta) con vista previa instantánea y guardado local.',
        'Más ejemplos por cada forma de resolver: cada uno de los 96 métodos alternativos distribuidos en los 24 temas suma 2 nuevos ejemplos resueltos paso a paso (192 ejemplos adicionales en total, 3 por método).',
        'Integración limpia sin alterar tu progreso: la vista previa de lecciones durante el recorrido de bienvenida no modifica tus XP ni marca temas como estudiados.',
        'Pruebas matemáticas con compilación estricta KaTeX y caché sin conexión (PWA) actualizados.'
      ]
    },
    {
      version: '1.8.0',
      date: '2026-11-18',
      items: [
        'Múltiples formas de resolver problemas en los 24 temas: cada lección incorpora estrategias alternativas y métodos distintos en ejemplos resueltos (con enfoque profundo en Límites, Derivadas e Integrales, incluyendo t - x cuando t → x).',
        'Botón Explicar en palabras más sencillas en cada apunte: disponible en introducciones, conocimientos previos, conceptos, teoremas, fórmulas, errores frecuentes, estrategias y ejemplos.',
        'Animaciones matemáticas reparadas: corregida la alineación exacta de la recta tangente sobre la curva en Velocidad Instantánea, la construcción de f\'(x), límites con asíntotas y el espaciado entre textos y marcadores.',
        'Cabecera móvil más minimalista: barra superior compactada en una sola fila sin recuadro pesado y acceso cómodo con los botones laterales flotantes (☰ a la izquierda y 🧮 a la derecha) al desplazarse.',
        'Flechas de desplazamiento lateral más amplias y nítidas: los controles ‹ y › en selectores de temas, pestañas e índices crecieron conservando proporción circular dentro de su contenedor.',
        'Estilo de PrepMat equilibrado: suavizado en menú lateral, accesos rápidos y tarjeta principal para mantener un aspecto discreto similar al de NUMERUS CAS.',
        'Validación visual, contraste claro/oscuro, fórmulas matemáticas y caché sin conexión actualizados.'
      ]
    },
    {
      version: '1.7.0',
      date: '2026-11-18',
      items: [
        'Navegación fluida dentro de una misma sección de estudio: cambiar entre Teoría, Ejemplos, Práctica o usar los botones internos ya no muestra avisos de confirmación; el aviso aparece únicamente al cambiar de tema, materia, examen en curso o herramienta.',
        'PrepMat con nuevo encabezado insignia: logotipo destacado con emblema, distintivo Simulador PRO, nivel académico y cápsulas informativas de sus 9 ramas matemáticas.',
        'Panel principal con tarjeta estelar para PrepMat: bloque superior destacado con llamada directa al simulador de exámenes.',
        'Herramientas interactivas mejor organizadas en el panel principal: divididas claramente en Gráficas, Fórmulas y Notación y en Cálculo y Resolución Guiada.',
        'Menú lateral renovado: PrepMat resaltado arriba con insignia PRO dorada y herramientas separadas por categoría para ubicar cada utilidad de un vistazo.',
        'Menú rápido de inicio mejorado: acceso destacado a PrepMat con borde dorado sobre los demás accesos rápidos.',
        'Verificación completa de navegación, contraste en modo claro/oscuro y diseño adaptable en teléfonos y tabletas.'
      ]
    },
    {
      version: '1.6.1',
      date: '2026-11-18',
      items: [
        'Eliminado todo el flujo redundante de salida de la app: quitado el botón Salir de Ajustes, la pantalla intermedia de despedida y la intercepción del gesto atrás o cierre de pestaña para evitar duplicaciones visuales al deslizar desde el borde en celular.',
        'Botones de barras deslizables (‹ y ›) limpios y sin sombras encimadas: eliminadas las sombras y recuadros laterales que tapaban tarjetas y pastillas, usando ahora un desvanecido suave en el borde.',
        'Pestañas de lección y selectores centrados: alineadas verticalmente las flechas laterales respecto a los temas y pestañas en modo claro y oscuro.',
        'Derivadas: corregida la presentación de fórmulas y costos marginales para mostrar unidades monetarias limpias y expresiones matemáticas sin signos $ sueltos.',
        'Fórmulas con paréntesis: evitado el recorte del último dígito en expresiones cortas dentro de botones y tarjetas (como a = 2 y a = 0).',
        'Móvil horizontal: compactada la cabecera de gráficas expandidas para mostrar el plano cartesiano completo de inmediato sin necesidad de desplazarse.',
        'Verificación visual e integral en teléfonos (vertical y horizontal) y tabletas sobre las 9 materias, 24 temas y 6 herramientas sin textos cortados ni desbordamientos.'
      ]
    },
    {
      version: '1.6.0',
      date: '2026-11-18',
      items: [
        'Flechas indicadoras en barras deslizables: los selectores de temas, pestañas de lección, índices y teclados muestran una flecha hacia la derecha (›) cuando hay más opciones por deslizar.',
        'Menú inicial más limpio: la pantalla de inicio destaca únicamente el botón Continuar y agrupa los demás accesos en un menú desplegable compacto.',
        'Texto y fórmulas congruentes: los paréntesis y signos de puntuación junto a expresiones matemáticas permanecen unidos sin cortarse al saltar de renglón.',
        'Gráficas ampliadas nítidas y sin recortes: reducida la transparencia en tarjetas, cabeceras, menús y gráficas expandidas (modo claro y oscuro) manteniendo todos los controles y etiquetas visibles.',
        'Diseño adaptado a celular y tableta: ajustada la cabecera, barra lateral, botones flotantes y pestañas para pantallas medianas y móviles sin superposiciones ni desbordamientos.',
        'Respuesta háptica universal: todos los botones, pestañas, interruptores y controles interactivos activan vibración táctil breve y uniforme cuando está disponible.',
        'Avisos de confirmación al cambiar o salir: la aplicación solicita confirmación antes de cambiar durante un examen o sección de estudio activa y al intentar salir de MateTic.'
      ]
    },
    {
      version: '1.5.2',
      date: '2026-11-18',
      items: [
        'Botón flotante de calculadora (🧮) en celular: al bajar por la página sale desde el lado derecho para tener acceso rápido en todo momento y se vuelve a ocultar al subir.',
        'Acceso simétrico y cómodo en recorridos largos en móvil: menú lateral (☰) a la izquierda y calculadora rápida (🧮) a la derecha.',
        'Al abrir un diálogo o el menú lateral, ambos botones flotantes se ocultan temporalmente para no estorbar.',
        'Al volver al inicio de la página, ambos botones se repliegan suavemente hacia los bordes laterales.',
        'Notas de actualización limpias y enfocadas únicamente en las mejoras visibles de la aplicación.',
        'Mantiene el mismo estilo visual y respuesta táctil del botón principal de calculadora.',
        'Sin cambios en el almacenamiento local ni en los motores matemáticos.'
      ]
    },
    {
      version: '1.5.1',
      date: '2026-11-18',
      items: [
        'Menú lateral móvil sin desplazamiento brusco: al abrir y cerrar el menú desde abajo en la página, la pantalla permanece exactamente en el mismo lugar sin volver a bajar desde arriba.',
        'Aviso de actualización más limpio: eliminado el botón \'Ver más en Ajustes\' del pie de las novedades.',
        'Sincronización inmediata de XP, racha y Dominio Global en la barra lateral y el panel principal.',
        'El botón flotante de las 3 líneas (☰) mantiene su posición exacta al cerrar el menú lateral.',
        'Mejor respuesta táctil y visual al volver de la barra lateral en recorridos largos.',
        'Estabilidad visual mejorada en desplazamientos largos en dispositivos móviles.',
        'Sin cambios en los datos guardados ni en el funcionamiento de las herramientas matemáticas.'
      ]
    },
    {
      version: '1.5.0',
      date: '2026-11-18',
      items: [
        'Botón flotante de menú (☰) en celular: al bajar por la página sale desde la izquierda para mantener el menú siempre accesible y vuelve a ocultarse al subir.',
        'Cabeceras uniformes en menús y ventanas emergentes (Ajustes, Novedades, NUMERUS CAS y calculadora rápida): la barra superior ahora comparte el mismo color del panel.',
        'Aviso de actualización simplificado y vertical: muestra únicamente la última versión en una sola columna vertical sin desplazamiento lateral en celular.',
        'Nueva sección Datos y sesión en Ajustes con opción para borrar todos los datos guardados (incluyendo XP, rachas, progreso en materias, PrepMat y preferencias).',
        'Nuevo botón Salir de la app en Ajustes con aviso de confirmación previo antes de cerrar la sesión.',
        'Diálogo accesible de confirmación antes de ejecutar acciones críticas en Ajustes.',
        'Pantalla de despedida segura al salir de la aplicación.'
      ]
    },
    {
      version: '1.4.3',
      date: '2026-11-18',
      items: [
        'PrepMat: corregidos los enunciados, opciones y explicaciones que mostraban símbolos $ sueltos y texto matemático pegado (por ejemplo, edades, mezclas, engranajes y fuerzas).',
        'Las cantidades con unidades ahora se muestran limpias y legibles dentro de cada enunciado.',
        'Las ecuaciones ya no se cortan entre renglones: pasan completas al siguiente renglón y las largas se pueden deslizar horizontalmente.',
        'Las fórmulas en bloque aparecen centradas en su propio renglón.',
        'Los saltos de línea de los enunciados se respetan y las palabras fluyen con naturalidad alrededor de las fórmulas.',
        'Corregidas funciones como sen, cos y tan que aparecían sin formato matemático en preguntas de ángulo doble.',
        'Sin cambios en el almacenamiento local ni en las demás herramientas.'
      ]
    },
    {
      version: '1.4.2',
      date: '2026-11-17',
      items: [
        'Eliminación total del recuadro azul táctil (-webkit-tap-highlight-color) al presionar botones, píldoras y controles en dispositivos móviles.',
        'Limpieza global de resalte táctil en el menú lateral, selectores de PrepMat, botones del graficador y pestañas de estudio.',
        'Supresión de contornos residuales de foco táctil en pantallas móviles (@media pointer: coarse) conservando intacta la navegación por teclado en escritorio.',
        'Prevención de selección accidental de texto y menús emergentes táctiles (-webkit-touch-callout) al mantener pulsados botones interactivos.',
        'Conservación íntegra de las animaciones Liquid Glass de presión (:active) y deslizadores líquidos sin interferencia del navegador móvil.',
        'Compatibilidad reforzada con navegadores móviles basados en Chromium, WebKit y vistas web instaladas (PWA).',
        'Sin cambios en la lógica ni en las funciones matemáticas, herramientas, simulador PrepMat ni almacenamiento local.'
      ]
    },
    {
      version: '1.4.1',
      date: '2026-11-17',
      items: [
        'NUMERUS CAS adaptado a modo claro: ventana armoniosa Liquid Glass, vitrina contrastada para sus 8 iconos levitando y botón único de cierre en cabecera.',
        'Mensaje directo en NUMERUS CAS: descripción concisa enfocada en nuestra futura calculadora de álgebra simbólica de alta precisión numérica con opciones avanzadas.',
        'Selector líquido en PrepMat: deslizador fluido en tiempo real hacia la opción adyacente en Nivel, Modalidad, Longitud y Estilo sin recargar el panel.',
        'Opciones animadas en examen PrepMat: transición tipo cristal líquido al seleccionar respuestas A, B, C o D desde clic o teclado.',
        'Bloqueo inteligente de fondos: Ajustes deshabilita los fondos oscuros en modo Claro fijo (y viceversa) evitando selecciones inactivas.',
        'Aviso claro en modo Automático: permite elegir fondos claros u oscuros indicando que el fondo opuesto se aplicará al cambiar de tema.',
        'Limpieza y documentación técnica: eliminados elementos redundantes y creado docs/DISENO_Y_ARQUITECTURA_ACTUALIZACIONES.md con el inventario completo de diseños.'
      ]
    },
    {
      version: '1.4.0',
      date: '2026-11-17',
      items: [
        'Menú lateral en píldoras: bordes discretos tipo cápsula constante en cada sección lateral para mejorar la lectura y jerarquía visual.',
        'Transparencia sutil global: superficies, tarjetas y paneles dejan entrever suavemente el fondo Liquid Glass sin sacrificar contraste.',
        'Seis fondos personalizables: elige en Ajustes entre 3 ambientes claros (Índigo Cristal, Brisa Esmeralda, Aurora Cálida) y 3 oscuros (Cosmos, Boreal Cian, Nebulosa).',
        'Fondo matemático mejorado: constelaciones sutiles conectando símbolos flotantes con rotación suave, pulso armónico y color acorde al fondo elegido.',
        'PrepMat con más enunciados: más de 50 problemas de enunciado contextualizados nuevos repartidos en las 9 ramas y filtro Mixto, Enunciado o Directo.',
        'Más práctica en secciones de estudio: todos los temas del currículo alcanzan al menos 5 ejercicios aplicados con retroalimentación paso a paso.',
        'Vista previa de NUMERUS CAS: acceso lateral a nuestra futura app de Álgebra Computacional con 8 módulos levitando y apoyo directo vía Ko-fi.'
      ]
    },
    {
      version: '1.3.0',
      date: '2026-11-17',
      items: [
        'Nuevo módulo PrepMat integrado: simulador analítico de exámenes para Bachillerato y Licenciatura en 9 ramas (desde Aritmética hasta Cálculo Integral y Álgebra Lineal / EDO).',
        'Rigor universitario en PrepMat: generación paramétrica anti-repetición, modos Entrenamiento Guiado y Simulacro Oficial, cronómetro dual y diagnóstico analítico paso a paso.',
        'Físicas Liquid Glass en botones: rebote elástico al presionar cada botón y corrección de sombras recortadas en pestañas horizontales, tarjetas y paneles de Ajustes.',
        'Bloqueo de scroll en menús móviles: al abrir Ajustes, Novedades o la barra lateral solo se desplaza la hoja activa, sin mover la pantalla de fondo.',
        'Acceso "Ver más en Ajustes": redirige desde Novedades directo a la sección Aplicación de Ajustes e incluye despliegue completo del historial de versiones.',
        'Ampliación analítica del currículum: 3.er ejemplo resuelto riguroso en Aritmética 2, Geometría 1–2, Trigonometría 1–2 y Funciones 1–2 con desarrollo detallado.',
        'Gráficas y animaciones ampliadas: enlaces directos al Graficador en ejemplos de Álgebra y Cálculo y animaciones demostrativas en Derivadas, Integración y EDO.'
      ]
    },
    {
      version: '1.2.4',
      date: '2026-11-17',
      items: [
        'Animación Liquid Glass en móvil: apertura y cierre fluidos tipo hoja inferior en Ajustes, Novedades, menú lateral y buscador.',
        'Resolución Guiada en KaTeX y MathLive: configuración de datos e intentos mediante campos matemáticos interactivos y vista previa en vivo.',
        'Difuminado total de pasos bloqueados: los pasos siguientes de Resolución Guiada y ejemplos permanecen completamente ocultos tras un sello de bloqueo hasta desbloquearlos.',
        'Aviso de Novedades rediseñado: cada actualización se presenta organizada en tarjetas temáticas con iconos, versión destacada e interlineado legible.',
        'Calculadora científica dinámica: respuesta táctil y visual fluida al pulsar cada tecla, animación al actualizar resultados y despliegue suave del catálogo de funciones.',
        'Mayor claridad de lectura: incremento en el interlineado de párrafos, separación entre temas y aire entre tarjetas de teoría, teoremas y ejercicios.',
        'Transiciones fluidas estilo cristal líquido entre pantallas, pestañas de estudio y botones segmentados, respetando el modo de movimiento reducido.'
      ]
    },
    {
      version: '1.2.3',
      date: '2026-11-17',
      items: [
        'Nuevo nombre oficial: MateTic (Matemáticas Interactivas) desarrollado por ALPA Studio.',
        'Rediseño visual Liquid Glass con modos Claro, Oscuro y Automático, además de fondo matemático animado opcional.',
        'Funcionamiento completo sin conexión a internet con tipografía matemática local (KaTeX y MathLive) y aplicación instalable (PWA).',
        'Nuevo panel de Ajustes accesible con control de vibración háptica, fondo animado, selector de tema y visibilidad del botón superior.',
        'Nuevo índice de inicio con "Continuar donde lo dejaste", rutas de aprendizaje sugeridas y mapa curricular filtrable.',
        'Teoremas formales con hipótesis y demostraciones desplegables, junto con animaciones demostrativas paso a paso en Cálculo.',
        'Calculadora científica mejorada (cursor preciso, borrado inteligente de tokens, grados ° y catálogo por categorías).',
        'Gráficas interactivas optimizadas para móvil con gestos de dos dedos, vista expandida a pantalla completa y avisos discretos de precisión numérica.'
      ]
    },
    {
      version: '1.2.0',
      date: '2026-11-10',
      items: [
        'Incorporación de teoremas formales, demostraciones paso a paso y nuevos ejemplos verificados en las 9 materias.',
        'Componente de animaciones demostrativas no interactivas para límites, derivadas y sumas de Riemann.',
        'Sistema háptico opcional, mejoras de cabecera móvil y nuevo mapa curricular interactivo.'
      ]
    },
    {
      version: '1.1.0',
      date: '2026-11-03',
      items: [
        'Sistema visual Liquid Glass en claro y oscuro con mejoras de contraste WCAG AA y navegación por teclado.',
        'Detección automática de discontinuidades removibles (huecos) en el graficador y en las lecciones.',
        'Calculadora científica con soporte de símbolo de grados (°), autocierre de paréntesis y mensajes de error claros.'
      ]
    },
    {
      version: '1.0.0',
      date: '2026-10-20',
      items: [
        'Lanzamiento inicial de la plataforma educativa con 9 módulos desde Aritmética hasta Cálculo.',
        'Graficador interactivo, editor visual de expresiones, resolución guiada y formularios imprimibles.'
      ]
    }
  ];

  function parseSemver(versionStr) {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(versionStr || '').trim());
    if (!match) return null;
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  }

  function isValidSemver(versionStr) {
    return parseSemver(versionStr) !== null;
  }

  /**
   * Compara dos versiones SemVer estrictas:
   * retorna > 0 si a > b, < 0 si a < b, 0 si son iguales.
   */
  function compareSemver(a, b) {
    const pa = parseSemver(a);
    const pb = parseSemver(b);
    if (!pa || !pb) {
      throw new Error(`Versión SemVer inválida al comparar "${a}" con "${b}"`);
    }
    for (let i = 0; i < 3; i++) {
      if (pa[i] !== pb[i]) return pa[i] - pb[i];
    }
    return 0;
  }

  /**
   * Calcula el nombre canónico de caché del Service Worker a partir de APP_NAME y APP_VERSION.
   */
  function getCacheName() {
    const slug = APP_NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${slug}-v${APP_VERSION}`;
  }

  /**
   * Resuelve de forma pura si debe mostrarse el aviso emergente de actualización
   * y qué entradas de novedades incluir (máximo `maxNotes` versiones recientes).
   */
  function resolveUpdateNoticeState(opts = {}) {
    const currentVersion = opts.currentVersion || APP_VERSION;
    const lastSeenVersion = String(opts.lastSeenVersion || '').trim();
    const releaseNotes = Array.isArray(opts.releaseNotes) ? opts.releaseNotes : RELEASE_NOTES;
    const maxNotes = typeof opts.maxNotes === 'number' && opts.maxNotes > 0 ? opts.maxNotes : 3;
    const alreadyShownInSession = Boolean(opts.alreadyShownInSession);

    if (alreadyShownInSession) {
      return { shouldShow: false, reason: 'already-shown-in-session', isFirstInstall: false, notes: [], hasMore: false };
    }

    if (lastSeenVersion && lastSeenVersion === currentVersion) {
      return { shouldShow: false, reason: 'up-to-date', isFirstInstall: false, notes: [], hasMore: false };
    }

    // Si existe última versión vista y no es menor que la actual, tampoco mostrar
    if (lastSeenVersion && isValidSemver(lastSeenVersion) && isValidSemver(currentVersion)) {
      if (compareSemver(currentVersion, lastSeenVersion) <= 0) {
        return { shouldShow: false, reason: 'not-newer', isFirstInstall: false, notes: [], hasMore: false };
      }
    }

    // Primera instalación o preferencia antigua sin lastSeenVersion
    if (!lastSeenVersion) {
      const topEntry = releaseNotes.slice(0, 1);
      return {
        shouldShow: topEntry.length > 0,
        reason: 'first-install',
        isFirstInstall: true,
        notes: topEntry,
        hasMore: releaseNotes.length > 1
      };
    }

    // Hay una versión previa registrada: recopilar notas entre (lastSeenVersion, currentVersion]
    const pending = releaseNotes.filter(entry => {
      if (!entry || !isValidSemver(entry.version)) return false;
      if (!isValidSemver(lastSeenVersion)) return entry.version === currentVersion;
      return compareSemver(entry.version, lastSeenVersion) > 0 &&
        compareSemver(entry.version, currentVersion) <= 0;
    });

    const selected = pending.length ? pending : releaseNotes.slice(0, 1);
    return {
      shouldShow: selected.length > 0,
      reason: 'updated',
      isFirstInstall: false,
      notes: selected.slice(0, maxNotes),
      hasMore: selected.length > maxNotes || releaseNotes.length > selected.length
    };
  }

  const versionApi = {
    APP_NAME,
    APP_TAGLINE,
    APP_VERSION,
    APP_RELEASE_DATE,
    STUDIO_NAME,
    STUDIO_MEANING,
    RELEASE_NOTES,
    parseSemver,
    isValidSemver,
    compareSemver,
    getCacheName,
    resolveUpdateNoticeState
  };

  root.MatInteractivaVersion = versionApi;
  root.MatInteractiva = root.MatInteractiva || {};
  root.MatInteractiva.Version = versionApi;
})(typeof globalThis !== 'undefined' ? globalThis : self);
