// src/routes/ticket.routes.js
import express from 'express';
import ticketController from '../controllers/ticketController.js';
import { verifyToken } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

router.get('/:tid', verifyToken, ticketController.obtenerTicket);
router.post('/finalizar-uso/:tid', verifyToken, ticketController.finalizarUsoCochera);

export default router;
