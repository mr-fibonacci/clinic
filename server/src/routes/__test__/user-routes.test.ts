import request from 'supertest';
import app from '../../app';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { User } from '../../models/user';

const login = {
  email: 'user@user.com',
  password: 'password'
};

describe('/signup...', () => {
  const url = '/signup';
  it('returns 201', async () => {
    const res = await request(app).post(url).send(login).expect(201);

    const user = await User.findOne({ raw: true });
    if (!user) throw new ResourceNotFoundError('user');

    expect(login.password.length).toBeLessThan(user?.password.length);
  });
});
