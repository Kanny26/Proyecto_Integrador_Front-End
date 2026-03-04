/**
 * ==========================================================
 * API – GET /tasks
 * ==========================================================
 */

const API_BASE_URL = 'http://localhost:3000';

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
        // TypeError ocurre cuando no hay conexión al servidor
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que json-server esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
