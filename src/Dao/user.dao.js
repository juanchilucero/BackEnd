import userModel from '../models/user.model.js';

const userDao ={

    deleteUserById: async (id) => {
        return userModel.findByIdAndDelete(id);
    },

    updateUserById: async (id, updatedData) => {
        return userModel.findByIdAndUpdate(id, updatedData, { new: true });
    },

    getAllUsers: async () => {
        return userModel.find();
    },

    getUserById: async (id) => {
        return userModel.findById(id);
    }
}

export default userDao