import { randomBytes } from 'crypto';
import { DataTypes, Model, Sequelize, Op } from 'sequelize';
import { Password } from '../classes/password';
import { resetMailOptions, sendMail } from '../config/nodemailer-config';
import { NotAuthorizedError } from '../errors/not-authorized-error';

interface PatientFields {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  tokenExpires: number;
}

interface PatientAttrs {
  email: string;
  password: string;
}

export class Patient
  extends Model<PatientFields, PatientAttrs>
  implements PatientFields {
  id!: number;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  tokenExpires!: number;

  static signup = async (email: string, password: string): Promise<void> => {
    let patient = await Patient.findOne({ where: { email } });
    if (patient) throw new NotAuthorizedError('Invalid credentials');
    patient = await Patient.create({ email, password });
  };

  static signin = async (email: string, password: string): Promise<void> => {
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) throw new NotAuthorizedError('Invalid credentials');
    const passwordsMatch = await Password.compare(password, patient.password);
    if (!passwordsMatch) throw new NotAuthorizedError('Invalid credentials');
  };

  static sendForgotPasswordEmail = async (email: string): Promise<void> => {
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) throw new NotAuthorizedError('invalid credentials');

    const token = randomBytes(20).toString('hex');
    const tokenExpires = Date.now() + 1000 * 60 * 60;

    patient.set({ token, tokenExpires });
    await patient.save();

    await sendMail(resetMailOptions(email, token));
  };

  static resetPassword = async (
    token: string,
    password: string
  ): Promise<void> => {
    const patient = await Patient.findOne({
      where: { token, tokenExpires: { [Op.gt]: Date.now() } }
    });
    if (!patient) throw new NotAuthorizedError('Invalid token');

    patient.set({ password, token: undefined, tokenExpires: undefined });
    await patient.save();

    await Patient.signin(patient.email, password);
  };
}

const hashPasswordHook = async (patient: Patient) => {
  const hashedPass = await Password.toHash(patient.password);
  patient.setDataValue('password', hashedPass);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const patient = (sequelize: Sequelize) => {
  Patient.init(
    {
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
        type: DataTypes.STRING
      },
      tokenExpires: {
        type: DataTypes.BIGINT
      }
    },
    {
      hooks: {
        beforeSave: hashPasswordHook
      },
      sequelize
    }
  );
  return Patient;
};
