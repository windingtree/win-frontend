import {
  Offer,
  SearchResults,
  WinAccommodation
} from '@windingtree/glider-types/dist/win';
import { winClient } from 'src/api/winClient';
import { SearchPropsType } from '.';
import { getPassengersBody } from '../useAccommodationsAndOffers/helpers';

export interface AccommodationResponseType {
  accommodation: WinAccommodation;
}

export interface OfferResponseType {
  offers: Record<string, Offer>;
  latestQueryParams: SearchPropsType;
}

export async function fetchAccommodation(id: string): Promise<AccommodationResponseType> {
  const { data } = await winClient
    .get<WinAccommodation>(`/api/accommodations/${id}`)
    .catch((_) => {
      throw new Error('Something went wrong. Please try again.');
    });

  if (!data.hotelId) {
    throw new Error('Something went wrong. Please try again.');
  }

  return { accommodation: data };
}

export const fetchOffers = async ({
  id,
  searchProps
}: {
  id: string;
  searchProps: SearchPropsType;
}): Promise<OfferResponseType> => {
  const { arrival, departure, roomCount, adultCount, childrenCount, location } =
    searchProps;
  const passengersBody = getPassengersBody(adultCount, childrenCount);

  const requestBody = {
    accommodation: {
      location: {
        ...location,
        radius: 1000
      },
      arrival,
      departure,
      roomCount
    },

    passengers: passengersBody
  };

  const { data } = await winClient
    .post<SearchResults>(`/api/accommodations/${id}`, requestBody)
    .catch((_) => {
      throw new Error('Something went wrong. Please try again.');
    });

  if (!data.offers) {
    throw new Error('Something went wrong. Please try again.');
  }

  const latestQueryParams = {
    departure,
    arrival,
    roomCount,
    adultCount,
    childrenCount,
    location
  };

  return {
    latestQueryParams,
    offers: data.offers
  };
};
