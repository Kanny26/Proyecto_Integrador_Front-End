/**
 * ==========================================================
 * SERVICES – Barrel de exportaciones
 * ==========================================================
 * Solo lógica de negocio y estado. Sin DOM, sin presentación.
 *
 * import { getCurrentUser, setCurrentUser, getCachedUsers,
 *          buscarUsuario, cargarTareas, crearTarea,
 *          editarTarea, borrarTarea } from './services/index.js';
 * ==========================================================
 */

export {
    // Getters de estado
    getCurrentUser,
    getCachedUsers,

    // Setters de estado
    setCurrentUser,
    setCachedUsers,

    // Usuarios
    buscarUsuario,

    // Tareas
    cargarTareas,
    crearTarea,
    editarTarea,
    borrarTarea

} from './tareas.js';
