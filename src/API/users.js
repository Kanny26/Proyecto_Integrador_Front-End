
/**
 * ==========================================================
 * API – CRUD de usuarios
 * ==========================================================
 */

import { API_BASE_URL } from './config.js';

/**
 * Lee el mensaje de error del body JSON de una respuesta fallida.
 * @param {Response} response
 * @returns {Promise<string>}
 */
async function leerError(response) {
    const data = await response.json().catch(() => ({}));
    return data.error ?? `Error ${response.status}`;
}

/**
 * Inicia sesión y retorna { token, usuario }.
 * POST /api/auth/login
 * @param {string} documento
 * @returns {Promise<{ token: string, usuario: Object }>}
 */
export async function loginUser(documento) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documento })
        });
        if (!response.ok) throw new Error(await leerError(response));
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}

/**
 * Crea un nuevo usuario.
 * POST /api/users
 * @param {Object} usuario - { nombre_completo, documento, rol, ... }
 * @returns {Promise<Object>} Usuario creado con ID asignado
 */
export async function createUser(usuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) throw new Error(await leerError(response));
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
 * PUT /api/users/:id
 * @param {string|number} id
 * @param {Object} nuevosDatos
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function updateUser(id, nuevosDatos) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevosDatos)
        });
        if (!response.ok) throw new Error(await leerError(response));
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
    const token = sessionStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error(await leerError(response));
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
 * PATCH /api/users/:id/status
 * @param {string|number} id
 * @param {boolean} estadoActual - estado actual del usuario
 * @returns {Promise<Object>} Usuario con estado actualizado
 */
export async function toggleUserStatus(id, estadoActual) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !estadoActual })
        });
        if (!response.ok) throw new Error(await leerError(response));
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000');
        }
        throw error;
    }
}
