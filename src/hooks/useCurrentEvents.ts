import { useMemo } from 'react';
import { NullableDate } from '../utils/date';
import { getCurrentEvents, getEventsWithinRadius } from '../utils/events';
import { Coordinates } from './useAccommodationsAndOffers.tsx/api';

export interface CurrentEventsProps {
  fromDate?: NullableDate;
  toDate?: NullableDate;
  center?: Coordinates;
  radius?: number;
}

export const useCurrentEvents = ({
  fromDate = null,
  toDate = null,
  center,
  radius = 3
}: CurrentEventsProps) => {
  const result = useMemo(() => {
    const currentEvents =
      fromDate &&
      toDate &&
      // add 1 day swing
      getCurrentEvents({
        fromDate: new Date(new Date(fromDate).setDate(fromDate.getDate() - 1)),
        toDate: new Date(new Date(toDate).setDate(toDate.getDate() + 1))
      });

    const initialCenter: [number, number] = center
      ? [center.lat, center.lon]
      : [51.505, -0.09];

    const currentEventsWithinRadius =
      currentEvents && getEventsWithinRadius(currentEvents, initialCenter, radius);

    return currentEventsWithinRadius;
  }, [fromDate, toDate, center, radius]);

  return result;
};
