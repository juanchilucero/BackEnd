import userModel from '../models/user.model.js';
import { hashPassword } from '../utils/authUtils.js';
import { createToken } from '../utils/jwtUtils.js';

const authController = { 
  register: async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const hashedPassword = await hashPassword(password);
      const newUser = new userModel({ first_name, last_name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ message: info ? info.message : 'Inicio de sesión fallido', user });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        const token = createToken({ id: user.id });
        return res.json({ user, token });
      });
    })(req, res, next);
  },

  googleCallback: (req, res) => {
    const token = createToken({ id: req.user.id });
    res.redirect(`/?token=${token}`);
  },

  googleLogin: async (req, res) => {
    try {
      return res.status(200).json({ status: 'success', payload: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
    }
  },
};

export default authController;
