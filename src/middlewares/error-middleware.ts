import { Request, Response, NextFunction } from 'express';

export class ServerError extends Error {
  statusCode: number = 500;

  constructor(message: string) {
    super(message);

    switch (message) {
      case 'Переданы некорректные данные при обновлении аватара':
      case 'Переданы некорректные данные при создании карточки':
      case 'Переданы некорректные данные при обновлении карточки':
      case 'Переданы некорректные данные при удалении карточки':
      case 'Переданы некорректные данные при обновлении профиля':
      case 'Переданы некорректные данные при получении пользователя':
      case 'Переданы некорректные данные при создании пользователя':
        this.statusCode = 400;
        break;
      case 'Необходима авторизация':
      case 'Ошибка авторизации':
      case 'Неправильные почта или пароль':
        this.statusCode = 401;
        break;
      case 'Нет прав для удаления карточки':
        this.statusCode = 403;
        break;
      case 'Карточка не найдена':
      case 'Пользователь не найден':
        this.statusCode = 404;
        break;
      case 'Ошибка при создании пользователя':
      case 'Ошибка при создании карточки':
        this.statusCode = 409;
        break;
      default:
        this.statusCode = 500;
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
