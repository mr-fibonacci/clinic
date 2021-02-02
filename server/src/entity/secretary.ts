import { Column, Entity, getRepository, JoinColumn, OneToOne } from 'typeorm';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { Employee, EmployeeAttrs } from './employee';
import { User } from './user';

export enum SecretaryType {
  manager = 'manager',
  assistant = 'assistant'
}

type SecretaryAttrs = EmployeeAttrs & {
  type: SecretaryType;
};

@Entity()
export class Secretary extends Employee {
  @Column()
  type!: SecretaryType;

  @OneToOne(() => User, (user) => user.secretary)
  @JoinColumn()
  user!: User;

  static add = async (secretaryAttrs: SecretaryAttrs): Promise<Secretary> => {
    const { image, type, shiftStart, shiftEnd } = secretaryAttrs;

    const user = await User.signup(secretaryAttrs);

    const secretary = getRepository(Secretary).create({
      user,
      image,
      type,
      shiftStart,
      shiftEnd
    });
    await getRepository(Secretary).save(secretary);
    return secretary;
  };

  static edit = async (
    userId: string,
    secretaryAttrs: Partial<SecretaryAttrs>,
    newPassword?: string
  ): Promise<void> => {
    const { image, type, shiftStart, shiftEnd } = secretaryAttrs;
    const secretary = await getRepository(Secretary).findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
    if (!secretary) throw new ResourceNotFoundError('secretary');

    const user = await User.edit(userId, secretaryAttrs, newPassword);
    const mergedSecretary = getRepository(Secretary).merge(secretary, {
      user,
      image,
      type,
      shiftStart,
      shiftEnd
    });

    await getRepository(Secretary).save(mergedSecretary);
  };

  static remove = async (userId: string): Promise<void> => {
    const user = await getRepository(User).findOne(userId);
    if (!user) throw new ResourceNotFoundError('secretary');

    await getRepository(User).remove(user);
  };
}
