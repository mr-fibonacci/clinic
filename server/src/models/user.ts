import { randomBytes } from 'crypto';
import { DataTypes, Model, Sequelize, Op } from 'sequelize';
import { Password } from '../classes/password';
import { resetMailOptions, sendMail } from '../config/nodemailer-config';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { Medic } from './medic';
import { Patient } from './patient';
import { Secretary } from './secretary';

interface UserFields {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string | null;
  tokenExpires: number | null;
}

export interface UserAttrs {
  email: string;
  password: string;
}

export class User extends Model<UserFields, UserAttrs> implements UserFields {
  id!: number;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  token!: string | null;
  tokenExpires!: number | null;

  static signup = async (email: string, password: string): Promise<User> => {
    let user = await User.findOne({ where: { email } });
    if (user) throw new NotAuthorizedError('Invalid credentials');
    user = await User.create({ email, password });
    return user;
  };

  static signin = async (email: string, password: string): Promise<User> => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new NotAuthorizedError('Invalid credentials');
    const passwordsMatch = await Password.compare(password, user.password);
    if (!passwordsMatch) throw new NotAuthorizedError('Invalid credentials');
    return user;
  };

  static sendForgotPasswordEmail = async (email: string): Promise<void> => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new NotAuthorizedError('invalid credentials');

    const token = randomBytes(20).toString('hex');
    const tokenExpires = Date.now() + 1000 * 60 * 60;

    user.set({ token, tokenExpires });
    await user.save();

    await sendMail(resetMailOptions(email, token));
  };

  static resetPassword = async (
    token: string,
    password: string
  ): Promise<void> => {
    const user = await User.findOne({
      where: { token, tokenExpires: { [Op.gt]: Date.now() } }
    });
    if (!user) throw new NotAuthorizedError('Invalid token');

    user.set({ password, token: null, tokenExpires: null });
    await user.save();

    await User.signin(user.email, password);
  };
}

const hashPasswordHook = async (user: User) => {
  const hashedPass = await Password.toHash(user.password);
  user.setDataValue('password', hashedPass);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const user = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tokenExpires: {
        type: DataTypes.BIGINT,
        allowNull: true
      }
    },
    {
      hooks: {
        beforeSave: hashPasswordHook
      },
      sequelize
    }
  );

  User.hasOne(Patient, { onDelete: 'CASCADE' });
  Patient.belongsTo(User, { onDelete: 'CASCADE' });
  User.hasOne(Medic, { onDelete: 'CASCADE' });
  Medic.belongsTo(User, { onDelete: 'CASCADE' });
  User.hasOne(Secretary, { onDelete: 'CASCADE' });
  Secretary.belongsTo(User, { onDelete: 'CASCADE' });

  return User;
};
