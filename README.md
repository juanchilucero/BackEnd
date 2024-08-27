# Sistema de Estacionamiento

## Descripción

Este proyecto es un sistema de backend para la gestión de estacionamientos en un complejo de departamentos. Permite funciones especiales como ver los usuarios para los administradores y ver los usos de las cocheras para los propietarios, así como crear usos de la cochera para los visitantes. También incluye funcionalidades de autenticación y autorización, y permite el inicio de sesión con Google.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Rutas API](#rutas-api)
- [Actualizaciones Recientes](#actualizaciones-recientes)


## Características

- Registro y autenticación de usuarios con roles diferenciados (administrador, propietario y visitante).
- Inicio de sesión con Google.
- Gestión de cocheras: marcar como disponible, no disponible, ocupar y liberar.
- Registro de vehículos y generación de tickets para el uso de cocheras.
- Cálculo automático del costo de ocupación basado en el tiempo.
- Seguimiento y visualización de la ocupación de cocheras por propietarios y administradores.
- Manejo de sesiones para los usuarios.

## Instalación

Sigue estos pasos para inicializar el proyecto en tu entorno local.

1. Clona este repositorio:
    ```bash
    git clone https://github.com/juanchilucero/BackEnd nombre_deseado 
    ```
    TENER EN CUENTA QUE PUEDEN MODIFICAR EL 
2. Navega al directorio del proyecto:
    ```bash
    cd nombre_deseado
    ```
    VER PUNTO 1

3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
    ```env
    ADMIN_EMAIL=adminCoder@coder.com
    ADMIN_PASSWORD=adminCod3r123
    GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
    JWT_SECRET=your_jwt_secret
    ```
5. Inicia el servidor:
    ```bash
    npm start
    ```

## Uso

Para usar el sistema de estacionamiento, puedes hacer peticiones a las siguientes rutas API. Asegúrate de incluir un token JWT válido en las solicitudes protegidas. Asegúrate de usar un rol adecuado a la petición que quieres hacer:

### Autenticación

- Registro de usuario: `POST /api/auth/register`
- Login de usuario: `POST /api/auth/login`
- Inicio de sesión con Google: `GET /api/auth/google`
- Callback de Google: `GET /api/auth/google/callback`

### Gestión de Cocheras

- Marcar una cochera como no disponible: `PUT /api/cochera/:cid/marcar-no-disponible`
- Marcar una cochera como disponible: `PUT /api/cochera/:cid/marcar-disponible`
- Ocupación de cochera: `POST /api/cochera/:cid/ocupar-cochera`
- Liberar cochera: `POST /api/cochera/:cid/liberar-cochera`
- Ver todas las cocheras: `GET /api/cochera/ver-cocheras`
- Ver los usos de las cocheras de un propietario: `GET /api/cochera/:cid/ver-usos-cocheras-propietario`

### Gestión de Tickets

- Obtener un ticket por ID: `GET /api/ticket/:tid`
- Finalizar uso de una cochera usando un ticket: `POST /api/ticket/finalizar-uso/:tid`

### Gestión de Usuarios

- Obtener todos los usuarios: `GET /api/user/users` (Solo para administradores)
- Obtener un usuario por ID: `GET /api/user/user/:id` (Solo para administradores)
- Eliminar un usuario: `DELETE /api/user/user/:id` (Solo para administradores)
- Actualizar un usuario: `PUT /api/user/user/:id` (Solo para administradores)

### Gestión de Errores para Logger

- Probar los niveles de log: `GET /api/logger/loggerTest`  
  - Descripción: Genera mensajes de log en todos los niveles configurados (debug, http, info, warning, error, fatal). Utiliza el logger para registrar cada mensaje y verifica que se escriban correctamente en los archivos de log configurados.
  - Respuesta Exitosa: `{ "message": "Logs generados correctamente" }`
  - Errores Comunes:
    - 500 Internal Server Error: Puede ocurrir si hay problemas al escribir en los archivos de log o si ocurre un error inesperado en el servidor.


## Estructura del Proyecto

El proyecto está organizado en la siguiente estructura de carpetas:

- `src/config/`: Contiene `config.js`, `mongoDb.config.js`, y `passport.config.js`.
- `src/controllers/`: Contiene `authController.js`, `cocheraController.js`, `mockingController.js`, `ticketController.js` y `userController.js`.
- `src/Dao/`: Contiene `user.dao.js`, `ticket.dao.js`, `session.dao.js` y `cochera.dao.js`.
- `src/Dto/`: Contiene `cochera.dto.js`, `session.dto.js`, `ticket.dto.js` y `user.dto.js`.
- `src/middlewares/`: Contiene `authMiddleware.js`, `tokenMiddleware.js` y `errorHandler.js`.
- `src/models/`: Contiene `cochera.model.js`, `session.model.js`, `ticket.model.js` y `user.model.js`.
- `src/routes/`: Contiene `auth.routes.js`, `cochera.routes.js`, `index.js`, `user.routes.js`, `mocking.routes.js`, `ticket.routes.js` y `logger.routes.js`.
- `src/utils/`: Contiene `authUtils.js`, `jwtUtils.js` y `logger.js`.
- `src/app.js`: Archivo principal del servidor.
- `.env`: Archivo de configuración de variables de entorno.

## Rutas API

Las rutas están protegidas por autenticación JWT y roles. Asegúrate de tener un token válido en las solicitudes.


## Actualizaciones Recientes

### Nuevo Rol de Usuario: "Premium"

Se ha creado un nuevo rol de usuario denominado "premium". Los usuarios con este rol cuentan con el beneficio de un costo gratuito en el uso del servicio de cocheras.

#### Beneficios:

- Los usuarios "premium" no pagan por el uso de cocheras.

### Cambiar Rol de Usuario

Se ha añadido una nueva funcionalidad que permite a los administradores cambiar el rol de un usuario entre "visitante" y "premium". Esta funcionalidad es accesible a través de una nueva ruta en la API.

#### Ruta: `PATCH /api/user/:id/rol`

- **Descripción:** Esta ruta permite a los administradores cambiar el rol de un usuario especificado por su ID.

#### Requisitos:

- El usuario que realiza la solicitud debe tener el rol de `admin`.
- La solicitud debe incluir un token de autenticación válido.

#### Parámetros:

- `id`: El ID del usuario cuyo rol se desea cambiar.

#### Posibles Roles:

- `visitante` → `premium`
- `premium` → `visitante`

### Eliminación de Tickets

Se ha agregado una nueva ruta en la API para permitir la eliminación de tickets generados por el uso de una cochera. Solo los usuarios con rol de `admin` o `propietario` de la cochera pueden realizar esta acción.

#### Ruta: `DELETE /api/ticket/:id`

- **Descripción:** Esta ruta permite a los administradores y propietarios de cocheras eliminar un ticket especificado por su ID.

#### Requisitos:

- El usuario que realiza la solicitud debe tener el rol de `admin` o ser el propietario de la cochera relacionada con el ticket.
- La solicitud debe incluir un token de autenticación válido.

#### Parámetros:

- `id`: El ID del ticket que se desea eliminar.

### Recuperación de Contraseña

Se han implementado nuevas rutas para la recuperación de contraseña, permitiendo a los usuarios solicitar un restablecimiento y establecer una nueva contraseña.

#### Ruta: `POST /api/auth/forgot-password`

- **Descripción:** Esta ruta permite a los usuarios solicitar un restablecimiento de contraseña enviando un correo electrónico con un enlace para restablecerla.

#### Ruta: `POST /api/auth/reset-password/:token`

- **Descripción:** Esta ruta permite a los usuarios restablecer su contraseña utilizando el token proporcionado en el enlace de restablecimiento recibido por correo electrónico.

#### Requisitos:

- El usuario debe proporcionar su dirección de correo electrónico en la solicitud de restablecimiento.
- Para restablecer la contraseña, el usuario debe utilizar el token válido recibido por correo.

