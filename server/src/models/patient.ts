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

  signup = async (email: string, password: string): Promise<void> => {
    let patient = await Patient.findOne({ where: { email } });
    if (patient) throw new Error('Email in use');
    patient = await Patient.create({ email, password });
  };

  signin = async (email: string, password: string): Promise<void> => {
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) throw new Error('Invalid credentials');
    const passwordsMatch = Password.compare(password, patient.password);
    if (!passwordsMatch) throw new Error('Invalid credentials');
  };
}

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
        beforeCreate: async (patient) => {
          const { password } = patient;
          patient.password = await Password.toHash(password);
        }
      },
      sequelize
    }
  );
  return Patient;
};
