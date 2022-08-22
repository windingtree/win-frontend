import { SearchResults, Offer, Accommodation } from '@windingtree/glider-types/types/win';
import axios from 'axios';
import { getPassengersBody } from './helpers';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface FetchAccommodationsAndOffersProps {
  location: string;
  date: string[];
  roomCount: number;
  adultCount: number;
  childrenCount: number;
}

export interface AccommodationsAndOffersResponse {
  accommodations: Record<string, Accommodation>;
  offers: Record<string, Offer>;
  coordinates: Coordinates;
}

export async function fetchAccommodationsAndOffers({
  location,
  date,
  roomCount,
  adultCount,
  childrenCount
}: FetchAccommodationsAndOffersProps): Promise<AccommodationsAndOffersResponse> {
  /**
   * Query the coordinates based on the location input of the user.
   * Coordinates are used to query the accommodations.
   */
  const { data: coordinatesData } = await axios
    //TODO: include endpoint in .env or config
    .get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
    .catch((_) => {
      throw new Error(`Unable to get coordinates for location: ${location}`);
    });

  const coordinates = coordinatesData[0];

  if (!coordinates) {
    throw new Error('Coordinates not found in the OSM response');
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
      arrival: date[0],
      departure: date[1],
      roomCount
    },

    //TODO: include children
    passengers: passengersBody
  };

  //TODO: include url in env
  const uri = `${process.env.REACT_APP_API_URL}/api/hotels/offers/search`;
  const { data } = await axios.post<SearchResults>(uri, derbySoftBody).catch((_) => {
    throw new Error('Unexpected response when retrieving accommodations and offers');
  });

  if (!data) {
    throw new Error('Invalid API response');
  }

  const accommodations = data.accommodations;
  const offers = data.offers;

  return { accommodations, offers, coordinates: normalizedCoordinates };
}
