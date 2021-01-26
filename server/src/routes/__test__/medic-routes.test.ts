import request from 'supertest';
import app from '../../app';
import {
  CLINIC_CLOSING_TIME,
  CLINIC_OPENING_TIME
} from '../../custom-types-consts';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { Medic } from '../../entity/medic';
import { User } from '../../entity/user';
import { getRepository } from 'typeorm';

describe('create medic', () => {
  it('provided valid values, returns 201, user and medic created', async () => {
    await request(app)
      .post('/medics')
      .send({
        email: 'medic@medic.com',
        password: 'password',
        image: 'yay an image!',
        type: 'doctor',
        shiftStart: CLINIC_OPENING_TIME,
        shiftEnd: CLINIC_CLOSING_TIME
      })
      .expect(201);

    const userRepo = getRepository(User);
    const medicRepo = getRepository(Medic);
    const [user, medic] = await Promise.all([
      userRepo.findOne(),
      medicRepo.findOne({ relations: ['user'] })
    ]);

    if (!user) throw new ResourceNotFoundError('user');
    if (!medic) throw new ResourceNotFoundError('medic');
    expect(medic.user.id).toEqual(user.id);
  });

  describe('throws 422 if:', () => {
    it('no image', async () => {
      await request(app)
        .post('/medics')
        .send({
          email: 'medic@medic.com',
          password: 'password',
          image: '',
          type: 'doctor',
          shiftStart: 'start',
          shiftEnd: 'end'
        })
        .expect(422);
    });

    it('wrong medic type', async () => {
      await request(app)
        .post('/medics')
        .send({
          email: 'medic@medic.com',
          password: 'password',
          image: 'yay an image!',
          type: 'not a doctor or a nurse',
          shiftStart: 11,
          shiftEnd: 15
        })
        .expect(422);
    });

    it('shift starting earlier than CLINIC_OPENING_TIME', async () => {
      await request(app)
        .post('/medics')
        .send({
          email: 'medic@medic.com',
          password: 'password',
          image: 'yay an image!',
          type: 'doctor',
          shiftStart: CLINIC_OPENING_TIME - 1,
          shiftEnd: 15
        })
        .expect(422);
    });

    it('shift ending later than CLINIC_CLOSING_TIME', async () => {
      await request(app)
        .post('/medics')
        .send({
          email: 'medic@medic.com',
          password: 'password',
          image: 'yay an image!',
          type: 'doctor',
          shiftStart: 11,
          shiftEnd: CLINIC_CLOSING_TIME + 1
        })
        .expect(422);
    });

    it('shiftStart and shiftEnd hours accidentally swapped', async () => {
      await request(app)
        .post('/medics')
        .send({
          email: 'medic@medic.com',
          password: 'password',
          image: 'yay an image!',
          type: 'doctor',
          shiftStart: 15,
          shiftEnd: 11
        })
        .expect(422);
    });
  });
});

// A FK CONSTRAINT ON APPOINTMENTWILL PROBABLY HAVE TO RETIRE A MEDIC, NOT REMOVE AS THAT WOULD LEAVE A HOLE IN APPOINTMENTS
// describe('remove medic', () => {
//   beforeEach(async () => {
//     await Medic.add({
//       email: 'medic@medic.com',
//       password: 'password',
//       image: 'yay an image!',
//       type: MedicType.doctor,
//       shiftStart: CLINIC_OPENING_TIME,
//       shiftEnd: CLINIC_CLOSING_TIME
//     });
//   });

//   it('removes the medic and user (cascade)', async () => {
//     const userRepo = getRepository(User);
//     const medicRepo = getRepository(Medic);
//     let [user, medic] = await Promise.all([
//       userRepo.findOne(),
//       medicRepo.findOne({ relations: ['user'] })
//     ]);

//     await request(app).delete(`/medics/${user?.id}`).expect(200);

//     [user, medic] = await Promise.all([
//       userRepo.findOne(),
//       medicRepo.findOne()
//     ]);

//     expect(medic).toBeFalsy();
//     expect(user).toBeFalsy();
//   });
// });
