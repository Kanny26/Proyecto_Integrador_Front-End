/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
 * 
 * Objetivo: Aplicar conceptos del DOM para seleccionar elementos,
 * responder a eventos y crear nuevos elementos dinámicamente.
 * 
 * Autor: [Tu nombre aquí]
 * Fecha: [Fecha actual]
 * ============================================
 */

// ============================================
// CONFIGURACIÓN DE API LOCAL
// ============================================
const API_BASE_URL = 'http://localhost:3000';

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
 */

// Formulario
const messageFormEl = document.getElementById('messageForm');

// Campos de entrada
const userIDInput = document.getElementById('userID');
const userNameInput = document.getElementById('userName');
const taskNameInput = document.getElementById('taskName');
const taskStatusInput = document.getElementById('taskStatus');
const userTareaInput = document.getElementById('userTarea');

// Elementos para mostrar errores
const userIDError = document.getElementById('userIDError');
const userNameError = document.getElementById('userNameError');
const taskNameError = document.getElementById('taskNameError');
const taskStatusError = document.getElementById('taskStatusError');
const userTareaError = document.getElementById('userTareaError');

// Contenedor donde se mostrarán los mensajes
const messagesContainerEl = document.getElementById('messagesContainer');

// Estado vacío (mensaje que se muestra cuando no hay mensajes)
const emptyStateEl = document.getElementById('emptyState');

// Contador de mensajes
const messageCountEl = document.getElementById('messageCount');

// Variable para almacenar el usuario actual
let currentUser = null;

// Variable para llevar el conteo de mensajes
let totalMessagesCount = 0;


// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

/**
 * Valida que un campo no esté vacío ni contenga solo espacios en blanco
 * @param {string} value - El valor a validar
 * @returns {boolean} - true si es válido, false si no lo es
 */
function isValidInput(value) {
    return String(value).trim().length > 0;
}

/**
 * Muestra un mensaje de error en un elemento específico
 * @param {HTMLElement} errorElement - Elemento donde mostrar el error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(errorElement, message) {
    if (!errorElement) return;
    errorElement.textContent = message;
}

/**
 * Limpia el mensaje de error de un elemento específico
 * @param {HTMLElement} errorElement - Elemento del que limpiar el error
 */
function clearError(errorElement) {
    if (!errorElement) return;
    errorElement.textContent = '';
}

/**
 * Obtiene la fecha y hora actual formateada
 * @returns {string} - Fecha y hora en formato legible
 */
function getCurrentTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('es-ES', options);
}

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} - Iniciales en mayúsculas
 */
function getInitials(name) {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

/**
 * Actualiza el contador de mensajes
 */
function updateMessageCount() {
    if (!messageCountEl) return;
    messageCountEl.textContent = `${totalMessagesCount} Tarea${totalMessagesCount !== 1 ? 's' : ''}`;
}

/**
 * Oculta el estado vacío (mensaje cuando no hay mensajes)
 */
function hideEmptyState() {
    if (!emptyStateEl) return;
    emptyStateEl.classList.add('hidden');
}

/**
 * Muestra el estado vacío (mensaje cuando no hay mensajes)
 */
function showEmptyState() {
    if (!emptyStateEl) return;
    emptyStateEl.classList.remove('hidden');
}


// ============================================
// 3. FUNCIONES DE API - BASE DE DATOS LOCAL
// ============================================

/**
 * CRITERIO 7: Consulta correctamente el usuario en la API indicada
 * Busca usuario por número de documento en la base de datos local
 */
async function buscarUsuarioPorDocumento(documento) {
    try {
        console.log('Buscando usuario con documento:', documento);

        // ✅ Traemos todos los usuarios y filtramos localmente
        const response = await fetch(`${API_BASE_URL}/usuarios`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const usuarios = await response.json();
        console.log('Todos los usuarios:', usuarios);

        // Comparamos como string en ambos lados para evitar problemas de tipo
        const usuario = usuarios.find(u => String(u.documento) === String(documento));

        if (usuario) {
            console.log('Usuario encontrado:', usuario);
            return usuario;
        }

        console.log('Usuario no encontrado');
        return null;

    } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw error;
    }
}

/**
 * CRITERIO 21: Consume correctamente la API local
 * CRITERIO 22: Gestiona adecuadamente la información recibida del servidor
 * Registra una nueva tarea en la base de datos local
 */
async function asignar_tarea(tarea) {
    try {
        console.log('Enviando tarea a la API:', tarea);
        
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarea)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const tareaRegistrada = await response.json();
        console.log('Tarea registrada en la API:', tareaRegistrada);
        return tareaRegistrada;
    } catch (error) {
        console.error('Error al registrar tarea:', error);
        throw error;
    }
}


// ============================================
// 4. GESTIÓN DE USUARIOS
// ============================================

/**
 * CRITERIO 8: Muestra los datos del usuario encontrado en la interfaz
 * CRITERIO 10: Utiliza el DOM para mostrar u ocultar información del usuario
 */
function mostrarDatosUsuario(usuario) {
    if (userNameInput) {
        userNameInput.value = usuario.nombre_completo;
        userNameInput.disabled = true; // Bloquear edición
    }
    
    currentUser = usuario;
    habilitarFormularioTareas();
    
    console.log('Datos del usuario mostrados:', usuario.nombre_completo);
}

/**
 * CRITERIO 10: Utiliza el DOM para mostrar u ocultar información del usuario
 */
function limpiarDatosUsuario() {
    if (userNameInput) {
        userNameInput.value = '';
        userNameInput.disabled = false;
    }
    currentUser = null;
    deshabilitarFormularioTareas();
}

/**
 * CRITERIO 11: Habilita el formulario de tareas solo cuando el usuario existe
 */
function habilitarFormularioTareas() {
    if (taskNameInput) taskNameInput.disabled = false;
    if (taskStatusInput) taskStatusInput.disabled = false;
    if (userTareaInput) userTareaInput.disabled = false;
    
    console.log('Formulario de tareas habilitado');
}

/**
 * Deshabilita y limpia el formulario de tareas
 */
function deshabilitarFormularioTareas() {
    if (taskNameInput) {
        taskNameInput.disabled = true;
        taskNameInput.value = '';
    }
    if (taskStatusInput) {
        taskStatusInput.disabled = true;
        taskStatusInput.value = 'activa';
    }
    if (userTareaInput) {
        userTareaInput.disabled = true;
        userTareaInput.value = '';
    }
}

/**
 * CRITERIO 6: Captura el evento del formulario sin recargar la página
 * CRITERIO 7: Consulta correctamente el usuario en la API indicada
 * CRITERIO 9: Presenta un mensaje claro cuando el usuario no existe
 */
async function buscar_mostrar_usuario(documento) {
    try {
        clearError(userIDError);
        clearError(userNameError);
        
        const usuario = await buscarUsuarioPorDocumento(documento);
        
        if (usuario) {
            // CRITERIO 8: Muestra los datos del usuario encontrado
            mostrarDatosUsuario(usuario);
            return true;
        } else {
            // CRITERIO 9: Presenta un mensaje claro cuando el usuario no existe
            limpiarDatosUsuario();
            showError(userIDError, 'Usuario no encontrado en el sistema');
            userIDInput.classList.add('error');
            return false;
        }
    } catch (error) {
        console.error('Error en búsqueda:', error);
        showError(userIDError, 'Error al conectar con el servidor. Verifica que json-server esté corriendo.');
        return false;
    }
}


// ============================================
// 5. VALIDACIÓN DEL FORMULARIO
// ============================================

/**
 * Valida todos los campos del formulario
 * CRITERIO 12: Valida que todos los campos del formulario estén diligenciados
 * @returns {boolean} - true si todos los campos son válidos, false si alguno no lo es
 */
function validateForm() {
    let isValid = true;
    
    const idVal = userIDInput ? userIDInput.value.trim() : '';
    const nameVal = userNameInput ? userNameInput.value.trim() : '';
    const taskTitleVal = taskNameInput ? taskNameInput.value.trim() : '';
    const taskStatusVal = taskStatusInput ? taskStatusInput.value : '';
    const taskDescVal = userTareaInput ? userTareaInput.value.trim() : '';
    
    // Limpiar errores previos
    clearError(userIDError);
    clearError(userNameError);
    clearError(taskNameError);
    clearError(taskStatusError);
    clearError(userTareaError);
    
    userIDInput && userIDInput.classList.remove('error');
    userNameInput && userNameInput.classList.remove('error');
    taskNameInput && taskNameInput.classList.remove('error');
    taskStatusInput && taskStatusInput.classList.remove('error');
    userTareaInput && userTareaInput.classList.remove('error');
    
    // Validar ID
    if (!isValidInput(idVal)) {
        showError(userIDError, 'Número de documento requerido');
        userIDInput.classList.add('error');
        isValid = false;
    } else if (!/^\d+$/.test(idVal)) {
        showError(userIDError, 'El documento debe contener solo números');
        userIDInput.classList.add('error');
        isValid = false;
    }
    
    // Validar que existe usuario consultado
    if (!currentUser) {
        showError(userIDError, 'Debe buscar un usuario válido primero');
        userIDInput.classList.add('error');
        isValid = false;
    }
    
    // Validar nombre
    if (!isValidInput(nameVal)) {
        showError(userNameError, 'Nombre de usuario requerido');
        userNameInput.classList.add('error');
        isValid = false;
    }
    
    // Validar título de tarea
    if (!isValidInput(taskTitleVal)) {
        showError(taskNameError, 'Nombre de la tarea requerido');
        taskNameInput.classList.add('error');
        isValid = false;
    }
    
    // Validar estado
    if (!['activa', 'inactiva'].includes(taskStatusVal)) {
        showError(taskStatusError, 'Estado inválido');
        taskStatusInput.classList.add('error');
        isValid = false;
    }
    
    // Validar descripción
    if (!isValidInput(taskDescVal)) {
        showError(userTareaError, 'Descripción de la tarea requerida');
        userTareaInput.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}


// ============================================
// 6. CREACIÓN DE ELEMENTOS
// ============================================

/**
 * Crea un nuevo elemento de mensaje en el DOM
 * CRITERIO 16: Crea dinámicamente filas o elementos para la tabla de tareas
 * CRITERIO 17: Inserta las tareas en el lugar correcto del DOM
 * CRITERIO 18: Muestra las tareas registradas una debajo de la otra
 * @param {string} userID - ID del usuario
 * @param {string} userName - Nombre del usuario
 * @param {string} taskTitle - Título de la tarea
 * @param {string} taskDesc - Descripción de la tarea
 * @param {string} status - Estado de la tarea (activa/inactiva)
 */
function createMessageElement(userID, userName, taskTitle, taskDesc, status) {
    const card = document.createElement('div');
    card.className = 'message-card';
    
    const header = document.createElement('div');
    header.className = 'message-card__header';
    
    const userWrap = document.createElement('div');
    userWrap.className = 'message-card__user';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-card__avatar';
    avatar.textContent = getInitials(userName);
    
    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'message-card__username';
    usernameSpan.textContent = userName;
    
    userWrap.appendChild(avatar);
    userWrap.appendChild(usernameSpan);
    
    const timestamp = document.createElement('span');
    timestamp.className = 'message-card__timestamp';
    timestamp.textContent = getCurrentTimestamp();
    
    header.appendChild(userWrap);
    header.appendChild(timestamp);
    
    const titleEl = document.createElement('div');
    titleEl.className = 'message-card__title';
    titleEl.textContent = taskTitle;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-card__content';
    contentEl.textContent = taskDesc;
    
    const statusEl = document.createElement('div');
    statusEl.className = 'message-card__status ' + (status === 'activa' ? 'activa' : 'inactiva');
    statusEl.textContent = status === 'activa' ? 'Activa' : 'Inactiva';
    
    card.appendChild(header);
    card.appendChild(titleEl);
    card.appendChild(contentEl);
    card.appendChild(statusEl);
    
    return card;
}


// ============================================
// 7. MANEJO DE EVENTOS
// ============================================

/**
 * Limpia los errores cuando el usuario empieza a escribir
 */
function handleInputChange(e) {
    const target = e.target;
    if (!target) return;

    if (target === userIDInput) {
        const cleaned = target.value.replace(/\D+/g, '');
        if (target.value !== cleaned) target.value = cleaned;
        clearError(userIDError);
        target.classList.remove('error');

        if (currentUser) {
            limpiarDatosUsuario();
        }
    }

    if (target === userNameInput) {
        clearError(userNameError);
        target.classList.remove('error');
    }
    
    if (target === taskNameInput) {
        clearError(taskNameError);
        target.classList.remove('error');
    }
    
    if (target === taskStatusInput) {
        clearError(taskStatusError);
        target.classList.remove('error');
    }
    
    if (target === userTareaInput) {
        clearError(userTareaError);
        target.classList.remove('error');
    }
}

/**
 * Maneja el evento de envío del formulario
 * CRITERIO 6: Captura el evento del formulario sin recargar la página
 * CRITERIO 13: Controla el envío del formulario mediante eventos
 * CRITERIO 15: Registra más de una tarea sin recargar la página
 * CRITERIO 20: No utiliza recarga de página para actualizar la información
 * @param {Event} event - Evento del formulario
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Formulario enviado');

    const userID = userIDInput.value.trim();

    // Si no hay usuario cargado, buscar primero
    if (!currentUser) {
        if (!userID) {
            showError(userIDError, 'Ingrese un número de documento');
            return;
        }
        console.log('Buscando usuario...');
        const usuarioEncontrado = await buscar_mostrar_usuario(userID);
        if (!usuarioEncontrado) return;

        // Ya no hace return aquí, el usuario puede seguir llenando el form
        console.log('Usuario encontrado. Complete los campos de tarea y envíe de nuevo.');
        return; // Solo en la primera búsqueda sí retornamos para que llene los campos
    }

    // Verificar que el documento actual coincide con el usuario cargado
    if (String(currentUser.documento) !== String(userID)) {
        showError(userIDError, 'El documento no coincide con el usuario cargado');
        limpiarDatosUsuario();
        return;
    }

    // Validar todos los campos
    if (!validateForm()) {
        console.log('Validación fallida');
        return;
    }

    const taskTitle = taskNameInput.value.trim();
    const taskDesc = userTareaInput.value.trim();
    const taskStatus = taskStatusInput.value;

    const asignarTarea = {
        userId: currentUser.id,
        documento: currentUser.documento,
        nombre_completo: currentUser.nombre_completo,
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        fecha: getCurrentTimestamp()
    };

    try {
        const tareaAsignada = await asignar_tarea(asignarTarea);
        console.log('Tarea asignada exitosamente:', tareaAsignada);

        const card = createMessageElement(
            currentUser.id,
            currentUser.nombre_completo,
            taskTitle,
            taskDesc,
            taskStatus
        );

        messagesContainerEl.insertBefore(card, messagesContainerEl.firstChild);
        totalMessagesCount++;
        updateMessageCount();
        hideEmptyState();

        // Limpiar solo campos de tarea, mantener usuario
        taskNameInput.value = '';
        userTareaInput.value = '';
        taskStatusInput.value = 'activa';

        console.log('Tarea asignada. Total:', totalMessagesCount);

    } catch (error) {
        console.error('Error al asignar tarea:', error);
        alert('Error al asignar la tarea. Verifica que json-server esté corriendo.');
    }
}


// ============================================
// 8. REGISTRO DE EVENTOS
// ============================================

/**
 * Aquí registramos todos los event listeners
 */
if (messageFormEl) messageFormEl.addEventListener('submit', handleFormSubmit);
if (userIDInput) userIDInput.addEventListener('input', handleInputChange);
if (userNameInput) userNameInput.addEventListener('input', handleInputChange);
if (taskNameInput) taskNameInput.addEventListener('input', handleInputChange);
if (userTareaInput) userTareaInput.addEventListener('input', handleInputChange);
if (taskStatusInput) taskStatusInput.addEventListener('change', handleInputChange);


// ============================================
// 9. INICIALIZACIÓN
// ============================================

// Deshabilitar campos de tarea al inicio (CRITERIO 11)
deshabilitarFormularioTareas();
updateMessageCount();

/**
 * Esta función se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado');
    console.log('Sistema de Gestión de Tareas iniciado');
    console.log('API Base URL:', API_BASE_URL);
    console.log('Asegúrate de que json-server esté corriendo en el puerto 3000');
    
    // CRITERIO 11: Formulario de tareas deshabilitado al inicio
    deshabilitarFormularioTareas();
});


// ============================================
// 10. REFLEXIÓN Y DOCUMENTACIÓN
// ============================================

/**
 * PREGUNTAS DE REFLEXIÓN:
 * 
 * 1. ¿Qué elemento del DOM estás seleccionando?
 *    R: Seleccionamos el formulario, los campos de entrada (documento, nombre, título,
 *       descripción, estado), los elementos de error y el contenedor de mensajes
 * 
 * 2. ¿Qué evento provoca el cambio en la página?
 *    R: El evento 'submit' del formulario, que se captura con preventDefault()
 *       para evitar la recarga de la página
 * 
 * 3. ¿Qué nuevo elemento se crea?
 *    R: Se crea dinámicamente un elemento 'div' con clase 'message-card' que contiene
 *       toda la información de la tarea (usuario, título, descripción, estado, timestamp)
 * 
 * 4. ¿Dónde se inserta ese elemento dentro del DOM?
 *    R: Se inserta al inicio del contenedor 'messagesContainer' usando insertBefore,
 *       haciendo que las tareas más recientes aparezcan primero
 * 
 * 5. ¿Qué ocurre en la página cada vez que repites la acción?
 *    R: Se agrega una nueva tarjeta de tarea al inicio de la lista, se actualiza
 *       el contador de tareas, se oculta el mensaje de "no hay tareas" y se limpian
 *       solo los campos de la tarea (manteniendo el usuario activo)
 */


// ============================================
// 11. FUNCIONALIDADES ADICIONALES (BONUS)
// ============================================

/**
 * RETOS ADICIONALES OPCIONALES:
 * 
 * 1. Agregar un botón para eliminar mensajes individuales
 * 2. Implementar localStorage para persistir los mensajes
 * 3. Agregar un contador de caracteres en el textarea
 * 4. Implementar un botón para limpiar todos los mensajes
 * 5. Agregar diferentes colores de avatar según el nombre del usuario
 * 6. Permitir editar mensajes existentes
 * 7. Agregar emojis o reacciones a los mensajes
 * 8. Implementar búsqueda/filtrado de mensajes
 */


/**
 * ============================================
 * CUMPLIMIENTO DE CRITERIOS - RESUMEN
 * ============================================
 * 
 * CRITERIOS 1-5: Análisis del problema (SABER)
 * CRITERIOS 6-10: Búsqueda del usuario (HACER)
 * CRITERIOS 11-15: Registro de tareas (HACER)
 * CRITERIOS 16-20: Manipulación del DOM
 * CRITERIOS 21-24: Uso de la API y lógica del sistema
 * CRITERIOS 25-29: Buenas prácticas y autonomía (SER)
 * ============================================
 */