import express, { Request, Response } from 'express';
import { redisSession } from './config/redis-config';

const app = express();

app.use(redisSession);

app.get('/', (req: Request, res: Response) => {
  res.send('yay root route!');
});

export default app;
