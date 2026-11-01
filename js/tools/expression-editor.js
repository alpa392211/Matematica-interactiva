/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Editor Guiado de Expresiones Matemáticas (Fase 1)
   Archivo: js/tools/expression-editor.js
   Diseñado para estudiantes que nunca han utilizado un editor matemático ni
   conocen LaTeX. Incluye:
   - Guía de bienvenida interactiva con los 5 casos prácticos y persistencia en localStorage.
   - Galería clicable de 8 ejemplos interactivos (5 casos base + límite, derivada e integral).
   - Barra de herramientas visual de inserción de estructuras y controles de edición
     (Limpiar todo, Deshacer/Reconstruir con historial, Copiar con confirmación visual).
   - Contenedor de entrada modularizado (`#editor-math-input-mount` + `EditorInputAdapter`)
     preparado para integrar `<math-field>` (MathLive) en la Fase 2.
   - Vista previa matemática grande en tiempo real con manejo amigable de expresiones
     incompletas (`□`) y detector automático de tipo de expresión.
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const GUIDE_STORAGE_KEY = 'mat_interactiva_editor_guide_seen_v1';

  /**
   * determinamos si el panel de ayuda debe mostrarse abierto inicialmente:
   * En la primera visita (cuando no existe el registro en localStorage) se abre
   * automáticamente y se marca como visto; además el usuario puede abrirlo/ocultarlo
   * en cualquier momento con el botón "¿Cómo usar el editor?".
   */
  function getInitialGuideOpenState() {
    try {
      const seen = window.localStorage.getItem(GUIDE_STORAGE_KEY);
      if (!seen) {
        window.localStorage.setItem(GUIDE_STORAGE_KEY, '1');
        return true;
      }
      return seen === 'open';
    } catch (_) {
      return true;
    }
  }

  function saveGuideOpenState(isOpen) {
    try {
      window.localStorage.setItem(GUIDE_STORAGE_KEY, isOpen ? 'open' : 'closed');
    } catch (_) {
      // Ignorar si localStorage está restringido
    }
  }

  const editorState = {
    currentExpression: '(x + 1)/(x - 1) + raiz(3, x^2)',
    evalX: 2,
    evalY: 1,
    guideOpen: getInitialGuideOpenState(),
    activeExampleIdx: 2,
    undoStack: ['(3 + 5)/2 * 4', '3*x^2 - 5*x + 2'],
    copyFormat: 'natural' // 'natural' | 'latex'
  };

  /**
   * Los 5 casos prácticos fundamentales para explicar visualmente y sin tecnicismos
   * cómo se escribe cada tipo de expresión matemática.
   */
  const FIVE_PRACTICAL_CASES = [
    {
      num: '1',
      badge: '🔢 Operación',
      title: 'Escribir una operación',
      formulaLatex: '\\frac{3 + 5}{2} \\times 4',
      inputExample: '(3 + 5)/2 * 4',
      explanation: 'Combina números con sumas (+), restas (-), multiplicaciones (*) y divisiones (/). Usa paréntesis para agrupar lo que va arriba de una fracción.',
      keyDifference: 'Solo contiene números y entrega un resultado inmediato (16).'
    },
    {
      num: '2',
      badge: '🔤 Expresión algebraica',
      title: 'Introducir una expresión algebraica',
      formulaLatex: '3x^2 - 5x + 2',
      inputExample: '3x^2 - 5x + 2',
      explanation: 'Combina números y letras (variables como x) con exponentes (^), pero NO lleva signo igual (=). Puedes escribir 3x^2 directamente.',
      keyDifference: 'No tiene signo igual (=); su valor cambia según el número que pongas en x.'
    },
    {
      num: '3',
      badge: '➗ Fracción o radical',
      title: 'Construir una fracción o radical',
      formulaLatex: '\\frac{x + 1}{x - 1}, \\quad \\sqrt[3]{x^2}',
      inputExample: '(x + 1)/(x - 1) + raiz(3, x^2)',
      explanation: 'En una fracción coloca entre paréntesis el numerador (arriba) y el denominador (abajo): (x+1)/(x-1). Para raíces con índice usa el botón Raíz n-ésima: raiz(índice, interior).',
      keyDifference: 'Estructura visual con barra de división horizontal o símbolo de raíz con índice.'
    },
    {
      num: '4',
      badge: '📈 Función',
      title: 'Introducir una función',
      formulaLatex: 'f(x) = \\operatorname{sen}(x) + x^2',
      inputExample: 'f(x) = sen(x) + x^2',
      explanation: 'Empieza con f(x) = (o y =) seguido de la regla matemática. Indica cómo calcular la salida para cualquier valor de x y permite dibujar su curva en el Graficador.',
      keyDifference: 'Define una relación entrada → salida que se puede evaluar y graficar.'
    },
    {
      num: '5',
      badge: '⚖️ Ecuación',
      title: 'Introducir una ecuación',
      formulaLatex: '2x + 5 = 13',
      inputExample: '2x + 5 = 13',
      explanation: 'Conecta dos expresiones mediante el signo igual (=) para buscar qué valor de la incógnita x hace que ambos lados valgan lo mismo.',
      keyDifference: 'Lleva signo igual (=) entre dos lados para despejar y hallar la incógnita (x = 4).'
    }
  ];

  /**
   * Galería de 8 ejemplos interactivos clicables:
   * Uno por cada una de las 5 categorías anteriores + Límite, Derivada e Integral.
   */
  const INTERACTIVE_EXAMPLES = [
    {
      category: '1. Operación',
      label: 'Operación combinada',
      latex: '\\frac{3 + 5}{2} \\times 4',
      expr: '(3 + 5)/2 * 4',
      x0: 2,
      structureHint: 'El paréntesis (3 + 5) agrupa el numerador antes de dividir entre 2 y multiplicar por 4.'
    },
    {
      category: '2. Expresión algebraica',
      label: 'Polinomio de 2° grado',
      latex: '3x^2 - 5x + 2',
      expr: '3x^2 - 5x + 2',
      x0: 2,
      structureHint: 'El símbolo ^ eleva la variable x al cuadrado (x^2). No requiere escribir signo de igual.'
    },
    {
      category: '3. Fracción y radical',
      label: 'Fracción y raíz cúbica',
      latex: '\\frac{x + 1}{x - 1} + \\sqrt[3]{x^2}',
      expr: '(x + 1)/(x - 1) + raiz(3, x^2)',
      x0: 3,
      structureHint: 'En (x+1)/(x-1) el primer paréntesis es el numerador y el segundo el denominador; en raiz(3, x^2) el 3 es el índice.'
    },
    {
      category: '4. Función',
      label: 'Función trigonométrica',
      latex: 'f(x) = \\operatorname{sen}(x) + x^2',
      expr: 'f(x) = sen(x) + x^2',
      x0: 1.5,
      structureHint: 'f(x) = define la regla de correspondencia para evaluarla o enviarla con un clic al Graficador.'
    },
    {
      category: '5. Ecuación',
      label: 'Ecuación lineal',
      latex: '2x + 5 = 13',
      expr: '2x + 5 = 13',
      x0: 4,
      structureHint: 'El signo = compara ambos lados; el laboratorio inferior encuentra automáticamente el valor de x que cumple la igualdad (x = 4).'
    },
    {
      category: '6. Límite',
      label: 'Límite notable',
      latex: '\\lim_{x \\to 2} \\left(\\frac{x^2 - 4}{x - 2}\\right)',
      expr: 'lim((x^2 - 4)/(x - 2), x -> 2)',
      x0: 2,
      structureHint: 'Estructura lim(expresión, x -> valor): el primer bloque es la función y después de la coma se indica a qué valor tiende x.'
    },
    {
      category: '7. Derivada',
      label: 'Derivada de un polinomio',
      latex: '\\frac{d}{dx}\\left[x^3 - 3x\\right]',
      expr: 'derivada(x^3 - 3x)',
      x0: 2,
      structureHint: 'Estructura derivada(expresión): calcula la razón de cambio instantánea y la recta tangente en el punto x₀.'
    },
    {
      category: '8. Integral',
      label: 'Integral definida',
      latex: '\\int_{0}^{3} \\left(4 - x^2\\right)\\,dx',
      expr: 'integral(4 - x^2, 0, 3)',
      x0: 3,
      structureHint: 'Estructura integral(expresión, límite_inferior, límite_superior): calcula el área neta acumulada bajo la curva.'
    }
  ];

  /**
   * Barra de herramientas visual para insertar estructuras matemáticas directamente
   * en la posición del cursor sin memorizar sintaxis.
   */
  const STRUCTURE_TOOLBAR_GROUPS = [
    {
      groupTitle: 'Estructuras Básicas y Agrupación',
      buttons: [
        {
          id: 'struct-frac',
          name: 'Fracción',
          latexIcon: '\\frac{a}{b}',
          latexTemplate: '\\frac{#?}{#?}',
          snippet: '()/()',
          cursorOffset: 1,
          selectLen: 0,
          wrapSelection: (sel) => `(${sel})/()`,
          wrapCursorOffset: (sel) => sel.length + 4,
          tooltip: 'Insertar fracción: (numerador)/(denominador)'
        },
        {
          id: 'struct-pow',
          name: 'Potencia',
          latexIcon: 'x^{n}',
          latexTemplate: '{#?}^{#?}',
          snippet: 'x^()',
          cursorOffset: 3,
          selectLen: 0,
          wrapSelection: (sel) => `(${sel})^()`,
          wrapCursorOffset: (sel) => sel.length + 4,
          tooltip: 'Insertar exponente o potencia'
        },
        {
          id: 'struct-sqrt',
          name: 'Raíz cuadrada',
          latexIcon: '\\sqrt{x}',
          latexTemplate: '\\sqrt{#?}',
          snippet: 'raiz()',
          cursorOffset: 5,
          selectLen: 0,
          wrapSelection: (sel) => `raiz(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 6,
          tooltip: 'Insertar raíz cuadrada: √(x)'
        },
        {
          id: 'struct-nthroot',
          name: 'Raíz n-ésima',
          latexIcon: '\\sqrt[n]{x}',
          latexTemplate: '\\sqrt[#?]{#?}',
          snippet: 'raiz(3, )',
          cursorOffset: 8,
          selectLen: 0,
          wrapSelection: (sel) => `raiz(3, ${sel})`,
          wrapCursorOffset: (sel) => 5,
          tooltip: 'Insertar raíz con índice n: raiz(índice, radicando)'
        },
        {
          id: 'struct-paren',
          name: 'Paréntesis',
          latexIcon: '( \\; )',
          latexTemplate: '\\left(#?\\right)',
          snippet: '()',
          cursorOffset: 1,
          selectLen: 0,
          wrapSelection: (sel) => `(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 2,
          tooltip: 'Agrupar con paréntesis ( )'
        },
        {
          id: 'struct-abs',
          name: 'Valor absoluto',
          latexIcon: '|x|',
          latexTemplate: '\\left|#?\\right|',
          snippet: 'abs()',
          cursorOffset: 4,
          selectLen: 0,
          wrapSelection: (sel) => `abs(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 5,
          tooltip: 'Insertar valor absoluto |x|'
        }
      ]
    },
    {
      groupTitle: 'Funciones y Operadores de Cálculo',
      buttons: [
        {
          id: 'struct-sin',
          name: 'Seno',
          latexIcon: '\\operatorname{sen}(x)',
          latexTemplate: '\\sin\\left(#?\\right)',
          snippet: 'sen()',
          cursorOffset: 4,
          selectLen: 0,
          wrapSelection: (sel) => `sen(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 5,
          tooltip: 'Función trigonométrica seno: sen(x)'
        },
        {
          id: 'struct-cos',
          name: 'Coseno',
          latexIcon: '\\cos(x)',
          latexTemplate: '\\cos\\left(#?\\right)',
          snippet: 'cos()',
          cursorOffset: 4,
          selectLen: 0,
          wrapSelection: (sel) => `cos(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 5,
          tooltip: 'Función trigonométrica coseno: cos(x)'
        },
        {
          id: 'struct-tan',
          name: 'Tangente',
          latexIcon: '\\tan(x)',
          latexTemplate: '\\tan\\left(#?\\right)',
          snippet: 'tan()',
          cursorOffset: 4,
          selectLen: 0,
          wrapSelection: (sel) => `tan(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 5,
          tooltip: 'Función trigonométrica tangente: tan(x)'
        },
        {
          id: 'struct-ln',
          name: 'Logaritmo ln',
          latexIcon: '\\ln(x)',
          latexTemplate: '\\ln\\left(#?\\right)',
          snippet: 'ln()',
          cursorOffset: 3,
          selectLen: 0,
          wrapSelection: (sel) => `ln(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 4,
          tooltip: 'Logaritmo natural: ln(x)'
        },
        {
          id: 'struct-log',
          name: 'Logaritmo base 10',
          latexIcon: '\\log(x)',
          latexTemplate: '\\log\\left(#?\\right)',
          snippet: 'log()',
          cursorOffset: 4,
          selectLen: 0,
          wrapSelection: (sel) => `log(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 5,
          tooltip: 'Logaritmo base 10: log(x)'
        },
        {
          id: 'struct-lim',
          name: 'Límite',
          latexIcon: '\\lim_{x \\to a}',
          latexTemplate: '\\lim_{x \\to #?}\\left(#?\\right)',
          snippet: 'lim(, x -> 0)',
          cursorOffset: 4,
          selectLen: 0,
          wrapSelection: (sel) => `lim(${sel}, x -> 0)`,
          wrapCursorOffset: (sel) => sel.length + 11,
          tooltip: 'Insertar límite cuando x tiende a un valor: lim(f(x), x -> a)'
        },
        {
          id: 'struct-deriv',
          name: 'Derivada',
          latexIcon: '\\frac{d}{dx}',
          latexTemplate: '\\frac{d}{dx}\\left(#?\\right)',
          snippet: 'derivada()',
          cursorOffset: 9,
          selectLen: 0,
          wrapSelection: (sel) => `derivada(${sel})`,
          wrapCursorOffset: (sel) => sel.length + 10,
          tooltip: 'Insertar derivada respecto a x: derivada(f(x))'
        },
        {
          id: 'struct-int',
          name: 'Integral',
          latexIcon: '\\int_{a}^{b}',
          latexTemplate: '\\int_{#?}^{#?} #? \\, dx',
          snippet: 'integral(, 0, 1)',
          cursorOffset: 9,
          selectLen: 0,
          wrapSelection: (sel) => `integral(${sel}, 0, 1)`,
          wrapCursorOffset: (sel) => sel.length + 11,
          tooltip: 'Insertar integral definida: integral(f(x), desde, hasta)'
        }
      ]
    },
    {
      groupTitle: 'Constantes y Símbolos Rápidos',
      buttons: [
        {
          id: 'struct-fn-def',
          name: 'Función f(x)=',
          latexIcon: 'f(x)=',
          latexTemplate: 'f(x)=',
          snippet: 'f(x) = ',
          cursorOffset: 7,
          selectLen: 0,
          tooltip: 'Iniciar definición de función f(x) ='
        },
        {
          id: 'struct-eq-sign',
          name: 'Igualdad =',
          latexIcon: '=',
          latexTemplate: '=',
          snippet: ' = ',
          cursorOffset: 3,
          selectLen: 0,
          tooltip: 'Insertar signo igual para ecuaciones'
        },
        {
          id: 'struct-pi',
          name: 'Número Pi',
          latexIcon: '\\pi',
          latexTemplate: '\\pi',
          snippet: 'pi',
          cursorOffset: 2,
          selectLen: 0,
          tooltip: 'Insertar constante π (pi ≈ 3.14159)'
        },
        {
          id: 'struct-e',
          name: 'Número e',
          latexIcon: 'e^{x}',
          latexTemplate: 'e^{#?}',
          snippet: 'e^()',
          cursorOffset: 3,
          selectLen: 0,
          tooltip: 'Insertar exponencial natural e^x'
        },
        {
          id: 'struct-inf',
          name: 'Infinito',
          latexIcon: '\\infty',
          latexTemplate: '\\infty',
          snippet: 'inf',
          cursorOffset: 3,
          selectLen: 0,
          tooltip: 'Insertar símbolo de infinito (∞)'
        }
      ]
    }
  ];

  /**
   * Inserta texto en un input/textarea exactamente donde está el cursor,
   * conservando el foco y seleccionando el marcador interno si aplica.
   */
  function insertAtCursor(inputEl, snippet, selectOffset, selectLen) {
    if (!inputEl) return;
    const start = typeof inputEl.selectionStart === 'number' ? inputEl.selectionStart : inputEl.value.length;
    const end = typeof inputEl.selectionEnd === 'number' ? inputEl.selectionEnd : inputEl.value.length;
    const selectedText = inputEl.value.slice(start, end);

    let finalSnippet = snippet;
    if (selectedText && selectLen > 0 && typeof selectOffset === 'number') {
      finalSnippet = snippet.slice(0, selectOffset) + selectedText + snippet.slice(selectOffset + selectLen);
    }

    inputEl.value = inputEl.value.slice(0, start) + finalSnippet + inputEl.value.slice(end);
    inputEl.focus();

    if (typeof selectOffset === 'number' && !selectedText) {
      const newStart = start + selectOffset;
      const newEnd = newStart + (selectLen || 0);
      inputEl.setSelectionRange(newStart, newEnd);
    } else {
      const pos = start + finalSnippet.length;
      inputEl.setSelectionRange(pos, pos);
    }
  }

  /**
   * ============================================================================
   * ADAPTADOR MODULAR DE ENTRADA MATEMÁTICA (Fase 2: Integrado con MathLive)
   * ============================================================================
   * Monta y controla un componente `<math-field>` (con respaldo sincronizado) dentro
   * de `#editor-math-input-mount` a través de `ns.MathInput.createMathFieldController`,
   * traduciendo de forma transparente entre LaTeX visual y la sintaxis del motor CAS.
   */
  const EditorInputAdapter = {
    controller: null,
    inputEl: null,
    onChangeCallback: null,

    mount(mountContainer, initialValue, onChange) {
      if (!mountContainer) return;
      this.onChangeCallback = onChange;

      if (ns.MathInput && typeof ns.MathInput.createMathFieldController === 'function') {
        this.controller = ns.MathInput.createMathFieldController(mountContainer, {
          id: 'editor-primary-mathfield',
          fallbackInputId: 'editor-primary-input',
          initialCasValue: initialValue,
          placeholder: 'Escribe aquí tu operación, expresión, función o ecuación, o usa el teclado visual...',
          ariaLabel: 'Campo principal de expresión matemática',
          onChange: (casVal, meta) => {
            if (typeof this.onChangeCallback === 'function') {
              this.onChangeCallback(casVal, meta || { source: 'mathfield' });
            }
          }
        });
        this.inputEl = this.controller.mathFieldEl || this.controller.fallbackInput;
        return;
      }

      // Respaldo directo si MathInput no estuviera disponible
      mountContainer.innerHTML = `
        <div class="editor-input-field-shell" data-mathlive-ready="true">
          <input
            type="text"
            id="editor-primary-input"
            class="editor-primary-input"
            value="${String(initialValue || '').replace(/"/g, '&quot;')}"
            placeholder="Escribe aquí tu operación, expresión, función o ecuación, o usa los botones de arriba..."
            autocomplete="off"
            spellcheck="false"
            aria-label="Campo principal de expresión matemática"
          />
        </div>
      `;
      this.inputEl = mountContainer.querySelector('#editor-primary-input');
      if (this.inputEl) {
        this.inputEl.addEventListener('input', () => {
          if (typeof this.onChangeCallback === 'function') {
            this.onChangeCallback(this.inputEl.value, { source: 'typing' });
          }
        });
      }
    },

    getValue() {
      if (this.controller) {
        return this.controller.getCasValue();
      }
      return this.inputEl ? this.inputEl.value : editorState.currentExpression;
    },

    getLatex() {
      if (this.controller) {
        return this.controller.getLatex();
      }
      return ns.MathRenderer.algebraicToLatex(this.getValue());
    },

    setValue(newVal, options = {}) {
      const strVal = String(newVal ?? '');
      if (options.recordUndo !== false && editorState.currentExpression !== strVal) {
        pushUndoState(editorState.currentExpression);
      }
      editorState.currentExpression = strVal;

      if (this.controller) {
        this.controller.setCasValue(strVal, { silent: true, focus: options.focus });
      } else if (this.inputEl) {
        this.inputEl.value = strVal;
        if (options.focus) {
          this.inputEl.focus();
          const len = strVal.length;
          if (typeof this.inputEl.setSelectionRange === 'function') {
            this.inputEl.setSelectionRange(len, len);
          }
        }
      }

      if (typeof this.onChangeCallback === 'function') {
        this.onChangeCallback(strVal, { source: options.source || 'setValue' });
      }
    },

    insertStructure(btnConfig) {
      if (!btnConfig) return;
      pushUndoState(this.getValue());

      if (this.controller) {
        this.controller.insertTemplate({
          latexTemplate: btnConfig.latexTemplate || btnConfig.latexIcon,
          fallbackSnippet: btnConfig.snippet,
          cursorOffset: btnConfig.cursorOffset
        });
        editorState.currentExpression = this.controller.getCasValue();
        return;
      }

      if (!this.inputEl) return;
      const start = typeof this.inputEl.selectionStart === 'number' ? this.inputEl.selectionStart : this.inputEl.value.length;
      const end = typeof this.inputEl.selectionEnd === 'number' ? this.inputEl.selectionEnd : this.inputEl.value.length;
      const selected = this.inputEl.value.slice(start, end);

      if (selected && typeof btnConfig.wrapSelection === 'function') {
        const wrapped = btnConfig.wrapSelection(selected);
        this.inputEl.value = this.inputEl.value.slice(0, start) + wrapped + this.inputEl.value.slice(end);
        this.inputEl.focus();
        const offset = typeof btnConfig.wrapCursorOffset === 'function'
          ? btnConfig.wrapCursorOffset(selected)
          : wrapped.length;
        const nextPos = start + offset;
        this.inputEl.setSelectionRange(nextPos, nextPos);
      } else {
        insertAtCursor(this.inputEl, btnConfig.snippet, btnConfig.cursorOffset, btnConfig.selectLen || 0);
      }

      editorState.currentExpression = this.inputEl.value;
      if (typeof this.onChangeCallback === 'function') {
        this.onChangeCallback(this.inputEl.value, { source: 'toolbar' });
      }
    },

    clear() {
      if (this.getValue().trim() !== '') {
        pushUndoState(this.getValue());
      }
      this.setValue('', { recordUndo: false, focus: true, source: 'clear' });
    },

    undo() {
      if (editorState.undoStack.length === 0) return false;
      const previous = editorState.undoStack.pop();
      this.setValue(previous, { recordUndo: false, focus: true, source: 'undo' });
      return true;
    },

    focus() {
      if (this.controller) {
        this.controller.focus();
      } else {
        this.inputEl?.focus();
      }
    }
  };

  function pushUndoState(prevExpr) {
    const clean = String(prevExpr ?? '');
    const top = editorState.undoStack[editorState.undoStack.length - 1];
    if (top !== clean) {
      editorState.undoStack.push(clean);
      if (editorState.undoStack.length > 40) {
        editorState.undoStack.shift();
      }
    }
  }

  /**
   * Copia texto al portapapeles de forma compatible con cualquier navegador
   * y contexto de seguridad.
   */
  async function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Continuar al respaldo con textarea temporal
      }
    }
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(temp);
    return ok;
  }

  /**
   * Renderiza la vista principal del Editor de Expresiones Matemáticas (Fase 1).
   */
  function renderExpressionEditorView(container) {
    if (!container) return;

    const previewData = ns.MathRenderer.renderEditorPreview(editorState.currentExpression, true);

    container.innerHTML = `
      <!-- Encabezado con botón de apertura/cierre de la Guía de Bienvenida -->
      <div class="subject-header-card">
        <div class="subject-header-top">
          <div class="subject-title-group">
            <div class="subject-big-icon">∑</div>
            <div class="subject-title-text">
              <h1>Editor Interactivo de Expresiones Matemáticas</h1>
              <p>Construye operaciones, expresiones algebraicas, fracciones, raíces, funciones y ecuaciones paso a paso con botones visuales y vista previa instantánea.</p>
            </div>
          </div>
          <div class="editor-header-actions">
            <button
              type="button"
              id="btn-toggle-editor-guide"
              class="btn ${editorState.guideOpen ? 'btn-primary' : 'btn-outline'}"
              aria-expanded="${editorState.guideOpen ? 'true' : 'false'}">
              ❓ ¿Cómo usar el editor? ${editorState.guideOpen ? '(Ocultar guía)' : '(Ver guía rápida)'}
            </button>
          </div>
        </div>
      </div>

      <!-- SECCIÓN A: Guía de Bienvenida e Instrucciones Claras (5 Casos Prácticos) -->
      <section
        id="editor-welcome-guide"
        class="content-card editor-guide-card ${editorState.guideOpen ? 'is-open' : 'is-collapsed'}"
        aria-label="Guía de bienvenida del editor matemático">
        <div class="editor-guide-header">
          <div>
            <span class="editor-guide-pill">👋 Guía rápida sin tecnicismos</span>
            <h2>¿Cómo escribir fórmulas en este editor sin saber programación?</h2>
            <p class="theory-paragraph" style="margin-bottom:0;">
              No necesitas memorizar códigos especiales. Puedes <strong>hacer clic en los botones de estructuras</strong> para que el editor coloque los paréntesis por ti, o escribir con tu teclado normal siguiendo estos <strong>5 casos prácticos</strong> (haz clic en cualquiera para probarlo):
            </p>
          </div>
          <button type="button" id="btn-close-guide-card" class="btn btn-outline btn-sm" title="Ocultar esta guía">
            ✕ Ocultar ayuda
          </button>
        </div>

        <div class="editor-cases-grid">
          ${FIVE_PRACTICAL_CASES.map((item, idx) => `
            <article class="editor-case-card" data-case-load="${item.inputExample.replace(/"/g, '&quot;')}" data-case-idx="${idx}" tabindex="0" role="button" title="Haz clic para cargar este caso en el editor">
              <div class="editor-case-top">
                <span class="editor-case-badge">${item.badge}</span>
                <span class="editor-case-try">Probar en el editor →</span>
              </div>
              <h3 class="editor-case-title">${item.num}. ${item.title}</h3>
              <div class="editor-case-math">
                ${ns.MathRenderer.renderMath(item.formulaLatex, false)}
              </div>
              <div class="editor-case-typed">
                <span>Se escribe así:</span>
                <code>${item.inputExample}</code>
              </div>
              <p class="editor-case-desc">${item.explanation}</p>
              <div class="editor-case-diff">
                <strong>Diferencia clave:</strong> ${item.keyDifference}
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- SECCIÓN B: Galería de Ejemplos Interactivos Clicables -->
      <section class="content-card editor-examples-section" aria-label="Ejemplos interactivos clicables">
        <div class="editor-section-header-row">
          <div>
            <h2>1. Ejemplos Interactivos Clicables</h2>
            <p class="theory-paragraph" style="margin-bottom:0;">
              Haz clic en cualquier ejemplo para cargarlo en el editor, ver cómo se estructura y modificar sus números o variables sobre la marcha:
            </p>
          </div>
          <span class="editor-examples-hint">💡 8 plantillas listas para explorar</span>
        </div>

        <div class="editor-examples-gallery" id="editor-examples-gallery">
          ${INTERACTIVE_EXAMPLES.map((ex, idx) => `
            <button
              type="button"
              class="editor-example-chip ${editorState.activeExampleIdx === idx ? 'active' : ''}"
              data-example-idx="${idx}"
              title="Cargar ejemplo: ${ex.label}">
              <span class="example-chip-cat">${ex.category}</span>
              <span class="example-chip-math">${ns.MathRenderer.renderMath(ex.latex, false)}</span>
              <span class="example-chip-code"><code>${ex.expr}</code></span>
            </button>
          `).join('')}
        </div>

        <div class="editor-structure-explainer" id="editor-structure-explainer">
          <strong>🔍 Cómo se estructura este ejemplo:</strong>
          <span id="editor-structure-explainer-text">
            ${INTERACTIVE_EXAMPLES[editorState.activeExampleIdx]?.structureHint || 'Usa paréntesis para agrupar numeradores, denominadores o el interior de una raíz.'}
          </span>
        </div>
      </section>

      <div class="two-col-grid">
        <!-- Columna Izquierda: SECCIÓN C (Barra de Herramientas y Entrada Modular) + SECCIÓN D (Vista Previa en Tiempo Real) -->
        <div class="content-card">
          <div class="editor-section-header-row">
            <h2>2. Constructor Guiado de Expresiones</h2>
            <span id="editor-detected-type-badge" class="editor-type-badge">${previewData.classification.badge}</span>
          </div>
          <p class="theory-paragraph" style="margin-bottom:0.75rem;">
            Coloca el cursor donde quieras insertar una estructura (o selecciona parte de tu fórmula para envolverla) y pulsa un botón:
          </p>

          <!-- Barra de Herramientas de Estructuras Matemáticas -->
          <div class="editor-symbol-groups">
            ${STRUCTURE_TOOLBAR_GROUPS.map((grp, gIdx) => `
              <div class="editor-toolbar-group">
                <div class="editor-toolbar-group-title">${grp.groupTitle}</div>
                <div class="symbol-palette-row">
                  ${grp.buttons.map((b, bIdx) => `
                    <button
                      type="button"
                      class="symbol-insert-btn editor-struct-btn"
                      data-struct-group="${gIdx}"
                      data-struct-btn="${bIdx}"
                      title="${b.tooltip}">
                      <span class="struct-btn-icon">${ns.MathRenderer.renderMath(b.latexIcon, false)}</span>
                      <span class="struct-btn-label">${b.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Controles Directos de Edición (Limpiar, Deshacer, Copiar expresión) -->
          <div class="editor-action-controls-bar">
            <div class="editor-action-left">
              <button type="button" id="btn-editor-undo" class="btn btn-outline btn-sm" title="Deshacer el último cambio y recuperar la expresión anterior">
                ↩️ Deshacer cambio
              </button>
              <button type="button" id="btn-editor-clear" class="btn btn-outline btn-sm editor-clear-btn" title="Borrar todo y limpiar el editor">
                🗑️ Limpiar todo
              </button>
            </div>
            <div class="editor-action-right">
              <button type="button" id="btn-editor-copy-natural" class="btn btn-primary btn-sm" title="Copiar la expresión al portapapeles">
                📋 Copiar expresión
              </button>
              <button type="button" id="btn-editor-copy-latex" class="btn btn-outline btn-sm" title="Copiar en formato simbólico para documentos">
                📄 Copiar formato simbólico
              </button>
              <span id="editor-copy-toast" class="editor-copy-toast" role="status" aria-live="polite"></span>
            </div>
          </div>

          <!-- Contenedor Modularizado de Entrada (<math-field> de MathLive + Respaldo) -->
          <div class="editor-input-section">
            <label for="editor-primary-input" class="editor-input-label">
              <span>✏️ Tu expresión matemática (escritura híbrida: teclado físico o teclado visual):</span>
              <span id="editor-cursor-status" class="editor-cursor-status">Campo visual MathLive activo</span>
            </label>
            <div id="editor-math-input-mount" class="editor-math-input-mount"></div>
          </div>

          <!-- Teclado Matemático Visual en 6 Categorías -->
          <div id="editor-visual-keyboard-mount" class="editor-visual-keyboard-mount"></div>

          <!-- SECCIÓN D: Vista Previa Matemática en Tiempo Real y Estado de Completitud -->
          <div class="editor-preview-wrapper">
            <div class="editor-preview-header">
              <span class="editor-preview-title">👁️ Vista Previa Matemática en Tiempo Real</span>
              <span
                id="editor-completeness-status"
                class="editor-completeness-badge ${previewData.isIncomplete ? 'status-incomplete' : previewData.isEmpty ? 'status-empty' : 'status-complete'}">
                ${previewData.isIncomplete
                  ? `✏️ En construcción: ${previewData.incompleteReason}`
                  : previewData.isEmpty
                  ? '✨ Esperando expresión'
                  : '✓ Estructura completa y bien formada'}
              </span>
            </div>

            <div
              class="editor-preview-stage ${previewData.isIncomplete ? 'is-incomplete' : ''}"
              id="editor-live-preview"
              aria-live="polite">
              ${previewData.html}
            </div>

            <!-- Tarjeta informativa del tipo de expresión detectado -->
            <div class="editor-classification-banner" id="editor-classification-banner">
              <div class="classification-banner-title">
                <strong id="editor-class-title">${previewData.classification.title}</strong>
              </div>
              <p id="editor-class-desc" class="classification-banner-desc">${previewData.classification.description}</p>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Evaluador Inteligente, Solucionador y Formatos Aceptados -->
        <div class="content-card">
          <h2>3. Laboratorio y Comprobador en Vivo</h2>
          <p class="theory-paragraph">
            ${ns.MathRenderer.formatRichText('El motor matemático analiza automáticamente tu expresión según su categoría (calcula operaciones numéricas, evalúa fórmulas en $x_0$, resuelve ecuaciones o calcula límites, derivadas e integrales):')}
          </p>

          <div class="editor-eval-controls-grid">
            <div>
              <label for="editor-eval-x" class="editor-param-label">
                ${ns.MathRenderer.formatRichText('Valor de prueba para $x_0$:')}
              </label>
              <input
                type="number"
                step="0.5"
                id="editor-eval-x"
                class="exercise-input"
                style="width:100%;"
                value="${editorState.evalX}" />
            </div>
            <div>
              <label for="editor-eval-y" class="editor-param-label">
                ${ns.MathRenderer.formatRichText('Parámetro opcional $y$:')}
              </label>
              <input
                type="number"
                step="0.5"
                id="editor-eval-y"
                class="exercise-input"
                style="width:100%;"
                value="${editorState.evalY}" />
            </div>
          </div>

          <div id="editor-eval-results" class="editor-eval-results-stack"></div>

          <div class="editor-graph-btn-row">
            <button type="button" class="btn btn-primary" id="btn-send-to-grapher" style="width:100%;">
              📈 Enviar esta expresión al Graficador Interactivo
            </button>
          </div>

          <!-- Guía de Formatos Aceptados por el Motor Matemático -->
          <div class="editor-accepted-formats-box">
            <h3>✅ Formatos que acepta el editor y los ejercicios</h3>
            <p class="accepted-formats-intro">
              Puedes escribir de la forma que te resulte más cómoda; el sistema reconoce equivalencias automáticamente:
            </p>
            <ul class="accepted-formats-list">
              <li>
                <strong>Multiplicación:</strong> puedes escribir <code>3*x</code>, <code>3·x</code> o simplemente <code>3x</code> y <code>2(x+1)</code> (multiplicación implícita automática).
              </li>
              <li>
                <strong>Fracciones:</strong> usa <code>(numerador)/(denominador)</code> como <code>(x+1)/(x-1)</code> o fracciones simples como <code>3/4</code>.
              </li>
              <li>
                <strong>Potencias y raíces:</strong> usa <code>x^2</code> o <code>x^(n+1)</code> para exponentes; <code>raiz(x)</code> o <code>sqrt(x)</code> para raíz cuadrada y <code>raiz(3, x^2)</code> para raíz con índice.
              </li>
              <li>
                <strong>Funciones en español o inglés:</strong> acepta tanto <code>sen(x)</code>, <code>tg(x)</code>, <code>raiz(x)</code> como <code>sin(x)</code>, <code>tan(x)</code>, <code>sqrt(x)</code>, además de <code>cos(x)</code>, <code>ln(x)</code>, <code>log(x)</code> y <code>abs(x)</code> o <code>|x|</code>.
              </li>
              <li>
                <strong>Constantes:</strong> escribe <code>pi</code> (o <code>π</code>) para ${ns.MathRenderer.renderMath('\\pi')}, <code>e</code> para el número de Euler y <code>inf</code> para ${ns.MathRenderer.renderMath('\\infty')}.
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;

    const mountNode = container.querySelector('#editor-math-input-mount');
    EditorInputAdapter.mount(mountNode, editorState.currentExpression, (newValue, meta) => {
      handleExpressionChange(container, newValue, meta);
    });

    const vkbMount = container.querySelector('#editor-visual-keyboard-mount');
    if (vkbMount && ns.MathInput && typeof ns.MathInput.renderVisualKeyboard === 'function') {
      ns.MathInput.renderVisualKeyboard(vkbMount, () => EditorInputAdapter.controller, {
        collapsible: false,
        initialCategory: 'basicas',
        title: '⌨️ Teclado Matemático Visual en 6 Categorías (Inserción directa en el cursor)'
      });
    }

    bindEditorEvents(container);
    updateAnalysisPanel(container);
  }

  /**
   * Actualiza en tiempo real la vista previa, el indicador de expresión incompleta,
   * la insignia de categoría y el panel de resultados del laboratorio.
   */
  function handleExpressionChange(container, rawValue, meta = {}) {
    if (meta.source !== 'undo' && meta.source !== 'setValue' && editorState.currentExpression !== rawValue) {
      pushUndoState(editorState.currentExpression);
    }
    editorState.currentExpression = rawValue;

    const previewData = ns.MathRenderer.renderEditorPreview(rawValue, true);
    const previewStage = container.querySelector('#editor-live-preview');
    const completenessEl = container.querySelector('#editor-completeness-status');
    const typeBadgeEl = container.querySelector('#editor-detected-type-badge');
    const classTitleEl = container.querySelector('#editor-class-title');
    const classDescEl = container.querySelector('#editor-class-desc');

    if (previewStage) {
      previewStage.innerHTML = previewData.html;
      previewStage.classList.toggle('is-incomplete', previewData.isIncomplete);
    }

    if (completenessEl) {
      completenessEl.className = `editor-completeness-badge ${
        previewData.isIncomplete ? 'status-incomplete' : previewData.isEmpty ? 'status-empty' : 'status-complete'
      }`;
      completenessEl.textContent = previewData.isIncomplete
        ? `✏️ En construcción: ${previewData.incompleteReason}`
        : previewData.isEmpty
        ? '✨ Esperando expresión'
        : '✓ Estructura completa y bien formada';
    }

    if (typeBadgeEl) {
      typeBadgeEl.textContent = previewData.classification.badge;
    }
    if (classTitleEl) {
      classTitleEl.textContent = previewData.classification.title;
    }
    if (classDescEl) {
      classDescEl.textContent = previewData.classification.description;
    }

    if (meta.source !== 'example') {
      container.querySelectorAll('.editor-example-chip.active').forEach(btn => btn.classList.remove('active'));
    }

    updateAnalysisPanel(container);
  }

  /**
   * Conecta todos los eventos interactivos de la vista del Editor.
   */
  function bindEditorEvents(container) {
    // 1. Mostrar / Ocultar la Guía de Bienvenida
    const toggleGuideBtn = container.querySelector('#btn-toggle-editor-guide');
    const closeGuideBtn = container.querySelector('#btn-close-guide-card');
    const guideSection = container.querySelector('#editor-welcome-guide');

    function setGuideVisibility(open) {
      editorState.guideOpen = open;
      saveGuideOpenState(open);
      if (guideSection) {
        guideSection.classList.toggle('is-open', open);
        guideSection.classList.toggle('is-collapsed', !open);
      }
      if (toggleGuideBtn) {
        toggleGuideBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggleGuideBtn.className = `btn ${open ? 'btn-primary' : 'btn-outline'}`;
        toggleGuideBtn.innerHTML = `❓ ¿Cómo usar el editor? ${open ? '(Ocultar guía)' : '(Ver guía rápida)'}`;
      }
    }

    toggleGuideBtn?.addEventListener('click', () => {
      setGuideVisibility(!editorState.guideOpen);
    });

    closeGuideBtn?.addEventListener('click', () => {
      setGuideVisibility(false);
    });

    // 2. Clic en cualquiera de las 5 tarjetas de casos prácticos de la guía
    container.querySelectorAll('[data-case-load]').forEach(card => {
      const triggerCase = () => {
        const expr = card.getAttribute('data-case-load');
        if (!expr) return;
        EditorInputAdapter.setValue(expr, { focus: true, source: 'case-card' });
      };
      card.addEventListener('click', triggerCase);
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          triggerCase();
        }
      });
    });

    // 3. Clic en cualquiera de los 8 ejemplos interactivos de la galería
    const explainerText = container.querySelector('#editor-structure-explainer-text');
    container.querySelectorAll('[data-example-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-example-idx'));
        const ex = INTERACTIVE_EXAMPLES[idx];
        if (!ex) return;

        editorState.activeExampleIdx = idx;
        container.querySelectorAll('.editor-example-chip').forEach((chip, cIdx) => {
          chip.classList.toggle('active', cIdx === idx);
        });

        if (explainerText) {
          explainerText.textContent = ex.structureHint;
        }

        if (typeof ex.x0 === 'number') {
          editorState.evalX = ex.x0;
          const xInput = container.querySelector('#editor-eval-x');
          if (xInput) xInput.value = String(ex.x0);
        }

        EditorInputAdapter.setValue(ex.expr, { focus: true, source: 'example' });
      });
    });

    // 4. Botones de la barra de herramientas de inserción de estructuras
    container.querySelectorAll('[data-struct-group]').forEach(btn => {
      btn.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
      });
      btn.addEventListener('click', () => {
        const gIdx = Number(btn.getAttribute('data-struct-group'));
        const bIdx = Number(btn.getAttribute('data-struct-btn'));
        const group = STRUCTURE_TOOLBAR_GROUPS[gIdx];
        const btnConfig = group && group.buttons[bIdx];
        if (!btnConfig) return;

        EditorInputAdapter.insertStructure(btnConfig);
      });
    });

    // 5. Controles de edición: Deshacer, Limpiar todo y Copiar con confirmación visual
    const undoBtn = container.querySelector('#btn-editor-undo');
    const clearBtn = container.querySelector('#btn-editor-clear');
    const copyNaturalBtn = container.querySelector('#btn-editor-copy-natural');
    const copyLatexBtn = container.querySelector('#btn-editor-copy-latex');
    const copyToast = container.querySelector('#editor-copy-toast');

    function showCopyConfirmation(buttonEl, originalLabel, toastMessage) {
      if (buttonEl) {
        buttonEl.textContent = '✓ ¡Copiado!';
        buttonEl.classList.add('copied-success');
      }
      if (copyToast) {
        copyToast.textContent = toastMessage;
        copyToast.classList.add('visible');
      }
      setTimeout(() => {
        if (buttonEl) {
          buttonEl.textContent = originalLabel;
          buttonEl.classList.remove('copied-success');
        }
        if (copyToast) {
          copyToast.classList.remove('visible');
        }
      }, 2200);
    }

    undoBtn?.addEventListener('click', () => {
      const didUndo = EditorInputAdapter.undo();
      if (!didUndo && copyToast) {
        copyToast.textContent = 'No hay cambios anteriores para deshacer';
        copyToast.classList.add('visible');
        setTimeout(() => copyToast.classList.remove('visible'), 1800);
      }
    });

    clearBtn?.addEventListener('click', () => {
      EditorInputAdapter.clear();
    });

    copyNaturalBtn?.addEventListener('click', async () => {
      const val = EditorInputAdapter.getValue().trim();
      if (!val) return;
      const ok = await copyTextToClipboard(val);
      if (ok) {
        showCopyConfirmation(copyNaturalBtn, '📋 Copiar expresión', `Expresión copiada: ${val}`);
      }
    });

    copyLatexBtn?.addEventListener('click', async () => {
      const val = EditorInputAdapter.getValue().trim();
      if (!val) return;
      const latex = EditorInputAdapter.getLatex();
      const ok = await copyTextToClipboard(latex);
      if (ok) {
        showCopyConfirmation(copyLatexBtn, '📄 Copiar formato simbólico', 'Formato simbólico copiado al portapapeles');
      }
    });

    // 6. Controles de parámetros x0 e y del Laboratorio
    const evalXInp = container.querySelector('#editor-eval-x');
    const evalYInp = container.querySelector('#editor-eval-y');
    [evalXInp, evalYInp].forEach(el => {
      el?.addEventListener('input', () => {
        editorState.evalX = parseFloat(evalXInp.value);
        if (isNaN(editorState.evalX)) editorState.evalX = 0;
        editorState.evalY = parseFloat(evalYInp.value);
        if (isNaN(editorState.evalY)) editorState.evalY = 0;
        updateAnalysisPanel(container);
      });
    });

    // 7. Enviar al Graficador Interactivo
    container.querySelector('#btn-send-to-grapher')?.addEventListener('click', () => {
      const currentRaw = EditorInputAdapter.getValue().trim() || editorState.currentExpression;
      const analysis = ns.MathParser.analyzeEditorExpression(
        currentRaw,
        editorState.evalX,
        editorState.evalY
      );
      const payload = analysis.grapherPayload || (
        typeof ns.MathParser.extractGrapherPayload === 'function'
          ? ns.MathParser.extractGrapherPayload(currentRaw, editorState.evalX)
          : { expr: analysis.graphableExpr || ns.MathParser.stripEquationPrefix(currentRaw) }
      );
      if (ns.App && typeof ns.App.openTool === 'function') {
        ns.App.openTool('graficador', payload);
      }
    });
  }

  /**
   * Actualiza las tarjetas de evaluación y análisis del panel derecho en función
   * de la expresión actual y los valores de x0 e y.
   */
  function updateAnalysisPanel(container) {
    const out = (container || document).querySelector('#editor-eval-results');
    if (!out) return;

    const raw = editorState.currentExpression;
    const completeness = ns.MathRenderer.inspectExpressionCompleteness(raw);

    if (completeness.isEmpty) {
      out.innerHTML = `
        <div class="analysis-stat-box editor-stat-neutral">
          <strong>Listo para analizar</strong>
          Escribe una operación, función o ecuación en el campo izquierdo o elige uno de los 8 ejemplos superiores para ver aquí sus resultados paso a paso.
        </div>
      `;
      return;
    }

    const analysis = ns.MathParser.analyzeEditorExpression(raw, editorState.evalX, editorState.evalY);

    if (!analysis.ok || completeness.isIncomplete) {
      out.innerHTML = `
        <div class="analysis-stat-box editor-stat-pending">
          <strong>✏️ Expresión en construcción</strong>
          <span>${completeness.reason || 'Completa los elementos pendientes (□) de tu expresión para calcular el resultado numérico.'}</span>
        </div>
      `;
      return;
    }

    out.innerHTML = analysis.cards.map(card => `
      <div class="analysis-stat-box">
        <strong>${ns.MathRenderer.formatRichText(card.label)}</strong>
        <div class="analysis-stat-math">${ns.MathRenderer.renderMath(card.math, false)}</div>
      </div>
    `).join('');
  }

  /**
   * Inserta un fragmento algebraico en un campo de ejercicio manteniendo el cursor
   * dentro de los paréntesis cuando corresponda.
   */
  function insertSnippetIntoExerciseInput(inputEl, snippet) {
    if (!inputEl) return;
    let offset = snippet.length;
    let len = 0;
    if (snippet === '()/()') { offset = 1; len = 0; }
    else if (snippet === 'sqrt()' || snippet === 'raiz()') { offset = 5; len = 0; }
    else if (snippet === 'raiz(3, )') { offset = 8; len = 0; }
    else if (snippet === '()^2' || snippet === '()') { offset = 1; len = 0; }
    else if (snippet === 'x^()') { offset = 3; len = 0; }
    else if (snippet === 'abs()') { offset = 4; len = 0; }
    else if (snippet === 'ln()') { offset = 3; len = 0; }
    else if (snippet === 'log()') { offset = 4; len = 0; }
    else if (snippet === 'sin()' || snippet === 'sen()' || snippet === 'cos()' || snippet === 'tan()') { offset = 4; len = 0; }
    else if (snippet === 'e^()') { offset = 3; len = 0; }
    insertAtCursor(inputEl, snippet, offset, len);
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  }

  ns.ExpressionEditorTool = {
    renderExpressionEditorView,
    insertAtCursor,
    insertSnippetIntoExerciseInput,
    inputAdapter: EditorInputAdapter,
    FIVE_PRACTICAL_CASES,
    INTERACTIVE_EXAMPLES
  };
})(window.MatInteractiva);
