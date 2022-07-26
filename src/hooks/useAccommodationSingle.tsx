import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getAccommodationAndOffersFromCache,
  getAccommodationFromCache
} from 'src/api/cache';
import { accommodationExpirationTime, offerExpirationTime } from 'src/config';
import { useUserSettings } from './useUserSettings';
import {
  AccommodationResponseType,
  fetchAccommodation,
  fetchOffers,
  OffersResponseType
} from '../api/AccommodationOffers';
import { useAccommodationMultiple } from './useAccommodationMultiple';
import { isOffersSearchPropsValid } from 'src/utils/accommodationHookHelper';

export interface SearchPropsType {
  arrival: Date | null;
  departure: Date | null;
  roomCount: number;
  adultCount: number;
  childrenCount?: number;
}

export interface useAccommodationSingleProps {
  id?: string;
  searchProps?: SearchPropsType;
}

export const useAccommodationSingle = (props: useAccommodationSingleProps) => {
  const { preferredCurrencyCode } = useUserSettings();
  const { normalizeOffers } = useAccommodationMultiple();
  const { id, searchProps } = props || {};

  const accommodationQuery = useQuery<AccommodationResponseType | undefined, Error>(
    ['accommodation-details', id],
    async () => {
      if (!id) return;

      return await fetchAccommodation(id);
    },
    {
      initialData: () => getAccommodationFromCache(id),
      staleTime: accommodationExpirationTime
    }
  );

  const offersQuery = useQuery<OffersResponseType | undefined, Error>({
    queryFn: async () => {
      if (!id || !searchProps) return undefined;

      if (!isOffersSearchPropsValid(searchProps)) return undefined;

      return await fetchOffers({ id, searchProps });
    },
    queryKey: ['accommodation-offers', id, searchProps],
    enabled: !!searchProps,
    initialData: () => getAccommodationAndOffersFromCache(id, searchProps),
    staleTime: offerExpirationTime,
    cacheTime: offerExpirationTime,
    refetchInterval: offerExpirationTime,
    keepPreviousData: true
  });

  const { data, ...restOffersQuery } = offersQuery;

  const { offers, ...restData } = data || {};

  const normalizedOffers = useMemo(
    () => data?.offers && normalizeOffers(offers, offersQuery.data?.accommodations),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, preferredCurrencyCode, normalizeOffers]
  );

  return {
    accommodationQuery,
    offersQuery: {
      data: { offers: normalizedOffers, ...restData },
      ...restOffersQuery
    }
  };
};
