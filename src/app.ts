import 'dotenv/config';
// import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { errorMiddleware } from './middlewares/error-middleware';
import { login, createUser } from './controllers/users';
import { authMiddleware } from './middlewares/auth-middleware';
import { requestLogger, errorLogger } from './middlewares/logger-middleware';

const { PORT = 3000, MONGODB_URI } = process.env;
const app = express();

app.use(cookieParser());

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/mestodb');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
