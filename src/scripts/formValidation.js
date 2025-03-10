/**
 * Clase MultiStepForm
 * Gestiona un formulario multi-paso con validación y experiencia de usuario mejorada
 */
export class MultiStepForm {
  constructor() {
    // Elementos del DOM
    this.form = document.getElementById('consultForm');
    this.steps = Array.from(document.querySelectorAll('.pasos'));
    this.progress = document.getElementById('progress-bar');
    this.stepCounter = document.getElementById('step-counter');
    this.stepPercentage = document.getElementById('step-percentage');
    this.notification = document.getElementById('notification');
    this.notificationMessage = document.getElementById('notification-message');
    this.loadingSpinner = document.getElementById('loading-spinner');
    this.submitButton = document.querySelector('.btn-submit');

    // Estado del formulario
    this.currentStep = 0;
    this.sessionStartTime = new Date();

    this.init();
  }

  /**
   * Inicializa el formulario
   */
  init() {
    if (!this.form) {
      console.error('Formulario no encontrado');
      return;
    }

    this.setupEventListeners();
    this.setupExampleButtons();
    this.setupBudgetSlider();
    this.setupCharacterCounters();
    this.updateUI();
  }

  /**
   * Configura todos los event listeners para el formulario
   */
  setupEventListeners() {
    // Botones de navegación
    document
      .querySelector('.btn-next')
      ?.addEventListener('click', () => this.nextStep());
    document
      .querySelector('.btn-prev')
      ?.addEventListener('click', () => this.prevStep());

    // Validación de campos
    this.setupFieldValidation();

    // Envío del formulario
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));

    // Teclas de navegación
    document.addEventListener('keydown', (e) =>
      this.handleKeyboardNavigation(e)
    );
  }

  /**
   * Configura la validación en tiempo real para los campos
   */
  setupFieldValidation() {
    this.form.querySelectorAll('input, textarea, select').forEach((input) => {
      // Validar durante la edición
      input.addEventListener('input', () => {
        this.validateField(input);
        this.updateCharCount(input);
      });

      // Validar después de cambios (útil para select, checkbox)
      input.addEventListener('change', () => {
        this.validateField(input);
        this.updateCharCount(input);
      });

      // Para campos con valores predeterminados
      if (input.value) {
        this.validateField(input);
        this.updateCharCount(input);
      }
    });
  }

  /**
   * Configura botones para insertar ejemplos en campos
   */
  setupExampleButtons() {
    // Ejemplo para el campo SMART
    const metaExampleBtn = document.getElementById('insert-meta-example');
    const metasField = document.querySelector('textarea[name="metas"]');

    if (metaExampleBtn && metasField) {
      metaExampleBtn.addEventListener('click', () => {
        const example =
          'Incrementar ventas online en un 20% durante los próximos 3 meses a través de mi tienda en línea';
        metasField.value = example;
        this.validateField(metasField);
        this.updateCharCount(metasField);
      });
    }

    // Puedes añadir más ejemplos para otros campos aquí
    const propuestaExampleBtn = document.getElementById(
      'insert-propuesta-example'
    );
    const propuestaField = document.querySelector(
      'textarea[name="propuestaValor"]'
    );

    if (propuestaExampleBtn && propuestaField) {
      propuestaExampleBtn.addEventListener('click', () => {
        const example =
          'Ayudo a pequeños negocios a aumentar su visibilidad en línea para conseguir más clientes';
        propuestaField.value = example;
        this.validateField(propuestaField);
        this.updateCharCount(propuestaField);
      });
    }
  }

  /**
   * Configura el deslizador de presupuesto
   */
  setupBudgetSlider() {
    const slider = document.getElementById('budget-slider');
    const budgetInput = document.querySelector('input[name="presupuesto"]');
    const currencySymbol = document.getElementById('currency-symbol');
    const currencySelect = document.querySelector('select[name="moneda"]');

    if (slider && budgetInput) {
      // Slider afecta al input
      slider.addEventListener('input', () => {
        budgetInput.value = slider.value;
        this.validateField(budgetInput);
      });

      // Input afecta al slider
      budgetInput.addEventListener('input', () => {
        const value = parseInt(budgetInput.value) || 0;
        slider.value = Math.min(parseInt(slider.max), Math.max(0, value));
      });
    }

    // Actualiza el símbolo de moneda cuando cambie la selección
    if (currencySelect && currencySymbol) {
      currencySelect.addEventListener('change', () => {
        currencySymbol.textContent =
          currencySelect.value === 'USD' ? '$' : 'MX$';
      });
    }
  }

  /**
   * Configura contadores de caracteres para campos de texto
   */
  setupCharacterCounters() {
    this.form.querySelectorAll('textarea').forEach((textarea) => {
      const container = textarea.closest('div');
      if (!container) return;

      // Buscar o crear el contador de caracteres
      let counter = container.querySelector('.char-counter');
      if (!counter) {
        counter = document.createElement('div');
        counter.className =
          'char-counter text-xs text-gray-500 mt-1 text-right';
        container.appendChild(counter);

        // Opcional: configurar límite máximo
        const maxLength = 300;
        textarea.setAttribute('maxlength', maxLength);

        counter.textContent = `0/${maxLength}`;

        // Actualizar contador en tiempo real
        textarea.addEventListener('input', () =>
          this.updateCharCount(textarea)
        );
      }

      // Inicializar contador
      this.updateCharCount(textarea);
    });
  }

  /**
   * Actualiza el contador de caracteres para un campo
   * @param {HTMLElement} field - Campo de texto
   */
  updateCharCount(field) {
    if (field.tagName !== 'TEXTAREA') return;

    const container = field.closest('div');
    if (!container) return;

    const counter = container.querySelector('.char-counter');
    if (!counter) return;

    const maxLength = field.getAttribute('maxlength') || 300;
    const currentLength = field.value.length;
    counter.textContent = `${currentLength}/${maxLength}`;

    // Cambiar color cuando se acerca al límite
    if (currentLength > maxLength * 0.9) {
      counter.classList.add('text-amber-500');
    } else {
      counter.classList.remove('text-amber-500');
    }

    // Cambiar color cuando excede el límite
    if (currentLength >= maxLength) {
      counter.classList.add('text-red-500');
      counter.classList.remove('text-amber-500');
    } else {
      counter.classList.remove('text-red-500');
    }
  }

  /**
   * Maneja la navegación por teclado
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleKeyboardNavigation(e) {
    // Enter avanza al siguiente paso cuando no está en textarea o botón enviar
    if (
      e.key === 'Enter' &&
      e.target.tagName !== 'TEXTAREA' &&
      !e.target.classList.contains('btn-submit')
    ) {
      e.preventDefault();
      if (this.currentStep < this.steps.length - 1) {
        this.nextStep();
      } else {
        this.form.dispatchEvent(new Event('submit'));
      }
    }
  }

  /**
   * Valida un campo específico
   * @param {HTMLElement} field - Campo a validar
   * @returns {boolean} - Si el campo es válido
   */
  validateField(field) {
    if (!field.dataset.validate) return true;

    // Buscar el contenedor de mensaje de error
    const container = field.closest('div');
    let errorMessage;

    // Localizar el elemento de mensaje de error
    if (field.type === 'checkbox') {
      errorMessage =
        field.parentElement?.parentElement?.querySelector('.error-message');
    } else {
      errorMessage = container?.querySelector('.error-message');
    }

    const validationTypes = field.dataset.validate.split('|');
    let isValid = true;
    let errorText = '';

    // Comprobar cada tipo de validación
    for (const type of validationTypes) {
      if (type === 'required' && !this.isRequired(field)) {
        isValid = false;
        errorText = 'Este campo es requerido';
        break;
      } else if (type === 'email' && !this.isValidEmail(field.value)) {
        isValid = false;
        errorText = 'Ingresa un correo válido';
        break;
      } else if (type === 'phone' && !this.isValidPhone(field.value)) {
        isValid = false;
        errorText = 'Ingresa un número de teléfono válido';
        break;
      }
    }

    // Mostrar error o limpiar el campo
    if (!isValid) {
      this.showError(field, errorMessage, errorText);
      return false;
    } else {
      this.clearError(field, errorMessage);
      return true;
    }
  }

  /**
   * Verifica si un campo cumple la validación de obligatorio
   * @param {HTMLElement} field - Campo a validar
   * @returns {boolean} - Si el campo cumple la validación
   */
  isRequired(field) {
    if (field.type === 'checkbox') {
      return field.checked;
    }
    return field.value.trim() !== '';
  }

  /**
   * Valida un correo electrónico
   * @param {string} email - Correo a validar
   * @returns {boolean} - Si el correo es válido
   */
  isValidEmail(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Valida un número de teléfono
   * @param {string} phone - Número a validar
   * @returns {boolean} - Si el teléfono es válido
   */
  isValidPhone(phone) {
    if (!phone) return false;
    return /^\d{8,15}$/.test(phone);
  }

  /**
   * Muestra un mensaje de error para un campo
   * @param {HTMLElement} field - Campo con error
   * @param {HTMLElement} errorElement - Elemento para mostrar el mensaje
   * @param {string} message - Mensaje de error
   */
  showError(field, errorElement, message) {
    field.classList.add('input-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  }

  /**
   * Limpia los mensajes de error
   * @param {HTMLElement} field - Campo a limpiar
   * @param {HTMLElement} errorElement - Elemento de mensaje de error
   */
  clearError(field, errorElement) {
    field.classList.remove('input-error');
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
  }

  /**
   * Avanza al siguiente paso del formulario
   */
  nextStep() {
    if (!this.validateStep(this.steps[this.currentStep])) return;

    // Ocultar paso actual
    this.steps[this.currentStep].classList.remove('active');

    // Avanzar al siguiente paso
    this.currentStep++;

    // Mostrar nuevo paso
    this.steps[this.currentStep].classList.add('active');

    // Actualizar UI
    this.updateProgress();
    this.updateUI();

    // Scroll al inicio del formulario
    this.form.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Retrocede al paso anterior del formulario
   */
  prevStep() {
    // Ocultar paso actual
    this.steps[this.currentStep].classList.remove('active');

    // Retroceder al paso anterior
    this.currentStep--;

    // Mostrar nuevo paso
    this.steps[this.currentStep].classList.add('active');

    // Actualizar UI
    this.updateProgress();
    this.updateUI();

    // Scroll al inicio del formulario
    this.form.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Valida todos los campos de un paso
   * @param {HTMLElement} step - Paso a validar
   * @returns {boolean} - Si el paso es válido
   */
  validateStep(step) {
    // El paso 1 no requiere validación (es informativo)
    if (parseInt(step.dataset.step) === 1) return true;

    let isValid = true;
    const fields = step.querySelectorAll('[data-validate]');

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Actualiza la barra de progreso y los contadores
   */
  updateProgress() {
    const progressWidth = ((this.currentStep + 1) / this.steps.length) * 100;

    // Actualizar barra de progreso
    this.progress.style.width = `${progressWidth}%`;

    // Actualizar texto de progreso
    this.stepCounter.textContent = `Paso ${this.currentStep + 1} de ${
      this.steps.length
    }`;
    this.stepPercentage.textContent = `${Math.round(progressWidth)}%`;
  }

  /**
   * Actualiza los elementos de la interfaz según el paso actual
   */
  updateUI() {
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');
    const submitButton = document.querySelector('.btn-submit');

    // Mostrar/ocultar botones según el paso
    if (prevButton) {
      prevButton.classList.toggle('hidden', this.currentStep === 0);
    }

    if (nextButton) {
      nextButton.classList.toggle(
        'hidden',
        this.currentStep === this.steps.length - 1
      );
    }

    if (submitButton) {
      submitButton.classList.toggle(
        'hidden',
        this.currentStep !== this.steps.length - 1
      );
    }
  }

  /**
   * Muestra una notificación al usuario
   * @param {string} message - Mensaje a mostrar
   * @param {boolean} isSuccess - Si es un mensaje de éxito o error
   */
  showNotification(message, isSuccess) {
    // Mostrar la notificación
    this.notification.classList.remove('hidden');

    // Limpiar clases existentes
    this.notification.classList.remove(
      'bg-green-100',
      'bg-red-100',
      'text-green-800',
      'text-red-800',
      'bg-light-primary',
      'bg-dark-primary',
      'text-light-secondary',
      'text-dark-secondary'
    );

    // Aplicar estilo según tipo y tema
    if (isSuccess) {
      this.notification.classList.add('bg-teal-100', 'text-teal-800');
    } else {
      this.notification.classList.add('bg-rose-100', 'text-rose-800');
    }

    // Establecer mensaje
    this.notificationMessage.textContent = message;

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.notification.classList.add('hidden');
    }, 5000);
  }

  /**
   * Maneja el envío del formulario
   * @param {Event} event - Evento de envío
   */
  handleSubmit(event) {
    event.preventDefault();

    // Validar el paso actual antes de enviar
    if (!this.validateStep(this.steps[this.currentStep])) return;

    // Mostrar indicador de carga
    this.loadingSpinner.classList.remove('hidden');
    this.submitButton.disabled = true;

    const datosFormulario = new FormData(this.form);

    // Añadir datos adicionales
    datosFormulario.append('tiempoFormulario', this.getElapsedTime());

    // Enviar a la API
    this.sendFormData(datosFormulario);
  }

  /**
   * Envía los datos del formulario a la API
   * @param {FormData} formData - Datos del formulario
   */
  sendFormData(formData) {
    fetch(
      'https://david2211888.app.n8n.cloud/webhook/f34c888b-7212-439f-9c30-9975bfc381f9',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Datos enviados a n8n:', data);
        this.showNotification(
          '¡Formulario enviado con éxito! Revisa tu correo en los próximos minutos',
          true
        );
        this.form.reset();

        // Redirigir a la página de gracias después de 2 segundos
        setTimeout(() => {
          window.location.href = '/gracias';
        }, 2000);
      })
      .catch((error) => {
        console.error('Error al enviar datos a n8n:', error);
        this.showNotification(
          'Error al enviar el formulario. Inténtalo de nuevo.',
          false
        );
      })
      .finally(() => {
        // Ocultar indicador de carga
        this.loadingSpinner.classList.add('hidden');
        this.submitButton.disabled = false;
      });
  }

  /**
   * Calcula el tiempo transcurrido desde que se inició el formulario
   * @returns {string} - Tiempo transcurrido formateado
   */
  getElapsedTime() {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - this.sessionStartTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${minutes}m ${seconds}s`;
  }
}
