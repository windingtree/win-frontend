import { RefundabilityPolicy } from '@windingtree/glider-types/dist/win';
import { OfferCheckoutType } from 'src/containers/facility/GroupBooking/FacilityGroupOffers';

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
