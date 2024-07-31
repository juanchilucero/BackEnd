// src/models/ticket.model.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    cocheraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cochera', required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehiculo: { type: String },
    estado: { type: String, enum: ['en curso', 'finalizada'], default: 'en curso' },
    tiempoInicio: { type: Date, required: true },
    tiempoFin: { type: Date },
    costo: { type: Number }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;

