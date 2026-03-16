/**
 * ==========================================================
 * UI – Manejo de errores en el DOM
 * ==========================================================
 * Estas funciones pertenecen a la UI porque su única tarea
 * es mostrar o limpiar mensajes de error en elementos del DOM.
 *
 * Se separan de utils/ porque NO son funciones puras:
 * tienen un efecto secundario visible (modifican el DOM).
 * ==========================================================
 */


/**
 * Muestra un mensaje de error en un elemento del DOM
 * y marca el input correspondiente con la clase 'error'.
 *
 * @param {HTMLElement} errorEl  - Elemento donde se muestra el mensaje
 * @param {HTMLElement} inputEl  - Input que se marcará con error (opcional)
 * @param {string}      mensaje
 */
export function showError(errorEl, inputEl, mensaje) {
    if (errorEl) errorEl.textContent = mensaje;
    inputEl?.classList.add('error');
}


/**
 * Limpia el mensaje de error y quita la clase 'error' del input.
 *
 * @param {HTMLElement} errorEl
 * @param {HTMLElement} inputEl  - (opcional)
 */
export function clearError(errorEl, inputEl) {
    if (errorEl) errorEl.textContent = '';
    inputEl?.classList.remove('error');
}


/**
 * Toma el objeto de errores devuelto por validateForm()
 * y los muestra en el DOM usando las referencias del formulario.
 *
 * Conecta la capa pura (utils) con la capa visual (DOM).
 *
 * @param {Object} dom     - Referencias a los elementos del formulario
 * @param {Object} errors  - { campo: 'mensaje' } devuelto por validateForm()
 */
export function mostrarErroresFormulario(dom, errors) {

    // Limpiar todos primero
    clearError(dom.userIDError,     dom.userIDInput);
    clearError(dom.userNameError,   dom.userNameInput);
    clearError(dom.taskNameError,   dom.taskNameInput);
    clearError(dom.taskStatusError, dom.taskStatusInput);
    clearError(dom.userTareaError,  dom.userTareaInput);

    // Mostrar solo los que fallaron
    if (errors.userID)     showError(dom.userIDError,     dom.userIDInput,     errors.userID);
    if (errors.userName)   showError(dom.userNameError,   dom.userNameInput,   errors.userName);
    if (errors.taskName)   showError(dom.taskNameError,   dom.taskNameInput,   errors.taskName);
    if (errors.taskStatus) showError(dom.taskStatusError, dom.taskStatusInput, errors.taskStatus);
    if (errors.userTarea)  showError(dom.userTareaError,  dom.userTareaInput,  errors.userTarea);
}
