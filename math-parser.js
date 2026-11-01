/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Motor Matemático Simbólico y Numérico
   Archivo: js/engine/math-parser.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  /**
   * Extrae un grupo entre paréntesis ( ... ) comenzando en startIdx.
   */
  function extractBalancedParens(str, startIdx) {
    let i = startIdx;
    while (i < str.length && str[i] === ' ') i++;
    if (i >= str.length || str[i] !== '(') return null;

    let depth = 0;
    const contentStart = i + 1;
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

  function splitArgsTopLevel(innerStr) {
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
   * Convierte estructuras LaTeX como \frac{A}{B}, \sqrt{A}, \sqrt[n]{A} y \left|A\right|
   * a sintaxis algebraica con paréntesis para que el evaluador acepte tanto entradas
   * algebraicas como LaTeX.
   */
  function convertLatexStructuresToAlgebraic(str) {
    let s = String(str);

    // Reemplazar \left| ... \right| por abs(...)
    s = s.replace(/\\left\s*\|\s*([\s\S]*?)\s*\\right\s*\|/g, 'abs($1)');
    // Reemplazar \left y \right
    s = s.replace(/\\left\s*/g, '').replace(/\\right\s*/g, '');
    s = s.replace(/\\operatorname\{([^{}]+)\}/g, '$1');
    s = s.replace(/\\text\{([^{}]+)\}/g, '$1');

    // Reemplazar \frac{num}{den} y \sqrt[n]{x} iterativamente (soporta anidamiento)
    for (let pass = 0; pass < 4; pass++) {
      s = s.replace(/\\d?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '(($1)/($2))');
      s = s.replace(/\\sqrt\s*\[3\]\s*\{([^{}]+)\}/g, 'cbrt($1)');
      s = s.replace(/\\sqrt\s*\[([^{}\]]+)\]\s*\{([^{}]+)\}/g, '(($2)^(1/($1)))');
      s = s.replace(/\\sqrt\s*\{([^{}]+)\}/g, 'sqrt($1)');
      s = s.replace(/\^\s*\{([^{}]+)\}/g, '^($1)');
    }

    s = s
      .replace(/\\cdot\b|\\times\b/g, '*')
      .replace(/\\div\b/g, '/')
      .replace(/\\pi\b/g, 'pi')
      .replace(/\\infty\b/g, 'inf')
      .replace(/\\sin\b|\\sen\b/g, 'sin')
      .replace(/\\cos\b/g, 'cos')
      .replace(/\\tan\b|\\tg\b/g, 'tan')
      .replace(/\\sec\b/g, 'sec')
      .replace(/\\csc\b/g, 'csc')
      .replace(/\\cot\b/g, 'cot')
      .replace(/\\ln\b/g, 'ln')
      .replace(/\\log\b/g, 'log');

    return s;
  }

  /**
   * Convierte llamadas de 2 argumentos `raiz(n, x)` o `root(n, x)` a `((x)^(1/(n)))`
   * manteniendo `raiz(x)` como `sqrt(x)`.
   */
  function convertNthRootCalls(str) {
    const pattern = /\b(raiz|root|sqrt)\s*\(/gi;
    let out = '';
    let lastIdx = 0;
    let match;

    while ((match = pattern.exec(str)) !== null) {
      const startCall = match.index;
      const openIdx = pattern.lastIndex - 1;
      const grp = extractBalancedParens(str, openIdx);
      if (!grp) continue;

      out += str.slice(lastIdx, startCall);
      const args = splitArgsTopLevel(grp.content);
      if (args.length >= 2) {
        const nArg = convertNthRootCalls(args[0]);
        const xArg = convertNthRootCalls(args[1]);
        if (nArg.trim() === '3') {
          out += `cbrt(${xArg})`;
        } else {
          out += `((${xArg})^(1/(${nArg})))`;
        }
      } else {
        const xArg = convertNthRootCalls(args[0] || '');
        out += `sqrt(${xArg})`;
      }
      lastIdx = grp.endIdx;
      pattern.lastIndex = grp.endIdx;
    }

    out += str.slice(lastIdx);
    return out;
  }

  /**
   * Normaliza una expresión escrita por el usuario (en español, LaTeX o notación estándar)
   * a una cadena matemática canónica lista para tokenizar.
   */
  function normalizeExpression(raw) {
    if (raw === null || raw === undefined) return '';
    let s = String(raw).trim();
    if (/\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(s) && ns.MathInput && typeof ns.MathInput.latexToCasString === 'function') {
      s = ns.MathInput.latexToCasString(s);
    }
    s = convertLatexStructuresToAlgebraic(s);

    // Normalizar variables independientes en mayúscula X -> x, Y -> y
    s = s
      .replace(/(^|[^\\a-zA-Z])X(?![a-zA-Z])/g, '$1x')
      .replace(/(^|[^\\a-zA-Z])Y(?![a-zA-Z])/g, '$1y');

    // Barras de valor absoluto |expr| -> abs(expr)
    s = s.replace(/\|([^|]+)\|/g, 'abs($1)');

    // Reemplazar símbolos Unicode comunes
    s = s
      .replace(/×|·/g, '*')
      .replace(/÷/g, '/')
      .replace(/−|–/g, '-')
      .replace(/π/gi, 'pi')
      .replace(/√\s*\(/g, 'sqrt(')
      .replace(/√\s*([a-zA-Z0-9.]+)/g, 'sqrt($1)')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/⁴/g, '^4')
      .replace(/⁵/g, '^5');

    // Convertir raíces con índice raiz(n, x) o root(n, x)
    s = convertNthRootCalls(s);

    // Traducir nombres de funciones en español a identificadores internos
    s = s
      .replace(/\barcsen\b/gi, 'asin')
      .replace(/\barccos\b/gi, 'acos')
      .replace(/\barctg\b/gi, 'atan')
      .replace(/\barctan\b/gi, 'atan')
      .replace(/\bsen\b/gi, 'sin')
      .replace(/\btg\b/gi, 'tan')
      .replace(/\braiz\b/gi, 'sqrt')
      .replace(/\bln\b/gi, 'ln');

    // Multiplicación implícita:
    // 1) Número seguido de variable, función o paréntesis: 2x -> 2*x, 3(x+1) -> 3*(x+1)
    s = s.replace(/(\d+(\.\d+)?)\s*(?=[a-zA-Z(])/g, '$1*');
    // 2) Cierre de paréntesis seguido de número, variable, función o apertura de paréntesis: (x+1)(x-1) -> (x+1)*(x-1)
    s = s.replace(/\)\s*(?=[a-zA-Z0-9(])/g, ')*');
    // 3) Variable simple (x, y, t, a, b, pi, e) seguida de paréntesis o de otra variable simple
    s = s.replace(/\b(x|y|t|a|b|pi|e)\s*\(/g, '$1*(');
    s = s.replace(/\b(pi)\s*(?=[xytab])/gi, '$1*');
    s = s.replace(/\b(a|b)\s*(?=[xy])/g, '$1*');
    s = s.replace(/\b(x)\s*(?=[y])/g, '$1*');

    return s;
  }

  const FUNCTIONS = new Set([
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'sec', 'csc', 'cot',
    'sqrt', 'cbrt', 'abs', 'ln', 'log', 'exp', 'floor', 'ceil', 'round'
  ]);

  /**
   * Tokenizador de expresiones matemáticas
   */
  function tokenize(expr) {
    const s = normalizeExpression(expr);
    const tokens = [];
    let i = 0;

    while (i < s.length) {
      const ch = s[i];

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      if (/[0-9.]/.test(ch)) {
        let numStr = '';
        while (i < s.length && /[0-9.]/.test(s[i])) {
          numStr += s[i++];
        }
        const val = parseFloat(numStr);
        if (isNaN(val)) {
          throw new Error('Número inválido: ' + numStr);
        }
        tokens.push({ type: 'NUMBER', value: val });
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        let id = '';
        while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) {
          id += s[i++];
        }
        const lower = id.toLowerCase();
        if (FUNCTIONS.has(lower)) {
          tokens.push({ type: 'FUNC', value: lower });
        } else if (lower === 'pi') {
          tokens.push({ type: 'NUMBER', value: Math.PI });
        } else if (lower === 'e') {
          tokens.push({ type: 'NUMBER', value: Math.E });
        } else if (lower === 'inf' || lower === 'infinito') {
          tokens.push({ type: 'NUMBER', value: Infinity });
        } else {
          tokens.push({ type: 'VAR', value: lower });
        }
        continue;
      }

      if ('+-*/^!(),'.includes(ch)) {
        tokens.push({ type: 'OP', value: ch });
        i++;
        continue;
      }

      throw new Error('Carácter no reconocido: ' + ch);
    }

    return tokens;
  }

  function factorial(n) {
    if (n < 0) return NaN;
    if (Math.abs(n - Math.round(n)) < 1e-9) {
      const k = Math.round(n);
      if (k > 170) return Infinity;
      let res = 1;
      for (let i = 2; i <= k; i++) res *= i;
      return res;
    }
    return NaN;
  }

  function parseToAST(expr) {
    const tokens = tokenize(expr);
    let pos = 0;

    function peek() {
      return tokens[pos] || null;
    }

    function consume() {
      return tokens[pos++];
    }

    function parseAddSub() {
      let left = parseMulDiv();
      while (peek() && peek().type === 'OP' && (peek().value === '+' || peek().value === '-')) {
        const op = consume().value;
        const right = parseMulDiv();
        left = { type: 'BINARY', op, left, right };
      }
      return left;
    }

    function parseMulDiv() {
      let left = parseUnary();
      while (peek() && peek().type === 'OP' && (peek().value === '*' || peek().value === '/')) {
        const op = consume().value;
        const right = parseUnary();
        left = { type: 'BINARY', op, left, right };
      }
      return left;
    }

    function parseUnary() {
      if (peek() && peek().type === 'OP' && (peek().value === '+' || peek().value === '-')) {
        const op = consume().value;
        const arg = parseUnary();
        return op === '-' ? { type: 'UNARY', op: '-', arg } : arg;
      }
      return parsePower();
    }

    function parsePower() {
      let base = parsePostfix();
      if (peek() && peek().type === 'OP' && peek().value === '^') {
        consume();
        const exp = parseUnary();
        return { type: 'BINARY', op: '^', left: base, right: exp };
      }
      return base;
    }

    function parsePostfix() {
      let node = parsePrimary();
      while (peek() && peek().type === 'OP' && peek().value === '!') {
        consume();
        node = { type: 'POSTFIX', op: '!', arg: node };
      }
      return node;
    }

    function parsePrimary() {
      const tok = peek();
      if (!tok) {
        throw new Error('Expresión incompleta');
      }

      if (tok.type === 'NUMBER') {
        consume();
        return { type: 'NUMBER', value: tok.value };
      }

      if (tok.type === 'VAR') {
        consume();
        return { type: 'VAR', name: tok.value };
      }

      if (tok.type === 'FUNC') {
        const fnName = consume().value;
        if (!peek() || peek().value !== '(') {
          const arg = parseUnary();
          return { type: 'CALL', fn: fnName, arg };
        }
        consume(); // '('
        const arg = parseAddSub();
        if (!peek() || peek().value !== ')') {
          throw new Error('Falta cerrar paréntesis en ' + fnName);
        }
        consume(); // ')'
        return { type: 'CALL', fn: fnName, arg };
      }

      if (tok.type === 'OP' && tok.value === '(') {
        consume(); // '('
        const inside = parseAddSub();
        if (!peek() || peek().value !== ')') {
          throw new Error('Paréntesis sin cerrar');
        }
        consume(); // ')'
        return inside;
      }

      throw new Error('Token inesperado: ' + tok.value);
    }

    const ast = parseAddSub();
    if (pos < tokens.length) {
      throw new Error('Símbolo inesperado cerca de: ' + tokens[pos].value);
    }
    return ast;
  }

  function evalAST(node, vars = {}, angleMode = 'RAD') {
    const toRad = angleMode === 'DEG' ? (Math.PI / 180) : 1;
    const fromRad = angleMode === 'DEG' ? (180 / Math.PI) : 1;

    switch (node.type) {
      case 'NUMBER':
        return node.value;
      case 'VAR': {
        if (Object.prototype.hasOwnProperty.call(vars, node.name)) {
          return vars[node.name];
        }
        throw new Error('Variable no definida: ' + node.name);
      }
      case 'UNARY': {
        const v = evalAST(node.arg, vars, angleMode);
        return node.op === '-' ? -v : v;
      }
      case 'POSTFIX': {
        const v = evalAST(node.arg, vars, angleMode);
        if (node.op === '!') return factorial(v);
        return NaN;
      }
      case 'BINARY': {
        const l = evalAST(node.left, vars, angleMode);
        const r = evalAST(node.right, vars, angleMode);
        switch (node.op) {
          case '+': return l + r;
          case '-': return l - r;
          case '*': return l * r;
          case '/': return r === 0 ? NaN : l / r;
          case '^': return Math.pow(l, r);
          default: return NaN;
        }
      }
      case 'CALL': {
        const x = evalAST(node.arg, vars, angleMode);
        switch (node.fn) {
          case 'sin': return Math.sin(x * toRad);
          case 'cos': return Math.cos(x * toRad);
          case 'tan': return Math.tan(x * toRad);
          case 'sec': return 1 / Math.cos(x * toRad);
          case 'csc': return 1 / Math.sin(x * toRad);
          case 'cot': return 1 / Math.tan(x * toRad);
          case 'asin': return Math.asin(x) * fromRad;
          case 'acos': return Math.acos(x) * fromRad;
          case 'atan': return Math.atan(x) * fromRad;
          case 'sqrt': return x < 0 ? NaN : Math.sqrt(x);
          case 'cbrt': return Math.cbrt(x);
          case 'abs': return Math.abs(x);
          case 'ln': return x <= 0 ? NaN : Math.log(x);
          case 'log': return x <= 0 ? NaN : Math.log10(x);
          case 'exp': return Math.exp(x);
          case 'floor': return Math.floor(x);
          case 'ceil': return Math.ceil(x);
          case 'round': return Math.round(x);
          default: return NaN;
        }
      }
      default:
        return NaN;
    }
  }

  function evaluate(expr, vars = {}, angleMode = 'RAD') {
    const ast = parseToAST(expr);
    return evalAST(ast, vars, angleMode);
  }

  function compileFunction(expr, angleMode = 'RAD') {
    let targetExpr = String(expr ?? '').trim();
    if (/^(limite|lim|derivada|deriv|d\/dx|integral|int)\s*\(/i.test(targetExpr) || /\\lim\b/.test(targetExpr)) {
      const extracted = extractGrapherPayload(targetExpr);
      if (extracted && extracted.expr) {
        targetExpr = extracted.expr;
      }
    }
    const ast = parseToAST(targetExpr);
    return function (x, extraVars = {}) {
      try {
        return evalAST(ast, Object.assign({ x, c: 0 }, extraVars), angleMode);
      } catch (e) {
        return NaN;
      }
    };
  }

  function numericalDerivative(fn, x0, h = 1e-5) {
    const f1 = fn(x0 - 2 * h);
    const f2 = fn(x0 - h);
    const f3 = fn(x0 + h);
    const f4 = fn(x0 + 2 * h);
    if ([f1, f2, f3, f4].some(v => !isFinite(v))) {
      const a = fn(x0 + h);
      const b = fn(x0 - h);
      return (a - b) / (2 * h);
    }
    return (f1 - 8 * f2 + 8 * f3 - f4) / (12 * h);
  }

  function numericalIntegral(fn, a, b, n = 200) {
    if (a === b) return 0;
    const sign = a > b ? -1 : 1;
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    const steps = n % 2 === 0 ? n : n + 1;
    const h = (high - low) / steps;

    let sum = 0;
    for (let i = 0; i <= steps; i++) {
      const x = low + i * h;
      let y = fn(x);
      if (!isFinite(y)) {
        y = fn(x + 1e-7);
        if (!isFinite(y)) y = 0;
      }
      const weight = (i === 0 || i === steps) ? 1 : (i % 2 === 1 ? 4 : 2);
      sum += weight * y;
    }
    return sign * (h / 3) * sum;
  }

  function findRoots(fn, xMin = -10, xMax = 10, subdivisions = 250) {
    const roots = [];
    const step = (xMax - xMin) / subdivisions;

    for (let i = 0; i < subdivisions; i++) {
      let a = xMin + i * step;
      let b = a + step;
      let fa = fn(a);
      let fb = fn(b);

      if (!isFinite(fa) || !isFinite(fb)) continue;

      if (Math.abs(fa) < 1e-9) {
        addUniqueRoot(roots, a);
        continue;
      }

      if (fa * fb < 0 && Math.abs(fb - fa) < 50) {
        let left = a, right = b, fLeft = fa;
        for (let iter = 0; iter < 35; iter++) {
          const mid = 0.5 * (left + right);
          const fMid = fn(mid);
          if (!isFinite(fMid)) break;
          if (Math.abs(fMid) < 1e-10) {
            left = right = mid;
            break;
          }
          if (fLeft * fMid <= 0) {
            right = mid;
          } else {
            left = mid;
            fLeft = fMid;
          }
        }
        const rootCandidate = 0.5 * (left + right);
        if (Math.abs(fn(rootCandidate)) < 1e-3) {
          addUniqueRoot(roots, rootCandidate);
        }
      }
    }
    return roots;
  }

  function addUniqueRoot(list, val) {
    const clean = Math.abs(val) < 1e-7 ? 0 : Number(val.toFixed(4));
    if (!list.some(r => Math.abs(r - clean) < 1e-3)) {
      list.push(clean);
    }
  }

  function formatNumber(n, decimals = 4) {
    if (n === null || n === undefined || isNaN(n)) return 'Indefinido';
    if (!isFinite(n)) return n > 0 ? '+∞' : '-∞';
    if (Math.abs(n) < 1e-11) return '0';
    if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
    return Number(n.toFixed(decimals)).toString();
  }

  /**
   * Comprobador inteligente y diagnóstico de respuestas del estudiante.
   * Soporta respuestas numéricas, fraccionarias, expresiones algebraicas, factorizaciones y +C.
   * Retorna: { isCorrect: boolean, feedbackType: string, message: string }
   */
  function checkStudentAnswer(studentRaw, expectedAnswer, acceptedAlternatives = [], exerciseMeta = {}) {
    if (!studentRaw || !String(studentRaw).trim()) {
      return {
        isCorrect: false,
        feedbackType: 'empty',
        message: 'Por favor escribe una expresión o valor matemático antes de comprobar.'
      };
    }

    const whyCorrect = exerciseMeta.whyCorrect
      ? ` ${exerciseMeta.whyCorrect}`
      : ' Verifica el procedimiento paso a paso abajo para afianzar el método.';
    const reviewTip = exerciseMeta.reviewTip
      ? ` **Qué debes revisar:** ${exerciseMeta.reviewTip}`
      : '';

    const candidates = [expectedAnswer, ...(acceptedAlternatives || [])].filter(Boolean);
    const cleanStudent = cleanTextForCompare(studentRaw);

    // 1. Comparación directa de texto normalizado
    for (const cand of candidates) {
      if (cleanStudent === cleanTextForCompare(cand)) {
        return {
          isCorrect: true,
          feedbackType: 'exact',
          message: `¡Excelente! Tu respuesta es exactamente correcta.${whyCorrect}`
        };
      }
    }

    // 2. Si es un par o lista separada por comas o punto y coma (p.ej. raíces x1, x2 o coordenadas (x,y))
    if (cleanStudent.includes(',') || cleanStudent.includes(';')) {
      for (const cand of candidates) {
        if (compareMultiValue(studentRaw, cand)) {
          return {
            isCorrect: true,
            feedbackType: 'multi',
            message: `¡Correcto! Todos los valores coinciden con las soluciones exactas.${whyCorrect}`
          };
        }
      }
    }

    // 3. Evaluación numérica o algebraica (quitando prefijos como "x =", "y =", "f'(x) =", "dy/dx =", "+ C")
    const strippedStudent = stripEquationPrefix(studentRaw);

    for (const cand of candidates) {
      const strippedCand = stripEquationPrefix(cand);

      // ¿Ambos son expresiones numéricas sin variables libres?
      try {
        const valStudent = evaluate(strippedStudent, {});
        const valCand = evaluate(strippedCand, {});
        if ((isFinite(valStudent) && isFinite(valCand)) || (!isFinite(valStudent) && valStudent === valCand)) {
          if (!isFinite(valCand) && valStudent === valCand) {
            return {
              isCorrect: true,
              feedbackType: 'infinite',
              message: `¡Correcto! El límite diverge a ${valCand > 0 ? '+∞' : '-∞'}.${whyCorrect}`
            };
          }
          const tol = Math.max(1e-2, Math.abs(valCand) * 1e-2);
          if (Math.abs(valStudent - valCand) <= tol) {
            return {
              isCorrect: true,
              feedbackType: 'numeric',
              message: `¡Correcto! Tu resultado numérico equivale al valor exacto ($${cand}$).${whyCorrect}`
            };
          }
          if (Math.abs(valStudent + valCand) <= tol && Math.abs(valCand) > 1e-5) {
            return {
              isCorrect: false,
              feedbackType: 'sign-error',
              message: `¡Estás muy cerca! El valor absoluto es correcto, pero tienes un **error de signo** (+ / -). Revisa las leyes de los signos o el sentido de la resta.${reviewTip}`
            };
          }
          if (Math.abs(valCand) > 1e-5 && (Math.abs(valStudent / valCand - 2) < 0.02 || Math.abs(valStudent / valCand - 0.5) < 0.02)) {
            return {
              isCorrect: false,
              feedbackType: 'factor-error',
              message: `Tu resultado difiere por un factor de $2$ (o $1/2$). Revisa si olvidaste dividir o multiplicar por $2$ en la fórmula.${reviewTip}`
            };
          }
        }
      } catch (_) {
        // Contiene variables libres, continuar con prueba de equivalencia algebraica
      }

      // Prueba de equivalencia algebraica / funcional en múltiples puntos de prueba
      try {
        const fnS = compileFunction(strippedStudent);
        const fnC = compileFunction(strippedCand);
        const testPoints = [0.6, 1.3, 1.9, 2.4, 3.1, -0.7, -1.4];
        let validCount = 0;
        let matchCount = 0;
        let signOppositeCount = 0;
        let constantDiffs = [];

        for (const pt of testPoints) {
          const ys = fnS(pt, { y: 1.3, t: pt, a: 2.1, b: 1.4, c: 0 });
          const yc = fnC(pt, { y: 1.3, t: pt, a: 2.1, b: 1.4, c: 0 });
          if (isFinite(ys) && isFinite(yc)) {
            validCount++;
            const tol = Math.max(1e-3, Math.abs(yc) * 1e-3);
            if (Math.abs(ys - yc) <= tol) {
              matchCount++;
            } else if (Math.abs(ys + yc) <= tol && Math.abs(yc) > 1e-4) {
              signOppositeCount++;
            }
            constantDiffs.push(ys - yc);
          }
        }

        if (validCount >= 3 && matchCount === validCount) {
          // Si el ejercicio pide explícitamente factorizar (p. ej. la respuesta esperada tiene productos de paréntesis)
          // verificar que el estudiante no haya escrito simplemente el polinomio expandido sin paréntesis.
          const candHasFactors = /\)\s*\*?\s*\(|[a-zA-Z0-9]\s*\*?\s*\(/.test(strippedCand);
          const studentHasFactors = /\(/.test(strippedStudent);
          if ((exerciseMeta.requireFactored || candHasFactors) && !studentHasFactors && strippedCand.includes('(')) {
            return {
              isCorrect: false,
              feedbackType: 'unfactored',
              message: 'Tu expresión es algebraicamente igual al polinomio original, pero **aún no está factorizada**. Expresa el resultado como un producto de factores utilizando paréntesis, por ejemplo $(x + a)(x + b)$.'
            };
          }

          return {
            isCorrect: true,
            feedbackType: 'algebraic',
            message: `¡Muy bien! Tu expresión matemática es algebraicamente equivalente a $${expectedAnswer}$.${whyCorrect}`
          };
        }

        if (validCount >= 3 && signOppositeCount === validCount) {
          return {
            isCorrect: false,
            feedbackType: 'sign-error',
            message: `Casi lo tienes: tu expresión algebraica tiene el **signo opuesto** ($-f(x)$). Revisa el signo al factorizar, derivar o integrar.${reviewTip}`
          };
        }

        // ¿Difieren solo en una constante aditiva (típico al olvidar el término constante o en una antiderivada con condición inicial)?
        if (constantDiffs.length >= 4) {
          const firstDiff = constantDiffs[0];
          const isConstShift = constantDiffs.every(d => Math.abs(d - firstDiff) < 1e-2);
          if (isConstShift && Math.abs(firstDiff) > 1e-3) {
            return {
              isCorrect: false,
              feedbackType: 'constant-error',
              message: `La parte con la variable $x$ es correcta, pero tu término independiente (constante) difiere en $${formatNumber(firstDiff, 2)}$. Revisa las operaciones con las constantes.${reviewTip}`
            };
          }
        }
      } catch (_) {
        // Ignorar si no es expresión funcional
      }
    }

    return {
      isCorrect: false,
      feedbackType: 'incorrect',
      message: `La respuesta aún no es correcta.${reviewTip || ' Revisa las propiedades del tema o solicita una pista progresiva para ver cómo plantear el primer paso.'}`
    };
  }

  function cleanTextForCompare(str) {
    return String(str)
      .toLowerCase()
      .replace(/\\operatorname\{([^{}]+)\}/g, '$1')
      .replace(/\\text\{([^{}]+)\}/g, '$1')
      .replace(/\s+/g, '')
      .replace(/×|·|\\cdot/g, '*')
      .replace(/−|–/g, '-')
      .replace(/\+c$/i, '')
      .replace(/^[a-z]'?\([a-z]\)=/i, '')
      .replace(/^dy\/dx=/i, '')
      .replace(/^[a-z]=/i, '');
  }

  function stripEquationPrefix(str) {
    return String(str)
      .trim()
      .replace(/^\\frac\{dy\}\{dx\}\s*=\s*/i, '')
      .replace(/^dy\/dx\s*=\s*/i, '')
      .replace(/^[a-zA-Z]'*'?\s*\([a-zA-Z]\)\s*=\s*/, '')
      .replace(/^[a-zA-Z]\s*=\s*/, '')
      .replace(/\+\s*C\b/gi, '')
      .replace(/,\s*C\b/gi, '')
      .trim();
  }

  function compareMultiValue(studentStr, candStr) {
    const parseParts = (raw) =>
      String(raw)
        .replace(/[()[\]{}]/g, '')
        .split(/[,;]/)
        .map(p => stripEquationPrefix(p))
        .filter(Boolean)
        .map(p => {
          try {
            return evaluate(p, {});
          } catch (_) {
            return NaN;
          }
        });

    const sParts = parseParts(studentStr);
    const cParts = parseParts(candStr);
    if (sParts.length < 2 || sParts.length !== cParts.length) return false;
    if (sParts.some(isNaN) || cParts.some(isNaN)) return false;

    if (String(candStr).trim().startsWith('(')) {
      return sParts.every((v, idx) => Math.abs(v - cParts[idx]) < 1e-2);
    }
    const sortedS = [...sParts].sort((a, b) => a - b);
    const sortedC = [...cParts].sort((a, b) => a - b);
    return sortedS.every((v, idx) => Math.abs(v - sortedC[idx]) < 1e-2);
  }

  /**
   * Extrae de forma inteligente la función graficable `g(x)` y los parámetros de análisis de Cálculo
   * (punto `x_0`, casilla de recta tangente o casilla de integral definida con límites `a` y `b`)
   * a partir de cualquier expresión del Editor o del input del Graficador.
   */
  function extractGrapherPayload(rawInput, fallbackX0 = 2) {
    if (rawInput && typeof rawInput === 'object') {
      const inner = extractGrapherPayload(rawInput.expr || '', rawInput.tangentX ?? fallbackX0);
      return Object.assign({}, inner, rawInput, {
        expr: inner.expr || rawInput.expr || '(x^2 - 4)/(x - 2)'
      });
    }

    let s = String(rawInput || '').trim();
    if (!s) {
      return { kind: 'function', expr: '' };
    }

    // Si viene en LaTeX crudo, convertir primero a sintaxis CAS
    if (/\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(s) && ns.MathInput && typeof ns.MathInput.latexToCasString === 'function') {
      s = ns.MathInput.latexToCasString(s);
    }

    // Normalizar variables independientes en mayúscula X -> x, Y -> y
    s = s
      .replace(/(^|[^\\a-zA-Z])X(?![a-zA-Z])/g, '$1x')
      .replace(/(^|[^\\a-zA-Z])Y(?![a-zA-Z])/g, '$1y');

    const calcMatch = s.match(/^(limite|lim|derivada|deriv|d\/dx|integral|int)\s*\(/i);
    if (calcMatch) {
      const fnKind = calcMatch[1].toLowerCase();
      const openIdx = s.indexOf('(');
      const grp = extractBalancedParens(s, openIdx);
      const content = grp ? grp.content : s.slice(openIdx + 1).replace(/\)+$/, '');
      const args = splitArgsTopLevel(content);
      const innerExpr = stripEquationPrefix((args[0] || '').trim());

      if (fnKind === 'lim' || fnKind === 'limite') {
        let targetVal = isFinite(fallbackX0) ? fallbackX0 : 2;
        let hasFiniteTarget = false;
        let isInf = false;
        if (args[1]) {
          const rhsRaw = args[1].split(/->|→/).pop().trim();
          const rhsClean = rhsRaw.replace(/[+-]$/, '').trim();
          if (/^-?(inf|infinito|∞)$/i.test(rhsClean)) {
            isInf = true;
          } else if (rhsClean) {
            try {
              const parsedT = evaluate(rhsClean, { x: targetVal });
              if (isFinite(parsedT)) {
                targetVal = parsedT;
                hasFiniteTarget = true;
              }
            } catch (_) {
              const numT = parseFloat(rhsClean);
              if (isFinite(numT)) {
                targetVal = numT;
                hasFiniteTarget = true;
              }
            }
          }
        }
        return {
          kind: 'limit',
          expr: innerExpr,
          tangentX: (!isInf && (hasFiniteTarget || isFinite(targetVal))) ? targetVal : undefined,
          isInfinityLimit: isInf
        };
      }

      if (fnKind === 'derivada' || fnKind === 'deriv' || fnKind === 'd/dx') {
        return {
          kind: 'derivative',
          expr: innerExpr,
          showDerivative: true,
          tangentX: isFinite(fallbackX0) ? fallbackX0 : 1
        };
      }

      if (fnKind === 'integral' || fnKind === 'int') {
        let low = 0;
        let high = isFinite(fallbackX0) ? fallbackX0 : 2;
        if (args.length >= 3) {
          try {
            const pLow = evaluate(args[1], { x: fallbackX0 });
            if (isFinite(pLow)) low = pLow;
          } catch (_) {
            const nLow = parseFloat(args[1]);
            if (isFinite(nLow)) low = nLow;
          }
          try {
            const pHigh = evaluate(args[2], { x: fallbackX0 });
            if (isFinite(pHigh)) high = pHigh;
          } catch (_) {
            const nHigh = parseFloat(args[2]);
            if (isFinite(nHigh)) high = nHigh;
          }
        }
        return {
          kind: 'integral',
          expr: innerExpr,
          showIntegral: true,
          integralA: low,
          integralB: high
        };
      }
    }

    const isFunctionDef = /^([fghpuvFGHPUV]\s*\(\s*[a-zA-Z]\s*\)|y)\s*=/i.test(s);
    if (s.includes('=') && !/[<>!]=/.test(s) && !isFunctionDef) {
      const parts = s.split('=');
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        return {
          kind: 'equation',
          expr: `(${parts[0].trim()}) - (${parts[1].trim()})`
        };
      }
    }

    return {
      kind: 'function',
      expr: stripEquationPrefix(s)
    };
  }

  /**
   * Analiza de forma integral cualquier expresión introducida en el Editor de Expresiones:
   * - Operación numérica directa (ej. `(3+5)/2 * 4` -> resultado exacto `16`)
   * - Expresión algebraica o Fracción/Radical con variables (evaluación en `x0`, derivada e integral)
   * - Función `f(x) = ...` (evaluación, derivada, integral, paridad y raíces)
   * - Ecuación `A = B` (resolución numérica de raíces reales `A - (B) = 0` y comprobación en `x0`)
   * - Expresión de Cálculo: `lim(f(x), x->a)`, `derivada(f(x))` / `d/dx(f(x))`, `integral(f(x), a, b)`
   */
  function analyzeEditorExpression(rawInput, x0 = 2, y0 = 1) {
    let s = String(rawInput || '').trim();
    if (!s) {
      return { ok: false, kind: 'empty', cards: [], graphableExpr: '' };
    }

    if (/\\(?:lim|frac|sqrt|int|left|right|to|sin|cos|tan|ln|log|pi|infty)/.test(s) && ns.MathInput && typeof ns.MathInput.latexToCasString === 'function') {
      s = ns.MathInput.latexToCasString(s);
    }

    s = s
      .replace(/(^|[^\\a-zA-Z])X(?![a-zA-Z])/g, '$1x')
      .replace(/(^|[^\\a-zA-Z])Y(?![a-zA-Z])/g, '$1y');

    // 1. ¿Es una estructura de Cálculo explícita: lim(...), derivada(...) / d/dx(...), integral(...)?
    const calcMatch = s.match(/^(limite|lim|derivada|deriv|d\/dx|integral|int)\s*\(/i);
    if (calcMatch) {
      const fnKind = calcMatch[1].toLowerCase();
      const openIdx = s.indexOf('(');
      const grp = extractBalancedParens(s, openIdx);
      if (grp) {
        const args = splitArgsTopLevel(grp.content);
        const innerExpr = (args[0] || '').trim();
        if (!innerExpr) {
          return { ok: false, kind: 'incomplete', cards: [], graphableExpr: '' };
        }
        try {
          const fn = compileFunction(innerExpr, 'RAD');
          if (fnKind === 'lim' || fnKind === 'limite') {
            let targetVal = x0;
            let isInf = false;
            let infSign = 1;
            let lateralSide = '';
            if (args[1]) {
              const rhsRaw = args[1].split(/->|→/).pop().trim();
              if (/[+-]$/.test(rhsRaw) && !/^-?(inf|infinito|∞)$/i.test(rhsRaw)) {
                lateralSide = rhsRaw.slice(-1);
              }
              const rhs = rhsRaw.replace(/[+-]$/, '').trim();
              if (/^-?(inf|infinito|∞)$/i.test(rhs)) {
                isInf = true;
                infSign = rhs.startsWith('-') ? -1 : 1;
              } else if (rhs) {
                const parsedT = evaluate(rhs, { x: x0, y: y0 });
                if (isFinite(parsedT)) targetVal = parsedT;
              }
            }
            if (isInf) {
              const vLarge = fn(infSign * 1e5, { y: y0 });
              return {
                ok: true,
                kind: 'calculo_limite',
                graphableExpr: innerExpr,
                grapherPayload: {
                  kind: 'limit',
                  expr: innerExpr,
                  isInfinityLimit: true
                },
                cards: [
                  {
                    label: `Comportamiento cuando $x \\to ${infSign > 0 ? '+\\infty' : '-\\infty'}$`,
                    math: `\\lim_{x \\to ${infSign > 0 ? '+\\infty' : '-\\infty'}} f(x) \\approx ${formatNumber(vLarge, 4)}`
                  },
                  {
                    label: `Evaluación en $x_0 = ${x0}$`,
                    math: `f(${x0}) = ${formatNumber(fn(x0, { y: y0 }), 5)}`
                  }
                ]
              };
            }
            const leftLim = fn(targetVal - 1e-5, { y: y0 });
            const rightLim = fn(targetVal + 1e-5, { y: y0 });
            const avgLim = lateralSide === '-' ? leftLim : (lateralSide === '+' ? rightLim : 0.5 * (leftLim + rightLim));
            const exists = lateralSide
              ? isFinite(avgLim)
              : (isFinite(leftLim) && isFinite(rightLim) && Math.abs(leftLim - rightLim) < 1e-2 * Math.max(1, Math.abs(avgLim)));
            return {
              ok: true,
              kind: 'calculo_limite',
              graphableExpr: innerExpr,
              grapherPayload: {
                kind: 'limit',
                expr: innerExpr,
                tangentX: targetVal
              },
              cards: [
                {
                  label: `Límite cuando $x \\to ${formatNumber(targetVal, 4)}${lateralSide ? '^' + lateralSide : ''}$`,
                  math: exists
                    ? `\\lim_{x \\to ${formatNumber(targetVal, 4)}${lateralSide ? '^' + lateralSide : ''}} f(x) = ${formatNumber(avgLim, 5)}`
                    : `\\text{Límites laterales distintos o divergentes}`
                },
                {
                  label: 'Límites laterales (izquierda / derecha)',
                  math: `L^- = ${formatNumber(leftLim, 4)}, \\quad L^+ = ${formatNumber(rightLim, 4)}`
                }
              ]
            };
          }

          if (fnKind === 'derivada' || fnKind === 'deriv' || fnKind === 'd/dx') {
            const dVal = numericalDerivative(t => fn(t, { y: y0 }), x0);
            const fVal = fn(x0, { y: y0 });
            return {
              ok: true,
              kind: 'calculo_derivada',
              graphableExpr: innerExpr,
              grapherPayload: {
                kind: 'derivative',
                expr: innerExpr,
                showDerivative: true,
                tangentX: x0
              },
              cards: [
                {
                  label: `Derivada evaluada en $x_0 = ${x0}$`,
                  math: `f'(${x0}) = ${formatNumber(dVal, 5)}`
                },
                {
                  label: `Valor de la función base en $x_0 = ${x0}$`,
                  math: `f(${x0}) = ${formatNumber(fVal, 5)}`
                },
                {
                  label: `Recta tangente en $x_0 = ${x0}$`,
                  math: `y = ${formatNumber(dVal, 4)}(x - ${x0}) + ${formatNumber(fVal, 4)}`
                }
              ]
            };
          }

          if (fnKind === 'integral' || fnKind === 'int') {
            const low = args.length >= 3 ? evaluate(args[1], { x: x0, y: y0 }) : 0;
            const high = args.length >= 3 ? evaluate(args[2], { x: x0, y: y0 }) : x0;
            const area = numericalIntegral(t => fn(t, { y: y0 }), low, high);
            return {
              ok: true,
              kind: 'calculo_integral',
              graphableExpr: innerExpr,
              grapherPayload: {
                kind: 'integral',
                expr: innerExpr,
                showIntegral: true,
                integralA: low,
                integralB: high
              },
              cards: [
                {
                  label: `Integral definida desde $a = ${formatNumber(low, 3)}$ hasta $b = ${formatNumber(high, 3)}$`,
                  math: `\\int_{${formatNumber(low, 3)}}^{${formatNumber(high, 3)}} f(x)\\,dx = ${formatNumber(area, 5)}`
                },
                {
                  label: `Valor del integrando en $x_0 = ${x0}$`,
                  math: `f(${x0}) = ${formatNumber(fn(x0, { y: y0 }), 5)}`
                }
              ]
            };
          }
        } catch (_) {
          return { ok: false, kind: 'incomplete', cards: [], graphableExpr: '' };
        }
      }
    }

    // 2. ¿Es una Ecuación (igualdad entre dos miembros que NO es simplemente `f(x) = ...` o `y = ...`)?
    const isFunctionDef = /^([fghpuvFGHPUV]\s*\(\s*[a-zA-Z]\s*\)|y)\s*=/i.test(s);
    if (s.includes('=') && !/[<>!]=/.test(s) && !isFunctionDef) {
      const parts = s.split('=');
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        const lhsRaw = parts[0].trim();
        const rhsRaw = parts[1].trim();
        try {
          const fnL = compileFunction(lhsRaw, 'RAD');
          const fnR = compileFunction(rhsRaw, 'RAD');
          const diffFn = (x) => fnL(x, { y: y0 }) - fnR(x, { y: y0 });
          const roots = findRoots(diffFn, -50, 50, 500);
          const lhsAtX0 = fnL(x0, { y: y0 });
          const rhsAtX0 = fnR(x0, { y: y0 });
          const rootsText = roots.length > 0
            ? roots.map((r, idx) => `x_${idx + 1} = ${formatNumber(r, 4)}`).join(', \\quad ')
            : '\\text{No se hallaron raíces reales en } [-50, 50]';

          return {
            ok: true,
            kind: 'ecuacion',
            graphableExpr: `(${lhsRaw}) - (${rhsRaw})`,
            cards: [
              {
                label: 'Soluciones reales detectadas para la incógnita $x$',
                math: rootsText
              },
              {
                label: `Comprobación en $x_0 = ${x0}$ (Izquierda vs. Derecha)`,
                math: `\\text{Izq} = ${formatNumber(lhsAtX0, 4)}, \\quad \\text{Der} = ${formatNumber(rhsAtX0, 4)}`
              }
            ]
          };
        } catch (_) {
          return { ok: false, kind: 'incomplete', cards: [], graphableExpr: '' };
        }
      }
    }

    // 3. Operación numérica, Expresión algebraica, Fracción/Radical o Función f(x) = ...
    const cleanExpr = stripEquationPrefix(s);
    if (!cleanExpr) {
      return { ok: false, kind: 'incomplete', cards: [], graphableExpr: '' };
    }

    // ¿Es una operación puramente numérica (sin variables libres)?
    try {
      const directVal = evaluate(cleanExpr, {});
      if (isFinite(directVal)) {
        return {
          ok: true,
          kind: 'operacion',
          graphableExpr: cleanExpr,
          cards: [
            {
              label: 'Resultado numérico exacto de la operación',
              math: `${ns.MathRenderer ? ns.MathRenderer.algebraicToLatex(cleanExpr) : cleanExpr} = ${formatNumber(directVal, 6)}`
            }
          ]
        };
      }
    } catch (_) {
      // Tiene variables (como x o y), continuar con análisis funcional
    }

    try {
      const fn = compileFunction(cleanExpr, 'RAD');
      const val = fn(x0, { y: y0 });
      const deriv = numericalDerivative(t => fn(t, { y: y0 }), x0);
      const integral0ToX = numericalIntegral(t => fn(t, { y: y0 }), 0, x0);

      const fPos = fn(1.7, { y: y0 });
      const fNeg = fn(-1.7, { y: y0 });
      let parityText = '\\text{Sin simetría par/impar}';
      if (isFinite(fPos) && isFinite(fNeg)) {
        if (Math.abs(fPos - fNeg) < 1e-5) parityText = '\\text{Función Par: } f(-x) = f(x)';
        else if (Math.abs(fPos + fNeg) < 1e-5) parityText = '\\text{Función Impar: } f(-x) = -f(x)';
      }

      return {
        ok: true,
        kind: isFunctionDef ? 'funcion' : 'algebraica',
        graphableExpr: cleanExpr,
        cards: [
          {
            label: `Valor numérico en $x_0 = ${x0}$`,
            math: `f(${x0}) = ${formatNumber(val, 5)}`
          },
          {
            label: `Derivada primera en $x_0 = ${x0}$`,
            math: `f'(${x0}) = ${formatNumber(deriv, 5)}`
          },
          {
            label: `Integral definida de $0$ a $${x0}$`,
            math: `\\int_{0}^{${x0}} f(t)\\,dt = ${formatNumber(integral0ToX, 5)}`
          },
          {
            label: 'Simetría / Paridad',
            math: parityText
          }
        ]
      };
    } catch (_) {
      return { ok: false, kind: 'incomplete', cards: [], graphableExpr: '' };
    }
  }

  ns.MathParser = {
    normalizeExpression,
    stripEquationPrefix,
    tokenize,
    parseToAST,
    evaluate,
    compileFunction,
    numericalDerivative,
    numericalIntegral,
    findRoots,
    formatNumber,
    checkStudentAnswer,
    analyzeEditorExpression,
    extractGrapherPayload
  };
})(window.MatInteractiva);
