import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { Patient } from '../entity/patient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await Patient.add({ email, password });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  req.session!.currentUser = { email, id: user.id };
  res.sendStatus(201);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Patient.remove(id);
  res.sendStatus(200);
});

router.get('/', async (req: Request, res: Response) => {
  const patientRepo = getRepository(Patient);
  const patients = await patientRepo.find({ relations: ['user'] });
  res.send(patients);
});

export default router;
