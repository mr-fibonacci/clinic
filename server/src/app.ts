import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import { redisSession } from './config/redis-config';

import { handleErrors } from './middlewares/handle-errors';
import authRouter from './routes/auth';

const app = express();

app.use(json());
app.use(redisSession);

app.get('/', (req: Request, res: Response) => {
  res.send('yay root route!');
});

app.use(authRouter);

app.use(handleErrors);

export default app;
