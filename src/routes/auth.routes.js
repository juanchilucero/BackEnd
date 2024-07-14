import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';

const router = express.Router();

// Ruta de registro
router.post('/register', authController.register);

// Ruta de inicio de sesión
router.post('/login', authController.login);

// Ruta de autenticación con Google
router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      session: false,
    }),
    authController.googleLogin
  );

// Callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);

export default router;