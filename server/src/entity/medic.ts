import {
  Column,
  Entity,
  getRepository,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { SCHEDULE_DAYS_AHEAD } from '../custom-types-consts';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { getDatesRange, getDateTimestamps } from '../utils/date-time';
import { Appointment } from './appointment';
import { User, UserAttrs } from './user';

export enum MedicType {
  nurse = 'nurse',
  doctor = 'doctor'
}

type MedicAttrs = UserAttrs & {
  type: MedicType;
  image: string;
  shiftStart: number;
  shiftEnd: number;
};

@Entity()
export class Medic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: MedicType;

  @Column()
  image!: string;

  @Column()
  shiftStart!: number;

  @Column()
  shiftEnd!: number;

  @OneToOne(() => User, (user) => user.medic)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, (appointment) => appointment.medic)
  appointments!: Appointment[];

  static add = async (medicAttrs: MedicAttrs): Promise<Medic> => {
    const { email, password, type, image, shiftStart, shiftEnd } = medicAttrs;
    const user = await User.signup(email, password);

    // handle image upload to cloudinary

    const medicRepo = getRepository(Medic);
    const medic = medicRepo.create({ type, image, shiftStart, shiftEnd, user });
    const createdMedic = await medicRepo.save(medic);

    await medic.generateAppointments(0, SCHEDULE_DAYS_AHEAD);

    return createdMedic;
  };

  static edit = async (medicAttrs: Partial<MedicAttrs>): Promise<void> => {
    // if there's an image, persist to cloudinary FIRST, then delete the old one
  };

  static remove = async (userId: string): Promise<void> => {
    const medicRepo = getRepository(Medic);
    const userRepo = getRepository(User);

    const medic = await medicRepo.findOne({ where: { user: { id: userId } } });
    if (!medic) throw new ResourceNotFoundError('user');

    const user = await userRepo.findOne(userId);
    if (!user) throw new ResourceNotFoundError('user');

    await Promise.all([medicRepo.remove(medic), userRepo.remove(user)]);
  };

  generateAppointments = async (
    daysAhead1: number,
    daysAhead2: number
  ): Promise<void> => {
    const { shiftStart, shiftEnd } = this;
    const dates = getDatesRange(daysAhead1, daysAhead2);
    const appointmentRepo = getRepository(Appointment);

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
        return appointmentRepo.insert(dayAppointments);
      })
    );
  };
}
