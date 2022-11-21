import {
  SearchResults,
  Offer,
  WinAccommodation
} from '@windingtree/glider-types/dist/win';
import axios from 'axios';
import { getPassengersBody } from '../utils/getPassengerBody';

import { getGroupMode, InvalidLocationError } from '../utils/accommodationHookHelper';
import { SearchTypeProps } from '../hooks/useAccommodationMultiple';
import { defaultSearchRadiusInMeters, backend } from '../config';
import { CoordinatesType } from 'src/utils/accommodation';

export interface AccommodationsAndOffersResponse {
  accommodations: Record<string, WinAccommodation>;
  offers: Record<string, Offer>;
  coordinates: CoordinatesType;
  latestQueryParams: SearchTypeProps;
  isGroupMode: boolean;
}
/**
 * This hook fetches accommodations and its related offers.
 * Take into consideration that errors thrown are displayed to the user.
 */
export async function fetchAccommodationsAndOffers({
  location,
  arrival,
  departure,
  roomCount,
  adultCount,
  childrenCount
}: SearchTypeProps): Promise<AccommodationsAndOffersResponse> {
  /**
   * Query the coordinates based on the location input of the user.
   * Coordinates are used to query the accommodations.
   */
  const { data: coordinatesData } = await axios
    //TODO: include endpoint in .env or config
    .get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
    .catch((_) => {
      throw new Error(
        `Something went wrong when retrieving the coordinates of ${location}. Please try again.`
      );
    });

  const coordinates = coordinatesData[0];

  if (!coordinates) {
    throw new InvalidLocationError(
      `We could not find ${location} as a city, region or country. Try a different location.`
    );
  }

  const normalizedCoordinates: CoordinatesType = {
    lat: Number(coordinates.lat),
    lon: Number(coordinates.lon)
  };

  const passengersBody = getPassengersBody(adultCount, childrenCount);

  const derbySoftBody = {
    accommodation: {
      location: {
        ...normalizedCoordinates,
        radius: defaultSearchRadiusInMeters
      },
      arrival,
      departure,
      roomCount
    },

    passengers: passengersBody
  };

  const isGroupMode = getGroupMode(roomCount);
  const baseUri = backend.url;
  const searchPath = isGroupMode ? '/api/groups/search' : '/api/hotels/offers/search';

  const uri = baseUri + searchPath;
  const { data } = await axios
    .post<SearchResults>(uri, derbySoftBody, { withCredentials: true })
    .catch(() => {
      return {
        data: {
          accommodations: {},
          offers: {}
        }
      };
    });

  if (!data) {
    throw new Error('Something went wrong. Please try again.');
  }

  const accommodations = data.accommodations;
  const offers = data.offers;

  const latestQueryParams = {
    location,
    departure,
    arrival,
    roomCount,
    adultCount,
    childrenCount
  };

  return {
    accommodations,
    offers,
    coordinates: normalizedCoordinates,
    latestQueryParams,
    isGroupMode
  };
}
