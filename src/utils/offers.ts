import { RefundabilityPolicy, RoomTypes } from '@windingtree/glider-types/dist/win';
import { OfferCheckoutType } from 'src/containers/facility/FacilityOffers/FacilityOffersSelectMultiple';
import { AccommodationWithId } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { OfferRecord } from 'src/store/types';

export const getTotalRoomCountReducer = (
  prev: number,
  current: OfferCheckoutType | OfferCheckoutType
): number => Number(current.quantity) + prev;

export const getIsRefundable = (
  refundableType: RefundabilityPolicy['type'] | undefined
) => {
  if (refundableType === 'refundable_with_deadline') return true;
  false;
};

export const getRoomOfOffer = (
  accommodation: AccommodationWithId,
  offer: OfferRecord
): RoomTypes => {
  const accommodationOfOffer = Object.values(offer.pricePlansReferences)[0];
  const roomId: string = accommodationOfOffer?.roomType || '';
  const rooms = accommodation?.roomTypes || {};
  const matchedRoomWithOffer = rooms[roomId];
  return matchedRoomWithOffer;
};
