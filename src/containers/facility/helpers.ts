import { OfferRecord } from 'src/store/types';
import { OfferCheckoutType } from './GroupBooking/FacilityGroupOffers';

export const getSelectedOffers = (offers: OfferCheckoutType[]) =>
  offers.filter((offer) => Number(offer.quantity) > 0);

export const getOffersWithQuantity = (
  offers: OfferRecord[] | null,
  roomCount: number
) => {
  if (!offers) return [];
  return offers?.map<OfferCheckoutType>((offer, index) => {
    if (index === 0) {
      return {
        ...offer,
        quantity: roomCount ? roomCount.toString() : '0'
      };
    }

    return {
      ...offer,
      quantity: '0'
    };
  });
};
