import { BuildOptions } from 'sequelize';
import { Model } from 'sequelize/types';

export const CLINIC_OPENING_TIME = 8;
export const CLINIC_CLOSING_TIME = 18;
export const SCHEDULE_DAYS_AHEAD = 14;
export const CONSULTATION_MINS = 15;
export const PROCEDURE_MINS = 30;

export type SequelizeModel = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): Model;
};
