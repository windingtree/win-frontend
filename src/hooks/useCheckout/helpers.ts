import { OfferIdAndQuantity } from '@windingtree/glider-types/dist/win';
import { getTotalRoomCountReducer } from 'src/utils/offers';
import { getGroupMode } from '../useAccommodationsAndOffers.tsx/helpers';
export type BookingModeType = 'group' | 'normal' | undefined;

/**
 * Get the id of a offer if only one offer is used for a booking.
 */
export const getOfferId = (offers: OfferIdAndQuantity[] | undefined) => {
  if (!offers) return;

  return offers.map(({ offerId }) => offerId)[0];
};

export const getBookingMode = (
  offers: OfferIdAndQuantity[] | undefined
): BookingModeType => {
  if (!offers) return undefined;

  const roomCount = offers.reduce(getTotalRoomCountReducer, 0);
  const isGroupMode = getGroupMode(roomCount);
  const bookingMode = isGroupMode ? 'group' : 'normal';
  return bookingMode;
};
