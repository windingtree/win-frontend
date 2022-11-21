import { MediaItem, Offer, WinAccommodation } from '@windingtree/glider-types/dist/win';
import { AccommodationWithId } from './accommodationHookHelper';
import { OfferRecord } from 'src/store/types';
import { PriceRange } from '../hooks/useAccommodationMultiple';
import { isPriceRangeWithinPriceRange } from './price';

export interface CoordinatesType {
  lat: number;
  lon: number;
}

export const sortByLargestImage = (images: MediaItem[]) => {
  return images.sort((itemOne: MediaItem, itemTwo: MediaItem) => {
    return Number(itemTwo.width) - Number(itemOne.width);
  });
};

export const getLargestImages = (sortedImages: MediaItem[], limit = 50) => {
  let largestSize;
  const largestImages: MediaItem[] = [];

  // if array is empty
  if (!sortedImages.length) return largestImages;

  for (let index = 0; index < limit; index++) {
    const image = sortedImages[index];
    if (!image) continue;

    // assign the largest size on first iteration
    if (!largestSize) largestSize = image.width;

    // if largest size changes (smaller image) exit loop
    if (image.width !== largestSize) break;

    largestImages.push(image);
  }

  return largestImages;
};

export const buildAccommodationAddress = (
  accommodation: AccommodationWithId | WinAccommodation | undefined
) => {
  if (!accommodation) return;
  return [
    accommodation.contactInformation?.address?.streetAddress,
    accommodation.contactInformation?.address?.locality,
    accommodation.contactInformation?.address?.premise,
    accommodation.contactInformation?.address?.country
  ]
    .filter(Boolean)
    .join(', ');
};

export const sortAccommodationOffersByPrice = (
  accommodation: AccommodationWithId
): OfferRecord[] => {
  return [...accommodation.offers].sort((prevOffer, nextOffer) => {
    return Number(prevOffer.price.public) - Number(nextOffer.price.public);
  });
};

export const isAccommodationWithinPriceRanges = (
  accommodation: AccommodationWithId,
  ...priceRanges: PriceRange[]
): boolean => {
  if (!accommodation.priceRange) return false;
  return priceRanges.some((priceRange) => {
    return isPriceRangeWithinPriceRange(
      accommodation.preferredCurrencyPriceRange ??
        (accommodation.priceRange as PriceRange),
      priceRange
    );
  });
};

export const filterAccommodationsByPriceRanges = (
  accommodations: AccommodationWithId[],
  ...priceRange: PriceRange[]
) => {
  if (!priceRange.length) return accommodations;
  return accommodations.filter((accommodation) => {
    return isAccommodationWithinPriceRanges(accommodation, ...priceRange);
  });
};

export const getAccommodationByProviderId = (
  accommodations: Record<string, WinAccommodation>,
  providerId?: string
) => {
  const array = Object.values(accommodations);

  const accommodation = array.find((item) => item.providerHotelId === providerId);
  return accommodation;
};

export const getAccommodationByHotelId = (accommodations, hotelId: string) =>
  accommodations.find((a) => a.hotelId === hotelId);

export const getAccommodationById = (
  accommodations: AccommodationWithId[],
  id: string
): AccommodationWithId | null => {
  if (!id) return null;

  const selectedAccommodation =
    accommodations.find((accommodation) => accommodation.id === id) ?? null;

  return selectedAccommodation;
};

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
