import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { getLargestImages, sortByLargestImage } from '../../utils/accommodation';
import { daysBetween } from '../../utils/date';
import { useUserSettings } from '../useUserSettings';
import {
  AccommodationsAndOffersResponse,
  Coordinates,
  fetchAccommodationsAndOffers
} from './api';
import {
  getAccommodationById,
  getActiveAccommodations,
  normalizeAccommodations,
  normalizeOffers,
  getOffersById,
  AccommodationWithId,
  getOffersPriceRange
} from './helpers';

export interface SearchTypeProps {
  location: string;
  arrival: Date | null;
  departure: Date | null;
  roomCount: number;
  adultCount: number;
  childrenCount?: number;
  focusedEvent?: string;
}

export interface PriceFormat {
  price: number;
  currency: string;
  decimals?: number;
}

export interface PriceRange {
  lowestPrice: PriceFormat;
  highestPrice: PriceFormat;
}

export interface EventInfo {
  eventName: string;
  distance: number;
  durationInMinutes: number;
}

export type AccommodationTransformFnParams = {
  accommodation: AccommodationWithId;
  searchProps?: SearchTypeProps | void;
  searchResultsCenter?: Coordinates;
};

export type AccommodationTransformFn = (
  params: AccommodationTransformFnParams
) => AccommodationWithId;

export const useAccommodationsAndOffers = ({
  searchProps,
  accommodationTransformFn
}: {
  searchProps?: SearchTypeProps | void;
  accommodationTransformFn?: AccommodationTransformFn;
} = {}) => {
  const { preferredCurrencyCode } = useUserSettings();
  const { data, refetch, error, isLoading, isFetching, isFetched } = useQuery<
    AccommodationsAndOffersResponse | undefined,
    Error
  >(
    ['search-accommodations'],
    async () => {
      if (!searchProps) {
        return;
      }
      return await fetchAccommodationsAndOffers(searchProps);
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

  // append focusedEvent query params if it exists
  if (latestQueryParams && searchProps?.focusedEvent) {
    latestQueryParams.focusedEvent = searchProps.focusedEvent;
  }

  const isGroupMode = data?.isGroupMode ?? false;

  const allAccommodations = useMemo(
    () =>
      normalizeAccommodations(data?.accommodations, data?.offers, preferredCurrencyCode),
    [data, preferredCurrencyCode]
  );

  // Get accommodations with active offer along with the offer with lowest price/room/night
  // and an optional "accommodation" object transformation via
  // a transformation callback function
  const accommodations = useMemo(() => {
    // This includes accommodations with active offers.
    const filteredAccommodations = allAccommodations.filter((a) => a.offers.length > 0);

    const numberOfDays = daysBetween(
      latestQueryParams?.arrival,
      latestQueryParams?.departure
    );

    // attach extra properties to or transform accommodations
    const nbRooms = isGroupMode ? 1 : latestQueryParams?.roomCount ?? 1;
    return filteredAccommodations?.map((accommodation) => {
      // get price ranges in local and preferred currencies
      const priceRange = getOffersPriceRange(
        accommodation.offers,
        numberOfDays,
        nbRooms,
        false
      );
      const preferredCurrencyPriceRange = getOffersPriceRange(
        accommodation.offers,
        numberOfDays,
        nbRooms,
        true
      );

      // return only high res images
      accommodation.media = getLargestImages(
        sortByLargestImage(accommodation.media ?? [])
      );

      // optional accommodation transformation callback function
      // that can be used to modify or add properties to accommodation object
      let transformedAccommodation = accommodation;
      if (accommodationTransformFn && typeof accommodationTransformFn === 'function') {
        transformedAccommodation = accommodationTransformFn({
          accommodation,
          searchProps: latestQueryParams,
          searchResultsCenter: data?.coordinates
        });
      }

      return { ...transformedAccommodation, priceRange, preferredCurrencyPriceRange };
    });
  }, [allAccommodations, latestQueryParams]);

  const offers = useMemo(
    () => (data?.offers && normalizeOffers(data.offers, preferredCurrencyCode)) || [],
    [data, preferredCurrencyCode]
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
    isGroupMode
  };
};
