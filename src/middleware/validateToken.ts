import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { refreshTokens } from 'utils/auth';
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
    const {
      user: { id, email },
    } = (await jwt.verify(token, JWT_SECRET_KEY as string)) as TTokenPayload;
    req.userData = { id, email };
  } catch (err) {
    const refreshToken = req.headers['refresh-token'];
    if (!refreshToken) return next(new HttpError('Authentiation failed', 403));

    try {
      const {
        token: newToken,
        refreshToken: newRefreshToken,
        user: { id, email },
      } = await refreshTokens(refreshToken as string);

      if (newToken && newRefreshToken) {
        res.set(
          'Access-Control-Expose-Headers',
          'Authorization, refresh-token'
        );
        res.set('Authorization', newToken);
        res.set('refresh-token', newRefreshToken);
      }
      req.userData = { id, email };
    } catch {
      return next(new HttpError('Authentiation failed', 403));
    }
  }
  next();
};

export default validateToken;
