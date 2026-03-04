/**
 * ==========================================================
 * UI – Utilidades de descarga
 * ==========================================================
 * Responsabilidad:
 * - Manejar la interacción con el navegador para descargar archivos
 * - Acceso al DOM y APIs del navegador (Blob, URL, anchor)
 * ==========================================================
 */

/**
 * Provoca la descarga de una cadena de texto como un archivo JSON en el navegador.
 * 
 * @param {string} jsonString - Cadena de texto en formato JSON
 * @param {string} filename - Nombre del archivo a descargar
 */
export function descargarArchivoJSON(jsonString, filename = 'tareas_exportadas.json') {
    // Creamos un Blob con el contenido JSON
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Creamos una URL temporal para el Blob
    const url = URL.createObjectURL(blob);

    // Creamos un elemento anchor invisible para disparar la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Añadimos al DOM, clickeamos y removemos
    document.body.appendChild(link);
    link.click();

    // Limpieza
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
