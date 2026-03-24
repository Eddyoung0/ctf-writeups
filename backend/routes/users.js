import express from 'express';
import { deleteUser, getUsers } from '../Controller/usersController.js';

const router = express.Router();

router.get('/', getUsers);
router.delete('/:id', deleteUser);

export default router;
