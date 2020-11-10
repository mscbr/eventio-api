import { Request, Response, NextFunction } from 'express';

import { IUser, TCreateUser, TPatchUser } from 'models/user';
import HttpError from 'models/httpError';
import { mockUsers } from 'utils/mockData/users';

let users: IUser[] = [...mockUsers];

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json(users);
};

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

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { body }: { body: TPatchUser } = req;

  const targetUser = users.find((user) => user.id === userId);
  if (!targetUser) return next(new HttpError('Event not found', 404));
  if (!body) return next(new HttpError('Request body was not provided', 400));

  users = users.map((user) =>
    user.id === targetUser?.id
      ? { ...targetUser, ...(body as TPatchUser) }
      : user
  );
  res.status(200).json({ ...targetUser, ...(body as TPatchUser) });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const targetUser = users.find((user) => user.id === userId);
  if (!targetUser) return next(new HttpError('Event not found', 404));

  users = users.filter((user) => user.id !== targetUser.id);
  res.status(200).json({ message: 'Deleted user' });
};

export const signup = (req: Request, res: Response) => {
  const { firstName, lastName, email, password }: TCreateUser = req.body;
  const createdUser: IUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    password,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(createdUser);

  res.status(201).json(createdUser);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const identifiedUser = users.find(
    (u) => u.email === email && u.password === password
  );
  if (identifiedUser) return res.status(200).json(identifiedUser);
  next(new HttpError('Could not login with provided credentials', 401));
};
