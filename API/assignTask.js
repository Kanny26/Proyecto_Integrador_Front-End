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
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userIds: arrayUserIds })
        });
        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al asignar usuarios a la tarea`);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
