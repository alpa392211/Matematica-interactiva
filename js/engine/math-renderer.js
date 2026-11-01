/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Motor Definitivo de Representación Matemática
   Archivo: js/engine/math-renderer.js
   Soporta:
   1. Renderizado profesional con KaTeX (si está disponible en ventana).
   2. Parser recursivo de llaves balanceadas para LaTeX completo (fracciones
      anidadas, raíces con índice, límites, integrales, sumatorias, matrices,
      sistemas por casos, \text, \mathbb, \quad, \left, \right, etc.) sin dejar
      jamás comandos LaTeX crudos en pantalla.
   3. Conversor de expresiones algebraicas de entrada a LaTeX tipográfico
      para previsualización instantánea en el editor y en ejercicios.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Extrae el contenido de un grupo entre llaves balanceadas { ... }
   * empezando en el índice `startIdx` (donde str[startIdx] === '{').
   * Retorna { content: string, endIdx: number } o null si no está balanceado.
   */
  function extractBracedGroup(str, startIdx) {
    let i = startIdx;
    while (i < str.length && str[i] === ' ') i++;
    if (i >= str.length || str[i] !== '{') return null;

    let depth = 0;
    let contentStart = i + 1;
    for (; i < str.length; i++) {
      if (str[i] === '\\' && i + 1 < str.length) {
        i++; // saltar carácter escapado
        continue;
      }
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) {
          return {
            content: str.slice(contentStart, i),
            endIdx: i + 1
          };
        }
      }
    }
    // Si faltó cerrar llave al final, tomar hasta el final de la cadena
    return {
      content: str.slice(contentStart),
      endIdx: str.length
    };
  }

  /**
   * Extrae un grupo opcional entre corchetes [ ... ] comenzando en startIdx.
   */
  function extractBracketGroup(str, startIdx) {
    let i = startIdx;
    while (i < str.length && str[i] === ' ') i++;
    if (i >= str.length || str[i] !== '[') return null;

    let depth = 0;
    let contentStart = i + 1;
    for (; i < str.length; i++) {
      if (str[i] === '[') depth++;
      else if (str[i] === ']') {
        depth--;
        if (depth === 0) {
          return {
            content: str.slice(contentStart, i),
            endIdx: i + 1
          };
        }
      }
    }
    return null;
  }

  /**
   * Extrae un grupo entre paréntesis ( ... ) comenzando en startIdx.
   */
  function extractParenGroup(str, startIdx) {
    let i = startIdx;
    while (i < str.length && str[i] === ' ') i++;
    if (i >= str.length || str[i] !== '(') return null;

    let depth = 0;
    let contentStart = i + 1;
    for (; i < str.length; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') {
        depth--;
        if (depth === 0) {
          return {
            content: str.slice(contentStart, i),
            endIdx: i + 1
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
   * Extrae un argumento de subíndice o superíndice (puede ser {grupo} o un solo token/carácter).
   */
  function extractScriptArg(str, startIdx) {
    let i = startIdx;
    while (i < str.length && str[i] === ' ') i++;
    if (i >= str.length) return { content: '\\square', endIdx: i };
    if (str[i] === '{') {
      const grp = extractBracedGroup(str, i);
      if (grp && !grp.content.trim()) {
        return { content: '\\square', endIdx: grp.endIdx };
      }
      return grp;
    }
    if (str[i] === '(') {
      const grp = extractParenGroup(str, i);
      if (grp) {
        return { content: grp.content.trim() || '\\square', endIdx: grp.endIdx };
      }
    }
    // Si es un comando como \infty o \pi
    if (str[i] === '\\') {
      const m = str.slice(i).match(/^\\[a-zA-Z]+/);
      if (m) {
        return { content: m[0], endIdx: i + m[0].length };
      }
    }
    // Secuencia corta de dígitos/letras o signo seguido de dígito
    const tokMatch = str.slice(i).match(/^([+-]?[a-zA-Z0-9']+)/);
    if (tokMatch) {
      return { content: tokMatch[1], endIdx: i + tokMatch[1].length };
    }
    return { content: str[i], endIdx: i + 1 };
  }

  /**
   * Divide los argumentos de una función `fn(arg1, arg2, ...)` en el nivel superior de paréntesis.
   */
  function splitTopLevelArgs(innerStr) {
    const args = [];
    let depth = 0;
    let current = '';
    for (let i = 0; i < innerStr.length; i++) {
      const ch = innerStr[i];
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);

      if (ch === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    args.push(current.trim());
    return args;
  }

  /**
   * Reemplaza llamadas a funciones con paréntesis balanceados `fnName(...)`
   * utilizando un transformador `(fnNameLower, argsArray, rawInner) => string`.
   */
  function replaceBalancedFunctionCalls(str, fnNames, transformer) {
    const pattern = new RegExp(`\\b(${fnNames.join('|')})\\s*\\(`, 'gi');
    let result = '';
    let lastIdx = 0;
    let match;

    while ((match = pattern.exec(str)) !== null) {
      const startCall = match.index;
      const fnName = match[1];
      const openParenIdx = pattern.lastIndex - 1;
      const grp = extractParenGroup(str, openParenIdx);
      if (!grp) continue;

      result += str.slice(lastIdx, startCall);
      const args = splitTopLevelArgs(grp.content);
      result += transformer(fnName.toLowerCase(), args, grp.content);
      lastIdx = grp.endIdx;
      pattern.lastIndex = grp.endIdx;
    }

    result += str.slice(lastIdx);
    return result;
  }

  /**
   * Convierte fracciones con paréntesis posiblemente anidados `(numerador)/(denominador)`
   * o `(numerador)/denominadorSimple` a `\frac{numerador}{denominador}`.
   */
  function convertBalancedParenFractions(str) {
    let s = str;
    for (let pass = 0; pass < 4; pass++) {
      let changed = false;
      for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
          const leftGrp = extractParenGroup(s, i);
          if (!leftGrp) continue;
          let k = leftGrp.endIdx;
          while (k < s.length && s[k] === ' ') k++;
          if (k < s.length && s[k] === '/') {
            k++;
            while (k < s.length && s[k] === ' ') k++;
            if (k < s.length && s[k] === '(') {
              const rightGrp = extractParenGroup(s, k);
              if (rightGrp) {
                const numContent = leftGrp.content.trim() || '\\square';
                const denContent = rightGrp.content.trim() || '\\square';
                s = s.slice(0, i) + `\\frac{${numContent}}{${denContent}}` + s.slice(rightGrp.endIdx);
                changed = true;
                break;
              }
            } else {
              const simpleDenMatch = s.slice(k).match(/^(\\square|[a-zA-Z0-9_.^]+)/);
              if (simpleDenMatch) {
                const numContent = leftGrp.content.trim() || '\\square';
                const denContent = simpleDenMatch[1] || '\\square';
                s = s.slice(0, i) + `\\frac{${numContent}}{${denContent}}` + s.slice(k + simpleDenMatch[0].length);
                changed = true;
                break;
              } else if (k >= s.length) {
                const numContent = leftGrp.content.trim() || '\\square';
                s = s.slice(0, i) + `\\frac{${numContent}}{\\square}`;
                changed = true;
                break;
              }
            }
          }
        }
      }
      if (!changed) break;
    }
    return s;
  }

  /**
   * Detecta si una expresión escrita por el estudiante está incompleta mientras escribe
   * (paréntesis o llaves sin cerrar, operadores al final, argumentos vacíos `()`)
   * y devuelve metadatos amigables sin errores técnicos.
   */
  function inspectExpressionCompleteness(rawInput) {
    const s = String(rawInput || '').trim();
    if (!s) {
      return {
        isIncomplete: false,
        isEmpty: true,
        reason: 'Escribe una expresión o selecciona un botón de la barra superior para comenzar.'
      };
    }

    const reasons = [];

    let parenDepth = 0;
    let braceDepth = 0;
    let bracketDepth = 0;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '\\' && i + 1 < s.length) {
        i++;
        continue;
      }
      if (ch === '(') parenDepth++;
      else if (ch === ')') parenDepth--;
      else if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
      else if (ch === '[') bracketDepth++;
      else if (ch === ']') bracketDepth--;
    }

    if (parenDepth > 0) {
      reasons.push(`Falta cerrar ${parenDepth === 1 ? 'un paréntesis )' : `${parenDepth} paréntesis )`}`);
    } else if (parenDepth < 0) {
      reasons.push('Hay un paréntesis de cierre ) adicional');
    }

    if (braceDepth !== 0) {
      reasons.push('Falta completar un bloque { } de la estructura');
    }

    if (bracketDepth !== 0) {
      reasons.push('Falta cerrar un corchete [ ]');
    }

    const pipeCount = (s.replace(/\\\|/g, '').match(/\|/g) || []).length;
    if (pipeCount % 2 !== 0) {
      reasons.push('Falta cerrar la barra de valor absoluto |');
    }

    if (/\(\s*\)|\{\s*\}|\[\s*\]|□|\\square/.test(s) || /,\s*\)/.test(s) || /\(\s*,/.test(s)) {
      reasons.push('Completa los elementos pendientes marcados con □ en la vista previa');
    }

    if (/[+\-*/^=]\s*$/.test(s) || /->\s*$/.test(s) || /\\to\s*$/.test(s)) {
      reasons.push('Escribe el término o valor que va después del último signo u operador');
    }

    if (/^\s*\/|\/\s*(?=[+\-*/^=),]|$)/.test(s)) {
      reasons.push('Completa tanto el numerador como el denominador de la fracción');
    }

    return {
      isIncomplete: reasons.length > 0,
      isEmpty: false,
      reason: reasons[0] || ''
    };
  }

  /**
   * Clasifica automáticamente el tipo de expresión matemática introducida por el estudiante
   * entre las categorías pedagógicas del editor.
   */
  function classifyExpression(rawInput) {
    const s = String(rawInput || '').trim();
    if (!s) {
      return {
        id: 'vacio',
        badge: '✨ Listo para escribir',
        title: 'Sin expresión activa',
        description: 'Haz clic en un ejemplo interactivo o usa los botones de estructura para construir tu fórmula.'
      };
    }

    const lower = s.toLowerCase();

    // 1. Cálculo (Límite, Derivada o Integral)
    if (
      /\b(lim|limite|deriv|derivada|int|integral)\b/i.test(lower) ||
      /\\(lim|int|oint|sum|prod)\b/.test(s) ||
      /\bd\/dx\b|\bdy\/dx\b|\\frac\{d\}\{dx\}|\\frac\{dy\}\{dx\}|f'\s*\(/.test(s)
    ) {
      return {
        id: 'calculo',
        badge: '∫ Expresión de Cálculo',
        title: 'Límite, Derivada o Integral',
        description: 'Estructura de cálculo diferencial o integral. El laboratorio inferior calculará su valor o comportamiento.'
      };
    }

    // 2. Función (asignación tipo f(x) = ..., g(x) = ..., y = ...)
    if (/^([fghpuvFGHPUV]\s*\(\s*[a-zA-Z]\s*\)|y)\s*=/i.test(s)) {
      return {
        id: 'funcion',
        badge: '📈 Función Matemática',
        title: 'Regla de correspondencia f(x)',
        description: 'Asigna a cada valor de x un resultado f(x). Puedes evaluarla en cualquier punto, derivarla o enviarla al Graficador.'
      };
    }

    // 3. Ecuación (igualdad entre dos expresiones con incógnita)
    if (s.includes('=') && !/[<>!]=/.test(s)) {
      return {
        id: 'ecuacion',
        badge: '⚖️ Ecuación (Igualdad)',
        title: 'Igualdad entre dos expresiones para hallar una incógnita',
        description: 'Plantea que el miembro izquierdo es igual al derecho. El analizador buscará las soluciones reales de x.'
      };
    }

    // 4. ¿Contiene variables algebraicas (como x, y, t, a, b, n)?
    const withoutFunctions = lower
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/\b(sqrt|raiz|cbrt|root|sin|sen|cos|tan|tg|sec|csc|cot|asin|arcsen|acos|arccos|atan|arctan|ln|log|exp|abs|pi|inf|infinito)\b/g, '');
    const hasVariables = /[a-df-zA-DF-Z]/.test(withoutFunctions);
    const hasFractionOrRadical =
      /\/|\\frac\b|\b(sqrt|raiz|cbrt|root)\b|\\sqrt\b|√/.test(s);

    // 5. Fracción o Radical destacado
    if (hasFractionOrRadical && hasVariables) {
      return {
        id: 'fraccion_radical',
        badge: '➗ Fracción o Radical',
        title: 'Estructura con numerador/denominador o raíz e índice',
        description: 'Combina divisiones estructuradas o radicales con variables. Verifica que el denominador no se haga cero.'
      };
    }

    // 6. Expresión algebraica general (polinomios, términos con variables sin signo =)
    if (hasVariables) {
      return {
        id: 'algebraica',
        badge: '🔤 Expresión Algebraica',
        title: 'Términos con variables y exponentes (sin signo =)',
        description: 'Polinomio o combinación algebraica general. Su resultado numérico depende del valor que asignes a la variable x.'
      };
    }

    // 7. Operación aritmética / numérica (con o sin fracciones/radicales numéricos)
    return {
      id: 'operacion',
      badge: '🔢 Operación Aritmética',
      title: 'Operación combinada con números',
      description: 'Cálculo numérico directo (sumas, productos, fracciones o raíces de números). Tiene un valor exacto inmediato.'
    };
  }

  /**
   * Convierte una expresión algebraica escrita por el estudiante (p. ej. "(x^2 - 4)/(x - 2)",
   * "raiz(3, x^2)", "lim((x^2-4)/(x-2), x->2)", "derivada(x^3 - 3x)", "integral(x^2, 0, 3)")
   * a sintaxis LaTeX limpia para su visualización en tiempo real.
   */
  function algebraicToLatex(input) {
    if (!input || !String(input).trim()) return '';
    let s = String(input).trim();

    // Reemplazar casillas vacías explícitas `□` por `\square`
    s = s.replace(/□/g, '\\square');

    // Si ya contiene comandos LaTeX explícitos (\frac, \int, \lim, \sqrt{, \sum),
    // igual sanitizamos llaves vacías `{}` u operadores al final para que nunca se rompa la vista previa.
    if (/\\(frac|dfrac|int|lim|sum|sqrt|left|right|begin|text|mathbb)/.test(s)) {
      s = s.replace(/\{\s*\}/g, '{\\square}');
      s = s.replace(/\[\s*\]/g, '[\\square]');
      s = s.replace(/([+\-*/^=])\s*$/, '$1 \\square');
      return s;
    }

    // 1. Estructuras naturales de Cálculo:
    // 1a. Límite natural: lim(f(x), x -> a) o limite(f(x), x -> a)
    s = replaceBalancedFunctionCalls(s, ['limite', 'lim'], (_fn, args) => {
      const exprPart = (args[0] && args[0].trim()) ? algebraicToLatex(args[0]) : '\\square';
      let targetPart = 'x \\to a';
      if (args.length >= 2 && args[1].trim()) {
        let rawTarget = args[1].trim()
          .replace(/->|→/g, ' \\to ')
          .replace(/\binfinito\b|\binf\b|∞/gi, '\\infty');
        if (!rawTarget.includes('\\to')) {
          rawTarget = `x \\to ${rawTarget}`;
        }
        targetPart = rawTarget;
      }
      return `\\lim_{${targetPart}} \\left(${exprPart}\\right)`;
    });

    // 1b. Derivada natural: derivada(f(x)) o deriv(f(x)) o d/dx(f(x))
    s = s.replace(/\bd\/dx\s*\(/gi, 'derivada(');
    s = replaceBalancedFunctionCalls(s, ['derivada', 'deriv'], (_fn, args) => {
      const exprPart = (args[0] && args[0].trim()) ? algebraicToLatex(args[0]) : '\\square';
      const varPart = (args[1] && args[1].trim()) ? args[1].trim() : 'x';
      return `\\frac{d}{d${varPart}}\\left[${exprPart}\\right]`;
    });

    // 1c. Integral natural: integral(f(x)) o integral(f(x), a, b) o int(...)
    s = replaceBalancedFunctionCalls(s, ['integral', 'int'], (_fn, args) => {
      const exprPart = (args[0] && args[0].trim()) ? algebraicToLatex(args[0]) : '\\square';
      if (args.length >= 3) {
        const low = args[1].trim() ? algebraicToLatex(args[1].trim()) : '\\square';
        const high = args[2].trim() ? algebraicToLatex(args[2].trim()) : '\\square';
        const diffVar = (args[3] && args[3].trim()) ? args[3].trim() : 'x';
        return `\\int_{${low}}^{${high}} \\left(${exprPart}\\right)\\,d${diffVar}`;
      }
      const diffVar = (args.length === 2 && args[1].trim()) ? args[1].trim() : 'x';
      return `\\int \\left(${exprPart}\\right)\\,d${diffVar}`;
    });

    // 2. Raíces cuadradas, cúbicas y n-ésimas con paréntesis balanceados:
    // raiz(n, x) o root(n, x) -> \sqrt[n]{x}
    // sqrt(x) o raiz(x) -> \sqrt{x}
    s = replaceBalancedFunctionCalls(s, ['root', 'raiz', 'sqrt', 'cbrt'], (fn, args) => {
      if (fn === 'cbrt') {
        const rad = (args[0] && args[0].trim()) ? algebraicToLatex(args[0]) : '\\square';
        return `\\sqrt[3]{${rad}}`;
      }
      if (args.length >= 2) {
        const idx = args[0].trim() ? algebraicToLatex(args[0]) : '\\square';
        const rad = args[1].trim() ? algebraicToLatex(args[1]) : '\\square';
        return `\\sqrt[${idx}]{${rad}}`;
      }
      const rad = (args[0] && args[0].trim()) ? algebraicToLatex(args[0]) : '\\square';
      return `\\sqrt{${rad}}`;
    });

    // 3. Valor absoluto: abs(x) y |x|
    s = replaceBalancedFunctionCalls(s, ['abs'], (_fn, args) => {
      const inner = (args[0] && args[0].trim()) ? algebraicToLatex(args[0]) : '\\square';
      return `\\left|${inner}\\right|`;
    });
    s = s.replace(/\|([^|]+)\|/g, (_m, inner) => {
      return `\\left|${inner.trim() || '\\square'}\\right|`;
    });
    if ((s.match(/\|/g) || []).length === 1) {
      s = s.replace(/\|(.*)$/, (_m, rest) => `\\left|${rest.trim() || '\\square'}\\right|`);
    }

    // 4. Paréntesis vacíos `()` -> `(\square)`
    s = s.replace(/\(\s*\)/g, '(\\square)');

    // 5. Fracciones con paréntesis balanceados (incluso anidados): (num)/(den) o (num)/den
    s = convertBalancedParenFractions(s);

    // 6. Fracción donde el denominador está entre paréntesis: num/(den)
    s = s.replace(/(\\square|[a-zA-Z0-9.^]+)\s*\/\s*\(([^()]+)\)/g, (_m, num, den) => {
      return `\\frac{${num.trim() || '\\square'}}{${den.trim() || '\\square'}}`;
    });

    // 7. Fracción simple a/b y fracción con denominador pendiente `a/`
    s = s.replace(/\b([a-zA-Z0-9^]+)\s*\/\s*([a-zA-Z0-9^]+)\b/g, '\\frac{$1}{$2}');
    s = s.replace(/\b([a-zA-Z0-9^]+)\s*\/\s*$/g, '\\frac{$1}{\\square}');

    // 8. Exponentes con paréntesis: ^(exp) -> ^{exp} y exponente pendiente `^` -> `^{\square}`
    s = s.replace(/\^\s*\(([^()]*)\)/g, (_m, exp) => `^{${exp.trim() || '\\square'}}`);
    s = s.replace(/\^\s*$/g, '^{\\square}');

    // 9. Funciones trigonométricas, logarítmicas y constantes
    s = s
      .replace(/\barcsen\b/gi, '\\operatorname{arcsen}')
      .replace(/\basin\b/gi, '\\operatorname{arcsen}')
      .replace(/\barccos\b/gi, '\\arccos')
      .replace(/\bacos\b/gi, '\\arccos')
      .replace(/\barctg\b/gi, '\\operatorname{arctg}')
      .replace(/\batan\b/gi, '\\arctan')
      .replace(/\bsen\b/gi, '\\operatorname{sen}')
      .replace(/\bsin\b/gi, '\\operatorname{sen}')
      .replace(/\bcos\b/gi, '\\cos')
      .replace(/\btan\b/gi, '\\tan')
      .replace(/\btg\b/gi, '\\tan')
      .replace(/\bsec\b/gi, '\\sec')
      .replace(/\bcsc\b/gi, '\\csc')
      .replace(/\bcot\b/gi, '\\cot')
      .replace(/\bln\b/gi, '\\ln')
      .replace(/\blog\b/gi, '\\log')
      .replace(/\bpi\b/gi, '\\pi')
      .replace(/\binf(inito)?\b/gi, '\\infty')
      .replace(/->|→/g, ' \\to ')
      .replace(/<=/g, ' \\leq ')
      .replace(/>=/g, ' \\geq ')
      .replace(/!=/g, ' \\neq ')
      .replace(/\+-/g, ' \\pm ');

    // 10. Producto asterisco:
    // Entre número y variable (2*x -> 2x), entre dos números o paréntesis (* -> \cdot)
    s = s.replace(/(\d)\s*\*\s*([a-zA-Z\\(])/g, '$1$2');
    s = s.replace(/\*/g, ' \\cdot ');

    // 11. Si la expresión termina en un operador binario suelto (+, -, \cdot, =), mostrar casilla pendiente \square
    s = s.replace(/(\\cdot|[+\-=])\s*$/, '$1 \\square');

    // 12. Balancear paréntesis abiertos mientras el estudiante escribe
    let openParens = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') openParens++;
      else if (s[i] === ')') openParens = Math.max(0, openParens - 1);
    }
    if (openParens > 0) {
      s += ')'.repeat(openParens);
    }

    return s;
  }

  /**
   * Normaliza comandos LaTeX para máxima compatibilidad tanto con KaTeX
   * como con el motor recursivo nativo.
   */
  function normalizeLatexInput(expr) {
    if (expr === null || expr === undefined) return '';
    let s = String(expr).trim();

    // Asegurar que \text{sen} o \operatorname{sen} estén bien formados
    s = s
      .replace(/\\iff\b/g, '\\Longleftrightarrow')
      .replace(/\\implies\b/g, '\\Rightarrow')
      .replace(/\\to\b/g, '\\rightarrow');

    return s;
  }

  /**
   * Diccionario completo de símbolos y macros simples de LaTeX para el motor nativo
   */
  const LATEX_SYMBOLS = {
    '\\pi': 'π',
    '\\theta': 'θ',
    '\\vartheta': 'ϑ',
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\delta': 'δ',
    '\\epsilon': 'ε',
    '\\varepsilon': 'ε',
    '\\zeta': 'ζ',
    '\\eta': 'η',
    '\\lambda': 'λ',
    '\\mu': 'μ',
    '\\nu': 'ν',
    '\\xi': 'ξ',
    '\\rho': 'ρ',
    '\\sigma': 'σ',
    '\\tau': 'τ',
    '\\phi': 'φ',
    '\\varphi': 'φ',
    '\\chi': 'χ',
    '\\psi': 'ψ',
    '\\omega': 'ω',
    '\\Gamma': 'Γ',
    '\\Delta': 'Δ',
    '\\Theta': 'Θ',
    '\\Lambda': 'Λ',
    '\\Sigma': 'Σ',
    '\\Phi': 'Φ',
    '\\Psi': 'Ψ',
    '\\Omega': 'Ω',
    '\\infty': '∞',
    '\\pm': '±',
    '\\mp': '∓',
    '\\cdot': '·',
    '\\times': '×',
    '\\div': '÷',
    '\\leq': '≤',
    '\\le': '≤',
    '\\geq': '≥',
    '\\ge': '≥',
    '\\neq': '≠',
    '\\ne': '≠',
    '\\approx': '≈',
    '\\equiv': '≡',
    '\\cong': '≅',
    '\\sim': '∼',
    '\\propto': '∝',
    '\\rightarrow': '→',
    '\\to': '→',
    '\\leftarrow': '←',
    '\\leftrightarrow': '↔',
    '\\Rightarrow': '⇒',
    '\\Leftarrow': '⇐',
    '\\Leftrightarrow': '⇔',
    '\\Longleftrightarrow': '⟺',
    '\\iff': '⟺',
    '\\mapsto': '↦',
    '\\partial': '∂',
    '\\nabla': '∇',
    '\\forall': '∀',
    '\\exists': '∃',
    '\\nexists': '∄',
    '\\in': '∈',
    '\\notin': '∉',
    '\\subset': '⊂',
    '\\subseteq': '⊆',
    '\\cup': '∪',
    '\\cap': '∩',
    '\\emptyset': '∅',
    '\\varnothing': '∅',
    '\\dots': '…',
    '\\ldots': '…',
    '\\cdots': '⋯',
    '\\vdots': '⋮',
    '\\checkmark': '✓',
    '\\circ': '∘',
    '\\degree': '°',
    '\\angle': '∠',
    '\\perp': '⊥',
    '\\parallel': '∥',
    '\\triangle': '△',
    '\\square': '<span class="m-placeholder" title="Elemento pendiente por completar">□</span>',
    '\\placeholder': '<span class="m-placeholder" title="Elemento pendiente por completar">□</span>',
    '\\sin': '<span class="m-fn">sen</span>',
    '\\sen': '<span class="m-fn">sen</span>',
    '\\cos': '<span class="m-fn">cos</span>',
    '\\tan': '<span class="m-fn">tan</span>',
    '\\tg': '<span class="m-fn">tan</span>',
    '\\sec': '<span class="m-fn">sec</span>',
    '\\csc': '<span class="m-fn">csc</span>',
    '\\cot': '<span class="m-fn">cot</span>',
    '\\arcsin': '<span class="m-fn">arcsen</span>',
    '\\arcsen': '<span class="m-fn">arcsen</span>',
    '\\arccos': '<span class="m-fn">arccos</span>',
    '\\arctan': '<span class="m-fn">arctan</span>',
    '\\ln': '<span class="m-fn">ln</span>',
    '\\log': '<span class="m-fn">log</span>',
    '\\exp': '<span class="m-fn">exp</span>',
    '\\max': '<span class="m-fn">máx</span>',
    '\\min': '<span class="m-fn">mín</span>',
    '\\quad': '<span class="m-space-quad"></span>',
    '\\qquad': '<span class="m-space-qquad"></span>',
    '\\,': '<span class="m-space-thin"></span>',
    '\\;': '<span class="m-space-med"></span>',
    '\\:': '<span class="m-space-med"></span>',
    '\\!': ''
  };

  const BLACKBOARD_MAP = {
    N: 'ℕ',
    Z: 'ℤ',
    Q: 'ℚ',
    R: 'ℝ',
    C: 'ℂ',
    I: '𝕀'
  };

  /**
   * Renderizador recursivo de LaTeX a HTML con soporte completo de estructuras
   * anidadas y llaves balanceadas. Garantiza que jamás queden comandos \crudos.
   */
  function parseLatexRecursive(src) {
    if (!src) return '';
    let s = String(src);

    // 1. Procesar entornos \begin{cases}...\end{cases} y \begin{pmatrix}...\end{pmatrix}
    s = s.replace(/\\begin\{(cases|pmatrix|bmatrix|matrix)\}([\s\S]*?)\\end\{\1\}/g, function (_, env, body) {
      const rows = body.trim().split(/\\\\/).map(r => r.trim()).filter(Boolean);
      const rowsHtml = rows.map(row => {
        const cols = row.split('&').map(c => `<span class="m-matrix-cell">${parseLatexRecursive(c.trim())}</span>`).join('');
        return `<div class="m-matrix-row">${cols}</div>`;
      }).join('');

      if (env === 'cases') {
        return `<span class="m-cases"><span class="m-cases-brace">{</span><span class="m-matrix-body">${rowsHtml}</span></span>`;
      }
      const leftDelim = env === 'bmatrix' ? '[' : env === 'pmatrix' ? '(' : '';
      const rightDelim = env === 'bmatrix' ? ']' : env === 'pmatrix' ? ')' : '';
      return `<span class="m-matrix"><span class="m-delim">${leftDelim}</span><span class="m-matrix-body">${rowsHtml}</span><span class="m-delim">${rightDelim}</span></span>`;
    });

    // 2. Recorrido carácter por carácter con soporte de llaves balanceadas
    let out = '';
    let i = 0;

    while (i < s.length) {
      const ch = s[i];

      // Comandos que inician con barra invertida \
      if (ch === '\\') {
        // Espacios o caracteres escapados de 1 símbolo: \, \; \: \! \{ \} \%
        const nextCh = s[i + 1] || '';
        if (',;:! '.includes(nextCh)) {
          const symKey = '\\' + (nextCh === ' ' ? ',' : nextCh);
          out += LATEX_SYMBOLS[symKey] !== undefined ? LATEX_SYMBOLS[symKey] : ' ';
          i += 2;
          continue;
        }
        if ('{}%&#_'.includes(nextCh)) {
          out += escapeHtml(nextCh);
          i += 2;
          continue;
        }

        // Leer nombre del comando alfabético
        const cmdMatch = s.slice(i).match(/^\\([a-zA-Z]+)/);
        if (!cmdMatch) {
          i++;
          continue;
        }
        const fullCmd = cmdMatch[0];
        const cmdName = cmdMatch[1];
        i += fullCmd.length;

        // 2a. \frac{num}{den} o \dfrac{num}{den} o \tfrac{num}{den}
        if (cmdName === 'frac' || cmdName === 'dfrac' || cmdName === 'tfrac') {
          const numGroup = extractBracedGroup(s, i);
          if (numGroup) {
            i = numGroup.endIdx;
            const denGroup = extractBracedGroup(s, i);
            if (denGroup) {
              i = denGroup.endIdx;
              const numContent = numGroup.content.trim() || '\\square';
              const denContent = denGroup.content.trim() || '\\square';
              out += `<span class="m-frac"><span class="m-num">${parseLatexRecursive(numContent)}</span><span class="m-den">${parseLatexRecursive(denContent)}</span></span>`;
              continue;
            }
          }
        }

        // 2b. \sqrt[n]{arg} o \sqrt{arg}
        if (cmdName === 'sqrt') {
          const optIdx = extractBracketGroup(s, i);
          let indexHtml = '';
          if (optIdx) {
            i = optIdx.endIdx;
            const idxContent = optIdx.content.trim() || '\\square';
            indexHtml = `<sup class="m-sqrt-idx">${parseLatexRecursive(idxContent)}</sup>`;
          }
          const radGroup = extractBracedGroup(s, i);
          if (radGroup) {
            i = radGroup.endIdx;
            const radContent = radGroup.content.trim() || '\\square';
            out += `<span class="m-sqrt">${indexHtml}<span class="m-sqrt-sym">√</span><span class="m-sqrt-body">${parseLatexRecursive(radContent)}</span></span>`;
            continue;
          }
        }

        // 2c. \text{...}, \textbf{...}, \mathrm{...}, \operatorname{...}
        if (cmdName === 'text' || cmdName === 'textbf' || cmdName === 'mathrm' || cmdName === 'operatorname' || cmdName === 'mbox') {
          const txtGroup = extractBracedGroup(s, i);
          if (txtGroup) {
            i = txtGroup.endIdx;
            const cls = cmdName === 'textbf' ? 'm-text m-text-bold' : cmdName === 'operatorname' ? 'm-fn' : 'm-text';
            out += `<span class="${cls}">${escapeHtml(txtGroup.content)}</span>`;
            continue;
          }
        }

        // 2d. \mathbb{R}, \mathbb{N}, etc.
        if (cmdName === 'mathbb') {
          const bbGroup = extractBracedGroup(s, i);
          if (bbGroup) {
            i = bbGroup.endIdx;
            const letter = bbGroup.content.trim();
            out += `<span class="m-bb">${BLACKBOARD_MAP[letter] || escapeHtml(letter)}</span>`;
            continue;
          }
        }

        // 2e. \overline{...}, \bar{...}, \vec{...}, \hat{...}
        if (cmdName === 'overline' || cmdName === 'bar' || cmdName === 'vec' || cmdName === 'hat') {
          const g = extractBracedGroup(s, i);
          if (g) {
            i = g.endIdx;
            out += `<span class="m-overline">${parseLatexRecursive(g.content)}</span>`;
            continue;
          }
        }

        // 2f. \left y \right (delimitadores adaptativos)
        if (cmdName === 'left' || cmdName === 'right' || cmdName === 'big' || cmdName === 'Big' || cmdName === 'bigg' || cmdName === 'Bigg') {
          while (i < s.length && s[i] === ' ') i++;
          if (i < s.length) {
            if (s[i] === '.') {
              i++; // delimitador invisible \left. o \right.
            } else if (s[i] === '\\' && (s.slice(i, i + 2) === '\\{' || s.slice(i, i + 2) === '\\}' || s.slice(i, i + 2) === '\\|')) {
              const d = s[i + 1] === '|' ? '‖' : s[i + 1];
              out += `<span class="m-delim">${escapeHtml(d)}</span>`;
              i += 2;
            } else {
              out += `<span class="m-delim">${escapeHtml(s[i])}</span>`;
              i++;
            }
          }
          continue;
        }

        // 2g. Operadores grandes con límites: \lim, \int, \sum, \prod
        if (cmdName === 'lim' || cmdName === 'int' || cmdName === 'oint' || cmdName === 'sum' || cmdName === 'prod') {
          let subHtml = '';
          let supHtml = '';
          // Consumir posibles _ y ^ en cualquier orden
          for (let pass = 0; pass < 2; pass++) {
            while (i < s.length && s[i] === ' ') i++;
            if (i < s.length && s[i] === '_') {
              i++;
              const subArg = extractScriptArg(s, i);
              i = subArg.endIdx;
              subHtml = parseLatexRecursive(subArg.content);
            } else if (i < s.length && s[i] === '^') {
              i++;
              const supArg = extractScriptArg(s, i);
              i = supArg.endIdx;
              supHtml = parseLatexRecursive(supArg.content);
            }
          }

          if (cmdName === 'lim') {
            out += `<span class="m-lim"><span class="m-op-sym">lím</span>${subHtml ? `<span class="m-sub">${subHtml}</span>` : ''}</span>`;
          } else {
            const symChar = cmdName === 'int' ? '∫' : cmdName === 'oint' ? '∮' : cmdName === 'sum' ? '∑' : '∏';
            out += `<span class="m-int">${supHtml ? `<span class="m-sup">${supHtml}</span>` : ''}<span class="m-op-sym">${symChar}</span>${subHtml ? `<span class="m-sub">${subHtml}</span>` : ''}</span>`;
          }
          continue;
        }

        // 2h. Símbolo en tabla LATEX_SYMBOLS
        if (LATEX_SYMBOLS[fullCmd] !== undefined) {
          out += LATEX_SYMBOLS[fullCmd];
          continue;
        }

        // Si es cualquier otro comando desconocido, mostrar el nombre limpio sin barra invertida
        out += `<span class="m-fn">${escapeHtml(cmdName)}</span>`;
        continue;
      }

      // Exponentes ^
      if (ch === '^') {
        i++;
        const supArg = extractScriptArg(s, i);
        i = supArg.endIdx;
        out += `<sup>${parseLatexRecursive(supArg.content)}</sup>`;
        continue;
      }

      // Subíndices _
      if (ch === '_') {
        i++;
        const subArg = extractScriptArg(s, i);
        i = subArg.endIdx;
        out += `<sub>${parseLatexRecursive(subArg.content)}</sub>`;
        continue;
      }

      // Llaves de agrupación { ... } sueltas
      if (ch === '{') {
        const grp = extractBracedGroup(s, i);
        if (grp) {
          i = grp.endIdx;
          out += parseLatexRecursive(grp.content);
          continue;
        }
        i++;
        continue;
      }
      if (ch === '}') {
        i++;
        continue;
      }

      // Casilla pendiente explícita □
      if (ch === '□') {
        out += LATEX_SYMBOLS['\\square'];
        i++;
        continue;
      }

      // Funciones escritas tipo sqrt(...) o raiz(...) en modo mixto
      if ((s.slice(i, i + 5).toLowerCase() === 'sqrt(' || s.slice(i, i + 5).toLowerCase() === 'raiz(')) {
        const openIdx = i + 4;
        const grp = extractParenGroup(s, openIdx);
        if (grp) {
          const args = splitTopLevelArgs(grp.content);
          if (args.length >= 2) {
            const idxHtml = parseLatexRecursive(args[0].trim() || '\\square');
            const radHtml = parseLatexRecursive(args[1].trim() || '\\square');
            out += `<span class="m-sqrt"><sup class="m-sqrt-idx">${idxHtml}</sup><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">${radHtml}</span></span>`;
          } else {
            const inner = (args[0] && args[0].trim()) || '\\square';
            out += `<span class="m-sqrt"><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">${parseLatexRecursive(inner)}</span></span>`;
          }
          i = grp.endIdx;
          continue;
        }
      }

      // Reemplazo estético de signos menos y multiplicación
      if (ch === '*') {
        out += '·';
        i++;
        continue;
      }

      out += escapeHtml(ch);
      i++;
    }

    return out;
  }

  /**
   * Renderiza una expresión matemática a HTML tipográfico profesional.
   * Utiliza KaTeX si está disponible en `window.katex` y la expresión no contiene
   * marcadores interactivos `\square`, o el motor recursivo completo `parseLatexRecursive`.
   */
  function renderMath(expr, displayMode = false) {
    if (expr === null || expr === undefined) return '';
    const raw = String(expr).trim();
    if (!raw) return '';

    const normalized = normalizeLatexInput(raw);

    // 1. Intentar con KaTeX si está cargado en el navegador y no hay placeholders \square
    if (window.katex && typeof window.katex.renderToString === 'function' && !normalized.includes('\\square')) {
      try {
        return window.katex.renderToString(normalized, {
          displayMode: Boolean(displayMode),
          throwOnError: true,
          strict: false,
          trust: true
        });
      } catch (_) {
        // Si alguna expresión híbrida falla en KaTeX, continuar al motor recursivo nativo
      }
    }

    // 2. Motor recursivo nativo de llaves balanceadas (100% libre de comandos crudos y con soporte de \square)
    return `<span class="m-rendered ${displayMode ? 'm-display' : ''}">${parseLatexRecursive(normalized)}</span>`;
  }

  /**
   * Renderiza una expresión escrita por el usuario (algebraica o LaTeX)
   * convirtiéndola primero a LaTeX estructurado si está en formato algebraico.
   */
  function renderUserExpression(userInput, displayMode = false) {
    if (!userInput || !String(userInput).trim()) return '';
    const latex = algebraicToLatex(userInput);
    return renderMath(latex, displayMode);
  }

  /**
   * Renderiza la vista previa en tiempo real del Editor de Expresiones,
   * devolviendo el HTML renderizado, el LaTeX equivalente, el diagnóstico de
   * si la expresión está aún en construcción (`isIncomplete`) y su clasificación pedagógica.
   */
  function renderEditorPreview(userInput, displayMode = true) {
    const completeness = inspectExpressionCompleteness(userInput);
    const classification = classifyExpression(userInput);
    if (completeness.isEmpty) {
      return {
        html: '<span class="editor-empty-placeholder">Escribe una fórmula o haz clic en un ejemplo superior para ver su representación matemática aquí</span>',
        latex: '',
        isIncomplete: false,
        isEmpty: true,
        incompleteReason: completeness.reason,
        classification
      };
    }

    const latex = algebraicToLatex(userInput);
    const html = renderMath(latex, displayMode);
    return {
      html,
      latex,
      isIncomplete: completeness.isIncomplete,
      isEmpty: false,
      incompleteReason: completeness.reason,
      classification
    };
  }

  /**
   * Procesa un texto pedagógico reemplazando:
   * - $$...$$ por bloques matemáticos centrados (.math-block)
   * - $...$ por expresiones matemáticas en línea (.math-inline)
   * - **...** por negritas semánticas (<strong>...</strong>)
   * - `...` por código/expresión destacada (<code>...</code>)
   */
  function formatRichText(text) {
    if (text === null || text === undefined) return '';
    let out = String(text);

    // 1. Bloques matemáticos $$...$$
    out = out.replace(/\$\$([\s\S]+?)\$\$/g, function (_, mathContent) {
      return '<div class="math-block">' + renderMath(mathContent.trim(), true) + '</div>';
    });

    // 2. Expresiones matemáticas en línea $...$
    out = out.replace(/\$([^$\n]+?)\$/g, function (_, mathContent) {
      return '<span class="math-inline">' + renderMath(mathContent.trim(), false) + '</span>';
    });

    // 3. Negritas tipo Markdown **texto**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 4. Código en línea `expresión`
    out = out.replace(/`([^`]+)`/g, '<code class="math-code-chip">$1</code>');

    return out;
  }

  ns.MathRenderer = {
    renderMath,
    renderUserExpression,
    renderEditorPreview,
    classifyExpression,
    inspectExpressionCompleteness,
    algebraicToLatex,
    formatRichText,
    parseLatexRecursive
  };
})(window.MatInteractiva);
