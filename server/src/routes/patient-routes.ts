import { Request, Response, Router } from 'express';
import { Patient } from '../models/patient';

const router = Router();

router.post('/patients', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  await Patient.add({ email, password });

  res.send('OK');
});

router.delete('/patients/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Patient.remove(id);
  res.send('OK');
});

router.get('/patients', async (req: Request, res: Response) => {
  const patients = await Patient.findAll();
  res.send(patients);
});

export default router;
