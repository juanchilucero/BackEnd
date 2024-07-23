import { cocheraModel } from '../models/cochera.model.js';
import moment from 'moment';

const cocheraController = { 

  // Marcar cochera como disponible
  marcarDisponible: async (req, res) => {
    const { cocheraId } = req.body;
    try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cocheraId);
      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });
      
      // Solo admin o propietario pueden marcar como disponible
      if (cochera.propietario.toString() !== user._id.toString() && user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado' });
      }

      cochera.estado = 'desocupado';
      await cochera.save();

      res.status(200).json({ message: 'Cochera marcada como disponible' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Ocupar una cochera
  ocuparCochera: async (req, res) => {
    const { cocheraId, vehiculo } = req.body;
    try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cocheraId);
      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });
      if (cochera.estado === 'ocupado') return res.status(400).json({ message: 'Cochera ya está ocupada' });

      const tiempoInicio = moment();
      cochera.ocupaciones.push({ usuario: user._id, vehiculo, tiempoInicio });
      cochera.estado = 'ocupado';
      await cochera.save();

      res.status(200).json({ message: 'Cochera ocupada con éxito' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Liberar una cochera
  liberarCochera: async (req, res) => {
    const { cocheraId } = req.body;
    try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cocheraId);
      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });
      if (cochera.estado === 'desocupado') return res.status(400).json({ message: 'Cochera ya está desocupada' });

      const ocupacion = cochera.ocupaciones.find(o => o.usuario.toString() === user._id.toString() && !o.tiempoFin);
      if (!ocupacion) return res.status(404).json({ message: 'Ocupación no encontrada' });

      ocupacion.tiempoFin = moment();
      if (user.role !== 'propietario') {
        ocupacion.costo = calcularCosto(ocupacion.tiempoInicio, ocupacion.tiempoFin);
      }
      cochera.estado = 'desocupado';
      await cochera.save();

      res.status(200).json({ message: 'Cochera liberada con éxito', ocupacion });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Ver estado de todas las cocheras
  verCocheras: async (req, res) => {
    try {
      const cocheras = await cocheraModel.find().populate('propietario', 'first_name last_name').populate('ocupaciones.usuario', 'first_name last_name');
      res.status(200).json(cocheras);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Ver registros de usos de las cocheras de un propietario
  verUsosCocheraPropietario: async (req, res) => {
    try {
      const user = req.user;
      if (user.role !== 'admin' && user.role !== 'propietario') {
        return res.status(403).json({ message: 'No autorizado' });
      }

      const cocheras = await cocheraModel.find({ propietario: user._id }).populate('ocupaciones.usuario', 'first_name last_name');
      res.status(200).json(cocheras);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Calcular costo de ocupación
  calcularCosto: (tiempoInicio, tiempoFin) => {
    const duracion = moment.duration(tiempoFin.diff(tiempoInicio));
    const horas = duracion.asHours();
    const costoPorHora = 100; // Ejemplo, 100 pesos por hora
    return Math.round(horas * costoPorHora);
  },

  // Marcar no dispobible
  marcarNoDisponible: async (req, res) => {
    const { cocheraId } = req.body;
    try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cocheraId);
      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });
      
      // Verificar si el usuario es administrador o propietario
      if (user.role !== 'admin' && (user.role !== 'propietario' || cochera.propietario.toString() !== user._id.toString())) {
        return res.status(403).json({ message: 'No autorizado' });
      }
  
      cochera.estado = 'no-disponible';
      await cochera.save();
  
      res.status(200).json({ message: 'Cochera marcada como no disponible' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
}

export default cocheraController;
