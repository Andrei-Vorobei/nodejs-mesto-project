import { Router } from 'express';

import {
  createUser, getAllUsers, getUserById, updateUserById, updateUserAvatar, getCurrentUser,
} from '../controllers/users';
import { userUpdateValidator, userAvatarValidator, userAuthValidator } from '../validators/user';

const router = Router();

router.get('/', getAllUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.post('/', userAuthValidator, createUser);

router.patch('/me', userUpdateValidator, updateUserById);

router.patch('/me/avatar', userAvatarValidator, updateUserAvatar);

export default router;
