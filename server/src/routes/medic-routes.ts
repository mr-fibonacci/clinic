import { Request, Response, Router } from 'express';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { Medic } from '../entity/medic';
import { medicReqBody } from '../validation-chains/medic-req-body';
import { getRepository } from 'typeorm';

const router = Router();

router.post(
  '/',
  ...validateRequestBody(medicReqBody),
  async (req: Request, res: Response) => {
    const { email, password, image, type, shiftStart, shiftEnd } = req.body;
    await Medic.add({ email, password, image, type, shiftStart, shiftEnd });
    res.sendStatus(201);
  }
);

// router.put('/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await Medic.edit(id, req.body);
//   res.sendStatus(200);
// });

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Medic.remove(id);
  res.sendStatus(200);
});

// router.get('/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const medic = await Medic.findOne({ where: { id } });
//   if (!medic) throw new ResourceNotFoundError('medic');
//   res.send(medic);
// });

router.get('/', async (req: Request, res: Response) => {
  const medics = await getRepository(Medic).find({ relations: ['user'] });
  res.send(medics);
});

export default router;
