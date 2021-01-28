import {
  Entity,
  getRepository,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { Appointment } from './appointment';
import { User, UserAttrs } from './user';

type PatientAttrs = UserAttrs;

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.patient)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, (appointment) => appointment?.patient)
  appointments?: Appointment[];

  static add = async (patientAttrs: PatientAttrs): Promise<Patient> => {
    const user = await User.signup(patientAttrs.email, patientAttrs.password);
    const patient = getRepository(Patient).create({ user });
    const createdPatient = await getRepository(Patient).save(patient);
    return createdPatient;
  };

  static remove = async (userId: string): Promise<void> => {
    const patient = await getRepository(Patient).findOne({
      where: { user: { id: userId } }
    });
    if (!patient) throw new ResourceNotFoundError('patient');

    const user = await getRepository(User).findOne(userId);
    if (!user) throw new ResourceNotFoundError('user');

    await Promise.all([
      getRepository(Patient).remove(patient),
      getRepository(User).remove(user)
    ]);
  };
}
