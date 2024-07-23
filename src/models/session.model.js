// models/session.model.js
import mongoose from 'mongoose';

const sessionCollection = "session"

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model(sessionCollection, sessionSchema);
export default Session;
