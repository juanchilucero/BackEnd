import { Router } from 'express';
import passport from '../config/passport.config.js'; // Asegúrate de usar la ruta correcta

const router = Router();

// Ruta de registro local
router.post('/register', passport.authenticate('register'), (req, res) => {
    res.status(201).json({ status: 'success', msg: 'Usuario creado' });
});

// Ruta de inicio de sesión local
router.post('/login', passport.authenticate('login'), (req, res) => {
    res.status(200).json({ status: 'success', payload: req.user });
});

// Ruta de autenticación con Google
router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] // Define los alcances que necesites
}));

// Ruta de callback de autenticación con Google
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/api/products', // Redirige a la página de inicio después de iniciar sesión
    failureRedirect: '/api/session/login' // Redirige a la página de inicio de sesión en caso de error
}));

// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ status: 'success', msg: 'Sesión cerrada exitosamente' });
});

export default router;
