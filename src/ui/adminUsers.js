/**
 * ==========================================================
 * UI – Página de administración de usuarios (admin_users.html)
 * ==========================================================
 */

import {
    cargarUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario
} from '../services/index.js';

import { alertDeleteConfirm, mostrarNotificacion } from './notificaciones.js';


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

async function iniciarPaginaAdminUsuarios() {
    try {
        const usuarios = await cargarUsuarios();
        renderTablaUsuarios(usuarios);
    } catch (error) {
        mostrarNotificacion('Error al cargar usuarios: ' + error.message);
    }

    document.getElementById('newUserBtn')
        ?.addEventListener('click', abrirModalNuevoUsuario);

    document.getElementById('usersTableBody')
        ?.addEventListener('click', manejarClickTabla);
}


// ==========================================================
// RENDER
// ==========================================================

function renderTablaUsuarios(usuarios) {
    const tbody    = document.getElementById('usersTableBody');
    const userCount = document.getElementById('userCount');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (userCount) {
        userCount.textContent = `${usuarios.length} Usuario${usuarios.length !== 1 ? 's' : ''}`;
    }

    if (usuarios.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.style.textAlign = 'center';
        td.textContent = 'No hay usuarios registrados';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.dataset.id = usuario.id;

        const estadoTexto = usuario.activo ? 'Activo'      : 'Inactivo';
        const estadoClass = usuario.activo ? 'estado--activo' : 'estado--inactivo';
        const toggleText  = usuario.activo ? 'Desactivar'  : 'Activar';

        const td1 = document.createElement('td');
        td1.textContent = usuario.documento;

        const td2 = document.createElement('td');
        td2.textContent = usuario.nombre_completo;

        const td3 = document.createElement('td');
        td3.textContent = usuario.rol || '-';

        const td4 = document.createElement('td');
        const badge = document.createElement('span');
        badge.className   = estadoClass;
        badge.textContent = estadoTexto;
        td4.appendChild(badge);

        const td5 = document.createElement('td');
        td5.className = 'users-table__actions';

        const btnEdit = document.createElement('button');
        btnEdit.type = 'button';
        btnEdit.className = 'btn btn--secondary btn--sm';
        btnEdit.textContent = 'Editar';
        btnEdit.dataset.action = 'edit';
        btnEdit.dataset.id = usuario.id;

        const btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.className = 'btn btn--danger btn--sm';
        btnDelete.textContent = 'Eliminar';
        btnDelete.dataset.action = 'delete';
        btnDelete.dataset.id = usuario.id;

        const btnToggle = document.createElement('button');
        btnToggle.type = 'button';
        btnToggle.className = 'btn btn--sm';
        btnToggle.textContent = toggleText;
        btnToggle.dataset.action = 'toggle';
        btnToggle.dataset.id = usuario.id;
        btnToggle.dataset.activo = String(usuario.activo);

        td5.appendChild(btnEdit);
        td5.appendChild(btnDelete);
        td5.appendChild(btnToggle);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        tbody.appendChild(tr);
    });
}


// ==========================================================
// DELEGACIÓN DE EVENTOS
// ==========================================================

async function manejarClickTabla(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const id     = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'edit') {
        const tr = btn.closest('tr');
        const usuario = {
            id,
            documento:       tr.cells[0].textContent,
            nombre_completo: tr.cells[1].textContent,
            rol: tr.cells[2].textContent === '-' ? '' : tr.cells[2].textContent
        };
        await abrirModalEditarUsuario(usuario);
    }

    if (action === 'delete') {
        await confirmarEliminarUsuario(id);
    }

    if (action === 'toggle') {
        const activo = btn.dataset.activo === 'true';
        await toggleEstadoUsuario(id, activo);
    }
}


// ==========================================================
// MODALES (SweetAlert2)
// ==========================================================

async function abrirModalNuevoUsuario() {
    const { value: datos } = await Swal.fire({
        title: 'Nuevo Usuario',
        html: `
            <input id="swal-documento"  class="swal2-input" placeholder="Número de documento">
            <input id="swal-nombre"     class="swal2-input" placeholder="Nombre completo">
            <select id="swal-rol" class="swal2-select"
                    style="width:80%;margin:0.5em auto;display:block;padding:0.5em">
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const documento       = document.getElementById('swal-documento').value.trim();
            const nombre_completo = document.getElementById('swal-nombre').value.trim();
            const rol             = document.getElementById('swal-rol').value;
            if (!documento || !nombre_completo) {
                Swal.showValidationMessage('El documento y el nombre son obligatorios');
                return false;
            }
            return { documento, nombre_completo, rol, activo: true };
        }
    });

    if (!datos) return;

    try {
        await crearUsuario(datos);
        mostrarNotificacion('Usuario creado correctamente');
        const usuarios = await cargarUsuarios();
        renderTablaUsuarios(usuarios);
    } catch (error) {
        mostrarNotificacion('Error al crear el usuario: ' + error.message);
    }
}

async function abrirModalEditarUsuario(usuario) {
    const { value: datos } = await Swal.fire({
        title: 'Editar Usuario',
        html: `
            <input id="swal-documento"  class="swal2-input" placeholder="Número de documento"
                   value="${usuario.documento}">
            <input id="swal-nombre"     class="swal2-input" placeholder="Nombre completo"
                   value="${usuario.nombre_completo}">
            <select id="swal-rol" class="swal2-select"
                    style="width:80%;margin:0.5em auto;display:block;padding:0.5em">
                <option value="user" ${!usuario.rol || usuario.rol === 'user' ? 'selected' : ''}>Usuario</option>
                <option value="admin"   ${usuario.rol === 'admin' ? 'selected' : ''}>Administrador</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const documento       = document.getElementById('swal-documento').value.trim();
            const nombre_completo = document.getElementById('swal-nombre').value.trim();
            const rol             = document.getElementById('swal-rol').value;
            if (!documento || !nombre_completo) {
                Swal.showValidationMessage('El documento y el nombre son obligatorios');
                return false;
            }
            return { documento, nombre_completo, rol };
        }
    });

    if (!datos) return;

    try {
        await editarUsuario(usuario.id, datos);
        mostrarNotificacion('Usuario actualizado correctamente');
        const usuarios = await cargarUsuarios();
        renderTablaUsuarios(usuarios);
    } catch (error) {
        mostrarNotificacion('Error al actualizar el usuario: ' + error.message);
    }
}

async function confirmarEliminarUsuario(id) {
    const confirmar = await alertDeleteConfirm();
    if (!confirmar) return;

    try {
        await eliminarUsuario(id);
        mostrarNotificacion('Usuario eliminado correctamente');
        const usuarios = await cargarUsuarios();
        renderTablaUsuarios(usuarios);
    } catch (error) {
        mostrarNotificacion('Error al eliminar el usuario: ' + error.message);
    }
}

async function toggleEstadoUsuario(id, estadoActual) {
    try {
        await cambiarEstadoUsuario(id, estadoActual);
        const nuevoEstado = estadoActual ? 'desactivado' : 'activado';
        mostrarNotificacion(`Usuario ${nuevoEstado} correctamente`);
        const usuarios = await cargarUsuarios();
        renderTablaUsuarios(usuarios);
    } catch (error) {
        mostrarNotificacion('Error al cambiar estado: ' + error.message);
    }
}


// ==========================================================
// INICIAR AL CARGAR LA PÁGINA
// ==========================================================

document.addEventListener('DOMContentLoaded', iniciarPaginaAdminUsuarios);
