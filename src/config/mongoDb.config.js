import mongoose from 'mongoose';

const urlDb = 'mongodb+srv://juanchilucero:Milanesas2024@e-commerce.mzjqjcs.mongodb.net/?retryWrites=true&w=majority&appName=e-commerce';

export const connectMongoDb = async () => {
    try {
        // Conexión a la base de datos
        mongoose.connect(urlDb);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};