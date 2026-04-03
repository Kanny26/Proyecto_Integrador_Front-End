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
        setCurrentUser,
        cargarUsuarios
    } from '../services/index.js';

    import { createCardTarea, actualizarCardEnDOM } from './cardTarea.js';
    import { validateForm, formatTasksToJSON } from '../utils/index.js';
    import { showError, clearError, mostrarErroresFormulario } from './errores.js';
    import { mostrarNotificacion, alertNotiExito, alertNotiInfo, alertNotiError, alertEditOk, alertDeleteConfirm } from './notificaciones.js';
    import { descargarArchivoJSON } from './descarga.js';


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
        // Solo deshabilitar si existe el campo userID (flujo de login por documento).
        // En el panel admin no hay userID, los campos deben estar siempre habilitados.
        if (dom.userIDInput) {
            if (dom.taskNameInput) { dom.taskNameInput.disabled = true; dom.taskNameInput.value = ''; }
            if (dom.taskStatusInput) { dom.taskStatusInput.disabled = true; dom.taskStatusInput.value = 'pendiente'; }
            if (dom.userTareaInput) { dom.userTareaInput.disabled = true; dom.userTareaInput.value = ''; }
        }
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

    /**
     * Popula el datalist de documentos con el formato "documento - nombre".
     */
    export async function populateDocSuggestions() {
        if (!dom.docsList) return;
        
        try {
            // Asegurarse de tener usuarios en el caché
            let usuarios = getCachedUsers();
            if (usuarios.length === 0) {
                await buscarUsuario(''); // Fuerza la carga de usuarios al caché
                usuarios = getCachedUsers();
            }

            dom.docsList.innerHTML = '';
            usuarios.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.documento;
                opt.textContent = `${u.documento} - ${u.nombre_completo}`;
                dom.docsList.appendChild(opt);
            });
        } catch (error) {
            console.error('Error al cargar sugerencias de documentos:', error);
        }
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
            const todasLasTareas = await cargarTareas();

            // Asegurar que el caché de usuarios esté cargado para resolver nombres
            let usuarios = getCachedUsers();
            if (usuarios.length === 0) {
                usuarios = await cargarUsuarios();
            }

            // Mapa id → usuario para lookup O(1)
            const usuarioMap = new Map(usuarios.map(u => [String(u.id), u]));

            /**
             * Dado una tarea, devuelve el nombre para mostrar en la card.
             * Prioridad: nombre_completo guardado → primer usuario asignado → fallback
             */
            function resolverNombre(tarea) {
                if (Array.isArray(tarea.usuariosAsignados) && tarea.usuariosAsignados.length > 0) {
                    const nombres = tarea.usuariosAsignados
                        .map(id => usuarioMap.get(String(id))?.nombre_completo)
                        .filter(Boolean);
                    
                    if (nombres.length === 1) return nombres[0];
                    if (nombres.length > 1) return `${nombres[0]} + ${nombres.length - 1} más`;
                }

                if (tarea.nombre_completo && tarea.nombre_completo !== 'undefined') {
                    return tarea.nombre_completo;
                }
                
                if (tarea.userId) {
                    const u = usuarioMap.get(String(tarea.userId));
                    if (u) return u.nombre_completo;
                }
                return 'Sin asignar';
            }

            function resolverDocumento(tarea) {
                if (Array.isArray(tarea.usuariosAsignados) && tarea.usuariosAsignados.length > 0) {
                    const u = usuarioMap.get(String(tarea.usuariosAsignados[0]));
                    if (u) return u.documento;
                }
                if (tarea.documento && tarea.documento !== 'undefined') return tarea.documento;
                if (tarea.userId) {
                    const u = usuarioMap.get(String(tarea.userId));
                    if (u) return u.documento;
                }
                return '';
            }

            // Detectar si estamos en modo usuario (no admin): filtrar por userId
            let modoUsuario = false;
            let tareas = todasLasTareas;

            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    if (user.rol !== 'admin') {
                        modoUsuario = true;
                        tareas = todasLasTareas.filter(t => {
                            const enUserId = String(t.userId) === String(user.id);
                            const enUserIds = Array.isArray(t.usuariosAsignados) && t.usuariosAsignados.some(id => String(id) === String(user.id));
                            return enUserId || enUserIds;
                        });
                    }
                } catch (_) { /* sessionStorage corrupto: mostrar todas */ }
            }

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
                    resolverNombre(tarea),
                    tarea.title,
                    tarea.description,
                    tarea.status,
                    tarea.fecha,
                    resolverDocumento(tarea),
                    modoUsuario,
                    tarea.usuariosAsignados || []
                );
                dom.tareasContainerEl.appendChild(card);
            });

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
    export async function handleInputChange(e) {
        const target = e.target;
        if (!target) return;

        if (target === dom.userIDInput) {
            const cleaned = target.value.replace(/\D+/g, '');
            if (target.value !== cleaned) target.value = cleaned;

            clearError(dom.userIDError, dom.userIDInput);
            populateUserSuggestions(cleaned);

            if (!cleaned && dom.usersList) dom.usersList.innerHTML = '';

            // Auto-fill logic
            if (cleaned.length >= 3) {
                try {
                    const usuarioMatch = await buscarUsuario(cleaned);
                    if (usuarioMatch) {
                        if (dom.userNameInput) {
                            dom.userNameInput.value = usuarioMatch.nombre_completo;
                            dom.userNameInput.disabled = true;
                        }
                        habilitarFormularioTareas();
                        clearError(dom.userIDError, dom.userIDInput);
                    } else {
                        if (dom.userNameInput) {
                            dom.userNameInput.value = '';
                            dom.userNameInput.disabled = false;
                        }
                        setCurrentUser(null);
                        deshabilitarFormularioTareas();
                    }
                } catch (err) {
                    console.error('Error al auto-completar usuario:', err);
                }
            } else {
                if (dom.userNameInput) {
                    dom.userNameInput.value = '';
                    dom.userNameInput.disabled = false;
                }
                setCurrentUser(null);
                deshabilitarFormularioTareas();
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
        const result = await alertNotiInfo();
        if (result.dismiss) return; // usuario canceló
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

        // -- Pre-seleccionar los usuarios de la tarea --
        try {
            const rawUsuarios = card.dataset.usuarios || '[]';
            const asignadosIds = JSON.parse(rawUsuarios).map(id => String(id));
            
            const checkboxList = document.getElementById('usuariosCheckboxList');
            if (checkboxList) {
                const checkboxes = checkboxList.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    const isAsignado = asignadosIds.includes(String(cb.value));
                    cb.checked = isAsignado;
                    
                    // También marcar en el select oculto para consistencia
                    if (dom.usuariosAsignadosEl) {
                        const opt = Array.from(dom.usuariosAsignadosEl.options).find(o => String(o.value) === String(cb.value));
                        if (opt) opt.selected = isAsignado;
                    }
                });
            }
        } catch (e) {
            console.error('Error al pre-seleccionar usuarios:', e);
        }

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
     * Marca una tarea como completada (modo usuario).
     */
    async function manejarClickCompletar(tareaId, btn) {
        try {
            const tareaActualizada = await editarTarea(tareaId, { status: 'completada' });
            actualizarCardEnDOM(tareaId, tareaActualizada);
            if (btn) { btn.disabled = true; btn.textContent = 'Completada ✓'; }
            mostrarNotificacion('Tarea marcada como completada');
        } catch (error) {
            console.error('Error al completar la tarea:', error);
            mostrarNotificacion('Error al actualizar la tarea: ' + error.message);
        }
    }


    /**
     * Delegación de eventos para los botones Editar/Eliminar/Completar.
     */
    export function manejarClickCard(e) {
        const btn = e.target.closest('button');
        if (!btn) return;

        const card = btn.closest('.tarea-card');
        if (!card) return;

        const tareaId = card.dataset.id;
        const action = btn.dataset.action;

        if (action === 'edit'     && tareaId) { e.preventDefault(); manejarClickEditar(tareaId); }
        if (action === 'delete'   && tareaId) { e.preventDefault(); manejarClickEliminar(tareaId); }
        if (action === 'complete' && tareaId) { e.preventDefault(); manejarClickCompletar(tareaId, btn); }
    }


    /**
     * Maneja la exportación de tareas a JSON descargable.
     * Exporta SOLO las tareas actualmente visibles (respeta el filtro activo).
     */
    export async function handleExportTasks() {
        try {
            // Leer las cards visibles en el DOM (respeta el filtro activo)
            const cards = dom.tareasContainerEl
                ? Array.from(dom.tareasContainerEl.querySelectorAll('.tarea-card:not(.hidden)'))
                : [];

            if (cards.length === 0) {
                alertNotiInfo();
                mostrarNotificacion('No hay tareas visibles para exportar');
                return;
            }

            // Reconstruir objetos desde el DOM para exportar solo lo visible
            const tareas = cards.map(card => ({
                id:              card.dataset.id,
                documento:       card.dataset.documento,
                nombre_completo: card.querySelector('.tarea-card__username')?.textContent || '',
                title:           card.querySelector('.tarea-card__title')?.textContent || '',
                description:     card.querySelector('.tarea-card__content')?.textContent || '',
                status:          card.querySelector('.tarea-card__status')?.textContent?.toLowerCase() || '',
                fecha:           card.querySelector('.tarea-card__timestamp')?.textContent || ''
            }));

            const jsonString = formatTasksToJSON(tareas);
            const fechaActual = new Date().toISOString().split('T')[0];
            descargarArchivoJSON(jsonString, `tareas_reporte_${fechaActual}.json`);
            mostrarNotificacion(`Exportación completada (${tareas.length} tarea${tareas.length !== 1 ? 's' : ''})`);

        } catch (error) {
            console.error('Error al exportar tareas:', error);
            alertNotiError();
            mostrarNotificacion('Falló la exportación: ' + error.message);
        }
    }


    /**
     * Control principal del formulario.
     * Flujo: GET usuario → POST crear | PATCH actualizar
     */
    export async function handleFormSubmit(event) {
        event.preventDefault();

        const userID = dom.userIDInput?.value.trim();

        // ── Detectar modo admin (sin campo userID, con multi-select de usuarios) ──
        const esModoAdmin = !dom.userIDInput && !!dom.usuariosAsignadosEl;

        // ── Paso 1: buscar usuario (GET) — solo en modo usuario normal ─────────
        if (!esModoAdmin && !getCurrentUser() && !editandoTareaId) {
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
        // Solo aplica cuando el input de documento existe (form_admin_task no lo tiene)
        if (!editandoTareaId && !esModoAdmin && getCurrentUser() && dom.userIDInput && String(getCurrentUser().documento) !== String(userID)) {
            showError(dom.userIDError, dom.userIDInput, 'El documento no coincide con el usuario cargado');
            setCurrentUser(null);
            deshabilitarFormularioTareas();
            return;
        }

        // En modo admin, validar que haya al menos un usuario seleccionado
        if (esModoAdmin && !editandoTareaId) {
            const selectedIds = Array.from(dom.usuariosAsignadosEl?.selectedOptions ?? []).map(o => o.value);
            if (selectedIds.length === 0) {
                const errorEl = document.getElementById('usuariosAsignadosError');
                if (errorEl) errorEl.textContent = 'Selecciona al menos un usuario para asignar la tarea';
                return;
            } else {
                const errorEl = document.getElementById('usuariosAsignadosError');
                if (errorEl) errorEl.textContent = '';
            }
        }

        // ── Validación pura (devuelve objeto, no toca el DOM) ──
        const usuarioActual = getCurrentUser();
        const usuarioParaValidar = esModoAdmin
            ? (JSON.parse(sessionStorage.getItem('currentUser') || 'null'))
            : usuarioActual;

        const valores = {
            idVal: dom.userIDInput
                ? (dom.userIDInput.value.trim())
                : (usuarioParaValidar?.documento ?? '0'),
            nameVal: dom.userNameInput
                ? (dom.userNameInput.value.trim())
                : (usuarioParaValidar?.nombre_completo ?? 'admin'),
            taskTitleVal: dom.taskNameInput?.value.trim() ?? '',
            taskStatusVal: dom.taskStatusInput?.value ?? '',
            taskDescVal: dom.userTareaInput?.value.trim() ?? ''
        };

        // En modo admin saltamos las validaciones de usuario (id/nombre) ya que
        // el usuario se selecciona del multi-select, no del input de documento
        const { isValid, errors } = validateForm(valores, editandoTareaId || esModoAdmin, usuarioParaValidar);

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
                const selectedIds = dom.usuariosAsignadosEl 
                    ? Array.from(dom.usuariosAsignadosEl.selectedOptions).map(o => o.value)
                    : undefined;

                const tareaActualizada = await editarTarea(editandoTareaId, {
                    title: taskTitle,
                    description: taskDesc,
                    status: taskStatus,
                    usuariosAsignados: selectedIds
                });
                actualizarCardEnDOM(editandoTareaId, tareaActualizada);

                alertEditOk('✅ Tarea actualizada correctamente');
                dom.tareaFormEl.reset();
                cancelarEdicion();

                // Recargar para sincronizar contador desde el backend
                await inicializarApp();

                // ── Flujo POST (crear) ─────────────────────────────
            } else {
                // ── Flujo POST (crear) ─────────────────────────────
                let tareaCreada;

                if (esModoAdmin) {
                    // Modo admin: usar el primer usuario seleccionado del multi-select
                    const selectedOptions = Array.from(dom.usuariosAsignadosEl.selectedOptions);
                    const selectedIds = selectedOptions.map(o => o.value);
                    const primerUserId = selectedIds[0];

                    // Buscar datos del primer usuario para construir la tarea
                    const cached = getCachedUsers();
                    const primerUsuario = cached.find(u => String(u.id) === String(primerUserId));

                    if (!primerUsuario) {
                        mostrarNotificacion('No se encontraron datos del usuario seleccionado');
                        return;
                    }

                    // Temporalmente setear el usuario para que crearTarea funcione
                    setCurrentUser(primerUsuario);
                    // Los userIds se incluyen directamente en la tarea (no hay ruta /assign)
                    tareaCreada = await crearTarea(taskTitle, taskDesc, taskStatus, selectedIds);

                    // Limpiar selección del multi-select
                    Array.from(dom.usuariosAsignadosEl.options).forEach(o => o.selected = false);

                } else {
                    tareaCreada = await crearTarea(taskTitle, taskDesc, taskStatus);
                }

                if (dom.taskNameInput)  dom.taskNameInput.value  = '';
                if (dom.userTareaInput) dom.userTareaInput.value = '';
                if (dom.taskStatusInput) dom.taskStatusInput.value = 'pendiente';
                if (dom.usuariosAsignadosEl) {
                    Array.from(dom.usuariosAsignadosEl.options).forEach(o => o.selected = false);
                }
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
     * Filtra las tareas en el DOM según estado y/o usuario seleccionado.
     * Soporta combinación de ambos filtros simultáneamente.
     */
    export function filtrarTareas() {
        // Leer siempre del DOM en tiempo de ejecución, no de dom{}
        // porque filterField y filterUserEl se crean dinámicamente
        const estadoFiltro = document.getElementById('filterField')?.value?.toLowerCase() || '';
        const usuarioFiltro = document.getElementById('filterUser')?.value?.toLowerCase() || '';

        const cards = dom.tareasContainerEl?.querySelectorAll('.tarea-card');
        if (!cards) return;

        let tareasVisibles = 0;

        cards.forEach(card => {
            const statusEl = card.querySelector('.tarea-card__status');
            const usernameEl = card.querySelector('.tarea-card__username');

            const usuarioCard = usernameEl?.textContent?.toLowerCase() || '';
            const expectedClass = estadoFiltro.replace(' ', '-');

            const pasaEstado = !estadoFiltro || estadoFiltro === 'todas'
                || statusEl?.classList.contains(expectedClass);

            const pasaUsuario = !usuarioFiltro
                || usuarioCard.includes(usuarioFiltro);

            if (pasaEstado && pasaUsuario) {
                card.classList.remove('hidden');
                tareasVisibles++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (dom.tareaCountEl) {
            const total = cards.length;
            if ((!estadoFiltro || estadoFiltro === 'todas') && !usuarioFiltro) {
                updateTareaCount(total);
            } else {
                dom.tareaCountEl.textContent = `${tareasVisibles} de ${total} Tareas`;
            }
        }
    }


    /**
     * Ordena las tareas en el DOM de acuerdo al criterio seleccionado.
     */
    export function ordenarTareas() {
        // Leer siempre del DOM en tiempo de ejecución (elementos creados dinámicamente)
        const sortFieldEl = document.getElementById('sortField');
        const sortBtnEl   = document.getElementById('sortBtn');

        if (!dom.tareasContainerEl || !sortFieldEl || !sortBtnEl) return;

        // Obtenemos un array de los elementos "card" actuales
        const cards = Array.from(dom.tareasContainerEl.querySelectorAll('.tarea-card'));
        const criterio = sortFieldEl.value;

        // Alternar dirección visual y de memoria
        const currentDir = sortBtnEl.dataset.dir || 'desc';
        const newDir = currentDir === 'desc' ? 'asc' : 'desc';
        sortBtnEl.dataset.dir = newDir;

        // Actualizar el texto del botón según la dirección
        sortBtnEl.textContent = `Ordenar ${newDir === 'desc' ? '↓' : '↑'}`;

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

    export async function crearControlesFiltroyOrdenamiento() {
        const messagesHeader = document.querySelector('.messages-header');
        if (!messagesHeader) return;

        let actionsDiv = messagesHeader.querySelector('.messages-header__actions');
        if (!actionsDiv) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'messages-header__actions';
            messagesHeader.appendChild(actionsDiv);
        }

        actionsDiv.innerHTML = '';

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'messages-header__controls';

        // ── SELECT FILTRO POR ESTADO ──────────────────────────
        const filterSelect = document.createElement('select');
        filterSelect.id = 'filterField';
        filterSelect.className = 'messages-filter';
        filterSelect.title = 'Filtrar tareas por estado';

        [
            { value: '', text: 'Todos los estados' },
            { value: 'pendiente', text: 'Pendiente' },
            { value: 'en proceso', text: 'En proceso' },
            { value: 'completada', text: 'Completada' }
        ].forEach(({ value, text }) => {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = text;
            filterSelect.appendChild(opt);
        });

        // Listener registrado aquí, sobre el elemento real
        filterSelect.addEventListener('change', filtrarTareas);
        controlsDiv.appendChild(filterSelect);

        // ── SELECT FILTRO POR USUARIO (solo admin) ────────────
        const storedUser = sessionStorage.getItem('currentUser');
        const esAdmin = storedUser && JSON.parse(storedUser)?.rol === 'admin';

        if (esAdmin) {
            const filterUserSelect = document.createElement('select');
            filterUserSelect.id = 'filterUser';
            filterUserSelect.className = 'messages-filter';
            filterUserSelect.title = 'Filtrar tareas por usuario';

            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = 'Todos los usuarios';
            filterUserSelect.appendChild(defaultOpt);

            try {
                const usuarios = await cargarUsuarios();
                usuarios.forEach(u => {
                    const opt = document.createElement('option');
                    opt.value = u.nombre_completo.toLowerCase();
                    opt.textContent = u.nombre_completo;
                    filterUserSelect.appendChild(opt);
                });
            } catch (_) { /* queda solo con "Todos los usuarios" */ }

            // Listener registrado aquí, sobre el elemento real
            filterUserSelect.addEventListener('change', filtrarTareas);
            controlsDiv.appendChild(filterUserSelect);
        }

        // ── ORDENAMIENTO ──────────────────────────────────────
        const sortContainer = document.createElement('div');
        sortContainer.className = 'messages-sort-container';

        const sortSelect = document.createElement('select');
        sortSelect.id = 'sortField';
        sortSelect.className = 'messages-sort-select';
        sortSelect.title = 'Ordenar por criterio';

        [
            { value: 'fecha', text: 'Fecha' },
            { value: 'estado', text: 'Estado' },
            { value: 'nombre', text: 'Nombre' }
        ].forEach(({ value, text }) => {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = text;
            sortSelect.appendChild(opt);
        });

        // Listener registrado aquí, sobre el elemento real
        sortSelect.addEventListener('change', ordenarTareas);
        sortContainer.appendChild(sortSelect);

        const sortButton = document.createElement('button');
        sortButton.id = 'sortBtn';
        sortButton.type = 'button';
        sortButton.className = 'btn btn--sort';
        sortButton.title = 'Cambiar dirección de ordenamiento';
        sortButton.textContent = 'Ordenar ↓';
        sortButton.dataset.dir = 'desc';

        // Listener registrado aquí, sobre el elemento real
        sortButton.addEventListener('click', ordenarTareas);
        sortContainer.appendChild(sortButton);

        controlsDiv.appendChild(sortContainer);
        actionsDiv.appendChild(controlsDiv);
    }