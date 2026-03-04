/**
 * ==========================================================
 * UTILS – Exportación de datos
 * ==========================================================
 * Responsabilidad:
 * - Procesar arreglos de tareas y convertirlos a formatos de exportación
 * - Lógica pura, sin efectos secundarios ni acceso al DOM
 * ==========================================================
 */

/**
 * Convierte un arreglo de tareas a una cadena JSON formateada.
 * 
 * @param {Array} tasks - Lista de objetos de tarea
 * @returns {string} - JSON stringificado y formateado
 */
export function formatTasksToJSON(tasks) {
    if (!Array.isArray(tasks)) {
        throw new Error('Se esperaba un arreglo de tareas para exportar.');
    }

    // Retornamos el JSON con indentación de 2 espacios para que sea legible
    return JSON.stringify(tasks, null, 2);
}
