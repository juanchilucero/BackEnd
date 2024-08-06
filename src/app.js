import express from 'express';
import { connectMongoDb } from './config/mongoDb.config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport.config.js';
import mockingRoutes from './routes/mocking.routes.js'; // Importamos las rutas de mocking
import errorHandler from './middlewares/errorHandler.js'; // Importamos el manejador de errores

const app = express();
const PORT = 8080;

connectMongoDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de sesión
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://juanchilucero:Milanesas2024@e-commerce.mzjqjcs.mongodb.net/?retryWrites=true&w=majority&appName=e-commerce",
        ttl: 15
    }),
    secret: "CodigoSecreto",
    resave: true,
    saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api", router);
app.use("/api", mockingRoutes); // Añadimos las rutas de mocking

// Manejador de errores
app.use(errorHandler); // Añadimos el middleware para manejar errores

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
