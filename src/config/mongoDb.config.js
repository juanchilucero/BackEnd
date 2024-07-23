import mongoose from 'mongoose';
import { config } from './config.js';

export const connectMongoDb = async () => {
    try {
        // Conexión a la base de datos
        await mongoose.connect(config.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};
