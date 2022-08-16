export enum PassengerType {
  child = 'CHD',
  adult = 'ADT'
}

export const getActiveAccommodations = (accommodations, offers) => {
  if (!accommodations || !offers) return [];

  const idsActiveAccomodations = offers?.map((offer) => {
    const accommodationId = Object.keys(offer?.pricePlansReferences)[0];
    return accommodationId;
  });

  const uniqueIdsActiveAccomodations = [...new Set(idsActiveAccomodations)];

  const activeAccommodations = accommodations.filter((accommodation) => {
    return uniqueIdsActiveAccomodations?.includes(accommodation.id);
  });

  return activeAccommodations;
};

export const normalizeAccommodations = (accommodations) => {
  if (!accommodations) return [];

  const normalizedData = Object.entries(accommodations).map(([key, value]) => ({
    id: key,
    ...value
  }));

  return normalizedData;
};

export const getPassengersBody = (adultCount, childrenCount) => {
  const adults = [
    {
      type: PassengerType.adult,
      count: adultCount
    }
  ];

  return adults;
};

export const getOffersById = (offers, accommodationId) => {
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
