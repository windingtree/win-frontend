import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  filterAccommodationsByPriceRanges,
  getLargestImages,
  sortByLargestImage,
  CoordinatesType,
  getActiveAccommodations,
  getAccommodationById
} from '../utils/accommodation';
import { daysBetween } from '../utils/date';
import { filterOffersByPriceRanges } from '../utils/offers';
import { usePriceFilter } from '../hooks/usePriceFilter';
import { useUserSettings } from '../hooks/useUserSettings';
import {
  AccommodationsAndOffersResponse,
  fetchAccommodationsAndOffers,
  InvalidSearchParamsError
} from '../api/AccommodationsAndOffers';
import {
  AccommodationWithId,
  getOffersPriceRange
} from '../utils/accommodationHookHelper';
import { Offer, WinAccommodation } from '@windingtree/glider-types/dist/win';
import { getOffersWithRoomInfo, sortOffersByPrice } from 'src/utils/offers';
import { OfferRecord } from '../store/types';
import { CurrencyCode, useCurrencies } from '../hooks/useCurrencies';
import { offerExpirationTime } from 'src/config';
import Logger from '../utils/logger';

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
  searchResultsCenter?: CoordinatesType;
};

export type AccommodationTransformFn = (
  params: AccommodationTransformFnParams
) => AccommodationWithId;

export const useAccommodationMultiple = ({
  searchProps,
  accommodationTransformFn
}: {
  searchProps?: SearchTypeProps | void;
  accommodationTransformFn?: AccommodationTransformFn;
} = {}) => {
  const { convertPriceCurrency } = useCurrencies();
  const { preferredCurrencyCode } = useUserSettings();
  const { priceFilter } = usePriceFilter();
  const logger = Logger('fetchAccommodationAndOffers');
  const { data, refetch, error, isInitialLoading, isFetching, isFetched } = useQuery<
    AccommodationsAndOffersResponse | undefined,
    Error
  >(
    ['accommodations-and-offers'],
    async () => {
      if (!searchProps) {
        return;
      }
      try {
        return await fetchAccommodationsAndOffers(searchProps);
      } catch (error) {
        if (error instanceof InvalidSearchParamsError) {
          logger.error(error.message);
          throw error;
        }
      }
    },
    {
      enabled: false,
      keepPreviousData: false,
      cacheTime: offerExpirationTime,
      refetchInterval: offerExpirationTime,
      staleTime: offerExpirationTime
    }
  );

  // attach price in preferred currency to array of offers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getOffersWithPreferredCurrency = (
    offers: OfferRecord[],
    preferredCurrencyCode: CurrencyCode
  ): OfferRecord[] => {
    return offers.map((offer) => {
      const preferredCurrencyPrice = convertPriceCurrency({
        price: offer.price,
        targetCurrency: preferredCurrencyCode,
        amount: 1
      });

      return { ...offer, preferredCurrencyPrice };
    });
  };

  const normalizeOffers = useCallback(
    (
      offers: Record<string, Offer> | undefined,
      accommodations: Record<string, WinAccommodation> | undefined
    ): OfferRecord[] => {
      if (!offers) return [];

      const offersArray = Object.entries(offers).map<OfferRecord>(([key, value]) => ({
        id: key,
        ...value
      }));

      let offersWithOptionalPreferredCurrency: OfferRecord[];

      if (preferredCurrencyCode) {
        offersWithOptionalPreferredCurrency = getOffersWithPreferredCurrency(
          offersArray,
          preferredCurrencyCode
        );
      } else {
        offersWithOptionalPreferredCurrency = offersArray;
      }

      const offersWithRoomInfo = getOffersWithRoomInfo(
        offersWithOptionalPreferredCurrency,
        accommodations
      );

      const sortedOffers = sortOffersByPrice(offersWithRoomInfo);

      return sortedOffers;
    },
    [preferredCurrencyCode, getOffersWithPreferredCurrency]
  );

  // normalize accommodations hook
  const normalizeAccommodations = useCallback(
    (
      accommodations: Record<string, WinAccommodation> | undefined,
      offers: Record<string, Offer> | undefined
    ): AccommodationWithId[] => {
      if (!accommodations) return [];
      const normalizedOffers = offers ? normalizeOffers(offers, accommodations) : [];

      const normalizedAccommodations = Object.entries(
        accommodations
      ).map<AccommodationWithId>(([keyA, valueA]) => {
        const filteredOffers = normalizedOffers.filter((offer) =>
          Object.entries(offer.pricePlansReferences)
            .map(([, valueP]) => valueP.accommodation === keyA)
            .includes(true)
        );

        return {
          ...valueA,
          id: keyA,
          offers: filteredOffers
        };
      });

      return normalizedAccommodations;
    },
    [normalizeOffers]
  );

  const latestQueryParams = data?.latestQueryParams;

  // append focusedEvent query params if it exists
  if (latestQueryParams && searchProps?.focusedEvent) {
    latestQueryParams.focusedEvent = searchProps.focusedEvent;
  }

  const isGroupMode = data?.isGroupMode ?? false;

  const normalizedAccommodations = useMemo(
    () => normalizeAccommodations(data?.accommodations, data?.offers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, preferredCurrencyCode]
  );

  // Get accommodations with active offer along with the offer with lowest price/room/night
  // and an optional "accommodation" object transformation via
  // a transformation callback function
  const allAccommodations = useMemo(() => {
    // This includes accommodations with active offers.
    const filteredAccommodations = normalizedAccommodations.filter(
      (a) => a.offers.length > 0
    );

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
        true,
        true,
        false,
        numberOfDays,
        nbRooms
      );

      const preferredCurrencyPriceRange = getOffersPriceRange(
        accommodation.offers,
        true,
        true,
        true,
        numberOfDays,
        nbRooms
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
  }, [
    normalizedAccommodations,
    latestQueryParams,
    isGroupMode,
    accommodationTransformFn,
    data?.coordinates
  ]);

  // apply price filter to accommodations if any before returning accommodations
  const accommodations = useMemo(() => {
    return filterAccommodationsByPriceRanges(allAccommodations, ...priceFilter);
  }, [priceFilter, allAccommodations]);

  // all normalized offers prior to filtering
  const allOffers = useMemo(
    () => data?.offers && normalizeOffers(data.offers, data.accommodations),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, preferredCurrencyCode, normalizeOffers]
  );

  // filter offers array by price from price filter
  const offers = useMemo(
    () => (allOffers && filterOffersByPriceRanges(allOffers, ...priceFilter)) || [],
    [allOffers, priceFilter]
  );

  return {
    normalizeOffers,
    getAccommodationById,
    allAccommodations,
    accommodations,
    activeAccommodations: getActiveAccommodations(accommodations, offers),
    coordinates: data?.coordinates,
    allOffers,
    offers,
    refetch,
    error,
    isLoading: isInitialLoading,
    isFetching,
    latestQueryParams,
    isFetched,
    isGroupMode
  };
};
