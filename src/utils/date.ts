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

export const daysBetween = (fromDate: NullableDate, toDate?: NullableDate): number => {
  if (!fromDate || !toDate) return -1;
  return (toDate.getTime() - fromDate.getTime())/(1000 * 24 * 3600);
}
