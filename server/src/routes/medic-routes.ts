import { Request, Response, Router } from 'express';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { Medic } from '../entity/medic';
import { medicReqBody } from '../validation-chains/medic-req-body';
import { getRepository } from 'typeorm';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

const router = Router();

router.post(
  '/',
  ...validateRequestBody(medicReqBody),
  async (req: Request, res: Response) => {
    const medic = await Medic.add(req.body);
    const { email, id } = medic.user;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!req.session!.currentUser) req.session!.currentUser = { email, id };
    res.sendStatus(201);
  }
);

router.put('/:id', async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const { id } = req.params;

  await Medic.edit(id, req.body, newPassword);
  res.sendStatus(200);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Medic.remove(id);
  res.sendStatus(200);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const medic = await getRepository(Medic).findOne({ where: { user: { id } } });
  if (!medic) throw new ResourceNotFoundError('medic');
  res.send(medic);
});

router.get('/', async (req: Request, res: Response) => {
  const medics = await getRepository(Medic).find({ relations: ['user'] });
  res.send(medics);
});

export default router;
