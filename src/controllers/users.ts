import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/user';
import type { SessionRequest } from '../types/types';

const { JWT_KEY = 'dev-secret-key' } = process.env;

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    if (!users) {
      throw new Error('Пользователи не найдены');
    }
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.userId) {
      throw new Error('Переданы некорректные данные при получении пользователя');
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      throw new Error('Переданы некорректные данные при создании пользователя');
    }
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ password: passwordHash, email });
      const token = jwt.sign({ _id: newUser._id }, JWT_KEY, { expiresIn: '7d' });
      res.status(201).cookie('token', token, { httpOnly: true }).json({ data: newUser });
    } catch (error) {
      throw new Error('Ошибка при создании пользователя');
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    if (name === undefined && about === undefined && avatar === undefined) {
      throw new Error('Переданы некорректные данные при обновлении профиля');
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about, avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new Error('Пользователь не найден');
    }
    res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    if (avatar === undefined) {
      throw new Error('Переданы некорректные данные при обновлении аватара');
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new Error('Пользователь не найден');
    }
    res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Неправильные почта или пароль');
    }
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      throw new Error('Неправильные почта или пароль');
    }
    const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
    res.status(200).cookie('token', token, { httpOnly: true }).json({ message: 'Угадал', user, token });
  } catch (error) {
    next(error);
  }
};
