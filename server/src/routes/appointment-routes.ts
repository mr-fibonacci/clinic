import { Router, Request, Response } from 'express';
import { Appointment } from '../models/appointment';
import { Op } from 'sequelize';
import { NotAuthorizedError } from '../errors/not-authorized-error';

const router = Router();

router.get('/medic/:MedicId', async (req: Request, res: Response) => {
  const { MedicId } = req.params;
  const appointments = await Appointment.findAll({
    where: { MedicId, timestamp: { [Op.gt]: new Date() } }
  });
  res.send(appointments);
});

router.post('/book/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const UserId = req.session?.currentUser?.id;
  if (!UserId) throw new NotAuthorizedError('Please log in');
  await Appointment.book(UserId, id);
  res.sendStatus(201);
});

router.post('/cancel/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const UserId = req.session?.currentUser?.id;
  if (!UserId) throw new NotAuthorizedError('Please log in');
  await Appointment.cancel(UserId, id);
  res.sendStatus(200);
});

router.get('/initialize', async (req: Request, res: Response) => {
  await Appointment.initialize();
  const appointments = await Appointment.findAll();
  res.send(appointments);
});

router.get('/append', async (req: Request, res: Response) => {
  await Appointment.append();
  const appointments = await Appointment.findAll();
  res.send(appointments);
});

export default router;
