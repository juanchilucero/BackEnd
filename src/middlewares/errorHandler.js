const errorDictionary = {
    COCHERA_NOT_FOUND: { status: 404, message: 'Cochera no encontrada' },
    TICKET_NOT_FOUND: { status: 404, message: 'Ticket no encontrado' },
    USER_NOT_FOUND: { status: 404, message: 'Usuario no encontrado' },
    USER_NOT_AUTHORIZED: { status: 403, message: 'Usuario no autorizado' },
    VALIDATION_ERROR: { status: 400, message: 'Error de validación' },
    MISSING_FIELDS: { status: 400, message: 'Campos requeridos faltantes' },
    COCHERA_ALREADY_OCCUPIED: { status: 400, message: 'Cochera ya está ocupada' },
    COCHERA_ALREADY_UNOCCUPIED: { status: 400, message: 'Cochera ya está desocupada' },
    OCUPACION_NOT_FOUND: { status: 404, message: 'Ocupación no encontrada' },
    TICKET_NOT_FINALIZED: { status: 400, message: 'Debe liberar la cochera primero' },
    INTERNAL_SERVER_ERROR: { status: 500, message: 'Error interno del servidor' },
    USER_ALREADY_EXISTS: { status: 400, message: 'El usuario ya existe' },
    LOGIN_FAILED: { status: 400, message: 'Inicio de sesión fallido' },
    TOKEN_REQUIRED: { status: 400, message: 'Token requerido' },
    SESSION_NOT_FOUND: { status: 404, message: 'Sesión no encontrada' }
};



const errorHandler = (err, req, res, next) => {
    const error = errorDictionary[err.code] || errorDictionary.INTERNAL_SERVER_ERROR;
    res.status(error.status).json({ message: error.message, details: err.details || null });
};

export default errorHandler;

