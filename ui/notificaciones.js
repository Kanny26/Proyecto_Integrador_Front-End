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
      icon: "success",
    });
}

export const alertNotiInfo = (dom) => {
    Swal.fire({
        title: "<strong>vas a editar una tarea</strong>",
        icon: "info",
        html: `
            Los datos editados se actualizaran y veras los nuevos 
        `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> Si, continuar!
        `,
        cancelButtonText: `
            <i class="fa fa-thumbs-down"></i> No, Cancelar
        `
        }).then((result) => {
        // Si el usuario hace click en CANCELAR
        if (result.dismiss === Swal.DismissReason.cancel) {
            dom.tareaFormEl.reset();  // el formulario se limpia 
        }
    });
}

export const alertNotiError = () => {
    Swal.fire({
    icon: "error",
    title:"Campos incompletos",
    text:"Por favor completa todos los campos",
    
    });
}

export const alertEditOk = () => {
    Swal.fire({
  title: "Edicion exitosa!",
  text: "edicion completada",
  icon: "success"
    });
}

export const alertDeleteOk = () => {
    Swal.fire({
  title: "Estas seguro de eliminar?",
  text: "No se podra revertir esta accion",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Si , Eliminalo!"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Eliminado!",
      text: "Tu archivo ha sido eliminado.",
      icon: "correctamente"
    });
  }
});
}

/**
 * Muestra alerta de confirmación de eliminación con SweetAlert2.
 * Retorna una promesa que se resuelve con true si confirma, false si cancela.
 *
 * @returns {Promise<boolean>}
 */
export const alertDeleteConfirm = () => {
    return Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "No se podrá revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡elimínalo!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        return result.isConfirmed;
    });
}
