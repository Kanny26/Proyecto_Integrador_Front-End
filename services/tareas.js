/**
 * ==========================================================
 * SERVICES – Estado de la aplicación y lógica de negocio
 * ==========================================================
 * Responsabilidad:
 * - Mantener el estado global de forma ENCAPSULADA
 * - Orquestar llamadas a la capa API
 * - Construir objetos de dominio antes de enviarlos al backend
 *
 * Reglas de esta capa:
 * - NO accede al DOM
 * - NO contiene lógica de presentación
 * - El contador de tareas SIEMPRE viene del backend (cargarTareas)
 *   Nunca se incrementa ni decrementa manualmente para evitar
 *   que se desincronice si falla una petición.
 * ==========================================================
 */

import {
    getTareas,
    postTarea,
    eliminarTarea,
    getUsuarios,
    actualizarTarea
} from '../API/index.js';

import { getCurrentTimestamp } from '../utils/index.js';


// ==========================================================
// ESTADO PRIVADO
// Las variables con _ no se exportan directamente.
// Solo se accede a ellas a través de getters y setters.
// ==========================================================

let _currentUser = null;
let _cachedUsers = [];


// ==========================================================
// GETTERS (lectura controlada)
// ==========================================================

export function getCurrentUser()  { return _currentUser; }
export function getCachedUsers()  { return _cachedUsers;  }


// ==========================================================
// SETTERS (escritura controlada con validación)
// ==========================================================

/**
 * Asigna el usuario activo.
 * Valida que el objeto tenga las propiedades mínimas requeridas
 * (id y documento) antes de aceptarlo.
 *
 * @param {Object|null} usuario
 */
export function setCurrentUser(usuario) {
    if (usuario === null) {
        _currentUser = null;
        return;
    }

    if (typeof usuario !== 'object') {
        console.warn('setCurrentUser: se esperaba un objeto de usuario o null');
        return;
    }

    // Validación real: verificar que tenga las propiedades esenciales
    if (!usuario.id || !usuario.documento) {
        console.warn('setCurrentUser: el objeto no tiene id o documento válidos', usuario);
        return;
    }

    _currentUser = usuario;
}

/**
 * Actualiza el caché de usuarios.
 * @param {Array} lista
 */
export function setCachedUsers(lista) {
    if (!Array.isArray(lista)) {
        console.warn('setCachedUsers: se esperaba un array');
        return;
    }
    _cachedUsers = lista;
}


// ==========================================================
// SERVICIO – USUARIOS
// ==========================================================

/**
 * Busca un usuario por número de documento.
 * Actualiza internamente el caché y el usuario activo.
 *
 * @param {string} documento
 * @returns {Promise<Object|null>}
 */
export async function buscarUsuario(documento) {
    const usuarios = await getUsuarios();
    _cachedUsers   = usuarios;

    const usuario = usuarios.find(u => String(u.documento) === String(documento)) ?? null;

    // Usa el setter para que pase la validación de id y documento
    setCurrentUser(usuario);
    return _currentUser;
}


// ==========================================================
// SERVICIO – TAREAS
// ==========================================================

/**
 * Obtiene todas las tareas del backend.
 * El array devuelto es la única fuente de verdad para el contador.
 * Nunca se cuenta manualmente: siempre es tareas.length del GET.
 *
 * @returns {Promise<Array>}
 */
export async function cargarTareas() {
    return await getTareas();
}

/**
 * Crea una nueva tarea usando el usuario activo.
 * No modifica ningún contador interno: el contador se actualiza
 * llamando a cargarTareas() después de esta operación.
 *
 * @param {string} title
 * @param {string} description
 * @param {string} status
 * @returns {Promise<Object>} Tarea registrada con ID asignado
 */
export async function crearTarea(title, description, status) {
    if (!_currentUser) throw new Error('No hay usuario activo para asignar la tarea');

    const nuevaTarea = {
        userId:          _currentUser.id,
        documento:       _currentUser.documento,
        nombre_completo: _currentUser.nombre_completo,
        title,
        description,
        status,
        fecha: getCurrentTimestamp()
    };

    return await postTarea(nuevaTarea);
    // Sin _totalTareasCount++ aquí: el contador lo calcula
    // la UI desde tareas.length después del GET de sincronización
}

/**
 * Actualiza una tarea existente (PATCH).
 *
 * @param {string|number} id
 * @param {Object}        datos
 * @returns {Promise<Object>}
 */
export async function editarTarea(id, datos) {
    return await actualizarTarea(id, datos);
}

/**
 * Elimina una tarea del backend.
 * No modifica ningún contador interno: el contador se actualiza
 * llamando a cargarTareas() después de esta operación.
 *
 * @param {string|number} id
 * @returns {Promise<true>}
 */
export async function borrarTarea(id) {
    await eliminarTarea(id);
    return true;
    // Sin decremento manual: el contador lo calcula
    // la UI desde tareas.length después del GET de sincronización
}
