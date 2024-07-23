import userModel from '../models/user.model.js';

export const getUserByEmail = async (email) => {
    return await userModel.findOne({ email });
};

export const createUser = async (user) => {
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
};
