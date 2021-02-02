import { randomBytes } from 'crypto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  getRepository,
  OneToOne,
  MoreThan,
  BeforeInsert
} from 'typeorm';
import { Password } from '../classes/password';
import { resetMailOptions, sendMail } from '../config/nodemailer-config';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { Medic } from './medic';
import { Secretary } from './secretary';
import { Patient } from './patient';
import { Resource } from '../custom-types-consts';

export interface UserAttrs {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  tokenExpires?: number;
}

@Entity()
export class User implements Resource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await Password.toHash(this.password);
  }

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
  // type text is a hack to make the field NULLABLE
  @Column({ nullable: true, type: 'text' })
  token?: string | null;
  // type text is a hack to make the field NULLABLE
  @Column({ nullable: true, type: 'text' })
  tokenExpires?: number | null;

  @OneToOne(() => Patient, (patient) => patient.user)
  patient?: Patient;

  @OneToOne(() => Medic, (medic) => medic.user)
  medic?: Medic;

  @OneToOne(() => Secretary, (secretary) => secretary.user)
  secretary?: Secretary;

  isOwnedByUser = (userId: string): boolean => {
    return this.id === userId;
  };

  static signup = async (attrs: UserAttrs): Promise<User> => {
    const { email, password, firstName, lastName } = attrs;

    const dbUser = await getRepository(User).findOne({ where: { email } });
    if (dbUser) throw new NotAuthorizedError('Invalid credentials');

    const user = getRepository(User).create({
      email,
      password,
      firstName,
      lastName
    });
    return await getRepository(User).save(user);
  };

  static signin = async (email: string, password: string): Promise<User> => {
    const user = await getRepository(User).findOne({ where: { email } });
    if (!user) throw new NotAuthorizedError('Invalid credentials');

    const passwordsMatch = await Password.compare(password, user.password);
    if (!passwordsMatch) throw new NotAuthorizedError('Invalid credentials');

    return user;
  };

  static sendForgotPasswordEmail = async (email: string): Promise<void> => {
    const user = await getRepository(User).findOne({ where: { email } });
    if (!user) throw new NotAuthorizedError('invalid credentials');

    const token = randomBytes(20).toString('hex');
    const tokenExpires = Date.now() + 1000 * 60 * 60;

    user.token = token;
    user.tokenExpires = tokenExpires;

    await getRepository(User).save(user);
    await sendMail(resetMailOptions(email, token));
  };

  static resetPassword = async (
    token: string,
    password: string
  ): Promise<void> => {
    const user = await getRepository(User).findOne({
      where: { token, tokenExpires: MoreThan(Date.now()) }
    });

    if (!user) throw new NotAuthorizedError('Invalid token');

    const hashedPassword = await Password.toHash(password);
    getRepository(User).merge(user, {
      password: hashedPassword,
      token: null,
      tokenExpires: null
    });

    await getRepository(User).save(user);
    await User.signin(user.email, password);
  };

  static edit = async (
    userId: string,
    userAttrs: Partial<UserAttrs>,
    newPassword?: string
  ): Promise<User> => {
    const { email, password, firstName, lastName } = userAttrs;
    const user = await getRepository(User).findOne(userId);
    if (!user) throw new ResourceNotFoundError('user');

    if (password && newPassword) {
      const passwordsMatch = await Password.compare(password, user.password);
      if (!passwordsMatch) throw new NotAuthorizedError('Invalid credentials');
    }

    const mergedUser = getRepository(User).merge(user, {
      email,
      password: newPassword,
      firstName,
      lastName
    });
    return getRepository(User).save(mergedUser);
  };
}
