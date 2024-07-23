import express from 'express';
import passport from 'passport';
import { isAdmin } from '../middlewares/authMiddleware.js';
import { getAllUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

// ruta para obtener todos los usuarios
router.get('/users', passport.authenticate('jwt', { session: false }), isAdmin, getAllUsers);

// ruta para obtener un usuario por ID
router.get('/user/:id', passport.authenticate('jwt', { session: false }), isAdmin, getUserById);

// ruta para eliminar un usuario
router.delete('/user/:id', passport.authenticate('jwt', { session: false }), isAdmin, deleteUser);

// ruta para actualizar un usuario
router.put('/user/:id', passport.authenticate('jwt', { session: false }), isAdmin, updateUser);

export default router;
