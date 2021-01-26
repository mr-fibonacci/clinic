import request from 'supertest';
import app from '../../app';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { User } from '../../entity/user';
import { getRepository } from 'typeorm';

describe('/signup', () => {
  const url = '/users/signup';

  it('if req.body ok, returns 201, creates a user, creates a longer password, sets a cookie', async () => {
    const res = await request(app)
      .post(url)
      .send({ email: 'user@user.com', password: 'password' })
      .expect(201);

    const userRepo = getRepository(User);
    const user = await userRepo.findOne();
    if (!user) throw new ResourceNotFoundError('user');

    expect('password'.length).toBeLessThan(user.password.length);
    expect(res.get('Set-Cookie')).toBeDefined();
  });

  describe('returns 422 if anything wrong with credentials', () => {
    it('email invalid, empty or missing', async () => {
      await Promise.all([
        request(app)
          .post(url)
          .send({ email: 'whatever', password: 'valid' })
          .expect(422),
        request(app)
          .post(url)
          .send({ email: '', password: 'valid' })
          .expect(422),
        request(app).post(url).send({ password: 'valid' }).expect(422)
      ]);
    });

    it('password shorter than 4 characters or missing', async () => {
      await Promise.all([
        request(app)
          .post(url)
          .send({ email: 'user@user.com', password: 'yay' })
          .expect(422),
        request(app).post(url).send({ email: 'user@user.com' }).expect(422)
      ]);
    });

    it('email and password missing', async () => {
      await request(app).post(url).expect(422);
    });
  });

  describe('returns 401', () => {
    it('on duplicate emails', async () => {
      await request(app)
        .post(url)
        .send({ email: 'user@user.com', password: 'password' })
        .expect(201);
      await request(app)
        .post(url)
        .send({ email: 'user@user.com', password: 'password' })
        .expect(401);
    });
  });
});

describe('/signin', () => {
  const url = '/users/signin';
  beforeEach(async () => {
    await User.signup('user@user.com', 'password');
  });

  it('if req.body ok, returns 200 and sets a cookie', async () => {
    const res = await request(app)
      .post(url)
      .send({ email: 'user@user.com', password: 'password' })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });

  describe('returns 422 if anything wrong with credentials', () => {
    it('email invalid, empty or missing', async () => {
      await Promise.all([
        request(app)
          .post(url)
          .send({ email: 'whatever', password: 'valid' })
          .expect(422),
        request(app)
          .post(url)
          .send({ email: '', password: 'valid' })
          .expect(422),
        request(app).post(url).send({ password: 'valid' }).expect(422)
      ]);
    });

    it('password shorter than 4 characters or missing', async () => {
      await Promise.all([
        request(app)
          .post(url)
          .send({ email: 'user@user.com', password: 'yay' })
          .expect(422),
        request(app).post(url).send({ email: 'user@user.com' }).expect(422)
      ]);
    });

    it('email and password missing', async () => {
      await request(app).post(url).expect(422);
    });
  });

  describe('returns 401', () => {
    it('if user not in database', async () => {
      await request(app)
        .post(url)
        .send({ email: 'unknown@user.com', password: 'password' })
        .expect(401);
    });
  });
});

describe('/signout', () => {
  it('returns 200 and clears cookie', async () => {
    const res = await request(app).post('/users/signout').expect(200);
    expect(res.get('Set-Cookie')).toBeUndefined();
  });
});

describe('/forgotpassword', () => {
  const url = '/users/forgotpassword';
  beforeEach(async () => {
    await User.signup('user@user.com', 'password');
  });

  it('returns 401 if unknown email', async () => {
    await request(app)
      .post(url)
      .send({ email: 'unknown@user.com' })
      .expect(401);
  });

  it('returns 200, sets token and tokenExpires', async () => {
    await request(app).post(url).send({ email: 'user@user.com' }).expect(200);

    const userRepo = getRepository(User);
    const user = await userRepo.findOne();
    if (!user) throw new ResourceNotFoundError('user');

    expect(user.token).toBeDefined();
    expect(user.tokenExpires).toBeDefined();
  });
});

describe('/resetpassword/:token', () => {
  let token: string | null;

  beforeEach(async () => {
    await User.signup('user@user.com', 'password');
    await User.sendForgotPasswordEmail('user@user.com');

    const userRepo = getRepository(User);
    const user = await userRepo.findOne();

    if (!user?.token) throw new ResourceNotFoundError('user');
    token = user.token;
  });

  it('returns 200, resets token and tokenExpires fields, sets cookie', async () => {
    const res = await request(app)
      .post(`/users/resetpassword/${token}`)
      .send({ password: 'anewpass' })
      .expect(200);

    const userRepo = getRepository(User);
    const user = await userRepo.findOne();
    if (!user) throw new ResourceNotFoundError('user');

    expect(user.token).toBeFalsy();
    expect(user.tokenExpires).toBeFalsy();

    expect(res.get('Set-Cookie')).toBeDefined();
  });

  it('returns 422 if password shorter than 4 characters', async () => {
    await request(app)
      .post(`/users/resetpassword/${token}`)
      .send({ password: 'yay' })
      .expect(422);
  });
});
