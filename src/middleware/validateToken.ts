import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import HttpError from 'models/httpError';
import { TTokenPayload } from 'types/token';
const { JWT_SECRET_KEY } = process.env;

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization');
  if (!token) return next(new HttpError('Access denided', 401));

  try {
    const { id, email } = (await jwt.verify(
      token,
      JWT_SECRET_KEY as string
    )) as TTokenPayload;
    req.userData = { id, email };
    next();
  } catch (err) {
    return next(new HttpError('Authentiation failed', 403));
  }
};

export default validateToken;
