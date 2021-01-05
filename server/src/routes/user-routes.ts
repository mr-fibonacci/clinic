import { Request, Response, Router } from 'express';
import { requireLogin } from '../middlewares/require-login';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { User } from '../models/user';
import {
  userReqBody,
  validateEmail,
  validatePassword
} from '../validation-chains/user-req-body';

const router = Router();

router.post(
  '/signup',
  ...validateRequestBody(userReqBody),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { id } = await User.signup(email, password);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.currentUser = { email, id };
    res.sendStatus(201);
  }
);

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

router.get('/protected', requireLogin, async (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.get('/users', async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.send(users);
});

export default router;
