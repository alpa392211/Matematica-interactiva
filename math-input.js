/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Componente <math-field> (MathLive) y Teclado Visual
   Archivo: js/engine/math-input.js
   Gestiona:
   1. Creación, configuración híbrida y fallback de campos <math-field> (MathLive).
   2. Traductor bidireccional robusto:
      - latexToCasString(latex): Convierte el LaTeX visual de MathLive a la
        sintaxis exacta que consumen el Motor CAS, el Editor y el Evaluador.
      - casStringToLatex(str): Convierte expresiones algebraicas o de cálculo
        a LaTeX visual limpio para cargar en <math-field>.
   3. Teclado Matemático Visual acoplado en 6 categorías con conservación
      estricta del foco y posición exacta del cursor dentro de numeradores,
      denominadores, exponentes, índices y raíces.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  /**
   * Extrae un grupo entre delimitadores balanceados `{...}`, `[...]` o `(...)`
   * empezando en `startIdx`.
   */
  function extractBalanced(str, startIdx, openCh, closeCh) {
    let i = startIdx;
    while (i < str.length && str[i] === ' ') i++;
    if (i >= str.length || str[i] !== openCh) return null;

    let depth = 0;
    const contentStart = i + 1;
    for (let j = i; j < str.length; j++) {
      if (str[j] === '\\' && j + 1 < str.length) {
        j++;
        continue;
      }
      if (str[j] === openCh) depth++;
      else if (str[j] === closeCh) {
        depth--;
        if (depth === 0) {
          return {
            content: str.slice(contentStart, j),
            endIdx: j + 1
          };
        }
      }
    }
    return {
      content: str.slice(contentStart),
      endIdx: str.length
    };
  }

  /**
   * ==========================================================================
   * 1. TRADUCTOR BIDIRECCIONAL: LaTeX (<math-field>) <-> Formato Motor CAS
   * ==========================================================================
   */

  /**
   * Convierte una cadena LaTeX producida por `<math-field>` (MathLive) a la
   * sintaxis plana exacta que entienden `MathParser`, el Editor de Expresiones
   * y el Comprobador de Ejercicios (`checkStudentAnswer`).
   * El usuario jamás ve código LaTeX crudo.
   */
  function latexToCasString(rawLatex) {
    if (rawLatex === null || rawLatex === undefined) return '';
    let s = String(rawLatex).trim();
    if (!s) return '';

    // 0. Si el usuario pegó LaTeX como texto escapado dentro de MathLive, desescapar comandos básicos
    if (s.includes('\\backslash') || s.includes('\\textbackslash')) {
      s = s
        .replace(/\\(?:text)?backslash\s*/g, '\\')
        .replace(/\\_/g, '_')
        .replace(/\\\{/g, '{')
        .replace(/\\\}/g, '}')
        .replace(/\\\^/g, '^');
    }

    // 1. Limpiar marcadores de posición de MathLive (\placeholder{}, #?)
    // Si una base de potencia quedó con marcador vacío ({#?}^4 o {\placeholder{}}^4) sin variable previa, usar x como base
    s = s.replace(/(^|[+\-*/=(,{]\s*)\{\s*(?:\\placeholder\s*\{\s*\}|#\?)\s*\}\s*\^/g, '$1x^');
    // Si ya había una variable/número antes de {#?}^n (ej. X{#?}^4), unir el exponente a la variable previa
    s = s.replace(/([a-zA-Z0-9)])\s*\{\s*(?:\\placeholder\s*\{\s*\}|#\?)\s*\}\s*\^/g, '$1^');
    s = s.replace(/\\placeholder\s*\{([^{}]*)\}/g, '$1');
    s = s.replace(/\\placeholder\b/g, '');
    s = s.replace(/#\?/g, '');

    // 1b. Normalizar de forma segura variables independientes en mayúscula X -> x, Y -> y
    // sin afectar comandos LaTeX (como \Xi) ni palabras alfabéticas
    s = s
      .replace(/(^|[^\\a-zA-Z])X(?![a-zA-Z])/g, '$1x')
      .replace(/(^|[^\\a-zA-Z])Y(?![a-zA-Z])/g, '$1y');

    // 2. Limpiar comandos de espaciado y delimitadores decorativos de MathLive
    s = s
      .replace(/\\left\s*\|\s*([\s\S]*?)\s*\\right\s*\|/g, 'abs($1)')
      .replace(/\\mleft\s*\|\s*([\s\S]*?)\s*\\mright\s*\|/g, 'abs($1)')
      .replace(/\\left\s*/g, '')
      .replace(/\\right\s*/g, '')
      .replace(/\\mleft\s*/g, '')
      .replace(/\\mright\s*/g, '')
      .replace(/\\,|\\;|\\:|\\!|\\quad|\\qquad/g, ' ')
      .replace(/\\exponentialE\b/g, 'e')
      .replace(/\\imaginaryI\b/g, 'i')
      .replace(/\\differentialD\s*([a-zA-Z])/g, 'd$1')
      .replace(/\\differentialD\b/g, 'd')
      .replace(/\\operatorname\s*\{([^{}]+)\}/g, '$1')
      .replace(/\\mathrm\s*\{([^{}]+)\}/g, '$1')
      .replace(/\\text\s*\{([^{}]+)\}/g, '$1');

    // Desenvolver bases simples entre llaves antes de exponente: {x}^{4} -> x^{4} y x{}^{4} -> x^{4}
    s = s.replace(/([a-zA-Z0-9)])\s*\{\s*\}\s*\^/g, '$1^');
    s = s.replace(/(^|[+\-*/=(,{]\s*)\{\s*\}\s*\^/g, '$1x^');
    s = s.replace(/\{\s*([a-zA-Z0-9.]+)\s*\}\s*\^/g, '$1^');

    // 3. Traducir estructuras de Cálculo de LaTeX a la sintaxis funcional del motor:
    // 3a. Límite con extracción balanceada de subíndice y argumento: \lim_{x \to a} (expr) -> lim(expr, x -> a)
    for (let limPass = 0; limPass < 3; limPass++) {
      const limMatch = s.match(/\\lim\b/);
      if (!limMatch) break;
      const limIdx = limMatch.index;
      let cursor = limIdx + limMatch[0].length;
      while (cursor < s.length && s[cursor] === ' ') cursor++;

      let subRaw = 'x -> 0';
      if (cursor < s.length && s[cursor] === '_') {
        cursor++;
        while (cursor < s.length && s[cursor] === ' ') cursor++;
        if (s[cursor] === '{') {
          const subGrp = extractBalanced(s, cursor, '{', '}');
          if (subGrp) {
            subRaw = subGrp.content;
            cursor = subGrp.endIdx;
          }
        } else {
          const subTok = s.slice(cursor).match(/^([^\s([\\]+)/);
          if (subTok) {
            subRaw = subTok[1];
            cursor += subTok[0].length;
          }
        }
      }

      const cleanSub = subRaw
        .replace(/\\to(?![a-zA-Z])|\\rightarrow(?![a-zA-Z])/g, ' -> ')
        .replace(/\\infty(?![a-zA-Z])/g, 'inf')
        .replace(/\^\s*\{\s*\+\s*\}/g, '+')
        .replace(/\^\s*\{\s*-\s*\}/g, '-')
        .replace(/(^|[^\\a-zA-Z])X(?![a-zA-Z])/g, '$1x')
        .replace(/(^|[^\\a-zA-Z])Y(?![a-zA-Z])/g, '$1y')
        .replace(/[{}]/g, '')
        .replace(/\s*->\s*/g, ' -> ')
        .replace(/\s+/g, ' ')
        .trim();

      while (cursor < s.length && s[cursor] === ' ') cursor++;
      let bodyRaw = '';
      let bodyEnd = s.length;

      if (cursor < s.length && s[cursor] === '(') {
        const pGrp = extractBalanced(s, cursor, '(', ')');
        if (pGrp) {
          bodyRaw = pGrp.content;
          bodyEnd = pGrp.endIdx;
        }
      } else if (cursor < s.length && s[cursor] === '[') {
        const bGrp = extractBalanced(s, cursor, '[', ']');
        if (bGrp) {
          bodyRaw = bGrp.content;
          bodyEnd = bGrp.endIdx;
        }
      } else if (cursor < s.length && s[cursor] === '{') {
        const cGrp = extractBalanced(s, cursor, '{', '}');
        if (cGrp) {
          bodyRaw = cGrp.content;
          bodyEnd = cGrp.endIdx;
        }
      } else {
        bodyRaw = s.slice(cursor);
        bodyEnd = s.length;
      }

      const cleanBody = latexToCasString(bodyRaw);
      s = s.slice(0, limIdx) + `lim(${cleanBody}, ${cleanSub})` + s.slice(bodyEnd);
    }

    // 3b. Derivadas de orden superior y primer orden con extracción balanceada:
    // \frac{d^2}{dx^2}(expr) o \frac{d}{dx}(expr) -> derivada(expr)
    for (let dPass = 0; dPass < 3; dPass++) {
      const derivRegex = /\\[dt]?frac\s*\{\s*d(?:\^2|\^\{2\})?\s*\}\s*\{\s*d([a-zA-Z])(?:\^2|\^\{2\})?\s*\}/;
      const dMatch = s.match(derivRegex);
      if (!dMatch) break;
      const dIdx = dMatch.index;
      let cursor = dIdx + dMatch[0].length;
      while (cursor < s.length && s[cursor] === ' ') cursor++;

      let bodyRaw = '';
      let bodyEnd = s.length;
      if (cursor < s.length && s[cursor] === '(') {
        const pGrp = extractBalanced(s, cursor, '(', ')');
        if (pGrp) {
          bodyRaw = pGrp.content;
          bodyEnd = pGrp.endIdx;
        }
      } else if (cursor < s.length && s[cursor] === '[') {
        const bGrp = extractBalanced(s, cursor, '[', ']');
        if (bGrp) {
          bodyRaw = bGrp.content;
          bodyEnd = bGrp.endIdx;
        }
      } else if (cursor < s.length && s[cursor] === '{') {
        const cGrp = extractBalanced(s, cursor, '{', '}');
        if (cGrp) {
          bodyRaw = cGrp.content;
          bodyEnd = cGrp.endIdx;
        }
      } else {
        bodyRaw = s.slice(cursor);
        bodyEnd = s.length;
      }

      const inner = latexToCasString(bodyRaw);
      s = s.slice(0, dIdx) + `derivada(${inner})` + s.slice(bodyEnd);
    }

    // 3c. Integral definida: \int_{a}^{b} expr dx -> integral(expr, a, b)
    s = s.replace(
      /\\int\s*_\s*\{([^{}]*)\}\s*\^\s*\{([^{}]*)\}\s*([\s\S]*?)\s*d([a-zA-Z])\b/g,
      (_m, low, high, body, _v) => {
        const cleanBody = latexToCasString(body.replace(/^\\left\(|\\right\)$/g, '').trim());
        const cleanLow = latexToCasString(low.trim());
        const cleanHigh = latexToCasString(high.trim());
        return `integral(${cleanBody}, ${cleanLow}, ${cleanHigh})`;
      }
    );

    // 3d. Integral indefinida: \int expr dx -> integral(expr)
    s = s.replace(
      /\\int\s*([\s\S]*?)\s*d([a-zA-Z])\b/g,
      (_m, body, _v) => {
        const cleanBody = latexToCasString(body.trim());
        return `integral(${cleanBody})`;
      }
    );

    // 3e. Sumatoria: \sum_{i=a}^{b} expr -> sum(expr, i, a, b)
    s = s.replace(
      /\\sum\s*_\s*\{([^{}]*)\}\s*\^\s*\{([^{}]*)\}\s*([^\s]+)/g,
      (_m, sub, sup, body) => {
        return `sum(${latexToCasString(body)}, ${latexToCasString(sub)}, ${latexToCasString(sup)})`;
      }
    );

    // 4. Convertir recursivamente fracciones \frac{num}{den}, raíces \sqrt[n]{x} y \sqrt{x},
    //    y logaritmos con base \log_{b}(x) respetando llaves anidadas a cualquier profundidad
    for (let pass = 0; pass < 8; pass++) {
      let changed = false;

      // 4a. Fracción mixta numérica: N\frac{a}{b} (solo cuando N, a y b son enteros puros) -> (N + (a)/(b))
      s = s.replace(/(^|[+\-*/=(,\s])(\d+)\s*\\[dt]?frac\s*\{\s*(\d+)\s*\}\s*\{\s*(\d+)\s*\}/g, (_m, pre, whole, num, den) => {
        changed = true;
        return `${pre}(${whole} + (${num})/(${den}))`;
      });

      // 4b. \frac{num}{den} o \dfrac{num}{den} con llaves balanceadas
      const fracMatch = s.match(/\\[dt]?frac\b/);
      if (fracMatch) {
        const idx = fracMatch.index;
        const afterCmd = idx + fracMatch[0].length;
        const numGrp = extractBalanced(s, afterCmd, '{', '}');
        if (numGrp) {
          const denGrp = extractBalanced(s, numGrp.endIdx, '{', '}');
          if (denGrp) {
            const numStr = latexToCasString(numGrp.content);
            const denStr = latexToCasString(denGrp.content);
            const numWrapped = /^[a-zA-Z0-9.]+$/.test(numStr) ? numStr : `(${numStr})`;
            const denWrapped = /^[a-zA-Z0-9.]+$/.test(denStr) ? denStr : `(${denStr})`;
            s = s.slice(0, idx) + `${numWrapped}/${denWrapped}` + s.slice(denGrp.endIdx);
            changed = true;
            continue;
          }
        }
      }

      // 4c. \sqrt[n]{rad} o \sqrt{rad} con llaves balanceadas
      const sqrtMatch = s.match(/\\sqrt\b/);
      if (sqrtMatch) {
        const idx = sqrtMatch.index;
        let cursor = idx + sqrtMatch[0].length;
        const optIdxGrp = extractBalanced(s, cursor, '[', ']');
        if (optIdxGrp) {
          cursor = optIdxGrp.endIdx;
        }
        const radGrp = extractBalanced(s, cursor, '{', '}');
        if (radGrp) {
          const radStr = latexToCasString(radGrp.content);
          if (optIdxGrp) {
            const nStr = latexToCasString(optIdxGrp.content);
            s = s.slice(0, idx) + `raiz(${nStr}, ${radStr})` + s.slice(radGrp.endIdx);
          } else {
            s = s.slice(0, idx) + `raiz(${radStr})` + s.slice(radGrp.endIdx);
          }
          changed = true;
          continue;
        }
      }

      // 4d. Logaritmo con base: \log_{b}(x) -> (ln(x)/ln(b))
      s = s.replace(/\\log\s*_\s*\{([^{}]+)\}\s*\(([^()]+)\)/g, (_m, base, arg) => {
        changed = true;
        return `(ln(${latexToCasString(arg)})/ln(${latexToCasString(base)}))`;
      });

      if (!changed) break;
    }

    // 5. Potencias con llaves: {x}^{4} -> x^4, x^{a+b} -> x^(a+b) o x^{2} -> x^2
    s = s.replace(/\{\s*([a-zA-Z0-9.]+)\s*\}\s*\^/g, '$1^');
    for (let pass = 0; pass < 4; pass++) {
      s = s.replace(/\^\s*\{([^{}]*)\}/g, (_m, exp) => {
        const cleanExp = latexToCasString(exp.trim());
        if (!cleanExp) return '^()';
        return /^[a-zA-Z0-9.]+$/.test(cleanExp) ? `^${cleanExp}` : `^(${cleanExp})`;
      });
      s = s.replace(/_\s*\{([^{}]*)\}/g, (_m, sub) => `_${sub.trim()}`);
    }

    // 6. Funciones trigonométricas inversas y directas, símbolos y operadores
    s = s
      .replace(/\\arcsin\b|\\arcsen\b|\\sin\s*\^\s*(?:\{\s*-1\s*\}|\(\s*-1\s*\))/g, 'arcsen')
      .replace(/\\arccos\b|\\cos\s*\^\s*(?:\{\s*-1\s*\}|\(\s*-1\s*\))/g, 'arccos')
      .replace(/\\arctan\b|\\arctg\b|\\tan\s*\^\s*(?:\{\s*-1\s*\}|\(\s*-1\s*\))/g, 'arctan')
      .replace(/\\sin\b|\\sen\b/g, 'sen')
      .replace(/\\cos\b/g, 'cos')
      .replace(/\\tan\b|\\tg\b/g, 'tan')
      .replace(/\\cot\b/g, 'cot')
      .replace(/\\sec\b/g, 'sec')
      .replace(/\\csc\b/g, 'csc')
      .replace(/\\ln\b/g, 'ln')
      .replace(/\\log\b/g, 'log')
      .replace(/\\pi(?![a-zA-Z])/g, 'pi')
      .replace(/\\infty(?![a-zA-Z])/g, 'inf')
      .replace(/\\Delta(?![a-zA-Z])/g, 'Delta')
      .replace(/\\theta(?![a-zA-Z])/g, 'theta')
      .replace(/\\alpha(?![a-zA-Z])/g, 'alpha')
      .replace(/\\beta(?![a-zA-Z])/g, 'beta')
      .replace(/\\cdot(?![a-zA-Z])|\\times(?![a-zA-Z])/g, '*')
      .replace(/\\div(?![a-zA-Z])/g, '/')
      .replace(/\\pm(?![a-zA-Z])/g, '+-')
      .replace(/\\le(?![a-zA-Z])|\\leq(?![a-zA-Z])/g, '<=')
      .replace(/\\ge(?![a-zA-Z])|\\geq(?![a-zA-Z])/g, '>=')
      .replace(/\\ne(?![a-zA-Z])|\\neq(?![a-zA-Z])/g, '!=')
      .replace(/\\to(?![a-zA-Z])|\\rightarrow(?![a-zA-Z])/g, ' -> ');

    // 7. Si quedaron funciones seguidas de espacio y argumento sin paréntesis (p. ej. \sin x -> sen(x))
    s = s.replace(/\b(sen|sin|cos|tan|cot|sec|csc|arcsen|arccos|arctan|ln|log)\s+([a-zA-Z0-9]+)\b/g, '$1($2)');

    // 8. Re-normalizar cualquier X o Y mayúscula residual y limpiar llaves y espacios múltiples
    s = s
      .replace(/(^|[^\\a-zA-Z])X(?![a-zA-Z])/g, '$1x')
      .replace(/(^|[^\\a-zA-Z])Y(?![a-zA-Z])/g, '$1y')
      .replace(/[{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return s;
  }

  /**
   * Convierte una cadena del Motor CAS / Editor (como `(x+1)/(x-1) + raiz(3, x^2)`)
   * a LaTeX limpio listo para cargarse visualmente en `<math-field>`.
   */
  function casStringToLatex(casStr) {
    if (casStr === null || casStr === undefined) return '';
    const raw = String(casStr).trim();
    if (!raw) return '';

    if (ns.MathRenderer && typeof ns.MathRenderer.algebraicToLatex === 'function') {
      let latex = ns.MathRenderer.algebraicToLatex(raw);
      // Convertir marcadores \square a \placeholder{} para que MathLive los muestre como casillas editables
      latex = latex.replace(/\\square/g, '\\placeholder{}');
      return latex;
    }
    return raw;
  }

  /**
   * ==========================================================================
   * 2. DEFINICIÓN DEL TECLADO MATEMÁTICO VISUAL EN 6 CATEGORÍAS
   * ==========================================================================
   * Cada botón define:
   * - `label`: LaTeX renderizado en la tecla visual.
   * - `title`: Descripción emergente clara en español.
   * - `latex`: Plantilla de inserción para `<math-field>` con `\placeholder{}` (`#?`).
   * - `fallback`: Plantilla equivalente para el input de respaldo si el CDN no está disponible.
   * - `cmd`: Comando especial de navegación o borrado (`backspace`, `left`, `right`, `clear`).
   */
  const SIX_KEYBOARD_CATEGORIES = [
    {
      id: 'cat-basicas',
      shortLabel: '1. Básicas',
      fullTitle: 'Categoría 1: Operaciones básicas y cursores',
      keys: [
        { label: '7', latex: '7', fallback: '7', title: 'Número 7', cls: 'kb-num' },
        { label: '8', latex: '8', fallback: '8', title: 'Número 8', cls: 'kb-num' },
        { label: '9', latex: '9', fallback: '9', title: 'Número 9', cls: 'kb-num' },
        { label: '\\div', latex: '\\frac{#?}{#?}', fallback: '()/()', fallbackOffset: 1, title: 'División / Fracción (÷)', cls: 'kb-op' },

        { label: '4', latex: '4', fallback: '4', title: 'Número 4', cls: 'kb-num' },
        { label: '5', latex: '5', fallback: '5', title: 'Número 5', cls: 'kb-num' },
        { label: '6', latex: '6', fallback: '6', title: 'Número 6', cls: 'kb-num' },
        { label: '\\times', latex: '\\cdot ', fallback: '*', title: 'Multiplicación (×)', cls: 'kb-op' },

        { label: '1', latex: '1', fallback: '1', title: 'Número 1', cls: 'kb-num' },
        { label: '2', latex: '2', fallback: '2', title: 'Número 2', cls: 'kb-num' },
        { label: '3', latex: '3', fallback: '3', title: 'Número 3', cls: 'kb-num' },
        { label: '-', latex: '-', fallback: ' - ', title: 'Resta (−)', cls: 'kb-op' },

        { label: '0', latex: '0', fallback: '0', title: 'Número 0', cls: 'kb-num' },
        { label: '.', latex: '.', fallback: '.', title: 'Punto decimal (.)', cls: 'kb-num' },
        { label: '=', latex: '=', fallback: ' = ', title: 'Igualdad (=)', cls: 'kb-op' },
        { label: '+', latex: '+', fallback: ' + ', title: 'Suma (+)', cls: 'kb-op' },

        { label: '(\\square)', latex: '(#?)', fallback: '()', fallbackOffset: 1, title: 'Paréntesis ( )' },
        { label: '|\\square|', latex: '\\left|#?\\right|', fallback: 'abs()', fallbackOffset: 4, title: 'Valor absoluto |x|' },
        { label: '\\leftarrow', cmd: 'left', title: 'Mover cursor a la izquierda', cls: 'kb-nav' },
        { label: '\\rightarrow', cmd: 'right', title: 'Mover cursor a la derecha', cls: 'kb-nav' },

        { label: '[\\square]', latex: '[#?]', fallback: '[]', fallbackOffset: 1, title: 'Corchetes [ ]' },
        { label: '\\neq', latex: '\\neq ', fallback: ' != ', title: 'Distinto de (≠)' },
        { label: '\\text{⌫ Borrar}', cmd: 'backspace', title: 'Borrar carácter anterior (Backspace)', cls: 'kb-danger mvk-key-backspace' }
      ]
    },
    {
      id: 'cat-fracciones',
      shortLabel: '2. Fracciones y Raíces',
      fullTitle: 'Categoría 2: Fracciones y radicales',
      keys: [
        {
          label: '\\frac{\\square}{\\square}',
          subtitle: 'Fracción',
          latex: '\\frac{#?}{#?}',
          fallback: '()/()',
          fallbackOffset: 1,
          title: 'Fracción con numerador y denominador',
          cls: 'kb-featured'
        },
        {
          label: '\\square\\frac{\\square}{\\square}',
          subtitle: 'Fracción mixta',
          latex: '#?\\frac{#?}{#?}',
          fallback: '1 + ()/()',
          fallbackOffset: 5,
          title: 'Fracción mixta (parte entera + fracción)',
          cls: 'kb-featured'
        },
        {
          label: '\\sqrt{\\square}',
          subtitle: 'Raíz cuadrada',
          latex: '\\sqrt{#?}',
          fallback: 'raiz()',
          fallbackOffset: 5,
          title: 'Raíz cuadrada √x',
          cls: 'kb-featured'
        },
        {
          label: '\\sqrt[3]{\\square}',
          subtitle: 'Raíz cúbica',
          latex: '\\sqrt[3]{#?}',
          fallback: 'raiz(3, )',
          fallbackOffset: 8,
          title: 'Raíz cúbica ³√x',
          cls: 'kb-featured'
        },
        {
          label: '\\sqrt[n]{\\square}',
          subtitle: 'Raíz índice n',
          latex: '\\sqrt[#?]{#?}',
          fallback: 'raiz(n, )',
          fallbackOffset: 5,
          title: 'Raíz de índice n: ⁿ√x',
          cls: 'kb-featured'
        },
        {
          label: '\\frac{1}{\\sqrt{\\square} \\pm \\square}',
          subtitle: 'Racionalización',
          latex: '\\frac{#?}{\\sqrt{#?}-#?}',
          fallback: '()/(raiz() - )',
          fallbackOffset: 1,
          title: 'Estructura base de racionalización con radical en el denominador',
          cls: 'kb-featured'
        },
        {
          label: '\\frac{\\sqrt{\\square}}{\\square}',
          subtitle: 'Radical sobre denominador',
          latex: '\\frac{\\sqrt{#?}}{#?}',
          fallback: 'raiz()/()',
          fallbackOffset: 5,
          title: 'Raíz cuadrada dividida entre denominador'
        },
        {
          label: '\\leftarrow',
          cmd: 'left',
          title: 'Mover cursor a la casilla anterior',
          cls: 'kb-nav'
        },
        {
          label: '\\rightarrow',
          cmd: 'right',
          title: 'Mover cursor a la siguiente casilla',
          cls: 'kb-nav'
        },
        {
          label: '\\text{⌫}',
          cmd: 'backspace',
          title: 'Borrar carácter',
          cls: 'kb-danger'
        }
      ]
    },
    {
      id: 'cat-algebra',
      shortLabel: '3. Potencias y Álgebra',
      fullTitle: 'Categoría 3: Potencias, variables y constantes algebraicas',
      keys: [
        { label: '{\\square}^{\\square}', subtitle: 'Potencia', latex: '{#?}^{#?}', fallback: '^()', fallbackOffset: 2, title: 'Potencia con base y exponente', cls: 'kb-featured' },
        { label: '{\\square}^2', subtitle: 'Al cuadrado', latex: '{#?}^{2}', fallback: '^2', fallbackOffset: 2, title: 'Elevar al cuadrado (²)', cls: 'kb-featured' },
        { label: '{\\square}^3', subtitle: 'Al cubo', latex: '{#?}^{3}', fallback: '^3', fallbackOffset: 2, title: 'Elevar al cubo (³)', cls: 'kb-featured' },
        { label: '{\\square}_{\\square}', subtitle: 'Subíndice', latex: '{#?}_{#?}', fallback: '_0', fallbackOffset: 2, title: 'Subíndice' },
        { label: 'x', latex: 'x', fallback: 'x', title: 'Variable x', cls: 'kb-var' },
        { label: 'y', latex: 'y', fallback: 'y', title: 'Variable y', cls: 'kb-var' },
        { label: 'z', latex: 'z', fallback: 'z', title: 'Variable z', cls: 'kb-var' },
        { label: 'a', latex: 'a', fallback: 'a', title: 'Parámetro a', cls: 'kb-var' },
        { label: 'b', latex: 'b', fallback: 'b', title: 'Parámetro b', cls: 'kb-var' },
        { label: 'n', latex: 'n', fallback: 'n', title: 'Variable entera n', cls: 'kb-var' },
        { label: 't', latex: 't', fallback: 't', title: 'Variable temporal t', cls: 'kb-var' },
        { label: '\\pi', latex: '\\pi', fallback: 'pi', title: 'Constante Pi (π ≈ 3.14159)', cls: 'kb-const' },
        { label: 'e', latex: 'e', fallback: 'e', title: 'Número de Euler (e ≈ 2.71828)', cls: 'kb-const' },
        { label: 'e^{\\square}', latex: 'e^{#?}', fallback: 'e^()', fallbackOffset: 3, title: 'Exponencial natural e^x' },
        { label: 'i', latex: 'i', fallback: 'i', title: 'Unidad imaginaria i', cls: 'kb-const' },
        { label: '!', latex: '!', fallback: '!', title: 'Factorial (!)' }
      ]
    },
    {
      id: 'cat-funciones',
      shortLabel: '4. Funciones y Trig.',
      fullTitle: 'Categoría 4: Funciones trigonométricas, inversas y logarítmicas',
      keys: [
        { label: '\\operatorname{sen}(\\square)', latex: '\\sin(#?)', fallback: 'sen()', fallbackOffset: 4, title: 'Función Seno: sen(x)', cls: 'kb-fn' },
        { label: '\\cos(\\square)', latex: '\\cos(#?)', fallback: 'cos()', fallbackOffset: 4, title: 'Función Coseno: cos(x)', cls: 'kb-fn' },
        { label: '\\tan(\\square)', latex: '\\tan(#?)', fallback: 'tan()', fallbackOffset: 4, title: 'Función Tangente: tan(x)', cls: 'kb-fn' },
        { label: '\\cot(\\square)', latex: '\\cot(#?)', fallback: 'cot()', fallbackOffset: 4, title: 'Función Cotangente: cot(x)', cls: 'kb-fn' },
        { label: '\\sec(\\square)', latex: '\\sec(#?)', fallback: 'sec()', fallbackOffset: 4, title: 'Función Secante: sec(x)', cls: 'kb-fn' },
        { label: '\\csc(\\square)', latex: '\\csc(#?)', fallback: 'csc()', fallbackOffset: 4, title: 'Función Cosecante: csc(x)', cls: 'kb-fn' },
        { label: '\\arcsin(\\square)', latex: '\\arcsin(#?)', fallback: 'arcsen()', fallbackOffset: 7, title: 'Arcoseno (inversa del seno)', cls: 'kb-fn' },
        { label: '\\arccos(\\square)', latex: '\\arccos(#?)', fallback: 'arccos()', fallbackOffset: 7, title: 'Arcocoseno (inversa del coseno)', cls: 'kb-fn' },
        { label: '\\arctan(\\square)', latex: '\\arctan(#?)', fallback: 'arctan()', fallbackOffset: 7, title: 'Arcotangente (inversa de la tangente)', cls: 'kb-fn' },
        { label: '\\ln(\\square)', latex: '\\ln(#?)', fallback: 'ln()', fallbackOffset: 3, title: 'Logaritmo natural (base e): ln(x)', cls: 'kb-fn' },
        { label: '\\log(\\square)', latex: '\\log(#?)', fallback: 'log()', fallbackOffset: 4, title: 'Logaritmo decimal (base 10): log(x)', cls: 'kb-fn' },
        { label: '\\log_{\\square}(\\square)', latex: '\\log_{#?}(#?)', fallback: 'ln()/ln()', fallbackOffset: 3, title: 'Logaritmo en base b: log_b(x)', cls: 'kb-fn' },
        { label: 'f(x)=', latex: 'f(x)=', fallback: 'f(x) = ', fallbackOffset: 7, title: 'Notación de función f(x) =' },
        { label: 'g(x)=', latex: 'g(x)=', fallback: 'g(x) = ', fallbackOffset: 7, title: 'Notación de función g(x) =' }
      ]
    },
    {
      id: 'cat-diferencial',
      shortLabel: '5. Cálculo Diferencial',
      fullTitle: 'Categoría 5: Límites, derivadas y razones de cambio',
      keys: [
        {
          label: '\\lim_{x \\to \\square}(\\square)',
          subtitle: 'Límite',
          latex: '\\lim_{x\\to #?}\\left(#?\\right)',
          fallback: 'lim(, x -> 0)',
          fallbackOffset: 4,
          title: 'Límite cuando x tiende a un valor',
          cls: 'kb-featured'
        },
        {
          label: 'x \\to a^+',
          subtitle: 'Límite derecha',
          latex: '\\lim_{x\\to #?^{+}}\\left(#?\\right)',
          fallback: 'lim(, x -> 0+)',
          fallbackOffset: 4,
          title: 'Límite lateral por la derecha (x → a⁺)'
        },
        {
          label: 'x \\to a^-',
          subtitle: 'Límite izquierda',
          latex: '\\lim_{x\\to #?^{-}}\\left(#?\\right)',
          fallback: 'lim(, x -> 0-)',
          fallbackOffset: 4,
          title: 'Límite lateral por la izquierda (x → a⁻)'
        },
        {
          label: '\\infty',
          subtitle: 'Infinito',
          latex: '\\infty',
          fallback: 'inf',
          title: 'Símbolo de infinito (∞)',
          cls: 'kb-const'
        },
        {
          label: '\\frac{d}{dx}(\\square)',
          subtitle: 'Derivada 1ª',
          latex: '\\frac{d}{dx}\\left(#?\\right)',
          fallback: 'derivada()',
          fallbackOffset: 9,
          title: 'Derivada primera respecto a x: d/dx',
          cls: 'kb-featured'
        },
        {
          label: '\\frac{d^2}{dx^2}(\\square)',
          subtitle: 'Derivada 2ª',
          latex: '\\frac{d^2}{dx^2}\\left(#?\\right)',
          fallback: 'derivada()',
          fallbackOffset: 9,
          title: 'Derivada de segundo orden: d²/dx²',
          cls: 'kb-featured'
        },
        {
          label: "f'(x)",
          subtitle: 'Prima 1ª',
          latex: "f'(x)",
          fallback: "f'(x)",
          title: "Notación de Lagrange: primera derivada f'(x)"
        },
        {
          label: "f''(x)",
          subtitle: 'Biprima 2ª',
          latex: "f''(x)",
          fallback: "f''(x)",
          title: "Notación de Lagrange: segunda derivada f''(x)"
        },
        {
          label: '\\Delta x',
          subtitle: 'Incremento',
          latex: '\\Delta x',
          fallback: 'Delta*x',
          title: 'Incremento de la variable (Δx)'
        }
      ]
    },
    {
      id: 'cat-integral',
      shortLabel: '6. Cálculo Integral',
      fullTitle: 'Categoría 6: Integrales indefinidas, definidas, sumatorias y diferenciales',
      keys: [
        {
          label: '\\int \\square\\,dx',
          subtitle: 'Integral indef.',
          latex: '\\int #?\\,dx',
          fallback: 'integral()',
          fallbackOffset: 9,
          title: 'Integral indefinida (antiderivada): ∫ f(x) dx',
          cls: 'kb-featured'
        },
        {
          label: '\\int_{\\square}^{\\square} \\square\\,dx',
          subtitle: 'Integral definida',
          latex: '\\int_{#?}^{#?}#?\\,dx',
          fallback: 'integral(, 0, 1)',
          fallbackOffset: 9,
          title: 'Integral definida con límites inferior y superior',
          cls: 'kb-featured'
        },
        {
          label: '\\sum_{i=\\square}^{\\square} \\square',
          subtitle: 'Sumatoria',
          latex: '\\sum_{i=#?}^{#?}#?',
          fallback: 'sum(, i, 1, n)',
          fallbackOffset: 4,
          title: 'Sumatoria de Riemann / Sigma: ∑'
        },
        {
          label: '+ C',
          subtitle: 'Constante',
          latex: '+C',
          fallback: ' + C',
          title: 'Constante de integración (+ C)'
        },
        {
          label: 'dx',
          latex: '\\,dx',
          fallback: 'dx',
          title: 'Diferencial de x (dx)'
        },
        {
          label: 'dy',
          latex: '\\,dy',
          fallback: 'dy',
          title: 'Diferencial de y (dy)'
        },
        {
          label: 'dt',
          latex: '\\,dt',
          fallback: 'dt',
          title: 'Diferencial de t (dt)'
        },
        {
          label: 'du',
          latex: '\\,du',
          fallback: 'du',
          title: 'Diferencial de cambio de variable u (du)'
        }
      ]
    }
  ];

  /**
   * Comprueba si el Web Component `<math-field>` de MathLive ya está registrado
   * en el navegador.
   */
  function isMathLiveAvailable() {
    return Boolean(window.customElements && window.customElements.get('math-field'));
  }

  /** Detecta si el dispositivo principal de entrada es táctil (teléfono/tableta). */
  function isTouchPrimaryDevice() {
    try {
      return Boolean(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    } catch (_) {
      return false;
    }
  }

  /**
   * Configura las opciones e `inlineShortcuts` de un elemento `<math-field>`
   * para permitir escritura híbrida natural en español e inglés.
   */
  function configureMathFieldElement(mf) {
    if (!mf || mf.__matConfigured) return;
    mf.__matConfigured = true;

    try {
      mf.smartMode = false;
      mf.smartFence = true;
      mf.smartSuperscript = true;
      mf.removeExtraneousParentheses = false;
      mf.mathVirtualKeyboardPolicy = 'manual';
      // En dispositivos táctiles evitar que el teclado nativo tape la pantalla: se usa el
      // Teclado Matemático Visual. El PC con teclado físico no se ve afectado.
      if (isTouchPrimaryDevice()) {
        mf.setAttribute('inputmode', 'none');
      }

      const baseShortcuts = mf.inlineShortcuts || {};
      mf.inlineShortcuts = Object.assign({}, baseShortcuts, {
        sen: '\\sin',
        sin: '\\sin',
        cos: '\\cos',
        tan: '\\tan',
        tg: '\\tan',
        cot: '\\cot',
        sec: '\\sec',
        csc: '\\csc',
        arcsen: '\\arcsin',
        arcsin: '\\arcsin',
        arccos: '\\arccos',
        arctan: '\\arctan',
        ln: '\\ln',
        log: '\\log',
        sqrt: '\\sqrt{#?}',
        raiz: '\\sqrt{#?}',
        cbrt: '\\sqrt[3]{#?}',
        pi: '\\pi',
        inf: '\\infty',
        infinito: '\\infty',
        '!=': '\\neq',
        '<=': '\\le',
        '>=': '\\ge'
      });
    } catch (_) {
      // Ignorar si alguna propiedad cambia entre versiones menores de MathLive
    }
  }

  /**
   * Inserta texto en un `<input>` estándar de respaldo conservando el cursor.
   */
  function insertIntoFallbackInput(inputEl, snippet, cursorOffset) {
    if (!inputEl) return;
    const start = typeof inputEl.selectionStart === 'number' ? inputEl.selectionStart : inputEl.value.length;
    const end = typeof inputEl.selectionEnd === 'number' ? inputEl.selectionEnd : inputEl.value.length;
    inputEl.value = inputEl.value.slice(0, start) + snippet + inputEl.value.slice(end);
    inputEl.focus();
    const pos = typeof cursorOffset === 'number' ? start + cursorOffset : start + snippet.length;
    inputEl.setSelectionRange(pos, pos);
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /**
   * Ejecuta un botón del Teclado Matemático Visual sobre un controlador de campo
   * (`fieldController`) sin perder jamás el foco ni la posición del cursor.
   */
  function executeKeyOnController(fieldController, keyDef) {
    if (!fieldController || !keyDef) return;

    if (keyDef.cmd === 'backspace') {
      fieldController.backspace();
      return;
    }
    if (keyDef.cmd === 'left') {
      fieldController.moveCursor('left');
      return;
    }
    if (keyDef.cmd === 'right') {
      fieldController.moveCursor('right');
      return;
    }
    if (keyDef.cmd === 'clear') {
      fieldController.clear();
      return;
    }

    fieldController.insertTemplate(keyDef.latex, keyDef.fallback, keyDef.fallbackOffset);
  }

  /**
   * Renderiza un panel de Teclado Matemático Visual de 6 categorías dentro de `containerEl`
   * vinculado al `fieldController` indicado.
   */
  function renderVisualKeyboard(containerEl, getControllerFn, options = {}) {
    if (!containerEl) return;
    let activeCatIdx = 0;
    if (typeof options.initialCategory === 'number') {
      activeCatIdx = options.initialCategory;
    } else if (typeof options.initialCategory === 'string') {
      const foundIdx = SIX_KEYBOARD_CATEGORIES.findIndex(
        c => c.id === options.initialCategory || c.id === `cat-${options.initialCategory}`
      );
      if (foundIdx >= 0) activeCatIdx = foundIdx;
    }

    function draw() {
      const currentCat = SIX_KEYBOARD_CATEGORIES[activeCatIdx] || SIX_KEYBOARD_CATEGORIES[0];
      containerEl.innerHTML = `
        <div class="mvk-panel ${options.compact ? 'mvk-compact' : ''}" role="region" aria-label="Teclado Matemático Visual">
          <div class="mvk-header-bar">
            <div class="mvk-header-left">
              <span class="mvk-header-title">${options.title || '⌨️ Teclado Matemático Visual (6 Categorías)'}</span>
              <span class="mvk-header-hint">💡 Haz clic en cualquier estructura: el cursor se ubica automáticamente en <code>□</code></span>
            </div>
            ${options.collapsible ? `
              <button type="button" class="mvk-close-btn" data-mvk-hide="true" title="Ocultar teclado visual">
                ✕ Ocultar teclado
              </button>
            ` : ''}
          </div>

          <div class="mvk-tabs-bar" role="tablist">
            ${SIX_KEYBOARD_CATEGORIES.map((cat, idx) => `
              <button
                type="button"
                role="tab"
                aria-selected="${idx === activeCatIdx ? 'true' : 'false'}"
                class="mvk-tab-btn ${idx === activeCatIdx ? 'active' : ''}"
                data-mvk-tab="${idx}"
                data-mvk-cat-id="${cat.id}"
                title="${cat.fullTitle}">
                <span class="mvk-tab-label">${cat.shortLabel}</span>
              </button>
            `).join('')}
          </div>

          <div class="mvk-cat-desc">
            <strong>${currentCat.fullTitle}</strong>
          </div>

          <div class="mvk-keys-grid" data-cat-id="${currentCat.id}">
            ${currentCat.keys.map((k, kIdx) => `
              <button
                type="button"
                class="mvk-key-btn ${k.cls || ''}"
                data-mvk-key="${kIdx}"
                title="${k.title || ''}">
                <span class="mvk-key-math">${ns.MathRenderer ? ns.MathRenderer.renderMath(k.label, false) : k.label}</span>
                ${k.subtitle ? `<span class="mvk-key-sub">${k.subtitle}</span>` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // Cambiar de pestaña con mousedown preventDefault para no robar el foco del <math-field>
      containerEl.querySelectorAll('[data-mvk-tab]').forEach(tabBtn => {
        tabBtn.addEventListener('mousedown', (ev) => {
          ev.preventDefault();
        });
        tabBtn.addEventListener('click', () => {
          activeCatIdx = Number(tabBtn.getAttribute('data-mvk-tab')) || 0;
          draw();
          const ctrl = typeof getControllerFn === 'function' ? getControllerFn() : getControllerFn;
          ctrl?.focus();
        });
      });

      // Ocultar teclado si es colapsable
      containerEl.querySelector('[data-mvk-hide]')?.addEventListener('click', () => {
        const closeCb = options.onClose || options.onRequestClose;
        if (typeof closeCb === 'function') {
          closeCb();
        } else {
          containerEl.classList.remove('open', 'is-open');
          containerEl.classList.add('is-collapsed');
        }
      });

      // Botones de inserción matemática: mousedown preventDefault garantiza que el foco
      // y el cursor dentro del <math-field> (numerador, denominador, exponente o raíz) no se pierdan jamás
      containerEl.querySelectorAll('[data-mvk-key]').forEach(keyBtn => {
        keyBtn.addEventListener('mousedown', (ev) => {
          ev.preventDefault();
        });
        keyBtn.addEventListener('click', () => {
          const kIdx = Number(keyBtn.getAttribute('data-mvk-key'));
          const keyDef = currentCat.keys[kIdx];
          const ctrl = typeof getControllerFn === 'function' ? getControllerFn() : getControllerFn;
          executeKeyOnController(ctrl, keyDef);
        });
      });
    }

    draw();
  }

  /**
   * Crea y monta un campo matemático interactivo (`<math-field>` con fallback limpio a `<input>`)
   * dentro de `mountEl`, devolviendo un controlador unificado:
   * `{ getCasValue, getLatex, getLatexValue, setCasValue, setLatexValue, insertTemplate, backspace, moveCursor, clear, focus, element, mathFieldEl, fallbackInput }`.
   */
  function createMathFieldController(mountEl, options = {}) {
    if (!mountEl) return null;

    const initialCas = String(options.initialCasValue ?? options.initialValue ?? '');
    const initialLatex = casStringToLatex(initialCas);
    const placeholderText = options.placeholder || 'Escribe aquí o usa el teclado matemático visual...';
    const ariaLabel = options.ariaLabel || 'Campo de expresión matemática';
    const fieldId = options.id || 'mf-' + Math.random().toString(36).slice(2, 9);
    const fallbackId = options.fallbackInputId || `${fieldId}-fallback`;
    const enterHandler = options.onSubmit || options.onEnter;

    let mfEl = null;
    let fallbackInput = null;
    let isUpgraded = false;
    let suppressInputEvent = false;

    function setupDOM() {
      mountEl.innerHTML = `
        <div class="mathlive-field-wrapper ${options.compact ? 'is-compact' : ''}" data-mathlive-ready="true">
          <math-field
            id="${fieldId}"
            class="mat-math-field ${options.compact ? 'mat-math-field-compact' : ''}"
            virtual-keyboard-mode="manual"
            aria-label="${ariaLabel.replace(/"/g, '&quot;')}"
          >${initialLatex}</math-field>
          <button type="button" class="mat-native-kb-toggle" aria-pressed="false"
            title="Usar el teclado del teléfono (letras)" aria-label="Alternar teclado del teléfono">⌨</button>
          <input
            type="text"
            id="${fallbackId}"
            class="mat-fallback-input ${options.compact ? 'exercise-input' : 'editor-primary-input'}"
            value="${initialCas.replace(/"/g, '&quot;')}"
            placeholder="${placeholderText.replace(/"/g, '&quot;')}"
            autocomplete="off"
            spellcheck="false"
            style="display:none;"
          />
        </div>
      `;

      mfEl = mountEl.querySelector('math-field');
      fallbackInput = mountEl.querySelector('.mat-fallback-input');

      const nativeKbBtn = mountEl.querySelector('.mat-native-kb-toggle');
      if (nativeKbBtn) {
        nativeKbBtn.addEventListener('mousedown', (ev) => ev.preventDefault());
        nativeKbBtn.addEventListener('click', () => {
          const wantsNative = nativeKbBtn.getAttribute('aria-pressed') !== 'true';
          nativeKbBtn.setAttribute('aria-pressed', wantsNative ? 'true' : 'false');
          if (mfEl) {
            mfEl.setAttribute('inputmode', wantsNative ? 'text' : 'none');
            mfEl.blur?.();
            mfEl.focus?.();
          }
        });
      }

      const activateMathLive = () => {
        if (!mfEl || isUpgraded) return;
        isUpgraded = true;
        configureMathFieldElement(mfEl);
        mfEl.style.display = 'block';
        if (fallbackInput) fallbackInput.style.display = 'none';

        try {
          if (typeof mfEl.setValue === 'function') {
            mfEl.setValue(initialLatex, { suppressChangeNotifications: true });
          } else {
            mfEl.value = initialLatex;
          }
        } catch (_) {
          mfEl.value = initialLatex;
        }
      };

      if (isMathLiveAvailable()) {
        activateMathLive();
      } else {
        // Fallback inmediato mientras carga o si no hay red
        if (mfEl) mfEl.style.display = 'none';
        if (fallbackInput) fallbackInput.style.display = 'block';

        if (window.customElements && typeof window.customElements.whenDefined === 'function') {
          window.customElements.whenDefined('math-field').then(() => {
            const currentCas = fallbackInput ? fallbackInput.value : initialCas;
            activateMathLive();
            if (currentCas) {
              controller.setCasValue(currentCas, { silent: true });
            }
          }).catch(() => {});
        }
      }

      // Escuchar cambios en <math-field>
      mfEl?.addEventListener('input', () => {
        if (suppressInputEvent) return;
        const casVal = controller.getCasValue();
        if (fallbackInput) fallbackInput.value = casVal;
        if (typeof options.onChange === 'function') {
          options.onChange(casVal, { source: 'mathfield', latex: controller.getLatexValue() });
        }
      });

      // Soporte para pegar expresiones directamente en LaTeX (ej. \lim_{x\to2} \left(\frac{X^4-16}{X-2}\right))
      mfEl?.addEventListener('paste', (ev) => {
        const pasted = ev.clipboardData?.getData('text/plain') || '';
        if (pasted && /\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(pasted)) {
          ev.preventDefault();
          const cleanPasted = pasted.trim().replace(/^\$+|\$+$/g, '').trim();
          try {
            if (typeof mfEl.executeCommand === 'function') {
              mfEl.executeCommand(['insert', cleanPasted, {
                insertionMode: 'replaceSelection',
                format: 'latex'
              }]);
            } else {
              controller.setLatexValue(cleanPasted);
            }
          } catch (_) {
            controller.setLatexValue(cleanPasted);
          }
          const casVal = controller.getCasValue();
          if (fallbackInput) fallbackInput.value = casVal;
          if (typeof options.onChange === 'function') {
            options.onChange(casVal, { source: 'paste-latex', latex: controller.getLatexValue() });
          }
        }
      });

      mfEl?.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && typeof enterHandler === 'function') {
          ev.preventDefault();
          enterHandler(controller.getCasValue());
        }
      });

      // Escuchar cambios en el input de respaldo
      fallbackInput?.addEventListener('input', () => {
        if (suppressInputEvent) return;
        const rawVal = fallbackInput.value;
        const casVal = /\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(rawVal)
          ? latexToCasString(rawVal)
          : rawVal;
        if (typeof options.onChange === 'function') {
          options.onChange(casVal, { source: 'fallback', latex: casStringToLatex(casVal) });
        }
      });

      fallbackInput?.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && typeof enterHandler === 'function') {
          ev.preventDefault();
          const rawVal = fallbackInput.value;
          const casVal = /\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(rawVal)
            ? latexToCasString(rawVal)
            : rawVal;
          enterHandler(casVal);
        }
      });
    }

    const controller = {
      get isVisualMode() {
        return isUpgraded && isMathLiveAvailable();
      },

      get element() {
        return this.isVisualMode ? mfEl : fallbackInput;
      },

      get mathFieldEl() {
        return mfEl;
      },

      get fallbackInput() {
        return fallbackInput;
      },

      getLatexValue() {
        if (this.isVisualMode && mfEl) {
          try {
            return typeof mfEl.getValue === 'function' ? mfEl.getValue('latex') : (mfEl.value || '');
          } catch (_) {
            return mfEl.value || '';
          }
        }
        return casStringToLatex(fallbackInput ? fallbackInput.value : '');
      },

      getLatex() {
        return this.getLatexValue();
      },

      getCasValue() {
        if (this.isVisualMode && mfEl) {
          const rawLatex = this.getLatexValue();
          return latexToCasString(rawLatex);
        }
        const rawFallback = fallbackInput ? fallbackInput.value : '';
        if (/\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(rawFallback)) {
          return latexToCasString(rawFallback);
        }
        return rawFallback;
      },

      setCasValue(casStr, opts = {}) {
        const rawStr = String(casStr ?? '');
        const isRawLatex = /\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(rawStr);
        const cleanCas = isRawLatex ? latexToCasString(rawStr) : rawStr;
        const targetLatex = isRawLatex ? rawStr.trim().replace(/^\$+|\$+$/g, '').trim() : casStringToLatex(cleanCas);
        suppressInputEvent = Boolean(opts.silent);

        if (fallbackInput) {
          fallbackInput.value = cleanCas;
        }

        if (this.isVisualMode && mfEl) {
          try {
            if (typeof mfEl.setValue === 'function') {
              mfEl.setValue(targetLatex, { suppressChangeNotifications: Boolean(opts.silent) });
            } else {
              mfEl.value = targetLatex;
            }
          } catch (_) {
            mfEl.value = targetLatex;
          }
        }

        suppressInputEvent = false;
        if (opts.focus) this.focus();
        if (!opts.silent && typeof options.onChange === 'function') {
          options.onChange(cleanCas, { source: 'setCasValue', latex: targetLatex });
        }
      },

      setLatexValue(latexStr, opts = {}) {
        const cleanLatex = String(latexStr ?? '');
        const casEquivalent = latexToCasString(cleanLatex);
        suppressInputEvent = Boolean(opts.silent);

        if (fallbackInput) {
          fallbackInput.value = casEquivalent;
        }

        if (this.isVisualMode && mfEl) {
          try {
            if (typeof mfEl.setValue === 'function') {
              mfEl.setValue(cleanLatex, { suppressChangeNotifications: Boolean(opts.silent) });
            } else {
              mfEl.value = cleanLatex;
            }
          } catch (_) {
            mfEl.value = cleanLatex;
          }
        }

        suppressInputEvent = false;
        if (opts.focus) this.focus();
        if (!opts.silent && typeof options.onChange === 'function') {
          options.onChange(casEquivalent, { source: 'setLatexValue', latex: cleanLatex });
        }
      },

      insertTemplate(arg1, arg2, arg3) {
        let latexTemplate = '';
        let fallbackSnippet = '';
        let fallbackOffset;

        if (arg1 && typeof arg1 === 'object') {
          latexTemplate = arg1.latexTemplate || '';
          fallbackSnippet = arg1.fallbackSnippet || '';
          fallbackOffset = arg1.cursorOffset;
        } else {
          latexTemplate = arg1 || '';
          fallbackSnippet = arg2 || '';
          fallbackOffset = arg3;
        }

        if (this.isVisualMode && mfEl) {
          mfEl.focus();
          let tpl = String(latexTemplate || '').replace(/\\placeholder\{\}/g, '#?');
          // Si el usuario ya escribió una base (ej. x o X) y pulsa el botón de potencia x^2, x^3 o x^n,
          // anexar directamente el superíndice a esa base sin crear un recuadro vacío intermedio
          if (/^\{\#\?\}\^/.test(tpl)) {
            const currentLatex = this.getLatexValue().trim();
            if (/[a-zA-Z0-9\)]$/.test(currentLatex)) {
              tpl = tpl.replace(/^\{\#\?\}/, '');
            }
          }
          try {
            if (typeof mfEl.executeCommand === 'function') {
              mfEl.executeCommand(['insert', tpl, {
                insertionMode: 'replaceSelection',
                selectionMode: 'placeholder'
              }]);
            } else if (typeof mfEl.insert === 'function') {
              mfEl.insert(tpl, {
                insertionMode: 'replaceSelection',
                selectionMode: 'placeholder'
              });
            }
          } catch (_) {
            mfEl.value = (mfEl.value || '') + tpl.replace(/#\?/g, '');
          }
          const casVal = this.getCasValue();
          if (fallbackInput) fallbackInput.value = casVal;
          if (typeof options.onChange === 'function') {
            options.onChange(casVal, { source: 'visual-keyboard', latex: this.getLatexValue() });
          }
          return;
        }

        if (fallbackInput) {
          insertIntoFallbackInput(fallbackInput, fallbackSnippet || latexToCasString(latexTemplate), fallbackOffset);
        }
      },

      backspace() {
        if (this.isVisualMode && mfEl) {
          mfEl.focus();
          try {
            mfEl.executeCommand('deleteBackward');
          } catch (_) {}
          const casVal = this.getCasValue();
          if (fallbackInput) fallbackInput.value = casVal;
          if (typeof options.onChange === 'function') {
            options.onChange(casVal, { source: 'visual-keyboard', latex: this.getLatexValue() });
          }
          return;
        }
        if (fallbackInput) {
          const start = fallbackInput.selectionStart || 0;
          const end = fallbackInput.selectionEnd || 0;
          if (start !== end) {
            fallbackInput.value = fallbackInput.value.slice(0, start) + fallbackInput.value.slice(end);
            fallbackInput.setSelectionRange(start, start);
          } else if (start > 0) {
            fallbackInput.value = fallbackInput.value.slice(0, start - 1) + fallbackInput.value.slice(end);
            fallbackInput.setSelectionRange(start - 1, start - 1);
          }
          fallbackInput.focus();
          fallbackInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      },

      moveCursor(dir) {
        if (this.isVisualMode && mfEl) {
          mfEl.focus();
          try {
            mfEl.executeCommand(dir === 'left' ? 'moveToPreviousChar' : 'moveToNextChar');
          } catch (_) {}
          return;
        }
        if (fallbackInput) {
          const pos = fallbackInput.selectionStart || 0;
          const next = dir === 'left' ? Math.max(0, pos - 1) : Math.min(fallbackInput.value.length, pos + 1);
          fallbackInput.focus();
          fallbackInput.setSelectionRange(next, next);
        }
      },

      clear() {
        this.setCasValue('', { focus: true });
      },

      focus() {
        if (this.isVisualMode && mfEl) {
          mfEl.focus();
        } else if (fallbackInput) {
          fallbackInput.focus();
        }
      }
    };

    setupDOM();
    return controller;
  }

  ns.MathInput = {
    SIX_KEYBOARD_CATEGORIES,
    latexToCasString,
    casStringToLatex,
    isMathLiveAvailable,
    createMathFieldController,
    renderVisualKeyboard,
    executeKeyOnController
  };
})(window.MatInteractiva);
