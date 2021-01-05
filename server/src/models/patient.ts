import { Model, Sequelize, DataTypes } from 'sequelize';
import { Appointment } from './appointment';
import { User, UserAttrs } from './user';

interface PatientFields {
  UserId: number;
}

interface PatientAttrs {
  UserId: number;
}

export class Patient
  extends Model<PatientFields, PatientAttrs>
  implements PatientFields {
  id!: number;
  UserId!: number;

  static add = async (AddPatientAttrs: UserAttrs): Promise<void> => {
    // create user
    const { email, password } = AddPatientAttrs;
    const user = await User.signup(email, password);

    // create patient
    await Patient.create({ UserId: user.id });
  };

  static remove = async (id: string): Promise<void> => {
    await User.destroy({ where: { id } });
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const patient = (sequelize: Sequelize) => {
  Patient.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      }
    },
    { sequelize }
  );

  Patient.hasMany(Appointment);
  Appointment.belongsTo(Patient);

  return Patient;
};
