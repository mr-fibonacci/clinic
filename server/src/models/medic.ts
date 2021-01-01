import { DataTypes, Model, Sequelize } from 'sequelize';
import { Appointment } from './appointment';

enum MedicType {
  nurse = 'nurse',
  doctor = 'doctor'
}

interface MedicFields {
  UserId: number;
  type: MedicType;
  image: string;
  startingHour: number;
  shiftLength: number;
}

export interface MedicAttrs {
  UserId: number;
  type: MedicType;
  image: string;
  startingHour: number;
  shiftLength: number;
}

export class Medic
  extends Model<MedicFields, MedicAttrs>
  implements MedicFields {
  id!: number;
  UserId!: number;
  type!: MedicType;
  image!: string;
  startingHour!: number;
  shiftLength!: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const medic = (sequelize: Sequelize) => {
  Medic.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.values(MedicType),
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      startingHour: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      shiftLength: {
        type: DataTypes.SMALLINT,
        allowNull: false
      }
    },
    { sequelize }
  );

  Medic.hasMany(Appointment);
  Appointment.belongsTo(Medic);

  return Medic;
};
