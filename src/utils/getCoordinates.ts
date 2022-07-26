import axios from 'axios';
import { CoordinatesType } from 'src/utils/accommodation';

export class InvalidLocationError extends Error {}

export const getCoordinates = async (location) => {
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

  return normalizedCoordinates;
};
