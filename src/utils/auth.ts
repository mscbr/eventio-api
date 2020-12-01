import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { User, IUser } from 'models/user';
import HttpError from 'models/httpError';
import { TTokenPayload } from 'types/token';
const { JWT_SECRET_KEY, JWT_SECRET_KEY_2 } = process.env;

export const createTokens = async (user: IUser) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'email']),
    },
    JWT_SECRET_KEY as string,
    {
      expiresIn: '1m',
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    JWT_SECRET_KEY_2 as string,
    {
      expiresIn: '7d',
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (refreshToken: string) => {
  let user;
  try {
    const {
      user: { id },
    } = (await jwt.verify(
      refreshToken,
      JWT_SECRET_KEY_2 as string
    )) as TTokenPayload;
    user = await User.findById(id);
  } catch (err) {
    throw new HttpError('Authentiation failed', 403);
  }
  if (!user) {
    throw new HttpError('Authentiation failed', 403);
  }

  const [newToken, newRefreshToken] = await createTokens(user);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};
