import express from 'express';
import { getUserById, getAllUsers, createUser, deleteUser } from '../services/User.js';

const router = express.Router();

router.get('/user/:id', getUserById);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

export default router;