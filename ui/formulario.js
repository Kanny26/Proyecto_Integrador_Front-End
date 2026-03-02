/**
 * ==========================================================
 * UI – Formulario: handlers de eventos y lógica de interfaz
 * ==========================================================
 * Responsabilidad:
 * - Manejar todos los eventos del formulario y las tarjetas
 * - Controlar el estado visual
 * - Coordinar la respuesta visual después de cada operación
 *
 * Contador de tareas:
 * - SIEMPRE se calcula desde el backend (tareas.length del GET)
 * - Nunca se incrementa ni decrementa manualmente
 * - Esto garantiza que el contador siempre esté sincronizado
 *   con el estado real de la base de datos
 * ==========================================================
 */

import {
    buscarUsuario,
    cargarTareas,
    crearTarea,
    editarTarea,
    borrarTarea,
    getCurrentUser,
    getCachedUsers,
    setCurrentUser
} from '../services/index.js';

import { createCardTarea, actualizarCardEnDOM }        from './cardTarea.js';
import { validateForm }                                from '../utils/index.js';
import { showError, clearError, mostrarErroresFormulario } from './errores.js';
import { mostrarNotificacion }                         from './notificaciones.js';


// ==========================================================
// REFERENCIAS AL DOM (se reciben desde main.js con init())
// Nombres en español para consistencia con el dominio
// ==========================================================

let dom = {};

/** null = modo crear (POST) | ID = modo editar (PATCH) */
let editandoTareaId = null;


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

/**
 * Recibe todas las referencias del DOM desde main.js.
 * Debe llamarse una sola vez antes de registrar eventos.
 * @param {Object} domRefs
 */
export function init(domRefs) {
    dom = domRefs;
}


// ==========================================================
// HELPERS DE INTERFAZ
// ==========================================================

/**
 * Actualiza el contador de tareas en el DOM.
 * Siempre recibe el valor real desde el backend (tareas.length).
 * @param {number} count
 */
export function updateTareaCount(count) {
    if (!dom.tareaCountEl) return;
    dom.tareaCountEl.textContent = `${count} Tarea${count !== 1 ? 's' : ''}`;
}

export function hideEmptyState() {
    dom.emptyStateEl?.classList.add('hidden');
}

export function showEmptyState() {
    dom.emptyStateEl?.classList.remove('hidden');
}

export function habilitarFormularioTareas() {
    if (dom.taskNameInput)   dom.taskNameInput.disabled   = false;
    if (dom.taskStatusInput) dom.taskStatusInput.disabled  = false;
    if (dom.userTareaInput)  dom.userTareaInput.disabled   = false;
}

export function deshabilitarFormularioTareas() {
    if (dom.taskNameInput)   { dom.taskNameInput.disabled   = true; dom.taskNameInput.value   = ''; }
    if (dom.taskStatusInput) { dom.taskStatusInput.disabled  = true; dom.taskStatusInput.value  = 'activa'; }
    if (dom.userTareaInput)  { dom.userTareaInput.disabled   = true; dom.userTareaInput.value   = ''; }
}

export function populateUserSuggestions(documentNumber) {
    if (!dom.usersList || !documentNumber) return;
    dom.usersList.innerHTML = '';

    getCachedUsers()
        .filter(u => String(u.documento).startsWith(documentNumber))
        .forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.nombre_completo;
            dom.usersList.appendChild(opt);
        });
}

function mostrarBotonCancelar() {
    let btnCancel = document.getElementById('btnCancelEdit');

    if (!btnCancel && dom.submitBtnEl?.parentElement) {
        btnCancel           = document.createElement('button');
        btnCancel.id        = 'btnCancelEdit';
        btnCancel.type      = 'button';
        btnCancel.className = 'btn btn--secondary';
        btnCancel.innerHTML = '<span class="btn__text">Cancelar</span>';
        btnCancel.style.marginLeft = 'var(--spacing-sm)';
        btnCancel.addEventListener('click', cancelarEdicion);
        dom.submitBtnEl.parentElement.appendChild(btnCancel);
    }

    btnCancel?.classList.remove('hidden');
}

export function cancelarEdicion() {
    editandoTareaId = null;

    if (dom.taskNameInput)   dom.taskNameInput.value   = '';
    if (dom.userTareaInput)  dom.userTareaInput.value   = '';
    if (dom.taskStatusInput) dom.taskStatusInput.value  = 'activa';

    if (dom.submitBtnEl) {
        dom.submitBtnEl.querySelector('.btn__text').textContent = 'Asignar Tarea';
        dom.submitBtnEl.classList.remove('btn--update');
    }

    document.getElementById('btnCancelEdit')?.classList.add('hidden');

    if (dom.userIDInput)   dom.userIDInput.disabled   = false;
    if (dom.userNameInput) dom.userNameInput.disabled  = false;

    clearError(dom.taskNameError,   dom.taskNameInput);
    clearError(dom.userTareaError,  dom.userTareaInput);
    clearError(dom.taskStatusError, dom.taskStatusInput);
}


// ==========================================================
// SINCRONIZACIÓN DE VISTA CON BACKEND
// ==========================================================

/**
 * Recarga todas las tareas desde el backend y actualiza la vista.
 * Es la única función que actualiza el contador: usa tareas.length
 * del GET real, nunca un valor calculado manualmente.
 */
export async function inicializarApp() {
    try {
        const tareas = await cargarTareas();

        dom.tareasContainerEl.innerHTML = '';

        if (tareas.length === 0) {
            showEmptyState();
            updateTareaCount(0);
            return;
        }

        [...tareas].reverse().forEach(tarea => {
            const card = createCardTarea(
                tarea.id,
                tarea.userId,
                tarea.nombre_completo,
                tarea.title,
                tarea.description,
                tarea.status,
                tarea.fecha,
                tarea.documento
            );
            dom.tareasContainerEl.appendChild(card);
        });

        // Contador siempre desde el backend: tareas.length del GET
        updateTareaCount(tareas.length);
        hideEmptyState();

    } catch (error) {
        console.error('Error al cargar tareas:', error);
        mostrarNotificacion(error.message);
        showEmptyState();
    }
}


// ==========================================================
// MANEJADORES DE EVENTOS
// ==========================================================

/**
 * Sanitiza inputs y limpia errores en tiempo real.
 */
export function handleInputChange(e) {
    const target = e.target;
    if (!target) return;

    if (target === dom.userIDInput) {
        const cleaned = target.value.replace(/\D+/g, '');
        if (target.value !== cleaned) target.value = cleaned;

        clearError(dom.userIDError, dom.userIDInput);
        populateUserSuggestions(cleaned);

        if (!cleaned && dom.usersList) dom.usersList.innerHTML = '';

        // Si cambia el documento se invalida el usuario cargado
        if (getCurrentUser()) {
            setCurrentUser(null);
            deshabilitarFormularioTareas();
            if (dom.userNameInput) {
                dom.userNameInput.value    = '';
                dom.userNameInput.disabled = false;
            }
        }
    }

    if (target === dom.userNameInput)   clearError(dom.userNameError,   dom.userNameInput);
    if (target === dom.taskNameInput)   clearError(dom.taskNameError,   dom.taskNameInput);
    if (target === dom.taskStatusInput) clearError(dom.taskStatusError, dom.taskStatusInput);
    if (target === dom.userTareaInput)  clearError(dom.userTareaError,  dom.userTareaInput);
}


/**
 * Carga los datos de una tarea en el formulario para editarla (PATCH).
 */
async function manejarClickEditar(tareaId) {
    const card = document.querySelector(`.tarea-card[data-id="${tareaId}"]`);
    if (!card) return;

    const title       = card.querySelector('.tarea-card__title')?.textContent;
    const description = card.querySelector('.tarea-card__content')?.textContent;
    const status      = card.querySelector('.tarea-card__status')?.classList.contains('activa')
                            ? 'activa' : 'inactiva';
    const userName    = card.querySelector('.tarea-card__username')?.textContent;
    const documento   = card.dataset.documento;

    if (dom.taskNameInput)   dom.taskNameInput.value   = title       || '';
    if (dom.userTareaInput)  dom.userTareaInput.value   = description || '';
    if (dom.taskStatusInput) dom.taskStatusInput.value  = status      || 'activa';
    if (dom.userIDInput)   { dom.userIDInput.value    = documento || ''; dom.userIDInput.disabled   = true; }
    if (dom.userNameInput) { dom.userNameInput.value  = userName  || ''; dom.userNameInput.disabled  = true; }

    editandoTareaId = tareaId;

    if (dom.submitBtnEl) {
        dom.submitBtnEl.querySelector('.btn__text').textContent = 'Actualizar Tarea';
        dom.submitBtnEl.classList.add('btn--update');
    }

    mostrarBotonCancelar();
    habilitarFormularioTareas();

    const usuario = await buscarUsuario(documento);
    if (usuario) setCurrentUser(usuario);
}


/**
 * Elimina una tarea con confirmación (DELETE).
 * Después de eliminar, recarga desde el backend para sincronizar
 * el contador con el estado real de la base de datos.
 */
async function manejarClickEliminar(tareaId) {
    const confirmar = confirm('¿Desea eliminar esta tarea? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    try {
        await borrarTarea(tareaId);

        // Recargar desde backend: el contador se sincroniza con
        // tareas.length real, no con un decremento manual
        await inicializarApp();

        mostrarNotificacion('Tarea eliminada correctamente');

    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        alert(`No se pudo eliminar la tarea.\n${error.message}`);
    }
}


/**
 * Delegación de eventos para los botones Editar/Eliminar.
 */
export function manejarClickCard(e) {
    const btn  = e.target.closest('button');
    if (!btn) return;

    const card = btn.closest('.tarea-card');
    if (!card) return;

    const tareaId = card.dataset.id;
    const action  = btn.dataset.action;

    if (action === 'edit'   && tareaId) { e.preventDefault(); manejarClickEditar(tareaId);  }
    if (action === 'delete' && tareaId) { e.preventDefault(); manejarClickEliminar(tareaId); }
}


/**
 * Control principal del formulario.
 * Flujo: GET usuario → POST crear | PATCH actualizar
 */
export async function handleFormSubmit(event) {
    event.preventDefault();

    const userID = dom.userIDInput?.value.trim();

    // ── Paso 1: buscar usuario (GET) ───────────────────────
    if (!getCurrentUser() && !editandoTareaId) {
        if (!userID) {
            showError(dom.userIDError, dom.userIDInput, 'Ingrese un número de documento');
            return;
        }

        try {
            const usuario = await buscarUsuario(userID);

            if (usuario) {
                if (dom.userNameInput) {
                    dom.userNameInput.value    = usuario.nombre_completo;
                    dom.userNameInput.disabled = true;
                }
                habilitarFormularioTareas();
                clearError(dom.userIDError, dom.userIDInput);
            } else {
                deshabilitarFormularioTareas();
                showError(dom.userIDError, dom.userIDInput, 'Usuario no encontrado en el sistema');
            }

        } catch (error) {
            console.error('Error al buscar usuario:', error);
            showError(dom.userIDError, dom.userIDInput, error.message);
        }
        return;
    }

    // Validar coherencia de documento con usuario cargado
    const usuarioActual = getCurrentUser();
    if (!editandoTareaId && usuarioActual && String(usuarioActual.documento) !== String(userID)) {
        showError(dom.userIDError, dom.userIDInput, 'El documento no coincide con el usuario cargado');
        setCurrentUser(null);
        deshabilitarFormularioTareas();
        return;
    }

    // ── Validación pura (devuelve objeto, no toca el DOM) ──
    const valores = {
        idVal:         dom.userIDInput?.value.trim()    ?? '',
        nameVal:       dom.userNameInput?.value.trim()  ?? '',
        taskTitleVal:  dom.taskNameInput?.value.trim()  ?? '',
        taskStatusVal: dom.taskStatusInput?.value       ?? '',
        taskDescVal:   dom.userTareaInput?.value.trim() ?? ''
    };

    const { isValid, errors } = validateForm(valores, editandoTareaId, getCurrentUser());

    // ── Mostrar errores en el DOM (ui/errores.js) ─────────
    mostrarErroresFormulario(dom, errors);
    if (!isValid) return;

    const taskTitle  = dom.taskNameInput.value.trim();
    const taskDesc   = dom.userTareaInput.value.trim();
    const taskStatus = dom.taskStatusInput.value;

    try {

        // ── Flujo PATCH (actualizar) ───────────────────────
        if (editandoTareaId) {
            const tareaActualizada = await editarTarea(editandoTareaId, {
                title:       taskTitle,
                description: taskDesc,
                status:      taskStatus
            });

            actualizarCardEnDOM(editandoTareaId, tareaActualizada);
            alert('✅ Tarea actualizada correctamente');
            dom.tareaFormEl.reset();
            cancelarEdicion();

            // Recargar para sincronizar contador desde el backend
            await inicializarApp();

        // ── Flujo POST (crear) ─────────────────────────────
        } else {
            await crearTarea(taskTitle, taskDesc, taskStatus);

            if (dom.taskNameInput)   dom.taskNameInput.value   = '';
            if (dom.userTareaInput)  dom.userTareaInput.value   = '';
            if (dom.taskStatusInput) dom.taskStatusInput.value  = 'activa';

            alert('✅ Tarea asignada correctamente');

            // Recargar para sincronizar contador desde el backend
            // El contador es tareas.length del GET, no un incremento manual
            await inicializarApp();
        }

    } catch (error) {
        console.error('Error en la operación:', error);
        showError(dom.userTareaError, dom.userTareaInput, error.message);
    }
}
