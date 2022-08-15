import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// TODO: mention that it is an object or undefined
type SearchType = {
  location?: string;
  date?: [string, string];
  roomCount?: number;
  adultCount?: number;
  childrenCount?: number;
};

export enum PassengerType {
  child = 'CHD',
  adult = 'ADT'
}

async function fetchAccommodationsAndOffers({
  location,
  date,
  roomCount,
  adultCount,
  childrenCount
}) {
  //TODO: split this up in a seperate function
  const { data: coordinatesData } = await axios.get(
    `   https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );

  const coordinates = coordinatesData?.[0];

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
    //TODO: include children count
    passengers: [
      {
        type: PassengerType.adult,
        count: adultCount
      }
    ]
  };

  const uri = `https://test-win-backend-api.win.so/api/derby-soft/offers/search`;
  const { data } = await axios.post(uri, derbySoftBody);

  // TODO: show generic error in the FE about that something went wrong
  if (!data?.data?.derbySoft) {
    throw Error('Unexpected response from the BE');
  }

  const accommodations = data?.data?.derbySoft?.data?.accommodations;
  const offers = data?.data?.derbySoft?.data?.offers;

  return { accommodations, offers, coordinates: normalizedCordinates };
}

//TODO: return active accomodations
const getActiveAccommodations = (accommodation, offers) => {
  return [];
};

// HOOK
export const useAccommodationsAndOffers = (props: SearchType) => {
  const { data, refetch, error, isLoading, isFetching } = useQuery(
    ['search-accommodations'],
    async () => {
      const result = await fetchAccommodationsAndOffers({
        location: props?.location,
        date: props?.date,
        roomCount: props?.roomCount,
        adultCount: props?.adultCount,
        childrenCount: props?.childrenCount
      });

      return result;
    }
  );

  const accommodations =
    (data?.accommodations && Object.values(data.accommodations)) || [];
  const offers = (data?.offers && Object.values(data.offers)) || [];

  const getAccommodationById = (id) => {
    if (!id) return null;

    const selectedAccommodation = accommodations?.find(
      (accommodation) => accommodation.id
    );

    return selectedAccommodation;
  };

  const getOffersById = (accommodationId) => {
    if (!accommodationId) return null;

    const matchedOffers = offers?.filter((offer) => {
      return accommodationId === offer?.accomodation?.id;
    });

    return matchedOffers;
  };

  return {
    getOffersById,
    getAccommodationById,
    accommodations,
    activeAccommodations: getActiveAccommodations(accommodations, offers),
    coordinates: data?.coordinates,
    offers: offers,
    refetch,
    data,
    error,
    isLoading,
    isFetching
  };
};
