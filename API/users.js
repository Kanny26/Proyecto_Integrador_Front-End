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
    // TODO: implementar
}

/**
 * Actualiza los datos de un usuario existente.
 * PATCH /api/users/:id
 * @param {string|number} id
 * @param {Object} nuevosDatos
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function updateUser(id, nuevosDatos) {
    // TODO: implementar
}

/**
 * Elimina un usuario por su ID.
 * DELETE /api/users/:id
 * @param {string|number} id
 * @returns {Promise<true>}
 */
export async function deleteUser(id) {
    // TODO: implementar
}

/**
 * Activa o desactiva un usuario (toggle de estado activo/inactivo).
 * PATCH /api/users/:id  →  { activo: !activo }
 * @param {string|number} id
 * @param {boolean} estadoActual - estado actual del usuario
 * @returns {Promise<Object>} Usuario con estado actualizado
 */
export async function toggleUserStatus(id, estadoActual) {
    // TODO: implementar
}
