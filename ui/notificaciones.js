import Swal from 'sweetalert2'


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

export const alertNotiExito = () => {
    Swal.fire({
      title: "Tarea registrada con exito!",
      text: "continua con la proxima!",
      icon: "OK",
    });
}

export const alertNotiInfo = () => {
    Swal.fire({
        title: "<strong>HTML <u>example</u></strong>",
        icon: "info",
        html: `
            You can use <b>bold text</b>,
            <a href="#" autofocus>links</a>,
            and other HTML tags
        `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> Great!
        `,
        confirmButtonAriaLabel: "Thumbs up, great!",
        cancelButtonText: `
            <i class="fa fa-thumbs-down"></i>
        `,
        cancelButtonAriaLabel: "Thumbs down"
        });
}
    