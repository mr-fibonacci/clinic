import { DataTypes, Model, Sequelize } from 'sequelize';

interface PatientAttrs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class Patient extends Model<PatientAttrs> implements PatientAttrs {
  id!: number;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
}

export const patient = (sequelize: Sequelize) => {
  Patient.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      hooks: {
        // beforeSave: (patient) => {}
      },
      sequelize
    }
  );
  return Patient;
};
