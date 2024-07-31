// src/dao/cochera.dao.js
import { cocheraModel } from '../models/cochera.model.js';

const cocheraDao = {
    // Obtener todas las cocheras
    getAllCocheras: async () => {
        return cocheraModel.find().populate('propietario', 'first_name last_name').populate('ocupaciones.tid');
    },

    // Obtener cochera por ID
    getCocheraById: async (id) => {
        return cocheraModel.findById(id).populate('ocupaciones.tid');
    },

    // Marcar cochera como disponible
    marcarDisponible: async (id) => {
        return cocheraModel.findByIdAndUpdate(id, { estado: 'desocupado' }, { new: true });
    },

    // Marcar cochera como no disponible
    marcarNoDisponible: async (id) => {
        return cocheraModel.findByIdAndUpdate(id, { estado: 'no-disponible' }, { new: true });
    },

    // Ocupar cochera
    ocuparCochera: async (id, ocupacionData) => {
        return cocheraModel.findByIdAndUpdate(id, { $push: { ocupaciones: ocupacionData }, estado: 'ocupado' }, { new: true });
    },

    // Liberar cochera
    liberarCochera: async (id, ocupacionId, tiempoFin, costo) => {
        return cocheraModel.findByIdAndUpdate(id, { $set: { 'ocupaciones.$[ocupacion].tiempoFin': tiempoFin, 'ocupaciones.$[ocupacion].costo': costo }, estado: 'desocupado' }, { arrayFilters: [{ 'ocupacion._id': ocupacionId }], new: true });
    }
};

export default cocheraDao;

