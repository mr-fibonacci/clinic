import { DataTypes, Model, Sequelize } from 'sequelize';
import { Password } from '../classes/password';

interface PatientFields {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
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

  static signup = async (email: string, password: string): Promise<void> => {
    let patient = await Patient.findOne({ where: { email } });
    if (patient) throw new Error('Email in use');
    patient = await Patient.create({ email, password });
  };

  static signin = async (email: string, password: string): Promise<void> => {
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) throw new Error('Invalid credentials');
    const passwordsMatch = await Password.compare(password, patient.password);
    if (!passwordsMatch) throw new Error('Invalid credentials');
  };
}

const hashPassHook = async (patient: Patient) => {
  const hashedPass = await Password.toHash(patient.password);
  patient.setDataValue('password', hashedPass);
};

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
      }
    },
    {
      hooks: {
        beforeSave: hashPassHook
      },
      sequelize
    }
  );
  return Patient;
};
