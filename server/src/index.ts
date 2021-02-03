import { createConnection } from 'typeorm';
import app from './app';
import './augmented-types';
import { Medic, MedicType } from './entity/medic';
import { Patient } from './entity/patient';

const seedFunc = () => {
  Medic.add({
    firstName: 'Peter',
    lastName: 'Killeen',
    email: 'peter@clinic.com',
    password: 'pass',
    image: 'https://custommedical.ie/file/2020/06/Peter-400x390.jpg',
    type: MedicType.doctor,
    shiftStart: 8,
    shiftEnd: 10
  });
  Medic.add({
    firstName: 'Pau',
    lastName: 'Castelli',
    email: 'drcastelli@clinic.com',
    password: 'pass',
    image: 'https://custommedical.ie/file/2020/05/Pau-400x390.jpg',
    type: MedicType.doctor,
    shiftStart: 11,
    shiftEnd: 13
  });
  Medic.add({
    firstName: 'Meabh',
    lastName: `O'Connell`,
    email: 'meabh@clinic.com',
    password: 'pass',
    image: 'https://custommedical.ie/file/2020/05/Meabh-400x390.jpg',
    type: MedicType.nurse,
    shiftStart: 12,
    shiftEnd: 15
  });

  Patient.add({
    firstName: 'Pat',
    lastName: 'McPatientFace',
    email: 'p@p.com',
    password: 'pass'
  });
};

const start = async () => {
  try {
    await createConnection();
    console.log('server connected to db successfully');
  } catch (err) {
    console.error('server startup interrupted', err);
  }
  app.listen(3000, () => {
    seedFunc();
    console.log(`app running on port ${3000}`);
  });
};

start();
