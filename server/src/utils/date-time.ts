import { CONSULTATION_MINS } from '../custom-types-consts';

const isWeekday = (date: Date) => {
  const dayIdx = date.getDay();
  return !dayIdx || dayIdx === 6 ? false : true;
};

const addDays = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

export const getDatesRange = (d1: number, d2: number): Date[] => {
  const days = [];
  for (let i = d1; i < d2; i++) {
    const day = addDays(i);
    if (isWeekday(day)) days.push(day);
  }
  return days;
};

export const getDateTimestamps = (
  date: Date,
  shiftStart: number,
  shiftEnd: number
): Date[] => {
  date = new Date(date.setHours(shiftStart, 0, 0, 0));
  const ratio = 60 / CONSULTATION_MINS;
  const appointments = [];
  for (let i = 0; i < (shiftEnd - shiftStart) * ratio; i++) {
    appointments.push(addMinutes(date, i * CONSULTATION_MINS));
  }
  return appointments;
};
