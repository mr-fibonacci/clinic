import request from 'supertest';
import app from '../../app';
import {
  CLINIC_CLOSING_TIME,
  CLINIC_OPENING_TIME
} from '../../custom-types-consts';
import { ResourceNotFoundError } from '../../errors/resource-not-found-error';
import { Medic } from '../../models/medic';
import { User } from '../../models/user';

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

    const [user, medic] = await Promise.all([User.findOne(), Medic.findOne()]);

    if (!user) throw new ResourceNotFoundError('user');
    if (!medic) throw new ResourceNotFoundError('medic');
    expect(medic.UserId).toEqual(user.id);
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

    it('shift starting too early', async () => {
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

    it('shift ending too late', async () => {
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

    it('', async () => {
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
