import { useQuery } from '@tanstack/react-query';
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
}

export const useAccommodation = ({
  id,
  searchProps
}: {
  id: string;
  searchProps?: SearchPropsType;
}) => {
  const accommodationQuery = useQuery<AccommodationResponseType | undefined, Error>(
    ['accommodation-details', id],
    async () => {
      return await fetchAccommodation(id);
    }
  );

  const offerExpirationTime = 25 * 60 * 1000;
  const offersQuery = useQuery<OfferResponseType | undefined, Error>(
    ['accommodation-offers'],
    async () => {
      if (!searchProps) return;
      return await fetchOffers({ id, searchProps });
    },
    {
      cacheTime: offerExpirationTime,
      refetchInterval: offerExpirationTime
    }
  );

  return { accommodationQuery, offersQuery };
};
