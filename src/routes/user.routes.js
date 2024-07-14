import express from 'express';
import { deleteUser, updateUser } from '../controllers/userController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.delete('/user/:id', isAdmin, deleteUser);
router.put('/user/:id', isAdmin, updateUser);

export default router;
