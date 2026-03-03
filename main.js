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
    deshabilitarFormularioTareas,
    populateUserSuggestions,
    updateTareaCount,
    filtrarTareas
} from './ui/index.js';

// import Swal from 'sweetalert2'

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
    userIDError: document.getElementById('userIDError'),
    userNameError: document.getElementById('userNameError'),
    taskNameError: document.getElementById('taskNameError'),
    taskStatusError: document.getElementById('taskStatusError'),
    userTareaError: document.getElementById('userTareaError'),
    tareasContainerEl: document.getElementById('tareasContainer'),
    usersList: document.getElementById('usersList'),
    emptyStateEl: document.getElementById('emptyState'),
    tareaCountEl: document.getElementById('tareaCount'),
    filterStatusEl: document.getElementById('filterStatus')
};


// ==========================================================
// 3. REGISTRO DE EVENTOS
// ==========================================================

dom.tareaFormEl?.addEventListener('submit', handleFormSubmit);
dom.userIDInput?.addEventListener('input', handleInputChange);
dom.userNameInput?.addEventListener('input', handleInputChange);
dom.taskNameInput?.addEventListener('input', handleInputChange);
dom.userTareaInput?.addEventListener('input', handleInputChange);
dom.taskStatusInput?.addEventListener('change', handleInputChange);
dom.tareasContainerEl?.addEventListener('click', manejarClickCard);
dom.filterStatusEl?.addEventListener('change', filtrarTareas);

dom.userNameInput?.addEventListener('focus', () => {
    const idVal = dom.userIDInput?.value.replace(/\D+/g, '') || '';
    populateUserSuggestions(idVal);
});


// ==========================================================
// 4. INICIALIZACIÓN
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    init(dom);
    deshabilitarFormularioTareas();
    updateTareaCount(0);
    inicializarApp();
});
