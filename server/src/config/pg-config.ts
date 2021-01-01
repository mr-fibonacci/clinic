import { Sequelize } from 'sequelize';
import { user } from '../models/user';
import dotenv from 'dotenv';
import { appointment } from '../models/appointment';
import { medic } from '../models/medic';
import { patient } from '../models/patient';
import { secretary } from '../models/secretary';

dotenv.config();

const {
  POSTGRES_USER,
  PG_HOST,
  PG_DB_NAME,
  POSTGRES_PASSWORD,
  PG_PORT
} = process.env;

if (!POSTGRES_USER) throw new Error('PG_USER has to be defined!');
if (!PG_HOST) throw new Error('PG_HOST has to be defined!');
if (!PG_DB_NAME) throw new Error('PG_DB_NAME has to be defined!');
if (!POSTGRES_PASSWORD) throw new Error('PG_PASS has to be defined!');
if (!PG_PORT) throw new Error('PG_PORT has to be defined!');

export const sequelize = new Sequelize({
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: PG_DB_NAME,
  host: PG_HOST,
  port: +PG_PORT,
  pool: { max: 5, min: 0 },
  dialect: 'postgres'
  // dialectOptions: {
  // ssl: {
  //   require: false,
  //   rejectUnauthorized: false
  // }
  // }
});

appointment(sequelize);
medic(sequelize);
patient(sequelize);
secretary(sequelize);
user(sequelize);

sequelize.sync({ force: true });
