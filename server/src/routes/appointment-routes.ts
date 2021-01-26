import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Appointment } from '../entity/appointment';
import { Patient } from '../entity/patient';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { hasRole } from '../middlewares/has-role';

const router = Router();

// router.get('/medic/:MedicId', async (req: Request, res: Response) => {
//   const { MedicId } = req.params;
//   const appointments = await Appointment.findAll({
//     where: { MedicId, timestamp: { [Op.gt]: new Date() } }
//   });
//   res.send(appointments);
// });

router.post(
  '/book/:id',
  hasRole(Patient),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.session?.currentUser?.id;
    if (!userId) throw new NotAuthorizedError('Please log in');
    await Appointment.book(userId, id);
    res.sendStatus(201);
  }
);

router.post('/cancel/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.session?.currentUser?.id;
  if (!userId) throw new NotAuthorizedError('Please log in');
  await Appointment.cancel(userId, id);
  res.sendStatus(200);
});

router.get('/', async (req: Request, res: Response) => {
  const appointmentRepo = getRepository(Appointment);
  const appointments = await appointmentRepo.find({
    relations: ['medic', 'patient']
  });
  res.send(appointments);
});

// router.get('/append', async (req: Request, res: Response) => {
//   await Appointment.append();
//   const appointments = await Appointment.findAll();
//   res.send(appointments);
// });

export default router;
