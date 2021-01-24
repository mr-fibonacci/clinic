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
import { User } from './user';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.patient)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, (appointment) => appointment?.patient)
  appointments?: Appointment[];

  static add = async (email: string, password: string): Promise<User> => {
    const user = await User.signup(email, password);
    const patientRepo = getRepository(Patient);
    const patient = patientRepo.create({ user });
    await patientRepo.save(patient);
    return user;
  };

  static remove = async (userId: string): Promise<void> => {
    const patientRepo = getRepository(Patient);
    const userRepo = getRepository(User);

    const patient = await patientRepo.findOne({
      where: { user: { id: userId } }
    });
    if (!patient) throw new ResourceNotFoundError('user');

    const user = await userRepo.findOne(userId);
    if (!user) throw new ResourceNotFoundError('user');

    await Promise.all([patientRepo.remove(patient), userRepo.remove(user)]);
  };
}
