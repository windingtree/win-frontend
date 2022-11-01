import { MediaItem, WinAccommodation } from '@windingtree/glider-types/dist/win';
import { AccommodationWithId } from '../hooks/useAccommodationsAndOffers/helpers';
import { OfferRecord } from 'src/store/types';

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
