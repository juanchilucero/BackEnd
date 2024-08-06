import mongoose from 'mongoose';
import faker from 'faker';

const mockingController = {
    generarMockTickets: async (req, res) => {
        try {
            const tickets = [];
            for (let i = 0; i < 50; i++) {
                const ticket = {
                    _id: mongoose.Types.ObjectId(),
                    cocheraId: mongoose.Types.ObjectId(),
                    propietarioId: mongoose.Types.ObjectId(),
                    fechaInicio: faker.date.past(),
                    fechaFin: faker.date.recent(),
                    precio: faker.commerce.price()
                };
                tickets.push(ticket);
            }
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default mockingController;
