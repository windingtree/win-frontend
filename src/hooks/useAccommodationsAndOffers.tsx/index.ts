import { useQuery } from '@tanstack/react-query';
import { fetchAccommodationsAndOffers } from './api';
import { getActiveAccommodations, normalizeAccommodations } from './helpers';

// TODO: mention that it is an object or undefined
type SearchType = {
  location?: string;
  date?: [string, string];
  roomCount?: number;
  adultCount?: number;
  childrenCount?: number;
};

export const useAccommodationsAndOffers = (props: SearchType) => {
  const { data, refetch, error, isLoading, isFetching } = useQuery(
    ['search-accommodations'],
    async () => {
      const result = await fetchAccommodationsAndOffers({
        location: props?.location,
        date: props?.date,
        roomCount: props?.roomCount,
        adultCount: props?.adultCount,
        childrenCount: props?.childrenCount
      });

      return result;
    },
    { enabled: false }
  );

  const accommodations = normalizeAccommodations(data?.accommodations);
  const offers = (data?.offers && Object.values(data.offers)) || [];

  const getAccommodationById = (id) => {
    if (!id) return null;

    const selectedAccommodation = accommodations?.find(
      (accommodation) => accommodation.id
    );

    return selectedAccommodation;
  };

  const getOffersById = (accommodationId) => {
    if (!accommodationId) return null;

    const matchedOffers = offers?.filter((offer) => {
      return accommodationId === offer?.accomodation?.id;
    });

    return matchedOffers;
  };

  return {
    getOffersById,
    getAccommodationById,
    accommodations,
    activeAccommodations: getActiveAccommodations(accommodations, offers),
    coordinates: data?.coordinates,
    offers: offers,
    refetch,
    data,
    error,
    isLoading,
    isFetching
  };
};
