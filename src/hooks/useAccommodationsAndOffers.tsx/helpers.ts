import { WinAccommodation, Offer } from '@windingtree/glider-types/dist/win';
import { OfferRecord } from 'src/store/types';
import { AccommodationTransformFn, EventInfo, LowestPriceFormat } from '.';
import { getActiveEventsWithinRadius } from '../../utils/events';
import { crowDistance } from '../../utils/geo';

enum PassengerType {
  child = 'CHD',
  adult = 'ADT'
}

export interface AccommodationWithId extends WinAccommodation {
  id: string;
  offers: OfferRecord[];
  lowestPrice?: LowestPriceFormat;
  eventInfo?: EventInfo[];
}

export class InvalidLocationError extends Error {}

export const getActiveAccommodations = (
  accommodations: WinAccommodation[],
  offers: Offer[]
) => {
  if (!accommodations || !offers) return [];

  const idsActiveAccommodations = offers?.map((offer) => {
    const accommodationId = Object.keys(offer.pricePlansReferences)[0];
    return accommodationId;
  });

  const uniqueIdsActiveAccommodations = [...new Set(idsActiveAccommodations)];

  const activeAccommodations = accommodations.filter((accommodation) => {
    return uniqueIdsActiveAccommodations.includes(accommodation.id as string);
  });

  return activeAccommodations;
};

export const normalizeAccommodations = (
  accommodations: Record<string, WinAccommodation> | undefined,
  offers: Record<string, Offer> | undefined
): AccommodationWithId[] => {
  if (!accommodations) return [];
  const normalizedOffers = offers ? normalizeOffers(offers) : [];

  const normalizedAccommodations = Object.entries(
    accommodations
  ).map<AccommodationWithId>(([keyA, valueA]) => {
    const filteredOffers = normalizedOffers.filter((offer) =>
      Object.entries(offer.pricePlansReferences)
        .map(([, valueP]) => valueP.accommodation === keyA)
        .includes(true)
    );

    return {
      ...valueA,
      id: keyA,
      offers: filteredOffers
    };
  });

  return normalizedAccommodations;
};

export const normalizeOffers = (offers: Record<string, Offer>): OfferRecord[] => {
  if (!offers) return [];

  const normalizedData = Object.entries(offers).map<OfferRecord>(([key, value]) => ({
    id: key,
    ...value
  }));

  return normalizedData;
};

export const getPassengersBody = (
  adultCount: number,
  childrenCount: number | undefined
) => {
  const adults = {
    type: PassengerType.adult,
    count: adultCount
  };
  const passengers = [adults];

  if (childrenCount && childrenCount != 0) {
    const children = {
      type: PassengerType.child,
      count: childrenCount,
      childrenAges: Array.from({ length: childrenCount }, () => 12)
    };
    passengers.push(children);
  }

  return passengers;
};

export const getOffersById = (
  offers: OfferRecord[],
  accommodationId: string
): OfferRecord[] => {
  if (!accommodationId) return [];

  const matchedOffers = offers.filter((offer) => {
    return accommodationId === Object.keys(offer.pricePlansReferences)[0];
  });

  return matchedOffers;
};

export const getAccommodationById = (
  accommodations: AccommodationWithId[],
  id: string
): AccommodationWithId | null => {
  if (!id) return null;

  const selectedAccommodation =
    accommodations.find((accommodation) => accommodation.id === id) ?? null;

  return selectedAccommodation;
};

// function to transform accommodation object to include distance/time from chosen event
export const accommodationEventTransform =
  (focusedEvent: string): AccommodationTransformFn =>
  ({ accommodation, searchProps, searchResultsCenter }) => {
    // return if no search props
    if (!searchProps) return accommodation;

    const { arrival, departure } = searchProps;

    const currentEvents = getActiveEventsWithinRadius({
      fromDate: arrival,
      toDate: departure,
      focusedEvent,
      center: searchResultsCenter
    });

    const { focusedEventItem = null, currentEventsWithinRadius } = currentEvents ?? {};

    const focusedEventCoordinates = focusedEventItem?.latlon && [
      focusedEventItem.latlon[0],
      focusedEventItem.latlon[1]
    ];

    const eventInfo: EventInfo[] | undefined = [];
    if (focusedEventCoordinates) {
      const distance = crowDistance(
        accommodation.location.coordinates[1],
        accommodation.location.coordinates[0],
        focusedEventCoordinates[0],
        focusedEventCoordinates[1]
      );

      // return eventInfo as an array of distances with focusedEventInfo at the top if it exists
      const durationInMinutes = (distance / 5) * 60; // we are assuming 5km/hr walking distance in minutes
      eventInfo.push({ distance, eventName: focusedEvent, durationInMinutes });
    }

    if (currentEventsWithinRadius && currentEventsWithinRadius.length) {
      const infos: EventInfo[] = [];

      for (let idx = 0; idx < currentEventsWithinRadius.length; idx++) {
        const event = currentEventsWithinRadius[idx];

        const eventCoordinates = event?.latlon && [event.latlon[0], event.latlon[1]];

        if (eventCoordinates) {
          const distance = crowDistance(
            accommodation.location.coordinates[1],
            accommodation.location.coordinates[0],
            eventCoordinates[0],
            eventCoordinates[1]
          );

          // return eventInfo as an array of distances with focusedEventInfo at the top if it exists

          const durationInMinutes = (distance / 5) * 60; // we are assuming 5km/hr walking distance in minutes
          infos.push({ distance, eventName: event.name, durationInMinutes });
        }
      }

      // sort by distance with nearest events first
      infos.sort((a, b) => a.distance - b.distance);

      // update eventInfo array with focusedEvent at top and other events in ascending distance
      eventInfo.push(...infos);
    }

    return { ...accommodation, eventInfo };
  };

export const getGroupMode = (roomCount: number | string | undefined): boolean => {
  if (process.env.REACT_APP_DISABLE_FEATURES === 'true') return false;
  if (roomCount === undefined) false;
  const numRoomCount = Number.isNaN(roomCount) ? 0 : Number(roomCount);
  return numRoomCount > 9;
};
