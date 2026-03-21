/**
 * ==========================================================
 * API – PUT /api/tasks/:id  y  PATCH /api/tasks/:id/status
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Actualiza una tarea completa (PUT).
 * Usado al editar título, descripción y estado desde el formulario.
 * @param {string|number} id
 * @param {Object}        nuevosDatos
 * @returns {Promise<Object>}
 */
export async function actualizarTarea(id, nuevosDatos) {
    try {
        // Si solo viene el campo status, usar la ruta PATCH /:id/status
        const soloStatus = Object.keys(nuevosDatos).length === 1 && nuevosDatos.status !== undefined;

        const url    = soloStatus
            ? `${API_BASE_URL}/tasks/${id}/status`
            : `${API_BASE_URL}/tasks/${id}`;
        const method = soloStatus ? 'PATCH' : 'PUT';

        const response = await fetch(url, {
            method,
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
