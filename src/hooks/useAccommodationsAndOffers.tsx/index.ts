import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { daysBetween } from '../../utils/date';
import { fetchAccommodationsAndOffers } from './api';
import {
  getAccommodationById,
  getActiveAccommodations,
  normalizeAccommodations,
  normalizeOffers,
  getOffersById,
  AccommodationWithId
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

export type AccommodationTransformFn = (
  accommodation: AccommodationWithId,
  searchProps?: SearchTypeProps | void
) => AccommodationWithId;

export const useAccommodationsAndOffers = (
  props: SearchTypeProps | void,
  accommodationTransformFn?: AccommodationTransformFn
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
          price:
            Number(offer.price.public) /
            (numberOfDays * (latestQueryParams?.roomCount ?? 1)),
          currency: offer.price.currency
        }))
        .reduce((prevLowest, currentVal) =>
          prevLowest.price < currentVal.price ? prevLowest : currentVal
        );

      // optional accommodation transformation callback function
      // that can be used to modify or add properties to accomodation object
      let transformedAccommodation = accommodation;
      if (accommodationTransformFn && typeof accommodationTransformFn === 'function') {
        transformedAccommodation = accommodationTransformFn(
          accommodation,
          latestQueryParams
        );
      }

      return { ...transformedAccommodation, lowestPrice };
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
    getAccommodationByHotelId
  };
};
