import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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
  date: [Date | null, Date | null];
  roomCount: number;
  adultCount: number;
  childrenCount?: number;
}

export const useAccommodationsAndOffers = (props: SearchTypeProps | void) => {
  const { data, refetch, error, isLoading, isFetching } = useQuery(
    ['search-accommodations'],
    async () => {
      if (!props) {
        return;
      }
      return await fetchAccommodationsAndOffers(props);
    },
    { enabled: false }
  );

  const allAccommodations = useMemo(
    () => normalizeAccommodations(data?.accommodations, data?.offers),
    [data]
  );

  // This includes accommodations with active offers.
  const accommodations = useMemo(
    () => allAccommodations.filter((a) => a.offers.length > 0),
    [allAccommodations]
  );

  const offers = useMemo(
    () => (data?.offers && normalizeOffers(data.offers)) || [],
    [data]
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
    latestQueryParams: data?.latestQueryParams
  };
};
