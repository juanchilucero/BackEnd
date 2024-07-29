import jwt from 'jsonwebtoken';
import Session from '../models/session.model.js';
import { config } from '../config/config.js';
import passport from 'passport';

export const verifyToken = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const session = await Session.findOne({ token });

        if (!session) {
            return res.status(401).json({ message: 'Sesión inválida o cerrada' });
        }

        req.user = user;
        next();
    })(req, res, next);
};

