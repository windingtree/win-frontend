import { Accommodation, Offer } from '@windingtree/glider-types/types/derbysoft';

enum PassengerType {
  child = 'CHD',
  adult = 'ADT'
}

export const getActiveAccommodations = (
  accommodations: Accommodation[],
  offers: Offer[]
) => {
  if (!accommodations || !offers) return [];

  const idsActiveAccomodations = offers?.map((offer) => {
    const accommodationId = Object.keys(offer?.pricePlansReferences)[0];
    return accommodationId;
  });

  const uniqueIdsActiveAccomodations = [...new Set(idsActiveAccomodations)];

  const activeAccommodations = accommodations.filter((accommodation) => {
    return uniqueIdsActiveAccomodations?.includes(accommodation.id as string);
  });

  return activeAccommodations;
};

export const normalizeAccommodations = (accommodations: Accommodation[]) => {
  if (!accommodations) return [];

  const normalizedData = Object.entries(accommodations).map(([key, value]) => ({
    id: key,
    ...value
  }));

  return normalizedData;
};

export const normalizeOffers = (offer: Offer[]) => {
  if (!offer) return [];

  const normalizedData = Object.entries(offer).map(([key, value]) => ({
    id: key,
    ...value
  }));

  return normalizedData;
};

export const getPassengersBody = (adultCount: number, childrenCount: number) => {
  const adults = {
    type: PassengerType.adult,
    count: adultCount
  };
  const passengers = [adults];

  if (childrenCount && childrenCount != 0) {
    const children = {
      type: PassengerType.child,
      count: childrenCount,
      childrenAges: Array.from({ length: childrenCount }, () => 13)
    };
    passengers.push(children);
  }

  return passengers;
};

export const getOffersById = (offers: Offer[], accommodationId: string) => {
  if (!accommodationId) return null;

  const matchedOffers = offers?.filter((offer) => {
    if (!offer?.pricePlansReferences) {
      console.warn('Unexpected data structure for Offers');
    }
    return accommodationId === Object.keys(offer?.pricePlansReferences)[0];
  });

  return matchedOffers;
};

export const getAccommodationById = (accommodations, id) => {
  if (!id) return null;

  const selectedAccommodation = accommodations?.find((accommodation) => accommodation.id);

  return selectedAccommodation;
};
