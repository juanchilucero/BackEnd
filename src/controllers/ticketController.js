import ticketDao from '../Dao/ticket.dao.js';
import cocheraDao from '../Dao/cochera.dao.js';
import moment from 'moment';
import { TicketDTO, TicketResumenDTO } from '../Dto/ticket.dto.js';


const ticketController = {
    obtenerTicket: async (req, res, next) => {
        const { tid } = req.params;
        try {
            const ticket = await ticketDao.getTicketById(tid);
            if (!ticket) return next({ code: 'TICKET_NOT_FOUND' });

            const ticketDTO = new TicketDTO(ticket);
            res.status(200).json(ticketDTO);
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },

    finalizarUsoCochera: async (req, res, next) => {
        const { tid } = req.params;
        try {
            const ticket = await ticketDao.getTicketById(tid);
            if (!ticket) return next({ code: 'TICKET_NOT_FOUND' });

            if (!ticket.tiempoFin || !ticket.costo) {
                return next({ code: 'TICKET_NOT_FINALIZED' });
            }

            const tiempoUso = moment.duration(moment(ticket.tiempoFin).diff(moment(ticket.tiempoInicio))).asMinutes();
            const cochera = await cocheraDao.getCocheraById(ticket.cocheraId);
            if (!cochera) return next({ code: 'COCHERA_NOT_FOUND' });

            const ticketResumenDTO = new TicketResumenDTO({
                numeroCochera: cochera.numero,
                tiempoUso,
                vehiculo: ticket.vehiculo,
                costo: ticket.costo
            });

            res.status(200).json(ticketResumenDTO);
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },
    eliminarTicket: async (req, res, next) => {
        const { tid } = req.params;

        try {
            const ticket = await ticketDao.getTicketById(tid);
            if (!ticket) return next({ code: 'TICKET_NOT_FOUND' });

            await ticketDao.eliminarTicket(tid);
            res.status(200).json({ message: 'Ticket eliminado con éxito' });
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },
};

export default ticketController;
