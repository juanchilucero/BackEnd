// src/dto/session.dto.js

// DTO para crear una sesión
export class CreateSessionDTO {
    constructor(userId, token) {
        this.userId = userId;
        this.token = token;
    }
}

  // DTO para eliminar una sesión
export class DeleteSessionDTO {
    constructor(token) {
        this.token = token;
    }
}

