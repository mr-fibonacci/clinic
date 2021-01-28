import { randomBytes } from 'crypto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  getRepository,
  OneToOne,
  MoreThan
} from 'typeorm';
import { Password } from '../classes/password';
import { resetMailOptions, sendMail } from '../config/nodemailer-config';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { Medic } from './medic';
import { OfficeAdmin } from './office-admin';
import { Patient } from './patient';

export interface UserAttrs {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  tokenExpires?: number;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

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

  @OneToOne(() => Patient, (patient) => patient.user, { onDelete: 'CASCADE' })
  patient?: Patient;

  @OneToOne(() => Medic, (medic) => medic.user)
  medic?: Medic;

  @OneToOne(() => OfficeAdmin, (officeAdmin) => officeAdmin.user)
  officeAdmin?: OfficeAdmin;

  static signup = async (email: string, password: string): Promise<User> => {
    const user = await getRepository(User).findOne({ where: { email } });
    if (user) throw new NotAuthorizedError('Invalid credentials');

    password = await Password.toHash(password);

    const newUser = getRepository(User).create({ email, password });
    const createdUser = await getRepository(User).save(newUser);
    return createdUser;
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
}
