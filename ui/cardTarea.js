/**
 * ==========================================================
 * UI – Card de Tarea
 * ==========================================================
 * Responsabilidad: crear y actualizar el elemento visual
 * (card) que representa una tarea en el DOM.
 * No realiza peticiones HTTP ni lógica de negocio.
 * ==========================================================
 */

import { getInitials, getCurrentTimestamp } from '../utils/index.js';

/**
 * Construye dinámicamente una tarjeta de tarea en el DOM.
 * Usa createElement (no innerHTML) para mayor seguridad.
 *
 * @param {string|number} tareaId
 * @param {string|number} userId
 * @param {string}        userName
 * @param {string}        taskTitle
 * @param {string}        taskDesc
 * @param {string}        status       - 'activa' | 'inactiva'
 * @param {string}        storedFecha
 * @param {string}        documento
 * @returns {HTMLElement}
 */
export function createCardTarea(tareaId, userId, userName, taskTitle, taskDesc, status, storedFecha, documento) {

    const card = document.createElement('div');
    card.className = 'tarea-card';
    card.dataset.id = tareaId;
    card.dataset.documento = documento || '';

    // ── Header: avatar + nombre + fecha ──────────────────
    const header = document.createElement('div');
    header.className = 'tarea-card__header';

    const userWrap = document.createElement('div');
    userWrap.className = 'tarea-card__user';

    const avatar = document.createElement('div');
    avatar.className = 'tarea-card__avatar';
    avatar.textContent = getInitials(userName);

    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'tarea-card__username';
    usernameSpan.textContent = userName;

    userWrap.appendChild(avatar);
    userWrap.appendChild(usernameSpan);

    const timestamp = document.createElement('span');
    timestamp.className = 'tarea-card__timestamp';
    timestamp.textContent = storedFecha || getCurrentTimestamp();

    header.appendChild(userWrap);
    header.appendChild(timestamp);

    // ── Contenido principal ───────────────────────────────
    const titleEl = document.createElement('div');
    titleEl.className = 'tarea-card__title';
    titleEl.textContent = taskTitle;

    const contentEl = document.createElement('div');
    contentEl.className = 'tarea-card__content';
    contentEl.textContent = taskDesc;

    const safeStatus = status || 'pendiente';
    const statusClass = safeStatus.replace(' ', '-').toLowerCase();
    const statusText = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1);

    // ── Badge de estado ───────────────────────────────────
    const statusEl = document.createElement('div');
    statusEl.className = `tarea-card__status ${statusClass}`;
    statusEl.textContent = statusText;

    // ── Botones de acción ─────────────────────────────────
    const botones = document.createElement('div');
    botones.className = 'tarea-card__botones';

    const eliminar = document.createElement('button');
    eliminar.type = 'button';
    eliminar.className = 'tarea-card__eliminar';
    eliminar.textContent = 'Eliminar';
    eliminar.dataset.action = 'delete';

    const editar = document.createElement('button');
    editar.type = 'button';
    editar.className = 'tarea-card__editar';
    editar.textContent = 'Editar';
    editar.dataset.action = 'edit';

    botones.appendChild(eliminar);
    botones.appendChild(editar);

    card.appendChild(header);
    card.appendChild(titleEl);
    card.appendChild(contentEl);
    card.appendChild(statusEl);
    card.appendChild(botones);

    return card;
}

/**
 * Actualiza visualmente una card en el DOM tras un PATCH exitoso.
 * @param {string|number} tareaId
 * @param {Object}        tarea  - { title, description, status }
 */
export function actualizarCardEnDOM(tareaId, tarea) {

    const card = document.querySelector(`.tarea-card[data-id="${tareaId}"]`);
    if (!card) return;

    const titleEl = card.querySelector('.tarea-card__title');
    if (titleEl) titleEl.textContent = tarea.title;

    const contentEl = card.querySelector('.tarea-card__content');
    if (contentEl) contentEl.textContent = tarea.description;

    const statusEl = card.querySelector('.tarea-card__status');
    if (statusEl) {
        const safeStatus = tarea.status || 'pendiente';
        const statusClass = safeStatus.replace(' ', '-').toLowerCase();
        const statusText = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1);
        statusEl.className = `tarea-card__status ${statusClass}`;
        statusEl.textContent = statusText;
    }

    // Feedback visual post-actualización
    card.style.transition = 'background-color 0.3s ease';
    card.style.backgroundColor = 'var(--color-primary-lighter)';
    setTimeout(() => { card.style.backgroundColor = ''; }, 1000);
}
