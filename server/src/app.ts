import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import session from 'express-session';
import 'reflect-metadata';
// import { redisSession } from './config/redis-config';

import { handleErrors } from './middlewares/handle-errors';
import userRoutes from './routes/user-routes';
import medicRoutes from './routes/medic-routes';
import patientRoutes from './routes/patient-routes';
import appointmentRoutes from './routes/appointment-routes';

const app = express();

app.use(json());
app.use(
  session({
    secret: 'SESS_SECRET',
    resave: false,
    saveUninitialized: true,
    name: 'sid',
    cookie: {
      signed: true,
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from clinic API!');
});

app.use('/users', userRoutes);
app.use('/patients', patientRoutes);
app.use('/medics', medicRoutes);
app.use('/appointments', appointmentRoutes);

app.use(handleErrors);

export default app;
