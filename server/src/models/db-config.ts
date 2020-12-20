import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { patient } from './patient';
dotenv.config();

if (!process.env.DB_URL) throw new Error('DB_URL has to be defined!');

export const sequelize = new Sequelize(process.env.DB_URL, {
  pool: { max: 5, min: 0 },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

patient(sequelize);

sequelize.sync({ alter: true });
