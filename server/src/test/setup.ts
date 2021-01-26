import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
// import { redisClient } from '../config/redis-config';

import app from '../app';
import { UserAttrs } from '../entity/user';

let connection: Connection;
beforeAll(async () => {
  connection = await createConnection();
});

beforeEach(async () => {
  await connection.synchronize(true);
});

afterAll(async () => {
  await connection.close();
});

export const signInCookie = async (userAttrs: UserAttrs): Promise<string> => {
  const { email, password } = userAttrs;

  const response = await request(app)
    .post('/users/signin')
    .send({ email, password })
    .expect(200);
  return response.get('Set-Cookie')[0];
};
