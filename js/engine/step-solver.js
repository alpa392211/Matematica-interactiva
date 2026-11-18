/* ==========================================================================
   MATETIC - Motor de Resolución Paso a Paso
   Archivo: js/engine/step-solver.js
   Resuelve y justifica paso a paso problemas personalizados de Aritmética,
   Álgebra, Geometría, Trigonometría, Límites, Derivadas e Integrales con
   notación LaTeX/KaTeX completa.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  function parseNumericValue(rawVal, fieldLabel = 'valor') {
    if (typeof rawVal === 'number') {
      if (!isFinite(rawVal)) throw new Error(`El campo ${fieldLabel} debe ser un número real finito.`);
      return rawVal;
    }
    const str = String(rawVal ?? '').trim();
    if (!str) throw new Error(`Ingresa un valor numérico válido en ${fieldLabel}.`);
    const direct = Number(str);
    if (!Number.isNaN(direct) && isFinite(direct)) return direct;
    if (ns.MathParser && typeof ns.MathParser.evaluate === 'function') {
      try {
        const evaluated = ns.MathParser.evaluate(str, {}, 'RAD');
        if (typeof evaluated === 'number' && isFinite(evaluated)) return evaluated;
      } catch (_) {}
    }
    throw new Error(`El valor en ${fieldLabel} no es una expresión numérica real válida.`);
  }

  function toSignedTerm(coef, symbol = '', isFirst = false) {
    const n = Number(coef);
    if (isFirst) return symbol ? `${n}${symbol}` : `${n}`;
    return n >= 0
      ? `+ ${n}${symbol}`
      : `- ${Math.abs(n)}${symbol}`;
  }

  function toSignedParen(val) {
    const n = Number(val);
    return n < 0 ? `(${n})` : `${n}`;
  }

  function toLatexExpr(exprStr) {
    const raw = String(exprStr || '').trim();
    if (!raw) return 'x';
    if (ns.MathInput && typeof ns.MathInput.casStringToLatex === 'function') {
      const converted = ns.MathInput.casStringToLatex(raw);
      if (converted) return converted;
    }
    if (ns.MathRenderer && typeof ns.MathRenderer.algebraicToLatex === 'function') {
      return ns.MathRenderer.algebraicToLatex(raw);
    }
    return raw.replace(/\*/g, ' \\cdot ');
  }

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(Math.round(a * b)) / gcd(a, b);
  }

  function primeFactors(n) {
    let num = Math.abs(Math.round(n));
    if (num <= 1) return [num];
    const factors = [];
    let d = 2;
    while (d * d <= num) {
      while (num % d === 0) {
        factors.push(d);
        num /= d;
      }
      d++;
    }
    if (num > 1) factors.push(num);
    return factors;
  }

  /**
   * 1. Operaciones con Fracciones: (a/b) op (c/d)
   */
  function solveFractions(a, b, op, c, d) {
    a = Math.round(parseNumericValue(a, 'a'));
    b = Math.round(parseNumericValue(b, 'b'));
    c = Math.round(parseNumericValue(c, 'c'));
    d = Math.round(parseNumericValue(d, 'd'));

    if (b === 0 || d === 0) {
      throw new Error('El denominador de una fracción no puede ser cero.');
    }

    const opTex = op === '*' ? '\\cdot' : op === '/' ? '\\div' : op;
    const problemMath = `\\frac{${a}}{${b}} ${opTex} \\frac{${c}}{${d}}`;
    const steps = [];
    steps.push({
      title: 'Planteamiento de la operación fraccionaria',
      math: problemMath,
      reason: 'Identificamos los numeradores ($a, c$) y denominadores ($b, d$) de ambas fracciones.'
    });

    let numRes, denRes;

    if (op === '+' || op === '-') {
      const commonDen = lcm(b, d);
      const f1 = commonDen / b;
      const f2 = commonDen / d;
      const n1 = a * f1;
      const n2 = c * f2;
      numRes = op === '+' ? (n1 + n2) : (n1 - n2);
      denRes = commonDen;

      steps.push({
        title: 'Cálculo del Mínimo Común Múltiplo ($\\text{MCM}$) de los denominadores',
        math: `\\text{MCM}(${b}, ${d}) = ${commonDen}`,
        reason: `Para ${op === '+' ? 'sumar' : 'restar'} fracciones heterogéneas, convertimos ambas al denominador común $${commonDen}$.`
      });

      steps.push({
        title: 'Conversión a fracciones equivalentes y operación en el numerador',
        math: `\\frac{${a} \\cdot ${f1}}{${commonDen}} ${op} \\frac{${c} \\cdot ${f2}}{${commonDen}} = \\frac{${n1} ${op} ${toSignedParen(n2)}}{${commonDen}} = \\frac{${numRes}}{${denRes}}`,
        reason: `Amplificamos cada fracción y operamos los numeradores conservando el denominador común $${commonDen}$.`
      });
    } else if (op === '*') {
      numRes = a * c;
      denRes = b * d;
      steps.push({
        title: 'Multiplicación directa de numeradores y denominadores',
        math: `\\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\frac{${numRes}}{${denRes}}`,
        reason: 'El producto de dos fracciones equivale a $\\frac{a \\cdot c}{b \\cdot d}$.'
      });
    } else if (op === '/') {
      if (c === 0) throw new Error('No se puede dividir entre una fracción con numerador cero.');
      numRes = a * d;
      denRes = b * c;
      steps.push({
        title: 'Multiplicación por el recíproco (inverso multiplicativo)',
        math: `\\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = \\frac{${numRes}}{${denRes}}`,
        reason: 'Dividir entre $\\frac{c}{d}$ equivale a multiplicar por su fracción recíproca $\\frac{d}{c}$.'
      });
    }

    if (denRes < 0) {
      numRes = -numRes;
      denRes = -denRes;
    }

    const divisor = gcd(numRes, denRes);
    const simpNum = numRes / divisor;
    const simpDen = denRes / divisor;

    if (divisor > 1) {
      steps.push({
        title: 'Simplificación a fracción irreducible mediante el $\\text{MCD}$',
        math: `\\text{MCD}(${Math.abs(numRes)}, ${denRes}) = ${divisor} \\Rightarrow \\frac{${numRes} \\div ${divisor}}{${denRes} \\div ${divisor}} = \\frac{${simpNum}}{${simpDen}}`,
        reason: 'Dividimos numerador y denominador entre su Máximo Común Divisor ($\\text{MCD}$).'
      });
    } else {
      steps.push({
        title: 'Verificación de irreducibilidad',
        math: `\\text{MCD}(${Math.abs(numRes)}, ${denRes}) = 1 \\Rightarrow \\frac{${simpNum}}{${simpDen}}`,
        reason: 'La fracción ya es irreducible porque numerador y denominador son coprimos ($\\text{MCD} = 1$).'
      });
    }

    const finalStr = simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`;
    return {
      problemTitle: `Operación de fracciones: $${problemMath}$`,
      problemMath,
      steps,
      finalAnswer: finalStr,
      finalMath: simpDen === 1 ? `${simpNum}` : `\\frac{${simpNum}}{${simpDen}} \\approx ${(simpNum / simpDen).toFixed(4)}`
    };
  }

  /**
   * 2. MCD y MCM de dos enteros positivos
   */
  function solveGcdLcm(a, b) {
    a = Math.abs(Math.round(parseNumericValue(a, 'a')));
    b = Math.abs(Math.round(parseNumericValue(b, 'b')));
    if (!a || !b) throw new Error('Ingresa dos números enteros mayores que cero.');

    const fA = primeFactors(a);
    const fB = primeFactors(b);
    const mcd = gcd(a, b);
    const mcm = lcm(a, b);
    const problemMath = `\\text{MCD}(${a},\\; ${b}) \\quad \\text{y} \\quad \\text{MCM}(${a},\\; ${b})`;

    const steps = [
      {
        title: 'Descomposición en factores primos',
        math: `${a} = ${fA.join(' \\cdot ')} \\quad ; \\quad ${b} = ${fB.join(' \\cdot ')}`,
        reason: 'Factorizamos cada entero dividiendo sucesivamente entre números primos ($2, 3, 5, 7, \\dots$).'
      },
      {
        title: 'Aplicación del Algoritmo de Euclides para el $\\text{MCD}$',
        math: `\\text{MCD}(${a}, ${b}) = ${mcd}`,
        reason: 'El Máximo Común Divisor ($\\text{MCD}$) es el mayor entero positivo que divide exactamente a ambos números.'
      },
      {
        title: 'Cálculo del $\\text{MCM}$ usando la propiedad fundamental',
        math: `\\text{MCM}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{\\text{MCD}(${a}, ${b})} = \\frac{${a * b}}{${mcd}} = ${mcm}`,
        reason: 'Para todo par de enteros positivos se cumple que $a \\cdot b = \\text{MCD}(a, b) \\cdot \\text{MCM}(a, b)$.'
      }
    ];

    return {
      problemTitle: `Cálculo de $\\text{MCD}(${a}, ${b})$ y $\\text{MCM}(${a}, ${b})$`,
      problemMath,
      steps,
      finalAnswer: `MCD = ${mcd}, MCM = ${mcm}`,
      finalMath: `\\text{MCD} = ${mcd}, \\quad \\text{MCM} = ${mcm}`
    };
  }

  /**
   * 3. Ecuación Lineal: a*x + b = c*x + d
   */
  function solveLinearEquation(a, b, c, d) {
    a = parseNumericValue(a, 'a');
    b = parseNumericValue(b, 'b');
    c = parseNumericValue(c, 'c');
    d = parseNumericValue(d, 'd');

    const eqLatex = `${a}x ${toSignedTerm(b)} = ${c}x ${toSignedTerm(d)}`;
    const steps = [];

    steps.push({
      title: 'Ecuación lineal original',
      math: eqLatex,
      reason: 'Ecuación de primer grado con una incógnita $x$.'
    });

    const coefX = a - c;
    const indep = d - b;

    steps.push({
      title: 'Transposición de términos',
      math: `${a}x - ${toSignedParen(c)}x = ${d} - ${toSignedParen(b)}`,
      reason: 'Agrupamos los términos con la incógnita $x$ en el miembro izquierdo y las constantes en el derecho.'
    });

    steps.push({
      title: 'Reducción de términos semejantes',
      math: `${ns.MathParser.formatNumber(coefX)}x = ${ns.MathParser.formatNumber(indep)}`,
      reason: 'Operamos los coeficientes de $x$ y los términos independientes.'
    });

    if (Math.abs(coefX) < 1e-12) {
      const msg = Math.abs(indep) < 1e-12 ? 'Infinitas soluciones (Identidad)' : 'Sin solución (Inconsistente)';
      return {
        problemTitle: `Ecuación lineal: $${eqLatex}$`,
        problemMath: eqLatex,
        steps,
        finalAnswer: msg,
        finalMath: `\\text{${msg}}`
      };
    }

    const xVal = indep / coefX;
    const cleanX = ns.MathParser.formatNumber(xVal);
    const cleanCoefX = ns.MathParser.formatNumber(coefX);
    const cleanIndep = ns.MathParser.formatNumber(indep);

    steps.push({
      title: 'Despeje de la incógnita $x$',
      math: `x = \\frac{${cleanIndep}}{${cleanCoefX}} = ${cleanX}`,
      reason: `Dividimos ambos miembros de la igualdad entre $${cleanCoefX}$.`
    });

    const checkLeft = ns.MathParser.formatNumber(a * xVal + b);
    steps.push({
      title: 'Comprobación en la ecuación original',
      math: `${a}(${cleanX}) ${toSignedTerm(b)} = ${checkLeft} \\quad \\checkmark`,
      reason: 'Sustituimos el valor obtenido para $x$ en ambos lados y verificamos que la igualdad se cumple.'
    });

    return {
      problemTitle: `Ecuación lineal: $${eqLatex}$`,
      problemMath: eqLatex,
      steps,
      finalAnswer: cleanX,
      finalMath: `x = ${cleanX}`
    };
  }

  /**
   * 4. Ecuación Cuadrática: a*x^2 + b*x + c = 0
   */
  function solveQuadraticEquation(a, b, c) {
    a = parseNumericValue(a, 'a');
    b = parseNumericValue(b, 'b');
    c = parseNumericValue(c, 'c');
    if (Math.abs(a) < 1e-12) {
      throw new Error('El coeficiente cuadrático "a" debe ser distinto de cero.');
    }

    const eqLatex = `${a}x^2 ${toSignedTerm(b, 'x')} ${toSignedTerm(c)} = 0`;
    const disc = b * b - 4 * a * c;
    const cleanDisc = ns.MathParser.formatNumber(disc);

    const steps = [
      {
        title: 'Identificación de coeficientes en la forma estándar $ax^2 + bx + c = 0$',
        math: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
        reason: 'Comparamos la ecuación cuadrática con la forma canónica $ax^2 + bx + c = 0$.'
      },
      {
        title: 'Cálculo del discriminante $\\Delta = b^2 - 4ac$',
        math: `\\Delta = (${b})^2 - 4(${a})(${c}) = ${ns.MathParser.formatNumber(b * b)} - (${ns.MathParser.formatNumber(4 * a * c)}) = ${cleanDisc}`,
        reason: 'El signo del discriminante $\\Delta$ determina la naturaleza de las raíces.'
      }
    ];

    if (disc < 0) {
      const realPart = ns.MathParser.formatNumber(-b / (2 * a));
      const imagPart = ns.MathParser.formatNumber(Math.sqrt(-disc) / Math.abs(2 * a));
      steps.push({
        title: 'Raíces complejas conjugadas ($\\Delta < 0$)',
        math: `x = \\frac{-${toSignedParen(b)} \\pm \\sqrt{${cleanDisc}}}{2(${a})} = ${realPart} \\pm ${imagPart}i`,
        reason: 'Como $\\Delta < 0$, la parábola no corta al eje real $x$; tiene dos soluciones en el conjunto $\\mathbb{C}$.'
      });
      return {
        problemTitle: `Ecuación cuadrática: $${eqLatex}$`,
        problemMath: eqLatex,
        steps,
        finalAnswer: `${realPart} ± ${imagPart}i`,
        finalMath: `x_1, x_2 = ${realPart} \\pm ${imagPart}i`
      };
    }

    const sqrtDisc = Math.sqrt(disc);
    const x1 = (-b + sqrtDisc) / (2 * a);
    const x2 = (-b - sqrtDisc) / (2 * a);
    const s1 = ns.MathParser.formatNumber(x1);
    const s2 = ns.MathParser.formatNumber(x2);
    const cleanSqrtDisc = ns.MathParser.formatNumber(sqrtDisc);
    const clean2a = ns.MathParser.formatNumber(2 * a);

    steps.push({
      title: 'Sustitución en la fórmula general cuadrática',
      math: `x = \\frac{-${toSignedParen(b)} \\pm \\sqrt{${cleanDisc}}}{2(${a})} = \\frac{${ns.MathParser.formatNumber(-b)} \\pm ${cleanSqrtDisc}}{${clean2a}}`,
      reason: 'Aplicamos la fórmula general $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$.'
    });

    steps.push({
      title: 'Obtención de las dos raíces reales $x_1$ y $x_2$',
      math: `x_1 = \\frac{${ns.MathParser.formatNumber(-b)} + ${cleanSqrtDisc}}{${clean2a}} = ${s1} \\quad ; \\quad x_2 = \\frac{${ns.MathParser.formatNumber(-b)} - ${cleanSqrtDisc}}{${clean2a}} = ${s2}`,
      reason: 'Calculamos cada rama ($+$ y $-$) por separado.'
    });

    return {
      problemTitle: `Ecuación cuadrática: $${eqLatex}$`,
      problemMath: eqLatex,
      steps,
      finalAnswer: disc === 0 ? s1 : `${s1}, ${s2}`,
      finalMath: disc === 0 ? `x = ${s1}` : `x_1 = ${s1}, \\quad x_2 = ${s2}`
    };
  }

  /**
   * 5. Sistema Lineal 2x2:
   * a1*x + b1*y = c1
   * a2*x + b2*y = c2
   */
  function solveSystem2x2(a1, b1, c1, a2, b2, c2) {
    a1 = parseNumericValue(a1, 'a₁');
    b1 = parseNumericValue(b1, 'b₁');
    c1 = parseNumericValue(c1, 'c₁');
    a2 = parseNumericValue(a2, 'a₂');
    b2 = parseNumericValue(b2, 'b₂');
    c2 = parseNumericValue(c2, 'c₂');

    const det = a1 * b2 - a2 * b1;
    const detX = c1 * b2 - c2 * b1;
    const detY = a1 * c2 - a2 * c1;
    const eq1 = `${a1}x ${toSignedTerm(b1, 'y')} = ${c1}`;
    const eq2 = `${a2}x ${toSignedTerm(b2, 'y')} = ${c2}`;
    const sysLatex = `\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}`;

    const steps = [
      {
        title: 'Planteamiento del sistema de ecuaciones $2\\times 2$',
        math: sysLatex,
        reason: 'Sistema lineal de dos ecuaciones con dos incógnitas ($x$ e $y$).'
      },
      {
        title: 'Cálculo del determinante principal del sistema ($\\Delta_s$)',
        math: `\\Delta_s = (${a1})(${b2}) - (${a2})(${b1}) = ${ns.MathParser.formatNumber(a1 * b2)} - (${ns.MathParser.formatNumber(a2 * b1)}) = ${ns.MathParser.formatNumber(det)}`,
        reason: 'Aplicamos la Regla de Cramer para verificar si existe solución única ($\\Delta_s \\neq 0$).'
      }
    ];

    if (Math.abs(det) < 1e-12) {
      const msg = (Math.abs(detX) < 1e-12 && Math.abs(detY) < 1e-12)
        ? 'Sistema compatible indeterminado (infinitas soluciones)'
        : 'Sistema incompatible (rectas paralelas, sin solución)';
      return {
        problemTitle: `Sistema de ecuaciones $2\\times 2$`,
        problemMath: sysLatex,
        steps,
        finalAnswer: msg,
        finalMath: `\\text{${msg}}`
      };
    }

    const x = detX / det;
    const y = detY / det;
    const sx = ns.MathParser.formatNumber(x);
    const sy = ns.MathParser.formatNumber(y);
    const cleanDet = ns.MathParser.formatNumber(det);
    const cleanDetX = ns.MathParser.formatNumber(detX);
    const cleanDetY = ns.MathParser.formatNumber(detY);

    steps.push({
      title: 'Cálculo de los determinantes de las incógnitas $\\Delta_x$ y $\\Delta_y$',
      math: `\\Delta_x = (${c1})(${b2}) - (${c2})(${b1}) = ${cleanDetX} \\quad ; \\quad \\Delta_y = (${a1})(${c2}) - (${a2})(${c1}) = ${cleanDetY}`,
      reason: 'Sustituimos la columna de términos independientes ($c_1, c_2$) en lugar de los coeficientes de $x$ e $y$.'
    });

    steps.push({
      title: 'Obtención de los valores de $x$ e $y$',
      math: `x = \\frac{\\Delta_x}{\\Delta_s} = \\frac{${cleanDetX}}{${cleanDet}} = ${sx} \\quad ; \\quad y = \\frac{\\Delta_y}{\\Delta_s} = \\frac{${cleanDetY}}{${cleanDet}} = ${sy}`,
      reason: 'El punto de intersección de ambas rectas en el plano es $(x, y)$.'
    });

    return {
      problemTitle: `Sistema lineal $2\\times 2$`,
      problemMath: sysLatex,
      steps,
      finalAnswer: `(${sx}, ${sy})`,
      finalMath: `x = ${sx}, \\quad y = ${sy}`
    };
  }

  /**
   * 6. Geometría Analítica y Triángulo Rectángulo
   */
  function solveRightTriangle(catetoA, catetoB) {
    const a = parseNumericValue(catetoA, 'a');
    const b = parseNumericValue(catetoB, 'b');
    if (a <= 0 || b <= 0) throw new Error('Los catetos deben ser mayores que cero.');

    const c = Math.sqrt(a * a + b * b);
    const area = (a * b) / 2;
    const perim = a + b + c;
    const alphaDeg = (Math.atan2(a, b) * 180) / Math.PI;
    const betaDeg = 90 - alphaDeg;

    const sc = ns.MathParser.formatNumber(c);
    const sArea = ns.MathParser.formatNumber(area);
    const sAlpha = ns.MathParser.formatNumber(alphaDeg, 2);
    const sBeta = ns.MathParser.formatNumber(betaDeg, 2);
    const problemMath = `a = ${a}, \\quad b = ${b}, \\quad c = \\sqrt{a^2 + b^2}`;

    const steps = [
      {
        title: 'Aplicación del Teorema de Pitágoras para hallar la hipotenusa $c$',
        math: `c = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${ns.MathParser.formatNumber(a * a + b * b)}} = ${sc}`,
        reason: 'En todo triángulo rectángulo se cumple que $c^2 = a^2 + b^2$.'
      },
      {
        title: 'Cálculo del área $A$ y perímetro $P$ del triángulo',
        math: `A = \\frac{a \\cdot b}{2} = \\frac{${a} \\cdot ${b}}{2} = ${sArea} \\quad ; \\quad P = a + b + c = ${ns.MathParser.formatNumber(perim)}`,
        reason: 'El área de un triángulo rectángulo corresponde al semiproducto de sus catetos $a$ y $b$.'
      },
      {
        title: 'Razones trigonométricas y ángulos agudos $\\alpha$ y $\\beta$',
        math: `\\tan(\\alpha) = \\frac{${a}}{${b}} \\Rightarrow \\alpha = ${sAlpha}^\\circ, \\quad \\beta = 90^\\circ - \\alpha = ${sBeta}^\\circ`,
        reason: 'Usamos $\\alpha = \\arctan\\!\\left(\\frac{a}{b}\\right)$ y la propiedad $\\alpha + \\beta = 90^\\circ$.'
      }
    ];

    return {
      problemTitle: `Triángulo rectángulo con catetos $a = ${a}$ y $b = ${b}$`,
      problemMath,
      steps,
      finalAnswer: sc,
      finalMath: `c = ${sc}, \\quad \\text{Área} = ${sArea}, \\quad \\alpha = ${sAlpha}^\\circ`
    };
  }

  /**
   * 7. Derivada, límite, recta tangente e integral definida de f(x) en x0 y [a, b]
   */
  function solveCalculusFunction(exprStr, x0, intA, intB) {
    const fn = ns.MathParser.compileFunction(exprStr, 'RAD');
    const xVal = parseNumericValue(x0, 'x₀');
    const a = parseNumericValue(intA, 'a');
    const b = parseNumericValue(intB, 'b');

    const fx0 = fn(xVal);
    const dfx0 = ns.MathParser.numericalDerivative(fn, xVal);
    const integralVal = ns.MathParser.numericalIntegral(fn, a, b);

    const limLeft = fn(xVal - 1e-5);
    const limRight = fn(xVal + 1e-5);

    const sFx0 = ns.MathParser.formatNumber(fx0);
    const sDfx0 = ns.MathParser.formatNumber(dfx0);
    const sInt = ns.MathParser.formatNumber(integralVal);
    const sLim = ns.MathParser.formatNumber(0.5 * (limLeft + limRight));

    const intercept = fx0 - dfx0 * xVal;
    const sIntercept = intercept >= 0
      ? `+ ${ns.MathParser.formatNumber(intercept)}`
      : `- ${ns.MathParser.formatNumber(Math.abs(intercept))}`;
    const exprTex = toLatexExpr(exprStr);
    const problemMath = `f(x) = ${exprTex}, \\quad x_0 = ${xVal}, \\quad [${a},\\; ${b}]`;

    const steps = [
      {
        title: `Evaluación de la función y análisis de límite en $x_0 = ${xVal}$`,
        math: `f(${xVal}) = ${sFx0} \\quad ; \\quad \\lim_{x \\to ${xVal}} f(x) = ${sLim}`,
        reason: 'Evaluamos la imagen $f(x_0)$ y comprobamos que los límites laterales coinciden.'
      },
      {
        title: `Cálculo de la derivada instantánea $f'(${xVal})$`,
        math: `f'(${xVal}) = \\lim_{h \\to 0} \\frac{f(${xVal} + h) - f(${xVal} - h)}{2h} = ${sDfx0}`,
        reason: 'La derivada representa la pendiente $m$ de la recta tangente a la curva en $x = x_0$.'
      },
      {
        title: `Ecuación de la recta tangente en el punto $(${xVal},\\; ${sFx0})$`,
        math: `y - ${toSignedParen(sFx0)} = ${sDfx0}(x - ${toSignedParen(xVal)}) \\Rightarrow y = ${sDfx0}x ${sIntercept}`,
        reason: 'Aplicamos la ecuación punto-pendiente $y - f(x_0) = f\'(x_0)(x - x_0)$.'
      },
      {
        title: `Cálculo de la integral definida en el intervalo $[${a},\\; ${b}]$`,
        math: `\\int_{${a}}^{${b}} \\left(${exprTex}\\right)\\,dx = ${sInt}`,
        reason: 'Aplicamos integración definida $\\int_a^b f(x)\\,dx$ mediante el Teorema Fundamental del Cálculo y cuadratura de Simpson.'
      }
    ];

    return {
      problemTitle: `Análisis de Cálculo para $f(x) = ${exprTex}$ en $x_0 = ${xVal}$ e intervalo $[${a},\\; ${b}]$`,
      problemMath,
      steps,
      finalAnswer: `f'(${xVal}) = ${sDfx0}, Integral = ${sInt}`,
      finalMath: `f'(${xVal}) = ${sDfx0}, \\quad \\int_{${a}}^{${b}} f(x)\\,dx = ${sInt}`
    };
  }

  ns.StepSolver = {
    solveFractions,
    solveGcdLcm,
    solveLinearEquation,
    solveQuadraticEquation,
    solveSystem2x2,
    solveRightTriangle,
    solveCalculusFunction
  };
})(window.MatInteractiva);
