// src/models/ticket.model.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cocheraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cochera', required: true },
    tiempoInicio: { type: Date, required: true },
    tiempoFin: { type: Date },
    costo: { type: Number, required: true },
    estado: { type: String, enum: ['activo', 'finalizado'], default: 'activo' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
