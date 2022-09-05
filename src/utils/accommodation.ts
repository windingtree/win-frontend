import { MediaItem } from '@windingtree/glider-types/types/win';
import { AccommodationWithId } from '../hooks/useAccommodationsAndOffers.tsx/helpers';

export const sortByLargestImage = (images: MediaItem[]) =>
  images.sort((itemOne: MediaItem, itemTwo: MediaItem) => {
    return Number(itemTwo.width) - Number(itemOne.width);
  });

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

export const buildAccommodationAddress = (accommodation: AccommodationWithId | null) => {
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
