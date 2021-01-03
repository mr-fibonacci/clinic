import { DataTypes, Model, Sequelize } from 'sequelize';
import { SCHEDULE_DAYS_AHEAD } from '../custom-types-consts';
import { getDatesRange } from '../utils/date-time';
import { Medic } from './medic';

// enum AppointmentType {
//   consultation = 'consultation',
//   procedure = 'procedure'
// }

interface AppointmentFields {
  PatientId: number;
  MedicId: number;
  // type: AppointmentType;
  timestamp: Date;
}

export interface AppointmentAttrs {
  MedicId: number;
  // type: AppointmentType;
  timestamp: Date;
}

export class Appointment
  extends Model<AppointmentFields, AppointmentAttrs>
  implements AppointmentFields {
  id!: number;
  MedicId!: number;
  PatientId!: number;
  // type!: AppointmentType;
  timestamp!: Date;

  static generateInRange = async (
    daysAhead1: number,
    daysAhead2: number
  ): Promise<void> => {
    const dates = getDatesRange(daysAhead1, daysAhead2);

    const medics = await Medic.findAll();
    // {attributes: ['id', 'shiftStart', 'shiftEnd']}

    await Promise.all(
      dates.map((date) => {
        return Promise.all(
          medics.map((medic) => {
            return medic.generateAppointments(date);
          })
        );
      })
    );
  };

  static initialize = async (
    daysAhead = SCHEDULE_DAYS_AHEAD
  ): Promise<void> => {
    await Appointment.generateInRange(0, daysAhead);
  };

  static append = async (daysAhead = SCHEDULE_DAYS_AHEAD): Promise<void> => {
    await Appointment.generateInRange(daysAhead, daysAhead + 1);
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const appointment = (sequelize: Sequelize) => {
  Appointment.init(
    {
      MedicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'composite1'
      },
      PatientId: {
        type: DataTypes.INTEGER
      },
      // type: {
      //   type: DataTypes.ENUM,
      //   values: Object.values(AppointmentType),
      //   allowNull: false
      // },
      timestamp: {
        type: 'TIMESTAMP',
        unique: 'composite1',
        allowNull: false
      }
    },
    { sequelize }
  );

  return Appointment;
};
