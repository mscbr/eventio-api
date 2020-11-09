import { Request, Response, NextFunction } from 'express';

import { IUser } from 'models/user';
import HttpError from 'models/httpError';
import { mockUsers } from 'utils/mockData/users';

const users: IUser[] = [...mockUsers];

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const targetUser = users.find((user) => user.id === userId);

  if (targetUser) return res.status(200).json(targetUser);
  next(new HttpError('User not found', 404));
};
