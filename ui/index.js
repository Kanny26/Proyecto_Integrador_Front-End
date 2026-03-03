/**
 * ==========================================================
 * UI – Barrel de exportaciones
 * ==========================================================
 */

export { createCardTarea, actualizarCardEnDOM } from './cardTarea.js';
export { showError, clearError, mostrarErroresFormulario } from './errores.js';
export { mostrarNotificacion } from './notificaciones.js';

export {
    init,
    handleFormSubmit,
    handleInputChange,
    manejarClickCard,
    inicializarApp,
    cancelarEdicion,
    deshabilitarFormularioTareas,
    updateTareaCount,
    populateUserSuggestions,
    filtrarTareas
} from './formulario.js';
