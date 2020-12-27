import { Request, Response, Router } from 'express';
import { requireLogin } from '../middlewares/require-auth';
import { Patient } from '../models/patient';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Session {
      currentUser: {
        email: string;
      };
    }
  }
}

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  await Patient.signup(email, password);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  req.session!.currentUser = { email };
  res.send(req.body);
});

router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  await Patient.signin(email, password);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  req.session!.currentUser = { email };
  res.send(req.session);
});

router.post('/signout', async (req: Request, res: Response) => {
  req.session?.destroy(() => {
    console.log('sess destroyed');
  });
  res.send('signed out');
});

router.get('/protected', requireLogin, async (req: Request, res: Response) => {
  res.send('protected');
});

router.post('/changepass', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ where: { email } });
  if (!patient) throw new Error('patient not found');
  patient.setDataValue('password', password);
  await patient.save();
  res.send('OK');
});

router.get('/users', async (req: Request, res: Response) => {
  const patients = await Patient.findAll();
  res.send(patients);
});

export default router;
