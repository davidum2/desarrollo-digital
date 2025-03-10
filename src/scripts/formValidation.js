/**
 * Clase MultiStepForm
 * Gestiona un formulario multi-paso con validación y experiencia de usuario mejorada
 */
export class MultiStepForm {
  constructor() {
    // Inicializar con init() para permitir la reinicialización
    this.init();
  }

  /**
   * Inicializa el formulario
   */
  init() {
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

    if (!this.form) {
      console.error('Formulario no encontrado');
      return;
    }

    // Limpiar eventos previos en caso de reinicialización
    this.cleanup();

    this.setupEventListeners();
    this.setupExampleButtons();
    this.setupBudgetSlider();
    this.setupCharacterCounters();
    this.updateUI();
  }

  /**
   * Limpia los listeners de eventos para evitar duplicados en reinicializaciones
   */
  cleanup() {
    // Solo intenta limpiar si hay un formulario
    if (!this.form) return;

    console.log("Limpiando event listeners...");

    // Eliminar listeners de botones de navegación
    const nextButton = document.querySelector('.btn-next');
    if (nextButton) {
      const newNext = nextButton.cloneNode(true);
      nextButton.parentNode.replaceChild(newNext, nextButton);
    }

    const prevButton = document.querySelector('.btn-prev');
    if (prevButton) {
      const newPrev = prevButton.cloneNode(true);
      prevButton.parentNode.replaceChild(newPrev, prevButton);
    }

    // Eliminar listeners del formulario clonándolo
    const newForm = this.form.cloneNode(true);
    this.form.parentNode.replaceChild(newForm, this.form);
    this.form = newForm;

    // Limpiar event listeners de campos de formulario
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      const newField = field.cloneNode(true);
      field.parentNode.replaceChild(newField, field);
    });

    // Limpiar botones de ejemplo
    const metaExampleBtn = document.getElementById('insert-meta-example');
    if (metaExampleBtn) {
      const newMetaBtn = metaExampleBtn.cloneNode(true);
      metaExampleBtn.parentNode.replaceChild(newMetaBtn, metaExampleBtn);
    }

    const propuestaExampleBtn = document.getElementById('insert-propuesta-example');
    if (propuestaExampleBtn) {
      const newPropuestaBtn = propuestaExampleBtn.cloneNode(true);
      propuestaExampleBtn.parentNode.replaceChild(newPropuestaBtn, propuestaExampleBtn);
    }

    // Limpiar slider de presupuesto
    const slider = document.getElementById('budget-slider');
    if (slider) {
      const newSlider = slider.cloneNode(true);
      slider.parentNode.replaceChild(newSlider, slider);
    }

    // Limpiar select de moneda
    const currencySelect = document.querySelector('select[name="moneda"]');
    if (currencySelect) {
      const newCurrencySelect = currencySelect.cloneNode(true);
      currencySelect.parentNode.replaceChild(newCurrencySelect, currencySelect);
    }
  }

  /**
   * Configura todos los event listeners para el formulario
   */
  setupEventListeners() {
    // Botones de navegación (usando bind para mantener el contexto)
    const nextButton = document.querySelector('.btn-next');
    if (nextButton) {
      nextButton.addEventListener('click', this.nextStep.bind(this));
    }

    const prevButton = document.querySelector('.btn-prev');
    if (prevButton) {
      prevButton.addEventListener('click', this.prevStep.bind(this));
    }

    // Validación de campos
    this.setupFieldValidation();

    // Envío del formulario
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Teclas de navegación
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
  }

  // El resto de métodos permanecen igual...
}