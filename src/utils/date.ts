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
