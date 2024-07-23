import jwt from 'jsonwebtoken';
import Session from '../models/session.model.js';
import { config } from '../config/config.js';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.error('Authorization header is missing');
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.error('Token is missing');
        return res.status(401).json({ message: 'Token is missing' });
    }

    console.log('Token received:', token);

    // Verificar si el token está en la base de datos
    const session = await Session.findOne({ token });
    if (!session) {
        console.error('Sesión inválida o cerrada');
        return res.status(401).json({ message: 'Sesión inválida o cerrada' });
    }

    // Verificar el token JWT
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token inválido:', err);
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = decoded;
        next();
    });
};
