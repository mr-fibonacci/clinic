import request from 'supertest';
import app from '../../app';
import { Appointment } from '../../entity/appointment';
import { Medic, MedicType } from '../../entity/medic';
import { Patient } from '../../entity/patient';
import { signInCookie } from '../../test/setup';
import { getRepository } from 'typeorm';

let medic: Medic,
  patient1: Patient,
  patient2: Patient,
  appointment: Appointment | undefined,
  cookie1: string,
  cookie2: string;

beforeEach(async () => {
  [medic, patient1, patient2] = await Promise.all([
    Medic.add({
      email: 'medic@medic.com',
      password: 'password',
      image: 'yay an image!',
      type: MedicType.doctor,
      shiftStart: 11,
      shiftEnd: 13,
      firstName: 'John',
      lastName: 'McDoctorface'
    }),
    Patient.add({
      email: 'patient1@patient.com',
      password: 'pass',
      firstName: 'Tom',
      lastName: 'Sickmann'
    }),
    Patient.add({
      email: 'patient2@patient.com',
      password: 'pass',
      firstName: 'Joe',
      lastName: 'Idontfeelsogood'
    })
  ]);

  [cookie1, cookie2, appointment] = await Promise.all([
    signInCookie({
      email: 'patient1@patient.com',
      password: 'pass'
    }),
    signInCookie({
      email: 'patient2@patient.com',
      password: 'pass'
    }),
    getRepository(Appointment).findOne()
  ]);
});

it('generates medic appointments upon creation', async () => {
  const appointments = await getRepository(Appointment).find();
  expect(appointments.length).toBe(2 * 4 * 10);
});

it('a patient can book an available appointment', async () => {
  await request(app)
    .post(`/appointments/book/${appointment?.id}`)
    .set('Cookie', cookie1)
    .expect(201);

  appointment = await getRepository(Appointment).findOne(appointment, {
    relations: ['medic', 'patient']
  });

  expect(appointment?.medic.id).toBe(medic.id);
  expect(appointment?.patient?.id).toBe(patient1.id);
});

it(`a patient can't book an appointment that has already been booked by himself or someone else`, async () => {
  await request(app)
    .post(`/appointments/book/${appointment?.id}`)
    .set('Cookie', cookie1)
    .expect(201);

  await request(app)
    .post(`/appointments/book/${appointment?.id}`)
    .set('Cookie', cookie1)
    .expect(403);

  await request(app)
    .post(`/appointments/book/${appointment?.id}`)
    .set('Cookie', cookie2)
    .expect(403);

  appointment = await getRepository(Appointment).findOne(appointment, {
    relations: ['medic', 'patient']
  });

  expect(appointment?.medic.id).toBe(medic.id);
  expect(appointment?.patient?.id).toBe(patient1.id);
});

it(`patient can cancel an appointment he booked`, async () => {
  await request(app)
    .post(`/appointments/book/${appointment?.id}`)
    .set('Cookie', cookie1)
    .expect(201);

  await request(app)
    .post(`/appointments/cancel/${appointment?.id}`)
    .set('Cookie', cookie1)
    .expect(200);

  appointment = await getRepository(Appointment).findOne(appointment?.id, {
    relations: ['medic', 'patient']
  });

  expect(appointment?.medic.id).toBe(medic.id);
  expect(appointment?.patient).toBe(null);
});

it(`patient can't cancel an appointment he didn't book`, async () => {
  await request(app)
    .post(`/appointments/book/${appointment?.id}`)
    .set('Cookie', cookie1)
    .expect(201);

  await request(app)
    .post(`/appointments/cancel/${appointment?.id}`)
    .set('Cookie', cookie2)
    .expect(403);

  appointment = await getRepository(Appointment).findOne(appointment?.id, {
    relations: ['medic', 'patient']
  });

  expect(appointment?.medic.id).toBe(medic.id);
  expect(appointment?.patient?.id).toBe(patient1.id);
});

// // describe('append appointments for one day (schedule ahead + 1) for all medics', () => {

// // })
