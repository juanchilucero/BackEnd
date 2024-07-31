# Sistema de Estacionamiento

## Descripción

Este proyecto es un sistema de backend para la gestión de estacionamientos en un complejo de departamentos. Permite a los propietarios y administradores gestionar cocheras, registrar vehículos, controlar accesos, administrar tarifas y realizar seguimiento de espacios disponibles en tiempo real.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Rutas API](#rutas-api)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- Registro y autenticación de usuarios con roles diferenciados (administrador, propietario y visitante).
- Gestión de cocheras: marcar como disponible, no disponible, ocupar y liberar.
- Registro de vehículos y generación de tickets para el uso de cocheras.
- Cálculo automático del costo de ocupación basado en el tiempo.
- Seguimiento y visualización de la ocupación de cocheras por propietarios y administradores.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) para autenticación
- Passport.js para OAuth y autenticación local
- Bcrypt para el hashing de contraseñas
- Moment.js para el manejo de fechas y horas

## Instalación

Sigue estos pasos para inicializar el proyecto en tu entorno local.

1. Clona este repositorio:
    ```bash
    git clone https://github.com/tu_usuario/sistema-estacionamiento.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd sistema-estacionamiento
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/estacionamiento
    JWT_SECRET=tu_secreto_jwt
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=tu_password_admin
    ```
5. Inicia el servidor:
    ```bash
    npm start
    ```

## Uso

Para usar el sistema de estacionamiento, puedes hacer peticiones a las siguientes rutas API:

### Autenticación

- Registro de usuario: `POST /api/register`
- Login de usuario: `POST /api/login`

### Gestión de Cocheras

- Marcar una cochera como no disponible: `PUT /api/cocheras/:cid/marcar-no-disponible`
- Marcar una cochera como disponible: `PUT /api/cocheras/:cid/marcar-disponible`
- Ocupación de cochera: `POST /api/cocheras/:cid/ocupar-cochera`
- Liberar cochera: `POST /api/cocheras/:cid/liberar-cochera`
- Ver todas las cocheras: `GET /api/cocheras/ver-cocheras`
- Ver los usos de las cocheras de un propietario: `GET /api/cocheras/:cid/ver-usos-cocheras-propietario`

## Estructura del Proyecto

El proyecto está organizado en la siguiente estructura de carpetas:

- `src/config/`: Contiene `config.js`, `mongoDb.config.js`, y `passport.config.js`.
- `src/controllers/`: Contiene `authController.js`, `cocheraController.js`, y `userController.js`.
- `src/dao/`: Contiene `user.dao.js` y `cochera.dao.js`.
- `src/dto/`: Contiene `cochera.dto.js`.
- `src/middlewares/`: Contiene `authMiddleware.js` y `tokenMiddleware.js`.
- `src/models/`: Contiene `cochera.model.js`, `session.model.js`, y `user.model.js`.
- `src/routes/`: Contiene `auth.routes.js`, `cochera.routes.js`, `index.js`, y `user.routes.js`.
- `src/utils/`: Contiene `authUtils.js` y `jwtUtils.js`.
- `app.js`: Archivo principal del servidor.
- `.env`: Archivo de configuración de variables de entorno.

## Rutas API

Las rutas están protegidas por autenticación JWT y roles. Asegúrate de tener un token válido en las solicitudes.

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un *issue* o envía un *pull request* para cualquier mejora o corrección.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
