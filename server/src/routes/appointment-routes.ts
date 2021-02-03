import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Appointment } from '../entity/appointment';
import { Patient } from '../entity/patient';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { isAdminOr } from '../middlewares/is-admin-or';

const router = Router();

// router.get('/medic/:MedicId', async (req: Request, res: Response) => {
//   const { MedicId } = req.params;
//   const appointments = await Appointment.findAll({
//     where: { MedicId, timestamp: { [Op.gt]: new Date() } }
//   });
//   res.send(appointments);
// });

router.patch(
  '/book/:id',
  isAdminOr([Patient]),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.session?.currentUser?.id;
    if (!userId) throw new NotAuthorizedError('Please log in');
    await Appointment.book(userId, id);
    res.sendStatus(201);
  }
);

router.patch('/cancel/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.session?.currentUser?.id;
  if (!userId) throw new NotAuthorizedError('Please log in');
  await Appointment.cancel(userId, id);
  res.sendStatus(200);
});

router.get('/', async (req: Request, res: Response) => {
  const appointments = await getRepository(Appointment).find({
    relations: ['medic', 'patient']
  });
  res.send(appointments);
});

router.get('/active', async (req: Request, res: Response) => {
  const activeAppointments = await getRepository(Appointment).find({
    where: { patient: null },
    relations: ['medic', 'patient']
  });
  res.send(activeAppointments);
});

export default router;
