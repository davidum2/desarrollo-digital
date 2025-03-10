// Importa la clase MultiStepForm desde el archivo original
import { MultiStepForm } from './formValidation.js';

// Variable global para mantener la instancia del formulario
let multiStepForm;

/**
 * Inicializa el formulario
 */
function initForm() {
  // Verifica si el formulario existe en el DOM actual
  const formElement = document.getElementById('consultForm');

  if (formElement) {
    console.log('Inicializando formulario de consulta...');

    // Crea una nueva instancia del formulario o la reinicia si ya existe
    if (multiStepForm) {
      // Si ya existe una instancia, volvemos a inicializar
      multiStepForm.init();
    } else {
      // Crea una nueva instancia del formulario
      multiStepForm = new MultiStepForm();
    }
  }
}

// Inicializa el formulario cuando se carga el DOM inicialmente
document.addEventListener('DOMContentLoaded', initForm);

// También inicializa el formulario después de cada transición de página con ViewTransitions
document.addEventListener('astro:page-load', initForm);

// Limpia cuando se inicia una nueva transición
document.addEventListener('astro:before-swap', () => {
  if (multiStepForm) {
    console.log('Limpiando instancia del formulario para transición...');
    // En caso de necesitar limpieza adicional antes de cambiar de página
    multiStepForm = null;
  }
});

// Maneja posibles errores durante la transición
document.addEventListener('astro:after-swap', () => {
  // Verificar si estamos en la página del formulario pero no se inicializó correctamente
  const formElement = document.getElementById('consultForm');
  if (formElement && !multiStepForm) {
    console.log('Reinicializando formulario después de transición...');
    initForm();
  }
});
