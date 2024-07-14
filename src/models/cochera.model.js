import mongoose from 'mongoose';

const cocheraCollection = "cochera";

const CocheraSchema = new mongoose.Schema({
    numero: { type: Number, required: true, unique: true },
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    estado: { type: String, enum: ['ocupado', 'desocupado'], default: 'desocupado' },
    ocupaciones: [{
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        vehiculo: { type: String },
        tiempoInicio: { type: Date },
        tiempoFin: { type: Date },
        costo: { type: Number }
    }]
}, {
    timestamps: true // Esto agregará createdAt y updatedAt automáticamente
});

CocheraSchema.pre('save', function (next) {
    // Validación adicional o lógica antes de guardar
    if (this.ocupaciones.some(ocupacion => !ocupacion.tiempoFin && this.estado === 'desocupado')) {
        return next(new Error('No puede haber ocupaciones sin tiempo de finalización si la cochera está desocupada.'));
    }
    next();
});

export const cocheraModel = mongoose.model(cocheraCollection, CocheraSchema);
