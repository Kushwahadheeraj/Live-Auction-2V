import express from 'express';

//   import { generateToken } from '../utils.js';
import { getUser, getUsers, updateUser, updateAdminUser, deleteUser } from '../controllers/userControllers.js'

const router = express.Router();

router.put('/profile/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateAdminUser)
router.get('/', getUsers);
router.get('/:id', getUser);

export default router;