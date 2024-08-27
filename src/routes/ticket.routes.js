// src/routes/ticket.routes.js
import express from 'express';
import ticketController from '../controllers/ticketController.js';
import { verifyToken } from '../middlewares/tokenMiddleware.js';
import { isAdminOrPropietario } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:tid', verifyToken, ticketController.obtenerTicket);
router.post('/finalizar-uso/:tid', verifyToken, ticketController.finalizarUsoCochera);
router.delete('/:tid', isAdminOrPropietario, verifyToken, ticketController.eliminarTicket);
export default router;
