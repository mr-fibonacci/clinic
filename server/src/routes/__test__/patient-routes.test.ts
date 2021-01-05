import request from 'supertest';
import app from '../../app';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { Patient } from '../../models/patient';
import { User } from '../../models/user';

describe('/patients', () => {
  it('provided with valid email and password, returns 200 and adds a corresponding patient to the Patient table', async () => {
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

describe('/patients:id', () => {
  beforeEach(async () => {
    await Patient.add({ email: 'patient@patient.com', password: 'password' });
  });
  it('deletes the patient and the user', async () => {
    await request(app).delete('/patient/1').expect(200);

    const [user, patient] = await Promise.all([
      User.findOne(),
      Patient.findOne()
    ]);
    expect(user).toBeFalsy();
    expect(patient).toBeFalsy();
  });
});
