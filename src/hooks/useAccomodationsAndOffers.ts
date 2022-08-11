import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type SearchType = {
  location: string;
  date: [string, string];
  roomCount: number;
  adultCount: number;
  childrenCount: number;
};

export enum PassengerType {
  child = 'CHD',
  adult = 'ADT'
}

async function fetchAccomodations({
  location,
  date,
  roomCount,
  adultCount,
  childrenCount
}) {
  const { data } = await axios.get(
    `   https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );

  const coordinates = data?.[0];

  //TODO: include errors with descript of the type of error.
  if (!coordinates) {
    throw Error('Could not find place');
  }

  const normalizedCordinates = {
    lat: Number(coordinates?.lat),
    lon: Number(coordinates.lon)
  };

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
    passengers: [
      {
        type: PassengerType.child,
        count: childrenCount
      },
      {
        type: PassengerType.adult,
        count: adultCount
      }
    ]
  };

  const uri = `https://test-win-backend-api.win.so/api/derby-soft/offers/search`;
  const { data: accomodationsData } = await axios.post(uri, derbySoftBody);

  const accomodations = accomodationsData?.data?.derbySoft?.data?.accomodations;
  const offers = accomodationsData?.data?.derbySoft?.offers;
  return { accomodations, offers };
}

export const useAccomodationsAndOffers = ({
  location,
  date,
  roomCount,
  adultCount,
  childrenCount
}: SearchType) => {
  const { data, refetch, error, isLoading } = useQuery(['search-accomodations'], () =>
    fetchAccomodations({ location, date, roomCount, adultCount, childrenCount })
  );

  return {
    refetch,
    data,
    error,
    isLoading
  };
};
