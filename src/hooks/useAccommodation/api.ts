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
    .get<WinAccommodation>(`/accommodations/${id}`)
    .catch((_) => {
      throw new Error('Something went wrong. Please try again.');
    });

  if (!data.hotelId) {
    throw new Error('Something went wrong. Please try again.');
  }

  const accommodation = data;

  return {
    accommodation
  };
}

export const fetchOffers = async ({
  id,
  searchProps
}: {
  id: string;
  searchProps: SearchPropsType;
}): Promise<OfferResponseType> => {
  const { arrival, departure, roomCount, adultCount, childrenCount } = searchProps;
  const passengersBody = getPassengersBody(adultCount, childrenCount);

  const requestBody = {
    accommodation: {
      arrival,
      departure,
      roomCount
    },

    passengers: passengersBody
  };

  const { data } = await winClient
    .post<SearchResults>(`/accommodations/${id}`, requestBody)
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
    childrenCount
  };

  return {
    latestQueryParams,
    offers: data.offers
  };
};
