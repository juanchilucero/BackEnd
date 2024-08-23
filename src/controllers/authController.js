import userModel from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/authUtils.js';
import { createToken } from '../utils/jwtUtils.js';
import passport from 'passport';
import { config } from '../config/config.js';
import sessionDao from '../Dao/session.dao.js'; // Importar el DAO
import { CreateSessionDTO, DeleteSessionDTO } from '../Dto/session.dto.js'; // Importar los DTOs
import { UserCreateDTO } from '../Dto/user.dto.js'; // Importar UserCreateDTO
import { sendPasswordResetEmail } from '../utils/emailUtils.js'; // Importar la utilidad de envío de correos
import crypto from 'crypto';

const authController = { 
  // Registro de un nuevo usuario
  register: async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      // Crear el DTO para el nuevo usuario
      const userDto = new UserCreateDTO(first_name, last_name, email, password);

      const existingUser = await userModel.findOne({ email: userDto.email });
      if (existingUser) {
        const error = new Error('USER_ALREADY_EXISTS');
        return next(error);
      }
      
      const hashedPassword = await hashPassword(userDto.password);
      const newUser = new userModel({
        first_name: userDto.first_name,
        last_name: userDto.last_name,
        email: userDto.email,
        password: hashedPassword
      });
      
      await newUser.save();
      res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  },

  // Inicio de sesión
  login: async (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
      if (err || !user) {
        const error = new Error(info ? info.message : 'LOGIN_FAILED');
        return next(error);
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
  googleCallback: async (req, res, next) => {
    try {
      const token = createToken({ id: req.user.id, role: req.user.role });

      // Crear el DTO para la sesión
      const createSessionDto = new CreateSessionDTO(req.user.id, token);

      // Guardar la sesión en la base de datos usando el DAO
      await sessionDao.createSession(createSessionDto.userId, createSessionDto.token);

      res.redirect(`/?token=${token}`);
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  },

  // Inicio de sesión con Google
  googleLogin: async (req, res, next) => {
    try {
      // Devolver la información del usuario después de un inicio de sesión exitoso con Google
      return res.status(200).json({ status: 'success', payload: req.user });
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  },

  // Eliminar sesión
  logout: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        const error = new Error('TOKEN_REQUIRED');
        return next(error);
      }

      // Crear el DTO para eliminar la sesión
      const deleteSessionDto = new DeleteSessionDTO(token);

      // Eliminar la sesión usando el DAO
      const session = await sessionDao.deleteSessionByToken(deleteSessionDto.token);
      if (!session) {
        const error = new Error('SESSION_NOT_FOUND');
        return next(error);
      }

      res.status(200).json({ message: 'Sesión cerrada con éxito' });
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  },
      // Solicitar restablecimiento de contraseña
      forgotPassword: async (req, res, next) => {
        const { email } = req.body;
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                const error = new Error('USER_NOT_FOUND');
                return next(error);
            }

            // Generar un token de restablecimiento de contraseña
            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpires = Date.now() + 3600000; // 1 hora

            // Guardar el token y la fecha de expiración en el usuario
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpires;
            await user.save();

            // Enviar correo electrónico con el token de restablecimiento
            await sendPasswordResetEmail(email, resetToken);

            res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado' });
        } catch (error) {
            error.code = 'INTERNAL_SERVER_ERROR';
            next(error);
        }
    },

    // Restablecer contraseña
    resetPassword: async (req, res, next) => {
        const { token } = req.params;
        const { password } = req.body;
        try {
            const user = await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() } // Verificar si el token no ha expirado
            });

            if (!user) {
                const error = new Error('INVALID_OR_EXPIRED_TOKEN');
                return next(error);
            }

            // Actualizar la contraseña del usuario
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Contraseña restablecida correctamente' });
        } catch (error) {
            error.code = 'INTERNAL_SERVER_ERROR';
            next(error);
        }
    }
  
};

export default authController;



