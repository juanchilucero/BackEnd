// src/dto/ticket.dto.js

export class TicketDTO {
    constructor({ cocheraId, usuarioId, vehiculo, estado, tiempoInicio, tiempoFin, costo }) {
        this.cocheraId = cocheraId;
        this.usuarioId = usuarioId;
        this.vehiculo = vehiculo;
        this.estado = estado;
        this.tiempoInicio = tiempoInicio;
        this.tiempoFin = tiempoFin;
        this.costo = costo;
    }
}

export class TicketResumenDTO {
    constructor({ numeroCochera, tiempoUso, vehiculo, costo }) {
        this.numeroCochera = numeroCochera;
        this.tiempoUso = tiempoUso;
        this.vehiculo = vehiculo;
        this.costo = costo;
    }
}
