// src/controllers/ticketController.js
import ticketDao from '../Dao/ticket.dao.js';
import cocheraDao from '../Dao/cochera.dao.js';
import moment from 'moment';
import { TicketDTO, TicketResumenDTO } from '../Dto/ticket.dto.js';

const calcularCosto = (tiempoInicio, tiempoFin) => {
    const inicio = moment(tiempoInicio);
    const fin = moment(tiempoFin);
    const duracion = moment.duration(fin.diff(inicio));
    const horas = duracion.asHours();
    const costoPorHora = 100; // Ejemplo, 100 pesos por hora
    return Math.round(horas * costoPorHora);
};

const ticketController = {
    obtenerTicket: async (req, res) => {
        const { tid } = req.params;
        try {
            const ticket = await ticketDao.getTicketById(tid);
            if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });

            const ticketDTO = new TicketDTO(ticket);
            res.status(200).json(ticketDTO);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    finalizarUsoCochera: async (req, res) => {
        const { tid } = req.params;
        try {
            const ticket = await ticketDao.getTicketById(tid);
            if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });

            if (!ticket.tiempoFin || !ticket.costo) {
                return res.status(400).json({ message: 'Debe liberar la cochera primero' });
            }

            const tiempoUso = moment.duration(moment(ticket.tiempoFin).diff(moment(ticket.tiempoInicio))).asMinutes();
            const cochera = await cocheraDao.getCocheraById(ticket.cocheraId);
            const ticketResumenDTO = new TicketResumenDTO({
                numeroCochera: cochera.numero,
                tiempoUso,
                vehiculo: ticket.vehiculo,
                costo: ticket.costo
            });

            res.status(200).json(ticketResumenDTO);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default ticketController;
