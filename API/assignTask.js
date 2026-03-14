/**
 * ==========================================================
 * API – Asignación de usuarios a tarea
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Asigna uno o varios usuarios a una tarea existente.
 * POST /api/tasks/:taskId/assign
 * @param {string|number} taskId       - ID de la tarea
 * @param {Array<string|number>} arrayUserIds - IDs de los usuarios a asignar
 * @returns {Promise<Object>} Tarea actualizada con los usuarios asignados
 */
export async function assignUsersToTask(taskId, arrayUserIds) {
    // TODO: implementar
}
