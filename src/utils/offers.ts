import {
  OfferIdAndQuantity,
  RefundabilityPolicy
} from '@windingtree/glider-types/dist/win';
import { OfferFormType } from 'src/containers/facility/GroupBooking/FacilityGroupOffers';

export const getTotalRoomCountReducer = (
  prev: number,
  current: OfferFormType | OfferIdAndQuantity
): number => Number(current.quantity) + prev;

export const getIsRefundable = (refundableType: RefundabilityPolicy['type']) => {
  if (refundableType === 'refundable_with_deadline') return true;
  false;
};
