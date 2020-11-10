import { Router } from 'express';

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  signup,
  login,
} from 'controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.post('/signup', signup);
router.post('/login', login);

router.patch('/:userId', updateUser);

router.delete(':/userId', deleteUser);

export default router;
