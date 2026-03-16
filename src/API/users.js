
/**
 * ==========================================================
 * API – CRUD de usuarios
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Crea un nuevo usuario.
 * POST /api/users
 * @param {Object} usuario - { nombre, documento, rol, ... }
 * @returns {Promise<Object>} Usuario creado con ID asignado
 */
export async function createUser(usuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al crear el usuario`);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}

/**
 * Actualiza los datos de un usuario existente.
 * PATCH /api/users/:id
 * @param {string|number} id
 * @param {Object} nuevosDatos
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function updateUser(id, nuevosDatos) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevosDatos)
        });
        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al actualizar el usuario`);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}

/**
 * Elimina un usuario por su ID.
 * DELETE /api/users/:id
 * @param {string|number} id
 * @returns {Promise<true>}
 */
export async function deleteUser(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al eliminar el usuario`);
        }
        return true;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}

/**
 * Activa o desactiva un usuario (toggle de estado activo/inactivo).
 * PATCH /api/users/:id  →  { activo: !activo }
 * @param {string|number} id
 * @param {boolean} estadoActual - estado actual del usuario
 * @returns {Promise<Object>} Usuario con estado actualizado
 */
export async function toggleUserStatus(id, estadoActual) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !estadoActual })
        });
        if (!response.ok) {
            throw new Error(`El servidor respondió con error ${response.status} al cambiar el estado del usuario`);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
