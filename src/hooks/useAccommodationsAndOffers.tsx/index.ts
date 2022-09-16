import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { daysBetween } from '../../utils/date';
import { crowDistance } from '../../utils/geo';
import { useCurrentEvents } from '../useCurrentEvents';
import { fetchAccommodationsAndOffers } from './api';
import {
  getAccommodationById,
  getActiveAccommodations,
  normalizeAccommodations,
  normalizeOffers,
  getOffersById
} from './helpers';

export interface SearchTypeProps {
  location: string;
  arrival: Date | null;
  departure: Date | null;
  roomCount: number;
  adultCount: number;
  childrenCount?: number;
}

export interface LowestPriceFormat {
  price: number;
  currency: string;
  decimals?: number;
}

export interface EventInfo {
  eventName: string;
  distance: number;
  durationInMinutes: number;
}

export const useAccommodationsAndOffers = (
  props: SearchTypeProps | void,
  focusedEvent?: string | null
) => {
  const { data, refetch, error, isLoading, isFetching, isFetched } = useQuery(
    ['search-accommodations'],
    async () => {
      if (!props) {
        return;
      }
      return await fetchAccommodationsAndOffers(props);
    },
    {
      enabled: false,
      keepPreviousData: false,
      cacheTime: 25 * 60 * 1000, //25 min expiration
      refetchInterval: 25 * 60 * 1000, //25 min expiration
      staleTime: 25 * 60 * 1000 //25 min expiration
    }
  );

  const latestQueryParams = data?.latestQueryParams;

  const allAccommodations = useMemo(
    () => normalizeAccommodations(data?.accommodations, data?.offers),
    [data]
  );

  // determine from search url if there is a relevant area to focus
  let focusedEventCoordinates;

  // if search url contains a focusedEvent get the coordinates
  if (focusedEvent) {
    const currentEventsWithinRadius = useCurrentEvents({
      fromDate: latestQueryParams?.arrival,
      toDate: latestQueryParams?.departure,
      center: data?.coordinates
    });

    const targetEvent = currentEventsWithinRadius?.find(
      (evt) => evt.name === focusedEvent
    );

    if (targetEvent?.latlon) {
      focusedEventCoordinates = [targetEvent.latlon[0], targetEvent.latlon[1]];
    }
  }

  // This includes accommodations with active offers.
  const accommodations = useMemo(() => {
    const filteredAccommodations = allAccommodations.filter((a) => a.offers.length > 0);

    const numberOfDays = daysBetween(
      latestQueryParams?.arrival,
      latestQueryParams?.departure
    );

    // get offer with lowest price
    return filteredAccommodations?.map((accommodation) => {
      const lowestPrice: LowestPriceFormat = accommodation.offers
        .map((offer) => ({
          price: Number(offer.price.public) / numberOfDays,
          currency: offer.price.currency
        }))
        .reduce((prevLowest, currentVal) =>
          prevLowest.price < currentVal.price ? prevLowest : currentVal
        );

      let eventInfo: EventInfo | undefined;
      if (focusedEvent && focusedEventCoordinates) {
        const distance = crowDistance(
          accommodation.location.coordinates[1],
          accommodation.location.coordinates[0],
          focusedEventCoordinates[0],
          focusedEventCoordinates[1]
        );

        const durationInMinutes = (distance / 5) * 60; // we are assuming 5km/hr walking distance in minutes
        const eventName = focusedEvent;
        eventInfo = { distance, eventName, durationInMinutes };
      }

      return { ...accommodation, lowestPrice, eventInfo };
    });
  }, [allAccommodations, latestQueryParams]);

  const offers = useMemo(
    () => (data?.offers && normalizeOffers(data.offers)) || [],
    [data]
  );

  const getAccommodationByHotelId = useCallback(
    (hotelId: string) => accommodations.find((a) => a.hotelId === hotelId),
    [accommodations]
  );

  return {
    getOffersById,
    getAccommodationById,
    accommodations,
    activeAccommodations: getActiveAccommodations(accommodations, offers),
    coordinates: data?.coordinates,
    offers,
    refetch,
    error,
    isLoading,
    isFetching,
    latestQueryParams,
    isFetched,
    getAccommodationByHotelId,
    focusedEventCoordinates
  };
};
