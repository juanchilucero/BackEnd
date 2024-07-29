import userDao from '../Dao/user.dao.js';
import { UserCreateDTO, UserUpdateDTO } from '../Dto/user.dto.js';

const userController = {
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await userDao.deleteUserById(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, password, role, googleId } = req.body;
    try {
      const userDto = new UserUpdateDTO(first_name, last_name, email, password, role, googleId);
      const updatedUser = await userDao.updateUserById(userId, userDto);
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario actualizado correctamente', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userDao.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userDao.getUserById(id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default userController;
