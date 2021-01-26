import request from 'supertest';
import app from '../../app';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { Patient } from '../../entity/patient';
import { User } from '../../entity/user';
import { getRepository } from 'typeorm';

describe('add patient', () => {
  it('provided with valid email and password, returns 201, user and patient created', async () => {
    await request(app)
      .post('/patients')
      .send({ email: 'patient@patient.com', password: 'password' })
      .expect(201);

    const userRepo = getRepository(User);
    const patientRepo = getRepository(Patient);
    const [user, patient] = await Promise.all([
      userRepo.findOne(),
      patientRepo.findOne({ relations: ['user'] })
    ]);

    if (!user) throw new ResourceNotFoundError('user');
    if (!patient) throw new ResourceNotFoundError('patient');
    expect(patient.user.id).toEqual(user.id);
  });
});

describe('remove patient', () => {
  beforeEach(async () => {
    await Patient.add({ email: 'patient@patient.com', password: 'password' });
  });

  it('deletes the patient and user (cascade)', async () => {
    const userRepo = getRepository(User);
    const patientRepo = getRepository(Patient);

    let [user, patient] = await Promise.all([
      userRepo.findOne(),
      patientRepo.findOne()
    ]);
    await request(app).delete(`/patients/${user?.id}`).expect(200);

    [user, patient] = await Promise.all([
      userRepo.findOne(),
      patientRepo.findOne()
    ]);

    expect(patient).toBeFalsy();
    expect(user).toBeFalsy();
  });
});
