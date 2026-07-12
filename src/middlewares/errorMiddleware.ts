import { Request, Response, NextFunction } from 'express';

export class ServerError extends Error {
  statusCode: number = 500;

  constructor(message: string) {
    super(message);

    if (
      message === 'Ошибка при создании карточки'
      || message === 'Ошибка при создании пользователя'
      || message === 'Переданы некорректные данные при создании карточки'
      || message === 'Переданы некорректные данные при обновлении профиля'
      || message === 'Переданы некорректные данные при обновлении аватара'
      || message === 'Переданы некорректные данные при обновлении карточки'
      || message === 'Переданы некорректные данные при получении пользователя'
      || message === 'Переданы некорректные данные при удалении карточки'
    ) {
      this.statusCode = 400;
    }

    if (message === 'Карточка не найдена' || message === 'Пользователь не найден') {
      this.statusCode = 404;
    }
  }
}

export const errorMiddleware = (
  err: ServerError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new ServerError(err.message);
  res.status(error.statusCode).json({ message: err.message });
  next();
};
