import { DateTime } from 'luxon';
import { EventItemProps, upcomingEvents } from '../config';
import { crowDistance } from './geo';

export interface EventSearchParams {
  fromDate: Date;
  toDate: Date;
}

export const datesOverlap = (
  dateRange: EventSearchParams,
  targetDateRange: EventSearchParams
) => {
  const { fromDate: targetFromDate, toDate: targetToDate } = targetDateRange;
  return (
    (dateRange.fromDate <= targetFromDate && dateRange.toDate >= targetToDate) ||
    (dateRange.fromDate >= targetFromDate && dateRange.toDate >= targetToDate) ||
    (dateRange.fromDate <= targetFromDate && dateRange.toDate <= targetToDate)
  );
};

export const getCurrentEvents = (dateRange: EventSearchParams) => {
  return upcomingEvents.filter((evt) => {
    try {
      const eventFromDate = DateTime.fromFormat(
        evt.dateRange.fromDate,
        'd-MM-yyyy'
      ).toJSDate();
      const eventToDate = DateTime.fromFormat(
        evt.dateRange.toDate,
        'd-MM-yyyy'
      ).toJSDate();

      return datesOverlap(dateRange, { fromDate: eventFromDate, toDate: eventToDate });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing upcoming event: ${(error as Error).message}`);
      return false;
    }
  });
};

export const getEventsWithinRadius = (
  events: EventItemProps[],
  centerLatLon: [number, number],
  maxRadius = 3,
  useKm = true
) => {
  return events.filter((evt) => {
    return (
      evt.latlon &&
      crowDistance(
        evt.latlon[0],
        evt.latlon[1],
        centerLatLon[0],
        centerLatLon[1],
        useKm
      ) <= maxRadius
    );
  });
};
