// src/models/cochera.model.js
import mongoose from 'mongoose';

const cocheraCollection = "cochera";

const CocheraSchema = new mongoose.Schema({
    numero: { type: Number, required: true, unique: true },
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    estado: { type: String, enum: ['disponible', 'ocupado', 'desocupado', 'no-disponible'], default: 'desocupado' },
    ocupaciones: [{
        tid: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
    }]
}, {
    timestamps: true // Esto agregará createdAt y updatedAt automáticamente
});

CocheraSchema.pre('save', function (next) {
    // Validación adicional o lógica antes de guardar
    if (this.ocupaciones.some(ocupacion => !ocupacion.tid && this.estado === 'desocupado')) {
        return next(new Error('No puede haber ocupaciones sin ticket si la cochera está desocupada.'));
    }
    next();
});

export const cocheraModel = mongoose.model(cocheraCollection, CocheraSchema);

