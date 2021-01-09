import { DataTypes, Model, Op, Sequelize } from 'sequelize';
import { SCHEDULE_DAYS_AHEAD } from '../custom-types-consts';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { ResourceUnavailableError } from '../errors/resource-unavailable-error';
import { getDatesRange } from '../utils/date-time';
import { Medic } from './medic';
import { Patient } from './patient';

// enum AppointmentType {
//   consultation = 'consultation',
//   procedure = 'procedure'
// }

interface AppointmentFields {
  id: number;
  PatientId: number | null;
  MedicId: number;
  // type: AppointmentType;
  timestamp: Date;
}

export interface AppointmentAttrs {
  MedicId: number;
  PatientId?: number | null;
  // type: AppointmentType;
  timestamp: Date;
}

export class Appointment
  extends Model<AppointmentFields, AppointmentAttrs>
  implements AppointmentFields {
  id!: number;
  MedicId!: number;
  PatientId!: number | null;
  // type!: AppointmentType;
  timestamp!: Date;

  static generateInRange = async (
    daysAhead1: number,
    daysAhead2: number
  ): Promise<void> => {
    const dates = getDatesRange(daysAhead1, daysAhead2);

    const medics = await Medic.findAll({
      attributes: ['id', 'shiftStart', 'shiftEnd']
    });

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

  static book = async (
    UserId: number,
    AppointmentId: number | string
  ): Promise<void> => {
    const patient = await Patient.findOne({ where: { UserId } });
    if (!patient) throw new ResourceNotFoundError('Patient');
    const [appointment] = await Appointment.update(
      { PatientId: patient.id },
      {
        where: {
          id: AppointmentId,
          PatientId: null,
          timestamp: { [Op.gt]: new Date() }
        }
      }
    );
    if (!appointment) {
      throw new ResourceUnavailableError(`Sorry, appointment already booked.`);
    }
  };

  static cancel = async (
    UserId: number,
    AppointmentId: number | string
  ): Promise<void> => {
    const patient = await Patient.findOne({ where: { UserId } });
    if (!patient) throw new ResourceNotFoundError('Patient');

    const [appointment] = await Appointment.update(
      { PatientId: null },
      {
        where: {
          id: AppointmentId,
          PatientId: patient.id,
          timestamp: { [Op.gt]: new Date() }
        }
      }
    );

    if (!appointment) {
      throw new ResourceUnavailableError(
        `Sorry, a problem cancelling appointment occured.`
      );
    }
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const appointment = (sequelize: Sequelize) => {
  Appointment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
