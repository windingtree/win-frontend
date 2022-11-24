import { DateTime } from 'luxon';

export const convertToLocalTime = (date: Date): Date => {
  const newDate = new Date(date);
  const formattedDate = DateTime.fromObject({
    year: newDate.getFullYear(),
    month: newDate.getMonth() + 1, //js month starts from 0
    day: newDate.getDate(),
    hour: 0,
    minute: 0
  }).setZone('utc');
  const isoDate = new Date(formattedDate.toISO());

  return isoDate;
};

export type NullableDate = Date | null | undefined;

export const daysBetween = (fromDate: NullableDate, toDate: NullableDate): number => {
  if (!fromDate || !toDate) return -1;
  return (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 24 * 3600);
};

export const getIsToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
};

export const getIsInPast = (date: Date): boolean => {
  const today = new Date();

  // This line sets the hour of the current date to midnight
  // so the comparison only returns `true` if the passed in date is at least yesterday
  today.setHours(0, 0, 0, 0);

  return date < today;
};

export const getFormattedDate = (date: Date | string) => {
  return DateTime.fromJSDate(new Date(date)).toFormat('ccc, LLL d, yyyy');
};

export const getFormattedBetweenDate = (
  startDate: Date | string,
  endDate: Date | string
) => {
  const startDay = DateTime.fromJSDate(new Date(startDate)).toFormat('d');
  const endDay = DateTime.fromJSDate(new Date(endDate)).toFormat('d');
  const month = DateTime.fromJSDate(new Date(endDate)).toFormat('LLL');

  return `${startDay}-${endDay} ${month}`;
};

export const isDatesSameDay = (date1: Date, date2: Date): boolean => {
  if (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  ) {
    return true;
  }

  return false;
};
