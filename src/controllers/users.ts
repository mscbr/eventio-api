import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import { TCreateUser, User } from 'models/user';
import HttpError from 'models/httpError';
import { createTokens, refreshTokens } from 'utils/auth';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let users = [];
  try {
    users = await User.find();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  res.status(200).json(users.map((user) => user.toObject({ getters: true })));
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  if (user) return res.status(200).json(user.toObject({ getters: true }));
  next(new HttpError('User not found', 404));
};

// export const updateUser = (req: Request, res: Response, next: NextFunction) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return next(new HttpError('Invalid inputs', 422));

//   const { userId } = req.params;
//   const { body }: { body: TPatchUser } = req;

//   const targetUser = users.find((user) => user.id === userId);
//   if (!targetUser) return next(new HttpError('Event not found', 404));
//   if (!body) return next(new HttpError('Request body was not provided', 400));

//   users = users.map((user) =>
//     user.id === targetUser?.id
//       ? { ...targetUser, ...(body as TPatchUser) }
//       : user
//   );
//   res.status(200).json({ ...targetUser, ...(body as TPatchUser) });
// };

// export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
//   const { userId } = req.params;

//   const targetUser = users.find((user) => user.id === userId);
//   if (!targetUser) return next(new HttpError('Event not found', 404));

//   users = users.filter((user) => user.id !== targetUser.id);
//   res.status(200).json({ message: 'Deleted user' });
// };

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new HttpError('Invalid inputs', 422));

  const { firstName, lastName, email, password }: TCreateUser = req.body;
  const hashedPass = await bcrypt.hash(password, 12);

  const createdUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPass,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  res.status(201).json(createdUser.toObject({ getters: true }));
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new HttpError('Invalid inputs', 422));
  const { email, password, refreshToken: reqRefreshToken } = req.body;

  if (reqRefreshToken) {
    try {
      const {
        token: newToken,
        refreshToken: newRefreshToken,
        user: { id, email, firstName, lastName, createdAt, updatedAt },
      } = await refreshTokens(reqRefreshToken);

      res.set('Access-Control-Expose-Headers', 'Authorization, refresh-token');
      res.set('Authorization', newToken);
      res.set('refresh-token', newRefreshToken);

      req.userData = { id, email };
      return res
        .status(200)
        .json({ id, firstName, lastName, email, createdAt, updatedAt });
    } catch (err) {
      return next(
        new HttpError('Could not login with provided credentials', 401)
      );
    }
  }

  let user;
  try {
    user = await User.findOne({ email }, '+password');
  } catch (err) {
    return next(
      new HttpError('Could not login with provided credentials', 401)
    );
  }

  if (!user)
    return next(
      new HttpError('Could not login with provided credentials', 401)
    );

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword)
    return next(
      new HttpError('Could not login with provided credentials', 401)
    );

  const [token, refreshToken] = await createTokens(user);
  const { id, firstName, lastName, createdAt, updatedAt } = user;
  if (token && refreshToken) {
    res.set('Access-Control-Expose-Headers', 'Authorization, refresh-token');
    res.set('Authorization', token);
    res.set('refresh-token', refreshToken);
  }
  req.userData = { id, email };
  return res
    .status(200)
    .json({ id, firstName, lastName, email, createdAt, updatedAt });
};
