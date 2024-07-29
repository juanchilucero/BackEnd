import { cocheraModel } from '../models/cochera.model.js';
import moment from 'moment';


// Calcular costo de ocupación
const calcularCosto = (tiempoInicio, tiempoFin) => {
  // Convertir a objetos moment si no lo son
  const inicio = moment(tiempoInicio);
  const fin = moment(tiempoFin);

  const duracion = moment.duration(fin.diff(inicio));
  const horas = duracion.asHours();
  const costoPorHora = 100; // Ejemplo, 100 pesos por hora
  return Math.round(horas * costoPorHora);
};


const cocheraController = { 

  // Marcar cochera como disponible
  marcarDisponible: async (req, res) => {
    const { cid } = req.params;
    try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cid);
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
  const { cid } = req.params;
  const { vehiculo } = req.body; // Asegúrate de que vehiculo esté en el cuerpo de la solicitud

  try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cid);

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
    const { cid } = req.params;
    try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cid);
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
    const { cid } = req.params; // Obtener el ID de la cochera desde los parámetros de la ruta
  
    try {
      const user = req.user;
  
      // Verificar si el usuario es admin o propietario
      if (user.role !== 'admin' && user.role !== 'propietario') {
        return res.status(403).json({ message: 'No autorizado' });
      }
  
      // Buscar la cochera específica por ID
      const cochera = await cocheraModel.findById(cid).populate('ocupaciones.usuario', 'first_name last_name');
  
      // Verificar si la cochera existe
      if (!cochera) {
        return res.status(404).json({ message: 'Cochera no encontrada' });
      }
  
      // Verificar si el usuario tiene permisos para acceder a esta cochera
      if (user.role !== 'admin' && cochera.propietario.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'No autorizado' });
      }
  
      // Devolver solo las ocupaciones de la cochera
      res.status(200).json(cochera.ocupaciones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  


  // Marcar no dispobible
  marcarNoDisponible: async (req, res) => {
    const { cid } = req.params;
    try {
      const user = req.user;
      const cochera = await cocheraModel.findById(cid);
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
