import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { isValidPassword } from '../utils/hashPassword.js';  // Corregido para importar desde hashPassword.js
import { createToken } from '../utils/jwt.js';
import User from '../dao/models/users.js'; // Asegúrate de usar la ruta correcta

// Configuración de la estrategia de autenticación local
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        const isValid = await isValidPassword(password, user.password);
        if (!isValid) return done(null, false, { message: 'Contraseña incorrecta' });

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Configuración de la estrategia de autenticación con Google
passport.use(new GoogleStrategy({
    clientID: 'cliente id', // Reemplazar con tu Client ID de Google
    clientSecret: 'secreto', // Reemplazar con tu Client Secret de Google
    callbackURL: 'http://localhost:8080/api/session/google/callback' // Reemplazar con tu URL de callback
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            // Crear un nuevo usuario si no existe
            const newUser = {
                email: profile.emails[0].value,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                googleId: profile.id,
                role: 'user'
            };
            user = await User.create(newUser);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serializar el usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializar el usuario para recuperarlo de la sesión
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
