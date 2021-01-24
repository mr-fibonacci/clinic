import { createConnection } from 'typeorm';
import app from './app';
import './augmented-types';

const start = async () => {
  try {
    await createConnection();
    console.log('server connected to db successfully');
  } catch (err) {
    console.error('server startup interrupted', err);
  }
  app.listen(3000, () => {
    console.log(`app running on port ${3000}`);
  });
};

start();
