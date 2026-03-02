/**
 * ==========================================================
 * API – GET /usuarios
 * ==========================================================
 */

const API_BASE_URL = 'http://localhost:3000';

/**
 * Obtiene todos los usuarios desde el backend.
 * @returns {Promise<Array>}
 * @throws {Error} Con mensaje descriptivo según el tipo de fallo
 */
export async function getUsuarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`);

        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al obtener los usuarios`);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que json-server esté corriendo en el puerto 3000');
        }
        throw error;
    }
}

/**
 * Busca un usuario específico por número de documento.
 * @param {string|number} documento
 * @returns {Promise<Object|null>}
 */
export async function getUsuarioPorDocumento(documento) {
    const usuarios = await getUsuarios();
    return usuarios.find(u => String(u.documento) === String(documento)) ?? null;
}
