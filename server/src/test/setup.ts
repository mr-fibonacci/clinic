import { Sequelize } from 'sequelize';
import { redisClient } from '../config/redis-config';
import { appointment } from '../models/appointment';
import { medic } from '../models/medic';
import { patient } from '../models/patient';
import { secretary } from '../models/secretary';
import { user } from '../models/user';

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
  await Promise.all([sequelize.sync({ force: true }), redisClient.flushall()]);
});

afterAll(async () => {
  await Promise.all([sequelize.close(), redisClient.quit()]);
});
