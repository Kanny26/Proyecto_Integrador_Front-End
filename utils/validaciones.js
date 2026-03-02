/**
 * ==========================================================
 * UTILS – Funciones puras de validación
 * ==========================================================
 * Todas las funciones aquí son PURAS:
 * - Reciben datos como parámetros
 * - Devuelven un valor (boolean, string, object)
 * - No tienen efectos secundarios
 * - No tocan el DOM
 * - No llaman a APIs
 *
 * Las funciones que muestran errores en el DOM
 * están en ui/errores.js porque pertenecen a la UI.
 * ==========================================================
 */


/**
 * Valida que un valor no esté vacío.
 * @param {*} value
 * @returns {boolean}
 */
export function isValidInput(value) {
    return String(value).trim().length > 0;
}


/**
 * Genera una marca de tiempo formateada en español.
 * @returns {string}  Ej: "1 de enero de 2025, 10:30"
 */
export function getCurrentTimestamp() {
    return new Date().toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}


/**
 * Genera las iniciales de un nombre completo (máx. 2 caracteres).
 * @param {string} name
 * @returns {string}  Ej: "Juan Pérez" → "JP"
 */
export function getInitials(name) {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
}


/**
 * Valida los datos del formulario.
 * Función PURA: no toca el DOM, solo analiza los valores
 * y devuelve un objeto con el resultado.
 *
 * @param {Object}      valores       - Valores actuales de los inputs
 * @param {boolean}     modoEdicion   - true si se está editando (PATCH)
 * @param {Object|null} currentUser   - Usuario activo en la sesión
 *
 * @returns {{ isValid: boolean, errors: Object }}
 *   errors tiene la forma { campo: 'mensaje de error' }
 *   Si isValid es true, errors estará vacío.
 */
export function validateForm(valores, modoEdicion, currentUser) {

    const errors = {};

    const { idVal, nameVal, taskTitleVal, taskStatusVal, taskDescVal } = valores;

    // Validaciones solo en modo creación (POST)
    if (!modoEdicion) {

        if (!isValidInput(idVal)) {
            errors.userID = 'Número de documento requerido';

        } else if (!/^\d+$/.test(idVal)) {
            errors.userID = 'El documento debe contener solo números';
        }

        if (!currentUser) {
            errors.userID = 'Debe buscar un usuario válido primero';
        }

        if (!isValidInput(nameVal)) {
            errors.userName = 'Nombre de usuario requerido';
        }
    }

    if (!isValidInput(taskTitleVal)) {
        errors.taskName = 'Nombre de la tarea requerido';
    }

    if (!['activa', 'inactiva'].includes(taskStatusVal)) {
        errors.taskStatus = 'Estado inválido';
    }

    if (!isValidInput(taskDescVal)) {
        errors.userTarea = 'Descripción de la tarea requerida';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
