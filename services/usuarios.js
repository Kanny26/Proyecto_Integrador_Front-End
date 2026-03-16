/**
 * ==========================================================
 * SERVICES – Lógica de negocio para usuarios
 * ==========================================================
 */

import { getUsuarios, createUser, updateUser, deleteUser, toggleUserStatus } from '../API/index.js';
import { setCachedUsers } from './tareas.js';

/**
 * Carga todos los usuarios desde la API y los almacena en caché.
 * Llama a getUsuarios() y actualiza el estado interno.
 */
export async function cargarUsuarios() {
    const usuarios = await getUsuarios();
    setCachedUsers(usuarios);
    return usuarios;
}

/**
 * Crea un nuevo usuario llamando a createUser() de la API.
 * Valida los datos antes de enviar.
 * @param {Object} datosUsuario - { nombre_completo, documento, rol, ... }
 * @returns {Promise<Object>} Usuario creado
 */
export async function crearUsuario(datosUsuario) {
    if (!datosUsuario.nombre_completo || !datosUsuario.documento) {
        throw new Error('El nombre y el documento son obligatorios');
    }
    return await createUser(datosUsuario);
}

/**
 * Edita un usuario existente llamando a updateUser() de la API.
 * @param {string|number} id
 * @param {Object} nuevosDatos
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function editarUsuario(id, nuevosDatos) {
    return await updateUser(id, nuevosDatos);
}

/**
 * Elimina un usuario llamando a deleteUser() de la API.
 * @param {string|number} id
 * @returns {Promise<true>}
 */
export async function eliminarUsuario(id) {
    return await deleteUser(id);
}

/**
 * Cambia el estado activo/inactivo de un usuario.
 * Llama a toggleUserStatus() de la API.
 * @param {string|number} id
 * @param {boolean} estadoActual
 * @returns {Promise<Object>} Usuario con estado actualizado
 */
export async function cambiarEstadoUsuario(id, estadoActual) {
    return await toggleUserStatus(id, estadoActual);
}
