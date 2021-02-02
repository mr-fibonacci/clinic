import {
  Entity,
  getRepository,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Resource } from '../custom-types-consts';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { Appointment } from './appointment';
import { User, UserAttrs } from './user';

export type PatientAttrs = UserAttrs;

@Entity()
export class Patient implements Resource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.patient, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, (appointment) => appointment?.patient)
  appointments?: Appointment[];

  isOwnedByUser = (userId: string): boolean => {
    return this.user.id === userId;
  };

  static add = async (patientAttrs: PatientAttrs): Promise<Patient> => {
    // destructure patientAttrs here and add to create; no patient fields at present
    const user = await User.signup(patientAttrs);

    const patient = getRepository(Patient).create({ user });
    await getRepository(Patient).save(patient);

    return patient;
  };

  static edit = async (
    userId: string,
    patientAttrs: Partial<PatientAttrs>,
    newPassword?: string
  ): Promise<void> => {
    // destructure patientAttrs here and add to merge; no patient fields at present

    const patient = await getRepository(Patient).findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
    if (!patient) throw new ResourceNotFoundError('patient');

    const user = await User.edit(userId, patientAttrs, newPassword);
    const mergedPatient = getRepository(Patient).merge(patient, { user });

    await getRepository(Patient).save(mergedPatient);
  };

  static remove = async (userId: string): Promise<void> => {
    const user = await getRepository(User).findOne(userId);
    if (!user) throw new ResourceNotFoundError('user');

    await getRepository(User).remove(user);
  };
}
