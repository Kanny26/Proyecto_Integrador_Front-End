/**
 * ==========================================================
 * SERVICES – Lógica de negocio para usuarios
 * ==========================================================
 */

/**
 * Carga todos los usuarios desde la API y los almacena en caché.
 * Llama a getUsuarios() y actualiza el estado interno.
 */
export async function cargarUsuarios() {
    // TODO: implementar
}

/**
 * Crea un nuevo usuario llamando a createUser() de la API.
 * Valida los datos antes de enviar.
 * @param {Object} datosUsuario - { nombre, documento, rol, ... }
 * @returns {Promise<Object>} Usuario creado
 */
export async function crearUsuario(datosUsuario) {
    // TODO: implementar
}

/**
 * Edita un usuario existente llamando a updateUser() de la API.
 * @param {string|number} id
 * @param {Object} nuevosDatos
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function editarUsuario(id, nuevosDatos) {
    // TODO: implementar
}

/**
 * Elimina un usuario llamando a deleteUser() de la API.
 * @param {string|number} id
 * @returns {Promise<true>}
 */
export async function eliminarUsuario(id) {
    // TODO: implementar
}

/**
 * Cambia el estado activo/inactivo de un usuario.
 * Llama a toggleUserStatus() de la API.
 * @param {string|number} id
 * @param {boolean} estadoActual
 * @returns {Promise<Object>} Usuario con estado actualizado
 */
export async function cambiarEstadoUsuario(id, estadoActual) {
    // TODO: implementar
}
