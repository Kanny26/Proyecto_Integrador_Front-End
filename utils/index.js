/**
 * ==========================================================
 * UTILS – Barrel de exportaciones
 * ==========================================================
 * Solo funciones puras. Nada de DOM aquí.
 *
 * import { isValidInput, getCurrentTimestamp,
 *          getInitials, validateForm } from './utils/index.js';
 * ==========================================================
 */

export {
    isValidInput,
    getCurrentTimestamp,
    getInitials,
    validateForm
} from './validaciones.js';

export { formatTasksToJSON } from './exportUtils.js';
