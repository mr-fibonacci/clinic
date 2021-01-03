import { Request, Response, Router } from 'express';
import { Medic } from '../models/medic';

const router = Router();

router.post('/medics', async (req: Request, res: Response) => {
  const { email, password, image, type, shiftStart, shiftEnd } = req.body;
  await Medic.add({ email, password, image, type, shiftStart, shiftEnd });

  res.send('OK');
});

router.put('/medics/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Medic.edit(id, req.body);
  res.send('OK');
});

router.delete('/medics/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Medic.remove(id);
  res.send('OK');
});

router.get('/medics', async (req: Request, res: Response) => {
  const medics = await Medic.findAll();
  res.send(medics);
});

export default router;
