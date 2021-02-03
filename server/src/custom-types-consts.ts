export const CLINIC_OPENING_TIME = 8;
export const CLINIC_CLOSING_TIME = 18;
export const SCHEDULE_DAYS_AHEAD = 5;
export const CONSULTATION_MINS = 15;
export const PROCEDURE_MINS = 30;

export interface Resource {
  isOwnedByUser(userId: string): boolean;
}
