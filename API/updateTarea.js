/**
 * ==========================================================
 * API – PATCH /api/tasks/:id
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Actualiza parcialmente una tarea existente.
 * @param {string|number} id
 * @param {Object}        nuevosDatos
 * @returns {Promise<Object>}
 * @throws {Error} Con mensaje descriptivo según el tipo de fallo
 */
export async function actualizarTarea(id, nuevosDatos) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(nuevosDatos)
        });

        if (response.status === 404) {
            throw new Error(`La tarea con ID ${id} no existe en el servidor`);
        }

        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al actualizar la tarea`);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
