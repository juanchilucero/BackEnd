// src/routes/auth.routes.js
import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';
import { verifyToken } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

// Ruta de registro
router.post('/register', authController.register);

// Ruta de inicio de sesión
router.post('/login', authController.login);

// Ruta de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }));

// Callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);

// Ruta para cerrar sesión usando el ID del usuario
router.delete('/logout', verifyToken, authController.logout);

// Ruta para solicitar el restablecimiento de contraseña
router.post('/forgot-password', authController.forgotPassword);

// Ruta para restablecer la contraseña
router.post('/reset-password/:token', authController.resetPassword);

export default router;

