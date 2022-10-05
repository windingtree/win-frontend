import { OfferRecord } from 'src/store/types';
import type { OfferFormType } from './GroupBooking/FacilityGroupOffers';

export const getSelectedOffers = (offers: OfferFormType[]) =>
  offers
    .filter((offer) => Number(offer.quantity) > 0)
    .map(({ id, quantity }) => ({
      offerId: id,
      quantity: Number(quantity)
    }));

export const getOffersWithQuantity = (
  offers: OfferRecord[] | null,
  roomCount: number
) => {
  if (!offers) return [];
  return offers?.map<OfferFormType>((offer, index) => {
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
