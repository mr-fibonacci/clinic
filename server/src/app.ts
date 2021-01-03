import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import { redisSession } from './config/redis-config';

import { handleErrors } from './middlewares/handle-errors';
import userRoutes from './routes/user-routes';
import medicRoutes from './routes/medic-routes';
import patientRoutes from './routes/patient-routes';
import appointmentRoutes from './routes/appointment-routes';

const app = express();

app.use(json());
app.use(redisSession);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from clinic API!');
});

app.use(userRoutes);
app.use(patientRoutes);
app.use(medicRoutes);
app.use('/appointments', appointmentRoutes);

app.use(handleErrors);

export default app;
