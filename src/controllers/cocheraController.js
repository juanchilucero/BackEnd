import cocheraDao from '../Dao/cochera.dao.js';
import moment from 'moment';
import { CocheraDTO, CocheraUpdateDTO, OcupacionDTO, LiberarCocheraDTO } from '../Dto/cochera.dto.js';

// Calcular costo de ocupación
const calcularCosto = (tiempoInicio, tiempoFin) => {
  const inicio = moment(tiempoInicio);
  const fin = moment(tiempoFin);
  const duracion = moment.duration(fin.diff(inicio));
  const horas = duracion.asHours();
  const costoPorHora = 100; // Ejemplo, 100 pesos por hora
  return Math.round(horas * costoPorHora);
};

const cocheraController = {
  marcarDisponible: async (req, res) => {
    const { cid } = req.params;
    try {
      const user = req.user;
      const cochera = await cocheraDao.getCocheraById(cid);
      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });

      if (cochera.propietario.toString() !== user._id.toString() && user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado' });
      }

      const cocheraDto = new CocheraUpdateDTO('desocupado');
      await cocheraDao.marcarDisponible(cid, cocheraDto);
      res.status(200).json({ message: 'Cochera marcada como disponible' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  ocuparCochera: async (req, res) => {
    const { cid } = req.params;
    const { vehiculo } = req.body;
    try {
      const user = req.user;
      const cochera = await cocheraDao.getCocheraById(cid);

      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });
      if (cochera.estado === 'ocupado') return res.status(400).json({ message: 'Cochera ya está ocupada' });

      const tiempoInicio = moment();
      const ocupacionDto = new OcupacionDTO(user._id, vehiculo, tiempoInicio);
      await cocheraDao.ocuparCochera(cid, ocupacionDto);

      res.status(200).json({ message: 'Cochera ocupada con éxito' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  liberarCochera: async (req, res) => {
    const { cid } = req.params;
    try {
      const user = req.user;
      const cochera = await cocheraDao.getCocheraById(cid);
      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });
      if (cochera.estado === 'desocupado') return res.status(400).json({ message: 'Cochera ya está desocupada' });

      const ocupacion = cochera.ocupaciones.find(o => o.usuario.toString() === user._id.toString() && !o.tiempoFin);
      if (!ocupacion) return res.status(404).json({ message: 'Ocupación no encontrada' });

      const tiempoFin = moment();
      const costo = user.role !== 'propietario' ? calcularCosto(ocupacion.tiempoInicio, tiempoFin) : 0;
      const liberarCocheraDto = new LiberarCocheraDTO(tiempoFin, costo);
      await cocheraDao.liberarCochera(cid, ocupacion._id, liberarCocheraDto);

      res.status(200).json({ message: 'Cochera liberada con éxito', ocupacion });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verCocheras: async (req, res) => {
    try {
      const cocheras = await cocheraDao.getAllCocheras();
      res.status(200).json(cocheras);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verUsosCocheraPropietario: async (req, res) => {
    const { cid } = req.params;
    try {
      const user = req.user;

      if (user.role !== 'admin' && user.role !== 'propietario') {
        return res.status(403).json({ message: 'No autorizado' });
      }

      const cochera = await cocheraDao.getCocheraById(cid);
      if (!cochera) {
        return res.status(404).json({ message: 'Cochera no encontrada' });
      }

      if (user.role !== 'admin' && cochera.propietario.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'No autorizado' });
      }

      res.status(200).json(cochera.ocupaciones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  marcarNoDisponible: async (req, res) => {
    const { cid } = req.params;
    try {
      const user = req.user;
      const cochera = await cocheraDao.getCocheraById(cid);
      if (!cochera) return res.status(404).json({ message: 'Cochera no encontrada' });

      if (user.role !== 'admin' && (user.role !== 'propietario' || cochera.propietario.toString() !== user._id.toString())) {
        return res.status(403).json({ message: 'No autorizado' });
      }

      const cocheraDto = new CocheraUpdateDTO('no-disponible');
      await cocheraDao.marcarNoDisponible(cid, cocheraDto);
      res.status(200).json({ message: 'Cochera marcada como no disponible' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default cocheraController;


