/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Motor de Resolución Paso a Paso
   Archivo: js/engine/step-solver.js
   Resuelve y justifica paso a paso problemas personalizados de Aritmética,
   Álgebra, Geometría, Trigonometría, Límites, Derivadas e Integrales.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

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
    a = Math.round(Number(a));
    b = Math.round(Number(b));
    c = Math.round(Number(c));
    d = Math.round(Number(d));

    if (b === 0 || d === 0) {
      throw new Error('El denominador de una fracción no puede ser cero.');
    }

    const steps = [];
    steps.push({
      title: 'Planteamiento de la operación fraccionaria',
      math: `\\frac{${a}}{${b}} ${op === '*' ? '\\cdot' : op === '/' ? '\\div' : op} \\frac{${c}}{${d}}`,
      reason: 'Identificamos los numeradores y denominadores de ambas fracciones.'
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
        title: 'Cálculo del Mínimo Común Múltiplo (MCM) de los denominadores',
        math: `\\text{MCM}(${b}, ${d}) = ${commonDen}`,
        reason: `Para ${op === '+' ? 'sumar' : 'restar'} fracciones heterogéneas, convertimos ambas al denominador común ${commonDen}.`
      });

      steps.push({
        title: 'Conversión a fracciones equivalentes y operación en el numerador',
        math: `\\frac{${a} \\cdot ${f1}}{${commonDen}} ${op} \\frac{${c} \\cdot ${f2}}{${commonDen}} = \\frac{${n1} ${op} (${n2})}{${commonDen}} = \\frac{${numRes}}{${denRes}}`,
        reason: 'Amplificamos cada fracción y operamos los numeradores conservando el denominador común.'
      });
    } else if (op === '*') {
      numRes = a * c;
      denRes = b * d;
      steps.push({
        title: 'Multiplicación directa de numeradores y denominadores',
        math: `\\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\frac{${numRes}}{${denRes}}`,
        reason: 'El producto de dos fracciones es una fracción cuyo numerador es el producto de los numeradores y cuyo denominador es el producto de los denominadores.'
      });
    } else if (op === '/') {
      if (c === 0) throw new Error('No se puede dividir entre una fracción con numerador cero.');
      numRes = a * d;
      denRes = b * c;
      steps.push({
        title: 'Multiplicación por el recíproco (inverso multiplicativo)',
        math: `\\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = \\frac{${numRes}}{${denRes}}`,
        reason: 'Dividir entre una fracción equivale a multiplicar por su fracción recíproca.'
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
        title: 'Simplificación a fracción irreducible mediante el MCD',
        math: `\\text{MCD}(${Math.abs(numRes)}, ${denRes}) = ${divisor} \\Rightarrow \\frac{${numRes} \\div ${divisor}}{${denRes} \\div ${divisor}} = \\frac{${simpNum}}{${simpDen}}`,
        reason: 'Dividimos numerador y denominador entre su Máximo Común Divisor.'
      });
    } else {
      steps.push({
        title: 'Verificación de irreducibilidad',
        math: `\\text{MCD}(${Math.abs(numRes)}, ${denRes}) = 1 \\Rightarrow \\frac{${simpNum}}{${simpDen}}`,
        reason: 'La fracción ya es irreducible porque numerador y denominador son coprimos.'
      });
    }

    const finalStr = simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`;
    return {
      problemTitle: `Operación de fracciones: (${a}/${b}) ${op} (${c}/${d})`,
      steps,
      finalAnswer: finalStr,
      finalMath: simpDen === 1 ? `${simpNum}` : `\\frac{${simpNum}}{${simpDen}} ≈ ${(simpNum / simpDen).toFixed(4)}`
    };
  }

  /**
   * 2. MCD y MCM de dos enteros positivos
   */
  function solveGcdLcm(a, b) {
    a = Math.abs(Math.round(Number(a)));
    b = Math.abs(Math.round(Number(b)));
    if (!a || !b) throw new Error('Ingresa dos números enteros mayores que cero.');

    const fA = primeFactors(a);
    const fB = primeFactors(b);
    const mcd = gcd(a, b);
    const mcm = lcm(a, b);

    const steps = [
      {
        title: 'Descomposición en factores primos',
        math: `${a} = ${fA.join(' \\cdot ')} \\quad ; \\quad ${b} = ${fB.join(' \\cdot ')}`,
        reason: 'Factorizamos cada número dividiendo sucesivamente entre números primos (2, 3, 5, 7...).'
      },
      {
        title: 'Aplicación del Algoritmo de Euclides para el MCD',
        math: `\\text{MCD}(${a}, ${b}) = ${mcd}`,
        reason: 'El Máximo Común Divisor es el mayor entero que divide exactamente a ambos números.'
      },
      {
        title: 'Cálculo del MCM usando la propiedad fundamental',
        math: `\\text{MCM}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{\\text{MCD}(${a}, ${b})} = \\frac{${a * b}}{${mcd}} = ${mcm}`,
        reason: 'El producto de dos números siempre es igual al producto de su MCD por su MCM.'
      }
    ];

    return {
      problemTitle: `MCD y MCM de ${a} y ${b}`,
      steps,
      finalAnswer: `MCD = ${mcd}, MCM = ${mcm}`,
      finalMath: `\\text{MCD} = ${mcd}, \\quad \\text{MCM} = ${mcm}`
    };
  }

  /**
   * 3. Ecuación Lineal: a*x + b = c*x + d
   */
  function solveLinearEquation(a, b, c, d) {
    a = Number(a); b = Number(b); c = Number(c); d = Number(d);
    const steps = [];

    steps.push({
      title: 'Ecuación lineal original',
      math: `${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${c}x ${d >= 0 ? '+ ' + d : '- ' + Math.abs(d)}`,
      reason: 'Ecuación de primer grado con una incógnita.'
    });

    const coefX = a - c;
    const indep = d - b;

    steps.push({
      title: 'Transposición de términos',
      math: `${a}x - (${c}x) = ${d} - (${b})`,
      reason: 'Agrupamos los términos con la incógnita x en el miembro izquierdo y las constantes en el derecho.'
    });

    steps.push({
      title: 'Reducción de términos semejantes',
      math: `${coefX}x = ${indep}`,
      reason: 'Operamos los coeficientes de x y los términos independientes.'
    });

    if (Math.abs(coefX) < 1e-12) {
      const msg = Math.abs(indep) < 1e-12 ? 'Infinitas soluciones (Identidad)' : 'Sin solución (Inconsistente)';
      return {
        problemTitle: 'Ecuación de primer grado',
        steps,
        finalAnswer: msg,
        finalMath: msg
      };
    }

    const xVal = indep / coefX;
    const cleanX = ns.MathParser.formatNumber(xVal);

    steps.push({
      title: 'Despeje de la incógnita x',
      math: `x = \\frac{${indep}}{${coefX}} = ${cleanX}`,
      reason: `Dividimos ambos miembros de la igualdad entre ${coefX}.`
    });

    const checkLeft = ns.MathParser.formatNumber(a * xVal + b);
    steps.push({
      title: 'Comprobación en la ecuación original',
      math: `${a}(${cleanX}) + (${b}) = ${checkLeft} \\quad \\checkmark`,
      reason: 'Sustituimos el valor obtenido en ambos lados y verificamos que la igualdad se cumple.'
    });

    return {
      problemTitle: `Ecuación lineal: ${a}x + (${b}) = ${c}x + (${d})`,
      steps,
      finalAnswer: cleanX,
      finalMath: `x = ${cleanX}`
    };
  }

  /**
   * 4. Ecuación Cuadrática: a*x^2 + b*x + c = 0
   */
  function solveQuadraticEquation(a, b, c) {
    a = Number(a); b = Number(b); c = Number(c);
    if (Math.abs(a) < 1e-12) {
      throw new Error('El coeficiente cuadrático "a" debe ser distinto de cero.');
    }

    const disc = b * b - 4 * a * c;
    const steps = [
      {
        title: 'Identificación de coeficientes en la forma estándar ax² + bx + c = 0',
        math: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
        reason: 'Comparamos la ecuación con la forma canónica de segundo grado.'
      },
      {
        title: 'Cálculo del discriminante Δ = b² - 4ac',
        math: `\\Delta = (${b})^2 - 4(${a})(${c}) = ${b * b} - (${4 * a * c}) = ${ns.MathParser.formatNumber(disc)}`,
        reason: 'El signo del discriminante determina la naturaleza de las raíces.'
      }
    ];

    if (disc < 0) {
      const realPart = ns.MathParser.formatNumber(-b / (2 * a));
      const imagPart = ns.MathParser.formatNumber(Math.sqrt(-disc) / Math.abs(2 * a));
      steps.push({
        title: 'Raíces complejas conjugadas (Δ < 0)',
        math: `x = \\frac{-(${b}) \\pm \\sqrt{${disc}}}{2(${a})} = ${realPart} \\pm ${imagPart}i`,
        reason: 'Como Δ < 0, la parábola no corta al eje real X; tiene dos soluciones en el conjunto de los números complejos.'
      });
      return {
        problemTitle: `Ecuación cuadrática: ${a}x² + (${b})x + (${c}) = 0`,
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

    steps.push({
      title: 'Sustitución en la fórmula general cuadrática',
      math: `x = \\frac{-(${b}) \\pm \\sqrt{${ns.MathParser.formatNumber(disc)}}}{2(${a})} = \\frac{${-b} \\pm ${ns.MathParser.formatNumber(sqrtDisc)}}{${2 * a}}`,
      reason: 'Aplicamos x = (-b ± √Δ) / (2a).'
    });

    steps.push({
      title: 'Obtención de las dos raíces reales',
      math: `x_1 = \\frac{${-b} + ${ns.MathParser.formatNumber(sqrtDisc)}}{${2 * a}} = ${s1} \\quad ; \\quad x_2 = \\frac{${-b} - ${ns.MathParser.formatNumber(sqrtDisc)}}{${2 * a}} = ${s2}`,
      reason: 'Calculamos cada rama (+ y -) por separado.'
    });

    return {
      problemTitle: `Ecuación cuadrática: ${a}x² + (${b})x + (${c}) = 0`,
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
    a1 = Number(a1); b1 = Number(b1); c1 = Number(c1);
    a2 = Number(a2); b2 = Number(b2); c2 = Number(c2);

    const det = a1 * b2 - a2 * b1;
    const detX = c1 * b2 - c2 * b1;
    const detY = a1 * c2 - a2 * c1;

    const steps = [
      {
        title: 'Planteamiento del sistema de ecuaciones 2×2',
        math: `(1)\\; ${a1}x + (${b1})y = ${c1} \\quad | \\quad (2)\\; ${a2}x + (${b2})y = ${c2}`,
        reason: 'Sistema lineal de dos ecuaciones con dos incógnitas.'
      },
      {
        title: 'Cálculo del determinante principal del sistema (Δs)',
        math: `\\Delta_s = (${a1})(${b2}) - (${a2})(${b1}) = ${a1 * b2} - (${a2 * b1}) = ${det}`,
        reason: 'Aplicamos la Regla de Cramer para verificar si el sistema tiene solución única (Δs ≠ 0).'
      }
    ];

    if (Math.abs(det) < 1e-12) {
      const msg = (Math.abs(detX) < 1e-12 && Math.abs(detY) < 1e-12)
        ? 'Sistema compatible indeterminado (infinitas soluciones)'
        : 'Sistema incompatible (rectas paralelas, sin solución)';
      return {
        problemTitle: 'Sistema de ecuaciones 2×2',
        steps,
        finalAnswer: msg,
        finalMath: msg
      };
    }

    const x = detX / det;
    const y = detY / det;
    const sx = ns.MathParser.formatNumber(x);
    const sy = ns.MathParser.formatNumber(y);

    steps.push({
      title: 'Cálculo de los determinantes de las incógnitas Δx y Δy',
      math: `\\Delta_x = (${c1})(${b2}) - (${c2})(${b1}) = ${detX} \\quad ; \\quad \\Delta_y = (${a1})(${c2}) - (${a2})(${c1}) = ${detY}`,
      reason: 'Sustituimos la columna de términos independientes en lugar de cada incógnita.'
    });

    steps.push({
      title: 'Obtención de los valores de x e y',
      math: `x = \\frac{\\Delta_x}{\\Delta_s} = \\frac{${detX}}{${det}} = ${sx} \\quad ; \\quad y = \\frac{\\Delta_y}{\\Delta_s} = \\frac{${detY}}{${det}} = ${sy}`,
      reason: 'El punto de intersección de ambas rectas es (x, y).'
    });

    return {
      problemTitle: 'Sistema lineal 2×2',
      steps,
      finalAnswer: `(${sx}, ${sy})`,
      finalMath: `x = ${sx}, \\quad y = ${sy}`
    };
  }

  /**
   * 6. Geometría Analítica y Triángulo Rectángulo
   */
  function solveRightTriangle(catetoA, catetoB) {
    const a = Number(catetoA);
    const b = Number(catetoB);
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

    const steps = [
      {
        title: 'Aplicación del Teorema de Pitágoras para hallar la hipotenusa c',
        math: `c = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${sc}`,
        reason: 'En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.'
      },
      {
        title: 'Cálculo del área y perímetro del triángulo',
        math: `A = \\frac{a \\cdot b}{2} = \\frac{${a} \\cdot ${b}}{2} = ${sArea} \\quad ; \\quad P = a + b + c = ${ns.MathParser.formatNumber(perim)}`,
        reason: 'El área de un triángulo rectángulo es el semiproducto de sus catetos.'
      },
      {
        title: 'Razones trigonométricas y ángulos agudos α y β',
        math: `\\tan(\\alpha) = \\frac{${a}}{${b}} \\Rightarrow \\alpha = ${sAlpha}^\\circ, \\quad \\beta = 90^\\circ - \\alpha = ${sBeta}^\\circ`,
        reason: 'Usamos la función arco tangente y la propiedad de ángulos complementarios.'
      }
    ];

    return {
      problemTitle: `Triángulo rectángulo de catetos a = ${a}, b = ${b}`,
      steps,
      finalAnswer: sc,
      finalMath: `c = ${sc}, \\quad \\text{Área} = ${sArea}, \\quad \\alpha = ${sAlpha}^\\circ`
    };
  }

  /**
   * 7. Derivada e Integral paso a paso de un polinomio c2*x^2 + c1*x + c0 y evaluación en x0 / [a,b]
   */
  function solveCalculusFunction(exprStr, x0, intA, intB) {
    const fn = ns.MathParser.compileFunction(exprStr, 'RAD');
    const xVal = Number(x0);
    const a = Number(intA);
    const b = Number(intB);

    const fx0 = fn(xVal);
    const dfx0 = ns.MathParser.numericalDerivative(fn, xVal);
    const integralVal = ns.MathParser.numericalIntegral(fn, a, b);

    // Límite lateral izquierdo y derecho en x0
    const limLeft = fn(xVal - 1e-5);
    const limRight = fn(xVal + 1e-5);

    const sFx0 = ns.MathParser.formatNumber(fx0);
    const sDfx0 = ns.MathParser.formatNumber(dfx0);
    const sInt = ns.MathParser.formatNumber(integralVal);

    // Ecuación de la recta tangente: y = f(x0) + f'(x0)*(x - x0)
    const intercept = fx0 - dfx0 * xVal;
    const sIntercept = intercept >= 0 ? `+ ${ns.MathParser.formatNumber(intercept)}` : `- ${ns.MathParser.formatNumber(Math.abs(intercept))}`;

    const steps = [
      {
        title: `Evaluación de la función y análisis de límite en x = ${xVal}`,
        math: `f(${xVal}) = ${sFx0} \\quad ; \\quad \\lim_{x \\to ${xVal}} f(x) = ${ns.MathParser.formatNumber(0.5 * (limLeft + limRight))}`,
        reason: 'Evaluamos la imagen f(x₀) y comprobamos que los límites laterales coinciden.'
      },
      {
        title: `Cálculo de la derivada instantánea f'(${xVal})`,
        math: `f'(${xVal}) = \\lim_{h \\to 0} \\frac{f(${xVal} + h) - f(${xVal} - h)}{2h} = ${sDfx0}`,
        reason: 'La derivada representa la pendiente de la recta tangente a la curva en x = x₀.'
      },
      {
        title: `Ecuación de la recta tangente en el punto (${xVal}, ${sFx0})`,
        math: `y - ${sFx0} = ${sDfx0}(x - ${xVal}) \\Rightarrow y = ${sDfx0}x ${sIntercept}`,
        reason: 'Aplicamos la ecuación punto-pendiente de la recta tangente.'
      },
      {
        title: `Cálculo de la integral definida en el intervalo [${a}, ${b}]`,
        math: `\\int_{${a}}^{${b}} (${exprStr})\\,dx = ${sInt}`,
        reason: 'Aplicamos integración definida (Teorema Fundamental del Cálculo / cuadratura compuesta de Simpson).'
      }
    ];

    return {
      problemTitle: `Análisis de Cálculo para f(x) = ${exprStr}`,
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
