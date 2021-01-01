import { DataTypes, Model, Sequelize } from 'sequelize';

enum AppointmentType {
  consultation = 'consultation',
  procedure = 'procedure'
}

interface AppointmentFields {
  PatientId: number;
  MedicId: number;
  type: AppointmentType;
  time: string;
}

interface AppointmentAttrs {
  MedicId: number;
  type: AppointmentType;
  time: string;
}

export class Appointment
  extends Model<AppointmentFields, AppointmentAttrs>
  implements AppointmentFields {
  id!: number;
  MedicId!: number;
  PatientId!: number;
  type!: AppointmentType;
  time!: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const appointment = (sequelize: Sequelize) => {
  Appointment.init(
    {
      MedicId: { type: DataTypes.INTEGER, allowNull: false },
      PatientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.values(AppointmentType),
        allowNull: false
      },
      time: {
        type: 'TIMESTAMP',
        allowNull: false
      }
    },
    { sequelize }
  );

  return Appointment;
};

// new Date().toISOString().split('T')[0]
// new Date().toLocaleDateString()
// function showDay(d) {
//   return ["weekday", "weekend"][parseInt(d.getDay() / 6)];
// }

// console.log(showDay(new Date()));
// bulkCreate
