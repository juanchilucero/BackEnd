import User from '../models/users.js';
import { createHash, isValidPassword, createToken } from '../utils/hashJwt.js'; // Asegúrate de usar la ruta correcta

// Obtener todos los usuarios
const getAll = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error(`Error obteniendo todos los usuarios: ${error.message}`);
    }
};

// Obtener un usuario por ID
const getById = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    } catch (error) {
        throw new Error(`Error obteniendo usuario por ID: ${error.message}`);
    }
};

// Obtener un usuario por correo electrónico
const getByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new Error(`Error obteniendo usuario por email: ${error.message}`);
    }
};

// Crear un nuevo usuario
const create = async (data) => {
    try {
        // Hasheamos la contraseña antes de guardarla en la base de datos
        const hashedPassword = createHash(data.password);
        data.password = hashedPassword;

        const user = new User(data);
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Error creando usuario: ${error.message}`);
    }
};

// Actualizar un usuario
const update = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    } catch (error) {
        throw new Error(`Error actualizando usuario: ${error.message}`);
    }
};

// Eliminar un usuario
const deleteOne = async (id) => {
    try {
        const result = await User.deleteOne({ _id: id });
        if (result.deletedCount === 0) throw new Error('Usuario no encontrado');
        return true;
    } catch (error) {
        throw new Error(`Error eliminando usuario: ${error.message}`);
    }
};

// Verificar la contraseña del usuario
const verifyPassword = async (inputPassword, userPassword) => {
    return isValidPassword(inputPassword, userPassword);
};

export default {
    getAll,
    getById,
    create,
    update,
    deleteOne,
    getByEmail,
    verifyPassword
};
