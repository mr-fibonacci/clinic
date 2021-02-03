import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { Appointment } from '../entity/appointment';
import { Patient } from '../entity/patient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const patient = await Patient.add(req.body);
  const { email, id } = patient.user;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!req.session!.currentUser) req.session!.currentUser = { email, id };
  res.sendStatus(201);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const { id } = req.params;

  await Patient.edit(id, req.body, newPassword);
  res.sendStatus(200);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Patient.remove(id);
  res.sendStatus(200);
});

router.get('/appointments', async (req: Request, res: Response) => {
  const id = req.session?.currentUser?.id;
  const patientsAppointments = await getRepository(Appointment).find({
    relations: ['medic', 'patient'],
    where: { patient: { user: { id } } }
  });
  res.send(patientsAppointments);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = await getRepository(Patient).findOne({
    where: { user: { id } }
  });
  res.send(patient);
});

router.get('/', async (req: Request, res: Response) => {
  const patients = await getRepository(Patient).find({ relations: ['user'] });
  res.send(patients);
});

export default router;
