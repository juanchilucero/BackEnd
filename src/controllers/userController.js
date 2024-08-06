import userDao from '../Dao/user.dao.js';
import { UserUpdateDTO } from '../Dto/user.dto.js';

const userController = {
  deleteUser: async (req, res, next) => {
    const userId = req.params.id;
    try {
      const deletedUser = await userDao.deleteUserById(userId);
      if (!deletedUser) {
        const error = new Error('USER_NOT_FOUND');
        return next(error);
      }
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    const userId = req.params.id;
    const { first_name, last_name, email, password, role, googleId } = req.body;
    try {
      const userDto = new UserUpdateDTO(first_name, last_name, email, password, role, googleId);
      const updatedUser = await userDao.updateUserById(userId, userDto);
      if (!updatedUser) {
        const error = new Error('USER_NOT_FOUND');
        return next(error);
      }
      res.status(200).json({ message: 'Usuario actualizado correctamente', user: updatedUser });
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await userDao.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await userDao.getUserById(id);
      if (!user) {
        const error = new Error('USER_NOT_FOUND');
        return next(error);
      }
      res.status(200).json(user);
    } catch (error) {
      error.code = 'INTERNAL_SERVER_ERROR';
      next(error);
    }
  }
};

export default userController;

