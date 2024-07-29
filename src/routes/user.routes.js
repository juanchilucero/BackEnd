import express from 'express';
import { isAdmin } from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js';
import { verifyToken } from '../middlewares/tokenMiddleware.js';
const router = express.Router();

// ruta para obtener todos los usuarios
router.get('/users', verifyToken, isAdmin, userController.getAllUsers);

// ruta para obtener un usuario por ID
router.get('/user/:id', verifyToken, isAdmin, userController.getUserById);

// ruta para eliminar un usuario
router.delete('/user/:id', verifyToken, isAdmin, userController.deleteUser);

// ruta para actualizar un usuario
router.put('/user/:id', verifyToken, isAdmin, userController.updateUser);

export default router;
