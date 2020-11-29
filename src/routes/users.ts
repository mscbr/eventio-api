import { Router } from 'express';
import { body } from 'express-validator';

import {
  getUsers,
  getUserById,
  // updateUser,
  // deleteUser,
  signup,
  login,
} from 'controllers/users';
import validateToken from 'middleware/validateToken';
import { objectKeys } from 'utils/validation/validators';

const router = Router();

router.post(
  '/signup',
  [
    body().custom(objectKeys(['firstName', 'lastName', 'password', 'email'])),
    body(['firstName', 'lastName']).not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim(),
    body('email').normalizeEmail().isEmail(),
  ],
  signup
);
router.post('/login', [body('email', 'password').not().isEmpty()], login);

// router.patch(
//   '/:userId',
//   [
//     body().custom(objectKeys(['firstName', 'lastName', 'password', 'email'])),
//     body('firstName').if(body('firstName').exists()).isString().trim(),
//     body('lastName').if(body('lastName').exists()).isString().trim(),
//     body('password').if(body('password').exists()).isLength({ min: 1 }),
//     body('email').if(body('email').exists()).normalizeEmail().isEmail(),
//   ],
//   updateUser
// );

// router.delete(':/userId', deleteUser);
router.use(validateToken);
router.get('/', getUsers);
router.get('/:userId', getUserById);

export default router;
