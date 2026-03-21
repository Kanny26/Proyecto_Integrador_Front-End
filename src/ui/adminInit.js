/**
 * ==========================================================
 * UI – Inicialización del panel de administración
 * ==========================================================
 * Responsabilidad:
 * - Mostrar el nombre del usuario en la navbar
 * - Manejar el cierre de sesión
 * - Controlar la navegación por pestañas
 * - Sincronizar los checkboxes de usuarios con el select oculto
 *
 * Se ejecuta como módulo independiente en form_admin_task.html.
 * No depende de main.js ni de adminUsers.js.
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

// ── Pestañas ──────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`panel-${btn.dataset.tab}`)?.classList.add('active');
    });
});

// ── Sincronizar checkboxes → select oculto ────────────────
document.getElementById('usuariosCheckboxList')
    ?.addEventListener('change', () => {
        const select = document.getElementById('usuariosAsignados');
        if (!select) return;

        Array.from(select.options).forEach(opt => {
            const cb = document.querySelector(
                `#usuariosCheckboxList input[value="${opt.value}"]`
            );
            opt.selected = cb ? cb.checked : false;
        });

        // Limpiar error inline si hay al menos un usuario seleccionado
        const haySeleccionados = Array.from(select.options).some(o => o.selected);
        const errorEl = document.getElementById('usuariosAsignadosError');
        if (errorEl && haySeleccionados) errorEl.textContent = '';
    });
