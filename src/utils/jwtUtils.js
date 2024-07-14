import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret';

export const createToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    throw new Error('Error al crear el token');
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
