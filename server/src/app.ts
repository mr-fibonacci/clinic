import express, { json, NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import { redisSession } from './config/redis-config';

import authRouter from './routes/auth';

const app = express();

app.use(json());
app.use(redisSession);

app.get('/', (req: Request, res: Response) => {
  res.send('yay root route!');
});

app.use(authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

export default app;
