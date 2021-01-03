import { Request, Response, Router } from 'express';
import { requireLogin } from '../middlewares/require-login';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { User } from '../models/user';
import {
  authReqBody,
  validateEmail,
  validatePassword
} from '../validation-chains/auth-req.body';

const router = Router();

router.post(
  '/signup',
  ...validateRequestBody(authReqBody),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await User.signup(email, password);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.currentUser = { email };
    res.sendStatus(201);
  }
);

router.post(
  '/signin',
  ...validateRequestBody(authReqBody),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await User.signin(email, password);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.currentUser = { email };
    res.send(req.session);
  }
);

router.post('/signout', async (req: Request, res: Response) => {
  req.session?.destroy(() => {
    console.log('session destroyed');
  });
  res.send('signed out');
});

router.post(
  '/forgotpassword',
  ...validateRequestBody([validateEmail]),
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await User.sendForgotPasswordEmail(email);
    res.send('OK');
  }
);

router.post(
  '/resetpassword/:token',
  ...validateRequestBody([validatePassword]),
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    await User.resetPassword(token, password);

    res.send('OK');
  }
);

router.get('/protected', requireLogin, async (req: Request, res: Response) => {
  res.send('protected');
});

router.get('/users', async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.send(users);
});

export default router;
