/**
 * Clase MultiStepForm
 * Gestiona un formulario multi-paso con validación
 */
export class MultiStepForm {
  constructor() {
    this.form = document.getElementById('consultForm');
    this.steps = Array.from(document.querySelectorAll('.pasos'));
    this.currentStep = 0;
    this.progress = document.getElementById('progress-bar');
    this.stepCounter = document.getElementById('step-counter');
    this.stepPercentage = document.getElementById('step-percentage');
    this.notification = document.getElementById('notification');
    this.notificationMessage = document.getElementById('notification-message');
    this.loadingSpinner = document.getElementById('loading-spinner');
    this.submitButton = document.querySelector('.btn-submit');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    document
      .querySelector('.btn-next')
      ?.addEventListener('click', () => this.nextStep());
    document
      .querySelector('.btn-prev')
      ?.addEventListener('click', () => this.prevStep());

    // Para cada input o textarea, se realiza validación en el evento input
    this.form.querySelectorAll('input, textarea, select').forEach((input) => {
      input.addEventListener('input', () => this.validateField(input));
      input.addEventListener('change', () => this.validateField(input));

      // Validación inicial para campos con valores predeterminados
      if (input.value) {
        this.validateField(input);
      }
    });

    // Manejar el envío del formulario
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  validateField(field) {
    if (!field.dataset.validate) return true;

    // Buscar el contenedor del campo para encontrar el mensaje de error
    const container = field.closest('div');
    let errorMessage;

    // Para el checkbox de términos y condiciones
    if (field.type === 'checkbox') {
      errorMessage =
        field.parentElement?.parentElement?.querySelector('.error-message');
    } else {
      // Para otros campos, buscar el mensaje de error en el contenedor
      errorMessage = container?.querySelector('.error-message');
    }

    const validationTypes = field.dataset.validate.split('|');
    let isValid = true;
    let errorText = '';

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

    if (!isValid) {
      this.showError(field, errorMessage, errorText);
      return false;
    } else {
      this.clearError(field, errorMessage);
      return true;
    }
  }

  isRequired(field) {
    if (field.type === 'checkbox') {
      return field.checked;
    }
    return field.value.trim() !== '';
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    // Validar que sea un número de teléfono válido (solo dígitos, mínimo 8 caracteres)
    return /^\d{8,15}$/.test(phone);
  }

  showError(field, errorElement, message) {
    field.classList.add('input-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  }

  clearError(field, errorElement) {
    field.classList.remove('input-error');
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
  }

  nextStep() {
    console.log('clikado');
    if (!this.validateStep(this.steps[this.currentStep])) return;

    this.steps[this.currentStep].classList.remove('active');
    this.currentStep++;
    this.steps[this.currentStep].classList.add('active');
    this.updateProgress();
    this.updateUI();

    // Scroll al inicio del formulario para mejor experiencia móvil
    this.form.scrollIntoView({ behavior: 'smooth' });
  }

  prevStep() {
    this.steps[this.currentStep].classList.remove('active');
    this.currentStep--;
    this.steps[this.currentStep].classList.add('active');
    this.updateProgress();
    this.updateUI();

    // Scroll al inicio del formulario para mejor experiencia móvil
    this.form.scrollIntoView({ behavior: 'smooth' });
  }

  validateStep(step) {
    // El paso 1 no requiere validación
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

  updateProgress() {
    const progressWidth = ((this.currentStep + 1) / this.steps.length) * 100;
    this.progress.style.width = `${progressWidth}%`;
    this.stepCounter.textContent = `Paso ${this.currentStep + 1} de ${
      this.steps.length
    }`;
    this.stepPercentage.textContent = `${Math.round(progressWidth)}%`;
  }

  updateUI() {
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');
    const submitButton = document.querySelector('.btn-submit');

    if (prevButton)
      prevButton.classList.toggle('hidden', this.currentStep === 0);
    if (nextButton)
      nextButton.classList.toggle(
        'hidden',
        this.currentStep === this.steps.length - 1
      );
    if (submitButton)
      submitButton.classList.toggle(
        'hidden',
        this.currentStep !== this.steps.length - 1
      );
  }

  showNotification(message, isSuccess) {
    this.notification.classList.remove('hidden');
    this.notification.classList.remove(
      'bg-green-100',
      'bg-red-100',
      'text-green-800',
      'text-red-800'
    );

    if (isSuccess) {
      this.notification.classList.add('bg-green-100', 'text-green-800');
    } else {
      this.notification.classList.add('bg-red-100', 'text-red-800');
    }

    this.notificationMessage.textContent = message;

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.notification.classList.add('hidden');
    }, 5000);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Validar el paso actual antes de enviar
    if (!this.validateStep(this.steps[this.currentStep])) return;

    // Mostrar indicador de carga
    this.loadingSpinner.classList.remove('hidden');
    this.submitButton.disabled = true;

    const datosFormulario = new FormData(this.form);

    fetch(
      'https://um215.app.n8n.cloud/webhook-test/04611043-2749-4dfb-824d-ac10c9437dc2',
      {
        method: 'POST',
        body: datosFormulario,
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
          '¡Formulario enviado con éxito! Revise su bandeja de correo',
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
}
