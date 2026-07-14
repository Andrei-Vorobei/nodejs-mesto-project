import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { SessionRequest } from '../types/types';

const { JWT_KEY = 'dev-secret-key' } = process.env;

export const authMiddleware = (req: SessionRequest, res: Response, next: NextFunction): void => {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }

  if (req.path === '/signin' || req.path === '/signup') {
    next();
    return;
  }

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_KEY);
    req.user = payload as { _id: string };
    next();
  } catch (err) {
    const error = new Error('Ошибка авторизации');
    next(error);
  }
};
