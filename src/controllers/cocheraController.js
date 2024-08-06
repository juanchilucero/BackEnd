import cocheraDao from '../Dao/cochera.dao.js';
import moment from 'moment';
import Ticket from '../models/ticket.model.js';
import { OcupacionDTO } from '../Dto/cochera.dto.js';

const calcularCosto = (tiempoInicio, tiempoFin) => {
    const inicio = moment(tiempoInicio);
    const fin = moment(tiempoFin);
    const duracion = moment.duration(fin.diff(inicio));
    const horas = duracion.asHours();
    const costoPorHora = 100;
    return Math.round(horas * costoPorHora);
};

const cocheraController = {
    marcarNoDisponible: async (req, res, next) => {
        const { cid } = req.params;
        try {
            const user = req.user;
            const cochera = await cocheraDao.getCocheraById(cid);

            if (!cochera) return next({ code: 'COCHERA_NOT_FOUND' });

            if (cochera.propietario.toString() !== user._id.toString() && user.role !== 'admin') {
                return next({ code: 'USER_NOT_AUTHORIZED' });
            }

            await cocheraDao.marcarNoDisponible(cid);
            res.status(200).json({ message: 'Cochera marcada como no disponible' });
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },

    marcarDisponible: async (req, res, next) => {
        const { cid } = req.params;
        try {
            const user = req.user;
            const cochera = await cocheraDao.getCocheraById(cid);
            if (!cochera) return next({ code: 'COCHERA_NOT_FOUND' });

            if (cochera.propietario.toString() !== user._id.toString() && user.role !== 'admin') {
                return next({ code: 'USER_NOT_AUTHORIZED' });
            }

            await cocheraDao.marcarDisponible(cid);
            res.status(200).json({ message: 'Cochera marcada como disponible' });
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },

    ocuparCochera: async (req, res, next) => {
        const { cid } = req.params;
        const { vehiculo } = req.body;
        try {
            const user = req.user;
            const cochera = await cocheraDao.getCocheraById(cid);

            if (!cochera) return next({ code: 'COCHERA_NOT_FOUND' });
            if (cochera.estado === 'ocupado') return next({ code: 'COCHERA_ALREADY_OCCUPIED' });

            const tiempoInicio = moment();

            const nuevoTicket = new Ticket({
                cocheraId: cid,
                usuarioId: user._id,
                estado: 'en curso',
                tiempoInicio,
                vehiculo
            });

            const ticketGuardado = await nuevoTicket.save();

            const ocupacionData = new OcupacionDTO(user._id, vehiculo, tiempoInicio);

            await cocheraDao.ocuparCochera(cid, ocupacionData);

            res.status(200).json({ message: 'Cochera ocupada con éxito', ticket: ticketGuardado });
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },

    liberarCochera: async (req, res, next) => {
        const { cid } = req.params;
        try {
            const user = req.user;
            const cochera = await cocheraDao.getCocheraById(cid);
            if (!cochera) return next({ code: 'COCHERA_NOT_FOUND' });
            if (cochera.estado === 'desocupado') return next({ code: 'COCHERA_ALREADY_UNOCCUPIED' });

            const ocupacion = cochera.ocupaciones.find(o => o.tid.toString() === user._id.toString() && !o.tiempoFin);
            if (!ocupacion) return next({ code: 'OCUPACION_NOT_FOUND' });

            const tiempoFin = moment();
            const costo = user.role !== 'propietario' ? calcularCosto(ocupacion.tiempoInicio, tiempoFin) : 0;

            await cocheraDao.liberarCochera(cid, ocupacion._id, tiempoFin, costo);

            const ticket = await Ticket.findById(ocupacion.tid);
            if (!ticket) return next({ code: 'TICKET_NOT_FOUND' });

            ticket.tiempoFin = tiempoFin;
            ticket.costo = costo;
            ticket.estado = 'finalizada';
            await ticket.save();

            res.status(200).json({ message: 'Cochera liberada con éxito', ocupacion: ticket });
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },

    verCocheras: async (req, res, next) => {
        try {
            const cocheras = await cocheraDao.getAllCocheras();
            res.status(200).json(cocheras);
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    },

    verUsosCocheraPropietario: async (req, res, next) => {
        const { cid } = req.params;
        try {
            const user = req.user;

            if (user.role !== 'admin' && user.role !== 'propietario') {
                return next({ code: 'USER_NOT_AUTHORIZED' });
            }

            const cochera = await cocheraDao.getCocheraById(cid);
            if (!cochera) {
                return next({ code: 'COCHERA_NOT_FOUND' });
            }

            if (user.role !== 'admin' && cochera.propietario.toString() !== user._id.toString()) {
                return next({ code: 'USER_NOT_AUTHORIZED' });
            }

            res.status(200).json(cochera.ocupaciones);
        } catch (error) {
            next({ code: 'INTERNAL_SERVER_ERROR', details: error.message });
        }
    }
};

export default cocheraController;


