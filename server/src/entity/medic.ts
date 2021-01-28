import {
  Column,
  Entity,
  getRepository,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm';
import { SCHEDULE_DAYS_AHEAD } from '../custom-types-consts';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { getDatesRange, getDateTimestamps } from '../utils/date-time';
import { Appointment } from './appointment';
import { Employee, EmployeeAttrs } from './employee';
import { User } from './user';

export enum MedicType {
  nurse = 'nurse',
  doctor = 'doctor'
}

type MedicAttrs = EmployeeAttrs & {
  type: MedicType;
};

@Entity()
export class Medic extends Employee {
  @Column()
  type!: MedicType;

  @OneToOne(() => User, (user) => user.medic)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, (appointment) => appointment.medic)
  appointments!: Appointment[];

  static add = async (medicAttrs: MedicAttrs): Promise<Medic> => {
    const { email, password, type, image, shiftStart, shiftEnd } = medicAttrs;
    const user = await User.signup(email, password);

    // handle image upload to cloudinary

    const medic = getRepository(Medic).create({
      type,
      image,
      shiftStart,
      shiftEnd,
      user
    });
    const createdMedic = await getRepository(Medic).save(medic);

    await medic.generateAppointments(0, SCHEDULE_DAYS_AHEAD);

    return createdMedic;
  };

  // static edit = async (medicAttrs: Partial<MedicAttrs>): Promise<void> => {
  // if there's an image, persist to cloudinary FIRST, then delete the old one
  // };

  static remove = async (userId: string): Promise<void> => {
    const medic = await getRepository(Medic).findOne({
      where: { user: { id: userId } }
    });
    if (!medic) throw new ResourceNotFoundError('user');

    const user = await getRepository(User).findOne(userId);
    if (!user) throw new ResourceNotFoundError('user');

    await Promise.all([
      getRepository(Medic).remove(medic),
      getRepository(User).remove(user)
    ]);
  };

  generateAppointments = async (
    daysAhead1: number,
    daysAhead2: number
  ): Promise<void> => {
    const { shiftStart, shiftEnd } = this;
    const dates = getDatesRange(daysAhead1, daysAhead2);

    const daysTimestamps = dates.map((date) =>
      getDateTimestamps(date, shiftStart, shiftEnd)
    );

    const daysAppointments = daysTimestamps.map((day) => {
      return day.map((timestamp) => ({
        timestamp,
        medic: this
      }));
    });

    await Promise.all(
      daysAppointments.map((dayAppointments) => {
        return getRepository(Appointment).insert(dayAppointments);
      })
    );
  };
}
