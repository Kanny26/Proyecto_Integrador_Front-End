/**
 * ==========================================================
 * UI – Barrel de exportaciones
 * ==========================================================
 */

export { createCardTarea, actualizarCardEnDOM }              from './cardTarea.js';
export { showError, clearError, mostrarErroresFormulario }   from './errores.js';
export { mostrarNotificacion }                               from './notificacion.js';

export {
    init,
    handleFormSubmit,
    handleInputChange,
    manejarClickCard,
    inicializarApp,
    cancelarEdicion,
    deshabilitarFormularioTareas,
    updateTareaCount,
    populateUserSuggestions
} from './formulario.js';
