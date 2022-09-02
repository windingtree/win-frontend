import { SearchResults, Offer, Accommodation } from '@windingtree/glider-types/types/win';
import axios from 'axios';
import { getPassengersBody } from './helpers';
import { SearchTypeProps } from '.';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface AccommodationsAndOffersResponse {
  accommodations: Record<string, Accommodation>;
  offers: Record<string, Offer>;
  coordinates: Coordinates;
  latestQueryParams: SearchTypeProps;
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
    throw new Error(
      `We could not find ${location} as a city, region or country. Try a different location.`
    );
  }

  const normalizedCoordinates: Coordinates = {
    lat: Number(coordinates.lat),
    lon: Number(coordinates.lon)
  };

  const passengersBody = getPassengersBody(adultCount, childrenCount);

  const derbySoftBody = {
    accommodation: {
      location: {
        ...normalizedCoordinates,
        radius: 20000
      },
      arrival,
      departure,
      roomCount
    },

    passengers: passengersBody
  };

  const uri = `${process.env.REACT_APP_API_URL}/api/hotels/offers/search`;
  const { data } = await axios.post<SearchResults>(uri, derbySoftBody).catch(() => {
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
    latestQueryParams
  };
}
