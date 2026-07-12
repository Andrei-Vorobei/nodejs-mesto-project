import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import type { SessionRequest } from '../app';

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

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    try {
      const newUser = await User.create({ name, about, avatar });
      res.status(201).json({ data: newUser });
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
