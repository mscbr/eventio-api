import { Router, Request, Response, NextFunction } from 'express';

import { getUserById } from 'controllers/users';

import { IUser } from 'models/user';
import { mockUsers } from 'utils/mockData/users';

const users: IUser[] = [...mockUsers];

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(users);
});

router.get('/:userId', getUserById);

export default router;
