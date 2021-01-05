import request from 'supertest';
import app from '../../app';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { Patient } from '../../models/patient';
import { User } from '../../models/user';

describe('create patient', () => {
  it('provided with valid email and password, returns 201, user and patient created', async () => {
    await request(app)
      .post('/patients')
      .send({ email: 'patient@patient.com', password: 'password' })
      .expect(201);

    const [user, patient] = await Promise.all([
      User.findOne(),
      Patient.findOne()
    ]);

    if (!user) throw new ResourceNotFoundError('user');
    if (!patient) throw new ResourceNotFoundError('patient');
    expect(patient.UserId).toEqual(user.id);
  });
});

describe('delete patient', () => {
  beforeEach(async () => {
    await Patient.add({ email: 'patient@patient.com', password: 'password' });
  });

  it('deletes the patient and user (cascade)', async () => {
    await request(app).delete(`/patients/1`).expect(200);

    const [user, patient] = await Promise.all([
      User.findOne(),
      Patient.findOne()
    ]);

    expect(patient).toBeFalsy();
    expect(user).toBeFalsy();
  });
});
