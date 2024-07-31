import express from 'express';
import authRoutes from './auth.routes.js';
import cocheraRoutes from './cochera.routes.js';
import userRoutes from './user.routes.js';
import ticketRoutes from './ticket.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cochera', cocheraRoutes);
router.use('/user', userRoutes);
router.use('/ticket', ticketRoutes);
export default router;
