import { OfferIdAndQuantity } from '@windingtree/glider-types/dist/win';
import { OfferFormType } from 'src/containers/facility/GroupBooking/FacilityGroupOffers';

export const getTotalRoomCountReducer = (
  prev: number,
  current: OfferFormType | OfferIdAndQuantity
): number => Number(current.quantity) + prev;
