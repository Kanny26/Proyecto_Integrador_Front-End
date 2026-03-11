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

import { createCardTarea, actualizarCardEnDOM } from './cardTarea.js';
import { validateForm, formatTasksToJSON } from '../utils/index.js';
import { showError, clearError, mostrarErroresFormulario } from './errores.js';
import { mostrarNotificacion, alertNotiExito, alertNotiInfo, alertNotiError, alertEditOk, alertDeleteConfirm } from './notificaciones.js';
import { descargarArchivoJSON } from './index.js';


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
    if (dom.taskNameInput) dom.taskNameInput.disabled = false;
    if (dom.taskStatusInput) dom.taskStatusInput.disabled = false;
    if (dom.userTareaInput) dom.userTareaInput.disabled = false;
}

export function deshabilitarFormularioTareas() {
    if (dom.taskNameInput) { dom.taskNameInput.disabled = true; dom.taskNameInput.value = ''; }
    if (dom.taskStatusInput) { dom.taskStatusInput.disabled = true; dom.taskStatusInput.value = 'pendiente'; }
    if (dom.userTareaInput) { dom.userTareaInput.disabled = true; dom.userTareaInput.value = ''; }
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
        btnCancel = document.createElement('button');
        btnCancel.id = 'btnCancelEdit';
        btnCancel.type = 'button';
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

    if (dom.taskNameInput) dom.taskNameInput.value = '';
    if (dom.userTareaInput) dom.userTareaInput.value = '';
    if (dom.taskStatusInput) dom.taskStatusInput.value = 'pendiente';

    if (dom.submitBtnEl) {
        dom.submitBtnEl.querySelector('.btn__text').textContent = 'Asignar Tarea';
        dom.submitBtnEl.classList.remove('btn--update');
    }

    document.getElementById('btnCancelEdit')?.classList.add('hidden');
    dom.tareaFormEl.reset();

    if (dom.userIDInput) dom.userIDInput.disabled = false;
    if (dom.userNameInput) dom.userNameInput.disabled = false;

    clearError(dom.taskNameError, dom.taskNameInput);
    clearError(dom.userTareaError, dom.userTareaInput);
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
                dom.userNameInput.value = '';
                dom.userNameInput.disabled = false;
            }
        }
    }

    if (target === dom.userNameInput) clearError(dom.userNameError, dom.userNameInput);
    if (target === dom.taskNameInput) clearError(dom.taskNameError, dom.taskNameInput);
    if (target === dom.taskStatusInput) clearError(dom.taskStatusError, dom.taskStatusInput);
    if (target === dom.userTareaInput) clearError(dom.userTareaError, dom.userTareaInput);
}


/**
 * Carga los datos de una tarea en el formulario para editarla (PATCH).
 */
async function manejarClickEditar(tareaId) {
    alertNotiInfo(dom);
    const card = document.querySelector(`.tarea-card[data-id="${tareaId}"]`);
    if (!card) return;

    const title = card.querySelector('.tarea-card__title')?.textContent;
    const description = card.querySelector('.tarea-card__content')?.textContent;
    const statusEl = card.querySelector('.tarea-card__status');
    const status = statusEl?.textContent.toLowerCase().replace(/\s+/g, ' ');
    const userName = card.querySelector('.tarea-card__username')?.textContent;
    const documento = card.dataset.documento;

    if (dom.taskNameInput) dom.taskNameInput.value = title || '';
    if (dom.userTareaInput) dom.userTareaInput.value = description || '';
    if (dom.taskStatusInput) dom.taskStatusInput.value = status || 'pendiente';
    if (dom.userIDInput) { dom.userIDInput.value = documento || ''; dom.userIDInput.disabled = true; }
    if (dom.userNameInput) { dom.userNameInput.value = userName || ''; dom.userNameInput.disabled = true; }

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
    const confirmar = await alertDeleteConfirm();
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
    const btn = e.target.closest('button');
    if (!btn) return;

    const card = btn.closest('.tarea-card');
    if (!card) return;

    const tareaId = card.dataset.id;
    const action = btn.dataset.action;

    if (action === 'edit' && tareaId) { e.preventDefault(); manejarClickEditar(tareaId); }
    if (action === 'delete' && tareaId) { e.preventDefault(); manejarClickEliminar(tareaId); }
}


/**
 * Maneja la exportación de tareas a JSON descargable.
 * Respeta la separación de responsabilidades:
 * 1. Obtiene datos del servicio.
 * 2. Formatea datos con una utilidad pura.
 * 3. Gestiona la descarga con una utilidad de UI.
 */
export async function handleExportTasks() {
    try {
        mostrarNotificacion('Preparando exportación...');

        // 1. Obtener los datos actuales de las tareas (Capa de Servicio)
        const tareas = await cargarTareas();

        if (tareas.length === 0) {
            alertNotiInfo();
            mostrarNotificacion('No hay tareas para exportar');
            return;
        }

        // 2. Formatear los datos a JSON (Capa de Utilidades - Lógica pura)
        const jsonString = formatTasksToJSON(tareas);

        // 3. Disparar la descarga (Capa de UI - Interacción navegador)
        const fechaActual = new Date().toISOString().split('T')[0];
        const nombreArchivo = `tareas_reporte_${fechaActual}.json`;

        descargarArchivoJSON(jsonString, nombreArchivo);

        // alertNotiExito();
        mostrarNotificacion('Exportación completada');

    } catch (error) {
        console.error('Error al exportar tareas:', error);
        alertNotiError();
        mostrarNotificacion('Fallo la exportación: ' + error.message);
    }
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
                    dom.userNameInput.value = usuario.nombre_completo;
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
        idVal: dom.userIDInput?.value.trim() ?? '',
        nameVal: dom.userNameInput?.value.trim() ?? '',
        taskTitleVal: dom.taskNameInput?.value.trim() ?? '',
        taskStatusVal: dom.taskStatusInput?.value ?? '',
        taskDescVal: dom.userTareaInput?.value.trim() ?? ''
    };

    const { isValid, errors } = validateForm(valores, editandoTareaId, getCurrentUser());

    // ── Mostrar errores en el DOM (ui/errores.js) ─────────
    mostrarErroresFormulario(dom, errors);
    if (!isValid) {
        alertNotiError();
        return;
    }


    const taskTitle = dom.taskNameInput.value.trim();
    const taskDesc = dom.userTareaInput.value.trim();
    const taskStatus = dom.taskStatusInput.value;

    try {

        // ── Flujo PATCH (actualizar) ───────────────────────
        if (editandoTareaId) {
            const tareaActualizada = await editarTarea(editandoTareaId, {
                title: taskTitle,
                description: taskDesc,
                status: taskStatus
            });
            actualizarCardEnDOM(editandoTareaId, tareaActualizada);

            alertEditOk('✅ Tarea actualizada correctamente');
            dom.tareaFormEl.reset();
            cancelarEdicion();

            // Recargar para sincronizar contador desde el backend
            await inicializarApp();

            // ── Flujo POST (crear) ─────────────────────────────
        } else {
            await crearTarea(taskTitle, taskDesc, taskStatus);

            if (dom.taskNameInput) dom.taskNameInput.value = '';
            if (dom.userTareaInput) dom.userTareaInput.value = '';
            if (dom.taskStatusInput) dom.taskStatusInput.value = 'pendiente';
            alertNotiExito();

            // Recargar para sincronizar contador desde el backend
            // El contador es tareas.length del GET, no un incremento manual
            await inicializarApp();
        }

    } catch (error) {
        console.error('Error en la operación:', error);
        showError(dom.userTareaError, dom.userTareaInput, error.message);
    }
}


/**
 * Filtra las tareas en el DOM según el estado seleccionado en el dropdown.
 */
export function filtrarTareas(event) {
    const filtro = event.target.value.toLowerCase(); // 'todas', 'pendiente', 'en proceso', 'completada'
    const cards = dom.tareasContainerEl?.querySelectorAll('.tarea-card');

    if (!cards) return;

    let tareasVisibles = 0;

    cards.forEach(card => {
        const statusEl = card.querySelector('.tarea-card__status');
        if (!statusEl) return;

        // El texto o la clase nos dice el estado. Usamos la clase reemplazando el espacio por guion
        // Ejemplo: 'en proceso' -> 'en-proceso'
        const expectedClass = filtro.replace(' ', '-');

        if (filtro === '' || filtro === 'todas' || statusEl.classList.contains(expectedClass)) {
            card.classList.remove('hidden');
            tareasVisibles++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Actualizamos el contador UI localmente (opcional pero ayuda al UX del filtro)
    // Opcionalmente podemos dejar el total o mostrar "(X filtradas de Y)"
    if (dom.tareaCountEl) {
        if (filtro === '' || filtro === 'todas') {
            updateTareaCount(cards.length);
        } else {
            dom.tareaCountEl.textContent = `${tareasVisibles} Filtradas de ${cards.length}`;
        }
    }
}


/**
 * Ordena las tareas en el DOM de acuerdo al criterio seleccionado.
 */
export function ordenarTareas() {
    if (!dom.tareasContainerEl || !dom.sortFieldEl || !dom.sortBtnEl) return;

    // Obtenemos un array de los elementos "card" actuales
    const cards = Array.from(dom.tareasContainerEl.querySelectorAll('.tarea-card'));
    const criterio = dom.sortFieldEl.value; // 'fecha', 'estado', 'nombre'

    // Alternar dirección visual y de memoria
    const currentDir = dom.sortBtnEl.dataset.dir || 'desc';
    const newDir = currentDir === 'desc' ? 'asc' : 'desc';
    dom.sortBtnEl.dataset.dir = newDir;

    // Actualizar el texto del botón según la dirección
    dom.sortBtnEl.textContent = `Ordenar ${newDir === 'desc' ? '↓' : '↑'}`;

    // Multiplicador para invertir el sort (1 o -1)
    const dirMult = newDir === 'desc' ? 1 : -1;

    // Pesos para ordenar estado lógicamente: Pendiente (1) -> En proceso (2) -> Completada (3)
    const estadoPesos = {
        'pendiente': 1,
        'en proceso': 2,
        'completada': 3
    };

    cards.sort((a, b) => {
        let result = 0;

        if (criterio === 'nombre') {
            const titleA = a.querySelector('.tarea-card__title')?.textContent.toLowerCase() || '';
            const titleB = b.querySelector('.tarea-card__title')?.textContent.toLowerCase() || '';
            result = titleA.localeCompare(titleB);
        }

        else if (criterio === 'estado') {
            const statusA = a.querySelector('.tarea-card__status')?.textContent.toLowerCase() || 'pendiente';
            const statusB = b.querySelector('.tarea-card__status')?.textContent.toLowerCase() || 'pendiente';

            const pesoA = estadoPesos[statusA] || 0;
            const pesoB = estadoPesos[statusB] || 0;
            result = pesoA - pesoB;
        }

        else if (criterio === 'fecha') {
            const dateStrA = a.querySelector('.tarea-card__timestamp')?.textContent || '';
            const dateStrB = b.querySelector('.tarea-card__timestamp')?.textContent || '';

            // Convert Spanish textual dates "3 de marzo de 2026, 11:51" into parseable dates
            const parseSpanishDate = (str) => {
                if (!str) return 0;
                const meses = {
                    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
                    'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
                };

                // Regex to extract day, month, year, time
                const match = str.match(/(\d+)\s+de\s+([a-zA-Z]+)\s+de\s+(\d+),\s+(\d+):(\d+)/);
                if (match) {
                    const [_, day, monthStr, year, hour, minute] = match;
                    const month = meses[monthStr.toLowerCase()];
                    if (month !== undefined) {
                        return new Date(year, month, day, hour, minute).getTime();
                    }
                }
                // Fallback to integer ID if parsing fails
                return parseInt(a.dataset.id) || 0;
            };

            const timeA = parseSpanishDate(dateStrA);
            const timeB = parseSpanishDate(dateStrB);

            result = timeB - timeA; // Mayor Date (más reciente) primero
        }

        return result * dirMult;
    });

    // Reinsertar en el DOM en el nuevo orden
    cards.forEach(card => dom.tareasContainerEl.appendChild(card));
}

export function crearControlesFiltroyOrdenamiento() {
    const messagesHeader = document.querySelector('.messages-header');
    if (!messagesHeader) {
        console.error('❌ Error: No se encontró .messages-header');
        return;
    }

    let actionsDiv = messagesHeader.querySelector('.messages-header__actions');
    if (!actionsDiv) {
        actionsDiv = document.createElement('div');
        actionsDiv.className = 'messages-header__actions';
        messagesHeader.appendChild(actionsDiv);
    }

    actionsDiv.innerHTML = '';

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'messages-header__controls';

    // CREAR SELECT DE FILTRO
    const filterSelect = document.createElement('select');
    filterSelect.id = 'filterField';
    filterSelect.className = 'messages-filter';
    filterSelect.title = 'Filtrar tareas por estado';

    const filterOptions = [
        { value: '', text: 'Todos' },
        { value: 'pendiente', text: 'Pendiente' },
        { value: 'en proceso', text: 'En proceso' },
        { value: 'completada', text: 'Completada' }
    ];

    filterOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        filterSelect.appendChild(option);
    });

    controlsDiv.appendChild(filterSelect);

    // CREAR CONTENEDOR DE ORDENAMIENTO
    const sortContainer = document.createElement('div');
    sortContainer.className = 'messages-sort-container';

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortField';
    sortSelect.className = 'messages-sort-select';
    sortSelect.title = 'Ordenar por criterio';

    const sortOptions = [
        { value: 'fecha', text: 'Fecha' },
        { value: 'estado', text: 'Estado' },
        { value: 'nombre', text: 'Nombre' }
    ];

    sortOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        sortSelect.appendChild(option);
    });

    sortContainer.appendChild(sortSelect);

    const sortButton = document.createElement('button');
    sortButton.id = 'sortBtn';
    sortButton.type = 'button';
    sortButton.className = 'btn btn--sort';
    sortButton.title = 'Cambiar dirección de ordenamiento';
    sortButton.textContent = 'Ordenar ↓';
    sortButton.dataset.dir = 'desc';

    sortContainer.appendChild(sortButton);

    controlsDiv.appendChild(sortContainer);
    actionsDiv.appendChild(controlsDiv);

    const tareaCountEl = document.getElementById('tareaCount');
    const exportBtn = document.getElementById('exportBtn');

    if (tareaCountEl && !actionsDiv.contains(tareaCountEl)) {
        actionsDiv.appendChild(tareaCountEl);
    }

    console.log('Controles de filtrado y ordenamiento creados');
}
