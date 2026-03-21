/**
 * ==========================================================
 * MAIN.JS – Punto de entrada de la aplicación
 * ==========================================================
 *
 * Este archivo contiene ÚNICAMENTE:
 * 1. Importaciones de módulos
 * 2. Selección de elementos del DOM
 * 3. Registro de eventos (addEventListener)
 * 4. Llamada de inicialización (DOMContentLoaded)
 * ==========================================================
 */


// ==========================================================
// 1. IMPORTACIONES
// ==========================================================

import {
    init,
    inicializarApp,
    handleFormSubmit,
    handleInputChange,
    manejarClickCard,
    handleExportTasks,
    deshabilitarFormularioTareas,
    populateUserSuggestions,
    populateDocSuggestions,
    updateTareaCount,
    filtrarTareas,
    ordenarTareas,
    crearControlesFiltroyOrdenamiento,
    createCardPerfil
} from './ui/index.js';

import {
    buscarUsuario,
    setCurrentUser,
    cargarUsuarios
} from './services/index.js';


// ==========================================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================================

const dom = {
    tareaFormEl:           document.getElementById('tareaForm'),
    userIDInput:           document.getElementById('userID'),
    userNameInput:         document.getElementById('userName'),
    taskNameInput:         document.getElementById('taskName'),
    userTareaInput:        document.getElementById('userTarea'),
    taskStatusInput:       document.getElementById('taskStatus'),
    submitBtnEl:           document.getElementById('submitBtn'),
    exportBtnEl:           document.getElementById('exportBtn'),
    userIDError:           document.getElementById('userIDError'),
    userNameError:         document.getElementById('userNameError'),
    taskNameError:         document.getElementById('taskNameError'),
    taskStatusError:       document.getElementById('taskStatusError'),
    userTareaError:        document.getElementById('userTareaError'),
    tareasContainerEl:     document.getElementById('tareasContainer'),
    usersList:             document.getElementById('usersList'),
    emptyStateEl:          document.getElementById('emptyState'),
    filterField:           document.getElementById('filterField'),
    filterUserEl:          document.getElementById('filterUser'),
    sortFieldEl:           document.getElementById('sortField'),
    sortBtnEl:             document.getElementById('sortBtn'),
    docsList:              document.getElementById('docsList'),
    tareaCountEl:          document.getElementById('tareaCount'),
    usuariosAsignadosEl:   document.getElementById('usuariosAsignados')
};


// ==========================================================
// 3. REGISTRO DE EVENTOS
// ==========================================================

dom.tareaFormEl?.addEventListener('submit', handleFormSubmit);
dom.userIDInput?.addEventListener('input', handleInputChange);
dom.userIDInput?.addEventListener('focus', populateDocSuggestions);
dom.userNameInput?.addEventListener('input', handleInputChange);
dom.taskNameInput?.addEventListener('input', handleInputChange);
dom.userTareaInput?.addEventListener('input', handleInputChange);
dom.taskStatusInput?.addEventListener('change', handleInputChange);
dom.tareasContainerEl?.addEventListener('click', manejarClickCard);
dom.exportBtnEl?.addEventListener('click', handleExportTasks);

dom.userNameInput?.addEventListener('focus', () => {
    const idVal = dom.userIDInput?.value.replace(/\D+/g, '') || '';
    populateUserSuggestions(idVal);
});


// ==========================================================
// LOGIN (index.html)
// ==========================================================

const loginFormEl  = document.getElementById('loginForm');
const loginIDInput = document.getElementById('loginID');
const loginIDError = document.getElementById('loginIDError');

loginFormEl?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const documento = loginIDInput?.value.trim() ?? '';

    if (!documento) {
        if (loginIDError) loginIDError.textContent = 'Ingrese su número de documento';
        return;
    }

    try {
        const usuario = await buscarUsuario(documento);

        if (!usuario) {
            if (loginIDError) loginIDError.textContent = 'Usuario no encontrado';
            return;
        }

        sessionStorage.setItem('userName',     usuario.nombre_completo);
        sessionStorage.setItem('currentUser',  JSON.stringify(usuario));

        if (usuario.rol === 'admin') {
            window.location.href = 'html/form_admin_task.html';
        } else {
            window.location.href = 'html/user_tasks.html';
        }

    } catch (err) {
        if (loginIDError) loginIDError.textContent = err.message;
    }
});


// ==========================================================
// 4. INICIALIZACIÓN
// ==========================================================

document.addEventListener('DOMContentLoaded', async () => {

    // Restaurar usuario de sesión en páginas post-login
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        try { setCurrentUser(JSON.parse(storedUser)); } catch (_) {}
    }

    await crearControlesFiltroyOrdenamiento();
    // Los listeners de filterField, filterUser, sortField y sortBtn
    // se registran dentro de crearControlesFiltroyOrdenamiento()
    // sobre los elementos reales, evitando el problema de referencias null.

    // ── Card de perfil ────────────────────────────────────
    const perfilContainer = document.getElementById('perfilContainer');
    if (perfilContainer) {
        const userName = sessionStorage.getItem('userName') || 'Usuario';
        const cardPerfil = createCardPerfil(userName, () => {
            sessionStorage.clear();
            window.location.href = '../index.html';
        });
        perfilContainer.appendChild(cardPerfil);
    }

    // ── Poblar checkboxes y select oculto de usuarios (form_admin_task.html) ──
    const checkboxList = document.getElementById('usuariosCheckboxList');
    if (dom.usuariosAsignadosEl && checkboxList) {
        try {
            const usuarios = await cargarUsuarios();
            usuarios.forEach(u => {
                // Agregar opción al select oculto
                const opt = document.createElement('option');
                opt.value = u.id;
                dom.usuariosAsignadosEl.appendChild(opt);

                // Crear checkbox visible
                const item = document.createElement('div');
                item.className = 'usuario-checkbox-item';

                const cb = document.createElement('input');
                cb.type  = 'checkbox';
                cb.id    = `user-cb-${u.id}`;
                cb.value = u.id;

                const lbl = document.createElement('label');
                lbl.htmlFor     = `user-cb-${u.id}`;
                lbl.textContent = `${u.nombre_completo} (${u.documento})`;

                item.appendChild(cb);
                item.appendChild(lbl);
                checkboxList.appendChild(item);
            });
        } catch (err) {
            console.error('Error al cargar usuarios para los checkboxes:', err);
        }
    }
    init(dom);
        deshabilitarFormularioTareas();
        updateTareaCount(0);
        if (dom.tareasContainerEl) {
            inicializarApp();
        }
});