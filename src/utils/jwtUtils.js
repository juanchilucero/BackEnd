import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Asegúrate de usar una clave secreta segura

// Crear un token sin expiración (indefinido)
export const createToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET); // No se especifica 'expiresIn', por lo que el token no tiene expiración por defecto
  } catch (error) {
    throw new Error('Error al crear el token');
  }
};

