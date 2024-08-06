import express from 'express';
import mockingController from '../controllers/mockingController.js';

const router = express.Router();

router.get('/mockingtickets', mockingController.generarMockTickets);

export default router;
