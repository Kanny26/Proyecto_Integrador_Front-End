# Proyecto Integrador — Front-End
### Sistema de Gestión de Tareas

Frontend del proyecto integrador desarrollado con **Vanilla JavaScript** y **Vite**, que consume la API RESTful del backend para gestionar tareas y usuarios mediante manipulación dinámica del DOM, sin recargas de página.

---

## Integrantes del Equipo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| Karol Stephany Moreno Becerra | Líder del proyecto | [@Kanny26](https://github.com/Kanny26) |
| Nicolas Rodriguez Pinzon | Desarrollo | [@nicolasrodri18](https://github.com/nicolasrodri18) |
| Diego Alexander Puerto Acosta | Desarrollo Frontend | [@DAPUERTO](https://github.com/DAPUERTO) |

**Programa:** Tecnología en Análisis y Desarrollo de Software — SENA  
**Código ficha:** 2994281 | **Fase:** Ejecución  
**Instructor:** John Freddy Becerra Castellanos — CIMI

---

## Descripción del Proyecto

Este repositorio contiene el desarrollo del lado del cliente para el proyecto integrador. La aplicación permite gestionar tareas y usuarios a través de una interfaz dinámica construida completamente con manipulación del DOM en Vanilla JavaScript.

La aplicación cuenta con dos vistas principales: un panel de administración con pestañas para gestión de tareas y usuarios, y una vista de usuario normal que muestra únicamente las tareas asignadas al usuario autenticado.

---

## Tecnologías Utilizadas

- **Vanilla JavaScript (ES Modules)** — sin frameworks
- **Vite** — empaquetador y servidor de desarrollo
- **SweetAlert2** — librería de notificaciones y alertas
- **CSS modular** — estilos organizados por componentes
- **HTML5** — estructura semántica

---

## Estructura del Proyecto

```
Proyecto_Integrador_Front-End/
├── html/
│   ├── form_admin_task.html    # Panel admin (tareas + usuarios en pestañas)
│   └── user_tasks.html         # Vista de usuario normal
├── src/
│   ├── API/
│   │   ├── assignTask.js       # Asignación de usuarios a tareas
│   │   ├── config.js           # URL base de la API
│   │   ├── deleteTarea.js      # DELETE de tareas
│   │   ├── getTareas.js        # GET de tareas
│   │   ├── getUsuario.js       # GET de usuarios
│   │   ├── index.js            # Barrel de exportaciones API
│   │   ├── postTareas.js       # POST de tareas
│   │   ├── updateTarea.js      # PUT/PATCH de tareas
│   │   └── users.js            # CRUD de usuarios
│   ├── css/
│   │   └── components/         # Estilos por componente
│   ├── services/
│   │   ├── index.js            # Barrel de servicios
│   │   ├── tareas.js           # Lógica de negocio de tareas
│   │   └── usuarios.js         # Lógica de negocio de usuarios
│   ├── ui/
│   │   ├── adminUsers.js       # UI administración de usuarios
│   │   ├── cardPerfil.js       # Componente tarjeta de perfil
│   │   ├── cardTarea.js        # Componente tarjeta de tarea
│   │   ├── descarga.js         # Exportación a JSON
│   │   ├── errores.js          # Manejo de errores en formularios
│   │   ├── formulario.js       # Handlers del formulario principal
│   │   ├── index.js            # Barrel de exportaciones UI
│   │   └── notificaciones.js   # Módulo de notificaciones
│   ├── utils/
│   │   ├── exportUtils.js      # Utilidades de exportación
│   │   ├── index.js            # Barrel de utilidades
│   │   └── validaciones.js     # Validaciones de formulario
│   ├── main.js                 # Punto de entrada de la aplicación
│   └── styles.css              # Estilos globales
├── index.html                  # Página de login
├── .gitignore
├── package.json
└── README.md
```

---

## Instalación y Ejecución

### Requisitos previos
- Node.js v18 o superior
- npm
- Backend corriendo en `http://localhost:3000`

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/Kanny26/Proyecto_Integrador_Front-End.git
cd Proyecto_Integrador_Front-End
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`

4. Para generar la versión de producción:
```bash
npm run build
```

---

## Flujo de la Aplicación

1. El usuario ingresa su número de documento en la página de login (`index.html`)
2. El sistema consulta la API y verifica si el usuario existe
3. Según el rol del usuario se redirige a la vista correspondiente:
   - **Admin** → `html/form_admin_task.html` — panel con pestañas de tareas y usuarios
   - **Usuario normal** → `html/user_tasks.html` — vista con sus tareas asignadas
4. Ambas vistas cuentan con botón de cerrar sesión en el navbar

---

## Requisitos Funcionales Implementados

**Guía 1 — CRUD con JavaScript y API RESTful**
- RF-01 Visualización completa de tareas (READ) con DOM dinámico
- RF-02 Creación de tareas con validación de formulario (CREATE)
- RF-03 Actualización de tareas con carga en formulario (UPDATE)
- RF-04 Eliminación de tareas con confirmación (DELETE)

**Guía 3 — Modularización de Código JavaScript**
- RF01 Filtro avanzado por estado de tarea
- RF02 Ordenamiento dinámico por fecha, nombre y estado
- RF03 Sistema de notificaciones estructurado con SweetAlert2
- RF04 Exportación de tareas visibles a archivo JSON descargable

---

## Arquitectura Modular

El proyecto sigue una separación estricta de responsabilidades en tres capas:

- **API** — comunicación directa con el backend (fetch, métodos HTTP)
- **Services** — lógica de negocio y estado de la aplicación
- **UI** — manipulación del DOM y manejo de eventos

Todas las funcionalidades utilizan **ES Modules** (`import` / `export`) sin variables globales.


---

## Control de Versiones

El proyecto sigue el flujo de trabajo **Git Flow**:
- Cada funcionalidad se desarrolla en una rama independiente
- Los cambios se integran a `develop` mediante Pull Request
- Solo se hace merge a `main` cuando la versión es estable y revisada

---

*SENA — Centro industrial de mantenimiento integral (CIMI)*
