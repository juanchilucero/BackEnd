import userModel from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/authUtils.js';
import { createToken } from '../utils/jwtUtils.js';
import passport from 'passport';
import { config } from '../config/config.js';
import sessionDao from '../Dao/session.dao.js'; // Importar el DAO
import { CreateSessionDTO, DeleteSessionDTO } from '../Dto/session.dto.js'; // Importar los DTOs

const authController = { 
  // Registro de un nuevo usuario
  register: async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
      const hashedPassword = await hashPassword(password);
      const newUser = new userModel({ first_name, last_name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  },

  // Inicio de sesión
  login: async (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ message: info ? info.message : 'Inicio de sesión fallido', user });
      }

      // Verificar si el usuario es el administrador usando las credenciales del .env
      if (user.email === config.adminEmail && comparePassword(req.body.password, config.adminPassword)) {
        // Generar un token JWT para el administrador
        const token = createToken({ id: user.id, role: 'admin' });

        // Crear el DTO para la sesión
        const createSessionDto = new CreateSessionDTO(user.id, token);

        // Guardar la sesión en la base de datos usando el DAO
        await sessionDao.createSession(createSessionDto.userId, createSessionDto.token);

        return res.json({ user, token });
      }

      // Para usuarios normales, generar un token JWT
      const token = createToken({ id: user.id, role: user.role });

      // Crear el DTO para la sesión
      const createSessionDto = new CreateSessionDTO(user.id, token);

      // Guardar la sesión en la base de datos usando el DAO
      await sessionDao.createSession(createSessionDto.userId, createSessionDto.token);

      return res.json({ user, token });
    })(req, res, next);
  },

  // Callback de Google
  googleCallback: async (req, res) => {
    const token = createToken({ id: req.user.id, role: req.user.role });

    // Crear el DTO para la sesión
    const createSessionDto = new CreateSessionDTO(req.user.id, token);

    // Guardar la sesión en la base de datos usando el DAO
    await sessionDao.createSession(createSessionDto.userId, createSessionDto.token);

    res.redirect(`/?token=${token}`);
  },

  // Inicio de sesión con Google
  googleLogin: async (req, res) => {
    try {
      // Devolver la información del usuario después de un inicio de sesión exitoso con Google
      return res.status(200).json({ status: 'success', payload: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
  },

  // Eliminar sesión
  logout: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(400).json({ message: 'Token requerido' });
      }

      // Crear el DTO para eliminar la sesión
      const deleteSessionDto = new DeleteSessionDTO(token);

      // Eliminar la sesión usando el DAO
      const session = await sessionDao.deleteSessionByToken(deleteSessionDto.token);
      if (!session) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }

      res.status(200).json({ message: 'Sesión cerrada con éxito' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default authController;


