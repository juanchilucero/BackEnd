import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { comparePassword } from '../utils/authUtils.js';
import userModel from '../models/user.model.js';
import { config } from '../config/config.js';

// Configuración de la estrategia de autenticación local
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

    return done(null, user);
  } catch (error) {
    console.error('Error en estrategia local:', error);
    return done(error);
  }
}));

// Configuración de la estrategia de autenticación con Google
passport.use(new GoogleStrategy({
  clientID: config.googleClientId,  // Asegúrate de que esta variable esté correctamente configurada en .env
  clientSecret: config.googleClientSecret, // Asegúrate de que esta variable esté correctamente configurada en .env
  callbackURL: config.googleCallbackURL  // Asegúrate de que esta variable esté correctamente configurada en .env
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({ googleId: profile.id });
    if (!user) {
      const newUser = {
        email: profile.emails[0].value,
        nombre: profile.displayName,
        googleId: profile.id,
        tipo: "visitante"
      };
      user = await userModel.create(newUser);
    }
    return done(null, user);
  } catch (error) {
    console.error('Error en estrategia Google:', error);
    return done(error);
  }
}));

// Configuración de Jwt
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret // Asegúrate de que esta variable esté correctamente configurada en .env
}, async (jwtPayload, done) => {
  try {
    const user = await userModel.findById(jwtPayload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    console.error('Error en estrategia JWT:', err);
    return done(err);
  }
}));

// Serializar el usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar el usuario para recuperarlo de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return done(new Error('Usuario no encontrado'), null);
    }
    done(null, user);
  } catch (error) {
    console.error('Error al deserializar usuario:', error);
    done(error);
  }
});

export default passport;
