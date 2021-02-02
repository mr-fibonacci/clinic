import {
  Column,
  Entity,
  getRepository,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Resource, SCHEDULE_DAYS_AHEAD } from '../custom-types-consts';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { ResourceUnavailableError } from '../errors/resource-unavailable-error';
import { Medic } from './medic';
import { Patient } from './patient';

enum AppointmentType {
  consultation = 'consultation',
  procedure = 'procedure',
  operation = 'operation'
}

@Entity()
export class Appointment implements Resource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @ManyToOne(() => Patient, (patient) => patient?.appointments)
  patient?: Patient | null;

  @ManyToOne(() => Medic, (medic) => medic?.appointments)
  medic!: Medic;

  static append = async (): Promise<void> => {
    const medics = await getRepository(Medic).find();

    await Promise.all(
      medics.map((medic) =>
        medic.generateAppointments(SCHEDULE_DAYS_AHEAD, SCHEDULE_DAYS_AHEAD + 1)
      )
    );
  };

  isOwnedByUser = (userId: string): boolean => {
    return this.patient?.user.id === userId || this.medic.user.id === userId;
  };

  static book = async (
    userId: string,
    appointmentId: string
  ): Promise<void> => {
    const patient = await getRepository(Patient).findOne({
      where: { user: { id: userId } }
    });
    if (!patient) throw new ResourceNotFoundError('Patient');

    const appointment = await getRepository(Appointment).update(
      {
        id: appointmentId,
        patient: null
      },
      { patient }
    );

    if (!appointment.affected) {
      throw new ResourceUnavailableError(`Appointment already booked.`);
    }
  };

  static cancel = async (
    userId: string,
    appointmentId: string
  ): Promise<void> => {
    const patient = await getRepository(Patient).findOne({
      where: { user: { id: userId } }
    });
    if (!patient) throw new ResourceNotFoundError('Patient');

    const appointment = await getRepository(Appointment).update(
      {
        id: appointmentId,
        patient
      },
      { patient: null }
    );

    if (!appointment.affected) {
      throw new ResourceUnavailableError(`Could not cancel the appointment.`);
    }
  };
}
