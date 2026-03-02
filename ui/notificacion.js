/**
 * ==========================================================
 * UI – Notificación Toast
 * ==========================================================
 * Responsabilidad: mostrar mensajes temporales en pantalla.
 *
 * Se movió aquí desde services/ porque crea y manipula
 * elementos del DOM, lo que es responsabilidad de la capa UI.
 * services/ no debe tocar el DOM.
 * ==========================================================
 */

/**
 * Muestra una notificación temporal (toast) en pantalla.
 * Se elimina automáticamente después de 3 segundos.
 *
 * @param {string} mensaje
 */
export function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.className   = 'notification';
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('notification--hide');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
