// src/dao/ticket.dao.js
import Ticket from '../models/ticket.model.js';

const ticketDao = {
    getTicketById: async (tid) => {
        return await Ticket.findById(tid).populate('cocheraId usuarioId');
    },
    finalizarUso: async (tid, tiempoFin, costo) => {
        const ticket = await Ticket.findById(tid);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }
        ticket.tiempoFin = tiempoFin;
        ticket.costo = costo;
        ticket.estado = 'finalizada';
        return await ticket.save();
    }
};

export default ticketDao;
