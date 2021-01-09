import { DataTypes, Model, Sequelize } from 'sequelize';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

import { Appointment } from './appointment';
import { getDateTimestamps } from '../utils/date-time';
import { User, UserAttrs } from './user';

export enum MedicType {
  nurse = 'nurse',
  doctor = 'doctor'
}

interface MedicFields {
  id: number;
  UserId: number;
  type: MedicType;
  image: string;
  shiftStart: number;
  shiftEnd: number;
}

export interface MedicAttrs {
  UserId: number;
  type: MedicType;
  image: string;
  shiftStart: number;
  shiftEnd: number;
}

type AddMedicAttrs = Omit<UserAttrs & MedicAttrs, 'UserId'>;

export class Medic
  extends Model<MedicFields, MedicAttrs>
  implements MedicFields {
  id!: number;
  UserId!: number;
  type!: MedicType;
  image!: string;
  shiftStart!: number;
  shiftEnd!: number;

  static add = async (AddMedicAttrs: AddMedicAttrs): Promise<void> => {
    // create user
    const { email, password } = AddMedicAttrs;
    const user = await User.signup(email, password);

    // upload image
    const { image } = AddMedicAttrs;
    // get img url

    // create medic
    const { type, shiftStart, shiftEnd } = AddMedicAttrs;
    await Medic.create({
      UserId: user.id,
      type,
      shiftStart,
      shiftEnd,
      image
    });
  };

  static edit = async (
    id: string,
    attrs: Partial<MedicAttrs>
  ): Promise<void> => {
    const medic = await Medic.findByPk(id);
    if (!medic) throw new ResourceNotFoundError('Medic');

    // if image, upload new FIRST, THEN delete (separately)
    medic.setAttributes(attrs);
    await medic.save({ fields: ['image', 'shiftEnd', 'shiftStart', 'type'] });
  };

  static remove = async (id: string): Promise<void> => {
    await User.destroy({ where: { id } });
  };

  generateAppointments = async (date: Date): Promise<void> => {
    const { shiftStart, shiftEnd, id } = this;
    const timestamps = getDateTimestamps(date, shiftStart, shiftEnd);
    const appointments = timestamps.map((timestamp) => {
      return { timestamp, MedicId: id };
    });
    await Appointment.bulkCreate(appointments);
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const medic = (sequelize: Sequelize) => {
  Medic.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
      shiftStart: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      shiftEnd: {
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
