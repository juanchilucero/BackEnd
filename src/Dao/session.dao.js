// src/dao/session.dao.js
import Session from '../models/session.model.js';
import { CreateSessionDTO, DeleteSessionDTO } from '../Dto/session.dto.js';

const sessionDao = {
  createSession: async (userId, token) => {
    const sessionDto = new CreateSessionDTO(userId, token);
    const session = new Session(sessionDto);
    return await session.save();
  },

  findSessionByToken: async (token) => {
    return await Session.findOne({ token });
  },

  deleteSessionByToken: async (token) => {
    const deleteSessionDto = new DeleteSessionDTO(token);
    return await Session.findOneAndDelete(deleteSessionDto);
  }
};

export default sessionDao;

