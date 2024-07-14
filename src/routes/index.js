import express from 'express';
import authRoutes from './auth.routes.js';
import cocheraRoutes from './cochera.routes.js';
import userRoutes from './user.routes.js'; 

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cochera', cocheraRoutes);
router.use('/user', userRoutes);

export default router;
