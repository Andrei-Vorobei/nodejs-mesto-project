import { Router } from 'express';
import {
  createUser, getAllUsers, getUserById, updateUserById, updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getAllUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUserById);

router.patch('/me/avatar', updateUserAvatar);

export default router;
