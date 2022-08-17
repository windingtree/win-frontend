import axios from 'axios';
import { getPassengersBody } from './helpers';

export async function fetchAccommodationsAndOffers({
  location,
  date,
  roomCount,
  adultCount,
  childrenCount
}) {
  /**
   * Query the coordinates based on the location input of the user.
   * Coordinates are used to query the accommodations.
   */
  const { data: coordinatesData } = await axios
    //TODO: include endpoint in .env or config
    .get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
    .catch((_) => {
      throw new Error('Unexpected response when retrieving coordinates');
    });

  const coordinates = coordinatesData?.[0];

  if (!coordinates) {
    throw new Error('Unexpected response when retrieving coordinates');
  }

  const normalizedCordinates = {
    lat: Number(coordinates?.lat),
    lon: Number(coordinates.lon)
  };

  const passengersBody = getPassengersBody(adultCount, childrenCount);

  const derbySoftBody = {
    accommodation: {
      location: {
        lon: normalizedCordinates.lon,
        lat: normalizedCordinates.lat,
        radius: 20000
      },
      arrival: date[0],
      departure: date[1],
      roomCount: roomCount
    },

    //TODO: include children
    passengers: passengersBody
  };

  //TODO: include url in env
  const uri = `${process.env.REACT_APP_API_URL}/api/derby-soft/offers/search`;
  const { data } = await axios.post(uri, derbySoftBody).catch((_) => {
    throw new Error('Unexpected response when retrieving accomodations and offers');
  });

  if (!data?.data?.derbySoft) {
    throw new Error('Unexpected response when retrieving accomodations and offers');
  }

  const accommodations = data?.data?.derbySoft?.data?.accommodations;
  const offers = data?.data?.derbySoft?.data?.offers;

  return { accommodations, offers, coordinates: normalizedCordinates };
}
