import express from 'express';
import passport from 'passport';
import cocheraController from '../controllers/cocheraController.js';

const router = express.Router();

// Ruta para marcar una cochera como disponible
router.post('/marcar-disponible', cocheraController.marcarDisponible);

// Ruta para ocupar una cochera
router.post('/ocupar-cochera', cocheraController.ocuparCochera);

// Ruta para liberar una cochera
router.post('/liberar-cochera', cocheraController.liberarCochera);

// Ruta para ver todas las cocheras
router.get('/ver-cocheras', cocheraController.verCocheras);

// Ruta para que los propietarios vean los usos de sus cocheras
router.get('/ver-usos-cocheras-propietario', passport.authenticate('jwt', { session: false }), cocheraController.verUsosCocheraPropietario);

export default router;
