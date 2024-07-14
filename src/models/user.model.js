import mongoose from 'mongoose';

const userCollection = "user"

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['propietario', 'visitante'], default: 'visitante' }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;