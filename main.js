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


// ==========================================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================================

const dom = {
    tareaFormEl: document.getElementById('tareaForm'),
    userIDInput: document.getElementById('userID'),
    userNameInput: document.getElementById('userName'),
    taskNameInput: document.getElementById('taskName'),
    userTareaInput: document.getElementById('userTarea'),
    taskStatusInput: document.getElementById('taskStatus'),
    submitBtnEl: document.getElementById('submitBtn'),
    exportBtnEl: document.getElementById('exportBtn'),
    userIDError: document.getElementById('userIDError'),
    userNameError: document.getElementById('userNameError'),
    taskNameError: document.getElementById('taskNameError'),
    taskStatusError: document.getElementById('taskStatusError'),
    userTareaError: document.getElementById('userTareaError'),
    tareasContainerEl: document.getElementById('tareasContainer'),
    usersList: document.getElementById('usersList'),
    emptyStateEl: document.getElementById('emptyState'),
    filterField: document.getElementById('filterField'),
    sortFieldEl: document.getElementById('sortField'),
    sortBtnEl: document.getElementById('sortBtn'),
    docsList: document.getElementById('docsList'),
    tareaCountEl: document.getElementById('tareaCount')
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
dom.filterField?.addEventListener('change', filtrarTareas);
dom.sortFieldEl?.addEventListener('change', ordenarTareas);
dom.sortBtnEl?.addEventListener('click', ordenarTareas);

dom.userNameInput?.addEventListener('focus', () => {
    const idVal = dom.userIDInput?.value.replace(/\D+/g, '') || '';
    populateUserSuggestions(idVal);
});


// ==========================================================
// 4. INICIALIZACIÓN
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    crearControlesFiltroyOrdenamiento();
    dom.filterField = document.getElementById('filterField');
    dom.sortFieldEl = document.getElementById('sortField');
    dom.sortBtnEl = document.getElementById('sortBtn');

    dom.filterField?.addEventListener('change', filtrarTareas);
    dom.sortFieldEl?.addEventListener('change', ordenarTareas);
    dom.sortBtnEl?.addEventListener('click', ordenarTareas);
    
    
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

    init(dom);
    deshabilitarFormularioTareas();
    updateTareaCount(0);
    inicializarApp();

});
