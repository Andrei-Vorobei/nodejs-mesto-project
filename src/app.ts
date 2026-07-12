// import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { errorMiddleware } from './middlewares/errorMiddleware';

export interface SessionRequest extends Request {
  user?: {
    _id: string;
  };
}

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6a526ab71ea9d85f6ed39a60',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
