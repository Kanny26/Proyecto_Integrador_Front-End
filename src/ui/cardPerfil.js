/**
 * ==========================================================
 * UI – Card de Perfil de Usuario
 * ==========================================================
 * Responsabilidad: crear el elemento visual que muestra
 * los datos del usuario autenticado con botón de cerrar sesión.
 * No realiza peticiones HTTP ni lógica de negocio.
 * ==========================================================
 */

import { getInitials } from '../utils/index.js';

/**
 * Construye dinámicamente la card de perfil del usuario.
 *
 * @param {string}   userName  - Nombre completo del usuario
 * @param {Function} onLogout  - Callback que se ejecuta al hacer click en "Cerrar Sesión"
 * @returns {HTMLElement}
 */
export function createCardPerfil(userName, onLogout) {

    const card = document.createElement('div');
    card.className = 'perfil-card';

    // ── Avatar ────────────────────────────────────────────
    const safeName = userName || 'Usuario';

    const avatar = document.createElement('div');
    avatar.className = 'perfil-card__avatar';
    avatar.textContent = getInitials(safeName);

    // ── Nombre del usuario ────────────────────────────────
    const nameSpan = document.createElement('span');
    nameSpan.className = 'perfil-card__username';
    nameSpan.textContent = safeName;

    // ── Wrap izquierdo: avatar + nombre ───────────────────
    const userWrap = document.createElement('div');
    userWrap.className = 'perfil-card__user';
    userWrap.appendChild(avatar);
    userWrap.appendChild(nameSpan);

    // ── Botón cerrar sesión ───────────────────────────────
    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'btn perfil-card__logout';
    logoutBtn.textContent = 'Cerrar Sesión';
    logoutBtn.addEventListener('click', () => {
        if (typeof onLogout === 'function') onLogout();
    });

    card.appendChild(userWrap);
    card.appendChild(logoutBtn);

    return card;
}
