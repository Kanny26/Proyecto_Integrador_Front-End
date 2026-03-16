/**
 * ==========================================================
 * API – POST /api/tasks
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Registra una nueva tarea en el backend.
 * @param {Object} tarea
 * @returns {Promise<Object>} Tarea registrada con ID asignado
 * @throws {Error} Con mensaje descriptivo según el tipo de fallo
 */
export async function postTarea(tarea) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(tarea)
        });

        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al crear la tarea`);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
