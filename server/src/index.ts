import app from './app';
import { sequelize } from './config/pg-config';

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('server connected to db successfully');
  } catch (err) {
    console.error('server startup interrupted', err);
  }
  app.listen(process.env.PORT, () => {
    console.log(`app running on port ${process.env.PORT}`);
  });
};

start();
