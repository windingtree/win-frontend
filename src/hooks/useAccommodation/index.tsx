import { useQuery } from '@tanstack/react-query';
import { CoordinatesType } from 'src/utils/accommodation';
import {
  AccommodationResponseType,
  fetchAccommodation,
  fetchOffers,
  OfferResponseType
} from './api';

export interface SearchPropsType {
  arrival: Date | null;
  departure: Date | null;
  roomCount: number;
  adultCount: number;
  childrenCount?: number;
  location: CoordinatesType;
}

export const useAccommodation = ({
  id,
  searchProps
}: {
  id: string | undefined;
  searchProps?: SearchPropsType;
}) => {
  const accommodationQuery = useQuery<AccommodationResponseType | undefined, Error>(
    ['accommodation-details', id],
    async () => {
      if (!id) return;
      return await fetchAccommodation(id);
    }
  );

  const offerExpirationTime = 25 * 60 * 1000;
  const offersQuery = useQuery<OfferResponseType | undefined, Error>(
    ['accommodation-offers', id, searchProps],
    async () => {
      if (!id || !searchProps) return;

      const { arrival, departure, roomCount, adultCount } = searchProps;

      if (!arrival || !departure || !roomCount || !adultCount) return;
      return await fetchOffers({ id, searchProps });
    },
    {
      //    TODO: get the offers from the cache
      // initialData: () => {
      //   const cache = queryClient.getQueryData(['accommodations-and-offers']) as
      //     | AccommodationsAndOffersResponse
      //     | undefined;

      // },
      cacheTime: offerExpirationTime,
      refetchInterval: offerExpirationTime
    }
  );

  return { accommodationQuery, offersQuery };
};
