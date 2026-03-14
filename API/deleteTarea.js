/**
 * ==========================================================
 * API – DELETE /api/tasks/:id
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Elimina una tarea por su ID.
 * @param {string|number} id
 * @returns {Promise<true>}
 * @throws {Error} Con mensaje descriptivo según el tipo de fallo
 */
export async function eliminarTarea(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 404) {
            throw new Error(`La tarea con ID ${id} no existe o ya fue eliminada`);
        }

        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al eliminar la tarea`);
        }

        return true;

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
