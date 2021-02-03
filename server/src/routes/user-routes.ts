import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/user';
import { ownsResource } from '../middlewares/owns-resource';
import { validateRequestBody } from '../middlewares/validate-request-body';
import {
  userReqBody,
  validateEmail,
  validatePassword
} from '../validation-chains/user-req-body';

const router = Router();

router.post(
  '/signin',
  ...validateRequestBody(userReqBody),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { id } = await User.signin(email, password);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.currentUser = { email, id };
    res.sendStatus(200);
  }
);

router.post('/signout', async (req: Request, res: Response) => {
  req.session?.destroy(() => {
    console.log('session destroyed');
  });
  res.sendStatus(200);
});

router.get('/currentuser', async (req: Request, res: Response) => {
  console.log('currentUser:', req.session?.currentUser);
  res.send(req.session?.currentUser);
});

router.get('/:id', ownsResource(User), async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getRepository(User).findOne({
    where: { id },
    relations: ['patient', 'medic', 'secretary']
  });
  res.send(user);
});

router.post(
  '/forgotpassword',
  ...validateRequestBody([validateEmail]),
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await User.sendForgotPasswordEmail(email);
    res.sendStatus(200);
  }
);

router.post(
  '/resetpassword/:token',
  ...validateRequestBody([validatePassword]),
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    await User.resetPassword(token, password);
    res.sendStatus(200);
  }
);

router.get('/', async (req: Request, res: Response) => {
  const users = await getRepository(User).find({
    relations: ['patient', 'medic', 'secretary']
  });
  res.send(users);
});

export default router;
