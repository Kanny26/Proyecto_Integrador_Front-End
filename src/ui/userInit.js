/**
 * ==========================================================
 * UI – Inicialización de la vista de usuario
 * ==========================================================
 * Responsabilidad:
 * - Mostrar el nombre del usuario en la navbar
 * - Manejar el cierre de sesión
 *
 * Se ejecuta como módulo independiente en user_tasks.html.
 * ==========================================================
 */

// ── Navbar: mostrar nombre del usuario ───────────────────
const stored = sessionStorage.getItem('userName');
const navUserName = document.getElementById('navUserName');
if (stored && navUserName) navUserName.textContent = `👤 ${stored}`;

// ── Cerrar sesión ─────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '../index.html';
});
