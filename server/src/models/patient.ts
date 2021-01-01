import { Model, Sequelize, DataTypes } from 'sequelize';
import { Appointment } from './appointment';

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
