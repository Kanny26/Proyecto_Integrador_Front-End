/**
 * ==========================================================
 * SERVICES – Barrel de exportaciones
 * ==========================================================
 * Solo lógica de negocio y estado. Sin DOM, sin presentación.
 *
 *   import { getCurrentUser, setCurrentUser, getCachedUsers,
 *            buscarUsuario, cargarTareas, crearTarea,
 *            editarTarea, borrarTarea,
 *            cargarUsuarios, crearUsuario, editarUsuario,
 *            eliminarUsuario, cambiarEstadoUsuario } from './services/index.js';
 * ==========================================================
 */

export {
    getCurrentUser,
    getCachedUsers,
    setCurrentUser,
    setCachedUsers,
    buscarUsuario,
    cargarTareas,
    crearTarea,
    editarTarea,
    borrarTarea
} from './tareas.js';

export {
    cargarUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario
} from './usuarios.js';
