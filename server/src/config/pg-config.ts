import { Sequelize } from 'sequelize';
import { patient } from '../models/patient';
import dotenv from 'dotenv';

dotenv.config();

const { PG_USER, PG_HOST, PG_DB_NAME, PG_PASS, PG_PORT } = process.env;

if (!PG_USER) throw new Error('PG_USER has to be defined!');
if (!PG_HOST) throw new Error('PG_HOST has to be defined!');
if (!PG_DB_NAME) throw new Error('PG_DB_NAME has to be defined!');
if (!PG_PASS) throw new Error('PG_PASS has to be defined!');
if (!PG_PORT) throw new Error('PG_PORT has to be defined!');

export const sequelize = new Sequelize({
  username: PG_USER,
  password: PG_PASS,
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

patient(sequelize);

sequelize.sync({ force: true });
