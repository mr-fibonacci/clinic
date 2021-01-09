import request from 'supertest';
import { Sequelize } from 'sequelize';
import { redisClient } from '../config/redis-config';
import { appointment } from '../models/appointment';
import { medic } from '../models/medic';
import { patient } from '../models/patient';
import { secretary } from '../models/secretary';
import { user } from '../models/user';
import app from '../app';

const sequelize = new Sequelize(
  'postgres://postgres:pass@localhost:5432/postgres',
  { logging: false }
);

beforeAll(async () => {
  await sequelize.authenticate();
  appointment(sequelize);
  medic(sequelize);
  patient(sequelize);
  secretary(sequelize);
  user(sequelize);
});

beforeEach(async () => {
  appointment(sequelize);
  medic(sequelize);
  patient(sequelize);
  secretary(sequelize);
  user(sequelize);
  await Promise.all([sequelize.sync({ force: true }), redisClient.flushall()]);
});

afterAll(async () => {
  await Promise.all([sequelize.close(), redisClient.quit()]);
});

export const signInCookie = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await request(app)
    .post('/users/signin')
    .send({ email, password })
    .expect(200);
  return response.get('Set-Cookie')[0];
};
