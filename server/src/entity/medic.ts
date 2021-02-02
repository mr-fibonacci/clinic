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

export type MedicAttrs = EmployeeAttrs & {
  type: MedicType;
};

@Entity()
export class Medic extends Employee {
  @Column({ default: true })
  isActive!: boolean;

  @Column()
  type!: MedicType;

  @OneToOne(() => User, (user) => user.medic, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, (appointment) => appointment.medic)
  appointments!: Appointment[];

  static add = async (medicAttrs: MedicAttrs): Promise<Medic> => {
    const { image, type, shiftStart, shiftEnd } = medicAttrs;
    const user = await User.signup(medicAttrs);

    // handle image upload to cloudinary

    const medic = getRepository(Medic).create({
      user,
      image,
      type,
      shiftStart,
      shiftEnd
    });
    await getRepository(Medic).save(medic);
    await medic.generateAppointments(0, SCHEDULE_DAYS_AHEAD);

    return medic;
  };

  static edit = async (
    userId: string,
    medicAttrs: Partial<MedicAttrs>,
    newPassword?: string
  ): Promise<void> => {
    const { image, type, shiftStart, shiftEnd } = medicAttrs;

    const medic = await getRepository(Medic).findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
    if (!medic) throw new ResourceNotFoundError('medic');

    const user = await User.edit(userId, medicAttrs, newPassword);
    const mergedMedic = getRepository(Medic).merge(medic, {
      user,
      image,
      type,
      shiftStart,
      shiftEnd
    });

    await getRepository(Medic).save(mergedMedic);
  };

  static remove = async (userId: string): Promise<void> => {
    const medic = await getRepository(Medic).update(
      { user: { id: userId } },
      { isActive: false }
    );
    if (!medic.affected) throw new ResourceNotFoundError('medic');
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
