import request from 'supertest';
import app from '../../app';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { Appointment } from '../../models/appointment';
import { Medic, MedicType } from '../../models/medic';
import { Patient } from '../../models/patient';
import { signInCookie } from '../../test/setup';

describe('get medic appointments', () => {
  beforeEach(async () => {
    await Medic.add({
      email: 'medic@medic.com',
      password: 'password',
      image: 'yay an image!',
      type: MedicType.doctor,
      shiftStart: 11,
      shiftEnd: 13
    });
    await Appointment.initialize();
  });
  it(`returns 200 and can fetch more than 20 doctor's appointments`, async () => {
    const { body } = await request(app)
      .get('/appointments/medic/1')
      .expect(200);

    expect(body.length).not.toBeLessThan(20);
  });
});

describe('booking and cancelling an appointment', () => {
  let cookie: string;
  beforeEach(async () => {
    await Patient.add({
      email: 'patient1@patient.com',
      password: 'password'
    });
    await Patient.add({
      email: 'patient2@patient.com',
      password: 'password'
    });
    await Medic.add({
      email: 'medic@medic.com',
      password: 'password',
      image: 'yay an image!',
      type: MedicType.doctor,
      shiftStart: 11,
      shiftEnd: 13
    });
    await Appointment.initialize();
    cookie = await signInCookie('patient1@patient.com', 'password');
  });

  it('books an available appointment', async () => {
    await request(app)
      .post('/appointments/book/1')
      .set('Cookie', cookie)
      .expect(201);
    const appointment = await Appointment.findOne({ where: { id: 1 } });

    expect(appointment).toBeTruthy();
  });

  it(`can't book an appointment that's unavailable`, async () => {
    const cookie2 = await signInCookie('patient2@patient.com', 'password');
    await request(app)
      .post('/appointments/book/1')
      .set('Cookie', cookie)
      .expect(201);

    await request(app)
      .post('/appointments/book/1')
      .set('Cookie', cookie2)
      .expect(403);

    const appointment = await Appointment.findOne({
      raw: true,
      where: { id: 1 }
    });

    expect(appointment?.PatientId).toBe(1);
  });

  it('cancels an appointment that he owns and isnt in the past', async () => {
    await request(app)
      .post('/appointments/book/1')
      .set('Cookie', cookie)
      .expect(201);

    await request(app)
      .post('/appointments/cancel/1')
      .set('Cookie', cookie)
      .expect(200);

    const appointment = await Appointment.findOne({
      raw: true,
      where: { id: 1 }
    });

    expect(appointment?.PatientId).toBe(null);
  });

  it(`can't cancel an appointment he doesn't own`, async () => {
    const cookie2 = await signInCookie('patient2@patient.com', 'password');

    await request(app)
      .post('/appointments/book/1')
      .set('Cookie', cookie)
      .expect(201);

    await request(app)
      .post('/appointments/cancel/1')
      .set('Cookie', cookie2)
      .expect(403);

    const appointment = await Appointment.findByPk(1);
    expect(appointment?.PatientId);
  });

  it(`can't cancel his appointment that is in the past`, async () => {
    const cookie = await signInCookie('patient1@patient.com', 'password');

    await Appointment.create({
      MedicId: 1,
      PatientId: 1,
      timestamp: new Date(2021, 0, 5, 11, 15)
    });

    const appointment = await Appointment.findOne({ where: { PatientId: 1 } });
    if (!appointment) throw new ResourceNotFoundError('Appointment');

    await request(app)
      .post(`/appointments/book/${appointment.id}`)
      .set('Cookie', cookie)
      .expect(403);
  });
});

// describe('initialize (schedule ahead) appointments', () => {

// })

// describe('append appointments for one day (schedule ahead + 1) for all medics', () => {

// })
