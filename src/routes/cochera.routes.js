import express from 'express';
import cocheraController from '../controllers/cocheraController.js';
import { isAdminOrPropietario } from '../middlewares/authMiddleware.js';
import { verifyToken } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

// Ruta para marcar una cochera como no disponible
router.put('/:cid/marcar-no-disponible', verifyToken, isAdminOrPropietario, cocheraController.marcarNoDisponible);

// Ruta para marcar una cochera como disponible
router.put('/:cid/marcar-disponible', verifyToken, isAdminOrPropietario, cocheraController.marcarDisponible);

// Ruta para ocupar una cochera
router.post('/:cid/ocupar-cochera', verifyToken, cocheraController.ocuparCochera);

// Ruta para liberar una cochera
router.post('/:cid/liberar-cochera', verifyToken, cocheraController.liberarCochera);

// Ruta para ver todas las cocheras
router.get('/ver-cocheras', verifyToken, cocheraController.verCocheras);

// Ruta para que los propietarios vean los usos de sus cocheras
router.get('/:cid/ver-usos-cocheras-propietario', verifyToken, isAdminOrPropietario, cocheraController.verUsosCocheraPropietario);

export default router;

