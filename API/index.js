/**
 * ==========================================================
 * API – Barrel de exportaciones
 * ==========================================================
 * Punto único de importación para toda la capa HTTP.
 * Permite importar cualquier función API desde un solo lugar:
 *
 *   import { getTareas, postTarea, actualizarTarea, eliminarTarea,
 *            getUsuarios, getUsuarioPorDocumento } from './API/index.js';
 * ==========================================================
 */

export { getTareas }               from './getTareas.js';
export { postTarea }               from './postTareas.js';
export { actualizarTarea }         from './updateTarea.js';
export { eliminarTarea }           from './deleteTarea.js';
export { getUsuarios, getUsuarioPorDocumento } from './getUsuario.js';
