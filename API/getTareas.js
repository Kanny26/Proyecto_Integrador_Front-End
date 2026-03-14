/**
 * ==========================================================
 * API – GET /api/tasks
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Obtiene todas las tareas desde el backend.
 * @returns {Promise<Array>}
 * @throws {Error} Con mensaje descriptivo según el tipo de fallo
 */
export async function getTareas() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);

        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al obtener las tareas`);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
