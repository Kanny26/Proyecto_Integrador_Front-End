/**
 * ==========================================================
 * API – Barrel de exportaciones
 * ==========================================================
 * Punto único de importación para toda la capa HTTP.
 *
 *   import { getTareas, postTarea, actualizarTarea, eliminarTarea,
 *            getUsuarios, getUsuarioPorDocumento,
 *            createUser, updateUser, deleteUser, toggleUserStatus,
 *            assignUsersToTask } from './API/index.js';
 * ==========================================================
 */

export { getTareas }                                    from './getTareas.js';
export { postTarea }                                    from './postTareas.js';
export { actualizarTarea }                              from './updateTarea.js';
export { eliminarTarea }                                from './deleteTarea.js';
export { getUsuarios, getUsuarioPorDocumento }          from './getUsuario.js';
export { createUser, updateUser, deleteUser, toggleUserStatus } from './users.js';
export { assignUsersToTask }                            from './assignTask.js';
